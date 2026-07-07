# Sprint 003 Contract — Original SVG Visuals

Maps to ROADMAP Phase 3 and spec §11 Sprint 003. This sprint replaces the Sprint-002 form-name **placeholder frame** in the framework card with a genuine, **original, inline SVG diagram** for every framework, one per `visualType`. It ships **no** situation/browse/search navigation, **no** favorites, **no** daily card (those remain Sprints 004/005). The only new user-visible thing is: opening any `#/f/:id` card now shows a real drawn visual instead of a lettered token.

Spec behaviors in scope: **B6** (every framework renders an inline SVG appropriate to its `visualType`; no external image files, no network requests for imagery), **B7** (at 375px no SVG overflows/clips/collapses; visuals legible). Preserves the passing Sprint-002 card render (**B1–B5**) and the Sprint-001 offline gate (**B20**).

Also folds in the two **non-blocking carryover findings** from Sprint 002 (F-001, F-002) that the Evaluator explicitly recommended rolling into this sprint because it already touches the same build pipeline and depends on the shell regression gate. See §11.

Authoritative sources: `/Users/prithviputta/Downloads/pocket-decision-book/.planning/RESEARCH.md` (the "Visual" column per framework), and `js/data.js` (`visualType` + `VISUAL_TYPES`, already accepted in Sprint 002). Where this contract and RESEARCH.md disagree on which form a framework takes, `js/data.js`'s existing `visualType` (already B2-verified content in Sprint 002) is authoritative — **do not re-key visualTypes this sprint.**

---

## 1. User-visible behaviors (exact)

### 1.1 The visual replaces the placeholder
- On `#/f/:id` for every one of the **74** frameworks, the card's `<figure>` region renders a real **inline `<svg>`** diagram whose form matches the framework's `visualType`.
- The Sprint-002 lettered token (`.card-figure-token`) and the "placeholder frame" concept are **removed**. No "coming soon", no single-letter token, no empty box.
- The `<figcaption>` naming the form (e.g. "Two-by-two matrix") is **retained** — it remains the accessible name for the figure (see §6). The visual sits above/beside it exactly as the Sprint-002 figure layout intends.

