# Ledgerline Design OS — Start Here

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Next: [README](README.md) · [Index](ARTIFACT_INDEX.md) · [Phase 1 — Product Vision](phase-1-product-vision.md)

Welcome. This folder is the complete specification for **Ledgerline**, a read-only business banking console for small and mid-sized businesses. It says what the product does — who uses it, what they are trying to do, which pages and sections exist, how every control behaves, how the code is organised, in what order to build it, and how to check it. It deliberately says **nothing about how anything looks**. The look of each page is decided when that page is built, with the owner.

## Before anything else: two open decisions

The marketing home page in the working tree was rebuilt by the owner and presents more than v1 is specified to do (payments with approvals, cards, a treasury forecast, pricing and labelled sample balances), and it routes "Sign in" and "Open an account" to an enquiry form. These are recorded, not resolved:

- **[OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is)** — what the public page promises vs what v1 is.
- **[OD10](phase-1-product-vision.md#od10--entry-path-from-the-public-site)** — the entry path from the public site (register and sign in vs enquiry).

If you are the maintainer, answering these two unblocks the public page. If you are an engineer, do not change the home page to "fix" either side.

## What the design OS contains

- [x] **Phase 1** — Product vision: personas, rules, metrics, open decisions.
- [x] **Phase 2** — Experience maps: every journey, its failures and recoveries.
- [x] **Phase 3** — Information architecture: navigation, sitemap, permissions, labels, filters.
- [x] **Phase 4** — Page blueprints: 35 pages, what each must offer and in what priority.
- [x] **Phase 5** — Section blueprints: 64 sections, their content, data and states.
- [x] **Phase 6** — Interaction contracts: 68 behaviour contracts.
- [x] **Phase 7** — Frontend architecture: folders, routes, hooks, API, security, performance.
- [x] **Phase 8** — Implementation roadmap: sprints, risks and the only build-status register.
- [x] **Phase 9** — QA checklist: 262 numbered checks and the Verified gate.

## The files

| File | What it is for |
|---|---|
| [phase-1-product-vision.md](phase-1-product-vision.md) | Why Ledgerline exists, for whom, and the rules every later phase obeys |
| [phase-2-experience-maps.md](phase-2-experience-maps.md) | F1–F7, D1–D7, X1–X11 journeys |
| [phase-3-information-architecture.md](phase-3-information-architecture.md) | Navigation, routes, roles, labels, search, filters, SEO |
| [phase-4-page-blueprints.md](phase-4-page-blueprints.md) | P01–P35 content requirements and device needs |
| [phase-5-section-blueprints.md](phase-5-section-blueprints.md) | S01–S64 content, data, interaction and states |
| [phase-6-interaction-contracts.md](phase-6-interaction-contracts.md) | C01–C68 behaviour: states, keyboard, ARIA, validation |
| [phase-7-frontend-architecture.md](phase-7-frontend-architecture.md) | Where code goes and how data flows |
| [phase-8-implementation-roadmap.md](phase-8-implementation-roadmap.md) | Sprints, milestones, risks, build status |
| [phase-9-qa-checklist.md](phase-9-qa-checklist.md) | Pass/fail checks and the Built → Verified gate |
| [README.md](README.md) | Five-minute overview |
| [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) | Master index of deliverables |
| [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | Deep index, reading orders, status roll-up |
| [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Step-by-step setup before building |
| [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) | The prompt to paste into a build session |

## Three steps

1. **Read.** [Phase 1](phase-1-product-vision.md) (15 minutes), the [sitemap](phase-3-information-architecture.md#3-sitemap), and the page you are about to build in [Phase 4](phase-4-page-blueprints.md).
2. **Copy.** Open [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) and copy it whole into a new session.
3. **Execute.** Name the sprint or page. The session follows the prompt: it runs a visual concept for the page, shows it to the owner, and builds only after approval.

## Your next session

Paste [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) and add one line, for example:

> Build Sprint 1 — Foundations. Do not touch `app/page.tsx` or `components/ledgerline/`.

The prompt already carries the rules: host conventions win, no new dependency without approval, no hard-coding, every section has four states, and the **Visual Design Hand-off** (concept → owner approval → build → review before marking Built).

## Quick reference

| I want to… | Go to… |
|---|---|
| Understand the product in five minutes | [README.md](README.md) |
| See what is built today | [Phase 8 › Build status register](phase-8-implementation-roadmap.md#build-status-register) |
| Know what the home page is allowed to claim | [Phase 1 › OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is) |
| Find who can do what | [Phase 1 › Permission matrix](phase-1-product-vision.md#permission-matrix), [Phase 3 §6](phase-3-information-architecture.md#6-permissions) |
| See a journey step by step | [Phase 2](phase-2-experience-maps.md) |
| Find a page's route | [Phase 3 › Page index](phase-3-information-architecture.md#32-page-index) |
| Know what a page must show, in priority | [Phase 4](phase-4-page-blueprints.md) |
| Know a section's states and data | [Phase 5](phase-5-section-blueprints.md) |
| Know how a control behaves on keyboard | [Phase 6](phase-6-interaction-contracts.md) |
| Know where a file goes | [Phase 7 §3](phase-7-frontend-architecture.md#3-folder-structure) |
| Find a hook or endpoint | [Phase 7 §8](phase-7-frontend-architecture.md#8-hooks), [§13](phase-7-frontend-architecture.md#13-api-organization) |
| Plan the next sprint | [Phase 8 › Sprint breakdown](phase-8-implementation-roadmap.md#sprint-breakdown) |
| Check a feature before calling it Verified | [Phase 9 › Verified gate](phase-9-qa-checklist.md#verified-gate) |
| Decide how a page looks | Not here — see [IMPLEMENTATION_PROMPT › Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off) |
| Set up the environment | [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) |
| See what changed since 1.0.0 | [DESIGN-OS-COMPLETE › What changed](DESIGN-OS-COMPLETE.md#what-changed-in-200) |

## Key facts at a glance

| Fact | Value |
|---|---|
| Product | Ledgerline — read-only business banking console (v1) |
| Pages | 35 (P01–P35) |
| Sections | 64 (S01–S64) |
| Interaction contracts | 68 (C01–C68) |
| Flows | 7 primary, 7 dashboards, 11 supporting |
| Timeline | 16 weeks, 8 sprints, 5 milestones |
| QA items | 262 numbered (239 active) |
| Built today | P01 Home (working tree), P02 Sign in, X1 Sign in, 13 sections, 9 contracts, 6 foundations |
| Verified today | 0 |
| Open decisions | OD1–OD6, OD8, **OD9**, **OD10** (OD7 withdrawn as visual) |

## Ground rules in one screen

- The host `.claude/CLAUDE.md` wins over anything here.
- Nothing specified is ever deleted because it is not built; status lives only in [Phase 8](phase-8-implementation-roadmap.md).
- Money is integer minor units in a string, formatted only by C40 Amount.
- Every section renders loading, empty, error and populated states.
- No new package without the maintainer's approval (LD1–LD5 pending).
- Visual design is decided per page at build, with the owner — never from these files.

## Links

All files are local Markdown in `design-os/generated/`; none is published online. The seed prompt is [docs/MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md).
