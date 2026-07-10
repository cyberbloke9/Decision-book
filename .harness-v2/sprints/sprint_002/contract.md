# Sprint 002 Contract — Examples engine, extensions 22 + card UI (ROADMAP Milestone 2, Phase 8)

> Binds: spec.md §5 (B24–B31, B34, B37–B40), §6 states, §10 R1/R2/R4/R6, §11 Sprint 002.
> This sprint does TWO things: (1) finish the examples data (author `examples[]`+`featured` for the
> **22 extension** frameworks so all 74 are complete), and (2) ship the **card renderer UI**
> (featured-first + paired trade-off + persona-tab widget) AND **remove `universalExample` app-wide**.
> The palette/type transformation (B32/B33) and the hierarchy re-layout are **explicitly out of scope**
> — they are Sprint 003. This sprint may add NEW CSS for the persona widget + example layout, but MUST
> NOT change any v1 palette token value or any `font-family` declaration (see §10 Non-Goals).

## 1. One-line summary

Author validated `examples[]` (5 personas) + `featured` for the **22 extension** frameworks via the
draft→counter→final loop; re-audit those 22 `personalPrompt`s; ship the restructured card renderer —
featured example rendered first with its trade-off visually paired under a "cost" label (B30) and the
five personas exposed as an accessible tab widget (B31); **remove `universalExample` from data, renderer,
and every test** (grep-clean across `js/` and `tests/`); regenerate `js/data.js`; bump the SW cache
`pdb-shell-v8` → `pdb-shell-v9`; keep every v1 suite green; push to both remotes.

## 2. Scope — the 22 "extension" set (defined by category)

The **extension 22** = every framework whose `category` is one of:
`mental-models` (7) + `cognitive-biases` (6) + `attention` (5) + `decision-processes` (4) = **22**.

The **core 52** (`improve-yourself`/`understand-yourself`/`understand-others`/`improve-others`) already
carry `examples[]`+`featured` from Sprint 001; this sprint does NOT re-author their scenarios/tradeoffs.
It DOES migrate the core 52 through the schema change (their `universalExample` field is removed and their
cards render via the new persona UI).

At the end of this sprint, **all 74** frameworks carry a valid `examples[]`+`featured`, and **no**
framework carries `universalExample`.

(Reference — the 22 extension IDs are `second-order-thinking … cynefin`, i.e. the AUTHORED entries that
today still carry a hand-written `universalExample` string in `scripts/build-data.mjs`.)

## 3. User-visible behavior (this sprint HAS a new UI — it is the point)

- **UV1 — Featured-first example.** Opening any framework card shows the `featured` example FIRST: its
  `scenario` prominently, immediately followed by its `tradeoff` under a labelled cost element (e.g.
  "The cost" / "Trade-off"). The scenario and its cost are always co-visible (B30).
- **UV2 — Persona tabs.** Below/around the featured example are five persona tabs — `everyday`,
  `student`, `relationship`, `high-achiever`, `privileged` — in that fixed order, each with a consistent
  named label + accent + glyph reused on every card (the persona system). The `featured` persona's tab is
  selected on load and is visibly marked as the featured one (a badge/label, not merely "selected"). One
  tap on any other persona swaps the visible panel to that persona's `scenario` + `tradeoff` (both shown
  together). The previously shown example is replaced, not stacked (B30/B31).
- **UV3 — Keyboard operability.** The tab widget is fully keyboard-operable: Tab moves focus to the
  selected tab; ArrowLeft/ArrowRight move selection between personas; the panel updates; a visible focus
  outline is present (B21). See §6.3 for the exact ARIA + key contract.
- **UV4 — Card still ends on the personal prompt.** The card's terminal `.card-part` remains
  `.card-prompt` (B5). The example restructure sits ABOVE the pitfalls + prompt, unchanged in order.
- **UV5 — No v1 regression.** Every v1 flow (bottom-tab nav, browse, search + empty/no-match, favorites,
  theme toggle + persistence, daily card, situation nav, offline-after-first-load, not-found) behaves
  exactly as before, only with the new example UI inside the card. The daily card (`js/daily.js`, which
  reuses `renderCard`) inherits the new example UI with zero direct edits to `daily.js`.

## 4. Data contract (the 22-extension deliverable + the app-wide schema change)

