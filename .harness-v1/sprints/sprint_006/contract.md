# Sprint 006 Contract — Polish & Acceptance (design §7, a11y B21–B23, offline whole-app gate, originality R2)

Maps to ROADMAP Phase 6 and spec §11 Sprint 006. Sprints 001–005 built and PASSED the full app: PWA shell + theme (B14, B19, B20), the 74-framework data + six-part card (B1–B5), original inline SVGs (B6–B7), situation/browse/search/favorites (B8–B13, B15), and the daily habit loop (B16–B18). **This is a verification-and-polish sprint, not a build sprint.** Its job is to make every subjective criterion *executable*, enumerate the whole-app acceptance click-paths, and apply a small, named set of targeted polish fixes — **without redesigning or re-authoring anything that already passes.**

Spec behaviors in scope: **B21** (all interactive controls keyboard-reachable/operable, visible focus, accessible names), **B22** (WCAG AA ≥4.5:1 body/interactive text in BOTH themes), **B23** (primary-nav tap targets ≥44×44px), plus the §7 design criteria, a measurable performance floor, the **R2** originality proofread (executable proxies + a declared manual gate), and the **full-app offline acceptance click-through** of every §4 user story and every §6 required state.

**In scope — the ONLY code changes permitted this sprint:**
1. **F-001 grammar polish** (Sprint 005 Low note): the streak chip and at-risk nudge use a hyphenated `N-day` adjective ("3-day streak", "keep your 2-day streak"). The AT status line "Current streak: N days" is unchanged.
2. **Targeted a11y/contrast/focus fixes** — ONLY if a clause in §5–§7 below is found failing. Each such fix is minimal (a token value, a focus rule, an `aria-*`/label attribute); no palette overhaul.
3. **A new acceptance test suite** `tests/accept.spec.mjs` (authored) exercising §9 click-paths, plus an originality-proxy check `scripts/check-originality.mjs` (authored) implementing §6.1.
4. **SW cache version bump** to `pdb-shell-v6` **iff** any shipped asset (html/css/js) changes, and any newly-shipped file added to the precache list — to protect the B20 offline gate.

**Out of scope (non-goals) — must NOT change:**
- No content re-authoring or re-keying of `js/data.js` (triggers, essences, examples, prompts, pitfalls, steps).
- No re-architecture of the router, card renderer, SVG components, nav-data, favorites, or daily modules.
- No new features, screens, tabs, or routes; no SRS, sharing, accounts, notifications (spec §8).
- No palette or font-family change **except** a specific contrast fix if and only if a §5.2 pair is measured below its floor (all currently pass — see §5.2 — so none is expected).
- No new raster assets beyond the existing manifest icons.

Authoritative sources on disk: `spec.md`, `.planning/RESEARCH.md` (originality proxy target for B2), `index.html`, `styles/app.css`, `js/*.js`, `sw.js`, `manifest.json`.

---

## 1. User-visible behaviors (exact)

### 1.1 Streak grammar (F-001 fix, B18 preserved)
- Streak chip label reads **"`N`-day streak"** (hyphenated), e.g. "3-day streak", for `N ≥ 1`. At `N = 0` the starter copy is unchanged ("Apply today's card to start your streak").
- The at-risk nudge (streak > 0, today not yet applied) reads **"Apply today's card to keep your `N`-day streak"** (hyphenated).
- The accessible status line remains **"Current streak: `N` days"** (or "1 day" for N=1) verbatim — do NOT hyphenate the status line; it is a full sentence, not an adjective.
- All Sprint-005 streak math (the pinned grace rule, non-negative integer, zero/at-risk/applied states, corrupt-storage sanitization) is **unchanged**. `PDB_DAILY.streak(dateStr)` returns identical integers to Sprint 005.

### 1.2 Everything else is behaviorally unchanged
- No visible behavior of situations, browse, category/situation detail, search, favorites, the six-part card, the SVG visuals, the theme toggle, or the daily rotation may change. This sprint verifies them and (only if failing) fixes a named a11y/contrast/focus gap; it does not alter working UX.

---

