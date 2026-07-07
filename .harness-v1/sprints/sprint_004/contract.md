# Sprint 004 Contract — Situation Navigation, Browse, Search & Favorites

Maps to ROADMAP Phase 4 and spec §11 Sprint 004. This sprint turns the four bottom-tab screens from static placeholders into working navigation. It makes every framework **discoverable** three ways — by situation, by browse category, by search — and lets a returning user **favorite** frameworks that survive a reload.

Spec behaviors in scope: **B8** (situation/feeling entry screen), **B9** (every trigger entry → ≥2 frameworks), **B10** (every framework ≤3 taps from home), **B11** (browse the four quadrants + four extension sets), **B12** (search by name/keyword with empty + no-match states), **B13** (favorites persist across reload), and the persistence guarantee **B15** (all state in `localStorage`, no backend). It preserves the passing Sprint-002/003 card render (**B1–B7**) and the Sprint-001 offline gate (**B20**).

**Out of scope this sprint:** the daily card / streak (**B16–B18**, Sprint 005) — the **Today** screen is untouched. Full a11y/perf/contrast acceptance and originality proofread remain Sprint 006, but the a11y baseline for the **new** controls (§6) is binding now because this sprint adds the app's most interactive surface.

Authoritative sources: `js/data.js` (the accepted 74-framework module with `byId`, `categoryById`, `categories`, per-framework `trigger`) and `.planning/RESEARCH.md` (per-framework triggers — the raw material the situation clusters are derived from, spec R3). **Do not re-key or re-author any accepted Sprint-002 content** (name/trigger/essence/example/prompt/pitfalls/category/visualType). This sprint adds navigation and one authored mapping (situations); it does not touch card content.

---

## 1. User-visible behaviors (exact)

