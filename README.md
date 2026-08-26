# Arcana — Tarot Learning Proof 001

A standalone, local-first Rider–Waite–Smith learning journey.

## Product proof

The primary flow is:

`today's card → concise study → A/B/C recognition → feedback → persisted mastery → next step`

The app includes all 78 cards, the 22-card Major Arcana path, suit × number logic, Court Card roles, glossary/evidence labels, and local progress.

## Architecture

- UI: React + TypeScript + plain responsive CSS.
- Canonical content: versioned modules in `src/content`.
- Domain rules: `src/domain`.
- User state: versioned `localStorage` adapter in `src/persistence`.
- Future sync: interface boundary only; no backend or remote adapter.
- RWS images: 78 plates extracted from S01, the supplied 1922 scan of *The Pictorial Key to the Tarot*. Exact page mapping and PDF SHA-256 are in `public/cards/provenance.json`.

## Run

```bash
npm install
npm run dev
npm test
npm run build
```

## Delivery

`main` deploys the static `dist` artifact to GitHub Pages through `.github/workflows/deploy.yml`.

Expected URL: `https://investiciiv.github.io/tarot-learning-proof/`
