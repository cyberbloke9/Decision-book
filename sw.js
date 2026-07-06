/* ==========================================================================
   Pocket Decision Book — service worker (Sprint 001)
   Offline-first app shell. Cache-first for same-origin assets; navigation
   requests fall back to the cached shell document so any hash route resolves
   offline. Versioned cache name; old caches purged on activate.
   ========================================================================== */
"use strict";

var CACHE = "pdb-shell-v2";

// Precache the full shell. Includes BOTH the bare root "./" and "index.html"
// so start_url ("." ) and a direct /index.html both resolve offline.
// v2 adds the Sprint 002 content module + card renderer so #/f/:id works offline.
var SHELL = [
  "./",
  "index.html",
  "styles/app.css",
  "js/data.js",
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
