# Ledgerline Design OS — Phase 5: Section Blueprints

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 4 — Page Blueprints](phase-4-page-blueprints.md) · Next: [Phase 6 — Interaction Contracts](phase-6-interaction-contracts.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Contents

- [How to read this file](#how-to-read-this-file)
- [Names in this version](#names-in-this-version)
- [Section contract](#section-contract)
- [Shell & navigation](#shell--navigation) — S01–S03
- [Marketing (specified)](#marketing-specified) — S04–S07
- [Marketing (built in 2.0.0)](#marketing-built-in-200) — S55–S64
- [Authentication](#authentication) — S08
- [Onboarding & verification](#onboarding--verification) — S09–S13
- [Dashboard](#dashboard) — S14–S18
- [Accounts & ledger](#accounts--ledger) — S19–S23
- [Transactions](#transactions) — S24–S27
- [Insights](#insights) — S28–S29
- [Documents](#documents) — S30–S32
- [Counterparties](#counterparties) — S33
- [Inbox](#inbox) — S34–S37
- [Settings & team](#settings--team) — S38–S43
- [Payments](#payments) — S44–S45
- [Help](#help) — S46–S47
- [Internal](#internal) — S48–S53
- [System](#system) — S54
- [Open questions](#open-questions)
- [Assumptions](#assumptions)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

## How to read this file

Phase 4 decided which pages exist and what each must offer. This phase breaks them into **64 sections**: each does one job, owns its states, and can serve more than one page. Every blueprint uses the same eleven fields from the seed: Purpose · Responsibilities · Data requirements · Interaction model · Device needs · Accessibility (requirements) · Loading (states) · Error (states) · Empty (states) · Reuse (potential) · Technical notes (data, validation and dependencies only).

**Behaviour only.** No blueprint specifies what a section shows, which components or controls it uses, layout, order on screen, sizing, imagery, animation or wireframes. The **Purpose** of every section names the job it does for the user.

Conventions:

- **IDs are binding.** A section is always named "ID + name" (S23 Ledger entries).
- **Hooks** are `lib/hooks/use-<resource>.ts` (TanStack Query); authenticated hooks wrap Server Actions in `lib/actions/`. Sections never import `@/lib/api-client`.
- **Types** are proposals for `lib/types/<domain>.ts`; once the backend publishes a module, each becomes `z.infer` of the generated schema.
- **Copy** is a named constant: empty states in `lib/data/empty-states.ts` (`EMPTY_STATES`), labels in `lib/<feature>/constants.ts`.
- **Contracts.** The "Contracts:" line under each section names the interaction contracts from [Phase 6](phase-6-interaction-contracts.md) whose behaviour the section relies on. Which components realise them is decided at build.
- **Scope.** S44, S45 are specified but Deferred (A2, OD3). S55–S64 were added from the built home page and several exceed v1 scope (OD9).

## Names in this version

Renamed in 2.0.0 because the earlier names described a layout (Critical Rules › No Visual Prescription). IDs, behaviour and scope are unchanged.

| ID | 1.0.0 name | 2.0.0 name |
|---|---|---|
| S01 | App sidebar | Primary navigation |
| S02 | Top bar | Global utilities |
| S03 | Page header | Page title & actions |
| S04 | Marketing hero | Marketing proposition |
| S05 | Value proposition grid | Value propositions |
| S06 | Security & trust strip | Security & trust statements |
| S07 | Marketing footer | Public legal & support links |
| S08 | Auth card | Authentication step |
| S09 | Onboarding stepper | Verification progress |
| S13 | Verification status banner | Verification status notice |
| S14 | Cash position band | Cash position |
| S15 | Account summary strip | Account summary |
| S18 | Cash-flow chart | Cash flow over time |
| S20 | Account hero | Account overview |
| S21 | Ledger toolbar | Ledger filters |
| S23 | Ledger table | Ledger entries |
| S25 | Transaction timeline | Transaction lifecycle |
| S39 | Team table | Team members |
| S41 | Role permissions matrix | Role permissions reference |
| S48 | Admin KPI band | Platform growth figures |
| S49 | Admin users table | Platform user directory |
| S54 | Status page body | Status explanation |

## Section contract

Binds all 64 sections. A blueprint that breaks a rule says so with a "Why".

### The four-state rule

Every section that reads server state renders exactly one of: **loading**, **empty**, **error**, **populated**. [C57 QueryBoundary](phase-6-interaction-contracts.md#c57--queryboundary) chooses the state.

| State | Trigger | Renders | Rule |
|---|---|---|---|
| Loading | `query.isPending` (no cached data) | The section's loading placeholder | Reserves the populated space so nothing shifts; never a blocking full-page loader. Three kinds are kept apart: **first load** (no cached data: the placeholder, only once `LOADING_DELAY_MS` has passed), **refresh** (cached data stays readable and usable, the section is marked busy, nothing is swapped for a placeholder) and **load more** (loaded items stay, only the incoming page is marked busy, focus is not moved). No load waits for ever: after `REQUEST_TIMEOUT_MS` it becomes a retryable error (A16). |
| Error | `query.isError` with no cached data | [C33 ErrorState](phase-6-interaction-contracts.md#c33--errorstate) with a message from constants and **Retry** (`refetch`) | Never a raw stack or backend text. Three kinds are kept apart: **retryable** (network failure, timeout, server fault, rate limit) offers Retry — when rate-limited, only once the stated wait has passed; **non-retryable** (refused, not found, conflict, a response that fails its schema) offers no Retry and states the way forward instead; **offline** says so, Retry waits for `online`, and the section refetches by itself on reconnect. Every error gives a reference the person can quote to support (Q7) — the reference is a required part of every failure, including a refusal produced before the backend is reached (validation, offline) — and never implies that money moved or a balance changed. |
| Empty | success and `isEmpty(data)` | [C32 EmptyState](phase-6-interaction-contracts.md#c32--emptystate) with copy from `EMPTY_STATES` | Three kinds are kept apart: **none yet** (says what will make data appear and the next step), **none match** (filters or search exclude everything: "Clear filters") and **not permitted** (the member's role does not include this: says which role does and that an owner can change it; never worded as if no data existed, never with Retry). A zero balance or a zero total is populated, not empty. |
| Populated | success with data | The section body | A background refetch keeps data on screen and marks the section busy. |

If a background refetch fails while data is cached, the data stays and a [C24 Transient message](phase-6-interaction-contracts.md#c24--transient-message) says it may be out of date, with the time it was last known good. Render exceptions are caught by [C58 SectionErrorBoundary](phase-6-interaction-contracts.md#c58--sectionerrorboundary).

Reads: every response is parsed by its Zod schema before a section receives it. A response that fails parsing is a non-retryable error for that query — never rendered in part, never rendered as zeros. A section that combines several queries (S17, S43, S48) keeps what loaded, names what did not, and reports "empty" only when every source succeeded. Reads retry twice (`QUERY_RETRY_LIMIT`) with a 1–8 s backoff before the error state; a read still unanswered after `SLOW_REQUEST_MS` says it is still working. A 401 opens [C55](phase-6-interaction-contracts.md#c55--sessionexpirydialog) instead of an error; a 403 is the not-permitted state; a resource the role may not see answers exactly as one that does not exist.

Mutations: while pending, the trigger is disabled and `aria-busy`, so a repeated activation has no effect; validation errors are tied to their field ([C10 Field](phase-6-interaction-contracts.md#c10--field)); transport errors are stated with Retry; success is confirmed and invalidates related keys. Nothing optimistic touches money. Beyond that, every write follows the same five rules unless its section states a "Why":

- **Idempotent creation.** A write that creates something carries an idempotency key (`nanoid`, one per submission of the same input). A retry after an uncertain outcome returns the original result, never a duplicate.
- **No silent overwrite.** A write that edits a record carries the `updatedAt` it was based on. A stale write is refused (409): the latest record is loaded and what the person entered is kept so they can re-apply it. There is no last-write-wins anywhere: the person chooses what to do with what they entered. Toggles (flag, read state) are idempotent — asking for the state a record already has is treated as done — and a toggle based on a version someone else has since changed is refused like any other edit. Notes are append-only, so they cannot collide.
- **No automatic retry.** A failed write is retried by the person, not by the client. On any failure their input is kept. A write unanswered after `MUTATION_TIMEOUT_MS` (30 s) is stated as an uncertain outcome and is never sent again automatically.
- **Session expiry or step-up mid-task (X4).** C55 re-authenticates without leaving the page: input and position are kept and reads refetch. An interrupted write is never replayed: the draft is kept in the open tab and the person submits it again, with the same idempotency key. Drafts live in memory only: a draft interrupted by session expiry, step-up or a refused write is never written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and it is gone when the tab closes. If a different user re-authenticates, the drafts are dropped.
- **Offline.** Reads keep cached data with its time; writes are unavailable and say why; nothing is queued to send later. Why: a queued financial or identity write that lands hours later is a surprise.

### One primary fact

Each section conveys one primary piece of information (DP2), named in its Purpose. How that priority is expressed is decided at build.

### Shared data conventions

- **Money** is `Money = { amountMinor: string; currency: string }` (`lib/types/money.ts`): a signed integer string in minor units plus ISO 4217. Only [C40 Amount](phase-6-interaction-contracts.md#c40--amount) formats it.
- **Query keys** are `[resource, workspaceId, scope, params]` from the factory `queryKeys` in `lib/hooks/query-keys.ts` ([Phase 7 §8.1](phase-7-frontend-architecture.md#81-query-key-factory--libhooksquery-keysts)).
- **Stale time** tiers in `STALE_TIME` (`lib/constants.ts`): `live` 15 s (balances, pending, counts), `standard` 60 s (lists, detail), `slow` 5 min (team, settings, rules), `static` never (bundled `lib/data` copy). Cached data is kept 5 minutes after its last use (`GC_TIME_MS`; 0 for a revealed account number).
- **Cursor pagination.** Unbounded lists return `CursorPage<T> = { items: T[]; nextCursor: string | null }`, read with `useInfiniteQuery`. Offset paging is never used against the ledger: offsets drift as rows post, so rows would be skipped or doubled.
- **Filters live in the URL.** A filtered view is a shareable link, restored by Back. A link opens only what the opener's own role allows; a parameter that fails its schema is dropped and the member is told.
- **Money correctness.** No float arithmetic and no client rounding: an amount is shown exactly, with the decimal places its currency defines (none, two or three, from `Intl`). Credit is positive, debit negative. Totals come from the server, one per currency; amounts in different currencies are never added, netted or compared. The little arithmetic the client keeps (S29) uses `BigInt`. An amount a person types is parsed from its string straight to minor units.
- **Pending and posted.** `available` and `current` are server figures, never derived on the client. A total counts posted entries only unless its section says it includes pending — and then says so in text. A pending amount is provisional and labelled as such. `returned`, `reversed` and `failed` entries keep their own state and are never netted away on the client.
- **Freshness.** Every balance and total carries the time it was true (`asOf`). Data refetches on window focus, on reconnect, on workspace switch and after a write that affects it. A figure older than `BALANCE_STALE_AFTER`, or served from cache after a failed refresh or while offline, is stated as possibly out of date with its time (A16).
- **Time.** Instants travel as ISO 8601 UTC. Dates, "today" and period boundaries are computed in the workspace time zone (S38; UTC when unset), which is named wherever a time is given, so a team spread across zones reads one "today". Periods are calendar dates, so a 23- or 25-hour day and a short month need no special case; a range's end date includes the whole day. Posting dates are never shifted. Internal sections S48–S53 use UTC and say so (A22).
- **Limits.** Every list has a page size and every input a maximum, both named constants. At a limit the action is unavailable with the reason stated, rather than failing after submission (A17–A20). [Phase 1](phase-1-product-vision.md) BR19 is the authority for every limit, expiry and retention value; this file restates them.
- **Privacy.** URLs carry opaque IDs and filter values only. No amount, account number, email or personal name reaches a document title, an analytics event or a client log; device storage holds only what a section names — non-financial interface preferences, never a draft, an amount or a record — and explicit sign-out clears it. Account numbers are the last four digits except during a step-up reveal.
- **Audit.** The backend records — with actor, workspace, time and subject — every reveal, download, export, role or membership change, settings or security change, case decision, internal lookup and user change. Annotation changes are readable by members through S25; who else may read the record is Q12 (Phase 1 OD12).
- **Locale.** Locale-dependent formats — currency, digit grouping, dates, relative time, plurals, lists, sorting by name (`Intl.Collator`) — go through `Intl` with `DEFAULT_LOCALE`. No sentence is assembled from fragments in a fixed word order (A6).

### Shared accessibility floor

- Each section is a `<section aria-labelledby>` pointing at an `<h2>`; the page title is the only `<h1>`.
- One polite `role="status"` per asynchronous section announces results ("42 transactions"), never every keystroke; `role="alert"` only for an error that blocks the task.
- Tables use `<table>` semantics (`<caption>`, `<th scope="col">`, `aria-sort`); a virtualized table exposes `aria-rowcount` and `aria-rowindex`.
- Every control is keyboard-reachable and labelled. No state is conveyed by colour alone.
- Masked account numbers read as "ending 4821".
- Motion never carries information; reduced motion is honoured.
- **Keyboard path.** Every section's job is completable by keyboard in reading order. A single-character shortcut acts only while its section has focus, never while the person is typing (WCAG 2.1.4).
- **Focus after an outcome.** On success focus stays on what the person used. When an item is removed, focus moves to the next item, else the previous one, else the section heading. When something opens, focus moves into it and returns to what opened it on close. On a validation failure focus moves to the first invalid field. A refresh, a poll or incoming data never moves focus.
- **Announcements.** A result is announced politely once, when it settles. A periodic refresh is not announced unless the state the person is waiting on changed. Anything that times out says so beforehand and can be extended or repeated (WCAG 2.2.1).

### File discipline

File locations, names and size limits for every section are code organisation and live in [Phase 7](phase-7-frontend-architecture.md) (OD4), including the 1.0.0 file names of renamed sections.

## Shell & navigation

S01 and S02 are mounted once in the group layouts; each page uses S03 itself.

### S01 — Primary navigation

Pages: every `(app)` and `(admin)` page · Contracts: [C35](phase-6-interaction-contracts.md#c35--navitem) [C36](phase-6-interaction-contracts.md#c36--workspaceswitcher) [C18](phase-6-interaction-contracts.md#c18--avatar) [C54](phase-6-interaction-contracts.md#c54--colour-scheme-preference)

- **Purpose** — Let a member move between product areas and between workspaces without losing their place, always knowing which workspace (business) they are looking at.
- **Responsibilities** — Offer the navigation groups from `lib/data/navigation.ts` permitted for the current role; mark the current route; let the member switch workspace and, if offered, set the colour-scheme preference; keep navigation available on small screens.
- **Data requirements** — `use-workspace` (`["workspace","current"]`, `["workspace","list"]`, slow) and `use-me` (`["me"]`, slow). Nav config is static, filtered by role from C63; `(admin)` filters on platform role. `NavItem`: `id`, `label`, `href`, `icon`, `roles: WorkspaceRole[]`, `group: "primary" | "secondary" | "internal"`. `Workspace`: `id`, `name`, `role`, `verificationState`. Memberships refetch on window focus and after any 403, so a role changed or removed by an owner takes effect without signing out. Scale: one membership (nothing to switch) up to an accountant holding 100 or more — the memberships are sorted by name with `Intl.Collator`, and beyond 10 memberships the switcher becomes searchable, so they can be narrowed by typing. A membership that fails its schema is left out and reported with a reference; the rest stay usable.
- **Interaction model** — Choosing an item is client navigation; the current item follows `usePathname()`. Switching workspace sets it current and invalidates keys starting with the old `workspaceId`; the member stays on the same route if the new role allows it, else goes to `/dashboard`. Switching with unsaved input on the page asks before discarding it (C52). The current workspace is one per browser (C63): a switch made in another tab is noticed here on focus, and this tab reloads into the new workspace with a C24 notice — two workspaces' data are never mixed. A membership revoked mid-session falls back per C63. A destination the role may not open is not offered; a direct link to it gets the not-permitted state. When the session expires navigation stays usable and C55 takes over.
- **Device needs** — every item reachable on a phone with the same groups (Phase 3 §2.4).
- **Accessibility** — `<nav aria-label>`; current item `aria-current="page"`; groups are lists with accessible group names; items keep accessible names when labels are hidden; the switcher announces "Switched to {workspace}". A skip link (`MAIN_CONTENT_ID`) bypasses navigation; after client navigation focus moves to the page `<h1>`; after a switch focus stays on the switcher and the announcement names the workspace and the member's role in it.
- **Loading** — navigation is usable immediately from static config; only the workspace switch and the member's identity wait on data.
- **Error** — workspace list fails → the current workspace name from the session is still given, with "Couldn't load workspaces · Retry"; navigation stays usable. Offline: routes already visited stay reachable; switching is unavailable and says why.
- **Empty** — one workspace → nothing to switch to; the workspace is simply named. A signed-in member always has a workspace (onboarding creates one).
- **Reuse** — every `(app)` and `(admin)` page via the two layouts; the `(admin)` variant takes its own navigation config.
- **Technical notes** — Client-side only because it reads `usePathname`. The workspace name is the only business identifier allowed in a document title. Must hold: after a switch nothing keyed on the previous `workspaceId` is rendered.

### S02 — Global utilities

Pages: every `(app)` and `(admin)` page · Contracts: [C38](phase-6-interaction-contracts.md#c38--commandpalette) [C39](phase-6-interaction-contracts.md#c39--notification-entry-point) [C37](phase-6-interaction-contracts.md#c37--usermenu) [C29](phase-6-interaction-contracts.md#c29--breadcrumbs)

- **Purpose** — Give every page one way to search, know about unread notifications and reach the member's own account actions.
- **Responsibilities** — Open the command palette; give the unread count; reach profile, security, help and sign out; expose navigation on small screens; offer breadcrumbs on detail pages.
- **Data requirements** — `use-notifications` count mode (`["notifications", workspaceId, "count"]`, refreshed every `NOTIFICATION_POLL_INTERVAL`, refetch on focus); `use-me` shared with S01. Palette sources load only after it opens. `NotificationCount = { unread: number }`; member from `use-me` (`UserResponseDto`: `id`, `fullName`, `email`, `avatar`). The count refreshes every `NOTIFICATION_POLL_INTERVAL` (60 s) in a visible tab, refetches on focus, reconnect and after a mark-read, is not polled in a hidden tab, and reads "99+" beyond 99 (C39). Palette search runs on the server for 2 to `LEDGER_QUERY_MAX_LENGTH` characters, debounced by `SEARCH_DEBOUNCE_MS` (300 ms); a superseded request is cancelled so results never arrive out of order; each scope returns at most `PALETTE_RESULT_LIMIT` (5) with a route to full search (P11) for the rest. R4 gets results from permitted accounts only, with no hint that others exist. Recent items are held in the open tab's memory only, never in `localStorage`: at most 8 entries of IDs and labels per workspace, cleared on sign-out.
- **Interaction model** — Search covers transactions, accounts and counterparties. ⌘K/Ctrl+K opens the palette anywhere (hint per C28); `/` focuses it when no field has focus; the notification entry goes to P20; "Sign out" runs `use-logout` (X3) and goes to `/auth/login`. Sign-out with unsaved input asks before discarding (C52); it clears cached server data, device-held recents and the drafts kept in open tabs, and signs out every open tab. If the sign-out request fails the member is told they are still signed in, with Retry — never presented as signed out while the server session lives.
- **Device needs** — search, notifications and sign-out reachable on a phone.
- **Accessibility** — `<header>` landmark (banner role); the notification entry's name includes the count ("Notifications, 3 unread"); count changes announced politely at most once a minute; palette is a dialog (`aria-modal`) with combobox + listbox. Opening the palette moves focus to its search; Escape closes it and returns focus to where it was; arrow keys move between results and Enter opens one; the result count is announced once typing settles. `/` is a single-character shortcut and can be turned off (WCAG 2.1.4).
- **Loading** — while the count loads no number is given; never "0".
- **Error** — count failure gives no number and no error. Why: the count is secondary; S34 carries the real error. A failed palette search is stated inside the palette with Retry and a reference; static destinations still work. Offline: static destinations and cached accounts only.
- **Empty** — zero unread → no count. A palette search with no match says so (`EMPTY_STATES.paletteNone`) and offers full search.
- **Reuse** — every `(app)` and `(admin)` page.
- **Technical notes** — Palette sources typed in `lib/data/command-sources.ts`.

### S03 — Page title & actions

Pages: P08–P25, P29–P33 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C01](phase-6-interaction-contracts.md#c01--button) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Tell the member which page they are on and what they can do from it.
- **Responsibilities** — Say which page this is and where it sits in the hierarchy; give access to the page's actions; let the member move between sub-pages where they exist.
- **Data requirements** — none of its own; a dynamic page name comes from the page's own section query. Page names from `PAGE_TITLES`; hierarchy from the sitemap; sub-pages via C23. The document title is the page name plus the workspace name — never an amount, account number, email or search text. A dynamic name that includes an account uses the masked form (C42).
- **Interaction model** — each page has at most one main action; any others are secondary. An action the role lacks is withheld (C59), not offered and then refused. An action whose precondition fails (account `frozen`, offline, a limit reached) stays discoverable but unavailable, with the reason in text.
- **Device needs** — the page's main action can be reached quickly on a phone.
- **Accessibility** — `<h1>`; breadcrumbs `<nav aria-label="Breadcrumb">` with `aria-current="page"`; the secondary actions' name includes the page ("More actions for Statements"). After client navigation focus moves to the `<h1>`, and the new title is what a screen reader hears.
- **Loading** — a dynamic page name not yet available is marked as loading.
- **Error** — none of its own. If the query behind a dynamic name fails, the static `PAGE_TITLES` name is used — never a raw ID.
- **Empty** — not applicable.
- **Reuse** — twenty-four pages.
- **Technical notes** — Rendered on the server; no client state.

## Marketing (specified)

Every claim is a reviewed constant (BR10). Nothing invented: no balances, logos, testimonials or certifications. **OD9** governs how these relate to the built sections S55–S64.

### S04 — Marketing proposition

Pages: P01 · Contracts: [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say in one sentence what Ledgerline is, and send the visitor to start or sign in.
- **Responsibilities** — State the proposition and let the visitor start or sign in, with copy from `lib/data/`. Any product illustration is labelled as illustration and never uses real customer data.
- **Data requirements** — none fetched. `MarketingHero` (type name from 1.0.0): `headline`, `subline`, `primaryCta {label, href}`, `secondaryCta {label, href}`, `visualAlt`. Sample amounts in the preview are integer minor units with a currency and are labelled as samples wherever they are readable; no visitor data is read or stored.
- **Interaction model** — specified: start → `/auth/register` (X2), sign in → `/auth/login` (X1); signed-in visitors are offered `/dashboard`. **Built:** "Open an account" and "Book a demo" → S64 enquiry (OD10); a product preview uses a sample company with sample balances, approvals and activity (OD9 facet d). Whether the visitor is signed in is read on the server; an expired session counts as signed out, with no error. Both actions are plain links and work without JavaScript.
- **Device needs** — on a phone the visitor can read the proposition and start without hunting for either.
- **Accessibility** — the headline is the page `<h1>`; any illustration has meaningful `alt` (built: a descriptive label for the preview); actions are real links with distinct names; the headline is readable without JavaScript.
- **Loading / Error** — none (static).
- **Empty** — not applicable.
- **Reuse** — P01 only.
- **Technical notes** — **Built.** Preview sample data in `lib/data/ledgerline/dashboard.ts`.

### S05 — Value propositions

Pages: P01 · Contracts: [C14](phase-6-interaction-contracts.md#c14--content-group)

- **Purpose** — State the four things v1 actually does: see balances, search transactions, export for accounting, work with the team.
- **Responsibilities** — Map `lib/data/` value props; every item describes an existing v1 capability; no money-movement claims (A2).
- **Data requirements** — none fetched. `ValueProp`: `id`, `icon`, `title`, `body`. Exactly four items, each tied to the flow that delivers it (F1, F3, F4, X6), so a release check can fail any claim v1 does not deliver (Q-247).
- **Interaction model** — read only; nothing in it navigates away, so nothing competes with the start action.
- **Device needs** — baseline.
- **Accessibility** — `<h2>`; items are a list; icons `aria-hidden`.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P01.
- **Technical notes** — **not built as specified.** The built page covers this job with S57–S61, which present more than v1 (OD9). S05 stays specified until OD9 is answered.

### S06 — Security & trust statements

Pages: P01 · Contracts: [C14](phase-6-interaction-contracts.md#c14--content-group) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Explain how Ledgerline protects an account, stating only what the product does.
- **Responsibilities** — Make statements about existing behaviour only: masked account numbers, re-authentication before a reveal, two-step sign-in, role-based access, audit logging; each leads to a help article. No badge, certification, regulator logo or insurance claim unless answered in OD1 and approved.
- **Data requirements** — none fetched. `TrustClaim`: `id`, `title`, `body`, `helpSlug`, `reviewedOn` (ISO date of approval). A claim is published only with a `reviewedOn` no older than `CLAIM_REVIEW_MAX_AGE_DAYS` (180, A24) and a `helpSlug` that resolves; otherwise the release check fails rather than the claim going out unreviewed.
- **Interaction model** — each claim links to `/help/[slug]`.
- **Device needs** — baseline.
- **Accessibility** — `<h2>`, a list of claims, self-describing link text.
- **Loading / Error** — none.
- **Empty** — no claims → the section does not render. Why: an empty trust section is worse than none.
- **Reuse** — P01; claims also appear in P28.
- **Technical notes** — **Built** with `SECURITY_CONTROLS` covering two-person approvals, granular roles, audit trail, hardware keys, protected funds and monitoring, noted "Placeholder controls… holds no certifications" (OD9 facet e). The `reviewedOn` field is not present in the built data.

### S07 — Public legal & support links

Pages: P01, P28 · Contracts: [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Give every public page its legal, disclosure and support links.
- **Responsibilities** — Provide legal and support links grouped by topic from `lib/data/`; state the legal entity (from OD1), the copyright and any required disclosure.
- **Data requirements** — none fetched. `FooterGroup` (type name from 1.0.0): `title`, `links: {label, href}[]`; plus `disclosure` while the product is a design study. Every link must resolve at build. The legal entity stays unstated until OD1 names it; the design-study disclosure stands in the meantime.
- **Interaction model** — links only.
- **Device needs** — baseline.
- **Accessibility** — `<footer>` (contentinfo landmark); each group a labelled `<nav>`.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P01, P28.
- **Technical notes** — **Built** with `FOOTER_COLUMNS` and a disclosure stating Ledgerline is fictional, not a bank, not regulated, holding no deposits (`lib/data/ledgerline/closing.ts`). Links point to in-page anchors of the built sections.

## Marketing (built in 2.0.0)

Added from the working-tree home page (`app/page.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`). Recorded as found. Each carries the OD9/OD10 facet it touches; none of them changes v1 scope until the maintainer decides.

### S55 — Public site navigation

Pages: P01 · Contracts: [C03](phase-6-interaction-contracts.md#c03--textlink) [C01](phase-6-interaction-contracts.md#c01--button) [C65](phase-6-interaction-contracts.md#c65--small-screen-navigation-toggle)

- **Purpose** — Let a visitor jump to any topic on the home page and start at any time.
- **Responsibilities** — Reach every home-page topic from anywhere on the page; return to the start of the page via the brand; let the visitor sign in or open an account; offer the same destinations on small screens.
- **Data requirements** — none fetched. `NavLink`: `id`, `label`, `href` (`LEDGER_NAV`, `LEDGER_BRAND` in `lib/data/ledgerline/brand.ts`).
- **Interaction model** — links scroll to anchors; on small screens the navigation opens and closes on request (C65), and choosing a link closes it. "Sign in" and "Open an account" go to S64 (OD10). A signed-in visitor is also offered `/dashboard`. An anchor whose section is absent is not offered.
- **Device needs** — all destinations and the start action available on a phone.
- **Accessibility** — labelled `<nav>` landmarks ("Primary", "Mobile"); the toggle exposes `aria-expanded` and `aria-controls` and names that change with state ("Open menu"/"Close menu"). Escape closes the small-screen navigation and returns focus to its toggle; while it is open focus stays within it; following a link moves focus to the heading of the section reached.
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate for P28's public navigation.
- **Technical notes** — **Built.** Specified links to P02/P03 absent (OD10). The Payments and Cards destinations in `LEDGER_NAV` point at capabilities outside v1 (OD9 a, b).

### S56 — Headline figures

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Give a visitor a few concrete figures about the product.
- **Responsibilities** — State each figure with what it measures, and state that the figures are samples.
- **Data requirements** — none fetched. `Figure`: `id`, `value`, `label`; `METRICS` and `METRICS_NOTE` ("Sample figures for a placeholder product") in `lib/data/ledgerline/brand.ts`. Figures are fixed strings, never computed and never read from a customer's data; a figure without the sample note fails the release check (BR10).
- **Interaction model** — read only. The figures are never presented as real; the sample note always accompanies them.
- **Device needs** — baseline.
- **Accessibility** — each value is associated with its label as one readable phrase; the sample note is part of the section text, not decoration.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Built values — transfers between own accounts "< 1s", "34" currencies, "0" entries left at close, "2-step" approvals on outgoing payments — conflict with BR10 and with v1 scope (payments approvals, 34 currencies) — OD9 a, c, d.

### S57 — Accounts capability

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Describe what accounts offer: every currency in one balance sheet.
- **Responsibilities** — Describe multi-currency accounts with sample balances; instant internal transfers; interest on idle cash (sample rate); sub-accounts for purposes (tax reserve, payroll, runway, capex, dividends).
- **Data requirements** — none fetched. `ACCOUNTS_COPY`, `CURRENCY_ACCOUNTS: CurrencyAccount[]` (`id`, `code`, `name`, `balanceMinor: number`) in `lib/data/ledgerline/features.ts`. `balanceMinor` is a `number` here, which BR1 forbids for real money; it stands only because these are fixed samples far inside the safe integer range. Each sample balance keeps its own currency and no cross-currency total is given.
- **Interaction model** — read only. Balances and rates are always labelled "Sample balances and rates".
- **Device needs** — baseline.
- **Accessibility** — amounts read with their currency; sample note readable.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Internal transfers, yield and sub-accounts are outside v1 (OD9 a, c). Amounts are integer minor units formatted by `lib/ledgerline/money.ts` with a fixed two-decimal exponent — acceptable only for sample copy; never reused for real money (BR1; Phase 9 H-24).

### S58 — Payments & approvals capability

Pages: P01 · Contracts: [C66](phase-6-interaction-contracts.md#c66--sample-interaction-control)

- **Purpose** — Describe drafting, approving and scheduling payments: nothing leaves without two sets of eyes.
- **Responsibilities** — Walk through a sample payment's three-step approval trail (drafted, approved, scheduled) that the visitor can approve and reset; describe limits by role, batch payouts and local rails.
- **Data requirements** — none; state is local. `PAYMENTS_COPY`, `APPROVAL_STEPS: ApprovalStep[]` (`id`, `label`, `actor`, `initials`), `PAYMENT_POINTS`.
- **Interaction model** — the sample control (C66) switches between waiting and approved states and back; the result is announced in text. It is always identified as "Interactive sample. No payment is made.". The sample makes no network request and stores nothing; it returns to its starting state on reload, and repeated activation is harmless.
- **Device needs** — the sample works by touch and keyboard.
- **Accessibility** — the trail is an ordered list with each step's state in text; the result sentence is in a live region. Focus stays on the sample control after each change; the result is announced once.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Money movement and approvals are Deferred/unspecified in v1 (OD3, OD9 a).

### S59 — Cards capability

Pages: P01 · Contracts: [C66](phase-6-interaction-contracts.md#c66--sample-interaction-control)

- **Purpose** — Describe issuing bank cards with spending controls built in.
- **Responsibilities** — Describe issuing cards with spending controls through a sample the visitor can operate; nothing the visitor does leaves the sample.
- **Data requirements** — none; local state only. `CARDS_COPY` (sample card: holder, masked number, monthly limit and spend), `CARD_CONTROLS: CardControl[]` (`id`, `label`, `detail`, `enabled`; four built: online payments, travel, cash withdrawals, receipt required). The sample number must not be a valid card number (it fails the standard check-digit test), so it can never be mistaken for or used as a real one.
- **Interaction model** — each spending control is a switch (C66) that changes only the sample. The card is always identified as "Illustrative card for a placeholder product.". The sample makes no network request and stores nothing.
- **Device needs** — switches operable by touch.
- **Accessibility** — `role="switch"` with `aria-checked` and a label reference per spending control.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Cards are a v1 non-goal (OD9 b).

### S60 — Treasury forecast capability

Pages: P01 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart)

- **Purpose** — Describe a 90-day cash forecast and how much cash can be set aside: see the next ninety days before they happen.
- **Responsibilities** — Describe sample actual and forecast cash with an expected range (C30, read-only), and three sample figures: runway, cash to set aside, projected interest.
- **Data requirements** — none fetched. `TREASURY_COPY`, `ACTUAL_SERIES`, `FORECAST_SERIES`, `FORECAST_SPREAD`, `TREASURY_FIGURES`. The series is fixed and never derived from a visitor's or customer's data.
- **Interaction model** — read only. Always identified as "Illustrative forecast built from sample data."
- **Device needs** — the figures convey the message without the chart.
- **Accessibility** — the chart has a text alternative (Q-012); the three figures are text.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built**; chart geometry in `lib/ledgerline/chart.ts`. Series are unitless numbers, not money. v1 has only the labelled runway estimate (P16) (OD9 c).

### S61 — Reconciliation capability

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Describe matching payments to ledger entries and syncing to accounting software: the month closes itself.
- **Responsibilities** — Describe sample matched entries and how many matched.
- **Data requirements** — none fetched. `RECONCILE_COPY`, `MATCHED_ENTRIES: MatchedEntry[]` (`id`, `description`, `account`, `amountMinor`). `amountMinor` is integer minor units in one sample currency; no figure here is a real ledger entry.
- **Interaction model** — read only. Entries are always identified as "Sample entries."
- **Device needs** — baseline.
- **Accessibility** — each entry's matched state is given in text.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** v1 reconciliation is export + annotation (F4, S26); automatic matching and accounting sync are unspecified (OD9 c; Phase 3 §17 lists integrations as expansion).

### S62 — Pricing plans

Pages: P01 · Contracts: [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Tell a visitor what Ledgerline costs.
- **Responsibilities** — Let the visitor compare plans by price, cadence, summary and features and choose one; identify the most-chosen plan; state that pricing is a sample.
- **Data requirements** — none fetched. `Plan`: `id`, `name`, `price`, `cadence`, `summary`, `features[]`, `featured`; `PRICING_COPY.note`. A price is a fixed string with its currency and cadence; whether it includes tax is stated with the price once OD9 facet f is answered (Q5).
- **Interaction model** — choosing a plan goes to S64 enquiry. Only the plan `id` travels to S64 — never anything the visitor typed.
- **Device needs** — every plan comparable on a phone.
- **Accessibility** — each plan is a labelled group; "most chosen" is stated in text; each "Choose" link names its plan.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Pricing is not in 1.0.0; plan features include cards, 34 currencies, approvals, accounting sync, multi-entity and API access (OD9 f).

### S63 — Frequently asked questions

Pages: P01 · Contracts: [C64](phase-6-interaction-contracts.md#c64--disclosure)

- **Purpose** — Answer the questions a prospect asks before starting, including whether Ledgerline is a real bank.
- **Responsibilities** — Give each answer on request; the answer to whether Ledgerline is a real bank states the design-study status and comes first in the data.
- **Data requirements** — none fetched. `FaqItem`: `id`, `question`, `answer`.
- **Interaction model** — each question toggles its answer; others are unaffected. A link to one question (`#id`) arrives with that answer open. Without JavaScript every answer is readable.
- **Device needs** — baseline.
- **Accessibility** — each question is a button with `aria-expanded` and `aria-controls`; answers are in the document for find-in-page when expanded. Focus stays on the question after toggling; Enter and Space both toggle.
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate pattern for P28.
- **Technical notes** — **Built.** Several answers describe approvals, multi-currency and accounting sync "in the concept" (OD9).

### S64 — Get-started enquiry

Pages: P01 · Contracts: [C67](phase-6-interaction-contracts.md#c67--enquiry-form)

- **Purpose** — Capture a prospect's work email as the start of X11.
- **Responsibilities** — Collect one work email, validate it, confirm receipt, and state that nothing is stored or sent.
- **Data requirements** — none today (design-study state). Once OD10 chooses an intake: a mutation hook wrapping a Server Action. `Contact = z.infer<typeof contactSchema>` (`email`), schema in `lib/validations/contact.ts`; copy `CTA_COPY` (`title`, `lead`, `emailLabel`, `submit`, `success`, `invalid`, `note`). The email is trimmed, at most 254 characters, and is never written to a URL, an analytics event, a client log or device storage.
- **Interaction model** — submit validates with Zod; invalid → field error; valid → confirmation. The email is never placed in the URL. With an intake: a second submission while one is pending has no effect; submitting an email already received gives the identical confirmation (no disclosure of who has enquired); more than `ENQUIRY_RATE_LIMIT` (5 in 10 minutes, A21) submissions from one client are told how long to wait; automated submissions are filtered without a puzzle (WCAG 3.3.8). Consent wording and retention are Q6.
- **Device needs** — email keyboard and autofill on phones.
- **Accessibility** — visible label bound to the input; `aria-invalid` and `aria-describedby` on error; result in a live region. On an invalid email focus moves to the field and the message is announced; on success focus moves to the confirmation text.
- **Loading** — none today; with an intake, submit reports progress and is disabled.
- **Error** — invalid email → `CTA_COPY.invalid`, tied to the field. With an intake: transport failure keeps the value with Retry. With an intake the error kinds of the section contract apply (retryable, rate-limited with the wait stated, offline), each with a reference and the typed value kept.
- **Empty** — not applicable.
- **Reuse** — P01; possibly P28.
- **Technical notes** — **Built.** It is the only target of "Open an account", "Book a demo", "Sign in" and "Choose" on the built page (OD10).

## Authentication

### S08 — Authentication step

Pages: P02–P06 · Contracts: [C34](phase-6-interaction-contracts.md#c34--loginform--generalized-authform-variants) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Take one authentication step per screen and get the member into the product, or back to a known state.
- **Responsibilities** — Five variants: `sign-in` (X1), `register` (X2), `forgot` (X5), `reset` (X5), `verify` (X1, X4). Each leads to its neighbours (sign-in ↔ register, sign-in → forgot) — fixing host finding H-04.
- **Data requirements** — mutations `use-login`, `use-register`, `use-request-password-reset`, `use-reset-password`, `use-verify-challenge`. Small forms use `useState` + Zod `safeParse`. Values from `lib/validations/auth.ts` composing `LoginDto`/`RegisterDto`: `SignInValues {email, password}`, `RegisterValues {name, email, password}`, `ForgotValues {email}`, `ResetValues {password, confirm, token}`, `VerifyValues {code}`; `PASSWORD_MIN_LENGTH`. Limits (A20, A21): email at most 254 characters; password `PASSWORD_MIN_LENGTH` to `PASSWORD_MAX_LENGTH` (128), any characters including spaces, never silently truncated; name at most 100; code six digits. A reset link works once and for `RESET_LINK_TTL` (30 minutes); a two-step challenge lasts `CHALLENGE_TTL` (5 minutes); a code can be re-sent after 30 seconds, at most 5 times an hour. `next` is honoured only when it is a same-origin path of at most 2,048 characters; anything else goes to `/dashboard`.
- **Interaction model** — validate on blur, then on submit. Success: sign-in → `next`, `/dashboard` or `/auth/verify`; register → `/onboarding`; forgot → same confirmation for every email; reset → sign-in with a message. Wrong credentials → `INVALID_CREDENTIALS` at form level, never naming a field. Codes accept numeric entry; the password can be shown and hidden (C02). One request per submit; repeats while pending have no effect. After `AUTH_MAX_ATTEMPTS` (5) failures in 15 minutes further attempts are refused for 15 minutes with the wait stated — the message never says whether the account exists, and unknown and known emails get the same answer in the same time on sign-in and forgot; whether `register` may say an email is already registered is Phase 1 OD13. On failure the email is kept and the password cleared. A `SUSPENDED` account is told so with a reference and a route to support; a `PENDING` one continues to `verify`. A successful reset ends every other session. A member already signed in who opens a sign-in page goes on to `next` or `/dashboard`; signing in on one tab lets other tabs' auth pages proceed on focus.
- **Device needs** — password managers, autofill, passkeys and one-time-code autofill work on phones; usable in landscape with the keyboard open.
- **Accessibility** — `<form aria-labelledby>`; input `id`/`name` from constants (H-03); every input has the right `type` and `autocomplete`; errors via `aria-describedby`; form error `role="alert"`; code field `autocomplete="one-time-code"`; focus to the first invalid field on submit; paste allowed everywhere (WCAG 3.3.8). A form-level error receives focus so it is read at once; after success focus is on the destination's `<h1>`. A code's expiry is stated in text and a new code can always be requested (WCAG 2.2.1).
- **Loading** — submit reports progress, `aria-busy`, fields read-only. After `MUTATION_TIMEOUT_MS` it becomes an error the person can retry, with the email kept; it is never sent again automatically.
- **Error** — Zod messages from constants; `REQUEST_FAILED`; `SESSION_UNAVAILABLE` with sign-in link; expired reset token → `AUTH_COPY.resetExpired` with "Request a new link". Kinds: wrong credentials and suspended are non-retryable; `REQUEST_FAILED` is retryable; too many attempts states the wait; offline says so and submits nothing. Every one of them carries a reference, wrong credentials and the offline refusal included.
- **Empty** — not applicable; forgot/reset confirmations are success states (`AUTH_COPY`).
- **Reuse** — five pages; `verify` inside C55 for step-up.
- **Technical notes** — Sign-in is **built** (C34, existing sign-in form); the other four variants are specified. Credentials and codes never reach a URL, a log or analytics; the reset token is removed from the address once read. The backend records every sign-in, failure, reset and challenge with time, device and approximate location; the member reads their own in S43.

## Onboarding & verification

Every section reads one `VerificationCase` (`lib/types/verification.ts`): `id`, `workspaceId`, `state` (`not_started | in_progress | submitted | needs_info | approved | rejected`), `business`, `owners`, `documents`, `requests: InfoRequest[]`, `updatedAt`; via `use-verification-case` (`["verification", workspaceId]`, live — a decision should reach the owner without reload). Field lists are the jurisdiction-neutral minimum in `lib/data/verification-fields.ts` so answering OD1 changes data, not code.

### S09 — Verification progress

Pages: P07 · Contracts: [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Tell the owner where they are in verification ("Step 2 of 4 · Beneficial owners") and let them move between steps.
- **Responsibilities** — Derive each step's state (todo, current, done, attention) from the case; route via `?step=`; lock steps once `submitted` unless sent back as `needs_info`; submit the case for review.
- **Data requirements** — `use-verification-case`; state by pure function `lib/utils/onboarding-progress.ts`. `OnboardingStep`: `id: business | owners | documents | review`, `label`, `state`. Definitions in `lib/data/onboarding-steps.ts`. While the case is `submitted` it also refetches every 60 s in a visible tab, so a decision arrives without reload. A case that fails its schema is an error for all of S09–S13, never a partly drawn set of steps.
- **Interaction model** — choosing a completed or current step changes `?step=`; future steps unavailable until prior steps are valid; Submit (C01) asks for confirmation via C52 ("You can't edit details while we review them") then sets `submitted`. Only R1 works here: R2 gets the informational S13, R3 and R4 the not-permitted state. The server re-checks every step on submit; if one is incomplete the owner is taken to it with the reason. Submitting twice, or from two tabs, yields one `submitted` case; a tab left on an editable step locks at its next refetch and says why. Edits follow the no-silent-overwrite rule on the case `updatedAt`. An unknown `?step=` resolves to the current step. `rejected` is final here: the owner is told the outcome and is routed to support with the case reference (Q14).
- **Device needs** — current step and total always discoverable on a phone.
- **Accessibility** — `<nav aria-label="Verification steps">` with `<ol>`; `aria-current="step"`; each step's state in its name ("Business details, complete"). A step that is not yet available stays focusable and says why; after a step change focus moves to that step's heading; after submit focus moves to the status message, which is announced.
- **Loading** — a loading placeholder that reserves its space. A refresh keeps the steps usable and marks them busy.
- **Error** — C33 with Retry; S10–S12 do not render until the case loads. A failed submit is retryable and keeps everything entered; a conflict loads the latest case.
- **Empty** — `not_started` is a real state: step 1 current with `EMPTY_STATES.verificationStart` ("Tell us about your business to open your accounts. It takes about 10 minutes.").
- **Reuse** — P07; C50 read-only in S52.
- **Technical notes** — The progress function is pure and property-tested. Submission is recorded with actor and time and appears in the case history (S52).

### S10 — Business details form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Capture the legal identity of the business, led by its legal name.
- **Responsibilities** — Edit `BusinessDetails`, save drafts, validate, surface any `InfoRequest` about these fields.
- **Data requirements** — initial values from the case; save via `use-update-verification-case` (PATCH `business`), invalidates the case. Schema `lib/validations/business-details.ts`. `BusinessDetails`: `legalName`, `tradingName | null`, `entityType`, `registrationNumber`, `incorporatedOn` (ISO date), `country` (ISO 3166-1 alpha-2), `address: PostalAddress`, `website | null`. Limits (A20): `legalName` 1–200 characters, `tradingName` up to 200, `registrationNumber` up to 50 (format rules per OD1, Q4), each address line up to 100, `website` an `https` URL up to 2,048; `incorporatedOn` is not in the future. Text is trimmed and kept in Unicode as typed.
- **Interaction model** — explicit save, no autosave. Why: registration data is legal record, so the owner decides when it is written. Leaving with unsaved changes asks via C52. Form library LD3 pending. R1 only. Editable in `not_started`, `in_progress` and `needs_info`; read-only with the reason once `submitted`, `approved` or `rejected`. Each open `InfoRequest` is tied to its field (`fieldRef`); saving does not close a request — resubmitting the case does. Save follows the write rules of the section contract (double submit, stale write, session expiry, offline). Unsaved identity data is held in memory only, never on the device.
- **Device needs** — address and organisation autofill on phones.
- **Accessibility** — address in a `<fieldset>`/`<legend>`; `autocomplete` (`organization`, `address-line1`, …); error summary linking to fields. On a failed save focus moves to the error summary, whose entries lead to their fields; on success "Business details saved" is announced and focus stays put.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — field errors from Zod; save failure → message with Retry, values kept. A server validation error is mapped to its field; one that names no known field goes to the summary. Offline: saving is unavailable, input stays.
- **Empty** — nothing entered yet; each field says what it needs.
- **Reuse** — P07; read-only summary shared with S52.
- **Technical notes** — none beyond the data requirements. Registration numbers are regulated data: never in a URL, log, analytics event or device storage. Every saved change is added to the case history with actor and time.

### S11 — Beneficial owners form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C02](phase-6-interaction-contracts.md#c02--iconbutton) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Record everyone who owns or controls a large enough share, always telling the owner how much ownership is declared ("75% of ownership declared").
- **Responsibilities** — List, add, edit, remove owners; keep the total ≤ 100%; mark the applicant.
- **Data requirements** — from the case; save PATCH `owners`; schema `lib/validations/beneficial-owner.ts` with sum ≤ 10000. `BeneficialOwner`: `id` (nanoid while draft), `fullName`, `dateOfBirth`, `nationality`, `ownershipBasisPoints` (integer 0–10000), `isController`, `address`. Limits (A20): at most `OWNER_LIMIT` (20) owners; `fullName` up to 200 characters; `dateOfBirth` in the past (any minimum age is OD1, Q4). A percentage is typed with up to two decimals and converted to basis points from the string, never through a float.
- **Interaction model** — each owner editable; remove via C52; the mandatory-owner threshold is a constant set by OD1. R1 only; locked like S10 once submitted. Adding, editing and removing change a draft; one save writes the whole list with the case `updatedAt`, so a half-edited list is never stored and a removal can be taken back until then. Exactly one owner is the applicant and cannot be removed. A second owner with the same name and date of birth is questioned before saving. At `OWNER_LIMIT` adding is unavailable with the reason. The server re-checks the total.
- **Device needs** — baseline.
- **Accessibility** — each owner a `<fieldset>` (legend = name or "Owner 2"); total as `role="meter"` with value; removal announced and focus moved to the next owner or to the add action. After adding, focus moves to the new owner's first field; the declared total is announced once edits settle, not on each keystroke.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — sum above 100% is a form-level error tied to the declared total; save failure → message. Save failures follow the error kinds of the section contract; the draft list is kept in every case.
- **Empty** — `EMPTY_STATES.owners` ("Add each person who owns 25% or more, or who controls the business." — threshold interpolated).
- **Reuse** — P07; read-only in S52.
- **Technical notes** — Ownership is integer basis points so the sum check is exact. Dates of birth, nationalities and home addresses are personal data: readable by R1 and by R6/R7 in S52 only, and never in a URL, log, analytics event or device storage.

### S12 — Document upload

Pages: P07 · Contracts: [C49](phase-6-interaction-contracts.md#c49--file-upload) [C26](phase-6-interaction-contracts.md#c26--meter) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Collect the documents the review requires, make clear which one is still missing next, and give each one's status.
- **Responsibilities** — List required kinds; accept uploads; report progress and review status; allow replacement when asked.
- **Data requirements** — list from the case; `use-upload-document` (Server Action returns a signed target); success invalidates the case; MIME types and max size are constants. `VerificationDocument`: `id`, `kind`, `fileName`, `sizeBytes`, `status: uploading | uploaded | accepted | rejected`, `rejectionReason | null`, `uploadedAt`; required kinds in `lib/data/verification-fields.ts`. Limits (A18): each file at most `UPLOAD_MAX_BYTES` (10 MB) and not empty; PDF, JPEG or PNG (`UPLOAD_MIME_TYPES`); at most 10 files per required kind and 20 per case (`UPLOAD_MAX_FILES`); a replacement supersedes the file it replaces, and the earlier file stays in the case history; at most three uploads run at once and the rest wait. A signed target is single-use and lasts `UPLOAD_TARGET_TTL` (10 minutes). An uploaded file is opened again only through a signed link lasting `DOWNLOAD_LINK_TTL` (5 minutes), fetched on request and never cached.
- **Interaction model** — client checks type and size first, then uploads with progress; an upload in progress can be cancelled; rejected documents give the reason and can be replaced. R1 only; locked once `submitted` except for a kind named by an open request. The server re-checks type by content, not by file name. A file the backend refuses after upload — unreadable, or failing a malware scan — becomes `rejected` with a reason (Q8). Cancelling leaves no partial file. A dropped connection leaves that file with Retry, which asks for a fresh target. Choosing the same file twice uploads it once. Leaving with uploads in progress asks (C52). If the session expires mid-upload, completed uploads are kept; an interrupted one is never replayed, and the owner sends that file again after re-authenticating.
- **Device needs** — camera capture or file picker on phones; no drag required.
- **Accessibility** — the upload control is a labelled file input; progress `role="progressbar"`; status changes announced ("Passport uploaded", "Rejected: image unreadable"). Progress is announced at start, completion and failure only; after a rejection focus moves to the reason.
- **Loading** — a loading placeholder that reserves its space; each upload reports its own progress.
- **Error** — too large/wrong type → rejected before upload with the reason; failed upload → that document keeps a Retry; case failure → C33. Kinds per file: too large, wrong type or empty (non-retryable, the limit named); transfer failed or timed out (retryable); refused after upload (non-retryable, replace); offline (waits). Other files are unaffected, and each failure carries a reference.
- **Empty** — `EMPTY_STATES.documents` ("Upload a clear photo or PDF of each required document.").
- **Reuse** — P07; C49 behaviour shared with S26, S37.
- **Technical notes** — Upload goes straight to the signed target; the case is the only source of document status. These are identity documents: served `no-store`, never kept on the device, each upload, replacement and viewing recorded with actor and time. How long they are retained is Q15.

### S13 — Verification status notice

Pages: P07, P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Tell the owner in one sentence what verification is waiting on and what to do next.
- **Responsibilities** — Map case state to severity, message and next action ("Continue verification", "Respond to request"); list open `InfoRequest`s when `needs_info`; render nothing once `approved` on P08.
- **Data requirements** — `use-verification-case`. `InfoRequest`: `id`, `message`, `fieldRef | null`, `createdAt`. Copy `VERIFICATION_COPY`. Open requests are given oldest first. A request's `message` is staff-written plain text of at most 1,000 characters, rendered as text and never as markup.
- **Interaction model** — the next action → `/onboarding?step=<step of first open request>`. Cannot be dismissed while `needs_info` or `rejected`. Why: those states block the accounts. R1 gets the next action; R2 is informed without one; R3 and R4 get nothing. `rejected` states the outcome with the case reference and a route to support; whether the reason is given is Q14.
- **Device needs** — baseline.
- **Accessibility** — state in text; not a live region on page load (it is content, not a status change). If the state changes while the page is open the new state is announced politely once.
- **Loading** — renders nothing until the case loads (no placeholder on P08).
- **Error** — silent on P08 (S17 carries the retry); on P07, S09 owns it. If a later refresh fails, the last known state stays and is stated as possibly out of date.
- **Empty** — `approved` on P08 renders nothing.
- **Reuse** — P07, P08 (informational variant for R2).
- **Technical notes** — Reads the same `use-verification-case` query as S09–S12; no query of its own.

## Dashboard

### S14 — Cash position

Pages: P08 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C31](phase-6-interaction-contracts.md#c31--trend-summary)

- **Purpose** — Answer F1 in one glance: how much cash the business has now — total available balance per currency.
- **Responsibilities** — Total available balance across permitted accounts, per currency; today's net movement and a 30-day trend per total. Never add different currencies.
- **Data requirements** — `use-accounts` (aggregate, live, refetch on focus). `CashPosition`: `currency`, `available`, `current`, `netToday`, `trend: {date, closing}[]`, `asOf`. One `CashPosition` per currency, in a stable order from the server; the server aggregates, the client never adds accounts together. `asOf` accompanies every total; a total older than `BALANCE_STALE_AFTER` (15 minutes) is stated as delayed with its time. `closed` accounts are excluded; `frozen` ones are included and that is stated. `trend` is up to 30 daily closing balances by workspace-zone day; a day with no data is a gap, never a zero. For R4 the totals cover permitted accounts only and say so.
- **Interaction model** — choosing the total goes to P09; the trend exposes date and closing balance per point on focus or pointer. Read only. A negative total is stated with its sign as a fact, not as an error (BR3).
- **Device needs** — the total is readable on a phone without interacting; the trend has a text equivalent.
- **Accessibility** — each total read as "Available balance, GBP, …, as of …"; trend has a text summary. A refreshed total is not announced by itself; its `asOf` time is always readable.
- **Loading** — a loading placeholder per currency that reserves its space. A refresh keeps the figure and marks it busy. During a workspace switch the previous workspace's figure is withheld at once.
- **Error** — C33 with Retry. Never reports "0.00" in error. Why: a zero shown in error is the most damaging wrong figure possible. If any currency's data fails its schema the whole section is in error — a partial set is never presented as the cash position. Offline: the last figures stay with their time and the word "offline".
- **Empty** — no permitted accounts: `EMPTY_STATES.cashPosition` ("No accounts to show yet. Accounts appear here once verification is approved."), linking R1 to P07. R4 with no permitted accounts gets the not-permitted wording (`EMPTY_STATES.cashPositionNotShared`: "No accounts have been shared with you. Ask an owner."). A zero balance is a populated state.
- **Reuse** — P08 (not D4).
- **Technical notes** — LCP-critical, server-prefetched. Must hold: no client arithmetic across accounts or currencies; K2 is measured on this section.

### S15 — Account summary

Pages: P08 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — List every account with its available balance so the member can jump into a ledger.
- **Responsibilities** — Up to `DASHBOARD_ACCOUNT_LIMIT` accounts sorted by balance, each identified by name and masked number with its state and available balance; lead to the full list.
- **Data requirements** — `use-accounts`. `Account`: `id`, `name`, `kind`, `last4`, `currency`, `available`, `current`, `state`, `openedAt`. The backend publishes `state` as `OPEN / FROZEN / CLOSED`; the mapping to the states named here is Phase 1 OD11. `DASHBOARD_ACCOUNT_LIMIT` is 6 (A17). The server sorts by available balance within each currency — balances in different currencies are not compared — and returns the total number of accounts so the member knows how many more exist. `closed` accounts are left out; `frozen` and `pending_verification` ones are included with their state. R4 receives permitted accounts only.
- **Interaction model** — each account → `/accounts/[accountId]`; the full list (P09) is one step away.
- **Device needs** — every account's balance readable on a phone.
- **Accessibility** — a list; each item a link whose name includes account name and balance. A link's name also carries the masked number ("ending 4821") and the account state.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 with Retry. Shares S14's query, so both fail and recover together.
- **Empty** — `EMPTY_STATES.accounts` ("No accounts yet."). R4 with nothing shared gets the not-permitted wording, as S14.
- **Reuse** — P08.
- **Technical notes** — Shares the `use-accounts` query with S14.

### S16 — Recent activity

Pages: P08 · Contracts: [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Give the last few transactions across accounts, each with its signed amount and counterparty, so nothing new goes unseen.
- **Responsibilities** — Latest `DASHBOARD_ACTIVITY_LIMIT` (8) including pending; lead to full search.
- **Data requirements** — `use-transactions` (limit variant). `Transaction`: `id`, `accountId`, `postedAt | null`, `createdAt`, `amount: Money`, `status`, `description`, `counterparty {id, name} | null`, `category | null`, `flagged`, `hasAttachments`, `reference`. Ordered by `postedAt`, or `createdAt` while pending, newest first, ties broken by `id`. Live tier (15 s). Pending entries are included and labelled provisional. Each amount keeps its own currency; no total is given. Bank-supplied `description` is rendered as text; when shortened, the full text stays available. R4 receives permitted accounts only.
- **Interaction model** — choosing a transaction opens P12 without leaving the dashboard (intercepted route, C22); full search (P11) is one step away. A transaction that has since become unreadable to the member opens as not found.
- **Device needs** — each transaction opens by touch.
- **Accessibility** — pending status in text; amounts read with sign. Focus returns to the originating transaction when its detail closes; activity arriving on refresh is not announced.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33. Error kinds per the section contract, with a reference.
- **Empty** — `EMPTY_STATES.recentActivity` ("No transactions yet. New activity shows up here as soon as it posts."). R4 with nothing shared gets the not-permitted wording.
- **Reuse** — P08.
- **Technical notes** — none beyond the data requirements.

### S17 — Pending items

Pages: P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Collect everything waiting on the member or the bank into one short list, led by the most urgent item.
- **Responsibilities** — Merge, ordered by urgency: pending transactions (count and total per account); exports `ready` or `failed`; verification requests (`needs_info`).
- **Data requirements** — `use-transactions {status: pending}`, `use-exports`, `use-verification-case`, all live. Loading until all settle; error only if all fail. `PendingItem`: `id`, `kind: pending_transactions | export_ready | export_failed | verification_request`, `title`, `detail`, `href`, `severity`, `at`; derived in `lib/utils/pending-items.ts`. Pending counts and totals are server-computed per account and per currency. At most `DASHBOARD_PENDING_LIMIT` (10) items; beyond that the member is told how many more and led to where they are resolved. Urgency is a fixed rule in the pure function: a failed export or an information request before a ready export before pending transactions, then oldest. By role: verification requests for R1 (informational for R2); export items for the R1–R3 member who requested the job; pending transactions for all roles, limited to permitted accounts for R4.
- **Interaction model** — each item links to where it is resolved (P11 pending, P18, P07). An item leaves when its source changes (export downloaded or expired, request answered, transactions posted); items cannot be dismissed. Why: dismissal would hide something still waiting.
- **Device needs** — baseline.
- **Accessibility** — severity in text; list semantics. The number of items is announced on first load only.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — complete failure → C33; partial failure keeps the loaded items and tells the member "Some items couldn't load · Retry". The source that failed is named ("Exports couldn't load").
- **Empty** — `EMPTY_STATES.pendingItems` ("Nothing waiting on you."). Given only when every source loaded and is empty — never after a partial failure.
- **Reuse** — P08 (D1–D3).
- **Technical notes** — Merge is a pure function. (1.0.0 `tone` field renamed `severity`.)

### S18 — Cash flow over time

Pages: P08 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart) [C23](phase-6-interaction-contracts.md#c23--tabs) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Give money in against money out over time, led by the net for the range, so the owner sees direction as well as level.
- **Responsibilities** — Inflow, outflow and net for the chosen range (30 days, 90 days, 12 months) with range totals.
- **Data requirements** — `use-cash-flow` (standard); server-aggregated series only. `CashFlowSeries`: `currency`, `granularity`, `points: {periodStart, inflow, outflow, net}[]`, `totals`. Buckets: daily for 30 days, weekly for 90 days, monthly for 12 months, cut by workspace-zone calendar date; at most 366 points. One series per currency, never combined; the currency is a URL parameter. Posted entries only, stated in the summary; the period still in progress is labelled partial. Whether a transfer between the workspace's own accounts counts as inflow and outflow is Q10 and is stated in the summary once decided.
- **Interaction model** — the range is chosen with C23 and kept in the URL; each point exposes exact amounts via C40 on focus or pointer. Minor units convert to numbers for plotting only after checking `Number.MAX_SAFE_INTEGER`; labels always come from the original strings. An invalid range or currency in the URL falls back to 30 days and the default currency, and the member is told.
- **Device needs** — totals and a text or table equivalent are usable on a phone.
- **Accessibility** — summary sentence plus an accessible data table (Q-012); chart points keyboard-navigable. Arrow keys move between points; each is read as its period with in, out and net; a range change announces the new totals once.
- **Loading** — a loading placeholder that reserves the populated space. A range change withholds the previous range's totals until the new ones arrive. Why: a total must never stand beside a range it was not computed for.
- **Error** — C33 with Retry. A value beyond `Number.MAX_SAFE_INTEGER` is not an error: the plot is withheld and the text and table equivalents carry the exact figures.
- **Empty** — `EMPTY_STATES.cashFlow` ("Not enough activity to chart yet."). Nothing in the chosen range: `cashFlowRange` ("No activity in this range. Try a longer one."). Roles outside D1–D2 get the not-permitted state.
- **Reuse** — P08 (D1, D2).
- **Technical notes** — LD1 pending; lazy-loaded.

## Accounts & ledger

### S19 — Account list

Pages: P09 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C15](phase-6-interaction-contracts.md#c15--table-family) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C40](phase-6-interaction-contracts.md#c40--amount) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Every account the member can see, with its available balance and state, as the way into each ledger.
- **Responsibilities** — Let the member sort accounts, grouped by currency when more than one; give each account's available and current balance, state and masked number; lead into each ledger.
- **Data requirements** — `use-accounts`. `Account` (S15). Live tier. All accounts arrive in one response up to `ACCOUNT_LIST_MAX` (200), cursor-paged beyond. Sorting applies within a currency group; names sort with `Intl.Collator`. `closed` accounts are included and labelled. R4 receives permitted accounts only.
- **Interaction model** — choose → `/accounts/[accountId]`; sort order kept in the URL; revealing a number (C42) starts step-up (X4) and discloses the full number for `REVEAL_TIMEOUT` seconds. Reveal is for R1–R3 after step-up and is withheld from R4 and from every internal role (P10). One number is revealed at a time; it re-masks after `REVEAL_TIMEOUT` (30 s, with a warning 10 s before and a way to extend), on navigation, when the tab is hidden and on sign-out; it is never cached, never in a URL or title, and each reveal is audit-logged with actor, account and time. A cancelled step-up leaves the number masked with no error; a failed one follows X4. Within `STEP_UP_GRANT_SECONDS` (5 minutes) a further reveal needs no new step-up; the grant covers reveals only. An invalid sort parameter falls back to the default.
- **Device needs** — name, masked number and available balance for every account on a phone.
- **Accessibility** — table semantics with `aria-sort`; state in text. A reveal announces the number and how long it stays; the re-mask is announced; focus stays on the reveal control throughout, and the member can reveal again (WCAG 2.2.1).
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33. Error kinds per the section contract, with a reference; a failed reveal says the number could not be shown and reveals nothing.
- **Empty** — `EMPTY_STATES.accounts`; R1 gets a link to P07 while not `approved`. R4 with nothing shared gets the not-permitted wording.
- **Reuse** — P09.
- **Technical notes** — Server-prefetched.

### S20 — Account overview

Pages: P10 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Identify the account whose ledger the member is reading and state its available balance.
- **Responsibilities** — Give name, available and current balance "as of" a time, hold amount and state; let the member reveal and copy the masked account and routing numbers.
- **Data requirements** — `use-account`. `AccountDetail` = `Account` + `routingNumberMasked`, `balanceAsOf`, `holdAmount`. Live tier. `balanceAsOf` accompanies both balances, and a balance older than `BALANCE_STALE_AFTER` is stated as delayed. `holdAmount` and both balances are server figures — the client never subtracts one from another. A `closed` account gives its final balance and closing date; a `pending_verification` account gives no balance.
- **Interaction model** — reveal needs step-up; the backend audit-logs it; copy copies what is disclosed (masked unless revealed); `frozen`/`closed` are stated with an explanation from `ACCOUNT_STATE_COPY`. Reveal rules as S19 (R1–R3, never R4). A full number can be copied only while revealed; the member is told it stays on their clipboard. A copy that the browser refuses is stated. An account R4 may not see answers as not found, so its existence is not disclosed.
- **Device needs** — baseline.
- **Accessibility** — balances labelled "Available balance" and "Current balance"; reveal announces the change and the re-mask. After copying, "Copied" is announced and focus stays on the copy control.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — 404 → segment `not-found`; other → C33. Error kinds per the section contract, with a reference.
- **Empty** — not applicable.
- **Reuse** — P10.
- **Technical notes** — Server-prefetched.

### S21 — Ledger filters

Pages: P10, P11, P14, P19 · Contracts: [C46](phase-6-interaction-contracts.md#c46--filter-set) [C47](phase-6-interaction-contracts.md#c47--active-filter) [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Narrow the ledger to what the member is looking for, and keep that in the URL.
- **Responsibilities** — Narrow by search text, date range, type, direction, status, category, amount range, account, flagged and whether an attachment is present; make active filters known, each removable on its own; save the set as a view; clear all.
- **Data requirements** — `use-saved-views` for saved views. `LedgerFilters` (Zod over `URLSearchParams`), with the parameter set of [Phase 3 §11.1](phase-3-information-architecture.md#111-url-parameters-p10-p11-p14-p19), which governs: `from?`, `to?`, `type?`, `direction?`, `status?`, `category?`, `min?`, `max?`, `q?`, `account?`, `flagged?`, `attachment?`, `view?`. `SavedView`: `id`, `name`, `filters`, `createdAt`. Limits (A17, A20): `q` is `LEDGER_QUERY_MIN_LENGTH`–`LEDGER_QUERY_MAX_LENGTH` (2–100) characters after trimming; `from` ≤ `to`, both workspace-zone calendar dates, `to` inclusive. With no `from` or `to` the ledger reads newest first and pages back by cursor without limit; `LEDGER_MAX_RANGE_DAYS` (731) applies only when both bounds are given, and when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared. Amounts are typed in major units and parsed from the string to minor units, `min` ≤ `max`; `type` and `status` are comma lists of their enum values; `direction` is `in` or `out`; `category` is a comma list of at most 20 category values, unknown values dropped; `account` is a comma list of at most `LEDGER_ACCOUNT_FILTER_MAX` (50) opaque IDs; `flagged` is the literal `true` and `attachment` the literal `yes`. Saved views belong to the member who made them (P13), at most `SAVED_VIEW_LIMIT` (50) per member, names 1–`SAVED_VIEW_NAME_MAX` (60) characters and unique per member regardless of case.
- **Interaction model** — every change updates the URL; S23 reacts to the URL only. Why: decoupled sections, shareable links. Removing an active filter clears only it. Saving a view asks for a name (C21). `/` focuses search. Search text applies after `SEARCH_DEBOUNCE_MS` (300 ms); other filters apply at once. An impossible combination (`from` after `to`) is not applied and is explained. Saving follows the write rules; at the limit saving is unavailable with the reason. For R4 only permitted accounts can be chosen, and a link naming another account has that parameter dropped like any invalid one. Search never matches a full account number.
- **Device needs** — every filter available on a phone.
- **Accessibility** — every filter labelled; result count announced once per change; invalid link params reported in text ("1 filter in this link was ignored"). After an active filter is removed focus moves to the next active filter, else to search; after clearing all, to search.
- **Loading** — filters are usable immediately; saved views load when requested.
- **Error** — invalid params dropped with a notice; saved views that fail to load are reported with Retry when requested; save failure → message. A name already in use is a field error. Search text stays out of analytics and of the referrer sent to other sites.
- **Empty** — no saved views → `EMPTY_STATES.savedViewsMenu` ("Save filters you use often.").
- **Reuse** — P10, P11 (search variant), P14 (flagged fixed), P19.
- **Technical notes** — URL parsing through the `LedgerFilters` schema only; unknown params dropped.

### S22 — Ledger summary

Pages: P10 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Summarise the filtered ledger — in, out, net and count.
- **Responsibilities** — Totals for exactly S21's filters; opening and closing balance when the date range is bounded.
- **Data requirements** — `use-ledger-summary` (live); server-computed, never summed from loaded rows. `LedgerSummary`: `currency`, `inflow`, `outflow`, `net`, `count`, `opening | null`, `closing | null`. An account has one currency, so the summary has one. In, out and net count posted entries; when the status filter admits pending they are included and the summary says "including pending". `count` is exact up to `COUNT_EXACT_LIMIT` (10,000) and is given as "10,000+" beyond it. Opening and closing balance are the balances at the start of `from` and the end of `to` in the workspace zone, and are withheld when any filter other than the date range is active (Q-214). `returned` and `reversed` entries are counted as the entries they are.
- **Interaction model** — read only; the count equals S23's range total.
- **Device needs** — baseline.
- **Accessibility** — each figure labelled.
- **Loading** — a loading placeholder that reserves its space. A filter change withholds the previous figures until the new ones arrive. Why: a total must never stand beside filters it was not computed for.
- **Error** — C33. A summary failure does not block S23, and is never rendered as zeros.
- **Empty** — zero matches give real zeros; S23 reports "none match".
- **Reuse** — P10.
- **Technical notes** — Keyed on the same `LedgerFilters` as S23. Summary and entries can be read a moment apart; if `count` and S23's range total disagree after a refetch, the summary is refetched once.

### S23 — Ledger entries

Pages: P10, P11, P14, P19 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C25](phase-6-interaction-contracts.md#c25--pagination) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — List the transactions matching the filters, each with its signed amount, fast at 5 million rows.
- **Responsibilities** — Let the member recognise each matching transaction and its signed amount, and follow the running balance on P10 (withheld or labelled unfiltered when filters exclude transactions, Q-214). Open detail. Keep position when returning.
- **Data requirements** — `use-transactions` infinite with `maxPages`; `keepPreviousData` on filter change. `Transaction` + `runningBalance | null`; read as `CursorPage<Transaction>`. Per transaction: date, description with counterparty, category, status, signed amount, flagged, has attachments; running balance on P10 only. `LEDGER_PAGE_SIZE` is 50; at most `LEDGER_MAX_PAGES` (10) pages — 500 entries — are held, earlier pages being released and refetched when the member goes back (A17). Order is total and stable: `postedAt` (or `createdAt` while pending) newest first, ties broken by `id`. The cursor is opaque and position-based, so an entry posting while the member reads is neither duplicated nor skipped; new entries are not inserted while the member reads — the member is told there are new entries and loads them on request. A cursor the server no longer accepts restarts from the newest page with the filters kept and a notice. Reaching a distant date in a 5-million-entry ledger is done with the date filter, not by paging. Running balance is a server figure per entry. One entry that fails its schema fails its page, not the loaded pages.
- **Interaction model** — nearing the end fetches the next page; an explicit load-more action is the keyboard/screen-reader equivalent. Enter or click opens P12 without leaving the list (intercepted route, P10/P11). ↑/↓ move the active transaction; Enter opens; `F` toggles flag on the active transaction; each transaction can also be flagged or have its link copied from its actions (C20). Flagging is for R1–R3 (optimistic, rolled back on failure, undoable); for R4 it is withheld and `F` does nothing. An entry that no longer matches after the member changes it (unflagged on P14) stays, with its new state, until the next refresh, so nothing the member is working on vanishes. Position and the active entry are restored on Back for the session. Copy link gives the canonical `/transactions/[id]`, which opens only for members who can see that account.
- **Device needs** — on a phone each transaction's amount, counterparty/description, date and status remain readable; transactions open by touch; no horizontal page scroll.
- **Accessibility** — `<table>` with `<caption>` summarising filters; `aria-rowcount` from S22 (or -1); `aria-rowindex` per row; `aria-sort`; one status message "Showing 50 of 4,210 transactions"; debits read with a minus; focus returns to the originating row when detail closes. Home/End and Page Up/Down move through loaded entries; after load-more focus moves to the first newly loaded entry and the status message updates once.
- **Loading** — first load: a placeholder reserves the populated space; filter change keeps previous results with `aria-busy`; loading the next page reserves space for it. A refresh keeps entries in place and marks the section busy.
- **Error** — first-load → C33; next-page failure keeps loaded results and tells the member "Couldn't load more · Retry". Offline keeps loaded entries, readable and stated as possibly out of date; load-more waits for reconnection. Each failure carries a reference.
- **Empty** — none yet `EMPTY_STATES.ledger` ("No transactions on this account yet."); none match `EMPTY_STATES.ledgerFiltered` ("No transactions match these filters." + Clear filters); flagged `EMPTY_STATES.flagged` ("Nothing flagged. Flag a transaction to come back to it here."). Not permitted: R4 with no permitted account in scope gets the not-permitted wording rather than "no transactions".
- **Reuse** — P10, P11, P14, P19; the pattern for S49.
- **Technical notes** — Virtualized and cursor-paginated; LD2 required at this scale; the virtualizer uses a constant size estimate (Phase 7). Must hold: no total is computed from loaded entries; K3 is measured here.

## Transactions

P12 serves S24–S26 both as a standalone page and through the intercepted route that keeps the originating list open.

### S24 — Transaction detail

Pages: P12 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C12](phase-6-interaction-contracts.md#c12--status-label) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Everything known about one transaction, led by its signed amount.
- **Responsibilities** — Tell the member everything the bank and the workspace know about one transaction, starting with its signed amount; let the member copy the link and the reference.
- **Data requirements** — `use-transaction` (standard). `TransactionDetail` = `Transaction` + `bankDescriptor`, `method`, `accountName`, `accountLast4`, `events`, `notes`, `attachments` (amount, status, description, counterparty, account, created and posted dates, reference, category, flag, raw bank descriptor). While the transaction is `pending` it refetches on the live tier, since a pending amount is provisional and may change on posting; it is labelled so. `reference` is the identifier a member quotes to support. `bankDescriptor` is bank-supplied text, rendered as text only. For a transaction in another currency than its account, whether the original amount and rate are supplied is Q11; none is ever computed on the client.
- **Interaction model** — when opened from a list (C22), Escape or close returns to the list and restores focus, and the member can move to the full page; "Copy link" copies `/transactions/[id]`; counterparty → P19; `reversed` links to the original transaction (Q-066). If the detail differs from what the list held (a status change), the list entry is updated too. A transaction on an account R4 may not see answers as not found. Transactions are never deleted, so a link stays valid for as long as the member keeps access.
- **Device needs** — baseline.
- **Accessibility** — when opened from a list it is a labelled dialog; amount with sign and status in text. On opening, focus moves to the transaction's heading; on closing, to the originating entry, or to the nearest loaded entry if that one has been released.
- **Loading** — facts already known from the list are available immediately; the rest load with placeholders that reserve their space.
- **Error** — not found → segment `not-found`; other → C33. Offline with list-known facts: those facts stay, stated as incomplete. Each failure carries a reference.
- **Empty** — not applicable.
- **Reuse** — P12 (page and intercepted route); facts reused read-only in S53.
- **Technical notes** — One `use-transaction` query serves S24, S25 and S26.

### S25 — Transaction lifecycle

Pages: P12 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Tell how the transaction moved through its lifecycle, led by its current state and when it was reached.
- **Responsibilities** — Ordered events — created, pending, posted, returned, reversed, failed, note added, attachment added, flagged — each with time and actor.
- **Data requirements** — from `use-transaction`. `TransactionEvent`: `id`, `kind`, `at`, `actor {id, name} | null`, `detail | null`. Events are append-only and never edited, oldest to newest by `at`, ties by `id`; the most recent `EVENTS_PAGE_SIZE` (50) arrive with the transaction and earlier ones load on request. Times are in the workspace zone, absolute. A null `actor` is the bank or the system and is named as such; an event keeps the name of a member who has since left. This is the audit trail of annotations, readable by anyone who can read the transaction.
- **Interaction model** — read only.
- **Device needs** — baseline.
- **Accessibility** — ordered list; each event's kind in text; times include zone on request. Loading earlier events moves focus to the earliest newly loaded one.
- **Loading / Error** — shares S24's.
- **Empty** — always at least "Created".
- **Reuse** — P12.
- **Technical notes** — Reads `TransactionDetail.events`; no query of its own.

### S26 — Notes & attachments

Pages: P12 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C49](phase-6-interaction-contracts.md#c49--file-upload) [C01](phase-6-interaction-contracts.md#c01--button) [C09](phase-6-interaction-contracts.md#c09--switch) [C06](phase-6-interaction-contracts.md#c06--select) [C59](phase-6-interaction-contracts.md#c59--permissiongate)

- **Purpose** — Let the member annotate a transaction for their books, knowing the latest note and whether a receipt is attached.
- **Responsibilities** — Set category, toggle flag, add/delete notes, upload/download/delete receipts. Viewers read only.
- **Data requirements** — `use-update-transaction`, `use-upload-attachment`; delete hooks per Q2. `TransactionNote`: `id`, `body`, `author`, `createdAt`. `Attachment`: `id`, `fileName`, `mimeType`, `sizeBytes`, `uploadedAt`, `uploadedBy`. `TransactionAnnotationInput`: `category?`, `flagged?`, `note?`. Limits (A18, A20): a note is 1–`NOTE_MAX_LENGTH` (2,000) characters of plain text; a transaction holds at most `UPLOAD_MAX_FILES` (10 per transaction) attachments, each PDF, JPEG or PNG up to `UPLOAD_MAX_BYTES`; `category` is one of `TRANSACTION_CATEGORIES`. Notes arrive oldest to newest. An attachment opens through a signed link lasting `DOWNLOAD_LINK_TTL`, fetched on request, never cached.
- **Interaction model** — category and flag save on change, optimistic with rollback (annotations, not money); notes save on submit or ⌘/Ctrl+Enter; deletes confirm via C52; C59 withholds every annotation action from R4; a category or flag changed underneath the member is surfaced (concurrent edit). R1–R3 annotate; R4 reads notes and opens attachments on permitted accounts (A23). A note or attachment is deleted by its author or by R1; deletion cannot be undone once confirmed, and it leaves an event in S25 naming who deleted it and when. A note is created with an idempotency key, so a retry never posts it twice. Notes are append-only — added or deleted, never edited — so two members cannot overwrite each other's. A category or flag change carries the transaction's `updatedAt`; a stale one is refused (409), the latest value loads with who changed it, and the member keeps what they chose and decides whether to apply it again. Rapid flag changes by the same member are sent in order, so the record ends in the state that member last chose. An unsent note draft is kept in the open tab's memory per transaction until it is sent, the member signs out or the tab closes; it is never written to device storage. A refused upload behaves as in S12 (Q8); at the attachment limit adding is unavailable with the reason.
- **Device needs** — photograph a receipt on a phone and attach it.
- **Accessibility** — every control labelled; save results announced. After a note is added focus returns to the emptied note field and "Note added" is announced; a rollback is announced as an error.
- **Loading** — a placeholder reserves its space until the transaction loads; each upload reports progress.
- **Error** — rollback → message with Retry; failed upload → that attachment keeps a Retry; draft kept in the open tab on failure and across session expiry (X4). Error kinds per the section contract, each with a reference; a conflict offers the latest value beside what the member chose.
- **Empty** — `EMPTY_STATES.notes` ("No notes yet."), `EMPTY_STATES.attachments` ("Attach a receipt or invoice."). R4 gets the read-only wording ("No notes.", "No attachments.") with no prompt to add.
- **Reuse** — P12.
- **Technical notes** — Optimistic updates limited to category and flag; rollback restores the cached `TransactionDetail`. Must hold: no annotation write can alter an amount, status, date or counterparty.

### S27 — Saved views list

Pages: P13 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Manage the member's saved filter sets, known by their names.
- **Responsibilities** — Let the member recognise each view by name and by what it filters; open, rename, delete, set default.
- **Data requirements** — `use-saved-views` (slow). `SavedView` (name, filters, match count when known, created date) + `filtersSummary` from `lib/utils/describe-filters.ts`. At most `SAVED_VIEW_LIMIT` (50), so one response and no paging; the default view, then by name with `Intl.Collator`. A match count is given only when the server has computed it — never estimated on the client.
- **Interaction model** — open → `/transactions?<filters>`; rename without leaving the list; delete via C52. Each member manages only their own views. Rename and set-default follow the write rules; exactly one view is the default, and deleting it leaves none. A view whose filters name an account the member can no longer see, or a value the schema no longer accepts, opens with that filter dropped and a notice.
- **Device needs** — baseline.
- **Accessibility** — rename field labelled; deletion announced. Escape cancels a rename and restores the name; after saving a rename focus is on that view's name; after a deletion focus follows the removal rule of the section contract.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; rename conflict is a field error. A deletion that fails leaves the view in place, with Retry and a reference.
- **Empty** — `EMPTY_STATES.savedViews` ("No saved views. Filter the ledger, then choose Save view."), link to P11.
- **Reuse** — P13.
- **Technical notes** — Rename and delete hooks pending (Q2).

## Insights

### S28 — Period comparison

Pages: P15 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C30](phase-6-interaction-contracts.md#c30--chart) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C15](phase-6-interaction-contracts.md#c15--table-family)

- **Purpose** — Compare two periods so a finance lead can explain what changed, led by the net change.
- **Responsibilities** — Pick periods A and B; inflow, outflow, net per period with deltas; change by category and top counterparties.
- **Data requirements** — `use-compare-periods` (standard). `PeriodComparison`: `currency`, `a`, `b` (`PeriodTotals {from, to, inflow, outflow, net}`), `byCategory: {category, a, b, deltaBasisPoints | null}[]`, `topCounterparties`. Each period is at most `EXPORT_MAX_RANGE_DAYS` (366) days of workspace-zone calendar dates. One currency per comparison (a URL parameter); currencies are never combined. Posted entries only. `deltaBasisPoints` is null when period A is zero and is then stated as "no comparison", never as an infinite or 100% change. `byCategory` covers every category including uncategorised; `topCounterparties` holds the ten largest changes, chosen by the server. Periods of unequal length are stated as such.
- **Interaction model** — the member picks both periods (C48); B can be set to the previous period in one step; choosing a category → P11 filtered to category and period B. R1–R3 (P15); R4 gets the not-permitted state. Both periods live in the URL; invalid values fall back to this month against last month, and the member is told.
- **Device needs** — both periods selectable and results readable as text on a phone.
- **Accessibility** — chart text alternative; deltas in words ("up 4.2%"). A period change announces the new net change once; each category leads on with a name that carries the category and both amounts.
- **Loading** — a loading placeholder that reserves its space. A period change withholds the previous figures until the new ones arrive (as S22).
- **Error** — C33.
- **Empty** — `EMPTY_STATES.compare` ("No activity in either period. Try a wider range."). Not permitted for R4.
- **Reuse** — P15.
- **Technical notes** — LD1.

### S29 — Runway calculator

Pages: P16 · Contracts: [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C40](phase-6-interaction-contracts.md#c40--amount) [C30](phase-6-interaction-contracts.md#c30--chart) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Estimate how many months current cash lasts at a given burn — months of runway, always with its assumptions.
- **Responsibilities** — Pre-fill cash and average net burn; allow overrides plus expected monthly inflow; project months and run-out date; label everything as an estimate, never a bank forecast.
- **Data requirements** — `use-accounts`, `use-cash-flow`; pure `lib/utils/runway.ts`. `RunwayInput`: `cashMinor`, `monthlyBurnMinor`, `monthlyInflowMinor`, `currency`. `RunwayResult`: `months | null`, `runsOutOn | null`, `series`. One currency at a time; nothing is converted. Defaults: cash is the available balance in that currency; burn is the server's average monthly net outflow over the last `RUNWAY_AVERAGE_MONTHS` (3) full calendar months. Each input is 0 to 10^15 minor units. `runway.ts` works in `BigInt`; months are given to one decimal, rounded down so runway is never overstated, and beyond `RUNWAY_MAX_MONTHS` (120) the result reads "more than 10 years" (A24). `runsOutOn` is counted from today in the workspace zone and is month-end safe.
- **Interaction model** — recalculates on change; the member can reset to actual figures; overrides in the URL. R1 and R2 (P16). Nothing is saved or sent; a URL carries only figures the member typed. An invalid URL value is dropped with a notice. Zero cash gives zero months; burn not above inflow gives `notBurning`.
- **Device needs** — numeric keyboard; result readable without the chart.
- **Accessibility** — result announced politely after edits settle. Each field is labelled with its currency; recalculation never moves focus.
- **Loading** — inputs usable immediately. Defaults fill only fields the member has not touched; a typed value is never overwritten.
- **Error** — defaults failed → inputs start empty and the member is told "Couldn't load your balances. Enter figures to estimate."
- **Empty** — `months: null` → `RUNWAY_COPY.notBurning` ("Your inflow covers your spending at these figures.").
- **Reuse** — P16.
- **Technical notes** — The projection is a pure function of `RunwayInput`. Property tests: more cash never shortens runway; more burn never lengthens it; no float appears in the path.

## Documents

### S30 — Statement list

Pages: P17 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Download the monthly statement for any account and month.
- **Responsibilities** — Statements per account and month with period, opening and closing balance, availability; filter by account and year; download PDF.
- **Data requirements** — `use-statements` (slow); download URL fetched on click. `Statement`: `id`, `accountId`, `accountName`, `periodStart`, `periodEnd`, `opening`, `closing`, `status: available | generating`, `generatedAt | null`. Cursor pages of 50, newest period first, then account name; a `generating` statement refetches every 60 s in a visible tab. Period boundaries follow the statement rules of OD1; opening and closing balances are in the account's currency. A download link is signed, lasts `DOWNLOAD_LINK_TTL` (5 minutes), is single use, is fetched only when asked for and is never cached or stored. History reaches back `STATEMENT_HISTORY_MONTHS` (84), or to the account's opening if shorter; retention beyond that is Q15.
- **Interaction model** — account and year choices are kept in the URL; download opens the signed URL; `generating` is stated and download is unavailable. R1–R3; R4 gets the not-permitted state. Asking twice fetches once; a link that lapsed before use is requested again on the member's next attempt, never in a loop (P17). If the browser blocks the download, a link to the same file is offered. A statement still `generating` after 24 hours is stated as delayed, with a reference. Each download is audit-logged.
- **Device needs** — downloads work on phones.
- **Accessibility** — download actions name the account and month. "Download started" with the account and month is announced and focus stays on the action; a failure is announced as an error.
- **Loading** — a loading placeholder that reserves its space; each download reports progress while its link is fetched.
- **Error** — C33; download link failure → message with Retry. Error kinds per the section contract, each with a reference.
- **Empty** — `EMPTY_STATES.statements` ("Your first statement is ready after the end of your first full month."). None for the chosen account and year: `statementsFiltered` ("No statements for this account in that year."). R4 gets the not-permitted state.
- **Reuse** — P17.
- **Technical notes** — Download URL hook pending (Q2).

### S31 — Export builder

Pages: P18 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C06](phase-6-interaction-contracts.md#c06--select) [C07](phase-6-interaction-contracts.md#c07--checkbox) [C08](phase-6-interaction-contracts.md#c08--radiogroup) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Start an export for a chosen period, accounts and format, knowing what it will include before it starts.
- **Responsibilities** — Choose date range, accounts, format (CSV or OFX-style, `EXPORT_FORMATS`), columns, and whether pending is included (default posted only); submit as a job.
- **Data requirements** — `use-create-export`. `CreateExportInput`: `from`, `to`, `accountIds` (≥ 1), `format`, `columns`, `includePending`. Limits: `EXPORT_MAX_RANGE_DAYS` is 366; `to` is not after today in the workspace zone; at most `EXPORT_ACTIVE_JOB_LIMIT` (3) queued or running jobs per member; at most `EXPORT_MAX_ROWS` (5,000,000) rows (A19). The number of entries the export will hold comes from the server before submission (the figure S22 uses). In the file: amounts are signed decimal strings produced from minor units with the currency's own decimal places; every entry carries its ISO currency and no cross-currency total; dates are ISO 8601 with the workspace offset; pending entries are labelled; account numbers appear masked only; a text value that a spreadsheet would run as a formula is neutralised.
- **Interaction model** — submit creates a job and moves focus to it in S32; it never waits for the file. Withheld from R4 (C59). R1–R3. Submission carries an idempotency key; a request identical to a job already queued or running takes the member to that job rather than starting another. At the active-job limit submission is unavailable with the reason. Values survive session expiry. A direct visit by R4 gets the not-permitted state.
- **Device needs** — baseline.
- **Accessibility** — groups in fieldsets; the created job announced. On a validation failure focus moves to the first invalid field.
- **Loading** — usable immediately.
- **Error** — Zod field errors (e.g. range longer than `EXPORT_MAX_RANGE_DAYS`); transport → message. Error kinds per the section contract, with a reference and the choices kept.
- **Empty** — no accounts → `EMPTY_STATES.accounts`.
- **Reuse** — P18.
- **Technical notes** — `includePending` made explicit in 2.0.0 from the Phase 2 assumption. Each export request is audit-logged with actor, range, accounts and format.

### S32 — Export jobs

Pages: P18 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C17](phase-6-interaction-contracts.md#c17--progress-indicator) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Track export jobs and download finished files, led by the newest job's state.
- **Responsibilities** — Jobs with period, format, state, requester, expiry; poll while any job is `queued`/`running`; download `ready`.
- **Data requirements** — `use-exports` with `refetchInterval` while active, off in background tabs. `ExportJob`: `id`, `status`, `from`, `to`, `format`, `accountIds`, `requestedBy`, `createdAt`, `expiresAt | null`, `rowCount | null`, `failureReason | null`. Newest first, cursor pages of 20, kept for 90 days (A19). `EXPORT_POLL_INTERVAL` is 5 s while a job is active and the tab is visible; returning to the tab refetches at once. After `EXPORT_POLL_MAX_MS` (30 minutes) automatic polling stops, the job is stated as delayed and the member can refresh by hand; the server-side time limit that turns a job to `failed` is Q9. A `ready` file expires `EXPORT_RETENTION_DAYS` (7 days) after completion; `expiresAt` is given in the workspace zone. A download link is signed, lasts `DOWNLOAD_LINK_TTL`, and is fetched only when asked for. A member sees their own jobs; R1 and R2 also see every job in the workspace, each with its requester; R3 sees only their own (A23); R4 none.
- **Interaction model** — a `ready` job can be downloaded; a `failed` job gives its reason and can be tried again with the same input; an `expired` job can be created again, prefilled. A job cannot be cancelled in v1 — the lifecycle (Phase 1) has no cancelled state (Q9). Trying a `failed` job again creates a new job with a new key. A file that expires between listing and download turns to `expired` and offers re-creation. `failureReason` maps to copy in constants, never raw backend text, and is given with the job's reference. Each download is audit-logged.
- **Device needs** — baseline.
- **Accessibility** — state changes announced once ("Export ready"). A job's state change is announced once however often it is polled; polling never moves focus.
- **Loading** — a loading placeholder that reserves its space. A poll refreshes without marking the section busy.
- **Error** — C33 on first load; failed polls keep data and retry quietly. After three failed polls in a row the states are said to be possibly out of date, with Retry; offline pauses polling until reconnection.
- **Empty** — `EMPTY_STATES.exports` ("No exports yet. Choose a period to create one."). Not permitted for R4.
- **Reuse** — P18; S17 reads the same data.
- **Technical notes** — Poll interval `EXPORT_POLL_INTERVAL`; download URL hook pending (Q2). K4 and K5 are measured on these states.

## Counterparties

### S33 — Counterparty summary

Pages: P19 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C40](phase-6-interaction-contracts.md#c40--amount) [C45](phase-6-interaction-contracts.md#c45--metric)

- **Purpose** — Who this counterparty is and how much has moved with them, led by the total paid in the period.
- **Responsibilities** — Identify the counterparty (name, identity mark, known identifiers); give first/last dates and totals in and out over 12 months.
- **Data requirements** — `use-counterparty` (standard). `Counterparty`: `id`, `name`, `kind`, `identifiers`, `firstSeenAt`, `lastSeenAt`, `totals {inflow, outflow, count}`, `currency`. Totals cover the trailing 12 months of posted entries by workspace-zone date and are per currency — a counterparty seen in two currencies has two sets, never one sum (shape proposed under A15). `identifiers` are masked to the last four. The grouping of bank descriptors into one counterparty is done by the backend and is stated as automatic. For R4 the totals cover permitted accounts only and say so.
- **Interaction model** — read only; S23 on the page gets `counterpartyId` as a locked filter.
- **Device needs** — baseline.
- **Accessibility** — figures labelled.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — not found → `not-found`; other → C33. A counterparty with no transactions the member may see answers as not found. Each failure carries a reference.
- **Empty** — not applicable (a counterparty exists only because transactions do).
- **Reuse** — P19.
- **Technical notes** — `counterpartyId` is a locked filter on S23.

## Inbox

### S34 — Notification feed

Pages: P20 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C03](phase-6-interaction-contracts.md#c03--textlink) [C25](phase-6-interaction-contracts.md#c25--pagination) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Every alert and system notice for the member, newest first, with unread items known.
- **Responsibilities** — Kind, message, time, read state; mark one/all read; link to the subject; unread filter.
- **Data requirements** — `use-notifications` (cursor), `use-mark-notifications-read`. `Notification`: `id`, `kind: low_balance | large_transaction | statement_ready | export_ready | verification_needs_info | member_joined`, `title`, `body`, `href | null`, `createdAt`, `readAt | null`. Cursor pages of 30, newest first, ties by `id`; kept `NOTIFICATION_RETENTION_DAYS` (90, A19). Notifications are the member's own. `title` and `body` are server-written plain text and never contain a full account number; `href` is followed only when it is a same-origin path.
- **Interaction model** — choosing marks read and follows `href`; "Mark all as read" asks nothing (reversible via the filter); unread toggle in the URL. Mark-read is idempotent and optimistic. "Mark all as read" covers notifications that existed when it was asked for, so one arriving a moment later is not marked unseen. A subject the member can no longer open still marks the notification read and gives the not-found or not-permitted state. Notifications arriving while the page is open are not inserted while the member reads: the member is told how many are new and loads them on request.
- **Device needs** — baseline.
- **Accessibility** — read state in text; relative times carry absolute time as accessible text. After "Mark all as read" the result is announced and focus stays; arrivals are announced as a count, not read out.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; failed mark-read reverts with a message. Error kinds per the section contract, with a reference.
- **Empty** — `EMPTY_STATES.notifications` ("You're all caught up."), `notificationsUnread` ("No unread notifications.").
- **Reuse** — P20.
- **Technical notes** — Mark-read hook named in Phase 7 (Q2).

### S35 — Alert rules

Pages: P22 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select)

- **Purpose** — Owners and finance leads choose which events alert them, at what thresholds.
- **Responsibilities** — Toggle each alert kind; thresholds (low balance per account, large transaction); delivery (in-app always, email optional).
- **Data requirements** — `use-alert-rules`, `use-update-alert-rules` (slow). Schema `lib/validations/alert-rule.ts`. `AlertRule`: `id`, `kind`, `enabled`, `threshold | null`, `accountId | null`, `channels`. A threshold is `Money` in the currency of its account (low balance) or of its rule (large transaction), greater than zero and at most 10^15 minor units, typed in major units and parsed from the string. One low-balance rule per account, one large-transaction rule per currency. Alert rules are per member: a rule belongs to the member who sets it, each member has at most `ALERT_RULE_LIMIT` (20), only R1 and R2 may have them, and there is no shared workspace rule (A23). An email alert names the account by masked number, carries no balance and leads to a page that needs sign-in.
- **Interaction model** — enabling a rule makes its threshold editable; explicit save; R1 and R2 each edit their own rules; R3 and R4 are redirected from `/settings` to `/settings/profile`, and get the not-permitted state if they reach this section by a direct link (Phase 1 permission matrix; P22). At `ALERT_RULE_LIMIT` adding a rule is unavailable with the reason. Save follows the write rules. A saved rule applies to events after the save, not to past ones; a low-balance alert fires once each time the balance crosses the threshold, not on every refresh. A rule for an account since `closed` is off and says why. Leaving with unsaved changes asks (C52).
- **Device needs** — numeric keyboard for thresholds.
- **Accessibility** — each rule a labelled group; a newly editable threshold is reachable by focus order, not signalled by motion. On a failed save focus moves to the first invalid threshold; a successful save is announced.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 on load; field errors and a message on save. Error kinds per the section contract, with a reference; a conflict — possible only against the member's own change in another tab or on another device, since no rule is shared — loads the latest rules and keeps the member's entries.
- **Empty** — not applicable: kinds are fixed and always listed, off by default (P22 offers starter values).
- **Reuse** — P22.
- **Technical notes** — Validation through `lib/validations/alert-rule.ts`.

### S36 — Thread list

Pages: P21 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C11](phase-6-interaction-contracts.md#c11--searchinput)

- **Purpose** — The member's secure threads with support, led by threads with unread replies.
- **Responsibilities** — Subject, last excerpt and time, unread, status (open/closed); search subjects; start a thread.
- **Data requirements** — `use-threads`. `Thread`: `id`, `subject`, `status`, `lastMessage {excerpt, at, author}`, `unread`. Cursor pages of 20, most recent message first; unread state on the live tier. Search runs on the server over subjects only, 2–100 characters. A thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1); other R2 and R3 members do not read it, and for them it answers as not found (A23). A subject is 1–120 characters.
- **Interaction model** — choose → `/messages/[threadId]`; starting a thread opens S37 in compose mode; on larger screens the threads stay reachable while one is open (layout route). R1–R3 (P21); R4 gets the not-permitted state. An owner sees the workspace's threads with the member who opened each. A member may have at most `THREAD_OPEN_LIMIT` (10) open threads; at the limit starting another is unavailable and an existing thread is suggested.
- **Device needs** — list and a thread each fully usable on a phone.
- **Accessibility** — unread and status in text. A thread's name carries its unread state and status; opening one moves focus to the conversation's heading.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33. Error kinds per the section contract, with a reference.
- **Empty** — `EMPTY_STATES.threads` ("No messages. Start a conversation with our support team."), `threadsFiltered` ("No threads match that search."). Not permitted for R4.
- **Reuse** — P21.
- **Technical notes** — none beyond the data requirements.

### S37 — Conversation

Pages: P21 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C18](phase-6-interaction-contracts.md#c18--avatar) [C49](phase-6-interaction-contracts.md#c49--file-upload)

- **Purpose** — Read and reply within one thread.
- **Responsibilities** — Messages in order with author, time, attachments; compose and send with attachments; state when closed.
- **Data requirements** — `use-thread`, `use-send-message`. `Message`: `id`, `threadId`, `author {id, name, avatarUrl, isStaff}`, `body`, `attachments`, `sentAt`. `SendMessageInput`: `body` (1–`MESSAGE_MAX_LENGTH`), `attachmentIds`. Cursor pages of 30, the newest page loading before earlier ones; new messages are fetched every 15 s while the thread is open in a visible tab. `MESSAGE_MAX_LENGTH` is 5,000 characters of plain text, rendered as text. At most `UPLOAD_MAX_FILES` (5 per message) attachments, each PDF, JPEG or PNG up to `UPLOAD_MAX_BYTES`, opened through a signed link lasting `DOWNLOAD_LINK_TTL`. `isStaff` is asserted by the server only, so a member cannot pose as support. How long threads are kept is Q15.
- **Interaction model** — ⌘/Ctrl+Enter sends; earlier messages load on request; replying is unavailable in closed threads (`MESSAGE_COPY.closed`); drafts are kept per thread in the open tab's memory only. A message is sent with an idempotency key, so Retry never posts it twice; order is the server's `sentAt`. Sending is unavailable while an attachment is still uploading. If the thread closes while the member is writing, the text is kept, the closure is stated, and a new thread carrying the text is offered. Text that looks like a full account or card number (a run of eight or more digits) is questioned before sending, not blocked. The draft survives session expiry within the open tab, so the member sends it after re-authenticating in place; it is cleared on send and on sign-out, is gone when the tab closes or a different user signs in, and is never written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache. A refused attachment behaves as in S12 (Q8).
- **Device needs** — attachments from files or camera; replying works with the on-screen keyboard open.
- **Accessibility** — messages as a list with author and time; new incoming messages announced politely; send shortcut declared (`aria-keyshortcuts`). After sending, focus stays in the reply field and "Message sent" is announced; an incoming message is announced by its author, not read out; loading earlier messages keeps the reading position and moves focus to the earliest newly loaded message.
- **Loading** — a loading placeholder that reserves its space; replying is possible immediately.
- **Error** — C33 for the thread; failed send keeps the text and marks it "Not sent — Retry". Error kinds per the section contract, each with a reference; offline keeps the draft in the open tab and sends nothing.
- **Empty** — compose mode: the member gives a subject and is told `EMPTY_STATES.conversationNew` ("Describe what you need. Don't include full account numbers or passwords.").
- **Reuse** — P21; staff side in S53.
- **Technical notes** — Message body validated against `MESSAGE_MAX_LENGTH`; drafts are held per thread in memory, not in device storage. A thread is readable by the member who opened it and by the workspace's owners (R1). Staff reading a thread is audit-logged.

## Settings & team

### S38 — Workspace general form

Pages: P22 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Edit workspace display settings, led by the workspace display name.
- **Responsibilities** — Display name, default currency view, time zone, week start; legal name read-only (from verification).
- **Data requirements** — `use-workspace`, `use-update-workspace`. `WorkspaceSettings`: `displayName`, `timeZone` (IANA), `weekStartsOn: 0 | 1`, `defaultCurrency`; `legalName` read-only. `displayName` is 1–`DISPLAY_NAME_MAX` (80) characters; `timeZone` is one of `Intl.supportedValuesOf("timeZone")`, and UTC applies while it is unset; `defaultCurrency` is one of the currencies the workspace holds accounts in.
- **Interaction model** — explicit save; leave prompt for unsaved changes; read-only for R2 (C59), who edits alert rules only (S35). R1 edits. Changing the time zone is confirmed (C52) with its effect stated: every "today" and period boundary is computed in the new zone from the next load; recorded instants, statements and finished exports do not change. Save follows the write rules; other members get the change at their next refetch. Each change is audit-logged with the old and new value.
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only, not only made to look disabled. A successful save is announced and focus stays; on failure focus moves to the first invalid field.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 on load; field errors and message on save. Error kinds per the section contract, with a reference.
- **Empty** — no empty state of its own; R3 and R4 get the not-permitted state (P22).
- **Reuse** — P22.
- **Technical notes** — `legalName` comes from the verification case and is never writable here.

### S39 — Team members

Pages: P23 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Who has access and with what role, led by the member count and pending invitations.
- **Responsibilities** — Members and pending invitations with name, email, role, status, last active; change role; remove; resend/revoke invitations.
- **Data requirements** — `use-team` (slow, server-paged for 200 members). `Member`: `id`, `userId | null`, `name | null`, `email`, `role` (`owner | finance | accountant | viewer`), `status: active | invited | suspended`, `lastActiveAt | null`, `invitedAt | null`. Cursor pages of 50, by status then name (`Intl.Collator`); sized for the 200 concurrent members of the scale target. An invitation is single use and expires `INVITE_TTL_DAYS` (7) after it is sent or re-sent; re-sending invalidates the earlier link; a workspace holds at most `TEAM_MEMBER_LIMIT` (200) members; at most `INVITE_PENDING_MAX` (50) are pending at once (A19, A20). `lastActiveAt` is given to the day.
- **Interaction model** — per member: change role; remove (confirmed via C52 naming the person and what they lose); resend or revoke an invitation. The last owner cannot be demoted or removed (those actions are unavailable with the reason given); R2 manages only viewers and accountants; a member's name → P24. A role change is confirmed (C52) naming what the person gains and loses, and applies at their next request. Making someone an owner needs step-up (A23). Removal ends that person's access to this workspace at once; their notes and events stay attributed to them. A stale action (the member was already changed or removed by someone else) is refused and the latest state loaded. Re-sending is possible once every 10 minutes per invitation; a revoked invitation's link stops working at once. Every change is audit-logged with actor, subject, and the role before and after.
- **Device needs** — role change possible on a phone.
- **Accessibility** — each member's actions are named for them ("Actions for Ada Lovelace"). After a removal focus follows the removal rule of the section contract and the result is announced by name; after a role change focus stays on that member's actions.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; failed mutation → message, member unchanged. Error kinds per the section contract, with a reference.
- **Empty** — always at least the owner; owner only → `EMPTY_STATES.teamSolo` ("Invite your finance lead or accountant to work alongside you."). R3 and R4 get the not-permitted state (P23).
- **Reuse** — P23.
- **Technical notes** — Role, removal and invitation hooks pending (Q2).

### S40 — Invite member form

Pages: P23 · Contracts: [C21](phase-6-interaction-contracts.md#c21--dialog) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Invite a person with a role (the only way non-owners join, BR12).
- **Responsibilities** — Email and role; state what the role can do (from the permission matrix); choose accounts for a viewer; send.
- **Data requirements** — `use-invite-member`. `InviteMemberInput`: `email`, `role: Exclude<WorkspaceRole, "owner">`, `accountIds | null` (viewer only). Email at most 254 characters, trimmed; one membership or pending invitation per email per workspace; `accountIds` holds at least one account for a viewer. At `INVITE_PENDING_MAX`, or at the member limit, inviting is unavailable with the reason.
- **Interaction model** — opens as C21 from the invite action; a viewer's accounts are chosen with C07; success closes it, announces "Invitation sent to {email}" and the pending member appears in S39; an existing member → field error. R1 invites finance, accountant or viewer; R2 is offered accountant and viewer only (the others are withheld, not refused afterwards). Sending carries an idempotency key. An email with a pending invitation is a field error that offers to re-send. The outcome is the same whether or not the email already has a Ledgerline login, so nothing is disclosed about other customers. Closing with something typed asks before discarding; values survive session expiry. Each invitation is audit-logged.
- **Device needs** — baseline.
- **Accessibility** — dialog labelled; role description read with the role choice. On opening, focus is on the email field; on closing, on the action that opened it; on a failed submit, on the first invalid field.
- **Loading** — submit reports progress.
- **Error** — Zod/server field errors; transport error is stated and the dialog stays open with values kept. Error kinds per the section contract, with a reference.
- **Empty** — not applicable.
- **Reuse** — P23.
- **Technical notes** — `role` excludes `owner` at the type level. "Any role" in the Phase 1 matrix means any role that can be invited; ownership is granted by a role change in S39.

### S41 — Role permissions reference

Pages: P23, P24 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Say plainly what each role can and cannot do, led by the capabilities of the role in question.
- **Responsibilities** — State, for each capability, whether each role has it; on P24 identify the member's own role.
- **Data requirements** — none fetched (static). `PermissionMatrix` (`lib/data/permission-matrix.ts`): `capabilities {id, label}[]`, `grants: Record<WorkspaceRole, string[]>`. The viewer's qualification ("permitted accounts only") is part of the matrix data, in text.
- **Interaction model** — read only; on P24 the role in question is identified.
- **Device needs** — readable on a phone (each role's capabilities can be read as a list).
- **Accessibility** — table with row and column headers; yes/no in text.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P23, P24.
- **Technical notes** — Rendered on the server. The same `PermissionMatrix` drives C59. Why: the reference members read and the rules the UI applies cannot disagree. The backend remains the authority (BR9): when it publishes its policy, a contract test fails if `PermissionMatrix` disagrees (Q1).

### S42 — Profile form

Pages: P25 (edit), P24 (read) · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — A person's profile, led by their name (and role in read mode): the member edits their own (P25); an owner or finance lead views a teammate's (P24).
- **Responsibilities** — Full name, email, identity image, phone (optional), bio; edit mode saves; read mode adds role and join date.
- **Data requirements** — `use-me`, `use-update-profile`; `use-team-member` in read mode. `Profile` = `userResponseDtoSchema.pick({ fullName, email, phoneNumber, avatar, bio })`. Limits (A18, A20): `fullName` 1–`DISPLAY_NAME_MAX` (80) characters; `phoneNumber` in E.164 form, up to 16 characters; `bio` up to 500; the identity image is JPEG or PNG up to `AVATAR_MAX_BYTES` (2 MB), re-checked by the server (Q8). Read mode gives a teammate's name, email, role, join date and image — not their phone number (A23).
- **Interaction model** — explicit save; email is read-only (changing it needs verification, Q2); read mode offers no edits, only a way back to P23. Save follows the write rules, so an edit made on another device is not silently overwritten. Read mode is for R1 and R2 (P24); for others a teammate's profile answers as not permitted.
- **Device needs** — name and phone autofill.
- **Accessibility** — definition list in read mode. A successful save is announced and focus stays; on failure focus moves to the first invalid field.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; not-found member → `not-found`; save errors per field or message.
- **Empty** — blank optional fields read "Not provided".
- **Reuse** — P24, P25.
- **Technical notes** — `Profile` composes over the generated `userResponseDtoSchema`; change-email hook pending (Q2).

### S43 — Security settings

Pages: P25 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C15](phase-6-interaction-contracts.md#c15--table-family) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Let the member secure their sign-in, led by whether two-step is on.
- **Responsibilities** — Change password; enrol/disable two-step (passkey + TOTP, OD6); list sessions (device, approximate location, last active); revoke any but current; "Sign out everywhere else".
- **Data requirements** — `use-change-password`, `use-sessions`, `use-two-step`. `ChangePasswordInput`: `current`, `next`, `confirm` (`next ≠ current`, `PASSWORD_MIN_LENGTH`). `Session`: `id`, `device`, `approximateLocation | null`, `createdAt`, `lastActiveAt`, `current`. `TwoStepStatus`: `enabled`, `methods`. Sessions: every active one, most recently active first, standard tier. `approximateLocation` is derived from the network address and is stated as approximate. The new password is `PASSWORD_MIN_LENGTH` to `PASSWORD_MAX_LENGTH` characters. A two-step secret is given once, during enrolment, and is never held on the device afterwards.
- **Interaction model** — disabling two-step, revoking and revoke-all confirm via C52; enrolment is a guided flow in C21 (QR plus copyable key and code check, or passkey); step-up required for password, two-step and revoke-all; after a password change other sessions end and the member is told. Step-up holds for `STEP_UP_GRANT_SECONDS`; a cancelled step-up changes nothing and is not an error. Two-step turns on only after a code or passkey check succeeds; an abandoned enrolment leaves it off. A wrong current password counts toward the attempt limit of S08. Revoking is idempotent — a session that already ended counts as revoked — and "everywhere else" never ends the current session. A password change, a two-step change and each revocation is audit-logged and notified to the member's email. Losing every two-step method is recovered per X8 (recovery code, P05).
- **Device needs** — enrol a passkey on the device in hand; TOTP without scanning.
- **Accessibility** — the QR code has the key as text; results announced. The enrolment flow takes focus on opening and returns it to its trigger on closing; after a revocation focus follows the removal rule; each result is announced.
- **Loading** — password, two-step and sessions load independently, each with a placeholder that reserves its space.
- **Error** — password, two-step and sessions fail independently, each with C33; wrong current password is a field error. Error kinds per the section contract, with a reference.
- **Empty** — sessions include the current one; two-step off → `SECURITY_COPY.twoStepOff` ("Two-step verification is off. Add a passkey to protect your account.").
- **Reuse** — P25.
- **Technical notes** — Revoke-session hook pending (Q2).

## Payments

Specified, Deferred (OD3). **OD9** may bring payments and approvals into scope.

### S44 — Transfer form

Pages: P26 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C40](phase-6-interaction-contracts.md#c40--amount) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Move money between own accounts or to a saved payee (F6).
- **Responsibilities** — Source and destination; amount and memo; check available balance and limits; review; confirm with step-up; report result and reference.
- **Data requirements** — `use-accounts`, `use-create-transfer`. `TransferInput`: `fromAccountId`, `toAccountId | payeeId`, `amountMinor`, `currency`, `memo | null`, `idempotencyKey` (nanoid, once per review). Why: a double submit must never send twice. The amount is typed in major units and parsed from the string to minor units; it is greater than zero, within the available balance and within the limits the server returns for the member's role. Source and destination share one currency; a transfer across currencies is not specified (Q13). `memo` is up to 140 characters.
- **Interaction model** — two steps (edit, review); nothing sent from edit; review confirms via C52 with step-up — each confirmation asks for its own grant, and a grant issued for any other purpose never authorises money movement; success links to the pending transaction in P12; nothing optimistic. R1 and R2, with limits and dual approval per OD3/OD9 (P26). The server re-checks balance and limits at confirmation. A review lapses after `TRANSFER_REVIEW_TTL` (5 minutes) and must be reviewed again, because the balance may have moved. Confirmation is stated as final before it is given; there is no undo, and withdrawing a pending transfer is Q13. A cancelled step-up returns to review with the same key. If the session expires at review, re-authentication returns to the same review with the same key. Offline, confirmation is unavailable. Every attempt is audit-logged with actor, accounts, amount, key and outcome.
- **Device needs** — full review on a phone before confirming.
- **Accessibility** — amount read in words at review; errors linked to fields. Opening review moves focus to its heading; after confirmation focus moves to the result, which carries the reference.
- **Loading** — confirm disabled until the backend answers.
- **Error** — insufficient funds, over limit, frozen → field errors from `TRANSFER_COPY`; uncertain outcome → "We couldn't confirm this transfer. Check Recent activity before trying again", key kept, no auto-retry.
- **Empty** — `EMPTY_STATES.transfer` ("Add a payee or open a second account to transfer money.").
- **Reuse** — P26 (and P27 via payee preselection).
- **Technical notes** — Idempotency key generated once per review (nanoid). Must hold: one idempotency key yields at most one transfer, whatever the number of submissions, tabs or retries.

### S45 — Payee list

Pages: P27 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Manage payees, known by their names, and start a payment (F7).
- **Responsibilities** — Let the member recognise each trusted payee (destination always masked) and its payment history; add, edit, remove; pay (→ S44 preselected).
- **Data requirements** — `use-payees`. `Payee`: `id`, `name`, `destinationLast4`, `bankName | null`, `lastPaidAt | null`, `totalPaid`, `status: active | pending_verification`. Cursor pages of 50, by name. The full destination is never returned after creation, to anyone. `totalPaid` is per currency. A `pending_verification` payee cannot be paid. A name is up to 100 characters.
- **Interaction model** — paying → `/payments/transfer?payeeId=`; remove via C52; new payee needs step-up; changed bank details require confirmation. R1 and R2 (P27). Adding, editing and removing need step-up, and that grant never authorises a payment; a change of bank details is confirmed (C52) naming the old and the new masked destination, and for `PAYEE_CHANGE_HOLD_DAYS` (7 days) after the change a payment to that payee is refused until the change is explicitly confirmed; edits follow the write rules. Removal leaves past transactions untouched. Every change is audit-logged.
- **Device needs** — baseline.
- **Accessibility** — pay actions name the payee. After a removal focus follows the removal rule and the result is announced by payee name.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; duplicate payee is a field error.
- **Empty** — `EMPTY_STATES.payees` ("No payees yet."). R3 and R4 get the not-permitted state.
- **Reuse** — P27.
- **Technical notes** — none beyond the data requirements.

## Help

### S46 — Help search & categories

Pages: P28 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C14](phase-6-interaction-contracts.md#c14--content-group) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Find the right article in one search.
- **Responsibilities** — Client search over titles and summaries; categories; lead to messaging (signed in) or sign-in (visitor).
- **Data requirements** — static `lib/data/help-articles.ts`. `HelpArticle`: `slug`, `title`, `summary`, `category`, `body: HelpBlock[]`, `updatedOn`. `HelpCategory`: `id`, `title`, `description`, `icon`. Search text is up to 100 characters and matches without regard to case or accents; an article whose title matches is returned before one matched only by its summary. Client search is specified for up to `HELP_ARTICLE_LIMIT` (200) articles; beyond that it moves to the server (A24). The page reads no member data and is cacheable.
- **Interaction model** — results update as the member types (debounced); a category filters; results → `/help/[slug]`; query in `?q=`. The pause before results update is `SEARCH_DEBOUNCE_MS` (300 ms). An expired session counts as a visitor.
- **Device needs** — baseline.
- **Accessibility** — result count announced. Focus stays in search while results change; the count is announced once typing settles; Escape clears the search.
- **Loading / Error** — none.
- **Empty** — `EMPTY_STATES.helpSearch` ("No articles match. Try different words, or message our support team.").
- **Reuse** — P28.
- **Technical notes** — Search runs on the client over bundled data; no endpoint.

### S47 — Help article

Pages: P28 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Answer one question well.
- **Responsibilities** — The answer as paragraphs, lists, steps and notes; where the article sits in help; last-updated date; related articles.
- **Data requirements** — static. `HelpBlock` = `{kind: "p"; text} | {kind: "list"; items} | {kind: "steps"; items} | {kind: "note"; severity; text}`. `body` is structured blocks rendered as text — no markup from data is ever interpreted. At most three related articles, from the same category. A slug is permanent: a renamed article redirects, so a link quoted in a support thread keeps working.
- **Interaction model** — read only; missing slug → `not-found`.
- **Device needs** — readable without zoom.
- **Accessibility** — steps as an ordered list; notes labelled by severity in text.
- **Loading** — none.
- **Error** — not found only. The not-found state offers help search.
- **Empty** — not applicable.
- **Reuse** — P28.
- **Technical notes** — Rendered on the server. Articles describe shipped behaviour only (Q-248).

## Internal

### S48 — Platform growth figures

Pages: P29 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C30](phase-6-interaction-contracts.md#c30--chart) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C23](phase-6-interaction-contracts.md#c23--tabs)

- **Purpose** — Platform growth at a glance, led by the new-user total for the period.
- **Responsibilities** — New users for the period (day, month, year) with change vs previous period and a series; switch period.
- **Data requirements** — `use-admin-user-total`, `use-admin-user-series` (exist). Contract `PeriodTotalResponseDto` (`period`, `start`, `end`, `total`) and `PeriodSeriesResponseDto` (`points: {key, value}[]`). Standard tier. Periods are cut in UTC and say so (A22); the period still in progress is labelled partial. The change against the previous period is null when that period was zero and is stated as "no comparison". At most 366 points, oldest to newest.
- **Interaction model** — the period is switched with C23; points expose values on focus. R7; R5 and R6 read (P29).
- **Device needs** — text equivalent on a phone.
- **Accessibility** — chart text alternative.
- **Loading** — total and series load independently, each with a placeholder that reserves its space. A period switch withholds the previous figures until the new ones arrive.
- **Error** — total and series fail independently, each with C33. Error kinds per the section contract, with a reference.
- **Empty** — 0 is a real value shown as "0"; no points → `EMPTY_STATES.adminSeries` ("No sign-ups in this period.").
- **Reuse** — P29.
- **Technical notes** — Counts, not money → formatted through C27, never C40.

### S49 — Platform user directory

Pages: P30 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C21](phase-6-interaction-contracts.md#c21--dialog)

- **Purpose** — Find any user by email and act on their account.
- **Responsibilities** — Name, email, role, status, created; search by name/email; filter by role and status; create; open detail.
- **Data requirements** — `use-admin-users`, `use-create-user` (exists). Contract `UserResponseDto` (`id`, `fullName`, `email`, `phoneNumber`, `avatar`, `bio`, `role: ADMIN | USER`, `status: ACTIVE | PENDING | SUSPENDED`, `createdAt`, `updatedAt`); create with `CreateUserDto`. Cursor pages of 50, newest first, ties by `id`; search on the server over name and email, 2–100 characters (Q3). The directory is never loaded whole. Emails and phone numbers are personal data: search text stays out of analytics and logs.
- **Interaction model** — debounced search; filters in the URL; creating a user opens C21 validated by `createUserDtoSchema`; choosing a user → P31; a user can also be opened or have their ID copied from their actions (C20). R7 only (P30). Creating carries an idempotency key; each creation is audit-logged.
- **Device needs** — search and open on a phone.
- **Accessibility** — as S23. The create flow takes focus on opening and returns it to its trigger on closing.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; duplicate email is a field error in the dialog. Other roles get the not-permitted state. Each failure carries a reference.
- **Empty** — `EMPTY_STATES.adminUsersFiltered` ("No users match."); unfiltered empty impossible.
- **Reuse** — P30.
- **Technical notes** — Server paging required (Q3).

### S50 — Admin user record

Pages: P31 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Inspect one user, led by their account status, and change role or status.
- **Responsibilities** — Give the user's fields; edit full name, phone, role, status; delete; read-only for R5.
- **Data requirements** — `use-admin-user`. `UserResponseDto`; edit form `updateUserDtoSchema.pick({ fullName, phoneNumber, role, status })` (`lib/validations/admin-user.ts`). Standard tier; `updatedAt` is the version every save is based on.
- **Interaction model** — explicit save; suspend/role change confirm via C52 naming the effect ("Ada will be signed out and cannot sign in"); delete via C52 with the email typed; after delete → P30; no self-delete or self-demote (reason given). R7 edits. Save follows the write rules. Suspension ends the user's sessions at once. Granting `ADMIN` needs step-up. Deletion cannot be undone; it is refused, with the reason, while the user is the only owner of a workspace or the last `ADMIN`. What happens to a deleted user's notes, events and audit entries is Q15. Every change is audit-logged with actor and the values before and after.
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only with the reason. After deletion focus is on P30's `<h1>` and "User deleted" is announced; a save result is announced and focus stays.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — not found → `not-found`; other → C33; save errors per field or message. A conflict loads the latest record and keeps the edits; each failure carries a reference.
- **Empty** — not applicable.
- **Reuse** — P31.
- **Technical notes** — Edit schema composes over the generated `updateUserDtoSchema`.

### S51 — Compliance case queue

Pages: P32 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C47](phase-6-interaction-contracts.md#c47--active-filter)

- **Purpose** — One queue of verification cases ordered by what to review next, led by the oldest waiting case and the `submitted` count.
- **Responsibilities** — Business name, state, submitted date, age, assignee; filter by state and assignee; oldest first.
- **Data requirements** — `use-compliance-cases` (cursor). `ComplianceCaseSummary`: `id`, `workspaceId`, `businessLegalName`, `state`, `submittedAt | null`, `ageHours`, `assignee | null`, `openRequests`. Cursor pages of 50, oldest `submittedAt` first, ties by `id`; standard tier, refetched on focus. `ageHours` is computed by the server; a case waiting longer than `CASE_TARGET_HOURS` (24, from K14) is stated as overdue in text. Filtering is on the server.
- **Interaction model** — filters in the URL; choosing a case → `/admin/compliance/[caseId]`; "Assign to me" per case (Q2). R6 and R7; others get the not-permitted state. "Assign to me" on a case someone has just taken is refused and names the assignee; it is idempotent for the same analyst and audit-logged.
- **Device needs** — tablet-usable.
- **Accessibility** — ages given in words ("3 days"). After assigning, focus stays on the case and the result is announced.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33. Each failure carries a reference.
- **Empty** — `EMPTY_STATES.complianceQueue` ("No cases waiting for review."), `complianceQueueFiltered` ("No cases match these filters.").
- **Reuse** — P32 (in the segment layout).
- **Technical notes** — Assign hook pending (Q2).

### S52 — Compliance case review

Pages: P32 · Contracts: [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Review one case and decide — approve, reject, or request information — on the evidence.
- **Responsibilities** — Business details, owners and documents read-only (S10/S11 summaries, S12 list), verification progress read-only (C50), case history; record a decision with reason; write the info requests the owner sees in S13.
- **Data requirements** — `use-compliance-case`, `use-decide-case`. `ComplianceCase` = `VerificationCase` + `history {at, actor, action, note}[]`, `riskSignals {label, severity}[]`. `DecideCaseInput`: `decision: approve | reject | request_info`, `reason` (required), `requests?`. A document is viewed through a signed link lasting `DOWNLOAD_LINK_TTL`, served `no-store`; each viewing is audit-logged. `history` is append-only, oldest to newest. `riskSignals` are advisory and never decide a case. `reason` is 10–2,000 characters; a decision carries at most 10 requests, each up to 1,000 characters. Owners' personal data is readable here by R6 and R7 only.
- **Interaction model** — a document opens in C22; every decision via C52 with reason; "Request info" collects one or more requests; afterwards the next case opens; only R6/R7 decide. A decision is possible only on a `submitted` case and carries the case `updatedAt` and an idempotency key. The backend refuses a reviewer deciding a case for a workspace they belong to (P32), and the refusal says why. Approve and reject cannot be reversed here; reopening and a second reviewer are Q14. "The next case" is the next in the queue for the current filters; when none remains the reviewer returns to S51. The reason survives session expiry.
- **Device needs** — decide on a tablet.
- **Accessibility** — documents have text names; decision result announced. After a decision focus moves to the next case's heading and the outcome is announced with it; closing a document returns focus to that document's name.
- **Loading** — document previews load lazily. The case itself loads with a placeholder that reserves its space; each preview loads and fails independently.
- **Error** — C33; conflict → `COMPLIANCE_COPY.alreadyDecided` and reload; failed submit keeps the reason. A lapsed document link is fetched again once; an unreadable document is named as such. Each failure carries a reference.
- **Empty** — no documents → `EMPTY_STATES.caseDocuments` ("The business hasn't uploaded documents yet.").
- **Reuse** — P32.
- **Technical notes** — `reason` required by `DecideCaseInput`. (1.0.0 `tone` field on risk signals renamed `severity`.). Each decision is audit-logged with actor, decision, reason and time. The owner receives the requests and the outcome; whether the reason reaches them is Q14.

### S53 — Support lookup

Pages: P33 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Let a support agent find a workspace, user or transaction from what the customer quotes.
- **Responsibilities** — Search by email, workspace name, transaction reference or user ID; results grouped by kind with status; read-only summary (transaction facts from S24, messages from S37); no balances beyond need, never full account numbers.
- **Data requirements** — `use-support-lookup`; every lookup audit-logged. `SupportLookupResult` = `{kind: "user"; user} | {kind: "workspace"; id; name; state} | {kind: "transaction"; transaction; workspaceName}`. A query is `SUPPORT_QUERY_MIN` (3) to 100 characters; email, transaction reference and user ID match exactly, workspace name by prefix. At most `SUPPORT_RESULT_LIMIT` (50) results, with a statement when more exist. Results are not cached past the visit and no search history is kept on the device. Account numbers are masked; amounts are given only if IA7 allows.
- **Interaction model** — type, then results; choosing a result opens its read-only summary without losing the results; user results link to P31 for R7. R5 and R7 (P33); others get the not-permitted state. A search runs when the agent submits it, not on each keystroke. Why: every lookup is audit-logged with actor, query, results opened and time, and a half-typed identifier must not be logged as a lookup. More than `SUPPORT_LOOKUP_RATE_LIMIT` (60 in 5 minutes, A21) lookups are told how long to wait.
- **Device needs** — laptop and tablet.
- **Accessibility** — groups labelled; result count announced. Opening a summary moves focus to its heading; closing returns it to the result.
- **Loading** — previous results stay, marked busy.
- **Error** — C33. Each failure carries a reference.
- **Empty** — idle `EMPTY_STATES.supportLookup` ("Search by email, workspace, transaction reference or user ID."), none `supportLookupNone` ("Nothing found for that search.").
- **Reuse** — P33.
- **Technical notes** — Minimum query length `SUPPORT_QUERY_MIN`. Whether support may view transactions is IA7 (Phase 3).

## System

### S54 — Status explanation

Pages: P34, P35 and every segment `not-found.tsx` / `error.tsx` · Contracts: [C32](phase-6-interaction-contracts.md#c32--emptystate) [C33](phase-6-interaction-contracts.md#c33--errorstate) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say what went wrong in plain words and give one way forward (X10).
- **Responsibilities** — Three variants: `not-found` ("This page doesn't exist", leads home or to the dashboard); `error` ("Something went wrong on our side", Retry calling `reset()`, leads to P28); `offline` ("You're offline", Retry when `navigator.onLine` returns). A support reference on every variant.
- **Data requirements** — none; `GET /api/health` may distinguish an outage. `StatusVariant = "not-found" | "error" | "offline"`; `STATUS_PAGE_COPY: Record<StatusVariant, {title; body; primaryLabel}>`; `digest?`. The reference is required: the `digest`, the request reference (Q7), or one produced on the client when the failure happens before the backend is reached (offline) — never a stack, a query string or anything personal. The health check gives up after 5 s and is then treated as an outage.
- **Interaction model** — Retry calls `reset()`; home vs dashboard depends on the session (read on the server); offline listens for `online`. After use, Retry is unavailable for 2 s; after three failed retries the member is pointed to help and support with the reference. Offline recovers by itself with one retry when `online` fires. `not-found` answers identically for a resource that does not exist and one the member may not see.
- **Device needs** — baseline.
- **Accessibility** — heading is the page `<h1>`; reference readable and copyable. When this state replaces a page, focus moves to its `<h1>`; copying the reference is announced.
- **Loading** — none.
- **Error** — this is the error state; `global-error.tsx` renders it with no providers.
- **Empty** — not applicable.
- **Reuse** — P34, P35, all segment boundaries.
- **Technical notes** — Rendered on the server except Retry, which needs the client. The failure is reported through the services logging path with the digest, the route pattern (not the full address) and the build version — no personal data. `global-error.tsx` renders from constants only and fetches nothing.

## Open questions

- **Q1** — Which endpoint returns the member's workspace role? Blocks C59 wiring for S26, S31, S35, S38, S39, S40. Owner: backend team.
- **Q2** — Hooks not yet named: delete note/attachment (S26); rename/delete saved view (S27); statement and export download URLs (S30, S32); mark read (S34 — named `use-mark-notifications-read` in Phase 7); change role, remove member, resend/revoke invitation (S39); revoke session (S43); update/delete user (S50 — covered by `use-admin-user`); assign case (S51); change email (S42). Owner: frontend lead with the backend team (names fixed in Phase 7).
- **Q3** — `GET /api/users` is unpaged; S49 needs cursor pagination and server search. Owner: backend team.
- **Q4** — KYB/KYC field lists and owner threshold depend on OD1. Owner: compliance, bound by OD1.
- **Q5** (2.0.0) — If OD9 keeps any of S57–S62 for the production site, which v1 facts replace the sample figures, and who approves each claim (`reviewedOn`)? Owner: maintainer.
- **Q6** (2.0.0) — If OD10 keeps S64, where does the email go, what is the consent copy, and how long is it kept? Owner: maintainer.
- **Q7** (enterprise audit) — Which value in a failed response is the reference a person quotes to support, and is it also present when the failure is a timeout or a schema mismatch detected on the client? Affects every Error state and S54. Decided so far: a reference is required on every failure, including one produced before the backend is reached (validation, offline, timeout, schema mismatch); which backend value it is remains open. Owner: backend team.
- **Q8** (enterprise audit) — Does the backend scan uploaded files (S12, S26, S37, S42) for malware and readability, and how is a refused file reported — a `rejected` status with a reason, as assumed here? Owner: backend team with compliance.
- **Q9** (enterprise audit) — Export jobs (S32): after how long does the server fail a job that has not finished, and should a queued or running job be cancellable? Cancellation needs a lifecycle state Phase 1 does not have. Owner: maintainer with the backend team.
- **Q10** (enterprise audit) — Does a transfer between the workspace's own accounts count as inflow and outflow in S18, S22 and S28? Owner: maintainer.
- **Q11** (enterprise audit) — For a transaction in a currency other than its account's, does the backend supply the original amount and the rate (S24)? Depends on OD5. Owner: backend team.
- **Q12** (enterprise audit) — Who may read the audit record the backend keeps, and is any of it offered to workspace owners? No page or section reads it today. This is Phase 1 OD12, whose default is R7 all, R6 case history, R5 only the entries tied to a reference a member quoted, workspace members none in v1 (they may ask support for entries about their own workspace). Owner: maintainer.
- **Q13** (enterprise audit) — S44: are transfers between currencies in scope, and can a pending transfer be withdrawn? Bound by OD3. Owner: maintainer.
- **Q14** (enterprise audit) — Verification decisions (S09, S13, S52): can a decided case be reopened, is a second reviewer required, and is the reviewer's reason given to the owner or kept internal? Owner: compliance.
- **Q15** (enterprise audit) — Retention: how long statements (S30), verification documents (S12), support threads (S37) and a deleted user's notes, events and audit entries (S50) are kept. Bound by OD1. Owner: compliance.

## Assumptions

- **A2** — v1 is read-only; S44, S45 have no v1 data dependency.
- **A6** — All money, date and number formatting through `Intl`, single locale (`DEFAULT_LOCALE`).
- **A9** — Internal sections gate on `ADMIN` until platform roles exist.
- **A10** — The built home page is recorded as found.
- **A11** — Empty-state copy in `lib/data/empty-states.ts` (`EMPTY_STATES`); labels in feature constants.
- **A12** — Query-key factory `queryKeys`; `STALE_TIME` tiers (`live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never) with a 5-minute cache retention (`GC_TIME_MS`); section limits (`DASHBOARD_ACCOUNT_LIMIT`, `DASHBOARD_ACTIVITY_LIMIT`, `LEDGER_PAGE_SIZE`, `EXPORT_POLL_INTERVAL`, `EXPORT_MAX_RANGE_DAYS`, `REVEAL_TIMEOUT`, `SAVED_VIEW_LIMIT`, `MESSAGE_MAX_LENGTH`, `SUPPORT_QUERY_MIN`, `RUNWAY_TARGET_MONTHS`) are proposed constants fixed in Phase 7.
- **A13** — *Withdrawn in 2.0.0 (motion presets `MOTION_PRESET` — visual).*
- **A14** — *Withdrawn in 2.0.0 (named layout classes — visual).*
- **A15** — Proposed types (`Money`, `CursorPage<T>`, `Account`, `Transaction`, `VerificationCase`, …) stand until the backend publishes each module.
- **A16** — Request and freshness values: `REQUEST_TIMEOUT_MS` 15 s for a read in the browser; `MUTATION_TIMEOUT_MS` 30 s for a write, which is never re-sent automatically; `SLOW_REQUEST_MS` 10 s; server-to-backend `BACKEND_TIMEOUT_MS` 10 s (`UPLOAD_TIMEOUT_MS` 60 s for uploads); reads retry twice (`QUERY_RETRY_LIMIT`) with a 1–8 s backoff, writes never; a backend search is given `SEARCH_TIMEOUT_MS` 5 s; freshness tiers `STALE_TIME`: `live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never, with cached data kept `GC_TIME_MS` 5 minutes after its last use (0 for a revealed number); `BALANCE_STALE_AFTER` 15 minutes, or whenever a figure is served from cache after a failure or offline; `STEP_UP_GRANT_SECONDS` 5 minutes, single purpose — a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own; `SESSION_WARNING_LEAD` 2 minutes before idle expiry. Session lifetimes themselves remain OD2. Authority: Phase 1 BR19.
- **A17** — Values for the A12 limits: `DASHBOARD_ACCOUNT_LIMIT` 6, `DASHBOARD_ACTIVITY_LIMIT` 8, `DASHBOARD_PENDING_LIMIT` 10, `PALETTE_RESULT_LIMIT` 5 per scope (with 8 recent entries, cleared on sign-out), `ACCOUNT_LIST_MAX` 200, `LEDGER_PAGE_SIZE` 50, `LEDGER_MAX_PAGES` 10, `LEDGER_MAX_RANGE_DAYS` 731 (only when both `from` and `to` are given; otherwise the ledger pages back by cursor without limit), `LEDGER_QUERY_MIN_LENGTH` 2 and `LEDGER_QUERY_MAX_LENGTH` 100, `LEDGER_ACCOUNT_FILTER_MAX` 50, at most 20 `category` values, `SEARCH_DEBOUNCE_MS` 300 ms, `COUNT_EXACT_LIMIT` 10,000 (then "10,000+"), `SAVED_VIEW_LIMIT` 50 per member, `REVEAL_TIMEOUT` 30 s with a 10 s warning and extend, `SUPPORT_QUERY_MIN` 3, `SUPPORT_RESULT_LIMIT` 50, `EXPORT_MAX_RANGE_DAYS` 366; other lists page at 20, 30 or 50 as each section states. Authority: Phase 1 BR19.
- **A18** — Files: `UPLOAD_MAX_BYTES` 10 MB; PDF, JPEG and PNG only; `UPLOAD_MAX_FILES` 10 per transaction, 5 per message, 10 per verification document kind and 20 per case; `AVATAR_MAX_BYTES` 2 MB; `UPLOAD_TARGET_TTL` 10 minutes; `DOWNLOAD_LINK_TTL` 5 minutes, single use, role re-checked at issue. Drafts (notes, messages, form input interrupted by session expiry, step-up or a refused write) are kept in the open tab's memory only and never in device storage. Authority: Phase 1 BR19.
- **A19** — Jobs and expiry: `EXPORT_POLL_INTERVAL` 5 s; `EXPORT_POLL_MAX_MS` 30 minutes (the job is stated as delayed and the client stops polling); `EXPORT_RETENTION_DAYS` 7 days; `EXPORT_ACTIVE_JOB_LIMIT` 3 per member; `EXPORT_MAX_ROWS` 5,000,000; export history and `NOTIFICATION_RETENTION_DAYS` 90 days; `NOTIFICATION_POLL_INTERVAL` 60 s, the count reading "99+" beyond 99; `STATEMENT_HISTORY_MONTHS` 84; `INVITE_TTL_DAYS` 7, single use, a re-send invalidating the earlier link; `RESET_LINK_TTL` 30 minutes, single use; `CHALLENGE_TTL` 5 minutes; `TRANSFER_REVIEW_TTL` 5 minutes; a `generating` statement is rechecked every 60 s and called delayed after 24 hours. Authority: Phase 1 BR19.
- **A20** — Text and count limits: email 254; password `PASSWORD_MIN_LENGTH` 8 to `PASSWORD_MAX_LENGTH` 128; person names 100 (200 for a beneficial owner); `legalName` 200; workspace display name `DISPLAY_NAME_MAX` 80; `SAVED_VIEW_NAME_MAX` 60; thread subject 120; `NOTE_MAX_LENGTH` 2,000; `MESSAGE_MAX_LENGTH` 5,000; info request 1,000; decision reason `DECISION_NOTE_MIN` 10 to `NOTE_MAX_LENGTH` 2,000; bio 500; memo 140; `OWNER_LIMIT` 20 beneficial owners in a verification case (not workspace members with the owner role); `TEAM_MEMBER_LIMIT` 200; `INVITE_PENDING_MAX` 50; `ALERT_RULE_LIMIT` 20 per member; `THREAD_OPEN_LIMIT` 10; money inputs up to 10^15 minor units. Authority: Phase 1 BR19.
- **A21** — Throttling: `AUTH_MAX_ATTEMPTS` 5 in 15 minutes, then a 15-minute lock, for sign-in and for step-up; a code re-sent after 30 s and at most 5 times an hour; an invitation re-sent once in 10 minutes; `ENQUIRY_RATE_LIMIT` 5 in 10 minutes; `SUPPORT_LOOKUP_RATE_LIMIT` 60 in 5 minutes. The backend enforces each; the client only explains it. Authority: Phase 1 BR19.
- **A22** — Time: member-facing dates, "today", presets and periods use the workspace time zone (UTC when unset); internal sections S48–S53 use UTC; posting dates are never shifted; statement periods follow OD1.
- **A23** — Ownership and visibility: saved views, alert rules and notifications belong to the member who made them; alert rules are per member (R1 and R2 only, no shared workspace rule); a support thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1), not by other R2–R3 members; a member sees their own export jobs, R1 and R2 also see every job in the workspace, and R3 sees only their own; R4 reads notes and attachments on permitted accounts; a teammate's phone number is not given in read mode; email alerts carry no balance; making someone an owner needs step-up.
- **A24** — Other values: `CLAIM_REVIEW_MAX_AGE_DAYS` 180; `HELP_ARTICLE_LIMIT` 200 articles; runway uses a `RUNWAY_AVERAGE_MONTHS` of 3, rounds down to one decimal and stops at `RUNWAY_MAX_MONTHS` 120; `CASE_TARGET_HOURS` 24 (from K14); `EVENTS_PAGE_SIZE` 50; `PAYEE_CHANGE_HOLD_DAYS` 7; the workspace switcher becomes searchable beyond 10 memberships. Authority: Phase 1 BR19.

Every value in A16–A24 is a product decision made in the enterprise audit of 2026-10-01, not a measurement; the maintainer may change any of them in one place (the named constant). [Phase 1](phase-1-product-vision.md) BR19 is the authority for each, and the constant names are those of Phase 7 §10.

## Changes in this version

- **Retained:** S01–S54 with purpose, responsibilities, data, interaction, device needs, accessibility, loading, error, empty, reuse and technical notes; the four-state rule; shared data conventions; accessibility floor; file discipline (now a pointer to Phase 7); Q1–Q4.
- **Changed:** 22 sections renamed (table above); "Hierarchy" folded into primary information (now named in Purpose); "Responsive behavior" replaced by Device needs; **Skeleton states** and **Animation behavior** headings removed (visual) — loading still reserves space; the depth floor, density rules (row heights, type sizes, spacing caps, accent use, hover), motion defaults and the styled example section removed; `tone` fields renamed `severity` (S17, S47, S52); S31 `includePending` made explicit; A13 and A14 withdrawn.
- **Added:** S55 Public site navigation, S56 Headline figures, S57 Accounts capability, S58 Payments & approvals capability, S59 Cards capability, S60 Treasury forecast capability, S61 Reconciliation capability, S62 Pricing plans, S63 Frequently asked questions, S64 Get-started enquiry — all from the built home page, each with its OD9/OD10 facet; built-state notes on S04–S07; Q5, Q6; A10.
- **Self-audit (No Visual Prescription, tightened seed):** removed Content model and Controls from all 64 sections. Relocated first: types, schemas and copy constants → Data requirements; primary information → Purpose, then dropped as a second inventory (the Purpose now names the section's job only); behavioural rules from Controls (S08 numeric codes and password show/hide, S39 C52 before removal, S40 C07 viewer accounts, S42 email read-only) → Interaction model; sample/illustrative labelling (S56–S61) → Interaction model; S56 built values and S41 `PermissionMatrix`→C59 rule → Technical notes. Rewrote placement wording in states and fields (top, above, below, inline, row, overlay, menu, block) and the S12/S32 empty copy that pointed to position. Technical notes keep data, validation and dependencies only; component file names (incl. 1.0.0 names) now live in Phase 7; build status kept. File discipline reduced to a pointer to Phase 7.
- **Enterprise audit (2026-10-01):** no section, ID, name or field added or removed. The four-state rule now separates first load, refresh and load-more; none yet, none match and not permitted; retryable, non-retryable and offline — each error with a quotable reference. The section contract gained the read rules (schema parsing, partial results, 401/403/404), five write rules (idempotent creation, no silent overwrite, no automatic retry, session expiry, offline) and shared conventions for money correctness, pending and posted, freshness, time, limits, privacy, audit and locale; the accessibility floor gained keyboard path, focus after an outcome and announcements. Every data-bound section (S01–S03, S08–S54) now states freshness, paging and ordering, limits, role denial, conflict and double submission, session expiry, focus destinations and error kinds; S04–S07 and S55–S64 state their release checks and sample-data rules. S35 corrected to the Phase 1 matrix and P22 (accountants do not read alert rules). Added Q7–Q15 and A16–A24; owners named on Q1–Q6. **Reconciled** with Phase 1 BR19 and the canonical decisions: ledger page 50, palette 5 results per scope, help search ceiling 200, support results 50, unread count every 60 s, exact counts to 10,000, search pause 300 ms, saved views per member; constants renamed to the Phase 7 names (`EXPORT_POLL_INTERVAL`, `EXPORT_POLL_MAX_MS`, `EXPORT_RETENTION_DAYS`, `EXPORT_ACTIVE_JOB_LIMIT`, `DOWNLOAD_LINK_TTL`, `RESET_LINK_TTL`, `STEP_UP_GRANT_SECONDS`, `UPLOAD_MAX_FILES`, `HELP_ARTICLE_LIMIT`, `OWNER_LIMIT`, `DEFAULT_LOCALE`, `MUTATION_TIMEOUT_MS`); no last-write-wins (toggles and S26 annotations, notes append-only); interrupted writes re-submitted by the member; S21 parameters follow Phase 3 §11.1, now with `direction`, `category` and `attachment` and a `q` of 2–100 characters; export jobs are the member's own (R1 and R2 see all), a support thread is readable by its opener and the owners, alert rules are per member, drafts are kept in the open tab's memory only, the switcher is searchable beyond 10 memberships, every error carries a required reference, and `PENDING_ITEMS_LIMIT` is named `DASHBOARD_PENDING_LIMIT`; OD11–OD13 referenced.

## Traceability

| Section group | Sections | Pages | Flows |
|---|---|---|---|
| Shell & navigation | S01–S03 | all `(app)` and `(admin)` | F1–F4, X3, X7 |
| Marketing (specified) | S04–S07 | P01, P28 | acquisition, X1, X2 |
| Marketing (built) | S55–S64 | P01 | acquisition, X11 (OD9, OD10) |
| Authentication | S08 | P02–P06 | X1, X2, X4, X5 |
| Onboarding & verification | S09–S13 | P07, P08 | F5 |
| Dashboard | S14–S18 | P08 | F1, D1–D4 |
| Accounts & ledger | S19–S23 | P09, P10, P11, P14, P19 | F2, F3 |
| Transactions | S24–S27 | P12, P13 | F3 |
| Insights | S28–S29 | P15, P16 | F4, DOMAIN_TOOL |
| Documents | S30–S32 | P17, P18 | F4 |
| Counterparties | S33 | P19 | F3 |
| Inbox | S34–S37 | P20, P21, P22 | X7, X9 |
| Settings & team | S38–S43 | P22–P25 | X6, X8 |
| Payments | S44–S45 | P26, P27 | F6, F7 |
| Help | S46–S47 | P28 | X9 |
| Internal | S48–S53 | P29–P33 | D5–D7, F5 |
| System | S54 | P34, P35 | X10 |

Upstream: [Phase 1](phase-1-product-vision.md), [Phase 2](phase-2-experience-maps.md), [Phase 3](phase-3-information-architecture.md), [Phase 4](phase-4-page-blueprints.md). Downstream: [Phase 6](phase-6-interaction-contracts.md) (contracts per section), [Phase 7](phase-7-frontend-architecture.md) (files, hooks, keys), [Phase 8](phase-8-implementation-roadmap.md) (status of S01–S64), [Phase 9](phase-9-qa-checklist.md) (four-state, live-region and empty-copy checks).
