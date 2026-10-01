# Ledgerline Design OS — Phase 1: Product Vision

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Start here](START_HERE.md) · Next: [Phase 2 — Experience Maps](phase-2-experience-maps.md) · [Index](ARTIFACT_INDEX.md)

## Table of contents

- [Placeholder resolution](#placeholder-resolution)
- [Business vision](#business-vision)
- [Product purpose](#product-purpose)
- [Business goals](#business-goals)
- [Value proposition](#value-proposition)
- [Competitive positioning](#competitive-positioning)
- [Primary personas](#primary-personas)
- [Secondary personas](#secondary-personas)
- [Internal personas](#internal-personas)
- [Public persona](#public-persona)
- [Jobs To Be Done](#jobs-to-be-done)
- [Business rules](#business-rules)
- [Success metrics](#success-metrics)
- [KPIs](#kpis)
- [North Star metric](#north-star-metric)
- [Governance](#governance)
- [Platform constraints](#platform-constraints)
- [Product principles](#product-principles)
- [Implementation philosophy](#implementation-philosophy)
- [Non-goals](#non-goals)
- [Future scalability considerations](#future-scalability-considerations)
- [Open decisions](#open-decisions)
- [Assumptions](#assumptions)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

This document is the single source of truth for why Ledgerline exists, who it serves, what it will and will not do, and which rules every later phase inherits. When a later phase disagrees with this one, this one wins until it is amended. It makes no visual decisions: how anything looks is decided when each page is built, with the owner (seed › Critical Rules › No Visual Prescription).

## Placeholder resolution

| Placeholder | Value | Evidence |
|---|---|---|
| PRODUCT_NAME | Ledgerline | `package.json` name `ledgerline-frontend`; design OS 1.0.0; landing page brand data `lib/data/ledgerline/brand.ts` |
| DOMAIN | Business banking (fintech): an operating-account console for small and mid-sized businesses | design OS 1.0.0; folder `fintech/` |
| REFERENCE_PRODUCTS | Mercury, Brex, Ramp, Stripe Dashboard, Modern Treasury — benchmarks for features and flows only | design OS 1.0.0 (the 1.0.0 "feel" references were dropped, see [Changes](#changes-in-this-version)) |
| PERSONAS | R1–R8 (R8 added in this version) | [Personas](#primary-personas) |
| CORE_ENTITY / PLURAL | Transaction / Transactions (container entity: Account) | design OS 1.0.0 |
| PRIMARY_FLOWS | F1–F7 | [Phase 2](phase-2-experience-maps.md#primary-flows) |
| SUPPORTING_FLOWS | X1–X11 (X11 added) | [Phase 2](phase-2-experience-maps.md#supporting-flows) |
| ROLE_DASHBOARDS | D1–D7 | [Phase 2](phase-2-experience-maps.md#role-dashboards) |
| ROLE | Team member (workspace member); profile page P24 Team member profile | design OS 1.0.0 |
| DOMAIN_TOOL | Runway calculator (P16) | design OS 1.0.0 |
| DOMAIN_TRANSACTION | Transfer (P26), outside the v1 read-only scope (Deferred) | design OS 1.0.0; contested by [OD9](#open-decisions) |
| DOMAIN_SPECIFIC_LIBS | Table + virtualization (LD2). Money uses native `Intl.NumberFormat`, no library | design OS 1.0.0 |
| SCALE_TARGET | 50,000 business workspaces · 500 million transactions · single-account ledgers up to 5 million rows · 200 concurrent members per workspace (target, not a claim) | design OS 1.0.0 |
| COMPONENT_COUNT | 68 interaction contracts (C01–C68) | [Phase 6](phase-6-interaction-contracts.md) |
| SECTION_COUNT | 64 (S01–S64) | [Phase 5](phase-5-section-blueprints.md) |
| PAGE_COUNT | 35 (P01–P35) | [Phase 4](phase-4-page-blueprints.md) |
| TIMELINE_WEEKS | 16 (8 two-week sprints) | [Phase 8](phase-8-implementation-roadmap.md) |
| QA_ITEM_COUNT | 262 numbered items (Q-001–Q-262): 239 active, 23 retired as visual | [Phase 9](phase-9-qa-checklist.md) |
| OUTPUT_DIR | `design-os/generated/` | seed default |

## Business vision

Ledgerline gives a business one calm, exact place to see its money. A founder opening it on a Monday knows, within seconds, how much cash the business has across every account, what moved since Friday, and whether anything needs attention. A finance lead closes the month without asking the bank for a statement, without re-keying rows into a spreadsheet, and without guessing which transactions an accountant has already looked at.

The long-term vision is an operating-account console that finance teams trust as the record they reconcile against. Trust is the product: every figure is a value the backend holds, formatted exactly, never estimated, never rounded silently, never invented.

Why: small and mid-sized businesses often run finance with a part-time accountant and a founder who checks balances between meetings. A wrong or unclear number is paid for in missed payroll, late filings or a failed audit. A console that is fast, exact and legible reduces that cost before it adds any money-movement feature.

## Product purpose

Ledgerline v1 is a **read-only business banking console**. It lets a workspace (one business) and its members:

- see balances and today's movement across all accounts (F1);
- read, filter and search account ledgers at any size (F2, F3);
- annotate transactions with notes, categories, flags and attachments, and share a link to one (F3);
- download monthly statements and export transactions for accounting (F4);
- complete business verification (KYB) and owner verification (KYC) (F5);
- invite teammates with scoped roles (X6), receive alerts (X7) and message support securely (X9).

Money movement — Transfer (F6) and Pay a payee / bill (F7) — is fully specified so the system has room for it, but it is outside the v1 read-only scope (Deferred, OD3).

**Contested in this version.** The marketing home page built in the working tree presents a wider product: payments with two-person approvals, cards with spending controls, a treasury forecast with interest on idle cash, multi-currency accounts, pricing plans and sample balances. That is recorded as open decision [OD9](#open-decisions), not resolved here. Until the maintainer answers OD9, the purpose above is the specification.

## Business goals

| ID | Goal | Why it matters | Measured by |
|---|---|---|---|
| BG1 | Become the place a workspace checks cash first | Habitual use is the precondition for every later feature | North Star, K1, K2 |
| BG2 | Shorten month-end reconciliation for finance leads and accountants | The pain is sharpest here and time is measurable | K4, K5 |
| BG3 | Onboard and verify businesses without support tickets | Verification friction is the largest drop-off risk in business banking | K7, K8 |
| BG4 | Earn trust through exactness and security | A single wrong figure costs more trust than any feature earns | K10, K11, K12 |
| BG5 | Let a small internal team (R5–R7) support many workspaces | Operating cost per workspace must stay flat towards SCALE_TARGET | K13, K14 |
| BG6 | Keep the frontend ready for money movement without shipping it early | OD3 may be answered later; the product must not need a rewrite | P26, P27, S44, S45 stay specified |

## Value proposition

| Persona | Pain today | What Ledgerline gives them |
|---|---|---|
| R1 Account Owner | Logs into several bank portals; balances out of date; cannot tell what changed | One cash position across accounts with today's movement (S14, S15) and a runway estimate (P16) |
| R2 Finance Lead | Month-end means requesting statements, re-keying rows, chasing receipts | Statements on demand (P17), exports by period and account (P18), attachments on the transaction itself (S26) |
| R3 External Accountant | Needs a login to someone else's bank; ends up with over-broad access or emailed PDFs | A scoped `accountant` role: read, annotate, export, no team or settings access |
| R4 Team Viewer | Asks the owner "did the client pay?" by chat | View access to permitted accounts only, with search (P11) |
| R5–R7 Internal | Tools built for engineers, not operations | A support console (P33), compliance queue (P32) and admin overview (P29) held to the same standard as the customer product |
| R8 Prospect | Cannot tell from a bank's site what it actually does | A public page that states truthfully what the product does and how to start (P01) |

Positioning statement: for small and mid-sized businesses whose finance is run by a founder and an accountant, Ledgerline is the operating-account console that shows every balance and transaction exactly and makes month-end a download, not a project.

## Competitive positioning

The reference products are **categories of approach**, used to benchmark features and flows only. No market-size, share or customer figure is stated because none has been measured.

| Approach | Represented by | What it gets right | Where Ledgerline v1 differs |
|---|---|---|---|
| Startup business banking with a strong console | Mercury | Dense, legible account and transaction views; multi-user access | v1 is read-only and positions on reconciliation and exactness rather than account opening and payments |
| Spend management built around cards | Brex, Ramp | Receipt capture, categorisation, approval workflows | v1 has no cards or approvals; annotation (S26) covers the receipt-and-category job (contested by OD9) |
| Payments developer dashboard | Stripe Dashboard | Fast search, drill-down to a single object, shareable object links | Ledgerline adopts drill-down and share-link (F3, C51) for bank transactions |
| Treasury and payment operations | Modern Treasury | Ledger-grade rigour, reconciliation as the core job | Targets businesses without a treasury team (contested by OD9: the built page shows a treasury forecast) |

Honest position: Ledgerline v1 does less than every category leader above. It chooses to do the read, search, annotate and export jobs exactly and quickly, and to leave money movement until a licensed partner and backend module exist (OD3, OD5).

## Primary personas

### R1 — Account Owner

- **Who:** founder or business owner; workspace role `owner`. Legally accountable for the business's accounts and the person the verification case (F5) is about. A workspace always has at least one owner (BR12).
- **Context:** checks cash between other work, on a laptop or a phone, in sessions of a minute or two; often away from the office and on a mobile connection; may hold accounts in more than one currency.
- **Goals:** know the posted and the pending cash position per currency now, and how old that figure is; know whether payroll or a tax payment will clear against what is pending; know if anything was returned or failed; get the business verified; control who sees which accounts.
- **Frustrations:** a balance with no indication of when it was last updated; pending card and transfer items mixed into the posted balance; asking the accountant what a transaction was; verification forms that lose progress or reject a document without saying why.
- **Permissions:** everything in the workspace columns of the [permission matrix](#permission-matrix), including team management, workspace settings, verification and revealing full account numbers after step-up (BR5). Denied only the platform capabilities of R5–R7; an attempt to reach one is treated as BR13 describes.
- **Primary flows:** F1, F5, X6. **Dashboard:** D1.

### R2 — Finance Lead

- **Who:** controller or head of finance operations; workspace role `finance`.
- **Context:** sessions of several hours in ledgers during the first working days after month-end; keyboard-heavy; several tabs open on different accounts at once; works against an accounting system's cut-off dates.
- **Goals:** reconcile every account each month so the period's opening balance, movements and closing balance agree with the statement to the minor unit; find and explain any transaction quickly; tell a `returned` or `reversed` item from its original; configure alerts.
- **Frustrations:** exports whose totals differ from the statement for the same period; pagination that loses place in a long ledger; a session that ends mid-note and discards the note; a period that includes or excludes a transaction because of a time-zone shift at the month boundary (BR14).
- **Permissions:** all accounts' data, annotations, exports, statements, alert rules; invite viewer and accountant; reveal full account numbers after step-up (BR5). Denied: inviting an owner or finance lead, changing any member's role, workspace settings and verification — each is the owner's, and the denial names the owner role (BR13).
- **Primary flows:** F2, F3, F4. **Dashboard:** D2.

## Secondary personas

### R3 — External Accountant / Bookkeeper

- **Who:** invited from outside the business; workspace role `accountant`. May belong to many client workspaces (A4).
- **Context:** works for several client businesses in the same week, each with its own period-end and currency; not an employee of any of them, so access must end cleanly when the engagement does.
- **Goals:** pull statements and exports for the period; annotate transactions with categories and questions; be certain which client's books are open before downloading or annotating.
- **Frustrations:** switching between client logins; being given more access than needed; an export downloaded from the wrong client; a re-run export whose rows differ from the earlier one for the same closed period.
- **Permissions:** read all accounts, annotate, exports, statements, reveal full account numbers after step-up (BR5, A13). Denied: alert rules, invitations, team management, workspace settings and verification (BR13). Removal from a workspace takes effect on the member's next request (BR12) and never affects their other workspaces.
- **Primary flows:** F4, F3. **Dashboard:** D3.

### R4 — Team Viewer

- **Who:** employee with view access to permitted accounts; workspace role `viewer`.
- **Context:** sales, operations or customer-service staff answering a customer or supplier while they wait; a few short visits a day.
- **Goals:** confirm an incoming payment arrived and whether it is `pending` or `posted`; look up a transaction by counterparty, amount or reference.
- **Frustrations:** being unable to tell "not arrived" from "arrived in an account I cannot see"; having to ask the owner.
- **Permissions:** read permitted accounts only (an owner chooses which, X6). Denied: annotations, statements, exports, alert rules, invitations, account-number reveal (C42 `canReveal` is false). An account outside the permitted set is indistinguishable from one that does not exist (BR13); totals a viewer sees cover only permitted accounts and say so.
- **Primary flows:** F1 (restricted), F3 (read only). **Dashboard:** D4.

## Internal personas

These operate the platform, not a workspace. Until finer platform roles exist they share the backend `ADMIN` role (A9).

| ID | Persona | Platform role | Can | Cannot | Dashboard |
|---|---|---|---|---|---|
| R5 | Support Agent | `support` | Read-only lookup of workspaces and users; read and reply to messages | Change user records; decide verification | D5 (P33) |
| R6 | Compliance Analyst | `compliance` | Read verification cases; request info; approve or reject | Change user records beyond case decisions | D6 (P32) |
| R7 | Platform Admin | `admin` | Users CRUD, stats, every internal surface | Move customer money (no such capability exists) | D7 (P29) |

Every internal lookup, message reply, case decision and user-record change is recorded by the backend with the acting internal user (BR16). No internal persona can reveal a customer's full account number, annotate a customer's transactions or act as a workspace member (A13). While the three share `ADMIN` (A9) the "Cannot" column is enforced only by which internal pages offer the capability, not by the backend; that gap is closed only by finer platform roles and is not presented to anyone as a control.

## Public persona

### R8 — Prospect (added in 2.0.0)

- **Who:** a founder or finance lead evaluating Ledgerline on the public site; not signed in.
- **Goals:** understand what the product does, whether it fits, what it costs, and how to start.
- **Frustrations:** claims that turn out to be untrue; forms that ask for too much.
- **Permissions:** public pages only (P01, P02–P06, P28).
- **Flows:** X2 Register, X11 Get-started enquiry. Why added: the built home page is written for this reader and captures their email (S64); 1.0.0 referred to "qualified business visitors" without naming them.

## Jobs To Be Done

| Persona | Job |
|---|---|
| R1 | When I open my laptop on Monday, I want to see cash per currency, split into what has posted and what is still pending, with what changed since Friday and when the figures were last updated, so I can decide whether anything needs my attention today. |
| R1 | When payroll or a tax payment is due this week, I want to see whether posted cash covers it without counting pending credits that could still be returned, so I do not commit money that has not settled. |
| R1 | When I plan a hire, I want to see how many months of runway current cash gives at recent burn, with the period the burn was taken from stated, so I can decide with a number rather than a feeling. |
| R1 | When the bank needs to verify my business, I want to submit details and documents once, leave and return without losing them, and see exactly what is still missing, so I can get approved without a support thread. |
| R1 | When my accountant joins, I want to give them access to data and exports but not to team settings, and to end that access the day the engagement ends, so I can share the books without sharing control. |
| R2 | When I close the month, I want every account's statement and an export of the same period whose closing balance equals the statement's to the minor unit, so I can reconcile in the accounting system without re-keying. |
| R2 | When a transaction looks wrong, I want to jump straight to it and see its full lifecycle (pending, posted, returned or reversed, with the linked original) and counterparty history, so I can explain or escalate it in minutes. |
| R2 | When a large debit posts or a payment is returned, I want an alert that names the account, amount and currency, so I can react before the day's cut-off. |
| R2 | When my session ends while I am part-way through a note, I want to sign in again and find the note as I left it, so a security rule does not cost me work. |
| R3 | When I start a client's month-end, I want to switch into their workspace, be shown unmistakably which client I am in, and download the period's exports, so I can work in my own tools without mixing clients. |
| R3 | When I cannot identify a transaction, I want to flag it with a question on the transaction itself, so I can get an answer without email and the answer stays with the entry. |
| R4 | When a customer says they paid, I want to search incoming transactions by name, amount or reference and see whether the credit is pending or posted, so I can confirm it without asking the owner. |
| R5 | When a customer writes in quoting an error reference, I want to look up their workspace, user state and that reference read-only, so I can answer accurately without touching their data. |
| R6 | When a verification case is submitted, I want all details and documents in one review, so I can approve, reject or request information with a recorded reason that the owner can read and act on. |
| R7 | When I review platform health, I want user totals and growth over time, so I can spot problems in signup or activation. |
| R8 | When I am comparing business banks, I want to read in a minute what Ledgerline does and does not do — including that v1 does not move money — so I can decide whether to start. |

## Business rules

These rules bind every phase. A design that breaks one is incorrect, not a variant.

### Money

- **BR1** Amounts arrive from the backend as integer **minor units in a string** (optional leading `-`, digits only) plus an ISO 4217 currency code. They are never parsed to floats and the client does no float arithmetic on money. Where the client must compare or combine two amounts of the same currency it uses `BigInt` on the minor-unit strings; every total a member reads is computed by the backend. An amount that is missing, malformed or has no currency code is never shown as zero: the value is reported as unavailable and the failure is reported (BR20). Negative zero is shown as zero without a sign.
- **BR2** Amounts are formatted with native `Intl.NumberFormat` through one formatter (C40 Amount). No money library. The number of decimal places comes from the currency (0, 2 or 3), never from a constant; every minor unit is shown, so no amount is rounded, abbreviated or truncated wherever it is stated as a figure a member could reconcile against. A chart or summary that shortens a figure also gives the exact figure in text.
- **BR3** Sign convention: credit positive, debit negative, always shown with the sign in text. Ordinary debits are never presented as a problem; only `returned` and `failed` transactions carry problem severity. Why: flagging every debit as a problem trains users to ignore real problems. (How severity is shown is decided at build.) A `returned` or `reversed` transaction is a separate entry linked to its original; the original is never edited or hidden, and the two are reachable from each other. A `failed` transaction never affects a balance.
- **BR4** Every number, count, reference and date goes through one formatter per kind (C27, C40, date formatter), so the same value never appears two ways. (1.0.0's typographic rule for figures was visual and is dropped.) The locale is one constant (`DEFAULT_LOCALE`, A6); the locale-dependent formats are decimal and grouping separators, currency symbol or code and its position, negative-number form, date order, month and weekday names, week start, relative-time wording and list and plural forms — none is assembled by string concatenation.
- **BR17** (added 2026-10-01) Amounts in different currencies are never added, netted or compared into one figure, and no exchange rate is applied by the client. A total across accounts is one figure per currency. A total always states whether it includes `pending` transactions; `pending` amounts are never merged into a posted balance. A member whose role limits them to some accounts (R4) is told that a total covers only the accounts they can see.

### Time

- **BR14** (added 2026-10-01) A transaction's posting date and a statement period are calendar dates supplied by the backend and are never shifted by the viewer's time zone: a transaction posted on the last day of a month belongs to that month for every member everywhere. Instants (when a note was written, when an export became ready, when a member signed in) are shown in the workspace time zone (the IANA zone in workspace settings), not the device's, so a globally spread team reads the same clock; the zone is stated wherever a time of day is given. "Today", "this month", every preset period and the boundaries of a statement period are evaluated in the workspace time zone, which is UTC when the workspace has not set one. A day that is 23 or 25 hours long at a daylight-saving change is still one day; periods are built from calendar dates, never from adding 24-hour intervals. Internal personas (R5–R7) read instants in UTC with the zone stated, and every internal (admin) section uses UTC (A14).

### Privacy and security

- **BR5** Account numbers are masked by default (last 4) through C42 MaskedAccountNumber. Full reveal requires step-up re-authentication (X4) and is audit-logged by the backend. Amounts are not masked. Reveal is available to owner, finance and accountant, never to viewer or to any internal persona (A13). A revealed number is fetched on demand, never cached, shown for `REVEAL_TIMEOUT` (30 seconds, A15), with a warning 10 seconds before it ends and the option to extend, and masked again when that time ends, when the window loses focus or when the member moves to another page; one number is revealed at a time. A full account number never appears in a URL, a page title, browser history, a log, an analytics event, an error report, a notification or a share link. URLs carry only opaque identifiers, with the ledger search term `q` as the single recorded exception (OD14); search terms, counterparty names, amounts, email addresses and note text never appear in analytics events or error reports.
- **BR6** Session policy is open (OD2); the recommendation is a 15-minute idle timeout, 12-hour absolute limit and step-up for sensitive reveals. Under the recommendation: the member is warned 2 minutes before the idle limit (`SESSION_WARNING_LEAD`) and can extend without losing their place (the absolute limit cannot be extended); when the session ends, re-authentication happens without leaving the page, and unsaved text, filters and position in a list are preserved in the open tab's memory (never in device storage, BR18); a write interrupted by the end of a session or by a step-up is never replayed automatically — the member re-submits it after re-authenticating, with the same idempotency key (BR18) — and if a different user re-authenticates the drafts are dropped; the end of a session is applied in every open tab; a successful step-up is valid for 5 minutes (`STEP_UP_GRANT_SECONDS`) for the single purpose it was given for; a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant (A16); a two-step challenge is valid for 5 minutes (`CHALLENGE_TTL`); after 5 failed step-up or sign-in attempts (`AUTH_MAX_ATTEMPTS`) within 15 minutes the backend locks further attempts for 15 minutes and the member is told how long remains and how to recover (X5) (A17). Signing out ends the session on the backend, not only in the browser.

### Scope

- **BR7** v1 is read-only for money. Annotations (notes, category, flag, attachments, saved views) are writes and are in scope; money movement is not (OD3; contested by OD9). The complete list of writes a workspace member can make in v1 is: annotations, saved views, alert rules, invitations and role changes, workspace settings, verification details and documents, export requests, support messages and the member's own profile and security settings. None of these changes a balance, a transaction's amount, date, counterparty or state.

### Lifecycle states

| Entity | States |
|---|---|
| Transaction | `pending` → `posted` → (`returned` \| `reversed`); plus `failed` |
| Account | `active`, `frozen`, `closed`, `pending_verification` |
| Verification case | `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` |
| Export job | `queued`, `running`, `ready`, `failed`, `expired` |
| Backend account status (today) | `OPEN`, `FROZEN`, `CLOSED` (mapping to the Account states above is OD11) |
| Backend user role (today) | `ADMIN`, `USER` |
| Backend user account status (today) | `ACTIVE`, `PENDING`, `SUSPENDED` |

- **BR8** Every state above has a named text label from constants (C12 Status label). No state is conveyed only by colour. A state the client does not recognise (the backend added one) is shown with a neutral "unknown status" label and reported (BR20); it is never mapped to the nearest known state. Transitions are made only by the backend; the client never advances a state on its own, including optimistically. `closed` and `frozen` accounts remain readable with their history; `expired` export jobs remain listed so they can be requested again.

### Permission matrix

| Capability | owner (R1) | finance (R2) | accountant (R3) | viewer (R4) |
|---|---|---|---|---|
| View balances and transactions | All accounts | All accounts | All accounts | Permitted accounts only |
| Annotate transactions | ✓ | ✓ | ✓ | — |
| Statements | ✓ | ✓ | ✓ | — |
| Exports | ✓ | ✓ | ✓ | — |
| Alert rules | ✓ | ✓ | — | — |
| Invite members | Any role | Viewer and accountant | — | — |
| Team and roles management | ✓ | — | — | — |
| Workspace settings | ✓ | — | — | — |
| Verification (KYB/KYC) | ✓ | — | — | — |
| Reveal full account number (after step-up, BR5) | ✓ | ✓ | ✓ | — |
| Secure messages to support (X9) | ✓ | ✓ | ✓ | — (self-service help only) |

| Capability | support (R5) | compliance (R6) | admin (R7) |
|---|---|---|---|
| Workspace and user lookup | Read | — | ✓ |
| Messages | Read and reply | — | ✓ |
| Verification cases | — | Read and decide | ✓ |
| Users CRUD and stats | — | — | ✓ |

- **BR9** The matrix lives once in `lib/data/` and is rendered by S41 Role permissions reference and enforced in UI by C59 PermissionGate. The backend is the authority; the UI gate only hides what the backend would refuse. A cell marked "—" means the backend refuses the request whatever the client sends. A role change or removal takes effect on the affected member's next request, without waiting for their session to end.
- **BR13** (added 2026-10-01) What a denied member experiences. A capability their role lacks is not offered to them. Reaching one anyway (a shared link, a typed address, a role changed mid-session) gives a plain statement that their role does not include it and which role does, with a way back to work; it is the not-permitted empty state (C32), never the error state (C33), a blank page, an endless loading state or a generic failure. Alert rules (S35, P22) follow this: R1 and R2 edit them; R3 and R4 get the not-permitted state. An object the member may not know exists — an account outside a viewer's permitted set, a record in another workspace, a customer record for a non-internal user — is answered exactly as an object that does not exist (P34), so its existence is not disclosed. A refusal the UI gate did not predict (the backend refused something the client offered) is reported (BR20) because it means the matrix and the backend disagree.

### Access

- **BR12** (made explicit in 2.0.0; behaviour unchanged from 1.0.0) An owner creates an account by self-service registration (X2, P03) and then verifies the business (F5). Every other workspace member joins only by invitation from an owner or finance lead (X6). There is no open sign-up into an existing workspace. The built home page routes its "Open an account" and "Sign in" actions to an enquiry form instead (OD10). An invitation is addressed to one email address, can be accepted once, carries exactly one role, expires 7 days after it is sent (`INVITE_TTL_DAYS`, A18) and can be revoked or re-sent by anyone entitled to send it, a re-send invalidating the earlier link; an expired, revoked or already-used invitation says which of the three it is and how to get a new one. Inviting an address that is already a member or already has an open invitation does not create a second one. A workspace always keeps at least one owner: the last owner cannot be removed, demoted or leave until another member is made owner. A finance lead can invite only viewer and accountant and cannot change the role of an existing member.

### Data and operations

- **BR15** (added 2026-10-01) Freshness. Every balance and every list of transactions a member reads carries the time the backend last obtained it from the banking source (OD5), and the member can ask for a refresh. Client-side reuse of fetched data is bounded by the `STALE_TIME` tiers (`live`, 15 seconds: balances, pending items and counts; `standard`, 60 seconds: lists and detail; `slow`, 5 minutes: team, settings and rules; `static`, never refetched: product copy and config), and fetched data is dropped from memory 5 minutes after its last use (`GC_TIME_MS`; at once for a revealed account number, BR5). When the source itself is behind — its last successful update is older than 15 minutes for balances (`BALANCE_STALE_AFTER`, A19), or the figure is served from the device's cache after a failure or while offline — the member is told the figures may be out of date and from when; a stale figure is never presented as current, and a figure is never withheld only because it is stale. When data cannot be fetched at all, the last figures already on the member's device stay readable, marked with their age, until the session ends.
- **BR16** (added 2026-10-01) Audit trail. The backend, never the client, records with actor, workspace, time and the object's opaque identifier: sign-in and sign-out, failed sign-in and step-up attempts, account-number reveals, statement and export downloads, export requests, annotation creates, edits and deletes, attachment uploads and removals, invitations, role changes and removals, workspace-setting changes, alert-rule changes, verification submissions and decisions (with reason), and every internal lookup, reply and user-record change. Viewing a balance or a transaction is not recorded. R7 reads the whole record; R6 reads the history of a verification case; R5 reads only the entries tied to a reference a member quoted (BR20); workspace members read none of it in v1 — no workspace page presents the record in this specification — but may ask support (X9) for the entries about their own workspace (A23; who may read the record is OD12, and this is its default); no one can edit or delete an entry. Entries are kept for the retention period in BR19.
- **BR18** (added 2026-10-01) Repeated and conflicting actions. Every write carries a client-generated idempotency key (nanoid) for the attempt, so a repeated click, a retried request or the same form submitted from two tabs has the effect of one; the backend honours a key for 24 hours. Requesting an export identical to one that is `queued` or `running` (same accounts, period and format, same member) returns the existing job. When a member writes against a record someone else has changed since they read it — a category, a flag, a saved view — the write is refused: the member is given the newer content together with their own and chooses what to do; there is no last-write-wins anywhere, nothing is overwritten silently and nothing they typed is discarded. Notes and attachments are append-only and do not conflict. A write is never retried or re-sent automatically, including after a timeout (30 seconds, `MUTATION_TIMEOUT_MS`), a session expiry or a step-up (BR6). A draft interrupted by session expiry, a step-up or a refused write is kept in the open tab's memory only, so the member can re-submit it after re-authenticating in place; it is never written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and it is gone when the tab closes or a different user signs in. After a failure whose outcome is unknown the member is told the outcome is unknown and the current state is re-read first. Writes are refused while the device is offline and are never queued (BR20).
- **BR19** (added 2026-10-01) Limits, expiry and retention (product targets; each is a named constant and is enforced by the backend, with the client validating first). This table is the single authority for every limit, timing and retention period in the design OS; other phases repeat a value from it or reference it, and where one differs this table wins. At a limit the member is told the limit, what they have, and what to do instead; nothing is truncated silently.

| Subject | Specified value | At the limit | Assumption |
|---|---|---|---|
| Export period | 366 days per job (`EXPORT_MAX_RANGE_DAYS`) | Refused before submission, with the suggestion to split by period | A20 |
| Export rows | 5,000,000 per job (`EXPORT_MAX_ROWS`; one full single-account ledger at SCALE_TARGET) | Job ends `failed` with the reason and the suggestion to narrow the period | A20 |
| Export jobs in progress | 3 per member (`EXPORT_ACTIVE_JOB_LIMIT`) | A further request is refused until one finishes | A20 |
| Export file availability | 7 days after `ready` (`EXPORT_RETENTION_DAYS`), then `expired` | Requested again from the expired job | A20 |
| Signed download link | 5 minutes, single use, the member's role re-checked when it is issued (`DOWNLOAD_LINK_TTL`) | A new link is issued on request while the file is available | A20 |
| Export status polling | Every 5 s (`EXPORT_POLL_INTERVAL`) while a job is `queued` or `running`; after 30 minutes (`EXPORT_POLL_MAX_MS`) the job is shown as delayed and the client stops polling | The member is told the job is delayed and can check again | A27 |
| Note length | 2,000 characters (`NOTE_MAX_LENGTH`) | Further input refused with the count stated | A21 |
| Decision reason | 10 to 2,000 characters (`DECISION_NOTE_MIN`, `NOTE_MAX_LENGTH`) | A shorter reason is refused; further input refused with the count stated | A21 |
| Upload file | 10 MB (`UPLOAD_MAX_BYTES`); PDF, JPEG or PNG | The file is refused with the reason, others in the same batch continue | A21 |
| Attachments | 10 per transaction; 5 per message (`UPLOAD_MAX_FILES`) | A further file is refused with the count stated | A21 |
| Verification documents | 10 per document kind and 20 per case; each file as Upload file | As attachments | A21 |
| Avatar | 2 MB (`AVATAR_MAX_BYTES`) | The file is refused with the reason | A21 |
| Upload target | A signed upload target is single use and valid for 10 minutes (`UPLOAD_TARGET_TTL`) | A new target is issued when the upload is tried again | A28 |
| Display name | Up to 80 characters (`DISPLAY_NAME_MAX`) | Further input refused with the count stated | A28 |
| Saved views | 50 per member per workspace (`SAVED_VIEW_LIMIT`); name up to 60 characters (`SAVED_VIEW_NAME_MAX`) | Refused until one is removed; a longer name is refused with the count stated | A21 |
| Support message length | 5,000 characters (`MESSAGE_MAX_LENGTH`) | Further input refused with the count stated | A21 |
| Search term | 2 to 100 characters to the backend (`LEDGER_QUERY_MIN_LENGTH`, `LEDGER_QUERY_MAX_LENGTH`); on-device matches (pages, help) may start at 1 character | Shorter terms do not search; longer input is refused | A21 |
| Search debounce | 300 ms (`SEARCH_DEBOUNCE_MS`) | — | A27 |
| Backend search time limit | 5 s (`SEARCH_TIMEOUT_MS`) | The search is reported as unanswered with a reference and a retry; on-device matches keep working | A28 |
| Accounts in one ledger filter | 50 (`LEDGER_ACCOUNT_FILTER_MAX`) | A longer list is refused with the limit stated | A28 |
| Categories in one ledger filter | 20 (`LEDGER_CATEGORY_FILTER_MAX`) | A longer list is refused with the limit stated | A28 |
| Accounts listed | 200 (`ACCOUNT_LIST_MAX`) | Further accounts are reached by paging; totals stay server-computed | A28 |
| Command palette | 5 results per scope; 8 recent entries, cleared on sign-out | Further matches are reached through the full search | A28 |
| Ledger page size | 50 rows (`LEDGER_PAGE_SIZE`) | The next page is fetched by cursor | A27 |
| Ledger pages held in memory | 10 (`LEDGER_MAX_PAGES`) | The earliest pages are released and re-fetched if the member returns | A27 |
| Ledger date range per query | 731 days when both a start and an end date are given (`LEDGER_MAX_RANGE_DAYS`); with neither bound the ledger reads newest first and pages back by cursor without limit | When both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared | A27 |
| Exact count | Up to 10,000, then "10,000+" (`COUNT_EXACT_LIMIT`) | Never an estimate presented as exact | A27 |
| Account-number reveal | Re-masked after 30 s, with a warning at 10 s remaining and the option to extend (`REVEAL_TIMEOUT`) | Masked again; revealing again needs a valid step-up | A15 |
| Step-up grant | 5 minutes, single purpose (`STEP_UP_GRANT_SECONDS`); a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant | Step-up is asked for again | A16 |
| Idle-expiry warning lead | 2 minutes (`SESSION_WARNING_LEAD`) | The session ends as BR6 describes | A16 |
| Sign-in and step-up failures | 5 failures (`AUTH_MAX_ATTEMPTS`) in 15 minutes, then a 15-minute lock | The member is told how long remains and how to recover (X5) | A17 |
| Two-step challenge | 5 minutes (`CHALLENGE_TTL`) | States that it expired and offers a new one | A18 |
| Invitation | 7 days, single use; a re-send invalidates the earlier link (`INVITE_TTL_DAYS`) | States whether it expired, was revoked or was used, and how to get a new one (BR12) | A18 |
| Password-reset link | 30 minutes, single use (`RESET_LINK_TTL`) | States that it expired or was used and offers a new one | A18 |
| Transaction and statement history available to members | 7 years from posting date; statements for 84 months (`STATEMENT_HISTORY_MONTHS`) | Older periods are stated as outside the retained range, not shown as empty | A22 |
| Audit entries | 7 years | — | A22 |
| Notifications | 90 days (`NOTIFICATION_RETENTION_DAYS`) | Older notices are no longer listed | A22 |
| Unread count refresh | Every 60 s (`NOTIFICATION_POLL_INTERVAL`); shown as "99+" beyond 99 | — | A28 |
| Data of a closed workspace | Read-only access for owners for 90 days after closure, then removed except what law requires the operator to keep (OD1) | — | A22 |
| Read timeout (browser) | 15 s (`REQUEST_TIMEOUT_MS`) | Treated as failed and reported with a reference (BR20) | A25 |
| Write timeout (browser) | 30 s (`MUTATION_TIMEOUT_MS`); a timed-out write is never re-sent automatically | The outcome is stated as unknown and the current state is re-read (BR18) | A25 |
| Server-to-backend timeout | 10 s; uploads 60 s (`BACKEND_TIMEOUT_MS`, `UPLOAD_TIMEOUT_MS`) | As the read or write timeout | A25 |
| Slow-request notice | 10 s (`SLOW_REQUEST_MS`) | The member is told the request is slow | A25 |
| Read retries | 2, with 1–8 s backoff (`QUERY_RETRY_LIMIT`); writes are never retried | The failure is reported with a reference (BR20) | A25 |
| Balance labelled possibly out of date | After 15 minutes, or when served from cache after a failure or offline (`BALANCE_STALE_AFTER`) | The figure stays readable, marked with its age (BR15) | A19 |
| Data freshness tiers | `live` 15 s · `standard` 60 s · `slow` 5 minutes · `static` never (`STALE_TIME`); fetched data kept 5 minutes after last use (`GC_TIME_MS`), 0 for a revealed account number | Data older than its tier is re-read on next use (BR15) | A28 |
| Members per workspace | 200 members (`TEAM_MEMBER_LIMIT`); 50 pending invitations (`INVITE_PENDING_MAX`) | A further invitation is refused with the limit stated | A28 |
| Beneficial owners per verification case | 20 (`OWNER_LIMIT`) | A further owner is refused with the limit stated | A28 |
| Alert rules | 20 per member (`ALERT_RULE_LIMIT`); only R1 and R2 may have them, and there is no shared workspace rule | Refused until one is removed | A28 |
| Verification case claim | A case under review is held by its reviewer for 30 minutes (`CASE_CLAIM_MINUTES`) | The claim lapses and another reviewer may take the case | A28 |
| Admin user directory handled on the device | Up to 1,000 users (`ADMIN_USERS_CLIENT_LIMIT`) | Beyond it the directory is searched and paged by the backend | A28 |
| Payee detail change | Needs explicit confirmation before payment for 7 days after the change (`PAYEE_CHANGE_HOLD_DAYS`; F7, Deferred) | The payment is refused until confirmed | A28 |
| Dashboard caps | 6 accounts (`DASHBOARD_ACCOUNT_LIMIT`), 8 activity items (`DASHBOARD_ACTIVITY_LIMIT`), 10 pending items (`DASHBOARD_PENDING_LIMIT`) | The full list is reached from the dashboard | A28 |
| Help articles searched on the device | Up to 200 (`HELP_ARTICLE_LIMIT`) | — | A28 |
| Support lookup | Minimum 3 characters (`SUPPORT_QUERY_MIN`); 50 results (`SUPPORT_RESULT_LIMIT`) | Shorter terms do not search; beyond 50 the lookup is narrowed | A27 |
| Idempotency key honoured | 24 hours (`IDEMPOTENCY_KEY_HEADER`) | A later repeat is treated as a new attempt | A28 |
| `next` parameter | 2,048 characters, same-origin path only | Ignored; the member lands on their default page | A28 |
| URL length | Refused beyond 2,000 characters | The member is told the address is too long to open | A28 |
| Email / password | 254 / 8 to 128 characters (`PASSWORD_MIN_LENGTH`, `PASSWORD_MAX_LENGTH`) | Refused with the limit stated | A28 |

- **BR20** (added 2026-10-01) Failure, degraded service and support reference. A failure is reported to the member in terms of what could not be done, and states that no money or balance was changed by the failure. Every failure the member sees carries a reference, which is required and never optional (the backend's request identifier, or one generated by the client when the request never reached the backend, as with a refusal at validation or while offline), that they can quote and copy; with that reference support (R5) can find the request, the member, the workspace and the time, and nothing else needs to be asked. Without a network connection, pages already loaded stay readable and marked with their age (BR15); every write is disabled with the reason stated, never queued for later; reading resumes automatically when the connection returns and the member is told. When one part of a page fails, the rest keeps working. Reads are retried up to 2 times with a 1–8 second backoff (`QUERY_RETRY_LIMIT`); writes are not (BR18).

### Content

- **BR10** Never put invented content in front of real people: no fabricated balances, testimonials, customer logos, compliance badges or security certifications. Marketing copy states only what is true, lives in constants and is reviewed by the maintainer before each deployment; a claim about security, regulation, protection of funds, rates or fees is published only with a source the maintainer has recorded, and a capability that is not available to a signed-in member today is not described in the present tense. (The built home page shows labelled sample figures — OD9 facet d.)
- **BR11** Dev and demo data for the product comes from the backend seed (`backend/prisma/seed.ts`), never from arrays in the frontend. Frontend `lib/data/` holds static product copy and config (nav config, help articles, empty-state copy, permission matrix). (The built home page keeps sample figures in `lib/data/ledgerline/`, which the host rule permits for seed/sample data — OD9 facet d.)

## Success metrics

All numeric values are **targets** for the first 90 days after release, not measurements. Shared definitions: a week is Monday 00:00 to Sunday 24:00 UTC and a month is a calendar month in UTC, so every workspace is counted on the same boundary whatever its own time zone (BR14 governs what members read, not how the product is measured); a workspace is counted only once its verification case is `approved`; workspaces flagged as internal, test or demo are excluded; a denominator of zero reports "no data", never 0% or 100%. Measurement events carry opaque identifiers only (BR5). Each metric is reviewed monthly by its owner; a target missed in two consecutive months is raised to the maintainer under [Governance](#governance).

| ID | Outcome | Signal | Formula | Target (90 days) | Source | Owner |
|---|---|---|---|---|---|---|
| SM1 | Owners check Ledgerline first | Share of R1 members with a dashboard session on ≥ 3 distinct days per week | Owners with a P08 visit on ≥ 3 distinct UTC days in the week ÷ owners of counted workspaces | ≥ 40% (A24) | session events | Maintainer |
| SM2 | Month-end happens in Ledgerline | Share of workspaces that download a statement or complete an export each month | Workspaces with ≥ 1 statement download or ≥ 1 download of a `ready` export in the month ÷ counted workspaces | ≥ 60% (A24) | backend audit entries (BR16) | Maintainer |
| SM3 | Verification completes without support | Share of cases reaching `approved` with no support thread | Cases `approved` in the month with no thread opened by a workspace member between `not_started` and `approved` ÷ cases `approved` in the month | ≥ 80% (A24) | case states + support threads | Compliance |
| SM4 | Users find transactions fast | Time from opening search (P11 or C38) to opening a transaction detail (P12) | Median, per member session, of (time P12 opened − time the search was opened), for searches that end in a P12 visit within 5 minutes; abandoned searches are reported separately as a rate | ≤ 20 s (K9) | client events | Frontend lead |
| SM5 | Users trust the numbers | Support threads tagged "balance mismatch" per 1,000 workspaces | Threads tagged "balance mismatch" in the month ÷ counted workspaces × 1,000; each is classified by R5 as formatting, freshness, source data or misunderstanding | ≤ 2, and 0 classified formatting (K10) | support tags | Delivery lead |

## KPIs

Speed KPIs are measured from real member sessions (field data), reported at the 75th percentile unless the row says otherwise, on the supported browsers in [Platform constraints](#platform-constraints); "readable" means the figure itself is present and final, not a loading state.

| ID | KPI | Formula | Target | Source | Owner |
|---|---|---|---|---|---|
| K1 | Weekly active workspaces | Counted workspaces with ≥ 1 signed-in member session in the week | trend upward week on week; four consecutive falling weeks trigger a review | session + workspace events | Maintainer |
| K2 | P08 median time until the cash position (S14) is readable | Median of (time S14 shows final figures − navigation start) per P08 visit | ≤ 1.5 s on a mid-range laptop; ≤ 2.5 s at p75 on a phone on a 4G connection (A25) | web vitals + custom mark | Frontend lead |
| K3 | Ledger entries (S23) first rows readable after navigation | p75 of (time first rows show final values − navigation start), reported separately for accounts under 10,000 rows and for accounts over 1 million rows | ≤ 1.0 s at p75 in both bands | web vitals + custom mark | Frontend lead |
| K4 | Share of export jobs reaching `ready` | Jobs reaching `ready` ÷ jobs reaching `ready` or `failed`, by week; jobs refused at a limit (BR19) are excluded | ≥ 99% | export job states | Backend team |
| K5 | Median time from export request to `ready` | Median of (`ready` time − `queued` time) | ≤ 60 s for one month of one account up to 100,000 rows; ≤ 15 min at p95 for a 5-million-row job (A25) | export job timestamps | Backend team |
| K6 | Share of transactions annotated by month-end in workspaces with an accountant | Transactions posted in the month carrying a category, note or flag by the 10th day of the following month ÷ transactions posted in the month, for workspaces with ≥ 1 R3 member | trend upward | annotation audit entries | Maintainer |
| K7 | Verification completion (`not_started` → `submitted`) | Cases reaching `submitted` within 14 days of first reaching `in_progress` ÷ cases that reached `in_progress` at least 14 days ago | ≥ 70% of started cases | case states | Compliance |
| K8 | Cases returned `needs_info` more than once | Cases with ≥ 2 transitions into `needs_info` ÷ cases decided in the month | ≤ 10% | case states | Compliance |
| K9 | Search-to-detail time (SM4) | As SM4 | ≤ 20 s median | client events | Frontend lead |
| K10 | Balance-mismatch threads per 1,000 workspaces | As SM5, counting only threads classified formatting | 0 caused by frontend formatting | support tags | Frontend lead |
| K11 | WCAG 2.2 AA automated violations on release | Count of violations reported by the automated accessibility run across every page in [Phase 9](phase-9-qa-checklist.md), per release; automated checks do not replace the manual screen-reader and keyboard items there | 0 | [Phase 9](phase-9-qa-checklist.md) | QA lead |
| K12 | Step-up failures leading to lockout support threads | Threads tagged "locked out" in the month ÷ members who attempted a step-up in the month × 1,000 | trend downward; ≤ 5 per 1,000 (A24) | auth events + support tags | Delivery lead |
| K13 | Median R5 lookup-to-answer time | Median of (first reply time − thread opened time) within support hours | trend downward; ≤ 4 support hours (A24) | P33 events | Delivery lead |
| K14 | Median R6 case decision time after `submitted` | Median of (first of `approved`, `rejected`, `needs_info` − `submitted`), counting compliance working hours only | ≤ 1 business day; no case undecided after 3 business days | case timestamps | Compliance |
| K15 | Share of member sessions free of a reported failure (added 2026-10-01) | Sessions with no failure reference issued (BR20) ÷ sessions, by week | ≥ 99.5% (A25) | failure reports | Frontend lead |
| K16 | Balance freshness (added 2026-10-01) | Share of balance reads whose source timestamp (BR15) is ≤ 15 minutes old | ≥ 99% (A19) | backend | Backend team |

## North Star metric

**Weekly reconciling workspaces:** workspaces in which, during a calendar week, at least one member downloaded a statement, downloaded a `ready` export, or annotated a transaction.

- It measures the job Ledgerline is for (BG2), not logging in.
- It counts workspaces, because the customer is the business; one accountant serving ten clients counts ten.
- It is reachable in read-only v1; it does not depend on money movement.
- It resists vanity: opening the dashboard repeatedly does not move it.

Definition for measurement: the count, per week (Monday to Sunday, UTC), of counted workspaces (see [Success metrics](#success-metrics)) with at least one of these backend audit entries (BR16) made by a workspace member: statement download; download of a `ready` export; annotation create or edit. A workspace counts once however many members or actions it has. Excluded: actions by internal personas, export requests that were never downloaded, saved-view changes, and annotation deletes. Source: backend audit entries, not client events, so an ad blocker or a closed tab cannot change it. Owner: maintainer. Target for the first 90 days: ≥ 50% of counted workspaces in a week that contains a month's first five working days, ≥ 25% in any other week (A24). It is reported with its two components (reconciling by download, reconciling by annotation) so a rise in one cannot hide a fall in the other.

Guardrails that must not fall while the North Star rises: K10 (trust), K11 (accessibility), K3 (ledger speed), K15 (failure-free sessions), K16 (freshness). A release that moves the North Star while breaching a guardrail target is treated as a regression and is raised under [Governance](#governance).

## Governance

| Decision | Owner | How it is recorded |
|---|---|---|
| Product scope, open decisions OD1–OD16 | Maintainer | [Open decisions](#open-decisions) |
| Library additions LD1–LD5 | Maintainer approval before any install | [Phase 7](phase-7-frontend-architecture.md#15-shared-libraries) |
| Backend API shape | Backend team (class-validator DTOs) | OpenAPI → generated `lib/contract/` |
| Visual design of every page | Owner, at build time per page | Not in this design OS — see [IMPLEMENTATION_PROMPT › Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off) |
| Page, section, interaction inventory | Design OS | [Phase 4](phase-4-page-blueprints.md), [Phase 5](phase-5-section-blueprints.md), [Phase 6](phase-6-interaction-contracts.md) |
| Build progress and sequencing | Delivery lead | [Phase 8](phase-8-implementation-roadmap.md), the only file that records status |
| Verification policy (KYB/KYC fields, thresholds) | Compliance, bound by OD1 | Backend verification module |
| Business rules BR1–BR20, permission matrix, lifecycle states | Maintainer; Compliance must agree to any change to BR5, BR6, BR12, BR13, BR16 or BR19 | This file, with an entry under [Changes in this version](#changes-in-this-version) |
| Limits and thresholds (BR19, A15–A25) | Maintainer; Backend team confirms each is enforceable before it is relied on | [Assumptions](#assumptions), then the named constant in [Phase 7](phase-7-frontend-architecture.md) |
| Metric definitions and targets (SM, K, North Star) | The owner named on each row; the maintainer approves a changed definition or target | This file; a changed definition restarts the metric's trend and says so |
| Published copy and claims on public pages (BR10) | Maintainer | Copy constants, reviewed before each deployment |
| Release readiness | QA lead, against [Phase 9](phase-9-qa-checklist.md); the maintainer alone may accept a release with an open item, in writing, with an expiry date | Phase 8 |

### How a decision is made, recorded and disputed

- **Who decides.** One named owner per row above. Anyone may propose; only the owner decides. Where a row names a second party, both must agree and the maintainer decides if they do not.
- **How a change is proposed.** As a pull request that edits the affected design OS file. It states what changes, why, which IDs are affected in other phases, and what a member will experience differently. A change that touches an ID used by another phase edits every phase that uses it in the same pull request; a change that cannot do so is not merged.
- **How it is recorded.** The file's version line is advanced (a correction that changes no behaviour: third number; an added or changed rule, metric, limit or decision: second number; a change of product scope such as an answer to OD3 or OD9: first number), an entry is added under Changes in this version, and the merge commit is the dated record. An open decision is closed by replacing its options with the answer, the date, who decided and the reason; the row and its ID are kept.
- **How fast.** The owner responds to a proposal within 5 working days. An open decision that blocks a sprint in [Phase 8](phase-8-implementation-roadmap.md) is answered before that sprint starts or its stated default applies ([Open decisions](#open-decisions)) and is recorded as "default applied", which the owner may later overturn at the stated cost of reversal.
- **How a dispute resolves.** Between two phases of this design OS: Phase 1 wins until amended. Between this design OS and the host `.claude/CLAUDE.md` on code conventions: the host file wins. Between the specification and what has been built: the specification stands and the difference is recorded as a status in Phase 8 or as an open decision here; it is never settled by editing the specification to match the build without the owner's decision. Between two owners: the maintainer decides, and the decision and the losing argument are both recorded so it can be revisited.
- **Exceptions.** A rule in this file may be waived for one release only, by the maintainer, in writing, with the reason, the member-visible consequence and the date by which it is restored. BR1, BR5, BR10, BR13 and BR17 are never waived.

### The contract layer

`lib/contract/` is generated from the backend's OpenAPI document and never edited by hand. `pnpm contract` regenerates it; `pnpm contract:check` fails when it drifts. Every endpoint the frontend calls comes from `@/lib/contract` (or `lib/api-routes.ts` for the few endpoints the backend does not publish). Why: a field renamed on a backend DTO breaks type-checking at every consumer, so a mismatch is found before a user sees a wrong number.

### Scope preservation

A feature specified here is never removed because it has not been built. "Not built" and "later" are statuses recorded in Phase 8 only; they never edit Phases 1–7. Removal requires an explicit maintainer instruction naming the feature. This is why F6, F7, P26, P27, S44 and S45 stay fully specified, and why the capabilities the built home page adds are recorded (S55–S64) rather than ignored.

## Platform constraints

- **Host stack wins.** The host `.claude/CLAUDE.md` overrides the seed defaults: Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, TanStack Query 5, Zod 4, motion 12, Carbon icons, date-fns, nanoid.
- **Styling** is governed by the host conventions and decided per page at build. This design OS states no styling rule.
- **Architecture boundaries.** Pages compose sections only; components never import the API client; shared types live in `lib/types/`; schemas in `lib/validations/`; authenticated calls go through Server Actions in `lib/actions/` wrapped by hooks in `lib/hooks/`.
- **File limits.** One component per file; about 150 lines per file; no comments in code; no `console`.
- **Backend contract today.** The backend publishes auth (register, login), users (list, create, me, get, update, delete), health, user stats, accounts (`GET /api/accounts`) and cash flow (`GET /api/cash-flow`). The published account states are `OPEN`, `FROZEN` and `CLOSED`; their mapping to the Account lifecycle states is OD11. Every other banking capability is a backend dependency listed in [Phase 2](phase-2-experience-maps.md#backend-dependency-summary) and [Phase 7](phase-7-frontend-architecture.md#134-endpoints).
- **Session token today** carries `sub`, `email` and `role` (`ADMIN` \| `USER`). Workspace roles require a backend membership model.
- **No new dependency without approval.** LD2–LD5 await approval (OD8); LD1 (`recharts`) is installed and is recorded as approved-and-installed, pending the owner confirming where that approval is recorded.
- **Web only**, usable from 360 CSS px wide upwards (A8). English only in v1; every date, number and currency goes through `Intl` (A6).
- **Supported browsers** (the support contract, identical to [Phase 9 §14](phase-9-qa-checklist.md#14-cross-browser-compatibility)): Chrome, Edge and Firefox on desktop, last 2 stable versions; Safari on macOS, last 2 major versions; iOS Safari 17 and later; Android Chrome, last 2 stable versions. On anything else the member is told the browser is not supported and which are, and a defect seen only there is not a release blocker. JavaScript and cookies are required; with either unavailable the member is told so in plain text.
- **Input and assistive technology.** Every flow is completable with a keyboard alone, with a pointer alone and by touch; at 200% browser zoom and at 400% reflow (320 CSS px) without loss of content or function; with the screen-reader and browser pairs listed in Phase 9. The conformance target is WCAG 2.2 level AA.
- **Session lifetime.** Today 7 days (`SESSION_MAX_AGE`); the specified target is BR6 once OD2 is answered. Until then the 7-day lifetime is a known gap against BR6, not a product claim.
- **Performance budgets** (product targets, measured as the KPIs define): K2, K3 and K5; a member's action is acknowledged within 100 ms and, when its result takes longer than 1 s, the member is told that work is in progress; a read that has not answered within 10 s is disclosed as slow (`SLOW_REQUEST_MS`) and one that has not answered within 15 s (`REQUEST_TIMEOUT_MS`) is treated as failed and reported with a reference (BR20) rather than left waiting; a write that has not answered within 30 s (`MUTATION_TIMEOUT_MS`) is reported as outcome unknown and never re-sent automatically (BR18) (A25).
- **Availability and recovery** (targets for the service the product depends on, owned by the backend team; not claims to customers and not published): signed-in pages available 99.9% of each calendar month, excluding maintenance announced to members at least 48 hours ahead; after a loss, service restored within 4 hours and no more than 15 minutes of annotations, settings and audit entries lost (A26). During an outage the product says that viewing is unavailable and that funds are unaffected, and gives the health result (X10). Bank-held balances and transactions are the banking source's record (OD5) and are re-read from it after recovery, never reconstructed by the product.
- **Data retention and deletion.** As BR19. The browser holds no balance, transaction, account number or document beyond the session: nothing of that kind, and no draft of a note or message (BR18), is written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, pages that show balances are served `no-store`, and signing out clears in-memory data in every open tab. Only preferences that contain no financial or personal data persist on the device.
- **Scale envelope.** Every list, search, total and export is specified to behave correctly at zero, one, typical and SCALE_TARGET size; thresholds are in [Future scalability considerations](#future-scalability-considerations).
- **Regulated data.** Which regulator, residency and retention law apply is OD1. No constraint in this list asserts compliance with any law, standard or certification.

## Product principles

How the product behaves and treats its users. Each has a rule that can be checked in a diff or a test.

| ID | Principle | Checkable rule |
|---|---|---|
| DP1 | Exact before anything else | Every amount goes through C40 Amount from minor units; no `parseFloat`, `Number(` or `toFixed` on money fields. |
| DP2 | One primary fact per section | Each section's blueprint names the single piece of information it exists to convey; everything else is secondary to it. |
| DP3 | *Withdrawn in 2.0.0 (visual: density).* | — |
| DP4 | *Withdrawn in 2.0.0 (visual: depth).* | — |
| DP5 | *Withdrawn in 2.0.0 (visual: accent use).* | — |
| DP6 | Colour never carries meaning alone | Every state and severity is also given in text; text and controls meet WCAG 2.2 AA contrast. |
| DP7 | Motion never carries information | Nothing is understood only through movement; `prefers-reduced-motion` is honoured everywhere. |
| DP8 | Focus is always visible | Every focusable element shows a visible focus indicator, including in forced-colours mode. |
| DP9 | Keyboard first | Every primary flow is completable by keyboard; C38 CommandPalette opens with ⌘K / Ctrl+K and reaches every page a role can see. |
| DP10 | Every state is designed | Each section owns loading, empty, error and populated states through C57 QueryBoundary; no section renders a blank area. Empty distinguishes "nothing exists yet" from "nothing matches these filters" from "you cannot see this"; error carries a reference (BR20); populated covers one item, a partial result, stale data (BR15) and SCALE_TARGET size. |
| DP11 | Private by default | Account numbers masked (C42); reveal requires step-up; nothing sensitive in URLs except opaque IDs (the ledger search term `q` is the recorded exception, OD14). A test fails if a full account number, an amount, a counterparty name, an email address or note text appears in a URL, a document title, an analytics event or an error report (BR5). |
| DP12 | Truthful surfaces | No placeholder figures, logos, testimonials or badges presented as real on any deployed page (BR10; OD9). A figure is never shown as current when it is stale (BR15), never as zero when it is unknown (BR1), and never as a single total across currencies (BR17). |
| DP13 | *Withdrawn in 2.0.0 (visual: themes).* A colour-scheme preference, if offered, applies without reload (C54). | — |

## Implementation philosophy

- **Systems before pages.** Primitives (`components/ui/`), then compositions (`components/common/`), then sections, then pages. A pattern used twice is promoted.
- **Sections are data-bound.** Each section owns its hook, its four states and its error boundary (C58). Pages compose sections and hold page-level state such as URL filters.
- **URL is state.** Ledger filters, date ranges and chosen sub-views live in URL params so every view is shareable and back-button safe.
- **Server state through TanStack Query.** Cursor-based infinite queries for ledgers; polling only while a job runs (S32); no global store (C63 WorkspaceProvider is a context, with its reason stated).
- **Contract-derived types.** Types come from `z.infer` over generated schemas; no parallel hand-written shapes; no `any`, no unchecked casts.
- **Reuse before install.** Native platform first (`<dialog>`, `popover`, `Intl`, native date inputs); installed libraries second; new libraries only after approval.
- **Lint encodes the conventions.** A mechanically checkable rule becomes an ESLint rule with a colocated test; cross-file fixes get a ts-morph codemod.
- **Look is decided at build.** Before a page is coded, a visual concept is run with the repo's UI skills and approved by the owner (IMPLEMENTATION_PROMPT › Visual Design Hand-off).

## Non-goals

A non-goal is a boundary a tester can check: the product offers no way to do it, and no page describes it as available. Each stays a non-goal until the named decision is answered.

| Non-goal (v1) | Why | Where it is still specified |
|---|---|---|
| Money movement: transfers, bill pay, payees. No action in v1 creates, schedules, approves, cancels or edits a payment, and none changes a balance (BR7) | Needs a licensed payments or sponsor-bank partner, a backend payments module, fraud tooling and OD3 | F6, F7, P26, P27, S44, S45 (Deferred). Contested by OD9 |
| Native mobile apps, installable or offline-capable web app, push notifications to a device | Responsive web covers the check-cash job (A8); holding financial data on a device is excluded by the retention constraint | — |
| Cards and spend management: issuing, limits, merchant rules, expense claims, approval chains | A different product category (Brex, Ramp) | Contested by OD9 (built S59) |
| Treasury forecasting and yield on idle cash. No projected balance, interest figure or recommendation to move money is produced | v1 offers only a labelled runway estimate (P16), which is arithmetic on past posted movement, states its inputs and is not advice | Contested by OD9 (built S57, S60) |
| Accounting ledger / general ledger: no chart of accounts, journal entries, double-entry postings, tax calculation or direct sync to an accounting system. Categories are labels for export, not postings | Ledgerline exports to accounting tools; it does not replace them | F4 export shapes. Built S61 claims accounting sync (OD9) |
| Currency conversion: no exchange rate is shown or applied and no cross-currency total is produced | A converted total is an estimate, and BR17 forbids presenting an estimate as a balance | Contested by OD9 facet c |
| Editing bank data: a transaction's amount, date, counterparty and state, and an account's balance, cannot be changed, corrected, hidden or deleted by any member or internal persona | The banking source is the record (OD5); a disputed entry is flagged and raised with support (X9), not altered | — |
| Multi-language UI and right-to-left scripts | English only in v1; `Intl` and one `DEFAULT_LOCALE` constant keep the door open (A6, BR4) | — |
| Invented demo content in the frontend | BR10, BR11 | Backend seed. Contested by OD9 facet d |
| Opening bank accounts, closing them, or changing their terms | Depends on the partner (OD5) and jurisdiction (OD1) | — |
| Public API, webhooks and third-party app access to a workspace's data | Each needs its own consent, scoping and audit model; exports (F4) are the v1 way out for data | — |
| Internal personas acting as a customer (impersonation) or revealing customer account numbers | Excluded by BR5 and A13; support answers from read-only lookups | — |

## Future scalability considerations

SCALE_TARGET (target, not a claim): 50,000 workspaces · 500 million transactions · single-account ledgers up to 5 million rows · 200 concurrent members per workspace.

Each consideration states the size at which the simple approach stops being acceptable and what holds beyond it. The thresholds are product targets (A27).

- **Ledger size.** A 5-million-row ledger is never loaded whole. S23 Ledger entries uses cursor pagination and row virtualization (C53, LD2) so only visible rows exist in the document. Totals come from S22 (server-computed), never from summing loaded rows. Thresholds: one page of entries is 50 rows (`LEDGER_PAGE_SIZE`); the client holds at most 10 pages (`LEDGER_MAX_PAGES`, 500 rows) of one ledger in memory and releases the earliest beyond that, re-fetching them if the member returns; the count a member reads is the backend's exact count up to 10,000 matches (`COUNT_EXACT_LIMIT`) and "10,000+" beyond it, never an estimate presented as exact. With no start or end date the ledger reads newest first and pages back by cursor without limit; a query that gives both dates covers at most 731 days (`LEDGER_MAX_RANGE_DAYS`), and when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared. K3 holds in both of its size bands. The same behaviour is required at zero rows (states which of "no transactions yet" or "none match" applies), at one row, and when a page of rows fails part-way (rows already loaded stay, the failure is reported with a way to continue from the same cursor).
- **Search.** Filters are server-side and debounced (300 ms, `SEARCH_DEBOUNCE_MS`); the client never filters a full dataset. Thresholds: a term of 2 to 100 characters; one request in flight per search, a newer term cancelling the older; results across accounts are bounded to the member's permitted accounts by the backend; a backend search that has not answered within 5 s (`SEARCH_TIMEOUT_MS`) is ended and the member is asked to narrow the period, with a reference (BR20).
- **Exports.** Large exports are asynchronous jobs (`queued` → `running` → `ready`), polled only while running. Thresholds: every export is a job whatever its size, so behaviour does not change at a boundary; limits are BR19; a job's status is polled every 5 seconds (`EXPORT_POLL_INTERVAL`) only while a job is `queued` or `running` and the page is visible (A27); a job still not `ready` after 30 minutes (`EXPORT_POLL_MAX_MS`) is shown as delayed and the client stops polling, rather than polling without end.
- **Workspaces per user.** An accountant may belong to many workspaces; query keys include the workspace ID so caches never mix clients' data. Thresholds: specified to stay usable for a member of 200 workspaces (beyond 10 memberships the member finds a workspace by searching its name rather than reading through all of them); switching workspace discards every cached figure of the previous one before anything of the next is shown; two tabs may hold different workspaces, and a write always carries the workspace it was composed in, so it can never land in another.
- **Concurrent members.** Annotation writes are optimistic with server reconciliation; a record changed underneath a member is surfaced to them and their write is refused, never applied as last-write-wins (BR18). Threshold: 200 members concurrently in one workspace with conflicts resolved per BR18; there is no live presence or push in v1, so another member's change is seen on the next refresh of that data (at most 60 seconds stale, BR15) or at the moment of a conflicting write.
- **Workspaces and members.** Thresholds: a workspace of 1 member and 1 account behaves as a complete product, not a reduced one; a workspace holds at most 200 members and 50 pending invitations, and a verification case at most 20 beneficial owners (BR19); team lists are server-paginated beyond 50 members; a workspace with more than 50 accounts gets totals per currency from the backend and a paginated account list, never a client-side roll-up.
- **Internal tooling.** Internal lists (S49, S51, S53) are server-paginated and searchable from day one. Threshold: specified for 50,000 workspaces and their users; no internal list is fetched whole, and a lookup needs at least 3 characters (`SUPPORT_QUERY_MIN`) and returns at most 50 results (`SUPPORT_RESULT_LIMIT`).
- **Money movement later.** When OD3 is answered, P26 and P27 slot into the existing route group, permission matrix and step-up flow without restructuring navigation. BR18 (idempotency, no automatic retry of a write with an unknown outcome) and BR16 already hold for annotations so that money movement inherits them rather than introducing them.
- **Locales and currencies.** Minor units + ISO 4217 + `Intl` support any currency's exponent; OD1 chooses the default. Threshold: amounts are specified up to 18 digits of minor units, which is why they are strings and `BigInt` (BR1) and never `Number`; a second locale requires only a second value for `DEFAULT_LOCALE` and translated copy constants, with no change to any formatter call (BR4).

## Open decisions

Each is the maintainer's call. User-visible consequence first, then mechanism, then cost of reversal. The owner of every open decision is the maintainer; the "Input from" column names who must be consulted before it is answered. "Default if unanswered" is what the specification assumes, and what is built, when the decision is still open at the start of the sprint that depends on it ([Governance](#how-a-decision-is-made-recorded-and-disputed)); a default is recorded as "default applied" and can be overturned at the stated cost.

| ID | Decision | What users experience | Mechanism | Cost of reversal | Input from | Default if unanswered |
|---|---|---|---|---|---|---|
| OD1 | Jurisdiction, regulator and default currency | Which business details and documents owners provide; statement format; default currency; which retention periods in BR19 the law overrides; in which time zone and date order a new workspace starts | KYB/KYC fields, statement format, data residency, locale. **Note 2.0.0:** the built home page assumes GBP, `en-GB` and UK/EU payment rails; that is an input to OD1, not an answer | **High**: verification fields, statement format, retention and residency are all re-specified, and data already collected under one regime may not satisfy another | Compliance | No default is safe to ship to real customers. For development only: `DEFAULT_LOCALE` `en-GB`, default currency GBP, verification fields as the backend seed defines them; F5 is not opened to real businesses until OD1 is answered |
| OD2 | Session policy | Recommended: signed out after 15 min idle and 12 h absolute; re-authenticate to reveal account numbers. A shorter limit interrupts month-end work (R2); a longer one leaves an unattended device signed in to a company's finances | Today a 7-day cookie (`SESSION_MAX_AGE`) | Medium: constants and backend session handling change; members notice the new interruption pattern | Compliance, Backend team | The recommendation in BR6 (15 min idle, 12 h absolute, step-up valid 5 min for a single purpose) |
| OD3 | Money movement scope | v1 read-only (recommended) vs transfers in v1. With transfers, a mistake or a compromised session can lose money rather than only expose it | Licensing, sponsor-bank partner, payments module, fraud tooling | **High**: once members have moved money through the product it cannot be withdrawn without breaking their operations; adding it later costs only the build | Compliance, Backend team | v1 read-only (BR7); F6 and F7 stay specified and Deferred |
| OD4 | Feature folders `components/<feature>/` | None directly; how fast teams find sections | Amend host folder table. **Note 2.0.0:** the working tree already contains `components/ledgerline/` for the home page | Low: files move, imports are rewritten by codemod | Frontend lead | Follow the host folder table as written; `components/ledgerline/` stays as found until decided |
| OD5 | Banking data source / partner | Which accounts appear, balance freshness, when pending becomes posted, how far back history goes, whether a refresh a member asks for is immediate | Backend integration choice | **High**: freshness (BR15), history (BR19), states and identifiers all depend on the source; members' saved views, annotations and share links are keyed to its identifiers | Backend team, Compliance | The backend seed is the only source; BR15's 15-minute threshold and BR19's 7-year history are specified as targets and re-confirmed against the chosen source |
| OD6 | Two-step method | Recommended: passkeys with TOTP fallback; SMS discouraged. Determines what a member needs to hand to sign in and to step up, and how they recover when that device is lost | Backend two-step module; X1, X4, X8 | Medium: every enrolled member re-enrols when the method changes | Backend team, Compliance | The recommendation: passkeys with TOTP fallback; no SMS |
| OD7 | *Withdrawn from this design OS in 2.0.0.* 1.0.0 asked for a default colour scheme; that is a visual decision taken at build with the owner. Whether members get a colour-scheme preference control stays specified as C54 | — | — | — | — | — |
| OD8 | Library approvals LD1–LD5 | Charts, fast large ledgers, reliable forms, tested flows depend on these. Without LD2 a ledger beyond a few thousand rows cannot meet K3; without LD4 the automated checks behind K11 do not run | See [Phase 7 §15](phase-7-frontend-architecture.md#15-shared-libraries) | Low to medium: each library is confined to the files Phase 7 names | Frontend lead | Nothing further is installed (host rule: no dependency without approval); LD1 (`recharts`) is already installed and recorded as approved-and-installed, pending the owner confirming where the approval is recorded; the capability that needs each library stays specified and its status is recorded in Phase 8 |
| **OD9** | **Product scope presented on the public home page vs v1 scope (added 2.0.0)** | See below | See below | **High** once customers rely on either | Compliance | Side A is the specification; the built page is not deployed as the product's public site while it describes capabilities v1 does not have (option C below) |
| **OD10** | **Entry path from the public site (added 2.0.0)** | See below | See below | Medium: links and one form change; an enquiry intake, if kept, needs a backend and a retention rule for the addresses collected | Backend team | The hybrid below: sign-in to P02, account opening to P03, demo request to the enquiry |
| OD11 | Account lifecycle mapping between the specified states and the backend's (added 2.1.0) | Which status an account carries, and whether an account can appear as awaiting verification at all | The specification has `active`, `frozen`, `closed`, `pending_verification`; the backend publishes `OPEN`, `FROZEN`, `CLOSED` on `GET /api/accounts` | Medium: status labels (BR8, C12), filters and any saved view keyed to a status change together | Backend team, Compliance | `active` = `OPEN`; `pending_verification` is a workspace state, not an account state |
| OD12 | Who may read the audit record (added 2.1.0) | Whether a workspace owner can see who did what in their workspace without asking support | BR16, A23; backend audit read endpoints | Medium: opening the record to members later adds a page and a permission-matrix row; withdrawing it after members rely on it is harder | Compliance, Backend team | R7 reads all entries; R6 reads a case's history; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 (no workspace audit page) but may ask support for the entries about their own workspace |
| OD13 | Whether registration may say an email is already registered (P03) while sign-in and reset do not (added 2.1.0) | A person registering with a known address is either told so on the page, which also tells anyone else that the address has an account, or gets the same neutral answer as everywhere else and learns by email | X2, P03 response copy; backend register response and an email to the existing user | Low: one response and its copy change | Compliance, Backend team | Registration gives the same neutral answer and the existing user is told by email |
| OD14 | Free-text `q` in the URL versus DP11 "nothing sensitive in URLs" (added 2.1.0) | A shared or bookmarked ledger link reopens the same search, but the search term (possibly a counterparty name) is then in the address, history and any place the link is pasted | Ledger filter parameters ([Phase 3](phase-3-information-architecture.md)); BR5, DP11 | Medium: removing `q` from the URL breaks existing shared links and saved bookmarks | Compliance, Frontend lead | `q` is the single recorded exception; it is never logged or sent to analytics |
| OD15 | Journeys with no map (added 2.1.0) | Accepting an invitation as the invitee; a workspace-facing audit trail; reporting an unrecognised or fraudulent transaction; lost second-factor recovery; ownership transfer and workspace closure; a personal-data access or erasure request; incident and maintenance communication; creating or joining a second workspace — a member who needs one of these has no specified path | Each would be a new flow in [Phase 2](phase-2-experience-maps.md) with its pages, sections and contracts | Low now; rises with every release that ships without them, since members build workarounds through support | Compliance, Delivery lead | Out of v1 scope until the maintainer names them; recorded here so they are not forgotten |
| OD16 | Build-status notes inside Phase 5 technical notes versus "status lives only in Phase 8" (added 2.1.0) | None directly; a reader may find two different answers to whether something is built | "Built." notes in [Phase 5](phase-5-section-blueprints.md) technical notes; [Phase 8](phase-8-implementation-roadmap.md) status | Low: the notes are removed or kept in one edit | Delivery lead | Keep the notes until the maintainer decides; Phase 8 is authoritative when they disagree |

### OD9 — What the public home page promises vs what v1 is

Both sides, stated as found. Neither is chosen here.

| Facet | Side A — earlier specification (1.0.0, retained as current spec) | Side B — built home page (working tree) |
|---|---|---|
| a. Payments | v1 is read-only (BR7). F6 Transfer and F7 Pay a payee are Deferred behind OD3 and must not be advertised (Q-247). No approval workflow exists in v1. | S58 presents drafting, two-person approval and scheduling of payments, batch payouts, local rails (Faster Payments, SEPA, wires), with an interactive approval sample; the metrics list "2-step approvals on every outgoing payment". |
| b. Cards | Non-goal ("a different product category"). | S59 presents issuing cards with limits, merchant rules, receipt rules, and a card with sample spend. |
| c. Treasury and accounts | Only a labelled runway estimate (P16). No yield, sub-accounts or forecast. Currency count is OD1/OD5. | S57 presents multi-currency accounts ("34 currencies"), instant internal transfers, interest on idle cash (sample 4.1%), sub-accounts; S60 presents a 90-day cash forecast, "cash you can safely set aside" and projected interest; S61 presents automatic matching and accounting sync. |
| d. Sample figures on a public page | BR10/DP12: no fabricated balances or figures in front of real people; BR11: demo data only from the backend seed. | Sample balances, a sample company, sample rates, sample prices (S62) and sample metrics live in `lib/data/ledgerline/`, each labelled "sample" or "placeholder", with a page-wide disclosure that Ledgerline is a design study and not a bank. |
| e. Security claims | S06 states only behaviour that exists: masked numbers, step-up reveal, two-step sign-in, roles, audit logging. | The built security section lists two-person approvals, hardware keys, protected client money and always-on monitoring, with a note that these are placeholder controls. |
| f. Pricing | Not specified in 1.0.0. | S62 shows three plans with sample prices. |

Consequences to weigh:

- Choosing **A** means the home page copy is rewritten to v1 capabilities before it is deployed as the product's site, sample figures leave the public page (or are replaced by true statements), and S57–S62 are re-scoped; the sections themselves stay recorded.
- Choosing **B** widens v1: OD3 is answered "yes", cards, approvals, treasury forecast and pricing become specified product features that need new flows, pages and backend modules, and BR7, BR10 and the Non-goals are amended.
- A third option is **C**: keep the built page as an explicitly labelled design study that is never deployed as the live product site; P01's product copy is written when v1 ships. This keeps both the page and the v1 scope but leaves P01 without true production copy.

Until answered, Phases 2–7 specify side A, and the built sections S55–S64 are recorded as Built with the divergence noted in [Phase 8](phase-8-implementation-roadmap.md).

### OD10 — Entry path from the public site

| Side A — earlier specification | Side B — built home page |
|---|---|
| Owners self-register (X2, P03) from "Get started" on P01; returning members sign in at P02. Other members join by invitation only (X6, BR12). | "Open an account", "Book a demo" and "Sign in" all lead to an email enquiry form (S64); the form validates and states that nothing is sent. There is no link to P02 or P03. |

Consequence: with side B no one can reach sign-in or registration from the home page. A hybrid (sign-in to P02, "Open an account" to P03, "Book a demo" to the enquiry) is possible and is the recommendation to consider, but is not decided here.

## Assumptions

| ID | Assumption |
|---|---|
| A1 | The product is Ledgerline. |
| A2 | v1 is read-only; money movement is fully specified but Deferred (contested by OD9). |
| A3 | The backend publishes banking modules through the OpenAPI contract; the frontend consumes only `@/lib/contract`. |
| A4 | A workspace has many accounts and members; a user may belong to several workspaces. |
| A5 | Product dev data comes from the backend seed. |
| A6 | English, single locale in v1; all formatting through `Intl`. |
| A7 | *Withdrawn in 2.0.0 (visual register).* |
| A8 | Web only, usable from 360 CSS px wide; no native apps. |
| A9 | Internal roles R5–R7 share backend `ADMIN` until finer platform roles exist. |
| A10 | The working-tree home page is the owner's in-progress rebuild and is recorded as Built without judging its visual design. |

Assumptions A11–A27 were added on 2026-10-01. Each number in them is a product decision made so that the rule it belongs to can be tested; none is a measurement, a legal requirement or a claim. The maintainer owns every one and changes it through [Governance](#how-a-decision-is-made-recorded-and-disputed).

| ID | Assumption | Used by |
|---|---|---|
| A11 | Maintainer, Compliance, Backend team, Frontend lead, QA lead and Delivery lead are roles, not named people; one person may hold several, and the maintainer assigns them. | Governance, metric owners |
| A12 | The backend audit entries and client measurement events the metrics depend on do not exist today. Until they do, a metric is reported as "not measured", never estimated; the measurement tooling is a dependency that needs approval like any other. | SM1–SM5, K1–K16, North Star |
| A13 | Full account-number reveal is available to owner, finance and accountant, not to viewer (as C42 specifies) and not to any internal persona; internal personas cannot act as a workspace member. Whether an external accountant should keep reveal is the maintainer's to confirm. | BR5, permission matrix |
| A14 | Internal personas read instants in UTC; workspace members read them in the workspace time zone. | BR14 |
| A15 | `REVEAL_TIMEOUT` is 30 seconds, with a warning 10 seconds before it ends and the option to extend. | BR5 |
| A16 | The idle warning is given 2 minutes before the limit; a successful step-up is valid for 5 minutes for a single purpose; a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant. | BR6 |
| A17 | 5 failed sign-in or step-up attempts (`AUTH_MAX_ATTEMPTS`) within 15 minutes lock further attempts for 15 minutes. | BR6, K12 |
| A18 | An invitation expires 7 days after it is sent and a re-send invalidates the earlier link; a password-reset link expires after 30 minutes; both are single use. A two-step challenge expires after 5 minutes. | BR12, BR19 |
| A19 | A balance whose source timestamp is older than 15 minutes is disclosed as possibly out of date, as is one served from cache after a failure or offline; the target is 99% of balance reads within that age. | BR15, K16 |
| A20 | Export limits: 366 days and 5 million rows per job, 3 jobs in progress per member, files available 7 days, download address valid 5 minutes and single use. | BR19 |
| A21 | Input limits: note 2,000 characters; decision reason 10 to 2,000 characters; uploads 10 MB each, PDF, JPEG or PNG; 10 attachments per transaction, 5 per message, 10 per verification document kind and 20 per case; avatar 2 MB; 50 saved views per member per workspace with names up to 60 characters; support message 5,000 characters; search term 2 to 100 characters to the backend, from 1 character for on-device page and help matches. | BR19 |
| A22 | Retention: transaction and statement history and audit entries 7 years (statements 84 months); notifications 90 days; a closed workspace readable by its owners for 90 days. OD1 may override any of these. | BR19, BR16 |
| A23 | No workspace page presents the audit record in this specification; workspace members read none of it in v1 and may ask support for the entries about their own workspace. R7 reads all, R6 a case's history, R5 only the entries tied to a reference a member quoted. Adding such a page is a scope change for the maintainer. | BR16 |
| A24 | Outcome targets for the first 90 days: SM1 ≥ 40%, SM2 ≥ 60%, SM3 ≥ 80%, SM5 ≤ 2 per 1,000, K12 ≤ 5 per 1,000, K13 ≤ 4 support hours, North Star ≥ 50% in a month-start week and ≥ 25% otherwise. They are starting points to be replaced by measured baselines after the first 90 days. | Success metrics, KPIs, North Star |
| A25 | Performance budgets: K2 ≤ 2.5 s at p75 on a phone on 4G; K5 ≤ 15 min at p95 for a 5-million-row export; K15 ≥ 99.5% failure-free sessions; acknowledgement within 100 ms, progress disclosed after 1 s, a read disclosed as slow after 10 s and treated as failed after 15 s, a write timed out after 30 s and never re-sent, server-to-backend timeout 10 s (uploads 60 s), 2 read retries with 1–8 s backoff. | KPIs, Platform constraints, BR20 |
| A26 | Service targets: 99.9% monthly availability of signed-in pages, 48 hours' notice of maintenance, restoration within 4 hours, at most 15 minutes of product-held data lost. Internal targets, not commitments to customers. | Platform constraints |
| A27 | Scale thresholds: 50-row ledger pages, 10 pages held in memory, 731 days per ledger query when both dates are given (unbounded paging by cursor when neither is), exact counts up to 10,000 matches, 300 ms search debounce, 5-second export polling, 30 minutes before an export is shown as delayed and polling stops, support lookup from 3 characters with 50 results, 200 workspaces per member, 50 members and 50 accounts before pagination. | Future scalability considerations, BR19 |
| A28 | (added in 2.1.0) The remaining BR19 values: command palette 5 results per scope and 8 recent entries; unread count refreshed every 60 seconds and shown as "99+" beyond 99; 200 members and 50 pending invitations per workspace; 20 beneficial owners per verification case (`OWNER_LIMIT` counts beneficial owners, not members holding the owner role); dashboard caps of 6 accounts, 8 activity items and 10 pending items; up to 200 help articles searched on the device; idempotency key honoured for 24 hours; `next` up to 2,048 characters and same-origin only; URLs refused beyond 2,000 characters; email up to 254 and password 8 to 128 characters; freshness tiers `live` 15 s, `standard` 60 s, `slow` 5 minutes and `static` never, with fetched data kept 5 minutes after last use; backend search time limit 5 s; 50 accounts in one ledger filter and 200 accounts listed; 20 alert rules per member; display name up to 80 characters; upload target valid 10 minutes; a verification case claimed for 30 minutes; up to 1,000 admin users handled on the device; a payee detail change needing confirmation for 7 days. | BR19, BR15 |

## Changes in this version

- **Changed:** reference-product "feel" benchmarks removed (seed: benchmarks for features and flows only); `THEME_VARIANT` placeholder dropped (not in the seed); BR3 and BR4 rewritten without visual treatment; design principles renamed product principles, with DP3, DP4, DP5, DP13 withdrawn as visual and DP2, DP6, DP7, DP8 reworded to behaviour; OD7 withdrawn as visual; A7 withdrawn; governance of "visual tokens and theme" replaced by build-time owner decision; counts updated (sections 54→64, contracts 63→68).
- **Added:** R8 Prospect; BR12 (access rule made explicit); OD9 and OD10; A10; notes on OD1 and OD4.
- **Retained:** everything else from 1.0.0.

### Enterprise-grade audit, 2026-10-01

No ID was removed, renamed or renumbered, and no visual decision was added. The version line was advanced to 2.1.0 with this audit.

- **Deepened:** personas R1–R4 (banking context, denied capabilities) and the internal personas note; Jobs To Be Done (pending vs posted, statement agreement, session loss, client separation, error reference); BR1–BR10 and BR12 (malformed amounts, currency exponent, linked returns, locale formats, reveal limits and privacy exclusions, session behaviour, the full list of v1 writes, unknown states, invitation rules, last-owner rule, copy review); success metrics, KPIs and the North Star (formula, target, source, owner, shared definitions); Governance (who decides, how a change is recorded, response time, dispute resolution, exceptions); Platform constraints (browsers, assistive technology, session, performance, availability and recovery targets, retention on the device); DP10–DP12; Non-goals (testable boundaries); Future scalability considerations (thresholds); Open decisions (consequence, cost of reversal, input, default if unanswered).
- **Added:** BR13 (denial), BR14 (time), BR15 (freshness), BR16 (audit trail), BR17 (multi-currency and pending totals), BR18 (repeated and conflicting actions), BR19 (limits, expiry, retention), BR20 (failure, degraded service, support reference); two permission-matrix rows (account-number reveal, secure messages) restating C42 and X9; K15 and K16; four non-goals (currency conversion, editing bank data, public API, internal impersonation); A11–A27.
- **Audit and reconciliation (2.1.0):** BR19 made the single authority for every limit, with the values the nine phase audits disagreed on reconciled to one (stricter for security limits, majority for capacity limits) and A15–A27 updated in place; the behavioural contradictions resolved (stale and interrupted writes, offline, denial, time zone, backend contract today, LD1); OD11–OD16 and A28 added; then the residual decisions applied (BR19 gains the phase-local limits and a separate beneficial-owners row, freshness tiers named, step-up never authorising money movement unless issued for it, audit readership, drafts kept in the open tab's memory only, a reference required on every failure, unbounded ledger paging, workspace search beyond 10 memberships).

## Traceability

- **Upstream:** seed [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md) › Phase 1; host [CLAUDE.md](../../.claude/CLAUDE.md); design OS 1.0.0 (commit `9565964`); working-tree home page (`app/page.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`).
- **Downstream:** [Phase 2](phase-2-experience-maps.md) maps F1–F7, D1–D7, X1–X11; [Phase 3](phase-3-information-architecture.md) derives navigation from the permission matrix; [Phase 4](phase-4-page-blueprints.md) and [Phase 5](phase-5-section-blueprints.md) apply BR1–BR20; [Phase 6](phase-6-interaction-contracts.md) implements DP1, DP6–DP11 in contracts; [Phase 7](phase-7-frontend-architecture.md) implements the contract layer and scalability notes; [Phase 8](phase-8-implementation-roadmap.md) records status, including OD9's effect; [Phase 9](phase-9-qa-checklist.md) turns BR, DP and K items into checks.
