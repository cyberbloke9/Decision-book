/* Self-check for v3.0 Sprint 001 — Storage & widget infrastructure (Phase 11).
   The adversarial store-migration + onSelect suite (contract §13, B41–B46, B74).
   Run: python3 -m http.server 4173 (project root), then: node tests/store.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const BASE = process.env.BASE || "http://localhost:4173";
const FID = "eisenhower-matrix"; // a real framework id with 5 personas + featured

let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const errors = [];
  const newPage = async () => {
    const p = await ctx.newPage();
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    // The context's localStorage is shared across pages (same origin) — clear it
    // on every load so each test starts fresh. Per-test seeding scripts are added
    // AFTER this one and run after it, so they still win.
    await p.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
    return p;
  };

  /* ---- 1. Migration byte-survival + schemaVersion (HEADLINE, B42/B43) ---- */
  {
    const fav = `["${FID}"]`;
    const applied = `["2026-07-08","2026-07-09","2026-07-10"]`;
    const p = await newPage();
    await p.addInitScript((seed) => {
      window.__PDB_NOW__ = "2026-07-10";
      try {
        localStorage.setItem("pdb.favorites", seed.fav);
        localStorage.setItem("pdb.applied", seed.applied);
        localStorage.setItem("pdb.theme", "light");
      } catch (e) {}
    }, { fav, applied });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });

    const r = await p.evaluate((seed) => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      htmlTheme: document.documentElement.getAttribute("data-theme"),
      schema: localStorage.getItem("pdb.schemaVersion"),
      isFav: window.PDB_FAV.isFavorite("eisenhower-matrix"),
      streak: window.PDB_DAILY.streak("2026-07-10"),
      hasStore: !!(window.PDB_STORE && typeof window.PDB_STORE.get === "function" &&
                   typeof window.PDB_STORE.set === "function" &&
                   typeof window.PDB_STORE.migrate === "function")
    }), { fav, applied });

    log(r.hasStore, "PDB_STORE exposes get/set/migrate (B41)");
    log(r.fav === fav, "pdb.favorites byte-identical after migration", `${r.fav}`);
    log(r.applied === applied, "pdb.applied byte-identical after migration", `${r.applied}`);
    log(r.theme === "light", "pdb.theme byte-identical after migration", `${r.theme}`);
    log(r.htmlTheme === "light", "theme still applied to <html data-theme>", `${r.htmlTheme}`);
    log(JSON.parse(r.schema) === 3, "pdb.schemaVersion === 3 after migration (B43)", `${r.schema}`);
    log(r.isFav === true, "seeded favorite still favorited (B43)");
    log(r.streak === 3, "seeded streak still computes to 3 (B43)", `${r.streak}`);
    log(errors.length === 0, "no console error/pageerror during migration load", errors.join(" | "));

    /* ---- 2. Idempotency: reload leaves the four legacy keys byte-identical ---- */
    await p.reload({ waitUntil: "networkidle" });
    const r2 = await p.evaluate(() => ({
      fav: localStorage.getItem("pdb.favorites"),
      applied: localStorage.getItem("pdb.applied"),
      theme: localStorage.getItem("pdb.theme"),
      schema: localStorage.getItem("pdb.schemaVersion")
    }));
    log(r2.fav === fav && r2.applied === applied && r2.theme === "light",
      "idempotent: four legacy keys byte-identical after 2nd load", `${r2.fav}|${r2.applied}|${r2.theme}`);
    log(JSON.parse(r2.schema) === 3, "idempotent: schemaVersion still 3 (not re-run destructively)", `${r2.schema}`);
    await p.close();
  }

  /* ---- 3. Storage disabled: PDB_STORE degrades to in-memory, never throws ---- */
  {
    errors.length = 0;
    const p = await newPage();
    await p.addInitScript(() => {
      // Make ANY localStorage access throw (private-mode / blocked simulation).
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() { throw new Error("localStorage blocked"); }
      });
    });
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const out = { threw: false, storeExists: false, roundtrip: false, rendered: false };
      out.storeExists = !!(window.PDB_STORE && typeof window.PDB_STORE.get === "function");
      try {
        window.PDB_STORE.set("pdb.__probe__", "hello");
        out.roundtrip = window.PDB_STORE.get("pdb.__probe__") === "hello"; // from mirror
        window.PDB_FAV.toggle("eisenhower-matrix"); // must not throw
        window.PDB_FAV.isFavorite("eisenhower-matrix");
      } catch (e) { out.threw = true; out.err = String(e); }
      out.rendered = !!document.querySelector("#today-mount [data-framework-id], #today-mount .habit-bar");
      return out;
    });
    log(r.storeExists, "storage-disabled: window.PDB_STORE still exists");
    log(!r.threw, "storage-disabled: set/get/PDB_FAV never throw (in-memory mirror)", r.err || "");
    log(r.roundtrip, "storage-disabled: set then get returns the value from the mirror");
    log(r.rendered, "storage-disabled: app still renders the Today screen");
    log(errors.filter((e) => e.startsWith("pageerror")).length === 0,
      "storage-disabled: no uncaught pageerror", errors.join(" | "));
    await p.close();
  }

  /* ---- 4. Read-through: get reads FRESH localStorage, not a stale mirror ---- */
  {
    errors.length = 0;
    const p = await newPage();
    await p.goto(BASE + "/#/", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      window.PDB_STORE.set("pdb.__rt__", "a");      // mirror + localStorage = "a"
      localStorage.setItem("pdb.__rt__", "b");        // external tab writes "b"
      return window.PDB_STORE.get("pdb.__rt__");      // must observe fresh "b"
    });
    log(r === "b", "read-through: get returns externally-written fresh value (no stale mirror)", `got ${r}`);
    await p.close();
  }

  /* ---- 5. Corrupt pdb.* degrades to empty, never a crash (B55 discipline) ---- */
  {
    errors.length = 0;
    const p = await newPage();
    await p.addInitScript(() => {
      try {
        localStorage.setItem("pdb.favorites", "{not json");
        localStorage.setItem("pdb.stats", "garbage");
      } catch (e) {}
    });
    await p.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      favAll: window.PDB_FAV.all().length,
      emptyShown: /No favorites yet/.test(document.querySelector("#screen-favorites").textContent)
    }));
    log(r.favAll === 0, "corrupt pdb.favorites → PDB_FAV.all() empty (no crash)", `len ${r.favAll}`);
    log(r.emptyShown, "corrupt pdb.favorites → favorites empty state renders");
    log(errors.length === 0, "corrupt values: no console error/pageerror", errors.join(" | "));
    await p.close();
  }

  /* ---- 6. onSelect records DISTINCT personas — user action only (B46) ---- */
  {
    errors.length = 0;
    const p = await newPage();
    await p.goto(BASE + "/#/f/" + FID, { waitUntil: "networkidle" });

    const before = await p.evaluate(() => localStorage.getItem("pdb.stats"));
    log(before === null || JSON.parse(before).personasExplored.length === 0,
      "initial render records NO persona (pdb.stats absent or empty)", `${before}`);

    // Snapshot the four legacy keys to prove the recorder never mutates them.
    const legacyBefore = await p.evaluate(() => [
      localStorage.getItem("pdb.favorites"),
      localStorage.getItem("pdb.applied"),
      localStorage.getItem("pdb.theme"),
      localStorage.getItem("pdb.testDate")
    ]);

    // Click the first NON-featured tab, then ArrowRight to select the next.
    const firstPersona = await p.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll("#screen-framework .persona-tab"));
      const idx = tabs.findIndex((t) => t.getAttribute("aria-selected") !== "true");
      tabs[idx].click();
      return tabs[idx].getAttribute("data-persona");
    });
    await p.keyboard.press("ArrowRight");
    const secondPersona = await p.evaluate(() =>
      document.querySelector("#screen-framework .persona-tab[aria-selected='true']").getAttribute("data-persona"));

    const stats1 = await p.evaluate(() => JSON.parse(localStorage.getItem("pdb.stats")));
    const both = stats1 && Array.isArray(stats1.personasExplored) &&
      stats1.personasExplored.indexOf(firstPersona) !== -1 &&
      stats1.personasExplored.indexOf(secondPersona) !== -1 &&
      firstPersona !== secondPersona;
    log(both, "user selection records BOTH distinct persona ids",
      JSON.stringify(stats1 && stats1.personasExplored) + ` (${firstPersona},${secondPersona})`);

    // Re-select an already-recorded persona → no duplicate.
    await p.evaluate((pid) => {
      const t = document.querySelector(`#screen-framework .persona-tab[data-persona='${pid}']`);
      t.click();
    }, secondPersona);
    const stats2 = await p.evaluate(() => JSON.parse(localStorage.getItem("pdb.stats")));
    log(stats2.personasExplored.length === stats1.personasExplored.length,
      "re-selecting a recorded persona does not duplicate it",
      `${stats1.personasExplored.length}→${stats2.personasExplored.length}`);

    const legacyAfter = await p.evaluate(() => [
      localStorage.getItem("pdb.favorites"),
      localStorage.getItem("pdb.applied"),
      localStorage.getItem("pdb.theme"),
      localStorage.getItem("pdb.testDate")
    ]);
    log(JSON.stringify(legacyBefore) === JSON.stringify(legacyAfter),
      "recorder never mutates the four legacy keys", `${legacyBefore} vs ${legacyAfter}`);
    log(errors.length === 0, "onSelect flow: no console error/pageerror", errors.join(" | "));

    // Missing onSelect is a no-op: render with only 3 args, click a tab, no throw.
    const noArgOk = await p.evaluate((fid) => {
      try {
        const fw = window.PDB_DATA.byId(fid);
        const frag = window.PDB_PERSONA_TABS.render(fw.examples, fw.featured, "ex-probe");
        const host = document.createElement("div");
        host.appendChild(frag);
        document.body.appendChild(host);
        const tab = host.querySelector(".persona-tab:not([aria-selected='true'])");
        tab.click(); // select() runs with onSelect === undefined
        document.body.removeChild(host);
        return true;
      } catch (e) { return String(e); }
    }, FID);
    log(noArgOk === true, "render() with no onSelect arg: selecting a tab never throws (B46)", String(noArgOk));
    log(errors.length === 0, "missing-onSelect probe: still no console error", errors.join(" | "));
    await p.close();
  }

  /* ---- 7. Persona tabs behave byte-identically after extraction (B45 spot) ---- */
  {
    errors.length = 0;
    const p = await newPage();
    await p.goto(BASE + "/#/f/" + FID, { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const scope = document.querySelector("#screen-framework");
      const tablist = scope.querySelector(".card-example > .persona-tabs[role='tablist']");
      const panels = scope.querySelector(".card-example > .persona-panels");
      const tabs = Array.from(scope.querySelectorAll(".persona-tab"));
      const selected = tabs.filter((t) => t.getAttribute("aria-selected") === "true");
      const rovingOk = tabs.every((t) => {
        const on = t.getAttribute("aria-selected") === "true";
        return t.getAttribute("tabindex") === (on ? "0" : "-1");
      });
      const featuredBadge = scope.querySelector(".persona-tab.is-featured .persona-featured-badge");
      const featScenario = scope.querySelector(".persona-panel:not([hidden]) .persona-scenario.card-example-text");
      const cost = scope.querySelector(".persona-panel:not([hidden]) .persona-cost .persona-tradeoff");
      return {
        directChildren: !!tablist && !!panels,   // no wrapper element inserted
        tabsCount: tabs.length,
        oneSelected: selected.length === 1,
        rovingOk,
        badge: !!featuredBadge,
        featScenario: !!featScenario,             // featured scenario keeps v1 selector class
        costCoVisible: !!cost                      // "The cost" co-visible with scenario (B30)
      };
    });
    log(r.directChildren, "tablist + panels are DIRECT children of .card-example (no wrapper, byte-identity)");
    log(r.tabsCount === 5, "five persona tabs rendered", `count ${r.tabsCount}`);
    log(r.oneSelected, "exactly one tab aria-selected");
    log(r.rovingOk, "roving tabindex: selected=0, others=-1");
    log(r.badge, "Featured badge present on featured tab");
    log(r.featScenario, "featured scenario keeps .persona-scenario.card-example-text (v1 selector)");
    log(r.costCoVisible, "'The cost'/tradeoff co-visible with its scenario (B30)");
    log(errors.length === 0, "persona-tab render: no console error/pageerror", errors.join(" | "));
    await p.close();
  }

  /* ---- 8. Grep-level: no Math.random, no remote fetch/XHR in new modules ---- */
  {
    const storeSrc = readFileSync(resolve(ROOT, "js/store.js"), "utf8");
    const tabsSrc = readFileSync(resolve(ROOT, "js/persona-tabs.js"), "utf8");
    const clean = (s) => !/Math\.random/.test(s) && !/\bfetch\s*\(/.test(s) &&
      !/XMLHttpRequest/.test(s) && !/WebSocket/.test(s);
    log(clean(storeSrc), "js/store.js has no Math.random / fetch / XHR (determinism + soul constraint)");
    log(clean(tabsSrc), "js/persona-tabs.js has no Math.random / fetch / XHR");
    // store.js writes ONLY through set(); grep that migrate does not delete legacy keys.
    log(!/removeItem|\.clear\s*\(/.test(storeSrc), "js/store.js never calls removeItem/clear (migration is additive, B43)");
  }

  /* ---- 9. Offline-after-first-load serves BOTH new modules (B73/B75) ---- */
  {
    errors.length = 0;
    const warm = await newPage();
    await warm.goto(BASE + "/#/", { waitUntil: "networkidle" });
    // Wait for the service worker to install + activate so the v13 cache is populated.
    await warm.waitForFunction(async () => {
      const r = await navigator.serviceWorker.ready;
      return !!(r && r.active);
    });
    await ctx.setOffline(true);
    const cold = await newPage();
    await cold.goto(BASE + "/#/f/" + FID, { waitUntil: "networkidle" });
    const r = await cold.evaluate(() => ({
      store: typeof window.PDB_STORE === "object" && window.PDB_STORE !== null &&
             typeof window.PDB_STORE.migrate === "function",
      tabs: typeof window.PDB_PERSONA_TABS === "object" && window.PDB_PERSONA_TABS !== null &&
            typeof window.PDB_PERSONA_TABS.render === "function",
      cardName: !!document.querySelector("#framework-mount .card .card-name"),
      personaTabs: document.querySelectorAll("#framework-mount .persona-tab").length
    }));
    log(r.store, "offline: js/store.js served from v13 cache (window.PDB_STORE present)");
    log(r.tabs, "offline: js/persona-tabs.js served from v13 cache (window.PDB_PERSONA_TABS present)");
    log(r.cardName && r.personaTabs === 5, "offline: #/f/:id renders full card + 5 persona tabs from cache (B45/B75)", `tabs ${r.personaTabs}`);
    log(errors.length === 0, "offline cold load: no console error/pageerror (no failed module fetch)", errors.join(" | "));
    await ctx.setOffline(false);
    await cold.close();
    await warm.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
};

run().catch((e) => { console.error(e); process.exit(1); });
