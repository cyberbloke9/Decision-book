/* Self-check for Sprint 001 shell against the contract's Playwright steps.
   Run: python3 -m http.server 4173  (in project root), then: node tests/shell.spec.mjs
   Exits non-zero on any failure. Not the Evaluator's suite — a pre-handoff gate. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE || "http://localhost:4173";
let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

const bg = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const run = async () => {
  const browser = await chromium.launch();
  // F-002: emulate reduced motion context-wide so axe never samples a mid-crossfade
  // theme-transition frame (hash-route navigations don't reload, so a transition
  // started on "/" could still be animating when axe scans "#/situations"). This
  // makes the color-contrast scans deterministic (50/50 across 10 runs). Test-only.
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, reducedMotion: "reduce" });
  const errors = [];
  ctx.on("weberror", (e) => errors.push("weberror: " + e.error().message));

  const newPage = async () => {
    const p = await ctx.newPage();
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    return p;
  };

  const page = await newPage();

  // Step 1: load + no horizontal scroll at 375 and 320
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("#screen-situations:not([hidden])");
  const h = await page.textContent(".screen:not([hidden]) .screen-title");
  log(/Start where you are/.test(h), "default screen is Situations", h);
  for (const w of [375, 320]) {
    await page.setViewportSize({ width: w, height: 667 });
    const noScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
      document.body.scrollWidth <= window.innerWidth);
    log(noScroll, `no horizontal scroll at ${w}px`);
  }
  await page.setViewportSize({ width: 375, height: 667 });

  // Step 2: tab navigation
  for (const [route, needle] of [["browse", "Browse the shelf"], ["favorites", "Your favorites"], ["today", "Today"], ["situations", "Start where you are"]]) {
    await page.click(`.tab[data-route="${route}"]`);
    await page.waitForSelector(`#screen-${route}:not([hidden])`);
    const title = await page.textContent(".screen:not([hidden]) .screen-title");
    const cur = await page.getAttribute(`.tab[data-route="${route}"]`, "aria-current");
    log(title.includes(needle) && cur === "page", `tab ${route}: heading + aria-current`, `title="${title}" cur=${cur}`);
  }

  // Step 3: empty states + no placeholder strings
  await page.click('.tab[data-route="favorites"]');
  log((await page.textContent("#screen-favorites")).includes("No favorites yet"), "favorites empty copy");
  await page.click('.tab[data-route="today"]');
  // Sprint 005 owns Today: the static "No card yet today" placeholder is replaced
  // by the live daily card + habit bar (applied toggle + streak). Assert the new
  // reality, not the removed placeholder.
  await page.waitForSelector("#today-mount button.applied-toggle");
  const todayCopy = await page.evaluate(() => ({
    noPlaceholder: !document.querySelector("#screen-today").textContent.includes("No card yet today"),
    hasToggle: !!document.querySelector("#today-mount button.applied-toggle"),
    hasCard: !!document.querySelector("#today-mount .card")
  }));
  log(todayCopy.noPlaceholder && todayCopy.hasToggle && todayCopy.hasCard, "today shows the dynamic daily card + habit bar (Sprint 005)", JSON.stringify(todayCopy));
  await page.click("#search-affordance");
  await page.waitForSelector("#screen-search:not([hidden])");
  log(await page.isVisible("#search-input"), "search input present");
  const bodyText = (await page.textContent("body")).toLowerCase();
  log(!/\b(todo|coming soon|lorem|placeholder)\b/.test(bodyText), "no TODO/coming soon/lorem/placeholder");

  // Step 4: theme persist
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const before = await bg(page);
  const lsBefore = await page.evaluate(() => localStorage.getItem("pdb.theme"));
  await page.click("#theme-toggle");
  const after = await bg(page);
  const lsAfter = await page.evaluate(() => localStorage.getItem("pdb.theme"));
  log(before !== after && lsAfter && lsAfter !== lsBefore, "theme toggle changes bg + localStorage", `${before}->${after} ls ${lsBefore}->${lsAfter}`);
  await page.reload({ waitUntil: "networkidle" });
  const afterReload = await bg(page);
  const lsReload = await page.evaluate(() => localStorage.getItem("pdb.theme"));
  log(afterReload === after && lsReload === lsAfter, "theme persists across reload", `${afterReload} ls ${lsReload}`);

  // Step 4b: anti-flash inline head script before stylesheet
  const flash = await page.evaluate(() => {
    const scripts = [...document.head.querySelectorAll("script")];
    const inline = scripts.find(s => !s.src && s.textContent.includes("pdb.theme") && s.textContent.includes("documentElement"));
    if (!inline) return { ok: false };
    const link = document.head.querySelector('link[rel="stylesheet"]');
    const nodes = [...document.head.childNodes];
    return { ok: nodes.indexOf(inline) < nodes.indexOf(link) };
  });
  log(flash.ok, "anti-flash inline script before stylesheet");

  // Step 5: routing survives reload
  await page.goto(BASE + "/#/browse", { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  log(await page.isVisible("#screen-browse"), "routing survives reload (#/browse)");

  // Step 6: unknown hash falls back to situations
  await page.goto(BASE + "/#/nonsense", { waitUntil: "networkidle" });
  log(await page.isVisible("#screen-situations"), "unknown hash -> Situations");

  // Step 7: keyboard focus reaches controls + toggle via keyboard
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const themeBefore = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await page.focus("#theme-toggle");
  await page.keyboard.press("Enter");
  const themeAfter = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  log(themeBefore !== themeAfter, "theme toggles via keyboard Enter", `${themeBefore}->${themeAfter}`);
  const focusable = await page.evaluate(() => {
    const ids = ["search-affordance", "theme-toggle"];
    return ids.every(id => { document.getElementById(id).focus(); return document.activeElement.id === id; });
  });
  log(focusable, "app-bar controls are focusable");

  // Step 8: manifest + icons
  const mani = await (await ctx.request.get(BASE + "/manifest.json")).json();
  const sizes = (mani.icons || []).map(i => i.sizes);
  log(mani.name && mani.short_name && mani.start_url && mani.display === "standalone" && sizes.includes("192x192") && sizes.includes("512x512"), "manifest keys + 192/512 icons listed", JSON.stringify(sizes));
  for (const p of ["icons/icon-192.png", "icons/icon-512.png"]) {
    const r = await ctx.request.get(BASE + "/" + p);
    const buf = await r.body();
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    log(r.status() === 200 && isPng, `icon ${p} 200 + PNG signature`);
  }

  // Step 9: service worker + offline (reload + cold goto + offline nav)
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!(reg && reg.active);
  });
  log(true, "service worker active");
  await ctx.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  log(await page.isVisible("#screen-situations"), "offline: reload renders shell");
  await page.click('.tab[data-route="browse"]');
  await page.waitForSelector("#screen-browse:not([hidden])").catch(() => {});
  log(await page.isVisible("#screen-browse"), "offline: tab nav still works");
  const cold = await newPage();
  await cold.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  log(await cold.isVisible("#screen-situations"), "offline: cold goto('/') renders shell");
  await cold.close();
  await ctx.setOffline(false);

  // /index.html path also loads (contract §8.2)
  await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });
  log(await page.isVisible("#screen-situations"), "/index.html renders shell");

  // Step 10: axe color-contrast + core rules, both themes, each screen
  const axeRules = ["color-contrast", "document-title", "html-has-lang", "label", "button-name", "link-name", "empty-heading"];
  // Scan at both 375px and 320px (narrow triggers the short wordmark — verifies h1 keeps a name)
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 667 });
    for (const theme of ["dark", "light"]) {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
      for (const route of ["situations", "browse", "favorites", "today", "search"]) {
        await page.goto(BASE + "/#/" + route, { waitUntil: "networkidle" });
        await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
        const res = await new AxeBuilder({ page }).withRules(axeRules).analyze();
        log(res.violations.length === 0, `axe ${width}px ${theme}/${route}`, res.violations.map(v => v.id).join(","));
      }
    }
  }
  await page.setViewportSize({ width: 375, height: 667 });
  // Confirm the h1 still has an accessible name at 320px specifically
  await page.setViewportSize({ width: 320, height: 667 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const h1name = await page.evaluate(() => document.querySelector("h1").innerText.trim());
  log(h1name.length > 0, "h1 has visible accessible name at 320px", `"${h1name}"`);
  await page.setViewportSize({ width: 375, height: 667 });

  // Step 11: reduced motion zeroes transitions
  const rm = await newPage();
  await rm.emulateMedia({ reducedMotion: "reduce" });
  await rm.goto(BASE + "/", { waitUntil: "networkidle" });
  await rm.click('.tab[data-route="browse"]');
  const durs = await rm.evaluate(() => {
    const el = document.querySelector(".screen:not([hidden])");
    const cs = getComputedStyle(el);
    return { a: cs.animationDuration, t: cs.transitionDuration };
  });
  log(durs.a === "0s" && (durs.t === "0s" || durs.t === "0s, 0s"), "reduced-motion zeroes animation/transition", JSON.stringify(durs));
  await rm.close();

  // Step 12: semantics
  const sem = await page.evaluate(() => {
    const h1 = [...document.querySelectorAll("h1")].filter(e => e.offsetParent !== null);
    return { lang: document.documentElement.lang, title: document.title, h1count: h1.length };
  });
  log(sem.lang === "en" && sem.title.length > 0 && sem.h1count === 1, "lang=en, title, exactly one h1", JSON.stringify(sem));

  // Step 13: console cleanliness
  log(errors.length === 0, "zero console errors/warnings", errors.slice(0, 5).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run().catch((e) => { console.error(e); process.exit(1); });
