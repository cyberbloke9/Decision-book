VERDICT: ACCEPT
SCORE: n/a
BLOCKERS: 0
HIGH: 0

## Summary

The Sprint 005 contract for the daily habit loop is exceptionally detailed, well-scoped, and testable. All acceptance criteria are concrete, all required behaviors are pinned with worked examples, and the 14 Playwright click paths provide exhaustive verification steps without ambiguity.

## Contract Strengths

**Precision & Testability**

- **Rotation algorithm specified exactly:** The daily-card rotation formula is pinned: `dayNumber = Math.floor(Date.UTC(y, m-1, d) / 86400000)` and `index = ((dayNumber % N) + N) % N` (N=74). Verified against live codebase (js/data.js contains exactly 74 frameworks). The modulo math guarantees adjacent calendar days yield different frameworks, which is mathematically sound.

- **Streak rule has 5 worked examples:** §1.4 and click path 5 pin the grace rule with concrete test cases (e.g., `{D-2, D-1, D}` today=D → 3; `{D-2, D-1}` today=D → 2). This eliminates interpretation drift and makes the rule verifiable by seed-and-check.

- **Single date source with explicit precedence:** §1.2 specifies `PDB_DAILY.today()` as the only date read, with precedence: `window.__PDB_NOW__` → `localStorage['pdb.testDate']` → real local date. Must use UTC component parsing, never `new Date(str)`. This prevents timezone bugs and is testable (click path 7 verifies no divergent second `new Date()`).

- **14 detailed Playwright click paths:** §10 provides end-to-end test scenarios with exact assertions: determinism (same date ⇒ same id, date advance ⇒ different id), persistence (reload preserves applied/unapplied state), corrupt storage (no crashes, graceful sanitization), a11y (axe zero violations both themes), offline (sw.js cache version bump + precache verified), regression (other test suites pass, no duplicate heading ids).

**Scope & Boundaries**

- **Explicit non-goals:** §11 clearly lists out-of-scope items (no spaced-repetition, no free-text reflection, no multi-day history, no notifications, no backend, no new fonts/palette). This protects against scope creep.

- **Strict non-regression:** Explicitly requires `tests/nav.spec.mjs` assertion update (line 403 "No card yet today" must be replaced with dynamic Today assertion), and requires all prior test suites to still pass. Service worker cache version must bump `pdb-shell-v4` → `pdb-shell-v5` with old cache purged on activate, protecting the B20 offline gate.

- **Card renderer change is strictly additive:** New signature `renderCard(fw, mount, data, options)` with `options = { headingId, showBack }` defaults preserve `#/f/:id` behavior byte-for-byte (tested in click path 8). Today card uses different heading id (`h-today-card` vs `h-framework`) to avoid DOM id collision (a valid a11y defect).

**States & Error Handling**

- **First-use / zero-streak state (B18):** Contract specifies "sane starter state" with copy inviting first log, not a blank/crash/"No card yet today". Qualified with example: "Apply today's card to start your streak".

- **At-risk grace state:** Streak > 0 but today not applied → shows nudge copy (e.g., "Apply today's card to keep your 2-day streak"), re-renders live without reload.

- **Corrupt storage resilience:** localStorage['pdb.applied'] set to non-JSON, non-array, or mixed junk → app still loads, streak computes over sanitized subset of valid date strings, zero console error/warn (click path 6 verifies three corruption scenarios).

- **Keyboard operability & accessibility:** "Applied it" button must be keyboard-reachable, operable (Enter/Space), have visible focus ring, accessible name (dynamic), ≥44×44px tap target, AA contrast in both themes. Streak conveyed as text to AT. Streak updates trigger `aria-live="polite"` announcement. Click path 9 runs axe in both themes, zero `color-contrast`/`button-name`/`aria`/`list` violations.

**Offline & Caching**

