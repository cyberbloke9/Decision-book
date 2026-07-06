/* ==========================================================================
   Pocket Decision Book — app shell controller (Sprint 001)
   Hash router + theme toggle + service worker registration.
   No framework data, no network fetch to any remote origin.
   ========================================================================== */
(function () {
  "use strict";

  var root = typeof window !== "undefined" ? window : this;

  var THEME_KEY = "pdb.theme";
  var DEFAULT_ROUTE = "situations";
  var TAB_ROUTES = ["situations", "browse", "favorites", "today"];
  var ALL_ROUTES = TAB_ROUTES.concat(["search"]);

  var screens = {};
  var tabs = {};

  function collect() {
    var secs = document.querySelectorAll(".screen");
    for (var i = 0; i < secs.length; i++) {
      screens[secs[i].getAttribute("data-route")] = secs[i];
    }
    var tabEls = document.querySelectorAll(".tab");
    for (var j = 0; j < tabEls.length; j++) {
      tabs[tabEls[j].getAttribute("data-route")] = tabEls[j];
    }
  }

  // Parse the hash into a route descriptor:
  //   { route: "browse" }                 → a whitelisted screen
  //   { route: "framework", id: "..." }   → the parametric #/f/:id card
  //   null                                → unknown/garbage (caller normalises)
  // Parametric-route prefixes → route name. #/f/:id (framework, Sprint 002),
  // #/s/:id (situation detail), #/c/:id (category detail).
  var PARAM_PREFIXES = { f: "framework", s: "situation", c: "category" };

  function parseHash() {
    var raw = (location.hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
    var head = raw.indexOf("/") !== -1 ? raw.slice(0, raw.indexOf("/")) : raw;
    if (Object.prototype.hasOwnProperty.call(PARAM_PREFIXES, head)) {
      var rawId = raw === head ? "" : raw.slice(head.length + 1);
      var id = "";
      try { id = decodeURIComponent(rawId); } catch (e) { id = rawId; }
      return { route: PARAM_PREFIXES[head], id: id.trim() };
    }
    return ALL_ROUTES.indexOf(raw) !== -1 ? { route: raw } : null;
  }

  function renderFramework(id) {
    var mount = document.getElementById("framework-mount");
    if (!mount) return null;
    var data = window.PDB_DATA;
    var card = window.PDB_CARD;
    var fw = (id && data && typeof data.byId === "function") ? data.byId(id) : null;
    if (fw && card && typeof card.renderCard === "function") {
      card.renderCard(fw, mount, data);
      return fw;
    }
    if (card && typeof card.renderNotFound === "function") {
      card.renderNotFound(mount);
    }
    return null;
  }

  function byId(x) { return document.getElementById(x); }

  // Render the dynamic content for a Sprint-004 screen. Static headings already
  // exist in the HTML; for parametric routes we set the heading text here.
  function renderScreenContent(desc) {
    var data = root.PDB_DATA;
    var lists = root.PDB_LISTS;
    var nav = root.PDB_NAV;
    var fav = root.PDB_FAV;
    if (!lists) return;

    switch (desc.route) {
      case "situations":
        if (nav) lists.renderSituationPicker(byId("situations-mount"), nav);
        break;
      case "browse":
        lists.renderBrowseIndex(byId("browse-mount"), data);
        break;
      case "favorites":
        lists.renderFavorites(byId("favorites-mount"), data, fav);
        break;
      case "search":
        // Clear any stale query so returning to search shows the hint state
        // (the query is intentionally not encoded in the hash — see trace).
        var input = byId("search-input");
        if (input) input.value = "";
        lists.renderSearch("", byId("search-results"), data);
        break;
      case "situation": {
        var h = byId("h-situation");
        var mount = byId("situation-detail-mount");
        var sit = nav ? nav.situationById(desc.id) : null;
        if (sit) {
          if (h) h.textContent = sit.label;
          lists.renderSituationDetail(sit, mount, data);
        } else {
          if (h) h.textContent = "Situation not found";
          lists.renderNotFoundList(mount, {
            message: "That situation doesn't exist. Pick one from the list to get matching frameworks.",
            backHref: "#/situations",
            backLabel: "Back to Situations"
          });
        }
        break;
      }
      case "category": {
        var hc = byId("h-category");
        var cmount = byId("category-detail-mount");
        var cat = data && data.categoryById ? data.categoryById(desc.id) : null;
        if (cat) {
          if (hc) hc.textContent = cat.label;
          lists.renderCategoryDetail(cat, cmount, data);
        } else {
          if (hc) hc.textContent = "Category not found";
          lists.renderNotFoundList(cmount, {
            message: "That category doesn't exist. Browse the shelf to see all eight.",
            backHref: "#/browse",
            backLabel: "Back to Browse"
          });
        }
        break;
      }
      default:
        break;
    }
  }

  // Wire the live search once (the #search-input persists across routes).
  function initSearch() {
    var input = byId("search-input");
    var results = byId("search-results");
    if (!input || !results) return;
    var lists = root.PDB_LISTS;
    var data = root.PDB_DATA;
    input.addEventListener("input", function () {
      if (lists) lists.renderSearch(input.value, results, data);
    });
    // Delegated: the no-match "Clear search" button empties + refocuses the field.
    results.addEventListener("click", function (e) {
      var clr = e.target && e.target.closest ? e.target.closest(".search-clear") : null;
      if (!clr) return;
      input.value = "";
      input.focus();
      if (lists) lists.renderSearch("", results, data);
    });
  }

  function render(desc) {
    var route = desc.route;
    var frameworkEntry = null;

    // Toggle screen visibility
    Object.keys(screens).forEach(function (r) {
      var isActive = r === route;
      var el = screens[r];
      if (isActive) {
        el.hidden = false;
        // restart enter animation
        el.style.animation = "none";
        // force reflow so re-adding the animation replays it
        void el.offsetWidth;
        el.style.animation = "";
      } else {
        el.hidden = true;
      }
    });

    // Framework route: render the card (or not-found) into its mount before
    // wiring aria-labelledby, so the h-framework heading exists to reference.
    if (route === "framework") {
      frameworkEntry = renderFramework(desc.id);
    } else {
      // All Sprint-004 dynamic screens render BEFORE aria-labelledby is set,
      // and set their (static) heading's text where the route is parametric.
      renderScreenContent(desc);
    }

    // Bottom-tab active state (search + framework are not bottom tabs)
    TAB_ROUTES.forEach(function (r) {
      var t = tabs[r];
      if (!t) return;
      if (r === route) {
        t.setAttribute("aria-current", "page");
      } else {
        t.removeAttribute("aria-current");
      }
    });

    // Move focus target to the content region heading for a11y on route change.
    // The framework screen's heading (name or "Framework not found") is #h-framework.
    var region = document.getElementById("screen-region");
    if (region) region.setAttribute("aria-labelledby", "h-" + route);

    document.title = titleFor(desc, frameworkEntry);
  }

  function titleFor(desc, frameworkEntry) {
    if (desc.route === "framework") {
      return "Pocket Decision Book — " + (frameworkEntry ? frameworkEntry.name : "Framework");
    }
    if (desc.route === "situation") {
      var sit = root.PDB_NAV ? root.PDB_NAV.situationById(desc.id) : null;
      return "Pocket Decision Book — " + (sit ? sit.label : "Situation");
    }
    if (desc.route === "category") {
      var cat = root.PDB_DATA && root.PDB_DATA.categoryById ? root.PDB_DATA.categoryById(desc.id) : null;
      return "Pocket Decision Book — " + (cat ? cat.label : "Category");
    }
    var names = {
      situations: "Situations",
      browse: "Browse",
      favorites: "Favorites",
      today: "Today",
      search: "Search"
    };
    return "Pocket Decision Book — " + (names[desc.route] || "Situations");
  }

  function handleRoute() {
    var desc = parseHash();
    if (desc === null) {
      // Unknown/garbage hash → normalise to default without a history entry
      var target = "#/" + DEFAULT_ROUTE;
      if (location.hash !== target) {
        history.replaceState(null, "", location.pathname + location.search + target);
      }
      desc = { route: DEFAULT_ROUTE };
    }
    render(desc);
  }

  /* ---- Theme toggle ---- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyThemeLabel(theme) {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var next = theme === "dark" ? "light" : "dark";
    btn.setAttribute("aria-label", "Switch to " + next + " theme");
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var bg = getComputedStyle(document.body).backgroundColor;
      if (bg) meta.setAttribute("content", bg);
    }
    applyThemeLabel(theme);
  }

  function initTheme() {
    applyThemeLabel(currentTheme());
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    }
  }

  /* ---- Service worker ---- */
  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () {
        /* registration failure must not break the app (install is an enhancement) */
      });
    });
  }

  /* ---- Boot ---- */
  collect();
  initTheme();
  initSearch();
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
  initServiceWorker();
})();
