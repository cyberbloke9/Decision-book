# Sprint 001 Contract — Examples engine, core 52 (ROADMAP Milestone 2, Phase 7)

> Binds: spec.md §5 (B24–B29, B37–B40), §6 transition state, §10 R1/R2/R4/R6, §11 Sprint 001.
> This is a **DATA-ONLY** sprint. The card renderer, the CSS palette, the type system, and the
> persona-tab UI are **explicitly out of scope** (see Non-Goals). If a change touches `js/card.js`
> rendering logic or `styles/app.css` tokens, it is out of contract.

## 1. One-line summary

Add a validated `examples[]` (5 personas) + `featured` index to the **52 core** frameworks via an
explicit draft→counter→final authoring loop, re-audit those 52 `personalPrompt`s for personal-life
reach, keep the app rendering correctly in the mixed 52-have-examples / 22-don't state by setting
`universalExample = examples[featured].scenario` for the 52, regenerate `js/data.js`, bump the SW
cache, keep every v1 suite green, and push to both remotes.

## 2. Scope — the 52 "core" set (defined by category, not by ID list)

The **core 52** = every framework whose `category` is one of:
`improve-yourself` (18) + `understand-yourself` (13) + `understand-others` (13) + `improve-others` (8) = **52**.

The **extension 22** = `mental-models` (7) + `cognitive-biases` (6) + `attention` (5) + `decision-processes` (4) = **22**.
Extensions get their `examples[]` in Sprint 002 and are **untouched** here (except they keep their existing `universalExample`).

(Reference — the 52 core IDs, in RESEARCH order, are IDs 1–52 of `scripts/build-data.mjs`:
`eisenhower-matrix … future-of-decisions-model`. The 22 extension IDs are `second-order-thinking … cynefin`.)

## 3. User-visible behavior (be honest: the new data is NOT a new widget yet)

The renderer is untouched, so there is **no new UI** in this sprint. The only user-visible delta:

- **UV1 — Featured scenario replaces the old vague example on the 52 core cards.** Because
  `universalExample` for the 52 is set to `examples[featured].scenario`, opening any of the 52 core
  cards shows the newly-authored featured scenario in the existing example slot. The 22 extension
  cards are unchanged.
- **UV2 — No v1 regression.** Every v1 flow (bottom-tab nav, browse by quadrant/category, search +
  empty/no-match, favorites persistence, theme toggle + persistence, daily card, situation
  navigation, offline-after-first-load, install fallback, not-found state) behaves exactly as before.

Everything else this sprint delivers is verified at the **data layer** (`window.PDB_DATA.frameworks`),
in the **build source** (`scripts/build-data.mjs`), and in the **trace artifact** — not through new UI.

## 4. Data contract (the deliverable)

For each of the **52 core** frameworks, the `AUTHORED` entry in `scripts/build-data.mjs` gains:

```js
examples: [                          // EXACTLY 5, fixed persona order
  { persona: "everyday",      scenario: "…", tradeoff: "…" },
  { persona: "student",       scenario: "…", tradeoff: "…" },
  { persona: "relationship",  scenario: "…", tradeoff: "…" },
  { persona: "high-achiever", scenario: "…", tradeoff: "…" },
  { persona: "privileged",    scenario: "…", tradeoff: "…" }
],
featured: <int 0..4>                  // index of the example shown first
```

Then `universalExample` for those 52 is set to **exactly** `examples[featured].scenario` (byte-equal).

Hard requirements (all machine-checkable):

- **D1 (B24/B25).** Each of the 52 has `examples` = array of length **5**, personas exactly
  `["everyday","student","relationship","high-achiever","privileged"]` **in that order**, no
  duplicates, no gaps. Each entry has a non-empty `scenario` (string) and a non-empty `tradeoff` (string).
- **D2 (B24).** Each of the 52 has `featured` an integer in `[0,4]`.
- **D3 (B26 proxy — applies to ALL 5 scenarios).** Every `scenario` contains at least one concrete
  stakes token — a digit, a currency glyph, a time-span word, or a named human-role token. **The exact,
  authoritative token list and its regex forms are pinned in §6.1 (D3 helper); §6.1 governs.** "Imagine
  you have a task"-style abstract phrasing is a defect. (The "shows a flip" half of B26 is
  Evaluator-sampled + Sprint 004 acceptance, NOT automated — see §9.)
- **D4 (B27 proxy — applies to ALL 5 tradeoffs).** Every `tradeoff` names an explicit cost. Machine
  proxy: the tradeoff contains at least one cost-marker token. **The exact, authoritative cost-marker
  list and its regex form are pinned in §6.1 (D4 helper); §6.1 governs.** A tradeoff containing "no
  downside", "pure win", "no trade-off", or "free" (as the whole claim) is a defect. (Full "cannot be
  countered" is Evaluator-sampled + Sprint 004 — see §9.)
