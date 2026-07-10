/* Self-check for v3.0 Sprint 002 — Decision journal (Phase 12).
   The adversarial journal CRUD + validation + LIVE status + export suite
   (contract §13, B47–B55, B74). Run: python3 -m http.server 4173 (project root),
   then: node tests/journal.spec.mjs. Exits non-zero on any failure.
   Pre-handoff gate, not the Evaluator's suite. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const BASE = process.env.BASE || "http://localhost:4173";
const FID = "eisenhower-matrix";

let pass = 0, fail = 0;
const log = (ok, msg, extra = "") => {
  if (ok) { pass++; console.log(`  PASS ${msg}`); }
  else { fail++; console.log(`  FAIL ${msg} ${extra}`); }
};

// UTC date math mirror (must match js/journal.js).
const dayNum = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 864e5);
};
const ymdFrom = (dn) => {
  const dt = new Date(dn * 864e5);
  const p = (n) => (n < 10 ? "0" + n : "" + n);
  return dt.getUTCFullYear() + "-" + p(dt.getUTCMonth() + 1) + "-" + p(dt.getUTCDate());
};

const run = async () => {
  const browser = await chromium.launch();
  // NOTE: no clipboard-write permission granted → the export delivery cascade
  // deterministically lands on the VISIBLE fallback (matches contract §12.6).
  // Each test gets its OWN context (fresh, empty localStorage) so a reload
  // preserves runtime-created entries — no clear-on-load initScript (which would
  // wipe the very data the round-trip test asserts survives).
  const errors = [];
  const newPage = async (nowDate) => {
    const c = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const p = await c.newPage();
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    await p.addInitScript((d) => { if (d) window.__PDB_NOW__ = d; }, nowDate || null);
    return p;
  };
  const done = async (p) => { await p.context().close(); };

  /* ---- 1. Create round-trip + survives reload + newest-first (B47/B55) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });

    // Empty state first.
    const emptyOk = await p.evaluate(() =>
      /No decisions yet/.test(document.querySelector("#journal-mount").textContent) &&
      !!document.querySelector('#journal-mount a[href="#/journal/new"]'));
    log(emptyOk, "empty list shows guidance + 'Write your first entry' CTA (B50)");

    // Create two entries under the SAME injected date → newest-first ordering.
    const created = await p.evaluate(() => {
      const a = window.PDB_JOURNAL.create({ situation: "First decision A", expectedOutcome: "Outcome A" });
      const b = window.PDB_JOURNAL.create({
        situation: "Second decision B", expectedOutcome: "Outcome B",
        confidence: 3, state: { energy: "steady", mood: "unsure" },
        options: [{ text: "Ship now", rejected: true, why: "not enough churn signal" }]
      });
      return { a, b, listIds: window.PDB_JOURNAL.all().map((e) => e.id) };
    });
    log(created.a.id.startsWith("j-2026-07-10-") && created.b.id.startsWith("j-2026-07-10-"),
      "ids are j-<createdAt>-<counter>, no Math.random", `${created.a.id} / ${created.b.id}`);
    log(created.a.id !== created.b.id, "same-day ids are unique");
    log(created.listIds[0] === created.b.id, "same-day newest-first: most recent create leads the list", created.listIds.join(","));
    log(created.b.reviewDate === ymdFrom(dayNum("2026-07-10") + 90), "default review date = createdAt + 90 (B53)", created.b.reviewDate);

    // Persisted through PDB_STORE as pdb.journal.
    const stored = await p.evaluate(() => localStorage.getItem("pdb.journal"));
    log(stored && JSON.parse(stored).length === 2, "pdb.journal holds 2 entries via PDB_STORE (B47)");

    await p.reload({ waitUntil: "networkidle" });
    const afterReload = await p.evaluate(() => ({
      count: window.PDB_JOURNAL.all().length,
      rows: document.querySelectorAll("#journal-mount .journal-row").length,
      b: window.PDB_JOURNAL.byId(document.querySelector("#journal-mount .journal-row").getAttribute("href").split("/").pop())
    }));
    log(afterReload.count === 2 && afterReload.rows === 2, "entries survive a full reload (B55)", `count ${afterReload.count} rows ${afterReload.rows}`);
    log(errors.length === 0, "create round-trip: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 2. Required-field validation BLOCKS empty save (B49) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal/new", { waitUntil: "networkidle" });

    // Fill only expectedOutcome, leave situation empty → submit.
    const r1 = await p.evaluate(() => {
      const areas = document.querySelectorAll(".journal-form textarea[required]");
      areas[1].value = "An outcome, but no situation"; // expected filled
      document.querySelector(".journal-submit").click();
      const sit = areas[0];
      return {
        journal: localStorage.getItem("pdb.journal"),
        invalid: sit.getAttribute("aria-invalid"),
        focused: document.activeElement === sit,
        alert: !!document.querySelector('.journal-error[role="alert"]:not([hidden])')
      };
    });
    log(r1.journal === null, "empty situation: pdb.journal NOT written (blocked save)", `${r1.journal}`);
    log(r1.invalid === "true", "empty situation: aria-invalid='true' on the field");
    log(r1.focused, "empty situation: focus moved to the situation field");
    log(r1.alert, "empty situation: visible role=alert validation message shown");

    // Now empty expectedOutcome, fill situation.
    const r2 = await p.evaluate(() => {
      const areas = document.querySelectorAll(".journal-form textarea[required]");
      areas[0].value = "A situation, but no expected outcome";
      areas[1].value = "";
      document.querySelector(".journal-submit").click();
      const exp = areas[1];
      return {
        journal: localStorage.getItem("pdb.journal"),
        invalid: exp.getAttribute("aria-invalid"),
        focused: document.activeElement === exp
      };
    });
    log(r2.journal === null, "empty expectedOutcome: pdb.journal still NOT written", `${r2.journal}`);
    log(r2.invalid === "true" && r2.focused, "empty expectedOutcome: aria-invalid + focus on the field");
    log(errors.length === 0, "validation flow: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 3. LIVE status: open → review-due on clock advance (NO data write) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const e = window.PDB_JOURNAL.create({ situation: "Live status decision", expectedOutcome: "It holds" });
      const mount = document.getElementById("journal-mount");
      window.PDB_JOURNAL.renderList(mount);
      const chipOpen = document.querySelector("#journal-mount .journal-chip").textContent;
      const before = localStorage.getItem("pdb.journal");
      // Advance the clock PAST the +90 review date; re-render only (no write).
      window.__PDB_NOW__ = "2026-10-20"; // > 2026-07-10 + 90
      window.PDB_JOURNAL.renderList(mount);
      const chipDue = document.querySelector("#journal-mount .journal-chip").textContent;
      const after = localStorage.getItem("pdb.journal");
      return { chipOpen, chipDue, byteIdentical: before === after, reviewDate: e.reviewDate };
    });
    log(/Open/i.test(r.chipOpen), "at createdAt the chip reads Open", r.chipOpen);
    log(/Review due/i.test(r.chipDue), "after advancing __PDB_NOW__ past reviewDate the chip flips to Review due", r.chipDue);
    log(r.byteIdentical, "status flip is a pure re-render: pdb.journal byte-identical (no write)");

    // Seeded closed entry renders closed + actual/gap in detail.
    const closedId = await p.evaluate(() => {
      const arr = JSON.parse(localStorage.getItem("pdb.journal"));
      arr.push({
        id: "j-2026-06-01-0", createdAt: "2026-06-01",
        situation: "Closed decision seed", expectedOutcome: "I expected calm",
        reviewDate: "2026-06-15", actualOutcome: "It was tense instead",
        gapNote: "I under-weighted the deadline", closedAt: "2026-06-16"
      });
      localStorage.setItem("pdb.journal", JSON.stringify(arr));
      return "j-2026-06-01-0";
    });
    await p.goto(BASE + "/#/journal/" + closedId, { waitUntil: "networkidle" });
    const dr = await p.evaluate(() => {
      const t = document.querySelector("#journal-mount").textContent;
      return {
        chip: (document.querySelector("#journal-mount .journal-chip") || {}).textContent,
        actual: /It was tense instead/.test(t),
        gap: /I under-weighted the deadline/.test(t)
      };
    });
    log(/Closed/i.test(dr.chip || ""), "seeded closedAt entry reads Closed", dr.chip);
    log(dr.actual && dr.gap, "closed entry renders actualOutcome + gapNote in detail (B51)");
    log(errors.length === 0, "LIVE status flow: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 4. Review-date math +30/+90/+180 (component UTC, no new Date(str)) ---- */
  {
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      d30: window.PDB_JOURNAL.reviewDateFor("2026-07-10", 30),
      d90: window.PDB_JOURNAL.reviewDateFor("2026-07-10", 90),
      d180: window.PDB_JOURNAL.reviewDateFor("2026-07-10", 180)
    }));
    log(r.d30 === ymdFrom(dayNum("2026-07-10") + 30), "reviewDateFor +30 exact UTC", r.d30);
    log(r.d90 === ymdFrom(dayNum("2026-07-10") + 90), "reviewDateFor +90 exact UTC", r.d90);
    log(r.d180 === ymdFrom(dayNum("2026-07-10") + 180), "reviewDateFor +180 exact UTC", r.d180);
    await done(p);
  }

  /* ---- 5. CRUD: edit persists across reload; delete needs confirm ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const id = await p.evaluate(() =>
      window.PDB_JOURNAL.create({ situation: "Edit me", expectedOutcome: "old expectation" }).id);

    // Edit via the form.
    await p.goto(BASE + "/#/journal/" + id + "/edit", { waitUntil: "networkidle" });
    await p.evaluate(() => {
      const areas = document.querySelectorAll(".journal-form textarea[required]");
      areas[1].value = "NEW expectation after edit";
      document.querySelector(".journal-submit").click();
    });
    await p.waitForFunction((eid) => (location.hash === "#/journal/" + eid), id);
    await p.reload({ waitUntil: "networkidle" });
    const edited = await p.evaluate((eid) => {
      const e = window.PDB_JOURNAL.byId(eid);
      return { exp: e.expectedOutcome, createdAt: e.createdAt, id: e.id };
    }, id);
    log(edited.exp === "NEW expectation after edit", "edit persists across reload (B55)", edited.exp);
    log(edited.id === id && edited.createdAt === "2026-07-10", "edit preserves id + createdAt");

    // Delete requires confirm.
    await p.goto(BASE + "/#/journal/" + id, { waitUntil: "networkidle" });
    const step1 = await p.evaluate(() => {
      document.querySelector(".journal-delete-btn").click();
      return {
        present: !!window.PDB_JOURNAL.byId(document.querySelector('a[href^="#/journal/"]') ? "" : ""),
        confirmShown: !!document.querySelector(".journal-delete-yes"),
        stillStored: JSON.parse(localStorage.getItem("pdb.journal")).length
      };
    });
    log(step1.confirmShown, "delete shows an inline confirm step (no immediate destroy)");
    log(step1.stillStored === 1, "delete step 1 does not remove the entry yet");
    // Cancel restores.
    await p.evaluate(() => document.querySelector(".journal-delete-no").click());
    const afterCancel = await p.evaluate(() => ({
      btnBack: !!document.querySelector(".journal-delete-btn"),
      stored: JSON.parse(localStorage.getItem("pdb.journal")).length
    }));
    log(afterCancel.btnBack && afterCancel.stored === 1, "cancel restores the Delete control, entry intact");
    // Confirm deletes.
    await p.evaluate(() => document.querySelector(".journal-delete-btn").click());
    await p.evaluate(() => document.querySelector(".journal-delete-yes").click());
    await p.waitForFunction(() => location.hash === "#/journal");
    await p.reload({ waitUntil: "networkidle" });
    const gone = await p.evaluate((eid) => window.PDB_JOURNAL.byId(eid) === null, id);
    log(gone, "confirmed delete removes the entry and it stays gone across reload (B55)");
    log(errors.length === 0, "CRUD flow: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 6. B52 affordance pre-links framework + B5 preserved; Today lacks it ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/f/" + FID, { waitUntil: "networkidle" });
    const cardR = await p.evaluate(() => {
      const card = document.querySelector("#framework-mount .card");
      const promptLast = !!(card && card.lastElementChild && card.lastElementChild.classList.contains("card-prompt"));
      const aff = document.querySelector("#framework-mount .journal-this");
      const affAfterCard = !!(aff && card && card.compareDocumentPosition(aff) & Node.DOCUMENT_POSITION_FOLLOWING);
      return {
        promptLast,
        affExists: !!aff,
        affName: aff ? aff.textContent.trim() : "",
        href: aff ? aff.getAttribute("href") : "",
        affAfterCard
      };
    });
    log(cardR.promptLast, "card article still ends on .card-prompt (B5)");
    log(cardR.affExists && cardR.affName === "Journal this decision", "affordance exists with accessible name 'Journal this decision' (B52)");
    log(cardR.affAfterCard, "affordance is a sibling AFTER article.card (not inside the prompt)");
    log(cardR.href === "#/journal/new/" + FID, "affordance links to #/journal/new/<fwId>", cardR.href);

    // Activate → new form pre-links the framework; save minimal → detail shows link.
    await p.goto(BASE + "/#/journal/new/" + FID, { waitUntil: "networkidle" });
    const preLinked = await p.evaluate(() => {
      const chip = document.querySelector(".journal-link-chip-name");
      return chip ? chip.textContent : "";
    });
    log(/matrix/i.test(preLinked), "new-form pre-links the framework by name", preLinked);
    const newId = await p.evaluate(() => {
      const areas = document.querySelectorAll(".journal-form textarea[required]");
      areas[0].value = "Prelinked decision";
      areas[1].value = "prelinked expectation";
      document.querySelector(".journal-submit").click();
      return null;
    });
    await p.waitForFunction(() => /^#\/journal\/j-/.test(location.hash));
    const detail = await p.evaluate((fid) => {
      const e = window.PDB_JOURNAL.byId(location.hash.split("/").pop());
      return {
        linked: e && Array.isArray(e.linkedFrameworkIds) && e.linkedFrameworkIds.indexOf(fid) !== -1,
        nameShown: /matrix/i.test(document.querySelector("#journal-mount").textContent)
      };
    }, FID);
    log(detail.linked, "saved entry has the framework in linkedFrameworkIds (B52)");
    log(detail.nameShown, "detail renders the linked framework name");

    // Today card must NOT carry the affordance.
    await p.goto(BASE + "/#/today", { waitUntil: "networkidle" });
    const todayNoAff = await p.evaluate(() => !document.querySelector("#today-mount .journal-this"));
    log(todayNoAff, "Today daily card does NOT carry the 'Journal this decision' affordance");
    log(errors.length === 0, "B52 flow: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 6b. HEADLINE via the FORM UI end-to-end (§12.1): radios + option row,
     Save, reload, detail renders every value (not the API shortcut) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal/new", { waitUntil: "networkidle" });

    // Drive real controls: required textareas, confidence/energy/mood radios,
    // an added option row, and the +30 review-date choice.
    await p.evaluate(() => {
      const areas = document.querySelectorAll(".journal-form textarea[required]");
      areas[0].value = "Ship the pricing change before the Aug 1 board call, or hold a week?";
      areas[1].value = "We hold — I'll have more churn data by Aug 8";
    });
    await p.click('input[name="j-confidence"][value="3"]');
    await p.click('input[name="j-energy"][value="steady"]');
    await p.click('input[name="j-mood"][value="unsure"]');
    await p.click('input[name="j-review"][value="30"]');
    await p.click(".journal-add-option");
    await p.fill(".journal-option-text-input", "Ship now");
    await p.check(".journal-option-rejected-input");
    await p.fill(".journal-option-why-input", "not enough churn signal");
    // The radios must be selectable — verify the checked state before saving.
    const checkedOk = await p.evaluate(() => ({
      conf: document.querySelector('input[name="j-confidence"]:checked').value,
      energy: document.querySelector('input[name="j-energy"]:checked').value,
      mood: document.querySelector('input[name="j-mood"]:checked').value,
      review: document.querySelector('input[name="j-review"]:checked').value
    }));
    log(checkedOk.conf === "3" && checkedOk.energy === "steady" && checkedOk.mood === "unsure" && checkedOk.review === "30",
      "form radios are selectable (confidence/energy/mood/review) before save", JSON.stringify(checkedOk));

    await p.click(".journal-submit");
    await p.waitForFunction(() => /^#\/journal\/j-/.test(location.hash));
    await p.reload({ waitUntil: "networkidle" }); // survives a full reload
    const persisted = await p.evaluate(() => {
      const e = window.PDB_JOURNAL.byId(location.hash.split("/").pop());
      const t = document.querySelector("#journal-mount").textContent;
      return {
        confidence: e && e.confidence,
        energy: e && e.state && e.state.energy,
        mood: e && e.state && e.state.mood,
        reviewIs30: e && e.reviewDate === (() => {
          const dn = Math.floor(Date.UTC(2026, 6, 10) / 864e5) + 30;
          const d = new Date(dn * 864e5), pad = (n) => (n < 10 ? "0" + n : "" + n);
          return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
        })(),
        opt: e && e.options && e.options[0] && e.options[0].text === "Ship now" && e.options[0].rejected === true && e.options[0].why === "not enough churn signal",
        detailShowsConf: /3 of 5/.test(t),
        detailShowsOption: /Ship now/.test(t) && /not enough churn signal/.test(t),
        detailShowsState: /steady/i.test(t) && /unsure/i.test(t)
      };
    });
    log(persisted.confidence === 3, "form-driven: confidence 3 persisted", String(persisted.confidence));
    log(persisted.energy === "steady" && persisted.mood === "unsure", "form-driven: energy+mood persisted");
    log(persisted.reviewIs30, "form-driven: +30 review-date choice persisted (B53)");
    log(persisted.opt, "form-driven: option row (text/rejected/why) persisted via collectOptions");
    log(persisted.detailShowsConf && persisted.detailShowsOption && persisted.detailShowsState,
      "form-driven: detail renders confidence + option + how-I-felt after reload (§12.1)");
    log(errors.length === 0, "form-UI headline flow: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 7. Export string is PURE + contains real fields (B54) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const e = window.PDB_JOURNAL.create({
        situation: "Ship the pricing change before Aug 1?",
        frame: "Is it timing or price?",
        expectedOutcome: "We hold until Aug 8",
        confidence: 3,
        options: [{ text: "Ship now", rejected: true, why: "not enough churn signal" }]
      });
      const single = window.PDB_JOURNAL.exportText(e);
      const all = window.PDB_JOURNAL.exportText(window.PDB_JOURNAL.all());
      return { single, all, reviewDate: e.reviewDate };
    });
    const s = r.single;
    log(/Ship the pricing change before Aug 1\?/.test(s), "export contains real situation");
    log(/We hold until Aug 8/.test(s), "export contains real expectedOutcome");
    log(/Is it timing or price\?/.test(s), "export contains the frame");
    log(/Confidence: 3\/5/.test(s), "export contains confidence N/5");
    log(s.includes(r.reviewDate), "export contains the review date");
    log(/Ship now/.test(s) && /not enough churn signal/.test(s), "export contains option text + why");
    log(/Ship the pricing change before Aug 1\?/.test(r.all), "export-all contains every entry's situation");
    log(!/undefined|NaN|\{\{|lorem/i.test(s), "export has no placeholder/undefined tokens");

    // The visible fallback appears on the DETAIL export click (no clipboard perm).
    const eid = await p.evaluate(() => window.PDB_JOURNAL.all()[0].id);
    await p.goto(BASE + "/#/journal/" + eid, { waitUntil: "networkidle" });
    await p.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("#journal-mount button"));
      btns.find((b) => b.textContent.trim() === "Export").click();
    });
    await p.waitForSelector("#journal-mount .journal-export-text", { timeout: 4000 });
    const fbText = await p.evaluate(() => document.querySelector(".journal-export-text").value);
    log(/Ship the pricing change before Aug 1\?/.test(fbText), "detail export → visible fallback textarea holds the real text (B54)");
    log(errors.length === 0, "export flow: no console error/pageerror (no unhandled clipboard rejection)", errors.join(" | "));
    await done(p);
  }

  /* ---- 8. Corrupt pdb.journal → empty list, no crash, no console error ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => { try { localStorage.setItem("pdb.journal", "{not json"); } catch (e) {} });
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      len: window.PDB_JOURNAL.all().length,
      empty: /No decisions yet/.test(document.querySelector("#journal-mount").textContent)
    }));
    log(r.len === 0, "corrupt pdb.journal → all() empty (no crash)", `len ${r.len}`);
    log(r.empty, "corrupt pdb.journal → empty state renders");
    log(errors.length === 0, "corrupt store: no console error/pageerror (silent degrade)", errors.join(" | "));
    await done(p);
  }

  /* ---- 9. Unknown entry id → designed not-found, no crash ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.goto(BASE + "/#/journal/j-9999-99-99-0", { waitUntil: "networkidle" });
    const r = await p.evaluate(() => ({
      screenVisible: !document.querySelector("#screen-journal").hidden,
      backLink: !!document.querySelector('#journal-mount a[href="#/journal"]'),
      notFound: /isn't here/.test(document.querySelector("#journal-mount").textContent)
    }));
    log(r.screenVisible && r.notFound && r.backLink, "unknown id → not-found inside #screen-journal with a back link (no crash)");
    log(errors.length === 0, "unknown id: no console error/pageerror", errors.join(" | "));
    await done(p);
  }

  /* ---- 10. Legacy keys untouched by journal writes (B42/B43) ---- */
  {
    errors.length = 0;
    const p = await newPage("2026-07-10");
    await p.addInitScript(() => {
      try {
        localStorage.setItem("pdb.favorites", '["eisenhower-matrix"]');
        localStorage.setItem("pdb.applied", '["2026-07-09","2026-07-10"]');
        localStorage.setItem("pdb.theme", "light");
        localStorage.setItem("pdb.testDate", "2026-07-10");
      } catch (e) {}
    });
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const before = await p.evaluate(() => ["pdb.favorites", "pdb.applied", "pdb.theme", "pdb.testDate"].map((k) => localStorage.getItem(k)));
    const id = await p.evaluate(() => window.PDB_JOURNAL.create({ situation: "Legacy safe", expectedOutcome: "unchanged" }).id);
    await p.evaluate((eid) => { window.PDB_JOURNAL.update(eid, { situation: "Legacy safe 2" }); window.PDB_JOURNAL.remove(eid); }, id);
    const after = await p.evaluate(() => ["pdb.favorites", "pdb.applied", "pdb.theme", "pdb.testDate"].map((k) => localStorage.getItem(k)));
    log(JSON.stringify(before) === JSON.stringify(after), "journal CRUD never mutates the four legacy keys (B42/B43)", `${before} vs ${after}`);
    await done(p);
  }

  /* ---- 11. A11y (axe) on the form AND the populated list + detail (where the
     status chips live), both themes. Seeds an open + a closed entry so the
     open/review-due/closed chip colors are all measured for contrast. ---- */
  for (const theme of ["dark", "light"]) {
    errors.length = 0;
    const c = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const p = await c.newPage();
    await p.addInitScript((t) => {
      try {
        localStorage.setItem("pdb.theme", t);
        localStorage.setItem("pdb.journal", JSON.stringify([
          { id: "j-2026-07-10-0", createdAt: "2026-07-10", situation: "An open decision", expectedOutcome: "holds", reviewDate: "2026-10-08" },
          { id: "j-2026-01-01-0", createdAt: "2026-01-01", situation: "A due decision", expectedOutcome: "shift", reviewDate: "2026-02-01" },
          { id: "j-2025-12-01-0", createdAt: "2025-12-01", situation: "A closed decision", expectedOutcome: "calm", reviewDate: "2025-12-15", actualOutcome: "tense", gapNote: "under-weighted deadline", closedAt: "2025-12-16" }
        ]));
      } catch (e) {}
      window.__PDB_NOW__ = "2026-07-10";
    }, theme);
    p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    const AXE_RULES = ["color-contrast", "label", "button-name", "link-name", "aria-required-attr", "select-name"];

    // 11a — new-entry form.
    await p.goto(BASE + "/#/journal/new", { waitUntil: "networkidle" });
    let res = await new AxeBuilder({ page: p }).include("#screen-journal").withRules(AXE_RULES).analyze();
    log(res.violations.length === 0, `axe: new-entry form clean in ${theme}`, res.violations.map((v) => v.id).join(","));
    await p.setViewportSize({ width: 320, height: 640 });
    let noScroll = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    log(noScroll, `no horizontal scroll at 320px on the form (${theme})`);
    await p.setViewportSize({ width: 375, height: 667 });

    // 11b — populated LIST (open + review-due + closed chips all visible).
    await p.goto(BASE + "/#/journal", { waitUntil: "networkidle" });
    const chips = await p.evaluate(() =>
      Array.from(document.querySelectorAll("#journal-mount .journal-chip")).map((c) => c.textContent));
    log(chips.some((c) => /Open/i.test(c)) && chips.some((c) => /Review due/i.test(c)) && chips.some((c) => /Closed/i.test(c)),
      `list shows all three chip states (${theme})`, chips.join(","));
    res = await new AxeBuilder({ page: p }).include("#screen-journal").withRules(AXE_RULES).analyze();
    log(res.violations.length === 0, `axe: populated list (chip contrast) clean in ${theme}`, res.violations.map((v) => v.id).join(","));
    noScroll = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    log(noScroll, `no horizontal scroll on the populated list (${theme})`);

    // 11b-2 — list "Export all" DOM delivery lands on the visible fallback.
    await p.evaluate(() => {
      Array.from(document.querySelectorAll("#journal-mount button"))
        .find((b) => /Export all/.test(b.textContent)).click();
    });
    await p.waitForSelector("#journal-mount .journal-export-text", { timeout: 4000 });
    const allText = await p.evaluate(() => document.querySelector(".journal-export-text").value);
    log(/An open decision/.test(allText) && /A closed decision/.test(allText),
      `list Export-all → fallback textarea holds every entry (${theme})`);

    // 11c — DETAIL of the closed entry.
    await p.goto(BASE + "/#/journal/j-2025-12-01-0", { waitUntil: "networkidle" });
    res = await new AxeBuilder({ page: p }).include("#screen-journal").withRules(AXE_RULES).analyze();
    log(res.violations.length === 0, `axe: closed-entry detail clean in ${theme}`, res.violations.map((v) => v.id).join(","));
    log(errors.length === 0, `a11y views: no pageerror (${theme})`, errors.join(" | "));
    await done(p);
  }

  /* ---- 12. Discipline grep: no Math.random / network in js/journal.js ---- */
  {
    const src = readFileSync(resolve(ROOT, "js/journal.js"), "utf8");
    // Strip block/line comments so the "No Math.random" doc-notes don't false-trip.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    log(!/Math\.random/.test(code), "js/journal.js: no Math.random in code (determinism)");
    log(!/\bfetch\s*\(/.test(code) && !/XMLHttpRequest/.test(code) && !/WebSocket/.test(code),
      "js/journal.js: no fetch / XHR / WebSocket (soul constraint)");
    log(!/https?:\/\//.test(code), "js/journal.js: no remote http(s):// URL in code (no SVG ns either)");
    log(!/new Date\s*\(\s*['"`]/.test(code), "js/journal.js: no new Date(str) (component UTC math only)");
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
};

run().catch((e) => { console.error(e); process.exit(1); });
