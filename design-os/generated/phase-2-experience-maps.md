# Ledgerline Design OS — Phase 2: Experience Maps

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 1 — Product Vision](phase-1-product-vision.md) · Next: [Phase 3 — Information Architecture](phase-3-information-architecture.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to read these maps](#how-to-read-these-maps)
- [Flow index](#flow-index)
- [Primary flows](#primary-flows)
  - [F1 — Check cash position](#f1--check-cash-position)
  - [F2 — Review an account's ledger](#f2--review-an-accounts-ledger)
  - [F3 — Investigate a transaction](#f3--investigate-a-transaction)
  - [F4 — Export and reconcile](#f4--export-and-reconcile)
  - [F5 — Business onboarding and verification](#f5--business-onboarding-and-verification)
  - [F6 — Transfer money](#f6--transfer-money)
  - [F7 — Pay a payee / bill](#f7--pay-a-payee--bill)
- [Role dashboards](#role-dashboards)
  - [D1 — Owner dashboard](#d1--owner-dashboard)
  - [D2 — Finance dashboard](#d2--finance-dashboard)
  - [D3 — Accountant workspace](#d3--accountant-workspace)
  - [D4 — Viewer overview](#d4--viewer-overview)
  - [D5 — Support console](#d5--support-console)
  - [D6 — Compliance queue](#d6--compliance-queue)
  - [D7 — Platform admin overview](#d7--platform-admin-overview)
- [Supporting flows](#supporting-flows)
  - [X1 — Sign in](#x1--sign-in)
  - [X2 — Register](#x2--register)
  - [X3 — Sign out](#x3--sign-out)
  - [X4 — Session expiry and step-up re-authentication](#x4--session-expiry-and-step-up-re-authentication)
  - [X5 — Password reset](#x5--password-reset)
  - [X6 — Invite teammate and manage roles](#x6--invite-teammate-and-manage-roles)
  - [X7 — Notifications and alerts](#x7--notifications-and-alerts)
  - [X8 — Profile and security settings](#x8--profile-and-security-settings)
  - [X9 — Help and support contact](#x9--help-and-support-contact)
  - [X10 — Error, offline and outage recovery](#x10--error-offline-and-outage-recovery)
  - [X11 — Get-started enquiry](#x11--get-started-enquiry)
- [Backend dependency summary](#backend-dependency-summary)
- [Assumptions](#assumptions)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

## How to read these maps

Experiences come before pages. Each map below names the persona (R), the pages (P) and sections (S) it touches, and the backend it needs. Pages and sections are specified in [Phase 4](phase-4-page-blueprints.md) and [Phase 5](phase-5-section-blueprints.md); this phase fixes what a person is trying to do and what must be true when they are done.

Conventions used in every map:

- **Hooks** follow `lib/hooks/use-<resource>.ts` (TanStack Query). Authenticated calls wrap Server Actions in `lib/actions/`. Components never call the API client.
- **Dependencies** list backend endpoints. **Exists** means the endpoint is in today's `openapi.json`. **Required** means the backend must publish it through the contract before the flow can run against real data (A3). Required names are resource proposals for the backend team, not final paths.
- **Audit** means the backend records the event; the frontend never writes audit entries itself.
- Money follows [BR1–BR4](phase-1-product-vision.md#money): minor units in a string, `Intl.NumberFormat`, sign always given in text, ordinary debits never presented as problems, problem severity only for `returned` and `failed`.
- Every section in a journey owns its loading, empty, error and populated states through C57 QueryBoundary; failure paths below list only the domain-specific ones.
- Maps describe intent and behaviour only. Build status lives in [Phase 8](phase-8-implementation-roadmap.md); how any step looks is decided when its page is built.
- Section and contract names follow the 2.0.0 names (for example S14 Cash position, formerly "Cash position band"); the full rename table is in [Phase 5](phase-5-section-blueprints.md#names-in-this-version) and [Phase 6](phase-6-interaction-contracts.md#names-in-this-version).
- [OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is) is open: the built home page presents payments, cards and treasury capabilities that these maps (side A) keep Deferred or out of scope.

## Flow index

| ID | Name | Personas | Main pages |
|---|---|---|---|
| F1 | Check cash position | R1 R2 R3 R4 | P08 |
| F2 | Review an account's ledger | R1 R2 R3 R4 | P09 P10 |
| F3 | Investigate a transaction | R1 R2 R3 R4 | P11 P12 P19 P14 P13 |
| F4 | Export and reconcile | R1 R2 R3 | P17 P18 P15 |
| F5 | Business onboarding and verification | R1 (R6 internal side) | P03 P07 P32 |
| F6 | Transfer money | R1 R2 | P26 |
| F7 | Pay a payee / bill | R1 R2 | P27 |
| D1–D4 | Workspace dashboards | R1–R4 | P08 by role |
| D5 | Support console | R5 | P33 |
| D6 | Compliance queue | R6 | P32 |
| D7 | Platform admin overview | R7 | P29 P30 P31 |
| X1–X10 | Supporting flows | all | P02–P06 P20–P25 P28 P34 P35 |
| X11 | Get-started enquiry (added 2.0.0) | R8 | P01 |

## Primary flows

### F1 — Check cash position

- **User intent:** know how much cash the business has right now and what changed today.
- **Personas:** R1 primarily; R2, R3; R4 limited to permitted accounts.
- **Trigger:** start of day; a customer says they paid; a payroll date approaches; a low-balance alert (X7).
- **Entry points:** sign-in redirect to P08 Dashboard `/dashboard`; S01 Primary navigation; C38 CommandPalette "Dashboard"; X7 alert link.
- **Journey:**
  1. P08 loads the shell (S01 Primary navigation, S02 Global utilities) and S03 Page title & actions with the workspace name.
  2. S14 Cash position shows total cash per currency (one primary figure per currency) with C41 DeltaChip for today's net movement.
  3. S15 Account summary lists each account with balance, C12 Status label for non-`active` states, and a link to P10.
  4. S16 Recent activity shows the latest transactions; `pending` rows are labelled as pending in text.
  5. S17 Pending items surfaces pending transactions, running exports and verification needs.
  6. S18 Cash flow over time shows inflow vs outflow for the selected range (C23 Tabs: 30 / 90 days).
  7. The user either leaves satisfied or drills into an account (F2) or a transaction (F3).
- **Decision points:** drill into an account or a transaction; change chart range; act on a pending item.
- **Emotional state:** anxious or hurried on arrival → reassured when the total appears fast and exact; alarmed if a figure looks wrong, which is why exactness (BR1) is non-negotiable.
- **Failure paths:**
  - Accounts in more than one currency: totals must never be summed across currencies; S14 shows one value per currency.
  - An account is `frozen` or `pending_verification`: balance may be shown but the state must be explicit.
  - Balance source (OD5) is delayed: figures are stale without the user knowing.
  - R4 has no permitted accounts: empty dashboard that looks broken.
- **Recovery paths:**
  - Stale data: S14 shows "as of" time from the backend; C33 ErrorState retry on fetch failure.
  - Frozen account: badge plus link to X9 Help and support contact.
  - R4 with nothing permitted: C32 EmptyState explaining that an owner grants account access, naming the owner role.
- **System behavior:** `use-accounts` (balances), `use-transactions` with a limit (S16), `use-transactions` pending filter + `use-exports` + `use-verification-case` (S17), `use-cash-flow` (S18). Query keys include workspace ID. Refetch on window focus; no polling on the dashboard. No audit event for viewing.
- **Completion criteria:** the user has seen a total per currency, each account's balance with state, and today's movement, all with an "as of" time.
- **Dependencies:** Exists: `GET /api/users/me`. Required: workspaces + memberships, accounts (list, balances), transactions (list with filters), cash-flow series, exports (list), verification cases (workspace side).

### F2 — Review an account's ledger

- **User intent:** read every movement on one account for a period, filtered to what matters.
- **Personas:** R2 primarily; R1, R3; R4 for permitted accounts.
- **Trigger:** month-end; a question about an account; clicking an account on P08.
- **Entry points:** P09 Accounts `/accounts`; S15 on P08; C38 CommandPalette account search; direct link `/accounts/[accountId]` with filters in URL.
- **Journey:**
  1. P09 shows S19 Account list: name, C42 MaskedAccountNumber, balance, state.
  2. Selecting an account opens P10 Account ledger `/accounts/[accountId]`.
  3. S20 Account overview shows balance, state, masked number with C51 CopyButton and reveal (X4).
  4. S21 Ledger filters sets date range (C48), type, amount range, status via C46 Filter set and C47 Active filter; filters write to URL params.
  5. S22 Ledger summary shows server-computed opening balance, credits, debits and closing balance for the filter.
  6. S23 Ledger entries streams rows with cursor pagination and virtualization (C53); running position is kept on back navigation.
  7. The user opens a row (F3), saves the filter as a view (P13), or exports the filtered set (F4).
- **Decision points:** narrow by filter vs scroll; save as view; export; reveal account number.
- **Emotional state:** focused and methodical; frustrated by lost scroll position or totals that do not match the statement.
- **Failure paths:**
  - Account ID not found or not permitted for the member: P34 Not found (never reveal that the account exists).
  - Filter returns zero rows.
  - A `pending` transaction in view is later `returned`: the row's status label and effect on the balance change after the user has noted it.
  - A 5-million-row ledger scrolled far: client memory grows if rows are not virtualized.
  - Reveal step-up fails (X4).
- **Recovery paths:**
  - Zero rows: C32 EmptyState with "clear filters" action that resets URL params.
  - Returned transaction: row shows the `returned` status label with problem severity and the timeline (S25) explains it; S22 totals refresh from server.
  - Long scroll: virtualization keeps DOM small; "jump to date" via C48 instead of scrolling.
  - Step-up failure: number stays masked; copy explains why; retry available.
- **System behavior:** `use-account`, `use-ledger-summary`, `use-transactions` (infinite, cursor). Filters are server-side; URL is the source of truth for filter state. Summary is never computed by summing loaded rows. Reveal is audit-logged by the backend.
- **Completion criteria:** the user sees the filtered ledger with totals that equal the server summary, and the URL reproduces the view.
- **Dependencies:** Required: accounts (list, detail, balances), transactions (cursor list with filters), ledger summary, saved views, step-up re-auth, audit log.

### F3 — Investigate a transaction

- **User intent:** find one transaction, understand it and leave a trace of what was learned.
- **Personas:** R2, R3 primarily; R1; R4 read-only.
- **Trigger:** unknown debit; accountant query; customer payment confirmation; large-transaction alert (X7).
- **Entry points:** C38 CommandPalette (⌘K / Ctrl+K); P11 Transaction search `/transactions`; a row in S23 or S16; P14 Flagged transactions `/transactions/flagged`; P13 Saved views `/transactions/views`; a shared link `/transactions/[transactionId]`; X7 notification.
- **Journey:**
  1. The user searches by counterparty, amount or reference in C38 or S21 on P11; results render in S23.
  2. Opening a row shows P12 Transaction detail as an intercepted overlay (C22) over the list, preserving list position; a direct link renders the full page.
  3. S24 Transaction detail shows amount (C40), status badge, account, counterparty, references, with C51 CopyButton for the share link.
  4. S25 Transaction lifecycle shows lifecycle events (`pending` → `posted` → `returned` / `reversed`).
  5. The user follows the counterparty to P19 Counterparty `/counterparties/[counterpartyId]`, where S33 Counterparty summary and S23 show history with that party.
  6. Back on P12, S26 Notes & attachments: add a note, set a category, flag, attach a receipt.
  7. The user copies the share link or returns to the list with position intact.
- **Decision points:** open overlay vs full page; annotate vs flag for someone else; follow counterparty.
- **Emotional state:** suspicious or puzzled → relieved when the story is clear; the overlay keeps context so the user does not feel lost.
- **Failure paths:**
  - Search matches nothing.
  - Shared link opened by a member without permission, or by someone signed out.
  - Two members edit the same note at once.
  - Attachment upload fails or file type is rejected.
  - R4 tries to annotate.
- **Recovery paths:**
  - No match: EmptyState suggesting a wider date range, with the current query kept.
  - Signed out: proxy redirects to P02 with `next`, returning to the transaction after X1. Not permitted: P34 Not found.
  - Concurrent edit: optimistic update rolls back on conflict with a C24 Transient message showing the newer note.
  - Upload failure: C49 File upload keeps the file listed with retry and the reason (size, type).
  - R4: annotation controls are absent via C59 PermissionGate; the view is read-only.
- **System behavior:** `use-debounced-search` feeds `use-transactions`; `use-transaction` for detail; `use-update-transaction` (optimistic) and `use-upload-attachment`; `use-counterparty`; `use-saved-views`. Annotations are audit-logged. Share link contains only the opaque transaction ID.
- **Completion criteria:** the transaction is identified, and any note, category, flag or attachment the user added is saved and visible to other members.
- **Dependencies:** Required: transactions (list, detail, PATCH annotations, attachments), counterparties, saved views, audit log.

### F4 — Export and reconcile

- **User intent:** get the period's statement and transaction data into the accounting tool and confirm balances match.
- **Personas:** R2, R3 primarily; R1.
- **Trigger:** month-end close; auditor request; "statement ready" or "export ready" notification (X7).
- **Entry points:** P17 Statements `/statements`; P18 Exports `/exports`; export action on P10 carrying current filters; P15 Compare periods `/insights/compare`; X7 notification.
- **Journey:**
  1. P17 S30 Statement list shows one row per account per month with a PDF download.
  2. On P18, S31 Export builder: choose accounts, period (C48), format (CSV or OFX-style), columns.
  3. Submitting creates a job; S32 Export jobs shows it `queued` → `running` → `ready`.
  4. The user downloads the file when `ready`; an X7 notification also arrives if they left.
  5. Optionally P15 S28 Period comparison shows the period against the previous one to spot anomalies before closing.
  6. The user reconciles in their accounting tool against S22 totals and the statement.
- **Decision points:** statement vs export; which format; compare before closing.
- **Emotional state:** under deadline pressure; relieved when the file is right first time; distrustful if totals differ.
- **Failure paths:**
  - Statement not yet generated for the current month.
  - Export job `failed`.
  - Export job `expired` before download.
  - Session expires while the job is running (X4).
  - Export totals differ from the statement because pending transactions were included.
  - R4 reaches P18 by URL.
- **Recovery paths:**
  - Current month: row shows "available after month end" with the expected date from the backend, and offers an export instead.
  - Failed: error badge, reason copy, "try again" re-submits the same parameters.
  - Expired: "create again" pre-fills the builder from the expired job.
  - Session expiry: job continues server-side; after re-authentication S32 shows it `ready`.
  - Pending mismatch: builder states clearly whether pending is included (default: posted only).
  - R4: C59 PermissionGate renders a not-permitted state naming the roles that can export.
- **System behavior:** `use-statements`; `use-create-export`; `use-exports` polls only while any job is `queued` or `running`, stopping when none are. Download URLs are short-lived and fetched on click, never stored. Downloads are audit-logged.
- **Completion criteria:** the user has the statement PDF and/or the export file for the chosen period and accounts.
- **Dependencies:** Required: statements (list, PDF download URL), exports (create job, list, download URL), compare periods, notifications, audit log.

### F5 — Business onboarding and verification

- **User intent:** get the business verified so the workspace's accounts can be used.
- **Personas:** R1; internal counterpart R6 (D6).
- **Trigger:** first registration; verification status notice (S13); `needs_info` notification.
- **Entry points:** P03 Register `/auth/register` then redirect; P07 Onboarding & verification `/onboarding`; S13 Verification status notice on P08; X7 notification.
- **Journey:**
  1. X2 Register creates the user and session; the user creates a workspace.
  2. P07 shows S09 Verification progress: business details, beneficial owners, documents, review.
  3. S10 Business details form (legal name, registration number, address; fields set by OD1).
  4. S11 Beneficial owners form: add each owner; removal confirmed with C52 ConfirmDialog.
  5. S12 Document upload: registration documents and owner IDs with C49 File upload and C26 Meter progress.
  6. Review and submit; the case moves to `submitted`; S13 notice reflects the state on P08.
  7. R6 reviews on P32 (D6); outcome `approved`, `rejected` or `needs_info` returns to R1 via X7 and S13.
- **Decision points:** save and continue later; add another owner; respond to `needs_info`.
- **Emotional state:** impatient and wary of sharing documents; progress must never be lost; clarity about "what is missing" matters more than speed.
- **Failure paths:**
  - User leaves mid-form.
  - Document rejected for size or type, or upload interrupted.
  - Case returns `needs_info` with specific items.
  - Case `rejected`.
  - Another owner-role member opens P07 at the same time.
- **Recovery paths:**
  - Leaving: every step saves to the case (`in_progress`) and S09 reopens at the first incomplete step.
  - Upload failure: retry per file; other files are not lost.
  - `needs_info`: stepper highlights only the steps with requested items and shows the analyst's message verbatim.
  - `rejected`: clear statement, reason where the backend provides one, and a route to X9.
  - Concurrent edit: server version wins; the user sees a toast and refreshed values.
- **System behavior:** `use-verification-case`, `use-update-verification-case`, `use-upload-document`. Documents upload directly to the backend-issued target; the frontend never stores them. State transitions and decisions are audit-logged.
- **Completion criteria:** the case reaches `submitted` with every required item; final completion is `approved`.
- **Dependencies:** Exists: `POST /api/auth/register`. Required: workspaces, verification cases (workspace side, documents upload, decision), notifications.

### F6 — Transfer money

v1 read-only; see [Phase 8](phase-8-implementation-roadmap.md). Fully mapped so the design has room for it (OD3).

- **User intent:** move money from one account to another account or to a payee.
- **Personas:** R1, R2.
- **Trigger:** supplier due; moving cash between operating and reserve accounts.
- **Entry points:** P26 Transfer `/payments/transfer`; S20 Account overview action; C38 CommandPalette.
- **Journey:**
  1. S44 Transfer form: from account (balance shown with C40), to account or payee, amount, reference, date.
  2. Review screen summarises amounts in minor-unit-exact formatting.
  3. Step-up re-authentication (X4) before submission.
  4. Submission returns a transfer that appears as a `pending` transaction in F2 and F3.
- **Decision points:** internal vs external destination; now vs scheduled.
- **Emotional state:** high stakes; needs certainty before submitting and confirmation after.
- **Failure paths:** insufficient available balance; source account `frozen`; step-up failed; duplicate submission; transfer later `returned`.
- **Recovery paths:** inline validation before submit; idempotent submission key (nanoid) so a double click never sends twice; step-up retry; returned transfer surfaces in X7 and on the transaction timeline.
- **System behavior:** `use-create-transfer`; idempotency key per attempt; audit-logged; no optimistic balance change.
- **Completion criteria:** the transfer is accepted and visible as `pending`.
- **Dependencies:** Required: transfers, step-up re-auth, accounts, audit log; OD3 and OD5 answered.

### F7 — Pay a payee / bill

v1 read-only; see [Phase 8](phase-8-implementation-roadmap.md). Fully mapped so the design has room for it (OD3).

- **User intent:** pay a saved payee or a bill.
- **Personas:** R1, R2.
- **Trigger:** invoice received; recurring bill due.
- **Entry points:** P27 Payees & bill pay `/payments`; counterparty page P19 "pay this counterparty".
- **Journey:**
  1. S45 Payee list: search and select a payee, or add one.
  2. Continue into the F6 transfer form pre-filled with the payee.
  3. Step-up (X4), submit, confirmation.
- **Decision points:** existing vs new payee; pay now vs schedule.
- **Emotional state:** routine for known payees; cautious for new ones.
- **Failure paths:** new payee details invalid; payee changed bank details recently; step-up failed.
- **Recovery paths:** validation messages per field; a changed-details warning requiring confirmation (C52); step-up retry.
- **System behavior:** `use-payees`, then `use-create-transfer`; payee changes audit-logged.
- **Completion criteria:** payment accepted and visible as `pending`.
- **Dependencies:** Required: payees, transfers, step-up re-auth, audit log; OD3 and OD5 answered.

## Role dashboards

D1–D4 are one page, P08 Dashboard `/dashboard`, composed by workspace role from the same sections. Why one page: the sections, hooks and states are identical; only order and visibility differ, so four routes would quadruple maintenance for no user benefit. D5–D7 are internal pages in the `(admin)` group.

### D1 — Owner dashboard

- **User intent:** cash position, anything unusual, and whether the business is fully set up.
- **Persona:** R1.
- **Trigger:** daily check; low-balance or large-transaction alert (X7); verification outcome.
- **Entry points:** default landing after X1 for `owner` at P08 Dashboard `/dashboard`; S01 Primary navigation; C38 CommandPalette.
- **Journey:**
  1. S13 Verification status notice appears first, only while the case is not `approved`, naming the next action.
  2. S14 Cash position shows total per currency with C41 DeltaChip.
  3. S15 Account summary lists each account with state.
  4. S17 Pending items lists pending transactions, running exports and verification requests.
  5. S18 Cash flow over time gives inflow vs outflow for the chosen range.
  6. S16 Recent activity links each row to P12.
- **Decision points:** finish verification (F5); drill into F2 or F3; invite a teammate (X6) from the empty-team hint; open P16 Runway calculator.
- **Emotional state:** wants reassurance in seconds; unwanted noise erodes trust.
- **Failure paths:**
  - Verification is `needs_info` but the owner does not notice.
  - No accounts yet because verification is still `submitted`.
  - One section fails while others load.
- **Recovery paths:**
  - S13 is the first thing the owner is told, with the analyst's request summarised and a link to P07.
  - S14 empty state explains that accounts appear after approval; no zero balance is shown as if it were real.
  - C58 SectionErrorBoundary isolates the failure; the rest of P08 stays usable.
- **System behavior:** as F1 plus `use-verification-case`; sections render independently; refetch on window focus.
- **Completion criteria:** the owner knows balance, movement and setup state.
- **Dependencies:** as F1 and F5.

### D2 — Finance dashboard

- **User intent:** know what needs reconciling and what moved.
- **Persona:** R2.
- **Trigger:** daily work; month-end.
- **Entry points:** landing for `finance` at P08 `/dashboard`; S01.
- **Journey:**
  1. S14 Cash position.
  2. S17 Pending items first among work queues: pending transactions, running and `ready` exports.
  3. S16 Recent activity with filters one click away on P11.
  4. S18 Cash flow over time.
  5. S13 only when verification blocks accounts.
- **Decision points:** open a pending item; start an export (F4); open P15 Compare periods.
- **Emotional state:** task-oriented; wants a queue, not a brochure.
- **Failure paths:**
  - Pending count is stale after a transaction posts.
  - An export in S17 has become `expired`.
- **Recovery paths:**
  - S17 refetches on focus and after any export or annotation mutation.
  - Expired export row offers "create again" into P18 pre-filled.
- **System behavior:** as F1; pending queries invalidated after mutations.
- **Completion criteria:** the finance lead knows what is pending and reaches it in one click.
- **Dependencies:** as F1 and F4.

### D3 — Accountant workspace

- **User intent:** switch into a client's books and start the period's work.
- **Persona:** R3.
- **Trigger:** start of a client's month-end.
- **Entry points:** landing for `accountant` at P08 `/dashboard`; C36 WorkspaceSwitcher in S01.
- **Journey:**
  1. C36 WorkspaceSwitcher lists every workspace the accountant belongs to; select one.
  2. P08 reloads for that workspace: S14, S17 (flagged and pending), S16.
  3. S03 Page title & actions shows the workspace name prominently.
  4. Shortcuts lead to P17 Statements, P18 Exports and P14 Flagged transactions.
- **Decision points:** which client workspace; statements vs exports first.
- **Emotional state:** context-switching fatigue; the workspace name must be unmistakable.
- **Failure paths:**
  - Stale data from the previous workspace flashes after switching.
  - Access revoked by the owner while the accountant is working.
- **Recovery paths:**
  - Query keys include the workspace ID, so no cross-workspace cache is ever shown; skeletons render until the new workspace's data arrives.
  - Revoked access removes the workspace from C36 and redirects to the next available workspace with a C24 Transient message.
- **System behavior:** `use-workspace`, `use-me`; switching resets workspace-scoped queries.
- **Completion criteria:** the accountant is in the right workspace with period tools one click away.
- **Dependencies:** Required: workspaces + memberships.

### D4 — Viewer overview

- **User intent:** confirm balances or a payment on the accounts they may see.
- **Persona:** R4.
- **Trigger:** a colleague or customer asks about a payment.
- **Entry points:** landing for `viewer` at P08 `/dashboard`.
- **Journey:**
  1. S14 Cash position, limited to permitted accounts.
  2. S15 Account summary, permitted accounts only.
  3. S16 Recent activity.
  4. Search via C38 or P11 Transaction search.
- **Decision points:** search for a payment.
- **Emotional state:** quick errand; should never meet a control they cannot use.
- **Failure paths:**
  - No permitted accounts.
  - Follows a shared export or statement link.
- **Recovery paths:**
  - Empty state naming the owner role as the one who grants access.
  - C59 PermissionGate on export and statement surfaces renders a not-permitted state.
- **System behavior:** as F1 with backend-filtered accounts; totals computed server-side over permitted accounts only.
- **Completion criteria:** the viewer confirms the fact they came for.
- **Dependencies:** as F1; permission filtering in the accounts endpoint.

### D5 — Support console

- **User intent:** answer a customer accurately without changing their data.
- **Personas:** R5 (R7 also).
- **Trigger:** incoming message thread from X9.
- **Entry points:** P33 Support console `/admin/support`; S01 Primary navigation (admin mode).
- **Journey:**
  1. S53 Support lookup: search by email or workspace name.
  2. Results show user status (`ACTIVE`, `PENDING`, `SUSPENDED`), workspace and verification state.
  3. Open the linked message thread (S36, S37 as used on P21).
  4. Reply, or escalate to R6 or R7.
- **Decision points:** answer directly vs escalate.
- **Emotional state:** time pressure; fear of acting on the wrong account.
- **Failure paths:**
  - Lookup matches several users.
  - User not found.
  - R5 tries to change a record.
- **Recovery paths:**
  - Results show disambiguating fields (email, workspace name).
  - Not-found empty state with the query kept.
  - Read-only by design: edit actions are absent for `support`.
- **System behavior:** `use-support-lookup`, `use-threads`, `use-thread`, `use-send-message`; lookups audit-logged.
- **Completion criteria:** the agent has the facts and replied or escalated.
- **Dependencies:** Exists: `GET /api/users`, `GET /api/users/{id}`. Required: support lookup, message threads, audit log.

### D6 — Compliance queue

- **User intent:** decide verification cases correctly and on time.
- **Personas:** R6 (R7 also).
- **Trigger:** cases in `submitted`.
- **Entry points:** P32 Compliance queue `/admin/compliance`; case link `/admin/compliance/[caseId]`.
- **Journey:**
  1. S51 Compliance case queue, filtered by state with C47 Active filter and sorted by age.
  2. Open a case: S52 Compliance case review in C22 Detail overlay shows business details, owners and documents.
  3. Choose approve, reject or request info; write the reason or message.
  4. Confirm with C52 ConfirmDialog.
  5. The queue refreshes and the next case is offered.
- **Decision points:** approve / reject / `needs_info`.
- **Emotional state:** careful; each decision carries regulatory weight.
- **Failure paths:**
  - A document fails to load.
  - Another analyst decided the case first.
  - Decision submission fails.
- **Recovery paths:**
  - Per-document retry.
  - Conflict shows the other decision and blocks a second one.
  - Failed submit keeps the drafted reason.
- **System behavior:** `use-compliance-cases`, `use-compliance-case`, `use-decide-case`; decisions audit-logged with reason; queue invalidated after a decision.
- **Completion criteria:** the case moves to a decided state with a recorded reason, and R1 is notified (X7).
- **Dependencies:** Required: verification cases (compliance side, decision), notifications, audit log.

### D7 — Platform admin overview

- **User intent:** see platform health and manage users.
- **Personas:** R7 (R5, R6 read P29).
- **Trigger:** routine review; support escalation.
- **Entry points:** P29 Admin overview `/admin`; P30 Admin users `/admin/users`; P31 Admin user detail `/admin/users/[userId]`.
- **Journey:**
  1. P29 S48 Platform growth figures: total users and a series chart.
  2. P30 S49 Platform user directory: search, filter by role and status.
  3. Create a user through C21 Dialog.
  4. P31 S50 Admin user record: edit role and status; delete with C52 ConfirmDialog.
- **Decision points:** create, edit, suspend or delete a user.
- **Emotional state:** deliberate; destructive actions must feel heavy.
- **Failure paths:**
  - A non-admin reaches `/admin`.
  - Email already taken on create.
  - An admin tries to delete their own account.
- **Recovery paths:**
  - The admin guard sends non-internal roles to P34 Not found (the admin area is not advertised).
  - Field-level error on duplicate email; form values kept.
  - Self-delete disabled with an explanation.
- **System behavior:** `use-admin-user-total`, `use-admin-user-series`, `use-admin-users`, `use-create-user`, `use-admin-user`; mutations invalidate the users list and totals.
- **Completion criteria:** the admin sees current totals and the user change is saved.
- **Dependencies:** Exists: `GET /api/stats/users/total`, `GET /api/stats/users/series`, `GET` + `POST /api/users`, `GET` + `PATCH` + `DELETE /api/users/{id}`. Required: finer platform roles (A9), audit log.

## Supporting flows

### X1 — Sign in

- **User intent:** get into the workspace securely.
- **Personas:** R1–R7.
- **Trigger:** opening Ledgerline while signed out; a protected link that redirects with `next`.
- **Entry points:** P02 Sign in `/auth/login`; P01 Home; redirect from any protected route with `next`.
- **Journey:**
  1. P02 S08 Authentication step, sign-in variant: email and password.
  2. Submit.
  3. If two-step is enabled, P06 Two-step verification `/auth/verify` asks for the code or passkey (OD6).
  4. Redirect to `next`, or to P08 (internal roles to P29).
- **Decision points:** forgot password (X5); register instead (X2).
- **Emotional state:** neutral; irritated by vague errors or a lost `next`.
- **Failure paths:**
  - Wrong credentials.
  - Account `SUSPENDED` or `PENDING`.
  - Two-step code wrong or expired.
  - Backend unavailable.
- **Recovery paths:**
  - One generic credential error (no user enumeration); email kept in the field.
  - Suspended or pending state explained with a route to X9.
  - Resend code and retry.
  - X10 outage state with retry.
- **System behavior:** `use-login` posts to the `app/api/session` route handler, which sets the session cookie; `use-verify-challenge` for two-step; the proxy redirects signed-in users away from `/auth`. Sign-in attempts audit-logged by the backend.
- **Completion criteria:** session established and the user lands on `next` or their default page.
- **Dependencies:** Exists: `POST /api/auth/login`, `GET /api/users/me`. Required: two-step verify (OD6).

### X2 — Register

- **User intent:** create an account and start onboarding.
- **Persona:** R1.
- **Trigger:** "Get started" on P01. **2.0.0 note:** the built P01 routes its start actions to X11 instead of this flow (OD10); this flow remains the specified path for owners.
- **Entry points:** P03 Register `/auth/register`; link from P02.
- **Journey:**
  1. P03 S08 Authentication step, register variant: name, email, password.
  2. Submit; the user and session are created.
  3. Redirect to P07 Onboarding & verification (F5).
- **Decision points:** already have an account → P02.
- **Emotional state:** curious, low commitment; ask only what is needed.
- **Failure paths:**
  - Email already in use.
  - Password fails policy.
  - Network error.
- **Recovery paths:**
  - Field-level error with a link to sign in.
  - Policy shown inline before submit.
  - Values kept on retry.
- **System behavior:** `use-register` posts to `app/api/register`; session cookie set on success; Zod validation on the client composes over the generated register schema.
- **Completion criteria:** the user is signed in and on P07.
- **Dependencies:** Exists: `POST /api/auth/register`.

### X3 — Sign out

- **User intent:** end the session on this device.
- **Personas:** R1–R7.
- **Trigger:** leaving a shared computer; end of day.
- **Entry points:** C37 UserMenu in S02 Global utilities.
- **Journey:**
  1. Open C37 UserMenu.
  2. Choose "Sign out".
  3. Session cleared; land on P02 with a signed-out confirmation.
- **Decision points:** none.
- **Emotional state:** wants certainty that balances are no longer visible.
- **Failure paths:**
  - Network error during sign-out.
- **Recovery paths:**
  - The cookie is cleared regardless and the query cache is emptied, so no data remains in memory.
- **System behavior:** `use-logout` calls `DELETE` on `app/api/session`; the TanStack Query cache is cleared.
- **Completion criteria:** no authenticated data visible; the back button does not show cached balances.
- **Dependencies:** none beyond the session route handler.

### X4 — Session expiry and step-up re-authentication

- **User intent:** stay safe without losing work.
- **Personas:** R1–R7.
- **Trigger:** idle timeout or absolute timeout (OD2); a sensitive action such as revealing an account number (and, later, F6 and F7).
- **Entry points:** C55 SessionExpiryDialog anywhere in `(app)` and `(admin)`; C42 MaskedAccountNumber reveal; P06 Two-step verification.
- **Journey:**
  1. Before idle expiry, C55 warns with a countdown.
  2. "Stay signed in" extends the session; otherwise the session ends.
  3. On expiry, re-authentication happens in place and the user returns to the same URL.
  4. For step-up: the sensitive action asks for password or two-step, then proceeds.
- **Decision points:** stay signed in vs sign out; complete step-up vs cancel.
- **Emotional state:** mildly annoyed; tolerant when work is not lost.
- **Failure paths:**
  - Session expired mid-export.
  - Unsaved note in S26 when the session expires.
  - Step-up failed repeatedly.
  - Expiry in another tab.
- **Recovery paths:**
  - The export job continues server-side and shows `ready` in S32 after re-authentication.
  - Drafts are kept in component state across the dialog and saved after re-authentication.
  - After repeated step-up failure the number stays masked and the user is pointed to X5.
  - Expiry is broadcast across tabs so every tab shows C55.
- **System behavior:** a 401 from any call opens C55 rather than hard-redirecting; step-up grants are short-lived; reveals audit-logged.
- **Completion criteria:** the user is re-authenticated at the same place, or signed out cleanly.
- **Dependencies:** Required: session policy endpoints, step-up re-auth, sessions list (OD2).

### X5 — Password reset

- **User intent:** regain access after forgetting a password.
- **Personas:** R1–R7.
- **Trigger:** "Forgot password" on P02; repeated step-up failures.
- **Entry points:** P04 Forgot password `/auth/forgot-password`; the emailed link to P05 Reset password `/auth/reset-password`.
- **Journey:**
  1. P04 S08 forgot variant: enter email.
  2. Neutral confirmation ("if an account exists, a link is on its way").
  3. Email link opens P05 S08 reset variant: new password twice.
  4. Land on P02 with a success message.
- **Decision points:** request a new link.
- **Emotional state:** locked out, anxious; needs a short path.
- **Failure paths:**
  - Reset token expired or already used.
  - Email never arrives.
- **Recovery paths:**
  - Expired-token state with "send a new link".
  - P04 copy explains spam folders and links to X9.
- **System behavior:** `use-request-password-reset`, `use-reset-password`; responses never reveal whether an email exists; other sessions revoked on reset.
- **Completion criteria:** the password is changed and the user can sign in.
- **Dependencies:** Required: password reset request and confirm.

### X6 — Invite teammate and manage roles

- **User intent:** give the right person the right access.
- **Personas:** R1 (any role), R2 (viewer and accountant only).
- **Trigger:** new hire; accountant engaged; someone leaves.
- **Entry points:** P23 Team `/settings/team`; P24 Team member profile `/settings/team/[memberId]`; D1 empty-team hint.
- **Journey:**
  1. P23 S39 Team members lists members, roles and pending invitations.
  2. "Invite" opens S40 Invite member form in C21 Dialog: email, role, permitted accounts for a viewer.
  3. The invitation appears as pending in S39.
  4. S41 Role permissions reference explains what each role can do.
  5. Role change or removal from the S39 row menu (C20 Menu), confirmed with C52 ConfirmDialog.
  6. P24 shows a member read-only (S42 variant) with S41.
- **Decision points:** which role; which accounts for a viewer; remove vs downgrade.
- **Emotional state:** cautious about over-sharing.
- **Failure paths:**
  - Invitee is already a member.
  - R2 tries to invite an owner.
  - Removing the last owner.
  - Invitation expired before acceptance.
- **Recovery paths:**
  - Inline error naming the existing member.
  - Role options filtered by C59 PermissionGate.
  - Last-owner removal blocked with an explanation.
  - "Resend invitation" on the pending row.
- **System behavior:** `use-team`, `use-invite-member`, `use-team-member`; role changes audit-logged; a removed member loses workspace access on their next request.
- **Completion criteria:** invitation sent or role change saved and reflected in S39.
- **Dependencies:** Required: workspaces + memberships + invitations, audit log.

### X7 — Notifications and alerts

- **User intent:** hear about what matters without watching the screen.
- **Personas:** R1–R4 (rules: R1, R2).
- **Trigger:** low balance, large transaction, statement ready, export ready, verification needs info.
- **Entry points:** C39 Notification entry point in S02; P20 Notifications `/notifications`; S35 Alert rules on P22 Workspace settings `/settings`.
- **Journey:**
  1. C39 shows the unread count.
  2. P20 S34 Notification feed lists items newest first.
  3. Each item links to its subject: P12, P17, P18 or P07.
  4. Opening an item marks it read.
  5. R1 and R2 set thresholds in S35 Alert rules.
- **Decision points:** open the subject; adjust a rule.
- **Emotional state:** alert fatigue if noisy; trust if precise.
- **Failure paths:**
  - A notification links to a transaction the member can no longer see.
  - The export in an "export ready" notice has since `expired`.
  - A large-transaction alert fires for a `pending` debit that is later `returned`.
  - Rule save fails.
- **Recovery paths:**
  - Not-permitted subject renders P34 Not found.
  - Expired export shows "create again".
  - P12 timeline (S25) shows the return, so the alert is explained, not contradicted.
  - Rule form keeps values with retry.
- **System behavior:** `use-notifications` (count in S02 refetches on focus and on an interval; feed paginated), `use-alert-rules`, `use-update-alert-rules`.
- **Completion criteria:** the user reached the subject, or the rule is saved.
- **Dependencies:** Required: notifications (list, mark read, count), alert rules.

### X8 — Profile and security settings

- **User intent:** keep personal details and account security current.
- **Personas:** R1–R4.
- **Trigger:** name change; security review; unrecognised session.
- **Entry points:** C37 UserMenu → P25 Profile & security `/settings/profile`.
- **Journey:**
  1. S42 Profile form: name, avatar.
  2. S43 Security settings: change password.
  3. Enrol two-step (OD6).
  4. View active sessions and revoke one, confirmed with C52.
- **Decision points:** revoke a session; enable two-step.
- **Emotional state:** in control; alarm if an unknown session appears.
- **Failure paths:**
  - Current password wrong.
  - Two-step enrolment code invalid.
  - Revoking the current session.
- **Recovery paths:**
  - Field error, other values kept.
  - Restart enrolment.
  - Revoking the current session signs out via X3 after confirmation.
- **System behavior:** `use-me`, `use-update-profile`, `use-change-password`, `use-sessions`, `use-two-step`; security changes audit-logged.
- **Completion criteria:** change saved and confirmed by C24 Transient message.
- **Dependencies:** Exists: `GET /api/users/me`, `PATCH /api/users/{id}`. Required: change password, sessions list and revoke, two-step enrol.

### X9 — Help and support contact

- **User intent:** get an answer, first by self-service, then from a person.
- **Personas:** all (messaging: R1–R3).
- **Trigger:** confusion; frozen account; rejected verification.
- **Entry points:** P28 Help center `/help` and `/help/[slug]`; in-app help link; P21 Messages `/messages` and `/messages/[threadId]`.
- **Journey:**
  1. P28 S46 Help search & categories.
  2. S47 Help article.
  3. "Still need help" leads to P21 S36 Thread list.
  4. S37 Conversation: write a message, attach a file.
- **Decision points:** self-serve vs message support.
- **Emotional state:** frustrated; wants a human without re-explaining.
- **Failure paths:**
  - No article matches.
  - Message send fails.
  - R4 has no messaging access.
- **Recovery paths:**
  - Empty search offers "message support".
  - Unsent message kept with retry.
  - R4 sees how to ask an owner.
- **System behavior:** help articles from `lib/data/` searched with `use-debounced-search`; `use-threads`, `use-thread`, `use-send-message`.
- **Completion criteria:** an article answered the question, or a thread is open with support (D5).
- **Dependencies:** Required: message threads.

### X10 — Error, offline and outage recovery

- **User intent:** understand what went wrong and get back to work.
- **Personas:** all.
- **Trigger:** unknown route; server error; network loss; backend outage.
- **Entry points:** P34 Not found; P35 Server error; per-section errors.
- **Journey:**
  1. A section-level failure shows C33 ErrorState with retry; the rest of the page works.
  2. A route-level failure shows P35 with retry and a link to P08.
  3. An unknown route shows P34.
  4. Loss of network shows the S54 offline variant and retries when back online.
- **Decision points:** retry vs go to dashboard vs contact support.
- **Emotional state:** worried that money is affected; copy says plainly that viewing failed, not that funds changed.
- **Failure paths:**
  - The outage persists.
  - The error occurs inside the shell itself.
- **Recovery paths:**
  - The health check result is shown when the backend reports unavailable.
  - `global-error.tsx` renders as the last resort.
- **System behavior:** C58 SectionErrorBoundary per section; TanStack Query retries reads with backoff and never retries mutations automatically; no `console` logging in the client.
- **Completion criteria:** the user is back on a working page or knows the service is down.
- **Dependencies:** Exists: `GET /api/health`.

### X11 — Get-started enquiry

Added in 2.0.0 from the built home page. Its place in the product depends on [OD10](phase-1-product-vision.md#od10--entry-path-from-the-public-site).

- **User intent:** tell Ledgerline "I am interested" without committing to registration.
- **Persona:** R8 Prospect.
- **Trigger:** reading P01 and choosing "Open an account", "Book a demo" or "Get started".
- **Entry points:** P01 primary actions (S04, S55, S62) which lead to S64 Get-started enquiry on the same page.
- **Journey:**
  1. The visitor reaches S64 and enters a work email.
  2. Submit validates the email on the client (`contactSchema` in `lib/validations/contact.ts`).
  3. A valid email shows a confirmation; an invalid one shows a field error naming the problem.
- **Decision points:** enquire vs register (X2) vs sign in (X1) — today only enquiry is offered from P01 (OD10).
- **Emotional state:** low commitment; wary of being put on a mailing list; needs to know what happens next.
- **Failure paths:**
  - Invalid or empty email.
  - The visitor is an existing member looking for sign-in and finds only an enquiry form.
  - Intake service unavailable (once one exists).
- **Recovery paths:**
  - Field error announced and linked to the field; value kept.
  - Until OD10 is answered, the enquiry confirmation must not imply that sign-in or registration happened.
  - Intake failure keeps the email and offers retry.
- **System behavior:** today the form validates and sends nothing; its confirmation copy says so (design-study state). When OD10 chooses an intake, submission goes through a hook wrapping a Server Action or a route in `lib/api-routes.ts`; the email is never placed in a URL.
- **Completion criteria:** the visitor knows their enquiry was received (or, in the design-study state, that nothing was sent) and what happens next.
- **Dependencies:** Required once OD10 is answered: an enquiry intake endpoint or service. Today: none.

## Backend dependency summary

| Resource | Exists today | Flows |
|---|---|---|
| Auth register, login | Exists | X1 X2 F5 |
| Users list, create, me, get, update, delete | Exists | D5 D7 X1 X8 |
| Health | Exists | X10 |
| User stats total and series | Exists | D7 |
| Workspaces, memberships, invitations | Required | F1 F5 D3 X6 |
| Accounts, balances | Required | F1 F2 D1–D4 |
| Transactions (list, detail, annotations, attachments) | Required | F1 F2 F3 |
| Ledger summary, cash-flow series, compare periods | Required | F1 F2 F4 |
| Counterparties, saved views | Required | F3 |
| Statements, exports | Required | F4 |
| Notifications, alert rules | Required | X7 |
| Message threads | Required | X9 D5 |
| Verification cases (workspace and compliance) | Required | F5 D6 |
| Sessions, password reset, two-step, step-up | Required | X4 X5 X8 |
| Support lookup, audit log | Required | D5 and all audited actions |
| Transfers, payees | Required (outside v1) | F6 F7 |
| Enquiry intake | Not decided (OD10); the built form sends nothing | X11 |

## Assumptions

- A3 applies to every Required dependency: the backend publishes it through the OpenAPI contract.
- A4 underlies D3 and workspace-scoped query keys.
- A9 underlies D5–D7 guards.
- Phase-local: role change and member removal in X6 are mutations on the memberships resource; their hook names are fixed in [Phase 7](phase-7-frontend-architecture.md).
- Phase-local: workspace creation in F5 step 1 uses the workspaces resource; its hook name is fixed in Phase 7.
- Phase-local: export default includes posted transactions only; including `pending` is an explicit option.

## Changes in this version

- **Retained:** F1–F7, D1–D7, X1–X10 with every step, failure and recovery path.
- **Changed:** section and contract names updated to the 2.0.0 names; "drawer" wording replaced by "overlay" (the route slot keeps its code name `@drawer`); visual wording (tones, "visibly distinct", "placed first") rewritten as behaviour; phase links renumbered to the 9-phase set.
- **Added:** X11 Get-started enquiry; R8 in the flow index; enquiry intake in the dependency summary; OD9 and OD10 notes.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md): personas R1–R8, JTBD, business rules BR1–BR12, permission matrix, open decisions OD1–OD10.
- **Downstream:**
  - [Phase 3](phase-3-information-architecture.md) builds navigation and route groups from the entry points here.
  - [Phase 4](phase-4-page-blueprints.md) specifies every page named in a journey.
  - [Phase 5](phase-5-section-blueprints.md) specifies every section and its failure and recovery states.
  - [Phase 7](phase-7-frontend-architecture.md) fixes hooks, query keys, polling and the backend contract listed under Dependencies.
  - [Phase 8](phase-8-implementation-roadmap.md) sequences the flows and records progress, including F6 and F7.
  - [Phase 9](phase-9-qa-checklist.md) turns completion criteria and recovery paths into test cases.
