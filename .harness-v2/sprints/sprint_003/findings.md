VERDICT: PASS
SCORE: 4.8
BLOCKERS: 0
HIGH: 0

# Sprint 003 Findings — "Field Manual" UI transformation (Phase 9)

Every machine gate in the contract was re-verified independently in a real browser
(Playwright, 375x667, macOS Chromium), not by trusting the Generator's trace or the
committed test output. Every claim reproduced. No blockers, no high findings.

## What was verified (independent evidence)

### B32 — palette (browser-computed, both themes)
Fresh context, route `#/f/eisenhower-matrix`, read from `document.documentElement`:
- Light "Paper": `--bg #e9dfca`, `--surface #f6efdd`, `--accent #b5401d` — EQUAL §4.2 v2, != v1.
- Dark "Deep Ink" (after UI theme toggle): `--bg #201811`, `--surface #2a2015`, `--accent #e2622f` — EQUAL §4.1 v2, != v1.
- Theme toggle via the header control flips `--bg` between the two new values (UV4/Story8), live and reproduced.
- Grep gate clean: only live v1 hex survivors are the two §4 "v1 baseline (before)" comment tables in `app.css` (permitted docs). 12141c/f4f1e9/f0b429/a9741a do not survive as any live token/meta/manifest/test value.

### B33 — type system (rendered on the judge's macOS)
- `.card-name` computed font-family = `"American Typewriter", Rockwell, "Roboto Slab", ...` — a genuine slab display face, rendered distinct from the body. Confirmed by eye in the screenshots ("Eisenhower Matrix" / "YOUR MOVE" set in squared-serif slab).
- `--font-serif` re-led with `Charter` (not Iowan). `--font-display` first family (American Typewriter) != `--font-serif` first family (Charter), different family class.
- `grep "Iowan Old Style" styles/` = 0. `grep "system-ui|-apple-system" styles/app.css` = NONE. v1 font strings gone.
- `--font-display` applied to `.card-name` and `.card-figcaption-name` (css lines 395/510).

### B34 — "different product" (Evaluator eye on macOS)
Screenshots show the restructured example card + five-persona tab system with named glyph/accent identities (diamond/pencil/heart/triangle/crown), a "FEATURED" badge, a boxed "WATCH OUT FOR" caution slip distinct from the open example block, and a slab "YOUR MOVE" prompt. Warm kraft-paper light / warm deep-ink dark. This reads as a considered editorial "field manual", NOT the v1 gold-on-navy generic app. B34's non-gameable evidence (persona system + restructured card) is present and carried through the re-skin.

### B35 — hierarchy (all four halves, simultaneously, at 375x667)
On `#/f/eisenhower-matrix`, measured in-browser:
- H1: `.card-essence-text` rect `.top = 553` (< 600). Above the fold.
- H2: `.card-visual` rendered width = 325px (> v1 baseline 309px) with `max-width: 384px` (>= 380).
- H3: pitfalls render as a bordered "caution slip" container, visually distinct from the open example block (screenshot-confirmed).
- H4: `article.card` `lastElementChild` = `.card-part.card-prompt`. Card still ends on the prompt.

### B36 / R5 — AA on the new palette (both themes)
`content.spec` step 10 and `nav.spec` step 9 run axe `color-contrast` on the rendered card in BOTH themes with `expectBg` migrated to the new `--bg` values; both suites pass 0 violations. Focus outline measured 3px on the active persona tab (accept §5.1). Evaluator's own console listener recorded 0 errors/0 warnings across the full card interaction.

### B38 — service worker
`sw.js CACHE = "pdb-shell-v10"` with a dated (2026-07-07) Sprint 003 "Field Manual" comment-trail entry. All four test pins (content.spec:416, visuals.spec:251, daily.spec:369, nav.spec:397) read v10. accept/shell hold no SW pin.

