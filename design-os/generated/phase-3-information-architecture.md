# Ledgerline Design OS — Phase 3: Information Architecture

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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

### 2.1 Primary navigation — `(app)` shell (S01 Primary navigation)

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

**Depth limit.** Primary navigation is two levels deep at most (group → item). Anything deeper — Insights sub-pages, Settings sub-pages, saved views, flagged — is reached from its sibling pages (C23, through S03 Page title & actions) or by in-page links. Why: nested disclosure hides the thing a member came for; keeping sibling pages one step apart does not grow the navigation.

**Transactions sub-navigation** (siblings P11, P13, P14, each reachable from the others): All (`/transactions`) · Saved views (`/transactions/views`) · Flagged (`/transactions/flagged`).

**Settings sub-navigation** (siblings, each reachable from the others): Workspace (`/settings`) · Team (`/settings/team`) · Profile & security (`/settings/profile`). Sub-pages a role cannot open are not offered.

**Onboarding.** P07 `/onboarding` is not a navigation item. While the workspace's verification case is not `approved`, S13 Verification status notice on P08 leads to P07. Why: onboarding is a task with an end, not a place members return to.

### 2.2 Global utilities — S02

Reachable from every `(app)` and `(admin)` page: global search (C38 CommandPalette, ⌘K / Ctrl+K, C28) · notifications (C39) · the member's own account — Profile & security, Help, Sign out (C37) · the breadcrumb trail on detail pages (C29, [§13](#13-breadcrumb-strategy)). How they appear is decided at build.

### 2.3 Admin navigation — `(admin)` shell

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

