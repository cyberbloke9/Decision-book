# Prompt Patch 002 — Deterministic a11y/contrast gates

Trigger: same failure pattern has now occurred **twice** (repeat-pattern rule).
- Sprint 001: axe `color-contrast` false-failed when scanning a card/screen mid theme-transition; Generator fixed it in the CONTENT suite by emulating `reducedMotion:reduce`.
- Sprint 002: the SAME root cause recurred in the SHELL suite (`tests/shell.spec.mjs` flips theme via `setAttribute` without reduced-motion), producing an intermittent `axe 320px light/situations color-contrast` failure (~1 run in 3). See findings.md F-002.

## What slipped through
A **non-deterministic accessibility gate**. The contract's acceptance item "Sprint 001 shell suite still passes ... zero console errors/warnings anywhere" (and the analogous per-sprint axe steps) can be satisfied on one run and fail on the next, because axe samples the DOM during a ~160ms CSS color transition that dips a label below 4.5:1 before settling. The product is AA-compliant in steady state; the GATE is flaky. A flaky gate is unenforceable — it can pass a real regression by luck or fail a clean build by timing.

## Which prompt/rubric allowed it
Neither the CONTRACT_REVIEW rubric nor the contract-authoring template requires axe contrast scans to sample a **settled frame**. Contracts list "run axe, assert 0 color-contrast" without specifying that theme must be applied before paint (or motion reduced) so the measured frame is deterministic. The fix was applied ad hoc to one suite in Sprint 001 and not generalized, so it re-surfaced in the next suite.

## Exact new instruction to add
Add to the contract-authoring rubric (CONTRACT_REVIEW) and to every future contract's a11y/testing section, and to the Evaluator's own axe procedure:

> **All axe (or equivalent) color-contrast / a11y scans, in any suite and in the Evaluator's own pass, MUST sample a settled frame.** Set the theme (and any other animated state) to its final value BEFORE the scanned paint — either by writing the theme to `localStorage` before `goto`/reload, or by emulating `prefers-reduced-motion: reduce` for the scanning context — so no scan can sample a CSS transition mid-flight. Any suite that flips theme via `setAttribute` on a live page and scans within the transition window is non-conformant. A11y regression gates must be deterministic: the same build must produce the same pass/fail across repeated runs.

## Example of future unacceptable output
A test run that reports:
```
FAIL axe 320px light/situations color-contrast
49 passed, 1 failed
```
on ~1 in 3 runs of an otherwise-unchanged build, caused by scanning during a theme-toggle color transition — while a fresh-load scan of the same screen in the same theme shows 0 violations. The regression gate must not be able to emit this non-deterministic result.