### Frozen-scope invariants (behavior preserved — this is a CSS sprint)
- `node scripts/build-data.mjs` is a byte-identical no-op vs committed `js/data.js` (verified by diff).
- `grep universalExample js/ tests/` = 0.
- Exactly ONE `<svg>` in `.card-figure` (measured = 1).
- Persona tab widget intact: role=tablist/tab/tabpanel, 5 personas in fixed order, one aria-selected (everyday featured) on load, roving tabindex [0,-1,-1,-1,-1], ArrowRight -> student selected + panel swapped + exactly one visible panel + 3px focus ring. Reproduced live.
- Featured scenario quality (spot check): eisenhower everyday = "...landlord wants the R40,000 rent decision by Friday..." — concrete stakes token + a real flip. Strong.

### Test suites (all green, re-run by Evaluator against a clean server)
content 53/0 . shell 50/0 . nav 75/0 . daily 61/0 . visuals 27/27 . accept 82/0 . originality 9/0. Zero console errors/warnings in every suite.

### Process
Sprint 003 committed locally (a2e2436); both origin and decision-book remotes configured. Push is correctly deferred to post-gate per B39 ("after the sprint passes"). B28 draft->counter->final trace is correctly N/A this sprint (no example authoring) — no generator_trace_sprint_003.md required, and none was flagged missing.

## Notes (non-blocking observations, no action required)
- `.card-essence-text` computes to `--font-sans` (Avenir Next), not `--font-serif`. The contract's prose describes essence as "editorial body reading (serif)", but this is a styling choice, NOT a gated item — the B33 gate is display-face distinctness (satisfied) and v1-font removal (satisfied). Flagging only for the record; not a defect.
- H1 headroom is ~47px on this card (553 vs 600); the Generator reports a worst case of 589 across all 74. Adequate, but a future data change lengthening a name/trigger could erode it. Out of scope for this sprint.

## Scoring
- Design: 5 — coherent, distinctive "Field Manual" identity in both themes; slab display face lands.
- Originality: 5 — persona system + editorial print restructure make this a genuinely different product.
- Craft: 5 — clean palette/font migration, hierarchy holds simultaneously, ARIA/keyboard preserved, 0 console noise.
- Functionality: 5 — all v1+v2 flows work; themes toggle and persist; tabs keyboard-operable.
- Evidence/process: 4 — every claim reproduced independently; slight deduction only because push to both remotes is deferred (legitimately) and thus unverifiable at gate time.
- Weighted total: 4.8.

No blockers. No high findings. Sprint 003 PASSES.

---

## Finding F-001: Essence body text renders in the UI sans, not the editorial serif

Severity: Medium
Category: Design
Status: Fail (non-gated — does NOT block Sprint 003 PASS; carry to Sprint 004 polish)

### Contract Clause
§5.1: "`--font-serif` (editorial body reading: trigger/essence/prompt/pitfalls)". Essence is explicitly named as serif body reading.

### Reproduction Steps
1. Serve the app; open `#/f/eisenhower-matrix` at 375x667.
2. `getComputedStyle(document.querySelector('.card-essence-text')).fontFamily`.

### Expected
`.card-essence-text` renders in `--font-serif` (Charter), consistent with trigger/prompt/pitfalls, per §5.1.

### Actual
Computed font-family = `"Avenir Next", Avenir, "Segoe UI", ...` (i.e. `--font-sans`). `styles/app.css:519` `.card-essence-text` sets NO `font-family`, so it inherits sans from a container while sibling parts (trigger/prompt/pitfalls) set serif explicitly. Result: the "THE IDEA" paragraph — the core of the card — reads in UI sans while everything around it is editorial serif. Accidental inheritance, not an intentional style.

### Evidence
`grep -n card-essence-text styles/app.css` -> line 519 block has only margin/font-size/line-height/color; no font-family. Browser computed value = Avenir Next (sans). Screenshots confirm the "THE IDEA" body differs in feel from the italic-serif trigger above it.

### Required Fix
Add `font-family: var(--font-serif);` to `.card-essence-text` (styles/app.css:519). CSS-only, no DOM/behavior change.

### Pass Condition
`getComputedStyle('.card-essence-text').fontFamily` leads with `Charter` (the `--font-serif` first family) in both themes; essence reads in the same editorial serif as trigger/prompt/pitfalls.
