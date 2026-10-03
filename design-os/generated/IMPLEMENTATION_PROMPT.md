# Ledgerline Design OS — Implementation Prompt

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Setup checklist](SETUP-CHECKLIST.md) · [Start here](START_HERE.md) · [Index](ARTIFACT_INDEX.md)

## Table of contents

- [0. How to use this prompt](#0-how-to-use-this-prompt)
- [1. Ground rules](#1-ground-rules)
- [2. Required reading (Phases 1–6)](#2-required-reading-phases-16)
- [3. Visual Design Hand-off](#3-visual-design-hand-off)
- [4. Blockers to clear before and during Sprint 1](#4-blockers-to-clear-before-and-during-sprint-1)
- [5. Phase 7 implementation: architecture](#5-phase-7-implementation-architecture)
- [6. Phase 8 implementation: sprints](#6-phase-8-implementation-sprints)
- [7. Phase 9 implementation: quality gate](#7-phase-9-implementation-quality-gate)
- [8. Code patterns and standards](#8-code-patterns-and-standards)
- [9. Testing strategy](#9-testing-strategy)
- [10. Pre-merge checklist](#10-pre-merge-checklist)
- [11. Deployment readiness](#11-deployment-readiness)
- [12. Conflicts between phases and how to resolve them](#12-conflicts-between-phases-and-how-to-resolve-them)
- [13. References](#13-references)

## 0. How to use this prompt

This is a self-contained prompt for a build session. Copy the whole file into a new session, then add one line naming the work, for example:

> Build Sprint 2 — Auth and the first real-data slice.
> Build P10 Account ledger only.
> Fix host findings H-14, H-15 and H-16.

The session must then:

1. Read [§1 Ground rules](#1-ground-rules) and obey them for every edit.
2. Read the phase sections listed for the named work in [§2](#2-required-reading-phases-16) and [§6](#6-phase-8-implementation-sprints).
3. For every page in scope, follow the [Visual Design Hand-off](#3-visual-design-hand-off) before writing any page code.
4. Build in the order of [§6](#6-phase-8-implementation-sprints), using the patterns in [§8](#8-code-patterns-and-standards).
5. Check each item against [§7](#7-phase-9-implementation-quality-gate) and [§10](#10-pre-merge-checklist).
6. Update status in [Phase 8](phase-8-implementation-roadmap.md#build-status-register) — and nowhere else.
7. Report what was built, what was not, and why.

## 1. Ground rules

1. **The host wins.** `.claude/CLAUDE.md` overrides this prompt. Where they disagree, follow the host and note it.
2. **Never touch the owner's work in progress without instruction.** The home page (`app/page.tsx`, `components/ledgerline/`, `lib/data/ledgerline/`, `lib/ledgerline/`, `lib/types/ledgerline.ts`, `lib/validations/contact.ts`, `components/wrappers/reveal-words.tsx`, `lib/hooks/use-damped-pointer.ts`) is uncommitted work. Do not checkout, switch branches, stash, reset or commit it. Do not change it toward either side of OD9 or OD10.
3. **Scope preservation.** Never delete a specified feature because it is not built. Status is recorded in Phase 8, never resolved by deletion. Removal needs an explicit maintainer instruction naming the feature.
4. **No visual prescription from documents.** Nothing in this design OS says how a page looks; do not infer a look from it. See [§3](#3-visual-design-hand-off).
5. **No hard-coding.** Routes, durations, enums, copy used twice → `lib/constants.ts` or `lib/<feature>/constants.ts`; endpoints from `@/lib/contract` or `lib/api-routes.ts`; static copy and config in `lib/data/`.
6. **Framework and installed libraries first.** No new dependency without an approved LD entry; propose, wait, then `pnpm add`. Never hand-edit `package.json`.
7. **Money is exact.** Minor units in strings; format only through C40 Amount; `BigInt` for arithmetic; never `parseFloat`, `Number(` on money, `toFixed`.
8. **Every data section has four states** through C57 QueryBoundary.
9. **Components never import the API client.** Transport → action → hook → component.
10. **File rules.** One component per file, kebab-case matching the export, `@/` imports, ≤ ~150 lines, no comments, no `console`, `nanoid` for IDs.
11. **Accessibility is not optional.** WCAG 2.2 AA; keyboard for every flow; focus always visible; nothing conveyed by colour or motion alone.
12. **Heavy commands** (type-check, lint, build, tests) run at the gate or on request, not on every edit.

## 2. Required reading (Phases 1–6)

Read before coding. The session should open only the parts named for the work.

| Phase | Read | Why |
|---|---|---|
| [Phase 1 — Product Vision](phase-1-product-vision.md) | Product purpose, personas, business rules BR1–BR12, permission matrix, product principles, non-goals, OD1–OD10 | Every rule here binds code; OD9/OD10 explain the home-page divergence |
| [Phase 2 — Experience Maps](phase-2-experience-maps.md) | The flows the work serves (F, D, X) | Failure and recovery paths become states and tests |
| [Phase 3 — Information Architecture](phase-3-information-architecture.md) | Sitemap, role navigation, §6 permissions, §8 labels, §11 filters, §13 breadcrumbs, §14–§16 routes and prefixes | Routes, labels and guards are fixed here |
| [Phase 4 — Page Blueprints](phase-4-page-blueprints.md) | Conventions + the pages in scope | Primary tasks, permissions, device needs, states, sections depended on |
| [Phase 5 — Section Blueprints](phase-5-section-blueprints.md) | Section contract + the sections in scope | Purpose, data, interaction, states |
| [Phase 6 — Interaction Contracts](phase-6-interaction-contracts.md) | Inherited rules + the contracts in scope | Keyboard, ARIA, validation, loading, error behaviour |

## 3. Visual Design Hand-off

This design OS defines what each page must do, not how it looks. The look of each page is decided when it is built: before coding a page, run a visual concept for it with the repo's UI skills, present it to the owner, and build only after approval. Review the rendered page before marking it Built.

How to apply it in this repository:

1. **Inputs to the concept.** The page's primary tasks, states and device needs ([Phase 4](phase-4-page-blueprints.md)), its sections' purpose and behaviour ([Phase 5](phase-5-section-blueprints.md)) and the contracts it uses ([Phase 6](phase-6-interaction-contracts.md)). These fix what users must get done and how the product behaves; they do not fix what the page contains, its arrangement or its appearance.
2. **UI skills.** Use the skills the repo provides for UI work (for example `elegant-ui` for app screens; a register skill such as `cinematic-web` where the owner wants it for public pages). The skills govern how UI is written; the concept decides how this page looks.
3. **Present, then wait.** Show the concept to the owner. Do not write page code until it is approved. Record the approval (date, page ID) in the PR.
4. **Build to the approved concept** and to the requirements. If the two conflict, stop and ask; do not drop a requirement to fit a concept.
5. **Review the rendered page** (running app, phone and desktop widths, keyboard pass) with the owner before setting the page to Built in Phase 8.
6. **Existing pages.** P01 is already built by the owner; its look is the owner's decision and is not reviewed against this design OS. Its *content* is governed by OD9/OD10.

## 4. Blockers to clear before and during Sprint 1

### 4.1 Open decisions

| ID | Decision | Default until answered | Needed by |
|---|---|---|---|
| OD1 | Jurisdiction, regulator, default currency | Jurisdiction-neutral fields; `Intl` everywhere | Sprint 5 |
| OD2 | Session policy | Recommend 15 min idle, 12 h absolute, step-up for reveals | Sprint 2 |
| OD3 | Money movement | v1 read-only; P26/P27 render 404 | Revisit trigger |
| OD4 | Feature folders | Do not create `components/<feature>/` until the host table is amended | Sprint 1 |
| OD5 | Banking data source | Contract-first; no frontend mock data | Sprint 3 (backend) |
| OD6 | Two-step method | Passkeys + TOTP fallback | Sprint 7 |
| OD8 | LD1–LD5 | Fallbacks per Phase 8 | Sprint 1 |
| **OD9** | Public page scope vs v1 | Leave the built page as is, with its disclosures; do not deploy it as the product site | Request now; answer by Sprint 8 |
| **OD10** | Entry path from the public site | P02/P03 reachable by URL; no change to the home page | Sprint 2 |

### 4.2 Library proposals (all awaiting approval)

| ID | Need | Recommendation | Fallback if not approved |
|---|---|---|---|
| LD1 | Charts | `recharts` | Figures and tables without charts |
| LD2 | Table + virtualization | `@tanstack/react-table` + `@tanstack/react-virtual` | C15 with cursor pages; M3 at risk |
| LD3 | Forms | `react-hook-form` + `@hookform/resolvers` | `useState` + Zod `safeParse` |
| LD4 | Testing | Testing Library, jsdom, Playwright, axe | Manual checks of record |
| LD5 | Positioning | native popover + anchor positioning | — |

### 4.3 Host findings Sprint 1 fixes first

| Finding | What users experience | Fix |
|---|---|---|
| H-14 | Future routes reachable signed out; no admin role check | Expand `PROTECTED_ROUTE_PREFIXES`; `ADMIN` check in proxy and `(admin)` layout |
| H-15 | Blank page after sign-in without `next` | Post-sign-in route constant → P08 |
| H-16 | Crafted link can redirect off-site | Same-origin check in `internalPath` + tests |
| H-17 | No security headers | Headers + nonce CSP |
| H-02 | Every failure says "wrong password" | Distinct 401/429/400/5xx messages |
| H-03, H-05 | Autofill and screen readers poorly served | `useId` ids, `autoComplete`, `aria-describedby` |
| H-04 | No forgot/register links | S08 neighbour links |
| H-06 | Focus invisible in forced-colours mode | Remove outline suppression |
| H-07, H-22 | Anonymous component; double-submit possible | `displayName`; `disabled || isLoading` |
| H-19, H-23 | Storage can throw; timing literal | `use-local-storage`; `STALE_TIME` |

## 5. Phase 7 implementation: architecture

Full detail: [Phase 7](phase-7-frontend-architecture.md).

### 5.1 Folder structure (exact paths)

```text
app/                              routes (groups below)
components/ui/                    C01–C33 primitives
components/common/                C34–C55 compositions
components/wrappers/              C56–C60, C68
components/providers/             C61–C63
components/ledgerline/            public home page (owner's; S04 S06 S07 S55–S64, C64–C67)
components/<feature>/             sections, after OD4 (shell, auth, onboarding, dashboard, ledger, transactions,
                                  insights, documents, counterparties, inbox, settings, payments, help, admin, system)
lib/actions/                      one Server Action per backend operation
lib/contract/                     generated — never edit
lib/data/                         nav, admin nav, permission matrix, empty states, help articles, marketing copy
lib/enums/                        lifecycle tuples, range presets
lib/hooks/                        use-<resource>.ts + query-keys.ts
lib/types/                        <domain>.ts re-exported by index.ts
lib/utils/                        money, runway, date-range, ledger-params, unwrap, action-error, read-envelope, mask, …
lib/validations/                  Zod composing contract schemas
lib/<feature>/constants.ts        feature constants
lib/constants.ts                  app-wide constants
```

### 5.2 Route structure (exact routes)

| Route | File | Page |
|---|---|---|
| `/` | `app/(marketing)/page.tsx` (today `app/page.tsx`) | P01 |
| `/help`, `/help/[slug]` | `app/(marketing)/help/…` | P28 |
| `/auth/login` … `/auth/verify` | `app/(auth)/auth/{login,register,forgot-password,reset-password,verify}/page.tsx` | P02–P06 |
| `/onboarding` | `app/(app)/onboarding/page.tsx` | P07 |
| `/dashboard` | `app/(app)/(workspace)/dashboard/page.tsx` | P08 |
| `/accounts`, `/accounts/[accountId]` | `…/(workspace)/accounts/…` | P09, P10 |
| `/transactions`, `/views`, `/flagged`, `/[transactionId]` | `…/(workspace)/transactions/…` + `@drawer/(.)transactions/[transactionId]` | P11, P13, P14, P12 |
| `/insights/compare`, `/insights/runway` | `…/(workspace)/insights/…` | P15, P16 |
| `/statements`, `/exports` | `…/(workspace)/…` | P17, P18 |
| `/counterparties/[counterpartyId]` | `…/(workspace)/counterparties/…` | P19 |
| `/notifications`, `/messages[/threadId]` | `…/(workspace)/…` | P20, P21 |
| `/settings`, `/settings/team[/memberId]`, `/settings/profile` | `…/(workspace)/settings/…` | P22–P25 |
| `/payments`, `/payments/transfer` | `…/(workspace)/payments/…` (404 while off) | P27, P26 |
| `/admin`, `/admin/users[/userId]`, `/admin/compliance[/caseId]`, `/admin/support` | `app/(admin)/admin/…` | P29–P33 |
| unknown / failure | `not-found.tsx`, `error.tsx`, `global-error.tsx` | P34, P35 |

### 5.3 Layouts and guards

- Root: fonts, C61, C62, metadata from constants, skip link.
- `(app)`: session guard. `(app)/(workspace)`: workspace load, C63, S01, S02, `<main>`, `@drawer`, C55; no membership → `/onboarding`.
- `(admin)`: session + `ADMIN` → else `notFound()`.
- `(auth)`: no product navigation; signed-in users redirected (except step-up).
- `(marketing)`: S55 and S07.

### 5.4 Providers and contexts

C61 Provider (QueryClient + reduced motion) → C62 Message provider → children; C63 WorkspaceProvider in the `(workspace)` layout only. No global store (Phase 7 §12).

### 5.5 Hooks organization

One hook per file in `lib/hooks/`, TanStack Query v5, keys only from `queryKeys`, workspace ID in every workspace-scoped key, `queryClient.clear()` on workspace switch and sign-out. Authenticated hooks wrap Server Actions and `unwrap` results. Full inventory: [Phase 7 §8.2](phase-7-frontend-architecture.md#82-hook-inventory).

### 5.6 Component organization

| Layer | May import | May not import |
|---|---|---|
| `ui/` | React, clsx, Carbon icons, approved LD1/LD5 | hooks, actions, other component folders |
| `common/` | ui, wrappers, hooks, utils, types | feature folders |
| `wrappers/` | ui, motion, Query | feature folders |
| `providers/` | ui, wrappers, libraries | feature folders |
| `<feature>/` | all of the above, `@/lib/*` | other feature folders, the API client |

### 5.7 Constants, types, validations

- Constants per [Phase 7 §10](phase-7-frontend-architecture.md#10-constants).
- Types: proposals in `lib/types/<domain>.ts` until the contract publishes; then `z.infer`. Rename any remaining sample type that shares a domain type's name first (H-25).
- Validations compose contract schemas with `.extend`/`.pick`; URL params parsed with `.catch()` defaults.

### 5.8 Security controls

httpOnly cookie; RS256 verification with the public key; prefixes + admin guard; step-up for reveals and security changes; masked numbers with `gcTime: 0` for revealed values; no PII in URLs or logs; `internalPath` for every `next`; headers and nonce CSP; cache cleared on sign-out. Detail: [Phase 7 §22](phase-7-frontend-architecture.md#22-security).

## 6. Phase 8 implementation: sprints

Full plan: [Phase 8](phase-8-implementation-roadmap.md). Sprints are relative; items move from Specified to Scheduled when Sprint 1 starts.

### 6.1 Sprint protocol

For each sprint: confirm dependencies (backend, LD, OD) → for each page, run the Visual Design Hand-off → build contracts, then sections, then pages → run the sprint gate → update Phase 8 → report.

### 6.2 Build-order corrections

Build C18, C20, C29 in Sprint 1; C11, C41, C45, C52 in Sprint 2; base C05, C07, C08, C09 in Sprint 1; S42 read variant in Sprint 6. S02 ships without C38/C39; their slots fill in Sprints 4 and 7.

### 6.3 Sprint 1 — Foundations (weeks 1–2)

- **Build:** FD04 route groups (move P01/P02 only after the owner commits), FD06 prefixes + admin guard, FD11 host fixes, FD12 CI, FD03 only if a colour-scheme preference is offered; P34, P35; S01, S02, S03, S54; contracts in [SETUP §9](SETUP-CHECKLIST.md#9-interaction-contract-bootstrap); `use-me`, `use-workspace`.
- **Request:** LD1–LD5, OD4, OD9, OD10.
- **Exit:** signed-out requests to every protected prefix redirect; `USER` cannot open `/admin`; P34/P35 render within each group layout; host S1 findings closed.

### 6.4 Sprint 2 — Auth and first real-data slice (weeks 3–4)

- **Build:** P03 (S08 register), sign-out in C37, C55 session expiry; P29–P31 with S48–S50 on existing endpoints; C11, C15, C19, C21–C25, C30, C41, C45, C52, C53, C62.
- **Exit:** register → onboarding; sign-out clears cache; admin pages in four states on seed data; typed through the contract.

### 6.5 Sprint 3 — Accounts and ledger (weeks 5–6)

- **Build:** P09, P10; S19–S23; C31, C40, C42–C44, C46–C48, C51; `use-accounts`, `use-account`, `use-transactions`, `use-ledger-summary`, `use-saved-views`.
- **Exit:** URL filters reproduce views; 5M-row budget; C40 property tests; reveal via step-up.

### 6.6 Sprint 4 — Transactions (weeks 7–8)

- **Build:** P11–P14 (P12 page + intercepted route); S24–S27; C28, C38, C49, C60.
- **Exit:** ⌘K everywhere; closing P12 opened from a list returns focus to the originating transaction; optimistic annotations roll back.

### 6.7 Sprint 5 — Dashboard and documents (weeks 9–10)

- **Build:** P08 with D1–D4; P17, P18; S13–S18, S30–S32; C26.
- **Exit:** role composition via C59; polling stops at terminal states.

### 6.8 Sprint 6 — Verification and team (weeks 11–12)

- **Build:** P07, P23, P24, P32, P33; S09–S12, S39–S41, S51–S53; C50.
- **Exit:** case round-trip across P07/P32; one permission matrix for S41 and C59.

### 6.9 Sprint 7 — Comms, settings and security (weeks 13–14)

- **Build:** P04–P06, P19–P22, P25; S08 remaining variants, S33–S38, S42, S43; C39.
- **Exit:** reset recovery; two-step per OD6; session revocation.

### 6.10 Sprint 8 — Insights, public and hardening (weeks 15–16)

- **Build:** P15, P16, P28; S28, S29, S46, S47; S05 and revisions of S55–S64 **per OD9/OD10 only**; X11 intake per OD10.
- **Hardening:** full Phase 9 pass; E2E and axe; budgets.
- **Exit:** every Built item Verified; P01 compliant with the OD9 answer.

### 6.11 Deferred items

F6, F7, P26, P27, S44, S45 stay fully specified and unbuilt until OD3 is answered and the payments module is published (or OD9 is answered B). No payment UI merges before then.

### 6.12 Milestones

| M | End of | Done when |
|---|---|---|
| M1 | Sprint 1 | Layouts, guards, P34/P35, host S1 fixes, requests sent |
| M2 | Sprint 2 | Admin slice on real data; P03; sign-out; expiry |
| M3 | Sprint 4 | F2, F3 end to end; 5M budget |
| M4 | Sprint 6 | F1, F4, F5, X6, D1–D6 |
| M5 | Sprint 8 | All non-Deferred Built and Verified; P01 reconciled |

## 7. Phase 9 implementation: quality gate

Full checklist: [Phase 9](phase-9-qa-checklist.md).

### 7.1 Items by category

| # | Category | Items |
|---|---|---|
| 1 | Accessibility | Q-001–Q-016 |
| 2 | Behavioural consistency | Q-017–Q-026 (Q-017, Q-021 retired) |
| 3 | Responsiveness | Q-027–Q-037 (Q-028, Q-029, Q-036 retired) |
| 4 | Scalability | Q-038–Q-047 |
| 5 | Performance | Q-048–Q-060 |
| 6 | State coverage | Q-061–Q-072 |
| 7 | Error handling | Q-073–Q-085 |
| 8 | Loading behaviour | Q-086–Q-095 |
| 9 | Retired: design system compliance | Q-096–Q-116 (active: Q-110, Q-111, Q-113–Q-115) |
| 10 | Frontend readiness | Q-117–Q-127 |
| 11 | Developer experience | Q-128–Q-136 |
| 12 | SEO readiness | Q-137–Q-146 |
| 13 | Maintainability | Q-147–Q-155 |
| 14 | Cross-browser | Q-156–Q-168 (Q-160, Q-165 retired) |
| 15 | WCAG 2.2 AA | Q-169–Q-206 |
| 16 | Money and data integrity | Q-207–Q-221 |
| 17 | Security and privacy | Q-222–Q-241 |
| 18 | Content truthfulness | Q-242–Q-250 |
| 19 | Public site | Q-251–Q-262 |

### 7.2 Must-pass subset for every PR

Q-018 (money only via C40), Q-061 (four states), Q-063 (section isolation), Q-120 (no API client in components), Q-147 (file size), Q-153 (nothing deleted without instruction), Q-181 (keyboard), Q-192 (focus visible), Q-208 (no float money), Q-226 (no PII in URLs), Q-230 (prefixes protected), Q-242 (no fabricated product data).

### 7.3 Accessibility verification

Keyboard-only run of the flows touched; screen-reader smoke (NVDA + Firefox/Chrome, VoiceOver + Safari/iOS, TalkBack) for pages touched; forced-colours check for focus; reduced-motion check; axe once LD4 is approved; contrast checked against the approved visual concept.

### 7.4 Performance targets

LCP < 2.5 s, INP < 200 ms, CLS < 0.1 at p75 on a mid-range phone; first-load JS `(marketing)`/`(auth)` ≤ 130 KB, `(workspace)`/`(admin)` ≤ 200 KB gzip; 5M-row ledger scroll without dropped frames.

### 7.5 Browser compatibility

Last 2 Chrome, Edge, Firefox; last 2 Safari; iOS Safari 17+; last 2 Android Chrome. Native `<dialog>`, `popover`, date inputs and `Intl` output verified per engine.

### 7.6 Responsive behaviour verification

No horizontal page scroll from 360 to 1920 CSS px; every task on every page completable on a phone (Phase 4 Device needs); reflow at 320 CSS px; text spacing overrides; orientation unlocked.

### 7.7 Interaction contract completeness

For each contract touched: every state in its Phase 6 entry reachable; keyboard map works; ARIA attributes present; validation, loading and error behaviour as specified; content rules met.

### 7.8 Built → Verified

Only through the [Verified gate](phase-9-qa-checklist.md#verified-gate): evidence per item, host findings fixed, no open S1/S2, gate commands pass, owner visual approval, sign-off.

## 8. Code patterns and standards

No styling appears in these patterns; styling follows the approved concept and host conventions.

### 8.1 Primitive structure template

```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Emphasis = "primary" | "secondary" | "tertiary";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    emphasis?: Emphasis;
    isLoading?: boolean;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ emphasis = "primary", isLoading = false, disabled, type = "button", children, ...rest }, ref) => (
        <button
            ref={ref}
            type={type}
            data-emphasis={emphasis}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...rest}
        >
            {children}
        </button>
    ),
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
```

Rules: `forwardRef`, explicit `HTMLAttributes` props, `displayName`, native element, `disabled || isLoading`, no `console`, no comments. Appearance is added at build from the approved concept.

### 8.2 Section structure template

```tsx
"use client";

import AccountRow from "@/components/common/account-row";
import AccountSummarySkeleton from "@/components/dashboard/account-summary-skeleton";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_COPY } from "@/lib/dashboard/constants";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspaceContext } from "@/lib/hooks/use-workspace-context";

export default function AccountSummary() {
    const { workspace } = useWorkspaceContext();
    const accounts = useAccounts(workspace.id);

    return (
        <section aria-labelledby="account-summary-title">
            <h2 id="account-summary-title">{DASHBOARD_COPY.accountSummaryTitle}</h2>
            <QueryBoundary
                query={accounts}
                isEmpty={(data) => data.items.length === 0}
                skeleton={<AccountSummarySkeleton />}
                empty={<EmptyState {...EMPTY_STATES.accounts} />}
            >
                {(data) => (
                    <ul>
                        {data.items.map((account) => (
                            <li key={account.id}>
                                <AccountRow account={account} />
                            </li>
                        ))}
                    </ul>
                )}
            </QueryBoundary>
        </section>
    );
}
```

### 8.3 Page template

See [Phase 4 › Reference page](phase-4-page-blueprints.md#reference-page). A page imports sections, parses `params`/`searchParams` once with Zod `.catch()`, wraps each section in C58 with its placeholder, exports `metadata` from `PAGE_TITLES`, and nothing else.

### 8.4 Hook patterns

- **Query:** `useQuery({ queryKey: queryKeys.x(workspaceId, …), queryFn: async () => unwrap(await action(…)), staleTime: STALE_TIME.tier })`.
- **Infinite:** [Phase 7 §24.4](phase-7-frontend-architecture.md#244-hook-template--libhooksuse-transactionsts).
- **Mutation:** [Phase 7 §24.5](phase-7-frontend-architecture.md#245-server-action--hook-pair): `setQueryData` for the detail, invalidate the list prefix; optimistic only for annotation toggles and mark-read, with rollback.
- **Polling:** `refetchInterval` function returning an interval only while active; `refetchIntervalInBackground: false`.
- **Local persistence:** `use-local-storage` over `useSyncExternalStore`, guarded reads and writes.

### 8.5 API integration

1. Backend publishes the DTO with `@ApiEnvelope(Dto)`.
2. `pnpm contract` regenerates; `pnpm contract:check` passes.
3. Add `lib/actions/<verb>-<resource>.ts`: validate input with the generated schema, `backendFetch(routes.x(…))`, `readEnvelope(upstream, schema)`.
4. Add `lib/hooks/use-<resource>.ts` over the action.
5. Consume the hook in the section. Never cast a response; never hand-type a shape the contract provides.
6. An endpoint the backend does not publish goes in `lib/api-routes.ts` with a same-origin route handler only when §4.1 of Phase 7 allows it.

### 8.6 Error handling

- Section load failure → C33 with Retry (`refetch`) and the error `digest` as reference; never raw backend text.
- Background refetch failure with data → keep data, one C24 message.
- Render exception → C58 fallback; route failure → segment `error.tsx` (S54); root failure → `global-error.tsx`.
- 401 → C55 in place (never a hard redirect mid-task); 403 → permission state; 404 → `notFound()`.
- Mutation failure → field errors via C10 or a C24 message with Retry; drafts kept.
- Money-movement uncertainty (when enabled) → never auto-retry; keep the idempotency key.
- Logging → services only; no `console`.

### 8.7 Loading states

- Route: segment `loading.tsx`.
- Section: its placeholder reserving final space, shown after `LOADING_DELAY_MS`.
- Refetch: keep data, mark busy (`aria-busy`), no placeholder flash.
- Pagination: C25; loading more never moves what the user has already read.
- Actions: C17 on the acting control, which is marked busy.

### 8.8 Empty states

- Copy from `lib/data/empty-states.ts` keyed by section.
- Distinguish none-yet (first action) from none-match ("Clear filters") and no-permission (who grants access).
- Never show a zero balance or sample data as an empty state.

## 9. Testing strategy

### 9.1 Unit coverage targets

`lib/utils/` 100% of branches for `money`, `runway`, `date-range`, `ledger-params`, `internal-path`, `pending-items`, `onboarding-progress`; constants tests where a constant mirrors another source.

### 9.2 Integration priorities

1. Contract: generated schemas match `openapi.json`; seed responses parse.
2. Actions: `readEnvelope` success, refusal and malformed payloads.
3. Hooks: keys include workspace ID; polling stops; optimistic rollback.
4. Route handlers: session POST/DELETE status mapping (H-02).
5. Proxy: prefixes, admin role, signed-in redirects, `next` safety.

### 9.3 End-to-end scenarios (LD4)

X1 sign in (and failure messages) · X2 register → P07 · X3 sign out (Back shows no balances) · X4 expiry keeps a draft note · F1 dashboard per role · F2 filter, share URL, reopen · F3 search → open over the list → annotate → return focus · F4 export queued → ready → download · F5 case round-trip with P32 · X6 invite and role change · X7 notification to subject · X10 offline and 500 recovery · X11 enquiry validation · public page: sign-in route per OD10.

### 9.4 Accessibility testing

axe on every page (LD4); manual keyboard and screen-reader scripts for P02, P08, P10, P12, P18 and P01; forced-colours and reduced-motion runs; target sizes; 200% zoom and 320 px reflow.

## 10. Pre-merge checklist

- [ ] Work item IDs in the PR title and body.
- [ ] For each page: owner-approved visual concept recorded; rendered review done.
- [ ] Owner's home-page files untouched unless explicitly instructed.
- [ ] No feature, export, schema or rule deleted without a maintainer instruction naming it.
- [ ] No new dependency without an approved LD entry.
- [ ] No hard-coded routes, durations, enums or repeated copy.
- [ ] Money only through C40; no float arithmetic.
- [ ] Every new section has loading, empty, error, populated.
- [ ] Keyboard and screen-reader behaviour per Phase 6 for every contract touched.
- [ ] No `console`, no comments, no `any`, no unchecked casts, files ≤ ~150 lines, `@/` imports.
- [ ] Types in `lib/types/`; schemas in `lib/validations/`; components never import the API client.
- [ ] `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm contract:check` (real source) pass.
- [ ] Phase 8 register updated; nothing else records status.

## 11. Deployment readiness

- CI runs type-check, lint, test, contract:check with a real source, and build.
- `JWT_PUBLIC_KEY` and `NEXT_PUBLIC_API_URL` set per environment; the app refuses to start without the key.
- Security headers and CSP live; session policy per OD2.
- `robots.ts` and `sitemap.ts` list public routes only; `(app)`/`(admin)` are `noindex`.
- P34, P35 and segment boundaries in place; health surfaced in outage recovery.
- **Public page:** OD9 and OD10 answered; P01 carries only approved claims or is not deployed as the product site.
- M5 exit met; every non-Deferred register row Verified.

## 12. Conflicts between phases and how to resolve them

| Conflict | Resolution |
|---|---|
| Host `CLAUDE.md` vs any phase | Host wins; note the deviation in the PR. |
| Phase 1 vs a later phase | Phase 1 wins until amended. |
| Phase 4 page vs Phase 5 section on content | Phase 5 owns section content; Phase 4 owns page priority. |
| Phase 5 vs Phase 6 on behaviour | Phase 6 owns control behaviour; Phase 5 owns section-level behaviour. |
| A document vs the code on status | The code wins; update Phase 8. |
| Built home page vs Phase 1 scope | Recorded as OD9/OD10; do not resolve in code. |
| A visual concept vs a requirement | Stop and ask the owner; never drop a requirement silently. |
| A skill's styling guidance vs this design OS | The skill governs how UI is written; this design OS governs what the UI must do. |
| An unbuilt feature that seems unnecessary | Leave it specified; raise it with the maintainer. |

## 13. References

| Need | File |
|---|---|
| Entry point | [START_HERE.md](START_HERE.md) |
| Overview | [README.md](README.md) |
| Master index and what changed | [DESIGN-OS-COMPLETE.md](DESIGN-OS-COMPLETE.md) |
| Deep index and status roll-up | [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) |
| Setup | [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) |
| Vision, rules, decisions | [Phase 1](phase-1-product-vision.md) |
| Journeys | [Phase 2](phase-2-experience-maps.md) |
| Structure, permissions, labels, filters | [Phase 3](phase-3-information-architecture.md) |
| Pages | [Phase 4](phase-4-page-blueprints.md) |
| Sections | [Phase 5](phase-5-section-blueprints.md) |
| Interaction contracts | [Phase 6](phase-6-interaction-contracts.md) |
| Architecture | [Phase 7](phase-7-frontend-architecture.md) |
| Plan and status | [Phase 8](phase-8-implementation-roadmap.md) |
| QA and Verified gate | [Phase 9](phase-9-qa-checklist.md) |
| Seed prompt | [docs/MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md) |
| Host rules | [.claude/CLAUDE.md](../../.claude/CLAUDE.md) |
