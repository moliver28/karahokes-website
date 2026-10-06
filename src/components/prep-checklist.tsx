"use client";

import * as React from "react";
import { ClipboardList, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kara-hokes-prep-v1";

const PREP_ITEMS = [
  {
    id: "quiet",
    label: "A quiet spot where you won't be interrupted",
  },
  {
    id: "headphones",
    label: "Headphones, if they help you talk freely",
  },
  {
    id: "questions",
    label: "Your questions, written down if you like",
  },
  {
    id: "water",
    label: "Water or tea nearby. A sip is a good pause button.",
  },
] as const;

type CheckedMap = Partial<Record<(typeof PREP_ITEMS)[number]["id"], boolean>>;

/**
 * "Before the intro call" checklist. Checks persist in localStorage so the
 * list is still ticked on a return visit. Only checkbox state is stored,
 * never anything typed.
 */
export function PrepChecklist({ className }: { className?: string }) {
  const [checked, setChecked] = React.useState<CheckedMap>({});
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setChecked(parsed as CheckedMap);
        }
      }
    } catch {
      // Private browsing or blocked storage: the checklist still works,
      // it just won't remember between visits.
    }
    setLoaded(true);
  }, []);

  const count = PREP_ITEMS.filter((item) => checked[item.id]).length;
  const allChecked = count === PREP_ITEMS.length;

  function update(id: (typeof PREP_ITEMS)[number]["id"], value: boolean) {
    setChecked((prev) => {
      const next = { ...prev, [id]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable; state still updates for this visit.
      }
      return next;
    });
  }

  function clearAll() {
    setChecked({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Same story: works for this visit either way.
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Before the intro call
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            You don&apos;t need to prepare anything for a 15-minute phone
            call. If a little structure helps you feel steady, this is the
            whole list.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {PREP_ITEMS.map((item) => (
          <li key={item.id}>
            <label
              htmlFor={`prep-${item.id}`}
              className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50"
            >
              <Checkbox
                id={`prep-${item.id}`}
                checked={!!checked[item.id]}
                onCheckedChange={(v) => update(item.id, v === true)}
                className="mt-0.5"
                aria-label={item.label}
              />
              <span className={cn(checked[item.id] && "text-foreground")}>
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <p
          className="text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {count === 0
            ? "Nothing needed yet."
            : allChecked
              ? "All set. That's genuinely everything."
              : `${count} of ${PREP_ITEMS.length} ready.`}
        </p>
        {count > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={!loaded}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Clear checks
          </button>
        )}
      </div>
    </div>
  );
}
