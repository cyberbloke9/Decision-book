# Roadmap — Pocket Decision Book v1.0

Phases map 1:1 to agent-harness sprints. Each sprint is adversarially evaluated before the next begins.

## Milestone: v1.0 — Pocket Decision Book PWA

- [ ] **Phase 1 — App shell & PWA foundation**: index.html, mobile-first layout, manifest.json, service worker (offline-first cache), theme (dark/light), bottom tab navigation. Verify: installable, works offline after first load, Lighthouse PWA checks pass.
- [ ] **Phase 2 — Content engine & data model**: frameworks.js data file with the full inventory from RESEARCH.md (id, name, category/quadrant, essence, triggers[], visualType, universalExample, personalPrompt, pitfalls[], steps). Card renderer producing the six-part card from data. Verify: every inventory entry renders without error; schema validated.
- [ ] **Phase 3 — Original SVG visuals**: inline SVG generator/components for each visual form (2x2 matrix, flow, spectrum, pyramid, cycle, venn, curve) parameterized per framework. Verify: every framework has a rendered visual, no broken/overflowing SVGs at 375px.
- [ ] **Phase 4 — Situation navigation & browse**: "How are you feeling / what's the problem?" entry screen routing triggers → frameworks; quadrant/category browse; search; favorites (localStorage). Verify: every trigger routes to ≥2 frameworks; every framework reachable ≤3 taps; favorites persist across reload.
- [ ] **Phase 5 — Daily card habit loop**: one framework per day (deterministic rotation), reflection prompt, streak indicator, "applied it" log in localStorage. Verify: day rollover logic, persistence, empty-state handling.
- [ ] **Phase 6 — Polish & acceptance**: design pass (distinctive, non-generic), performance, a11y basics, final content proofread for originality, acceptance gate (EVALUATE_SYSTEM) across the whole app.

---
*Created 2026-07-04. Status tracked by agent-harness .harness/STATUS.md once execution starts.*
