/* colony — public codex: the wheel of the 42 as a NAVIGABLE constellation read
   through glass (prototype). drag to pan · scroll to zoom · a god's star resolves
   into its own themed constellation as you zoom in. the bible's codex (§9): "a
   starfield you light by understanding." annulus of 6 wedges (ring order tears–
   nectar–blood–ichor–fuel–ether), 12 radial lines × 3 depths = 36 grid seats +
   the two wildcard triangles ORBITING between the grid and the limits. deep links: #cx-<id>. */
(function () {
  "use strict";
  var esc = SITE.esc;

  var CX = 520, CY = 470, VBW = 1040, VBH = 940;
  var R_HOLE = 96, R_IN = 134, R_OUT = 396;
  var R_DEPTH = [184, 278, 366];
  var R_ORBIT = { inner: 116, outer: 436 };
  var BASE = { inner: [45, 165, 285], outer: [15, 135, 255] };
  var TAU = Math.PI * 2;
  var ZMIN = 1, ZMAX = 9;

  var HUE = { tears: "#5aa6ff", nectar: "#4fd694", blood: "#ff6a7e", ichor: "#b98bff", fuel: "#ffb352", ether: "#6fe0d6" };
  var WILD = "#ffce74";

  function hx(c) { c = c.replace("#", ""); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function rgb(a) { return "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")"; }
  function rgba(a, al) { return "rgba(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + "," + al + ")"; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  var WHITE = [255, 255, 255], PIT = [10, 13, 20];

  function degPt(deg, r) { var a = (deg - 90) * Math.PI / 180; return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }; }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function arcPath(cd, sp, r, cw) { var p1 = degPt(cd - sp, r), p2 = degPt(cd + sp, r); return "M" + fmt(p1.x) + " " + fmt(p1.y) + " A" + r + " " + r + " 0 0 " + (cw ? 1 : 0) + " " + fmt(p2.x) + " " + fmt(p2.y); }

  var SPINE_IDX = { tears: 0, nectar: 2, blood: 4, ichor: 6, fuel: 8, ether: 10 };
  var IDX_WEDGE = { 0: "tears", 2: "nectar", 4: "blood", 6: "ichor", 8: "fuel", 10: "ether" };

  // ---- the themed constellations (prototype: three gods; local coords, node at 0,0) ----
  var FIGURES = {
    itRedeth: {   // the four-pane window / lens — her pupil-glyph
      pts: [[-14, -14], [14, -14], [14, 14], [-14, 14], [0, -14], [14, 0], [0, 14], [-14, 0], [0, 0]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 6], [5, 7]],
    },
    itSootheth: { // the honeycomb — the one mind, honey ⬡
      pts: [[0, -16], [14, -8], [14, 8], [0, 16], [-14, 8], [-14, -8], [0, 0]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
    },
    itScatheth: { // the strike — war, collision
      pts: [[-15, -15], [15, 15], [15, -15], [-15, 15], [0, 0], [0, -18], [0, 18]],
      edges: [[0, 1], [2, 3], [5, 6]],
    },
  };
  function figureSVG(fig, cx, cy, sCol, lCol) {
    var out = '<g class="cx-figure">';
    fig.edges.forEach(function (e) {
      var a = fig.pts[e[0]], b = fig.pts[e[1]];
      out += '<line class="cxf-line" x1="' + fmt(cx + a[0]) + '" y1="' + fmt(cy + a[1]) + '" x2="' + fmt(cx + b[0]) + '" y2="' + fmt(cy + b[1]) + '" stroke="' + lCol + '"/>';
    });
    fig.pts.forEach(function (p) {
      out += '<circle class="cxf-star" cx="' + fmt(cx + p[0]) + '" cy="' + fmt(cy + p[1]) + '" r="1.7" fill="' + sCol + '"/>';
    });
    return out + "</g>";
  }

  function nodeBase(e) {
    if (e.orbit) return hx(WILD);
    var ln = CODEX_DATA.lines[e.line];
    if (ln.kind === "spine") return hx(HUE[IDX_WEDGE[e.line]]);
    var before = HUE[IDX_WEDGE[(e.line + 11) % 12]] || HUE[IDX_WEDGE[e.line - 1]];
    return mix(hx(before), hx(HUE[IDX_WEDGE[(e.line + 1) % 12]]), 0.5);
  }
  function depthShade(base, depth, isVoid) {
    if (isVoid) return mix(base, PIT, 0.42);
    var amt = [-0.06, 0.12, 0.30][depth == null ? 1 : depth];
    return amt < 0 ? mix(base, PIT, -amt) : mix(base, WHITE, amt);
  }
  function derivedSeat(e) {
    if (e.orbit) return "wildcard · " + e.orbit + " — orbiting";
    var ln = CODEX_DATA.lines[e.line];
    return ln.key + " · " + ["close", "between", "far"][e.depth];
  }

  var raf = null, listeners = [];
  function on(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); listeners.push([t, ev, fn, opt]); }

  function openEntry(e) {
    var old = document.getElementById("cx-box"); if (old) old.remove();
    var box = document.createElement("div"); box.id = "cx-box";
    if (e.state === "revealed") {
      var tint = rgb(depthShade(nodeBase(e), 2));
      box.innerHTML = '<div class="cx-entry frost">'
        + (e.sprite ? '<img src="' + SITE.asset(e.sprite) + '" alt="">' : "")
        + '<div class="cx-call" style="color:' + tint + '">' + esc(e.call || "") + "</div>"
        + (e.gloss ? '<div class="cx-gloss">' + esc(e.gloss.join(" · ")) + "</div>" : "")
        + (e.seat ? '<div class="cx-seat">' + esc(e.seat) + "</div>" : "")
        + (e.body ? "<p>" + esc(e.body) + "</p>" : "")
        + '<div class="cx-close">click anywhere to close</div></div>';
    } else {
      box.innerHTML = '<div class="cx-entry frost"><canvas class="cx-plate"></canvas>'
        + '<div class="cx-gloss">still in the old tongue</div>'
        + '<div class="cx-seat">' + esc(derivedSeat(e)) + "</div>"
        + '<div class="cx-close">click anywhere to close</div></div>';
    }
    box.addEventListener("click", function () { box.remove(); history.replaceState(null, "", "#codex"); });
    document.body.appendChild(box);
    var plate = box.querySelector(".cx-plate");
    if (plate) SITE.asemic(plate, e.id, { rows: 3, cols: 4 });
    history.replaceState(null, "", "#cx-" + e.id);
  }

  SITE.tab({
    id: "codex",
    label: "codex",
    gapAfter: true,
    render: function (view) {
      var es = CODEX_DATA.entries || [];
      var lines = CODEX_DATA.lines || [];
      var rev = es.filter(function (e) { return e.state === "revealed"; }).length;
      var rnd = SITE.seeded("cx-field");

      var html = '<div id="cx-head"><p class="eyebrow">codex</p>'
               + '<p class="lede" style="margin:0 auto">comprehension is translation. what the game has revealed is readable here — the rest is still in the old tongue.</p>'
               + '<div style="height:12px"></div>'
               + '<p id="cx-count"><b>' + rev + "</b> of <b>" + es.length + "</b> read</p></div>";

      var s = '<div id="cx-wheelwrap"><svg id="cx-wheel" viewBox="0 0 ' + VBW + " " + VBH + '" role="img" aria-label="the wheel of the 42"><g id="cx-scene">';

      s += "<defs>";
      s += '<filter id="cxbloom" x="-140%" y="-140%" width="380%" height="380%"><feGaussianBlur stdDeviation="4.2"/></filter>';
      s += '<filter id="cxbloomlg" x="-160%" y="-160%" width="420%" height="420%"><feGaussianBlur stdDeviation="8"/></filter>';
      s += '<radialGradient id="cxfrost" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '">'
         + '<stop offset="0" stop-color="#0a0d13" stop-opacity="0.42"/><stop offset="0.42" stop-color="#cfe0ff" stop-opacity="0.015"/>'
         + '<stop offset="0.84" stop-color="#dbe8ff" stop-opacity="0.05"/><stop offset="0.975" stop-color="#eef5ff" stop-opacity="0.13"/>'
         + '<stop offset="1" stop-color="#eef5ff" stop-opacity="0"/></radialGradient>';
      Object.keys(SPINE_IDX).forEach(function (w) {
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<radialGradient id="cxw-' + w + '" gradientUnits="userSpaceOnUse" cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250">'
           + '<stop offset="0" stop-color="' + HUE[w] + '" stop-opacity="0.15"/><stop offset="0.55" stop-color="' + HUE[w] + '" stop-opacity="0.06"/>'
           + '<stop offset="1" stop-color="' + HUE[w] + '" stop-opacity="0"/></radialGradient>';
      });
      var sheen = degPt(320, 178);
      s += '<radialGradient id="cxsheen" gradientUnits="userSpaceOnUse" cx="' + fmt(sheen.x) + '" cy="' + fmt(sheen.y) + '" r="250">'
         + '<stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0.045"/>'
         + '<stop offset="0.65" stop-color="#ffffff" stop-opacity="0.012"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>';
      s += '<radialGradient id="cxrim" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '">'
         + '<stop offset="0.88" stop-color="#dfeeff" stop-opacity="0"/><stop offset="0.965" stop-color="#dfeeff" stop-opacity="0.13"/>'
         + '<stop offset="1" stop-color="#dfeeff" stop-opacity="0"/></radialGradient>';
      s += '<radialGradient id="cxhole" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '">'
         + '<stop offset="0" stop-color="#03050a" stop-opacity="0.9"/><stop offset="0.72" stop-color="#090c13" stop-opacity="0.66"/>'
         + '<stop offset="1" stop-color="#111621" stop-opacity="0.2"/></radialGradient>';
      s += '<clipPath id="cxclip"><circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/></clipPath>';
      s += "</defs>";

      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '" fill="url(#cxrim)"/>';
      s += '<g clip-path="url(#cxclip)">';
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxfrost)"/>';
      Object.keys(SPINE_IDX).forEach(function (w) { var c = degPt(SPINE_IDX[w] * 30, 262); s += '<circle cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250" fill="url(#cxw-' + w + ')"/>'; });
      for (var st = 0; st < 165; st++) {
        var srr = Math.sqrt(R_HOLE * R_HOLE + rnd() * (R_OUT * R_OUT - R_HOLE * R_HOLE)), sa = rnd() * TAU, big = rnd() < 0.1;
        s += '<circle class="cxw-star" cx="' + fmt(CX + srr * Math.cos(sa)) + '" cy="' + fmt(CY + srr * Math.sin(sa)) + '" r="' + fmt(big ? 1.1 + rnd() * 0.9 : 0.35 + rnd() * 0.75) + '" opacity="' + fmt((big ? 0.2 : 0.06) + rnd() * 0.14) + '"/>';
      }
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxsheen)"/>';
      s += '<path class="cxw-hi" d="' + arcPath(0, 60, R_OUT - 2, true) + '" fill="none"/>';
      s += "</g>";

      R_DEPTH.forEach(function (r) { s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + r + '"/>'; });
      s += '<circle class="cxw-rim" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/>';
      s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + R_IN + '" opacity="0.45"/>';
      lines.forEach(function (ln, i) { var p1 = degPt(i * 30, R_IN), p2 = degPt(i * 30, R_OUT); s += '<line class="' + (ln.kind === "spine" ? "cxw-spine" : "cxw-seam") + '" x1="' + fmt(p1.x) + '" y1="' + fmt(p1.y) + '" x2="' + fmt(p2.x) + '" y2="' + fmt(p2.y) + '"/>'; });
      s += '<circle class="cxw-hole" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '" fill="url(#cxhole)"/>';
      s += '<path class="cxw-lip" d="' + arcPath(320, 72, R_HOLE - 1, true) + '" fill="none"/>';

      s += '<text class="cxw-ultra" x="' + CX + '" y="' + (CY + 4) + '" text-anchor="middle">thusNearen</text>';
      s += '<text class="cxw-ultra out" x="' + (CX - R_OUT - 16) + '" y="' + (CY + 4) + '" text-anchor="end">thusFaren</text>';

      Object.keys(SPINE_IDX).forEach(function (w) {
        var deg = SPINE_IDX[w] * 30, lp = degPt(deg, R_OUT + 26), a = ((deg % 360) + 360) % 360;
        var anchor = (a < 14 || a > 346 || (a > 166 && a < 194)) ? "middle" : (a < 180 ? "start" : "end");
        var dy = (a > 160 && a < 200) ? 6 : (a < 20 || a > 340) ? -3 : 5, lit = rgb(mix(hx(HUE[w]), WHITE, 0.42));
        s += '<text class="cxw-wedge" x="' + fmt(lp.x) + '" y="' + fmt(lp.y + dy) + '" text-anchor="' + anchor + '" fill="' + lit + '" style="text-shadow:0 0 15px ' + HUE[w] + ',0 0 6px ' + HUE[w] + '">' + w + "</text>";
      });

      es.forEach(function (e, i) {
        var wild = !!e.orbit, base = nodeBase(e);
        var p = wild ? { x: 0, y: 0 } : degPt(e.line * 30, R_DEPTH[e.depth]);
        var fig = e.state === "revealed" ? FIGURES[e.call] : null;
        s += '<g class="cxw-node ' + (e.state === "revealed" ? "lit" : "sealed") + (wild ? " wild" : "") + (fig ? " hasfig" : "") + '" data-i="' + i + '"' + (wild ? ' data-wild="1"' : "") + ">";
        if (e.state === "revealed") {
          var vd = e.call === "itSwelgeth", col = depthShade(base, e.depth, vd);
          var glow = vd ? mix(base, PIT, 0.24) : mix(base, WHITE, (e.depth || 0) * 0.08);
          var core = rgb(mix(col, WHITE, vd ? 0.16 : 0.28)), lbl = rgb(mix(col, WHITE, 0.72));
          if (fig) s += figureSVG(fig, p.x, p.y, rgb(mix(col, WHITE, 0.62)), rgba(mix(col, WHITE, 0.4), 0.65));
          var lp = wild ? { x: p.x, y: p.y + 32, anchor: "middle" } : radialLabel(e.line * 30, R_DEPTH[e.depth], e.depth);
          s += '<circle class="bloom-lg" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 13 : 11) + '" fill="' + rgb(glow) + '" filter="url(#cxbloomlg)"/>'
             + '<circle class="bloom" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 8 : 7) + '" fill="' + rgb(mix(glow, WHITE, 0.2)) + '" filter="url(#cxbloom)"/>'
             + '<circle class="gem" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 4.6 : 4) + '" fill="' + core + '"/>'
             + '<circle class="spark" cx="' + fmt(p.x - 1.3) + '" cy="' + fmt(p.y - 1.6) + '" r="1.3" fill="#ffffff"/>'
             + '<text class="lbl" x="' + fmt(lp.x) + '" y="' + fmt(lp.y) + '" text-anchor="' + lp.anchor + '" fill="' + lbl + '">' + esc(e.call) + "</text>";
        } else {
          s += '<circle class="dim-glow" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="5" fill="' + rgb(mix(base, PIT, 0.3)) + '" filter="url(#cxbloom)"/>'
             + '<circle class="dim" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="2.4" fill="' + rgb(mix(base, WHITE, 0.25)) + '"/>';
        }
        s += '<circle class="hit" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="18"/>'
           + "<title>" + esc(e.state === "revealed" ? e.call + " — " + (e.seat || "") : "sealed — " + derivedSeat(e)) + "</title></g>";
      });

      s += "</g></svg>";                                    // close #cx-scene, svg
      s += '<div id="cx-nav"><button type="button" data-z="in" aria-label="zoom in">+</button>'
         + '<button type="button" data-z="out" aria-label="zoom out">−</button>'
         + '<button type="button" data-z="reset" aria-label="reset view">⤢</button></div>';
      s += "</div>";                                        // close #cx-wheelwrap
      s += '<p id="cx-hint">drag to pan · scroll to zoom · a star opens into its own sky</p>';
      html += s;
      html += '<p id="cx-legend">the wheel of the 42 — six wedges, twelve lines, three depths, read from the outside through the glass<br>'
            + '<span class="cx-lg-lit">◆</span> read &nbsp; <span class="cx-lg-seal">◇</span> still sealed &nbsp;·&nbsp; and the six that drift between the grid and the limits'
            + '<br>the frame is uncounted: thusNearen within · thusFaren beyond · thusSceaden the watershed between</p>';
      view.innerHTML = html;

      var svg = view.querySelector("#cx-wheel"), scene = view.querySelector("#cx-scene");
      var figs = Array.prototype.slice.call(scene.querySelectorAll(".cx-figure"));

      // ---- navigation state ----
      var tx = 0, ty = 0, k = 1, moved = false, down = null;
      function apply() {
        scene.setAttribute("transform", "translate(" + fmt(tx) + " " + fmt(ty) + ") scale(" + fmt(k) + ")");
        var fo = clamp((k - 1.7) / 1.8, 0, 1);            // figures resolve out of the star as you zoom in
        figs.forEach(function (g) { g.style.opacity = fo; });
      }
      function clampPan() {
        tx = clamp(tx, -(k - 1) * VBW, 0); ty = clamp(ty, -(k - 1) * VBH, 0);
        if (k <= ZMIN) { tx = 0; ty = 0; }
      }
      function ratio() { var r = svg.getBoundingClientRect(); return { sx: VBW / r.width, sy: VBH / r.height, r: r }; }
      function zoomAt(vx, vy, nk) {                        // keep the world point under (vx,vy) fixed
        nk = clamp(nk, ZMIN, ZMAX);
        var wx = (vx - tx) / k, wy = (vy - ty) / k;
        k = nk; tx = vx - wx * k; ty = vy - wy * k; clampPan(); apply();
      }
      apply();

      on(svg, "wheel", function (e) {
        e.preventDefault();
        var g = ratio(); var vx = (e.clientX - g.r.left) * g.sx, vy = (e.clientY - g.r.top) * g.sy;
        zoomAt(vx, vy, k * (e.deltaY < 0 ? 1.16 : 0.862));
      }, { passive: false });

      on(svg, "pointerdown", function (e) {
        down = { x: e.clientX, y: e.clientY }; moved = false;
        svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
        svg.classList.add("dragging");
      });
      on(svg, "pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (!moved && dx * dx + dy * dy > 20) moved = true;
        if (moved) { var g = ratio(); tx += dx * g.sx; ty += dy * g.sy; down = { x: e.clientX, y: e.clientY }; clampPan(); apply(); }
      });
      function endDrag() { down = null; svg.classList.remove("dragging"); }
      on(svg, "pointerup", endDrag); on(svg, "pointercancel", endDrag);

      view.querySelector("#cx-nav").addEventListener("click", function (e) {
        var z = e.target.getAttribute("data-z"); if (!z) return;
        if (z === "reset") { tx = 0; ty = 0; k = 1; apply(); return; }
        zoomAt(VBW / 2, VBH / 2, z === "in" ? k * 1.5 : k / 1.5);
      });

      scene.querySelectorAll(".cxw-node").forEach(function (g) {
        g.addEventListener("click", function () { if (moved) return; openEntry(es[+g.getAttribute("data-i")]); });
      });

      // ---- the wildcard orbits ----
      var wilds = [];
      scene.querySelectorAll('[data-wild="1"]').forEach(function (g) { wilds.push({ g: g, e: es[+g.getAttribute("data-i")] }); });
      function place(t) {
        wilds.forEach(function (w) {
          var e = w.e, drift = e.orbit === "inner" ? (t * 360 / 240000) : (-t * 360 / 360000);
          var p = degPt(BASE[e.orbit][e.slot] + drift, R_ORBIT[e.orbit]);
          w.g.setAttribute("transform", "translate(" + fmt(p.x) + " " + fmt(p.y) + ")");
        });
      }
      place(0);
      if (!SITE.reduced) { (function tick(t) { if (!document.hidden) place(t || 0); raf = requestAnimationFrame(tick); })(0); }

      SITE._teardown = function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
        var b = document.getElementById("cx-box"); if (b) b.remove();
      };

      // all three depths fan OUTWARD along the radius (never inward — that piled the
      // between-god's name onto the close-god's). gem spacing (~94u) > name width,
      // so radially-stacked names clear each other; a tangential nudge fans them more.
      function radialLabel(deg, r, depth) {
        var a = ((deg % 360) + 360) % 360, vert = (a < 16 || a > 344 || (a > 164 && a < 196));
        var p = degPt(deg, r + 15), rad = (deg - 90) * Math.PI / 180, kk = ((depth == null ? 1 : depth) - 1) * 15;
        p.x += -Math.sin(rad) * kk; p.y += Math.cos(rad) * kk;
        var anchor = vert ? "middle" : (a < 180 ? "start" : "end");
        if (anchor === "start") p.x += 3; else if (anchor === "end") p.x -= 3;
        return { x: p.x, y: p.y + 3.5, anchor: anchor };
      }
    },

    onHash: function () {
      var h = (location.hash || "").slice(1);
      if (h.indexOf("cx-") === 0) { var id = h.slice(3), e = (CODEX_DATA.entries || []).filter(function (x) { return x.id === id; })[0]; if (e) openEntry(e); }
      else { var b = document.getElementById("cx-box"); if (b) b.remove(); }
    },
  });

  // the private rooms (manuscript · hord) register from their own tab files, behind crypt.js
})();
