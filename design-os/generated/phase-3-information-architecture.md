# Ledgerline Design OS — Phase 3: Information Architecture

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 2 — Experience Maps](phase-2-experience-maps.md) · Next: [Phase 4 — Page Blueprints](phase-4-page-blueprints.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Contents

- [1. Purpose and principles](#1-purpose-and-principles)
- [2. Navigation hierarchy](#2-navigation-hierarchy)
- [3. Sitemap](#3-sitemap)
- [4. Content hierarchy](#4-content-hierarchy)
- [5. Role-based navigation](#5-role-based-navigation)
- [6. Permissions](#6-permissions)
- [7. Content taxonomy](#7-content-taxonomy)
- [8. Labeling conventions](#8-labeling-conventions)
- [9. Cross-linking](#9-cross-linking)
- [10. Search hierarchy](#10-search-hierarchy)
- [11. Filtering hierarchy](#11-filtering-hierarchy)
- [12. SEO hierarchy](#12-seo-hierarchy)
- [13. Breadcrumb strategy](#13-breadcrumb-strategy)
- [14. Empty routes](#14-empty-routes)
- [15. Fallback routes](#15-fallback-routes)
- [16. Protected prefixes](#16-protected-prefixes)
- [17. Future expansion strategy](#17-future-expansion-strategy)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)
- [Assumptions](#assumptions)

## 1. Purpose and principles

This phase turns the flows of [Phase 2](phase-2-experience-maps.md) into a structure: where every one of the 35 pages lives, who can reach it, what it is called, and how a member moves between the things Ledgerline shows — accounts, transactions, counterparties, statements and exports.

Rules that shape every decision below:

1. **The ledger is the spine.** Every money surface resolves to a transaction, and every transaction resolves to its account. Navigation follows that ownership, not the order a member happened to click.
2. **The URL is the state.** Filters, the open transaction and the selected saved view live in the URL, so a link pasted into a chat opens the same view for a colleague with the same access. Why: F3 ends with "copy share link"; a view that cannot be shared is a view that has to be described in words.
3. **Hide what a role cannot use; never rely on hiding.** Navigation omits items a role cannot open, and the backend still refuses the request. The UI is a courtesy, not a control.
4. **No promise the product cannot keep.** Money movement is outside v1 (Phase 1 BR7, OD3). Its routes stay in the sitemap so the structure does not have to move later, but nothing in navigation advertises it until it is enabled.
5. **Names are fixed.** A label defined in [§8](#8-labeling-conventions) is used everywhere — nav, page title, breadcrumb, command palette, notification copy — and lives once in `lib/constants.ts` or `lib/data/`.

## 2. Navigation hierarchy

Ledgerline has two signed-in areas. The `(app)` route group serves workspace members (R1–R4); the `(admin)` route group serves internal staff (R5–R7). They never share a navigation set. Why: an internal agent looking at a customer's workspace must always know which side of the glass they are on.

### 2.1 Primary navigation — `(app)` route group (S01 Primary navigation)

| Order | Group | Item | Route | Page | Notes |
|---|---|---|---|---|---|
| — | (workspace) | Workspace switcher | — | — | C36 WorkspaceSwitcher; reachable wherever primary navigation is |
| 1 | Overview | Dashboard | `/dashboard` | P08 | Role-composed (D1–D4) |
| 2 | Money | Accounts | `/accounts` | P09 | Active on `/accounts/*` |
| 3 | Money | Transactions | `/transactions` | P11 | Active on `/transactions/*` and `/counterparties/*` |
| 4 | Money | Payments | `/payments` | P27 | Offered only when money movement is enabled |
| 5 | Documents | Statements | `/statements` | P17 | |
| 6 | Documents | Exports | `/exports` | P18 | |
| 7 | Insights | Insights | `/insights/compare` | P15 | Sub-pages: Compare periods (P15), Runway (P16) |
| 8 | Inbox | Notifications | `/notifications` | P20 | Carries the unread count |
| 9 | Inbox | Messages | `/messages` | P21 | Carries the unread thread count |
| 10 | Settings | Settings | first permitted of `/settings`, `/settings/team`, `/settings/profile` | P22 P23 P25 | Sub-pages: Workspace, Team, Profile & security |
| — | (secondary) | Help | `/help` | P28 | Opens in the same tab |
| — | (secondary) | Colour-scheme preference | — | — | C54, only if the build offers more than one scheme |

Each item is a C35 NavItem. Group labels are read by assistive technology as the group names. The nav config (labels, routes, icons, required capability, group) is one typed array in `lib/data/`; S01 filters it by capability. Why: one source feeds the navigation, the command palette's Pages scope ([§10](#10-search-hierarchy)) and the breadcrumb root labels.

**Depth limit.** Primary navigation is two levels deep at most (group → item). Anything deeper — Insights sub-pages, Settings sub-pages, saved views, flagged — is reached from its sibling pages (C23, through S03 Page identity & actions) or by in-page links. Why: nested disclosure hides the thing a member came for; keeping sibling pages one step apart does not grow the navigation.

**Transactions sub-navigation** (siblings P11, P13, P14, each reachable from the others): All (`/transactions`) · Saved views (`/transactions/views`) · Flagged (`/transactions/flagged`).

**Settings sub-navigation** (siblings, each reachable from the others): Workspace (`/settings`) · Team (`/settings/team`) · Profile & security (`/settings/profile`). Sub-pages a role cannot open are not offered.

**Onboarding.** P07 `/onboarding` is not a navigation item. While the workspace's verification case is not `approved`, S13 Verification status notice on P08 leads to P07. Why: onboarding is a task with an end, not a place members return to.

**Navigation state rules.**

- **Current item.** Exactly one item is current at a time: the item whose route is the longest segment-boundary prefix of the URL (`/transactions/flagged` makes Transactions current; `/counterparties/[counterpartyId]` makes Transactions current by the explicit mapping in the table). The current item is exposed as `aria-current="page"`; a URL that matches no item (P07, P34, P35) leaves none current.
- **Unread counts.** The Notifications and Messages counts are server-computed per member per workspace, never counted from loaded rows. A count may be up to 60 seconds old (`NOTIFICATION_POLL_INTERVAL`, IA8); it is refreshed when the member returns to the tab, opens P20 or P21, or marks something read. A count larger than 99 reads "99+" and its accessible name gives the capped wording ("more than 99 unread notifications"). Zero is conveyed by absence of a count, never by "0". A count that cannot be loaded is omitted rather than shown as zero; the item still works.
- **Workspace count.** With no membership the `(app)` area is not reachable except P07 for a registering owner (BR12) and P25. With one membership the switcher has nothing to switch to and only names the workspace. With many (an accountant serving many clients, A4) the list is searchable by workspace name once it exceeds 10 entries (IA8) and is ordered by name, with the current workspace identified in text.
- **Switching workspace.** The switch re-filters navigation for the role held in the destination workspace, discards every cached query of the previous workspace (C36), and keeps the route only when it is a list route the destination role may open; a detail route (`[accountId]`, `[transactionId]`, `[counterpartyId]`, `[threadId]`, `[memberId]`) never carries over because its ID belongs to the workspace being left — the member lands on P08. Filters in the URL are dropped on a switch, since account IDs and saved views are workspace-scoped. An unsaved note or a running upload blocks the switch behind a confirmation (C52).

### 2.2 Global utilities — S02

Reachable from every `(app)` and `(admin)` page: global search (C38 CommandPalette, ⌘K / Ctrl+K, C28) · notifications (C39) · the member's own account — Profile & security, Help, Sign out (C37) · the breadcrumb trail on detail pages (C29, [§13](#13-breadcrumb-strategy)). How they appear is decided at build.

### 2.3 Admin navigation — `(admin)` route group

| Order | Item | Route | Page | Reachable by |
|---|---|---|---|---|
| 1 | Overview | `/admin` | P29 | R5 R6 R7 |
| 2 | Users | `/admin/users` | P30 | R7 |
| 3 | Compliance | `/admin/compliance` | P32 | R6 R7 |
| 4 | Support | `/admin/support` | P33 | R5 R7 |

The `(admin)` area has no workspace switching; it is named "Ledgerline Admin" so a staff member never mistakes it for a customer workspace. P31 Admin user detail is reached from P30 or from P33 search results, never from primary navigation.

### 2.4 Small screens (360 CSS px and up)

Every navigation item stays reachable on a phone, with the same groups, order and labels as on larger screens. There is one navigation model across devices. Why: a second model on small screens doubles what members have to learn. How navigation is revealed on small screens is decided at build.

### 2.5 Public site navigation — S55 (added 2.0.0)

The built P01 has its own navigation (S55) reaching the page's topics (Accounts, Payments, Cards, Treasury, Security, Pricing) and the ways to start. It is separate from the `(app)` navigation. Two of its destinations (Payments, Cards) are capabilities v1 does not have (OD9), and its sign-in route leads to the enquiry (S64) rather than P02 (OD10). Both are recorded, not resolved.

## 3. Sitemap

### 3.1 Tree

```text
app/
├── (marketing)/
│   ├── /                                   P01 Home
│   └── /help, /help/[slug]                 P28 Help center
├── (auth)/
│   ├── /auth/login                         P02 Sign in
│   ├── /auth/register                      P03 Register
│   ├── /auth/forgot-password               P04 Forgot password
│   ├── /auth/reset-password                P05 Reset password
│   └── /auth/verify                        P06 Two-step verification
├── (app)/                                  protected: session + workspace membership
│   ├── @drawer/(.)transactions/[transactionId]   P12 intercepted route
│   ├── /onboarding                         P07 Onboarding & verification
│   ├── /dashboard                          P08 Dashboard
│   ├── /accounts                           P09 Accounts
│   │   └── /accounts/[accountId]           P10 Account ledger
│   ├── /transactions                       P11 Transaction search
│   │   ├── /transactions/[transactionId]   P12 Transaction detail
│   │   ├── /transactions/views             P13 Saved views
│   │   └── /transactions/flagged           P14 Flagged transactions
│   ├── /counterparties/[counterpartyId]    P19 Counterparty
│   ├── /insights/compare                   P15 Compare periods
│   ├── /insights/runway                    P16 Runway calculator
│   ├── /statements                         P17 Statements
│   ├── /exports                            P18 Exports
│   ├── /notifications                      P20 Notifications
│   ├── /messages, /messages/[threadId]     P21 Messages
│   ├── /settings                           P22 Workspace settings
│   │   ├── /settings/team                  P23 Team
│   │   │   └── /settings/team/[memberId]   P24 Team member profile
│   │   └── /settings/profile               P25 Profile & security
│   └── /payments                           P27 Payees & bill pay (money movement only)
│       └── /payments/transfer              P26 Transfer (money movement only)
├── (admin)/                                protected: session + platform role
│   ├── /admin                              P29 Admin overview
│   ├── /admin/users                        P30 Admin users
│   │   └── /admin/users/[userId]           P31 Admin user detail
│   ├── /admin/compliance, /[caseId]        P32 Compliance queue
│   └── /admin/support                      P33 Support console
└── system
    ├── not-found.tsx (+ per segment)       P34 Not found (404)
    └── error.tsx, global-error.tsx (+ per segment)   P35 Server error (500)
```

`/help` is listed under `(marketing)` because it must render without a session; a signed-in member reaching it from primary navigation gets the same public page within the `(marketing)` layout. Why: one help corpus, one URL per article, indexable ([§12](#12-seo-hierarchy)).

### 3.2 Page index

| ID | Page | Route | Group | Blueprint |
|---|---|---|---|---|
| P01 | Home | `/` | (marketing) | [P01](phase-4-page-blueprints.md#p01--home) |
| P02 | Sign in | `/auth/login` | (auth) | [P02](phase-4-page-blueprints.md#p02--sign-in) |
| P03 | Register | `/auth/register` | (auth) | [P03](phase-4-page-blueprints.md#p03--register) |
| P04 | Forgot password | `/auth/forgot-password` | (auth) | [P04](phase-4-page-blueprints.md#p04--forgot-password) |
| P05 | Reset password | `/auth/reset-password` | (auth) | [P05](phase-4-page-blueprints.md#p05--reset-password) |
| P06 | Two-step verification | `/auth/verify` | (auth) | [P06](phase-4-page-blueprints.md#p06--two-step-verification) |
| P07 | Onboarding & verification | `/onboarding` | (app) | [P07](phase-4-page-blueprints.md#p07--onboarding--verification) |
| P08 | Dashboard | `/dashboard` | (app) | [P08](phase-4-page-blueprints.md#p08--dashboard) |
| P09 | Accounts | `/accounts` | (app) | [P09](phase-4-page-blueprints.md#p09--accounts) |
| P10 | Account ledger | `/accounts/[accountId]` | (app) | [P10](phase-4-page-blueprints.md#p10--account-ledger) |
| P11 | Transaction search | `/transactions` | (app) | [P11](phase-4-page-blueprints.md#p11--transaction-search) |
| P12 | Transaction detail | `/transactions/[transactionId]` + intercepted route | (app) | [P12](phase-4-page-blueprints.md#p12--transaction-detail) |
| P13 | Saved views | `/transactions/views` | (app) | [P13](phase-4-page-blueprints.md#p13--saved-views) |
| P14 | Flagged transactions | `/transactions/flagged` | (app) | [P14](phase-4-page-blueprints.md#p14--flagged-transactions) |
| P15 | Compare periods | `/insights/compare` | (app) | [P15](phase-4-page-blueprints.md#p15--compare-periods) |
| P16 | Runway calculator | `/insights/runway` | (app) | [P16](phase-4-page-blueprints.md#p16--runway-calculator) |
| P17 | Statements | `/statements` | (app) | [P17](phase-4-page-blueprints.md#p17--statements) |
| P18 | Exports | `/exports` | (app) | [P18](phase-4-page-blueprints.md#p18--exports) |
| P19 | Counterparty | `/counterparties/[counterpartyId]` | (app) | [P19](phase-4-page-blueprints.md#p19--counterparty) |
| P20 | Notifications | `/notifications` | (app) | [P20](phase-4-page-blueprints.md#p20--notifications) |
| P21 | Messages | `/messages`, `/messages/[threadId]` | (app) | [P21](phase-4-page-blueprints.md#p21--messages) |
| P22 | Workspace settings | `/settings` | (app) | [P22](phase-4-page-blueprints.md#p22--workspace-settings) |
| P23 | Team | `/settings/team` | (app) | [P23](phase-4-page-blueprints.md#p23--team) |
| P24 | Team member profile | `/settings/team/[memberId]` | (app) | [P24](phase-4-page-blueprints.md#p24--team-member-profile) |
| P25 | Profile & security | `/settings/profile` | (app) | [P25](phase-4-page-blueprints.md#p25--profile--security) |
| P26 | Transfer | `/payments/transfer` | (app) | [P26](phase-4-page-blueprints.md#p26--transfer) |
| P27 | Payees & bill pay | `/payments` | (app) | [P27](phase-4-page-blueprints.md#p27--payees--bill-pay) |
| P28 | Help center | `/help`, `/help/[slug]` | (marketing) | [P28](phase-4-page-blueprints.md#p28--help-center) |
| P29 | Admin overview | `/admin` | (admin) | [P29](phase-4-page-blueprints.md#p29--admin-overview) |
| P30 | Admin users | `/admin/users` | (admin) | [P30](phase-4-page-blueprints.md#p30--admin-users) |
| P31 | Admin user detail | `/admin/users/[userId]` | (admin) | [P31](phase-4-page-blueprints.md#p31--admin-user-detail) |
| P32 | Compliance queue | `/admin/compliance`, `/admin/compliance/[caseId]` | (admin) | [P32](phase-4-page-blueprints.md#p32--compliance-queue) |
| P33 | Support console | `/admin/support` | (admin) | [P33](phase-4-page-blueprints.md#p33--support-console) |
| P34 | Not found (404) | `app/not-found.tsx` + per segment | system | [P34](phase-4-page-blueprints.md#p34--not-found-404) |
| P35 | Server error (500) | `app/error.tsx`, `app/global-error.tsx` + per segment | system | [P35](phase-4-page-blueprints.md#p35--server-error-500) |

Route groups do not appear in URLs; they exist to give each audience its own layout and guard. All route strings are constants in `lib/constants.ts` (the pattern `LOGIN_ROUTE` already follows); pages and links never spell a path inline.

## 4. Content hierarchy

Which Phase 5 sections each page uses, and the rules that decide who gets which. This records structure only. It does not rank what a page shows or say what appears first; that is decided when each page is built.

### P08 — Dashboard

Sections: S13 Verification status notice (only while verification is not `approved`), S14 Cash position, S15 Account summary, S16 Recent activity, S17 Pending items, S18 Cash flow over time.

Role variants: D1 Owner and D2 Finance get all six; D3 Accountant gets S16 and S17 for reconciliation work; D4 Viewer gets S14 and S15 for permitted accounts only, and S16, without S17 export items. Flow: [F1](phase-2-experience-maps.md#f1--check-cash-position).

### P10 — Account ledger

Sections: S20 Account overview, S21 Ledger filters (with saved views, [§11](#11-filtering-hierarchy)), S22 Ledger summary for the filtered range, S23 Ledger entries (newest first; pending before posted).

Flow: [F2](phase-2-experience-maps.md#f2--review-an-accounts-ledger).

### P11 — Transaction search / P14 — Flagged transactions

Sections: S21 Ledger filters (focus is in the query on arrival from the palette) and S23 Ledger entries across all permitted accounts, identifying the account each transaction belongs to (P10 does not need to).

### P12 — Transaction detail

Sections: S24 Transaction detail (reaches P19 and P10), S25 Transaction lifecycle (`pending` → `posted` → `returned` / `reversed`), S26 Notes & attachments.

Flow: [F3](phase-2-experience-maps.md#f3--investigate-a-transaction).

### P17 — Statements / P18 — Exports

P17: S30 Statement downloads, grouped by account, newest period first. P18: S31 Export request and S32 Export jobs. Flow: [F4](phase-2-experience-maps.md#f4--export-and-reconcile).

### P07 — Onboarding & verification

Sections: S09 Verification progress, S10 Business details, S11 Beneficial owners, S12 Document upload, S13 status. The member works on one step at a time; completed steps stay editable until submission.

### P23 — Team

Sections: S39 Team members, S40 Member invitation (C21), S41 Role permissions reference.

### P29 — Admin overview / P32 — Compliance queue

P29: S48 Platform growth figures, reaching P30, P32 and P33. P32: S51 Compliance case queue, oldest-submitted first, and S52 Compliance case review at `/admin/compliance/[caseId]`.

## 5. Role-based navigation

✓ offered · — not offered. "Not offered" means the item does not exist for that role, not that it is disabled.

| Nav item | R1 Owner | R2 Finance | R3 Accountant | R4 Viewer | R5 Support | R6 Compliance | R7 Admin |
|---|---|---|---|---|---|---|---|
| Workspace switcher | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Dashboard | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Accounts | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Transactions | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Payments (money movement enabled only) | ✓ | ✓ | — | — | — | — | — |
| Statements | ✓ | ✓ | ✓ | — | — | — | — |
| Exports | ✓ | ✓ | ✓ | — | — | — | — |
| Insights | ✓ | ✓ | ✓ (Compare only) | — | — | — | — |
| Notifications | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Messages | ✓ | ✓ | ✓ | — | — | — | — |
| Settings › Workspace | ✓ | ✓ (alert rules only) | — | — | — | — | — |
| Settings › Team | ✓ | ✓ | — | — | — | — | — |
| Settings › Profile & security | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Help | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin › Overview | — | — | — | — | ✓ (read) | ✓ (read) | ✓ |
| Admin › Users | — | — | — | — | — | — | ✓ |
| Admin › Compliance | — | — | — | — | — | ✓ | ✓ |
| Admin › Support | — | — | — | — | ✓ | — | ✓ |

Rules:

- The role in this table is the member's role **in the current workspace**. Switching workspace (C36) re-filters the navigation. Why: A4 — one person can be an owner in one business and an accountant for another.
- Internal staff (R5–R7) land in `/admin`. If a staff member also holds a workspace membership under a separate user, that is a separate sign-in. Why: support access to customer data must never look like membership.
- Settings resolves to the first permitted sub-page: R1 → `/settings`, R2 → `/settings` (alert rules section only), R3 and R4 → `/settings/profile`. R3 and R4 are redirected from `/settings` to `/settings/profile` ([§14](#14-empty-routes)); if they reach the alert-rules section by a direct link they get the not-permitted state (C32). Both statements stand. Alert rules are per member — R1 and R2 each manage their own, at most 20 (`ALERT_RULE_LIMIT`) — and there is no shared workspace rule.
- **Role changed while signed in.** Navigation is computed from the role the server last reported, and the role is re-read on every server render and after any 403. A member demoted mid-session keeps seeing the old items for at most one navigation or 60 seconds, whichever comes sooner (IA8); the next request for anything the new role cannot do is refused by the backend, the role is refreshed, navigation re-filters without a reload (C59), and the member is told in words that their access changed and by whom it can be restored (an owner). A member promoted mid-session gains the new items on the same refresh. Work in progress that the new role may no longer save (a note being typed by a member demoted to viewer) stays available to them as text they can copy; it is never silently discarded and never saved.
- **Member removed while signed in.** The next request returns 403 for that workspace. With another membership the member is moved to it and told which workspace they were removed from; with none they reach the no-workspace state. Nothing cached from the removed workspace stays readable.
- **Suspended.** A workspace member whose membership is `suspended` gets no `(app)` navigation for that workspace; it is omitted from their switcher, and a direct link into it behaves as for a non-member ([§15](#15-fallback-routes)). A user whose account status is `SUSPENDED` cannot sign in (X1) and an open session ends at its next request; they are pointed to support (X9) and are told the account is suspended, never why.
- **Invited, not yet accepted.** An invitee holds no role and no navigation until they accept. An invitation grants nothing by itself: it names the workspace and the offered role and nothing else — no balances, no member list. Acceptance by a person already signed in as a different email is refused with the invited address named. An expired or revoked invitation says so and names who can send a new one (X6).
- **Viewer with no permitted accounts.** Dashboard, Accounts and Transactions stay offered and resolve to their empty state explaining that an owner has not yet granted an account; they are not removed, because removing them would make a permissions gap look like a product fault.
- **Staff role overlap (A9).** While R5–R7 share backend `ADMIN`, the last four rows cannot be told apart by the frontend; the table states the intended result and [§6.2](#62-how-permissions-are-enforced) the present one.

## 6. Permissions

### 6.1 Capability matrix

✓ allowed · — denied · ⚿ allowed after step-up re-authentication ([X4](phase-2-experience-maps.md#x4--session-expiry-and-step-up-re-authentication)).

| Capability | owner | finance | accountant | viewer | support | compliance | admin |
|---|---|---|---|---|---|---|---|
| View dashboard | ✓ | ✓ | ✓ | ✓ (permitted accounts) | — | — | — |
| View accounts and balances | ✓ all | ✓ all | ✓ all | ✓ permitted | — | — | — |
| Reveal full account number | ⚿ | ⚿ | ⚿ | — | — | — | — |
| View transactions | ✓ | ✓ | ✓ | ✓ permitted | — | — | — |
| Annotate (note, category, flag, attachment) | ✓ | ✓ | ✓ | — | — | — | — |
| Create personal saved views | ✓ | ✓ | ✓ | ✓ | — | — | — |
| View counterparties | ✓ | ✓ | ✓ | ✓ permitted | — | — | — |
| Compare periods | ✓ | ✓ | ✓ | — | — | — | — |
| Runway calculator | ✓ | ✓ | — | — | — | — | — |
| Download statements | ✓ | ✓ | ✓ | — | — | — | — |
| Create and download exports | ✓ | ✓ | ✓ | — | — | — | — |
| Receive notifications | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Secure messages with support | ✓ | ✓ | ✓ | — | ✓ (reply) | — | ✓ |
| Manage alert rules | ✓ | ✓ | — | — | — | — | — |
| Edit workspace general settings | ✓ | — | — | — | — | — | — |
| View team | ✓ | ✓ | — | — | — | — | — |
| Invite viewer or accountant | ✓ | ✓ | — | — | — | — | — |
| Invite owner or finance; change roles; remove members | ✓ | — | — | — | — | — | — |
| Complete business verification (KYB/KYC) | ✓ | — | — | — | — | — | — |
| Edit own profile, password, two-step, sessions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Transfer, manage payees (money movement enabled only) | ⚿ | ⚿ | — | — | — | — | — |
| Admin overview (stats) | — | — | — | — | ✓ read | ✓ read | ✓ |
| List, create, edit, delete users | — | — | — | — | — | — | ✓ |
| View a user record | — | — | — | — | ✓ read | — | ✓ |
| Look up workspaces and users | — | — | — | — | ✓ | — | ✓ |
| Read and decide verification cases | — | — | — | — | — | ✓ | ✓ |

Scope of three rows. **Exports:** a member sees and downloads their own export jobs; R1 and R2 also see every job in the workspace; R3 sees only their own. **Secure messages:** a thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1); other R2 and R3 members do not read it. **Alert rules:** per member, at most 20 each (`ALERT_RULE_LIMIT`); only R1 and R2 may have them, and no rule is shared across the workspace.

The matrix is static product config in `lib/data/`, rendered verbatim by S41 Role permissions reference and read by C59 PermissionGate. Why: the table members read on P23 and the rules the UI applies are the same object, so they cannot drift. The backend holds its own copy of the rules; a disagreement is a bug on whichever side differs from the published contract.

### 6.2 How permissions are enforced

| Layer | Checks | On failure | Authority |
|---|---|---|---|
| `proxy.ts` | A valid session cookie exists for a protected prefix ([§16](#16-protected-prefixes)) | Redirect to `/auth/login?next=<path>`, drop an invalid cookie | Authentication only |
| Server layout `app/(app)/layout.tsx` | Session user is a member of the current workspace; role loaded into C63 WorkspaceProvider | Redirect to `/onboarding` when there is no workspace yet | Convenience |
| Server layout `app/(admin)/layout.tsx` | Session role is a platform role (today `ADMIN`, A9) | Render P34 — the admin area does not reveal it exists | Convenience |
| Page / section | Capability for this page from the matrix | The not-permitted empty state (C32) within the group's layout: it names the page by its label and says which role can do this. Never the error state (C33) | Convenience |
| C59 PermissionGate | Capability for a control (Annotate, Invite, Reveal) | The control is not offered; the value stays readable | Convenience |
| Backend | Every request, every field | 401 → X4 re-auth; 403 → the role is re-read and the not-permitted state (C32) is given; 404 for a record outside the member's scope or in another workspace, exactly as for a missing one (P34) | **Final** |

The "access-denied state" named throughout this phase is that not-permitted empty state (C32). C33 is kept for failures — a request that did not answer or did not validate — and is never used to tell a member their role lacks a page.

**The UI is never the authority.** Withholding a control protects nothing; a crafted request reaches the backend regardless. Every layer above the backend exists to keep members from walking into refusals, and every one of them may be wrong without exposing data. Why it is written this way: if a member's role is lowered while their tab is open, the next request fails loudly with 403 and the UI refreshes the role — the member sees a clear refusal instead of a page that pretends to work.

Proxy scope stays narrow: the proxy verifies the token and nothing else. It does not read roles or memberships because it runs on every request, including assets matched by `config.matcher`, and a database call there would slow every page for every member. Consequence to accept: a token that is still cryptographically valid passes the proxy even after the user was suspended or the membership removed; the layout and the backend refuse it on the same request, so nothing is disclosed.

### 6.3 Enforcement point, denial and audit record per capability

The backend is the enforcement point for every row; the column names the request it refuses. "Denied" describes what a member without the capability experiences when they arrive anyway — by a pasted link, a stale tab or a crafted request. Denial copy comes from constants, names the page or action by its [§8](#8-labeling-conventions) label, says which role can grant it, and never states whether the target exists.

| Capability group | Enforced on | A denied member experiences | Audit record |
|---|---|---|---|
| View dashboard, accounts, balances, transactions, counterparties | Every read; the viewer's permitted-account list is applied by the backend to lists, totals, search and counts alike | An account outside the permitted list is indistinguishable from one that does not exist: 404, absent from every list, total and search result. Totals a viewer sees are totals of permitted accounts and are labelled as such | Reads are not individually recorded; sign-in and workspace switch are |
| Reveal full account number | The reveal request, which requires a live step-up grant (X4) | Without the capability the reveal is not offered and the request returns 403. With it but without a grant: step-up is asked for; cancelling or failing leaves the number masked and says so. Owner, finance and accountant are the only roles with the capability; a viewer and every internal role (R5–R7) never have it. A revealed number is masked again after 30 s (`REVEAL_TIMEOUT`, with a 10 s warning and the option to extend), on leaving the page and when the grant ends | Every attempt, allowed or refused: actor, account ID, outcome. Never the number |
| Annotate (note, category, flag, attachment) | Each write | The annotation stays readable and the means to change it is not offered; a crafted write returns 403 and changes nothing. A write that loses a race with another member's edit is refused as a conflict, not as a denial (Phase 1 › Future scalability) | Each create, change and delete: actor, transaction ID, which annotation, before and after for category and flag. Note text and file contents are not copied into the record |
| Personal saved views | Each read and write, scoped to the owning member | Another member's view ID behaves as unknown ([§11.2](#112-validation)) | Not recorded (personal preference, no shared effect) |
| Compare periods, Runway, Statements, Exports | The page's data request and each download | The item is absent from navigation; a direct URL gives the access-denied state within the `(app)` area, and a download URL returns 403 with no file. A download link is bound to the member who requested it and stops working when their capability does. An export job is listed for its requester, and for R1 and R2 whoever requested it; for R3 another member's job ID behaves as unknown (404) | Statement download and export creation and download: actor, account IDs, period, row count, format. Insights reads are not recorded |
| Secure messages | Each thread read and each send | A viewer is not offered Messages; a direct URL gives the access-denied state. A thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1); for any other R2 or R3 member its ID is 404 and it appears in no list or count. A thread ID from another workspace is 404 | Each message sent and each staff read of a thread: actor, thread ID |
| Alert rules, workspace general settings | Each write | R2 opening `/settings` gets alert rules only; general settings are readable to no one but R1. R1 and R2 each edit their own alert rules (per member, at most 20, `ALERT_RULE_LIMIT`; no shared workspace rule, so another member's rule ID behaves as unknown); R3 and R4 follow the redirect and not-permitted rule of [§5](#5-role-based-navigation) | Each change: actor, setting, before and after |
| View team, invite, change role, remove | Each read of the member list and each write | R3 and R4 get the access-denied state for `/settings/team` and `/settings/team/[memberId]`. R2 inviting an owner or finance, changing a role or removing a member is refused with 403 naming the owner role as the one that can | Each invitation sent, resent, revoked, accepted and expired; each role change and removal: actor, subject, role before and after |
| Business verification (KYB/KYC) | Each read and write of the case | Non-owners can learn the case status (it explains why features are limited) but not its details, documents or beneficial owners; a direct request for those returns 403 | Each submission and document upload: actor, case ID. Each R6 decision with its recorded reason |
| Own profile, password, two-step, sessions | Each write; password, two-step and revoke-all require step-up | A member can act only on their own record; another member's ID in the request is 404 | Password change, two-step change, session revocation: actor, outcome |
| Transfer, manage payees | Money-movement switch read by the backend, then capability, then step-up | While the switch is off every role gets P34 ([§14](#14-empty-routes)); once on, R3 and R4 get the access-denied state | Every attempt, allowed or refused |
| Admin overview, users, user record, lookup, verification cases | Platform role on every request | A workspace member gets P34 for every `/admin` URL — the area does not reveal that it exists. A staff member lacking the specific capability gets the access-denied state within the `(admin)` area | Every staff read of a user, workspace or case, and every write: actor, subject, reason where one is required. Staff reads are recorded because the subject is a customer |

Every audit record carries the actor's user ID, the role held at that moment, the workspace ID, the action, the target ID, the outcome (allowed or refused), a UTC timestamp and the request reference that the member can quote from an error ([§15](#15-fallback-routes)). Records are append-only and are written by the backend in the same transaction as the action; the frontend never writes one and never treats a client event as one. No page among P01–P35 lets a workspace member read the record; who may read it is IA9 (Phase 1 OD12), whose default is: R7 reads all; R6 reads case history; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 but may ask support for the entries about their own workspace.

### 6.4 Membership and role edge cases

| Case | Rule |
|---|---|
| Last owner | A workspace always has at least one owner whose membership is `active`. The only remaining active owner cannot be removed, demoted or suspended, by themselves or anyone else; the backend refuses with a conflict (409) and the reason is given in words. An `invited` owner does not count |
| Self-demotion and self-removal | An owner may lower their own role or leave only when another active owner remains. It is confirmed (C52) with the consequence stated — "you will lose access to Team and Workspace settings and cannot undo this yourself" — and takes effect on the next request. Non-owners may leave a workspace; they cannot change their own role |
| Owner demotes or removes another owner | Allowed, subject to the last-owner rule. Requires step-up (X4) because it transfers control of the business's data |
| Role changed mid-session | [§5](#5-role-based-navigation). Server-held state the member no longer has a right to (a `ready` export's download link, an account-number reveal in progress) stops working on the request after the change |
| Suspended member | Membership `suspended`: no access to that workspace, other memberships unaffected, personal saved views and authored notes are kept and attributed. User `SUSPENDED`: no sign-in at all. Suspension ends sessions at the next request; it does not wait for the idle timeout |
| Removed member | Access ends at the next request. Notes, flags and categories they authored stay on the transactions, attributed by the name held at the time; their personal saved views are deleted; export files they created remain available to R1 and R2, who see every job in the workspace, until they expire |
| Invited, not accepted | Holds no capability. The invitation is addressed to one email, usable once, valid for 7 days (`INVITE_TTL_DAYS`, IA8), and can be revoked or resent by whoever may invite that role; resending invalidates the earlier link. Accepting requires signing in or registering with the invited address. The role granted is the role on the invitation at the moment of acceptance, not at the moment of sending |
| Inviting an existing member or a pending invitee | Refused with the existing state named ("already a member", "already invited — resend?"); no second membership or duplicate invitation is created, so a double submission is harmless |
| Member of several workspaces (A4) | Role, permitted accounts, saved views, notification preferences and unread counts are per workspace. Nothing from one workspace is ever aggregated with another: no cross-workspace total, search or notification list |

A tester can verify: (1) for each row of [§6.1](#61-capability-matrix) and each role, the request made with a valid session of that role returns the documented result with the UI bypassed; (2) no response to a denied or out-of-workspace request differs by whether the target exists; (3) removing, demoting or suspending the only active owner fails for every actor; (4) a role lowered in a second session takes effect in the first within one request, with the member told; (5) each audited action in §6.3 produces exactly one record, including when the request is retried.

## 7. Content taxonomy

### 7.1 Entities

| Entity | Belongs to | Identified by | Canonical page |
|---|---|---|---|
| Workspace (business) | — | workspace ID | P22 |
| Member | Workspace | member ID | P24 |
| Account | Workspace | account ID; shown as name + last 4 | P10 |
| Transaction | Account | transaction ID; shown by counterparty + amount | P12 |
| Counterparty | Workspace | counterparty ID | P19 |
| Statement | Account + month | statement ID | P17 (row) |
| Export | Workspace; requested by one member | export ID | P18 (row) |
| Saved view | Member | saved view ID (nanoid) | P13 (row) |
| Notification | Member | notification ID | P20 (row) |
| Message thread | Workspace; opened by one member | thread ID | P21 |
| Verification case | Workspace | case ID | P07 / P32 |

### 7.2 Account types

`operating` (label "Operating") and `savings` (label "Savings"). The final list comes from the banking data source (OD5); the UI renders any type the contract publishes with its label from constants and falls back to the raw value, never hiding the account.

### 7.3 Transaction types

`ach` (ACH), `wire` (Wire), `card` (Card), `check` (Check), `internal_transfer` (Internal transfer), `fee` (Fee), `interest` (Interest), `adjustment` (Adjustment). Direction is not a type: it is carried by the sign of the amount (credit positive, debit negative, Phase 1 BR3). Why: "incoming wire" and "outgoing wire" are the same rail; filtering by direction is a sign, filtering by rail is a type.

### 7.4 Categories

Categories are member annotations, not bank data. v1 uses a fixed list from constants: Revenue, Payroll, Rent, Software, Travel, Taxes, Transfers, Fees, Other, plus Uncategorized as the absence of a value. Why fixed: a shared vocabulary makes exports comparable month to month; custom categories are an expansion item ([§17](#17-future-expansion-strategy)).

### 7.5 Counterparty

The other party on a transaction as the bank reports it, normalized by the backend into one record per business or person. A transaction has at most one counterparty. Fees and interest usually have none; the type label ("Fee", "Interest") stands in for the counterparty, never a substituted name. Why: attributing a fee to a named party the data does not name would be invented content.

### 7.6 Statuses (spine §2)

| Domain | Values in order |
|---|---|
| Transaction | `pending` → `posted` → `returned` or `reversed`; `failed` |
| Account | `active`, `frozen`, `closed`, `pending_verification`. The backend publishes `OPEN` / `FROZEN` / `CLOSED` today; the mapping between the two sets is Phase 1 OD11 |
| Verification case | `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` |
| Export job | `queued`, `running`, `ready`, `failed`, `expired` |

Enums live in `lib/constants.ts` as `as const` tuples so Zod (`z.enum`) and labels derive from one list.

Transitions the structure relies on: a `pending` transaction may change amount or disappear before it posts, so nothing links a statement, an export row or a reconciliation to a pending transaction; `posted` is final on the ledger; `returned` and `reversed` never delete or alter the original — each is a state of the original plus a separate offsetting transaction that links back to it, so both stay findable and the ledger still sums. `failed` never affected a balance. A `closed` account accepts no new transactions and keeps its full history, statements and exports; a `frozen` account is fully readable.

### 7.7 Unknown values and change policy

**Unknown or other.** The banking source (OD5) may send a value the frontend does not know yet. The rule is the same for every taxonomy in this section: the record is always shown, never hidden, never dropped from a total, and never guessed into a known value.

| Taxonomy | A value the frontend does not recognise | A missing value |
|---|---|---|
| Account type | Labelled with the raw value as received; filterable only through "all types" | Labelled "Account" |
| Transaction type | Labelled "Other" with the raw value available as text; excluded from every named `type` filter and included when no `type` filter is applied, so an unfiltered ledger still reconciles to the balance | Same as unrecognised |
| Transaction, account, case or export status | Labelled "Unknown status" at attention severity; no action that depends on the status is offered (no statement link, no download) | Same as unrecognised |
| Category | "Other" is a category a member chose; "Uncategorized" is the absence of a choice. The two are never merged in a filter, a total or an export. A stored category no longer in the list keeps its stored label and is marked retired | "Uncategorized" |
| Currency | Any ISO 4217 code `Intl` supports is formatted; an unsupported code is shown as the code followed by the amount in the currency's minor-unit exponent from the contract, never with a borrowed symbol | The amount is not shown; the row reports a data problem with a reference, because an amount without a currency is not a fact |

Parsing follows from this: response schemas for these fields accept the known tuple or an unrecognised string and map the latter to the unknown case; they do not reject the whole response. Why: a strict enum would blank a member's ledger on the day the bank adds a rail. Each unrecognised value is reported once per session through the logging service with the field and value (never the record) so it reaches the backlog. URL filters are the opposite: they accept only known values ([§11.2](#112-validation)).

**Change policy.**

- A stored value (the `as const` string) is never renamed and never reused for a different meaning. Changing what members read means changing the label in constants, which changes it everywhere at once.
- Adding a value is additive: tuple, label, severity where applicable, filter option, export mapping and help text change in one change set. Once the backend publishes the enum, the tuple derives from the generated contract, so a value added on a DTO reaches the frontend through `pnpm contract` and `pnpm contract:check` fails while the two disagree.
- Retiring a value removes it from what can be newly chosen and from filter options that would return nothing, but records already carrying it keep rendering with their label. Nothing is rewritten in place; shared links that filter on a retired value keep resolving.
- IDs of every entity in [§7.1](#71-entities) are opaque, never derived from an account number, a name, an email or a sequence a member could increment to enumerate records, and are never reassigned after deletion.

## 8. Labeling conventions

### 8.1 Navigation labels (exact)

Dashboard · Accounts · Transactions · Payments · Statements · Exports · Insights · Notifications · Messages · Settings · Help. Group labels: Overview · Money · Documents · Insights · Inbox · Settings. Sub-pages: All · Saved views · Flagged · Compare periods · Runway · Workspace · Team · Profile & security. Admin: Overview · Users · Compliance · Support. The Insights group holds one item of the same name; the group label is suppressed when it would repeat the item.

Page titles equal the Phase 4 page name (P11 title "Transactions" is the one exception, because the nav label is what members search for; its registry name stays "Transaction search").

### 8.2 State labels and severity

| Value | Label | Severity |
|---|---|---|
| `pending` | Pending | attention |
| `posted` | Posted | neutral |
| `returned` | Returned | problem |
| `reversed` | Reversed | neutral |
| `failed` | Failed | problem |
| `active` / `frozen` / `closed` / `pending_verification` | Active / Frozen / Closed / Pending verification | positive / attention / neutral / attention |
| `not_started` / `in_progress` / `submitted` / `needs_info` / `approved` / `rejected` | Not started / In progress / Submitted / Needs info / Approved / Rejected | neutral / neutral / information / attention / positive / problem |
| `queued` / `running` / `ready` / `failed` / `expired` | Queued / Preparing / Ready / Failed / Expired | neutral / information / positive / problem / neutral |

"Posted" and "Pending" are the only words for settlement state. Never "Cleared", "Settled", "Processing" or "Complete" for a transaction. Why: each synonym implies a different guarantee; a member reconciling books needs one word that means "final on the ledger". `running` reads "Preparing" because members wait on it, not operate it.

### 8.3 Balances

"Balance" never appears alone.

- **Current balance** — the sum of all posted transactions on the account at this moment. It matches the ledger and the statement.
- **Available balance** — current balance minus pending debits and holds reported by the bank. It is what the business can actually use.

The primary figure on P08 and P10 is Available balance; Current balance is always given with it and always labelled. Totals are never summed across currencies: S14 shows one total per currency. Why: adding euros to dollars at an unstated rate would show a number no bank agrees with.

Wording rules that follow:

- A balance is always stated with the moment it describes ("as of" plus a time, [§8.4](#84-money-sign-and-date-formats)), taken from the backend's own timestamp for the figure, never from when the page loaded. A balance older than 15 minutes (`BALANCE_STALE_AFTER`, IA8), or read while offline, is labelled as possibly out of date in words; it is never presented as current.
- A total across accounts is labelled with what it covers: the currency, and for a viewer "across the accounts you can see". It is never called the business's total cash when it is a subset.
- Pending credits are not part of Available balance and pending amounts are not part of Current balance; where a pending sum is stated it is labelled "Pending" and described as subject to change.

### 8.4 Money, sign and date formats

- Amounts: `Intl.NumberFormat` with `style: "currency"` and the transaction's ISO 4217 code, from integer minor units held as strings (C40 Amount). Never a float, never client arithmetic on floats.
- Sign: credits carry an explicit plus ("+$1,250.00"); debits a minus ("−$1,250.00"). Ordinary debits carry no problem severity; only `returned` and `failed` do. Severity is always also given in words.
- Numbers, counts and references go through C27 Number display; amounts through C40 Amount.
- Dates: stored and sent as `yyyy-MM-dd` (`DATE_VALUE_FORMAT`); shown as "Sep 26, 2026" via `Intl.DateTimeFormat`. Posting dates are calendar dates and are never shifted by the viewer's time zone. Timestamps (notifications, timeline events) show local time with the zone abbreviation available (never hover-only).
- Account numbers: "Operating ••4821". Full number only after step-up.

The examples in this section are written in one illustrative locale and currency. The output members get is whatever `Intl` produces for the locale and currency in force (`DEFAULT_LOCALE`, `DEFAULT_CURRENCY`, both bound by OD1); no string in constants hard-codes a symbol, a separator or a month name.

**Money.**

- **Minor units.** The number of decimal places is the currency's own (two for most, zero for JPY, three for BHD), read from `Intl` for the ISO 4217 code. The decimal string given to the formatter is built by inserting the decimal point into the minor-unit string; the value is never passed through `Number`, so amounts beyond 2^53 minor units stay exact. No amount is rounded, abbreviated ("1.2k", "3M") or shown without its minor units, including in totals and in the palette.
- **Sign.** The minus is the minus sign U+2212 as `Intl` emits it, never a hyphen and never parentheses. Zero carries no sign. Every non-zero transaction amount carries one; balances carry a sign only when negative. The sign is part of the text, so it survives copying and reaches a screen reader, which is told "credit" or "debit" in words as well.
- **Currency.** Each amount is formatted in its own currency. When the workspace holds accounts in more than one currency, every amount also carries its ISO code so that "$" is never ambiguous between dollars. Amounts in different currencies are never added, netted, averaged or sorted against each other; a list sorted by amount that spans currencies sorts within each currency. No conversion rate is applied or shown anywhere in v1.
- **Pending and posted.** A pending amount is labelled "Pending" and is described as an amount that may change before it posts. Once posted, the amount is final. A `returned` transaction keeps its original amount and sign, labelled "Returned", with the offsetting entry linked; a `reversed` one likewise, labelled "Reversed". Neither is ever shown as a negative of itself or struck out of a total: the original and its offset both count, which is why the ledger still matches the statement. `failed` amounts are labelled "Failed" and described as never having left or reached the account.

**Dates and times.**

- **Calendar dates** — posting date, initiation date, statement period, export range, filter bounds — are dates without a time and are always absolute. They are never rendered relative ("yesterday"), never shifted by the viewer's time zone, and mean the date in the **workspace time zone** (the IANA zone in workspace settings), which is UTC when the workspace has none set and is also what "today", "this month", month-end and every preset range are computed in. Internal `(admin)` sections use UTC. A member in another zone sees the same posting date as their colleagues; where their own date differs from the workspace's, range presets say which zone they use.
- **Timestamps** — when a notification was raised, a note written, an export finished, a session started — are instants. They are shown in the viewer's local zone. An instant less than 24 hours old may be given relatively ("5 minutes ago", via `Intl.RelativeTimeFormat`); from 24 hours on it is absolute. The absolute date and time with zone is always available as text to every input method, and is what the `datetime` attribute carries. Audit-relevant instants (reveal, role change, verification decision) are always absolute.
- **Month-end and daylight saving.** A period is a closed range of calendar dates, both ends inclusive; "September 2026" is 2026-09-01 to 2026-09-30 in the workspace zone regardless of where it is read. Ranges are computed on dates, never by adding 24-hour blocks, so a daylight-saving change cannot move a boundary. A statement month is the bank's statement period as the backend reports it, which the product does not recompute.
- **Year.** The year is always given in a date; it is never dropped for dates in the current year, because a ledger read in January is mostly about December.

**Counts and identifiers.** Counts use `Intl.NumberFormat` grouping and say what they count and whether they are complete ("1,204 transactions"; an exact count is given up to 10,000 (`COUNT_EXACT_LIMIT`) and reads "10,000+ transactions" beyond it, never a guessed exact figure). Bank references, IDs and request references are never grouped, reformatted, truncated in the middle or case-changed, and are copyable whole.

## 9. Cross-linking

| From | To | Link | Carries |
|---|---|---|---|
| Transaction (S23 row, S16 row) | P12 | Opening it → P12 over the list (intercepted route); ⌘/Ctrl-click → full page | Current filters stay in the underlying URL |
| P12 | P10 | Account name | — |
| P12 | P19 | Counterparty name | — |
| P12 | P17 | "In statement for Sep 2026" once posted in a closed month | Statement month + account |
| P10 | P17 | "Statements for this account" | `account` |
| P10 | P18 | "Export this view" | All active filters prefilled in S31 |
| P10 | P11 | "Search all accounts" | Current `q`, `from`, `to` |
| P19 | P11 | "All transactions with <name>" | `q` = counterparty |
| P09 row | P10 | Account row | — |
| P17 row | P10 | Account name | `from`/`to` = statement month |
| P18 job | P10 or P11 | "Open source view" | The export's filters |
| P20 notification | Target entity | Whole row | — |
| S13 notice | P07 | "Continue verification" | — |
| P31 | P33 | "Look up in support" | user ID |
| P33 result | P31 | User email | — |

Rule: every entity mention is a link to its canonical page, except on that page itself. Why: F3 is a chase across entities; a counterparty name that does not link forces a search.

Rules for when the target cannot be opened:

- **The reader's role cannot open the target page.** The mention is plain text, not a link, and nothing marks it as a withheld link. A viewer reading P12 gets no route to P17 (no statement capability); an accountant gets no route to P16. A link that would be refused is never offered and then denied. The decision uses the same capability matrix as navigation ([§6.1](#61-capability-matrix)).
- **The target is an account outside a viewer's permitted list.** It cannot be mentioned at all, because the backend does not return it; an internal transfer between a permitted and a non-permitted account names the other side by its type label only ("Internal transfer"), never by account name or last 4.
- **The target no longer exists or is no longer reachable** — a notification about a deleted saved view, a removed member, an expired export, an attachment since deleted. The row stays readable as a record of what happened and opens nothing, with the reason in words ("This export has expired"). An expired export leads to creating it again with the same filters; nothing else is auto-recreated.
- **The target is in another workspace.** A notification list, message thread or note only ever mentions entities of the current workspace. A pasted link to another workspace's entity follows [§15](#15-fallback-routes).
- **The carried context is no longer valid.** Parameters a link carries are validated at the destination exactly like a pasted URL ([§11.2](#112-validation)); a carried account that was since closed still resolves, a carried saved view since deleted is dropped with the notice. "Open source view" on an export reproduces the filters, not the rows: the member is told that results may differ from the file when transactions have posted since.
- **Leaving the product.** Links in member-written notes and messages are rendered as text, not as active links (IA11), so a note cannot be used to send a colleague to a look-alike sign-in page. Help articles may link out; those links send no referrer.

A tester can verify: for each row of the table and each role R1–R4, the link is either present and opens its target, or absent — never present and refused.

## 10. Search hierarchy

C38 CommandPalette (⌘K / Ctrl+K) is the single global search. Results are grouped in this order, each group capped at five results, with a way to all results where a full page exists:

| Order | Scope | Matches | Source | "Show all" goes to |
|---|---|---|---|---|
| 1 | Pages | Navigation and sub-page labels | nav config in `lib/data/`, filtered by capability | — |
| 2 | Accounts | Account name, last 4 digits | use-accounts cache | P09 |
| 3 | Transactions | Amount, reference, counterparty name, description | backend search | `/transactions?q=<query>` (P11) |
| 4 | Counterparties | Name | backend search | P11 with `q` |
| 5 | Help | Article title and summary | help articles in `lib/data/` | `/help?q=<query>` (P28) |

Amount matching: a query that parses as a money amount ("1250", "1,250.00", "$1,250") is converted to minor units by string parsing (no float) and matched on absolute value, so "1250" finds both +$1,250.00 and −$1,250.00. Reference matching is exact-prefix. Why pages rank first: most palette use is navigation, and a page match is instant while a transaction match waits on the network.

Scopes a role cannot open never appear. In the `(admin)` area the palette scopes are Pages, Users (P31) and Help. Other searches: S21 on P11 (full-text, same backend search), S46 on P28 (help only), S53 on P33 (users and workspaces).

### 10.1 Query rules

Values are constants (IA8); the same constants are read by C38, S21 and the backend contract.

| Rule | Specified value | At the limit |
|---|---|---|
| Minimum query length | Pages, Accounts and Help match from 1 character (local data). Transactions and Counterparties are queried from 2 characters after trimming (`LEDGER_QUERY_MIN_LENGTH`), amounts included (C38) | A shorter query sends no request; the member is told how many characters are needed rather than shown "no results" |
| Maximum query length | 100 characters (`LEDGER_QUERY_MAX_LENGTH`); the ledger query is 2–100 characters | Input stops accepting characters and says so; a longer value arriving by URL is invalid ([§11.2](#112-validation)), never silently cut |
| Debounce | 300 ms (`SEARCH_DEBOUNCE_MS`) after the last keystroke for backend scopes; local scopes answer on each keystroke | — |
| Superseded requests | A new query cancels the request in flight; a response that arrives for an older query is discarded | The result given always belongs to the current query |
| Results per scope | 5 | "Show all" leads to the full page where one exists; the scope states when more exist |
| Backend time limit | 5 seconds (`SEARCH_TIMEOUT_MS`) | That scope reports that search did not answer and offers retry, with a reference; local scopes keep working |
| Normalisation | Trimmed; inner whitespace collapsed; case-insensitive; diacritic-insensitive for names ("Muller" finds "Müller"); no wildcard or operator syntax — `%`, `*`, `_` and quotes are literal characters | — |

**Ranking.** Within a scope, in this order; ties fall through to the next rule and finally to the entity ID, so the same query always gives the same order.

| Scope | Rule |
|---|---|
| Pages | Label starts with the query → a word in the label starts with it → label contains it; then navigation order |
| Accounts | Last 4 equals the query → name starts with it → name contains it; `active` before other statuses; then name |
| Transactions | Reference starts with the query (exact prefix) → amount equals the parsed amount → counterparty name starts with it → description or counterparty contains it; within each, most recent date, pending before posted on the same date |
| Counterparties | Name starts with the query → a word in the name starts with it → name contains it; then most recent transaction |
| Help | Title match before summary match; then article order in `lib/data/` |

Relevance is never personalised and never learned from what other members opened: two members with the same access and the same query get the same list.

**Amount queries.** A query is treated as an amount when, after removing one leading currency symbol or code, sign and grouping separators valid for the locale, it is digits with at most the currency's number of decimal places. It then runs both as an amount and as text (a reference can be all digits). "1250" matches 1,250.00 in every currency the workspace holds, each result carrying its own currency; it does not match 12.50. A value over 15 digits of minor units is treated as text only.

**No results.** The palette says that nothing matched, quoting the query back as text (escaped, never interpreted as markup), keeps the query editable, and offers the two honest next steps: running the same query on P11, where filters can widen it, and searching Help. It never substitutes "similar" results for a transaction query — a near-match on an amount is a wrong answer. The number of results, or that there are none, is announced to assistive technology once the query settles, not on each keystroke. When a scope is empty only because of access (a viewer's permitted accounts), the wording is the same as for no match.

**Scale.** A single account may hold 5 million transactions and a workspace far more: backend scopes are answered from a search index, never by scanning, and never return a count larger than they can state exactly ([§8.4](#84-money-sign-and-date-formats)). Free text matches whole-word prefixes, not arbitrary substrings, on the ledger (IA8) — the cost of substring search at that size is the reason. A workspace with no transactions yet shows the transaction scopes empty without an error.

**Excluded from search, for privacy.**

- Full account and routing numbers: only the last 4 are indexed, and a query of more than 4 digits is never matched against account numbers.
- Note text and attachment names and contents in the palette (notes are searchable only through `q` on P11, by members who can read them); attachment contents are never indexed anywhere.
- Message thread bodies, verification details, documents and beneficial owners.
- Other members' personal saved views; members' emails and names, except in `(admin)` Users and on P23 for roles that may view the team.
- Anything outside the current workspace, and for a viewer anything outside permitted accounts — applied by the backend to results and to counts alike.
- In `(admin)`: no ledger content (IA7). A staff search is by user email, user ID, workspace name or workspace ID, has its own minimum length (`SUPPORT_QUERY_MIN`, 3 characters), returns at most 50 results (`SUPPORT_RESULT_LIMIT`) and is an audited read ([§6.3](#63-enforcement-point-denial-and-audit-record-per-capability)).

**What is kept about a search.** The palette's Recent entries hold entity IDs and labels only — never an amount, an account number or the query text — are kept in the open tab's memory only, never in `localStorage`, because a label can name an account or a counterparty; they are keyed by user and workspace so one never surfaces in another, hold at most 8 entries (IA8), and are cleared on sign-out and when the tab closes. Query text is not sent to analytics, not written to client logs and not placed in a page title. It does appear in the URL as `q` when the member moves to P11 (IA10, Phase 1 OD14).

**Degraded service.** Offline, Pages, cached Accounts and Help still answer; Transactions and Counterparties say that search needs a connection. On session expiry the query survives re-authentication (X4). A tester can verify each row of the two tables with a seeded workspace, including that a superseded response never replaces a newer one and that a viewer's results and counts exclude non-permitted accounts.

## 11. Filtering hierarchy

### 11.1 URL parameters (P10, P11, P14, P19)

| Param | Meaning | Type and format | Allowed range and maximum | Default when absent |
|---|---|---|---|---|
| `from` | Earliest date, inclusive | Calendar date, `yyyy-MM-dd`, a date that exists (no 2026-02-30) | Any date with a four-digit year; a date before the account opened is valid and simply matches nothing | No lower bound |
| `to` | Latest date, inclusive; must be ≥ `from` | Calendar date, `yyyy-MM-dd` | Same range; a future date is valid (pending items can carry one). The 731-day inclusive span limit (`LEDGER_MAX_RANGE_DAYS`) applies only when both `from` and `to` are given; exports apply their own span limit (366 days, `EXPORT_MAX_RANGE_DAYS`) | No upper bound |
| `type` | Transaction types | Comma list of [§7.3](#73-transaction-types) values, lower case | 1–8 distinct values | All types, including unrecognised ones ([§7.7](#77-unknown-values-and-change-policy)) |
| `direction` | Money in or money out, by the sign of the amount ([§7.3](#73-transaction-types)) | One of `in` (credits) or `out` (debits) | One value | Both directions |
| `status` | Transaction statuses | Comma list of [§7.6](#76-statuses-spine-2) transaction values | 1–5 distinct values | All statuses |
| `category` | Member-assigned categories | Comma list of [§7.4](#74-categories) category values, lower case | 1–20 distinct values (`LEDGER_CATEGORY_FILTER_MAX`); unknown values are dropped and the rest apply | All categories, uncategorized included |
| `min` | Smallest absolute amount | Integer minor units as a digit string; no sign, separator, decimal point or leading `+` | 1–15 digits; `0` allowed | None |
| `max` | Largest absolute amount; must be ≥ `min` | Same | 1–15 digits | None |
| `q` | Free text over counterparty, description, reference, note | String, trimmed | 2–100 characters after trimming (`LEDGER_QUERY_MIN_LENGTH`, `LEDGER_QUERY_MAX_LENGTH`) | None |
| `account` | Accounts to include (P11, P14 only; P10 takes it from the path) | Comma list of opaque account IDs | 1–50 IDs (`LEDGER_ACCOUNT_FILTER_MAX`), each 1–64 characters of `A–Z a–z 0–9 _ -` | All permitted accounts |
| `flagged` | Only flagged transactions | The literal `true` | — (`false`, `1`, `yes` are invalid) | All (P14 implies `true`) |
| `attachment` | Only transactions carrying at least one attachment | The literal `yes` | — (`true`, `1`, `no` are invalid) | All |
| `view` | Saved view applied | One opaque saved view ID | 1–64 characters, same alphabet | None |

The full set, in this order, is `from`, `to`, `type`, `direction`, `status`, `category`, `min`, `max`, `q`, `account`, `flagged`, `attachment`, `view`; this table is the authority for it, and the Phase 4 sample schema and Phase 5 S21 list the same set.

**Unbounded query.** With no `from` and no `to` the ledger reads newest first and pages back by cursor without limit; with one bound it pages the same way from or up to that date. The 731-day cap (`LEDGER_MAX_RANGE_DAYS`) applies only when both bounds are given: when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared ([§11.2](#112-validation)).

`min` and `max` compare absolute values within each account's own currency; on P11 across accounts in several currencies the amount filter applies per currency and the summary says so ([§8.4](#84-money-sign-and-date-formats)). All dates are calendar dates in the workspace time zone.

Dates filter on posting date for posted rows and on initiation date for pending rows. `min`/`max` are minor units so the URL never contains a decimal separator that depends on locale; C47 Active filter gives them formatted ("≥ $500.00"). The cursor for "load more" is not a URL parameter. Why: a shared link should open at the start of the result, not mid-scroll.

Hierarchy: `view` expands into the other params on apply; if a member then changes a filter, the applied view is marked "Edited" and the URL keeps both `view` and the changed params. Filter priority (for the build, not placement): date range (C48) → search → status → type → direction → category → amount → account → flagged → attachment.

**One view, one URL.** Whenever the product writes the URL it writes the canonical form: parameters in the order of the table, list values de-duplicated and sorted, absent rather than empty parameters, no default spelled out. Two members who build the same filter in a different order therefore share one URL and one cached result. A filter change replaces the history entry while the member is typing in `q` and adds one entry per committed change otherwise, so Back undoes one decision, not one keystroke.

**Never in a URL** — in `(app)`, `(admin)` or anywhere else:

- full or partial account, routing or card numbers (the last 4 included); account names;
- member, owner or beneficial-owner names, emails, phone numbers, addresses, dates of birth, document identifiers;
- formatted amounts, balances, or any figure other than the member-chosen `min`/`max` bounds;
- note text, message text, attachment file names;
- session, step-up, reveal or download tokens; the pagination cursor; the workspace ID (IA5);
- anything a member did not put there themselves, with one recorded exception: `q` is member-typed free text and may contain a counterparty's name (IA10, Phase 1 OD14); it is never logged or sent to analytics.

Single-use tokens on P05 and on an invitation link are the only credentials that travel in a URL; they are removed from the address as soon as they are read, are valid once, and those pages send no referrer. `next` on P02 is covered in [§16](#16-protected-prefixes). Signed-in pages send no referrer to other origins and their URLs are not sent to analytics with their query string.

### 11.2 Validation

The schema lives in `lib/validations/` and composes over the generated transaction query schema once the backend publishes it (`.pick`, `.extend`). Enum tuples come from constants.

```ts
import { z } from "zod";
import {
    LEDGER_ACCOUNT_FILTER_MAX,
    LEDGER_CATEGORY_FILTER_MAX,
    LEDGER_MAX_RANGE_DAYS,
    LEDGER_QUERY_MAX_LENGTH,
    LEDGER_QUERY_MIN_LENGTH,
    MINOR_UNITS_PATTERN,
    MS_PER_DAY,
    OPAQUE_ID_PATTERN,
    TRANSACTION_CATEGORIES,
    TRANSACTION_DIRECTIONS,
    TRANSACTION_STATUSES,
    TRANSACTION_TYPES,
} from "@/lib/constants";

const csvOf = <T extends z.ZodType>(item: T, max: number) =>
    z
        .string()
        .transform((raw) => [...new Set(raw.split(","))].sort())
        .pipe(z.array(item).min(1).max(max));

const knownCsvOf = <T extends z.ZodType>(item: T, max: number) =>
    z
        .string()
        .transform((raw) =>
            [...new Set(raw.split(","))]
                .filter((value) => item.safeParse(value).success)
                .sort(),
        )
        .pipe(z.array(item).min(1).max(max));

const opaqueId = z.string().regex(OPAQUE_ID_PATTERN);

const minorUnits = z.string().regex(MINOR_UNITS_PATTERN);

const byMagnitude = (value: string) => value.padStart(15, "0");

const daysInclusive = (from: string, to: string) =>
    (Date.parse(to) - Date.parse(from)) / MS_PER_DAY + 1;

export const ledgerFiltersSchema = z
    .object({
        from: z.iso.date().optional(),
        to: z.iso.date().optional(),
        type: csvOf(
            z.enum(TRANSACTION_TYPES),
            TRANSACTION_TYPES.length,
        ).optional(),
        direction: z.enum(TRANSACTION_DIRECTIONS).optional(),
        status: csvOf(
            z.enum(TRANSACTION_STATUSES),
            TRANSACTION_STATUSES.length,
        ).optional(),
        category: knownCsvOf(
            z.enum(TRANSACTION_CATEGORIES),
            LEDGER_CATEGORY_FILTER_MAX,
        ).optional(),
        min: minorUnits.optional(),
        max: minorUnits.optional(),
        q: z
            .string()
            .trim()
            .min(LEDGER_QUERY_MIN_LENGTH)
            .max(LEDGER_QUERY_MAX_LENGTH)
            .optional(),
        account: csvOf(opaqueId, LEDGER_ACCOUNT_FILTER_MAX).optional(),
        flagged: z.literal("true").optional(),
        attachment: z.literal("yes").optional(),
        view: opaqueId.optional(),
    })
    .refine((f) => !f.from || !f.to || f.from <= f.to, { path: ["to"] })
    .superRefine((f, ctx) => {
        if (
            !f.from ||
            !f.to ||
            daysInclusive(f.from, f.to) <= LEDGER_MAX_RANGE_DAYS
        )
            return;
        ctx.addIssue({
            code: "custom",
            path: ["from"],
        });
    })
    .refine(
        (f) => !f.min || !f.max || byMagnitude(f.min) <= byMagnitude(f.max),
        { path: ["max"] },
    );

export type LedgerFilters = z.infer<typeof ledgerFiltersSchema>;
```

The schema only reports that the range is too long. Which bound is cleared is decided by `parseLedgerFilters` using today in the workspace time zone, because a schema cannot know the workspace’s date; the rule it applies is in the failure table below.

Invalid input is never silently obeyed and never crashes the page: parameters are validated key by key, invalid keys are dropped, and S21 shows a C12 Status label notice ("1 filter in this link was ignored"). Why: a member who pasted a broken link should see that part of it did not apply, instead of a result that looks complete.

What happens for each kind of failure:

| Input | Behaviour |
|---|---|
| A value of the wrong type or outside its range (`from=yesterday`, `min=12.50`, `min=-5`, a 16-digit amount, a 1-character or 101-character `q`, `direction=both`, `attachment=true`) | That parameter is dropped; the rest apply; the notice counts it. A value is never coerced, clamped or truncated into something the member did not ask for — a clamped amount bound would return a plausible, wrong ledger |
| One bad value inside a list (`type=wire,teleport`) | The whole parameter is dropped, not just the bad value, because "wire and something else" silently narrowed to "wire" misstates the request. `category` is the one exception: an unknown category value is dropped and the known ones apply, and the notice counts it, because a category can be retired ([§7.7](#77-unknown-values-and-change-policy)) while links that carry it live on; a `category` list with no known value left is dropped whole |
| `from` later than `to`, or `min` larger than `max` | The later-named bound (`to`, `max`) is dropped and reported; the two are never swapped |
| `from` and `to` both given and more than 731 days apart (`LEDGER_MAX_RANGE_DAYS`) | The request is refused with the limit stated; the bound nearer to today (in the workspace time zone) is kept and the other is cleared and reported, and the ledger pages on by cursor from the kept bound. A range is never shortened to fit. A link with one bound, or none, is never refused for its span |
| A list longer than its maximum | The parameter is dropped and reported |
| The same parameter given twice | The parameter is dropped and reported; neither occurrence is preferred |
| An unknown parameter | Ignored without a notice and left out of the next URL the product writes. It is never passed to the backend |
| `account` naming an ID the member cannot read — unknown, another workspace's, or outside a viewer's permitted list | The backend answers as for an unknown ID; the parameter is dropped with the same notice in all three cases, so the response never confirms that an account exists |
| `view` naming a view that was deleted or belongs to another member | Dropped with "The saved view in this link is not available"; the other parameters in the link still apply |
| `account` on P10 or `flagged` on P14 that disagrees with the route | The route wins; the parameter is dropped and reported |
| A URL longer than 2,000 characters (IA8) | The product never writes one: a filter that would exceed it (many accounts) is refused at the moment it is chosen, with a saved view suggested as the way to share it |

The notice is announced once to assistive technology when the page settles, names the ignored parameters by their filter label, and offers the cleaned URL as the link to share onward. The address is rewritten to the cleaned form without adding a history entry.

The same schema validates on the server before any request leaves for the backend, and the backend validates again: a crafted request that skips both receives 400 with field-level reasons, which the member sees as a failed load with a reference ([§15](#15-fallback-routes)), never as an empty ledger. An empty result and a failed request are different states and are never worded alike.

A tester can verify: each row of the table by URL; that the canonical form of a hand-reordered URL equals the product-written one; that no request reaches the backend carrying a dropped parameter; and that a filtered P10 on a 5-million-transaction account answers from the server without loading unmatched rows.

## 12. SEO hierarchy

| Pages | Indexable | Why |
|---|---|---|
| P01 Home | Yes | Acquisition |
| P28 Help center (`/help`, `/help/[slug]`) | Yes | Members and prospects search the web for answers |
| P02 Sign in, P03 Register, P04 Forgot password | Yes | People search "Ledgerline login" |
| P05 Reset password, P06 Two-step verification | No | Token or challenge pages; useless without the link that opened them |
| Everything in `(app)` and `(admin)` | No (`noindex, nofollow`) | Private data; also behind a session |
| P34, P35 | No | Status pages |

Metadata comes from constants: the product name, title template ("%s · Ledgerline"), and default description are defined once in `lib/constants.ts` and read by `app/layout.tsx`; each group layout sets `robots`, and each page exports only its own title. Next's `app/robots.ts` and `app/sitemap.ts` list exactly the indexable routes above, generated from the same route constants. Help article titles and descriptions come from the article records in `lib/data/`.

The exact set, by URL. Anything not listed as indexable is not indexable; a new route is `noindex` until this table says otherwise.

| URL | Robots | Canonical | In `sitemap.ts` |
|---|---|---|---|
| `/` | `index, follow` | `/` | Yes |
| `/help` | `index, follow` | `/help` | Yes |
| `/help?q=…` and any other query string on `/help` | `noindex, follow` | `/help` | No |
| `/help/[slug]` for a published article | `index, follow` | itself, without query string | Yes, one entry per article |
| `/help/[slug]` unknown or withdrawn | 404 or 410 ([§15](#15-fallback-routes)) | — | No |
| `/auth/login`, `/auth/register`, `/auth/forgot-password` | `index, follow` | the path without query string (`?next=…` is never canonical) | Yes |
| `/auth/reset-password`, `/auth/verify`, and P02 or P03 when opened with an invitation token (IA12) | `noindex, nofollow` | — | No |
| Every `(app)` and `(admin)` URL | `noindex, nofollow`; unreachable without a session, so a crawler receives the sign-in redirect | — | No |
| P34 | `noindex`, served with status 404 | — | No |
| P35 | `noindex`, served with status 500 or 503 | — | No |
| Route handlers under `/api` | Not pages; disallowed in `robots.ts` | — | No |

Rules:

- `robots.ts` disallows the protected prefixes ([§16](#16-protected-prefixes)) and `/api`, generated from the same constants, and does **not** disallow `/auth/reset-password` or `/auth/verify`: those rely on `noindex`, which a crawler can only obey on a page it is allowed to fetch.
- An unknown URL answers 404 and a withdrawn one 410 as real status codes. A page that says "not found" with status 200, or a redirect of every unknown URL to `/`, is a defect.
- Titles and descriptions of `(app)` and `(admin)` pages are the static page name only ([§8.1](#81-navigation-labels-exact)). No account name, last 4, counterparty, member name, email, amount or count is ever part of a title, a description, or any metadata a browser history, a shared-screen tab list or a link preview could expose.
- Preview and staging deployments are `noindex, nofollow` on every URL, the indexable ones included, and publish no sitemap.
- Whether P02 and P03 remain indexable depends on OD10: while the public site does not lead to them, they stay reachable by URL and indexable as specified here.

## 13. Breadcrumb strategy

Breadcrumb trails (C29, part of S03 Page identity & actions) exist **only on detail pages**. Top-level pages have none. Breadcrumbs follow **ownership, not history**:

| Page | Trail |
|---|---|
| P10 | Accounts › Operating ••4821 |
| P12 (full page) | Accounts › Operating ••4821 › <counterparty or type label> |
| P19 | Transactions › <counterparty name> |
| P13 / P14 | Transactions › Saved views / Flagged |
| P15 / P16 | Insights › Compare periods / Runway |
| P21 thread | Messages › <thread subject> |
| P23 / P24 | Settings › Team › <member name> |
| P25 | Settings › Profile & security |
| P31 | Admin › Users › <email> |
| P32 case | Admin › Compliance › <business name> |
| P28 article | Help › <article title> |

Why ownership: a transaction opened from search, from the dashboard or from a notification has one place in the structure; the trail teaches that place. History is served by the browser Back button, which works because filters live in the URL. P12 opened over a list (intercepted route) has no trail; it reaches its account and counterparty directly ([§9](#9-cross-linking)). On a phone the trail may shorten to its parent ("‹ Operating ••4821"), which stays reachable.

Rules for trails that cannot be completed:

- **An ancestor the reader may not open** is given as text, not as a link, and is not removed: the trail still teaches where the page sits. `Settings` resolves by the first-permitted rule of [§5](#5-role-based-navigation); for R3 and R4 on P25 it would resolve to the page they are on, so it is text. In `(admin)`, `Users` is text for a staff role that may read a user record but not list users (R5 on P31).
- **A page the reader may not open has no trail at all.** The access-denied and not-found states never show the ancestors of the thing that was refused, because "Accounts › Operating ••4821" on a refusal would confirm the account exists.
- **A name that has not loaded, or failed to load,** is replaced by the page's static label ("Account", "Transaction", "Counterparty", "Team member", "User", "Case"), never by a raw ID and never by a name remembered from a previous workspace.
- **Names in a trail obey the same privacy rules as everywhere else:** an account is name plus masked last 4; a transaction is its counterparty or type label, never its amount; a P31 trail carries the user's email only inside `(admin)`; a P32 trail carries the business name only for R6 and R7.
- The trail is exposed as a navigation landmark named "Breadcrumb" with the current page marked as current and not a link (C29). It is not a focus destination: after navigation focus goes where the page contract says, not to the trail.

## 14. Empty routes

Segments that exist in a URL but have no page of their own:

| URL | Behaviour | Why |
|---|---|---|
| `/insights` | Redirect to `/insights/compare` for roles that may open P15; P34 otherwise | The group has no overview worth a page |
| `/auth` | Redirect to `/auth/login` | — |
| `/counterparties` | Redirect to `/transactions` | Counterparties are reached through transactions; a bare list duplicates P11 |
| `/payments`, `/payments/transfer` while money movement is disabled | Render P34 Not found; no nav entry | Money movement is outside v1 (Phase 1 BR7, OD3). A "coming soon" page would promise a regulated capability that depends on a licence nobody has granted; a 404 promises nothing |
| `/payments` while enabled | P27 Payees & bill pay | — |
| `/settings` for R3 and R4 | Redirect to `/settings/profile` | The first permitted sub-page ([§5](#5-role-based-navigation)); a refusal for a page whose sibling they may open would be a dead end |
| `/admin` and anything beneath it for a workspace member | P34 | The admin area does not reveal that it exists ([§6.2](#62-how-permissions-are-enforced)) |
| Any `(app)` URL for a staff user (R5–R7) | Redirect to `/admin` | Staff hold no workspace membership |
| Any `(app)` URL other than `/onboarding` and `/settings/profile` for a signed-in owner with no workspace yet | Redirect to `/onboarding` | Nothing else has data to show |
| `/onboarding` once the case is `approved` | Redirect to `/dashboard` | The task is finished; the outcome stays readable from Workspace settings |
| `/onboarding` for R2–R4 | Access-denied state; the case status is stated, its contents are not ([§6.3](#63-enforcement-point-denial-and-audit-record-per-capability)) | Only an owner completes verification |

The money-movement switch is read on the server and must match the backend; the UI switch alone never enables a transfer.

Redirect rules: a redirect that depends on who is asking (role, membership, verification state, the money-movement switch) is temporary and is never cached by a browser or an intermediary, so a later change of role or state takes effect on the next request. Only `/auth` → `/auth/login` and `/counterparties` → `/transactions` are permanent. No redirect carries the query string of a private page to a public one, and none leaves the origin.

## 15. Fallback routes

| Situation | File | Renders |
|---|---|---|
| Unknown URL anywhere | `app/not-found.tsx` | P34, marketing chrome |
| Unknown ID inside `(app)` (`accounts/[accountId]`, `transactions/[transactionId]`, `counterparties/[counterpartyId]`, `messages/[threadId]`, `settings/team/[memberId]`) | per-segment `not-found.tsx` | P34 within the `(app)` layout, leading back to the parent list |
| Unknown ID inside `(admin)` (`users/[userId]`, `compliance/[caseId]`) | per-segment `not-found.tsx` | P34 within the `(admin)` layout |
| Unknown help slug | `help/[slug]/not-found.tsx` | P34 body with S46 search |
| Render or data error in a group | `(app)/error.tsx`, `(admin)/error.tsx`, `(marketing)/error.tsx` | P35 within the group's layout, retry via C33 |
| Root layout failure | `app/global-error.tsx` | P35 standalone |
| A single section fails | C58 SectionErrorBoundary | C33 in that section only; the rest of the page stays |
| Offline | S54 offline variant | Last data stays readable, marked stale; writes are refused while offline, never queued ([X10](phase-2-experience-maps.md#x10--error-offline-and-outage-recovery)) |
| Intercepted transaction route on hard refresh or direct link | `@drawer/(.)transactions/[transactionId]` intercepts only client navigation; a full load of `/transactions/[transactionId]` renders P12 as a full page; `@drawer/default.tsx` renders nothing | The shared link always works, with or without the list behind it |

A resource that exists in another workspace returns 404 from the backend, not 403. Why: a 403 would confirm to a member that an ID is real in a business they cannot see.

### 15.1 The exact response per situation

"Resource" is anything addressed by an ID in a path or a request. The status is what the backend returns and what a full page load of that URL returns; the wording comes from constants.

| Situation | Status | What the member experiences |
|---|---|---|
| **Unknown** — the ID matches nothing, or is malformed (wrong alphabet or length, [§11.1](#111-url-parameters-p10-p11-p14-p19)) | 404 | P34 within the area's layout, naming the kind of thing by its static label ("This account could not be found"), leading to the parent list. A malformed ID is refused without a backend request. The ID is not echoed back |
| **Other workspace, reader is not a member there** | 404 | Identical to Unknown in status, body, wording and — as far as the backend can make it — response time. Nothing distinguishes "does not exist" from "exists elsewhere" |
| **Other workspace, reader is a member there** (A4; IDs are globally unique) | 404 for the current workspace | The backend, having confirmed the membership, names that workspace in its response. The member is told the link belongs to another of their workspaces and is offered the switch to it by name; nothing switches without their say (IA11), and the page opens after the switch only if their role there allows it |
| **Viewer, account outside the permitted list** | 404 | Identical to Unknown. A transaction, counterparty history or statement that belongs only to such an account is likewise 404 |
| **Forbidden by role** — the page or action exists for this workspace but not for this role | 403 | The access-denied state (the not-permitted empty state C32, never C33) within the area's layout: names the page by its label, names the role that can grant access, offers the way back. It does not load, count or hint at the data behind it. For a write, nothing changes and the value stays as it was |
| **Forbidden, `(admin)` for a non-staff user** | 404 | P34 ([§14](#14-empty-routes)) |
| **Gone** — it existed and was removed on purpose: an `expired` export file, a deleted attachment, a deleted saved view, a revoked or expired invitation, a used or expired reset link, a withdrawn help article | 410 | Stated as such, with what to do next: create the export again from its filters; ask the author about the attachment; the view parameter is dropped ([§11.2](#112-validation)); ask an owner for a new invitation; request a new reset link; go to Help. Never worded as "not found", because the member remembers it existing |
| **Closed or frozen account, returned or reversed transaction** | 200 | Not an error. The page opens with the status stated; history, statements and exports remain |
| **Pending transaction that no longer exists** (dropped by the bank before posting) | 410 | "This pending transaction was not posted", with the route to the account ledger. Notes written on it are kept by the backend and are reported to their author through X7, never lost silently |
| **Not signed in or session expired, full page load** | Redirect to `/auth/login?next=…` | [§16](#16-protected-prefixes) |
| **Session expired, request from an open page** | 401 | Re-authentication without navigation (X4); the URL, filters and unsent text survive in the open tab's memory. An interrupted write is never replayed: the draft is kept in that memory only — never in `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and gone when the tab closes — and the member re-submits it with the same idempotency key; a different user re-authenticating drops the draft |
| **Step-up required** | 401 with a step-up challenge | The step-up prompt; on cancel the action does not happen and nothing else is disturbed |
| **Conflict** — the thing changed since it was read (a role, a note, the last-owner rule) | 409 | The write is refused; the current value is given with the member's attempted value kept for them to re-apply; nothing is overwritten silently and last-write-wins is used nowhere |
| **Repeated submission** — the same invite, export request or annotation sent twice | 200 or 201, once | The second request returns the result of the earlier one; one invitation, one export job, one annotation, one audit record |
| **Rate limited** | 429 | The member is told to wait and for how long, from the response; the request is not retried automatically faster than the response allows |
| **Backend error or timeout** | 500, 502, 503, 504 | P35 for a page, C33 for a section, each stating that viewing failed and that no money or data was changed, with retry and a reference. A read times out in the browser after 15 s (`REQUEST_TIMEOUT_MS`) and a write after 30 s (`MUTATION_TIMEOUT_MS`). Reads retry automatically at most twice with 1–8 s increasing delay (`QUERY_RETRY_LIMIT`); writes are never retried or re-sent automatically — a member's own re-submission carries the same idempotency key |

**The reference.** Every P35 and C33 carries a reference the member can read out or copy: the request reference issued by the backend, or the render digest when the failure never reached the backend. The reference is required on every failure, including a refusal produced before the backend is reached (validation, offline), where the client generates it. It contains no personal data, no workspace or account identifier and no path; support resolves it to the request, the user and the workspace through the audit record ([§6.3](#63-enforcement-point-denial-and-audit-record-per-capability)). P34 carries none — a missing page is not a fault.

**What a fallback never does:** echo the requested ID or query back into the page as markup; reveal ancestors of a refused resource ([§13](#13-breadcrumb-strategy)); present figures from a previous workspace or a previous user; describe a read failure in words that suggest money moved; or send a member who was signed in to the public home page.

**Focus and announcement.** On P34, P35 and the access-denied state, focus moves to the statement of what happened, so a keyboard or screen-reader user learns the outcome before any other content; a section-level failure does not move focus and is announced politely unless it blocks the task (C33).

A tester can verify, with two seeded workspaces and one user who belongs to only one: every dynamic route in [§3.2](#32-page-index) requested with (a) a random well-formed ID, (b) a malformed ID, (c) a real ID from the other workspace returns the same status and the same body for (a) and (c); each Gone case returns 410 with its next step; and no fallback response contains the requested ID.

## 16. Protected prefixes

Today [`lib/constants.ts`](../../lib/constants.ts) sets `PROTECTED_ROUTE_PREFIXES = ["/dashboard"]`, and [`proxy.ts`](../../proxy.ts) guards only that prefix. The requirement is that the list covers every `(app)` and `(admin)` top-level segment:

```ts
export const PROTECTED_ROUTE_PREFIXES = [
    "/onboarding",
    "/dashboard",
    "/accounts",
    "/transactions",
    "/counterparties",
    "/insights",
    "/statements",
    "/exports",
    "/notifications",
    "/messages",
    "/settings",
    "/payments",
    "/admin",
] as const;
```

Requirements that travel with it:

- Adding a top-level segment to `(app)` or `(admin)` without adding its prefix is a defect; the list is the proxy's only knowledge of what is private.
- A signed-in member who opens `/auth/*` is sent to `/dashboard` (staff to `/admin`), not to `/`. Why: `/` is the marketing page; sending a member there after sign-in looks like a sign-out.
- `/auth/verify` must stay reachable with a session when it serves step-up (X4); the signed-in redirect exempts it.
- `/help` and `/` stay public.
- The `(admin)` role check lives in its server layout, not in the proxy ([§6.2](#62-how-permissions-are-enforced)).
- **Matching is by whole segment.** A prefix protects its own path and everything beneath it (`/accounts`, `/accounts/…`) and nothing that merely starts with the same characters (`/accounts-payable-guide` would be public). Matching is case-sensitive on the canonical lower-case path; other casings are not routes and reach P34.
- **`next` is a path, never a destination of the caller's choosing.** It is accepted only when it begins with exactly one `/`, contains no scheme, host, backslash or control character, is at most 2,048 characters (IA8), and falls beneath a protected prefix. Anything else is discarded and the member lands on `/dashboard` (staff on `/admin`). It is validated again after sign-in, when the role is known: a `next` the member's role cannot open resolves to their landing page, not to a refusal as the opening act of the session. Its query string is kept, and is validated by the destination like any pasted link ([§11.2](#112-validation)).
- **`next` survives the whole sign-in.** It is carried through two-step verification (P06) and through a failed attempt, and is dropped when a different user signs in than the one whose session expired, so one person's deep link is never opened in another's session.
- **Protected responses are never stored by shared caches.** Every response beneath a protected prefix, and every authenticated route handler, is private and not stored, so Back after sign-out does not replay a balance from the browser's history cache and no intermediary serves one member's ledger to another.
- **Sign-out is complete.** It ends the session on the backend, removes the cookie, discards every cached query and the palette's Recent entries, and tells other open tabs to do the same; a tab left open on a ledger reaches the signed-out state on its next interaction, not stale figures.

A tester can verify: each prefix and one path beneath it redirects to sign-in without a session and returns to that path after sign-in; `next=//example.com`, `next=https://example.com`, `next=/\example.com` and `next=/help` all land on `/dashboard`; Back after sign-out shows no private figure.

## 17. Future expansion strategy

| Expansion | Where it lands | Structural cost now |
|---|---|---|
| Multi-entity (one member, several businesses) | Already modelled: workspace switcher C36; IDs are globally unique, so a shared link from another workspace offers the switch after a membership check ([§15.1](#151-the-exact-response-per-situation)) | Workspace is **not** in the URL in v1. Moving to `/w/[workspace]/…` later breaks every shared link and bookmark — decide before launch (expensive to reverse) |
| Money movement (transfers, bill pay) | `/payments`, `/payments/transfer` (P26, P27), Payments nav item under Money | None; routes and permissions reserved above |
| Cards | New Money item `/cards`, `card` transaction type already in [§7.3](#73-transaction-types) | One nav entry and one protected prefix |
| Integrations (accounting software sync) | New Settings sub-page `/settings/integrations` | One sub-page; exports (P18) remain the manual path |
| Custom categories | Workspace-level list managed in Settings › Workspace | Category becomes an ID instead of a constant value; migration on stored annotations |
| Locales | No locale segment in `(app)` URLs; locale is a member preference read by `Intl` (A6). Marketing and help may add a `[locale]` segment | Help slugs must stay stable per locale |
| More platform roles | Admin navigation filtered by the same capability matrix | Backend role model (A9) |

Rule for any addition: a new top-level section needs a nav entry in `lib/data/`, a route constant, a protected prefix, a row in the capability matrix and a row in [§5](#5-role-based-navigation). Missing any one is visible — a 404, a hidden page, or a gate that refuses — rather than a quiet leak.

**The rule a new area must satisfy.** An area is not part of the structure until every statement here is true of it; each is checkable in review.

| It must have | Because |
|---|---|
| One canonical route per page, as a constant, in exactly one route group | Links, the palette and breadcrumbs resolve from one list ([§3](#3-sitemap)) |
| A protected prefix, if it is signed-in | The proxy knows nothing else about privacy ([§16](#16-protected-prefixes)) |
| A row in the capability matrix for every action it adds, a column value for all seven roles, and the three answers of [§6.3](#63-enforcement-point-denial-and-audit-record-per-capability): where it is enforced, what a denied member experiences, what is recorded | "Allowed for R1, R2" without a denial and an audit answer is half a permission |
| A row in [§5](#5-role-based-navigation), and a stated landing page for each role that cannot open it | No role is left facing a refusal with no way on |
| Labels fixed in [§8](#8-labeling-conventions) before any page uses them, including every state it introduces with its severity and its unknown-value rule ([§7.7](#77-unknown-values-and-change-policy)) | One word per meaning |
| Opaque IDs only in its URLs, a schema in `lib/validations/` for every parameter with type, range, maximum and default, and the invalid-input behaviour of [§11.2](#112-validation) | The URL stays shareable and never becomes a leak |
| An answer for unknown, other-workspace, forbidden and gone on each dynamic segment ([§15.1](#151-the-exact-response-per-situation)), with its own `not-found` | Fallbacks are designed, not inherited by accident |
| An ownership parent for each detail page ([§13](#13-breadcrumb-strategy)) and cross-links that obey [§9](#9-cross-linking) | The new entity is reachable from the entities it relates to, and only by those permitted |
| A decision on whether it is a search scope, what is matched and what is excluded for privacy ([§10](#10-search-hierarchy)) | Search is otherwise the way around a permission |
| A row in the index/noindex table; signed-in areas are `noindex` without exception ([§12](#12-seo-hierarchy)) | — |
| For a regulated or partner-dependent capability: a server-read switch that matches the backend, P34 while it is off, and no mention in navigation, search, help or marketing until it is on ([§14](#14-empty-routes)) | No promise the product cannot keep (principle 4) |

Adding an area never renames, moves or removes an existing route. A route that must change keeps its previous URL as a permanent redirect for as long as shared links, bookmarks and exported files that cite it may exist; for links inside statements, exports and audit records that is indefinitely.

## Changes in this version

- **Retained:** both signed-in areas, every navigation item, sitemap, page index P01–P35, role navigation, capability matrix, enforcement layers, taxonomy, labels, cross-links, search and filter hierarchy (including the filter schema), SEO, breadcrumbs, empty and fallback routes, protected prefixes, expansion strategy.
- **Changed:** section and contract names updated to 2.0.0; "sidebar", "top bar", "left to right", "focal", group-label styling and the phone navigation pattern rewritten as behaviour; the state "Tone" column renamed "Severity" with non-visual values (positive, attention, problem, information, neutral); the figure typography rule and theme colour metadata dropped as visual.
- **Changed (2026-10-02, job-based names — Critical Rules › No Visual Prescription):** section names that named a container or control now name the job; IDs, behaviour, scope and status are unchanged and nothing was removed. S03 Page title & actions → Page identity & actions; S30 Statement list → Statement downloads; S31 Export builder → Export request; S40 Invite member form → Member invitation. In this file, the headings of §2.1 and §2.3 say "route group" where they said "shell". The full record is the [Phase 5 name table](phase-5-section-blueprints.md#names-in-this-version).
- **Added:** §2.5 Public site navigation (S55); note on P01's built location below.
- **Self-audit (tightened seed: structure and reachability only):** §4 Content hierarchy rewritten from field and component inventories (C40, C41, C42, C51, "Account column", "filter chips", "C21 Dialog") to primary information plus sections by priority; navigation notes ("above all groups", "badge", "sub-tabs inside the page header", "tabs in S03"), "shell" wording, "marketing header", "overlay", "view chip", toolbar order, "on hover", "rows", "hidden button" and breadcrumb placement rewritten as structure or behaviour. Headings kept unchanged so links resolve (two still say "shell"). No page, route, role rule, flow or decision removed.

- **2.1.0 — enterprise audit and reconciliation (2026-10-01):** §2.1, §5, §6.3, §6.4, §7.7, §8.3, §8.4, §9, §10.1, §11, §12–§17 deepened and IA8–IA13 added, with nothing removed and no ID or heading changed; then reconciled to the canonical decisions, with Phase 1 BR19 as the authority for every limit. Values aligned: search debounce 300 ms, 8 Recent entries, `next` 2,048 characters, ledger query 2–100 characters, ledger range 731 days, exact counts to 10,000, reveal re-mask 30 s, read and write timeouts 15 s and 30 s. Behaviour settled: a page-level denial is the not-permitted state C32, not C33 (§6.2); reveal belongs to owner, finance and accountant only; R3 and R4 get the not-permitted state for alert rules; writes are never retried, replayed or queued. The §11.2 schema sample now enforces its own §11.1 table. Open questions carry OD11, OD12, OD14 and OD15. Residual decisions then applied: §11 carries the full parameter set with `direction`, `category` and `attachment` and the unbounded-query rule; export jobs, support threads and alert rules are scoped per member as §6 states; audit readership and the required failure reference are stated.

**Note on P01 (2.0.0).** The built home page lives at `app/page.tsx` (no `(marketing)` group yet) and has its own navigation (S55) and legal & support links (S07). Moving it into the `(marketing)` group is FD04 in [Phase 8](phase-8-implementation-roadmap.md); the URL `/` does not change.

## Traceability

**Consumes (upstream):**

- Phase 1 — personas R1–R7, product stance (read-only v1), BR19 (the limits, expiry and retention table, the authority for every value here), open decisions OD1, OD3, OD5, OD11, OD12, OD14, OD15.
- [Phase 2 — Experience Maps](phase-2-experience-maps.md) — flows F1–F5, X1–X10 and dashboards D1–D7 define which pages must be one step apart ([F1](phase-2-experience-maps.md#f1--check-cash-position), [F2](phase-2-experience-maps.md#f2--review-an-accounts-ledger), [F3](phase-2-experience-maps.md#f3--investigate-a-transaction), [F4](phase-2-experience-maps.md#f4--export-and-reconcile), [X6](phase-2-experience-maps.md#x6--invite-teammate-and-manage-roles)).
- Host: [`proxy.ts`](../../proxy.ts), [`lib/constants.ts`](../../lib/constants.ts), [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md).

**Consumed by (downstream):**

- [Phase 4 — Page Blueprints](phase-4-page-blueprints.md) — routes, groups, content order, breadcrumbs, empty and fallback behaviour per page.
- Phase 5 onward — sections read the filter schema ([§11](#11-filtering-hierarchy)) and taxonomy ([§7](#7-content-taxonomy)); components C29, C35, C36, C38, C40, C47, C59 implement the labeling, search and permission rules; the implementation plan takes the protected-prefix requirement ([§16](#16-protected-prefixes)); QA checks the role table ([§5](#5-role-based-navigation)) and capability matrix ([§6](#6-permissions)).

## Assumptions

References Phase 1 assumptions A1–A10; items marked IA are introduced by this phase and need confirmation.

- A2 — money movement is outside v1; Payments is hidden and its routes render P34 until enabled.
- A4 — members can belong to several workspaces; the role column in [§5](#5-role-based-navigation) is per workspace.
- A6 — single locale; all formatting through `Intl`.
- A9 — R5–R7 share backend `ADMIN`; the `(admin)` layout can only distinguish them once finer platform roles exist. Until then every staff member sees the full admin navigation, which is a known over-exposure to close with the backend role model.
- IA1 — account types (`operating`, `savings`), transaction types ([§7.3](#73-transaction-types)) and the category list ([§7.4](#74-categories)) are proposals pending the banking data source (OD5).
- IA2 — owner, finance and accountant may reveal full account numbers after step-up (reconciliation needs them); viewers and every internal role (R5–R7) never may. The spine does not state this capability.
- IA3 — viewers may create personal saved views (P13 is open to R1–R4) but may not annotate.
- IA4 — proposed constant names not yet in the spine: `TRANSACTION_TYPES`, `TRANSACTION_STATUSES`, `LEDGER_QUERY_MIN_LENGTH` (2), `LEDGER_QUERY_MAX_LENGTH` (100), `LEDGER_MAX_RANGE_DAYS` (731), `MS_PER_DAY`, `LEDGER_ACCOUNT_FILTER_MAX` (50), `LEDGER_CATEGORY_FILTER_MAX` (20), `TRANSACTION_CATEGORIES`, `TRANSACTION_DIRECTIONS` (`in`, `out`), `SEARCH_TIMEOUT_MS` (5 s), `OPAQUE_ID_PATTERN`, `MINOR_UNITS_PATTERN`, a money-movement switch, and metadata constants; the filter schema file lives in `lib/validations/` (file name set in Phase 5).
- IA5 — workspace stays out of the URL in v1; flagged as expensive to reverse.
- IA6 — P05 and P06 are `noindex` although they are auth pages; P02–P04 are indexable.
- IA7 — support (R5) sees workspace and user records through S53 but not ledger contents; whether support may view transactions is an open question for the maintainer.
- IA8 — thresholds stated by this phase as product decisions, each a named constant the maintainer can change (authority: Phase 1 BR19, which wins wherever a value here differs; constant names are owned by Phase 7 §10): unread counts up to 60 seconds old and capped at "99+"; workspace list searchable beyond 10 entries; a changed role visible within one navigation or 60 seconds; invitation validity 7 days; a balance labelled possibly out of date after 15 minutes; search debounce 300 ms (`SEARCH_DEBOUNCE_MS`), ledger query 2–100 characters, 5 results per scope, backend search time limit 5 seconds (`SEARCH_TIMEOUT_MS`), whole-word-prefix matching on the ledger, 8 Recent entries cleared on sign-out; ledger range at most 731 days when both bounds are given (`LEDGER_MAX_RANGE_DAYS`), unbounded cursor paging otherwise; `category` filter at most 20 values (`LEDGER_CATEGORY_FILTER_MAX`); alert rules at most 20 per member (`ALERT_RULE_LIMIT`); exact counts up to 10,000, then "10,000+"; a revealed account number re-masked after 30 s; `account` filter at most 50 IDs (`LEDGER_ACCOUNT_FILTER_MAX`); IDs 1–64 characters (`OPAQUE_ID_PATTERN`); amounts at most 15 digits of minor units (`MINOR_UNITS_PATTERN`); URL at most 2,000 characters; `next` at most 2,048 characters; read timeout 15 s and write timeout 30 s; reads retried automatically at most twice, writes never. Owner: maintainer; the session-related ones are bound by OD2 and the freshness ones by OD5.
- IA9 — open, owner: maintainer; recorded as Phase 1 OD12. The backend audit record ([§6.3](#63-enforcement-point-denial-and-audit-record-per-capability)) has no reader page among P01–P35. Assumed until answered: R7 reads all records and R6 reads case history through backend tooling; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 but may ask support for the entries about their own workspace. Whether owners should (a common expectation of a business banking console) is a scope question, not a structural one: it would be a new Settings sub-page under the rule of [§17](#17-future-expansion-strategy).
- IA10 — open, owner: maintainer; recorded as Phase 1 OD14. `q` is member-typed free text in the URL and `P19 → P11` writes a counterparty's name into it, which sits against Phase 1 DP11 ("nothing sensitive in URLs except opaque IDs"). Assumed until answered: `q` is the single recorded exception, kept out of titles, analytics and logs ([§11.1](#111-url-parameters-p10-p11-p14-p19)). The alternative — a `counterparty` parameter carrying the opaque ID for that link — removes the name from the URL at the cost of one more filter parameter.
- IA11 — product decisions introduced by this phase, owner: maintainer: an owner demoting or removing another owner requires step-up; non-owners can read the verification case status but not its contents; a link to an entity in another of the reader's workspaces offers the switch and never switches by itself; links inside member-written notes and messages are inert text; staff reads of customer records are audited; a removed member's personal saved views are deleted while their annotations stay attributed.
- IA12 — open, owner: maintainer; the invitee's journey is one of those recorded in Phase 1 OD15. Invitation acceptance (X6) has no route in the sitemap. Assumed until answered: the invitation link opens P03 for a new person and P02 for an existing user, carrying a single-use token that is removed from the address once read; no page is added.
- IA13 — the examples in [§8](#8-labeling-conventions) use "$" and "Sep 26, 2026" while `lib/constants.ts` sets `DEFAULT_LOCALE = "en-GB"` and `DEFAULT_CURRENCY = "GBP"`. The examples are illustrative; the real output follows the constants, and both wait on OD1.
