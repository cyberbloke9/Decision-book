/* Parse .planning/RESEARCH.md model tables → per-framework {name, trigger, essence, visualRaw}.
   Used to (a) seed the byte-exact trigger/essence in js/data.js and (b) drive the B2
   verbatim-match assertion in tests/content.spec.mjs. Single source of truth for parsing. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
export const RESEARCH_PATH = resolve(HERE, "..", ".planning", "RESEARCH.md");

// Split a markdown table row "| a | b | c |" into trimmed cells.
function cells(line) {
  const t = line.trim();
  if (!t.startsWith("|")) return null;
  const parts = t.slice(1, t.endsWith("|") ? -1 : undefined).split("|");
  return parts.map((c) => c.trim());
}
function isSeparator(c) {
  return c.every((x) => /^:?-{3,}:?$/.test(x));
}

// Section spec: heading substring → { category, triggerCol, essenceCol, nameCol, expected }
const SECTIONS = [
  { head: "### Q1 — Improve Yourself", category: "improve-yourself", nameCol: 1, triggerCol: 2, essenceCol: 3, visualCol: 4, expected: 18 },
  { head: "### Q2 — Understand Yourself", category: "understand-yourself", nameCol: 1, triggerCol: 2, essenceCol: 3, visualCol: 4, expected: 13 },
  { head: "### Q3 — Understand Others", category: "understand-others", nameCol: 1, triggerCol: 2, essenceCol: 3, visualCol: 4, expected: 13 },
  { head: "### Q4 — Improve Others", category: "improve-others", nameCol: 1, triggerCol: 2, essenceCol: 3, visualCol: 4, expected: 8 },
  { head: "## Extension Set A", category: "mental-models", nameCol: 0, triggerCol: 1, essenceCol: 2, visualCol: 3, expected: 7 },
  { head: "## Extension Set B", category: "cognitive-biases", nameCol: 0, triggerCol: 1, essenceCol: 2, visualCol: 3, expected: 6 },
  { head: "## Extension Set C", category: "attention", nameCol: 0, triggerCol: 1, essenceCol: 2, visualCol: 3, expected: 5 },
  { head: "## Extension Set D", category: "decision-processes", nameCol: 0, triggerCol: 1, essenceCol: 2, visualCol: 3, expected: 4 }
];

export function extractResearch(md = readFileSync(RESEARCH_PATH, "utf8")) {
  const lines = md.split(/\r?\n/);
  // Find start line index of each section heading.
  const bounds = SECTIONS.map((s) => ({
    ...s,
    start: lines.findIndex((l) => l.startsWith(s.head))
  }));
  bounds.forEach((b) => { if (b.start < 0) throw new Error("Section not found: " + b.head); });

  const out = [];
  for (let si = 0; si < bounds.length; si++) {
    const sec = bounds[si];
    const end = si + 1 < bounds.length ? bounds[si + 1].start : lines.length;
    let sawHeaderRow = false;
    for (let i = sec.start + 1; i < end; i++) {
      const c = cells(lines[i]);
      if (!c) continue;
      if (isSeparator(c)) { sawHeaderRow = true; continue; } // the |---|---| row
      if (!sawHeaderRow) continue; // this is the column-header row
      const name = c[sec.nameCol];
      if (!name) continue;
      out.push({
        category: sec.category,
        name,
        trigger: c[sec.triggerCol],
        essence: c[sec.essenceCol],
        visualRaw: c[sec.visualCol]
      });
    }
    const got = out.filter((o) => o.category === sec.category).length;
    if (got !== sec.expected) {
      throw new Error(`${sec.category}: parsed ${got}, expected ${sec.expected}`);
    }
  }
  if (out.length !== 74) throw new Error("Total parsed " + out.length + " != 74");
  return out;
}

// Symmetric normalization for the B2 comparison: collapse whitespace runs,
// unify smart quotes/dashes to straight. Applied to BOTH sides so exact copies match.
export function normalize(s) {
  return String(s)
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = extractResearch();
  console.log(JSON.stringify(rows, null, 2));
  console.error(`\nParsed ${rows.length} frameworks.`);
}