- **D5 (transition, R1).** For each of the 52: `universalExample === examples[featured].scenario`
  (string equality). For all 74: `universalExample` is a non-empty string.
- **D6 (machine part of B29).** Each of the 52 `personalPrompt`s MUST:
  - be non-empty (length > 0),
  - end with `?`,
  - remain the terminal card block in the (unchanged) renderer (preserves B5).
  These three are machine-checkable in `content.spec.mjs`.
- **D6-audit (sampled/manual part of B29).** The Generator re-examines each of the 52 prompts to check
  whether it naturally invites personal-life application (relationships/family/money/identity/health) in
  contexts where the framework applies to people, not just projects. "Touches personal life" is verified
  by Evaluator sampling + the Sprint 004 acceptance gate (R4). **No new artifact, metadata, or source
  comment is required** — the prompt text itself is the evidence. This is a design principle, not an
  automated contract check; the Generator is not required to prove it mechanically.
- **D7 (B37).** `js/data.js` is regenerated by `node scripts/build-data.mjs` — never hand-edited. The
  build join guard (trigger/essence from RESEARCH.md) stays intact; `trigger`/`essence` remain
  byte-stable for all 74 (B2).
- **D8 (no placeholders, B40).** No `TODO/TBD/lorem/placeholder/coming soon/xxx` tokens in any new
  scenario/tradeoff/prompt. No text quoted from the book (original authoring; RESEARCH.md ground rules).

## 5. Service worker + tests-pinning-version (the silent gate-breaker)

- **S1 (B38).** `js/data.js` is a precached shell asset, so bump the SW cache version `pdb-shell-v7` →
  `pdb-shell-v8` in `sw.js`, with a dated comment-trail entry explaining the bump (Sprint 001, data.js regenerated).
- **S2.** FOUR test files hardcode the SW version and MUST be moved to `v8` or they fail:
  - `tests/content.spec.mjs:207` (`/pdb-shell-v7/`)
  - `tests/visuals.spec.mjs:251` (`/pdb-shell-v7/`)
  - `tests/daily.spec.mjs:369` (`CACHE = "pdb-shell-v7"`)
  - `tests/nav.spec.mjs:397` (`CACHE = "pdb-shell-v7"`)
  Grep `pdb-shell-v` across `tests/` before declaring done; every pin must read `v8`.

## 6. content.spec.mjs changes (ADD, do not remove v1 assertions — R1)

