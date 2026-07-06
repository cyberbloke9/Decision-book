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

  /* Render one framework entry into `mount`, replacing its contents.
     data defaults to window.PDB_DATA. Returns the mount node. */
  function renderCard(fw, mount, data) {
    data = data || root.PDB_DATA;
    mount.textContent = "";
    mount.setAttribute("data-state", "card");

    var article = el("article", "card");

    // 1. Header — name (h2, screen heading) + category kicker
    var header = el("header", "card-header");
    var kicker = el("p", "card-kicker", labelFor(fw, data));
    var h2 = el("h2", "card-name");
    h2.id = "h-framework";
    h2.textContent = fw.name;
    header.appendChild(kicker);
    header.appendChild(h2);
    article.appendChild(header);

    // 2. Trigger — the "when you're facing…" line
    var trig = el("section", "card-part card-trigger");
    trig.appendChild(el("p", "card-part-label", "When you're facing"));
    trig.appendChild(el("p", "card-trigger-text", fw.trigger));
    article.appendChild(trig);

    // 3. Visual — figure + figcaption naming the form (SVG itself is Sprint 003)
    var figure = el("figure", "card-figure");
    var placeholder = el("div", "card-figure-frame");
    placeholder.setAttribute("aria-hidden", "true");
    // A small, real geometric mark keyed to the form name — NOT a diagram, NOT
    // "coming soon" copy. Sprint 003 replaces this frame with the parameterized SVG.
    placeholder.appendChild(el("span", "card-figure-token", (visualLabelFor(fw, data)[0] || "•")));
    figure.appendChild(placeholder);
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

    // 6. Universal example
    var ex = el("section", "card-part card-example");
    ex.appendChild(el("p", "card-part-label", "For example"));
    ex.appendChild(el("p", "card-example-text", fw.universalExample));
    article.appendChild(ex);

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