### 4.1 The 22 extension AUTHORED entries gain `examples[]`+`featured`

For each of the **22 extension** frameworks, the `AUTHORED` entry in `scripts/build-data.mjs`:

- ADDS `examples`: an array of EXACTLY 5, fixed persona order:
  ```js
  examples: [
    { persona: "everyday",      scenario: "…", tradeoff: "…" },
    { persona: "student",       scenario: "…", tradeoff: "…" },
    { persona: "relationship",  scenario: "…", tradeoff: "…" },
    { persona: "high-achiever", scenario: "…", tradeoff: "…" },
    { persona: "privileged",    scenario: "…", tradeoff: "…" }
  ],
  featured: <int 0..4>
  ```
- REMOVES its hand-authored `universalExample` string (the field is deleted from the entry).

### 4.2 App-wide removal of `universalExample` (the schema amendment, B1/B4)

- **`scripts/build-data.mjs`:** remove the `universalExample` computation and field emission from the
  emitted framework object (currently ~L942 `const universalExample = …` and ~L950 `universalExample,`);
  remove the D5 build guard (currently ~L973 `if (f.universalExample !== …) throw`). Scrub any banner /
  header comment that names `universalExample` (L3, L6, L1039) so the regenerated `js/data.js` contains
  **zero** occurrences of the token `universalExample`.
- **`js/data.js`:** regenerated (never hand-edited). After regeneration, `grep universalExample js/data.js`
  returns **0 hits**.
- **`js/card.js`:** the renderer no longer references `fw.universalExample` (see §5).
- **`tests/`:** every `universalExample` reference migrated to `examples`/`featured` (see §6).

**Machine gate (authoritative):** `grep -rn universalExample js/ tests/` returns **0 hits** at end of sprint.

### 4.3 Hard requirements — now applied to ALL 74 (machine-checkable)

Renamed from Sprint 001's D-series and extended to all 74. `content.spec.mjs` enforces these against
`window.PDB_DATA.frameworks` (the generated data):

- **E1 (B24/B25).** Every one of the 74 has `examples` = array length **5**, personas exactly
  `["everyday","student","relationship","high-achiever","privileged"]` in that order, no dupes, no gaps;
  each entry has a non-empty `scenario` and non-empty `tradeoff`.
- **E2 (B24).** Every one of the 74 has `featured` an integer in `[0,4]`.
- **E3 (B26 proxy — ALL 5 scenarios of all 74).** Every `scenario` contains ≥1 concrete stakes token.
  Token list is the SAME as Sprint 001 §6.1 (pinned in §6.1 below; the test hardcodes it inline).
- **E4 (B27 proxy — ALL 5 tradeoffs of all 74).** Every `tradeoff` contains ≥1 cost-marker token and is
  NOT a "no downside"/"pure win"/"no trade-off" claim. Token list pinned in §6.1 below.
- **E5 (B29 machine part).** Every one of the 74 `personalPrompt`s is non-empty and ends with `?`.
- **E6 (schema clean).** No framework object carries a `universalExample` key. `examples`/`featured`
  present on all 74; counts by category: exactly `52` core + `22` extension all carry examples.
- **E7 (B37).** `js/data.js` regenerated by `node scripts/build-data.mjs` — never hand-edited; the join
  guard (trigger/essence from RESEARCH.md) stays intact; `trigger`/`essence` remain byte-stable for all
  74 (B2).
- **E8 (no placeholders, B40).** No `TODO/TBD/lorem/placeholder/coming soon/xxx` tokens in any scenario/
  tradeoff/prompt (all 5×74 strings). No text quoted from the book (original authoring).
- **E9-audit (sampled/manual part of B29, R4).** The Generator re-examines each of the 22 extension
  prompts for personal-life reach (relationships/family/money/identity/health) where the framework
  applies to persons. No artifact required; the prompt text is the evidence. Verified by Evaluator
  sampling + the Sprint 004 acceptance gate.

## 5. Renderer contract — `js/card.js` (B4/B5/B30/B31/B34)

The card renderer is rebuilt around `examples[]`+`featured` while preserving the v1 card structure that
the unmodified v1 suites depend on. **These preserved-structure requirements are hard — they keep
`accept`/`visuals`/`daily`/`nav` green WITHOUT editing them (only their SW pin is bumped):**

