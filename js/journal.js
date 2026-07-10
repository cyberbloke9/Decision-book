/* ==========================================================================
   Pocket Decision Book — decision journal (v3.0 Sprint 002, Phase 12)
   window.PDB_JOURNAL: the journal data layer over localStorage['pdb.journal']
   (via PDB_STORE, B47) + the list / new / detail / edit render functions +
   a PURE export-string builder + the status/date helpers (contract §2).

   Discipline (contract §13):
   - persistence routes THROUGH PDB_STORE (JSON array of entry objects), never a
     legacy key; reads are read-through + corrupt-safe (bad JSON → [] silently,
     same discipline as favorites.js — never throws, never a console error).
   - NO Math.random; NO second date clock — the ONLY current-date source is
     PDB_DAILY.today() (honors __PDB_NOW__ / pdb.testDate). Component-based UTC
     date math (no new Date(str)), matching daily.js.
   - NO network: export uses navigator.share → navigator.clipboard → a visible
     selectable fallback; every branch is offline-safe (no fetch / XHR).
   - status is DERIVED LIVE at render from (reviewDate, today(), closedAt) — it
     is never frozen at save time (B50).
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "pdb.journal";
  var DAY_MS = 86400000;
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var ENERGY = ["low", "steady", "high"];
  var MOOD = ["calm", "unsure", "tense", "hopeful"];
  var REVIEW_CHOICES = [30, 90, 180];
  var DEFAULT_REVIEW = 90;

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
  /* Inverse: an epoch day-number → YYYY-MM-DD, read back via getUTC* (the ms
     ctor is deterministic + tz-safe — the "no new Date(str)" rule targets STRING
     parsing, which drifts by locale; a numeric ms value never does). */
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
  function today() {
    var daily = root.PDB_DAILY;
    if (daily && typeof daily.today === "function") return daily.today();
    // Defensive fallback (load order guarantees PDB_DAILY is present).
    var now = new Date();
    return now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());
  }

  /* reviewDate = createdAt + n days (n ∈ {30,90,180}), component-based UTC. */
  function reviewDateFor(createdAt, n) {
    var base = dayNumber(createdAt);
    if (base === null) return createdAt;
    var days = REVIEW_CHOICES.indexOf(n) !== -1 ? n : DEFAULT_REVIEW;
    return ymdFromDayNumber(base + days);
  }

  /* ---- Store I/O: read-through + corrupt-safe (never throws / logs) ---- */
  function readRaw() {
    var store = root.PDB_STORE;
    if (store && typeof store.get === "function") return store.get(KEY);
    try { return root.localStorage ? root.localStorage.getItem(KEY) : null; }
    catch (e) { return null; }
  }
  function readAll() {
    try {
      var raw = readRaw();
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var out = [];
      for (var i = 0; i < parsed.length; i++) {
        var e = parsed[i];
        if (e && typeof e === "object" && typeof e.id === "string" && e.id) out.push(e);
      }
      return out;
    } catch (e) { return []; }
  }
  function writeAll(arr) {
    var store = root.PDB_STORE;
    var str = JSON.stringify(arr);
    if (store && typeof store.set === "function") { store.set(KEY, str); return; }
    try { if (root.localStorage) root.localStorage.setItem(KEY, str); }
    catch (e) { /* blocked/full — never throw */ }
  }

  /* ---- Public data API ---- */
  /* Newest-first by createdAt, STABLE on same-day ties by insertion recency:
     reverse the stored (insertion-ordered) array, then stable-sort by createdAt
     descending — so two entries created under one injected date still list the
     most-recently-added first. No Math.random, deterministic. */
  function all() {
    var arr = readAll().slice().reverse();
    arr.sort(function (a, b) {
      var da = dayNumber(a.createdAt), db = dayNumber(b.createdAt);
      da = da === null ? -Infinity : da;
      db = db === null ? -Infinity : db;
      return db - da; // stable in modern engines → ties keep the reversed order
    });
    return arr;
  }
  function byId(id) {
    var arr = readAll();
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  function trimStr(v) { return typeof v === "string" ? v.trim() : ""; }

  function sanitizeOptions(opts) {
    if (!Array.isArray(opts)) return [];
    var out = [];
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i] || {};
      var text = trimStr(o.text);
      if (!text) continue; // drop empty rows on save (§2)
      out.push({ text: text, rejected: !!o.rejected, why: trimStr(o.why) });
    }
    return out;
  }
  function sanitizeLinks(ids) {
    if (!Array.isArray(ids)) return [];
    var seen = {}, out = [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      if (typeof id === "string" && id && !seen[id]) { seen[id] = true; out.push(id); }
    }
    return out;
  }

  /* Build the stored shape from a raw input object, omitting empty optionals so
     detail never renders "undefined"/empty labels (B51). createdAt/id are set by
     create(); update() preserves them. */
  function shape(input, createdAt, id) {
    var e = { id: id, createdAt: createdAt };
    e.situation = trimStr(input.situation);
    e.expectedOutcome = trimStr(input.expectedOutcome);

    var frame = trimStr(input.frame);
    if (frame) e.frame = frame;

    var options = sanitizeOptions(input.options);
    if (options.length) e.options = options;

    if (typeof input.confidence === "number" && input.confidence >= 1 && input.confidence <= 5) {
      e.confidence = Math.round(input.confidence);
    }

    var state = {};
    if (input.state && typeof input.state === "object") {
      if (ENERGY.indexOf(input.state.energy) !== -1) state.energy = input.state.energy;
      if (MOOD.indexOf(input.state.mood) !== -1) state.mood = input.state.mood;
    }
    if (state.energy || state.mood) e.state = state;

    var links = sanitizeLinks(input.linkedFrameworkIds);
    if (links.length) e.linkedFrameworkIds = links;

    e.reviewDate = isValidDateStr(input.reviewDate)
      ? input.reviewDate
      : reviewDateFor(createdAt, DEFAULT_REVIEW);

    // Close-the-loop fields are preserved when present (seeded/closed entries).
    if (trimStr(input.actualOutcome)) e.actualOutcome = trimStr(input.actualOutcome);
    if (trimStr(input.gapNote)) e.gapNote = trimStr(input.gapNote);
    if (isValidDateStr(input.closedAt)) e.closedAt = input.closedAt;

    return e;
  }

  function nextId(arr, createdAt) {
    var used = {};
    for (var i = 0; i < arr.length; i++) used[arr[i].id] = true;
    var n = 0, id;
    do { id = "j-" + createdAt + "-" + n; n++; } while (used[id]);
    return id;
  }

  function create(input) {
    input = input || {};
    var createdAt = today();
    var arr = readAll();
    var id = nextId(arr, createdAt);
    var entry = shape(input, createdAt, id);
    arr.push(entry);
    writeAll(arr);
    return entry;
  }

  function update(id, patch) {
    patch = patch || {};
    var arr = readAll();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        // Merge current + patch, then re-shape (id/createdAt preserved).
        var merged = {};
        var cur = arr[i], k;
        for (k in cur) if (Object.prototype.hasOwnProperty.call(cur, k)) merged[k] = cur[k];
        for (k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) merged[k] = patch[k];
        arr[i] = shape(merged, cur.createdAt, cur.id);
        writeAll(arr);
        return true;
      }
    }
    return false;
  }

  function remove(id) {
    var arr = readAll();
    var out = [], removed = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) { removed = true; continue; }
      out.push(arr[i]);
    }
    if (removed) writeAll(out);
    return removed;
  }

  /* Status derived LIVE (B50): closed (sticky) → review-due → open. */
  function status(entry) {
    if (!entry) return "open";
    if (isValidDateStr(entry.closedAt)) return "closed";
    var rd = dayNumber(entry.reviewDate);
    var td = dayNumber(today());
    if (rd !== null && td !== null && rd <= td) return "review-due";
    return "open";
  }
  var STATUS_LABEL = { open: "Open", "review-due": "Review due", closed: "Closed" };

  function frameworkName(id) {
    var data = root.PDB_DATA;
    var fw = data && typeof data.byId === "function" ? data.byId(id) : null;
    return fw ? fw.name : id;
  }

  /* ---- PURE export string (B54) — real fields, never placeholders ---- */
  function entryBlock(entry) {
    var lines = [];
    var st = status(entry);
    var title = entry.situation ? entry.situation : "Decision";
    lines.push("## " + title);
    lines.push("Created: " + entry.createdAt);
    lines.push("Status: " + STATUS_LABEL[st]);
    lines.push("Review: " + entry.reviewDate);
    lines.push("");
    lines.push("Situation:");
    lines.push(entry.situation || "(none recorded)");
    if (entry.frame) { lines.push(""); lines.push("What I'm deciding:"); lines.push(entry.frame); }
    if (entry.options && entry.options.length) {
      lines.push(""); lines.push("Options:");
      for (var i = 0; i < entry.options.length; i++) {
        var o = entry.options[i];
        var tag = o.rejected ? "rejected" : "considered";
        var line = "- " + o.text + " (" + tag + ")";
        if (o.why) line += " — " + o.why;
        lines.push(line);
      }
    }
    lines.push(""); lines.push("Expected outcome:"); lines.push(entry.expectedOutcome || "(none recorded)");
    if (typeof entry.confidence === "number") { lines.push(""); lines.push("Confidence: " + entry.confidence + "/5"); }
    if (entry.state && (entry.state.energy || entry.state.mood)) {
      var bits = [];
      if (entry.state.energy) bits.push("energy " + entry.state.energy);
      if (entry.state.mood) bits.push("mood " + entry.state.mood);
      lines.push(""); lines.push("How I felt: " + bits.join(", "));
    }
    if (entry.linkedFrameworkIds && entry.linkedFrameworkIds.length) {
      var names = entry.linkedFrameworkIds.map(frameworkName);
      lines.push(""); lines.push("Frameworks: " + names.join(", "));
    }
    if (entry.actualOutcome) { lines.push(""); lines.push("Actual outcome:"); lines.push(entry.actualOutcome); }
    if (entry.gapNote) { lines.push(""); lines.push("What the gap taught me:"); lines.push(entry.gapNote); }
    if (entry.closedAt) { lines.push(""); lines.push("Closed: " + entry.closedAt); }
    return lines.join("\n");
  }

  function exportText(entryOrAll) {
    if (Array.isArray(entryOrAll)) {
      var arr = entryOrAll;
      var header = "# Pocket Decision Book — journal export (" +
        arr.length + (arr.length === 1 ? " entry)" : " entries)");
      var blocks = arr.map(entryBlock);
      return header + "\n\n" + blocks.join("\n\n---\n\n") + "\n";
    }
    if (entryOrAll && typeof entryOrAll === "object") return entryBlock(entryOrAll) + "\n";
    return "";
  }

  /* ---- DOM helpers ---- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function clear(mount) { if (mount) mount.textContent = ""; }
  var idSeq = 0;
  function uid(prefix) { idSeq++; return (prefix || "j") + "-" + idSeq; }

  /* ---- Export delivery cascade: share → clipboard → visible fallback ----
     Every rejection routes to the visible fallback so NOTHING is an unhandled
     rejection (which would surface as a pageerror and fail the zero-console bar,
     contract §7). The fallback is a labelled, pre-selected textarea the user can
     copy manually — offline-safe, no network. */
  function exportHost(viewMount) {
    var host = viewMount.querySelector(".journal-export");
    if (!host) {
      host = el("div", "journal-export");
      host.setAttribute("aria-live", "polite");
      viewMount.appendChild(host);
    }
    return host;
  }
  function showFallback(text, viewMount, label) {
    var host = exportHost(viewMount);
    clear(host);
    var note = el("p", "journal-export-note",
      (label || "Your export") + " — select all and copy the text below:");
    var taId = uid("export-ta");
    note.setAttribute("id", taId + "-label");
    var ta = el("textarea", "journal-export-text");
    ta.setAttribute("readonly", "readonly");
    ta.setAttribute("rows", "8");
    ta.setAttribute("aria-labelledby", taId + "-label");
    ta.id = taId;
    ta.value = text;
    host.appendChild(note);
    host.appendChild(ta);
    try { ta.focus(); ta.select(); } catch (e) { /* focus best-effort */ }
  }
  function showCopied(viewMount, label) {
    var host = exportHost(viewMount);
    clear(host);
    host.appendChild(el("p", "journal-export-note",
      (label || "Export") + " copied to your clipboard."));
  }
  function deliverExport(text, viewMount, label) {
    var nav = root.navigator;
    try {
      if (nav && typeof nav.share === "function") {
        nav.share({ text: text }).catch(function () { showFallback(text, viewMount, label); });
        return;
      }
    } catch (e) { /* fall through */ }
    try {
      if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
        nav.clipboard.writeText(text)
          .then(function () { showCopied(viewMount, label); })
          .catch(function () { showFallback(text, viewMount, label); });
        return;
      }
    } catch (e) { /* fall through */ }
    showFallback(text, viewMount, label);
  }

  /* ---- Shared status chip ---- */
  function statusChip(entry) {
    var st = status(entry);
    var chip = el("span", "journal-chip journal-chip--" + st, STATUS_LABEL[st]);
    return chip;
  }

  function excerpt(str, n) {
    str = (str || "").replace(/\s+/g, " ").trim();
    if (str.length <= n) return str;
    return str.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
  }

  /* ---- List view (B50) ---- */
  function renderList(mount) {
    clear(mount);
    var entries = all();

    if (!entries.length) {
      var empty = el("div", "empty-state journal-empty");
      empty.appendChild(el("p", "empty-title", "No decisions yet"));
      empty.appendChild(el("p", "empty-body",
        "Catch a real decision while it's live — the deadline, the number, the person you're weighing — and write down what you expect to happen. Later you get to see how right you were."));
      var cta = el("a", "btn-link", "Write your first entry");
      cta.setAttribute("href", "#/journal/new");
      empty.appendChild(cta);
      mount.appendChild(empty);
      return mount;
    }

    var actions = el("div", "journal-list-actions");
    var newLink = el("a", "btn-link journal-new-link", "New decision");
    newLink.setAttribute("href", "#/journal/new");
    actions.appendChild(newLink);
    var exportAll = el("button", "btn-link journal-export-all", "Export all");
    exportAll.setAttribute("type", "button");
    actions.appendChild(exportAll);
    mount.appendChild(actions);

    var ul = el("ul", "journal-list");
    entries.forEach(function (entry) {
      var li = el("li", "journal-list-item");
      var a = el("a", "journal-row");
      a.setAttribute("href", "#/journal/" + encodeURIComponent(entry.id));
      var top = el("div", "journal-row-top");
      top.appendChild(el("p", "journal-row-title", excerpt(entry.situation, 96) || "Untitled decision"));
      top.appendChild(statusChip(entry));
      a.appendChild(top);
      var meta = el("p", "journal-row-meta",
        "Written " + dateLabel(entry.createdAt) + " · Review " + dateLabel(entry.reviewDate));
      a.appendChild(meta);
      li.appendChild(a);
      ul.appendChild(li);
    });
    mount.appendChild(ul);

    exportAll.addEventListener("click", function () {
      deliverExport(exportText(all()), mount, "All entries");
    });
    return mount;
  }

  /* ---- Not-found within the journal screen (unknown id) ---- */
  function renderNotFound(mount) {
    clear(mount);
    var wrap = el("div", "journal-notfound");
    wrap.appendChild(el("p", "empty-title", "That entry isn't here"));
    wrap.appendChild(el("p", "empty-body",
      "It may have been deleted, or the link is off. Your other decisions are safe."));
    var back = el("a", "btn-link", "Back to your journal");
    back.setAttribute("href", "#/journal");
    wrap.appendChild(back);
    mount.appendChild(wrap);
    return mount;
  }

  /* ---- Detail view (B51) ---- */
  function fieldBlock(label, value) {
    var block = el("div", "journal-field");
    block.appendChild(el("p", "journal-field-label", label));
    block.appendChild(el("p", "journal-field-value", value));
    return block;
  }

  function renderDetail(mount, id) {
    clear(mount);
    var entry = byId(id);
    if (!entry) return renderNotFound(mount);

    var back = el("a", "back-link journal-back", "Back to your journal");
    back.setAttribute("href", "#/journal");
    mount.appendChild(back);

    var article = el("article", "journal-detail");

    var head = el("div", "journal-detail-head");
    head.appendChild(statusChip(entry));
    head.appendChild(el("p", "journal-detail-dates",
      "Written " + dateLabel(entry.createdAt) + " · Review " + dateLabel(entry.reviewDate)));
    article.appendChild(head);

    article.appendChild(fieldBlock("Situation", entry.situation));
    if (entry.frame) article.appendChild(fieldBlock("What I'm deciding", entry.frame));

    if (entry.options && entry.options.length) {
      var optWrap = el("div", "journal-field");
      optWrap.appendChild(el("p", "journal-field-label", "Options"));
      var optUl = el("ul", "journal-detail-options");
      entry.options.forEach(function (o) {
        var li = el("li", "journal-detail-option" + (o.rejected ? " is-rejected" : ""));
        var tag = el("span", "journal-option-tag", o.rejected ? "Rejected" : "Considered");
        li.appendChild(tag);
        li.appendChild(el("span", "journal-option-text", o.text));
        if (o.why) li.appendChild(el("span", "journal-option-why", "— " + o.why));
        optUl.appendChild(li);
      });
      optWrap.appendChild(optUl);
      article.appendChild(optWrap);
    }

    article.appendChild(fieldBlock("Expected outcome", entry.expectedOutcome));

    if (typeof entry.confidence === "number") {
      article.appendChild(fieldBlock("Confidence", entry.confidence + " of 5"));
    }
    if (entry.state && (entry.state.energy || entry.state.mood)) {
      var feltBits = [];
      if (entry.state.energy) feltBits.push("energy " + entry.state.energy);
      if (entry.state.mood) feltBits.push("mood " + entry.state.mood);
      article.appendChild(fieldBlock("How I felt", feltBits.join(" · ")));
    }
    if (entry.linkedFrameworkIds && entry.linkedFrameworkIds.length) {
      var linkWrap = el("div", "journal-field");
      linkWrap.appendChild(el("p", "journal-field-label", "Frameworks used"));
      var linkRow = el("div", "journal-detail-links");
      entry.linkedFrameworkIds.forEach(function (fid) {
        var a = el("a", "journal-fw-link", frameworkName(fid));
        a.setAttribute("href", "#/f/" + encodeURIComponent(fid));
        linkRow.appendChild(a);
      });
      linkWrap.appendChild(linkRow);
      article.appendChild(linkWrap);
    }
    if (entry.closedAt) {
      if (entry.actualOutcome) article.appendChild(fieldBlock("What actually happened", entry.actualOutcome));
      if (entry.gapNote) article.appendChild(fieldBlock("What the gap taught me", entry.gapNote));
    }

    mount.appendChild(article);

    // Actions: Edit, Export, Delete (inline two-step confirm).
    var actions = el("div", "journal-detail-actions");
    var editLink = el("a", "btn-link", "Edit");
    editLink.setAttribute("href", "#/journal/" + encodeURIComponent(entry.id) + "/edit");
    actions.appendChild(editLink);

    var exportBtn = el("button", "btn-link", "Export");
    exportBtn.setAttribute("type", "button");
    exportBtn.addEventListener("click", function () {
      deliverExport(exportText(entry), mount, "This entry");
    });
    actions.appendChild(exportBtn);

    var delWrap = el("div", "journal-delete");
    var delBtn = el("button", "btn-link journal-delete-btn", "Delete");
    delBtn.setAttribute("type", "button");
    delWrap.appendChild(delBtn);
    actions.appendChild(delWrap);
    mount.appendChild(actions);

    delBtn.addEventListener("click", function () {
      clear(delWrap);
      var confirm = el("div", "journal-delete-confirm");
      confirm.setAttribute("role", "group");
      confirm.setAttribute("aria-label", "Confirm deleting this entry");
      confirm.appendChild(el("span", "journal-delete-prompt", "Delete this entry?"));
      var yes = el("button", "btn-link journal-delete-yes", "Confirm delete");
      yes.setAttribute("type", "button");
      var no = el("button", "btn-link journal-delete-no", "Cancel");
      no.setAttribute("type", "button");
      confirm.appendChild(yes);
      confirm.appendChild(no);
      delWrap.appendChild(confirm);
      yes.focus();
      yes.addEventListener("click", function () {
        remove(entry.id);
        location.hash = "#/journal";
      });
      no.addEventListener("click", function () {
        clear(delWrap);
        delWrap.appendChild(delBtn);
        delBtn.focus();
      });
    });

    return mount;
  }

  /* ---- Form (new + edit, B49) ---- */
  function labelledField(labelText, control, opts) {
    opts = opts || {};
    var wrap = el("div", "journal-field-input");
    var cid = control.id || uid("f");
    control.id = cid;
    var label = el("label", "journal-input-label", labelText);
    label.setAttribute("for", cid);
    if (opts.required) {
      var req = el("span", "journal-required", " (required)");
      label.appendChild(req);
    }
    wrap.appendChild(label);
    if (opts.help) {
      var helpId = cid + "-help";
      var help = el("p", "journal-input-help", opts.help);
      help.id = helpId;
      wrap.appendChild(help);
      control.setAttribute("aria-describedby", helpId);
    }
    wrap.appendChild(control);
    var err = el("p", "journal-error", "");
    err.id = cid + "-error";
    err.setAttribute("role", "alert");
    err.hidden = true;
    wrap.appendChild(err);
    return { wrap: wrap, control: control, error: err };
  }

  function radioGroup(legendText, name, choices, selected, hint) {
    var fs = el("fieldset", "journal-radiogroup");
    var lg = el("legend", "journal-legend", legendText);
    fs.appendChild(lg);
    if (hint) fs.appendChild(el("p", "journal-radiohint", hint));
    var row = el("div", "journal-radio-row");
    choices.forEach(function (c) {
      var val = String(c.value);
      var rid = uid("r");
      var label = el("label", "journal-radio");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = val;
      input.id = rid;
      input.className = "journal-radio-input";
      if (selected != null && String(selected) === val) input.checked = true;
      label.setAttribute("for", rid);
      label.appendChild(input);
      label.appendChild(el("span", "journal-radio-text", c.label));
      row.appendChild(label);
    });
    fs.appendChild(row);
    return fs;
  }

  function selectedRadio(form, name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : null;
  }

  function buildOptionRow(container, data) {
    data = data || {};
    var row = el("div", "journal-option-row");

    var textId = uid("opt");
    var textLabel = el("label", "journal-option-field");
    textLabel.setAttribute("for", textId);
    textLabel.appendChild(el("span", "journal-option-caption", "Option"));
    var textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = textId;
    textInput.className = "journal-input journal-option-text-input";
    textInput.setAttribute("placeholder", "e.g. Ship now");
    if (data.text) textInput.value = data.text;
    textLabel.appendChild(textInput);
    row.appendChild(textLabel);

    var rejLabel = el("label", "journal-option-reject");
    var rejInput = document.createElement("input");
    rejInput.type = "checkbox";
    rejInput.className = "journal-option-rejected-input";
    if (data.rejected) rejInput.checked = true;
    rejLabel.appendChild(rejInput);
    rejLabel.appendChild(el("span", null, "I rejected this"));
    row.appendChild(rejLabel);

    var whyId = uid("why");
    var whyLabel = el("label", "journal-option-field");
    whyLabel.setAttribute("for", whyId);
    whyLabel.appendChild(el("span", "journal-option-caption", "Why (kept or rejected)"));
    var whyInput = document.createElement("input");
    whyInput.type = "text";
    whyInput.id = whyId;
    whyInput.className = "journal-input journal-option-why-input";
    whyInput.setAttribute("placeholder", "e.g. not enough churn signal yet");
    if (data.why) whyInput.value = data.why;
    whyLabel.appendChild(whyInput);
    row.appendChild(whyLabel);

    var removeBtn = el("button", "btn-link journal-option-remove", "Remove option");
    removeBtn.setAttribute("type", "button");
    removeBtn.addEventListener("click", function () {
      var focusTarget = container.querySelector(".journal-add-option");
      container.removeChild(row);
      if (focusTarget) focusTarget.focus();
    });
    row.appendChild(removeBtn);

    container.insertBefore(row, container.querySelector(".journal-add-option"));
    return row;
  }

  function collectOptions(form) {
    var rows = form.querySelectorAll(".journal-option-row");
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var text = rows[i].querySelector(".journal-option-text-input").value;
      var rejected = rows[i].querySelector(".journal-option-rejected-input").checked;
      var why = rows[i].querySelector(".journal-option-why-input").value;
      out.push({ text: text, rejected: rejected, why: why });
    }
    return out;
  }

  /* prefill: an entry-shaped object (edit) or a partial (new with fwId). */
  function renderForm(mount, mode, prefill) {
    clear(mount);
    prefill = prefill || {};

    var form = document.createElement("form");
    form.className = "journal-form";
    form.setAttribute("novalidate", "novalidate");

    // Live links state (editable via chips + add-select).
    var links = sanitizeLinks(prefill.linkedFrameworkIds);

    // Situation (required, textarea).
    var situation = document.createElement("textarea");
    situation.className = "journal-input journal-textarea";
    situation.setAttribute("rows", "3");
    situation.setAttribute("required", "required");
    situation.setAttribute("aria-required", "true");
    situation.setAttribute("placeholder",
      "e.g. Ship the pricing change before the Aug 1 board call, or hold a week for more churn data?");
    if (prefill.situation) situation.value = prefill.situation;
    var sitField = labelledField("The situation", situation, {
      required: true,
      help: "Name the real stakes — a number, a deadline, a person or tension you're weighing."
    });
    form.appendChild(sitField.wrap);

    // Frame (optional).
    var frame = document.createElement("textarea");
    frame.className = "journal-input journal-textarea";
    frame.setAttribute("rows", "2");
    frame.setAttribute("placeholder", "e.g. Am I really deciding on timing, or on the price itself?");
    if (prefill.frame) frame.value = prefill.frame;
    form.appendChild(labelledField("What am I actually deciding?", frame, {
      help: "Optional — the sharper question under the situation."
    }).wrap);

    // Options (dynamic rows).
    var optWrap = el("div", "journal-options");
    var optLegend = el("p", "journal-legend", "Options I'm weighing");
    optWrap.appendChild(optLegend);
    optWrap.appendChild(el("p", "journal-radiohint",
      "Optional — include the ones you rejected and why; that's the part you'll want later."));
    var addOpt = el("button", "btn-link journal-add-option", "Add an option");
    addOpt.setAttribute("type", "button");
    optWrap.appendChild(addOpt);
    addOpt.addEventListener("click", function () { buildOptionRow(optWrap, {}); });
    form.appendChild(optWrap);
    if (Array.isArray(prefill.options)) {
      prefill.options.forEach(function (o) { buildOptionRow(optWrap, o); });
    }

    // Expected outcome (required, textarea).
    var expected = document.createElement("textarea");
    expected.className = "journal-input journal-textarea";
    expected.setAttribute("rows", "3");
    expected.setAttribute("required", "required");
    expected.setAttribute("aria-required", "true");
    expected.setAttribute("placeholder", "e.g. We hold — I'll have cleaner churn numbers by Aug 8.");
    if (prefill.expectedOutcome) expected.value = prefill.expectedOutcome;
    var expField = labelledField("What I expect to happen", expected, {
      required: true,
      help: "Your prediction, concretely. This is what the review checks you against."
    });
    form.appendChild(expField.wrap);

    // Confidence (1-5 radios).
    var confChoices = [];
    for (var c = 1; c <= 5; c++) confChoices.push({ value: c, label: String(c) });
    form.appendChild(radioGroup(
      "How confident are you?", "j-confidence", confChoices,
      (typeof prefill.confidence === "number" ? prefill.confidence : null),
      "1 = very unsure · 5 = very confident"
    ));

    // Energy + mood (state).
    var pfState = prefill.state || {};
    form.appendChild(radioGroup(
      "Energy right now", "j-energy",
      ENERGY.map(function (v) { return { value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }; }),
      pfState.energy, null
    ));
    form.appendChild(radioGroup(
      "Mood right now", "j-mood",
      MOOD.map(function (v) { return { value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }; }),
      pfState.mood, null
    ));

    // Review date (+30/+90/+180). Default +90; derive selection in edit.
    var selectedN = DEFAULT_REVIEW;
    if (mode === "edit" && prefill.createdAt && isValidDateStr(prefill.reviewDate)) {
      var diff = dayNumber(prefill.reviewDate) - dayNumber(prefill.createdAt);
      if (REVIEW_CHOICES.indexOf(diff) !== -1) selectedN = diff;
    }
    form.appendChild(radioGroup(
      "Review this decision in", "j-review",
      REVIEW_CHOICES.map(function (n) { return { value: n, label: "+" + n + " days" }; }),
      selectedN, "You'll be reminded to close the loop on it."
    ));

    // Linked frameworks (chips + add-select).
    var linkSection = el("div", "journal-links");
    linkSection.appendChild(el("p", "journal-legend", "Frameworks used"));
    var chipRow = el("div", "journal-link-chips");
    linkSection.appendChild(chipRow);

    function renderChips() {
      clear(chipRow);
      if (!links.length) {
        chipRow.appendChild(el("p", "journal-radiohint journal-link-empty",
          "None linked yet — or open a framework card and tap “Journal this decision”."));
        return;
      }
      links.forEach(function (fid) {
        var chip = el("span", "journal-link-chip");
        chip.appendChild(el("span", "journal-link-chip-name", frameworkName(fid)));
        var rm = el("button", "journal-link-remove", "Remove");
        rm.setAttribute("type", "button");
        rm.setAttribute("aria-label", "Remove " + frameworkName(fid));
        rm.appendChild(el("span", "journal-link-remove-x", "×"));
        rm.addEventListener("click", function () {
          var i = links.indexOf(fid);
          if (i !== -1) links.splice(i, 1);
          renderChips();
        });
        chip.appendChild(rm);
        chipRow.appendChild(chip);
      });
    }
    renderChips();

    // Add-a-framework select (all 74, keyboard-operable, labelled).
    var data = root.PDB_DATA;
    if (data && Array.isArray(data.frameworks)) {
      var addWrap = el("div", "journal-link-add");
      var selId = uid("linksel");
      var selLabel = el("label", "journal-input-label", "Link another framework");
      selLabel.setAttribute("for", selId);
      var sel = document.createElement("select");
      sel.id = selId;
      sel.className = "journal-input journal-link-select";
      var ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Choose a framework…";
      sel.appendChild(ph);
      data.frameworks.slice().sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      }).forEach(function (fw) {
        var opt = document.createElement("option");
        opt.value = fw.id;
        opt.textContent = fw.name;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", function () {
        var v = sel.value;
        if (v && links.indexOf(v) === -1) { links.push(v); renderChips(); }
        sel.value = "";
      });
      addWrap.appendChild(selLabel);
      addWrap.appendChild(sel);
      linkSection.appendChild(addWrap);
    }
    form.appendChild(linkSection);

    // Submit + cancel.
    var actions = el("div", "journal-form-actions");
    var submit = el("button", "btn-link journal-submit", mode === "edit" ? "Save changes" : "Save decision");
    submit.setAttribute("type", "submit");
    actions.appendChild(submit);
    var cancel = el("a", "btn-link journal-cancel", "Cancel");
    cancel.setAttribute("href", mode === "edit" && prefill.id
      ? "#/journal/" + encodeURIComponent(prefill.id)
      : "#/journal");
    actions.appendChild(cancel);
    form.appendChild(actions);

    mount.appendChild(form);

    /* ---- Validation + submit ---- */
    function setError(field, msg) {
      field.control.setAttribute("aria-invalid", "true");
      field.control.setAttribute("aria-describedby",
        (field.control.getAttribute("aria-describedby") || "").replace(field.error.id, "").trim()
          + " " + field.error.id);
      field.error.textContent = msg;
      field.error.hidden = false;
    }
    function clearError(field) {
      field.control.removeAttribute("aria-invalid");
      field.error.textContent = "";
      field.error.hidden = true;
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearError(sitField);
      clearError(expField);

      var sitVal = trimStr(situation.value);
      var expVal = trimStr(expected.value);
      var firstInvalid = null;
      if (!sitVal) { setError(sitField, "Add the situation before saving — it's the heart of the entry."); firstInvalid = firstInvalid || situation; }
      if (!expVal) { setError(expField, "Add what you expect to happen — the review checks you against it."); firstInvalid = firstInvalid || expected; }
      if (firstInvalid) { firstInvalid.focus(); return; } // BLOCK: no write

      var confRaw = selectedRadio(form, "j-confidence");
      var input = {
        situation: sitVal,
        frame: frame.value,
        options: collectOptions(form),
        expectedOutcome: expVal,
        confidence: confRaw ? parseInt(confRaw, 10) : undefined,
        state: {
          energy: selectedRadio(form, "j-energy") || undefined,
          mood: selectedRadio(form, "j-mood") || undefined
        },
        linkedFrameworkIds: links.slice()
      };
      var nRaw = selectedRadio(form, "j-review");
      var n = nRaw ? parseInt(nRaw, 10) : DEFAULT_REVIEW;

      if (mode === "edit" && prefill.id) {
        input.reviewDate = reviewDateFor(prefill.createdAt, n);
        update(prefill.id, input);
        location.hash = "#/journal/" + encodeURIComponent(prefill.id);
      } else {
        // today() is deterministic within this tick, so it equals the createdAt
        // create() will stamp — compute reviewDate up front (single write).
        input.reviewDate = reviewDateFor(today(), n);
        var created = create(input);
        location.hash = "#/journal/" + encodeURIComponent(created.id);
      }
    });

    // Focus the first field for keyboard users landing on the form.
    try { situation.focus(); } catch (e) { /* best-effort */ }
    return mount;
  }

  function renderNew(mount, opts) {
    opts = opts || {};
    var prefill = {};
    if (opts.fwId) prefill.linkedFrameworkIds = [opts.fwId];
    return renderForm(mount, "new", prefill);
  }

  function renderEdit(mount, id) {
    var entry = byId(id);
    if (!entry) return renderNotFound(mount);
    return renderForm(mount, "edit", entry);
  }

  root.PDB_JOURNAL = {
    all: all,
    byId: byId,
    create: create,
    update: update,
    remove: remove,
    status: status,
    reviewDateFor: reviewDateFor,
    exportText: exportText,
    renderList: renderList,
    renderNew: renderNew,
    renderDetail: renderDetail,
    renderEdit: renderEdit
  };
})(typeof window !== "undefined" ? window : this);
