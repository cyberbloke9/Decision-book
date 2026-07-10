/* ==========================================================================
   Pocket Decision Book — reverse recall quiz (v3.0 Sprint 004, Phase 14)
   window.PDB_QUIZ: the 5-question "which framework fits?" quiz over the 74
   frameworks, driven by a PURE, seeded, deterministic question builder plus a
   display-only stem redaction that hides the framework name AND its give-away
   vocabulary (contract §2.3/§2.4, B61–B65).

   Discipline (contract §13):
   - NO randomness (no Math dot random); NO second date clock. The ONLY current-date source
     is PDB_DAILY.today() (honors __PDB_NOW__ / pdb.testDate). Selection is
     seeded from (frameworkId, today()) via a small FNV-1a string hash + an LCG
     seeded shuffle — deterministic, cross-run and cross-timezone stable.
   - NO network (no fetch / XHR / remote URL); NO SVG (text-only DOM). No new
     Date(<string>) parse; no Date at all (the quiz needs no date math beyond
     the string clock).
   - The pure per-framework picks (pickScenario / pickDistractors / buildQuestion)
     read ONLY (fw, dateStr, PDB_DATA) — never pdb.srs / pdb.quiz / the recency
     buffer — so the determinism proxy is state-independent (§2.3). The round
     BUILDER (impure) reads PDB_SRS.due + pdb.quiz.seen + the in-memory recency
     buffer to ORDER candidates, but the per-framework question content is pure.
   - Stats persist THROUGH PDB_STORE (pdb.quiz, a JSON object; JSON.parse/
     stringify, corrupt-safe). SRS is fed ONLY via PDB_SRS.grade (the S003 write
     path) — this module never touches pdb.srs directly and never edits srs.js.
   - Redaction is DISPLAY-ONLY: it transforms the chosen scenario STRING for
     display; PDB_DATA examples[].scenario is never mutated (B77).
   ========================================================================== */
