# Product Spec — Pocket Decision Book v2.0 (hard-hitting examples + UI transformation)

> BROWNFIELD milestone on a PASSED v1.0 app. This is v2.0 = ROADMAP.md Milestone 2, Phases 7–10.
>
> Canonical inputs (authoritative, on disk — READ THESE, they are part of this spec):
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/V2.md` — the raw human feedback + persona rubric + quality bar + design direction. **This spec operationalizes V2.md; where V2.md gives a quality bar, this spec makes it a testable defect.**
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/ROADMAP.md` — Milestone 2, Phases 7–10 = the four sprints below (1:1).
> - `/Users/prithviputta/Downloads/pocket-decision-book/.planning/RESEARCH.md` — the canonical 74-framework content inventory + copyright ground rules (still bind).
> - `/Users/prithviputta/Downloads/pocket-decision-book/.harness-v1/spec.md` — the v1 spec that defines behaviors **B1–B23**. Every B1–B23 guarantee SURVIVES v2 except where this spec names an explicit amendment (see §5).
>
> Context-isolation rule: if it is not written here (or in the four files above, which this spec binds as mandatory reading), it does not exist for the Generator or Evaluator. Where this spec and V2.md/RESEARCH.md disagree on a number, RESEARCH.md wins on content, V2.md wins on the v2 data shape and design direction, and this spec wins on process and gate boundaries.

## 1. Original Request

Verbatim human request that triggered this milestone:

> "https://github.com/cyberbloke9/Decision-book.git ( push and commit to this git) also ensure you have transformed the UI of the application, along with the examples (they are vague - They are not hard hitting) , they do not delve into personal questions and relationships questions either, they do not translate into real life examples of normal people, average people, smart people, extraordinarily privileged people etc! So i want you to apply critical thinking and first principles here and give vast examples and how to apply it with countering logics until you decide on a final example that can make sense for each framework! Give atleast 5 examples that cannot be countered with and also give trade-offs for each!"

Three concrete demands: (a) push/commit to the `decision-book` remote (in addition to `origin`); (b) transform the UI so it reads as a different, considered product; (c) replace the single vague `universalExample` on every framework with FIVE hard-hitting, persona-diverse examples — each with a trade-off, each surviving counter-argument — authored via an explicit draft→counter→final loop.

## 2. Product Goal

Make the app's examples land: every one of the 74 frameworks carries five concrete, un-counterable real-life examples across five human personas (everyday / student / relationship / high-achiever / privileged), each paired with an honest trade-off, one chosen as the "featured" example after adversarial countering. And re-skin the whole app into a distinct "pocket field-manual / editorial print" identity so it no longer reads as a competent-but-generic dark app. No v1 capability is lost.

## 3. Target User

Unchanged from v1: a person reaching for a decision framework in the moment, on a phone, offline-capable. v2 widens WHO the examples speak to: not just the founder/builder, but a nurse, a student, someone navigating a marriage or aging parents, a driven specialist, and someone for whom money is not the constraint. The user should NOT need to know any framework by name, what a service worker is, or that the content descends from a book.

## 4. Core User Stories

1. As a reader, I **open a framework card** and immediately see the ONE featured example with its trade-off visually paired ("here's the situation" → "here's the cost"), so the framework's point lands in seconds.
2. As a reader who wants a scenario that fits MY life, I **tap a persona** (everyday / student / relationship / high-achiever / privileged) and see that persona's example + trade-off for this framework, without leaving the card.
3. As a reader in a relationship/family situation, I **find examples about people** (marriage, breakup, parenting, aging parents, money-between-family), not only about projects and work.
4. As a returning v1 user, I **still** browse by quadrant/category, search, favorite, use situation navigation, and open the daily card — every v1 flow works exactly as before, only better-looking.
5. As any user, I **install** and **use fully offline** after first load, in either the new light ("paper") or dark ("deep-ink") theme, with the choice persisting.
6. As the maintainer, every sprint is **committed and pushed to BOTH** `origin` and `decision-book` remotes.

## 5. Required Behaviors

Behaviors are atomic and testable. New behaviors are numbered **B24+**. Amendments to v1 behaviors are stated against their v1 number. All un-amended v1 behaviors B1–B23 remain in force and their suites must stay green.

