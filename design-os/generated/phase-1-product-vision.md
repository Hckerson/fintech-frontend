# Ledgerline Design OS — Phase 1: Product Vision

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Start here](START_HERE.md) · Next: [Phase 2 — Experience Maps](phase-2-experience-maps.md) · [Index](ARTIFACT_INDEX.md)

## Table of contents

- [Placeholder resolution](#placeholder-resolution)
- [Business vision](#business-vision)
- [Product purpose](#product-purpose)
- [Business goals](#business-goals)
- [Value proposition](#value-proposition)
- [Competitive positioning](#competitive-positioning)
- [Primary personas](#primary-personas)
- [Secondary personas](#secondary-personas)
- [Internal personas](#internal-personas)
- [Public persona](#public-persona)
- [Jobs To Be Done](#jobs-to-be-done)
- [Business rules](#business-rules)
- [Success metrics](#success-metrics)
- [KPIs](#kpis)
- [North Star metric](#north-star-metric)
- [Governance](#governance)
- [Platform constraints](#platform-constraints)
- [Product principles](#product-principles)
- [Implementation philosophy](#implementation-philosophy)
- [Non-goals](#non-goals)
- [Future scalability considerations](#future-scalability-considerations)
- [Open decisions](#open-decisions)
- [Assumptions](#assumptions)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

This document is the single source of truth for why Ledgerline exists, who it serves, what it will and will not do, and which rules every later phase inherits. When a later phase disagrees with this one, this one wins until it is amended. It makes no visual decisions: how anything looks is decided when each page is built, with the owner (seed › Critical Rules › No Visual Prescription).

## Placeholder resolution

| Placeholder | Value | Evidence |
|---|---|---|
| PRODUCT_NAME | Ledgerline | `package.json` name `ledgerline-frontend`; design OS 1.0.0; landing page brand data `lib/data/ledgerline/brand.ts` |
| DOMAIN | Business banking (fintech): an operating-account console for small and mid-sized businesses | design OS 1.0.0; folder `fintech/` |
| REFERENCE_PRODUCTS | Mercury, Brex, Ramp, Stripe Dashboard, Modern Treasury — benchmarks for features and flows only | design OS 1.0.0 (the 1.0.0 "feel" references were dropped, see [Changes](#changes-in-this-version)) |
| PERSONAS | R1–R8 (R8 added in this version) | [Personas](#primary-personas) |
| CORE_ENTITY / PLURAL | Transaction / Transactions (container entity: Account) | design OS 1.0.0 |
| PRIMARY_FLOWS | F1–F7 | [Phase 2](phase-2-experience-maps.md#primary-flows) |
| SUPPORTING_FLOWS | X1–X11 (X11 added) | [Phase 2](phase-2-experience-maps.md#supporting-flows) |
| ROLE_DASHBOARDS | D1–D7 | [Phase 2](phase-2-experience-maps.md#role-dashboards) |
| ROLE | Team member (workspace member); profile page P24 Team member profile | design OS 1.0.0 |
| DOMAIN_TOOL | Runway calculator (P16) | design OS 1.0.0 |
| DOMAIN_TRANSACTION | Transfer (P26), outside the v1 read-only scope (Deferred) | design OS 1.0.0; contested by [OD9](#open-decisions) |
| DOMAIN_SPECIFIC_LIBS | Table + virtualization (LD2). Money uses native `Intl.NumberFormat`, no library | design OS 1.0.0 |
| SCALE_TARGET | 50,000 business workspaces · 500 million transactions · single-account ledgers up to 5 million rows · 200 concurrent members per workspace (target, not a claim) | design OS 1.0.0 |
| COMPONENT_COUNT | 68 interaction contracts (C01–C68) | [Phase 6](phase-6-interaction-contracts.md) |
| SECTION_COUNT | 64 (S01–S64) | [Phase 5](phase-5-section-blueprints.md) |
| PAGE_COUNT | 35 (P01–P35) | [Phase 4](phase-4-page-blueprints.md) |
| TIMELINE_WEEKS | 16 (8 two-week sprints) | [Phase 8](phase-8-implementation-roadmap.md) |
| QA_ITEM_COUNT | 262 numbered items (Q-001–Q-262): 239 active, 23 retired as visual | [Phase 9](phase-9-qa-checklist.md) |
| OUTPUT_DIR | `design-os/generated/` | seed default |

## Business vision

Ledgerline gives a business one calm, exact place to see its money. A founder opening it on a Monday knows, within seconds, how much cash the business has across every account, what moved since Friday, and whether anything needs attention. A finance lead closes the month without asking the bank for a statement, without re-keying rows into a spreadsheet, and without guessing which transactions an accountant has already looked at.

The long-term vision is an operating-account console that finance teams trust as the record they reconcile against. Trust is the product: every figure is a value the backend holds, formatted exactly, never estimated, never rounded silently, never invented.

Why: small and mid-sized businesses often run finance with a part-time accountant and a founder who checks balances between meetings. A wrong or unclear number is paid for in missed payroll, late filings or a failed audit. A console that is fast, exact and legible reduces that cost before it adds any money-movement feature.

## Product purpose

Ledgerline v1 is a **read-only business banking console**. It lets a workspace (one business) and its members:

- see balances and today's movement across all accounts (F1);
- read, filter and search account ledgers at any size (F2, F3);
- annotate transactions with notes, categories, flags and attachments, and share a link to one (F3);
- download monthly statements and export transactions for accounting (F4);
- complete business verification (KYB) and owner verification (KYC) (F5);
- invite teammates with scoped roles (X6), receive alerts (X7) and message support securely (X9).

Money movement — Transfer (F6) and Pay a payee / bill (F7) — is fully specified so the system has room for it, but it is outside the v1 read-only scope (Deferred, OD3).

**Contested in this version.** The marketing home page built in the working tree presents a wider product: payments with two-person approvals, cards with spending controls, a treasury forecast with interest on idle cash, multi-currency accounts, pricing plans and sample balances. That is recorded as open decision [OD9](#open-decisions), not resolved here. Until the maintainer answers OD9, the purpose above is the specification.

## Business goals

| ID | Goal | Why it matters | Measured by |
|---|---|---|---|
| BG1 | Become the place a workspace checks cash first | Habitual use is the precondition for every later feature | North Star, K1, K2 |
| BG2 | Shorten month-end reconciliation for finance leads and accountants | The pain is sharpest here and time is measurable | K4, K5 |
| BG3 | Onboard and verify businesses without support tickets | Verification friction is the largest drop-off risk in business banking | K7, K8 |
| BG4 | Earn trust through exactness and security | A single wrong figure costs more trust than any feature earns | K10, K11, K12 |
| BG5 | Let a small internal team (R5–R7) support many workspaces | Operating cost per workspace must stay flat towards SCALE_TARGET | K13, K14 |
| BG6 | Keep the frontend ready for money movement without shipping it early | OD3 may be answered later; the product must not need a rewrite | P26, P27, S44, S45 stay specified |

## Value proposition

| Persona | Pain today | What Ledgerline gives them |
|---|---|---|
| R1 Account Owner | Logs into several bank portals; balances out of date; cannot tell what changed | One cash position across accounts with today's movement (S14, S15) and a runway estimate (P16) |
| R2 Finance Lead | Month-end means requesting statements, re-keying rows, chasing receipts | Statements on demand (P17), exports by period and account (P18), attachments on the transaction itself (S26) |
| R3 External Accountant | Needs a login to someone else's bank; ends up with over-broad access or emailed PDFs | A scoped `accountant` role: read, annotate, export, no team or settings access |
| R4 Team Viewer | Asks the owner "did the client pay?" by chat | View access to permitted accounts only, with search (P11) |
| R5–R7 Internal | Tools built for engineers, not operations | A support console (P33), compliance queue (P32) and admin overview (P29) held to the same standard as the customer product |
| R8 Prospect | Cannot tell from a bank's site what it actually does | A public page that states truthfully what the product does and how to start (P01) |

Positioning statement: for small and mid-sized businesses whose finance is run by a founder and an accountant, Ledgerline is the operating-account console that shows every balance and transaction exactly and makes month-end a download, not a project.

## Competitive positioning

The reference products are **categories of approach**, used to benchmark features and flows only. No market-size, share or customer figure is stated because none has been measured.

| Approach | Represented by | What it gets right | Where Ledgerline v1 differs |
|---|---|---|---|
| Startup business banking with a strong console | Mercury | Dense, legible account and transaction views; multi-user access | v1 is read-only and positions on reconciliation and exactness rather than account opening and payments |
| Spend management built around cards | Brex, Ramp | Receipt capture, categorisation, approval workflows | v1 has no cards or approvals; annotation (S26) covers the receipt-and-category job (contested by OD9) |
| Payments developer dashboard | Stripe Dashboard | Fast search, drill-down to a single object, shareable object links | Ledgerline adopts drill-down and share-link (F3, C51) for bank transactions |
| Treasury and payment operations | Modern Treasury | Ledger-grade rigour, reconciliation as the core job | Targets businesses without a treasury team (contested by OD9: the built page shows a treasury forecast) |

Honest position: Ledgerline v1 does less than every category leader above. It chooses to do the read, search, annotate and export jobs exactly and quickly, and to leave money movement until a licensed partner and backend module exist (OD3, OD5).

## Primary personas

### R1 — Account Owner

- **Who:** founder or business owner; workspace role `owner`.
- **Context:** checks cash between other work, on a laptop or a phone.
- **Goals:** know the cash position now; know if anything unusual happened; get the business verified; control who sees what.
- **Frustrations:** stale balances; asking the accountant what a transaction was; verification forms that lose progress.
- **Permissions:** everything, including team management, workspace settings and verification.
- **Primary flows:** F1, F5, X6. **Dashboard:** D1.

### R2 — Finance Lead

- **Who:** controller or head of finance operations; workspace role `finance`.
- **Context:** long sessions in ledgers at month-end; keyboard-heavy.
- **Goals:** reconcile every account each month; find and explain any transaction quickly; configure alerts.
- **Frustrations:** exports in the wrong shape; pagination that loses place; numbers that do not match the statement.
- **Permissions:** all data, exports, statements, alert rules, invite viewer and accountant.
- **Primary flows:** F2, F3, F4. **Dashboard:** D2.

## Secondary personas

### R3 — External Accountant / Bookkeeper

- **Who:** invited from outside the business; workspace role `accountant`. May belong to many client workspaces (A4).
- **Goals:** pull statements and exports for the period; annotate transactions with categories and questions.
- **Frustrations:** switching between client logins; being given more access than needed.
- **Permissions:** read, annotate, exports, statements; no team management, no workspace settings.
- **Primary flows:** F4, F3. **Dashboard:** D3.

### R4 — Team Viewer

- **Who:** employee with view access to permitted accounts; workspace role `viewer`.
- **Goals:** confirm a payment arrived; look up a transaction.
- **Permissions:** read permitted accounts only; no exports.
- **Primary flows:** F1 (restricted), F3 (read only). **Dashboard:** D4.

## Internal personas

These operate the platform, not a workspace. Until finer platform roles exist they share the backend `ADMIN` role (A9).

| ID | Persona | Platform role | Can | Cannot | Dashboard |
|---|---|---|---|---|---|
| R5 | Support Agent | `support` | Read-only lookup of workspaces and users; read and reply to messages | Change user records; decide verification | D5 (P33) |
| R6 | Compliance Analyst | `compliance` | Read verification cases; request info; approve or reject | Change user records beyond case decisions | D6 (P32) |
| R7 | Platform Admin | `admin` | Users CRUD, stats, every internal surface | Move customer money (no such capability exists) | D7 (P29) |

## Public persona

### R8 — Prospect (added in 2.0.0)

- **Who:** a founder or finance lead evaluating Ledgerline on the public site; not signed in.
- **Goals:** understand what the product does, whether it fits, what it costs, and how to start.
- **Frustrations:** claims that turn out to be untrue; forms that ask for too much.
- **Permissions:** public pages only (P01, P02–P06, P28).
- **Flows:** X2 Register, X11 Get-started enquiry. Why added: the built home page is written for this reader and captures their email (S64); 1.0.0 referred to "qualified business visitors" without naming them.

## Jobs To Be Done

| Persona | Job |
|---|---|
| R1 | When I open my laptop on Monday, I want to see total cash and what changed since Friday, so I can decide whether anything needs my attention today. |
| R1 | When I plan a hire, I want to see how many months of runway current cash gives at recent burn, so I can decide with a number rather than a feeling. |
| R1 | When the bank needs to verify my business, I want to submit details and documents once and see exactly what is still missing, so I can get approved without a support thread. |
| R1 | When my accountant joins, I want to give them access to data and exports but not to team settings, so I can share the books without sharing control. |
| R2 | When I close the month, I want every account's statement and a CSV of the period, so I can reconcile in the accounting system without re-keying. |
| R2 | When a transaction looks wrong, I want to jump straight to it and see its full lifecycle and counterparty history, so I can explain or escalate it in minutes. |
| R2 | When a large debit posts, I want an alert, so I can react before the day ends. |
| R3 | When I start a client's month-end, I want to switch into their workspace and download the period's exports, so I can work in my own tools. |
| R3 | When I cannot identify a transaction, I want to flag it with a question on the transaction itself, so I can get an answer without email. |
| R4 | When a customer says they paid, I want to search incoming transactions by name or amount, so I can confirm it without asking the owner. |
| R5 | When a customer writes in, I want to look up their workspace and user state read-only, so I can answer accurately without touching their data. |
| R6 | When a verification case is submitted, I want all details and documents in one review, so I can approve, reject or request information with a recorded reason. |
| R7 | When I review platform health, I want user totals and growth over time, so I can spot problems in signup or activation. |
| R8 | When I am comparing business banks, I want to read in a minute what Ledgerline does and does not do, so I can decide whether to start. |

## Business rules

These rules bind every phase. A design that breaks one is incorrect, not a variant.

### Money

- **BR1** Amounts arrive from the backend as integer **minor units in a string** plus an ISO 4217 currency code. They are never parsed to floats and the client does no float arithmetic on money.
- **BR2** Amounts are formatted with native `Intl.NumberFormat` through one formatter (C40 Amount). No money library.
- **BR3** Sign convention: credit positive, debit negative, always shown with the sign in text. Ordinary debits are never presented as a problem; only `returned` and `failed` transactions carry problem severity. Why: flagging every debit as a problem trains users to ignore real problems. (How severity is shown is decided at build.)
- **BR4** Every number, count, reference and date goes through one formatter per kind (C27, C40, date formatter), so the same value never appears two ways. (1.0.0's typographic rule for figures was visual and is dropped.)

### Privacy and security

- **BR5** Account numbers are masked by default (last 4) through C42 MaskedAccountNumber. Full reveal requires step-up re-authentication (X4) and is audit-logged by the backend. Amounts are not masked.
- **BR6** Session policy is open (OD2); the recommendation is a 15-minute idle timeout, 12-hour absolute limit and step-up for sensitive reveals.

### Scope

- **BR7** v1 is read-only for money. Annotations (notes, category, flag, attachments, saved views) are writes and are in scope; money movement is not (OD3; contested by OD9).

### Lifecycle states

| Entity | States |
|---|---|
| Transaction | `pending` → `posted` → (`returned` \| `reversed`); plus `failed` |
| Account | `active`, `frozen`, `closed`, `pending_verification` |
| Verification case | `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` |
| Export job | `queued`, `running`, `ready`, `failed`, `expired` |
| Backend user role (today) | `ADMIN`, `USER` |
| Backend user account status (today) | `ACTIVE`, `PENDING`, `SUSPENDED` |

- **BR8** Every state above has a named text label from constants (C12 Status label). No state is conveyed only by colour.

### Permission matrix

| Capability | owner (R1) | finance (R2) | accountant (R3) | viewer (R4) |
|---|---|---|---|---|
| View balances and transactions | All accounts | All accounts | All accounts | Permitted accounts only |
| Annotate transactions | ✓ | ✓ | ✓ | — |
| Statements | ✓ | ✓ | ✓ | — |
| Exports | ✓ | ✓ | ✓ | — |
| Alert rules | ✓ | ✓ | — | — |
| Invite members | Any role | Viewer and accountant | — | — |
| Team and roles management | ✓ | — | — | — |
| Workspace settings | ✓ | — | — | — |
| Verification (KYB/KYC) | ✓ | — | — | — |

| Capability | support (R5) | compliance (R6) | admin (R7) |
|---|---|---|---|
| Workspace and user lookup | Read | — | ✓ |
| Messages | Read and reply | — | ✓ |
| Verification cases | — | Read and decide | ✓ |
| Users CRUD and stats | — | — | ✓ |

- **BR9** The matrix lives once in `lib/data/` and is rendered by S41 Role permissions reference and enforced in UI by C59 PermissionGate. The backend is the authority; the UI gate only hides what the backend would refuse.

### Access

- **BR12** (made explicit in 2.0.0; behaviour unchanged from 1.0.0) An owner creates an account by self-service registration (X2, P03) and then verifies the business (F5). Every other workspace member joins only by invitation from an owner or finance lead (X6). There is no open sign-up into an existing workspace. The built home page routes its "Open an account" and "Sign in" actions to an enquiry form instead (OD10).

### Content

- **BR10** Never put invented content in front of real people: no fabricated balances, testimonials, customer logos, compliance badges or security certifications. Marketing copy states only what is true, lives in constants and is reviewed. (The built home page shows labelled sample figures — OD9 facet d.)
- **BR11** Dev and demo data for the product comes from the backend seed (`backend/prisma/seed.ts`), never from arrays in the frontend. Frontend `lib/data/` holds static product copy and config (nav config, help articles, empty-state copy, permission matrix). (The built home page keeps sample figures in `lib/data/ledgerline/`, which the host rule permits for seed/sample data — OD9 facet d.)

## Success metrics

All numeric values are **targets** for the first 90 days after release, not measurements.

| ID | Outcome | Signal |
|---|---|---|
| SM1 | Owners check Ledgerline first | Share of R1 members with a dashboard session on ≥ 3 distinct days per week |
| SM2 | Month-end happens in Ledgerline | Share of workspaces that download a statement or complete an export each month |
| SM3 | Verification completes without support | Share of cases reaching `approved` with no support thread |
| SM4 | Users find transactions fast | Time from opening search (P11 or C38) to opening a transaction detail (P12) |
| SM5 | Users trust the numbers | Support threads tagged "balance mismatch" per 1,000 workspaces |

## KPIs

| ID | KPI | Target | Source |
|---|---|---|---|
| K1 | Weekly active workspaces | trend upward week on week | session + workspace events |
| K2 | P08 median time until the cash position (S14) is readable | ≤ 1.5 s on a mid-range laptop | web vitals |
| K3 | Ledger entries (S23) first rows readable after navigation | ≤ 1.0 s at p75 | web vitals + custom mark |
| K4 | Share of export jobs reaching `ready` | ≥ 99% | export job states |
| K5 | Median time from export request to `ready` | ≤ 60 s for one month of one account | export job timestamps |
| K6 | Share of transactions annotated by month-end in workspaces with an accountant | trend upward | annotation events |
| K7 | Verification completion (`not_started` → `submitted`) | ≥ 70% of started cases | case states |
| K8 | Cases returned `needs_info` more than once | ≤ 10% | case states |
| K9 | Search-to-detail time (SM4) | ≤ 20 s median | client events |
| K10 | Balance-mismatch threads per 1,000 workspaces | 0 caused by frontend formatting | support tags |
| K11 | WCAG 2.2 AA automated violations on release | 0 | [Phase 9](phase-9-qa-checklist.md) |
| K12 | Step-up failures leading to lockout support threads | trend downward | auth events + support tags |
| K13 | Median R5 lookup-to-answer time | trend downward | P33 events |
| K14 | Median R6 case decision time after `submitted` | ≤ 1 business day | case timestamps |

## North Star metric

**Weekly reconciling workspaces:** workspaces in which, during a calendar week, at least one member downloaded a statement, downloaded a `ready` export, or annotated a transaction.

- It measures the job Ledgerline is for (BG2), not logging in.
- It counts workspaces, because the customer is the business; one accountant serving ten clients counts ten.
- It is reachable in read-only v1; it does not depend on money movement.
- It resists vanity: opening the dashboard repeatedly does not move it.

Guardrails that must not fall while the North Star rises: K10 (trust), K11 (accessibility), K3 (ledger speed).

## Governance

| Decision | Owner | How it is recorded |
|---|---|---|
| Product scope, open decisions OD1–OD10 | Maintainer | [Open decisions](#open-decisions) |
| Library additions LD1–LD5 | Maintainer approval before any install | [Phase 7](phase-7-frontend-architecture.md#15-shared-libraries) |
| Backend API shape | Backend team (class-validator DTOs) | OpenAPI → generated `lib/contract/` |
| Visual design of every page | Owner, at build time per page | Not in this design OS — see [IMPLEMENTATION_PROMPT › Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off) |
| Page, section, interaction inventory | Design OS | [Phase 4](phase-4-page-blueprints.md), [Phase 5](phase-5-section-blueprints.md), [Phase 6](phase-6-interaction-contracts.md) |
| Build progress and sequencing | Delivery lead | [Phase 8](phase-8-implementation-roadmap.md), the only file that records status |
| Verification policy (KYB/KYC fields, thresholds) | Compliance, bound by OD1 | Backend verification module |

### The contract layer

`lib/contract/` is generated from the backend's OpenAPI document and never edited by hand. `pnpm contract` regenerates it; `pnpm contract:check` fails when it drifts. Every endpoint the frontend calls comes from `@/lib/contract` (or `lib/api-routes.ts` for the few endpoints the backend does not publish). Why: a field renamed on a backend DTO breaks type-checking at every consumer, so a mismatch is found before a user sees a wrong number.

### Scope preservation

A feature specified here is never removed because it has not been built. "Not built" and "later" are statuses recorded in Phase 8 only; they never edit Phases 1–7. Removal requires an explicit maintainer instruction naming the feature. This is why F6, F7, P26, P27, S44 and S45 stay fully specified, and why the capabilities the built home page adds are recorded (S55–S64) rather than ignored.

## Platform constraints

- **Host stack wins.** The host `.claude/CLAUDE.md` overrides the seed defaults: Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, TanStack Query 5, Zod 4, motion 12, Carbon icons, date-fns, nanoid.
- **Styling** is governed by the host conventions and decided per page at build. This design OS states no styling rule.
- **Architecture boundaries.** Pages compose sections only; components never import the API client; shared types live in `lib/types/`; schemas in `lib/validations/`; authenticated calls go through Server Actions in `lib/actions/` wrapped by hooks in `lib/hooks/`.
- **File limits.** One component per file; about 150 lines per file; no comments in code; no `console`.
- **Backend contract today.** The backend publishes auth (register, login), users (list, create, me, get, update, delete), health and user stats. Every banking capability is a backend dependency listed in [Phase 2](phase-2-experience-maps.md#backend-dependency-summary) and [Phase 7](phase-7-frontend-architecture.md#134-endpoints).
- **Session token today** carries `sub`, `email` and `role` (`ADMIN` \| `USER`). Workspace roles require a backend membership model.
- **No new dependency without approval.** LD1–LD5 await approval (OD8).
- **Web only**, usable from 360 CSS px wide upwards (A8). English only in v1; every date, number and currency goes through `Intl` (A6).

## Product principles

How the product behaves and treats its users. Each has a rule that can be checked in a diff or a test.

| ID | Principle | Checkable rule |
|---|---|---|
| DP1 | Exact before anything else | Every amount goes through C40 Amount from minor units; no `parseFloat`, `Number(` or `toFixed` on money fields. |
| DP2 | One primary fact per section | Each section's blueprint names the single piece of information it exists to convey; everything else is secondary to it. |
| DP3 | *Withdrawn in 2.0.0 (visual: density).* | — |
| DP4 | *Withdrawn in 2.0.0 (visual: depth).* | — |
| DP5 | *Withdrawn in 2.0.0 (visual: accent use).* | — |
| DP6 | Colour never carries meaning alone | Every state and severity is also given in text; text and controls meet WCAG 2.2 AA contrast. |
| DP7 | Motion never carries information | Nothing is understood only through movement; `prefers-reduced-motion` is honoured everywhere. |
| DP8 | Focus is always visible | Every focusable element shows a visible focus indicator, including in forced-colours mode. |
| DP9 | Keyboard first | Every primary flow is completable by keyboard; C38 CommandPalette opens with ⌘K / Ctrl+K and reaches every page a role can see. |
| DP10 | Every state is designed | Each section owns loading, empty, error and populated states through C57 QueryBoundary; no section renders a blank area. |
| DP11 | Private by default | Account numbers masked (C42); reveal requires step-up; nothing sensitive in URLs except opaque IDs. |
| DP12 | Truthful surfaces | No placeholder figures, logos, testimonials or badges presented as real on any deployed page (BR10; OD9). |
| DP13 | *Withdrawn in 2.0.0 (visual: themes).* A colour-scheme preference, if offered, applies without reload (C54). | — |

## Implementation philosophy

- **Systems before pages.** Primitives (`components/ui/`), then compositions (`components/common/`), then sections, then pages. A pattern used twice is promoted.
- **Sections are data-bound.** Each section owns its hook, its four states and its error boundary (C58). Pages compose sections and hold page-level state such as URL filters.
- **URL is state.** Ledger filters, date ranges and chosen sub-views live in URL params so every view is shareable and back-button safe.
- **Server state through TanStack Query.** Cursor-based infinite queries for ledgers; polling only while a job runs (S32); no global store (C63 WorkspaceProvider is a context, with its reason stated).
- **Contract-derived types.** Types come from `z.infer` over generated schemas; no parallel hand-written shapes; no `any`, no unchecked casts.
- **Reuse before install.** Native platform first (`<dialog>`, `popover`, `Intl`, native date inputs); installed libraries second; new libraries only after approval.
- **Lint encodes the conventions.** A mechanically checkable rule becomes an ESLint rule with a colocated test; cross-file fixes get a ts-morph codemod.
- **Look is decided at build.** Before a page is coded, a visual concept is run with the repo's UI skills and approved by the owner (IMPLEMENTATION_PROMPT › Visual Design Hand-off).

## Non-goals

| Non-goal (v1) | Why | Where it is still specified |
|---|---|---|
| Money movement: transfers, bill pay, payees | Needs a licensed payments or sponsor-bank partner, a backend payments module, fraud tooling and OD3 | F6, F7, P26, P27, S44, S45 (Deferred). Contested by OD9 |
| Native mobile apps | Responsive web covers the check-cash job (A8) | — |
| Cards and spend management | A different product category (Brex, Ramp) | Contested by OD9 (built S59) |
| Treasury forecasting and yield on idle cash | v1 offers only a labelled runway estimate (P16) | Contested by OD9 (built S57, S60) |
| Accounting ledger / general ledger | Ledgerline exports to accounting tools; it does not replace them | F4 export shapes. Built S61 claims accounting sync (OD9) |
| Multi-language UI | English only in v1; `Intl` keeps the door open (A6) | — |
| Invented demo content in the frontend | BR10, BR11 | Backend seed. Contested by OD9 facet d |
| Opening bank accounts | Depends on the partner (OD5) and jurisdiction (OD1) | — |

## Future scalability considerations

SCALE_TARGET (target, not a claim): 50,000 workspaces · 500 million transactions · single-account ledgers up to 5 million rows · 200 concurrent members per workspace.

- **Ledger size.** A 5-million-row ledger is never loaded whole. S23 Ledger entries uses cursor pagination and row virtualization (C53, LD2) so only visible rows exist in the document. Totals come from S22 (server-computed), never from summing loaded rows.
- **Search.** Filters are server-side and debounced; the client never filters a full dataset.
- **Exports.** Large exports are asynchronous jobs (`queued` → `running` → `ready`), polled only while running.
- **Workspaces per user.** An accountant may belong to many workspaces; query keys include the workspace ID so caches never mix clients' data.
- **Concurrent members.** Annotation writes are optimistic with server reconciliation; a note changed underneath a member is surfaced to them.
- **Internal tooling.** Internal lists (S49, S51, S53) are server-paginated and searchable from day one.
- **Money movement later.** When OD3 is answered, P26 and P27 slot into the existing route group, permission matrix and step-up flow without restructuring navigation.
- **Locales and currencies.** Minor units + ISO 4217 + `Intl` support any currency's exponent; OD1 chooses the default.

## Open decisions

Each is the maintainer's call. User-visible consequence first, then mechanism, then cost of reversal.

| ID | Decision | What users experience | Mechanism | Cost of reversal |
|---|---|---|---|---|
| OD1 | Jurisdiction, regulator and default currency | Which business details and documents owners provide; statement format; default currency | KYB/KYC fields, statement format, data residency, locale. **Note 2.0.0:** the built home page assumes GBP, `en-GB` and UK/EU payment rails; that is an input to OD1, not an answer | **High** |
| OD2 | Session policy | Recommended: signed out after 15 min idle and 12 h absolute; re-authenticate to reveal account numbers | Today a 7-day cookie (`SESSION_MAX_AGE`) | Medium |
| OD3 | Money movement scope | v1 read-only (recommended) vs transfers in v1 | Licensing, sponsor-bank partner, payments module, fraud tooling | **High** |
| OD4 | Feature folders `components/<feature>/` | None directly; how fast teams find sections | Amend host folder table. **Note 2.0.0:** the working tree already contains `components/ledgerline/` for the home page | Low |
| OD5 | Banking data source / partner | Which accounts appear, balance freshness, when pending becomes posted | Backend integration choice | **High** |
| OD6 | Two-step method | Recommended: passkeys with TOTP fallback; SMS discouraged | Backend two-step module; X1, X4, X8 | Medium |
| OD7 | *Withdrawn from this design OS in 2.0.0.* 1.0.0 asked for a default colour scheme; that is a visual decision taken at build with the owner. Whether members get a colour-scheme preference control stays specified as C54 | — | — | — |
| OD8 | Library approvals LD1–LD5 | Charts, fast large ledgers, reliable forms, tested flows depend on these | See [Phase 7 §15](phase-7-frontend-architecture.md#15-shared-libraries) | Low to medium |
| **OD9** | **Product scope presented on the public home page vs v1 scope (added 2.0.0)** | See below | See below | **High** once customers rely on either |
| **OD10** | **Entry path from the public site (added 2.0.0)** | See below | See below | Medium |

### OD9 — What the public home page promises vs what v1 is

Both sides, stated as found. Neither is chosen here.

| Facet | Side A — earlier specification (1.0.0, retained as current spec) | Side B — built home page (working tree) |
|---|---|---|
| a. Payments | v1 is read-only (BR7). F6 Transfer and F7 Pay a payee are Deferred behind OD3 and must not be advertised (Q-247). No approval workflow exists in v1. | S58 presents drafting, two-person approval and scheduling of payments, batch payouts, local rails (Faster Payments, SEPA, wires), with an interactive approval sample; the metrics list "2-step approvals on every outgoing payment". |
| b. Cards | Non-goal ("a different product category"). | S59 presents issuing cards with limits, merchant rules, receipt rules, and a card with sample spend. |
| c. Treasury and accounts | Only a labelled runway estimate (P16). No yield, sub-accounts or forecast. Currency count is OD1/OD5. | S57 presents multi-currency accounts ("34 currencies"), instant internal transfers, interest on idle cash (sample 4.1%), sub-accounts; S60 presents a 90-day cash forecast, "cash you can safely set aside" and projected interest; S61 presents automatic matching and accounting sync. |
| d. Sample figures on a public page | BR10/DP12: no fabricated balances or figures in front of real people; BR11: demo data only from the backend seed. | Sample balances, a sample company, sample rates, sample prices (S62) and sample metrics live in `lib/data/ledgerline/`, each labelled "sample" or "placeholder", with a page-wide disclosure that Ledgerline is a design study and not a bank. |
| e. Security claims | S06 states only behaviour that exists: masked numbers, step-up reveal, two-step sign-in, roles, audit logging. | The built security section lists two-person approvals, hardware keys, protected client money and always-on monitoring, with a note that these are placeholder controls. |
| f. Pricing | Not specified in 1.0.0. | S62 shows three plans with sample prices. |

Consequences to weigh:

- Choosing **A** means the home page copy is rewritten to v1 capabilities before it is deployed as the product's site, sample figures leave the public page (or are replaced by true statements), and S57–S62 are re-scoped; the sections themselves stay recorded.
- Choosing **B** widens v1: OD3 is answered "yes", cards, approvals, treasury forecast and pricing become specified product features that need new flows, pages and backend modules, and BR7, BR10 and the Non-goals are amended.
- A third option is **C**: keep the built page as an explicitly labelled design study that is never deployed as the live product site; P01's product copy is written when v1 ships. This keeps both the page and the v1 scope but leaves P01 without true production copy.

Until answered, Phases 2–7 specify side A, and the built sections S55–S64 are recorded as Built with the divergence noted in [Phase 8](phase-8-implementation-roadmap.md).

### OD10 — Entry path from the public site

| Side A — earlier specification | Side B — built home page |
|---|---|
| Owners self-register (X2, P03) from "Get started" on P01; returning members sign in at P02. Other members join by invitation only (X6, BR12). | "Open an account", "Book a demo" and "Sign in" all lead to an email enquiry form (S64); the form validates and states that nothing is sent. There is no link to P02 or P03. |

Consequence: with side B no one can reach sign-in or registration from the home page. A hybrid (sign-in to P02, "Open an account" to P03, "Book a demo" to the enquiry) is possible and is the recommendation to consider, but is not decided here.

## Assumptions

| ID | Assumption |
|---|---|
| A1 | The product is Ledgerline. |
| A2 | v1 is read-only; money movement is fully specified but Deferred (contested by OD9). |
| A3 | The backend publishes banking modules through the OpenAPI contract; the frontend consumes only `@/lib/contract`. |
| A4 | A workspace has many accounts and members; a user may belong to several workspaces. |
| A5 | Product dev data comes from the backend seed. |
| A6 | English, single locale in v1; all formatting through `Intl`. |
| A7 | *Withdrawn in 2.0.0 (visual register).* |
| A8 | Web only, usable from 360 CSS px wide; no native apps. |
| A9 | Internal roles R5–R7 share backend `ADMIN` until finer platform roles exist. |
| A10 | The working-tree home page is the owner's in-progress rebuild and is recorded as Built without judging its visual design. |

## Changes in this version

- **Changed:** reference-product "feel" benchmarks removed (seed: benchmarks for features and flows only); `THEME_VARIANT` placeholder dropped (not in the seed); BR3 and BR4 rewritten without visual treatment; design principles renamed product principles, with DP3, DP4, DP5, DP13 withdrawn as visual and DP2, DP6, DP7, DP8 reworded to behaviour; OD7 withdrawn as visual; A7 withdrawn; governance of "visual tokens and theme" replaced by build-time owner decision; counts updated (sections 54→64, contracts 63→68).
- **Added:** R8 Prospect; BR12 (access rule made explicit); OD9 and OD10; A10; notes on OD1 and OD4.
- **Retained:** everything else from 1.0.0.

## Traceability

- **Upstream:** seed [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md) › Phase 1; host [CLAUDE.md](../../.claude/CLAUDE.md); design OS 1.0.0 (commit `9565964`); working-tree home page (`app/page.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`).
- **Downstream:** [Phase 2](phase-2-experience-maps.md) maps F1–F7, D1–D7, X1–X11; [Phase 3](phase-3-information-architecture.md) derives navigation from the permission matrix; [Phase 4](phase-4-page-blueprints.md) and [Phase 5](phase-5-section-blueprints.md) apply BR1–BR12; [Phase 6](phase-6-interaction-contracts.md) implements DP1, DP6–DP11 in contracts; [Phase 7](phase-7-frontend-architecture.md) implements the contract layer and scalability notes; [Phase 8](phase-8-implementation-roadmap.md) records status, including OD9's effect; [Phase 9](phase-9-qa-checklist.md) turns BR, DP and K items into checks.
