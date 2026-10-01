# Ledgerline Design OS — README

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Start here](START_HERE.md) · Next: [Design OS complete](DESIGN-OS-COMPLETE.md) · [Index](ARTIFACT_INDEX.md)

## What this is

**In 30 seconds:** the Ledgerline Design OS is a fifteen-file specification for building Ledgerline, a read-only business banking console, on the Next.js App Router starter in this repository. Nine phase files go from product vision to QA; six navigation and implementation files help you find things and start building. Every page, section, interaction contract and flow has one ID, one spec and one place it is defined. Build status lives in exactly one file, [Phase 8](phase-8-implementation-roadmap.md#build-status-register).

It defines **what the product does** — users, journeys, information, content priorities, data, behaviour and architecture — and **leaves how it looks to the build**. Colours, type, layout, placement, imagery and motion are decided page by page when each page is built, with the owner, using the repo's UI skills.

It is not a mockup set and not a backlog. It is the agreement between product, design, engineering and QA about what v1 is, written so an engineer can implement a page without asking what it must do.

Version 2.0.0 was a **merge** over 1.0.0: everything specified before is retained, visual prescriptions were dropped (listed in [DESIGN-OS-COMPLETE](DESIGN-OS-COMPLETE.md#what-changed-in-200)), and the owner's rebuilt home page is recorded as Built alongside two open product decisions it raises (OD9, OD10).

Version 2.1.0 is an **enterprise-grade audit** over 2.0.0. Limits now have one authority: every limit, timing and retention period is fixed in [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) and named as a constant in [Phase 7 §10](phase-7-frontend-architecture.md#10-constants). Every phase now specifies failure, denial, limits, concurrency, session expiry, audit and freshness for what it describes. [Phase 8](phase-8-implementation-roadmap.md#release-gates) gained a definition of done and seven release gates, and [Phase 9](phase-9-qa-checklist.md#item-count) grew to 396 checks and 34 host findings. No page, section, contract, flow or ID was removed ([what changed](DESIGN-OS-COMPLETE.md#what-changed-in-210)).

## Quick start

- **New here?** [START_HERE.md](START_HERE.md), then [Phase 1](phase-1-product-vision.md) and the [sitemap](phase-3-information-architecture.md#3-sitemap).
- **Building?** [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), then paste [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) into a new session and name the sprint.
- **Looking for something?** [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) maps every phase to its sections, readers and keywords.

## Complete file listing

### Phases (9)

| File | Purpose |
|---|---|
| [phase-1-product-vision.md](phase-1-product-vision.md) | Vision, personas R1–R8, JTBD, business rules BR1–BR20 (BR19 is the single table of limits, expiry and retention), permission matrix, metrics, governance, principles, non-goals, open decisions OD1–OD16 |
| [phase-2-experience-maps.md](phase-2-experience-maps.md) | Journeys F1–F7, dashboards D1–D7, supporting flows X1–X11 with role branches, failures, recoveries, timing, audit, completion criteria and backend dependencies |
| [phase-3-information-architecture.md](phase-3-information-architecture.md) | Navigation, sitemap, role navigation, capability matrix with enforcement, denial and audit per capability, taxonomy, labels, cross-links, search, filters and URL schema, SEO, breadcrumbs, the exact response per fallback situation |
| [phase-4-page-blueprints.md](phase-4-page-blueprints.md) | P01–P35: purpose, objectives, primary tasks, data and its freshness, permissions and denial, device needs, states, dependencies; URL state by page |
| [phase-5-section-blueprints.md](phase-5-section-blueprints.md) | S01–S64: purpose, responsibilities, data, interaction, device needs, accessibility, states; the section contract with read and write rules |
| [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md) | C01–C68: inputs, states, keyboard, ARIA, validation, loading, error, content rules; 23 inherited rules (single-flight, idempotency, focus, expiry, offline) |
| [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md) | Folders, routes, layouts and guards, providers, hooks, the constants table, validated configuration, API and error taxonomy, verification layers and CI gate, libraries, performance, security, observability, templates |
| [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md) | Eight sprints with entry criteria and a definition of done, milestones, dependencies, risks R-1–R-20, testing, deployment, release gates and go/no-go list, build-status register, scope ledger |
| [phase-9-qa-checklist.md](phase-9-qa-checklist.md) | 396 numbered checks (373 active) in 19 categories, host findings H-01–H-34, per-page matrix, sign-off, Verified gate |

### Navigation and implementation (6)

| File | Purpose |
|---|---|
| [START_HERE.md](START_HERE.md) | Entry point |
| [README.md](README.md) | This overview |
| [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) | Master index, statistics, cross-references, what changed |
| [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | Deep per-phase index, reading orders, keywords, status roll-up |
| [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Environment and validated configuration, backend and contract connection, folders, constants, dependencies, tests and seed tiers, CI gate, workflow |
| [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) | Self-contained build prompt with the Visual Design Hand-off, the engineering rules, the definition of done and the release gates |

## How to use it by role

### Product

Start with [Phase 1](phase-1-product-vision.md). Your decisions are the open ones: OD1 jurisdiction, OD2 session policy, OD3 money movement, OD5 data source, OD6 two-step, OD8 libraries, **OD9** (does the public page describe v1, a wider product, or stay a labelled design study?), **OD10** (how visitors sign in and start), and the six the audit added, OD11–OD16, each with a default that applies until you answer. [Phase 8](phase-8-implementation-roadmap.md#open-decisions) says when each is needed, and its [release gates](phase-8-implementation-roadmap.md#release-gates) and [go/no-go list](phase-8-implementation-roadmap.md#gono-go-list) say what is signed before production.

### Designers

This design OS gives you requirements, not layouts. For each page, [Phase 4](phase-4-page-blueprints.md) says what users come to get done, what they are told in each state, and what users on each device need; [Phase 5](phase-5-section-blueprints.md) gives each section's purpose, behaviour and states; [Phase 6](phase-6-interaction-contracts.md) gives how every control behaves. The visual concept is yours to propose at build time and the owner's to approve.

### Engineers

[SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), then [Phase 7](phase-7-frontend-architecture.md) for locations and data flow, then [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) for the sprint. Use IDs from Phases 4–6 in commits and PRs. Take every limit from a named constant ([Phase 7 §10](phase-7-frontend-architecture.md#10-constants)); meet the [definition of done](phase-8-implementation-roadmap.md#sprint-gate) before recording an item Built. Update the status column in [Phase 8](phase-8-implementation-roadmap.md) — nowhere else.

### QA

[Phase 9](phase-9-qa-checklist.md): numbered pass/fail items, each with its method and the evidence to keep, the seed tiers they run against, the host findings H-01–H-34, the per-page state matrix, and the gate that moves an item from Built to Verified. Visual quality is not a Phase 9 check; it is approved by the owner at build.

## Key statistics

| Measure | Count |
|---|---|
| Phases | 9 |
| Pages | 35 |
| Sections | 64 |
| Interaction contracts | 68 |
| Flows | 25 (7 primary, 7 dashboards, 11 supporting) |
| Personas | 8 |
| Business rules | 20 (BR1–BR20) |
| Open decisions | 15 active, OD1–OD16 (OD7 withdrawn) |
| Timeline | 16 weeks (8 sprints) |
| QA items | 396 numbered, Q-001–Q-396 (373 active, 23 retired as visual) |
| Host findings | 34 (H-01–H-34; 6 retired as visual) |
| Risks | 20 (R-1–R-20) |
| Release gates | 7 |
| Register rows (2026-10-01) | 209 (46 Built, 9 In progress, 0 Scheduled, 148 Specified, 6 Deferred, 0 Verified) |

## Getting started (five minutes)

1. Minute 1 — read [START_HERE](START_HERE.md) and its note on what blocks work today.
2. Minute 2 — skim [Phase 1 › Product purpose](phase-1-product-vision.md#product-purpose) and [Non-goals](phase-1-product-vision.md#non-goals).
3. Minute 3 — look at the [sitemap](phase-3-information-architecture.md#3-sitemap).
4. Minute 4 — open [Phase 8 › Build status register](phase-8-implementation-roadmap.md#build-status-register) to see what exists.
5. Minute 5 — read the [Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off) — it governs every page you build.

## Design OS philosophy

- **No ambiguity.** Every page, section and control has an ID and a single specification; every state is named.
- **No reinvention.** The host repo's conventions, installed libraries and native platform come first; new packages need approval.
- **No visual prescription.** The spec says what users need and how things behave; the look is decided per page with the owner.
- **Scope preservation.** Nothing specified is deleted for being unbuilt; status is recorded, never used to remove.
- **Traceability.** Every item links upstream to the need it serves and downstream to where it is built and checked.
- **One authority per fact.** A limit is fixed once (Phase 1 BR19), a constant is named once (Phase 7 §10), status is recorded once (Phase 8).
- **Production-ready.** The spec is written to hand to engineering and QA without a translation step.

## Decisions pending

Every row is the maintainer's. The default is what the build does when the decision is still open at the sprint that needs it ([Phase 1](phase-1-product-vision.md#open-decisions), [Phase 8](phase-8-implementation-roadmap.md#open-decisions)).

| ID | Question | Default until answered | Needed by |
|---|---|---|---|
| OD1 | Jurisdiction, regulator, default currency | Neutral onboarding fields; no default is safe for real customers | Sprint 5 |
| OD2 | Session policy | 15 min idle, 12 h absolute, step-up for reveals | Sprint 2 |
| OD3 | Money movement in v1? | v1 read-only; F6 and F7 stay Deferred | Revisit trigger |
| OD4 | Feature folders under `components/` | Folders already in the repository stay as found | Sprint 1 |
| OD5 | Banking data source / partner | Backend seed only | Sprint 3 (backend) |
| OD6 | Two-step method | Passkeys with TOTP fallback; no SMS | Sprint 7 |
| OD8 | Library approvals LD1–LD5 | Nothing further installed (LD1 is installed) | Sprint 1 |
| OD9 | Public page scope vs v1 | The page keeps its disclosures and is not deployed as the product site | Request Sprint 1; answer by Sprint 8 |
| OD10 | Entry path from the public site | Sign-in and registration reachable from the navigation; the enquiry sends nothing | Sprint 2 |
| OD11 | Account status mapping to the backend's `OPEN / FROZEN / CLOSED` | `active` = `OPEN`; `pending_verification` is a workspace state | Sprint 3 |
| OD12 | Who may read the audit record | R7 all, R6 case history, R5 by quoted reference, members none in v1 | Sprint 6 |
| OD13 | May registration say an email is already registered? | Same neutral answer; the existing user is told by email | Sprint 2 |
| OD14 | Free-text `q` in the URL | `q` is the one recorded exception; never logged or sent to analytics | Sprint 3 |
| OD15 | Journeys with no map | Out of v1 scope until named | Sprint 8 |
| OD16 | Build notes inside Phase 5 | Kept; Phase 8 is authoritative | Sprint 1 |

## Version

2.1.0 · 2026-10-01 · enterprise-grade audit over 2.0.0 (2026-09-28), itself a merge over 1.0.0 (2026-09-26, commit `9565964`). Seed: the 9-phase + 6-ancillary master prompt in `docs/MASTER_PROMPT_COMPLETE.md`.
