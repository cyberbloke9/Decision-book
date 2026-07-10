/* ==========================================================================
   Pocket Decision Book — SRS mastery engine (v3.0 Sprint 003, Phase 13)
   window.PDB_SRS: the spaced-repetition data layer over localStorage['pdb.srs']
   (via PDB_STORE, B56) — a fixed Leitner ladder — PLUS the two Today-screen
   render functions (the daily-card grade control + the 0–3 due-shelf), driven
   by the single injectable clock PDB_DAILY.today() (contract §2).

   Discipline (contract §13):
   - persistence routes THROUGH PDB_STORE (a JSON OBJECT/map keyed by framework
     id; the module JSON.parse/JSON.stringify's, exactly like favorites.js /
     journal.js); reads are read-through per call + corrupt-safe (bad JSON /
     non-object / malformed value → treated as unscheduled/empty, never throws,
     never a console error).
   - NO randomness (no Math dot random); NO second date clock — the ONLY current-date source is
     PDB_DAILY.today() (honors __PDB_NOW__ / pdb.testDate). Component-based UTC
     date math (no new Date(str)); ymdFromDayNumber uses new Date(<NUMBER>) for
     epoch-day arithmetic (a number, not a string parse) — same discipline as
     journal.js.
   - NO network (no fetch / XHR / remote URL); NO SVG (text-only controls).
   - The Leitner ladder is FIXED (no SM-2, no ease floats): INTERVALS
     [1,4,12,30,90]; "got it" advances one rung (cap 90), "again" resets to 1.
   - SRS UI lives ONLY in #srs-mount, namespaced .srs-* — it never reuses or
     mutates any daily-card class (habit-bar, streak-chip, applied-toggle,
     habit-status-nudge, today-card), so daily.spec/accept.spec stay green
     (B58i/B59/R2). daily.js is not edited.
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "pdb.srs";
  var DAY_MS = 86400000;
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var INTERVALS = [1, 4, 12, 30, 90]; // the fixed Leitner ladder (B56)
  var MAX_STEP = INTERVALS.length - 1; // 4
  if (Object.freeze) Object.freeze(INTERVALS);

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /* ---- Component-based UTC date math (no new Date(str) — no tz drift) ---- */
  function daysInMonth(y, m) { // m is 1-12
    if (m === 2 && ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) return 29;
    return MONTH_DAYS[m - 1];
  }
  function parseYMD(str) {
    if (typeof str !== "string" || !DATE_RE.test(str)) return null;
    var y = +str.slice(0, 4), m = +str.slice(5, 7), d = +str.slice(8, 10);
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > daysInMonth(y, m)) return null;
    return { y: y, m: m, d: d };
  }
  function isValidDateStr(str) { return parseYMD(str) !== null; }
  function dayNumber(str) {
    var p = parseYMD(str);
    if (!p) return null;
    return Math.floor(Date.UTC(p.y, p.m - 1, p.d) / DAY_MS);
  }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  /* Inverse: epoch day-number → YYYY-MM-DD via getUTC* (numeric ms ctor is
     tz-safe; the "no new Date(str)" rule targets STRING parsing). */
  function ymdFromDayNumber(dn) {
    if (typeof dn !== "number" || !isFinite(dn)) return null;
    var d = new Date(dn * DAY_MS);
    return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
  }
  function dateLabel(str) {
    var p = parseYMD(str);
    if (!p) return str || "";
    return p.d + " " + MONTHS[p.m - 1] + " " + p.y;
  }
  /* The ONLY current-date source (honors __PDB_NOW__ / pdb.testDate via daily). */
  function today() {
    var daily = root.PDB_DAILY;
    if (daily && typeof daily.today === "function") return daily.today();
    var now = new Date();
    return now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());
  }

  function frameworkById(id) {
    var data = root.PDB_DATA;
    return data && typeof data.byId === "function" ? data.byId(id) : null;
  }
  function frameworkName(id) {
    var fw = frameworkById(id);
    return fw ? fw.name : id;
  }
  function frameworkIndex(id) {
    var data = root.PDB_DATA;
    if (!data || !Array.isArray(data.frameworks)) return Infinity;
    for (var i = 0; i < data.frameworks.length; i++) {
      if (data.frameworks[i] && data.frameworks[i].id === id) return i;
    }
    return Infinity;
  }

  /* ---- Store I/O: read-through + corrupt-safe (never throws / logs) ---- */
  function readRaw() {
    var store = root.PDB_STORE;
    if (store && typeof store.get === "function") return store.get(KEY);
    try { return root.localStorage ? root.localStorage.getItem(KEY) : null; }
    catch (e) { return null; }
  }
  /* Normalize a single stored schedule value into a ladder-consistent object,
     or null if it is not a schedule at all. A schedule MUST be a plain object
     with a valid `due` date — that is the only field the due/shelf/isDue paths
     functionally need, and it is also what the Evaluator's §12.3 seed path may
     provide minimally (fail-open on a valid due). Secondary fields are SANITIZED
     to keep the module invariant `intervalDays === INTERVALS[easeStep]` true for
     everything readMap returns, so grade() advancement from `cur.easeStep` is
     always valid: easeStep clamps to a real rung (default 0), intervalDays is
     ALWAYS derived from easeStep (a mismatched stored value is ignored, never
     trusted), lastReviewedAt defaults to (due - intervalDays) when absent. An
     entry with NO valid `due`, a non-object, an array, bad JSON, or a non-object
     top level → unscheduled (the §2.1/§6 "malformed value → unscheduled" rule).
     App-created data is already ladder-consistent, so this is a no-op for it
     (idempotent). */
  function normalizeSchedule(v) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return null;
    if (!isValidDateStr(v.due)) return null; // no valid due → not a schedule
    var step = v.easeStep;
    if (typeof step !== "number" || (step | 0) !== step || step < 0 || step > MAX_STEP) step = 0;
    var interval = INTERVALS[step]; // always derived → invariant holds
    var last = isValidDateStr(v.lastReviewedAt) ? v.lastReviewedAt : null;
    if (last === null) {
      var dueNum = dayNumber(v.due);
      last = dueNum === null ? v.due : ymdFromDayNumber(dueNum - interval);
    }
    return { lastReviewedAt: last, intervalDays: interval, due: v.due, easeStep: step };
  }
  function readMap() {
    try {
      var raw = readRaw();
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
      var out = {};
      for (var id in parsed) {
        if (!Object.prototype.hasOwnProperty.call(parsed, id)) continue;
        var v = normalizeSchedule(parsed[id]);
        if (v) out[id] = v;
      }
      return out;
    } catch (e) { return {}; }
  }
  function writeMap(map) {
    var store = root.PDB_STORE;
    var str = JSON.stringify(map);
    if (store && typeof store.set === "function") { store.set(KEY, str); return; }
    try { if (root.localStorage) root.localStorage.setItem(KEY, str); }
    catch (e) { /* blocked/full — never throw */ }
  }

  /* ---- Public data API ---- */
  function all() { return readMap(); }

  function get(id) {
    if (typeof id !== "string" || !id) return null;
    var map = readMap();
    return Object.prototype.hasOwnProperty.call(map, id) ? map[id] : null;
  }

  function isDue(id, dateStr) {
    var sched = get(id);
    if (!sched) return false; // unscheduled → never due
    var ref = isValidDateStr(dateStr) ? dateStr : today();
    var dueNum = dayNumber(sched.due), refNum = dayNumber(ref);
    if (dueNum === null || refNum === null) return false;
    return dueNum <= refNum;
  }

  /* All due framework ids, oldest-due first (ascending dayNumber(due)),
     tie-break by ascending PDB_DATA.frameworks index — fully deterministic.
     The render applies the 0–3 cap (§2.5), not this function. */
  function due(dateStr) {
    var ref = isValidDateStr(dateStr) ? dateStr : today();
    var refNum = dayNumber(ref);
    if (refNum === null) return [];
    var map = readMap();
    var out = [];
    for (var id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      var dn = dayNumber(map[id].due);
      if (dn !== null && dn <= refNum) out.push({ id: id, due: dn, idx: frameworkIndex(id) });
    }
    out.sort(function (a, b) {
      if (a.due !== b.due) return a.due - b.due;
      return a.idx - b.idx;
    });
    return out.map(function (r) { return r.id; });
  }

  /* The single write path (B58/B63). Unknown/absent framework id → safe no-op
     returning null. "got it" advances a rung (or enters at 0); "again" resets
     to rung 0. lastReviewedAt = today(); due = today() + intervalDays. */
  function grade(id, correct) {
    if (!frameworkById(id)) return null; // unknown id → no-op
    var map = readMap();
    var cur = Object.prototype.hasOwnProperty.call(map, id) ? map[id] : null;
    var step;
    if (correct === true) {
      step = cur ? Math.min(cur.easeStep + 1, MAX_STEP) : 0;
    } else {
      step = 0; // "again" (or unscheduled "again") → rung 0
    }
    var t = today();
    var base = dayNumber(t);
    var interval = INTERVALS[step];
    var sched = {
      lastReviewedAt: t,
      intervalDays: interval,
      due: base === null ? t : ymdFromDayNumber(base + interval),
      easeStep: step
    };
    map[id] = sched;
    writeMap(map);
    return sched;
  }

  /* ---- DOM helpers (no SVG — text-only controls) ---- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function clear(mount) { if (mount) mount.textContent = ""; }
  function daysWord(n) { return n === 1 ? "1 day" : n + " days"; }

  /* Grade a framework, then re-render the whole Today SRS deck so BOTH the
     daily control AND the shelf stay consistent (self-healing per §2.5b) and
     no same-day double-grade can inflate a rung. focusSel picks a stable focus
     target inside the freshly-rendered mount (never lost, contract §7). */
  function gradeAndRefresh(mount, dateStr, id, correct, focusSel) {
    grade(id, correct);
    renderToday(mount, dateStr);
    if (focusSel) {
      var target = mount.querySelector(focusSel);
      if (target) { try { target.focus(); } catch (e) { /* best-effort */ } }
    }
  }

  /* ---- (a) Daily-card grade control (§2.5a) ---- */
  function renderDailyGrade(mount, fw, dateStr) {
    var wrap = el("div", "srs-daily");
    if (!fw) return wrap; // no framework (empty data) → nothing to grade
    var ref = isValidDateStr(dateStr) ? dateStr : today();

    var sched = get(fw.id);
    var gradedToday = !!(sched && sched.lastReviewedAt === ref);

    var live = el("div", "srs-live");
    live.setAttribute("aria-live", "polite");

    if (gradedToday) {
      // Graded state: calm confirmation, no buttons (same-day re-grade guard).
      var dueNum = dayNumber(sched.due), refNum = dayNumber(ref);
      var inDays = (dueNum !== null && refNum !== null) ? Math.max(dueNum - refNum, 0) : sched.intervalDays;
      var confirm = el("p", "srs-graded");
      confirm.setAttribute("tabindex", "-1");
      confirm.textContent = "Recall check done — next review in " + daysWord(inDays) + ".";
      live.appendChild(confirm);
      wrap.appendChild(live);
      return wrap;
    }

    var prompt = el("p", "srs-daily-prompt", "Did you know this one?");
    wrap.appendChild(prompt);

    var row = el("div", "srs-grade-row");
    var again = el("button", "srs-grade srs-grade-again", "Again");
    again.setAttribute("type", "button");
    again.setAttribute("aria-label", "Again — I didn't recall this one");
    var got = el("button", "srs-grade srs-grade-got", "Got it");
    got.setAttribute("type", "button");
    got.setAttribute("aria-label", "Got it — I recalled this one");
    row.appendChild(again);
    row.appendChild(got);
    wrap.appendChild(row);
    wrap.appendChild(live);

    again.addEventListener("click", function () {
      gradeAndRefresh(mount, dateStr, fw.id, false, ".srs-daily .srs-graded");
    });
    got.addEventListener("click", function () {
      gradeAndRefresh(mount, dateStr, fw.id, true, ".srs-daily .srs-graded");
    });
    return wrap;
  }

  /* ---- (b) Due-for-review shelf (§2.5b), hard cap 3 ---- */
  function renderShelf(mount, dateStr) {
    var ref = isValidDateStr(dateStr) ? dateStr : today();
    var refNum = dayNumber(ref);
    var section = el("section", "srs-shelf");
    section.setAttribute("aria-labelledby", "srs-shelf-heading");
    var heading = el("h3", "srs-shelf-heading", "Due for review");
    heading.id = "srs-shelf-heading";
    heading.setAttribute("tabindex", "-1");
    section.appendChild(heading);

    var ids = due(ref).slice(0, 3); // hard cap 3, oldest-due first

    if (!ids.length) {
      var empty = el("p", "srs-shelf-empty", "Nothing due — come back tomorrow.");
      section.appendChild(empty);
      return section;
    }

    var ul = el("ul", "srs-shelf-list");
    ids.forEach(function (id) {
      var sched = get(id);
      var name = frameworkName(id);
      var li = el("li", "srs-shelf-row");

      var head = el("div", "srs-shelf-row-head");
      var link = el("a", "srs-shelf-name", name);
      link.setAttribute("href", "#/f/" + encodeURIComponent(id));
      head.appendChild(link);

      var reason = "Due for review";
      if (sched && refNum !== null) {
        var dueNum = dayNumber(sched.due);
        if (dueNum !== null && dueNum < refNum) reason = "Overdue since " + dateLabel(sched.due);
      }
      head.appendChild(el("p", "srs-shelf-reason", reason));
      li.appendChild(head);

      var row = el("div", "srs-grade-row");
      var again = el("button", "srs-grade srs-grade-again", "Again");
      again.setAttribute("type", "button");
      again.setAttribute("aria-label", "Again — I didn't recall " + name);
      var got = el("button", "srs-grade srs-grade-got", "Got it");
      got.setAttribute("type", "button");
      got.setAttribute("aria-label", "Got it — I recalled " + name);
      row.appendChild(again);
      row.appendChild(got);
      li.appendChild(row);
      ul.appendChild(li);

      again.addEventListener("click", function () {
        gradeAndRefresh(mount, dateStr, id, false, ".srs-shelf-heading");
      });
      got.addEventListener("click", function () {
        gradeAndRefresh(mount, dateStr, id, true, ".srs-shelf-heading");
      });
    });
    section.appendChild(ul);
    return section;
  }

  /* ---- Today orchestrator (§2.4) — the single entry point app.js calls ---- */
  function renderToday(mount, dateStr) {
    if (!mount) return mount;
    clear(mount);
    var daily = root.PDB_DAILY;
    var ref = isValidDateStr(dateStr) ? dateStr : today();
    var fw = daily && typeof daily.dailyFramework === "function"
      ? daily.dailyFramework(ref)
      : null;
    mount.appendChild(renderDailyGrade(mount, fw, ref));
    mount.appendChild(renderShelf(mount, ref));
    return mount;
  }

  root.PDB_SRS = {
    INTERVALS: INTERVALS,
    get: get,
    all: all,
    isDue: isDue,
    due: due,
    grade: grade,
    renderDailyGrade: renderDailyGrade,
    renderShelf: renderShelf,
    renderToday: renderToday
  };
})(typeof window !== "undefined" ? window : this);
