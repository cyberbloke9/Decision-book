/* ==========================================================================
   Pocket Decision Book — whole-app offline acceptance click-through (Sprint 006)
   Run: python3 -m http.server 4173  (project root), then:  node tests/accept.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate — NOT a substitute for the
   Evaluator's own adversarial run.

   Exercises the eight §9b user-story paths + the §5 a11y sweep + §5.3 tap
   targets + §4 states, in BOTH themes where the contract requires it. Date is
   injected via addInitScript(window.__PDB_NOW__) exactly as Sprint 005.
   ========================================================================== */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE || "http://localhost:4173";
let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};
const section = (t) => console.log(`\n— ${t} —`);

/* Deterministic daily index (mirrors the app + spec §9b Story 6). */
const N = 74;
const dailyIndex = (y, mZeroBased, d) =>
  (((Math.floor(Date.UTC(y, mZeroBased, d) / 864e5)) % N) + N) % N;

const run = async () => {
  const browser = await chromium.launch();

  /* One context per theme so localStorage['pdb.theme'] seeds cleanly. */
  const makeCtx = async (theme, initDate) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    if (theme) {
      await ctx.addInitScript((t) => {
        try { localStorage.setItem("pdb.theme", t); } catch (e) {}
      }, theme);
    }
    if (initDate) {
      await ctx.addInitScript((d) => { window.__PDB_NOW__ = d; }, initDate);
    }
    return ctx;
  };

  const attachErrors = (page, errors) => {
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  };

  const errors = [];

  /* ==================================================================
     PART A — functional stories, run in BOTH themes
     ================================================================== */
  for (const theme of ["dark", "light"]) {
    section(`Stories 1–5, 8 · theme=${theme}`);
    // No theme-seeding initScript here: Story8 needs a genuine reload-persist
    // test, and an initScript would re-seed the theme on every reload. We set the
    // starting theme by clicking the real toggle (which persists to localStorage).
    const ctx = await makeCtx(null);
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });

    // Default is dark; toggle once to reach light. The click persists the choice.
    const cur = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    if (cur !== theme) {
      await page.click("#theme-toggle");
      await page.waitForTimeout(30);
    }
    const appliedTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    log(appliedTheme === theme, `[${theme}] theme set to <html data-theme>`, appliedTheme);

    /* ---- Story 1 — situation routing (B8/B9) ---- */
    await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-situations:not([hidden])");
    const sitCount = await page.$$eval("#situations-mount a.situation-card", (a) => a.length);
    log(sitCount >= 6, `[${theme}] Story1: situations screen lists >=6 options`, `got ${sitCount}`);
    const firstSitHref = await page.$eval("#situations-mount a.situation-card", (a) => a.getAttribute("href"));
    await page.goto(BASE + "/" + firstSitHref, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-situation-detail:not([hidden])");
    const detailLinks = await page.$$eval("#situation-detail-mount a.fw-item", (a) => a.map((x) => x.getAttribute("href")));
    log(detailLinks.length >= 2, `[${theme}] Story1: situation routes to >=2 frameworks (B9)`, `got ${detailLinks.length}`);
    await page.goto(BASE + "/" + detailLinks[0], { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    const card1 = await page.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      if (!card) return null;
      const has = (sel) => !!card.querySelector(sel);
      const figSvgs = card.querySelectorAll(".card-figure svg").length;
      const last = card.lastElementChild;
      return {
        h2: !!document.querySelector("#framework-mount h2#h-framework"),
        trigger: has(".card-trigger"), essence: has(".card-essence"),
        example: has(".card-example"), pitfalls: has(".card-pitfalls"),
        prompt: has(".card-prompt"),
        figSvgs,
        promptLast: !!(last && last.classList.contains("card-prompt")),
        parts: card.querySelectorAll(".card-part").length
      };
    });
    log(!!card1 && card1.h2 && card1.trigger && card1.essence && card1.example && card1.pitfalls && card1.prompt,
      `[${theme}] Story1: card renders all six conceptual parts + h2#h-framework`, JSON.stringify(card1));
    log(!!card1 && card1.figSvgs === 1, `[${theme}] Story1/3: exactly one inline SVG in the card figure`, `svgs=${card1 && card1.figSvgs}`);
    log(!!card1 && card1.promptLast, `[${theme}] Story1: personal prompt is the terminal card-part (B5)`);

    /* ---- Story 2 — browse (B11) ---- */
    await page.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-browse:not([hidden])");
    const cats = await page.$$eval("#browse-mount a.category-card", (a) => a.map((x) => x.getAttribute("href")));
    log(cats.length === 8, `[${theme}] Story2: browse lists 4 quadrants + 4 extension sets = 8`, `got ${cats.length}`);
    await page.goto(BASE + "/" + cats[0], { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-category-detail:not([hidden])");
    const catLinks = await page.$$eval("#category-detail-mount a.fw-item", (a) => a.length);
    log(catLinks >= 1, `[${theme}] Story2: category detail lists frameworks`, `got ${catLinks}`);

    /* ---- Story 4 — search (B12) + invalid input (§4) ---- */
    await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-search:not([hidden])");
    // idle: empty input shows hint, not error/results
    const idle = await page.evaluate(() => ({
      hint: !!document.querySelector("#search-results .search-hint"),
      results: document.querySelectorAll("#search-results .fw-item").length
    }));
    log(idle.hint && idle.results === 0, `[${theme}] Story4: empty query shows idle hint, no results`, JSON.stringify(idle));
    // known substring
    await page.fill("#search-input", "decision");
    await page.waitForTimeout(80);
    const hits = await page.$$eval("#search-results .fw-item", (a) => a.length);
    log(hits >= 1, `[${theme}] Story4: known substring "decision" returns matches`, `got ${hits}`);
    // whitespace-only -> idle hint, no crash
    await page.fill("#search-input", "   ");
    await page.waitForTimeout(80);
    const ws = await page.evaluate(() => ({
      hint: !!document.querySelector("#search-results .search-hint"),
      empty: !!document.querySelector("#search-results .search-empty")
    }));
    log(ws.hint && !ws.empty, `[${theme}] Story4: whitespace-only query -> idle hint (no crash)`, JSON.stringify(ws));
    // special chars -> no-match, no crash
    await page.fill("#search-input", "<>&%$#");
    await page.waitForTimeout(80);
    const special = await page.evaluate(() => !!document.querySelector("#search-results .search-empty .search-empty-msg"));
    log(special, `[${theme}] Story4: special-char query -> "no frameworks match" message`);
    // nonsense -> no-match with a way back
    await page.fill("#search-input", "zzqqxx-nope");
    await page.waitForTimeout(80);
    const nomatch = await page.evaluate(() => {
      const box = document.querySelector("#search-results .search-empty");
      return {
        msg: !!(box && box.querySelector(".search-empty-msg")),
        wayBack: !!(box && box.querySelector('a[href="#/browse"]')),
        clear: !!(box && box.querySelector("button.search-clear"))
      };
    });
    log(nomatch.msg && nomatch.wayBack && nomatch.clear,
      `[${theme}] Story4: no-match shows message + Browse link + Clear button`, JSON.stringify(nomatch));

    /* ---- Story 5 — favorites persistence via KEYBOARD (B13) ---- */
    // open a known card
    const favId = detailLinks[0].replace("#/f/", "");
    await page.goto(BASE + "/#/f/" + favId, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    // focus the fav toggle and activate via keyboard (Enter)
    await page.focus("#framework-mount .fav-toggle");
    const preAria = await page.$eval("#framework-mount .fav-toggle", (b) => b.getAttribute("aria-pressed"));
    await page.keyboard.press("Enter");
    await page.waitForTimeout(50);
    const postAria = await page.$eval("#framework-mount .fav-toggle", (b) => b.getAttribute("aria-pressed"));
    log(preAria === "false" && postAria === "true", `[${theme}] Story5: keyboard (Enter) toggles favorite on`, `${preAria}->${postAria}`);
    // appears in favorites
    await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-favorites:not([hidden])");
    const inFav = await page.$$eval("#favorites-mount a.fw-item", (a) => a.map((x) => x.getAttribute("href")));
    log(inFav.includes("#/f/" + favId), `[${theme}] Story5: favorited framework listed in #/favorites`, inFav.join(","));
    // reload -> still favorited (persistence)
    await page.reload({ waitUntil: "networkidle" });
    await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-favorites:not([hidden])");
    const stillFav = await page.$$eval("#favorites-mount a.fw-item", (a) => a.map((x) => x.getAttribute("href")));
    log(stillFav.includes("#/f/" + favId), `[${theme}] Story5: favorite survives reload (localStorage B13)`);
    // unfavorite -> reload -> gone + empty-state guidance
    await page.goto(BASE + "/#/f/" + favId, { waitUntil: "networkidle" });
    await page.focus("#framework-mount .fav-toggle");
    await page.keyboard.press("Space");
    await page.waitForTimeout(50);
    await page.reload({ waitUntil: "networkidle" });
    await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-favorites:not([hidden])");
    const afterUnfav = await page.evaluate(() => ({
      items: document.querySelectorAll("#favorites-mount a.fw-item").length,
      empty: !!document.querySelector("#favorites-mount .empty-state"),
      cta: !!document.querySelector('#favorites-mount .empty-state a[href="#/browse"]')
    }));
    log(afterUnfav.items === 0 && afterUnfav.empty && afterUnfav.cta,
      `[${theme}] Story5: unfavorite persists; empty-state guidance renders`, JSON.stringify(afterUnfav));

    /* ---- Story 8 — theme persist (B14) ---- */
    await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
    const beforeBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    await page.focus("#theme-toggle");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(50);
    const flipped = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute("data-theme"),
      bg: getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
    }));
    log(flipped.theme !== theme && flipped.bg !== beforeBg,
      `[${theme}] Story8: theme toggle flips data-theme AND --bg`, JSON.stringify(flipped));
    await page.reload({ waitUntil: "networkidle" });
    const survived = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    log(survived === flipped.theme, `[${theme}] Story8: flipped theme survives reload (B14)`, survived);

    await ctx.close();
  }

  /* ==================================================================
     PART B — Story 6 daily habit loop (deterministic date, grammar, streak)
     ================================================================== */
  section("Story 6 · daily habit loop (B16/17/18) + F-001 grammar");
  {
    const ctx = await makeCtx("dark", "2026-07-06");
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-today:not([hidden])");

    const wantId = await page.evaluate((i) => window.PDB_DATA.frameworks[i].id, dailyIndex(2026, 6, 6));
    const gotId = await page.$eval(".today-card", (c) => c.getAttribute("data-framework-id"));
    log(gotId === wantId, "Story6: 2026-07-06 daily card matches deterministic index", `${gotId} vs ${wantId}`);

    // zero-streak starter copy + chip
    const zero = await page.evaluate(() => ({
      pressed: document.querySelector(".applied-toggle").getAttribute("aria-pressed"),
      nudge: (document.querySelector(".habit-status-nudge") || {}).textContent || "",
      status: (document.querySelector(".habit-status-main") || {}).textContent || ""
    }));
    log(zero.pressed === "false", "Story6: fresh day applied=false (aria-pressed)");
    log(/start your streak/i.test(zero.nudge), "Story6: zero-streak starter copy present", zero.nudge);

    // Space toggles on
    await page.focus(".applied-toggle");
    await page.keyboard.press("Space");
    await page.waitForTimeout(50);
    const afterSpace = await page.evaluate(() => ({
      pressed: document.querySelector(".applied-toggle").getAttribute("aria-pressed"),
      chip: (document.querySelector(".streak-chip") || {}).textContent || "",
      status: (document.querySelector(".habit-status-main") || {}).textContent || "",
      focused: document.activeElement === document.querySelector(".applied-toggle")
    }));
    log(afterSpace.pressed === "true", "Story6: Space toggles applied=true");
    log(afterSpace.chip.replace(/\s+/g, " ").includes("1-day streak"), "Story6/F-001: chip reads hyphenated '1-day streak'", JSON.stringify(afterSpace.chip));
    log(/Current streak: 1 day\./.test(afterSpace.status), "Story6: AT status line un-hyphenated 'Current streak: 1 day.'", afterSpace.status);
    log(afterSpace.focused, "Story6: focus retained on applied toggle after activation");

    // Enter toggles off (both keys operate the button)
    await page.keyboard.press("Enter");
    await page.waitForTimeout(50);
    const afterEnter = await page.$eval(".applied-toggle", (b) => b.getAttribute("aria-pressed"));
    log(afterEnter === "false", "Story6: Enter also operates the toggle (now false)");

    // re-apply, then reload -> persists
    await page.keyboard.press("Enter");
    await page.waitForTimeout(50);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#screen-today:not([hidden])");
    const afterReload = await page.$eval(".applied-toggle", (b) => b.getAttribute("aria-pressed"));
    log(afterReload === "true", "Story6: applied state survives reload (localStorage B17)");

    await ctx.close();
  }

  /* Different date -> different framework (rotation advances). */
  {
    const ctx = await makeCtx("dark", "2026-07-07");
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await page.waitForSelector(".today-card");
    const id7 = await page.$eval(".today-card", (c) => c.getAttribute("data-framework-id"));
    const wantId7 = await page.evaluate((i) => window.PDB_DATA.frameworks[i].id, dailyIndex(2026, 6, 7));
    const id6 = await page.evaluate((i) => window.PDB_DATA.frameworks[i].id, dailyIndex(2026, 6, 6));
    log(id7 === wantId7 && id7 !== id6, "Story6: 2026-07-07 rotates to a DIFFERENT framework", `${id6}->${id7}`);
    await ctx.close();
  }

  /* At-risk nudge grammar (F-001): seed a 2-day streak, today not applied. */
  section("F-001 · at-risk nudge hyphenation (§1.1)");
  {
    const ctx = await makeCtx("dark", "2026-07-06");
    await ctx.addInitScript(() => {
      try { localStorage.setItem("pdb.applied", JSON.stringify(["2026-07-04", "2026-07-05"])); } catch (e) {}
    });
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-today:not([hidden])");
    const nudge = await page.$eval(".habit-status-nudge", (p) => p.textContent);
    log(/keep your 2-day streak/.test(nudge), "F-001: at-risk nudge reads 'keep your 2-day streak' (hyphenated)", nudge);
    const chip = await page.$eval(".streak-chip", (c) => c.textContent.replace(/\s+/g, " "));
    log(chip.includes("2-day streak"), "F-001: at-risk chip reads '2-day streak'", chip);
    await ctx.close();
  }

  /* ==================================================================
     PART C — Story 7 offline (B20): cold-reload every route with net disabled
     ================================================================== */
  section("Story 7 · offline whole-app (B20)");
  {
    const ctx = await makeCtx("dark");
    const page = await ctx.newPage();
    attachErrors(page, errors);
    // First load online: register + activate SW.
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      if (navigator.serviceWorker) {
        await navigator.serviceWorker.ready;
      }
    });
    // Small settle so the SW controls the page.
    await page.waitForTimeout(300);

    // Count any failed network request while offline (contract Story 7: "zero
    // failed network requests"). SW precaches the full shell, so this must stay 0.
    const failedReqs = [];
    page.on("requestfailed", (r) => failedReqs.push(r.url()));

    await ctx.setOffline(true);
    const routes = [
      ["#/situations", "#screen-situations", "#situations-mount a.situation-card"],
      ["#/browse", "#screen-browse", "#browse-mount a.category-card"],
      ["#/favorites", "#screen-favorites", "#favorites-mount"],
      ["#/today", "#screen-today", ".today-card"],
      ["#/search", "#screen-search", "#search-input"]
    ];
    let offlineOK = true, offlineWhy = "";
    for (const [route, screen, marker] of routes) {
      try {
        await page.goto(BASE + "/" + route, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(screen + ":not([hidden])", { timeout: 4000 });
        await page.waitForSelector(marker, { timeout: 4000 });
      } catch (e) {
        offlineOK = false; offlineWhy = `${route}: ${e.message.split("\n")[0]}`;
        break;
      }
    }
    log(offlineOK, "Story7: every route cold-reloads from cache with network disabled", offlineWhy);

    // A framework card offline.
    try {
      const someId = await page.evaluate(() => window.PDB_DATA.frameworks[0].id);
      await page.goto(BASE + "/#/f/" + someId, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#framework-mount .card", { timeout: 4000 });
      const svgs = await page.$$eval("#framework-mount .card-figure svg", (a) => a.length);
      log(svgs === 1, "Story7: offline framework card renders its inline SVG from cache", `svgs=${svgs}`);
    } catch (e) {
      log(false, "Story7: offline framework card renders", e.message.split("\n")[0]);
    }

    // Offline search still runs a query (no hung spinner / dead network).
    try {
      await page.goto(BASE + "/#/search", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#search-input", { timeout: 4000 });
      await page.fill("#search-input", "bias");
      await page.waitForTimeout(120);
      const n = await page.$$eval("#search-results .fw-item", (a) => a.length);
      log(n >= 1, "Story7: offline search returns cached results", `got ${n}`);
    } catch (e) {
      log(false, "Story7: offline search runs", e.message.split("\n")[0]);
    }

    // No request may have hard-failed offline (a 404-from-cache would surface here).
    log(failedReqs.length === 0, "Story7: zero failed network requests during the offline sweep",
      failedReqs.slice(0, 5).join(" | "));

    await ctx.setOffline(false);
    await ctx.close();
  }

  /* ==================================================================
     PART D — a11y sweep (axe 0 critical) + focus outline + no h-scroll + tap targets
     ================================================================== */
  section("§5 a11y sweep · axe 0 critical, both themes");
  const axeTargets = [
    ["#/situations", "#screen-situations"],
    ["#/browse", "#screen-browse"],
    ["#/today", "#screen-today"],
    ["#/favorites", "#screen-favorites"],
    ["#/search", "#screen-search"]
  ];
  for (const theme of ["dark", "light"]) {
    const ctx = await makeCtx(theme, "2026-07-06");
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    // a framework card too
    const firstId = await page.evaluate(() => window.PDB_DATA.frameworks[0].id);
    for (const [route, screen] of [...axeTargets, ["#/f/" + firstId, "#screen-framework"]]) {
      await page.goto(BASE + "/" + route, { waitUntil: "networkidle" });
      await page.waitForSelector(screen + ":not([hidden])");
      const res = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const critical = res.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      log(critical.length === 0, `[${theme}] axe 0 critical/serious on ${route}`,
        critical.map((v) => v.id).join(","));
    }

    // no-match search state under axe (contrast of the empty message)
    await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
    await page.fill("#search-input", "zzqqxx-nope");
    await page.waitForTimeout(80);
    const resNM = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const critNM = resNM.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    log(critNM.length === 0, `[${theme}] axe 0 critical/serious on search no-match`, critNM.map((v) => v.id).join(","));

    await ctx.close();
  }

  /* Focus-visible outline width >=3px + no keyboard trap + reduced motion + h-scroll + tap targets. */
  section("§5.1/5.3/§7 · focus outline, reduced motion, no h-scroll (375+320), tap targets");
  {
    const ctx = await makeCtx("dark", "2026-07-06");
    const page = await ctx.newPage();
    attachErrors(page, errors);
    await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-today:not([hidden])");

    // Keyboard Tab from the top: first stop is the skip link, and it renders a
    // REAL :focus-visible outline (>=3px) — measured via getComputedStyle after a
    // genuine keyboard focus (programmatic .focus() does NOT trigger :focus-visible).
    await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-situations:not([hidden])");
    await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
    await page.keyboard.press("Tab");
    const firstStop = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = el ? getComputedStyle(el) : null;
      return {
        cls: el ? (el.className || el.id) : "none",
        outline: cs ? parseFloat(cs.outlineWidth) || 0 : 0
      };
    });
    log(String(firstStop.cls).includes("skip-link"), "§5.1: first Tab stop is the skip link", JSON.stringify(firstStop));
    log(firstStop.outline >= 3, "§5.1: keyboard focus renders a visible :focus-visible outline (>=3px)", `got ${firstStop.outline}`);

    // §5.1 control #9 — the search INPUT specifically. It carries a
    // `.search-input:focus { outline:none }` rule, so we must confirm keyboard
    // focus still renders a REAL outline (width >=3 AND style !== none — a 3px
    // width with style:none draws nothing). Tab to it, then measure.
    await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
    await page.waitForSelector("#search-input");
    await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
    let onInput = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      onInput = await page.evaluate(() => document.activeElement && document.activeElement.id === "search-input");
      if (onInput) break;
    }
    const inputFocus = await page.evaluate(() => {
      const el = document.getElementById("search-input");
      const cs = getComputedStyle(el);
      return { on: document.activeElement === el, width: parseFloat(cs.outlineWidth) || 0, style: cs.outlineStyle };
    });
    log(inputFocus.on && inputFocus.width >= 3 && inputFocus.style !== "none",
      "§5.1 #9: search input renders a real keyboard focus outline (width>=3 AND style!=none)", JSON.stringify(inputFocus));

    // Tab through the app bar; confirm no keyboard trap. A real trap = focus
    // stuck on the SAME node (identity), not merely two siblings sharing a class
    // (list links share .situation-card) — so compare node identity across steps.
    await page.evaluate(() => { window.__lastFocus = document.activeElement; });
    const chain = [];
    let trap = false;
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const step = await page.evaluate(() => {
        const el = document.activeElement;
        const same = el === window.__lastFocus;
        window.__lastFocus = el;
        return {
          key: el ? (el.id || el.getAttribute("href") || el.className || el.tagName) : "none",
          same
        };
      });
      if (step.same && step.key !== "none") { trap = true; break; }
      chain.push(step.key);
    }
    log(!trap, "§5.1: no keyboard trap — Tab advances to distinct nodes", chain.join(" > "));
    // The named app-bar controls are reachable in the tab chain.
    log(chain.includes("search-affordance") && chain.includes("theme-toggle"),
      "§5.1: search affordance + theme toggle reachable by Tab", chain.join(" > "));

    // Reduced motion suppresses the .screen enter animation.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
    const rm = await page.evaluate(() => {
      const s = document.querySelector(".screen:not([hidden])");
      if (!s) return { dur: "n/a" };
      return { dur: getComputedStyle(s).animationDuration };
    });
    log(rm.dur === "0s", "§5.1: prefers-reduced-motion neutralizes the .screen enter animation", JSON.stringify(rm));
    await page.emulateMedia({ reducedMotion: "no-preference" });

    // No horizontal scroll at 375 and 320 across every screen.
    const screens = ["#/situations", "#/browse", "#/favorites", "#/today", "#/search",
      "#/s/" + (await page.evaluate(() => window.PDB_NAV.SITUATIONS[0].id)),
      "#/f/" + (await page.evaluate(() => window.PDB_DATA.frameworks[0].id))];
    for (const w of [375, 320]) {
      await page.setViewportSize({ width: w, height: 700 });
      let overflow = "";
      for (const r of screens) {
        await page.goto(BASE + "/" + r, { waitUntil: "networkidle" });
        const bad = await page.evaluate(() => {
          const e = document.scrollingElement;
          return e.scrollWidth > e.clientWidth + 1;
        });
        if (bad) { overflow = `${r}@${w}px`; break; }
      }
      log(!overflow, `§7: no horizontal scroll at ${w}px on every screen`, overflow);
    }

    // Tap targets >=44 in the thumb axis at 375px.
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    await page.waitForSelector(".applied-toggle");
    const taps = await page.evaluate(() => {
      const measure = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      };
      const tabs = [...document.querySelectorAll(".tab-bar .tab")].map((t) => {
        const r = t.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
      return {
        tabs,
        theme: measure("#theme-toggle"),
        search: measure("#search-affordance"),
        applied: measure(".applied-toggle")
      };
    });
    const ok44 = (b) => b && b.w >= 44 && b.h >= 44;
    log(taps.tabs.length === 4 && taps.tabs.every(ok44), "§5.3: all 4 bottom tabs >=44x44", JSON.stringify(taps.tabs));
    log(ok44(taps.theme), "§5.3: theme toggle >=44x44", JSON.stringify(taps.theme));
    log(ok44(taps.search), "§5.3: search affordance >=44x44", JSON.stringify(taps.search));
    log(taps.applied && taps.applied.h >= 44, "§5.3: applied toggle >=44 in thumb axis", JSON.stringify(taps.applied));

    // Favorite toggle on a card >=44 thumb axis.
    await page.goto(BASE + "/#/f/" + (await page.evaluate(() => window.PDB_DATA.frameworks[0].id)), { waitUntil: "networkidle" });
    const favBox = await page.$eval("#framework-mount .fav-toggle", (b) => {
      const r = b.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    log(favBox.h >= 44 && favBox.w >= 44, "§5.3: favorite toggle >=44x44", JSON.stringify(favBox));

    await ctx.close();
  }

  /* ==================================================================
     Console cleanliness across the whole run.
     ================================================================== */
  section("Console");
  log(errors.length === 0, "zero console errors/warnings across the entire acceptance run", errors.slice(0, 8).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run().catch((e) => { console.error(e); process.exit(1); });
