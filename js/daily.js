/* ==========================================================================
   Pocket Decision Book — daily card habit loop (Sprint 005)
   One framework per calendar day by deterministic date-based rotation (B16),
   a one-tap "applied it" log (B17), and a consecutive-day streak with a grace
   rule + sane first-use/missed-day handling (B18).

   All state is localStorage['pdb.applied'] (JSON array of YYYY-MM-DD strings).
   No backend, no network, no Math.random. try/catch-guarded — never throws.

   Single injectable date source: PDB_DAILY.today() is the ONLY current-date
   read used by rotation, applied-today, and streak (spec R5, §1.2). It parses
   by explicit components into Date.UTC(...), never new Date(str), so
   "same date ⇒ same framework" holds across timezones. The only new Date()
   calls live inside today() (the real-local-date path).

   Exposes: window.PDB_DAILY = {
     today, dailyFramework, isApplied, toggle, all, streak, renderToday
   }.
   ========================================================================== */
(function (root) {
  "use strict";

  var APPLIED_KEY = "pdb.applied";
  var TEST_DATE_KEY = "pdb.testDate";
  var DAY_MS = 86400000;
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function daysInMonth(y, m) { // m is 1-12
    if (m === 2 && ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) return 29;
    return MONTH_DAYS[m - 1];
  }

  /* Parse a YYYY-MM-DD string into {y,m,d} ONLY if it is a real calendar date
     (rejects 2026-13-40, 2026-02-30, etc.). Returns null for anything
     malformed. No new Date, no local-tz getters — pure component validation. */
  function parseYMD(str) {
    if (typeof str !== "string" || !DATE_RE.test(str)) return null;
    var y = +str.slice(0, 4);
    var m = +str.slice(5, 7);
    var d = +str.slice(8, 10);
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > daysInMonth(y, m)) return null;
    return { y: y, m: m, d: d };
  }

  function isValidDateStr(str) {
    return parseYMD(str) !== null;
  }

  /* Integer day-number for a valid YYYY-MM-DD (UTC epoch days). */
  function dayNumber(str) {
    var p = parseYMD(str);
    if (!p) return null;
    return Math.floor(Date.UTC(p.y, p.m - 1, p.d) / DAY_MS);
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  /* The single injectable date source. Precedence (spec §1.2):
       1. window.__PDB_NOW__ (valid YYYY-MM-DD)  — test hook, re-runs on reload
       2. localStorage['pdb.testDate'] (valid)   — reload-surviving injection
       3. the device's REAL local civil date, formatted YYYY-MM-DD
     Invalid/garbage injection values are ignored (fall through). Never throws. */
  function today() {
    try {
      var hook = root.__PDB_NOW__;
      if (isValidDateStr(hook)) return hook;
    } catch (e) { /* ignore */ }
    try {
      var stored = root.localStorage ? root.localStorage.getItem(TEST_DATE_KEY) : null;
      if (isValidDateStr(stored)) return stored;
    } catch (e) { /* ignore */ }
    // Real local civil date — the ONLY new Date() reads in this module.
    var now = new Date();
    return now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());
  }

  /* Human-readable date label built from components (no new Date, so no tz
     drift): e.g. "6 July 2026". Falls back to the raw string if unparseable. */
  function dateLabel(str) {
    var p = parseYMD(str);
    if (!p) return str || "";
    return p.d + " " + MONTHS[p.m - 1] + " " + p.y;
  }

  /* Deterministic modulo rotation (§1.1): index = ((dayNumber % N)+N)%N. */
  function dailyFramework(dateStr, data) {
    data = data || root.PDB_DATA;
    if (!data || !Array.isArray(data.frameworks) || !data.frameworks.length) return null;
    var n = data.frameworks.length;
    var dn = dayNumber(dateStr);
    if (dn === null) return null;
    var index = ((dn % n) + n) % n;
    return data.frameworks[index];
  }

  /* ---- Applied log: read FRESH from localStorage on every call ----
     (never cache at module load — a test may seed storage after load and read
     back without a reload). Returns a sanitized array of valid, unique
     YYYY-MM-DD strings. Robust to missing/blocked/corrupt storage. */
  function readApplied() {
    try {
      var raw = root.localStorage ? root.localStorage.getItem(APPLIED_KEY) : null;
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var seen = {};
      var out = [];
      for (var i = 0; i < parsed.length; i++) {
        var v = parsed[i];
        if (typeof v === "string" && isValidDateStr(v) && !seen[v]) {
          seen[v] = true;
          out.push(v);
        }
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  function writeApplied(arr) {
    try {
      if (root.localStorage) root.localStorage.setItem(APPLIED_KEY, JSON.stringify(arr));
    } catch (e) { /* blocked/full — no-op, never throw */ }
  }

  function all() {
    return readApplied();
  }

  function isApplied(dateStr) {
    if (!isValidDateStr(dateStr)) return false;
    return readApplied().indexOf(dateStr) !== -1;
  }

  /* Toggle ONLY the given day. Returns the new boolean state. */
  function toggle(dateStr) {
    if (!isValidDateStr(dateStr)) return false;
    var arr = readApplied();
    var i = arr.indexOf(dateStr);
    if (i === -1) {
      arr.push(dateStr);
      writeApplied(arr);
      return true;
    }
    arr.splice(i, 1);
    writeApplied(arr);
    return false;
  }

  /* Streak = run of consecutive calendar days present in the applied log,
     counting back from the MOST RECENT applied day (on or before today), but
     only if that most-recent day is today or yesterday; otherwise 0.
     Non-negative integer, never NaN/negative/fraction (§1.4 pinned rule). */
  function streak(dateStr) {
    var todayNum = dayNumber(dateStr);
    if (todayNum === null) return 0;

    var applied = readApplied();
    var days = {};        // set of applied day-numbers on or before today
    var mostRecent = null;
    for (var i = 0; i < applied.length; i++) {
      var dn = dayNumber(applied[i]);
      if (dn === null || dn > todayNum) continue; // ignore future junk
      days[dn] = true;
      if (mostRecent === null || dn > mostRecent) mostRecent = dn;
    }
    if (mostRecent === null) return 0;
    // Grace: the run is live only if it reaches today or yesterday.
    if (mostRecent !== todayNum && mostRecent !== todayNum - 1) return 0;

    var count = 0;
    var n = mostRecent;
    while (days[n]) { count++; n--; }
    return count;
  }

  /* ---- DOM helpers ---- */
  var SVG_NS = "http://www.w3.org/2000/svg";
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function svgEl(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  /* Ascending-steps glyph (a rising streak), aria-hidden — never emoji-only. */
  function streakGlyph() {
    var svg = svgEl("svg", { "class": "streak-glyph", viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    svg.appendChild(svgEl("rect", { x: "3", y: "14", width: "4", height: "7", rx: "1" }));
    svg.appendChild(svgEl("rect", { x: "10", y: "9", width: "4", height: "12", rx: "1" }));
    svg.appendChild(svgEl("rect", { x: "17", y: "4", width: "4", height: "17", rx: "1" }));
    return svg;
  }

  function appliedGlyph() {
    var svg = svgEl("svg", { "class": "applied-glyph", viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    svg.appendChild(svgEl("path", { d: "M5 12.5l4.2 4.2L19 7" }));
    return svg;
  }

  function pluralDays(n) { return n === 1 ? "1 day" : n + " days"; }

  /* Render the habit bar + daily card into `mount`. Wires the "applied it"
     toggle to update the streak/copy live, mutating existing nodes in place so
     keyboard focus stays on the button after toggling. */
  function renderToday(mount, data) {
    if (!mount) return mount;
    data = data || root.PDB_DATA;
    mount.textContent = "";

    var dateStr = today();
    var fw = dailyFramework(dateStr, data);

    /* ---- Habit bar ---- */
    var bar = el("div", "habit-bar");

    var topRow = el("div", "habit-top");
    topRow.appendChild(el("p", "habit-date", dateLabel(dateStr)));

    // Visual streak chip: glyph (aria-hidden) + number. Value also conveyed as
    // text in the aria-live status line below (for AT).
    var chip = el("div", "streak-chip");
    chip.setAttribute("aria-hidden", "true");
    chip.appendChild(streakGlyph());
    // F-001: number and unit share ONE label span (not two direct flex children)
    // so the flex `gap` on .streak-chip does NOT insert a space between them.
    // The hyphenated adjective must read "N-day streak" with no space before the
    // hyphen; a naive line edit that left them as sibling flex items would render
    // "N -day streak". The glyph keeps its gap from this label wrapper.
    var chipLabel = el("span", "streak-chip-label");
    var chipNum = el("span", "streak-chip-num");
    chipLabel.appendChild(chipNum);
    var chipUnit = el("span", "streak-chip-unit", "-day streak");
    chipLabel.appendChild(chipUnit);
    chip.appendChild(chipLabel);
    topRow.appendChild(chip);
    bar.appendChild(topRow);

    // Live status region (announces streak + nudge changes to AT).
    var status = el("div", "habit-status");
    status.setAttribute("aria-live", "polite");
    var statusMain = el("p", "habit-status-main");
    var statusNudge = el("p", "habit-status-nudge");
    status.appendChild(statusMain);
    status.appendChild(statusNudge);
    bar.appendChild(status);

    // Applied toggle (a real <button>, aria-pressed, dynamic aria-label).
    var btn = el("button", "applied-toggle");
    btn.setAttribute("type", "button");
    btn.appendChild(appliedGlyph());
    var btnLabel = el("span", "applied-toggle-label");
    btn.appendChild(btnLabel);
    bar.appendChild(btn);

    mount.appendChild(bar);

    /* ---- Daily card ---- */
    if (fw) {
      var cardWrap = el("div", "today-card");
      cardWrap.setAttribute("data-framework-id", fw.id);
      var card = root.PDB_CARD;
      if (card && typeof card.renderCard === "function") {
        card.renderCard(fw, cardWrap, data, { headingId: "h-today-card", showBack: false });
      }
      mount.appendChild(cardWrap);
    }

    /* ---- Live state sync (mutate nodes in place; keep focus on button) ---- */
    function sync() {
      var appliedToday = isApplied(dateStr);
      var s = streak(dateStr);

      // Streak chip (numeric; label conveyed as text in the aria-live status)
      chipNum.textContent = String(s);

      // Applied button
      btn.setAttribute("aria-pressed", appliedToday ? "true" : "false");
      btn.setAttribute("aria-label", appliedToday
        ? "Applied today — tap to undo"
        : "Mark today's card as applied");
      btnLabel.textContent = appliedToday ? "Applied today" : "Applied it";
      if (appliedToday) btn.classList.add("is-applied");
      else btn.classList.remove("is-applied");

      // Status copy (aria-live announces on change)
      statusMain.textContent = "Current streak: " + pluralDays(s) + ".";
      if (appliedToday) {
        statusNudge.textContent = s === 1
          ? "You logged today — this is the start of a streak."
          : "You logged today — keep it going tomorrow.";
      } else if (s > 0) {
        // F-001: hyphenated "N-day streak" adjective (status-main line above
        // keeps the un-hyphenated full-sentence form "Current streak: N days.").
        statusNudge.textContent = "Apply today's card to keep your " + s + "-day streak.";
      } else {
        statusNudge.textContent = "Apply today's card to start your streak.";
      }
    }

    btn.addEventListener("click", function () {
      toggle(dateStr);
      sync();
    });

    sync();
    return mount;
  }

  root.PDB_DAILY = {
    today: today,
    dailyFramework: dailyFramework,
    isApplied: isApplied,
    toggle: toggle,
    all: all,
    streak: streak,
    renderToday: renderToday
  };
})(typeof window !== "undefined" ? window : this);
