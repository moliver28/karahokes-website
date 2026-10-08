"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";

/**
 * Mobile-only companion to the back-to-top control: taps the visitor down
 * one section at a time. The target is the first section whose top edge
 * sits below the current anchor position, and the button hides once the
 * page has nothing left below (back-to-top takes over there). A real
 * anchor link is used on purpose, so the sticky-header scroll padding and
 * the reduced-motion rules in globals.css apply unchanged.
 */
export function NextSectionButton() {
  const [nextId, setNextId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // When the visitor is anchored at a section, its top edge rests
      // exactly scroll-padding-top below the viewport top — the old fixed
      // 4px threshold matched it, so the button kept targeting the section
      // already on screen. Clearing the padding skips the current section.
      const doc = document.documentElement;
      const padding = parseFloat(getComputedStyle(doc).scrollPaddingTop) || 88;
      const next = Array.from(
        document.querySelectorAll<HTMLElement>("main section[id]"),
      ).find((section) => section.getBoundingClientRect().top > padding + 1);
      setNextId(next ? next.id : null);
    };
    const onScroll = () => {
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
    // Sits just left of the back-to-top button (which owns right-5 and is
    // 3rem wide), forming a [down][up] pair on phones; hidden on md+, where
    // the header navigation already covers section jumps.
    <aside
      aria-label="Section navigation"
      className="fixed bottom-5 right-[4.75rem] z-40 md:hidden"
    >
      <a
        href={nextId ? `#${nextId}` : undefined}
        aria-label="Go to next section"
        tabIndex={nextId ? 0 : -1}
        aria-hidden={!nextId}
        className={[
          "flex size-12 items-center justify-center",
          "rounded-full bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/25 transition-opacity duration-300",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          nextId ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <ArrowDown className="size-5" aria-hidden="true" />
      </a>
    </aside>
  );
}
