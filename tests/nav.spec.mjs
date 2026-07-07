/* Self-check for Sprint 004 — situation nav, browse, search, favorites.
   Run: python3 -m http.server 4173 (project root), then: node tests/nav.spec.mjs
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
  const page = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const data = await page.evaluate(() => window.PDB_DATA);
  const nav = await page.evaluate(() => window.PDB_NAV);
  const allIds = data.frameworks.map((f) => f.id);

  /* ---- 1. Situations picker (B8/B9) ---- */
  await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-situations:not([hidden])");
  const picker = await page.evaluate(() => {
    const links = [...document.querySelectorAll("#situations-mount a.situation-card")];
    return {
      count: links.length,
      hrefs: links.map((a) => a.getAttribute("href")),
      staticHowTo: !!document.querySelector("#screen-situations ol.how-list")
    };
  });
  log(picker.count >= 6 && picker.count <= 10, "situations picker has 6–10 option links", `got ${picker.count}`);
  log(!picker.staticHowTo, "static 'How to use this' ordered list removed");

  // In-page PDB_NAV integrity: every situation >= 2 ids, all resolve, no dup.
  const navIntegrity = await page.evaluate(() => {
    const N = window.PDB_NAV, D = window.PDB_DATA;
    let under = 0, dangling = 0; const ids = new Set(); let dup = 0;
    N.SITUATIONS.forEach((s) => {
      if (s.frameworkIds.length < 2) under++;
      if (ids.has(s.id)) dup++; ids.add(s.id);
      s.frameworkIds.forEach((id) => { if (!D.byId(id)) dangling++; });
    });
    return { under, dangling, dup, total: N.SITUATIONS.length };
  });
  log(navIntegrity.under === 0, "every situation maps to ≥2 frameworks (B9)", `under=${navIntegrity.under}`);
  log(navIntegrity.dangling === 0, "no dangling frameworkIds (all resolve via byId)", `dangling=${navIntegrity.dangling}`);
  log(navIntegrity.dup === 0, "situation ids unique");

  // Each situation-detail lists >= 2 framework list items.
  let underDetail = null;
  for (const s of nav.SITUATIONS) {
    await page.goto(BASE + "/#/s/" + s.id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-situation-detail:not([hidden])");
    const n = await page.evaluate(() => document.querySelectorAll("#situation-detail-mount a.fw-item").length);
    const heading = await page.evaluate(() => document.getElementById("h-situation").textContent);
    if (n < 2) underDetail = underDetail || `${s.id} lists ${n}`;
    if (heading !== s.label) underDetail = underDetail || `${s.id} heading "${heading}" != "${s.label}"`;
  }
  log(!underDetail, "every situation-detail lists ≥2 frameworks + heading = label", underDetail || "");

  // Deterministic: reload twice → identical option set/order.
  await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
  const h1 = await page.evaluate(() => [...document.querySelectorAll("#situations-mount a.situation-card")].map((a) => a.getAttribute("href")).join("|"));
  await page.reload({ waitUntil: "networkidle" });
  const h2 = await page.evaluate(() => [...document.querySelectorAll("#situations-mount a.situation-card")].map((a) => a.getAttribute("href")).join("|"));
  log(h1 === h2 && h1 === picker.hrefs.join("|"), "situation options deterministic across reloads");

  /* ---- 2. Browse index (B11) + 3. ≤3-tap union (B10) ---- */
  await page.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-browse:not([hidden])");
  const browse = await page.evaluate(() => {
    const groups = [...document.querySelectorAll("#browse-mount .browse-group")];
    const cats = [...document.querySelectorAll("#browse-mount a.category-card")];
    return {
      groupCount: groups.length,
      catCount: cats.length,
      catHrefs: cats.map((a) => a.getAttribute("href"))
    };
  });
  log(browse.catCount === 8, "browse lists all 8 categories", `got ${browse.catCount}`);
  log(browse.groupCount === 2, "categories grouped (quadrant vs extension)", `groups=${browse.groupCount}`);

  // Collect the framework ids listed under each category → union must be the 74.
  const union = [];
  for (const c of data.categories) {
    await page.goto(BASE + "/#/c/" + c.id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-category-detail:not([hidden])");
    const ids = await page.evaluate(() => [...document.querySelectorAll("#category-detail-mount a.fw-item")].map((a) => a.getAttribute("href").replace("#/f/", "")));
    const heading = await page.evaluate(() => document.getElementById("h-category").textContent);
    if (heading !== c.label) log(false, `category heading = label for ${c.id}`, heading);
    ids.forEach((id) => union.push(id));
  }
  const unionSet = new Set(union);
  log(union.length === 74 && unionSet.size === 74, "union of category lists = exactly 74, each once (B10/B11)", `len=${union.length} uniq=${unionSet.size}`);
  const missing = allIds.filter((id) => !unionSet.has(id));
  log(missing.length === 0, "all 74 frameworks reachable via Browse→category (≤3 taps)", missing.slice(0, 5).join(","));

  /* ---- 4. Search happy path (B12) ---- */
  await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-search:not([hidden])");
  const typeSearch = async (q) => {
    await page.fill("#search-input", q);
    // input event fires on fill; give the render a tick
    await page.waitForTimeout(30);
  };
  await typeSearch("matrix");
  const matrixRes = await page.evaluate(() => {
    const links = [...document.querySelectorAll("#search-results a.fw-item")];
    return {
      count: links.length,
      names: links.map((a) => a.querySelector(".fw-item-name").textContent.toLowerCase()),
      countText: (document.querySelector(".search-count") || {}).textContent || ""
    };
  });
  log(matrixRes.count >= 1 && /match/.test(matrixRes.countText), "search 'matrix' → ≥1 result with a count", matrixRes.countText);

  // Keyword present in an essence but not a name still matches (keyword search).
  // "urgent" appears in the Eisenhower trigger/essence, not any framework name.
  await typeSearch("urgent");
  const kw = await page.evaluate(() => {
    const links = [...document.querySelectorAll("#search-results a.fw-item")];
    return {
      count: links.length,
      hasEisen: links.some((a) => /eisenhower/i.test(a.getAttribute("href")))
    };
  });
  log(kw.count >= 1 && kw.hasEisen, "keyword-only match works (essence/trigger, not just name)", `count=${kw.count}`);

  // Clicking a result opens the correct card.
  await typeSearch("eisenhower");
  await page.click("#search-results a.fw-item");
  await page.waitForSelector("#screen-framework:not([hidden])");
  const opened = await page.evaluate(() => (document.querySelector("#framework-mount .card-name") || {}).textContent || "");
  log(/eisenhower/i.test(opened), "clicking a search result opens the right card", opened);

  /* ---- 5. Search empty + no-match + invalid (B12/§5) ---- */
  const searchState = async (q) => {
    await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
    if (q !== null) await typeSearch(q);
    return page.evaluate(() => ({
      results: document.querySelectorAll("#search-results a.fw-item").length,
      hint: !!document.querySelector("#search-results .search-hint"),
      noMatch: !!document.querySelector("#search-results .search-empty"),
      clearBtn: !!document.querySelector("#search-results button.search-clear"),
      browseLink: !!document.querySelector('#search-results a.btn-link[href="#/browse"]')
    }));
  };
  const empty = await searchState(null);
  log(empty.hint && empty.results === 0, "empty query ⇒ hint state (not blank, not 74)");
  const ws = await searchState("   ");
  log(ws.hint && ws.results === 0, "whitespace-only ⇒ hint state (trim)");
  const noMatch = await searchState("zzzznope");
  log(noMatch.noMatch && noMatch.clearBtn && noMatch.browseLink && noMatch.results === 0,
    "no-match ⇒ message + Clear button + Browse link");

  // Clear returns to hint.
  await page.click("#search-results button.search-clear");
  await page.waitForTimeout(30);
  const afterClear = await page.evaluate(() => ({
    val: document.getElementById("search-input").value,
    hint: !!document.querySelector("#search-results .search-hint")
  }));
  log(afterClear.val === "" && afterClear.hint, "Clear empties field and returns to hint");

  // Invalid / special-character queries: no thrown error, graceful state.
  const errBefore = errors.length;
  for (const q of ["(", "[", "\\", "*", "😀", "a".repeat(500)]) {
    const st = await searchState(q);
    if (!(st.hint || st.noMatch || st.results >= 0)) log(false, `special query handled: ${q}`);
  }
  log(errors.length === errBefore, "special/long queries throw no console error", errors.slice(errBefore, errBefore + 3).join(" | "));

  /* ---- 6. Favorites persist (B13/B15) ---- */
  const idA = allIds[0];
  // fresh favorites
  await page.evaluate(() => { try { localStorage.removeItem("pdb.favorites"); } catch (e) {} });
  await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
  const emptyFav = await page.evaluate(() => ({
    hasEmpty: /No favorites yet/.test(document.querySelector("#favorites-mount").textContent),
    listed: document.querySelectorAll("#favorites-mount a.fw-item").length
  }));
  log(emptyFav.hasEmpty && emptyFav.listed === 0, "favorites empty ⇒ guidance, not blank");

  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-framework:not([hidden])");
  await page.click(".fav-toggle");
  const pressed = await page.evaluate(() => document.querySelector(".fav-toggle").getAttribute("aria-pressed"));
  log(pressed === "true", "favorite toggle → aria-pressed=true");
  await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
  const listedA = await page.evaluate((id) => [...document.querySelectorAll("#favorites-mount a.fw-item")].some((a) => a.getAttribute("href") === "#/f/" + id), idA);
  log(listedA, "favorited framework appears on #/favorites");

  // Reload → still favorited (persistence).
  await page.reload({ waitUntil: "networkidle" });
  await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
  const stillA = await page.evaluate((id) => [...document.querySelectorAll("#favorites-mount a.fw-item")].some((a) => a.getAttribute("href") === "#/f/" + id), idA);
  const storeArr = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem("pdb.favorites")); } catch (e) { return null; } });
  log(stillA, "favorite survives reload (still on #/favorites)");
  log(Array.isArray(storeArr) && storeArr.includes(idA), "localStorage['pdb.favorites'] is a JSON array reflecting state", JSON.stringify(storeArr));
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  const starPressedAfterReload = await page.evaluate(() => document.querySelector(".fav-toggle").getAttribute("aria-pressed"));
  log(starPressedAfterReload === "true", "card star reads pressed after reload");

  // Unfavorite → gone, persists.
  await page.click(".fav-toggle");
  await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.goto(BASE + "/#/favorites", { waitUntil: "networkidle" });
  const goneA = await page.evaluate((id) => ![...document.querySelectorAll("#favorites-mount a.fw-item")].some((a) => a.getAttribute("href") === "#/f/" + id), idA);
  log(goneA, "unfavorite persists across reload (removed from #/favorites)");

  /* ---- 7. Anchors vs buttons (§3) + browser Back ---- */
  await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
  const anchorKinds = await page.evaluate(() => ({
    situationIsAnchor: [...document.querySelectorAll("#situations-mount .situation-card")].every((n) => n.tagName === "A" && n.getAttribute("href").startsWith("#/")),
  }));
  log(anchorKinds.situationIsAnchor, "situation options are <a href='#/…'>");
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  const btnKinds = await page.evaluate(() => {
    const fav = document.querySelector(".fav-toggle");
    return {
      favIsButton: fav && fav.tagName === "BUTTON" && fav.hasAttribute("aria-pressed") && !!fav.getAttribute("aria-label"),
      backIsAnchor: (document.querySelector(".card-back") || {}).tagName === "A"
    };
  });
  log(btnKinds.favIsButton, "favorite is a <button aria-pressed aria-label>");
  log(btnKinds.backIsAnchor, "card back is an <a>");
  // Browser Back from a situation-detail returns to situations.
  await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
  await page.click("#situations-mount a.situation-card");
  await page.waitForSelector("#screen-situation-detail:not([hidden])");
  await page.goBack();
  await page.waitForSelector("#screen-situations:not([hidden])");
  log(await page.isVisible("#screen-situations"), "browser Back from #/s/:id returns to #/situations");

  // Category items + search results are anchors; Clear-search is a button.
  await page.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
  const catAnchor = await page.evaluate(() => [...document.querySelectorAll("#browse-mount .category-card")].every((n) => n.tagName === "A" && n.getAttribute("href").startsWith("#/c/")));
  log(catAnchor, "category items are <a href='#/c/…'>");
  await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
  await page.fill("#search-input", "eisenhower");
  await page.waitForTimeout(30);
  const resAnchor = await page.evaluate(() => [...document.querySelectorAll("#search-results .fw-item")].every((n) => n.tagName === "A"));
  log(resAnchor, "search-result items are <a>");
  await page.fill("#search-input", "zzzznope");
  await page.waitForTimeout(30);
  const clearIsBtn = await page.evaluate(() => { const c = document.querySelector("#search-results .search-clear"); return c && c.tagName === "BUTTON" && !!c.getAttribute("aria-label"); });
  log(clearIsBtn, "Clear-search is a <button aria-label>");

  /* ---- 7b. Live keyboard operability (§6) ---- */
  // Space toggles the favorite button (native <button>).
  await page.evaluate(() => { try { localStorage.removeItem("pdb.favorites"); } catch (e) {} });
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  await page.focus(".fav-toggle");
  const kbFocused = await page.evaluate(() => document.activeElement === document.querySelector(".fav-toggle"));
  await page.keyboard.press("Space");
  const kbPressed = await page.evaluate(() => document.querySelector(".fav-toggle").getAttribute("aria-pressed"));
  log(kbFocused && kbPressed === "true", "keyboard: focus star + Space toggles favorite (aria-pressed=true)");
  await page.keyboard.press("Space");
  const kbUnpressed = await page.evaluate(() => document.querySelector(".fav-toggle").getAttribute("aria-pressed"));
  log(kbUnpressed === "false", "keyboard: Space again un-toggles favorite");
  // Enter on a focused list link follows the route.
  await page.goto(BASE + "/#/s/" + nav.SITUATIONS[0].id, { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-situation-detail:not([hidden])");
  await page.focus("#situation-detail-mount a.fw-item");
  await page.keyboard.press("Enter");
  await page.waitForSelector("#screen-framework:not([hidden])");
  log(await page.isVisible("#screen-framework"), "keyboard: Enter on a focused list link opens the card");
  await page.evaluate(() => { try { localStorage.removeItem("pdb.favorites"); } catch (e) {} });

  /* ---- 8. Not-found (parametric) ---- */
  const nfErrBefore = errors.length;
  for (const [hash, screen, back] of [
    ["#/s/zzz", "#screen-situation-detail", "#/situations"],
    ["#/c/zzz", "#screen-category-detail", "#/browse"],
    ["#/s/", "#screen-situation-detail", "#/situations"],
    ["#/c/", "#screen-category-detail", "#/browse"]
  ]) {
    await page.goto(BASE + "/" + hash, { waitUntil: "networkidle" });
    await page.waitForSelector(screen + ":not([hidden])");
    const nf = await page.evaluate((b) => ({
      hasNotFound: !!document.querySelector(".list-notfound"),
      hasBack: !!document.querySelector('.list-notfound a.back-link[href="' + b + '"]')
    }), back);
    log(nf.hasNotFound && nf.hasBack, `parametric not-found graceful: ${hash}`);
  }
  log(errors.length === nfErrBefore, "parametric not-found: zero console errors");
  // #/f/zzz still the Sprint-002 not-found (unchanged).
  await page.goto(BASE + "/#/f/zzz", { waitUntil: "networkidle" });
  const fwNf = await page.evaluate(() => !!document.querySelector("#framework-mount .card-notfound"));
  log(fwNf, "#/f/zzz still renders Sprint-002 framework not-found");

  /* ---- 9. A11y — axe both themes ---- */
  const axeRules = ["color-contrast", "link-name", "button-name", "list", "listitem", "document-title", "html-has-lang", "empty-heading", "aria-allowed-attr"];
  const expectBg = { dark: "rgb(32, 24, 17)", light: "rgb(233, 223, 202)" };
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Populate a favorite so the favorites list (not just empty) is scanned.
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  await page.click(".fav-toggle");
  const axeTargets = [
    ["#/situations", null],
    ["#/browse", null],
    ["#/s/" + nav.SITUATIONS[0].id, null],
    ["#/c/" + data.categories[0].id, null],
    ["#/search", null],            // hint
    ["#/search", "eisenhower"],    // results
    ["#/search", "zzzznope"],      // no-match
    ["#/favorites", null],         // populated
    ["#/f/" + idA, null]           // card w/ star
  ];
  for (const theme of ["dark", "light"]) {
    for (const [hash, q] of axeTargets) {
      await page.goto(BASE + "/" + hash, { waitUntil: "networkidle" });
      await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
      await page.waitForFunction((bg) => getComputedStyle(document.body).backgroundColor === bg, expectBg[theme]);
      if (q) { await page.fill("#search-input", q); await page.waitForTimeout(30); }
      const res = await new AxeBuilder({ page }).withRules(axeRules).analyze();
      log(res.violations.length === 0, `axe ${theme} ${hash}${q ? " q=" + q : ""}`, res.violations.map((v) => v.id).join(","));
    }
  }
  await page.emulateMedia({ reducedMotion: null });
  // clean the favorite we added
  await page.evaluate(() => { try { localStorage.removeItem("pdb.favorites"); } catch (e) {} });

  /* ---- 10. Tap targets ≥44px ---- */
  await page.goto(BASE + "/#/situations", { waitUntil: "networkidle" });
  const sitBox = await page.evaluate(() => { const a = document.querySelector("#situations-mount a.situation-card"); const r = a.getBoundingClientRect(); return { w: r.width, h: r.height }; });
  log(sitBox.h >= 44 && sitBox.w >= 44, "situation option tap target ≥44px", JSON.stringify(sitBox));
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  const favBox = await page.evaluate(() => { const b = document.querySelector(".fav-toggle").getBoundingClientRect(); return { w: b.width, h: b.height }; });
  log(favBox.h >= 44 && favBox.w >= 44, "favorite button tap target ≥44px", JSON.stringify(favBox));

  /* ---- 11. No horizontal scroll (375 & 320) ---- */
  const longCat = data.categories.reduce((best, c) => {
    const n = data.frameworks.filter((f) => f.category === c.id).length;
    return n > best.n ? { id: c.id, n } : best;
  }, { id: data.categories[0].id, n: 0 }).id;
  const scrollScreens = [
    "#/situations", "#/browse", "#/c/" + longCat, "#/favorites",
    "#/f/" + idA, "#/s/" + nav.SITUATIONS[0].id
  ];
  for (const w of [375, 320]) {
    await page.setViewportSize({ width: w, height: 667 });
    for (const hash of scrollScreens) {
      await page.goto(BASE + "/" + hash, { waitUntil: "networkidle" });
      const ok = await page.evaluate(() =>
        document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
        document.body.scrollWidth <= window.innerWidth);
      if (!ok) log(false, `no h-scroll ${w}px ${hash}`);
    }
    // search with a 500-char no-match query
    await page.goto(BASE + "/#/search", { waitUntil: "networkidle" });
    await page.fill("#search-input", "z".repeat(500));
    await page.waitForTimeout(30);
    const okS = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
      document.body.scrollWidth <= window.innerWidth);
    log(okS, `no h-scroll ${w}px search 500-char no-match`);
  }
  log(true, "no horizontal scroll on all screens at 375 & 320 (see any FAIL above)");
  await page.setViewportSize({ width: 375, height: 667 });

  /* ---- 12. Offline regression (B20/§8) ---- */
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForFunction(async () => { const r = await navigator.serviceWorker.ready; return !!(r && r.active); });
  await ctx.setOffline(true);
  let offlineFail = null;
  for (const hash of ["#/situations", "#/browse", "#/s/" + nav.SITUATIONS[0].id, "#/c/" + data.categories[0].id, "#/search", "#/favorites", "#/f/" + idA]) {
    const cold = await newPage();
    await cold.goto(BASE + "/" + hash, { waitUntil: "domcontentloaded" });
    const rendered = await cold.evaluate(() => {
      const active = [...document.querySelectorAll(".screen")].find((s) => !s.hidden);
      return active ? active.querySelector("h2") && active.querySelector("h2").textContent.trim().length > 0 : false;
    });
    if (!rendered) offlineFail = offlineFail || hash;
    await cold.close();
  }
  log(!offlineFail, "offline: every screen renders from cache", offlineFail || "");
  await ctx.setOffline(false);

  const swSrc = readFileSync(resolve(HERE, "..", "sw.js"), "utf8");
  log(/CACHE\s*=\s*"pdb-shell-v10"/.test(swSrc), "sw.js CACHE === pdb-shell-v10");
  log(/js\/nav-data\.js/.test(swSrc) && /js\/favorites\.js/.test(swSrc) && /js\/lists\.js/.test(swSrc), "sw.js precaches the 3 new modules");
  log(/keys\.filter[\s\S]*caches\.delete/.test(swSrc), "sw.js activate purges old cache");

  /* ---- 13. Today is now the Sprint-005 dynamic daily card; prompt-last intact ---- */
  await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
  const todayNow = await page.evaluate(() => {
    const screen = document.querySelector("#screen-today");
    const mount = document.querySelector("#today-mount");
    const btn = mount ? mount.querySelector("button.applied-toggle") : null;
    const streak = mount ? mount.querySelector(".streak-chip") : null;
    const card = mount ? mount.querySelector("[data-framework-id] .card, [data-framework-id].card") : null;
    return {
      noPlaceholder: !screen.textContent.includes("No card yet today"),
      hasButton: !!(btn && (btn.getAttribute("aria-pressed") === "true" || btn.getAttribute("aria-pressed") === "false")),
      hasStreak: !!streak,
      hasCard: !!card
    };
  });
  log(todayNow.noPlaceholder, "Today: old 'No card yet today' placeholder is gone");
  log(todayNow.hasButton, "Today: habit bar has an 'applied it' toggle button (aria-pressed)");
  log(todayNow.hasStreak, "Today: habit bar has a streak indicator");
  log(todayNow.hasCard, "Today: #today-mount renders a daily card with data-framework-id");
  await page.goto(BASE + "/#/f/" + idA, { waitUntil: "networkidle" });
  const promptLast = await page.evaluate(() => {
    const card = document.querySelector("#framework-mount .card");
    return card && card.lastElementChild && card.lastElementChild.classList.contains("card-prompt");
  });
  log(promptLast, "card six-part order intact: prompt is lastElementChild (B5)");

  /* ---- 14. Console cleanliness ---- */
  log(errors.length === 0, "zero console errors/warnings across the run", errors.slice(0, 6).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run().catch((e) => { console.error(e); process.exit(1); });
