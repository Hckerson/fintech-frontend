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

Phase 4 decided which pages exist and what each must offer. This phase breaks them into **64 sections**: each does one job, owns its states, and can be placed on more than one page. Every blueprint uses the same thirteen headings: Purpose · Responsibilities · Content model · Data requirements · Interaction model · Controls · Device needs · Accessibility · Loading · Error · Empty · Reuse · Technical notes.

**Content and behaviour only.** No blueprint specifies layout, order on screen, sizing, imagery, animation or wireframes. The first line of every Content model names the section's **primary information** — what the section exists to convey — which is a priority for the build, not a placement.

Conventions:

- **IDs are binding.** A section is always named "ID + name" (S23 Ledger entries).
- **Hooks** are `lib/hooks/use-<resource>.ts` (TanStack Query); authenticated hooks wrap Server Actions in `lib/actions/`. Sections never import `@/lib/api-client`.
- **Types** are proposals for `lib/types/<domain>.ts`; once the backend publishes a module, each becomes `z.infer` of the generated schema.
- **Copy** is a named constant: empty states in `lib/data/empty-states.ts` (`EMPTY_STATES`), labels in `lib/<feature>/constants.ts`.
- **Controls** name contracts from [Phase 6](phase-6-interaction-contracts.md). Which components realise them is decided at build.
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

