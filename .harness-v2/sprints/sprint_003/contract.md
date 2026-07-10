# Sprint 003 Contract — UI transformation (ROADMAP Milestone 2, Phase 9)

> Binds: spec.md §5 (B32, B33, B34, B35, B36, B38, B39, B40), §7 Design Direction, §10 R3/R5,
> §11 Sprint 003; V2.md Part B.
> This sprint is the **visual identity transformation ONLY**: a new named palette (B32), a new type
> system with a distinct display face (B33), a hierarchy pass (B35), and AA re-verification of the new
> palette in both themes (B36/R5). The examples DATA is frozen (Sprint 001/002) and the persona tab
> **behavior** (B30/B31 ARIA/keyboard/per-instance-scoping) is frozen — this sprint only re-skins them.
> **No example authoring happens here**, so B28's draft→counter→final trace is **N/A** (see §11) — the
> Evaluator must NOT flag a missing `generator_trace_sprint_003.md`.

## 1. One-line summary

Replace the v1 palette and type system with the pinned "Field Manual" identity (paper-warm light theme,
deep-ink dark theme, a distinct slab display face for framework names) documented as a named token set;
enlarge the diagram and keep essence above the 375px fold (B35); re-verify AA in both themes on the new
palette (B36); migrate every hardcoded old-palette value across tests + `index.html` + `manifest.json`;
bump the SW cache `pdb-shell-v9` → `pdb-shell-v10`; keep every v1 + v2 suite green; push to both remotes.

## 2. Scope

- **In scope:** `styles/app.css` (palette tokens, font tokens, `.card-name`/`.card-figure`/`.card-visual`
  hierarchy CSS, and any persona-token AA fix that the new palette forces); `index.html` (theme-color meta,
  and — only if a self-hosted font is chosen — one `<link rel="preload">` + the font file);
  `manifest.json` (`theme_color`/`background_color`); `sw.js` (cache bump, + font file in SHELL only if
  self-hosting a webfont); the four hardcoded palette/SW test pins in `tests/`.
- **Out of scope (do NOT touch):** example DATA (`scripts/build-data.mjs`, `js/data.js`), the card
  renderer **behavior** (`js/card.js` DOM structure, tab widget ARIA/keyboard/per-instance ids, the
  featured/paired-tradeoff logic — §5.4 preserves these), `js/visuals.js` SVG geometry, nav data,
  favorites/daily/app logic. `js/card.js` MAY only be edited if a purely-presentational class hook is
  needed; no behavioral or DOM-order change is permitted (see §5.4).

## 3. User-visible behavior

- **UV1 — New identity at a glance (B32/B33/B34).** On first paint, both themes read as the "Field Manual"
  product: a paper-warm light theme and a deep-ink dark theme, framework NAMES set in a slab display face
  visibly different from the body face. This is NOT the v1 gold-on-navy / system-serif app.
- **UV2 — Persona system carries through (B34).** The five persona tabs + featured/paired-tradeoff card
  (shipped Sprint 002) remain the primary "different product" evidence; their behavior is unchanged, only
  restyled to the new palette. Persona accents stay legible (AA) on the new backgrounds.
- **UV3 — Hierarchy (B35).** `essence` stays above the fold at 375×667; the framework diagram is visibly
  larger than v1; pitfalls are visually distinct from the example block; the card still ENDS on the
  personal-prompt question.
- **UV4 — Theme toggle still flips (B36).** Toggling theme flips `--bg` between the two new values and
  persists across reload (accept.spec Story8 reads `--bg` dynamically and must stay green on the new
  values).
- **UV5 — No v1/v2 regression.** Every v1 flow (bottom-tab nav, browse, search + empty/no-match,
  favorites, daily card, situation nav, offline-after-first-load, not-found) and every Sprint-002 example
  behavior (featured-first, paired tradeoff, persona tabs, keyboard, per-instance scoping) behaves exactly
  as before, only re-skinned.

