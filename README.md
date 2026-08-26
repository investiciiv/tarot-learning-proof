# Arcana — Tarot Learning

A standalone, local-first Rider–Waite–Smith learning journey.

## Product proof

The primary flow is:

`today's card → concise study → A/B/C recognition → feedback → persisted mastery → next step`

The app includes all 78 cards, the 22-card Major Arcana path, suit × number logic, Court Card roles, glossary/evidence labels, and local progress.

## Architecture

- Foundation: Next.js App Router + React + TypeScript + plain responsive CSS.
- Canonical content: versioned modules in `src/content`.
- Domain rules: `src/domain`.
- User state: versioned `localStorage` adapter in `src/persistence`.
- Future sync: interface boundary only; no backend or remote adapter.
- RWS images: 78 plates extracted from S01, the supplied 1922 scan of *The Pictorial Key to the Tarot*. Exact page mapping and PDF SHA-256 are in `public/cards/provenance.json`.

## Run

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Delivery

`main` deploys automatically to the existing Vercel project.

Production URL: `https://tarot-learning-proof.vercel.app/`

The accepted Vite baseline remains available as tag `proof-002a-vite-pass` and branch `rollback/proof-002a-vite`. The GitHub Pages workflow is manual-only and rebuilds that immutable tag as the rollback snapshot.
