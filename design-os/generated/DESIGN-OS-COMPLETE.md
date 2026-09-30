# Ledgerline Design OS — Complete

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [README](README.md) · Next: [Artifact index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [Executive summary](#executive-summary)
- [Deliverables](#deliverables)
- [Deliverable statistics](#deliverable-statistics)
- [How to use this document](#how-to-use-this-document)
- [Cross-references between phases](#cross-references-between-phases)
- [What is included and what is not](#what-is-included-and-what-is-not)
- [What changed in 2.0.0](#what-changed-in-200)
- [Open product decisions](#open-product-decisions)
- [Version and date](#version-and-date)

## Executive summary

You have a complete, interconnected specification of Ledgerline v1 — a read-only business banking console — in fifteen files: nine phases and six ancillary documents. It covers eight personas, twenty-five flows, thirty-five pages, sixty-four sections and sixty-eight interaction contracts, the frontend architecture that holds them, a sixteen-week plan with a single build-status register, and a numbered QA checklist with a gate from Built to Verified.

It is a **merge** over the 1.0.0 run. Nothing specified in 1.0.0 was removed. Visual prescriptions were dropped because the seed now forbids them; the owner's rebuilt home page was recorded as Built; and two open product decisions raised by that page — **OD9** (what the public page promises) and **OD10** (how visitors sign in and start) — are stated with both sides and left to the maintainer.

Today: 32 register rows Built (mostly the home page, still uncommitted in the working tree), 3 In progress, 168 Specified, 6 Deferred, 0 Verified.

## Deliverables

### Phases 1–9

| # | File | Summary |
|---|---|---|
| 1 | [phase-1-product-vision.md](phase-1-product-vision.md) | Why Ledgerline exists and for whom: personas R1–R8, JTBD, business rules BR1–BR12 (money as minor-unit strings, masked account numbers, invitation for non-owners), metrics and North Star, product principles, non-goals, open decisions OD1–OD10. |
| 2 | [phase-2-experience-maps.md](phase-2-experience-maps.md) | Every journey as intent → journey → failures → recoveries → system behaviour → dependencies: F1–F7, D1–D7, X1–X11. |
| 3 | [phase-3-information-architecture.md](phase-3-information-architecture.md) | Two shells, sitemap and page index, role navigation, capability matrix and enforcement layers, taxonomy, labels, cross-links, search, filter schema, SEO, breadcrumbs, empty and fallback routes, protected prefixes. |
| 4 | [phase-4-page-blueprints.md](phase-4-page-blueprints.md) | P01–P35 with purpose, objectives, primary tasks as user goals, data, permissions, device needs, states and the sections each page depends on; conventions for groups, segment files, composition, metadata, permissions and states; D1–D4 role variants. |
| 5 | [phase-5-section-blueprints.md](phase-5-section-blueprints.md) | S01–S64 with purpose, responsibilities, data, interaction, device needs, accessibility and four states; the section contract; the ten built public-page sections. |
| 6 | [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md) | C01–C68 behaviour contracts: inputs, states, keyboard, ARIA, validation, loading, error, content rules, do/don't. |
| 7 | [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md) | Folder and route structure, layouts, providers, feature folders, hook inventory and query keys, utilities, constants, API flow, component layers, libraries, splitting, performance, security, observability, templates. |
| 8 | [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md) | Eight sprints, five milestones, backend and library dependencies, risks R-1–R-11, testing, deployment, the build-status register and the scope-preservation ledger. |
| 9 | [phase-9-qa-checklist.md](phase-9-qa-checklist.md) | Q-001–Q-262 across nineteen categories, host findings H-01–H-25, per-page state matrix, sign-off, Verified gate. |

### Ancillary documents (6)

| File | Summary |
|---|---|
| [START_HERE.md](START_HERE.md) | Entry point, three-step workflow, quick reference. |
| [README.md](README.md) | Five-minute overview, roles, statistics, pending decisions. |
| [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) | This master index. |
| [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | Deep index per phase, reading orders, keywords, status roll-up. |
| [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Setup walkthrough before building. |
| [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) | Build prompt synthesising all nine phases, including the Visual Design Hand-off. |

## Deliverable statistics

| Measure | Value |
|---|---|
| Files | 15 (9 phases + 6 ancillary) |
| Personas | 8 (R1–R8) |
| Primary flows · dashboards · supporting flows | 7 · 7 · 11 |
| Pages | 35 |
| Sections | 64 (54 from 1.0.0 + 10 built) |
| Interaction contracts | 68 (63 from 1.0.0 + 5 built) |
| Business rules | 12 |
| Open decisions | OD1–OD10 (OD7 withdrawn) |
| Library decisions | LD1–LD5, all awaiting approval |
| Backend modules | 4 exist, 22 required, 1 undecided (enquiry), 2 deferred |
| Sprints · weeks · milestones | 8 · 16 · 5 |
| Risks | 11 (R-1–R-11) |
| QA items | 262 numbered, 239 active, 23 retired (visual) |
| Host findings | 25 (6 retired as visual) |
| Register rows | 209: 32 Built · 3 In progress · 168 Specified · 6 Deferred · 0 Verified |

## How to use this document

Use it as the table of contents for the whole set. To find a thing by ID:

| ID prefix | Defined in | Status in |
|---|---|---|
| R (persona), BR, DP, K, SM, OD, A | [Phase 1](phase-1-product-vision.md) | — |
| F, D, X | [Phase 2](phase-2-experience-maps.md) | [Phase 8](phase-8-implementation-roadmap.md#build-status-register) |
| P | [Phase 3](phase-3-information-architecture.md#32-page-index) (route), [Phase 4](phase-4-page-blueprints.md) (blueprint) | Phase 8 |
| S | [Phase 5](phase-5-section-blueprints.md) | Phase 8 |
| C | [Phase 6](phase-6-interaction-contracts.md) | Phase 8 |
| LD, P7-A | [Phase 7](phase-7-frontend-architecture.md) | Phase 8 (FD13–FD17) |
| FD, M, R-, BE- | [Phase 8](phase-8-implementation-roadmap.md) | Phase 8 |
| Q, H | [Phase 9](phase-9-qa-checklist.md) | Phase 9 sign-off |

## Cross-references between phases

| From | To | What travels |
|---|---|---|
| Phase 1 | Phase 2 | personas, JTBD, rules, open decisions |
| Phase 2 | Phase 3 | entry points → navigation and routes |
| Phase 2 | Phase 5 | failure and recovery paths → section states |
| Phase 3 | Phase 4 | routes, groups, SEO, breadcrumbs, empty routes |
| Phase 3 | Phase 6 | labels, search, filter schema → C12, C38, C46–C48 |
| Phase 4 | Phase 5 | page dependencies → sections |
| Phase 5 | Phase 6 | "Contracts" per section → C IDs |
| Phases 4–6 | Phase 7 | pages → routes; sections → feature folders and hooks; contracts → component layers |
| Phases 2–7 | Phase 8 | every item → register row and sprint |
| Phases 1–8 | Phase 9 | rules, states, contracts, budgets → checks |
| Phase 9 | Phase 8 | Built → Verified |
| All | IMPLEMENTATION_PROMPT | synthesis for building |

## What is included and what is not

**Included:** product scope and rules; journeys; information architecture; page and section requirements; interaction behaviour; architecture; plan and status; QA; setup and build prompt; a record of the owner's home-page rebuild and the decisions it raises.

**Not included:**

- **Visual design.** No colours, fonts, sizes, spacing, layouts, placement, imagery, animation, visual references or wireframes. Decided per page at build with the owner.
- Backend implementation (the backend team owns DTOs; this set lists required resources).
- Legal and compliance copy (OD1), pricing strategy (OD9), and any decision marked open.
- Installed dependencies: nothing is installed by this set.

## What changed in 2.0.0

### Files

| 1.0.0 file | 2.0.0 file |
|---|---|
| phase-1 … phase-5 | same names |
| phase-6-component-library.md | phase-6-interaction-contracts.md |
| phase-7-design-tokens.md | **dropped** (entirely visual); its non-visual consequences moved to Phases 1, 6, 7 |
| phase-8-frontend-architecture.md | phase-7-frontend-architecture.md |
| phase-9-implementation-roadmap.md | phase-8-implementation-roadmap.md |
| phase-10-qa-checklist.md | phase-9-qa-checklist.md |
| six ancillary files | same names, rewritten |

### Retained

Every persona, flow, dashboard, page, section, component/contract, state, role, rule, KPI, open decision (other than the visual OD7), library decision, milestone, backend module, QA item number and host finding from 1.0.0.

### Added

R8 Prospect; X11 Get-started enquiry; S55–S64 (public navigation, headline figures, accounts, payments & approvals, cards, treasury forecast, reconciliation, pricing, FAQ, enquiry); C64–C68 (disclosure, small-screen navigation toggle, sample interaction control, enquiry form, text reveal); BR12; OD9; OD10; FD18; R-10; R-11; BE-enquiry; H-24; H-25; Q-251–Q-262.

### Changed (visual prescriptions dropped or reworded)

- Palette: dark default with a lime accent and the "Daylight" light counterpart; semantic, component and tone tokens; contrast proofs tied to those colours.
- Type: Geist and Geist Mono; type scale; `.figure` mono/tabular/slashed-zero rule; heading-size rules.
- Spacing, sizing, radii, elevation, shadows, opacity, z-index, grid, breakpoints, container widths, icon sizes, focus-ring tokens.
- Motion durations and presets; "quiet motion" and entrance rules; hover rules.
- Registers and styling rules: density register (row heights, padding caps), depth floor, "one accent per view", editorial register for marketing, styling standards, variant and styling templates, anti-pattern lists about classes.
- Layouts: named layout classes (`.app-shell`, `.page-stack`, `.band-grid`, `.split-view`, `.form-column`, `.auth-frame`, `.context-rail`, …), the responsive frame table, "left to right", "focal" placement, sidebar/top-bar/hero/band/strip wording; phone navigation pattern.
- Visual "feel" references (Linear, Vercel).
- Withdrawn IDs: DP3, DP4, DP5, DP13, OD7, A7, PA2, A13, A14, P7-A7 (was P8-A7), FD02, Q6-4, Q6-5; 23 QA items and 6 host findings retired as visual.
- Renames: 22 sections and 19 contracts (tables in Phases 5 and 6); page "Modules" → Content requirements (since removed, below); "Responsive behavior" → Device needs; `tone` → `severity`.
- Status: 1.0.0 "Scheduled" rows → Specified with a planned sprint (no Sprint 1 start date yet); P01, S04, S06, S07 → Built.
- Self-audit against the tightened No Visual Prescription rule (screen content): Phase 4 "Content requirements" and "Actions" removed from all 35 pages and Phase 5 "Content model" and "Controls" removed from all 64 sections, with genuine requirements (security, permission, confirmation, truthfulness, accessibility rules; data shapes; primary information; section mapping) moved into the fields the seed defines; Phase 4 "Primary tasks" rewritten as user goals; Phase 5 Technical notes stripped of component files; Phase 3 §4 Content hierarchy and navigation notes reduced to structure and reachability; placement and container wording (shell, overlay, badge, chip, row, inline, dialog, toast, header) rewritten as behaviour in Phases 2–5, Phase 8 and the implementation prompt. No page, section, contract, flow, state or open decision removed.

### Removed

**Empty.** No feature was removed.

## Open product decisions

- **OD9 — Public page scope vs v1.** Side A (1.0.0, current spec): v1 is read-only; payments are Deferred; cards and treasury forecasting are non-goals; no invented figures on deployed pages. Side B (built page): presents payments with two-person approvals, cards with controls, multi-currency accounts, interest and sub-accounts, a 90-day forecast, automatic reconciliation and accounting sync, three priced plans, and labelled sample balances with a design-study disclosure. Option C: keep the page as a non-deployed design study. See [Phase 1](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is).
- **OD10 — Entry path.** Side A: owners self-register (P03), members sign in (P02), others join by invitation. Side B: "Open an account", "Book a demo" and "Sign in" all lead to an email enquiry that sends nothing. See [Phase 1](phase-1-product-vision.md#od10--entry-path-from-the-public-site).

## Version and date

2.0.0 · 2026-09-28 · merge over 1.0.0 (2026-09-26, commit `9565964`, 16 files). Generated from `docs/MASTER_PROMPT_COMPLETE.md` (9 phases + 6 ancillary = 15 files; Critical Rules › No Visual Prescription and Scope Preservation; Output Contract merge and manifest).