### 5.1 Preserved v1 card structure (do not break)

- The card still contains a `.card-example` section with a `.card-example-text` element. The
  `.card-example-text` element in the DEFAULT-rendered card (before any tab click) holds the **featured**
  scenario text. (Preserves `accept.spec` `.card-example` presence + `visuals.spec` `.card-example-text`
  presence + the migrated `content.spec` render-equality.)
- The card's LAST `.card-part` and `article.card`'s `lastElementChild` is `.card-prompt` (B5). The example
  restructure inserts BEFORE pitfalls/prompt, preserving order:
  `header → trigger → figure → essence → [steps?] → EXAMPLE(new) → pitfalls → prompt`.
- Exactly ONE inline `<svg>` remains a descendant of `.card-figure` (`accept.spec` asserts
  `.card-figure svg` count === 1). **Persona glyphs, if SVG, MUST live in the tab widget, NOT inside
  `.card-figure`.**
- `.card-name` (h2, id = `options.headingId`), `.card-trigger-text`, `.card-essence-text`,
  `.card-pitfalls-list li`, `.card-figcaption-name`, the fav toggle button — all preserved as today.
- `renderNotFound` unchanged; the defensive degrade (§6 states) added for missing/invalid `examples`.

### 5.2 New example UI (B30/B31/B34)

Inside the `.card-example` section, render:

- **Featured-first (B30).** The featured example's `scenario` (in `.card-example-text`) shown first,
  immediately followed by a labelled cost element with a visible label (e.g. "The cost" / "Trade-off")
  and the featured `tradeoff` text. Scenario + cost are ALWAYS co-visible; there is NO state where a
  scenario is visible without its paired tradeoff.
- **Persona tab widget (B31).** A tab widget exposing all five personas in fixed order. The `featured`
  persona's tab is `aria-selected="true"` on load and carries a visible "Featured" marker (badge or
  label — B34 observable prominence). Each persona tab shows the persona's consistent label + accent +
  glyph (the persona system, reused on every card). Activating another persona swaps the visible panel to
  that persona's `scenario` (in a scenario element) + its `tradeoff` (under the same cost label). B30
  pairing holds for EVERY persona panel, not just featured.
- **Per-instance id scoping (BLOCKER-class — do not skip).** `renderCard` runs for BOTH the framework
  card (`headingId:"h-framework"`) and the Today card (`headingId:"h-today-card"`), and both rendered
  cards can be in the DOM at once (screens toggle via `hidden`, mounts are not both cleared). Every `id`
  the tab widget uses for `aria-controls`/`aria-labelledby` MUST be scoped per instance (derive from
  `options.headingId` or a render-scoped counter) so the two cards' widgets never collide. A framework
  card's tab must control the framework card's OWN panel, never the Today card's.
- **Fits 375px (B36).** The five-tab widget MUST fit at 375px AND 320px with NO page horizontal scroll
  (content.spec step 9 fails the whole card on any h-scroll). Choose a mechanism that fits (wrap to rows /
  short labels + glyphs / horizontal scroll WITHIN the tablist container only). Each tab is a ≥44×44px tap
  target (B23).
- **Persona accents = NEW tokens.** Persona accent colors are NEW CSS custom properties (e.g.
  `--persona-everyday`, `--persona-student`, …) added in `styles/app.css`. They MUST NOT reuse or
  overwrite any v1 palette token (`--bg`/`--surface`/`--surface-2`/`--accent`/`--fg`). Persona accent text
  MUST meet AA (≥4.5:1) on BOTH themes (axe color-contrast in content.spec scans the card in both themes).

### 5.3 Generic renderer (B4)

The card is produced purely from the data entry; adding a framework with a valid `examples[]`+`featured`
renders correct featured + persona tabs with zero renderer edits. The synthetic-fixture test (§6) proves
this with an entry that has `examples[]`+`featured` but is not in `PDB_DATA`.

## 6. Test migration — `tests/content.spec.mjs` (migrate, do not merely add)

`content.spec.mjs` is the pre-handoff gate. It must be migrated so it (a) drops all `universalExample`
references, (b) enforces E1–E8 over all 74, and (c) exercises the new tab widget (B30/B31). Specific edits:

- **L49 field check:** remove `universalExample` from the non-empty field list; the example content is
  now covered by E1.
