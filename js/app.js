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

  function routeFromHash() {
    var raw = (location.hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
    return ALL_ROUTES.indexOf(raw) !== -1 ? raw : null;
  }

  function render(route) {
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

    // Bottom-tab active state (search is not a bottom tab)
    TAB_ROUTES.forEach(function (r) {
      var t = tabs[r];
      if (!t) return;
      if (r === route) {
        t.setAttribute("aria-current", "page");
      } else {
        t.removeAttribute("aria-current");
      }
    });

    // Move focus target to the content region heading for a11y on route change
    var region = document.getElementById("screen-region");
    if (region) region.setAttribute("aria-labelledby", "h-" + route);

    document.title = titleFor(route);
  }

  function titleFor(route) {
    var names = {
      situations: "Situations",
      browse: "Browse",
      favorites: "Favorites",
      today: "Today",
      search: "Search"
    };
    return "Pocket Decision Book — " + (names[route] || "Situations");
  }

  function handleRoute() {
    var route = routeFromHash();
    if (route === null) {
      // Unknown/garbage hash → normalise to default without a history entry
      var target = "#/" + DEFAULT_ROUTE;
      if (location.hash !== target) {
        history.replaceState(null, "", location.pathname + location.search + target);
      }
      route = DEFAULT_ROUTE;
    }
    render(route);
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
