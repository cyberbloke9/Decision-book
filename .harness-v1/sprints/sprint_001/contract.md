# Sprint 001 Contract — App Shell & PWA Foundation

Maps to ROADMAP Phase 1 and spec §11 Sprint 001. This sprint delivers the **chrome**: the installable, offline-capable, themeable app shell with working bottom-tab navigation. It deliberately ships **no framework content, no framework SVGs, no situation routing, no search logic, no favorites logic, no daily-card rotation** — those are Sprints 002–005. Each content region renders only its genuine, standalone empty / first-run state.

Spec behaviors in scope: **B14** (theme persist), **B19** (manifest + icons), **B20** (service worker + offline), and the shell-level slices of **B21/B22/B23** (a11y for the shell's own controls) and §7 design baseline (mobile-first, thumb nav, no horizontal scroll).

---

## 1. User-visible behaviors (exact)

### 1.1 App shell chrome
- On load the app shows a persistent **top app bar** and a persistent **bottom tab bar**, with a scrollable content region between them.
- Top app bar contains: the product wordmark **"Pocket Decision Book"** (or a defined shortened brand at <=360px), a **theme toggle** control, and a **search** affordance (button/icon). The search affordance routes to the Search screen; it does NOT need working search this sprint.
- The chrome (top bar + bottom nav) stays fixed/visible while the content region scrolls.

### 1.2 Bottom-tab navigation (4 tabs)
- Exactly four tabs, left-to-right: **Situations**, **Browse**, **Favorites**, **Today**.
- **Situations** is the default screen on first load (empty hash / `#/situations`).
- Tapping a tab switches the visible screen, updates the URL hash, and marks that tab active.
- The active tab is visually distinct AND exposes `aria-current="page"` (or `aria-selected` if implemented as a tablist).
- Each tab has a text label (an icon-only tab is not acceptable this sprint; icon+label is fine).

### 1.3 Routing
- Routing is **hash-based** (`#/situations`, `#/browse`, `#/favorites`, `#/today`, `#/search`). No server-side rewrites required — must work when served as static files and offline.
- Reloading the page on any screen restores that same screen (hash survives reload).
- An unknown/garbage hash (e.g. `#/nonsense`) falls back to the default Situations screen without a console error.

### 1.4 Theme toggle (B14)
- The theme toggle switches between a defined **dark** theme and a defined **light** theme (two authored palettes, not raw browser defaults).
- The choice is written to `localStorage` under a stable key (declare it, e.g. `pdb.theme`).
- **Mechanism (structural, testable):** an **inline blocking `<script>` in `<head>`** reads `localStorage["pdb.theme"]` (falling back to `prefers-color-scheme`, then dark) and sets the theme class/attribute on `<html>` **before the stylesheet-driven first paint**, so there is no flash of the wrong theme. The contract tests the mechanism's presence (see §11 step 4b), not a visual flash frame. If no stored preference exists, initial theme follows `prefers-color-scheme`, defaulting to dark if unknown.
- After toggling and a **full page reload**, the chosen theme is still applied.
- The toggle control has an accessible name that reflects its action (e.g. `aria-label="Switch to light theme"` / `"Switch to dark theme"`), updated to match current state.

### 1.5 Screen content for THIS sprint (honest empty / first-run states only)
No screen may contain placeholder/TODO/"coming soon"/lorem text. Each screen shows a real heading and standalone, truthful copy:
- **Situations (default / home):** a genuine welcome/onboarding panel — the product's one-line promise and a short "how to use this" orientation written as real product copy. This is legitimate onboarding content, not a stub. It must NOT list situation buttons (that is Sprint 004).
- **Browse:** the section heading plus a truthful short line describing what Browse is for. No category tiles or framework lists this sprint.
- **Favorites:** the genuine **empty favorites state** required by spec §6 — e.g. a heading plus "No favorites yet. Frameworks you star will appear here." plus a clear (visual) star hint. Copy must stand on its own without promising unbuilt UI.
- **Today:** the genuine **first-run daily state** — a heading plus honest copy that no framework has been surfaced yet. No streak numbers, no rotation logic this sprint.
- **Search:** the genuine **no-query-entered state** — a search input (may be non-functional for filtering this sprint) and a short prompt. The input must be a styled control, not a raw default input.

---

## 2. Routes / screens / components affected
- `index.html` — single-page shell markup (app bar, `<main>` content region, bottom `<nav>`).
- Content screens: Situations, Browse, Favorites, Today, Search (rendered/toggled by the shell router).
- Components: top app bar, bottom tab bar, theme toggle, screen container.

## 3. Data / state transitions
- `localStorage["pdb.theme"]` ∈ {`"dark"`, `"light"`}. Written on toggle, read on load. No other persisted keys this sprint.
- In-memory: current route (from `location.hash`). No framework data store yet.
- No network calls anywhere except the service worker's own cache population on first load. No `fetch()` to any remote origin.

## 4. States that must exist (this sprint)
- **Empty:** Favorites empty state; Today first-run state; Search no-query state (all per §1.5).
- **Loading / first paint:** shell paints with correct theme immediately; no flash of unstyled content and no theme flash.
- **Success:** tab switch renders the target screen; theme toggle visibly changes palette.
- **Error / invalid:** unknown hash falls back to default screen, no crash, no console error.
- **Offline:** after first successful load, a reload with network disabled still renders the full shell, all four tabs navigate, and theme toggle still works (all assets are same-origin and cached).
- **Install not offered:** where the browser gives no install prompt, the app still works as a normal responsive web app (install is an enhancement, never a gate).

## 5. Keyboard / focus / ARIA / contrast
- All shell controls (4 tabs, theme toggle, search affordance, search input) are reachable and operable by keyboard (Tab to focus, Enter/Space to activate).
- Every interactive control has a **visible focus indicator** (not the suppressed default; an authored focus ring).
- Every interactive control has an accessible name (visible label or `aria-label`).
- Active tab exposes `aria-current="page"` (or `aria-selected="true"` in a tablist).
- The document has `lang="en"`, a `<title>`, and one top-level `<h1>` per screen (or an app-level `<h1>` + `<h2>` screen headings — declare which).
- **Contrast (B22):** all shell text (wordmark, tab labels, headings, body copy, empty-state copy) meets WCAG AA — ≥4.5:1 for normal text, ≥3:1 for large text — in **both** dark and light themes. Focus indicators meet ≥3:1 against their adjacent background.

## 6. Responsive expectations
- Baseline viewport **375×667**. No horizontal scroll on any screen: `document.documentElement.scrollWidth <= clientWidth` and `document.body.scrollWidth <= window.innerWidth`.
- Also verify no horizontal scroll at **320px** width (smallest common phone).
- Bottom tab targets are each **≥44×44 CSS px** (B23) and sit within thumb reach (bottom-fixed).
- Layout remains usable up to tablet/desktop widths (content max-width constrained and centered; chrome does not break) — no hard requirement beyond "does not visually break".

## 7. Design direction (shell-level, §7)
- A named, intentional palette defined as CSS custom properties (design tokens) with distinct dark and light token sets. No default-blue links, no unstyled inputs.
- A deliberate type scale (declare the scale, e.g. a modular ratio) with distinct heading vs. body treatment; readable body size (≥16px).
- At least one purposeful, subtle transition (e.g. tab/screen change) that is non-janky and is **disabled/reduced under `prefers-reduced-motion: reduce`**.
- The shell must read as a considered product, not a CSS-reset skeleton. Emoji-as-only-icon-system is discouraged; if icons are used they should be a consistent set (inline SVG or an authored glyph set).

## 8. PWA requirements
### 8.1 Manifest (B19)
- `manifest.json` (or `.webmanifest`) linked from `index.html`, containing at least: `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color`, and `icons`.
- `icons` MUST include a **192×192** PNG and a **512×512** PNG that exist on disk at their referenced paths and are valid PNGs of exactly those pixel dimensions. A maskable icon entry is encouraged but not required.
- Icons may be generated programmatically or exported from an authored SVG; they are the only permitted raster assets. Declare how they were produced (e.g. a `scripts/gen-icons.*` file or a committed generation step).

### 8.2 Service worker (B20)
- `start_url` = `.` (resolves to the served root). The app must open correctly at both `/` and `/index.html`.
- A service worker registered from `index.html`, scoped to the app root, that:
  - pre-caches the app shell on `install`, **including BOTH the bare root navigation path `/` (or `./`) AND `/index.html`**, plus CSS, JS, manifest, both icons, and any fonts,
  - has a **`fetch` event handler** serving cached assets (cache-first for the shell); for navigation requests that miss, it falls back to the cached shell document (so any hash route resolves offline),
  - cleans up old caches on `activate` (versioned cache name).
- **Offline gate (both paths tested):** after first load + SW activation, with the browser context set **offline**, (a) reloading the current URL renders the shell, AND (b) a cold `goto('/')` renders the shell — start_url / cached-entry / served-path must not mismatch.

## 9. Security / privacy assumptions
- No backend, no remote fetch, no analytics, no third-party network requests. All assets same-origin.
- No secrets, tokens, keys, or `.env` values in any tracked file.
- `.gitignore` must cover `.env*`, `*.db` (there is a `ruvector.db` in the project root — it must NOT be committed), `.harness/`, and `node_modules/`. `git status --porcelain` must not surface any of these.

## 10. Commands to run
From the project root `/Users/prithviputta/Downloads/pocket-decision-book`:
```
# Static serve (choose one; document the port used)
python3 -m http.server 4173
#   → app at http://localhost:4173/index.html  (or /)

# Lighthouse note: modern Lighthouse (v12+) REMOVED the standalone PWA
# category, so `--only-categories=pwa` no longer exists as a gate. The exact
# installability criteria Lighthouse used to check — a valid manifest, 192+512
# icons, a service worker with a fetch handler, served over a secure context
# (localhost qualifies) — are verified DIRECTLY in §8 and §11 below. Those are
# the authoritative substitute for the retired Lighthouse PWA audit. If a
# Lighthouse binary that still supports it is available, running it is a fine
# optional positive signal but is non-blocking.
```
- If a Playwright harness is added, it lives under the project (declare path, e.g. `tests/`), and the Evaluator may run it. Do not require a network connection for the app itself.
- Accessibility assertions in §11 use `@axe-core/playwright` (`npx --yes playwright install chromium` first if needed).

## 11. Playwright click paths for the Evaluator
Serve first (`python3 -m http.server 4173`), base URL `http://localhost:4173/`.

1. **Load & no-scroll (375px):** set viewport 375×667, goto `/`. Assert default screen is Situations. Assert `documentElement.scrollWidth <= clientWidth`. Repeat the scroll assertion at 320px width.
2. **Tab navigation:** click each of Situations / Browse / Favorites / Today. Assert the visible screen heading changes, the hash updates (`#/browse`, etc.), and the clicked tab gets `aria-current="page"`. Assert no console error during navigation.
3. **Empty states:** on Favorites assert the empty-favorites copy is present; on Today assert first-run copy; on Search (via the app-bar search affordance) assert a styled input + no-query prompt. Assert none of the screens contain the strings `TODO`, `coming soon`, `lorem`, `placeholder` (case-insensitive).
4. **Theme persist (B14):** read `document.body`/root computed `background-color` and `localStorage["pdb.theme"]`. Click theme toggle → assert background color changes and `localStorage["pdb.theme"]` flips. **Reload** the page → assert the toggled theme is still applied (same computed background + same localStorage value).
4b. **No-flash mechanism (structural):** assert `<head>` contains an inline `<script>` (no `src`) that references `pdb.theme` and sets the theme on `document.documentElement`, and that this script appears before the main stylesheet `<link>`. (Verifies the anti-flash mechanism from §1.4 without racing a paint frame.)
5. **Routing survives reload:** navigate to Browse (`#/browse`), reload, assert still on Browse.
6. **Unknown hash:** goto `/#/nonsense`, assert it falls back to Situations with no console error.
7. **Keyboard:** from a fresh load, Tab through the shell; assert each tab, the theme toggle, and the search affordance can receive focus and show a visible focus ring; activate the theme toggle with Enter/Space and assert the theme changes.
8. **Manifest + icons (B19):** fetch `/manifest.json`, assert required keys and that it lists 192 and 512 icons; fetch each icon URL, assert HTTP 200 and PNG signature; (optional) assert pixel dimensions.
9. **Service worker + offline (B20):** load `/`, wait for `navigator.serviceWorker.ready` and an active worker. Set the browser context **offline**, then (a) reload the current URL and (b) in a fresh page do a cold `goto('/')`. In both cases assert the shell renders, the Situations heading is visible, and clicking Browse still switches screens while offline.
10. **Accessibility / contrast (B21/B22):** run `@axe-core/playwright` on each screen in **dark** theme, then toggle to **light** and re-run; assert zero violations of `color-contrast`, `document-title`, `html-has-lang`, and `label`/`button-name` rules in both themes. (This is the authoritative AA-contrast check for §5.)
11. **Reduced motion (§7):** emulate `prefers-reduced-motion: reduce` (`page.emulateMedia({ reducedMotion: 'reduce' })`), switch tabs, and assert the screen-transition element's computed `transition-duration`/`animation-duration` resolves to `0s`/`none`.
12. **Semantics:** assert `<html lang="en">`, a non-empty `<title>`, and exactly one visible `<h1>` on the current screen (or one app-level `<h1>` plus `<h2>` screen headings — whichever the build declares; assert the declared structure).
13. **Console cleanliness:** across all steps, assert zero `console.error` and zero `console.warn` emitted by the app.

## 12. Explicit non-goals (out of scope this sprint — building any of these is scope creep)
- No framework data module and no framework cards (Sprint 002).
- No framework SVG visuals (Sprint 003).
- No situation-option buttons or trigger→framework routing (Sprint 004).
- No working search filtering, no browse category listings, no favorites add/remove logic or persistence beyond the empty state (Sprint 004).
- No daily-card rotation, streak, or "applied it" logging (Sprint 005).
- No content originality authoring (Sprints 002/006). This sprint ships zero framework prose.

## 13. Acceptance summary (all must hold)
- [ ] Loads at 375px and 320px with **no horizontal scroll** on every screen.
- [ ] Four working bottom tabs with hash routing; reload preserves screen; unknown hash falls back cleanly.
- [ ] Theme dark/light toggle **persists across reload** (localStorage + no theme flash on load).
- [ ] Valid `manifest.json` with **192 & 512 PNG icons that exist and load**.
- [ ] Service worker with a **fetch handler**; app **works offline after first load** (shell + all tab navigation + theme toggle).
- [ ] All shell controls keyboard-operable with visible focus and accessible names; active tab `aria-current`.
- [ ] AA contrast for shell text in **both** themes — **verified via `@axe-core/playwright` `color-contrast` = 0 violations** in dark and light.
- [ ] `prefers-reduced-motion: reduce` zeroes shell transitions; anti-flash inline head script present.
- [ ] Honest empty/first-run states only — **no TODO/placeholder/"coming soon"/lorem** anywhere.
- [ ] **Zero** console errors or warnings.
- [ ] `.gitignore` covers `.env*`, `*.db`, `.harness/`, `node_modules/`; `git status --porcelain` shows no such artifacts; no secrets committed.
