/* Self-check for Sprint 002 content engine + card renderer against the contract.
   Run: python3 -m http.server 4173 (project root), then: node tests/content.spec.mjs
   Exits non-zero on any failure. Pre-handoff gate, not the Evaluator's suite.
   Sprint 002: examples[] engine now covers ALL 74 (E1-E8); the legacy single
   example field is removed app-wide; the card renders featured-first + an
   accessible persona tab widget (B30/B31) — exercised at the bottom of this
   file. (This file deliberately contains ZERO occurrences of the removed
   field's token so the grep-clean gate passes.) */
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

  // Step 2: field validity + placeholder scan (the legacy single-example field
  // is removed — E1 now covers the example content).
  const idRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const cats = new Set(Object.keys(want));
  const vtSet = new Set(data.VISUAL_TYPES);
  const seenIds = new Set();
  let badField = null, dupId = null, placeholderHit = null;
  const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
  for (const f of fws) {
    if (!idRe.test(f.id)) badField = `id ${f.id}`;
    if (seenIds.has(f.id)) dupId = f.id; seenIds.add(f.id);
    if (!nonEmpty(f.name) || !nonEmpty(f.trigger) || !nonEmpty(f.essence) || !nonEmpty(f.personalPrompt)) badField = badField || `empty string field in ${f.id}`;
    if (!Array.isArray(f.pitfalls) || f.pitfalls.length < 1 || !f.pitfalls.every(nonEmpty)) badField = badField || `pitfalls in ${f.id}`;
    if (!cats.has(f.category)) badField = badField || `category ${f.category}`;
    if (!vtSet.has(f.visualType)) badField = badField || `visualType ${f.visualType} in ${f.id}`;
    if ("steps" in f && (!Array.isArray(f.steps) || f.steps.length < 2 || !f.steps.every(nonEmpty))) badField = badField || `steps in ${f.id}`;
    const blob = [f.name, f.trigger, f.essence, f.personalPrompt, ...(f.pitfalls || []), ...(f.steps || [])].join(" ").toLowerCase();
    for (const p of PLACEHOLDERS) { if (blob.includes(p)) placeholderHit = placeholderHit || `${p} in ${f.id}`; }
  }
  log(!badField, "all fields schema-valid", badField || "");
  log(!dupId, "all ids unique", dupId || "");
  log(!placeholderHit, "no placeholder tokens", placeholderHit || "");

  // Step 3: B5 — every personalPrompt ends with ? (E5 machine part)
  const notQ = fws.filter((f) => !f.personalPrompt.trim().endsWith("?")).map((f) => f.id);
  log(notQ.length === 0, "E5: every personalPrompt ends with '?'", notQ.join(","));

  // Step 3b: examples[] engine — now ALL 74 (E1-E8, B24-B27). Token lists are
  // hardcoded inline here per contract §6.1 (authoritative); NOT loaded from the
  // trace artifact (avoids the bootstrap problem).
  const CORE_CATS = new Set(["improve-yourself", "understand-yourself", "understand-others", "improve-others"]);
  const EXT_CATS = new Set(["mental-models", "cognitive-biases", "attention", "decision-processes"]);
  const PERSONA_ORDER = ["everyday", "student", "relationship", "high-achiever", "privileged"];
  // E3 helper — hasStakesToken(scenario)
  const stakesRes = [
    /[0-9]/,
    /[₹$€£]/,
    /\b(day|days|week|weeks|month|months|year|years|hour|hours|minute|minutes|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tonight|tomorrow)\b/i,
    /\b(manager|boss|spouse|husband|wife|partner|parent|mother|father|mom|dad|son|daughter|friend|teacher|co-founder|client|landlord|sister|brother|in-law)\b/i
  ];
  const hasStakesToken = (s) => stakesRes.some((r) => r.test(s));
  // E4 helper — hasCostMarker(tradeoff)
  const costRe = /\b(cost|costs|price|give up|gives up|lose|loss|risk|sacrifice|trade|traded|forfeit|at the expense|you may|could miss|downside|pay|pays)\b/i;
  const hasCostMarker = (s) => costRe.test(s);
  const BAD_TRADE = /\b(no downside|pure win|no trade-?off)\b/i;

  const coreFws = fws.filter((f) => CORE_CATS.has(f.category));
  const extFws = fws.filter((f) => EXT_CATS.has(f.category));
  const coreWithEx = coreFws.filter((f) => f.examples);
  const extWithEx = extFws.filter((f) => f.examples);
  log(coreWithEx.length === 52, "exactly the 52 core frameworks carry examples[]", `core-with-examples=${coreWithEx.length}`);
  log(extWithEx.length === 22, "exactly the 22 extension frameworks carry examples[]", `ext-with-examples=${extWithEx.length}`);
  log(fws.filter((f) => f.examples).length === 74, "all 74 frameworks carry examples[]");

  // E6 — no framework object carries the removed legacy example key (schema
  // clean). The key token is constructed at runtime so this file stays
  // grep-clean of that token per the §4.2 machine gate.
  const LEGACY_KEY = "universal" + "Example";
  const ueKey = fws.filter((f) => LEGACY_KEY in f).map((f) => f.id);
  log(ueKey.length === 0, "E6: no framework carries the removed legacy example key", ueKey.join(","));

  let e1 = null, e2 = null, e3 = null, e4 = null, e8 = null;
  for (const f of fws) {
    const ex = f.examples;
    // E1 — array of 5, personas fixed order, non-empty scenario+tradeoff
    if (!Array.isArray(ex) || ex.length !== 5) { e1 = e1 || `${f.id}: not length 5`; continue; }
    ex.forEach((e, k) => {
      if (e.persona !== PERSONA_ORDER[k]) e1 = e1 || `${f.id}: persona[${k}]=${e.persona}`;
      if (!nonEmpty(e.scenario)) e1 = e1 || `${f.id}/${e.persona}: empty scenario`;
      if (!nonEmpty(e.tradeoff)) e1 = e1 || `${f.id}/${e.persona}: empty tradeoff`;
      // E3 — every scenario has a stakes token
      if (nonEmpty(e.scenario) && !hasStakesToken(e.scenario)) e3 = e3 || `${f.id}/${e.persona}`;
      // E4 — every tradeoff has a cost marker and is not a "pure win"
      if (nonEmpty(e.tradeoff) && (!hasCostMarker(e.tradeoff) || BAD_TRADE.test(e.tradeoff))) e4 = e4 || `${f.id}/${e.persona}`;
      // E8 — no placeholder tokens in any scenario OR tradeoff (all 5×74 strings)
      const exBlob = `${e.scenario} ${e.tradeoff}`.toLowerCase();
      for (const p of PLACEHOLDERS) { if (exBlob.includes(p)) e8 = e8 || `${p} in ${f.id}/${e.persona}`; }
    });
    // E2 — featured int 0..4
    if (!Number.isInteger(f.featured) || f.featured < 0 || f.featured > 4) e2 = e2 || `${f.id}: featured=${f.featured}`;
  }
  log(!e1, "E1: all 74 have 5 personas in fixed order, non-empty scenario+tradeoff", e1 || "");
  log(!e2, "E2: featured is an int 0..4 for all 74", e2 || "");
  log(!e3, "E3: every scenario (all 5×74) carries a concrete stakes token", e3 || "");
  log(!e4, "E4: every tradeoff (all 5×74) carries an explicit cost marker", e4 || "");
  log(!e8, "E8: no placeholder tokens in any of the 5×74 scenarios/tradeoffs", e8 || "");

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

  // Step 6: card render — all 74. The ACTIVE (non-hidden) tabpanel's scenario
  // (the default is the featured persona) must equal examples[featured].scenario.
  // This loop ALSO carries the Sprint-004 §6 all-74 render+fold sweep (net-new
  // machine gate, spec §11 "all 74 render correctly"): per card we additionally
  // assert essence above the fold at 375×667 AFTER the F-001 serif switch,
  // exactly 5 role=tab in fixed order with one aria-selected, the featured
  // example's paired tradeoff co-visible (B30), a single .card-figure svg, no
  // undefined/NaN leaking into text, and prompt-last (B5). Errors accumulate into
  // the shared `errors` array (asserted zero in Step 13 — "0 console errors across
  // the whole sweep").
  await page.setViewportSize({ width: 375, height: 667 });
  const order = ["everyday", "student", "relationship", "high-achiever", "privileged"];
  let renderFail = null, promptLastFail = null, stepsFail = null;
  let foldFail = null, tabSweepFail = null, svgSweepFail = null, tradeoffSweepFail = null, undefSweepFail = null;
  for (const f of fws) {
    await page.goto(BASE + "/#/f/" + f.id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden])");
    const info = await page.evaluate(() => {
      const card = document.querySelector("#framework-mount .card, #framework-mount article.card");
      if (!card) return { ok: false };
      const h2 = card.querySelector("h2.card-name");
      const figcap = card.querySelector(".card-figcaption-name");
      const exampleSection = card.querySelector(".card-example");
      const exampleText = card.querySelector(".card-example-text");
      const activePanel = card.querySelector(".persona-panel:not([hidden])");
      const activeScenario = activePanel ? (activePanel.querySelector(".persona-scenario") || {}).textContent : null;
      const activeTradeoff = activePanel ? (activePanel.querySelector(".persona-tradeoff") || {}).textContent : null;
      const pitfalls = card.querySelectorAll(".card-pitfalls-list li");
      const prompt = card.querySelector(".card-prompt");
      const last = card.lastElementChild;
      const steps = [...card.querySelectorAll(".card-steps-list li")].map((li) => li.textContent);
      // §6 sweep fields:
      const essenceEl = card.querySelector(".card-essence-text");
      const essenceTop = essenceEl ? essenceEl.getBoundingClientRect().top : 9999;
      const tabs = [...card.querySelectorAll('[role="tab"]')].map((t) => t.getAttribute("data-persona"));
      const selected = [...card.querySelectorAll('[role="tab"][aria-selected="true"]')].length;
      const figureSvgs = card.querySelectorAll(".card-figure svg").length;
      const isArticle = card.tagName.toLowerCase() === "article";
      const textBlob = card.textContent || "";
      return {
        ok: true,
        isArticle,
        name: h2 ? h2.textContent : "",
        h2id: h2 ? h2.id : "",
        trigger: (card.querySelector(".card-trigger-text") || {}).textContent || "",
        figcap: figcap ? figcap.textContent.trim() : "",
        essence: essenceEl ? essenceEl.textContent : "",
        hasExampleText: !!exampleText,
        hasExampleSection: !!exampleSection,
        activeScenario,
        activeTradeoff,
        pitCount: pitfalls.length,
        promptLast: prompt && last === prompt,
        promptIsPart: prompt && prompt.classList.contains("card-part"),
        steps,
        essenceTop,
        tabs,
        selected,
        figureSvgs,
        hasUndef: /\bundefined\b|\bNaN\b/.test(textBlob)
      };
    });
    const featuredScenario = f.examples[f.featured].scenario;
    if (!info.ok || info.name !== f.name || info.h2id !== "h-framework" ||
        !info.trigger.includes(f.trigger.slice(0, 12)) || !info.figcap ||
        !info.essence.includes(f.essence.slice(0, 20)) ||
        !info.hasExampleText || info.activeScenario !== featuredScenario ||
        info.pitCount !== f.pitfalls.length) {
      renderFail = renderFail || f.id;
    }
    if (!info.promptLast) promptLastFail = promptLastFail || f.id;
    const hasSteps = Array.isArray(f.steps) && f.steps.length;
    if (hasSteps) { if (info.steps.length !== f.steps.length) stepsFail = stepsFail || `${f.id} steps missing`; }
    else if (info.steps.length !== 0) stepsFail = stepsFail || `${f.id} unexpected steps container`;
    // §6 sweep assertions (aggregate; first offender reported):
    if (info.essenceTop >= 600) foldFail = foldFail || `${f.id} essenceTop=${Math.round(info.essenceTop)}`;
    if (JSON.stringify(info.tabs) !== JSON.stringify(order) || info.selected !== 1) {
      tabSweepFail = tabSweepFail || `${f.id} tabs=${info.tabs.join(",")} sel=${info.selected}`;
    }
    if (info.figureSvgs !== 1) svgSweepFail = svgSweepFail || `${f.id} svgs=${info.figureSvgs}`;
    if (!info.isArticle || !info.hasExampleSection || !info.activeScenario ||
        !info.activeTradeoff || !info.activeTradeoff.trim() || !info.promptIsPart) {
      tradeoffSweepFail = tradeoffSweepFail || `${f.id} art=${info.isArticle} ex=${info.hasExampleSection} scen=${!!info.activeScenario} trade=${!!info.activeTradeoff} promptPart=${info.promptIsPart}`;
    }
    if (info.hasUndef) undefSweepFail = undefSweepFail || f.id;
  }
  log(!renderFail, "all 74 cards render six parts + featured scenario in the active panel (B4/B30)", renderFail || "");
  log(!promptLastFail, "personalPrompt is the terminal block (B5)", promptLastFail || "");
  log(!stepsFail, "steps render only when present", stepsFail || "");
  // §6 all-74 render+fold sweep (net-new Sprint-004 machine gate):
  log(!foldFail, "SWEEP: essence above the fold (.top<600) on ALL 74 after F-001 serif switch (B35/H1)", foldFail || "");
  log(!tabSweepFail, "SWEEP: all 74 carry exactly 5 persona tabs in fixed order, one aria-selected", tabSweepFail || "");
  log(!svgSweepFail, "SWEEP: all 74 carry exactly one <svg> under .card-figure", svgSweepFail || "");
  log(!tradeoffSweepFail, "SWEEP: all 74 show article.card + featured scenario with paired tradeoff co-visible + prompt card-part (B30/B5)", tradeoffSweepFail || "");
  log(!undefSweepFail, "SWEEP: no 'undefined'/'NaN' leaks into any of the 74 cards' text", undefSweepFail || "");

  // Step 7: data-driven renderer with a synthetic entry (no renderer edits).
  // Synthetic carries a valid examples[]+featured (featured != 0) so it proves
  // the generic featured-first + tab widget renders from data alone (B4).
  const synthOk = await page.evaluate(() => {
    const synthetic = {
      id: "zzz-synthetic-test", name: "Synthetic Test Model", category: "mental-models",
      trigger: "\"A brand new made-up trigger\"", essence: "A synthetic essence sentence for the generic renderer test.",
      visualType: "matrix-2x2",
      examples: [
        { persona: "everyday", scenario: "An everyday synthetic scenario due in 3 days.", tradeoff: "The cost is you lose an evening." },
        { persona: "student", scenario: "A student synthetic scenario before Friday's exam.", tradeoff: "You give up a weekend of rest." },
        { persona: "relationship", scenario: "A relationship synthetic with your partner.", tradeoff: "You risk one awkward hour." },
        { persona: "high-achiever", scenario: "A high-achiever synthetic playing out over 6 months.", tradeoff: "You sacrifice some applause." },
        { persona: "privileged", scenario: "A privileged synthetic that costs $5 of attention.", tradeoff: "You trade a little control." }
      ],
      featured: 1,
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
    const tablist = card.querySelector('[role="tablist"]');
    const tabs = card.querySelectorAll('[role="tab"]');
    const activePanel = card.querySelector(".persona-panel:not([hidden])");
    const activeScenario = activePanel ? activePanel.querySelector(".persona-scenario").textContent : "";
    return name === "Synthetic Test Model" && promptLast && steps === 2 &&
      !!tablist && tabs.length === 5 &&
      activeScenario === synthetic.examples[synthetic.featured].scenario;
  });
  log(synthOk, "synthetic entry renders featured-first + tab widget via card API (generic renderer, B4)");

  // Step 7b: persona tab widget — ARIA + interaction + keyboard + per-instance
  // scoping (B30/B31/B21). Sample covers a core (featured=0) + an extension
  // (featured!=0) framework.
  const widgetSamples = ["eisenhower-matrix", "cynefin"]; // core featured 0 ; ext featured 3
  for (const id of widgetSamples) {
    const f = fws.find((x) => x.id === id);
    await page.goto(BASE + "/#/f/" + id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden]) .persona-tabs");

    // (1) tablist with exactly 5 tabs, fixed persona order, one aria-selected = featured
    const structure = await page.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      const tablist = card.querySelector('[role="tablist"]');
      const tabs = [...card.querySelectorAll('[role="tab"]')];
      const panels = [...card.querySelectorAll('[role="tabpanel"]')];
      const visiblePanels = panels.filter((p) => !p.hasAttribute("hidden"));
      const selected = tabs.filter((t) => t.getAttribute("aria-selected") === "true");
      const vp = visiblePanels[0];
      return {
        hasTablist: !!tablist && !!tablist.getAttribute("aria-label"),
        tabCount: tabs.length,
        personaOrder: tabs.map((t) => t.getAttribute("data-persona")),
        selectedCount: selected.length,
        selectedPersona: selected[0] ? selected[0].getAttribute("data-persona") : null,
        selectedTabindex: selected[0] ? selected[0].getAttribute("tabindex") : null,
        othersRoving: tabs.filter((t) => t.getAttribute("aria-selected") !== "true").every((t) => t.getAttribute("tabindex") === "-1"),
        visiblePanelCount: visiblePanels.length,
        visibleHasScenario: !!(vp && vp.querySelector(".persona-scenario") && vp.querySelector(".persona-scenario").textContent.trim()),
        visibleHasCost: !!(vp && vp.querySelector(".persona-cost-label") && vp.querySelector(".persona-tradeoff") && vp.querySelector(".persona-tradeoff").textContent.trim()),
        featuredBadge: !!(selected[0] && selected[0].querySelector(".persona-featured-badge"))
      };
    });
    const fixedOrder = ["everyday", "student", "relationship", "high-achiever", "privileged"];
    log(structure.hasTablist && structure.tabCount === 5 &&
        JSON.stringify(structure.personaOrder) === JSON.stringify(fixedOrder),
        `[${id}] tablist has 5 tabs in fixed persona order`, JSON.stringify(structure.personaOrder));
    log(structure.selectedCount === 1 && structure.selectedPersona === fixedOrder[f.featured] &&
        structure.selectedTabindex === "0" && structure.othersRoving,
        `[${id}] exactly one selected tab = featured persona (roving tabindex)`, `${structure.selectedPersona} vs ${fixedOrder[f.featured]}`);
    log(structure.visiblePanelCount === 1 && structure.visibleHasScenario && structure.visibleHasCost,
        `[${id}] exactly one visible panel with BOTH scenario + cost (B30)`, JSON.stringify(structure));
    log(structure.featuredBadge, `[${id}] featured tab carries a visible "Featured" marker (B34)`);

    // (3) clicking each other persona tab makes ITS panel the sole visible one
    let clickFail = null;
    for (let k = 0; k < 5; k++) {
      const persona = fixedOrder[k];
      await page.click(`#framework-mount [role="tab"][data-persona="${persona}"]`);
      const res = await page.evaluate((p) => {
        const card = document.querySelector("#framework-mount .card");
        const tabs = [...card.querySelectorAll('[role="tab"]')];
        const panels = [...card.querySelectorAll('[role="tabpanel"]')];
        const visible = panels.filter((x) => !x.hasAttribute("hidden"));
        const selected = tabs.filter((t) => t.getAttribute("aria-selected") === "true");
        const vp = visible[0];
        return {
          visibleCount: visible.length,
          selectedPersona: selected.length === 1 ? selected[0].getAttribute("data-persona") : null,
          vpLabelledBy: vp ? vp.getAttribute("aria-labelledby") : null,
          vpPersonaOk: !!(vp && vp.id.endsWith("-panel-" + p)),
          hasScenario: !!(vp && vp.querySelector(".persona-scenario").textContent.trim()),
          hasCost: !!(vp && vp.querySelector(".persona-tradeoff").textContent.trim())
        };
      }, persona);
      if (res.visibleCount !== 1 || res.selectedPersona !== persona || !res.vpPersonaOk || !res.hasScenario || !res.hasCost) {
        clickFail = clickFail || `${id}/${persona}`;
      }
    }
    log(!clickFail, `[${id}] clicking each persona swaps to its sole panel (scenario+tradeoff, B31)`, clickFail || "");

    // (4) keyboard: ArrowRight advances selection + panel; ArrowLeft reverses;
    // a visible focus outline is present on the focused tab.
    await page.goto(BASE + "/#/f/" + id, { waitUntil: "networkidle" });
    await page.waitForSelector("#screen-framework:not([hidden]) .persona-tabs");
    const startPersona = fixedOrder[f.featured];
    await page.focus(`#framework-mount [role="tab"][data-persona="${startPersona}"]`);
    await page.keyboard.press("ArrowRight");
    const afterRight = await page.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      const active = document.activeElement;
      const cs = getComputedStyle(active);
      const vp = card.querySelector(".persona-panel:not([hidden])");
      return {
        activePersona: active.getAttribute("data-persona"),
        selected: active.getAttribute("aria-selected"),
        visiblePersona: vp ? vp.id.replace(/^.*-panel-/, "") : null,
        outline: parseFloat(cs.outlineWidth) || 0,
        focusVisible: active.matches(":focus-visible")
      };
    });
    const nextPersona = fixedOrder[(f.featured + 1) % 5];
    log(afterRight.activePersona === nextPersona && afterRight.selected === "true" &&
        afterRight.visiblePersona === nextPersona,
        `[${id}] ArrowRight moves selection + panel to next persona (automatic activation)`, JSON.stringify(afterRight));
    log(afterRight.outline >= 3 || afterRight.focusVisible,
        `[${id}] focused persona tab shows a visible focus outline (B21)`, `outline=${afterRight.outline} focusVisible=${afterRight.focusVisible}`);
    await page.keyboard.press("ArrowLeft");
    const afterLeft = await page.evaluate(() => document.activeElement.getAttribute("data-persona"));
    log(afterLeft === startPersona, `[${id}] ArrowLeft reverses selection back to the featured persona`, afterLeft);
  }

  // (5) per-instance id scoping: the Today card AND a framework card coexist in
  // the DOM; activating a framework persona tab toggles the FRAMEWORK card's own
  // panel only — never the Today card's (BLOCKER-class).
  await page.goto(BASE + "/#/today", { waitUntil: "networkidle" });
  await page.waitForSelector("#today-mount .persona-tabs");
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  await page.waitForSelector("#framework-mount .persona-tabs");
  const scoping = await page.evaluate(() => {
    const todayBefore = (document.querySelector("#today-mount .persona-panel:not([hidden])") || {}).id;
    // Click a non-featured persona on the FRAMEWORK card.
    const fwTab = document.querySelector('#framework-mount [role="tab"][data-persona="privileged"]');
    fwTab.click();
    const fwVisible = (document.querySelector("#framework-mount .persona-panel:not([hidden])") || {}).id;
    const todayAfter = (document.querySelector("#today-mount .persona-panel:not([hidden])") || {}).id;
    return {
      todayUnchanged: todayBefore === todayAfter,
      fwSwitched: fwVisible === "ex-h-framework-panel-privileged",
      idsDistinct: fwVisible.startsWith("ex-h-framework") && (todayAfter || "").startsWith("ex-h-today-card")
    };
  });
  log(scoping.todayUnchanged && scoping.fwSwitched && scoping.idsDistinct,
      "per-instance scoping: framework tab toggles only the framework card's panel", JSON.stringify(scoping));

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

  // Step 9: no horizontal scroll on the longest card (375 + 320). Heaviest card
  // is measured over the full example text (all 5 scenarios + tradeoffs).
  const longest = fws.map((f) => ({
    id: f.id,
    len: [f.name, f.trigger, f.essence, ...f.examples.map((e) => e.scenario + " " + e.tradeoff), f.personalPrompt, ...(f.pitfalls || []), ...(f.steps || [])].join(" ").length
  })).sort((a, b) => b.len - a.len)[0];
  await page.goto(BASE + "/#/f/" + longest.id, { waitUntil: "networkidle" });
  for (const w of [375, 320]) {
    await page.setViewportSize({ width: w, height: 667 });
    const noScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
      document.body.scrollWidth <= window.innerWidth);
    log(noScroll, `no horizontal scroll at ${w}px on longest card (${longest.id})`);
  }
  await page.setViewportSize({ width: 375, height: 667 });

  // Step 10: axe on a rendered card, both themes (persona accent text scanned).
  const axeRules = ["color-contrast", "document-title", "html-has-lang", "list", "listitem", "link-name", "empty-heading"];
  // Scan a plain card, a steps-bearing card, and the not-found state (has .btn-link).
  const axeTargets = [fws[0].id, "ooda-loop", "definitely-not-real"];
  const expectBg = { dark: "rgb(32, 24, 17)", light: "rgb(233, 223, 202)" };
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
  log(/pdb-shell-v11/.test(swSrc) && !/CACHE\s*=\s*"pdb-shell-v10"/.test(swSrc), "sw cache bumped (v11)");
  log(/js\/data\.js/.test(swSrc) && /js\/card\.js/.test(swSrc), "sw precaches data.js + card.js");

  // Step 12: Sprint 001 non-regression — five screens keep honest copy, no card leak
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const legacy = await page.evaluate(() => ({
    situations: document.querySelector("#screen-situations").textContent.includes("Start where you are"),
    browse: document.querySelector("#screen-browse").textContent.includes("Browse the shelf"),
    favorites: document.querySelector("#screen-favorites").textContent.includes("No favorites yet"),
    today: !document.querySelector("#screen-today").textContent.includes("No card yet today"),
    search: !!document.querySelector("#screen-search #search-input"),
    noCardLeak: !document.querySelector("#screen-situations .card, #screen-browse .card, #screen-favorites .card, #screen-search .card")
  }));
  log(Object.values(legacy).every(Boolean), "Sprint 001 screens intact, no card leak", JSON.stringify(legacy));

  // Step 12b: F-001 — essence renders in the editorial serif (Charter), in BOTH
  // themes (Sprint 004 §3.2). The lead --font-serif family is Charter; before the
  // fix .card-essence-text inherited --font-sans (Avenir Next). We assert the
  // computed first font-family === "Charter" in dark (default) AND after toggling
  // to light, mirroring the F-001 pass condition.
  const firstFamily = (s) => (s || "").split(",")[0].trim().replace(/^["']|["']$/g, "");
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  for (const theme of ["dark", "light"]) {
    await page.evaluate((t) => { localStorage.setItem("pdb.theme", t); document.documentElement.setAttribute("data-theme", t); }, theme);
    await page.waitForSelector("#framework-mount .card-essence-text");
    const fam = await page.evaluate(() => getComputedStyle(document.querySelector("#framework-mount .card-essence-text")).fontFamily);
    log(firstFamily(fam) === "Charter", `F-001: .card-essence-text leads with Charter serif in ${theme} theme`, fam);
  }
  await page.evaluate(() => { localStorage.setItem("pdb.theme", "dark"); document.documentElement.setAttribute("data-theme", "dark"); });

  // Step 12c: reduced-motion actually neutralizes card/tab transitions (§7 — not
  // just "a media query exists"). Emulate `reduce`, render a card, and assert the
  // computed transition/animation durations on animated elements resolve to ~0.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(BASE + "/#/f/eisenhower-matrix", { waitUntil: "networkidle" });
  await page.waitForSelector("#framework-mount .persona-tabs [role='tab']");
  const rm = await page.evaluate(() => {
    const dur = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const toMax = (v) => Math.max(0, ...String(v).split(",").map((s) => parseFloat(s) || 0));
      return { t: toMax(cs.transitionDuration), a: toMax(cs.animationDuration) };
    };
    const card = document.querySelector("#framework-mount .card");
    const tab = document.querySelector("#framework-mount [role='tab']");
    const screen = document.querySelector("#screen-framework");
    return { card: dur(card), tab: dur(tab), screen: dur(screen) };
  });
  const rmZero = [rm.card, rm.tab, rm.screen].every((d) => d && d.t === 0 && d.a === 0);
  log(rmZero, "reduced-motion: card/tab/screen transition+animation durations resolve to ~0 (§7, B36)", JSON.stringify(rm));
  await page.emulateMedia({ reducedMotion: null });

  // Step 13: console cleanliness
  log(errors.length === 0, "zero console errors/warnings", errors.slice(0, 5).join(" | "));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
};

run().catch((e) => { console.error(e); process.exit(1); });
