/* Self-check for Sprint 003 original SVG visuals against the contract (§9/§10).
   Run: python3 -m http.server 4173 (project root), then: node tests/visuals.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate, not the Evaluator's suite.
   Emits both-theme screenshots (≥37, one per visualType) to test-results/visuals/. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:4173";
const SHOTDIR = resolve(HERE, "..", "test-results", "visuals");
let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

const run = async () => {
  mkdirSync(SHOTDIR, { recursive: true });
  const browser = await chromium.launch();
  // reduced motion so nothing animates during measurement/screenshots (determinism)
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
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
  const fws = data.frameworks;
  const VISUAL_TYPES = data.VISUAL_TYPES;

  // ---- Step 1: coverage — every VISUAL_TYPE has a renderer; returns SVGSVGElement ----
  const cov = await page.evaluate((types) => {
    const V = window.PDB_VISUALS;
    const has = V && V.HAS ? Object.keys(V.HAS) : [];
    const missing = types.filter((t) => !(V && V.HAS && (V.HAS[t] || (V.HAS.has && V.HAS.has(t)))));
    const badReturn = [];
    for (const t of types) {
      const el = V.renderVisual({ visualType: t });
      // SVGSVGElement check (works in-page)
      if (!(el instanceof SVGSVGElement)) badReturn.push(t);
    }
    return { hasCount: has.length, missing, badReturn };
  }, VISUAL_TYPES);
  log(cov.missing.length === 0, "every VISUAL_TYPE has a dedicated renderer (37/37)", cov.missing.join(","));
  log(cov.hasCount >= 37, "PDB_VISUALS.HAS covers ≥37 forms", `${cov.hasCount}`);
  log(cov.badReturn.length === 0, "renderVisual returns an SVGSVGElement for every type", cov.badReturn.join(","));

  // ---- Step 2: every framework renders an inline <svg>; card intact; token gone ----
  let noSvg = "", cardBroken = "", tokenPresent = "";
  for (const f of fws) {
    await page.goto(BASE + "/#/f/" + f.id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    const info = await page.evaluate(() => {
      const fig = document.querySelector(".card-figure");
      const svg = fig ? fig.querySelector(":scope > svg") : null;
      const card = document.querySelector(".card");
      const parts = card ? {
        name: !!card.querySelector("h2.card-name"),
        trigger: !!card.querySelector(".card-trigger-text"),
        essence: !!card.querySelector(".card-essence-text"),
        example: !!card.querySelector(".card-example-text"),
        pitfalls: card.querySelectorAll(".card-pitfalls-list li").length,
        prompt: !!card.querySelector(".card-prompt-text")
      } : null;
      // prompt must be the LAST card-part (B5)
      const partsEls = card ? Array.from(card.querySelectorAll(".card-part")) : [];
      const promptLast = partsEls.length && partsEls[partsEls.length - 1].classList.contains("card-prompt");
      const token = !!document.querySelector(".card-figure-token");
      return { hasSvg: !!svg, tag: svg ? svg.tagName.toLowerCase() : null, parts, promptLast, token };
    });
    if (!info.hasSvg || info.tag !== "svg") noSvg = noSvg || f.id;
    if (!info.parts || !info.parts.name || !info.parts.trigger || !info.parts.essence ||
        !info.parts.example || info.parts.pitfalls < 1 || !info.parts.prompt || !info.promptLast) cardBroken = cardBroken || f.id;
    if (info.token) tokenPresent = tokenPresent || f.id;
  }
  log(noSvg === "", "all 74 frameworks render an inline <svg> in the figure", noSvg);
  log(cardBroken === "", "six-part card intact (name/trigger/essence/example/≥1 pitfall/prompt-last)", cardBroken);
  log(tokenPresent === "", "Sprint-002 placeholder token (.card-figure-token) is gone", tokenPresent);

  // ---- Step 3: no external image/network for imagery ----
  const imgReqs = [];
  page.on("request", (r) => {
    const t = r.resourceType();
    if (t === "image" || t === "media") imgReqs.push(r.url());
  });
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  const domImagery = await page.evaluate(() => {
    const fig = document.querySelector(".card-figure");
    const imgs = fig.querySelectorAll("img, image");
    const uses = Array.from(fig.querySelectorAll("use")).filter((u) => {
      const h = u.getAttribute("href") || u.getAttribute("xlink:href") || "";
      return h && !h.startsWith("#");
    });
    // any CSS background-image on figure/svg descendants?
    const bg = Array.from(fig.querySelectorAll("*")).some((e) => {
      const b = getComputedStyle(e).backgroundImage;
      return b && b !== "none";
    });
    return { imgs: imgs.length, uses: uses.length, bg };
  });
  log(imgReqs.length === 0, "zero network image/media requests when loading a card", imgReqs.join(","));
  log(domImagery.imgs === 0 && domImagery.uses === 0 && !domImagery.bg,
    "no <img>/<image>/external <use>/CSS url() imagery in the figure", JSON.stringify(domImagery));

  // ---- sample: first framework id per visualType ----
  const byType = {};
  for (const f of fws) if (!byType[f.visualType]) byType[f.visualType] = f.id;

  // ---- Step 4/5: no zero-collapse + rendered legibility, one per visualType ----
  let collapse = "", tinyText = "", clipped = "";
  for (const vt of VISUAL_TYPES) {
    const id = byType[vt];
    await page.goto(BASE + "/#/f/" + id, { waitUntil: "networkidle" });
    await page.waitForSelector(".card-figure > svg");
    const m = await page.evaluate(() => {
      const svg = document.querySelector(".card-figure > svg");
      const sr = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const scale = sr.width / vb.width;
      const texts = Array.from(svg.querySelectorAll("text"));
      const measures = texts.map((t) => {
        const fs = parseFloat(getComputedStyle(t).fontSize) || 0; // in user units
        const tr = t.getBoundingClientRect();
        // clipped if text box escapes the svg box (small tolerance)
        const inside = tr.left >= sr.left - 1 && tr.right <= sr.right + 1 &&
                       tr.top >= sr.top - 1 && tr.bottom <= sr.bottom + 1;
        return { effective: fs * scale, renderedH: tr.height, inside, txt: t.textContent };
      });
      return { w: sr.width, h: sr.height, measures };
    });
    if (m.h < 80 || m.w < 40) collapse = collapse || `${vt}(${Math.round(m.w)}x${Math.round(m.h)})`;
    for (const t of m.measures) {
      if (t.effective < 11 || t.renderedH < 11) tinyText = tinyText || `${vt}:"${t.txt}"(${t.effective.toFixed(1)}/${t.renderedH.toFixed(1)}px)`;
      if (!t.inside) clipped = clipped || `${vt}:"${t.txt}"`;
    }
  }
  log(collapse === "", "no SVG collapses: rendered h≥80 & w≥40 at 375px (every type)", collapse);
  log(tinyText === "", "every SVG <text> renders ≥11px effective at 375px", tinyText);
  log(clipped === "", "no SVG <text> clipped at the svg edge", clipped);

  // ---- Step 6: determinism — same id twice → identical outerHTML ----
  await page.goto(BASE + "/#/f/ooda-loop", { waitUntil: "networkidle" });
  const a = await page.evaluate(() => document.querySelector(".card-figure > svg").outerHTML);
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  await page.goto(BASE + "/#/f/ooda-loop", { waitUntil: "networkidle" });
  const b = await page.evaluate(() => document.querySelector(".card-figure > svg").outerHTML);
  log(a === b && a.length > 0, "deterministic: re-rendering same id yields identical SVG markup");
  const src = readFileSync(resolve(HERE, "..", "js", "visuals.js"), "utf8");
  log(!/Math\.random/.test(src) && !/\bDate\b/.test(src), "js/visuals.js contains no Math.random / Date");

  // ---- Step 7: unknown-type fallback returns a safe SVG, no throw ----
  const fb = await page.evaluate(() => {
    try {
      const el = window.PDB_VISUALS.renderVisual({ id: "x", visualType: "totally-bogus-form-xyz" });
      return { ok: el instanceof SVGSVGElement, kids: el.childNodes.length };
    } catch (e) { return { ok: false, err: String(e) }; }
  });
  log(fb.ok && fb.kids > 0, "unknown visualType → generic fallback SVG (no throw)", JSON.stringify(fb));

  // ---- Step 8: no horizontal scroll at 375 & 320 on a complex-SVG card ----
  let hscroll = "";
  for (const w of [375, 320]) {
    await page.setViewportSize({ width: w, height: 812 });
    await page.goto(BASE + "/#/f/" + byType["radar"], { waitUntil: "networkidle" });
    const s = await page.evaluate(() => ({
      de: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      body: document.body.scrollWidth <= window.innerWidth
    }));
    if (!s.de || !s.body) hscroll = hscroll || `${w}px`;
  }
  log(hscroll === "", "no horizontal scroll at 375px & 320px on the card", hscroll);
  await page.setViewportSize({ width: 375, height: 812 });

  // ---- Step 9: F-001 — confirmation-bias trigger no literal */_; scan all 74 ----
  await page.goto(BASE + "/#/f/confirmation-bias", { waitUntil: "networkidle" });
  const cbTrig = await page.evaluate(() => (document.querySelector(".card-trigger-text") || {}).textContent || "");
  log(cbTrig.indexOf("*") === -1 && cbTrig.indexOf("_") === -1 && /satisfied by evidence/.test(cbTrig),
    "F-001: confirmation-bias trigger has no literal */_", cbTrig);
  const strayScan = fws.filter((f) => /[*_]/.test(f.trigger) || /[*_]/.test(f.essence)).map((f) => f.id);
  log(strayScan.length === 0, "F-001: no stray */_ emphasis markers across all 74 triggers/essences", strayScan.join(","));

  // ---- Step 10: axe on a rendered card, both themes (no color-contrast/svg-img-alt/list/link-name) ----
  const axeRules = ["color-contrast", "svg-img-alt", "list", "link-name", "document-title", "html-has-lang"];
  for (const theme of ["dark", "light"]) {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
    await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
    await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    const res = await new AxeBuilder({ page }).withRules(axeRules).analyze();
    log(res.violations.length === 0, `axe card ${theme} (contrast/svg-img-alt/list/link-name)`, res.violations.map((v) => v.id).join(","));
  }

  // ---- Step 11: SVG aria-hidden (figcaption is the a11y name) ----
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  const aria = await page.evaluate(() => {
    const svg = document.querySelector(".card-figure > svg");
    const cap = document.querySelector(".card-figcaption");
    return { hidden: svg.getAttribute("aria-hidden") === "true", cap: cap ? cap.textContent.trim().length > 0 : false };
  });
  log(aria.hidden && aria.cap, "SVG is aria-hidden; figcaption present as a11y name");

  // ---- Step 12: not-found still clean (no regression) ----
  await page.goto(BASE + "/#/f/garbage-id-xyz", { waitUntil: "networkidle" });
  const nf = await page.evaluate(() => ({
    state: (document.getElementById("framework-mount") || {}).getAttribute && document.getElementById("framework-mount").getAttribute("data-state"),
    title: !!document.querySelector(".card-notfound-title")
  }));
  log(nf.title, "not-found card still renders (no regression)");

  // ---- Step 13: both-theme screenshots, one per visualType (≥37) ----
  let shots = 0;
  for (const theme of ["dark", "light"]) {
    for (const vt of VISUAL_TYPES) {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
      await page.goto(BASE + "/#/f/" + byType[vt], { waitUntil: "networkidle" });
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      const fig = await page.$(".card-figure");
      if (fig) { await fig.screenshot({ path: resolve(SHOTDIR, `${vt}-${theme}.png`) }); shots++; }
    }
  }
  log(shots >= 74, `both-theme figure screenshots emitted to test-results/visuals/ (${shots})`);

  // ---- Step 14: offline card render incl. SVG (B20) + sw.js bumped ----
  const off = await newPage();
  await off.goto(BASE + "/", { waitUntil: "networkidle" });
  await off.evaluate(async () => { await navigator.serviceWorker.ready; });
  await off.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 8000 }).catch(() => {});
  await ctx.setOffline(true);
  const cold = await newPage();
  await cold.goto(BASE + "/#/f/pre-mortem", { waitUntil: "domcontentloaded" });
  await cold.waitForSelector("#screen-framework:not([hidden])", { timeout: 8000 }).catch(() => {});
  const offOk = await cold.evaluate(() => {
    const svg = document.querySelector(".card-figure > svg");
    const name = document.querySelector("h2.card-name");
    return !!svg && !!name;
  }).catch(() => false);
  log(offOk, "offline: cold goto('/#/f/:id') renders full card INCLUDING its SVG (B20)");
  await ctx.setOffline(false);
  await cold.close(); await off.close();

  const swSrc = readFileSync(resolve(HERE, "..", "sw.js"), "utf8");
  log(/pdb-shell-v5/.test(swSrc), "sw.js cache bumped to pdb-shell-v5");
  log(/js\/visuals\.js/.test(swSrc), "sw.js precaches js/visuals.js");
  log(/keys\.filter[\s\S]*caches\.delete/.test(swSrc), "sw.js activate purges old cache");

  // ---- Step 15: console cleanliness ----
  log(errors.length === 0, "zero console errors/warnings across the suite", errors.slice(0, 4).join(" | "));

  await browser.close();
  console.log(`\n${pass}/${pass + fail} checks passed.`);
  if (fail > 0) process.exit(1);
};

run().catch((e) => { console.error(e); process.exit(1); });