Mutations: while pending, the trigger is disabled and `aria-busy`; validation errors show on the field ([C10 Field](phase-6-interaction-contracts.md#c10--field)); transport errors show a message with Retry; success shows a message and invalidates related keys. Nothing optimistic touches money.

### One primary fact

Each section conveys one primary piece of information (DP2), named first in its Content model. How that priority is expressed is decided at build.

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

Sections live in feature folders `components/<feature>/<name>.tsx` (OD4), one component per file, ≤ ~150 lines. A piece used by a second section moves to `components/common/`.

## Shell & navigation

S01 and S02 are mounted once in the group layouts; S03 is placed by each page.

### S01 — Primary navigation

Pages: every `(app)` and `(admin)` page · Contracts: [C35](phase-6-interaction-contracts.md#c35--navitem) [C36](phase-6-interaction-contracts.md#c36--workspaceswitcher) [C18](phase-6-interaction-contracts.md#c18--avatar) [C54](phase-6-interaction-contracts.md#c54--colour-scheme-preference)

- **Purpose** — Let a member move between product areas and between workspaces without losing their place.
- **Responsibilities** — Render navigation groups from `lib/data/navigation.ts` for the current role; mark the current route; host the workspace switcher and, if offered, the colour-scheme preference.
- **Content model** — Primary: which workspace (business) the member is looking at. Then: Dashboard, Accounts, Transactions, Insights, Documents; Notifications, Messages, Settings, Help; the member's identity. `NavItem`: `id`, `label`, `href`, `icon`, `roles: WorkspaceRole[]`, `group: "primary" | "secondary" | "internal"`. `Workspace`: `id`, `name`, `role`, `verificationState`.
- **Data requirements** — `use-workspace` (`["workspace","current"]`, `["workspace","list"]`, slow) and `use-me` (`["me"]`, slow). Nav config is static, filtered by role from C63; `(admin)` filters on platform role.
- **Interaction model** — Choosing an item is client navigation; the current item follows `usePathname()`. Switching workspace sets it current and invalidates keys starting with the old `workspaceId`; the member stays on the same route if the new role allows it, else goes to `/dashboard`.
- **Controls** — C35 links, C36 menu, C54 preference, a control to reveal navigation on small screens (C02).
- **Device needs** — every item reachable on a phone with the same groups and order (Phase 3 §2.4).
- **Accessibility** — `<nav aria-label>`; current item `aria-current="page"`; groups are lists with accessible group names; items keep accessible names when labels are hidden; the switcher announces "Switched to {workspace}".
- **Loading** — navigation renders immediately from static config; only the switcher and identity wait on data.
- **Error** — workspace list fails → switcher shows the current workspace name from the session with "Couldn't load workspaces · Retry"; navigation stays usable.
- **Empty** — one workspace → the switcher is a static label. A signed-in member always has a workspace (onboarding creates one).
- **Reuse** — every `(app)` and `(admin)` page via the two layouts; the `(admin)` variant takes a `navigation` prop.
- **Technical notes** — `components/shell/app-sidebar.tsx` (1.0.0 file name; rename to `primary-navigation.tsx` is a build choice) composing `nav-group.tsx`; client component only because it reads `usePathname`.

### S02 — Global utilities

Pages: every `(app)` and `(admin)` page · Contracts: [C38](phase-6-interaction-contracts.md#c38--commandpalette) [C39](phase-6-interaction-contracts.md#c39--notification-entry-point) [C37](phase-6-interaction-contracts.md#c37--usermenu) [C29](phase-6-interaction-contracts.md#c29--breadcrumbs)

- **Purpose** — Give each page one set of search, unread signal and the member's own menu.
- **Responsibilities** — Open the command palette; show the unread count; open the account menu (profile, security, help, sign out); expose navigation on small screens; offer breadcrumbs on detail pages.
- **Content model** — Primary: search ("Search transactions, accounts, counterparties", ⌘K / Ctrl+K). Then unread count, then account menu. `NotificationCount = { unread: number }`; member from `use-me` (`UserResponseDto`: `id`, `fullName`, `email`, `avatar`).
- **Data requirements** — `use-notifications` count mode (`["notifications", workspaceId, "count"]`, live, refetch on focus); `use-me` shared with S01. Palette sources load only after it opens.
- **Interaction model** — ⌘K/Ctrl+K opens the palette anywhere; `/` focuses it when no field has focus; the notification entry goes to P20; "Sign out" runs `use-logout` (X3) and goes to `/auth/login`.
- **Controls** — palette trigger with C28 hint, C39, C37, small-screen navigation control (C02).
- **Device needs** — search, notifications and sign-out reachable on a phone.
- **Accessibility** — `<header>` landmark; the notification entry's name includes the count ("Notifications, 3 unread"); count changes announced politely at most once a minute; palette is a modal dialog with combobox + listbox.
- **Loading** — while the count loads no number is shown; never "0".
- **Error** — count failure shows no number and no error. Why: the count is secondary; S34 carries the real error.
- **Empty** — zero unread → no count.
- **Reuse** — every `(app)` and `(admin)` page.
- **Technical notes** — `components/shell/top-bar.tsx` (1.0.0 name) and `palette-trigger.tsx`; palette sources typed in `lib/data/command-sources.ts`.

### S03 — Page title & actions

Pages: P08–P25, P29–P33 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C01](phase-6-interaction-contracts.md#c01--button) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Name the page and hold its one primary action.
- **Responsibilities** — Breadcrumbs, the page title (the only `<h1>`), optional one-line description, the primary action, secondary actions in a menu, optional sub-page tabs.
- **Content model** — Primary: the page title. Props: `title`, `description?`, `breadcrumbs: Crumb[]`, `primaryAction?`, `secondaryActions?: MenuAction[]`, `tabs?`. Titles from `PAGE_TITLES`.
- **Data requirements** — none; a dynamic title is passed in from the page's own section query.
- **Interaction model** — at most one primary action per page; others in a "More" menu.
- **Controls** — C29, C01, C20, C23 (tabs).
- **Device needs** — the primary action is reachable without scrolling past content on a phone.
- **Accessibility** — `<h1>`; breadcrumbs `<nav aria-label="Breadcrumb">` with `aria-current="page"`; the "More" menu's name includes the page ("More actions for Statements").
- **Loading** — a dynamic title not yet available shows a placeholder of the title's size.
- **Error** — none of its own.
- **Empty** — not applicable.
- **Reuse** — twenty-four pages.
- **Technical notes** — `components/shell/page-header.tsx`, a Server Component.

## Marketing (specified)

Every claim is a reviewed constant (BR10). Nothing invented: no balances, logos, testimonials or certifications. **OD9** governs how these relate to the built sections S55–S64.

### S04 — Marketing proposition

Pages: P01 · Contracts: [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say in one sentence what Ledgerline is, and send the visitor to start or sign in.
- **Responsibilities** — Headline, one supporting sentence, the primary start action and a secondary sign-in action, from `lib/data/`. Any product illustration is labelled as illustration and never shows real customer data.
- **Content model** — Primary: the headline. `MarketingHero`: `headline`, `subline`, `primaryCta {label, href}`, `secondaryCta {label, href}`, `visualAlt`.
- **Data requirements** — none.
- **Interaction model** — specified: primary → `/auth/register` (X2), secondary → `/auth/login` (X1); signed-in visitors are offered `/dashboard`. **Built:** "Open an account" and "Book a demo" → S64 enquiry (OD10); a product preview shows a sample company with sample balances, approvals and activity (OD9 facet d).
- **Controls** — C01 as a link, C03.
- **Device needs** — the headline and start action are the first things reachable on a phone.
- **Accessibility** — the headline is the page `<h1>`; any illustration has meaningful `alt` (built: a descriptive label for the preview); actions are real links with distinct names; the headline is readable without JavaScript.
- **Loading / Error** — none (static).
- **Empty** — not applicable.
- **Reuse** — P01 only.
- **Technical notes** — built as `components/ledgerline/hero-section.tsx` with the preview composed from `product-frame.tsx`, `frame-*.tsx` and data in `lib/data/ledgerline/dashboard.ts`.

### S05 — Value propositions

Pages: P01 · Contracts: [C14](phase-6-interaction-contracts.md#c14--content-group)

- **Purpose** — State the four things v1 actually does: see balances, search transactions, export for accounting, work with the team.
- **Responsibilities** — Map `lib/data/` value props; every item describes an existing v1 capability; no money-movement claims (A2).
- **Content model** — Primary: the section heading. `ValueProp`: `id`, `icon`, `title`, `body`.
- **Data requirements** — none.
- **Interaction model** — read only; no links inside, so nothing competes with the start action.
- **Controls** — none.
- **Device needs** — baseline.
- **Accessibility** — `<h2>`; items are a list; icons `aria-hidden`.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P01.
- **Technical notes** — **not built as specified.** The built page covers this job with S57–S61, which present more than v1 (OD9). S05 stays specified until OD9 is answered.

### S06 — Security & trust statements

Pages: P01 · Contracts: [C14](phase-6-interaction-contracts.md#c14--content-group) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Explain how Ledgerline protects an account, stating only what the product does.
- **Responsibilities** — Statements about existing behaviour: masked account numbers, re-authentication before a reveal, two-step sign-in, role-based access, audit logging; each links to a help article. No badge, certification, regulator logo or insurance claim unless answered in OD1 and approved.
- **Content model** — Primary: the heading. `TrustClaim`: `id`, `title`, `body`, `helpSlug`, `reviewedOn` (ISO date of approval).
- **Data requirements** — none.
- **Interaction model** — each claim links to `/help/[slug]`.
- **Controls** — C03.
- **Device needs** — baseline.
- **Accessibility** — `<h2>`, a list of claims, self-describing link text.
- **Loading / Error** — none.
- **Empty** — no claims → the section does not render. Why: an empty trust section is worse than none.
- **Reuse** — P01; claims also appear in P28.
- **Technical notes** — built as `components/ledgerline/security-section.tsx` with `SECURITY_CONTROLS` listing two-person approvals, granular roles, audit trail, hardware keys, protected funds and monitoring, noted "Placeholder controls… holds no certifications" (OD9 facet e). The `reviewedOn` field is not present in the built data.

### S07 — Public legal & support links

Pages: P01, P28 · Contracts: [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Close every public page with legal, disclosure and support links.
- **Responsibilities** — Link groups from `lib/data/`, the legal entity line (from OD1), the copyright line, and any required disclosure.
- **Content model** — Primary: the link groups. `FooterGroup`: `title`, `links: {label, href}[]`; plus `disclosure` while the product is a design study.
- **Data requirements** — none.
- **Interaction model** — links only.
- **Controls** — C03.
- **Device needs** — baseline.
- **Accessibility** — `<footer>` (contentinfo); each group a labelled `<nav>`.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P01, P28.
- **Technical notes** — built as `components/ledgerline/ledger-footer.tsx` with `FOOTER_COLUMNS` and a disclosure stating Ledgerline is fictional, not a bank, not regulated, holding no deposits (`lib/data/ledgerline/closing.ts`). Links point to in-page anchors of the built sections.

## Marketing (built in 2.0.0)

Added from the working-tree home page (`app/page.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`). Recorded as found. Each carries the OD9/OD10 facet it touches; none of them changes v1 scope until the maintainer decides.

### S55 — Public site navigation

Pages: P01 · Contracts: [C03](phase-6-interaction-contracts.md#c03--textlink) [C01](phase-6-interaction-contracts.md#c01--button) [C65](phase-6-interaction-contracts.md#c65--small-screen-navigation-toggle)

- **Purpose** — Let a visitor jump to any topic on the home page and start at any time.
- **Responsibilities** — Brand link to top; in-page links to Accounts, Payments, Cards, Treasury, Security, Pricing; "Sign in"; primary "Open an account"; a small-screen menu with the same links.
- **Content model** — Primary: the start action. `NavLink`: `id`, `label`, `href` (`LEDGER_NAV`, `LEDGER_BRAND` in `lib/data/ledgerline/brand.ts`).
- **Data requirements** — none.
- **Interaction model** — links scroll to anchors; the menu toggle opens and closes the small-screen list; choosing a link closes it. "Sign in" and "Open an account" go to S64 (OD10).
- **Controls** — C03, C01 (as link), C65.
- **Device needs** — all links and the start action available on a phone through the menu.
- **Accessibility** — labelled `<nav>` landmarks ("Primary", "Mobile"); the toggle exposes `aria-expanded` and `aria-controls` and names that change with state ("Open menu"/"Close menu").
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate for P28's public navigation.
- **Technical notes** — `components/ledgerline/ledger-nav.tsx`. Specified links to P02/P03 absent (OD10). Payments and Cards links point at capabilities outside v1 (OD9 a, b).

### S56 — Headline figures

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Give a visitor a few concrete figures about the product.
- **Responsibilities** — Four figures with labels and a note that they are samples.
- **Content model** — Primary: the figures. `Figure`: `id`, `value`, `label`; `METRICS_NOTE` ("Sample figures for a placeholder product"). Built values: transfers between own accounts "< 1s", "34" currencies, "0" entries left at close, "2-step" approvals on outgoing payments.
- **Data requirements** — none.
- **Interaction model** — read only.
- **Controls** — none.
- **Device needs** — baseline.
- **Accessibility** — each value is associated with its label as one readable phrase; the sample note is part of the section text, not decoration.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `components/ledgerline/metrics-strip.tsx`, `METRICS` in `lib/data/ledgerline/brand.ts`. Conflicts with BR10 and with v1 scope (payments approvals, 34 currencies) — OD9 a, c, d.

### S57 — Accounts capability

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Describe what accounts offer.
- **Responsibilities** — Multi-currency accounts with sample balances; instant internal transfers; interest on idle cash (sample rate); sub-accounts for purposes (tax reserve, payroll, runway, capex, dividends).
- **Content model** — Primary: "Every currency. One balance sheet." `ACCOUNTS_COPY`, `CURRENCY_ACCOUNTS: CurrencyAccount[]` (`id`, `code`, `name`, `balanceMinor: number`), note "Sample balances and rates".
- **Data requirements** — none.
- **Interaction model** — read only.
- **Controls** — none.
- **Device needs** — baseline.
- **Accessibility** — amounts read with their currency; sample note readable.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `accounts-section.tsx`, `tile-currencies.tsx`, `tile-transfer.tsx`, `tile-yield.tsx`, `tile-subaccounts.tsx`; data in `lib/data/ledgerline/features.ts`. Internal transfers, yield and sub-accounts are outside v1 (OD9 a, c). Amounts are integer minor units formatted by `lib/ledgerline/money.ts` with a fixed two-decimal exponent — acceptable only for sample copy; never reused for real money (BR1; Phase 9 H-24).

### S58 — Payments & approvals capability

Pages: P01 · Contracts: [C66](phase-6-interaction-contracts.md#c66--sample-interaction-control)

- **Purpose** — Describe drafting, approving and scheduling payments.
- **Responsibilities** — A sample payment with a three-step approval trail (drafted, approved, scheduled); an interactive sample "Approve payment" that toggles the trail and can be reset; three points (limits by role, batch payouts, local rails).
- **Content model** — Primary: "Nothing leaves without two sets of eyes." `PAYMENTS_COPY`, `APPROVAL_STEPS: ApprovalStep[]` (`id`, `label`, `actor`, `initials`), `PAYMENT_POINTS`. Note: "Interactive sample. No payment is made."
- **Data requirements** — none; state is local.
- **Interaction model** — the sample control switches between waiting and approved states and back; the result is announced in text.
- **Controls** — C66.
- **Device needs** — the sample works by touch and keyboard.
- **Accessibility** — the trail is an ordered list with each step's state in text; the result sentence is in a live region.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `payments-section.tsx`, `approval-card.tsx`, `approval-step-row.tsx`. Money movement and approvals are Deferred/unspecified in v1 (OD3, OD9 a).

### S59 — Cards capability

Pages: P01 · Contracts: [C66](phase-6-interaction-contracts.md#c66--sample-interaction-control)

- **Purpose** — Describe issuing cards with built-in controls.
- **Responsibilities** — A sample card (holder, masked number, monthly limit and spend) and four sample controls (online payments, travel, cash withdrawals, receipt required) that can be switched in the sample.
- **Content model** — Primary: "Cards with the controls built in." `CARDS_COPY`, `CARD_CONTROLS: CardControl[]` (`id`, `label`, `detail`, `enabled`); note "Illustrative card for a placeholder product."
- **Data requirements** — none; local state only.
- **Interaction model** — each control is a switch that changes only the sample.
- **Controls** — C66 (switch form).
- **Device needs** — switches operable by touch.
- **Accessibility** — `role="switch"` with `aria-checked` and a label reference per control.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `cards-section.tsx`, `metal-card.tsx`, `card-controls.tsx`. Cards are a v1 non-goal (OD9 b).

### S60 — Treasury forecast capability

Pages: P01 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart)

- **Purpose** — Describe a 90-day cash forecast and how much cash can be set aside.
- **Responsibilities** — A sample chart of actual and forecast cash with an expected range; three figures (runway, cash to set aside, projected interest).
- **Content model** — Primary: "See the next ninety days before they happen." `TREASURY_COPY`, `ACTUAL_SERIES`, `FORECAST_SERIES`, `FORECAST_SPREAD`, `TREASURY_FIGURES`; note "Illustrative forecast built from sample data."
- **Data requirements** — none.
- **Interaction model** — read only.
- **Controls** — C30 (read-only).
- **Device needs** — the figures convey the message without the chart.
- **Accessibility** — the chart has a text alternative (Q-012); the three figures are text.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `treasury-section.tsx`, `forecast-chart.tsx`, `lib/ledgerline/chart.ts`. Series are unitless numbers, not money. v1 has only the labelled runway estimate (P16) (OD9 c).

### S61 — Reconciliation capability

Pages: P01 · Contracts: none (read-only)

- **Purpose** — Describe matching payments to ledger entries and syncing to accounting software.
- **Responsibilities** — A list of sample matched entries with a matched count.
- **Content model** — Primary: "The month closes itself." `RECONCILE_COPY`, `MATCHED_ENTRIES: MatchedEntry[]` (`id`, `description`, `account`, `amountMinor`); note "Sample entries."
- **Data requirements** — none.
- **Interaction model** — read only.
- **Controls** — none.
- **Device needs** — baseline.
- **Accessibility** — each entry's matched state is given in text.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `reconcile-section.tsx`, `matched-row.tsx`. v1 reconciliation is export + annotation (F4, S26); automatic matching and accounting sync are unspecified (OD9 c; Phase 3 §17 lists integrations as expansion).

### S62 — Pricing plans

Pages: P01 · Contracts: [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Tell a visitor what Ledgerline costs.
- **Responsibilities** — Plans with name, price, cadence, summary, features and a choose action; one plan marked as most chosen; a note that pricing is a sample.
- **Content model** — Primary: the plan prices. `Plan`: `id`, `name`, `price`, `cadence`, `summary`, `features[]`, `featured`; `PRICING_COPY.note`.
- **Data requirements** — none.
- **Interaction model** — "Choose" goes to S64 enquiry.
- **Controls** — C01 as link.
- **Device needs** — every plan comparable on a phone.
- **Accessibility** — each plan is a labelled group; "most chosen" is stated in text; each "Choose" link names its plan.
- **Loading / Error / Empty** — none.
- **Reuse** — P01.
- **Technical notes** — `pricing-section.tsx`, `plan-card.tsx`. Pricing is not in 1.0.0; plan features include cards, 34 currencies, approvals, accounting sync, multi-entity and API access (OD9 f).

### S63 — Frequently asked questions

Pages: P01 · Contracts: [C64](phase-6-interaction-contracts.md#c64--disclosure)

- **Purpose** — Answer the questions a prospect asks before starting, including whether Ledgerline is a real bank.
- **Responsibilities** — Questions with expandable answers; the first answer states the design-study status.
- **Content model** — Primary: the questions. `FaqItem`: `id`, `question`, `answer`.
- **Data requirements** — none.
- **Interaction model** — each question toggles its answer; others are unaffected.
- **Controls** — C64.
- **Device needs** — baseline.
- **Accessibility** — each question is a button with `aria-expanded` and `aria-controls`; answers are in the document for find-in-page when expanded.
- **Loading / Error / Empty** — none.
- **Reuse** — P01; candidate pattern for P28.
- **Technical notes** — `faq-section.tsx`, `faq-row.tsx`. Several answers describe approvals, multi-currency and accounting sync "in the concept" (OD9).

### S64 — Get-started enquiry

Pages: P01 · Contracts: [C67](phase-6-interaction-contracts.md#c67--enquiry-form)

- **Purpose** — Capture a prospect's work email as the start of X11.
- **Responsibilities** — Closing statement, one email field, submit, inline error, confirmation, and a note that nothing is stored or sent.
- **Content model** — Primary: the start action. `Contact = z.infer<typeof contactSchema>` (`email`); copy `CTA_COPY` (`title`, `lead`, `emailLabel`, `submit`, `success`, `invalid`, `note`).
- **Data requirements** — none today (design-study state). Once OD10 chooses an intake: a mutation hook wrapping a Server Action.
- **Interaction model** — submit validates with Zod; invalid → field error; valid → confirmation. The email is never placed in the URL.
- **Controls** — C67.
- **Device needs** — email keyboard and autofill on phones.
- **Accessibility** — visible label bound to the input; `aria-invalid` and `aria-describedby` on error; result in a live region.
- **Loading** — none today; with an intake, submit shows progress and is disabled.
- **Error** — invalid email → `CTA_COPY.invalid`. With an intake: transport failure keeps the value with Retry.
- **Empty** — not applicable.
- **Reuse** — P01; possibly P28.
- **Technical notes** — `contact-section.tsx`, `lib/validations/contact.ts`. It is the only target of "Open an account", "Book a demo", "Sign in" and "Choose" on the built page (OD10).

## Authentication

### S08 — Authentication step

Pages: P02–P06 · Contracts: [C34](phase-6-interaction-contracts.md#c34--loginform--generalized-authform-variants) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Take one authentication step per screen and get the member into the product, or back to a known state.
- **Responsibilities** — Five variants by `variant` prop: `sign-in` (X1), `register` (X2), `forgot` (X5), `reset` (X5), `verify` (X1, X4). Each links to its neighbours (sign-in ↔ register, sign-in → forgot) — fixing host finding H-04.
- **Content model** — Primary: the step's purpose (its heading) and single submit. Values from `lib/validations/auth.ts` composing `LoginDto`/`RegisterDto`: `SignInValues {email, password}`, `RegisterValues {name, email, password}`, `ForgotValues {email}`, `ResetValues {password, confirm, token}`, `VerifyValues {code}`; `PASSWORD_MIN_LENGTH`.
- **Data requirements** — mutations `use-login`, `use-register`, `use-request-password-reset`, `use-reset-password`, `use-verify-challenge`. Small forms use `useState` + Zod `safeParse`.
- **Interaction model** — validate on blur, then on submit. Success: sign-in → `next`, `/dashboard` or `/auth/verify`; register → `/onboarding`; forgot → same confirmation for every email; reset → sign-in with a message. Wrong credentials → `INVALID_CREDENTIALS` at form level, never naming a field.
- **Controls** — C10 + C04 (`type`, `autoComplete`, numeric mode for codes), C01 submit, C03 links, show-password toggle (C02).
- **Device needs** — password managers, autofill, passkeys and one-time-code autofill work on phones; usable in landscape with the keyboard open.
- **Accessibility** — `<form aria-labelledby>`; input `id`/`name` from constants (H-03); errors via `aria-describedby`; form error `role="alert"`; code field `autocomplete="one-time-code"`; focus to the first invalid field on submit; paste allowed everywhere (WCAG 3.3.8).
- **Loading** — submit shows progress, `aria-busy`, fields read-only.
- **Error** — Zod messages from constants; `REQUEST_FAILED`; `SESSION_UNAVAILABLE` with sign-in link; expired reset token → `AUTH_COPY.resetExpired` with "Request a new link".
- **Empty** — not applicable; forgot/reset confirmations are success states (`AUTH_COPY`).
- **Reuse** — five pages; `verify` inside C55 for step-up.
- **Technical notes** — `components/auth/auth-card.tsx` plus one file per variant; `components/common/login-form.tsx` (built) becomes the sign-in variant.

## Onboarding & verification

Every section reads one `VerificationCase` (`lib/types/verification.ts`): `id`, `workspaceId`, `state` (`not_started | in_progress | submitted | needs_info | approved | rejected`), `business`, `owners`, `documents`, `requests: InfoRequest[]`, `updatedAt`; via `use-verification-case` (`["verification", workspaceId]`, live — a decision should reach the owner without reload). Field lists are the jurisdiction-neutral minimum in `lib/data/verification-fields.ts` so answering OD1 changes data, not components.

### S09 — Verification progress

Pages: P07 · Contracts: [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Show where the owner is in verification and let them move between steps.
- **Responsibilities** — Derive each step's state (todo, current, done, attention) from the case; route via `?step=`; lock steps once `submitted` unless sent back as `needs_info`.
- **Content model** — Primary: "Step 2 of 4 · Beneficial owners". `OnboardingStep`: `id: business | owners | documents | review`, `label`, `state`. Definitions in `lib/data/onboarding-steps.ts`.
- **Data requirements** — `use-verification-case`; state by pure function `lib/utils/onboarding-progress.ts`.
- **Interaction model** — choosing a completed or current step changes `?step=`; future steps unavailable until prior steps are valid; Submit opens C52 ("You can't edit details while we review them") then sets `submitted`.
- **Controls** — C50, C01 Submit.
- **Device needs** — current step and total always discoverable on a phone.
- **Accessibility** — `<nav aria-label="Verification steps">` with `<ol>`; `aria-current="step"`; each step's state in its name ("Business details, complete").
- **Loading** — placeholder step list.
- **Error** — C33 with Retry; forms below do not render until the case loads.
- **Empty** — `not_started` is a real state: step 1 current with `EMPTY_STATES.verificationStart` ("Tell us about your business to open your accounts. It takes about 10 minutes.").
- **Reuse** — P07; C50 read-only in S52.
- **Technical notes** — `components/onboarding/onboarding-stepper.tsx`; the pure function is property-tested.

### S10 — Business details form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Capture the legal identity of the business.
- **Responsibilities** — Edit `BusinessDetails`, save drafts, validate, show any `InfoRequest` about these fields.
- **Content model** — Primary: legal name. `BusinessDetails`: `legalName`, `tradingName | null`, `entityType`, `registrationNumber`, `incorporatedOn` (ISO date), `country` (ISO 3166-1 alpha-2), `address: PostalAddress`, `website | null`.
- **Data requirements** — initial values from the case; save via `use-update-verification-case` (PATCH `business`), invalidates the case. Schema `lib/validations/business-details.ts`.
- **Interaction model** — explicit save, no autosave. Why: registration data is legal record, so the owner decides when it is written. Leaving with unsaved changes asks via C52. Form library LD3 pending.
- **Controls** — C10/C04, C06 (entity type, country), date input, C01.
- **Device needs** — address and organisation autofill on phones.
- **Accessibility** — address in a `<fieldset>`/`<legend>`; `autocomplete` (`organization`, `address-line1`, …); error summary linking to fields.
- **Loading** — placeholder fields.
- **Error** — field errors from Zod; save failure → message with Retry, values kept.
- **Empty** — blank fields with hints.
- **Reuse** — P07; read-only summary shared with S52.
- **Technical notes** — `components/onboarding/business-details-form.tsx` (+ `business-address-fieldset.tsx` if large).

### S11 — Beneficial owners form

Pages: P07 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C02](phase-6-interaction-contracts.md#c02--iconbutton) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Record everyone who owns or controls a large enough share.
- **Responsibilities** — List, add, edit, remove owners; keep the total ≤ 100%; mark the applicant.
- **Content model** — Primary: ownership declared ("75% of ownership declared"). `BeneficialOwner`: `id` (nanoid while draft), `fullName`, `dateOfBirth`, `nationality`, `ownershipBasisPoints` (integer 0–10000), `isController`, `address`.
- **Data requirements** — from the case; save PATCH `owners`; schema `lib/validations/beneficial-owner.ts` with sum ≤ 10000.
- **Interaction model** — each owner editable; remove via C52; the mandatory-owner threshold is a constant set by OD1.
- **Controls** — C10/C04 per field, C02 remove per owner, C01 "Add owner", C26 total.
- **Device needs** — baseline.
- **Accessibility** — each owner a `<fieldset>` (legend = name or "Owner 2"); total as `role="meter"` with value; removal announced and focus moved to the next owner or "Add owner".
- **Loading** — placeholder.
- **Error** — sum above 100% at form level beside the total; save failure → message.
- **Empty** — `EMPTY_STATES.owners` ("Add each person who owns 25% or more, or who controls the business." — threshold interpolated).
- **Reuse** — P07; read-only in S52.
- **Technical notes** — `beneficial-owners-form.tsx` + `beneficial-owner-fieldset.tsx`.

### S12 — Document upload

Pages: P07 · Contracts: [C49](phase-6-interaction-contracts.md#c49--file-upload) [C26](phase-6-interaction-contracts.md#c26--meter) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Collect the documents the review requires and show each one's status.
- **Responsibilities** — List required kinds; accept uploads; show progress and review status; allow replacement when asked.
- **Content model** — Primary: the next missing document. `VerificationDocument`: `id`, `kind`, `fileName`, `sizeBytes`, `status: uploading | uploaded | accepted | rejected`, `rejectionReason | null`, `uploadedAt`; required kinds in `lib/data/verification-fields.ts`.
- **Data requirements** — list from the case; `use-upload-document` (Server Action returns a signed target); success invalidates the case; MIME types and max size are constants.
- **Interaction model** — client checks type and size first, then uploads with progress; rejected documents show the reason and "Replace".
- **Controls** — C49, C01 "Replace", C02 "Cancel upload", C12.
- **Device needs** — camera capture or file picker on phones; no drag required.
- **Accessibility** — the upload control is a labelled file input; progress `role="progressbar"`; status changes announced ("Passport uploaded", "Rejected: image unreadable").
- **Loading** — placeholder rows; per-file progress.
- **Error** — too large/wrong type → inline before upload; failed upload → that row with Retry; case failure → C33.
- **Empty** — `EMPTY_STATES.documents` ("Upload a clear photo or PDF of each document below.").
- **Reuse** — P07; C49 behaviour shared with S26, S37.
- **Technical notes** — `document-upload.tsx` + `document-requirement-row.tsx`.

### S13 — Verification status notice

Pages: P07, P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Tell the owner in one sentence what verification is waiting on and what to do next.
- **Responsibilities** — Map case state to severity, message and action; list open `InfoRequest`s when `needs_info`; render nothing once `approved` on P08.
- **Content model** — Primary: the status sentence. Then state label and action ("Continue verification", "Respond to request"). `InfoRequest`: `id`, `message`, `fieldRef | null`, `createdAt`. Copy `VERIFICATION_COPY`.
- **Data requirements** — `use-verification-case`.
- **Interaction model** — action → `/onboarding?step=<step of first open request>`. Cannot be dismissed while `needs_info` or `rejected`. Why: those states block the accounts.
- **Controls** — C12, C03.
- **Device needs** — baseline.
- **Accessibility** — state in text; not a live region on page load (it is content, not a status change).
- **Loading** — renders nothing until the case loads (no placeholder on P08).
- **Error** — silent on P08 (S17 carries the retry); on P07, S09 owns it.
- **Empty** — `approved` on P08 renders nothing.
- **Reuse** — P07, P08 (informational variant for R2).
- **Technical notes** — `verification-status-banner.tsx` (1.0.0 name).

## Dashboard

### S14 — Cash position

Pages: P08 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C31](phase-6-interaction-contracts.md#c31--trend-summary)

- **Purpose** — Answer F1 in one glance: how much cash the business has now.
- **Responsibilities** — Total available balance across permitted accounts, per currency; today's net movement and a 30-day trend per total. Never add different currencies.
- **Content model** — Primary: total available balance per currency. `CashPosition`: `currency`, `available`, `current`, `netToday`, `trend: {date, closing}[]`, `asOf`.
- **Data requirements** — `use-accounts` (aggregate, live, refetch on focus).
- **Interaction model** — choosing the total goes to P09; the trend exposes date and closing balance per point on focus or pointer.
- **Controls** — C45, C40, C41, C31.
- **Device needs** — the total is readable first on a phone; the trend has a text equivalent.
- **Accessibility** — each total read as "Available balance, GBP, …, as of …"; trend has a text summary.
- **Loading** — placeholder per currency.
- **Error** — C33 with Retry. Never shows "0.00" in error. Why: a zero shown in error is the most damaging wrong figure possible.
- **Empty** — no permitted accounts: `EMPTY_STATES.cashPosition` ("No accounts to show yet. Accounts appear here once verification is approved."), linking R1 to P07.
- **Reuse** — P08 (not D4).
- **Technical notes** — `components/dashboard/cash-position-band.tsx` (1.0.0 name); LCP-critical, server-prefetched.

### S15 — Account summary

Pages: P08 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — List every account with its balance so the member can jump into a ledger.
- **Responsibilities** — Up to `DASHBOARD_ACCOUNT_LIMIT` accounts ordered by balance with name, masked number, state, available balance; link to the full list.
- **Content model** — Primary: each account's available balance. `Account`: `id`, `name`, `kind`, `last4`, `currency`, `available`, `current`, `state`, `openedAt`.
- **Data requirements** — `use-accounts`.
- **Interaction model** — each account → `/accounts/[accountId]`; "View all accounts" → P09.
- **Controls** — C43, C40.
- **Device needs** — every account's balance readable on a phone.
- **Accessibility** — a list; each item a link whose name includes account name and balance.
- **Loading** — placeholder rows.
- **Error** — C33 with Retry.
- **Empty** — `EMPTY_STATES.accounts` ("No accounts yet.").
- **Reuse** — P08.
- **Technical notes** — `account-summary-strip.tsx` (1.0.0 name).

### S16 — Recent activity

Pages: P08 · Contracts: [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Show the last few transactions across accounts so nothing new goes unseen.
- **Responsibilities** — Latest `DASHBOARD_ACTIVITY_LIMIT` (8) including pending; link to full search.
- **Content model** — Primary: each transaction's signed amount and counterparty. `Transaction`: `id`, `accountId`, `postedAt | null`, `createdAt`, `amount: Money`, `status`, `description`, `counterparty {id, name} | null`, `category | null`, `flagged`, `hasAttachments`, `reference`.
- **Data requirements** — `use-transactions` (limit variant).
- **Interaction model** — a row opens P12 as an overlay; "View all" → P11.
- **Controls** — C44.
- **Device needs** — rows openable by touch.
- **Accessibility** — pending status in text; amounts read with sign.
- **Loading** — placeholder rows.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.recentActivity` ("No transactions yet. New activity shows up here as soon as it posts.").
- **Reuse** — P08.
- **Technical notes** — `recent-activity.tsx`.

### S17 — Pending items

Pages: P08 · Contracts: [C12](phase-6-interaction-contracts.md#c12--status-label) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Collect everything waiting on the member or the bank into one short list.
- **Responsibilities** — Merge, ordered by urgency: pending transactions (count and total per account); exports `ready` or `failed`; verification requests (`needs_info`).
- **Content model** — Primary: the most urgent item. `PendingItem`: `id`, `kind: pending_transactions | export_ready | export_failed | verification_request`, `title`, `detail`, `href`, `severity`, `at`; derived in `lib/utils/pending-items.ts`.
- **Data requirements** — `use-transactions {status: pending}`, `use-exports`, `use-verification-case`, all live. Loading until all settle; error only if all fail; partial failure shows loaded items plus "Some items couldn't load · Retry".
- **Interaction model** — each item links to where it is resolved (P11 pending, P18, P07).
- **Controls** — C12, C03.
- **Device needs** — baseline.
- **Accessibility** — severity in text; list semantics.
- **Loading** — placeholder rows.
- **Error** — partial or complete as above.
- **Empty** — `EMPTY_STATES.pendingItems` ("Nothing waiting on you.").
- **Reuse** — P08 (D1–D3).
- **Technical notes** — `pending-items.tsx`. (1.0.0 `tone` field renamed `severity`.)

### S18 — Cash flow over time

Pages: P08 · Contracts: [C30](phase-6-interaction-contracts.md#c30--chart) [C23](phase-6-interaction-contracts.md#c23--tabs) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Show money in against money out over time, so the owner sees direction as well as level.
- **Responsibilities** — Inflow, outflow and net for the chosen range (30 days, 90 days, 12 months) with range totals.
- **Content model** — Primary: net for the range. `CashFlowSeries`: `currency`, `granularity`, `points: {periodStart, inflow, outflow, net}[]`, `totals`.
- **Data requirements** — `use-cash-flow` (standard); server-aggregated series only.
- **Interaction model** — C23 changes the range (URL param); each point exposes exact amounts via C40 on focus or pointer. Minor units convert to numbers for plotting only after checking `Number.MAX_SAFE_INTEGER`; labels always come from the original strings.
- **Controls** — C30, C23.
- **Device needs** — totals and a text or table equivalent are usable on a phone.
- **Accessibility** — summary sentence plus an accessible data table (Q-012); chart points keyboard-navigable.
- **Loading** — placeholder reserving the chart's space.
- **Error** — C33 in place.
- **Empty** — `EMPTY_STATES.cashFlow` ("Not enough activity to chart yet.").
- **Reuse** — P08 (D1, D2).
- **Technical notes** — `cash-flow-chart.tsx`; LD1 pending; lazy-loaded.

## Accounts & ledger

### S19 — Account list

Pages: P09 · Contracts: [C43](phase-6-interaction-contracts.md#c43--accountrow) [C15](phase-6-interaction-contracts.md#c15--table-family) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C40](phase-6-interaction-contracts.md#c40--amount) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Every account the member can see, with balance and state, as the way into each ledger.
- **Responsibilities** — Sortable list grouped by currency when more than one; available and current balance, state, masked number; link each to its ledger.
- **Content model** — Primary: available balance per account. `Account` (S15).
- **Data requirements** — `use-accounts`.
- **Interaction model** — choose → `/accounts/[accountId]`; sort by column (URL param); "Reveal" on C42 starts step-up (X4) and shows the full number for `REVEAL_TIMEOUT` seconds.
- **Controls** — C15, C43, C42, C40, C13.
- **Device needs** — name, masked number and available balance for every account on a phone.
- **Accessibility** — table semantics with `aria-sort`; state in text.
- **Loading** — placeholder rows.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.accounts`; R1 gets a link to P07 while not `approved`.
- **Reuse** — P09.
- **Technical notes** — `components/ledger/account-list.tsx`; server-prefetched.

### S20 — Account overview

Pages: P10 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C42](phase-6-interaction-contracts.md#c42--maskedaccountnumber) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Identify the account and give its balance at the top of the ledger's content.
- **Responsibilities** — Name, available balance, current balance, state, masked account and routing numbers with reveal and copy, "as of" time, hold amount.
- **Content model** — Primary: available balance. `AccountDetail` = `Account` + `routingNumberMasked`, `balanceAsOf`, `holdAmount`.
- **Data requirements** — `use-account`.
- **Interaction model** — reveal needs step-up; the backend audit-logs it; copy copies what is displayed (masked unless revealed); `frozen`/`closed` show a state label and an explanation from `ACCOUNT_STATE_COPY`.
- **Controls** — C40, C42, C51, C12.
- **Device needs** — baseline.
- **Accessibility** — balances labelled "Available balance" and "Current balance"; reveal announces the change and the re-mask.
- **Loading** — placeholder.
- **Error** — 404 → segment `not-found`; other → C33.
- **Empty** — not applicable.
- **Reuse** — P10.
- **Technical notes** — `account-hero.tsx` (1.0.0 name); server-prefetched.

### S21 — Ledger filters

Pages: P10, P11, P14, P19 · Contracts: [C46](phase-6-interaction-contracts.md#c46--filter-set) [C47](phase-6-interaction-contracts.md#c47--active-filter) [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Narrow the ledger to what the member is looking for, and keep that in the URL.
- **Responsibilities** — Search text, date range, status, direction, amount range, category, flagged; active filters listed with individual removal; save as view; clear all.
- **Content model** — Primary (search variant): the query and the result count. `LedgerFilters` (Zod over `URLSearchParams`): `q?`, `from?`, `to?`, `status?`, `direction?`, `minAmountMinor?`, `maxAmountMinor?`, `category?`, `flagged?`, `accountId?`. `SavedView`: `id`, `name`, `filters`, `createdAt`.
- **Data requirements** — `use-saved-views` for the views menu.
- **Interaction model** — every change updates the URL; S23 reacts to the URL only. Why: decoupled sections, shareable links. Removing an active filter clears only it. "Save view" opens C21 for a name. `/` focuses search.
- **Controls** — C46, C47, C48, C11, C20, C01.
- **Device needs** — every filter available on a phone, possibly behind one "Filters" control.
- **Accessibility** — every filter labelled; result count announced once per change; invalid link params reported in text ("1 filter in this link was ignored").
- **Loading** — renders immediately; views menu loads on open.
- **Error** — invalid params dropped with a notice; views load failure inline in the menu; save failure → message.
- **Empty** — no saved views → `EMPTY_STATES.savedViewsMenu` ("Save filters you use often.").
- **Reuse** — P10, P11 (search variant), P14 (flagged fixed), P19.
- **Technical notes** — `ledger-toolbar.tsx` (1.0.0 name).

### S22 — Ledger summary

Pages: P10 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C40](phase-6-interaction-contracts.md#c40--amount)

- **Purpose** — Summarise the filtered ledger: in, out, net, count.
- **Responsibilities** — Totals for exactly S21's filters; opening and closing balance when the date range is bounded.
- **Content model** — Primary: net for the filter. `LedgerSummary`: `currency`, `inflow`, `outflow`, `net`, `count`, `opening | null`, `closing | null`.
- **Data requirements** — `use-ledger-summary` (live); server-computed, never summed from loaded rows.
- **Interaction model** — read only; the count equals S23's range total.
- **Controls** — C45, C40.
- **Device needs** — baseline.
- **Accessibility** — each figure labelled.
- **Loading** — placeholder.
- **Error** — C33.
- **Empty** — zero matches show real zeros; S23 shows "none match".
- **Reuse** — P10.
- **Technical notes** — `ledger-summary.tsx`.

### S23 — Ledger entries

Pages: P10, P11, P14, P19 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C44](phase-6-interaction-contracts.md#c44--transactionrow) [C25](phase-6-interaction-contracts.md#c25--pagination) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — List the transactions matching the filters, fast at 5 million rows.
- **Responsibilities** — Virtualized, cursor-paginated list: date, description with counterparty, category, status, amount, running balance (P10 only; hidden or labelled unfiltered when filters hide rows, Q-214). Flag and attachment markers. Open detail. Keep position when returning.
- **Content model** — Primary: each row's signed amount. `Transaction` + `runningBalance | null`; read as `CursorPage<Transaction>`.
- **Data requirements** — `use-transactions` infinite with `maxPages`; `keepPreviousData` on filter change.
- **Interaction model** — nearing the end fetches the next page; "Load more" is the keyboard/screen-reader equivalent. Enter or click opens P12 as an overlay (P10/P11). ↑/↓ move the active row; Enter opens; `F` toggles flag on the active row; row menu offers "Copy link" and "Flag".
- **Controls** — C53, C44, C25, C20.
- **Device needs** — on a phone each row shows at least amount, counterparty/description, date and status; rows open by touch; no horizontal page scroll.
- **Accessibility** — `<table>` with `<caption>` summarising filters; `aria-rowcount` from S22 (or -1); `aria-rowindex` per row; `aria-sort`; one status message "Showing 100 of 4,210 transactions"; debits read with a minus; focus returns to the originating row after the overlay closes.
- **Loading** — first load placeholder rows; filter change keeps previous rows with `aria-busy`; next page appends placeholder rows.
- **Error** — first-load → C33; next-page → inline "Couldn't load more · Retry", loaded rows kept.
- **Empty** — none yet `EMPTY_STATES.ledger` ("No transactions on this account yet."); none match `EMPTY_STATES.ledgerFiltered` ("No transactions match these filters." + Clear filters); flagged `EMPTY_STATES.flagged` ("Nothing flagged. Flag a transaction to come back to it here.").
- **Reuse** — P10, P11, P14, P19; the pattern for S49.
- **Technical notes** — `ledger-table.tsx` + `ledger-columns.ts`, `ledger-table-row.tsx`, `ledger-load-more-row.tsx`; LD2 required at this scale; fixed row size so the virtualizer uses a constant estimate.

## Transactions

P12 renders S24–S26 as a full page or inside the intercepted overlay.

### S24 — Transaction detail

Pages: P12 · Contracts: [C40](phase-6-interaction-contracts.md#c40--amount) [C12](phase-6-interaction-contracts.md#c12--status-label) [C51](phase-6-interaction-contracts.md#c51--copybutton) [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Everything known about one transaction.
- **Responsibilities** — Amount, status, description, counterparty, account, created and posted dates, reference, category, flag, raw bank descriptor; copy link and copy reference.
- **Content model** — Primary: the signed amount. `TransactionDetail` = `Transaction` + `bankDescriptor`, `method`, `accountName`, `accountLast4`, `events`, `notes`, `attachments`.
- **Data requirements** — `use-transaction` (standard).
- **Interaction model** — in the overlay, Escape or close returns to the list and restores focus; "Open full page"; "Copy link" copies `/transactions/[id]`; counterparty → P19; `reversed` links to the original transaction (Q-066).
- **Controls** — C40, C12, C51, C22, C27.
- **Device needs** — baseline.
- **Accessibility** — the overlay is a labelled dialog; amount with sign and status in text.
- **Loading** — known row fields shown immediately; the rest as placeholders.
- **Error** — not found → segment `not-found`; other → C33 in the overlay.
- **Empty** — not applicable.
- **Reuse** — P12 (page and overlay); facts reused read-only in S53.
- **Technical notes** — `components/transactions/transaction-detail.tsx`.

### S25 — Transaction lifecycle

Pages: P12 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C27](phase-6-interaction-contracts.md#c27--number-display)

- **Purpose** — Show how the transaction moved through its lifecycle.
- **Responsibilities** — Ordered events: created, pending, posted, returned, reversed, failed, note added, attachment added, flagged; time and actor.
- **Content model** — Primary: the current state and when it was reached. `TransactionEvent`: `id`, `kind`, `at`, `actor {id, name} | null`, `detail | null`.
- **Data requirements** — from `use-transaction`.
- **Interaction model** — read only.
- **Controls** — C13, C27.
- **Device needs** — baseline.
- **Accessibility** — ordered list; each event's kind in text; times include zone on request.
- **Loading / Error** — shares S24's.
- **Empty** — always at least "Created".
- **Reuse** — P12.
- **Technical notes** — `transaction-timeline.tsx` (1.0.0 name).

### S26 — Notes & attachments

Pages: P12 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C49](phase-6-interaction-contracts.md#c49--file-upload) [C01](phase-6-interaction-contracts.md#c01--button) [C09](phase-6-interaction-contracts.md#c09--switch) [C06](phase-6-interaction-contracts.md#c06--select) [C59](phase-6-interaction-contracts.md#c59--permissiongate)

- **Purpose** — Let the member annotate a transaction for their books.
- **Responsibilities** — Set category, toggle flag, add/delete notes, upload/download/delete receipts. Viewers read only.
- **Content model** — Primary: the latest note and whether a receipt is attached. `TransactionNote`: `id`, `body`, `author`, `createdAt`. `Attachment`: `id`, `fileName`, `mimeType`, `sizeBytes`, `uploadedAt`, `uploadedBy`. `TransactionAnnotationInput`: `category?`, `flagged?`, `note?`.
- **Data requirements** — `use-update-transaction`, `use-upload-attachment`; delete hooks per Q2.
- **Interaction model** — category and flag save on change, optimistic with rollback (annotations, not money); notes save on submit or ⌘/Ctrl+Enter; deletes via C52; C59 hides controls from R4; a note changed underneath the member is surfaced (concurrent edit).
- **Controls** — C05, C49, C01, C09, C06, C52, C59.
- **Device needs** — photograph a receipt on a phone and attach it.
- **Accessibility** — every control labelled; save results announced.
- **Loading** — placeholder until the transaction loads; per-upload progress.
- **Error** — rollback → message with Retry; failed upload → that item with Retry; draft kept on failure and across session expiry (X4).
- **Empty** — `EMPTY_STATES.notes` ("No notes yet."), `EMPTY_STATES.attachments` ("Attach a receipt or invoice.").
- **Reuse** — P12.
- **Technical notes** — `notes-and-attachments.tsx`.

### S27 — Saved views list

Pages: P13 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Manage the member's saved filter sets.
- **Responsibilities** — Name, filter summary, match count when known, created date; open, rename, delete, set default.
- **Content model** — Primary: view names. `SavedView` + `filtersSummary` from `lib/utils/describe-filters.ts`.
- **Data requirements** — `use-saved-views` (slow).
- **Interaction model** — open → `/transactions?<filters>`; inline rename; delete via C52.
- **Controls** — C15, C20, C52.
- **Device needs** — baseline.
- **Accessibility** — rename field labelled; deletion announced.
- **Loading** — placeholder rows.
- **Error** — C33; rename conflict inline.
- **Empty** — `EMPTY_STATES.savedViews` ("No saved views. Filter the ledger, then choose Save view."), link to P11.
- **Reuse** — P13.
- **Technical notes** — `saved-views-list.tsx`.

## Insights

### S28 — Period comparison

Pages: P15 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C30](phase-6-interaction-contracts.md#c30--chart) [C40](phase-6-interaction-contracts.md#c40--amount) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C15](phase-6-interaction-contracts.md#c15--table-family)

- **Purpose** — Compare two periods so a finance lead can explain what changed.
- **Responsibilities** — Pick periods A and B; inflow, outflow, net per period with deltas; change by category and top counterparties.
- **Content model** — Primary: net change. `PeriodComparison`: `currency`, `a`, `b` (`PeriodTotals {from, to, inflow, outflow, net}`), `byCategory: {category, a, b, deltaBasisPoints | null}[]`, `topCounterparties`.
- **Data requirements** — `use-compare-periods` (standard).
- **Interaction model** — two C48 fields with a "previous period" preset for B; choosing a category → P11 filtered to category and period B.
- **Controls** — C48, C30, C40, C41, C15.
- **Device needs** — both periods selectable and results readable as text on a phone.
- **Accessibility** — chart text alternative; deltas in words ("up 4.2%").
- **Loading** — placeholder.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.compare` ("No activity in either period. Try a wider range.").
- **Reuse** — P15.
- **Technical notes** — `components/insights/period-comparison.tsx`; LD1.

### S29 — Runway calculator

Pages: P16 · Contracts: [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C40](phase-6-interaction-contracts.md#c40--amount) [C30](phase-6-interaction-contracts.md#c30--chart) [C26](phase-6-interaction-contracts.md#c26--meter)

- **Purpose** — Estimate how many months current cash lasts at a given burn.
- **Responsibilities** — Pre-fill cash and average net burn; allow overrides plus expected monthly inflow; project months and run-out date; label everything as an estimate, never a bank forecast.
- **Content model** — Primary: months of runway with its assumptions. `RunwayInput`: `cashMinor`, `monthlyBurnMinor`, `monthlyInflowMinor`, `currency`. `RunwayResult`: `months | null`, `runsOutOn | null`, `series`.
- **Data requirements** — `use-accounts`, `use-cash-flow`; pure `lib/utils/runway.ts`.
- **Interaction model** — recalculates on change; "Reset to actuals"; overrides in the URL.
- **Controls** — C04, C10, C40, C30, C26.
- **Device needs** — numeric keyboard; result readable without the chart.
- **Accessibility** — result announced politely after edits settle.
- **Loading** — inputs usable immediately.
- **Error** — defaults failed → blank inputs with "Couldn't load your balances. Enter figures to estimate."
- **Empty** — `months: null` → `RUNWAY_COPY.notBurning` ("Your inflow covers your spending at these figures.").
- **Reuse** — P16.
- **Technical notes** — `runway-calculator.tsx`.

## Documents

### S30 — Statement list

Pages: P17 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Download the monthly statement for any account and month.
- **Responsibilities** — Statements per account and month with period, opening and closing balance, availability; filter by account and year; download PDF.
- **Content model** — Primary: each month's download. `Statement`: `id`, `accountId`, `accountName`, `periodStart`, `periodEnd`, `opening`, `closing`, `status: available | generating`, `generatedAt | null`.
- **Data requirements** — `use-statements` (slow); download URL fetched on click.
- **Interaction model** — selects change the URL; download opens the signed URL; `generating` shows its state and download is unavailable.
- **Controls** — C15, C06, C01, C12.
- **Device needs** — downloads work on phones.
- **Accessibility** — download actions name the account and month.
- **Loading** — placeholder rows; per-row progress for the link.
- **Error** — C33; download link failure → message with Retry.
- **Empty** — `EMPTY_STATES.statements` ("Your first statement is ready after the end of your first full month.").
- **Reuse** — P17.
- **Technical notes** — `components/documents/statement-list.tsx`.

### S31 — Export builder

Pages: P18 · Contracts: [C48](phase-6-interaction-contracts.md#c48--daterangefield) [C06](phase-6-interaction-contracts.md#c06--select) [C07](phase-6-interaction-contracts.md#c07--checkbox) [C08](phase-6-interaction-contracts.md#c08--radiogroup) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Start an export for a chosen period, accounts and format.
- **Responsibilities** — Date range, accounts, format (CSV or OFX-style, `EXPORT_FORMATS`), columns, include-pending (default posted only); submit as a job.
- **Content model** — Primary: the create action and what it will include. `CreateExportInput`: `from`, `to`, `accountIds` (≥ 1), `format`, `columns`, `includePending`.
- **Data requirements** — `use-create-export`.
- **Interaction model** — submit creates a job and moves focus to it in S32; it never waits for the file. Hidden from R4 (C59).
- **Controls** — C48, C06, C07, C08, C01.
- **Device needs** — baseline.
- **Accessibility** — groups in fieldsets; the created job announced.
- **Loading** — renders immediately.
- **Error** — Zod field errors (e.g. range longer than `EXPORT_MAX_RANGE_DAYS`); transport → message.
- **Empty** — no accounts → `EMPTY_STATES.accounts`.
- **Reuse** — P18.
- **Technical notes** — `export-builder.tsx`. (`includePending` made explicit in 2.0.0 from the Phase 2 assumption.)

### S32 — Export jobs

Pages: P18 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C17](phase-6-interaction-contracts.md#c17--progress-indicator) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Track export jobs and download finished files.
- **Responsibilities** — Jobs with period, format, state, requester, expiry; poll while any job is `queued`/`running`; download `ready`.
- **Content model** — Primary: the newest job's state. `ExportJob`: `id`, `status`, `from`, `to`, `format`, `accountIds`, `requestedBy`, `createdAt`, `expiresAt | null`, `rowCount | null`, `failureReason | null`.
- **Data requirements** — `use-exports` with `refetchInterval` while active, off in background tabs.
- **Interaction model** — `ready` → Download; `failed` → reason + "Try again" (same input); `expired` → "Create again" (prefilled).
- **Controls** — C15, C12, C17, C01.
- **Device needs** — baseline.
- **Accessibility** — state changes announced once ("Export ready").
- **Loading** — placeholder rows.
- **Error** — C33 on first load; failed polls keep data and retry quietly.
- **Empty** — `EMPTY_STATES.exports` ("No exports yet. Choose a period above to create one.").
- **Reuse** — P18; S17 reads the same data.
- **Technical notes** — `export-jobs.tsx`.

## Counterparties

### S33 — Counterparty summary

Pages: P19 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C40](phase-6-interaction-contracts.md#c40--amount) [C45](phase-6-interaction-contracts.md#c45--metric)

- **Purpose** — Who this counterparty is and how much has moved with them.
- **Responsibilities** — Name, identity mark, known identifiers, first/last dates, totals in and out over 12 months.
- **Content model** — Primary: total paid in the period. `Counterparty`: `id`, `name`, `kind`, `identifiers`, `firstSeenAt`, `lastSeenAt`, `totals {inflow, outflow, count}`, `currency`.
- **Data requirements** — `use-counterparty` (standard).
- **Interaction model** — read only; S23 on the page gets `counterpartyId` as a locked filter.
- **Controls** — C18, C40, C45.
- **Device needs** — baseline.
- **Accessibility** — figures labelled.
- **Loading** — placeholder.
- **Error** — not found → `not-found`; other → C33.
- **Empty** — not applicable (a counterparty exists only because transactions do).
- **Reuse** — P19.
- **Technical notes** — `components/counterparties/counterparty-summary.tsx`.

## Inbox

### S34 — Notification feed

Pages: P20 · Contracts: [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C03](phase-6-interaction-contracts.md#c03--textlink) [C25](phase-6-interaction-contracts.md#c25--pagination) [C32](phase-6-interaction-contracts.md#c32--emptystate)

- **Purpose** — Every alert and system notice for the member, newest first.
- **Responsibilities** — Kind, message, time, read state; mark one/all read; link to the subject; unread filter.
- **Content model** — Primary: unread items. `Notification`: `id`, `kind: low_balance | large_transaction | statement_ready | export_ready | verification_needs_info | member_joined`, `title`, `body`, `href | null`, `createdAt`, `readAt | null`.
- **Data requirements** — `use-notifications` (cursor), `use-mark-notifications-read`.
- **Interaction model** — choosing marks read and follows `href`; "Mark all as read" asks nothing (reversible via the filter); unread toggle in the URL.
- **Controls** — C13, C03, C25.
- **Device needs** — baseline.
- **Accessibility** — read state in text; relative times carry absolute time as accessible text.
- **Loading** — placeholder rows.
- **Error** — C33; failed mark-read reverts with a message.
- **Empty** — `EMPTY_STATES.notifications` ("You're all caught up."), `notificationsUnread` ("No unread notifications.").
- **Reuse** — P20.
- **Technical notes** — `components/inbox/notification-feed.tsx`.

### S35 — Alert rules

Pages: P22 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C04](phase-6-interaction-contracts.md#c04--input) [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select)

- **Purpose** — Owners and finance leads choose which events alert them, at what thresholds.
- **Responsibilities** — Toggle each alert kind; thresholds (low balance per account, large transaction); delivery (in-app always, email optional).
- **Content model** — Primary: which alerts are on. `AlertRule`: `id`, `kind`, `enabled`, `threshold | null`, `accountId | null`, `channels`.
- **Data requirements** — `use-alert-rules`, `use-update-alert-rules` (slow). Schema `lib/validations/alert-rule.ts`.
- **Interaction model** — enabling a rule reveals its threshold; explicit save; read-only for R3, hidden for R4 (C59).
- **Controls** — C09, C04, C10, C06.
- **Device needs** — numeric keyboard for thresholds.
- **Accessibility** — each rule a labelled group; revealed threshold announced by focus order, not motion.
- **Loading** — placeholder.
- **Error** — C33 on load; field errors and a message on save.
- **Empty** — not applicable: kinds are fixed and always listed, off by default (P22 offers starter values).
- **Reuse** — P22.
- **Technical notes** — `components/settings/alert-rules.tsx`.

### S36 — Thread list

Pages: P21 · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C13](phase-6-interaction-contracts.md#c13--status-indicator) [C11](phase-6-interaction-contracts.md#c11--searchinput)

- **Purpose** — The member's secure threads with support.
- **Responsibilities** — Subject, last excerpt and time, unread, status (open/closed); search subjects; start a thread.
- **Content model** — Primary: threads with unread replies. `Thread`: `id`, `subject`, `status`, `lastMessage {excerpt, at, author}`, `unread`.
- **Data requirements** — `use-threads`.
- **Interaction model** — choose → `/messages/[threadId]`; "New message" opens S37 in compose mode; stays available across threads on larger screens (layout).
- **Controls** — C18, C13, C11.
- **Device needs** — list and a thread each fully usable on a phone.
- **Accessibility** — unread and status in text.
- **Loading** — placeholder rows.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.threads` ("No messages. Start a conversation with our support team."), `threadsFiltered` ("No threads match that search.").
- **Reuse** — P21.
- **Technical notes** — `thread-list.tsx`.

### S37 — Conversation

Pages: P21 · Contracts: [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C18](phase-6-interaction-contracts.md#c18--avatar) [C49](phase-6-interaction-contracts.md#c49--file-upload)

- **Purpose** — Read and reply within one thread.
- **Responsibilities** — Messages in order with author, time, attachments; compose and send with attachments; state when closed.
- **Content model** — Primary: the reply composer and the newest message. `Message`: `id`, `threadId`, `author {id, name, avatarUrl, isStaff}`, `body`, `attachments`, `sentAt`. `SendMessageInput`: `body` (1–`MESSAGE_MAX_LENGTH`), `attachmentIds`.
- **Data requirements** — `use-thread`, `use-send-message`.
- **Interaction model** — ⌘/Ctrl+Enter sends; "Load earlier messages"; composer disabled for closed threads (`MESSAGE_COPY.closed`); drafts persist per thread locally.
- **Controls** — C05, C01, C18, C49.
- **Device needs** — attachments from files or camera; composer usable with the keyboard open.
- **Accessibility** — messages as a list with author and time; new incoming messages announced politely; send shortcut declared (`aria-keyshortcuts`).
- **Loading** — placeholder messages; composer usable.
- **Error** — C33 for the thread; failed send keeps the text, marks "Not sent — Retry".
- **Empty** — compose mode: subject field plus `EMPTY_STATES.conversationNew` ("Describe what you need. Don't include full account numbers or passwords.").
- **Reuse** — P21; staff side in S53.
- **Technical notes** — `conversation.tsx`.

## Settings & team

### S38 — Workspace general form

Pages: P22 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Edit workspace display settings.
- **Responsibilities** — Display name, default currency view, time zone, week start; legal name read-only (from verification).
- **Content model** — Primary: the workspace display name. `WorkspaceSettings`: `displayName`, `timeZone` (IANA), `weekStartsOn: 0 | 1`, `defaultCurrency`; `legalName` read-only.
- **Data requirements** — `use-workspace`, `use-update-workspace`.
- **Interaction model** — explicit save; leave prompt for unsaved changes; read-only for R2 (C59).
- **Controls** — C10, C04, C06, C01.
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only, not disabled-looking only.
- **Loading** — placeholder.
- **Error** — C33 on load; field errors and message on save.
- **Empty** — not applicable.
- **Reuse** — P22.
- **Technical notes** — `workspace-general-form.tsx`.

### S39 — Team members

Pages: P23 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C20](phase-6-interaction-contracts.md#c20--menu)

- **Purpose** — Who has access and with what role.
- **Responsibilities** — Members and pending invitations with name, email, role, status, last active; change role; remove; resend/revoke invitations.
- **Content model** — Primary: member count and pending invitations. `Member`: `id`, `userId | null`, `name | null`, `email`, `role` (`owner | finance | accountant | viewer`), `status: active | invited | suspended`, `lastActiveAt | null`, `invitedAt | null`.
- **Data requirements** — `use-team` (slow, server-paged for 200 members).
- **Interaction model** — row menu: Change role, Remove (C52 naming the person and what they lose), Resend/Revoke; last owner cannot be demoted or removed (items unavailable with the reason); R2 manages only viewers and accountants; name → P24.
- **Controls** — C15, C18, C12, C20, C52.
- **Device needs** — role change possible on a phone.
- **Accessibility** — row menus named per member ("Actions for Ada Lovelace").
- **Loading** — placeholder rows.
- **Error** — C33; failed mutation → message, row unchanged.
- **Empty** — always at least the owner; owner only → `EMPTY_STATES.teamSolo` ("Invite your finance lead or accountant to work alongside you.").
- **Reuse** — P23.
- **Technical notes** — `team-table.tsx` (1.0.0 name).

### S40 — Invite member form

Pages: P23 · Contracts: [C21](phase-6-interaction-contracts.md#c21--dialog) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Invite a person with a role (the only way non-owners join, BR12).
- **Responsibilities** — Email and role; show what the role can do (from the matrix); choose accounts for a viewer; send.
- **Content model** — Primary: the email and role being granted. `InviteMemberInput`: `email`, `role: Exclude<WorkspaceRole, "owner">`, `accountIds | null` (viewer only).
- **Data requirements** — `use-invite-member`.
- **Interaction model** — opens in C21 from "Invite"; success closes it with "Invitation sent to {email}" and the pending member appears in S39; an existing member → field error.
- **Controls** — C21, C10, C04, C06, C07 (accounts), C01.
- **Device needs** — baseline.
- **Accessibility** — dialog labelled; role description read with the role choice.
- **Loading** — submit progress.
- **Error** — Zod/server field errors; transport error inline, dialog stays open.
- **Empty** — not applicable.
- **Reuse** — P23.
- **Technical notes** — `invite-member-form.tsx`.

### S41 — Role permissions reference

Pages: P23, P24 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C13](phase-6-interaction-contracts.md#c13--status-indicator)

- **Purpose** — Show plainly what each role can and cannot do.
- **Responsibilities** — Capabilities × roles with yes/no; on P24 the member's role is marked.
- **Content model** — Primary: the capabilities of the role in question. `PermissionMatrix` (`lib/data/permission-matrix.ts`): `capabilities {id, label}[]`, `grants: Record<WorkspaceRole, string[]>`. The same source drives C59. Why: the table members read and the rules the UI applies cannot disagree.
- **Data requirements** — none (static).
- **Interaction model** — read only; `highlightRole?` prop.
- **Controls** — C15, C13.
- **Device needs** — readable on a phone (each role's capabilities can be read as a list).
- **Accessibility** — table with row and column headers; yes/no in text.
- **Loading / Error** — none.
- **Empty** — not applicable.
- **Reuse** — P23, P24.
- **Technical notes** — `role-permissions-matrix.tsx` (1.0.0 name), Server Component.

### S42 — Profile form

Pages: P25 (edit), P24 (read) · Contracts: [C18](phase-6-interaction-contracts.md#c18--avatar) [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — A person's profile: the member edits their own (P25); an owner or finance lead views a teammate's (P24).
- **Responsibilities** — Full name, email, identity image, phone (optional), bio; edit mode saves; read mode adds role and join date.
- **Content model** — Primary: name (and role in read mode). `Profile` = `userResponseDtoSchema.pick({ fullName, email, phoneNumber, avatar, bio })`; email read-only (change needs verification, Q2).
- **Data requirements** — `use-me`, `use-update-profile`; `use-team-member` in read mode.
- **Interaction model** — explicit save; read mode has only a back link to P23.
- **Controls** — C18, C10, C04, C05, C01.
- **Device needs** — name and phone autofill.
- **Accessibility** — definition list in read mode.
- **Loading** — placeholder.
- **Error** — C33; not-found member → `not-found`; save errors per field or message.
- **Empty** — blank optional fields read "Not provided".
- **Reuse** — P24, P25.
- **Technical notes** — `profile-form.tsx`.

### S43 — Security settings

Pages: P25 · Contracts: [C09](phase-6-interaction-contracts.md#c09--switch) [C15](phase-6-interaction-contracts.md#c15--table-family) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Let the member secure their sign-in.
- **Responsibilities** — Change password; enrol/disable two-step (passkey + TOTP, OD6); list sessions (device, approximate location, last active); revoke any but current; "Sign out everywhere else".
- **Content model** — Primary: whether two-step is on. `ChangePasswordInput`: `current`, `next`, `confirm` (`next ≠ current`, `PASSWORD_MIN_LENGTH`). `Session`: `id`, `device`, `approximateLocation | null`, `createdAt`, `lastActiveAt`, `current`. `TwoStepStatus`: `enabled`, `methods`.
- **Data requirements** — `use-change-password`, `use-sessions`, `use-two-step`.
- **Interaction model** — disabling two-step, revoking and revoke-all confirm via C52; enrolment is a guided flow in C21 (QR plus copyable key and code check, or passkey); step-up required for password, two-step and revoke-all; after a password change other sessions end and the member is told.
- **Controls** — C09, C15, C52, C21, C01.
- **Device needs** — enrol a passkey on the device in hand; TOTP without scanning.
- **Accessibility** — the QR code has the key as text; results announced.
- **Loading** — placeholder per block.
- **Error** — per block C33; wrong current password is a field error.
- **Empty** — sessions include the current one; two-step off → `SECURITY_COPY.twoStepOff` ("Two-step verification is off. Add a passkey to protect your account.").
- **Reuse** — P25.
- **Technical notes** — `security-settings.tsx`.

## Payments

Specified, Deferred (OD3). **OD9** may bring payments and approvals into scope.

### S44 — Transfer form

Pages: P26 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C04](phase-6-interaction-contracts.md#c04--input) [C06](phase-6-interaction-contracts.md#c06--select) [C40](phase-6-interaction-contracts.md#c40--amount) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Move money between own accounts or to a saved payee (F6).
- **Responsibilities** — Source and destination; amount and memo; check available balance and limits; review; confirm with step-up; show result and reference.
- **Content model** — Primary (review): the amount in figures and words. `TransferInput`: `fromAccountId`, `toAccountId | payeeId`, `amountMinor`, `currency`, `memo | null`, `idempotencyKey` (nanoid, once per review). Why: a double submit must never send twice.
- **Data requirements** — `use-accounts`, `use-create-transfer`.
- **Interaction model** — two steps (edit, review); nothing sent from edit; review confirms via C52 with step-up; success links to the pending transaction in P12; nothing optimistic.
- **Controls** — C10, C04, C06, C40, C52.
- **Device needs** — full review on a phone before confirming.
- **Accessibility** — amount read in words at review; errors linked to fields.
- **Loading** — confirm disabled until the backend answers.
- **Error** — insufficient funds, over limit, frozen → field errors from `TRANSFER_COPY`; uncertain outcome → "We couldn't confirm this transfer. Check Recent activity before trying again", key kept, no auto-retry.
- **Empty** — `EMPTY_STATES.transfer` ("Add a payee or open a second account to transfer money.").
- **Reuse** — P26 (and P27 via payee preselection).
- **Technical notes** — `components/payments/transfer-form.tsx`.

### S45 — Payee list

Pages: P27 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C20](phase-6-interaction-contracts.md#c20--menu) [C01](phase-6-interaction-contracts.md#c01--button)

- **Purpose** — Manage payees and start a payment (F7).
- **Responsibilities** — Name, masked destination, last paid, total paid; add, edit, remove; pay (→ S44 preselected).
- **Content model** — Primary: payee names. `Payee`: `id`, `name`, `destinationLast4`, `bankName | null`, `lastPaidAt | null`, `totalPaid`, `status: active | pending_verification`.
- **Data requirements** — `use-payees`.
- **Interaction model** — "Pay" → `/payments/transfer?payeeId=`; remove via C52; new payee needs step-up; changed bank details require confirmation.
- **Controls** — C15, C20, C01, C52.
- **Device needs** — baseline.
- **Accessibility** — pay actions name the payee.
- **Loading** — placeholder rows.
- **Error** — C33; duplicate inline.
- **Empty** — `EMPTY_STATES.payees` ("No payees yet.").
- **Reuse** — P27.
- **Technical notes** — `payee-list.tsx`.

## Help

### S46 — Help search & categories

Pages: P28 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C14](phase-6-interaction-contracts.md#c14--content-group) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Find the right article in one search.
- **Responsibilities** — Client search over titles and summaries; categories; link to messaging (signed in) or sign-in (visitor).
- **Content model** — Primary: the search. `HelpArticle`: `slug`, `title`, `summary`, `category`, `body: HelpBlock[]`, `updatedOn`. `HelpCategory`: `id`, `title`, `description`, `icon`.
- **Data requirements** — static `lib/data/help-articles.ts`.
- **Interaction model** — results update as the member types (debounced); a category filters; results → `/help/[slug]`; query in `?q=`.
- **Controls** — C11, C14, C03.
- **Device needs** — baseline.
- **Accessibility** — result count announced.
- **Loading / Error** — none.
- **Empty** — `EMPTY_STATES.helpSearch` ("No articles match. Try different words, or message our support team.").
- **Reuse** — P28.
- **Technical notes** — `components/help/help-search.tsx`.

### S47 — Help article

Pages: P28 · Contracts: [C29](phase-6-interaction-contracts.md#c29--breadcrumbs) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Answer one question well.
- **Responsibilities** — Body blocks (paragraph, list, steps, note), breadcrumbs, last-updated date, related articles.
- **Content model** — Primary: the answer. `HelpBlock` = `{kind: "p"; text} | {kind: "list"; items} | {kind: "steps"; items} | {kind: "note"; severity; text}`.
- **Data requirements** — static.
- **Interaction model** — read only; missing slug → `not-found`.
- **Controls** — C29, C03.
- **Device needs** — readable without zoom.
- **Accessibility** — steps as an ordered list; notes labelled by severity in text.
- **Loading** — none.
- **Error** — not found only.
- **Empty** — not applicable.
- **Reuse** — P28.
- **Technical notes** — `help-article.tsx`, Server Component. Articles describe shipped behaviour only (Q-248).

## Internal

### S48 — Platform growth figures

Pages: P29 · Contracts: [C45](phase-6-interaction-contracts.md#c45--metric) [C30](phase-6-interaction-contracts.md#c30--chart) [C41](phase-6-interaction-contracts.md#c41--deltachip) [C23](phase-6-interaction-contracts.md#c23--tabs)

- **Purpose** — Platform growth at a glance.
- **Responsibilities** — New users for the period (day, month, year) with change vs previous period and a series; switch period.
- **Content model** — Primary: total for the period. Contract `PeriodTotalResponseDto` (`period`, `start`, `end`, `total`) and `PeriodSeriesResponseDto` (`points: {key, value}[]`). Counts, not money → C27.
- **Data requirements** — `use-admin-user-total`, `use-admin-user-series` (exist).
- **Interaction model** — C23 switches period; points expose values on focus.
- **Controls** — C45, C30, C41, C23.
- **Device needs** — text equivalent on a phone.
- **Accessibility** — chart text alternative.
- **Loading** — placeholders per block.
- **Error** — C33 per block.
- **Empty** — 0 is a real value shown as "0"; no points → `EMPTY_STATES.adminSeries` ("No sign-ups in this period.").
- **Reuse** — P29.
- **Technical notes** — `components/admin/admin-kpi-band.tsx` (1.0.0 name).

### S49 — Platform user directory

Pages: P30 · Contracts: [C53](phase-6-interaction-contracts.md#c53--datatable) [C18](phase-6-interaction-contracts.md#c18--avatar) [C12](phase-6-interaction-contracts.md#c12--status-label) [C11](phase-6-interaction-contracts.md#c11--searchinput) [C20](phase-6-interaction-contracts.md#c20--menu) [C21](phase-6-interaction-contracts.md#c21--dialog)

- **Purpose** — Find any user and act on their account.
- **Responsibilities** — Name, email, role, status, created; search by name/email; filter by role and status; create; open detail.
- **Content model** — Primary: email. Contract `UserResponseDto` (`id`, `fullName`, `email`, `phoneNumber`, `avatar`, `bio`, `role: ADMIN | USER`, `status: ACTIVE | PENDING | SUSPENDED`, `createdAt`, `updatedAt`); create with `CreateUserDto`.
- **Data requirements** — `use-admin-users`, `use-create-user` (exists).
- **Interaction model** — debounced search; filters in the URL; "New user" opens C21 with `createUserDtoSchema`; row → P31; row menu "Open", "Copy ID".
- **Controls** — C53, C18, C12, C11, C20, C21.
- **Device needs** — search and open on a phone.
- **Accessibility** — as S23.
- **Loading** — placeholder rows.
- **Error** — C33; duplicate email field error in the dialog.
- **Empty** — `EMPTY_STATES.adminUsersFiltered` ("No users match."); unfiltered empty impossible.
- **Reuse** — P30.
- **Technical notes** — `admin-users-table.tsx` (1.0.0 name); server paging required (Q3).

### S50 — Admin user record

Pages: P31 · Contracts: [C10](phase-6-interaction-contracts.md#c10--field) [C06](phase-6-interaction-contracts.md#c06--select) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog)

- **Purpose** — Inspect one user and change role or status.
- **Responsibilities** — Show fields; edit full name, phone, role, status; delete; read-only for R5.
- **Content model** — Primary: account status. `UserResponseDto`; edit form `updateUserDtoSchema.pick({ fullName, phoneNumber, role, status })` (`lib/validations/admin-user.ts`).
- **Data requirements** — `use-admin-user`.
- **Interaction model** — explicit save; suspend/role change confirm via C52 naming the effect ("Ada will be signed out and cannot sign in"); delete via C52 with the email typed; after delete → P30; no self-delete or self-demote (reason given).
- **Controls** — C10, C06, C12, C52.
- **Device needs** — baseline.
- **Accessibility** — read-only fields exposed as read-only with the reason.
- **Loading** — placeholder.
- **Error** — not found → `not-found`; other → C33; save errors per field or message.
- **Empty** — not applicable.
- **Reuse** — P31.
- **Technical notes** — `admin-user-record.tsx`.

### S51 — Compliance case queue

Pages: P32 · Contracts: [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label) [C47](phase-6-interaction-contracts.md#c47--active-filter)

- **Purpose** — One queue of verification cases ordered by what to review next.
- **Responsibilities** — Business name, state, submitted date, age, assignee; filter by state and assignee; oldest first.
- **Content model** — Primary: the oldest waiting case and the `submitted` count. `ComplianceCaseSummary`: `id`, `workspaceId`, `businessLegalName`, `state`, `submittedAt | null`, `ageHours`, `assignee | null`, `openRequests`.
- **Data requirements** — `use-compliance-cases` (cursor).
- **Interaction model** — filters in the URL; row → `/admin/compliance/[caseId]`; "Assign to me" per case (Q2).
- **Controls** — C15, C12, C47.
- **Device needs** — tablet-usable.
- **Accessibility** — ages given in words ("3 days").
- **Loading** — placeholder rows.
- **Error** — C33.
- **Empty** — `EMPTY_STATES.complianceQueue` ("No cases waiting for review."), `complianceQueueFiltered` ("No cases match these filters.").
- **Reuse** — P32 (in the segment layout).
- **Technical notes** — `compliance-case-queue.tsx`.

### S52 — Compliance case review

Pages: P32 · Contracts: [C22](phase-6-interaction-contracts.md#c22--detail-overlay) [C12](phase-6-interaction-contracts.md#c12--status-label) [C52](phase-6-interaction-contracts.md#c52--confirmdialog) [C05](phase-6-interaction-contracts.md#c05--textarea) [C01](phase-6-interaction-contracts.md#c01--button) [C50](phase-6-interaction-contracts.md#c50--stepper)

- **Purpose** — Review one case and decide: approve, reject, or request information.
- **Responsibilities** — Business details, owners and documents read-only (S10/S11 summaries, S12 list), case history; record a decision with reason; write the info requests the owner sees in S13.
- **Content model** — Primary: the decision with its evidence. `ComplianceCase` = `VerificationCase` + `history {at, actor, action, note}[]`, `riskSignals {label, severity}[]`. `DecideCaseInput`: `decision: approve | reject | request_info`, `reason` (required), `requests?`.
- **Data requirements** — `use-compliance-case`, `use-decide-case`.
- **Interaction model** — a document opens in C22; every decision via C52 with reason; "Request info" collects one or more requests; afterwards the next case opens; only R6/R7 decide.
- **Controls** — C22, C12, C52, C05, C01, C50 (read-only).
- **Device needs** — decide on a tablet.
- **Accessibility** — documents have text names; decision result announced.
- **Loading** — document previews load lazily.
- **Error** — C33; conflict → `COMPLIANCE_COPY.alreadyDecided` and reload; failed submit keeps the reason.
- **Empty** — no documents → `EMPTY_STATES.caseDocuments` ("The business hasn't uploaded documents yet.").
- **Reuse** — P32.
- **Technical notes** — `compliance-case-review.tsx`. (1.0.0 `tone` field on risk signals renamed `severity`.)

### S53 — Support lookup

Pages: P33 · Contracts: [C11](phase-6-interaction-contracts.md#c11--searchinput) [C15](phase-6-interaction-contracts.md#c15--table-family) [C12](phase-6-interaction-contracts.md#c12--status-label)

- **Purpose** — Let a support agent find a workspace, user or transaction from what the customer quotes.
- **Responsibilities** — Search by email, workspace name, transaction reference or user ID; grouped results with status; read-only summary (transaction facts from S24, messages from S37); no balances beyond need, never full account numbers.
- **Content model** — Primary: the search. `SupportLookupResult` = `{kind: "user"; user} | {kind: "workspace"; id; name; state} | {kind: "transaction"; transaction; workspaceName}`.
- **Data requirements** — `use-support-lookup`; every lookup audit-logged.
- **Interaction model** — type, then results; choosing opens a summary in place; user results link to P31 for R7.
- **Controls** — C11, C15, C12.
- **Device needs** — laptop and tablet.
- **Accessibility** — groups labelled; result count announced.
- **Loading** — previous results stay, marked busy.
- **Error** — C33.
- **Empty** — idle `EMPTY_STATES.supportLookup` ("Search by email, workspace, transaction reference or user ID."), none `supportLookupNone` ("Nothing found for that search.").
- **Reuse** — P33.
- **Technical notes** — `support-lookup.tsx`; minimum query length `SUPPORT_QUERY_MIN`. Whether support may view transactions is IA7 (Phase 3).

## System

### S54 — Status explanation

Pages: P34, P35 and every segment `not-found.tsx` / `error.tsx` · Contracts: [C32](phase-6-interaction-contracts.md#c32--emptystate) [C33](phase-6-interaction-contracts.md#c33--errorstate) [C01](phase-6-interaction-contracts.md#c01--button) [C03](phase-6-interaction-contracts.md#c03--textlink)

- **Purpose** — Say what went wrong in plain words and give one way forward (X10).
- **Responsibilities** — Three variants: `not-found` ("This page doesn't exist", link home or dashboard); `error` ("Something went wrong on our side", Retry calling `reset()`, link to P28); `offline` ("You're offline", Retry when `navigator.onLine` returns). Support reference (`digest`) when present.
- **Content model** — Primary: the heading. `StatusVariant = "not-found" | "error" | "offline"`; `STATUS_PAGE_COPY: Record<StatusVariant, {title; body; primaryLabel}>`; `digest?`.
- **Data requirements** — none; `GET /api/health` may distinguish an outage.
- **Interaction model** — Retry calls `reset()`; home vs dashboard depends on the session (read on the server); offline listens for `online`.
- **Controls** — C01, C03.
- **Device needs** — baseline.
- **Accessibility** — heading is the page `<h1>`; reference readable and copyable.
- **Loading** — none.
- **Error** — this is the error state; `global-error.tsx` renders it with no providers.
- **Empty** — not applicable.
- **Reuse** — P34, P35, all segment boundaries.
- **Technical notes** — `components/system/status-page-body.tsx` (Server Component) + `status-retry-button.tsx` (client).

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

- **Retained:** S01–S54 with purpose, responsibilities, content model, data, interaction, controls, accessibility, loading, error, empty, reuse and technical notes; the four-state rule; shared data conventions; accessibility floor; file discipline; Q1–Q4.
- **Changed:** 22 sections renamed (table above); "Hierarchy" folded into Content model as primary information; "Responsive behavior" replaced by Device needs; **Skeleton states** and **Animation behavior** headings removed (visual) — loading still reserves space; the depth floor, density rules (row heights, type sizes, spacing caps, accent use, hover), motion defaults and the styled example section removed; `tone` fields renamed `severity` (S17, S47, S52); S31 `includePending` made explicit; technical notes record 1.0.0 file names where the 2.0.0 name differs; A13 and A14 withdrawn.
- **Added:** S55 Public site navigation, S56 Headline figures, S57 Accounts capability, S58 Payments & approvals capability, S59 Cards capability, S60 Treasury forecast capability, S61 Reconciliation capability, S62 Pricing plans, S63 Frequently asked questions, S64 Get-started enquiry — all from the built home page, each with its OD9/OD10 facet; built-state notes on S04–S07; Q5, Q6; A10.

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
