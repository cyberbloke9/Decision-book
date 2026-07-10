/* ==========================================================================
   Pocket Decision Book — versioned localStorage gateway (v3.0 Sprint 001)
   window.PDB_STORE: the single, hardened gateway over ALL pdb.* keys (B41).

   Design (contract §2, B41–B43):
   - get(key)  -> the raw stored STRING for `key`, or null. Reads FRESH from
                  localStorage on EVERY call (read-through; never a stale
                  module-load cache) so a value changed in another tab is
                  observed on the next get. Only when localStorage itself is
                  blocked/absent does it fall back to the in-memory mirror.
   - set(key, value) -> stores String(value). Writes the mirror AND (when
                  available) localStorage, so a blocked-storage get still
                  returns the last set value.
   - migrate(fromVersion) -> the additive, idempotent v3 upgrade hook. It may
                  READ the legacy keys and WRITE new keys + pdb.schemaVersion;
                  it MUST NOT delete or rewrite pdb.favorites / pdb.applied /
                  pdb.theme / pdb.testDate (B43).

   It is a gateway OVER the existing keys, NOT a rename (B42): the four legacy
   keys keep their exact names and exact string shapes; get/set pass strings
   through untouched so existing JSON parse/stringify call-sites are unchanged.

   NEVER throws: every localStorage touch is try/catch-wrapped and degrades to
   the in-memory mirror (same discipline as favorites.js). No network calls, no
   randomness (fully deterministic). Plain script; attaches PDB_STORE to window
   and runs migrate ONCE at load.
   ========================================================================== */
(function (root) {
  "use strict";

  var SCHEMA_KEY = "pdb.schemaVersion";
  var SCHEMA_VERSION = 3;

  // In-memory mirror: key -> last string value passed to set(). Used ONLY when
  // localStorage is unavailable/blocked so the app still runs in private mode.
  var mirror = Object.create(null);

  function hasLS() {
    try {
      return !!root.localStorage;
    } catch (e) {
      return false; // accessing window.localStorage can itself throw
    }
  }

  /* Read-through: prefer FRESH localStorage every call; fall back to the mirror
     only when storage is blocked/absent. Returns a string or null. */
  function get(key) {
    try {
      if (hasLS()) return root.localStorage.getItem(key);
    } catch (e) { /* storage blocked — fall through to mirror */ }
    return Object.prototype.hasOwnProperty.call(mirror, key) ? mirror[key] : null;
  }

  /* Store a string. Keep the mirror in sync (so a blocked-storage get works)
     and persist to localStorage when available. Never throws. */
  function set(key, value) {
    var str = String(value);
    mirror[key] = str;
    try {
      if (hasLS()) root.localStorage.setItem(key, str);
    } catch (e) { /* blocked/full — mirror holds it; never throw */ }
    return str;
  }

  /* Current stored schema version as an integer; absent/garbage ⇒ 0. */
  function currentVersion() {
    var raw = get(SCHEMA_KEY);
    if (raw == null) return 0;
    var n;
    try { n = JSON.parse(raw); } catch (e) { return 0; }
    return typeof n === "number" && isFinite(n) ? n : 0;
  }

  /* The additive, rollback-safe, idempotent v3 migration (B43). Runs once at
     load. It reads nothing destructive and writes ONLY pdb.schemaVersion; the
     four legacy keys are never deleted or rewritten. Loading twice leaves
     storage byte-identical after the first run (fromVersion becomes 3 ⇒ no-op). */
  function migrate(fromVersion) {
    var from = typeof fromVersion === "number" && isFinite(fromVersion) ? fromVersion : 0;
    if (from >= SCHEMA_VERSION) return; // already current — no-op (idempotent)
    // Additive only: stamp the schema version. New v3 keys (pdb.journal,
    // pdb.srs, pdb.quiz, pdb.stats) are created lazily by their own features,
    // so nothing legacy is touched here — byte-for-byte survival (B42/B43).
    set(SCHEMA_KEY, JSON.stringify(SCHEMA_VERSION));
  }

  root.PDB_STORE = {
    get: get,
    set: set,
    migrate: migrate,
    SCHEMA_VERSION: SCHEMA_VERSION
  };

  // Run the migration ONCE at load, from whatever version is currently stored.
  migrate(currentVersion());
})(typeof window !== "undefined" ? window : this);
