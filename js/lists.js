/* ==========================================================================
   Pocket Decision Book — list & screen renderers (Sprint 004)
   Pure DOM renderers (no storage writes, no network). Every renderer CLEARS
   its mount first, so re-entering a route never duplicates content.

   Navigation elements are <a href="#/…"> (free keyboard + real browser Back).
   Lists use <ul>/<li> so axe `list` never fires. Icons are aria-hidden.

   Exposes window.PDB_LISTS with:
     renderFrameworkList(frameworks, mount, data)   the shared list-item renderer
     renderSituationPicker(mount, nav)
     renderBrowseIndex(mount, data)
     renderSituationDetail(situation, mount, data)
     renderCategoryDetail(category, mount, data)
     renderFavorites(mount, data, fav)
     renderSearch(query, mount, data)
     renderNotFoundList(mount, opts)
   ========================================================================== */
(function (root) {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(mount) {
    if (mount) mount.textContent = "";
    return mount;
  }

  function categoryLabel(fw, data) {
    var cat = data && data.categoryById ? data.categoryById(fw.category) : null;
    return cat ? cat.label : fw.category;
  }

  /* An arrow chevron for list affordances (decorative, hidden from AT). */
  function chevron() {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "row-chevron");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M9 5l7 7-7 7");
    svg.appendChild(path);
    return svg;
  }

  /* ---- Shared framework list-item renderer -------------------------------
     Renders <ul class="fw-list"> of <a href="#/f/:id"> items showing the
     framework name + its category label (kicker) + trigger line. Returns the
     <ul>. Callers handle their own empty state; this renders whatever it gets. */
  function renderFrameworkList(frameworks, mount, data) {
    data = data || root.PDB_DATA;
    clear(mount);
    var ul = el("ul", "fw-list");
    (frameworks || []).forEach(function (fw) {
      if (!fw) return;
      var li = el("li", "fw-list-row");
      var a = el("a", "fw-item");
      a.setAttribute("href", "#/f/" + fw.id);

      var body = el("span", "fw-item-body");
      body.appendChild(el("span", "fw-item-kicker", categoryLabel(fw, data)));
      body.appendChild(el("span", "fw-item-name", fw.name));
      if (fw.trigger) body.appendChild(el("span", "fw-item-trigger", fw.trigger));

      a.appendChild(body);
      a.appendChild(chevron());
      li.appendChild(a);
      ul.appendChild(li);
    });
    mount.appendChild(ul);
    return ul;
  }

  function backLink(href, label) {
    var a = el("a", "back-link", label);
    a.setAttribute("href", href);
    // Prepend a decorative back chevron.
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "back-chevron");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M15 5l-7 7 7 7");
    svg.appendChild(path);
    a.insertBefore(svg, a.firstChild);
    return a;
  }

  /* ---- Situation picker (the working home screen) ------------------------ */
  function renderSituationPicker(mount, nav) {
    nav = nav || root.PDB_NAV;
    clear(mount);
    var ul = el("ul", "situation-grid");
    (nav.SITUATIONS || []).forEach(function (s) {
      var li = el("li", "situation-cell");
      var a = el("a", "situation-card");
      a.setAttribute("href", "#/s/" + s.id);
      a.appendChild(el("span", "situation-label", s.label));
      if (s.blurb) a.appendChild(el("span", "situation-blurb", s.blurb));
      li.appendChild(a);
      ul.appendChild(li);
    });
    mount.appendChild(ul);
    return mount;
  }

  /* ---- Browse index (8 categories, grouped) ----------------------------- */
  function renderBrowseIndex(mount, data) {
    data = data || root.PDB_DATA;
    clear(mount);

    // Count frameworks per category once.
    var counts = {};
    (data.frameworks || []).forEach(function (fw) {
      counts[fw.category] = (counts[fw.category] || 0) + 1;
    });

    var groups = [
      { key: "quadrant", heading: "The book's four working areas" },
      { key: "extension", heading: "Extension sets" }
    ];

    groups.forEach(function (g) {
      var cats = (data.categories || []).filter(function (c) { return c.group === g.key; });
      if (!cats.length) return;
      var section = el("section", "browse-group");
      var h = el("h3", "browse-group-heading", g.heading);
      section.appendChild(h);
      var ul = el("ul", "category-list");
      cats.forEach(function (c) {
        var li = el("li", "category-cell");
        var a = el("a", "category-card");
        a.setAttribute("href", "#/c/" + c.id);
        var body = el("span", "category-body");
        body.appendChild(el("span", "category-name", c.label));
        var n = counts[c.id] || 0;
        body.appendChild(el("span", "category-count", n + (n === 1 ? " framework" : " frameworks")));
        a.appendChild(body);
        a.appendChild(chevron());
        li.appendChild(a);
        ul.appendChild(li);
      });
      section.appendChild(ul);
      mount.appendChild(section);
    });
    return mount;
  }

  /* ---- Situation detail -------------------------------------------------- */
  function renderSituationDetail(situation, mount, data) {
    data = data || root.PDB_DATA;
    clear(mount);
    if (situation.blurb) mount.appendChild(el("p", "detail-lede", situation.blurb));
    var frameworks = (situation.frameworkIds || [])
      .map(function (id) { return data.byId ? data.byId(id) : null; })
      .filter(Boolean);
    var listMount = el("div", "detail-list-mount");
    renderFrameworkList(frameworks, listMount, data);
    mount.appendChild(listMount);
    mount.appendChild(backLink("#/situations", "Back to Situations"));
    return mount;
  }

  /* ---- Category detail --------------------------------------------------- */
  function renderCategoryDetail(category, mount, data) {
    data = data || root.PDB_DATA;
    clear(mount);
    var frameworks = (data.frameworks || []).filter(function (fw) {
      return fw.category === category.id;
    });
    var listMount = el("div", "detail-list-mount");
    renderFrameworkList(frameworks, listMount, data);
    mount.appendChild(listMount);
    mount.appendChild(backLink("#/browse", "Back to Browse"));
    return mount;
  }

  /* ---- Favorites (list or empty guidance) -------------------------------- */
  function renderFavorites(mount, data, fav) {
    data = data || root.PDB_DATA;
    fav = fav || root.PDB_FAV;
    clear(mount);
    var ids = fav && typeof fav.all === "function" ? fav.all() : [];
    var frameworks = ids
      .map(function (id) { return data.byId ? data.byId(id) : null; })
      .filter(Boolean);

    if (!frameworks.length) {
      // Empty state — keeps the phrase "No favorites yet" (regression) and
      // adds guidance pointing to the card star. Never a blank void.
      var wrap = el("div", "empty-state");
      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "empty-mark");
      svg.setAttribute("viewBox", "0 0 48 48");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", "M24 6l5.3 10.7 11.8 1.7-8.6 8.3 2 11.8L24 33.2 13.5 38.5l2-11.8-8.6-8.3 11.8-1.7z");
      svg.appendChild(path);
      wrap.appendChild(svg);
      wrap.appendChild(el("p", "empty-title", "No favorites yet"));
      wrap.appendChild(el("p", "empty-body", "Star a framework to keep it one tap away — tap the star in any card's header and it collects here."));
      var toBrowse = el("a", "btn-link", "Browse frameworks");
      toBrowse.setAttribute("href", "#/browse");
      wrap.appendChild(toBrowse);
      mount.appendChild(wrap);
      return mount;
    }

    renderFrameworkList(frameworks, mount, data);
    return mount;
  }

  /* ---- Search ------------------------------------------------------------
     Substring match (String.includes) across name/trigger/essence/category
     label — NEVER new RegExp(query). Hint / results(+count) / no-match states. */
  var searchIndex = null;
  function buildIndex(data) {
    if (searchIndex) return searchIndex;
    searchIndex = (data.frameworks || []).map(function (fw) {
      var fields = [
        fw.name || "",
        fw.trigger || "",
        fw.essence || "",
        categoryLabel(fw, data)
      ];
      return { fw: fw, hay: fields.join("  ").toLowerCase() };
    });
    return searchIndex;
  }

  function renderSearch(query, mount, data) {
    data = data || root.PDB_DATA;
    clear(mount);
    var q = String(query == null ? "" : query).trim().toLowerCase();

    if (!q) {
      var hint = el("p", "search-hint", "Type a name or keyword — search matches framework names, triggers, the core idea, and category.");
      mount.appendChild(hint);
      return mount;
    }

    var idx = buildIndex(data);
    var matches = [];
    for (var i = 0; i < idx.length; i++) {
      if (idx[i].hay.indexOf(q) !== -1) matches.push(idx[i].fw);
    }

    if (!matches.length) {
      var box = el("div", "search-empty");
      var msg = el("p", "search-empty-msg");
      msg.appendChild(document.createTextNode("No frameworks match “"));
      msg.appendChild(el("strong", "search-empty-q", String(query)));
      msg.appendChild(document.createTextNode("”."));
      box.appendChild(msg);
      box.appendChild(el("p", "search-empty-sub", "Try a shorter word, or browse the shelf instead."));

      var actions = el("div", "search-empty-actions");
      var clr = el("button", "search-clear", "Clear search");
      clr.setAttribute("type", "button");
      clr.setAttribute("aria-label", "Clear the search field");
      actions.appendChild(clr);
      var toBrowse = el("a", "btn-link", "Browse frameworks");
      toBrowse.setAttribute("href", "#/browse");
      actions.appendChild(toBrowse);
      box.appendChild(actions);
      mount.appendChild(box);
      return mount;
    }

    var count = el("p", "search-count", matches.length + (matches.length === 1 ? " match" : " matches"));
    mount.appendChild(count);
    var listMount = el("div", "search-list-mount");
    renderFrameworkList(matches, listMount, data);
    mount.appendChild(listMount);
    return mount;
  }

  /* ---- Graceful not-found list state (parametric routes) ----------------- */
  function renderNotFoundList(mount, opts) {
    opts = opts || {};
    clear(mount);
    var wrap = el("div", "list-notfound");
    wrap.appendChild(el("p", "list-notfound-body", opts.message || "We couldn't find that."));
    wrap.appendChild(backLink(opts.backHref || "#/situations", opts.backLabel || "Back"));
    mount.appendChild(wrap);
    return mount;
  }

  root.PDB_LISTS = {
    renderFrameworkList: renderFrameworkList,
    renderSituationPicker: renderSituationPicker,
    renderBrowseIndex: renderBrowseIndex,
    renderSituationDetail: renderSituationDetail,
    renderCategoryDetail: renderCategoryDetail,
    renderFavorites: renderFavorites,
    renderSearch: renderSearch,
    renderNotFoundList: renderNotFoundList
  };
})(typeof window !== "undefined" ? window : this);
