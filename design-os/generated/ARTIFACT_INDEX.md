# Ledgerline Design OS — Artifact Index

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Design OS complete](DESIGN-OS-COMPLETE.md) · Next: [Setup checklist](SETUP-CHECKLIST.md) · [Start here](START_HERE.md)

## Table of contents

- [How to use this index](#how-to-use-this-index)
- [Phase 1 — Product Vision](#phase-1--product-vision)
- [Phase 2 — Experience Maps](#phase-2--experience-maps)
- [Phase 3 — Information Architecture](#phase-3--information-architecture)
- [Phase 4 — Page Blueprints](#phase-4--page-blueprints)
- [Phase 5 — Section Blueprints](#phase-5--section-blueprints)
- [Phase 6 — Interaction Contracts](#phase-6--interaction-contracts)
- [Phase 7 — Frontend Architecture](#phase-7--frontend-architecture)
- [Phase 8 — Implementation Roadmap](#phase-8--implementation-roadmap)
- [Phase 9 — QA Checklist](#phase-9--qa-checklist)
- [Implementation files (Phases 7–9) in detail](#implementation-files-phases-79-in-detail)
- [Where each cross-cutting rule lives](#where-each-cross-cutting-rule-lives)
- [Reading orders by role](#reading-orders-by-role)
- [Search keywords](#search-keywords)
- [Build status roll-up](#build-status-roll-up)

## How to use this index

Each phase entry gives a long description, who needs it, when to open it, what it contains, and how it connects to the others. The [build status roll-up](#build-status-roll-up) at the end is a **view** over [Phase 8](phase-8-implementation-roadmap.md#build-status-register); if the two ever disagree, Phase 8 is right and this file is stale.

Version 2.1.0 is an enterprise-grade audit of every phase. Each entry below says what the audit added. Two rules of precedence came out of it: [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) is the authority for every limit, timing and retention value, and [Phase 7 §10](phase-7-frontend-architecture.md#10-constants) owns the name of every constant.

## Phase 1 — Product Vision

**File:** [phase-1-product-vision.md](phase-1-product-vision.md)

**Description.** The single source of truth for why Ledgerline exists and what it will and will not do. It resolves every placeholder in the seed, defines eight personas from founder to compliance analyst to prospect, and fixes the business rules that bind every later phase — money as integer minor units in strings, masked account numbers with step-up reveal, a read-only v1, invitation-only membership for non-owners, and no invented content. The 2.1.0 audit added eight rules, BR13–BR20: what a denied member experiences, time and time zones, freshness, the audit trail, multi-currency and pending totals, repeated and conflicting actions, the BR19 table of limits, expiry and retention, and failure with a quotable support reference. It records every open decision the maintainer owns, OD1–OD16, each now with its consequence, cost of reversal and the default that applies if it stays unanswered.

**Who needs it.** Everyone; product and compliance most.

**When to reference it.** Before scoping anything; when a later phase seems to disagree; when a limit or timing is in question (BR19 wins); when deciding whether a claim may appear on a public page.

**What it contains.** Placeholder resolution · business vision and purpose · goals BG1–BG6 · value proposition · competitive positioning · personas R1–R8 · JTBD · business rules BR1–BR20, lifecycle states and the permission matrix · the BR19 limits table · success metrics, KPIs K1–K16, North Star · governance, including how a decision is made, recorded and disputed · platform constraints (browsers, session, performance, availability, retention on the device) · product principles DP1–DP13 · implementation philosophy · non-goals as testable boundaries · scalability thresholds · open decisions OD1–OD16 · assumptions A1–A28.

**Flows to.** Phase 2 (personas and rules), Phase 3 (permissions), Phases 4–6 (rules applied), Phase 7 (BR19 values become named constants), Phase 8 (decision deadlines), Phase 9 (checks).

## Phase 2 — Experience Maps

**File:** [phase-2-experience-maps.md](phase-2-experience-maps.md)

**Description.** Every journey before any page: what a person is trying to do, what starts it, the steps, where it can fail, how it recovers, what the system does and which backend resources it needs. Seven primary flows cover checking cash, reviewing a ledger, investigating a transaction, exporting, onboarding, and the deferred transfer and bill-pay flows; seven dashboards cover four workspace roles and three internal roles; eleven supporting flows cover authentication, sessions, team, notifications, profile, help, errors and the enquiry flow. The 2.1.0 audit deepened every map with role branches, timing, what is audited and testable completion criteria, and settled shared behaviour: a stale write is refused, an interrupted write is never replayed, writes are refused offline. It ends with a backend dependency summary that marks what exists today, now including accounts and cash flow, and it lists the journeys that have no map yet (OD15).

**Who needs it.** Product, designers (for the concept of each page), engineers (for system behaviour), QA (for recovery-path tests).

**When to reference it.** Before building any page; when writing E2E scenarios; when a session expires or a step-up interrupts a task (X4); when something fails or the device is offline (X10).

**What it contains.** How to read these maps (inherited conventions) · flow index · F1–F7 · D1–D7 · X1–X11 · backend dependency summary · assumptions P2-A1–P2-A14 · journeys with no map.

**Flows to.** Phase 3 (entry points), Phases 4–5 (states), Phase 7 (hooks), Phase 8 (sequencing), Phase 9 (tests).

## Phase 3 — Information Architecture

**File:** [phase-3-information-architecture.md](phase-3-information-architecture.md)

**Description.** Turns the flows into structure: two navigation shells, a sitemap with route groups, the page index, which roles see which navigation, the capability matrix and how it is enforced at each layer, the domain taxonomy, exact labels and severities, cross-links, the command-palette search hierarchy, the URL filter schema with its Zod definition, SEO, breadcrumbs, empty and fallback routes, protected prefixes, and expansion strategy. The 2.1.0 audit added, per capability, the enforcement point, what a denied member gets and the audit record; membership and role edge cases; the policy for unknown values; search query rules; and the exact response for every fallback situation. §11.1 is now the one authority for the ledger URL parameters, including `direction`, `category` and `attachment`.

**Who needs it.** Engineers (routes, guards, filters), designers (navigation content), QA (permissions).

**When to reference it.** When adding a route, a label, a filter or a permission; when deciding what a denied or signed-out person receives.

**What it contains.** §1–§17 — notably [§6 Permissions](phase-3-information-architecture.md#6-permissions) with §6.3 enforcement, denial and audit per capability and §6.4 edge cases, [§11 Filtering hierarchy](phase-3-information-architecture.md#11-filtering-hierarchy) with the parameter table and validation, [§15.1 the exact response per situation](phase-3-information-architecture.md#151-the-exact-response-per-situation) and [§16 Protected prefixes](phase-3-information-architecture.md#16-protected-prefixes) — plus a change log and assumptions through IA13.

**Flows to.** Phases 4, 6, 7, 9.

## Phase 4 — Page Blueprints

**File:** [phase-4-page-blueprints.md](phase-4-page-blueprints.md)

**Description.** One blueprint per page, P01–P35: purpose, business and user objectives, primary tasks as user goals, required data, permissions, device needs, loading/empty/error/success states, dependencies (including the sections each page uses) and implementation notes. Conventions cover route groups, segment files, composition, metadata, enforcement, the state ladder, a reference page and URL state by page. The 2.1.0 audit deepened every page with freshness, scale edges, limits, denial and signed-out behaviour, session expiry and step-up mid-task, conflict and double submission, money and time-zone rules, audit, and what never reaches a URL, title or log. P01 lists both the specified and the built sections and names the OD9/OD10 divergences.

**Who needs it.** Everyone building or reviewing a page — including the visual concept, which starts from the user goals here.

**When to reference it.** At the start of every page.

**What it contains.** Conventions (route groups, segment files, composition contract, metadata and indexing, permissions and enforcement, device baseline, state ladder, reference page, URL state by page) · P01–P35 · D1–D4 role variants · page index · assumptions through PA24.

**Flows to.** Phase 5 (sections), Phase 7 (routes), Phase 8 (status), Phase 9 (matrix).

## Phase 5 — Section Blueprints

**File:** [phase-5-section-blueprints.md](phase-5-section-blueprints.md)

**Description.** Sixty-four sections, each doing one job: the four-state rule, shared data conventions (money, query keys, stale tiers, cursors, URL filters), the accessibility floor, and per section its purpose, responsibilities, data requirements, interaction model, contract IDs, device needs, accessibility, states, reuse and technical notes. The 2.1.0 audit refined the four-state rule (first load, refresh and load-more; none yet, none match and not permitted; retryable, non-retryable and offline, each error with a quotable reference) and gave the section contract its read rules and five write rules: idempotent creation, no silent overwrite, no automatic retry, session expiry, offline. Every data-bound section now states freshness, paging, limits, role denial, conflict and session expiry. The ten built public-page sections are recorded as found with their open-decision facets.

**Who needs it.** Engineers and QA daily; designers for what each section is for and how it behaves.

**When to reference it.** Building or testing any section.

**What it contains.** Names table · section contract (four-state rule, one primary fact, shared data conventions, accessibility floor) · S01–S64 · open questions Q1–Q15 · assumptions through A24.

**Flows to.** Phases 6, 7, 8, 9.

## Phase 6 — Interaction Contracts

**File:** [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md)

**Description.** How every interactive element behaves, independent of how it looks: inputs, states, keyboard, ARIA, interaction patterns, validation, loading, error, content rules, do and don't, dependencies and where each is used. IDs C01–C63 carry over from the 1.0.0 component library; C64–C68 cover the built public page. The 2.1.0 audit extended the rules every contract inherits to 23 — one state vocabulary, one activation per request with an idempotency key, focus destinations, input parity, announcement wording, validation timing, time limits and unknown outcomes, session expiry mid-action, offline, sensitive values, failure text, scale edges, locale — and gave every contract's states a trigger and an effect. Money formatting (C40), masking (C42), the command palette (C38), the virtualized ledger (C53), session expiry (C55), state boundaries (C57) and the permission gate (C59) carry the heaviest contracts.

**Who needs it.** Engineers building components; QA writing keyboard and screen-reader checks; designers checking a concept supports the behaviour.

**When to reference it.** Whenever a control is built or changed.

**What it contains.** Names table · [rules every contract inherits](phase-6-interaction-contracts.md#rules-every-contract-inherits) (1–23) · C01–C68 · dependency map · Q6-1–Q6-11 · assumptions A6-1–A6-15.

**Flows to.** Phase 7 (layers), Phase 8, Phase 9.

## Phase 7 — Frontend Architecture

**File:** [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md)

**Description.** Where everything goes and how data moves: folder and route trees with built items marked, layouts and guards, providers and contexts (no global store), feature folders with every section's file, the hook inventory and query-key factory, utilities and constants, the contract flow from backend DTO to hook, component layers and lint map, library proposals, code splitting, lazy loading, performance budgets, security controls, observability and code templates. The 2.1.0 audit made §10 the complete constants table (values from Phase 1 BR19, names owned here) with configuration validated at startup; added the error taxonomy, timeouts and retry, invalidation, the pagination contract, idempotency and degraded service to §13; a check for every organisation rule and the verification layers with the CI gate order in §14; and session, redirect, header, throttling, tenant-isolation and secrets policy in §22. Every failure shape in its templates carries a required `reference`.

**Who needs it.** Engineers.

**When to reference it.** Before creating any file; when wiring an endpoint; when a limit needs a constant; when classifying an error; when setting up CI.

**What it contains.** §1–§28 — notably [§5.7 guard matrix](phase-7-frontend-architecture.md#57-guard-matrix), [§8.1 query-key factory](phase-7-frontend-architecture.md#81-query-key-factory--libhooksquery-keysts), [§10 constants](phase-7-frontend-architecture.md#10-constants) with [§10.3 specified values](phase-7-frontend-architecture.md#103-specified-values) and [§10.4 environment and configuration](phase-7-frontend-architecture.md#104-environment-and-configuration), [§13.6 error taxonomy](phase-7-frontend-architecture.md#136-error-taxonomy) through §13.11, [§14.2 verification layers](phase-7-frontend-architecture.md#142-verification-layers), [§22 security](phase-7-frontend-architecture.md#22-security) with §22.1–§22.5, §23 observability and the quotable reference, §24 code templates, assumptions through P7-A21.

**Flows to.** Phase 8 (foundations), Phase 9 (budgets, security), SETUP-CHECKLIST, IMPLEMENTATION_PROMPT.

## Phase 8 — Implementation Roadmap

**File:** [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md)

**Description.** The plan and the only record of progress: eight two-week sprints, five milestones, backend, library and decision dependencies, twenty risks, debt guards, testing and deployment readiness, the build status vocabulary, the register of all 209 items, and the scope-preservation ledger (Retained / Added / Changed / Removed). The 2.1.0 audit gave every sprint entry criteria, a ten-point definition of done and exit statements a tester can try; named an owner, an early-warning signal and a contingency for every risk; added nine cross-cutting backend requirements; and added environments, configuration checks, rollout and rollback, monitoring, seven release gates and an eleven-line go/no-go list. The register was re-read from the repository on 2026-10-01, and every Built or In progress row names the file that is its evidence and what it still owes.

**Who needs it.** Delivery lead, maintainer, engineers.

**When to reference it.** Planning a sprint; deciding whether an item is done; updating status; preparing a release; checking whether something was dropped.

**What it contains.** How to read the roadmap · phases · priorities · [sprint gate](phase-8-implementation-roadmap.md#sprint-gate) (entry, definition of done, exit) and Sprints 1–8 · milestones with measurable acceptance · dependencies (backend modules, library decisions, open decisions OD1–OD16, critical path) · risks R-1–R-20 · debt guards · testing · deployment readiness with [release gates](phase-8-implementation-roadmap.md#release-gates) and the [go/no-go list](phase-8-implementation-roadmap.md#gono-go-list) · vocabulary · register · ledger · assumptions P8-A1–P8-A4.

**Flows to.** Phase 9 (Verified), this index (roll-up), IMPLEMENTATION_PROMPT.

## Phase 9 — QA Checklist

**File:** [phase-9-qa-checklist.md](phase-9-qa-checklist.md)

**Description.** Numbered, single-statement pass/fail checks across accessibility, behavioural consistency, responsiveness, scalability, performance, state coverage, errors, loading, readiness, developer experience, SEO, maintainability, cross-browser, WCAG 2.2 AA, money integrity, security, content truthfulness and the public site. The 2.1.0 audit took it from 262 to 396 numbered checks (373 active, 23 retired as visual, none deleted), sharpened 57 existing checks with a threshold, a method and the evidence to keep, and defined the evidence rule, a lab profile and the seed tiers that scale and integrity checks run against. It holds 34 host audit findings — H-01–H-25 re-checked against the current code and H-26–H-34 added — a per-page state matrix, sign-off roles and the gate that moves an item from Built to Verified.

**Who needs it.** QA, accessibility and security reviewers, engineers before merge.

**When to reference it.** Before marking anything Verified; when reviewing a PR; when a defect in built code needs a finding to file against.

**What it contains.** How to use (evidence, thresholds, lab profile, seed tiers, roles, backend dependency) · categories 1–19 · [host audit findings](phase-9-qa-checklist.md#host-audit-findings) H-01–H-34 · [matrix](phase-9-qa-checklist.md#per-page-state-coverage-matrix) · sign-off · [Verified gate](phase-9-qa-checklist.md#verified-gate) · assumptions P9-A1–P9-A9 · open questions Q9-1–Q9-3 · [item count](phase-9-qa-checklist.md#item-count) with the ID ranges per category.

**Flows to.** Phase 8.

## Implementation files (Phases 7–9) in detail

Check IDs added after Q-262 sit in the category they belong to, so a category's IDs are no longer one unbroken range; the full table is [Phase 9 › Item count](phase-9-qa-checklist.md#item-count).

| Need | Phase 7 | Phase 8 | Phase 9 |
|---|---|---|---|
| Where a file goes | §3, §7 | — | Q-117, Q-152 |
| Route and guard | §4, §5 (§5.7 guard matrix), §22 | FD04, FD06, R-12, R-18 | Q-230, Q-231, Q-388; H-14, H-26 |
| Data for a section | §8, §13 | BE-* table | Q-074, Q-119 |
| Limits and constants | §10 (§10.3 values) | Definition of done, item 8 | Thresholds rule; Q9-3 |
| Configuration | §10.4 | Configuration checks | Q-305–Q-312 |
| Errors and the quotable reference | §13.6, §13.7, §23 | R-16, BE-request-reference | Q-073–Q-085, Q-291–Q-303, Q-382–Q-384; H-28 |
| Repeated and conflicting writes | §8.3, §13.10 | BE-idempotency, BE-versioning | Q-291–Q-303 |
| Large ledgers | §13.9, §21.4, §21.5 | R-3, BE-cursor | Q-038–Q-047, Q-273–Q-281 |
| Money | §9 `money.ts`, §9.1 | C40 tests | Q-207–Q-221, Q-327–Q-345, Q-387 |
| Performance | §19–§21 | R-3 | Q-048–Q-060, Q-282–Q-284 |
| Security | §22 (§22.1–§22.5) | R-5, R-14–R-18 | Q-222–Q-241, Q-346–Q-375, Q-388–Q-392, Q-394–Q-396 |
| Workspace isolation | §8.1, §22.4 | R-15 | Q-044; H-27 |
| CI gate | §14.2 | FD12, R-8 | Q-313–Q-318 |
| Release | §13.11 | Release gates, go/no-go list | Q-305–Q-312 |
| Libraries | §15 | LD table | Q-127, Q-154 |
| Public page | §3, §7, §9 | OD9, OD10, R-10, R-11 | Q-251–Q-262, Q-393 |

## Where each cross-cutting rule lives

One rule, one authority. Other phases repeat or apply it.

| Rule | Authority | Applied in | Checked in |
|---|---|---|---|
| Limits, timings, retention | Phase 1 BR19 | Phase 7 §10 (names), Phases 2–6 | Phase 9 "Thresholds" |
| Idempotency, stale writes, no automatic retry | Phase 1 BR18 | Phase 5 section contract, Phase 6 rules 10, 15, 16, Phase 7 §13.10 | Phase 9 category 7 |
| Drafts in the open tab's memory only | Phase 1 BR18 | Phase 6 rules 16, 18, Phase 7 §8.1, §12 | Phase 9 category 17 |
| Failure and the quotable reference | Phase 1 BR20 | Phase 6 rule 19, Phase 7 §13.6, §23 | Phase 9 category 7 |
| Denial and non-disclosure | Phase 1 BR13 | Phase 3 §6, Phase 7 §5.7 | Phase 9 categories 6, 17 |
| Workspace ID in cache keys | Phase 7 §8.1 | Phase 5 shared data conventions | Q-044 |
| Time zone | Phase 1 BR14 | Phase 7 §9.1 | Phase 9 category 16 |
| Money exactness and currencies | Phase 1 BR1, BR2, BR17 | Phase 6 C40, Phase 7 §9.1 | Phase 9 category 16 |
| Nothing sensitive in URLs, titles, logs, analytics | Phase 1 BR5, DP11 (exception: OD14) | Phase 6 rule 18, Phase 7 §22, §22.5 | Q-226 |
| Freshness | Phase 1 BR15 | Phase 7 §10.3, §21.6 | Phase 9 category 6 |
| Audit trail | Phase 1 BR16 | Phase 6 rule 23, Phase 7 §22.5 | Phase 9 category 17 |
| Definition of done, release gates | Phase 8 | IMPLEMENTATION_PROMPT | Phase 8 go/no-go list |
| Built → Verified | Phase 9 Verified gate | Phase 8 register | Phase 9 sign-off |

## Reading orders by role

| Role | Order |
|---|---|
| Maintainer / product | START_HERE → Phase 1 (OD1–OD16, BR19) → Phase 8 (open decisions, risks, release gates) → README |
| Designer | Phase 1 (personas, principles) → Phase 2 → Phase 4 (the page) → Phase 5 → Phase 6 → IMPLEMENTATION_PROMPT §3 (hand-off) |
| Frontend engineer | SETUP-CHECKLIST → Phase 7 (§10, §13, §22) → Phase 4 (the page) → Phase 5 → Phase 6 → Phase 8 (definition of done) → IMPLEMENTATION_PROMPT |
| Backend engineer | Phase 2 (dependency summary) → Phase 7 §13 → Phase 8 (BE-* table, including the nine cross-cutting requirements) → Phase 1 BR16, BR18, BR19 |
| QA | Phase 9 (how to use, seed tiers) → Phase 5 (states) → Phase 6 (keyboard, ARIA) → Phase 2 (recoveries) → Phase 8 (definition of done) |
| Compliance / security | Phase 1 (BR5, BR6, BR10–BR13, BR16, BR19, OD1, OD9, OD12–OD14) → Phase 3 §6 → Phase 7 §22 → Phase 8 (release gates) → Phase 9 §17–§19 and host findings |

## Search keywords

| Phase | Keywords |
|---|---|
| 1 | vision, persona, JTBD, business rule, minor units, masking, invitation, limit, retention, BR19, freshness, audit trail, idempotency, denial, time zone, KPI, North Star, governance, non-goal, open decision, OD9, OD10, OD11–OD16 |
| 2 | journey, flow, failure path, recovery, dashboard, step-up, session expiry, offline, outage, enquiry, dependency, completion criteria |
| 3 | navigation, sitemap, route group, role, capability, permission, denial, label, severity, search, filter, URL parameter, SEO, breadcrumb, 404, protected prefix |
| 4 | page, primary tasks, device needs, state ladder, reference page, metadata, URL state, role variant |
| 5 | section, four-state, purpose, query key, stale time, cursor, empty state, not permitted, write rules, public site |
| 6 | contract, keyboard, ARIA, focus, validation, single-flight, announcement, Amount, MaskedAccountNumber, CommandPalette, DataTable, PermissionGate |
| 7 | folder, route, layout, guard, provider, hook, query key, constant, environment, action, contract flow, error kind, timeout, retry, pagination, lint, CI gate, library, performance, security, CSP, tenant isolation, reference, template |
| 8 | sprint, entry criteria, definition of done, milestone, risk, dependency, backend module, release gate, go/no-go, rollback, register, status, Deferred, ledger |
| 9 | QA, WCAG, check, evidence, seed tier, lab profile, host finding, matrix, sign-off, Verified gate |

## Build status roll-up

Drawn from [Phase 8 › Summary](phase-8-implementation-roadmap.md#summary) on 2026-10-01, which was read from the repository at commit `5b52c67`. This is a view, not a source.

| Layer | Built | In progress | Scheduled | Specified | Deferred | Verified | Total |
|---|---|---|---|---|---|---|---|
| Primary flows | 0 | 0 | 0 | 5 | 2 | 0 | 7 |
| Dashboards | 0 | 0 | 0 | 7 | 0 | 0 | 7 |
| Supporting flows | 3 | 3 | 0 | 5 | 0 | 0 | 11 |
| Pages | 7 | 0 | 0 | 26 | 2 | 0 | 35 |
| Sections | 17 | 2 | 0 | 43 | 2 | 0 | 64 |
| Interaction contracts | 12 | 1 | 0 | 55 | 0 | 0 | 68 |
| Foundations | 7 | 3 | 0 | 7 | 0 | 0 | 17 |
| **Total** | **46** | **9** | **0** | **148** | **6** | **0** | **209** |

Change since 2026-09-28: Built 32 → 46, In progress 3 → 9, Specified 168 → 148, Deferred unchanged at 6. Nothing is Scheduled because no sprint has a start date, and nothing is Verified because no Phase 9 pass is recorded.

| Status | Items |
|---|---|
| Built | X1, X2, X11 · P01, P02, P03, P16, P28, P34, P35 · S04, S06, S07, S29, S46, S47, S54, S55–S64 · C01, C10, C26, C30, C34, C56, C61, C64–C68 · FD01, FD05, FD07–FD10, FD13 |
| In progress | X3, X9, X10 · S03, S08 · C40 · FD04, FD06, FD11 |
| Deferred | F6, F7, P26, P27, S44, S45 (OD3) |

### Caveats: built, not verified

Built means merged and used by a merged page; it does not mean the item meets its whole blueprint. Each row below is Built or In progress and carries open findings or owed work that must close before it can be Verified. Details are in the register rows and in [Phase 9 › Host audit findings](phase-9-qa-checklist.md#host-audit-findings).

| Items | Open findings | What it still owes |
|---|---|---|
| P01 with S04, S06, S07, S55–S64 | H-08 (root title and description are literals), H-24 (public-page money helper assumes a fixed exponent), H-25 (sample type names) | Reconciliation with OD9 and OD10; S05 is not built |
| P02, X1, C34, S08 | H-02 (remainder: the wait on a throttled sign-in), H-04 (no password reset to reach), H-05 (remainder: error not tied to each field), H-06 (focus in forced-colours mode), H-15 (lands on the public page, not P08), H-16 (open redirect) | Forgot, reset and verify variants; two-step leg |
| P03, X2 | H-34 (registration hints that an account exists; OD13) | The onboarding destination (P07) |
| P16, S29 | H-26 (reachable signed out), H-27 (cache keys without a workspace ID), H-28 (no timeout, no reference on failure), H-32 (copied link carries figures) | The signed-in layout and navigation, C57 and C58, money through C40 |
| P28, S46, S47, X9 | H-30 (articles describe pages that do not exist) | The messages leg; promotion of the help-only precursors of C11, C29, C32 |
| P34, P35, S54, X10 | H-33 (error copy says money was not affected) | Segment boundaries for the signed-in, auth and admin groups; the outage check |
| C01 | H-06, H-07, H-22 | — |
| C10, C26, C30 | — | Required state (C10); progress and indeterminate variants (C26); keyboard stepping, empty and error states (C30) |
| C61 | H-23 (cache timing literal) | `STALE_TIME` from constants |
| C65, C68 | — | Escape handling (C65) and accessibility (C68) to confirm in Phase 9 |
| C40 | — | No consumer yet; absolute display, status states, currency-code display |
| X3 | H-18 (sign-out does not end the session on the server) | A way to sign out from the product |
| FD05, FD06 | H-14 (only `/dashboard` protected; no role check in the proxy), H-26, H-29 (filters lost on the way to sign-in) | Every signed-in and admin prefix protected (R-12, R-18) |
| FD04 | — | Layouts for the signed-in and auth groups |
| FD11 | H-07, H-14, H-17 (no security headers), H-18, H-22, H-23 still present | None is closed until Phase 9 re-runs it |

The findings above with severity S1 are H-02, H-04, H-06, H-14, H-15, H-16, H-17, H-26, H-32 and H-33. They are Sprint 1 work ([Phase 8 › Sprint 1](phase-8-implementation-roadmap.md#sprint-1--foundations-weeks-12--m1), risks R-12 and R-14–R-18).