### 1.1 Situations = the working home screen (B8, B9)
- `#/situations` (the default route / home) **replaces its static "How to use this" panel** with an interactive **situation picker**: a short one-line lede, then a grid/list of **6–10 situation options**, each a first-person, trigger-style prompt (e.g. "I can't choose between options", "I keep getting distracted", "This decision scares me", "Am I fooling myself?"). Each option shows a short label and may show a one-line blurb.
  - **Decision (write it down so it isn't flagged as missing copy):** the multi-step "How to use this" ordered-list panel is **removed** and its guidance is now embodied by the picker itself; a single short lede line is retained above the picker. The old panel copy does not linger elsewhere.
- Each situation option is a link to `#/s/:id`. Selecting one navigates to a **situation-detail screen** that lists the frameworks mapped to that situation.
- **B9:** every situation maps to **≥ 2** frameworks. No situation is a dead end. Every `frameworkId` in every situation resolves to a real framework via `PDB_DATA.byId` (no dangling/typo ids).
- The situation set is **derived by clustering the existing per-framework triggers** (spec R3). It does **not** invent triggers or situations unsupported by the inventory. It is **static and deterministic** (same options, same order, every load — no `Math.random`/`Date`).

### 1.2 Browse the shelf (B11)
- `#/browse` **replaces its static lede-only placeholder** with a list of the **eight** categories from `PDB_DATA.categories`: the four book quadrants (Improve Yourself / Understand Yourself / Understand Others / Improve Others, `group: "quadrant"`) and the four extension sets (Mental Models / Cognitive Biases / Attention & Focus / Decision Processes, `group: "extension"`), visually grouped by `group` with a short section heading for each group.
- Each category is a link to `#/c/:id`. Selecting one navigates to a **category-detail screen** listing **every** framework whose `category` equals that id. The union of the eight category lists is **exactly the 74 frameworks, each appearing once** (each framework has exactly one category).

### 1.3 Reusable framework list item + the ≤3-tap guarantee (B10)
- Situation-detail, category-detail, search results, and favorites all render frameworks using **one shared list-item renderer**: an `<a href="#/f/:id">` showing at minimum the framework **name** and its **category label** (kicker); it may show the trigger line. Tapping it opens the existing Sprint-002/003 card at `#/f/:id`.
- **B10 (guaranteed by Browse):** every one of the 74 frameworks is reachable in **≤ 3 taps** from home: **Browse tab (1)** → its category on `#/browse` (2) → the framework's list item (3). The bottom tab bar is visible from every screen, so Browse is always 1 tap away. Situations and search are additional (shorter) paths, not the guarantee.

### 1.4 Search (B12)
- The existing app-bar search affordance routes to `#/search` (unchanged entry). The existing `#search-input` becomes **live**: typing filters the 74 frameworks by **case-insensitive substring** across a defined field set — **name, trigger, essence, and category label** (this is the testable definition of "name and keyword"). Matching uses `String.prototype.includes` on lower-cased strings — **never** `new RegExp(query)` (a regex build throws on `(`, `[`, `\`, etc.; §5 invalid-input).
- Results render below the input using the shared list-item renderer, updating on each keystroke (`input` event). A result count / heading (e.g. "3 matches") is shown for the success state.
- **Empty query** (nothing typed, or whitespace-only after `trim()`): show the **hint state** — a short "type a name or keyword" prompt, not a blank region and not the full 74-item list.
- **No match** (a non-empty query matching zero frameworks): show a clear message naming the query ("No frameworks match “<query>”") **with a way back** — a visible "Clear search" control that empties the input and returns to the hint state, plus a link to Browse. Not an empty list, not a silent blank.

### 1.5 Favorites (B13)
- The framework card (`#/f/:id`) gains a **favorite toggle** — a `<button>` (not a link) in the card **header** (so the `personalPrompt` remains the terminal card-part, B5 preserved). It reflects and toggles the framework's favorite state.
- `#/favorites` **replaces its static empty-state markup with a dynamic list**: when the user has favorites, it lists them (shared list-item renderer, most-recently-favorited first is acceptable but any stable order is fine); when there are none, it shows the **empty state** (guidance pointing to the card star — "Star a framework to keep it one tap away"), never a blank void.
- **Persistence (B13, B15):** favoriting, then a full reload (or close/reopen), shows the framework **still favorited** (star reflects on the card AND the framework appears on `#/favorites`). Unfavoriting persists identically (removed from `#/favorites`, star un-pressed) across reload. All favorite state lives in `localStorage` under a single namespaced key (e.g. `pdb.favorites`). **No backend, no network call anywhere** (B15).

---

## 2. Routes / screens / components affected

- **New file `js/nav-data.js`** — authored, **not** generated. Exposes `window.PDB_NAV` with:
  - `PDB_NAV.SITUATIONS` — array of `{ id, label, blurb, frameworkIds: [string, …] }`, 6–10 entries, each `frameworkIds.length >= 2`.
  - `PDB_NAV.situationById(id)` → a situation or `null`.
  - Static/deterministic; no `Math.random`/`Date`. Every `frameworkId` must resolve via `PDB_DATA.byId`.
- **New file `js/favorites.js`** — the localStorage favorites store. Exposes `window.PDB_FAV` with: `isFavorite(id)`, `toggle(id)` (returns the new boolean), `all()` (array of ids, stable order), and read/write to `localStorage['pdb.favorites']` (JSON array). Robust to missing/corrupt/blocked storage (try/catch → behaves as empty, never throws).
- **New file `js/lists.js`** — exposes `window.PDB_LISTS` with pure renderers that return DOM nodes (no storage writes): `renderFrameworkList(frameworks, mount, data)` (the shared list-item renderer), plus the screen renderers for situation-detail, category-detail, favorites, and search results, and the situation-picker + browse-index renderers. (Grouping of renderers across files is the Generator's call; the **module boundaries** above are the contract.)
- **Modified `js/app.js`** — router additions only:
  - `parseHash` recognizes two new parametric routes: `#/s/:id` → `{ route: "situation", id }` and `#/c/:id` → `{ route: "category", id }`. Garbage ids for these routes render a **not-found list state** (heading + message + working back link), not a crash.
  - `render` renders the situation picker into `#/situations`, the browse index into `#/browse`, the favorites list into `#/favorites`, and (on the new routes) the situation-detail / category-detail lists. Search wiring lives with the search screen.
  - Existing theme, SW, framework-card, and not-found behavior preserved. `region.setAttribute("aria-labelledby","h-"+route)` still resolves: the new screens carry headings with matching ids (§4).
- **Modified `js/card.js`** — add the favorite toggle button to the card header and a **back link** at the top of the card (§1.5, §5). No change to the six-part body or its order.
- **Modified `index.html`** —
  - Situations screen: replace the how-to panel with a picker mount.
  - Browse screen: add a browse-index mount.
  - Favorites screen: replace static empty markup with a favorites mount.
  - Search screen: add a results mount + a live-region for result count.
  - **New screens:** `#screen-situation-detail` (`data-route="situation"`, heading `id="h-situation"`) and `#screen-category-detail` (`data-route="category"`, heading `id="h-category"`).
  - Load order: `js/data.js` → `js/nav-data.js` → `js/favorites.js` → `js/visuals.js` → `js/lists.js` → `js/card.js` → `js/app.js`.
- **Modified `styles/app.css`** — styles for the situation grid, browse groups, list items, search results, favorite star, and back links. **Reuse Sprint-001 tokens only — no new palette, no new fonts.**
- **Modified `sw.js`** — precache the three new JS files; **bump the cache version `pdb-shell-v3` → `pdb-shell-v4`**; `activate` must purge the old cache (protects B20 — §8).
- **New file `tests/nav.spec.mjs`** — the Sprint-004 self-suite (§9). Add `"test:nav": "node tests/nav.spec.mjs"` to `package.json` scripts.

---

## 3. Anchors vs buttons (get this right — it is directly evaluator-tested)
- **Navigation is `<a href="#/…">`** (situation options, category items, framework list items, back links, "go to Browse"). Anchors give free keyboard operability, real focus, and working **browser Back**.
- **State toggles are `<button>`** with `aria-pressed`: the **favorite** toggle and the **Clear search** control. Buttons are not navigation and must not be links.
- Getting this backwards trips axe `link-name` / `button-name` and breaks browser Back; the wiring above is binding.

---

## 4. Data / state transitions & heading wiring
- **Route → screen:** `situations` (picker), `browse` (index), `favorites` (list/empty), `search` (hint/results/no-match), `situation` (`#/s/:id` detail), `category` (`#/c/:id` detail), `framework` (`#/f/:id` card, unchanged). The four bottom tabs remain `situations/browse/favorites/today`.
- **Heading ids (must match `h-<route>` or `aria-labelledby` dangles):** `h-situations`, `h-browse`, `h-favorites`, `h-search`, `h-today` (existing) plus **`h-situation`** (situation-detail; text = the situation label) and **`h-category`** (category-detail; text = the category label). The framework card keeps `h-framework`.
- **Favorite toggle:** click/Enter/Space → `PDB_FAV.toggle(id)` → button `aria-pressed` flips, accessible label updates ("Add to favorites" ↔ "Remove from favorites"), `localStorage['pdb.favorites']` updated. Navigating to `#/favorites` reflects the change; a full reload preserves it.
- **Search:** `input` event → `trim().toLowerCase()` → if empty ⇒ hint state; else filter ⇒ results state (with count) or no-match state. No hash mutation on keystroke.

---

## 5. States that must exist (this sprint)
- **Empty — favorites:** no favorites ⇒ `#/favorites` shows guidance pointing to the card star, not a blank void.
- **Empty — search (no query):** `#/search` with an empty/whitespace-only field shows the hint prompt, not a blank region and not all 74.
- **Success:** situation-detail lists ≥2 frameworks; category-detail lists that category's frameworks; search shows matches with a count; a favorited framework appears on `#/favorites` and its card star reads pressed.
- **No match:** non-empty query, zero results ⇒ "No frameworks match “<query>”" + a **Clear search** button + a Browse link (a way back). Never an empty list.
- **Invalid input:** search handles empty, whitespace-only, and special-character queries (`(`, `[`, `\`, `*`, emoji, very long strings) **without any error** (substring match, no regex build).
- **Not-found (parametric):** `#/s/<garbage>`, `#/c/<garbage>`, and empty `#/s/` `#/c/` render a graceful not-found list state (heading + message + working back link), no crash, no console error. `#/f/<garbage>` still renders the Sprint-002 not-found (unchanged).
- **Offline:** after first load + SW activation, with the network disabled, the situation picker, browse index, both detail screens, search, favorites, and the card (with star) all work from cache (§8).
- **A way back (spec §6):** every list/detail screen and the card carry an explicit **back affordance** (a visible back link), in addition to browser Back and the bottom tabs. Situation-detail → back to Situations; category-detail → back to Browse; card → back link (to Browse) at the top.

## 6. Keyboard / focus / ARIA / contrast — binding for EVERY new control
Enumerated because this is the sprint's largest fail surface. **Each** of these must be keyboard-reachable **and** operable, have a **visible focus state**, have an **accessible name**, present a tap target **≥ 44×44px** where it is a primary control, and meet **WCAG AA (≥4.5:1 text)** in **both** dark and light themes:
- situation option links, category item links, framework list-item links, back links, "go to Browse" link, search-result links;
- the **search input** (existing label preserved; associated accessible name);
- the **favorite toggle button** (`aria-pressed`, dynamic `aria-label`, focus ring, ≥44px);
- the **Clear search button** (`aria-label`, focus ring).
- **Search results announce to AT:** the results/count container is an `aria-live="polite"` region so keystroke-driven result changes are announced.
- Lists use semantic list markup (`<ul>`/`<li>`) so axe `list` does not fire. Icons inside controls are `aria-hidden`. No positive `tabindex`.
- All Sprint-001/002/003 keyboard, focus-ring, heading, and figure-a11y behavior is preserved unchanged; the card's six parts and `aria-hidden` SVG are untouched.

## 7. Responsive expectations
- At **375px and 320px**: **no horizontal scroll** on every screen (`documentElement.scrollWidth <= clientWidth`; `body.scrollWidth <= innerWidth`) — situations picker, browse index, both detail lists, search (incl. long-query no-match), favorites, and the card with its new star/back link.
- The situation grid and list items reflow to the narrow column (Sprint-001 `--content-max`); long framework names, situation labels, and long search queries **wrap** and never force a scroll or clip under the fixed app bar / bottom tab bar.
- Tap targets on situation options and list items are comfortably thumb-reachable (≥44px height).

## 8. PWA / security / offline

### 8.1 Security / privacy
- No backend, no remote fetch, no analytics, no third-party requests. The three new JS files are same-origin static content. All favorite/nav state is local.
- No secrets/tokens/keys in any tracked file. `.gitignore` continues to cover `.env*`, `*.db`, `.harness/`, `node_modules/`; `git status --porcelain` surfaces none of them.

### 8.2 Offline regression (protect the passing B20 gate) — REQUIRED
- `sw.js` must **add `./js/nav-data.js`, `./js/favorites.js`, `./js/lists.js` to the precache list** AND **bump the cache version `pdb-shell-v3` → `pdb-shell-v4`**, with `activate` purging the old cache. Failing to bump serves returning users a stale shell lacking the new modules → broken navigation offline.
- After first load + SW activation, with the context **offline**, cold `goto` to `#/situations`, `#/browse`, `#/s/<id>`, `#/c/<id>`, `#/search`, `#/favorites`, and `#/f/<id>` each renders its working screen from cache.

## 9. Commands to run
From project root `/Users/prithviputta/Downloads/pocket-decision-book`:
```
# Static serve (unchanged; port 4173)
python3 -m http.server 4173

# Sprint 004 nav self-suite (new)
node tests/nav.spec.mjs            # or: npm run test:nav

# Prior suites must still pass (regression)
node tests/content.spec.mjs        # Sprint 002
node tests/visuals.spec.mjs        # Sprint 003
node tests/shell.spec.mjs          # Sprint 001
```
- Playwright/axe already installed; `npx --yes playwright install chromium` if needed.

## 10. Playwright / Node click paths for the Evaluator
Serve first (`python3 -m http.server 4173`), base `http://localhost:4173/`.

1. **Situations picker (B8/B9).** `goto('/#/situations')`. Assert the picker renders **6–10** situation option links (no static "How to use this" ordered list remains). For each option, `goto('/#/s/<id>')` and assert it lists **≥ 2** framework list-item links. In-page, read `PDB_NAV.SITUATIONS`: every `frameworkIds` length ≥ 2, every id resolves via `PDB_DATA.byId` (zero dangling). Reload twice → identical option set/order (deterministic).
2. **Browse index (B11).** `goto('/#/browse')`. Assert all **8** categories appear as links, grouped (quadrant vs extension). For each, `goto('/#/c/<id>')` and collect the framework ids listed. Assert the union across all 8 = **exactly the 74 ids, each once**.
3. **≤3-tap reachability (B10).** For **all 74** frameworks: assert the framework's `category` is present on `#/browse` and the framework's list item appears on that `#/c/<category>` screen (Browse tab → category → framework = 3 taps). 74/74 reachable.
4. **Search happy path (B12).** `goto('/#/search')`, type a name substring (e.g. "matrix") → assert ≥1 result and every result's name/trigger/essence/category-label contains the query (case-insensitive). Type a mid-word keyword present in an essence but not a name → assert it still matches (keyword, not just name). Clicking a result opens the correct `#/f/:id` card.
5. **Search empty + no-match + invalid (B12/§5).** Empty field ⇒ hint state (no result list, not all 74). Whitespace-only ("   ") ⇒ hint state (trim). A non-matching query (e.g. "zzzznope") ⇒ "No frameworks match" message + a **Clear search** button + Browse link; clicking Clear empties the field and returns to hint. Special-character queries `(`, `[`, `\`, `*`, an emoji, and a 500-char string ⇒ **no thrown error, no console error**, graceful no-match/hint.
6. **Favorites persist (B13).** `goto('/#/f/<idA>')`, click the favorite button → `aria-pressed="true"`. `goto('/#/favorites')` → idA listed. **Reload the page** → `#/favorites` still lists idA; the card star for idA still reads pressed. Unfavorite idA → gone from `#/favorites`, star un-pressed; **reload** → still gone. In-page assert `localStorage['pdb.favorites']` is a JSON array reflecting state. Favorites empty (fresh `localStorage`) ⇒ `#/favorites` shows guidance, not blank.
7. **Anchors vs buttons (§3).** Assert situation/category/list/back/result elements are `<a href="#/…">`; favorite + Clear-search are `<button>` with `aria-pressed`/`aria-label`. Browser **Back** works: from a `#/s/<id>` list, `goBack()` returns to `#/situations`.
8. **Not-found (parametric).** `#/s/zzz`, `#/c/zzz`, `#/s/`, `#/c/` → graceful not-found list state with a working back link, **zero console errors**. `#/f/zzz` still renders the Sprint-002 not-found (unchanged).
9. **A11y (§6) — axe both themes.** Run `@axe-core/playwright` (theme set before paint) on situations, browse, a situation-detail, a category-detail, search (hint + results + no-match), favorites (empty + populated), and a card with the star — in **dark AND light**. Assert **zero** `color-contrast`, `link-name`, `button-name`, `list`, `document-title`, `html-has-lang` violations. Keyboard-only: Tab reaches every new control with a visible focus ring; Enter follows links; Enter/Space toggles favorite and Clear.
10. **Tap targets (B23).** Situation options, category items, list items, favorite button, and bottom tabs each have a rendered box ≥44×44px at 375px.
11. **No h-scroll (375 & 320).** Assert no horizontal scroll on situations, browse, a long-list category-detail, search with a 500-char query no-match, favorites, and the card — at 375px and 320px.
12. **Offline (B20 regression).** Load `/`, wait `serviceWorker.ready` + active worker; set context offline; cold `goto` each of `#/situations`, `#/browse`, `#/s/<id>`, `#/c/<id>`, `#/search`, `#/favorites`, `#/f/<id>` in a fresh page → each renders its working screen from cache. Grep `sw.js`: `CACHE === "pdb-shell-v4"`, the three new JS files precached, old cache purged on `activate`.
13. **Console cleanliness.** Across all steps, **zero** `console.error` and zero `console.warn` from the app.
14. **Non-regression.** `tests/content.spec.mjs`, `tests/visuals.spec.mjs`, `tests/shell.spec.mjs` still green. The **Today** screen is unchanged (still the Sprint-001 empty placeholder — Sprint 005 owns it). The six-part card + prompt-last is intact (favorite star is in the header; `article.card` lastElementChild is still `card-part card-prompt`). No new palette/fonts; no re-keyed content.

## 11. Explicit non-goals (out of scope — building any is scope creep)
- **No daily card, no streak, no "applied it" log, no rotation** — the **Today** screen stays exactly as Sprint 001 shipped it (Sprint 005 owns B16–B18).
- **No re-keying or re-authoring of accepted Sprint-002 content** (name/trigger/essence/example/prompt/pitfalls/category/visualType). Situations is the only new authored data.
- **No new fonts or palette; no changes to the SVG visuals** (Sprint 003) or the six-part card body/order beyond adding the header star + top back link.
- **No animated route transitions** beyond the existing Sprint-001 screen-enter animation (respect `prefers-reduced-motion` as already done).
- **No backend, no IndexedDB, no cookies-for-state** — `localStorage` only (B15).
- **No sharing / social / cross-device sync.**
- Full originality/plagiarism certification of the situation labels/blurbs remains R2-deferred to Sprint 006; labels must be original, first-person, and grounded in existing triggers (R3), never book text.

## 12. Known risks to disclose (name them; not blockers)
- The search query is **not encoded in the hash**, so browser-Back from a `#/f/:id` opened via search returns to an empty search field (hint state), not the prior results. Acceptable for v1; disclose in the trace.
- Situation → framework clustering is authored curation (R3); coverage of all 74 via situations is **not** required (Browse guarantees B10). Situations optimize for the top real-life triggers, so some niche frameworks are reachable only via Browse/Search.

## 13. Acceptance summary (all must hold)
- [ ] `#/situations` shows a **6–10** option situation picker (static how-to panel gone); each option → `#/s/:id` listing **≥2** frameworks; every `PDB_NAV` id resolves via `byId`; deterministic (B8/B9).
- [ ] `#/browse` lists all **8** categories grouped by quadrant/extension; each → `#/c/:id`; union of category lists = **exactly the 74, each once** (B11).
- [ ] **All 74** frameworks reachable in **≤3 taps** (Browse tab → category → framework), verified per-framework (B10).
- [ ] Search filters by **substring** across name/trigger/essence/category-label via `includes` (no regex); results show a count; clicking a result opens the card (B12).
- [ ] Search **empty/whitespace ⇒ hint**, **no-match ⇒ message + Clear + Browse link**, **special-char/long queries ⇒ no error** (B12/§5).
- [ ] Favorite toggle (a `<button aria-pressed>` in the card header) + `#/favorites` list; favoriting/unfavoriting **survives reload**; state in `localStorage['pdb.favorites']`; empty state shows guidance (B13/B15).
- [ ] Navigation elements are `<a href="#/…">`; toggles are `<button>`; browser Back works (§3).
- [ ] New heading ids `h-situation`/`h-category` match the route tokens (no dangling `aria-labelledby`); parametric not-found is graceful with a back link (§4/§5).
- [ ] Every new control: keyboard-operable, visible focus, accessible name, ≥44px, AA in **both** themes; results are an `aria-live` region; axe shows **zero** `color-contrast`/`link-name`/`button-name`/`list` violations both themes (§6).
- [ ] No horizontal scroll at **375px & 320px** on every screen incl. long-query no-match (§7).
- [ ] Every screen (situations/browse/detail/search/favorites/card) renders **offline**; `sw.js` bumped to `pdb-shell-v4`, three new JS files precached, old cache purged (B20/§8).
- [ ] **Today** screen unchanged; six-part card + prompt-last intact; `content`/`visuals`/`shell` suites still green; **zero** console errors/warnings anywhere.
- [ ] `.gitignore` covers `.env*`/`*.db`/`.harness/`/`node_modules/`; `git status --porcelain` shows no such artifacts; no secrets committed.
