# Sprint 005 Contract — Daily Card Habit Loop (rotation, "applied it" log, streak)

Maps to ROADMAP Phase 5 and spec §11 Sprint 005. This sprint turns the **Today** tab from the Sprint-001 static "No card yet today" placeholder into a working **daily habit loop**: one framework surfaces per calendar day by deterministic date-based rotation, the user taps **"applied it"** to log the day, and a **streak** indicator counts consecutive applied days and handles missed days and first-use without crashing.

Spec behaviors in scope: **B16** (deterministic date-based rotation — same date ⇒ same framework, date rollover ⇒ different framework, testable via an injected date), **B17** (one-tap "applied it" reflection logged in `localStorage`), **B18** (streak indicator over consecutive applied days; graceful missed-day + sane first-use empty state). It preserves the passing Sprint-002/003 card render (**B1–B7**), the Sprint-004 navigation/favorites (**B8–B13**), the persistence guarantee **B15** (all state in `localStorage`, no backend), and the Sprint-001 offline gate (**B20**).

**Out of scope this sprint:** any spaced-repetition scheduling engine (spec §8 non-goal), multi-day history/calendar UI beyond the single streak count, notifications/reminders, and any change to the six-part card body/order, the SVG visuals, the situation/browse/search/favorites screens, or the palette/fonts.

Authoritative sources: `js/data.js` (the accepted 74-framework module with `frameworks`, `byId`, `categoryById`, `categories`) and `js/card.js` (the accepted six-part renderer, reused here). **Do not re-key or re-author any accepted content.** This sprint adds the daily loop and one strictly-additive option on the card renderer; it does not touch card content.

---

## 1. User-visible behaviors (exact)

