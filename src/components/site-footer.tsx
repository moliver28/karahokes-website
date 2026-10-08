import Link from "next/link";
import { Leaf, Mail, Phone, Video, LifeBuoy } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { SITE } from "@/lib/site";

const QUICK_LINKS = [
  { href: "#about", label: "About" },
  { href: "#communities", label: "Who I Work With" },
  { href: "#specialties", label: "Treatments" },
  { href: "#grounding", label: "Grounding" },
  { href: "#approach", label: "Approach" },
  { href: "#reading", label: "Reading" },
  { href: "#insurance", label: "Insurance & Fees" },
  { href: "#faq", label: "FAQ" },
  { href: "#clinicians", label: "For Clinicians" },
  { href: "#providers", label: "For Referring Providers" },
  { href: "#contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-border/70 bg-secondary/40"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Evidence-based trauma and emotion-regulation therapy by secure
              video, across Washington State and PSYPACT states. I help
              people face what happened and move past it.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  {l.href === "#clinicians" ? (
                    // Native anchor (not next/link) on purpose: hash-only
                    // navigation through Next's router uses pushState and
                    // never fires `hashchange`, which the FAQ deep link
                    // relies on to auto-open the consultation question.
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-start gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-start gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Video className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden="true" />
                <span>
                  Available online only
                  <br />
                  Based in Tacoma, WA
                </span>
              </li>
            </ul>
          </div>

          {/* Crisis + credentials */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              In a Crisis?
            </h3>
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <LifeBuoy className="size-4 text-destructive" aria-hidden="true" />
                988: Suicide &amp; Crisis Lifeline
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                If you are in immediate danger, call{" "}
                <a
                  href="tel:988"
                  className="underline-offset-4 hover:underline"
                >
                  <strong>988</strong>
                </a>{" "}
                or{" "}
                <a
                  href="tel:911"
                  className="underline-offset-4 hover:underline"
                >
                  <strong>911</strong>
                </a>
                , or go to your nearest emergency room. You can also text{" "}
                <strong>HOME</strong> to{" "}
                <a
                  href="sms:741741"
                  className="underline-offset-4 hover:underline"
                >
                  <strong>741741</strong>
                </a>{" "}
                to reach the Crisis Text Line, free and staffed 24/7.
                Veterans:{" "}
                <a
                  href="tel:988"
                  className="underline-offset-4 hover:underline"
                >
                  988
                </a>
                , then press 1. Domestic violence:{" "}
                <a
                  href="tel:+18007997233"
                  className="underline-offset-4 hover:underline"
                >
                  1-800-799-7233
                </a>
                . This form is not monitored around the clock.
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-destructive/15 pt-3">
                <PrintButton label="Print" />
                <span className="text-[11px] leading-snug text-muted-foreground">
                  Keeps these numbers on paper.
                </span>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">
                {SITE.shortName}, {SITE.credentialsLine}
              </strong>
              <br />
              {SITE.role}
              <br />
              WA License #{SITE.licenseNumber} · {SITE.psypact}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>
            <p>
              © {year} Kara Hokes, PhD. All rights reserved.
            </p>
            {/* Static on purpose: a healthcare content review date is a
                promise about a human reading the page, not about a build. */}
            <p className="mt-1 text-[11px]">
              Content last reviewed by Dr. Hokes: October 2026.
            </p>
          </div>
          <p className="text-[11px]">
            The information on this site is for educational purposes and is not a
            substitute for professional care.
          </p>
        </div>
      </div>
    </footer>
  );
}
