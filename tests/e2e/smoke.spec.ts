import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Host of SITE.formEndpoint (src/lib/site.ts). This suite never POSTs to
// it: the beforeEach route-abort below makes any such request fail
// structurally, and t1 additionally asserts no request URL ever carries it.
const FORM_ENDPOINT_HOST = "karahokes-form.karahokes.workers.dev";

// The consent checkbox is a Radix button[role=checkbox] named by the
// statement beside it (aria-labelledby), not a native input.
const CONSENT_CHECKBOX =
  'button[role="checkbox"][aria-labelledby="consent-statement"]';

test.beforeEach(async ({ page }) => {
  // Structural never-POST guarantee: abort every request to the form
  // worker's host so no test can reach the live backend, even by accident.
  await page.route("**/karahokes-form*karahokes*workers.dev/**", (route) =>
    route.abort()
  );
  await page.goto("/");
});

async function fillNameAndEmail(page: Page) {
  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
}

// Radix Select: click the labelled trigger, then the option in its portal.
async function chooseSelect(page: Page, label: string, option: string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: option }).click();
}

test("t1: consent gate blocks submission with no network request", async ({
  page,
}) => {
  const requestUrls: string[] = [];
  page.on("request", (request) => requestUrls.push(request.url()));

  await fillNameAndEmail(page);
  // The acknowledgement is a form requirement: the checkbox announces and
  // shows that before any submit attempt.
  await expect(page.locator(CONSENT_CHECKBOX)).toHaveAttribute(
    "aria-required",
    "true"
  );
  // Consent left unchecked on purpose: this is the schema-gate proof.
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("Please acknowledge the consent statement to continue.")
  ).toBeVisible();
  await expect(page.getByText("Request received. Thank you.")).toHaveCount(0);
  await expect(page.getByText("Your request went through.")).toHaveCount(0);
  for (const url of requestUrls) {
    expect(
      url,
      `unexpected request reached the form endpoint: ${url}`
    ).not.toContain(FORM_ENDPOINT_HOST);
  }
});

test("t2: phone becomes required when preferred contact is a call", async ({
  page,
}) => {
  await fillNameAndEmail(page);
  await page
    .getByLabel("Best days / times")
    .fill("Weekday mornings");
  await chooseSelect(page, "Preferred contact method", "Phone call");
  // The phone field signals its new requirement immediately.
  await expect(page.getByRole("textbox", { name: /Phone number/ })).toHaveAttribute(
    "aria-required",
    "true"
  );
  await chooseSelect(page, "How did you hear about me?", "Google or another search");
  await page.locator(CONSENT_CHECKBOX).click();
  // Phone left empty on purpose.
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("A phone number is needed so I can call or text you back.")
  ).toBeVisible();
});

test("t2b: phone becomes required for text contact too", async ({ page }) => {
  await fillNameAndEmail(page);
  await page
    .getByLabel("Best days / times")
    .fill("Weekday mornings");
  await chooseSelect(page, "Preferred contact method", "Text message");
  await expect(page.getByRole("textbox", { name: /Phone number/ })).toHaveAttribute(
    "aria-required",
    "true"
  );
  await chooseSelect(page, "How did you hear about me?", "Google or another search");
  await page.locator(CONSENT_CHECKBOX).click();
  // Phone left empty on purpose.
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("A phone number is needed so I can call or text you back.")
  ).toBeVisible();
});

test("t3: availability is required", async ({ page }) => {
  await fillNameAndEmail(page);
  await chooseSelect(page, "How did you hear about me?", "Google or another search");
  await page.locator(CONSENT_CHECKBOX).click();
  // Availability left empty on purpose.
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("Please share a few days or times that could work.")
  ).toBeVisible();
});

test("t4: source is required", async ({ page }) => {
  await fillNameAndEmail(page);
  await page
    .getByLabel("Best days / times")
    .fill("Weekday mornings");
  await page.locator(CONSENT_CHECKBOX).click();
  // Source left unselected on purpose.
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("Please let me know how you found me.")
  ).toBeVisible();
});

test("t5: #contact has no availability pressure and no quick exit", async ({
  page,
}) => {
  const contact = page.locator("#contact");
  // Scoped absences: these strings legitimately survive elsewhere (FAQ,
  // providers), so they are only asserted within #contact.
  await expect(contact).not.toContainText("Immediate availability", {
    ignoreCase: true,
  });
  await expect(contact).not.toContainText("Right now", { ignoreCase: true });
  await expect(
    contact.getByRole("button", { name: /leave this site/i })
  ).toHaveCount(0);
  // Quick exit is removed everywhere, so this absence may be global.
  await expect(page.getByText("Quick exit")).toHaveCount(0);
});

test("t6: Treatments nav link and PE card are present", async ({ page }) => {
  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  await expect(primaryNav.getByRole("link", { name: "Treatments" })).toBeVisible();
  await expect(
    page.locator("#specialties").getByText("Prolonged Exposure (PE)")
  ).toBeVisible();
});

test("t7: practice phone is visible and crisis numbers are real links", async ({
  page,
}) => {
  await expect(page.getByText("(360) 358-5174").first()).toBeVisible();

  const contact = page.locator("#contact");
  await expect(contact.locator('a[href^="tel:988"]').first()).toBeVisible();
  await expect(
    page.locator('footer a[href="sms:741741"]').first()
  ).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
});

test("t8: homepage passes axe WCAG 2.0/2.1 A and AA", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
