/**
 * Single source of truth for the practice's identity facts. Everything
 * user-visible (phone, email, domain, license, fee) derives from here so
 * no component can drift out of sync again. Consumed by the root layout
 * (metadataBase), the sitemap, robots, the page JSON-LD, the printable
 * crisis sheet, and the downloadable vCard.
 *
 * Notes:
 * - Name, credentials, phone, license number, fee, and location come
 *   from the practice's Psychology Today profile:
 *   https://www.psychologytoday.com/us/therapists/kara-hokes-tacoma-wa/1797162
 * - The domain karahokes.com was purchased in October 2026, and the
 *   public mailbox karahokes@gmail.com was supplied by the practice
 *   owner. "www" is the canonical host, so siteUrl keeps the www prefix.
 */
export const SITE = {
  name: "Kara Hokes, PhD",
  shortName: "Kara Hokes",
  fullName: "Dr. Kara Hokes",
  credentialsLine: "PhD, MA, BA",
  role: "Clinical Psychologist",
  pronouns: "she, her",
  phoneDisplay: "(253) 893-3585",
  phoneHref: "tel:+12538933585",
  phoneJsonLd: "+1-253-893-3585",
  email: "karahokes@gmail.com",
  siteUrl: "https://www.karahokes.com",
  license: "Licensed Psychologist, Washington State #61681733",
  licenseShort: "WA #61681733",
  // The bare number, for copy that embeds it in its own phrasing
  // ("verify license #... yourself", "WA License #...").
  licenseNumber: "61681733",
  psypact: "PSYPACT Certified",
  // Usual practice hours, used by the contact card, the print sheet, and
  // the vCard so all three quote the same sentence.
  hoursDisplay: "Most weekdays, 9am to 5pm Pacific",
  city: "Tacoma",
  region: "WA",
  postalCode: "98498",
  fee: "$150 per session",
  feeLine: "$150 per 50-minute session",
  consultMinutes: 15,
  vcardPath: "/dr-kara-hokes.vcf",
  // Where the appointment form POSTs (the Cloudflare Worker backend in
  // worker/, deployed 2026-10-07).
  formEndpoint: "https://karahokes-form.karahokes.workers.dev",
  psychologyToday:
    "https://www.psychologytoday.com/us/therapists/kara-hokes-tacoma-wa/1797162",
  // Practice-provided photographs (supplied directly by the client, so they
  // are the approved profile pictures of record).
  portrait: "/kara-hokes-medium.jpeg",
  avatar: "/kara-hokes-small.jpeg",
} as const;
