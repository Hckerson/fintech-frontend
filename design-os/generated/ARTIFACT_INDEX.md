# Ledgerline Design OS — Artifact Index

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
- [Reading orders by role](#reading-orders-by-role)
- [Search keywords](#search-keywords)
- [Build status roll-up](#build-status-roll-up)

## How to use this index

Each phase entry gives a long description, who needs it, when to open it, what it contains, and how it connects to the others. The [build status roll-up](#build-status-roll-up) at the end is a **view** over [Phase 8](phase-8-implementation-roadmap.md#build-status-register); if the two ever disagree, Phase 8 is right and this file is stale.

## Phase 1 — Product Vision

**File:** [phase-1-product-vision.md](phase-1-product-vision.md)

**Description.** The single source of truth for why Ledgerline exists and what it will and will not do. It resolves every placeholder in the seed, defines eight personas from founder to compliance analyst to prospect, and fixes the business rules that bind every later phase — money as integer minor units in strings, masked account numbers with step-up reveal, a read-only v1, invitation-only membership for non-owners, and no invented content. It records every open decision the maintainer owns, including OD9 and OD10 raised by the rebuilt home page, with both sides stated.

**Who needs it.** Everyone; product and compliance most.

**When to reference it.** Before scoping anything; when a later phase seems to disagree; when deciding whether a claim may appear on a public page.

**What it contains.** Placeholder resolution · business vision and purpose · goals BG1–BG6 · value proposition · competitive positioning · personas R1–R8 · JTBD · business rules BR1–BR12 and the permission matrix · success metrics, KPIs K1–K14, North Star · governance · platform constraints · product principles DP1–DP13 · implementation philosophy · non-goals · scalability · open decisions OD1–OD10 · assumptions A1–A10.

**Flows to.** Phase 2 (personas and rules), Phase 3 (permissions), Phases 4–6 (rules applied), Phase 8 (decision deadlines), Phase 9 (checks).

## Phase 2 — Experience Maps

**File:** [phase-2-experience-maps.md](phase-2-experience-maps.md)

**Description.** Every journey before any page: what a person is trying to do, what starts it, the steps, where it can fail, how it recovers, what the system does and which backend resources it needs. Seven primary flows cover checking cash, reviewing a ledger, investigating a transaction, exporting, onboarding, and the deferred transfer and bill-pay flows; seven dashboards cover four workspace roles and three internal roles; eleven supporting flows cover authentication, sessions, team, notifications, profile, help, errors and the new enquiry flow. It ends with a backend dependency summary that marks what exists today.

**Who needs it.** Product, designers (for the concept of each page), engineers (for system behaviour), QA (for recovery-path tests).

**When to reference it.** Before building any page; when writing E2E scenarios.

**What it contains.** F1–F7 · D1–D7 · X1–X11 · backend dependency summary · assumptions.

**Flows to.** Phase 3 (entry points), Phases 4–5 (states), Phase 7 (hooks), Phase 8 (sequencing), Phase 9 (tests).

## Phase 3 — Information Architecture

**File:** [phase-3-information-architecture.md](phase-3-information-architecture.md)

**Description.** Turns the flows into structure: two navigation shells, a sitemap with route groups, the page index, which roles see which navigation, the capability matrix and how it is enforced at each layer, the domain taxonomy, exact labels and severities, cross-links, the command-palette search hierarchy, the URL filter schema with its Zod definition, SEO, breadcrumbs, empty and fallback routes, protected prefixes, and expansion strategy. 2.0.0 adds the public site navigation of the built home page.

**Who needs it.** Engineers (routes, guards, filters), designers (navigation content), QA (permissions).

**When to reference it.** When adding a route, a label, a filter or a permission.

**What it contains.** §1–§17 plus a change log.

**Flows to.** Phases 4, 6, 7, 9.

## Phase 4 — Page Blueprints

**File:** [phase-4-page-blueprints.md](phase-4-page-blueprints.md)

**Description.** One blueprint per page, P01–P35: purpose, business and user objectives, primary tasks as user goals, required data, permissions, device needs, loading/empty/error/success states, dependencies (including the sections each page uses) and implementation notes. Conventions cover route groups, segment files, composition, metadata, enforcement and a reference page. P01 lists both the specified and the built sections and names the OD9/OD10 divergences.

**Who needs it.** Everyone building or reviewing a page — including the visual concept, which starts from the user goals and priorities here.

**When to reference it.** At the start of every page.

**What it contains.** Conventions · P01–P35 · D1–D4 role variants · page index · assumptions.

**Flows to.** Phase 5 (sections), Phase 7 (routes), Phase 8 (status), Phase 9 (matrix).

## Phase 5 — Section Blueprints

**File:** [phase-5-section-blueprints.md](phase-5-section-blueprints.md)

**Description.** Sixty-four sections, each doing one job: the four-state rule, shared data conventions (money, query keys, stale tiers, cursors, URL filters), the accessibility floor, and per section its purpose, responsibilities, data requirements, interaction model, contract IDs, device needs, accessibility, states, reuse and technical notes. The ten built public-page sections are recorded as found with their open-decision facets.

**Who needs it.** Engineers and QA daily; designers for what each section is for and how it behaves.

**When to reference it.** Building or testing any section.

**What it contains.** Names table · section contract · S01–S64 · open questions Q1–Q6 · assumptions.

**Flows to.** Phases 6, 7, 8, 9.

## Phase 6 — Interaction Contracts

**File:** [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md)

**Description.** How every interactive element behaves, independent of how it looks: inputs, states, keyboard, ARIA, interaction patterns, validation, loading, error, content rules, do and don't, dependencies and where each is used. IDs C01–C63 carry over from the 1.0.0 component library; C64–C68 cover the built public page. Money formatting (C40), masking (C42), the command palette (C38), the virtualized ledger (C53), state boundaries (C57) and the permission gate (C59) carry the heaviest contracts.

**Who needs it.** Engineers building components; QA writing keyboard and screen-reader checks; designers checking a concept supports the behaviour.

**When to reference it.** Whenever a control is built or changed.

**What it contains.** Names table · inherited rules · C01–C68 · dependency map · Q6-1–Q6-8.

**Flows to.** Phase 7 (layers), Phase 8, Phase 9.

## Phase 7 — Frontend Architecture

**File:** [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md)

**Description.** Where everything goes and how data moves: folder and route trees with built items marked, layouts and guards, providers and contexts (no global store), feature folders with every section's file, the hook inventory and query-key factory, utilities and constants, the contract flow from backend DTO to hook, component layers and lint map, library proposals, code splitting, lazy loading, performance budgets, security controls, observability and code templates. It records two 2.0.0 findings: a public-page money helper that must not be reused and a type-name collision.

**Who needs it.** Engineers.

**When to reference it.** Before creating any file; when wiring an endpoint.

**What it contains.** §1–§28.

**Flows to.** Phase 8 (foundations), Phase 9 (budgets, security), SETUP-CHECKLIST, IMPLEMENTATION_PROMPT.

## Phase 8 — Implementation Roadmap

**File:** [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md)

**Description.** The plan and the only record of progress: eight two-week sprints with exit criteria, five milestones, backend, library and decision dependencies, eleven risks including the public-page scope risk, debt guards, testing and deployment readiness, the build status vocabulary, the register of all 209 items, and the scope-preservation ledger (Retained / Added / Changed / Removed).

**Who needs it.** Delivery lead, maintainer, engineers.

**When to reference it.** Planning a sprint; updating status; checking whether something was dropped.

**What it contains.** Phases, priorities, sprints, milestones, dependencies, risks, debt, testing, deployment, vocabulary, register, ledger.

**Flows to.** Phase 9 (Verified), this index (roll-up), IMPLEMENTATION_PROMPT.

## Phase 9 — QA Checklist

**File:** [phase-9-qa-checklist.md](phase-9-qa-checklist.md)

**Description.** Numbered, single-statement pass/fail checks across accessibility, behavioural consistency, responsiveness, scalability, performance, state coverage, errors, loading, readiness, developer experience, SEO, maintainability, cross-browser, WCAG 2.2 AA, money integrity, security, content truthfulness and the public site. Visual items are retired, not deleted. It holds the host audit findings, a per-page state matrix, sign-off roles and the gate that moves an item from Built to Verified (which now includes owner visual approval).

**Who needs it.** QA, accessibility and security reviewers, engineers before merge.

**When to reference it.** Before marking anything Verified; when reviewing a PR.

**What it contains.** Categories 1–19 · H-01–H-25 · matrix · sign-off · gate.

**Flows to.** Phase 8.

## Implementation files (Phases 7–9) in detail

| Need | Phase 7 | Phase 8 | Phase 9 |
|---|---|---|---|
| Where a file goes | §3, §7 | — | Q-117, Q-152 |
| Route and guard | §4, §5, §22 | FD04, FD06 | Q-230, Q-231 |
| Data for a section | §8, §13 | BE-* table | Q-074, Q-119 |
| Money | §9 `money.ts` | C40 tests | Q-207–Q-221 |
| Performance | §19–§21 | R-3 | Q-048–Q-060 |
| Security | §22 | R-5 | Q-222–Q-241 |
| Libraries | §15 | LD table | Q-127, Q-154 |
| Public page | §3, §7, §9 | OD9, OD10, R-10, R-11 | Q-251–Q-262 |

## Reading orders by role

| Role | Order |
|---|---|
| Maintainer / product | START_HERE → Phase 1 (OD9, OD10) → Phase 8 (open decisions, risks) → README |
| Designer | Phase 1 (personas, principles) → Phase 2 → Phase 4 (the page) → Phase 5 → Phase 6 → IMPLEMENTATION_PROMPT §3 (hand-off) |
| Frontend engineer | SETUP-CHECKLIST → Phase 7 → Phase 4 (the page) → Phase 5 → Phase 6 → IMPLEMENTATION_PROMPT |
| Backend engineer | Phase 2 (dependency summary) → Phase 7 §13 → Phase 8 (BE-* table) |
| QA | Phase 9 → Phase 5 (states) → Phase 6 (keyboard, ARIA) → Phase 2 (recoveries) |
| Compliance / security | Phase 1 (BR5, BR10–BR12, OD1, OD9) → Phase 3 §6 → Phase 7 §22 → Phase 9 §17–§19 |

## Search keywords

| Phase | Keywords |
|---|---|
| 1 | vision, persona, JTBD, business rule, minor units, masking, invitation, KPI, North Star, non-goal, open decision, OD9, OD10 |
| 2 | journey, flow, failure path, recovery, dashboard, step-up, session expiry, enquiry, dependency |
| 3 | navigation, sitemap, route group, role, capability, permission, label, severity, search, filter, URL, SEO, breadcrumb, 404 |
| 4 | page, primary tasks, priority, device needs, state ladder, reference page, metadata, role variant |
| 5 | section, four-state, purpose, query key, stale time, cursor, empty state, public site |
| 6 | contract, keyboard, ARIA, focus, validation, Amount, MaskedAccountNumber, CommandPalette, DataTable, PermissionGate |
| 7 | folder, route, layout, provider, hook, action, contract flow, lint, library, performance, security, template |
| 8 | sprint, milestone, risk, dependency, backend module, register, status, Deferred, ledger |
| 9 | QA, WCAG, check, host finding, matrix, sign-off, Verified gate |

## Build status roll-up

Drawn from [Phase 8 › Summary](phase-8-implementation-roadmap.md#summary) on 2026-09-28. This is a view, not a source.

| Layer | Built | In progress | Specified | Deferred | Verified | Total |
|---|---|---|---|---|---|---|
| Primary flows | 0 | 0 | 5 | 2 | 0 | 7 |
| Dashboards | 0 | 0 | 7 | 0 | 0 | 7 |
| Supporting flows | 2 | 2 | 7 | 0 | 0 | 11 |
| Pages | 2 | 0 | 31 | 2 | 0 | 35 |
| Sections | 13 | 1 | 48 | 2 | 0 | 64 |
| Interaction contracts | 9 | 0 | 59 | 0 | 0 | 68 |
| Foundations | 6 | 0 | 11 | 0 | 0 | 17 |
| **Total** | **32** | **3** | **168** | **6** | **0** | **209** |

Built today: P01 Home and its sections S04, S06, S07, S55–S64 and contracts C64–C68 (working tree, uncommitted; diverging from spec per OD9/OD10); P02 Sign in and X1; C01, C34, C56, C61; X11 (design-study state); FD01, FD05, FD07–FD10. In progress: X2, X3, S08. Deferred: F6, F7, P26, P27, S44, S45 (OD3).
