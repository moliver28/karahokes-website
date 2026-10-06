import {
  Globe2,
  HeartHandshake,
  Medal,
  Rainbow,
  Scale,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { SITE } from "@/lib/site";

type Community = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const COMMUNITIES: Community[] = [
  {
    title: "Veterans",
    body: "Combat and non-combat trauma, military sexual trauma, and the transition home. Service habits like staying switched on and handling it alone can follow you long after the uniform comes off. You set the pace here, and you don't have to prove anything to belong.",
    icon: Medal,
  },
  {
    title: "Survivors of sexual violence",
    body: "Whether it happened recently or years ago, whether you reported it or never told a soul. We go at your pace and in your words; you will never be pushed to tell more of the story than you're ready to tell.",
    icon: ShieldPlus,
  },
  {
    title: "Survivors of domestic violence",
    body: "For people rebuilding after violence or control in a relationship, including those still untangling from it. Together we work on safety, the beliefs that relationship left behind, and what you want next. I can coordinate with advocates and hotlines if that would help.",
    icon: HeartHandshake,
  },
  {
    title: "People who have caused harm",
    body: "If you've used violence or harmed a partner, and you want to stop, you're welcome here. This is honest, accountable work: understanding what drove the harm, then building relationships that are safe for everyone in them. Choosing to change is serious, and it's possible.",
    icon: Scale,
  },
  {
    title: "Queer and trans communities",
    body: "Queer allied, trans-affirming care: for questioning, coming out, transitioning, or the ordinary reasons anyone comes to therapy. You shouldn't have to educate your own therapist about your life before the real work can start.",
    icon: Rainbow,
  },
  {
    title: "People of color and under-represented groups",
    body: "Racial-justice allied and culturally responsive, with respect for what your communities have carried. Immigrants, refugees, people of color, elders, and anyone whose experience keeps getting misread in a therapy room: you belong here.",
    icon: Globe2,
  },
];

const PROFILE_COMMUNITIES = [
  "Queer allied",
  "Racial justice allied",
  "Immunocompromised & chronically ill",
];

export function Communities() {
  return (
    <section
      id="communities"
      aria-labelledby="communities-heading"
      className="border-y border-border/60 bg-secondary/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Who I work with
            </span>
            <h2
              id="communities-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              The communities this practice is built around.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              I see individuals and groups, ages teen to elder. Some
              communities come to me again and again, so I built the practice
              for them on purpose.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.07}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {COMMUNITIES.map((c) => {
            const Icon = c.icon;
            return (
              <RevealItem key={c.title}>
                <Card className="h-full rounded-2xl border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
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
                </Card>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 text-center">
            <a
              href={SITE.psychologyToday}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
            >
              Also listed on my Psychology Today profile
            </a>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PROFILE_COMMUNITIES.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Every group above is welcome to the same free{" "}
              {SITE.consultMinutes}-minute consultation. If you don&apos;t see
              yourself here,{" "}
              <a
                href="#contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                ask anyway
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
