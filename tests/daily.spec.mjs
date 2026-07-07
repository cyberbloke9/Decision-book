/* Self-check for Sprint 005 — Today daily card habit loop (rotation, applied, streak).
   Run: python3 -m http.server 4173 (project root), then: node tests/daily.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:4173";
let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

const N = 74;
const formulaId = (frameworks, y, m, d) => {
  const dn = Math.floor(Date.UTC(y, m - 1, d) / 864e5);
  return frameworks[(((dn % N) + N) % N)].id;
};

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const errors = [];
  const newPage = async () => {
    const p = await ctx.newPage();
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    return p;
  };
  // Page whose date (and optionally theme) is injected before every load.
  const datedPage = async (date, opts = {}) => {
    const p = await newPage();
    await p.addInitScript((cfg) => {
      if (cfg.date) window.__PDB_NOW__ = cfg.date;
      try { if (cfg.theme) localStorage.setItem("pdb.theme", cfg.theme); } catch (e) {}
    }, { date, theme: opts.theme || null });
    return p;
  };

  /* ---- 1. Daily card renders (B16) ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const screen = document.querySelector("#screen-today");
      const mount = document.querySelector("#today-mount");
      const wrap = mount && mount.querySelector("[data-framework-id]");
      const card = wrap && wrap.querySelector(".card");
      const btn = mount && mount.querySelector("button.applied-toggle");
      // Six-part card = header + trigger + figure(visual) + essence + example
      // + pitfalls + prompt (steps optional). Assert the essential sections.
      const has = (sel) => !!(card && card.querySelector(sel));
      const sixParts = has(".card-header") && has(".card-trigger") && has(".card-figure") &&
        has(".card-essence") && has(".card-example") && has(".card-pitfalls") && has(".card-prompt");
      return {
        noPlaceholder: !screen.textContent.includes("No card yet today"),
        fid: wrap ? wrap.getAttribute("data-framework-id") : null,
        sixParts,
        hasBtn: !!btn,
        hasStreak: !!(mount && mount.querySelector(".streak-chip"))
      };
    });
    log(r.noPlaceholder, "Today: placeholder 'No card yet today' gone");
    log(!!r.fid, "Today: card container has data-framework-id", r.fid || "");
    log(r.sixParts, "Today: card renders the six-part body (header/trigger/visual/essence/example/pitfalls/prompt)");
    log(r.hasBtn, "Today: habit bar has an 'applied it' button");
    log(r.hasStreak, "Today: habit bar has a streak indicator");
    await p.close();
  }

  /* ---- 2 & 3. Determinism: same date same fw; date advance differs ---- */
  let idA = null;
  {
    const pA = await datedPage("2026-07-06");
    await pA.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    idA = await pA.evaluate(() => document.querySelector("#today-mount [data-framework-id]").getAttribute("data-framework-id"));
    await pA.reload({ waitUntil: "networkidle" });
    const idAreload = await pA.evaluate(() => document.querySelector("#today-mount [data-framework-id]").getAttribute("data-framework-id"));
    log(idA && idA === idAreload, "determinism: same date ⇒ same framework across reload", `${idA} vs ${idAreload}`);
    const inPage = await pA.evaluate(() => {
      const D = window.PDB_DATA, DA = window.PDB_DAILY;
      const dn = Math.floor(Date.UTC(2026, 6, 6) / 864e5);
      return {
        api: DA.dailyFramework("2026-07-06").id,
        formula: D.frameworks[(((dn % 74) + 74) % 74)].id,
        todayStr: DA.today()
      };
    });
    log(inPage.api === idA && inPage.formula === idA, "determinism: dailyFramework + modulo formula agree with DOM", `${inPage.api}/${inPage.formula}`);
    log(inPage.todayStr === "2026-07-06", "single date source: today() === injected date");
    await pA.close();

    const pB = await datedPage("2026-07-07");
    await pB.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const idB = await pB.evaluate(() => document.querySelector("#today-mount [data-framework-id]").getAttribute("data-framework-id"));
    log(idB && idB !== idA, "determinism: next calendar day ⇒ different framework", `${idA} → ${idB}`);
    await pB.close();

    // Re-inject earlier date ⇒ original framework
    const pC = await datedPage("2026-07-06");
    await pC.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const idC = await pC.evaluate(() => document.querySelector("#today-mount [data-framework-id]").getAttribute("data-framework-id"));
    log(idC === idA, "determinism: re-inject earlier date ⇒ original framework");
    // spot-check a run of consecutive days: each adjacent pair differs
    const adj = await pC.evaluate(() => {
      const DA = window.PDB_DAILY;
      const days = ["2026-07-01","2026-07-02","2026-07-03","2026-07-04","2026-07-05","2026-07-06","2026-07-07","2026-07-08"];
      const ids = days.map((d) => DA.dailyFramework(d).id);
      let allDiffer = true;
      for (let i = 1; i < ids.length; i++) if (ids[i] === ids[i - 1]) allDiffer = false;
      return allDiffer;
    });
    log(adj, "determinism: 8 consecutive days each differ from neighbour");
    await pC.close();
  }

  /* ---- 4. Applied toggle + persistence (B17) ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.evaluate(() => { try { localStorage.removeItem("pdb.applied"); } catch (e) {} });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const before = await p.evaluate(() => {
      const btn = document.querySelector("button.applied-toggle");
      return { pressed: btn.getAttribute("aria-pressed"), streak: document.querySelector(".streak-chip-num").textContent };
    });
    log(before.pressed === "false", "applied: fresh state aria-pressed=false");
    log(before.streak === "0", "applied: fresh state streak shows 0");
    const starterCopy = await p.evaluate(() => document.querySelector(".habit-status-nudge").textContent.toLowerCase().includes("start your streak"));
    log(starterCopy, "applied: fresh state shows starter copy");

    await p.click("button.applied-toggle");
    const afterClick = await p.evaluate(() => ({
      pressed: document.querySelector("button.applied-toggle").getAttribute("aria-pressed"),
      streak: document.querySelector(".streak-chip-num").textContent,
      stored: localStorage.getItem("pdb.applied")
    }));
    log(afterClick.pressed === "true", "applied: after click aria-pressed=true (no reload)");
    log(afterClick.streak === "1", "applied: after click streak=1 live");
    let parsedOk = false;
    try { const a = JSON.parse(afterClick.stored); parsedOk = Array.isArray(a) && a.includes("2026-07-06"); } catch (e) {}
    log(parsedOk, "applied: localStorage['pdb.applied'] is a JSON array containing today", afterClick.stored || "");

    await p.reload({ waitUntil: "networkidle" });
    const afterReload = await p.evaluate(() => ({
      pressed: document.querySelector("button.applied-toggle").getAttribute("aria-pressed"),
      streak: document.querySelector(".streak-chip-num").textContent
    }));
    log(afterReload.pressed === "true" && afterReload.streak === "1", "applied: persists across reload (still true, streak 1)");

    await p.click("button.applied-toggle");
    const afterUn = await p.evaluate(() => ({
      pressed: document.querySelector("button.applied-toggle").getAttribute("aria-pressed"),
      streak: document.querySelector(".streak-chip-num").textContent
    }));
    log(afterUn.pressed === "false" && afterUn.streak === "0", "applied: un-apply toggles back to false, streak 0");
    await p.reload({ waitUntil: "networkidle" });
    const afterUnReload = await p.evaluate(() => document.querySelector("button.applied-toggle").getAttribute("aria-pressed"));
    log(afterUnReload === "false", "applied: un-apply persists across reload");
    await p.close();
  }

  /* ---- 5. Streak rule — pinned §1.4 examples ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const cases = [
      { seed: ["2026-07-04","2026-07-05","2026-07-06"], want: 3 },
      { seed: ["2026-07-04","2026-07-05"], want: 2 },
      { seed: ["2026-07-04","2026-07-06"], want: 1 },
      { seed: ["2026-07-03"], want: 0 },
      { seed: [], want: 0 }
    ];
    for (const c of cases) {
      const got = await p.evaluate((seed) => {
        localStorage.setItem("pdb.applied", JSON.stringify(seed));
        return window.PDB_DAILY.streak("2026-07-06");
      }, c.seed);
      log(got === c.want, `streak(${JSON.stringify(c.seed)}) === ${c.want}`, `got ${got}`);
    }
    // Rendered streak indicator matches after a re-render (seed 3-day run)
    const renderedMatch = await p.evaluate(() => {
      localStorage.setItem("pdb.applied", JSON.stringify(["2026-07-04","2026-07-05","2026-07-06"]));
      return null;
    });
    void renderedMatch;
    await p.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const domStreak = await p.evaluate(() => document.querySelector(".streak-chip-num").textContent);
    log(domStreak === "3", "streak: rendered indicator matches seeded 3-day run", `got ${domStreak}`);
    await p.close();
  }

  /* ---- 6. Corrupt / missing storage — no crash, non-negative int ---- */
  {
    const garbage = ['not json', '{"a":1}', '["2026-07-06", 42, "junk", null]'];
    for (const g of garbage) {
      const p = await datedPage("2026-07-06");
      await p.goto(BASE + "/", { waitUntil: "networkidle" });
      await p.evaluate((v) => localStorage.setItem("pdb.applied", v), g);
      await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
      const r = await p.evaluate(() => {
        const s = window.PDB_DAILY.streak(window.PDB_DAILY.today());
        return { streak: s, ok: Number.isInteger(s) && s >= 0, dom: !!document.querySelector("#today-mount .card") };
      });
      log(r.ok, `corrupt storage ${JSON.stringify(g)}: streak non-negative integer`, `got ${r.streak}`);
      log(r.dom, `corrupt storage ${JSON.stringify(g)}: today card still renders`);
      await p.close();
    }
    // The third case: only "2026-07-06" valid → streak 1
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.evaluate(() => localStorage.setItem("pdb.applied", '["2026-07-06", 42, "junk", null]'));
    const s = await p.evaluate(() => window.PDB_DAILY.streak("2026-07-06"));
    log(s === 1, "corrupt storage: junk entries ignored, valid date counted (streak 1)", `got ${s}`);
    await p.close();
  }

  /* ---- 7. Single date source: garbage injection falls through, never throws ---- */
  {
    const p = await newPage();
    await p.addInitScript(() => { window.__PDB_NOW__ = "garbage"; });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const t = window.PDB_DAILY.today();
      return { valid: /^\d{4}-\d{2}-\d{2}$/.test(t), hasCard: !!document.querySelector("#today-mount .card") };
    });
    log(r.valid, "single source: garbage __PDB_NOW__ falls through to a real YYYY-MM-DD date");
    log(r.hasCard, "single source: garbage injection still renders (no throw)");
    await p.close();
  }

  /* ---- 8. Reused card unchanged at #/f/:id; no duplicate h-framework ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      return {
        back: !!document.querySelector("#framework-mount .card-back"),
        h: !!document.querySelector("#framework-mount h2#h-framework"),
        promptLast: card && card.lastElementChild && card.lastElementChild.classList.contains("card-prompt"),
        sixParts: !!(card && card.querySelector(".card-trigger") && card.querySelector(".card-figure") &&
          card.querySelector(".card-essence") && card.querySelector(".card-example") &&
          card.querySelector(".card-pitfalls") && card.querySelector(".card-prompt"))
      };
    });
    log(r.back, "reused card #/f/:id: 'Back to Browse' link present");
    log(r.h, "reused card #/f/:id: <h2 id=h-framework> present");
    log(r.promptLast, "reused card #/f/:id: prompt is lastElementChild (B5)");
    log(r.sixParts, "reused card #/f/:id: six-part body intact");
    // Today card uses h-today-card, no back link, no duplicate h-framework
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const t = await p.evaluate(() => ({
      todayHeading: !!document.querySelector("#today-mount h2#h-today-card"),
      noBack: !document.querySelector("#today-mount .card-back"),
      dupFramework: document.querySelectorAll("#h-framework").length
    }));
    log(t.todayHeading, "today card: <h2 id=h-today-card> present");
    log(t.noBack, "today card: no back link");
    log(t.dupFramework <= 1, "no duplicate id=h-framework in the DOM", `count ${t.dupFramework}`);
    await p.close();
  }

  /* ---- 9. axe both themes (zero / applied / >0 streak states) ---- */
  for (const theme of ["dark", "light"]) {
    const p = await datedPage("2026-07-06", { theme });
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.evaluate(() => localStorage.removeItem("pdb.applied"));
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const scanZero = await new AxeBuilder({ page: p }).include("#screen-today").analyze();
    log(scanZero.violations.length === 0, `axe ${theme}: zero violations (zero-streak state)`, scanZero.violations.map((v) => v.id).join(","));
    // applied state
    await p.click("button.applied-toggle");
    const scanApplied = await new AxeBuilder({ page: p }).include("#screen-today").analyze();
    log(scanApplied.violations.length === 0, `axe ${theme}: zero violations (applied state)`, scanApplied.violations.map((v) => v.id).join(","));
    // >0 streak (seed a 3-day run then re-render)
    await p.evaluate(() => localStorage.setItem("pdb.applied", JSON.stringify(["2026-07-04","2026-07-05","2026-07-06"])));
    await p.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const scanStreak = await new AxeBuilder({ page: p }).include("#screen-today").analyze();
    log(scanStreak.violations.length === 0, `axe ${theme}: zero violations (>0 streak state)`, scanStreak.violations.map((v) => v.id).join(","));
    await p.close();
  }

  /* ---- keyboard operability ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.evaluate(() => localStorage.removeItem("pdb.applied"));
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await p.focus("button.applied-toggle");
    const focused = await p.evaluate(() => document.activeElement && document.activeElement.classList.contains("applied-toggle"));
    log(focused, "keyboard: applied button is focusable");
    await p.keyboard.press("Enter");
    const afterEnter = await p.evaluate(() => document.querySelector("button.applied-toggle").getAttribute("aria-pressed"));
    log(afterEnter === "true", "keyboard: Enter toggles applied on");
    await p.keyboard.press(" ");
    const afterSpace = await p.evaluate(() => document.querySelector("button.applied-toggle").getAttribute("aria-pressed"));
    log(afterSpace === "false", "keyboard: Space toggles applied off");
    const stillFocused = await p.evaluate(() => document.activeElement && document.activeElement.classList.contains("applied-toggle"));
    log(stillFocused, "keyboard: focus stays on the button after toggling");
    await p.close();
  }

  /* ---- 10. Tap target >= 44px ---- */
  {
    const p = await datedPage("2026-07-06");
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const box = await p.locator("button.applied-toggle").boundingBox();
    log(box && box.height >= 44 && box.width >= 44, "tap target: applied button >=44x44", box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "no box");
    await p.close();
  }

  /* ---- 11. No horizontal scroll at 375 & 320 (long name + multi-digit streak) ---- */
  {
    // pick the framework with the longest name to stress the layout
    const probe = await datedPage("2026-07-06");
    await probe.goto(BASE + "/", { waitUntil: "networkidle" });
    const longestDate = await probe.evaluate(() => {
      const D = window.PDB_DATA, DA = window.PDB_DAILY;
      let best = null, bestLen = -1;
      // find a date whose daily framework has the longest name (search a year)
      const base = Math.floor(Date.UTC(2026, 0, 1) / 864e5);
      for (let i = 0; i < 74; i++) {
        const fw = D.frameworks[i];
        if (fw.name.length > bestLen) { bestLen = fw.name.length; }
      }
      // map: find offset i where index === argmax
      let argmax = 0; bestLen = -1;
      for (let i = 0; i < 74; i++) { if (D.frameworks[i].name.length > bestLen) { bestLen = D.frameworks[i].name.length; argmax = i; } }
      const dn = base + ((argmax - ((base % 74) + 74) % 74) + 74) % 74;
      const d = new Date(dn * 864e5);
      const pad = (n) => (n < 10 ? "0" + n : "" + n);
      return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
    });
    await probe.close();

    const p = await datedPage(longestDate);
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    // multi-digit streak: seed a long run ending today
    await p.evaluate((dstr) => {
      const parse = (s) => { const y = +s.slice(0,4), m = +s.slice(5,7), d = +s.slice(8,10); return Math.floor(Date.UTC(y, m-1, d)/864e5); };
      const fmt = (n) => { const dt = new Date(n*864e5); const pad = (x)=>x<10?"0"+x:""+x; return dt.getUTCFullYear()+"-"+pad(dt.getUTCMonth()+1)+"-"+pad(dt.getUTCDate()); };
      const end = parse(dstr); const arr = [];
      for (let i = 0; i < 15; i++) arr.push(fmt(end - i));
      localStorage.setItem("pdb.applied", JSON.stringify(arr));
    }, longestDate);
    for (const w of [375, 320]) {
      await p.setViewportSize({ width: w, height: 700 });
      await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
      const noScroll = await p.evaluate(() =>
        document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
        document.body.scrollWidth <= window.innerWidth);
      const streakDigits = await p.evaluate(() => document.querySelector(".streak-chip-num").textContent.length);
      log(noScroll, `no h-scroll on #/today at ${w}px (long name '${longestDate}', ${streakDigits}-digit streak)`);
    }
    await p.setViewportSize({ width: 375, height: 667 });
    await p.close();
  }

  /* ---- 12. Offline regression (B20/§8) ---- */
  {
    const swSrc = readFileSync(resolve(HERE, "..", "sw.js"), "utf8");
    log(/CACHE\s*=\s*"pdb-shell-v9"/.test(swSrc), "sw.js CACHE === pdb-shell-v9");
    log(/js\/daily\.js/.test(swSrc), "sw.js precaches js/daily.js");
    log(/keys\.filter[\s\S]*caches\.delete/.test(swSrc), "sw.js activate purges old cache");

    const warm = await datedPage("2026-07-06");
    await warm.goto(BASE + "/", { waitUntil: "networkidle" });
    await warm.waitForFunction(async () => { const r = await navigator.serviceWorker.ready; return !!(r && r.active); });
    await ctx.setOffline(true);
    const cold = await datedPage("2026-07-06");
    await cold.goto(BASE + "/#/today", { waitUntil: "domcontentloaded" });
    await cold.waitForSelector("#today-mount .card", { timeout: 5000 }).catch(() => {});
    const offline = await cold.evaluate(() => {
      const card = document.querySelector("#today-mount .card");
      const btn = document.querySelector("button.applied-toggle");
      return { hasCard: !!card, hasBtn: !!btn };
    });
    log(offline.hasCard && offline.hasBtn, "offline: #/today renders daily card + habit bar from cache");
    if (offline.hasBtn) {
      const b0 = await cold.evaluate(() => document.querySelector("button.applied-toggle").getAttribute("aria-pressed"));
      await cold.click("button.applied-toggle");
      const b1 = await cold.evaluate(() => document.querySelector("button.applied-toggle").getAttribute("aria-pressed"));
      log(b0 !== b1, "offline: 'applied it' toggle mutates state from cache");
    }
    await cold.close();
    await warm.close();
    await ctx.setOffline(false);
  }

  /* ---- 13. Console cleanliness ---- */
  log(errors.length === 0, "zero console errors/warnings across the run", errors.slice(0, 6).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run();
