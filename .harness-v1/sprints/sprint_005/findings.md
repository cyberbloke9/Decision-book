VERDICT: PASS
SCORE: 4.8
BLOCKERS: 0
HIGH: 0

# Sprint 005 Findings — Daily Card Habit Loop (B16/B17/B18)

Evaluated by independent adversarial browser automation (Playwright + @axe-core), NOT by trusting the Generator's self-suite. Server: `python3 -m http.server 4173`. Date injected via `page.addInitScript(d => window.__PDB_NOW__ = d, ...)`. All claims below were reproduced live.

## Verdict rationale

Every in-scope behavior is present, clickable, deterministic, persistent, accessible, offline-capable, and free of regressions. The Today screen is a genuine habit loop with a distinctive, non-generic design (serif headings, intentional gold/amber accent, working dark AND light themes, original inline-SVG streak/applied glyphs), not a template. No blockers, no high findings.

## Independent evidence (43/43 my own checks; 190/190 across the 5 self-suites)

### Functionality
- B16 rotation determinism. `#/today` for 2026-07-06 -> `ulysses-pact`, matching `PDB_DATA.frameworks[(((Math.floor(Date.UTC(2026,6,6)/864e5))%N)+N)%N].id`. Reload -> same id. 2026-07-07 -> `daily-highlight` (different). 10 consecutive injected days all distinct. `PDB_DAILY.dailyFramework()` agrees with DOM `data-framework-id`.
- Single date source (1.2). `today()` reads `__PDB_NOW__` -> `localStorage['pdb.testDate']` -> real local date, parsing by explicit components into `Date.UTC(...)`. Only one `new Date()` in the module (line 79, real-local path); no `new Date(str)`, no second reader, no `Math.random`, no `fetch`. Garbage `__PDB_NOW__` falls through without throwing.
- B17 applied toggle + persistence. Fresh: aria-pressed=false, streak 0. Click -> aria-pressed=true, streak 1 live, `localStorage['pdb.applied']`=["2026-07-06"]. Reload -> still applied, streak 1. Un-apply -> false; reload -> still off. A `<button aria-pressed>` with dynamic `aria-label`, not a link, no free-text field.
- B18 streak — all 5 pinned 1.4 examples reproduced exactly (fn value AND rendered `.streak-chip-num`): {D-2,D-1,D}=3; {D-2,D-1}=2 (grace); {D-2,D}=1 (gap); {D-3}=0 (broken); {}=0 (first use). Always non-negative integer.
- States. Zero: "Apply today's card to start your streak." At-risk: "Current streak: 2 days" + keep-alive nudge. Applied: "You logged today — keep it going tomorrow." All render, none blank, none crash.
- Corrupt/blocked storage. `pdb.applied` = "not json", {"a":1}, ["2026-07-06",42,"junk",null] each -> card renders, streak non-negative int (junk sanitized), ZERO console errors/warnings.

### Regression / additive-change discipline
- No duplicate `h-framework`: Today card h2 id = `h-today-card`; zero `#h-framework` on Today.
- `#/f/:id` byte-behavior intact: Back-to-Browse link, `<h2 id="h-framework">`, six parts, article.card lastElementChild === .card-prompt (B5) all preserved with additive {headingId, showBack}.
- Placeholder "No card yet today" removed from source and DOM.
- Prior suites green: daily 61/61, nav 75/75 (Today assertion updated), shell 50/50, content 27/27 (SW v5), visuals 27/27.
- Offline (B20): sw.js CACHE = pdb-shell-v5, ./js/daily.js precached, old caches purged on activate. Network offline after SW activation: cold `#/today` renders card + habit bar and toggle mutates state from cache.

### Accessibility / responsive (6, 7)
- axe (color-contrast/button-name/aria/list): 0 critical violations across zero/applied/streak-3 x dark AND light (6 scans).
- Keyboard: applied button focusable; Space and Enter both toggle; focus retained after toggle (in-place mutation).
- Applied button box 309x48px (>=44x44). No horizontal scroll at 375px or 320px.

### Security / hygiene
- No backend, no remote fetch, no analytics; all state in localStorage. `git status --porcelain` shows only intended app/test files (js/daily.js, tests/daily.spec.mjs new; index/app/card/sw/css/package + test suites modified). No .env/.db/node_modules/.harness tracked. No secrets.

## Scoring
- Functionality 5.0; Design 5.0; Originality 4.5; Craft 4.5; Evidence/process 5.0.
- Weighted (20% each) = 4.8. Passing bar met (no blockers/highs, evidence >=4, functionality >=4, total >=4).

## Finding F-001: Streak label grammar reads "3 day streak" / "keep your 2 days streak"

Severity: Low
Category: Craft
Status: Note (non-blocking)

### Contract Clause
1.4 example labels use hyphenated forms ("3-day streak", "keep your 2-day streak"); contract wording is illustrative ("e.g."), not binding.

### Reproduction Steps
1. Inject 2026-07-06, seed pdb.applied=["2026-07-04","2026-07-05","2026-07-06"], open #/today.
2. Read the streak chip and the at-risk nudge (seed ["2026-07-04","2026-07-05"]).

### Expected
Idiomatic "3-day streak" / "keep your 2-day streak".

### Actual
Chip renders "3 day streak"; at-risk nudge renders "keep your 2 days streak".

### Evidence
Screenshots /tmp/pdb-streak3-light.png, /tmp/pdb-atrisk.png; live .habit-status-nudge = "Apply today's card to keep your 2 days streak."

### Required Fix
Optional polish: use a hyphenated N-day adjective for the chip/nudge noun phrase; keep the AT status line ("Current streak: N days") as-is. Not required for acceptance.

### Pass Condition
Cosmetic only; sprint passes regardless.
