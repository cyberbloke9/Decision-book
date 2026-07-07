# Sprint 002 Contract — Content Engine & Data Model

Maps to ROADMAP Phase 2 and spec §11 Sprint 002. This sprint delivers the **content spine**: a single vanilla-JS data module holding all **74** frameworks with a validated schema, and a **data-driven six-part card renderer** reachable at a dedicated hash route. It ships **no real diagram SVGs** (Sprint 003), **no situation/browse/search navigation into cards** (Sprint 004), **no daily-card rotation/streak** (Sprint 005). Cards are reached only by direct hash this sprint; that is intentional and stated below.

Spec behaviors in scope: **B1** (74-entry data module + schema), **B2** (`trigger`/`essence` match RESEARCH.md originals), **B3** (the three authored fields filled for every entry), **B4** (data-driven six-part renderer), **B5** (every card ends in a question/action). Also preserves the passing Sprint 001 offline gate **B20** (see §9.2 regression).

Authoritative content source: `/Users/prithviputta/Downloads/pocket-decision-book/.planning/RESEARCH.md`. Where this contract and RESEARCH.md disagree on content, RESEARCH.md wins.

---

## 1. User-visible behaviors (exact)

### 1.1 Framework card route (the renderer surface)
- A new hash route **`#/f/:id`** renders a single framework's card, where `:id` is a framework's stable `id` (e.g. `#/f/eisenhower-matrix`).
- The card renders the **six parts** from the data entry alone (B4), in this **visual order** (top → bottom):
  1. **Header** — the framework `name` (as an `<h2>`, the screen heading for this route) and its **category label** (e.g. "Improve Yourself").
  2. **Trigger** — the `trigger` string, presented as the "when you feel / when you're facing" line.
  3. **Visual** — a `<figure>` region containing a `<figcaption>` that **names the visual form** derived from `visualType` (genuine metadata, e.g. "Two-by-two matrix"). **The diagram SVG itself is Sprint 003 and out of scope here** (see §12). The figure must not contain placeholder/"coming soon" text; the form-name caption is real, standalone content.
  4. **Essence** — the `essence` string.
  5. **Steps** — IF the entry has a non-empty `steps` array, render it as an ordered list. Entries without `steps` render no steps block (no empty container).
  6. **Universal example** — the `universalExample` string, under a clear "For example" label.
  7. **Pitfalls** — the `pitfalls` array as a list, under a "Watch out for" label (≥1 item always).
  8. **Personal prompt (terminal element)** — the `personalPrompt` string is rendered **last**, as the card's closing call, styled as the prompt/question the user acts on. This ordering is deliberate so the card **ends on a question/action, not a lecture (B5)**. (The §4-story six-part list happens to end on pitfalls; the rendered order overrides that and closes on the prompt.)
- Only one card screen exists; navigating to a different `#/f/:id` re-renders it in place.

### 1.2 Not-found state
- `#/f/:id` where `:id` matches no framework renders a genuine **"Framework not found"** state: a heading, one honest line ("No framework with that id."), and a working link back to **Situations** (`#/situations`) and to **Browse** (`#/browse`). No crash, no console error, no blank screen.
- An `#/f/` with an empty/missing id is treated as not-found (or normalized to the default screen) — never a JS error.