### 1.2 The visual is schematic, original, and generic to the FORM
- Each SVG depicts the **visual form itself** (a two-by-two matrix, a pyramid, a cycle, a curve, …) as an **original schematic** — NOT a reproduction of the book's specific labeled illustration.
- Any text labels inside an SVG are **short, generic, and authored** (e.g. axis labels "low / high", "urgent / important", generic node dots, "start → end"). They do **not** pull long strings from the framework's `essence`/`example` data (SVG text does not wrap and would overflow), and they do **not** copy the book's specific diagram captions (merger doctrine covers the bare form; the book's specific artwork does not — spec §9 copyright hard constraint).
- The diagram must be a recognizable, honest depiction of the named form — not a decorative squiggle. A "curve" shows a plotted curve; a "pyramid" shows stacked layers; a "cycle" shows nodes in a loop; a "2×2" shows two axes and four quadrants.

### 1.3 Same content, one card screen
- No route changes. `#/f/:id` still renders the six-part card from Sprint 002 with all parts non-empty and the `personalPrompt` last (B5). This sprint only changes what fills the `<figure>`.
- Navigating to a different `#/f/:id` re-renders the card, including a **different, correct** SVG for the new framework's form.

---

## 2. Routes / screens / components affected
- **New file** `js/visuals.js` — the SVG renderer module. Plain script (no bundler), attaches a global. Exposes:
  - `window.PDB_VISUALS.renderVisual(fw)` → returns an inline **`SVGSVGElement`** (a DOM `<svg>` node, not a string) for the framework `fw`, keyed off `fw.visualType`.
  - `window.PDB_VISUALS.HAS` — a `Set` (or object) of the `visualType` strings that have a dedicated renderer, so callers/tests can introspect coverage.
- **Modified** `js/card.js` — in the figure section (currently lines ~57–69), replace the `.card-figure-frame` + `.card-figure-token` placeholder with a call to `PDB_VISUALS.renderVisual(fw)`, appended inside the figure **before** the retained `<figcaption>`. Keep `.card-figcaption`, `.card-figcaption-kicker`, `.card-figcaption-name` exactly as they are. Guard: if `PDB_VISUALS` is unavailable, fall back to a safe empty labelled frame (no crash) — but under normal load it is always present.
- **Modified** `index.html` — load `js/visuals.js` **before** `js/card.js` (card depends on visuals) and after `js/data.js`. Existing screens/markup otherwise unchanged.
- **Modified** `styles/app.css` — styles for the inline SVG inside `.card-figure` (sizing, theme-token colors). May remove now-dead `.card-figure-frame` / `.card-figure-token` rules. No new palette; reuse Sprint-001 tokens.
- **Modified** `sw.js` — precache `./js/visuals.js`; **bump cache version** `pdb-shell-v2` → `pdb-shell-v3`; the `activate` cleanup must purge the old cache (protects B20 — see §8).
- **Modified (carryover)** `scripts/build-data.mjs` + `scripts/extract-content.mjs` (F-001) and `tests/shell.spec.mjs` (F-002) — see §11.
- **New file** `tests/visuals.spec.mjs` — the Sprint-003 self-suite (see §9). Add `"test:visuals": "node tests/visuals.spec.mjs"` to `package.json` scripts.

---

## 3. The renderer contract (B6)

### 3.1 Coverage — all 37 forms, all 74 frameworks
- `js/data.js` uses **37 distinct `visualType` values** (already accepted). `PDB_VISUALS` must have a dedicated renderer for **every** one:
  `matrix-2x2, scatter-plot, timeline, flow, tension, curve, grid, nine-dot, tree, split, spectrum, bubble-map, radar, venn, distortion-lens, crossroads, layers, pyramid, nested-loops, spiral, spike, black-box, role-wheel, triangle, stage-curve, gap-bars, triage, concentric, mirror, cycle, anchor, funnel, gantt, sliders, constraint, spotlight, journal`.
- Every one of the **74** frameworks, when rendered, produces an inline `<svg>` in its figure. Zero frameworks render an empty/placeholder figure.
- Spec R4 permits **bespoke one-off SVGs** for forms used once; do not build a heavyweight parameterization framework the bar does not require. Form-specific renderers keyed by `visualType` are acceptable and expected.

### 3.2 Determinism (so the Evaluator's Playwright is stable)
- **No `Math.random`, no `Date`, no non-deterministic input.** The same `fw` always renders a byte-identical SVG. Rendering `#/f/eisenhower-matrix` twice yields the same DOM.

### 3.3 Unknown-visualType fallback (preserve Sprint-002 B4)
- If `renderVisual` is given an `fw` whose `visualType` has no dedicated renderer (e.g. a future/synthetic entry), it returns a **safe generic schematic SVG** (a neutral labelled diagram) rather than throwing or returning null. This preserves the Sprint-002 "add a valid entry → correct card, zero renderer edits" property (that test still injects a synthetic entry).

### 3.4 No network, no raster (B6 hard)
- All visuals are **inline SVG built in the DOM**. **Zero** `<img>`, `<image>`, `background-image: url(...)`, `<use href>` to an external file, or any network request for diagram imagery. The only raster assets in the whole app remain the two manifest icons (unchanged).

---

## 4. Legibility & responsiveness (B7) — hard requirements

These are the traps a naive implementation fails while still passing a shallow attribute check. All are binding.

### 4.1 No overflow / no h-scroll
- At **375px** and **320px** viewport widths, the card (now including the SVG) produces **no horizontal scroll** (`documentElement.scrollWidth <= clientWidth`; `body.scrollWidth <= innerWidth`). The SVG's rendered `getBoundingClientRect().right` sits within the content column; nothing bleeds under the fixed top bar or bottom tab bar.
- The `<svg>` is fluid: `width: 100%` of its figure container (capped by the Sprint-001 `--content-max` column), with a `viewBox` and `preserveAspectRatio` so it scales without clipping.

### 4.2 No zero-collapse
- The SVG must have **explicit rendered sizing** — an `aspect-ratio` (or explicit height) so it never renders at **0px height**. Testable floor: rendered `getBoundingClientRect().height >= 80` and `>= 40` width at a 375px card. (A `viewBox`-only SVG with no CSS height can collapse to 0 in some engines — this is forbidden.)

### 4.3 Legibility is measured in RENDERED pixels, not viewBox units
- Any `<text>` in an SVG must render at an **effective size ≥ 11px** at the 375px card width. Because the SVG is scaled to fit ~320–343px of rendered width, the check is on the **rendered** effective size: `fontSizeInViewBoxUnits × (renderedSvgWidthPx / viewBoxWidth) >= 11`. Keep `viewBox` dimensions **modest** (so text scales up, not down) — a 600-unit-wide viewBox scaled to 320px turns a `font-size:12` label into ~6px illegible text; that FAILS even though the attribute reads 12.
- No two text labels overlap into unreadability; labels stay within the `viewBox` bounds (no text clipped at the SVG edge).

### 4.4 Theme-adaptive color (both dark AND light)
- SVG strokes/fills use **`currentColor`** and/or the **Sprint-001 CSS theme tokens** (`--fg`, `--muted`, `--accent`, surface tokens) — **never hardcoded `#333`/`#fff`**. A diagram hardcoded dark vanishes on the dark-navy card; hardcoded light vanishes on the cream card.
- All SVG strokes and text meet **WCAG AA (≥4.5:1 for text, ≥3:1 for meaningful graphical strokes)** against the card background in **BOTH** dark and light themes. The gold `--accent` is used for indicators/emphasis marks, consistent with Sprint 001; primary schematic linework uses `--fg`/`--muted` so it reads in both themes.
- NOTE: axe `color-contrast` does not reliably scan SVG `<text>`, so this is verified **by screenshot** in both themes (§9 step 6, §10), not by axe alone.

---

## 5. States that must exist (this sprint)
- **Success:** every `#/f/:id` renders a legible, theme-correct, form-appropriate inline SVG plus the intact six-part card.
- **Both themes:** the same card in dark and in light both show the visual with adequate contrast (no invisible/vanished diagram).
- **Offline:** after first load + SW activation, a cold `#/f/:id` renders the full card **including the SVG** with the network disabled (visuals.js cached; see §8).
- **Unknown/synthetic type:** a framework with an unrenderable `visualType` shows the generic fallback schematic, not a crash or blank (§3.3).
- **Not-found:** `#/f/<garbage>` and `#/f/` still render the Sprint-002 not-found state with working back-links and zero console errors (unchanged; must not regress).

## 6. Keyboard / focus / ARIA / contrast
- The inline `<svg>` is **decorative relative to the figcaption**: mark each visual `<svg>` `aria-hidden="true"`. The **retained `<figcaption>`** (kicker "Visual form" + the form name) is the accessible, visible label for the figure; the framework's meaning is carried by the `essence`/`example` text, not the diagram. This avoids double-announce and sidesteps axe's `svg-img-alt` rule, keeping the a11y assertion deterministic.
- No new focusable elements are introduced by the visual (the SVG is not interactive, has no `tabindex`, no links).
- All Sprint-001/002 keyboard, focus-ring, heading (`<h2>` name), and list semantics are preserved unchanged.
- Card body text and figcaption meet AA in both themes (Sprint-002 tokens, unchanged); SVG contrast per §4.4.

## 7. Responsive expectations
- Restated for emphasis: **375px and 320px → no horizontal scroll**, SVG scales fluidly, text stays legible (§4). Long framework names/essences still wrap as in Sprint 002.
- The figure keeps a sensible max height on tall/narrow screens so a single card still reads as one focused screen (spec §7 density) — the SVG does not push the six card parts off-screen unreasonably.

## 8. PWA / security / offline

### 8.1 Security / privacy
- No backend, no remote fetch, no analytics, no third-party requests. `js/visuals.js` is same-origin static content; all SVGs are built in-DOM.
- No secrets/tokens/keys in any tracked file. `.gitignore` continues to cover `.env*`, `*.db`, `.harness/`, `node_modules/`; `git status --porcelain` surfaces none of them.

### 8.2 Offline regression (protect the passing B20 gate) — REQUIRED
- `sw.js` must **add `./js/visuals.js` to the precache list** AND **bump the cache version** (`pdb-shell-v2` → `pdb-shell-v3`), with the `activate` handler purging the old cache. Failing to bump serves returning users a stale shell lacking `visuals.js` → offline cards render without diagrams. This is an explicit acceptance item (§12).
- After first load + SW activation, with the context **offline**, a cold `goto('/#/f/<id>')` in a fresh page must render the full card **including its SVG** from cache.

## 9. Commands to run
From project root `/Users/prithviputta/Downloads/pocket-decision-book`:
```
# Static serve (unchanged; port 4173)
python3 -m http.server 4173
#   → cards at http://localhost:4173/#/f/<id>

# Regenerate data (only needed for the F-001 carryover fix)
node scripts/build-data.mjs

# Sprint 003 visuals self-suite (new)
node tests/visuals.spec.mjs        # or: npm run test:visuals

# Prior suites must still pass (regression)
node tests/content.spec.mjs        # Sprint 002
node tests/shell.spec.mjs          # Sprint 001 (now deterministic — F-002)
```
- Playwright/axe already installed; `npx --yes playwright install chromium` if needed.

## 10. Playwright / Node click paths for the Evaluator
Serve first (`python3 -m http.server 4173`), base `http://localhost:4173/`.

1. **Renderer coverage (B6).** In-page, read `window.PDB_DATA.VISUAL_TYPES` and `window.PDB_VISUALS.HAS`. Assert **every** of the 37 `VISUAL_TYPES` has a renderer in `HAS`. Assert `renderVisual` returns an `SVGSVGElement` (not string/null) for a sample of each type.
2. **Every framework renders an SVG (B6).** For **all 74** ids, `goto('/#/f/<id>')`, wait for `#screen-framework:not([hidden])`, assert the `<figure>` contains a direct inline `<svg>` element, and that the six-part card from Sprint 002 is still intact (name `<h2>`, trigger, essence, example, ≥1 pitfall, prompt LAST). Assert the placeholder token (`.card-figure-token`) is **gone**.
3. **No external image / network for imagery (B6).** With request interception on, load a card and assert **zero** network requests for images/diagrams (no `.png/.jpg/.svg/.gif` fetches beyond the app-shell precache, no `<img>`/`<image>`/external `<use href>`/CSS `url()` for diagrams). The two manifest icons are the only permitted rasters and are not part of the card.
4. **No zero-collapse (B7).** For a sample across forms, assert the rendered `<svg>` `getBoundingClientRect().height >= 80` and width `>= 40` at a 375px card. No SVG renders at 0px.
5. **Rendered legibility (B7).** For SVGs that contain `<text>`, compute effective rendered size = `fontSizeViewBoxUnits × (renderedWidthPx / viewBoxWidth)`; assert `>= 11px` for every label at 375px. Assert text nodes lie within the SVG bounding box (not clipped at the edge).
6. **Both-theme visibility (B7/§4.4) — SCREENSHOT.** For **at least one framework per `visualType` (≥37 shots)**, screenshot the card at 375px in **dark** and in **light**. Confirm visually the diagram is present, legible, and contrasts against the card background in BOTH themes (no vanished/invisible linework). This is the authoritative B7 check; the proxy assertions (2,4,5) are necessary but not sufficient.
7. **No h-scroll (375 & 320).** On the card with the most complex SVG, assert no horizontal scroll at 375px and 320px; SVG within the content column, nothing clipped under the chrome.
8. **Determinism (§3.2).** Render the same id twice; assert identical SVG markup (`outerHTML` equal). Grep `js/visuals.js` for `Math.random`/`Date` → none.
9. **Unknown-type fallback (§3.3 / B4).** Inject a synthetic entry with a bogus `visualType` (or call `renderVisual` with one) → assert a generic SVG returns, no throw, card still renders.
10. **Offline card render incl. SVG (B20 regression).** Load `/`, wait `serviceWorker.ready` + active worker; set context offline; cold `goto('/#/f/<id>')` in a fresh page → assert the full card **with its `<svg>`** renders offline. Grep `sw.js`: cache bumped to `pdb-shell-v3`, `visuals.js` precached, old cache purged on activate.
11. **A11y non-regression.** Run `@axe-core/playwright` on a rendered card in dark and light (theme set before paint); assert **zero** `color-contrast`, `svg-img-alt`, `list`, `link-name`, `document-title`, `html-has-lang` violations. (SVG `aria-hidden` per §6 means no `svg-img-alt` should ever fire.)
12. **Carryover F-001 (§11).** `goto('/#/f/confirmation-bias')`; assert the trigger line shows **no literal `*` or `_`** characters (renders "You feel satisfied by evidence"). Independently scan all 74 triggers/essences for stray `*`/`_` emphasis markers → zero. B2 verbatim-match still holds for all 74 (`tests/content.spec.mjs` green).
13. **Carryover F-002 (§11).** Run `node tests/shell.spec.mjs` **10 consecutive times**; assert **50/50 every run** (deterministic — the theme/axe flake is fixed).
14. **Console cleanliness.** Across all steps, zero `console.error` and zero `console.warn` from the app.
15. **Sprint 001/002 non-regression.** Four tabs still route; theme persists across reload; the five existing screens keep their honest empty/first-run copy; `tests/content.spec.mjs` still green (all 74 six-part cards intact).

## 11. Carryover fixes (logged Sprint-002 findings, Evaluator-approved for this sprint)

These are the two named non-blocking findings from `sprint_002/findings.md`. They are folded in because this sprint already touches the build pipeline (F-001) and depends on the shell regression gate (F-002). **Do not expand beyond these two fixes.**

### F-001 — literal markdown asterisks in Confirmation Bias trigger
- Root cause: RESEARCH.md line ~107 stores `*satisfied*` as markdown italic; the byte-exact B2 copy carries raw `*` into `js/data.js` and the DOM.
- Fix: strip inline emphasis markers (`*`/`_` wrapping a word) at **build time** in `scripts/build-data.mjs`, and apply the **same** strip in `scripts/extract-content.mjs` so the B2 verbatim comparison still holds. **Do not hand-edit `js/data.js`** (generated) — regenerate via `node scripts/build-data.mjs`.
- Pass condition: the confirmation-bias trigger renders "You feel satisfied by evidence" with no literal `*`/`_`; independent scan of all 74 triggers/essences finds zero stray emphasis markers; `tests/content.spec.mjs` B2 match stays green for all 74.

### F-002 — flaky shell regression suite (theme-transition axe frame)
- Root cause: `tests/shell.spec.mjs` flips theme via `setAttribute` without emulating reduced motion, so axe occasionally samples a mid-crossfade low-contrast frame (~1 in 3 runs false-fails `320px light/situations color-contrast`). Not a product defect.
- Fix: in `tests/shell.spec.mjs`, emulate `reducedMotion: 'reduce'` (or set the theme via localStorage before `goto` then reload) before every axe scan, so the gate samples a settled frame. **Test-only change; no product code.**
- Pass condition: `node tests/shell.spec.mjs` passes **50/50 on 10 consecutive runs**.

## 12. Explicit non-goals (out of scope — building any is scope creep)
- **No new navigation, no situation/browse/search into cards, no favorites, no daily card.** Cards remain hash-addressable only (Sprints 004/005 own the rest).
- **No re-keying of `visualType` values** and **no edits to the accepted Sprint-002 content** (trigger/essence/example/prompt/pitfalls) beyond the F-001 emphasis-strip.
- **No animated/interactive SVG.** Visuals are static schematics. If any motion is ever added it must respect `prefers-reduced-motion`, but motion is NOT required or expected this sprint (card-advance transitions belong to later sprints).
- **No reproduction of the book's specific illustrations.** SVGs depict the generic form only (§1.2); full originality/plagiarism certification remains R2-deferred to Sprint 006.
- **No new fonts or palette.** Reuse Sprint-001 tokens only.
- **No changes to the five existing screens' copy or the tab set.**

## 13. Acceptance summary (all must hold)
- [ ] `js/visuals.js` exposes `PDB_VISUALS.renderVisual(fw)` (returns an `SVGSVGElement`) and `PDB_VISUALS.HAS`; a dedicated renderer exists for **all 37** `visualType` values.
- [ ] **All 74** frameworks render an inline `<svg>` in the figure; the Sprint-002 placeholder token is gone; the six-part card (B1–B5) is intact with the prompt last.
- [ ] **Zero** external image/diagram network requests; no `<img>`/`<image>`/external `<use>`/CSS-url diagrams (B6).
- [ ] No SVG collapses to 0px (rendered height ≥ 80px, width ≥ 40px at 375px) (B7).
- [ ] SVG `<text>` is legible in **rendered** px (effective ≥ 11px at 375px), not clipped, not overlapping (B7).
- [ ] Diagrams are visible and AA-contrasting in **BOTH** dark and light themes (theme-token/`currentColor` colors; verified by ≥37 screenshots) (B7/§4.4).
- [ ] No horizontal scroll at 375px & 320px on the card with the SVG (B7).
- [ ] Deterministic SVG (no `Math.random`/`Date`; identical re-render); unknown-`visualType` fallback returns a safe generic SVG (no throw) — Sprint-002 synthetic-entry test still passes (B4).
- [ ] SVGs are `aria-hidden`; `<figcaption>` remains the accessible name; axe shows **zero** `color-contrast`/`svg-img-alt`/`list`/`link-name` violations in both themes.
- [ ] **Offline card render incl. SVG** works; `sw.js` precaches `visuals.js` and cache version **bumped** to `pdb-shell-v3` with old cache purged (B20 preserved).
- [ ] **F-001 fixed:** confirmation-bias trigger shows no literal `*`/`_`; no stray emphasis markers across all 74; content suite B2 still green.
- [ ] **F-002 fixed:** `tests/shell.spec.mjs` deterministic 50/50 across 10 consecutive runs.
- [ ] `tests/content.spec.mjs` still green; five existing screens unchanged; **zero** console errors/warnings anywhere.
- [ ] `.gitignore` covers `.env*`/`*.db`/`.harness/`/`node_modules/`; `git status --porcelain` shows no such artifacts; no secrets committed.
