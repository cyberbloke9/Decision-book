/* ==========================================================================
   Pocket Decision Book — framework card renderer (Sprint 002)
   Pure, data-driven: renders the six-part card from ONE PDB_DATA entry.
   Adding a new valid entry renders correctly with zero changes here (B4).
   Rendered order deliberately closes on the personalPrompt so the card ends
   on a question/action, not a lecture (B5).
   Exposes window.PDB_CARD = { renderCard, renderNotFound }.
   No network, no storage, no mutation of the data.
   ========================================================================== */
(function (root) {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function labelFor(fw, data) {
    var cat = data && data.categoryById ? data.categoryById(fw.category) : null;
    return cat ? cat.label : fw.category;
  }

  function visualLabelFor(fw, data) {
    var labels = data && data.VISUAL_LABELS;
    if (labels && labels[fw.visualType]) return labels[fw.visualType];
    // Fallback: humanize the kebab id so the caption is never empty/placeholder.
    return String(fw.visualType || "").replace(/-/g, " ");
  }

  /* Build the favorite toggle button (a real <button>, not a link) reflecting
     and toggling PDB_FAV state. aria-pressed + a dynamic aria-label; the star
     glyph is aria-hidden. Kept in the card HEADER so the personalPrompt remains
     the terminal card-part (B5). */
  function favButton(fw) {
    var fav = root.PDB_FAV;
    var pressed = fav && typeof fav.isFavorite === "function" ? fav.isFavorite(fw.id) : false;

    var btn = el("button", "fav-toggle");
    btn.setAttribute("type", "button");

    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "fav-star");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z");
    svg.appendChild(path);
    btn.appendChild(svg);

    function reflect(on) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
      if (on) btn.classList.add("is-fav"); else btn.classList.remove("is-fav");
    }
    reflect(pressed);

    btn.addEventListener("click", function () {
      var now = fav && typeof fav.toggle === "function" ? fav.toggle(fw.id) : false;
      reflect(now);
    });
    return btn;
  }

  /* Persona visual system (B31) — one consistent label + glyph per persona,
     reused on EVERY card. Fixed order matches the data contract (B24). Accent
     colour comes from the CSS custom property --persona-<persona> (theme-scoped,
     AA-verified in both themes); the glyph is decorative (aria-hidden). */
  var PERSONA_ORDER = ["everyday", "student", "relationship", "high-achiever", "privileged"];
  var PERSONA_META = {
    "everyday":      { label: "Everyday",      glyph: "◈" }, // ◈
    "student":       { label: "Student",       glyph: "✎" }, // ✎
    "relationship":  { label: "Relationship",  glyph: "♥" }, // ♥
    "high-achiever": { label: "High-achiever", glyph: "▲" }, // ▲
    "privileged":    { label: "Privileged",    glyph: "♛" }  // ♛
  };

  /* Build the featured-first example section with the accessible persona tab
     widget. `headingId` scopes every widget id so the framework card and the
     Today card can coexist in the DOM without id collisions (per-instance
     scoping, BLOCKER-class). Returns the <section>. */
  function exampleSection(fw, headingId) {
    var section = el("section", "card-part card-example");
    section.appendChild(el("p", "card-part-label", "For example"));

    var examples = fw.examples;
    var featured = fw.featured;
    var valid = Array.isArray(examples) && examples.length === 5 &&
      Number.isInteger(featured) && featured >= 0 && featured <= 4 &&
      examples.every(function (e) {
        return e && typeof e.scenario === "string" && e.scenario.trim() &&
          typeof e.tradeoff === "string" && e.tradeoff.trim();
      });

    // Defensive degrade — never crash, never render undefined/NaN (spec §6 state).
    if (!valid) {
      var degrade = el("p", "card-example-empty card-example-text",
        "A worked example for this framework isn't available yet.");
      section.appendChild(degrade);
      return section;
    }

    var scope = "ex-" + headingId; // unique per rendered instance

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
    // selected tab AND its panel; the newly selected tab receives focus.
    function select(idx, moveFocus) {
      for (var j = 0; j < tabs.length; j++) {
        var on = j === idx;
        tabs[j].setAttribute("aria-selected", on ? "true" : "false");
        tabs[j].setAttribute("tabindex", on ? "0" : "-1");
        if (on) panels[j].removeAttribute("hidden");
        else panels[j].setAttribute("hidden", "");
      }
      if (moveFocus) tabs[idx].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
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

    section.appendChild(tablist);
    section.appendChild(panelsWrap);
    return section;
  }

  /* Render one framework entry into `mount`, replacing its contents.
     data defaults to window.PDB_DATA.
     options (strictly additive; defaults preserve #/f/:id byte-for-byte):
       { headingId: "h-framework", showBack: true }
     The Today screen passes { headingId: "h-today-card", showBack: false } so
     the card heading id is unique across screens and the drill-in back link is
     omitted (Today is a root tab). Returns the mount node. */
  function renderCard(fw, mount, data, options) {
    data = data || root.PDB_DATA;
    options = options || {};
    var headingId = options.headingId || "h-framework";
    var showBack = options.showBack !== false; // default true
    mount.textContent = "";
    mount.setAttribute("data-state", "card");

    // Top back link (to Browse) — a sibling BEFORE article.card, so the card's
    // lastElementChild stays the personalPrompt (B5 preserved).
    if (showBack) {
      var back = el("a", "back-link card-back", "Back to Browse");
      back.setAttribute("href", "#/browse");
      var NS = "http://www.w3.org/2000/svg";
      var chev = document.createElementNS(NS, "svg");
      chev.setAttribute("class", "back-chevron");
      chev.setAttribute("viewBox", "0 0 24 24");
      chev.setAttribute("aria-hidden", "true");
      chev.setAttribute("focusable", "false");
      var chevPath = document.createElementNS(NS, "path");
      chevPath.setAttribute("d", "M15 5l-7 7 7 7");
      chev.appendChild(chevPath);
      back.insertBefore(chev, back.firstChild);
      mount.appendChild(back);
    }

    var article = el("article", "card");

    // 1. Header — category kicker + a row of name (h2, screen heading) + fav star
    var header = el("header", "card-header");
    var kicker = el("p", "card-kicker", labelFor(fw, data));
    header.appendChild(kicker);
    var headRow = el("div", "card-header-row");
    var h2 = el("h2", "card-name");
    h2.id = headingId;
    h2.textContent = fw.name;
    headRow.appendChild(h2);
    headRow.appendChild(favButton(fw));
    header.appendChild(headRow);
    article.appendChild(header);

    // 2. Trigger — the "when you're facing…" line
    var trig = el("section", "card-part card-trigger");
    trig.appendChild(el("p", "card-part-label", "When you're facing"));
    trig.appendChild(el("p", "card-trigger-text", fw.trigger));
    article.appendChild(trig);

    // 3. Visual — original inline SVG (Sprint 003) + figcaption naming the form.
    var figure = el("figure", "card-figure");
    var visuals = root.PDB_VISUALS;
    if (visuals && typeof visuals.renderVisual === "function") {
      figure.appendChild(visuals.renderVisual(fw));
    } else {
      // Safe fallback if the visuals module failed to load: a neutral, aria-hidden
      // labelled frame — no crash, no placeholder token, no fake copy.
      var frame = el("div", "card-figure-fallback");
      frame.setAttribute("aria-hidden", "true");
      figure.appendChild(frame);
    }
    var figcap = el("figcaption", "card-figcaption");
    figcap.appendChild(el("span", "card-figcaption-kicker", "Visual form"));
    figcap.appendChild(el("span", "card-figcaption-name", visualLabelFor(fw, data)));
    figure.appendChild(figcap);
    article.appendChild(figure);

    // 4. Essence
    var ess = el("section", "card-part card-essence");
    ess.appendChild(el("p", "card-part-label", "The idea"));
    ess.appendChild(el("p", "card-essence-text", fw.essence));
    article.appendChild(ess);

    // 5. Steps — only when present
    if (Array.isArray(fw.steps) && fw.steps.length) {
      var stepsSec = el("section", "card-part card-steps");
      stepsSec.appendChild(el("p", "card-part-label", "How it runs"));
      var ol = el("ol", "card-steps-list");
      fw.steps.forEach(function (s) { ol.appendChild(el("li", null, s)); });
      stepsSec.appendChild(ol);
      article.appendChild(stepsSec);
    }

    // 6. Example — featured-first + persona-tab widget (B30/B31/B34)
    article.appendChild(exampleSection(fw, headingId));

    // 7. Pitfalls
    var pit = el("section", "card-part card-pitfalls");
    pit.appendChild(el("p", "card-part-label", "Watch out for"));
    var ul = el("ul", "card-pitfalls-list");
    (fw.pitfalls || []).forEach(function (p) { ul.appendChild(el("li", null, p)); });
    pit.appendChild(ul);
    article.appendChild(pit);

    // 8. Personal prompt — TERMINAL element (closes on a question, B5)
    var prompt = el("section", "card-part card-prompt");
    prompt.appendChild(el("p", "card-prompt-kicker", "Your move"));
    prompt.appendChild(el("p", "card-prompt-text", fw.personalPrompt));
    article.appendChild(prompt);

    mount.appendChild(article);
    return mount;
  }

  /* Render the not-found state into `mount`. Working back-links, no crash. */
  function renderNotFound(mount) {
    mount.textContent = "";
    mount.setAttribute("data-state", "not-found");

    var wrap = el("div", "card-notfound");
    var h2 = el("h2", "card-notfound-title");
    h2.id = "h-framework";
    h2.textContent = "Framework not found";
    wrap.appendChild(h2);
    wrap.appendChild(el("p", "card-notfound-body", "No framework with that id."));

    var actions = el("div", "card-notfound-actions");
    var toSituations = el("a", "btn-link");
    toSituations.href = "#/situations";
    toSituations.textContent = "Go to Situations";
    var toBrowse = el("a", "btn-link");
    toBrowse.href = "#/browse";
    toBrowse.textContent = "Browse frameworks";
    actions.appendChild(toSituations);
    actions.appendChild(toBrowse);
    wrap.appendChild(actions);

    mount.appendChild(wrap);
    return mount;
  }

  root.PDB_CARD = { renderCard: renderCard, renderNotFound: renderNotFound };
})(typeof window !== "undefined" ? window : this);