- **Service worker precache & cache-version bump:** §8.2 and click path 12 require `js/daily.js` added to SHELL precache list, CACHE version bumped to `"pdb-shell-v5"`, and `activate` handler purges old cache. Exact grep steps for evaluator verification. This protects returning users from getting a stale shell lacking daily.js when the SW updates (a real regression vector).

**Verification Coverage**

- **Determinism testable without 24h wait:** Date injection via `window.__PDB_NOW__` (primary hook) and `localStorage['pdb.testDate']` (fallback) allow test control of the date. Re-injecting earlier dates restores earlier frameworks. Click paths 2 & 3 verify this thoroughly.

- **Acceptance summary (§13):** 9-item checklist, each cross-referenced to spec behaviors (B16, B17, B18, B20, B21, B23) and specific click paths. All checkboxes are testable without interpretation.

## Contract Completeness Check

✅ **Exact routes/screens:** `#/today`, `#screen-today`, `#today-mount`, `#h-today`, `#h-today-card` (line 16, 72, etc.)

✅ **Exact click paths:** 14 numbered paths in §10 with specific assertions, DOM selectors, localStorage operations, offline/reload conditions.

✅ **Pass/fail conditions:** Acceptance summary (§13) lists 9 testable outcomes. Example: "Same injected date ⇒ same framework; next calendar day ⇒ **different** framework; re-inject earlier date ⇒ original framework — verified without waiting 24h."

✅ **Empty/loading/error/invalid states:** §5 lists 6 states (zero streak, applied, at-risk, missed day, determinism, corrupt storage, offline). First-use/zero state must show "sane starter state" with guidance, not blank or crash.

✅ **Keyboard/focus behavior:** §6 binds to "applied it" button (keyboard-operable, visible focus, accessible name, ≥44px, AA both themes) and streak region (aria-live="polite" announces updates).

✅ **Responsive breakpoints:** §7 specifies no horizontal scroll at 375px & 320px. Tap targets ≥44px (click path 10 verifies). Habit bar reflows to narrow column; daily card reuses Sprint-002/003 responsive behavior.

✅ **Real data/persistence expectations:** localStorage['pdb.applied'] as JSON array of YYYY-MM-DD strings, deduplicated and sanitized. App behavior specified: toggle updates today-only, persists across reload, gracefully handles corruption.

✅ **Security/privacy assumptions:** §8.1 specifies no backend, no network, no analytics, no third-party requests, no secrets committed (.gitignore covers .env*, *.db, .harness/, node_modules/).

✅ **Verification commands:** §9 provides exact commands (python3 -m http.server 4173, npm run test:daily, etc.) and port number.

✅ **Explicit non-goals:** §11 lists 7 out-of-scope items with clear reasoning (SRS is v2, free-text reflection is Decision-Journal territory and originality risk, multi-day history is out, no notifications, no changes to other screens).

## Risk Assessment

**No blockers or high-severity issues identified.**

Minor clarifications (not defects):

1. **"Byte-for-byte unchanged" (line 66):** Phrase is slightly imprecise. Should read "behaviorally unchanged" since adding a new optional parameter changes the JavaScript source. However, the actual requirement is clear: the user experience at `#/f/:id` must be identical (tested in click path 8: Back link present, `h-framework` id present, six-part body and prompt-last invariant intact). This is testable and unambiguous.

2. **"Sane starter state" and "gracefully handles":** Slightly subjective language, but qualified with concrete examples (e.g., "not blank, not a crash, not 'No card yet today', with copy inviting first log") and testable via click paths (zero console error, non-negative streak integer, page renders). Acceptable qualification level for a mid-sprint.

## Conclusion

The contract is production-ready for the Generator. It has exceptional attention to detail, pinned all ambiguous requirements (streak grace rule, rotation algorithm, date source precedence), and provided comprehensive click paths for the Evaluator. No vagueness, no gameable loopholes, no missing elements.

**RECOMMENDED: Proceed to implementation.**
