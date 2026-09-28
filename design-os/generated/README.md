# Ledgerline Design OS — README

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Start here](START_HERE.md) · Next: [Design OS complete](DESIGN-OS-COMPLETE.md) · [Index](ARTIFACT_INDEX.md)

## What this is

**In 30 seconds:** the Ledgerline Design OS is a fifteen-file specification for building Ledgerline, a read-only business banking console, on the Next.js App Router starter in this repository. Nine phase files go from product vision to QA; six navigation and implementation files help you find things and start building. Every page, section, interaction contract and flow has one ID, one spec and one place it is defined. Build status lives in exactly one file, [Phase 8](phase-8-implementation-roadmap.md#build-status-register).

It defines **what the product does** — users, journeys, information, content priorities, data, behaviour and architecture — and **leaves how it looks to the build**. Colours, type, layout, placement, imagery and motion are decided page by page when each page is built, with the owner, using the repo's UI skills.

It is not a mockup set and not a backlog. It is the agreement between product, design, engineering and QA about what v1 is, written so an engineer can implement a page without asking what it must do.

Version 2.0.0 is a **merge** over 1.0.0: everything specified before is retained, visual prescriptions were dropped (listed in [DESIGN-OS-COMPLETE](DESIGN-OS-COMPLETE.md#what-changed-in-200)), and the owner's rebuilt home page is recorded as Built alongside two open product decisions it raises (OD9, OD10).

## Quick start

- **New here?** [START_HERE.md](START_HERE.md), then [Phase 1](phase-1-product-vision.md) and the [sitemap](phase-3-information-architecture.md#3-sitemap).
- **Building?** [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), then paste [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) into a new session and name the sprint.
- **Looking for something?** [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) maps every phase to its sections, readers and keywords.

## Complete file listing

### Phases (9)

| File | Purpose |
|---|---|
| [phase-1-product-vision.md](phase-1-product-vision.md) | Vision, personas R1–R8, JTBD, business rules BR1–BR12, metrics, principles, non-goals, open decisions OD1–OD10 |
| [phase-2-experience-maps.md](phase-2-experience-maps.md) | Journeys F1–F7, dashboards D1–D7, supporting flows X1–X11 with failures, recoveries, system behaviour and backend dependencies |
| [phase-3-information-architecture.md](phase-3-information-architecture.md) | Navigation, sitemap, role navigation, capability matrix, taxonomy, labels, cross-links, search, filters and URL schema, SEO, breadcrumbs, fallbacks |
| [phase-4-page-blueprints.md](phase-4-page-blueprints.md) | P01–P35: purpose, objectives, content requirements in priority, data, permissions, device needs, states, actions |
| [phase-5-section-blueprints.md](phase-5-section-blueprints.md) | S01–S64: purpose, content model, data, interaction, controls, device needs, accessibility, states |
| [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md) | C01–C68: inputs, states, keyboard, ARIA, validation, loading, error, content rules |
| [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md) | Folders, routes, layouts, providers, hooks, API, libraries, performance, security, templates |
| [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md) | Eight sprints, milestones, dependencies, risks, testing, deployment, build-status register, scope ledger |
| [phase-9-qa-checklist.md](phase-9-qa-checklist.md) | 262 numbered checks in 19 categories, host findings, per-page matrix, sign-off, Verified gate |

### Navigation and implementation (6)

| File | Purpose |
|---|---|
| [START_HERE.md](START_HERE.md) | Entry point |
| [README.md](README.md) | This overview |
| [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) | Master index, statistics, cross-references, what changed |
| [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | Deep per-phase index, reading orders, keywords, status roll-up |
| [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Environment, backend and contract connection, folders, dependencies, tests, workflow |
| [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) | Self-contained build prompt with the Visual Design Hand-off |

## How to use it by role

### Product

Start with [Phase 1](phase-1-product-vision.md). Your decisions are the open ones: OD1 jurisdiction, OD2 session policy, OD3 money movement, OD5 data source, OD6 two-step, OD8 libraries, and the two new ones — **OD9** (does the public page describe v1, a wider product, or stay a labelled design study?) and **OD10** (how visitors sign in and start). [Phase 8](phase-8-implementation-roadmap.md#open-decisions) says when each is needed.

### Designers

This design OS gives you requirements, not layouts. For each page, [Phase 4](phase-4-page-blueprints.md) lists what information and actions must be offered and in what priority, and what users on each device need; [Phase 5](phase-5-section-blueprints.md) gives each section's content and states; [Phase 6](phase-6-interaction-contracts.md) gives how every control behaves. The visual concept is yours to propose at build time and the owner's to approve.

### Engineers

[SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), then [Phase 7](phase-7-frontend-architecture.md) for locations and data flow, then [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) for the sprint. Use IDs from Phases 4–6 in commits and PRs. Update the status column in [Phase 8](phase-8-implementation-roadmap.md) — nowhere else.

### QA

[Phase 9](phase-9-qa-checklist.md): numbered pass/fail items, the per-page state matrix, and the gate that moves an item from Built to Verified. Visual quality is not a Phase 9 check; it is approved by the owner at build.

## Key statistics

| Measure | Count |
|---|---|
| Phases | 9 |
| Pages | 35 |
| Sections | 64 |
| Interaction contracts | 68+ |
| Flows | 25 (7 primary, 7 dashboards, 11 supporting) |
| Personas | 8 |
| Business rules | 12 |
| Open decisions | 9 active (OD7 withdrawn) |
| Timeline | 16 weeks (8 sprints) |
| QA items | 262 numbered (239 active) |
| Register rows | 209 (32 Built, 3 In progress, 168 Specified, 6 Deferred, 0 Verified) |

## Getting started (five minutes)

1. Minute 1 — read [START_HERE](START_HERE.md) and the OD9/OD10 note.
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
- **Production-ready.** The spec is written to hand to engineering and QA without a translation step.

## Decisions pending

| ID | Question | Needed by |
|---|---|---|
| OD1 | Jurisdiction, regulator, default currency | Sprint 5 |
| OD2 | Session policy | Sprint 2 |
| OD3 | Money movement in v1? | Revisit trigger |
| OD4 | Feature folders under `components/` | Sprint 1 |
| OD5 | Banking data source / partner | Sprint 3 (backend) |
| OD6 | Two-step method | Sprint 7 |
| OD8 | Library approvals LD1–LD5 | Sprint 1 |
| OD9 | Public page scope vs v1 | Request Sprint 1; answer by Sprint 8 |
| OD10 | Entry path from the public site | Sprint 2 |

## Version

2.0.0 · 2026-09-28 · merge over 1.0.0 (2026-09-26, commit `9565964`). Seed: the 9-phase + 6-ancillary master prompt in `docs/MASTER_PROMPT_COMPLETE.md`.
