/**
 * A print-only sheet. Hidden on screen (`hidden` class); when someone
 * prints or saves as PDF, the @media print rules in globals.css hide the
 * rest of the page and show only this block: the practice's contact details
 * plus the crisis numbers. People in unsafe situations are often advised to
 * keep a printed copy of resources somewhere safe, so this is written to
 * survive a black-and-white printer. The hotline list matches who this
 * practice serves: veterans, survivors of domestic and sexual violence,
 * and LGBTQ+ community members.
 */
import { SITE } from "@/lib/site";

export function PrintCrisisSheet() {
  // Identity facts come from SITE so the printed sheet can never disagree
  // with the website it was printed from.
  const siteUrl = new URL(SITE.siteUrl).host;

  return (
    <div className="print-sheet hidden font-sans text-sm leading-relaxed text-foreground">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-foreground pb-3">
        {/* A <p>, not an <h1>: the sheet lives inside the page's HTML, and the
            page already has exactly one h1 (the hero). Screen readers skip the
            hidden block anyway; print styling keeps the same look. */}
        <p className="font-serif text-2xl font-semibold">
          {SITE.name}: {SITE.role}
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest">
          Print &amp; keep
        </p>
      </div>

      <p className="mt-4 font-semibold">
        {SITE.fullName}. Licensed in Washington State (#{SITE.licenseNumber}).
        PSYPACT certified.
      </p>
      <p>Phone: {SITE.phoneDisplay}</p>
      <p>Email: {SITE.email}</p>
      <p>
        Online only: secure video sessions across Washington State, and
        private-pay in PSYPACT states.
      </p>
      <p>Hours: {SITE.hoursDisplay}.</p>

      <div className="mt-6 border-t border-foreground/40 pt-4">
        <h2 className="font-serif text-lg font-semibold">
          If you&apos;re in crisis right now
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            If you&apos;re in immediate danger, call <strong>911</strong> or
            go to your nearest emergency room.
          </li>
          <li>
            Call or text <strong>988</strong> for the Suicide &amp; Crisis
            Lifeline. Free and staffed 24/7.
          </li>
          <li>
            Veterans: call <strong>988</strong> and press <strong>1</strong>,
            or text <strong>838255</strong>, for the Veterans Crisis Line.
          </li>
          <li>
            Domestic violence: <strong>1-800-799-7233</strong> (National DV
            Hotline), or text <strong>START</strong> to <strong>88788</strong>.
          </li>
          <li>
            Sexual assault: <strong>1-800-656-4673</strong> (RAINN National
            Sexual Assault Hotline), free and 24/7.
          </li>
          <li>
            LGBTQ+ young people: <strong>1-866-488-7386</strong> (The Trevor
            Project).
          </li>
          <li>
            Text <strong>HOME</strong> to <strong>741741</strong> for the
            Crisis Text Line. Free and staffed 24/7.
          </li>
        </ul>
      </div>

      <p className="mt-6 border-t border-foreground/40 pt-4 text-xs">
        The contact form on the website isn&apos;t monitored around the clock,
        so please don&apos;t use email for emergencies.
      </p>
      <p className="mt-2 text-xs">Printed from {siteUrl}.</p>
    </div>
  );
}
