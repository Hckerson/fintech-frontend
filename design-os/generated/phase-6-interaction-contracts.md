# Ledgerline Design OS — Phase 6: Interaction Contracts

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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

Every **States** entry names what puts the element into the state and what the state permits. Every statement in **States**, **Keyboard**, **ARIA**, **Validation**, **Loading** and **Error** is written so a tester can pass or fail it; Phase 9 turns them into checks. A number in a contract is the specified value; where the number is a judgement call it carries an assumption ID (A6-n) from [Assumptions](#assumptions) and lives in a constant, so the owner changes it in one place. [Phase 1](phase-1-product-vision.md) BR19 is the authority for every limit, expiry and retention value repeated here; [Phase 7 §10](phase-7-frontend-architecture.md) owns the constant names.

Library IDs (LD1–LD5) refer to [Phase 7 §15](phase-7-frontend-architecture.md#15-shared-libraries); LD1 (`recharts`) is installed, with the owner still to confirm where its approval is recorded, and LD2–LD5 await approval.

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
9. **One state vocabulary.** *Disabled* — unavailable now for a reason the member can change (form incomplete, offline, a dependency still loading); it stays focusable with `aria-disabled="true"` and its reason is text tied to it by `aria-describedby`; native `disabled` is used only when there is nothing to explain. *Read-only* — the value can be focused, selected and copied but not changed, and is still submitted. *Not permitted* — the member's role (R1–R7) can never do it; the action is absent (rule 7) or replaced by an explanation through C59 naming who can grant it; it is never shown as disabled. *Busy / pending* — a request is in flight; activation is ignored, focus and accessible name stay put.
10. **One activation, one request.** Every action is single-flight: a second activation while the first is pending (double click, held Enter, Enter plus click, a second tab) is dropped, not queued. Every write carries an idempotency key created with `nanoid` when the attempt begins and reused by every retry of that attempt, so a repeat never creates a second record (Q6-10); the backend honours a key for 24 hours. A write against a record someone else changed since the member loaded it is refused (409): the member keeps what they typed and chooses what to do next. Nothing is last-write-wins. Notes are append-only, so this applies to edits such as category, flag and saved views.
11. **Focus is never lost and never hidden.** Each contract names where focus goes after each action. When the focused element is removed, focus moves to the next item, else the previous item, else the heading of the owning region — never to `<body>`. An element receiving focus is brought into view and is never fully covered by content the product keeps in view (WCAG 2.4.11).
12. **Input parity.** Pointer, touch, keyboard, voice control and switch access reach the same outcome. Nothing is available on hover only; nothing requires dragging (WCAG 2.5.7), a multi-point or path gesture (2.5.1); activation completes on release and can be abandoned by moving off the control (2.5.2); the accessible name contains the visible label text (2.5.3).
13. **Announcements.** One polite live region per owning section; assertive (`role="alert"`) only when the error blocks the task in hand. Wording is a complete sentence, outcome before detail, object named ("Note saved.", "Export failed. Reference LX-4F2K."), with no reliance on colour or position words. An announcement never contains a full account or routing number, a password or a one-time code; amounts are spoken with sign and currency in words. Counts are announced once after input settles, never per keystroke; an identical announcement within 1 second is not repeated.
14. **Validation timing.** No error appears before the member has had a chance to finish a field. Validation runs on submit; a field that has been reported once re-validates on blur and clears as soon as its value becomes valid. On a failed submit, focus moves to the first invalid control in DOM order and the error count is announced once ("2 fields need attention."). Server-reported field errors are mapped onto the same field by the schema key and shown through C10; an error that maps to no field is a form-level message with a reference (Q6-11). Input is never discarded on failure, and information already given in the same process is not asked for again (WCAG 3.3.7).
15. **Time limits and unknown outcomes.** A read with no response within `REQUEST_TIMEOUT_MS` (15 s, A6-9) is a retriable failure. A write with no response within `MUTATION_TIMEOUT_MS` (30 s, A6-9), or whose connection drops after sending, is reported as *not confirmed*: the contract re-reads the record before offering Retry, and Retry reuses the idempotency key. A timed-out write is never re-sent automatically; only the member's Retry sends it again. A request still pending after `SLOW_REQUEST_MS` (10 s) says in text that it is taking longer than usual. The only time limits on the member are the session (C55) and the reveal window (C42); both can be extended or re-requested (WCAG 2.2.1).
16. **Session expiry and step-up mid-action** (X4). A 401 or a step-up demand opens C55 and never navigates. The interrupted contract keeps its input, open state, scroll position and focus target. An interrupted write is never replayed automatically: the draft is kept in the open tab's memory only (rule 18) — it is gone when the tab closes — and after successful re-authentication reads refetch and the member re-submits; that re-submission carries the same idempotency key as the interrupted attempt. If re-authentication is cancelled nothing is sent and the input remains. If a different user re-authenticates, every draft is dropped (C55).
17. **Offline and degraded service** (X10). Offline, data already loaded stays readable with its as-of time; every control that writes becomes disabled with the reason in text (rule 9); nothing is queued for later sending. When `online` fires, reads refetch and controls re-enable without a reload.
18. **Sensitive values stay out of side channels.** Full account and routing numbers, passwords, one-time codes, message bodies and other members' email addresses never appear in a URL, document title, analytics event, client log, error reference, `localStorage` or `sessionStorage`. URLs carry opaque IDs only (DP11); the ledger's free-text `q` parameter is the single recorded exception (Phase 1 OD14) and is never logged or sent to analytics. Drafts live in memory only: a draft interrupted by session expiry, step-up or a refused write stays in the open tab so the member can re-submit after re-authenticating in place; it is never written to `localStorage`, `sessionStorage`, `IndexedDB` or a service-worker cache, and it is gone when the tab closes or a different user signs in. Browser storage holds only non-financial interface preferences.
19. **Failure text.** A failure says what failed, that viewing failed rather than that money changed (where true), what the member can do next, and a reference the member can quote to support. The reference is required on every failure, including a refusal produced before the backend is reached (validation, offline). It never shows raw backend text, a stack trace or a bare status code.
20. **Zero, one, many, long.** A contract that takes a collection defines its behaviour at zero items, one item and its stated maximum. Text of unknown length wraps; where it is shortened, the full value is in the accessible name and reachable without hover. Money, dates, status labels and references are never shortened.
21. **Locale and direction.** Digit grouping, decimal mark, currency placement, date order, plurals (`Intl.PluralRules`), list joining and sort collation come from `DEFAULT_LOCALE` through `Intl` / `date-fns` (A6); none is assembled by string concatenation. Copy may grow to 140% of the source length without clipping or loss (A6-12). Order and arrow-key direction follow the reading direction, so a right-to-left locale needs no contract change; numbers, references and names embedded in a sentence are direction-isolated (`<bdi>`).
22. **Adaptations.** Every contract keeps all content and function with reduced motion, forced colours, 200% text zoom, WCAG 1.4.10 reflow and WCAG 1.4.12 text-spacing overrides.
23. **Traceability.** Audit records are written by the backend, never by a contract. A contract's obligation is that every write and every reveal goes through the audited request — no client-only path produces the effect — and that the request carries the actor's session and the workspace. Who may read the record is set by the permission matrix (BR9).

## Primitives

Domain-free (C01–C33). None imports a hook, contract type or domain copy; meaning arrives through inputs.

### C01 — Button

- **Purpose** — The single action primitive: submit, confirm, open, retry.
- **Inputs** — `emphasis: "primary" | "secondary" | "tertiary"` (importance, not appearance); `isLoading`; `type` (default `"button"`); native button attributes.
- **States** — default (activation runs the action once) · hover (pointer over; changes nothing a keyboard user lacks) · focus · active (between press and release; moving off before release abandons the activation) · disabled (rule 9: the reason is associated text; activation does nothing and announces the reason) · loading (`isLoading` true from activation until the owner settles; activation ignored, focus kept, label kept).
- **Accessibility** — visible text label always (icon-only actions use C02); label kept while loading so the name is stable; a label that wraps to several lines stays one target; the label is never shortened (rule 20).
- **Keyboard** — Enter and Space activate (native; Space on key-up, Enter on key-down, so a held Enter repeats and is absorbed by rule 10). Focus stays on the button after activation unless the owner states a destination; when the button is removed by its own action, rule 11 applies.
- **ARIA** — `aria-busy="true"` while loading; `aria-disabled` plus `aria-describedby` to the reason when disabled with an explanation; `aria-pressed` only when used as a toggle; `aria-keyshortcuts` when a shortcut exists. The start and end of loading are announced by the owner's live region (rule 13), not by the button.
- **Interaction patterns** — one primary action per view region; inside C21/C52 the confirm action is last in DOM order; a click fires once; a loading button ignores activation (`disabled || isLoading` — fixes H-22); an action that moves or decides something (case decision, deferred money movement) never fires from Enter in an unrelated field — it needs focus on the button or the form's explicit submit.
- **Validation** — none; the owning form validates. A submit button is never disabled merely because the form is invalid — the member can always submit and learn what is missing (rule 14).
- **Loading** — progress indicator (C17) with the label kept; loading longer than `REQUEST_TIMEOUT_MS`/`MUTATION_TIMEOUT_MS` ends through rule 15, never an endless busy state.
- **Error** — shown by the owning form or section, not the button; after an error the button returns to default with focus unchanged so Retry is one key press.
- **Content rules** — verb-first sentence case ("Download statement", "Export CSV"); the label names the object when several similar buttons coexist ("Download September statement"); never "Click here", "OK" or "Submit" alone.
- **Do** — use `type="submit"` explicitly in forms. **Don't** — nest a button in a link (see Q6-1); change importance to signal danger (use C52).
- **Dependencies** — C17. **Used by** — S03 S04 S08 S10 S21 S26 S30–S32 S37 S38 S40 S42 S43 S45 S52 S54 S62; inside C02 C33 C51 C52 C55.
- **Built** — `components/ui/button.tsx` (host). 1.0.0 required changes still open: add `displayName` (H-07); remove per-component focus ring overrides (H-06); `disabled || isLoading` (H-22).

### C02 — IconButton

- **Purpose** — Icon-only action (remove owner, close panel, open menu, reveal navigation).
- **Inputs** — `label` (required), `icon`, `isLoading`, native button attributes.
- **States** — default · hover · focus · disabled · loading — each defined as in C01; additionally *expanded* / *collapsed* when it controls a C20 or a panel (set by the owner, reflected in `aria-expanded`).
- **Accessibility** — name from `label`; icon `aria-hidden`; tooltip (C19) shows the label on hover and focus, and on touch the name is available to assistive technology without the tooltip; the target meets rule 5 even when the icon is smaller.
- **Keyboard** — Enter and Space activate, as C01. When it opens something, focus moves into what opened; when that closes, focus returns here. When it removes its own row (remove owner, remove file), rule 11 decides the destination and the removal is announced.
- **ARIA** — `aria-label`; `aria-expanded`/`aria-haspopup`/`aria-controls` passed through when it opens C20 or a panel; the tooltip is not also wired as `aria-describedby` when it repeats the label (no double reading).
- **Interaction patterns** — destructive icon actions open C52 first; single-flight (rule 10).
- **Validation** — —. **Loading** — icon replaced by C17; name unchanged; `aria-busy`. **Error** — none of its own; the owner reports through C24 or its section and focus stays on the button.
- **Content rules** — `label` is a verb phrase naming the object ("Remove owner Ada Lovelace", "Close details"); two icon buttons in one list never share a name.
- **Do** — pair with C19. **Don't** — use for primary actions; ship without `label`.
- **Dependencies** — C17, C19. **Used by** — S01 S02 S08 S11 S12; inside C20 C22 C24 C37 C39 C51.

### C03 — TextLink

- **Purpose** — Navigation text built on Next `<Link>`; external links identified as external.
- **Inputs** — `href` (from route constants), `external?`, children.
- **States** — default · hover · focus · visited (browser-managed; never used to carry meaning) · current (the destination is the present page; still a link, marked `aria-current`).
- **Accessibility** — link text meaningful out of context; external links say so in the accessible name ("opens in a new tab" only when it does); a link that downloads a file says the format and, when known, the size.
- **Keyboard** — Enter follows (native); modifier-click and middle-click open a new tab because it is a real `<a href>`. After client navigation focus moves to the destination's main heading and the new document title is announced (owned by the layout).
- **ARIA** — `aria-current="page"` when used in C29 or navigation.
- **Interaction patterns** — routes from `lib/constants.ts`, never literal paths; `href` carries opaque IDs only (rule 18); external links use `rel="noopener noreferrer"` so the destination never receives a Ledgerline URL as referrer; a link to a route the role cannot open is not rendered (rule 7).
- **Validation / Loading / Error** — —; a failed navigation is handled by the destination route (P34, P35).
- **Content rules** — link text names its destination ("View statements for Operating"); never a bare URL, never "here".
- **Do** — prefetch internal routes (framework default). **Don't** — use for actions that change data.
- **Dependencies** — Next Link. **Used by** — S04 S06 S07 S13 S17 S34 S46 S47 S54 S55.

### C04 — Input

- **Purpose** — Single-line text, email, password, number and date entry.
- **Inputs** — native input attributes; `invalid` from C10.
- **States** — default · hover · focus · disabled (rule 9; value not submitted) · read-only (rule 9; value submitted, selectable, copyable — used while the owning form is submitting) · invalid (set by C10 after validation per rule 14; cleared when the value becomes valid).
- **Accessibility** — always inside C10; correct `type`, `inputMode` and `autoComplete` per field (`email`, `current-password`, `new-password`, `one-time-code`, `organization`, `name`), so browsers and password managers can fill it (WCAG 1.3.5, 3.3.8); no field requires transcribing or remembering a value the product already holds.
- **Keyboard** — native text editing and selection; Enter submits the owning form; Escape does nothing here (it belongs to an enclosing C21/C22). Focus arrives only by the member's action or by rule 14 after a failed submit.
- **ARIA** — `aria-invalid`, `aria-describedby` (hint + error) and `aria-required` from C10; password show/hide state is on its C02 (`aria-pressed`), and switching it never moves focus or clears the value.
- **Interaction patterns** — password inputs pair with a show/hide C02; paste always allowed; leading and trailing whitespace trimmed on submit except in passwords; money amounts are entered as text with `inputMode="decimal"`, parsed by string to minor units (never `type="number"`, never float — BR1), rejecting more fraction digits than the currency allows rather than rounding; autofilled values are validated like typed ones.
- **Validation** — owned by the form's Zod schema; the input only reflects `invalid`. Timing per rule 14. Length limits come from the schema and are enforced by validation, not by silently cutting pasted text.
- **Loading** — none. **Error** — via C10.
- **Content rules** — placeholders never replace labels and never hold the only example of a required format (that is the C10 hint).
- **Do** — use native date inputs for dates (`yyyy-MM-dd`). **Don't** — block paste; use the label as `id`.
- **Dependencies** — C10. **Used by** — S08 S10 S11 S29 S35 S38 S40 S42 S44.

### C05 — Textarea

- **Purpose** — Multi-line notes, messages, decision reasons.
- **Inputs** — native attributes; `maxLength` from the schema; optional counter.
- **States** — default · focus · disabled · read-only (while submitting) · invalid (rule 14) · near limit (≥ 90% of `maxLength`; the counter starts being announced) · at limit (further input is not accepted; pasting beyond the limit keeps the text that fits and says how many characters were dropped).
- **Accessibility** — inside C10; the counter is announced only when near the limit, at most once per 10% step and at the limit ("20 characters left."); length counts user-perceived characters (grapheme clusters), matching the server.
- **Keyboard** — Enter inserts a newline; where a submit shortcut exists (S26, S37) ⌘/Ctrl+Enter submits, declared via `aria-keyshortcuts` on the submit button; Tab leaves the field (never inserts a tab character).
- **ARIA** — as C04; the counter is referenced by `aria-describedby` and lives in a polite region.
- **Interaction patterns** — drafts survive session expiry (X4) and a failed send; a draft is held in the open tab's memory only, never in browser storage, and is gone when the tab closes or a different user signs in (rule 18); leaving the view with an unsent draft asks before discarding. Limits: transaction note `NOTE_MAX_LENGTH` 2,000 characters, message `MESSAGE_MAX_LENGTH` 5,000, decision reason `DECISION_NOTE_MIN` 10 to `NOTE_MAX_LENGTH` 2,000 (A6-7).
- **Validation** — length and required-ness from Zod, timing per rule 14; whitespace-only content counts as empty.
- **Loading** — —; while the owner submits, the field is read-only, not cleared. **Error** — via C10; the text is kept exactly as typed.
- **Content rules** — the S37 composer states not to include full account numbers or passwords.
- **Do** — keep the draft on failure. **Don't** — submit on plain Enter.
- **Dependencies** — C10. **Used by** — S26 S37 S42 S52.

### C06 — Select

- **Purpose** — Native choice from a short fixed set (category, role, format, period, country).
- **Inputs** — `options` from constants or `lib/data/`; value; native attributes.
- **States** — default · focus · disabled (rule 9) · invalid (rule 14) · loading options (disabled with a placeholder from constants until options arrive) · options failed (stays disabled; the reason and a Retry are given through C10) · stale value (the stored value is no longer an offered option: it is kept and labelled as no longer available rather than silently replaced).
- **Accessibility** — inside C10; the current choice is part of the control's name as read by assistive technology (native).
- **Keyboard** — native: arrows change the choice, type-ahead jumps to a matching option, Enter/Space open the list where the platform does, Escape closes the list without changing the value.
- **ARIA** — from C10; no custom roles.
- **Interaction patterns** — more than ~12 options or a need to search → a combobox is a new contract request, not a Select variant; a change takes effect only when the owning form submits, or — where the owner states it applies at once (category in S26) — through one single-flight mutation that reverts and reports on failure; options the role cannot choose are absent (rule 7).
- **Validation** — Zod enum; an out-of-set value from a tampered request is rejected by the server and reported as a form-level error.
- **Loading** — disabled until options load. **Error** — via C10.
- **Content rules** — option labels from constants; never inline arrays in a section; option order is fixed by the constant, and where alphabetical it is collated by `DEFAULT_LOCALE` (rule 21).
- **Do** — use for fixed enums. **Don't** — use for navigation.
- **Dependencies** — C10. **Used by** — S10 S26 S30 S31 S35 S38 S40 S44 S50.

### C07 — Checkbox

- **Purpose** — Boolean or multi-select choice (include pending, select accounts).
- **Inputs** — `checked`, `indeterminate`, native attributes.
- **States** — unchecked · checked · indeterminate (only on a "select all" parent when some but not all children are checked; activating it checks all) · focus · disabled (rule 9).
- **Accessibility** — groups in `<fieldset>`/`<legend>` (C10 group mode); the label is part of the target; a group of selectable accounts states how many are selected in text.
- **Keyboard** — Space toggles; Tab moves between checkboxes (each is a tab stop); Enter submits the owning form and does not toggle.
- **ARIA** — native `aria-checked="mixed"` for indeterminate; the selected count is a polite status updated once per change.
- **Interaction patterns** — takes effect on form submit, not immediately (immediate settings use C09); a group may require at least one choice and may cap choices — at the cap the remaining boxes become disabled with the reason.
- **Validation** — group rules via Zod, timing per rule 14. **Loading** — —. **Error** — group-level via C10, tied to the `<fieldset>`.
- **Content rules** — label states the positive ("Include pending transactions").
- **Do** — use for "select several". **Don't** — use for immediate on/off.
- **Dependencies** — C10. **Used by** — S31 S40.

### C08 — RadioGroup

- **Purpose** — One-of-few visible choice (export format).
- **Inputs** — `options`, value, `name`.
- **States** — default (may have no selection until the member chooses, unless the schema supplies a default) · focus · checked · disabled option (rule 9, with its reason — for example a format unavailable for the chosen range) · invalid group (rule 14).
- **Accessibility** — `<fieldset>`/`<legend>`; each option's label is part of its target.
- **Keyboard** — Tab enters the group at the checked option (or the first enabled option when none is checked) and leaves it in one step; arrows move and select, wrapping at the ends and skipping disabled options; Space selects the focused option.
- **ARIA** — native; group error tied to the `<fieldset>` via `aria-describedby`.
- **Interaction patterns** — controlled or uncontrolled; selection takes effect on submit.
- **Validation** — required choice via Zod. **Loading** — —. **Error** — associated with the group via C10.
- **Content rules** — each option label is self-explanatory.
- **Do** — ≤ 5 options. **Don't** — use when none is a valid answer without a "None" option.
- **Dependencies** — C10. **Used by** — S31.

### C09 — Switch

- **Purpose** — Immediate on/off setting (alert rule enabled, two-step, flag transaction).
- **Inputs** — `checked`, `onChange` (mutation), label.
- **States** — off · on · focus · disabled (rule 9) · pending (from activation until the mutation settles: shows the requested value, ignores activation, keeps focus) · reverted (the mutation failed or was not confirmed: the previous value is restored and announced).
- **Accessibility** — the label names the setting, not the state; the state is exposed as on/off in text, never by position or colour alone.
- **Keyboard** — Space toggles (and Enter when `role="switch"` is on a button); focus never moves on toggle, success or revert.
- **ARIA** — `role="switch"` with `aria-checked`, or native checkbox semantics; `aria-busy` while pending; the outcome is announced once ("Large transaction alerts on." / "Couldn't change Large transaction alerts. It is still off.").
- **Interaction patterns** — applies immediately through one single-flight mutation (rule 10); on failure it reverts and C24 reports. A change that weakens security (turning two-step off) requires step-up (C55) and a C52 before the mutation. If the server value changed elsewhere meanwhile (another tab, another member), the server value wins and is announced. Settings needing confirmation use C07 + Save.
- **Validation** — —. **Loading** — pending state. **Error** — revert + message with reference (rule 19); an unknown outcome re-reads the setting before showing a value (rule 15).
- **Content rules** — label is a noun phrase ("Large transaction alerts").
- **Do** — use for settings that apply at once. **Don't** — use inside forms that need Save.
- **Dependencies** — C24. **Used by** — S26 S35 S43.

### C10 — Field

- **Purpose** — Label, hint, error and required marker that wire IDs for any control.
- **Inputs** — `label`, `hint?`, `error?`, `required?`, control child; IDs from `useId`.
- **States** — default · required (stated in text in the label, not by a symbol alone) · error (an `error` string is present; set and cleared per rule 14) · disabled (mirrors the control; the reason, when given, is the hint).
- **Accessibility** — label `htmlFor` = control id (H-05); activating the label focuses the control; group mode renders `<fieldset>`/`<legend>` for C07/C08/C48.
- **Keyboard** — — (no tab stop of its own). On a failed submit the owning form focuses the first control in error (rule 14).
- **ARIA** — `aria-describedby` = hint id then error id (hint read before error); `aria-invalid="true"` only while in error; `aria-required`. The error element is rendered only while an error exists, so a screen reader meets it when the control is focused; it is not a live region — the form announces the error count once on submit.
- **Interaction patterns** — forms pass the first Zod issue per field; LD3 forms pass resolver errors; server errors arrive through the same `error` input (rule 14); one error per field at a time.
- **Validation** — displays; does not validate. **Loading** — —. **Error** — shows the message from constants.
- **Content rules** — errors say what is wrong and how to fix it (WCAG 3.3.3), name the limit that was exceeded ("Use 2,000 characters or fewer.") and never blame; hints state format and limits before the member types.
- **Do** — wrap every C04 C05 C06 C11 C48. **Don't** — derive ids from label text.
- **Dependencies** — —. **Used by** — every form section.

### C11 — SearchInput

- **Purpose** — Search with clear action and debounce hand-off.
- **Inputs** — value (from URL where applicable), `onChange`, `placeholder`, `pending`.
- **States** — empty (no clear action) · typing (input changed, debounce running; no request yet) · has value (clear action available) · focus · disabled (rule 9, for example offline) · pending (a request for the current value is in flight; the field stays editable).
- **Accessibility** — labelled; `type="search"`; the clear action is a named C02 ("Clear search").
- **Keyboard** — Escape clears a non-empty value and keeps focus, a second Escape blurs; `/` focuses the ledger search when no editable element has focus and no dialog is open (`aria-keyshortcuts`); Enter runs the search at once, skipping the debounce; activating clear returns focus to the field.
- **ARIA** — result counts are announced by the owning section, not the input, once after results settle ("12 transactions match coffee." / "No transactions match coffee."); `aria-busy` is on the results region, not the field.
- **Interaction patterns** — pairs with `use-debounced-search` (`SEARCH_DEBOUNCE_MS`, 300 ms, A6-4); superseded requests aborted so a slow early response never replaces a later one; queries shorter than the owner's minimum (`LEDGER_QUERY_MIN_LENGTH`, 2 characters, for server search; matches made on the device, such as pages and help, may start at 1) send nothing; a server search unanswered after `SEARCH_TIMEOUT_MS` (5 s) is reported with the advice to narrow it; the query is plain text matched server-side — never interpreted as a pattern — and an account-number-like query is not written to the URL (rule 18).
- **Validation** — trims whitespace; max length `LEDGER_QUERY_MAX_LENGTH` (100 characters, A6-4): further input is not accepted and the limit is stated in the hint.
- **Loading** — pending indicator. **Error** — owned by the results area; the query is kept.
- **Content rules** — placeholder names what can be searched.
- **Do** — keep the query on "no results". **Don't** — search on every keystroke without debounce.
- **Dependencies** — C04. **Used by** — S21 S36 S46 S49 S53; inside C38.

### C12 — Status label

- **Purpose** — Compact textual status (transaction status, account state, verification state, role).
- **Inputs** — `label` (from constants), `severity: neutral | positive | attention | problem | information`.
- **States** — static. A value the domain map does not know (a status added by the backend later) renders the neutral "Unknown status" label from constants and reports through the services logging path — it never renders blank or the raw enum. The unknown-status label is neutral severity and never problem severity, so an unrecognised value is not read as a failure.
- **Accessibility** — the label is text; severity never conveyed only by colour; the label is never shortened (rule 20).
- **Keyboard** — not focusable. **ARIA** — none; when a status changes while in view (pending → posted), the owning section announces it once — the label is not itself a live region.
- **Interaction patterns** — domain value → label and severity through one map per domain (Phase 3 §8.2); only `returned` and `failed` transactions map to problem severity (BR3); account state arrives from the backend as `OPEN / FROZEN / CLOSED` and reaches its label through the same map (mapping to the spec's states is Phase 1 OD11).
- **Validation / Loading / Error** — —.
- **Content rules** — exact labels from Phase 3 §8.2 ("Posted", "Pending", never "Cleared").
- **Do** — use one map per domain. **Don't** — spell labels inline.
- **Dependencies** — —. **Used by** — S12 S13 S17 S20 S24 S30 S32 S39 S49–S53.

### C13 — Status indicator

- **Purpose** — Minimal marker beside text (unread, lifecycle step, permission yes/no).
- **Inputs** — `severity`, accessible text.
- **States** — static · live (the owner updates the value while in view; the change is announced by the owner once, per rule 13).
- **Accessibility** — always accompanied by text or an accessible name; a yes/no permission marker reads "Allowed" / "Not allowed", not a glyph name.
- **Keyboard** — not focusable. **ARIA** — none (text carries meaning); the marker itself is `aria-hidden` when adjacent text states the status.
- **Interaction patterns** — S25 uses it per lifecycle event.
- **Validation / Loading / Error** — —.
- **Content rules** — the adjacent text states the status.
- **Do** — pair with text. **Don't** — use alone.
- **Dependencies** — —. **Used by** — S19 S25 S34 S36 S41.

### C14 — Content group

- **Purpose** — Group related content into one region (a value proposition, a trust claim, a help category).
- **Inputs** — heading level, children.
- **States** — static. Not interactive; a clickable group puts a link on its heading.
- **Accessibility** — heading gives the region its name where it is a landmark; heading levels never skip.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — none.
- **Validation / Loading / Error** — —.
- **Content rules** — one topic per group; claims obey BR10 (nothing invented).
- **Do** — use semantic headings. **Don't** — make the whole group a click target.
- **Dependencies** — —. **Used by** — S05 S06 S46. (1.0.0 visual plane spec dropped.)

### C15 — Table family

- **Purpose** — Semantic, non-virtualized table for bounded lists (statements, export jobs, team, saved views, compliance queue, permission reference, sessions, support results, payees).
- **Inputs** — columns (header, cell renderer, sortable?, essential?), rows, sort state from the URL, `caption`.
- **States** — row: default · hover · focus · selected (the row whose detail is open, or a row chosen for a bulk action; exposed with `aria-selected` / a checked C07) · disabled (the record cannot be acted on now; reason in text). Header: sortable · sorted (ascending or descending). Table: loading (first load, no rows yet) · refetching (rows kept, `aria-busy`) · empty · error · populated · partial (some rows loaded, the rest failed: loaded rows stay and the failure is stated with Retry).
- **Accessibility** — `<table>`, `<caption>`, `<th scope>`; essential columns remain readable on narrow screens without horizontal page scroll; the caption states what the rows are, the active sort and the row count.
- **Keyboard** — Tab through row links and in-row controls in DOM order; sort buttons toggle none → ascending → descending → none with Enter/Space and keep focus on the sort button after the rows reorder. When a row is removed (revoke session, delete view), rule 11 sets focus. If the table scrolls inside its own region, that region is focusable and named so the keyboard can scroll it.
- **ARIA** — `aria-sort` on the one sorted header; a sort change is announced once ("Sorted by date, newest first. 24 statements."); `aria-busy` while refetching.
- **Interaction patterns** — row activation → detail route (or overlay for transactions); sorting writes a URL param and is performed by the server over the whole set, never over only the loaded rows; ties are broken by a stable ID so order does not shuffle between loads; row actions via C20; money columns sort by minor units and never across currencies (a mixed-currency column sorts by currency code, then amount); date columns sort by the value, not the formatted text.
- **Validation** — an unknown sort key or direction in the URL falls back to the default sort.
- **Loading** — C16 rows. **Error** — C33 as the only body row, spanning all columns.
- **Content rules** — empty cells read "—" with an accessible "Not available"; one row = one record; a row never shows another workspace's data.
- **Do** — use for ≤ 200 rows (A6-10). **Don't** — use for ledgers (C53); beyond 200 rows the owner paginates with C25 or moves to C53.
- **Dependencies** — C16 C20 C32 C33. **Used by** — S19 S27 S28 S30–S32 S39 S41 S43 S45 S51 S53.

### C16 — Loading placeholder

- **Purpose** — Hold the place of loading content so it arrives without shifting the page.
- **Inputs** — the populated section's expected extent.
- **States** — loading · still (reduced motion).
- **Accessibility** — hidden from assistive tech; the section announces one "Loading {section}" (`aria-busy`) and nothing more until content or an error replaces it.
- **Keyboard / ARIA** — none; a placeholder is never focusable and never holds focus — if the focused element is replaced by a placeholder, focus stays on the owning region (rule 11).
- **Interaction patterns** — C57 passes each section's placeholder; appears only after `LOADING_DELAY_MS` (200 ms, A6-1) so fast responses do not flash (Q-090); once shown it never outlives `REQUEST_TIMEOUT_MS` — the section becomes C33 (rule 15).
- **Validation / Error** — —. **Loading** — it is the loading state.
- **Content rules** — no fake data in placeholders; never a figure that could be read as a balance.
- **Do** — reserve final space (CLS). **Don't** — replace known data with a placeholder.
- **Dependencies** — —. **Used by** — every data section.

### C17 — Progress indicator

- **Purpose** — In-progress signal for an action (button loading, export running, switch pending). Never for content areas (those use C16).
- **Inputs** — accessible label.
- **States** — active · still (reduced motion; label still announced).
- **Accessibility** — `role="status"` text or the owner's `aria-busy`; an action that runs longer than `SLOW_REQUEST_MS` (10 seconds) re-announces that it is still working at most every 30 seconds, and says so in text.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — owned by the acting control; where real progress is known (upload bytes, export stage) the owner uses C26 instead of an indeterminate signal.
- **Validation / Error** — —. **Loading** — it is the loading signal.
- **Content rules** — label names the action ("Preparing export").
- **Do** — use inside the acting control. **Don't** — block the page.
- **Dependencies** — —. **Used by** — C01 C02 C09 C11 S32.

### C18 — Avatar

- **Purpose** — Person, workspace or counterparty identity mark: image or initials.
- **Inputs** — `name`, `src?`.
- **States** — image · initials fallback (no `src`, image still loading, or image failed).
- **Accessibility** — decorative when the name is adjacent (`alt=""`); otherwise `alt` is the name.
- **Keyboard / ARIA** — not focusable.
- **Interaction patterns** — initials by a pure helper in `lib/utils` that is grapheme-aware, handles one-word names, names with no letters and scripts without capitals (falls back to the first grapheme), and never throws on an empty name; images load only from the product's own image origin.
- **Validation** — —. **Loading** — initials until the image loads. **Error** — image error → initials, silently.
- **Content rules** — never infer identity attributes from names.
- **Do** — fall back gracefully. **Don't** — make it the only identifier.
- **Dependencies** — Next Image. **Used by** — S01 S33 S36 S37 S39 S42 S49.

### C19 — Tooltip

- **Purpose** — Short supplementary label on hover and focus (icon-button names, truncated text, shortcut hints).
- **Inputs** — `content`, trigger child.
- **States** — hidden · showing (after 500 ms of pointer rest, A6-3; immediately on keyboard focus) · dismissed (Escape pressed while showing: stays hidden until the pointer or focus leaves and returns).
- **Accessibility** — never holds essential information that is not also available otherwise; dismissible, hoverable, persistent (WCAG 1.4.13): it stays while the pointer is over the trigger or the tooltip, and has no timeout. On touch, where there is no hover, the content is available through the accessible name or adjacent text.
- **Keyboard** — shows on focus; Escape hides without moving focus and without closing an enclosing dialog on that key press; never receives focus itself.
- **ARIA** — `role="tooltip"`; trigger `aria-describedby` — except when the tooltip only repeats the trigger's `aria-label` (C02), where it is hidden from assistive technology.
- **Interaction patterns** — native `popover` + anchor positioning first (LD5); falls back without rendering off-screen; one tooltip showing at a time; never covers the focused element (rule 11).
- **Validation / Loading / Error** — —.
- **Content rules** — ≤ one short phrase; never a full account number.
- **Do** — use for icon names. **Don't** — put links or actions inside.
- **Dependencies** — LD5. **Used by** — C02 C42 C44 C51.

### C20 — Menu

- **Purpose** — Action menu from a trigger (row actions, "More", saved-view actions, member actions).
- **Inputs** — `items: {id, label, onSelect, disabled?, reason?}[]` (permission-filtered), trigger label.
- **States** — closed · open (items exist in the accessibility tree only while open) · item focused · item disabled (rule 9: unavailable now; focusable, `reason` read with it; activation does nothing) · no items (every item was permission-filtered: the trigger is not rendered).
- **Accessibility** — trigger named for its context ("Actions for Ada Lovelace").
- **Keyboard** — Enter/Space/↓ open and focus the first item; ↑ opens at the last; ↑/↓ move and wrap; Home/End; type-ahead moves to the next item whose label starts with the typed characters (buffer resets after 500 ms); Enter/Space select, close and return focus to the trigger — unless the action opens a dialog, which takes focus and returns it to the trigger on close; Escape closes and returns focus; Tab closes and moves on. Items use roving `tabindex`; the menu is one tab stop.
- **ARIA** — `role="menu"`, `role="menuitem"`, `aria-disabled`, trigger `aria-haspopup` + `aria-expanded` + `aria-controls`.
- **Interaction patterns** — an item's async result shows in C24, not inside the menu; unavailable items explain why; opens on activation, never on hover; closes on outside press, on scroll of the page behind it, and when its trigger's row is removed; only one menu is open at a time; a menu inside C21/C22 closes first on Escape, leaving the dialog open. A destructive item opens C52; it never acts directly.
- **Validation** — —. **Loading** — —. **Error** — via C24, with focus back on the trigger.
- **Content rules** — verb-first item labels.
- **Do** — keep ≤ 7 items. **Don't** — nest menus deeper than one level.
- **Dependencies** — LD5. **Used by** — S03 S21 S23 S27 S39 S45 S49; inside C36 C37.

### C21 — Dialog

- **Purpose** — Modal interruption for a short task: invite (S40), create user (S49), confirm (C52), step-up (C55), palette shell (C38), save view (S21), two-step enrolment (S43).
- **Inputs** — `open`, `onOpenChange`, `title`, `dismissible` (default true), body, actions.
- **States** — closed (content unmounted) · open (everything behind it is inert and its scroll is locked; scroll position behind is preserved) · busy (the task's request is in flight: fields read-only, confirm loading, cancel still available unless the action is irreversible once sent) · error (stated inside the dialog, not in a transient message; the dialog stays open with input intact) · not confirmed (rule 15: the outcome is unknown; the dialog says so and re-checks before offering Retry).
- **Accessibility** — native `<dialog>` with `showModal()`; initial focus on the first field or the least destructive action; focus returns to the invoking control on close — or per rule 11 when that control no longer exists; content taller than the viewport scrolls inside the dialog with title and actions still reachable by keyboard.
- **Keyboard** — Escape → cancel (prevented when not dismissible, and then the reason is stated in the dialog); Tab/Shift+Tab cycle inside and never reach the page behind; Enter submits a form when focus is in a single-line field, and never triggers a destructive confirm from elsewhere.
- **ARIA** — `aria-labelledby` title; `aria-describedby` the consequence text when there is one; `aria-modal` implicit; `role="alertdialog"` when used by C52 for destructive intent. The title is announced on open; nothing behind the dialog is announced while it is open, except C55.
- **Interaction patterns** — backdrop dismiss only when dismissible; a form with unsaved input asks "Discard changes?" (C52) before closing by any route (Escape, backdrop, cancel, browser Back); content mounts only when open; one dialog at a time, with two sanctioned exceptions that stack over an open dialog and return focus into it: the discard confirmation and C55. Browser Back closes the dialog instead of leaving the page. Transient messages (C24) remain reachable while a dialog is open.
- **Validation** — owned by the body form, timing per rule 14.
- **Loading** — primary action loading; Escape allowed unless irreversible.
- **Error** — stated in the body with a reference (rule 19); dialog stays open; focus moves to the error message, or to the first invalid field for field errors.
- **Content rules** — title is the task ("Invite a teammate").
- **Do** — keep it to one task. **Don't** — chain dialogs.
- **Dependencies** — C01 C60. **Used by** — S21 S40 S43 S49; inside C38 C52 C55.

### C22 — Detail overlay

- **Purpose** — Show a record's detail over the list it came from, keeping the list's place: transaction detail from ledgers (P12 intercepted route) and compliance documents (S52).
- **Inputs** — `open`, `onClose` (`router.back()` for the intercepted route), `title`, body.
- **States** — closed · open · loading (the record is being fetched; title and close already usable) · error (the fetch failed; retry offered) · not found (the record does not exist or belongs to another workspace — the two are indistinguishable to the member) · not permitted (the role lost access while it was open: the body is replaced by the C59 explanation).
- **Accessibility** — modal dialog semantics; focus moves to the overlay's title on open and returns to the originating row on close; when that row is no longer rendered (virtualised away, filtered out), C53 scrolls it back into view first, and if it no longer exists rule 11 applies.
- **Keyboard** — Escape closes (after any open C20 or C19 inside has closed); Tab cycles inside; in the ledger, J/K move to the next/previous transaction while open (declared via `aria-keyshortcuts`, announced in a hint), wired by S23 through C53's row index — J at the last loaded row fetches the next page and then moves; at the true end it announces "No more transactions." J/K are ignored while focus is in an editable field.
- **ARIA** — `aria-labelledby`; `aria-modal`; moving with J/K announces the new record's title once.
- **Interaction patterns** — closing navigates back (URL is the state); opening the URL directly (shared link, reload, new tab) renders the full page P12 instead of the overlay; the originating row stays marked selected; edits inside report through C24; an unsent note asks before closing or before J/K moves on; scroll of the list behind is locked and its position preserved; C55 may stack over it.
- **Validation** — —.
- **Loading** — body placeholders via C57; header and close usable.
- **Error** — C33 in the body; not found → C32 with link to the full page.
- **Content rules** — title names the record ("Payment to Acme Ltd"); the document title follows it and never contains an account number (rule 18).
- **Do** — preserve list position. **Don't** — use for tasks unrelated to the list behind it.
- **Dependencies** — C21 C57 C60. **Used by** — S24 S52; P12.

### C23 — Tabs

- **Purpose** — Switch between views of the same data or sibling sub-pages (chart range, admin period, settings and transaction sub-pages).
- **Inputs** — `tabs: {id, label, href?}[]`, selected.
- **States** — default · focus · selected (exactly one at all times) · disabled (rule 9; skipped by arrow keys only when it has no reason to read).
- **Accessibility** — sub-page tabs that navigate are links with `aria-current="page"`; in-page tabs use the tab pattern; when the tabs do not fit, all remain reachable by keyboard and by touch scrolling, and the selected tab is brought into view.
- **Keyboard** — in-page tabs: one tab stop (roving `tabindex`) on the selected tab; ←/→ move and select, wrapping, following reading direction (rule 21); Home/End; Tab moves into the panel. Where a panel's data is slow to load the owner may choose manual activation (arrows move, Enter/Space select) and says so. Link tabs: ordinary links in tab order.
- **ARIA** — `role="tablist"` + `aria-label`, `role="tab"` + `aria-selected` + `aria-controls`, `role="tabpanel"` + `aria-labelledby`; the panel is focusable when it holds no focusable content.
- **Interaction patterns** — shareable selections write a URL param (S18) with `router.replace` so Back leaves the page rather than stepping through tabs; an unknown tab id in the URL selects the default; tabs the role cannot use are absent (rule 7).
- **Validation** — —. **Loading** — panel handles its own via C57. **Error** — panel's.
- **Content rules** — short noun labels.
- **Do** — use for siblings. **Don't** — use for sequential steps (C50).
- **Dependencies** — —. **Used by** — S03 S18 S48.

### C24 — Transient message

- **Purpose** — Non-blocking result of an action (note saved, link copied, export started, update failed).
- **Inputs** — created only through C62's `useToast()`: `message`, `severity`, `action?` (e.g. Retry, Undo), `key?`.
- **States** — entering · visible · paused (pointer over it, focus inside it, or the window not visible: the timer stops and restarts in full afterwards) · leaving. A success message leaves after `TOAST_DURATION_MS` (6 s, A6-2), or 10 s when it carries an action; an error message never leaves on a timer.
- **Accessibility** — announced through C62's polite live region; nothing requiring action exists only in a transient message — every failure it reports is also recoverable from the control that caused it.
- **Keyboard** — reachable in reading order and by the F6 landmark cycle; Escape dismisses the focused message and moves focus to the next message, else back to where it was before entering the region; its action and its dismiss C02 are buttons.
- **ARIA** — the region is a labelled landmark; errors may use `role="alert"` only when they block the task; the action's name includes its object ("Undo delete of view Month-end").
- **Interaction patterns** — errors persist until dismissed and offer Retry when retryable; success auto-dismisses after a constant duration (WCAG 2.2.1 pause); Undo is offered only for a reversible removal, is single-flight, and the removal is committed server-side only as the backend defines — the message never implies a reversal that did not happen; it never takes focus on arrival and never covers the focused element (rule 11).
- **Validation / Loading** — —. **Error** — it reports errors with a reference (rule 19).
- **Content rules** — past tense for success ("Note saved"), what failed and what to do for errors; never an amount, account number or another member's email (rule 18).
- **Do** — offer Undo for reversible removals. **Don't** — carry the only copy of important information.
- **Dependencies** — C62. **Used by** — mutations everywhere.

### C25 — Pagination

- **Purpose** — Cursor "Load more" with range text ("Showing 1–50 of 1,284"). No page numbers.
- **Inputs** — `hasNextPage`, `isFetchingNextPage`, `fetchNextPage`, loaded count, total (from S22 when known).
- **States** — has more · loading more (single-flight; a second activation is dropped) · end ("All transactions loaded"; the button is replaced by that text) · error (the next page failed; loaded rows kept) · total unknown (the server gave no count: the range text reads "Showing 1–50" with no total — never a count of loaded rows presented as the total).
- **Accessibility** — the button is the keyboard and screen-reader equivalent of scroll loading.
- **Keyboard** — native button; after loading, focus stays on the button and the new rows follow it in DOM order; at the end, focus moves to the end text.
- **ARIA** — range text `aria-live="polite"`, announced once per load ("Showing 1 to 100 of 1,284.").
- **Interaction patterns** — wired to `useInfiniteQuery` by the section; page size `LEDGER_PAGE_SIZE` (50), so the range text advances in steps of 50 (1–50, then 1–100) and ends on the true last row; the total is exact up to `COUNT_EXACT_LIMIT` (10,000) and reads "10,000+" beyond it; the cursor is opaque and comes from the server; a cursor the server rejects as expired restarts from the first page and says so; rows that post while the member pages are neither duplicated nor skipped (the cursor is keyed on a stable order).
- **Validation** — —. **Loading** — button loading. **Error** — "Couldn't load more. Retry" stated with the button; loaded items kept.
- **Content rules** — range text uses C27 numbers.
- **Do** — keep focus on the button after loading. **Don't** — use offsets.
- **Dependencies** — C01. **Used by** — S23 S34.

### C26 — Meter

- **Purpose** — A bounded measure: upload progress (S12), ownership declared (S11), runway vs target (S29).
- **Inputs** — `value`, `min`, `max`, `label`, `valueText`.
- **States** — value · indeterminate (progress exists but its amount is unknown; no `aria-valuenow`) · complete (value reached `max`; said once) · over (a measure whose source exceeds `max`, such as declared ownership above 100%: the meter shows `max` and `valueText` states the true figure and that it is over).
- **Accessibility** — `role="meter"` (measure) or `role="progressbar"` (progress) with `aria-valuenow`, `aria-valuetext`; progress is announced at most every 25% and on completion, not on every change.
- **Keyboard** — not focusable.
- **ARIA** — as above, plus `aria-valuemin`, `aria-valuemax` and a name from `label`.
- **Interaction patterns** — value computed outside (pure util); percentages are computed in integer arithmetic (basis points) and never round up to 100% before completion.
- **Validation** — clamps into `[min, max]`; a non-finite value renders the indeterminate state. **Loading / Error** — —.
- **Content rules** — `valueText` in words ("75% of ownership declared").
- **Do** — always give `valueText`. **Don't** — use for money.
- **Dependencies** — —. **Used by** — S11 S12 S29.

### C27 — Number display

- **Purpose** — Any number, count, reference or ID that is not money.
- **Inputs** — pre-formatted value (Intl / date-fns), optional `value` for machine reading.
- **States** — static · unavailable (no value: reads "—" with accessible "Not available"; never "0", "NaN" or blank).
- **Accessibility** — references read character by character where useful (`aria-label` spacing for IDs); dates carry an absolute form; relative times ("3 minutes ago") always carry the absolute date-time in `<time datetime>`.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — formatting happens before; C27 only renders (BR4). Posting and value dates are calendar dates and are shown as sent, never shifted by the browser's time zone; instants (created, signed-in, as-of) are shown in the workspace's time zone (UTC when the workspace has none set) with the zone named whenever it differs from the browser's (Q6-9); internal `(admin)` sections show instants in UTC. Percentages come from integer basis points with half-away-from-zero rounding to one decimal; counts are exact up to the cap its owner states, then "N+".
- **Validation / Loading / Error** — —.
- **Content rules** — one format per kind (dates "Sep 26, 2026"); references are shown and copied in full, never shortened (rule 20).
- **Do** — use `<data>`/`<time>` elements. **Don't** — format inline in sections.
- **Dependencies** — —. **Used by** — S24 S25 S48 S54; inside C40.

### C28 — Shortcut hint

- **Purpose** — State a keyboard shortcut ("⌘K", "/", "J").
- **Inputs** — keys (from shortcut constants), platform.
- **States** — static.
- **Accessibility** — read as words ("Command K").
- **Keyboard / ARIA** — —; the control the shortcut triggers carries `aria-keyshortcuts`.
- **Interaction patterns** — shortcuts declared once in constants (Q-025); single-character shortcuts (`/`, J, K) are active only where stated, never while an editable element has focus, and can be turned off (WCAG 2.1.4); no shortcut overrides a browser or assistive-technology key.
- **Validation / Loading / Error** — —.
- **Content rules** — platform-appropriate modifier.
- **Do** — show where the shortcut applies. **Don't** — invent shortcuts per page.
- **Dependencies** — —. **Used by** — S02; inside C11 C19 C20 C38.

### C29 — Breadcrumbs

- **Purpose** — Ownership trail on detail pages (Phase 3 §13).
- **Inputs** — `crumbs: {label, href?}[]`.
- **States** — default · focus · collapsed middle (more than 4 crumbs: the middle ones sit behind a C20 "…" named "Show hidden breadcrumb levels").
- **Accessibility** — `<nav aria-label="Breadcrumb">`, ordered list.
- **Keyboard** — links in order; the collapsed C20 follows C20. **ARIA** — `aria-current="page"` on the last crumb (text, not a link); separators hidden.
- **Interaction patterns** — dynamic labels from loaded data (account name + masked number via C42 text form); a crumb for a level the role cannot open is text, not a link.
- **Validation** — —. **Loading** — placeholder for a dynamic label. **Error** — falls back to the static parent label.
- **Content rules** — never history-based; never a full account number (rule 18).
- **Do** — on small screens at least the parent link remains. **Don't** — include the drawer/overlay.
- **Dependencies** — C03 C20. **Used by** — S02 S03 S47.

### C30 — Chart

- **Purpose** — The only wrapper around the chart library (LD1): cash flow, period comparison, runway projection, admin series, public forecast (S60).
- **Inputs** — series (numbers for plotting, original strings for labels), `summary` (required text), `currency?`.
- **States** — loading · empty (no points in the period — distinct from a period whose values are all zero, which is populated) · populated · partial (the period is incomplete or some buckets are missing: gaps are stated in the summary and never drawn as zero) · error.
- **Accessibility** — required text summary plus an accessible data table with the same figures (Q-012); every value reachable in the plot is reachable in the table, and the table is the path for touch and switch users.
- **Keyboard** — the plot is one focusable region; ←/→ step through points (following reading direction) and Home/End jump to the first/last, announcing each via a polite region ("12 September: money in 4,200 pounds; money out 1,150 pounds."); ↑/↓ change series where there are several; Escape leaves point mode; Tab moves on without stepping through every point.
- **ARIA** — region labelled by the chart title and described by the summary.
- **Interaction patterns** — money converts to numbers only for scale; displayed values via C40's formatter; one currency per chart — accounts in different currencies are never combined into one series or total; buckets (day, week, month) are computed by the server in the workspace's reporting time zone, so a bucket boundary never depends on the viewer's clock; a projection (runway) is labelled as an estimate with its basis period; at most 366 points per series (A6-15), beyond which the server aggregates.
- **Validation** — rejects values beyond `Number.MAX_SAFE_INTEGER` (that series renders the error state rather than a wrong scale). **Loading** — C16. **Error** — C33 compact.
- **Content rules** — axis and point labels from original strings; negative values keep their sign in text.
- **Do** — lazy-load. **Don't** — plot raw transactions.
- **Dependencies** — LD1, C16 C32 C33 C40. **Used by** — S18 S28 S29 S48 S60.

### C31 — Trend summary

- **Purpose** — Minimal trend next to a figure (S14).
- **Inputs** — points, accessible summary.
- **States** — populated · flat (first and last value equal: summary reads "No change over 30 days") · empty (renders nothing).
- **Accessibility** — decorative graphic; the summary text ("up 3.8% over 30 days") carries meaning.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — always adjacent to the value it summarises; one currency only.
- **Validation** — fewer than 2 points → nothing. **Loading / Error** — owned by the section.
- **Content rules** — summary uses C41 wording.
- **Do** — hand-rolled, no library. **Don't** — make it interactive.
- **Dependencies** — —. **Used by** — S14.

### C32 — EmptyState

- **Purpose** — Explain an empty result and offer the next step.
- **Inputs** — `title`, `body?`, `action?` from `EMPTY_STATES`.
- **States** — filtered-empty (filters or a query are active and match nothing: offers "Clear filters", query kept) · truly empty (nothing exists yet: offers the first action the role may take, or none) · not permitted (the role may not see this page, section or record kind: says which role can do it and who can grant access; offers no action the role cannot use; this, never C33, is what a page-level permission denial renders) · not yet available (the source has not delivered data — a new account, verification pending: says when to expect it if known).
- **Accessibility** — heading level appropriate to the section; action reachable; when a filter change produces it, the owning section announces the zero result once and focus stays on the control the member was using.
- **Keyboard** — action is a link or button. **ARIA** — —.
- **Interaction patterns** — never shows sample data styled as real (Q-246); never shown while a request is pending or failed (those are C16 and C33). The not-permitted kind is for a role that can never do the thing; a single record outside the member's scope, or in another workspace, is not reported as not permitted — it answers exactly like a missing record (P34), so its existence is not disclosed.
- **Validation / Loading / Error** — —.
- **Content rules** — one sentence, at most one action.
- **Do** — distinguish none-yet from none-match. **Don't** — show a zero balance as empty.
- **Dependencies** — C01 C03. **Used by** — every data section; S54.

### C33 — ErrorState

- **Purpose** — Explain a failed load and offer retry (section error, 500 body, offline).
- **Inputs** — `kind: retryable | non-retryable | offline`, `message` (from constants), `onRetry` (retryable and offline kinds), `reference` (required on every error and never optional, including a refusal produced before the backend is reached: the request reference the backend echoes, or the render-error digest, which the member can quote to support).
- **States** — kinds: retryable (a timeout, a network failure or a 5xx: Retry offered) · non-retryable (the request can never succeed as sent — data that failed its schema, a refused request: no Retry; the message gives the next step and the support path) · offline (below). Within a kind: idle (failed; Retry available) · retrying (single-flight; Retry busy) · offline (retry waits for `online`, then runs once by itself) · rate-limited (the server asked to wait: Retry is disabled with the wait stated, and re-enables when it elapses) · still failing (3 consecutive manual retries failed: the message adds how to contact support with the reference).
- **Accessibility** — does not steal focus; message readable; when Retry succeeds, focus moves to the heading of the restored section because the Retry button is gone (rule 11).
- **Keyboard** — Retry is a button. **ARIA** — `role="alert"` only when the error blocks the task; otherwise announced once politely by the owning section.
- **Interaction patterns** — receives `refetch` from C57; retries only its own query; the reference is present on every kind, is selectable text and identifies the failed request to support without exposing account data; an offline or validation refusal, which reached no server, carries a reference generated on the device (`nanoid`) and says so to support through its form.
- **Validation** — —. **Loading** — retrying. **Error** — it is the error state.
- **Content rules** — says viewing failed, never implies funds changed (rule 19); distinguishes "we couldn't load this, try again" (retryable) from "this can't be loaded" (non-retryable) from "you're offline". Lost or missing access is not an error: it is the C32 not-permitted state.
- **Do** — include a reference code on every error. **Don't** — show raw backend text.
- **Dependencies** — C01. **Used by** — every data section; S54.

## Compositions

### C34 — LoginForm → generalized AuthForm variants

- **Purpose** — The body of S08 in five variants: sign-in, register, forgot, reset, verify.
- **Inputs** — `variant`; `next?`; `token?`; `challenge?`.
- **States** — idle · submitting (fields read-only, submit busy; single-flight) · field error (schema failure on one or more fields, rule 14) · request error, one of: `INVALID_CREDENTIALS` (401; applies to the attempt as a whole, never to a field) / `REQUEST_FAILED` (network or timeout; nothing is known about the credentials) / too many attempts (429; submit disabled until the backend's retry-after elapses, with the wait stated) / unavailable (5xx) / link expired or already used (reset and verify tokens) · challenge required (sign-in succeeded but two-step is needed: the verify variant follows without re-asking for the password) · success.
- **Accessibility** — see S08; paste and password managers allowed; no cognitive tests (WCAG 3.3.8): no puzzle, no transcription of characters from an image, one-time codes may be pasted or autofilled as one value; the email typed on one variant is carried to the neighbouring variant instead of being asked again (WCAG 3.3.7).
- **Keyboard** — Enter submits; initial focus on the first empty field; after a request error focus moves to the form error message and the password field is cleared while the email is kept; after a field error focus moves to the first invalid field.
- **ARIA** — `aria-busy` on the form while pending; `role="alert"` form error; success on forgot is a polite status.
- **Interaction patterns** — hooks `use-login`, `use-register`, `use-request-password-reset`, `use-reset-password`, `use-verify-challenge`; forgot shows the same confirmation for every email, after the same delay, whether or not the address exists; `next` is honoured only when it is a same-origin path from route constants — anything else falls back to the role's default destination; `token` is read once, removed from the address bar before any other request leaves the page, and never logged; a verify code that runs out of attempts ends the challenge and returns to sign-in; signing in from a second tab while one is submitting yields one session, not two.
- **Validation** — Zod `safeParse` over `lib/validations/auth.ts` composing contract schemas; timing per rule 14; password rules are stated in the hint before typing and each unmet rule is named in the error; register re-checks nothing the server has not told it (email availability is never probed while typing).
- **Loading** — submit progress. **Error** — mapped to constants; never echoes backend text; each request error has its own wording (Q-073) and none says which of email or password was wrong.
- **Content rules** — no enumeration of accounts in any message.
- **Do** — link neighbouring steps (H-04). **Don't** — use label text as `id`/`name` (H-03).
- **Dependencies** — C01 C04 C10. **Used by** — S08; verify variant inside C55.
- **Built** — `components/common/login-form.tsx` (sign-in only). Open host findings H-01–H-05.

### C35 — NavItem

- **Purpose** — One navigation destination.
- **Inputs** — `NavItem` from `lib/data/navigation.ts`; optional count.
- **States** — default · hover · focus · current (the present route is this destination or one of its descendants; exactly one item is current).
- **Accessibility** — keeps its accessible name when its label is hidden; a count is part of the name in words ("Notifications, 3 unread").
- **Keyboard** — native link. **ARIA** — `aria-current="page"` from `usePathname()`.
- **Interaction patterns** — items permission-filtered (C59/C63); routes from constants; a role change mid-session adds or removes items without reload, and if the current item disappears the member stays on the page until its own gate redirects (P08).
- **Validation** — —. **Loading** — count hidden while loading; never a stale "0". **Error** — count hidden.
- **Content rules** — labels exactly as Phase 3 §8.1.
- **Do** — use the nav config. **Don't** — hard-code items in S01.
- **Dependencies** — C03. **Used by** — S01.

### C36 — WorkspaceSwitcher

- **Purpose** — Show the current workspace and switch between memberships (A4).
- **Inputs** — workspaces, current id, `switchWorkspace` (C63).
- **States** — closed · open · switching (from selection until the new workspace's first data arrives: the previous workspace's figures are already gone, and further selection is ignored) · single workspace (static label, not a control) · many workspaces (more than 10 memberships: the switcher becomes searchable — the open list is filterable by typing, still one level).
- **Accessibility** — trigger names the current workspace; the switch is announced once on completion ("Switched to Northwind Ltd."); focus then moves to the destination page's main heading.
- **Keyboard** — as C20. **ARIA** — `role="menuitemradio"` with `aria-checked`.
- **Interaction patterns** — selecting changes C63, which changes every workspace-scoped key prefix; `queryClient.clear()` then `router.refresh()`; route kept when allowed, else P08. Unsaved input in the current workspace asks before switching. Open overlays, revealed numbers (C42) and palette Recent entries of the previous workspace are closed, re-masked and hidden. The switch is broadcast to other tabs of the same session, which reload into the new workspace rather than keep showing the old one against a new cookie. The member's role may differ per workspace, so all gating is recomputed.
- **Validation** — a workspace id not among the member's memberships is refused. **Loading** — trigger placeholder. **Error** — switch failure → C24; stays on current workspace with its data refetched.
- **Content rules** — workspace names exactly as stored; two workspaces with the same name are told apart by a second attribute in text.
- **Do** — make the current workspace unmistakable in text. **Don't** — show cached data from the previous workspace.
- **Dependencies** — C20 C18 C63. **Used by** — S01.

### C37 — UserMenu

- **Purpose** — Account menu: Profile & security (P25), colour-scheme preference (C54), Help (P28), Sign out (X3).
- **Inputs** — `use-me` data.
- **States** — closed · open · signing out (single-flight; the menu stays open and inert until the route changes).
- **Accessibility** — trigger named "Account menu for {name}".
- **Keyboard** — as C20. **ARIA** — as C20.
- **Interaction patterns** — sign out: `use-logout` (DELETE `app/api/session`), cache cleared, route to P02; cookie cleared server-side regardless. Sign-out also re-masks any reveal, discards drafts after asking when one exists, clears palette Recent, and is broadcast so every tab of the session leaves to P02. After sign-out, Back and the browser's page cache never show a balance: authenticated routes are served `no-store` and re-check the session.
- **Validation** — —. **Loading** — sign-out item shows progress. **Error** — C24; session still ended locally, and the member is told to close the browser if the server could not be reached.
- **Content rules** — "Sign out", not "Log off".
- **Do** — clear the query cache on sign-out. **Don't** — leave balances viewable via Back.
- **Dependencies** — C20 C18 C54. **Used by** — S02.

### C38 — CommandPalette

- **Purpose** — Jump to any page, account or transaction, and run common actions, from anywhere in `(app)` and `(admin)` (⌘K / Ctrl+K).
- **Inputs** — `open`, `onOpenChange`, `scope: app | admin`, `commands: PaletteCommand[]` (permission-filtered).
- **States** — closed · open empty (Recent + Navigate) · typing (local groups filter at once; the debounce for server search is running) · searching (server request in flight; local results already usable) · results · no results ("No matches for …" + "Search all transactions") · search error (retry offered within that group; local groups still work) · offline (server search unavailable with the reason; navigation still works).
- **Accessibility** — modal dialog containing a combobox and listbox; results grouped with group names; the result count is announced once after results settle ("7 results."), and each option is read with its group.
- **Keyboard** — ⌘K/Ctrl+K toggles (ignored while another dialog is open or focus is in contenteditable); focus starts in the input and stays there (`aria-activedescendant` moves, not DOM focus); ↑/↓ move and wrap across groups, Home/End, PageUp/PageDown move by group; Enter runs the active option; ⌘/Ctrl+Enter opens a transaction in a new tab; Escape clears a non-empty query, then closes and returns focus to where it was; focus trapped to input and results.
- **ARIA** — `role="combobox"` with `aria-activedescendant`, `aria-controls`, `aria-expanded`, `aria-autocomplete="list"`; `role="listbox"`/`option` with `role="group"` + `aria-label` per group.
- **Interaction patterns** — groups: Recent (ids and labels only, never amounts or numbers; kept in the open tab's memory only and never in `localStorage`, because a label can name an account or a counterparty; at most 8 entries, keyed per user and workspace, cleared on sign-out; an entry whose target no longer exists or is no longer permitted is dropped when met), Navigate, Accounts (cached), Transactions (server search, debounced, ≥ 2 characters, amount-aware: "4200" matches 420000 minor units, both signs; at most 5 per group with a "Search all transactions" continuation, A6-13), Counterparties, Help, Actions. Choosing a transaction opens P12. An action that changes data runs through its own contract (C52 where destructive) after the palette closes — the palette never confirms on its behalf. Superseded searches are aborted.
- **Validation** — amount parsing by string, never float; query length capped at `LEDGER_QUERY_MAX_LENGTH`; a query that looks like a full account number matches only by last four and is not stored in Recent.
- **Loading** — Transactions group placeholders. **Error** — stated in that group with Retry; a 401 hands over to C55 and the palette keeps its query.
- **Content rules** — group order per Phase 3 §10.
- **Do** — lazy-load on first open. **Don't** — store sensitive values in Recent.
- **Dependencies** — C21 C11 C28 C40. **Used by** — S02.

### C39 — Notification entry point

- **Purpose** — Entry to notifications (X7) with unread count and a short preview.
- **Inputs** — count, preview items.
- **States** — no unread · unread · open · loading preview · error preview (link to P20 still works) · empty preview ("No notifications yet").
- **Accessibility** — name includes the count ("Notifications, 3 unread"); count changes announced at most once a minute, and never while the member is typing.
- **Keyboard** — disclosure: Enter/Space toggle; when open, focus moves to the preview's heading and Tab walks its items; Escape closes and returns focus to the entry point; Tab past the last item closes it.
- **ARIA** — `aria-expanded`, `aria-controls`.
- **Interaction patterns** — opening does not mark read; only "Mark all read" or P20. "Mark all read" is single-flight and marks only what existed when it was activated, so a notification arriving meanwhile stays unread. Count polls every `NOTIFICATION_POLL_INTERVAL` (60 s, A6-11), pauses in background tabs and offline, and refetches on return. Preview items never contain a full account number.
- **Validation** — "99+" above 99 (A6-11). **Loading** — no number. **Error** — no number, no error.
- **Content rules** — preview items link to their subject.
- **Do** — keep the count honest. **Don't** — show "0" while loading.
- **Dependencies** — C02. **Used by** — S02.

### C40 — Amount

- **Purpose** — Render every money value from integer minor units in a string plus ISO 4217, via `Intl.NumberFormat` (BR1, BR2).
- **Inputs** — `amountMinor: string`, `currency`, `display: balance | signed | absolute`, `status?`, `currencyDisplay: symbol | code`, `label?`.
- **States** — normal · pending (labelled pending; a pending amount may still change or disappear and is never added into a posted total) · negative balance (minus shown; the owner adds "Overdrawn") · zero (shown as zero with its currency and no sign — a real value, never the unavailable state) · returned/failed (problem severity, in text via the status label) · reversed (labelled reversed; the original and the reversal are two amounts, never netted by the client) · unavailable (em dash with accessible "Not available").
- **Accessibility** — read as "minus 1,250 pounds" for debits (sign is text, not only a glyph); `label` prefixes context ("Available balance"); the spoken form includes minor units when non-zero ("minus 1,250 pounds and 40 pence") and the currency name from `Intl.DisplayNames`.
- **Keyboard** — not focusable. **ARIA** — renders `<data value={amountMinor}>`; an accessible label carries the spoken form.
- **Interaction patterns** — `signed` always shows + for credits and − for debits; `code` display when a view mixes currencies; copy (C51) copies a canonical plain value with currency code (minor units converted by string to a decimal with "." as the mark, no grouping, leading "-" for debits). All fraction digits of the currency are always shown; the value is never abbreviated ("1.2k"). Sign, digits and currency form one unbreakable, direction-isolated unit, so wrapping or a right-to-left sentence cannot separate or reorder them. Any arithmetic the client must do (a visible subtotal the server did not send) is `BigInt` addition within one currency; conversion between currencies never happens in the client.
- **Validation** — `BigInt` parse; exponent from `Intl` resolved options (Q6-2); a malformed amount — input that is not an optional "-" followed by digits (empty, a decimal mark, grouping, an exponent, whitespace, a `number`), an unknown currency code, or a value the formatter cannot represent exactly — is never repaired, rounded or shown as zero → unavailable state plus a report through the services logging path, never NaN, never a guessed value.
- **Loading** — owned by the caller. **Error** — unavailable state.
- **Content rules** — never rounds silently; never sums currencies.
- **Do** — memoise one formatter per currency and locale. **Don't** — accept `number`; flag ordinary debits as problems (BR3).
- **Dependencies** — C27, `lib/utils/money.ts`. **Used by** — S14–S16 S18–S20 S22–S24 S28–S30 S33 S44; inside C38 C43 C44.

### C41 — DeltaChip

- **Purpose** — Change versus a comparison ("+4.2% vs last month", "−£1,200").
- **Inputs** — `deltaBasisPoints` or money delta, comparison label.
- **States** — up · down · flat ("No change": the delta is exactly zero — a change that only rounds to 0.0% reads "Less than 0.1%" with its direction) · unavailable (no comparison period, or the two periods are in different currencies).
- **Accessibility** — direction in words ("up 4.2% versus last month").
- **Keyboard / ARIA** — —.
- **Interaction patterns** — percent via `Intl` `style: "percent"` from basis points; money via the formatter; the delta is computed by the server from minor units; a comparison against an incomplete period says so in the comparison label ("vs last month to date").
- **Validation** — zero or negative base → "New" / "—", never "∞%"; a percentage above 999% reads "more than 999%".
- **Loading / Error** — owned by caller.
- **Content rules** — always name the comparison period.
- **Do** — one tested util for rounding (half away from zero, one decimal). **Don't** — imply good/bad by direction alone.
- **Dependencies** — C12. **Used by** — S14 S28 S48; inside C45.

### C42 — MaskedAccountNumber

- **Purpose** — Show account/routing numbers masked to the last four; reveal only after step-up (X4); reveals audit-logged (BR5).
- **Inputs** — `accountId`, `last4`, `kind: account | routing`, `mode: inline | field`, `canReveal` (from C63; true only for owner, finance and accountant — R1–R3; false for viewers, R4, and for every internal role, R5–R7).
- **States** — masked (default; only `last4` is in the page at all) · requesting (reveal asked; single-flight) · step-up required (C55; cancelling it returns to masked with focus on the reveal button) · revealed (full value present, copy enabled, countdown to re-mask running) · re-masked (the triggers are: the `REVEAL_TIMEOUT` running out, the member's hide action or Escape, window blur or the tab becoming hidden, a route change, a workspace switch, sign-out, session expiry, re-authentication as a different user, loss of the permission while revealed, and another reveal on the page; on any of them the full value is removed from the DOM and from memory) · forbidden (`canReveal` false — R4 and every internal role R5–R7, none of which may reveal under any circumstance, step-up included: no reveal control exists and the masked form is the whole contract) · error (stays masked, C24 with reference).
- **Accessibility** — read as "ending 4821"; reveal and re-mask announced ("Account number shown. It will be hidden in 30 seconds." / "Account number hidden."); the full number is not placed in a live region — the member reads it by moving to it; a warning is announced 10 seconds before re-mask with a "Keep showing" action that restarts the window (WCAG 2.2.1).
- **Keyboard** — reveal/hide and copy are buttons in order; Escape inside re-masks; focus stays on the reveal/hide button through reveal and re-mask (it is the same element with a changed name).
- **ARIA** — reveal button `aria-pressed`; revealed digits are grouped for reading and exposed as text, not as an image.
- **Interaction patterns** — one revealed number per page; the full value is fetched on demand and never cached (`gcTime: 0`). `REVEAL_TIMEOUT` is 30 s (A6-5), with a warning 10 s before re-mask and an extend action that restarts it. A step-up grant is short-lived (`STEP_UP_GRANT_SECONDS`, 5 minutes, A6-5) and single-purpose: a further reveal inside the grant does not re-prompt, but every reveal is its own audited request recording actor, workspace, account, kind and time — a re-shown value is never served from client memory. Copy puts the full value on the clipboard only while revealed; the product cannot clear the clipboard afterwards and says so once. The value is excluded from print, from the document title, from analytics and from session-replay capture.
- **Validation** — the response must match `last4`; a mismatch is treated as an error and stays masked.
- **Loading** — reveal button loading. **Error** — stays masked with a message; after repeated step-up failure the member is pointed to X5; a rate limit on reveals states the wait.
- **Content rules** — "Operating ••4821" in text form for breadcrumbs.
- **Do** — re-mask on timeout (`REVEAL_TIMEOUT`). **Don't** — put numbers in URLs or logs.
- **Dependencies** — C02 C27 C51 C55. **Used by** — S19 S20 S24; inside C29 C43.

### C43 — AccountRow

- **Purpose** — One account in S15 and S19.
- **Inputs** — `Account`.
- **States** — default · hover · focus · frozen/closed (state label; still opens its history) · balance unavailable (C40 unavailable with the as-of time omitted, never zero) · loading.
- **Accessibility** — one link per row; name includes account name, state when not open, and available balance with currency.
- **Keyboard** — link; C15 rules. **ARIA** — —.
- **Interaction patterns** — activation → P10; hover/focus prefetches the account and first ledger page after `HOVER_INTENT_MS` (150 ms, A6-3), never on touch scroll and never when offline or on a data-saving connection; each row shows its own currency — rows in different currencies are never totalled.
- **Validation** — —. **Loading** — C16. **Error** — missing balance → C40 unavailable.
- **Content rules** — carries at least state, masked number and available balance.
- **Do** — keep closed accounts listed. **Don't** — hide frozen accounts.
- **Dependencies** — C40 C42 C13. **Used by** — S15 S19.

### C44 — TransactionRow

- **Purpose** — One transaction line: ledger, recent activity, search, flagged, counterparty.
- **Inputs** — `Transaction`, `showAccount?`, `runningBalance?`, `href`.
- **States** — default · hover · focus · selected (overlay open on this transaction) · pending (may change or vanish; excluded from running balance) · returned/failed (problem severity in text) · reversed (linked to its reversal in text) · flagged · loading.
- **Accessibility** — status, flag and attachment presence in text; amount read with sign; the row's accessible name is date, counterparty or type, amount, status — in that reading order — so a row is identifiable when read alone.
- **Keyboard** — in C15: Tab to the row link, Enter opens; in C53: roving focus (↑/↓, Enter, J/K with overlay open).
- **ARIA** — row semantics from the parent table; `aria-selected` on the selected row; `aria-rowindex` from C53.
- **Interaction patterns** — activation → `href` (overlay); ⌘/middle-click opens the full page (real link); truncated description available via C19 and in the accessible name; a running balance is shown only when the server supplies it for the current sort and filter — it is never computed from loaded rows; a row whose status changes while in view (pending → posted) updates in place and the section announces it once.
- **Validation** — —. **Loading** — C16 cells. **Error** — —.
- **Content rules** — counterparty or type label ("Fee") — never an invented name; a description supplied by a counterparty is rendered as plain text.
- **Do** — prefetch detail on hover intent. **Don't** — animate rows.
- **Dependencies** — C40 C12 C19. **Used by** — S16 S23.

### C45 — Metric

- **Purpose** — One figure with its label: total cash, money in/out, ledger totals, counterparty totals, admin totals.
- **Inputs** — `label`, value (C40 or C27), `delta?` (C41), `href?`.
- **States** — default · loading · unavailable (the value could not be computed or loaded: C40/C27 unavailable form, never zero) · multi-currency (the underlying accounts are in more than one currency: one value per currency, each labelled, never a single converted total).
- **Accessibility** — label and value read together; if linked, the label is the link.
- **Keyboard** — not focusable unless linked. **ARIA** — —; a value that refreshes in view is not announced unless the member asked for the refresh.
- **Interaction patterns** — one primary value per metric (DP2); totals are computed by the server over the whole filtered set, never over loaded rows; whether pending amounts are included is stated in the label; a balance whose as-of time is older than `BALANCE_STALE_AFTER` (15 minutes), or that is served from cache after a failed request or while offline, is labelled in text as possibly out of date.
- **Validation** — —. **Loading** — value placeholder, label kept. **Error** — owned by the section; never shows retry itself.
- **Content rules** — label states what and as-of where relevant; the as-of time is the server's time for the figure, not the time the page loaded.
- **Do** — keep label wording from constants. **Don't** — show a zero for unavailable.
- **Dependencies** — C40 C27 C41. **Used by** — S14 S22 S33 S48.

### C46 — Filter set

- **Purpose** — The ledger's filters (S21): search, date range, active filters, saved-view menu, export action.
- **Inputs** — filters from the URL, available filter definitions (typed in `lib/<feature>/constants.ts`).
- **States** — no filters · filters active (clear all offered) · collapsed on small screens (all filters still reachable; the count of active filters is stated in text) · invalid params dropped (a notice names what was ignored) · applying (results refetching; filters stay editable).
- **Accessibility** — every control labelled; one announcement of the result count per change (owned by S23), made after results settle.
- **Keyboard** — Tab through controls (no toolbar roving: it contains text inputs); "Clear all" moves focus to the search field; removing one filter follows C47.
- **ARIA** — group labelled "Ledger filters".
- **Interaction patterns** — all state in URL params (via a hook), written with `router.replace` so Back leaves the ledger rather than undoing filters one by one; a change resets the ledger to its first page; filters combine with AND across kinds and OR within one kind; the parameters are those of Phase 3 §11.1, which is the authority: `from`, `to`, comma-list `type`, `direction` (`in` or `out`), comma-list `status`, comma-list `category` (at most 20 values, unknown values dropped), `min`, `max`, `q` (`LEDGER_QUERY_MIN_LENGTH`–`LEDGER_QUERY_MAX_LENGTH`, 2–100 characters), `account` (at most `LEDGER_ACCOUNT_FILTER_MAX`, 50), `flagged`, `attachment` (`yes`), `view`; the URL holds minor units, ISO dates and enum ids, and `q` is the single free-text exception (Phase 1 OD14), never logged or sent to analytics, with an account-number-like query kept out of the URL (C11, rule 18); with no `from` or `to` the ledger reads newest first and pages back by cursor without limit, and `LEDGER_MAX_RANGE_DAYS` (731 days) applies only when both bounds are given — when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared; saved views store the same params and are limited to `SAVED_VIEW_LIMIT` (50) per member with a name of at most `SAVED_VIEW_NAME_MAX` (60) characters, the save action stating the limit when reached; export acts on exactly the filters in the URL.
- **Validation** — same Zod schema that parses the URL; amount minimum ≤ maximum; dates per C48. **Loading** — —. **Error** — invalid params dropped with a notice.
- **Content rules** — filter order per Phase 3 §11.1.
- **Do** — keep filters shareable. **Don't** — hold filter state locally.
- **Dependencies** — C47 C11 C48 C20. **Used by** — S21.

### C47 — Active filter

- **Purpose** — One filter: toggle (Flagged, Has attachment) or valued (Status: Pending, Amount ≥ £1,000) with remove.
- **Inputs** — definition, value, `onRemove`.
- **States** — idle (offered, not applied) · active (applied; counts toward the result) · focus · disabled (rule 9 — for example a filter that cannot combine with the current selection, with the reason).
- **Accessibility** — name includes the filter and value ("Remove filter: Status Pending").
- **Keyboard** — Enter/Space toggle or edit; Backspace/Delete removes a focused valued filter; after removal focus moves to the next active filter, else the previous, else the control that adds filters (rule 11).
- **ARIA** — toggles use `aria-pressed`; removal is announced through the result count, not separately.
- **Interaction patterns** — values formatted for display (C40 for amounts); stored as minor units in the URL; each toggle has its own parameter (Flagged is `flagged=true`, Has attachment is `attachment=yes`) and each valued filter its own (`direction`, `category`, `status`, `type`, `min`, `max`); amount entry is parsed by string in the account's currency and rejects excess fraction digits.
- **Validation** — the URL schema. **Loading / Error** — —.
- **Content rules** — labels from constants.
- **Do** — make removal one action. **Don't** — rely on an "×" glyph without a name.
- **Dependencies** — C02. **Used by** — S21 S51.

### C48 — DateRangeField

- **Purpose** — Choose a period with presets (This month, Last month, Last 90 days, Year to date, Custom) and native date inputs.
- **Inputs** — `from`, `to`, `min` (account open date), `max` (today), presets (enum).
- **States** — preset selected (dates derived; the preset id, not the dates, is the stored value, so a shared link to "This month" stays this month) · custom (both dates chosen by the member) · incomplete (one date missing: nothing is applied yet) · invalid (from after to, out of bounds, or longer than the owner's maximum range) · disabled.
- **Accessibility** — two labelled native date inputs in a group named for the period; preset choice labelled; the expected format is stated as a hint where the browser offers no picker.
- **Keyboard** — native date entry; choosing "Custom" moves focus to the start date; choosing any other preset leaves focus on the preset control.
- **ARIA** — `aria-invalid` on the offending input with the error in C10; the applied period is announced with the result count.
- **Interaction patterns** — presets computed with `date-fns` in `lib/utils/date-range.ts`; value written to the URL by the owner; posting dates never shifted by time zone. Both ends are inclusive calendar dates. "Today" and every preset boundary are taken in the workspace's time zone supplied by the backend (UTC when unset; internal `(admin)` sections always use UTC), never the browser's (Q6-9), so two members in different zones get the same rows; month presets end on the month's real last day, including 29 February; a preset reaching before `min` is clipped to `min` and says so. Editing either date of a preset turns it into Custom. Owners may cap the span (`EXPORT_MAX_RANGE_DAYS`, 366 days, A6-14, for S31; `LEDGER_MAX_RANGE_DAYS`, 731 days, for S21, where the cap applies only when both dates are given: an open-ended ledger period is allowed and pages back by cursor without limit).
- **Validation** — `from ≤ to`, within bounds, real calendar date (Zod refine); runs on blur of either input once both are filled and on submit.
- **Loading** — —. **Error** — via C10, naming the bound that was broken ("Choose a start date on or after 3 March 2024, when this account opened.").
- **Content rules** — dates as `yyyy-MM-dd` on the wire.
- **Do** — offer "Custom". **Don't** — build a custom calendar when native inputs suffice.
- **Dependencies** — C04 C10. **Used by** — S21 S28 S31.

### C49 — File upload

- **Purpose** — Upload verification documents (S12), attachments (S26), message attachments (S37).
- **Inputs** — accepted MIME types and max size (constants), `onFiles`, multiple?.
- **States** — idle · dragging (pointer only) · queued (accepted, waiting for one of 3 concurrent slots) · uploading (per-file C26; cancellable) · scanning (bytes received; the server is checking the file — not yet usable) · done · rejected (per file, with reason: wrong type, too large, empty, too many, duplicate, failed check) · cancelled (by the member; the partial upload is discarded server-side) · failed (network or server; Retry offered) · disabled (rule 9: offline, limit reached, or the case is read-only).
- **Accessibility** — a labelled `<input type="file">` is always the primary path; drag-and-drop is an addition; results announced once per file ("passport.pdf uploaded." / "scan.heic was not added. Use PDF, JPEG or PNG."), and once in summary for a batch of more than 3.
- **Keyboard** — Enter/Space open the picker; file list is a list with remove buttons; cancel and Retry are buttons on the file's entry; after remove or cancel, rule 11 sets focus; after the picker closes, focus returns to the control that opened it.
- **ARIA** — progress `role="progressbar"` named with the file name; the list is a polite region for additions and removals.
- **Interaction patterns** — the upload control only emits files; hooks `use-upload-document` / `use-upload-attachment` upload; camera capture on phones where appropriate. Limits (A6-6; `UPLOAD_MAX_BYTES`, `UPLOAD_MAX_FILES`): PDF, JPEG or PNG; 10 MB per file; 10 files per verification document kind and 20 per case, 10 per transaction, 5 per message; an avatar image is at most 2 MB. Type is checked from the file's content signature as well as its extension, and the server check is the authority. Files upload straight to the signed target; a signed target that expires mid-upload is re-requested once without losing the file. Removing an uploaded file asks first when it has been submitted with a case. A session expiry mid-upload follows rule 16: the affected files stay listed as failed and the member restarts them after re-authenticating; nothing restarts by itself. Leaving the view while files are uploading asks before discarding them. File names are shown as given, as plain text, and are never used to build a path.
- **Validation** — type, size, emptiness and count checked before upload, naming the limit ("statement.pdf is 14 MB. The limit is 10 MB."); a file identical to one already listed is reported as a duplicate rather than uploaded twice.
- **Loading** — per-file progress; a file with no progress for 60 s is marked failed with Retry (A6-9).
- **Error** — per-file reason with Retry; other files unaffected; a file the server rejects after scanning says so without describing the finding.
- **Content rules** — state accepted formats, size and count before selection.
- **Do** — lazy-load. **Don't** — require dragging (WCAG 2.5.7).
- **Dependencies** — C26 C02. **Used by** — S12 S26 S37.

### C50 — Stepper

- **Purpose** — Progress through verification steps (Business → Owners → Documents → Review).
- **Inputs** — steps with states derived from the case.
- **States** — complete (the server holds valid data for the step; may be reopened) · current · upcoming (not yet reachable) · attention (`needs_info`: the reviewer asked for something on this step; reachable regardless of order) · locked (the case is submitted or decided: every step is readable, none editable).
- **Accessibility** — ordered list; each state in the step's name ("Step 2 of 4, Beneficial owners, needs attention").
- **Keyboard** — completed, current and attention steps are buttons; upcoming are not focusable; choosing a step moves focus to that step's heading.
- **ARIA** — `aria-current="step"`.
- **Interaction patterns** — state from `use-verification-case`, not local progress; read-only in S52; leaving a step with unsaved input asks before discarding or saves it as a draft where the owner supports drafts; if the case changes elsewhere (another owner, a reviewer), the steps refresh and the change is announced once.
- **Validation** — —. **Loading** — placeholders. **Error** — owned by S09.
- **Content rules** — "Step 2 of 4 · Beneficial owners".
- **Do** — reflect server state. **Don't** — allow skipping invalid steps.
- **Dependencies** — C13. **Used by** — S09 S52.

### C51 — CopyButton

- **Purpose** — Copy a reference, share link, amount or revealed number.
- **Inputs** — `value` (plain canonical), `label`.
- **States** — idle · copied (for 2 seconds after a successful write, then idle) · failed (the clipboard refused or is unavailable).
- **Accessibility** — result announced ("Link copied"); the button's name does not change while copied, so focus is not re-read.
- **Keyboard** — button; focus stays on it. **ARIA** — polite live sibling.
- **Interaction patterns** — `navigator.clipboard.writeText` in a secure context; share links from route constants and the origin, containing an opaque ID only and no filter or query text that could identify an account; repeated activation simply copies again.
- **Validation** — —. **Loading** — —. **Error** — permission denied → "Copy failed — select and copy manually" with the value selectable.
- **Content rules** — label names what is copied.
- **Do** — copy canonical values (Q-219). **Don't** — copy a masked value while claiming the full number.
- **Dependencies** — C02 C19 C24. **Used by** — S20 S24; inside C42.

### C52 — ConfirmDialog

- **Purpose** — Confirm a destructive, irreversible or sensitive action (remove owner, delete view, revoke session, delete user, decide a case, confirm a transfer).
- **Inputs** — `title`, `consequence` (what will happen, in words), `confirmLabel`, `typedConfirmation?`, `onConfirm`.
- **States** — open (confirm unavailable until any typed confirmation matches and any required reason is given, with what is missing stated) · pending (single-flight; cancel unavailable once the request is sent) · error (stated in the dialog, stays open) · conflict (the object changed or was already removed by someone else: says so, offers to close, does not retry blindly) · not confirmed (rule 15) · confirmed (closes, C24 success).
- **Accessibility** — initial focus on the least destructive action; the consequence is read on open.
- **Keyboard** — Escape cancels; Enter never confirms unless focus is on the confirm button; after confirm, focus follows rule 11 (the invoking control usually no longer exists).
- **ARIA** — `role="alertdialog"` for destructive intent, `aria-describedby` the consequence.
- **Interaction patterns** — only opened by explicit user action; never chained; reasons required where the domain requires (S52). Actions that change who can access money data or that decide a case (remove owner, delete user, decide a case, and a transfer when money movement exists) require a valid step-up grant (C55) before the request is sent; a grant is single purpose, and one issued for any other purpose never authorises money movement: each transfer or payment confirmation asks for its own grant. The request carries the version of the object the member saw, so a stale confirmation is refused (409) rather than applied. The backend records the action with actor, object, reason and time (rule 23).
- **Validation** — typed word compared exactly after trimming, case-sensitive; reason length per C05.
- **Loading** — confirm loading. **Error** — stated in the dialog with a reference.
- **Content rules** — names the object and the effect ("Ada will lose access to 3 accounts"); says whether it can be undone; the confirm label repeats the verb ("Remove owner"), never "OK" or "Yes".
- **Do** — offer the reversible option first where one exists (suspend before delete). **Don't** — use for routine saves.
- **Dependencies** — C21 C01. **Used by** — S09 S10 S11 S26 S27 S39 S43–S45 S50 S52.

### C53 — DataTable

- **Purpose** — Virtualized, cursor-paginated table for large sets: ledgers (up to 5 million rows) and the platform user directory.
- **Inputs** — columns, infinite query result, row renderer (C44), `onRowOpen`, `activeRowId`, sort from URL.
- **States** — initial loading · populated · fetching next page · end · empty · filtered-empty · refetching (rows kept, `aria-busy`) · error first page (nothing to show; C33) · error next page (loaded rows kept; a retry row follows them) · window trimmed (earlier pages were released to honour `maxPages`; they are re-fetched when the member moves back) · new activity available (rows posted since load: stated with a control to load them; rows are never inserted while the member is working in the table without that request).
- **Accessibility** — table semantics with `aria-rowcount` (server total or -1) and `aria-rowindex`; caption summarises filters, sort and the server total; the focused row is always rendered, even when scrolled out of the window, so focus is never dropped by virtualisation.
- **Keyboard** — one Tab stop (roving focus on the active row); ↑/↓, PageUp/PageDown (one viewport of rows), Home/End (Home returns to the first row, re-fetching it if trimmed; End moves to the last loaded row and fetches more), Enter opens, J/K with overlay open; sort headers reachable before the body; in-row controls are reached with →/← from the active row, not with Tab; Tab leaves the table to C25.
- **ARIA** — `aria-sort`; `aria-busy` while refetching; page loads and filter results are announced once by S23 ("Showing 1 to 100 of 10,000+ transactions." — the total is exact only up to `COUNT_EXACT_LIMIT`, 10,000); row moves are not announced beyond the row itself.
- **Interaction patterns** — only visible rows plus an overscan of 10 exist; `maxPages` (`LEDGER_MAX_PAGES`, 10 pages of `LEDGER_PAGE_SIZE`, A6-10) bounds memory; returning from detail restores offset and active row (snapshot in `sessionStorage` keyed by the view's query key, holding row IDs and offsets only — no amounts or numbers); sentinel loading plus C25. Sort, filter and totals are always performed by the server over the full set; the client never sorts, filters, sums or counts loaded rows. Order is stable (posting date, then a tie-breaking ID), so paging never duplicates or skips a row. There is no "select all 5 million": selection, where an owner offers it, is limited to loaded rows and stated as such, and bulk output over the full set goes through the export job (S31). Browser find-in-page cannot see unrendered rows; the ledger search is the stated equivalent.
- **Validation** — —. **Loading** — C16 rows. **Error** — C33 / retry row.
- **Content rules** — essential columns named by the section.
- **Do** — fixed row size for constant estimates. **Don't** — count loaded rows for totals.
- **Dependencies** — LD2, C15 C16 C25 C44. **Used by** — S23 S49.

### C54 — Colour-scheme preference

- **Purpose** — Let a member choose among the colour schemes the build offers, if it offers more than one. Which schemes exist and what they look like is decided at build (OD7 withdrawn).
- **Inputs** — available schemes, current choice.
- **States** — current · saving (already applied; persisting) · not saved (error: applied for this session only) · single scheme (the build offers one: the control is not rendered).
- **Accessibility** — choice named in text; current state announced once on change ("Colour scheme: Dark.").
- **Keyboard** — button cycles or menu with `menuitemradio`; focus stays on the control. **ARIA** — `aria-checked` in menu form.
- **Interaction patterns** — applies immediately without reload; persisted server-readable (cookie via Server Action) so the next request renders the chosen scheme without a flash; the cookie holds the scheme id only and the preference is per browser, shared across the member's tabs.
- **Validation** — unknown or tampered value → the build's default. **Loading** — —. **Error** — applies for the session; C24 says it was not saved.
- **Content rules** — scheme names are descriptive ("Light", "Dark", "Match system" if offered).
- **Do** — avoid a flash on load. **Don't** — require reload.
- **Dependencies** — FD03. **Used by** — S01; inside C37.

### C55 — SessionExpiryDialog

- **Purpose** — X4: warn before idle timeout with "Stay signed in"; after expiry, re-authenticate without leaving the page; host step-up for sensitive actions (C42, password, two-step, revoke-all).
- **Inputs** — expiry from the server, mode (warning, expired, step-up).
- **States** — warning (opens `SESSION_WARNING_LEAD`, 2 minutes, before idle expiry, A6-8; countdown from the server's expiry, not a client timer started at load) · extending (single-flight) · expired (the session ended: sensitive content behind it is inert and hidden from assistive technology; numbers revealed by C42 are re-masked) · absolute limit reached (the session has reached its absolute lifetime: there is no extension — "Stay signed in" is not offered, activity does not prolong it, and the warning says so and offers only re-authentication) · re-authenticating · re-authenticated as a different user (the page's data, drafts and revealed values are discarded and that user's default destination loads) · step-up (asks for password or two-step for one named action) · step-up error (wrong secret: remaining attempts stated) · locked (5 failed step-up attempts within 15 minutes lock step-up for 15 minutes: the action stays undone, no further attempt is accepted until the lock ends, the wait is stated, and the member is pointed to X5; the same threshold and lock apply to sign-in).
- **Accessibility** — countdown announced sparingly (not every second): on open, at 1 minute, at 30 seconds and at 10 seconds; the dialog names the action it is protecting in step-up mode; re-authentication accepts paste, password managers and passkeys and sets no puzzle (WCAG 3.3.8).
- **Keyboard** — initial focus on the primary action ("Stay signed in" in warning; the first field in expired and step-up); Escape in warning mode does nothing, so a stray key press neither extends nor ends the session; Escape cancels step-up and returns focus to the control that asked; expired mode has no dismissal other than re-authenticating or signing out. On success focus returns to the element that had it before the dialog opened.
- **ARIA** — `role="alertdialog"` in warning/expired; `role="dialog"` for step-up; the remaining time is a `role="timer"` that is not itself live.
- **Interaction patterns** — mounted once per shell; a 401 opens it instead of redirecting; expiry broadcast across tabs; re-auth never navigates away, so drafts survive in the open tab's memory; a write interrupted by expiry or step-up is not replayed — the member re-submits it (rule 16); after repeated step-up failure points to X5. It is the one dialog allowed to stack over any other overlay. Activity in any tab counts as activity for the session; extending in one tab dismisses the warning in all. Re-authenticating as a different user than the one who held the page discards the page's data and drafts and loads that user's default destination. A step-up grant lasts `STEP_UP_GRANT_SECONDS` (5 minutes, A6-5), covers only the kind of action it was given for and is never extended by ordinary activity. A grant issued for any other purpose never authorises money movement; each transfer or payment confirmation asks for its own grant. Extend, expiry, re-authentication and step-up outcomes are recorded by the backend (rule 23). Timings follow OD2.
- **Validation** — re-auth password via `loginSchema.pick`. **Loading** — submit loading. **Error** — stated in the dialog; remaining attempts; a network failure while extending says the session could not be extended and keeps the true countdown.
- **Content rules** — says work is kept; never shows the email of a different user than the session's.
- **Do** — give warning time (WCAG 2.2.1). **Don't** — hard-redirect on 401.
- **Dependencies** — C21, C34 verify variant, OD2. **Used by** — `(app)` and `(admin)` layouts; C42.

## Wrappers

### C56 — Entrance reveal

- **Purpose** — Behavioural obligations of any entrance effect on public pages (1.0.0: a once-only reveal for marketing surfaces). Whether any entrance effect is used is decided at build.
- **Inputs** — children.
- **States** — before · revealed (once; never replays on scroll back, re-render or route return) · reduced motion (content shown without transform) · no script (content shown as authored).
- **Accessibility** — content is in the document and readable before and without the effect; nothing waits on JavaScript to become readable; content is in the accessibility tree, focusable and findable by in-page search in the *before* state.
- **Keyboard / ARIA** — —; a focusable element inside is reachable and shown at once when focused, whatever the effect's progress.
- **Interaction patterns** — never in `(app)`/`(admin)` data views (rows re-render on filter); reduced motion honoured via `MotionConfig reducedMotion="user"` (C61); the effect never delays a control becoming usable and never moves content after the member has started interacting with it.
- **Validation / Loading / Error** — —.
- **Content rules** — never hides what the member came to the page for behind a reveal.
- **Do** — play once. **Don't** — stagger list items that re-render.
- **Dependencies** — motion. **Used by** — P01. **Built** — `components/wrappers/motion-wrapper.tsx` (host).

### C57 — QueryBoundary

- **Purpose** — The single switch every data section uses to render exactly one of loading, error, empty, populated from a TanStack Query result.
- **Inputs** — `query`, `isEmpty(data)`, `skeleton`, `empty`, `children(data)`.
- **States** — loading (no data yet) · error (no data and the request failed) · empty (`isEmpty(data)` true) · populated · populated + refetching (data kept and usable; `aria-busy`) · populated + background error (children + one C24; the data is marked with its as-of time so it is not mistaken for current) · populated + stale offline (rule 17).
- **Accessibility** — never moves focus on a state switch; sets `aria-busy` while loading; one polite announcement when loading ends in content, empty or error — refetches that change nothing are silent.
- **Keyboard** — only C33's Retry. **ARIA** — `aria-busy`.
- **Interaction patterns** — Retry refetches that query only; a new key shows the placeholder only when no previous data exists (sections use `keepPreviousData`); previous data is never kept across a workspace switch or a sign-in as another user; data that fails its Zod schema is an error (reported with a reference through the services logging path), never rendered partially.
- **Validation** — —. **Loading** — C16 after `LOADING_DELAY_MS`. **Error** — C33; a 401 is not an error state here — it goes to C55 (rule 16); a 403 renders the C32 not-permitted state; a 404 renders the owner's not-found state.
- **Content rules** — empty and error copy from constants.
- **Do** — one per section. **Don't** — write per-section `if (isPending)` ladders.
- **Dependencies** — C16 C32 C33. **Used by** — every data section.

### C58 — SectionErrorBoundary

- **Purpose** — Catch render errors in one section so the page survives (P35 covers route-level failures).
- **Inputs** — `skeleton` (renders `<Suspense>` inside), `resetKeys`.
- **States** — normal · errored (the section's children threw: only that section is replaced) · reset (Retry, a route change or a `resetKeys` change re-renders the children) · errored again (the same error recurs after 2 resets: Retry stays, and the message adds the support path with the reference).
- **Accessibility** — fallback is C33 with Retry; if focus was inside the failed section it moves to the fallback's message.
- **Keyboard** — Retry. **ARIA** — —.
- **Interaction patterns** — the one class component (React requirement); reports through the services logging path, never `console`; resets on route or query-key change. The report carries the reference shown to the member, the route pattern (not the URL with IDs), the section ID and the build version, and no account data, amounts or user input.
- **Validation / Loading** — —. **Error** — it is the render-error state.
- **Content rules** — generic message plus reference.
- **Do** — wrap each section at the page. **Don't** — wrap the whole page in one boundary.
- **Dependencies** — C33. **Used by** — every page.

### C59 — PermissionGate

- **Purpose** — Show, hide or explain UI by the member's permissions. A presentation gate, not a security boundary.
- **Inputs** — `permission` id, `mode: hide | explain`, children, `fallback?`.
- **States** — pending (role loading: children not rendered) · allowed · denied-hidden (nothing rendered, nothing in the accessibility tree, no reserved tab stop) · denied-explained (text naming who can grant access) · revoked in use (the permission was removed while the member was using the gated UI: unsent input is kept readable, the action is withdrawn and the explanation is announced once).
- **Accessibility** — explained denials are text in reading order, naming who can grant access by role ("Ask a workspace owner"), never by another member's email.
- **Keyboard** — —. **ARIA** — —.
- **Interaction patterns** — reads `can()` from C63 over the permission matrix; a role change mid-session updates gated UI without reload; the backend enforces every permission. When the backend refuses (403) something the gate allowed, the gate's data is stale: the role is refetched, the UI re-gated and the member told the action is no longer available to them — the refusal is never shown as a generic failure. Customer roles R1–R4 and internal roles R5–R7 are gated by the same mechanism; R5–R7 collapse to `ADMIN` until finer roles exist (A9).
- **Validation** — unknown permission ids fail type-checking. **Loading** — renders nothing (or a placeholder) while pending. **Error** — role unavailable → denied.
- **Content rules** — permission copy from `lib/data/empty-states.ts`.
- **Do** — hide actions a role cannot use. **Don't** — treat it as enforcement.
- **Dependencies** — C63. **Used by** — S26 S31 S35 S38 S40; P08 variants; many actions.

### C60 — Exit transition

- **Purpose** — Keep content present long enough for dialogs, overlays, messages and removed rows to leave cleanly (1.0.0 "Presence"). Whether any exit effect is used is decided at build.
- **Inputs** — `present`, children.
- **States** — absent · entering · present · leaving (content held, inert: it accepts no input and holds no focus) · reduced motion (leaves at once).
- **Accessibility** — focus management belongs to consumers; removed content leaves the accessibility tree immediately.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — reopening during leave shows the new content immediately; leaving content that held sensitive values (C42 revealed, C22 detail) drops those values at the start of the leave, not the end.
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
- **Interaction patterns** — one `QueryClient` per browser session; stale time from `STALE_TIME` (H-23) by resource tier (Phase 5: `live` 15 s for balances, pending and counts; `standard` 60 s; `slow` 5 minutes; `static` never), with cached data kept 5 minutes after its last use (`GC_TIME_MS`; 0 for a revealed number, C42); `QueryCache.onError` sends background errors for queries with data to C62 once per key, routes 401 to C55 and step-up to X4; no retry on 4xx; backoff for reads (`QUERY_RETRY_LIMIT`, 2 retries after the first attempt, 1–8 s apart, and a server retry-after is obeyed); mutations never auto-retry. Refetch on window focus and on reconnect for `live` data. The cache is memory-only — never persisted to browser storage — and is cleared on sign-out, on workspace switch and when a different user re-authenticates. Each tab has its own cache; sign-out, expiry and workspace switch are broadcast between tabs.
- **Validation / Loading / Error** — as above.
- **Content rules** — —.
- **Do** — mount once in `app/layout.tsx`. **Don't** — create a client per render.
- **Dependencies** — Query, motion. **Built** — `components/providers/provider.tsx` (host).

### C62 — Message provider

- **Purpose** — Own the transient message queue and live region; expose `show`/`dismiss` via `use-toast`.
- **Inputs** — —.
- **States** — empty · showing (≤ 3 at once, A6-2) · queued (further messages wait in arrival order, errors ahead of successes; beyond 20 queued, the oldest queued success is dropped and never an error).
- **Accessibility** — one polite live region, present in the document from first render so announcements are not missed; no focus stealing.
- **Keyboard** — messages reachable in reading order. **ARIA** — labelled region ("Notifications from Ledgerline" wording from constants).
- **Interaction patterns** — `useReducer` queue; ids via `nanoid`; timers pause on hover or focus and while the window is not visible; duplicate keys collapse into one message whose text states the count when it matters; the queue is emptied on sign-out and workspace switch so a message about one workspace never appears in another.
- **Validation / Loading / Error** — —.
- **Content rules** — —.
- **Do** — mount in the root. **Don't** — render C24 directly.
- **Dependencies** — C24 C60. **Used by** — root layout.

### C63 — WorkspaceProvider

- **Purpose** — Hold the current workspace and the member's role; expose `can(permission)` and `switchWorkspace`. Stated reason for a provider: navigation, C59 and most sections read it; prop-threading would couple unrelated components. It is context over server data, not a global store.
- **Inputs** — server-loaded workspace and role.
- **States** — loading (`can()` answers false for everything) · ready · switching (`can()` answers false until the new role is known) · error (no role; S01 shows the error) · no memberships (the member belongs to no workspace: only the routes that need none are offered).
- **Accessibility / Keyboard / ARIA** — —.
- **Interaction patterns** — workspace id persists in an httpOnly cookie via Server Action; every workspace-scoped key is prefixed with it; a workspace the member no longer belongs to falls back to the first membership with a C24. The role is refetched on window focus and after any 403, so a role changed or removed by an owner takes effect in an open session within one `slow` stale window without reload. `can()` fails closed: an unknown role, an unknown permission or a failed load is "not allowed". The cookie is validated against memberships on every request by the server; the client value is never trusted for access.
- **Validation / Loading / Error** — as above.
- **Content rules** — —.
- **Do** — mount in the `(workspace)` layout only. **Don't** — hold server state that changes during the session.
- **Dependencies** — `use-workspace`, `use-me`. **Used by** — S01 C36 C59 sections.

## Public site contracts (added 2.0.0)

From the built home page. Each is recorded as found.

### C64 — Disclosure

- **Purpose** — Show and hide an answer under its question (S63).
- **Inputs** — `item {id, question, answer}`, `open`, `onToggle`.
- **States** — collapsed (the answer is not exposed to assistive technology or tab order, but is found by in-page search, which expands it — `hidden="until-found"` where supported) · expanded · focus.
- **Accessibility** — the question is a button inside a heading, so questions are reachable by heading navigation; the answer region is identified.
- **Keyboard** — Enter/Space toggle (native button); focus stays on the question; Tab moves into an expanded answer's links.
- **ARIA** — `aria-expanded`, `aria-controls` (built: `faq-{id}`).
- **Interaction patterns** — one item's state does not force others closed unless the build chooses so; a link to a question's fragment opens that question.
- **Validation / Loading / Error** — —.
- **Content rules** — answers are complete sentences; the first states the design-study status while it applies.
- **Do** — keep collapsed answers findable when expanded. **Don't** — hide essential terms only in collapsed text.
- **Dependencies** — —. **Used by** — S63. **Built** — `components/ledgerline/faq-row.tsx`.

### C65 — Small-screen navigation toggle

- **Purpose** — Reveal and hide the public navigation on small screens (S55).
- **Inputs** — `open`, controlled list id.
- **States** — closed (the navigation's links are out of tab order and the accessibility tree) · open.
- **Accessibility** — accessible name changes with state ("Open menu" / "Close menu"); choosing a link closes the menu and focus follows the navigation.
- **Keyboard** — Enter/Space toggle; on open, focus stays on the toggle and the links follow it in tab order; Escape closes and returns focus to the toggle (to confirm in build review; not verified); when the viewport grows so the toggle no longer applies, the menu closes and focus moves to the equivalent link.
- **ARIA** — `aria-expanded`, `aria-controls`.
- **Interaction patterns** — the menu holds the same links as the full navigation plus the start action.
- **Validation / Loading / Error** — —.
- **Content rules** — labels from `LEDGER_BRAND.menu`.
- **Do** — keep link order identical to the full navigation. **Don't** — trap focus without an exit.
- **Dependencies** — —. **Used by** — S55. **Built** — `components/ledgerline/ledger-nav.tsx`.

### C66 — Sample interaction control

- **Purpose** — Let a visitor try a sample behaviour that changes nothing real: the approval sample (S58) and card-control switches (S59).
- **Inputs** — sample state (local only), labels.
- **States** — initial · changed (the visitor acted; held in memory only) · reset (back to initial, by the reset action or by reload).
- **Accessibility** — the sample is labelled as a sample in text that assistive technology meets before the controls; the result is announced (S58 uses a live sentence); switches use `role="switch"` with `aria-checked` and a label reference.
- **Keyboard** — native buttons; Space/Enter toggle; focus stays on the activated control; after reset, focus stays on the reset control.
- **ARIA** — as above.
- **Interaction patterns** — no network, no persistence; a reset returns to the initial state. Any figure, name or amount in a sample is labelled sample data (BR10, OD9 facet d) and goes through C40 like real money.
- **Validation / Loading / Error** — —.
- **Content rules** — must say that nothing real happens ("Interactive sample. No payment is made.").
- **Do** — keep samples clearly labelled. **Don't** — reuse for real money actions (those are C52 + S44).
- **Dependencies** — —. **Used by** — S58 S59 (OD9 a, b). **Built** — `approval-card.tsx`, `card-controls.tsx`.

### C67 — Enquiry form

- **Purpose** — Capture a work email for X11 (S64).
- **Inputs** — `contactSchema` (`email`), copy `CTA_COPY`.
- **States** — idle · invalid (rule 14) · sent (design-study: "nothing was sent") · submitting (single-flight) and failed (once an intake exists; the email is kept) · already received (once an intake exists: a repeat submission of the same address gets the same confirmation as a first one, and creates no second record).
- **Accessibility** — visible label bound by `useId`; `aria-invalid` and `aria-describedby` on error; result in a live paragraph; on error focus returns to the field; on success focus moves to the result.
- **Keyboard** — Enter submits. **ARIA** — as above.
- **Interaction patterns** — client validation; no network today; email never in a URL, analytics event or client log (rule 18). Once an intake exists: the server re-validates, the request carries an idempotency key, abuse is limited by the server (the form states the wait on a 429), and no hidden puzzle is set for people (WCAG 3.3.8).
- **Validation** — `z.email` with `CTA_COPY.invalid`; trimmed; at most 254 characters; runs on submit, then per rule 14.
- **Loading** — none today. **Error** — field error; later transport error with Retry.
- **Content rules** — states what happens next and what is stored (Q6).
- **Do** — `type="email"`, `autocomplete="email"`. **Don't** — imply sign-up happened (OD10).
- **Dependencies** — `lib/validations/contact.ts`. **Used by** — S64. **Built** — `components/ledgerline/contact-section.tsx`.

### C68 — Text reveal

- **Purpose** — Behavioural obligations of the word-by-word reveal used on public headings. Whether it is used is a build decision.
- **Inputs** — text.
- **States** — before · revealed (once) · reduced motion · no script (text shown as authored).
- **Accessibility** — the full text is exposed to assistive technology as one phrase (not word fragments) from the start; it can be selected, copied, translated by the browser and found by in-page search as one string.
- **Keyboard / ARIA** — —.
- **Interaction patterns** — reduced motion shows the text at once; word splitting follows the locale's segmentation (`Intl.Segmenter`), so languages without spaces and right-to-left text keep their order.
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
| Q6-9 | Which time zone defines "today", preset boundaries (C48), chart buckets (C30) and displayed instants (C27) for a team spread across zones? Owner: maintainer, with the backend (depends on OD1, OD5). | Member-facing dates use the workspace's time zone, supplied by the backend (UTC when unset); internal `(admin)` sections use UTC; never the browser's. Posting dates stay calendar dates as sent. |
| Q6-10 | Does the backend accept an idempotency key on every write (annotations, uploads, invitations, case decisions) and return the original result on a repeat (rule 10)? Owner: backend maintainer. | The client sends the key on every write; until the backend honours it, single-flight and the re-read in rule 15 are the only duplicate protection. |
| Q6-11 | In what shape does the backend report field-level validation errors, so rule 14 can map them to fields? Owner: backend maintainer (contract layer). | Field path plus a code, mapped to copy in constants; anything else is a form-level message with a reference. |

## Assumptions

- **A3** — Domain input types are contract `z.infer` types re-exported from `lib/types/<domain>.ts`.
- **A4** — Users may belong to several workspaces (C36, C63).
- **A6** — One locale; everything through `Intl` / `date-fns`.
- **A7** — *Withdrawn (visual register).*
- **A9** — Platform permissions collapse to `ADMIN` until finer roles exist.
- Phase-local: constants referenced here (`DEFAULT_LOCALE`, `REVEAL_TIMEOUT`, `SECTION_LOAD_FAILED`, `TRANSACTION_STATUS_LABEL`, shortcut constants, MIME constants) are created in `lib/constants.ts` or feature constants (Phase 7).

Phase-local numbers (A6-n). Each is a product decision recorded as the specified value; the owner may change any of them, in the named constant, without changing a contract.

- **A6-1** — `LOADING_DELAY_MS` is 200 ms (C16, C57).
- **A6-2** — `TOAST_DURATION_MS` is 6 s for a success message, 10 s when it carries an action; errors never time out; at most 3 messages show at once and at most 20 wait (C24, C62).
- **A6-3** — `HOVER_INTENT_MS` is 150 ms (C43, C44); a tooltip shows after 500 ms of pointer rest (C19); type-ahead buffers reset after 500 ms (C20).
- **A6-4** — `SEARCH_DEBOUNCE_MS` is 300 ms; `LEDGER_QUERY_MAX_LENGTH` is 100 characters; server search needs at least `LEDGER_QUERY_MIN_LENGTH` (2) characters and is given `SEARCH_TIMEOUT_MS` (5 s); matches made on the device may start at 1 character (C11, C38).
- **A6-5** — `REVEAL_TIMEOUT` is 30 s with a warning 10 s before re-mask and an extend action; a step-up grant (`STEP_UP_GRANT_SECONDS`) lasts 5 minutes, covers one kind of action, and a grant issued for any other purpose never authorises money movement — each transfer or payment confirmation asks for its own; `AUTH_MAX_ATTEMPTS` (5) failed sign-in or step-up attempts in 15 minutes lock for 15 minutes (C42, C55). Subject to OD2.
- **A6-6** — Uploads accept PDF, JPEG and PNG, 10 MB per file (`UPLOAD_MAX_BYTES`); 10 files per verification document kind and 20 per case, 10 per transaction, 5 per message (`UPLOAD_MAX_FILES`); an avatar is at most `AVATAR_MAX_BYTES` (2 MB); 3 upload at a time (C49). Subject to OD1.
- **A6-7** — Text limits: transaction note `NOTE_MAX_LENGTH` 2,000 characters; `MESSAGE_MAX_LENGTH` 5,000; decision reason `DECISION_NOTE_MIN` 10 to 2,000; the counter is announced from 90% (C05).
- **A6-8** — The session warning opens `SESSION_WARNING_LEAD` (2 minutes) before idle expiry and is announced on open, at 1 minute, 30 seconds and 10 seconds (C55). Subject to OD2.
- **A6-9** — `REQUEST_TIMEOUT_MS` is 15 s for reads, `MUTATION_TIMEOUT_MS` 30 s for writes; an upload with no progress for 60 s is failed; the slow-request notice appears after `SLOW_REQUEST_MS` (10 s); reads retry twice (`QUERY_RETRY_LIMIT`) and writes never; freshness tiers `STALE_TIME` are `live` 15 s, `standard` 60 s, `slow` 5 minutes and `static` never, with a 5-minute cache retention (`GC_TIME_MS`) (rule 15, C49, C61).
- **A6-10** — C15 serves at most 200 rows; C53 keeps an overscan of 10 rows and at most `LEDGER_MAX_PAGES` (10) pages of `LEDGER_PAGE_SIZE` (50) in memory; a count is exact up to `COUNT_EXACT_LIMIT` (10,000).
- **A6-11** — The unread count polls every 60 s (`NOTIFICATION_POLL_INTERVAL`) and reads "99+" above 99 (C39).
- **A6-12** — Copy may grow to 140% of its source length in another language without loss (rule 21).
- **A6-13** — Palette Recent holds 8 entries, cleared on sign-out; each result group shows at most 5 (C38). Breadcrumbs collapse beyond 4 levels (C29).
- **A6-14** — `EXPORT_MAX_RANGE_DAYS` is 366 (C48 in S31); `LEDGER_MAX_RANGE_DAYS` is 731, applied only when both bounds are given (C48 in S21); the account filter holds at most `LEDGER_ACCOUNT_FILTER_MAX` (50) accounts and the category filter at most 20 values; the workspace switcher becomes searchable beyond 10 memberships (C36); a member keeps at most `SAVED_VIEW_LIMIT` (50) saved views, each named in at most `SAVED_VIEW_NAME_MAX` (60) characters (C46).
- **A6-15** — A chart series carries at most 366 points; beyond that the server aggregates (C30).

## Changes in this version

- **Retained:** C01–C63 (IDs, purpose, inputs, states, keyboard, ARIA, interaction, validation, loading, error, content rules, do/don't, dependencies, used-by); Q6-1–Q6-3, Q6-6, Q6-7.
- **Changed:** file renamed from `phase-6-component-library.md` to `phase-6-interaction-contracts.md` and reframed as behaviour-only contracts; 19 contracts renamed (table above); every **Variants**, **Styling Approach**, **Tokens**, **Responsive**, **Animation**, **Slots** and **Anti-patterns (styling)** field removed; the Component Styling Standards, Primitive standard (styling part), Tone system, Named classes, Component styling template and Variant template sections removed; C01 `tone` input replaced by `emphasis` (importance); C12/C13 `Tone` replaced by `severity`; C54 reframed from dark/Daylight toggle to a preference over whatever schemes the build offers; C56 and C60 reduced to behavioural obligations; Q6-4, Q6-5 withdrawn; A7 withdrawn.
- **Added:** "Rules every contract inherits"; C64 Disclosure, C65 Small-screen navigation toggle, C66 Sample interaction control, C67 Enquiry form, C68 Text reveal; Q6-8.
- **Audit and reconciliation (2.1.0, 2026-10-01; no contract added, removed or renamed, no ID changed):** every limit, timing and constant name now matches Phase 1 BR19 (note and decision reason 2,000, attachments 10 per transaction, `DEFAULT_LOCALE`, named constants throughout); an interrupted write is never replayed (rule 16); stale writes are refused (rule 10); C32 not-permitted kind, C33 kinds and mandatory reference, C42 reveal roles and re-mask triggers, C55 absolute limit, different-user re-authentication and step-up lock made explicit; C46 and C47 carry the full Phase 3 §11.1 parameter set (`direction`, `category`, `attachment` added, `q` 2–100), an open-ended ledger period pages by cursor, drafts are kept in the open tab's memory only (rules 16 and 18), the switcher is searchable beyond 10 memberships (C36), and a step-up grant for another purpose never authorises money movement (C52, C55). Deepened: inherited rules 9–23 (state vocabulary, single-flight and idempotency, focus destinations, input parity, announcement wording, validation timing, timeouts and unknown outcomes, session expiry mid-action, offline, sensitive values, failure text, scale edges, locale and direction, adaptations, traceability); every contract's **States** now defines trigger and effect; focus management, announcement wording, limits, conflict and money/time rules added per contract; two placement phrases rewritten as behaviour (C08 group error, C15 error row); Q6-9–Q6-11 and A6-1–A6-15 added.

## Traceability

- **Upstream:** [Phase 1](phase-1-product-vision.md) (BR1–BR12, DP1–DP12), [Phase 2](phase-2-experience-maps.md) (X1–X11 behaviours), [Phase 3](phase-3-information-architecture.md) (labels, search, filters), [Phase 4](phase-4-page-blueprints.md), [Phase 5](phase-5-section-blueprints.md) (every "Contracts" line).
- **Downstream:** [Phase 7](phase-7-frontend-architecture.md) (component layers and files), [Phase 8](phase-8-implementation-roadmap.md) (status of C01–C68), [Phase 9](phase-9-qa-checklist.md) (keyboard, ARIA and state checks), [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).
