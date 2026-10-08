import Image from "next/image";
import { GraduationCap, Quote, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

const CREDENTIALS = [
  "PhD, Clinical Psychology",
  "Licensed Psychologist, Washington State (#61681733)",
  "PSYPACT Certified: telehealth across participating states",
  "Trained in ACT, CBT, CPT, DBT, and PE",
  "Trauma-focused, strength-based, and feminist approaches",
  "Clinical supervision and consultation for other clinicians",
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Portrait */}
          <Reveal y={20}>
            <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
              {/* Decorative warm frame */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
              />
              <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-gradient-to-br from-[oklch(0.95_0.02_100)] to-[oklch(0.9_0.03_145)] shadow-sm">
                <PortraitImage />
              </div>
              {/* What to expect callout */}
              <div className="relative mt-6 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                {/* A <p>, not a heading: this callout sits in the grid column
                    BEFORE the section's <h2>, so a heading here skipped a
                    level in the document outline (axe: heading-order). It is
                    an annotation on the portrait, not a document section. */}
                <p className="font-serif text-base font-semibold text-foreground">
                  What to expect
                </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The first session is 50 minutes by video and mostly
                  listening. You share what you&apos;re comfortable sharing, I
                  ask questions to understand the full picture, and by the end
                  I&apos;ll tell you plainly whether I think I can help. If
                  I&apos;m not the right fit, I&apos;ll help you find someone
                  who is.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <div className="lg:pl-4">
            <Reveal className="text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                About Dr. Hokes
              </span>
            </Reveal>
            <Reveal className="text-center lg:text-left" delay={0.08}>
              <h2
                id="about-heading"
                className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
              >
                Evidence-based treatment, culturally responsive care, and a
                partnership aimed at your goals.
              </h2>
            </Reveal>
            <Reveal className="text-center lg:text-left" delay={0.16}>
              <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
                <p>
                  I’m Kara. I’ve spent almost 10 years working with adults whose lives
                  have been significantly impacted by trauma. Before private practice I
                  directed a counseling program for first responders and worked for many years at Veterans Affairs
                  as a clinical psychologist. What I've learned is that trauma is not a
                  life sentence — it is a treatable condition, and the treatments genuinely work.
                </p>
                <p>
                  My other specializations include emotion dysregulation, anxiety, anger,
                  relationship issues, and women’s health (perinatal health, menopause).
                  I'm trained in evidence-based practices, meaning treatments with real
                  research behind them. I believe culturally responsive care matters as
                  much as the research, so together we will choose a treatment that fits
                  you rather than fitting you to a treatment. Therapy here is a
                  partnership: you set the pace, we go in order of what matters to you,
                  and nothing happens in a session that you haven't agreed to first.
                  Outside the office I'm usually on a trail with my dog and partner,
                  reading a new fantasy/sci-fi book, or getting my hands dirty at the
                  pottery studio.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <figure className="mt-7 rounded-xl border border-border/70 bg-secondary/40 p-5">
                <blockquote className="font-serif text-lg italic leading-relaxed text-foreground">
                  <Quote className="mb-2 size-5 text-accent" aria-hidden="true" />
                  You deserve a therapist who sees your full humanity — not just your symptoms.
                </blockquote>
              </figure>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-7">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                  <GraduationCap className="size-4 text-primary" aria-hidden="true" />
                  Credentials &amp; Training
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {CREDENTIALS.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  You can verify license #61681733 yourself at the{" "}
                  <a
                    href="https://wahelms.my.site.com/s/license-search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Washington State Department of Health license search
                  </a>
                  .
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Feel free to ask about qualifications and training
                  experience; the {SITE.consultMinutes}-minute call is a good
                  place for that.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitImage() {
  return (
    <div className="relative aspect-square w-full">
      {/* Warm gradient fallback behind the photo while it loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.92_0.03_100)] via-[oklch(0.88_0.04_60)] to-[oklch(0.85_0.05_145)]" />
      <Image
        src={SITE.portrait}
        alt="Portrait of Kara Hokes, PhD, a clinical psychologist with wavy brown hair and tortoiseshell glasses, smiling in front of a leafy green plant"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        priority={false}
      />
    </div>
  );
}
