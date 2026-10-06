import { CalendarHeart, ClipboardCheck, HandHeart, Sprout, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "A free 15-minute phone call. You tell me what's going on in a sentence or two, I tell you how I work, and we both get a feel for whether this is the right match. No fee, no obligation.",
    icon: CalendarHeart,
  },
  {
    number: "02",
    title: "Collaborative Assessment",
    description:
      "The first few sessions are for understanding, not diagnosing. We map your history, your goals, and what safety feels like for you. If a formal diagnosis would help (some insurance plans require one), I'll explain exactly what it means before anything goes in your file.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Active Treatment",
    description:
      "We pick the approach that fits: CPT, DBT, ACT, CBT, or a blend. Before any deep processing, we build stabilization, which means real skills for grounding, sleep, and getting through the hard days. Then we work at a pace you can actually handle.",
    icon: HandHeart,
  },
  {
    number: "04",
    title: "Integration & Growth",
    description:
      "Therapy should end. When symptoms quiet down, we space out sessions, review what you've learned, and make a plan for the triggers that might still show up. Most people finish somewhere between six months and two years.",
    icon: Sprout,
  },
];

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="border-y border-border/60 bg-secondary/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Left: intro + telehealth visual */}
          <div className="lg:col-span-1">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                The Process
              </span>
              <h2
                id="approach-heading"
                className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
              >
                What working together actually looks like.
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                Most people have never done therapy before, so here&apos;s the
                usual path from start to finish. We&apos;ll adjust it as we
                learn more about you.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.92_0.03_100)] to-[oklch(0.86_0.04_145)]" />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/telehealth-landscape.png')" }}
                    role="img"
                    aria-label="Illustration of a video therapy setup: a laptop and headphones at a bright desk, evergreen forest outside the window"
                  />
                </div>
                <p className="border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
                  Every session happens over secure video: the same
                  evidence-based care, wherever in Washington you are.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-6 rounded-2xl border border-border/70 bg-card p-5">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  Sessions and groups
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  I see individuals and groups. {SITE.fee}, most weekdays,
                  9am to 5pm Pacific. If you don&apos;t see an open spot on
                  the calendar, reach out anyway; schedules shift.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: stepper */}
          <div className="lg:col-span-2">
            <ol className="relative grid gap-6 md:grid-cols-2">
              {/* Decorative connecting line on md+ */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-7 left-0 right-0 hidden h-px bg-gradient-to-r from-primary/30 via-border to-primary/30 md:block"
              />
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.number}
                    className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-serif text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          Step {s.number}
                        </span>
                        <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    {/* Connector arrow on mobile */}
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-border md:hidden"
                      >
                        ↓
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
