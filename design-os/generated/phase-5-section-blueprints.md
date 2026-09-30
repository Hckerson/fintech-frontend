# Ledgerline Design OS — Phase 5: Section Blueprints

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
| Loading | `query.isPending` (no cached data) | The section's loading placeholder | Reserves the populated space so nothing shifts; never a blocking full-page loader. |
| Error | `query.isError` with no cached data | [C33 ErrorState](phase-6-interaction-contracts.md#c33--errorstate) with a message from constants and **Retry** (`refetch`) | Never a raw stack or backend text. |
| Empty | success and `isEmpty(data)` | [C32 EmptyState](phase-6-interaction-contracts.md#c32--emptystate) with copy from `EMPTY_STATES` | Where filters exist: **none yet** (next step) vs **none match** ("Clear filters"). |
| Populated | success with data | The section body | A background refetch keeps data on screen and marks the section busy. |

If a background refetch fails while data is cached, the data stays and a [C24 Transient message](phase-6-interaction-contracts.md#c24--transient-message) says it may be out of date. Render exceptions are caught by [C58 SectionErrorBoundary](phase-6-interaction-contracts.md#c58--sectionerrorboundary).

Mutations: while pending, the trigger is disabled and `aria-busy`; validation errors are tied to their field ([C10 Field](phase-6-interaction-contracts.md#c10--field)); transport errors are stated with Retry; success is confirmed and invalidates related keys. Nothing optimistic touches money.

### One primary fact

Each section conveys one primary piece of information (DP2), named in its Purpose. How that priority is expressed is decided at build.

### Shared data conventions

- **Money** is `Money = { amountMinor: string; currency: string }` (`lib/types/money.ts`): a signed integer string in minor units plus ISO 4217. Only [C40 Amount](phase-6-interaction-contracts.md#c40--amount) formats it.
- **Query keys** are `[resource, workspaceId, scope, params]` from the factory `queryKeys` in `lib/hooks/query-keys.ts` ([Phase 7 §8.1](phase-7-frontend-architecture.md#81-query-key-factory--libhooksquery-keysts)).
- **Stale time** tiers in `STALE_TIME` (`lib/constants.ts`): `live` 15 s (balances, pending, counts), `standard` 60 s (lists, detail), `slow` 5 min (team, settings, rules), `static` (bundled `lib/data` copy).
- **Cursor pagination.** Unbounded lists return `CursorPage<T> = { items: T[]; nextCursor: string | null }`, read with `useInfiniteQuery`. Offset paging is never used against the ledger: offsets drift as rows post, so rows would be skipped or doubled.
- **Filters live in the URL.** A filtered view is a shareable link, restored by Back.

### Shared accessibility floor

- Each section is a `<section aria-labelledby>` pointing at an `<h2>`; the page title is the only `<h1>`.
- One polite `role="status"` per asynchronous section announces results ("42 transactions"), never every keystroke; `role="alert"` only for an error that blocks the task.
- Tables use `<table>` semantics (`<caption>`, `<th scope="col">`, `aria-sort`); a virtualized table exposes `aria-rowcount` and `aria-rowindex`.
- Every control is keyboard-reachable and labelled. No state is conveyed by colour alone.
- Masked account numbers read as "ending 4821".
- Motion never carries information; reduced motion is honoured.

### File discipline

File locations, names and size limits for every section are code organisation and live in [Phase 7](phase-7-frontend-architecture.md) (OD4), including the 1.0.0 file names of renamed sections.

## Shell & navigation

S01 and S02 are mounted once in the group layouts; each page uses S03 itself.

### S01 — Primary navigation

Pages: every `(app)` and `(admin)` page · Contracts: [C35](phase-6-interaction-contracts.md#c35--navitem) [C36](phase-6-interaction-contracts.md#c36--workspaceswitcher) [C18](phase-6-interaction-contracts.md#c18--avatar) [C54](phase-6-interaction-contracts.md#c54--colour-scheme-preference)

- **Purpose** — Let a member move between product areas and between workspaces without losing their place, always knowing which workspace (business) they are looking at.
- **Responsibilities** — Offer the navigation groups from `lib/data/navigation.ts` permitted for the current role; mark the current route; let the member switch workspace and, if offered, set the colour-scheme preference; keep navigation available on small screens.
- **Data requirements** — `use-workspace` (`["workspace","current"]`, `["workspace","list"]`, slow) and `use-me` (`["me"]`, slow). Nav config is static, filtered by role from C63; `(admin)` filters on platform role. `NavItem`: `id`, `label`, `href`, `icon`, `roles: WorkspaceRole[]`, `group: "primary" | "secondary" | "internal"`. `Workspace`: `id`, `name`, `role`, `verificationState`.
- **Interaction model** — Choosing an item is client navigation; the current item follows `usePathname()`. Switching workspace sets it current and invalidates keys starting with the old `workspaceId`; the member stays on the same route if the new role allows it, else goes to `/dashboard`.
- **Device needs** — every item reachable on a phone with the same groups (Phase 3 §2.4).
- **Accessibility** — `<nav aria-label>`; current item `aria-current="page"`; groups are lists with accessible group names; items keep accessible names when labels are hidden; the switcher announces "Switched to {workspace}".
- **Loading** — navigation is usable immediately from static config; only the workspace switch and the member's identity wait on data.
- **Error** — workspace list fails → the current workspace name from the session is still given, with "Couldn't load workspaces · Retry"; navigation stays usable.
- **Empty** — one workspace → nothing to switch to; the workspace is simply named. A signed-in member always has a workspace (onboarding creates one).
- **Reuse** — every `(app)` and `(admin)` page via the two layouts; the `(admin)` variant takes its own navigation config.
- **Technical notes** — Client-side only because it reads `usePathname`.

### S02 — Global utilities

Pages: every `(app)` and `(admin)` page · Contracts: [C38](phase-6-interaction-contracts.md#c38--commandpalette) [C39](phase-6-interaction-contracts.md#c39--notification-entry-point) [C37](phase-6-interaction-contracts.md#c37--usermenu) [C29](phase-6-interaction-contracts.md#c29--breadcrumbs)

- **Purpose** — Give every page one way to search, know about unread notifications and reach the member's own account actions.
- **Responsibilities** — Open the command palette; give the unread count; reach profile, security, help and sign out; expose navigation on small screens; offer breadcrumbs on detail pages.
- **Data requirements** — `use-notifications` count mode (`["notifications", workspaceId, "count"]`, live, refetch on focus); `use-me` shared with S01. Palette sources load only after it opens. `NotificationCount = { unread: number }`; member from `use-me` (`UserResponseDto`: `id`, `fullName`, `email`, `avatar`).
- **Interaction model** — Search covers transactions, accounts and counterparties. ⌘K/Ctrl+K opens the palette anywhere (hint per C28); `/` focuses it when no field has focus; the notification entry goes to P20; "Sign out" runs `use-logout` (X3) and goes to `/auth/login`.
- **Device needs** — search, notifications and sign-out reachable on a phone.
- **Accessibility** — `<header>` landmark (banner role); the notification entry's name includes the count ("Notifications, 3 unread"); count changes announced politely at most once a minute; palette is a dialog (`aria-modal`) with combobox + listbox.
- **Loading** — while the count loads no number is given; never "0".
- **Error** — count failure gives no number and no error. Why: the count is secondary; S34 carries the real error.
- **Empty** — zero unread → no count.
- **Reuse** — every `(app)` and `(admin)` page.
- **Technical notes** — Palette sources typed in `lib/data/command-sources.ts`.

### S03 — Page title & actions

Pages: P08–P25, P29–P33 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C01](phase-6-interaction-contracts.md#c01--button) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Tell the member which page they are on and what they can do from it.
- **Responsibilities** — Say which page this is and where it sits in the hierarchy; give access to the page's actions; let the member move between sub-pages where they exist.
- **Data requirements** — none of its own; a dynamic page name comes from the page's own section query. Page names from `PAGE_TITLES`; hierarchy from the sitemap; sub-pages via C23.
- **Interaction model** — each page has at most one main action; any others are secondary.
- **Device needs** — the page's main action can be reached quickly on a phone.
- **Accessibility** — `<h1>`; breadcrumbs `<nav aria-label="Breadcrumb">` with `aria-current="page"`; the secondary actions' name includes the page ("More actions for Statements").
- **Loading** — a dynamic page name not yet available is marked as loading.
- **Error** — none of its own.
- **Empty** — not applicable.
- **Reuse** — twenty-four pages.
- **Technical notes** — Rendered on the server; no client state.

## Marketing (specified)

Every claim is a reviewed constant (BR10). Nothing invented: no balances, logos, testimonials or certifications. **OD9** governs how these relate to the built sections S55–S64.

### S04 — Marketing proposition

Pages: P01 · Contracts: [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say in one sentence what Ledgerline is, and send the visitor to start or sign in.
- **Responsibilities** — State the proposition and let the visitor start or sign in, with copy from `lib/data/`. Any product illustration is labelled as illustration and never uses real customer data.
- **Data requirements** — none fetched. `MarketingHero` (type name from 1.0.0): `headline`, `subline`, `primaryCta {label, href}`, `secondaryCta {label, href}`, `visualAlt`.
- **Interaction model** — specified: start → `/auth/register` (X2), sign in → `/auth/login` (X1); signed-in visitors are offered `/dashboard`. **Built:** "Open an account" and "Book a demo" → S64 enquiry (OD10); a product preview uses a sample company with sample balances, approvals and activity (OD9 facet d).
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
- **Data requirements** — none fetched. `ValueProp`: `id`, `icon`, `title`, `body`.
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
- **Data requirements** — none fetched. `TrustClaim`: `id`, `title`, `body`, `helpSlug`, `reviewedOn` (ISO date of approval).
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
- **Data requirements** — none fetched. `FooterGroup` (type name from 1.0.0): `title`, `links: {label, href}[]`; plus `disclosure` while the product is a design study.
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
- **Interaction model** — links scroll to anchors; on small screens the navigation opens and closes on request (C65), and choosing a link closes it. "Sign in" and "Open an account" go to S64 (OD10).
- **Device needs** — all destinations and the start action available on a phone.
- **Accessibility** — labelled `<nav>` landmarks ("Primary", "Mobile"); the toggle exposes `aria-expanded` and `aria-controls` and names that change with state ("Open menu"/"Close menu").
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate for P28's public navigation.
- **Technical notes** — **Built.** Specified links to P02/P03 absent (OD10). The Payments and Cards destinations in `LEDGER_NAV` point at capabilities outside v1 (OD9 a, b).

### S56 — Headline figures

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Give a visitor a few concrete figures about the product.
- **Responsibilities** — State each figure with what it measures, and state that the figures are samples.
- **Data requirements** — none fetched. `Figure`: `id`, `value`, `label`; `METRICS` and `METRICS_NOTE` ("Sample figures for a placeholder product") in `lib/data/ledgerline/brand.ts`.
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
- **Data requirements** — none fetched. `ACCOUNTS_COPY`, `CURRENCY_ACCOUNTS: CurrencyAccount[]` (`id`, `code`, `name`, `balanceMinor: number`) in `lib/data/ledgerline/features.ts`.
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
- **Interaction model** — the sample control (C66) switches between waiting and approved states and back; the result is announced in text. It is always identified as "Interactive sample. No payment is made."
- **Device needs** — the sample works by touch and keyboard.
- **Accessibility** — the trail is an ordered list with each step's state in text; the result sentence is in a live region.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Money movement and approvals are Deferred/unspecified in v1 (OD3, OD9 a).

### S59 — Cards capability

Pages: P01 · Contracts: [C66](phase-6-interaction-contracts.md#c66--sample-interaction-control)

- **Purpose** — Describe issuing bank cards with spending controls built in.
- **Responsibilities** — Describe issuing cards with spending controls through a sample the visitor can operate; nothing the visitor does leaves the sample.
- **Data requirements** — none; local state only. `CARDS_COPY` (sample card: holder, masked number, monthly limit and spend), `CARD_CONTROLS: CardControl[]` (`id`, `label`, `detail`, `enabled`; four built: online payments, travel, cash withdrawals, receipt required).
- **Interaction model** — each spending control is a switch (C66) that changes only the sample. The card is always identified as "Illustrative card for a placeholder product."
- **Device needs** — switches operable by touch.
- **Accessibility** — `role="switch"` with `aria-checked` and a label reference per spending control.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — **Built.** Cards are a v1 non-goal (OD9 b).

### S60 — Treasury forecast capability

Pages: P01 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart)

- **Purpose** — Describe a 90-day cash forecast and how much cash can be set aside: see the next ninety days before they happen.
- **Responsibilities** — Describe sample actual and forecast cash with an expected range (C30, read-only), and three sample figures: runway, cash to set aside, projected interest.
- **Data requirements** — none fetched. `TREASURY_COPY`, `ACTUAL_SERIES`, `FORECAST_SERIES`, `FORECAST_SPREAD`, `TREASURY_FIGURES`.
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
- **Data requirements** — none fetched. `RECONCILE_COPY`, `MATCHED_ENTRIES: MatchedEntry[]` (`id`, `description`, `account`, `amountMinor`).
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
- **Data requirements** — none fetched. `Plan`: `id`, `name`, `price`, `cadence`, `summary`, `features[]`, `featured`; `PRICING_COPY.note`.
- **Interaction model** — choosing a plan goes to S64 enquiry.
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
- **Interaction model** — each question toggles its answer; others are unaffected.
- **Device needs** — baseline.
- **Accessibility** — each question is a button with `aria-expanded` and `aria-controls`; answers are in the document for find-in-page when expanded.
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate pattern for P28.
- **Technical notes** — **Built.** Several answers describe approvals, multi-currency and accounting sync "in the concept" (OD9).

### S64 — Get-started enquiry

Pages: P01 · Contracts: [C67](phase-6-interaction-contracts.md#c67--enquiry-form)

- **Purpose** — Capture a prospect's work email as the start of X11.
- **Responsibilities** — Collect one work email, validate it, confirm receipt, and state that nothing is stored or sent.
- **Data requirements** — none today (design-study state). Once OD10 chooses an intake: a mutation hook wrapping a Server Action. `Contact = z.infer<typeof contactSchema>` (`email`), schema in `lib/validations/contact.ts`; copy `CTA_COPY` (`title`, `lead`, `emailLabel`, `submit`, `success`, `invalid`, `note`).
- **Interaction model** — submit validates with Zod; invalid → field error; valid → confirmation. The email is never placed in the URL.
- **Device needs** — email keyboard and autofill on phones.
- **Accessibility** — visible label bound to the input; `aria-invalid` and `aria-describedby` on error; result in a live region.
- **Loading** — none today; with an intake, submit reports progress and is disabled.
- **Error** — invalid email → `CTA_COPY.invalid`, tied to the field. With an intake: transport failure keeps the value with Retry.
- **Empty** — not applicable.
- **Reuse** — P01; possibly P28.
- **Technical notes** — **Built.** It is the only target of "Open an account", "Book a demo", "Sign in" and "Choose" on the built page (OD10).

## Authentication

### S08 — Authentication step

Pages: P02–P06 · Contracts: [C34](phase-6-interaction-contracts.md#c34--loginform--generalized-authform-variants) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Take one authentication step per screen and get the member into the product, or back to a known state.
- **Responsibilities** — Five variants: `sign-in` (X1), `register` (X2), `forgot` (X5), `reset` (X5), `verify` (X1, X4). Each leads to its neighbours (sign-in ↔ register, sign-in → forgot) — fixing host finding H-04.
- **Data requirements** — mutations `use-login`, `use-register`, `use-request-password-reset`, `use-reset-password`, `use-verify-challenge`. Small forms use `useState` + Zod `safeParse`. Values from `lib/validations/auth.ts` composing `LoginDto`/`RegisterDto`: `SignInValues {email, password}`, `RegisterValues {name, email, password}`, `ForgotValues {email}`, `ResetValues {password, confirm, token}`, `VerifyValues {code}`; `PASSWORD_MIN_LENGTH`.
- **Interaction model** — validate on blur, then on submit. Success: sign-in → `next`, `/dashboard` or `/auth/verify`; register → `/onboarding`; forgot → same confirmation for every email; reset → sign-in with a message. Wrong credentials → `INVALID_CREDENTIALS` at form level, never naming a field. Codes accept numeric entry; the password can be shown and hidden (C02).
- **Device needs** — password managers, autofill, passkeys and one-time-code autofill work on phones; usable in landscape with the keyboard open.
- **Accessibility** — `<form aria-labelledby>`; input `id`/`name` from constants (H-03); every input has the right `type` and `autocomplete`; errors via `aria-describedby`; form error `role="alert"`; code field `autocomplete="one-time-code"`; focus to the first invalid field on submit; paste allowed everywhere (WCAG 3.3.8).
- **Loading** — submit reports progress, `aria-busy`, fields read-only.
- **Error** — Zod messages from constants; `REQUEST_FAILED`; `SESSION_UNAVAILABLE` with sign-in link; expired reset token → `AUTH_COPY.resetExpired` with "Request a new link".
- **Empty** — not applicable; forgot/reset confirmations are success states (`AUTH_COPY`).
- **Reuse** — five pages; `verify` inside C55 for step-up.
- **Technical notes** — Sign-in is **built** (C34, existing sign-in form); the other four variants are specified.

## Onboarding & verification

Every section reads one `VerificationCase` (`lib/types/verification.ts`): `id`, `workspaceId`, `state` (`not_started | in_progress | submitted | needs_info | approved | rejected`), `business`, `owners`, `documents`, `requests: InfoRequest[]`, `updatedAt`; via `use-verification-case` (`["verification", workspaceId]`, live — a decision should reach the owner without reload). Field lists are the jurisdiction-neutral minimum in `lib/data/verification-fields.ts` so answering OD1 changes data, not code.

### S09 — Verification progress

Pages: P07 · Contracts: [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Tell the owner where they are in verification ("Step 2 of 4 · Beneficial owners") and let them move between steps.
- **Responsibilities** — Derive each step's state (todo, current, done, attention) from the case; route via `?step=`; lock steps once `submitted` unless sent back as `needs_info`; submit the case for review.
- **Data requirements** — `use-verification-case`; state by pure function `lib/utils/onboarding-progress.ts`. `OnboardingStep`: `id: business | owners | documents | review`, `label`, `state`. Definitions in `lib/data/onboarding-steps.ts`.
- **Interaction model** — choosing a completed or current step changes `?step=`; future steps unavailable until prior steps are valid; Submit (C01) asks for confirmation via C52 ("You can't edit details while we review them") then sets `submitted`.
- **Device needs** — current step and total always discoverable on a phone.
- **Accessibility** — `<nav aria-label="Verification steps">` with `<ol>`; `aria-current="step"`; each step's state in its name ("Business details, complete").
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 with Retry; S10–S12 do not render until the case loads.
- **Empty** — `not_started` is a real state: step 1 current with `EMPTY_STATES.verificationStart` ("Tell us about your business to open your accounts. It takes about 10 minutes.").
- **Reuse** — P07; C50 read-only in S52.
- **Technical notes** — The progress function is pure and property-tested.

### S10 — Business details form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Capture the legal identity of the business, led by its legal name.
- **Responsibilities** — Edit `BusinessDetails`, save drafts, validate, surface any `InfoRequest` about these fields.
- **Data requirements** — initial values from the case; save via `use-update-verification-case` (PATCH `business`), invalidates the case. Schema `lib/validations/business-details.ts`. `BusinessDetails`: `legalName`, `tradingName | null`, `entityType`, `registrationNumber`, `incorporatedOn` (ISO date), `country` (ISO 3166-1 alpha-2), `address: PostalAddress`, `website | null`.
- **Interaction model** — explicit save, no autosave. Why: registration data is legal record, so the owner decides when it is written. Leaving with unsaved changes asks via C52. Form library LD3 pending.
- **Device needs** — address and organisation autofill on phones.
- **Accessibility** — address in a `<fieldset>`/`<legend>`; `autocomplete` (`organization`, `address-line1`, …); error summary linking to fields.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — field errors from Zod; save failure → message with Retry, values kept.
- **Empty** — nothing entered yet; each field says what it needs.
- **Reuse** — P07; read-only summary shared with S52.
- **Technical notes** — none beyond the data requirements.

### S11 — Beneficial owners form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C02](phase-6-interaction-contracts.md#c02--iconbutton) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Record everyone who owns or controls a large enough share, always telling the owner how much ownership is declared ("75% of ownership declared").
- **Responsibilities** — List, add, edit, remove owners; keep the total ≤ 100%; mark the applicant.
- **Data requirements** — from the case; save PATCH `owners`; schema `lib/validations/beneficial-owner.ts` with sum ≤ 10000. `BeneficialOwner`: `id` (nanoid while draft), `fullName`, `dateOfBirth`, `nationality`, `ownershipBasisPoints` (integer 0–10000), `isController`, `address`.
- **Interaction model** — each owner editable; remove via C52; the mandatory-owner threshold is a constant set by OD1.
- **Device needs** — baseline.
- **Accessibility** — each owner a `<fieldset>` (legend = name or "Owner 2"); total as `role="meter"` with value; removal announced and focus moved to the next owner or to the add action.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — sum above 100% is a form-level error tied to the declared total; save failure → message.
- **Empty** — `EMPTY_STATES.owners` ("Add each person who owns 25% or more, or who controls the business." — threshold interpolated).
- **Reuse** — P07; read-only in S52.
- **Technical notes** — Ownership is integer basis points so the sum check is exact.

### S12 — Document upload

Pages: P07 · Contracts: [C49](phase-6-interaction-contracts.md#c49--file-upload) [C26](phase-6-interaction-contracts.md#c26--meter) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Collect the documents the review requires, make clear which one is still missing next, and give each one's status.
- **Responsibilities** — List required kinds; accept uploads; report progress and review status; allow replacement when asked.
- **Data requirements** — list from the case; `use-upload-document` (Server Action returns a signed target); success invalidates the case; MIME types and max size are constants. `VerificationDocument`: `id`, `kind`, `fileName`, `sizeBytes`, `status: uploading | uploaded | accepted | rejected`, `rejectionReason | null`, `uploadedAt`; required kinds in `lib/data/verification-fields.ts`.
- **Interaction model** — client checks type and size first, then uploads with progress; an upload in progress can be cancelled; rejected documents give the reason and can be replaced.
- **Device needs** — camera capture or file picker on phones; no drag required.
- **Accessibility** — the upload control is a labelled file input; progress `role="progressbar"`; status changes announced ("Passport uploaded", "Rejected: image unreadable").
- **Loading** — a loading placeholder that reserves its space; each upload reports its own progress.
- **Error** — too large/wrong type → rejected before upload with the reason; failed upload → that document keeps a Retry; case failure → C33.
- **Empty** — `EMPTY_STATES.documents` ("Upload a clear photo or PDF of each required document.").
- **Reuse** — P07; C49 behaviour shared with S26, S37.
- **Technical notes** — Upload goes straight to the signed target; the case is the only source of document status.

### S13 — Verification status notice

Pages: P07, P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Tell the owner in one sentence what verification is waiting on and what to do next.
- **Responsibilities** — Map case state to severity, message and next action ("Continue verification", "Respond to request"); list open `InfoRequest`s when `needs_info`; render nothing once `approved` on P08.
- **Data requirements** — `use-verification-case`. `InfoRequest`: `id`, `message`, `fieldRef | null`, `createdAt`. Copy `VERIFICATION_COPY`.
- **Interaction model** — the next action → `/onboarding?step=<step of first open request>`. Cannot be dismissed while `needs_info` or `rejected`. Why: those states block the accounts.
- **Device needs** — baseline.
- **Accessibility** — state in text; not a live region on page load (it is content, not a status change).
- **Loading** — renders nothing until the case loads (no placeholder on P08).
- **Error** — silent on P08 (S17 carries the retry); on P07, S09 owns it.
- **Empty** — `approved` on P08 renders nothing.
- **Reuse** — P07, P08 (informational variant for R2).
- **Technical notes** — Reads the same `use-verification-case` query as S09–S12; no query of its own.

## Dashboard

### S14 — Cash position

Pages: P08 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C31](phase-6-interaction-contracts.md#c31--trend-summary)

- **Purpose** — Answer F1 in one glance: how much cash the business has now — total available balance per currency.
- **Responsibilities** — Total available balance across permitted accounts, per currency; today's net movement and a 30-day trend per total. Never add different currencies.
- **Data requirements** — `use-accounts` (aggregate, live, refetch on focus). `CashPosition`: `currency`, `available`, `current`, `netToday`, `trend: {date, closing}[]`, `asOf`.
- **Interaction model** — choosing the total goes to P09; the trend exposes date and closing balance per point on focus or pointer.
- **Device needs** — the total is readable on a phone without interacting; the trend has a text equivalent.
- **Accessibility** — each total read as "Available balance, GBP, …, as of …"; trend has a text summary.
- **Loading** — a loading placeholder per currency that reserves its space.
- **Error** — C33 with Retry. Never reports "0.00" in error. Why: a zero shown in error is the most damaging wrong figure possible.
- **Empty** — no permitted accounts: `EMPTY_STATES.cashPosition` ("No accounts to show yet. Accounts appear here once verification is approved."), linking R1 to P07.
- **Reuse** — P08 (not D4).
- **Technical notes** — LCP-critical, server-prefetched.

### S15 — Account summary

Pages: P08 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — List every account with its available balance so the member can jump into a ledger.
- **Responsibilities** — Up to `DASHBOARD_ACCOUNT_LIMIT` accounts sorted by balance, each identified by name and masked number with its state and available balance; lead to the full list.
- **Data requirements** — `use-accounts`. `Account`: `id`, `name`, `kind`, `last4`, `currency`, `available`, `current`, `state`, `openedAt`.
- **Interaction model** — each account → `/accounts/[accountId]`; the full list (P09) is one step away.
- **Device needs** — every account's balance readable on a phone.
- **Accessibility** — a list; each item a link whose name includes account name and balance.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 with Retry.
- **Empty** — `EMPTY_STATES.accounts` ("No accounts yet.").
- **Reuse** — P08.
- **Technical notes** — Shares the `use-accounts` query with S14.

### S16 — Recent activity

Pages: P08 · Contracts: [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Give the last few transactions across accounts, each with its signed amount and counterparty, so nothing new goes unseen.
- **Responsibilities** — Latest `DASHBOARD_ACTIVITY_LIMIT` (8) including pending; lead to full search.
- **Data requirements** — `use-transactions` (limit variant). `Transaction`: `id`, `accountId`, `postedAt | null`, `createdAt`, `amount: Money`, `status`, `description`, `counterparty {id, name} | null`, `category | null`, `flagged`, `hasAttachments`, `reference`.
- **Interaction model** — choosing a transaction opens P12 without leaving the dashboard (intercepted route, C22); full search (P11) is one step away.
- **Device needs** — each transaction opens by touch.
- **Accessibility** — pending status in text; amounts read with sign.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.recentActivity` ("No transactions yet. New activity shows up here as soon as it posts.").
- **Reuse** — P08.
- **Technical notes** — none beyond the data requirements.

### S17 — Pending items

Pages: P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Collect everything waiting on the member or the bank into one short list, led by the most urgent item.
- **Responsibilities** — Merge, ordered by urgency: pending transactions (count and total per account); exports `ready` or `failed`; verification requests (`needs_info`).
- **Data requirements** — `use-transactions {status: pending}`, `use-exports`, `use-verification-case`, all live. Loading until all settle; error only if all fail. `PendingItem`: `id`, `kind: pending_transactions | export_ready | export_failed | verification_request`, `title`, `detail`, `href`, `severity`, `at`; derived in `lib/utils/pending-items.ts`.
- **Interaction model** — each item links to where it is resolved (P11 pending, P18, P07).
- **Device needs** — baseline.
- **Accessibility** — severity in text; list semantics.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — complete failure → C33; partial failure keeps the loaded items and tells the member "Some items couldn't load · Retry".
- **Empty** — `EMPTY_STATES.pendingItems` ("Nothing waiting on you.").
- **Reuse** — P08 (D1–D3).
- **Technical notes** — Merge is a pure function. (1.0.0 `tone` field renamed `severity`.)

### S18 — Cash flow over time

Pages: P08 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart) [C23](phase-6-interaction-contracts.md#c23--tabs) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Give money in against money out over time, led by the net for the range, so the owner sees direction as well as level.
- **Responsibilities** — Inflow, outflow and net for the chosen range (30 days, 90 days, 12 months) with range totals.
- **Data requirements** — `use-cash-flow` (standard); server-aggregated series only. `CashFlowSeries`: `currency`, `granularity`, `points: {periodStart, inflow, outflow, net}[]`, `totals`.
- **Interaction model** — the range is chosen with C23 and kept in the URL; each point exposes exact amounts via C40 on focus or pointer. Minor units convert to numbers for plotting only after checking `Number.MAX_SAFE_INTEGER`; labels always come from the original strings.
- **Device needs** — totals and a text or table equivalent are usable on a phone.
- **Accessibility** — summary sentence plus an accessible data table (Q-012); chart points keyboard-navigable.
- **Loading** — a loading placeholder that reserves the populated space.
- **Error** — C33 with Retry.
- **Empty** — `EMPTY_STATES.cashFlow` ("Not enough activity to chart yet.").
- **Reuse** — P08 (D1, D2).
- **Technical notes** — LD1 pending; lazy-loaded.

## Accounts & ledger

### S19 — Account list

Pages: P09 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C15](phase-6-interaction-contracts.md#c15--table-family) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C40](phase-6-interaction-contracts.md#c40--amount) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Every account the member can see, with its available balance and state, as the way into each ledger.
- **Responsibilities** — Let the member sort accounts, grouped by currency when more than one; give each account's available and current balance, state and masked number; lead into each ledger.
- **Data requirements** — `use-accounts`. `Account` (S15).
- **Interaction model** — choose → `/accounts/[accountId]`; sort order kept in the URL; revealing a number (C42) starts step-up (X4) and discloses the full number for `REVEAL_TIMEOUT` seconds.
- **Device needs** — name, masked number and available balance for every account on a phone.
- **Accessibility** — table semantics with `aria-sort`; state in text.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.accounts`; R1 gets a link to P07 while not `approved`.
- **Reuse** — P09.
- **Technical notes** — Server-prefetched.

### S20 — Account overview

Pages: P10 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Identify the account whose ledger the member is reading and state its available balance.
- **Responsibilities** — Give name, available and current balance "as of" a time, hold amount and state; let the member reveal and copy the masked account and routing numbers.
- **Data requirements** — `use-account`. `AccountDetail` = `Account` + `routingNumberMasked`, `balanceAsOf`, `holdAmount`.
- **Interaction model** — reveal needs step-up; the backend audit-logs it; copy copies what is disclosed (masked unless revealed); `frozen`/`closed` are stated with an explanation from `ACCOUNT_STATE_COPY`.
- **Device needs** — baseline.
- **Accessibility** — balances labelled "Available balance" and "Current balance"; reveal announces the change and the re-mask.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — 404 → segment `not-found`; other → C33.
- **Empty** — not applicable.
- **Reuse** — P10.
- **Technical notes** — Server-prefetched.

### S21 — Ledger filters

Pages: P10, P11, P14, P19 · Contracts: [C46](phase-6-interaction-contracts.md#c46--filter-set) [C47](phase-6-interaction-contracts.md#c47--active-filter) [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Narrow the ledger to what the member is looking for, and keep that in the URL.
- **Responsibilities** — Narrow by search text, date range, status, direction, amount range, category and flagged; make active filters known, each removable on its own; save the set as a view; clear all.
- **Data requirements** — `use-saved-views` for saved views. `LedgerFilters` (Zod over `URLSearchParams`): `q?`, `from?`, `to?`, `status?`, `direction?`, `minAmountMinor?`, `maxAmountMinor?`, `category?`, `flagged?`, `accountId?`. `SavedView`: `id`, `name`, `filters`, `createdAt`.
- **Interaction model** — every change updates the URL; S23 reacts to the URL only. Why: decoupled sections, shareable links. Removing an active filter clears only it. Saving a view asks for a name (C21). `/` focuses search.
- **Device needs** — every filter available on a phone.
- **Accessibility** — every filter labelled; result count announced once per change; invalid link params reported in text ("1 filter in this link was ignored").
- **Loading** — filters are usable immediately; saved views load when requested.
- **Error** — invalid params dropped with a notice; saved views that fail to load are reported with Retry when requested; save failure → message.
- **Empty** — no saved views → `EMPTY_STATES.savedViewsMenu` ("Save filters you use often.").
- **Reuse** — P10, P11 (search variant), P14 (flagged fixed), P19.
- **Technical notes** — URL parsing through the `LedgerFilters` schema only; unknown params dropped.

### S22 — Ledger summary

Pages: P10 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Summarise the filtered ledger — in, out, net and count.
- **Responsibilities** — Totals for exactly S21's filters; opening and closing balance when the date range is bounded.
- **Data requirements** — `use-ledger-summary` (live); server-computed, never summed from loaded rows. `LedgerSummary`: `currency`, `inflow`, `outflow`, `net`, `count`, `opening | null`, `closing | null`.
- **Interaction model** — read only; the count equals S23's range total.
- **Device needs** — baseline.
- **Accessibility** — each figure labelled.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — zero matches give real zeros; S23 reports "none match".
- **Reuse** — P10.
- **Technical notes** — Keyed on the same `LedgerFilters` as S23.

### S23 — Ledger entries

Pages: P10, P11, P14, P19 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C25](phase-6-interaction-contracts.md#c25--pagination) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — List the transactions matching the filters, each with its signed amount, fast at 5 million rows.
- **Responsibilities** — Let the member recognise each matching transaction and its signed amount, and follow the running balance on P10 (withheld or labelled unfiltered when filters exclude transactions, Q-214). Open detail. Keep position when returning.
- **Data requirements** — `use-transactions` infinite with `maxPages`; `keepPreviousData` on filter change. `Transaction` + `runningBalance | null`; read as `CursorPage<Transaction>`. Per transaction: date, description with counterparty, category, status, signed amount, flagged, has attachments; running balance on P10 only.
- **Interaction model** — nearing the end fetches the next page; an explicit load-more action is the keyboard/screen-reader equivalent. Enter or click opens P12 without leaving the list (intercepted route, P10/P11). ↑/↓ move the active transaction; Enter opens; `F` toggles flag on the active transaction; each transaction can also be flagged or have its link copied from its actions (C20).
- **Device needs** — on a phone each transaction's amount, counterparty/description, date and status remain readable; transactions open by touch; no horizontal page scroll.
- **Accessibility** — `<table>` with `<caption>` summarising filters; `aria-rowcount` from S22 (or -1); `aria-rowindex` per row; `aria-sort`; one status message "Showing 100 of 4,210 transactions"; debits read with a minus; focus returns to the originating row when detail closes.
- **Loading** — first load: a placeholder reserves the populated space; filter change keeps previous results with `aria-busy`; loading the next page reserves space for it.
- **Error** — first-load → C33; next-page failure keeps loaded results and tells the member "Couldn't load more · Retry".
- **Empty** — none yet `EMPTY_STATES.ledger` ("No transactions on this account yet."); none match `EMPTY_STATES.ledgerFiltered` ("No transactions match these filters." + Clear filters); flagged `EMPTY_STATES.flagged` ("Nothing flagged. Flag a transaction to come back to it here.").
- **Reuse** — P10, P11, P14, P19; the pattern for S49.
- **Technical notes** — Virtualized and cursor-paginated; LD2 required at this scale; the virtualizer uses a constant size estimate (Phase 7).

## Transactions

P12 serves S24–S26 both as a standalone page and through the intercepted route that keeps the originating list open.

### S24 — Transaction detail

Pages: P12 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C12](phase-6-interaction-contracts.md#c12--status-label) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Everything known about one transaction, led by its signed amount.
- **Responsibilities** — Tell the member everything the bank and the workspace know about one transaction, starting with its signed amount; let the member copy the link and the reference.
- **Data requirements** — `use-transaction` (standard). `TransactionDetail` = `Transaction` + `bankDescriptor`, `method`, `accountName`, `accountLast4`, `events`, `notes`, `attachments` (amount, status, description, counterparty, account, created and posted dates, reference, category, flag, raw bank descriptor).
- **Interaction model** — when opened from a list (C22), Escape or close returns to the list and restores focus, and the member can move to the full page; "Copy link" copies `/transactions/[id]`; counterparty → P19; `reversed` links to the original transaction (Q-066).
- **Device needs** — baseline.
- **Accessibility** — when opened from a list it is a labelled dialog; amount with sign and status in text.
- **Loading** — facts already known from the list are available immediately; the rest load with placeholders that reserve their space.
- **Error** — not found → segment `not-found`; other → C33.
- **Empty** — not applicable.
- **Reuse** — P12 (page and intercepted route); facts reused read-only in S53.
- **Technical notes** — One `use-transaction` query serves S24, S25 and S26.

### S25 — Transaction lifecycle

Pages: P12 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Tell how the transaction moved through its lifecycle, led by its current state and when it was reached.
- **Responsibilities** — Ordered events — created, pending, posted, returned, reversed, failed, note added, attachment added, flagged — each with time and actor.
- **Data requirements** — from `use-transaction`. `TransactionEvent`: `id`, `kind`, `at`, `actor {id, name} | null`, `detail | null`.
- **Interaction model** — read only.
- **Device needs** — baseline.
- **Accessibility** — ordered list; each event's kind in text; times include zone on request.
- **Loading / Error** — shares S24's.
- **Empty** — always at least "Created".
- **Reuse** — P12.
- **Technical notes** — Reads `TransactionDetail.events`; no query of its own.

### S26 — Notes & attachments

Pages: P12 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C49](phase-6-interaction-contracts.md#c49--file-upload) [C01](phase-6-interaction-contracts.md#c01--button) [C09](phase-6-interaction-contracts.md#c09--switch) [C06](phase-6-interaction-contracts.md#c06--select) [C59](phase-6-interaction-contracts.md#c59--permissiongate)

- **Purpose** — Let the member annotate a transaction for their books, knowing the latest note and whether a receipt is attached.
- **Responsibilities** — Set category, toggle flag, add/delete notes, upload/download/delete receipts. Viewers read only.
- **Data requirements** — `use-update-transaction`, `use-upload-attachment`; delete hooks per Q2. `TransactionNote`: `id`, `body`, `author`, `createdAt`. `Attachment`: `id`, `fileName`, `mimeType`, `sizeBytes`, `uploadedAt`, `uploadedBy`. `TransactionAnnotationInput`: `category?`, `flagged?`, `note?`.
- **Interaction model** — category and flag save on change, optimistic with rollback (annotations, not money); notes save on submit or ⌘/Ctrl+Enter; deletes confirm via C52; C59 withholds every annotation action from R4; a note changed underneath the member is surfaced (concurrent edit).
- **Device needs** — photograph a receipt on a phone and attach it.
- **Accessibility** — every control labelled; save results announced.
- **Loading** — a placeholder reserves its space until the transaction loads; each upload reports progress.
- **Error** — rollback → message with Retry; failed upload → that attachment keeps a Retry; draft kept on failure and across session expiry (X4).
- **Empty** — `EMPTY_STATES.notes` ("No notes yet."), `EMPTY_STATES.attachments` ("Attach a receipt or invoice.").
- **Reuse** — P12.
- **Technical notes** — Optimistic updates limited to category and flag; rollback restores the cached `TransactionDetail`.

### S27 — Saved views list

Pages: P13 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Manage the member's saved filter sets, known by their names.
- **Responsibilities** — Let the member recognise each view by name and by what it filters; open, rename, delete, set default.
- **Data requirements** — `use-saved-views` (slow). `SavedView` (name, filters, match count when known, created date) + `filtersSummary` from `lib/utils/describe-filters.ts`.
- **Interaction model** — open → `/transactions?<filters>`; rename without leaving the list; delete via C52.
- **Device needs** — baseline.
- **Accessibility** — rename field labelled; deletion announced.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; rename conflict is a field error.
- **Empty** — `EMPTY_STATES.savedViews` ("No saved views. Filter the ledger, then choose Save view."), link to P11.
- **Reuse** — P13.
- **Technical notes** — Rename and delete hooks pending (Q2).

## Insights

### S28 — Period comparison

Pages: P15 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C30](phase-6-interaction-contracts.md#c30--chart) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C15](phase-6-interaction-contracts.md#c15--table-family)

- **Purpose** — Compare two periods so a finance lead can explain what changed, led by the net change.
- **Responsibilities** — Pick periods A and B; inflow, outflow, net per period with deltas; change by category and top counterparties.
- **Data requirements** — `use-compare-periods` (standard). `PeriodComparison`: `currency`, `a`, `b` (`PeriodTotals {from, to, inflow, outflow, net}`), `byCategory: {category, a, b, deltaBasisPoints | null}[]`, `topCounterparties`.
- **Interaction model** — the member picks both periods (C48); B can be set to the previous period in one step; choosing a category → P11 filtered to category and period B.
- **Device needs** — both periods selectable and results readable as text on a phone.
- **Accessibility** — chart text alternative; deltas in words ("up 4.2%").
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.compare` ("No activity in either period. Try a wider range.").
- **Reuse** — P15.
- **Technical notes** — LD1.

### S29 — Runway calculator

Pages: P16 · Contracts: [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C40](phase-6-interaction-contracts.md#c40--amount) [C30](phase-6-interaction-contracts.md#c30--chart) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Estimate how many months current cash lasts at a given burn — months of runway, always with its assumptions.
- **Responsibilities** — Pre-fill cash and average net burn; allow overrides plus expected monthly inflow; project months and run-out date; label everything as an estimate, never a bank forecast.
- **Data requirements** — `use-accounts`, `use-cash-flow`; pure `lib/utils/runway.ts`. `RunwayInput`: `cashMinor`, `monthlyBurnMinor`, `monthlyInflowMinor`, `currency`. `RunwayResult`: `months | null`, `runsOutOn | null`, `series`.
- **Interaction model** — recalculates on change; the member can reset to actual figures; overrides in the URL.
- **Device needs** — numeric keyboard; result readable without the chart.
- **Accessibility** — result announced politely after edits settle.
- **Loading** — inputs usable immediately.
- **Error** — defaults failed → inputs start empty and the member is told "Couldn't load your balances. Enter figures to estimate."
- **Empty** — `months: null` → `RUNWAY_COPY.notBurning` ("Your inflow covers your spending at these figures.").
- **Reuse** — P16.
- **Technical notes** — The projection is a pure function of `RunwayInput`.

## Documents

### S30 — Statement list

Pages: P17 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Download the monthly statement for any account and month.
- **Responsibilities** — Statements per account and month with period, opening and closing balance, availability; filter by account and year; download PDF.
- **Data requirements** — `use-statements` (slow); download URL fetched on click. `Statement`: `id`, `accountId`, `accountName`, `periodStart`, `periodEnd`, `opening`, `closing`, `status: available | generating`, `generatedAt | null`.
- **Interaction model** — account and year choices are kept in the URL; download opens the signed URL; `generating` is stated and download is unavailable.
- **Device needs** — downloads work on phones.
- **Accessibility** — download actions name the account and month.
- **Loading** — a loading placeholder that reserves its space; each download reports progress while its link is fetched.
- **Error** — C33; download link failure → message with Retry.
- **Empty** — `EMPTY_STATES.statements` ("Your first statement is ready after the end of your first full month.").
- **Reuse** — P17.
- **Technical notes** — Download URL hook pending (Q2).

### S31 — Export builder

Pages: P18 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C06](phase-6-interaction-contracts.md#c06--select) [C07](phase-6-interaction-contracts.md#c07--checkbox) [C08](phase-6-interaction-contracts.md#c08--radiogroup) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Start an export for a chosen period, accounts and format, knowing what it will include before it starts.
- **Responsibilities** — Choose date range, accounts, format (CSV or OFX-style, `EXPORT_FORMATS`), columns, and whether pending is included (default posted only); submit as a job.
- **Data requirements** — `use-create-export`. `CreateExportInput`: `from`, `to`, `accountIds` (≥ 1), `format`, `columns`, `includePending`.
- **Interaction model** — submit creates a job and moves focus to it in S32; it never waits for the file. Withheld from R4 (C59).
- **Device needs** — baseline.
- **Accessibility** — groups in fieldsets; the created job announced.
- **Loading** — usable immediately.
- **Error** — Zod field errors (e.g. range longer than `EXPORT_MAX_RANGE_DAYS`); transport → message.
- **Empty** — no accounts → `EMPTY_STATES.accounts`.
- **Reuse** — P18.
- **Technical notes** — `includePending` made explicit in 2.0.0 from the Phase 2 assumption.

### S32 — Export jobs

Pages: P18 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C17](phase-6-interaction-contracts.md#c17--progress-indicator) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Track export jobs and download finished files, led by the newest job's state.
- **Responsibilities** — Jobs with period, format, state, requester, expiry; poll while any job is `queued`/`running`; download `ready`.
- **Data requirements** — `use-exports` with `refetchInterval` while active, off in background tabs. `ExportJob`: `id`, `status`, `from`, `to`, `format`, `accountIds`, `requestedBy`, `createdAt`, `expiresAt | null`, `rowCount | null`, `failureReason | null`.
- **Interaction model** — a `ready` job can be downloaded; a `failed` job gives its reason and can be tried again with the same input; an `expired` job can be created again, prefilled.
- **Device needs** — baseline.
- **Accessibility** — state changes announced once ("Export ready").
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 on first load; failed polls keep data and retry quietly.
- **Empty** — `EMPTY_STATES.exports` ("No exports yet. Choose a period to create one.").
- **Reuse** — P18; S17 reads the same data.
- **Technical notes** — Poll interval `EXPORT_POLL_MS`; download URL hook pending (Q2).

## Counterparties

### S33 — Counterparty summary

Pages: P19 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C40](phase-6-interaction-contracts.md#c40--amount) [C45](phase-6-interaction-contracts.md#c45--metric)

- **Purpose** — Who this counterparty is and how much has moved with them, led by the total paid in the period.
- **Responsibilities** — Identify the counterparty (name, identity mark, known identifiers); give first/last dates and totals in and out over 12 months.
- **Data requirements** — `use-counterparty` (standard). `Counterparty`: `id`, `name`, `kind`, `identifiers`, `firstSeenAt`, `lastSeenAt`, `totals {inflow, outflow, count}`, `currency`.
- **Interaction model** — read only; S23 on the page gets `counterpartyId` as a locked filter.
- **Device needs** — baseline.
- **Accessibility** — figures labelled.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — not found → `not-found`; other → C33.
- **Empty** — not applicable (a counterparty exists only because transactions do).
- **Reuse** — P19.
- **Technical notes** — `counterpartyId` is a locked filter on S23.

## Inbox

### S34 — Notification feed

Pages: P20 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C03](phase-6-interaction-contracts.md#c03--textlink) [C25](phase-6-interaction-contracts.md#c25--pagination) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Every alert and system notice for the member, newest first, with unread items known.
- **Responsibilities** — Kind, message, time, read state; mark one/all read; link to the subject; unread filter.
- **Data requirements** — `use-notifications` (cursor), `use-mark-notifications-read`. `Notification`: `id`, `kind: low_balance | large_transaction | statement_ready | export_ready | verification_needs_info | member_joined`, `title`, `body`, `href | null`, `createdAt`, `readAt | null`.
- **Interaction model** — choosing marks read and follows `href`; "Mark all as read" asks nothing (reversible via the filter); unread toggle in the URL.
- **Device needs** — baseline.
- **Accessibility** — read state in text; relative times carry absolute time as accessible text.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; failed mark-read reverts with a message.
- **Empty** — `EMPTY_STATES.notifications` ("You're all caught up."), `notificationsUnread` ("No unread notifications.").
- **Reuse** — P20.
- **Technical notes** — Mark-read hook named in Phase 7 (Q2).

### S35 — Alert rules

Pages: P22 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select)

- **Purpose** — Owners and finance leads choose which events alert them, at what thresholds.
- **Responsibilities** — Toggle each alert kind; thresholds (low balance per account, large transaction); delivery (in-app always, email optional).
- **Data requirements** — `use-alert-rules`, `use-update-alert-rules` (slow). Schema `lib/validations/alert-rule.ts`. `AlertRule`: `id`, `kind`, `enabled`, `threshold | null`, `accountId | null`, `channels`.
- **Interaction model** — enabling a rule makes its threshold editable; explicit save; read-only for R3, withheld from R4 (C59).
- **Device needs** — numeric keyboard for thresholds.
- **Accessibility** — each rule a labelled group; a newly editable threshold is reachable by focus order, not signalled by motion.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 on load; field errors and a message on save.
- **Empty** — not applicable: kinds are fixed and always listed, off by default (P22 offers starter values).
- **Reuse** — P22.
- **Technical notes** — Validation through `lib/validations/alert-rule.ts`.

### S36 — Thread list

Pages: P21 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C11](phase-6-interaction-contracts.md#c11--searchinput)

- **Purpose** — The member's secure threads with support, led by threads with unread replies.
- **Responsibilities** — Subject, last excerpt and time, unread, status (open/closed); search subjects; start a thread.
- **Data requirements** — `use-threads`. `Thread`: `id`, `subject`, `status`, `lastMessage {excerpt, at, author}`, `unread`.
- **Interaction model** — choose → `/messages/[threadId]`; starting a thread opens S37 in compose mode; on larger screens the threads stay reachable while one is open (layout route).
- **Device needs** — list and a thread each fully usable on a phone.
- **Accessibility** — unread and status in text.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.threads` ("No messages. Start a conversation with our support team."), `threadsFiltered` ("No threads match that search.").
- **Reuse** — P21.
- **Technical notes** — none beyond the data requirements.

### S37 — Conversation

Pages: P21 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C18](phase-6-interaction-contracts.md#c18--avatar) [C49](phase-6-interaction-contracts.md#c49--file-upload)

- **Purpose** — Read and reply within one thread.
- **Responsibilities** — Messages in order with author, time, attachments; compose and send with attachments; state when closed.
- **Data requirements** — `use-thread`, `use-send-message`. `Message`: `id`, `threadId`, `author {id, name, avatarUrl, isStaff}`, `body`, `attachments`, `sentAt`. `SendMessageInput`: `body` (1–`MESSAGE_MAX_LENGTH`), `attachmentIds`.
- **Interaction model** — ⌘/Ctrl+Enter sends; earlier messages load on request; replying is unavailable in closed threads (`MESSAGE_COPY.closed`); drafts persist per thread locally.
- **Device needs** — attachments from files or camera; replying works with the on-screen keyboard open.
- **Accessibility** — messages as a list with author and time; new incoming messages announced politely; send shortcut declared (`aria-keyshortcuts`).
- **Loading** — a loading placeholder that reserves its space; replying is possible immediately.
- **Error** — C33 for the thread; failed send keeps the text and marks it "Not sent — Retry".
- **Empty** — compose mode: the member gives a subject and is told `EMPTY_STATES.conversationNew` ("Describe what you need. Don't include full account numbers or passwords.").
- **Reuse** — P21; staff side in S53.
- **Technical notes** — Message body validated against `MESSAGE_MAX_LENGTH`; drafts persist per thread on the device.

## Settings & team

### S38 — Workspace general form

Pages: P22 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Edit workspace display settings, led by the workspace display name.
- **Responsibilities** — Display name, default currency view, time zone, week start; legal name read-only (from verification).
- **Data requirements** — `use-workspace`, `use-update-workspace`. `WorkspaceSettings`: `displayName`, `timeZone` (IANA), `weekStartsOn: 0 | 1`, `defaultCurrency`; `legalName` read-only.
- **Interaction model** — explicit save; leave prompt for unsaved changes; read-only for R2 (C59).
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only, not only made to look disabled.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33 on load; field errors and message on save.
- **Empty** — not applicable.
- **Reuse** — P22.
- **Technical notes** — `legalName` comes from the verification case and is never writable here.

### S39 — Team members

Pages: P23 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Who has access and with what role, led by the member count and pending invitations.
- **Responsibilities** — Members and pending invitations with name, email, role, status, last active; change role; remove; resend/revoke invitations.
- **Data requirements** — `use-team` (slow, server-paged for 200 members). `Member`: `id`, `userId | null`, `name | null`, `email`, `role` (`owner | finance | accountant | viewer`), `status: active | invited | suspended`, `lastActiveAt | null`, `invitedAt | null`.
- **Interaction model** — per member: change role; remove (confirmed via C52 naming the person and what they lose); resend or revoke an invitation. The last owner cannot be demoted or removed (those actions are unavailable with the reason given); R2 manages only viewers and accountants; a member's name → P24.
- **Device needs** — role change possible on a phone.
- **Accessibility** — each member's actions are named for them ("Actions for Ada Lovelace").
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; failed mutation → message, member unchanged.
- **Empty** — always at least the owner; owner only → `EMPTY_STATES.teamSolo` ("Invite your finance lead or accountant to work alongside you.").
- **Reuse** — P23.
- **Technical notes** — Role, removal and invitation hooks pending (Q2).

### S40 — Invite member form

Pages: P23 · Contracts: [C21](phase-6-interaction-contracts.md#c21--dialog) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Invite a person with a role (the only way non-owners join, BR12).
- **Responsibilities** — Email and role; state what the role can do (from the permission matrix); choose accounts for a viewer; send.
- **Data requirements** — `use-invite-member`. `InviteMemberInput`: `email`, `role: Exclude<WorkspaceRole, "owner">`, `accountIds | null` (viewer only).
- **Interaction model** — opens as C21 from the invite action; a viewer's accounts are chosen with C07; success closes it, announces "Invitation sent to {email}" and the pending member appears in S39; an existing member → field error.
- **Device needs** — baseline.
- **Accessibility** — dialog labelled; role description read with the role choice.
- **Loading** — submit reports progress.
- **Error** — Zod/server field errors; transport error is stated and the dialog stays open with values kept.
- **Empty** — not applicable.
- **Reuse** — P23.
- **Technical notes** — `role` excludes `owner` at the type level.

### S41 — Role permissions reference

Pages: P23, P24 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Say plainly what each role can and cannot do, led by the capabilities of the role in question.
- **Responsibilities** — State, for each capability, whether each role has it; on P24 identify the member's own role.
- **Data requirements** — none fetched (static). `PermissionMatrix` (`lib/data/permission-matrix.ts`): `capabilities {id, label}[]`, `grants: Record<WorkspaceRole, string[]>`.
- **Interaction model** — read only; on P24 the role in question is identified.
- **Device needs** — readable on a phone (each role's capabilities can be read as a list).
- **Accessibility** — table with row and column headers; yes/no in text.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P23, P24.
- **Technical notes** — Rendered on the server. The same `PermissionMatrix` drives C59. Why: the reference members read and the rules the UI applies cannot disagree.

### S42 — Profile form

Pages: P25 (edit), P24 (read) · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — A person's profile, led by their name (and role in read mode): the member edits their own (P25); an owner or finance lead views a teammate's (P24).
- **Responsibilities** — Full name, email, identity image, phone (optional), bio; edit mode saves; read mode adds role and join date.
- **Data requirements** — `use-me`, `use-update-profile`; `use-team-member` in read mode. `Profile` = `userResponseDtoSchema.pick({ fullName, email, phoneNumber, avatar, bio })`.
- **Interaction model** — explicit save; email is read-only (changing it needs verification, Q2); read mode offers no edits, only a way back to P23.
- **Device needs** — name and phone autofill.
- **Accessibility** — definition list in read mode.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; not-found member → `not-found`; save errors per field or message.
- **Empty** — blank optional fields read "Not provided".
- **Reuse** — P24, P25.
- **Technical notes** — `Profile` composes over the generated `userResponseDtoSchema`; change-email hook pending (Q2).

### S43 — Security settings

Pages: P25 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C15](phase-6-interaction-contracts.md#c15--table-family) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Let the member secure their sign-in, led by whether two-step is on.
- **Responsibilities** — Change password; enrol/disable two-step (passkey + TOTP, OD6); list sessions (device, approximate location, last active); revoke any but current; "Sign out everywhere else".
- **Data requirements** — `use-change-password`, `use-sessions`, `use-two-step`. `ChangePasswordInput`: `current`, `next`, `confirm` (`next ≠ current`, `PASSWORD_MIN_LENGTH`). `Session`: `id`, `device`, `approximateLocation | null`, `createdAt`, `lastActiveAt`, `current`. `TwoStepStatus`: `enabled`, `methods`.
- **Interaction model** — disabling two-step, revoking and revoke-all confirm via C52; enrolment is a guided flow in C21 (QR plus copyable key and code check, or passkey); step-up required for password, two-step and revoke-all; after a password change other sessions end and the member is told.
- **Device needs** — enrol a passkey on the device in hand; TOTP without scanning.
- **Accessibility** — the QR code has the key as text; results announced.
- **Loading** — password, two-step and sessions load independently, each with a placeholder that reserves its space.
- **Error** — password, two-step and sessions fail independently, each with C33; wrong current password is a field error.
- **Empty** — sessions include the current one; two-step off → `SECURITY_COPY.twoStepOff` ("Two-step verification is off. Add a passkey to protect your account.").
- **Reuse** — P25.
- **Technical notes** — Revoke-session hook pending (Q2).

## Payments

Specified, Deferred (OD3). **OD9** may bring payments and approvals into scope.

### S44 — Transfer form

Pages: P26 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C40](phase-6-interaction-contracts.md#c40--amount) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Move money between own accounts or to a saved payee (F6).
- **Responsibilities** — Source and destination; amount and memo; check available balance and limits; review; confirm with step-up; report result and reference.
- **Data requirements** — `use-accounts`, `use-create-transfer`. `TransferInput`: `fromAccountId`, `toAccountId | payeeId`, `amountMinor`, `currency`, `memo | null`, `idempotencyKey` (nanoid, once per review). Why: a double submit must never send twice.
- **Interaction model** — two steps (edit, review); nothing sent from edit; review confirms via C52 with step-up; success links to the pending transaction in P12; nothing optimistic.
- **Device needs** — full review on a phone before confirming.
- **Accessibility** — amount read in words at review; errors linked to fields.
- **Loading** — confirm disabled until the backend answers.
- **Error** — insufficient funds, over limit, frozen → field errors from `TRANSFER_COPY`; uncertain outcome → "We couldn't confirm this transfer. Check Recent activity before trying again", key kept, no auto-retry.
- **Empty** — `EMPTY_STATES.transfer` ("Add a payee or open a second account to transfer money.").
- **Reuse** — P26 (and P27 via payee preselection).
- **Technical notes** — Idempotency key generated once per review (nanoid).

### S45 — Payee list

Pages: P27 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Manage payees, known by their names, and start a payment (F7).
- **Responsibilities** — Let the member recognise each trusted payee (destination always masked) and its payment history; add, edit, remove; pay (→ S44 preselected).
- **Data requirements** — `use-payees`. `Payee`: `id`, `name`, `destinationLast4`, `bankName | null`, `lastPaidAt | null`, `totalPaid`, `status: active | pending_verification`.
- **Interaction model** — paying → `/payments/transfer?payeeId=`; remove via C52; new payee needs step-up; changed bank details require confirmation.
- **Device needs** — baseline.
- **Accessibility** — pay actions name the payee.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; duplicate payee is a field error.
- **Empty** — `EMPTY_STATES.payees` ("No payees yet.").
- **Reuse** — P27.
- **Technical notes** — none beyond the data requirements.

## Help

### S46 — Help search & categories

Pages: P28 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C14](phase-6-interaction-contracts.md#c14--content-group) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Find the right article in one search.
- **Responsibilities** — Client search over titles and summaries; categories; lead to messaging (signed in) or sign-in (visitor).
- **Data requirements** — static `lib/data/help-articles.ts`. `HelpArticle`: `slug`, `title`, `summary`, `category`, `body: HelpBlock[]`, `updatedOn`. `HelpCategory`: `id`, `title`, `description`, `icon`.
- **Interaction model** — results update as the member types (debounced); a category filters; results → `/help/[slug]`; query in `?q=`.
- **Device needs** — baseline.
- **Accessibility** — result count announced.
- **Loading / Error** — none.
- **Empty** — `EMPTY_STATES.helpSearch` ("No articles match. Try different words, or message our support team.").
- **Reuse** — P28.
- **Technical notes** — Search runs on the client over bundled data; no endpoint.

### S47 — Help article

Pages: P28 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Answer one question well.
- **Responsibilities** — The answer as paragraphs, lists, steps and notes; where the article sits in help; last-updated date; related articles.
- **Data requirements** — static. `HelpBlock` = `{kind: "p"; text} | {kind: "list"; items} | {kind: "steps"; items} | {kind: "note"; severity; text}`.
- **Interaction model** — read only; missing slug → `not-found`.
- **Device needs** — readable without zoom.
- **Accessibility** — steps as an ordered list; notes labelled by severity in text.
- **Loading** — none.
- **Error** — not found only.
- **Empty** — not applicable.
- **Reuse** — P28.
- **Technical notes** — Rendered on the server. Articles describe shipped behaviour only (Q-248).

## Internal

### S48 — Platform growth figures

Pages: P29 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C30](phase-6-interaction-contracts.md#c30--chart) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C23](phase-6-interaction-contracts.md#c23--tabs)

- **Purpose** — Platform growth at a glance, led by the new-user total for the period.
- **Responsibilities** — New users for the period (day, month, year) with change vs previous period and a series; switch period.
- **Data requirements** — `use-admin-user-total`, `use-admin-user-series` (exist). Contract `PeriodTotalResponseDto` (`period`, `start`, `end`, `total`) and `PeriodSeriesResponseDto` (`points: {key, value}[]`).
- **Interaction model** — the period is switched with C23; points expose values on focus.
- **Device needs** — text equivalent on a phone.
- **Accessibility** — chart text alternative.
- **Loading** — total and series load independently, each with a placeholder that reserves its space.
- **Error** — total and series fail independently, each with C33.
- **Empty** — 0 is a real value shown as "0"; no points → `EMPTY_STATES.adminSeries` ("No sign-ups in this period.").
- **Reuse** — P29.
- **Technical notes** — Counts, not money → formatted through C27, never C40.

### S49 — Platform user directory

Pages: P30 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C21](phase-6-interaction-contracts.md#c21--dialog)

- **Purpose** — Find any user by email and act on their account.
- **Responsibilities** — Name, email, role, status, created; search by name/email; filter by role and status; create; open detail.
- **Data requirements** — `use-admin-users`, `use-create-user` (exists). Contract `UserResponseDto` (`id`, `fullName`, `email`, `phoneNumber`, `avatar`, `bio`, `role: ADMIN | USER`, `status: ACTIVE | PENDING | SUSPENDED`, `createdAt`, `updatedAt`); create with `CreateUserDto`.
- **Interaction model** — debounced search; filters in the URL; creating a user opens C21 validated by `createUserDtoSchema`; choosing a user → P31; a user can also be opened or have their ID copied from their actions (C20).
- **Device needs** — search and open on a phone.
- **Accessibility** — as S23.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33; duplicate email is a field error in the dialog.
- **Empty** — `EMPTY_STATES.adminUsersFiltered` ("No users match."); unfiltered empty impossible.
- **Reuse** — P30.
- **Technical notes** — Server paging required (Q3).

### S50 — Admin user record

Pages: P31 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Inspect one user, led by their account status, and change role or status.
- **Responsibilities** — Give the user's fields; edit full name, phone, role, status; delete; read-only for R5.
- **Data requirements** — `use-admin-user`. `UserResponseDto`; edit form `updateUserDtoSchema.pick({ fullName, phoneNumber, role, status })` (`lib/validations/admin-user.ts`).
- **Interaction model** — explicit save; suspend/role change confirm via C52 naming the effect ("Ada will be signed out and cannot sign in"); delete via C52 with the email typed; after delete → P30; no self-delete or self-demote (reason given).
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only with the reason.
- **Loading** — a loading placeholder that reserves its space.
- **Error** — not found → `not-found`; other → C33; save errors per field or message.
- **Empty** — not applicable.
- **Reuse** — P31.
- **Technical notes** — Edit schema composes over the generated `updateUserDtoSchema`.

### S51 — Compliance case queue

Pages: P32 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C47](phase-6-interaction-contracts.md#c47--active-filter)

- **Purpose** — One queue of verification cases ordered by what to review next, led by the oldest waiting case and the `submitted` count.
- **Responsibilities** — Business name, state, submitted date, age, assignee; filter by state and assignee; oldest first.
- **Data requirements** — `use-compliance-cases` (cursor). `ComplianceCaseSummary`: `id`, `workspaceId`, `businessLegalName`, `state`, `submittedAt | null`, `ageHours`, `assignee | null`, `openRequests`.
- **Interaction model** — filters in the URL; choosing a case → `/admin/compliance/[caseId]`; "Assign to me" per case (Q2).
- **Device needs** — tablet-usable.
- **Accessibility** — ages given in words ("3 days").
- **Loading** — a loading placeholder that reserves its space.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.complianceQueue` ("No cases waiting for review."), `complianceQueueFiltered` ("No cases match these filters.").
- **Reuse** — P32 (in the segment layout).
- **Technical notes** — Assign hook pending (Q2).

### S52 — Compliance case review

Pages: P32 · Contracts: [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Review one case and decide — approve, reject, or request information — on the evidence.
- **Responsibilities** — Business details, owners and documents read-only (S10/S11 summaries, S12 list), verification progress read-only (C50), case history; record a decision with reason; write the info requests the owner sees in S13.
- **Data requirements** — `use-compliance-case`, `use-decide-case`. `ComplianceCase` = `VerificationCase` + `history {at, actor, action, note}[]`, `riskSignals {label, severity}[]`. `DecideCaseInput`: `decision: approve | reject | request_info`, `reason` (required), `requests?`.
- **Interaction model** — a document opens in C22; every decision via C52 with reason; "Request info" collects one or more requests; afterwards the next case opens; only R6/R7 decide.
- **Device needs** — decide on a tablet.
- **Accessibility** — documents have text names; decision result announced.
- **Loading** — document previews load lazily.
- **Error** — C33; conflict → `COMPLIANCE_COPY.alreadyDecided` and reload; failed submit keeps the reason.
- **Empty** — no documents → `EMPTY_STATES.caseDocuments` ("The business hasn't uploaded documents yet.").
- **Reuse** — P32.
- **Technical notes** — `reason` required by `DecideCaseInput`. (1.0.0 `tone` field on risk signals renamed `severity`.)

### S53 — Support lookup

Pages: P33 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Let a support agent find a workspace, user or transaction from what the customer quotes.
- **Responsibilities** — Search by email, workspace name, transaction reference or user ID; results grouped by kind with status; read-only summary (transaction facts from S24, messages from S37); no balances beyond need, never full account numbers.
- **Data requirements** — `use-support-lookup`; every lookup audit-logged. `SupportLookupResult` = `{kind: "user"; user} | {kind: "workspace"; id; name; state} | {kind: "transaction"; transaction; workspaceName}`.
- **Interaction model** — type, then results; choosing a result opens its read-only summary without losing the results; user results link to P31 for R7.
- **Device needs** — laptop and tablet.
- **Accessibility** — groups labelled; result count announced.
- **Loading** — previous results stay, marked busy.
- **Error** — C33.
- **Empty** — idle `EMPTY_STATES.supportLookup` ("Search by email, workspace, transaction reference or user ID."), none `supportLookupNone` ("Nothing found for that search.").
- **Reuse** — P33.
- **Technical notes** — Minimum query length `SUPPORT_QUERY_MIN`. Whether support may view transactions is IA7 (Phase 3).

## System

### S54 — Status explanation

Pages: P34, P35 and every segment `not-found.tsx` / `error.tsx` · Contracts: [C32](phase-6-interaction-contracts.md#c32--emptystate) [C33](phase-6-interaction-contracts.md#c33--errorstate) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say what went wrong in plain words and give one way forward (X10).
- **Responsibilities** — Three variants: `not-found` ("This page doesn't exist", leads home or to the dashboard); `error` ("Something went wrong on our side", Retry calling `reset()`, leads to P28); `offline` ("You're offline", Retry when `navigator.onLine` returns). Support reference (`digest`) when present.
- **Data requirements** — none; `GET /api/health` may distinguish an outage. `StatusVariant = "not-found" | "error" | "offline"`; `STATUS_PAGE_COPY: Record<StatusVariant, {title; body; primaryLabel}>`; `digest?`.
- **Interaction model** — Retry calls `reset()`; home vs dashboard depends on the session (read on the server); offline listens for `online`.
- **Device needs** — baseline.
- **Accessibility** — heading is the page `<h1>`; reference readable and copyable.
- **Loading** — none.
- **Error** — this is the error state; `global-error.tsx` renders it with no providers.
- **Empty** — not applicable.
- **Reuse** — P34, P35, all segment boundaries.
- **Technical notes** — Rendered on the server except Retry, which needs the client.

## Open questions

- **Q1** — Which endpoint returns the member's workspace role? Blocks C59 wiring for S26, S31, S35, S38, S39, S40.
- **Q2** — Hooks not yet named: delete note/attachment (S26); rename/delete saved view (S27); statement and export download URLs (S30, S32); mark read (S34 — named `use-mark-notifications-read` in Phase 7); change role, remove member, resend/revoke invitation (S39); revoke session (S43); update/delete user (S50 — covered by `use-admin-user`); assign case (S51); change email (S42).
- **Q3** — `GET /api/users` is unpaged; S49 needs cursor pagination and server search.
- **Q4** — KYB/KYC field lists and owner threshold depend on OD1.
- **Q5** (2.0.0) — If OD9 keeps any of S57–S62 for the production site, which v1 facts replace the sample figures, and who approves each claim (`reviewedOn`)?
- **Q6** (2.0.0) — If OD10 keeps S64, where does the email go, what is the consent copy, and how long is it kept?

## Assumptions

- **A2** — v1 is read-only; S44, S45 have no v1 data dependency.
- **A6** — All money, date and number formatting through `Intl`, single locale.
- **A9** — Internal sections gate on `ADMIN` until platform roles exist.
- **A10** — The built home page is recorded as found.
- **A11** — Empty-state copy in `lib/data/empty-states.ts` (`EMPTY_STATES`); labels in feature constants.
- **A12** — Query-key factory `queryKeys`; `STALE_TIME` tiers; section limits (`DASHBOARD_ACCOUNT_LIMIT`, `DASHBOARD_ACTIVITY_LIMIT`, `LEDGER_PAGE_SIZE`, `EXPORT_POLL_MS`, `EXPORT_MAX_RANGE_DAYS`, `REVEAL_TIMEOUT`, `SAVED_VIEW_LIMIT`, `MESSAGE_MAX_LENGTH`, `SUPPORT_QUERY_MIN`, `RUNWAY_TARGET_MONTHS`) are proposed constants fixed in Phase 7.
- **A13** — *Withdrawn in 2.0.0 (motion presets `MOTION_PRESET` — visual).*
- **A14** — *Withdrawn in 2.0.0 (named layout classes — visual).*
- **A15** — Proposed types (`Money`, `CursorPage<T>`, `Account`, `Transaction`, `VerificationCase`, …) stand until the backend publishes each module.

## Changes in this version

- **Retained:** S01–S54 with purpose, responsibilities, data, interaction, device needs, accessibility, loading, error, empty, reuse and technical notes; the four-state rule; shared data conventions; accessibility floor; file discipline (now a pointer to Phase 7); Q1–Q4.
- **Changed:** 22 sections renamed (table above); "Hierarchy" folded into primary information (now named in Purpose); "Responsive behavior" replaced by Device needs; **Skeleton states** and **Animation behavior** headings removed (visual) — loading still reserves space; the depth floor, density rules (row heights, type sizes, spacing caps, accent use, hover), motion defaults and the styled example section removed; `tone` fields renamed `severity` (S17, S47, S52); S31 `includePending` made explicit; A13 and A14 withdrawn.
- **Added:** S55 Public site navigation, S56 Headline figures, S57 Accounts capability, S58 Payments & approvals capability, S59 Cards capability, S60 Treasury forecast capability, S61 Reconciliation capability, S62 Pricing plans, S63 Frequently asked questions, S64 Get-started enquiry — all from the built home page, each with its OD9/OD10 facet; built-state notes on S04–S07; Q5, Q6; A10.
- **Self-audit (No Visual Prescription, tightened seed):** removed Content model and Controls from all 64 sections. Relocated first: types, schemas and copy constants → Data requirements; primary information → Purpose, then dropped as a second inventory (the Purpose now names the section's job only); behavioural rules from Controls (S08 numeric codes and password show/hide, S39 C52 before removal, S40 C07 viewer accounts, S42 email read-only) → Interaction model; sample/illustrative labelling (S56–S61) → Interaction model; S56 built values and S41 `PermissionMatrix`→C59 rule → Technical notes. Rewrote placement wording in states and fields (top, above, below, inline, row, overlay, menu, block) and the S12/S32 empty copy that pointed to position. Technical notes keep data, validation and dependencies only; component file names (incl. 1.0.0 names) now live in Phase 7; build status kept. File discipline reduced to a pointer to Phase 7.

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
