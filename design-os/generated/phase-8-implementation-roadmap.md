# Ledgerline Design OS — Phase 8: Implementation Roadmap

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 "Phase 9: Implementation Roadmap" of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 7 — Frontend Architecture](phase-7-frontend-architecture.md) · Next: [Phase 9 — QA Checklist](phase-9-qa-checklist.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to read this roadmap](#how-to-read-this-roadmap)
- [Development phases](#development-phases)
- [Priority order](#priority-order)
- [Sprint breakdown](#sprint-breakdown)
- [Milestones](#milestones)
- [Dependencies](#dependencies)
- [Risk assessment](#risk-assessment)
- [Technical debt prevention](#technical-debt-prevention)
- [Testing strategy](#testing-strategy)
- [Deployment readiness](#deployment-readiness)
- [Build Status Vocabulary](#build-status-vocabulary)
- [Build status register](#build-status-register)
- [Scope preservation ledger](#scope-preservation-ledger)
- [Assumptions](#assumptions)
- [Open questions](#open-questions)
- [Traceability](#traceability)

## How to read this roadmap

This file is the **only** place where build status lives. Phases 1–7 describe intent; this file records progress. [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) shows a roll-up drawn from the register below, never its own numbers.

- 16 weeks as 8 two-week sprints, five milestones (M1–M5).
- Every flow, dashboard, page, section, interaction contract and foundation from Phases 1–7 appears in the register with exactly one status.
- Status was read from the **working tree** on 2026-09-28 (branch `development`, including the owner's uncommitted home-page rebuild). Where a document and the code disagree, the code wins and the difference is noted.
- **Nothing is Verified.** Verified requires a Phase 9 pass; none has run.
- **Specified vs Scheduled.** The sprint plan below is a proposal with relative sprints and no start date (the calendar waits on LD approvals and backend modules). Items therefore carry **Specified** with a *planned sprint*; they become **Scheduled** when Sprint 1 starts. 1.0.0 marked them Scheduled; that change is recorded in the ledger.
- **Visual design** of every item is decided at build with the owner ([IMPLEMENTATION_PROMPT › Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off)); an item is Built only after its rendered page is reviewed.

## Development phases

| # | Phase | Sprint | Weeks | What a user can do at the end |
|---|---|---|---|---|
| 1 | Foundations | 1 | 1–2 | Sign in and land in the real signed-in app with honest 404/500 pages; protected routes and admin guard enforced. |
| 2 | Auth + admin slice | 2 | 3–4 | Register, sign out, see a session-expiry warning. A platform admin sees real user totals, a real user list and can edit a user — on endpoints that exist today. |
| 3 | Ledger | 3 | 5–6 | Open the account list, open an account and filter and search its ledger at millions of rows. |
| 4 | Transactions | 4 | 7–8 | Search transactions, open one without leaving the list, annotate it, save a view, jump anywhere with ⌘K. |
| 5 | Dashboard + documents | 5 | 9–10 | Role-aware dashboard, statements, exports. |
| 6 | Verification + team | 6 | 11–12 | KYB/KYC onboarding; compliance review; support lookup; invitations and roles. |
| 7 | Comms, settings, security | 7 | 13–14 | Notifications and alerts, messaging, workspace and profile settings, password reset, two-step, counterparties. |
| 8 | Insights, public, hardening | 8 | 15–16 | Compare periods, runway, help center, public page reconciled with OD9/OD10; full Phase 9 pass. |

Why this order: foundations first because every section depends on the group layouts and boundaries (C57, C58); the admin slice second because it runs on real data today; then the read path (ledger → transactions → dashboard) in the order trust is built — a dashboard is only as believable as the ledger underneath.

## Priority order

1. **Foundations (Sprint 1).** Route groups, protected prefixes, admin guard, host defects, primitives batch 1, CI gate, LD requests, and **requesting OD9 and OD10 answers** (they decide what the public page may say).
2. **Admin slice P29–P31 (Sprint 2).** Endpoints exist; it proves contract → action → hook → section → page before banking modules are published.
3. **Auth completion (Sprint 2).** P03, sign-out UI, session expiry.
4. **Ledger and transactions (Sprints 3–4).** F2 and F3 are the core and carry the hardest technical risk (virtualization, cursors).
5. **Dashboard and documents (Sprint 5).**
6. **Verification and team (Sprint 6).** Largest backend asks, scheduled mid-plan.
7. **Comms, settings, security (Sprint 7).**
8. **Insights, public, hardening (Sprint 8).** P01 is already Built as a design study; its production copy is reconciled here per OD9.

Deferred items (F6, F7, P26, P27, S44, S45) have no slot; they re-enter only when their revisit trigger fires.

## Sprint breakdown

### Sprint gate

Every sprint closes only when its new or changed files pass: lint (`starter/*` rules in the working tree), type-check, tests, `contract:check` with a real source; the four-state rule for each section; keyboard and screen-reader checks from Phase 9 for each contract touched; the owner's approval of each page's rendered look (visual hand-off).

### Sprint 1 — Foundations (weeks 1–2 · M1)

| Layer | Items |
|---|---|
| Foundations | FD03 colour-scheme preference wiring (only if offered), FD04 route groups (moving the built P01 and P02 without changing their content), FD06 protected prefixes + admin guard, FD11 host defect fixes, FD12 CI gate, FD13–FD17 library requests, FD18 decision requests OD9/OD10 |
| Pages | P34, P35; P02 defect fixes |
| Sections | S01, S02 (without C38/C39), S03, S54 |
| Contracts | C02–C10, C12–C14, C16–C18, C20, C27, C29, C32, C33, C35–C37, C54, C57–C59, C63; C01 and C34 defect fixes |
| Hooks | `use-me`, `use-workspace` (session fallback) |
| Backend | `GET /api/users/me` (exists) |

Exit: `/admin/*` rejects `USER`; every `(app)` prefix redirects signed-out visitors; metadata from constants; host defects closed; LD requests and OD9/OD10 with the maintainer.

### Sprint 2 — Auth and first real-data slice (weeks 3–4 · M2)

| Layer | Items |
|---|---|
| Pages | P03; P29, P30, P31 |
| Sections | S08 register variant; S48, S49, S50 |
| Contracts | C11, C15, C19, C21, C22, C23, C24, C25, C30 (LD1), C41, C45, C52, C53 (LD2), C55, C62 |
| Flows | X2, X3, X4, D7 |
| Backend | exists: register, stats, users; required: BE-step-up |

Exit: register lands in onboarding; sign-out from C37; P29–P31 on seed data in all four states; C53/C30 only on approved LD2/LD1 (fallback C15 and numbers otherwise, slip recorded).

### Sprint 3 — Accounts and ledger (weeks 5–6)

Pages P09, P10 · Sections S19–S23 · Contracts C31, C40, C42, C43, C44, C46, C47, C48, C51 · Flow F2 · Backend BE-accounts, BE-transactions, BE-ledger-summary, BE-saved-views.
Exit: filters in URL; 5M-row seed scroll within budget; C40 property tests pass; reveal via step-up; unpublished modules render C33/C32 against the real contract — never frontend mock arrays.

### Sprint 4 — Transactions (weeks 7–8 · M3)

Pages P11–P14 · Sections S24–S27 · Contracts C28, C38, C49, C60 · Flow F3 (counterparty leg Sprint 7).
Exit: ⌘K opens C38 anywhere; intercepted route and full page share sections; focus returns to the originating transaction; optimistic annotations roll back with a message.

### Sprint 5 — Dashboard and documents (weeks 9–10)

Pages P08 (D1–D4), P17, P18 · Sections S13–S18, S30–S32 · Contract C26 · Flows F1, F4, D1–D4.
Exit: role composition via C59; viewer never sees exports or unpermitted totals; export polling stops at terminal states.

### Sprint 6 — Verification and team (weeks 11–12 · M4)

Pages P07, P23, P24, P32, P33 · Sections S09–S12, S39–S41, S51–S53 (S42 read variant pulled forward) · Contract C50 · Flows F5, X6, D5, D6.
Exit: case moves submitted → needs_info → submitted → approved across P07 and P32; S41 and C59 read one matrix; neutral fields if OD1 is open.

### Sprint 7 — Comms, settings and security (weeks 13–14)

Pages P04, P05, P06, P19, P20, P21, P22, P25 · Sections S08 (forgot/reset/verify), S33–S38, S42, S43 · Contract C39 · Flows X5, X7, X8, X9 (messages), F3 counterparty leg.
Exit: expired reset links recover; two-step per OD6; revoked sessions end on next request.

### Sprint 8 — Insights, public and hardening (weeks 15–16 · M5)

Pages P15, P16, P28; P01 reconciliation per OD9/OD10 · Sections S05 (if OD9 = A), S28, S29, S46, S47; S55–S64 revised per OD9/OD10 · Flows X9 (help), X11 per OD10 · Hardening: full Phase 9 pass, E2E and axe (LD4), budgets.
Exit: every Built item passes Phase 9 and moves to Verified; P01 states only approved, true claims (or is explicitly kept as a non-deployed design study, OD9 option C).

### Sequencing corrections (carried from 1.0.0)

| Contract / section | Planned | Needed by | Build in |
|---|---|---|---|
| C18 Avatar | 6 | S01 (1), S49 (2) | 1 |
| C20 Menu | 2 | S03, C37 (1) | 1 |
| C29 Breadcrumbs | 2 | S02, S03 (1) | 1 |
| C11 SearchInput | 4 | S49 (2) | 2 |
| C41, C45 | 3, 5 | S48 (2) | 2 |
| C52 ConfirmDialog | 6 | S50 (2) | 2 |
| C05, C07, C08, C09 base | 7 | S26 (4), S31 (5) | 1 |
| S42 read variant | 7 | P24 (6) | 6 |
| C38, C39 | 4, 7 | S02 (1) | slots fill in 4 and 7 |

## Milestones

| ID | Name | End of | Definition of done |
|---|---|---|---|
| M1 | Layouts & guards | Sprint 1 | Layouts with S01–S03; P34/P35; host defects closed; admin guard; LD and OD9/OD10 requests made. |
| M2 | First real-data slice | Sprint 2 | P29–P31 on existing endpoints; P03; sign-out; session expiry. |
| M3 | Ledger & transactions | Sprint 4 | F2, F3 (minus counterparty) on seed data; 5M-row budget met. |
| M4 | Onboarding + team | Sprint 6 | F1, F4, F5, X6, D1–D6. |
| M5 | Release candidate | Sprint 8 | Every non-Deferred item Built; full Phase 9 pass; P01 reconciled with OD9/OD10. |

A milestone is missed, not moved, when its definition of done is not met; the miss and blocker are recorded here.

## Dependencies

### Backend modules

| ID | Module | State | First needed | Consumers |
|---|---|---|---|---|
| BE-auth | Register, login | Exists | Built | X1 X2 P02 P03 |
| BE-users | Users CRUD + me | Exists | 1 | S49 S50 S42 C37 |
| BE-stats | User stats | Exists | 2 | S48 |
| BE-health | Health | Exists | 1 | X10 |
| BE-step-up | Step-up re-auth | Required | 2 | X4 C42 C55 |
| BE-accounts | Accounts, balances | Required | 3 | S14 S15 S19 S20 S29 |
| BE-transactions | Cursor list, detail, annotations, attachments | Required | 3 | S16 S17 S23–S26 |
| BE-ledger-summary | Ledger summary | Required | 3 | S22 |
| BE-saved-views | Saved views | Required (see open questions) | 3 | S21 S27 |
| BE-cashflow | Cash-flow series | Required | 5 | S18 S29 |
| BE-statements | Statements, PDF URL | Required | 5 | S30 |
| BE-exports | Export jobs, download URL | Required | 5 | S17 S31 S32 |
| BE-workspaces | Workspaces, memberships, invitations | Required | 6 (session fallback before) | C63 S01 S38–S40 |
| BE-verification | Cases, document upload | Required | 5 read, 6 write | S09–S13 S17 |
| BE-compliance | Compliance side, decision | Required | 6 | S51 S52 |
| BE-support | Support lookup | Required | 6 | S53 |
| BE-audit | Audit log | Required | 6 | C42 S52 |
| BE-password-reset | Request/confirm | Required | 7 | P04 P05 |
| BE-two-step | Enrol/verify | Required | 7 | P06 S43 |
| BE-sessions | List/revoke | Required | 7 | S43 |
| BE-counterparties | Counterparties | Required | 7 | S33 |
| BE-notifications | List, count, mark read | Required | 7 | C39 S34 |
| BE-alert-rules | Alert rules | Required | 7 | S35 |
| BE-threads | Messages | Required | 7 | S36 S37 |
| BE-compare | Compare periods | Required | 8 | S28 |
| BE-enquiry | Enquiry intake | Not decided (OD10) | 8 | S64 X11 |
| BE-transfers, BE-payees | Money movement | Deferred (OD3) | — | S44 S45 |

### Library decisions

Nothing is installed. Each awaits approval (OD8).

| ID | Need | Recommendation | Needed by | If not approved |
|---|---|---|---|---|
| LD1 | Charts | `recharts` (alt. `@visx/*`) | Sprint 2 | Figures without series; S18/S28 slip |
| LD2 | Table + virtualization | `@tanstack/react-table` + `@tanstack/react-virtual` | Sprint 2 | S49 on C15; S23 misses the 5M budget; M3 missed |
| LD3 | Forms | `react-hook-form` + `@hookform/resolvers` | Sprint 5 | `useState` + Zod; migration recorded as debt |
| LD4 | Testing | Testing Library, jsdom, Playwright, axe | Sprint 2 | Browser-based checks cannot pass; items stay Built |
| LD5 | Positioning | native popover + anchor positioning; `@floating-ui/react` if needed | Sprint 1 | Native path |

### Open decisions

| ID | Decision | Blocks | Needed by |
|---|---|---|---|
| OD1 | Jurisdiction, currency | S10 S11 P17 format; public page currency claims | Sprint 5 |
| OD2 | Session policy | X4 C55 | Sprint 2 |
| OD3 | Money movement | F6 F7 P26 P27 S44 S45 | revisit trigger |
| OD4 | Feature folders | every section file | Sprint 1 |
| OD5 | Banking data source | BE-accounts BE-transactions | Sprint 3 (backend) |
| OD6 | Two-step method | P06 S43 | Sprint 7 |
| OD7 | *Withdrawn (visual)* | — | — |
| OD8 | LD1–LD5 | see above | Sprint 1 |
| OD9 | Public page scope vs v1 | production copy of P01 (S55–S64, S04–S07); R-10 rename | Sprint 1 request, Sprint 8 at latest |
| OD10 | Entry path | P01 → P02/P03 links; S64 intake | Sprint 2 (P03 reachability) |

### Item dependency table (critical path)

| Item | Backend | Library | Decision | Other items |
|---|---|---|---|---|
| FD06 prefixes + admin guard | BE-auth | — | — | FD05 |
| S01 Primary navigation | BE-workspaces (fallback) | — | OD4 | C35 C36 C18 C63 |
| S48 Platform growth figures | BE-stats | LD1 | — | C45 C30 C41 C23 |
| S49 Platform user directory | BE-users | LD2 | — | C53 C18 C12 C11 C20 C21 |
| X4 Session expiry | BE-step-up | — | OD2 | C55 |
| S23 Ledger entries | BE-transactions | LD2 | OD5 | C53 C44 C16 C25 C32 |
| C40 Amount | — | — | OD1 | C27 |
| C42 MaskedAccountNumber | BE-step-up, BE-audit | — | OD2 | X4 |
| S10/S11 onboarding forms | BE-verification | LD3 | OD1 | C10 C04 C06 C52 |
| S52 Compliance case review | BE-compliance, BE-audit | — | OD1 | C22 C52 |
| S43 Security settings | BE-sessions, BE-two-step | LD3 | OD6 | C09 C15 C52 |
| S64 Get-started enquiry | BE-enquiry | — | OD10 | C67 |
| S57–S62 production copy | — | — | OD9 | S04–S07 |

## Risk assessment

Score = likelihood × impact (1–3). ≥ 6 has a Sprint 1 owner action.

| # | Risk | L | I | Score | User-visible consequence | Mitigation |
|---|---|---|---|---|---|---|
| R-1 | Backend banking modules late | 3 | 3 | 9 | Accounts and ledger show "unavailable" | Contract-first DTO specs in Sprint 1; sections render C33/C32 against the real contract; never frontend mock data for the product; admin slice proves the pipeline |
| R-2 | LD approvals delayed | 2 | 3 | 6 | Ledger stutters; charts missing | Request all in Sprint 1 with gap stated; documented fallbacks |
| R-3 | 5M-row performance | 2 | 3 | 6 | Large ledger freezes | Cursors, virtualization, fixed row size, server filters, Sprint 3 budget test |
| R-4 | Contrast or focus regressions | 2 | 2 | 4 | Unreadable text for low-vision users | WCAG checks per page in Phase 9 and owner visual review |
| R-5 | OD2 unresolved | 2 | 2 | 4 | Balances exposed on unattended laptops | Recommend 15 min / 12 h + step-up; decide by Sprint 2 |
| R-6 | Scope creep into money movement | 2 | 3 | 6 | Half-built transfers users might trust | Deferred with trigger; no payment UI merges before OD3 |
| R-7 | OD1 unresolved | 2 | 3 | 6 | Onboarding asks wrong questions | Neutral fields first |
| R-8 | `contract:check` passes vacuously | 3 | 2 | 6 | Backend change breaks a screen silently | CI sets `CONTRACT_SOURCE=../backend/openapi.json` and fails when absent (FD12) |
| R-9 | Sprint 1 overload | 2 | 2 | 4 | M1 slips | Primitives not needed by S01–S03/S54 may slide |
| **R-10** | Public page presents capabilities, prices and sample figures v1 does not have (OD9) | 3 | 3 | 9 | A visitor believes Ledgerline pays, issues cards, forecasts treasury or holds 34 currencies; a sample balance is taken as real | Keep the design-study disclosures while OD9 is open; do not deploy P01 as the product's site until OD9 is answered; rename colliding sample types (`Transaction` in `lib/types/ledgerline.ts`) before domain types land |
| **R-11** | No route from the home page to sign-in or registration (OD10) | 3 | 2 | 6 | Members cannot find sign-in; owners cannot register from the site | Answer OD10 by Sprint 2; P02/P03 remain reachable by URL |

## Technical debt prevention

| Guard | Mechanism | State |
|---|---|---|
| Density register | `application-register-density` | Built (off for public page files) |
| One component per file | `one-component-per-file` | Built |
| Pages compose only | `page-composes-only` | Built |
| Types in `lib/types/` | `domain-types-in-lib` | Built |
| API boundary | `api-access-boundary` + `no-restricted-imports` | Built |
| No comments | `no-comments` | Built |
| Transport calls in components | `extract-transport-to-hook` codemod | Built (FD09) |
| Contract drift | `pnpm contract:check` | Built; CI wiring Specified (FD12) |
| File size | `max-lines` 150 | Built |
| Promote on second use | review rule | Review |
| Constants | copy, routes, durations, enums in constants | Review |
| Scope preservation | no spec item deleted for being unbuilt | Review; ledger below |
| Dependency approval | no package without an approved LD entry | Review |
| Token-first class names | rule removed by the owner in the working tree | Not a design OS concern (styling) |

Proposed rules (each with a colocated `.test.ts`): reject `parseFloat`/`Number(` on minor-unit strings in `components/` (Sprint 3); flat-config import restrictions for `components/ui/**` and sibling feature folders.

## Testing strategy

| Level | Tool | State | Scope | First sprint |
|---|---|---|---|---|
| Unit | vitest | running | utils, constants, proxy, route handlers | continuous |
| Property | fast-check | pattern exists | money, runway, cursor merge, onboarding progress | 3 |
| Contract | `contract:check` + generator tests | running; CI pending | schemas vs `openapi.json` | 1 |
| Lint-rule | vitest + RuleTester | running | every custom rule | continuous |
| Component | Testing Library + jsdom | pending LD4 | four states per section; contract keyboard behaviour (Phase 6) | 2 |
| End-to-end | Playwright | pending LD4 | F1–F5, X1–X11 happy and recovery paths | 2 (X1, X2), full 8 |
| Accessibility | axe via Playwright + manual SR | pending LD4 | every page | 2 onward |
| Performance | Playwright trace on seed | pending LD4 | S23 5M rows; P08 first render; P01 first-load JS | 3 |

Money property tests (C40): no float drift; sign convention; exponents 0/2/3; idempotent parse; `returned`/`failed` carry problem severity and ordinary debits never do.

## Deployment readiness

| Area | Today | Required before M5 |
|---|---|---|
| CI | lint + build on `master`/`main` and PRs | add type-check, test, `contract:check` with a real source (FD12); consider `development` |
| Git hooks | disabled (`prepare` unsets `core.hooksPath`) | CI is the gate |
| Environment | `NEXT_PUBLIC_API_URL`, `JWT_PUBLIC_KEY` | refuse to start without `JWT_PUBLIC_KEY` |
| Metadata | working tree: Ledgerline title and description (H-08 title resolved) | titles from `PAGE_TITLES`; `robots.ts`, `sitemap.ts` |
| Error surfaces | none (`not-found`, `error`, `global-error` absent) | P34, P35, segment boundaries |
| Security headers, session policy | 7-day cookie | OD2; headers (H-17) |
| Public page | design-study disclosures present | OD9/OD10 answered before deploying as the product site |
| Release | — | M5 exit met; non-Deferred rows Verified |

## Build Status Vocabulary

Every page, section, interaction contract and flow specified in Phases 1–7 appears in the roadmap carrying exactly one status drawn from this fixed set:

- **Specified** — defined in the blueprints, not yet scheduled.
- **Scheduled** — assigned to a sprint or milestone.
- **In progress** — implementation started.
- **Built** — implemented and merged.
- **Verified** — implemented and passing the Phase 9 checks.
- **Deferred** — deliberately postponed. Carries a reason and a revisit trigger (a date, a milestone, or a dependency).

Status lives here and nowhere else. It is recorded against a feature, never used to remove one — see Critical Rules › Scope Preservation. A feature with no implementation is **Specified**, not absent.

**Note on "Built" for uncommitted work.** The home page and its sections are in the working tree, not merged. They are recorded **Built** at the maintainer's instruction ("a landing page exists"); strictly they are *In progress* until committed. The note travels with every such row.

## Build status register

Read from the working tree on 2026-09-28. Deferred reason for all money-movement rows: needs a licensed payments / sponsor-bank partner, a backend payments module and OD3. Revisit trigger: OD3 answered and the payments module published in the contract (or OD9 answered B).

### Summary

| Layer | Built | In progress | Specified | Deferred | Total |
|---|---|---|---|---|---|
| Primary flows (F) | 0 | 0 | 5 | 2 | 7 |
| Role dashboards (D) | 0 | 0 | 7 | 0 | 7 |
| Supporting flows (X) | 2 | 2 | 7 | 0 | 11 |
| Pages (P) | 2 | 0 | 31 | 2 | 35 |
| Sections (S) | 13 | 1 | 48 | 2 | 64 |
| Interaction contracts (C) | 9 | 0 | 59 | 0 | 68 |
| Foundations (FD) | 6 | 0 | 11 | 0 | 17 active (+ FD02 withdrawn) |
| **Total** | **32** | **3** | **168** | **6** | **209** |

Verified: 0.

### Primary flows (F)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [F1](phase-2-experience-maps.md#f1--check-cash-position) | Check cash position | Specified | 5 | P08 D1–D4 |
| [F2](phase-2-experience-maps.md#f2--review-an-accounts-ledger) | Review an account's ledger | Specified | 3 | LD2 |
| [F3](phase-2-experience-maps.md#f3--investigate-a-transaction) | Investigate a transaction | Specified | 4 (P19 leg 7) | — |
| [F4](phase-2-experience-maps.md#f4--export-and-reconcile) | Export and reconcile | Specified | 5 | — |
| [F5](phase-2-experience-maps.md#f5--business-onboarding-and-verification) | Business onboarding and verification | Specified | 6 | OD1 |
| [F6](phase-2-experience-maps.md#f6--transfer-money) | Transfer money | Deferred | — | OD3; the built S58 presents payments (OD9) |
| [F7](phase-2-experience-maps.md#f7--pay-a-payee--bill) | Pay a payee / bill | Deferred | — | OD3 |

### Role dashboards (D)

| ID | Name | Status | Planned sprint |
|---|---|---|---|
| [D1](phase-2-experience-maps.md#d1--owner-dashboard) | Owner dashboard | Specified | 5 |
| [D2](phase-2-experience-maps.md#d2--finance-dashboard) | Finance dashboard | Specified | 5 |
| [D3](phase-2-experience-maps.md#d3--accountant-workspace) | Accountant workspace | Specified | 5 |
| [D4](phase-2-experience-maps.md#d4--viewer-overview) | Viewer overview | Specified | 5 |
| [D5](phase-2-experience-maps.md#d5--support-console) | Support console | Specified | 6 |
| [D6](phase-2-experience-maps.md#d6--compliance-queue) | Compliance queue | Specified | 6 |
| [D7](phase-2-experience-maps.md#d7--platform-admin-overview) | Platform admin overview | Specified | 2 |

### Supporting flows (X)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [X1](phase-2-experience-maps.md#x1--sign-in) | Sign in | Built | 1 (defects) | `use-login`, `app/api/session` POST, `proxy.ts`, `app/auth/login/page.tsx`. Not reachable from the built P01 (OD10). Two-step leg Sprint 7. |
| [X11](phase-2-experience-maps.md#x11--get-started-enquiry) | Get-started enquiry | Built | — | Design-study state: validates, sends nothing (`contact-section.tsx`). Intake per OD10. Uncommitted. |
| [X2](phase-2-experience-maps.md#x2--register) | Register | In progress | 2 | Route handler and hook exist; no page. |
| [X3](phase-2-experience-maps.md#x3--sign-out) | Sign out | In progress | 2 | Hook and DELETE handler exist; no UI trigger. |
| [X4](phase-2-experience-maps.md#x4--session-expiry-and-step-up-re-authentication) | Session expiry and step-up | Specified | 2 | OD2 |
| [X5](phase-2-experience-maps.md#x5--password-reset) | Password reset | Specified | 7 | — |
| [X6](phase-2-experience-maps.md#x6--invite-teammate-and-manage-roles) | Invite teammate and manage roles | Specified | 6 | — |
| [X7](phase-2-experience-maps.md#x7--notifications-and-alerts) | Notifications and alerts | Specified | 7 | — |
| [X8](phase-2-experience-maps.md#x8--profile-and-security-settings) | Profile and security settings | Specified | 7 | OD6 |
| [X9](phase-2-experience-maps.md#x9--help-and-support-contact) | Help and support contact | Specified | 7–8 | — |
| [X10](phase-2-experience-maps.md#x10--error-offline-and-outage-recovery) | Error, offline and outage recovery | Specified | 1 | — |

### Pages (P)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [P01](phase-4-page-blueprints.md#p01--home) | Home | Built | 8 (reconcile) | `app/page.tsx` composing S04, S06, S07, S55–S64 from `components/ledgerline/`. Uncommitted. Diverges from spec per OD9/OD10; S05 not built; not in `(marketing)` group yet. Not Verified. |
| [P02](phase-4-page-blueprints.md#p02--sign-in) | Sign in | Built | 1 (defects) | `app/auth/login/page.tsx`; host findings H-01–H-05, H-16. |
| [P03](phase-4-page-blueprints.md#p03--register) | Register | Specified | 2 | handler + hook exist |
| [P04](phase-4-page-blueprints.md#p04--forgot-password) | Forgot password | Specified | 7 | — |
| [P05](phase-4-page-blueprints.md#p05--reset-password) | Reset password | Specified | 7 | — |
| [P06](phase-4-page-blueprints.md#p06--two-step-verification) | Two-step verification | Specified | 7 | OD6 |
| [P07](phase-4-page-blueprints.md#p07--onboarding--verification) | Onboarding & verification | Specified | 6 | OD1 |
| [P08](phase-4-page-blueprints.md#p08--dashboard) | Dashboard | Specified | 5 | `/dashboard` is protected but has no page (H-15) |
| [P09](phase-4-page-blueprints.md#p09--accounts) | Accounts | Specified | 3 | — |
| [P10](phase-4-page-blueprints.md#p10--account-ledger) | Account ledger | Specified | 3 | LD2 |
| [P11](phase-4-page-blueprints.md#p11--transaction-search) | Transaction search | Specified | 4 | — |
| [P12](phase-4-page-blueprints.md#p12--transaction-detail) | Transaction detail | Specified | 4 | page + intercepted route |
| [P13](phase-4-page-blueprints.md#p13--saved-views) | Saved views | Specified | 4 | — |
| [P14](phase-4-page-blueprints.md#p14--flagged-transactions) | Flagged transactions | Specified | 4 | — |
| [P15](phase-4-page-blueprints.md#p15--compare-periods) | Compare periods | Specified | 8 | LD1 |
| [P16](phase-4-page-blueprints.md#p16--runway-calculator) | Runway calculator | Specified | 8 | — |
| [P17](phase-4-page-blueprints.md#p17--statements) | Statements | Specified | 5 | OD1 |
| [P18](phase-4-page-blueprints.md#p18--exports) | Exports | Specified | 5 | — |
| [P19](phase-4-page-blueprints.md#p19--counterparty) | Counterparty | Specified | 7 | — |
| [P20](phase-4-page-blueprints.md#p20--notifications) | Notifications | Specified | 7 | — |
| [P21](phase-4-page-blueprints.md#p21--messages) | Messages | Specified | 7 | — |
| [P22](phase-4-page-blueprints.md#p22--workspace-settings) | Workspace settings | Specified | 7 | — |
| [P23](phase-4-page-blueprints.md#p23--team) | Team | Specified | 6 | — |
| [P24](phase-4-page-blueprints.md#p24--team-member-profile) | Team member profile | Specified | 6 | — |
| [P25](phase-4-page-blueprints.md#p25--profile--security) | Profile & security | Specified | 7 | — |
| [P28](phase-4-page-blueprints.md#p28--help-center) | Help center | Specified | 8 | — |
| [P29](phase-4-page-blueprints.md#p29--admin-overview) | Admin overview | Specified | 2 | endpoints exist |
| [P30](phase-4-page-blueprints.md#p30--admin-users) | Admin users | Specified | 2 | LD2 |
| [P31](phase-4-page-blueprints.md#p31--admin-user-detail) | Admin user detail | Specified | 2 | — |
| [P32](phase-4-page-blueprints.md#p32--compliance-queue) | Compliance queue | Specified | 6 | — |
| [P33](phase-4-page-blueprints.md#p33--support-console) | Support console | Specified | 6 | — |
| [P34](phase-4-page-blueprints.md#p34--not-found-404) | Not found (404) | Specified | 1 | — |
| [P35](phase-4-page-blueprints.md#p35--server-error-500) | Server error (500) | Specified | 1 | — |
| [P26](phase-4-page-blueprints.md#p26--transfer) | Transfer | Deferred | — | OD3 |
| [P27](phase-4-page-blueprints.md#p27--payees--bill-pay) | Payees & bill pay | Deferred | — | OD3 |

### Sections (S)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [S04](phase-5-section-blueprints.md#s04--marketing-proposition) | Marketing proposition | Built | 8 (reconcile) | `hero-section.tsx` + preview with sample company (OD9 d); CTAs to S64 (OD10). Uncommitted. |
| [S06](phase-5-section-blueprints.md#s06--security--trust-statements) | Security & trust statements | Built | 8 (reconcile) | `security-section.tsx`; placeholder controls beyond v1 (OD9 e); no `reviewedOn`. Uncommitted. |
| [S07](phase-5-section-blueprints.md#s07--public-legal--support-links) | Public legal & support links | Built | 8 | `ledger-footer.tsx` with disclosure. Uncommitted. |
| [S55](phase-5-section-blueprints.md#s55--public-site-navigation) | Public site navigation | Built | 8 (reconcile) | `ledger-nav.tsx`; OD9 a–b, OD10. Uncommitted. |
| [S56](phase-5-section-blueprints.md#s56--headline-figures) | Headline figures | Built | 8 (reconcile) | sample figures (OD9). Uncommitted. |
| [S57](phase-5-section-blueprints.md#s57--accounts-capability) | Accounts capability | Built | 8 (reconcile) | OD9 c; H-24. Uncommitted. |
| [S58](phase-5-section-blueprints.md#s58--payments--approvals-capability) | Payments & approvals capability | Built | 8 (reconcile) | OD9 a. Uncommitted. |
| [S59](phase-5-section-blueprints.md#s59--cards-capability) | Cards capability | Built | 8 (reconcile) | OD9 b. Uncommitted. |
| [S60](phase-5-section-blueprints.md#s60--treasury-forecast-capability) | Treasury forecast capability | Built | 8 (reconcile) | OD9 c. Uncommitted. |
| [S61](phase-5-section-blueprints.md#s61--reconciliation-capability) | Reconciliation capability | Built | 8 (reconcile) | OD9 c. Uncommitted. |
| [S62](phase-5-section-blueprints.md#s62--pricing-plans) | Pricing plans | Built | 8 (reconcile) | OD9 f. Uncommitted. |
| [S63](phase-5-section-blueprints.md#s63--frequently-asked-questions) | Frequently asked questions | Built | 8 | Uncommitted. |
| [S64](phase-5-section-blueprints.md#s64--get-started-enquiry) | Get-started enquiry | Built | 8 | sends nothing (OD10). Uncommitted. |
| [S08](phase-5-section-blueprints.md#s08--authentication-step) | Authentication step | In progress | 2–7 | sign-in variant in `components/common/login-form.tsx` |
| [S05](phase-5-section-blueprints.md#s05--value-propositions) | Value propositions | Specified | 8 | not built; job covered by S57–S61 pending OD9 |
| S01 S02 S03 S54 | Primary navigation · Global utilities · Page title & actions · Status explanation | Specified | 1 | — |
| S48 S49 S50 | Platform growth figures · Platform user directory · Admin user record | Specified | 2 | — |
| S19 S20 S21 S22 S23 | Account list · Account overview · Ledger filters · Ledger summary · Ledger entries | Specified | 3 | — |
| S24 S25 S26 S27 | Transaction detail · Transaction lifecycle · Notes & attachments · Saved views list | Specified | 4 | — |
| S13 S14 S15 S16 S17 S18 S30 S31 S32 | Verification status notice · Cash position · Account summary · Recent activity · Pending items · Cash flow over time · Statement list · Export builder · Export jobs | Specified | 5 | — |
| S09 S10 S11 S12 S39 S40 S41 S51 S52 S53 | Verification progress · Business details form · Beneficial owners form · Document upload · Team members · Invite member form · Role permissions reference · Compliance case queue · Compliance case review · Support lookup | Specified | 6 | S42 read variant pulled into 6 |
| S33 S34 S35 S36 S37 S38 S42 S43 | Counterparty summary · Notification feed · Alert rules · Thread list · Conversation · Workspace general form · Profile form · Security settings | Specified | 7 | — |
| S28 S29 S46 S47 | Period comparison · Runway calculator · Help search & categories · Help article | Specified | 8 | — |
| [S44](phase-5-section-blueprints.md#s44--transfer-form) | Transfer form | Deferred | — | OD3 |
| [S45](phase-5-section-blueprints.md#s45--payee-list) | Payee list | Deferred | — | OD3 |

### Interaction contracts (C)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| C01 | Button | Built | 1 (defects) | `components/ui/button.tsx`; H-06, H-07, H-22 |
| C34 | LoginForm → AuthForm variants | Built | 1 (defects); 2 variants | `components/common/login-form.tsx`; H-01–H-05 |
| C56 | Entrance reveal | Built | — | `components/wrappers/motion-wrapper.tsx`; Q6-7 |
| C61 | Provider | Built | 1 (H-23) | `components/providers/provider.tsx` |
| C64 | Disclosure | Built | — | `faq-row.tsx`. Uncommitted. |
| C65 | Small-screen navigation toggle | Built | — | `ledger-nav.tsx`; Escape behaviour unverified. Uncommitted. |
| C66 | Sample interaction control | Built | — | `approval-card.tsx`, `card-controls.tsx`. Uncommitted. |
| C67 | Enquiry form | Built | — | `contact-section.tsx`. Uncommitted. |
| C68 | Text reveal | Built | — | `reveal-words.tsx`; accessibility to confirm. Uncommitted. |
| C02–C10, C12–C14, C16–C18, C20, C27, C29, C32, C33, C35–C37, C54, C57–C59, C63 | primitives batch 1, layout compositions, wrappers, workspace provider | Specified | 1 | C18, C20, C29 pulled forward |
| C11, C15, C19, C21–C25, C30, C41, C45, C52, C53, C55, C62 | — | Specified | 2 | C30 LD1; C53 LD2 |
| C31, C40, C42, C43, C44, C46, C47, C48, C51 | — | Specified | 3 | — |
| C28, C38, C49, C60 | — | Specified | 4 | — |
| C26 | Meter | Specified | 5 | — |
| C50 | Stepper | Specified | 6 | — |
| C39 | Notification entry point | Specified | 7 | — |

### Foundations (FD)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| FD01 | Token architecture | Built | — | `styles/tokens.css`, `globals.css` (values are a build concern) |
| FD05 | Proxy session gate | Built | — | protects `/dashboard` only |
| FD07 | Contract generator | Built | — | `tools/contract/` |
| FD08 | ESLint rules | Built | — | 6 rules in the working tree (token-first removed by owner) |
| FD09 | Transport-to-hook codemod | Built | — | `tools/codemods/` |
| FD10 | Hook baseline | Built | — | `use-login`, `use-logout`, `use-register`, `use-create-user`, `use-debounced-search` |
| FD02 | *Withdrawn (visual): Ledgerline token values* | — | — | see ledger |
| FD03 | Colour-scheme preference wiring | Specified | 1 | only if the build offers more than one scheme (C54) |
| FD04 | Route groups and layouts | Specified | 1 | moves built P01/P02 without content change |
| FD06 | Protected prefixes and admin guard | Specified | 1 | H-14 |
| FD11 | Host defect fixes | Specified | 1 | Phase 9 findings |
| FD12 | CI gate extension | Specified | 1 | R-8 |
| FD13–FD17 | LD1–LD5 requests | Specified | 1 | OD8 |
| FD18 | OD9 and OD10 decision requests | Specified | 1 | added 2.0.0 |

(FD18 is counted in the summary's 17 active foundations: FD01, FD03–FD18.)

## Scope preservation ledger

This is **generation 2**, a merge over generation 1 (commit `9565964`, 16 files).

| Bucket | Contents |
|---|---|
| **Retained** | Personas R1–R7; F1–F7; D1–D7; X1–X10; P01–P35; S01–S54; C01–C63 (as interaction contracts); FD01, FD03–FD17; BR1–BR11; OD1–OD6, OD8; LD1–LD5; M1–M5; BE-* modules; KPIs K1–K14, SM1–SM5, North Star; Q-001–Q-250 IDs (visual ones retired, not deleted); host findings H-01–H-23; all states (transaction, account, verification, export, user) and all role variants. |
| **Added** | R8 Prospect; X11 Get-started enquiry; S55–S64; C64–C68; FD18; BR12; OD9; OD10; R-10, R-11; BE-enquiry; `use-enquiry`; host findings H-24, H-25; QA items Q-251–Q-262; Phase 5 Q5–Q6; Phase 6 Q6-8. |
| **Changed** | Files: 16 → 15 (Phase 7 Design Tokens dropped as visual; Phases 8–10 renumbered 7–9; Phase 6 renamed Interaction Contracts). Visual prescriptions dropped: dark-default palette with lime accent and the Daylight light theme, Geist / Geist Mono type, type scale, spacing, radii, elevation, shadows, opacity, breakpoints, grid, container widths, icon sizes, focus-ring tokens, z-index, motion durations and presets, contrast proofs tied to specific colours, component tokens, `.figure` typography and tone map, named layout classes, responsive frame, depth floor, density rules, register rules, styled templates, visual "feel" references (Linear, Vercel). Withdrawn: DP3, DP4, DP5, DP13, OD7, A7, PA2, A13, A14, P7-A7, FD02, Q6-4, Q6-5. Reworded: BR3, BR4, DP2, DP6–DP8. Renamed: 22 sections, 19 contracts (tables in Phases 5 and 6). Page "Modules" → Content requirements (removed in the later self-audit); "Responsive behavior" → Device needs. Status: 1.0.0 "Scheduled" rows → "Specified" with a planned sprint; P01, S04, S06, S07 → Built. |
| **Removed** | **Empty.** No feature was removed. |

Deferred items (F6, F7, P26, P27, S44, S45) are retained in full; deferral is a status.

## Assumptions

- A2 v1 read-only (contested by OD9).
- A3 banking modules arrive via the contract; BE-accounts and BE-transactions by Sprint 3.
- A5 product demo data from the backend seed; a 5M-row seed for Sprint 3.
- A9 R5–R7 share `ADMIN`.
- A10 uncommitted working-tree code is recorded as Built at the maintainer's instruction.

## Open questions

- **BE-saved-views** — backend module or per-device `localStorage`? The register assumes a backend module.
- **Sequencing corrections** — confirm the pull-forwards above.
- **CI branches** — add `development`?
- **Contract source** — set `CONTRACT_SOURCE=../backend/openapi.json`.
- **Uncommitted Built** — should the register show the home-page rows as In progress until the owner commits? (Recorded as Built per instruction.)

## Traceability

| Direction | Phase | What flows |
|---|---|---|
| Upstream | [Phase 1](phase-1-product-vision.md) | scope, personas, OD1–OD10 |
| Upstream | [Phase 2](phase-2-experience-maps.md) | F, D, X |
| Upstream | [Phase 3](phase-3-information-architecture.md) | route groups, prefixes, admin guard |
| Upstream | [Phase 4](phase-4-page-blueprints.md) | P01–P35 |
| Upstream | [Phase 5](phase-5-section-blueprints.md) | S01–S64 |
| Upstream | [Phase 6](phase-6-interaction-contracts.md) | C01–C68 |
| Upstream | [Phase 7](phase-7-frontend-architecture.md) | folders, hooks, LD1–LD5 |
| Downstream | [Phase 9](phase-9-qa-checklist.md) | Built → Verified; host findings |
| Downstream | [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | status roll-up |
| Downstream | [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md), [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | sprints, setup |
