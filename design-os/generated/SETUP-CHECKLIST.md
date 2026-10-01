# Ledgerline Design OS — Setup Checklist

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Artifact index](ARTIFACT_INDEX.md) · Next: [Implementation prompt](IMPLEMENTATION_PROMPT.md) · [Start here](START_HERE.md)

## Table of contents

- [1. Before you start](#1-before-you-start)
- [2. Environment](#2-environment)
- [3. Protect the owner's work](#3-protect-the-owners-work)
- [4. Verify the existing starter](#4-verify-the-existing-starter)
- [5. Connect the backend and the contract](#5-connect-the-backend-and-the-contract)
- [6. Folder structure](#6-folder-structure)
- [7. Constants: where every limit lives](#7-constants-where-every-limit-lives)
- [8. Dependencies](#8-dependencies)
- [9. Interaction-contract bootstrap](#9-interaction-contract-bootstrap)
- [10. Testing setup and seed tiers](#10-testing-setup-and-seed-tiers)
- [11. Developer workflow and the CI gate](#11-developer-workflow-and-the-ci-gate)
- [12. Verification checklist](#12-verification-checklist)
- [13. Known gaps in the host](#13-known-gaps-in-the-host)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

## 1. Before you start

### 1.1 Read these phases first

1. [Phase 1 — Product Vision](phase-1-product-vision.md): personas, business rules BR1–BR20 (especially BR1 money, BR5 masking, BR12 access, BR13 denial, BR18 repeated and conflicting actions, BR19 limits, BR20 failure), non-goals, OD1–OD16.
2. [Phase 3 — Information Architecture](phase-3-information-architecture.md): sitemap, route groups, permissions, protected prefixes.
3. [Phase 7 — Frontend Architecture](phase-7-frontend-architecture.md): where every file goes, how data flows, the constants table (§10), the error taxonomy (§13.6), the CI gate (§14.2) and security (§22).

### 1.2 Understand these concepts

- [ ] **Personas and roles** — workspace roles owner, finance, accountant, viewer; platform roles support, compliance, admin (sharing `ADMIN` today).
- [ ] **Navigation** — two shells (`(app)` and `(admin)`), the `(workspace)` nested group, the P12 intercepted overlay.
- [ ] **Interaction contracts** — every control's behaviour is in [Phase 6](phase-6-interaction-contracts.md), including the 23 rules every contract inherits; appearance is not.
- [ ] **Four states** — every data section renders loading, empty, error, populated through C57; a denial is the not-permitted empty state, never the error state.
- [ ] **One authority for limits** — values in [Phase 1 BR19](phase-1-product-vision.md#data-and-operations), constant names in [Phase 7 §10](phase-7-frontend-architecture.md#10-constants). No limit is typed as a number in a component.
- [ ] **Writes** — every write carries an idempotency key, is never retried automatically, and is refused when the record changed underneath it.
- [ ] **Status lives in one place** — [Phase 8](phase-8-implementation-roadmap.md#build-status-register).
- [ ] **Visual hand-off** — no page is styled from these documents; each page's look is proposed with the repo UI skills and approved by the owner ([IMPLEMENTATION_PROMPT §3](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off)).

## 2. Environment

1. [ ] Node.js — the version the repo's toolchain expects (Next.js 16 requires a current LTS; CI uses Node 20); check with `node -v`.
2. [ ] pnpm — `corepack enable` then `pnpm -v`. The repo uses `pnpm-lock.yaml`; do not use npm or yarn.
3. [ ] Editor — TypeScript from the workspace (`node_modules/typescript`), ESLint and Prettier extensions (the repo has `prettier-plugin-tailwindcss`).
4. [ ] Environment file — copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_API_URL` — the backend origin. An absolute URL; HTTPS outside local development.
   - `JWT_PUBLIC_KEY` — the backend's RS256 public key (verification only; the frontend never holds the private key).
5. [ ] Backend running locally from `../backend` with its seed (`backend/prisma/seed.ts`) — all product demo data comes from there (BR11).

### 2.1 Validate configuration at startup

[Phase 7 §10.4](phase-7-frontend-architecture.md#104-environment-and-configuration) requires configuration to be read in one place, validated at startup, and to stop the process on a bad value. None of this exists yet; build it before the first signed-in page.

1. [ ] `lib/validations/env.ts` — one Zod schema for server variables and one for `NEXT_PUBLIC_*` variables.
2. [ ] `lib/utils/server-env.ts` (`server-only`) and `lib/utils/public-env.ts` — each parses once and exports the typed result. No other file reads `process.env`.
3. [ ] `instrumentation.ts` `register()` imports the validated configuration, so a missing or malformed value throws before the server accepts a request. The message names the variable and the rule it broke and never prints the value.
4. [ ] No silent defaults in production: the localhost fallback for `NEXT_PUBLIC_API_URL` applies only when `NODE_ENV` is not `production`; a `JWT_PUBLIC_KEY` that does not import as an RS256 public key is a startup failure, not "everyone is signed out".
5. [ ] `.env.example` lists every variable name with no values; a variable in the schema without an entry there fails the schema's own test.

| Variable | Scope | Rule |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | public | Absolute URL; HTTPS in production |
| `JWT_PUBLIC_KEY` | server | PEM or base64 PEM that imports as an RS256 public key |
| Money-movement switch | server | Boolean, default off; anything but an explicit "on" is off |
| Reporting endpoint and key | server, once a service is chosen | Optional; absent means reporting is a no-op |
| `CONTRACT_SOURCE` | tooling | Path to the backend OpenAPI document (§5) |

## 3. Protect the owner's work

The home page is the owner's (`app/(marketing)/page.tsx`, `app/(marketing)/layout.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`, `lib/ledgerline/`, `lib/types/ledgerline.ts`, `lib/validations/contact.ts`, `components/wrappers/reveal-words.tsx`, `lib/hooks/use-damped-pointer.ts`). It is committed; the owner continues to work on it page by page.

- [ ] Do **not** checkout, switch branches, stash, reset or commit on the owner's behalf.
- [ ] Do not "fix" the home page toward either side of OD9 or OD10; those are the maintainer's decisions.
- [ ] Leave any change you find in the working tree that you did not make.
- [ ] Before adding a domain type, rename any public-page sample type in `lib/types/ledgerline.ts` that shares its name (`Transaction` is already `ActivityEntry`; `NavLink`, `Figure`, `Approval` and `Plan` remain — R-10 / H-25).

## 4. Verify the existing starter

Run only when you want the gate (git hooks are disabled; CI is the gate):

1. [ ] `pnpm install` — note that `prepare` unsets `core.hooksPath`; nothing runs on commit or push.
2. [ ] `pnpm type-check`
3. [ ] `pnpm lint`
4. [ ] `pnpm test` (vitest: utils, proxy, route handlers, server actions, lint rules, codemods, contract generator)
5. [ ] `pnpm dev` and open:
   - `/` — the owner's home page (P01, Built).
   - `/auth/login` and `/auth/register` — sign in (P02) and register (P03), both Built, against the seeded backend.
   - `/help` — help center (P28, Built).
   - `/insights/runway` — runway calculator (P16, Built). It opens signed out today (H-26); that is a defect to fix, not the intended behaviour.
   - `/dashboard` — protected; currently no page (H-15).
6. [ ] Record failures against [Phase 9 host findings](phase-9-qa-checklist.md#host-audit-findings) rather than fixing ad hoc.

## 5. Connect the backend and the contract

1. [ ] In the backend: `pnpm openapi` to emit `openapi.json`.
2. [ ] Point `CONTRACT_SOURCE` at `../backend/openapi.json`. The generator already defaults to that path, but set it explicitly wherever the gate runs: the check exits 0 when the document is missing, so a run without the file passes vacuously (R-8). Confirm the file is present before trusting a pass.
3. [ ] `pnpm contract` — regenerates `lib/contract/`. Never edit that folder.
4. [ ] `pnpm contract:check` — must pass with the source present. Making it fail when the source is absent is FD12.
5. [ ] Confirm existing endpoints resolve typed: register, login, users (list, create, me, get, update, delete), health, stats total and series, accounts (`GET /api/accounts`) and cash flow (`GET /api/cash-flow`) ([Phase 7 §13.4](phase-7-frontend-architecture.md#134-endpoints)).
6. [ ] Hand the backend team the required-resource list from [Phase 8 › Backend modules](phase-8-implementation-roadmap.md#backend-modules), including the nine cross-cutting requirements the audit added: BE-request-reference, BE-idempotency, BE-versioning, BE-cursor, BE-step-up-marker, BE-throttling, BE-csv-safety, BE-key-rotation, BE-sign-out. Every response type needs `@ApiEnvelope(Dto)` or it degrades to `Endpoint<unknown>`.
7. [ ] Note the account-status mismatch: the backend publishes `OPEN / FROZEN / CLOSED`; the specification has four states. Use the OD11 default mapping until the maintainer answers.

## 6. Folder structure

Create folders only when their first file is written (the host rule). Match [Phase 7 §3](phase-7-frontend-architecture.md#3-folder-structure).

1. [ ] Host folders already present: `components/{ui,common,wrappers,providers}`, `lib/{actions,contract,data,hooks,types,utils,validations}`, `tools/*`.
2. [ ] Feature folders already present: `components/{auth,help,insights,ledgerline,shell,status}`. They stay as found; whether the host folder table is amended to name feature folders is OD4.
3. [ ] Route groups `(marketing)`, `(auth)`, `(app)`, `(admin)` exist (FD04, In progress). Still to add: the `(app)` and `(auth)` layouts and the `(workspace)` nested group. Moving a page replaces it; never leave two files for one URL.
4. [ ] Per-segment `loading.tsx`, `error.tsx`, `not-found.tsx` as listed in [Phase 4 › Segment files](phase-4-page-blueprints.md#segment-files). Root and `(marketing)` error surfaces exist; `(app)`, `(auth)` and `(admin)` do not.
5. [ ] `lib/data/` for nav config, admin nav, permission matrix, empty-state copy, help articles.

## 7. Constants: where every limit lives

Every limit, timing and retention value is fixed in [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) and has one named constant in [Phase 7 §10](phase-7-frontend-architecture.md#10-constants). Set the constants up before the code that needs them.

1. [ ] Read the placement rule ([§10.1](phase-7-frontend-architecture.md#101-placement-rule)): shared values in `lib/constants.ts`, one feature's values in `lib/<feature>/constants.ts`, state tuples in `lib/enums/`, static copy and config in `lib/data/`.
2. [ ] Add the Sprint 1 constants from [§10.2](phase-7-frontend-architecture.md#102-additions-to-libconstantsts) first: `PROTECTED_ROUTE_PREFIXES` (every signed-in and admin prefix — today it lists `/dashboard` only), `ADMIN_ROUTE_PREFIX`, route constants, `PAGE_TITLES`, `APP_ROBOTS`, `STALE_TIME`, `GC_TIME_MS`, `MAIN_CONTENT_ID`.
3. [ ] Add the transport constants before any new hook or action: `BACKEND_TIMEOUT_MS`, `UPLOAD_TIMEOUT_MS`, `REQUEST_TIMEOUT_MS`, `MUTATION_TIMEOUT_MS`, `SLOW_REQUEST_MS`, `QUERY_RETRY_LIMIT`, `QUERY_RETRY_BASE_MS`, `QUERY_RETRY_MAX_MS`, `REQUEST_ID_HEADER`, `REQUEST_ID_LENGTH`, `IDEMPOTENCY_KEY_HEADER`.
4. [ ] Add `ERROR_KIND` (in `lib/enums/`) and the `ERROR_MESSAGE` record keyed by kind, so no error copy lives in a component ([§13.6](phase-7-frontend-architecture.md#136-error-taxonomy)).
5. [ ] Take each value from [§10.3](phase-7-frontend-architecture.md#103-specified-values). When a value there differs from BR19, BR19 wins and the difference is a defect to report, not a choice to make.
6. [ ] Add a section's limits (`LEDGER_PAGE_SIZE`, `NOTE_MAX_LENGTH`, `EXPORT_MAX_RANGE_DAYS`, …) in the sprint that builds the section, under the names §10.2 lists. Never invent a second name for a limit that has one.
7. [ ] Keep one locale constant, `DEFAULT_LOCALE`, and one `DEFAULT_CURRENCY`; a second locale constant exists in `lib/ledgerline/constants.ts` (H-31) and is not to be copied.

## 8. Dependencies

Follow the seed's Library Selection Policy: reuse what is installed; recommend; **confirm before installing**; never hand-edit `package.json`.

| Need | Installed today | Proposal (awaiting approval) |
|---|---|---|
| Server state | `@tanstack/react-query` | — |
| Validation | `zod` | — |
| Forms | — | LD3 `react-hook-form` + `@hookform/resolvers` |
| Animation | `motion` | — |
| Charts | `recharts` (LD1, installed; where its approval is recorded is an open question in Phase 8) | — |
| Tables at scale | — | LD2 `@tanstack/react-table` + `@tanstack/react-virtual` |
| Positioning | native | LD5 `@floating-ui/react` only if native anchor positioning falls short |
| Icons | `@carbon/icons-react` | — |
| Dates | `date-fns` | — |
| IDs | `nanoid` | — |
| Token verification | `jose` | — |
| Tests | `vitest`, `fast-check` | LD4 Testing Library, jsdom, Playwright, axe |

1. [ ] Send the LD2–LD5 requests (FD14–FD17), each naming the package, purpose and why the installed stack does not cover it.
2. [ ] After approval only: `pnpm add <package>` (or `pnpm add -D` for LD4).
3. [ ] Record the approval in [Phase 8](phase-8-implementation-roadmap.md#library-decisions).
4. [ ] A monitoring or error-reporting service is also a dependency decision (OD8) and a data-handling decision; do not add one without both.

## 9. Interaction-contract bootstrap

Build the Sprint 1 contracts in dependency order. Their behaviour comes from [Phase 6](phase-6-interaction-contracts.md); their look comes from the owner-approved concept for the first page that uses them.

1. [ ] Fix C01 Button (host): `displayName`, no focus-outline removal, `disabled || isLoading` (H-06, H-07, H-22).
2. [ ] C10 Field is Built; add its required state. Then C04 Input, C06 Select, C07 Checkbox, C08 RadioGroup, C09 Switch, C05 Textarea.
3. [ ] C16 Loading placeholder, C17 Progress indicator, C32 EmptyState (including its not-permitted kind), C33 ErrorState (a reference is required for every kind).
4. [ ] C57 QueryBoundary, C58 SectionErrorBoundary, C59 PermissionGate, C63 WorkspaceProvider.
5. [ ] C02, C03, C12, C13, C14, C18, C20, C27, C29.
6. [ ] C35 NavItem, C36 WorkspaceSwitcher, C37 UserMenu; C54 only if more than one colour scheme is offered.
7. [ ] Finish the C34 sign-in defects that remain after the 2026-10-01 re-check: read `Retry-After` on a throttled sign-in (H-02), tie the error to each field (H-05), give a forgotten password a real destination once P04 exists (H-04). H-01 and H-03 are no longer reproducible.
8. [ ] Promote feature-local precursors on second use rather than copying them: C04 (`components/auth/auth-field.tsx`), C11 (inside `components/help/help-search.tsx`), C29 (`components/help/help-breadcrumbs.tsx`), C32 (`components/help/help-empty.tsx`), C33 (inside `components/status/server-error-panel.tsx`).

## 10. Testing setup and seed tiers

1. [ ] Unit and property tests with vitest + fast-check (installed): `lib/utils/money.ts` properties (no float drift, sign, exponents 0/2/3, idempotent parse, malformed input gives the unavailable result), date ranges (month-end, leap day, daylight-saving change, workspace time zone), `internalPath` (every off-site form refused), the query-key factory (workspace ID present in every workspace-scoped key), `errorKind` (every status maps to exactly one kind).
2. [ ] Server-boundary tests with a stubbed upstream: input refused before any upstream call; each upstream status mapped to its kind; a timeout becomes `unavailable`; the guard matrix for signed-out, wrong-role and stale-workspace requests.
3. [ ] Contract tests: `contract:check` with a real source.
4. [ ] Lint-rule tests: any new rule in `tools/eslint/rules/` gets a colocated `.test.ts` and registration in the `starter` plugin.
5. [ ] Component, E2E and accessibility tests: after LD4 approval — Testing Library + jsdom for four-state and keyboard checks; Playwright for F1–F5 and X1–X11 (one success, one recovery, one session expiry mid-flow and one denial per flow); axe on every page. Until then the manual step in each Phase 9 item is the check of record.
6. [ ] Ask the backend team for the seed tiers Phase 9 runs against ([Phase 9 › How to use this checklist](phase-9-qa-checklist.md#how-to-use-this-checklist), P9-A2). All of it comes from the backend seed, never from frontend arrays:

| Tier | Contents | Used by |
|---|---|---|
| `ledger-0` | One account with no transactions | Empty states, scale edges |
| `ledger-1` | One account with one transaction | Scale edges |
| `ledger-10k` | One account with 10,000 transactions | Count limit, baseline timings |
| `ledger-100k` | One account with 100,000 transactions | First-week Sprint 3 performance signal |
| `ledger-5m` | One account with 5,000,000 transactions | Sprint 3 entry; Milestone M3 budgets |
| Multi-currency workspace | Accounts in USD, EUR, GBP, JPY and BHD (exponents 2, 0 and 3) | Money and data integrity |
| Workspaces A and B | One member in A only, one member in both | Workspace isolation |
| Role users | One seeded user per role R1–R7 | Role sweeps and denial |
| Large team | A workspace of 200 members | Team limits and paging |
| Platform users | 10,000 platform users | Admin directory paging |

7. [ ] Check that no test, fixture, screenshot or trace holds data about a real person or a real account before it is stored as evidence.

## 11. Developer workflow and the CI gate

1. [ ] Git hooks are disabled by design; run `pnpm type-check`, `pnpm lint`, `pnpm test` and `pnpm contract:check` before a PR, and say in the PR that you did.
2. [ ] CI (`.github/workflows/ci.yml`) runs install, lint and build today, on `master`/`main` and on pull requests. FD12 extends it to the full gate, in this order ([Phase 7 §14.2](phase-7-frontend-architecture.md#142-verification-layers)); any failing step blocks the merge:
   1. `pnpm install --frozen-lockfile`
   2. `pnpm type-check`
   3. `pnpm lint`
   4. `pnpm test`
   5. `pnpm contract:check` with `CONTRACT_SOURCE` set, failing when the document is absent
   6. `pnpm audit --prod`
   7. `pnpm build`
   8. End-to-end, accessibility and performance suites (after LD4; steps 1–7 do not wait on it)
3. [ ] Decide with the maintainer whether CI also runs on the `development` branch (open question in Phase 8).
4. [ ] A skipped or flaky test is fixed or removed with a recorded reason, never retried until green.
5. [ ] Formatting: Prettier with the Tailwind plugin (installed).
6. [ ] Codemod: `pnpm codemod:extract-hooks` is dry-run by default; `--write` applies.
7. [ ] Commits and PRs cite IDs (P10, S23, C53, Q-038, H-16).
8. [ ] Check each item against the [definition of done](phase-8-implementation-roadmap.md#sprint-gate) before recording it Built. Update status only in Phase 8, in the same PR, with the evidence path.
9. [ ] For every page: visual concept with the repo UI skills → owner approval → build → rendered review → mark Built.

## 12. Verification checklist

- [ ] Node and pnpm installed; `pnpm install` clean.
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL` and `JWT_PUBLIC_KEY`.
- [ ] Configuration is validated at startup, or the work to do so is scheduled before the first signed-in page.
- [ ] Backend running with seed; sign-in works on `/auth/login`.
- [ ] `CONTRACT_SOURCE` points at `../backend/openapi.json`; the file is present; `pnpm contract:check` passes.
- [ ] `pnpm type-check`, `pnpm lint`, `pnpm test` pass (or failures filed against host findings).
- [ ] You know where a limit's value comes from (Phase 1 BR19) and where its constant lives (Phase 7 §10).
- [ ] The seed tiers have been requested from the backend team.
- [ ] LD2–LD5 requests sent; OD4, OD9, OD10 requests sent; the defaults of OD11–OD16 read.
- [ ] The owner's home-page work is untouched.
- [ ] You have read the Visual Design Hand-off and the definition of done.

## 13. Known gaps in the host

State as re-checked on 2026-10-01 ([Phase 9 › Host audit findings](phase-9-qa-checklist.md#host-audit-findings)). Fix the S1 rows before adding any signed-in page.

| Gap | Finding | Severity | Fixed in |
|---|---|---|---|
| Only `/dashboard` protected; no role check in the proxy (the admin layout does check) | H-14 | S1 | Sprint 1 FD06 |
| The runway page opens for someone who is not signed in | H-26 | S1 | Sprint 1 FD06 |
| Open redirect via `/\` in `next` | H-16 | S1 | Sprint 1 FD11 |
| No security headers or CSP | H-17 | S1 | Sprint 1 FD11 |
| A copied runway link carries the workspace's cash, burn and inflow figures | H-32 | S1 | Sprint 1 |
| Error copy says the member's money was not affected | H-33 | S1 | Sprint 1 |
| Focus outline removed on the button primitive and the auth inputs | H-06 | S1 | Sprint 1 FD11 |
| Signed-in fallback lands on `/`; `/dashboard` has no page | H-15 | S1 | Sprint 1, Sprint 5 |
| No password reset to reach from sign-in | H-04 | S1 | Sprint 7 (P04, P05) |
| Throttled sign-in does not state the wait | H-02 | S1 | Sprint 1 FD11 |
| Query keys for accounts and cash flow carry no workspace ID; sign-out does not clear the cache | H-27 | S2 | Sprint 1, before any second workspace |
| No upstream timeout and no request reference | H-28 | S2 | Sprint 1 FD11 |
| Query string dropped from `next` on the way to sign-in | H-29 | S2 | Sprint 1 FD06 |
| Help articles describe pages that do not exist | H-30 | S2 | Every sprint exit (Q-248) |
| Registration hints that an email already has an account | H-34 | S2 | Sprint 2 (OD13) |
| Sign-out does not revoke server-side | H-18 | S2 | Backend revoke endpoint (BE-sign-out) |
| A loading button can still be clicked | H-22 | S2 | Sprint 1 FD11 |
| Public-page money helper assumes two decimal places | H-24 | S2 | Keep confined; C40 for product money |
| `localStorage` helper can throw | H-19 | S3 | Sprint 1 (`use-local-storage`) |
| Query timing literal in provider | H-23 | S3 | Sprint 1 |
| Public-page sample type names may collide with domain names | H-25 | S3 | Rename any clash before the domain type lands |
| Code defaults are `en-GB` / `GBP`; specification examples use dollars and US dates | H-31 | S3 | OD1 |
| No segment error surfaces for `(app)`, `(auth)`, `(admin)` | — | — | Sprint 1 |
| No startup validation of configuration | — | — | Sprint 1 (§2.1) |

## Changes in this version

- **Retained:** environment, starter verification, backend and contract connection, folder creation, dependencies, contract bootstrap, testing, workflow, verification and known gaps.
- **Added (2.1.0):** §2.1 configuration validated at startup; §7 the constants table as the home of every limit; the seed tiers in §10; the CI gate order in §11; `CONTRACT_SOURCE` pointing at `../backend/openapi.json` with the vacuous-pass warning; the nine cross-cutting backend requirements and the OD11 mapping in §5; H-26–H-34 and severities in §13.
- **Changed (2.1.0):** the home page is recorded as committed; routes to open now include register, help and the runway calculator; LD1 recorded as installed; C10 recorded as Built; the C34 fix list reduced to what remained after the re-check; sections renumbered from §7 onward.
- **From 2.0.0:** "Design tokens integration" step removed (visual; decided at build); component bootstrap reframed as interaction-contract bootstrap; dependency step rewritten around the seed's Library Selection Policy; phase links renumbered; §3 added; visual hand-off in the workflow.

## Traceability

Upstream: [Phase 1](phase-1-product-vision.md), [Phase 3](phase-3-information-architecture.md), [Phase 6](phase-6-interaction-contracts.md), [Phase 7](phase-7-frontend-architecture.md), [Phase 8](phase-8-implementation-roadmap.md), [Phase 9](phase-9-qa-checklist.md). Next: [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).
