/**
 * Single source of truth for the practice's accepted insurance plans,
 * sourced from the Psychology Today profile. The Insurance & Fees section
 * renders its card grid from INSURANCE_PLANS, and the FAQ answer builds
 * its sentence from INSURANCE_LIST_TEXT, so the two can never drift apart
 * (the FAQ answer also feeds the FAQPage JSON-LD, which keeps search
 * engines in sync with the rendered page).
 */
export type InsurancePlan = { name: string };

export const INSURANCE_PLANS: InsurancePlan[] = [
  { name: "Aetna" },
  { name: "Aetna Medicare" },
  { name: "Ambetter" },
  { name: "Blue Cross" },
  { name: "BlueCross BlueShield" },
  { name: "Carelon Behavioral Health" },
  { name: "Cigna EAP" },
  { name: "Curative" },
  { name: "Medicare" },
  { name: "Moda Health" },
  { name: "Optum" },
  { name: "Oxford" },
  { name: "Premera Blue Cross" },
  { name: "Providence" },
  { name: "Regence" },
  { name: "Velocity National Provider Network" },
];

/**
 * How each plan reads inside the FAQ's spoken-style sentence. The two
 * special forms exist so the generated FAQ answer stays byte-identical to
 * the copy that was written and reviewed before the Insurance section
 * existed (including the "the" before Velocity and the EAP gloss).
 */
const SENTENCE_FORMS: Record<string, string> = {
  "Cigna EAP":
    "Cigna EAP (that's an Employee Assistance Program; if your employer offers one, sessions may be covered)",
  "Velocity National Provider Network": "the Velocity National Provider Network",
};

export const INSURANCE_LIST_TEXT = (() => {
  const items = INSURANCE_PLANS.map((p) => SENTENCE_FORMS[p.name] ?? p.name);
  const head = items.slice(0, -1).join(", ");
  return `${head}, and ${items[items.length - 1]}`;
})();