### Data shape (the examples overhaul)

- **B24 — `examples[]` shape.** Every framework carries `examples`: an array of **exactly 5** objects in this FIXED order and with these exact `persona` string values:
  1. `{ persona: "everyday",      scenario: "...", tradeoff: "..." }`
  2. `{ persona: "student",       scenario: "...", tradeoff: "..." }`
  3. `{ persona: "relationship",  scenario: "...", tradeoff: "..." }`
  4. `{ persona: "high-achiever", scenario: "...", tradeoff: "..." }`
  5. `{ persona: "privileged",    scenario: "...", tradeoff: "..." }`
  Plus `featured`: an integer 0–4 selecting the example shown first. Persona definitions are in V2.md §A2 and bind (everyday = average working person with real money/time pressure; student = low-leverage early-career; relationship = the framework applied to PEOPLE not projects; high-achiever = smart operator whose own intelligence is the trap; privileged = money is not the constraint, attention/trust/meaning/succession/reputation are).
- **B25 — 5/5 personas, no gaps.** For every framework, all five persona slots are present, in the fixed order, each with a non-empty `scenario` AND a non-empty `tradeoff`. A missing persona, an empty string, a duplicated persona, or a placeholder value is a defect.
- **B26 — hard-hitting scenario bar (applies to ALL 5, not just featured).** Every `scenario` MUST contain at least one concrete stakes token: a number, a currency amount (₹/$/€), a time span/deadline (weeks/months/years/"by Friday"), or a named human tension (a specific person/role — a manager, a spouse, a parent). "Imagine you have a task"-style abstract phrasing is a defect. Every scenario must show the framework FLIP or sharpen the decision (an implicit before-thought → after-thought), not restate the essence in story clothing. Four bland scenarios plus one strong one is a FAILING entry.
- **B27 — trade-off absorbs the steelman (applies to ALL 5).** Every `tradeoff` MUST state an explicit COST of the framework-guided choice — a clause naming what is given up, risked, or made worse ("you may kill a project that would have turned…", "this costs you…", "the price is…"). A tradeoff of "no downside" / "pure win" is a defect. The strongest counter-argument to that example is pre-empted inside the tradeoff — this is the operational meaning of "cannot be countered."
- **B28 — draft→counter→final authoring loop with a trace artifact.** The examples are authored by an explicit first-principles loop: for each framework, draft candidate scenarios, ATTACK each with the strongest counter-logic ("a skeptic says the framework didn't matter here / this persona wouldn't act this way / the stakes are fake"), revise or discard, then select `featured` = the single example that best survives. The Generator MUST write a per-sprint trace artifact at `/Users/prithviputta/Downloads/pocket-decision-book/.harness/logs/generator_trace_sprint_00N.md` showing this loop IN FULL for at least **5 sample frameworks** in that sprint (draft candidates → named counter-attack → revision/discard → featured selection with reason), and MUST assert in that file that the loop was applied to every framework in the sprint. The Evaluator verifies this artifact exists and contains ≥5 full loops.
- **B29 — personalPrompt personal-life audit.** Every framework's `personalPrompt` is re-audited so it is allowed to touch personal life (relationships, family, money, identity, health), not only work/projects, where the framework naturally applies to persons. It must still end in "?" (preserves B5). Any prompt that only addresses tasks/projects for a framework that plainly applies to people must be rewritten. (Machine-checkable part: still ends in "?", still non-empty, still the terminal card block. "Touches personal life" is verified by Evaluator sampling + the acceptance-gate manual pass — see §10 R4.)

### Schema amendment (against v1 B1/B3)

