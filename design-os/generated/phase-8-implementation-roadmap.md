# Ledgerline Design OS — Phase 8: Implementation Roadmap

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · register re-read and roadmap gates deepened 2026-10-01 at commit `5b52c67` · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
- Status was read from the repository on **2026-10-01** at commit `5b52c67` (branch `development`; the only uncommitted change is one line in `lib/ledgerline/constants.ts`). The home-page work that was uncommitted on 2026-09-28 is now committed. Where a document and the code disagree, the code wins and the difference is noted. Every Built or In progress row names the file that is its evidence.
- **Nothing is Verified.** Verified requires a recorded Phase 9 pass ([Verified gate](phase-9-qa-checklist.md#verified-gate)); none is recorded.
- **Specified vs Scheduled.** The sprint plan below is a proposal with relative sprints and no start date (the calendar waits on LD approvals and backend modules). Items therefore carry **Specified** with a *planned sprint*; they become **Scheduled** when Sprint 1 is given a start date. 1.0.0 marked them Scheduled; that change is recorded in the ledger.
- **Build order has left the sprint order.** The owner names pages one at a time, so items planned for Sprints 1, 2 and 8 (P34, P35, P03, P16, P28) were built before the Sprint 1 foundations they assume (S01–S03 layouts, protected prefixes, C57/C58). The planned-sprint column is kept as the dependency order, not as a record of when work happened; the consequences are R-12 and R-13.
- **What Built means here.** Built = a merged implementation that a merged page uses. It does not mean the item meets its whole blueprint: known gaps against the blueprint are listed in the row and must close before Verified. In progress = merged code covers only part of the item's variants or inputs, or has no consumer yet. A feature-local precursor of a shared contract (for example a help-only breadcrumb trail) leaves the contract Specified and is named in its row.
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

Each phase ends on a statement a tester can try as a signed-in member of the named role against the seeded backend. A phase whose statement cannot be demonstrated on the staging environment (see [Deployment readiness](#deployment-readiness)) is not complete, whatever its rows say.

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

Tie-break when two items compete for the same sprint: (1) anything that closes an S1 host finding or an access-control gap (FD06, H-14, H-16, H-17) outranks any feature; (2) an item whose backend module is published outranks one whose module is not; (3) an item that unblocks more register rows outranks one that unblocks fewer. An item built ahead of its planned sprint does not move its dependencies forward with it: the foundations it skipped stay owed and are listed in its row.

## Sprint breakdown

### Sprint gate

**Entry criteria (every sprint).** A sprint starts only when: (a) each backend module in its Backend line is either published in `lib/contract/` or has a dated commitment from the Backend lead; (b) each library it needs has a recorded decision (approved, or declined with the fallback in [Library decisions](#library-decisions) accepted); (c) each open decision it needs is answered, or its stated default is accepted in writing by the Product owner; (d) the previous sprint's exit is met or its miss is recorded under [Milestones](#milestones). A sprint entered with an unmet criterion records which one, and the item it blocks is not counted towards the exit.

**Definition of done (every item).** An item is done, and may be recorded Built, when all of these hold and a reviewer can check each from the pull request:

1. Gate commands pass on the merge commit: `pnpm lint` (all `starter/*` rules), `pnpm type-check`, `pnpm test`, and `pnpm contract:check` against a present `openapi.json` (a skipped check is a fail — see R-8).
2. Every section it adds shows each of its four states (loading, empty, error, populated) from real queries, with no frontend sample array standing in for product data.
3. For every interaction contract it touches, the keyboard path and the announcements listed in Phase 6 have been exercised by hand and the result recorded against the Phase 9 items that name the contract.
4. Money it renders comes from integer minor units as strings through C40's formatter; no arithmetic on floats; amounts in different currencies are never added together (Phase 9 category 16).
5. Role denial is tested for at least one role that must not see it: the denied member gets the outcome Phase 3 specifies, and the data is not in the response.
6. Nothing sensitive (full account numbers, tokens, personal data) appears in a URL, page title, client log or analytics event.
7. Session loss mid-task is handled as X4 specifies, or — until X4 is Built — the item records that it redirects to sign-in and what the member loses.
8. Copy, routes, durations and limits come from constants; no file exceeds the size limit; no new dependency without an approved LD entry.
9. The owner has approved the rendered page (visual hand-off).
10. Its register row is updated in this file in the same pull request, with the evidence path.

**Exit (every sprint).** Every item in the sprint's tables meets the definition of done, or is listed as carried over with its blocker; the sprint's own exit statements below pass on staging against the seeded backend; no S1 or S2 defect opened during the sprint remains open against a Built item.

### Sprint 1 — Foundations (weeks 1–2 · M1)

| Layer | Items |
|---|---|
| Foundations | FD03 colour-scheme preference wiring (only if offered), FD04 route groups (moving the built P01 and P02 without changing their content), FD06 protected prefixes + admin guard, FD11 host defect fixes, FD12 CI gate, FD13–FD17 library requests, FD18 decision requests OD9/OD10 |
| Pages | P34, P35; P02 defect fixes |
| Sections | S01, S02 (without C38/C39), S03, S54 |
| Contracts | C02–C10, C12–C14, C16–C18, C20, C27, C29, C32, C33, C35–C37, C54, C57–C59, C63; C01 and C34 defect fixes |
| Hooks | `use-me`, `use-workspace` (session fallback) |
| Backend | `GET /api/users/me` (exists) |

Entry: OD4 answered (it fixes where every section file lives); a start date recorded here, which moves planned rows to Scheduled.

Exit:

- Signed in as `USER`, a request to any `/admin/*` path returns the not-found outcome from both the proxy and the server layout; the admin data is not fetched.
- Signed out, a request to every `(app)` and `(admin)` prefix listed in Phase 3 redirects to sign-in with the original path preserved as `next`; a crafted `next` (`//host`, `/\host`, encoded variants) falls back to the default destination (Q-230, Q-231, Q-233).
- Every page title comes from constants through one title template; no starter or design-study copy remains in root metadata (Q-137, Q-249).
- Each S1 and S2 host finding in Phase 9 is closed or carries a signed exception; the FD11 row lists which.
- CI runs the FD12 gate order on every pull request — install with a frozen lockfile, type-check, lint, tests, `contract:check` with a present source, dependency audit, build — and a missing contract source fails the job; the end-to-end, accessibility and performance suites join the same job once LD4 is decided.
- LD1–LD5 and OD9/OD10 each have a dated request with the gap stated and a named decider.

### Sprint 2 — Auth and first real-data slice (weeks 3–4 · M2)

| Layer | Items |
|---|---|
| Pages | P03; P29, P30, P31 |
| Sections | S08 register variant; S48, S49, S50 |
| Contracts | C11, C15, C19, C21, C22, C23, C24, C25, C30 (LD1), C41, C45, C52, C53 (LD2), C55, C62 |
| Flows | X2, X3, X4, D7 |
| Backend | exists: register, stats, users; required: BE-step-up, BE-step-up-marker, BE-idempotency, BE-versioning, BE-throttling, BE-sign-out, BE-cursor (S49) |

Entry: Sprint 1 exit met; OD2 answered or its recommended default accepted; OD13 answered or its default accepted (it decides what registration says about an email already registered); LD2 and LD4 decided.

Exit:

- Registering with a new email ends signed in at onboarding (P07 once built; until then the destination and the gap are recorded in the P03 row); an email already registered (answered as OD13 decides — by default the same neutral answer as a new one, with the existing user told by email), a throttled request and an unavailable backend each produce their own message and keep what was typed, except the password.
- Sign-out is reachable from C37, ends the session in the browser and — once the backend publishes revoke — on the server (H-18); a second tab is signed out on its next request.
- The session-expiry warning appears before the idle limit OD2 sets, extending keeps the member's place, and expiry mid-form preserves what Phase 2 X4 says is preserved; a write interrupted by expiry or step-up is not replayed — the member re-submits it and no second record results (BE-idempotency); a different user re-authenticating finds none of the previous user's drafts. A draft is held in the open tab's memory only: nothing of it is in `localStorage`, `sessionStorage`, IndexedDB or a service-worker cache, and it is gone when the tab closes.
- P29–P31 render on seeded data in all four states; editing a user that another admin changed meanwhile produces the conflict outcome Phase 5 specifies rather than silently overwriting; a repeated submit does not create a second change.
- C53 and C30 are used only if LD2 and LD1 are approved; otherwise C15 and plain figures are used and the slip is recorded under Milestones.

### Sprint 3 — Accounts and ledger (weeks 5–6)

Pages P09, P10 · Sections S19–S23 · Contracts C31, C40, C42, C43, C44, C46, C47, C48, C51 · Flow F2 · Backend BE-accounts, BE-transactions, BE-ledger-summary, BE-saved-views.

Entry: OD5 answered; OD11 answered or its default mapping accepted (account states arrive as `OPEN / FROZEN / CLOSED`); OD14 answered or its default accepted (free-text `q` stays in the URL as the one recorded exception); BE-accounts and BE-transactions published in the contract with cursor pagination (BE-cursor); a seeded account of 5 million transactions exists on staging (A5); LD2 decided.

Exit:

- Every filter, the sort and the search term are in the URL; reloading or sharing the URL reproduces the same ledger for a member with the same access. The filter parameter set is Phase 3 §11.1's in full: `from`, `to`, `type`, `direction`, `status`, `category`, `min`, `max`, `q`, `account`, `flagged`, `attachment`, `view`. With no `from` and no `to` the ledger pages back by cursor without limit; a range longer than 731 days is refused only when both bounds are given.
- On the 5-million-row seeded account, scrolling and filter changes meet Phase 9 Q-049, Q-056 and the category 4 items; memory does not grow with rows scrolled past.
- C40 property tests pass: no float drift, sign convention, currency exponents 0/2/3, idempotent parse, invalid input rendered as unavailable and never as a number.
- Posted and pending are never merged into one figure; an account with zero transactions, one transaction and a partial page each show the specified state; totals across currencies are shown per currency.
- Revealing a full account number requires step-up, is recorded by the backend (BE-audit) and the number never enters the URL, the title or the clipboard unless the member copies it.
- A module the backend has not published renders C33/C32 against the real contract — never frontend mock arrays.

### Sprint 4 — Transactions (weeks 7–8 · M3)

Pages P11–P14 · Sections S24–S27 · Contracts C28, C38, C49, C60 · Flow F3 (counterparty leg Sprint 7).

Entry: Sprint 3 exit met; annotation and attachment endpoints published; BE-saved-views question answered (see [Open questions](#open-questions)).

Exit:

- ⌘K opens C38 from any `(app)` page and returns focus to where the member was when closed.
- The intercepted route and the full page render the same sections; closing the detail returns focus to the originating transaction; a direct link to a transaction the member may not see gives the not-found outcome without revealing that it exists.
- An annotation saved optimistically rolls back with a message when the save fails; two members changing the same transaction's category or flag get the conflict outcome Phase 5 specifies; an attachment over the size or type limit is rejected before upload with the limit stated.
- A saved view at the per-member limit states the limit and what to do next.

### Sprint 5 — Dashboard and documents (weeks 9–10)

Pages P08 (D1–D4), P17, P18 · Sections S13–S18, S30–S32 · Contract C26 · Flows F1, F4, D1–D4.

Entry: BE-cashflow, BE-statements, BE-exports and BE-csv-safety published; OD1 answered or neutral formats accepted; LD1 and LD3 decided.

Exit:

- Each of R1–R4 sees the dashboard composition Phase 2 assigns to that role through C59; a viewer's responses contain no export capability and no totals the role may not see (checked in the network response, not only on screen).
- Every balance states how old it is; a stale or failed section does not blank the others (Q-058).
- An export job polls only until a terminal state, survives a reload, is not duplicated by a repeated submit, and a request beyond the maximum date range is refused with the limit stated; an expired download link offers regeneration. A member sees their own export jobs; R1 and R2 also see every job in the workspace and R3 sees only their own (checked in the response, not only on screen).
- Statement periods use the workspace's time zone at month boundaries; the same statement downloaded twice is byte-identical.

### Sprint 6 — Verification and team (weeks 11–12 · M4)

Pages P07, P23, P24, P32, P33 · Sections S09–S12, S39–S41, S51–S53 (S42 read variant pulled forward) · Contract C50 · Flows F5, X6, D5, D6.

Entry: BE-verification, BE-compliance, BE-support, BE-audit, BE-workspaces published; OD1 answered or the neutral-field default accepted in writing; OD12 answered or its default accepted (who may read the audit record: R7 all, R6 case history, no workspace audit page in v1).

Exit:

- A verification case moves submitted → needs_info → submitted → approved across P07 and P32 with each transition recorded by the backend with its actor; progress entered before a session expiry is still there after signing back in.
- S41 and C59 read one permission matrix; changing a member's role takes effect on that member's next request; the last owner cannot be removed or demoted.
- An invitation that is expired, already accepted or revoked each gives its own outcome; inviting an existing member does not create a duplicate.
- Support lookup shows only what Phase 1 permits R5 to see, masks the rest, and every lookup is recorded.
- If OD1 is still open, onboarding collects the neutral field set only.

### Sprint 7 — Comms, settings and security (weeks 13–14)

Pages P04, P05, P06, P19, P20, P21, P22, P25 · Sections S08 (forgot/reset/verify), S33–S38, S42, S43 · Contract C39 · Flows X5, X7, X8, X9 (messages), F3 counterparty leg.

Entry: BE-password-reset, BE-two-step, BE-sessions, BE-notifications, BE-alert-rules, BE-threads, BE-counterparties published; OD6 answered.

Exit:

- A reset request gives the same response whether or not the email exists; an expired or already-used reset link offers a new one; a successful reset ends every other session.
- Two-step enrolment and challenge follow OD6; recovery when the second factor is lost follows the path Phase 2 X8 specifies.
- Revoking a session ends it on that device's next request; the member's own current session is identified and cannot be revoked by accident without confirmation.
- Notification counts agree between tabs after the next refresh interval; marking read twice is harmless.

### Sprint 8 — Insights, public and hardening (weeks 15–16 · M5)

Pages P15, P16, P28; P01 reconciliation per OD9/OD10 · Sections S05 (if OD9 = A), S28, S29, S46, S47; S55–S64 revised per OD9/OD10 · Flows X9 (help), X11 per OD10 · Hardening: full Phase 9 pass, E2E and axe (LD4), budgets.

Entry: OD9 and OD10 answered; OD15 answered or its default accepted (the journeys with no map stay out of v1 and are listed as such at the go/no-go); LD4 decided; BE-key-rotation published; every non-Deferred row Built or carrying a recorded blocker.

Exit:

- Every Built item has a recorded Phase 9 result for each item in its scope and moves to Verified, or stays Built with the failing item named.
- P01 states only approved, true claims, each with its review date (or is explicitly kept as a non-deployed design study, OD9 option C).
- Help articles describe only behaviour that is Built (Q-248); an article about an unbuilt feature is withheld from the published set, not deleted.
- The release gates in [Deployment readiness](#release-gates) are each passed or carry a signed exception.

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

Built ahead of plan (recorded 2026-10-01): P03 (planned 2), P16 with S29, C26 and C30 (planned 8, 5 and 2), P28 with S46 and S47 (planned 8), P34, P35 and S54 (planned 1). Foundations each still owes: P16 sits in `(app)` without the S01–S03 layout, outside the protected prefixes and without C57/C58; S46/S47 carry help-only precursors of C11, C29 and C32.

## Milestones

| ID | Name | End of | Definition of done | Acceptance statement (measurable) |
|---|---|---|---|---|
| M1 | Layouts & guards | Sprint 1 | Layouts with S01–S03; P34/P35; host defects closed; admin guard; LD and OD9/OD10 requests made. | 100% of `(app)` and `(admin)` prefixes redirect when signed out and 100% of `/admin/*` paths refuse `USER` (Q-230, Q-231); zero open S1 host findings; CI runs the FD12 gate order through `pnpm build` on every pull request; seven dated requests exist (LD1–LD5, OD9, OD10). |
| M2 | First real-data slice | Sprint 2 | P29–P31 on existing endpoints; P03; sign-out; session expiry. | P29–P31 pass their Phase 9 matrix rows for all four states on seeded data; X1–X4 each have a passing end-to-end run, or a recorded manual run if LD4 is not approved. |
| M3 | Ledger & transactions | Sprint 4 | F2, F3 (minus counterparty) on seed data; 5M-row budget met. | On the 5-million-row seeded account Q-049 (interaction ≤ 200 ms) and Q-056 pass; all C40 property tests pass; zero open defects in Phase 9 category 16. |
| M4 | Onboarding + team | Sprint 6 | F1, F4, F5, X6, D1–D6. | Each of F1, F4, F5 and X6 completes end to end as its owning role and is refused as one role that must not perform it; D1–D6 each render only what their role may see, checked in the response. |
| M5 | Release candidate | Sprint 8 | Every non-Deferred item Built; full Phase 9 pass; P01 reconciled with OD9/OD10. | 203 of 203 non-Deferred rows Verified or carrying a signed exception; zero open S1/S2; every release gate passed; go/no-go list complete and signed. |

A milestone is missed, not moved, when its definition of done is not met; the miss and blocker are recorded here.

Misses recorded: none — no milestone has a date until Sprint 1 has a start date. M1 is partly met by work done out of order (P34, P35, S54, the admin layout guard) and is **not** met: protected prefixes still cover `/dashboard` only, S01–S02 and the CI gate are unbuilt.

## Dependencies

Every dependency names who owes it and what happens if it slips. Roles are those used in [Phase 9 › Sign-off](phase-9-qa-checklist.md#sign-off). A slip is recorded here on the day it is known, with the rows it holds.

### Backend modules

Owner of every row: Backend lead. "First needed" is the planned sprint; the Consumers column is what is blocked. Common fallback for an unpublished module: its consumers render C33/C32 against the real contract and stay Specified — never a frontend mock (R-1).

| ID | Module | State | First needed | Consumers | If it slips |
|---|---|---|---|---|---|
| BE-auth | Register, login | Exists | Built | X1 X2 P02 P03 | — |
| BE-users | Users CRUD + me | Exists | 1 | S49 S50 S42 C37 | List is unpaged (Phase 5 Q3): S49 ships on C15 with a stated row cap until cursors exist |
| BE-stats | User stats | Exists | 2 | S48 | — |
| BE-health | Health | Exists | 1 | X10 | X10 cannot tell an outage from a page fault; one generic message |
| BE-step-up | Step-up re-auth | Required | 2 | X4 C42 C55 | Account-number reveal stays unavailable (never revealed without step-up); X4 warns and signs out only |
| BE-accounts | Accounts, balances | Partly published (`accountsFindAll` in `lib/contract/routes.ts`) | 3 | S14 S15 S19 S20 S29 | Balances per account available; anything needing per-account detail waits; M3 at risk |
| BE-transactions | Cursor list, detail, annotations, attachments; the list filters on the full Phase 3 §11.1 set, including `category` (comma list, at most 20), `direction` (`in` or `out`) and `attachment` (`yes`) | Required | 3 | S16 S17 S23–S26 | F2 and F3 cannot start; M3 missed; Sprints 3–4 swap with 6 if its modules are ready |
| BE-ledger-summary | Ledger summary | Required | 3 | S22 | S22 unavailable state; totals are never computed in the browser from a partial page |
| BE-saved-views | Saved views | Required (see open questions) | 3 | S21 S27 | Views limited to the shareable URL; P13 stays Specified |
| BE-cashflow | Cash-flow series | Partly published (`cashFlowSeries`, ranges 30d/90d/12m) | 5 | S18 S29 | S29 already consumes it; S18 waits on any range beyond the three published |
| BE-statements | Statements, PDF URL | Required | 5 | S30 | P17 stays Specified |
| BE-exports | Export jobs, download URL; a member's own jobs, and every job in the workspace for R1 and R2 (R3 only their own) | Required | 5 | S17 S31 S32 | F4 cannot complete; P18 stays Specified |
| BE-workspaces | Workspaces, memberships, invitations | Required | 6 (session fallback before) | C63 S01 S38–S40 | Single-workspace session fallback continues; role comes from the session only |
| BE-verification | Cases, document upload | Required | 5 read, 6 write | S09–S13 S17 | F5 cannot start; M4 missed |
| BE-compliance | Compliance side, decision | Required | 6 | S51 S52 | P32 stays Specified; cases cannot be approved in-product |
| BE-support | Support lookup | Required | 6 | S53 | P33 stays Specified |
| BE-audit | Audit log | Required | 6 | C42 S52 | No reveal and no decision ships without its audit record: both stay unavailable |
| BE-password-reset | Request/confirm | Required | 7 | P04 P05 | Sign-in keeps pointing members to help for a forgotten password (H-04 stays open) |
| BE-two-step | Enrol/verify | Required | 7 | P06 S43 | Two-step absent; recorded as a release-gate exception for the Security engineer to accept or refuse |
| BE-sessions | List/revoke | Required | 7 | S43 | Sign-out cannot end a session on the server (H-18 stays open) |
| BE-counterparties | Counterparties | Required | 7 | S33 | P19 stays Specified; F3 ends at the transaction |
| BE-notifications | List, count, mark read | Required | 7 | C39 S34 | No notification entry point |
| BE-alert-rules | Alert rules, per member (at most 20 each; R1 and R2 only; no shared workspace rule) | Required | 7 | S35 | S35 stays Specified |
| BE-threads | Messages; a thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1) only | Required | 7 | S36 S37 | Help leads to the support contact stated in the help copy only |
| BE-compare | Compare periods | Required | 8 | S28 | P15 stays Specified |
| BE-enquiry | Enquiry intake | Not decided (OD10) | 8 | S64 X11 | S64 keeps validating and sending nothing, and says so |
| BE-transfers, BE-payees | Money movement | Deferred (OD3) | — | S44 S45 | — |
| BE-request-reference | Request reference: the backend logs `REQUEST_ID_HEADER` on every request and echoes it as the same response header (Phase 7 §23, P7-A13) | Required | 1 | C33 S54 S53; Support readiness gate | A reference a member quotes finds no backend log line; the Support readiness gate cannot pass |
| BE-idempotency | Idempotency keys on every write, honoured for 24 hours: a repeated key returns the original result, the same key with a different body is a conflict (Phase 6 rule 10, Q6-10; Phase 7 §13.10) | Required | 2 | S50 S26 S31 S37 S40 S52 C49 C52 | Single-flight and a re-read are the only duplicate protection; the "repeated submit creates one record" exit statements cannot be shown and the rows stay Built, not Verified |
| BE-versioning | Version preconditions: every record more than one person can edit carries a version, and a stale write is refused with 409 (Phase 7 §13.10); alert rules (S35) are per member, so their version guards only that member's own stale tab | Required | 2 | S50 S26 S27 S35 S38 S39 S52 C52 | The affected edits stay Specified: nothing ships as last-write-wins |
| BE-cursor | Cursor contract of Phase 7 §13.9: opaque cursor, bounded `limit`, next and previous cursors, `asOf`, stable total order, a documented expired-cursor error, a count exact up to 10,000 | Required | 2 (S49), 3 (S23) | S23 S34 S49 C25 C53 | S49 ships on C15 with a stated row cap; S23 cannot start; M3 missed |
| BE-step-up-marker | A documented marker on every operation that demands step-up, and a grant held by the backend for 5 minutes. A grant is single purpose; a grant issued for any other purpose never authorises money movement; each transfer or payment confirmation asks for its own grant (Phase 7 §13.6, §22.1) | Required | 2 | X4 C55 C42 C52 | The frontend cannot tell a step-up demand from a refusal; reveal and the other sensitive operations stay unavailable |
| BE-throttling | Throttling and lockout values of Phase 7 §22.3 (sign-in and step-up: 5 failures in 15 minutes, then a 15-minute lock), each answering 429 with `Retry-After` | Required | 2 | X1 X4 X5 C34 C55 | No stated wait can be shown; the Security review gate cannot pass |
| BE-csv-safety | CSV formula neutralisation: cells that begin with a formula character are neutralised in every export, because counterparty text is untrusted (Phase 7 §17) | Required | 5 | S31 S32 | CSV export is withheld; F4 completes in the other formats only |
| BE-key-rotation | Key-rotation overlap: the new public key is published before it signs, and tokens signed by the previous key verify during the overlap (Phase 7 §22.5) | Required | 8 (before the first production release) | FD05 `proxy.ts` | A rotation signs every member out at once; it is handled as a planned outage and recorded as an Incident readiness exception |
| BE-sign-out | Sign-out invalidation: sign-out ends the session on the server, and a password reset or revoke-all ends the others (Q-229, H-18) | Required | 2 | X3 C37 S43 | A token stays valid until it expires after sign-out; H-18 stays open and the Security review gate cannot pass |

### Library decisions

Each needs approval (OD8); decider: Maintainer. LD1 is the only one installed (`recharts` in `package.json`) and is recorded as approved and installed, pending the owner confirming where the approval is recorded; the others are not installed.

| ID | Need | Recommendation | Needed by | State | If not approved |
|---|---|---|---|---|---|
| LD1 | Charts | `recharts` (alt. `@visx/*`) | Sprint 2 | Installed (`package.json`, used by `components/ui/chart-plot.tsx`) | — |
| LD2 | Table + virtualization | `@tanstack/react-table` + `@tanstack/react-virtual` | Sprint 2 | Not installed | S49 on C15; S23 misses the 5M budget; M3 missed |
| LD3 | Forms | `react-hook-form` + `@hookform/resolvers` | Sprint 5 | Not installed | `useState` + Zod; migration recorded as debt |
| LD4 | Testing | Testing Library, jsdom, Playwright, axe | Sprint 2 | Not installed | Browser-based checks cannot pass automatically; the manual step is the check of record (Verified gate, item 3) |
| LD5 | Positioning | native popover + anchor positioning; `@floating-ui/react` if needed | Sprint 1 | Not installed | Native path |

### Open decisions

Owner of every row: Product owner, deciding with the co-signer named. "Default if unanswered" is what the build does at the needed-by date; it is a holding position, not a decision.

| ID | Decision | Blocks | Needed by | Co-decides | Default if unanswered |
|---|---|---|---|---|---|
| OD1 | Jurisdiction, currency | S10 S11 P17 format; public page currency claims | Sprint 5 | Compliance reviewer | Neutral onboarding fields; `en-GB` / `GBP` remain code defaults (`lib/constants.ts`) and are not presented as a jurisdiction claim |
| OD2 | Session policy | X4 C55 | Sprint 2 | Security engineer | The Phase 1 recommendation (15 min idle, 12 h absolute, step-up for reveals); today the cookie lives 7 days |
| OD3 | Money movement | F6 F7 P26 P27 S44 S45 | revisit trigger | Compliance reviewer | Stay Deferred |
| OD4 | Feature folders | every section file | Sprint 1 | Frontend lead | The layout already in the repository (`components/<feature>/`, `lib/data/<feature>/`) |
| OD5 | Banking data source | BE-accounts BE-transactions | Sprint 3 (backend) | Backend lead | Backend seed only; no account is presented as live bank data |
| OD6 | Two-step method | P06 S43 | Sprint 7 | Security engineer | P06 stays Specified; release gate exception required |
| OD7 | *Withdrawn (visual)* | — | — | — | — |
| OD8 | LD1–LD5 | see above | Sprint 1 | Maintainer | Fallback column above |
| OD9 | Public page scope vs v1 | production copy of P01 (S55–S64, S04–S07); R-10 rename | Sprint 1 request, Sprint 8 at latest | Compliance reviewer | P01 keeps its design-study disclosures and is not deployed as the product's site |
| OD10 | Entry path | P01 → P02/P03 links; S64 intake | Sprint 2 (P03 reachability) | Product owner alone | The path now in code: the public navigation leads to sign-in and registration (`lib/data/ledgerline/brand.ts`); S64 sends nothing |
| OD11 | Account lifecycle mapping between the spec states and the backend's `OPEN / FROZEN / CLOSED` | S19 S20 C12 C43; BE-accounts | Sprint 3 | Backend lead | `active` = `OPEN`; `pending_verification` is a workspace state, not an account state |
| OD12 | Who may read the audit record | BE-audit, S53, the Data-handling review | Sprint 6 | Compliance reviewer | R7 reads all; R6 reads case history; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 (no workspace audit page) but may ask support for entries about their own workspace |
| OD13 | Whether registration may say an email is already registered | P03 X2 (Built; the answer may change its behaviour) | Sprint 2 | Security engineer | Registration gives the same neutral answer and the existing user is told by email |
| OD14 | Free-text `q` in the URL versus "nothing sensitive in URLs" | S21 C46 C11; the Data-handling review | Sprint 3 | Security engineer | `q` is the single recorded exception; never logged or sent to analytics |
| OD15 | Journeys with no map (invitee acceptance, workspace audit trail, reporting an unrecognised transaction, lost second factor, ownership transfer and closure, data access or erasure request, incident communication, a second workspace) | M5 scope statement; go/no-go line 11 | Sprint 8 | Compliance reviewer | Out of v1 scope until the maintainer names them; recorded so they are not forgotten |
| OD16 | Build-status notes inside Phase 5 technical notes | the rule that status lives only in this file | Sprint 1 | Frontend lead | Kept until the maintainer decides; this register is authoritative when they disagree |

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

Score = likelihood × impact (1–3). ≥ 6 has a Sprint 1 owner action. Reviewed at every sprint exit; a risk whose early-warning signal has fired is re-scored that day.

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
| **R-11** | No route from the home page to sign-in or registration (OD10) | 1 | 2 | 2 | Members cannot find sign-in; owners cannot register from the site | Re-scored 2026-10-01 from 3 × 2: the public navigation now leads to sign-in and registration (`lib/data/ledgerline/brand.ts`, `components/ledgerline/ledger-nav.tsx`). OD10 still has to confirm this path and decide S64 |
| **R-12** | A signed-in route outside the protected prefixes (added 2026-10-01) | 3 | 3 | 9 | A signed-out visitor reaches `/insights/runway` and sees a load failure instead of being sent to sign-in; every future `(app)` page repeats the gap until the prefix list is derived from the route group | FD06 in Sprint 1 before any further `(app)` page: protect every `(app)` and `(admin)` prefix in `proxy.ts`, and add a test that fails when a route under those groups is not covered |
| **R-13** | Pages built ahead of their foundations (added 2026-10-01) | 3 | 2 | 6 | Members meet pages that behave differently from one another: no shared navigation, their own loading and error handling, feature-local search and breadcrumbs | Each such row lists what it still owes; promote a precursor to its contract on second use (C11, C29, C32, C04); no page moves to Verified until its owed foundations are Built |
| **R-14** | Open redirect after sign-in: `lib/utils/internal-path.ts` refuses `//host` but accepts `/\host` (added 2026-10-01 audit) | 2 | 3 | 6 | A member who follows a crafted sign-in link lands on another site that can imitate Ledgerline and ask for their credentials | FD11 in Sprint 1: bring `internalPath` to the full rule of Phase 7 §22.2 (`/\`, encoded forms, control characters, length, same origin), with a test case per refused form (Q-233, Q-234) |
| **R-15** | Query keys without the workspace: `lib/hooks/use-accounts.ts` uses `["accounts"]` and `lib/hooks/use-cash-flow.ts` has no workspace ID either (added 2026-10-01 audit) | 2 | 3 | 6 | After a workspace switch, or a second user signing in on the same tab, the previous workspace's balances can be shown as the current one's | Build `lib/hooks/query-keys.ts` and move both hooks onto it before C36 or any second workspace exists; the key-factory unit test of Phase 7 §14.2; Q-044 |
| **R-16** | `lib/api-server.ts` sets no timeout and no request reference (added 2026-10-01 audit) | 3 | 2 | 6 | A slow backend leaves a page waiting with no end, and a failure carries nothing the member can quote to support | Add `BACKEND_TIMEOUT_MS` and `REQUEST_ID_HEADER` to `backendFetch` in Sprint 1 (FD11), with BE-request-reference on the backend side |
| **R-17** | `next.config.ts` sets no security headers (added 2026-10-01 audit; host finding H-17) | 3 | 2 | 6 | Signed-in pages can be framed by another site, and nothing restricts where scripts load from | The header set and Content-Security-Policy of Phase 7 §22.2 in Sprint 1 (FD11); header assertions in the gate (Q-235) |
| **R-18** | `proxy.ts` drops the query string from `next` and makes no admin check (added 2026-10-01 audit; H-14) | 3 | 2 | 6 | A member signed out while filtering returns to an unfiltered page; a signed-in non-admin's request to an admin path is stopped only by the layout | FD06 in Sprint 1: write `next` from path and query; repeat the platform-role check in the proxy; proxy tests for both |
| **R-19** | Help articles describe features that are not built (added 2026-10-01 audit) | 3 | 2 | 6 | A member follows an article to a page or action that does not exist, and trusts the rest of the help less | Q-248 at every sprint exit: an article about an unbuilt feature is withheld from the published set, not deleted; the Content truthfulness gate |
| **R-20** | Code defaults are `en-GB` / `GBP` while specification examples use dollars and US date order (added 2026-10-01 audit; OD1) | 2 | 2 | 4 | Amounts and dates on a built page do not match the documents a reviewer checks them against; a member in another market sees unfamiliar formats | Keep one locale and currency source (`DEFAULT_LOCALE`, `DEFAULT_CURRENCY`); treat specification examples as illustrative until OD1 is answered; Phase 9 checks formats against the constants, not the examples |

Ownership and response:

| # | Owner | Early-warning signal | Contingency if it happens |
|---|---|---|---|
| R-1 | Backend lead | A module in the next sprint's Backend line has no DTO in `openapi.json` one week before sprint entry | Swap the sprint with the next one whose modules are published; the blocked rows stay Specified and M3/M4 are recorded missed |
| R-2 | Maintainer | A request older than one sprint without a decision | Take the fallback in [Library decisions](#library-decisions); record the migration as debt with the rows it touches |
| R-3 | Frontend lead | Q-049 or Q-056 fails on the 100k-row seed in the first week of Sprint 3 | Narrow the default date range and require a filter before very large accounts load; record the limit as a product decision for the Product owner |
| R-4 | Accessibility champion | Any category 1 or 15 item fails on a page already Built | The page returns from Verified to Built (Verified gate, item 9); the fix outranks new features |
| R-5 | Security engineer | Sprint 2 entry reached with OD2 open | Build to the recommended default; a later change is a constants change only (`SESSION_MAX_AGE` and the idle limits) |
| R-6 | Product owner | A pull request adds a control that initiates a payment, or copy that promises one, before OD3 | Reject at review; if merged, revert rather than hide behind a flag |
| R-7 | Compliance reviewer | Sprint 5 entry reached with OD1 open | Ship neutral fields; jurisdiction-specific fields arrive as an additive change, existing cases are not invalidated |
| R-8 | Frontend lead | CI log contains "contract check skipped" | Treat the release as unverified against the contract: block promotion until a run with a present source passes |
| R-9 | Frontend lead | Fewer than half of Sprint 1's contracts merged at the mid-sprint point | Slide primitives not needed by S01–S03/S54 into Sprint 2; guards, CI and host S1 fixes do not slide |
| R-10 | Product owner | Any plan to point a public domain at the build while OD9 is open | Deploy with P01 replaced by a route to sign-in, or do not deploy; Compliance reviewer signs the exception either way |
| R-11 | Product owner | OD10 answered with a different entry path | Change the two route constants the navigation reads; no page change needed |
| R-12 | Security engineer | A new directory appears under `app/(app)/` without a matching protected prefix | Stop the release: this is a go/no-go item, not a defect to schedule |
| R-13 | Frontend lead | A second feature-local copy of the same pattern (a third breadcrumb or search implementation) | Freeze new pages until the shared contract is built and both callers use it |
| R-14 | Security engineer | The `internalPath` test file has no case for `/\host` or an encoded form; any pull request that reads `next` without `internalPath` | Stop the release (a go/no-go item); until fixed, ignore `next` and always send the member to the default destination |
| R-15 | Frontend lead | An array literal passed as `queryKey` outside `query-keys.ts`; a workspace switcher or second membership merged while either hook is unchanged | Clear the cache and reload the page on every workspace switch and sign-in until both keys carry the workspace ID |
| R-16 | Frontend lead (co-owner: Backend lead for the echo) | A page that stays in its loading state beyond `BACKEND_TIMEOUT_MS` on staging; an error state shown without a reference | Treat the affected page as failing X10 and hold it at Built; Support readiness gate cannot pass |
| R-17 | Security engineer | The header assertion (Q-235) fails or is absent from the gate | No production promotion; headers may be set at the hosting layer as a signed, dated exception while the code change lands |
| R-18 | Security engineer | A proxy test for a non-admin on `/admin` is missing or fails; a redirect to sign-in whose `next` has no query | The `(admin)` layout guard remains the control and no admin page merges without it; the lost filter is recorded as an S3 defect |
| R-19 | Product owner | An article in `lib/data/help/` names a page or action whose register row is Specified | Withhold the article from the published set and say in the help index that more articles are coming |
| R-20 | Product owner (co-owner: Compliance reviewer, OD1) | A Phase 9 format check fails because the expectation was copied from a specification example | Record the expectation against the constants; if OD1 answers with another locale or currency, change the two constants and re-run category 16 |

## Technical debt prevention

Every guard names the mechanism that enforces it and where a violation is caught. "Gate" = the gate commands (lint, type-check, test, `contract:check`; the full order, with install, audit, build and the browser suites, is in the FD12 row) run by hand today and by CI once FD12 lands; git hooks are disabled, so until FD12 the gate is the reviewer running the commands on the merge commit and saying so in the pull request.

| Guard | Mechanism | Caught at | State |
|---|---|---|---|
| Density register | `starter/application-register-density` | Gate (lint error) | Built (off for public page files) |
| One component per file | `starter/one-component-per-file` | Gate (lint error) | Built |
| Pages compose only | `starter/page-composes-only` | Gate (lint error) | Built |
| Types in `lib/types/` | `starter/domain-types-in-lib` | Gate (lint error) | Built |
| API boundary | `starter/api-access-boundary` + `no-restricted-imports` | Gate (lint error) | Built |
| No comments | `starter/no-comments` (TypeScript only; stylesheets unchecked — H-20) | Gate (lint error) | Built |
| Transport calls in components | `extract-transport-to-hook` codemod (dry run by default; skips and reports when it would have to guess) | Run after the API-boundary rule reports | Built (FD09) |
| Contract drift | `pnpm contract:check` (default source `../backend/openapi.json`) | Gate; exits 0 when the source is missing, so the reviewer must confirm the source was present (R-8) | Built; CI wiring Specified (FD12) |
| File size | `max-lines` 150 | Gate (lint error) | Built |
| Promote on second use | Review rule: the pull request that adds a second copy must extract it; early-warning signal in R-13 | Pull-request review; Phase 9 category 13 at the Verified gate | Review |
| Constants | Review rule; Phase 9 Q-057 (query timings) and Q-137 (metadata) check named cases by grep. Known breaches: `staleTime` literal in `components/providers/provider.tsx` (H-23); root metadata literals in `app/layout.tsx` | Pull-request review; Verified gate | Review |
| Scope preservation | No spec item deleted for being unbuilt; this register's totals must still add to 209 after every edit | Pull-request review of this file; ledger below | Review |
| Dependency approval | No package without an approved LD entry; the `package.json` diff is read in every pull request against the Library decisions table | Pull-request review | Review |
| Status accuracy | A row changes status only in the pull request that changes the code, with the evidence path; the register is re-read against the repository at every sprint exit | Pull-request review; sprint exit | Review |
| Token-first class names | rule removed by the owner in the working tree | — | Not a design OS concern (styling) |

Proposed rules (each with a colocated `.test.ts`): reject `parseFloat`/`Number(` on minor-unit strings in `components/` (Sprint 3); flat-config import restrictions for `components/ui/**` and sibling feature folders; a test over the `app/` tree that fails when a route under `(app)` or `(admin)` has no protected prefix (Sprint 1, R-12).

Debt accepted knowingly is recorded where it was accepted (the register row or the library fallback), with the item that repays it. Debt with no repaying item is a defect, not debt.

## Testing strategy

Each layer states what a pass proves, what it must cover and the gate it sits behind. "Merge gate" = runs on every pull request once FD12 lands (by hand until then); "sprint gate" = must pass at sprint exit; "release gate" = must pass before promotion to production.

| Level | Tool | State | Scope | What a pass proves | Coverage expectation | Gate | First sprint |
|---|---|---|---|---|---|---|---|
| Unit | vitest | running (22 test files; not in CI) | utils, constants, proxy, route handlers, server actions | A pure function or handler returns the specified result for normal, boundary and refused input | Every file in `lib/utils/` and every route handler and server action has a test; each upstream status a handler maps (400, 401, 409, 429, 5xx, network failure) has a case | Merge | continuous |
| Property | fast-check | running for money, runway and the codemod | money, runway, cursor merge, onboarding progress | An invariant holds for generated input, not just chosen examples | The invariants listed below for money; cursor merge never duplicates or drops a row; progress never exceeds complete | Merge | 3 |
| Contract | `contract:check` + generator tests | running locally; CI pending | schemas vs `openapi.json` | The generated contract equals what the backend publishes; a DTO change breaks type-check at every consumer | 100% of published operations; zero skipped runs at a sprint or release gate | Merge (must run with a present source) | 1 |
| Lint-rule | vitest + RuleTester | running | every custom rule and codemod | Each rule reports its violations and passes its allowed cases | Every rule in `tools/eslint/rules/` and every codemod has a colocated test with valid and invalid cases | Merge | continuous |
| Component | Testing Library + jsdom | pending LD4 | four states per section; contract keyboard behaviour (Phase 6) | A section renders exactly one of its four states for a given query result, and a contract honours its keyboard and announcement rules | Every section: four states; every contract: each key in its Keyboard field | Sprint | 2 |
| End-to-end | Playwright | pending LD4 | F1–F5, X1–X11 happy and recovery paths | A member of the owning role completes the flow against the seeded backend, and a member of a refused role cannot | Per flow: one success, one recovery from failure (timeout or 5xx), one session expiry mid-flow, one denial | Sprint for the flows the sprint builds; release for all | 2 (X1, X2), full 8 |
| Accessibility | axe via Playwright + manual SR | pending LD4 | every page | No automatically detectable WCAG 2.2 AA failure, and the manual screen-reader pairs in Phase 9 read each page's states as specified | Every page in every state it has; zero serious or critical findings; manual run recorded per page | Sprint; release | 2 onward |
| Performance | Playwright trace on seed | pending LD4 | S23 5M rows; P08 first render; P01 first-load JS | Phase 9 category 5 budgets hold on the reference device and seed | Q-048–Q-051 and Q-056 on P02, P08, P10; 5-million-row account for S23 | Sprint 3 exit; release | 3 |
| Security | manual sweep + vitest on proxy and guards | proxy tests running | every route prefix, the admin guard, the post-sign-in destination, response headers | A signed-out or under-privileged request cannot reach protected data | Phase 9 category 17 in full; every prefix under `(app)` and `(admin)` | Sprint 1 exit; release | 1 |

Money property tests (C40): no float drift; sign convention; exponents 0/2/3; idempotent parse; `returned`/`failed` carry problem severity and ordinary debits never do; amounts in different currencies are never combined; an unparseable amount yields the unavailable state.

Test data: only the backend seed and generated values (A5). No test, fixture, screenshot or trace contains data about a real person or a real account; traces and screenshots attached as Phase 9 evidence are checked for this before they are stored.

While LD4 is undecided the manual step in each Phase 9 item is the check of record; a row may reach Verified on recorded manual evidence, and is re-run automatically once LD4 is approved.

## Deployment readiness

| Area | Today (2026-10-01) | Required before M5 |
|---|---|---|
| CI | lint + build on pushes to `master`/`main` and on pull requests (`.github/workflows/ci.yml`); no type-check, tests or contract check | the FD12 gate in the order of Phase 7 §14.2: `pnpm install --frozen-lockfile` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm contract:check` with a real source that fails when absent → `pnpm audit --prod` → `pnpm build` → end-to-end, accessibility and performance suites; run on `development` |
| Git hooks | disabled (`prepare` unsets `core.hooksPath`) | CI is the gate |
| Environment | `NEXT_PUBLIC_API_URL` (falls back to `http://localhost:5000`), `JWT_PUBLIC_KEY` | refuse to start without `JWT_PUBLIC_KEY`; no localhost fallback outside local development |
| Metadata | `app/layout.tsx` carries a literal Ledgerline title and a design-study description; no title template; pages set their own titles from copy data | titles from `PAGE_TITLES` through one template; `robots.ts`, `sitemap.ts`; no sensitive value in any title |
| Error surfaces | `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/(marketing)/error.tsx` exist; the error page shows a quotable reference when the framework supplies one | segment boundaries for `(app)`, `(auth)` and `(admin)`; C58 per section |
| Security headers, session policy | 7-day cookie (`httpOnly`, `sameSite=lax`, `secure` in production); no response headers configured (`next.config.ts` is empty) | OD2; headers (H-17, Q-235) |
| Route protection | proxy protects `/dashboard` only; `(admin)` layout refuses non-admins; `/insights/runway` is unprotected | every `(app)` and `(admin)` prefix protected (FD06, R-12) |
| Public page | design-study disclosures present | OD9/OD10 answered before deploying as the product site |
| Release | — | M5 exit met; non-Deferred rows Verified |

### Environments

No hosting platform or deployed environment is recorded in the repository; choosing one is an open question below. The roadmap requires four, whatever hosts them (P8-A1):

| Environment | Purpose | Data | Who may reach it |
|---|---|---|---|
| Local | Development | Backend seed on the developer's machine | The developer |
| Preview | One per pull request, for owner visual approval and Phase 9 manual checks | Staging backend, seed data only | Team only; not indexable |
| Staging | Sprint and release gates; the 5-million-row seed | Seed data only; never a copy of production | Team only; not indexable |
| Production | Members | Live | Public for P01–P06 and P28 as OD9/OD10 allow; everything else behind sign-in |

No environment other than production ever holds real member or account data.

### Configuration checks

Checked at start-up or build, failing loudly rather than degrading:

- `JWT_PUBLIC_KEY` present and parseable; a missing key refuses to start instead of treating every visitor as signed out.
- `NEXT_PUBLIC_API_URL` set explicitly and using HTTPS in staging and production; the localhost fallback applies to local development only.
- The frontend's generated contract matches the `openapi.json` of the backend build it will talk to (`contract:check` against that build's document).
- Session cookie flags as specified (`httpOnly`, `secure`, `sameSite`) and lifetime from the OD2 constants.
- Response headers present on a signed-out page and a signed-in page (Q-235).
- Non-production environments are not indexable and state that their data is sample data.
- No secret is exposed to the browser: only variables intended to be public carry the public prefix.

### Rollout and rollback

- **Promotion.** The build promoted to production is the same build that passed the release gate on staging; nothing is rebuilt from a different commit.
- **Compatibility.** A frontend release must work against the backend contract in production at that moment and against the one before it, so that either side can be rolled back alone. A backend change that removes or renames a field ships only after no deployed frontend reads it.
- **Order.** Additive backend change first, then frontend; removal last.
- **Rollback.** Re-promote the previous build; it must be possible without a new build and within 15 minutes of the decision (P8-A2). A rollback never changes data: v1 is read-only apart from annotations, saved views, settings, team and verification, and none of those changes shape in a frontend release.
- **Rollback triggers.** Any one of: sign-in success rate falls below its pre-release level by more than the agreed margin; any signed-in page fails for every member; a money value is shown wrongly (any confirmed case — there is no tolerance); a member sees data from a workspace they do not belong to (any confirmed case); the error rate for page loads exceeds 2% over 15 minutes (P8-A3).
- **Sessions across a release.** Members signed in before a release remain signed in; a tab left open from the previous build recovers on its next navigation without losing a typed form where X4 says it is preserved.

### Monitoring after release

Nothing is instrumented today, and adding a monitoring or error-reporting service is a dependency decision (OD8) and a data-handling decision (it must receive no account number, token or personal data). Until it is decided, the release gate below cannot pass. What must be observable, by whatever means is approved:

- sign-in, registration and step-up: success, refusal and failure counts, separately;
- page-load failures by route, each carrying the reference the member is shown, so Support can find the failure from what the member quotes;
- contract mismatches: a backend response that fails its Zod schema is counted and reported, never silently rendered;
- the Phase 9 category 5 measures from real sessions (Q-048 names this);
- backend health as seen by X10.

Watch period: the Frontend lead and the Backend lead watch these for the first hour after each production release and again at the next working morning (P8-A4); the release is closed, or rolled back, in writing.

### Release gates

Ledgerline shows regulated financial and personal data. These are gates the roadmap requires before production; none has been run, and passing one is a recorded review by the named role, not a certification.

| Gate | Signed by | Passes when | Evidence |
|---|---|---|---|
| Security review | Security engineer (co-signs: Backend lead) | Phase 9 category 17 passes in full; every S1 host finding closed; route protection and the admin guard verified signed-out and as each role; session policy matches OD2; headers present; dependencies reviewed for known vulnerabilities; no secret in the client bundle | Phase 9 results; the review note with date and commit |
| Accessibility review | Accessibility champion (co-signs: QA lead) | Phase 9 categories 1 and 15 pass on every non-Deferred page in every state, with the manual screen-reader pairs recorded | Phase 9 results per page |
| Data-handling review | Compliance reviewer (co-signs: Security engineer, Backend lead) | For each kind of personal and financial data the product shows: where it is displayed, masked, exported, logged and retained is written down and matches Phase 1 (BR16, BR19); nothing sensitive in URLs, titles, logs, analytics or monitoring; non-production holds seed data only; OD1 and OD5 answered | The written data map; Phase 9 categories 16 and 17 |
| Content truthfulness review | Product owner (co-signs: Compliance reviewer) | Phase 9 categories 18 and 19 pass; OD9 answered; every public claim has a review date; help articles describe only Built behaviour | Phase 9 results; the claim list |
| Incident readiness | Backend lead (co-signs: Frontend lead, Security engineer) | A written procedure names who is contacted, how severity is set, who may decide a rollback, how members are told, and who decides whether an incident involving personal or financial data needs escalation to the Compliance reviewer; the rollback has been rehearsed once on staging | The procedure; the rehearsal record |
| Support readiness | Product owner (co-signs: QA lead) | Support can find a failure from the reference a member quotes; R5's lookup (P33) or its stated fallback works; help articles are reviewed for the release; the support contact in help copy is real and staffed | A recorded dry run from a quoted reference to its cause |
| Performance review | Frontend lead (co-signs: Backend lead) | Phase 9 categories 4 and 5 pass on staging at the scale target | Traces from the seeded account |

A gate that cannot pass may be released only on a written exception signed by the gate's signer and the Product owner, naming the risk accepted and the date it is revisited. Security review and data-handling review admit no exception for a confirmed exposure of one member's data to another.

### Go/no-go list

Go requires every line true on the release commit, read out and recorded by the Product owner:

1. All non-Deferred register rows are Verified or carry a signed exception; the summary adds to 209.
2. No open S1 or S2 defect; open S3 defects are listed and accepted.
3. All seven release gates passed or excepted in writing.
4. Gate commands pass on the release commit, and `contract:check` ran against the backend build being released against.
5. Every route under `(app)` and `(admin)` is protected (R-12), and R-14 to R-18 are closed.
6. OD1, OD2, OD5, OD9 and OD10 are answered; OD11 to OD16 are answered or their defaults accepted in writing; no page is built on a default that was never accepted.
7. Configuration checks pass on production configuration.
8. The previous build is available for re-promotion and the rollback was rehearsed.
9. Monitoring shows data from staging for each item under Monitoring after release.
10. The watch-period owners are named and available.
11. No Deferred feature (F6, F7, P26, P27, S44, S45) is reachable or advertised as available, unless OD9 says otherwise in writing.

No-go on any line. A no-go is recorded here with the failing line and the date of the next attempt.

## Build Status Vocabulary

Every page, section, interaction contract and flow specified in Phases 1–7 appears in the roadmap carrying exactly one status drawn from this fixed set:

- **Specified** — defined in the blueprints, not yet scheduled.
- **Scheduled** — assigned to a sprint or milestone.
- **In progress** — implementation started.
- **Built** — implemented and merged.
- **Verified** — implemented and passing the Phase 9 checks.
- **Deferred** — deliberately postponed. Carries a reason and a revisit trigger (a date, a milestone, or a dependency).

Status lives here and nowhere else. It is recorded against a feature, never used to remove one — see Critical Rules › Scope Preservation. A feature with no implementation is **Specified**, not absent.

**Note on "Built" for uncommitted work.** On 2026-09-28 the home page and its sections were in the working tree, not merged, and were recorded Built at the maintainer's instruction. They have since been committed (`7a5c983`, `e4246ed`, `bc679f8`, `e0122ce`), so the note no longer applies to any row; it is kept as the rule for any future case: uncommitted work is strictly *In progress* until committed, and a row recorded otherwise says so.

## Build status register

Read from the repository on 2026-10-01 at commit `5b52c67`. Deferred reason for all money-movement rows: needs a licensed payments / sponsor-bank partner, a backend payments module and OD3. Revisit trigger: OD3 answered and the payments module published in the contract (or OD9 answered B).

### Summary

| Layer | Built | In progress | Scheduled | Specified | Deferred | Verified | Total |
|---|---|---|---|---|---|---|---|
| Primary flows (F) | 0 | 0 | 0 | 5 | 2 | 0 | 7 |
| Role dashboards (D) | 0 | 0 | 0 | 7 | 0 | 0 | 7 |
| Supporting flows (X) | 3 | 3 | 0 | 5 | 0 | 0 | 11 |
| Pages (P) | 7 | 0 | 0 | 26 | 2 | 0 | 35 |
| Sections (S) | 17 | 2 | 0 | 43 | 2 | 0 | 64 |
| Interaction contracts (C) | 12 | 1 | 0 | 55 | 0 | 0 | 68 |
| Foundations (FD) | 7 | 3 | 0 | 7 | 0 | 0 | 17 active (+ FD02 withdrawn) |
| **Total** | **46** | **9** | **0** | **148** | **6** | **0** | **209** |

Verified: 0. Scheduled: 0 (no sprint has a start date). Change since 2026-09-28: Built 32 → 46, In progress 3 → 9, Specified 168 → 148, Deferred 6 → 6.

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
| [X1](phase-2-experience-maps.md#x1--sign-in) | Sign in | Built | 1 (defects) | `app/(auth)/auth/login/page.tsx`, `components/auth/sign-in-form.tsx`, `lib/hooks/use-login.ts`, `app/api/session/route.ts` (POST), `proxy.ts`. Reachable from the public navigation (`lib/data/ledgerline/brand.ts`). Lands on the home page when no `next` is given, because P08 is not built. Two-step leg Sprint 7. |
| [X2](phase-2-experience-maps.md#x2--register) | Register | Built | 2 | Was In progress. `app/(auth)/auth/register/page.tsx`, `components/auth/register-form.tsx`, `lib/hooks/use-register.ts`, `app/api/register/route.ts`. Owes: lands on `next` or the home page, not onboarding (P07 unbuilt). |
| [X11](phase-2-experience-maps.md#x11--get-started-enquiry) | Get-started enquiry | Built | — | Design-study state: validates, sends nothing (`components/ledgerline/contact-section.tsx`, `lib/validations/contact.ts`). Intake per OD10. |
| [X3](phase-2-experience-maps.md#x3--sign-out) | Sign out | In progress | 2 | `lib/hooks/use-logout.ts` and the DELETE handler in `app/api/session/route.ts` exist; nothing imports the hook, so no member can sign out from the product; the server session is not ended (H-18). |
| [X9](phase-2-experience-maps.md#x9--help-and-support-contact) | Help and support contact | In progress | 7–8 | Was Specified. Help leg built (`app/(marketing)/help/page.tsx`, `app/(marketing)/help/[slug]/page.tsx`); the messages leg (P21, S36, S37) is not. |
| [X10](phase-2-experience-maps.md#x10--error-offline-and-outage-recovery) | Error, offline and outage recovery | In progress | 1 | Was Specified. Route-level not-found, error and offline recovery built (`components/status/server-error-panel.tsx`, `lib/hooks/use-online.ts`); owes section-level recovery (C57, C58), segment boundaries for `(app)`/`(auth)`/`(admin)`, and outage detection through BE-health. |
| [X4](phase-2-experience-maps.md#x4--session-expiry-and-step-up-re-authentication) | Session expiry and step-up | Specified | 2 | OD2 |
| [X5](phase-2-experience-maps.md#x5--password-reset) | Password reset | Specified | 7 | The sign-in page's forgotten-password route leads to a help article (`lib/data/auth/sign-in.ts`) until P04/P05 exist. |
| [X6](phase-2-experience-maps.md#x6--invite-teammate-and-manage-roles) | Invite teammate and manage roles | Specified | 6 | — |
| [X7](phase-2-experience-maps.md#x7--notifications-and-alerts) | Notifications and alerts | Specified | 7 | — |
| [X8](phase-2-experience-maps.md#x8--profile-and-security-settings) | Profile and security settings | Specified | 7 | OD6 |

### Pages (P)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [P01](phase-4-page-blueprints.md#p01--home) | Home | Built | 8 (reconcile) | `app/(marketing)/page.tsx` composing S04, S06, S55–S64 from `components/ledgerline/`; S07 and S55 come from `app/(marketing)/layout.tsx`. Diverges from spec per OD9/OD10; S05 not built. Not Verified. |
| [P02](phase-4-page-blueprints.md#p02--sign-in) | Sign in | Built | 1 (defects) | `app/(auth)/auth/login/page.tsx`. Host findings H-01–H-05 and H-16 were written against the replaced `login-form.tsx` and need re-running in Phase 9 against `components/auth/`. |
| [P03](phase-4-page-blueprints.md#p03--register) | Register | Built | 2 | Was Specified. `app/(auth)/auth/register/page.tsx`. Owes the onboarding destination (P07). |
| [P16](phase-4-page-blueprints.md#p16--runway-calculator) | Runway calculator | Built | 8 | Was Specified. `app/(app)/insights/runway/page.tsx`. Owes: route protection (R-12), the `(app)` layout with S01–S02, C57/C58. |
| [P28](phase-4-page-blueprints.md#p28--help-center) | Help center | Built | 8 | Was Specified. `app/(marketing)/help/page.tsx`, `app/(marketing)/help/[slug]/page.tsx`. Owes: the signed-in route to messaging (P21); a check that each article describes Built behaviour (Q-248). |
| [P34](phase-4-page-blueprints.md#p34--not-found-404) | Not found (404) | Built | 1 | Was Specified. `app/not-found.tsx`. Owes segment-level `not-found` for `(app)` and `(admin)`. |
| [P35](phase-4-page-blueprints.md#p35--server-error-500) | Server error (500) | Built | 1 | Was Specified. `app/error.tsx`, `app/global-error.tsx`, `app/(marketing)/error.tsx`. Owes segment boundaries for `(app)`, `(auth)`, `(admin)`. |
| [P04](phase-4-page-blueprints.md#p04--forgot-password) | Forgot password | Specified | 7 | — |
| [P05](phase-4-page-blueprints.md#p05--reset-password) | Reset password | Specified | 7 | — |
| [P06](phase-4-page-blueprints.md#p06--two-step-verification) | Two-step verification | Specified | 7 | OD6 |
| [P07](phase-4-page-blueprints.md#p07--onboarding--verification) | Onboarding & verification | Specified | 6 | OD1 |
| [P08](phase-4-page-blueprints.md#p08--dashboard) | Dashboard | Specified | 5 | `/dashboard` is protected but has no page (H-15) |
| [P09](phase-4-page-blueprints.md#p09--accounts) | Accounts | Specified | 3 | `use-accounts` and the accounts endpoint exist; no page |
| [P10](phase-4-page-blueprints.md#p10--account-ledger) | Account ledger | Specified | 3 | LD2 |
| [P11](phase-4-page-blueprints.md#p11--transaction-search) | Transaction search | Specified | 4 | — |
| [P12](phase-4-page-blueprints.md#p12--transaction-detail) | Transaction detail | Specified | 4 | page + intercepted route |
| [P13](phase-4-page-blueprints.md#p13--saved-views) | Saved views | Specified | 4 | — |
| [P14](phase-4-page-blueprints.md#p14--flagged-transactions) | Flagged transactions | Specified | 4 | — |
| [P15](phase-4-page-blueprints.md#p15--compare-periods) | Compare periods | Specified | 8 | LD1 |
| [P17](phase-4-page-blueprints.md#p17--statements) | Statements | Specified | 5 | OD1 |
| [P18](phase-4-page-blueprints.md#p18--exports) | Exports | Specified | 5 | — |
| [P19](phase-4-page-blueprints.md#p19--counterparty) | Counterparty | Specified | 7 | — |
| [P20](phase-4-page-blueprints.md#p20--notifications) | Notifications | Specified | 7 | — |
| [P21](phase-4-page-blueprints.md#p21--messages) | Messages | Specified | 7 | — |
| [P22](phase-4-page-blueprints.md#p22--workspace-settings) | Workspace settings | Specified | 7 | — |
| [P23](phase-4-page-blueprints.md#p23--team) | Team | Specified | 6 | — |
| [P24](phase-4-page-blueprints.md#p24--team-member-profile) | Team member profile | Specified | 6 | — |
| [P25](phase-4-page-blueprints.md#p25--profile--security) | Profile & security | Specified | 7 | — |
| [P29](phase-4-page-blueprints.md#p29--admin-overview) | Admin overview | Specified | 2 | endpoints exist; `app/(admin)/layout.tsx` guard exists, no page under it |
| [P30](phase-4-page-blueprints.md#p30--admin-users) | Admin users | Specified | 2 | LD2 |
| [P31](phase-4-page-blueprints.md#p31--admin-user-detail) | Admin user detail | Specified | 2 | — |
| [P32](phase-4-page-blueprints.md#p32--compliance-queue) | Compliance queue | Specified | 6 | — |
| [P33](phase-4-page-blueprints.md#p33--support-console) | Support console | Specified | 6 | — |
| [P26](phase-4-page-blueprints.md#p26--transfer) | Transfer | Deferred | — | OD3 |
| [P27](phase-4-page-blueprints.md#p27--payees--bill-pay) | Payees & bill pay | Deferred | — | OD3 |

### Sections (S)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| [S04](phase-5-section-blueprints.md#s04--marketing-proposition) | Marketing proposition | Built | 8 (reconcile) | `components/ledgerline/hero-section.tsx` + preview with sample company (OD9 d). |
| [S06](phase-5-section-blueprints.md#s06--security--trust-statements) | Security & trust statements | Built | 8 (reconcile) | `components/ledgerline/security-section.tsx`; placeholder controls beyond v1 (OD9 e); no `reviewedOn`. |
| [S07](phase-5-section-blueprints.md#s07--public-legal--support-links) | Public legal & support links | Built | 8 | `components/ledgerline/ledger-footer.tsx`, `footer-links.tsx`, `footer-updates.tsx` (rebuilt in `e0122ce`), with disclosure; links to help articles. |
| [S55](phase-5-section-blueprints.md#s55--public-site-navigation) | Public site navigation | Built | 8 (reconcile) | `components/ledgerline/ledger-nav.tsx`; now leads to sign-in and registration (`lib/data/ledgerline/brand.ts`); OD9 a–b, OD10. |
| [S56](phase-5-section-blueprints.md#s56--headline-figures) | Headline figures | Built | 8 (reconcile) | `components/ledgerline/metrics-strip.tsx`; sample figures (OD9). |
| [S57](phase-5-section-blueprints.md#s57--accounts-capability) | Accounts capability | Built | 8 (reconcile) | `components/ledgerline/accounts-section.tsx`; OD9 c; H-24. |
| [S58](phase-5-section-blueprints.md#s58--payments--approvals-capability) | Payments & approvals capability | Built | 8 (reconcile) | `components/ledgerline/payments-section.tsx`; OD9 a. |
| [S59](phase-5-section-blueprints.md#s59--cards-capability) | Cards capability | Built | 8 (reconcile) | `components/ledgerline/cards-section.tsx`; OD9 b. |
| [S60](phase-5-section-blueprints.md#s60--treasury-forecast-capability) | Treasury forecast capability | Built | 8 (reconcile) | `components/ledgerline/treasury-section.tsx`; OD9 c. |
| [S61](phase-5-section-blueprints.md#s61--reconciliation-capability) | Reconciliation capability | Built | 8 (reconcile) | `components/ledgerline/reconcile-section.tsx`; OD9 c. |
| [S62](phase-5-section-blueprints.md#s62--pricing-plans) | Pricing plans | Built | 8 (reconcile) | `components/ledgerline/pricing-section.tsx`; OD9 f. |
| [S63](phase-5-section-blueprints.md#s63--frequently-asked-questions) | Frequently asked questions | Built | 8 | `components/ledgerline/faq-section.tsx`. |
| [S64](phase-5-section-blueprints.md#s64--get-started-enquiry) | Get-started enquiry | Built | 8 | `components/ledgerline/contact-section.tsx`; sends nothing (OD10). |
| [S29](phase-5-section-blueprints.md#s29--runway-calculator) | Runway calculator | Built | 8 | Was Specified. `components/insights/runway-calculator.tsx` with `runway-inputs.tsx`, `runway-result.tsx`, `runway-projection.tsx`; `lib/utils/runway.ts` (tested), `lib/hooks/use-accounts.ts`, `use-cash-flow.ts`, `use-runway-params.ts`. Owes: its own four-state handling through C57 rather than an inline status; C40 for money (it formats through `lib/utils/money.ts` directly). |
| [S46](phase-5-section-blueprints.md#s46--help-search--categories) | Help search & categories | Built | 8 | Was Specified. `components/help/help-search.tsx`, `help-category-filter.tsx`, `help-ledger.tsx`, `help-empty.tsx`; data in `lib/data/help/`. Uses a help-only search field and empty state (precursors of C11, C32). |
| [S47](phase-5-section-blueprints.md#s47--help-article) | Help article | Built | 8 | Was Specified. `components/help/help-article.tsx`, `help-block.tsx`, `help-related.tsx`, `help-breadcrumbs.tsx` (precursor of C29); unknown slug gives not-found. |
| [S54](phase-5-section-blueprints.md#s54--status-explanation) | Status explanation | Built | 1 | Was Specified. `components/status/not-found-panel.tsx`, `server-error-panel.tsx`, `status-line.tsx`; not-found, error and offline variants; copyable reference. Owes: the session-dependent destination (home vs dashboard) and the BE-health outage check. |
| [S08](phase-5-section-blueprints.md#s08--authentication-step) | Authentication step | In progress | 2–7 | Sign-in and register variants in `components/auth/sign-in-form.tsx` and `register-form.tsx` (replacing `components/common/login-form.tsx`); forgot, reset and verify variants not built. |
| [S03](phase-5-section-blueprints.md#s03--page-identity--actions) | Page identity & actions | In progress | 1 | Was Specified. `components/shell/page-header.tsx`, used by P16 only. Owes: page names from `PAGE_TITLES`, the hierarchy trail (C29), sub-page movement (C23), loading state for a dynamic name. |
| [S05](phase-5-section-blueprints.md#s05--value-propositions) | Value propositions | Specified | 8 | not built; job covered by S57–S61 pending OD9 |
| S01 S02 | Primary navigation · Global utilities | Specified | 1 | No `(app)` layout exists; S03 and S54 moved to their own rows above. |
| S48 S49 S50 | Platform growth figures · Platform user directory · Admin user record | Specified | 2 | — |
| S19 S20 S21 S22 S23 | Account directory · Account overview · Ledger filters · Ledger summary · Ledger entries | Specified | 3 | — |
| S24 S25 S26 S27 | Transaction detail · Transaction lifecycle · Notes & attachments · Saved view management | Specified | 4 | — |
| S13 S14 S15 S16 S17 S18 S30 S31 S32 | Verification status notice · Cash position · Account summary · Recent activity · Pending items · Cash flow over time · Statement downloads · Export request · Export jobs | Specified | 5 | — |
| S09 S10 S11 S12 S39 S40 S41 S51 S52 S53 | Verification progress · Business details · Beneficial owners · Document upload · Team members · Member invitation · Role permissions reference · Compliance case queue · Compliance case review · Support lookup | Specified | 6 | S42 read variant pulled into 6 |
| S33 S34 S35 S36 S37 S38 S42 S43 | Counterparty summary · Notification history · Alert rules · Support threads · Conversation · Workspace display settings · Profile details · Security settings | Specified | 7 | — |
| S28 | Period comparison | Specified | 8 | S29, S46 and S47 moved to their own rows above. |
| [S44](phase-5-section-blueprints.md#s44--money-transfer) | Money transfer | Deferred | — | OD3 |
| [S45](phase-5-section-blueprints.md#s45--payee-management) | Payee management | Deferred | — | OD3 |

### Interaction contracts (C)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| C01 | Button | Built | 1 (defects) | `components/ui/button.tsx`; H-06, H-07 and H-22 still present (`disabled={disabled ?? isLoading}`, no `displayName`). Used by `components/insights/runway-inputs.tsx` only: the public, auth and status pages use `components/ledgerline/ledger-button.tsx` and `components/auth/auth-submit.tsx`. |
| C10 | Field | Built | 1 | Was Specified. `components/ui/field.tsx`, used by `components/insights/runway-inputs.tsx`. Owes: required state (`aria-required`); the auth forms use their own `components/auth/auth-field.tsx` instead. |
| C26 | Meter | Built | 5 | Was Specified. `components/ui/meter.tsx`, used by `components/insights/runway-result.tsx`. Owes: `min`, the progress variant and the indeterminate state. |
| C30 | Chart | Built | 2 | Was Specified. `components/ui/chart.tsx` + `chart-plot.tsx` (lazy-loaded, LD1 installed), used by `components/insights/runway-projection.tsx`; text summary and data table present. Owes: stepping through points by keyboard with announcements; empty and error states; the safe-integer check. |
| C34 | LoginForm → AuthForm variants | Built | 1 (defects); 2 variants | `components/auth/sign-in-form.tsx`, `register-form.tsx` and the shared `components/auth/` parts (replacing `components/common/login-form.tsx`). Verify variant (inside C55) not built. H-01–H-05 need re-running against the new files. |
| C56 | Entrance reveal | Built | — | `components/wrappers/motion-wrapper.tsx`; Q6-7 |
| C61 | Provider | Built | 1 (H-23) | `components/providers/provider.tsx`; `staleTime` still a literal (H-23). |
| C64 | Disclosure | Built | — | `components/ledgerline/faq-row.tsx`. |
| C65 | Small-screen navigation toggle | Built | — | `components/ledgerline/ledger-nav.tsx`; no Escape handling found in the file — Phase 9 to confirm. |
| C66 | Sample interaction control | Built | — | `components/ledgerline/approval-card.tsx`, `card-controls.tsx`. |
| C67 | Enquiry form | Built | — | `components/ledgerline/contact-section.tsx`. |
| C68 | Text reveal | Built | — | `components/wrappers/reveal-words.tsx`; accessibility to confirm. |
| C40 | Amount | In progress | 3 | Was Specified. `components/common/amount.tsx` over `lib/utils/money.ts` (unit-tested); balance and signed display, unavailable state. No consumer imports it yet. Owes: absolute display, status states (pending, returned, failed, reversed), currency-code display, C27. |
| C02–C09, C12–C14, C16–C18, C20, C27, C29, C32, C33, C35–C37, C54, C57–C59, C63 | primitives batch 1, layout compositions, wrappers, workspace provider | Specified | 1 | C18, C20, C29 pulled forward; C10 moved to its own row. Feature-local precursors, to be promoted on second use: C04 (`components/auth/auth-field.tsx`), C29 (`components/help/help-breadcrumbs.tsx`), C32 (`components/help/help-empty.tsx`), C33 (the retry and reference behaviour inside `components/status/server-error-panel.tsx`). |
| C11, C15, C19, C21–C25, C41, C45, C52, C53, C55, C62 | — | Specified | 2 | C53 LD2; C30 moved to its own row. C11 precursor inside `components/help/help-search.tsx`. |
| C31, C42, C43, C44, C46, C47, C48, C51 | — | Specified | 3 | C40 moved to its own row. C51 precursor: the copy actions inside `server-error-panel.tsx` and `runway-calculator.tsx`. |
| C28, C38, C49, C60 | — | Specified | 4 | — |
| C50 | Stepper | Specified | 6 | — |
| C39 | Notification entry point | Specified | 7 | — |

### Foundations (FD)

| ID | Name | Status | Planned sprint | Notes |
|---|---|---|---|---|
| FD01 | Token architecture | Built | — | `styles/tokens.css`, `styles/globals.css` (values are a build concern) |
| FD05 | Proxy session gate | Built | — | `proxy.ts` (tested in `proxy.test.ts`); protects `/dashboard` only |
| FD07 | Contract generator | Built | — | `tools/contract/`; default source `../backend/openapi.json`; regenerated for accounts and cash flow (`35cf9ec`) |
| FD08 | ESLint rules | Built | — | 6 rules in `tools/eslint/rules/`, each with a colocated test (token-first removed by owner) |
| FD09 | Transport-to-hook codemod | Built | — | `tools/codemods/` |
| FD10 | Hook baseline | Built | — | `lib/hooks/`: `use-login`, `use-logout`, `use-register`, `use-create-user`, `use-debounced-search`; since added: `use-accounts`, `use-cash-flow`, `use-runway-params`, `use-online`, `use-settled`, `use-damped-pointer` |
| FD13 | LD1 request | Built | 1 | Was Specified. Resolved by installation: `recharts` in `package.json`. The approval itself should be recorded against OD8 in Phase 7. |
| FD04 | Route groups and layouts | In progress | 1 | Was Specified. Groups `(marketing)`, `(auth)`, `(app)`, `(admin)` exist under `app/`; P01 and P02 moved. Layouts exist for `(marketing)` and `(admin)` only; `(app)` and `(auth)` have none. |
| FD06 | Protected prefixes and admin guard | In progress | 1 | Was Specified. Admin role check in `app/(admin)/layout.tsx`. Owes: `PROTECTED_ROUTE_PREFIXES` in `lib/constants.ts` still lists `/dashboard` only, so `/insights/runway` is open to signed-out visitors (R-12); no role check in the proxy (H-14). |
| FD11 | Host defect fixes | In progress | 1 | Was Specified. Evidence of fixes: distinct sign-in outcomes by status in `app/api/session/route.ts` (H-02); `autoComplete` on auth fields in `components/auth/auth-field.tsx` (H-03); a forgotten-password route from sign-in (H-04, to help only); Ledgerline root metadata (H-08). Still present: H-07, H-14, H-17, H-18, H-22, H-23. None is closed until Phase 9 re-runs it. |
| FD02 | *Withdrawn (visual): Ledgerline token values* | — | — | see ledger |
| FD03 | Colour-scheme preference wiring | Specified | 1 | only if the build offers more than one scheme (C54) |
| FD12 | CI gate extension | Specified | 1 | R-8; `.github/workflows/ci.yml` still runs lint and build only. The full gate, in the order of Phase 7 §14.2: (1) `pnpm install --frozen-lockfile`; (2) `pnpm type-check`; (3) `pnpm lint`; (4) `pnpm test`; (5) `pnpm contract:check` with `CONTRACT_SOURCE` set, failing when the document is absent; (6) `pnpm audit --prod`; (7) `pnpm build`; (8) end-to-end, accessibility and performance suites (LD4). Any failing step blocks the merge; steps 1–7 do not wait on LD4. |
| FD14–FD17 | LD2–LD5 requests | Specified | 1 | OD8; FD13 moved to its own row |
| FD18 | OD9 and OD10 decision requests | Specified | 1 | added 2.0.0 |

(FD18 is counted in the summary's 17 active foundations: FD01, FD03–FD18.)

## Scope preservation ledger

This is **generation 2**, a merge over generation 1 (commit `9565964`, 16 files).

| Bucket | Contents |
|---|---|
| **Retained** | Personas R1–R7; F1–F7; D1–D7; X1–X10; P01–P35; S01–S54; C01–C63 (as interaction contracts); FD01, FD03–FD17; BR1–BR11; OD1–OD6, OD8; LD1–LD5; M1–M5; BE-* modules; KPIs K1–K14, SM1–SM5, North Star; Q-001–Q-250 IDs (visual ones retired, not deleted); host findings H-01–H-23; all states (transaction, account, verification, export, user) and all role variants. |
| **Added** | R8 Prospect; X11 Get-started enquiry; S55–S64; C64–C68; FD18; BR12; OD9; OD10; R-10, R-11; BE-enquiry; `use-enquiry`; host findings H-24, H-25; QA items Q-251–Q-262; Phase 5 Q5–Q6; Phase 6 Q6-8. Added 2026-10-01 in this file only: risks R-12, R-13; assumptions P8-A1–P8-A4. **Audit and reconciliation (2.1.0, 2026-10-01):** backend requirement rows BE-request-reference, BE-idempotency, BE-versioning, BE-cursor, BE-step-up-marker, BE-throttling, BE-csv-safety, BE-key-rotation, BE-sign-out; risks R-14–R-20 from the known code defects; open-decision rows OD11–OD16 with the sprints that depend on them; the full CI gate order in FD12; the residual decisions of the same date stated where this file names them (the full ledger filter set on BE-transactions, export-job visibility, thread and alert-rule ownership, drafts held in the open tab only). No status changed. |
| **Changed** | Files: 16 → 15 (Phase 7 Design Tokens dropped as visual; Phases 8–10 renumbered 7–9; Phase 6 renamed Interaction Contracts). Visual prescriptions dropped: dark-default palette with lime accent and the Daylight light theme, Geist / Geist Mono type, type scale, spacing, radii, elevation, shadows, opacity, breakpoints, grid, container widths, icon sizes, focus-ring tokens, z-index, motion durations and presets, contrast proofs tied to specific colours, component tokens, `.figure` typography and tone map, named layout classes, responsive frame, depth floor, density rules, register rules, styled templates, visual "feel" references (Linear, Vercel). Withdrawn: DP3, DP4, DP5, DP13, OD7, A7, PA2, A13, A14, P7-A7, FD02, Q6-4, Q6-5. Reworded: BR3, BR4, DP2, DP6–DP8. Renamed: 22 sections, 19 contracts (tables in Phases 5 and 6). Page "Modules" → Content requirements (removed in the later self-audit); "Responsive behavior" → Device needs. Status: 1.0.0 "Scheduled" rows → "Specified" with a planned sprint; P01, S04, S06, S07 → Built. **Status re-read 2026-10-01:** → Built: X2, P03, P16, P28, P34, P35, S29, S46, S47, S54, C10, C26, C30, FD13; → In progress: X9, X10, S03, C40, FD04, FD06, FD11. Grouped register rows split so each changed ID has its own row; no ID dropped (totals still 209). R-11 re-scored. Sprint gate, milestones, dependencies, risks, debt guards, testing and deployment readiness deepened with entry and exit criteria, owners, fallbacks and release gates. **Job-based names (2026-10-02):** Phase 5 sections renamed because the names described a container or control — S03 Page title & actions → Page identity & actions; S10 Business details form → Business details; S11 Beneficial owners form → Beneficial owners; S19 Account list → Account directory; S27 Saved views list → Saved view management; S30 Statement list → Statement downloads; S31 Export builder → Export request; S34 Notification feed → Notification history; S36 Thread list → Support threads; S38 Workspace general form → Workspace display settings; S40 Invite member form → Member invitation; S42 Profile form → Profile details; S44 Transfer form → Money transfer; S45 Payee list → Payee management. IDs, scope and statuses unchanged; record in the [Phase 5 name table](phase-5-section-blueprints.md#names-in-this-version). |
| **Removed** | **Empty.** No feature was removed. |

Deferred items (F6, F7, P26, P27, S44, S45) are retained in full; deferral is a status.

## Assumptions

- A2 v1 read-only (contested by OD9).
- A3 banking modules arrive via the contract; BE-accounts and BE-transactions by Sprint 3.
- A5 product demo data from the backend seed; a 5M-row seed for Sprint 3.
- A9 R5–R7 share `ADMIN`.
- A10 uncommitted working-tree code is recorded as Built at the maintainer's instruction. (No row relies on this as of 2026-10-01; the home-page work is committed.)
- P8-A1 Four environments (local, preview, staging, production), with real data in production only. Owner: Maintainer.
- P8-A2 A rollback completes within 15 minutes of the decision without a new build. Owner: Frontend lead.
- P8-A3 Rollback trigger for page-load failures: more than 2% over 15 minutes. The sign-in margin is left for the Product owner and Security engineer to set. Owner: Product owner.
- P8-A4 Post-release watch: the first hour and the next working morning. Owner: Frontend lead.

## Open questions

- **BE-saved-views** — backend module or per-device `localStorage`? The register assumes a backend module. Owner: Backend lead; needed by Sprint 3 entry.
- **Sequencing corrections** — confirm the pull-forwards above. Owner: Frontend lead.
- **CI branches** — add `development`? Owner: Maintainer.
- **Contract source** — the generator now defaults to `../backend/openapi.json` and that file exists beside this repository; CI still has to supply it and fail when it is absent. Owner: Frontend lead (FD12).
- **Uncommitted Built** — resolved 2026-10-01: the home-page rows are committed.
- **Sprint 1 start date** — none is recorded, so no row is Scheduled and no milestone has a date. Should the sprint plan be dated, or replaced by the page-at-a-time order the build is following? Owner: Product owner.
- **Hosting and monitoring** — no hosting platform, deployed environment or monitoring service is recorded. Each is needed before the release gates can pass; a monitoring service is also a library decision (OD8). Owner: Maintainer.
- **Help articles ahead of the product** — the help center is Built while most of what its articles could describe is Specified. Which articles are published before their feature is Built (Q-248)? Owner: Product owner.
- **LD1 approval record** — `recharts` is installed; where is its approval recorded? Owner: Maintainer.

## Traceability

| Direction | Phase | What flows |
|---|---|---|
| Upstream | [Phase 1](phase-1-product-vision.md) | scope, personas, OD1–OD16, BR19 limits |
| Upstream | [Phase 2](phase-2-experience-maps.md) | F, D, X |
| Upstream | [Phase 3](phase-3-information-architecture.md) | route groups, prefixes, admin guard |
| Upstream | [Phase 4](phase-4-page-blueprints.md) | P01–P35 |
| Upstream | [Phase 5](phase-5-section-blueprints.md) | S01–S64 |
| Upstream | [Phase 6](phase-6-interaction-contracts.md) | C01–C68 |
| Upstream | [Phase 7](phase-7-frontend-architecture.md) | folders, hooks, LD1–LD5 |
| Downstream | [Phase 9](phase-9-qa-checklist.md) | Built → Verified; host findings; sign-off roles used as owners here |
| Downstream | [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) | status roll-up |
| Downstream | [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md), [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | sprints, setup |