## 2. Routes / screens / components affected

- **`js/daily.js`** — edit ONLY the two streak label strings (§1.1). No logic change.
- **`styles/app.css`** — edited ONLY if a §5–§7 clause fails (focus ring, contrast token, tap-target min-size). Expected: no change (all pass per §5).
- **`index.html` / other `js/*.js`** — edited ONLY if a §5 a11y clause (missing accessible name / label) is found failing. Expected: no change.
- **`sw.js`** — cache version → `pdb-shell-v6` iff any of the above changed; precache list gains no runtime asset (test/script files are NOT shipped/precached).
- **`tests/accept.spec.mjs`** — NEW, authored (§9).
- **`scripts/check-originality.mjs`** — NEW, authored (§6.1).
- **`package.json`** — add `"test:accept"` and `"check:originality"` scripts. No dependency changes.

---

## 3. Data / state transitions

- No new persisted state. Existing keys unchanged: `pdb.theme` (dark|light), `pdb.favorites` (JSON array of ids), `pdb.applied` (JSON array of `YYYY-MM-DD`), `pdb.testDate` (optional injected date). All state remains `localStorage`-only; **no backend, no network write anywhere** (B15).
- The acceptance suite injects the date via `window.__PDB_NOW__` (init script) exactly as Sprint 005; it may seed `localStorage` favorites/applied to reach states, then reload to prove persistence.

---

## 4. Empty / loading / success / error / invalid states (whole-app, must all be verified live)

- **Empty — favorites:** with no favorites, `#/favorites` shows the guidance empty-state (star glyph, "No favorites yet", body copy, "Browse frameworks" link) — not a blank region.
- **Empty — first-use streak:** with `pdb.applied` empty, `#/today` shows streak 0 + "Apply today's card to start your streak" — sane, not blank, not "No card yet today".
- **Empty — search no query:** `#/search` with an empty input shows neither results nor an error (guidance/idle state), never a JS error.
- **Loading / first paint:** the anti-flash inline script sets `data-theme` before the stylesheet paints; there is **no flash of unstyled content** and no un-themed frame. First paint requires no network beyond the same-origin shell.
- **Success:** framework card renders all six parts + its SVG; favoriting toggles the star and the entry appears in `#/favorites`; "applied it" logs and increments the streak live.
- **Error / no-match search:** a query matching nothing shows a clear "no frameworks match"-style message with a way back/onward, not an empty list.
- **Invalid input:** search with empty, whitespace-only (`"   "`), and special-character (`"<>&%$#"`) queries produces no console error and no crash; it shows the no-match/idle state.
- **Offline:** after first load with the SW active, the entire app (all screens, all 74 cards, all SVGs, browse, search, favorites, today, theme toggle) works with the network **disabled** (B20). No spinner hangs on a dead network.

---

## 5. Accessibility — pinned and enumerated (B21, B22, B23)

### 5.1 Keyboard reachability, operability, visible focus, accessible name — EVERY control app-wide
The Evaluator must confirm ALL of the following controls are (a) reachable by Tab, (b) operable by Enter and/or Space as appropriate, (c) show a **visible focus indicator** — the global `:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px }` (a rendered outline, not merely a `:focus` selector match), and (d) have a non-empty accessible name:

1. **Skip link** ("Skip to content") — first Tab stop; becomes visible on focus (`transform: translateY(0)`); activates to `#screen-region`.
2. **App-bar search affordance** (`#search-affordance`, `<a>`, aria-label "Search frameworks").
3. **Theme toggle** (`#theme-toggle`, `<button>`, `aria-pressed`, aria-label swaps "Switch to light theme" ↔ "Switch to dark theme"); Enter/Space toggles `data-theme` and persists.
4. **Four bottom tabs** (Situations, Browse, Favorites, Today) — each `<a>` with a text label span.
5. **Situation option buttons** on `#/situations`.
6. **Browse category buttons/links** on `#/browse`.
7. **Framework list links** (situation detail, category detail, search results, favorites) — each reaches `#/f/:id`.
8. **Favorite toggle** (`.fav-toggle` `<button aria-pressed>`) in every card header and list row — accessible name references the framework.
9. **Search input** (`#search-input`, `type=search`) with its visually-hidden `<label>`.
10. **"Applied it" button** (`.applied-toggle` `<button aria-pressed>`) on `#/today`; Enter AND Space both toggle; focus retained after toggle.
11. **Back links** ("Back to Browse" etc.) where present.

