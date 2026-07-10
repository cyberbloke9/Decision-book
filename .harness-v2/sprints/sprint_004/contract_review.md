VERDICT: ACCEPT
SCORE: n/a
BLOCKERS: 0
HIGH: 0

## Summary

This is a complete, testable, and well-bounded final sprint contract for Polish & Acceptance (Milestone 2, Phase 10). It properly sequences the work (F-001 fix → R2/R4 audit → all-74 render sweep → a11y re-verify → whole-app regression), distinguishes between machine-verifiable gates and acceptance-judgment sampling, and provides explicit commands and acceptance criteria with no vagueness that would prevent evaluation.

## Detailed Assessment

### Strengths

1. **F-001 Fix is Precise and Guarded**
   - Exact change: add `font-family: var(--font-serif);` to `.card-essence-text`
   - Regression test specified: computed font-family must be "Charter" (serif) in both themes
   - Blocker identified: fold constraint (essence top < 600px at 375×667) must hold after serif switch
   - All-74 render sweep (§6) enforces fold check across every framework, not just one card
   - Mitigation path clear: if fold regresses, adjust width/padding/font-size, never move essence below fold

2. **R2/R4 Audits are Properly Bounded**
   - R2 ("cannot be countered"): Generator performs genuine counter-audit with trace artifact; Evaluator samples ≥12 frameworks across all 5 personas; judgment call is explicit and anchored by machine proxies (B26: concrete stakes token, B27: explicit cost clause)
   - R4 ("touches personal life"): Generator audits; Evaluator samples ≥12 prompts; judgment anchored by B29 machine checks (non-empty, ends "?", terminal block) and explicit operation (check people-applicable frameworks don't address only tasks)
   - Trace artifact requirement (§4.4) ensures audits are documented and reproducible
   - If audit finds little, Generator must state that with evidence—not manufacturing churn
   - E1-E8 machine regexes are confirmed to exist in content.spec.mjs (verified: E3=stakes token check, E4=cost marker check, E8=placeholder-check)

3. **All-74 Render + Fold Sweep is Comprehensive and Non-Gameable**
   - Specific assertions for every card (§6):
     - `article.card` present with `.card-name` h2
     - No `undefined`/`NaN` in rendered text
     - Featured example visible with paired tradeoff (B30 pairing enforced)
     - Exactly 5 persona tabs in fixed order, exactly one `aria-selected="true"`
     - Essence above fold: `.card-essence-text` rect `.top < 600` **on ALL 74 cards**
     - Card ends on `.card-prompt` (B5/B35 hierarchy preserved)
     - Exactly one SVG under `.card-figure`
     - Zero console errors/warnings across the entire sweep
   - Single failing card fails the sweep—this prevents silent regressions
   - Covers the F-001/fold interaction with machine enforcement across all 74, not just a spot check

4. **Machine Invariants are Explicit and Testable**
   - §4.2 lists MUST-HOLD constraints on final data:
     - B24/B25: 5 personas per framework in fixed order, all non-empty
     - B26 (E3/E4): every scenario has concrete stakes token
     - B27 (E8): every tradeoff has explicit cost clause
     - B29/B5: every prompt non-empty, ends "?", terminal block
     - B37: `js/data.js` only regenerated from `build-data.mjs`
     - No `universalExample` anywhere (grep gate: 0 hits)
   - All are machine-verifiable; combined with the all-74 sweep, they prevent data defects from shipping

5. **Test Commands are Explicit and Complete**
   - §9 lists exact bash commands:
     - `node scripts/build-data.mjs` (regenerate after any audit edits)
     - `grep -rn universalExample js/ tests/` → 0 hits
     - `grep -rn "pdb-shell-v" sw.js tests/` → all v11, none v10
     - `grep -rn "Iowan Old Style" styles/` → 0 live hits (v1 display font gone)
     - Seven test suites (content, shell, nav, daily, visuals, accept, check-originality) all green
     - HTTP server, browser spot checks with concrete operations
   - No ambiguity about what to run or how to verify

6. **Definition of Done is Detailed and Measurable**
   - §12 provides a comprehensive checklist with specific, testable items
   - Each item references the contract section it's drawn from
   - Includes SW version bump confirmation (v10→v11 with dated comment trail), both-remote push confirmation

7. **Proper Deference to Prior Sprint Freezes**
   - §2 and §11 clearly state what is OUT OF SCOPE:
     - `trigger`/`essence` byte-stable (B2, frozen)
     - Persona order/count/ids frozen
     - Card DOM structure, tab-widget ARIA/keyboard, featured/paired-tradeoff logic all frozen (Sprint 003 §5.4)
     - `js/visuals.js` SVG geometry frozen
     - No new frameworks, no backend, no library adoption
   - Scope is tightly bounded to: F-001 CSS, targeted data edits (build-data.mjs only), test updates, SW bump

8. **States and Error Handling**
   - §6 (Defensive degrade) requires missing/invalid examples at render to degrade gracefully with no crash/`undefined`
   - §10 covers all required states (featured+paired tradeoff, persona-selected, theme, reduced-motion, all v1 states preserved)

### Acceptable Complexity and Judgment Boundaries

The contract acknowledges three inherently subjective aspects and properly bounds them:

1. **R2 "cannot be countered" (spec §10 R2, contract §4.3)**: Acknowledged as "partly a judgment call" but operationalized via (a) machine proxies B26/B27 (concrete stakes + cost clause), (b) required trace showing draft→counter→final loop, (c) Evaluator sampling ≥12 frameworks × 5 personas. This is clear and reproducible.

2. **R4 "touches personal life" (spec §10 R4, contract §4.3)**: Acknowledged as acceptance-gate judgment but operationalized via (a) machine checks (non-empty, ends "?", terminal), (b) explicit operation (identify people-applicable frameworks, sample ≥12 prompts, check for personal-life address), (c) trace artifact. Clear and reproducible.

3. **"Reads as genuinely different product" (B34)**: Anchored to persona system + restructured card (both defined in Sprint 003, frozen here) plus F-001 serif fix. Not gameable by hex-digit palette nudges because B34 is the primary "different product" evidence, not B32.

These are CONTRACT-LEVEL, not PRODUCT-LEVEL judgments, and the contract explicitly marks them as such (§13). This is appropriate for a sprint contract.

### Minor Observations (Not Blockers)

1. **Reduced-motion "~0 duration" tolerance**: The contract says transitions/animations should "resolve to ~0" when `prefers-reduced-motion: reduce`. The exact tolerance (0ms? 10ms? 100ms?) is not specified, but the operation is clear: emulate the media query and verify animations are essentially disabled. A reasonable test would check computed `animation-duration` or `transition-duration` is "0s" or very small. This is acceptable for a gate—CSS animations disabled is observable.

2. **Trace artifact format not formally specified**: The contract lists required contents (audit method, frameworks sampled, named counters, before→after text) but doesn't prescribe markdown structure. However, markdown with sections is the obvious default and is acceptable.

3. **"Worst-case card" identification in §3.3**: The contract mentions testing "longest framework name + longest trigger + longest essence" but doesn't algorithmically define which card is worst-case. However, this is addressed by the all-74 sweep (§6) which tests every card, so every worst-case IS covered. The spot check in §9 is manual verification on a sample.

None of these rise to blockage.

## Spec Alignment

The contract properly binds the three canonical inputs:
- **V2.md**: References A3 (quality bar), A4 (personalPrompt), Part B (UI) ✓
- **RESEARCH.md**: References copyright ground rules (B2, B40, §0) ✓
- **ROADMAP.md Milestone 2, Phase 10**: Matches scope (polish, acceptance, regression) ✓
- **spec.md §5 (B21–B40), §6 States, §7 Design, §8 Non-Goals, §10 R2/R4/R5, §11 Phase 10**: All properly cited ✓

The contract operationalizes abstract requirements into testable gates:
- "Hard-hitting examples" → B26 (concrete stakes regex) + R2 sampling
- "Touches personal life" → B29 (prompt audit) + R4 sampling
- "Different product" → B34 (persona system + restructured card) + B32/B33 (palette + font perceptible margin)
- "Cannot be countered" → B27 (explicit cost clause regex) + R2 trace evidence

## No Vagueness, No Gameable Loopholes

- **Exact routes**: All 74 frameworks via `#/f/<id>` in sweep ✓
- **Exact click paths**: Offline click-through in §8 is specific ✓
- **Pass/fail conditions**: Explicit (§6, §9, §12) ✓
- **Empty/error states**: Covered (degenerate render in §6, §10) ✓
- **Keyboard/focus**: Tab + arrow keys, ≥3px visible outline (§7) ✓
- **Responsive breakpoints**: 375×667 pinned for fold ✓
- **Data persistence**: Theme + favorite tested offline (§8) ✓
- **Security**: No new backend, localStorage-only (preserved) ✓
- **Verification commands**: All listed (§9) ✓
- **Non-goals**: Comprehensive (§11) ✓

## Interdependencies and Risk

The contract has one significant data-flow dependency: if the R2/R4 audit surfaces defects in examples or prompts, the Generator must edit `build-data.mjs` and regenerate `js/data.js`. Since `js/data.js` is a precached SHELL asset (per B38), changes to it trigger an SW cache bump (v10→v11), which is explicitly covered in §5. The trace artifact must log every data change (§4.4, §0). This is clearly scoped and guarded.

The F-001 serif change may push essence past the fold on long-name cards. This risk is explicitly acknowledged (§3.3 BLOCKER-class), and the all-74 sweep is the enforcement gate. This is well-designed risk mitigation.

## Conclusion

This contract is ready for implementation. It provides:
- Clear, measurable acceptance criteria
- Proper boundaries between machine-verifiable gates and acceptance judgment
- No vagueness that would prevent evaluation
- No gameable loopholes
- Explicit test commands and operations
- A comprehensive definition of done
- Appropriate respect for prior sprint freezes

**Ready to proceed to Sprint 004 execution.**
