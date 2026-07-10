/* ==========================================================================
   Pocket Decision Book — persona-tabs ARIA widget (v3.0 Sprint 001)
   window.PDB_PERSONA_TABS: the accessible persona tab/panel widget extracted
   VERBATIM from card.js `exampleSection` (B45). This is a PURE, behaviour-
   identical refactor — no new keyboard handling, no new markup, no reordering.

   render(examples, featured, scope, onSelect) -> DocumentFragment
     Returns a fragment containing EXACTLY the `.persona-tabs` tablist node and
     the `.persona-panels` wrapper node as DIRECT children (NO wrapper element),
     so `card.js` can `section.appendChild(fragment)` and the resulting DOM tree
     is byte-identical to the pre-extraction card (`.card-example` ->
     `For example` label, `.persona-tabs`, `.persona-panels`). All ids stay
     `scope`-prefixed exactly as before (`scope = "ex-" + headingId`).

   Preserved EXACTLY (B45): role tablist/tab/tabpanel; roving tabindex (selected
   tab 0, others -1); ArrowLeft/Right/Up/Down + Home + End; Enter/Space
   activation; panel tabindex=0; explicit focus-on-click (Safari); featured-first
   ordering; "Featured" badge; the paired "The cost"/tradeoff always co-visible
   with its scenario (B30); the persona label+glyph+accent system (B31).

   onSelect(personaId, index) — OPTIONAL 4th arg (B46). Invoked whenever a
   persona is selected by click OR keyboard, and NEVER during initial render
   (it fires only from the user-driven select() path). A missing/undefined
   onSelect is a no-op and never alters tab behaviour; a throwing onSelect is
   swallowed so it can never break the widget.

   No network calls, no storage, no randomness. Plain script; attaches
   PDB_PERSONA_TABS to window.
   ========================================================================== */
(function (root) {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* Persona visual system (B31) — one consistent label + glyph per persona,
     reused on EVERY card. Accent colour comes from the CSS custom property
     --persona-<persona> (theme-scoped, AA-verified in both themes); the glyph
     is decorative (aria-hidden). */
  var PERSONA_META = {
    "everyday":      { label: "Everyday",      glyph: "◈" },
    "student":       { label: "Student",       glyph: "✎" },
    "relationship":  { label: "Relationship",  glyph: "♥" },
    "high-achiever": { label: "High-achiever", glyph: "▲" },
    "privileged":    { label: "Privileged",    glyph: "♛" }
  };

  /* Build the tablist + panels for one framework's examples. Called ONLY with
     already-validated input (card.js owns the malformed-input degrade path);
     still defensively returns an empty fragment for empty/short input rather
     than throwing (contract §2). */
  function render(examples, featured, scope, onSelect) {
    var frag = document.createDocumentFragment();
    if (!Array.isArray(examples) || !examples.length) return frag;

    var tablist = el("div", "persona-tabs");
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Choose a persona for this example");

    var panelsWrap = el("div", "persona-panels");

    var tabs = [];
    var panels = [];

    examples.forEach(function (e, i) {
      var meta = PERSONA_META[e.persona] || { label: e.persona, glyph: "" };
      var isFeatured = i === featured;
      var tabId = scope + "-tab-" + e.persona;
      var panelId = scope + "-panel-" + e.persona;

      // --- Tab ---
      var tab = el("button", "persona-tab");
      tab.setAttribute("type", "button");
      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      tab.setAttribute("aria-selected", isFeatured ? "true" : "false");
      tab.setAttribute("tabindex", isFeatured ? "0" : "-1");
      tab.setAttribute("data-persona", e.persona);
      tab.style.setProperty("--persona-accent", "var(--persona-" + e.persona + ")");
      if (isFeatured) tab.classList.add("is-featured");

      var glyph = el("span", "persona-glyph", meta.glyph);
      glyph.setAttribute("aria-hidden", "true");
      tab.appendChild(glyph);
      tab.appendChild(el("span", "persona-label", meta.label));
      if (isFeatured) tab.appendChild(el("span", "persona-featured-badge", "Featured"));
      tablist.appendChild(tab);
      tabs.push(tab);

      // --- Panel ---
      var panel = el("div", "persona-panel");
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      // APG tabs pattern: a panel with no focusable children must itself be
      // focusable so keyboard/AT users can Tab from the active tab into it.
      panel.setAttribute("tabindex", "0");
      panel.style.setProperty("--persona-accent", "var(--persona-" + e.persona + ")");
      if (!isFeatured) panel.setAttribute("hidden", "");

      // The FEATURED panel's scenario carries .card-example-text so the default
      // rendered card exposes the featured scenario there (v1 selector contract).
      var scenClass = "persona-scenario" + (isFeatured ? " card-example-text" : "");
      panel.appendChild(el("p", scenClass, e.scenario));

      // Cost element — always co-visible with its scenario (B30, never hidden).
      var cost = el("div", "persona-cost");
      cost.appendChild(el("span", "persona-cost-label", "The cost"));
      cost.appendChild(el("p", "persona-tradeoff", e.tradeoff));
      panel.appendChild(cost);

      panelsWrap.appendChild(panel);
      panels.push(panel);
    });

    // Selection follows focus (automatic activation) — ArrowLeft/Right move the
    // selected tab AND its panel; the newly selected tab receives focus. The
    // onSelect hook fires here (user-driven select ONLY, never initial render).
    function select(idx, moveFocus) {
      for (var j = 0; j < tabs.length; j++) {
        var on = j === idx;
        tabs[j].setAttribute("aria-selected", on ? "true" : "false");
        tabs[j].setAttribute("tabindex", on ? "0" : "-1");
        if (on) panels[j].removeAttribute("hidden");
        else panels[j].setAttribute("hidden", "");
      }
      if (moveFocus) tabs[idx].focus();
      if (typeof onSelect === "function") {
        // A throwing consumer must never alter tab behaviour (B46).
        try { onSelect(examples[idx].persona, idx); } catch (err) { /* no-op */ }
      }
    }

    tabs.forEach(function (tab, i) {
      // Explicit focus: Safari does not focus buttons on click by default,
      // which would desync DOM focus from aria-selected/roving tabindex.
      tab.addEventListener("click", function () { select(i, true); });
      tab.addEventListener("keydown", function (ev) {
        var key = ev.key;
        if (key === "ArrowRight" || key === "ArrowDown") {
          ev.preventDefault();
          select((i + 1) % tabs.length, true);
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          ev.preventDefault();
          select((i - 1 + tabs.length) % tabs.length, true);
        } else if (key === "Home") {
          ev.preventDefault();
          select(0, true);
        } else if (key === "End") {
          ev.preventDefault();
          select(tabs.length - 1, true);
        } else if (key === "Enter" || key === " " || key === "Spacebar") {
          ev.preventDefault();
          select(i, true);
        }
      });
    });

    frag.appendChild(tablist);
    frag.appendChild(panelsWrap);
    return frag;
  }

  root.PDB_PERSONA_TABS = { render: render };
})(typeof window !== "undefined" ? window : this);
