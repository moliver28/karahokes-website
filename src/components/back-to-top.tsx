"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 23;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Floating back-to-top control for the long single page. Appears after the
 * visitor scrolls past the hero. The ring around the arrow fills as the
 * visitor travels down the page, a quiet progress cue that also explains
 * what the button does. The reveal is opacity-only so it stays calm for
 * reduced-motion users, and the ring is scroll-driven rather than animated.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > 600);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      // One update per animation frame keeps the scroll handler cheap even
      // during fast flicks on a trackpad.
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // <aside> (a named landmark) wraps the floating control so it is
    // contained by landmarks (axe: region). Positioning lives on the
    // wrapper; the link keeps its own size and styling.
    <aside aria-label="Page tools" className="fixed bottom-5 right-5 z-40">
      <a
        href="#home"
        // Static, human label. The progress ring is decorative (the svg is
        // aria-hidden), so the percentage no longer churns the accessible
        // name on every scroll tick.
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className={[
          "flex size-12 items-center justify-center",
          "rounded-full bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/25 transition-opacity duration-300",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          visible ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        {/* Progress ring: track underneath, fill drawn on top. */}
        <svg
          viewBox="0 0 52 52"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -rotate-90"
        >
          <circle
            cx="26"
            cy="26"
            r={RADIUS}
            fill="none"
            strokeWidth="2.5"
            className="stroke-primary-foreground/25"
          />
          <circle
            cx="26"
            cy="26"
            r={RADIUS}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="stroke-primary-foreground/90 transition-[stroke-dashoffset] duration-150 ease-out"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <ArrowUp className="relative size-5" aria-hidden="true" />
      </a>
    </aside>
  );
}
