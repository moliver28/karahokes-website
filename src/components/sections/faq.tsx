"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { CLINICIAN_FAQ_INDEX, FAQ_ITEMS } from "@/lib/faq-data";
import { SITE } from "@/lib/site";

export function Faq() {
  // Controlled so we can auto-open the clinician-consultation question when
  // someone arrives from the footer's "For clinicians" deep link (#clinicians).
  const [value, setValue] = React.useState<string | null>("item-0");

  React.useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash !== "#clinicians") return;
      setValue(`item-${CLINICIAN_FAQ_INDEX}`);
      // Opening this question closes whichever answer was open above it, so
      // the item drifts up as the accordion settles. Wait out that animation,
      // then scroll the item into view below the sticky header.
      window.setTimeout(() => {
        const el = document.getElementById("clinicians");
        if (!el) return;
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }, 420);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-y border-border/60 bg-secondary/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Questions &amp; Answers
            </span>
            <h2
              id="faq-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              Common questions, answered plainly.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Don't see your question?{" "}
              <a
                href="#contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Just ask.
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Accordion
            type="single"
            collapsible
            value={value ?? undefined}
            onValueChange={(v) => setValue(v || null)}
            className="mt-10 w-full rounded-2xl border border-border/70 bg-card px-4 shadow-sm sm:px-6"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                id={i === CLINICIAN_FAQ_INDEX ? "clinicians" : undefined}
                className="border-border/70 px-2 sm:px-3"
              >
                <AccordionTrigger className="text-left font-serif text-base font-medium text-foreground transition-colors hover:text-primary hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Prefer email?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {SITE.email}
            </a>
            . A sentence is plenty; I read every message myself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
