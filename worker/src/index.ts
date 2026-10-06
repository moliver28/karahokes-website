// W1 consult-form backend: Cloudflare Worker + D1 + Email Routing.
//
// Replicates the semantics of the site's former Next.js API route
// (src/app/api/consult/route.ts, removed in the static-export conversion):
// same field set and error messages as the client's FormSchema, same
// honeypot-before-rate-limit ordering, same human 429 message, and a
// count-only GET. The browser client (consult-form.tsx) reads
// { ok, error, id } — that contract must not drift.
//
// CORS is applied to EVERY response (success and error, all methods):
// the browser reads the POST response itself, not just the preflight, so
// an error response without CORS headers would surface as an opaque
// network failure instead of the friendly error message.

import { z } from "zod";

const PRACTICE_PHONE_DISPLAY = "(253) 893-3585";

const NOTIFY_FROM = { name: "Kara Hokes Website", email: "website@karahokes.com" };
const NOTIFY_TO = "karahokes@gmail.com";

// Runtime surfaces used from wrangler.jsonc bindings. Declared locally so
// this subproject needs no generated type files; wrangler injects the real
// implementations at deploy/local-dev time.
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  first<T = unknown>(): Promise<T | null>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface RateLimiter {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}
interface EmailSender {
  send(message: {
    from: { name?: string; email: string };
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<{ messageId: string }>;
}

interface Env {
  DB: D1Database;
  form_limiter: RateLimiter;
  NOTIFY: EmailSender;
  FORM_ORIGIN: string;
}

// Mirror of src/components/consult-form.tsx FormSchema (field-for-field,
// exact same messages). Changing a form field means editing BOTH files and
// redeploying this Worker.
const ConsultSchema = z.object({
  name: z.string().min(2, "Please share your name (2+ characters)."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "text"], {
    message: "Select a preferred contact method.",
  }),
  availability: z.string().optional(),
  source: z
    .enum([
      "psychology-today",
      "search",
      "provider-referral",
      "insurance-directory",
      "social",
      "rather-not-say",
    ])
    .optional(),
  reason: z.string().max(1000, "Please keep this under 1000 characters.").optional(),
  company: z.string().optional(),
  consent: z.literal(true, {
    message: "Please acknowledge the consent statement to continue.",
  }),
});

// The one Response constructor. Everything the Worker returns goes through
// here so the CORS headers can never be forgotten on an error path.
// Access-Control-Allow-Origin is echoed ONLY for the site's own origin; a
// missing or foreign Origin gets the response WITHOUT the header, which the
// browser treats as a CORS rejection.
function respond(request: Request, env: Env, status: number, body: unknown): Response {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  });
  const origin = request.headers.get("Origin");
  if (origin !== null && origin === env.FORM_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  if (body === null) {
    return new Response(null, { status, headers });
  }
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers });
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return respond(request, env, 400, { ok: false, error: "Invalid request body." });
  }

  // Honeypot check comes BEFORE validation and the rate limiter on purpose:
  // a bot that fills the trap is silently dropped without spending one of
  // the connection's rate-limit slots, so real visitors sharing an IP
  // (office, household) are never boxed out by bot traffic. Answer 200 so
  // the bot does not adapt and retry, but store nothing — a real person
  // cannot reach this field, so a false success costs no one anything.
  if (
    typeof json === "object" &&
    json !== null &&
    typeof (json as Record<string, unknown>).company === "string" &&
    ((json as Record<string, unknown>).company as string).length > 0
  ) {
    console.warn("[consult] honeypot triggered, submission dropped (nothing stored)");
    return respond(request, env, 200, { ok: true });
  }

  const parsed = ConsultSchema.safeParse(json);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "Could not validate your request.";
    return respond(request, env, 400, { ok: false, error: first });
  }

  // Spam protection, not security (the old route's framing): fail open if
  // the limiter binding itself errors, so a binding hiccup never blocks a
  // real help-seeker; the log line keeps the failure visible in tail.
  const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
  let allowed = true;
  try {
    const result = await env.form_limiter.limit({ key: clientIp });
    allowed = result.success;
  } catch (err) {
    console.error("RATE_LIMIT_CHECK_FAILED", err);
  }
  if (!allowed) {
    return respond(request, env, 429, {
      ok: false,
      error: `Several requests have come from your connection in the last few minutes. Please wait a bit, or call ${PRACTICE_PHONE_DISPLAY}.`,
    });
  }

  // Normalize for storage (the old route trimmed and lowercased too).
  const data = parsed.data;
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const phone = data.phone?.trim() || null;
  const preferredContact = data.preferredContact;
  const availability = data.availability?.trim() || null;
  const reason = data.reason?.trim() || null;
  const source = data.source || null;

  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      "INSERT INTO consult_request (id, name, email, phone, preferred_contact, availability, reason, source, consent, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'new')",
    )
      .bind(id, name, email, phone, preferredContact, availability, reason, source, 1)
      .run();
  } catch (err) {
    console.error("[consult] failed to persist request", err);
    return respond(request, env, 500, {
      ok: false,
      error: "Could not save your request. Please try again.",
    });
  }

  // Notification to the practice. The request is already durably stored, so
  // a failed email leg must NOT fail the visitor's submission — it reports
  // emailQueued:false and the deploy todo watches for EMAIL_SEND_FAILED in
  // the logs instead.
  let emailQueued = false;
  try {
    await env.NOTIFY.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `New consult request - ${name}`,
      // reply-to the visitor so "reply" in Gmail reaches them directly.
      replyTo: email,
      text: [
        `Email: ${email}`,
        `Name: ${name}`,
        `Phone: ${phone ?? "Not provided"}`,
        `Preferred contact: ${preferredContact}`,
        `Availability: ${availability ?? "Not provided"}`,
        `How they heard about the practice: ${source ?? "Not provided"}`,
        "",
        "What brings them in:",
        reason ?? "(not provided)",
      ].join("\n"),
    });
    emailQueued = true;
  } catch (err) {
    console.error("EMAIL_SEND_FAILED", err);
  }

  return respond(request, env, 200, { ok: true, id, emailQueued });
}

async function handleGet(request: Request, env: Env): Promise<Response> {
  // Count only, and deliberately so. This endpoint is unauthenticated; the
  // moment it returned names or emails it would leak who is asking a trauma
  // practice for help to anyone who curled it. A bare count is enough for a
  // health check and carries no identifying information.
  try {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM consult_request",
    ).first<{ count: number }>();
    return respond(request, env, 200, { count: row?.count ?? 0 });
  } catch (err) {
    console.error("[consult] GET failed", err);
    return respond(request, env, 500, { ok: false, error: "Could not fetch requests." });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Preflight first: the browser sends OPTIONS before the real request,
    // and it must be answered 204 with the CORS headers.
    if (request.method === "OPTIONS") {
      return respond(request, env, 204, null);
    }

    const path = new URL(request.url).pathname;
    // "/" is what the site's form fetches (the workers.dev URL has no
    // path); "/api/consult" is kept for parity with the old API route.
    const knownPath = path === "/" || path === "/api/consult";
    if (!knownPath) {
      return respond(request, env, 404, { ok: false, error: "Not found." });
    }
    if (request.method === "POST") {
      return handlePost(request, env);
    }
    if (request.method === "GET") {
      return handleGet(request, env);
    }
    return respond(request, env, 405, { ok: false, error: "Method not allowed." });
  },
};