## 4. Palette contract (B32) — the pinned "Field Manual" token set

The v2 palette is a **named, documented set** ("Field Manual" — put the name in a CSS comment at the token
block). The tokens below are **pinned exact values**; ship them verbatim. This makes the machine gate
unambiguous: the computed value must EQUAL the v2 value and must NOT equal the v1 baseline (a 1-hex-digit
dodge cannot satisfy "equals a specific distinct value" — R3).

### 4.1 Dark theme — "Deep Ink"

| token          | v1 baseline (before) | v2 value (ship this) |
|----------------|----------------------|----------------------|
| `--bg`         | `#12141c`            | `#201811`            |
| `--surface`    | `#1b1e2b`            | `#2a2015`            |
| `--surface-2`  | `#232739`            | `#362a1c`            |
| `--border`     | `#333a52`            | `#524232`            |
| `--fg`         | `#eceef5`            | `#f4ede0`            |
| `--muted`      | `#b6bcd0`            | `#c3b7a1`            |
| `--accent`     | `#f0b429`            | `#e2622f`            |
| `--accent-soft`| `#3a3416`            | `#3d2416`            |
| `--focus`      | `#ffcd5c`            | `#ff8a5c`            |

`--bg` computed = `rgb(32, 24, 17)` (dark). Cool navy → warm ink; accent gold → vermilion.

### 4.2 Light theme — "Paper"

| token          | v1 baseline (before) | v2 value (ship this) |
|----------------|----------------------|----------------------|
| `--bg`         | `#f4f1e9`            | `#e9dfca`            |
| `--surface`    | `#ffffff`            | `#f6efdd`            |
| `--surface-2`  | `#efeade`            | `#ded1b5`            |
| `--border`     | `#d5cebd`            | `#c9b995`            |
| `--fg`         | `#1b1d26`            | `#241d12`            |
| `--muted`      | `#55596b`            | `#5a4f39`            |
| `--accent`     | `#a9741a`            | `#b5401d`            |
| `--accent-soft`| `#f2e6c9`            | `#ecdcc0`            |
| `--focus`      | `#8a5a00`            | `#8a2f12`            |

`--bg` computed = `rgb(233, 223, 202)` (light). Near-white cream → warm kraft paper; accent gold → rust.

### 4.3 Palette rules

- **B32 hard gate (machine):** for BOTH themes, computed `--bg`, `--surface`, `--accent` EQUAL the §4.1/§4.2
  v2 values AND do NOT equal the v1 baseline. `--accent` stays an **indicators-only** color (borders,
  focus, list markers, SVG accent fills) and is NEVER used to paint body text — preserve the v1 invariant
  so AA holds.
- **Shadow tokens** (`--shadow`) may be retuned to the warm palette (presentational, not gated).
- **Persona tokens (`--persona-*`) may be adjusted IF the new backgrounds break their AA** — this is
  in-scope because it is forced by the palette change and stays namespaced (must never overwrite a v1
  palette token). Any adjustment MUST keep every persona accent AA (≥4.5:1) as text on `--bg`/`--surface`/
  `--surface-2` in BOTH themes (axe color-contrast in content.spec/nav.spec scans the rendered card in both
  themes and is the gate).

## 5. Type system contract (B33) + hierarchy (B35)

### 5.1 Type system — distinct display face (B33)

- **`--font-display` (NEW token).** Introduce a display face for framework NAMES (`.card-name`, and the
  figure caption `.card-figcaption-name`) that is a **genuinely different family class** from the body
  face. Apply it to `.card-name` (and `.card-figcaption-name`).
