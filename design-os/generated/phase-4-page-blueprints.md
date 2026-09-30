# Ledgerline Design OS — Phase 4: Page Blueprints

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 3 — Information Architecture](phase-3-information-architecture.md) · Next: [Phase 5 — Section Blueprints](phase-5-section-blueprints.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to read this phase](#how-to-read-this-phase)
- [Page conventions](#page-conventions)
  - [Route groups and layouts](#route-groups-and-layouts)
  - [Segment files](#segment-files)
  - [Composition contract](#composition-contract)
  - [Metadata and indexing](#metadata-and-indexing)
  - [Permissions and enforcement](#permissions-and-enforcement)
  - [Device baseline](#device-baseline)
  - [State ladder](#state-ladder)
  - [Reference page](#reference-page)
  - [URL state by page](#url-state-by-page)
- [Marketing & public](#marketing--public) — P01, P28
- [Authentication](#authentication) — P02–P06
- [Workspace app](#workspace-app) — P07–P25
- [Payments](#payments) — P26, P27
- [Internal (admin)](#internal-admin) — P29–P33
- [System](#system) — P34, P35
- [Page index](#page-index)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)
- [Assumptions](#assumptions)

## How to read this phase

This phase defines 35 pages (P01–P35). A page is a route file that composes sections and holds page-level state (the parsed URL), nothing else. Every behaviour a section owns (its four states, its data hook, its copy) is specified once in [Phase 5](phase-5-section-blueprints.md); a blueprint here says what the page is for, what users come to get done, which sections serve it (under Dependencies), for whom, and what users on each device need to do.

**No visual prescription.** "Primary tasks" are user goals in the user's own words, never fields, buttons or links. States say what happens and what the user is told, never where it appears. "Device needs" states what users on each device must be able to do, never how the page rearranges. The look of each page is decided when it is built, with the owner (see [IMPLEMENTATION_PROMPT › Visual Design Hand-off](IMPLEMENTATION_PROMPT.md#3-visual-design-hand-off)).

Flows are referenced by ID from [Phase 2](phase-2-experience-maps.md) (F1–F7, X1–X11, D1–D7). Routes come from [Phase 3](phase-3-information-architecture.md). Build status is never stated here; it lives only in [Phase 8](phase-8-implementation-roadmap.md).

## Page conventions

Every page inherits the rules below. A blueprint restates one only when it deviates, and says why.

### Route groups and layouts

| Group | Folder | Layout owns | Pages |
|---|---|---|---|
| Root | `app/layout.tsx` | `<html lang="en">`, fonts, `Provider` (C61), `ToastProvider` (C62), viewport and base metadata (title template from constants) | all |
| `(marketing)` | `app/(marketing)/layout.tsx` | public navigation (S55) and public legal & support links (S07) | P01, P28 |
| `(auth)` | `app/(auth)/layout.tsx` | no product navigation | P02–P06 |
| `(app)` | `app/(app)/layout.tsx` + `(app)/(workspace)/layout.tsx` | session guard; then `WorkspaceProvider` (C63), S01 Primary navigation, S02 Global utilities, `SessionExpiryDialog` (C55), `@drawer` slot, `robots: noindex` | P07–P27 (P07 outside `(workspace)`) |
| `(admin)` | `app/(admin)/layout.tsx` | S01 and S02 in internal mode, server-side internal-role check, `robots: noindex` | P29–P33 |

The URL segment sits inside the group folder: `app/(auth)/auth/login/page.tsx` serves `/auth/login`. **2.0.0 note:** the built P01 is at `app/page.tsx` and P02 at `app/auth/login/page.tsx`, both outside their groups; the move is FD04 and does not change URLs.

### Segment files

| File | Where | Behaviour |
|---|---|---|
| `loading.tsx` | every `(app)` and `(admin)` segment; `(auth)` once | Route-level loading placeholder shown instantly on navigation, reserving space so nothing shifts when sections arrive. |
| `error.tsx` | root, each group, and every dynamic segment | Renders S54 Status explanation (`error` variant) with `reset()` as retry. Catches page-level failures; section data errors stay inside their section. |
| `not-found.tsx` | root plus `(app)` and `(admin)` | S54 in the `not-found` variant within the group's layout, so a member following a stale link can still navigate away. |
| `default.tsx` | `app/(app)/(workspace)/@drawer/default.tsx` | Returns `null` so the `@drawer` slot renders nothing on hard loads. |

Why the split: a section that fails must not take the page down; a page that cannot render needs one clear explanation.

### Composition contract

- `page.tsx` imports sections, parses `params` / `searchParams`, and passes them down. No hooks, no fetching, no inline arrays, no inline components (`starter/page-composes-only`). Pages are Server Components.
- Each section is wrapped in `SectionErrorBoundary` (C58) with its loading placeholder; later refetch, empty and stale states are handled inside the section by `QueryBoundary` (C57).
- Pages stay under 150 lines. A page nearing the limit needs a layout (P21, P32) or a variant composer (P08).
- `searchParams` are parsed once, in the page, through a Zod schema in `lib/validations/`, each field with `.catch()` so an invalid or outdated value is dropped rather than throwing.
- Entity pages (P10, P12, P19, P24, P31, P32 case) pass the ID; S03 resolves the display name from the same query key the entity's section uses, so there is no second request.

### Metadata and indexing

- Every page exports `metadata` whose `title` comes from `PAGE_TITLES` in `lib/constants.ts`; the root title template appends the product name.
- `generateMetadata` only where the title depends on public content (P28 articles). Entity pages use static titles so account or counterparty names never reach browser history sync.
- `(app)` and `(admin)` layouts set `robots: { index: false, follow: false }` once. P05 and P06 set the same. P01, P02, P03, P04 and P28 are indexable (P04 per Phase 3 §12).

### Permissions and enforcement

| Layer | Where | Decides | Failure the user sees |
|---|---|---|---|
| Session | `proxy.ts` over `PROTECTED_ROUTE_PREFIXES` (every `(app)` and `(admin)` top segment) | signed in or not | redirect to P02 with `next` |
| Platform role | `app/(admin)/layout.tsx`, server-side (`role === ADMIN` today, A9) | internal staff or not | P34 Not found — the admin area is not advertised |
| Workspace role | `PermissionGate` (C59) reading C63 and the permission matrix | which sections and actions render | a permission empty state naming who can grant access; hidden actions are omitted |

The backend is the authority for every data permission. Workspace role is not in the session token today, so a denied request surfaces as the section's error state with a 403 message until the membership model is published.

### Device baseline

Three device contexts are supported: phone (from 360 CSS px wide), tablet, and desktop. Every page must let users on every device complete every task the page offers; no action exists only on one device. How pages adapt is decided at build. Page blueprints add device needs only where users on one device need something specific.

- Wherever records are listed, a user on a narrow screen can read each record's essential facts ([Phase 5](phase-5-section-blueprints.md)) without horizontal page scrolling; amounts are never truncated.
- Wherever files can be dropped, they can also be chosen without drag-and-drop.
- Nothing requires hover.

### State ladder

1. **Route loading** — segment `loading.tsx`.
2. **Section loading** — section placeholder that reserves its final space (no layout shift).
3. **Section empty** — `EmptyState` (C32), copy from `lib/data/empty-states.ts`, one next action.
4. **Section error** — `ErrorState` (C33) scoped to the failing section, with retry. Other sections keep working.
5. **Route error** — segment `error.tsx` (S54 `error`).
6. **Not found** — `notFound()` when a dynamic ID resolves to 404.
7. **Success** — mutations confirm with a transient message (C24) and update the query cache; no reload.
8. **Offline** — cached data stays readable and is marked stale; writes are disabled with a reason (X10).

### Reference page

P10 is the reference composition. Every `(app)` page follows this shape. Styling is omitted on purpose; it is decided at build.

```tsx
import type { Metadata } from "next";
import AccountOverview from "@/components/ledger/account-overview";
import AccountOverviewSkeleton from "@/components/ledger/account-overview-skeleton";
import LedgerEntries from "@/components/ledger/ledger-entries";
import LedgerEntriesSkeleton from "@/components/ledger/ledger-entries-skeleton";
import LedgerFilters from "@/components/ledger/ledger-filters";
import LedgerSummary from "@/components/ledger/ledger-summary";
import LedgerSummarySkeleton from "@/components/ledger/ledger-summary-skeleton";
import PageHeader from "@/components/shell/page-header";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { ledgerSearchParamsSchema } from "@/lib/validations/ledger-search-params";

export const metadata: Metadata = { title: PAGE_TITLES.accountLedger };

export default async function AccountLedgerPage({
    params,
    searchParams,
}: PageProps<"/accounts/[accountId]">) {
    const { accountId } = await params;
    const filters = ledgerSearchParamsSchema.parse(await searchParams);

    return (
        <>
            <PageHeader title={PAGE_TITLES.accountLedger} />
            <SectionErrorBoundary skeleton={<AccountOverviewSkeleton />}>
                <AccountOverview accountId={accountId} />
            </SectionErrorBoundary>
            <LedgerFilters filters={filters} />
            <SectionErrorBoundary skeleton={<LedgerSummarySkeleton />}>
                <LedgerSummary accountId={accountId} filters={filters} />
            </SectionErrorBoundary>
            <SectionErrorBoundary skeleton={<LedgerEntriesSkeleton />}>
                <LedgerEntries accountId={accountId} filters={filters} />
            </SectionErrorBoundary>
        </>
    );
}
```

File names follow the 2.0.0 section names; they are proposals until OD4 is answered. The shared search-params schema composes over generated contract enums:

```ts
import { z } from "zod";
import { transactionStatusSchema, transactionDirectionSchema } from "@/lib/contract";

const isoDate = z.iso.date().optional().catch(undefined);

export const ledgerSearchParamsSchema = z.object({
    q: z.string().trim().max(120).optional().catch(undefined),
    from: isoDate,
    to: isoDate,
    status: transactionStatusSchema.optional().catch(undefined),
    direction: transactionDirectionSchema.optional().catch(undefined),
    min: z.string().regex(/^\d+$/).optional().catch(undefined),
    max: z.string().regex(/^\d+$/).optional().catch(undefined),
    view: z.string().optional().catch(undefined),
});

export type LedgerSearchParams = z.infer<typeof ledgerSearchParamsSchema>;
```

`min` / `max` are minor units as digit strings (BR1). The two contract schema names are placeholders until the backend publishes the transactions module (A3).

### URL state by page

| Page | Params | Search params | Schema |
|---|---|---|---|
| P02 | — | `next` | `authSearchParamsSchema` (via `internalPath`) |
| P05 | — | `token` | `authSearchParamsSchema` |
| P06 | — | `challenge`, `next` | `authSearchParamsSchema` |
| P07 | — | `step` | `onboardingSearchParamsSchema` |
| P09 | — | `state`, `currency` | `accountsSearchParamsSchema` |
| P10 | `accountId` | `q`, `from`, `to`, `status`, `direction`, `min`, `max`, `view` | `ledgerSearchParamsSchema` |
| P11 | — | as P10 plus `account` | `ledgerSearchParamsSchema.extend` |
| P12 | `transactionId` | — | — |
| P14 | — | as P10 | `ledgerSearchParamsSchema` |
| P15 | — | `a_from`, `a_to`, `b_from`, `b_to`, `accounts` | `compareSearchParamsSchema` |
| P16 | — | `burn`, `inflow`, `months` | `runwaySearchParamsSchema` |
| P17 | — | `account`, `year` | `statementsSearchParamsSchema` |
| P18 | — | `accounts`, `from`, `to`, `format` | `exportSearchParamsSchema` |
| P19 | `counterpartyId` | as P10 | `ledgerSearchParamsSchema` |
| P20 | — | `filter` | `notificationsSearchParamsSchema` |
| P21 | `threadId` | — | — |
| P24 | `memberId` | — | — |
| P26 | — | `payeeId` | `transferSearchParamsSchema` |
| P28 | `slug` | `q` | `helpSearchParamsSchema` |
| P29 | — | `range` | `adminStatsSearchParamsSchema` |
| P30 | — | `q`, `role`, `status` | `adminUsersSearchParamsSchema` |
| P31 | `userId` | — | — |
| P32 | `caseId` | `state` | `complianceSearchParamsSchema` |
| P33 | — | `q` | `supportSearchParamsSchema` |

Dynamic params are opaque IDs passed through untouched; the backend answers 404 for unknown or forbidden IDs.

## Marketing & public

### P01 — Home

- **Route:** `/` · specified `app/(marketing)/page.tsx`; built at `app/page.tsx`.
- **Purpose:** Explain truthfully what Ledgerline is and route the visitor to start (register, sign in, or enquire).
- **Business objective:** Acquisition: convert qualified visitors (R8) into registered owners (R1) starting F5.
- **User objective:** Decide in about a minute whether Ledgerline fits their business and trust it enough to start.
- **Primary tasks:** find out what Ledgerline is and whether it suits their business; understand what is and is not offered; get started (register, or enquire while OD10 is open); sign in; find help.
- **Required data:** none from the network. All copy from constants/`lib/data/`; every claim traceable to a reviewed constant.
- **Permissions:** public. A signed-in visitor still sees the page and is offered P08 as the main next step instead of starting.
- **Device needs:** a phone visitor can read every statement, reach every in-page topic and start from anywhere on the page without hunting for navigation; nothing depends on hover or on motion.
- **Loading states:** statically rendered; content is readable with JavaScript disabled.
- **Empty states:** not applicable (static content); with no verified claims to make, S06 is not rendered.
- **Error states:** root `error.tsx` only. Enquiry validation is owned by S64.
- **Success states:** start action reaches P03 / X11; sign-in reaches P02 (specified) — built page routes both to S64 (OD10).
- **Dependencies:** sections specified — [S04 Marketing proposition](phase-5-section-blueprints.md#s04--marketing-proposition) (what Ledgerline is and who it is for), [S05 Value propositions](phase-5-section-blueprints.md#s05--value-propositions) (four v1 capabilities: see balances, search transactions, statements and exports, team access), [S06 Security & trust statements](phase-5-section-blueprints.md#s06--security--trust-statements), [S07 Public legal & support links](phase-5-section-blueprints.md#s07--public-legal--support-links); sections built — [S55 Public site navigation](phase-5-section-blueprints.md#s55--public-site-navigation), [S56 Headline figures](phase-5-section-blueprints.md#s56--headline-figures) (labelled sample figures; OD9 facet d), [S57](phase-5-section-blueprints.md#s57--accounts-capability)–[S61](phase-5-section-blueprints.md#s61--reconciliation-capability) (accounts, payments and approvals, cards, treasury forecast, reconciliation — beyond v1 scope, OD9), S06 built with placeholder controls (OD9 facet e), [S62 Pricing plans](phase-5-section-blueprints.md#s62--pricing-plans) (sample prices; OD9 facet f), [S63 Frequently asked questions](phase-5-section-blueprints.md#s63--frequently-asked-questions), [S64 Get-started enquiry](phase-5-section-blueprints.md#s64--get-started-enquiry) (OD10). Flows: X2, X1, X11, F5 entry. Backend: none. Decisions: OD9, OD10, OD1.
- **Implementation notes:** static generation, indexable, OpenGraph fields from constants. No testimonials, logos, balances or customer counts presented as real (BR10). Why: every sentence is a claim the product makes to a real business. The built page labels every sample as sample and carries a disclosure; whether that is acceptable for deployment is OD9. Claims rules: capabilities are described only as far as they exist; headline figures appear only if true; protection is described only as behaviour that exists; a price is stated only if one is offered; a visitor can always find out whether Ledgerline is a real bank; the design-study disclosure is present while it applies.

### P28 — Help center

- **Route:** `/help` and `/help/[slug]` · `app/(marketing)/help/page.tsx`, `app/(marketing)/help/[slug]/page.tsx`
- **Purpose:** Answer common questions without contacting support; hand off to secure messaging when self-service fails.
- **Business objective:** Deflect support volume from R5; shorten time to answer.
- **User objective:** Find the answer fast, or reach a human with context.
- **Primary tasks:** find an answer by searching or browsing by topic; read an answer; reach a person when self-service fails; get back to the list of answers.
- **Required data:** articles and categories from `lib/data/`; client search via `use-debounced-search`. No backend.
- **Permissions:** public. R1–R3 also see "Message support" (P21); R4 sees articles only.
- **Device needs:** articles readable on a phone without zoom; search usable with an on-screen keyboard open.
- **Loading states:** statically generated; search results render synchronously from local data.
- **Empty states:** no match → the user is told no articles match and offered messaging (signed in) or sign-in (public).
- **Error states:** unknown slug → `notFound()`.
- **Success states:** article opens; the search term is in `?q=` so results can be shared.
- **Dependencies:** sections [S46 Help search & categories](phase-5-section-blueprints.md#s46--help-search--categories), [S47 Help article](phase-5-section-blueprints.md#s47--help-article), S07. Leads to P21 (R1–R3) or P02 (visitors). Flows: X9. Backend: none.
- **Implementation notes:** `generateStaticParams` and `generateMetadata` read the article list in `lib/data/`. Indexable. The in-app help entry opens the same public route: one source of articles, one URL to share.

## Authentication

All five pages render S08 Authentication step in the `(auth)` layout. The variant is fixed by the route. Signed-in visitors are redirected by `proxy.ts` away from `/auth`, to P08 (or `next`), except P06 when it serves step-up.

### P02 — Sign in

- **Route:** `/auth/login` · `app/(auth)/auth/login/page.tsx` (built at `app/auth/login/page.tsx`)
- **Purpose:** Authenticate a returning user.
- **Business objective:** Reliable, fast access; the most-visited page.
- **User objective:** Get to their balances in one step.
- **Primary tasks:** get into their account; recover a forgotten password; create an account instead; find help.
- **Required data:** `use-login` → `POST /api/session` route handler → backend `POST /api/auth/login` (exists). Sets the httpOnly session cookie.
- **Permissions:** public; signed-in users are redirected away.
- **Device needs:** password managers and autofill work on every device; the form stays usable in phone landscape with the keyboard open.
- **Loading states:** submit shows progress and is disabled; fields are read-only until the response.
- **Empty states:** not applicable.
- **Error states:** wrong credentials → `INVALID_CREDENTIALS` for the attempt as a whole, never saying which field was wrong; focus moves to the message; network failure → `REQUEST_FAILED`; too many attempts and service-unavailable each have their own message (Q-073). Announced politely.
- **Success states:** navigate to `next` (sanitised by `internalPath`) or P08 (staff → P29); P06 when two-step is required.
- **Dependencies:** section [S08 Authentication step](phase-5-section-blueprints.md#s08--authentication-step) `sign-in`. Leads to P04, P03, P28. Flows: X1, X4. Backend: login exists; two-step challenge required (OD6).
- **Implementation notes:** `?next=` parsed with Zod and passed through `internalPath` so an open redirect is impossible. Field `id`/`name` come from constants, not label text. Indexable. Host defects H-01–H-05, H-16 apply (Phase 9).

### P03 — Register

- **Route:** `/auth/register` · `app/(auth)/auth/register/page.tsx`
- **Purpose:** Create a user and session, then start business onboarding.
- **Business objective:** Top of F5; every workspace starts here (BR12).
- **User objective:** Create an account without providing business documents up front.
- **Primary tasks:** create an account without business documents; know the password rules before choosing a password; agree to the terms; sign in instead if they already have an account.
- **Required data:** `use-register` → `POST /api/register` route handler → backend `POST /api/auth/register` (exists).
- **Permissions:** public.
- **Device needs:** as P02; new-password autofill supported.
- **Loading states:** as P02.
- **Empty states:** not applicable.
- **Error states:** email taken → the email is reported as already registered and sign-in is offered; password below `PASSWORD_MIN_LENGTH` → reported before submit; account created but session failed → `SESSION_UNAVAILABLE` with a way to P02 (the user must not register twice).
- **Success states:** navigate to P07.
- **Dependencies:** section S08 `register`. Leads to P02. Flows: X2 → F5. Backend: register exists. Reached from P01 only once OD10 allows it.
- **Implementation notes:** validation composes the generated register DTO schema. Indexable. The password rules are available before the user types; the terms must be accepted before the account is created.

### P04 — Forgot password

- **Route:** `/auth/forgot-password` · `app/(auth)/auth/forgot-password/page.tsx`
- **Purpose:** Start a password reset by email.
- **Business objective:** Recover accounts without support tickets.
- **User objective:** Get back in.
- **Primary tasks:** get a reset link sent to their email; get back to sign in.
- **Required data:** `use-request-password-reset` → reset request endpoint (required).
- **Permissions:** public.
- **Device needs:** email autofill.
- **Loading states:** submit progress.
- **Empty states:** not applicable.
- **Error states:** network failure → `REQUEST_FAILED` with retry. Unknown email is **not** an error.
- **Success states:** identical confirmation for every submitted email, advising the user to check spam and how to get help (P28). Why: a different message would let anyone test which businesses bank here.
- **Dependencies:** section S08 `forgot`. Leads to P02, P28. Flows: X5. Backend: reset request required.
- **Implementation notes:** rate limiting is backend-side; the UI shows the backend's retry-after when present. Indexing per Phase 3 §12 (indexable).

### P05 — Reset password

- **Route:** `/auth/reset-password` · `app/(auth)/auth/reset-password/page.tsx`
- **Purpose:** Set a new password from an emailed token.
- **Business objective:** Complete recovery securely.
- **User objective:** Choose a new password and sign in.
- **Primary tasks:** choose a new password that meets the rules; get a new link when this one no longer works.
- **Required data:** `use-reset-password` → reset confirm endpoint (required). Token from `?token=`.
- **Permissions:** public with a valid token.
- **Device needs:** new-password autofill.
- **Loading states:** submit progress.
- **Empty states:** missing token → the "link invalid" state: the user is told the link cannot be used and offered a new one (P04); no password can be entered.
- **Error states:** expired or used token → the "link invalid" state; weak password → reported before submit with the rules.
- **Success states:** confirmation, then P02; the backend revokes all other sessions.
- **Dependencies:** section S08 `reset`. Leads to P02, P04. Flows: X5. Backend: reset confirm required.
- **Implementation notes:** the token is never logged or put in metadata. `noindex`; `Referrer-Policy: no-referrer` for this segment.

### P06 — Two-step verification

- **Route:** `/auth/verify` · `app/(auth)/auth/verify/page.tsx`
- **Purpose:** Complete a two-step challenge at sign-in, or a step-up challenge before a sensitive action.
- **Business objective:** Protect balances and account numbers with a second factor.
- **User objective:** Pass the check with the least friction.
- **Primary tasks:** prove it is them with a passkey or a code; use a recovery code when they cannot; back out.
- **Required data:** `use-verify-challenge` → two-step / step-up endpoint (required; OD6). Challenge from `?challenge=`.
- **Permissions:** public with a live challenge.
- **Device needs:** one-time-code autofill from SMS/authenticator apps where the platform offers it; numeric keyboard on phones; paste allowed.
- **Loading states:** submit progress; the passkey prompt is the browser's own.
- **Empty states:** missing or expired challenge → "Start again" to P02.
- **Error states:** wrong code → reported with the remaining attempts; lockout → the user is told and offered P28.
- **Success states:** return to `next` (step-up: the page that asked) or P08.
- **Dependencies:** section S08 `verify`. Flows: X1, X4. Decision: OD6. Backend: two-step and step-up required.
- **Implementation notes:** `noindex`. Step-up normally happens in place through C55; this page is the fallback when that cannot complete.

## Workspace app

Every page below renders inside the `(app)` layout. Unless stated, each includes [S03 Page title & actions](phase-5-section-blueprints.md#s03--page-title--actions).

### P07 — Onboarding & verification

- **Route:** `/onboarding` · `app/(app)/onboarding/page.tsx` (session guard, no workspace required)
- **Purpose:** Collect business details, beneficial owners and documents (KYB + owner KYC) and submit them for review.
- **Business objective:** Every workspace verified; verification gates live account data.
- **User objective:** Finish in one sitting, or leave and resume exactly where they stopped.
- **Primary tasks:** tell Ledgerline about the business; name its beneficial owners; provide the documents asked for; check everything and submit it for review; answer a reviewer's request for more information; stop and resume later.
- **Required data:** `use-verification-case`, `use-update-verification-case`, `use-upload-document` (required). Field set depends on OD1.
- **Permissions:** R1 only. Other roles see a permission empty state: "Only the account owner can complete verification".
- **Device needs:** documents can be captured or picked from a phone; the step count and current step are always discoverable on small screens; progress is saved server-side so a member can start on a laptop and finish on a phone.
- **Loading states:** route placeholder; the active step reserves its space so nothing shifts.
- **Empty states:** `not_started` → the user starts at the business step with a one-line explanation of what verification involves.
- **Error states:** save failure → validation errors reported per field and for the step, input kept; upload failure → per-file retry; case fetch failure → S09 error with retry.
- **Success states:** each step saves on continue; submit → S13 reports `submitted` and the user can go on to P08.
- **Dependencies:** sections [S09 Verification progress](phase-5-section-blueprints.md#s09--verification-progress), [S13 Verification status notice](phase-5-section-blueprints.md#s13--verification-status-notice), [S10](phase-5-section-blueprints.md#s10--business-details-form), [S11](phase-5-section-blueprints.md#s11--beneficial-owners-form), [S12](phase-5-section-blueprints.md#s12--document-upload); C52. Flows: F5 (X2 before, P32 internal side). Backend: verification module; OD1.
- **Implementation notes:** active step in `?step=` (`business` · `owners` · `documents` · `review`), falling back to the first incomplete step. S13 shows once the case is not `not_started`. When the case is `needs_info`, the reviewer's requests are given verbatim. Removing an owner is confirmed first (C52).

### P08 — Dashboard

- **Route:** `/dashboard` · `app/(app)/(workspace)/dashboard/page.tsx`
- **Purpose:** Answer "how much cash do we have and what changed" on arrival.
- **Business objective:** Daily habit; the North Star touchpoint for F1.
- **User objective:** Know the cash position and anything needing attention in under five seconds.
- **Primary tasks:** know how much cash the business has and what changed today; check each account; deal with anything waiting on them; see the trend over a chosen range; get to the detail behind a figure.
- **Required data:** `use-accounts`, `use-transactions` (limit and pending), `use-exports`, `use-verification-case`, `use-cash-flow`, `use-workspace`, `use-me` (`GET /api/users/me` exists).
- **Permissions:** R1–R4; composition varies by role (D1–D4).
- **Device needs:** on a phone the member reaches the cash total first and every account in a few actions; charts have a text equivalent that works on a phone.
- **Loading states:** each section loads independently; the as-of time appears once S14 resolves.
- **Empty states:** no accounts (verification pending) → S13 plus S14 "Accounts appear here once verification is approved" (never a zero balance); no activity → S16 empty copy; nothing pending → "Nothing needs attention".
- **Error states:** per section. A failed S18 never hides S14.
- **Success states:** read-only; pending items navigate (export ready → P18, needs info → P07).
- **Dependencies:** sections S03 (workspace name and an "as of" time), [S13 Verification status notice](phase-5-section-blueprints.md#s13--verification-status-notice), [S14 Cash position](phase-5-section-blueprints.md#s14--cash-position), [S15 Account summary](phase-5-section-blueprints.md#s15--account-summary), [S16 Recent activity](phase-5-section-blueprints.md#s16--recent-activity), [S17 Pending items](phase-5-section-blueprints.md#s17--pending-items), [S18 Cash flow over time](phase-5-section-blueprints.md#s18--cash-flow-over-time); which a role receives, and in what priority, is in Role variants. Leads to P10, P11, P12, P18, P07. Flows: F1, D1–D4, X7.
- **Implementation notes:** the role comes from C63, and which sections each role gets is data in `lib/data/dashboard-variants.ts` (`DASHBOARD_VARIANTS`). Balances use short stale times and refetch on focus; the as-of time is always given so a stale figure is never mistaken for a live one.

#### Role variants

Which sections each role gets. This is membership, not an order; how the dashboard is arranged is decided when it is built.

| Section | D1 Owner (R1) | D2 Finance (R2) | D3 Accountant (R3) | D4 Viewer (R4) |
|---|---|---|---|---|
| S13 | when not `approved` | informational, only `needs_info` or `rejected` | — | — |
| S14 | ✓ | ✓ | ✓ | — |
| S15 | ✓ | ✓ | ✓ | permitted accounts |
| S16 | ✓ | ✓ | ✓ | permitted accounts |
| S17 | ✓ | ✓ | ✓ | — |
| S18 | ✓ | ✓ | — | — |

- **D1 Owner.** Verification first because nothing else works until it is approved and only the owner can act on it; then the cash answer, the accounts, what needs a decision, the trend, the raw feed.
- **D2 Finance.** Cash and trend first (forecasting and control); pending items third; S13 only as information.
- **D3 Accountant.** Work queue first; cash last; no in-period trend (accountants compare closed periods in P15).
- **D4 Viewer.** No S14 or S18: both aggregate across all accounts and would disclose balances the viewer may not see. No S17.

```ts
import type { DashboardSectionKey, WorkspaceRole } from "@/lib/types";

export const DASHBOARD_VARIANTS: Record<WorkspaceRole, readonly DashboardSectionKey[]> = {
    owner: ["verification", "cashPosition", "accountSummary", "pendingItems", "cashFlow", "recentActivity"],
    finance: ["cashPosition", "cashFlow", "pendingItems", "accountSummary", "recentActivity", "verificationNotice"],
    accountant: ["pendingItems", "recentActivity", "accountSummary", "cashPosition"],
    viewer: ["accountSummary", "recentActivity"],
};
```

### P09 — Accounts

- **Route:** `/accounts` · `app/(app)/(workspace)/accounts/page.tsx`
- **Purpose:** List every account with its balance and state.
- **Business objective:** Entry to F2; visibility of every account.
- **User objective:** Find the right account and see its balance.
- **Primary tasks:** see what each account holds and its state; narrow to accounts in a given state or currency; put them in the order they need; get into one account; give someone an account's masked number.
- **Required data:** `use-accounts` (required).
- **Permissions:** R1–R3 all accounts; R4 permitted accounts only (backend filters).
- **Device needs:** on a phone, the member can identify every account and read its available balance.
- **Loading states:** route placeholder reserving the section's space.
- **Empty states:** no accounts → the user is told accounts appear once verification is approved, and offered P07 (R1) or told to ask the account owner (others).
- **Error states:** S19 retry.
- **Success states:** navigate to P10.
- **Dependencies:** sections S03 (account count), [S19 Account list](phase-5-section-blueprints.md#s19--account-list). Leads to P10. Flows: F2. Backend: accounts.
- **Implementation notes:** `?state=` and `?currency=` parsed by Zod; currency values from ISO 4217 constants. Closed and frozen accounts stay listed with their state, because their history is needed for statements. Only the masked number (last 4) can be copied here.

### P10 — Account ledger

- **Route:** `/accounts/[accountId]` · `app/(app)/(workspace)/accounts/[accountId]/page.tsx`
- **Purpose:** One account's balance and every transaction, filterable.
- **Business objective:** The core read surface of F2; fast at 5 million rows.
- **User objective:** Find and understand the movements on one account.
- **Primary tasks:** know the account's balance right now; find the movements they care about by date, type, amount or status; understand one transaction; keep a filter to reuse; take the filtered view to export; get the full account number when they need to give it out.
- **Required data:** `use-account`, `use-ledger-summary`, `use-transactions` (infinite, cursor), `use-saved-views` (all required).
- **Permissions:** R1–R4 (R4 only permitted accounts; 404 otherwise). Full-number reveal: step-up for R1–R3, never R4; audit-logged. Export not R4.
- **Device needs:** on a phone, the member can read when, what and how much for every transaction and open any of them; every filter remains available; they can jump to a date instead of scrolling a long history.
- **Loading states:** route placeholder; S23 loading placeholder; loading more shows progress without moving what is already read.
- **Empty states:** no transactions → S23 "none yet"; filters match nothing → "No transactions match these filters" with an offer to clear them. Two messages because the fix differs.
- **Error states:** unknown/forbidden `accountId` → `notFound()`; S22 and S23 fail independently.
- **Success states:** filters apply without reload and are shareable; saving a view confirms and appears in P13.
- **Dependencies:** sections S03 (breadcrumb per Phase 3), [S20 Account overview](phase-5-section-blueprints.md#s20--account-overview), [S21 Ledger filters](phase-5-section-blueprints.md#s21--ledger-filters), [S22 Ledger summary](phase-5-section-blueprints.md#s22--ledger-summary), [S23 Ledger entries](phase-5-section-blueprints.md#s23--ledger-entries). Leads to P12, P13, P18 (prefilled). Flows: F2, F3, X4.
- **Implementation notes:** see [Reference page](#reference-page). Filters written with `router.replace` (no history entry per keystroke). The cursor is not in the URL: a shared link reproduces the filter, not someone's scroll position.

### P11 — Transaction search

- **Route:** `/transactions` · `app/(app)/(workspace)/transactions/page.tsx`
- **Purpose:** Search and filter transactions across every account the user can see.
- **Business objective:** F3 entry point; replaces "email the bank and ask".
- **User objective:** Find a specific payment by amount, counterparty, reference or date in seconds.
- **Primary tasks:** find a specific payment by amount, counterparty, reference or date; narrow to an account, period, amount or status; open what they find; keep the search as a view or export the results.
- **Required data:** `use-transactions` (workspace-wide), `use-saved-views`, `use-accounts` (account filter options).
- **Permissions:** R1–R4; backend limits results to permitted accounts. Export not R4.
- **Device needs:** as P10; on a narrow screen a transaction's own facts take priority over which account it belongs to.
- **Loading states:** previous results stay readable and are marked busy while a new query runs.
- **Empty states:** no query → recent transactions (never a blank page); no match → "No transactions match" echoing the query, with an offer to clear it.
- **Error states:** S23 retry; malformed amount input dropped by the schema.
- **Success states:** URL reflects the query; results update as the user types (debounced).
- **Dependencies:** sections S21 search variant, S23 cross-account variant. Leads to P12, P13, P14, P18. Flows: F3; C38 hands off with `?q=`. Backend: transactions search.
- **Implementation notes:** reuses `ledgerSearchParamsSchema.extend({ account })`. Static children `/transactions/views` and `/transactions/flagged` take precedence over `[transactionId]` by the router's rules. Arriving from the command palette (C38), focus is in the query.

### P12 — Transaction detail

- **Route:** `/transactions/[transactionId]` · full page `app/(app)/(workspace)/transactions/[transactionId]/page.tsx`; intercepted route `app/(app)/(workspace)/@drawer/(.)transactions/[transactionId]/page.tsx`
- **Purpose:** Everything about one transaction, and the place to annotate it.
- **Business objective:** Close investigations inside Ledgerline; annotations feed accounting.
- **User objective:** Understand a payment, prove it, leave a note for the accountant.
- **Primary tasks:** understand a payment — how much, where it stands, who with, from which account; see how it progressed; leave a note, category, flag or receipt for the accountant; share it with a teammate.
- **Required data:** `use-transaction`, `use-update-transaction`, `use-upload-attachment` (required).
- **Permissions:** R1–R4 read; annotate R1–R3; R4 read-only (C59). A share link opens only for members who can see that account.
- **Device needs:** opened from a list, the detail must return the member to the same list position on every device; receipts can be photographed and attached from a phone.
- **Loading states:** opening is immediate; the amount already known from the list is given while the rest loads.
- **Empty states:** no notes/attachments → invite the first note; a lifecycle with one state shows that state.
- **Error states:** unknown/forbidden ID → opened from a list, the member returns to it with a message; loaded directly, segment `not-found`. Annotation save failure → reported, draft kept.
- **Success states:** note/category/flag save optimistically and reconcile; the list the member came from updates from the same cache.
- **Dependencies:** sections [S24 Transaction detail](phase-5-section-blueprints.md#s24--transaction-detail), [S25 Transaction lifecycle](phase-5-section-blueprints.md#s25--transaction-lifecycle), [S26 Notes & attachments](phase-5-section-blueprints.md#s26--notes--attachments). Leads to P19, P10. Flows: F3.
- **Implementation notes:** soft navigation from a list opens the intercepted route; hard loads and shared links render the full page. Closing calls `router.back()` so Back and Escape behave the same and focus returns to the originating row. The overlay file exports no `metadata`. Removing an attachment is confirmed first (C52).

### P13 — Saved views

- **Route:** `/transactions/views`
- **Purpose:** Manage named filter sets over transactions.
- **Business objective:** Repeat visits with zero setup.
- **User objective:** Reopen "Card spend this month" in one action.
- **Primary tasks:** get back to a saved filter in one step; rename or delete a view; choose the view they start from.
- **Required data:** `use-saved-views` (required; see Phase 8 open question on storage); each view carries a plain-language filter summary, and last used and match count when known.
- **Permissions:** R1–R4; each member manages their own views.
- **Device needs:** views can be opened and renamed on a phone.
- **Loading states:** route placeholder.
- **Empty states:** "Save a filter from any ledger to see it here", offering P11.
- **Error states:** S27 retry; rename conflict reported, the new name kept for correction.
- **Success states:** rename is confirmed; delete is confirmed first (C52) naming the view.
- **Dependencies:** sections S03, [S27 Saved views list](phase-5-section-blueprints.md#s27--saved-views-list). Leads to P10, P11 (with `?view=`), P11 when empty. Flows: F3.
- **Implementation notes:** a view is a serialised `LedgerSearchParams`; opening it navigates to the URL form.

### P14 — Flagged transactions

- **Route:** `/transactions/flagged`
- **Purpose:** The follow-up list: every flagged transaction.
- **Business objective:** Nothing flagged is forgotten at month end.
- **User objective:** Work through flagged items and clear them.
- **Primary tasks:** work through what was flagged; find a particular flagged item; clear a flag once resolved; export the list.
- **Required data:** `use-transactions` with the flag filter, including who flagged each transaction.
- **Permissions:** R1–R4 view; unflag R1–R3; export not R4.
- **Device needs:** as P11.
- **Loading states:** as P11.
- **Empty states:** "Nothing flagged", with how flagging works.
- **Error states:** S23 retry.
- **Success states:** unflagging removes the transaction from the list and can be undone.
- **Dependencies:** sections S03 (flagged count), S21 with `flagged=true` fixed, S23. Leads to P12, P18. Flows: F3.
- **Implementation notes:** `flagged` passed as a fixed prop, not a URL param.

### P15 — Compare periods

- **Route:** `/insights/compare`
- **Purpose:** Compare inflows, outflows and categories across two periods.
- **Business objective:** Month-on-month review happens in Ledgerline, not a spreadsheet.
- **User objective:** See what changed between two months and why.
- **Primary tasks:** see what changed between two periods and why; choose which periods and accounts to compare, or swap them; look into one category; export what they found.
- **Required data:** `use-compare-periods` (required): net change, inflow and outflow per period, change by category, top counterparties; chart through C30 (LD1).
- **Permissions:** R1, R2, R3. R4 gets a permission empty state.
- **Device needs:** both periods can be chosen with native date inputs on a phone; the comparison has a text equivalent.
- **Loading states:** S28 loading placeholder reserving its space.
- **Empty states:** a period with no data says so for that side only.
- **Error states:** S28 retry; end-before-start prevented by the schema.
- **Success states:** URL updates; drill-in → P11 with category and period.
- **Dependencies:** sections S03, [S28 Period comparison](phase-5-section-blueprints.md#s28--period-comparison). Leads to P11, P18. Flows: F4. Library LD1.
- **Implementation notes:** default is last full month vs the one before. Deltas are computed by the backend in minor units.

### P16 — Runway calculator

- **Route:** `/insights/runway`
- **Purpose:** Estimate months of runway from current cash and average net burn, with adjustable assumptions.
- **Business objective:** Owners open Ledgerline for planning, not just checking.
- **User objective:** Know how long the business can operate at current burn, and what changes it.
- **Primary tasks:** find out how many months the business can run; try different burn and inflow assumptions; see how cash projects forward; go back to the actual figures; share the scenario.
- **Required data:** `use-accounts`, `use-cash-flow`; calculation is a pure function in `lib/utils/`.
- **Permissions:** R1, R2.
- **Device needs:** inputs editable with a numeric keyboard; the result has a text equivalent.
- **Loading states:** inputs usable immediately; defaults fill in when loaded.
- **Empty states:** < 3 months of history → runs from manual input and says why defaults are missing.
- **Error states:** defaults failed → the user is told and enters their own figures; the calculation cannot fail.
- **Success states:** live result; assumptions in the URL.
- **Dependencies:** sections S03, [S29 Runway calculator](phase-5-section-blueprints.md#s29--runway-calculator). DOMAIN_TOOL; LD1.
- **Implementation notes:** an owner may make a hiring decision from this number, so it is never shown without its assumptions. (The built home page's S60 "treasury forecast" is a different, unspecified capability — OD9.) The result is always identified as an estimate.

### P17 — Statements

- **Route:** `/statements`
- **Purpose:** Download monthly account statements (PDF).
- **Business objective:** Remove "send me the statement" requests.
- **User objective:** The statement for a month and account in two actions.
- **Primary tasks:** get the statement for a given month and account.
- **Required data:** `use-statements` (required), including each statement's opening and closing balance.
- **Permissions:** R1, R2, R3.
- **Device needs:** downloads work on phones (the file opens or saves per platform).
- **Loading states:** route placeholder; progress for the statement whose download link is being requested.
- **Empty states:** "Your first statement is ready after the month closes" with the date.
- **Error states:** S30 retry; a failed download link is reported for that statement only, with retry.
- **Success states:** download starts; the statement is marked downloaded for this session.
- **Dependencies:** sections S03, [S30 Statement list](phase-5-section-blueprints.md#s30--statement-list). Flows: F4, X7. Format depends on OD1.
- **Implementation notes:** download URLs are short-lived and fetched on click, never rendered into HTML.

### P18 — Exports

- **Route:** `/exports`
- **Purpose:** Build CSV/OFX-style exports and download them when ready.
- **Business objective:** Feed the customer's accounting system.
- **User objective:** A file their accounting tool accepts without cleanup.
- **Primary tasks:** get a file their accounting tool accepts; choose which accounts, period and format; know when it is ready and download it; recover a failed or expired export.
- **Required data:** `use-create-export`, `use-exports` (polls only while a job is `queued`/`running`).
- **Permissions:** R1, R2, R3.
- **Device needs:** a member can start an export on a phone and download it later on a desktop.
- **Loading states:** running jobs show progress and elapsed time.
- **Empty states:** "Exports you create appear here".
- **Error states:** create failure reported, input kept; `failed` gives the reason and offers retry; `expired` offers to recreate.
- **Success states:** the new job is listed at once as `queued`; `ready` raises a message and an X7 notification.
- **Dependencies:** sections S03, [S31 Export builder](phase-5-section-blueprints.md#s31--export-builder), [S32 Export jobs](phase-5-section-blueprints.md#s32--export-jobs). Flows: F4, X7.
- **Implementation notes:** P10, P11, P14, P15 link here with prefilled params. Polling interval from constants, backing off after a minute. The user is always told whether pending transactions are included.

### P19 — Counterparty

- **Route:** `/counterparties/[counterpartyId]`
- **Purpose:** Everything exchanged with one payer or payee.
- **Business objective:** Supports investigations and vendor-spend questions.
- **User objective:** "How much have we paid this supplier, and when?"
- **Primary tasks:** find out how much they have paid to or received from this party, and when; change the period.
- **Required data:** `use-counterparty`, `use-transactions` (counterparty filter).
- **Permissions:** R1–R4; R4 sees permitted accounts only. Export not R4.
- **Device needs:** as P11.
- **Loading states:** S33 and S23 load independently.
- **Empty states:** no transactions in range → S23 copy with range reset.
- **Error states:** unknown ID → `notFound()`.
- **Success states:** read-only.
- **Dependencies:** sections S03 (counterparty name), [S33 Counterparty summary](phase-5-section-blueprints.md#s33--counterparty-summary), S23 filtered to this counterparty. Leads to P12, P18. Flows: F3.
- **Implementation notes:** reuses `ledgerSearchParamsSchema`.

### P20 — Notifications

- **Route:** `/notifications`
- **Purpose:** The full history of alerts and system notices.
- **Business objective:** Alerts that are read and acted on.
- **User objective:** See what happened while away and jump to it.
- **Primary tasks:** catch up on what happened while away; mark things read, one or all; go to what a notification is about; see only unread; manage alert rules (R1, R2).
- **Required data:** `use-notifications` (required); the count in S02 reads the same cache.
- **Permissions:** R1–R4, own notifications.
- **Device needs:** each notification opens its subject on a phone.
- **Loading states:** route placeholder.
- **Empty states:** "You're all caught up", offering P22 alert rules (R1, R2).
- **Error states:** S34 retry; mark-read failure reverts with a message.
- **Success states:** mark read is optimistic; the count updates at once.
- **Dependencies:** sections S03, [S34 Notification feed](phase-5-section-blueprints.md#s34--notification-feed). Leads to P22 (R1, R2) and each notification's subject. Flows: X7.
- **Implementation notes:** `?filter=unread`. Cursor pagination through C25.

### P21 — Messages

- **Route:** `/messages`, `/messages/[threadId]` · with a `messages/layout.tsx`
- **Purpose:** Secure messaging between the workspace and Ledgerline support.
- **Business objective:** Support without email, identity already established.
- **User objective:** Ask, attach a document, see the reply in one place.
- **Primary tasks:** ask support something and attach a document; see replies; carry on a conversation; resend a message that failed.
- **Required data:** `use-threads`, `use-thread`, `use-send-message` (required).
- **Permissions:** R1, R2, R3. R4 has no nav entry; a direct visit gets a permission empty state.
- **Device needs:** on small screens, the thread list and a single conversation are each fully usable, with a clear way back to the list; attachments from the phone's files or camera.
- **Loading states:** route placeholder; a reply can be written while messages load.
- **Empty states:** no threads → "Start a conversation", offering P28; threads but none selected → "Select a conversation".
- **Error states:** unknown thread → `notFound()` in the layout; send failure keeps the draft and marks the message "Not sent — Retry".
- **Success states:** the sent message is shown at once and settles with the server time.
- **Dependencies:** sections S03, [S36 Thread list](phase-5-section-blueprints.md#s36--thread-list), [S37 Conversation](phase-5-section-blueprints.md#s37--conversation). Leads to P28. Flows: X9.
- **Implementation notes:** the layout keeps S36 across threads. Unsent drafts persist per thread with `useSyncExternalStore` + `localStorage`, cleared on send and sign-out.

### P22 — Workspace settings

- **Route:** `/settings`
- **Purpose:** Workspace name and defaults, and alert rules.
- **Business objective:** Useful rather than noisy alerts.
- **User objective:** Set the low-balance threshold and large-transaction limit once.
- **Primary tasks:** set the low-balance and large-transaction alerts once; change, pause or remove a rule; keep workspace details current.
- **Required data:** `use-workspace`, `use-update-workspace`, `use-alert-rules`, `use-update-alert-rules`.
- **Permissions:** R1 all; R2 alert rules only; R3, R4 see a permission empty state.
- **Device needs:** amounts entered with a numeric keyboard; unsaved changes are protected on every device.
- **Loading states:** route placeholder.
- **Empty states:** no alert rules → recommended starter rules as one-action additions (values from constants).
- **Error states:** errors reported per form, values kept.
- **Success states:** save per form with confirmation; unsaved-changes guard.
- **Dependencies:** sections S03, [S35 Alert rules](phase-5-section-blueprints.md#s35--alert-rules), [S38 Workspace general form](phase-5-section-blueprints.md#s38--workspace-general-form). Leads to P23, P25 (settings group, Phase 3). Flows: X7. LD3.
- **Implementation notes:** movement between P22, P23 and P25 comes from the nav config, not a separate layout. Deleting a rule is confirmed first (C52).

### P23 — Team

- **Route:** `/settings/team`
- **Purpose:** See who has access, invite teammates, change roles.
- **Business objective:** More members per workspace with least privilege.
- **User objective:** Give the accountant access in a minute without over-sharing.
- **Primary tasks:** give a teammate access at the right level; resend or withdraw an invitation; change what someone can do; remove someone; understand what each role allows.
- **Required data:** `use-team`, `use-invite-member`; S41 from `lib/data/`.
- **Permissions:** R1 all actions; R2 invites R3/R4 only and cannot change R1/R2. R3, R4 get a permission empty state.
- **Device needs:** inviting and changing a role are possible on a phone; the permissions reference is readable on a phone.
- **Loading states:** route placeholder.
- **Empty states:** only the owner → the owner is listed and the user is invited to add teammates.
- **Error states:** invite to an existing member → reported, input kept; role change failure reverts with a message.
- **Success states:** invitation appears as pending; role change is optimistic.
- **Dependencies:** sections S03, [S39 Team members](phase-5-section-blueprints.md#s39--team-members), [S40](phase-5-section-blueprints.md#s40--invite-member-form), [S41 Role permissions reference](phase-5-section-blueprints.md#s41--role-permissions-reference). Leads to P24. Flows: X6. Only path for non-owner members to join (BR12).
- **Implementation notes:** the last owner cannot be removed or demoted; the action is unavailable with the reason given. Revoking an invitation and removing a member are confirmed first (C52); removal names the person and what they lose.

### P24 — Team member profile

- **Route:** `/settings/team/[memberId]`
- **Purpose:** One member's details, role and effective permissions.
- **Business objective:** Access reviews.
- **User objective:** Check exactly what a teammate can do before changing it.
- **Primary tasks:** check exactly what a teammate can do; change their role; remove them.
- **Required data:** `use-team-member`; S41 from `lib/data/`.
- **Permissions:** R1, R2 (same limits as P23).
- **Device needs:** readable on a phone.
- **Loading states:** route placeholder.
- **Empty states:** not applicable.
- **Error states:** unknown or removed member → `notFound()`.
- **Success states:** role change confirms.
- **Dependencies:** sections S03 (member name; back to P23), [S42 Profile form](phase-5-section-blueprints.md#s42--profile-form) read variant, S41 identifying this member's role. Flows: X6 (ROLE profile).
- **Implementation notes:** S42 is the same section as on P25 in its read variant. Removal is confirmed first (C52).

### P25 — Profile & security

- **Route:** `/settings/profile`
- **Purpose:** The user's own details, password, two-step and sessions.
- **Business objective:** Account-takeover resistance.
- **User objective:** Keep the account secure and sign out a lost device.
- **Primary tasks:** keep their details current; change their password; turn two-step on or off; sign out a lost device or every other device.
- **Required data:** `use-me` (exists), `use-update-profile`, `use-change-password`, `use-sessions`, `use-two-step`.
- **Permissions:** R1–R4 self. Password change, two-step changes and revoke-all require step-up.
- **Device needs:** passkey enrolment works on the device in hand; TOTP enrolment can be completed without scanning (a copyable key).
- **Loading states:** route placeholder.
- **Empty states:** only the current session → it is identified as this device.
- **Error states:** per form; wrong current password reported, input kept.
- **Success states:** confirmations; revoking the current session signs out (X3) after confirmation.
- **Dependencies:** sections S03, [S43 Security settings](phase-5-section-blueprints.md#s43--security-settings), S42 edit variant. Flows: X8, X4. Decision: OD6.
- **Implementation notes:** email change is not offered here; it needs verification of the new address (Phase 8 open item). Revoking all other sessions is confirmed first (C52).

## Payments

v1 is read-only; availability is governed by OD3 and recorded in Phase 8 as Deferred. Both pages are fully specified so the decision, not the design, is the only thing left. Until the server-side money-movement switch is on, both routes call `notFound()` (P34) with no nav entry. A "coming soon" page would promise a regulated capability. **OD9:** the built home page presents payments with approvals; if the maintainer chooses side B, these pages are the starting point and gain an approval step.

### P26 — Transfer

- **Route:** `/payments/transfer`
- **Purpose:** Move money between own accounts or to a saved payee.
- **Business objective:** Turns the console into an operating account (F6).
- **User objective:** Send the right amount to the right place, once, with certainty.
- **Primary tasks:** send the right amount from the right account to the right place; check everything before committing; confirm it is really them; know it went through and when it will settle.
- **Required data:** `use-accounts`, `use-create-transfer` (transfers module; not in the v1 backend plan).
- **Permissions:** R1, R2; step-up on confirm; limits and dual approval per OD3/OD9.
- **Device needs:** a transfer can be reviewed in full on a phone before confirming.
- **Loading states:** confirm disabled until the backend answers.
- **Empty states:** fewer than two accounts and no payees → the user is told why and offered P27.
- **Error states:** insufficient funds, limit exceeded, cut-off passed → reported with the backend's reason; a "may have gone through" state never auto-retries.
- **Success states:** confirmation with reference; appears in P10 as `pending`.
- **Dependencies:** sections S03, [S44 Transfer form](phase-5-section-blueprints.md#s44--transfer-form). Flows: F6, X4. Decision: OD3.
- **Implementation notes:** idempotency key from `nanoid` per review step; amount held as minor units in a string. Before confirming, the user is given the amount in figures and words, the source with its available balance, the destination, reference and date; after confirming, a reference and expected settlement.

### P27 — Payees & bill pay

- **Route:** `/payments`
- **Purpose:** Manage payees and pay bills.
- **Business objective:** F7.
- **User objective:** Keep a trusted payee list and pay from it.
- **Primary tasks:** keep a trusted list of payees; add one and verify its details; pay one (→ P26); remove one.
- **Required data:** `use-payees` (payees module; not in v1 plan), including last paid and total paid per payee.
- **Permissions:** R1, R2; adding a payee requires step-up.
- **Device needs:** as P26.
- **Loading states:** route placeholder.
- **Empty states:** "Add your first payee".
- **Error states:** S45 retry; duplicate payee reported, input kept.
- **Success states:** payee added; pay opens P26 with the payee preselected.
- **Dependencies:** sections S03, [S45 Payee list](phase-5-section-blueprints.md#s45--payee-list). Leads to P26. Flows: F7, X4. Decision: OD3.
- **Implementation notes:** nav visibility is read from the nav config and the server-side switch; a direct visit while off renders P34. Destinations are always masked. Removing a payee is confirmed first (C52).

## Internal (admin)

Every page below renders inside the `(admin)` layout, which checks the internal role server-side and renders P34 for anyone else. These pages are used all day by the same people; staff need speed over explanation.

### P29 — Admin overview

- **Route:** `/admin`
- **Purpose:** Platform health for internal staff.
- **Business objective:** Spot growth and anomalies early (D7).
- **User objective:** Know user totals and the trend; jump to work queues.
- **Primary tasks:** know how many users there are and how that is trending; look at a different range; get to users, compliance or support work.
- **Required data:** `use-admin-user-total`, `use-admin-user-series` (both endpoints exist); the total for the period with its change against the previous period.
- **Permissions:** R7 full; R5, R6 read.
- **Device needs:** figures readable on a phone; the series has a text equivalent.
- **Loading states:** each figure and the series load independently.
- **Empty states:** no points → "No sign-ups in this range".
- **Error states:** each figure and the series fail and retry independently.
- **Success states:** read-only.
- **Dependencies:** sections S03, [S48 Platform growth figures](phase-5-section-blueprints.md#s48--platform-growth-figures). Leads to P30, P32, P33. Flows: D7. LD1.
- **Implementation notes:** `?range=` parsed against the stats endpoint's enum.

### P30 — Admin users

- **Route:** `/admin/users`
- **Purpose:** Find, create and manage platform users.
- **Business objective:** Operational control (D7).
- **User objective:** Find a user by email in seconds; create one when needed.
- **Primary tasks:** find a user by email in seconds; narrow by role or status; create a user when needed; open a user.
- **Required data:** `use-admin-users` → `GET /api/users`; `use-create-user` → `lib/actions/create-user.ts` → `POST /api/users` (both exist).
- **Permissions:** R7 only.
- **Device needs:** search and open a user from a phone.
- **Loading states:** route placeholder.
- **Empty states:** no match → "No users match" with an offer to clear the search.
- **Error states:** S49 retry; duplicate email on create → reported as already in use, input kept.
- **Success states:** the created user is confirmed and listed immediately.
- **Dependencies:** sections S03, [S49 Platform user directory](phase-5-section-blueprints.md#s49--platform-user-directory); creation through C21. Leads to P31. Flows: D7. LD2.
- **Implementation notes:** `role` and `status` enums come from the generated contract. `GET /api/users` is unpaged today (Phase 5 Q3).

### P31 — Admin user detail

- **Route:** `/admin/users/[userId]`
- **Purpose:** View and edit one user; suspend or delete.
- **Business objective:** Resolve account problems (D7).
- **User objective:** Change status or role correctly, with a record.
- **Primary tasks:** check a user's status and details; correct their role or status with a record; suspend or reactivate them; delete them when that is really intended.
- **Required data:** `use-admin-user` → `GET`/`PATCH`/`DELETE /api/users/{id}` (exist).
- **Permissions:** R7 edit; R5 read-only with the reason.
- **Device needs:** destructive actions require the same typed confirmation on every device.
- **Loading states:** route placeholder.
- **Empty states:** not applicable.
- **Error states:** unknown ID → `notFound()`; save failure reported, input kept.
- **Success states:** save confirmation; delete returns to P30.
- **Dependencies:** sections S03 (user email; back to P30), [S50 Admin user record](phase-5-section-blueprints.md#s50--admin-user-record). Flows: D7; audit log required.
- **Implementation notes:** an admin cannot delete or demote themselves. Suspension (reversible) is always offered before deletion (irreversible); deleting requires typing the user's email.

### P32 — Compliance queue

- **Route:** `/admin/compliance`, `/admin/compliance/[caseId]` · with a `compliance/layout.tsx`
- **Purpose:** Review KYB/KYC cases and decide them.
- **Business objective:** Fast, consistent, auditable decisions (D6, F5).
- **User objective:** Work oldest-first and decide each case with the evidence in view.
- **Primary tasks:** work through cases oldest first; narrow to a state; review a case's evidence; approve it, reject it with a reason, or ask for more information.
- **Required data:** `use-compliance-cases`, `use-compliance-case`, `use-decide-case` (required); the queue reports the oldest waiting case and the count of `submitted` cases; a case carries business details, owners, documents and history.
- **Permissions:** R6, R7. The backend blocks a reviewer deciding a case for a workspace they belong to.
- **Device needs:** decisions are possible on a tablet; document review on a phone is supported but not optimised.
- **Loading states:** document previews load lazily.
- **Empty states:** "No cases waiting".
- **Error states:** unknown case → `notFound()` in the layout; decision failure keeps the note; conflict shows the other decision.
- **Success states:** decision recorded; the next case opens.
- **Dependencies:** sections [S51 Compliance case queue](phase-5-section-blueprints.md#s51--compliance-case-queue), [S52 Compliance case review](phase-5-section-blueprints.md#s52--compliance-case-review). Flows: D6, F5. Decision: OD1.
- **Implementation notes:** the layout keeps queue filters across cases. Rejecting requires a reason; requesting information requires a note.

### P33 — Support console

- **Route:** `/admin/support`
- **Purpose:** Look up a workspace or user to help a customer, read-only.
- **Business objective:** Resolve tickets without database access (D5).
- **User objective:** Find the customer from what they said and see the state that explains their problem.
- **Primary tasks:** find the customer from what they said; understand the state that explains their problem; read their message thread.
- **Required data:** `use-support-lookup` (required); results grouped by workspace and user, each with status.
- **Permissions:** R5, R7. Every lookup audit-logged. No balances or full account numbers.
- **Device needs:** usable on a laptop and tablet.
- **Loading states:** previous results stay readable, marked busy.
- **Empty states:** before search → what can be searched; no match → "No workspace or user matches".
- **Error states:** S53 retry.
- **Success states:** results link to P31 and the thread.
- **Dependencies:** sections S03, [S53 Support lookup](phase-5-section-blueprints.md#s53--support-lookup). Leads to P31 and the thread. Flows: D5, X9.
- **Implementation notes:** minimum query length from constants.

## System

### P34 — Not found (404)

- **Route:** `app/not-found.tsx`; per segment `(app)`, `(admin)`
- **Purpose:** Explain that the address does not exist or is not available, and offer a way on.
- **Business objective:** Retain users who follow stale links.
- **User objective:** Get back to something useful.
- **Primary tasks:** get back to something useful; find help.
- **Required data:** none.
- **Permissions:** all. Inside `(app)` it renders within the `(app)` layout.
- **Device needs:** none beyond the baseline.
- **Loading states:** none.
- **Empty states / Error states:** not applicable.
- **Success states:** the user is told plainly the page does not exist and offered one way on — P08 when signed in, P01 otherwise — and P28.
- **Dependencies:** section [S54 Status explanation](phase-5-section-blueprints.md#s54--status-explanation) `not-found`. Flows: X10.
- **Implementation notes:** returns HTTP 404. Used deliberately for forbidden resources and for the admin area seen by non-staff.

### P35 — Server error (500)

- **Route:** `app/error.tsx`, `app/global-error.tsx`; per segment `error.tsx`
- **Purpose:** Recover from a page that failed to render.
- **Business objective:** Keep trust when something breaks; get a diagnosable report.
- **User objective:** Try again, or get out, without losing their place.
- **Primary tasks:** try again; get out without losing their place; contact support with a reference.
- **Required data:** the error `digest`.
- **Permissions:** all.
- **Device needs:** none beyond the baseline.
- **Loading states:** retry shows progress.
- **Empty states:** not applicable.
- **Error states:** a second failure keeps the page and leads with the support route in the copy.
- **Success states:** `reset()` re-renders the segment.
- **Dependencies:** section S54 `error` (and `offline` when the browser is offline). Leads to P08 or P01, and P21 (signed in) or P28. Flows: X10; `GET /api/health` (exists) distinguishes "we are down" from "this page failed".
- **Implementation notes:** `global-error.tsx` renders its own `<html>` and `<body>` and depends on no provider. No stack traces or backend messages. The user is told that viewing failed and money was not affected, and given the error `digest` as a reference.

## Page index

| ID | Page | Route | Group | Roles | Sections | Serves |
|---|---|---|---|---|---|---|
| P01 | Home | `/` | (marketing) | public | S04 S05 S06 S07; built S55–S64 | acquisition, X2, X11 |
| P02 | Sign in | `/auth/login` | (auth) | public | S08 | X1 |
| P03 | Register | `/auth/register` | (auth) | public | S08 | X2, F5 |
| P04 | Forgot password | `/auth/forgot-password` | (auth) | public | S08 | X5 |
| P05 | Reset password | `/auth/reset-password` | (auth) | public (token) | S08 | X5 |
| P06 | Two-step verification | `/auth/verify` | (auth) | public (challenge) | S08 | X1, X4 |
| P07 | Onboarding & verification | `/onboarding` | (app) | R1 | S09–S13 | F5 |
| P08 | Dashboard | `/dashboard` | (app) | R1–R4 | S01 S02 S03 S13–S18 | F1, D1–D4 |
| P09 | Accounts | `/accounts` | (app) | R1–R4 | S03 S19 | F2 |
| P10 | Account ledger | `/accounts/[accountId]` | (app) | R1–R4 | S03 S20–S23 | F2 |
| P11 | Transaction search | `/transactions` | (app) | R1–R4 | S03 S21 S23 | F3 |
| P12 | Transaction detail | `/transactions/[transactionId]` + intercepted route | (app) | R1–R4 | S24 S25 S26 | F3 |
| P13 | Saved views | `/transactions/views` | (app) | R1–R4 | S03 S27 | F3 |
| P14 | Flagged transactions | `/transactions/flagged` | (app) | R1–R4 | S03 S21 S23 | F3 |
| P15 | Compare periods | `/insights/compare` | (app) | R1 R2 R3 | S03 S28 | F4 |
| P16 | Runway calculator | `/insights/runway` | (app) | R1 R2 | S03 S29 | DOMAIN_TOOL |
| P17 | Statements | `/statements` | (app) | R1 R2 R3 | S03 S30 | F4 |
| P18 | Exports | `/exports` | (app) | R1 R2 R3 | S03 S31 S32 | F4 |
| P19 | Counterparty | `/counterparties/[counterpartyId]` | (app) | R1–R4 | S03 S33 S23 | F3 |
| P20 | Notifications | `/notifications` | (app) | R1–R4 | S03 S34 | X7 |
| P21 | Messages | `/messages`, `/messages/[threadId]` | (app) | R1–R3 | S03 S36 S37 | X9 |
| P22 | Workspace settings | `/settings` | (app) | R1 (R2 alert rules) | S03 S38 S35 | X7 |
| P23 | Team | `/settings/team` | (app) | R1 R2 | S03 S39 S40 S41 | X6 |
| P24 | Team member profile | `/settings/team/[memberId]` | (app) | R1 R2 | S03 S42 S41 | X6 |
| P25 | Profile & security | `/settings/profile` | (app) | R1–R4 | S03 S42 S43 | X8 |
| P26 | Transfer | `/payments/transfer` | (app) | R1 R2 | S03 S44 | F6 |
| P27 | Payees & bill pay | `/payments` | (app) | R1 R2 | S03 S45 | F7 |
| P28 | Help center | `/help`, `/help/[slug]` | (marketing) | all | S46 S47 S07 | X9 |
| P29 | Admin overview | `/admin` | (admin) | R7 (R5 R6 read) | S01 S02 S03 S48 | D7 |
| P30 | Admin users | `/admin/users` | (admin) | R7 | S03 S49 | D7 |
| P31 | Admin user detail | `/admin/users/[userId]` | (admin) | R7 (R5 read) | S03 S50 | D7 |
| P32 | Compliance queue | `/admin/compliance`, `/[caseId]` | (admin) | R6 R7 | S03 S51 S52 | D6, F5 |
| P33 | Support console | `/admin/support` | (admin) | R5 R7 | S03 S53 | D5 |
| P34 | Not found (404) | `app/not-found.tsx` + segments | system | all | S54 | X10 |
| P35 | Server error (500) | `app/error.tsx`, `app/global-error.tsx` + segments | system | all | S54 | X10 |

Totals: 35 pages; 2 marketing & public, 5 authentication, 19 workspace app, 2 payments, 5 internal, 2 system.

## Changes in this version

- **Retained:** all 35 pages with purpose, objectives, tasks, data, permissions, states, dependencies and implementation notes; route groups, segment files, composition contract, metadata rules, enforcement layers, state ladder, reference page, URL state table, D1–D4 role variants and `DASHBOARD_VARIANTS`.
- **Changed:** "Modules" replaced by Content requirements (since removed, see Self-audit below); "Responsive behavior" replaced by **Device needs**; the responsive frame table and named layout classes (`.app-shell`, `.page-stack`, `.band-grid`, `.split-view`, `.form-column`, `.auth-frame`, `.context-rail`, `.collapse-grid`, `.nav-floating`, `.measure`) removed; heading-size rules, row heights, "editorial register" and motion allowances removed; reference-page code stripped of class names and renamed to 2.0.0 section names; route tree shows the `(workspace)` nested group from Phase 7; section and contract names updated; P26 `payeeId` search param made explicit; P04 indexability aligned with Phase 3 §12.
- **Added:** P01 dependencies now list the built sections S55–S64 against the specified S04–S07, with OD9 and OD10 noted; X11 on P01; the device baseline; notes on the built locations of P01 and P02.

- **Self-audit (tightened seed, No Visual Prescription):** "Content requirements" and "Actions" removed from all 35 pages. Section mapping, primary information and reachability moved to **Dependencies**; genuine requirements moved to the field they belong to (security, permission, confirmation and truthfulness rules — see the maintainer report); data facts moved to **Required data**. "Primary tasks" rewritten as user goals. Placement and container wording in states, device needs and conventions ("inside the shell", "frame", "overlay closes", "row", "inline", "per block", "chart placeholder", "tables", "highlighted") rewritten as behaviour. No page, section, state, flow, permission or open decision removed.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md) (personas R1–R8, BR1–BR12, OD1–OD10), [Phase 2](phase-2-experience-maps.md) (F, D, X flows), [Phase 3](phase-3-information-architecture.md) (routes, groups, navigation, SEO).
- **Downstream:** [Phase 5](phase-5-section-blueprints.md) specifies every section named here; [Phase 6](phase-6-interaction-contracts.md) supplies the contracts (C21, C22, C32, C33, C55, C57–C59); [Phase 7](phase-7-frontend-architecture.md) maps pages to files; [Phase 8](phase-8-implementation-roadmap.md) records every page's status; [Phase 9](phase-9-qa-checklist.md) checks each page's states, permissions and device needs.

## Assumptions

Global assumptions A1–A10 are in [Phase 1](phase-1-product-vision.md#assumptions). This phase relies on A2, A3, A4, A6, A8, A9, A10 and adds:

| ID | Assumption |
|---|---|
| PA1 | Route groups contain the URL folder so public paths match Phase 3. |
| PA2 | *Withdrawn in 2.0.0 (named layout classes — visual).* |
| PA3 | `PAGE_TITLES` and `APP_ROBOTS` live in `lib/constants.ts`. |
| PA4 | Empty-state, permission and status copy lives in `lib/data/`; help articles in `lib/data/help-articles.ts`. |
| PA5 | Search-params schemas live in `lib/validations/<name>-search-params.ts`. |
| PA6 | Feature folders under OD4 (`components/shell/`, `components/ledger/`, …); section file names follow the 2.0.0 section names. |
| PA7 | `SectionErrorBoundary` (C58) takes a `skeleton` prop and renders `<Suspense>` inside itself. |
| PA8 | `DASHBOARD_VARIANTS` and a `DashboardVariant` composer drive P08's role order. |
| PA9 | Onboarding steps are `business`, `owners`, `documents`, `review`; the workspace is created on the first business-details save. |
