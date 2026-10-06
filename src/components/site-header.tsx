"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#communities", label: "Who I Work With" },
  { href: "#specialties", label: "Specialties" },
  { href: "#insurance", label: "Insurance" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // Scroll-spy: highlights the nav link for the section currently in view.
  // Uses a band around the upper-middle of the viewport so the highlighted
  // section matches what the visitor is actually reading.
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  // The mobile Sheet is a Radix Dialog whose trigger carries an auto-generated
  // `aria-controls` ID. In rare cases (a browser extension mutating the DOM
  // before hydration, or a Turbopack dev hot-reload cycle) that ID can drift
  // between server and client and trigger a hydration warning. We defer
  // rendering the Radix Sheet until after mount so the SSR HTML for the mobile
  // menu trigger carries no Radix-generated attributes, making a mismatch
  // impossible. The placeholder button is visually identical to the real one.
  const [mounted, setMounted] = React.useState(false);
  // Where a mobile-menu visitor asked to go, if their link click had to be
  // deferred until the Sheet's scroll lock releases (see effect below).
  const pendingHash = React.useRef<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Track each section's visibility so the highlight can also be CLEARED
    // when no observed section sits in the band (e.g. back at the very top,
    // where the hero occupies the viewport and nothing should be active).
    // Keyed by Element because that is what IntersectionObserver reports;
    // the `sections` lookup below still narrows to HTMLElement.
    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting);
        }
        const active = sections.find((s) => visibility.get(s)) ?? null;
        setActiveSection(active ? active.id : null);
      },
      // A horizontal band near the top third of the viewport: whichever
      // section occupies it counts as "being read".
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Anchor jumps from inside the mobile Sheet die halfway: while the Sheet
  // is open Radix locks body scroll, and the lock lingers through the exit
  // animation, so the browser's native hash smooth-scroll is cut off and the
  // page lands partway to the target. Instead: the link cancels the native
  // jump, records where the visitor asked to go, and this effect scrolls us
  // there ourselves once the Sheet has closed and the lock has released.
  React.useEffect(() => {
    if (open || !pendingHash.current) return;
    const timer = window.setTimeout(() => {
      const target = pendingHash.current;
      if (!target) return;
      pendingHash.current = null;
      const el = document.getElementById(target.slice(1));
      if (!el) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      // Reflect the destination in the address bar without triggering a
      // second, native jump (the scroll-padding-top on <html> keeps the
      // sticky header from covering the section heading).
      window.history.replaceState(null, "", target);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-[0_4px_24px_-12px_rgba(40,30,15,0.18)]"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20">
        {/* Brand */}
        <Link
          href="#home"
          className="group flex items-center gap-2.5"
          aria-label="Kara Hokes, PhD, clinical psychologist, home"
        >
          {/* The practice photo makes the brand a person, not a logo: this
              is a one-clinician practice and the face is the brand. alt is
              empty because the name sits right beside it. */}
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <Image
              src={SITE.avatar}
              alt=""
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {SITE.shortName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {SITE.role}
            </span>
          </span>
        </Link>

        {/* Desktop nav. Appears from lg up: at md widths the six links plus
            brand, phone, and CTA overflow the header (measured 1060px of
            content in a 768px viewport), so tablets use the mobile Sheet. */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={activeSection === l.href.slice(1) ? "true" : undefined}
              className={cn(
                "relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                // Growing underline on hover: a small, quiet motion cue that
                // the link is live. The active section keeps its tint pill
                // instead, so the two states never stack.
                "after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:content-[''] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary/60 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
                activeSection === l.href.slice(1)
                  ? "bg-secondary/70 text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA. The phone number yields to space first: it returns
            at xl once the viewport can carry all four header parts. */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-1.5 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground xl:flex"
            aria-label="Call the practice"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <Button
            asChild
            size="default"
            className="rounded-full shadow-sm shadow-primary/15"
          >
            <a href="#contact">Book a Consultation</a>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[88%] max-w-sm border-l border-border bg-background p-0"
              >
                <SheetHeader className="px-5 pt-5">
                  <SheetTitle className="font-serif text-lg text-foreground">
                    Navigation
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Jump to any section of the page, or request a
                    consultation.
                  </SheetDescription>
                </SheetHeader>
                <nav
                  className="flex flex-col gap-1 px-3 py-4"
                  aria-label="Mobile"
                >
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => {
                        // Close the Sheet ourselves. (Wrapping in SheetClose
                        // does not survive this preventDefault: Radix's
                        // composed close handler skips itself when the event's
                        // default is prevented, which would leave the Sheet
                        // open and the scroll lock engaged.) The native jump
                        // is cancelled because the Sheet's scroll lock
                        // strangles it mid-flight; the open-state effect
                        // takes over once the Sheet finishes closing.
                        e.preventDefault();
                        pendingHash.current = l.href;
                        setOpen(false);
                      }}
                      aria-current={activeSection === l.href.slice(1) ? "true" : undefined}
                      className={cn(
                        "rounded-md px-3 py-3 text-base font-medium transition-colors",
                        activeSection === l.href.slice(1)
                          ? "bg-secondary/70 text-foreground"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3 border-t border-border px-5 py-5">
                  <Button asChild className="rounded-full">
                    <a
                      href="#contact"
                      onClick={(e) => {
                        // Same deferred-scroll path as the nav links above:
                        // a native jump from inside the Sheet gets cut off
                        // by the scroll lock.
                        e.preventDefault();
                        pendingHash.current = "#contact";
                        setOpen(false);
                      }}
                    >
                      Book a Consultation
                    </a>
                  </Button>
                  <a
                    href={SITE.phoneHref}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            // SSR / pre-hydration placeholder: visually identical to the real
            // trigger (same variant/size/className/icon/aria-label) but carries
            // no Radix-generated attributes, so there is nothing for React to
            // mismatch against during hydration. It is a no-op button: the
            // real Sheet replaces it the moment React mounts.
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Open navigation menu"
              tabIndex={-1}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
