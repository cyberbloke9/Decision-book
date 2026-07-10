# Sprint 004 — R2/R4 Examples & Prompt Acceptance Audit (trace artifact, contract §4.4)

This is the AUDIT trace required by Sprint 004 §4.4 (not a fresh draft→counter→final
authoring loop — that ran in Sprints 001/002). It records the genuine first-principles
counter-audit of the shipped examples (R2 "un-counterable / hard-hitting") and the
personal-life prompt audit (R4), the frameworks/personas actually sampled, the named
strongest-counter per sampled scenario, and the outcome (any before→after repair, or an
explicit "nothing fixable" backed by sampled evidence).

**Outcome up front:** the audit found NO fixable defect. `js/data.js` is byte-unchanged
this sprint (`node scripts/build-data.mjs` is a no-op vs committed data; `git diff --stat
js/data.js` is empty). Per contract §0/§4.1, "the audit may legitimately find little; if
so, document that with sampled evidence, do NOT manufacture churn" — that is exactly the
finding here. Sprints 001/002 both scored 4.9; this pass certifies that quality holds
under adversarial sampling.

## Method

- Loaded the FINAL generated data (`js/data.js`, all 74 frameworks) into a sandbox and
  read the actual scenario/tradeoff/prompt strings — not the trace, not the build map.
- **Machine invariants (§4.2) re-run on final data, all clean:** B24/B25 shape (74×5
  personas in fixed order `[everyday, student, relationship, high-achiever, privileged]`,
  non-empty scenario+tradeoff) = 0 fails; `featured` int 0–4 = 0 fails; E3 stakes token
  on all 5×74 scenarios = 0 fails; E4 cost clause on all 5×74 tradeoffs = 0 fails; E8
  placeholder scan = 0 fails; every `personalPrompt` non-empty + ends "?" = 0 fails;
  `universalExample` present anywhere = 0. (These are necessary-not-sufficient; the
  qualitative judgment below is the certification.)
- **R2 featured spread:** sampled 16 frameworks, 2 per category, across ALL EIGHT
  categories (4 core + 4 extension groups).
- **R2 relationship-persona spread:** read the relationship slot (index 2) for 16
  frameworks across all categories to certify these are about PEOPLE, not projects.
- **R2 non-featured spread:** read student/high-achiever/privileged (indices 1/3/4) with
  their tradeoffs for 8 frameworks (24 non-featured scenario+tradeoff pairs) to certify
  the tradeoff pre-empts the single strongest counter.
- **R4 prompt spread:** read 16 `personalPrompt`s across all categories for personal-life
  reach.

## R2 — featured scenarios (16 sampled, named strongest counter → verdict)

For each, the strongest skeptic counter and whether the scenario's before→after flip +
the paired tradeoff pre-empt it.

