/* Self-check for Sprint 002 content engine + card renderer against the contract.
   Run: python3 -m http.server 4173 (project root), then: node tests/content.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { extractResearch, normalize } from "../scripts/extract-content.mjs";

const BASE = process.env.BASE || "http://localhost:4173";
const PLACEHOLDERS = ["todo", "tbd", "lorem", "coming soon", "placeholder", "xxx"];
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
  const fws = data.frameworks;

  // Step 1: count + per-category counts
  log(fws.length === 74, "exactly 74 frameworks", `got ${fws.length}`);
  const want = { "improve-yourself": 18, "understand-yourself": 13, "understand-others": 13, "improve-others": 8, "mental-models": 7, "cognitive-biases": 6, "attention": 5, "decision-processes": 4 };
  const counts = {};
  fws.forEach((f) => { counts[f.category] = (counts[f.category] || 0) + 1; });
  log(JSON.stringify(counts) === JSON.stringify(want), "per-category counts 18/13/13/8 + 7/6/5/4", JSON.stringify(counts));

  // Step 2: field validity + placeholder scan
  const idRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const cats = new Set(Object.keys(want));
  const vtSet = new Set(data.VISUAL_TYPES);
  const seenIds = new Set();
  let badField = null, dupId = null, placeholderHit = null;
  const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
  for (const f of fws) {
    if (!idRe.test(f.id)) badField = `id ${f.id}`;
    if (seenIds.has(f.id)) dupId = f.id; seenIds.add(f.id);
    if (!nonEmpty(f.name) || !nonEmpty(f.trigger) || !nonEmpty(f.essence) || !nonEmpty(f.universalExample) || !nonEmpty(f.personalPrompt)) badField = badField || `empty string field in ${f.id}`;
    if (!Array.isArray(f.pitfalls) || f.pitfalls.length < 1 || !f.pitfalls.every(nonEmpty)) badField = badField || `pitfalls in ${f.id}`;
    if (!cats.has(f.category)) badField = badField || `category ${f.category}`;
    if (!vtSet.has(f.visualType)) badField = badField || `visualType ${f.visualType} in ${f.id}`;
    if ("steps" in f && (!Array.isArray(f.steps) || f.steps.length < 2 || !f.steps.every(nonEmpty))) badField = badField || `steps in ${f.id}`;
    const blob = [f.name, f.trigger, f.essence, f.universalExample, f.personalPrompt, ...(f.pitfalls || []), ...(f.steps || [])].join(" ").toLowerCase();
    for (const p of PLACEHOLDERS) { if (blob.includes(p)) placeholderHit = placeholderHit || `${p} in ${f.id}`; }
  }
  log(!badField, "all fields schema-valid", badField || "");
  log(!dupId, "all ids unique", dupId || "");
  log(!placeholderHit, "no placeholder tokens", placeholderHit || "");

  // Step 3: B5 — every personalPrompt ends with ?
  const notQ = fws.filter((f) => !f.personalPrompt.trim().endsWith("?")).map((f) => f.id);
  log(notQ.length === 0, "every personalPrompt ends with '?'", notQ.join(","));

  // Step 3b: Sprint 001 examples[] engine, core 52 (B24-B27, D1-D5).
  // Token lists are hardcoded inline here per contract §6.1 (authoritative);
  // NOT loaded from the trace artifact (avoids the bootstrap problem).
  const CORE_CATS = new Set(["improve-yourself", "understand-yourself", "understand-others", "improve-others"]);
  const EXT_CATS = new Set(["mental-models", "cognitive-biases", "attention", "decision-processes"]);
  const PERSONA_ORDER = ["everyday", "student", "relationship", "high-achiever", "privileged"];
  // D3 helper — hasStakesToken(scenario)
  const stakesRes = [
    /[0-9]/,
    /[₹$€£]/,
    /\b(day|days|week|weeks|month|months|year|years|hour|hours|minute|minutes|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tonight|tomorrow)\b/i,
    /\b(manager|boss|spouse|husband|wife|partner|parent|mother|father|mom|dad|son|daughter|friend|teacher|co-founder|client|landlord|sister|brother|in-law)\b/i
  ];
  const hasStakesToken = (s) => stakesRes.some((r) => r.test(s));
  // D4 helper — hasCostMarker(tradeoff)
  const costRe = /\b(cost|costs|price|give up|gives up|lose|loss|risk|sacrifice|trade|traded|forfeit|at the expense|you may|could miss|downside|pay|pays)\b/i;
  const hasCostMarker = (s) => costRe.test(s);
  const BAD_TRADE = /\b(no downside|pure win|no trade-?off)\b/i;

  const coreFws = fws.filter((f) => CORE_CATS.has(f.category));
  const extFws = fws.filter((f) => EXT_CATS.has(f.category));
  // 52-and-only-52 have examples; none in the 4 extension categories.
  const coreWithEx = coreFws.filter((f) => f.examples);
  const extWithEx = extFws.filter((f) => f.examples);
  log(coreWithEx.length === 52, "exactly the 52 core frameworks carry examples[]", `core-with-examples=${coreWithEx.length}`);
  log(extWithEx.length === 0, "no extension framework carries examples[] yet (Sprint 002)", `ext-with-examples=${extWithEx.length}`);

  let d1 = null, d2 = null, d3 = null, d4 = null, d5 = null, d8 = null;
  for (const f of coreWithEx) {
    const ex = f.examples;
    // D1 — array of 5, personas fixed order, non-empty scenario+tradeoff
    if (!Array.isArray(ex) || ex.length !== 5) { d1 = d1 || `${f.id}: not length 5`; continue; }
    ex.forEach((e, k) => {
      if (e.persona !== PERSONA_ORDER[k]) d1 = d1 || `${f.id}: persona[${k}]=${e.persona}`;
      if (!nonEmpty(e.scenario)) d1 = d1 || `${f.id}/${e.persona}: empty scenario`;
      if (!nonEmpty(e.tradeoff)) d1 = d1 || `${f.id}/${e.persona}: empty tradeoff`;
      // D3 — every scenario has a stakes token
      if (nonEmpty(e.scenario) && !hasStakesToken(e.scenario)) d3 = d3 || `${f.id}/${e.persona}`;
      // D4 — every tradeoff has a cost marker and is not a "pure win"
      if (nonEmpty(e.tradeoff) && (!hasCostMarker(e.tradeoff) || BAD_TRADE.test(e.tradeoff))) d4 = d4 || `${f.id}/${e.persona}`;
      // D8 — no placeholder tokens in any scenario OR tradeoff (all 5×52 strings, not just featured)
      const exBlob = `${e.scenario} ${e.tradeoff}`.toLowerCase();
      for (const p of PLACEHOLDERS) { if (exBlob.includes(p)) d8 = d8 || `${p} in ${f.id}/${e.persona}`; }
    });
    // D2 — featured int 0..4
    if (!Number.isInteger(f.featured) || f.featured < 0 || f.featured > 4) d2 = d2 || `${f.id}: featured=${f.featured}`;
    // D5 — universalExample === examples[featured].scenario (byte equality)
    if (Number.isInteger(f.featured) && f.examples[f.featured] && f.universalExample !== f.examples[f.featured].scenario) d5 = d5 || f.id;
  }
  log(!d1, "D1: 52 core have 5 personas in fixed order, non-empty scenario+tradeoff", d1 || "");
  log(!d2, "D2: featured is an int 0..4 for all 52", d2 || "");
  log(!d3, "D3: every scenario (all 5×52) carries a concrete stakes token", d3 || "");
  log(!d4, "D4: every tradeoff (all 5×52) carries an explicit cost marker", d4 || "");
  log(!d5, "D5: universalExample === examples[featured].scenario for all 52", d5 || "");
  log(!d8, "D8: no placeholder tokens in any of the 5×52 scenarios/tradeoffs", d8 || "");

  // Step 4: visual-type diversity >= 12
  const usedVT = new Set(fws.map((f) => f.visualType));
  log(Array.isArray(data.VISUAL_TYPES) && data.VISUAL_TYPES.length > 0 && usedVT.size >= 12, "≥12 distinct visualType used", `${usedVT.size}`);

  // Step 5: B2 verbatim match against RESEARCH.md (symmetric normalize)
  const research = extractResearch();
  let b2fail = null;
  for (let i = 0; i < fws.length; i++) {
    const r = research[i], f = fws[i];
    if (normalize(f.trigger) !== normalize(r.trigger)) b2fail = b2fail || `trigger#${i + 1} ${f.id}: "${f.trigger}" != "${r.trigger}"`;
    if (normalize(f.essence) !== normalize(r.essence)) b2fail = b2fail || `essence#${i + 1} ${f.id}`;
  }
  log(!b2fail, "trigger/essence byte-match RESEARCH.md (B2)", b2fail || "");

  // Step 6: card render — all 74
  let renderFail = null, promptLastFail = null, stepsFail = null;
  for (const f of fws) {
    await page.goto(BASE + "/#/f/" + f.id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    const info = await page.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      if (!card) return { ok: false };
      const h2 = card.querySelector("h2.card-name");
      const figcap = card.querySelector(".card-figcaption-name");
      const example = card.querySelector(".card-example-text");
      const pitfalls = card.querySelectorAll(".card-pitfalls-list li");
      const prompt = card.querySelector(".card-prompt");
      const last = card.lastElementChild;
      const steps = [...card.querySelectorAll(".card-steps-list li")].map((li) => li.textContent);
      return {
        ok: true,
        name: h2 ? h2.textContent : "",
        h2id: h2 ? h2.id : "",
        trigger: (card.querySelector(".card-trigger-text") || {}).textContent || "",
        figcap: figcap ? figcap.textContent.trim() : "",
        essence: (card.querySelector(".card-essence-text") || {}).textContent || "",
        example: example ? example.textContent : "",
        pitCount: pitfalls.length,
        promptLast: prompt && last === prompt,
        steps
      };
    });
    if (!info.ok || info.name !== f.name || info.h2id !== "h-framework" ||
        !info.trigger.includes(f.trigger.slice(0, 12)) || !info.figcap ||
        !info.essence.includes(f.essence.slice(0, 20)) ||
        info.example !== f.universalExample || info.pitCount !== f.pitfalls.length) {
      renderFail = renderFail || f.id;
    }
    if (!info.promptLast) promptLastFail = promptLastFail || f.id;
    const hasSteps = Array.isArray(f.steps) && f.steps.length;
    if (hasSteps) { if (info.steps.length !== f.steps.length) stepsFail = stepsFail || `${f.id} steps missing`; }
    else if (info.steps.length !== 0) stepsFail = stepsFail || `${f.id} unexpected steps container`;
  }
  log(!renderFail, "all 74 cards render the six parts (B4)", renderFail || "");
  log(!promptLastFail, "personalPrompt is the terminal block (B5)", promptLastFail || "");
  log(!stepsFail, "steps render only when present", stepsFail || "");

  // Step 7: data-driven renderer with a synthetic entry (no renderer edits)
  const synthOk = await page.evaluate(() => {
    const synthetic = {
      id: "zzz-synthetic-test", name: "Synthetic Test Model", category: "mental-models",
      trigger: "\"A brand new made-up trigger\"", essence: "A synthetic essence sentence for the generic renderer test.",
      visualType: "matrix-2x2", universalExample: "A synthetic worked example proving the renderer is generic.",
      personalPrompt: "Does this synthetic card render correctly without editing the renderer?",
      pitfalls: ["A synthetic pitfall one.", "A synthetic pitfall two."],
      steps: ["Synthetic step one.", "Synthetic step two."]
    };
    const mount = document.getElementById("framework-mount");
    window.PDB_CARD.renderCard(synthetic, mount, window.PDB_DATA);
    const card = mount.querySelector(".card");
    const name = card.querySelector("h2.card-name").textContent;
    const prompt = card.querySelector(".card-prompt");
    const promptLast = card.lastElementChild === prompt;
    const steps = card.querySelectorAll(".card-steps-list li").length;
    const example = card.querySelector(".card-example-text").textContent;
    return name === "Synthetic Test Model" && promptLast && steps === 2 && example === synthetic.universalExample;
  });
  log(synthOk, "synthetic entry renders via card API (generic renderer, B4)");

  // Step 8: not-found (garbage + empty id)
  for (const bad of ["definitely-not-real", ""]) {
    await page.goto(BASE + "/#/f/" + bad, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    const nf = await page.evaluate(() => {
      const w = document.querySelector("#framework-mount .card-notfound");
      if (!w) return { ok: false };
      const h2 = w.querySelector("h2.card-notfound-title");
      const links = [...w.querySelectorAll("a.btn-link")].map((a) => a.getAttribute("href"));
      return { ok: true, heading: h2 ? h2.textContent : "", body: w.textContent, links };
    });
    log(nf.ok && /not found/i.test(nf.heading) && nf.body.includes("No framework with that id.") &&
        nf.links.includes("#/situations") && nf.links.includes("#/browse"),
        `not-found state for "${bad || "(empty)"}"`, JSON.stringify(nf.links));
  }

  // Step 9: no horizontal scroll on the longest card (375 + 320)
  const longest = fws.map((f) => ({ id: f.id, len: [f.name, f.trigger, f.essence, f.universalExample, f.personalPrompt, ...(f.pitfalls || []), ...(f.steps || [])].join(" ").length }))
    .sort((a, b) => b.len - a.len)[0];
  await page.goto(BASE + "/#/f/" + longest.id, { waitUntil: "networkidle" });
  for (const w of [375, 320]) {
    await page.setViewportSize({ width: w, height: 667 });
    const noScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
      document.body.scrollWidth <= window.innerWidth);
    log(noScroll, `no horizontal scroll at ${w}px on longest card (${longest.id})`);
  }
  await page.setViewportSize({ width: 375, height: 667 });

  // Step 10: axe on a rendered card, both themes
  const axeRules = ["color-contrast", "document-title", "html-has-lang", "list", "listitem", "link-name", "empty-heading"];
  // Scan a plain card, a steps-bearing card, and the not-found state (has .btn-link).
  const axeTargets = [fws[0].id, "ooda-loop", "definitely-not-real"];
  const expectBg = { dark: "rgb(18, 20, 28)", light: "rgb(244, 241, 233)" };
  // Zero motion so switching data-theme applies instantly — axe scans a settled
  // frame, never a mid-transition color that a normally-loaded card never shows.
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["dark", "light"]) {
    for (const id of axeTargets) {
      await page.goto(BASE + "/#/f/" + id, { waitUntil: "networkidle" });
      await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
      await page.waitForFunction((bg) => getComputedStyle(document.body).backgroundColor === bg, expectBg[theme]);
      const res = await new AxeBuilder({ page }).withRules(axeRules).analyze();
      log(res.violations.length === 0, `axe card ${theme}/${id}`, res.violations.map((v) => v.id).join(","));
    }
  }
  await page.emulateMedia({ reducedMotion: null });

  // Step 11: offline card render + sw cache bump
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForFunction(async () => { const r = await navigator.serviceWorker.ready; return !!(r && r.active); });
  await ctx.setOffline(true);
  const cold = await newPage();
  await cold.goto(BASE + "/#/f/" + fws[0].id, { waitUntil: "domcontentloaded" });
  await cold.waitForSelector("#screen-framework:not([hidden])").catch(() => {});
  const offlineOk = await cold.evaluate(() => !!document.querySelector("#framework-mount .card .card-name"));
  log(offlineOk, "offline: cold goto('/#/f/:id') renders full card (B20)");
  await cold.close();
  await ctx.setOffline(false);
  const swSrc = await (await ctx.request.get(BASE + "/sw.js")).text();
  // The shell cache version is bumped every sprint that adds precached assets
  // (v2 content, v3 visuals, v4 nav modules); this regression check tracks the
  // CURRENT version so it stays green after each bump — same pattern as v2→v3.
  log(/pdb-shell-v8/.test(swSrc) && !/"pdb-shell-v1"/.test(swSrc), "sw cache bumped (v8)");
  log(/js\/data\.js/.test(swSrc) && /js\/card\.js/.test(swSrc), "sw precaches data.js + card.js");

  // Step 12: Sprint 001 non-regression — five screens keep honest copy, no card leak
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const legacy = await page.evaluate(() => ({
    situations: document.querySelector("#screen-situations").textContent.includes("Start where you are"),
    browse: document.querySelector("#screen-browse").textContent.includes("Browse the shelf"),
    favorites: document.querySelector("#screen-favorites").textContent.includes("No favorites yet"),
    // Sprint 005 replaced the Today placeholder with a live daily card (rendered
    // on visit); the honest current state is that the old placeholder is gone.
    today: !document.querySelector("#screen-today").textContent.includes("No card yet today"),
    search: !!document.querySelector("#screen-search #search-input"),
    // Today now legitimately owns a card; the other four screens must not leak one.
    noCardLeak: !document.querySelector("#screen-situations .card, #screen-browse .card, #screen-favorites .card, #screen-search .card")
  }));
  log(Object.values(legacy).every(Boolean), "Sprint 001 screens intact, no card leak", JSON.stringify(legacy));

  // Step 13: console cleanliness
  log(errors.length === 0, "zero console errors/warnings", errors.slice(0, 5).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run().catch((e) => { console.error(e); process.exit(1); });