`tests/content.spec.mjs` gets **added** `examples[]` checks and keeps ALL existing assertions
(including the `universalExample` non-empty check at line 49 and the render-equality at line 110). It
must tolerate the mixed shape (52 have `examples`, 22 don't). Added checks:

- 52-and-only-52 frameworks have `examples`; those in the 4 core categories, none in the 4 extension categories.
- For each of the 52: D1 (5 personas fixed order, non-empty scenario+tradeoff), D2 (featured 0–4),
  D3 (stakes token in every scenario), D4 (cost marker in every tradeoff), D5
  (`universalExample === examples[featured].scenario`).
- The `pdb-shell-v8` pin (per S2).

Do NOT migrate the renderer or the synthetic fixture to `examples[featured]` in this sprint — that is
Sprint 002 (§11). The synthetic-fixture test (line 123) still uses `universalExample` and stays green.

### 6.1 Token-list validation mechanism (authoritative — resolves the D3/D4 bootstrap)

The token lists below are **fixed and authoritative in THIS contract**. The test harness MUST hardcode
these exact lists inline in `content.spec.mjs` (as regexes) and validate against them directly. The test
harness MUST NOT load the token lists from the trace artifact or from any external JSON file (avoids the
bootstrap problem where the trace does not exist when the test first runs). The trace artifact (§7)
prints these same lists **for reference only**; if the two ever disagree, THIS contract wins and the
test's inline list is authoritative.

**D3 helper** — `hasStakesToken(scenario)` returns true iff the scenario matches at least one of:

- Digits: `/[0-9]/`
- Currency: `/[₹$€£]/`
- Time-span words: `/\b(day|days|week|weeks|month|months|year|years|hour|hours|minute|minutes|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tonight|tomorrow)\b/i`
- Named human-role tokens: `/\b(manager|boss|spouse|husband|wife|partner|parent|mother|father|mom|dad|son|daughter|friend|teacher|co-founder|client|landlord|sister|brother|in-law)\b/i`

**D4 helper** — `hasCostMarker(tradeoff)` returns true iff the tradeoff matches at least one of:

- `/\b(cost|costs|price|give up|gives up|lose|loss|risk|sacrifice|trade|traded|forfeit|at the expense|you may|could miss|downside|pay|pays)\b/i`

The D3 check FAILS a framework if any one of its 5 scenarios lacks a stakes token; the D4 check FAILS a
framework if any one of its 5 tradeoffs lacks a cost marker. Both must pass for all 52.

## 7. Trace artifact (B28) — required deliverable

Write `/Users/prithviputta/Downloads/pocket-decision-book/.harness/logs/generator_trace_sprint_001.md`
with the EXACT structure defined below. The Evaluator verifies this file exists, prints the token lists
in the required format, contains ≥5 complete loops covering all four core categories, and asserts full
application to all 52. Ambiguity is removed by fixing the format and defining "complete loop" here.

### 7.1 Required file structure (top to bottom)

```
# Sprint 001 — draft→counter→final trace

## Validation Token Lists

### D3: Concrete Stakes Tokens (checked in all 5 scenarios of every framework)
- Digits: [0-9]
- Currency: ₹, $, €, £
- Time-span words: day, days, week, weeks, month, months, year, years, hour, hours,
  minute, minutes, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, tonight, tomorrow
- Named human-role tokens: manager, boss, spouse, husband, wife, partner, parent, mother,
  father, mom, dad, son, daughter, friend, teacher, co-founder, client, landlord, sister, brother, in-law

### D4: Cost-Marker Tokens (checked in all 5 tradeoffs of every framework)
cost, costs, price, give up, gives up, lose, loss, risk, sacrifice, trade, traded, forfeit,
at the expense, you may, could miss, downside, pay, pays

## Sample Frameworks (name them here, then a loop per framework below)
1. <id> — category: improve-yourself
2. <id> — category: understand-yourself
3. <id> — category: understand-others
4. <id> — category: improve-others
5. <id> — category: <any>   (the +1)

## Loop: <framework id> ...
```

**Format rules (BLOCKER 1):** Print the D3 list as a markdown bulleted list with the four categories as
separate bullets; print the role-noun tokens and time-span tokens as comma-delimited values within their
bullet. Print the D4 list as a single comma-delimited line under its heading. Role nouns and cost markers
live in **separate** headed sections (`### D3` and `### D4`). Print the raw token list only — usage
examples are not required in this section (they appear inside the loops). These printed lists are for
reference; the authoritative lists for testing are the inline regexes in §6.1.

### 7.2 Definition of a "complete loop" (BLOCKER 2)

For EACH of the ≥5 sample frameworks, a **complete loop** MUST contain, for **each of the 5 personas**
(everyday / student / relationship / high-achiever / privileged):

- **Draft candidates:** ≥1 candidate `scenario` (2+ candidates encouraged for at least the featured
  persona, but ≥1 per persona is the minimum bar).
- **Named counter-attack:** ≥1 explicit skeptic objection per candidate, phrased as "A skeptic says: …"
  (attacking one of: the framework didn't matter here / this persona wouldn't act this way / the stakes
  are fake).
- **Revision or discard:** an explicit line stating whether the candidate stands (with the counter
  absorbed into the tradeoff), is revised (show the revised clause), or is discarded (say why; a
  discarded candidate need not be replaced if another candidate for that persona survives).
- **Featured selection:** at the framework level, one line naming `featured=<0..4>` and a written reason
  (≥1 sentence) for WHY that example best survives its counter — explicitly referencing the counter that
  its tradeoff pre-empts.

A framework loop that shows only the featured persona, or omits the counter for any shown candidate, is
INCOMPLETE and does not count toward the ≥5.

### 7.3 Worked example of one complete loop (illustrative, copy the shape)

```
## Loop: eisenhower-matrix — category: improve-yourself

### Persona: everyday
Draft candidates:
1. "You run a 4-table cafe. Three customers are waiting and your landlord wants the ₹40,000 rent
   answer by Friday. The matrix flags the rent reply as Important-not-Urgent, so you handle it before
   the noise — where before you'd have chased the loudest table first."
2. "You have 15 tasks and delete 9." (shallow)
A skeptic says: "The everyday person just does whatever is loudest; the matrix changes nothing — they'd
answer the landlord anyway because rent is scary."
Revision/discard: Candidate 1 stands — the counter is absorbed in the tradeoff (you cool a waiting
customer to protect the lease). Candidate 2 discarded: no stakes, no flip.
### Persona: student  … (same shape)
### Persona: relationship … (same shape)
### Persona: high-achiever … (same shape)
### Persona: privileged … (same shape)

Featured selection: featured=0 (everyday). Reason: it shows the clearest flip (loudest-first →
highest-leverage-first) and its tradeoff names the real cost (a chilled customer relationship), which
is exactly the skeptic's objection pre-empted.
```

### 7.4 Sampling strategy for the ≥5 (BLOCKER 3)

The ≥5 sample frameworks MUST be **chosen to cover all four core categories**: at minimum ONE framework
from each of `improve-yourself`, `understand-yourself`, `understand-others`, `improve-others`, PLUS ≥1
additional framework from any category (≥5 total). Name all chosen frameworks with their category in the
"Sample Frameworks" section at the top of the file (per 7.1). A trace whose 5 samples all sit in one
category fails this requirement even though it has 5 loops.

### 7.5 All-52 assertion and how it is anchored (HIGH 1)

The file MUST contain an explicit assertion: **"The draft→counter→final loop was applied to all 52 core
frameworks."** This assertion is verified INDIRECTLY through `content.spec.mjs`, not by trust alone:

- If D3 passes for all 52, every scenario carries a concrete stakes token (draft-and-never-counter
  scenarios tend to be abstract and fail D3).
- If D4 passes for all 52, every tradeoff carries an explicit cost marker (a scenario authored without
  the counter step tends to have a "pure win" tradeoff and fail D4).
- D3 + D4 passing for all 52 is therefore strong machine evidence that the countering loop was applied;
  the trace's "all 52" assertion is anchored to this test evidence, and the ≥5 shown loops are the
  worked proof of the method. The Evaluator treats the assertion as substantiated when (a) the ≥5 loops
  are complete per 7.2, and (b) D3+D4 are green for all 52 in `content.spec.mjs`.

## 8. Commands the Evaluator runs

```bash
cd /Users/prithviputta/Downloads/pocket-decision-book
node scripts/build-data.mjs                 # regenerate data.js (must be a no-op vs committed)
python3 -m http.server 4173 &               # serve for the browser suites
node tests/content.spec.mjs                 # examples[] data checks + v1 checks, must be 0 failed
node tests/shell.spec.mjs                   # v1 shell, green
node tests/nav.spec.mjs                     # v1 nav, green (SW pin now v8)
node tests/daily.spec.mjs                   # v1 daily, green (SW pin now v8)
node tests/visuals.spec.mjs                 # v1 visuals, green (SW pin now v8)
node tests/accept.spec.mjs                  # v1 acceptance click-through, green
node scripts/check-originality.mjs          # originality guard, green
```

Plus data-layer spot checks in the browser console:
`window.PDB_DATA.frameworks.filter(f=>f.examples).length === 52` and, for a sampled core id,
`f.universalExample === f.examples[f.featured].scenario`.

## 9. Explicitly NOT machine-verified this sprint (honest proxy boundary — R2/R4)

- "Scenario shows a FLIP / before→after thought" (the qualitative half of B26).
- "Tradeoff cannot be countered / absorbs the steelman" (the qualitative half of B27).
- "personalPrompt genuinely touches personal life" (B29 qualitative half).
These are Evaluator-sampled here and finally certified at the Sprint 004 acceptance gate. The B28
trace is the evidence that countering was actually performed. The contract does not claim these are
automated.

## 10. Non-Goals (guarding the sprint boundary — do NOT build these here)

- **No renderer changes.** `js/card.js` is untouched; no featured-first layout, no paired-tradeoff
  element, no persona tabs/accordion, no persona ARIA widget (B30/B31 = Sprint 002).
- **No UI transformation.** No palette change, no font/type-system change, no hierarchy re-layout
  (B32–B35 = Sprint 003). `styles/app.css` tokens are unchanged.
- **No examples for the 22 extensions** (Sprint 002).
- **No removal of `universalExample`** anywhere — it stays on all 74 (removal is Sprint 002).
- **No defensive "examples missing" render state** — irrelevant while the renderer ignores `examples`.
- No new frameworks, no backend, no library adoption, no hand-editing `js/data.js`, no change to
  `trigger`/`essence`.

## 11. Definition of done

- 52 core `AUTHORED` entries have valid `examples[]`+`featured`; `js/data.js` regenerated and matches source.
- D1–D8 all pass in `content.spec.mjs`; all 74 keep `universalExample` non-empty; 52 satisfy D5.
- SW bumped to `pdb-shell-v8` with dated comment; all four version pins updated to v8.
- All v1 suites + `content.spec.mjs` + originality guard: **0 failed**.
- Trace artifact `generator_trace_sprint_001.md` exists with ≥5 full loops + all-52 assertion.
- Committed and pushed to BOTH `origin` and `decision-book` (B39).
- `generator_trace.log` records files changed, commands, and evidence.