- **B1 (amended).** The per-framework schema ADDS `examples` (array of 5, per B24) and `featured` (int 0–4). It REMOVES `universalExample` — but only at the transition point defined in §11 (Sprint 002 removes it app-wide; Sprint 001 keeps it, see the transition contract). All other B1 fields (`id`, `name`, `category`, `trigger`, `essence`, `visualType`, `personalPrompt`, `pitfalls[]`, optional `steps[]`) are unchanged.
- **B3 (amended).** The Generator-authored original fields are now `examples[]` (5× scenario+tradeoff), `personalPrompt`, and `pitfalls[]`. Same originality bar as v1 (authored from the concept, never from the book's wording).
- **B2 (unchanged, still binding).** `trigger` and `essence` remain byte-stable copies of RESEARCH.md cells for all 74 frameworks. v2 does NOT touch them.

### Card rendering (against v1 B4)

- **B30 — featured-first example presentation.** The card renders the `featured` example prominently, with its `scenario` and its `tradeoff` visually PAIRED — scenario shown, then a labelled cost element (e.g. a "The cost" / "Trade-off" label). **The tradeoff is NEVER hidden while its scenario is visible** (no state exists where a scenario shows without its paired tradeoff).
- **B31 — persona-tabbed remaining four.** The other four persona examples are reachable behind one tap via persona-labelled tabs or an accordion. Each persona has a consistent named visual identity (label + accent + optional glyph) reused across every card (the "persona system"). Selecting a persona shows that persona's scenario AND its tradeoff together (B30 pairing holds for every persona, not just featured). This is a NET-NEW interactive widget: it must satisfy B21 with correct tab/accordion ARIA semantics (`role="tablist"`/`tab`/`tabpanel` or equivalent accordion semantics), arrow-key navigation between personas, roving `tabindex`, and a visible focus state; selecting a persona swaps a live content panel with an accessible name.
- **B4 (amended).** The renderer produces the card purely from the data entry; adding a framework with a valid `examples[]` renders correct featured + persona tabs with zero renderer edits. The card STILL ends on the `personalPrompt` block (B5 preserved — personalPrompt is the terminal card-part). **EVERY render path and test fixture that consumed `universalExample` migrates in Sprint 002, not only `card.js`.** Known consumers today: `js/card.js:159` (renderer) and `tests/content.spec.mjs` (lines ~110/127/140/161 — the synthetic-fixture and per-framework assertions). `js/daily.js` reuses the card renderer and holds no direct `universalExample` reference, so it inherits the migration automatically — but the Generator MUST grep `universalExample` across `js/` and `tests/` before declaring Sprint 002 done and migrate every remaining hit to `examples[featured]`.

### UI transformation (design → observable, against v1 §7)

- **B32 — palette actually changed (testable proxy).** The v1 core surface/accent CSS custom-property values MUST change by a perceptible margin (not a 1-hex-digit dodge). The v1 baseline (the "before", from `styles/app.css`) is:
  - Dark theme: `--bg:#12141c`, `--surface:#1b1e2b`, `--surface-2:#232739`, `--accent:#f0b429`, `--fg:#eceef5`.
  - Light theme: `--bg:#f4f1e9`, `--surface:#ffffff`, `--surface-2:#efeade`, `--accent:#a9741a`, `--fg:#1b1d26`.
  The v2 palette is a documented, named set (name it in a CSS comment). At minimum `--bg`, `--surface`, and `--accent` in BOTH themes must differ from these baseline values by a clearly visible amount. Direction: a paper-warm light theme and a deep-ink dark theme (the "pocket field-manual / editorial print" identity).
- **B33 — type system actually changed.** The v1 font stacks (`--font-serif: "Iowan Old Style", … serif`; `--font-sans: system-ui, …`) MUST change: introduce a display face for framework NAMES that is a genuinely different family from the body face (not a reordered version of the same serif stack). The v1 display/body font-family value must not survive unchanged.
- **B34 — "different product" primary signal.** Beyond hex/font diffs (which are necessary but gameable), the app must present the NEW persona visual system (B31) and the RESTRUCTURED example card (featured + paired tradeoff + persona tabs, B30/B31) — these are the primary observable evidence that this is a different, considered product, not the same app with tweaked colors.
- **B35 — hierarchy.** `essence` stays above the fold at 375px; the framework diagram is larger than v1; pitfalls are visually distinct from examples; the card still ENDS on the personal prompt.

### Preserved v1 guarantees (explicitly re-asserted)

- **B36 — all v1 behaviors survive.** Bottom tab navigation, offline-after-first-load, favorites persistence, theme persistence, daily-card deterministic rotation, situation navigation (every trigger → ≥2 frameworks), ≤3-tap reachability, search with empty/no-match states, inline-SVG visuals with no external image fetch, localStorage-only (no backend) — all remain. B21–B23 (keyboard operability + visible focus + accessible names; AA contrast ≥4.5:1 body text; ≥44px tap targets) remain, and **AA contrast is RE-VERIFIED on the new v2 palette in both themes** (a new palette can break contrast). 375px = no horizontal scroll anywhere. `prefers-reduced-motion` respected.

### Build & delivery process

- **B37 — data regeneration only via the build script.** `js/data.js` stays GENERATED — never hand-edited. The `examples[]`+`featured` data grows the `AUTHORED` map in `scripts/build-data.mjs` (which currently holds `universalExample`/`personalPrompt`/`pitfalls`/`steps` per id); regenerate with `node scripts/build-data.mjs`. The build's join guard (trigger/essence from RESEARCH.md joined to authored fields) stays intact.
- **B38 — SW cache bump on any precached-asset change.** The service worker precaches this SHELL: `./`, `index.html`, `styles/app.css`, `js/data.js`, `js/nav-data.js`, `js/favorites.js`, `js/daily.js`, `js/visuals.js`, `js/lists.js`, `js/card.js`, `js/app.js`, `manifest.json`, and the three icons. ANY sprint that changes ANY of these files MUST bump the SW cache version (currently `pdb-shell-v7`) and add a dated comment-trail entry explaining the bump. (This includes Sprint 001/002 — `js/data.js` and `js/card.js` are precached, so the examples sprints bump the SW too, not only the UI sprint.)
- **B39 — dual-remote push.** After every sprint passes, commit and push to BOTH `origin` (github.com/cyberbloke9/pocket-decision-book) and `decision-book` (github.com/cyberbloke9/Decision-book). A sprint is not "delivered" until it exists on both remotes.
- **B40 — copyright unchanged.** All new example/tradeoff/prompt text is original authoring from the concept itself. Never quote the book. `trigger`/`essence` stay byte-stable (B2). Standard diagram forms remain free under merger doctrine.

## 6. States That Must Exist

- **Example card, default:** featured example visible with its trade-off paired beneath/beside it under a clear "cost" label; four persona tabs present but unselected.
- **Example card, persona selected:** chosen persona's scenario + tradeoff shown together; active persona tab visually indicated (accent + label); previously shown example replaced, not stacked into a wall.
- **Empty/degenerate example (defensive):** if a framework somehow lacks a valid `examples[]` at render time, the card must not crash or render `undefined` — it degrades to a sane message. (This must never happen in shipped data; it guards the renderer.)
- **Theme states:** new light "paper" theme and new dark "deep-ink" theme, each AA-compliant; toggle persists across reload; `--bg` flips on toggle (v1 accept.spec Story8 still asserts this and must pass on the new values).
- **All v1 states preserved:** empty favorites, first-use zero-streak daily card, no-match search, offline-after-first-load, install-not-offered fallback — unchanged.
- **Transition state (Sprint 001 only):** the 52 core frameworks carry BOTH `universalExample` (for the untouched v1 renderer) AND the new `examples[]`+`featured`; the 22 extensions still carry only `universalExample`. The app renders correctly in this mixed state (see §11).

## 7. Design Direction

Satisfied ONLY by observable criteria. A recolored-but-identical v1, or a scenario set where four of five personas are bland, FAILS.

- **Identity:** "pocket field-manual / editorial print." Paper-warm light theme, deep-ink dark theme. Generous margins, a visible grid, a display face for framework names distinct from the body face. This must read as a DIFFERENT product from v1 at a glance — evidenced by B31 (persona system) + B30 (restructured example card) + B32/B33 (changed tokens/fonts).
- **Example as the heart of the card:** featured example prominent; scenario→cost pairing explicit and always co-visible (B30); persona-tabbed remainder (B31); each persona a consistent named accent/label/glyph across all cards.
- **Hierarchy:** essence above the fold at 375px; diagram larger than v1; pitfalls visually distinct from examples; card ends on the personal-prompt question (B35, B5).
- **Anti-patterns (defects):** no framework/library adoption (stays vanilla); no raster imagery for content (inline SVG only; manifest icons remain the only rasters); no lorem-ish placeholder styling; no loss of any v1 test guarantee; no cosmetic 1-hex-digit token "change" that leaves the app visually identical (B32 requires a perceptible margin); no scenario that reads as a restated definition.
- **Tone:** direct workbook voice; scenarios name real stakes; trade-offs are honest about cost. No hype.

## 8. Non-Goals

- No new frameworks beyond the 74 in RESEARCH.md.
- No backend, accounts, sync, sharing — still localStorage-only, client-only.
- No framework/library adoption; no build tooling beyond the existing `build-data.mjs` + static files.
- No change to `trigger`/`essence` text (B2 byte-stable).
- No spaced-repetition engine; no feature work outside examples + UI transformation.
- No editing `js/data.js` by hand (regenerate only).

## 9. Technical Constraints

- **Stack:** vanilla HTML/CSS/JS; runs from static files; fully offline after first load. Unchanged from v1.
- **Data pipeline:** `scripts/build-data.mjs` (AUTHORED map) → `node scripts/build-data.mjs` → `js/data.js` (generated). Join guard preserved. The AUTHORED entries gain `examples`+`featured`.
- **Renderer:** `js/card.js` gains featured-first + persona-tab rendering (B30/B31) while keeping personalPrompt terminal (B5). Persona visual system lives in `styles/app.css` + `js/card.js`.
- **Service worker:** `sw.js` cache version bumps with a comment trail on any precached-asset change (B38). Current version `pdb-shell-v7`.
- **Content counts (from RESEARCH.md):** 52 core Decision Book models + 22 extensions (7 mental models + 6 biases + 5 attention + 4 processes) = **74**. Sprint 001 authors examples for the 52 core; Sprint 002 authors the 22 extensions. All 74 complete by end of Sprint 002.
- **Persistence & assets:** localStorage-only; inline SVG only; manifest icons the only rasters. Unchanged.
- **Copyright:** original authoring only; never quote the book (RESEARCH.md ground rules, refuted fair-use-quoting claim). Unchanged.
- **Git:** two remotes, both pushed after each sprint (B39).

## 10. Risks and Ambiguities

- **R1 — Sprint-boundary schema break (highest risk).** `js/card.js` renders `fw.universalExample` and `content.spec.mjs` asserts it non-empty for all 74. If Sprint 001 removes `universalExample` from the 52, those 52 cards render `undefined` and Sprint 001's OWN gate fails. *Default (binding, see §11):* Sprint 001 KEEPS `universalExample` on all 74 and, for the 52, sets `universalExample = examples[featured].scenario` so it stays consistent; the renderer is untouched in Sprint 001; `content.spec` gets ADDED `examples[]` checks but RETAINS the `universalExample` check and tolerates the mixed shape (52 have examples, 22 don't yet). Sprint 002 adds `examples[]` to the 22, ships the persona renderer, removes `universalExample` app-wide, and ONLY THEN supersedes the old `universalExample` assertions. Every sprint gate stays green.
- **R2 — "Cannot be countered" is partly a judgment call.** *Testable proxies:* B26 (every scenario has a concrete stakes token + shows a flip) and B27 (every tradeoff names an explicit cost clause). *Default:* the Evaluator enforces the machine-checkable proxies and samples for quality; full "un-counterable" certification is a manual acceptance-gate judgment (Sprint 004). The draft→counter→final trace (B28) is the required evidence that countering was actually performed.
- **R3 — The token/font proxy is gameable.** A Generator could nudge one hex digit and claim "changed." *Default:* B32 requires a perceptible margin on `--bg`/`--surface`/`--accent` in both themes vs. the pinned v1 baseline, and B34 makes the new persona system + restructured card the PRIMARY "different product" evidence — those are not gameable by recoloring. The Evaluator must weigh B34 over B32 when judging "transformed."
- **R4 — "personalPrompt touches personal life" isn't cleanly machine-checkable.** *Default:* machine checks = ends in "?", non-empty, terminal block (B29/B5). Human-life coverage is verified by Evaluator sampling + the Sprint 004 acceptance-gate manual pass. Do not dress this as fully automatable.
- **R5 — New palette can break AA contrast.** *Default:* B36 requires AA re-verification (axe/contrast check) on the NEW palette in BOTH themes; a palette that ships below 4.5:1 body text is a defect even if prettier.
- **R6 — Authoring volume (74 × 5 scenarios + 74 × 5 tradeoffs + prompt audit) is large.** *Default:* split across Sprint 001 (52 core) and Sprint 002 (22 ext), each gated independently; the counter-loop trace proves depth without requiring all 74 loops be shown in full (≥5 samples per sprint + an assertion of full application).

