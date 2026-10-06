import { ArrowDown, BadgeCheck, HandCoins, Receipt, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { INSURANCE_PLANS } from "@/lib/insurance";
import { SITE } from "@/lib/site";

const FEE_CARDS = [
  {
    icon: HandCoins,
    title: "Sessions & sliding scale",
    body: `Sessions are ${SITE.feeLine}. If you're uninsured and money is what's keeping you from care, email me and we'll talk about sliding-scale options (a lower fee based on what you can afford); that's a door I keep open on purpose.`,
  },
  {
    icon: Receipt,
    title: "Good Faith Estimate",
    body: "If you're paying without insurance, federal law gives you the right to a Good Faith Estimate of what care is expected to cost. Ask me any time and I'll write one for you.",
  },
  {
    icon: ShieldCheck,
    title: "TriCare, VA, or CHAMPVA?",
    body: "I'm not in-network with any of them, so I won't be the right billing fit there. If you also carry a civilian plan from the list above, I can take that. Vet Centers provide free counseling to veterans and their families, and ptsd.va.gov can help you find one.",
    linkLabel: "The longer answer is in the questions below",
    linkHref: "#faq",
  },
];

/**
 * Insurance & Fees: the practice's accepted plans as a card grid plus the
 * self-pay paths beside them. Built because the top nav now links here
 * directly: cost is the most common practical objection, and it deserves a
 * real destination instead of an opened accordion. The plan list is shared
 * with the FAQ answer via @/lib/insurance so the two never drift.
 */
export function Insurance() {
  return (
    <section
      id="insurance"
      aria-labelledby="insurance-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Insurance &amp; Fees
            </span>
            <h2
              id="insurance-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              What care costs, and who helps pay for it.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Money questions deserve straight answers, especially when
              you&apos;re already carrying a lot. Here is every plan I accept,
              what sessions cost if you&apos;re paying yourself, and the
              honest limits, so nothing about cost catches you by surprise.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h3 className="mt-14 flex items-center justify-center gap-2.5 font-serif text-xl font-semibold text-foreground">
            Plans I accept
            <span
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground ring-1 ring-border"
              aria-label={`${INSURANCE_PLANS.length} plans`}
            >
              {INSURANCE_PLANS.length}
            </span>
          </h3>
        </Reveal>

        <RevealGroup
          stagger={0.035}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {INSURANCE_PLANS.map((plan) => (
            <RevealItem key={plan.name}>
              <div className="group flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110">
                  <BadgeCheck className="size-5" aria-hidden="true" />
                </span>
                <span className="font-serif text-sm font-semibold leading-snug text-foreground">
                  {plan.name}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
            Listed exactly as they appear in my practice profile. Cigna EAP
            stands for Employee Assistance Program; if your employer offers
            one, sessions may be covered. I&apos;m licensed in Washington
            State, so insurance covers clients who live here, and before we
            start I&apos;ll check your benefits with you so nothing about
            cost comes as a surprise.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h3 className="mt-16 text-center font-serif text-xl font-semibold text-foreground">
            If you don&apos;t use insurance
          </h3>
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-6 grid gap-5 md:grid-cols-3">
          {FEE_CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <RevealItem key={c.title}>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h4 className="font-serif text-lg font-semibold leading-snug text-foreground">
                      {c.title}
                    </h4>
                  </div>
                  <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                  {"linkLabel" in c && c.linkLabel && (
                    <a
                      href={c.linkHref}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {c.linkLabel}
                      <ArrowDown className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.18}>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 p-5 text-center">
            <p className="text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">
                Sorting out cost shouldn&apos;t be the hard part.
              </strong>{" "}
              Bring your benefits questions to the free{" "}
              {SITE.consultMinutes}-minute consultation and we&apos;ll sort
              out what makes sense.{" "}
              <a
                href="#contact"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Book one below
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
