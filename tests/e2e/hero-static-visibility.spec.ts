import { expect, test } from "@playwright/test";

// The hero is the LCP element. Its content must paint from HTML + CSS alone:
// no-JS visitors and crawlers still get the headline, and reduced-motion
// visitors get it with no movement. framer-motion reveals render
// `opacity: 0` inline until hydration, so they cannot satisfy this; the hero
// therefore uses a CSS-only fade-up (see .hero-fade-up in globals.css).
//
// Note on assertions: opacity is NOT inherited, so the h1's own computed
// opacity stays 1 even inside an opacity-0 wrapper (and Playwright counts
// opacity: 0 as "visible"). The real pin is the reveal WRAPPER around the
// h1: it must end at computed opacity 1 without any JavaScript.

test("hero h1 paints with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  const h1 = page.locator("#hero-heading");
  await expect(h1).toBeVisible();
  // The wrapper carrying the reveal must be fully opaque without JS.
  await expect(h1.locator("xpath=..")).toHaveCSS("opacity", "1");

  await context.close();
});

test("hero h1 paints with no motion under prefers-reduced-motion", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  const h1 = page.locator("#hero-heading");
  await expect(h1).toBeVisible();
  await expect(h1.locator("xpath=..")).toHaveCSS("opacity", "1");
  // Reduced-motion visitors get static content: no fade-up at all.
  await expect(h1.locator("xpath=..")).toHaveCSS("animation-name", "none");

  await context.close();
});
