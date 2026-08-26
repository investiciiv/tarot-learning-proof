# TAROT_PROJECT_STATE.md

## Project path

`/Users/shivan/Documents/tarot-learning-proof`

## Stack

Vite 8 + React + TypeScript + CSS; Vitest; versioned `localStorage` persistence behind an adapter; GitHub Actions + GitHub Pages.

## Version

`0.1.0` — Proof 001.

## Implemented features

- One learning journey: today → card/theme → study → A/B/C practice → feedback → progress → next step.
- Tarot Map with all 78 RWS cards, 22 Major Arcana, 56 Minor Arcana, four suits, and Court Cards.
- Card learning with name, number/rank, core meaning, shadow meaning, symbols, source labels, and exact PDF page provenance.
- Eight three-answer recognition questions with immediate feedback.
- Attempts, correct answers, accuracy, and mastery persisted locally after restart.
- Responsive desktop and mobile navigation.
- Separated canonical content, mutable user state, and a future-sync interface without sync implementation.

## PASS / FAIL

- Technical: PASS — typecheck, tests, production build, GitHub Actions, and HTTPS deployment.
- Product: PASS — lesson, quiz feedback, next step, and reload persistence verified.
- UX: PASS — desktop 1440×900 and mobile 390×844 verified without horizontal overflow or console errors.

## Blockers

- Proof 001: none.
- Broader production release: jurisdiction-specific rights review for distributing the S01 scan plates remains required.

## Next step

Run one real ten-question learning session on a phone and record the first point where recall or flow breaks.