- **L54 blob:** remove `universalExample` from the placeholder-scan blob; add scenario/tradeoff text
  (already covered by E8 loop).
- **Step 3b (examples engine):** update counts — `coreWithEx.length === 52` AND `extWithEx.length === 22`
  AND all 74 carry examples; run E1–E4/E8 over **all 74** (not just the 52). Keep the inline §6.1 token
  regexes (authoritative; not loaded from any artifact).
- **D5 block (L111–118):** DELETE. `universalExample === examples[featured].scenario` is superseded (the
  field no longer exists). Replace with E6 (no `universalExample` key on any framework object).
- **Render loop (L163–166):** migrate the equality check — the ACTIVE (non-`[hidden]`) tabpanel's
  scenario element text `=== f.examples[f.featured].scenario`. Do NOT compare to `universalExample`.
- **Synthetic fixture (L179–198):** give the synthetic entry a valid `examples[]`+`featured` (5 personas,
  fixed order) instead of `universalExample`; assert the featured scenario renders and the tab widget is
  present; keep the promptLast + steps assertions.
- **Longest-card calc (L217):** replace `f.universalExample` with the joined example text
  (`f.examples.map(e => e.scenario + " " + e.tradeoff).join(" ")`) so the h-scroll check still targets the
  heaviest card.
- **NEW — tab widget checks (B30/B31):** add a block that, for a sampled set of frameworks (≥1 core, ≥1
  extension, plus a `featured != 0` framework), asserts on a rendered framework card:
  1. a `role="tablist"` with exactly 5 `role="tab"` children, personas in fixed order, exactly one
     `aria-selected="true"` = the featured persona;
  2. exactly one visible (`:not([hidden])`) `role="tabpanel"`; the visible panel contains BOTH a scenario
     element AND a cost/tradeoff element (B30 — no visible scenario without its tradeoff);
  3. clicking each of the other four persona tabs makes ITS panel the sole visible one, showing that
     persona's scenario + tradeoff, and moves `aria-selected`;
  4. keyboard: focus the selected tab, press `ArrowRight` → selection + visible panel advance to the next
     persona; `ArrowLeft` reverses; a visible focus outline is present;
  5. per-instance scoping: render the Today card (`#/today`) AND a framework card, then confirm activating
     a persona tab on the framework card toggles the FRAMEWORK card's own panel (ids don't collide).
- **SW pin (L263):** update to `pdb-shell-v9`. Keep `precaches data.js + card.js`.

### 6.1 Token-list validation mechanism (authoritative — identical to Sprint 001 §6.1)

The test hardcodes these EXACT regexes inline (not loaded from the trace artifact):

**E3 helper** — `hasStakesToken(scenario)` true iff it matches ≥1 of:
- Digits: `/[0-9]/`
- Currency: `/[₹$€£]/`
- Time-span: `/\b(day|days|week|weeks|month|months|year|years|hour|hours|minute|minutes|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tonight|tomorrow)\b/i`
- Human-role: `/\b(manager|boss|spouse|husband|wife|partner|parent|mother|father|mom|dad|son|daughter|friend|teacher|co-founder|client|landlord|sister|brother|in-law)\b/i`

**E4 helper** — `hasCostMarker(tradeoff)` true iff it matches:
- `/\b(cost|costs|price|give up|gives up|lose|loss|risk|sacrifice|trade|traded|forfeit|at the expense|you may|could miss|downside|pay|pays)\b/i`
- and NOT `/\b(no downside|pure win|no trade-?off)\b/i`

E3 fails a framework if any one of its 5 scenarios lacks a stakes token; E4 fails if any one of its 5
tradeoffs lacks a cost marker (or is a pure-win). Both must pass for all 74.

### 6.2 Preserved v1 suites (bump SW pin only — do NOT restructure)

`accept.spec.mjs`, `visuals.spec.mjs`, `daily.spec.mjs`, `nav.spec.mjs`, `shell.spec.mjs` are NOT
migrated for content — the §5.1 preserved structure keeps them green. ONLY their hardcoded SW version pin
moves to `v9`:
- `tests/visuals.spec.mjs:251` (`pdb-shell-v8` → `v9`)
- `tests/daily.spec.mjs:369` (`pdb-shell-v8` → `v9`)
- `tests/nav.spec.mjs:397` (`pdb-shell-v8` → `v9`)
- (`tests/content.spec.mjs:263` handled above)
Grep `pdb-shell-v` across `tests/` before declaring done; every pin must read `v9`. `accept.spec.mjs` and
`shell.spec.mjs` hold no SW pin (confirm by grep) — do not edit them.