- No keyboard trap; focus order is logical (skip → app bar → main → tab bar). Decorative SVGs carry `aria-hidden="true"` / `focusable="false"` (already present) so they are not tab stops.
- `prefers-reduced-motion: reduce` suppresses the card enter/advance transition (the `@media (prefers-reduced-motion: reduce)` block at app.css:804 must neutralize card/transition animation).

### 5.2 Contrast — AA ≥4.5:1, pinned pairs, BOTH themes (B22)
The Evaluator computes WCAG contrast for these token pairs (values from `styles/app.css`; measured floors shown — all pass, pin them so the claim is evidence-backed, not asserted):

| Pair | Dark | Light | Floor |
|---|---|---|---|
| `--fg` on `--bg` | 15.85 | 14.88 | 4.5 |
| `--fg` on `--surface` | 14.30 | 16.80 | 4.5 |
| `--fg` on `--surface-2` | 12.75 | 13.99 | 4.5 |
| `--muted` on `--bg` | 9.71 | 6.15 | 4.5 |
| `--muted` on `--surface` | 8.75 | 6.94 | 4.5 |
| `--muted` on `--surface-2` | 7.81 | **5.78** (tightest) | 4.5 |

- **Accent is never used for text.** `--accent` (light `#a9741a` on `--bg` = 3.58, **below** 4.5) is used ONLY for non-text indicators, borders, and focus rings — never to paint body or interactive text. The Evaluator confirms no rendered text node computes `color` to the accent value in either theme. This is the load-bearing invariant that keeps B22 true.
- If ANY text pair actually rendered in the UI measures below 4.5:1, that is a blocker and the in-scope fix is to darken/lighten that single token to clear 4.5 — no palette overhaul.

### 5.3 Tap targets ≥44×44px (B23)
- Each of the four bottom **tabs** has a rendered box ≥44×44px at 375px.
- The **theme toggle**, **search affordance**, **favorite toggle**, and **"applied it"** controls each render ≥44×44px (or ≥44 in the thumb axis with adequate hit-area).

---

## 6. Originality proofread (R2) — executable proxies + declared manual gate

**The book's text is NOT on disk**, so "no verbatim book text" is not machine-verifiable and is NOT claimed as an automated pass. The split is explicit:

### 6.1 Executable proxies (must pass — `scripts/check-originality.mjs` + `tests/content.spec.mjs`)
- **B2 fidelity:** every framework's `trigger` and `essence` in `js/data.js` match the pre-authored originals in `.planning/RESEARCH.md` (the on-disk original re-expressions). The check parses RESEARCH.md and asserts equality/containment for all entries it supplies.
- **B3 non-empty authored fields:** for all 74 entries, `universalExample`, `personalPrompt`, and every element of `pitfalls[]` (≥1) are non-empty, non-placeholder strings (no "TODO", "lorem", "TBD", "placeholder", "example goes here", empty, or whitespace-only).
- **B5 ends-in-question/action:** every card's last part is the personal prompt (the `article.card` `lastElementChild` is `.card-part.card-prompt`) — already enforced; re-asserted here as a regression check.
- **Count:** exactly 74 entries = 52 + 7 + 6 + 5 + 4; category distribution matches spec §9.

### 6.2 Manual gate (Evaluator, documented as manual in findings)
- The Evaluator **reads a random sample of ≥10 entries' `universalExample`/`personalPrompt`/`pitfalls`** and flags any passage that reads like verbatim/near-verbatim book prose or contains a quotation. This is a MANUAL judgment; the contract does not — and cannot — automate it. A flagged verbatim passage is a blocker; absence of flags is a documented manual pass, not a certification of total originality (per spec R2).

---

## 7. Design direction made observable (§7)

