import {
  Baby,
  Brain,
  CloudRain,
  Flame,
  Flower2,
  Focus,
  HeartCrack,
  HeartPulse,
  Layers,
  Link2,
  Medal,
  PersonStanding,
  ShieldQuestion,
  Stethoscope,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/reveal";

type Concern = {
  label: string;
  icon: LucideIcon;
};

// Drawn from the profile's expertise list, led by the three top
// specialties (trauma and PTSD, emotional regulation, sexual abuse).
const CONCERNS: Concern[] = [
  { label: "Trauma & PTSD, including complex PTSD", icon: Brain },
  { label: "Emotion dysregulation", icon: Flame },
  { label: "Sexual abuse & assault", icon: ShieldQuestion },
  { label: "Domestic violence", icon: HeartCrack },
  { label: "Veterans & military trauma", icon: Medal },
  { label: "First responders & healthcare workers", icon: Stethoscope },
  { label: "Anger management", icon: Zap },
  { label: "Anxiety", icon: Wind },
  { label: "Depression", icon: CloudRain },
  { label: "Suicidal thoughts", icon: HeartPulse },
  { label: "Borderline personality (BPD)", icon: Layers },
  { label: "ADHD", icon: Focus },
  { label: "Pregnancy, prenatal & postpartum", icon: Baby },
  { label: "Menopause", icon: Flower2 },
  { label: "Eating disorders & body image", icon: PersonStanding },
  { label: "Relationship issues & life transitions", icon: Link2 },
];

export function Concerns() {
  return (
    <section
      id="concerns"
      aria-labelledby="concerns-heading"
      className="border-y border-border/60 bg-secondary/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            What I help with
          </span>
          <h2
            id="concerns-heading"
            className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
          >
            What people bring me, named plainly.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            These match the concerns I treat most. This list is only a
            starting point: if what you&apos;re carrying isn&apos;t on it,
            reach out anyway.
          </p>
        </div>

        <RevealGroup
          stagger={0.05}
          className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CONCERNS.map((c) => {
            const Icon = c.icon;
            return (
              <RevealItem key={c.label}>
                <div className="group flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/40 hover:shadow-sm">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-foreground">
                    {c.label}
                  </span>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
