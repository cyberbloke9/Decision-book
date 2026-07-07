# Product Spec — Pocket Decision Book PWA

> Canonical inputs (authoritative, on disk — READ THESE, they are part of this spec):
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/PROJECT.md` (vision, requirements, constraints)
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/ROADMAP.md` (6 phases = the 6 sprints below)
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/RESEARCH.md` (THE canonical content inventory — every framework, trigger, essence, and suggested visual form; the copyright ground rules; the habit mechanics)
>
> The context-isolation contract means "if it is not written down, it does not exist for downstream agents." These three files ARE written down, on disk, at fixed absolute paths. This spec binds them as mandatory reading for the Generator and Evaluator. Where this spec and RESEARCH.md disagree on a number, RESEARCH.md wins on content and this spec wins on process.

## 1. Original Request

Build the Pocket Decision Book PWA at `~/Downloads/pocket-decision-book`. The GYWD planning layer already on disk is the human request: `.planning/PROJECT.md`, `.planning/ROADMAP.md` (6 phases = sprint plan), `.planning/RESEARCH.md` (verified content inventory: 52 Decision Book models with quadrants/triggers/visual forms, 4 extension sets, habit mechanics, copyright rules — all prose and SVGs must be ORIGINAL, never quote the book). Mobile-first installable offline PWA, vanilla HTML/CSS/JS, no backend, localStorage only, distinctive non-generic design.

## 2. Product Goal

A mobile-first, installable, offline PWA that turns a real-life trigger ("I'm stuck", "too many options", "I keep delaying") into the right decision-making framework — with a visual, an example, and a next action — in under a minute on a phone. It is a daily-use tool, not a reference dump.

## 3. Target User

- A founder/builder juggling multiple projects (shipping vs. polishing, prioritization, notification distraction) who wants better decisions in the moment, on a phone.
- Already knows: how to use a phone, how to install a PWA / add-to-home-screen, basic decision-making vocabulary at a lay level.
- Should NOT need to know: any framework by name in advance (situation-first navigation exists for exactly this reason), what a service worker is, that content is "from a book," or any account/login.

## 4. Core User Stories

1. As a stuck user, I **open** the app and pick how I feel / what my problem is, and it **routes** me to matching frameworks.
2. As a browser, I **browse** frameworks by quadrant (the book's four sections) or by extension category (mental models, biases, attention, processes).
3. As a reader, I **open a framework card** and see its six parts (essence, visual, trigger, universal example, personal prompt, pitfalls).
4. As a searcher, I **search** by name/keyword and jump to a framework.
5. As a returning user, I **favorite** frameworks and find them again after closing and reopening the app.
6. As a habit-builder, I **open the daily card**, read one framework, log "applied it," and watch a streak accumulate.
7. As a mobile user, I **install** the app to my home screen and **use it fully offline** after first load.
8. As any user, I **toggle** dark/light theme and the choice persists.

## 5. Required Behaviors

Each behavior below is atomic and testable. "Framework" = any one of the 74 entries defined in §9 / RESEARCH.md.

### Content & data
- **B1.** A single JavaScript data module (no backend, no network fetch) contains ALL 74 frameworks. Each entry has a stable unique `id`, `name`, `category` (one of the four quadrants OR one of the four extension sets), `trigger` (string), `essence` (string), `visualType` (enum of visual forms), `universalExample` (string), `personalPrompt` (string), `pitfalls` (array of ≥1 string). Multi-step frameworks additionally carry `steps` (array).
- **B2.** `trigger` and `essence` for every framework MATCH the original re-expressions already written in RESEARCH.md (which are pre-authored as original text). They are not re-derived from the book.
- **B3.** `universalExample`, `personalPrompt`, and `pitfalls` are **authored by the Generator** as ORIGINAL text for every framework where RESEARCH.md does not already supply them (RESEARCH.md supplies these for only a few entries). No entry may ship with an empty or placeholder value in these three fields. (See §10 — this is the largest authoring task and the largest originality risk.)
- **B4.** The card renderer produces the six-part card purely from the data entry. Adding a new data entry renders a correct card with zero renderer changes.
- **B5.** Every framework ends in a question or an action, not a lecture (per RESEARCH.md ground rule 2 — the book is a workbook of question-asking methods).

### Visuals
- **B6.** Every framework renders an **inline SVG** visual (no external image files, no network requests for imagery) appropriate to its `visualType` (2x2 matrix, flow, spectrum, pyramid, cycle, venn/overlap, curve, triangle, and the other forms named in RESEARCH.md).
- **B7.** At a 375px-wide viewport, no framework's SVG overflows horizontally, is clipped, or collapses to zero size. Every visual is legible (labels not overlapping into unreadability).

### Navigation & discovery
- **B8.** A situation/feeling entry screen presents trigger-style options ("I'm distracted", "I can't choose", "conflict with someone", "big irreversible decision", etc.). Selecting one lists matching frameworks.
- **B9.** Every trigger entry point routes to **≥2** frameworks (no dead-end triggers).
- **B10.** Every one of the 74 frameworks is reachable in **≤3 taps** from the app's home/entry state (via situation, browse, or search).
- **B11.** Browse mode lists the four book quadrants (Improve Yourself / Understand Yourself / Understand Others / Improve Others) and the four extension categories; selecting one lists its frameworks.
- **B12.** Search filters frameworks by name and keyword substring; an empty query and a no-match query are both handled (see §6).

### Persistence (localStorage only)
- **B13.** Favoriting a framework, closing the app/tab, and reopening it shows the framework still favorited. Unfavoriting persists identically.
- **B14.** Theme choice (dark/light) persists across a full reload.
- **B15.** All persisted state lives in `localStorage`; there is no backend call anywhere in the app.

### Daily card habit loop
- **B16.** The daily card surfaces exactly one framework per calendar day via **deterministic date-based rotation** — the same date always yields the same framework (verifiable by controlling the system/injected date). The date rollover advances the card to a different framework.
- **B17.** The daily card offers a one-tap "applied it" / reflection action that is recorded in localStorage.
- **B18.** A streak indicator reflects consecutive days with an "applied it" log. A missed day is handled gracefully (streak UI celebrates persistence; it does not crash or show negative/NaN values). First-ever use shows a sane empty streak state (see §6).

### PWA / offline
- **B19.** A valid `manifest.json` (name, short_name, start_url, display: standalone, theme/background colors, and `icons`) enables add-to-home-screen. Icons MUST include a **192×192** and a **512×512** PNG (Lighthouse installability hard-requires both sizes). Icons may be programmatically generated or exported from an inline/authored SVG; they are the only permitted raster assets (§9).
- **B20.** A service worker with a **fetch handler** caches the app shell and all assets on first load; after first load, the app opens and every framework, visual, browse path, search, favorites, and daily card work with the network fully disabled. (The fetch handler + the B19 icon sizes are what make the Sprint 001 Lighthouse PWA gate pass.)

### Accessibility (baseline)
- **B21.** All interactive controls (tabs, situation options, favorite toggles, theme toggle, search input, "applied it") are keyboard-reachable and operable, have visible focus states, and have accessible names/labels.
- **B22.** Body text and interactive text meet WCAG AA contrast (≥4.5:1 normal text) in BOTH dark and light themes.
- **B23.** Tap targets on primary navigation are thumb-reachable and ≥44×44px.

## 6. States That Must Exist

- **Empty:** no favorites yet (favorites view shows guidance, not a blank void); first-ever daily card / zero-streak state; search with no query entered.
- **Loading / first paint:** app shell paints fast; no flash of unstyled/broken layout before content mounts.
- **Success:** framework card fully rendered with all six parts and its SVG; favorite toggled on; "applied it" logged and streak incremented.
- **Error / no match:** search query with no results shows a clear "no frameworks match" message with a way back, not an empty list.
- **Invalid input:** search handles empty, whitespace-only, and special-character queries without error.
- **Offline / slow network:** after first load, full functionality with network disabled (B20). No spinner that hangs waiting on a network that will never answer.
- **Permission denied (install):** if the browser does not offer install, the app still works as a normal responsive web app (install is an enhancement, not a gate).

## 7. Design Direction

The phrase "distinctive, non-generic" is only satisfied by the observable criteria below. A default framework template, an unstyled system-font page, or a generic Bootstrap/Material clone FAILS this section.

- **Baseline:** mobile-first at 375px; thumb-reachable bottom navigation; no horizontal scroll at 375px anywhere.
- **Typography:** a deliberate, named type scale (not the browser default stack alone). Distinct heading vs. body treatment; consistent vertical rhythm. Framework names and essences are visually hierarchical, not flat paragraphs.
- **Color:** a named, intentional palette with a defined dark theme AND a defined light theme (not merely `prefers-color-scheme` with browser defaults). Quadrants/categories may carry distinguishing accent colors, applied consistently.
- **Density:** one framework = one focused screen (per RESEARCH.md: ~3–4 book pages → one app screen is faithful). Cards are swipeable/navigable between frameworks; the six parts are scannable, not a wall of text.
- **Motion:** at least one purposeful transition (e.g., card enter/advance) that is subtle and non-janky; respects `prefers-reduced-motion`.
- **Tone:** direct, workbook voice — every card ends in a question/action (B5). No hype, no filler.
- **Originality of craft:** the visual language (SVG diagram style, card layout, navigation metaphor) should read as a considered product, not a CSS-reset skeleton. Anti-patterns to avoid: default blue links, unstyled form inputs, emoji-as-icon-system as the only visual identity, centered single-column text with no diagram.

## 8. Non-Goals

- No backend, accounts, auth, or cross-device sync (localStorage only).
- No native app-store builds (PWA install is the delivery).
- No social / sharing / comments features.
- No spaced-repetition scheduling engine (v1 ships the simpler daily-card rotation; SRS is a v2 candidate).
- No quoting, paraphrasing-with-intent-to-copy, or reproduction of the book's text or illustrations (see §9, §10).
- No content beyond the 74-framework inventory in v1 (do not invent additional frameworks).

## 9. Technical Constraints

- **Stack:** vanilla HTML/CSS/JS (or a single lightweight build with no heavy framework). Must run by opening the static files via a static host and work fully offline after first load.
- **Persistence:** `localStorage` only. No IndexedDB backend service, no remote storage, no cookies-for-state requirement.
- **Assets:** all framework visuals are inline SVG. No raster image fetches for diagrams. Icons for the manifest are the only permitted image assets.
- **Performance:** fast first load on mobile; no blocking network calls after first load.
- **Content inventory (authoritative counts — verify against RESEARCH.md):**
  - Core *The Decision Book* models: **52**, placed in four quadrants — Q1 Improve Yourself, Q2 Understand Yourself, Q3 Understand Others, Q4 Improve Others.
  - Extension Set A — mental-models canon: **7** (Second-Order Thinking, Inversion, Pre-Mortem, Regret Minimization, OODA Loop, 10/10/10, Circle of Competence).
  - Extension Set B — cognitive biases: **6** (Sunk Cost, Confirmation, Loss Aversion, Planning Fallacy, Anchoring, Hindsight).
  - Extension Set C — attention/distraction systems: **5** (Implementation Intentions, Deep Work, Environment Design, Ulysses Pact, Daily Highlight).
  - Extension Set D — structured decision processes: **4** (WRAP, Decision Journal, Weighted Scoring, Cynefin).
  - **Total: 74 frameworks.** (PROJECT.md's casual "~60" is superseded by this count.) The app must render all 74; the Evaluator verifies completeness against RESEARCH.md.
- **Copyright (hard constraint, from RESEARCH.md ground rules — verified):** frameworks/methods/model NAMES are free to use; the book's TEXT and ILLUSTRATIONS are protected. Every sentence of prose and every SVG in the app must be authored/drawn from scratch. Standard diagram forms (2x2 matrix, quadrant, pyramid, etc.) are free under the merger doctrine. **Do not quote the book at all** (the fair-use-quoting claim was refuted 0–3 in RESEARCH.md).

## 10. Risks and Ambiguities

- **R1 — The three unauthored card fields (biggest gap).** RESEARCH.md supplies `trigger`, `essence`, and `visualType` for most frameworks but NOT `universalExample`, `personalPrompt`, or `pitfalls` for most. The Generator must author ~74 × 3 original fields. *Safest default:* author them from the concept itself (which is not copyrightable), grounded in the founder/builder persona for the personal prompt; NEVER reach back to the book's wording. Any entry shipping with an empty/placeholder value in these fields is a defect.
- **R2 — Originality is only partially machine-checkable.** *Testable proxies:* `trigger`/`essence` match RESEARCH.md's pre-authored originals (B2); no field contains verbatim strings from the book. *Default:* full originality/plagiarism review is a MANUAL check deferred to the Sprint 006 acceptance gate; the Evaluator should flag suspicious verbatim-looking passages but cannot fully certify originality alone.
- **R3 — Trigger→framework mapping is partly authoring.** RESEARCH.md gives each framework a trigger, but the situation entry screen needs a curated set of ~6–10 top-level situations, each mapping to ≥2 frameworks (B8/B9). *Default:* derive the situation buttons by clustering the existing per-framework triggers; do not invent triggers unsupported by the inventory.
- **R4 — Visual-form coverage.** RESEARCH.md names many visual forms; some appear once. *Default:* implement a parameterized SVG component per named form; a single unusual form may be a bespoke one-off SVG. The bar is B7 (renders, no overflow at 375px), not visual perfection.
- **R5 — Daily-card determinism vs. testability.** The rotation must be date-deterministic AND testable without waiting 24h. *Default:* derive the day's index from the date (e.g., day-count modulo 74) via a single date-source function that a test can inject/mock.
- **R6 — "Feels native" is subjective.** *Default:* treat it as the sum of B19–B23 + §7 (installable, offline, thumb-reach, standalone display, no horizontal scroll), not as a separate unmeasured requirement.

## 11. Suggested Sprint Breakdown

These map 1:1 to the six phases in ROADMAP.md (the human's explicit plan). Do not re-architect the phase boundaries.

- **Sprint 001 — App shell & PWA foundation.** `index.html`, mobile-first layout, bottom tab navigation, `manifest.json`, service worker (offline-first cache of the shell), dark/light theme with persisted toggle. *Contract-testable:* installable prompt appears where supported (B19); app loads offline after first load (B20); theme persists (B14); no horizontal scroll at 375px.
- **Sprint 002 — Content engine & data model.** The 74-framework data module (B1) sourced from RESEARCH.md; `trigger`/`essence` match originals (B2); the three authored fields filled for every entry (B3); six-part card renderer (B4, B5). *Contract-testable:* all 74 entries present and schema-valid; every entry renders a card with all six parts non-empty; count check = 52+7+6+5+4.
- **Sprint 003 — Original SVG visuals.** Inline parameterized SVG components per visual form (B6). *Contract-testable:* every framework renders a visual; no SVG overflows/clips/collapses at 375px (B7); zero external image requests for diagrams.
- **Sprint 004 — Situation navigation & browse.** Situation/feeling entry screen (B8, B9), quadrant/category browse (B11), search (B12, with empty/no-match states), favorites with persistence (B13). *Contract-testable:* every trigger → ≥2 frameworks; every framework ≤3 taps (B10); favorites survive reload; no-match search shows a message.
- **Sprint 005 — Daily card habit loop.** Deterministic date-based rotation (B16), "applied it" reflection log (B17), streak indicator with missed-day + empty-state handling (B18). *Contract-testable:* fixed injected date → fixed framework; date advance → different framework; "applied it" persists and increments streak across reload; first-use empty streak is sane.
- **Sprint 006 — Polish & acceptance.** Design pass to §7 criteria, performance, a11y baseline (B21–B23), manual originality proofread (R2), full-app acceptance gate (EVALUATE_SYSTEM). *Contract-testable:* AA contrast in both themes; keyboard operability + visible focus on all controls; whole-app offline click-through of situation → framework → favorite → daily card passes.