- **No horizontal scroll** at **375px** and **320px** on every screen (situations, browse, both detail screens, search, favorites, today, framework card). `document.scrollingElement.scrollWidth <= clientWidth`.
- **Type scale present:** headings use the serif display face (`--font-serif`), body uses `--font-sans`; a rendered `.screen-title` computes a font-size ≥ `--fs-2` (1.563rem) and body copy computes `--fs-0` — a deliberate hierarchy, not flat.
- **Named palette, both themes real:** toggling theme changes `--bg`/`--fg`/`--surface` to the pinned dark and light values (not merely `prefers-color-scheme`); the choice persists across reload (B14).
- **One framework = one focused screen:** the card shows all six parts scannably within one screen's scroll; not a wall of undifferentiated text.
- **Motion:** at least one purposeful card enter/advance transition exists AND is suppressed under `prefers-reduced-motion: reduce` (§5.1).
- **Not-generic guard:** no default-blue `#0000EE`/underlined-only links as the identity, no unstyled native form input, no emoji-as-only-icon-system (SVG icon set is present), no centered single-column text with no diagram (every card has an SVG).

## 7b. Performance (measurable floor)
- **No render-blocking network after first load:** with the SW active and network disabled, a cold reload of any route renders fully from cache (proved in §9 offline path). This is the concrete performance guarantee for a static offline PWA.
- **No FOUC:** the anti-flash script sets `data-theme` before the stylesheet; the first painted frame is themed (no un-themed flash).
- **Asset bound:** the shipped shell precached by the SW is same-origin static files only; there are **zero cross-origin/network requests for diagrams, fonts, or data** (all SVG inline, fonts are system stacks, data is a local JS module). The Evaluator confirms the network panel shows no third-party or image-diagram request.

---

## 8. Security / privacy

- No backend, no `fetch`/`XMLHttpRequest`/`navigator.sendBeacon` to any origin; no analytics; no cookies-for-state. All state in `localStorage`.
- **Git hygiene:** `.gitignore` covers `.env*`, `*.db`, `node_modules/`, `.harness/`, `test-results/`, `ruvector.db`. `git status --porcelain` shows only intended source/test files. No secrets, keys, or tokens in tracked files. `ruvector.db` and `node_modules/` remain untracked.

---

## 9. Commands to run (Evaluator)

```bash
cd /Users/prithviputta/Downloads/pocket-decision-book
# static server (offline PWA; open the app at http://localhost:4173/)
python3 -m http.server 4173

# self-suites (all must stay green — regression protection)
npm run test:content     # 74-entry schema, counts, B2/B3/B5 proxies
npm run test:shell       # PWA shell, manifest, SW, theme persist
npm run test:visuals     # every framework renders an SVG, no 375px overflow
npm run test:nav         # situations/browse/search/favorites, ≤3 taps
npm run test:daily       # rotation determinism, applied log, streak grace rule
npm run test:accept      # NEW — whole-app offline acceptance click-through (§9 paths)
npm run check:originality # NEW — B2 fidelity + B3 non-empty authored fields

# manifest/icon sanity
python3 - <<'PY'
import json,os
m=json.load(open('manifest.json'))
sizes={i['sizes'] for i in m['icons']}
assert '192x192' in sizes and '512x512' in sizes, sizes
for i in m['icons']: assert os.path.exists(i['src'].lstrip('./')), i['src']
print('manifest OK', m['name'], sizes)
PY
```

## 9b. Playwright click-paths the Evaluator should perform

All paths run against `http://localhost:4173/`. Date injected with `page.addInitScript(d => window.__PDB_NOW__ = d, '2026-07-06')` where a fixed daily card is needed. Run each path in **BOTH** `data-theme` states (toggle theme, or seed `localStorage['pdb.theme']`).

