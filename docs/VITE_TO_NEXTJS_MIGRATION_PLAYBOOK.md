# Vite to Next.js Migration Playbook

## Purpose

This playbook was extracted from a real, successful framework migration. It exists to replace an application foundation while preserving the accepted product that already runs on it.

**Framework migration is not a product rewrite.**

The default objective is:

`preserve domain + content + state + assets + tests → replace only framework-specific shell, bootstrap, and integration`

This playbook covers the controlled path from an accepted Vite/React application through immutable rollback, a separate migration branch, local parity, exact-SHA Preview, promotion to production, and retained rollback delivery.

It does not define product architecture, content strategy, authentication, cloud state, backend APIs, payments, AI features, or a universal framework choice. It is not a universal command recipe for every React application. Tool versions, project structure, storage contracts, and delivery adapters must be verified for each project.

Generic placeholders used below:

- `<LOCAL_REPO>` — canonical local working tree;
- `<BASELINE_SHA>` — accepted pre-migration commit;
- `<ROLLBACK_TAG>` — immutable tag resolving to the accepted baseline;
- `<ROLLBACK_BRANCH>` — optional branch resolving to the same baseline;
- `<MIGRATION_BRANCH>` — isolated framework-migration branch;
- `<PRODUCTION_BRANCH>` — branch that triggers production delivery;
- `<PRODUCTION_URL>` — stable canonical HTTPS URL;
- `<PREVIEW_SHA>` — reviewed migration-branch commit;
- `<PRODUCTION_SHA>` — promoted production commit.

