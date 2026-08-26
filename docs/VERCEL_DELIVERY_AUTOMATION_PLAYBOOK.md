# Vercel Delivery Automation Playbook

## Purpose

This playbook was extracted from a real, successful delivery migration: Tarot Learning App Proof 002A. It records what was observed, automated, consent-gated, verified, and retained for rollback. It is not a speculative architecture proposal.

Its boundary is deliberately narrow:

`canonical local repository → GitHub source of truth → Vercel project → Git integration → production deployment → verification → rollback`

It does **not** define:

- application framework or product architecture;
- cloud database or state synchronization;
- authentication or authorization inside the product;
- native or app-store delivery;
- a universal hosting requirement.

The generic procedure uses these placeholders:

- `<LOCAL_REPO>` — canonical local working tree;
- `<GITHUB_OWNER>` and `<GITHUB_REPO>` — GitHub source of truth;
- `<VERCEL_PROJECT>` — one Vercel project selected for the application;
- `<VERCEL_SCOPE>` — Vercel account or team scope;
- `<PRODUCTION_BRANCH>` — branch that creates production deployments;
- `<DEPLOY_URL>` — stable production HTTPS URL.

Tarot-specific values appear only in [Proof 002A reference implementation](#proof-002a-reference-implementation).

## Prerequisites

### Global once per machine/account

The following capabilities normally need to exist once before onboarding projects:

- Git installed and able to inspect and push the intended repository;
- GitHub CLI installed if the workflow intends to use it;
- working GitHub authentication for every mechanism actually used: Git transport, CLI/API, and/or browser;
- Vercel CLI installed;
- working Vercel CLI authentication and a known account/team scope;
- permission to install or configure the Vercel GitHub App for the intended repository;
- a human available for security checks such as GitHub sudo/email verification when GitHub requests them.

Proof 002A evidence:

| Prerequisite | Evidence status |
|---|---|
| Git | **PROVEN.** Git was used for integrity checks, commits, remote comparison, and pushes. |
| GitHub Git transport authentication | **PROVEN.** Pushes to `origin/main` succeeded. |
| GitHub CLI binary | **PROVEN available.** It was not used in the successful setup path. |
| GitHub CLI authentication | **NOT PROVEN as working.** Current extraction-time `gh auth status` reports an invalid token. Do not make `gh` a hidden dependency without a fresh precheck. |
| GitHub browser authentication | **PROVEN.** It was used for GitHub App repository permission and sudo verification. |
| Vercel CLI 59.5.0 | **PROVEN.** It created, linked, configured, listed, inspected, and queried the project. |
| Vercel CLI authentication | **PROVEN.** `vercel whoami` returned the expected account. |
| Vercel scope/team access | **PROVEN.** Project and deployment API reads succeeded in the intended team. |
| GitHub App permission | **PROVEN after consent.** The intended repository was added to the existing Vercel installation. |

Do not copy authentication tokens, `.env.local` contents, GitHub codes, Vercel OIDC values, or credentials into documentation or logs.

### Per project

Each project needs its own confirmed delivery contract:

- one canonical local repository path;
- one expected GitHub remote and production branch;
- one unambiguous Vercel project;
- a local repository-to-Vercel link, normally represented by ignored `.vercel/project.json`;
- a GitHub repository-to-Vercel project connection;
- an explicitly verified production branch;
- correct framework/build/output settings when auto-detection is insufficient;
- environment variables only when the product requires them;
- domains only when the delivery contract requires them;
- a defined previous delivery adapter or other rollback target during migration.

Proof 002A proved build/output configuration and the default Vercel production domain. It did **not** prove custom-domain onboarding or application environment-variable setup. Treat those as project-specific work, not implicit steps in this playbook.

## Automated

This section distinguishes the mechanisms that actually succeeded. “Codex automated it” is not sufficient evidence by itself.

### 1. Source safety and canonical repository

- **Objective:** establish that the existing working tree was safe to move and that no competing target repository existed.
- **Mechanism:** local filesystem and Git.
- **Observed actions:** path existence checks; `.git` check; `git status --short`; `git branch --show-current`; `git rev-parse HEAD`; `git remote -v`; `git fsck --no-dangling`; `git ls-remote --heads origin <PRODUCTION_BRANCH>`.
- **Expected result:** clean or fully understood tree, correct branch/remote, known HEAD, matching remote branch, absent target conflict.
- **Verification:** local and remote SHA equality plus explicit absence of the target path before the move.

The existing repository was moved on the same local filesystem with `mkdir` for the parent and `mv` for the repository. It was not cloned. Afterward Codex rechecked `.git`, branch, HEAD, remote, status, application files, GitHub connectivity, and absence of the old competing path.

### 2. Vercel project inventory and creation

- **Objective:** reuse an existing matching Vercel project or create exactly one.
- **Mechanism:** Vercel CLI.
- **Observed actions:** `vercel --version`, `vercel whoami`, team/project listing, then `vercel project add <VERCEL_PROJECT> --scope <VERCEL_SCOPE>` only after the listing showed no matching project.
- **Expected result:** one project with the intended name and owner/scope.
- **Verification:** Vercel CLI project inspection and API response containing the project ID/name.

If a project listing is unavailable or yields multiple plausible matches, stop. Creation is not a safe way to resolve ambiguity.

### 3. Local Vercel link

- **Objective:** bind `<LOCAL_REPO>` to the selected Vercel project without committing local credentials or link metadata.
- **Mechanism:** Vercel CLI plus local filesystem/Git ignore inspection.
- **Observed Proof 002A command shape:** `vercel link --yes --team <TEAM> --project <VERCEL_PROJECT>` with CLI 59.5.0.
- **Version note:** CLI 59.5.0 warned that `--team` is deprecated and exposes `--scope` as a global option. A future run must read `vercel link --help` and use the syntax supported by its installed version rather than copying the old flag blindly.
- **Expected result:** `.vercel/project.json` identifies the intended project; Vercel-created local environment material remains ignored.
- **Verification:** read only non-secret project identity fields and run `git check-ignore` on `.vercel/*` and `.env.local`.

Proof 002A observed `.vercel/project.json`, `.vercel/README.txt`, and `.env.local`. Their contents were not committed. Secret-bearing files must never be printed merely to prove that they exist.

### 4. Build and output configuration

- **Objective:** ensure Vercel builds the existing application using its actual framework contract.
- **Mechanism:** Vercel CLI/API.
- **Observed action:** the project was updated to framework `vite`, build command `npm run build`, install command `npm install`, and output directory `dist` using the installed CLI’s verified `vercel project update` options.
- **Expected result:** project inspection/API returns the selected framework, build command, and output directory.
- **Verification:** read-only project API query.

This is adapter configuration, not permission to migrate frameworks. Use each project’s real build contract.

### 5. Direct CLI deploy attempt — not a proven success path

- **Objective:** attempt an initial production upload without depending on Git integration.
- **Mechanism:** Vercel CLI direct deploy, followed by an archive-based retry.
- **Observed actions/result:** Proof 002A attempted `vercel deploy --prod --yes` and an archive retry; both uploads ended with `fetch failed`.
- **Expected observable result:** a new production deployment attributable to the upload and a deployment URL/state that could be inspected.
- **Verification:** terminal failure output was recorded; no successful direct-upload deployment was used as delivery evidence.

Therefore:

- a successful direct CLI upload was **not proven**;
- the failures did not prove that manual CLI deploy is generally impossible;
- no PASS was claimed from those attempts;
- the successful delivery path was Git-triggered after integration.

Do not rewrite this history as “CLI deployment succeeded.”

### 6. GitHub repository connection

- **Objective:** connect `<GITHUB_OWNER>/<GITHUB_REPO>` to the intended Vercel project.
- **Mechanisms actually involved:** Vercel CLI attempt, Vercel Dashboard, GitHub App settings, and authenticated GitHub/Vercel browser sessions.
- **CLI evidence:** `vercel git connect <GIT_URL> --scope <VERCEL_SCOPE>` was supported by CLI 59.5.0 but could not complete because the Vercel GitHub App lacked access to the repository.
- **Successful path:** after the consent/security gate, Codex added the repository to the existing Vercel GitHub App installation and selected the repository in the Vercel project’s Git settings.
- **Expected result:** Vercel shows the exact repository as connected.
- **Verification:** Vercel project API returned link type `github`, expected owner/repository, and production branch `main` in the reference proof.

The browser fallback was real and must not be omitted from future expectations. See [Browser fallback](#browser-fallback).

### 7. Git pushes and automatic deployments

- **Objective:** make GitHub the source of production deployments.
- **Mechanism:** Git commits/pushes plus Vercel Git integration.
- **Observed actions:** infrastructure-only commits were pushed to `main`; Vercel deployment lists/API were polled read-only until deployments reached `READY`.
- **Expected result:** each eligible production-branch SHA creates a distinct Git-sourced deployment.
- **Verification:** deployment API metadata and `gitSource` must identify the exact branch and SHA.

The first Vercel infrastructure deployment reached `READY` but exposed a client asset-base defect. A delivery-only Vite configuration commit corrected the Vercel root base while preserving the GitHub Pages subpath. Only after the rendered client passed was delivery considered functional.

### 8. Exact-SHA auto-deploy proof

- **Objective:** prove Git integration rather than infer it.
- **Mechanism:** Git plus Vercel CLI/API.
- **Observed action:** `git commit --allow-empty -m "Verify Vercel auto-deploy"`, followed by `git push origin main`.
- **Expected result:** a new deployment not present before the push.
- **Verification:** Vercel deployment ID, `READY` state, target `production`, `gitSource.ref`, and `gitSource.sha` matched the verification commit exactly.

### 9. Client verification

- **Objective:** prove that the production URL serves the existing primary experience, not merely a successful build artifact.
- **Mechanism:** read-only browser inspection after deployment.
- **Observed verification:** desktop viewport `1440×900`; mobile override `390×844` with an observed client width of `375`; page title and primary learning journey text; navigation presence; equal `clientWidth`/`scrollWidth`; empty error/warning console check.
- **Expected result:** primary flow loads over HTTPS without obvious responsive overflow or runtime errors in the checked views.

These checks prove the tested views. They are not universal device, browser, accessibility, performance, or mobile certification.

## Consent required

### GitHub App repository permission

- **Trigger:** the repository did not appear in Vercel and CLI connection failed because the existing Vercel GitHub App installation did not include it.
- **Nature:** persistent account/security authorization, not technical application configuration.
- **Human role:** the user explicitly approved expanding the Vercel GitHub App installation to the intended repository.
- **After consent:** Codex could select the specific repository, save the installation, connect it in Vercel, and continue verification.
- **Expected frequency:** only when the App is absent, its installation lacks the repository, or organizational policy requires renewed approval. It should not be assumed for every project.

### GitHub sudo/email verification

- **Trigger:** GitHub required sudo mode before changing the installed App’s repository access.
- **Nature:** identity/security verification.
- **Human role:** GitHub sent a verification code by email; the user entered the code and completed `Verify` in the GitHub page.
- **After consent:** Codex resumed repository selection and completed the integration.
- **Expected frequency:** conditional on GitHub session age/security policy, not a per-project invariant.

### Codex execution-environment approvals

The managed Codex environment requested escalation for some networked CLI commands and filesystem operations. Those approvals are runner/sandbox-specific and are not a Vercel delivery requirement. Future environments may have different confirmation boundaries.

Legitimate OAuth, GitHub App, sudo, or sandbox gates are consent boundaries, not automation failures.

## Browser fallback

Browser use was required in Proof 002A.

Exact purposes:

1. open Vercel Git settings after `vercel git connect` could not access the repository;
2. open the installed Vercel GitHub App configuration;
3. allow the user to complete GitHub sudo/email verification;
4. add only the intended repository to the installation;
5. select/connect that repository in the Vercel project;
6. inspect the published client at desktop and mobile viewport sizes.

Computer Use was **not used** in Proof 002A.

The configuration fallback may be avoidable when the Vercel GitHub App already has repository access and the installed CLI can complete `vercel git connect`. That elimination is **NOT PROVEN** by Proof 002A; do not promise it. Browser-based client verification remains useful even when configuration is CLI-only.

## Manual only

**NONE PROVEN for project configuration.**

The user’s entry of the GitHub email verification code was human-only security input, but it belongs to [Consent required](#consent-required), not to manual Vercel/Git configuration. No dashboard setting was delegated to the user as routine manual setup.

## Verify

Delivery PASS requires an evidence chain. A successful command, green build, or reachable hostname alone is insufficient.

### Canonical local repository

- `<LOCAL_REPO>` exists.
- Its `.git` directory exists.
- Any old path that would compete as canonical is absent where a move was required.
- Expected application/configuration files remain present.

### Git integrity

- current branch equals `<PRODUCTION_BRANCH>` or the explicitly intended working branch;
- origin equals `https://github.com/<GITHUB_OWNER>/<GITHUB_REPO>.git` or the approved equivalent;
- local HEAD is recorded;
- remote `<PRODUCTION_BRANCH>` HEAD is recorded;
- local/remote difference is explained before mutation;
- working tree is clean or every change is known and protected.

### Vercel project

- one project exists in the expected scope;
- project name and project ID are recorded;
- local `.vercel/project.json` exists and names that project;
- `.vercel` and secret-bearing local environment files are ignored;
- framework/build/output settings match the application contract.

### Git integration

- Vercel’s project link identifies `<GITHUB_OWNER>/<GITHUB_REPO>`;
- link type is the intended Git provider;
- production branch equals `<PRODUCTION_BRANCH>`;
- repository permission is actually available to the Vercel GitHub App.

### First functional deployment

- dependencies/install step succeeds;
- application tests required by the project pass;
- production build succeeds;
- Vercel deployment reaches `READY` or the current equivalent success state;
- stable `<DEPLOY_URL>` responds over HTTPS;
- the client renders the primary flow and its required assets, rather than an empty shell or error page.

### AUTO-DEPLOY HARD PROOF

This chain is mandatory:

`new Git commit → push <PRODUCTION_BRANCH> → new Vercel deployment → exact SHA/branch match → READY → functional production URL`

Required evidence:

1. record the deployment list or latest deployment before the verification push;
2. create a smallest safe commit, preferably an empty commit when no file change is needed;
3. push `<PRODUCTION_BRANCH>` to the expected GitHub repository;
4. observe a **new** Vercel deployment ID/URL;
5. query deployment metadata or `gitSource`;
6. require exact equality with the pushed commit SHA and branch;
7. wait for `READY`/success;
8. recheck the stable production URL.

A manual `vercel deploy` does **not** prove Git auto-deploy.

### Client access

At least one normal desktop view and one representative mobile breakpoint should load the primary experience. Check HTTPS, title/content, required assets/navigation, obvious horizontal overflow, and runtime errors. Record exact viewports and limits. Do not generalize two viewport checks into full device certification.

## Rollback

Safe delivery migration is rollback-first:

- never disable a working delivery adapter before the candidate replacement receives full PASS;
- preserve the previous live URL and its configuration during the migration proof;
- do not delete workflows, branches, aliases, projects, or deployments merely to make the new path look canonical;
- define the rollback source, URL, responsible branch/commit, and trigger before cleanup;
- if the candidate fails build, rendering, Git integration, or exact-SHA auto-deploy proof, keep the previous adapter canonical;
- perform cleanup only in a later, separately authorized task after acceptance.

In Proof 002A, GitHub Pages remained live as the Proof 001 rollback adapter while Vercel became the candidate canonical delivery. No rollback cleanup was performed.

## Reusable

### Phase 0 — Preconditions

- **INPUT:** machine/account context, `<LOCAL_REPO>`, intended GitHub and Vercel identities.
- **ACTION:** check installed Git/GitHub/Vercel tools and the authentication mechanism each later step will actually use; read current CLI help before copying version-sensitive commands.
- **VERIFY:** tool versions, Git transport, Vercel account/scope, repository permission capability.
- **SAFE STOP CONDITION:** required authentication is missing, belongs to the wrong account/team, or cannot be verified without a security gate the user has not approved.

### Phase 1 — Source safety gate

- **INPUT:** current repository path, target canonical path, expected GitHub repository/branch.
- **ACTION:** inspect both paths, `.git`, status, branch, HEAD, remote, and remote branch SHA.
- **VERIFY:** source exists, target has no conflicting project, changes are known, and history/remote are consistent.
- **SAFE STOP CONDITION:** target contains another repository, tree has unknown changes, remote is wrong, or local/remote history differs without an approved resolution.

### Phase 2 — Canonical local repository

- **INPUT:** safe source and absent/non-conflicting target.
- **ACTION:** move the existing working tree reversibly on the same filesystem when possible; do not create a second canonical clone.
- **VERIFY:** new path contains `.git` and application files; old competing path is absent; branch, HEAD, remote, status, and connectivity are preserved.
- **SAFE STOP CONDITION:** move is cross-device/non-atomic without a recovery plan, files disappear, Git identity changes, or the old project remains ambiguous.

### Phase 3 — Vercel project and local link

- **INPUT:** canonical repository, intended `<VERCEL_SCOPE>` and `<VERCEL_PROJECT>`.
- **ACTION:** inventory projects; create only if no match exists; link the local directory; configure framework/build/output only when required.
- **VERIFY:** one project ID, correct scope, matching `.vercel/project.json`, ignored link/environment files, and read-back of build settings.
- **SAFE STOP CONDITION:** duplicate-project ambiguity, wrong scope, link points to another project, or the tool requests secret exposure/commit.

### Phase 4 — Git integration

- **INPUT:** linked Vercel project, `<GITHUB_OWNER>/<GITHUB_REPO>`, `<PRODUCTION_BRANCH>`.
- **ACTION:** attempt the supported CLI/API connection; if repository permission is missing, stop at the GitHub App consent gate; after approval, grant only the intended repository and complete the Vercel connection.
- **VERIFY:** Vercel API/dashboard identifies the exact repository and production branch.
- **SAFE STOP CONDITION:** repository absent from the authorized installation, wrong repository selected, branch uncertain, or consent unavailable.

### Phase 5 — Initial deployment

- **INPUT:** connected repository and confirmed build contract.
- **ACTION:** create/push the smallest justified infrastructure change or use another approved initial-deployment mechanism; do not modify product behavior merely to trigger a build.
- **VERIFY:** install/tests/build succeed; deployment reaches success; `<DEPLOY_URL>` renders the application and assets.
- **SAFE STOP CONDITION:** build is green but client is blank/broken, deployment URL is protected unexpectedly, or replacement URL cannot serve the primary flow.

### Phase 6 — Auto-deploy proof

- **INPUT:** already connected Git integration and known pre-push deployment state.
- **ACTION:** create a smallest safe new commit, push `<PRODUCTION_BRANCH>`, and do not run a manual deployment for this proof.
- **VERIFY:** new deployment ID; exact Git SHA and branch; `READY`; stable production URL remains functional.
- **SAFE STOP CONDITION:** no new deployment, deployment source cannot be tied to the commit, wrong environment/branch, build failure, or manual deployment is the only working trigger.

### Phase 7 — Desktop/mobile verification

- **INPUT:** stable production HTTPS URL and primary user flow.
- **ACTION:** inspect one normal desktop view and one documented mobile breakpoint; exercise the smallest meaningful load/navigation check.
- **VERIFY:** content/assets/navigation present, no obvious overflow, no runtime error signal in checked views.
- **SAFE STOP CONDITION:** empty root, missing assets, broken primary navigation, overflow that blocks use, or client errors.

### Phase 8 — Canonicalize delivery

- **INPUT:** complete evidence chain and rollback target.
- **ACTION:** update the repository-owned delivery state with path, GitHub, Vercel project/ID, URL, branch, integration, auto-deploy evidence, PASS/FAIL, rollback, and next step.
- **VERIFY:** factual state matches APIs/Git; commit and push documentation; final HEAD is known.
- **SAFE STOP CONDITION:** any required PASS is inferred rather than evidenced or state contradicts live configuration.

### Phase 9 — Optional rollback cleanup later

- **INPUT:** explicit acceptance of the new canonical adapter and separate cleanup authorization.
- **ACTION:** plan any removal/disablement as a new reversible task.
- **VERIFY:** rollback consequences and recovery procedure are understood before mutation.
- **SAFE STOP CONDITION:** acceptance is missing, dependencies are unclear, or cleanup would remove the only proven working adapter.

## Failure / safe stop

| Condition | Required response |
|---|---|
| Target canonical path contains another repository | Stop; identify both repositories and request a decision. |
| Dirty tree contains unknown work | Stop; do not stash, reset, move, or overwrite it implicitly. |
| Local and remote history differ | Stop; report SHAs/divergence before choosing merge/rebase/push behavior. |
| Origin points to the wrong GitHub repository | Stop; do not create or connect hosting resources. |
| Multiple Vercel projects plausibly match | Stop; inspect ownership/IDs and request disambiguation. |
| Vercel/GitHub authentication unavailable | Stop at the auth gate; do not create replacement accounts or tokens. |
| GitHub App lacks repository permission | Stop at consent; do not broaden to all repositories without explicit authorization. |
| Production branch is uncertain | Stop; verify GitHub default/desired branch and Vercel project link. |
| Direct/manual deployment works but Git auto-deploy is unproven | Mark auto-deploy FAIL/NOT PROVEN; do not claim delivery automation PASS. |
| Deployment is `READY` but the client is blank or broken | Mark functional delivery FAIL and diagnose adapter/build-path configuration. |
| Replacement URL fails | Retain the previous adapter as canonical/rollback. |
| Rollback adapter is accidentally affected | Stop further cleanup and restore/verify rollback before continuing. |
| Exact CLI syntax cannot be established | Describe the mechanism and require `--help`; do not fabricate flags. |

Do not respond to these conditions with duplicate repositories/projects, destructive Git operations, permission broadening, or unverified production claims.

## Portability

Reusable across projects:

- delivery contract and canonical repository discipline;
- source/authentication prechecks;
- one-project/one-repository identity checks;
- local link verification without secret exposure;
- production-branch confirmation;
- exact-SHA Git auto-deploy proof;
- client verification after infrastructure success;
- rollback-first migration;
- evidence-backed PASS/FAIL and safe-stop rules.

Project- or adapter-specific:

- framework and framework detection;
- install/build commands and output directory;
- asset base/routing behavior;
- environment variables and secrets;
- custom domains and deployment protection;
- backend/cloud services;
- hosting provider APIs, CLI versions, and consent flows;
- native delivery.

**Vercel is a delivery adapter, not a universal requirement for every application.** The verification contract can be reused with another adapter even when the commands, APIs, and deployment states differ.

## Version-sensitive command notes

The following command mechanisms were used or verified against Vercel CLI 59.5.0 during Proof 002A/extraction:

- `vercel --version`
- `vercel whoami`
- `vercel projects ls --scope <VERCEL_SCOPE>`
- `vercel project add <VERCEL_PROJECT> --scope <VERCEL_SCOPE>`
- `vercel link --help` and `vercel link --yes --team <TEAM> --project <VERCEL_PROJECT>` (the proof command succeeded but emitted a deprecation warning for `--team`)
- `vercel project update <VERCEL_PROJECT> --framework <FRAMEWORK> --build-command <COMMAND> --output-directory <DIR> --install-command <COMMAND> --scope <VERCEL_SCOPE>`
- `vercel git connect <GIT_URL> --scope <VERCEL_SCOPE>` (supported, attempted, but not the successful connection path in this proof)
- `vercel list <VERCEL_PROJECT> --scope <VERCEL_SCOPE>`
- `vercel inspect <DEPLOYMENT_URL> --json --scope <VERCEL_SCOPE>`
- authenticated read-only `vercel api` project/deployment queries.

Git mechanisms actually used included:

- `git status --short`
- `git branch --show-current`
- `git rev-parse HEAD`
- `git remote -v`
- `git ls-remote --heads origin <PRODUCTION_BRANCH>`
- `git commit --allow-empty -m "Verify Vercel auto-deploy"`
- `git push origin <PRODUCTION_BRANCH>`

These are evidence, not a promise of future syntax stability. Every future run must inspect the installed CLI help and avoid copying deprecated flags.

## Proof 002A reference implementation

This section is reference evidence, not the generic algorithm.

| Field | Confirmed value |
|---|---|
| Canonical local repository | `/Users/shivan/Documents/Projects/tarot-learning-proof` |
| GitHub repository | `investiciiv/tarot-learning-proof` |
| Production branch | `main` |
| Proof 002A final state HEAD | `e3d2aecd381dd0c4e25f3bff3e620632f53cba12` |
| Vercel CLI | `59.5.0` |
| Vercel account | `investiciiv-6233` |
| Vercel team | `investiciiv-6233s-projects` |
| Vercel project | `tarot-learning-proof` |
| Vercel project ID | `prj_FOHdyUeZjAy0pCEUOgQdXJmOk3Gh` |
| Framework | Vite |
| Build/output | `npm run build` → `dist` |
| Production URL | `https://tarot-learning-proof.vercel.app/` |
| Connected Git repository | `investiciiv/tarot-learning-proof` |
| Auto-deploy verification commit | `c0b2c8854fa6ab8e8efc9eef00844dad3fca0111` |
| Verification deployment | `dpl_GtUSpy2Fj7fRbcTMUy3RTaW5JC85` |
| Deployment evidence | `target=production`, `readyState=READY`, `gitSource.ref=main`, exact verification SHA |
| Consent gate | Vercel GitHub App repository access plus GitHub sudo/email verification |
| Browser fallback | Required for GitHub App permission, Vercel repository connection, and client checks |
| Computer Use | Not used |
| Manual-only configuration | None proven |
| Human-only security input | User entered GitHub email verification code |
| Rollback | GitHub Pages remained live and untouched |
| Final result | Proof 002A PASS |

Evidence-quality caveats:

- GitHub CLI authentication was not part of the successful path and is currently invalid; it is not a proven prerequisite for this implementation.
- Direct `vercel deploy` upload success was not proven because both upload attempts failed with `fetch failed`.
- Custom domains, product environment variables, backend/cloud state, authentication, Next.js migration, native delivery, broad device coverage, and accessibility certification were not part of Proof 002A.
- Whether the browser configuration fallback can always be eliminated after pre-authorizing the GitHub App is **UNKNOWN / NOT PROVEN**.
