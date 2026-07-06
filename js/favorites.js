/* ==========================================================================
   Pocket Decision Book — favorites store (Sprint 004)
   The single localStorage-backed favorites store (B13, B15).

   Persists a JSON array of framework ids under localStorage['pdb.favorites'].
   Robust to missing / corrupt / blocked storage: every read and write is
   wrapped in try/catch and degrades to an in-memory empty set — it NEVER
   throws, so a private-mode or storage-disabled browser still runs the app.

   No backend, no network. Plain script; attaches PDB_FAV to window.
   Exposes: isFavorite(id), toggle(id) -> new boolean, all() -> ids (stable order).
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "pdb.favorites";
  // In-memory mirror. Order = insertion order (most-recently-added last);
  // all() returns most-recently-favorited FIRST for the favorites list.
  var ids = read();

  function read() {
    try {
      var raw = root.localStorage ? root.localStorage.getItem(KEY) : null;
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Keep only well-formed unique string ids (defensive against corruption).
      var seen = {};
      var out = [];
      for (var i = 0; i < parsed.length; i++) {
        var v = parsed[i];
        if (typeof v === "string" && v && !seen[v]) { seen[v] = true; out.push(v); }
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  function write() {
    try {
      if (root.localStorage) root.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) {
      /* storage blocked/full — keep the in-memory mirror; never throw */
    }
  }

  function isFavorite(id) {
    return ids.indexOf(id) !== -1;
  }

  function toggle(id) {
    if (typeof id !== "string" || !id) return false;
    var i = ids.indexOf(id);
    if (i === -1) {
      ids.push(id);
      write();
      return true;
    }
    ids.splice(i, 1);
    write();
    return false;
  }

  // Most-recently-favorited first (stable, deterministic given the stored order).
  function all() {
    return ids.slice().reverse();
  }

  root.PDB_FAV = {
    isFavorite: isFavorite,
    toggle: toggle,
    all: all
  };
})(typeof window !== "undefined" ? window : this);
