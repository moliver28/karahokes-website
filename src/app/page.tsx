import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { PrintCrisisSheet } from "@/components/print-crisis-sheet";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Communities } from "@/components/sections/communities";
import { Specialties } from "@/components/sections/specialties";
import { Concerns } from "@/components/sections/concerns";
import { Grounding } from "@/components/sections/grounding";
import { Approach } from "@/components/sections/approach";
import { Reading } from "@/components/sections/reading";
import { Insurance } from "@/components/sections/insurance";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Providers } from "@/components/sections/providers";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { SITE } from "@/lib/site";

const SITE_URL = SITE.siteUrl;

/**
 * Structured data for search engines: the practice (schema.org Psychologist,
 * a LocalBusiness/MedicalBusiness subtype) plus the FAQ so questions can be
 * eligible for rich results. Answers must mirror the rendered copy, so both
 * read from src/lib/faq-data.ts. The Psychology Today profile is listed as
 * sameAs so search engines can tie the two together.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Psychologist",
      "@id": `${SITE_URL}/#practice`,
      name: `${SITE.name}: ${SITE.role} (Telehealth)`,
      alternateName: SITE.fullName,
      description:
        "Clinical psychologist with almost 10 years of experience specializing in trauma and PTSD, emotion regulation, and sexual abuse recovery. Online-only practice: secure video sessions across Washington State (most major insurance accepted) and PSYPACT states (private pay).",
      url: SITE_URL,
      telephone: SITE.phoneJsonLd,
      email: SITE.email,
      priceRange: SITE.fee,
      paymentAccepted:
        "In-network insurance (full plan list on this site), private pay, sliding scale",
      // Practice-provided photographs; search engines use these for the
      // knowledge panel instead of guessing from the page.
      image: [`${SITE_URL}${SITE.portrait}`, `${SITE_URL}${SITE.avatar}`],
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        postalCode: SITE.postalCode,
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "State", name: "Washington" },
        {
          "@type": "AdministrativeArea",
          name: "PSYPACT participating states",
        },
      ],
      availableService: [
        {
          "@type": "MedicalTherapy",
          name: "Cognitive Processing Therapy (CPT)",
        },
        {
          "@type": "MedicalTherapy",
          name: "Dialectical Behavior Therapy (DBT)",
        },
        {
          "@type": "MedicalTherapy",
          name: "Acceptance and Commitment Therapy (ACT)",
        },
        { "@type": "MedicalTherapy", name: "Prolonged Exposure (PE)" },
        { "@type": "MedicalTherapy", name: "Cognitive Behavioral Therapy (CBT)" },
      ],
      knowsAbout: [
        "Trauma and PTSD",
        "Emotion dysregulation",
        "Sexual abuse recovery",
        "Domestic violence",
        "Veterans mental health",
        "Anxiety",
        "Anger management",
        "Perinatal mental health",
        "Culturally responsive care",
        "Prolonged Exposure (PE)",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "17:00",
        },
      ],
      sameAs: [SITE.psychologyToday],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <SiteHeader />

      {/* tabIndex={-1} lets the skip link actually move keyboard focus
          here; outline-none keeps that programmatic focus invisible. */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <About />
        <Communities />
        <Specialties />
        <Concerns />
        <Grounding />
        <Approach />
        <Reading />
        {/* Insurance lives right before the FAQ: the top nav links here
            directly, and practical cost questions belong beside the
            questions people ask about them. */}
        <Insurance />
        <Faq />
        <Contact />
        {/* Referrers are the second audience (PCPs vet before they send
            someone); it lives after Contact so the client path is never
            interrupted, and reachable from the footer's quick links. */}
        <Providers />
      </main>

      <SiteFooter />
      <BackToTop />

      {/* Hidden on screen; becomes the only visible content when printed. */}
      <PrintCrisisSheet />

      {/* Machine-readable practice + FAQ data (search engine rich results) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
