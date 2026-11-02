# SEO Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the immediately-doable SEO/performance quick wins from the 2026-11-01 SEO audit (WebP images, hydration-independent hero LCP, E-E-A-T Person schema) as PRs, and file GitHub issues for the larger deferred work.

**Architecture:** Two independent PRs from `main`. PR A (perf): convert raster images in `public/` to WebP (og.png stays PNG, compressed) and make above-fold hero content paint without JavaScript. PR B (feat): add `Person` and `WebSite` nodes to the existing JSON-LD `@graph`. PR B must not modify the `images` property of the JSON-LD — PR A owns all image-path changes.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, sharp via npx (one-off conversion, NO dependency added), Playwright e2e.

**Spec:** SEO audit of 2026-11-01 (this session) + industry standards: Whitespark Local Search Ranking Factors (dedicated service pages = #1 local-organic factor), Google Core Web Vitals (LCP ≤ 2.5s at p75), Google LocalBusiness/Person structured data docs, BrightLocal Local SEO Checklist.

## Global Constraints

- **No lockfile edits, no new dependencies in package.json.** Image conversion via `npx sharp-cli` (npm cache) or a throwaway script in an OS temp dir with `npm i sharp` inside that temp dir only. Never install into the repo.
- **PHI never touches the repo.** Contact form, worker/, crisis resources: untouched.
- **Zero regression:** `npm run lint`, `npx tsc --noEmit` (fix only errors this change set introduces — pre-existing unrelated errors: STOP and report), `npm run build`, `node scripts/check-facts.mjs`, `npm run test:e2e` all green before push.
- Do not modify `next.config.ts` settings (`ignoreBuildErrors`, `reactStrictMode`, `images.unoptimized` stay as-is).
- Crisis-resource links and their labels: untouched.
- Branch names: `(agent|human)/(feat|fix|chore|docs|refactor)/<kebab-slug>`; commits: conventional, single-line.
- PRs are NOT merged by the agent — green CI is reported, human says merge (established workflow).
- Every factual claim in JSON-LD must already exist in `src/lib/site.ts` or on-page copy (the `check-facts.mjs` CI gate enforces factual content).

## Review Focus

1. **Stale `.png` references** after conversion — any component, JSON-LD, or test still pointing at a renamed file = broken image. Pinned by Task 1 Step 6 (grep built `out/` for removed filenames).
2. **No-JS visitors/crawlers must see the hero h1** — this is the whole point of the LCP fix. Pinned by Task 2 Step 1 (Playwright context with `javaScriptEnabled: false`).
3. **Reduced-motion users** — hero fade-up must respect `prefers-reduced-motion` (content visible, no motion). Pinned by Task 2 Step 1 (emulated reduced-motion test).
4. **og.png must stay PNG** (social crawlers are unreliable with WebP OG images) and keep 1344×768. Pinned by Task 1 Step 4.
5. **check-facts gate on new schema** — Person/WebSite nodes use only facts already in `src/lib/site.ts` / on-page copy. Pinned by Task 4 Step 4.

---

## PR A — branch `agent/fix/hero-lcp-webp-images`

### Task 1: Convert raster images to WebP; compress og.png

**Files:**
- Modify (binary): `public/hero-landscape.png`, `public/telehealth-landscape.png`, `public/kara-hokes-medium.jpeg`, `public/kara-hokes-small.jpeg`, `public/book-body-keeps-score.png`, `public/book-didnt-start-with-you.png`, `public/book-living-legacy.png`, `public/book-what-my-bones-know.png` → delete originals, add `.webp` equivalents
- Modify (compress only, keep format+dimensions): `public/og.png` (currently ~200KB, 1344×768)
- Modify: `src/components/sections/hero.tsx:149-152` (CSS `background-image` url), `src/app/layout.tsx:109-114` (`<link rel="preload" as="image">` href), `src/components/sections/reading.tsx:123` (book cover paths), `src/components/sections/about.tsx:162-164` (portrait + alt), `src/app/page.tsx` JSON-LD `images` array (portrait path)
- Check first: `tests/e2e/smoke.spec.ts` and `src/components/site-header.tsx` for any raster-image references (logo is `icon.svg` convention — leave alone). Also grep whole `src/` for each filename before deleting.

**Interfaces:**
- Produces: WebP filenames = same basename with `.webp` extension (e.g. `hero-landscape.webp`), quality 80. og.png unchanged in name/format/dimensions, target < 120KB.

- [ ] **Step 1: Inventory + convert.** `npx sharp-cli` (check `npx sharp-cli --help` for exact flags; typical: `npx sharp-cli -i in.png -o out.webp -f webp -q 80`). If sharp-cli unusable, create `%TEMP%/imgconv/`, `npm i sharp` there, throwaway .mjs script in that dir, pass absolute paths as arguments. Verify each `.webp` exists and is smaller than the original.
- [ ] **Step 2: Compress og.png** with sharp png `palette: true, quality: 90` (same temp tooling). Verify: still PNG, still 1344×768, < 120KB.
- [ ] **Step 3: Update all references** (files listed above). No old extension may remain in `src/`.
- [ ] **Step 4: Delete originals** (`git rm`).
- [ ] **Step 5: Full local gate:** `npm run lint && npx tsc --noEmit && npm run build && node scripts/check-facts.mjs && npm run test:e2e`. All green.
- [ ] **Step 6: Grep `out/` for every deleted filename** (e.g. `grep -r "hero-landscape.png" out/`) — zero hits expected. Also compare `out/_next/static` + image sizes: total shipped bytes should drop.
- [ ] **Step 7: Commit** `git commit -m "fix: convert images to WebP and compress OG image for faster loads"`

### Task 2: Hero paints without JavaScript (LCP fix)

**Files:**
- Test (create): `tests/e2e/hero-static-visibility.spec.ts`
- Modify: `src/components/sections/hero.tsx` (lines ~21-111: `<Reveal>` wrappers around h1, subhead, CTAs), `src/components/reveal.tsx` (only if a no-JS-safe variant is added there), possibly `src/app/globals.css` (keyframes)
- Do NOT touch: below-fold `<Reveal>` usage in other sections.

**Interfaces:**
- Consumes: existing `Reveal` component (`src/components/reveal.tsx`, currently sets `opacity: 0` initial state via framer-motion, `useReducedMotion` fallback at reveal.tsx:26,30).
- Produces: hero h1 (`aria-labelledby="hero-heading"` section, hero-heading id) visible with JS disabled and with `prefers-reduced-motion: reduce`; framer-motion still used below the fold.

- [ ] **Step 1: Write failing tests.** Two tests using `browser.newContext()`: (a) `{ javaScriptEnabled: false }` → navigate to `/` → expect `#hero-heading` (h1) visible; (b) `{ reducedMotion: 'reduce' }` → h1 visible. Run: `npx playwright test tests/e2e/hero-static-visibility.spec.ts`. Expected: FAIL (opacity 0 without hydration).
- [ ] **Step 2: Implement.** Replace framer-motion `<Reveal>` on above-fold hero elements with a CSS-only fade-up (keyframe class + `prefers-reduced-motion` media query disabling animation), or make those elements render visible-by-default with animation purely decorative. CSS animations run without JS — that's the fix.
- [ ] **Step 3: Re-run the two tests.** Expected: PASS.
- [ ] **Step 4: Full local gate** (same five commands as Task 1 Step 5). All green.
- [ ] **Step 5: Commit** `git commit -m "fix: paint hero content without JavaScript for better LCP"`

### Task 3: Open PR A, wait for CI

- [ ] **Step 1:** `git push -u origin agent/fix/hero-lcp-webp-images`, then `gh pr create --title "fix: WebP images + JS-independent hero paint (SEO quick wins)" --body-file -` (body: summary, audit reference, checklist of gates run).
- [ ] **Step 2:** Poll `gh run list --branch agent/fix/hero-lcp-webp-images` every ~30s until all workflows complete (10 min cap, then keep polling and report status). Any failure: `gh run view <id> --log-failed`, fix, push again.
- [ ] **Step 3:** Report PR URL + CI status. DO NOT MERGE.

---

## PR B — branch `agent/feat/person-schema-eeat`

### Task 4: Add Person + WebSite JSON-LD nodes

**Files:**
- Modify: `src/app/page.tsx:30-117` (the `@graph` array) and `src/app/layout.tsx` only if metadata helpers live there.
- MUST NOT touch: the `images` property of the Psychologist node (PR A owns it), any rendered copy, `src/lib/site.ts`.

**Interfaces:**
- Consumes: existing `SITE` constant (`src/lib/site.ts:27` — siteUrl, name, phone, email, license) and existing Psychologist node fields (sameAs Psychology Today URL).
- Produces: two additional `@graph` nodes: `Person` (Kara Hokes — name, jobTitle "Psychologist", telephone, email, url, sameAs [Psychology Today], memberOf/worksFor linking to the Psychologist node via `@id`) and `WebSite` (name, url, publisher → Person `@id`). No BreadcrumbList (single page — deferred to the specialty-pages issue).

- [ ] **Step 1:** Add the two nodes using only values already present in `src/lib/site.ts` / existing JSON-LD. Give the Psychologist node an `@id` and reference it from Person (`worksFor`/`founder`) and WebSite (`publisher`).
- [ ] **Step 2:** Verify JSON-LD parses: `npm run build`, then extract the `ld+json` block from `out/index.html` and `JSON.parse` it.
- [ ] **Step 3:** Full local gate (same five commands). All green.
- [ ] **Step 4:** Run `node scripts/check-facts.mjs` explicitly and confirm zero new failures.
- [ ] **Step 5:** Commit `git commit -m "feat: add Person and WebSite structured data for E-E-A-T"`, push, `gh pr create`, poll CI as in Task 3. DO NOT MERGE.

---

## Deferred work → GitHub issues (filed this session, not implemented)

1. **Specialty/service pages architecture** (next session, largest win): split the single-page site into dedicated pages per specialty (CPT, DBT, ACT, PE, perinatal, veterans…) with per-page metadata + `MedicalWebPage`/`Service` schema, BreadcrumbList + WebSite/SearchAction, internal linking. Whitespark: dedicated service pages = #1 local-organic ranking factor.
2. **Analytics + Search Console:** add privacy-friendly, cookieless analytics (Plausible recommended; GA4 is a poor fit for a PHI-adjacent therapy site); add `google-site-verification` meta (needs owner-provided code); confirm Search Console + sitemap submission.
3. **Local SEO externals (owner tasks):** Google Business Profile (category "Psychologist"), exact NAP match between Psychology Today listing and `src/lib/site.ts`, HIPAA-safe review acquisition process, citations (GoodTherapy, etc.).
4. **Bundle diet:** 2.1MB JS / 719KB largest chunk (framer-motion bulk) — code-split, evaluate CSS-replacing motion below the fold, set a performance budget.

## Verification (whole plan done when)

- [ ] PR A open with green CI (lint, tsc, build, check-facts, e2e, links)
- [ ] PR B open with green CI
- [ ] 4 issues filed on moliver28/karahokes-website
- [ ] Nothing merged without human say-so