1. **Story 1 — situation routing (B8/B9):** load `/#/situations` → click a situation option → assert a list of **≥2** framework links appears → click one → assert `#/f/:id` renders `<h2 id="h-framework">` + six `.card-part` + an inline `<svg>` + the prompt is the last part.
2. **Story 2 — browse (B11):** `/#/browse` → assert the four quadrants + four extension categories are listed → open one → assert its frameworks list → open a framework card.
3. **Story 3 — card completeness (B4):** on any `#/f/:id`, assert all six parts present and non-empty and exactly one SVG.
4. **Story 4 — search (B12):** `/#/search` → type a known name substring → assert matching results → clear → type `"   "` then `"<>&%$#"` → assert no console error and a no-match/idle state → type a nonsense query → assert the "no frameworks match" message with a way back.
5. **Story 5 — favorites persistence (B13):** open a card → activate `.fav-toggle` (via keyboard) → go to `#/favorites` → assert it appears → **reload** → assert still favorited and still listed → unfavorite → reload → assert gone → assert empty-state guidance renders.
6. **Story 6 — daily habit loop (B16/17/18):** inject `2026-07-06` → `/#/today` → assert `data-framework-id` matches `PDB_DATA.frameworks[(((Math.floor(Date.UTC(2026,6,6)/864e5))%74)+74)%74].id` → assert streak 0 + starter copy → activate "applied it" via **Space** and via **Enter** → assert `aria-pressed` toggles and streak label reads hyphenated "1-day streak" → reload → assert still applied. Re-inject `2026-07-07` → assert a **different** `data-framework-id`.
7. **Story 7 — offline (B20):** load once online with SW → set `context.setOffline(true)` (or disable network) → cold-reload each of: situations, browse, a `#/f/:id`, search (run a query), favorites, today → assert every one renders fully from cache with **zero** failed network requests and no hung spinner.
8. **Story 8 — theme persist (B14):** activate the theme toggle → assert `data-theme` flipped and `--bg` computed value changed to the other theme's pinned value → reload → assert the choice survived.
9. **A11y sweep (§5):** run `@axe-core/playwright` on situations, browse, a card, search (no-match), favorites (empty), and today (zero + applied) in **both** themes → assert **0 critical** violations (color-contrast, button-name, link-name, aria, list). Tab through each screen asserting a visible focus outline (computed `outline-width` ≥ 3px on `:focus-visible`) on every §5.1 control and no keyboard trap.
10. **Tap targets (§5.3):** at 375px assert each bottom tab and the theme/search/favorite/applied controls have `getBoundingClientRect()` ≥44×44 (or ≥44 in the thumb axis).

---

## 10. Acceptance criteria (all must hold)

- F-001 grammar fixed: chip "N-day streak", nudge "keep your N-day streak", status line "Current streak: N days" unchanged; all Sprint-005 streak math identical.
- All six self-suites green (content, shell, visuals, nav, daily) with no regression; new `test:accept` and `check:originality` green.
- §5.1 every enumerated control keyboard-reachable/operable with a visible focus outline and accessible name; no keyboard trap; reduced-motion suppresses the card transition.
- §5.2 all pinned text pairs ≥4.5:1 in BOTH themes; accent never used for text; axe 0 critical on all sampled screens × both themes.
- §5.3 tap targets ≥44×44 as specified.
- §6.1 executable originality proxies pass (B2 fidelity, B3 non-empty, B5 prompt-last, count 74=52+7+6+5+4); §6.2 manual sample flagged nothing.
- §7 no horizontal scroll at 375/320 anywhere; type scale + named dual themes + persisted theme + per-card SVG present; §7b no FOUC, no post-first-load network, no cross-origin/image-diagram requests.
- §9.2 all eight user-story paths pass; §4 every state (empty/loading/success/no-match/invalid/offline) verified live.
- §8 no backend/network/secrets; git hygiene clean; SW cache bumped to v6 iff shipped assets changed.

## 11. Non-goals (restate — protect passing work)
- No content re-authoring, no router/renderer/SVG/nav re-architecture, no new features/screens/routes, no SRS/sharing/accounts/notifications.
- No palette/font change except a single-token contrast fix iff a §5.2 pair measures below floor (none expected).
- No new raster assets; test/script files are NOT precached/shipped.
- The offline gate (B20) and all Sprint 001–005 passing behavior must be preserved exactly.