- **eisenhower-matrix / everyday** — counter: "you'd answer the landlord anyway, the matrix
  did nothing." Rebuttal in-scenario: "where before you'd have chased the loudest table" is
  the explicit flip; tradeoff pre-empts the FOMO counter ("smaller tip tonight vs a signed
  roof for the year"). SURVIVES.
- **choice-overload / everyday** — counter: "cutting to 3 might skip the best fridge."
  Tradeoff names exactly that ("skipping a model you'd have marginally preferred"). SURVIVES.
- **flow-model / everyday** — counter: "boredom is just laziness." Flip: "that's boredom,
  not a flaw." Tradeoff pre-empts "harder work = early mistakes." SURVIVES.
- **political-compass / everyday** — counter: "two axes is just intellectual vanity." Flip
  finds a real position "the single line couldn't hold"; tradeoff = losing tribe belonging.
  SURVIVES.
- **rumsfeld-matrix / everyday** — counter: "contingency is just fear." Tradeoff concedes
  "smaller renovation now" as the real cost. SURVIVES.
- **pareto-principle / everyday** — counter: "the 20% is obvious in hindsight." Scenario
  tags a week of jobs to FIND the 3 faults (before→after); tradeoff: rare jobs wait. SURVIVES.
- **team-model / high-achiever** — counter: "a team of brilliant people is fine." Flip:
  "everyone overlaps on building, nobody tests or sells." Tradeoff = losing easy harmony.
  SURVIVES (high-achiever's own strength is the trap — persona definition honored).
- **project-management-triangle / everyday** — counter: "customers won't accept 'pick two.'"
  Tradeoff concedes "losing the customer who wanted the impossible." SURVIVES.
- **second-order-thinking / high-achiever** — counter: "closing the deal is the job."
  "And then what?" traces to reputation loss; tradeoff = "one visible win vs credibility
  that compounds." SURVIVES.
- **regret-minimization / everyday** — counter: "at 34 the safe job IS the smart choice."
  Projects to 80: "the regret isn't a failed shop — it's never trying"; bounded 12-month
  attempt; tradeoff = a year's savings + salary. SURVIVES.
- **sunk-cost-fallacy / relationship** — counter: "4 years means something." Flip: "the
  years are gone; staying out of accounting isn't love." Tradeoff = shared history + mutual
  friends. SURVIVES.
- **planning-fallacy / high-achiever** — counter: "you're fast, 4 weeks is real." Own track
  record (10+ weeks ×3) is the disconfirming fact; tradeoff = "less impressive to the board."
  SURVIVES (competence-as-trap honored).
- **implementation-intentions / relationship** — counter: "a scheduled call is cold." Flip:
  intention→cue makes the call to an aging mother actually happen; tradeoff concedes exactly
  the "less spontaneous" counter. SURVIVES.
- **environment-design / everyday** — counter: "just use willpower." Flip: rearrange friction
  so "the easy choice is the good one"; tradeoff = losing the midnight biscuit. SURVIVES.
- **wrap / everyday** — counter: "this is just a pros/cons list." Names all four W-R-A-P
  moves on a real night-shift decision; tradeoff = speed the boss wants. SURVIVES.
- **weighted-scoring / everyday** — counter: "the spreadsheet just launders the gut call."
  Gut check CORRECTS the under-weighted 90-min commute (before→after); tradeoff = an evening
  + feeling over-engineered. SURVIVES.

**Featured verdict:** 16/16 survive their strongest counter. Each has a concrete stakes
token AND a genuine before→after flip (not a definition in story clothes). No finding.

## R2 — relationship persona is about PEOPLE (16 sampled)

Every relationship-slot scenario read is about persons, not projects: father's cardiology
appointment (eisenhower), moving in with a partner (swot, rumsfeld), a distant teenage son
(flow, hersey-blanchard), a partner pushing you away (johari), a blow-up with a partner
(swiss-cheese), wedding planning with a partner (team-model), lending ₹50,000 to a sister
(second-order), a marriage killed by contempt/stonewalling (inversion), a 4-year
relationship (sunk-cost), a partner frightened about a parent's illness (confirmation-bias),
calling an aging mother (implementation-intentions), a half-present partnership on screens
(deep-work), "should we break up?" (wrap), moving cities for a partner (decision-journal).
These map onto marriage / breakup / parenting / aging parents / money-between-family exactly
as R2/§4.3 demands. **No finding.**

## R2 — non-featured tradeoffs pre-empt the counter (24 pairs across student/high-achiever/privileged)

Sampled frameworks: eisenhower-matrix, second-order-thinking, sunk-cost-fallacy, team-model,
regret-minimization, pareto-principle, flow-model, weighted-scoring. In every pair the
tradeoff names an explicit cost that IS the strongest counter — e.g. high-achiever
sunk-cost "killing your own high-profile bet publicly admits it failed"; privileged
regret-minimization "reaching out risks his rejection and reopening old wounds" (estranged
brother — attention/meaning, not money, is the constraint, honoring the privileged persona
definition); student eisenhower "give up the party and some social standing... FOMO now
traded for a grade that outlives the night." The privileged persona consistently uses
succession / legacy / reputation / meaning as the scarce resource (foundation succession,
heritage-hotel legacy, marquee-name board), never money. The high-achiever persona
consistently makes the operator's own intelligence the trap. **No finding.**

## R4 — personalPrompt personal-life reach (16 sampled)

All 16 prompts address "you / your life / your decision" in the second person and end in
"?". People-applicable frameworks reach personal life: regret-minimization ("At eighty,
looking back..."), political-compass ("the belief you hold most strongly"), sunk-cost
("continuing something mainly because of what you've already spent"), decision-journal
("the decision you're about to make... your state of mind"). Three prompts contain a
generic "task"/"team"/"project" word (eisenhower, team-model, deep-work) but each is
appropriately framed: eisenhower is inherently task-triage and its prompt is second-person
about the reader's week; team-model is inherently about a team (people) and addresses the
reader's own bench; deep-work's prompt EXPLICITLY offers "a hard conversation to prepare"
as a first-class option alongside work. None addresses ONLY tasks/projects for a
people-applicable framework. (Sprint 001 already re-audited and rewrote 7 project-only
prompts — bcg-box, project-portfolio-matrix, sinus-milieu, pareto, long-tail, role-playing,
project-management-triangle.) **No finding.**

## Coverage assertion

The audit was applied across ALL categories: the 4 core groups (improve-yourself,
understand-yourself, understand-others, improve-others) AND all 4 extension groups
(mental-models, cognitive-biases, attention, decision-processes) — 2 frameworks sampled per
category for the featured + relationship + prompt passes, plus a non-featured tradeoff pass
on 8 frameworks × 3 personas. The machine invariants (§4.2) were re-verified on the full
74×5 dataset.

## Data-edit ledger

**None.** No `AUTHORED` entry was edited; `node scripts/build-data.mjs` regenerates
byte-identical `js/data.js` (empty `git diff --stat js/data.js`). No churn manufactured.
Because data did not change, `js/data.js` is NOT listed in the SW v11 changed-asset trail;
only `styles/app.css` (the F-001 serif fix) drives the SW bump.
