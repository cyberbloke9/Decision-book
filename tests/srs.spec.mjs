/* Self-check for v3.0 Sprint 003 — SRS mastery engine (Phase 13).
   The adversarial SRS-interval + Today-additivity suite (contract §13,
   B56–B60, B74). Run: python3 -m http.server 4173 (project root),
   then: node tests/srs.spec.mjs. Exits non-zero on any failure.
   Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
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

// UTC date math mirror (must match js/srs.js).
const dayNum = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 864e5);
};
const ymdFrom = (dn) => {
  const dt = new Date(dn * 864e5);
  const p = (n) => (n < 10 ? "0" + n : "" + n);
  return dt.getUTCFullYear() + "-" + p(dt.getUTCMonth() + 1) + "-" + p(dt.getUTCDate());
};
const addDays = (ymd, n) => ymdFrom(dayNum(ymd) + n);

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
  // Advance the injected clock without a full context reset (keeps localStorage).
  const setNow = async (p, ymd) => {
    await p.evaluate((d) => { window.__PDB_NOW__ = d; }, ymd);
  };

  /* ---- 1. Ladder walk (headline, B56/B57) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });

    // The day's framework F is unscheduled before any grade.
    const preF = await p.evaluate(() => {
      const F = window.PDB_DAILY.dailyFramework(window.PDB_DAILY.today()).id;
      return {
        F,
        get: window.PDB_SRS.get(F),
        isDue: window.PDB_SRS.isDue(F),
        raw: localStorage.getItem("pdb.srs")
      };
    });
    log(preF.get === null && preF.isDue === false && preF.raw === null,
      "framework unscheduled before first grade (B60)", JSON.stringify({ get: preF.get, raw: preF.raw }));

    // Entering "got it": stores intervalDays 1 / easeStep 0.
    const g1 = await p.evaluate((F) => window.PDB_SRS.grade(F, true), preF.F);
    log(g1 && g1.intervalDays === 1 && g1.easeStep === 0 &&
      g1.lastReviewedAt === "2026-07-10" && g1.due === "2026-07-11",
      "entering got-it → interval 1, step 0, due createdAt+1 (§2.2)", JSON.stringify(g1));

    // Walk the ladder at each due date. Expected intervalDays [1,4,12,30,90,90].
    const expectInterval = [4, 12, 30, 90, 90];
    const expectStep = [1, 2, 3, 4, 4];
    let dueDate = "2026-07-11"; // due after the entering grade
    const walk = [];
    for (let i = 0; i < expectInterval.length; i++) {
      await setNow(p, dueDate);
      const g = await p.evaluate((F) => window.PDB_SRS.grade(F, true), preF.F);
      walk.push(g);
      const okInterval = g.intervalDays === expectInterval[i];
      const okStep = g.easeStep === expectStep[i];
      const okLast = g.lastReviewedAt === dueDate;
      const okDue = g.due === addDays(dueDate, expectInterval[i]);
      log(okInterval && okStep && okLast && okDue,
        `got-it #${i + 2} → interval ${expectInterval[i]}, step ${expectStep[i]}, due=last+interval`,
        JSON.stringify(g));
      dueDate = g.due;
    }
    const intervalSeq = [g1.intervalDays].concat(walk.map((g) => g.intervalDays));
    log(JSON.stringify(intervalSeq) === JSON.stringify([1, 4, 12, 30, 90, 90]),
      "stored intervalDays sequence is exactly [1,4,12,30,90,90] (headline)", intervalSeq.join(","));

    // A single "again" at rung 90 resets to interval 1 / step 0.
    await setNow(p, "2026-12-01");
    const again = await p.evaluate((F) => window.PDB_SRS.grade(F, false), preF.F);
    log(again.intervalDays === 1 && again.easeStep === 0 &&
      again.lastReviewedAt === "2026-12-01" && again.due === "2026-12-02",
      "single 'again' resets to interval 1 / step 0, due=day+1 (B56)", JSON.stringify(again));

    // Reset survives a reload.
    await p.reload({ waitUntil: "networkidle" });
    const afterReload = await p.evaluate((F) => window.PDB_SRS.get(F), preF.F);
    log(afterReload && afterReload.intervalDays === 1 && afterReload.easeStep === 0,
      "the reset survives a full reload (persistence)", JSON.stringify(afterReload));

    log(errors.length === 0, "zero console errors/warnings across the ladder walk", errors.join(" | "));
    await done(p);
  }

  /* ---- 2. Unscheduled 'again' enters at rung 0 ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const F = window.PDB_DATA.frameworks[0].id;
      const before = window.PDB_SRS.get(F);
      const g = window.PDB_SRS.grade(F, false);
      return { before, g };
    });
    log(r.before === null && r.g && r.g.intervalDays === 1 && r.g.easeStep === 0 && r.g.due === "2026-07-11",
      "unscheduled 'again' enters at rung 0 (interval 1, due day+1)", JSON.stringify(r.g));
    await done(p);
  }

  /* ---- 3. grade(unknown id) → null no-op; no pdb.srs write ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const out = window.PDB_SRS.grade("no-such-framework-xyz", true);
      return { out, raw: localStorage.getItem("pdb.srs") };
    });
    log(r.out === null && r.raw === null, "grade(unknown id) → null no-op, no pdb.srs write (§2.4)", JSON.stringify(r));
    await done(p);
  }

  /* ---- 4. due() ordering + tie-break + hard cap (B59) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-20");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    // Seed 4 frameworks due with DISTINCT due dates + a tie pair for the index
    // tie-break. Frameworks index 5,6 share a due date to prove tie-break order.
    const seed = await p.evaluate(() => {
      const fw = window.PDB_DATA.frameworks;
      const map = {};
      const mk = (id, due, last, step) => ({ lastReviewedAt: last, intervalDays: [1,4,12,30,90][step], due, easeStep: step });
      // Distinct due dates, intentionally out of index order:
      map[fw[3].id] = mk(fw[3].id, "2026-07-18", "2026-07-14", 1); // oldest
      map[fw[1].id] = mk(fw[1].id, "2026-07-19", "2026-07-15", 1);
      map[fw[8].id] = mk(fw[8].id, "2026-07-20", "2026-07-16", 1);
      // Tie pair on 2026-07-17 (both due <= today): fw[6] then fw[5] by index.
      map[fw[6].id] = mk(fw[6].id, "2026-07-17", "2026-07-13", 1);
      map[fw[5].id] = mk(fw[5].id, "2026-07-17", "2026-07-13", 1);
      window.PDB_STORE.set("pdb.srs", JSON.stringify(map));
      return {
        due: window.PDB_SRS.due("2026-07-20"),
        expectTie: [fw[5].id, fw[6].id]
      };
    });
    // Full due order: 07-17 tie (fw5<fw6 by index), 07-18 fw3, 07-19 fw1, 07-20 fw8
    log(seed.due.length === 5, "due() returns all 5 due ids", seed.due.join(","));
    log(seed.due[0] === seed.expectTie[0] && seed.due[1] === seed.expectTie[1],
      "same due-date tie broken by ascending frameworks index", seed.due.slice(0, 2).join(","));
    const oldestFirst = seed.due.map((id) => id); // already sorted oldest-first by contract

    // Re-render the Today screen now that pdb.srs is seeded.
    await p.evaluate(() => { location.hash = "#/situations"; location.hash = "#/today"; });
    await p.waitForSelector("#srs-mount .srs-shelf-row");

    // Render: shelf shows EXACTLY 3, oldest-due first.
    const shelf = await p.evaluate(() => {
      const rows = [...document.querySelectorAll("#srs-mount .srs-shelf-row")];
      return rows.map((r) => r.querySelector(".srs-shelf-name").getAttribute("href"));
    });
    log(shelf.length === 3, "shelf renders exactly 3 rows (hard cap 3)", "len=" + shelf.length);
    const wantTop3 = oldestFirst.slice(0, 3).map((id) => "#/f/" + id);
    log(JSON.stringify(shelf) === JSON.stringify(wantTop3),
      "shelf rows are the 3 oldest-due, in order", shelf.join(",") + " vs " + wantTop3.join(","));

    // Grade the top row 'Got it' → it advances into the future and leaves the
    // shelf; a 4th due framework appears (still cap 3).
    await p.click("#srs-mount .srs-shelf-row:first-child .srs-grade-got");
    const shelf2 = await p.evaluate(() => {
      const rows = [...document.querySelectorAll("#srs-mount .srs-shelf-row")];
      return {
        hrefs: rows.map((r) => r.querySelector(".srs-shelf-name").getAttribute("href")),
        focus: document.activeElement && document.activeElement.className
      };
    });
    log(shelf2.hrefs.length === 3 && shelf2.hrefs[0] !== wantTop3[0],
      "after grading top row it leaves the shelf, next due fills to 3", shelf2.hrefs.join(","));
    log(/srs-shelf-heading/.test(shelf2.focus || ""),
      "focus lands on a stable target (shelf heading) after grading a row", shelf2.focus);
    log(errors.length === 0, "zero console errors across the shelf flow", errors.join(" | "));
    await done(p);
  }

  /* ---- 5. Empty state + unscheduled start (B60) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      empty: /Nothing due/.test(document.querySelector("#srs-mount .srs-shelf-empty")?.textContent || ""),
      dailyPresent: !!document.querySelector("#srs-mount .srs-daily"),
      getAny: window.PDB_SRS.get(window.PDB_DATA.frameworks[10].id),
      isDueAny: window.PDB_SRS.isDue(window.PDB_DATA.frameworks[10].id),
      raw: localStorage.getItem("pdb.srs")
    }));
    log(r.empty && r.dailyPresent, "empty shelf shows designed resting copy; daily control still present (B60)");
    log(r.getAny === null && r.isDueAny === false && r.raw === null,
      "all frameworks unscheduled on fresh storage (pdb.srs absent)", JSON.stringify({ raw: r.raw }));
    log(errors.length === 0, "zero console errors on empty Today", errors.join(" | "));
    await done(p);
  }

  /* ---- 6. Same-day re-grade guard (no rung inflation) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    // Grade the daily framework via the UI control.
    await p.click("#srs-mount .srs-daily .srs-grade-got");
    const afterGrade = await p.evaluate(() => {
      const F = window.PDB_DAILY.dailyFramework(window.PDB_DAILY.today()).id;
      return {
        interval: window.PDB_SRS.get(F).intervalDays,
        graded: !!document.querySelector("#srs-mount .srs-daily .srs-graded"),
        noButtons: !document.querySelector("#srs-mount .srs-daily .srs-grade"),
        focus: document.activeElement && document.activeElement.className
      };
    });
    log(afterGrade.interval === 1, "daily grade → interval 1", "iv=" + afterGrade.interval);
    log(afterGrade.graded && afterGrade.noButtons,
      "control shows graded state (no buttons) same day (§2.5a guard)");
    log(/srs-graded/.test(afterGrade.focus || ""),
      "focus lands on the graded confirmation line after grading the daily control", afterGrade.focus);

    // Reload same day → still graded, interval still 1 (no inflation possible).
    await p.reload({ waitUntil: "networkidle" });
    const afterReload = await p.evaluate(() => {
      const F = window.PDB_DAILY.dailyFramework(window.PDB_DAILY.today()).id;
      return {
        interval: window.PDB_SRS.get(F).intervalDays,
        graded: !!document.querySelector("#srs-mount .srs-daily .srs-graded")
      };
    });
    log(afterReload.interval === 1 && afterReload.graded,
      "reload same day → still graded, interval stays 1 (no same-day inflation)", JSON.stringify(afterReload));
    log(errors.length === 0, "zero console errors across same-day guard flow", errors.join(" | "));
    await done(p);
  }

  /* ---- 7. Corrupt pdb.srs → all-unscheduled, no crash/console error ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => {
      try { localStorage.setItem("pdb.srs", "{not json"); } catch (e) {}
    });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      all: window.PDB_SRS.all(),
      empty: /Nothing due/.test(document.querySelector("#srs-mount .srs-shelf-empty")?.textContent || ""),
      daily: !!document.querySelector("#srs-mount .srs-daily")
    }));
    log(r.all && Object.keys(r.all).length === 0, "corrupt pdb.srs → all() is {} (unscheduled)");
    log(r.empty && r.daily, "corrupt pdb.srs → empty shelf + daily control, no crash");
    log(errors.length === 0, "zero console errors with corrupt pdb.srs (§6)", errors.join(" | "));
    await done(p);
  }

  /* ---- 7b. Value with NO valid due (or non-object) → unscheduled (§2.1) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => {
      try {
        localStorage.setItem("pdb.srs", JSON.stringify({
          "eisenhower-matrix": { lastReviewedAt: "2026-07-09", intervalDays: 4, easeStep: 1 }, // no valid due
          "swot": 42,          // non-object value
          "pareto-principle": { due: "not-a-date" } // invalid due string
        }));
      } catch (e) {}
    });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      a: window.PDB_SRS.get("eisenhower-matrix"),
      b: window.PDB_SRS.get("swot"),
      c: window.PDB_SRS.get("pareto-principle"),
      count: Object.keys(window.PDB_SRS.all()).length
    }));
    log(r.a === null && r.b === null && r.c === null && r.count === 0,
      "values with no valid due / non-object → treated as unscheduled (§2.1)", JSON.stringify(r));
    log(errors.length === 0, "zero console errors with no-due / non-object values", errors.join(" | "));
    await done(p);
  }

  /* ---- 7c. Fail-open: a MINIMAL {due}-only seed renders + is sanitized ----
     Matches the Evaluator's §12.3 seed path (which may seed pdb.srs directly
     with just distinct due dates). A valid due is enough to schedule a row;
     secondary fields are sanitized to a ladder-consistent object. */
  {
    errors.length = 0;
    const p = await newPage("2026-07-20");
    await p.addInitScript(() => {
      try {
        localStorage.setItem("pdb.srs", JSON.stringify({
          "eisenhower-matrix": { due: "2026-07-18" },                    // minimal
          "swot": { due: "2026-07-19", easeStep: 9, intervalDays: 999 }   // bad secondaries
        }));
      } catch (e) {}
    });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const a = window.PDB_SRS.get("eisenhower-matrix");
      const b = window.PDB_SRS.get("swot");
      const INTERVALS = window.PDB_SRS.INTERVALS;
      const consistent = (s) => s && s.intervalDays === INTERVALS[s.easeStep] && s.easeStep >= 0 && s.easeStep <= 4;
      return {
        a, b,
        aConsistent: consistent(a),
        bConsistent: consistent(b),
        due: window.PDB_SRS.due("2026-07-20"),
        rows: [...document.querySelectorAll("#srs-mount .srs-shelf-row .srs-shelf-name")].map((n) => n.textContent)
      };
    });
    log(r.a && r.a.due === "2026-07-18" && r.aConsistent,
      "minimal {due} seed → scheduled + sanitized ladder-consistent (intervalDays===INTERVALS[easeStep])", JSON.stringify(r.a));
    log(r.b && r.b.due === "2026-07-19" && r.bConsistent,
      "bad-secondaries seed → due kept, easeStep/intervalDays sanitized", JSON.stringify(r.b));
    log(r.due.length === 2 && r.rows.length === 2, "both minimal-seeded frameworks appear on the shelf (fail-open, §12.3)", JSON.stringify(r.rows));
    log(errors.length === 0, "zero console errors with minimal seeds", errors.join(" | "));
    await done(p);
  }

  /* ---- 8. Daily-card additivity (R2 — the regression guard) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const tm = document.querySelector("#today-mount");
      const sm = document.querySelector("#srs-mount");
      const card = tm.querySelector("[data-framework-id] .card");
      return {
        habitBar: !!tm.querySelector(".habit-bar"),
        streakChip: !!tm.querySelector(".streak-chip"),
        streakNum: !!tm.querySelector(".streak-chip-num"),
        appliedToggle: !!tm.querySelector("button.applied-toggle"),
        cardEndsOnPrompt: !!(card && card.lastElementChild && card.lastElementChild.classList.contains("card-prompt")),
        srsInsideToday: !!tm.querySelector('[class*="srs-"]'),
        srsMountHasDeck: !!(sm && sm.querySelector(".srs-daily") && sm.querySelector(".srs-shelf")),
        // no SRS node reuses a daily-card class:
        srsReusesDaily: !!(sm && (sm.querySelector(".applied-toggle") || sm.querySelector(".streak-chip") ||
          sm.querySelector(".habit-bar") || sm.querySelector(".habit-status-nudge") || sm.querySelector(".streak-chip-num")))
      };
    });
    log(r.habitBar && r.streakChip && r.streakNum && r.appliedToggle,
      "daily card keeps its full habit-bar/streak/applied contract in #today-mount (R2)");
    log(r.cardEndsOnPrompt, "daily card still ends on .card-prompt (B5)");
    log(!r.srsInsideToday, "NO .srs-* node appears inside #today-mount");
    log(r.srsMountHasDeck, "SRS deck lives in #srs-mount");
    log(!r.srsReusesDaily, "SRS reuses no daily-card class (.applied-toggle/.streak-chip*/.habit-*)");

    // Toggle applied → streak still works exactly as before.
    const before = await p.evaluate(() => document.querySelector(".streak-chip-num").textContent);
    await p.click("button.applied-toggle");
    const after = await p.evaluate(() => ({
      pressed: document.querySelector("button.applied-toggle").getAttribute("aria-pressed"),
      streak: document.querySelector(".streak-chip-num").textContent
    }));
    log(after.pressed === "true" && after.streak !== before,
      "applied-toggle still updates the streak (daily loop intact)", `${before} → ${after.streak}`);
    log(errors.length === 0, "zero console errors on the Today additivity flow", errors.join(" | "));
    await done(p);
  }

  /* ---- 9. A11y (axe) both themes, shelf populated + empty + keyboard ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-20");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    // Seed a couple due so the shelf is populated for the a11y scan.
    await p.evaluate(() => {
      const fw = window.PDB_DATA.frameworks;
      const map = {};
      map[fw[2].id] = { lastReviewedAt: "2026-07-16", intervalDays: 4, due: "2026-07-20", easeStep: 1 };
      window.PDB_STORE.set("pdb.srs", JSON.stringify(map));
    });
    await p.evaluate(() => { location.hash = "#/situations"; });
    await p.evaluate(() => { location.hash = "#/today"; });
    await p.waitForSelector("#srs-mount .srs-shelf-row");

    // Emulate reduced motion so the global prefers-reduced-motion rule kills the
    // 160ms theme cross-fade transition — axe then samples the final (static)
    // colors with no timing race, AND this exercises the B78 reduced-motion path.
    await p.emulateMedia({ reducedMotion: "reduce" });
    for (const theme of ["dark", "light"]) {
      await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      const res = await new AxeBuilder({ page: p })
        .include("#srs-mount")
        .withRules(["color-contrast", "button-name", "link-name", "aria-allowed-attr", "aria-valid-attr"])
        .analyze();
      log(res.violations.length === 0, `axe clean on #srs-mount (populated, ${theme})`,
        res.violations.map((v) => v.id).join(","));
    }

    // Tap target sizes >= 44x44 on grade buttons.
    const boxes = await p.evaluate(() => {
      return [...document.querySelectorAll("#srs-mount .srs-grade")].map((b) => {
        const r = b.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
    });
    log(boxes.length > 0 && boxes.every((b) => b.w >= 44 && b.h >= 44),
      "every grade button is >= 44x44", JSON.stringify(boxes));

    // Keyboard: Tab to a grade button, activate with Enter, focus not lost.
    await p.evaluate(() => { document.querySelector("#srs-mount .srs-daily .srs-grade-got").focus(); });
    const focused = await p.evaluate(() => document.activeElement && document.activeElement.classList.contains("srs-grade-got"));
    await p.keyboard.press("Enter");
    const afterKey = await p.evaluate(() => ({
      graded: !!document.querySelector("#srs-mount .srs-daily .srs-graded"),
      focusInMount: !!document.querySelector("#srs-mount").contains(document.activeElement),
      bodyFocus: document.activeElement === document.body
    }));
    log(focused, "grade button is keyboard-focusable");
    log(afterKey.graded && afterKey.focusInMount && !afterKey.bodyFocus,
      "Enter grades and focus stays inside #srs-mount (not lost to body)", JSON.stringify(afterKey));
    await done(p);
  }

  /* ---- 10. No horizontal overflow at 375px and 320px ---- */
  {
    errors.length = 0;
    for (const w of [375, 320]) {
      const c = await browser.newContext({ viewport: { width: w, height: 667 } });
      const p = await c.newPage();
      await p.addInitScript(() => { window.__PDB_NOW__ = "2026-07-20"; });
      await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
      await p.evaluate(() => {
        const fw = window.PDB_DATA.frameworks;
        const map = {};
        map[fw[2].id] = { lastReviewedAt: "2026-07-16", intervalDays: 4, due: "2026-07-20", easeStep: 1 };
        window.PDB_STORE.set("pdb.srs", JSON.stringify(map));
        location.hash = "#/situations"; location.hash = "#/today";
      });
      await p.waitForSelector("#srs-mount .srs-shelf-row");
      const overflow = await p.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth);
      log(!overflow, `no horizontal overflow at ${w}px on Today with shelf`);
      await c.close();
    }
  }

  /* ---- 11. Legacy + sibling stores untouched (B42/B43) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => {
      localStorage.setItem("pdb.favorites", JSON.stringify(["swot", "eisenhower-matrix"]));
      localStorage.setItem("pdb.applied", JSON.stringify(["2026-07-09", "2026-07-10"]));
      localStorage.setItem("pdb.theme", "light");
      localStorage.setItem("pdb.journal", JSON.stringify([{ id: "j-x", createdAt: "2026-07-01", situation: "s", expectedOutcome: "e", reviewDate: "2026-10-01" }]));
    });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const before = await p.evaluate(() => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      journal: localStorage.getItem("pdb.journal")
    }));
    await p.evaluate(() => {
      const F = window.PDB_DATA.frameworks[0].id;
      window.PDB_SRS.grade(F, true);
      window.PDB_SRS.grade(window.PDB_DATA.frameworks[1].id, false);
    });
    const after = await p.evaluate(() => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      journal: localStorage.getItem("pdb.journal"),
      srs: localStorage.getItem("pdb.srs")
    }));
    log(before.fav === after.fav && before.applied === after.applied &&
      before.theme === after.theme && before.journal === after.journal,
      "grading leaves pdb.favorites/applied/theme/journal byte-identical (B42/B43)");
    log(after.srs && JSON.parse(after.srs), "only pdb.srs changed");
    await done(p);
  }

  /* ---- 12. Discipline grep on js/srs.js source ---- */
  {
    const src = readFileSync(resolve(ROOT, "js/srs.js"), "utf8");
    log(!/Math\.random/.test(src), "no Math.random in js/srs.js");
    // new Date(<string literal>) is forbidden; new Date(<number>) for epoch-day math is OK.
    log(!/new Date\(\s*['"`]/.test(src), "no new Date(<string>) parse in js/srs.js");
    log(!/https?:\/\//.test(src), "no remote http(s) URL in js/srs.js");
    log(!/\bfetch\s*\(/.test(src) && !/XMLHttpRequest/.test(src), "no fetch / XHR in js/srs.js");
    log(/INTERVALS\s*=\s*\[1,\s*4,\s*12,\s*30,\s*90\]/.test(src), "INTERVALS is the fixed ladder [1,4,12,30,90]");
  }

  console.log(`\nSRS spec: ${pass} passed, ${fail} failed`);
  await browser.close();
  if (fail > 0) process.exit(1);
};

run().catch((e) => { console.error(e); process.exit(1); });
