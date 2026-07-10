# Roadmap — Pocket Decision Book v1.0

Phases map 1:1 to agent-harness sprints. Each sprint is adversarially evaluated before the next begins.

## Milestone: v1.0 — Pocket Decision Book PWA

- [x] **Phase 1 — App shell & PWA foundation**: index.html, mobile-first layout, manifest.json, service worker (offline-first cache), theme (dark/light), bottom tab navigation. Verify: installable, works offline after first load, Lighthouse PWA checks pass.
- [x] **Phase 2 — Content engine & data model**: frameworks.js data file with the full inventory from RESEARCH.md (id, name, category/quadrant, essence, triggers[], visualType, universalExample, personalPrompt, pitfalls[], steps). Card renderer producing the six-part card from data. Verify: every inventory entry renders without error; schema validated.
- [x] **Phase 3 — Original SVG visuals**: inline SVG generator/components for each visual form (2x2 matrix, flow, spectrum, pyramid, cycle, venn, curve) parameterized per framework. Verify: every framework has a rendered visual, no broken/overflowing SVGs at 375px.
- [x] **Phase 4 — Situation navigation & browse**: "How are you feeling / what's the problem?" entry screen routing triggers → frameworks; quadrant/category browse; search; favorites (localStorage). Verify: every trigger routes to ≥2 frameworks; every framework reachable ≤3 taps; favorites persist across reload.
- [x] **Phase 5 — Daily card habit loop**: one framework per day (deterministic rotation), reflection prompt, streak indicator, "applied it" log in localStorage. Verify: day rollover logic, persistence, empty-state handling.
- [x] **Phase 6 — Polish & acceptance**: design pass (distinctive, non-generic), performance, a11y basics, final content proofread for originality, acceptance gate (EVALUATE_SYSTEM) across the whole app.

---
*Created 2026-07-04. Status tracked by agent-harness .harness/STATUS.md once execution starts.*

## Milestone: v2.0 — Hard-hitting examples + UI transformation

Requirements in .planning/V2.md (raw human feedback verbatim + persona rubric + quality bar + design direction).

- [x] **Phase 7 — Examples engine, core 52**: data shape `examples[5]` + `featured` replacing `universalExample`; author 5 persona examples (everyday/student/relationship/high-achiever/privileged) with trade-offs for the 52 Decision Book models via draft→counter→final loop; personalPrompt audit for the 52. Verify: schema, 5/5 personas per framework, concrete-stakes + tradeoff non-empty checks, trace shows countering loop.
- [x] **Phase 8 — Examples engine, extensions 22 + card UI**: same authoring for the 22 extension frameworks; card renderer presents featured example + tradeoff pairing + persona-tabbed remaining four. Verify: all 74 complete, tradeoff never hidden when scenario visible, card ends on prompt.
- [x] **Phase 9 — UI transformation**: new visual identity per V2.md Part B (palette + type change testable), persona visual system, hierarchy pass, both themes AA, all v1 behavior suites green. Verify: token/fontstack diff vs v1, axe both themes, offline click-through.
- [x] **Phase 10 — Polish & acceptance**: whole-app regression, acceptance gate (EVALUATE_SYSTEM).

## Future milestones (planned 2026-07-09 — see .planning/VISION-1M.md for full reasoning)

- **v3.0 "Practice"** (retention): PDB_STORE versioned storage; persona-tabs module + onSelect hook; decision journal; SRS engine; reverse quiz; weekly review ritual.
- **v4.0 "Companion"** (reimagined core): decision-first home input + on-device router; 8 fill-in playbooks; decision records; share-card image export; onboarding personalization on the persona system.
- **v5.0 "Reach"** (distribution): deploy + 74 SEO landing pages; brand/name legal check; Capacitor store wrappers; push + widgets; privacy-first analytics; i18n + first language.
- **v6.0 "Sustain"**: Pro tier (web-first payments); optional E2E-encrypted sync; more languages; my-models community gallery.

Soul constraints binding on ALL milestones: <1s open, fully offline, core free, no account required for core, decisions stay on-device by default.

## Milestone: v3.0 "Practice" — journal, SRS, quiz, weekly review (started 2026-07-10)

Requirements: .planning/V3.md. Phases map 1:1 to harness sprints.

- [ ] **Phase 11 — Storage & widget infrastructure**: PDB_STORE versioned localStorage gateway (migrate favorites/applied/theme WITHOUT data loss, schemaVersion + migration hook); extract persona tabs to js/persona-tabs.js with onSelect hook. All existing suites stay green.
- [ ] **Phase 12 — Decision journal**: Farnam Street entry form (situation, frame, options+rejected, expected outcome+confidence, state, linked frameworks, review date), list/detail views, journal-this affordance on cards, markdown export.
- [ ] **Phase 13 — SRS engine**: Leitner-ladder per-framework mastery via injectable clock; grading on daily card; Today gains a due-shelf (max 3/day) with rotation/streak untouched.
- [ ] **Phase 14 — Reverse quiz**: 5-question rounds, scenario→pick-framework with plausible distractors, deterministic seeding, immediate feedback, feeds SRS, local stats.
- [ ] **Phase 15 — Weekly review + IA + polish + gate**: due-entry outcome recording (expected vs actual), weekly recap, Practice tab IA (Situations/Browse/Today/Practice; favorites relocated without regression), whole-app acceptance gate.
