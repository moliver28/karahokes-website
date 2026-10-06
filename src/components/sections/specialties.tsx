import {
  Compass,
  Globe2,
  Lightbulb,
  PenLine,
  Shield,
  SlidersHorizontal,
  Sprout,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
// Note: Badge is used for the per-card tag below. The first four are
// labeled evidence-based (they are named treatments with trial data behind
// them); the last four are labeled as approaches, which is the honest word.

type Modality = {
  name: string;
  description: string;
  icon: LucideIcon;
  tag: string;
};

const MODALITIES: Modality[] = [
  {
    name: "Cognitive Processing Therapy (CPT)",
    description:
      "A structured protocol for PTSD, and the one with the strongest evidence in veterans and survivors of assault. We examine the beliefs trauma leaves behind about safety, trust, control, and intimacy. Writing is part of the work, and most people finish in about twelve sessions.",
    icon: PenLine,
    tag: "Evidence-based",
  },
  {
    name: "Dialectical Behavior Therapy (DBT)",
    description:
      "Skills for emotions that arrive at full volume: distress tolerance, emotion regulation, interpersonal effectiveness, and mindfulness. DBT is the standard treatment for emotion dysregulation and borderline personality disorder, and its skills reach well past that diagnosis.",
    icon: SlidersHorizontal,
    tag: "Evidence-based",
  },
  {
    name: "Acceptance and Commitment Therapy (ACT)",
    description:
      "Rather than fighting painful thoughts, ACT teaches you to notice them, make room for them, and put your energy into what you actually value. The aim is a life that carries its hard feelings and still moves toward what matters to you.",
    icon: Compass,
    tag: "Evidence-based",
  },
  {
    name: "Cognitive Behavioral Therapy (CBT)",
    description:
      "Thoughts, feelings, and behaviors feed each other. CBT maps the loops, tests the predictions behind them, and builds practical skills you keep for life. Structured, active, and usually time-limited.",
    icon: Lightbulb,
    tag: "Evidence-based",
  },
  {
    name: "Trauma-Focused",
    description:
      "Trauma-focused means the treatment faces the trauma directly instead of circling it. Depending on your history that can mean telling the story, working with memories in smaller doses, or processing beliefs one at a time, always at a pace your nervous system agrees to.",
    icon: Shield,
    tag: "Framework",
  },
  {
    name: "Culturally Sensitive",
    description:
      "Your culture, language, faith, and community shape what healing means and what help should look like. I practice culturally responsive care, where every client feels seen, respected, and heard, and I stay curious about what I don't know.",
    icon: Globe2,
    tag: "Approach",
  },
  {
    name: "Feminist",
    description:
      "Feminist therapy names the real forces that shape your life: gender, power, and the messages you were handed about both. The relationship is collaborative and the goals are yours. It suits survivors of violence especially well, because it treats you as the expert on your own life.",
    icon: Scale,
    tag: "Approach",
  },
  {
    name: "Strength-Based",
    description:
      "You've survived everything that has happened so far, and that took skill, whether anyone ever named it or not. Strength-based work starts from what already works in you and builds from there, instead of treating you like a list of problems.",
    icon: Sprout,
    tag: "Approach",
  },
];

export function Specialties() {
  return (
    <section
      id="specialties"
      aria-labelledby="specialties-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              How I treat
            </span>
            <h2
              id="specialties-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              The treatments I practice, and what each one actually
              involves.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              These are the approaches listed on my profile, and the first
              four carry serious research behind them. That doesn't make any
              of them a default. In our first sessions we'll look at your
              history and what you want out of therapy, then choose together.
              If something isn't working after a fair trial, we change
              course. You'll always know why we're doing what we're doing.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODALITIES.map((m) => {
            const Icon = m.icon;
            return (
              <RevealItem key={m.name}>
                <Card className="group h-full rounded-2xl border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform group-hover:scale-105">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-accent/10 text-accent"
                      >
                        {m.tag}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 font-serif text-xl font-semibold text-foreground">
                      {m.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