P17: S30 Statement list, grouped by account, newest period first. P18: S31 Export builder and S32 Export jobs. Flow: [F4](phase-2-experience-maps.md#f4--export-and-reconcile).

### P07 — Onboarding & verification

Sections: S09 Verification progress, S10 Business details, S11 Beneficial owners, S12 Document upload, S13 status. The member works on one step at a time; completed steps stay editable until submission.

### P23 — Team

Sections: S39 Team members, S40 Invite member form (C21), S41 Role permissions reference.

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
- Settings resolves to the first permitted sub-page: R1 → `/settings`, R2 → `/settings` (alert rules section only), R3 and R4 → `/settings/profile`.

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

The matrix is static product config in `lib/data/`, rendered verbatim by S41 Role permissions reference and read by C59 PermissionGate. Why: the table members read on P23 and the rules the UI applies are the same object, so they cannot drift. The backend holds its own copy of the rules; a disagreement is a bug on whichever side differs from the published contract.

### 6.2 How permissions are enforced

| Layer | Checks | On failure | Authority |
|---|---|---|---|
| `proxy.ts` | A valid session cookie exists for a protected prefix ([§16](#16-protected-prefixes)) | Redirect to `/auth/login?next=<path>`, drop an invalid cookie | Authentication only |
| Server layout `app/(app)/layout.tsx` | Session user is a member of the current workspace; role loaded into C63 WorkspaceProvider | Redirect to `/onboarding` when there is no workspace yet | Convenience |
| Server layout `app/(admin)/layout.tsx` | Session role is a platform role (today `ADMIN`, A9) | Render P34 — the admin area does not reveal it exists | Convenience |
| Page / section | Capability for this page from the matrix | C33 ErrorState "You don't have access to <page label>" within the group's layout | Convenience |
| C59 PermissionGate | Capability for a control (Annotate, Invite, Reveal) | The control is not offered; the value stays readable | Convenience |
| Backend | Every request, every field | 401 → X4 re-auth; 403 → C33 ErrorState; 404 for resources outside the workspace | **Final** |

**The UI is never the authority.** Withholding a control protects nothing; a crafted request reaches the backend regardless. Every layer above the backend exists to keep members from walking into refusals, and every one of them may be wrong without exposing data. Why it is written this way: if a member's role is lowered while their tab is open, the next request fails loudly with 403 and the UI refreshes the role — the member sees a clear refusal instead of a page that pretends to work.

Proxy scope stays narrow: the proxy verifies the token and nothing else. It does not read roles or memberships because it runs on every request, including assets matched by `config.matcher`, and a database call there would slow every page for every member.

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
| Export | Workspace | export ID | P18 (row) |
| Saved view | Member | saved view ID (nanoid) | P13 (row) |
| Notification | Member | notification ID | P20 (row) |
| Message thread | Workspace | thread ID | P21 |
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
| Account | `active`, `frozen`, `closed`, `pending_verification` |
| Verification case | `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` |
| Export job | `queued`, `running`, `ready`, `failed`, `expired` |

Enums live in `lib/constants.ts` as `as const` tuples so Zod (`z.enum`) and labels derive from one list.

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

### 8.4 Money, sign and date formats

- Amounts: `Intl.NumberFormat` with `style: "currency"` and the transaction's ISO 4217 code, from integer minor units held as strings (C40 Amount). Never a float, never client arithmetic on floats.
- Sign: credits carry an explicit plus ("+$1,250.00"); debits a minus ("−$1,250.00"). Ordinary debits carry no problem severity; only `returned` and `failed` do. Severity is always also given in words.
- Numbers, counts and references go through C27 Number display; amounts through C40 Amount.
- Dates: stored and sent as `yyyy-MM-dd` (`DATE_VALUE_FORMAT`); shown as "Sep 26, 2026" via `Intl.DateTimeFormat`. Posting dates are calendar dates and are never shifted by the viewer's time zone. Timestamps (notifications, timeline events) show local time with the zone abbreviation available (never hover-only).
- Account numbers: "Operating ••4821". Full number only after step-up.

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

## 11. Filtering hierarchy

### 11.1 URL parameters (P10, P11, P14, P19)

| Param | Meaning | Format | Default when absent |
|---|---|---|---|
| `from` | Earliest date, inclusive | `yyyy-MM-dd` | No lower bound |
| `to` | Latest date, inclusive; must be ≥ `from` | `yyyy-MM-dd` | No upper bound |
| `type` | Transaction types | comma list of [§7.3](#73-transaction-types) values | All types |
| `status` | Transaction statuses | comma list of [§7.6](#76-statuses-spine-2) values | All statuses |
| `min` | Smallest absolute amount | integer minor units, digits only | None |
| `max` | Largest absolute amount; must be ≥ `min` | integer minor units, digits only | None |
| `q` | Free text over counterparty, description, reference, note | trimmed, 1–100 characters | None |
| `account` | Accounts to include (P11, P14 only; P10 takes it from the path) | comma list of account IDs | All permitted accounts |
| `flagged` | Only flagged transactions | `true` | All (P14 implies `true`) |
| `view` | Saved view applied | saved view ID | None |

Dates filter on posting date for posted rows and on initiation date for pending rows. `min`/`max` are minor units so the URL never contains a decimal separator that depends on locale; C47 Active filter gives them formatted ("≥ $500.00"). The cursor for "load more" is not a URL parameter. Why: a shared link should open at the start of the result, not mid-scroll.

Hierarchy: `view` expands into the other params on apply; if a member then changes a filter, the applied view is marked "Edited" and the URL keeps both `view` and the changed params. Filter priority (for the build, not placement): date range (C48) → search → status → type → amount → account → flagged.

### 11.2 Validation

The schema lives in `lib/validations/` and composes over the generated transaction query schema once the backend publishes it (`.pick`, `.extend`). Enum tuples come from constants.

```ts
import { z } from "zod";
import {
    LEDGER_QUERY_MAX_LENGTH,
    TRANSACTION_STATUSES,
    TRANSACTION_TYPES,
} from "@/lib/constants";

const csvOf = <T extends z.ZodType>(item: T) =>
    z
        .string()
        .transform((raw) => raw.split(","))
        .pipe(z.array(item).min(1));

const minorUnits = z.string().regex(/^\d{1,15}$/);

const byMagnitude = (value: string) => value.padStart(15, "0");

export const ledgerFiltersSchema = z
    .object({
        from: z.iso.date().optional(),
        to: z.iso.date().optional(),
        type: csvOf(z.enum(TRANSACTION_TYPES)).optional(),
        status: csvOf(z.enum(TRANSACTION_STATUSES)).optional(),
        min: minorUnits.optional(),
        max: minorUnits.optional(),
        q: z.string().trim().min(1).max(LEDGER_QUERY_MAX_LENGTH).optional(),
        account: csvOf(z.string().min(1)).optional(),
        flagged: z.literal("true").optional(),
        view: z.string().min(1).optional(),
    })
    .refine((f) => !f.from || !f.to || f.from <= f.to, { path: ["to"] })
    .refine(
        (f) => !f.min || !f.max || byMagnitude(f.min) <= byMagnitude(f.max),
        { path: ["max"] },
    );

export type LedgerFilters = z.infer<typeof ledgerFiltersSchema>;
```

Invalid input is never silently obeyed and never crashes the page: parameters are validated key by key, invalid keys are dropped, and S21 shows a C12 Status label notice ("1 filter in this link was ignored"). Why: a member who pasted a broken link should see that part of it did not apply, instead of a result that looks complete.

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

## 13. Breadcrumb strategy

Breadcrumb trails (C29, part of S03 Page title & actions) exist **only on detail pages**. Top-level pages have none. Breadcrumbs follow **ownership, not history**:

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

## 14. Empty routes

Segments that exist in a URL but have no page of their own:

| URL | Behaviour | Why |
|---|---|---|
| `/insights` | Redirect to `/insights/compare` for roles that may open P15; P34 otherwise | The group has no overview worth a page |
| `/auth` | Redirect to `/auth/login` | — |
| `/counterparties` | Redirect to `/transactions` | Counterparties are reached through transactions; a bare list duplicates P11 |
| `/payments`, `/payments/transfer` while money movement is disabled | Render P34 Not found; no nav entry | Money movement is outside v1 (Phase 1 BR7, OD3). A "coming soon" page would promise a regulated capability that depends on a licence nobody has granted; a 404 promises nothing |
| `/payments` while enabled | P27 Payees & bill pay | — |

The money-movement switch is read on the server and must match the backend; the UI switch alone never enables a transfer.

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
| Offline | S54 offline variant | Last data stays readable, marked stale ([X10](phase-2-experience-maps.md#x10--error-offline-and-outage-recovery)) |
| Intercepted transaction route on hard refresh or direct link | `@drawer/(.)transactions/[transactionId]` intercepts only client navigation; a full load of `/transactions/[transactionId]` renders P12 as a full page; `@drawer/default.tsx` renders nothing | The shared link always works, with or without the list behind it |

A resource that exists in another workspace returns 404 from the backend, not 403. Why: a 403 would confirm to a member that an ID is real in a business they cannot see.

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

## 17. Future expansion strategy

| Expansion | Where it lands | Structural cost now |
|---|---|---|
| Multi-entity (one member, several businesses) | Already modelled: workspace switcher C36; IDs are globally unique, so a shared link from another workspace switches context after a membership check | Workspace is **not** in the URL in v1. Moving to `/w/[workspace]/…` later breaks every shared link and bookmark — decide before launch (expensive to reverse) |
| Money movement (transfers, bill pay) | `/payments`, `/payments/transfer` (P26, P27), Payments nav item under Money | None; routes and permissions reserved above |
| Cards | New Money item `/cards`, `card` transaction type already in [§7.3](#73-transaction-types) | One nav entry and one protected prefix |
| Integrations (accounting software sync) | New Settings sub-page `/settings/integrations` | One sub-page; exports (P18) remain the manual path |
| Custom categories | Workspace-level list managed in Settings › Workspace | Category becomes an ID instead of a constant value; migration on stored annotations |
| Locales | No locale segment in `(app)` URLs; locale is a member preference read by `Intl` (A6). Marketing and help may add a `[locale]` segment | Help slugs must stay stable per locale |
| More platform roles | Admin navigation filtered by the same capability matrix | Backend role model (A9) |

Rule for any addition: a new top-level section needs a nav entry in `lib/data/`, a route constant, a protected prefix, a row in the capability matrix and a row in [§5](#5-role-based-navigation). Missing any one is visible — a 404, a hidden page, or a gate that refuses — rather than a quiet leak.

## Changes in this version

- **Retained:** both signed-in areas, every navigation item, sitemap, page index P01–P35, role navigation, capability matrix, enforcement layers, taxonomy, labels, cross-links, search and filter hierarchy (including the filter schema), SEO, breadcrumbs, empty and fallback routes, protected prefixes, expansion strategy.
- **Changed:** section and contract names updated to 2.0.0; "sidebar", "top bar", "left to right", "focal", group-label styling and the phone navigation pattern rewritten as behaviour; the state "Tone" column renamed "Severity" with non-visual values (positive, attention, problem, information, neutral); the figure typography rule and theme colour metadata dropped as visual.
- **Added:** §2.5 Public site navigation (S55); note on P01's built location below.
- **Self-audit (tightened seed: structure and reachability only):** §4 Content hierarchy rewritten from field and component inventories (C40, C41, C42, C51, "Account column", "filter chips", "C21 Dialog") to primary information plus sections by priority; navigation notes ("above all groups", "badge", "sub-tabs inside the page header", "tabs in S03"), "shell" wording, "marketing header", "overlay", "view chip", toolbar order, "on hover", "rows", "hidden button" and breadcrumb placement rewritten as structure or behaviour. Headings kept unchanged so links resolve (two still say "shell"). No page, route, role rule, flow or decision removed.

**Note on P01 (2.0.0).** The built home page lives at `app/page.tsx` (no `(marketing)` group yet) and has its own navigation (S55) and legal & support links (S07). Moving it into the `(marketing)` group is FD04 in [Phase 8](phase-8-implementation-roadmap.md); the URL `/` does not change.

## Traceability

**Consumes (upstream):**

- Phase 1 — personas R1–R7, product stance (read-only v1), open decisions OD1, OD3, OD5.
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
- IA2 — accountants may reveal full account numbers after step-up (reconciliation needs them); viewers may not. The spine does not state this capability.
- IA3 — viewers may create personal saved views (P13 is open to R1–R4) but may not annotate.
- IA4 — proposed constant names not yet in the spine: `TRANSACTION_TYPES`, `TRANSACTION_STATUSES`, `LEDGER_QUERY_MAX_LENGTH` (100), a money-movement switch, and metadata constants; the filter schema file lives in `lib/validations/` (file name set in Phase 5).
- IA5 — workspace stays out of the URL in v1; flagged as expensive to reverse.
- IA6 — P05 and P06 are `noindex` although they are auth pages; P02–P04 are indexable.
- IA7 — support (R5) sees workspace and user records through S53 but not ledger contents; whether support may view transactions is an open question for the maintainer.
