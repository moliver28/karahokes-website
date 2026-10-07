# karahokes-form (W1 form backend)

Cloudflare Worker + D1 + Email Routing backend for the site's consultation
form. It replicates the behavior of the form API the site used before its
static-export conversion: same fields and error messages, honeypot dropped
silently, rate limiting, a durable D1 record, and an email notification to
the practice's inbox. CORS is locked to `https://www.karahokes.com`.

Files: `src/index.ts` (the Worker), `schema.sql` (D1 table),
`wrangler.jsonc` (bindings), `package.json` / `package-lock.json`
(wrangler + typescript + zod only), `tsconfig.json`, `.gitignore`.

The browser form reads `{ ok, error, id }` from the POST response — that
contract (and the validation messages, which are defined twice: in
`src/components/consult-form.tsx` and mirrored in `src/index.ts`) must not
drift. Changing a form field means editing both files and redeploying.

## Deploy runbook (one-time + redeploys)

Prerequisite, done once by a human in the Cloudflare dashboard: create the
free account, add the karahokes.com zone, enable Email Routing, add
destination address `karahokes@gmail.com`, and click the confirmation email
Gmail receives (check spam). Wrangler cannot do these steps.

```
cd worker
npm install
npx wrangler d1 create karahokes_form
```

Paste the `database_id` the create command prints into `wrangler.jsonc`
(replaces the placeholder UUID). Then:

```
npx wrangler d1 execute karahokes_form --remote --file schema.sql
npx wrangler deploy
```

`wrangler deploy` prints the real URL (`https://karahokes-form.<subdomain>.workers.dev`).
The site reads the endpoint from `SITE.formEndpoint` in `src/lib/site.ts`.

Useful checks after deploy: `npx wrangler tail` while submitting the live
form (watch for `EMAIL_SEND_FAILED`), and
`npx wrangler d1 execute karahokes_form --remote --command "SELECT COUNT(*) FROM consult_request"`.

## Bindings (no secrets anywhere)

- `DB` — D1 database `karahokes_form`, table `consult_request`.
- `form_limiter` — Rate Limiting binding, 5 requests / 60 s keyed on the
  client IP. The platform only supports 10 s or 60 s windows (no 600 s), so
  this is 5/minute: strictly tighter than the old in-memory 5-per-10-minutes
  limiter for the abuse case it exists for. It is spam protection, not
  security; the Worker fails open if the binding errors, and logs
  `RATE_LIMIT_CHECK_FAILED` when that happens.
- `NOTIFY` — `send_email` binding (Email Routing). Sends from
  `website@karahokes.com` (must be on the zone with Email Routing enabled)
  to `karahokes@gmail.com` (must be the verified destination address).

## Current-API findings (verified against developers.cloudflare.com, Oct 2026)

- **send_email config shape** (Email Service docs, "Workers API"):
  `"send_email": [{ "name": "EMAIL" }]` in wrangler.jsonc. The old
  `{ binding, type: "send_email" }` TOML-era shape is not the current form.
- **Reply-to IS supported.** The current structured send API takes a plain
  object: `env.NOTIFY.send({ from, to, subject, text, replyTo })` where
  `replyTo?: string | { email, name }` and `from` may be
  `{ name, email }`. The legacy `EmailMessage` (from `cloudflare:email` +
  MIME building) still works but is documented as backward-compat only; this
  Worker uses the structured builder, so no MIME library is needed.
  `send()` resolves with `{ messageId }` and throws `Error`s carrying a
  `code` (e.g. `E_SENDER_NOT_VERIFIED`, `E_RECIPIENT_NOT_ALLOWED`).
- **Ratelimit binding shape** (Workers "Rate Limiting" docs, needs
  wrangler >= 4.36): top-level `"ratelimits": [{ "name", "namespace_id",
  "simple": { "limit", "period" } }]`, `namespace_id` an integer-as-string
  unique per account, `period` restricted to `10` or `60` seconds, checked
  in code via `await env.<name>.limit({ key })` returning
  `{ success }`. Counters are per Cloudflare location (edge PoP), not
  global — acceptable for spam protection (the plan records this as
  superseding the old per-server-instance in-memory limiter).
- **D1**: `env.DB.prepare(sql).bind(...).run()` for writes,
  `.first<T>()` for single-row reads — prepared statements with bound
  parameters (no string interpolation).

## Resend fallback (only if triggered)

If Email Routing turns out unavailable (e.g. Cloudflare demands full
nameserver setup for the zone), the documented fallback is a Resend free
account: swap the `NOTIFY` leg in `src/index.ts` for a `fetch` to Resend's
API using a `RESEND_API_KEY` wrangler secret (`npx wrangler secret put`),
plus two TXT records at the registrar. That is a later, explicit decision —
this Worker ships without it.

## Data retention

Submissions live in two places: D1 rows on Cloudflare, and the notification
emails in the practice Gmail inbox. There is no automatic purge — the
practice deletes on its own schedule. To drop rows older than 30 days:

```
npx wrangler d1 execute karahokes_form --remote --command "DELETE FROM consult_request WHERE created_at < date('now','-30 days')"
```

The pipeline is designed to carry no personal health information (the form's
note field and its copy exist for scheduling logistics only) and makes no
compliance claim — retention policy and any regulatory judgment belong to
the practice and its professional counsel.

## Local verification

`npx wrangler dev` (local mode, no login needed), then POST/GET against
`http://localhost:8787`. See `.omo/evidence/task-4-karahokes-site-launch.txt`
for the full curl matrix this code was verified against.
