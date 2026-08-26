# TAROT_PROJECT_STATE.md

## Canonical delivery

- Local project: `/Users/shivan/Documents/Projects/tarot-learning-proof`
- GitHub source: `https://github.com/investiciiv/tarot-learning-proof`
- Production branch: `main`
- Vercel project: `investiciiv-6233s-projects/tarot-learning-proof`
- Vercel project ID: `prj_FOHdyUeZjAy0pCEUOgQdXJmOk3Gh`
- Vercel production URL: `https://tarot-learning-proof.vercel.app/`
- Git integration: `investiciiv/tarot-learning-proof`; production branch `main`.
- Proof 002B production migration: commit `a49ef6dbd574071883caf3d6a3546790a180940c` automatically created deployment `dpl_3pnBNVWpHiHeQH7xfKH3evo4FJ4Q`, exact SHA/branch matched, target `production`, status `READY`.

## Version and stack

- Version: `0.2.0` — Proof 002B framework migration PASS; locked Tarot product behavior retained.
- Stack: Next.js `16.3.3` App Router + React `19.2.8` + TypeScript + CSS; Vitest retained.
- `/` is statically prerendered. Existing interactivity is behind the application client boundary; no server API or product SSR expansion was added.
- Canonical content, domain, persistence, tests, all 78 RWS card images, and provenance data were preserved.
- `localStorage` remains local-only with storage key `tarot-learning-proof:user-progress:v1` and schema version `1`; same-origin Vite progress was restored after migration and new progress persisted after reload.
- Supabase, Auth, cloud sync, payments, and AI: NOT implemented.

## Migration evidence

- Accepted Vite baseline: `77bc76b0e47a04ed3674fa8c35890617d27a32ab`.
- Immutable rollback tag: `proof-002a-vite-pass`.
- Rollback branch: `rollback/proof-002a-vite`.
- Migration branch: `codex/proof-002b-nextjs`.
- Preview migration commit: `c88b1afa53ac362c3f7a56ea9e02203485f98e6c`.
- Preview deployment: `dpl_HtmMtiiwe55Ug58KDgeee1MjPhHe`; exact branch/SHA matched; status `READY`.
- Checks: dependency install PASS; TypeScript PASS; 3 test files / 6 tests PASS; Next.js production build PASS.
- Preview parity: desktop PASS; mobile PASS; card/map/images PASS; quiz PASS; local persistence PASS; console/runtime errors NONE observed.
- Production smoke: desktop PASS; mobile PASS; card/map/images PASS; quiz PASS; local persistence PASS; console/runtime errors NONE observed.

## Rollback

- GitHub Pages remains live as the accepted Vite rollback snapshot: `https://investiciiv.github.io/tarot-learning-proof/` (`HTTP 200` after the migration).
- The Pages workflow is manual-only and rebuilds immutable tag `proof-002a-vite-pass`; Next.js pushes to `main` no longer start a misleading `dist` deployment.
- Vite rollback tag and branch are present on GitHub at the accepted baseline SHA.

## PASS / FAIL

- Proof 002B: PASS.
- Framework migration: PASS.
- Content and provenance preservation: PASS.
- State compatibility and hydration safety: PASS.
- Tests and build: PASS.
- Exact-SHA Preview: PASS.
- Preview desktop/mobile parity: PASS.
- Exact-SHA production auto-deploy: PASS.
- Production desktop/mobile: PASS.
- Rollback availability: PASS.

## Blockers

- None.

## Next smallest step

Post-Proof 002B extraction — create `VITE_TO_NEXTJS_MIGRATION_PLAYBOOK.md` from the completed proof.
