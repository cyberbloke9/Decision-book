/* ==========================================================================
   Pocket Decision Book — service worker (Sprint 001)
   Offline-first app shell. Cache-first for same-origin assets; navigation
   requests fall back to the cached shell document so any hash route resolves
   offline. Versioned cache name; old caches purged on activate.
   ========================================================================== */
"use strict";

var CACHE = "pdb-shell-v16";

// Precache the full shell. Includes BOTH the bare root "./" and "index.html"
// so start_url ("." ) and a direct /index.html both resolve offline.
// v2 added the Sprint 002 content module + card renderer so #/f/:id works offline.
// v3 adds js/visuals.js so offline cards render their inline SVG diagrams (B20).
// v4 adds the Sprint 004 navigation modules (nav-data, favorites, lists) so the
// situation picker, browse index, detail screens, search and favorites all work
// offline; the version bump forces the activate handler to purge the stale v3
// cache that lacks these files (contract §8.2, protects B20).
// v5 adds js/daily.js (Sprint 005) so the Today daily card + habit loop work
// offline; the bump purges the stale v4 cache that lacks daily.js (protects B20).
// v6 (Sprint 006) ships two edits to already-listed shell assets: the F-001
// streak-grammar edit to js/daily.js and the §5.1 search-input :focus-visible
// outline fix to styles/app.css. No new precache entry (both files are already
// listed), but the version bump forces the activate handler to purge the stale
// v5 cache so the offline app serves the updated daily.js + app.css (protects
// B20). Test/script files are NOT precached (they never ship).
// v7 (post-acceptance review swarm) ships edits to two already-listed shell
// assets: index.html (iOS standalone meta tags) and js/favorites.js (fresh
// storage re-read per call so a second tab never clobbers favorites). No new
// precache entry; the bump purges the stale v6 cache (protects B20).
// v12 (post-v2 review swarm) ships js/card.js a11y fixes (tabpanel tabindex,
// click focus) + comment-only app.css edit; both precached, purge stale v11.
// v8 (2026-07-07, Sprint 001 — v2 examples engine) regenerates the precached
// js/data.js: the 52 core frameworks gain examples[] (5 persona scenarios +
// tradeoffs) + featured, and their universalExample is now examples[featured].
// scenario. No new precache entry (data.js is already listed); the bump purges
// the stale v7 cache so the offline app serves the new data.js (protects B20).
// v9 (2026-07-07, Sprint 002 — v2 examples engine finished + card UI) ships edits
// to two already-listed shell assets: js/data.js is regenerated so the 22
// extension frameworks gain examples[] + featured (all 74 now complete) and
// universalExample is removed app-wide; js/card.js gains the featured-first +
// persona-tab example renderer (B30/B31). No new precache entry (both files are
// already listed); the bump purges the stale v8 cache so the offline app serves
// the new data.js + card.js (protects B20).
// v10 (2026-07-07, Sprint 003 — "Field Manual" UI transformation, Phase 9) ships
// edits to three already-listed shell assets: styles/app.css (new named palette +
// slab display type system + hierarchy pass), index.html (theme-color meta →
// #201811), and manifest.json (theme_color/background_color → #201811). No new
// precache entry (all three are already listed; no self-hosted font was added —
// the display face is the macOS-guaranteed slab stack, so the SHELL list is
// unchanged); the bump purges the stale v9 cache so the offline app serves the
// re-skinned shell (protects B20). js/data.js is byte-unchanged this sprint.
// v11 (2026-07-08, Sprint 004 — Polish & Acceptance, Phase 10) ships one edit to a
// single already-listed shell asset: styles/app.css gains the F-001 fix —
// .card-essence-text now sets font-family: var(--font-serif) so "THE IDEA" reads in
// the editorial Charter serif like its sibling parts, instead of inheriting the UI
// sans. The R2/R4 examples/prompt acceptance audit found NO fixable defect, so
// js/data.js is byte-unchanged this sprint (regenerate is a no-op) and is NOT in
// this bump's changed-asset list. No new precache entry (app.css is already listed);
// the bump purges the stale v10 cache so the offline app serves the corrected
// app.css (protects B20). Changed precached asset this sprint: styles/app.css only.
// v13 (2026-07-10, v3.0 Sprint 001 — Storage & widget infrastructure, Phase 11)
// adds TWO new precached modules: js/store.js (the window.PDB_STORE versioned
// localStorage gateway, B41) and js/persona-tabs.js (the window.PDB_PERSONA_TABS
// ARIA tab widget extracted from card.js, B45). Both are also added to the
// index.html <script> tags (store.js first, persona-tabs.js before card.js).
// js/favorites.js, js/daily.js, js/app.js, js/card.js are edited to route
// persistence through PDB_STORE / consume PDB_PERSONA_TABS (already precached —
// no new entry for them). The version bump purges the stale v12 cache so the
// offline app serves the two new modules + the four edited ones (protects B20,
// soul-constraint offline B73/B75). Changed/new precached assets this sprint:
// js/store.js (new), js/persona-tabs.js (new), js/favorites.js, js/daily.js,
// js/app.js, js/card.js, index.html.
// v14 (2026-07-10, v3.0 Sprint 002 — Decision journal, Phase 12) adds ONE new
// precached module: js/journal.js (window.PDB_JOURNAL — the pdb.journal data
// layer + list/new/detail/edit render functions + pure export builder, B47–B55).
// It is also added to the index.html <script> tags (after card.js, before app.js).
// js/app.js (journal route parse + dispatch), js/card.js (the B52 "Journal this
// decision" affordance on #/f/:id), index.html (the #screen-journal section) are
// edited (already precached — no new entry for them). The version bump purges the
// stale v13 cache so the offline app serves the new module + the three edited
// ones (protects B20, soul-constraint offline B73/B75). Changed/new precached
// assets this sprint: js/journal.js (new), js/app.js, js/card.js, index.html.
// v15 (2026-07-10, v3.0 Sprint 003 — SRS mastery engine, Phase 13) adds ONE new
// precached module: js/srs.js (window.PDB_SRS — the pdb.srs Leitner ladder data
// layer + the Today-screen daily-card grade control and 0–3 due-for-review shelf,
// B56–B60). It is also added to the index.html <script> tags (after journal.js,
// before app.js). js/app.js (one additive PDB_SRS.renderToday call in the today
// route) and index.html (the new #srs-mount sibling) are edited (already
// precached — no new entry for them); styles/app.css gains SRS styling (already
// precached). js/daily.js is NOT touched (SRS is a strictly-additive sibling).
// The version bump purges the stale v14 cache so the offline app serves the new
// module + the edited ones (protects B20, soul-constraint offline B73/B75).
// Changed/new precached assets this sprint: js/srs.js (new), js/app.js,
// index.html, styles/app.css.
// v16 (2026-07-10, v3.0 Sprint 004 — Reverse quiz, Phase 14) adds ONE new
// precached module: js/quiz.js (window.PDB_QUIZ — the pure seeded question
// builder + display-only stem redaction + the pdb.quiz local stats layer + the
// #/quiz screen and the additive Today "Test your recall" entry card, B61–B65).
// It is also added to the index.html <script> tags (after srs.js, before app.js).
// js/app.js (the quiz route arm + the one additive renderEntry line in the today
// case) and index.html (the new #screen-quiz section + the #quiz-entry-mount
// sibling) are edited (already precached — no new entry for them); styles/app.css
// gains quiz styling (already precached). js/daily.js and js/srs.js are NOT
// touched (the quiz is a strictly-additive sibling reusing PDB_SRS.grade). The
// version bump purges the stale v15 cache so the offline app serves the new
// module + the edited ones (protects B20, soul-constraint offline B73/B75).
// Changed/new precached assets this sprint: js/quiz.js (new), js/app.js,
// index.html, styles/app.css.
var SHELL = [
  "./",
  "index.html",
  "styles/app.css",
  "js/store.js",
  "js/data.js",
  "js/nav-data.js",
  "js/favorites.js",
  "js/daily.js",
  "js/visuals.js",
  "js/lists.js",
  "js/persona-tabs.js",
  "js/card.js",
  "js/journal.js",
  "js/srs.js",
  "js/quiz.js",
  "js/app.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin

  // Navigation requests: serve cached shell (offline-safe for any hash route).
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(req).then(function (hit) {
        return hit ||
          caches.match("index.html") ||
          caches.match("./");
      }).then(function (res) {
        return res || fetch(req);
      }).catch(function () {
        return caches.match("index.html");
      })
    );
    return;
  }

  // Static assets: cache-first, fall back to network, then cache the result.
  event.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      });
    })
  );
});
