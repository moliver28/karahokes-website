# Editing this site (no codebase knowledge needed)

Most of the site's words live in two kinds of files: one file of practice facts, and one file per page section. You can make most content changes without touching anything else. The pattern is always the same: find the file, change the words, save.

## Practice facts

The practice's name, phone number, email address, license number, domain, session fee, and profile links all live in `src/lib/site.ts`. It's the single source of truth for the whole site. The page metadata, the sitemap, the structured data that search engines read, and the printable crisis sheet all take their facts from this file, so one edit there updates them everywhere.

## Page sections

Each section of the page has its own file in `src/components/sections/`. They appear in this order on the page. Find the section you want to change, edit the text in it, done.

- `hero.tsx`: the opening screen with the welcome text and main buttons
- `about.tsx`: about Dr. Hokes
- `communities.tsx`: who she works with, the communities the practice is built to serve
- `specialties.tsx`: the Treatments section (the site calls it Treatments; the file kept its older name)
- `concerns.tsx`: the concerns people most often bring to therapy
- `grounding.tsx`: the guided breathing exercise for visitors who feel on edge
- `approach.tsx`: the process, what working together looks like from start to finish
- `reading.tsx`: recommended books and free resources
- `insurance.tsx`: what sessions cost and which plans help pay
- `faq.tsx`: frequently asked questions
- `contact.tsx`: the Getting Started section: contact details, hours, crisis numbers, and the appointment request form
- `providers.tsx`: guidance for clinicians referring a patient

One extra piece belongs to Getting Started: `src/components/what-to-expect-next.tsx` is the collapsed "What to expect next" card next to the appointment form. It holds the path after someone sends a message (it comes straight to Dr. Hokes, she replies within two business days, then a free 15-minute call) plus a short prep list with checkboxes visitors can tick off.

## Shared pieces

- `src/components/ui/` holds the shared widgets (buttons, inputs, and so on). You rarely need to touch these.
- `src/components/consult-form.tsx` is the appointment request form itself. See the coupling notes below before changing its fields.
- `public/` holds the images. To swap one, replace the file and keep the same filename.
- `public/dr-kara-hokes.vcf` is the downloadable contact card. See the coupling notes below before editing it.

## Things that are coupled: edit together, or don't touch

### Practice facts, the contact card, and the form backend

The phone number and email address appear in three places: `src/lib/site.ts`, `public/dr-kara-hokes.vcf` (the downloadable contact card), and `worker/src/index.ts` (the form backend). If you change one, change all three in the same edit. CI checks that site.ts, the vCard, and the form backend agree on the phone number and email, and it flags any mismatch. The check tells you something disagrees; the fix is yours to make: change all three, together.

### The appointment form's validation is defined twice

The form checks its fields in two places that mirror each other: `src/components/consult-form.tsx` (what visitors see) and `worker/src/index.ts` (the server that receives submissions). Adding or changing a form field means editing both files, then redeploying the form backend:

```
cd worker
npx wrangler deploy
```

That deploy needs a one-time Cloudflare login (`npx wrangler login`). Form changes are rare. The safe move is to ask for help rather than guess.

### Where the form sends its data

The form's destination endpoint is `SITE.formEndpoint` in `src/lib/site.ts`. Changing it changes where every submission goes.

## Publishing your change

Commit to `main`, or merge a pull request into it. GitHub Actions rebuilds and deploys the site automatically in about two minutes. Open the Actions tab and wait for the green check.

CI runs on every push too: it checks the code style, typechecks it, builds the site, runs the browser tests, and confirms the phone and email agree everywhere. If a check goes red, the site did not deploy; fix the problem (or ask for help), then run it again.

A local preview is optional and never required. If you want one anyway, run `npm install` once, then `npm run dev`.

## Deployment, DNS, and the form backend

- `DEPLOYMENT.md` covers deployment and DNS: how the site is published and how the domain points at it.
- `worker/README.md` covers the form backend: the Cloudflare Worker that receives appointment requests, how it behaves, and how to deploy it.
