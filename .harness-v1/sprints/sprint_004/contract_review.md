VERDICT: ACCEPT
SCORE: n/a
BLOCKERS: 0
HIGH: 0

## Sprint 004 Contract Review

### Summary

The Sprint 004 contract is comprehensive, testable, and gates implementation effectively. All user-visible behaviors are specified with exact routes, click paths, data structures, and acceptance criteria. Evaluator verification is explicit (§10: 14 numbered Playwright/Node sequences; §12: 13 checkboxes). The contract correctly scopes Sprint 004 (situations, browse, search, favorites, persistence) and clearly separates out-of-scope work (daily card/streak = Sprint 005; full a11y/originality = Sprint 006). No requirement is vague, gameable, or unmeasurable.

### Strengths

1. **Routes and screens are enumerated** — `#/situations`, `#/browse`, `#/s/:id`, `#/c/:id`, `#/search`, `#/favorites` with exact navigation targets. No ambiguity.

2. **Data structures are specified with API boundaries** — `PDB_NAV` (SITUATIONS array, situationById), `PDB_FAV` (isFavorite, toggle, all, localStorage), `PDB_LISTS` (pure renderers) are concrete module boundaries. Every frameworkId is validated against `PDB_DATA.byId`.

3. **Acceptance criteria are atomic and enumerable** (§12: 13 checkpoints) — "6–10 options," "≥2 frameworks per situation," "exactly 74 frameworks," "≤3-tap reachability," etc. Each is measurable in isolation.

4. **Evaluator click paths are explicit and reproducible** (§10: 14 sequences with Playwright examples, special-char edge cases, offline testing, axe a11y both themes). A fresh evaluator can run these paths step-for-step.

5. **States are fully enumerated** (§5: empty, success, no-match, invalid-input, not-found, offline, back affordance). No silent failures or undefined behaviors.

6. **Accessibility is binding and detailed** (§6: keyboard-reachable, visible focus, accessible names, ≥44px, AA in both themes). Lists are semantic, icons are `aria-hidden`, no positive `tabindex`.

7. **Non-regression is explicit** — Sprint-002/003 card body, prompt-last order, and six-part structure are untouched. Sprint-001 offline gateway (B20) is protected via cache version bump.

8. **Security and privacy are tight** — no backend, no network calls, no secrets, `.gitignore` verified, localStorage only.

9. **Out-of-scope is clear** (§11: no daily card, no re-keying, no new fonts/palette, no sharing). This prevents scope creep.

### Non-Blocking Tightening Suggestions

Two minor areas could be clearer in the prose (not binding, but would save implementation questions):

**1. Search results aria-live region scope (§6, line 100)** — The contract states "the results/count container is an `aria-live='polite'` region," which is testable. Recommend clarifying whether the live region wraps the entire results list + count, or just the count element. Precise edit:

> **Suggested addition to §6, line 100:** "the results/count container (the list of matching frameworks and the count/heading above it) is an `aria-live='polite'` region so keystroke-driven result changes are announced to screen readers."

This removes ambiguity about whether it's a wrapper or a count-only region.

**2. Blurb field presence and rendering (§1.1 vs §2)** — The contract lists `blurb` in the `PDB_NAV.SITUATIONS` data structure (§2, line 46) but §1.1 says each option "**may** show a one-line blurb," which could imply optionality. The acceptance criteria (§12) do not test blurb presence, so the ambiguity does not gate the contract. Recommend clarifying for implementation clarity:

> **Suggested addition to §2, line 46:** "Each situation carries a required `blurb` field (string); if the blurb is empty or falsy at runtime, it is not rendered (no dash or placeholder shown)." OR "Each situation carries an optional `blurb` field (string or null); if present, it is rendered below the label."

Choose one so the generator knows whether to always author a blurb or can omit it.

### Compliance Check

- **Vague requirements:** None found. All user-facing features are specified with examples.
- **Untestable requirements:** None found. Every acceptance criterion (§12) maps to a verifiable click path (§10).
- **Gameable loopholes:** None found. Data constraints (≥2 frameworks, exactly 74, determinism) are enforced by the test suite.
- **Missing click paths:** None. §10 covers happy path (situations, browse, search, favorites), edge cases (no-match, special-chars, not-found), non-regression (offline, a11y, console), and browser back.
- **Missing states:** None. §5 enumerates empty, success, no-match, invalid-input, not-found, offline, and back affordance.
- **Missing routes/screens:** None. All seven routes (`#/situations`, `#/browse`, `#/s/:id`, `#/c/:id`, `#/search`, `#/favorites`, `#/f/:id`) are specified.
- **Missing data specs:** None. Three new modules (nav-data.js, favorites.js, lists.js) are defined with API boundaries.
- **Missing a11y baseline:** None. §6 is comprehensive (keyboard, focus ring, label, tap target, contrast in both themes, semantic lists, aria-live). Zero violations of color-contrast, link-name, button-name, list are acceptance criteria.
- **Missing regression protection:** None. B20 (offline gate) is protected by cache version bump and precache of new JS. Existing card six-part order and Sprint-001/002/003 suites remain binding.

### Verdict Justification

This contract is ready for implementation. It specifies what the generator must build, how the evaluator will test it, and what passes. The two tightening suggestions are clarifications, not defects; they do not block acceptance.

**ACCEPT this contract as-is.** The generator can proceed with implementation and can reasonably resolve the two ambiguities in the field (aria-live scope and blurb optionality) using the suggested clarifications.
