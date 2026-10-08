"use client";

import * as React from "react";
import { Pause, Play, RotateCcw, Wind } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SensesGrounding } from "@/components/senses-grounding";
import { cn } from "@/lib/utils";

type PhaseAction = "grow" | "hold-big" | "shrink" | "hold-small";

type Phase = {
  label: string;
  action: PhaseAction;
  seconds: number;
};

type Preset = {
  id: string;
  name: string;
  hint: string;
  idleHint: string;
  phases: Phase[];
};

const PRESETS: Preset[] = [
  {
    id: "box",
    name: "Box 4-4-4-4",
    hint: "Even and symmetrical. My default for steadying a jumpy system.",
    idleHint: "Four counts in. Hold four. Four counts out. Hold again.",
    phases: [
      { label: "Breathe in", action: "grow", seconds: 4 },
      { label: "Hold", action: "hold-big", seconds: 4 },
      { label: "Breathe out", action: "shrink", seconds: 4 },
      { label: "Hold", action: "hold-small", seconds: 4 },
    ],
  },
  {
    id: "478",
    name: "4-7-8",
    hint: "The long exhale does the work. A classic for falling asleep.",
    idleHint: "In for four. Hold for seven. Out slow for eight.",
    phases: [
      { label: "Breathe in", action: "grow", seconds: 4 },
      { label: "Hold", action: "hold-big", seconds: 7 },
      { label: "Breathe out", action: "shrink", seconds: 8 },
    ],
  },
  {
    id: "even",
    name: "Even 5-5",
    hint: "No holds, just a smooth middle pace. The easiest of the three.",
    idleHint: "Five counts in, five counts out. No holds.",
    phases: [
      { label: "Breathe in", action: "grow", seconds: 5 },
      { label: "Breathe out", action: "shrink", seconds: 5 },
    ],
  },
];

type BreathState = {
  phaseIdx: number;
  secondsLeft: number;
  rounds: number;
  started: boolean;
};

function idleFor(preset: Preset): BreathState {
  return {
    phaseIdx: 0,
    secondsLeft: preset.phases[0].seconds,
    rounds: 0,
    started: false,
  };
}

/**
 * Breathing widget with three patterns (box, 4-7-8, even 5-5), paired with
 * a self-paced 5-4-3-2-1 senses exercise below it. One state object advances
 * on a one-second tick; the square's scale is fully derived from the current
 * phase, so the updater stays pure and StrictMode-safe. Scaling is disabled
 * when reduced motion is preferred.
 */
function BreathingBox() {
  const reduce = useReducedMotion();
  const [presetId, setPresetId] = React.useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const [running, setRunning] = React.useState(false);
  const [breath, setBreath] = React.useState<BreathState>(() =>
    idleFor(PRESETS[0])
  );

  React.useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setBreath((st) => {
        if (st.secondsLeft > 1) {
          return { ...st, secondsLeft: st.secondsLeft - 1 };
        }
        const nextPhaseIdx = (st.phaseIdx + 1) % preset.phases.length;
        return {
          phaseIdx: nextPhaseIdx,
          secondsLeft: preset.phases[nextPhaseIdx].seconds,
          rounds: nextPhaseIdx === 0 ? st.rounds + 1 : st.rounds,
          started: true,
        };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running, preset]);

  const phase = preset.phases[breath.phaseIdx];

  // The square is large while filling or holding full, small while
  // emptying or holding empty. No state needed for the scale itself.
  const big = phase.action === "grow" || phase.action === "hold-big";
  const scale = breath.started || running ? (big ? 1.5 : 0.75) : 1;

  function handleToggle() {
    if (!running && !breath.started) {
      // First press: kick off the first phase of the current pattern.
      setBreath({ ...idleFor(preset), started: true });
    }
    setRunning((r) => !r);
  }

  function handleReset() {
    setRunning(false);
    setBreath(idleFor(preset));
  }

  function handlePreset(nextId: string) {
    if (nextId === presetId) return;
    const nextPreset = PRESETS.find((p) => p.id === nextId) ?? PRESETS[0];
    setPresetId(nextId);
    setRunning(false);
    setBreath(idleFor(nextPreset));
  }

  const isIdle = !breath.started && !running;

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
      {/* Pattern picker */}
      <div
        role="group"
        aria-label="Breathing pattern"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === presetId}
            onClick={() => handlePreset(p.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              p.id === presetId
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
      <p className="mt-2.5 min-h-4 text-center text-xs text-muted-foreground">
        {preset.hint}
      </p>

      <div
        className="relative mt-5 flex size-40 items-center justify-center sm:size-48"
        aria-hidden="true"
      >
        {/* Track outline */}
        <div className="absolute inset-0 rounded-3xl border border-dashed border-primary/25" />
        {/* The breathing square */}
        <div
          className="size-32 rounded-2xl bg-primary/80 shadow-lg shadow-primary/20 sm:size-36"
          style={{
            transform: `scale(${reduce ? 1 : scale})`,
            transition:
              !reduce && running
                ? `transform ${phase.seconds}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`
                : "none",
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground">
          {isIdle ? "Ready" : phase.label}
        </span>
      </div>

      <p
        className="mt-5 min-h-5 text-sm text-muted-foreground"
        aria-live="polite"
      >
        {isIdle
          ? preset.idleHint
          : `${secondsText(breath.secondsLeft)} left in this step`}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Button
          onClick={handleToggle}
          className="rounded-full px-6"
          aria-label={
            running ? "Pause the breathing exercise" : "Start the breathing exercise"
          }
        >
          {running ? (
            <>
              <Pause className="size-4" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4" aria-hidden="true" />
              {breath.started ? "Resume" : "Start"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isIdle}
          className="rounded-full border-primary/30"
          aria-label="Reset the breathing exercise"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {breath.rounds > 0
          ? `Completed rounds: ${breath.rounds}. Two to four rounds are usually enough to feel a shift.`
          : "Most people notice a shift within two to four rounds."}
      </p>
    </div>
  );
}

function secondsText(n: number) {
  return `${n} second${n === 1 ? "" : "s"}`;
}

export function Grounding() {
  return (
    <section
      id="grounding"
      aria-labelledby="grounding-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <Reveal>
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary text-center lg:text-left">
                Something to try right now
              </span>
              <h2
                id="grounding-heading"
                className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl text-center lg:text-left"
              >
                Feeling on edge? Start here.
              </h2>
              <div className="mt-4 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground text-center lg:text-left">
                <p>
                  This is the first skill I teach most people who start with
                  me over video. A slow, even exhale is the clearest signal
                  you can send a revved-up nervous system that the emergency
                  is over.
                </p>
                <p>
                  The widget carries the three breathing patterns I hand out
                  most. Box breathing for steadying a jumpy system. 4-7-8
                  when the problem is falling asleep. An even five-in,
                  five-out pace if the holds make you antsy. Below it sits a
                  second tool, 5-4-3-2-1, for the times when breathing alone
                  doesn&apos;t reach. There&apos;s no wrong way to do any of
                  this: if the counts feel tight, make them smaller and work
                  up.
                </p>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wind className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  One honest note: breathing exercises don&apos;t replace
                  therapy, and they work best as practice, not rescue. If
                  you&apos;re in crisis, call or text{" "}
                  <a
                    href="tel:988"
                    className="underline-offset-4 hover:underline"
                  >
                    <strong className="text-foreground">988</strong>
                  </a>
                  . This tool is for the hard minutes in between.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Widget */}
          <Reveal delay={0.12} y={20}>
            <div className="flex flex-col gap-6">
              <BreathingBox />
              <SensesGrounding />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
