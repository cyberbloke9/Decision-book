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
  // sync() re-reads storage before every public call so a change made in
  // another tab is never clobbered by a stale mirror; the mirror survives
  // only when storage itself is blocked/unreadable.
  var ids = read();

  function parse(raw) {
    try {
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

  function read() {
    try {
      return parse(root.localStorage ? root.localStorage.getItem(KEY) : null);
    } catch (e) {
      return [];
    }
  }

  function sync() {
    var raw;
    try {
      if (!root.localStorage) return; // no storage — keep the in-memory mirror
      raw = root.localStorage.getItem(KEY);
    } catch (e) {
      return; // storage blocked — keep the in-memory mirror
    }
    ids = parse(raw);
  }

  function write() {
    try {
      if (root.localStorage) root.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) {
      /* storage blocked/full — keep the in-memory mirror; never throw */
    }
  }

  function isFavorite(id) {
    sync();
    return ids.indexOf(id) !== -1;
  }

  function toggle(id) {
    if (typeof id !== "string" || !id) return false;
    sync();
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
    sync();
    return ids.slice().reverse();
  }

  root.PDB_FAV = {
    isFavorite: isFavorite,
    toggle: toggle,
    all: all
  };
})(typeof window !== "undefined" ? window : this);
