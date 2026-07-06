/* ==========================================================================
   Pocket Decision Book — service worker (Sprint 001)
   Offline-first app shell. Cache-first for same-origin assets; navigation
   requests fall back to the cached shell document so any hash route resolves
   offline. Versioned cache name; old caches purged on activate.
   ========================================================================== */
"use strict";

var CACHE = "pdb-shell-v7";

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
var SHELL = [
  "./",
  "index.html",
  "styles/app.css",
  "js/data.js",
  "js/nav-data.js",
  "js/favorites.js",
  "js/daily.js",
  "js/visuals.js",
  "js/lists.js",
  "js/card.js",
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