### 1.3 No in-app entry point yet (intentional boundary)
- This sprint adds **no link, button, list, or tile anywhere in the existing five screens that navigates to a card**. The four existing tabs and the Search screen keep their Sprint-001 honest empty/first-run copy unchanged. Card entry points (situation routing, browse listings, search results) are **Sprint 004**.
- The card route is nonetheless a real, functional surface: it is reached by direct hash (URL bar or the Evaluator's Playwright `goto`). It is not a dead end — it renders real content for all 74 ids.

---

## 2. Routes / screens / components affected
- **New file** `js/data.js` — the 74-framework data module (see §3). Plain script (no ES module `export` required by the browser; attaches to a global namespace, e.g. `window.PDB_DATA`, so `js/app.js` can consume it without a bundler). Declare the exact global.
- **New file** `js/card.js` — the card renderer + not-found renderer (pure functions from a data entry → DOM). Declare the global/API it exposes.
- **Modified** `js/app.js` — router extended to recognize the parametric `#/f/:id` route (current `routeFromHash` matches a fixed whitelist and splits on `/`; it needs new parsing for the `f/<id>` shape) and to invoke the card renderer. Must not regress any Sprint-001 routing behavior.
- **Modified** `index.html` — add a `#screen-framework` section (the card mount point) and load `js/data.js` + `js/card.js` (order: data before card before app, or as the build requires). Existing five screens' markup/copy unchanged.
- **Modified** `styles/app.css` — styles for the card and its parts (tokens from Sprint 001; no new palette).
- **Modified** `sw.js` — precache `js/data.js` and `js/card.js`; **bump the cache version** (see §9.2).

## 3. Data module schema (B1, B2, B3)

`js/data.js` exposes:
- `PDB_DATA.frameworks` — an array of **exactly 74** framework objects.
- `PDB_DATA.categories` — metadata array mapping each `category` id to a human label and group.
- `PDB_DATA.VISUAL_TYPES` — array of allowed `visualType` strings (the forward vocabulary Sprint 003 will implement one component per entry against).

### 3.1 Framework object (every field required unless marked optional)
| field | type | rule |
|---|---|---|
| `id` | string | kebab-case, unique across all 74, stable, human-derived from the name (e.g. `eisenhower-matrix`). Non-empty. Matches `^[a-z0-9]+(-[a-z0-9]+)*$`. |
| `name` | string | the framework NAME verbatim from RESEARCH.md (names are free to use per copyright rules). Non-empty. |
| `category` | string | exactly one of the 8 category ids in §3.2. |
| `trigger` | string | matches RESEARCH.md's original phrasing (B2). For the 6 cognitive biases, RESEARCH.md's column is **"Catch-yourself cue"** — that cue text maps to `trigger`. Non-empty. |
| `essence` | string | matches RESEARCH.md's original "Essence" phrasing (B2). Non-empty. |
| `visualType` | string | one of `PDB_DATA.VISUAL_TYPES`; chosen to reflect RESEARCH.md's "Visual" column for that entry. |
| `universalExample` | string | **authored by the Generator, original** (B3). A concrete, book-neutral example that shows the framework applied. Non-empty, no placeholder. |
| `personalPrompt` | string | **authored, original** (B3), grounded in the founder/builder persona (spec §3). Phrased as a **question ending in `?`** (the testable proxy for B5). Non-empty. |
| `pitfalls` | array of string | **authored, original** (B3), **≥1** item, each non-empty. |
| `steps` | array of string | **optional**; present only for multi-step frameworks (e.g. GROW, OODA, WRAP, Cynefin, Buyer's Decision funnel). When present, ≥2 non-empty items. |

- No field may be an empty string, whitespace-only, or a placeholder token (`TODO`, `TBD`, `lorem`, `coming soon`, `xxx`, `placeholder`, `...`).
- `trigger`/`essence` are **not re-derived** — they reproduce RESEARCH.md's pre-authored originals (B2). The Evaluator verifies this by string comparison against RESEARCH.md (allowing only trivial whitespace/quote normalization).

### 3.2 Categories (8): 4 quadrants + 4 extension sets
`PDB_DATA.categories` entries carry `{ id, label, group }` where `group ∈ {"quadrant","extension"}`:
| id | label | group | count |
|---|---|---|---|
| `improve-yourself` | Improve Yourself | quadrant | 18 |
| `understand-yourself` | Understand Yourself | quadrant | 13 |
| `understand-others` | Understand Others | quadrant | 13 |
| `improve-others` | Improve Others | quadrant | 8 |
| `mental-models` | Mental Models | extension | 7 |
| `cognitive-biases` | Cognitive Biases | extension | 6 |
| `attention` | Attention & Focus | extension | 5 |
| `decision-processes` | Decision Processes | extension | 4 |

Quadrant membership follows RESEARCH.md Q1/Q2/Q3/Q4 exactly. Extension-set membership follows RESEARCH.md Sets A/B/C/D exactly.

### 3.3 VISUAL_TYPES vocabulary (forward contract for Sprint 003)
- `PDB_DATA.VISUAL_TYPES` is a deliberate, stable list of visual-form identifiers (kebab-case). Every `framework.visualType` is a member.
- There must be **≥12 distinct** `visualType` values used across the 74 entries (RESEARCH.md's "Visual" column is diverse — everything collapsing to one form is a defect). The names should map recognizably to RESEARCH.md's forms (2×2 matrix, flow, pyramid, cycle, curve, venn/overlap, timeline, spectrum, triangle, tree, funnel, concentric circles, etc.).
- Sprint 003 will implement one SVG component per used `visualType`; treat these names as an interface, not throwaway strings.

## 4. Data / state transitions
- The data module is **static, in-memory, network-free** — no fetch, no import over the wire. It is a plain JS file cached by the service worker.
- The card route reads only `location.hash`; no new `localStorage` key this sprint (favorites/daily are Sprints 004/005).
- No mutation of framework data at runtime.

## 5. States that must exist (this sprint)
- **Success:** `#/f/<valid-id>` renders all six parts, every part non-empty, prompt last.
- **Steps present vs absent:** a multi-step framework shows an ordered steps list; a single-idea framework shows no steps block (and no empty leftover container).
- **Not-found / invalid:** `#/f/<garbage>` and `#/f/` render the not-found state with working back-links; no console error.
- **Offline:** after first load, `#/f/<id>` renders fully offline (data.js + card.js are cached; see §9.2).
- **Loading / first paint:** the card mounts without a flash of unstyled/broken layout; no layout shift that hides content.

## 6. Keyboard / focus / ARIA / contrast
- The card screen's heading is the framework `name` as `<h2>` (the app keeps its single app-level `<h1>` wordmark; per-screen `<h2>` structure from Sprint 001 is preserved).
- The not-found back-links are real, keyboard-focusable `<a>` elements with visible focus rings (reuse Sprint-001 `:focus-visible` styling) and accessible names.
- On route change to a card, focus management follows the Sprint-001 pattern (content region labelled by the current heading); do not trap focus.
- Card body text and labels meet **WCAG AA** (≥4.5:1) in **both** dark and light themes — reuse Sprint-001 tokens (`--fg`, `--muted`); the gold `--accent` is used only on non-text indicators/borders, never to paint body text.
- Lists (steps, pitfalls) use real list semantics (`<ol>`/`<ul>`).

## 7. Responsive expectations
- At **375px** and **320px** viewport widths, the card screen has **no horizontal scroll** (`documentElement.scrollWidth <= clientWidth` and `body.scrollWidth <= innerWidth`).
- Long framework names, long essences, and long example strings **wrap** — no overflow, no clipping, no text bleeding under the fixed chrome. Content sits within the Sprint-001 `--content-max` column and clears the top app bar and bottom tab bar.

## 8. Design direction (card-level, §7)
- Reuse the Sprint-001 design system (Major-Third type scale, serif-display headings + sans body, named palette). The card must read as a considered, scannable one-screen artifact, **not a wall of text**: the six parts are visually distinct (label chips/kickers, hierarchy between `name`/`essence`/`prompt`), consistent vertical rhythm.
- The `personalPrompt` closing element is visually emphasized (it is the call to action). Direct workbook voice; no hype, no filler.
- No new fonts, no new color palette, no emoji-as-icon-system. Any card ornament is inline SVG/CSS consistent with the existing set.

## 9. PWA / security / offline

### 9.1 Security / privacy
- No backend, no remote fetch, no analytics, no third-party requests. `js/data.js` is same-origin static content.
- No secrets/tokens/keys in any tracked file. `.gitignore` continues to cover `.env*`, `*.db`, `.harness/`, `node_modules/`; `git status --porcelain` surfaces none of them.

### 9.2 Offline regression (protect the passing B20 gate) — REQUIRED
- `sw.js` must **add `./js/data.js` and `./js/card.js` to the precache list** AND **bump the cache version** (`pdb-shell-v1` → `pdb-shell-v2`, and the `activate` cleanup must purge the old cache). Failing to bump the version serves returning users a stale shell that lacks the new files → offline card render regresses. This is an explicit acceptance item (§13).
- After first load + SW activation, with the context **offline**, `goto('/#/f/<id>')` (cold, fresh page) must render the full card from cache.

## 10. Commands to run
From project root `/Users/prithviputta/Downloads/pocket-decision-book`:
```
# Static serve (same as Sprint 001; port 4173)
python3 -m http.server 4173
#   → app at http://localhost:4173/  and cards at http://localhost:4173/#/f/<id>

# Content self-suite (added this sprint)
node tests/content.spec.mjs          # or: npm run test:content

# Sprint 001 shell suite must still pass (offline regression guard)
node tests/shell.spec.mjs            # or: npm run test:shell
```
- Add `"test:content": "node tests/content.spec.mjs"` to `package.json` scripts.
- Playwright/axe already installed from Sprint 001; `npx --yes playwright install chromium` if needed.

## 11. Playwright / Node click paths for the Evaluator
Serve first (`python3 -m http.server 4173`), base `http://localhost:4173/`. Steps 1–7 can run against the served data module in a page context.

1. **Count & schema (B1).** In-page, read `window.PDB_DATA.frameworks`. Assert length **=== 74**. Assert **per-category** counts exactly: improve-yourself 18, understand-yourself 13, understand-others 13, improve-others 8, mental-models 7, cognitive-biases 6, attention 5, decision-processes 4. (Per-category, so a 75-in-one/73-elsewhere swap is caught.)
2. **Field validity (B1/B3).** For every framework assert: `id` matches `^[a-z0-9]+(-[a-z0-9]+)*$` and is **unique**; `name`, `trigger`, `essence`, `universalExample`, `personalPrompt` are non-empty non-whitespace strings; `pitfalls` is an array with **≥1** non-empty item; `category ∈` the 8 ids; `visualType ∈ PDB_DATA.VISUAL_TYPES`. Assert **no** field equals a placeholder token (`todo`/`tbd`/`lorem`/`coming soon`/`placeholder`/`xxx`, case-insensitive).
3. **B5 proxy.** For every framework assert `personalPrompt.trim()` ends with `?`.
4. **Visual-type diversity.** Assert `PDB_DATA.VISUAL_TYPES` is a non-empty array and the set of distinct `visualType` values used across the 74 entries has **≥12** members.
5. **B2 verbatim match.** Parse `.planning/RESEARCH.md`; for each framework assert its `trigger` and `essence` match the corresponding RESEARCH.md cells (whitespace/smart-quote normalized). For the 6 `cognitive-biases`, the RESEARCH "Catch-yourself cue" cell is the expected `trigger`. Report any mismatch as a finding.
6. **Card render — all 74 (B4).** For each `id`, `goto('/#/f/<id>')`, wait for `#screen-framework:not([hidden])`. Assert the rendered card contains: the `name` (as `<h2>`), the `trigger` text, a visual `<figure>` whose `<figcaption>` is a non-empty form name, the `essence` text, a "For example" block with the `universalExample`, a pitfalls list with ≥1 item, and the `personalPrompt` — and that the `personalPrompt` is the **last** content block (terminal element, B5). For an entry that has `steps`, assert an `<ol>` of the steps renders; for one without, assert no empty steps container.
7. **Data-driven renderer (B4).** In-page, push a synthetic valid entry into a clone of the data and render it through the exposed card API (or add it and `goto('/#/f/<synthetic-id>')`); assert a correct card renders **without editing renderer code**. (Proves the renderer is generic, not hardcoded per framework.)
8. **Not-found.** `goto('/#/f/definitely-not-real')`; assert the not-found heading + honest line + working back-links to `#/situations` and `#/browse`; assert **zero** console errors. Repeat for `#/f/` (empty id).
9. **No-scroll (375 & 320).** On a long card (pick the entry with the longest combined text), assert no horizontal scroll at 375px and 320px; assert content is not clipped under the chrome.
10. **A11y/contrast.** Run `@axe-core/playwright` on a rendered card in **dark**, then **light**; assert zero `color-contrast`, `document-title`, `html-has-lang`, `list`, `link-name` violations in both themes.
11. **Offline card render (B20 regression).** Load `/`, wait for `serviceWorker.ready` + active worker. Set context offline. Cold `goto('/#/f/<id>')` in a fresh page → assert the card renders fully offline. Also confirm `sw.js` cache name was bumped from `pdb-shell-v1` (grep the file) and old cache is purged on activate.
12. **Sprint 001 non-regression.** Re-run `tests/shell.spec.mjs` (or the equivalent checks): four tabs still route, theme still persists across reload, the five existing screens keep their honest empty/first-run copy (no card content leaked into them), zero console errors/warnings.
13. **Console cleanliness.** Across all steps, assert zero `console.error` and zero `console.warn` from the app.

## 12. Explicit non-goals (out of scope — building any is scope creep)
- **No diagram SVGs.** The visual part is a form-name `<figure>`/`<figcaption>` only; the actual parameterized SVG per `visualType` is **Sprint 003**. (Enumerating the `VISUAL_TYPES` vocabulary is in scope; drawing them is not.)
- **No situation/browse/search navigation into cards, no favorites, no daily card.** No in-app link to `#/f/:id` from any screen; cards are hash-addressable only this sprint. Situation routing + browse listings + search + favorites are **Sprint 004**; daily rotation + streak + "applied it" are **Sprint 005**.
- **No changes to the five existing screens' copy or the tab set.**
- **No full originality/plagiarism certification.** Sprint-002 originality bar = every authored field is non-empty and plausibly original, and `trigger`/`essence` match RESEARCH.md's pre-authored originals (B2). The exhaustive verbatim-vs-book plagiarism review is **R2-deferred to the Sprint 006 acceptance gate**; the Evaluator flags any suspicious book-like passage but does not fully certify originality here.

## 13. Acceptance summary (all must hold)
- [ ] `js/data.js` exposes **exactly 74** frameworks with the §3.1 schema; **per-category counts** = 18/13/13/8 + 7/6/5/4.
- [ ] Every `id` is unique and kebab-case; every required field non-empty; `pitfalls` ≥1; `category`/`visualType` in their allowed sets.
- [ ] `trigger`/`essence` **match RESEARCH.md** originals (B2), with the cognitive-biases "catch-yourself cue" mapped to `trigger`.
- [ ] `universalExample`, `personalPrompt`, `pitfalls` **authored, original, non-placeholder** for all 74 (B3); every `personalPrompt` ends in `?` (B5).
- [ ] `#/f/:id` renders the **six parts** data-drivenly (B4), prompt rendered **last**; steps render only when present.
- [ ] Adding a new valid data entry renders a correct card with **zero renderer changes** (B4).
- [ ] Not-found state for unknown/empty id with working back-links; **zero console errors**.
- [ ] **≥12 distinct** `visualType` values; `VISUAL_TYPES` exported as the Sprint-003 vocabulary.
- [ ] No horizontal scroll at 375px & 320px on the card; long text wraps, not clipped.
- [ ] AA contrast on the card in **both** themes (axe `color-contrast` = 0 violations).
- [ ] **Offline card render works**; `sw.js` precaches `data.js`+`card.js` and cache version **bumped** to `pdb-shell-v2` with old cache purged (B20 preserved).
- [ ] Sprint 001 shell suite still passes; the five existing screens are unchanged; **zero** console errors/warnings anywhere.
- [ ] `.gitignore` covers `.env*`/`*.db`/`.harness/`/`node_modules/`; `git status --porcelain` shows no such artifacts; no secrets committed.
