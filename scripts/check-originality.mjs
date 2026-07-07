/* ==========================================================================
   Pocket Decision Book — originality proxy check (Sprint 006, §6.1)
   Run: node scripts/check-originality.mjs   (no server needed — pure Node)
   Exits non-zero on any failure.

   Executable proxies ONLY (the "no verbatim book text" gate is MANUAL — the
   book's text is not on disk; see contract §6.2). This asserts:
     - Count: exactly 74 = 52 core (18+13+13+8) + 22 extension (7+6+5+4).
     - Category distribution matches spec §9.
     - B2 fidelity: every framework's `trigger`/`essence` in js/data.js match the
       pre-authored originals parsed from .planning/RESEARCH.md (index-aligned,
       symmetric normalize — mirrors tests/content.spec.mjs).
     - B3 non-empty authored fields: examples[] (5 persona scenario+tradeoff pairs),
       personalPrompt, and every element of pitfalls[] (>=1) are non-empty,
       non-placeholder strings.
   ========================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { extractResearch, normalize } from "./extract-content.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(HERE, "..", "js", "data.js");

let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

/* Load the REAL js/data.js (an IIFE that attaches PDB_DATA to `window`) in an
   isolated node:vm context. Not eval on the global scope: the file is our own
   trusted, generated data module (no user input, never shipped to a browser
   from here), and we run it in a fresh sandbox whose only global is a `window`
   stand-in so the module's `root` binds to it and PDB_DATA is captured. */
const sandbox = { window: {} };
createContext(sandbox);
runInContext(readFileSync(DATA_PATH, "utf8"), sandbox, { filename: "js/data.js" });
const PDB_DATA = sandbox.window.PDB_DATA;

if (!PDB_DATA || !Array.isArray(PDB_DATA.frameworks)) {
  console.error("FATAL: js/data.js did not expose window.PDB_DATA.frameworks");
  process.exit(1);
}
const fws = PDB_DATA.frameworks;

/* ---- 1. Count + category distribution (spec §9) ---- */
log(fws.length === 74, "exactly 74 frameworks", `got ${fws.length}`);
const WANT = {
  "improve-yourself": 18, "understand-yourself": 13, "understand-others": 13, "improve-others": 8,
  "mental-models": 7, "cognitive-biases": 6, "attention": 5, "decision-processes": 4
};
const counts = {};
fws.forEach((f) => { counts[f.category] = (counts[f.category] || 0) + 1; });
log(JSON.stringify(counts) === JSON.stringify(WANT),
  "category distribution 18/13/13/8 + 7/6/5/4 (52 core + 22 ext)", JSON.stringify(counts));
const core = (counts["improve-yourself"] || 0) + (counts["understand-yourself"] || 0) +
  (counts["understand-others"] || 0) + (counts["improve-others"] || 0);
const ext = (counts["mental-models"] || 0) + (counts["cognitive-biases"] || 0) +
  (counts["attention"] || 0) + (counts["decision-processes"] || 0);
log(core === 52 && ext === 22, "core=52 (book) + ext=22 = 74", `core=${core} ext=${ext}`);

/* ---- 2. B2 fidelity: trigger/essence match RESEARCH.md originals ---- */
const research = extractResearch();
log(research.length === fws.length,
  "RESEARCH.md parses to same entry count as js/data.js", `research=${research.length} data=${fws.length}`);
let b2fail = "";
for (let i = 0; i < fws.length; i++) {
  const f = fws[i], r = research[i];
  if (!r) { b2fail = b2fail || `no research row at index ${i} (${f.id})`; break; }
  if (normalize(f.trigger) !== normalize(r.trigger)) {
    b2fail = b2fail || `trigger#${i + 1} ${f.id}: "${f.trigger}" != "${r.trigger}"`;
  }
  if (normalize(f.essence) !== normalize(r.essence)) {
    b2fail = b2fail || `essence#${i + 1} ${f.id}: "${f.essence}" != "${r.essence}"`;
  }
}
log(!b2fail, "trigger/essence byte-match RESEARCH.md originals (B2)", b2fail);

/* ---- 3. B3 non-empty, non-placeholder authored fields ---- */
const PLACEHOLDERS = [
  "todo", "tbd", "lorem", "placeholder", "coming soon",
  "example goes here", "xxx", "n/a", "fixme"
];
const isBad = (s) => {
  if (typeof s !== "string") return true;
  const t = s.trim();
  if (t.length === 0) return true;                 // empty / whitespace-only
  const low = t.toLowerCase();
  return PLACEHOLDERS.some((p) => low === p || low.includes(p));
};
let badExample = "", badPrompt = "", badPitfall = "";
const PERSONA_ORDER = ["everyday", "student", "relationship", "high-achiever", "privileged"];
for (const f of fws) {
  // B24/B25: examples must be 5 personas in fixed order, each with a non-empty,
  // non-placeholder scenario AND tradeoff.
  if (!Array.isArray(f.examples) || f.examples.length !== 5) {
    badExample = badExample || `${f.id}: examples not array of 5`;
  } else {
    f.examples.forEach((e, k) => {
      if (!e || e.persona !== PERSONA_ORDER[k]) badExample = badExample || `${f.id}: persona[${k}]`;
      if (isBad(e && e.scenario)) badExample = badExample || `${f.id}/${e && e.persona}: scenario`;
      if (isBad(e && e.tradeoff)) badExample = badExample || `${f.id}/${e && e.persona}: tradeoff`;
    });
    if (!Number.isInteger(f.featured) || f.featured < 0 || f.featured > 4) {
      badExample = badExample || `${f.id}: featured=${f.featured}`;
    }
  }
  if (isBad(f.personalPrompt)) badPrompt = badPrompt || `${f.id}: "${f.personalPrompt}"`;
  if (!Array.isArray(f.pitfalls) || f.pitfalls.length < 1) {
    badPitfall = badPitfall || `${f.id}: pitfalls missing/empty array`;
  } else {
    for (const p of f.pitfalls) {
      if (isBad(p)) { badPitfall = badPitfall || `${f.id}: pitfall "${p}"`; break; }
    }
  }
}
log(!badExample, "every framework has 5 valid persona examples (scenario+tradeoff) (B3/B24)", badExample);
log(!badPrompt, "every personalPrompt non-empty & non-placeholder (B3)", badPrompt);
log(!badPitfall, "every framework has >=1 non-placeholder pitfall (B3)", badPitfall);

/* ---- 4. Stable unique ids (schema sanity) ---- */
const ids = new Set();
let dupId = "";
fws.forEach((f) => { if (ids.has(f.id)) dupId = dupId || f.id; ids.add(f.id); });
log(!dupId && ids.size === 74, "74 stable unique ids", dupId ? `dup ${dupId}` : `size ${ids.size}`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