- **Rendering-on-the-judge rule (BLOCKER-class).** The Evaluator judges on macOS; the FIRST available
  family in the display stack MUST render as a class distinct from the body face **on macOS** (a stack
  that silently falls through to a serif fallback matching a serif body FAILS B33's intent even if the CSS
  declares a distinct stack). Satisfy this ONE of two ways:
  - **(a) macOS-guaranteed distinct system family first** (default, zero new files): a slab/geometric face
    that ships on macOS, e.g. `--font-display: "American Typewriter", "Rockwell", "Roboto Slab", "Zilla Slab", Georgia, serif;`
    ("American Typewriter" is a slab, guaranteed on the Evaluator's macOS, genuinely distinct from a serif
    or sans body); **OR**
  - **(b) a self-hosted OFL webfont** `woff2` (offline-safe): add the file under the project, load it via
    `@font-face` (no external/CDN fetch), add the file path to `sw.js` SHELL + precache, and optionally
    `<link rel="preload">` it in `index.html`. Use only an OFL/SIL-licensed face (clean license, B40).
  Either way: **no external network fetch** (offline must still work — offline suite stays green).
- **v1 font values must not survive (B33 machine gate).** After this sprint, `styles/app.css` MUST NOT
  contain the v1 display value `"Iowan Old Style"` anywhere, and the v1 `--font-sans` value string
  `system-ui, -apple-system, "Segoe UI"` must not survive unchanged. Concretely:
  - `--font-serif` (editorial body reading: trigger/essence/prompt/pitfalls) is re-set to a new stack that
    does NOT lead with `"Iowan Old Style"` (e.g. `Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif` —
    Charter ships on macOS).
  - `--font-sans` (UI chrome: tabs/buttons/labels/SVG `v-text*`) is re-set so its v1 value is gone.
  - `--font-display` is the distinct display face per above.
- **Distinct-from-body gate:** `--font-display`'s first family ≠ `--font-serif`'s first family AND is a
  different family CLASS (slab/geometric vs the serif body). Evaluator confirms distinct rendering on
  macOS by eye; the machine part is: `--font-display` token exists, is applied to `.card-name`, and the
  two v1 font strings above are gone.

### 5.2 Hierarchy (B35) — both halves are hard machine checks and must hold SIMULTANEOUSLY

At **375×667** on a rendered framework card (`#/f/<id>` for a diagram-bearing framework):

- **H1 — essence above the fold.** `.card-essence-text`'s `getBoundingClientRect().top < 600` (comfortably
  above the 667 fold). Machine-checkable.
- **H2 — diagram larger than v1.** `.card-visual` CSS `max-width` is raised from the v1 `320px` to
  **≥ 380px**, and its rendered `clientWidth` at 375px is **strictly greater** than the v1 rendered width
  (Evaluator can compare against the pinned v1 baseline; the machine proxy is the `max-width ≥ 380px`
  computed value + the visual filling the figure). If enlarging the figure pushes essence past the H1
  fold, grow the diagram by **width / reduced figure padding**, NOT by height (advisor note: the two
  constraints fight; resolve by width, not height).
- **H3 — pitfalls visually distinct from the example block.** The pitfalls section and the example section
  are visually differentiated (distinct container treatment: e.g. different background/border/marker). This
  is Evaluator-observed; the machine anchor is that `.card-pitfalls-list` and `.card-example` carry
  different container styling (not identical rules).
- **H4 — card ends on the prompt (B5, preserved).** `article.card`'s `lastElementChild` is still
  `.card-part.card-prompt`. Machine-checkable (already asserted by accept/content suites).

### 5.3 Order (unchanged from Sprint 002)

`header → trigger → figure → essence → [steps?] → EXAMPLE → pitfalls → prompt`. This sprint does not
reorder card parts; it restyles them.

### 5.4 Preserved renderer structure (BLOCKER-class — do NOT break; this is a CSS sprint)

A hierarchy re-style is exactly where DOM hooks quietly break. These Sprint-002 invariants MUST survive
byte-for-byte in behavior (the unmodified `accept`/`visuals`/`daily`/`nav`/`content` suites depend on
them):

- `.card-example` section with a `.card-example-text` element holding the featured scenario by default.
- Exactly ONE inline `<svg>` descendant of `.card-figure` (persona glyphs stay in the tab widget, never in
  `.card-figure`).
