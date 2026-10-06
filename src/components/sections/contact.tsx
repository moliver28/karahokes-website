import {
  Clock,
  Download,
  HandCoins,
  Headphones,
  LifeBuoy,
  Lock,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AfterYouSend } from "@/components/after-you-send";
import { ConsultForm } from "@/components/consult-form";
import { OpenNow } from "@/components/open-now";
import { PrepChecklist } from "@/components/prep-checklist";
import { PrintButton } from "@/components/print-button";
import { QuickExit } from "@/components/quick-exit";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

// PSYPACT participating states as of this writing (PSYPACT is an
// interstate compact that lets psychologists practice telehealth across
// state lines). Washington itself is a member, so the list below is for
// clients living outside WA. psypact.org holds the authoritative, current
// list; this one exists so a visitor can quickly check their own state.
const PSYPACT_STATES = [
  "Alabama", "Arizona", "Arkansas", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Idaho", "Illinois",
  "Indiana", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "North Carolina", "Ohio", "Oklahoma",
  "Pennsylvania", "Rhode Island", "South Carolina", "Tennessee", "Texas",
  "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Getting Started
            </span>
            <h2
              id="contact-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              Start with a free 15-minute phone call.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Tell me a little about what&apos;s going on. You don&apos;t need
              the right words; a sentence or two is enough. I read every
              message myself and reply within two business days.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left: contact info + logistics + crisis */}
          <Reveal y={20} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5">
              <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
                <span
                  className="relative flex size-2.5 shrink-0"
                  aria-hidden="true"
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <p className="text-sm leading-snug text-foreground">
                  <strong className="font-semibold">
                    Immediate availability most weeks.
                  </strong>{" "}
                  First openings usually come up within the next one to two
                  weeks; reach out by email or phone to schedule.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-primary/30">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Reach the practice
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Email
                        </span>
                        {SITE.email}
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={SITE.phoneHref}
                      className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Phone
                        </span>
                        {SITE.phoneDisplay}
                      </span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Location
                      </span>
                      Available online only
                      <br />
                      Based in {SITE.city}, {SITE.region} {SITE.postalCode}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Hours
                      </span>
                      Most weekdays, 9am to 5pm Pacific
                      <br />
                      Video sessions and replies
                    </span>
                  </li>
                  <OpenNow />
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HandCoins className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Fees
                      </span>
                      {SITE.fee} · Free {SITE.consultMinutes}-minute intro
                      call
                      <br />
                      Most major insurance accepted · Sliding scale by email
                    </span>
                  </li>
                  <li>
                    <a
                      href={SITE.vcardPath}
                      download
                      className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Download a contact card for Dr. Hokes with the practice phone number, email, and hours"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Download className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Keep these details
                        </span>
                        <span className="underline decoration-primary/40 underline-offset-2">
                          Save a contact card to your phone
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
                <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
                  The contact card carries the phone number, email, and hours.
                  Insurance details are in their own section above, and
                  I&apos;m glad to talk any of it through on the intro call.
                </p>
              </div>

              {/* Where I can see you: licensing geography */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-primary/30">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Where I can see you
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The short version: every session is video, and geography is
                  mostly a licensing question.
                </p>
                <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        Washington State:
                      </strong>{" "}
                      I&apos;m licensed here, so clients living anywhere in
                      WA, Seattle to Spokane, can use the insurance plans I
                      accept.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        Beyond Washington:
                      </strong>{" "}
                      I&apos;m PSYPACT certified, which lets me see
                      private-pay clients in 40-plus participating states at
                      the same {SITE.fee}. Check the list:
                    </span>
                  </li>
                </ul>
                <details className="group mt-3 rounded-lg border border-border/60 bg-secondary/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50">
                    PSYPACT participating states
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="px-3.5 pb-1 text-xs leading-relaxed text-muted-foreground">
                    {PSYPACT_STATES.join(", ")}.
                  </p>
                  <p className="px-3.5 pb-3 text-xs leading-relaxed text-muted-foreground">
                    The authoritative, current list lives at psypact.org.
                  </p>
                </details>
              </div>

              {/* Telehealth logistics */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-primary/30">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  If we meet by video
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Every session happens this way, so here&apos;s exactly what
                  the setup looks like.
                </p>
                <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Video className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        The link:
                      </strong>{" "}
                      a private video address I send the morning of your
                      session. It opens in your browser; no account, no
                      download.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Headphones className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        What helps:
                      </strong>{" "}
                      a room where you can close the door, headphones if you
                      have them, and a connection steady enough for video. A
                      phone works in a pinch.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Lock className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        Privacy:
                      </strong>{" "}
                      the platform is HIPAA-compliant, the call is encrypted,
                      and nothing is recorded, either side.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <PhoneCall className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">
                        Backup plan:
                      </strong>{" "}
                      if video drops, we finish the session on the phone. We
                      agree on the number before the first session, so a bad
                      connection never costs you the hour.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Crisis resources */}
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <LifeBuoy className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    If you&apos;re in crisis
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you&apos;re in immediate danger, please call{" "}
                  <strong className="text-foreground">988</strong> (Suicide
                  &amp; Crisis Lifeline) or{" "}
                  <strong className="text-foreground">911</strong>, or go to
                  your nearest emergency room.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Veterans: call 988 and press{" "}
                  <strong className="text-foreground">1</strong> for the
                  Veterans Crisis Line. If someone is hurting you at home:{" "}
                  <strong className="text-foreground">1-800-799-7233</strong>{" "}
                  (National Domestic Violence Hotline). For sexual assault
                  support, any hour:{" "}
                  <strong className="text-foreground">1-800-656-4673</strong>{" "}
                  (RAINN).
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  This form isn&apos;t monitored around the clock, so please
                  don&apos;t use it for emergencies.
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-destructive/15 pt-3">
                  <QuickExit />
                  <span className="text-[11px] leading-snug text-muted-foreground">
                    Opens a plain website right away. The back button won&apos;t
                    bring you back here. From the keyboard: press{" "}
                    <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-sans text-[10px] font-semibold">
                      Esc
                    </kbd>{" "}
                    three times, quickly.
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-destructive/15 pt-3">
                  <PrintButton />
                  <span className="text-[11px] leading-snug text-muted-foreground">
                    Prints a plain one-page sheet with these numbers and the
                    practice&apos;s contact info.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: form + prep checklist */}
          <Reveal delay={0.12} className="lg:col-span-3">
            <div className="flex flex-col gap-5">
              <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-xl font-semibold text-foreground">
                  Consultation request
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A few basics, then anything you&apos;d like me to know. Take
                  your time.
                </p>
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  <HandCoins
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    {SITE.feeLine}. The {SITE.consultMinutes}-minute intro
                    call is free, most major insurance is accepted, and
                    sliding-scale options exist if you&apos;re paying without
                    insurance.
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ConsultForm />
                <p className="mt-5 flex items-start gap-2 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    What you write here goes to my practice email only. It&apos;s
                    not added to any list and it&apos;s not shared. Please leave
                    out anything you&apos;d rather say out loud first; a sentence
                    or two is plenty to start.
                  </span>
                </p>
              </CardContent>
            </Card>

            <AfterYouSend />

            <PrepChecklist />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