(function (root) {
  "use strict";

  var QUIZ_KEY = "pdb.quiz";
  var RECENCY_N = 8; // in-memory recency cap (B65) — documented constant

  /* ---- The single clock (honors __PDB_NOW__ / pdb.testDate via daily) ---- */
  function today() {
    var daily = root.PDB_DAILY;
    if (daily && typeof daily.today === "function") return daily.today();
    return "1970-01-01"; // unreachable in the shipped app; deterministic fallback
  }

  function data() { return root.PDB_DATA; }
  function frameworkById(id) {
    var d = data();
    return d && typeof d.byId === "function" ? d.byId(id) : null;
  }
  function frameworks() {
    var d = data();
    return d && Array.isArray(d.frameworks) ? d.frameworks : [];
  }

  /* ========================================================================
     Seeded determinism: FNV-1a string hash → uint32; an LCG-seeded shuffle.
     Same inputs → same outputs, every run, every timezone. No randomness.
     ======================================================================== */
  function seed(str) {
    var h = 2166136261; // FNV offset basis
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619); // FNV prime
    }
    return h >>> 0;
  }
  function lcg(s) {
    var state = s >>> 0;
    return function next() {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state;
    };
  }
  function seededShuffle(arr, s) {
    var a = arr.slice();
    var rnd = lcg(s || 1);
    for (var i = a.length - 1; i > 0; i--) {
      var j = rnd() % (i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ========================================================================
     Redaction tables (documented in generator_trace.log). All masking is
     scoped to the CURRENT question's framework: the redactor removes, from the
     chosen scenario STRING (display-only, never the store):
       (1) fw.name (full, case-insensitive, whole-word/phrase);
       (2) its curated SHORT_FORMS (per framework id) — NOT an auto word-splitter
           (a splitter would mangle generic words like "Analysis"/"Model"/"Map");
       (3) VISUAL_LABELS[fw.visualType] (full phrase) AND its distinctive head
           noun from VISUAL_HEAD_NOUNS (give-away shapes only; generic nouns
           omitted so ordinary prose is not over-redacted);
       (4) a SHARED signature-vocabulary table for the distinctive named tokens
           the v2 author embedded inline to point at a framework (incl. the
           spec-named tokens: "important-not-urgent", "SWOT", "80/20",
           "inversion", "single/double-loop", "the matrix"/"the grid").
     Replacements are NEUTRAL, grammatical wording so the stem reads as clean
     English (no [REDACTED]/████ artifacts, no double spaces, no dangling
     articles). Longer phrases are masked before shorter tokens so a phrase wins.
     ======================================================================== */

  // (2) Curated per-framework short forms (only the give-away ones the author
  // actually uses inline; the full name is always masked regardless).
  var SHORT_FORMS = {
    "eisenhower-matrix": ["Eisenhower"],
    "swot-analysis": ["SWOT"],
    "bcg-box": ["BCG"],
    "feedback-analysis-drucker": ["Feedback Analysis", "Drucker"],
    "john-whitmore-grow": ["GROW", "Whitmore"],
    "morphological-box-scamper": ["SCAMPER", "Morphological Box"],
    "johari-window": ["Johari"],
    "uffe-elbaek-model": ["Uffe Elbaek", "Elbaek"],
    "political-compass": ["Political Compass"],
    "rumsfeld-matrix": ["Rumsfeld"],
    "maslow-pyramids": ["Maslow"],
    "sinus-milieu-bourdieu-model": ["Sinus Milieu", "Bourdieu"],
    "double-loop-learning": ["Double-Loop", "Double Loop"],
    "appreciative-inquiry": ["Appreciative Inquiry"],
    "pareto-principle": ["Pareto", "80/20", "80-20"],
    "long-tail": ["Long Tail"],
    "black-swan-model": ["Black Swan"],
    "chasm-diffusion-model": ["Chasm", "Diffusion"],
    "prisoners-dilemma": ["Prisoner's Dilemma", "Prisoners Dilemma"],
    "hersey-blanchard": ["Hersey", "Blanchard", "Situational Leadership"],
    "role-playing-model": ["Belbin", "de Bono"],
    "project-management-triangle": ["Project Management Triangle", "iron triangle"],
    "drexler-sibbet-team-performance": ["Drexler", "Sibbet"],
    "second-order-thinking": ["Second-Order", "Second Order"],
    "inversion": [],
    "pre-mortem": ["Pre-Mortem", "Premortem"],
    "regret-minimization": ["Regret Minimization", "Regret Minimisation"],
    "ooda-loop": ["OODA"],
    "10-10-10": ["10/10/10", "10-10-10"],
    "circle-of-competence": ["Circle of Competence"],
    "sunk-cost-fallacy": ["Sunk Cost", "Sunk-Cost"],
    "confirmation-bias": ["Confirmation Bias"],
    "loss-aversion": ["Loss Aversion"],
    "planning-fallacy": ["Planning Fallacy"],
    "anchoring": ["Anchoring", "anchor"],
    "hindsight-bias": ["Hindsight"],
    "implementation-intentions": ["Implementation Intention", "if-then plan"],
    "deep-work": ["Deep Work"],
    "environment-design": ["Environment Design"],
    "ulysses-pact": ["Ulysses Pact", "Ulysses"],
    "daily-highlight": ["Daily Highlight", "Buffett"],
    "wrap": ["WRAP"],
    "decision-journal": ["Decision Journal"],
    "weighted-scoring": ["Weighted Scoring"],
    "cynefin": ["Cynefin"],
    "circle-of-competence-2": [] // (guard) unused
  };

  // (3) Distinctive head noun per visualType (give-away shapes only). Generic
  // nouns (split, timeline, curve, flow, cycle, concentric, spectrum, layers…)
  // are intentionally omitted so ordinary prose is not mangled. Replacement is
  // a neutral common noun that reads grammatically in "a <noun>" / "the <noun>".
  var VISUAL_HEAD_NOUNS = {
    "matrix-2x2": { noun: "matrix", repl: "framework" },
    "grid": { noun: "grid", repl: "framework" },
    "funnel": { noun: "funnel", repl: "filter" },
    "pyramid": { noun: "pyramid", repl: "hierarchy" },
    "radar": { noun: "radar chart", repl: "profile" },
    "nine-dot": { noun: "nine-dot", repl: "puzzle" }
  };

  // (4) Shared signature vocabulary → neutral rephrase. Longest phrases first.
  // These are the distinctive named tokens the author embedded inline to point
  // at a framework; masking them (display-only) is what makes the quiz test
  // recall rather than 30-second reading. Applied to the current scenario only.
  var SIGNATURE_TERMS = [
    ["important-not-urgent", "one that matters but isn't pressing"],
    ["important not urgent", "one that matters but isn't pressing"],
    ["urgent-not-important", "one that's pressing but doesn't matter"],
    ["urgent not important", "one that's pressing but doesn't matter"],
    ["important-but-not-urgent", "one that matters but isn't pressing"],
    ["single-loop", "surface-level"],
    ["double-loop", "assumption-questioning"],
    ["second-order", "downstream"],
    ["second order", "downstream"],
    ["the matrix", "this method"],
    ["the grid", "this method"],
    ["the quadrant", "the category"],
    ["quadrant", "category"],
    ["80/20", "vital-few"],
    ["80-20", "vital-few"],
    ["the long tail", "the many small niches"],
    ["black swan", "rare high-impact event"],
    ["sunk cost", "money already spent"],
    ["sunk-cost", "already-spent"],
    ["pre-mortem", "imagining it has already failed"],
    ["premortem", "imagining it has already failed"],
    ["ooda", "observe-orient-decide-act"],
    ["swot", "this method"],
    ["invert the problem", "flip the question around"],
    ["inverting", "working backward"],
    ["inverted", "worked backward"],
    ["inversion", "flipping the question around"],
    ["invert", "flip around"],
    ["cash cow", "steady earner"],
    ["question mark", "unproven bet"]
  ];

  function visualLabelPhrase(fw) {
    var d = data();
    if (!d || !d.VISUAL_LABELS || !fw) return null;
    return d.VISUAL_LABELS[fw.visualType] || null;
  }

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Whole-word / phrase-boundary, case-insensitive replace that preserves the
  // leading capitalization of the matched token and never mangles partial words.
  function maskToken(text, token, repl) {
    if (!token) return text;
    var re;
    try {
      re = new RegExp("\\b" + escapeRe(token) + "\\b", "gi");
    } catch (e) { return text; }
    return text.replace(re, function (m) {
      var lead = m.charAt(0);
      if (lead !== lead.toLowerCase() && lead === lead.toUpperCase()) {
        return repl.charAt(0).toUpperCase() + repl.slice(1);
      }
      return repl;
    });
  }

  // Collapse the leftover artifacts masking can leave: "the/a/an this method"
  // → "this method" (the neutral phrase already carries its own determiner),
  // double spaces, and space-before-punctuation. Keeps the stem clean English.
  function tidy(text) {
    return text
      .replace(/\b(the|a|an)\s+this method\b/gi, function (m) {
        return /^[A-Z]/.test(m) ? "This method" : "this method";
      })
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim();
  }

  /* redact(scenario, fw) — the display-only stem builder (§2.4). Order:
     signature phrases (shared, longest-first) → name → short forms → visual
     label phrase → visual head noun. All neutral, grammatical. Returns a NEW
     string; the input (and the store) is never mutated. */
  function redact(scenario, fw) {
    var out = String(scenario == null ? "" : scenario);
    var i;

    // (4) signature vocabulary (already ordered longest-first where it matters)
    for (i = 0; i < SIGNATURE_TERMS.length; i++) {
      out = maskToken(out, SIGNATURE_TERMS[i][0], SIGNATURE_TERMS[i][1]);
    }

    if (fw) {
      // (1) the full framework name
      out = maskToken(out, fw.name, "this method");

      // (2) curated short forms
      var forms = SHORT_FORMS[fw.id] || [];
      for (i = 0; i < forms.length; i++) {
        out = maskToken(out, forms[i], "this method");
      }

      // (3) visual label full phrase + distinctive head noun
      var label = visualLabelPhrase(fw);
      if (label) out = maskToken(out, label, "this method");
      var vh = VISUAL_HEAD_NOUNS[fw.visualType];
      if (vh) out = maskToken(out, vh.noun, vh.repl);
    }

    return tidy(out);
  }

  /* ========================================================================
     PURE per-framework selectors (state-independent — the headline, §2.3).
     ======================================================================== */

  function pickScenario(fw, dateStr) {
    if (!fw || !Array.isArray(fw.examples) || !fw.examples.length) return null;
    var i = seed(fw.id + "|" + dateStr) % fw.examples.length;
    return fw.examples[i];
  }

  function pickDistractors(fw, dateStr) {
    if (!fw) return [];
    var pool = [];
    var all = frameworks();
    for (var i = 0; i < all.length; i++) {
      if (all[i].category === fw.category && all[i].id !== fw.id) pool.push(all[i].id);
    }
    // pool is already in PDB_DATA.frameworks index order; seeded shuffle → first 3
    var shuffled = seededShuffle(pool, seed(fw.id + "|distractors|" + dateStr));
    return shuffled.slice(0, 3);
  }

  function buildQuestion(fw, dateStr) {
    if (!fw) return null;
    var ds = typeof dateStr === "string" && dateStr ? dateStr : today();
    var ex = pickScenario(fw, ds);
    var distractors = pickDistractors(fw, ds);
    var optionIds = [fw.id].concat(distractors);
    var options = seededShuffle(optionIds, seed(fw.id + "|options|" + ds));
    var scenarioRaw = ex ? ex.scenario : "";
    return {
      frameworkId: fw.id,
      scenarioRaw: scenarioRaw,
      stem: redact(scenarioRaw, fw),
      options: options,
      correctId: fw.id,
      essence: fw.essence,
      cardHref: "#/f/" + encodeURIComponent(fw.id)
    };
  }

  /* ========================================================================
     Round framework selection (impure ordering) + recency guard (§2.5, B62/B65).
     ======================================================================== */

  var recentCardViews = []; // in-memory, session-only; empty at page load

  function orderedCandidates(ds) {
    var order = [];
    var inOrder = Object.create(null);
    function add(id) { if (id && !inOrder[id]) { inOrder[id] = 1; order.push(id); } }

    // Tier 1 — SRS-due (already oldest-due-first, deterministic tie-break)
    var srs = root.PDB_SRS;
    if (srs && typeof srs.due === "function") {
      var due = srs.due(ds) || [];
      for (var i = 0; i < due.length; i++) add(due[i]);
    }
    // Tier 2 — not-yet-seen-by-quiz (in frameworks index order)
    var seenList = readStats().seen;
    var seen = Object.create(null);
    for (var s = 0; s < seenList.length; s++) seen[seenList[s]] = 1;
    var all = frameworks();
    for (var j = 0; j < all.length; j++) {
      if (!inOrder[all[j].id] && !seen[all[j].id]) add(all[j].id);
    }
    // Tier 3 — the rest (in frameworks index order)
    for (var k = 0; k < all.length; k++) add(all[k].id);

    // Recency de-prioritization (NOT removal — a round always assembles 5)
    var recent = Object.create(null);
    for (var r = 0; r < recentCardViews.length; r++) recent[recentCardViews[r]] = 1;
    var front = [], back = [];
    for (var o = 0; o < order.length; o++) {
      if (recent[order[o]]) back.push(order[o]); else front.push(order[o]);
    }
    return front.concat(back);
  }

  // Build a fresh 5-question round object (in-memory). Pure content, ordered
  // selection. today() is captured ONCE so scenario-seed and grade share it.
  function buildRoundObject() {
    var ds = today();
    var ids = orderedCandidates(ds).slice(0, 5);
    var questions = [];
    for (var i = 0; i < ids.length; i++) {
      var fw = frameworkById(ids[i]);
      if (fw) questions.push(buildQuestion(fw, ds));
    }
    return { questions: questions, index: 0, answers: [], complete: false, roundRecorded: false };
  }

  // Public helper: the pure round content for a given date (tests/inspection).
  function buildRound(dateStr) {
    var ds = typeof dateStr === "string" && dateStr ? dateStr : today();
    var ids = orderedCandidates(ds).slice(0, 5);
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var fw = frameworkById(ids[i]);
      if (fw) out.push(buildQuestion(fw, ds));
    }
    return out;
  }

  /* ========================================================================
     Local stats (pdb.quiz via PDB_STORE) — corrupt-safe (§2.2, B64).
     ======================================================================== */
  function emptyStats() {
    return { roundsPlayed: 0, totalQuestions: 0, totalCorrect: 0, seen: [] };
  }
  function intOr(v, d) {
    return (typeof v === "number" && isFinite(v) && (v | 0) === v && v >= 0) ? v : d;
  }
  function readRaw() {
    var store = root.PDB_STORE;
    if (store && typeof store.get === "function") return store.get(QUIZ_KEY);
    try { return root.localStorage ? root.localStorage.getItem(QUIZ_KEY) : null; }
    catch (e) { return null; }
  }
  function readStats() {
    var raw = readRaw();
    if (!raw) return emptyStats();
    try {
      var p = JSON.parse(raw);
      if (!p || typeof p !== "object" || Array.isArray(p)) return emptyStats();
      var seen = [];
      if (Array.isArray(p.seen)) {
        for (var i = 0; i < p.seen.length; i++) {
          if (typeof p.seen[i] === "string" && seen.indexOf(p.seen[i]) === -1) seen.push(p.seen[i]);
        }
      }
      return {
        roundsPlayed: intOr(p.roundsPlayed, 0),
        totalQuestions: intOr(p.totalQuestions, 0),
        totalCorrect: intOr(p.totalCorrect, 0),
        seen: seen
      };
    } catch (e) { return emptyStats(); }
  }
  function writeStats(s) {
    var store = root.PDB_STORE;
    var str = JSON.stringify(s);
    if (store && typeof store.set === "function") { store.set(QUIZ_KEY, str); return; }
    try { if (root.localStorage) root.localStorage.setItem(QUIZ_KEY, str); }
    catch (e) { /* blocked — never throw */ }
  }
  function recordAnswer(fwId, correct) {
    var s = readStats();
    s.totalQuestions++;
    if (correct) s.totalCorrect++;
    if (fwId && s.seen.indexOf(fwId) === -1) s.seen.push(fwId);
    writeStats(s);
  }
  function recordRoundComplete() {
    var s = readStats();
    s.roundsPlayed++;
    writeStats(s);
  }
  function accuracyPct(s) {
    if (!s || !s.totalQuestions) return null;
    return Math.round((s.totalCorrect / s.totalQuestions) * 100);
  }

  /* ========================================================================
     Recency buffer population (§2.5) — a hashchange listener pushing #/f/:id.
     ======================================================================== */
  function noteHash() {
    var h = root.location ? (root.location.hash || "") : "";
    var m = h.match(/^#\/f\/(.+)$/);
    if (!m) return;
    var id;
    try { id = decodeURIComponent(m[1].split(/[?#]/)[0]).trim(); }
    catch (e) { id = m[1].split(/[?#]/)[0].trim(); }
    if (!frameworkById(id)) return;
    // drop any prior occurrence, push to the end, cap at N
    var idx = recentCardViews.indexOf(id);
    if (idx !== -1) recentCardViews.splice(idx, 1);
    recentCardViews.push(id);
    while (recentCardViews.length > RECENCY_N) recentCardViews.shift();
  }

  /* ========================================================================
     Rendering (text-only DOM). The in-progress round is a MODULE variable so a
     mid-round nav to a card link and back RESUMES the same round; a full reload
     starts null → the quiz start state (§2.6). All persistence (SRS grade +
     pdb.quiz tally + roundsPlayed++) lives in EVENT HANDLERS, never in a render
     path, so resuming never double-counts.
     ======================================================================== */
  var round = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function clear(mount) { if (mount) mount.textContent = ""; }
  function focusIn(mount, sel) {
    if (!mount) return;
    var t = mount.querySelector(sel);
    if (t) { try { t.focus(); } catch (e) { /* best-effort */ } }
  }

  function statsStrip(s) {
    var strip = el("div", "quiz-stats");
    if (!s || !s.totalQuestions) {
      strip.appendChild(el("p", "quiz-stats-empty",
        "No rounds yet — play your first to see your accuracy here."));
      return strip;
    }
    var rp = el("div", "quiz-stat");
    rp.appendChild(el("span", "quiz-stat-value", String(s.roundsPlayed)));
    rp.appendChild(el("span", "quiz-stat-label", s.roundsPlayed === 1 ? "round played" : "rounds played"));
    strip.appendChild(rp);
    var ac = el("div", "quiz-stat");
    ac.appendChild(el("span", "quiz-stat-value", accuracyPct(s) + "%"));
    ac.appendChild(el("span", "quiz-stat-label", "accuracy"));
    strip.appendChild(ac);
    return strip;
  }

  function renderStart(mount) {
    var wrap = el("div", "quiz-start");
    wrap.appendChild(el("p", "quiz-intro",
      "Read a real situation and pick which of four frameworks fits. Five quick questions — a way to see what's actually sticking."));
    wrap.appendChild(statsStrip(readStats()));
    var btn = el("button", "quiz-btn quiz-btn--primary quiz-start-btn", "Start round");
    btn.setAttribute("type", "button");
    btn.addEventListener("click", function () {
      round = buildRoundObject();
      draw(mount);
      focusIn(mount, ".quiz-progress");
    });
    wrap.appendChild(btn);
    mount.appendChild(wrap);
  }

  function renderQuestion(mount) {
    var q = round.questions[round.index];
    var ans = round.answers[round.index] || null;
    var view = el("div", "quiz-question");

    var progress = el("p", "quiz-progress", "Question " + (round.index + 1) + " of 5");
    progress.setAttribute("tabindex", "-1"); // focus target on the Next transition
    view.appendChild(progress);
    var stem = el("p", "quiz-stem", q.stem);
    view.appendChild(stem);

    var opts = el("div", "quiz-options");
    q.options.forEach(function (id) {
      var fw = frameworkById(id);
      var b = el("button", "quiz-option", fw ? fw.name : id);
      b.setAttribute("type", "button");
      if (ans) {
        b.disabled = true;
        if (id === q.correctId) b.classList.add("quiz-option--correct");
        if (id === ans.chosenId && !ans.correct) b.classList.add("quiz-option--wrong");
        if (id === ans.chosenId) b.setAttribute("aria-label", (fw ? fw.name : id) + " — your answer");
      } else {
        b.addEventListener("click", function () { answer(mount, id); });
      }
      opts.appendChild(b);
    });
    view.appendChild(opts);

    var live = el("div", "quiz-live");
    live.setAttribute("aria-live", "polite");
    view.appendChild(live);

    if (ans) {
      appendFeedback(view, live, q, ans, mount);
    }
    mount.appendChild(view);
  }

  function appendFeedback(view, live, q, ans, mount) {
    var fw = frameworkById(q.correctId);
    var fb = el("div", "quiz-feedback");
    var head = el("p", "quiz-feedback-head " +
      (ans.correct ? "quiz-feedback-head--correct" : "quiz-feedback-head--wrong"),
      ans.correct ? "Correct" : "Not quite");
    head.setAttribute("tabindex", "-1");
    fb.appendChild(head);
    if (fw) {
      fb.appendChild(el("p", "quiz-feedback-name", fw.name));
      fb.appendChild(el("p", "quiz-feedback-essence", fw.essence));
      var link = el("a", "quiz-card-link", "Open the " + fw.name + " card →");
      link.setAttribute("href", q.cardHref);
      link.setAttribute("aria-label", "Open the " + fw.name + " card");
      fb.appendChild(link);
    }
    var isLast = round.index === round.questions.length - 1;
    var next = el("button", "quiz-btn quiz-btn--primary quiz-next",
      isLast ? "See results →" : "Next question →");
    next.setAttribute("type", "button");
    next.addEventListener("click", function () {
      if (isLast) {
        completeRound();
        draw(mount);
        focusIn(mount, ".quiz-summary-head");
      } else {
        round.index++;
        draw(mount);
        focusIn(mount, ".quiz-progress");
      }
    });
    fb.appendChild(next);
    view.appendChild(fb);
    // announce the result to AT (content changes after initial paint)
    live.textContent = ans.correct
      ? "Correct — " + (fw ? fw.name : "") + "."
      : "Not quite — the answer was " + (fw ? fw.name : "") + ".";
  }

  // The ONE place side effects happen (§2.6 / advisor #2): SRS grade + stats
  // tally + record the outcome in round.answers. Renders never write.
  function answer(mount, chosenId) {
    if (!round || round.complete) return;
    var q = round.questions[round.index];
    if (round.answers[round.index]) return; // already answered (idempotent)
    var correct = chosenId === q.correctId;
    round.answers[round.index] = { chosenId: chosenId, correct: correct };

    var srs = root.PDB_SRS;
    if (srs && typeof srs.grade === "function") srs.grade(q.correctId, correct);
    recordAnswer(q.correctId, correct);

    draw(mount);
    focusIn(mount, ".quiz-feedback-head");
  }

  function completeRound() {
    if (!round) return;
    if (!round.roundRecorded) {
      round.roundRecorded = true;
      recordRoundComplete();
    }
    round.complete = true;
  }

  function renderSummary(mount) {
    var correctCount = 0;
    for (var i = 0; i < round.answers.length; i++) {
      if (round.answers[i] && round.answers[i].correct) correctCount++;
    }
    var wrap = el("div", "quiz-summary");
    var head = el("h3", "quiz-summary-head", "You recalled " + correctCount + " of 5");
    head.setAttribute("tabindex", "-1");
    wrap.appendChild(head);
    wrap.appendChild(statsStrip(readStats()));
    var again = el("button", "quiz-btn quiz-btn--primary", "Play another round");
    again.setAttribute("type", "button");
    again.addEventListener("click", function () {
      round = buildRoundObject();
      draw(mount);
      focusIn(mount, ".quiz-progress");
    });
    wrap.appendChild(again);
    var back = el("a", "quiz-back-link", "Back to Today");
    back.setAttribute("href", "#/today");
    wrap.appendChild(back);
    mount.appendChild(wrap);
  }

  function draw(mount) {
    if (!mount) return mount;
    clear(mount);
    if (round && round.complete) {
      renderSummary(mount);
    } else if (round && round.questions && round.questions.length) {
      renderQuestion(mount);
    } else {
      renderStart(mount);
    }
    return mount;
  }

  // Public render entry (app.js calls this on every nav to #/quiz).
  function render(mount) { return draw(mount); }

  // The additive Today "Test your recall" entry card (§2.1).
  function renderEntry(mount) {
    if (!mount) return mount;
    clear(mount);
    var card = el("div", "quiz-entry-card");
    card.appendChild(el("h3", "quiz-entry-title", "Test your recall"));
    card.appendChild(el("p", "quiz-entry-body",
      "Read a real situation and pick which of four frameworks fits — a quick way to see what's sticking."));
    var s = readStats();
    if (s.totalQuestions) card.appendChild(statsStrip(s));
    var link = el("a", "quiz-entry-link", "Start a quiz round →");
    link.setAttribute("href", "#/quiz");
    card.appendChild(link);
    mount.appendChild(card);
    return mount;
  }

  // Register the recency listener once (empty buffer at load keeps determinism
  // tests starting fresh unaffected).
  if (root.addEventListener) {
    root.addEventListener("hashchange", noteHash);
  }

  root.PDB_QUIZ = {
    RECENCY_N: RECENCY_N,
    // pure selectors (the headline determinism surface)
    seed: seed,
    pickScenario: pickScenario,
    pickDistractors: pickDistractors,
    buildQuestion: buildQuestion,
    buildRound: buildRound,
    redact: redact,
    // stats
    readStats: readStats,
    // render
    render: render,
    renderEntry: renderEntry,
    // test/inspection hooks
    _recentCardViews: recentCardViews,
    _tables: { SHORT_FORMS: SHORT_FORMS, VISUAL_HEAD_NOUNS: VISUAL_HEAD_NOUNS, SIGNATURE_TERMS: SIGNATURE_TERMS },
    _round: function () { return round; },
    _resetRound: function () { round = null; }
  };
})(typeof window !== "undefined" ? window : this);