## 11. Suggested Sprint Breakdown

Four sprints, 1:1 with ROADMAP.md Milestone 2 Phases 7–10. Do not re-architect the boundaries. Each sprint ends with commit + push to BOTH remotes (B39) and, if it touched a precached asset, an SW cache bump (B38).

- **Sprint 001 — Examples engine, core 52 (Phase 7).** Add `examples[]`+`featured` (B24–B27) for the 52 Decision Book models via the draft→counter→final loop (B28, trace artifact required); audit their `personalPrompt`s (B29). KEEP `universalExample` on all 74; for the 52 set `universalExample = examples[featured].scenario` (R1 transition). Renderer untouched. Regenerate `js/data.js` via `build-data.mjs` (B37); bump SW (B38, `js/data.js` precached). *Contract-testable:* 52/52 have exactly 5 personas in fixed order with non-empty scenario+tradeoff; every scenario has a concrete stakes token; every tradeoff has an explicit cost clause; `universalExample` still non-empty for all 74 (v1 `content.spec` still green); trace artifact shows ≥5 full countering loops; pushed to both remotes.
- **Sprint 002 — Examples engine, extensions 22 + card UI (Phase 8).** Author `examples[]`+`featured` for the 22 extension frameworks (same bar/loop/trace); audit their prompts. Ship the card renderer: featured-first + paired trade-off (B30) + persona-tabbed remaining four with the persona visual system (B31); card still ends on personalPrompt (B4/B5). REMOVE `universalExample` app-wide — from `AUTHORED`/`data.js`, from EVERY render path (grep `universalExample` across `js/` and `tests/`; migrate `card.js` and the `content.spec.mjs` synthetic fixture + assertions to `examples[featured]`; `daily.js` inherits via the shared renderer) — and supersede the old `content.spec` `universalExample` assertions with `examples[]`/`featured` assertions. Regenerate data; bump SW (`data.js` + `card.js` precached). *Contract-testable:* all 74 complete (5/5 personas each); trade-off never hidden when its scenario is visible; persona tab switch shows scenario+tradeoff together; card ends on prompt; no `universalExample` references remain in renderer or data; pushed to both remotes.
- **Sprint 003 — UI transformation (Phase 9).** New visual identity per §7 / V2.md Part B: changed palette (B32) + changed type system with a distinct display face (B33), documented named token set; persona visual system consistent across all cards; hierarchy pass (B35). Both themes AA re-verified on the new palette (B36/R5). All v1 behavior suites stay green (shell/nav/daily/visuals/accept). Bump SW (`app.css`/`index.html` precached). *Contract-testable:* `--bg`/`--surface`/`--accent` differ from the pinned v1 baseline by a perceptible margin in both themes; the v1 display/body font-family no longer present unchanged; axe passes in both themes; offline click-through of situation→framework→favorite→daily card still passes; theme toggle flips `--bg` (accept.spec Story8); pushed to both remotes.
- **Sprint 004 — Polish & acceptance (Phase 10).** Whole-app regression; manual quality/originality pass on examples (R2) and personal-life prompt coverage (R4); performance + reduced-motion + a11y final; acceptance gate (EVALUATE_SYSTEM) across the whole app. *Contract-testable:* every v1 + v2 suite green; all 74 frameworks render featured+personas correctly; B21–B23 hold on the new palette; whole-app offline click-through passes; final commit pushed to both remotes.

---
*Written by the Planner for the v2.0 harness run, 2026-07-07. Sprints 001–004 map to ROADMAP.md Milestone 2 Phases 7–10.*