- `.card-name` is the `h2` (id = `options.headingId`); `.card-trigger-text`, `.card-essence-text`,
  `.card-pitfalls-list li`, `.card-figcaption-name`, the fav toggle button — all preserved.
- Persona tab widget: `role="tablist"`/`tab`/`tabpanel`, one `aria-selected="true"` (featured) on load,
  roving `tabindex`, ArrowLeft/ArrowRight automatic activation, per-instance-scoped ids (framework vs
  today card ids never collide), `hidden` on inactive panels, visible `:focus-visible` outline **≥3px**
  (accept.spec §5.1). **None of this behavior may change** — restyle only.
- The defensive degrade (missing/invalid `examples` → sane message, no crash/`undefined`) stays.
- `js/card.js` may be edited ONLY for a purely-presentational class/wrapper hook if a §5.2 style needs one;
  no change to DOM order, ARIA, ids, keyboard handling, or the featured/tradeoff logic.

## 6. AA re-verification on the new palette (B36 / R5)

A new palette can break contrast. Both themes MUST be re-verified AA (≥4.5:1 body text) on the new values:

- **A1.** `content.spec.mjs` step 10 (axe `color-contrast` in dark + light on rendered cards, after the
  `expectBg` wait) passes with the new palette — **0 violations** in both themes. Update its `expectBg` to
  the new `--bg` values (§7).
- **A2.** `nav.spec.mjs` step 9 (axe both themes across situations/browse/category/search/favorites)
  passes on the new palette — **0 violations**. Update its `expectBg` to the new `--bg` values (§7).
- **A3.** `--fg` and `--muted` (both are body/secondary text) meet AA on `--bg`/`--surface`/`--surface-2`
  in both themes; persona accents meet AA on the same in both themes (§4.3). Verified by A1/A2 axe.
