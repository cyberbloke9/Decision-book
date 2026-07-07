VERDICT: PASS
SCORE: 4.7
BLOCKERS: 0
HIGH: 0

# Sprint 002 Findings — Content Engine & Data Model

Mode: EVALUATE. Every acceptance item in contract §13 was re-verified **independently** (my own RESEARCH.md parser, my own schema pass, my own Playwright browser run, my own steady-state axe scans) — not by trusting the Generator's `tests/content.spec.mjs`. All twelve acceptance items hold. Two non-blocking defects are logged (one Medium craft, one Low process). Neither is a Blocker or a High, so the pass bar (no blockers, no high, evidence >=4, functionality >=4, weighted >=4) is met.

## Evidence summary (independent verification)

| Contract item | Result | How I checked (not the Generator's suite) |
|---|---|---|
| 74 frameworks, per-category 18/13/13/8 + 7/6/5/4 | PASS | Loaded `js/data.js` via window shim; counted by category. Exact match. |
| ids unique kebab; required fields non-empty; pitfalls >=1; category/visualType in allowed sets | PASS | Independent regex + set membership pass over all 74. 0 issues. |
| No placeholder tokens | PASS | `/\b(todo|tbd|lorem|coming soon|placeholder|xxx)\b/i` over every string field + pitfalls. 0 hits. |
| B2 trigger/essence match RESEARCH.md | PASS | Wrote my OWN RESEARCH.md table parser (whitespace/smart-quote normalized), independent of `scripts/extract-content.mjs`. 0 missing rows, 0 field mismatches across all 74. |
| B3 authored fields original + non-empty; every prompt ends `?` | PASS | Independent check: all `personalPrompt.trim()` end `?`; examples/prompts are specific and persona-grounded (F-001 exception is B2 source data, not authored). |
| Six parts render data-driven, prompt last | PASS | Playwright `goto('/#/f/:id')` for ALL 74; asserted `<article.card>` children, `<h2>` name, figcaption non-empty, example present, >=1 pitfall, and `lastElementChild` is `.card-prompt`. 0 render fails, 0 prompt-not-last, 0 missing parts. |
| Adding a valid entry renders with zero renderer edits | PASS | Injected a synthetic entry through `PDB_CARD.renderCard`; correct card, prompt terminal. |
| Not-found (garbage + empty id) with working back-links; zero console errors | PASS | `#/f/definitely-not-real` -> "Framework not found" + links `#/situations`, `#/browse`; `#/f/` -> not-found. 0 console errors across the run. |
| >=12 distinct visualType; VISUAL_TYPES exported | PASS | 37 distinct visualType used; 37 declared in `PDB_DATA.VISUAL_TYPES`. |
| No h-scroll at 375 & 320 on longest card | PASS | `documentElement`/`body` scrollWidth within client width on `planning-fallacy` (longest) at both widths. |
| AA contrast, both themes (steady state) | PASS | My own `@axe-core/playwright` scan, theme set via localStorage BEFORE load (no transition): card + situations, dark + light, 375 + 320 = 0 color-contrast violations in all 8 scans. |
| Offline card render; sw v2; precaches data.js + card.js; old cache purged | PASS | Cold `goto('/#/f/ooda-loop')` with context offline in a fresh page -> full card (name + 4 steps) rendered, 0 errors. `sw.js` CACHE=`pdb-shell-v2`; SHELL includes `js/data.js`,`js/card.js`; activate purges non-current caches. |
| Sprint 001 shell suite still passes; 5 screens unchanged; git hygiene | PASS (see F-002) | `tests/shell.spec.mjs` 50/50 on stable runs; 5 existing screens keep honest copy, no card leak. `.gitignore` covers `.env*`/`*.db`/`.harness/`/`node_modules/`; `git status --porcelain` shows only intended source, no secrets/artifacts. |

Design/craft (§8): the card is a considered, distinctive one-screen artifact — serif display headings + gold accent rails, uppercase letter-spaced kickers, an emphasized "Your Move" prompt block that closes the card on a question (B5). Dark theme = deep navy `rgb(18,20,28)`; light theme = warm cream. Not a component-library default. Authored examples (e.g. OODA's "a competitor ships a feature that reframes your market overnight") are specific and persona-grounded, not filler.

Evidence:
- `/tmp/pdb-truedark.png` — Eisenhower Matrix card, true dark theme.
- `/tmp/pdb-card-light.png` — OODA Loop card, light theme.

---

## Finding F-001: Confirmation Bias trigger renders literal markdown asterisks

Severity: Medium
Category: Craft
Status: Fail (non-blocking)

### Contract Clause
§3.1 `trigger` "matches RESEARCH.md's original phrasing (B2)"; §8 "Direct workbook voice; no hype, no filler" and card must read as a considered artifact.

### Reproduction Steps
1. `python3 -m http.server 4173`
2. `goto('http://localhost:4173/#/f/confirmation-bias')`
3. Read the "When you're facing" trigger line.

### Expected
`You feel satisfied by evidence` (the RESEARCH.md `*satisfied*` is markdown emphasis; the intended rendering is the word emphasized, never literal asterisks).

### Actual
The card displays `You feel *satisfied* by evidence` with literal `*` characters visible to the user — a typo-grade glitch. RESEARCH.md line 107 stores `*satisfied*` as markdown italic; the byte-exact B2 copy carries the raw asterisks into `js/data.js` and the DOM `textContent`.

### Evidence
`node -e` dump of the entry: `trigger: "You feel *satisfied* by evidence"`. Only this one entry of 74 contains stray emphasis markers (independent scan of all triggers/essences confirmed no others).

### Required Fix
Strip inline markdown emphasis markers (`*`/`_` wrapping a word) at build time in `scripts/build-data.mjs` (or in a render-time sanitize in `js/card.js`), so this single RESEARCH.md cell renders as `You feel satisfied by evidence`. Do NOT hand-edit `js/data.js` (it is generated). Keep the B2 comparison consistent by applying the same emphasis-strip in the extractor so the byte-match still holds. Re-run `node scripts/build-data.mjs` then the content suite.

### Pass Condition
The confirmation-bias card's trigger shows no literal `*`/`_` characters, and B2 verbatim-match still passes for all 74.

---

## Finding F-002: Shell regression suite intermittently false-fails on a theme-transition axe frame

Severity: Low
Category: Process
Status: Fail (non-blocking; test reliability, not a product defect)

### Contract Clause
§13 "Sprint 001 shell suite still passes ... zero console errors/warnings anywhere" (the offline/regression gate must be deterministic).

### Reproduction Steps
1. `python3 -m http.server 4173`
2. Run `node tests/shell.spec.mjs` several times.

### Expected
Deterministic 50/50 pass.

### Actual
~1 in 3 runs fails with `axe 320px light/situations color-contrast`. Root cause is the Generator's documented flake: `tests/shell.spec.mjs` flips theme via `setAttribute` WITHOUT emulating `reducedMotion:reduce`, so axe occasionally samples the `.tab-label` color mid-transition (a ~160ms crossfade through a low-contrast mid-gray). I proved this is NOT a real steady-state failure: fresh-load axe scans with the theme applied before paint show 0 color-contrast violations on situations in light at both 375px and 320px (and on the card). The transition is a pre-existing Sprint-001 chrome property, exempt under `prefers-reduced-motion`; no user-facing AA regression exists.

### Evidence
Three consecutive shell runs: 50/0, then `FAIL axe 320px light/situations color-contrast` (49/1), then 50/0. My independent steady-state axe: 8/8 scans = 0 violations.

### Required Fix
Apply the same fix the content suite already uses to the shell suite: emulate `reducedMotion:reduce` (or set the theme via localStorage before `goto`, then reload) before every axe scan in `tests/shell.spec.mjs`, so the regression gate samples a settled frame. This makes the B20/§13 gate deterministic. No product code change is required.

### Pass Condition
`node tests/shell.spec.mjs` passes 50/50 on 10 consecutive runs.

---

## Trace review
`generator_trace.log` is honest and complete: it records the build, the post-review hardening (name-override removal, figure-frame solid border, axe root-cause), and explicitly discloses both defects above as "known risk" rather than hiding them (the `*satisfied*` markdown-render caveat and the shell-transition axe transient). Commands and artifacts are cited; no premature-completion language, no broad rewrite after small findings.

## Scoring
- Design: 5 (distinctive serif+gold system, considered hierarchy, not a default)
- Originality: 5 (authored examples/prompts specific and persona-grounded)
- Craft: 4 (excellent, -1 for the F-001 literal-asterisk glitch)
- Functionality: 5 (all 74 render data-driven; not-found, offline, synthetic-entry all verified)
- Evidence/process: 4.5 (strong independent verification; -0.5 for the flaky F-002 regression gate)
- Weighted (20% each): (5+5+4+5+4.5)/5 = 4.7

PASS: no blockers, no high findings, evidence 4.5 >= 4, functionality 5 >= 4, weighted 4.7 >= 4. F-001 and F-002 are logged for the Generator to clean up (ideally rolled into Sprint 003, which already touches the visual figure and the same build pipeline), but neither blocks this sprint.
