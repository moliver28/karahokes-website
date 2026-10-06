"use client";

import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small quiet button that opens the browser's print dialog. The page has a
 * dedicated print layout (globals.css): on paper only the crisis-and-contact
 * sheet appears, so what comes out of the printer is genuinely useful to
 * keep somewhere safe.
 */
export function PrintButton({
  className,
  label = "Print this info",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Print a one-page sheet with crisis numbers and practice contact info"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors",
        "hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <Printer className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
