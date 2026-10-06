"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Ear,
  Eye,
  Flower2,
  Hand,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SenseStep = {
  count: number;
  sense: string;
  instruction: string;
  hint: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
};

const STEPS: SenseStep[] = [
  {
    count: 5,
    sense: "things you can see",
    instruction: "Name five things you can see.",
    hint: "Look around slowly. Colors, edges, and small details all count.",
    icon: Eye,
  },
  {
    count: 4,
    sense: "things you can feel",
    instruction: "Name four things you can feel.",
    hint: "Your feet on the floor. Fabric against your arm. The temperature of the air.",
    icon: Hand,
  },
  {
    count: 3,
    sense: "things you can hear",
    instruction: "Name three things you can hear.",
    hint: "Near sounds first, then far ones. Traffic. A fridge humming. Your own breath.",
    icon: Ear,
  },
  {
    count: 2,
    sense: "things you can smell",
    instruction: "Name two things you can smell.",
    hint: "If nothing is close by, name two smells you like instead.",
    icon: Flower2,
  },
  {
    count: 1,
    sense: "thing you can taste",
    instruction: "Name one thing you can taste.",
    hint: "Coffee, toothpaste, or simply the inside of your mouth.",
    icon: Coffee,
  },
];

/**
 * A self-paced 5-4-3-2-1 grounding exercise: the other tool I teach besides
 * breathing. Naming what the senses pick up pulls attention out of the past
 * and into the room, and it suits people who find breath work activating.
 * Pure local state, keyboard reachable, aria-live announcements, and no
 * timed animation, so it stays calm for reduced-motion users.
 */
export function SensesGrounding() {
  const [stepIdx, setStepIdx] = React.useState(0);
  const done = stepIdx >= STEPS.length;
  const step = done ? null : STEPS[stepIdx];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          5-4-3-2-1 senses
        </h3>
        <span
          className="shrink-0 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-muted-foreground"
          aria-live="polite"
        >
          {done ? "Complete" : `Step ${stepIdx + 1} of ${STEPS.length}`}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        The other tool I teach. Name what your senses pick up, one sense at a
        time. It pulls attention out of the past and into the room.
      </p>

      {/* Progress dots */}
      <div
        className="mt-4 flex items-center gap-1.5"
        aria-hidden="true"
      >
        {STEPS.map((s, i) => (
          <span
            key={s.sense}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i < stepIdx || done
                ? "w-6 bg-primary/70"
                : i === stepIdx
                  ? "w-6 bg-primary"
                  : "w-3 bg-primary/20"
            )}
          />
        ))}
      </div>

      {step ? (
        <div key={step.sense} className="mt-5 flex flex-1 flex-col">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-4xl font-semibold leading-none text-primary">
              {step.count}
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {step.sense}
            </span>
          </div>
          <p className="mt-4 text-base font-medium leading-relaxed text-foreground">
            {step.instruction}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {step.hint}
          </p>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <Button
              onClick={() => setStepIdx((i) => i + 1)}
              className="rounded-full px-5"
              aria-label={`Next: ${STEPS[stepIdx + 1] ? STEPS[stepIdx + 1].instruction : "finish the exercise"}`}
            >
              {stepIdx === STEPS.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            {stepIdx > 0 && (
              <Button
                variant="outline"
                onClick={() => setStepIdx((i) => i - 1)}
                className="rounded-full border-primary/30"
                aria-label={`Back to step ${stepIdx}: ${STEPS[stepIdx - 1].instruction}`}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-base font-medium leading-relaxed text-foreground">
            That&apos;s the whole exercise.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Pause and notice whether anything shifted, even a little. You can
            walk through it again any time, anywhere, and nobody around you
            will know you&apos;re doing it.
          </p>
          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              onClick={() => setStepIdx(0)}
              className="rounded-full border-primary/30"
              aria-label="Start the 5-4-3-2-1 exercise again from the first step"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
