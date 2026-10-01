# Ledgerline Design OS — Phase 4: Page Blueprints

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
- **Never in the document title:** an account, counterparty, member or business name, an email address, an amount or balance, an unread or pending count, a search term, a reference or an ID. Why: titles are copied into browser history, history sync, task switchers and screen shares, which are outside the workspace's permission model.
- **Never in the URL:** an account number (masked or full), an email address, a person's or business's name, an amount typed as free text, note text, a download address, a session or step-up credential. The only credentials a URL may carry are the single-use `token` (P05) and `challenge` (P06), and both are removed from the address once read. `q` is the one free-text value allowed, because the member typed it and may share it on purpose; it is capped at `LEDGER_QUERY_MAX_LENGTH` (100 characters) and is the single recorded exception to "nothing sensitive in URLs" (OD14). On P30 and P33 staff may type an email fragment into `q`; those routes are therefore never sent to analytics (PA24).
- **Never in analytics, error reports or client logs:** a resolved path or query string. They record the route pattern (`/accounts/[accountId]`), the page ID and a request reference only (BR5; `no-console` binds the app).
- Every `(app)` and `(admin)` response is served with `Cache-Control: no-store`, so a shared device's Back history never repaints balances after sign-out. `Referrer-Policy` is `strict-origin-when-cross-origin` for the app and `no-referrer` on P05 and P06.

### Permissions and enforcement

| Layer | Where | Decides | Failure the user sees |
|---|---|---|---|
| Session | `proxy.ts` over `PROTECTED_ROUTE_PREFIXES` (every `(app)` and `(admin)` top segment) | signed in or not | redirect to P02 with `next` |
| Platform role | `app/(admin)/layout.tsx`, server-side (`role === ADMIN` today, A9) | internal staff or not | P34 Not found — the admin area is not advertised |
| Workspace role | `PermissionGate` (C59) reading C63 and the permission matrix | which sections and actions render | a permission empty state naming who can grant access; hidden actions are omitted |

The backend is the authority for every data permission. Workspace role is not in the session token today, so until the membership model is published a denial is learned from the backend's 403, and the section then gives the not-permitted empty state (C32), never the error state (C33).

A page's **Permissions** field names who may use it; what everyone else experiences is inherited from here unless the page says otherwise:

