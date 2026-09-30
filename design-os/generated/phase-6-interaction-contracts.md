# Ledgerline Design OS — Phase 6: Interaction Contracts

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 "Phase 6: Component Library" of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 5 — Section Blueprints](phase-5-section-blueprints.md) · Next: [Phase 7 — Frontend Architecture](phase-7-frontend-architecture.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to read a contract](#how-to-read-a-contract)
- [Names in this version](#names-in-this-version)
- [Rules every contract inherits](#rules-every-contract-inherits)
- [Primitives](#primitives) — C01–C33
- [Compositions](#compositions) — C34–C55
- [Wrappers](#wrappers) — C56–C60
- [Providers](#providers) — C61–C63
- [Public site contracts (added 2.0.0)](#public-site-contracts-added-200) — C64–C68
- [Dependency map](#dependency-map)
- [Open questions](#open-questions)
- [Assumptions](#assumptions)
- [Changes in this version](#changes-in-this-version)
- [Traceability](#traceability)

## How to read a contract

A contract defines how an interactive element **behaves**: the data it takes, its states, keyboard and screen-reader behaviour, validation, loading and error behaviour, and content rules. It never defines appearance. Which components realise a contract, how they are grouped and how they look is decided when pages are built.

IDs C01–C63 are carried from 1.0.0's component library so every reference in Phases 2–5, 7–9 resolves; C64–C68 are added. Each contract uses the fields the seed requires: **Purpose · Inputs · States · Accessibility · Keyboard · ARIA · Interaction patterns · Validation · Loading · Error · Content rules · Do · Don't · Dependencies**, plus **Used by** (section IDs). Fields that do not apply say "—".

Library IDs (LD1–LD5) refer to [Phase 7 §15](phase-7-frontend-architecture.md#15-shared-libraries); all await approval.

## Names in this version

Contract IDs are unchanged. These names changed because the 1.0.0 name described appearance.

| ID | 1.0.0 name | 2.0.0 name |
|---|---|---|
| C12 | Badge | Status label |
| C13 | StatusDot | Status indicator |
| C14 | Surface | Content group |
| C16 | Skeleton | Loading placeholder |
| C17 | Spinner | Progress indicator |
| C22 | Drawer | Detail overlay |
| C24 | Toast | Transient message |
| C27 | Figure | Number display |
| C28 | Kbd | Shortcut hint |
| C31 | Sparkline | Trend summary |
| C39 | NotificationBell | Notification entry point |
| C45 | StatCard | Metric |
| C46 | FilterBar | Filter set |
| C47 | FilterChip | Active filter |
| C49 | FileDropzone | File upload |
| C54 | ThemeToggle | Colour-scheme preference |
| C56 | MotionWrapper | Entrance reveal |
| C60 | Presence | Exit transition |
| C62 | ToastProvider | Message provider |

Code already in the repo keeps its file and export names (`components/ui/button.tsx`, `components/wrappers/motion-wrapper.tsx`, `components/providers/provider.tsx`, `components/common/login-form.tsx`).

## Rules every contract inherits

1. **Native first.** Native elements (`<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`, `popover`) are used whenever they provide the behaviour; custom roles only when no native element does.
2. **Focus is always visible** (DP8) and never removed on any state, including forced-colours mode.
3. **Colour never carries meaning alone** (DP6): every state and severity is also given in text or an accessible name.
4. **Motion never carries information** (DP7); `prefers-reduced-motion` is honoured.
5. **Targets** meet WCAG 2.2 target-size minimum (24×24 CSS px or sufficient spacing).
6. **Copy used twice comes from constants**; element `id`/`name` never derives from label text.
7. **Permission-filtered inputs.** Actions a role cannot use are removed before reaching a contract (C59), not disabled silently.
8. **Money only through C40**; numbers through C27.

## Primitives

Domain-free (C01–C33). None imports a hook, contract type or domain copy; meaning arrives through inputs.

### C01 — Button

- **Purpose** — The single action primitive: submit, confirm, open, retry.
- **Inputs** — `emphasis: "primary" | "secondary" | "tertiary"` (importance, not appearance); `isLoading`; `type` (default `"button"`); native button attributes.
- **States** — default · hover · focus · active · disabled · loading.
- **Accessibility** — visible text label always (icon-only actions use C02); label kept while loading so the name is stable.
- **Keyboard** — Enter/Space (native).
- **ARIA** — `aria-busy` while loading; `aria-pressed` only when used as a toggle.
- **Interaction patterns** — one primary action per view region; inside C21/C52 the confirm action is last in DOM order; a click fires once; a loading button ignores activation (`disabled || isLoading` — fixes H-22).
- **Validation** — none; the owning form validates.
- **Loading** — progress indicator (C17) with the label kept.
- **Error** — shown by the owning form or section, not the button.
- **Content rules** — verb-first sentence case ("Download statement", "Export CSV").
- **Do** — use `type="submit"` explicitly in forms. **Don't** — nest a button in a link (see Q6-1); change importance to signal danger (use C52).
- **Dependencies** — C17. **Used by** — S03 S04 S08 S10 S21 S26 S30–S32 S37 S38 S40 S42 S43 S45 S52 S54 S62; inside C02 C33 C51 C52 C55.
- **Built** — `components/ui/button.tsx` (host). 1.0.0 required changes still open: add `displayName` (H-07); remove per-component focus ring overrides (H-06); `disabled || isLoading` (H-22).

### C02 — IconButton

- **Purpose** — Icon-only action (remove owner, close panel, open menu, reveal navigation).
- **Inputs** — `label` (required), `icon`, `isLoading`, native button attributes.
- **States** — default · hover · focus · disabled · loading.
- **Accessibility** — name from `label`; icon `aria-hidden`; tooltip (C19) shows the label on hover and focus.
- **Keyboard** — native.
- **ARIA** — `aria-label`; `aria-expanded`/`aria-haspopup`/`aria-controls` passed through when it opens C20 or a panel.
- **Interaction patterns** — destructive icon actions open C52 first.
- **Validation** — —. **Loading** — icon replaced by C17. **Error** — none.
- **Content rules** — `label` is a verb phrase ("Remove owner", "Close details").
- **Do** — pair with C19. **Don't** — use for primary actions; ship without `label`.
- **Dependencies** — C17, C19. **Used by** — S01 S02 S08 S11 S12; inside C20 C22 C24 C37 C39 C51.

### C03 — TextLink

- **Purpose** — Navigation text built on Next `<Link>`; external links identified as external.
- **Inputs** — `href` (from route constants), `external?`, children.
- **States** — default · hover · focus · visited.
- **Accessibility** — link text meaningful out of context; external links say so in the accessible name.
- **Keyboard** — native. **ARIA** — `aria-current="page"` when used in C29 or navigation.
- **Interaction patterns** — routes from `lib/constants.ts`, never literal paths.
- **Validation / Loading / Error** — —.
- **Content rules** — link text names its destination ("View statements for Operating").
- **Do** — prefetch internal routes (framework default). **Don't** — use for actions that change data.
- **Dependencies** — Next Link. **Used by** — S04 S06 S07 S13 S17 S34 S46 S47 S54 S55.

### C04 — Input

- **Purpose** — Single-line text, email, password, number and date entry.
- **Inputs** — native input attributes; `invalid` from C10.
- **States** — default · hover · focus · disabled · read-only · invalid.
- **Accessibility** — always inside C10; correct `type`, `inputMode` and `autoComplete` per field.
- **Keyboard** — native. **ARIA** — `aria-invalid`, `aria-describedby` (hint + error) from C10.
- **Interaction patterns** — password inputs pair with a show/hide C02; paste always allowed.
- **Validation** — owned by the form's Zod schema; the input only reflects `invalid`.
- **Loading** — none. **Error** — via C10.
- **Content rules** — placeholders never replace labels.
- **Do** — use native date inputs for dates (`yyyy-MM-dd`). **Don't** — block paste; use the label as `id`.
- **Dependencies** — C10. **Used by** — S08 S10 S11 S29 S35 S38 S40 S42 S44.

### C05 — Textarea

- **Purpose** — Multi-line notes, messages, decision reasons.
- **Inputs** — native attributes; `maxLength` from the schema; optional counter.
- **States** — default · focus · disabled · invalid · at limit.
- **Accessibility** — inside C10; the counter is announced only when near the limit.
- **Keyboard** — Enter inserts a newline; where a submit shortcut exists (S26, S37) ⌘/Ctrl+Enter submits, declared via `aria-keyshortcuts` on the submit button.
- **ARIA** — as C04.
- **Interaction patterns** — drafts survive session expiry (X4).
- **Validation** — length from Zod. **Loading** — —. **Error** — via C10.
- **Content rules** — the S37 composer states not to include full account numbers or passwords.
- **Do** — keep the draft on failure. **Don't** — submit on plain Enter.
- **Dependencies** — C10. **Used by** — S26 S37 S42 S52.

### C06 — Select

- **Purpose** — Native choice from a short fixed set (category, role, format, period, country).
- **Inputs** — `options` from constants or `lib/data/`; value; native attributes.
- **States** — default · focus · disabled · invalid · loading options (disabled with a placeholder from constants).
- **Accessibility** — inside C10. **Keyboard** — native (arrows, type-ahead). **ARIA** — from C10.
- **Interaction patterns** — more than ~12 options or a need to search → a combobox is a new contract request, not a Select variant.
- **Validation** — Zod enum. **Loading** — disabled until options load. **Error** — via C10.
- **Content rules** — option labels from constants; never inline arrays in a section.
- **Do** — use for fixed enums. **Don't** — use for navigation.
- **Dependencies** — C10. **Used by** — S10 S26 S30 S31 S35 S38 S40 S44 S50.

### C07 — Checkbox

- **Purpose** — Boolean or multi-select choice (include pending, select accounts).
- **Inputs** — `checked`, `indeterminate`, native attributes.
- **States** — unchecked · checked · indeterminate · focus · disabled.
- **Accessibility** — groups in `<fieldset>`/`<legend>` (C10 group mode).
- **Keyboard** — Space toggles. **ARIA** — native `aria-checked="mixed"` for indeterminate.
- **Interaction patterns** — takes effect on form submit, not immediately (immediate settings use C09).
- **Validation** — group rules via Zod. **Loading** — —. **Error** — group-level via C10.
- **Content rules** — label states the positive ("Include pending transactions").
- **Do** — use for "select several". **Don't** — use for immediate on/off.
- **Dependencies** — C10. **Used by** — S31 S40.

### C08 — RadioGroup

- **Purpose** — One-of-few visible choice (export format).
- **Inputs** — `options`, value, `name`.
- **States** — default · focus · checked · disabled option · invalid group.
- **Accessibility** — `<fieldset>`/`<legend>`. **Keyboard** — Tab into group, arrows move and select. **ARIA** — native.
- **Interaction patterns** — controlled or uncontrolled.
- **Validation** — required choice via Zod. **Loading** — —. **Error** — under the group via C10.
- **Content rules** — each option label is self-explanatory.
- **Do** — ≤ 5 options. **Don't** — use when none is a valid answer without a "None" option.
- **Dependencies** — C10. **Used by** — S31.

### C09 — Switch

- **Purpose** — Immediate on/off setting (alert rule enabled, two-step, flag transaction).
- **Inputs** — `checked`, `onChange` (mutation), label.
- **States** — off · on · focus · disabled · pending.
- **Accessibility** — the label names the setting, not the state.
- **Keyboard** — Space toggles. **ARIA** — `role="switch"` with `aria-checked`, or native checkbox semantics; `aria-busy` while pending.
- **Interaction patterns** — applies immediately through a mutation; on failure it reverts and C24 reports. Settings needing confirmation use C07 + Save.
- **Validation** — —. **Loading** — pending state, input disabled. **Error** — revert + message.
- **Content rules** — label is a noun phrase ("Large transaction alerts").
- **Do** — use for settings that apply at once. **Don't** — use inside forms that need Save.
- **Dependencies** — C24. **Used by** — S26 S35 S43.

### C10 — Field

- **Purpose** — Label, hint, error and required marker that wire IDs for any control.
- **Inputs** — `label`, `hint?`, `error?`, `required?`, control child; IDs from `useId`.
- **States** — default · required · error · disabled.
- **Accessibility** — label `htmlFor` = control id (H-05).
- **Keyboard** — —. **ARIA** — `aria-describedby` = hint + error ids; `aria-invalid`; `aria-required`.
- **Interaction patterns** — forms pass the first Zod issue per field; LD3 forms pass resolver errors.
- **Validation** — displays; does not validate. **Loading** — —. **Error** — shows the message from constants.
- **Content rules** — errors say what is wrong and how to fix it (WCAG 3.3.3).
- **Do** — wrap every C04 C05 C06 C11 C48. **Don't** — derive ids from label text.
- **Dependencies** — —. **Used by** — every form section.

### C11 — SearchInput

- **Purpose** — Search with clear action and debounce hand-off.
- **Inputs** — value (from URL where applicable), `onChange`, `placeholder`, `pending`.
- **States** — empty · typing · has value · focus · disabled · pending.
- **Accessibility** — labelled; `type="search"`.
- **Keyboard** — Escape clears, second Escape blurs; `/` focuses the ledger search when no field has focus (`aria-keyshortcuts`).
- **ARIA** — result counts are announced by the owning section, not the input.
- **Interaction patterns** — pairs with `use-debounced-search`; superseded requests aborted.
- **Validation** — trims whitespace; max length from constants. **Loading** — pending indicator. **Error** — owned by the results area.
- **Content rules** — placeholder names what can be searched.
- **Do** — keep the query on "no results". **Don't** — search on every keystroke without debounce.
- **Dependencies** — C04. **Used by** — S21 S36 S46 S49 S53; inside C38.

### C12 — Status label

- **Purpose** — Compact textual status (transaction status, account state, verification state, role).
- **Inputs** — `label` (from constants), `severity: neutral | positive | attention | problem | information`.
- **States** — static.
- **Accessibility** — the label is text; severity never conveyed only by colour.
- **Keyboard** — not focusable. **ARIA** — none.
- **Interaction patterns** — domain value → label and severity through one map per domain (Phase 3 §8.2).
- **Validation / Loading / Error** — —.
- **Content rules** — exact labels from Phase 3 §8.2 ("Posted", "Pending", never "Cleared").
- **Do** — use one map per domain. **Don't** — spell labels inline.
- **Dependencies** — —. **Used by** — S12 S13 S17 S20 S24 S30 S32 S39 S49–S53.

### C13 — Status indicator

- **Purpose** — Minimal marker beside text (unread, lifecycle step, permission yes/no).
- **Inputs** — `severity`, accessible text.
- **States** — static · live (updating).
- **Accessibility** — always accompanied by text or an accessible name.
- **Keyboard** — not focusable. **ARIA** — none (text carries meaning).
- **Interaction patterns** — S25 uses it per lifecycle event.
- **Validation / Loading / Error** — —.
- **Content rules** — the adjacent text states the status.
- **Do** — pair with text. **Don't** — use alone.
- **Dependencies** — —. **Used by** — S19 S25 S34 S36 S41.

### C14 — Content group

- **Purpose** — Group related content into one region (a value proposition, a trust claim, a help category).
- **Inputs** — heading level, children.
- **States** — static. Not interactive; a clickable group puts a link on its heading.
- **Accessibility** — heading gives the region its name where it is a landmark.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — none.
- **Validation / Loading / Error** — —.
- **Content rules** — one topic per group.
- **Do** — use semantic headings. **Don't** — make the whole group a click target.
- **Dependencies** — —. **Used by** — S05 S06 S46. (1.0.0 visual plane spec dropped.)

### C15 — Table family

- **Purpose** — Semantic, non-virtualized table for bounded lists (statements, export jobs, team, saved views, compliance queue, permission reference, sessions, support results, payees).
- **Inputs** — columns (header, cell renderer, sortable?, essential?), rows, sort state from the URL, `caption`.
- **States** — row: default · hover · focus · selected · disabled. Header: sortable · sorted. Table: loading · empty · error · populated.
- **Accessibility** — `<table>`, `<caption>`, `<th scope>`; essential columns remain readable on narrow screens without horizontal page scroll.
- **Keyboard** — Tab through row links and in-row controls in DOM order; sort buttons toggle none → ascending → descending → none with Enter/Space.
- **ARIA** — `aria-sort` on sorted headers.
- **Interaction patterns** — row activation → detail route (or overlay for transactions); sorting writes a URL param; row actions via C20.
- **Validation** — —. **Loading** — C16 rows. **Error** — C33 in a full-width cell. 
- **Content rules** — empty cells read "—" with an accessible "Not available".
- **Do** — use for ≤ a few hundred rows. **Don't** — use for ledgers (C53).
- **Dependencies** — C16 C20 C32 C33. **Used by** — S19 S27 S28 S30–S32 S39 S41 S43 S45 S51 S53.

### C16 — Loading placeholder

- **Purpose** — Hold the place of loading content so it arrives without shifting the page.
- **Inputs** — the populated section's expected extent.
- **States** — loading · still (reduced motion).
- **Accessibility** — hidden from assistive tech; the section announces one "Loading {section}" (`aria-busy`).
- **Keyboard / ARIA** — none.
- **Interaction patterns** — C57 passes each section's placeholder; appears only after a short delay constant so fast responses do not flash (Q-090).
- **Validation / Error** — —. **Loading** — it is the loading state.
- **Content rules** — no fake data in placeholders.
- **Do** — reserve final space (CLS). **Don't** — replace known data with a placeholder.
- **Dependencies** — —. **Used by** — every data section.

### C17 — Progress indicator

- **Purpose** — In-progress signal for an action (button loading, export running, switch pending). Never for content areas (those use C16).
- **Inputs** — accessible label.
- **States** — active · still (reduced motion; label still announced).
- **Accessibility** — `role="status"` text or the owner's `aria-busy`.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — owned by the acting control.
- **Validation / Error** — —. **Loading** — it is the loading signal.
- **Content rules** — label names the action ("Preparing export").
- **Do** — use inside the acting control. **Don't** — block the page.
- **Dependencies** — —. **Used by** — C01 C02 C09 C11 S32.

### C18 — Avatar

- **Purpose** — Person, workspace or counterparty identity mark: image or initials.
- **Inputs** — `name`, `src?`.
- **States** — image · initials fallback.
- **Accessibility** — decorative when the name is adjacent (`alt=""`); otherwise `alt` is the name.
- **Keyboard / ARIA** — not focusable.
- **Interaction patterns** — initials by a pure helper in `lib/utils`.
- **Validation** — —. **Loading** — initials until the image loads. **Error** — image error → initials.
- **Content rules** — never infer identity attributes from names.
- **Do** — fall back gracefully. **Don't** — make it the only identifier.
- **Dependencies** — Next Image. **Used by** — S01 S33 S36 S37 S39 S42 S49.

### C19 — Tooltip

- **Purpose** — Short supplementary label on hover and focus (icon-button names, truncated text, shortcut hints).
- **Inputs** — `content`, trigger child.
- **States** — hidden · showing (after a delay on hover, immediately on focus).
- **Accessibility** — never holds essential information that is not also available otherwise; dismissible, hoverable, persistent (WCAG 1.4.13).
- **Keyboard** — shows on focus; Escape hides.
- **ARIA** — `role="tooltip"`; trigger `aria-describedby`.
- **Interaction patterns** — native `popover` + anchor positioning first (LD5); falls back without rendering off-screen.
- **Validation / Loading / Error** — —.
- **Content rules** — ≤ one short phrase.
- **Do** — use for icon names. **Don't** — put links or actions inside.
- **Dependencies** — LD5. **Used by** — C02 C42 C44 C51.

### C20 — Menu

- **Purpose** — Action menu from a trigger (row actions, "More", saved-view actions, member actions).
- **Inputs** — `items: {id, label, onSelect, disabled?, reason?}[]` (permission-filtered), trigger label.
- **States** — closed · open · item focused · item disabled.
- **Accessibility** — trigger named for its context ("Actions for Ada Lovelace").
- **Keyboard** — Enter/Space/↓ open and focus the first item; ↑ opens at the last; ↑/↓ move; Home/End; type-ahead; Enter/Space select; Escape/Tab close and return focus.
- **ARIA** — `role="menu"`, `role="menuitem"`, `aria-disabled`, trigger `aria-haspopup` + `aria-expanded`.
- **Interaction patterns** — an item's async result shows in C24, not inside the menu; unavailable items explain why.
- **Validation** — —. **Loading** — —. **Error** — via C24.
- **Content rules** — verb-first item labels.
- **Do** — keep ≤ 7 items. **Don't** — nest menus deeper than one level.
- **Dependencies** — LD5. **Used by** — S03 S21 S23 S27 S39 S45 S49; inside C36 C37.

### C21 — Dialog

- **Purpose** — Modal interruption for a short task: invite (S40), create user (S49), confirm (C52), step-up (C55), palette shell (C38), save view (S21), two-step enrolment (S43).
- **Inputs** — `open`, `onOpenChange`, `title`, `dismissible` (default true), body, actions.
- **States** — closed · open · busy · error (inline, not a toast).
- **Accessibility** — native `<dialog>` with `showModal()`; initial focus on the first field or the least destructive action; focus returns to the invoking control on close.
- **Keyboard** — Escape → cancel (prevented when not dismissible); Tab/Shift+Tab cycle inside; Enter submits a form.
- **ARIA** — `aria-labelledby` title; `aria-modal` implicit; `role="alertdialog"` when used by C52 for destructive intent.
- **Interaction patterns** — backdrop dismiss only when dismissible; a form with unsaved input asks "Discard changes?" (C52) before closing; content mounts only when open.
- **Validation** — owned by the body form. **Loading** — primary action loading; Escape allowed unless irreversible. **Error** — inline in the body; dialog stays open.
- **Content rules** — title is the task ("Invite a teammate").
- **Do** — keep it to one task. **Don't** — chain dialogs.
- **Dependencies** — C01 C60. **Used by** — S21 S40 S43 S49; inside C38 C52 C55.

### C22 — Detail overlay

- **Purpose** — Show a record's detail over the list it came from, keeping the list's place: transaction detail from ledgers (P12 intercepted route) and compliance documents (S52).
- **Inputs** — `open`, `onClose` (`router.back()` for the intercepted route), `title`, body.
- **States** — closed · open · loading · error · not found.
- **Accessibility** — modal dialog semantics; focus moves in on open and returns to the originating row on close.
- **Keyboard** — Escape closes; in the ledger, J/K move to the next/previous transaction while open (declared via `aria-keyshortcuts`, announced in a hint), wired by S23 through C53's row index.
- **ARIA** — `aria-labelledby`; `aria-modal`.
- **Interaction patterns** — closing navigates back (URL is the state); the originating row stays marked selected; edits inside report through C24.
- **Validation** — —. **Loading** — body placeholders via C57; header and close usable. **Error** — C33 in the body; not found → C32 with link to the full page.
- **Content rules** — title names the record ("Payment to Acme Ltd").
- **Do** — preserve list position. **Don't** — use for tasks unrelated to the list behind it.
- **Dependencies** — C21 C57 C60. **Used by** — S24 S52; P12.

### C23 — Tabs

- **Purpose** — Switch between views of the same data or sibling sub-pages (chart range, admin period, settings and transaction sub-pages).
- **Inputs** — `tabs: {id, label, href?}[]`, selected.
- **States** — default · focus · selected · disabled.
- **Accessibility** — sub-page tabs that navigate are links with `aria-current="page"`; in-page tabs use the tab pattern.
- **Keyboard** — ←/→ move and select; Home/End; Tab moves into the panel.
- **ARIA** — `role="tablist"` + `aria-label`, `role="tab"` + `aria-selected` + `aria-controls`, `role="tabpanel"` + `aria-labelledby`.
- **Interaction patterns** — shareable selections write a URL param (S18).
- **Validation** — —. **Loading** — panel handles its own via C57. **Error** — panel's.
- **Content rules** — short noun labels.
- **Do** — use for siblings. **Don't** — use for sequential steps (C50).
- **Dependencies** — —. **Used by** — S03 S18 S48.

### C24 — Transient message

- **Purpose** — Non-blocking result of an action (note saved, link copied, export started, update failed).
- **Inputs** — created only through C62's `useToast()`: `message`, `severity`, `action?` (e.g. Retry, Undo), `key?`.
- **States** — entering · visible · paused (hover or focus pauses the timer) · leaving.
- **Accessibility** — announced through C62's polite live region; nothing requiring action exists only in a transient message.
- **Keyboard** — reachable in reading order; Escape dismisses the focused message.
- **ARIA** — the region is a labelled landmark; errors may use `role="alert"` only when they block the task.
- **Interaction patterns** — errors persist until dismissed and offer Retry when retryable; success auto-dismisses after a constant duration (WCAG 2.2.1 pause).
- **Validation / Loading** — —. **Error** — it reports errors.
- **Content rules** — past tense for success ("Note saved"), what failed and what to do for errors.
- **Do** — offer Undo for reversible removals. **Don't** — carry the only copy of important information.
- **Dependencies** — C62. **Used by** — mutations everywhere.

### C25 — Pagination

- **Purpose** — Cursor "Load more" with range text ("Showing 1–50 of 1,284"). No page numbers.
- **Inputs** — `hasNextPage`, `isFetchingNextPage`, `fetchNextPage`, loaded count, total (from S22 when known).
- **States** — has more · loading more · end ("All transactions loaded") · error.
- **Accessibility** — the button is the keyboard and screen-reader equivalent of scroll loading.
- **Keyboard** — native button. **ARIA** — range text `aria-live="polite"`.
- **Interaction patterns** — wired to `useInfiniteQuery` by the section.
- **Validation** — —. **Loading** — button loading. **Error** — inline "Couldn't load more. Retry"; loaded items kept.
- **Content rules** — range text uses C27 numbers.
- **Do** — keep focus on the button after loading. **Don't** — use offsets.
- **Dependencies** — C01. **Used by** — S23 S34.

### C26 — Meter

- **Purpose** — A bounded measure: upload progress (S12), ownership declared (S11), runway vs target (S29).
- **Inputs** — `value`, `min`, `max`, `label`, `valueText`.
- **States** — value · indeterminate · complete.
- **Accessibility** — `role="meter"` (measure) or `role="progressbar"` (progress) with `aria-valuenow`, `aria-valuetext`.
- **Keyboard** — not focusable.
- **ARIA** — as above.
- **Interaction patterns** — value computed outside (pure util).
- **Validation** — clamps into `[min, max]`. **Loading / Error** — —.
- **Content rules** — `valueText` in words ("75% of ownership declared").
- **Do** — always give `valueText`. **Don't** — use for money.
- **Dependencies** — —. **Used by** — S11 S12 S29.

### C27 — Number display

- **Purpose** — Any number, count, reference or ID that is not money.
- **Inputs** — pre-formatted value (Intl / date-fns), optional `value` for machine reading.
- **States** — static.
- **Accessibility** — references read character by character where useful (`aria-label` spacing for IDs); dates carry an absolute form.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — formatting happens before; C27 only renders (BR4).
- **Validation / Loading / Error** — —.
- **Content rules** — one format per kind (dates "Sep 26, 2026").
- **Do** — use `<data>`/`<time>` elements. **Don't** — format inline in sections.
- **Dependencies** — —. **Used by** — S24 S25 S48 S54; inside C40.

### C28 — Shortcut hint

- **Purpose** — State a keyboard shortcut ("⌘K", "/", "J").
- **Inputs** — keys (from shortcut constants), platform.
- **States** — static.
- **Accessibility** — read as words ("Command K").
- **Keyboard / ARIA** — —.
- **Interaction patterns** — shortcuts declared once in constants (Q-025).
- **Validation / Loading / Error** — —.
- **Content rules** — platform-appropriate modifier.
- **Do** — show where the shortcut applies. **Don't** — invent shortcuts per page.
- **Dependencies** — —. **Used by** — S02; inside C11 C19 C20 C38.

### C29 — Breadcrumbs

- **Purpose** — Ownership trail on detail pages (Phase 3 §13).
- **Inputs** — `crumbs: {label, href?}[]`.
- **States** — default · focus · collapsed middle (behind a C20 "…").
- **Accessibility** — `<nav aria-label="Breadcrumb">`, ordered list.
- **Keyboard** — links in order. **ARIA** — `aria-current="page"` on the last crumb; separators hidden.
- **Interaction patterns** — dynamic labels from loaded data (account name + masked number via C42 text form).
- **Validation** — —. **Loading** — placeholder for a dynamic label. **Error** — falls back to the static parent label.
- **Content rules** — never history-based.
- **Do** — on small screens at least the parent link remains. **Don't** — include the drawer/overlay.
- **Dependencies** — C03 C20. **Used by** — S02 S03 S47.

### C30 — Chart

- **Purpose** — The only wrapper around the chart library (LD1): cash flow, period comparison, runway projection, admin series, public forecast (S60).
- **Inputs** — series (numbers for plotting, original strings for labels), `summary` (required text), `currency?`.
- **States** — loading · empty · populated · error.
- **Accessibility** — required text summary plus an accessible data table with the same figures (Q-012).
- **Keyboard** — the plot is one focusable region; ←/→ step through points and announce each via a polite region.
- **ARIA** — region labelled by the chart title.
- **Interaction patterns** — money converts to numbers only for scale; displayed values via C40's formatter.
- **Validation** — rejects values beyond `Number.MAX_SAFE_INTEGER`. **Loading** — C16. **Error** — C33 compact.
- **Content rules** — axis and point labels from original strings.
- **Do** — lazy-load. **Don't** — plot raw transactions.
- **Dependencies** — LD1, C16 C32 C33 C40. **Used by** — S18 S28 S29 S48 S60.

### C31 — Trend summary

- **Purpose** — Minimal trend next to a figure (S14).
- **Inputs** — points, accessible summary.
- **States** — populated · flat · empty (renders nothing).
- **Accessibility** — decorative graphic; the summary text ("up 3.8% over 30 days") carries meaning.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — always adjacent to the value it summarises.
- **Validation** — fewer than 2 points → nothing. **Loading / Error** — owned by the section.
- **Content rules** — summary uses C41 wording.
- **Do** — hand-rolled, no library. **Don't** — make it interactive.
- **Dependencies** — —. **Used by** — S14.

### C32 — EmptyState

- **Purpose** — Explain an empty result and offer the next step.
- **Inputs** — `title`, `body?`, `action?` from `EMPTY_STATES`.
- **States** — filtered-empty (offers "Clear filters") · truly empty (offers the first action) · permission (names who can grant access).
- **Accessibility** — heading level appropriate to the section; action reachable.
- **Keyboard** — action is a link or button. **ARIA** — —.
- **Interaction patterns** — never shows sample data styled as real (Q-246).
- **Validation / Loading / Error** — —.
- **Content rules** — one sentence, at most one action.
- **Do** — distinguish none-yet from none-match. **Don't** — show a zero balance as empty.
- **Dependencies** — C01 C03. **Used by** — every data section; S54.

### C33 — ErrorState

- **Purpose** — Explain a failed load and offer retry (section error, 500 body, offline).
- **Inputs** — `message` (from constants), `onRetry`, `reference?` (digest).
- **States** — idle · retrying · offline (retry waits for `online`).
- **Accessibility** — does not steal focus; message readable.
- **Keyboard** — Retry is a button. **ARIA** — `role="alert"` only when the error blocks the task.
- **Interaction patterns** — receives `refetch` from C57.
- **Validation** — —. **Loading** — retrying. **Error** — it is the error state.
- **Content rules** — says viewing failed, never implies funds changed.
- **Do** — include a reference code. **Don't** — show raw backend text.
- **Dependencies** — C01. **Used by** — every data section; S54.

## Compositions

### C34 — LoginForm → generalized AuthForm variants

- **Purpose** — The body of S08 in five variants: sign-in, register, forgot, reset, verify.
- **Inputs** — `variant`; `next?`; `token?`; `challenge?`.
- **States** — idle · submitting (fields read-only) · field error · request error (`INVALID_CREDENTIALS` / `REQUEST_FAILED` / too many attempts / unavailable) · success.
- **Accessibility** — see S08; paste and password managers allowed; no cognitive tests.
- **Keyboard** — Enter submits. **ARIA** — `aria-busy` on the form while pending; `role="alert"` form error.
- **Interaction patterns** — hooks `use-login`, `use-register`, `use-request-password-reset`, `use-reset-password`, `use-verify-challenge`; forgot shows the same confirmation for every email.
- **Validation** — Zod `safeParse` over `lib/validations/auth.ts` composing contract schemas.
- **Loading** — submit progress. **Error** — mapped to constants; never echoes backend text.
- **Content rules** — no enumeration of accounts in any message.
- **Do** — link neighbouring steps (H-04). **Don't** — use label text as `id`/`name` (H-03).
- **Dependencies** — C01 C04 C10. **Used by** — S08; verify variant inside C55.
- **Built** — `components/common/login-form.tsx` (sign-in only). Open host findings H-01–H-05.

### C35 — NavItem

- **Purpose** — One navigation destination.
- **Inputs** — `NavItem` from `lib/data/navigation.ts`; optional count.
- **States** — default · hover · focus · current.
- **Accessibility** — keeps its accessible name when its label is hidden.
- **Keyboard** — native link. **ARIA** — `aria-current="page"` from `usePathname()`.
- **Interaction patterns** — items permission-filtered (C59/C63); routes from constants.
- **Validation** — —. **Loading** — count hidden while loading; never a stale "0". **Error** — count hidden.
- **Content rules** — labels exactly as Phase 3 §8.1.
- **Do** — use the nav config. **Don't** — hard-code items in S01.
- **Dependencies** — C03. **Used by** — S01.

### C36 — WorkspaceSwitcher

- **Purpose** — Show the current workspace and switch between memberships (A4).
- **Inputs** — workspaces, current id, `switchWorkspace` (C63).
- **States** — closed · open · switching · single workspace (static label).
- **Accessibility** — trigger names the current workspace; the switch is announced.
- **Keyboard** — as C20. **ARIA** — `role="menuitemradio"` with `aria-checked`.
- **Interaction patterns** — selecting changes C63, which changes every workspace-scoped key prefix; `queryClient.clear()` then `router.refresh()`; route kept when allowed, else P08.
- **Validation** — —. **Loading** — trigger placeholder. **Error** — switch failure → C24; stays on current workspace.
- **Content rules** — workspace names exactly as stored.
- **Do** — make the current workspace unmistakable in text. **Don't** — show cached data from the previous workspace.
- **Dependencies** — C20 C18 C63. **Used by** — S01.

### C37 — UserMenu

- **Purpose** — Account menu: Profile & security (P25), colour-scheme preference (C54), Help (P28), Sign out (X3).
- **Inputs** — `use-me` data.
- **States** — closed · open · signing out.
- **Accessibility** — trigger named "Account menu for {name}".
- **Keyboard** — as C20. **ARIA** — as C20.
- **Interaction patterns** — sign out: `use-logout` (DELETE `app/api/session`), cache cleared, route to P02; cookie cleared server-side regardless.
- **Validation** — —. **Loading** — sign-out item shows progress. **Error** — C24; session still ended locally.
- **Content rules** — "Sign out", not "Log off".
- **Do** — clear the query cache on sign-out. **Don't** — leave balances viewable via Back.
- **Dependencies** — C20 C18 C54. **Used by** — S02.

### C38 — CommandPalette

- **Purpose** — Jump to any page, account or transaction, and run common actions, from anywhere in `(app)` and `(admin)` (⌘K / Ctrl+K).
- **Inputs** — `open`, `onOpenChange`, `scope: app | admin`, `commands: PaletteCommand[]` (permission-filtered).
- **States** — closed · open empty (Recent + Navigate) · typing · searching · results · no results ("No matches for …" + "Search all transactions") · search error (inline retry; local groups still work).
- **Accessibility** — modal dialog containing a combobox and listbox; results grouped with group names.
- **Keyboard** — ⌘K/Ctrl+K toggles (ignored while another dialog is open or focus is in contenteditable); ↑/↓, Home/End, Enter runs, ⌘/Ctrl+Enter opens a transaction in a new tab, Escape clears then closes; focus trapped to input and results.
- **ARIA** — `role="combobox"` with `aria-activedescendant`, `aria-controls`, `aria-expanded`; `role="listbox"`/`option`.
- **Interaction patterns** — groups: Recent (ids and labels only, never amounts or numbers; `useSyncExternalStore` + `localStorage`), Navigate, Accounts (cached), Transactions (server search, debounced, ≥ 2 characters, amount-aware: "4200" matches 420000 minor units, both signs), Counterparties, Help, Actions. Choosing a transaction opens P12.
- **Validation** — amount parsing by string, never float. **Loading** — Transactions group placeholders. **Error** — inline in that group.
- **Content rules** — group order per Phase 3 §10.
- **Do** — lazy-load on first open. **Don't** — store sensitive values in Recent.
- **Dependencies** — C21 C11 C28 C40. **Used by** — S02.

### C39 — Notification entry point

- **Purpose** — Entry to notifications (X7) with unread count and a short preview.
- **Inputs** — count, preview items.
- **States** — no unread · unread · open · loading preview · error preview (link to P20 still works).
- **Accessibility** — name includes the count ("Notifications, 3 unread"); count changes announced at most once a minute.
- **Keyboard** — disclosure; Escape closes. **ARIA** — `aria-expanded`, `aria-controls`.
- **Interaction patterns** — opening does not mark read; only "Mark all read" or P20. Count polls on an interval constant, not in background tabs.
- **Validation** — "99+" above a constant cap. **Loading** — no number. **Error** — no number, no error.
- **Content rules** — preview items link to their subject.
- **Do** — keep the count honest. **Don't** — show "0" while loading.
- **Dependencies** — C02. **Used by** — S02.

### C40 — Amount

- **Purpose** — Render every money value from integer minor units in a string plus ISO 4217, via `Intl.NumberFormat` (BR1, BR2).
- **Inputs** — `amountMinor: string`, `currency`, `display: balance | signed | absolute`, `status?`, `currencyDisplay: symbol | code`, `label?`.
- **States** — normal · pending (labelled pending) · negative balance (minus shown; the owner adds "Overdrawn") · returned/failed (problem severity, in text via the status label) · reversed (labelled reversed) · unavailable (em dash with accessible "Not available").
- **Accessibility** — read as "minus 1,250 pounds" for debits (sign is text, not only a glyph); `label` prefixes context ("Available balance").
- **Keyboard** — not focusable. **ARIA** — renders `<data value={amountMinor}>`.
- **Interaction patterns** — `signed` always shows + for credits and − for debits; `code` display when a view mixes currencies; copy (C51) copies a canonical plain value with currency code.
- **Validation** — `BigInt` parse; exponent from `Intl` resolved options; invalid input → unavailable state, never NaN.
- **Loading** — owned by the caller. **Error** — unavailable state.
- **Content rules** — never rounds silently; never sums currencies.
- **Do** — memoise one formatter per currency and locale. **Don't** — accept `number`; flag ordinary debits as problems (BR3).
- **Dependencies** — C27, `lib/utils/money.ts`. **Used by** — S14–S16 S18–S20 S22–S24 S28–S30 S33 S44; inside C38 C43 C44.

### C41 — DeltaChip

- **Purpose** — Change versus a comparison ("+4.2% vs last month", "−£1,200").
- **Inputs** — `deltaBasisPoints` or money delta, comparison label.
- **States** — up · down · flat ("No change") · unavailable.
- **Accessibility** — direction in words ("up 4.2% versus last month").
- **Keyboard / ARIA** — —.
- **Interaction patterns** — percent via `Intl` `style: "percent"` from basis points; money via the formatter.
- **Validation** — zero or negative base → "New" / "—", never "∞%". **Loading / Error** — owned by caller.
- **Content rules** — always name the comparison period.
- **Do** — one tested util for rounding. **Don't** — imply good/bad by direction alone.
- **Dependencies** — C12. **Used by** — S14 S28 S48; inside C45.

### C42 — MaskedAccountNumber

- **Purpose** — Show account/routing numbers masked to the last four; reveal only after step-up (X4); reveals audit-logged (BR5).
- **Inputs** — `accountId`, `last4`, `kind: account | routing`, `mode: inline | field`, `canReveal` (from C63; viewers false).
- **States** — masked · requesting · step-up required (C55) · revealed (copy enabled, auto re-mask countdown) · re-masked (timeout, window blur, route change) · forbidden (no reveal) · error (stays masked, C24).
- **Accessibility** — read as "ending 4821"; reveal and re-mask announced.
- **Keyboard** — reveal/hide and copy are buttons in order; Escape inside re-masks.
- **ARIA** — reveal button `aria-pressed`.
- **Interaction patterns** — one revealed number per page; the full value is fetched on demand and never cached (`gcTime: 0`).
- **Validation** — —. **Loading** — reveal button loading. **Error** — stays masked with a message.
- **Content rules** — "Operating ••4821" in text form for breadcrumbs.
- **Do** — re-mask on timeout (`REVEAL_TIMEOUT`). **Don't** — put numbers in URLs or logs.
- **Dependencies** — C02 C27 C51 C55. **Used by** — S19 S20 S24; inside C29 C43.

### C43 — AccountRow

- **Purpose** — One account in S15 and S19.
- **Inputs** — `Account`.
- **States** — default · hover · focus · frozen/closed (state label) · loading.
- **Accessibility** — one link per row; name includes account name and available balance.
- **Keyboard** — link; C15 rules. **ARIA** — —.
- **Interaction patterns** — activation → P10; hover/focus prefetches the account and first ledger page after a hover-intent delay.
- **Validation** — —. **Loading** — C16. **Error** — missing balance → C40 unavailable.
- **Content rules** — carries at least state, masked number and available balance.
- **Do** — keep closed accounts listed. **Don't** — hide frozen accounts.
- **Dependencies** — C40 C42 C13. **Used by** — S15 S19.

### C44 — TransactionRow

- **Purpose** — One transaction line: ledger, recent activity, search, flagged, counterparty.
- **Inputs** — `Transaction`, `showAccount?`, `runningBalance?`, `href`.
- **States** — default · hover · focus · selected (overlay open) · pending · returned/failed · reversed · flagged · loading.
- **Accessibility** — status, flag and attachment presence in text; amount read with sign.
- **Keyboard** — in C15: Tab to the row link, Enter opens; in C53: roving focus (↑/↓, Enter, J/K with overlay open).
- **ARIA** — row semantics from the parent table.
- **Interaction patterns** — activation → `href` (overlay); ⌘/middle-click opens the full page (real link); truncated description available via C19 and in the accessible name.
- **Validation** — —. **Loading** — C16 cells. **Error** — —.
- **Content rules** — counterparty or type label ("Fee") — never an invented name.
- **Do** — prefetch detail on hover intent. **Don't** — animate rows.
- **Dependencies** — C40 C12 C19. **Used by** — S16 S23.

### C45 — Metric

- **Purpose** — One figure with its label: total cash, money in/out, ledger totals, counterparty totals, admin totals.
- **Inputs** — `label`, value (C40 or C27), `delta?` (C41), `href?`.
- **States** — default · loading · unavailable.
- **Accessibility** — label and value read together; if linked, the label is the link.
- **Keyboard** — not focusable unless linked. **ARIA** — —.
- **Interaction patterns** — one primary value per metric (DP2).
- **Validation** — —. **Loading** — value placeholder, label kept. **Error** — owned by the section; never shows retry itself.
- **Content rules** — label states what and as-of where relevant.
- **Do** — keep label wording from constants. **Don't** — show a zero for unavailable.
- **Dependencies** — C40 C27 C41. **Used by** — S14 S22 S33 S48.

### C46 — Filter set

- **Purpose** — The ledger's filters (S21): search, date range, active filters, saved-view menu, export action.
- **Inputs** — filters from the URL, available filter definitions (typed in `lib/<feature>/constants.ts`).
- **States** — no filters · filters active (clear all offered) · collapsed on small screens · invalid params dropped.
- **Accessibility** — every control labelled; one announcement of the result count per change (owned by S23).
- **Keyboard** — Tab through controls (no toolbar roving: it contains text inputs).
- **ARIA** — group labelled "Ledger filters".
- **Interaction patterns** — all state in URL params (via a hook), written with `router.replace`.
- **Validation** — same Zod schema that parses the URL. **Loading** — —. **Error** — invalid params dropped with a notice.
- **Content rules** — filter order per Phase 3 §11.1.
- **Do** — keep filters shareable. **Don't** — hold filter state locally.
- **Dependencies** — C47 C11 C48 C20. **Used by** — S21.

### C47 — Active filter

- **Purpose** — One filter: toggle (Flagged, Has attachment) or valued (Status: Pending, Amount ≥ £1,000) with remove.
- **Inputs** — definition, value, `onRemove`.
- **States** — idle · active · focus · disabled.
- **Accessibility** — name includes the filter and value ("Remove filter: Status Pending").
- **Keyboard** — Enter/Space toggle or edit; Backspace/Delete removes a focused valued filter.
- **ARIA** — toggles use `aria-pressed`.
- **Interaction patterns** — values formatted for display (C40 for amounts); stored as minor units in the URL.
- **Validation** — the URL schema. **Loading / Error** — —.
- **Content rules** — labels from constants.
- **Do** — make removal one action. **Don't** — rely on an "×" glyph without a name.
- **Dependencies** — C02. **Used by** — S21 S51.

### C48 — DateRangeField

- **Purpose** — Choose a period with presets (This month, Last month, Last 90 days, Year to date, Custom) and native date inputs.
- **Inputs** — `from`, `to`, `min` (account open date), `max` (today), presets (enum).
- **States** — preset selected · custom · invalid (from after to) · disabled.
- **Accessibility** — two labelled native date inputs; preset choice labelled.
- **Keyboard** — native. **ARIA** — `aria-invalid` on the offending input with the error in C10.
- **Interaction patterns** — presets computed with `date-fns` in `lib/utils/date-range.ts`; value written to the URL by the owner; posting dates never shifted by time zone.
- **Validation** — `from ≤ to`, within bounds (Zod refine). **Loading** — —. **Error** — via C10.
- **Content rules** — dates as `yyyy-MM-dd` on the wire.
- **Do** — offer "Custom". **Don't** — build a custom calendar when native inputs suffice.
- **Dependencies** — C04 C10. **Used by** — S21 S28 S31.

### C49 — File upload

- **Purpose** — Upload verification documents (S12), attachments (S26), message attachments (S37).
- **Inputs** — accepted MIME types and max size (constants), `onFiles`, multiple?.
- **States** — idle · dragging (pointer only) · uploading (per-file C26) · done · rejected (per file, with reason) · disabled.
- **Accessibility** — a labelled `<input type="file">` is always the primary path; drag-and-drop is an addition; results announced.
- **Keyboard** — Enter/Space open the picker; file list is a list with remove buttons.
- **ARIA** — progress `role="progressbar"`.
- **Interaction patterns** — the upload control only emits files; hooks `use-upload-document` / `use-upload-attachment` upload; camera capture on phones where appropriate.
- **Validation** — type and size checked before upload, naming the limit. **Loading** — per-file progress. **Error** — per-file reason with Retry; other files unaffected.
- **Content rules** — state accepted formats and size before selection.
- **Do** — lazy-load. **Don't** — require dragging (WCAG 2.5.7).
- **Dependencies** — C26 C02. **Used by** — S12 S26 S37.

### C50 — Stepper

- **Purpose** — Progress through verification steps (Business → Owners → Documents → Review).
- **Inputs** — steps with states derived from the case.
- **States** — complete · current · upcoming · attention (`needs_info`).
- **Accessibility** — ordered list; each state in the step's name.
- **Keyboard** — completed and current steps are buttons; upcoming are not focusable.
- **ARIA** — `aria-current="step"`.
- **Interaction patterns** — state from `use-verification-case`, not local progress; read-only in S52.
- **Validation** — —. **Loading** — placeholders. **Error** — owned by S09.
- **Content rules** — "Step 2 of 4 · Beneficial owners".
- **Do** — reflect server state. **Don't** — allow skipping invalid steps.
- **Dependencies** — C13. **Used by** — S09 S52.

### C51 — CopyButton

- **Purpose** — Copy a reference, share link, amount or revealed number.
- **Inputs** — `value` (plain canonical), `label`.
- **States** — idle · copied · failed.
- **Accessibility** — result announced ("Link copied").
- **Keyboard** — button. **ARIA** — polite live sibling.
- **Interaction patterns** — `navigator.clipboard.writeText` in a secure context; share links from route constants and the origin.
- **Validation** — —. **Loading** — —. **Error** — permission denied → "Copy failed — select and copy manually" with the value selectable.
- **Content rules** — label names what is copied.
- **Do** — copy canonical values (Q-219). **Don't** — copy a masked value while claiming the full number.
- **Dependencies** — C02 C19 C24. **Used by** — S20 S24; inside C42.

### C52 — ConfirmDialog

- **Purpose** — Confirm a destructive, irreversible or sensitive action (remove owner, delete view, revoke session, delete user, decide a case, confirm a transfer).
- **Inputs** — `title`, `consequence` (what will happen, in words), `confirmLabel`, `typedConfirmation?`, `onConfirm`.
- **States** — open · pending · error (inline, stays open) · confirmed (closes, C24 success).
- **Accessibility** — initial focus on the least destructive action.
- **Keyboard** — Escape cancels. **ARIA** — `role="alertdialog"` for destructive intent.
- **Interaction patterns** — only opened by explicit user action; never chained; reasons required where the domain requires (S52).
- **Validation** — typed word compared exactly. **Loading** — confirm loading. **Error** — inline.
- **Content rules** — names the object and the effect ("Ada will lose access to 3 accounts").
- **Do** — offer the reversible option first where one exists (suspend before delete). **Don't** — use for routine saves.
- **Dependencies** — C21 C01. **Used by** — S09 S10 S11 S26 S27 S39 S43–S45 S50 S52.

### C53 — DataTable

- **Purpose** — Virtualized, cursor-paginated table for large sets: ledgers (up to 5 million rows) and the platform user directory.
- **Inputs** — columns, infinite query result, row renderer (C44), `onRowOpen`, `activeRowId`, sort from URL.
- **States** — initial loading · populated · fetching next page · end · empty · filtered-empty · refetching (rows kept, `aria-busy`) · error first page · error next page.
- **Accessibility** — table semantics with `aria-rowcount` (server total or -1) and `aria-rowindex`; caption summarises filters.
- **Keyboard** — one Tab stop (roving focus on the active row); ↑/↓, PageUp/PageDown, Home/End (End fetches more), Enter opens, J/K with overlay open; sort headers reachable before the body.
- **ARIA** — `aria-sort`; `aria-busy` while refetching.
- **Interaction patterns** — only visible rows plus overscan exist; `maxPages` bounds memory; returning from detail restores offset and active row (snapshot in `sessionStorage` keyed by the view's query key); sentinel loading plus C25.
- **Validation** — —. **Loading** — C16 rows. **Error** — C33 / inline retry row.
- **Content rules** — essential columns named by the section.
- **Do** — fixed row size for constant estimates. **Don't** — count loaded rows for totals.
- **Dependencies** — LD2, C15 C16 C25 C44. **Used by** — S23 S49.

### C54 — Colour-scheme preference

- **Purpose** — Let a member choose among the colour schemes the build offers, if it offers more than one. Which schemes exist and what they look like is decided at build (OD7 withdrawn).
- **Inputs** — available schemes, current choice.
- **States** — current · saving · not saved (error).
- **Accessibility** — choice named in text; current state announced.
- **Keyboard** — button cycles or menu with `menuitemradio`. **ARIA** — `aria-checked` in menu form.
- **Interaction patterns** — applies immediately without reload; persisted server-readable (cookie via Server Action) so the next request renders the chosen scheme without a flash.
- **Validation** — unknown or tampered value → the build's default. **Loading** — —. **Error** — applies for the session; C24 says it was not saved.
- **Content rules** — scheme names are descriptive ("Light", "Dark", "Match system" if offered).
- **Do** — avoid a flash on load. **Don't** — require reload.
- **Dependencies** — FD03. **Used by** — S01; inside C37.

### C55 — SessionExpiryDialog

- **Purpose** — X4: warn before idle timeout with "Stay signed in"; after expiry, re-authenticate without leaving the page; host step-up for sensitive actions (C42, password, two-step, revoke-all).
- **Inputs** — expiry from the server, mode (warning, expired, step-up).
- **States** — warning (countdown) · extending · expired · re-authenticating · step-up error.
- **Accessibility** — countdown announced sparingly (not every second).
- **Keyboard** — initial focus on the primary action. **ARIA** — `role="alertdialog"` in warning/expired.
- **Interaction patterns** — mounted once per shell; a 401 opens it instead of redirecting; expiry broadcast across tabs; re-auth never navigates away, so drafts survive; after repeated step-up failure points to X5.
- **Validation** — re-auth password via `loginSchema.pick`. **Loading** — submit loading. **Error** — inline; remaining attempts.
- **Content rules** — says work is kept.
- **Do** — give warning time (WCAG 2.2.1). **Don't** — hard-redirect on 401.
- **Dependencies** — C21, C34 verify variant, OD2. **Used by** — `(app)` and `(admin)` layouts; C42.

## Wrappers

### C56 — Entrance reveal

- **Purpose** — Behavioural obligations of any entrance effect on public pages (1.0.0: a once-only reveal for marketing surfaces). Whether any entrance effect is used is decided at build.
- **Inputs** — children.
- **States** — before · revealed (once) · reduced motion (content shown without transform).
- **Accessibility** — content is in the document and readable before and without the effect; nothing waits on JavaScript to become readable.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — never in `(app)`/`(admin)` data views (rows re-render on filter); reduced motion honoured via `MotionConfig reducedMotion="user"` (C61).
- **Validation / Loading / Error** — —.
- **Content rules** — never hides what the member came to the page for behind a reveal.
- **Do** — play once. **Don't** — stagger list items that re-render.
- **Dependencies** — motion. **Used by** — P01. **Built** — `components/wrappers/motion-wrapper.tsx` (host).

### C57 — QueryBoundary

- **Purpose** — The single switch every data section uses to render exactly one of loading, error, empty, populated from a TanStack Query result.
- **Inputs** — `query`, `isEmpty(data)`, `skeleton`, `empty`, `children(data)`.
- **States** — loading · error · empty · populated · populated + refetching · populated + background error (children + one C24).
- **Accessibility** — never moves focus on a state switch; sets `aria-busy` while loading.
- **Keyboard** — only C33's Retry. **ARIA** — `aria-busy`.
- **Interaction patterns** — Retry refetches that query only; a new key shows the placeholder only when no previous data exists (sections use `keepPreviousData`).
- **Validation** — —. **Loading** — C16 after a short delay constant. **Error** — C33.
- **Content rules** — empty and error copy from constants.
- **Do** — one per section. **Don't** — write per-section `if (isPending)` ladders.
- **Dependencies** — C16 C32 C33. **Used by** — every data section.

### C58 — SectionErrorBoundary

- **Purpose** — Catch render errors in one section so the page survives (P35 covers route-level failures).
- **Inputs** — `skeleton` (renders `<Suspense>` inside), `resetKeys`.
- **States** — normal · errored · reset.
- **Accessibility** — fallback is C33 with Retry.
- **Keyboard** — Retry. **ARIA** — —.
- **Interaction patterns** — the one class component (React requirement); reports through the services logging path, never `console`; resets on route or query-key change.
- **Validation / Loading** — —. **Error** — it is the render-error state.
- **Content rules** — generic message plus reference.
- **Do** — wrap each section at the page. **Don't** — wrap the whole page in one boundary.
- **Dependencies** — C33. **Used by** — every page.

### C59 — PermissionGate

- **Purpose** — Show, hide or explain UI by the member's permissions. A presentation gate, not a security boundary.
- **Inputs** — `permission` id, `mode: hide | explain`, children, `fallback?`.
- **States** — pending (role loading) · allowed · denied-hidden · denied-explained.
- **Accessibility** — explained denials are text in reading order, naming who can grant access.
- **Keyboard** — —. **ARIA** — —.
- **Interaction patterns** — reads `can()` from C63 over the permission matrix; a role change mid-session updates gated UI without reload; the backend enforces every permission.
- **Validation** — unknown permission ids fail type-checking. **Loading** — renders nothing (or a placeholder) while pending. **Error** — role unavailable → denied.
- **Content rules** — permission copy from `lib/data/empty-states.ts`.
- **Do** — hide actions a role cannot use. **Don't** — treat it as enforcement.
- **Dependencies** — C63. **Used by** — S26 S31 S35 S38 S40; P08 variants; many actions.

### C60 — Exit transition

- **Purpose** — Keep content present long enough for dialogs, overlays, messages and removed rows to leave cleanly (1.0.0 "Presence"). Whether any exit effect is used is decided at build.
- **Inputs** — `present`, children.
- **States** — absent · entering · present · leaving (content held) · reduced motion.
- **Accessibility** — focus management belongs to consumers; removed content leaves the accessibility tree immediately.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — reopening during leave shows the new content immediately.
- **Validation / Loading / Error** — —.
- **Content rules** — —.
- **Do** — hold content during the leave. **Don't** — delay focus return.
- **Dependencies** — motion. **Used by** — C21 C22 C24 S27.

## Providers

### C61 — Provider

- **Purpose** — Root client provider: TanStack `QueryClient` and `MotionConfig reducedMotion="user"`.
- **Inputs** — children.
- **States** — —.
- **Accessibility** — enforces reduced motion globally.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — one `QueryClient` per browser session; stale time from `STALE_TIME` (H-23); `QueryCache.onError` sends background errors for queries with data to C62 once per key, routes 401 to C55 and step-up to X4; no retry on 4xx; backoff for reads; mutations never auto-retry.
- **Validation / Loading / Error** — as above.
- **Content rules** — —.
- **Do** — mount once in `app/layout.tsx`. **Don't** — create a client per render.
- **Dependencies** — Query, motion. **Built** — `components/providers/provider.tsx` (host).

### C62 — Message provider

- **Purpose** — Own the transient message queue and live region; expose `show`/`dismiss` via `use-toast`.
- **Inputs** — —.
- **States** — empty · showing (≤ max) · queued.
- **Accessibility** — one polite live region; no focus stealing.
- **Keyboard** — messages reachable in reading order. **ARIA** — labelled region.
- **Interaction patterns** — `useReducer` queue; ids via `nanoid`; timers pause on hover or focus; duplicate keys collapse.
- **Validation / Loading / Error** — —.
- **Content rules** — —.
- **Do** — mount in the root. **Don't** — render C24 directly.
- **Dependencies** — C24 C60. **Used by** — root layout.

### C63 — WorkspaceProvider

- **Purpose** — Hold the current workspace and the member's role; expose `can(permission)` and `switchWorkspace`. Stated reason for a provider: navigation, C59 and most sections read it; prop-threading would couple unrelated components. It is context over server data, not a global store.
- **Inputs** — server-loaded workspace and role.
- **States** — loading · ready · switching · error (no role; S01 shows the error).
- **Accessibility / Keyboard / ARIA** — —.
- **Interaction patterns** — workspace id persists in an httpOnly cookie via Server Action; every workspace-scoped key is prefixed with it; a workspace the member no longer belongs to falls back to the first membership with a C24.
- **Validation / Loading / Error** — as above.
- **Content rules** — —.
- **Do** — mount in the `(workspace)` layout only. **Don't** — hold server state that changes during the session.
- **Dependencies** — `use-workspace`, `use-me`. **Used by** — S01 C36 C59 sections.

## Public site contracts (added 2.0.0)

From the built home page. Each is recorded as found.

### C64 — Disclosure

- **Purpose** — Show and hide an answer under its question (S63).
- **Inputs** — `item {id, question, answer}`, `open`, `onToggle`.
- **States** — collapsed · expanded · focus.
- **Accessibility** — the question is a button; the answer region is identified.
- **Keyboard** — Enter/Space toggle (native button).
- **ARIA** — `aria-expanded`, `aria-controls` (built: `faq-{id}`).
- **Interaction patterns** — one item's state does not force others closed unless the build chooses so.
- **Validation / Loading / Error** — —.
- **Content rules** — answers are complete sentences; the first states the design-study status while it applies.
- **Do** — keep collapsed answers findable when expanded. **Don't** — hide essential terms only in collapsed text.
- **Dependencies** — —. **Used by** — S63. **Built** — `components/ledgerline/faq-row.tsx`.

### C65 — Small-screen navigation toggle

- **Purpose** — Reveal and hide the public navigation on small screens (S55).
- **Inputs** — `open`, controlled list id.
- **States** — closed · open.
- **Accessibility** — accessible name changes with state ("Open menu" / "Close menu"); choosing a link closes the menu.
- **Keyboard** — Enter/Space toggle; Escape closes and returns focus to the toggle (to confirm in build review; not verified).
- **ARIA** — `aria-expanded`, `aria-controls`.
- **Interaction patterns** — the menu holds the same links as the full navigation plus the start action.
- **Validation / Loading / Error** — —.
- **Content rules** — labels from `LEDGER_BRAND.menu`.
- **Do** — keep link order identical to the full navigation. **Don't** — trap focus without an exit.
- **Dependencies** — —. **Used by** — S55. **Built** — `components/ledgerline/ledger-nav.tsx`.

### C66 — Sample interaction control

- **Purpose** — Let a visitor try a sample behaviour that changes nothing real: the approval sample (S58) and card-control switches (S59).
- **Inputs** — sample state (local only), labels.
- **States** — initial · changed · reset.
- **Accessibility** — the sample is labelled as a sample in text; the result is announced (S58 uses a live sentence); switches use `role="switch"` with `aria-checked` and a label reference.
- **Keyboard** — native buttons; Space/Enter toggle.
- **ARIA** — as above.
- **Interaction patterns** — no network, no persistence; a reset returns to the initial state.
- **Validation / Loading / Error** — —.
- **Content rules** — must say that nothing real happens ("Interactive sample. No payment is made.").
- **Do** — keep samples clearly labelled. **Don't** — reuse for real money actions (those are C52 + S44).
- **Dependencies** — —. **Used by** — S58 S59 (OD9 a, b). **Built** — `approval-card.tsx`, `card-controls.tsx`.

### C67 — Enquiry form

- **Purpose** — Capture a work email for X11 (S64).
- **Inputs** — `contactSchema` (`email`), copy `CTA_COPY`.
- **States** — idle · invalid · sent (design-study: "nothing was sent") · submitting and failed (once an intake exists).
- **Accessibility** — visible label bound by `useId`; `aria-invalid` and `aria-describedby` on error; result in a live paragraph.
- **Keyboard** — Enter submits. **ARIA** — as above.
- **Interaction patterns** — client validation; no network today; email never in a URL.
- **Validation** — `z.email` with `CTA_COPY.invalid`.
- **Loading** — none today. **Error** — field error; later transport error with Retry.
- **Content rules** — states what happens next and what is stored (Q6).
- **Do** — `type="email"`, `autocomplete="email"`. **Don't** — imply sign-up happened (OD10).
- **Dependencies** — `lib/validations/contact.ts`. **Used by** — S64. **Built** — `components/ledgerline/contact-section.tsx`.

### C68 — Text reveal

- **Purpose** — Behavioural obligations of the word-by-word reveal used on public headings. Whether it is used is a build decision.
- **Inputs** — text.
- **States** — before · revealed · reduced motion.
- **Accessibility** — the full text is exposed to assistive technology as one phrase (not word fragments) from the start.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — reduced motion shows the text at once.
- **Validation / Loading / Error** — —.
- **Content rules** — never used on content that must be read immediately (errors, amounts).
- **Do** — keep headings readable without JavaScript. **Don't** — split text in the accessibility tree.
- **Dependencies** — motion. **Used by** — S04 S55–S64 headings. **Built** — `components/wrappers/reveal-words.tsx` (to confirm its accessibility in build review).

## Dependency map

| Layer | Contracts | May depend on |
|---|---|---|
| Primitives | C01–C33 | each other; LD1 (C30), LD5 (C19, C20) |
| Compositions | C34–C55 | primitives, wrappers, hooks |
| Wrappers | C56–C60 | primitives, motion, Query |
| Providers | C61–C63 | primitives, wrappers |
| Public site | C64–C68 | primitives |

## Open questions

| ID | Question | Default until answered |
|---|---|---|
| Q6-1 | The host rule "wrap `<Link>` around `<Button>`" nests a `<button>` in an `<a>` (invalid HTML; two tab stops). Should a link be able to take C01's behaviour as a single `<a>`? | House rule followed; flagged in Phase 9 a11y review. |
| Q6-2 | C40 takes fraction digits from `Intl` (CLDR); CLDR and ISO 4217 disagree for a few currencies. Should the backend send the exponent with every `Money`? | Use `Intl`; OD1 default currency unaffected. |
| Q6-3 | Rename C34 file/export `LoginForm` → `AuthForm`? | Keep `LoginForm`. |
| Q6-4 | *Withdrawn in 2.0.0 (was a destructive visual tone for C01).* C52 carries destructive intent through copy and `alertdialog`. | — |
| Q6-5 | *Withdrawn in 2.0.0 (focal tile hover modifier — visual).* | — |
| Q6-6 | Accountants may reveal full numbers after step-up (Phase 3 IA2); narrow to owner + finance? | Keep IA2. |
| Q6-7 | C56 host implementation: `scale` never returns to 1 and `duration` has no effect with the spring settings. | Do not pass `scale`; treat `duration` as inert. (Behavioural defect recorded; how it should look is a build choice.) |
| Q6-8 | (2.0.0) Do C64–C68 move to `components/ui/`/`common/` for reuse on P28, or stay in the `ledgerline` feature folder? | Stay until reused (promotion rule). |

## Assumptions

- **A3** — Domain input types are contract `z.infer` types re-exported from `lib/types/<domain>.ts`.
- **A4** — Users may belong to several workspaces (C36, C63).
- **A6** — One locale; everything through `Intl` / `date-fns`.
- **A7** — *Withdrawn (visual register).*
- **A9** — Platform permissions collapse to `ADMIN` until finer roles exist.
- Phase-local: constants referenced here (`LOCALE`, `REVEAL_TIMEOUT`, `SECTION_LOAD_FAILED`, `TRANSACTION_STATUS_LABEL`, shortcut constants, MIME constants) are created in `lib/constants.ts` or feature constants (Phase 7).

## Changes in this version

- **Retained:** C01–C63 (IDs, purpose, inputs, states, keyboard, ARIA, interaction, validation, loading, error, content rules, do/don't, dependencies, used-by); Q6-1–Q6-3, Q6-6, Q6-7.
- **Changed:** file renamed from `phase-6-component-library.md` to `phase-6-interaction-contracts.md` and reframed as behaviour-only contracts; 19 contracts renamed (table above); every **Variants**, **Styling Approach**, **Tokens**, **Responsive**, **Animation**, **Slots** and **Anti-patterns (styling)** field removed; the Component Styling Standards, Primitive standard (styling part), Tone system, Named classes, Component styling template and Variant template sections removed; C01 `tone` input replaced by `emphasis` (importance); C12/C13 `Tone` replaced by `severity`; C54 reframed from dark/Daylight toggle to a preference over whatever schemes the build offers; C56 and C60 reduced to behavioural obligations; Q6-4, Q6-5 withdrawn; A7 withdrawn.
- **Added:** "Rules every contract inherits"; C64 Disclosure, C65 Small-screen navigation toggle, C66 Sample interaction control, C67 Enquiry form, C68 Text reveal; Q6-8.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md) (BR1–BR12, DP1–DP12), [Phase 2](phase-2-experience-maps.md) (X1–X11 behaviours), [Phase 3](phase-3-information-architecture.md) (labels, search, filters), [Phase 4](phase-4-page-blueprints.md), [Phase 5](phase-5-section-blueprints.md) (every "Contracts" line).
- **Downstream:** [Phase 7](phase-7-frontend-architecture.md) (component layers and files), [Phase 8](phase-8-implementation-roadmap.md) (status of C01–C68), [Phase 9](phase-9-qa-checklist.md) (keyboard, ARIA and state checks), [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).
