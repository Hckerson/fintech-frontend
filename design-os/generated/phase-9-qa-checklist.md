# Ledgerline Design OS — Phase 9: Quality Assurance Checklist

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 8 — Implementation Roadmap](phase-8-implementation-roadmap.md) · Next: [Implementation Prompt](IMPLEMENTATION_PROMPT.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to use this checklist](#how-to-use-this-checklist)
- [1. Accessibility](#1-accessibility)
- [2. Behavioural consistency](#2-behavioural-consistency)
- [3. Responsiveness](#3-responsiveness)
- [4. Scalability](#4-scalability)
- [5. Performance](#5-performance)
- [6. State coverage](#6-state-coverage)
- [7. Error handling](#7-error-handling)
- [8. Loading behavior](#8-loading-behavior)
- [9. Retired: design system compliance](#9-retired-design-system-compliance)
- [10. Frontend readiness](#10-frontend-readiness)
- [11. Developer experience](#11-developer-experience)
- [12. SEO readiness](#12-seo-readiness)
- [13. Maintainability](#13-maintainability)
- [14. Cross-browser compatibility](#14-cross-browser-compatibility)
- [15. WCAG compliance](#15-wcag-compliance)
- [16. Money and data integrity](#16-money-and-data-integrity)
- [17. Security and privacy](#17-security-and-privacy)
- [18. Content truthfulness](#18-content-truthfulness)
- [19. Public site (added 2.0.0)](#19-public-site-added-200)
- [Host audit findings](#host-audit-findings)
- [Per-page state coverage matrix](#per-page-state-coverage-matrix)
- [Sign-off](#sign-off)
- [Verified gate](#verified-gate)
- [Traceability](#traceability)
- [Assumptions and open questions](#assumptions-and-open-questions)
- [Item count](#item-count)
- [Changes in this version](#changes-in-this-version)

## How to use this checklist

Every item is one pass/fail statement about the product, numbered `Q-001` onward and never renumbered — a retired item keeps its number and is marked retired, so references from [Phase 8](phase-8-implementation-roadmap.md) and pull requests stay valid. The "How to verify" column names the tool, lint rule, script or manual step that decides the result.

- **Lint rules** are the existing `starter/*` rules in `tools/eslint/rules/` plus the flat-config rules in [eslint.config.ts](../../eslint.config.ts). Where a rule has a known gap it is named in [Host audit findings](#host-audit-findings).
- **(needs LD4)** marks an item whose automated check needs the testing libraries proposed as LD4 (`@testing-library/react`, `@testing-library/user-event`, `jsdom`, `@playwright/test`, `@axe-core/playwright`). They are awaiting maintainer approval. Until approved, the manual step in the same cell is the check of record.
- **Manual screen-reader runs** use NVDA + Firefox and NVDA + Chrome on Windows, VoiceOver + Safari on macOS and iOS, TalkBack + Chrome on Android.
- **Seeded states** come from the backend seed (`backend/prisma/seed.ts`), never from frontend arrays — see [18. Content truthfulness](#18-content-truthfulness).
- Heavy commands (`pnpm type-check`, `pnpm lint`, `pnpm build`, test runs) are run at the Phase 8 gate or when a maintainer asks, not on every edit.
- **Evidence.** A result is recorded as: the Q-id, pass or fail, the date, the commit, the environment (browser and version, device, seed tier, role) and the artefact the "How to verify" cell names — a test run, a network capture (HAR), a script's output, a screenshot or recording, a response body, or a screen-reader transcript. A result with no artefact is a fail ([Verified gate](#verified-gate)). Artefacts hold seeded data only; none is taken from a real workspace.
- **Thresholds** are the values of named constants wherever a constant exists: a check tests the constant, and a number quoted beside it is the value [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) specifies, under the constant name [Phase 7 §10](phase-7-frontend-architecture.md#10-constants) owns (Q9-3). Numbers that belong to this checklist alone (test profiles, tolerances) are assumptions P9-A1–P9-A9 in [Assumptions and open questions](#assumptions-and-open-questions).
- **Lab profile (P9-A1).** Performance items are measured on the production build in Chrome with the DevTools "Fast 4G" network preset and 4× CPU slowdown, taking the median of five runs unless the item says otherwise.
- **Seed tiers (P9-A2).** Scale and integrity items name the seeded data they run against: `ledger-0`, `ledger-1`, `ledger-10k`, `ledger-100k` and `ledger-5m` (one account each with that many transactions); a multi-currency workspace (USD, EUR, GBP, JPY, BHD); two workspaces A and B with one member in A only and one in both; one seeded user per role R1–R7; a workspace of 200 members; 10,000 platform users. All of it comes from the backend seed.
- **Roles.** An item that names no role holds for every role that can reach the surface. An item about refusal names the refused role and what that person is told.
- **Backend dependency.** Some items can pass only once the backend enforces the rule (isolation, audit, session revocation, idempotency). They are checked from the frontend's side — by the request it sends and the response it handles — and stay failing, not waived, until the backend behaviour exists.

Why a numbered, single-statement list: a reviewer can mark each line pass or fail without interpretation, and a failure can be filed against one ID. Items that bundle two conditions were split.

## 1. Accessibility

Why: Ledgerline is a daily tool for finance staff, several of whom use keyboards, magnifiers or screen readers all day. WCAG success criteria are mapped one-to-one in [15. WCAG compliance](#15-wcag-compliance); this category covers the structural practices that make those criteria achievable.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-001 | Every page has exactly one `<h1>` and heading levels never skip inside a section. | axe `page-has-heading-one` + `heading-order` (needs LD4); manual: HeadingsMap extension. |
| Q-002 | Every route renders one `<main>`; [S01 Primary navigation](phase-5-section-blueprints.md#s01--primary-navigation) is a labelled `<nav>`; S02 Global utilities is a `<header>`. | axe landmark rules (needs LD4); manual: NVDA landmarks list (NVDA+F7). |
| Q-003 | A "Skip to content" link is the first focusable element in the `(app)` and `(admin)` layouts and moves focus to `<main>`. | Manual: load P08, press Tab once, Enter, confirm focus lands in main. |
| Q-004 | Every icon-only control (C02 IconButton, C39 Notification entry point, C51 CopyButton) exposes an accessible name. | axe `button-name` (needs LD4); manual: NVDA reads each control's name. |
| Q-005 | Decorative Carbon icons are hidden from assistive tech; icons that carry meaning have a text label. | Accessibility tree in Chrome DevTools on P08 and P10. |
| Q-006 | Every form control is tied to a visible label through [C10 Field](phase-6-interaction-contracts.md#c10--field) using an id from `useId`, never the label text. | Code review of C10; axe `label` (needs LD4). |
| Q-007 | A field in error carries `aria-invalid="true"` and references its message with `aria-describedby`. | Testing Library query by role + description (needs LD4); manual: NVDA reads the error on focus. |
| Q-008 | Opening [C21 Dialog](phase-6-interaction-contracts.md#c21--dialog) or [C22 Detail overlay](phase-6-interaction-contracts.md#c22--detail-overlay) moves focus inside, Escape closes, focus returns to the invoking control. | Playwright keyboard script (needs LD4); manual keyboard run. |
| Q-009 | [C38 CommandPalette](phase-6-interaction-contracts.md#c38--commandpalette) uses combobox + listbox semantics with `aria-activedescendant`; arrows move, Enter opens, Escape closes. | Manual: NVDA + Chrome, VoiceOver + Safari. |
| Q-010 | [C53 DataTable](phase-6-interaction-contracts.md#c53--datatable) keeps table semantics while virtualized: `aria-rowcount` equals the server total for the current filters when the server gives an exact one (up to `COUNT_EXACT_LIMIT`, 10,000; beyond it the count reads "10,000+") and is `-1` when it does not, rendered rows carry `aria-rowindex`, and both stay correct after a filter change and after more rows load. | DOM inspection on the seeded `ledger-100k` and `ledger-5m` accounts (P9-A2) before and after a filter change; manual SR "row N of M" at the start, after three loads and after a jump to a date. Evidence: DOM snapshot and SR note. |
| Q-011 | Sortable column headers expose `aria-sort` and announce the change. | DOM inspection; manual SR. |
| Q-012 | Every [C30 Chart](phase-6-interaction-contracts.md#c30--chart) has a text alternative (summary sentence plus an accessible data table with the same figures). | Manual SR on S18 and S28; review C30 props require the summary. |
| Q-013 | C24 Transient message content is announced through a polite live region exactly once, and nothing that needs action exists only in a transient message: the same fact stays reachable in S32, S34 or the page it concerns after the message is gone. | NVDA speech viewer during an export-ready event; then confirm the event is still present in S32 and S34. Evidence: speech-viewer transcript. |
| Q-014 | All motion honours `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` in C61 and the equivalent CSS media query); no information is conveyed only by motion. | DevTools → Rendering → emulate reduced motion on P01 and P08. |
| Q-015 | Screen-reader smoke scripts for P02, P08, P10, P12 and P18 complete without a blocker on all four SR + browser pairs listed above. A blocker is a step that cannot be completed, or a balance, amount, status or error that is not announced. | Manual script recorded in the Phase 8 testing strategy; one note per pair with SR and browser versions and the step where any blocker occurred. |
| Q-016 | Focus indicators, control borders and status badges stay visible in forced-colors mode. | Edge DevTools → Rendering → emulate `forced-colors: active`; Tab through P02 and P10. |
| Q-263 | After any action that removes or replaces the focused element (removing a note — which leaves the attributed "note removed" entry of Q-375 in its place — clearing a filter, dismissing a notice, a row leaving P14 when unflagged, more rows loading), focus lands on a defined element that still exists; it never resets to the start of the document. | Manual keyboard run on P10, P12 and P14 logging `document.activeElement` after each action; Playwright assertion (needs LD4). Evidence: the log. |
| Q-264 | A route change inside `(app)` or `(admin)` is announced once with the new page title, and focus moves to the main content. | NVDA speech viewer and VoiceOver across P08 → P10 → P12 → P17. Evidence: transcript. |
| Q-265 | A screen reader hears each amount with its sign and currency, each masked account number as "ending" plus the last four digits, and each status as its word, in every list and detail. | NVDA speech viewer on S14, S20, S23 and S24 with a credit, a debit, a `returned` and a `pending` row. Evidence: transcript. |

## 2. Behavioural consistency

Why: in a finance tool, two renderings of the same amount or status read as two different facts. One concept, one component, one word.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-017 | *Retired in 2.0.0 — visual (heading sizes and field text sizes); judged in the owner's build review, not by this checklist.* | — |
| Q-018 | Every amount on screen renders through [C40 Amount](phase-6-interaction-contracts.md#c40--amount); `Intl.NumberFormat` is called nowhere else in `components/`. | grep `Intl.NumberFormat` in `components/` returns only `amount.tsx`. |
| Q-019 | Transaction, account, verification and export statuses map to C12 Status label labels and severities from one lib map each; no component spells a status label inline. | grep status literals (`"posted"`, `"frozen"` …) in `components/`; review lib map. |
| Q-020 | Domain vocabulary is fixed: Account, Transaction, Counterparty, Statement, Export, Workspace, Member; settlement state is only "Posted" or "Pending" ([Phase 3 §8.2](phase-3-information-architecture.md#82-state-labels-and-severity)); "Balance" never appears without "Current" or "Available"; v1 UI never calls a transaction a "payment". | Copy review of `lib/constants.ts` and `lib/data/`; grep for "Cleared", "Settled", "Processing", "Complete" and a bare "Balance" label. Evidence: grep output. |
| Q-021 | *Retired in 2.0.0 — visual (accent-button count per view); judged in the owner's build review, not by this checklist.* | — |
| Q-022 | Every empty state uses C32 EmptyState with title, one sentence and at most one action. | Review against the matrix below. |
| Q-023 | Every recoverable error uses C33 ErrorState with a retry action that re-runs only the failed query, and a reference id the member can quote to support. | grep for ad-hoc error markup in `components/`; force a 500 on three different sections, confirm one request per retry in the network log and that S53 Support lookup finds each reference (see H-28; Q-382 extends this to every error state). |
| Q-024 | Tables show absolute dates in one format; posting dates are calendar dates and never shift with the viewer's time zone; relative time appears only in S34 Notification feed and always carries the absolute time as accessible text. | Review `lib/utils/date-formatter.ts` consumers; load P10 with the browser time zone emulated at UTC+14 and UTC−11 and compare posting dates. Evidence: two screenshots. |
| Q-025 | Keyboard shortcuts are declared once in constants and displayed with C28 Shortcut hint. | grep key literals in `components/`. |
| Q-026 | Icons come only from `@carbon/icons-react`. | grep icon imports; no other icon package in `package.json`. |
| Q-266 | Every user-visible string comes from constants or `lib/data/`; no sentence is assembled by concatenating fragments around a number, date or name, and counts use `Intl.PluralRules`. | grep for template literals and `+` concatenation in JSX text in `components/`; copy review for "1 results"-style output with counts 0, 1 and 2. Evidence: grep output. |
| Q-267 | The locale is one constant (`DEFAULT_LOCALE`, never a second locale constant) passed to every `Intl` call; no locale literal appears in `components/` or `lib/utils/`, and changing the constant in a test changes every number, amount and date format. | grep `"en-` in `components/` and `lib/utils/`; vitest that renders C27, C40 and the date formatter under a second locale (see H-31). Evidence: grep output and test run. |
| Q-268 | With every string lengthened by 40% (P9-A8), no flow in F1–F5 loses a function, and no amount, status or error becomes unreadable. | Pseudo-locale build of the copy constants; manual walk at 360 px and 1280 px. Evidence: captures of any loss. |
| Q-269 | Names are sorted and compared with `Intl.Collator` from the locale constant; case and diacritics never split one counterparty into two list positions. | Vitest on the sort util with mixed-case and accented names; seeded counterparties on P11. Evidence: test run. |
| Q-270 | Counterparty, member and workspace names containing non-Latin scripts, right-to-left text, emoji or 200 characters render and export unchanged, and a right-to-left name never reorders the digits or sign of an adjacent amount. | Seeded names of each kind on S23, S24, P19 and in a CSV export; compare DOM text and file bytes with the seed. Evidence: comparison output. |
| Q-271 | Returning from P12 to the list it was opened from restores that list's filters, sort and position; the same holds on P10, P11, P14 and P19. | Manual: apply three filters, load three pages, open a row, go back with the browser and with Escape. Evidence: URL before and after, and the first visible row id. |

## 3. Responsiveness

Why: owners check balances from a phone (A8: web only, responsive to 360px). Every task must be completable on every supported width; how pages adapt is decided at build.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-027 | No page scrolls horizontally at 360, 390, 768, 1024, 1280, 1440 and 1920 px wide. | Playwright viewport sweep (needs LD4); manual: DevTools device toolbar. |
| Q-028 | *Retired in 2.0.0 — visual (responsive rules in named classes); judged in the owner's build review, not by this checklist.* | — |
| Q-029 | *Retired in 2.0.0 — visual (breakpoint tokens in media queries); judged in the owner's build review, not by this checklist.* | — |
| Q-030 | S01 Primary navigation is fully reachable on small screens; any control that reveals it exposes `aria-expanded` and `aria-controls`. | Manual at 390 px with keyboard and VoiceOver iOS. |
| Q-031 | At 360 px [S23 Ledger entries](phase-5-section-blueprints.md#s23--ledger-entries) keeps date, description and amount visible; amounts are never truncated or ellipsized. | Manual on seeded ledger with long counterparty names. |
| Q-032 | Content that becomes secondary on narrower screens stays reachable another way (link, disclosure or inline). | Manual at 768 and 1024 px. |
| Q-033 | Fixed controls are never clipped by device notches or home indicators. | iOS Safari 17 on a notched device, portrait and landscape. |
| Q-034 | Dialogs keep their action row reachable with the on-screen keyboard open on phones. | iOS Safari + Android Chrome with a focused input. |
| Q-035 | Charts resize with their container; at 360 px axis labels neither overlap nor clip, and the data-table alternative (Q-012) stays reachable. | Manual on S18 and S28 at 360, 768 and 1440 px. Evidence: one capture per width. |
| Q-036 | *Retired in 2.0.0 — visual (tabular figure alignment); judged in the owner's build review, not by this checklist.* | — |
| Q-037 | Auth forms (S08) remain fully usable in phone landscape with the keyboard open. | Manual at 844×390 on iOS and Android. |
| Q-272 | Every flow F1–F5 and X1–X8 completes at 360 px with touch alone: no function depends on hover, long-press, a multi-finger gesture or a pointing device. | Manual on iOS Safari and Android Chrome devices from the support matrix. Evidence: screen recording per flow. |

## 4. Scalability

Why: the scale target is 5 million rows in one ledger and 200 concurrent members per workspace (spine SCALE_TARGET). The UI must cost the same at row 5,000,000 as at row 50, and must be as correct with zero rows or one row as with millions.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-038 | S23 Ledger entries keeps the DOM row count at or under 150 row elements (P9-A4) regardless of total rows. | `document.querySelectorAll` row count on `ledger-100k` and `ledger-5m` after 200 loaded pages (needs LD2 approval for C53). Evidence: the two counts. |
| Q-039 | Ledger and search lists paginate by cursor through an infinite query, never by offset page number; with neither `from` nor `to` the ledger reads newest first and pages back by cursor without limit — the `LEDGER_MAX_RANGE_DAYS` cap applies only when both bounds are given (Q-278). | Code review of `use-transactions`; network tab shows `cursor` param; on `ledger-5m` with no date bounds, page back past 731 days and confirm no refusal. Evidence: request log. |
| Q-040 | Filters, sort and search live in URL params and are part of every list query key. The ledger's parameter set is the one [Phase 3 §11.1](phase-3-information-architecture.md#111-url-parameters-p10-p11-p14-p19) lists and no other: `from`, `to`, `type`, `direction` (`in` or `out`), `status` (comma-list), `category` (comma-list of at most 20 values, unknown values dropped), `min`, `max`, `q`, `account`, `flagged`, `attachment` (`yes`), `view`. | Code review of the ledger filter schema against that list; reload P10 and P11 with every parameter set and confirm identical results; vitest on the schema with an unknown key, an unknown category value and 21 categories. Evidence: test run and the two result sets. |
| Q-041 | Search input is debounced with `use-debounced-search` using one delay constant (`SEARCH_DEBOUNCE_MS`, 300 ms), so a typed word sends one request; a result that arrives for a superseded query is discarded — a Server Action already in flight cannot be cancelled — and a late response to an earlier query never replaces the results of a later one. | Network tab: typing "coffee" at normal speed issues one request. Then enter two queries more than 300 ms apart with the first response delayed 3 s by throttling: both requests complete, and the results shown match the final query throughout. Evidence: HAR. |
| Q-042 | Large exports run as backend jobs (S31 → S32); the client never assembles CSV from loaded rows. | Code review of S31; network tab. |
| Q-043 | S18 and S28 charts receive server-aggregated series, never raw transaction lists: each series response holds at most 400 points and 50 KB uncompressed (P9-A7) at every seed tier. | Network payload size and point count on P08 and P15 for `ledger-1`, `ledger-100k` and `ledger-5m`. Evidence: three response sizes. |
| Q-044 | Every workspace-scoped query key includes the workspace id, so switching workspace never shows the previous workspace's data. | Manual: switch workspace with C36 while P10 is open; code review of keys (see H-27). |
| Q-045 | S39 Team members and S49 Platform user directory page on the server, and at 200 members / 10,000 users each sort, filter and page change meets the INP budget (Q-049) with the rendered row count bounded as in Q-038; a member with more than 10 workspace memberships can search the workspace switcher (C36) by name, and with 10 or fewer every workspace is listed without searching. | Seeded backend (P9-A2); Performance panel INP for one sort, one filter and one page change on each section; a seeded member with 10 and with 11 memberships opening C36. Evidence: trace file and the two captures. |
| Q-046 | Notification count polling uses `NOTIFICATION_POLL_INTERVAL` ([Phase 7 §10.3](phase-7-frontend-architecture.md#103-specified-values)), stops while the tab is hidden or offline, and issues one fetch when the tab becomes visible again. | Code review (`refetchIntervalInBackground: false`); DevTools network over five minutes visible, five hidden, then visible. Evidence: request timestamps. |
| Q-047 | Adding a navigation destination changes only the nav config in `lib/data/`, not S01 code. | Code review of S01. |
| Q-273 | On `ledger-5m`, the first rows after opening P10 and after each filter change are shown within 1.5 s (p75) under the lab profile (P9-A3), and that time is within 20% of the same action on `ledger-10k`. | Performance panel marks over ten repetitions per tier. Evidence: the two p75 values. |
| Q-274 | Loaded ledger pages are bounded by `LEDGER_MAX_PAGES` (10 pages of `LEDGER_PAGE_SIZE` 50, so 500 rows held): after 200 "load more" steps on `ledger-5m` the rows held never exceed `LEDGER_PAGE_SIZE` × `LEDGER_MAX_PAGES`, JS heap is at most 50 MB above the first-page baseline (P9-A4), and scrolling back refetches the dropped pages without a gap or a duplicate. | DevTools Memory heap snapshots at page 1 and page 200; scroll back and compare row ids with the API. Evidence: snapshots and id comparison. |
| Q-275 | Reaching a given date in `ledger-5m` takes one request that sets `from`; it is never done by loading the intervening pages. | Network tab while jumping to a date three years back. Evidence: request count. |
| Q-276 | Cursor pagination neither skips nor repeats a row when a transaction posts between two page loads. | Load page 1 of a seeded account, insert a posted transaction through the backend seed script, load page 2; compare the concatenated ids with a fresh full read. Evidence: id diff. |
| Q-277 | The ledger behaves correctly at the edges of size: an account with zero transactions, one transaction, a final page shorter than `LEDGER_PAGE_SIZE`, and the end of the list — which is stated and announced rather than offering another load. | `ledger-0`, `ledger-1` and the last page of `ledger-10k`; SR on reaching the end. Evidence: captures and transcript. |
| Q-278 | Every limit constant accepts the value at the limit and refuses the value one past it before any request is sent, with a message that states the limit — values as in [Phase 1 BR19](phase-1-product-vision.md#data-and-operations): `SAVED_VIEW_LIMIT` (50 per member), `SAVED_VIEW_NAME_MAX` (60 characters), `NOTE_MAX_LENGTH` (2,000), `MESSAGE_MAX_LENGTH` (5,000), `LEDGER_QUERY_MAX_LENGTH` (100), `LEDGER_MAX_RANGE_DAYS` (731), `LEDGER_ACCOUNT_FILTER_MAX` (50 accounts in one filter), `EXPORT_MAX_RANGE_DAYS` (366), `EXPORT_ACTIVE_JOB_LIMIT` (3 active jobs per member), `UPLOAD_MAX_BYTES` (10 MB), `AVATAR_MAX_BYTES` (2 MB), `UPLOAD_MAX_FILES` (10 per transaction, 5 per message), `ALERT_RULE_LIMIT` (20 per member; rules belong to the member, so one member's rules never count against or conflict with another's), `INVITE_PENDING_MAX` (50 pending invitations) and `DISPLAY_NAME_MAX` (80). `LEDGER_MAX_RANGE_DAYS` is tested only when both `from` and `to` are given: when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared, and a query with one bound or none is not refused (Q-039). A ledger search term shorter than `LEDGER_QUERY_MIN_LENGTH` (2) sends no backend request, though on-device page and help matches may start at 1 character; a support lookup shorter than `SUPPORT_QUERY_MIN` (3) sends none. | Vitest on each schema at limit − 1, limit and limit + 1, on the search term at 1, 2, 100 and 101 characters, and on the range with both bounds, one bound and none; manual on S21, S26, S31, S35, S37, S40, S53 and P13; a fourth export while three are active. Evidence: test run and network log. |
| Q-279 | An export covering all 5,000,000 rows of `ledger-5m` completes as one backend job within 15 minutes (K5, Phase 1 A25) with a `rowCount` equal to the ledger count for that range, while the page's JS heap stays within 10 MB of its idle value. | Create the export; compare `rowCount` with S22; heap snapshot before and after. Evidence: job record and snapshots. |
| Q-280 | When a workspace has more accounts than `DASHBOARD_ACCOUNT_LIMIT` (6, Phase 1 BR19), P08 totals still cover every account the member may see, and the way to the full list (P09) is offered. | Seeded workspace with accounts above the limit; compare each per-currency total with a `BigInt` sum over the accounts API. Evidence: script output. |
| Q-281 | With 10,000 unread notifications, the count is formatted through C27 and shown as "99+" beyond 99, the feed pages by cursor, and "mark all read" is one request, not one per item. | Seeded notifications; network tab on P20. Evidence: request count. |

## 5. Performance

Why: every wait sits between a finance lead and a number they need. Budgets below are targets for Phase 8, measured under the lab profile (P9-A1) and confirmed on a mid-range Android device with 4G throttling.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-048 | Largest Contentful Paint ≤ 2.5 s (p75) on P02, P08 and P10. | Lighthouse on the production build under the lab profile (P9-A1), median of five runs per page; field p75 from the reporting service once [Phase 7 §23](phase-7-frontend-architecture.md#23-observability) names one. Evidence: Lighthouse reports. |
| Q-049 | Interaction to Next Paint ≤ 200 ms for filter change, row open and palette open, measured on `ledger-100k`. | DevTools Performance panel under the lab profile (P9-A1), five repetitions of each interaction, worst value recorded. Evidence: trace file. |
| Q-050 | Cumulative Layout Shift ≤ 0.1 measured from navigation through the arrival of the last data section; loading placeholders reserve final dimensions. | Lighthouse plus the Performance panel layout-shift track on P08 and P10 under the lab profile (P9-A1). Evidence: report with the shift sources listed. |
| Q-051 | First-load JavaScript (compressed, as transferred) stays within the [Phase 7 §21.1](phase-7-frontend-architecture.md#211-budgets-targets-p75-on-a-mid-range-phone-fast-4g) budget: `(marketing)` and `(auth)` routes ≤ 130 KB, `(workspace)` and `(admin)` routes ≤ 200 KB, lazy chunks excluded. | Measured in the browser as [Phase 7 §21.9](phase-7-frontend-architecture.md#219-measurement-and-what-fails) defines: the sum of compressed script bytes transferred before the route finishes loading on a cold visit to the production build, median of five runs (scripted run needs LD4; DevTools network panel with the cache disabled meanwhile). The build's route table is a cross-check, not the result. Evidence: transfer totals per route, with any route over budget named. |
| Q-052 | The LD1 chart library loads only on routes that render a chart. | Build chunk review; network tab on P10 shows no chart chunk. |
| Q-053 | Components are Server Components unless they need state, effects or browser APIs; `"use client"` sits on leaves. | grep `"use client"` and review each hit. |
| Q-054 | Fonts load through `next/font` with no visible layout shift on swap. | Lighthouse CLS attribution; review [public/fonts/font.ts](../../public/fonts/font.ts). |
| Q-055 | Images use `next/image` with `sizes`. | `@next/next/no-img-element` (core-web-vitals config). |
| Q-056 | Scrolling the seeded `ledger-100k` ledger on a mid-range laptop keeps at least 95% of frames within 16.7 ms with no frame over 50 ms (P9-A4). | DevTools Performance → frames during a ten-second continuous scroll. Evidence: trace file with the frame histogram. |
| Q-057 | Query `staleTime` and polling intervals come from constants per resource; none is a literal in a component or provider. The tiers are `STALE_TIME` `live` 15 s, `standard` 60 s, `slow` 5 minutes and `static` never, and unused cache entries are kept for `GC_TIME_MS` (5 minutes; 0 for a revealed account number, Q-363). | grep `staleTime`, `gcTime`, `refetchInterval` (see H-23); compare the constants with [Phase 7 §10.3](phase-7-frontend-architecture.md#103-specified-values). Evidence: grep output and the constant values. |
| Q-058 | P08 Dashboard does not depend on a chain of browser requests: its LCP-critical sections are prefetched on the server and arrive with the document, the remaining figures come from one aggregate endpoint rather than one request per section, and no section waits for another section's response before asking for its own data. Parallel browser fetches are not the test, because Server Actions from one client run one at a time ([Phase 7 §13.5](phase-7-frontend-architecture.md#135-known-constraint-server-actions-run-one-at-a-time)). | Page source of P08 for the prefetched data; network log of a cold load listing every Server Action call issued before the last section renders and what each carries. Evidence: HAR and the page-source excerpt. |
| Q-059 | Hovering or focusing an account row prefetches its ledger route after `HOVER_INTENT_MS`, not at all when the browser reports `saveData`, and never for an account the member's role cannot open. | Network tab on P09: brief pass (no request), rest (one request), Save-Data emulated (no request), seeded R4 (no request for a non-permitted account). Evidence: HAR. |
| Q-060 | Ledger rows are memoized and keyed by server id; a filter change re-renders only affected rows. | React Profiler flamegraph. |
| Q-282 | The ledger page API responds within 300 ms (p75) on `ledger-5m` for the first page, a mid-ledger page and a filtered page ([Phase 7 §21.1](phase-7-frontend-architecture.md#211-budgets-targets-p75-on-a-mid-range-phone-fast-4g); backend dependency). | Network timing over 20 requests of each kind against the seeded backend. Evidence: the three p75 values. |
| Q-283 | Fifty round trips P08 → P10 → P12 → P08 leave JS heap, after forced garbage collection, within 10% of its value after the first round trip (P9-A4). | DevTools Memory snapshots after trip 1 and trip 50. Evidence: both snapshot sizes. |
| Q-284 | No route's first-load JavaScript grows by more than 10% over the previous release without a written acceptance naming the route and the reason (P9-A9). | Diff of the per-route figures measured as in Q-051 against the stored figures of the previous release, at the gate. Evidence: the diff. |

## 6. State coverage

Why: a blank area in a banking console reads as "zero balance". Every data-bound section states explicitly which of its states it is in. Page-level expectations are in the [matrix](#per-page-state-coverage-matrix).

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-061 | Every section S01–S54 renders distinct loading, empty, error and populated states through [C57 QueryBoundary](phase-6-interaction-contracts.md#c57--queryboundary). | Review each section against [Phase 5](phase-5-section-blueprints.md); mocked responses per state. |
| Q-062 | Empty states distinguish "nothing here yet" from "no results for these filters"; the second offers "Clear filters". | Manual on P11 with and without filters. |
| Q-063 | One failing section never blanks its page; C58 SectionErrorBoundary contains the failure, and the failed section says that viewing failed rather than showing an empty or zero value. | Force a 500 on each P08 data endpoint in turn; every other section still renders and no figure reads zero. Evidence: one capture per forced failure. |
| Q-064 | A member without permission who opens a URL directly sees the not-permitted empty state (C32), which names the page and which role can do this — never the error state C33, a blank page, a sign-out or the data. This holds for every role × withheld capability in the [Phase 1 permission matrix](phase-1-product-vision.md#permission-matrix). A record outside the member's scope, or in another workspace, is not a permission case: it answers exactly like a missing one (P34, Q-346). | Manual as seeded R4 opening `/exports` and `/statements`, R3 opening workspace settings, R3 and R4 opening alert rules (S35) by a direct link (opening `/settings` itself redirects them to `/settings/profile`), R2 opening team role management; the response carries no restricted data in the HTML or network payload. Evidence: capture and response body per case. |
| Q-065 | Account states `active`, `frozen`, `closed`, `pending_verification` each render a distinct badge and explanatory copy (mapped from the backend's `OPEN` / `FROZEN` / `CLOSED` as Phase 1 OD11 decides) in [S20 Account overview](phase-5-section-blueprints.md#s20--account-overview). | Seeded accounts in each state. |
| Q-066 | Transaction states `pending`, `posted`, `returned`, `reversed`, `failed` each render a distinct badge; `reversed` links to the original transaction. | Seeded transactions in each state. |
| Q-067 | Verification states `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` each drive S09 and S13 correctly. | Seeded verification cases. |
| Q-068 | Export job states `queued`, `running`, `ready`, `failed`, `expired` each render; `expired` offers regeneration. | Seeded export jobs; [S32 Export jobs](phase-5-section-blueprints.md#s32--export-jobs). |
| Q-069 | Every balance carries an "as of" time taken from the response at all times; data shown after a failed refetch or while offline is kept, keeps that time, and is stated to be not current — never replaced by zero or a blank; a balance older than `BALANCE_STALE_AFTER` (15 minutes) is labelled as possibly out of date even when no request failed. | DevTools offline after P08 loads; then force a 500 on the balances refetch. Then leave P08 open past `BALANCE_STALE_AFTER` with refetch blocked. Compare the "as of" text with the response timestamp. Evidence: capture and response. |
| Q-070 | Navigation lists only routes that have a page in the release; Deferred P26 and P27 stay specified in [Phase 4](phase-4-page-blueprints.md#p26--transfer) and unlinked until their revisit trigger. | Review nav config in `lib/data/`. |
| Q-071 | P08 composes D1–D4 by role; each seeded role sees only its permitted sections. | Sign in as seeded owner, finance, accountant and viewer. |
| Q-072 | [C55 SessionExpiryDialog](phase-6-interaction-contracts.md#c55--sessionexpirydialog) appears `SESSION_WARNING_LEAD` (2 minutes, Phase 1 A16) before idle expiry with an option to stay signed in; extending sends one request; at the absolute limit it states that signing in again is required instead of offering an extension. | Shorten idle and absolute timeouts in dev config; time the warning; extend once and count requests; reach the absolute limit. Evidence: timings and network log. |
| Q-285 | When one account's balance is unavailable, any total that would include it is withheld or stated to exclude that named account; a partial sum is never presented as the complete figure. | Force a 500 or a missing balance for one of three seeded accounts; read S14 and S19. Evidence: capture and API responses. |
| Q-286 | `frozen` and `closed` accounts stay readable with their full history, statements and exports, and carry their state label in every list, detail, search result and export where the account appears. | Seeded frozen and closed accounts on P08, P09, P10, P11, P17 and in a CSV export. Evidence: captures and file. |
| Q-287 | For every role R1–R7 and every page P01–P35, opening the page's URL directly gives exactly the outcome the [Phase 3 role-based navigation](phase-3-information-architecture.md#5-role-based-navigation) specifies: the page, the permission state, or P34 for the admin area. | Scripted sweep of 7 roles × 35 routes recording status and outcome (needs LD4); until then a manual sweep per role. Evidence: the 7 × 35 result table. |
| Q-288 | After a tab has been hidden for longer than the `live` stale time (`STALE_TIME.live`, 15 s), returning to it refetches balances and the notification count once, and the "as of" time changes to the new response's time. | Hide the tab past `STALE_TIME.live`, return; network tab and "as of" text. Evidence: request log and the two times. |
| Q-289 | A viewer (R4) with no permitted accounts sees a state that says access has not been granted and who grants it — not the "no accounts yet" state and not a prompt to verify the business. | Seeded R4 with zero permitted accounts on P08 and P09. Evidence: capture. |
| Q-290 | A member removed from a workspace while signed in learns of it on their next request, loses every cached item of that workspace, and continues in another workspace they belong to or at onboarding when they have none. | Two browsers: owner removes the member while the member has P10 open; member selects a row. Inspect the query cache afterwards. Evidence: capture and cache snapshot. |
| Q-381 | A section or page says it is empty ("no accounts", "no transactions", "nothing flagged", "all caught up") only when every source it depends on answered successfully; when any one source failed or is still loading, that part shows its error or loading state and nothing states emptiness. | For S14, S19, S23, S29 and S34, force a 500 on each source in turn while the others return empty lists, then hold one source open; read the state shown. Evidence: one capture per forced failure. |

## 7. Error handling

Why: a finance user told "wrong password" during an outage resets a working password; one told nothing re-submits. Errors say what happened and what to do next. This category also covers what the product does when things go wrong around it: a slow or absent backend, a lost response, a repeated submission, and two tabs or two people acting on the same thing (Q-291–Q-303).

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-073 | Sign-in distinguishes invalid credentials (401), too many attempts (429), invalid input (400) and service unavailable (5xx or network) with a distinct message each; the 429 message says when the member may try again when the response carries `Retry-After`. | Vitest on `app/api/session/route.ts` with mocked upstream for 400, 401, 429 with and without `Retry-After`, 500, 503 and a network error; manual with backend stopped (see H-02). Evidence: test run. |
| Q-074 | Every API response is parsed with its contract Zod schema before use; a parse failure renders C33 ErrorState, never a crash. | Code review of hooks; vitest with malformed payloads. |
| Q-075 | Every mutation shows success or failure feedback that is announced (Q-206); nothing reports success before the backend confirms, except the optimistic category and flag changes of Q-093; a failed note save keeps the typed text and offers Retry. | Manual on S26 with a forced 500 and with a response delayed 5 s; confirm no success wording appears before the response. Evidence: capture and network log. |
| Q-076 | Each `(app)` and `(admin)` segment has an `error.tsx` whose retry calls `reset`. | File review against [Phase 7](phase-7-frontend-architecture.md); throw in dev. |
| Q-077 | `app/global-error.tsx` renders its own `<html>` and `<body>` and offers reload. | File review; throw in root layout in dev. |
| Q-078 | A backend 404 for an account, transaction, counterparty or member id renders the segment's `not-found.tsx` ([P34](phase-4-page-blueprints.md#p34--not-found-404)). | Manual with an unknown id. |
| Q-079 | A 401 on a data call mid-session opens C55 in place, keeps unsaved drafts in the open tab's memory — never in browser storage (Q-396) — and returns the member to the same URL after re-authentication (X4); a write interrupted by the expiry or by a step-up is never sent again by the product — the member re-submits it, and the re-submission carries the same idempotency key; when a different user re-authenticates, the drafts are dropped; a document request without a valid session redirects to sign-in with `next` preserved through `internalPath`. | Delete the session cookie in DevTools, then (a) select a row with a note half-typed in S26 and re-authenticate, confirming the text survives; (b) reload the page and confirm the `next` round trip with its query string intact (see H-29); (c) let the session expire during a note save and confirm exactly one request is sent until the member acts; (d) re-authenticate as a different seeded user and confirm the draft is gone. Evidence: capture of both. |
| Q-080 | A 403 on a page or section shows the not-permitted empty state (C32), not C33, and never signs the member out. | Manual as R4 calling an export endpoint and opening `/exports`. Evidence: capture and response. |
| Q-081 | Going offline shows a persistent, non-blocking offline notice; read views keep cached data with its "as of" time; every write is disabled with an explanation rather than failing silently, and no write is held for later replay. | DevTools → Network → Offline on P08, P12 and P18; attempt each write; go online and confirm no request for those attempts is sent. Evidence: network log. |
| Q-082 | Error copy states what happened and what to do; raw codes appear only as a reference id that contains no personal or account data; no stack trace reaches the page; no error states or implies that money moved or is safe — it says that viewing failed (X10). | Copy review of error constants; production build error pages for P34, P35 and three C33 cases; inspect the reference format. Evidence: copy list and captures. |
| Q-083 | No `console.*` call exists in committed code; errors are reported by services. | `no-console` rule. |
| Q-084 | Uploads (C49) reject wrong type or oversize files before sending, naming the limit from the same constant that is enforced; a file exactly at the limit is accepted and one byte over is refused; a disallowed file renamed to an allowed extension is refused with a per-file reason. | Manual on S12 and S26 with four generated files (at limit, limit + 1 byte, wrong type, renamed type). Evidence: network log showing which were sent. |
| Q-085 | Query retries never retry 4xx responses; a read that fails as unavailable is retried at most `QUERY_RETRY_LIMIT` (2) times with delays that grow from `QUERY_RETRY_BASE_MS` (1 s) and never exceed `QUERY_RETRY_MAX_MS` (8 s) ([Phase 7 §13.7](phase-7-frontend-architecture.md#137-timeouts-retry-and-backoff)), then shows C33. | Review QueryClient defaults in C61 Provider; force 503 on one read and record request timestamps; force 404 and 403 and confirm one request each. Evidence: timestamps. |
| Q-291 | Activating any mutation trigger twice within 100 ms (P9-A5; double click, held Enter, two taps) produces exactly one request and one record: note save, invite, export create, saved view create, mark-read, admin user create, compliance decision. | Scripted double activation per trigger with 500 ms latency (needs LD4); manual double click meanwhile. Evidence: network log and backend record count per trigger. |
| Q-292 | When a create request succeeds but its response is lost, the member's retry does not create a second record: one export job, one invitation, one note, one saved view (the idempotency key of BR18, honoured for 24 hours; backend dependency). | Drop the response with a proxy or DevTools request blocking after send; retry from the UI; count records in the backend. Evidence: record counts. |
| Q-293 | Mutations are never retried automatically (X10): a failed write — including one that reaches `MUTATION_TIMEOUT_MS` (30 s) — results in exactly one request until the member acts, and after a timeout the member is told the outcome is unknown. | grep `retry` on `useMutation` calls and the QueryClient mutation defaults; force a 503 on note save and invite, and hold an export-create response open past the timeout. Evidence: grep output and request count. |
| Q-294 | No loading state lasts indefinitely. A read with no response in the browser for `REQUEST_TIMEOUT_MS` (15 s) ends as an error with retry; the server-to-backend call behind it is abandoned at `BACKEND_TIMEOUT_MS` (10 s; `UPLOAD_TIMEOUT_MS` 60 s for uploads) and answers as unavailable with a reference; a notice that the request is slow appears at `SLOW_REQUEST_MS` (10 s). A backend search is abandoned at `SEARCH_TIMEOUT_MS` (5 s). These are separate constants and none is derived from another. | Hold a ledger, a balance and a search response open with a proxy placed (a) between the application server and the backend and (b) between the browser and the application server; time each to the slow notice and to the error state (see H-28). Evidence: the timings for both placements. |
| Q-295 | With the backend unavailable, no page shows a zero balance, an empty list or an empty state in place of an error: each data section shows C33 or the route shows S54 with the health result, and sign-in reports the service as unavailable. | Stop the backend; open P02, P08, P09, P10, P17, P18, P23 and P29. Evidence: one capture per page. |
| Q-296 | During a sustained outage a page left open for ten minutes sends a bounded number of requests: at most `QUERY_RETRY_LIMIT` + 1 attempts per query per trigger, polling that stops after three consecutive failures ([Phase 7 §13.7](phase-7-frontend-architecture.md#137-timeouts-retry-and-backoff)), and a 429 with `Retry-After` is not retried before that time. | Backend returning 503, then 429 with `Retry-After: 60`; P08 and P18 left open ten minutes. Evidence: request count per endpoint. |
| Q-297 | On a slow connection (DevTools "Slow 4G" and a 3G profile) F1–F4 complete, every wait shows a loading or pending state, and a slower earlier response never overwrites a newer one. | Manual walk per profile; apply filter A then B with A's response delayed; confirm B's results stand. Evidence: HAR. |
| Q-298 | On reconnecting, visible queries refetch once, writes are enabled again, drafts typed while offline are intact, and nothing typed offline is sent without the member acting. | DevTools offline with a note half-typed on P12 and a message draft on P21; reconnect. Evidence: network log and draft text. |
| Q-299 | An action over several items reports each item's own result: with five uploads of which two fail, three are saved and two show their reason with Retry; "mark all read" that partly fails leaves the true unread count. | Force failures for two of five uploads on S26 and S12; force a partial failure on mark-all-read. Evidence: capture and backend state. |
| Q-300 | A change made in one tab (note, category, flag, saved view, read state) appears in a second tab of the same member on focus or its next refetch, without a reload, and the second tab never writes its stale copy back. | Two tabs on the same transaction; change in A, focus B, then edit in B. Evidence: network log of B and final backend value. |
| Q-301 | Two members changing the same record do not silently overwrite each other (BR18): a write to a category or a flag that is based on an older version is refused (409), the member keeps what they entered, is shown the newer value beside their own and chooses; there is no last-write-wins anywhere. Saved views are per member, so the same refusal is tested with one member's own two tabs changing the same saved view. Notes are never edited — "append-only" means no edits, not no removal (Q-375) — so two members' notes both appear. After a refused write both members see the same value within one `live` stale window (15 s). | Two browsers as R1 and R2 on one transaction in S26: simultaneous category changes, simultaneous flag changes, two notes saved together; then one member in two tabs renaming the same saved view on P13. Evidence: both captures, the 409 response and the backend value. |
| Q-302 | When two reviewers decide the same compliance case, or two owners change the same member's role, at the same time, exactly one action takes effect and the other member is told what was already decided and by whom. | Two browsers submitting within one second on S52 and on S39. Evidence: both responses and the audit entries. |
| Q-303 | Following an expired or revoked download link gives a Ledgerline message with a way to request a fresh link, never a raw storage error; requesting the fresh link applies the same permission check as the first. | Open a statement and an export link after its expiry (Q-238); repeat after the member's role is lowered to R4. Evidence: captures and responses. |
| Q-382 | Every error state carries a reference the member can quote: C33, each segment `error.tsx`, P35, a failed mutation's message, the sign-in "unavailable" message and the unknown-outcome message after a write times out. The `reference` is a required part of every failure shape, never optional, and a refusal produced before the backend is reached (failed validation, offline) carries one too. It is generated on the server — or in the browser for a refusal that never leaves it — holds no personal or account data (Q-082), is the same value in the response, the server log and the error report, and S53 Support lookup resolves every server-issued reference to that failure. | Force one failure of each kind listed, plus one validation refusal and one offline refusal; copy each reference; look each server-issued one up in S53 and in the server log (see H-28); type review that no failure type declares `reference` as optional. Evidence: the reference list with its lookup results. |
| Q-383 | `Retry-After` is honoured wherever the backend sends it — on 429 and on 503, given as seconds or as a date: automatic read retries and polling wait at least that long, the member's own retry control stays unavailable until then and says when it returns, and a value that is absent or unreadable falls back to the backoff of Q-085, never to an immediate retry. | Vitest on the retry-delay util with seconds, a date, a past date and an unreadable value; a proxy answering 503 and 429 with `Retry-After: 30` on a ledger read and on export create. Evidence: test run and request timestamps. |
| Q-384 | Requesting an export identical to one of the member's own that is `queued` or `running` (same accounts, period and format) returns the existing job (BR18): no second job is created, the member is shown the existing job and told it is already in progress, and it counts once against `EXPORT_ACTIVE_JOB_LIMIT`. | Submit the same export twice ten seconds apart, then from two tabs; count jobs in S32 and in the backend (backend dependency). Evidence: the job ids from each response. |

## 8. Loading behavior

Why: skeletons shaped like the final layout let a user find their place before the numbers arrive, and stop the page jumping under the cursor.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-086 | Page and section loads use C16 Loading placeholders that reserve final space; no full-page blocking loader. | Throttled network review of every page. |
| Q-087 | C17 Progress indicator appears only for an action in flight (pending button, running export, pending switch), never in place of content. | grep consumers. |
| Q-088 | Each `(app)` segment has `loading.tsx` so the shell streams immediately. | File review; throttled navigation. |
| Q-089 | A pending button is disabled, sets `aria-busy`, keeps its label, and cannot submit twice even when `disabled={false}` is passed. | Manual double-click on P02; vitest on C01 (see H-22). |
| Q-090 | Loading placeholders appear only after `LOADING_DELAY_MS`, so a response faster than that never flashes a placeholder. | Code review of C57; constant in `lib/constants.ts`; unthrottled and Slow-4G navigation recorded in the Performance panel. Evidence: trace. |
| Q-091 | Background refetches keep current content visible (`isFetching`), never swapping back to a skeleton (`isPending` only on first load). | Code review of C57. |
| Q-092 | Loading more ledger rows shows an inline loading row; the C25 range text updates and is announced. | Manual SR on P10. |
| Q-093 | Flag and category changes update optimistically and roll back with an error message on failure; after rollback the value shown equals the server value, and five rapid toggles end on the last choice in both the UI and the backend. | Forced 500 on transaction PATCH; then five toggles within two seconds with 500 ms latency, followed by a reload. Evidence: network log and final value. |
| Q-094 | A member can leave P18, or close the tab, while an export runs; the job continues, and an X7 notification arrives when it is ready. | Manual with a seeded slow export: navigate away, close the tab, sign in again and find the job `ready` in S32 and the notification in S34. Evidence: job record and notification. |
| Q-095 | A loading region sets `aria-busy="true"` and screen readers hear one "Loading <section>" message, not one per skeleton bar. | NVDA speech viewer. |
| Q-304 | While a balance or total is loading or has failed, no number stands in for it — not zero, not a dash that reads as zero, not the previous workspace's figure — and assistive technology is told it is loading or unavailable. | Throttled load and forced failure on S14, S20 and S22; accessibility tree inspection during both. Evidence: tree snapshot. |
| Q-385 | While a filter, date-range, account or period change is loading, totals, counts and summary figures are withheld and shown as loading — never carried over from the previous selection and displayed beside filters they were not computed for. Rows of the previous result may stay in view while the new ones load, stated as updating. | Delay the summary response 5 s; change a filter on P10, the range on S18 and the period on P15; read S22 and each total during the wait, including the accessibility tree. Evidence: capture and tree snapshot taken during the wait. |

## 9. Retired: design system compliance

Visual quality is judged when each page is built, with the owner (seed › Phase 9: "QA here is functional"). The styling items below are retired, not deleted, so their numbers stay stable. Q-113, Q-114 and Q-115 are code conventions and remain active; they are signed with Maintainability.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-096 | *Retired in 2.0.0 — visual (raw values in class names); judged in the owner's build review, not by this checklist.* | — |
| Q-097 | *Retired in 2.0.0 — visual (repeated utility chains promoted to named classes); judged in the owner's build review, not by this checklist.* | — |
| Q-098 | *Retired in 2.0.0 — visual (tokens as the only source of colours and sizes); judged in the owner's build review, not by this checklist.* | — |
| Q-099 | *Retired in 2.0.0 — visual (variant maps selecting tokens); judged in the owner's build review, not by this checklist.* | — |
| Q-100 | *Retired in 2.0.0 — visual (shared row-height class for look-alike rows); judged in the owner's build review, not by this checklist.* | — |
| Q-101 | *Retired in 2.0.0 — visual (raw values in globals.css); judged in the owner's build review, not by this checklist.* | — |
| Q-102 | *Retired in 2.0.0 — visual (token list vs @theme mapping); judged in the owner's build review, not by this checklist.* | — |
| Q-103 | *Retired in 2.0.0 — visual (colour utility names exist in @theme); judged in the owner's build review, not by this checklist.* | — |
| Q-104 | *Retired in 2.0.0 — visual (motion durations mirror tokens); judged in the owner's build review, not by this checklist.* | — |
| Q-105 | *Retired in 2.0.0 — visual (focus style from one global rule); judged in the owner's build review, not by this checklist.* | — |
| Q-106 | *Retired in 2.0.0 — visual (hover changes colour only); judged in the owner's build review, not by this checklist.* | — |
| Q-107 | *Retired in 2.0.0 — visual (density ceilings in app views); judged in the owner's build review, not by this checklist.* | — |
| Q-108 | *Retired in 2.0.0 — visual (named spacing classes within density ceiling); judged in the owner's build review, not by this checklist.* | — |
| Q-109 | *Retired in 2.0.0 — visual (figure typography on numbers); judged in the owner's build review, not by this checklist.* | — |
| Q-110 | Ordinary debits never carry problem severity; only `returned` and `failed` do, and severity is always also given in text. | Review C40 and C12 maps; seeded ledger read-through. |
| Q-111 | Every text and control in every colour scheme the build offers meets WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text and UI). | Contrast check per page at build review; axe (needs LD4). |
| Q-112 | *Retired in 2.0.0 — visual (the 'explicitly not' visual list); judged in the owner's build review, not by this checklist.* | — |
| Q-113 | Every primitive in `components/ui/` uses `forwardRef`, explicit `HTMLAttributes` props and sets `displayName`. | grep `displayName` count equals primitive count (see H-07). |
| Q-114 | One component per file, kebab-case filename matching the export. | `starter/one-component-per-file`. |
| Q-115 | Stylesheets carry no comments (the `no-comments` lint rule does not read CSS). | grep `/\*` in `styles/` (see H-20). |
| Q-116 | *Retired in 2.0.0 — visual (globals.css baseline sections); judged in the owner's build review, not by this checklist.* | — |

## 10. Frontend readiness

Why: readiness means the next engineer can build a feature from the blueprints without inventing a location, a type or an endpoint — and that a release can be put out, watched and taken back. Q-305–Q-312 are the release-readiness items.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-117 | Route groups `(marketing)`, `(auth)`, `(app)`, `(admin)` exist with the layouts specified in [Phase 7](phase-7-frontend-architecture.md). | File tree review. |
| Q-118 | Every page P01–P35 in [Phase 4](phase-4-page-blueprints.md) has either a route file or a status in [Phase 8](phase-8-implementation-roadmap.md); none is missing from both. | Cross-check script over the page registry. |
| Q-119 | Every backend call goes through `@/lib/contract` or `lib/api-routes.ts`, and the generated contract matches `openapi.json`. | `pnpm contract:check` at the gate. |
| Q-120 | Components never import `@/lib/api-client`; transport is called only inside `use-*` hooks in `lib/hooks/`. | `starter/api-access-boundary` + `no-restricted-imports`. |
| Q-121 | Hooks for authenticated calls wrap Server Actions in `lib/actions/` (pattern of `use-create-user`). | Code review of each new hook. |
| Q-122 | Required environment variables (`JWT_PUBLIC_KEY`, `NEXT_PUBLIC_API_URL`) fail loudly when missing in production instead of falling back silently. | Start production build without each variable; review [lib/constants.ts](../../lib/constants.ts) fallback. Malformed values and the startup timing are Q-386. |
| Q-123 | Type-check passes with zero errors. | `pnpm type-check` at the gate. |
| Q-124 | Lint passes with zero errors and zero warnings. | `pnpm lint` at the gate. |
| Q-125 | Unit suites pass and cover at least: money formatting (exponents 0, 2 and 3; 18-digit values; sign; zero), `internalPath` (the H-16 cases), session parsing (expired, malformed, wrong algorithm), the ledger filter schema (each invalid key dropped) and the permission matrix. | `pnpm test` (vitest) at the gate. Evidence: run output listing each named suite. |
| Q-126 | End-to-end scripts for X1, F2, F3 and F4 pass on Chromium, Firefox and WebKit. | Playwright (needs LD4). |
| Q-127 | Every library in use has recorded maintainer approval (LD1–LD5); none was added without it. | `package.json` diff review against the approval log in Phase 8. |
| Q-305 | The previous production release can be restored within 15 minutes (P9-A9; inside the 4-hour restoration target of Phase 1 A26), and the restore has been rehearsed once against the release candidate, including the case where the backend has already moved forward. | Timed rollback rehearsal on the staging deployment. Evidence: rehearsal record with start and end time. |
| Q-306 | The frontend tolerates additive backend change: an unknown extra field in a response does not fail parsing, while a missing or retyped contracted field renders C33 (Q-074); the release note states the deploy order of frontend and backend. | Vitest feeding each contract schema an extra field and a removed field; review of the release note. Evidence: test run and the note. |
| Q-307 | Monitoring is live before release: a deliberately raised server error reaches the reporting service chosen under [Phase 7 §23](phase-7-frontend-architecture.md#23-observability) with its digest, route and release id and with no personal or account data; alerts for sign-in failures, 5xx responses and Web Vitals regressions each have a named owner and have been test-fired once. | Raise a test error on staging; read the received event; fire each alert. Evidence: the event payload and alert log. |
| Q-308 | An incident path exists and has been walked through once: who is on call, how severity S1–S3 is assigned, how members are told (X10 health state), how support resolves a quoted reference id (S53), and who decides a rollback. | Tabletop exercise using a simulated balance-display fault. Evidence: the runbook link and exercise notes. |
| Q-309 | The production build serves no source maps to browsers, exposes no development-only route or handler, and ships no seed credentials or sample data on authenticated pages. | Request `*.map` for three chunks; route listing of the build; grep the build output for seed emails. Evidence: responses and grep output. |
| Q-310 | After each production deploy a smoke run passes before the release is announced: `/api/health`, then X1 sign-in → P08 → P10 → P12 → X3 sign-out with a dedicated monitored account. | Scripted smoke run (needs LD4); manual run meanwhile. Evidence: run log with the deploy id. |
| Q-311 | Deferred P26 and P27 are unreachable in the production build: their URLs give P34, no navigation entry, palette result or link leads to them, and no payment endpoint is called. Their specifications remain in [Phase 4](phase-4-page-blueprints.md#p26--transfer). | Open `/payments` routes signed in as R1; search the palette for "transfer" and "payee"; grep the build for payment hooks. Evidence: captures and grep output. |
| Q-312 | Each release has a record listing the Q-items run, their evidence, and every accepted exception with its owner and expiry date; no exception is open past its expiry. | Review the release record at the Phase 8 gate. Evidence: the record itself. |
| Q-386 | The application refuses to start on missing or malformed configuration ([Phase 7 §10.4](phase-7-frontend-architecture.md#104-environment-and-configuration)): a `NEXT_PUBLIC_API_URL` that is absent, not an absolute URL, or not HTTPS in production, and a `JWT_PUBLIC_KEY` that is absent or does not import as an RS256 public key, each stop the server before it accepts a request (and fail the build for public values). The message names the variable and the rule it broke and never prints the value; no development fallback applies in production. | Start the production build once per bad value (absent, empty, malformed URL, `http:` origin, truncated key, a private key); vitest on the environment schema. Evidence: exit code and message per case. |

## 11. Developer experience

Why: conventions that are checked by a tool survive; conventions that live in memory do not. Q-313–Q-318 protect against regression: a defect fixed once stays fixed.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-128 | Adding a data-bound section touches at most: one hook, one section component, one type file, one page composition line. | Review of the first Sprint 3 section PR. |
| Q-129 | Every custom ESLint rule has a colocated `.test.ts`, and every mechanically checkable convention introduced by this Design OS has a rule or a config entry. | File review of `tools/eslint/rules/`. |
| Q-130 | Cross-file fixes have a codemod in `tools/codemods/` that is dry-run by default. | Run codemod without `--write`; review output. |
| Q-131 | Lint messages name the fix, not only the violation. | Review rule `messages` blocks. |
| Q-132 | Every shared domain type is exported from `lib/types/<domain>.ts` and re-exported by `lib/types/index.ts`. | `starter/domain-types-in-lib`; review index. |
| Q-133 | Hand-written Zod in `lib/validations/` composes contract schemas with `.extend` or `.pick`, never restates a field. | Code review. |
| Q-134 | Every state in the [matrix](#per-page-state-coverage-matrix) is reachable locally from the backend seed. | Checklist run against a fresh seed. |
| Q-135 | Components link to routes through constants; no string literal `href="/..."` appears in `components/`. | grep `href="/`. |
| Q-136 | With git hooks disabled, the pull request template lists the manual gate commands (`pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm contract:check` with `CONTRACT_SOURCE=../backend/openapi.json`). `lint-staged` is not installed today, so it is not a gate until approved. | Review PR template. |
| Q-313 | Every fixed S1 or S2 defect and every fixed host finding has an automated test, named with its id, that fails on the code before the fix. | Review test names against the defect list and H-01–H-34; for a sample of three, run the test against the pre-fix commit. Evidence: test list and the three failing runs. |
| Q-314 | The suites for money formatting, `internalPath`, session parsing, the ledger filter schema and the permission matrix run on every pull request, and a pull request with a failure in any of them cannot be merged. | Review the CI configuration and branch protection; open a draft pull request that breaks one money test. Evidence: the blocked merge. |
| Q-315 | A table-driven test asserts every role × capability cell of the permission matrix in `lib/data/`; a change to the matrix fails the test until the expected table is updated in the same pull request with a security review. | Vitest on the matrix; change one cell locally and confirm the failure. Evidence: test run. |
| Q-316 | `pnpm contract:check` fails when `CONTRACT_SOURCE` is unset or unreadable instead of passing with nothing compared (R-8). | Run it with the variable unset and with a wrong path. Evidence: both exit codes. |
| Q-317 | The end-to-end suite passes three consecutive runs without a retry (P9-A9); any quarantined test has a named owner and a date by which it returns. | Three CI runs on the release candidate (needs LD4); quarantine list review. Evidence: run links. |
| Q-318 | An automated accessibility scan runs on every page in each matrix state (loading, empty, error, success) and reports zero serious or critical violations. | `@axe-core/playwright` per page state (needs LD4); until then axe DevTools by hand on the five Q-015 pages in each state. Evidence: scan reports. |

## 12. SEO readiness

Why: only P01, P02–P06 and P28 are public. Everything behind sign-in must stay out of search results; everything public must describe Ledgerline truthfully.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-137 | Root metadata title, description and title template come from constants and name Ledgerline; no starter copy remains. | Review [app/layout.tsx](../../app/layout.tsx) (see H-08). |
| Q-138 | Every public page (P01–P06, P28) exports its own unique title and description. | View source per page. |
| Q-139 | `(app)` and `(admin)` pages send `robots: noindex, nofollow`. | View source on P08 and P29. |
| Q-140 | `app/sitemap.ts` lists public routes only; `app/robots.ts` disallows `/admin`, `/api` and app routes. | Fetch `/sitemap.xml` and `/robots.txt`. |
| Q-141 | Canonical URLs derive from one metadata base constant. | View source `<link rel="canonical">`. |
| Q-142 | Open Graph and social images contain only true claims and no fabricated figures. | Review generated images. |
| Q-143 | P01 and P28 deliver their primary content in server-rendered HTML. | View source with JavaScript disabled. |
| Q-144 | Structured data, if any, states only verifiable facts (organisation name, URL); no ratings or reviews. | Rich Results Test on P01. |
| Q-145 | Help article slugs (P28) are stable, lowercase and human-readable. | Review `lib/data/` help articles. |
| Q-146 | `themeColor` and `colorScheme` are declared from constants for each colour scheme the build offers. | View source `<meta name="theme-color">`. |
| Q-319 | Status codes are truthful: P34 responds 404, P35 responds 500, and a signed-out request for any app or admin URL responds with a redirect — never 200 with page content. | `curl -I` for an unknown route, a forced server error and every protected prefix. Evidence: status lines. |

## 13. Maintainability

Why: the host rules are not style preferences; each one keeps a future change to one place.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-147 | No file in `app/`, `components/` or `lib/` exceeds 150 lines. | `max-lines` rule. |
| Q-148 | No comment appears in TypeScript or TSX source outside machine-read directives. | `starter/no-comments`. |
| Q-149 | No `any`, unchecked `as`, or `@ts-ignore` appears in source. | `@typescript-eslint/no-explicit-any`; grep ` as ` and `@ts-ignore`. |
| Q-150 | Route `page.tsx` files compose sections only — no inline data arrays, no inline components. | `starter/page-composes-only`. |
| Q-151 | Copy used twice, routes, durations and enums live in `lib/constants.ts` or `lib/<feature>/constants.ts`. | grep repeated string literals across `components/`. |
| Q-152 | Feature folders `components/<feature>/` appear only after OD4 amends the host CLAUDE.md folder table. | Review folder tree against CLAUDE.md. |
| Q-153 | No specified feature, export, schema or rule is deleted without a maintainer instruction naming it. | PR diff review against [Phase 8](phase-8-implementation-roadmap.md) statuses. |
| Q-154 | Only one library serves each need (one chart library, one table library, one form library). | `package.json` review. |
| Q-155 | IDs generated on the client use `nanoid`; `uuid` and `Date.now()` are never used for IDs. | `no-restricted-imports` + `no-restricted-properties`. |

## 14. Cross-browser compatibility

Why: finance teams run managed laptops (Edge, Chrome) and owners check on iPhones. The matrix below is the support contract.

| Browser | Versions | Engine |
|---|---|---|
| Chrome (desktop) | Last 2 stable | Blink |
| Edge (desktop) | Last 2 stable | Blink |
| Firefox (desktop) | Last 2 stable | Gecko |
| Safari (macOS) | Last 2 major | WebKit |
| iOS Safari | 17 and later | WebKit |
| Android Chrome | Last 2 stable | Blink |

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-156 | Flows X1, F1, F2, F3 and F4 complete on every browser in the matrix. | Playwright on Chromium, Firefox, WebKit (needs LD4); manual on iOS 17 and Android devices. |
| Q-157 | Native `<dialog>` in C21 and C22 opens with `showModal`, renders `::backdrop`, closes on Escape and restores focus on every matrix browser, including iOS Safari 17. | Manual on Safari 17 and iOS 17. |
| Q-158 | The `popover` attribute in C19 Tooltip and C20 Menu light-dismisses and stacks above dialogs on every matrix browser. | Manual on Firefox and Safari. |
| Q-159 | Per LD5, CSS anchor positioning is feature-detected (`CSS.supports("anchor-name", "--a")`); where unsupported, C19 and C20 fall back to the approved positioning path and never render off-screen. | Manual on Firefox and Safari 17 at viewport edges. |
| Q-160 | *Retired in 2.0.0 — visual (colour-function rendering parity); judged in the owner's build review, not by this checklist.* | — |
| Q-161 | Native date inputs in C48 DateRangeField accept and emit `yyyy-MM-dd` (`DATE_VALUE_FORMAT`) on Chrome, Firefox, Safari and iOS. | Manual per browser. |
| Q-162 | `Intl.NumberFormat` output for supported currencies (including negatives) is identical across engines. | Vitest snapshot plus manual spot check in Safari and Firefox. |
| Q-163 | C51 CopyButton uses `navigator.clipboard` in a secure context and shows a fallback message where permission is denied. | Manual on Safari and Firefox. |
| Q-164 | C49 File upload supports drag-and-drop on desktop and tap-to-choose on iOS and Android. | Manual per device. |
| Q-165 | *Retired in 2.0.0 — visual (scrollbar styling in Firefox); judged in the owner's build review, not by this checklist.* | — |
| Q-166 | Full-height layouts use dynamic viewport units, so the iOS toolbar never hides actions. | Manual on iOS Safari 17. |
| Q-167 | Form fields on touch devices do not trigger browser zoom on focus. | Manual: focus the email field on iOS Safari 17. |
| Q-168 | `:focus-visible` shows for keyboard focus and hides for pointer clicks on every matrix browser. | Manual keyboard vs mouse on Safari and Firefox. |

## 15. WCAG compliance

Why: WCAG 2.2 AA is the declared bar (seed, Technology Stack). Each row names the success criterion and the Ledgerline surface where it is most at risk.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-169 | 1.1.1 Non-text content: charts, sparklines (C31), avatars and status dots have text alternatives. | Manual SR on P08 and P23. |
| Q-170 | 1.3.1 Info and relationships: ledger headers use `<th scope>`; form groups (S11 owners) use `<fieldset>`/`<legend>`. | axe (needs LD4); DOM review. |
| Q-171 | 1.3.2 Meaningful sequence: DOM order matches visual order in S14 and S20 on all breakpoints. | Manual SR linear read. |
| Q-172 | 1.3.4 Orientation: no page locks portrait or landscape. | Manual rotate on iOS and Android. |
| Q-173 | 1.3.5 Identify input purpose: sign-in and profile fields set `autocomplete` (`email`, `current-password`, `new-password`, `one-time-code`, `name`, `tel`). | DOM review of S08 and S42 (see H-03). |
| Q-174 | 1.4.1 Use of colour: credit/debit and status are conveyed by sign, text and icon as well as colour. | Grayscale screenshot review of S23 and S34. |
| Q-175 | 1.4.3 Contrast (minimum): text is ≥ 4.5:1 in every colour scheme offered, including secondary text on every background. | Contrast check at build review; DevTools picker. |
| Q-176 | 1.4.4 Resize text: at 200% browser zoom no content or function is lost. | Manual at 200% on P10 and P12. |
| Q-177 | 1.4.10 Reflow: at 320 CSS px wide (400% zoom) content reflows without two-dimensional scrolling, except the data table itself. | Manual at 1280 px × 400%. |
| Q-178 | 1.4.11 Non-text contrast: input borders, focus ring and chart lines are ≥ 3:1 against adjacent colours. | Contrast script; manual picker. |
| Q-179 | 1.4.12 Text spacing: overriding line-height 1.5, paragraph 2×, letter 0.12em, word 0.16em clips nothing. | Text-spacing bookmarklet on P10 and P08. |
| Q-180 | 1.4.13 Content on hover or focus: C19 Tooltip is dismissible with Escape, hoverable and persistent. | Manual keyboard and pointer. |
| Q-181 | 2.1.1 Keyboard: every action, including row open, filter chips, file upload and chart data, works by keyboard. | Manual keyboard-only run of F1–F5. |
| Q-182 | 2.1.2 No keyboard trap: focus can leave the palette, dialogs, overlay and date inputs. | Manual. |
| Q-183 | 2.1.4 Character key shortcuts: single-key shortcuts can be turned off or remapped, or fire only with focus in the relevant widget. | Manual; review shortcut constants. |
| Q-184 | 2.2.1 Timing adjustable: members are warned `SESSION_WARNING_LEAD` before idle sign-out (2 minutes, Phase 1 A16; never less than the 20 s WCAG requires to respond) and can extend with one action (C55). | Manual with shortened timeout, keyboard only and with NVDA; time from warning to expiry recorded. |
| Q-185 | 2.2.2 Pause, stop, hide: auto-updating notification counts and export progress do not move or blink content. | Manual observation. |
| Q-186 | 2.3.1 Three flashes: nothing flashes more than three times per second. | Manual review of loaders. |
| Q-187 | 2.4.1 Bypass blocks: skip link present on every `(app)` and `(admin)` page. | Manual. |
| Q-188 | 2.4.2 Page titled: every page title is unique and descriptive ("Account ledger · Operating ···1234 · Ledgerline"), never the starter title. A title may carry an account nickname and its last four digits and nothing more sensitive: no full account number, balance, counterparty, member name or email. | View tab titles on every route and in browser history (see H-08). Evidence: list of titles per route. |
| Q-189 | 2.4.3 Focus order: after closing the transaction overlay focus returns to the row that opened it. | Manual on P10 → P12 overlay. |
| Q-190 | 2.4.4 Link purpose: "View", "Open" and "Download" links carry the object name in their accessible name. | Manual SR links list. |
| Q-191 | 2.4.6 Headings and labels describe topic or purpose. | Copy review. |
| Q-192 | 2.4.7 Focus visible: every focusable element shows the global focus indicator, including in forced-colors mode. | Manual Tab run in normal and forced-colors modes (see H-06). |
| Q-193 | 2.4.11 Focus not obscured (minimum): content that stays in view while the page scrolls, and C24 Transient messages, never fully hide the focused element. | Manual Tab through a long S23 ledger and S26 notes with a transient message showing, at 360 px and 1280 px and at 200% zoom. Evidence: capture of any obscured focus. |
| Q-194 | 2.5.3 Label in name: visible button text is contained in its accessible name. | axe `label-content-name-mismatch` (needs LD4). |
| Q-195 | 2.5.7 Dragging movements: C49 File upload and any chart range selection have a single-pointer alternative (a button or inputs). | Manual. |
| Q-196 | 2.5.8 Target size (minimum): every target is at least 24×24 CSS px or has sufficient spacing, including filter-chip remove buttons and table row actions. | axe `target-size` (needs LD4); DevTools measure on C47 and C02. |
| Q-197 | 3.1.1 Language of page: `<html lang="en">` is set (A6). | View source. |
| Q-198 | 3.2.2 On input: changing a filter or date field never navigates or submits without explicit action. | Manual on S21. |
| Q-199 | 3.2.6 Consistent help: the help entry (P28 link and secure-message entry) occurs in the same relative order among S02 Global utilities on every app page, and auth pages offer the same help link in the same relative order. | Tab-order review across every app page and each S08 variant (see H-04). Evidence: recorded tab order per page. |
| Q-200 | 3.3.1 Error identification: each field error names the field and the problem in text. | Manual submit of empty S10 form. |
| Q-201 | 3.3.3 Error suggestion: errors say how to fix (format, length, allowed files). | Copy review. |
| Q-202 | 3.3.4 Error prevention (legal, financial, data): irreversible actions (removing a member, rejecting a compliance case, revoking sessions) require confirmation through C52 ConfirmDialog that names the object and the consequence, can be reviewed before commit, and send no request when cancelled. | Manual on S39, S43, S52: cancel each once (network log shows no request), then confirm. Evidence: network log. |
| Q-203 | 3.3.7 Redundant entry: onboarding (S10, S11) never asks again for data already entered in the same flow; previously entered values are pre-filled. | Manual walk of F5. |
| Q-204 | 3.3.8 Accessible authentication (minimum): sign-in and step-up allow password managers and paste, accept passkeys, and never require a cognitive test (no CAPTCHA puzzle, no retyping characters). | Manual with a password manager; paste into password and OTP fields (see H-03). |
| Q-205 | 4.1.2 Name, role, value: custom controls (C09 Switch, C23 Tabs, C20 Menu) expose correct role and state. | Accessibility tree review. |
| Q-206 | 4.1.3 Status messages: filter result counts, save confirmations and export-ready events are announced without moving focus. | NVDA speech viewer. |
| Q-320 | 1.3.3 Sensory characteristics: no instruction relies on shape, colour, size, position or sound alone to identify what it refers to. | Copy review of help articles (P28), empty states and error messages for positional or colour-only references. Evidence: flagged strings. |
| Q-321 | 2.4.5 Multiple ways: every app page that is not a step in a flow can be reached in at least two ways (navigation, C38 CommandPalette, or a link from a related entity). | Walk the [Phase 3 page index](phase-3-information-architecture.md#32-page-index) recording two routes per page. Evidence: the table. |
| Q-322 | 2.5.2 Pointer cancellation: no action fires on pointer-down; releasing outside the control cancels it, including row open, confirm and download. | Manual with mouse and touch on S23 rows, C52 and S32. Evidence: tester note per control. |
| Q-323 | 3.2.3 Consistent navigation: navigation entries keep the same relative order on every page for a given role. | Tab-order capture of S01 and S02 on five pages per seeded role. Evidence: the captured orders. |
| Q-324 | 3.2.4 Consistent identification: the same function has the same name everywhere (one word each for export, download, retry, reveal, flag). | grep action labels in constants; SR links and buttons list on P10, P12, P17 and P18. Evidence: label inventory. |
| Q-325 | 3.3.2 Labels or instructions: a field with a required format, range or limit states it before the member types (date format, amount, maximum length, accepted files and size). | Manual on S10–S12, S21, S26, S31 and S40. Evidence: tester note per field. |
| Q-326 | 3.2.1 On focus: focusing a control never opens a dialog, navigates, submits or changes a filter. | Keyboard Tab run through P10, P11, P18 and P23 with the network tab open. Evidence: zero requests caused by focus alone. |

## 16. Money and data integrity

Why: a formatting bug in a banking console is a wrong balance. The backend sends integer minor units as strings plus an ISO 4217 code (spine §2); the frontend formats and never computes with floats. A date on the wrong side of a month boundary is the same kind of error as a wrong digit, so the time-zone, month-end and daylight-saving items (Q-339–Q-343) sit here.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-207 | Every money field in `lib/types/` and the contract is a string of integer minor units paired with a currency code; no money field is typed `number`. | Review contract schemas; grep `amount: number`. |
| Q-208 | No floating-point arithmetic touches money: sums and differences use `BigInt` over minor-unit strings. | grep `parseFloat`, `Number(`, `* 100`, `/ 100` near money; vitest with fast-check properties. |
| Q-209 | C40 Amount formats with `Intl.NumberFormat` using the currency's own minor-unit digits (0 for JPY, 2 for USD, 3 for BHD); where CLDR and ISO 4217 disagree, the source of the exponent is the one Phase 6 Q6-2 settles. | Vitest table test across USD, EUR, GBP, JPY and BHD, positive, negative and zero. Evidence: test run. |
| Q-210 | Minor-to-major conversion is exact for every integer up to 18 digits (no precision loss past 2^53). | fast-check property test round-tripping large values. |
| Q-211 | Sign convention holds: credits positive, debits negative, with the sign given in text; ordinary debits carry no problem severity. | Seeded ledger screenshot; vitest on C40. |
| Q-212 | Amounts in different currencies are never summed; S14 Cash position groups totals per currency. | Seeded multi-currency workspace; code review of S14. |
| Q-213 | Opening balance plus the sum of a contiguous ledger page equals the closing balance for that page, and each row's running balance equals the previous row's plus its own amount, computed with `BigInt`. | Vitest property test on the reconciliation util; script over the first, a middle and the last page of `ledger-100k`. Evidence: script output with the three sums. |
| Q-214 | When filters hide rows, the running-balance column is hidden or labelled as unfiltered, so a partial list never implies a false balance. | Manual on P10 with a type filter. |
| Q-215 | Pending transactions are excluded from Current balance; Available balance is the figure the backend reports (current minus pending debits and holds) and is never derived on the client; each is labelled by name wherever either is shown. | Seeded account with pending debits, pending credits and a hold; compare both figures with the API response; grep S14 and S20 for arithmetic on balances. Evidence: response and capture. |
| Q-216 | Percentages in C41 DeltaChip come from one tested util with a documented rounding rule; zero and negative baselines render "—" rather than infinity, a sign flip is not reported as a percentage, and equal values render as no change. | Vitest edge cases: baseline 0, negative baseline, negative to positive, equal values, a change above 1,000%. Evidence: test run. |
| Q-217 | Dates distinguish posting date from value date where both exist; statement periods use the workspace timezone boundaries. | Review S24 and S30 with seeded cross-midnight transactions. |
| Q-218 | Totals and row count in a CSV export equal the on-screen totals and count for the same filters and period, separately for each currency. | Script summing export minor units with `BigInt` per currency vs S22 figures on `ledger-100k` and on the multi-currency seed. Evidence: script output. |
| Q-219 | C51 CopyButton on an amount copies a plain canonical value with currency code, not the localized display string. | Manual paste into a text editor. |
| Q-220 | [S29 Runway calculator](phase-5-section-blueprints.md#s29--runway-calculator) uses a pure util in `lib/utils/` with unit tests, shows its assumptions, rounds months down, never reports a runway for zero or negative burn as a number of months, and rejects inputs outside its bounds constants. | Vitest including zero burn, net inflow, one-month history and bound values; UI review on P16. Evidence: test run. |
| Q-221 | Amounts are never truncated, ellipsized, abbreviated or broken mid-number at any supported width; the full value with sign and currency is always present as text. | Seeded 15-digit amount on S23, S14 and S22 at 360 px and 1920 px and at 200% zoom. Evidence: captures and the text content of each cell. |
| Q-327 | A zero amount renders once, without a plus or a minus, in the currency's own exponent; negative zero never appears. | Vitest on C40 with `"0"` and `"-0"` for USD, JPY and BHD. Evidence: test run. |
| Q-328 | A `returned` or `reversed` transaction keeps its original entry unchanged, shows the offsetting entry as its own row, links each to the other, and a full reversal leaves the balance where it stood before the original. | Seeded original + reversal and original + return pairs; `BigInt` sum check; follow both links on P12. Evidence: script output and captures. |
| Q-329 | When a pending transaction posts it appears once — never as both a pending and a posted row; the posted amount is shown when it differs from the pending amount, and Available and Current balances agree with the API afterwards. | Seed a pending row, post it through the backend with a changed amount, refetch P10. Evidence: row ids and balances before and after. |
| Q-330 | `failed` transactions change neither Current nor Available balance and are excluded from every total, and from exports unless the member includes them. | Seeded failed transactions; compare S22 and export totals with and without them. Evidence: script output. |
| Q-331 | Every amount is shown with its own currency, taken from the row and not from a workspace default; two currencies that share a symbol are told apart in text; an ISO code the runtime does not know renders as the code plus the exact number rather than failing or borrowing another symbol. | Seeded USD, CAD and AUD rows and one row with an unassigned ISO code; vitest on C40. Evidence: captures and test run. |
| Q-332 | Amounts typed into the `min` and `max` filters are converted to minor units by string parsing with the currency's exponent — "0.1", "1,250.00" and "1250" give exact values — and input beyond 15 digits or with too many decimal places is refused with a message, never rounded. | Vitest on the parser with USD, JPY and BHD inputs; manual on S21. Evidence: test run. |
| Q-333 | S22 Ledger summary totals and counts come from the server for the whole filtered set; they are never the sum of the rows loaded so far. | Code review of S22; on `ledger-100k` compare the summary after one page and after ten pages — it must not change. Evidence: both captures. |
| Q-334 | Each statement's closing balance equals the next statement's opening balance, and equals the ledger's Current balance at the end of that period. | Script over twelve consecutive seeded statements and the ledger API, with `BigInt`. Evidence: script output. |
| Q-335 | An export file's row count equals the job's `rowCount`; amounts are plain decimals with an explicit sign and a separate currency column, with no grouping separators and no scientific notation; an 18-digit minor-unit value survives intact. | Parse a seeded export with a script; open it in two spreadsheet applications and check the 18-digit row. Evidence: script output. |
| Q-336 | Text cells in an export that begin with `=`, `+`, `-` or `@` (counterparty names, notes, references) are neutralised so a spreadsheet does not evaluate them; numeric amount cells are unaffected. | Seeded counterparty named `=1+1` and a note starting with `@`; open the CSV in a spreadsheet. Evidence: the cell contents as displayed. |
| Q-337 | Export files are UTF-8, write dates as `yyyy-MM-dd`, state the period, the time zone used and whether pending transactions are included, and leave pending out unless the member chose it. | Byte inspection of a seeded export with non-Latin names; compare the stated options with the S31 input. Evidence: file header and job input. |
| Q-338 | Wherever a chart or summary abbreviates an amount, the exact amount with currency is available as text in the chart's data table. | Review S18 and S28 data tables against the API series. Evidence: comparison of three points. |
| Q-339 | A transaction posted at 23:59:59 on the last day of a month and one at 00:00:00 on the first day of the next, in the workspace time zone, each fall in the correct statement, the correct "This month" range and the correct export — for a viewer in any time zone. | Seeded boundary transactions; browser time zone emulated at UTC+14 and UTC−11; vitest with a fixed clock. Evidence: test run and captures. |
| Q-340 | Date range presets ("This month", "Last month", "Last 90 days", "Year to date") computed across a daylight-saving change give contiguous ranges with no missing and no repeated day. | Vitest with a fake clock set on both transition dates of a zone that observes daylight saving, and the day before and after. Evidence: test run. |
| Q-341 | "Today" in presets and periods is the workspace's date, the zone is stated to the member, and a member whose own date differs sees the workspace's periods, not their own. | Emulate a browser zone where the local date is a day ahead of the workspace's; read the preset range and the zone statement. Evidence: capture. |
| Q-342 | Period comparisons and year-to-date handle 29 February, 31 December to 1 January and months of unequal length without dropping or double-counting a day, and state the two periods being compared by their dates. | Vitest on the compare-range util with fixed clocks; manual on P15. Evidence: test run. |
| Q-343 | Timestamps are stored and sent in UTC and shown in the workspace time zone on member pages (UTC when the workspace has none set) and in UTC in the admin sections, with the zone available as text; an event in the repeated hour of a daylight-saving change is unambiguous. | Seeded notifications and timeline events inside the repeated hour; DOM text review. Evidence: the rendered strings. |
| Q-344 | Two transactions with the same date, amount and counterparty are both shown, keyed by their server ids; the client never merges or hides a row as a duplicate. | Seeded identical pair on S23 and in an export. Evidence: row ids. |
| Q-345 | A palette or search query that reads as an amount ("1250", "1,250.00", "$1,250") is converted by string parsing and matches both the credit and the debit of that absolute value ([Phase 3 §10](phase-3-information-architecture.md#10-search-hierarchy)). | Vitest on the query parser; seeded +1,250.00 and −1,250.00 on P11. Evidence: test run and result ids. |
| Q-387 | A statement re-issued after a correction supersedes the earlier version and says so: the new version names its version and issue date, the earlier one stays obtainable and is marked as superseded in words wherever it is listed or downloaded, the current version is the one offered by default, and the balance continuity of Q-334 holds across current versions. | Seeded statement with a re-issued version; read S30, download both versions, and hear the row with a screen reader. Evidence: capture, both files and transcript. |

## 17. Security and privacy

Why: the console exposes balances and account numbers for real businesses. Each item below closes a way that data could reach someone who should not see it. The items added on 2026-10-01 run in four groups: workspace isolation and authorisation (Q-346–Q-352), session and authentication (Q-353–Q-362), privacy (Q-363–Q-370) and the audit trail (Q-371–Q-375). Q-388–Q-392 and Q-394–Q-396 were added in 2.1.0.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-222 | The session cookie is `httpOnly`, `Secure` in production, `SameSite=Lax`, `path=/`. | Vitest on `lib/utils/session.ts`; DevTools Application → Cookies. |
| Q-223 | No access token is stored in `localStorage`, `sessionStorage` or client JavaScript state. | grep `accessToken` in client files; DevTools storage inspection. |
| Q-224 | Account numbers render masked (last 4) through [C42 MaskedAccountNumber](phase-6-interaction-contracts.md#c42--maskedaccountnumber) by default. | Visual review of S19, S20, S24. |
| Q-225 | Revealing a full account number requires step-up re-authentication (X4), is offered only to owner, finance and accountant — a viewer and every internal role (R5–R7) are refused by the backend with 403 and are never offered the control — is audit-logged with actor, account and time, and re-masks on route change, when the tab is hidden, on sign-out and after `REVEAL_TIMEOUT` (30 s, [Phase 1 BR19](phase-1-product-vision.md#data-and-operations)), with a warning 10 s before and an action to extend. A cancelled or failed step-up leaves the number masked. | Manual reveal as each seeded role R1–R7; cancel a step-up; time the warning and the re-mask, then extend once; call the reveal endpoint directly as R4, R5, R6 and R7. Evidence: timings, backend audit entries and the four 403 responses. |
| Q-226 | No PII (email, name, full account number) appears in URL paths, query strings or fragments, in page titles (Q-188) or in analytics payloads; routes use opaque ids. The member's own search term `q` is the one recorded exception ([Phase 7 §22](phase-7-frontend-architecture.md#22-security)) and is removed before any URL is reported. | Review route params; scripted run of F1–F5 capturing every navigated URL and every analytics request, then search the capture for the seeded email, names and account numbers. Evidence: capture and search result. |
| Q-227 | No PII, token or full account number appears in logs from services or route handlers. | Review logging service redaction; grep log calls; after a scripted run of X1, F3 and a reveal, search the log output for the seeded email, the full account number and the token prefix. Evidence: zero-hit search output. |
| Q-228 | Idle timeout and absolute session lifetime follow the OD2 decision and are constants (recommended 15 min idle, 12 h absolute). Until OD2 is answered this item stays failing against the 7-day cookie; it is not waived. | Review `lib/constants.ts`; manual timeout test with both values shortened. Evidence: constants and timings. |
| Q-229 | Signing out invalidates the session on the backend, not only in the browser: the old token is refused on its next request, the cookie is removed and the query cache is cleared. | Replay the old token against `/api/users/me` after sign-out and expect 401 (see H-18); inspect cookies and the React Query cache. Evidence: response and cache snapshot. |
| Q-230 | Every `(app)` and `(admin)` route prefix is protected by the proxy; an unauthenticated request to any of them redirects to sign-in. | E2E sweep of all routes signed-out (needs LD4); manual curl of each prefix (see H-14, H-26; the per-route test is Q-388). |
| Q-231 | `(admin)` routes require the ADMIN role in the proxy and again in the server layout; hiding navigation is not the guard. | Sign in as a USER and open `/admin` directly (see H-14). |
| Q-232 | C59 PermissionGate mirrors backend permissions, and for every capability in the permission matrix the backend rejects the same call with 403 when the UI gate is bypassed. | For each role, call each withheld endpoint directly (DevTools or curl with that role's session). Evidence: a role × capability table of status codes. |
| Q-233 | The post-sign-in `next` target is accepted only when it resolves to the same origin, including `/\` and encoded variants, is a path of at most 2,048 characters, and does not point into `/auth` or `/api`. | Vitest on `lib/utils/internal-path.ts` with `/\evil.test` (see H-16). |
| Q-234 | With no `next` target, a successful sign-in and a signed-in visit to `/auth/*` both land on P08 Dashboard, never on an empty page. | Vitest on `internal-path.ts` fallback and `proxy.ts` redirect; manual sign-in without `next` (see H-15). |
| Q-235 | Responses carry the headers [Phase 7 §22.2](phase-7-frontend-architecture.md#222-csrf-redirects-headers-and-content-security-policy) lists: a Content-Security-Policy with script nonces, `style-src` limited to `'self'` and the nonce, `connect-src` limited to the app and API origins, `form-action 'self'`, `base-uri 'self'` and `frame-ancestors 'none'`; HSTS in production; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; a `Permissions-Policy`; `X-Frame-Options: DENY`; `Cross-Origin-Opener-Policy: same-origin`; and `Cross-Origin-Resource-Policy: same-origin`. | `curl -I` on P01, P02 and P08 comparing each header with the §22.2 table; submit a form to a foreign origin and frame P02 from another origin (both refused); securityheaders scan (see H-17). Evidence: the three header dumps and the two refusals. |
| Q-236 | Route handlers that mutate state reject cross-origin requests (Origin check), in addition to `SameSite` cookies. | curl with a foreign `Origin` header. |
| Q-237 | Pages showing balances send `Cache-Control: no-store`, and neither the back button nor a restored tab shows a cached balance after sign-out, session expiry or a workspace switch. | `curl -I` on P08 and P10; manual: sign out and press Back; expire the session and restore the tab; switch workspace and press Back, on Chrome, Firefox and Safari. Evidence: headers and captures. |
| Q-238 | Statement and export downloads use signed URLs that expire within `DOWNLOAD_LINK_TTL` (5 minutes) and work once, with the member's role re-checked when each link is issued (Phase 1 BR19, A20), carry `Content-Disposition: attachment`, and stop working once expired. | Network tab on S30 and S32; read the expiry from the URL or response; request the same URL after expiry and expect a refusal (handled per Q-303). Evidence: both responses. |
| Q-239 | Password reset and sign-in responses do not reveal whether an email has an account: same message, same status code, same response shape for known and unknown emails. | Manual with known and unknown emails on P02 and P04; diff the two responses. Registration's existing-account response is checked by Q-392 (Phase 1 OD13; Q9-2). Evidence: response diff. |
| Q-240 | `localStorage` access is wrapped in a `useSyncExternalStore` hook that tolerates storage being unavailable (private mode, quota), and that hook holds only non-financial interface preferences (Q-365, Q-396). | Code review of `lib/utils/local-storage.ts` consumers (see H-19). |
| Q-241 | Dependency audit shows no known high or critical vulnerability in production dependencies at release; any accepted exception is written down with an owner and an expiry date. | `pnpm audit --prod` at the gate against the committed lockfile. Evidence: audit output and the exception record. |
| Q-346 | A member of workspace A who requests an account, transaction, statement, export, counterparty, saved view, attachment or member id belonging to workspace B — by URL or directly against the API — gets the same 404 as for an id that does not exist, with no data from B in the body. | Seeded workspaces A and B (P9-A2); request each of the eight id kinds both ways; diff each response against a nonexistent-id response. Evidence: the diff table. |
| Q-347 | An account a viewer (R4) is not permitted to see is absent everywhere for that viewer: lists, totals, search and palette results, counterparty totals, notifications, statements, and a direct request by id. | Seeded R4 with one permitted and one non-permitted account; search every listed surface and response payload for the non-permitted account id and last four. Evidence: search output. |
| Q-348 | Switching workspace clears the query cache, discards responses still in flight for the previous workspace, and leaves no entity of the previous workspace readable by URL or by Back. | Switch with C36 while a throttled ledger request is pending; inspect the cache; press Back; open a previous-workspace transaction URL. Evidence: cache snapshot and captures. |
| Q-349 | A download link can be issued only for a statement or export in the requester's own workspace and within the requester's role; asking for one by another workspace's id is refused as in Q-346. | Call the link-issuing endpoint as a member of A with B's statement and export ids, and as R4 in A. Evidence: responses. |
| Q-350 | When a member's role is lowered while their tab is open, their next request is refused, the role is refreshed without a reload, controls and data the new role may not have are withdrawn — including items already in the cache — and the member is told access changed. | Two browsers: owner lowers R2 to R4 while R2 has P18 open; R2 then acts. Inspect the cache for statements, exports and non-permitted accounts. Evidence: capture and cache snapshot. |
| Q-351 | Role rules cannot be bypassed by a crafted request: finance (R2) cannot invite an owner or a finance lead, no member can change their own role, and the last owner of a workspace cannot be removed or lowered. | Direct API calls with each role's session for the four cases. Evidence: status codes and unchanged backend state. |
| Q-352 | An invitation link works once, only for the invited email, and only for `INVITE_TTL_DAYS` (7 days, Phase 1 A18); resending an invitation invalidates the earlier link; a used, expired or wrong-account link explains which it is and how to get a new one, and grants nothing. | Seeded invitations: accept twice; open after expiry; open the earlier link after a resend; open while signed in as another account. Evidence: responses and membership records. |
| Q-353 | Idle timeout is enforced by the backend, not only announced by the UI: after the idle period a direct API call with the old cookie is refused; activity in one tab keeps the member's other tabs signed in. | Shortened idle value; replay the cookie with curl after expiry; two tabs with activity in one. Evidence: responses. |
| Q-354 | Continuous activity cannot extend a session past the absolute lifetime; at that limit the member re-authenticates in place and keeps unsaved text (X4). | Shortened absolute value with a script producing activity throughout; a note half-typed at the limit. Evidence: timings and the surviving text. |
| Q-355 | S43 lists every active session of the member, marks the current one, and revoking one ends it on its next request without affecting the others. | Three browsers signed in as one member; revoke one from another. Evidence: responses from all three. |
| Q-356 | "Sign out everywhere" requires step-up, ends every other session on its next request, and is recorded in the audit trail; the member is told whether the current session continues. | Three browsers; trigger from one; replay the others' cookies. Evidence: responses and audit entry. |
| Q-357 | Changing or resetting a password ends the member's other sessions and invalidates every outstanding reset link; a reset link works once and only for `RESET_LINK_TTL` (30 minutes, Phase 1 BR19). | Change the password with two other sessions open; use an older reset link; use the same reset link twice. Evidence: responses. |
| Q-358 | Signing out, or a session expiring, in one tab takes effect in the member's other tabs within 5 s (P9-A6): each stops showing balances and clears its cache. | Two tabs on P08 and P10; sign out in one and time the other. Evidence: timing and cache snapshot. |
| Q-359 | The session identifier changes at sign-in and after step-up, so a cookie value known before authentication is useless afterwards; tokens never appear in a URL, in a response body read by client code, or in browser history. | Compare cookie values before and after X1 and X4; search a HAR of X1, X4 and X5 for the token value outside `Set-Cookie`. Evidence: HAR search output. |
| Q-360 | `proxy.ts` rejects a token that is expired, unsigned (`alg: none`), signed with a symmetric algorithm using the public key, or issued for another audience or issuer; each is treated as signed out. | Vitest on `proxy.ts` with one forged token per case. Evidence: test run. |
| Q-361 | A step-up grant lasts `STEP_UP_GRANT_SECONDS` (5 minutes, Phase 1 A16), applies only to the single purpose it was given for, and cannot be replayed after it lapses; a grant issued for any other purpose never authorises a money movement — each transfer or payment confirmation asks for its own grant; `AUTH_MAX_ATTEMPTS` (5) failures within 15 minutes lock further attempts for 15 minutes (Phase 1 A17, [Phase 7 §22.3](phase-7-frontend-architecture.md#223-throttling-and-lockout-backend-expectations)) and point the member to X5. | Reveal once, wait past the grant, reveal again (step-up required again); try a password change on a reveal grant; fail step-up five times. Evidence: responses. |
| Q-362 | When sign-in, two-step, reset or invite requests are rate limited, the member is told to wait and for how long, the submit cannot be repeated before then, a two-step challenge lapses after `CHALLENGE_TTL` (5 minutes), and a two-step code cannot be used twice. | Trigger each limit on the seeded backend; reuse an accepted one-time code. Evidence: responses and captures. |
| Q-363 | Before a reveal, the full account number is nowhere on the client: not in the HTML, the accessibility tree, component props, the query cache or any network response; after re-masking it is gone from memory-backed caches (`gcTime: 0`). | Search page source, the React component tree, the query cache and a HAR for the seeded full number before reveal, during, and after re-mask. Evidence: search output for each moment. |
| Q-364 | Analytics, Web Vitals and error reports contain no amount, balance, account number, counterparty, member name, email, note text or search text; reported URLs have their query string removed. | Capture every outgoing reporting request during F1–F4 and a forced error; search the payloads for seeded values. Evidence: capture and search output. |
| Q-365 | No balance, transaction, account number, statement or export content is written to `localStorage`, `sessionStorage`, IndexedDB, the Cache API or a service worker; only preferences are. | DevTools Application panel after a full F1–F4 session; list every key and its value. Evidence: the key list. |
| Q-366 | Authenticated pages request nothing from an origin outside an approved list held in constants (the app origin, the API origin, the reporting service); the Content-Security-Policy enforces the same list. | HAR of F1–F4 grouped by origin; compare with the constant and the CSP header. Evidence: the origin list. |
| Q-367 | Text supplied by members or by the bank — notes, messages, counterparty names, references, workspace and saved-view names, file names — is always rendered as text; markup or script in it is inert in pages, exports and notifications. | Seeded values containing `<img src=x onerror=alert(1)>` and a `javascript:` link in each field; visit every surface that shows them. Evidence: no script execution and the DOM text. |
| Q-368 | Uploaded files are served as attachments with `X-Content-Type-Options: nosniff` and never render inline from the app origin; an uploaded SVG or HTML file cannot run script in a member's session. | Upload an SVG with script and an HTML file on S26; open each as another member. Evidence: response headers. |
| Q-369 | The client bundle contains no secret: no private key, no service credential, and no environment variable beyond a reviewed list of `NEXT_PUBLIC_` names. | grep the production build output for key markers and for every environment variable name; compare with the reviewed list. Evidence: grep output. |
| Q-370 | An export contains only the columns the member chose and nothing their role cannot see on screen: no account outside their permitted accounts and no note or attachment reference unless chosen. How account numbers appear in exports and statements follows Q9-1. | Exports as R1, R2 and R3 with minimal and full column choices; attempt as R4 (refused per Q-064). Evidence: file headers and a search for non-permitted account ids. |
| Q-371 | Each action BR16 lists produces one backend audit record with actor, role held, workspace, target, UTC time, outcome and request reference ([Phase 3 §6.3](phase-3-information-architecture.md#63-enforcement-point-denial-and-audit-record-per-capability)): sign-in success and failure, sign-out, step-up, account-number reveal, role change, invitation and removal, export creation and download, statement download, session revocation, password and two-step changes, verification decision, admin user create, update and delete, support lookup. | Scripted run performing each action once, then an audit query per action (backend dependency). Evidence: the audit rows mapped to the action list. |
| Q-372 | Audit records hold no secret — no password, token, one-time code or full account number — and refused attempts (403, failed step-up, failed sign-in) are recorded as well as successes. | Search the audit rows from Q-371 for seeded secrets; perform three refused actions and find their records. Evidence: search output and the three rows. |
| Q-373 | Nothing in the product can alter or delete an audit record: the contract publishes no such operation, and reading follows the default of [Phase 1 OD12](phase-1-product-vision.md#open-decisions): R7 reads all, R6 reads case history, R5 reads only the entries tied to a reference a member quoted, and a workspace member's request for audit records is refused in v1 (Phase 1 A23, Phase 3 IA9) — a member may ask support for entries about their own workspace. | Review `lib/contract/` for audit operations; attempt PATCH and DELETE on an audit resource as R7; attempt a read as R1, a read outside case history as R6, and a read with and without a quoted reference as R5. Evidence: operation list and responses. |
| Q-374 | Every view of a workspace's or member's data by internal staff (R5 support lookup, R6 case review, R7 user record) is audited with the staff actor and the target. | Perform one lookup on S53, one case open on S52 and one record open on S50; query the audit trail. Evidence: the three rows. |
| Q-375 | Every annotation change on a transaction (note added or removed; category; flag; attachment) is attributable: the transaction's history names who made it and when. A note is never edited — no edit control is offered and the backend refuses an edit request. Only its author or a workspace owner (R1) may remove it; the removal is audited and leaves an attributed "note removed" entry, naming who removed it and when, in the transaction's history. | Two members annotate one seeded transaction; the author removes one note and an owner removes another; a third member (R2, not the author) attempts a removal and an edit request is sent directly; read the history on P12, the API and the audit trail. Evidence: capture, the refused responses and the audit rows. |
| Q-388 | Every route file under `app/(app)/` and `app/(admin)/` is covered by a protected prefix: a test that lists the route files of both groups and checks each resulting path against `PROTECTED_ROUTE_PREFIXES` fails when a page is added without one, and the `(app)` and `(admin)` server layouts refuse a request without a session independently of the proxy. | Vitest that walks both route groups and asserts coverage, run on every pull request; signed-out `curl -I` of each derived path (see H-14, H-26). Evidence: test run and status lines. |
| Q-389 | The query cache lives in memory only ([Phase 7 §8](phase-7-frontend-architecture.md#8-hooks)): no persister is configured, no dehydrated cache is written to `localStorage`, `sessionStorage`, IndexedDB or the Cache API, and closing the tab leaves no query result on the device. | grep for `persist` in `components/providers/`, `lib/` and `package.json`; DevTools Application panel after F1–F4; reopen the browser offline and confirm no figure renders (complements Q-365, which lists what storage may hold). Evidence: grep output and storage listing. |
| Q-390 | Background requests do not keep a session alive: notification polling, export-status polling, focus refetch and background refetch do not reset the idle timer in the browser or on the backend, so an untouched tab left on P08 or P18 reaches the idle warning and expiry when an idle tab with no polling would ([Phase 7 §22.1](phase-7-frontend-architecture.md#221-session-and-step-up-policy)). | Shortened idle value; leave P18 open with a running export and P08 open, both untouched; time the warning and the expiry, then replay the cookie. Evidence: timings, request log and the refused response. |
| Q-391 | A runway link a member copies or shares carries no balance: a figure the product read from the member's accounts (cash, burn, inflow) is never written into the address or the copied text; the link holds only values the member entered and the target, and whoever opens it sees figures from their own permitted data or the not-permitted state. | On P16 with seeded accounts, copy the link without editing and again after editing one input; inspect both copied strings and the address bar; open the link as a seeded R4 without access (see H-32). Evidence: the two copied strings and the R4 capture. |
| Q-392 | Registration does not disclose that an email already has an account, per the default of [Phase 1 OD13](phase-1-product-vision.md#open-decisions): a known and an unknown email get the same message, status code and response shape, no session is started for the known one, and the existing account holder is told by email. The item stays failing, not waived, until OD13 is answered; if the maintainer keeps the difference, that decision is recorded here as an accepted disclosure. | Register with a seeded existing email and with a new one; diff the two responses and the two screens; check the seeded inbox (backend dependency; see H-34). Evidence: response diff and the email. |
| Q-394 | Export job visibility follows the role: a member sees their own jobs; an owner (R1) and finance (R2) also see every job in the workspace; an accountant (R3) sees only their own. Another member's job is absent from R3's list in S32, from their notifications and from every response payload, and R3 asking for its status or a download link by id is answered exactly like a missing id (Q-346). | Seeded R1, R2 and two R3 members each create one export; read S32 as each; as one R3 request the other R3's job status and download link by id; search R3's payloads for the other job ids (backend dependency). Evidence: the four job lists and the two responses. |
| Q-395 | A support thread belongs to the member who opened it and is readable only by that member and the workspace's owners (R1). A colleague in the same workspace who is not an owner (R2 or R3) does not see it in the thread list (S36), in a conversation (S37), in notifications, in search or palette results, or in any response payload, and opening it by id is answered exactly like a missing id (Q-346); the owner can read it. | Seeded R2 opens a thread with an attachment; as a second R2 and as R3 read P21 and request the thread, its messages and its attachment by id; as R1 open the same thread; search the colleagues' payloads for the thread id (backend dependency). Evidence: the three thread lists and the responses. |
| Q-396 | A draft — a half-typed note, message, decision reason or form interrupted by session expiry, step-up or a refused write — lives only in the open tab's memory: it is never written to `localStorage`, `sessionStorage`, IndexedDB or a service-worker cache, it survives re-authenticating in place, and it is gone when the tab closes or a different user signs in. | Half-type a note on P12 and a message on P21, then expire the session; list every storage key and value in the DevTools Application panel and search them for the typed text; re-authenticate and confirm the text is intact; repeat and close the tab, then repeat and re-authenticate as another seeded user. grep `lib/` and `components/` for storage writes outside the preferences hook (Q-240). Evidence: the storage listing, the search result and grep output. |

## 18. Content truthfulness

Why: an invented balance, a fake testimonial or an unearned compliance badge is a claim the product makes to real businesses. Nothing invented reaches a real person.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-242 | Frontend source contains no fabricated balances, transactions, counterparties, customer names or logos. | grep `lib/data/` and `components/` for currency-shaped literals and company names. |
| Q-243 | Development and demo data come only from the backend seed (`backend/prisma/seed.ts`). | Review `lib/data/` holds only static copy and config (nav, help, empty-state copy, permission matrix). |
| Q-244 | Every marketing claim in S04–S07 comes from a constant approved by product and compliance, with its source recorded. | Review claim constants and approval record. |
| Q-245 | No testimonial, rating, customer logo, regulator badge, security certification, licence, deposit-protection statement or uptime figure appears unless it is true and approved in writing. | Read-through of P01 and P28; approval log lists each such claim with approver and date. Evidence: claim list against the log. |
| Q-246 | Empty states never show sample or placeholder data styled as real data. | Review of every C32 usage. |
| Q-247 | Deferred features (P26 Transfer, P27 Payees & bill pay) are not advertised as available anywhere in v1 copy. | grep "send money", "pay", "transfer" in copy constants and P01. |
| Q-248 | Help articles (P28) describe shipped behaviour only and are reviewed at each release. | Release checklist sign-off: each article's steps are traced to a page that exists in the release, and an article with an untraceable step fails (see H-30). Evidence: the article-to-page list. |
| Q-249 | No starter branding remains ("Next.js App Router Starter", "Opinionated Next.js starter"). | grep in `app/` and `lib/` (see H-08). |
| Q-250 | Metadata and social previews make no claim that the product page itself does not support. | Review metadata constants against P01 copy. |
| Q-376 | Every derived figure — runway, period deltas, any projection — is stated to be an estimate together with the inputs it rests on; none is presented as a balance or as a fact from the bank. | Copy review of S28, S29 and C41 usage. Evidence: the labelled strings. |
| Q-377 | An "as of" time always comes from the server response, never from the device clock, and cached data is never described as just updated. | Set the device clock an hour wrong and load P08; go offline and reload. Evidence: capture against the response timestamp. |
| Q-378 | The product never says "saved", "sent", "exported", "invited", "verified" or "revoked" before the backend has confirmed it, apart from the optimistic category and flag changes that roll back (Q-093). | Delay each mutation response by 5 s and read the copy shown meanwhile. Evidence: capture per mutation. |
| Q-379 | Every number in copy that describes a limit or a duration (file size, maximum export range, timeout, link expiry) is interpolated from the constant that enforces it. | grep copy constants and help articles for digits; trace each to its constant. Evidence: the mapping list. |
| Q-380 | Outage, offline and error copy says that viewing failed and makes no statement about the member's money — neither that it is safe nor that it changed — unless the backend reported that fact. | Copy review of S54, C33, P35 and offline strings against X10 (see H-33). Evidence: the reviewed strings. |

## 19. Public site (added 2.0.0)

Why: the built home page (P01) is the first thing a real business reads. Its claims must be true or clearly marked, and it must lead people to sign in or start. These items stay failing, not waived, until OD9 and OD10 are answered.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-251 | P01 states only approved, true claims about v1 — or is explicitly kept as a non-deployed design study (OD9 option C). | Review S04, S06, S55–S64 copy against [Phase 1 OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is). |
| Q-252 | Every sample figure, balance, rate, price and company on a public page is labelled as a sample in adjacent text. | Read-through of P01 with a screen reader. |
| Q-253 | While OD9 is open, the design-study disclosure is present on every public page. | Review S07 on P01 and P28. |
| Q-254 | P01 offers a route to sign in (P02) and a way to start (P03 or X11 per OD10). | Manual from P01. |
| Q-255 | S64 validates the email, ties the error to the field, never puts the email in a URL, its confirmation says truthfully what was sent, and a repeated submission records at most one enquiry. | Manual; network tab; double activation of submit. Evidence: network log. |
| Q-256 | C64 disclosures expose `aria-expanded` and `aria-controls` and operate with Enter/Space. | Accessibility tree; keyboard. |
| Q-257 | C65 exposes `aria-expanded`/`aria-controls`, its name reflects its state, Escape closes it and focus returns to the toggle. | Manual at 390 px with keyboard and VoiceOver. |
| Q-258 | C66 samples say in text that nothing real happens; switches expose `role="switch"` and `aria-checked`; the approval result is announced. | Accessibility tree; NVDA. |
| Q-259 | C68 exposes each heading to assistive technology as one phrase; with reduced motion the text appears at once. | Accessibility tree; reduced-motion emulation. |
| Q-260 | All P01 content is readable with JavaScript disabled and with reduced motion; nothing primary is hidden behind a reveal. | View with JS off; emulate reduced motion. |
| Q-261 | `lib/ledgerline/money.ts` is imported only by public-page files; product money goes through C40 (H-24). | grep imports. |
| Q-262 | No product domain type shares a name with a public-page sample type exported from `lib/types/` (H-25). | Type-check after domain types land; grep `lib/types/index.ts`. |
| Q-393 | Any full card number shown as a sample on a public page fails the check-digit (Luhn) test, so it cannot be mistaken for or used as a real card; a masked sample shows at most the last four digits. | Vitest that runs a Luhn check over every card-shaped digit string in `lib/data/ledgerline/` and expects each to fail; read-through of S55–S64 for card numbers. Evidence: test run. |

## Host audit findings

Confirmed in code on 2026-09-26 by reading the files named, and re-checked against the working tree on 2026-10-01: sign-in moved from `components/common/login-form.tsx` and `app/auth/login/page.tsx` to `components/auth/` and `app/(auth)/auth/login/page.tsx`, and the home page from `app/page.tsx` to `app/(marketing)/page.tsx`. Every finding keeps its number and carries a re-check line with one of three states — still present, changed, or no longer reproducible — and its evidence; links point to files that exist. H-26–H-31 were added in that re-check, and H-32–H-34 were confirmed in code the same day. Each finding leads with what a user experiences, then the mechanism, the fix, and the Q-item that catches a recurrence. Severity: **S1** blocks or misleads users or exposes data; **S2** degrades experience or accessibility; **S3** convention drift with no direct user effect.

### H-01 — Sign-in error text renders unstyled (S2)

- **Users see:** after a failed sign-in, the error sentence appears in the same colour as body text, so it is easy to miss.
- **Where:** originally `components/common/login-form.tsx:69`, which used `text-danger` while `@theme` defines `--color-error`, not `--color-danger` ([styles/globals.css](../../styles/globals.css)). The message is now rendered by [components/auth/auth-form-error.tsx:19](../../components/auth/auth-form-error.tsx).
- **Fix:** use `text-error`; add the class-existence script to the gate.
- **Re-check (2026-10-01):** No longer reproducible. `login-form.tsx` is gone; `auth-form-error.tsx:19` uses `text-error`, and `text-danger` appears nowhere in `app/`, `components/` or `lib/`.
- **Caught by:** Q-007 (error tied to fields); Q-103 retired. The colour of the message is a build concern; that it is announced and associated is not.

### H-02 — Every sign-in failure says "Email or password is incorrect" (S1)

- **Users see:** during a backend outage, a rate limit or a malformed request, they are told their password is wrong and may reset a working password or lock their account.
- **Where:** originally [app/api/session/route.ts](../../app/api/session/route.ts) answered a 400 and every non-OK upstream with the one `INVALID_CREDENTIALS` text, and `login-form.tsx:68-70` showed that string for any `isError`. Today: [route.ts:14,21-28](../../app/api/session/route.ts), the messages in [lib/data/auth/sign-in.ts:54-65](../../lib/data/auth/sign-in.ts) and the status read in [sign-in-form.tsx:39-40](../../components/auth/sign-in-form.tsx).
- **Fix:** forward the upstream status class; map 401, 429, 400 and 5xx/network to distinct constants; the form reads the status.
- **Re-check (2026-10-01):** Changed. The route now answers 400, 503 (upstream 5xx or unreachable), 429 and 401 separately (`route.ts:14,21-28`) and the form picks the message by status, so an outage is no longer reported as a wrong password. Remainder: the 429 text is the fixed sentence "Wait a minute" ([sign-in.ts:57-58](../../lib/data/auth/sign-in.ts)) and `Retry-After` is not read or passed on (`route.ts:24-26`), and any other upstream 4xx still falls through to the 401 message (`route.ts:28`).
- **Caught by:** Q-073.

### H-03 — Password managers and autofill are not helped on sign-in (S2)

- **Users see:** browsers and password managers may not recognise the fields, so members type credentials by hand; screen readers hear a field whose id is "Email".
- **Where:** originally `login-form.tsx:51-64` (label text used as `htmlFor`, `id` and `name`; no `autoComplete`; a placeholder built from the label). Today: [sign-in-form.tsx:35,79,89](../../components/auth/sign-in-form.tsx), [auth-field.tsx:42,51-54](../../components/auth/auth-field.tsx) and [sign-in.ts:8-23](../../lib/data/auth/sign-in.ts).
- **Fix:** ids from `useId` through C10 Field; `name` equal to the schema key; `autoComplete="email"` and `"current-password"`.
- **Re-check (2026-10-01):** No longer reproducible. Ids come from `useId` (`sign-in-form.tsx:35,79,89`), `name` is the schema key and `autoComplete` is `email` / `current-password` (`sign-in.ts:8-23`, applied at `auth-field.tsx:51-54`); no placeholder is built. The fields use `components/auth/auth-field.tsx`, not the C10 primitive in `components/ui/field.tsx`.
- **Caught by:** Q-006, Q-173, Q-204.

### H-04 — A member who forgot their password has no way forward from sign-in (S1)

- **Users see:** no "Forgot password" and no "Create account" link on the sign-in card.
- **Where:** originally `login-form.tsx:41-77` (heading, fields, error and submit only). Today: [sign-in-form.tsx:94-101,109](../../components/auth/sign-in-form.tsx) and [sign-in.ts:32-40](../../lib/data/auth/sign-in.ts).
- **Fix:** S08 sign-in variant links to P04 and P03 from route constants, in the same position on every auth variant.
- **Re-check (2026-10-01):** Changed. A "Get started" link to the register page is present (`sign-in.ts:36-40`, rendered at `sign-in-form.tsx:109`). "Forgot password?" is present but leads to the help article `signing-in-and-sessions` (`sign-in.ts:32-35`), not to P04, which has no route; a member who forgot their password still cannot reset it from here.
- **Caught by:** Q-199.

### H-05 — Sign-in error is not tied to the fields (S2)

- **Users see:** a screen-reader user hears the alert once, but on returning to the email field hears nothing about the error.
- **Where:** originally `login-form.tsx:56-69` (no `aria-invalid`, no `aria-describedby`, an alert with no id). Today: [sign-in-form.tsx:41-43,59-60,68,76](../../components/auth/sign-in-form.tsx) and [auth-field.tsx:59-60](../../components/auth/auth-field.tsx).
- **Fix:** give the message an id and reference it from both inputs while `isError`.
- **Re-check (2026-10-01):** Changed. Both inputs now set `aria-invalid` on a 400 or 401 (`sign-in-form.tsx:41-42`, `auth-field.tsx:59`), the message has an id and receives focus on failure (`sign-in-form.tsx:59-60,76`). Remainder: the message id is referenced by the `<form>` (`sign-in-form.tsx:68`), while each input's `aria-describedby` points only at its hint (`auth-field.tsx:60`), so returning to a field still does not read the error.
- **Caught by:** Q-007.

### H-06 — Keyboard focus disappears in Windows high-contrast mode (S1)

- **Users see:** in forced-colors mode, tabbing onto the sign-in button or fields shows no focus indicator at all.
- **Where:** [components/ui/button.tsx:51](../../components/ui/button.tsx) combines `focus-visible:outline-none` with `focus-visible:ring-2`, and the sign-in inputs at [auth-field.tsx:63](../../components/auth/auth-field.tsx) (formerly `login-form.tsx:63`) combine `focus:outline-none` with `focus:ring-4`. In the installed Tailwind 4.3.3, `outline-none` sets `outline-style: none`, and the ring is a box-shadow, which forced-colors mode removes. [styles/globals.css](../../styles/globals.css) (lines 1-493) has no `:focus-visible` rule to fall back on.
- **Fix:** remove the `outline-none` overrides so a visible focus indicator survives forced-colours mode (how it looks is decided at build).
- **Re-check (2026-10-01):** Still present. `button.tsx:51` is unchanged and the email and password inputs carry the same pattern at `auth-field.tsx:63`; `globals.css` has no `:focus-visible` rule. Changed in part: the sign-in submit (`components/auth/auth-submit.tsx`, through `components/ledgerline/ledger-button.tsx:35`) and the show-password toggle (`components/auth/password-field.tsx:26`) keep a real outline on focus.
- **Caught by:** Q-192, Q-016.

### H-07 — Button has no displayName (S3)

- **Users see:** nothing directly; React DevTools and error stacks show an anonymous forwardRef.
- **Where:** [components/ui/button.tsx:29-64](../../components/ui/button.tsx) defines the forwardRef and exports without `Button.displayName`.
- **Fix:** set `displayName` per the primitive standard.
- **Re-check (2026-10-01):** Still present. `components/ui/button.tsx:29-64` sets no `displayName`; a search of `components/ui/` finds none on any primitive.
- **Caught by:** Q-113.

### H-08 — Every tab and search result says "Next.js App Router Starter" (S2)

> **2.0.0 status:** the working-tree `app/layout.tsx` now sets a Ledgerline title and description and a theme colour from `lib/ledgerline/constants.ts`. Open remainder: P02 exports no page title; no `PAGE_TITLES`.

- **Users see:** the browser tab, bookmarks and link previews carry starter branding; mobile browser chrome is painted white even when the product is dark.
- **Where:** originally `app/layout.tsx:9-15` (light colour scheme, white theme colour, starter title and description) and `app/auth/login/page.tsx` (no metadata). Today: [app/layout.tsx:13-14,18-20](../../app/layout.tsx) and [app/(auth)/auth/login/page.tsx:13](../../app/%28auth%29/auth/login/page.tsx).
- **Fix:** metadata and viewport constants (title template, description, per-scheme theme colour), and a page title on every route.
- **Re-check (2026-10-01):** Changed. No starter branding remains in `app/` or `lib/`. `layout.tsx:14` takes the theme colour from `LEDGERLINE_THEME_COLOR`, and P02 exports its title from `SIGN_IN_COPY.metaTitle` (`login/page.tsx:13`). Remainder: the root title and description are inline literals (`layout.tsx:18-20`) with no title template, `colorScheme` is the literal `"dark"` (`layout.tsx:13`), and no `PAGE_TITLES` constant exists.
- **Caught by:** Q-137, Q-146, Q-188, Q-249.

### H-09 — `text-micro` is documented but cannot be used (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** nothing until a component writes `text-micro`, which then renders at the inherited size.
- **Where:** [styles/tokens.css:127-130](../../styles/tokens.css) defines `--font-sizes-micro`; the `@theme` block in [styles/globals.css:6-118](../../styles/globals.css) maps no `--text-micro`.
- **Fix:** add the mapping with line-height and weight siblings.
- **Re-check (2026-10-01):** Still present (retired as visual). `@theme` in `styles/globals.css` still maps no `--text-micro`; the size is now reachable through the named class `.micro-label` (`globals.css:292-294`), which reads `--font-sizes-micro` directly.
- **Caught by:** Q-102.

### H-10 — Raw values in globals.css bypass the tokens (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** nothing today; a reskin that changes tokens leaves these values behind, so parts of the UI stop matching.
- **Where:** [styles/globals.css](../../styles/globals.css) lines 206 (`32px` dot grid), 211 (`0 2px 10px` glow), 221 (`768px`), 230 (`18rem`), 234 (`1279px`), 251-252 (`8px` scrollbar), 261 (`4px` radius), 327-328 (`18px` icon), 337 (weight `600`), 341 (`0.4px` letter-spacing), 346 (weight `300`), 357 (weight `400`).
- **Fix:** move each to a token in tokens.css (breakpoints, icon size, scrollbar size, tracking, weights) and reference it.
- **Re-check (2026-10-01):** Still present (retired as visual). The lines moved as the file grew to 493 lines: `32px` at `globals.css:330`, `768px` at 345, `18rem` at 354, `1279px` at 358; the other values were not re-located one by one.
- **Caught by:** Q-101.

### H-11 — Every stat card lifts on hover and transitions all properties (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** cards shift by a pixel under the pointer across the whole dashboard, which the density brief reserves for one focal tile.
- **Where:** [styles/globals.css:284-288](../../styles/globals.css) (`translateY(-1px)` on every `.stat-card`), line 278 and line 161 (`transition: all`).
- **Fix:** a focal-tile modifier carries the lift; base cards and `.smooth` transition colour properties only.
- **Re-check (2026-10-01):** Still present (retired as visual). `.stat-card:hover` still lifts by a pixel (`globals.css:408-411`) and `transition: all` remains at `globals.css:285` and `402`.
- **Caught by:** Q-106.

### H-12 — Named spacing classes are editorial-sized in a dense register (S2)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** any app view that uses `.pad` or `.gap` gets 40 px padding and gaps, so a ledger shows noticeably fewer rows per screen.
- **Where:** `.pad`, `.gap` in [styles/globals.css:126-150](../../styles/globals.css) resolve to `--paddings-md` / `--gaps-md` = `2.5rem` ([styles/tokens.css:157,164](../../styles/tokens.css)), above the p-4 / gap-4 ceiling in [tools/eslint/rules/application-register-density.ts:14-22](../../tools/eslint/rules/application-register-density.ts), which checks utility classes only.
- **Fix:** decided at build (visual).
- **Re-check (2026-10-01):** Still present (retired as visual). `.pad` and `.gap` families at `globals.css:250-274` still resolve to `2.5rem` (`tokens.css:157,164`); the density rule's ceilings are unchanged (`application-register-density.ts:14-22`).
- **Caught by:** Q-108.

### H-13 — No dark theme tokens exist (S2)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** the product renders only in the light starter palette; the dark default specified for Ledgerline (OD7) is unavailable.
- **Where:** [styles/tokens.css:4-239](../../styles/tokens.css) is a single `:root` block; [styles/globals.css:4](../../styles/globals.css) declares the `dark` variant but no token redefinition exists for it.
- **Fix:** decided at build (visual).
- **Re-check (2026-10-01):** Changed (retired as visual). A dark palette now exists as the `.theme-ledgerline` block ([styles/tokens.css:241](../../styles/tokens.css)), applied to `<html>` at `app/layout.tsx:31`. No token redefinition exists for the `dark` variant (`globals.css:4`), and no light alternative is offered.
- **Caught by:** Q-111.

### H-14 — Only `/dashboard` is protected, and no route checks the admin role (S1)

- **Users see:** any future app or admin route not added to the list is reachable signed-out; a signed-in USER is not stopped from opening admin routes by the proxy.
- **Where:** [lib/constants.ts:21](../../lib/constants.ts) `PROTECTED_ROUTE_PREFIXES = ["/dashboard"]`; [proxy.ts:23-33](../../proxy.ts) checks session presence only, never `session.role`.
- **Fix:** protected prefixes for every `(app)` and `(admin)` segment from one constant; admin prefixes require `ADMIN` in the proxy and in the `(admin)` server layout.
- **Re-check (2026-10-01):** Still present. The constant moved to `constants.ts:21` with the same single prefix, and `proxy.ts:23-33` still never reads the role. Changed in part: [app/(admin)/layout.tsx:10-12](../../app/%28admin%29/layout.tsx) now refuses a request with no session or without the admin role in the server layout, which is the second of the two guards the fix names. The first route to be exposed by the missing prefix is H-26.
- **Caught by:** Q-230, Q-231.

### H-15 — After signing in without a `next` target, members land on a blank page (S1)

- **Users see:** a completely empty page after a successful sign-in, and again whenever a signed-in member opens `/auth/login`.
- **Where:** [lib/utils/internal-path.ts:6](../../lib/utils/internal-path.ts) falls back to `HOME_ROUTE` (`"/"`, [lib/constants.ts:13](../../lib/constants.ts)); [proxy.ts:19-21](../../proxy.ts) redirects signed-in `/auth/*` visitors to the same route. That route was `app/page.tsx`, an empty fragment; it is now the public home page, [app/(marketing)/page.tsx](../../app/%28marketing%29/page.tsx). `/dashboard` has no route file in `app/`, so `next=/dashboard` ends at a 404.
- **Fix:** a post-sign-in route constant pointing at P08, used by both the fallback and the proxy redirect.
- **Re-check (2026-10-01):** Changed. The page is no longer blank: `/` renders the public home page (`app/(marketing)/page.tsx:13-29`). The defect that remains is the destination — after signing in with no `next`, and on opening `/auth/login` while signed in, a member lands on the public marketing page rather than P08, and `/dashboard` still has no route file.
- **Caught by:** Q-234, Q-233.

### H-16 — A crafted sign-in link can send members off-site after they sign in (S1)

- **Users see:** a phishing link to the real sign-in page that forwards them to a look-alike site right after authenticating.
- **Where:** [lib/utils/internal-path.ts:4](../../lib/utils/internal-path.ts) accepts any value starting with `/` but not `//`; `/\evil.test` passes, and URL parsing treats `\` as `/` for http(s), producing `//evil.test`. [internal-path.test.ts](../../lib/utils/internal-path.test.ts) covers `https://` and `//` only.
- **Fix:** resolve against a fixed origin and accept only same-origin results; add the backslash and encoded cases to the test.
- **Re-check (2026-10-01):** Still present. `internal-path.ts:4` still accepts any value that starts with `/` and not `//`, so `/\evil.test` passes and reaches `router.push` at `components/auth/sign-in-form.tsx:56`; `internal-path.test.ts:10-16` still covers `https://` and `//` only.
- **Caught by:** Q-233.

```ts
import { HOME_ROUTE } from "@/lib/constants";

const PROBE_ORIGIN = "http://internal.invalid";

export const internalPath = (candidate: string | undefined): string => {
    if (!candidate?.startsWith("/")) return HOME_ROUTE;
    const resolved = new URL(candidate, PROBE_ORIGIN);
    return resolved.origin === PROBE_ORIGIN
        ? `${resolved.pathname}${resolved.search}${resolved.hash}`
        : HOME_ROUTE;
};
```

### H-17 — No security headers or Content-Security-Policy (S1)

- **Users see:** nothing until an injected script or a framing attack runs; nothing in the response limits either.
- **Where:** [next.config.ts:3](../../next.config.ts) is an empty config; [proxy.ts](../../proxy.ts) sets no headers.
- **Fix:** CSP with nonces set in the proxy; HSTS, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` via `headers()`.
- **Re-check (2026-10-01):** Still present. `next.config.ts:3` is still an empty config and `proxy.ts:14-36` sets no response header.
- **Caught by:** Q-235.

### H-18 — Signing out does not end the session on the server (S2)

- **Users see:** nothing; but a token copied before sign-out keeps working until it expires, up to 7 days.
- **Where:** [app/api/session/route.ts:31-35](../../app/api/session/route.ts) deletes the cookie only; [lib/constants.ts:28](../../lib/constants.ts) `SESSION_MAX_AGE` is 7 days (OD2). Backend dependency: a revoke endpoint.
- **Fix:** call the backend revoke on DELETE once published; shorten lifetime per OD2.
- **Re-check (2026-10-01):** Still present. The handler moved to `route.ts:31-35` and still only deletes the cookie; `SESSION_MAX_AGE` is still 7 days (`constants.ts:28`); [lib/hooks/use-logout.ts:5-8](../../lib/hooks/use-logout.ts) does not clear the query cache either.
- **Caught by:** Q-229.

### H-19 — localStorage helper can throw and has no React binding (S3)

- **Users see:** in Safari private mode or with storage full, a preference write can throw and break the interaction that triggered it.
- **Where:** [lib/utils/local-storage.ts:1-18](../../lib/utils/local-storage.ts) calls `localStorage` without try/catch; no `useSyncExternalStore` hook wraps it.
- **Fix:** a `use-local-storage` hook over `useSyncExternalStore` with guarded reads and writes.
- **Re-check (2026-10-01):** Still present. `lib/utils/local-storage.ts:1-18` is unchanged: no try/catch and no `useSyncExternalStore` hook. No component or hook imports it today, so nothing can throw yet.
- **Caught by:** Q-240.

### H-20 — Lint rules have blind spots (S3)

> **2.0.0 status:** the owner removed `token-first-classnames` in the working tree, so its part of this finding no longer applies. The density-rule blind spot remains.

- **Users see:** nothing directly; violations the rules were written to stop can merge.
- **Where:** `tools/eslint/rules/token-first-classnames.ts:10` (removed by the owner in the working tree) anchors the responsive pattern at the token start, so `hover:md:p-4` and `dark:lg:flex` pass; line 67 checks arbitrary values only inside a `className` attribute, so module-scope variant maps (the pattern in [button.tsx:16-27](../../components/ui/button.tsx)) escape. [application-register-density.ts:14-22](../../tools/eslint/rules/application-register-density.ts) has no ceiling for `px-`, `pt-`, `pb-`, `m-` families. ESLint reads only TypeScript, so CSS comments ([globals.css:8,288-290,392,430,455](../../styles/globals.css) and the banner comments throughout [tokens.css](../../styles/tokens.css)) are unchecked by `starter/no-comments`.
- **Fix:** widen the regex to any variant stack; inspect string literals in `Record` maps consumed by `clsx`; add missing spacing families; a stylesheet comment check at the gate.
- **Re-check (2026-10-01):** Changed. `tools/eslint/rules/token-first-classnames.ts` no longer exists, so its two blind spots cannot be reproduced. The density rule is unchanged (`application-register-density.ts:14-22`, no `px-`, `pt-`, `pb-` or `m-` ceiling), and stylesheet comments remain unchecked: five comment openings in `globals.css` and 27 in `tokens.css`.
- **Caught by:** Q-115, Q-028.

### H-21 — globals.css lacks the baseline the styling agreement assigns to it (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** headings, links and form controls fall back to browser defaults wherever a component forgets to style them.
- **Where:** [styles/globals.css:120-124](../../styles/globals.css) is the only reset (box-sizing); no typography defaults, form baseline, font smoothing or `:focus-visible` rule.
- **Fix:** add the baseline sections listed in the seed's Styling Architecture Agreement.
- **Re-check (2026-10-01):** Still present (retired as visual). The only reset is still box-sizing (now `globals.css:133`); a search finds no heading, link or form baseline and no `:focus-visible` rule.
- **Caught by:** Q-116.

### H-22 — A loading button can still be clicked when `disabled={false}` is passed (S2)

- **Users see:** a double-submitted form when a caller passes an explicit `disabled={false}` while a request is pending.
- **Where:** [components/ui/button.tsx:47](../../components/ui/button.tsx) `disabled={disabled ?? isLoading}` lets an explicit `false` override `isLoading`.
- **Fix:** `disabled={disabled || isLoading}`.
- **Re-check (2026-10-01):** Still present. `components/ui/button.tsx:47` still reads `disabled={disabled ?? isLoading}`. The sign-in and register submits do not use this primitive (`components/auth/auth-submit.tsx:14` sets `disabled={pending}`), so those two forms are not affected.
- **Caught by:** Q-089.

### H-23 — Query cache timing is a literal in the provider (S3)

- **Users see:** nothing directly; balances and statements share one staleness window, so balance freshness cannot be tuned separately.
- **Where:** [components/providers/provider.tsx:13](../../components/providers/provider.tsx) `staleTime: 60 * 1000`.
- **Fix:** per-resource timing constants in `lib/constants.ts`.
- **Re-check (2026-10-01):** Still present. `components/providers/provider.tsx:13` still has the literal `staleTime: 60 * 1000`, and line 14 turns `refetchOnWindowFocus` off for every query, which Q-288 needs on for balances.
- **Caught by:** Q-057.

### H-24 — Public-page money helper assumes a fixed exponent (S2)

- **Status (2026-09-28):** partly resolved. The float division is gone: the helper now builds an exact decimal from integer minor units and rejects non-integers. The fixed two-digit exponent remains.
- **Users see:** nothing today (sample figures only); if reused for real balances, currencies with 0 or 3 decimal places would show amounts 100× or 10× off.
- **Where:** [lib/ledgerline/money.ts:16,45-49](../../lib/ledgerline/money.ts) takes `minor: number` with a fixed `FRACTION_DIGITS` of 2 and the locale `en-GB` ([lib/ledgerline/constants.ts:5,7](../../lib/ledgerline/constants.ts)).
- **Fix:** keep it confined to the public page; product money uses C40 over minor-unit strings with a per-currency exponent (BR1).
- **Re-check (2026-10-01):** Still present. As the 2026-09-28 status describes: exact decimal construction (`money.ts:16-28`), fixed exponent of 2 (`lib/ledgerline/constants.ts:7`). Product money now has its own util (`lib/utils/money.ts`) and C40 (`components/common/amount.tsx`).
- **Caught by:** Q-261, Q-207, Q-208.

### H-25 — Public-page sample types share names with planned domain types (S3)

- **Status (2026-09-28):** partly resolved. `Transaction` was renamed to `ActivityEntry` with the owner's approval. Other generic names (`Figure`, `NavLink`, `Plan`, `Approval` and the rest) remain.
- **Users see:** nothing; engineers adding a domain type with one of the remaining names will hit a duplicate export through `lib/types/index.ts` or silently import the wrong shape.
- **Where:** [lib/types/ledgerline.ts:16,22,43,89](../../lib/types/ledgerline.ts) exports `NavLink`, `Figure`, `Approval`, `Plan` and others via [lib/types/index.ts](../../lib/types/index.ts).
- **Fix:** rename any remaining sample type before a domain type with the same name lands (R-10).
- **Re-check (2026-10-01):** Still present. `NavLink` (line 16), `Figure` (22), `Approval` (43) and `Plan` (89) remain in `lib/types/ledgerline.ts`; `ActivityEntry` (35) is the renamed type.
- **Caught by:** Q-262.

### H-26 — The runway page opens for someone who is not signed in (S1)

- **Users see:** anyone who types `/insights/runway` without signing in gets the page and a working calculator with a "could not load" message, instead of being sent to sign in; a member whose session has expired is left on a page that looks broken rather than being asked to sign in again.
- **Where:** [app/(app)/insights/runway/page.tsx](../../app/%28app%29/insights/runway/page.tsx) is the only route under `app/(app)/` (`RUNWAY_ROUTE`, [lib/insights/constants.ts:1](../../lib/insights/constants.ts)); [lib/constants.ts:21](../../lib/constants.ts) lists only `/dashboard`, so [proxy.ts:23-26](../../proxy.ts) lets the request through; there is no `app/(app)/layout.tsx` to check the session a second time. The two data calls are then sent without a token ([lib/api-server.ts:10,18](../../lib/api-server.ts)).
- **Fix:** derive the protected prefixes from every `(app)` and `(admin)` segment in one constant, and check the session in an `(app)` server layout as `(admin)` already does.
- **Caught by:** Q-388, Q-230, Q-319.

### H-27 — Account and cash-flow data are cached without the workspace they belong to (S2)

- **Users see:** nothing while a member has one workspace; once a member can switch workspace, or a second person signs in on the same tab, the previous workspace's or person's accounts and cash-flow figures can be shown until the next refetch.
- **Where:** [lib/hooks/use-accounts.ts:6](../../lib/hooks/use-accounts.ts) uses the key `["accounts"]` and [lib/hooks/use-cash-flow.ts:7](../../lib/hooks/use-cash-flow.ts) uses `["cash-flow", range]`; neither carries a workspace id, and [lib/hooks/use-logout.ts:5-8](../../lib/hooks/use-logout.ts) does not clear the cache.
- **Fix:** build both keys from the query-key factory with the workspace id; clear the cache on sign-out and on a workspace switch.
- **Caught by:** Q-044, Q-348, Q-229.

### H-28 — A stalled backend leaves the page waiting, and a failure gives the member nothing to quote (S2)

- **Users see:** when the backend accepts a connection and never answers, the section stays in its loading state for as long as the platform allows; when a call fails, the message carries no reference, so support cannot find the failure the member describes.
- **Where:** [lib/api-server.ts:9-21](../../lib/api-server.ts) `backendFetch` passes no abort signal and no timeout and sends no request reference; `readEnvelope` (lines 32-50) returns `{ ok: false, status, message }` with the one `REQUEST_FAILED` text and no reference.
- **Fix:** abandon the call at `BACKEND_TIMEOUT_MS` (`UPLOAD_TIMEOUT_MS` for uploads), generate a reference per request, send it to the backend and return it in every failure result.
- **Caught by:** Q-294, Q-382, Q-023.

### H-29 — A member sent to sign in comes back without their filters (S2)

- **Users see:** after being redirected to sign in from a filtered or deep-linked page, the member returns to the bare page; the filters, search and position that were in the address are gone.
- **Where:** [proxy.ts:28](../../proxy.ts) sets `next` to `pathname` alone; the request's query string is never added. (The missing admin check in the same file is H-14.)
- **Fix:** write `next` from the path and the query, within the 2,048-character limit and the same-origin rule of Q-233.
- **Caught by:** Q-079, Q-233.

### H-30 — Public help articles give steps for pages that do not exist (S2)

- **Users see:** the help center tells a reader to "Open Settings, then Team", "Open Statements" or "Open Exports" and follow steps there; none of those pages exists in the application, and the sign-in card's "Forgot password?" link leads to one of these articles instead of a reset.
- **Where:** [lib/data/help/articles-access.ts:5-31](../../lib/data/help/articles-access.ts) (invite a team member), [lib/data/help/articles-records.ts:58,84](../../lib/data/help/articles-records.ts) (download a statement, export transactions); the link at [lib/data/auth/sign-in.ts:32-35](../../lib/data/auth/sign-in.ts). The route tree holds only the home page, help, sign-in, register and the runway calculator.
- **Fix:** keep the articles — they are the copy for specified pages — and publish each only in a release where its page exists, or state in the article that the feature is not yet available; the product owner decides which.
- **Caught by:** Q-248, Q-247.

### H-31 — The code formats in pounds and UK dates while the specification's examples use dollars and US dates (S3)

- **Users see:** amounts and dates in the built pages appear in pounds and day-month order, while every example in the specification shows dollars and US dates; which of the two a customer should see is undecided (OD1).
- **Where:** [lib/constants.ts:63,65](../../lib/constants.ts) `DEFAULT_LOCALE = "en-GB"` and `DEFAULT_CURRENCY = "GBP"`; a second locale constant with the same value at [lib/ledgerline/constants.ts:5](../../lib/ledgerline/constants.ts); the sample account at [lib/data/auth/sign-in.ts:44](../../lib/data/auth/sign-in.ts) is labelled `GBP`.
- **Fix:** answer OD1, then hold the locale in `DEFAULT_LOCALE` alone and take each amount's currency from its own row.
- **Caught by:** Q-267, Q-331.

### H-32 — "Copy link" on the runway page puts the member's cash, burn and inflow figures in the link (S1)

- **Users see:** a member who copies the runway link without typing anything pastes an address that spells out their workspace's cash, monthly burn and monthly inflow; anyone the link reaches — a chat, an email, a browser history, a server log — reads those figures without signing in.
- **Where:** [components/insights/runway-calculator.tsx:96-100](../../components/insights/runway-calculator.tsx) builds the copied text from `queryString(values)`, and `values` (lines 58-60) fills every parameter the member did not override with `actual` — the figures read from the accounts and cash-flow responses (lines 52-57; the money parameters are named at line 33). The member's own overrides are the only values [lib/hooks/use-runway-params.ts:22](../../lib/hooks/use-runway-params.ts) writes to the address bar.
- **Fix:** build the copied link from the member's overrides and the target alone, never from figures the product read from their accounts; whoever opens it gets figures from their own permitted data.
- **Caught by:** Q-391, Q-226.

### H-33 — The server-error page tells members their money was not affected (S1)

- **Users see:** when a page fails, the message says "Your money and records were not affected" (and, offline, "your money was not affected") — an assurance the product has no way to know, shown at the moment a member is least able to check it.
- **Where:** [lib/data/status/server-error.ts:5,9,13](../../lib/data/status/server-error.ts): the `first`, `again` and `offline` leads of `SERVER_ERROR_COPY`.
- **Fix:** say that viewing failed and what to do next, and make no statement about the member's money unless the backend reported that fact (X10).
- **Caught by:** Q-380, Q-082.

### H-34 — Registration tells a stranger that an email already has an account (S2)

- **Users see:** entering someone else's email on the register page marks the email field and answers "If you already have one, sign in instead", while a new email opens an account — so anyone can test which addresses are Ledgerline customers.
- **Where:** [app/api/register/route.ts:32](../../app/api/register/route.ts) relays every non-OK upstream response, the 409 included, with its status and body ([lib/api-server.ts:26-30](../../lib/api-server.ts)); [lib/data/auth/register.ts:53,58-59](../../lib/data/auth/register.ts) maps that 409 to the email field and to the hinting message, which [components/auth/register-form.tsx:51,56](../../components/auth/register-form.tsx) shows.
- **Fix:** as Phase 1 OD13 decides — by default the same neutral answer, status and shape for a known and an unknown email, with the existing account holder told by email; until the backend answers that way, the route handler does not pass the 409 through.
- **Caught by:** Q-392, Q-239.

## Per-page state coverage matrix

Requirements, not observations: every cell states what the page must do. "Shell" means S01/S02 render from cache while content loads. "Offline" follows Frontend Standards ("offline behaviour where appropriate"): read views show cached data with an "as of" time; writes are disabled with an explanation. Deferred pages keep their full specification.

| Page | Loading | Empty | Error | Success | Offline | Keyboard | Screen reader |
|---|---|---|---|---|---|---|---|
| [P01 Home](phase-4-page-blueprints.md#p01--home) | Static; no skeleton | n/a (static copy) | P35 boundary | Built: proposition, capability sections, figures, pricing, FAQ, enquiry, disclosure (OD9/OD10 pending) | Browser offline page; no stale claims | Skip link; all CTAs tabbable | Landmarks; one h1 |
| [P02 Sign in](phase-4-page-blueprints.md#p02--sign-in) | Button pending, aria-busy | n/a | Distinct 401/429/400/5xx messages | Redirect to `next` or P08 | Submit disabled + notice | Enter submits; links to P03/P04 | Labelled fields; error described; autocomplete |
| [P03 Register](phase-4-page-blueprints.md#p03--register) | Button pending | n/a | Field errors; an existing email is answered as OD13 decides (neutral by default, Q-392) | Session + P07 | Submit disabled + notice | Logical order | Errors announced per field |
| [P04 Forgot password](phase-4-page-blueprints.md#p04--forgot-password) | Button pending | n/a | Rate-limit and 5xx messages | Same confirmation for any email | Submit disabled | Enter submits | Status message announced |
| [P05 Reset password](phase-4-page-blueprints.md#p05--reset-password) | Token check skeleton | n/a | Expired/invalid token with restart link | Sign-in with confirmation | Submit disabled | Show-password toggle reachable | Password rules announced |
| [P06 Two-step verification](phase-4-page-blueprints.md#p06--two-step-verification) | Button pending | n/a | Wrong code, expired challenge | Continue to `next` | Submit disabled | Paste allowed; passkey button | `one-time-code`; errors described |
| [P07 Onboarding & verification](phase-4-page-blueprints.md#p07--onboarding--verification) | Stepper skeleton | `not_started` intro | Upload and save errors per step | Step advances; `submitted` state | Drafts kept in the open tab; submit disabled | Stepper and uploads by keyboard | Step "N of M"; status banner announced |
| [P08 Dashboard](phase-4-page-blueprints.md#p08--dashboard) | Shell + per-section skeletons | No accounts yet: verification CTA | Per-section C33; others render | D1–D4 by role | Cached figures with "as of" | Palette, sections in order | Chart summaries; balance labels |
| [P09 Accounts](phase-4-page-blueprints.md#p09--accounts) | Row skeletons | No accounts | C33 retry | Account rows with state badges | Cached list, "as of" | Rows open with Enter | Masked numbers read as "ending 1234" |
| [P10 Account ledger](phase-4-page-blueprints.md#p10--account-ledger) | Hero + table skeleton | No transactions / no matches (clear filters) | C33 retry; frozen/closed banner | Virtualized ledger, summary | Cached rows, filters disabled | Row nav, filters, load more | Row count, sort state, amounts with sign |
| [P11 Transaction search](phase-4-page-blueprints.md#p11--transaction-search) | Table skeleton after debounce | Prompt / no matches | C33 retry | Results with counts | Search disabled + notice | `/` or palette focus search | Result count announced |
| [P12 Transaction detail](phase-4-page-blueprints.md#p12--transaction-detail) | Drawer skeleton | n/a | 404 → P34; C33 | Detail, timeline, notes | Read-only cached; notes disabled | Focus trapped in overlay; Escape returns | Drawer labelled by description + amount |
| [P13 Saved views](phase-4-page-blueprints.md#p13--saved-views) | List skeleton | No saved views + how-to | C33 retry | Views list | Cached; edits disabled | Menu actions by keyboard | Confirm delete announced |
| [P14 Flagged transactions](phase-4-page-blueprints.md#p14--flagged-transactions) | Table skeleton | Nothing flagged | C33 retry | Flagged rows | Cached; unflag disabled | Same as P10 | Flag state in row name |
| [P15 Compare periods](phase-4-page-blueprints.md#p15--compare-periods) | Chart + table skeleton | No activity in period | C33 retry | Comparison chart + table | Cached; period change disabled | Date fields and presets | Chart data table |
| [P16 Runway calculator](phase-4-page-blueprints.md#p16--runway-calculator) | Input skeleton | No cash-flow history | C33 retry | Runway with assumptions | Uses cached inputs, labelled | All inputs by keyboard | Result announced as status |
| [P17 Statements](phase-4-page-blueprints.md#p17--statements) | Row skeletons | No statements yet (first period pending) | C33 retry | Statement list, download | Downloads disabled | Download buttons named by period | Period + account in names |
| [P18 Exports](phase-4-page-blueprints.md#p18--exports) | Builder + job skeletons | No exports yet | Create error; job `failed` state | Job list with states | Create disabled; cached jobs | Builder form order | Job state changes announced |
| [P19 Counterparty](phase-4-page-blueprints.md#p19--counterparty) | Summary + table skeleton | No transactions with counterparty | 404 → P34; C33 | Summary + ledger | Cached | Same as P10 | Totals labelled per currency |
| [P20 Notifications](phase-4-page-blueprints.md#p20--notifications) | Feed skeleton | All caught up | C33 retry | Feed, mark read | Cached; mark-read disabled | Items and actions tabbable | Unread count announced |
| [P21 Messages](phase-4-page-blueprints.md#p21--messages) | Thread + conversation skeleton | No threads; start one | Send failure keeps draft | The member's own threads and conversation (an owner also reads the workspace's, Q-395) | Draft kept in the open tab; send disabled | Thread list arrows; Enter sends | New message announced politely |
| [P22 Workspace settings](phase-4-page-blueprints.md#p22--workspace-settings) | Form skeleton | No alert rules yet | Save errors per field | Saved confirmation | Save disabled | Form order; switches | Save status announced |
| [P23 Team](phase-4-page-blueprints.md#p23--team) | Table skeleton | Only you: invite CTA | Invite errors; C33 | Members, roles, invites | Invite disabled | Row menus; dialog trap | Role and status in row name |
| [P24 Team member profile](phase-4-page-blueprints.md#p24--team-member-profile) | Profile skeleton | n/a | 404 → P34; C33 | Read-only profile + permissions | Cached | Tab order | Permission matrix as table |
| [P25 Profile & security](phase-4-page-blueprints.md#p25--profile--security) | Form + sessions skeleton | No other sessions | Save and revoke errors | Saved; session revoked | Changes disabled | Revoke confirm dialog | Two-step state announced |
| [P26 Transfer](phase-4-page-blueprints.md#p26--transfer) (Deferred) | Form skeleton | No payees | Validation, limit and review errors | Review then confirmation | Submit disabled | Review step reachable | Amount and payee read before confirm |
| [P27 Payees & bill pay](phase-4-page-blueprints.md#p27--payees--bill-pay) (Deferred) | Table skeleton | No payees | C33 retry | Payee list | Edits disabled | Row actions | Masked payee accounts |
| [P28 Help center](phase-4-page-blueprints.md#p28--help-center) | Static; search debounce | No article matches | Unknown slug → P34 | Categories, article | Cached articles | Search then results | Article headings structured |
| [P29 Admin overview](phase-4-page-blueprints.md#p29--admin-overview) | KPI + chart skeleton | Zero users series | Per-section C33 | KPIs and series | Cached, "as of" | Section order | Chart data table |
| [P30 Admin users](phase-4-page-blueprints.md#p30--admin-users) | Table skeleton | No users match | C33; create errors | Paged users, create dialog | Create disabled | Table + dialog | Row count and status |
| [P31 Admin user detail](phase-4-page-blueprints.md#p31--admin-user-detail) | Record skeleton | n/a | 404 → P34; save/delete errors | Record saved | Edits disabled | Confirm delete dialog | Status changes announced |
| [P32 Compliance queue](phase-4-page-blueprints.md#p32--compliance-queue) | Queue + case skeleton | Queue clear | C33; decision errors | Case decided | Decisions disabled | Queue filters; decision dialog | Case state + document names |
| [P33 Support console](phase-4-page-blueprints.md#p33--support-console) | Result skeleton | No match | C33 retry | Lookup results (read-only) | Cached last lookup | Search then results | Result count announced |
| [P34 Not found (404)](phase-4-page-blueprints.md#p34--not-found-404) | n/a | n/a | n/a | Explanation + route home by role | Same page | Primary action focused first | Title states "Page not found" |
| [P35 Server error (500)](phase-4-page-blueprints.md#p35--server-error-500) | n/a | n/a | Global and segment variants | Retry + reference id | Offline variant of S54 | Retry reachable first | Error announced on load |

## Sign-off

Each category is signed by one accountable role and co-signed where another discipline owns part of the risk. A signature records that every item in the category passed or has a written, accepted exception.

| Category | Signs | Co-signs |
|---|---|---|
| 1 Accessibility, 15 WCAG compliance | Accessibility champion | Design lead, QA lead |
| 2 Behavioural consistency | Design lead | Frontend lead |
| 9 (active items Q-113–Q-115) | Frontend lead | Maintainer |
| 19 Public site | Product owner | Compliance reviewer, Accessibility champion |
| 3 Responsiveness, 14 Cross-browser compatibility | QA lead | Frontend lead |
| 4 Scalability, 5 Performance | Frontend lead | Backend lead |
| 6 State coverage, 7 Error handling, 8 Loading behavior | QA lead | Design lead |
| 10 Frontend readiness, 11 Developer experience, 13 Maintainability | Frontend lead | Maintainer |
| 12 SEO readiness | Product owner | Frontend lead |
| 16 Money and data integrity | Backend lead | Frontend lead, Finance-domain reviewer |
| 17 Security and privacy | Security engineer | Backend lead, Compliance reviewer |
| 18 Content truthfulness | Product owner | Compliance reviewer |
| Host audit findings | Frontend lead | Security engineer for S1 findings |

## Verified gate

[Phase 8](phase-8-implementation-roadmap.md) owns build status. This section defines the only way a feature moves from **Built** to **Verified**.

1. **Scope.** The feature's Q-items are: its row in the [matrix](#per-page-state-coverage-matrix) (for a page), every category item that names it or its components, and every item in categories 1, 15, 16, 17, 18 and 19 that applies to the surfaces it renders.
2. **Evidence.** Each item carries a recorded result in the form [How to use this checklist](#how-to-use-this-checklist) defines: the Q-id, the commit, the environment and the artefact its "How to verify" cell names (a lint or test run link, a network capture, a script's output, a screenshot, or a screen-reader note with browser and version). An item without evidence is a fail.
3. **(needs LD4) items.** Until LD4 is approved, the manual step in the same cell is the check of record and must be recorded. After approval, the automated check must also pass.
4. **Host findings.** Every host audit finding whose "Where" touches the feature is fixed, or carries an accepted exception signed by the category owner.
5. **Severity.** No open S1 or S2 defect against the feature. An accepted exception is written down with the Q-id, the reason, the accepting role from [Sign-off](#sign-off) and an expiry date; an exception past its expiry is a fail (Q-312). Items in categories 16 and 17 that guard a balance, a permission or a session take no exception.
6. **Gate commands.** `pnpm type-check`, `pnpm lint`, `pnpm contract:check` and the unit suite pass on the merge commit (run at the gate, not per edit).
7. **Visual approval.** The owner has approved the rendered page's look (visual hand-off); this checklist does not judge it.
8. **Sign-off.** The roles in [Sign-off](#sign-off) for each category in scope have signed.
9. **Regression.** A feature returns from Verified to Built when a change touches it and any in-scope item has not been re-run; the Phase 8 table records the date. A change to a shared formatter, guard or hook (C40, C59, `proxy.ts`, `internalPath`, the query-key factory) touches every feature that uses it.
10. **Deferred features.** P26, P27, S44, S45, F6 and F7 are not gated in v1; their matrix rows remain requirements for when the revisit trigger fires.

## Traceability

- **Upstream (consumed):** [Phase 1](phase-1-product-vision.md) personas R1–R8, v1 read-only stance and OD9/OD10; [Phase 2](phase-2-experience-maps.md) flows F1–F7 and X1–X11; [Phase 3](phase-3-information-architecture.md) route groups and navigation; [Phase 4](phase-4-page-blueprints.md) pages P01–P35 (matrix rows); [Phase 5](phase-5-section-blueprints.md) section states S01–S64; [Phase 6](phase-6-interaction-contracts.md) components C01–C63; (1.0.0 Design Tokens phase dropped as visual); [Phase 7](phase-7-frontend-architecture.md) folders, hooks, boundaries, budgets; [Phase 8](phase-8-implementation-roadmap.md) status vocabulary, sprints, LD1–LD5 approvals.
- **Downstream (consumers):** [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) (Phase 9 implementation and Styling QA checklist), [Phase 8](phase-8-implementation-roadmap.md) (Built → Verified gate, Sprint 1 host-defect fixes), [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) and README (QA item count).
- **Host sources read:** [.claude/CLAUDE.md](../../.claude/CLAUDE.md), [eslint.config.ts](../../eslint.config.ts), `tools/eslint/rules/*.ts`, [styles/globals.css](../../styles/globals.css), [styles/tokens.css](../../styles/tokens.css), [lib/constants.ts](../../lib/constants.ts), [proxy.ts](../../proxy.ts), [app/layout.tsx](../../app/layout.tsx), [components/ui/button.tsx](../../components/ui/button.tsx), [components/auth/sign-in-form.tsx](../../components/auth/sign-in-form.tsx) (which replaced `components/common/login-form.tsx`), plus the files cited in H-02, H-15, H-16, H-17, H-18, H-19, H-23 and H-26–H-34.

## Assumptions and open questions

- **A6** English, single locale: 3.1.1 and copy items assume `lang="en"`; all formatting still goes through `Intl`.
- **A8** Web only, responsive to 360 px: the responsiveness sweep starts at 360 px; WCAG reflow is checked at 320 CSS px.
- **A9** Internal roles share backend `ADMIN`: the admin guard item checks `ADMIN` until finer platform roles are published.
- **Performance budgets** (LCP, INP, CLS) are targets for Phase 8 measurement, not claims about the current product.
- **OD1** Currency and jurisdiction decide which currencies the money tests cover and the statement timezone rules.
- **OD2** Session policy decides the timeout values tested by the timing and session items.
- **OD6** Two-step method decides whether the passkey path in 3.3.8 is tested in v1.
- **OD8 / LD4** Automated accessibility and E2E checks depend on LD4 approval; **LD5** decides the anchor-positioning fallback path.

Assumptions P9-A1–P9-A9 were added on 2026-10-01. Each number is a testing decision made so that an item can be passed or failed; none is a measurement or an outside requirement. The maintainer owns every one.

| ID | Assumption | Used by |
|---|---|---|
| P9-A1 | Lab profile: production build, Chrome, DevTools "Fast 4G" preset, 4× CPU slowdown, median of five runs. | Q-048–Q-050, Q-273, category 5 |
| P9-A2 | Seed tiers: single accounts of 0, 1, 10,000, 100,000 and 5,000,000 transactions; a five-currency workspace; two workspaces for isolation tests; one user per role; 200 members; 10,000 platform users. The 500-million-row overall target is a backend load test and is not exercised from the browser. | Categories 4, 16, 17 |
| P9-A3 | Large-ledger responsiveness: first rows within 1.5 s (p75) after opening or filtering `ledger-5m`, and within 20% of the time on `ledger-10k`. | Q-273 |
| P9-A4 | Rendering and memory bounds: at most 150 ledger row elements in the document; at most 50 MB heap growth after 200 loads; heap within 10% after 50 navigation round trips; heap within 10 MB while an export runs; at least 95% of scroll frames within 16.7 ms and none over 50 ms. | Q-038, Q-056, Q-274, Q-279, Q-283 |
| P9-A5 | Repeat and outage tests: a double activation is two activations within 100 ms with 500 ms injected latency; an outage observation lasts ten minutes. | Q-291, Q-296 |
| P9-A6 | Sign-out or expiry in one tab reaches the member's other tabs within 5 s. | Q-358 |
| P9-A7 | A chart series response holds at most 400 points and 50 KB uncompressed. | Q-043 |
| P9-A8 | The text-expansion test lengthens every string by 40%. | Q-268 |
| P9-A9 | Release tolerances: rollback rehearsed within 15 minutes; first-load JavaScript growth of more than 10% on a route needs written acceptance; the end-to-end suite passes three consecutive runs. | Q-284, Q-305, Q-317 |

Open questions raised by this checklist. Each stays open until its owner answers; the items that depend on it stay failing, not waived. Q9-3 was answered on 2026-10-01 and keeps its row.

| ID | Question | Owner | Assumed until answered | Affects |
|---|---|---|---|---|
| Q9-1 | In which form do account numbers appear in exports and statements — last four as on screen (BR5), or in full because the document is the record? If in full, does creating or downloading it need step-up? | Maintainer, with Compliance | Last four, as on screen | Q-370 |
| Q9-2 | Registration answers an existing email differently from a new one (the P03 matrix row; the Phase 7 route-handler status mapping), which tells a stranger that the email has an account, while Q-239 forbids that for sign-in and reset. Keep the difference, or answer both the same way and tell the account holder by email? | Maintainer, with Security engineer | The default of Phase 1 OD13: registration gives the same neutral answer and the existing account holder is told by email | Q-239, Q-392 |
| Q9-3 | Several constants carry different values in different phases: `REVEAL_TIMEOUT` (60 s in Phase 1 A15; 30 s in Phase 2 P2-A6 and Phase 7 §10.3), the read timeout (15 s in Phase 2 P2-A3; 10 s in Phase 1 A25 and Phase 7 `BACKEND_TIMEOUT_MS`), the `STALE_TIME` tiers (Phase 1 BR15 against Phase 7 §10.3), `LEDGER_MAX_PAGES` (Phase 1 A27 against Phase 7 §10.3), `SAVED_VIEW_LIMIT`, `MESSAGE_MAX_LENGTH` and the active-export limit (Phase 1 A20–A21 against Phase 7 §10.3). Which value is the specified one? **Answered 2026-10-01:** [Phase 1 BR19](phase-1-product-vision.md#data-and-operations) is the authority for every value and [Phase 7 §10](phase-7-frontend-architecture.md#10-constants) owns the constant names; where a phase states another value, BR19 wins. The values are: `REVEAL_TIMEOUT` 30 s with a 10 s warning; read timeout in the browser `REQUEST_TIMEOUT_MS` 15 s and server-to-backend `BACKEND_TIMEOUT_MS` 10 s, two separate constants; `STALE_TIME` `live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never; `LEDGER_MAX_PAGES` 10; `SAVED_VIEW_LIMIT` 50; `MESSAGE_MAX_LENGTH` 5,000; 3 active exports per member (`EXPORT_ACTIVE_JOB_LIMIT`). | Maintainer | Answered — each check quotes the BR19 value under the Phase 7 §10 name | Q-225, Q-274, Q-278, Q-288, Q-294, Q-301 |

## Item count

This checklist contains 396 numbered Q-items (Q-001 to Q-396): 373 active and 23 retired as visual (Q-017, Q-021, Q-028, Q-029, Q-036, Q-096–Q-109, Q-112, Q-116, Q-160, Q-165). Host findings: 34 (H-01–H-34), of which six are retired as visual (H-09–H-13, H-21); H-26–H-34 were added in 2.1.0.

Items added after Q-262 sit in the category they belong to, so a category's ids are no longer one unbroken range.

| Category | Ids | Numbered | Active |
|---|---|---|---|
| 1 Accessibility | Q-001–Q-016, Q-263–Q-265 | 19 | 19 |
| 2 Behavioural consistency | Q-017–Q-026, Q-266–Q-271 | 16 | 14 |
| 3 Responsiveness | Q-027–Q-037, Q-272 | 12 | 9 |
| 4 Scalability | Q-038–Q-047, Q-273–Q-281 | 19 | 19 |
| 5 Performance | Q-048–Q-060, Q-282–Q-284 | 16 | 16 |
| 6 State coverage | Q-061–Q-072, Q-285–Q-290, Q-381 | 19 | 19 |
| 7 Error handling | Q-073–Q-085, Q-291–Q-303, Q-382–Q-384 | 29 | 29 |
| 8 Loading behavior | Q-086–Q-095, Q-304, Q-385 | 12 | 12 |
| 9 Design system compliance (retired) | Q-096–Q-116 | 21 | 5 |
| 10 Frontend readiness | Q-117–Q-127, Q-305–Q-312, Q-386 | 20 | 20 |
| 11 Developer experience | Q-128–Q-136, Q-313–Q-318 | 15 | 15 |
| 12 SEO readiness | Q-137–Q-146, Q-319 | 11 | 11 |
| 13 Maintainability | Q-147–Q-155 | 9 | 9 |
| 14 Cross-browser compatibility | Q-156–Q-168 | 13 | 11 |
| 15 WCAG compliance | Q-169–Q-206, Q-320–Q-326 | 45 | 45 |
| 16 Money and data integrity | Q-207–Q-221, Q-327–Q-345, Q-387 | 35 | 35 |
| 17 Security and privacy | Q-222–Q-241, Q-346–Q-375, Q-388–Q-392, Q-394–Q-396 | 58 | 58 |
| 18 Content truthfulness | Q-242–Q-250, Q-376–Q-380 | 14 | 14 |
| 19 Public site | Q-251–Q-262, Q-393 | 13 | 13 |
| **Total** | Q-001–Q-396 | 396 | 373 |

## Changes in this version

- **Retained:** Q-001–Q-250 numbering and every functional check; H-01–H-23; the per-page matrix; sign-off; the Verified gate.
- **Changed:** file renumbered from phase 10 to phase 9; category 2 renamed Behavioural consistency; category 9 retired (visual) except Q-113–Q-115; 23 items retired as visual; Q-014, Q-030, Q-032–Q-034, Q-086, Q-087, Q-110, Q-111, Q-146, Q-167, Q-175 reworded without visual prescription; H-09–H-13 and H-21 retired as visual; H-01 and H-06 fixes reworded; H-08 and H-20 updated to the working tree; the Verified gate adds owner visual approval.
- **Added:** category 19 Public site (Q-251–Q-262); H-24, H-25; P01 matrix row updated to the built page.

### Enterprise audit (2026-10-01)

- **Retained:** every id Q-001–Q-262 with its number, its category and its intent; H-01–H-25; the matrix; the sign-off roles; all ten Verified-gate steps. Nothing was removed, renumbered or retired.
- **Sharpened in place (57 items):** a threshold, a named method and the evidence to keep were added to Q-010, Q-013, Q-015, Q-020, Q-023, Q-024, Q-035, Q-038, Q-041, Q-043, Q-045, Q-046, Q-048–Q-051, Q-056, Q-059, Q-063, Q-064, Q-069, Q-072, Q-073, Q-075, Q-079, Q-081, Q-082, Q-084, Q-085, Q-090, Q-093, Q-094, Q-125, Q-184, Q-188, Q-193, Q-199, Q-202, Q-209, Q-213, Q-215, Q-216, Q-218, Q-220, Q-221, Q-225–Q-229, Q-232, Q-237–Q-239, Q-241, Q-245, Q-255.
- **Corrected:** Q-079 said a 401 mid-session sends the member to sign-in, against C55 and X4 (re-authenticate without leaving the page); it now states both cases. Q-188's example title and Q-226's rule on titles disagreed about account digits; both now allow the nickname and last four only. Q-221 ("right-aligned"), Q-081 ("banner"), Q-193 and Q-199 (positions) carried visual prescription and were reworded to the behaviour.
- **Added (118 items, Q-263–Q-380):** focus destinations and announcements (Q-263–Q-265); internationalisation readiness and return-to-list behaviour (Q-266–Q-271); touch-only completion (Q-272); scale edges and limits (Q-273–Q-281); ledger API time, memory and bundle regression (Q-282–Q-284); partial data, role sweep, freshness and removal (Q-285–Q-290); resilience, double submission and concurrency (Q-291–Q-303); no stand-in numbers while loading (Q-304); release readiness (Q-305–Q-312); regression protection (Q-313–Q-318); truthful status codes (Q-319); seven further WCAG criteria (Q-320–Q-326); money, reconciliation, export integrity and time (Q-327–Q-345); isolation, session, privacy and audit (Q-346–Q-375); truthfulness of estimates, times, confirmations and outage copy (Q-376–Q-380).
- **Added outside the tables:** the evidence rule, lab profile, seed tiers and backend-dependency rule in "How to use"; assumptions P9-A1–P9-A9; open questions Q9-1–Q9-3; the exception rule in the Verified gate; the per-category count table.
- **2.1.0 reconciliation (2026-10-01):** every quoted limit now carries the Phase 1 BR19 value and the Phase 7 §10 constant name, and Q9-3 is answered in place; Q-041, Q-051, Q-058, Q-064, Q-079, Q-080, Q-225, Q-235, Q-294 and Q-301 were brought into line with the reconciled behaviour (stale writes refused, interrupted writes re-submitted by the member, page-level denial as the not-permitted state, no internal reveal, discarded rather than cancelled search results, server prefetch with an aggregate endpoint, first-load JavaScript measured in the browser, the full header set); H-01–H-25 were re-checked against the current code, repointed to files that exist and given a state each; H-26–H-31 and Q-381–Q-393 were added; a second pass the same day applied the residual decisions — the full ledger URL parameter set and the unbounded-query rule, export-job and support-thread visibility, per-member alert rules, single-purpose step-up, audit readership, drafts held in memory only, a required reference on every failure and notes that are removed but never edited (Q-039, Q-040, Q-045, Q-057, Q-064, Q-079, Q-240, Q-263, Q-278, Q-294, Q-301, Q-361, Q-373, Q-375, Q-382) — and added Q-394–Q-396 and H-32–H-34. Nothing was removed, renumbered or retired.
