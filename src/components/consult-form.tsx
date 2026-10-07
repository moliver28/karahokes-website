"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SITE } from "@/lib/site";

const FormSchema = z.object({
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
  // Deliberately not a clinical field: it exists for scheduling logistics
  // only, and its copy asks visitors to keep health details out. See the
  // mirrored validation in worker/src/index.ts.
  message: z.string().max(1000, "Please keep this under 1000 characters.").optional(),
  // Honeypot: real people never see or fill this (it sits off-screen and is
  // skipped by keyboard and screen readers). It exists so bots that fill
  // every input announce themselves. The server silently drops submissions
  // where it's filled; see the mirrored validation in worker/src/index.ts.
  company: z.string().optional(),
  consent: z.literal(true, {
    message: "Please acknowledge the consent statement to continue.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function ConsultForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  // A calm, persistent confirmation for after a successful send. The toast
  // disappears in seconds; someone anxious about whether the message
  // arrived deserves something that stays until they act again.
  const [justSent, setJustSent] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Clear the confirmation only when the VISITOR starts typing again.
  // A React onChange on the <form> can't do this job: react-hook-form's
  // reset() after submit updates controlled field values and trips React's
  // synthetic change events, which would wipe the confirmation the instant
  // it appears. Native input/change events with isTrusted are the honest
  // signal: they fire for real keystrokes only, never for programmatic
  // resets.
  React.useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const onUserInput = (e: Event) => {
      if (e.isTrusted) setJustSent(false);
    };
    el.addEventListener("input", onUserInput, { capture: true });
    el.addEventListener("change", onUserInput, { capture: true });
    return () => {
      el.removeEventListener("input", onUserInput, { capture: true });
      el.removeEventListener("change", onUserInput, { capture: true });
    };
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
      availability: "",
      source: undefined,
      message: "",
      company: "",
      consent: false as unknown as true,
    },
    mode: "onTouched",
  });

  // Subscribe to the message field so the character counter updates as the
  // visitor types (RHF does not re-render field render-props on input).
  const messageLength = (form.watch("message") ?? "").length;

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; id?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      toast({
        title: "Request received. Thank you.",
        description:
          "Kara reads every request herself and will reply within two business days.",
      });
      setJustSent(true);
      form.reset({
        name: "",
        email: "",
        phone: "",
        preferredContact: "email",
        availability: "",
        source: undefined,
        message: "",
        consent: false as unknown as true,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Something went wrong. Please try again or call ${SITE.phoneDisplay}.`;
      toast({
        title: "Couldn't send your request",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-5"
        noValidate
        aria-label="Consultation request form"
      >
        {justSent && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5"
          >
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">Your request went through.</strong>{" "}
              You don't need to do anything else now. I'll reply within two
              business days; the steps after that are written just below this
              form.
            </p>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full name <span aria-hidden="true" className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Your name"
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span aria-hidden="true" className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferredContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Preferred contact method{" "}
                <span aria-hidden="true" className="text-destructive">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-72" aria-required="true">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone call</SelectItem>
                  <SelectItem value="text">Text message</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Best days / times</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. weekday mornings, Tue/Thu afternoons"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about me? (optional)</FormLabel>
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                defaultValue={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-72">
                    <SelectValue placeholder="Select one, or leave blank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="psychology-today">Psychology Today profile</SelectItem>
                  <SelectItem value="search">Google or another search</SelectItem>
                  <SelectItem value="provider-referral">Referred by a provider</SelectItem>
                  <SelectItem value="insurance-directory">Insurance plan directory</SelectItem>
                  <SelectItem value="social">Social media</SelectItem>
                  <SelectItem value="rather-not-say">I&apos;d rather not say</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                It helps me know what's working. The answer never changes how
                I reply, and skipping it changes nothing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Anything you&apos;d like us to know before scheduling? (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  maxLength={1000}
                  placeholder="Scheduling details work best here. Please do not include medical or personal health information."
                  {...field}
                />
              </FormControl>
              <div className="flex items-start justify-between gap-4">
                <FormDescription>
                  A sentence is plenty, and skipping it changes nothing.
                </FormDescription>
                <span
                  className="shrink-0 text-xs tabular-nums text-muted-foreground"
                  aria-live="polite"
                >
                  {messageLength} / 1000
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot field. Positioned off-screen (not display:none, which
            sophisticated bots check for), unreachable by keyboard or screen
            reader, and named something mundane a spam bot wants to fill. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-auto size-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            {...form.register("company")}
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-3 rounded-lg border border-border/70 bg-secondary/40 p-3.5">
                <FormControl>
                  {/* Named by the statement beside it (aria-labelledby, not
                      Label htmlFor: the statement is two <p>s, not a single
                      label element). Without it the checkbox announces as an
                      unnamed checkbox (axe: button-name, critical). */}
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-required="true"
                    aria-labelledby="consent-statement"
                  />
                </FormControl>
              <div
                id="consent-statement"
                className="space-y-1.5 text-sm leading-relaxed text-muted-foreground"
              >
                <p>
                  I understand this form is not for emergencies, and that
                  Kara will reply within two business days.
                </p>
                <p className="text-xs">
                  If I'm in crisis, I'll call 988 or 911 instead.
                </p>
              </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PHI boundary: this form feeds an email inbox and a database that
            are not built for health information, so the request itself stays
            free of it. The phone line and 988 are the right channels for
            anything clinical or urgent. */}
        <p className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          This form is not for medical or crisis information. Please don&apos;t
          include personal health details here — if you&apos;d like to talk
          something through, call {SITE.phoneDisplay} instead. If you are in
          crisis, call or text 988.
        </p>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            What you write goes to my practice email only. It&apos;s kept
            confidential, never sold, never shared.
          </p>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-full px-6"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Request Consultation
                <Send className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
