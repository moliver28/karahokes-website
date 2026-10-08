# Kara Hokes, PhD: Practice Website

**Live site: https://www.karahokes.com**

This repository holds the source for that website: a Next.js site that builds to static files and publishes through GitHub Pages.

## Pointers

- Editing this site: [EDITING.md](EDITING.md)
- Deployment & DNS: [DEPLOYMENT.md](DEPLOYMENT.md)
- Form backend: [worker/README.md](worker/README.md)

## Working on this repo

```
npm install
npm run dev
npm run build
npm run test:e2e
```

CI runs lint, typecheck, build, and browser tests on every push.