Project-specific evidence appears only in [Proof 002B reference implementation](#proof-002b-reference-implementation).

## Migration contract

Write the contract before changing files. Ambiguity here creates product drift later.

### Locked

- accepted user-facing behavior and primary flow;
- content, canonical data, counts, and invariants;
- domain rules and learning/business semantics;
- persistence key, schema/version, recovery behavior, and local/cloud boundary;
- meaningful test expectations;
- public assets and provenance records;
- visual language, navigation, and responsive behavior;
- current production URL and delivery identity where continuity is required.

### Editable

- framework bootstrap and entry files;
- routing shell required by the selected target framework;
- build tooling and package scripts;
- client/hydration boundaries required for browser-only behavior;
- framework metadata and TypeScript integration;
- asset URL handling when the old bundler supplied it;
- delivery-adapter settings strictly required by the new framework.

“Editable” is not permission to redesign or opportunistically refactor stable product modules.

### PASS

- meaningful product behavior remains equivalent;
- locked content, state semantics, assets, and provenance remain intact;
- install, typecheck, meaningful tests, and production build pass;
- browser-only state is hydration-safe and compatible;
- Preview is tied to the exact migration branch/SHA and passes parity;
- production is tied to the exact production branch/SHA and passes parity;
- immutable rollback and the intended rollback delivery remain available.

### FAIL

- a product rewrite is disguised as framework migration;
- content, assets, provenance, navigation, or meaningful features disappear;
- persistence semantics change without an explicit product decision;
- hydration or runtime errors remain;
- local success is substituted for deployed Preview evidence;
- Preview behavior and production behavior differ materially;
- deployment source/SHA cannot be proven;
- rollback is vague, mutable, unavailable, or unverified.

## Prerequisites

### Product prerequisites

- an accepted product baseline exists;
- the primary user flow and representative interactions are known;
- meaningful tests protect core invariants;
- persistence behavior, key/schema/version, and failure fallback are understood;
- public assets and provenance are identifiable;
- current desktop/mobile behavior can be captured without redesign;
- current production delivery is stable.

Proof 002B confirmed an accepted user flow, meaningful domain/persistence/content tests, known browser-local state, known asset provenance, and a working production application before migration.

### Git prerequisites

- one canonical repository path;
- a clean or fully understood working tree;
- known current branch, HEAD, origin, and remote production-branch SHA;
- no unexplained local/remote divergence;
- permission to create and push an immutable tag and optional rollback branch;
- permission to create and push a migration branch;
- a non-force, history-preserving promotion path to the production branch.

Proof 002B confirmed local/remote equality before mutation, pushed an annotated baseline tag and rollback branch, migrated on a separate branch, and used a normal merge commit without force-pushing.

### Delivery prerequisites

- branch Preview deployments or an equivalent isolated delivery stage;
- deployment metadata that identifies the exact Git branch and SHA;
- a known stable production URL;
- a production branch that triggers automatic delivery;
- an understood current hosting project and adapter configuration;
- understood behavior of any previous delivery adapter retained for rollback.

Proof 002B confirmed Git-triggered Vercel Preview and production deployments with exact branch/SHA metadata, retained the same hosting project/domain/repository/production branch, and kept the previous Pages delivery live.

## Baseline / rollback

The proven sequence is:

`accepted baseline SHA → immutable tag → optional rollback branch → remote equality → migration branch`

An immutable tag is stronger than “the old version is somewhere in Git history.” It gives the recovery contract a stable name, makes accidental branch movement irrelevant, and allows delivery automation to check out the exact accepted snapshot. A rollback branch can improve discoverability or support branch-oriented tools, but it does not replace the immutable tag.

### Step 1 — Resolve the accepted baseline

- **Objective:** identify exactly what is being preserved.
- **Mechanism:** local Git and read-only remote comparison.
- **Expected result:** clean/known tree; local `<PRODUCTION_BRANCH>` and remote branch resolve to `<BASELINE_SHA>`.
- **Verification:** record path, branch, local HEAD, remote URL, remote branch SHA, and status.
- **Safe-stop condition:** unknown changes, wrong remote, or unexplained local/remote divergence.

### Step 2 — Create the immutable tag

- **Objective:** name the accepted pre-migration commit permanently.
- **Mechanism:** an annotated Git tag at `<BASELINE_SHA>`.
- **Expected result:** `<ROLLBACK_TAG>` resolves to `<BASELINE_SHA>` without moving a pre-existing tag.
- **Verification:** dereference the local tag and compare it with the intended baseline.
- **Safe-stop condition:** the tag already exists at another SHA or the accepted baseline is uncertain.

### Step 3 — Create an optional rollback branch

- **Objective:** support branch-based recovery or delivery without duplicating the working tree.
- **Mechanism:** create `<ROLLBACK_BRANCH>` at `<BASELINE_SHA>` only when it has a concrete use.
- **Expected result:** tag and branch resolve to the same accepted commit.
- **Verification:** read both refs locally.
- **Safe-stop condition:** the branch name already points elsewhere or would create ambiguous canonical development.

### Step 4 — Push and verify rollback refs

- **Objective:** make rollback independent of one local machine.
- **Mechanism:** push the tag and optional branch to the canonical remote.
- **Expected result:** remote dereferenced tag and remote branch equal `<BASELINE_SHA>`.
- **Verification:** read remote refs explicitly; do not infer success from local output alone.
- **Safe-stop condition:** push fails, the remote resolves differently, or repository identity is wrong.

### Step 5 — Create the migration branch

- **Objective:** isolate framework work from the accepted production branch.
- **Mechanism:** create `<MIGRATION_BRANCH>` from `<BASELINE_SHA>`.
- **Expected result:** the new branch starts exactly at the accepted baseline with a clean tree.
- **Verification:** branch name and HEAD equality.
- **Safe-stop condition:** migration starts from another commit, unknown files appear, or work begins directly on production.

Generic Git command shapes proven in the source migration were:

The angle-bracket values below are notation, not literal shell text; replace every placeholder before execution.

```bash
git tag -a <ROLLBACK_TAG> <BASELINE_SHA> -m "Accepted pre-migration baseline"
git branch <ROLLBACK_BRANCH> <BASELINE_SHA>
git push origin refs/tags/<ROLLBACK_TAG>
git push origin <ROLLBACK_BRANCH>
git switch -c <MIGRATION_BRANCH> <BASELINE_SHA>
```

Resolve exact names and repository policy before using them. Never silently move an existing rollback tag.

## Minimum framework delta

The migration should start with a file-classification decision.

### Preserve when possible

- domain logic;
- canonical content/data;
- persistence adapters and storage contracts;
- meaningful tests;
- visual styles;
- public assets;
- provenance metadata;
- existing React components whose behavior is framework-independent.

### Change only when required

- Vite entry HTML and React bootstrap;
- Vite configuration and Vite-only type declarations;
- package dependencies and framework scripts;
- Next.js routing shell and metadata;
- TypeScript settings required by Next.js;
- browser/client boundary placement;
- asset URL expressions that depended on Vite environment variables;
- delivery-adapter framework/build/output settings.

The source migration used the Next.js App Router, a root layout, one root page, one existing application client boundary, and static prerendering for `/`. It did not add product routes, server APIs, or unnecessary server-side behavior. Existing components, CSS, content, domain rules, persistence code, tests, public assets, and provenance remained in place.

Those choices are evidence of a minimum-delta solution for that application, not universal Next.js requirements. Another application may need multiple routes, narrower client islands, server rendering, or different metadata handling, but each additional change must be justified by the locked migration contract.

## Client / hydration safety

Next.js can pre-render component output before browser APIs exist. Browser-only state therefore cannot be assumed during server or pre-render execution, even when the final interface is interactive.

The proven compatibility pattern was:

1. mark the interactive application boundary as client-owned;
2. use a deterministic, browser-independent initial state for server and first client render;
3. create the browser storage adapter only inside a client effect;
4. load existing progress after the browser is available;
5. defer persistence writes until the existing state has been loaded;
6. retain the existing storage key, schema version, validation, and fallback semantics.

Deferring writes is important: saving an empty initial state before loading could erase compatible existing progress. A hydration-safe migration must protect both rendering and data ordering.

Proof 002B demonstrated that existing same-origin progress created by the Vite application was restored by the Next.js application. New progress was then written and survived reload.

This proves compatibility for the tested storage contract, schema, browser profile, and unchanged origin. It does **not** prove arbitrary storage migrations, cross-origin transfer, corrupt-data recovery beyond tested behavior, or compatibility with unrelated schema changes.

### Runtime verification

- load the application and inspect runtime/console errors;
- confirm the initial render does not crash or report hydration mismatch;
- observe previously saved progress through the UI without reading secret/session storage internals;
- change progress through a meaningful interaction;
- reload the same origin;
- confirm both pre-existing and newly changed state remain visible;
- confirm the storage key/schema/version were not changed unless a separate migration decision authorized it.

## Local parity

Local parity is the last gate before the migration branch is pushed. Use a production build when possible; a development server alone may hide production-only issues.

Required categories:

- **Desktop:** primary screen, navigation, representative flow, expected layout, no blocking horizontal overflow.
- **Mobile:** representative breakpoint, mobile navigation, primary flow, no blocking horizontal overflow.
- **Assets:** representative card/image or equivalent public asset loads with non-zero intrinsic dimensions.
- **Detail flow:** representative detail/modal/route remains usable and displays expected source/context data.
- **Interactivity:** quiz, form, or equivalent state-changing interaction works.
- **Persistence:** existing state loads, a new change is made, reload restores it.
- **Runtime:** no hydration, browser-API, console, or application errors in the tested flow.
- **Invariants:** known counts and structures remain intact.

Parity means no meaningful regression against the accepted baseline. It is not full visual QA, broad cross-browser/device certification, accessibility certification, security assessment, or performance validation.

## Preview first

The branch-first promotion chain is mandatory:

`baseline → migration branch → commit → push → Preview → exact SHA → parity → merge authorization`

A successful local build does not prove deployed migration parity.

### Preview phase 1 — Isolated branch

- **INPUT:** verified `<BASELINE_SHA>` and clean `<MIGRATION_BRANCH>`.
- **ACTION:** implement only the minimum framework delta on the migration branch.
- **VERIFY:** locked modules are unchanged where intended; all edits are explained by the framework or rollback contract.
- **SAFE STOP:** unexplained product/content/state rewrites or unknown files appear.

### Preview phase 2 — Local gate and commit

- **INPUT:** completed local migration and known test/build commands.
- **ACTION:** install reproducibly, typecheck, run meaningful tests, build for production, and perform local runtime parity; then create one reviewable migration commit.
- **VERIFY:** all checks pass; commit contents match the intended file classes; record `<PREVIEW_SHA>`.
- **SAFE STOP:** tests/build/runtime fail or success depends on skipping meaningful checks.

### Preview phase 3 — Branch push and deployment identity

- **INPUT:** `<MIGRATION_BRANCH>` at `<PREVIEW_SHA>` and an existing Preview-capable delivery integration.
- **ACTION:** push the migration branch; do not manually deploy as a substitute for Git integration.
- **VERIFY:** a new Preview deployment identifies the exact branch and `<PREVIEW_SHA>` and reaches `READY` or the adapter’s equivalent success state.
- **SAFE STOP:** deployment is absent, manual-only, from another ref/SHA, or cannot be identified unambiguously.

### Preview phase 4 — Product parity

- **INPUT:** exact-SHA Preview URL and accepted baseline observations.
- **ACTION:** repeat desktop/mobile primary flow, navigation, representative detail/asset, meaningful interaction, persistence/reload, overflow, and console checks.
- **VERIFY:** observable behavior is materially equivalent and locked invariants remain present.
- **SAFE STOP:** missing styling/content/assets, state incompatibility, hydration errors, or meaningful behavior regression.

### Preview phase 5 — Merge authorization

- **INPUT:** complete local and Preview evidence.
- **ACTION:** declare the branch eligible for promotion only after every hard Preview criterion passes.
- **VERIFY:** evidence includes exact deployment ID, branch, SHA, success state, and product parity.
- **SAFE STOP:** any criterion is inferred, waived, or supported only by a green build.

## Production promotion

The proven promotion process is:

1. keep migration work off `<PRODUCTION_BRANCH>` until Preview PASS;
2. merge using a normal history-preserving Git operation;
3. never force-push the production branch;
4. push `<PRODUCTION_BRANCH>`;
5. require the existing Git integration to create a production deployment automatically;
6. require deployment metadata to match `<PRODUCTION_SHA>` and `<PRODUCTION_BRANCH>` exactly;
7. require `READY` or the adapter’s equivalent success state;
8. verify the unchanged stable `<PRODUCTION_URL>`;
9. perform a final desktop/mobile product smoke including state and representative assets;
10. update canonical project state only with confirmed facts.

Preview PASS does not automatically equal Production PASS. Production can differ through environment, branch rules, aliases, domains, build settings, caching, or protection policy. A manual deployment does not prove automatic production promotion.

Documentation committed after the migration may naturally trigger another production deployment. Record the migration merge/deployment separately from a later final documentation HEAD when both matter, and verify the current remote branch rather than conflating them.

## Delivery adapter update

Framework migration may require the hosting adapter to stop using old framework assumptions.

The source migration changed the existing Vercel project from the Vite framework preset to the Next.js preset and reset explicit Vite build, install, and output-directory overrides to native Next.js autodetection. It preserved the same project identity, domain, GitHub repository, and production branch.

Generic rule:

- inspect the current adapter and installed CLI/API help;
- change only settings required by the new framework;
- read the settings back after mutation;
- preserve project/domain/repository/production-branch identity unless the migration contract explicitly requires otherwise;
- use the migration branch Preview to validate the new adapter configuration before promoting main.

Do not create a duplicate hosting project to avoid understanding the existing one. Do not change the production domain merely because the framework changed. Do not mix backend, authentication, storage, or product work into an adapter update.

Vercel CLI syntax is version-sensitive. Proof 002B verified the installed CLI’s `project update` help and used the supported framework and auto-detect settings. Future runs must inspect their installed version rather than copy flags blindly.

## Rollback delivery

The old delivery adapter may no longer be able to build the new framework from the production branch. Letting it run and fail noisily creates false alarms and may damage confidence in the rollback contract.

The adapter-specific pattern proven by the source migration was:

- keep the existing Vite Pages site live;
- stop Next.js pushes to main from triggering the old `dist` workflow;
- make the Pages workflow manual-only;
- make that workflow check out `<ROLLBACK_TAG>` before installing, testing, building, and publishing the old artifact;
- retain the immutable tag and optional branch remotely.

Generic rule: when the old adapter cannot naturally follow the new framework, preserve it as a snapshot/manual rollback mechanism instead of leaving a misleading broken automatic workflow.

This is not a universal GitHub Pages prescription. Another adapter may retain an immutable deployment, release artifact, image, branch, or provider-specific rollback. The source proof confirmed that the existing Pages snapshot remained live and that the workflow was configured to rebuild the immutable tag manually. An actual post-migration manual workflow run and a full rollback exercise were **NOT PROVEN**.

## Interruption recovery

Proof 002B was interrupted because the active Codex run exhausted its usage limit. The interruption did not roll back filesystem state:

- uncommitted migration edits remained in the working tree;
- the generated production build remained locally;
- the rollback tag and branch remained available;
- the migration branch remained checked out at the baseline;
- no work was lost;
- no migration commit or remote migration branch had yet been created.

Recovery resumed from the actual local Git/filesystem state and repeated only the smallest local runtime checks needed to establish that the preserved build and edits were still valid.

### Recovery protocol

1. do not click Undo;
2. do not reset, revert, clean, stash, or check out over the working tree;
3. read the canonical path, current branch, HEAD, status, full diff, and diff stat;
4. compare local and remote production-branch SHAs;
5. verify the rollback tag and optional branch locally and remotely;
6. determine whether the migration branch, commit, build artifacts, adapter update, or deployments actually exist;
7. compare the observed state with the expected interruption point;
8. safe-stop on any unexplained discrepancy;
9. resume at the first incomplete gate;
10. rerun only the smallest checks needed to establish current validity.

Conversation narrative is not the recovery source of truth. Git refs, working-tree contents, filesystem artifacts, provider metadata, and test/runtime results must be verified.

Useful checkpoints for long tasks are:

- immutable baseline before mutation;
- migration branch before edits;
- a meaningful migration commit before expensive remote/Preview/browser phases when the local gate is complete;
- recorded deployment IDs and exact SHAs after remote gates.

Do not over-engineer a commit for every tiny edit. A checkpoint should protect a coherent, verified state.

## Verify

A green build alone cannot satisfy migration PASS. Require the complete evidence chain.

### Source

- canonical `<LOCAL_REPO>` exists and contains `.git`;
- current branch and HEAD are known;
- origin identifies the expected repository;
- local and remote `<PRODUCTION_BRANCH>` state is known;
- working tree is clean or every change is understood;
- accepted `<BASELINE_SHA>` is recorded.

### Rollback

- `<ROLLBACK_TAG>` exists and dereferences to `<BASELINE_SHA>`;
- remote tag equality is confirmed;
- optional `<ROLLBACK_BRANCH>` also resolves to `<BASELINE_SHA>`;
- rollback delivery/source remains available as designed.

### Preservation

- domain, content, persistence, tests, styles, assets, and provenance are diffed against the baseline according to the migration contract;
- invariant counts and identifiers remain correct;
- every intentional exception has a narrow framework reason.

### Build

- reproducible dependency installation passes;
- TypeScript/typecheck passes;
- all meaningful existing tests pass without hidden skips;
- target-framework production build passes;
- output/prerender/server behavior matches the chosen migration design.

### Runtime

- application loads without hydration/runtime errors;
- server/pre-render execution does not access browser-only APIs unsafely;
- existing state appears through the UI;
- meaningful state can be changed;
- reload restores the changed state;
- storage key/schema/version remains compatible where required.

### Preview

- deployment source is the intended Git provider;
- branch equals `<MIGRATION_BRANCH>`;
- deployment SHA equals `<PREVIEW_SHA>` exactly;
- deployment reaches success/`READY`;
- desktop and mobile parity pass;
- representative assets, navigation, detail, interaction, persistence, overflow, and console checks pass.

### Production

- migration is merged without force-pushing;
- remote production branch contains the intended merge/main SHA;
- automatic deployment is created from `<PRODUCTION_BRANCH>`;
- deployment source SHA equals `<PRODUCTION_SHA>` exactly;
- deployment reaches success/`READY`;
- stable `<PRODUCTION_URL>` remains canonical and responsive;
- production desktop/mobile smoke and meaningful state checks pass.

### Rollback delivery

- immutable baseline remains remotely recoverable;
- previous delivery is still live or otherwise available according to the contract;
- framework-incompatible automation is disabled or redirected narrowly without deleting the rollback;
- any unexecuted rollback drill is labeled **NOT PROVEN** rather than implied.

## Reusable

### Phase 0 — Preconditions

- **INPUT:** product acceptance, Git/delivery identities, storage contract, test/build commands.
- **ACTION:** define LOCKED, EDITABLE, PASS, and FAIL; inspect accounts/tools without changing configuration.
- **VERIFY:** the product and delivery baseline are understood and testable.
- **SAFE STOP CONDITION:** acceptance, canonical repository, state semantics, or delivery identity is ambiguous.

### Phase 1 — Baseline capture

- **INPUT:** current production application and clean/known repository.
- **ACTION:** record `<BASELINE_SHA>` and capture representative desktop/mobile flow, assets, interactions, persistence, overflow, and console state.
- **VERIFY:** baseline observations and invariants are concrete enough for later comparison.
- **SAFE STOP CONDITION:** production is already broken or the accepted behavior cannot be identified.

### Phase 2 — Immutable rollback

- **INPUT:** accepted `<BASELINE_SHA>` and canonical remote.
- **ACTION:** create/push `<ROLLBACK_TAG>` and, only if useful, `<ROLLBACK_BRANCH>`.
- **VERIFY:** remote dereferenced tag and branch equal `<BASELINE_SHA>`.
- **SAFE STOP CONDITION:** an existing ref conflicts or remote equality cannot be proven.

### Phase 3 — Migration branch

- **INPUT:** verified rollback refs and baseline.
- **ACTION:** create `<MIGRATION_BRANCH>` from `<BASELINE_SHA>`.
- **VERIFY:** branch/HEAD match the baseline and tree is clean.
- **SAFE STOP CONDITION:** migration starts from the wrong commit or directly on production.

### Phase 4 — Minimum framework delta

- **INPUT:** file-classification plan and target-framework requirements.
- **ACTION:** replace only framework bootstrap/shell/build/metadata integration; preserve stable product modules.
- **VERIFY:** diff contains only explainable framework and rollback-adapter changes.
- **SAFE STOP CONDITION:** domain/content/state/assets require unexplained rewriting.

### Phase 5 — Hydration/browser-state safety

- **INPUT:** existing browser-only APIs and persistence contract.
- **ACTION:** place browser access behind the appropriate client lifecycle; make the initial render deterministic; defer writes until loading completes.
- **VERIFY:** no server browser-API access, no hydration mismatch, and storage key/schema/version remain compatible.
- **SAFE STOP CONDITION:** state cannot be preserved without a product/schema decision.

### Phase 6 — Local tests/build/runtime

- **INPUT:** migrated tree and existing commands.
- **ACTION:** install reproducibly, typecheck, test, build, run production output locally, and perform desktop/mobile parity.
- **VERIFY:** all checks pass; meaningful tests are not skipped; runtime, assets, interaction, persistence, and overflow pass.
- **SAFE STOP CONDITION:** any hard local criterion fails or needs product-semantic change.

### Phase 7 — Preview exact-SHA

- **INPUT:** locally passing migration commit `<PREVIEW_SHA>`.
- **ACTION:** push `<MIGRATION_BRANCH>` through the existing Git integration.
- **VERIFY:** a new Preview deployment identifies the exact branch/SHA and reaches success.
- **SAFE STOP CONDITION:** Preview cannot be tied to the exact commit or requires manual deploy substitution.

### Phase 8 — Preview parity

- **INPUT:** exact-SHA Preview and baseline observations.
- **ACTION:** repeat desktop/mobile primary flow, assets/detail, meaningful interaction, persistence/reload, overflow, and console checks.
- **VERIFY:** no meaningful product or visual regression.
- **SAFE STOP CONDITION:** Preview behavior differs materially or state/assets fail.

### Phase 9 — Delivery adapter update

- **INPUT:** existing hosting project and target-framework delivery requirements.
- **ACTION:** update only required framework/build/install/output settings; preserve project/domain/repository/production branch.
- **VERIFY:** read back adapter identity and settings; Preview validates them.
- **SAFE STOP CONDITION:** project/domain ambiguity, duplicate-project pressure, or unrelated infrastructure expansion.

### Phase 10 — Merge gate

- **INPUT:** complete local and Preview PASS evidence.
- **ACTION:** merge `<MIGRATION_BRANCH>` normally into `<PRODUCTION_BRANCH>` without force push.
- **VERIFY:** merge topology and resulting `<PRODUCTION_SHA>` are recorded.
- **SAFE STOP CONDITION:** any Preview criterion is missing or production branch moved unexpectedly.

### Phase 11 — Production exact-SHA

- **INPUT:** pushed `<PRODUCTION_BRANCH>` at `<PRODUCTION_SHA>`.
- **ACTION:** allow automatic production delivery; do not manually deploy as a substitute.
- **VERIFY:** new production deployment identifies the exact branch/SHA and reaches success/`READY`.
- **SAFE STOP CONDITION:** no automatic deployment, wrong source/SHA, build failure, or unstable canonical URL.

### Phase 12 — Production parity

- **INPUT:** stable `<PRODUCTION_URL>` after exact-SHA deployment.
- **ACTION:** perform final desktop/mobile smoke covering primary flow, representative assets, interaction, persistence, overflow, and console.
- **VERIFY:** production matches the passing Preview and compatible pre-migration state remains readable.
- **SAFE STOP CONDITION:** production differs from Preview or breaks locked behavior.

### Phase 13 — Rollback verification

- **INPUT:** immutable refs and retained rollback delivery design.
- **ACTION:** confirm refs remain remote and the previous delivery is still live/available; isolate incompatible old automation narrowly.
- **VERIFY:** rollback source and trigger are explicit; untested recovery actions are labeled.
- **SAFE STOP CONDITION:** rollback disappeared, was overwritten, or was affected by migration cleanup.

### Phase 14 — Canonical state update

- **INPUT:** complete evidence chain and final confirmed SHAs/deployment IDs.
- **ACTION:** update concise project state, commit only intended documentation, push, and record final repository HEAD.
- **VERIFY:** facts match Git/provider metadata and the working tree is clean.
- **SAFE STOP CONDITION:** documentation claims more than the evidence or contradicts the current application version/configuration.

## Failure / safe stop

For every condition below, the required response is: **SAFE STOP + evidence + the narrow decision needed.** Do not improvise destructively.

| Condition | Evidence to report | Narrow decision needed |
|---|---|---|
| Unknown dirty tree | status, diff, affected paths | identify ownership/disposition of existing work |
| Local/remote mismatch | local and remote SHAs/divergence | choose an explicit history-resolution strategy |
| Rollback tag exists at another SHA | tag object and dereferenced commit | select the correct baseline/name; never move silently |
| Migration needs unexplained domain/content rewrite | proposed affected modules and reason | product/architecture approval or narrower approach |
| State contract cannot be preserved | key/schema/lifecycle conflict | explicit state-migration product decision |
| Hydration/runtime errors | console/build/runtime evidence | narrow client-boundary or initialization fix |
| Meaningful tests fail | failing tests and semantic impact | migration fix; do not hide or skip tests |
| Asset/provenance loss | missing files/counts/references | restore mapping/assets before continuing |
| Preview lacks exact SHA | deployment metadata | repair Git integration or stop promotion |
| Preview parity regression | baseline/Preview observations | migration-only fix or product decision |
| Hosting project/domain ambiguous | project IDs/domains/links | identify the canonical adapter before mutation |
| Production lacks exact main SHA | branch/deployment metadata | repair automatic delivery; no manual substitute |
| Stable production URL fails | HTTP/client/runtime evidence | retain/restore previous delivery and diagnose |
| Rollback adapter affected | ref/site/workflow evidence | restore rollback availability before cleanup |
| Unrelated product work appears | diff and scope contract | remove it from migration or authorize separately |
| Interrupted state differs from narrative | branch/HEAD/status/diff/artifacts | reconcile evidence before resuming |

Never answer these conditions with reset/clean/force-push, duplicate hosting resources, tag movement, permission broadening, or PASS by assumption.

## Portability

Reusable across projects:

- locked baseline and explicit migration contract;
- immutable rollback before mutation;
- branch-first framework work;
- minimum framework delta;
- browser-state/client-boundary analysis;
- reproducible tests/build plus local runtime parity;
- Preview before main;
- exact-SHA deployment verification;
- desktop/mobile and meaningful interaction parity;
- rollback-first delivery handling;
- evidence-based interruption recovery;
- safe-stop discipline.

Project-specific:

- Vite and Next.js versions;
- App Router versus another routing model;
- number and shape of client boundaries;
- static prerendering, SSR, or server behavior;
- storage implementation and migration requirements;
- build, typecheck, and test tools;
- hosting provider and deployment-protection behavior;
- Pages or another rollback adapter;
- asset and provenance model;
- exact viewports and product flows.

Next.js is not automatically the right target for every React application. This playbook defines a controlled migration method when Next.js has already been chosen.

## Command and evidence accuracy

Stable concepts in this playbook are repository identity, immutable rollback, branch isolation, minimum delta, exact-SHA delivery, parity, and safe-stop behavior. Exact framework and hosting commands are version-sensitive.

The source proof directly used or verified these command families:

- Git status/branch/HEAD/remote/diff/log/tag/branch/switch/commit/merge/push/remote-ref inspection;
- `npm ci`, the project typecheck script, Vitest run, and the Next.js production build script;
- installed Vercel CLI project-update help, framework update, auto-detect resets, and authenticated deployment/project API reads.

Future runs must inspect installed CLI help and official target-framework documentation. If exact syntax cannot be established, document the mechanism and safe-stop rather than fabricate flags.

## Proof 002B reference implementation

This section records evidence from the Tarot migration; it is not the generic algorithm.

| Field | Confirmed value |
|---|---|
| Canonical local repository | `/Users/shivan/Documents/Projects/tarot-learning-proof` |
| GitHub repository | `investiciiv/tarot-learning-proof` |
| Production branch | `main` |
| Pre-migration Vite baseline | `77bc76b0e47a04ed3674fa8c35890617d27a32ab` |
| Immutable rollback tag | `proof-002a-vite-pass` |
| Rollback branch | `rollback/proof-002a-vite` |
| Old foundation | Vite 8 + React + TypeScript |
| New foundation | Next.js `16.3.3` + React `19.2.8` + TypeScript |
| Router/rendering model | App Router; `/` statically prerendered; existing interactive app behind one client boundary |
| Migration branch | `codex/proof-002b-nextjs` |
| Preview SHA | `c88b1afa53ac362c3f7a56ea9e02203485f98e6c` |
| Preview deployment | `dpl_HtmMtiiwe55Ug58KDgeee1MjPhHe`; GitHub branch/SHA exact; `READY` |
| Migration merge SHA | `a49ef6dbd574071883caf3d6a3546790a180940c` |
| Migration production deployment | `dpl_3pnBNVWpHiHeQH7xfKH3evo4FJ4Q`; exact main SHA; `READY` |
| Proof 002B final main SHA | `2d9919db9d3c31e8974a69aecde4e59388dd1464` |
| Final production deployment | `dpl_DFP8gZTuKhDXek6FZzniDWJDrvi4`; exact main SHA; `READY` |
| Stable production URL | `https://tarot-learning-proof.vercel.app/` |
| Vercel adapter | Same project/repository/domain/production branch; framework `nextjs`; native build/install/output autodetection |
| Tests/build | Dependency install PASS; TypeScript PASS; 3 test files / 6 tests PASS; Next.js production build PASS |
| Preservation | 78 cards/images retained; content, domain, persistence, tests, assets, and provenance had zero intended semantic/content diff |
| Storage compatibility | Key `tarot-learning-proof:user-progress:v1` and schema version `1` retained; same-origin Vite progress loaded in Next.js; new progress survived reload |
| Preview parity | Desktop/mobile, map/detail/images, quiz, persistence, overflow, and console PASS |
| Production parity | Desktop/mobile, map/detail/images, quiz, same-origin persistence, overflow, and console PASS |
| Pages rollback | Existing GitHub Pages Vite snapshot remained live; workflow became manual-only and checks out the immutable tag |
| Interruption | Codex usage limit ended the active run; uncommitted changes/build survived; recovery verified Git/filesystem/provider state and resumed at local runtime parity |
| Final result | Proof 002B PASS |

Evidence limits:

- the manual post-migration Pages rebuild path was configured but not executed; successful workflow dispatch is **NOT PROVEN**;
- a full rollback exercise was not performed; rollback refs and live snapshot availability are proven, restoration execution is **NOT PROVEN**;
- storage compatibility is proven only for the tested same-origin key/schema/browser contract;
- tested desktop/mobile viewports do not constitute universal device, accessibility, performance, or cross-browser certification;
- the App Router, single client boundary, and Vercel settings are proof-specific choices, not universal requirements.
