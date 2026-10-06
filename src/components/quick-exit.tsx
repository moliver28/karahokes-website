"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Quick exit, a standard safety feature on sites for people dealing with
 * abuse or violence. Uses location.replace so the site doesn't stay in the
 * back-button history of the neutral page it jumps to.
 */

const NEUTRAL_URL = "https://www.google.com";
const ESCAPE_WINDOW_MS = 2000;
const ESCAPES_REQUIRED = 3;

// Two QuickExit buttons render on the page (crisis card + footer). Both
// call this once; a module flag keeps exactly one listener no matter how
// many instances mount.
let escapeListenerBound = false;

function bindEscapeQuickExit(): void {
  if (escapeListenerBound || typeof window === "undefined") return;
  escapeListenerBound = true;

  const presses: number[] = [];
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Escape") {
      presses.length = 0;
      return;
    }
    const now = Date.now();
    presses.push(now);
    // Drop presses older than the window, then leave once enough land
    // inside it. Radix dialogs and accordions also listen for a single
    // Escape; three fast presses are deliberate and cost them nothing.
    while (presses.length > 0 && now - presses[0] > ESCAPE_WINDOW_MS) {
      presses.shift();
    }
    if (presses.length >= ESCAPES_REQUIRED) {
      window.location.replace(NEUTRAL_URL);
    }
  });
}

export function QuickExit({ className }: { className?: string }) {
  React.useEffect(() => {
    bindEscapeQuickExit();
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.location.replace(NEUTRAL_URL)}
      aria-label="Leave this site right away and open a neutral website"
      className={cn(
        // min-h-11 keeps the tap target at 44px: on a phone, someone leaving
        // in a hurry shouldn't have to aim at a 30px strip.
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive transition-colors",
        "hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <LogOut className="size-3.5" aria-hidden="true" />
      Quick exit
    </button>
  );
}
