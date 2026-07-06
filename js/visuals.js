/* ==========================================================================
   Pocket Decision Book — original inline-SVG visuals (Sprint 003)
   One dedicated, ORIGINAL schematic per visualType (37 forms). Each renderer
   returns an inline SVGSVGElement built in the DOM — no <img>, no <image>, no
   external <use>, no CSS url(), no network request for imagery (B6).

   Design rules (all binding — see contract §3, §4):
   - Deterministic: NO randomness, NO time source, NO counter-generated ids.
     The same framework always renders byte-identical markup (contract §3.2).
   - Uniform 120x84 viewBox so labels scale UP (never below 11px rendered at
     375px). Colour comes from CSS theme-token classes (.v-*), never hardcoded
     hex — so diagrams read in BOTH dark and light themes (contract §4.4).
   - Labels are short, generic, authored — they name the FORM, never the book's
     specific artwork or long data strings (contract §1.2).
   - Every <svg> is aria-hidden; the retained <figcaption> is the a11y name.

   Exposes window.PDB_VISUALS = { renderVisual, HAS }.
   ========================================================================== */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var VB_W = 120;
  var VB_H = 84;

  /* ---- tiny SVG DSL (deterministic; class-based colour only) ------------- */
  function E(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, String(attrs[k]));
    if (kids) for (var i = 0; i < kids.length; i++) if (kids[i]) n.appendChild(kids[i]);
    return n;
  }
  function line(x1, y1, x2, y2, cls) { return E("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": cls || "v-stroke" }); }
  function rect(x, y, w, h, cls, rx) { return E("rect", { x: x, y: y, width: w, height: h, rx: rx, "class": cls || "v-stroke" }); }
  function circ(cx, cy, r, cls) { return E("circle", { cx: cx, cy: cy, r: r, "class": cls || "v-stroke" }); }
  function path(d, cls) { return E("path", { d: d, "class": cls || "v-stroke" }); }
  function poly(points, cls) { return E("polygon", { points: points, "class": cls || "v-stroke" }); }
  function pline(points, cls) { return E("polyline", { points: points, "class": cls || "v-stroke" }); }
  function txt(x, y, s, anchor, cls) {
    var n = E("text", { x: x, y: y, "text-anchor": anchor || "middle", "class": cls || "v-text" });
    n.textContent = s;
    return n;
  }
  // Solid arrowhead as an inline polygon (no <marker> → keeps markup deterministic).
  function arrowR(x, y, s, cls) { return poly(x + "," + y + " " + (x - s) + "," + (y - s * 0.62) + " " + (x - s) + "," + (y + s * 0.62), cls || "v-arrow"); }
  function arrowL(x, y, s, cls) { return poly(x + "," + y + " " + (x + s) + "," + (y - s * 0.62) + " " + (x + s) + "," + (y + s * 0.62), cls || "v-arrow"); }
  function arrowU(x, y, s, cls) { return poly(x + "," + y + " " + (x - s * 0.62) + "," + (y + s) + " " + (x + s * 0.62) + "," + (y + s), cls || "v-arrow"); }
  function arrowD(x, y, s, cls) { return poly(x + "," + y + " " + (x - s * 0.62) + "," + (y - s) + " " + (x + s * 0.62) + "," + (y - s), cls || "v-arrow"); }
  function g(kids, attrs) { return E("g", attrs, kids); }

  /* ---- form renderers (each returns an array of svg child nodes) --------- */
  var R = {};

  // Two axes crossing, four quadrants, accent priority cell.
  R["matrix-2x2"] = function () {
    var x0 = 26, x1 = 104, y0 = 12, y1 = 66, mx = 65, my = 39;
    return [
      rect(x0, y0, x1 - x0, y1 - y0, "v-panel"),
      rect(mx, y0, x1 - mx, my - y0, "v-cell-accent"),
      line(mx, y0, mx, y1),
      line(x0, my, x1, my),
      rect(x0, y0, x1 - x0, y1 - y0, "v-stroke"),
      txt(x0, 78, "low", "start", "v-text-mut"),
      txt(x1, 78, "high", "end", "v-text-mut"),
      txt(14, y0 + 5, "high", "middle", "v-text-mut"),
      txt(14, y1, "low", "middle", "v-text-mut")
    ];
  };

  // Two axes + scattered points, one accent outlier.
  R["scatter-plot"] = function () {
    var out = [line(24, 12, 24, 70), line(24, 70, 108, 70), arrowU(24, 9, 4), arrowR(111, 70, 4)];
    var pts = [[38, 58], [50, 46], [62, 50], [70, 34], [82, 40], [92, 26], [46, 62]];
    for (var i = 0; i < pts.length; i++) out.push(circ(pts[i][0], pts[i][1], 3, "v-dot"));
    out.push(circ(98, 60, 3.6, "v-accent-dot"));
    return out;
  };

  // Horizontal axis with tick nodes; past → now arrow.
  R["timeline"] = function () {
    var y = 42, x0 = 16, x1 = 108;
    var out = [line(x0, y, x1, y), arrowR(112, y, 5)];
    var xs = [24, 46, 68, 90];
    for (var i = 0; i < xs.length; i++) { out.push(line(xs[i], y - 5, xs[i], y + 5, "v-tick")); out.push(circ(xs[i], y, 3, i === xs.length - 1 ? "v-accent-dot" : "v-dot")); }
    out.push(txt(24, 66, "past", "middle", "v-text-mut"));
    out.push(txt(90, 66, "now", "middle", "v-text-mut"));
    return out;
  };

  // Boxes connected left→right by arrows.
  R["flow"] = function () {
    var y = 30, h = 24, w = 26, ys = y;
    var xs = [10, 47, 84];
    var out = [];
    for (var i = 0; i < xs.length; i++) {
      out.push(rect(xs[i], ys, w, h, "v-panel", 3));
      out.push(rect(xs[i], ys, w, h, "v-stroke", 3));
      if (i < xs.length - 1) { out.push(line(xs[i] + w, ys + h / 2, xs[i + 1] - 5, ys + h / 2)); out.push(arrowR(xs[i + 1] - 2, ys + h / 2, 4)); }
    }
    out.push(txt(60, 72, "step by step", "middle", "v-text-mut"));
    return out;
  };

  // Two opposing forces meeting at a fulcrum.
  R["tension"] = function () {
    var y = 40, cx = 60;
    return [
      line(20, y, cx - 10, y), arrowR(cx - 6, y, 5),
      line(100, y, cx + 10, y), arrowL(cx + 6, y, 5),
      poly(cx + ",18 " + (cx - 9) + ",34 " + (cx + 9) + ",34", "v-accent-fill"),
      line(cx - 16, 34, cx + 16, 34, "v-stroke"),
      txt(20, y + 20, "pull", "start", "v-text-mut"),
      txt(100, y + 20, "pull", "end", "v-text-mut")
    ];
  };

  // Axes + a plotted rising-then-easing curve.
  R["curve"] = function () {
    return [
      line(22, 12, 22, 70), line(22, 70, 108, 70), arrowU(22, 9, 4), arrowR(111, 70, 4),
      path("M24 66 C 44 64, 56 30, 104 20", "v-curve"),
      circ(104, 20, 3.2, "v-accent-dot"),
      txt(24, 80, "input", "start", "v-text-mut"),
      txt(108, 80, "more", "end", "v-text-mut")
    ];
  };

  // Criteria grid (rows × columns), one accent cell.
  R["grid"] = function () {
    var x0 = 20, y0 = 14, cw = 26, ch = 16, cols = 3, rows = 3;
    var out = [rect(x0 + cw, y0 + ch, cw, ch, "v-cell-accent")];
    for (var c = 0; c <= cols; c++) out.push(line(x0 + c * cw, y0, x0 + c * cw, y0 + rows * ch));
    for (var r = 0; r <= rows; r++) out.push(line(x0, y0 + r * ch, x0 + cols * cw, y0 + r * ch));
    out.push(txt(60, 78, "options × criteria", "middle", "v-text-mut"));
    return out;
  };

  // Nine dots with a line breaking outside the 3×3 box.
  R["nine-dot"] = function () {
    var x0 = 34, y0 = 14, gap = 22, out = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) out.push(circ(x0 + c * gap, y0 + r * gap, 3, "v-dot"));
    out.push(pline((x0 - 8) + "," + (y0 + 3 * gap) + " " + (x0 + 2 * gap + 12) + "," + (y0 - 6) + " " + (x0) + "," + (y0) + " " + (x0) + "," + (y0 + 2 * gap), "v-accent-line"));
    out.push(txt(60, 80, "outside the box", "middle", "v-text-mut"));
    return out;
  };

  // Branching consequences tree: 1 → 2 → 4.
  R["tree"] = function () {
    var root2 = [circ(60, 16, 4, "v-accent-dot")];
    var mid = [[40, 40], [80, 40]];
    var leaf = [[26, 64], [54, 64], [66, 64], [94, 64]];
    var out = root2;
    out.push(line(60, 20, 40, 36)); out.push(line(60, 20, 80, 36));
    for (var i = 0; i < mid.length; i++) out.push(circ(mid[i][0], mid[i][1], 3.5, "v-dot"));
    out.push(line(40, 44, 26, 60)); out.push(line(40, 44, 54, 60));
    out.push(line(80, 44, 66, 60)); out.push(line(80, 44, 94, 60));
    for (var j = 0; j < leaf.length; j++) out.push(circ(leaf[j][0], leaf[j][1], 3, "v-dot"));
    return out;
  };

  // A box split into two contrasting halves.
  R["split"] = function () {
    var x0 = 22, y0 = 16, w = 76, h = 44;
    return [
      rect(x0, y0, w / 2, h, "v-panel"),
      rect(x0 + w / 2, y0, w / 2, h, "v-cell-accent"),
      rect(x0, y0, w, h, "v-stroke"),
      line(x0 + w / 2, y0, x0 + w / 2, y0 + h, "v-stroke"),
      txt(x0 + w / 4, y0 + h + 12, "this", "middle", "v-text-mut"),
      txt(x0 + 3 * w / 4, y0 + h + 12, "that", "middle", "v-text-mut")
    ];
  };

  // A spectrum line between two poles with a marker.
  R["spectrum"] = function () {
    var y = 40, x0 = 18, x1 = 102;
    return [
      line(x0, y, x1, y, "v-stroke"),
      line(x0, y - 6, x0, y + 6, "v-tick"), line(x1, y - 6, x1, y + 6, "v-tick"),
      circ(74, y, 5, "v-accent-fill"),
      txt(x0, y + 18, "one pole", "start", "v-text-mut"),
      txt(x1, y + 18, "other", "end", "v-text-mut")
    ];
  };

  // Clustered bubbles around a central hub.
  R["bubble-map"] = function () {
    var cx = 60, cy = 40;
    var nodes = [[30, 24, 7], [92, 26, 8], [26, 58, 6], [96, 60, 7], [58, 68, 6]];
    var out = [];
    for (var i = 0; i < nodes.length; i++) out.push(line(cx, cy, nodes[i][0], nodes[i][1], "v-stroke-2"));
    out.push(circ(cx, cy, 12, "v-accent-fill"));
    for (var j = 0; j < nodes.length; j++) out.push(circ(nodes[j][0], nodes[j][1], nodes[j][2], "v-node"));
    return out;
  };

  // Radar / spider chart: axes + a plotted polygon.
  R["radar"] = function () {
    var cx = 60, cy = 40, R5 = 28, out = [];
    var ax = [], pg = [];
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + i * (2 * Math.PI / 5);
      var ex = cx + R5 * Math.cos(a), ey = cy + R5 * Math.sin(a);
      ax.push([ex, ey]);
      var rr = [22, 16, 24, 12, 20][i];
      pg.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1));
    }
    out.push(poly(ax.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), "v-stroke-2"));
    for (var k = 0; k < ax.length; k++) out.push(line(cx, cy, ax[k][0], ax[k][1], "v-stroke-2"));
    out.push(poly(pg.join(" "), "v-accent-line"));
    return out;
  };

  // Two overlapping circles with a highlighted lens.
  R["venn"] = function () {
    // Circles A(52,38 r22) & B(72,38 r22); intersection points at x=62, y=38±19.6.
    return [
      path("M62 18.4 A22 22 0 0 1 62 57.6 A22 22 0 0 1 62 18.4 Z", "v-lens"),
      circ(52, 38, 22, "v-stroke"),
      circ(72, 38, 22, "v-stroke"),
      txt(38, 40, "A", "middle", "v-text"),
      txt(86, 40, "B", "middle", "v-text"),
      txt(62, 78, "overlap", "middle", "v-text-mut")
    ];
  };

  // A lens bending a straight ray (distorted perception).
  R["distortion-lens"] = function () {
    return [
      line(14, 30, 50, 30, "v-stroke"),
      E("ellipse", { cx: 60, cy: 42, rx: 12, ry: 26, "class": "v-lens" }),
      E("ellipse", { cx: 60, cy: 42, rx: 12, ry: 26, "class": "v-stroke" }),
      path("M50 30 C 58 40, 62 46, 106 58", "v-accent-line"),
      txt(20, 24, "real", "start", "v-text-mut"),
      txt(106, 68, "seen", "end", "v-text-mut")
    ];
  };

  // Paths diverging from a decision point.
  R["crossroads"] = function () {
    var px = 40, py = 62;
    return [
      line(px, py, px, 70, "v-stroke"),
      line(px, py, 76, 22, "v-stroke"),
      line(px, py, 100, 44, "v-stroke"),
      line(px, py, 60, 68, "v-stroke-2"),
      circ(px, py, 4, "v-accent-dot"),
      arrowR(78, 21, 4), arrowR(102, 43, 4),
      txt(px, 80, "choose a path", "middle", "v-text-mut")
    ];
  };

  // Horizontal defensive layers (Swiss-cheese style).
  R["layers"] = function () {
    var x0 = 22, w = 76, out = [], ys = [16, 30, 44, 58];
    for (var i = 0; i < ys.length; i++) { out.push(rect(x0, ys[i], w, 9, i === 0 ? "v-cell-accent" : "v-panel", 2)); out.push(rect(x0, ys[i], w, 9, "v-stroke", 2)); }
    out.push(circ(46, 20.5, 2, "v-hole")); out.push(circ(70, 34.5, 2, "v-hole")); out.push(circ(54, 48.5, 2, "v-hole"));
    out.push(txt(60, 78, "layered defences", "middle", "v-text-mut"));
    return out;
  };

  // Stacked pyramid layers, apex accent.
  R["pyramid"] = function () {
    var cx = 60, top = 12, base = 66, halfBase = 40, out = [];
    var levels = 4;
    for (var i = 0; i < levels; i++) {
      var yT = top + (base - top) * (i / levels);
      var yB = top + (base - top) * ((i + 1) / levels);
      var wT = halfBase * (i / levels);
      var wB = halfBase * ((i + 1) / levels);
      out.push(poly((cx - wT) + "," + yT + " " + (cx + wT) + "," + yT + " " + (cx + wB) + "," + yB + " " + (cx - wB) + "," + yB, i === 0 ? "v-cell-accent" : "v-panel"));
      out.push(poly((cx - wT) + "," + yT + " " + (cx + wT) + "," + yT + " " + (cx + wB) + "," + yB + " " + (cx - wB) + "," + yB, "v-stroke"));
    }
    out.push(txt(60, 78, "base to apex", "middle", "v-text-mut"));
    return out;
  };

  // Loop nested inside a larger loop.
  R["nested-loops"] = function () {
    return [
      E("ellipse", { cx: 60, cy: 40, rx: 44, ry: 28, "class": "v-stroke" }),
      arrowR(104, 38, 4),
      E("ellipse", { cx: 60, cy: 40, rx: 22, ry: 14, "class": "v-accent-line" }),
      arrowL(38, 42, 4, "v-arrow-accent"),
      txt(60, 44, "loop", "middle", "v-text-mut")
    ];
  };

  // A growing outward spiral.
  R["spiral"] = function () {
    var cx = 58, cy = 42, out = [], pts = [];
    for (var i = 0; i <= 40; i++) {
      var a = i * 0.55;
      var rr = 2 + i * 0.7;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1));
    }
    out.push(pline(pts.join(" "), "v-curve"));
    out.push(circ(cx, cy, 2.5, "v-accent-dot"));
    out.push(txt(60, 80, "compounding", "middle", "v-text-mut"));
    return out;
  };

  // A flat line with one rare tall spike.
  R["spike"] = function () {
    var y = 56, x0 = 16, x1 = 108;
    return [
      line(x0, y, 62, y, "v-stroke"),
      pline("62," + y + " 68,16 74," + y, "v-accent-line"),
      line(74, y, x1, y, "v-stroke"),
      line(x0, 68, x1, 68, "v-tick"),
      txt(60, 80, "rare but large", "middle", "v-text-mut")
    ];
  };

  // Input → black box → output.
  R["black-box"] = function () {
    var y = 30, h = 26;
    return [
      line(10, y + h / 2, 38, y + h / 2, "v-stroke"), arrowR(41, y + h / 2, 4),
      rect(42, y, 36, h, "v-fg-fill", 3),
      txt(60, y + h / 2 + 3, "?", "middle", "v-text-inv"),
      line(80, y + h / 2, 106, y + h / 2, "v-stroke"), arrowR(109, y + h / 2, 4),
      txt(20, 72, "in", "middle", "v-text-mut"),
      txt(96, 72, "out", "middle", "v-text-mut")
    ];
  };

  // A wheel of roles around a hub.
  R["role-wheel"] = function () {
    var cx = 60, cy = 40, R6 = 28, out = [circ(cx, cy, 30, "v-stroke-2")];
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * (Math.PI / 3);
      var ex = cx + R6 * Math.cos(a), ey = cy + R6 * Math.sin(a);
      out.push(line(cx, cy, ex, ey, "v-stroke-2"));
      out.push(circ(ex, ey, 4, i === 0 ? "v-accent-dot" : "v-node"));
    }
    out.push(circ(cx, cy, 5, "v-accent-fill"));
    return out;
  };

  // Triangle with three corner constraints.
  R["triangle"] = function () {
    var A = [60, 14], B = [22, 66], C = [98, 66];
    return [
      poly(A[0] + "," + A[1] + " " + B[0] + "," + B[1] + " " + C[0] + "," + C[1], "v-panel"),
      poly(A[0] + "," + A[1] + " " + B[0] + "," + B[1] + " " + C[0] + "," + C[1], "v-stroke"),
      circ(A[0], A[1], 3.5, "v-accent-dot"), circ(B[0], B[1], 3.5, "v-node"), circ(C[0], C[1], 3.5, "v-node"),
      txt(60, 10, "one", "middle", "v-text-mut"),
      txt(18, 76, "two", "start", "v-text-mut"),
      txt(102, 76, "three", "end", "v-text-mut")
    ];
  };

  // Rising multi-stage step curve.
  R["stage-curve"] = function () {
    var out = [line(20, 12, 20, 70), line(20, 70, 108, 70), arrowU(20, 9, 4), arrowR(111, 70, 4)];
    var steps = [[24, 60], [44, 60], [44, 46], [64, 46], [64, 30], [84, 30], [84, 18], [104, 18]];
    out.push(pline(steps.map(function (p) { return p[0] + "," + p[1]; }).join(" "), "v-accent-line"));
    out.push(circ(104, 18, 3, "v-accent-dot"));
    out.push(txt(60, 80, "stage by stage", "middle", "v-text-mut"));
    return out;
  };

  // Expected-vs-actual paired bars.
  R["gap-bars"] = function () {
    var base = 66, out = [line(16, base, 108, base, "v-tick")];
    var groups = [[28, 20, 46], [58, 34, 30], [88, 16, 52]];
    for (var i = 0; i < groups.length; i++) {
      var x = groups[i][0];
      out.push(rect(x - 9, base - groups[i][1], 8, groups[i][1], "v-panel"));
      out.push(rect(x - 9, base - groups[i][1], 8, groups[i][1], "v-stroke"));
      out.push(rect(x + 1, base - groups[i][2], 8, groups[i][2], "v-cell-accent"));
      out.push(rect(x + 1, base - groups[i][2], 8, groups[i][2], "v-stroke"));
    }
    out.push(txt(60, 80, "expected vs actual", "middle", "v-text-mut"));
    return out;
  };

  // Three triage buckets.
  R["triage"] = function () {
    var y0 = 18, h = 40, w = 28, xs = [16, 46, 76], labels = ["now", "soon", "later"];
    var out = [];
    for (var i = 0; i < xs.length; i++) {
      out.push(rect(xs[i], y0, w, h, i === 0 ? "v-cell-accent" : "v-panel", 3));
      out.push(rect(xs[i], y0, w, h, "v-stroke", 3));
      out.push(txt(xs[i] + w / 2, y0 + h + 12, labels[i], "middle", "v-text-mut"));
    }
    return out;
  };

  // Concentric circles (rings of control).
  R["concentric"] = function () {
    return [
      circ(60, 40, 30, "v-stroke-2"),
      circ(60, 40, 20, "v-stroke"),
      circ(60, 40, 10, "v-fg-fill"),
      txt(60, 42.5, "core", "middle", "v-text-inv-sm"),
      txt(60, 80, "inner to outer", "middle", "v-text-mut")
    ];
  };

  // A shape mirrored across a centre line (inversion).
  R["mirror"] = function () {
    var cx = 60;
    return [
      line(cx, 12, cx, 70, "v-mirror"),
      pline("26,22 40,50 30,60", "v-stroke"),
      pline("94,22 80,50 90,60", "v-accent-line"),
      arrowL(48, 40, 4), arrowR(72, 40, 4),
      txt(30, 80, "as-is", "middle", "v-text-mut"),
      txt(90, 80, "inverted", "middle", "v-text-mut")
    ];
  };

  // Four-node cycle with directional arrows.
  R["cycle"] = function () {
    var cx = 60, cy = 40, r = 26;
    var nodes = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
    var out = [circ(cx, cy, r, "v-stroke-2")];
    out.push(arrowR(cx + r + 0.5, cy - 3, 4));
    out.push(arrowD(cx + 3, cy + r + 0.5, 4));
    out.push(arrowL(cx - r - 0.5, cy + 3, 4));
    out.push(arrowU(cx - 3, cy - r - 0.5, 4));
    for (var i = 0; i < nodes.length; i++) out.push(circ(nodes[i][0], nodes[i][1], 5, i === 0 ? "v-accent-dot" : "v-node"));
    return out;
  };

  // A sinking anchor (bias dragging a value down).
  R["anchor"] = function () {
    var cx = 60;
    return [
      line(cx, 14, cx, 52, "v-stroke"),
      circ(cx, 14, 4, "v-stroke"),
      line(cx - 14, 26, cx + 14, 26, "v-stroke"),
      path("M40 46 A20 20 0 0 0 80 46", "v-accent-line"),
      poly(cx + ",64 " + (cx - 5) + ",56 " + (cx + 5) + ",56", "v-accent-fill"),
      txt(60, 80, "pulled toward it", "middle", "v-text-mut")
    ];
  };

  // A filtering funnel: many in, few out.
  R["funnel"] = function () {
    var out = [
      poly("22,16 98,16 68,44 52,44", "v-panel"),
      poly("22,16 98,16 68,44 52,44", "v-stroke"),
      rect(54, 44, 12, 14, "v-cell-accent"),
      rect(54, 44, 12, 14, "v-stroke")
    ];
    out.push(circ(36, 22, 2.5, "v-dot")); out.push(circ(52, 22, 2.5, "v-dot"));
    out.push(circ(68, 22, 2.5, "v-dot")); out.push(circ(84, 22, 2.5, "v-dot"));
    out.push(circ(60, 66, 2.8, "v-accent-dot"));
    out.push(txt(60, 80, "many to few", "middle", "v-text-mut"));
    return out;
  };

  // Time-blocked bars across a schedule.
  R["gantt"] = function () {
    var y0 = 16, rh = 12, out = [line(20, 12, 20, 64, "v-tick")];
    var bars = [[26, 40, "v-cell-accent"], [40, 34, "v-panel"], [30, 46, "v-panel"]];
    for (var i = 0; i < bars.length; i++) {
      var y = y0 + i * rh;
      out.push(rect(bars[i][0], y, bars[i][1], 8, bars[i][2], 2));
      out.push(rect(bars[i][0], y, bars[i][1], 8, "v-stroke", 2));
    }
    out.push(line(20, 64, 108, 64, "v-tick"));
    out.push(txt(60, 78, "blocked time", "middle", "v-text-mut"));
    return out;
  };

  // Adjustable friction sliders.
  R["sliders"] = function () {
    var out = [], ys = [22, 40, 58], knobs = [40, 78, 58];
    for (var i = 0; i < ys.length; i++) {
      out.push(line(22, ys[i], 98, ys[i], "v-stroke-2"));
      out.push(circ(knobs[i], ys[i], 5, i === 1 ? "v-accent-fill" : "v-node"));
    }
    out.push(txt(60, 78, "tune the friction", "middle", "v-text-mut"));
    return out;
  };

  // A pipe with one narrow binding constraint.
  R["constraint"] = function () {
    var y = 34, h = 20;
    return [
      path("M14 " + y + " L52 " + y + " L60 " + (y + 6) + " L60 " + (y + h - 6) + " L52 " + (y + h) + " L14 " + (y + h) + " Z", "v-panel"),
      path("M60 " + (y + 6) + " L106 " + (y + 6) + " L106 " + (y + h - 6) + " L60 " + (y + h - 6) + " Z", "v-panel"),
      path("M14 " + y + " L52 " + y + " L60 " + (y + 6) + " L106 " + (y + 6), "v-stroke"),
      path("M14 " + (y + h) + " L52 " + (y + h) + " L60 " + (y + h - 6) + " L106 " + (y + h - 6), "v-stroke"),
      line(60, y + 6, 60, y + h - 6, "v-accent-line"),
      arrowR(48, y + h / 2, 4),
      txt(60, 74, "the bottleneck", "middle", "v-text-mut")
    ];
  };

  // A spotlight cone on a single item among many.
  R["spotlight"] = function () {
    var out = [
      poly("58,12 42,58 78,58", "v-beam"),
      poly("58,12 42,58 78,58", "v-stroke-2")
    ];
    var others = [[24, 60], [40, 62], [96, 60], [80, 62]];
    for (var i = 0; i < others.length; i++) out.push(circ(others[i][0], others[i][1], 3, "v-node-dim"));
    out.push(circ(60, 60, 5, "v-accent-dot"));
    out.push(txt(60, 78, "one thing", "middle", "v-text-mut"));
    return out;
  };

  // A journal / template page with header + ruled lines.
  R["journal"] = function () {
    var x0 = 28, y0 = 12, w = 64, h = 60;
    var out = [rect(x0, y0, w, h, "v-panel", 3), rect(x0, y0, w, h, "v-stroke", 3)];
    out.push(rect(x0 + 8, y0 + 8, 28, 6, "v-cell-accent", 1));
    for (var i = 0; i < 4; i++) out.push(line(x0 + 8, y0 + 24 + i * 9, x0 + w - 8, y0 + 24 + i * 9, "v-rule"));
    out.push(txt(60, 80, "decision log", "middle", "v-text-mut"));
    return out;
  };

  // Fallback for any unknown/synthetic visualType (preserves B4).
  function fallback() {
    return [
      rect(24, 16, 72, 44, "v-panel", 4),
      rect(24, 16, 72, 44, "v-stroke", 4),
      line(36, 38, 84, 38, "v-stroke-2"),
      circ(60, 38, 4, "v-accent-dot"),
      txt(60, 76, "schematic", "middle", "v-text-mut")
    ];
  }

  var HAS = {};
  for (var key in R) if (Object.prototype.hasOwnProperty.call(R, key)) HAS[key] = true;

  /* Build the SVGSVGElement for a framework. Deterministic; always returns an
     SVGSVGElement (never null/string), falling back to a generic schematic for
     unknown visualTypes so the Sprint-002 synthetic-entry test still passes. */
  function renderVisual(fw) {
    var vt = fw && fw.visualType;
    var maker = (vt && R[vt]) ? R[vt] : fallback;
    var kids = maker();
    var svg = E("svg", {
      viewBox: "0 0 " + VB_W + " " + VB_H,
      preserveAspectRatio: "xMidYMid meet",
      "class": "card-visual",
      "aria-hidden": "true",
      focusable: "false",
      role: "presentation"
    }, kids);
    return svg;
  }

  root.PDB_VISUALS = { renderVisual: renderVisual, HAS: HAS };
})(typeof window !== "undefined" ? window : this);
