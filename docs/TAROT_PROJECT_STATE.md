# TAROT_PROJECT_STATE.md

## Canonical delivery

- Local project: `/Users/shivan/Documents/Projects/tarot-learning-proof`
- GitHub source: `https://github.com/investiciiv/tarot-learning-proof`
- Production branch: `main`
- Vercel project: `investiciiv-6233s-projects/tarot-learning-proof`
- Vercel project ID: `prj_FOHdyUeZjAy0pCEUOgQdXJmOk3Gh`
- Vercel production URL: `https://tarot-learning-proof.vercel.app/`
- Git integration: `investiciiv/tarot-learning-proof` connected through the Vercel GitHub App; production branch confirmed as `main`.
- Auto-deploy: PASS — push of commit `c0b2c8854fa6ab8e8efc9eef00844dad3fca0111` created production deployment `dpl_GtUSpy2Fj7fRbcTMUy3RTaW5JC85`, which reached `READY`.

## Version and stack

- Version: `0.1.0` — Proof 002A delivery PASS; Proof 001 product behavior retained.
- Stack remains Vite 8 + React + TypeScript + CSS with Vitest and versioned local persistence.
- Next.js migration: NOT performed.
- Cloud state, Supabase, Auth, and sync: NOT performed.

## PASS / FAIL

- Canonical path: PASS.
- Git integrity: PASS.
- Vercel production deploy: PASS.
- Desktop and mobile HTTPS access: PASS.
- GitHub ↔ Vercel integration: PASS.
- Automatic production deployment from `main`: PASS.

## Rollback

- GitHub Pages remains enabled and untouched as the Proof 001 rollback delivery: `https://investiciiv.github.io/tarot-learning-proof/`.
- Vercel is the candidate canonical delivery for Proof 002A.

## Blockers

- Proof 002A: none.

## Next smallest step

Proof 002B — migrate the existing Vite/React application to Next.js while preserving the locked Proof 001 product behavior and the newly proven Vercel delivery.
