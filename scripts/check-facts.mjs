/**
 * check-facts.mjs — phone/email parity across the three surfaces that carry
 * the practice's contact facts:
 *
 *   src/lib/site.ts            phoneDisplay / phoneHref / phoneJsonLd / email
 *   public/dr-kara-hokes.vcf   TEL / EMAIL lines
 *   worker/src/index.ts        PRACTICE_PHONE_DISPLAY
 *
 * Zero dependencies (node:fs + regex only). Run: node scripts/check-facts.mjs
 * Exits 0 with "facts OK" when every surface agrees; otherwise prints each
 * mismatch (file + expected vs found) and exits 1.
 */

import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);

const SITE = "src/lib/site.ts";
const VCF = "public/dr-kara-hokes.vcf";
const WORKER = "worker/src/index.ts";

function readFile(relPath) {
  try {
    return readFileSync(new URL(relPath, root), "utf8");
  } catch (err) {
    console.error(`check-facts: cannot read ${relPath}: ${err.message}`);
    process.exit(1);
  }
}

const failures = [];

function extract(file, what, text, re) {
  const m = text.match(re);
  if (!m) {
    failures.push(`${file}: could not find ${what} (tried /${re.source}/)`);
    return null;
  }
  // trim(): vcf lines may carry a trailing \r on Windows (CRLF), and the
  // email comparison must not fail on it.
  return m[1].trim();
}

// --- Extract ---

const site = readFile(SITE);
const vcf = readFile(VCF);
const worker = readFile(WORKER);

const phoneDisplay = extract(SITE, 'phoneDisplay: "..."', site, /phoneDisplay:\s*"([^"]+)"/);
const phoneHref = extract(SITE, 'phoneHref: "..."', site, /phoneHref:\s*"([^"]+)"/);
const phoneJsonLd = extract(SITE, 'phoneJsonLd: "..."', site, /phoneJsonLd:\s*"([^"]+)"/);
const siteEmail = extract(SITE, 'email: "..."', site, /email:\s*"([^"]+)"/);

const vcfTel = extract(VCF, "a TEL line (TEL;TYPE=...:+number)", vcf, /^TEL[^:\r\n]*:(.+)$/m);
const vcfEmail = extract(VCF, "an EMAIL line (EMAIL;TYPE=...:address)", vcf, /^EMAIL[^:\r\n]*:(.+)$/m);

const workerDisplay = extract(WORKER, 'PRACTICE_PHONE_DISPLAY = "..."', worker, /PRACTICE_PHONE_DISPLAY\s*=\s*"([^"]+)"/);

// --- Normalize ---

const digits = (s) => s.replace(/\D/g, "");
// US national form: drop a leading country-code "1" from 11-digit numbers so
// "+13603585174" and "(360) 358-5174" compare equal.
const national = (s) => {
  const d = digits(s);
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
};

// --- Assert ---

if (phoneDisplay && workerDisplay) {
  const a = national(phoneDisplay);
  const b = national(workerDisplay);
  if (a !== b) {
    failures.push(
      `phone display mismatch (site vs worker):\n` +
        `  ${SITE} phoneDisplay            = "${phoneDisplay}" (digits ${a})\n` +
        `  ${WORKER} PRACTICE_PHONE_DISPLAY = "${workerDisplay}" (digits ${b})`
    );
  }
}

if (phoneDisplay && vcfTel) {
  const a = national(phoneDisplay);
  const b = national(vcfTel);
  if (a !== b) {
    failures.push(
      `phone mismatch (site vs vCard):\n` +
        `  ${SITE} phoneDisplay            = "${phoneDisplay}" (digits ${a})\n` +
        `  ${VCF} TEL                      = "${vcfTel}" (digits ${b})`
    );
  }
}

if (phoneDisplay && phoneJsonLd) {
  const a = national(phoneDisplay);
  const b = national(phoneJsonLd);
  if (a !== b) {
    failures.push(
      `phone mismatch (site display vs JSON-LD):\n` +
        `  ${SITE} phoneDisplay            = "${phoneDisplay}" (digits ${a})\n` +
        `  ${SITE} phoneJsonLd             = "${phoneJsonLd}" (digits ${b})`
    );
  }
}

if (phoneHref) {
  if (!/^tel:/i.test(phoneHref)) {
    failures.push(`${SITE} phoneHref must start with "tel:" — found "${phoneHref}"`);
  }
  const hrefDigits = digits(phoneHref);
  if (vcfTel && hrefDigits !== digits(vcfTel)) {
    failures.push(
      `phoneHref E.164 digits mismatch (site vs vCard):\n` +
        `  ${SITE} phoneHref               = "${phoneHref}" (digits ${hrefDigits})\n` +
        `  ${VCF} TEL                      = "${vcfTel}" (digits ${digits(vcfTel)})`
    );
  }
  if (phoneDisplay && national(phoneHref) !== national(phoneDisplay)) {
    failures.push(
      `phoneHref digits mismatch (site href vs display):\n` +
        `  ${SITE} phoneHref               = "${phoneHref}" (digits ${hrefDigits})\n` +
        `  ${SITE} phoneDisplay            = "${phoneDisplay}" (digits ${national(phoneDisplay)})`
    );
  }
}

if (siteEmail && vcfEmail && siteEmail !== vcfEmail) {
  failures.push(
    `email mismatch (site vs vCard):\n` +
      `  ${SITE} email                   = "${siteEmail}"\n` +
      `  ${VCF} EMAIL                    = "${vcfEmail}"`
  );
}

// --- Report ---

if (failures.length > 0) {
  console.error(`check-facts: ${failures.length} mismatch${failures.length === 1 ? "" : "es"} found:`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log("facts OK");
