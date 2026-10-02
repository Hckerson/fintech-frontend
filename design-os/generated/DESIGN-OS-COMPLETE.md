# Ledgerline Design OS — Complete

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [README](README.md) · Next: [Artifact index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [Executive summary](#executive-summary)
- [Deliverables](#deliverables)
- [Deliverable statistics](#deliverable-statistics)
- [How to use this document](#how-to-use-this-document)
- [Cross-references between phases](#cross-references-between-phases)
- [What is included and what is not](#what-is-included-and-what-is-not)
- [What changed in 2.1.0](#what-changed-in-210)
- [What changed in 2.0.0](#what-changed-in-200)
- [Open product decisions](#open-product-decisions)
- [Version and date](#version-and-date)

## Executive summary

You have a complete, interconnected specification of Ledgerline v1 — a read-only business banking console — in fifteen files: nine phases and six ancillary documents. It covers eight personas, twenty-five flows, thirty-five pages, sixty-four sections and sixty-eight interaction contracts, the frontend architecture that holds them, a sixteen-week plan with a single build-status register and seven release gates, and a numbered QA checklist of 396 checks with a gate from Built to Verified.

Version 2.0.0 was a **merge** over the 1.0.0 run. Nothing specified in 1.0.0 was removed. Visual prescriptions were dropped because the seed now forbids them; the owner's rebuilt home page was recorded as Built; and two open product decisions raised by that page — **OD9** (what the public page promises) and **OD10** (how visitors sign in and start) — are stated with both sides and left to the maintainer.

Version 2.1.0 is an **enterprise-grade audit** over 2.0.0. Limits now have one authority: [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) fixes every limit, timing and retention period, and [Phase 7 §10](phase-7-frontend-architecture.md#10-constants) names the constant for each. Every phase now specifies failure, denial, limits, concurrency, session expiry, audit and freshness for what it describes; Phase 8 has a definition of done, release gates and a go/no-go list; Phase 9 has 396 checks and 34 host findings. Nothing was removed, renamed or renumbered ([details](#what-changed-in-210)).

Status on 2026-10-01, from [Phase 8 › Summary](phase-8-implementation-roadmap.md#summary): 46 register rows Built, 9 In progress, 0 Scheduled, 148 Specified, 6 Deferred, 0 Verified, of 209.

## Deliverables

### Phases 1–9

| # | File | Summary |
|---|---|---|
| 1 | [phase-1-product-vision.md](phase-1-product-vision.md) | Why Ledgerline exists and for whom: personas R1–R8, JTBD, business rules BR1–BR20 (money as minor-unit strings, masked account numbers, invitation for non-owners, denial, time, freshness, audit trail, repeated and conflicting actions, the BR19 table of limits, failure and the support reference), the permission matrix, metrics and North Star, governance, product principles, non-goals, open decisions OD1–OD16. |
| 2 | [phase-2-experience-maps.md](phase-2-experience-maps.md) | Every journey as intent → journey → failures → recoveries → system behaviour → dependencies: F1–F7, D1–D7, X1–X11, each with role branches, timing, audit and testable completion criteria. |
| 3 | [phase-3-information-architecture.md](phase-3-information-architecture.md) | Two shells, sitemap and page index, role navigation, capability matrix with the enforcement point, denial and audit record per capability, taxonomy, labels, cross-links, search, the full ledger filter schema, SEO, breadcrumbs, empty and fallback routes with the exact response per situation, protected prefixes. |
| 4 | [phase-4-page-blueprints.md](phase-4-page-blueprints.md) | P01–P35 with purpose, objectives, primary tasks as user goals, data and its freshness, permissions and denial, device needs, states and the sections each page depends on; conventions for groups, segment files, composition, metadata, permissions, states and URL state by page; D1–D4 role variants. |
| 5 | [phase-5-section-blueprints.md](phase-5-section-blueprints.md) | S01–S64 with purpose, responsibilities, data, interaction, device needs, accessibility and four states; the section contract with its read and write rules (idempotent creation, no silent overwrite, no automatic retry, session expiry, offline); the ten built public-page sections. |
| 6 | [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md) | C01–C68 behaviour contracts: inputs, states, keyboard, ARIA, validation, loading, error, content rules, do/don't; 23 rules every contract inherits (single-flight and idempotency, focus destinations, unknown outcomes, expiry mid-action, offline, sensitive values). |
| 7 | [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md) | Folder and route structure, layouts and the guard matrix, providers, feature folders, hook inventory and query keys, utilities, the complete constants table and validated configuration, API flow with error taxonomy, timeouts, invalidation, pagination and idempotency, component layers, verification layers and the CI gate, libraries, splitting, performance, security (session, redirects, headers, throttling, tenant isolation), observability, templates. |
| 8 | [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md) | Eight sprints with entry criteria, a ten-point definition of done and exit statements, five milestones, backend, library and decision dependencies, risks R-1–R-20 with owners and contingencies, testing, deployment, seven release gates and the go/no-go list, the build-status register and the scope-preservation ledger. |
| 9 | [phase-9-qa-checklist.md](phase-9-qa-checklist.md) | Q-001–Q-396 across nineteen categories (373 active), the evidence rule, lab profile and seed tiers, host findings H-01–H-34, per-page state matrix, sign-off, Verified gate. |

### Ancillary documents (6)

| File | Summary |
|---|---|
| [START_HERE.md](START_HERE.md) | Entry point, what blocks work today, three-step workflow, quick reference. |
| [README.md](README.md) | Five-minute overview, roles, statistics, pending decisions. |
| [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) | This master index. |
| [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | Deep index per phase, reading orders, keywords, status roll-up. |
| [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Setup walkthrough before building: configuration, contract, constants, seed tiers, CI gate. |
| [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) | Build prompt synthesising all nine phases, including the Visual Design Hand-off, the engineering rules, the definition of done and the release gates. |

## Deliverable statistics

| Measure | Value |
|---|---|
| Files | 15 (9 phases + 6 ancillary) |
| Personas | 8 (R1–R8) |
| Primary flows · dashboards · supporting flows | 7 · 7 · 11 |
| Pages | 35 |
| Sections | 64 (54 from 1.0.0 + 10 built) |
| Interaction contracts | 68 (63 from 1.0.0 + 5 built) |
| Business rules | 20 (BR1–BR20; BR19 is the limits table) |
| Open decisions | OD1–OD16 (OD7 withdrawn; 15 active) |
| Assumptions (Phase 1) | A1–A28 |
| KPIs | K1–K16 |
| Library decisions | LD1–LD5: LD1 installed, LD2–LD5 awaiting approval |
| Backend modules | 4 exist, 2 partly published (accounts, cash flow), 28 required (9 of them cross-cutting requirements added in 2.1.0), 1 undecided (enquiry), 2 deferred |
| Sprints · weeks · milestones | 8 · 16 · 5 |
| Risks | 20 (R-1–R-20) |
| Release gates | 7, plus an 11-line go/no-go list |
| QA items | 396 numbered (Q-001–Q-396), 373 active, 23 retired (visual) |
| Host findings | 34 (H-01–H-34; 6 retired as visual) |
| Register rows (2026-10-01) | 209: 46 Built · 9 In progress · 0 Scheduled · 148 Specified · 6 Deferred · 0 Verified |

## How to use this document

Use it as the table of contents for the whole set. To find a thing by ID:

| ID prefix | Defined in | Status in |
|---|---|---|
| R (persona), BR, DP, K, SM, OD, A | [Phase 1](phase-1-product-vision.md) | — |
| F, D, X | [Phase 2](phase-2-experience-maps.md) | [Phase 8](phase-8-implementation-roadmap.md#build-status-register) |
| P | [Phase 3](phase-3-information-architecture.md#32-page-index) (route), [Phase 4](phase-4-page-blueprints.md) (blueprint) | Phase 8 |
| S | [Phase 5](phase-5-section-blueprints.md) | Phase 8 |
| C | [Phase 6](phase-6-interaction-contracts.md) | Phase 8 |
| LD, P7-A, constant names | [Phase 7](phase-7-frontend-architecture.md) | Phase 8 (FD13–FD17) |
| FD, M, R-, BE- | [Phase 8](phase-8-implementation-roadmap.md) | Phase 8 |
| Q, H | [Phase 9](phase-9-qa-checklist.md) | Phase 9 sign-off |

## Cross-references between phases

| From | To | What travels |
|---|---|---|
| Phase 1 | Phase 2 | personas, JTBD, rules, open decisions |
| Phase 1 | Phases 2–9 | BR19 limits: every other phase repeats a value from it or references it |
| Phase 2 | Phase 3 | entry points → navigation and routes |
| Phase 2 | Phase 5 | failure and recovery paths → section states |
| Phase 3 | Phase 4 | routes, groups, SEO, breadcrumbs, empty routes |
| Phase 3 | Phase 6 | labels, search, filter schema → C12, C38, C46–C48 |
| Phase 4 | Phase 5 | page dependencies → sections |
| Phase 5 | Phase 6 | "Contracts" per section → C IDs |
| Phases 4–6 | Phase 7 | pages → routes; sections → feature folders and hooks; contracts → component layers |
| Phases 2–7 | Phase 8 | every item → register row and sprint |
| Phase 7 | Phases 2–6, 8, 9 | constant names (§10), error kinds (§13.6), CI gate order (§14.2) |
| Phases 1–8 | Phase 9 | rules, states, contracts, budgets → checks |
| Phase 9 | Phase 8 | Built → Verified; host findings → risks R-12–R-20 and Sprint 1 fixes |
| All | IMPLEMENTATION_PROMPT | synthesis for building |

## What is included and what is not

**Included:** product scope and rules; one table of limits, expiry and retention; journeys; information architecture; page and section requirements; interaction behaviour; architecture; plan, status and release gates; QA; setup and build prompt; a record of the owner's home-page rebuild and the decisions it raises; a record of the defects found in the code that is already built.

**Not included:**

- **Visual design.** No colours, fonts, sizes, spacing, layouts, placement, imagery, animation, visual references or wireframes. Decided per page at build with the owner.
- Backend implementation (the backend team owns DTOs; this set lists required resources).
- Legal and compliance copy (OD1), pricing strategy (OD9), and any decision marked open.
- Installed dependencies: nothing is installed by this set.
- Code fixes: the audit records defects in the running app (H-01–H-34, R-12–R-20) and schedules them; it changes no code.
- Compliance claims: no rule, limit or gate here asserts conformance with any law, standard or certification.

## What changed in 2.1.0

An enterprise-grade audit of all nine phases on 2026-10-01, followed by a reconciliation so that the phases agree with one another. No ID was removed, renamed or renumbered, and no visual decision was added.

### One authority for every limit

Nine reviews had chosen different values for the same limits. [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) is now the single table of limits, timings, expiry and retention; [Phase 7 §10](phase-7-frontend-architecture.md#10-constants) owns the constant names; every other phase repeats the BR19 value or references it. The stricter value was kept for security limits and the majority value for capacity limits.

### What every phase now specifies

| Subject | The rule, in one line | Authority |
|---|---|---|
| Failure | Every failure carries a required reference the member can quote; one part failing never blanks the rest | BR20; Phase 7 §13.6, §23 |
| Denial | A page-level denial is the not-permitted state, never the error state; a record outside the member's scope answers like a missing one | BR13; Phase 3 §6 |
| Limits | A named constant per limit; at the limit the member is told the limit and what to do instead | BR19; Phase 7 §10 |
| Concurrency | Every write carries an idempotency key; a stale write is refused and the member keeps what they typed; nothing is last-write-wins | BR18; Phase 7 §13.10 |
| Session expiry | Re-authentication in place; an interrupted write is re-submitted by the member, never replayed; drafts live in the open tab's memory only | BR6, BR18; Phase 2 X4 |
| Offline | Loaded data stays readable with its age; writes are refused, never queued | BR20 |
| Audit | The backend records sensitive actions; the frontend guarantees none completes without the audited call | BR16; Phase 7 §22.5 |
| Freshness | Four tiers (`live`, `standard`, `slow`, `static`); a stale figure is labelled, never shown as current | BR15 |
| Time | Member-facing time in the workspace time zone; internal sections in UTC; posting dates never shifted | BR14 |
| Money | Minor-unit strings, no float arithmetic, never summed across currencies, pending never merged into posted | BR1, BR17 |

### Added

BR13–BR20; OD11–OD16; A11–A28; K15, K16; assumptions P2-A1–P2-A14, IA8–IA13, PA10–PA24, A16–A24 (Phase 5), A6-1–A6-15, P7-A9–P7-A21, P8-A1–P8-A4, P9-A1–P9-A9; Phase 8 sprint entry criteria, the definition of done, risks R-12–R-20, nine cross-cutting backend requirements (BE-request-reference, BE-idempotency, BE-versioning, BE-cursor, BE-step-up-marker, BE-throttling, BE-csv-safety, BE-key-rotation, BE-sign-out), seven release gates and the go/no-go list; Phase 9 checks Q-263–Q-396 and host findings H-26–H-34.

### Changed

- **Status re-read** from the repository on 2026-10-01 at commit `5b52c67`: Built 32 → 46, In progress 3 → 9, Specified 168 → 148. The home-page work recorded on 2026-09-28 is now committed.
- **Behaviour settled** where phases disagreed: no last-write-wins; no automatic replay of an interrupted write; no queued offline writes; account-number reveal for owner, finance and accountant only, re-masked after 30 seconds; alert rules per member for R1 and R2; export jobs visible to their requester and to R1 and R2; a support thread readable by its opener and the workspace's owners; a step-up grant valid for one purpose and never for money movement unless issued for it.
- **Ledger URL parameters** have one set, owned by Phase 3 §11.1: `from`, `to`, `type`, `direction`, `status`, `category`, `min`, `max`, `q`, `account`, `flagged`, `attachment`, `view`.
- **Backend today** corrected: accounts and cash flow are published, alongside auth, users, health and stats.
- **LD1** (`recharts`) recorded as installed, pending the owner confirming where its approval is recorded.
- **Phase 9** sharpened 57 existing checks with a threshold, a method and the evidence to keep, and re-checked H-01–H-25 against the current code.
- Job-based names (2026-10-02, Critical Rules › No Visual Prescription): fourteen Phase 5 section names that still named a container or control (form, list, feed, builder, title) now name the job, and the group "Shell & navigation" is "Navigation & orientation"; Phase 3 §2.1 and §2.3 headings say "route group" where they said "shell". IDs, behaviour, scope and status are unchanged and nothing was removed; every link and mention in Phases 2, 3, 4, 8 and 9 follows. Record: [Phase 5 name table](phase-5-section-blueprints.md#names-in-this-version).
- Link repair (2026-10-02): the implementation prompt's link to the interaction-contract bootstrap pointed at SETUP §8; it now points at §9, where that section lives.

### Removed

**Empty.** No feature was removed.

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

All fifteen active decisions are the maintainer's. Defaults apply when a decision is still open at the sprint that needs it; full text, consequence and cost of reversal are in [Phase 1 › Open decisions](phase-1-product-vision.md#open-decisions), and the sprint each blocks is in [Phase 8](phase-8-implementation-roadmap.md#open-decisions).

| ID | Decision | Default if unanswered | Needed by |
|---|---|---|---|
| OD1 | Jurisdiction, regulator and default currency | No default is safe for real customers; neutral onboarding fields, `en-GB` / `GBP` as code defaults only | Sprint 5 |
| OD2 | Session policy | 15 min idle, 12 h absolute, step-up valid 5 min for a single purpose | Sprint 2 |
| OD3 | Money movement scope | v1 read-only; F6 and F7 stay Deferred | Revisit trigger |
| OD4 | Feature folders `components/<feature>/` | Folders already in the repository stay as found | Sprint 1 |
| OD5 | Banking data source / partner | Backend seed only; no account presented as live bank data | Sprint 3 (backend) |
| OD6 | Two-step method | Passkeys with TOTP fallback; no SMS | Sprint 7 |
| OD7 | *Withdrawn in 2.0.0 (visual)* | — | — |
| OD8 | Library approvals LD1–LD5 | Nothing further installed; LD1 is installed | Sprint 1 |
| OD9 | Public page scope vs v1 | Side A is the specification; the built page is not deployed as the product site | Request Sprint 1; answer by Sprint 8 |
| OD10 | Entry path from the public site | Sign-in to P02, account opening to P03, demo request to the enquiry | Sprint 2 |
| OD11 | Account lifecycle mapping to the backend's `OPEN / FROZEN / CLOSED` | `active` = `OPEN`; `pending_verification` is a workspace state | Sprint 3 |
| OD12 | Who may read the audit record | R7 all; R6 case history; R5 by quoted reference; workspace members none in v1 | Sprint 6 |
| OD13 | Whether registration may say an email is already registered | Same neutral answer; the existing user is told by email | Sprint 2 |
| OD14 | Free-text `q` in the URL vs "nothing sensitive in URLs" | `q` is the single recorded exception; never logged or sent to analytics | Sprint 3 |
| OD15 | Journeys with no map | Out of v1 scope until the maintainer names them | Sprint 8 |
| OD16 | Build-status notes inside Phase 5 | Kept; Phase 8 is authoritative when they disagree | Sprint 1 |

The two with both sides stated in full:

- **OD9 — Public page scope vs v1.** Side A (1.0.0, current spec): v1 is read-only; payments are Deferred; cards and treasury forecasting are non-goals; no invented figures on deployed pages. Side B (built page): presents payments with two-person approvals, cards with controls, multi-currency accounts, interest and sub-accounts, a 90-day forecast, automatic reconciliation and accounting sync, three priced plans, and labelled sample balances with a design-study disclosure. Option C: keep the page as a non-deployed design study. See [Phase 1](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is).
- **OD10 — Entry path.** Side A: owners self-register (P03), members sign in (P02), others join by invitation. Side B, as recorded on 2026-09-28: "Open an account", "Book a demo" and "Sign in" all led to an email enquiry that sends nothing. Since then the public navigation leads to sign-in and registration; OD10 still has to confirm that path and decide the enquiry. See [Phase 1](phase-1-product-vision.md#od10--entry-path-from-the-public-site).

## Version and date

2.1.0 · 2026-10-01 · enterprise-grade audit over 2.0.0 (2026-09-28), which was a merge over 1.0.0 (2026-09-26, commit `9565964`, 16 files). Status read from the repository at commit `5b52c67`. Generated from `docs/MASTER_PROMPT_COMPLETE.md` (9 phases + 6 ancillary = 15 files; Critical Rules › No Visual Prescription and Scope Preservation; Output Contract merge and manifest).
