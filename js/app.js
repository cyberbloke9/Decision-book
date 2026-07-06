/* ==========================================================================
   Pocket Decision Book — app shell controller (Sprint 001)
   Hash router + theme toggle + service worker registration.
   No framework data, no network fetch to any remote origin.
   ========================================================================== */
(function () {
  "use strict";

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
  function parseHash() {
    var raw = (location.hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
    if (raw === "f" || raw.indexOf("f/") === 0) {
      var rawId = raw === "f" ? "" : raw.slice(2);
      var id = "";
      try { id = decodeURIComponent(rawId); } catch (e) { id = rawId; }
      return { route: "framework", id: id.trim() };
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
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
  initServiceWorker();
})();
