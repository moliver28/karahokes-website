# Kara Hokes Website — Agent Instructions

**Canonical workspace:** `F:\Documents\ZCode\Kara Hokes Website`. Transferred from `F:\Documents\OpenCode\Kara Hokes Website` on 2026-10-08 — the OpenCode copy is legacy; never work there.

**This is production.** Every push to `main` builds and deploys the live site https://www.karahokes.com via GitHub Pages (`deploy.yml`). A `main` push that breaks CI also breaks the deploy. Do not push to `main` without explicit intent.

## Stack

- Next.js 16, static export (`output: "export"` → `out/`), React 19, TypeScript 5, Tailwind v4, Radix UI, framer-motion, lucide-react
- Forms: react-hook-form + zod. The contact form is HIPAA-safe and PHI-free; its backend is a Cloudflare Worker under `worker/` (wrangler, separate lockfile)
- Tests: Playwright e2e (`tests/e2e/`) with `@axe-core/playwright` accessibility checks
- Node 22, npm

## Commands

```bash
npm ci                         # root install
cd worker && npm ci            # worker install (own lockfile)
npm run dev                    # dev server
npm run build                  # static export to out/
npm run lint                   # eslint
npx tsc --noEmit               # typecheck — the ONLY type gate (see CI rules)
npm run test:e2e               # Playwright
node scripts/check-facts.mjs   # fact-check gate
```

## CI Rules (hard gates — every one must pass)

`tests.yml` runs on push to `main`, every PR, and a weekly cron (link rot check):

1. `npm run lint`
2. `npx tsc --noEmit` — **policy: fix only type errors introduced by the current change set. Pre-existing unrelated errors → STOP and report; never mass-fix, never remove this step.** `next.config.ts` sets `ignoreBuildErrors: true`, so this step is the only type gate in the pipeline.
3. `npm run build`
4. `node scripts/check-facts.mjs`
5. `npx playwright install --with-deps chromium`, then `npm run test:e2e` (report uploaded as artifact)
6. `links` job (needs `validate`): build, then lychee checks every link in `out/**/*.html` with `--accept 200,204,206,403` — 403 is accepted only because psychologytoday.com and wahelms.my.site.com block non-browser agents.

`deploy.yml` runs on push to `main`: build → upload `out/` → deploy to GitHub Pages (concurrency group `pages`, cancels in-progress runs).

## Branch & Commit Conventions

- Branches: `(agent|human)/(type)/<kebab-case-slug>` — type ∈ `feat|fix|chore|docs|refactor` (example on the remote: `agent/fix/sync-package-lock`). Protected branch: `main`. Validate the name before `git branch` / `git push`; never push a non-conforming branch.
- Commits: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), single-line preferred.
- `dependabot/*` branches are Dependabot-managed — do not push to them.

## Autonomous Mode — CI Enforcement

Global rules apply (`~/.zcode/AGENTS.md`): after any push, poll `gh run list --branch <branch>` every ~30s until all workflows complete (10 min cap). Any failure blocks completion — `gh run view <run-id> --log-failed`, fix root cause, push again. Local test passes do not substitute for green CI.

## Critical Domain Rules

- **PHI never touches the repo.** The contact form must stay HIPAA-safe and PHI-free; form handling is mirrored in `worker/` (see `worker/README.md` and the retention runbook).
- **Crisis-resource links must never rot** — the weekly lychee job exists for this. Verify any external link you add or edit resolves.
- **Factual claims are CI-checked** via `scripts/check-facts.mjs`. Update facts through the script, not ad hoc in content.
- Content editing guide: `EDITING.md`. Deployment & DNS: `DEPLOYMENT.md`.

## Known State

- The legacy `final-updates` branch (b1ff798, pre-launch content; content re-landed on `main` as e013105) was deleted on 2026-10-08 with owner approval. Nothing outstanding.