- **A4.** Focus outline stays visible (≥3px, accept.spec §5.1) with `--focus` retuned.
- Note (honest boundary): SVG diagram inverse-text (`v-text-inv`, `fill:var(--bg)` on `v-accent-fill`) is
  NOT reliably scanned by axe (v1's gold-on-paper pair measured ~3.55:1 and passed axe historically). It is
  therefore NOT a gate this sprint; do not claim it as verified. No `js/visuals.js` change is required.

## 7. Test + asset migration (every hardcoded old-palette value must move)

The old palette is hardcoded in a few places that WILL hang/fail once `--bg` changes. Migrate ALL of them:

- **`tests/content.spec.mjs:391`** — `expectBg = { dark: "rgb(18, 20, 28)", light: "rgb(244, 241, 233)" }`
  → `{ dark: "rgb(32, 24, 17)", light: "rgb(233, 223, 202)" }`.
- **`tests/nav.spec.mjs:310`** — same `expectBg` migration to the new values.
- **`index.html`** — `<meta name="theme-color" content="#12141c" />` → `#201811` (the new dark `--bg`; the
  default `data-theme` is dark). Grep `index.html` for any other `12141c`/`f4f1e9` and migrate.
- **`manifest.json`** — migrate any `theme_color`/`background_color` that holds a v1 palette hex
  (`#12141c`/`#f4f1e9` or similar) to the new dark `--bg` `#201811` (and light bg where a bg color is used).
  `manifest.json` is a precached SHELL asset (B38) so a change here is covered by the SW bump.
- **Grep gate:** after migration, `grep -rn "12141c\|f4f1e9\|f0b429\|a9741a\|1b1e2b\|232739\|1b1d26\|eceef5\|Iowan Old Style" styles/ index.html manifest.json tests/`
  returns only INTENTIONAL hits — specifically the §4 "v1 baseline (before)" comment table in `app.css`
  documenting the change is allowed, but no LIVE token value, meta, manifest field, or test `expectBg` may
  still carry a v1 value. (Practically: the only permitted survivors are comment/documentation lines.)
- **No other test hardcodes a palette rgb** (confirmed: only the two `expectBg` lines pin `--bg`;
  accept.spec Story8 reads `--bg` dynamically and needs no edit). Grep `rgb(18,\|rgb(244,` across `tests/`
  before declaring done — 0 live hits remain.

## 8. Service worker (B38)

- **S1.** `styles/app.css` (and `index.html` + `manifest.json`) are precached SHELL assets and all change
  this sprint. Bump the SW cache `pdb-shell-v9` → `pdb-shell-v10` in `sw.js`, with a dated (2026-07-07)
  comment-trail entry naming the Sprint 003 change (Field Manual palette + type system + hierarchy; assets
  restyled). If a self-hosted font file is added (§5.1b), add its path to the `SHELL` precache array;
  otherwise the SHELL list is unchanged.
- **S2.** The four version pins must all read `v10`:
  - `sw.js` `var CACHE = "pdb-shell-v10"`
  - `tests/content.spec.mjs:416`
  - `tests/visuals.spec.mjs:251`
  - `tests/daily.spec.mjs:369`
  - `tests/nav.spec.mjs:397`
  Grep `pdb-shell-v` across `tests/` + `sw.js` before declaring done; every live pin reads `v10`.
  `accept.spec.mjs`/`shell.spec.mjs` hold no SW pin (confirm by grep) — do not edit them.

## 9. Commands the Evaluator runs

```bash
cd /Users/prithviputta/Downloads/pocket-decision-book
node scripts/build-data.mjs                 # data unchanged — must be a no-op vs committed js/data.js
grep -rn universalExample js/ tests/        # still 0 hits (schema unchanged since Sprint 002)
grep -rn "Iowan Old Style" styles/          # 0 live hits (v1 display font gone; comment table OK)
grep -rn "12141c\|f4f1e9\|f0b429\|a9741a" styles/ index.html manifest.json tests/   # only comment/doc lines
grep -rn "pdb-shell-v" sw.js tests/         # every live pin reads v10
python3 -m http.server 4173 &               # serve for the browser suites
node tests/content.spec.mjs                 # E1–E8 + tab widget + axe(new palette both themes) + expectBg(new) + sw v10, 0 failed
node tests/shell.spec.mjs                   # v1 shell, green
node tests/nav.spec.mjs                     # v1 nav + axe(new palette) + expectBg(new) + sw v10, green
node tests/daily.spec.mjs                   # v1 daily + sw v10, green
node tests/visuals.spec.mjs                 # v1 visuals + sw v10, green (single .card-figure svg preserved)
node tests/accept.spec.mjs                  # v1 acceptance click-through; Story8 flips --bg (new values), focus ≥3px, green
node scripts/check-originality.mjs          # originality guard, green
```

Plus browser spot checks (both themes):
- `getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()` = `#201811` (dark) /
  `#e9dfca` (light); same for `--surface`/`--accent` vs §4.
- `getComputedStyle(document.documentElement).getPropertyValue('--font-display')` is present and its first
  family renders distinct from `--font-serif` on macOS (eyeball `.card-name`).
- On a diagram-bearing card at 375×667: `.card-essence-text` rect `.top < 600`; `.card-visual` rendered
  wider than v1; pitfalls visually distinct from the example block; card ends on `.card-prompt`.
- Persona tabs still keyboard-operable with a visible focus ring on the new `--focus`.

## 10. Non-Goals (guarding the sprint boundary — do NOT build these here)

- **No example authoring / re-authoring.** Scenarios/tradeoffs/`featured`/prompts are frozen (Sprint
  001/002). `scripts/build-data.mjs` and `js/data.js` are NOT edited; `node scripts/build-data.mjs` stays a
  no-op vs committed. **B28's draft→counter→final trace is N/A** — there is no
  `generator_trace_sprint_003.md` and the Evaluator must not require one.
- **No renderer behavior change.** No change to `js/card.js` DOM order, tab-widget ARIA/keyboard/ids, the
  featured/paired-tradeoff logic, or `renderNotFound`. Restyle only (§5.4).
- **No `js/visuals.js` geometry change**, no second SVG in `.card-figure`, no new frameworks, no backend,
  no library/framework adoption, no raster imagery for content (inline SVG only; manifest icons remain the
  only rasters; a self-hosted font `woff2` is the sole permitted new binary and only under §5.1b).
- **No change to `trigger`/`essence` text** (B2 byte-stable), no data-shape change.
- **No cosmetic 1-hex-digit "change"** — the pinned §4 values are the gate; ship them exactly.

## 11. States that must exist (spec §6)

- **New dark "Deep Ink" theme:** warm ink background, vermilion accent (indicators only), slab framework
  names, AA-compliant, `--bg` = `rgb(32,24,17)`.
- **New light "Paper" theme:** warm kraft-paper background, rust accent, slab framework names, AA-compliant,
  `--bg` = `rgb(233,223,202)`; toggle persists across reload and flips `--bg` (accept.spec Story8).
- **Example card (restyled, behavior frozen):** featured example + paired "cost" tradeoff always
  co-visible; five persona tabs, featured marked; persona accents AA on the new palette.
- **Hierarchy state:** essence above the 375px fold; enlarged diagram; pitfalls visually distinct from the
  example block; card ends on the prompt.
- **All v1 + v2 states preserved:** not-found, empty favorites, first-use daily card, no-match search,
  offline-after-first-load, install fallback, persona keyboard nav — unchanged, only re-skinned.

## 12. Definition of done

- `styles/app.css` ships the pinned §4 "Field Manual" palette (named in a CSS comment) — both themes'
  `--bg`/`--surface`/`--accent` equal the v2 values and differ from the v1 baseline.
- Type system: `--font-display` (distinct slab face applied to `.card-name`) present; v1 `"Iowan Old Style"`
  and the v1 `--font-sans` value gone; display renders distinct from body on macOS; offline-safe (no
  external font fetch).
- Hierarchy: `.card-essence-text` rect `.top < 600` at 375×667 AND `.card-visual` `max-width ≥ 380px`
  rendered wider than v1, holding simultaneously; pitfalls visually distinct from the example block; card
  ends on `.card-prompt`.
- AA re-verified: content.spec + nav.spec axe (both themes, new palette) — 0 violations; focus ≥3px.
- All old-palette hardcodes migrated: content.spec:391 + nav.spec:310 `expectBg` → new `--bg`; index.html
  theme-color + manifest colors → new dark `--bg`; grep gate (§7) clean of live v1 values.
- SW bumped to `pdb-shell-v10` with dated comment; all four version pins read `v10`; (font file added to
  SHELL only if self-hosting).
- `node scripts/build-data.mjs` is a no-op; `grep -rn universalExample js/ tests/` still 0.
- All suites (`content`/`shell`/`nav`/`daily`/`visuals`/`accept`) + originality guard: **0 failed**; zero
  console errors/warnings.
- Preserved §5.4 renderer structure intact (exactly one `.card-figure svg`, tab widget behavior, terminal
  prompt).
- Committed and pushed to BOTH `origin` and `decision-book` (B39) after the gate passes.
- `generator_trace.log` records files changed, commands, and evidence.

## 13. Explicitly NOT machine-verified this sprint (honest proxy boundary — R3/R5)

- "Reads as a genuinely different, considered product" (the qualitative core of B34) — Evaluator judgment;
  the machine anchors are the pinned palette (§4), the distinct display face (§5.1), and the persona
  system + restructured card carried from Sprint 002.
- "Display face renders distinct from body" is machine-anchored (token present, applied, v1 values gone)
  but the visual distinctness is confirmed by the Evaluator's eye on macOS.
- SVG diagram inverse-text contrast (`v-text-inv` on accent) — not reliably axe-scanned; not a gate (§6).
- Full "un-counterable examples" + personal-life prompt certification remain the Sprint 004 acceptance gate.
