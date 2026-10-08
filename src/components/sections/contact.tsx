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
import { ConsultForm } from "@/components/consult-form";
import { PrintButton } from "@/components/print-button";
import { Reveal } from "@/components/reveal";
import { WhatToExpectNext } from "@/components/what-to-expect-next";
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
      className="py-16 md:py-24"
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
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HandCoins className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Fees
                      </span>
                      Most major insurances accepted · $150 out of pocket cost · Free 15-minute consultation
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
              </div>

              {/* Where I can see you: licensing geography */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-primary/30">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Where I can see you
                </h3>
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
                  Every session happens this way, so here&apos;s the short version.
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
                      a private video address the morning of your session —
                      opens in your browser, no account, no download.
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
                      have them, a steady connection. A phone works in a
                      pinch.
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
                      HIPAA-compliant, encrypted, nothing recorded on either side.
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
                      if video drops, we finish on the phone.
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
                  <a
                    href="tel:988"
                    className="underline-offset-4 hover:underline"
                  >
                    <strong className="text-foreground">988</strong>
                  </a>{" "}
                  (Suicide &amp; Crisis Lifeline) or{" "}
                  <a
                    href="tel:911"
                    className="underline-offset-4 hover:underline"
                  >
                    <strong className="text-foreground">911</strong>
                  </a>
                  , or go to your nearest emergency room.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Veterans: call{" "}
                  <a
                    href="tel:988"
                    className="underline-offset-4 hover:underline"
                  >
                    988
                  </a>{" "}
                  and press{" "}
                  <strong className="text-foreground">1</strong> for the
                  Veterans Crisis Line. If someone is hurting you at home:{" "}
                  <a
                    href="tel:+18007997233"
                    className="underline-offset-4 hover:underline"
                  >
                    <strong className="text-foreground">1-800-799-7233</strong>
                  </a>{" "}
                  (National Domestic Violence Hotline). For sexual assault
                  support, any hour:{" "}
                  <a
                    href="tel:+18006564673"
                    className="underline-offset-4 hover:underline"
                  >
                    <strong className="text-foreground">1-800-656-4673</strong>
                  </a>{" "}
                  (RAINN).
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  This form isn&apos;t monitored around the clock, so please
                  don&apos;t use it for emergencies.
                </p>
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
                    Most major insurance is accepted. Sessions are{" "}
                    {SITE.feeLine}, the {SITE.consultMinutes}-minute intro
                    call is free, and sliding-scale options exist if
                    you&apos;re paying without insurance.
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ConsultForm />
              </CardContent>
            </Card>

            <WhatToExpectNext />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