- **Signed out.** The visitor is sent to P02 with `next` holding the path and query they asked for (sanitised by `internalPath`). After signing in they arrive at that address with its filters intact; if their role does not allow it, the role denial applies. Nothing about the page (its title, whether the ID exists) is disclosed before sign-in.
- **Signed in, role not allowed for the page.** The person is told, by page name, that their role does not include it and who in the workspace can change that (the owner; for R4 account scope, the owner or finance lead), and is offered a way to P08. No data request for the page is made. This is the not-permitted empty state (C32), not the error state (C33), and it is never presented as "nothing here yet".
- **Signed in, record outside their scope** (an account a viewer is not permitted, or any ID from another workspace). Indistinguishable from an ID that does not exist: P34. Why: confirming that an account or transaction exists is itself a disclosure.
- **Action not allowed, value readable.** The action is not offered and the value stays readable (C59). A crafted request is refused by the backend with 403 and reported with the reason.
- **Role changed while the page is open.** The next request is refused with 403; the role is refetched and the page re-evaluates. Typed input is kept when the action is still allowed; otherwise the person is told their access changed, by whom it can be restored, and nothing is silently discarded.
- **Membership ended or user suspended while the page is open.** The next request is refused; every cached workspace record is cleared from the device and the person is routed as [Phase 3 §6.2](phase-3-information-architecture.md#62-how-permissions-are-enforced) routes someone without that membership.
- **Session ended mid-task** (idle or absolute limit, OD2; X4). The member is warned before idle expiry and can extend (C55). After expiry they re-authenticate without leaving the page: the address, filters, typed input and unsent drafts are kept. A write interrupted by expiry, or refused with 401, is **never** replayed automatically: the draft is kept in the open tab and the member submits it again once re-authenticated, with the same idempotency key, so the repeat is safe. A draft lives in that tab's memory only: it is never written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and it is gone when the tab closes. If a different user signs in, the previous user's drafts and all their cached data are dropped before anything renders.
- **Step-up** (X4, C55, fallback P06). Asked for at the moment of the sensitive action, never on arrival. Cancelling leaves everything as it was; failing does not sign the member out. A passed step-up is a grant for the one purpose it was asked for and lasts `STEP_UP_GRANT_SECONDS` (5 minutes, PA16); a different sensitive purpose, or the same one after the grant lapses, is asked again. A grant issued for any other purpose never authorises money movement: each transfer or payment confirmation asks for its own grant. An action that step-up interrupted is not replayed: the member submits it again once the grant is given.
- **Workspace switched in another tab.** A tab still holding the previous workspace reloads into the current one on its next request; two workspaces' figures are never mixed in one view, and an entity address from the other workspace resolves to P34.
- **Audit.** The backend records, with actor, workspace, time, target and outcome: sign-in, failed sign-in, sign-out, step-up, full account number reveal, statement and export download, export creation, attachment and verification-document access, every annotation, team, role, alert-rule and workspace-settings change, verification submission and decision, every admin user change and every support lookup. The client never writes audit entries itself and never suppresses a request to avoid one. No page in this design OS reads the audit record; who may read it is OD12 (PA20).

### Device baseline

Three device contexts are supported: phone (from 360 CSS px wide), tablet, and desktop. Every page must let users on every device complete every task the page offers; no action exists only on one device. How pages adapt is decided at build. Page blueprints add device needs only where users on one device need something specific.

- Wherever records are listed, a user on a narrow screen can read each record's essential facts ([Phase 5](phase-5-section-blueprints.md)) without horizontal page scrolling; amounts are never truncated.
- Wherever files can be dropped, they can also be chosen without drag-and-drop.
- Nothing requires hover.
- **Must remain possible on a phone, on every page:** every read task, every annotation, every download, every security action (sign out a device, change a password, pass step-up) and every decision the page exists for. **May be reduced on a phone:** how many records can be read at once, the speed of bulk review, and comparing two documents at the same time. Never reduced: a record's amount, sign, currency, status or date, and the as-of time of a balance.
- **Keyboard and assistive technology, on every page:** every task can be completed with a keyboard alone. After navigation, focus moves to the page's title. After an action, focus stays on what the person acted on, or, when that no longer exists, moves to the nearest remaining record or to the message explaining the outcome; it is never dropped to the start of the document. Completed changes and background refreshes are announced politely; failures and anything that blocks the task are announced assertively. Every task survives text enlarged to 200% and a 320 CSS px wide viewport (WCAG 1.4.4, 1.4.10).
- **Where the device cannot save a file** (an in-app browser, a managed device), the member is told the download did not start and that the same file can be requested again from another device; the request is not consumed silently.
- **Slow connections.** A request that has not answered after `SLOW_REQUEST_MS` (10 s) tells the person it is still working. A read that has not answered at `REQUEST_TIMEOUT_MS` (15 s) is treated as a failure of that section; a write that has not answered at `MUTATION_TIMEOUT_MS` (30 s) is reported as an uncertain outcome and is never sent again automatically (PA15).

### State ladder

1. **Route loading** — segment `loading.tsx`. Initial arrival only; a later visit within the cache's stale time renders from cache at once.
2. **Section loading** — section placeholder that reserves its final space (no layout shift), on the initial load only. A **refresh** (focus refetch, polling, a filter change) keeps the previous data readable, marks it as updating for assistive technology, and never swaps it for a placeholder. Slow and timed-out requests follow the device baseline. Freshness follows the `STALE_TIME` tiers of [Phase 5](phase-5-section-blueprints.md) (`live` for balances, pending and counts; `standard` for lists and detail; `slow` for team, settings and rules); anything older than its tier that could not be refreshed states its as-of time.
3. **Section empty** — `EmptyState` (C32), copy from `lib/data/empty-states.ts`, one next action. Three situations are never given the same message: **nothing exists yet** (says what will make data appear); **filtered to nothing** (says the filters exclude everything and offers to clear them, never implying no data exists); **not permitted** (says access is missing and who can grant it). A fourth, **partial data** (the banking data source answered for some accounts only, OD5), names what is missing and withholds any total that would be wrong without it.
4. **Section error** — `ErrorState` (C33) scoped to the failing section, with retry. Other sections keep working. The message distinguishes: the request failed (retry offered); changed by someone else, 409 (the write is refused, the current value is loaded, and the person keeps what they entered and chooses what to do — nothing is overwritten on either side); invalid, 422 (reported against what was entered); too many requests, 429 (says when to try again, from the backend's retry-after; no automatic retry loop); the service is unavailable (`GET /api/health` fails: the person is told Ledgerline is unavailable and that no money is affected, and the section retries with backoff); and offline (rung 8). A request refused for permission (403) is not an error: it gives the not-permitted state of rung 3, with no retry and who can grant access. Every error carries a reference the person can quote and support can look up (the backend's request ID; the `digest` for render failures); the reference is required on every failure, including a refusal produced before the backend is reached (validation, offline). Backend text and stack traces are never shown.
5. **Route error** — segment `error.tsx` (S54 `error`). Used when the page itself cannot render, never for one section's data.
6. **Not found** — `notFound()` when a dynamic ID resolves to 404, including records outside the person's scope.
7. **Success** — mutations confirm with a transient message (C24) and update the query cache; no reload. The confirmation says what changed in words and the page leaves the person able to carry on with the next step of the task without navigating back. A submission cannot be sent twice: it is unavailable while in flight, and every create carries a `nanoid` idempotency key reused across retries of the same submission, so a repeat yields one record (PA19). An optimistic change that the backend refuses is reverted and explained. Other tabs pick the change up on focus.
8. **Offline** — cached data stays readable and is marked stale with its as-of time; writes, uploads, downloads and step-up are disabled with a reason (X10). Offline (the device has no connection) is told apart from unavailable (the device is connected, the service is not). Drafts already typed are kept in the open tab. No write is queued for later: on reconnection data refetches and the member repeats the action, so nothing is sent on their behalf after they have looked away.

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
import {
    LEDGER_ACCOUNT_FILTER_MAX,
    LEDGER_CATEGORY_FILTER_MAX,
    LEDGER_QUERY_MAX_LENGTH,
    LEDGER_QUERY_MIN_LENGTH,
    MINOR_UNITS_PATTERN,
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

const isoDate = z.iso.date().optional().catch(undefined);

export const ledgerSearchParamsSchema = z.object({
    from: isoDate,
    to: isoDate,
    type: csvOf(z.enum(TRANSACTION_TYPES), TRANSACTION_TYPES.length)
        .optional()
        .catch(undefined),
    direction: z.enum(TRANSACTION_DIRECTIONS).optional().catch(undefined),
    status: csvOf(z.enum(TRANSACTION_STATUSES), TRANSACTION_STATUSES.length)
        .optional()
        .catch(undefined),
    category: knownCsvOf(
        z.enum(TRANSACTION_CATEGORIES),
        LEDGER_CATEGORY_FILTER_MAX,
    )
        .optional()
        .catch(undefined),
    min: minorUnits.optional().catch(undefined),
    max: minorUnits.optional().catch(undefined),
    q: z
        .string()
        .trim()
        .min(LEDGER_QUERY_MIN_LENGTH)
        .max(LEDGER_QUERY_MAX_LENGTH)
        .optional()
        .catch(undefined),
    account: csvOf(opaqueId, LEDGER_ACCOUNT_FILTER_MAX)
        .optional()
        .catch(undefined),
    flagged: z.literal("true").optional().catch(undefined),
    attachment: z.literal("yes").optional().catch(undefined),
    view: opaqueId.optional().catch(undefined),
});

export type LedgerSearchParams = z.infer<typeof ledgerSearchParamsSchema>;
```

The parameter set, formats and maxima are those of [Phase 3 §11.1](phase-3-information-architecture.md#111-url-parameters-p10-p11-p14-p19): the full set is `from`, `to`, `type`, `direction`, `status`, `category`, `min`, `max`, `q`, `account`, `flagged`, `attachment`, `view`. `type` and `status` are comma lists; `direction` is `in` or `out`; `category` is a comma list of at most 20 category values (`LEDGER_CATEGORY_FILTER_MAX`) from which unknown values are dropped; `q` is `LEDGER_QUERY_MIN_LENGTH`–`LEDGER_QUERY_MAX_LENGTH` (2–100) characters after trimming; `min` / `max` are minor units as digit strings of 1–15 digits (BR1); `account` is a comma list of at most `LEDGER_ACCOUNT_FILTER_MAX` (50) opaque IDs; `flagged` is the literal `true` and `attachment` the literal `yes`. The cross-field rules (`from` ≤ `to`, `min` ≤ `max`, and a span of at most `LEDGER_MAX_RANGE_DAYS` when both dates are given) and the notice for a dropped parameter are defined in Phase 3 §11.2 and are not restated here. Enum tuples come from constants until the backend publishes the transactions module (A3); the schema then composes over the generated query schema.

### URL state by page

| Page | Params | Search params | Schema |
|---|---|---|---|
| P02 | — | `next` | `authSearchParamsSchema` (via `internalPath`) |
| P05 | — | `token` | `authSearchParamsSchema` |
| P06 | — | `challenge`, `next` | `authSearchParamsSchema` |
| P07 | — | `step` | `onboardingSearchParamsSchema` |
| P09 | — | `state`, `currency` | `accountsSearchParamsSchema` |
| P10 | `accountId` | `from`, `to`, `type`, `direction`, `status`, `category`, `min`, `max`, `q`, `flagged`, `attachment`, `view` (the account comes from the path) | `ledgerSearchParamsSchema` |
| P11 | — | as P10 plus `account` | `ledgerSearchParamsSchema` |
| P12 | `transactionId` | — | — |
| P14 | — | as P11; `flagged` is implied by the route and not read from the address | `ledgerSearchParamsSchema` |
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

Rules for every search param: an unknown param is ignored and removed on the next write; an invalid value is dropped (`.catch()`), never an error page; a `from` later than `to`, or `min` greater than `max`, drops `to` or `max` and reports it — the two are never swapped; comparisons of `min`/`max` are made on digit strings, never numbers (BR1); a `q` shorter than `LEDGER_QUERY_MIN_LENGTH` (2) or longer than `LEDGER_QUERY_MAX_LENGTH` (100) is dropped, never truncated; unknown `category` values are dropped and the known ones kept. With neither `from` nor `to` the ledger reads newest first and pages back by cursor without limit; the `LEDGER_MAX_RANGE_DAYS` (731 days) cap applies only when both bounds are given, and when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared. Dates are calendar dates in the workspace time zone (PA10). A URL longer than 2,000 characters is refused. [Phase 3 §11.1](phase-3-information-architecture.md#111-url-parameters-p10-p11-p14-p19) is the authority for the ledger parameter set and the sample schema above follows it; if the two ever differ, Phase 3 governs.

## Marketing & public

### P01 — Home

- **Route:** `/` · specified `app/(marketing)/page.tsx`; built at `app/page.tsx`.
- **Purpose:** Explain truthfully what Ledgerline is and route the visitor to start (register, sign in, or enquire).
- **Business objective:** Acquisition: convert qualified visitors (R8) into registered owners (R1) starting F5.
- **User objective:** Decide in about a minute whether Ledgerline fits their business and trust it enough to start.
- **Primary tasks:** find out what Ledgerline is and whether it suits their business; understand what is and is not offered; get started (register, or enquire while OD10 is open); sign in; find help.
- **Required data:** none from the network. All copy from constants/`lib/data/`; every claim traceable to a reviewed constant. Freshness: content changes only with a deployment, and the date each claim was last reviewed is kept with the copy. Whether a session cookie is present is the only runtime read; when it cannot be determined the visitor is treated as signed out and the page is complete without it.
- **Permissions:** public. A signed-in visitor still sees the page and is offered P08 as the main next step instead of starting. No check is enforced because no account data is served. Signed-in detection is by cookie presence only: the page is cacheable and never names the person or their business.
- **Device needs:** a phone visitor can read every statement, reach every in-page topic and start from anywhere on the page without hunting for navigation; nothing depends on hover or on motion. Samples and illustrations may be shortened for a phone; every claim, every sample label and the design-study disclosure may not.
- **Loading states:** statically rendered; content is readable with JavaScript disabled.
- **Empty states:** not applicable (static content); with no verified claims to make, S06 is not rendered.
- **Error states:** root `error.tsx` only. Enquiry validation is owned by S64. While OD10 is open the enquiry sends nothing anywhere, and the visitor is told so in words; it never implies an application was received. Offline, the page already loaded stays readable.
- **Success states:** start action reaches P03 / X11; sign-in reaches P02 (specified) — built page routes both to S64 (OD10). Either way the visitor leaves knowing what happens next and that reading or enquiring has not opened an account.
- **Dependencies:** sections specified — [S04 Marketing proposition](phase-5-section-blueprints.md#s04--marketing-proposition) (what Ledgerline is and who it is for), [S05 Value propositions](phase-5-section-blueprints.md#s05--value-propositions) (four v1 capabilities: see balances, search transactions, statements and exports, team access), [S06 Security & trust statements](phase-5-section-blueprints.md#s06--security--trust-statements), [S07 Public legal & support links](phase-5-section-blueprints.md#s07--public-legal--support-links); sections built — [S55 Public site navigation](phase-5-section-blueprints.md#s55--public-site-navigation), [S56 Headline figures](phase-5-section-blueprints.md#s56--headline-figures) (labelled sample figures; OD9 facet d), [S57](phase-5-section-blueprints.md#s57--accounts-capability)–[S61](phase-5-section-blueprints.md#s61--reconciliation-capability) (accounts, payments and approvals, cards, treasury forecast, reconciliation — beyond v1 scope, OD9), S06 built with placeholder controls (OD9 facet e), [S62 Pricing plans](phase-5-section-blueprints.md#s62--pricing-plans) (sample prices; OD9 facet f), [S63 Frequently asked questions](phase-5-section-blueprints.md#s63--frequently-asked-questions), [S64 Get-started enquiry](phase-5-section-blueprints.md#s64--get-started-enquiry) (OD10). Flows: X2, X1, X11, F5 entry. Backend: none. Decisions: OD9, OD10, OD1.
- **Implementation notes:** static generation, indexable, OpenGraph fields from constants. No testimonials, logos, balances or customer counts presented as real (BR10). Why: every sentence is a claim the product makes to a real business. The built page labels every sample as sample and carries a disclosure; whether that is acceptable for deployment is OD9. Claims rules: capabilities are described only as far as they exist; headline figures appear only if true; protection is described only as behaviour that exists; a price is stated only if one is offered; a visitor can always find out whether Ledgerline is a real bank; the design-study disclosure is present while it applies. Sample amounts follow BR1–BR3 (sign in text, currency stated) so a sample never teaches a different convention from the product. The page sets no cookie and collects no personal data; the title and OpenGraph fields carry no figure. Locale-dependent formats (currency, date, number grouping) follow OD1 and A6. Acceptance: with scripts disabled every claim and disclosure is still readable; no sentence states a capability Phase 8 does not record as available without the sample label.

### P28 — Help center

- **Route:** `/help` and `/help/[slug]` · `app/(marketing)/help/page.tsx`, `app/(marketing)/help/[slug]/page.tsx`
- **Purpose:** Answer common questions without contacting support; hand off to secure messaging when self-service fails.
- **Business objective:** Deflect support volume from R5; shorten time to answer.
- **User objective:** Find the answer fast, or reach a human with context.
- **Primary tasks:** find an answer by searching or browsing by topic; read an answer; reach a person when self-service fails; get back to the list of answers.
- **Required data:** articles and categories from `lib/data/`; client search via `use-debounced-search`. No backend. Each article carries the date it was last reviewed; an article describing behaviour that is not available is not published (BR10). Scale: client search is specified for up to `HELP_ARTICLE_LIMIT` articles (PA17); beyond it search moves to a backend.
- **Permissions:** public. R1–R3 also see "Message support" (P21); R4 sees articles only. Which hand-off is offered is decided by session presence and role: a signed-out visitor is offered sign-in with `next` back to the same article; R4 is told to ask their account owner, because viewers cannot message support. No article content depends on who is reading.
- **Device needs:** articles readable on a phone without zoom; search usable with an on-screen keyboard open. Nothing is reduced on a phone.
- **Loading states:** statically generated; search results render synchronously from local data.
- **Empty states:** no match → the user is told no articles match and offered messaging (signed in) or sign-in (public). A query shorter than two characters gives the topics, not "no match". The echoed query is rendered as text, never as markup.
- **Error states:** unknown slug → `notFound()`. A slug that was renamed redirects to its successor when one is recorded; otherwise P34, with search still reachable. Search cannot fail on the network because it makes no request.
- **Success states:** article opens; the search term is in `?q=` so results can be shared. After reading, the visitor can return to the same results with the query intact.
- **Dependencies:** sections [S46 Help search & categories](phase-5-section-blueprints.md#s46--help-search--categories), [S47 Help article](phase-5-section-blueprints.md#s47--help-article), S07. Leads to P21 (R1–R3) or P02 (visitors). Flows: X9. Backend: none.
- **Implementation notes:** `generateStaticParams` and `generateMetadata` read the article list in `lib/data/`. Indexable. The in-app help entry opens the same public route: one source of articles, one URL to share. `q` is capped at `LEDGER_QUERY_MAX_LENGTH` and never leaves the device. Article titles are public content and are the only dynamic titles in the product. No article asks a member to send a password, a verification code or a full account number, and the hand-off to P21 carries the article's slug, never the search term.

## Authentication

All five pages render S08 Authentication step in the `(auth)` layout. The variant is fixed by the route. Signed-in visitors are redirected by `proxy.ts` away from `/auth`, to P08 (or `next`), except P06 when it serves step-up.

### P02 — Sign in

- **Route:** `/auth/login` · `app/(auth)/auth/login/page.tsx` (built at `app/auth/login/page.tsx`)
- **Purpose:** Authenticate a returning user.
- **Business objective:** Reliable, fast access; the most-visited page.
- **User objective:** Get to their balances in one step.
- **Primary tasks:** get into their account; recover a forgotten password; create an account instead; find help.
- **Required data:** `use-login` → `POST /api/session` route handler → backend `POST /api/auth/login` (exists). Sets the httpOnly session cookie. Nothing is requested before submit. Credentials go only to the same-origin route handler; the password is never held in the query cache, device storage, a log or an error report. Slow or unanswered sign-in follows PA15.
- **Permissions:** public; signed-in users are redirected away. Enforced by `proxy.ts`. A `next` the signed-in person's role cannot open falls to the role denial of [Permissions and enforcement](#permissions-and-enforcement).
- **Device needs:** password managers and autofill work on every device; the form stays usable in phone landscape with the keyboard open. Passkey and password-manager sign-in remain possible on every device; nothing is reduced on a phone.
- **Loading states:** submit shows progress and is disabled; fields are read-only until the response. A second submission while one is in flight is impossible. Returning with Back never restores a typed password.
- **Empty states:** not applicable.
- **Error states:** wrong credentials → `INVALID_CREDENTIALS` for the attempt as a whole, never saying which field was wrong; focus moves to the message; network failure → `REQUEST_FAILED`; too many attempts and service-unavailable each have their own message (Q-073). Announced politely. A suspended or pending user learns that state only after correct credentials, with the route to support. Too many attempts states when to try again from the backend's retry-after and does not count down to a retry on its own. Cookies blocked → the person is told a session cannot be kept on this browser. Offline and service-unavailable are told apart (State ladder 4, 8). Every message carries a reference support can look up; the email typed is kept, the password is cleared.
- **Success states:** navigate to `next` (sanitised by `internalPath`) or P08 (staff → P29); P06 when two-step is required. Any cached data from a previous user of the device is cleared before the destination renders. A member of several workspaces arrives in the one they last used (`WORKSPACE_COOKIE`). Focus moves to the destination's title.
- **Dependencies:** section [S08 Authentication step](phase-5-section-blueprints.md#s08--authentication-step) `sign-in`. Leads to P04, P03, P28. Flows: X1, X4. Backend: login exists; two-step challenge required (OD6). Backend today: login only. Required: attempt limiting with retry-after, lockout, a record of failed and successful sign-ins, and the two-step challenge.
- **Implementation notes:** `?next=` parsed with Zod and passed through `internalPath` so an open redirect is impossible. Field `id`/`name` come from constants, not label text. Indexable. Host defects H-01–H-05, H-16 apply (Phase 9). `next` must be a same-origin path beginning with a single `/`, at most 2,048 characters; anything else is discarded. The email is trimmed and compared case-insensitively; the password is never trimmed or altered. Field lengths come from the generated login DTO. Neither value ever reaches the URL or the title.

### P03 — Register

- **Route:** `/auth/register` · `app/(auth)/auth/register/page.tsx`
- **Purpose:** Create a user and session, then start business onboarding.
- **Business objective:** Top of F5; every workspace starts here (BR12).
- **User objective:** Create an account without providing business documents up front.
- **Primary tasks:** create an account without business documents; know the password rules before choosing a password; agree to the terms; sign in instead if they already have an account.
- **Required data:** `use-register` → `POST /api/register` route handler → backend `POST /api/auth/register` (exists). No availability check runs while typing: the email is tested only on submit, and that answer is rate-limited by the backend (PA24).
- **Permissions:** public. Signed-in visitors are redirected away by `proxy.ts`.
- **Device needs:** as P02; new-password autofill supported.
- **Loading states:** as P02. A second submission while one is in flight is impossible.
- **Empty states:** not applicable.
- **Error states:** email taken → the email is reported as already registered and sign-in is offered (whether registration may say this while sign-in and reset do not is OD13, whose default is the same neutral answer for every email, with the existing user told by email); password below `PASSWORD_MIN_LENGTH` → reported before submit; account created but session failed → `SESSION_UNAVAILABLE` with a way to P02 (the user must not register twice). Too many attempts, offline and service-unavailable follow State ladder 4 and 8. On any failure the email and name stay; the password is cleared. If the person submits again after "account created but session failed", they are sent to sign in, never told the email is taken by someone else.
- **Success states:** navigate to P07. The person arrives signed in and is not asked for credentials again. The version of the terms accepted and the time are recorded against the user.
- **Dependencies:** section S08 `register`. Leads to P02. Flows: X2 → F5. Backend: register exists. Reached from P01 only once OD10 allows it. Backend today: register. Required: recording the accepted terms version, and attempt limiting.
- **Implementation notes:** validation composes the generated register DTO schema. Indexable. The password rules are available before the user types; the terms must be accepted before the account is created. Password length runs from `PASSWORD_MIN_LENGTH` to the DTO maximum; pasting and password managers are never blocked. The password never reaches the URL, the query cache, a log or an error report. The email is trimmed and lower-cased for comparison only. Acceptance: two rapid submissions create one user.

### P04 — Forgot password

- **Route:** `/auth/forgot-password` · `app/(auth)/auth/forgot-password/page.tsx`
- **Purpose:** Start a password reset by email.
- **Business objective:** Recover accounts without support tickets.
- **User objective:** Get back in.
- **Primary tasks:** get a reset link sent to their email; get back to sign in.
- **Required data:** `use-request-password-reset` → reset request endpoint (required). The request carries only the email. The backend answers in the same way and in comparable time whether or not the email is known (required).
- **Permissions:** public. Signed-in visitors are redirected away by `proxy.ts`.
- **Device needs:** email autofill. Nothing is reduced on a phone.
- **Loading states:** submit progress. A second submission while one is in flight is impossible.
- **Empty states:** not applicable.
- **Error states:** network failure → `REQUEST_FAILED` with retry. Unknown email is **not** an error. Too many requests → the same wording for every email, with when to try again. Offline → the request is not sent and the person is told.
- **Success states:** identical confirmation for every submitted email, advising the user to check spam and how to get help (P28). Why: a different message would let anyone test which businesses bank here. The confirmation states how long the link works (`RESET_LINK_TTL`, 30 minutes, PA22) and that a newer request cancels earlier links. The person can go back to sign in or ask again.
- **Dependencies:** section S08 `forgot`. Leads to P02, P28. Flows: X5. Backend: reset request required.
- **Implementation notes:** rate limiting is backend-side; the UI shows the backend's retry-after when present. Indexing per Phase 3 §12 (indexable). The email is never put in the URL and is not kept after leaving the page. The link is single-use. Requests are recorded by the backend with the time and outcome, without disclosing either to the requester.

### P05 — Reset password

- **Route:** `/auth/reset-password` · `app/(auth)/auth/reset-password/page.tsx`
- **Purpose:** Set a new password from an emailed token.
- **Business objective:** Complete recovery securely.
- **User objective:** Choose a new password and sign in.
- **Primary tasks:** choose a new password that meets the rules; get a new link when this one no longer works.
- **Required data:** `use-reset-password` → reset confirm endpoint (required). Token from `?token=`. The token is read once, removed from the address, and held in memory only, so a reload needs the emailed link again. Its validity is checked on arrival, so the person learns the link is unusable before typing a password.
- **Permissions:** public with a valid token. Enforced by the backend on arrival and again on submit; the page itself trusts nothing in the URL.
- **Device needs:** new-password autofill. Nothing is reduced on a phone.
- **Loading states:** submit progress. A second submission while one is in flight is impossible.
- **Empty states:** missing token → the "link invalid" state: the user is told the link cannot be used and offered a new one (P04); no password can be entered.
- **Error states:** expired or used token → the "link invalid" state; weak password → reported before submit with the rules. A link that expires while the person is typing is reported on submit with the offer of a new one; the typed password is discarded. Too many attempts, offline and service-unavailable follow State ladder 4 and 8.
- **Success states:** confirmation, then P02; the backend revokes all other sessions. Any step-up in force is ended with the other sessions. The person is not signed in automatically; they sign in with the new password. The change is recorded and the account's email address is notified (required).
- **Dependencies:** section S08 `reset`. Leads to P02, P04. Flows: X5. Backend: reset confirm required.
- **Implementation notes:** the token is never logged or put in metadata. `noindex`; `Referrer-Policy: no-referrer` for this segment. The link works once and for `RESET_LINK_TTL` (PA22). The page makes no third-party request, so the token cannot leave in a referrer. Neither the token nor the password is cached, stored or reported.

### P06 — Two-step verification

- **Route:** `/auth/verify` · `app/(auth)/auth/verify/page.tsx`
- **Purpose:** Complete a two-step challenge at sign-in, or a step-up challenge before a sensitive action.
- **Business objective:** Protect balances and account numbers with a second factor.
- **User objective:** Pass the check with the least friction.
- **Primary tasks:** prove it is them with a passkey or a code; use a recovery code when they cannot; back out.
- **Required data:** `use-verify-challenge` → two-step / step-up endpoint (required; OD6). Challenge from `?challenge=`. A challenge lives for `CHALLENGE_TTL` (PA22) and is bound to the browser that began it. The number of attempts remaining comes from the backend, never counted on the client.
- **Permissions:** public with a live challenge. A challenge opened in a different browser, or after its lifetime, is refused by the backend as if it did not exist.
- **Device needs:** one-time-code autofill from SMS/authenticator apps where the platform offers it; numeric keyboard on phones; paste allowed. On a device with no passkey support the code path is offered without the person having to fail first.
- **Loading states:** submit progress; the passkey prompt is the browser's own.
- **Empty states:** missing or expired challenge → "Start again" to P02. A challenge that expires while the person is on the page says so; for step-up the person returns to the page that asked, with the sensitive action not performed and their input intact.
- **Error states:** wrong code → reported with the remaining attempts; lockout → the user is told and offered P28. Cancelling the passkey prompt, or a device that cannot use one, offers the code and does not count as a failed attempt. A recovery code works once, and the person is told how many remain. Lockout states how long it lasts, from the backend. Offline → nothing is submitted.
- **Success states:** return to `next` (step-up: the page that asked) or P08. For step-up, the action the person asked for is then performed exactly once; nothing typed on the page that asked is lost.
- **Dependencies:** section S08 `verify`. Flows: X1, X4. Decision: OD6. Backend: two-step and step-up required. Backend today: none of this exists.
- **Implementation notes:** `noindex`. Step-up normally happens in place through C55; this page is the fallback when that cannot complete. The `challenge` value is removed from the address once read. Codes are never cached, stored, logged or reported. Every attempt, success and lockout is recorded by the backend with the actor and the time.

## Workspace app

Every page below renders inside the `(app)` layout. Unless stated, each includes [S03 Page title & actions](phase-5-section-blueprints.md#s03--page-title--actions).

### P07 — Onboarding & verification

- **Route:** `/onboarding` · `app/(app)/onboarding/page.tsx` (session guard, no workspace required)
- **Purpose:** Collect business details, beneficial owners and documents (KYB + owner KYC) and submit them for review.
- **Business objective:** Every workspace verified; verification gates live account data.
- **User objective:** Finish in one sitting, or leave and resume exactly where they stopped.
- **Primary tasks:** tell Ledgerline about the business; name its beneficial owners; provide the documents asked for; check everything and submit it for review; answer a reviewer's request for more information; stop and resume later.
- **Required data:** `use-verification-case`, `use-update-verification-case`, `use-upload-document` (required). Field set depends on OD1. Backend today: none of the verification module exists. Freshness: `standard`, refetched on focus, so a reviewer's decision made while the owner was away is seen on return. Limits: up to `OWNER_LIMIT` (20) beneficial owners in a verification case (PA17); each document is a PDF, JPEG or PNG of at most `UPLOAD_MAX_BYTES` (10 MB), with at most 10 files per document kind and 20 per case (`UPLOAD_MAX_FILES`, PA14). Until OD1 is answered the set of details and documents requested cannot be finalised.
- **Permissions:** R1 only. Other roles see a permission empty state: "Only the account owner can complete verification". Enforced by the backend per case; denied roles trigger no case request. Once `submitted` the owner can read but not change the case until it is `needs_info`; `approved` is read-only; `rejected` gives the reviewer's reason and the route to support (P21).
- **Device needs:** documents can be captured or picked from a phone; the step count and current step are always discoverable on small screens; progress is saved server-side so a member can start on a laptop and finish on a phone. Nothing in the task is reduced on a phone.
- **Loading states:** route placeholder; the active step reserves its space so nothing shifts. On resume, saved answers load before any input is accepted, so stale state on the device can never overwrite what the server holds.
- **Empty states:** `not_started` → the user starts at the business step with a one-line explanation of what verification involves. A workspace that already has a case never shows this start again.
- **Error states:** save failure → validation errors reported per field and for the step, input kept; upload failure → per-file retry; case fetch failure → S09 error with retry. Two tabs, or two owners, saving the same step → the later save is told the case changed elsewhere, the current values load and the person's input is kept for comparison. A file refused for type, size, being unreadable or being password-protected is reported per file with the reason. A session that ends mid-upload keeps every completed upload; the member sends the interrupted file again after re-authenticating, and nothing is re-sent on their behalf. A failed submit leaves the case `in_progress`, never half-submitted. Offline → saving, uploading and submitting are disabled; what is typed stays.
- **Success states:** each step saves on continue; submit → S13 reports `submitted` and the user can go on to P08. After submitting, the owner is told what happens next and that they will be notified (X7), and can leave. Submitting twice yields one submission.
- **Dependencies:** sections [S09 Verification progress](phase-5-section-blueprints.md#s09--verification-progress), [S13 Verification status notice](phase-5-section-blueprints.md#s13--verification-status-notice), [S10](phase-5-section-blueprints.md#s10--business-details-form), [S11](phase-5-section-blueprints.md#s11--beneficial-owners-form), [S12](phase-5-section-blueprints.md#s12--document-upload); C52. Flows: F5 (X2 before, P32 internal side). Backend: verification module; OD1.
- **Implementation notes:** active step in `?step=` (`business` · `owners` · `documents` · `review`), falling back to the first incomplete step. S13 shows once the case is not `not_started`. When the case is `needs_info`, the reviewer's requests are given verbatim. Removing an owner is confirmed first (C52). Personal identifiers (dates of birth, identity document numbers, tax identifiers) are sent once, come back masked, and are never written to device storage, a persisted cache, the URL, a log or an error report. Uploaded documents are viewed only through short-lived links (PA12) and every view is recorded. Dates of birth and incorporation are calendar dates, never shifted by time zone. Each save and the submission carry an idempotency key (PA19). `step` holds only a step name.

### P08 — Dashboard

- **Route:** `/dashboard` · `app/(app)/(workspace)/dashboard/page.tsx`
- **Purpose:** Answer "how much cash do we have and what changed" on arrival.
- **Business objective:** Daily habit; the North Star touchpoint for F1.
- **User objective:** Know the cash position and anything needing attention in under five seconds.
- **Primary tasks:** know how much cash the business has and what changed today; check each account; deal with anything waiting on them; see the trend over a chosen range; get to the detail behind a figure.
- **Required data:** `use-accounts`, `use-transactions` (limit and pending), `use-exports`, `use-verification-case`, `use-cash-flow`, `use-workspace`, `use-me` (`GET /api/users/me` exists). Backend today: the account list and cash-flow endpoints exist; transactions, exports, verification and workspace are required. Freshness: balances, pending items and counts are `live` and refetch on focus; activity is `standard`. The as-of time is the banking data source's, not the time of the fetch (OD5). Scale: with more accounts than `DASHBOARD_ACCOUNT_LIMIT`, the member is told how many are not listed, and every total is computed by the backend over all accounts the role may see, never by adding the listed ones. Totals are per currency and never summed across currencies.
- **Permissions:** R1–R4; composition varies by role (D1–D4). Enforced per account by the backend. A viewer with no permitted accounts is told access is missing and who can grant it, never "no accounts". Platform staff with no workspace membership are routed to P29.
- **Device needs:** a phone user can learn the cash total and its as-of time and reach every account in a few actions; charts have a text equivalent that works on a phone. Nothing a role is entitled to is withheld on a phone; only how much history is readable at once may be reduced.
- **Loading states:** each section loads independently; the as-of time appears once S14 resolves. A refresh keeps every figure readable with its as-of time until the new one arrives.
- **Empty states:** no accounts (verification pending) → S13 plus S14 "Accounts appear here once verification is approved" (never a zero balance); no activity → S16 empty copy; nothing pending → "Nothing needs attention". A true zero balance is given as zero with its currency; an unknown balance is never given as zero.
- **Error states:** per section. A failed S18 never hides S14. If the cash position cannot be refreshed, the last figure is kept only together with its as-of time; if there is none, no figure is given. When the data source answers for some accounts only, the affected total is withheld and the member is told which accounts are missing.
- **Success states:** read-only; pending items navigate (export ready → P18, needs info → P07). "Today" is the current calendar day in the workspace time zone (PA10), and the member is told which zone.
- **Dependencies:** sections S03 (workspace name and an "as of" time), [S13 Verification status notice](phase-5-section-blueprints.md#s13--verification-status-notice), [S14 Cash position](phase-5-section-blueprints.md#s14--cash-position), [S15 Account summary](phase-5-section-blueprints.md#s15--account-summary), [S16 Recent activity](phase-5-section-blueprints.md#s16--recent-activity), [S17 Pending items](phase-5-section-blueprints.md#s17--pending-items), [S18 Cash flow over time](phase-5-section-blueprints.md#s18--cash-flow-over-time); which a role receives is in Role variants. Leads to P10, P11, P12, P18, P07. Flows: F1, D1–D4, X7. Backend today: `GET /api/accounts`, `GET /api/cash-flow`, `GET /api/users/me`.
- **Implementation notes:** the role comes from C63, and which sections each role gets is data in `lib/data/dashboard-variants.ts` (`DASHBOARD_VARIANTS`). Balances use short stale times and refetch on focus; the as-of time is always given so a stale figure is never mistaken for a live one. Available and Current balance are both labelled wherever a balance is given (Phase 3 §8.3); pending items are never counted in Current. The title is static; the workspace name never reaches it.

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

- **D1 Owner.** Gets verification because nothing else works until it is approved and only the owner can act on it; gets every other section because the owner answers for the whole cash position.
- **D2 Finance.** Gets cash and trend for forecasting and control, and pending items to act on; S13 only as information, because a finance lead cannot complete verification.
- **D3 Accountant.** Gets the work queue and the cash position; no in-period trend (accountants compare closed periods in P15).
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
- **Required data:** `use-accounts` → `GET /api/accounts` (exists). The backend publishes the account states `OPEN / FROZEN / CLOSED`; how they map to the states this design OS names is OD11. Freshness: `live`, refetched on focus, each balance with its as-of time. Scale: zero, one (still a list; the member is not redirected, so the address means the same for everyone), and hundreds of accounts — narrowing and ordering apply to the whole set, not to the part already loaded. When the data source answers for some accounts only, the others are listed as unavailable, not omitted.
- **Permissions:** R1–R3 all accounts; R4 permitted accounts only (backend filters). Enforced by the backend. A viewer with no permitted accounts is told access is missing and who can grant it.
- **Device needs:** on a phone, the member can identify every account and read its available balance. Narrowing and ordering remain possible on a phone; only how many accounts are readable at once may be reduced.
- **Loading states:** route placeholder reserving the section's space. A refresh keeps the list readable.
- **Empty states:** no accounts → the user is told accounts appear once verification is approved, and offered P07 (R1) or told to ask the account owner (others). Narrowed to nothing → says no account matches that state or currency and offers to clear it; never worded as "no accounts".
- **Error states:** S19 retry. A list that cannot load at all is a section error with retry; unavailable balances inside a loaded list are reported per account.
- **Success states:** navigate to P10. Copying the masked number is confirmed and announced; when the clipboard is refused the member is told and the number stays readable to copy by hand.
- **Dependencies:** sections S03 (account count), [S19 Account list](phase-5-section-blueprints.md#s19--account-list). Leads to P10. Flows: F2. Backend: accounts.
- **Implementation notes:** `?state=` and `?currency=` parsed by Zod; currency values from ISO 4217 constants. Closed and frozen accounts stay listed with their state, because their history is needed for statements. Only the masked number (last 4) can be copied here. No total is given across currencies. Ordering by balance compares minor-unit strings by magnitude within one currency, never floats (BR1). The full number is not available here (P10, step-up).

### P10 — Account ledger

- **Route:** `/accounts/[accountId]` · `app/(app)/(workspace)/accounts/[accountId]/page.tsx`
- **Purpose:** One account's balance and every transaction, filterable.
- **Business objective:** The core read surface of F2; fast at 5 million rows.
- **User objective:** Find and understand the movements on one account.
- **Primary tasks:** know the account's balance right now; find the movements they care about by date, type, direction, category, amount, status or whether a receipt is attached; understand one transaction; keep a filter to reuse; take the filtered view to export; get the full account number when they need to give it out.
- **Required data:** `use-account`, `use-ledger-summary`, `use-transactions` (infinite, cursor), `use-saved-views` (all required). Backend today: the account list (`GET /api/accounts`) exists; the single-account detail, the ledger summary, transactions and saved views are required (A3). Freshness: balance `live`, entries `standard`. Entries that arrive while the member is reading are announced as available and added on request; they never move what is being read. Scale (single accounts up to 5 million transactions): entries are paged by cursor at `LEDGER_PAGE_SIZE` (50), the device holds at most `LEDGER_MAX_PAGES` (10) pages, with no `from` or `to` the ledger reads newest first and pages back by cursor without limit, while a query that gives both bounds spans at most `LEDGER_MAX_RANGE_DAYS` (731 days) — when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared — jumping to a date is a server seek, summary totals are computed by the backend over the whole filtered set (never from loaded pages), and a match count is exact up to `COUNT_EXACT_LIMIT` (10,000) and "10,000+" beyond it (PA23).
- **Permissions:** R1–R4 (R4 only permitted accounts; 404 otherwise). Full-number reveal: step-up for R1–R3, never R4 and never an internal role (R5–R7); audit-logged. Export not R4. The revealed number is masked again after `REVEAL_TIMEOUT` (30 s, with a warning 10 s before and a way to extend), when the page is hidden and on navigation; it is never cached or stored (PA16). `frozen` and `closed` accounts stay readable with their state named.
- **Device needs:** on a phone, the member can read when, what and how much for every transaction and open any of them; every filter remains available; they can jump to a date instead of scrolling a long history. Only how many transactions are readable at once may be reduced on a phone.
- **Loading states:** route placeholder; S23 loading placeholder; loading more shows progress without moving what is already read. Changing a filter keeps the previous entries readable and marked as updating until the new ones arrive.
- **Empty states:** no transactions → S23 "none yet"; filters match nothing → "No transactions match these filters" with an offer to clear them. Two messages because the fix differs. A date range earlier than the account's opening says when the account opened. An account that is `pending_verification` says entries appear once it is active.
- **Error states:** unknown/forbidden `accountId` → `notFound()`; S22 and S23 fail independently. A search the backend cannot finish within `SEARCH_TIMEOUT_MS` (5 s) suggests narrowing the date range rather than a bare retry. When entries fail but the summary loaded, the summary is identified as covering the filter, not only the entries loaded so far. A filter the backend rejects is named.
- **Success states:** filters apply without reload and are shareable; saving a view confirms and appears in P13. At `SAVED_VIEW_LIMIT` (50 per member) the member is told and offered P13; a duplicate view name is reported with the name kept. The export hand-off carries the active filters.
- **Dependencies:** sections S03 (breadcrumb per Phase 3), [S20 Account overview](phase-5-section-blueprints.md#s20--account-overview), [S21 Ledger filters](phase-5-section-blueprints.md#s21--ledger-filters), [S22 Ledger summary](phase-5-section-blueprints.md#s22--ledger-summary), [S23 Ledger entries](phase-5-section-blueprints.md#s23--ledger-entries). Leads to P12, P13, P18 (prefilled). Flows: F2, F3, X4.
- **Implementation notes:** see [Reference page](#reference-page). Filters written with `router.replace` (no history entry per keystroke). The cursor is not in the URL: a shared link reproduces the filter, not someone's scroll position. Pending entries are excluded from Current balance and included in Available per Phase 3 §8.3. A `returned` or `reversed` entry is its own entry linked to the original; the original is never rewritten. A running balance is meaningful only over unfiltered posted entries and is withheld under any filter. Date filters are calendar dates in the workspace time zone (PA10). Neither the account name nor its number reaches the title or the URL. Acceptance: with a seeded 5-million-entry account, a date jump and a filter change each answer within the Phase 9 performance criteria without loading intermediate pages.

### P11 — Transaction search

- **Route:** `/transactions` · `app/(app)/(workspace)/transactions/page.tsx`
- **Purpose:** Search and filter transactions across every account the user can see.
- **Business objective:** F3 entry point; replaces "email the bank and ask".
- **User objective:** Find a specific payment by amount, counterparty, reference or date in seconds.
- **Primary tasks:** find a specific payment by amount, counterparty, reference or date; narrow to an account, period, amount or status; open what they find; keep the search as a view or export the results.
- **Required data:** `use-transactions` (workspace-wide), `use-saved-views`, `use-accounts` (account filter options). Backend today: `GET /api/accounts` exists; transaction search and saved views are required. Freshness: `standard`. Scale (500 million transactions overall): search is always a backend request; a superseded request is cancelled so older results never replace newer ones; counts follow PA23. With no date bounds the search reads newest first and pages back by cursor without limit; the `LEDGER_MAX_RANGE_DAYS` cap applies only when both `from` and `to` are given, exactly as on P10. The account filter holds at most `LEDGER_ACCOUNT_FILTER_MAX` (50) accounts.
- **Permissions:** R1–R4; backend limits results to permitted accounts. Export not R4. Counts and totals cover permitted accounts only, and nothing hints at matches in accounts the member cannot see. A viewer with no permitted accounts gets the not-permitted message.
- **Device needs:** as P10; on a narrow screen every result's own facts (when, what, how much, its status) are always readable, and which account it belongs to stays obtainable for each result. Only how many results are readable at once may be reduced.
- **Loading states:** previous results stay readable and are marked busy while a new query runs.
- **Empty states:** no query → recent transactions (never a blank page); no match → "No transactions match" echoing the query, with an offer to clear it. A query shorter than `LEDGER_QUERY_MIN_LENGTH` (two characters) is not sent and recent transactions stay.
- **Error states:** S23 retry; malformed amount input dropped by the schema. A search that times out (`SEARCH_TIMEOUT_MS`, 5 s) suggests adding a date range or an account. Too many requests states when to try again.
- **Success states:** URL reflects the query; results update as the user types (debounced by `SEARCH_DEBOUNCE_MS`, 300 ms). Typing does not add history entries: Back leaves the page, it does not replay keystrokes.
- **Dependencies:** sections S21 search variant, S23 cross-account variant. Leads to P12, P13, P14, P18. Flows: F3; C38 hands off with `?q=`. Backend: transactions search.
- **Implementation notes:** reuses `ledgerSearchParamsSchema`, reading `account` from the address (P10 takes the account from the path). Static children `/transactions/views` and `/transactions/flagged` take precedence over `[transactionId]` by the router's rules. Arriving from the command palette (C38), focus is in the query. A query that parses as an amount is converted to minor units by string parsing and matched on absolute value in any currency (Phase 3 §10); every result states its currency. v1 recognises `en` number formats only (A6); other separators are treated as text. `q` may hold a counterparty name the member typed: it is never copied into the title, analytics or an error report.

### P12 — Transaction detail

- **Route:** `/transactions/[transactionId]` · full page `app/(app)/(workspace)/transactions/[transactionId]/page.tsx`; intercepted route `app/(app)/(workspace)/@drawer/(.)transactions/[transactionId]/page.tsx`
- **Purpose:** Everything about one transaction, and the place to annotate it.
- **Business objective:** Close investigations inside Ledgerline; annotations feed accounting.
- **User objective:** Understand a payment, prove it, leave a note for the accountant.
- **Primary tasks:** understand a payment — how much, where it stands, who with, from which account; see how it progressed; leave a note, category, flag or receipt for the accountant; share it with a teammate.
- **Required data:** `use-transaction`, `use-update-transaction`, `use-upload-attachment` (required). Backend today: none exists. Freshness: `standard`; a `pending` transaction refetches on focus because it may post, fail or be returned, and a status change while it is open is announced. Limits: a note is at most `NOTE_MAX_LENGTH` characters (PA17); attachments per PA14.
- **Permissions:** R1–R4 read; annotate R1–R3; R4 read-only (C59). A share link opens only for members who can see that account. A shared address holds only the opaque ID: a recipient who cannot see the account gets P34, a signed-out one signs in and comes back. Every annotation is attributed to its author with the time; edits and removals are recorded, not erased.
- **Device needs:** opened from a list, the detail must return the member to the same list position on every device; receipts can be photographed and attached from a phone. Nothing is reduced on a phone.
- **Loading states:** opening is immediate; the amount already known from the list is given while the rest loads. Loaded directly, the page has nothing to show until the transaction resolves and uses the route placeholder.
- **Empty states:** no notes/attachments → invite the first note; a lifecycle with one state shows that state.
- **Error states:** unknown/forbidden ID → opened from a list, the member returns to it with a message; loaded directly, segment `not-found`. Annotation save failure → reported, draft kept. Notes are append-only, so two members never overwrite each other. A category or flag change made against a version someone else has since changed is refused (409): the current value loads with who changed it and when, and the member keeps what they chose and decides whether to apply it again; nothing is overwritten. Setting a flag to the state it already has is treated as done. An attachment refused for type or size is reported with the reason; one interrupted by a session ending is sent again by the member after re-authenticating, never on their behalf. An attachment's link that has expired (PA12) is requested again on the member's next attempt.
- **Success states:** note/category/flag save optimistically and reconcile; the list the member came from updates from the same cache. Flagging can be undone. The member can go on to the counterparty or the account without losing the list they came from.
- **Dependencies:** sections [S24 Transaction detail](phase-5-section-blueprints.md#s24--transaction-detail), [S25 Transaction lifecycle](phase-5-section-blueprints.md#s25--transaction-lifecycle), [S26 Notes & attachments](phase-5-section-blueprints.md#s26--notes--attachments). Leads to P19, P10. Flows: F3.
- **Implementation notes:** soft navigation from a list opens the intercepted route; hard loads and shared links render the full page. Closing calls `router.back()` so Back and Escape behave the same and focus returns to the originating row. The overlay file exports no `metadata`. Removing an attachment is confirmed first (C52). Amount, sign and currency are the backend's strings (BR1, BR3). Where the transaction's currency differs from the account's, both amounts and the rate the backend reports are given; no rate is computed on the client. A `returned` or `reversed` transaction and its original lead to each other. The posting date is a calendar date and is never shifted; timeline times are in the workspace time zone, with the zone named (PA10). Attachments are private to the workspace and are not part of exports.

### P13 — Saved views

- **Route:** `/transactions/views`
- **Purpose:** Manage named filter sets over transactions.
- **Business objective:** Repeat visits with zero setup.
- **User objective:** Reopen "Card spend this month" in one action.
- **Primary tasks:** get back to a saved filter in one step; rename or delete a view; choose the view they start from.
- **Required data:** `use-saved-views` (required; see Phase 8 open question on storage); each view carries a plain-language filter summary, and last used and match count when known. Limit: `SAVED_VIEW_LIMIT` views per member (PA17). The match count may be absent or "10,000+" (PA23) and is never computed for every view at once on very large accounts.
- **Permissions:** R1–R4; each member manages their own views. Views are private to their member and enforced by the backend. A view naming an account the member can no longer see opens with that account dropped and says so.
- **Device needs:** views can be opened and renamed on a phone. Deleting and choosing the starting view are also possible on a phone; nothing is reduced.
- **Loading states:** route placeholder. A refresh keeps the list readable.
- **Empty states:** "Save a filter from any ledger to see it here", offering P11.
- **Error states:** S27 retry; rename conflict reported, the new name kept for correction. A rename, a change of starting view or a delete made against a view that was changed elsewhere meanwhile (another tab or device) is refused: the current view loads and the member keeps what they typed and chooses what to do. A view whose filters no longer validate opens with the invalid parts dropped and names them. A failed delete restores the view.
- **Success states:** rename is confirmed; delete is confirmed first (C52) naming the view. After a delete, focus moves to the neighbouring view, or to the empty message when none remain.
- **Dependencies:** sections S03, [S27 Saved views list](phase-5-section-blueprints.md#s27--saved-views-list). Leads to P10, P11 (with `?view=`), P11 when empty. Flows: F3. Backend today: none exists.
- **Implementation notes:** a view is a serialised `LedgerSearchParams`; opening it navigates to the URL form. A name is 1–`SAVED_VIEW_NAME_MAX` characters, trimmed, unique per member without regard to case. Names are the member's own words and never reach the URL or the title: `view` is the ID. A relative period ("this month") is stored as the preset, not as dates, and resolves in the workspace time zone when opened (PA10).

### P14 — Flagged transactions

- **Route:** `/transactions/flagged`
- **Purpose:** The follow-up list: every flagged transaction.
- **Business objective:** Nothing flagged is forgotten at month end.
- **User objective:** Work through flagged items and clear them.
- **Primary tasks:** work through what was flagged; find a particular flagged item; clear a flag once resolved; export the list.
- **Required data:** `use-transactions` with the flag filter, including who flagged each transaction. Backend today: none exists. Freshness: `standard`. Scale: paging and counts as P10.
- **Permissions:** R1–R4 view; unflag R1–R3; export not R4. A viewer sees flags, and who raised them, on permitted accounts only.
- **Device needs:** as P11. Clearing a flag is possible on a phone.
- **Loading states:** as P11.
- **Empty states:** "Nothing flagged", with how flagging works. Narrowed to nothing → says no flagged transaction matches and offers to clear the filters.
- **Error states:** S23 retry. A failed unflag puts the transaction back with a message. A transaction someone else already unflagged is treated as done, naming who cleared it.
- **Success states:** unflagging removes the transaction from the list and can be undone. Undo is available for `TOAST_DURATION_MS`; focus moves to the next flagged transaction, or to the empty message. The unflag is recorded with its actor.
- **Dependencies:** sections S03 (flagged count), S21 with `flagged=true` fixed, S23. Leads to P12, P18. Flows: F3.
- **Implementation notes:** `flagged` passed as a fixed prop, not a URL param. Phase 3 §11.1 lists `flagged` as a filter value that this route implies; it is not accepted from the address here.

### P15 — Compare periods

- **Route:** `/insights/compare`
- **Purpose:** Compare inflows, outflows and categories across two periods.
- **Business objective:** Month-on-month review happens in Ledgerline, not a spreadsheet.
- **User objective:** See what changed between two months and why.
- **Primary tasks:** see what changed between two periods and why; choose which periods and accounts to compare, or swap them; look into one category; export what they found.
- **Required data:** `use-compare-periods` (required): net change, inflow and outflow per period, change by category, top counterparties; chart through C30 (LD1). Backend today: none exists. Freshness: closed periods are `slow`; a period that includes today is labelled as partial, to date. Figures cover posted transactions only, so they agree with statements. Limits: each period is at most `EXPORT_MAX_RANGE_DAYS` long. Scale: computed by the backend; a slow answer follows PA15.
- **Permissions:** R1, R2, R3. R4 gets a permission empty state. R4 gets the role denial of [Permissions and enforcement](#permissions-and-enforcement); enforced by the backend.
- **Device needs:** both periods can be chosen with native date inputs on a phone; the comparison has a text equivalent. Nothing is reduced on a phone.
- **Loading states:** S28 loading placeholder reserving its space. Changing a period or account keeps the previous comparison readable and marked as updating.
- **Empty states:** a period with no data says so for that side only. When an account had not opened in one period, the change is given as not comparable rather than as a percentage from zero. Periods of unequal length, or that overlap, are compared and the member is told they differ.
- **Error states:** S28 retry; end-before-start prevented by the schema. An invalid or out-of-range date in the address falls back to the default periods.
- **Success states:** URL updates; drill-in → P11 with category and period. The address holds only dates and account IDs, so sharing it discloses no figure.
- **Dependencies:** sections S03, [S28 Period comparison](phase-5-section-blueprints.md#s28--period-comparison). Leads to P11, P18. Flows: F4. Library LD1.
- **Implementation notes:** default is last full month vs the one before. Deltas are computed by the backend in minor units. One comparison per currency; nothing is summed across currencies. Percentages are computed by the backend from minor units; when the base is zero no percentage is given. Uncategorised transactions form their own category, so categories add up to the total. Periods are calendar dates in the workspace time zone (PA10); "last full month" is resolved there, not on the viewer's clock.

### P16 — Runway calculator

- **Route:** `/insights/runway`
- **Purpose:** Estimate months of runway from current cash and average net burn, with adjustable assumptions.
- **Business objective:** Owners open Ledgerline for planning, not just checking.
- **User objective:** Know how long the business can operate at current burn, and what changes it.
- **Primary tasks:** find out how many months the business can run; try different burn and inflow assumptions; see how cash projects forward; go back to the actual figures; share the scenario.
- **Required data:** `use-accounts`, `use-cash-flow`; calculation is a pure function in `lib/utils/`. Backend today: `GET /api/accounts` and `GET /api/cash-flow` exist. Freshness: cash is `live`, history `standard`, and the as-of time of the cash figure is stated with the result. Limits: `burn` and `inflow` are minor-unit digit strings of at most 15 digits; `months` is within the runway bounds in constants. With several currencies the calculation is for one chosen currency and never converts.
- **Permissions:** R1, R2. R3 and R4 get the role denial; a shared scenario opens only for R1 and R2 of the same workspace.
- **Device needs:** inputs editable with a numeric keyboard; the result has a text equivalent. Nothing is reduced on a phone.
- **Loading states:** inputs usable immediately; defaults fill in when loaded.
- **Empty states:** < 3 months of history → runs from manual input and says why defaults are missing. When inflows meet or exceed burn, the member is told cash is not decreasing on these assumptions; no month count is invented. Zero cash is stated as zero.
- **Error states:** defaults failed → the user is told and enters their own figures; the calculation cannot fail. Out-of-range or malformed values in the address fall back to the defaults.
- **Success states:** live result; assumptions in the URL. A shared address carries the assumptions and never the cash balance; whoever opens it sees current cash they are permitted to see.
- **Dependencies:** sections S03, [S29 Runway calculator](phase-5-section-blueprints.md#s29--runway-calculator). DOMAIN_TOOL; LD1.
- **Implementation notes:** an owner may make a hiring decision from this number, so it is never shown without its assumptions. (The built home page's S60 "treasury forecast" is a different, unspecified capability — OD9.) The result is always identified as an estimate. All arithmetic is integer arithmetic on minor units; no float (BR1). Months are rounded down to whole months and the member is told. Cash is Available balance (Phase 3 §8.3). Acceptance: the same inputs give the same result on every device and after reload.

### P17 — Statements

- **Route:** `/statements`
- **Purpose:** Download monthly account statements (PDF).
- **Business objective:** Remove "send me the statement" requests.
- **User objective:** The statement for a month and account in two actions.
- **Primary tasks:** get the statement for a given month and account.
- **Required data:** `use-statements` (required), including each statement's opening and closing balance. Backend today: none exists; the statements module is required. Each statement also carries its period, account, currency, issue time and version. History reaches back to the account's opening, at most `STATEMENT_HISTORY_MONTHS` (PA11); anything earlier is requested through P21. Freshness: `slow`; a month's statement is issued once the month has closed in the workspace time zone and the data source has finalised it (OD5), and until then it is listed as being prepared with no download. A corrected statement is never replaced silently: the correction is a new version for the same period, the latest version is the one given by default, earlier versions stay obtainable and are identified as superseded with the date, and members who downloaded a superseded version are notified (X7). Scale: narrowed by account and year and paged by the backend.
- **Permissions:** R1, R2, R3. R4 gets the role denial. The backend checks the role again when each download link is issued, so a member whose role was lowered or removed cannot download from a page left open. Statements of `closed` accounts stay available.
- **Device needs:** on every device the member can obtain the file and open or save it as the platform allows; where the device cannot save a file the member is told and can request it again elsewhere. Nothing is reduced on a phone.
- **Loading states:** route placeholder; progress for the statement whose download link is being requested. Changing account or year keeps the list readable and marked as updating.
- **Empty states:** "Your first statement is ready after the month closes" with the date. Narrowed to nothing (for example a year before the account opened) → says when the account opened and offers to clear. A month without transactions still has a statement, with opening equal to closing.
- **Error states:** S30 retry; a failed download link is reported for that statement only, with retry. A link not used within its lifetime (PA12) is reported as expired and a new one is requested on the member's next attempt, never in a loop. If the session ends during a download, a transfer already under way finishes or fails on its own; the next request asks for re-authentication and the member repeats it. "Not generated yet", "Ledgerline unavailable" and "offline" are three different messages; offline disables downloading.
- **Success states:** download starts; the statement is marked downloaded for this session. Every download is recorded by the backend with the actor, statement, version and time; the per-session mark is a convenience on the device, not that record. The member can carry on to another month or account without narrowing again.
- **Dependencies:** sections S03, [S30 Statement list](phase-5-section-blueprints.md#s30--statement-list). Flows: F4, X7. Format depends on OD1. Backend today: none exists. Decisions: OD1 (format and required content), OD5 (when a month is final).
- **Implementation notes:** download URLs are short-lived and fetched on click, never rendered into HTML. A period is a calendar month in the workspace time zone (PA10); the viewer's zone never moves a transaction between statements, and changing the workspace zone later does not reissue past statements. Closing balance is Current balance (posted only); a month's opening equals the previous month's closing, and a mismatch is reported as a defect, not hidden. The document carries the masked account number unless OD1 requires the full one, in which case downloading requires step-up (PA11). The file name holds the period and the last four digits, never a full number or a business name. Requesting a link is safe to repeat. The link never reaches the HTML, the query cache, browser history or a log.

### P18 — Exports

- **Route:** `/exports`
- **Purpose:** Build CSV/OFX-style exports and download them when ready.
- **Business objective:** Feed the customer's accounting system.
- **User objective:** A file their accounting tool accepts without cleanup.
- **Primary tasks:** get a file their accounting tool accepts; choose which accounts, period and format; know when it is ready and download it; recover a failed or expired export.
- **Required data:** `use-create-export`, `use-exports` (polls only while a job is `queued`/`running`). Backend today: none exists; the exports module is required. Limits (PA13): a range of at most `EXPORT_MAX_RANGE_DAYS` (366 days); at most `EXPORT_ACTIVE_JOB_LIMIT` (3) queued or running jobs per member; a file stays downloadable for `EXPORT_RETENTION_DAYS` (7 days) after `ready`, then the job is `expired`. Freshness: polled at `EXPORT_POLL_INTERVAL` (5 s) only while a job is active and the page is visible; after `EXPORT_POLL_MAX_MS` (30 minutes) the job is stated as delayed, automatic polling stops and the member can refresh by hand. Every job states the moment its data was read, so the member knows what the file is as of. Scale: an export larger than `EXPORT_MAX_ROWS` (5,000,000) is delivered by the backend as several files within one job.
- **Permissions:** R1, R2, R3. R4 gets the role denial. A member sees their own jobs; R1 and R2 also see every job in the workspace, because exports take data out of Ledgerline; R3 sees only their own (PA13). The backend checks the role again when each download link is issued.
- **Device needs:** a member can start an export on a phone and download it later on a desktop. Nothing is reduced on a phone; polling resumes when the member returns.
- **Loading states:** running jobs show progress and elapsed time. A refresh keeps the job list readable.
- **Empty states:** "Exports you create appear here". A member who may not export gets the role denial, never this message.
- **Error states:** create failure reported, input kept; `failed` gives the reason and offers retry; `expired` offers to recreate. At a limit the member is told which limit and what would clear it. A request identical to one still active returns that job instead of creating a second. `failed` distinguishes too large, data source unavailable and an internal failure, each with a reference. Download links expire and sessions end as on P17.
- **Success states:** the new job is listed at once as `queued`; `ready` raises a message and an X7 notification. Every creation and every download is recorded with the actor. A `ready` job leaves the member able to download it or run the same export again for another period.
- **Dependencies:** sections S03, [S31 Export builder](phase-5-section-blueprints.md#s31--export-builder), [S32 Export jobs](phase-5-section-blueprints.md#s32--export-jobs). Flows: F4, X7. Backend today: none exists. Decision: OD1 (the formats accounting tools in the jurisdiction accept).
- **Implementation notes:** P10, P11, P14, P15 link here with prefilled params. Polling interval and its 30-minute ceiling come from constants (`EXPORT_POLL_INTERVAL`, `EXPORT_POLL_MAX_MS`). The user is always told whether pending transactions are included. File contract: UTF-8; amounts as decimal strings derived from minor units by string placement of the decimal point, never through a float; a separate currency field; sign per BR3; dates as `yyyy-MM-dd`; account numbers masked. Text that begins with `=`, `+`, `-` or `@` (counterparty names, notes, references) is neutralised so a spreadsheet cannot execute it as a formula. Notes and categories are included; attachments are not. Ranges are calendar dates in the workspace time zone (PA10). Creation carries an idempotency key (PA19). The file name holds the period and format, no account number.

### P19 — Counterparty

- **Route:** `/counterparties/[counterpartyId]`
- **Purpose:** Everything exchanged with one payer or payee.
- **Business objective:** Supports investigations and vendor-spend questions.
- **User objective:** "How much have we paid this supplier, and when?"
- **Primary tasks:** find out how much they have paid to or received from this party, and when; change the period.
- **Required data:** `use-counterparty`, `use-transactions` (counterparty filter). Backend today: none exists. Freshness: `standard`. Totals are computed by the backend per currency and state whether returned and reversed entries are netted. Scale: a counterparty with a very long history pages as P10.
- **Permissions:** R1–R4; R4 sees permitted accounts only. Export not R4. Totals and entries cover permitted accounts only. A counterparty that appears only on accounts the member cannot see resolves to P34.
- **Device needs:** as P11. Only how many entries are readable at once may be reduced.
- **Loading states:** S33 and S23 load independently. Changing the period keeps the previous figures readable and marked as updating.
- **Empty states:** no transactions in range → S23 copy with range reset. A counterparty with no transactions at all for this member is P34, not an empty page.
- **Error states:** unknown ID → `notFound()`. The summary and the entries fail and retry independently. An ID merged into another record by the backend redirects to the surviving record.
- **Success states:** read-only. The member can carry the counterparty and period to P11 or P18.
- **Dependencies:** sections S03 (counterparty name), [S33 Counterparty summary](phase-5-section-blueprints.md#s33--counterparty-summary), S23 filtered to this counterparty. Leads to P12, P18. Flows: F3.
- **Implementation notes:** reuses `ledgerSearchParamsSchema`. The name is the bank-reported one and cannot be edited. Any bank detail of the counterparty is masked to its last four characters with no reveal. Neither the name nor the ID's meaning reaches the title.

### P20 — Notifications

- **Route:** `/notifications`
- **Purpose:** The full history of alerts and system notices.
- **Business objective:** Alerts that are read and acted on.
- **User objective:** See what happened while away and jump to it.
- **Primary tasks:** catch up on what happened while away; mark things read, one or all; go to what a notification is about; see only unread; manage alert rules (R1, R2).
- **Required data:** `use-notifications` (required); the count in S02 reads the same cache. Backend today: none exists. Freshness: the unread count refreshes every `NOTIFICATION_POLL_INTERVAL` (60 s) and on focus, and reads "99+" beyond 99; the history is `standard`. Retention: `NOTIFICATION_RETENTION_DAYS` (PA21), after which a notification is no longer listed. Scale: paged by cursor; "mark all read" acts on every unread notification, including those not loaded.
- **Permissions:** R1–R4, own notifications. Enforced by the backend. A viewer is only ever notified about permitted accounts. A notification whose subject the member can no longer see stays listed but opens to an explanation that it is no longer available to them.
- **Device needs:** each notification opens its subject on a phone. Marking read and narrowing to unread remain possible on a phone; nothing is reduced.
- **Loading states:** route placeholder. A refresh keeps the history readable.
- **Empty states:** "You're all caught up", offering P22 alert rules (R1, R2). Narrowed to unread with none → says nothing is unread and offers the full history; this is not the "caught up" message of an empty history.
- **Error states:** S34 retry; mark-read failure reverts with a message. A subject that no longer exists (an expired export, a removed member) says so and what can be done instead.
- **Success states:** mark read is optimistic; the count updates at once. Read state follows the member across tabs and devices on their next focus.
- **Dependencies:** sections S03, [S34 Notification feed](phase-5-section-blueprints.md#s34--notification-feed). Leads to P22 (R1, R2) and each notification's subject. Flows: X7.
- **Implementation notes:** `?filter=unread`. Cursor pagination through C25. Notification text never carries a full account number. Times are in the workspace time zone, with the zone available (PA10). The unread count never reaches the title.

### P21 — Messages

- **Route:** `/messages`, `/messages/[threadId]` · with a `messages/layout.tsx`
- **Purpose:** Secure messaging between the workspace and Ledgerline support.
- **Business objective:** Support without email, identity already established.
- **User objective:** Ask, attach a document, see the reply in one place.
- **Primary tasks:** ask support something and attach a document; see replies; carry on a conversation; resend a message that failed.
- **Required data:** `use-threads`, `use-thread`, `use-send-message` (required). Backend today: none exists. Freshness: `standard`, refetched on focus and while a conversation is open; no real-time channel is assumed. Limits: a message is at most `MESSAGE_MAX_LENGTH` (5,000 characters), with at most 5 attachments (PA14). Threads are kept for the life of the workspace (PA21). Scale: a long conversation loads backwards in pages.
- **Permissions:** R1, R2, R3. R4 has no nav entry; a direct visit gets a permission empty state. A thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1); other R2 and R3 members do not read it, and a thread that is not theirs answers exactly like one that does not exist. Members are told who can read a thread before they write. Staff replies are identified as Ledgerline staff. Enforced by the backend.
- **Device needs:** on small screens, the thread list and a single conversation are each fully usable, with a clear way back to the list; attachments from the phone's files or camera. Nothing is reduced on a phone.
- **Loading states:** route placeholder; a reply can be written while messages load. Earlier messages loading never moves the message being read.
- **Empty states:** no threads → "Start a conversation", offering P28; threads but none selected → "Select a conversation". A conversation support has closed says so and offers a new one.
- **Error states:** unknown thread → `notFound()` in the layout; send failure keeps the draft and marks the message "Not sent — Retry". A retried message reuses its idempotency key, so it is delivered once (PA19). An attachment refused for type or size is reported with the reason. A session that ends while writing keeps the draft in the open tab, so the member sends it after re-authenticating in place.
- **Success states:** the sent message is shown at once and settles with the server time. The member can leave; a reply raises a notification (X7).
- **Dependencies:** sections S03, [S36 Thread list](phase-5-section-blueprints.md#s36--thread-list), [S37 Conversation](phase-5-section-blueprints.md#s37--conversation). Leads to P28. Flows: X9.
- **Implementation notes:** the layout keeps S36 across threads. Unsent drafts are kept per thread in the open tab's memory only — never in `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache — and are cleared on send, on sign-out and when the tab closes. Members are told never to send a password, a verification code or a full account number, and that staff will never ask for one. Bodies are rendered as text, never as markup. Drafts hold text only, never attachments, and are also dropped when a different user signs in. Neither a thread's subject nor a name reaches the title.

### P22 — Workspace settings

- **Route:** `/settings`
- **Purpose:** Workspace name and defaults, and alert rules.
- **Business objective:** Useful rather than noisy alerts.
- **User objective:** Set the low-balance threshold and large-transaction limit once.
- **Primary tasks:** set the low-balance and large-transaction alerts once; change, pause or remove a rule; keep workspace details current.
- **Required data:** `use-workspace`, `use-update-workspace`, `use-alert-rules`, `use-update-alert-rules`. Backend today: none exists. Freshness: `slow`. Limits (PA17): at most `ALERT_RULE_LIMIT` (20) rules per member, each rule belonging to the member who made it (only R1 and R2 may have rules; there is no shared workspace rule); a display name of 1–`DISPLAY_NAME_MAX` characters; thresholds are minor-unit digit strings of at most 15 digits, greater than zero.
- **Permissions:** R1 edits everything; R2 edits their own alert rules (S35) and reads the workspace details (S38) without editing them; R3 and R4 may neither read nor edit alert rules or workspace details: they are redirected from `/settings` to `/settings/profile`, and if they reach the alert-rules section by a direct link they get the not-permitted state (C32) naming the owner. Alert rules are per member: R1 and R2 each see and change only their own. Enforced by the backend per form.
- **Device needs:** amounts entered with a numeric keyboard; unsaved changes are protected on every device. Nothing is reduced on a phone.
- **Loading states:** route placeholder. A refresh never overwrites a form the member has started editing.
- **Empty states:** no alert rules → recommended starter rules as one-action additions (values from constants).
- **Error states:** errors reported per form, values kept. When someone else saved the same workspace setting meanwhile, or the member changed the same rule of theirs in another tab or on another device, the save is refused, the member is told, the current value loads and they keep what they typed and choose what to do. Rules are per member, so one member's rule never conflicts with another's. At the rule limit the member is told and can remove or change a rule.
- **Success states:** save per form with confirmation; unsaved-changes guard. A rule applies to transactions that post after it is saved, never retroactively, and the member is told. Every change is recorded with its actor.
- **Dependencies:** sections S03, [S35 Alert rules](phase-5-section-blueprints.md#s35--alert-rules), [S38 Workspace general form](phase-5-section-blueprints.md#s38--workspace-general-form). Leads to P23, P25 (settings group, Phase 3). Flows: X7. LD3.
- **Implementation notes:** movement between P22, P23 and P25 comes from the nav config, not a separate layout. Deleting a rule is confirmed first (C52). A threshold belongs to one currency and applies only to accounts in that currency. Changing the workspace time zone changes future period boundaries only (statements, "today", comparisons), and the member is told before saving (PA10). The legal name comes from verification and cannot be edited here. The unsaved-changes protection also holds across a session expiry.

### P23 — Team

- **Route:** `/settings/team`
- **Purpose:** See who has access, invite teammates, change roles.
- **Business objective:** More members per workspace with least privilege.
- **User objective:** Give the accountant access in a minute without over-sharing.
- **Primary tasks:** give a teammate access at the right level; resend or withdraw an invitation; change what someone can do; remove someone; understand what each role allows.
- **Required data:** `use-team`, `use-invite-member`; S41 from `lib/data/`. Backend today: none exists. Freshness: `slow`, refetched after every change. Scale: up to `TEAM_MEMBER_LIMIT` (200) members and at most `INVITE_PENDING_MAX` (50) pending invitations (PA18), paged by the backend.
- **Permissions:** R1 all actions; R2 invites R3/R4 only and cannot change R1/R2. R3, R4 get a permission empty state. Enforced by the backend, including the R2 limits; R3 and R4 get the role denial naming the owner.
- **Device needs:** inviting and changing a role are possible on a phone; the permissions reference is readable on a phone. Nothing is reduced on a phone.
- **Loading states:** route placeholder. A refresh keeps the list readable.
- **Empty states:** only the owner → the owner is listed and the user is invited to add teammates.
- **Error states:** invite to an existing member → reported, input kept; role change failure reverts with a message. An address already invited offers to resend instead of creating a second invitation. At the member limit the person is told. A member removed by someone else meanwhile is reported as already removed. When two owners act on each other at once the backend keeps at least one owner and the other is told why their change did not apply.
- **Success states:** invitation appears as pending; role change is optimistic. An invitation works once, only for the invited address, for `INVITE_TTL_DAYS` (7 days, PA18); resending cancels the earlier link. Removing a member ends their access at their next request; their notes and flags stay attributed to them. Every change is recorded with its actor.
- **Dependencies:** sections S03, [S39 Team members](phase-5-section-blueprints.md#s39--team-members), [S40](phase-5-section-blueprints.md#s40--invite-member-form), [S41 Role permissions reference](phase-5-section-blueprints.md#s41--role-permissions-reference). Leads to P24. Flows: X6. Only path for non-owner members to join (BR12). Backend today: none exists (membership model, invitations).
- **Implementation notes:** the last owner cannot be removed or demoted; the action is unavailable with the reason given. Revoking an invitation and removing a member are confirmed first (C52); removal names the person and what they lose. Addresses are trimmed and compared without regard to case. Inviting carries an idempotency key (PA19). A viewer's permitted accounts are chosen when inviting and can be changed on P24. Nobody can raise their own role.

### P24 — Team member profile

- **Route:** `/settings/team/[memberId]`
- **Purpose:** One member's details, role and effective permissions.
- **Business objective:** Access reviews.
- **User objective:** Check exactly what a teammate can do before changing it.
- **Primary tasks:** check exactly what a teammate can do; change their role; remove them.
- **Required data:** `use-team-member`; S41 from `lib/data/`. Backend today: none exists. Freshness: `slow`, refetched before a role change or removal is confirmed. Includes, for a viewer, the accounts they are permitted.
- **Permissions:** R1, R2 (same limits as P23). R3 and R4 get the role denial. An R2 opening an owner or finance lead can read but not change, with the reason given. Enforced by the backend.
- **Device needs:** a phone user can check a teammate's effective permissions, change their role or remove them, with the same confirmation as on any other device. Nothing is reduced.
- **Loading states:** route placeholder. A refresh never discards a role change the person has not yet confirmed.
- **Empty states:** not applicable. A person invited but not yet joined has a profile in the invited state.
- **Error states:** unknown or removed member → `notFound()`. A change that collides with someone else's is reported, with the current role loaded.
- **Success states:** role change confirms. The change applies at the member's next request: a page they have open is refused and re-evaluated. After a removal the person returns to P23 with a confirmation.
- **Dependencies:** sections S03 (member name; back to P23), [S42 Profile form](phase-5-section-blueprints.md#s42--profile-form) read variant, S41 identifying this member's role. Flows: X6 (ROLE profile).
- **Implementation notes:** S42 is the same section as on P25 in its read variant. Removal is confirmed first (C52). The member's name and email never reach the title. Last-active time is in the workspace time zone, with the zone named (PA10). The last owner rule of P23 applies here too. Every change is recorded with its actor.

### P25 — Profile & security

- **Route:** `/settings/profile`
- **Purpose:** The user's own details, password, two-step and sessions.
- **Business objective:** Account-takeover resistance.
- **User objective:** Keep the account secure and sign out a lost device.
- **Primary tasks:** keep their details current; change their password; turn two-step on or off; sign out a lost device or every other device.
- **Required data:** `use-me` (exists), `use-update-profile`, `use-change-password`, `use-sessions`, `use-two-step`. Backend today: `GET /api/users/me` only. Each session is described by its device or browser and when it was last active, with the current one identified. Freshness: sessions refetch on focus.
- **Permissions:** R1–R4 self. Password change, two-step changes and revoke-all require step-up. Self only, enforced by the backend. Phase 3 §6.1 also grants this to R5–R7; how staff reach it is PA24.
- **Device needs:** passkey enrolment works on the device in hand; TOTP enrolment can be completed without scanning (a copyable key). Nothing is reduced on a phone.
- **Loading states:** route placeholder. A refresh never overwrites a form being edited.
- **Empty states:** only the current session → it is identified as this device.
- **Error states:** per form; wrong current password reported, input kept. A cancelled step-up changes nothing. Turning two-step off is unavailable, with the reason, when policy requires it (OD6). Revoking a session that has already ended is treated as done.
- **Success states:** confirmations; revoking the current session signs out (X3) after confirmation. A password change ends every other session, keeps this one and is notified to the account's email (required). Turning two-step on gives recovery codes once, and the member confirms they kept them before it takes effect. A revoked device is refused at its next request. Every one of these is recorded.
- **Dependencies:** sections S03, [S43 Security settings](phase-5-section-blueprints.md#s43--security-settings), S42 edit variant. Flows: X8, X4. Decision: OD6. Backend today: profile read only; password change, two-step, sessions and step-up are required.
- **Implementation notes:** email change is not offered here; it needs verification of the new address (Phase 8 open item). Revoking all other sessions is confirmed first (C52). Passwords, recovery codes and the TOTP key are never cached, stored, logged, reported or put in a URL. The last remaining second factor cannot be removed while two-step is on. Display name is 1–`DISPLAY_NAME_MAX` characters (PA17).

## Payments

v1 is read-only; availability is governed by OD3 and recorded in Phase 8 as Deferred. Both pages are fully specified so the decision, not the design, is the only thing left. Until the server-side money-movement switch is on, both routes call `notFound()` (P34) with no nav entry. A "coming soon" page would promise a regulated capability. **OD9:** the built home page presents payments with approvals; if the maintainer chooses side B, these pages are the starting point and gain an approval step.

### P26 — Transfer

- **Route:** `/payments/transfer`
- **Purpose:** Move money between own accounts or to a saved payee.
- **Business objective:** Turns the console into an operating account (F6).
- **User objective:** Send the right amount to the right place, once, with certainty.
- **Primary tasks:** send the right amount from the right account to the right place; check everything before committing; confirm it is really them; know it went through and when it will settle.
- **Required data:** `use-accounts`, `use-create-transfer` (transfers module; not in the v1 backend plan). Backend today: none exists. Available balance is refetched at review and again at confirm. Per-transfer and daily limits and the cut-off time come from the backend and are known to the member before they enter an amount.
- **Permissions:** R1, R2; step-up on confirm; limits and dual approval per OD3/OD9. While the switch is off everyone gets P34. When on, R3 and R4 get the role denial. Each transfer confirmation asks for its own step-up grant: a grant is single purpose, and one issued for any other purpose (a reveal, a security change, adding a payee) never authorises money movement.
- **Device needs:** a transfer can be reviewed in full on a phone before confirming. Nothing is reduced on a phone.
- **Loading states:** confirm disabled until the backend answers. A second confirmation while one is in flight is impossible.
- **Empty states:** fewer than two accounts and no payees → the user is told why and offered P27.
- **Error states:** insufficient funds, limit exceeded, cut-off passed → reported with the backend's reason; a "may have gone through" state never auto-retries. A balance or limit that changed between review and confirm returns the member to review with the new figures. A session that ends at confirm submits nothing; after re-authentication the member is back at review with the details kept and confirms again themselves. For an unknown outcome the transfer's status is looked up by its idempotency key before any further attempt is allowed. A `frozen` or `closed` source account is refused with the reason.
- **Success states:** confirmation with reference; appears in P10 as `pending`. Under dual approval the member is told it awaits approval, never that it was sent. The transfer is recorded with its actor. The member can open it in P10 or start another.
- **Dependencies:** sections S03, [S44 Transfer form](phase-5-section-blueprints.md#s44--transfer-form). Flows: F6, X4. Decision: OD3.
- **Implementation notes:** idempotency key from `nanoid` per review step; amount held as minor units in a string. Before confirming, the user is given the amount in figures and words, the source with its available balance, the destination, reference and date; after confirming, a reference and expected settlement. The amount is parsed from text to minor units by string, rejecting zero, negatives and more decimal places than the currency has. No conversion between currencies unless the backend quotes one. The idempotency key survives retries and reload and is replaced only when a detail changes. The address carries `payeeId` only, never an amount. Returning with Back after success cannot submit again. The cut-off is stated in the workspace time zone (PA10).

### P27 — Payees & bill pay

- **Route:** `/payments`
- **Purpose:** Manage payees and pay bills.
- **Business objective:** F7.
- **User objective:** Keep a trusted payee list and pay from it.
- **Primary tasks:** keep a trusted list of payees; add one and verify its details; pay one (→ P26); remove one.
- **Required data:** `use-payees` (payees module; not in v1 plan), including last paid and total paid per payee. Backend today: none exists. Freshness: `standard`. Totals are per currency. Scale: a long payee list is searched and paged by the backend.
- **Permissions:** R1, R2; adding a payee requires step-up, and that grant never authorises a payment: each payment confirmation asks for its own (P26). While the switch is off everyone gets P34. When on, R3 and R4 get the role denial.
- **Device needs:** as P26. Nothing is reduced on a phone.
- **Loading states:** route placeholder. A refresh keeps the list readable.
- **Empty states:** "Add your first payee". Narrowed to nothing by search → says no payee matches and offers to clear.
- **Error states:** S45 retry; duplicate payee reported, input kept. A cancelled step-up saves nothing and keeps the input. A payee with a payment in progress cannot be removed, with the reason.
- **Success states:** payee added; pay opens P26 with the payee preselected. Adding and removing a payee are recorded with the actor and notified to the owner (X7).
- **Dependencies:** sections S03, [S45 Payee list](phase-5-section-blueprints.md#s45--payee-list). Leads to P26. Flows: F7, X4. Decision: OD3.
- **Implementation notes:** nav visibility is read from the nav config and the server-side switch; a direct visit while off renders P34. Destinations are always masked. Removing a payee is confirmed first (C52). Account details are validated by the backend before saving. Duplicates are detected on the normalised details, not the name. Once saved, a destination is never given in full again, even to the member who entered it; changing a destination means adding a new payee.

## Internal (admin)

Every page below renders inside the `(admin)` layout, which checks the internal role server-side and renders P34 for anyone else. These pages are used all day by the same people; staff need speed over explanation.

### P29 — Admin overview

- **Route:** `/admin`
- **Purpose:** Platform health for internal staff.
- **Business objective:** Spot growth and anomalies early (D7).
- **User objective:** Know user totals and the trend; jump to work queues.
- **Primary tasks:** know how many users there are and how that is trending; look at a different range; get to users, compliance or support work.
- **Required data:** `use-admin-user-total`, `use-admin-user-series` (both endpoints exist); the total for the period with its change against the previous period. Freshness: `standard`, each figure with its as-of time; the total and the series come from two requests and may differ by the moment between them. Ranges are UTC days and say so (PA10). Scale: the series is bucketed by the backend.
- **Permissions:** R7 full; R5, R6 read. Signed out → P02; not staff → P34; enforced in the `(admin)` layout and by the backend. R5–R7 are indistinguishable to the backend today (A9), so the read-only limits on R5 and R6 hold only once platform roles exist.
- **Device needs:** figures readable on a phone; the series has a text equivalent. Nothing is reduced on a phone.
- **Loading states:** each figure and the series load independently. Changing the range keeps the previous figures readable and marked as updating.
- **Empty states:** no points → "No sign-ups in this range". A range before the platform's earliest user says so, distinct from a range with no sign-ups.
- **Error states:** each figure and the series fail and retry independently.
- **Success states:** read-only.
- **Dependencies:** sections S03, [S48 Platform growth figures](phase-5-section-blueprints.md#s48--platform-growth-figures). Leads to P30, P32, P33. Flows: D7. LD1.
- **Implementation notes:** `?range=` parsed against the stats endpoint's enum. Figures are counts; no personal data is served to this page. When the previous period is zero no percentage change is given.

### P30 — Admin users

- **Route:** `/admin/users`
- **Purpose:** Find, create and manage platform users.
- **Business objective:** Operational control (D7).
- **User objective:** Find a user by email in seconds; create one when needed.
- **Primary tasks:** find a user by email in seconds; narrow by role or status; create a user when needed; open a user.
- **Required data:** `use-admin-users` → `GET /api/users`; `use-create-user` → `lib/actions/create-user.ts` → `POST /api/users` (both exist). Freshness: `standard`. Scale: the list endpoint is unpaged today, so the whole list reaches the device; cursor paging and server search are required before the user count exceeds `ADMIN_USERS_CLIENT_LIMIT` (PA23; Phase 5 Q3).
- **Permissions:** R7 only. R5 and R6 are staff, so they are told the page is not part of their role rather than given P34; not staff → P34. Enforced by the backend; see A9 for today's limit.
- **Device needs:** search and open a user from a phone. Creating a user is also possible on a phone; nothing is reduced.
- **Loading states:** route placeholder. A refresh keeps the list readable.
- **Empty states:** no match → "No users match" with an offer to clear the search.
- **Error states:** S49 retry; duplicate email on create → reported as already in use, input kept. Invalid role, status or password are reported against what was entered (422).
- **Success states:** the created user is confirmed and listed immediately. The creation is recorded with the admin as actor.
- **Dependencies:** sections S03, [S49 Platform user directory](phase-5-section-blueprints.md#s49--platform-user-directory); creation through C21. Leads to P31. Flows: D7. LD2. Backend today: list and create exist; paging, server search and the audit record are required.
- **Implementation notes:** `role` and `status` enums come from the generated contract. `GET /api/users` is unpaged today (Phase 5 Q3). `q` here is an email fragment typed by staff: the route is never sent to analytics and is served `no-store`. Creation carries an idempotency key (PA19). A password typed for a new user is never shown again, cached or logged.

### P31 — Admin user detail

- **Route:** `/admin/users/[userId]`
- **Purpose:** View and edit one user; suspend or delete.
- **Business objective:** Resolve account problems (D7).
- **User objective:** Change status or role correctly, with a record.
- **Primary tasks:** check a user's status and details; correct their role or status with a record; suspend or reactivate them; delete them when that is really intended.
- **Required data:** `use-admin-user` → `GET`/`PATCH`/`DELETE /api/users/{id}` (exist). Freshness: `standard`, refetched before a destructive action is confirmed.
- **Permissions:** R7 edit; R5 read-only with the reason. R6 is told the page is not part of their role; not staff → P34. Enforced by the backend; see A9.
- **Device needs:** destructive actions require the same typed confirmation on every device. Nothing is reduced on a phone.
- **Loading states:** route placeholder. A refresh never overwrites an edit in progress.
- **Empty states:** not applicable.
- **Error states:** unknown ID → `notFound()`; save failure reported, input kept. A save over a record someone else changed meanwhile is refused and the current record loads with the admin's input kept (this needs a version check the backend does not publish today; it is a required backend change, and overwriting someone else's change is not an accepted behaviour in the meantime). Deleting a user already deleted is treated as done. Deleting the last admin, or the sole owner of a workspace, is refused with the reason (required).
- **Success states:** save confirmation; delete returns to P30. Suspension refuses the user at their next request (required). Focus moves to the confirmation.
- **Dependencies:** sections S03 (user email; back to P30), [S50 Admin user record](phase-5-section-blueprints.md#s50--admin-user-record). Flows: D7; audit log required. Backend today: read, update and delete exist; the audit record, version check and session revocation on suspend are required.
- **Implementation notes:** an admin cannot delete or demote themselves. Suspension (reversible) is always offered before deletion (irreversible); deleting requires typing the user's email. The typed confirmation is compared trimmed and without regard to case. The user's email never reaches the title.

### P32 — Compliance queue

- **Route:** `/admin/compliance`, `/admin/compliance/[caseId]` · with a `compliance/layout.tsx`
- **Purpose:** Review KYB/KYC cases and decide them.
- **Business objective:** Fast, consistent, auditable decisions (D6, F5).
- **User objective:** Work oldest-first and decide each case with the evidence in view.
- **Primary tasks:** work through cases oldest first; narrow to a state; review a case's evidence; approve it, reject it with a reason, or ask for more information.
- **Required data:** `use-compliance-cases`, `use-compliance-case`, `use-decide-case` (required); the queue reports the oldest waiting case and the count of `submitted` cases; a case carries business details, owners, documents and history. Backend today: none exists. Freshness: the queue is `standard` and refetches on focus; a case is refetched when a decision is about to be recorded. A case being reviewed is marked as claimed by that reviewer for `CASE_CLAIM_MINUTES` (PA17) and others are told. Scale: a queue of thousands is paged by the backend, oldest submission first. Documents are read through short-lived links (PA12), and each view is recorded.
- **Permissions:** R6, R7. The backend blocks a reviewer deciding a case for a workspace they belong to. R5 is told the page is not part of their role; not staff → P34. A reviewer blocked for belonging to the workspace is told why and the case stays in the queue for others.
- **Device needs:** a reviewer on a tablet can read every document and decide. On a phone a reviewer can read the case, read documents one at a time and decide; reading two documents at the same time may be unavailable.
- **Loading states:** document previews load lazily. A refresh of the queue never changes the case being reviewed.
- **Empty states:** "No cases waiting". Narrowed to a state with no cases → says none are in that state and offers the full queue.
- **Error states:** unknown case → `notFound()` in the layout; decision failure keeps the note; conflict shows the other decision. A document that cannot be previewed (damaged, unsupported, password-protected) says so, and the reviewer can ask the owner for another. A decision is sent with the case's version; a stale one is refused.
- **Success states:** decision recorded; the next case opens. A decision is final once recorded; reopening is a separate recorded action. The owner is notified (X7). The next-oldest case opens, or the empty message when none remain.
- **Dependencies:** sections [S51 Compliance case queue](phase-5-section-blueprints.md#s51--compliance-case-queue), [S52 Compliance case review](phase-5-section-blueprints.md#s52--compliance-case-review). Flows: D6, F5. Decision: OD1.
- **Implementation notes:** the layout keeps queue filters across cases. Rejecting requires a reason; requesting information requires a note. A reason or note is `DECISION_NOTE_MIN`–`NOTE_MAX_LENGTH` characters, and the reviewer is told the owner reads it verbatim. Personal identifiers are masked until the reviewer asks to see them, and that is recorded. No business or person name reaches the title or the URL. Recording a decision is safe to repeat (PA19).

### P33 — Support console

- **Route:** `/admin/support`
- **Purpose:** Look up a workspace or user to help a customer, read-only.
- **Business objective:** Resolve tickets without database access (D5).
- **User objective:** Find the customer from what they said and see the state that explains their problem.
- **Primary tasks:** find the customer from what they said; understand the state that explains their problem; read their message thread.
- **Required data:** `use-support-lookup` (required); results grouped by workspace and user, each with status. Backend today: none exists. Limits: at least `SUPPORT_QUERY_MIN` characters; at most `SUPPORT_RESULT_LIMIT` results, with the agent told when more exist and to refine (PA17). Freshness: `standard`.
- **Permissions:** R5, R7. Every lookup audit-logged. No balances or full account numbers. R6 is told the page is not part of their role; not staff → P34. No document, balance or full account number is served to this page by the backend, and no agent can act as the customer.
- **Device needs:** staff on a laptop or tablet can look up a customer and read their thread; the same remains possible on a phone, where only how many results are readable at once may be reduced.
- **Loading states:** previous results stay readable, marked busy.
- **Empty states:** before search → what can be searched; no match → "No workspace or user matches".
- **Error states:** S53 retry. Too many lookups states when to try again.
- **Success states:** results link to P31 and the thread. The lookup is recorded with the agent, the query and the time.
- **Dependencies:** sections S03, [S53 Support lookup](phase-5-section-blueprints.md#s53--support-lookup). Leads to P31 and the thread. Flows: D5, X9. Backend today: none exists.
- **Implementation notes:** minimum query length from constants. A lookup runs when the agent submits it, not on each keystroke, so the audit record holds what was searched for and not fragments. A search by transaction reference returns the workspace it belongs to, never the amount. `q` handling follows P30.

## System

### P34 — Not found (404)

- **Route:** `app/not-found.tsx`; per segment `(app)`, `(admin)`
- **Purpose:** Explain that the address does not exist or is not available, and offer a way on.
- **Business objective:** Retain users who follow stale links.
- **User objective:** Get back to something useful.
- **Primary tasks:** get back to something useful; find help.
- **Required data:** none. Only whether a session cookie is present, to choose the way on.
- **Permissions:** all. Inside `(app)` it renders within the `(app)` layout. A missing record and a forbidden one get the same status, the same words and no difference the visitor could measure from the frontend.
- **Device needs:** none beyond the baseline.
- **Loading states:** none. It renders without any request.
- **Empty states / Error states:** not applicable.
- **Success states:** the user is told plainly the page does not exist and offered one way on — P08 when signed in, P01 otherwise — and P28. The requested address and any ID in it are never repeated back to the visitor.
- **Dependencies:** section [S54 Status explanation](phase-5-section-blueprints.md#s54--status-explanation) `not-found`. Flows: X10.
- **Implementation notes:** returns HTTP 404. Used deliberately for forbidden resources and for the admin area seen by non-staff. Static title; not indexed. Analytics record the route pattern only. Inside `(app)` and `(admin)` the layout's navigation still works, so a stale notification, saved view or shared link is recoverable.

### P35 — Server error (500)

- **Route:** `app/error.tsx`, `app/global-error.tsx`; per segment `error.tsx`
- **Purpose:** Recover from a page that failed to render.
- **Business objective:** Keep trust when something breaks; get a diagnosable report.
- **User objective:** Try again, or get out, without losing their place.
- **Primary tasks:** try again; get out without losing their place; contact support with a reference.
- **Required data:** the error `digest`. It must render with no other data and no provider. Health is checked to tell "this page failed" from "Ledgerline is unavailable".
- **Permissions:** all. It shows no account, workspace or user data.
- **Device needs:** none beyond the baseline.
- **Loading states:** retry shows progress. While the service is unavailable, health is rechecked with backoff and the person is told when it is back.
- **Empty states:** not applicable.
- **Error states:** a second failure keeps the page and leads with the support route in the copy. Three situations get different words: this page failed (retry), Ledgerline is unavailable (no promised time), and the device is offline.
- **Success states:** `reset()` re-renders the segment. Input typed in the failed segment may be lost and the person is told; drafts kept in the open tab (P21) survive a retry, and are gone once the tab is closed.
- **Dependencies:** section S54 `error` (and `offline` when the browser is offline). Leads to P08 or P01, and P21 (signed in) or P28. Flows: X10; `GET /api/health` (exists) distinguishes "we are down" from "this page failed". Backend today: health exists.
- **Implementation notes:** `global-error.tsx` renders its own `<html>` and `<body>` and depends on no provider. No stack traces or backend messages. The user is told that viewing failed and money was not affected, and given the error `digest` as a reference. Returns HTTP 500. The `digest` is the only identifier shown: no path, ID, email or query string appears in the message, and error reports hold the route pattern and digest only, never request bodies. "Money was not affected" is true only while v1 is read-only; if OD3 enables transfers, a failure after a confirmed transfer instead directs the member to P10 to check its status.

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

- **Enterprise audit (2026-10-01):** every page's Required data, Permissions, Device needs, the four state fields, Dependencies and Implementation notes deepened with freshness, scale edges, limits, denial and signed-out behaviour, session expiry and step-up mid-task, conflict and double submission, money and time-zone rules, audit, and what never reaches a URL, title or log. Shared behaviour added once to Metadata and indexing, Permissions and enforcement, Device baseline, State ladder and URL state by page. Assumptions PA10–PA24 added. **Changed:** P08 Device needs and the D1–D3 role-variant notes no longer rank sections ("first", "third", "last"); P17, P24, P32 and P33 Device needs restated as tasks; P09 Required data now names the existing account list endpoint. **Reconciled** with Phase 1 BR19 and the canonical decisions: reveal 30 s, download link 5 minutes, reset link 30 minutes, 3 active exports, 5,000,000 export rows, read timeout 15 s and write timeout 30 s, `STEP_UP_WINDOW` renamed `STEP_UP_GRANT_SECONDS`; a stale write is refused everywhere (P12, P13, P22, P31 no longer allow last-write-wins); interrupted writes are re-submitted by the member; a permission denial is the not-permitted state, not an error; the sample `ledgerSearchParamsSchema` and the URL table follow Phase 3 §11.1, including `direction`, `category` and `attachment` and a `q` of 2–100 characters; an unbounded ledger query pages by cursor, alert rules are per member, a support thread belongs to the member who opened it, drafts are kept in the open tab's memory only, and a step-up grant for another purpose never authorises money movement; event times use the workspace time zone; P07, P18 and P23 repeat their sections' limits; OD11–OD14 referenced. No page, section, flow, state, permission, ID or open decision removed.

- **Self-audit (tightened seed, No Visual Prescription):** "Content requirements" and "Actions" removed from all 35 pages. Section mapping, primary information and reachability moved to **Dependencies**; genuine requirements moved to the field they belong to (security, permission, confirmation and truthfulness rules — see the maintainer report); data facts moved to **Required data**. "Primary tasks" rewritten as user goals. Placement and container wording in states, device needs and conventions ("inside the shell", "frame", "overlay closes", "row", "inline", "per block", "chart placeholder", "tables", "highlighted") rewritten as behaviour. No page, section, state, flow, permission or open decision removed.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md) (personas R1–R8, BR1–BR20 with BR19 the authority for every limit, OD1–OD16), [Phase 2](phase-2-experience-maps.md) (F, D, X flows), [Phase 3](phase-3-information-architecture.md) (routes, groups, navigation, SEO).
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
| PA8 | `DASHBOARD_VARIANTS` and a `DashboardVariant` composer decide which sections each role receives on P08, as the Role variants table states; they express membership, not an order. |
| PA9 | Onboarding steps are `business`, `owners`, `documents`, `review`; the workspace is created on the first business-details save. |

Added by the 2026-10-01 enterprise audit. Every number is a product decision the maintainer (owner of each row) can change in one constant; none is a legal or regulatory claim. Values that depend on jurisdiction are subordinate to OD1. Where a row holds a limit, timing or retention value, [Phase 1](phase-1-product-vision.md) BR19 is the authority: the value here restates it, and the constant names are those of Phase 7 §10.

| ID | Assumption |
|---|---|
| PA10 | **Time.** Period boundaries (statement months, "today", comparison periods, export ranges, relative presets, payment cut-offs) are calendar dates in the workspace time zone (`WorkspaceSettings.timeZone`, IANA; UTC when unset), never the viewer's. Posting dates are calendar dates and are never shifted. Member-facing timestamps of events are given in the workspace time zone, with the zone named. Internal (`(admin)`) pages use UTC. |
| PA11 | **Statement history.** `STATEMENT_HISTORY_MONTHS` = 84, or back to the account's opening if shorter. Corrections are new versions; superseded versions stay obtainable. The document carries the masked account number unless OD1 requires the full one, in which case downloading requires step-up. Authority: Phase 1 BR19. |
| PA12 | **Download links** (statements, exports, attachments, verification documents) are issued per request, work once, and expire after `DOWNLOAD_LINK_TTL` = 5 minutes. The role is checked again at issue. Authority: Phase 1 BR19. |
| PA13 | **Exports.** `EXPORT_MAX_RANGE_DAYS` = 366; `EXPORT_ACTIVE_JOB_LIMIT` = 3 queued or running per member; `EXPORT_RETENTION_DAYS` = 7 after `ready`; `EXPORT_MAX_ROWS` = 5,000,000; `EXPORT_POLL_INTERVAL` = 5 s; `EXPORT_POLL_MAX_MS` = 30 minutes, after which a job is stated as delayed and the client stops polling. A member sees their own jobs; R1 and R2 also see every job in the workspace; R3 sees only their own. Authority: Phase 1 BR19. |
| PA14 | **Uploads.** PDF, JPEG or PNG; `UPLOAD_MAX_BYTES` = 10 MB per file; `UPLOAD_MAX_FILES`: at most 10 files per transaction, 5 per message, 10 per verification document kind and 20 per verification case; an avatar is at most `AVATAR_MAX_BYTES` = 2 MB. Authority: Phase 1 BR19. |
| PA15 | **Slow and timed-out requests.** `SLOW_REQUEST_MS` = 10 s; `REQUEST_TIMEOUT_MS` = 15 s for a read; `MUTATION_TIMEOUT_MS` = 30 s for a write, and a timed-out write is never sent again automatically; reads are retried `QUERY_RETRY_LIMIT` = 2 times with a 1–8 s backoff, writes never. Authority: Phase 1 BR19. |
| PA16 | **Step-up.** `STEP_UP_GRANT_SECONDS` = 5 minutes, for a single purpose within the same session. A grant issued for any other purpose never authorises money movement; each transfer or payment confirmation asks for its own grant. A revealed account number is masked again after `REVEAL_TIMEOUT` = 30 s (with a warning 10 s before and a way to extend), when the page is hidden and on navigation. Reveal is for R1–R3 after step-up; never R4 or an internal role. Authority: Phase 1 BR19. |
| PA17 | **Text and count limits.** `NOTE_MAX_LENGTH` = 2,000; `DECISION_NOTE_MIN` = 10; `MESSAGE_MAX_LENGTH` = 5,000; `LEDGER_QUERY_MAX_LENGTH` = 100 (a search is sent from 2 characters); `SAVED_VIEW_LIMIT` = 50 per member; `SAVED_VIEW_NAME_MAX` = 60; `DISPLAY_NAME_MAX` = 80; `LEDGER_QUERY_MIN_LENGTH` = 2; `LEDGER_ACCOUNT_FILTER_MAX` = 50; `ALERT_RULE_LIMIT` = 20 per member (R1 and R2 only; no shared workspace rule); `OWNER_LIMIT` = 20 beneficial owners in a verification case (not workspace members with the owner role); `HELP_ARTICLE_LIMIT` = 200 for client-side search; `SUPPORT_QUERY_MIN` = 3; `SUPPORT_RESULT_LIMIT` = 50; `CASE_CLAIM_MINUTES` = 30. Authority: Phase 1 BR19. |
| PA18 | **Team.** `TEAM_MEMBER_LIMIT` = 200 members per workspace, with at most `INVITE_PENDING_MAX` = 50 pending invitations; `INVITE_TTL_DAYS` = 7, single-use, bound to the invited address; resending invalidates the earlier link. Authority: Phase 1 BR19. |
| PA19 | **Idempotency.** Every create and every decision carries a client-generated `nanoid` key (sent as `IDEMPOTENCY_KEY_HEADER`), reused when the member re-submits the same submission; the backend honours a key for 24 hours and answers a repeat with the original result. Authority: Phase 1 BR19. |
| PA20 | **Reading the audit record.** No page in this design OS reads it. Who may read it is OD12, whose default is: R7 all of it, R6 case history, R5 only the entries tied to a reference a member quoted, workspace members none in v1 (no workspace audit page), though they may ask support for entries about their own workspace. Owner: maintainer. |
| PA21 | **Retention on the inbox pages.** `NOTIFICATION_RETENTION_DAYS` = 90; the unread count refreshes every `NOTIFICATION_POLL_INTERVAL` = 60 s and reads "99+" beyond 99. Message threads are kept for the life of the workspace. Authority: Phase 1 BR19. |
| PA22 | **Authentication lifetimes.** `RESET_LINK_TTL` = 30 minutes, single-use; `CHALLENGE_TTL` = 5 minutes. Sign-in and step-up allow `AUTH_MAX_ATTEMPTS` = 5 failures in 15 minutes, then a 15-minute lock; the backend enforces and reports this, and the client never counts attempts. `next` is a same-origin path of at most 2,048 characters. Subordinate to OD2 and OD6. Authority: Phase 1 BR19. |
| PA23 | **Scale edges.** `LEDGER_PAGE_SIZE` = 50; `LEDGER_MAX_PAGES` = 10 held on the device; `LEDGER_MAX_RANGE_DAYS` = 731, applied only when a query gives both `from` and `to` (with neither, the ledger pages back by cursor without limit; when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared); a backend search is given `SEARCH_TIMEOUT_MS` = 5 s; `COUNT_EXACT_LIMIT` = 10,000: beyond it a match count is reported as "10,000+". `ADMIN_USERS_CLIENT_LIMIT` = 1,000 users held on the device while the list endpoint is unpaged. Authority: Phase 1 BR19. |
| PA24 | **Undecided, owner: maintainer.** (a) P03 reports "email already registered", which discloses that an address has an account, while P04 deliberately does not; rate limiting is the only mitigation specified. This is OD13, whose default is that registration gives the same neutral answer and the existing user is told by email. (b) Phase 3 §6.1 grants "Edit own profile, password, two-step, sessions" to R5–R7, but P25 sits in the `(app)` group, which expects a workspace. (c) P30 and P33 keep a staff-typed email fragment in `q`; whether those two queries should stay out of the address is open (related: OD14). (d) Role changes and owner-level invitations on P23 and P24 do not require step-up in Phase 3 §6.1. |