### 6.3 ARIA + keyboard contract for the persona tab widget (B21/B31) — pinned

- Container: `role="tablist"` with an `aria-label` (e.g. "Choose a persona").
- Each tab: `role="tab"`, `aria-selected` (`true` on the active one only), `aria-controls` = its panel's
  per-instance id, an accessible name = the persona label, roving `tabindex` (active tab `0`, others `-1`).
- Each panel: `role="tabpanel"`, `aria-labelledby` = its tab's per-instance id; inactive panels have the
  `hidden` attribute (so exactly one panel is visible).
- Activation model: **selection follows focus** (automatic activation) — ArrowRight/ArrowLeft move the
  selected tab AND its panel; the newly selected tab receives focus and `tabindex=0`. `Enter`/`Space` on a
  focused tab also selects it (no-op if already selected). Home/End are OPTIONAL and NOT required.
- Focus: a visible `:focus-visible` outline (≥3px, matching `accept.spec §5.1`) on the focused tab.
- Motion: any panel-swap transition respects `prefers-reduced-motion: reduce` (no motion when reduced).

## 7. Service worker (B38)

- **S1.** `js/card.js` and `js/data.js` are precached shell assets and both change this sprint. Bump the
  SW cache `pdb-shell-v8` → `pdb-shell-v9` in `sw.js`, with a dated (2026-07-07) comment-trail entry
  naming the Sprint 002 changes (data.js regenerated with 22-ext examples + universalExample removed;
  card.js persona renderer). The precache list is unchanged (same shell files).
- **S2.** The four version pins (§6.2 + content.spec:263) all read `v9`.

## 8. Trace artifact (B28) — required deliverable

Write `/Users/prithviputta/Downloads/pocket-decision-book/.harness/logs/generator_trace_sprint_002.md`
with the SAME structure as Sprint 001 §7 (the Evaluator reuses that checker), but for the **22 extension**
frameworks:

- **§8.1 Structure** (top to bottom): a "# Sprint 002 — draft→counter→final trace" title; a "Validation
  Token Lists" section printing the E3/E4 token lists in the Sprint-001 §7.1 format (D3/D4 lists,
  reference only); a "Sample Frameworks" list naming ≥5 chosen extension frameworks with their category; a
  "## Loop: <id>" section per sample.
- **§8.2 Complete loop** (per the Sprint-001 §7.2 definition): for EACH of the ≥5 samples, for EACH of the
  5 personas — ≥1 draft candidate scenario, ≥1 named "A skeptic says: …" counter per candidate, an
  explicit revision/discard line, and a framework-level `featured=<0..4>` selection with a written reason
  referencing the pre-empted counter. A loop that shows only the featured persona or omits a counter is
  INCOMPLETE.
- **§8.3 Category coverage.** The ≥5 samples MUST cover all FOUR extension categories: ≥1 from each of
  `mental-models`, `cognitive-biases`, `attention`, `decision-processes`, plus ≥1 more (≥5 total).
- **§8.4 All-22 assertion.** The file MUST contain the exact string: **"The draft→counter→final loop was
  applied to all 22 extension frameworks."** Anchored (per Sprint-001 §7.5) to E3+E4 passing for all 22 in
  `content.spec.mjs` (green E3/E4 for the 22 is the machine evidence the loop was applied).

## 9. Commands the Evaluator runs

```bash
cd /Users/prithviputta/Downloads/pocket-decision-book
node scripts/build-data.mjs                 # regenerate data.js (must be a no-op vs committed)
grep -rn universalExample js/ tests/        # MUST return 0 hits
python3 -m http.server 4173 &               # serve for the browser suites
node tests/content.spec.mjs                 # E1–E8 + tab-widget checks + v1 render, 0 failed
node tests/shell.spec.mjs                   # v1 shell, green
node tests/nav.spec.mjs                     # v1 nav, green (SW pin now v9)
node tests/daily.spec.mjs                   # v1 daily, green (SW pin now v9) — inherits new card UI
node tests/visuals.spec.mjs                 # v1 visuals, green (SW pin now v9)
node tests/accept.spec.mjs                  # v1 acceptance click-through, green (+ tab widget coexists)
node scripts/check-originality.mjs          # originality guard, green
```

