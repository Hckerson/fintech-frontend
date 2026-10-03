# Ledgerline Design OS — Phase 2: Experience Maps

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
- **Audit** means the backend records the event; the frontend never writes audit entries itself. An audit record names the actor, the workspace, the action, the subject's opaque ID, the time and the outcome; it never holds an amount, a full account number, a password or a document's content (P2-A12).
- Money follows [BR1–BR4](phase-1-product-vision.md#money): minor units in a string, `Intl.NumberFormat`, sign always given in text, ordinary debits never presented as problems, problem severity only for `returned` and `failed`. Amounts in different currencies are never added, compared or netted; a `pending` amount is never counted into a posted total.
- Every section in a journey owns its loading, empty, error and populated states through C57 QueryBoundary; failure paths below list only the domain-specific ones.
- Maps describe intent and behaviour only. Build status lives in [Phase 8](phase-8-implementation-roadmap.md); how any step looks is decided when its page is built.
- Section and contract names follow the 2.0.0 names (for example S14 Cash position, formerly "Cash position band"); the full rename table is in [Phase 5](phase-5-section-blueprints.md#names-in-this-version) and [Phase 6](phase-6-interaction-contracts.md#names-in-this-version).
- [OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is) is open: the built home page presents payments, cards and treasury capabilities that these maps (side A) keep Deferred or out of scope.

Behaviour every map inherits (a map restates one of these only where its handling differs):

- **Time.** "Today", month ends and every period boundary are computed in the workspace's time zone (an IANA zone held in workspace settings; UTC when none is set), not the viewer's, so two members in different countries see the same "today's movement" and the same statement period. Posting dates are calendar dates and are never shifted. Event times and "as of" times are given in the viewer's zone with the zone named; internal `(admin)` sections use UTC (P2-A1).
- **Freshness.** Every balance and total carries the backend's "as of" time. Cached figures are reused for the `STALE_TIME` tier of their resource (`live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never; fetched data is kept 5 minutes after its last use, `GC_TIME_MS`; [Phase 7 §21.6](phase-7-frontend-architecture.md#216-staletime-policy)); a figure given after a failed refresh, while offline, or whose "as of" time is more than 15 minutes old (`BALANCE_STALE_AFTER`) is disclosed in words as possibly out of date (P2-A2).
- **Timeout.** A request still unanswered after 10 s is acknowledged in words as slow (`SLOW_REQUEST_MS`). A read with no answer after 15 s (`REQUEST_TIMEOUT_MS`) is treated as failed and retried per X10. A write with no answer after 30 s (`MUTATION_TIMEOUT_MS`) has an **unknown outcome**: the person is told it could not be confirmed, the state is re-read from the server before anything is offered again, and nothing is re-sent automatically (P2-A3).
- **Session expiry mid-flow.** A 401 opens X4 in place. What the person had typed stays as a draft in the open tab's memory — never in `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and gone when the tab closes; a read is repeated after re-authentication; a write interrupted by expiry or by a step-up is never replayed automatically — the person re-submits it after re-authenticating, and the re-submission carries the same idempotency key. If a different user re-authenticates, every draft is dropped.
- **Permission changed mid-flow.** The backend is the authority (BR9). A 403 on something the person could do a moment ago re-reads their membership, withdraws what they may no longer do, and tells them in words that their access changed and who can restore it. Drafts of a write they may no longer make are kept for copying, not saved.
- **Double submission.** Every write is disabled from submission until its answer or timeout. Creating writes (export job, invitation, message, note, enquiry, and later transfer) carry a `nanoid` idempotency key generated once per attempt, so a repeat with the same key returns the original result instead of a second record.
- **Conflicting edit.** A write carries the version of the record the person last read. If a colleague changed it since, the backend refuses with a conflict (409); the newer value and its author are given, the person's own text is kept for re-applying, and nothing is overwritten silently. Last-write-wins is never used anywhere. Notes are append-only, so the rule applies to edits such as category, flag and saved views (P2-A10).
- **Unexpected backend state.** A response that fails its Zod schema is a section error (C33), never a partial render: no amount is shown from a response that did not validate. A lifecycle state the client has no label for is named "Unknown state" in words (C12), actions on that record are withheld, and the reference below is given.
- **Reference.** Every failure a person can meet carries a reference they can quote to support (X9); the reference is required, never optional, and a refusal produced before the backend is reached (validation, offline) carries one generated by the client; R5 can find the failed request by it. The reference contains no personal or financial data (P2-A11).
- **Privacy.** URLs, page titles, analytics events and client-side error reports contain opaque IDs only: no amount, account number, counterparty name, email or note text.
- **Offline.** Writes are refused while offline and are never queued for later (X10).
- **Role denial.** A route for a resource the member may not know exists (an account, transaction or counterparty outside their permitted accounts; any `(admin)` route for a workspace member) answers as P34 Not found. A capability their role lacks on a page they may open is withheld by C59 PermissionGate, which names the roles that have it. A whole page their role may not open gives the not-permitted empty state (C32), which explains which role can do this; it is never the error state (C33). These answers are never swapped.

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
  1. P08 loads within the `(app)` layout (S01 Primary navigation, S02 Global utilities); S03 Page identity & actions names the workspace.
  2. S14 Cash position tells the user total cash per currency (one figure per currency) and today's net movement (C41), each with its "as of" time. Available and current balance are distinguished in words wherever both are given.
  3. S15 Account summary gives each account's balance, names any non-`active` state in words (C12), and reaches P10.
  4. S16 Recent activity gives the latest transactions; `pending` ones are identified as pending in words.
  5. S17 Pending items surfaces pending transactions, running exports and verification needs.
  6. S18 Cash flow over time gives inflow vs outflow for the chosen range (30 / 90 days, C23), posted transactions only, one currency at a time.
  7. The user either leaves satisfied or drills into an account (F2) or a transaction (F3).
- **Decision points:** drill into an account or a transaction; change chart range; act on a pending item. By role: R1 may act on a verification need (F5); R2 and R3 may act on an export item (F4) but not on verification; R4 is offered no export or verification item, and every figure covers permitted accounts only and says so.
- **Emotional state:** anxious or hurried on arrival, often with a specific worry (will payroll clear, did the customer's payment land) → reassured when the total appears fast and exact; alarmed if a figure looks wrong, which is why exactness (BR1) is non-negotiable. A figure with no "as of" time is worse than a late one: it cannot be trusted or challenged.
- **Failure paths:**
  - Accounts in more than one currency: totals must never be summed across currencies; S14 shows one value per currency.
  - An account is `frozen` or `pending_verification`: balance may be shown but the state must be explicit.
  - Balance source (OD5) is delayed: figures are stale without the user knowing.
  - R4 has no permitted accounts: empty dashboard that looks broken.
  - Partial failure: balances load but recent activity, pending items or cash flow do not, or one account's balance is missing from the response while others are present.
  - Today's movement and the pending count disagree with the balance because they were read at different moments.
  - A `closed` account still holds history; a workspace with many accounts exceeds `DASHBOARD_ACCOUNT_LIMIT` (6).
  - The workspace's "today" has rolled over while the page stayed open (midnight, or a daylight-saving change, in the workspace's time zone).
  - Access to the workspace, or to one account, is withdrawn while the page is open.
- **Recovery paths:**
  - Stale data: S14 gives the "as of" time from the backend; C33 ErrorState retry on fetch failure. After a failed refresh the last good figures stay, disclosed as possibly out of date with their time, and are never blanked or zeroed.
  - Frozen account: the state is named in words, with a way to X9 Help and support contact.
  - R4 with nothing permitted: C32 EmptyState explaining that an owner grants account access, naming the owner role.
  - Partial failure: each section fails alone (C58); a per-currency total is withheld, not understated, when any account in that currency has no balance, and the missing account is named. Retrying a section re-requests only that section and keeps the chosen range.
  - Mismatched moments: every figure carries its own "as of" time; a refresh re-reads balances, movement and pending together.
  - Many accounts: the summary covers `DASHBOARD_ACCOUNT_LIMIT` accounts and states how many more exist, reaching P09 for all; totals are computed by the server over every account, not over the ones listed. `closed` accounts are excluded from cash totals and stay reachable for history.
  - Date rollover: a refocus after the workspace day changes re-reads "today's movement" for the new day.
  - Access withdrawn: the next request returns 403 or 404; cached figures for that workspace or account are dropped at once and the person is told access changed (see conventions).
- **System behavior:** `use-accounts` (balances), `use-transactions` with a limit (S16), `use-transactions` pending filter + `use-exports` + `use-verification-case` (S17), `use-cash-flow` (S18). Query keys include workspace ID. Balances and pending counts are `live` tier (15 s); refetch on window focus and on reconnect; no polling on the dashboard. Reads retry twice with backoff, then fail to C33. Totals and today's movement are server-computed; the client adds no amounts. No audit event for viewing.
- **Completion criteria:** all of the following are true and testable: (1) one total per currency is given, never a cross-currency sum; (2) every account the role may see is listed or counted, each with balance and state in words; (3) today's movement is for the workspace-time-zone day; (4) every figure has an "as of" time and is disclosed as possibly out of date when older than 15 minutes or served from cache after a failure; (5) with one section failing, the others remain usable.
- **Dependencies:** Exists: `GET /api/users/me`; `GET /api/accounts` (the signed-in member's accounts with available and current balance; today not workspace-scoped, with states `OPEN` / `FROZEN` / `CLOSED`, whose mapping to the specified account states is OD11, and no "as of" time on the record); `GET /api/cash-flow` (posted inflow, outflow and net for one currency, ranges 30d / 90d / 12m). Required: workspaces + memberships, account scoping by workspace and by viewer permission, a balance "as of" time, the `pending_verification` account state, server-computed per-currency totals and today's movement, transactions (list with filters), exports (list), verification cases (workspace side).

### F2 — Review an account's ledger

- **User intent:** read every movement on one account for a period, filtered to what matters.
- **Personas:** R2 primarily; R1, R3; R4 for permitted accounts.
- **Trigger:** month-end; a question about an account; clicking an account on P08.
- **Entry points:** P09 Accounts `/accounts`; S15 on P08; C38 CommandPalette account search; direct link `/accounts/[accountId]` with filters in URL.
- **Journey:**
  1. On P09, S19 Account directory lets the user identify each account (masked, C42) and see its balance and state.
  2. Selecting an account opens P10 Account ledger `/accounts/[accountId]`.
  3. S20 Account overview gives balance and state; the masked number can be copied (C51) and the full number revealed after step-up (X4).
  4. S21 Ledger filters narrows by date range (C48), type, direction, status, category, amount range, flagged and attachment (C46, C47); filters write to URL params. With no date range the ledger reads newest first and pages back by cursor without limit.
  5. S22 Ledger summary gives server-computed opening balance, credits, debits and closing balance for the filter.
  6. S23 Ledger entries streams transactions with cursor pagination and virtualization (C53); the user's position is kept on back navigation.
  7. The user opens a transaction (F3), saves the filter as a view (P13), or exports the filtered set (F4).
- **Decision points:** narrow by filter vs scroll; save as view; export; reveal account number. By role: R1, R2 and R3 may save a view and export; R4 may read and filter permitted accounts only, is offered neither export nor annotation, and may not reveal a full account number (C42 `forbidden`); reveal belongs to R1, R2 and R3 after step-up, and never to a viewer or an internal role (R5–R7).
- **Emotional state:** focused and methodical, checking line by line against a bank statement or an accounting system; frustrated by lost scroll position, and distrustful the moment a closing balance differs from the statement by even one minor unit.
- **Failure paths:**
  - Account ID not found or not permitted for the member: P34 Not found (never reveal that the account exists).
  - Filter matches no transactions.
  - A `pending` transaction in view is later `returned`: its status and effect on the balance change after the user has noted it.
  - A 5-million-row ledger scrolled far: client memory grows if entries are not virtualized.
  - Reveal step-up fails (X4).
  - New transactions post while the user is reading, so loaded rows and the summary describe different moments.
  - A later page fails or times out after earlier pages loaded.
  - The URL carries an invalid filter (end before start, a range longer than `LEDGER_MAX_RANGE_DAYS` (731 days), an unknown status, a malformed amount) from a hand-edited or outdated link.
  - A saved view cannot be created because `SAVED_VIEW_LIMIT` (50 per member) is reached, or a colleague renamed or deleted the view meanwhile.
  - A date range crosses a month end or daylight-saving change and the period boundary is ambiguous.
  - The account becomes `frozen` or `closed`, or the member's access to it is withdrawn, while it is open.
- **Recovery paths:**
  - No matches: C32 EmptyState tells the user nothing matches and offers to clear the filters, resetting URL params.
  - Returned transaction: its status is named `returned` with problem severity and the timeline (S25) explains it; S22 totals refresh from server.
  - Long scroll: virtualization keeps the DOM small; "jump to date" via C48 instead of scrolling. Loaded pages are capped (`LEDGER_MAX_PAGES`, 10); pages dropped from memory are re-requested by cursor when scrolled back to.
  - Step-up failure: number stays masked; copy explains why; retry available.
  - Moving ledger: the summary and the rows each carry an "as of" time; when the server reports newer entries the user is told how many and chooses when to load them, so the place being read never shifts unasked. Cursors are opaque and stable, so no row is skipped or duplicated.
  - Later page failure: rows already loaded and the scroll position stay; only the failed page is retried from its cursor. The summary is unaffected.
  - Invalid URL filter: the invalid parameter is dropped, the rest applied, and the user is told which filter was ignored; nothing is guessed. The 731-day limit applies only when both a start and an end date are given; when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared.
  - Saved view limit or conflict: the filter stays applied in the URL; the limit is stated with a way to P13 to remove one; a rename conflict is reported against the name.
  - Period boundaries: ranges are inclusive calendar dates in the workspace time zone (P2-A1) and are stated in words with both end dates.
  - State or access change: a state change is named in words on the next refresh and history stays readable; withdrawn access answers as P34 and drops the cached ledger.
- **System behavior:** `use-account`, `use-ledger-summary`, `use-transactions` (infinite, cursor, `LEDGER_PAGE_SIZE` of 50 per page). Filters are server-side; URL is the source of truth for filter state and holds no account number or counterparty text beyond the member's own search term. Summary is never computed by summing loaded rows; it is requested with the same filter and must be for one currency. Ledger and summary are `live` tier and refetch on focus; no polling. Reveal is audit-logged by the backend with the actor and account; a revealed number re-masks after `REVEAL_TIMEOUT` (30 s, with a 10 s warning and the option to extend), on leaving the page and when the window loses focus, and is never written to the URL, the cache or the clipboard without the copy action.
- **Completion criteria:** (1) for any filter, opening balance + credits − debits = closing balance as given by the server summary, and no client-computed total exists; (2) reloading the URL reproduces the same filter and, for an unchanged ledger, the same rows; (3) scrolling 10,000 rows forward and back shows no skipped or duplicated row; (4) returning from a transaction restores the prior position; (5) a not-permitted account ID and a non-existent one produce the same answer.
- **Dependencies:** Exists: `GET /api/accounts` (list only). Required: account detail, transactions (cursor list with server-side filters and a count of newer entries), ledger summary for a filter, saved views (with a limit and versioning), step-up re-auth and reveal endpoint, audit log.

### F3 — Investigate a transaction

- **User intent:** find one transaction, understand it and leave a trace of what was learned.
- **Personas:** R2, R3 primarily; R1; R4 read-only.
- **Trigger:** unknown debit; accountant query; customer payment confirmation; large-transaction alert (X7).
- **Entry points:** C38 CommandPalette (⌘K / Ctrl+K); P11 Transaction search `/transactions`; a transaction in S23 or S16; P14 Flagged transactions `/transactions/flagged`; P13 Saved views `/transactions/views`; a shared link `/transactions/[transactionId]`; X7 notification.
- **Journey:**
  1. The user searches by counterparty, amount or reference in C38 or S21 on P11; results arrive in S23.
  2. Opening a transaction from a list opens P12 Transaction detail on the intercepted route (C22) without losing the list's position; a direct link opens the full page.
  3. S24 Transaction detail tells the user the amount (C40), status, account, counterparty and references; the share link can be copied (C51).
  4. S25 Transaction lifecycle gives lifecycle events (`pending` → `posted` → `returned` / `reversed`).
  5. The user follows the counterparty to P19 Counterparty `/counterparties/[counterpartyId]`, where S33 Counterparty summary and S23 give history with that party.
  6. Back on P12, S26 Notes & attachments: add a note, set a category, flag, attach a receipt.
  7. The user copies the share link or returns to the list with position intact.
- **Decision points:** open over the list vs full page; annotate vs flag for someone else; follow counterparty. By role: R1, R2 and R3 annotate, flag and attach; R4 reads only and sees transactions on permitted accounts only; a note's author, or an owner, may remove a note or attachment, anyone else may not.
- **Emotional state:** suspicious or puzzled, sometimes fearing fraud → relieved when the story is clear; keeping the list's context means the user does not feel lost. An annotation that silently fails to save is the worst outcome: the accountant's question is never asked.
- **Failure paths:**
  - Search matches nothing.
  - Shared link opened by a member without permission, or by someone signed out.
  - Two members change the same transaction's category or flag at once.
  - Attachment upload fails or file type is rejected.
  - R4 tries to annotate.
  - Search is too broad (one character, or an amount matching thousands of rows) or slow on a large workspace.
  - An amount search is ambiguous between major and minor units or between debit and credit.
  - The transaction changes state while open (a `pending` one posts or is `returned`), or its counterparty is merged or renamed by the backend.
  - A note is submitted twice, exceeds the length limit, or its save has an unknown outcome.
  - One of several attachments fails; the attachment count or size limit is reached; a file is refused by the backend's content scan.
  - The session expires, or the member's role is lowered to viewer, with an unsaved note.
  - The shared link's transaction ID is well-formed but belongs to another workspace.
- **Recovery paths:**
  - No match: EmptyState suggesting a wider date range, with the current query kept.
  - Signed out: proxy redirects to P02 with `next`, returning to the transaction after X1. Not permitted: P34 Not found.
  - Concurrent edit: notes are append-only, so two members' notes are both kept, in order. A stale edit of a category or flag is refused (409): the optimistic update rolls back with a C24 Transient message giving the newer value and its author, the member keeps what they entered and chooses what to do, and nothing is overwritten.
  - Upload failure: C49 File upload keeps the file listed with retry and the reason (size, type).
  - R4: annotation controls are absent via C59 PermissionGate; the view is read-only.
  - Broad or slow search: searching starts at 2 characters (`LEDGER_QUERY_MIN_LENGTH`; at most 100, `LEDGER_QUERY_MAX_LENGTH`; on-device page and help matches may start at 1) and is debounced by 300 ms (`SEARCH_DEBOUNCE_MS`); an in-flight search is cancelled when the query changes; results are cursor-paged and the user is told to narrow by date or account rather than being given a truncated set as if complete.
  - Amount search: "4200" matches 4200 major units in either sign (C38); the match rule is stated where search is offered.
  - State change while open: status and lifecycle refresh on focus; the change is named in words and announced once; notes and attachments are untouched.
  - Note: one idempotency key per save so a repeat creates no second note; the length limit (2,000 characters, `NOTE_MAX_LENGTH`, P2-A5) is stated before it is reached; after an unknown outcome the notes are re-read before the draft is offered again.
  - Attachments: each file succeeds or fails alone; successful ones stay attached; limits (10 MB per file, 10 per transaction, PDF / JPEG / PNG, P2-A5) are stated before selection; a scan refusal names the file and is not retryable.
  - Session or role change: the draft is kept in the open tab's memory through X4 and is not sent automatically; the member re-submits it, with the same idempotency key, after re-authenticating as the same user, and it is dropped if a different user re-authenticates; if the role no longer allows annotation the draft stays readable for copying and is not sent.
  - Other workspace's ID: P34, identical to a non-existent ID.
- **System behavior:** `use-debounced-search` feeds `use-transactions`; `use-transaction` for detail; `use-update-transaction` (optimistic, versioned) and `use-upload-attachment`; `use-counterparty`; `use-saved-views`. Detail is `standard` tier (60 s), invalidated by its own mutations and refetched on focus. Annotations are audit-logged with actor and time; each note carries its author and time, and removal is recorded, not erased from the audit record. Share link contains only the opaque transaction ID and grants nothing: the opener's own membership decides access. Attachments are downloaded through short-lived URLs fetched on request.
- **Completion criteria:** (1) the transaction is reachable from search by counterparty, amount and reference; (2) a saved note, category, flag or attachment is readable by a second member of the same workspace after their next refresh, with author and time; (3) a double submission yields one note; (4) a conflicting save overwrites nothing and loses no typed text; (5) closing the detail returns to the list at the prior position; (6) the same link opened by a non-member answers as P34.
- **Dependencies:** Required: transactions (search, detail, versioned PATCH of annotations, attachments with upload target, scan result and download URL), counterparties, saved views, audit log. None exists today.

### F4 — Export and reconcile

- **User intent:** get the period's statement and transaction data into the accounting tool and confirm balances match.
- **Personas:** R2, R3 primarily; R1.
- **Trigger:** month-end close; auditor request; "statement ready" or "export ready" notification (X7).
- **Entry points:** P17 Statements `/statements`; P18 Exports `/exports`; export action on P10 carrying current filters; P15 Compare periods `/insights/compare`; X7 notification.
- **Journey:**
  1. On P17, S30 Statement downloads offers a PDF statement per account per month.
  2. On P18, S31 Export request: the user chooses accounts, period (C48), format (CSV or OFX-style) and which data to include.
  3. Submitting creates a job; S32 Export jobs reports it `queued` → `running` → `ready`.
  4. The user downloads the file when `ready`; an X7 notification also arrives if they left.
  5. Optionally P15 S28 Period comparison compares the period against the previous one to spot anomalies before closing.
  6. The user reconciles in their accounting tool against S22 totals and the statement.
- **Decision points:** statement vs export; which format; compare before closing. By role: R1, R2 and R3 may create and download; a member sees and downloads their own jobs; R1 and R2 also see every job in the workspace, and R3 sees only their own; R4 has neither statements nor exports.
- **Emotional state:** under deadline pressure at month-end, often with an auditor or a filing date waiting; relieved when the file is right first time; distrustful if totals differ, and unforgiving of a file that looks complete but is not.
- **Failure paths:**
  - Statement not yet generated for the current month.
  - Export job `failed`.
  - Export job `expired` before download.
  - Session expires while the job is running (X4).
  - Export totals differ from the statement because pending transactions were included.
  - R4 reaches P18 by URL.
  - The same export is submitted twice (double activation, or a colleague requesting the same period).
  - The requested range exceeds `EXPORT_MAX_RANGE_DAYS`, the member already has the maximum active jobs, or the export would exceed the largest file the backend produces (5,000,000 rows, `EXPORT_MAX_ROWS`).
  - A job stays `queued` or `running` far longer than expected.
  - Accounts in the export use more than one currency.
  - Transactions post, or a `pending` one is `returned`, between export and reconciliation, so a later ledger no longer matches the file.
  - The download URL expires between request and use, or the download is interrupted.
  - A statement is reissued after a correction.
  - The member's role is lowered, or an account in the job is no longer permitted, after the job was created.
- **Recovery paths:**
  - Current month: the user is told it is "available after month end" with the expected date from the backend, and offers an export instead.
  - Failed: the failure is named with its reason and a reference; trying again re-submits the same parameters as a new job. A job fails whole: no partial file is ever offered as `ready`.
  - Expired: creating it again pre-fills the builder from the expired job. Files stay downloadable for 7 days after `ready` (`EXPORT_RETENTION_DAYS`) and the expiry time is stated with the job (P2-A4).
  - Session expiry: job continues server-side; after re-authentication S32 shows it `ready`.
  - Pending mismatch: builder states clearly whether pending is included (default: posted only).
  - R4: C59 PermissionGate renders a not-permitted state naming the roles that can export.
  - Duplicate: one idempotency key per submission returns the same job; an identical active job that the member may see (their own; for R1 and R2, anyone's in the workspace) is pointed to instead of started again.
  - Limits: the range limit (366 days, P2-A4) and the active-job limit (3 per member, `EXPORT_ACTIVE_JOB_LIMIT`) are validated before submission and stated; an over-size export is refused with advice to split by account or period, keeping every chosen value.
  - Slow job: after 30 minutes `running` (`EXPORT_POLL_MAX_MS`) the job is described as delayed with its reference and the client stops polling; the member can leave, and X7 tells them when it is `ready` or `failed`.
  - Multi-currency: each row carries its own currency; the file has no cross-currency total; summary figures are per account.
  - Moving data: the job records the moment its data was read and the file states it, with the period, time zone, accounts and whether pending was included, so a later mismatch is explicable.
  - Download: a fresh URL is requested on each attempt; an interrupted download is simply requested again; the job is unaffected.
  - Reissued statement: the statement names its version and issue date; an earlier version stays available and is marked as superseded in words.
  - Access change: download is refused with the convention's access-changed message; the job remains for its requester while they still qualify, and for R1 and R2.
- **System behavior:** `use-statements`; `use-create-export`; `use-exports` polls every `EXPORT_POLL_INTERVAL` (5 s, P2-A4) only while any job is `queued` or `running`, stopping when none are and while the tab is hidden, and refetching once on return. Download URLs are valid for 5 minutes and one use (`DOWNLOAD_LINK_TTL`), issued on activation with the role re-checked at issue, and never stored or logged. Creation and each download are audit-logged with actor, accounts and period. Period boundaries use the workspace time zone. Amounts in files are exact decimal strings derived from minor units with the currency's exponent, with an explicit sign and no thousands separators or float conversion.
- **Completion criteria:** (1) a job for one month of one account reaches `ready` (K5 target ≤ 60 s) or `failed` with a reason; it never stays indeterminate without the delay being stated; (2) the file's row count equals the job's reported row count; (3) with "posted only", credits − debits in the file equals the S22 summary for the same account and period, to the minor unit; (4) the file names its period, time zone, read time and pending rule; (5) two submissions with the same key produce one job; (6) R4 cannot create, list or download; (7) R3 lists only their own jobs, while R1 and R2 list every job in the workspace.
- **Dependencies:** Required: statements (list, versioned PDF download URL, next-available date), exports (create with idempotency key, list, download URL, row count, expiry time, failure reason), compare periods, notifications, audit log. None exists today.

### F5 — Business onboarding and verification

- **User intent:** get the business verified so the workspace's accounts can be used.
- **Personas:** R1; internal counterpart R6 (D6).
- **Trigger:** first registration; verification status notice (S13); `needs_info` notification.
- **Entry points:** P03 Register `/auth/register` then redirect; P07 Onboarding & verification `/onboarding`; S13 Verification status notice on P08; X7 notification.
- **Journey:**
  1. X2 Register creates the user and session; the user creates a workspace.
  2. On P07, S09 Verification progress takes the user through four steps: business details, beneficial owners, documents, review.
  3. S10 Business details collects the business's identity (legal name, registration number, address; exact data set by OD1).
  4. S11 Beneficial owners: add each owner; removal confirmed first (C52).
  5. S12 Document upload: registration documents and owner IDs (C49), with upload progress reported (C26).
  6. Review and submit; the case moves to `submitted`; S13 reports the state on P08.
  7. R6 reviews on P32 (D6); outcome `approved`, `rejected` or `needs_info` returns to R1 via X7 and S13.
- **Decision points:** save and continue later; add another owner; respond to `needs_info`. By role: only `owner` may read or edit the case; R2, R3 and R4 learn from S13 only that verification is incomplete and that an owner must act, with no case content.
- **Emotional state:** impatient and wary of handing identity documents and owners' personal details to a new provider; progress must never be lost; clarity about "what is missing" matters more than speed, and silence after submitting reads as rejection.
- **Failure paths:**
  - User leaves mid-form.
  - Document rejected for size or type, or upload interrupted.
  - Case returns `needs_info` with specific items.
  - Case `rejected`.
  - Another owner-role member opens P07 at the same time.
  - A step saves partially, or its save has an unknown outcome.
  - Submit is activated twice, or with a step that has since become incomplete.
  - The session expires during a long form or a large upload.
  - The case is edited after `submitted`, or R6 decides it while the owner still has it open.
  - Registration data fails format rules set by jurisdiction (OD1), or the same business is already registered to another workspace.
  - A document passes upload but is unreadable, expired or of the wrong kind on review.
  - The declared ownership does not add up (no owner, or more than 100% in total).
  - The owner's own access is suspended mid-verification.
- **Recovery paths:**
  - Leaving: every step saves to the case (`in_progress`) and S09 reopens at the first incomplete step.
  - Upload failure: retry per file; other files are not lost. Limits (10 MB, PDF / JPEG / PNG, 10 documents per document kind and 20 per case, P2-A5) are stated before selection.
  - `needs_info`: S09 identifies only the steps with requested items and gives the analyst's message verbatim.
  - `rejected`: clear statement, reason where the backend provides one, and a route to X9. A rejected case is read-only; whether a new case may be opened is the backend's answer, stated in words.
  - Concurrent edit: server version wins; the user is told (C24) and gets refreshed values, with their own unsaved entries kept for re-applying.
  - Partial or unknown save: a step is saved whole or not at all; after an unknown outcome the case is re-read and the step shows what the server holds.
  - Submit: one idempotency key; the server re-validates every step and, if one is incomplete, the case stays `in_progress` and that step is named.
  - Session expiry: typed values are kept through X4; an interrupted upload restarts for that file only.
  - After `submitted`: the case is read-only to the owner until a decision; a decision arriving while P07 is open replaces the form's state on the next refresh and is announced.
  - Format or duplicate business: errors are reported against the field from the backend's rule; a duplicate registration is reported without naming the other workspace, with a route to X9.
  - Unusable document: it returns as a `needs_info` item naming the document and the reason; only that document is replaced.
  - Ownership total: validated before review; the rule and the current total are stated. A case holds at most 20 beneficial owners (`OWNER_LIMIT`).
  - Suspended owner: X1 explains the suspension; the case is untouched and resumes on reinstatement.
- **System behavior:** `use-verification-case` (`live` tier, refetch on focus; no polling — decisions arrive through X7), `use-update-verification-case` (versioned), `use-upload-document`. Documents upload directly to the backend-issued target; the frontend never stores them, never previews them from a public URL, and never places personal data of beneficial owners in a URL, title or analytics event. Identity numbers and dates of birth, once saved, are read back masked. State transitions and decisions are audit-logged with actor and reason. How long documents are retained is a backend and jurisdiction matter (OD1).
- **Completion criteria:** (1) the case reaches `submitted` only when every required item passes server validation; (2) leaving at any step and returning on another device resumes at the first incomplete step with every saved value present; (3) a double submit produces one transition; (4) after `needs_info`, only the requested items are editable and resubmission returns the case to `submitted`; (5) members who are not owners can read no case content; (6) final completion is `approved`, after which accounts are no longer `pending_verification`.
- **Dependencies:** Exists: `POST /api/auth/register`. Required: workspaces (create), verification cases (workspace side, versioned step saves, document upload target, submit, decision), jurisdiction field rules (OD1), notifications, audit log.

### F6 — Transfer money

v1 read-only; see [Phase 8](phase-8-implementation-roadmap.md). Fully mapped so the design has room for it (OD3).

- **User intent:** move money from one account to another account or to a payee.
- **Personas:** R1, R2.
- **Trigger:** supplier due; moving cash between operating and reserve accounts.
- **Entry points:** P26 Transfer `/payments/transfer`; S20 Account overview action; C38 CommandPalette.
- **Journey:**
  1. S44 Money transfer: from account (balance shown with C40), to account or payee, amount, reference, date.
  2. Review screen summarises amounts in minor-unit-exact formatting.
  3. Step-up re-authentication (X4) before submission; each transfer confirmation asks for its own grant, and a grant issued for any other purpose never authorises it.
  4. Submission returns a transfer that appears as a `pending` transaction in F2 and F3.
- **Decision points:** internal vs external destination; now vs scheduled. By role: R1 and R2 only; R3 and R4 are never offered a transfer and reach a not-permitted state by URL. Whether a second person must approve (OD9 facet a) and any per-role amount limit are not decided and belong to OD3.
- **Emotional state:** high stakes; needs certainty before submitting and confirmation after. The fear is specific: paying the wrong party, paying twice, or not knowing whether it went.
- **Failure paths:**
  - Insufficient available balance.
  - Source account `frozen`.
  - Step-up failed.
  - Duplicate submission.
  - Transfer later `returned`.
  - Submission times out, so the outcome is unknown.
  - The available balance changes between review and submission.
  - Source and destination currencies differ.
  - The amount is zero, negative, has more decimal places than the currency allows, or exceeds a limit.
  - A scheduled date falls on a non-processing day or has passed in the workspace time zone by the time of submission.
  - The step-up grant or the session expires on the review step.
  - The member's role is lowered between review and submission.
- **Recovery paths:**
  - Inline validation before submit; the amount is parsed from text to minor units without float arithmetic and re-validated by the server.
  - Idempotent submission key (nanoid), generated once per review, so a double activation or a retry never sends twice.
  - Step-up retry; a lapsed grant asks for step-up again with the review intact.
  - Returned transfer surfaces in X7 and on the transaction timeline.
  - Unknown outcome: the user is told the transfer could not be confirmed and is sent to recent activity to check before trying again; the key is kept and nothing is re-sent automatically.
  - Balance changed: the server refuses with the current available balance; the form keeps every value.
  - Currency mismatch: refused before review until a conversion capability exists (none is specified).
  - Limits and dates: the limit and the next valid date come from the backend and are stated; nothing is silently adjusted.
  - Role lowered: the server refuses; the convention's access-changed message applies.
- **System behavior:** `use-create-transfer`; idempotency key per attempt; audit-logged with actor, accounts and step-up evidence; no optimistic balance change — balances and the pending transaction are re-read after acceptance; mutations are never retried automatically.
- **Completion criteria:** (1) the transfer is accepted and visible as `pending` in F2 within one refresh; (2) the same key submitted twice yields one transfer; (3) no submission is possible without a step-up grant issued for it; (4) after a timeout the user is never told it succeeded or failed without a server read.
- **Dependencies:** Exists: `GET /api/accounts` (list with balances). Required: transfers (create with idempotency key, limits, processing calendar), step-up re-auth (a grant issued for the transfer itself), account detail, audit log; OD3 and OD5 answered.

### F7 — Pay a payee / bill

v1 read-only; see [Phase 8](phase-8-implementation-roadmap.md). Fully mapped so the design has room for it (OD3).

- **User intent:** pay a saved payee or a bill.
- **Personas:** R1, R2.
- **Trigger:** invoice received; recurring bill due.
- **Entry points:** P27 Payees & bill pay `/payments`; counterparty page P19 "pay this counterparty".
- **Journey:**
  1. S45 Payee management: search and select a payee, or add one.
  2. Continue into the F6 transfer form pre-filled with the payee.
  3. Step-up (X4) with a grant issued for this payment, submit, confirmation.
- **Decision points:** existing vs new payee; pay now vs schedule. By role: R1 and R2 only, as F6; who may add or change a payee, and whether a new payee needs a second person, belong to OD3.
- **Emotional state:** routine for known payees; cautious for new ones, where an invoice with altered bank details is the fraud a finance lead fears most.
- **Failure paths:**
  - New payee details invalid.
  - Payee changed bank details recently.
  - Step-up failed.
  - A payee with the same account details already exists.
  - A colleague edits or removes the payee while it is being paid.
  - The same invoice is paid twice by two members.
  - Every F6 failure path applies from step 2.
- **Recovery paths:**
  - Validation messages per field; account identifiers are format-checked for the jurisdiction (OD1) before submission.
  - A changed-details warning requiring confirmation (C52), naming when and by whom the details changed.
  - Step-up retry.
  - Duplicate payee: the existing payee is offered instead of a second record.
  - Concurrent change: the payment is refused with the payee's current details given for re-review; nothing is sent to details the member did not review.
  - Repeat payment: a recent payment to the same payee for the same amount and reference is disclosed before submission and must be confirmed.
- **System behavior:** `use-payees`, then `use-create-transfer`; payee creation and changes are versioned and audit-logged with actor; payee account identifiers are masked (C42) after saving.
- **Completion criteria:** (1) payment accepted and visible as `pending`; (2) the payee details paid are the ones the member reviewed (version match); (3) a payee changed in the last 7 days (`PAYEE_CHANGE_HOLD_DAYS`) cannot be paid without the explicit confirmation (P2-A9).
- **Dependencies:** Required: payees (versioned, with change history), transfers, step-up re-auth, audit log; OD3 and OD5 answered. None exists today.

## Role dashboards

D1–D4 are one page, P08 Dashboard `/dashboard`, composed by workspace role from the same sections. Why one page: the sections, hooks and states are identical; only which sections a role is given differs, so four routes would quadruple maintenance for no user benefit. D5–D7 are internal pages in the `(admin)` group.

### D1 — Owner dashboard

- **User intent:** cash position, anything unusual, and whether the business is fully set up.
- **Persona:** R1.
- **Trigger:** daily check; low-balance or large-transaction alert (X7); verification outcome.
- **Entry points:** default landing after X1 for `owner` at P08 Dashboard `/dashboard`; S01 Primary navigation; C38 CommandPalette.
- **Journey:**
  1. S13 Verification status notice applies only while the case is not `approved`, naming the next action.
  2. S14 Cash position gives total per currency with today's movement (C41).
  3. S15 Account summary gives each account with its state.
  4. S17 Pending items gathers pending transactions, running exports and verification requests.
  5. S18 Cash flow over time gives inflow vs outflow for the chosen range.
  6. S16 Recent activity reaches P12 for each transaction.
- **Decision points:** finish verification (F5); drill into F2 or F3; invite a teammate (X6) from the empty-team hint; open P16 Runway calculator. Only the owner is offered the verification action and the any-role invitation.
- **Emotional state:** wants reassurance in seconds between other work; unwanted noise erodes trust, and a notice that keeps appearing after it has been dealt with teaches the owner to ignore the one that matters.
- **Failure paths:**
  - Verification is `needs_info` but the owner does not notice.
  - No accounts yet because verification is still `submitted`.
  - One section fails while others load.
  - The verification case fails to load, so the dashboard cannot tell whether accounts are missing or merely not yet granted.
  - The case is decided, or an account is `frozen`, while the dashboard is open.
  - A second owner completes the requested verification item at the same time.
- **Recovery paths:**
  - `needs_info` is stated by S13 whenever the case is in that state, with the analyst's request summarised and a link to P07; the same request reaches the owner through X7, so it does not depend on the dashboard being open.
  - S14 empty state explains that accounts appear after approval; no zero balance is shown as if it were real.
  - C58 SectionErrorBoundary isolates the failure; the rest of P08 stays usable.
  - Case unavailable: S13 says the verification state could not be read and offers a retry; no "approved" or "nothing to do" is inferred from a failed read.
  - Change while open: the case and accounts refresh on focus; S13 withdraws itself once the case is `approved`, and a newly `frozen` account is named in words with a route to X9.
  - Second owner: the notice reflects the server's case state after refresh; P07 applies F5's conflict handling.
- **System behavior:** as F1 plus `use-verification-case` (`live` tier); sections render independently; refetch on window focus and reconnect; no polling.
- **Completion criteria:** (1) the owner is told balance and movement per F1's criteria; (2) while the case is not `approved`, its state and the next action are stated, and when it is `approved` no verification notice remains; (3) with zero accounts no balance figure, including zero, is given.
- **Dependencies:** as F1 and F5.

### D2 — Finance dashboard

- **User intent:** know what needs reconciling and what moved.
- **Persona:** R2.
- **Trigger:** daily work; month-end.
- **Entry points:** landing for `finance` at P08 `/dashboard`; S01.
- **Journey:**
  1. S14 Cash position.
  2. S17 Pending items: pending transactions, running and `ready` exports.
  3. S16 Recent activity with filters one click away on P11.
  4. S18 Cash flow over time.
  5. S13 only when verification blocks accounts.
- **Decision points:** open a pending item; start an export (F4); open P15 Compare periods. R2 is told when verification blocks accounts but is not offered the verification action (owner only).
- **Emotional state:** task-oriented; wants a queue, not a brochure. At month-end a count that is wrong by one sends them hunting for a transaction that does not exist.
- **Failure paths:**
  - Pending count is stale after a transaction posts.
  - An export in S17 has become `expired`.
  - The pending count and the items listed disagree because more items exist than the dashboard lists (`DASHBOARD_PENDING_LIMIT` caps pending items at 10; `DASHBOARD_ACTIVITY_LIMIT` caps recent activity at 8).
  - A `ready` export listed here was created by a colleague and covers the same period R2 is about to request.
  - An export in the queue `failed`.
- **Recovery paths:**
  - S17 refetches on focus and after any export or annotation mutation.
  - An expired export offers "create again" into P18 pre-filled.
  - Count vs list: the count is the server's total; the list states that it is partial and reaches the full filtered set on P11 or P18.
  - Colleague's export: its requester and period are named, so R2 downloads it instead of duplicating it (F4).
  - Failed export: named as failed with its reason and a route to re-create it; it is not left looking in progress.
- **System behavior:** as F1; pending queries invalidated after mutations; export polling follows F4 and runs only while a job is active.
- **Completion criteria:** (1) the pending count equals the server's count at its "as of" time; (2) each pending item reaches its subject in one activation; (3) every export listed carries its true current state, including `failed` and `expired`.
- **Dependencies:** as F1 and F4.

### D3 — Accountant workspace

- **User intent:** switch into a client's books and start the period's work.
- **Persona:** R3.
- **Trigger:** start of a client's month-end.
- **Entry points:** landing for `accountant` at P08 `/dashboard`; C36 WorkspaceSwitcher in S01.
- **Journey:**
  1. C36 WorkspaceSwitcher lists every workspace the accountant belongs to; select one.
  2. P08 reloads for that workspace: S14, S17 (flagged and pending), S16.
  3. S03 Page identity & actions names the workspace unmistakably.
  4. Shortcuts lead to P17 Statements, P18 Exports and P14 Flagged transactions.
- **Decision points:** which client workspace; statements vs exports first. The accountant's role is per workspace: the same person may be `accountant` in one and `viewer` in another, and each workspace offers only what that membership allows.
- **Emotional state:** context-switching fatigue across many clients; the workspace name must be unmistakable, because an export or a note filed against the wrong client is a professional failure, not an inconvenience.
- **Failure paths:**
  - Stale data from the previous workspace flashes after switching.
  - Access revoked by the owner while the accountant is working.
  - Two tabs are open on different workspaces.
  - A link (shared transaction, notification, export) belongs to a workspace other than the active one.
  - A write is in flight, or a note is unsaved, when the workspace is switched.
  - The accountant belongs to very many workspaces, or to none after the last one revokes access.
  - Time zones differ between clients, so "today" and month-end differ per workspace.
- **Recovery paths:**
  - Query keys include the workspace ID, so no cross-workspace cache is ever shown; loading placeholders stand in until the new workspace's data arrives.
  - Revoked access removes the workspace from C36 and redirects to the next available workspace with a C24 Transient message; cached data for the revoked workspace is dropped and an unsaved note is kept for copying, not saved.
  - Two tabs: each tab is bound to the workspace in its own URL and requests; switching in one tab does not redirect another tab's writes. A tab returning to focus restates its workspace's name.
  - Foreign link: if the person belongs to the link's workspace, they are told which workspace it opens before it switches; if not, P34.
  - Switching with unsaved work: the person confirms leaving (C52); an in-flight write completes against the workspace it was started in.
  - Many or none: the switcher is searchable beyond 10 memberships; with no workspace left the person reaches an explanation that access is by invitation (BR12) with a route to X9, not an empty dashboard.
  - Time zones: every period and "today" is stated in the active workspace's zone (P2-A1).
- **System behavior:** `use-workspace`, `use-me`; switching resets workspace-scoped queries and cancels in-flight reads for the previous workspace; the workspace ID travels with every request and the backend rejects a request whose workspace the member does not belong to. The workspace membership list is `slow` tier and re-read on focus.
- **Completion criteria:** (1) after a switch, no figure, name or count from the previous workspace is readable at any moment; (2) every write lands in the workspace named when it was started; (3) the active workspace's name is available to assistive technology on every page; (4) statements, exports and flagged transactions are each one activation away.
- **Dependencies:** Required: workspaces + memberships (list for the user, per-workspace role, revocation effective on the next request).

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
- **Decision points:** search for a payment. No role branch within the flow: a viewer has no write, export, statement, alert-rule, team or reveal capability.
- **Emotional state:** quick errand, often with a customer waiting on the phone; should never meet a control they cannot use, nor be left wondering whether "not found" means "not paid" or "not mine to see".
- **Failure paths:**
  - No permitted accounts.
  - Follows a shared export or statement link.
  - A figure labelled as the business's cash is in fact only the permitted accounts' cash.
  - The payment they look for is on an account they may not see.
  - Their permitted accounts change while they are signed in.
  - A colleague shares a transaction link on a non-permitted account.
- **Recovery paths:**
  - Empty state naming the owner role as the one who grants access.
  - C59 PermissionGate on export and statement surfaces renders a not-permitted state.
  - Scope disclosure: totals state that they cover the accounts the viewer may see, without naming or counting the others.
  - Payment elsewhere: an empty search says nothing was found in the accounts they can see and that an owner can widen access; it never confirms that a payment exists elsewhere.
  - Permission change: effective on the next request; removed accounts' cached data is dropped, added accounts appear after refresh.
  - Foreign link: P34, identical to a non-existent transaction.
- **System behavior:** as F1 with backend-filtered accounts; totals computed server-side over permitted accounts only; the client never receives data for a non-permitted account and filters nothing itself.
- **Completion criteria:** (1) every figure and result covers permitted accounts only and says so; (2) no export, statement, annotation, reveal or settings capability is offered or reachable by URL; (3) no response to the viewer contains an identifier, name or count of a non-permitted account.
- **Dependencies:** as F1; permission filtering in the accounts, transactions, search and totals endpoints (Required).

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
- **Decision points:** answer directly vs escalate. By role: R5 reads and replies only; a verification question goes to R6; a record change goes to R7; R6 has no access to this console.
- **Emotional state:** time pressure; fear of acting on the wrong account, or of telling one customer something about another business's money.
- **Failure paths:**
  - Lookup matches several users.
  - User not found.
  - R5 tries to change a record.
  - The customer quotes an error reference rather than an email.
  - Two agents answer the same thread at once.
  - The customer's state changes during the conversation (suspended, verification decided).
  - A reply fails or is sent twice.
  - The agent needs a balance or transaction to answer, which support may not read.
  - One person belongs to several workspaces.
- **Recovery paths:**
  - Results show disambiguating fields (email, workspace name).
  - Not-found empty state with the query kept.
  - Read-only by design: edit actions are absent for `support`.
  - Reference lookup: a quoted reference finds the failed request, its time and its kind (P2-A11), never its payload.
  - Two agents: the thread shows a colleague's reply as soon as it is sent and warns before sending when a newer reply exists; both are kept, in order.
  - State change: the customer record refreshes on focus and before a reply is sent.
  - Reply: the draft is kept on failure; one idempotency key per send.
  - Financial detail: support sees workspace, user and verification state and masked account identifiers only; anything further is escalated, and the customer is told so.
  - Several workspaces: each membership is listed with its role so the agent confirms which business the question concerns.
- **System behavior:** `use-support-lookup` (query of at least `SUPPORT_QUERY_MIN` (3) characters, debounced, server-paged, at most 50 results per `SUPPORT_RESULT_LIMIT`), `use-threads`, `use-thread`, `use-send-message`; every lookup and every customer record opened is audit-logged with the agent and the search term's kind, not its text. Threads are `standard` tier and refetch on focus.
- **Completion criteria:** (1) the agent replied or escalated, and the thread records which; (2) no write to a user, workspace, account or case is possible for `support`; (3) each lookup has an audit record naming the agent; (4) no full account number or amount is readable in the console.
- **Dependencies:** Exists: `GET /api/users`, `GET /api/users/{id}` (today `ADMIN` only, A9). Required: support lookup (by email, workspace, user ID, error reference), message threads, finer platform roles, audit log.

### D6 — Compliance queue

- **User intent:** decide verification cases correctly and on time.
- **Personas:** R6 (R7 also).
- **Trigger:** cases in `submitted`.
- **Entry points:** P32 Compliance queue `/admin/compliance`; case link `/admin/compliance/[caseId]`.
- **Journey:**
  1. S51 Compliance case queue, narrowed by state (C47) and ordered by age.
  2. Open a case: S52 Compliance case review (C22) gives the business details, owners and documents.
  3. Choose approve, reject or request info; write the reason or message.
  4. Confirm (C52).
  5. The queue refreshes and the next case is offered.
- **Decision points:** approve / reject / `needs_info`. By role: R6 and R7 decide; R5 has no access. An analyst who is also a member of the business's workspace must not decide its case.
- **Emotional state:** careful; each decision carries regulatory weight and the analyst's name, and a wrong approval is harder to undo than a slow one.
- **Failure paths:**
  - A document fails to load.
  - Another analyst decided the case first.
  - Decision submission fails.
  - The owner resubmits or the case changes while the analyst is reviewing it.
  - Some documents load and others do not, and a decision is attempted on an incomplete view.
  - A decision is confirmed twice, or its outcome is unknown after a timeout.
  - The session expires with a long reason drafted.
  - A decision was wrong and must be corrected.
  - The queue is very large, or a case has waited beyond the K14 target.
  - The reason is empty or contains personal data that will be sent to the owner.
- **Recovery paths:**
  - Per-document retry.
  - Conflict shows the other decision and blocks a second one.
  - Failed submit keeps the drafted reason.
  - Changed case: the decision carries the case version reviewed; a newer version refuses the decision, reloads the case, names what changed and keeps the drafted reason.
  - Incomplete view: approval is unavailable until every required document has been opened successfully in this review; reject and request-info remain available.
  - Double or unknown: one idempotency key per decision; after a timeout the case is re-read and its actual state given before anything else is offered.
  - Session expiry: the drafted reason is kept through X4.
  - Wrong decision: a decided case is never edited in place; correction is a new recorded action by R7 with its own reason, and the earlier decision stays in the audit record (P2-A13).
  - Large queue: server-paged and ordered by age, with the waiting time of each case stated against the K14 target (one business day).
  - Reason: required for reject and request-info, 10 to 2,000 characters (`DECISION_NOTE_MIN`, `NOTE_MAX_LENGTH`); the analyst is told that the message is sent to the owner verbatim.
- **System behavior:** `use-compliance-cases` (server-paged), `use-compliance-case`, `use-decide-case` (versioned, idempotent); decisions audit-logged with analyst, reason, case version and time; queue invalidated after a decision. Documents are fetched through short-lived URLs on request, never cached to disk by the client, and each document open is audit-logged. Queue is `standard` tier, refetch on focus; no polling.
- **Completion criteria:** (1) the case moves to exactly one decided state with a recorded reason and analyst; (2) R1 is notified (X7) with the reason or request; (3) a second decision on the same version is refused; (4) no approval is recorded for a case whose required documents were not all opened; (5) the audit record of the decision is immutable.
- **Dependencies:** Required: verification cases (compliance side, versioned decision, document URLs), notifications, finer platform roles (A9), audit log. None exists today.

### D7 — Platform admin overview

- **User intent:** see platform health and manage users.
- **Personas:** R7 (R5, R6 read P29).
- **Trigger:** routine review; support escalation.
- **Entry points:** P29 Admin overview `/admin`; P30 Admin users `/admin/users`; P31 Admin user detail `/admin/users/[userId]`.
- **Journey:**
  1. P29 S48 Platform growth figures: total users and the trend over time.
  2. P30 S49 Platform user directory: search, filter by role and status.
  3. Create a user (C21).
  4. P31 S50 Admin user record: edit role and status; delete, confirmed first (C52).
- **Decision points:** create, edit, suspend or delete a user. By role: R7 only for every write; R5 and R6 read P29 and reach P30 and P31 as P34. Suspend is reversible and delete is not, so the choice between them is stated when either is offered.
- **Emotional state:** deliberate; destructive actions must feel heavy, because the record being changed is someone's access to their business's money.
- **Failure paths:**
  - A non-admin reaches `/admin`.
  - Email already taken on create.
  - An admin tries to delete their own account.
  - An admin lowers their own role, or the last `ADMIN` is suspended or deleted.
  - Two admins edit the same user.
  - The user to delete is the only owner of a workspace.
  - A suspended user is signed in at the time.
  - Create or delete is confirmed twice, or times out.
  - Totals and the directory disagree after a change.
  - The series has no data for part of the range.
- **Recovery paths:**
  - The admin guard sends non-internal roles to P34 Not found (the admin area is not advertised).
  - Field-level error on duplicate email; form values kept.
  - Self-delete disabled with an explanation.
  - Self-demotion and last-admin removal are refused, with the reason stated.
  - Concurrent edit: versioned save; the refused admin is given the current record and their own unsaved changes.
  - Sole owner: deletion is refused, naming the workspace that would be left without an owner; suspension remains available.
  - Suspension takes effect on the user's next request; their session ends there with the suspended explanation of X1.
  - Double or unknown: one idempotency key on create; after a timeout the directory is re-read before anything is offered again.
  - Totals and directory are invalidated together after every write.
  - Missing periods in the series are given as no data, never as zero.
- **System behavior:** `use-admin-user-total`, `use-admin-user-series`, `use-admin-users` (server-paged, searchable), `use-create-user`, `use-admin-user`; mutations invalidate the users list and totals. Stats are `slow` tier (5 min) with their "as of" time. Every create, role change, status change and delete is audit-logged with the admin and the before and after values. Deleting a user ends their sign-in and keeps their notes, decisions and audit records attributed to them (P2-A13).
- **Completion criteria:** (1) totals carry an "as of" time and match the directory count after a refresh; (2) a saved change is readable on P31 after reload; (3) self-delete, self-demotion, last-admin removal and sole-owner deletion are each refused; (4) every write has an audit record.
- **Dependencies:** Exists: `GET /api/stats/users/total`, `GET /api/stats/users/series`, `GET` + `POST /api/users`, `GET` + `PATCH` + `DELETE /api/users/{id}`. Required: finer platform roles (A9), versioned user updates, last-admin and sole-owner guards, session revocation on suspend, audit log.

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
- **Decision points:** forgot password (X5); register instead (X2). By role: workspace members land on P08 in their last-used workspace; internal roles land on P29; a user with no workspace and no pending invitation lands on an explanation that access is by invitation (BR12), or on P07 if they are an owner who has not created a workspace.
- **Emotional state:** in a hurry to reach a number; irritated by vague errors or a lost `next`, and alarmed by any hint that the account, and so the business's money, may be locked or compromised.
- **Failure paths:**
  - Wrong credentials.
  - Account `SUSPENDED` or `PENDING`.
  - Two-step code wrong or expired.
  - Backend unavailable.
  - Too many failed attempts.
  - The second factor is lost or unavailable.
  - `next` points outside the application or to a page the role cannot open.
  - Sign-in is submitted twice, or completes in another tab meanwhile.
  - The two-step challenge expires while the code is being fetched.
  - The session cookie cannot be set (blocked cookies).
- **Recovery paths:**
  - One generic credential error (no user enumeration); email kept in the field, password cleared.
  - Suspended or pending state explained with a route to X9; this is disclosed only after correct credentials.
  - Resend code and retry.
  - X10 outage state with retry; an outage is never reported as a wrong password.
  - Throttled: after 5 failed attempts (`AUTH_MAX_ATTEMPTS`) in 15 minutes the backend locks sign-in for 15 minutes and answers 429; the person is told how long to wait and that the password may be correct, and is offered X5 (P2-A7).
  - Lost factor: a recovery code is accepted once and then spent; with none left the person is routed to X9 for identity checks. Recovery never bypasses two-step silently.
  - Unsafe `next`: only same-origin application paths of at most 2,048 characters are honoured; anything else is discarded in favour of the role's default page; a `next` the role cannot open follows the role-denial convention.
  - Double submit: the form is not submittable while pending; a tab that finds a session already present proceeds to `next` without a second sign-in.
  - Expired challenge: a two-step challenge is valid for 5 minutes (`CHALLENGE_TTL`); after that the person returns to P02 with the email kept and a statement that the step timed out.
  - Cookie blocked: the person is told sign-in needs cookies; no session is implied.
- **System behavior:** `use-login` posts to the `app/api/session` route handler, which sets the session cookie (httpOnly, lifetime per OD2); `use-verify-challenge` for two-step; the proxy redirects signed-in users away from `/auth`. The route handler distinguishes 401, 429, 400 and 5xx so each gets its own message. Credentials are never stored, logged or placed in a URL. Sign-in attempts, successes and lockouts are audit-logged by the backend with time and coarse device information.
- **Completion criteria:** (1) with valid credentials (and factor) a session exists and the user lands on `next` or their role's default page; (2) invalid credentials, throttling, invalid input and outage produce four distinguishable messages; (3) the response to a wrong password is identical for existing and non-existing emails; (4) an external `next` is never followed.
- **Dependencies:** Exists: `POST /api/auth/login`, `GET /api/users/me`. Required: two-step verify and recovery codes (OD6), attempt throttling with a retry time, sign-in audit events.

### X2 — Register

- **User intent:** create an account and start onboarding.
- **Persona:** R1.
- **Trigger:** "Get started" on P01. **2.0.0 note:** the built P01 routes its start actions to X11 instead of this flow (OD10); this flow remains the specified path for owners.
- **Entry points:** P03 Register `/auth/register`; link from P02.
- **Journey:**
  1. P03 S08 Authentication step, register variant: name, email, password.
  2. Submit; the user and session are created.
  3. Redirect to P07 Onboarding & verification (F5).
- **Decision points:** already have an account → P02. Registration creates an owner only (BR12): someone holding an invitation is told to use it instead, so they do not create a separate, empty workspace by mistake.
- **Emotional state:** curious, low commitment; ask only what is needed. Wary of what a banking provider will do with their details before they have seen the product.
- **Failure paths:**
  - Email already in use.
  - Password fails policy.
  - Network error.
  - Submitted twice, or the request times out after the account was created.
  - The account is created but the session is not.
  - The person arrives already signed in.
  - Repeated registrations from one source.
  - The terms were not accepted.
- **Recovery paths:**
  - The email is reported as already registered, with a way to sign in. Whether registration may say so while sign-in and reset do not is OD13; its default replaces this with the same neutral answer, the existing user being told by email.
  - The password policy is available before submit.
  - Values kept on retry, except the password.
  - Timeout or double submit: a second attempt that meets "already registered" is told the account may already exist and is routed to X1; no duplicate account can result because the email is unique.
  - Account without session: the person is sent to X1 with the email kept and told the account was created.
  - Already signed in: the proxy sends them to their default page.
  - Throttled: the backend's 429 is reported with its wait time.
  - Terms: submission is refused until accepted; the acceptance and its time are recorded by the backend.
- **System behavior:** `use-register` posts to `app/api/register`; session cookie set on success; Zod validation on the client composes over the generated register schema, and the server validates again. Registration is audit-logged. Whether the new user is `PENDING` until the email is confirmed is the backend's rule; if so the person is told to confirm before F5 can be submitted.
- **Completion criteria:** (1) one user exists for the email, the user is signed in and on P07; (2) a second submission creates no second user; (3) no password value is retained in the page after a failed attempt.
- **Dependencies:** Exists: `POST /api/auth/register`. Required: registration throttling, terms-acceptance record, email confirmation (if the backend adopts `PENDING` for it).

### X3 — Sign out

- **User intent:** end the session on this device.
- **Personas:** R1–R7.
- **Trigger:** leaving a shared computer; end of day.
- **Entry points:** C37 UserMenu in S02 Global utilities.
- **Journey:**
  1. Open C37 UserMenu.
  2. Choose "Sign out".
  3. Session cleared; land on P02 with a signed-out confirmation.
- **Decision points:** none. The same for every role.
- **Emotional state:** wants certainty that balances are no longer visible to the next person at this computer.
- **Failure paths:**
  - Network error during sign-out.
  - Other tabs remain open on authenticated pages.
  - A draft (note, message, verification step) is unsaved.
  - A write is in flight.
  - An export job is running.
- **Recovery paths:**
  - The cookie is cleared regardless and the query cache is emptied, so no data remains in memory. If the server could not be told, the person is informed that this device is signed out and that the session can be ended everywhere from X8.
  - Other tabs: sign-out is broadcast; every tab drops its data and reaches P02 without another request.
  - Draft: the person confirms discarding it (C52); drafts live only in the tab's memory and are removed on sign-out.
  - In-flight write: it completes or fails on the server as sent; nothing new is started.
  - Running export: it continues server-side and is waiting after the next sign-in (F4).
- **System behavior:** `use-logout` calls `DELETE` on `app/api/session`; the TanStack Query cache, drafts held in memory and any revealed account number are cleared; authenticated pages are served with no-store caching so history navigation re-requests them. Sign-out is audit-logged where the backend was reached.
- **Completion criteria:** (1) after sign-out, back navigation to any authenticated URL reaches P02, not cached content; (2) every open tab of the same browser is signed out within 2 s; (3) no workspace data remains in memory or in device storage.
- **Dependencies:** none beyond the session route handler. Required for server-side effect: session revocation (today the token is valid until its own expiry, OD2).

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
- **Decision points:** stay signed in vs sign out; complete step-up vs cancel. By role: step-up is offered only for actions the role already holds; reveal belongs to R1, R2 and R3, so R4 and the internal roles (R5–R7) are never asked to step up for a reveal they may not perform.
- **Emotional state:** mildly annoyed at the interruption; tolerant when work is not lost, and reassured that an unattended screen does not leave the business's balances readable.
- **Failure paths:**
  - Session expired mid-export.
  - Unsaved note in S26 when the session expires.
  - Step-up failed repeatedly.
  - Expiry in another tab.
  - The absolute limit is reached, which "stay signed in" cannot extend.
  - Activity in one tab while another shows the idle warning.
  - Re-authentication is completed as a different user.
  - The device sleeps through the warning.
  - A step-up grant lapses before the action is taken.
  - The user was suspended or removed while idle.
  - Extending the session fails.
- **Recovery paths:**
  - The export job continues server-side and shows `ready` in S32 after re-authentication.
  - Drafts are kept in the open tab's memory across re-authentication (C55), never in device storage. The interrupted write is not replayed: the member re-submits it afterwards, and the re-submission carries the same idempotency key.
  - After repeated step-up failure the number stays masked and the user is pointed to X5. Five failures in 15 minutes lock step-up for 15 minutes; reading continues (P2-A6).
  - Expiry is broadcast across tabs so every tab shows C55.
  - Absolute limit: the warning says the session must end at that time and why; drafts are kept through re-authentication.
  - Cross-tab activity: activity in any tab counts for all; the warning is withdrawn everywhere when the session is extended anywhere.
  - Different user: everything cached and every draft is discarded and the new user starts at their own default page; nothing of the previous user is shown.
  - Sleep: on wake the session is checked before any cached figure is shown again; if expired, content is withheld until re-authentication.
  - Lapsed grant: step-up is asked again; a grant lasts 5 minutes (`STEP_UP_GRANT_SECONDS`) and covers the one action it was issued for; a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant (P2-A6).
  - Suspended or removed: re-authentication is refused with X1's explanation; drafts are discarded.
  - Extension failure: the countdown continues and the failure is stated; expiry then follows the same path.
- **System behavior:** a 401 from any call opens C55 rather than hard-redirecting; reads refused with 401 are repeated after re-authentication; a write refused with 401, or interrupted by a step-up, is never replayed — its draft is kept in the open tab's memory for the member to re-submit, and is dropped if a different user re-authenticates or the tab closes. The idle warning begins 2 minutes before idle expiry (`SESSION_WARNING_LEAD`, P2-A6); timing comes from the backend's session policy, not from client clocks alone. Step-up grants are short-lived, single-purpose and never stored on the device; reveals, step-up successes and failures are audit-logged.
- **Completion criteria:** (1) after expiry and re-authentication as the same user, the URL, filters, scroll position and any draft are as they were, and no write was sent without the member re-submitting it; (2) while expired, no balance, transaction or account number is readable; (3) a different user re-authenticating sees nothing of the previous user's data; (4) a reveal without a valid grant is refused by the server.
- **Dependencies:** Required: session policy endpoints (idle and absolute expiry, extend), step-up re-auth with scoped grants and failure lock, sessions list (OD2). None exists today: the token is a fixed 7-day one.

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
- **Decision points:** request a new link. The same for every role; a suspended user may reset a password but remains suspended.
- **Emotional state:** locked out, anxious, sometimes with payroll or a filing waiting; needs a short path and no doubt about whether the reset worked.
- **Failure paths:**
  - Reset token expired or already used.
  - Email never arrives.
  - Requests are repeated many times.
  - Several links exist and an older one is used.
  - The new password fails policy or equals the current one.
  - The reset is submitted twice, or times out.
  - The link is opened on a device where someone else is signed in.
  - Two-step is enabled.
- **Recovery paths:**
  - Expired-token state with "send a new link".
  - P04 copy explains spam folders and links to X9.
  - Repeats: the same neutral confirmation every time; the backend limits how many emails are sent and the person is told a link, if any, has already been sent.
  - Older link: only the newest link works; older ones answer as expired. A link is valid for 30 minutes and for one use (`RESET_LINK_TTL`, P2-A8).
  - Policy: the rule that failed is named; the link stays valid for another attempt within its lifetime.
  - Double or timeout: a second submission on a used link answers "already used" and routes to X1 with the statement that the password may have been changed.
  - Other user's session: completing the reset ends that browser session, then lands on P02.
  - Two-step: reset does not remove two-step; the next sign-in still asks for the factor.
- **System behavior:** `use-request-password-reset`, `use-reset-password`; responses never reveal whether an email exists and take the same time either way; the token is read from the link, removed from the address before any other request is made, and never sent to analytics or included in a referrer; other sessions revoked on reset; request and completion are audit-logged and the account's email is notified of the change.
- **Completion criteria:** (1) the new password signs in and the old one does not; (2) every other session of that user is ended; (3) the link cannot be used twice or after 30 minutes; (4) responses for existing and non-existing emails are indistinguishable.
- **Dependencies:** Required: password reset request and confirm, request throttling, session revocation, change notification email. None exists today.

### X6 — Invite teammate and manage roles

- **User intent:** give the right person the right access.
- **Personas:** R1 (any role), R2 (viewer and accountant only).
- **Trigger:** new hire; accountant engaged; someone leaves.
- **Entry points:** P23 Team `/settings/team`; P24 Team member profile `/settings/team/[memberId]`; D1 empty-team hint.
- **Journey:**
  1. On P23, S39 Team members gives members, roles and pending invitations.
  2. Inviting starts S40 Member invitation (C21): who, which role, and which accounts a viewer may see.
  3. The invitation is listed as pending in S39.
  4. S41 Role permissions reference explains what each role can do.
  5. Role change or removal from S39 (C20), confirmed first (C52).
  6. P24 gives a member read-only (S42 variant) with S41.
- **Decision points:** which role; which accounts for a viewer; remove vs downgrade. By role: R1 invites any role, changes roles and removes members; R2 invites viewer and accountant only and may neither change a role nor remove a member; R3 and R4 may read neither P23 nor P24.
- **Emotional state:** cautious about over-sharing the business's finances; when someone leaves, urgent to know that their access has actually ended.
- **Failure paths:**
  - Invitee is already a member.
  - R2 tries to invite an owner.
  - Removing the last owner.
  - Invitation expired before acceptance.
  - The invitation is sent to a mistyped address.
  - The same person is invited twice, by two members or by a double submission.
  - The invitee already has a Ledgerline account under that email, or has none.
  - Two owners change the same member's role at once.
  - An owner lowers their own role, or the inviter loses the right to invite before the invitation is accepted.
  - The removed member is signed in, has a job running, or authored notes.
  - A viewer's permitted accounts include one that is later `closed`.
  - The workspace reaches its member or pending-invitation limit.
- **Recovery paths:**
  - The user is told who the existing member is; input kept.
  - Role options filtered by C59 PermissionGate; the backend refuses the same request if forged.
  - Last-owner removal blocked with an explanation.
  - The pending invitation can be resent; an invitation is valid for 7 days and for one use (`INVITE_TTL_DAYS`, P2-A8), and resending invalidates the earlier link.
  - Mistyped address: a pending invitation can be revoked, which invalidates its link at once; an invitation grants nothing until accepted by someone signed in with the invited email.
  - Duplicate: a pending invitation for that email is pointed to instead of a second being sent; one idempotency key per submission.
  - Existing or new account: an existing user accepts after signing in; a new one sets up credentials through the invitation, never through open registration into the workspace (BR12).
  - Concurrent role change: versioned; the refused owner is given the current role and who set it.
  - Self-demotion is allowed only while another owner exists and is confirmed with the consequence stated; an invitation whose inviter may no longer grant that role is refused at acceptance with an explanation.
  - Removed member: access ends on their next request; their running export is cancelled or kept for the workspace per the backend's rule, stated at confirmation; their notes remain, attributed to them.
  - Closed account: it stays in the viewer's permitted set for history.
  - Limits: the limit (200 members, `TEAM_MEMBER_LIMIT`; 50 pending invitations, `INVITE_PENDING_MAX`; P2-A8) is stated when reached, with what to remove.
- **System behavior:** `use-team` (`slow` tier, server-paged for 200 members), `use-invite-member`, `use-team-member`; invitations, acceptances, revocations, role changes and removals are audit-logged with actor and before and after role; a removed or downgraded member loses the access on their next request and their sessions for that workspace hold no cached data after it. The invitee's email appears in no URL.
- **Completion criteria:** (1) an invitation is listed as pending with its expiry, or a role change is saved and readable in S39 after reload; (2) a removed member's next request to the workspace is refused; (3) a workspace always has at least one owner; (4) R2 cannot create an owner or finance invitation even by forged request; (5) each change has an audit record.
- **Dependencies:** Required: workspaces + memberships + invitations (create, resend, revoke, accept, expiry), versioned role change, removal, per-viewer account permissions, audit log. None exists today.

### X7 — Notifications and alerts

- **User intent:** hear about what matters without watching the screen.
- **Personas:** R1–R4 (rules: R1, R2).
- **Trigger:** low balance, large transaction, statement ready, export ready, verification needs info.
- **Entry points:** C39 Notification entry point in S02; P20 Notifications `/notifications`; S35 Alert rules on P22 Workspace settings `/settings`.
- **Journey:**
  1. C39 shows the unread count.
  2. P20 S34 Notification history lists items newest first.
  3. Each item links to its subject: P12, P17, P18 or P07.
  4. Opening an item marks it read.
  5. R1 and R2 each set thresholds in their own alert rules in S35 Alert rules.
- **Decision points:** open the subject; adjust a rule. By role: R1 and R2 edit their own rules — rules are per member, with no shared workspace rule; R3 and R4 are redirected from `/settings` to `/settings/profile` and, if they reach alert rules (S35) by a direct link, get the not-permitted state; R3 receives notifications; R4 receives only notifications about permitted accounts and never verification, export or statement notices; verification notices go to owners only.
- **Emotional state:** alert fatigue if noisy; trust if precise. A low-balance alert that arrives after payroll has bounced is worse than none.
- **Failure paths:**
  - A notification links to a transaction the member can no longer see.
  - The export in an "export ready" notice has since `expired`.
  - A large-transaction alert fires for a `pending` debit that is later `returned`.
  - Rule save fails.
  - The member edits the same rule in two tabs or on two devices, or already holds the maximum number of rules.
  - A threshold is set in one currency for accounts in another, or is zero or negative.
  - The same event produces repeated alerts (a balance hovering around its threshold).
  - The unread count and the feed disagree, or marking as read fails.
  - Many notifications accumulate.
  - A rule refers to an account since `closed` or no longer permitted to its author.
  - The count cannot be refreshed while offline.
- **Recovery paths:**
  - Not-permitted subject renders P34 Not found.
  - Expired export shows "create again".
  - P12 timeline (S25) shows the return, so the alert is explained, not contradicted.
  - Rule form keeps values with retry.
  - Concurrent rule edit: rules are per member, so a colleague's rule never conflicts with theirs; a stale edit from the member's other tab is refused (versioned) and they are given the saved rule and their own values. At 20 rules (`ALERT_RULE_LIMIT`) a further rule is refused until one is removed.
  - Threshold: a rule holds one amount in one currency in minor units and applies only to accounts in that currency; invalid amounts are refused before saving.
  - Repeats: one alert per rule per account per crossing; a further alert needs the balance to recover above the threshold and cross again.
  - Count vs feed: marking read is optimistic and rolls back on failure; the count is the server's and is re-read after any change.
  - Volume: the feed is cursor-paged; all can be marked read in one action; notifications are kept for 90 days (`NOTIFICATION_RETENTION_DAYS`, P2-A9).
  - Stale rule: a rule on a closed account is stated as inactive, not deleted.
  - Offline: the last count stays with its "as of" time; no new-alert claim is made.
- **System behavior:** `use-notifications` (count in S02 is `live` tier, refetches on focus and every 60 s (`NOTIFICATION_POLL_INTERVAL`) while the tab is visible, never in a hidden tab, and reads "99+" beyond 99; feed paginated), `use-alert-rules`, `use-update-alert-rules` (per member, versioned, at most `ALERT_RULE_LIMIT` of 20). Notification text carries no amount or counterparty in anything sent outside the application; in-app text is filtered by the recipient's permissions at read time. Rule changes are audit-logged. Low-balance rules evaluate the available balance; large-transaction rules evaluate each `pending` or `posted` transaction once.
- **Completion criteria:** (1) the user reached the subject, or the rule is saved and readable after reload; (2) the unread count equals the number of unread items the server holds for that member; (3) no member receives a notification about an account they may not see; (4) one threshold crossing yields one alert.
- **Dependencies:** Required: notifications (list, mark read, mark all read, count), alert rules (per member, versioned, per currency), delivery outside the app if any (not decided). None exists today.

### X8 — Profile and security settings

- **User intent:** keep personal details and account security current.
- **Personas:** R1–R4.
- **Trigger:** name change; security review; unrecognised session.
- **Entry points:** C37 UserMenu → P25 Profile & security `/settings/profile`.
- **Journey:**
  1. S42 Profile details: name, avatar.
  2. S43 Security settings: change password.
  3. Enrol two-step (OD6).
  4. View active sessions and revoke one, confirmed with C52.
- **Decision points:** revoke a session; enable two-step. The same for every workspace role; each person changes only their own profile and security. Internal roles use the same settings.
- **Emotional state:** in control; alarm if an unknown session appears, because it may mean someone else is reading the business's accounts.
- **Failure paths:**
  - Current password wrong.
  - Two-step enrolment code invalid.
  - Revoking the current session.
  - The password is changed in another tab or device at the same time.
  - Enrolment is abandoned half-way.
  - Two-step is turned off, or the last factor is removed.
  - Recovery codes are lost or were never saved.
  - A session is revoked twice, or revocation fails.
  - The avatar file is too large or of the wrong type.
  - A step-up is required and fails.
  - The session list is out of date.
- **Recovery paths:**
  - Field error, other values kept; password fields are cleared.
  - Restart enrolment; an abandoned enrolment leaves two-step unchanged — it is on only after a code has been verified.
  - Revoking the current session signs out via X3 after confirmation.
  - Concurrent password change: the later attempt fails on "current password" and says the password was changed recently.
  - Turning two-step off, changing the password and revoking all sessions each need step-up (X4); if the workspace or platform requires two-step, turning it off is refused with the reason.
  - Recovery codes are given once at enrolment; new ones can be generated after step-up, which invalidates the old set.
  - Revocation is idempotent: revoking an already-ended session succeeds quietly; a failure keeps the session listed and says it is still active.
  - Avatar: limits (2 MB, `AVATAR_MAX_BYTES`; JPEG / PNG, P2-A5) stated before selection; a failed upload leaves the current one.
  - Sessions are re-read on focus and after any revocation; each names its coarse device and last activity time so an unknown one can be recognised.
- **System behavior:** `use-me`, `use-update-profile`, `use-change-password`, `use-sessions`, `use-two-step`; a password change ends every other session; security changes are audit-logged and notified to the account's email. The two-step secret is given once during enrolment and is never retrievable again, cached or logged. Sessions are `slow` tier.
- **Completion criteria:** (1) a profile change is readable after reload and in C37; (2) after a password change the old password fails and other sessions are ended; (3) a revoked session's next request is refused; (4) two-step is active only after a verified code, and each security change has an audit record.
- **Dependencies:** Exists: `GET /api/users/me`, `PATCH /api/users/{id}`. Required: change password, sessions list and revoke, two-step enrol, disable and recovery codes, change notification email.

### X9 — Help and support contact

- **User intent:** get an answer, first by self-service, then from a person.
- **Personas:** all (messaging: R1–R3).
- **Trigger:** confusion; frozen account; rejected verification.
- **Entry points:** P28 Help center `/help` and `/help/[slug]`; in-app help link; P21 Messages `/messages` and `/messages/[threadId]`.
- **Journey:**
  1. P28 S46 Help search & categories.
  2. S47 Help article.
  3. "Still need help" leads to P21 S36 Support threads.
  4. S37 Conversation: write a message, attach a file.
- **Decision points:** self-serve vs message support. By role: R1–R3 message support; R4 and signed-out visitors (R8) read help only; a thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1) only — other R2 and R3 members do not read it — and this is stated when the thread is started (P2-A14).
- **Emotional state:** frustrated, sometimes frightened (a frozen account, a payment they cannot find); wants a human without re-explaining, and needs to know when to expect an answer.
- **Failure paths:**
  - No article matches.
  - Message send fails.
  - R4 has no messaging access.
  - A message is sent twice.
  - An attachment fails or exceeds a limit.
  - The session expires with a long message drafted.
  - The person pastes a full account number, a password or a card number into a message.
  - A reply arrives while the thread is open, or after they have left.
  - The matter is urgent (suspected fraud) and messaging is too slow.
  - The article slug no longer exists.
  - Support is closed.
- **Recovery paths:**
  - Empty search offers "message support".
  - Unsent message kept with retry; drafts persist per thread in the open tab's memory until sent, sign-out or the tab closing, and are never written to device storage.
  - R4 sees how to ask an owner.
  - Duplicate: one idempotency key per send; a retry after an unknown outcome re-reads the thread before sending again.
  - Attachment: the file limits of F3 (10 MB; PDF, JPEG or PNG), at most 5 per message; each file fails alone and the message can be sent without it.
  - Session expiry: the draft survives X4.
  - Sensitive text: the person is told before sending not to include passwords or full account numbers, and that support will never ask for them.
  - Reply: an open thread refreshes on focus; a reply after leaving arrives through X7.
  - Urgent: the help content states which matters need faster contact and what that route is; the route itself is an operations decision not specified here.
  - Missing article: P34 with a way back to help search.
  - Closed: the expected response time is stated when the message is sent.
- **System behavior:** help articles from `lib/data/` (up to 200 searched on the device, `HELP_ARTICLE_LIMIT`) searched with `use-debounced-search` (works signed out and offline once loaded); `use-threads`, `use-thread`, `use-send-message` (`MESSAGE_MAX_LENGTH` of 5,000 characters, idempotent). Threads are `standard` tier, refetch on focus; no polling. A message automatically carries the workspace, the page it was started from and, if started from an error, that error's reference — never page content or amounts. Messages are retained per the backend's policy and are readable by the thread's author, the workspace's owners, R5 and R7.
- **Completion criteria:** (1) an article was opened, or a thread exists with the message stored once and readable by support (D5); (2) the sender knows the expected response time; (3) a failed send loses no text; (4) R4 and signed-out visitors can create no thread.
- **Dependencies:** Required: message threads (create, list, send with idempotency key, attachments), response-time information. None exists today.

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
- **Decision points:** retry vs go to dashboard vs contact support. By role: workspace members are routed to P08 and X9 messaging; R4 and signed-out visitors to help content only; internal roles to P29.
- **Emotional state:** worried that money is affected; copy says plainly that viewing failed, not that funds changed.
- **Failure paths:**
  - The outage persists.
  - The error occurs in the group layout itself.
  - The network is lost during a write.
  - The service is degraded rather than down: some resources answer and others do not, or answers are slow.
  - The backend limits the rate of requests.
  - A new version is deployed while the page is open.
  - Retrying repeatedly makes an outage worse.
  - The response is valid but does not match the contract.
  - The health check itself is unreachable.
- **Recovery paths:**
  - The health check result is shown when the backend reports unavailable.
  - `global-error.tsx` renders as the last resort.
  - Write during network loss: writes are refused while offline and never queued for later; one already sent when the network dropped is not re-sent — the person is told it was not confirmed, the draft is kept, and after reconnecting the record is re-read before the write is offered again.
  - Degraded: sections that answered stay usable with their "as of" time; figures already read stay, disclosed as possibly out of date; no figure is blanked or replaced with zero.
  - Rate limit: the wait given by the backend is honoured and stated; reads resume by themselves.
  - New version: a failed load of application code prompts a reload that keeps the URL; a draft is offered for copying before reloading.
  - Retry storms: automatic retries are capped and back off; a manual retry is always available and never queued in multiples.
  - Contract mismatch: section error with a reference (see conventions); it is reported as a fault on Ledgerline's side.
  - Health unreachable: reported as "cannot reach Ledgerline", distinct from "Ledgerline is unavailable", with advice to check the connection.
- **System behavior:** C58 SectionErrorBoundary per section; TanStack Query retries reads twice with exponential backoff of 1–8 s (`QUERY_RETRY_LIMIT`), treats 4xx (other than 408 and 429) as final, and never retries mutations automatically; reads resume on reconnect and on focus. While offline, reads already cached stay readable with their "as of" time, every write and every reveal is disabled with the reason, and exports cannot be started. Every error state carries a reference (P2-A11) and announces itself to assistive technology once. No `console` logging in the client; error reports contain the reference, route pattern and error kind only.
- **Completion criteria:** (1) with one endpoint failing, every other section of the page remains usable; (2) offline, cached figures show their "as of" time and no write can be started; (3) on reconnect, reads recover without a page reload; (4) every error state gives a reference and a next action; (5) no error message states or implies that money moved.
- **Dependencies:** Exists: `GET /api/health`. Required: a request reference returned with every error response, a retry-after value on rate limits.

### X11 — Get-started enquiry

Added in 2.0.0 from the built home page. Its place in the product depends on [OD10](phase-1-product-vision.md#od10--entry-path-from-the-public-site).

- **User intent:** tell Ledgerline "I am interested" without committing to registration.
- **Persona:** R8 Prospect.
- **Trigger:** reading P01 and choosing "Open an account", "Book a demo" or "Get started".
- **Entry points:** P01 primary actions (S04, S55, S62) which lead to S64 Get-started enquiry on the same page.
- **Journey:**
  1. The visitor reaches S64 and enters a work email.
  2. Submit validates the email on the client (`contactSchema` in `lib/validations/contact.ts`).
  3. A valid email is confirmed; an invalid one is reported, naming the problem.
- **Decision points:** enquire vs register (X2) vs sign in (X1) — today only enquiry is offered from P01 (OD10). No role branch: the visitor is signed out; a signed-in member reaching P01 is the failure path below.
- **Emotional state:** low commitment; wary of being put on a mailing list by a financial provider; needs to know what happens next and what the address will be used for.
- **Failure paths:**
  - Invalid or empty email.
  - The visitor is an existing member looking for sign-in and finds only an enquiry form.
  - Intake service unavailable (once one exists).
  - The same address is submitted twice.
  - Automated submissions.
  - The email is over-long or contains a typo in its domain.
  - The request times out.
- **Recovery paths:**
  - Field error announced and linked to the field; value kept.
  - Until OD10 is answered, the enquiry confirmation must not imply that sign-in or registration happened.
  - Intake failure keeps the email and offers retry.
  - Duplicate: the same confirmation is given and one enquiry is recorded; the response never says whether the address was already known.
  - Automation: the intake limits the rate per source and answers 429 with a wait; no challenge is specified until OD10 chooses an intake.
  - Length and typo: the address is limited to 254 characters and validated for format only; it is repeated back in the confirmation so the visitor can catch a mistake.
  - Timeout: the visitor is told it could not be confirmed and may send again; the idempotency key prevents a second record.
- **System behavior:** today the form validates and sends nothing; its confirmation copy says so (design-study state). When OD10 chooses an intake, submission goes through a hook wrapping a Server Action or a route in `lib/api-routes.ts`, with an idempotency key; the email is never placed in a URL, an analytics event or a client-side error report, and is used only for the stated purpose. What the address is used for, and for how long it is kept, is stated at the point of entry and is decided with OD10.
- **Completion criteria:** (1) a valid address yields a confirmation that repeats it and says what happens next (or, in the design-study state, that nothing was sent); (2) an invalid address yields a field error and no request; (3) the confirmation never implies an account or session exists; (4) once an intake exists, two submissions with one key record one enquiry.
- **Dependencies:** Required once OD10 is answered: an enquiry intake endpoint or service with rate limiting and a stated retention period. Today: none.

## Backend dependency summary

| Resource | Exists today | Flows |
|---|---|---|
| Auth register, login | Exists | X1 X2 F5 |
| Users list, create, me, get, update, delete | Exists | D5 D7 X1 X8 |
| Health | Exists | X10 |
| User stats total and series | Exists | D7 |
| Workspaces, memberships, invitations | Required | F1 F5 D3 X6 |
| Accounts, balances | Exists in part: `GET /api/accounts` lists the signed-in member's accounts with balances and the states `OPEN` / `FROZEN` / `CLOSED` (mapping to the specified states: OD11). Required: workspace scoping, per-viewer permission filtering, account detail, balance "as of" time, `pending_verification` state, server-computed per-currency totals | F1 F2 D1–D4 |
| Transactions (list, detail, annotations, attachments) | Required | F1 F2 F3 |
| Ledger summary, cash-flow series, compare periods | Cash-flow series exists (`GET /api/cash-flow`, posted only, one currency). Ledger summary and compare periods Required | F1 F2 F4 |
| Counterparties, saved views | Required | F3 |
| Statements, exports | Required | F4 |
| Notifications, alert rules | Required | X7 |
| Message threads | Required | X9 D5 |
| Verification cases (workspace and compliance) | Required | F5 D6 |
| Sessions, password reset, two-step, step-up | Required | X4 X5 X8 |
| Support lookup, audit log | Required | D5 and all audited actions |
| Transfers, payees | Required (outside v1) | F6 F7 |
| Enquiry intake | Not decided (OD10); the built form sends nothing | X11 |
| Cross-cutting: record versions for conflict detection, idempotency keys on creating writes, a request reference on every error, attempt throttling with a retry time | Required | every flow with a write; X1 X10 |

## Assumptions

- A3 applies to every Required dependency: the backend publishes it through the OpenAPI contract.
- A4 underlies D3 and workspace-scoped query keys.
- A9 underlies D5–D7 guards.
- Phase-local: role change and member removal in X6 are mutations on the memberships resource; their hook names are fixed in [Phase 7](phase-7-frontend-architecture.md).
- Phase-local: workspace creation in F5 step 1 uses the workspaces resource; its hook name is fixed in Phase 7.
- Phase-local: export default includes posted transactions only; including `pending` is an explicit option.

Numbered phase-local assumptions (added by the enterprise audit of 2026-10-01). Each value is a product decision the maintainer may change; where a named constant exists in [Phase 7 §10](phase-7-frontend-architecture.md) the value belongs to that constant. Every limit, expiry and retention value here restates Phase 1 BR19, which is the authority when the two differ.

| ID | Assumption | Owner |
|---|---|---|
| P2-A1 | "Today" and all period boundaries use the workspace time zone; posting dates are never shifted; the workspace zone is UTC when unset; event and "as of" times are given in the viewer's zone with the zone named; internal (admin) sections use UTC. | Maintainer (OD1 informs) |
| P2-A2 | A figure is disclosed as possibly out of date when its "as of" time is more than 15 minutes old, or when it is served from cache after a failed refresh or offline (`BALANCE_STALE_AFTER`). Freshness tiers: `live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never, with fetched data kept 5 minutes after last use (`GC_TIME_MS`). Authority: Phase 1 BR19. | Maintainer (OD5 informs) |
| P2-A3 | Request timeouts: 15 s for reads (`REQUEST_TIMEOUT_MS`), 30 s for writes (`MUTATION_TIMEOUT_MS`); slow-request notice at 10 s (`SLOW_REQUEST_MS`); reads retried twice with 1–8 s backoff; a timed-out write has an unknown outcome and is never re-sent automatically. Authority: Phase 1 BR19. | Maintainer |
| P2-A4 | Exports: range at most 366 days (`EXPORT_MAX_RANGE_DAYS`); at most 5,000,000 rows (`EXPORT_MAX_ROWS`); 3 active jobs per member (`EXPORT_ACTIVE_JOB_LIMIT`); files downloadable for 7 days after `ready` (`EXPORT_RETENTION_DAYS`); polled every 5 s (`EXPORT_POLL_INTERVAL`); described as delayed, and no longer polled, after 30 minutes `running` (`EXPORT_POLL_MAX_MS`); signed download link 5 minutes, single use (`DOWNLOAD_LINK_TTL`). A member sees their own jobs; R1 and R2 also see every job in the workspace; R3 sees only their own. Authority: Phase 1 BR19. | Maintainer + backend |
| P2-A5 | Files: 10 MB each (`UPLOAD_MAX_BYTES`), PDF / JPEG / PNG; 10 attachments per transaction; 5 per message; 10 documents per verification document kind and 20 per case; avatar 2 MB (`AVATAR_MAX_BYTES`), JPEG / PNG. Notes: 2,000 characters (`NOTE_MAX_LENGTH`); decision reasons: 10–2,000 characters; messages: 5,000 characters (`MESSAGE_MAX_LENGTH`). Authority: Phase 1 BR19. | Maintainer + compliance |
| P2-A6 | Idle warning 2 minutes before idle expiry (OD2 recommends 15 minutes idle, 12 hours absolute); step-up grant 5 minutes and single-purpose (`STEP_UP_GRANT_SECONDS`): a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant; 5 failed step-ups in 15 minutes lock step-up for 15 minutes; a revealed number re-masks after `REVEAL_TIMEOUT` (30 s, with a 10 s warning and extend). Authority: Phase 1 BR19. | Maintainer (OD2) |
| P2-A7 | Sign-in is throttled after 5 failed attempts (`AUTH_MAX_ATTEMPTS`) in 15 minutes with a 15-minute lock, answered with 429 and a wait time; a two-step challenge lasts 5 minutes (`CHALLENGE_TTL`); `next` is a same-origin path of at most 2,048 characters. Authority: Phase 1 BR19. | Backend team |
| P2-A8 | Password reset link: 30 minutes, single use, newest only (`RESET_LINK_TTL`). Invitation: 7 days, single use, resend invalidates the earlier link (`INVITE_TTL_DAYS`). A workspace holds at most 200 members (SCALE_TARGET, `TEAM_MEMBER_LIMIT`) and 50 pending invitations (`INVITE_PENDING_MAX`); a verification case holds at most 20 beneficial owners (`OWNER_LIMIT`, which does not count members holding the owner role). Authority: Phase 1 BR19. | Maintainer + backend |
| P2-A9 | Notifications are kept 90 days and the unread count is re-read every 60 s while the tab is visible, reading "99+" beyond 99 (authority: Phase 1 BR19); a payee changed within 7 days (`PAYEE_CHANGE_HOLD_DAYS`) needs explicit confirmation before payment (F7). | Maintainer |
| P2-A10 | Shared records (notes, verification steps, roles, user records, case decisions, payees) and a member's own alert rules (per member, at most 20, `ALERT_RULE_LIMIT`; no shared workspace rule) are versioned; a stale write is refused with a conflict (409) and the member keeps what they typed. Last-write-wins is not used anywhere. Notes are append-only. A write interrupted by session expiry or step-up is never replayed: its draft is kept in the open tab's memory only, never in device storage, and is gone when the tab closes or a different user signs in; writes are refused offline, never queued. | Backend team |
| P2-A11 | Every error response carries a required request reference that support can look up, including a refusal produced before the backend is reached (validation, offline), whose reference the client generates; the reference holds no personal or financial data. | Backend team |
| P2-A12 | Audit records hold actor, workspace, action, subject ID, time and outcome, and no amount, full account number, credential or document content. R7 reads all; R6 reads case history; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 but may ask support for the entries about their own workspace; no workspace-facing audit view is specified (see report in Changes). Who may read the audit record is OD12. | Maintainer + compliance |
| P2-A13 | A decided verification case is corrected by a new recorded action, never edited. Deleting a user ends their sign-in and keeps their notes, decisions and audit records attributed. | Maintainer + compliance (OD1 informs) |
| P2-A14 | A support thread belongs to the member who opened it and is readable by that member and by the workspace's owners (R1); other R2 and R3 members do not read it and see only their own threads. | Maintainer |

## Changes in this version

- **Retained:** F1–F7, D1–D7, X1–X10 with every step, failure and recovery path.
- **Changed:** section and contract names updated to the 2.0.0 names; "drawer" wording replaced by "overlay" (the route slot keeps its code name `@drawer`); visual wording (tones, "visibly distinct", "placed first") rewritten as behaviour; phase links renumbered to the 9-phase set.
- **Changed (2026-10-02, job-based names — Critical Rules › No Visual Prescription):** section names that named a container or control now name the job; IDs, behaviour, scope and status are unchanged and nothing was removed. S03 Page title & actions → Page identity & actions; S10 Business details form → Business details; S11 Beneficial owners form → Beneficial owners; S19 Account list → Account directory; S30 Statement list → Statement downloads; S31 Export builder → Export request; S34 Notification feed → Notification history; S36 Thread list → Support threads; S40 Invite member form → Member invitation; S42 Profile form → Profile details; S44 Transfer form → Money transfer; S45 Payee list → Payee management. The full record is the [Phase 5 name table](phase-5-section-blueprints.md#names-in-this-version).
- **Added:** X11 Get-started enquiry; R8 in the flow index; enquiry intake in the dependency summary; OD9 and OD10 notes.
- **Self-audit (tightened seed, No Visual Prescription):** journey steps that listed what a section shows (fields such as "name, C42, balance, state"; "badge"; "DeltaChip"; "CopyButton"; "row menu"; "Dialog"; "overlay"; "toast"; "skeletons"; "stepper highlights"; "shell") rewritten as what the user learns or does, keeping contract IDs for traceability. No flow, step, failure or recovery path removed.
- **2.1.0 — enterprise audit and reconciliation (2026-10-01):** every map deepened (inherited conventions, role branches, failure and recovery paths, timing, audit, testable completion criteria, backend capabilities; assumptions P2-A1–P2-A14) with no flow, ID, heading, step or path removed or renamed; then reconciled to the canonical decisions, with Phase 1 BR19 as the authority for every limit and Phase 7 §10 for constant names. Behaviour settled: a stale write is refused and the member keeps their text; an interrupted write is never replayed and a different user's re-authentication drops drafts; writes are refused offline, never queued; a page-level denial is the not-permitted state (C32); reveal belongs to R1–R3 only; R3 and R4 get the not-permitted state for alert rules; `GET /api/accounts` and `GET /api/cash-flow` are recorded as existing. Open questions now carry OD11, OD12, OD13 and OD15. Residual decisions then applied: export jobs visible to their requester and to R1 and R2; support threads readable by their author and owners; alert rules per member; a step-up grant never authorising money movement unless issued for it; drafts kept in the open tab's memory only; freshness tiers named.
- **Journeys an enterprise banking console needs that have no map here** (reported, not added — a new flow ID is the maintainer's call; the journeys are recorded as OD15): accepting an invitation as the invitee (X6 covers only the inviter); a workspace-facing audit trail (who revealed, exported, changed roles); reporting an unrecognised or suspected-fraudulent transaction; recovery when the second factor is lost (touched in X1 only); transferring ownership or closing a workspace; a personal-data access or erasure request; the runway calculator (P16) as an experience; platform incident and maintenance communication; creating or joining a second workspace.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md): personas R1–R8, JTBD, business rules BR1–BR12 and BR19 (the limits, expiry and retention table, the authority for every value here), permission matrix, open decisions OD1–OD16.
- **Downstream:**
  - [Phase 3](phase-3-information-architecture.md) builds navigation and route groups from the entry points here.
  - [Phase 4](phase-4-page-blueprints.md) specifies every page named in a journey.
  - [Phase 5](phase-5-section-blueprints.md) specifies every section and its failure and recovery states.
  - [Phase 7](phase-7-frontend-architecture.md) fixes hooks, query keys, polling and the backend contract listed under Dependencies.
  - [Phase 8](phase-8-implementation-roadmap.md) sequences the flows and records progress, including F6 and F7.
  - [Phase 9](phase-9-qa-checklist.md) turns completion criteria and recovery paths into test cases.
