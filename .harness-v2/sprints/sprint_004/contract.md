# Sprint 004 Contract — Polish & Acceptance (ROADMAP Milestone 2, Phase 10)

> Binds: spec.md §5 (B21–B23 re-verified, B24–B40), §6 States, §7 Design Direction, §8 Non-Goals,
> §10 R2/R4/R5, §11 Sprint 004; V2.md A3 (quality bar) / A4 (personalPrompt) / Part B.
> This is the **final milestone sprint**: whole-app regression, the deferred **manual quality/originality
> pass on examples (R2)** and **personal-life prompt coverage (R4)**, a final a11y / reduced-motion /
> performance pass on the new "Field Manual" palette, the one carry-forward polish finding **F-001**
> (essence renders in UI sans, not the editorial serif), and the whole-app acceptance gate. It ends with
> the full v2 history committed and pushed to BOTH remotes (B39).

## 0. Scoping decision this sprint makes explicit (read first)

Sprint 003 froze the examples DATA because it was a CSS-only sprint. **Sprint 004 UN-freezes the examples /
prompt data for TARGETED REPAIR ONLY.** The original human complaint ("examples are vague, not
hard-hitting; they don't touch relationships/personal life") is finally JUDGED here, so the data must be
fixable if the audit surfaces a real defect. The rule:

- **Allowed:** fix a *demonstrated* defect (a scenario that fails B26, a tradeoff that fails B27 / does not
  pre-empt its strongest counter, a `personalPrompt` that only addresses tasks for a people-applicable
  framework) by editing the `AUTHORED` map in `scripts/build-data.mjs`, then `node scripts/build-data.mjs`
  to regenerate `js/data.js`. Every edited entry re-passes the E3/E4/E8 machine regexes and B24/B25 shape.
- **Forbidden:** wholesale re-authoring, touching `trigger`/`essence` (B2 byte-stable), changing the
  persona order/count, or editing `js/data.js` by hand (B37 — regenerate only).
- **Evidence discipline:** any data edit is logged in `generator_trace.log` with the framework id, the
  named counter that forced the change, and the before→after text. Preserve every already-passing entry
  (001/002 both scored 4.9 — the audit may legitimately find little; if so, document that with sampled
  evidence, do NOT manufacture churn).

If `js/data.js` changes this sprint, it is a precached SHELL asset and MUST be named in the SW bump comment
trail (§5). If the audit changes nothing, `node scripts/build-data.mjs` stays a no-op vs committed
`js/data.js` and only `styles/app.css` (F-001) drives the SW bump.

## 1. One-line summary

Fix the carry-forward essence-serif finding (F-001) without regressing the essence-above-the-fold
constraint; run a genuine first-principles counter-audit of the examples (R2) and a personal-life prompt
audit (R4), repairing any real defect via `build-data.mjs`; re-verify a11y / reduced-motion / AA on the
new palette in both themes; add an all-74 render+fold sweep as a machine gate; bump SW `v10`→`v11`; keep
every v1+v2 suite green; and land the whole v2 milestone on BOTH remotes.

## 2. Scope

- **In scope:**
  - `styles/app.css` — the F-001 one-liner (`.card-essence-text` gets `font-family: var(--font-serif)`),
    plus any *targeted* CSS forced by the fold interaction in §3 (width/padding, NOT height; see §3.3).
  - `scripts/build-data.mjs` — targeted example/tradeoff/prompt repairs surfaced by the §4 audit
    (regenerate `js/data.js`; never hand-edit `data.js`).
  - `tests/content.spec.mjs` — add the F-001 regression assertions (§3.2) and (optionally) the all-74
    render+fold sweep (§6) if not placed in a new sweep spec; bump the SW pin.
  - `tests/{visuals,daily,nav}.spec.mjs` — SW version pin bump only (§5).
  - `sw.js` — cache bump `v10`→`v11` + dated comment trail (§5).
  - `.harness/logs/generator_trace_sprint_004.md` — the R2/R4 audit artifact (§4.4), REQUIRED this sprint.
- **Out of scope (do NOT touch):**
  - `trigger`/`essence` TEXT (B2 byte-stable); the persona system order/count/ids; the card DOM structure,
    tab-widget ARIA/keyboard/per-instance ids, featured/paired-tradeoff logic (§5.4 of Sprint 003 stays
    frozen); `js/visuals.js` SVG geometry; nav data; favorites/daily/app logic.
  - The §4 pinned "Field Manual" palette token VALUES and the §5 font tokens from Sprint 003 (this sprint
    does not re-skin; F-001 only changes which existing token `.card-essence-text` consumes).
  - No new frameworks, no backend, no library/framework adoption, no raster content imagery.

## 3. F-001 — essence renders in editorial serif (the carry-forward finding)

Sprint 003 findings F-001 (Medium, non-gated, carried here): `.card-essence-text` sets no `font-family`
and inherits `--font-sans` (Avenir Next), so "THE IDEA" — the core of the card — reads in UI sans while
its sibling parts (trigger/prompt/pitfalls) read in the editorial serif `--font-serif` (Charter). §5.1 of
the Sprint 003 contract explicitly names essence as serif body reading.

### 3.1 Required fix

Add `font-family: var(--font-serif);` to the `.card-essence-text` rule (`styles/app.css:519`). CSS-only,
no DOM/behavior change.

### 3.2 Regression assertion (net-new — grep confirmed zero existing font assertions in tests/)

Add to `tests/content.spec.mjs` (in the rendered-card section, both-theme aware):

- `getComputedStyle(.card-essence-text).fontFamily` FIRST family === `Charter` (the `--font-serif` lead
  family) — asserted in the DEFAULT (dark) theme AND after toggling to light. Pass condition mirrors the
  F-001 finding exactly: essence reads in the same editorial serif as trigger/prompt/pitfalls.

### 3.3 Fold interaction (BLOCKER-class — do not regress B35/H1)

Charter may render taller than Avenir Next. Sprint 003 reported only ~47px fold headroom (worst-case
essence `top` ≈ 589 < 600) with the SANS essence. **Switching essence to serif can push a long-name /
long-essence card past the 600 fold**, regressing B35/H1. Therefore:

- After the F-001 fix, `.card-essence-text` `getBoundingClientRect().top < 600` at 375×667 MUST still hold
  — and MUST be re-verified on WORST-CASE cards (longest framework name + longest trigger + longest
  essence), not only `eisenhower-matrix`. The §6 all-74 sweep is the enforcement.
- If any card regresses past 600, recover by **width / reduced figure or block padding / a small essence
  `font-size` or `line-height` trim**, NEVER by shrinking below AA or by moving essence below other parts.
  Resolve the fold-vs-serif fight without breaking §5.3 order or B35/H2 (diagram `max-width ≥ 380px`).

## 4. Examples & prompt acceptance audit (R2 / R4) — the substantive heart of this sprint

The original complaint was about the EXAMPLES. This sprint is where "hard-hitting / cannot be countered"
(R2) and "touches personal life" (R4) are finally certified. The Generator performs a GENUINE audit; the
Evaluator independently certifies. This is not a rubber stamp and not vibes.

### 4.1 What the Generator MUST do (real audit, not assumed)

- **Counter-audit a spread**, not just featured: sample across ALL FIVE personas and a spread of
  frameworks covering every category (52 core + 22 ext). For each sampled scenario, name the STRONGEST
  counter ("a skeptic says the framework didn't matter here / the persona wouldn't act this way / the
  stakes are fake"). For each tradeoff, check it PRE-EMPTS that counter (B27). For each `personalPrompt`,
  check people-applicable frameworks do not address only tasks/projects (B29/A4).
- **Fix demonstrated defects only**, per §0 (targeted `build-data.mjs` edit → regenerate). Log id + counter
  + before→after in `generator_trace.log`.
- **If little is found**, say so with sampled evidence — do not manufacture changes.

### 4.2 Machine invariants that MUST hold on the FINAL data (all 74, re-run after any edit)

- **B24/B25:** every framework has `examples` = exactly 5, fixed persona order
  `[everyday, student, relationship, high-achiever, privileged]`, each with non-empty `scenario` AND
  non-empty `tradeoff`; `featured` is an int 0–4.
- **B26 (E3/E4):** every one of the 5×74 `scenario` strings contains ≥1 concrete stakes token (number /
  currency ₹$€ / time span-deadline / named human tension). No "imagine you have a task" phrasing.
- **B27 (E8):** every one of the 5×74 `tradeoff` strings contains an explicit cost clause; none says "no
  downside" / "pure win".
- **B29/B5:** every `personalPrompt` is non-empty and ends in "?" and is the terminal card block.
- **B37:** `js/data.js` is only ever the regenerated output of `build-data.mjs` (byte-identical to a fresh
  `node scripts/build-data.mjs` run).
- **No `universalExample`** anywhere: `grep -rn universalExample js/ tests/` = 0 (schema clean since 002).

### 4.3 R2 / R4 sampling method the Evaluator runs (testable, not "vibes")

The Evaluator is directed to (and the Generator must survive):

- **R2 (un-counterable):** sample ≥12 frameworks × their featured scenario + ≥6 non-featured across
  personas. A scenario whose tradeoff does NOT pre-empt its single strongest counter, OR a scenario with no
  real before→after flip (a definition in story clothes), is a **finding**. Relationship-persona scenarios
  MUST be about PEOPLE (marriage/breakup/parenting/aging parents/money-between-family), not projects.
- **R4 (personal-life prompts):** sample ≥12 `personalPrompt`s. A prompt that addresses only
  tasks/projects for a framework that plainly applies to persons is a **finding**.
- These are ACCEPTANCE-GATE JUDGMENTS (R2/R4 are explicitly not fully machine-checkable). The machine
  proxies (§4.2) are necessary but not sufficient; the Evaluator's sampled judgment is the certification.

### 4.4 Trace artifact (REQUIRED this sprint)

Write `.harness/logs/generator_trace_sprint_004.md`. It MUST:

- record the audit method + the frameworks/personas sampled,
- show, for any defect fixed, the named counter → the before→after text,
- if the audit finds nothing fixable, state that explicitly with the sampled evidence supporting it,
- assert the audit was applied across all categories (core + all four extension groups).

(Unlike 001/002 this is an AUDIT trace, not a fresh draft→counter→final authoring loop — the loop already
ran in 001/002; this artifact proves the certification pass was actually performed.)

## 5. Service worker (B38)

`styles/app.css` changes this sprint (F-001), and `js/data.js` MAY change (§4). Both are precached SHELL
assets. Therefore:

- Bump `sw.js` `var CACHE = "pdb-shell-v10"` → `"pdb-shell-v11"`, with a dated (2026-07-07) comment-trail
  entry naming the Sprint 004 change and LISTING every precached asset that changed (always `app.css`;
  add `js/data.js` iff the audit edited data).
- The SHELL precache array is otherwise unchanged (no new files unless a fix demands one — none expected).
- Update ALL FOUR test pins to `v11`:
  - `tests/content.spec.mjs:416`
  - `tests/visuals.spec.mjs:251`
  - `tests/daily.spec.mjs:369`
  - `tests/nav.spec.mjs:397`
- `grep -rn "pdb-shell-v" sw.js tests/` — every live pin reads `v11`, none reads `v10`.
  `accept.spec.mjs`/`shell.spec.mjs` hold no SW pin (do not edit them).

## 6. All-74 render + fold sweep (net-new machine gate — spec §11 "all 74 render correctly")

Add a sweep (in `content.spec.mjs` or a small dedicated spec) that, at 375×667 with a console-error
listener, loops EVERY one of the 74 framework routes `#/f/<id>` and asserts per card:

- the card renders (an `article.card` with the `.card-name` h2 present), zero `undefined`/`NaN` in text;
- the featured example is visible: `.card-example` present with a visible scenario AND its paired tradeoff
  (B30 — tradeoff never hidden while scenario visible);
- exactly 5 persona tabs (`role="tab"`) in fixed order, exactly one `aria-selected="true"`;
- essence above the fold: `.card-essence-text` rect `.top < 600` (this is where the §3.3 F-001/fold
  interaction is enforced across ALL 74, not one card);
- `article.card` `lastElementChild` === `.card-part.card-prompt` (B5);
- exactly ONE `<svg>` under `.card-figure`.
- ZERO console errors/warnings accumulated across the whole sweep.

A single failing framework fails the sweep (this is the "all 74 render featured+personas correctly" gate).

## 7. Final a11y / reduced-motion / performance pass (B21–B23, B36/R5)

Re-verified on the NEW "Field Manual" palette in BOTH themes (a new palette can break contrast — R5):

- **A11y (B21/B22/B23):**
  - `content.spec` + `nav.spec` axe `color-contrast` runs in dark AND light on rendered cards/lists —
    **0 violations** in both (the palette is Sprint-003's; F-001's serif essence must still pass AA on
    `--fg` over `--bg`/`--surface`).
  - Keyboard-only: persona tabs operable via Tab + ArrowLeft/ArrowRight with a visible `:focus-visible`
    outline **≥3px** on `--focus`; bottom-tab nav reachable and operable by keyboard.
  - Tap targets ≥44px on tabs and bottom-tab nav at 375px.
- **Reduced motion (concrete proxy, B36):** the `@media (prefers-reduced-motion: reduce)` block
  (`styles/app.css:956`) MUST actually neutralize card/tab/route transitions — verify by loading with the
  emulated `reduce` preference and asserting transition/animation durations on animated elements resolve to
  ~0 (no residual card/tab transition). Not just "a media query exists."
- **Performance proxy (scoped, not an unbounded claim):** offline-after-first-load still works (service
  worker serves the shell with the network blocked) AND a full card interaction (open framework → switch
  all 5 personas → favorite → open daily card) completes with **0 console errors/warnings**. This is the
  perf/stability proxy; do NOT claim lighthouse-grade "performance" beyond it.

## 8. Whole-app regression + offline click-through (acceptance path)

Every v1 + v2 suite green from a CLEAN server start, and the whole-app offline click-through passes:

- **Suites (0 failed, 0 console errors/warnings each):** `content`, `shell`, `nav`, `daily`, `visuals`,
  `accept`, and `scripts/check-originality.mjs`.
- **Offline click-through (accept-style, network cut after first load):** situation nav → a framework card
  → verify featured example + paired tradeoff + 5 persona tabs render → switch a persona → favorite it →
  open the daily card → toggle theme (flips `--bg` between the §4 v2 values, Story8) → reload (favorite +
  theme persist). All offline, 0 console errors.

## 9. Commands the Evaluator runs

```bash
cd /Users/prithviputta/Downloads/pocket-decision-book
node scripts/build-data.mjs                 # regenerate; if audit made no data edits this is a no-op vs committed js/data.js
git diff --stat js/data.js                   # matches the trace (empty if no data audit edits)
grep -rn universalExample js/ tests/         # 0 hits (schema clean since Sprint 002)
grep -rn "pdb-shell-v" sw.js tests/          # every live pin reads v11; none reads v10
grep -rn "Iowan Old Style" styles/           # 0 live hits (v1 display font gone; §4 comment table OK)
python3 -m http.server 4173 &               # serve for browser suites
node tests/content.spec.mjs                  # E1–E8 + tab widget + axe(both themes) + F-001 serif assert + all-74 sweep + sw v11, 0 failed
node tests/shell.spec.mjs                    # v1 shell, green
node tests/nav.spec.mjs                      # v1 nav + axe(both themes) + sw v11, green
node tests/daily.spec.mjs                    # v1 daily + sw v11, green
node tests/visuals.spec.mjs                  # v1 visuals + sw v11, single .card-figure svg, green
node tests/accept.spec.mjs                   # v1+v2 acceptance click-through; Story8 flips --bg; focus ≥3px, green
node scripts/check-originality.mjs           # originality guard, green
```

Plus browser spot checks (both themes, 375×667):
- `getComputedStyle('.card-essence-text').fontFamily` leads with `Charter` in BOTH themes (F-001 fixed).
- On the WORST-CASE card (longest name/trigger/essence) and a sample of others: `.card-essence-text` rect
  `.top < 600`; card ends on `.card-prompt`; exactly one `.card-figure svg`.
- Emulate `prefers-reduced-motion: reduce`: card/tab transitions resolve to ~0 duration.
- Offline (network blocked): app loads from SW cache; full interaction 0 console errors.
- R2/R4 manual sampling per §4.3.

## 10. States that must exist (spec §6 — all preserved + the serif essence)

- **Example card, default:** featured scenario + paired "cost" tradeoff always co-visible; essence now in
  editorial serif (Charter), consistent with trigger/prompt/pitfalls; 5 persona tabs, featured marked.
- **Example card, persona selected:** chosen persona's scenario + tradeoff shown together; active tab
  indicated; single visible panel (no stacking).
- **Defensive degrade:** missing/invalid `examples` at render → sane message, no crash/`undefined`
  (preserved; the §6 sweep + content.spec synthetic fixture guard it).
- **Theme states:** "Paper" light + "Deep Ink" dark, both AA on the new palette; toggle flips `--bg` and
  persists across reload.
- **Reduced-motion state:** with `reduce` preferred, card/tab transitions are neutralized.
- **All v1 states preserved:** empty favorites, first-use zero-streak daily card, no-match search,
  offline-after-first-load, install-not-offered fallback, not-found — unchanged.

## 11. Non-Goals (guarding the sprint boundary)

- **No wholesale example re-authoring / no new personas / no persona reorder.** Only TARGETED repair of
  demonstrated defects (§0).
- **No `trigger`/`essence` text change** (B2 byte-stable); **no hand-editing `js/data.js`** (B37).
- **No re-skin / no palette-token or font-token value change** (Sprint 003's pinned §4/§5 set stays;
  F-001 only reassigns which existing token essence consumes).
- **No renderer behavior change:** DOM order, tab-widget ARIA/keyboard/ids, featured/tradeoff logic,
  `renderNotFound` all frozen. CSS + targeted data + tests + SW only.
- **No `js/visuals.js` geometry change**, no second `.card-figure` svg, no new frameworks, no backend, no
  library adoption, no raster content imagery, no new build tooling.

## 12. Definition of done (milestone-level — this is the last sprint)

- **F-001 fixed:** `.card-essence-text` computed font-family leads with `Charter` in both themes; regression
  assertion added to `content.spec` and green.
- **Fold preserved:** essence `top < 600` at 375×667 on ALL 74 (the §6 sweep), including worst-case cards,
  AFTER the serif switch; diagram `max-width ≥ 380px` (B35/H2) still holds.
- **Examples audit (R2/R4) done for real:** `generator_trace_sprint_004.md` written with sampled evidence;
  any defect repaired via `build-data.mjs`→regenerate with a logged counter + before→after; every edited
  entry re-passes E3/E4/E8 + B24/B25; if nothing fixable, that is stated with evidence.
- **Machine invariants (§4.2)** hold on final data: 74×5 personas fixed order, non-empty scenario+tradeoff,
  featured 0–4, prompts end "?", 0 `universalExample`, `data.js` == fresh `build-data.mjs` output.
- **All-74 render+fold sweep** green (§6); **a11y/reduced-motion/perf pass** green (§7); **whole-app offline
  click-through** green (§8).
- **All suites** (`content`/`shell`/`nav`/`daily`/`visuals`/`accept`) + originality guard: **0 failed**;
  zero console errors/warnings anywhere.
- **SW bumped to `pdb-shell-v11`** with a dated comment trail listing changed assets; all four pins read
  `v11`; grep gate clean.
- **B21–B23 re-verified** on the new palette (axe 0 violations both themes; focus ≥3px; ≥44px targets).
- **B39 milestone push:** the full v2 history (Sprints 001–004) is committed and pushed to BOTH `origin`
  (pocket-decision-book) and `decision-book` (Decision-book) — not just the 004 commit. Confirm both
  remotes contain the milestone head after the gate passes.
- `generator_trace.log` records files changed, commands, and evidence for every action.

## 13. Explicitly NOT machine-verified (honest proxy boundary — R2/R4/R3)

- **"Un-counterable examples" (R2)** and **"personalPrompt touches personal life" (R4)** — certified by the
  Evaluator's sampled judgment (§4.3), anchored by the machine proxies (§4.2) and the audit trace (§4.4).
  These are acceptance-gate judgments, not fully automatable.
- **"Reads as a genuinely different, considered product" (B34)** — Evaluator judgment, anchored by the
  Sprint-003 palette/type system + the persona system + restructured card (carried, unchanged here).
- **SVG diagram inverse-text contrast** (`v-text-inv` on accent) — not reliably axe-scanned; not a gate
  (as in Sprint 003 §13). No `js/visuals.js` change.
- **Lighthouse-grade performance** — not claimed; the §7 proxy (offline load + full interaction, 0 console
  errors) is the scoped stability/perf evidence.