### 1.1 The daily card is the Today screen (B16)
- `#/today` **replaces its static "No card yet today" empty-state panel** with a live **daily card view**: a **habit bar** (date + streak indicator + the "applied it" control) followed by **today's framework rendered as the full six-part card** (reusing the Sprint-002/003 `renderCard`).
  - **Decision (write it down so it isn't flagged as missing copy):** the static empty-state (`.empty-state` with "No card yet today" / "Once frameworks are loaded…") is **removed** from `#screen-today`; there is always exactly one framework for the current day, so that placeholder no longer applies. Its guidance is embodied by the live habit bar + card.
- **Exactly one** framework is shown for the current calendar day, chosen by **deterministic date-based rotation**:
  - Let `dayNumber = Math.floor(Date.UTC(y, m-1, d) / 86400000)` for the current date `YYYY-MM-DD`.
  - `index = ((dayNumber % N) + N) % N` where `N = PDB_DATA.frameworks.length` (= 74).
  - `dailyFramework = PDB_DATA.frameworks[index]`.
- **Determinism (B16, testable without waiting 24h):** the **same date always yields the same framework**; a **date advance to the next calendar day yields a different framework** (consecutive `dayNumber`s give consecutive indices modulo 74, and the 74 frameworks are distinct, so day D and day D+1 never collide). Re-injecting the earlier date restores the earlier framework.
- The rendered today card exposes the chosen framework id for verification: the today card container carries **`data-framework-id="<id>"`**, and `PDB_DAILY.dailyFramework(dateStr)` returns the same framework object for that `YYYY-MM-DD` string.

### 1.2 Single injectable date source (B16, spec R5)
- **One** function, `PDB_DAILY.today()`, returns the current date as a **`YYYY-MM-DD` string**, and is the **only** date read used by rotation, applied-today, and streak (no second `new Date()` in any consumer — a divergent read is a defect).
- `today()` resolves in this precedence and **must parse by explicit components into `Date.UTC(...)`, never `new Date(str)`** (which reads local-tz getters and would make "same date ⇒ same framework" fail across timezones):
  1. `window.__PDB_NOW__` if it is a valid `YYYY-MM-DD` string → used verbatim (the test-injection hook; `page.addInitScript` re-runs it on every reload).
  2. else `localStorage['pdb.testDate']` if a valid `YYYY-MM-DD` → used (secondary injection that survives reload).
  3. else the **real local date**, formatted `YYYY-MM-DD` from the device's local `getFullYear/getMonth/getDate` (so a user sees *their* civil day), then treated as a plain date string for all downstream UTC-based day-number math.
- Invalid/garbage injection values are ignored (fall through to the real date); `today()` never throws.

### 1.3 "Applied it" — one-tap log (B17)
- The habit bar contains an **"applied it" `<button>`** (a toggle, mirroring the favorites pattern) with **`aria-pressed`** reflecting whether **today** is logged as applied.
- Tapping it toggles **only the current day** (`PDB_DAILY.today()`): press ⇒ today added to the applied log and `aria-pressed="true"`; press again ⇒ today removed and `aria-pressed="false"`. Its accessible label updates ("Mark today's card as applied" ↔ "Applied today — tap to undo").
- **This is a one-tap boolean log, NOT a text/journal/note field.** No free-text reflection input (that is the Decision-Journal framework's territory and out of scope / an originality risk).
- The applied log is a **JSON array of `YYYY-MM-DD` date strings** in `localStorage['pdb.applied']`, deduplicated and sanitized (only well-formed date strings kept; corrupt/non-string junk dropped so streak math never NaNs). Robust to missing/blocked/corrupt storage via try/catch → behaves as empty, **never throws** (same discipline as `js/favorites.js`).
- **Persistence (B17, B15):** tapping "applied it", then a full reload (date held fixed via injection), shows **still applied** (`aria-pressed="true"`) and the streak reflecting it. Un-applying persists identically across reload. All state is `localStorage`; **no backend, no network call anywhere**.

### 1.4 Streak indicator (B18)
- The habit bar shows a **streak indicator**: a numeric count + label (e.g. "3-day streak") with an inline SVG glyph (`aria-hidden`); the streak value is conveyed **as text** to assistive tech (e.g. an accessible line "Current streak: 3 days"). No emoji-as-only-icon.
- **Streak definition (pinned — generator and evaluator MUST test the SAME rule; this is the grace rule that "celebrates persistence"):**
  > `streak(today)` = the length of the run of consecutive calendar days, each present in the applied log, counting back from the **most recent applied day** — **but only if that most-recent applied day is today or yesterday**; otherwise the streak is **0**.
  - Worked examples (inject dates to verify; `Dk` = `today − k` days):
    - applied `{D-2, D-1, D}`, today `= D` → **3**.
    - applied `{D-2, D-1}`, today `= D` (today not yet applied) → **2**  *(grace: a rolled-over but not-yet-applied day does not break a live streak).*
    - applied `{D-2, D}`, today `= D` (gap at D-1) → **1** *(run counts back from D; D-1 missing stops it).*
    - most-recent applied `= D-3` (nothing in D-2..D) → **0** *(broken: neither today nor yesterday applied).*
    - applied log empty (first-ever use) → **0**.
- The streak value is a **non-negative integer**, never negative, never `NaN`, never a fraction.
- **First-ever / zero state (B18):** with `streak === 0` and today not applied, the habit bar shows a **sane starter state** — e.g. streak "0" with copy inviting the first log ("Apply today's card to start your streak"), **not** a blank, not a crash, not "No card yet today".
- **At-risk state:** when `streak > 0` but today is not yet applied (the grace case), the copy nudges to keep it alive (e.g. "Apply today's card to keep your 2-day streak") — informational only; toggling applied updates the count live without a reload.
- Exposed for testing: `PDB_DAILY.streak(dateStr)` returns the integer for that `YYYY-MM-DD`.

---

## 2. Routes / screens / components affected

- **New file `js/daily.js`** — authored. Attaches `window.PDB_DAILY` with:
  - `today()` → current `YYYY-MM-DD` string (§1.2, single injectable source, UTC-component parsing, never throws).
  - `dailyFramework(dateStr, data?)` → the framework object for that date via the modulo rotation (§1.1); `data` defaults to `window.PDB_DATA`.
  - Applied log store over `localStorage['pdb.applied']`: `isApplied(dateStr)` → boolean, `toggle(dateStr)` → new boolean, `all()` → sanitized array of date strings. try/catch-guarded, sanitized, never throws.
  - `streak(dateStr)` → non-negative integer per the pinned rule (§1.4).
  - `renderToday(mount, data?)` → renders the habit bar + the daily card into `mount` (composes `PDB_CARD.renderCard` for the card body). Pure of navigation side effects; wires the "applied it" toggle and updates the streak/label live on toggle. Uses only `today()` for the current date.
  - No `Math.random`. No second `new Date()` outside `today()`. No network.
- **Modified `js/card.js`** — **strictly additive** options parameter only. New signature `renderCard(fw, mount, data, options)` where `options = { headingId, showBack }` **defaults to `{ headingId: "h-framework", showBack: true }`**. With defaults, `#/f/:id` behavior is **byte-for-byte unchanged**. The Today screen calls it with `{ headingId: "h-today-card", showBack: false }` so:
  - the card `<h2>` gets id `h-today-card` (avoids a duplicate `h-framework` id existing in two DOM screens — a validity/a11y defect), and
  - the "Back to Browse" link is omitted (Today is a root tab, not a drill-in).
  - The six-part body, its order, and the **prompt-last invariant** (`article.card` `lastElementChild` === `.card-part.card-prompt`, B5) are untouched. The favorite star in the card header remains (favoriting the daily framework works from Today too).
- **Modified `js/app.js`** — router only: add a `case "today":` in `renderScreenContent` that calls `PDB_DAILY.renderToday(byId("today-mount"), data)`. Existing routes, theme, SW registration, framework-card and not-found behavior preserved. `region.setAttribute("aria-labelledby","h-today")` still resolves (the static `#h-today` heading is retained above the mount).
- **Modified `index.html`** —
  - `#screen-today`: **remove** the `.empty-state` placeholder; **keep** the `<h2 id="h-today">` section heading; add `<div id="today-mount" class="today-mount">` for the dynamic habit bar + daily card.
  - Load order: `js/data.js` → `js/nav-data.js` → `js/favorites.js` → **`js/daily.js`** → `js/visuals.js` → `js/lists.js` → `js/card.js` → `js/app.js`. (`daily.js` needs `PDB_DATA`; it calls `PDB_CARD` at render time, after all scripts load.)
- **Modified `styles/app.css`** — styles for the habit bar (date + streak + applied button) and the today-mount layout. **Reuse Sprint-001 tokens only — no new palette, no new fonts.**
- **Modified `sw.js`** — precache **`./js/daily.js`**; **bump the cache version `pdb-shell-v4` → `pdb-shell-v5`**; `activate` must purge the old cache (protects B20 — §8).
- **New file `tests/daily.spec.mjs`** — the Sprint-005 self-suite (§9). Add `"test:daily": "node tests/daily.spec.mjs"` to `package.json` scripts.
- **Modified `tests/nav.spec.mjs`** — the Sprint-004 suite asserts (line ~403) that `#screen-today` contains **"No card yet today"** (the old placeholder). Sprint 005 **owns** Today, so that assertion must be **updated** to reflect the new dynamic Today: assert `#screen-today` now renders a `#today-mount` containing the daily habit bar (an "applied it" `<button>` and a streak indicator) and a `.card` with a `data-framework-id`, and that **no "No card yet today" text remains**. This is required BUILD work, not an accidental regression.

---

## 3. Anchors vs buttons (get this right — it is directly evaluator-tested)
- **State toggle is a `<button>`** with `aria-pressed`: the **"applied it"** control (it mutates local state, it is not navigation). It must not be a link.
- Any navigation added (there is none required beyond the reused card's favorite button) stays consistent with Sprint-004 (`<a href="#/…">`). The reused favorite star remains a `<button aria-pressed>`.

---

## 4. Data / state transitions
- **Route → screen:** `today` renders the habit bar + daily card into `#today-mount`. The four bottom tabs remain `situations/browse/favorites/today`; `#/today` is the Today tab.
- **Applied toggle:** click/Enter/Space → `PDB_DAILY.toggle(today())` → button `aria-pressed` flips, accessible label updates, `localStorage['pdb.applied']` updated, **streak indicator + copy re-render live** (no reload, no hash change). A full reload (date injection held) preserves the state.
- **Date source:** `PDB_DAILY.today()` is read once per render for the current date and reused for rotation, applied-today, and streak (single source, §1.2).
- **Heading:** `#screen-today` keeps its static `<h2 id="h-today">` (so `aria-labelledby="h-today"` set by the router resolves); the daily card's own `<h2 id="h-today-card">` is a distinct, unique id (no duplicate `h-framework`).

## 5. States that must exist (this sprint)
- **First-ever / zero streak (empty):** fresh `localStorage`, today not applied ⇒ streak "0" with starter copy inviting the first log; the daily card still renders fully. Not blank, no crash, no "No card yet today".
- **Success / applied:** tap "applied it" ⇒ `aria-pressed="true"`, streak increments live (e.g. 0→1 on first-ever, or +1 vs yesterday's run), persists across reload.
- **At-risk (grace):** streak `> 0` from prior days, today not yet applied ⇒ streak still shows the live count with nudge copy; applying today keeps/extends it.
- **Missed day (broken streak):** a gap such that neither today nor yesterday is applied ⇒ streak `0`, handled gracefully (no negative, no NaN); UI shows the starter/zero state.
- **Determinism:** same injected date ⇒ same `data-framework-id`; next-day injection ⇒ different `data-framework-id`; re-inject earlier date ⇒ original id.
- **Corrupt/blocked storage:** `localStorage['pdb.applied']` set to non-JSON or a non-array or an array with junk entries ⇒ app still loads, streak computes over the sanitized subset, **no thrown error, no console error**.
- **Offline:** after first load + SW activation, with the network disabled, `#/today` renders the habit bar + daily card and the "applied it" toggle works from cache (§8).

## 6. Keyboard / focus / ARIA / contrast — binding for the new controls
Each must be keyboard-reachable **and** operable, have a **visible focus state**, an **accessible name**, a tap target **≥44×44px** (for the applied button as a primary control), and meet **WCAG AA (≥4.5:1 text)** in **both** dark and light themes:
- the **"applied it"** toggle (`aria-pressed`, dynamic `aria-label`, focus ring, ≥44px);
- the streak indicator conveys its value as **text** to AT (glyph `aria-hidden`); if the streak/label region updates on toggle, it is an `aria-live="polite"` region so the change is announced.
- All Sprint-001/002/003/004 keyboard, focus-ring, heading, figure-a11y, and the reused card's `aria-hidden` SVG + favorite button behavior are preserved unchanged. No positive `tabindex`. Lists (if any) use semantic markup. Icons inside controls are `aria-hidden`.

## 7. Responsive expectations
- At **375px and 320px**: **no horizontal scroll** on `#/today` (`documentElement.scrollWidth <= clientWidth`; `body.scrollWidth <= innerWidth`) — habit bar (date + streak + applied button) reflows to the narrow column; the daily card is the same responsive Sprint-002/003 card. Long framework names and streak copy **wrap**, never force a scroll or clip under the fixed app bar / bottom tab bar.
- The "applied it" button and any tappable habit-bar controls are ≥44px thumb-reachable.

## 8. PWA / security / offline

### 8.1 Security / privacy
- No backend, no remote fetch, no analytics, no third-party requests. `js/daily.js` is same-origin static content. All applied/streak state is local (`localStorage['pdb.applied']`).
- No secrets/tokens/keys in any tracked file. `.gitignore` continues to cover `.env*`, `*.db`, `.harness/`, `node_modules/`; `git status --porcelain` surfaces none of them.

### 8.2 Offline regression (protect the passing B20 gate) — REQUIRED
- `sw.js` must **add `./js/daily.js` to the precache list** AND **bump the cache version `pdb-shell-v4` → `pdb-shell-v5`**, with `activate` purging the old cache. Failing to bump serves returning users a stale shell lacking `daily.js` → broken Today offline.
- After first load + SW activation, with the context **offline**, a cold `goto` to `#/today` renders the working daily card + habit bar and the "applied it" toggle mutates state, all from cache.

## 9. Commands to run
From project root `/Users/prithviputta/Downloads/pocket-decision-book`:
```
# Static serve (unchanged; port 4173)
python3 -m http.server 4173

# Sprint 005 daily self-suite (new)
node tests/daily.spec.mjs         # or: npm run test:daily

# Prior suites must still pass (regression)
node tests/nav.spec.mjs           # Sprint 004 (Today assertion UPDATED this sprint)
node tests/content.spec.mjs       # Sprint 002
node tests/visuals.spec.mjs       # Sprint 003
node tests/shell.spec.mjs         # Sprint 001
```
- Playwright/axe already installed; `npx --yes playwright install chromium` if needed.

## 10. Playwright / Node click paths for the Evaluator
Serve first (`python3 -m http.server 4173`), base `http://localhost:4173/`. Inject the date with `page.addInitScript(d => { window.__PDB_NOW__ = d; }, "2026-07-06")` **before** `goto` (it re-runs on reload).

1. **Daily card renders (B16).** `goto('/#/today')`. Assert `#today-mount` has a `.card` with the six parts and a `data-framework-id`, plus a habit bar with an "applied it" `<button>` and a streak indicator. Assert the old "No card yet today" text is **gone** from `#screen-today`.
2. **Determinism — same date ⇒ same framework.** Inject `"2026-07-06"`, load, read `data-framework-id` = idA. Reload → still idA. In-page: `PDB_DAILY.dailyFramework("2026-07-06").id === idA`, and equals `PDB_DATA.frameworks[(((Math.floor(Date.UTC(2026,6,6)/864e5)) % 74)+74)%74].id`.
3. **Determinism — date advance ⇒ different framework.** Inject `"2026-07-07"`, reload → `data-framework-id` = idB, assert `idB !== idA`. Re-inject `"2026-07-06"`, reload → back to idA. Spot-check a handful of consecutive days: each adjacent pair differs.
4. **Applied toggle + persistence (B17).** Fresh `localStorage`, date fixed `"2026-07-06"`. Assert applied button `aria-pressed="false"`, streak "0" with starter copy. Click it → `aria-pressed="true"`, streak "1" live (no reload). Reload → still `aria-pressed="true"`, streak "1". `localStorage['pdb.applied']` is a JSON array containing `"2026-07-06"`. Click again → `aria-pressed="false"`, streak "0"; reload → still off.
5. **Streak rule (B18) — the pinned examples.** Seed `localStorage['pdb.applied']` directly, fix `today`, read `PDB_DAILY.streak(today)`:
   - `["2026-07-04","2026-07-05","2026-07-06"]`, today `2026-07-06` → **3**.
   - `["2026-07-04","2026-07-05"]`, today `2026-07-06` → **2** (grace).
   - `["2026-07-04","2026-07-06"]`, today `2026-07-06` → **1** (gap at 07-05).
   - `["2026-07-03"]`, today `2026-07-06` → **0** (broken).
   - `[]`, today `2026-07-06` → **0**. And the rendered streak indicator matches for each.
6. **Missed-day / corrupt storage — no crash.** Set `localStorage['pdb.applied']` to `"not json"`, then to `'{"a":1}'`, then to `'["2026-07-06", 42, "junk", null]'`; `goto('/#/today')` each → renders, streak is a non-negative integer (`42/null/"junk"` ignored; only valid dates counted), **zero console error/warn**.
7. **Single date source (§1.2).** In-page, confirm the id in the DOM, `PDB_DAILY.today()`, and the rotation/streak all agree for the injected date (no divergent second `new Date()`), and that an invalid `window.__PDB_NOW__="garbage"` falls through to the real date without throwing.
8. **Reused card is unchanged at `#/f/:id` (regression).** `goto('/#/f/<idA>')` → the card still has the "Back to Browse" link, `<h2 id="h-framework">`, six parts, `article.card` `lastElementChild` === `.card-part.card-prompt` (prompt-last, B5). The Today card uses `<h2 id="h-today-card">` and **no** back link; assert there is **no duplicate `id="h-framework"`** in the DOM.
9. **A11y (§6) — axe both themes.** `@axe-core/playwright` (theme set before paint) on `#/today` in the zero state, the applied state, and a >0 streak state, in **dark AND light**. Zero `color-contrast`, `button-name`, `aria-*`, `list`, `document-title`, `html-has-lang` violations. Keyboard-only: Tab reaches the "applied it" button with a visible focus ring; Enter/Space toggles it and the streak updates.
10. **Tap targets (B23).** The "applied it" button has a rendered box ≥44×44px at 375px; bottom tabs unchanged.
11. **No h-scroll (375 & 320).** No horizontal scroll on `#/today` at 375px and 320px, including a long-name daily framework and a multi-digit streak.
12. **Offline (B20 regression).** Load `/`, wait `serviceWorker.ready` + active worker; set context offline; cold `goto('/#/today')` in a fresh page → daily card + habit bar render from cache and the toggle works. Grep `sw.js`: `CACHE === "pdb-shell-v5"`, `./js/daily.js` precached, old cache purged on `activate`.
13. **Console cleanliness.** Across all steps, **zero** `console.error` and zero `console.warn` from the app.
14. **Non-regression.** `tests/content.spec.mjs`, `tests/visuals.spec.mjs`, `tests/shell.spec.mjs` still green. `tests/nav.spec.mjs` still green **with its Today assertion updated** (asserts the new dynamic Today, not the old placeholder). Situations/browse/search/favorites screens and the six-part card body are otherwise untouched; no new palette/fonts; no re-keyed content.

## 11. Explicit non-goals (out of scope — building any is scope creep)
- **No spaced-repetition / scheduling engine** (spec §8 — v2 candidate).
- **No free-text reflection / journal / note field** on "applied it" (it is a one-tap boolean log; free text is the Decision-Journal framework's territory and an originality risk).
- **No multi-day history, calendar, heatmap, or per-day list UI** — a single streak count is the whole habit surface this sprint.
- **No notifications, reminders, badges, or background sync.**
- **No changes** to situations/browse/search/favorites, the SVG visuals, or the six-part card **body/order** (the only card change is the additive `{ headingId, showBack }` option, defaults preserving `#/f/:id`).
- **No new fonts or palette.**
- **No backend, no IndexedDB, no cookies-for-state** — `localStorage` only (B15).

## 12. Known risks to disclose (name them; not blockers)
- **Timezone of the "real" day:** when no date is injected, `today()` uses the device's **local** civil date (correct for the user), but all day-number math is via `Date.UTC(y,m,d)` on those components — consistent internally. A user crossing midnight or a timezone boundary sees the day roll at their local midnight; acceptable for v1.
- **Rotation is a fixed cycle, not shuffled:** consecutive days walk the data order (index, index+1, …). It satisfies B16 (deterministic, adjacent days differ). It is not a randomized/curated daily selection; that is a v2 nicety.
- **Streak grace rule is a product choice:** a rolled-over-but-not-yet-applied day keeps a live streak (examples in §1.4). This is the pinned, tested behavior; a stricter "must apply every day or reset at midnight" rule is intentionally NOT used.

## 13. Acceptance summary (all must hold)
- [ ] `#/today` renders one framework per day by deterministic modulo-74 rotation over `PDB_DATA.frameworks`; `data-framework-id` + `PDB_DAILY.dailyFramework(dateStr)` expose it; the "No card yet today" placeholder is gone (B16).
- [ ] Same injected date ⇒ same framework; next calendar day ⇒ **different** framework; re-inject earlier date ⇒ original framework — verified without waiting 24h (B16).
- [ ] A **single** `PDB_DAILY.today()` (UTC-component parsing, honoring `window.__PDB_NOW__` then `localStorage['pdb.testDate']` then real local date) feeds rotation, applied-today, and streak; invalid injection ignored; never throws (B16/§1.2).
- [ ] "Applied it" is a one-tap `<button aria-pressed>` toggling **today only**, logged in `localStorage['pdb.applied']` (JSON date array), surviving reload both directions; no free-text field (B17/B15).
- [ ] Streak = the pinned grace rule with the five §1.4 worked examples; value is a non-negative integer, never negative/NaN; first-use zero state and missed-day are graceful; corrupt storage is sanitized without error (B18).
- [ ] "Applied it" button: keyboard-operable, visible focus, accessible name (dynamic), ≥44px, AA in **both** themes; streak conveyed as text; live region announces updates; axe zero `color-contrast`/`button-name`/`aria`/`list` both themes (§6).
- [ ] No horizontal scroll at **375px & 320px** on `#/today` (§7).
- [ ] `#/today` renders **offline** and the toggle works; `sw.js` bumped to `pdb-shell-v5`, `./js/daily.js` precached, old cache purged (B20/§8).
- [ ] `renderCard` change is strictly additive: `#/f/:id` unchanged (Back link, `h-framework`, six parts, prompt-last); Today card uses `h-today-card`, no back link, **no duplicate `h-framework` id** (§2/§10.8).
- [ ] `content`/`visuals`/`shell` suites still green; `nav` suite green **with its Today assertion updated** to the new dynamic Today; **zero** console errors/warnings anywhere.
- [ ] `.gitignore` covers `.env*`/`*.db`/`.harness/`/`node_modules/`; `git status --porcelain` shows no such artifacts; no secrets committed.
