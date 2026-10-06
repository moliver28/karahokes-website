# Kara Hokes, PhD: Practice Website

**Live site: https://www.karahokes.com**

This repository holds the source for that website: a Next.js site that builds to static files and publishes through GitHub Pages.

## Editing this site (no codebase knowledge needed)

Most of the site's words live in two kinds of files: one file of practice facts, and one file per page section. You can make most content changes without touching anything else.

### Practice facts

The practice's name, phone number, email address, license number, domain, session fee, and profile links all live in `src/lib/site.ts`. It's the single source of truth for the whole site. The page metadata, the sitemap, the structured data that search engines read, and the printable crisis sheet all take their facts from this file, so one edit there updates them everywhere.

### Page sections

Each section of the page has its own file in `src/components/sections/`. Find the section you want to change, edit the text in it, done.

- `hero.tsx`: the opening screen with the welcome text and main buttons
- `about.tsx`: about Dr. Hokes
- `approach.tsx`: how she works and what a video session looks like
- `specialties.tsx`: the practice's specialties
- `concerns.tsx`: the concerns people most often bring to therapy
- `communities.tsx`: the communities the practice is built to serve
- `insurance.tsx`: what sessions cost and which plans help pay
- `reading.tsx`: recommended books and free resources
- `faq.tsx`: frequently asked questions
- `grounding.tsx`: the guided breathing exercise for visitors who feel on edge
- `contact.tsx`: contact details, hours, the downloadable contact card, and the appointment request form
- `providers.tsx`: guidance for clinicians referring a patient

### Shared pieces

- `src/components/ui/` holds the shared widgets (buttons, inputs, and so on). You rarely need to touch these.
- `public/` holds the images. To swap one, replace the file and keep the same filename.
- `public/dr-kara-hokes.vcf` is the downloadable contact card. See the coupling notes below before editing it.

## Things that are coupled: edit together, or don't touch

### Practice facts and the contact card

If you change a fact in `src/lib/site.ts`, update `public/dr-kara-hokes.vcf` to match in the same change. The contact card is a separate plain-text file, so it doesn't update itself. An automated check compares the two and flags a mismatch, but the fix is yours to make: change both, together.

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

A local preview is optional and never required. If you want one anyway, run `npm install` once, then `npm run dev`.

## Deployment, DNS, and the form backend

- `DEPLOYMENT.md` covers deployment and DNS: how the site is published and how the domain points at it.
- `worker/README.md` covers the form backend: the Cloudflare Worker that receives appointment requests, how it behaves, and how to deploy it.
