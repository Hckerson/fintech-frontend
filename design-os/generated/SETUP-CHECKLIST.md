# Ledgerline Design OS — Setup Checklist

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Artifact index](ARTIFACT_INDEX.md) · Next: [Implementation prompt](IMPLEMENTATION_PROMPT.md) · [Start here](START_HERE.md)

## Table of contents

- [1. Before you start](#1-before-you-start)
- [2. Environment](#2-environment)
- [3. Protect the owner's work in progress](#3-protect-the-owners-work-in-progress)
- [4. Verify the existing starter](#4-verify-the-existing-starter)
- [5. Connect the backend and the contract](#5-connect-the-backend-and-the-contract)
- [6. Folder structure](#6-folder-structure)
- [7. Dependencies](#7-dependencies)
- [8. Interaction-contract bootstrap](#8-interaction-contract-bootstrap)
- [9. Testing setup](#9-testing-setup)
- [10. Developer workflow](#10-developer-workflow)
- [11. Verification checklist](#11-verification-checklist)
- [12. Known gaps in the host](#12-known-gaps-in-the-host)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

## 1. Before you start

### 1.1 Read these phases first

1. [Phase 1 — Product Vision](phase-1-product-vision.md): personas, business rules (especially BR1 money, BR5 masking, BR12 access), non-goals, OD9 and OD10.
2. [Phase 3 — Information Architecture](phase-3-information-architecture.md): sitemap, route groups, permissions, protected prefixes.
3. [Phase 7 — Frontend Architecture](phase-7-frontend-architecture.md): where every file goes and how data flows.

### 1.2 Understand these concepts

- [ ] **Personas and roles** — workspace roles owner, finance, accountant, viewer; platform roles support, compliance, admin (sharing `ADMIN` today).
- [ ] **Navigation** — two shells (`(app)` and `(admin)`), the `(workspace)` nested group, the P12 intercepted overlay.
- [ ] **Interaction contracts** — every control's behaviour is in [Phase 6](phase-6-interaction-contracts.md); appearance is not.
- [ ] **Four states** — every data section renders loading, empty, error, populated through C57.
- [ ] **Status lives in one place** — [Phase 8](phase-8-implementation-roadmap.md#build-status-register).
- [ ] **Visual hand-off** — no page is styled from these documents; each page's look is proposed with the repo UI skills and approved by the owner ([IMPLEMENTATION_PROMPT §3](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off)).

## 2. Environment

1. [ ] Node.js — the version the repo's toolchain expects (Next.js 16 requires a current LTS); check with `node -v`.
2. [ ] pnpm — `corepack enable` then `pnpm -v`. The repo uses `pnpm-lock.yaml`; do not use npm or yarn.
3. [ ] Editor — TypeScript from the workspace (`node_modules/typescript`), ESLint and Prettier extensions (the repo has `prettier-plugin-tailwindcss`).
4. [ ] Environment file — copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_API_URL` — the backend origin.
   - `JWT_PUBLIC_KEY` — the backend's RS256 public key (verification only; the frontend never holds the private key).
5. [ ] Backend running locally from `../backend` with its seed (`backend/prisma/seed.ts`) — all product demo data comes from there (BR11).

## 3. Protect the owner's work in progress

The working tree on `development` contains the owner's uncommitted home-page rebuild (`app/page.tsx`, `app/layout.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`, `lib/ledgerline/`, `lib/types/ledgerline.ts`, `lib/validations/contact.ts`, `components/wrappers/reveal-words.tsx`, `lib/hooks/use-damped-pointer.ts`, token and font changes).

- [ ] Do **not** checkout, switch branches, stash, reset or commit on the owner's behalf.
- [ ] Do not "fix" the home page toward either side of OD9 or OD10; those are the maintainer's decisions.
- [ ] Before FD04 moves `app/page.tsx` into `(marketing)`, confirm with the owner that the page is committed.
- [ ] Before adding a domain type, rename any public-page sample type in `lib/types/ledgerline.ts` that shares its name (`Transaction` is already `ActivityEntry`; R-10 / H-25).

## 4. Verify the existing starter

Run only when you want the gate (git hooks are disabled; CI is the gate):

1. [ ] `pnpm install` — note that `prepare` unsets `core.hooksPath`; nothing runs on commit or push.
2. [ ] `pnpm type-check`
3. [ ] `pnpm lint`
4. [ ] `pnpm test` (vitest: utils, proxy, route handlers, lint rules, codemods, contract generator)
5. [ ] `pnpm dev` and open:
   - `/` — the owner's home page (P01, Built).
   - `/auth/login` — sign in (P02, Built) against the seeded backend.
   - `/dashboard` — protected; currently no page (H-15).
6. [ ] Record failures against [Phase 9 host findings](phase-9-qa-checklist.md#host-audit-findings) rather than fixing ad hoc.

## 5. Connect the backend and the contract

1. [ ] In the backend: `pnpm openapi` to emit `openapi.json`.
2. [ ] In the frontend: set `CONTRACT_SOURCE=../backend/openapi.json` (the default points at a `nest-setup` path, so `contract:check` would pass vacuously — R-8).
3. [ ] `pnpm contract` — regenerates `lib/contract/`. Never edit that folder.
4. [ ] `pnpm contract:check` — must pass, and must fail if the source is missing (FD12).
5. [ ] Confirm existing endpoints resolve typed: register, login, users (list, create, me, get, update, delete), health, stats total and series ([Phase 7 §13.4](phase-7-frontend-architecture.md#134-endpoints)).
6. [ ] Hand the backend team the required-resource list from [Phase 8 › Backend modules](phase-8-implementation-roadmap.md#backend-modules). Every response type needs `@ApiEnvelope(Dto)` or it degrades to `Endpoint<unknown>`.

## 6. Folder structure

Create folders only when their first file is written (the host rule). Match [Phase 7 §3](phase-7-frontend-architecture.md#3-folder-structure).

1. [ ] Host folders already present: `components/{ui,common,wrappers,providers}`, `lib/{actions,contract,data,hooks,types,utils,validations}`, `tools/*`.
2. [ ] Feature folders `components/<feature>/` (shell, auth, onboarding, dashboard, ledger, …) — **only after OD4** amends the host folder table. `components/ledgerline/` already exists (owner's).
3. [ ] Route groups `(marketing)`, `(auth)`, `(app)/(workspace)`, `(admin)` — Sprint 1, FD04. Moving a page replaces it; never leave two files for one URL.
4. [ ] Per-segment `loading.tsx`, `error.tsx`, `not-found.tsx` as listed in [Phase 4 › Segment files](phase-4-page-blueprints.md#segment-files).
5. [ ] `lib/constants.ts` additions from [Phase 7 §10.2](phase-7-frontend-architecture.md#102-additions-to-libconstantsts) — start with `PROTECTED_ROUTE_PREFIXES`, `ADMIN_ROUTE_PREFIX`, route constants, `PAGE_TITLES`, `APP_ROBOTS`, `STALE_TIME`, `MAIN_CONTENT_ID`.
6. [ ] `lib/data/` for nav config, admin nav, permission matrix, empty-state copy, help articles.

## 7. Dependencies

Follow the seed's Library Selection Policy: reuse what is installed; recommend; **confirm before installing**; never hand-edit `package.json`.

| Need | Installed today | Proposal (awaiting approval) |
|---|---|---|
| Server state | `@tanstack/react-query` | — |
| Validation | `zod` | — |
| Forms | — | LD3 `react-hook-form` + `@hookform/resolvers` |
| Animation | `motion` | — |
| Charts | — | LD1 `recharts` |
| Tables at scale | — | LD2 `@tanstack/react-table` + `@tanstack/react-virtual` |
| Positioning | native | LD5 `@floating-ui/react` only if native anchor positioning falls short |
| Icons | `@carbon/icons-react` | — |
| Dates | `date-fns` | — |
| IDs | `nanoid` | — |
| Tests | `vitest`, `fast-check` | LD4 Testing Library, jsdom, Playwright, axe |

1. [ ] Send the LD1–LD5 requests (FD13–FD17), each naming the package, purpose and why the installed stack does not cover it.
2. [ ] After approval only: `pnpm add <package>` (or `pnpm add -D` for LD4).
3. [ ] Record the approval in [Phase 8](phase-8-implementation-roadmap.md#library-decisions).

## 8. Interaction-contract bootstrap

Build the Sprint 1 contracts in dependency order. Their behaviour comes from [Phase 6](phase-6-interaction-contracts.md); their look comes from the owner-approved concept for the first page that uses them.

1. [ ] Fix C01 Button (host): `displayName`, no focus-outline removal, `disabled || isLoading` (H-06, H-07, H-22).
2. [ ] C10 Field, C04 Input, C06 Select, C07 Checkbox, C08 RadioGroup, C09 Switch, C05 Textarea.
3. [ ] C16 Loading placeholder, C17 Progress indicator, C32 EmptyState, C33 ErrorState.
4. [ ] C57 QueryBoundary, C58 SectionErrorBoundary, C59 PermissionGate, C63 WorkspaceProvider.
5. [ ] C02, C03, C12, C13, C14, C18, C20, C27, C29.
6. [ ] C35 NavItem, C36 WorkspaceSwitcher, C37 UserMenu; C54 only if more than one colour scheme is offered.
7. [ ] Fix C34 LoginForm: field ids via `useId`, `autoComplete`, error tied to fields, forgot/register links, distinct error messages (H-01–H-05).

## 9. Testing setup

1. [ ] Unit and property tests with vitest + fast-check (installed): start with `lib/utils/money.ts` properties (no float drift, sign, exponents 0/2/3, idempotent parse).
2. [ ] Contract tests: `contract:check` with a real source.
3. [ ] Lint-rule tests: any new rule in `tools/eslint/rules/` gets a colocated `.test.ts` and registration in the `starter` plugin.
4. [ ] Component, E2E and accessibility tests: after LD4 approval — Testing Library + jsdom for four-state and keyboard checks; Playwright for F1–F5 and X1–X11; axe on every page.
5. [ ] Seed: a large ledger (target 5 million rows) for the Sprint 3 performance check.

## 10. Developer workflow

1. [ ] Git hooks are disabled by design; run `pnpm type-check`, `pnpm lint`, `pnpm contract:check` and `pnpm test` before a PR.
2. [ ] CI (`.github/workflows/ci.yml`) runs lint and build; FD12 adds type-check, test and contract:check. Consider adding the `development` branch.
3. [ ] Formatting: Prettier with the Tailwind plugin (installed).
4. [ ] Codemod: `pnpm codemod:extract-hooks` is dry-run by default; `--write` applies.
5. [ ] Commits and PRs cite IDs (P10, S23, C53, Q-038).
6. [ ] Update status only in Phase 8.
7. [ ] For every page: visual concept with the repo UI skills → owner approval → build → rendered review → mark Built.

## 11. Verification checklist

- [ ] Node and pnpm installed; `pnpm install` clean.
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL` and `JWT_PUBLIC_KEY`.
- [ ] Backend running with seed; sign-in works on `/auth/login`.
- [ ] `CONTRACT_SOURCE` set; `pnpm contract:check` passes and fails without a source.
- [ ] `pnpm type-check`, `pnpm lint`, `pnpm test` pass (or failures filed against host findings).
- [ ] LD1–LD5 requests sent; OD4, OD9, OD10 requests sent.
- [ ] The owner's home-page work is untouched.
- [ ] You have read the Visual Design Hand-off.

## 12. Known gaps in the host

| Gap | Finding | Fixed in |
|---|---|---|
| Only `/dashboard` protected; no admin role check | H-14 | Sprint 1 FD06 |
| Signed-in fallback lands on `/`, `/dashboard` has no page | H-15 | Sprint 1, Sprint 5 |
| Open-redirect via `/\` in `next` | H-16 | Sprint 1 |
| No security headers or CSP | H-17 | Sprint 1 |
| Sign-out does not revoke server-side | H-18 | backend revoke endpoint |
| `localStorage` helper can throw | H-19 | Sprint 1 (`use-local-storage`) |
| Query timing literal in provider | H-23 | Sprint 1 |
| Public-page money helper assumes two decimal places (float division already removed) | H-24 | keep confined; C40 for product money |
| Remaining public-page sample type names may collide with domain names (`Transaction` already renamed) | H-25 | rename any clash before the domain type lands |
| No error surfaces (`not-found`, `error`, `global-error`) | — | Sprint 1 (P34, P35) |

## Changes in this version

- **Retained:** environment, starter verification, backend and contract connection, folder creation, testing, workflow, verification and known gaps.
- **Changed:** "Design tokens integration" step removed (visual; decided at build); component bootstrap reframed as interaction-contract bootstrap; dependency step rewritten around the seed's Library Selection Policy; phase links renumbered.
- **Added:** §3 Protect the owner's work in progress; OD9/OD10 requests; H-24, H-25; visual hand-off in the workflow.

## Traceability

Upstream: [Phase 1](phase-1-product-vision.md), [Phase 3](phase-3-information-architecture.md), [Phase 6](phase-6-interaction-contracts.md), [Phase 7](phase-7-frontend-architecture.md), [Phase 8](phase-8-implementation-roadmap.md), [Phase 9](phase-9-qa-checklist.md). Next: [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).
