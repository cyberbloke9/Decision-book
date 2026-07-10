/* Self-check for v3.0 Sprint 004 — Reverse recall quiz (Phase 14).
   The adversarial determinism + redaction + SRS-feed + stats suite
   (contract §13, B61–B65, B74). Run: python3 -m http.server 4173 (project
   root), then: node tests/quiz.spec.mjs. Exits non-zero on any failure.
   Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const BASE = process.env.BASE || "http://localhost:4173";

let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

const run = async () => {
  const browser = await chromium.launch();
  const errors = [];
  const newPage = async (nowDate) => {
    const c = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const p = await c.newPage();
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    await p.addInitScript((d) => { if (d) window.__PDB_NOW__ = d; }, nowDate || null);
    return p;
  };
  const done = async (p) => { await p.context().close(); };

  /* ---- 0. Static discipline grep (no Math.random / new Date(str) / remote) ---- */
  {
    const src = readFileSync(resolve(ROOT, "js/quiz.js"), "utf8");
    log(!/Math\.random/.test(src), "no Math.random in js/quiz.js");
    // new Date(<number>) epoch arithmetic is permitted; a STRING parse is not.
    log(!/new Date\(\s*["'`]/.test(src) && !/new Date\(\s*[A-Za-z_$]/.test(src),
      "no new Date(<string>/<var>) in js/quiz.js");
    log(!/\bfetch\s*\(/.test(src) && !/XMLHttpRequest/.test(src) && !/https?:\/\/[^\s"'`]/.test(src),
      "no remote fetch / XHR / http(s) URL in js/quiz.js");
  }

  /* ---- 1. Round shape (B61) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const shape = await p.evaluate(() => {
      const D = window.PDB_DATA, Q = window.PDB_QUIZ;
      const round = Q.buildRound("2026-07-10");
      const ids = round.map((q) => q.frameworkId);
      const distinct = new Set(ids).size === ids.length;
      const perQ = round.map((q) => {
        const fw = D.byId(q.correctId);
        const opts = q.options;
        const distractors = opts.filter((o) => o !== q.correctId);
        return {
          fourOpts: opts.length === 4,
          hasCorrect: opts.indexOf(q.correctId) !== -1,
          threeDistinct: new Set(distractors).size === 3 && distractors.length === 3,
          sameCat: distractors.every((d) => { const df = D.byId(d); return df && df.category === fw.category; }),
          noSelf: distractors.indexOf(q.correctId) === -1
        };
      });
      return { len: round.length, distinct, perQ };
    });
    log(shape.len === 5, "a round has exactly 5 questions", JSON.stringify({ len: shape.len }));
    log(shape.distinct, "5 distinct frameworks in a round");
    log(shape.perQ.every((q) => q.fourOpts && q.hasCorrect && q.threeDistinct && q.sameCat && q.noSelf),
      "every question: 4 options = correct + 3 distinct same-category distractors, never self",
      JSON.stringify(shape.perQ));
    log(errors.length === 0, "round-shape build produced zero console errors", errors.join(" | "));
    await done(p);
  }

  /* ---- 2. Determinism (headline, B62) — pure, state-independent ---- */
  {
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const det = await p.evaluate(() => {
      const D = window.PDB_DATA, Q = window.PDB_QUIZ;
      function eq(a, b) {
        return a.stem === b.stem && a.scenarioRaw === b.scenarioRaw &&
          a.correctId === b.correctId &&
          a.options.length === b.options.length &&
          a.options.every((x, i) => x === b.options[i]);
      }
      // Eisenhower (matrix cat) + a decision-processes fw (4-framework category).
      const em = D.byId("eisenhower-matrix");
      const a1 = Q.buildQuestion(em, "2026-07-10");
      // mutate state BETWEEN calls: grade srs + write quiz stats + push recency
      window.PDB_SRS.grade("swot-analysis", false);
      Q._recentCardViews.push("eisenhower-matrix");
      const a2 = Q.buildQuestion(em, "2026-07-10");
      const dp = D.frameworks.find((f) => f.category === "decision-processes");
      const b1 = Q.buildQuestion(dp, "2026-07-10");
      const b2 = Q.buildQuestion(dp, "2026-07-10");
      // scenario index = seed % examples.length
      const idxOk = (() => {
        const i = Q.seed(em.id + "|" + "2026-07-10") % em.examples.length;
        return Q.pickScenario(em, "2026-07-10") === em.examples[i];
      })();
      // a different date MAY change but is itself reproducible
      const c1 = Q.buildQuestion(em, "2026-08-01");
      const c2 = Q.buildQuestion(em, "2026-08-01");
      return {
        emStable: eq(a1, a2),
        dpStable: eq(b1, b2),
        idxOk,
        dateReproducible: eq(c1, c2),
        correctNotAlwaysFirst: a1.options.indexOf(a1.correctId) !== 0 || b1.options.indexOf(b1.correctId) !== 0
      };
    });
    log(det.emStable, "buildQuestion identical across mutated state (Eisenhower)");
    log(det.dpStable, "buildQuestion identical for a decision-processes framework");
    log(det.idxOk, "pickScenario index = seed % examples.length");
    log(det.dateReproducible, "a different injected date is itself reproducible");
    log(det.correctNotAlwaysFirst, "correct answer is not fixed at option position 0");
    await done(p);
  }

  /* ---- 3. Redaction proxy for ALL 74 (B62/R10) + store immutability ---- */
  {
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const red = await p.evaluate(() => {
      const D = window.PDB_DATA, Q = window.PDB_QUIZ;
      const SF = Q._tables.SHORT_FORMS;
      let nameLeak = 0, labelLeak = 0, shortLeak = 0, empty = 0, unchanged = 0;
      let storeMutated = 0;
      D.frameworks.forEach((fw) => {
        fw.examples.forEach((ex, ei) => {
          const rawBefore = ex.scenario;
          const stem = Q.redact(ex.scenario, fw);
          const low = stem.toLowerCase();
          if (low.includes(fw.name.toLowerCase())) nameLeak++;
          const label = D.VISUAL_LABELS[fw.visualType];
          if (label && low.includes(label.toLowerCase())) labelLeak++;
          (SF[fw.id] || []).forEach((sf) => { if (sf && low.includes(sf.toLowerCase())) shortLeak++; });
          if (!stem) empty++;
          // store never mutated by building/redacting
          if (D.byId(fw.id).examples[ei].scenario !== rawBefore) storeMutated++;
        });
        // building a question doesn't mutate the store either
        Q.buildQuestion(fw, "2026-07-10");
      });
      // at least SOME stem differs from its raw where a token was masked
      const emQ = Q.buildQuestion(D.byId("eisenhower-matrix"), "2026-07-10");
      const differs = emQ.stem !== emQ.scenarioRaw;
      return { nameLeak, labelLeak, shortLeak, empty, storeMutated, differs };
    });
    log(red.nameLeak === 0, "no framework name appears in any built stem", "leaks=" + red.nameLeak);
    log(red.labelLeak === 0, "no VISUAL_LABELS term appears in any built stem", "leaks=" + red.labelLeak);
    log(red.shortLeak === 0, "no curated SHORT_FORMS token appears in any built stem", "leaks=" + red.shortLeak);
    log(red.empty === 0, "every built stem is non-empty");
    log(red.storeMutated === 0, "redaction is display-only — examples[].scenario unchanged");
    log(red.differs, "a stem differs from scenarioRaw when the raw contained a masked token");
    await done(p);
  }

  /* ---- 4. SRS feed (B63) via the DOM play path ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    // Start a round, answer Q1 WRONG (pick a distractor), assert srs reset.
    await p.click(".quiz-start-btn");
    const wrong = await p.evaluate(() => {
      const Q = window.PDB_QUIZ;
      const q = Q._round().questions[0];
      const distractor = q.options.find((o) => o !== q.correctId);
      // click the option button whose label is the distractor's name
      const name = window.PDB_DATA.byId(distractor).name;
      const btns = Array.from(document.querySelectorAll(".quiz-option"));
      const target = btns.find((b) => b.textContent === name);
      target.click();
      const sched = window.PDB_SRS.get(q.correctId);
      return { correctId: q.correctId, sched };
    });
    log(wrong.sched && wrong.sched.intervalDays === 1 && wrong.sched.easeStep === 0,
      "wrong answer resets the question framework srs to interval 1 / step 0 (B63)",
      JSON.stringify(wrong.sched));
    // Advance to Q2, answer CORRECT, assert advance from an already-scheduled state.
    const right = await p.evaluate(() => {
      const Q = window.PDB_QUIZ;
      // seed Q2's framework as already scheduled at step 0 so a correct → step 1
      document.querySelector(".quiz-next").click();
      const q = Q._round().questions[1];
      window.PDB_SRS.grade(q.correctId, true); // enter at step 0 (interval 1)
      // now answer correct in the DOM
      const name = window.PDB_DATA.byId(q.correctId).name;
      const btns = Array.from(document.querySelectorAll(".quiz-option"));
      const target = btns.find((b) => b.textContent === name);
      target.click();
      return { correctId: q.correctId, sched: window.PDB_SRS.get(q.correctId) };
    });
    log(right.sched && right.sched.easeStep === 1 && right.sched.intervalDays === 4,
      "correct answer advances the question framework one rung (step 0→1, interval 4)",
      JSON.stringify(right.sched));
    log(errors.length === 0, "SRS-feed play produced zero console errors", errors.join(" | "));
    await done(p);
  }

  /* ---- 5. Priority tiers (B62): due first; unseen before seen ---- */
  {
    const p = await newPage("2026-07-10");
    // Seed an SRS-due framework + a quiz-seen framework BEFORE load.
    await p.addInitScript(() => {
      localStorage.setItem("pdb.srs", JSON.stringify({
        "regret-minimization": { lastReviewedAt: "2026-07-01", intervalDays: 1, due: "2026-07-02", easeStep: 0 }
      }));
      localStorage.setItem("pdb.quiz", JSON.stringify({
        roundsPlayed: 1, totalQuestions: 5, totalCorrect: 3, seen: ["eisenhower-matrix"]
      }));
    });
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const prio = await p.evaluate(() => {
      const Q = window.PDB_QUIZ, D = window.PDB_DATA;
      const ids = Q.buildRound("2026-07-10").map((q) => q.frameworkId);
      // due framework present and first
      const dueFirst = ids[0] === "regret-minimization";
      // an unseen framework precedes the seen one among non-due candidates
      const seenIdx = ids.indexOf("eisenhower-matrix");
      // find an unseen framework's index that is before the seen one (if seen selected)
      return { ids, dueFirst, seenSelected: seenIdx !== -1, seenIdx };
    });
    log(prio.dueFirst, "SRS-due framework is selected first (Tier 1)", JSON.stringify(prio.ids));
    // eisenhower is seen → it should NOT be in the first 5 while 68 unseen remain
    log(!prio.seenSelected, "a quiz-seen framework is de-prioritized below unseen (Tier 2 before Tier 3)",
      JSON.stringify(prio.ids));
    await done(p);
  }

  /* ---- 6. Stats persistence + counts + corrupt-safe (B64) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    // Play a full round via the DOM: always pick the correct option so we know score.
    await p.click(".quiz-start-btn");
    const played = await p.evaluate(() => {
      const Q = window.PDB_QUIZ;
      for (let i = 0; i < 5; i++) {
        const q = Q._round().questions[i];
        const name = window.PDB_DATA.byId(q.correctId).name;
        const btn = Array.from(document.querySelectorAll(".quiz-option")).find((b) => b.textContent === name);
        btn.click();
        const next = document.querySelector(".quiz-next");
        next.click();
      }
      return JSON.parse(localStorage.getItem("pdb.quiz"));
    });
    log(played.totalQuestions === 5 && played.totalCorrect === 5,
      "after 5 correct answers: totalQuestions 5, totalCorrect 5", JSON.stringify(played));
    log(played.roundsPlayed === 1 && played.seen.length === 5,
      "roundsPlayed increments once on completion; seen has 5 ids", JSON.stringify(played));
    // summary rendered
    const summary = await p.evaluate(() => {
      const h = document.querySelector(".quiz-summary-head");
      return h ? h.textContent : null;
    });
    log(summary === "You recalled 5 of 5", "round-complete summary shows the score", summary);
    // persists through reload → start state shows stats
    await p.reload({ waitUntil: "networkidle" });
    const afterReload = await p.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem("pdb.quiz"));
      const startShown = !!document.querySelector(".quiz-start-btn");
      const statValue = document.querySelector(".quiz-stat-value");
      return { rounds: raw.roundsPlayed, startShown, statText: statValue ? statValue.textContent : null };
    });
    log(afterReload.rounds === 1 && afterReload.startShown,
      "stats survive reload; a full reload returns to the start state (round abandoned)",
      JSON.stringify(afterReload));
    log(errors.length === 0, "stats play produced zero console errors", errors.join(" | "));
    await done(p);

    // corrupt pdb.quiz → empty default, no crash
    errors.length = 0;
    const p2 = await newPage("2026-07-10");
    await p2.addInitScript(() => { localStorage.setItem("pdb.quiz", "{not json"); });
    await p2.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const corrupt = await p2.evaluate(() => {
      const s = window.PDB_QUIZ.readStats();
      const startShown = !!document.querySelector(".quiz-start-btn");
      const emptyCopy = !!document.querySelector(".quiz-stats-empty");
      return { s, startShown, emptyCopy };
    });
    log(corrupt.s.roundsPlayed === 0 && corrupt.s.totalQuestions === 0 && Array.isArray(corrupt.s.seen),
      "corrupt pdb.quiz → empty default (no throw)", JSON.stringify(corrupt.s));
    log(corrupt.startShown && corrupt.emptyCopy, "corrupt store still renders the start state cleanly");
    log(errors.length === 0, "corrupt-store load produced zero console errors", errors.join(" | "));
    await done(p2);
  }

  /* ---- 7. Legacy keys untouched by a round (B42/B43) ---- */
  {
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => {
      localStorage.setItem("pdb.favorites", JSON.stringify(["swot-analysis"]));
      localStorage.setItem("pdb.applied", JSON.stringify(["2026-07-09"]));
      localStorage.setItem("pdb.theme", "light");
      localStorage.setItem("pdb.testDate", "2026-07-10");
      localStorage.setItem("pdb.journal", JSON.stringify([]));
    });
    await p.goto(BASE + "/#/quiz", { waitUntil: "networkidle" });
    const before = await p.evaluate(() => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      testDate: localStorage.getItem("pdb.testDate"),
      journal: localStorage.getItem("pdb.journal")
    }));
    await p.click(".quiz-start-btn");
    await p.evaluate(() => {
      for (let i = 0; i < 5; i++) {
        const q = window.PDB_QUIZ._round().questions[i];
        const name = window.PDB_DATA.byId(q.correctId).name;
        const btn = Array.from(document.querySelectorAll(".quiz-option")).find((b) => b.textContent === name);
        btn.click();
        document.querySelector(".quiz-next").click();
      }
    });
    const after = await p.evaluate(() => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      testDate: localStorage.getItem("pdb.testDate"),
      journal: localStorage.getItem("pdb.journal"),
      quiz: localStorage.getItem("pdb.quiz"),
      srs: localStorage.getItem("pdb.srs")
    }));
    log(before.fav === after.fav && before.applied === after.applied &&
      before.theme === after.theme && before.testDate === after.testDate &&
      before.journal === after.journal,
      "a played round leaves pdb.favorites/applied/theme/testDate/journal byte-identical");
    log(after.quiz && after.srs, "only pdb.quiz and pdb.srs are written by the quiz");
    await done(p);
  }

  console.log(`\nquiz.spec: ${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail === 0 ? 0 : 1);
};

run().catch((e) => { console.error(e); process.exit(1); });
