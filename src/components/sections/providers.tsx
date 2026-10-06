import {
  ClipboardList,
  HeartHandshake,
  UserPlus,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { INSURANCE_PLANS } from "@/lib/insurance";
import { SITE } from "@/lib/site";

const CARDS = [
  {
    icon: UserPlus,
    title: "Who lands well with me",
    body: "Teens, adults, and elders 65+ by secure video, as individuals or in groups. The core of my practice is trauma and PTSD, emotion dysregulation, sexual abuse recovery, and domestic violence, with CPT, DBT, ACT, and CBT as the main tools. Veterans and first responders, survivors of violence, and people who have caused harm and want to stop are groups I work with often.",
  },
  {
    icon: Users,
    title: "Who I refer elsewhere",
    body: "Young children: I'll point you to colleagues who specialize in child and adolescent work. Anyone in immediate danger: 988 or 911 first, therapy after things are stable. Medication-first needs: psychologists don't prescribe in Washington, so I coordinate with a prescriber rather than replace one.",
  },
  {
    icon: ClipboardList,
    title: "The practical part",
    body: `Online-only across Washington State, plus PSYPACT states for private-pay clients. ${INSURANCE_PLANS.length} insurance plans including Aetna, Premera, Medicare, and Regence; the full list is in the Insurance & Fees section above. ${SITE.fee} with sliding-scale options. Immediate availability most weeks, so first openings usually land within a week.`,
  },
  {
    icon: HeartHandshake,
    title: "Making the handoff warm",
    body: `The fastest path is the patient calling ${SITE.phoneDisplay} or using the form below; a warm handoff from you still beats a cold directory listing. If you'd rather brief me first, email me and put "referral" in the subject line. Include a release of information with your paperwork and I'll take it from there.`,
  },
];

/**
 * For Referring Providers: PCPs and allied professionals vet the practice
 * before they send someone. Research says referrals are the dominant
 * channel for established practices and that most referrals never get a
 * report back, so this section answers the questions a referrer actually
 * has (who, what, how fast, what comes back) in one place.
 */
export function Providers() {
  return (
    <section
      id="providers"
      aria-labelledby="providers-heading"
      className="border-y border-border/60 bg-secondary/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              For referring providers
            </span>
            <h2
              id="providers-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              Referring a patient to me.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              You know the referral only works if the patient actually lands.
              Here&apos;s the whole picture so you can decide quickly whether
              I&apos;m the right place, and what happens after you send
              someone.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">
                      {c.title}
                    </h3>
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 p-5 text-center">
            <p className="text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">Closed loop, on purpose.</strong>{" "}
              With your patient&apos;s written consent, I&apos;ll send you a
              short update after the first session and again at milestones, so
              the referral doesn&apos;t just vanish after the handoff. Include
              a release of information with your paperwork and that part runs
              itself.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