Plus browser spot checks:
`window.PDB_DATA.frameworks.every(f=>Array.isArray(f.examples)&&f.examples.length===5) === true`,
`window.PDB_DATA.frameworks.some(f=>'universalExample' in f) === false`, and a manual click through a
framework card's persona tabs + keyboard arrows.

## 10. Non-Goals (guarding the sprint boundary — do NOT build these here)

- **No palette/type transformation (Sprint 003).** Do NOT change any v1 palette token VALUE
  (`--bg`/`--surface`/`--surface-2`/`--accent`/`--fg` in either theme) — `content.spec` L233 hardcodes
  and WAITS on the v1 `--bg` values (`rgb(18,20,28)` dark / `rgb(244,241,233)` light); changing them
  breaks the v1 suite now and steals Sprint 003's B32 baseline. Do NOT change any `font-family` declaration
  (B33 baseline). New persona accent tokens are additive and namespaced (`--persona-*`).
- **No hierarchy re-layout (Sprint 003).** No "diagram larger than v1" change, no essence-above-the-fold
  re-work beyond what the example restructure requires. The example UI is the ONLY new visual system this
  sprint.
- **No re-authoring the core 52 examples.** Their scenarios/tradeoffs/featured are frozen from Sprint 001;
  this sprint only migrates them through the schema change + new renderer.
- **No new frameworks, no backend, no library adoption, no hand-editing `js/data.js`, no change to
  `trigger`/`essence`.**
- **No second SVG inside `.card-figure`** (persona glyphs live in the tab widget).

## 11. States that must exist (§6 of spec)

- **Example card, default:** featured example visible with its trade-off paired under a cost label; five
  persona tabs present, featured tab selected + marked.
- **Example card, persona selected:** chosen persona's scenario + tradeoff shown together; active tab
  visually indicated; previous panel hidden (replaced, not stacked).
- **Defensive degrade:** if a framework somehow lacks a valid `examples[]` at render time, the card must
  NOT crash or render `undefined`/`NaN` — it degrades to a sane message in the example section. (Must never
  happen in shipped data; guards the renderer. content.spec MAY assert this with a synthetic
  no-examples entry.)
- **All v1 states preserved:** not-found, empty favorites, first-use daily card, no-match search,
  offline-after-first-load, install fallback — unchanged.

## 12. Definition of done

- 22 extension `AUTHORED` entries have valid `examples[]`+`featured`; their `universalExample` removed.
- `universalExample` removed from build emission, D5 guard, and all banner comments; `grep -rn
  universalExample js/ tests/` → **0 hits**.
- `js/data.js` regenerated via `build-data.mjs` and matches the committed working tree (build is a no-op).
- E1–E8 pass in `content.spec.mjs` over all 74; tab-widget checks (B30/B31/per-instance/keyboard) pass.
- Card renders featured-first + paired trade-off + persona tabs; `.card-prompt` remains terminal (B5);
  exactly one SVG in `.card-figure`; no page h-scroll at 375/320px; persona accents AA in both themes.
- SW bumped to `pdb-shell-v9` with dated comment; all four version pins read `v9`.
- All v1 suites (`shell`/`nav`/`daily`/`visuals`/`accept`) + `content.spec.mjs` + originality guard:
  **0 failed**; zero console errors/warnings.
- Trace artifact `generator_trace_sprint_002.md` exists with ≥5 full loops covering all 4 extension
  categories + the all-22 assertion.
- Committed and pushed to BOTH `origin` and `decision-book` (B39) after the gate passes.
- `generator_trace.log` records files changed, commands, and evidence.

## 13. Explicitly NOT machine-verified this sprint (honest proxy boundary — R2/R4)

- "Scenario shows a FLIP / before→after thought" (qualitative half of B26).
- "Tradeoff cannot be countered / absorbs the steelman" (qualitative half of B27).
- "personalPrompt genuinely touches personal life" (qualitative half of B29).
These are Evaluator-sampled here and finally certified at the Sprint 004 acceptance gate. The B28 trace is
the evidence that countering was performed. The contract does not claim these are automated.
