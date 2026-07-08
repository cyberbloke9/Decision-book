/* ==========================================================================
   Deterministic persona-token contrast suite (no browser).

   Why this exists: persona accents are used AS TEXT (.persona-cost-label,
   .persona-glyph, featured badge) on backgrounds that depend on which persona
   is *featured* in the data. The browser/axe suites only scan whichever
   personas happen to be featured, so a token edit could silently break a
   never-featured persona. This suite computes the full fixed matrix instead:
   5 persona tokens x {--bg, --surface, --surface-2} x 2 themes = 30 ratios,
   every one required to meet WCAG AA for normal text (>= 4.5:1).

   Token values are pinned here on purpose: if styles/app.css changes a token,
   the parse step below reads the LIVE value from the stylesheet, so this
   suite follows the CSS — only the token NAMES are pinned.
   ========================================================================== */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "styles", "app.css"), "utf8");

const THEMES = ["dark", "light"];
const SURFACES = ["--bg", "--surface", "--surface-2"];
const PERSONAS = ["--persona-everyday", "--persona-student", "--persona-relationship", "--persona-high-achiever", "--persona-privileged"];

function themeBlock(theme) {
  const re = new RegExp(String.raw`:root\[data-theme="${theme}"\]\s*\{([\s\S]*?)\n\}`);
  const m = css.match(re);
  if (!m) throw new Error(`theme block not found: ${theme}`);
  return m[1];
}

function tokenHex(block, name) {
  const m = block.match(new RegExp(name.replace(/-/g, "\\-") + String.raw`\s*:\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token not found or not 6-digit hex: ${name}`);
  return m[1];
}

function srgb(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let passed = 0, failed = 0;
for (const theme of THEMES) {
  const block = themeBlock(theme);
  for (const persona of PERSONAS) {
    const fg = tokenHex(block, persona);
    for (const surface of SURFACES) {
      const bg = tokenHex(block, surface);
      const r = ratio(fg, bg);
      const ok = r >= 4.5;
      console.log(`  ${ok ? "PASS" : "FAIL"} [${theme}] ${persona} on ${surface}: ${r.toFixed(2)}:1`);
      ok ? passed++ : failed++;
    }
  }
}
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
