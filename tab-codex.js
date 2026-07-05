/* colony — public codex template: the wheel of the 42, a constellation read
   through glass. a dark star-chart — delicate lines, a field of stars, and the
   revealed gods glowing as coloured stars; the six wedge-hues are faint nebulae
   that bleed into each other, a thin frosted lens catching the light over it all.
   annulus of 6 wedges (ring order tears–nectar–blood–ichor–fuel–ether), 12 radial
   lines × 3 depths = 36 grid seats + the two wildcard triangles ORBITING between
   the grid and the limits. sealed = a faint star in its region's hue. deep links: #cx-<id>. */
(function () {
  "use strict";
  var esc = SITE.esc;

  // ---- geometry (viewBox 1040 × 940; disc centred at 520,470 with side room) ----
  var CX = 520, CY = 470;
  var R_HOLE = 96, R_IN = 134, R_OUT = 396;
  var R_DEPTH = [184, 278, 366];
  var R_ORBIT = { inner: 116, outer: 436 };
  var BASE = { inner: [45, 165, 285], outer: [15, 135, 255] };
  var TAU = Math.PI * 2;

  var HUE = {
    tears:  "#5aa6ff", nectar: "#4fd694", blood:  "#ff6a7e",
    ichor:  "#b98bff", fuel:   "#ffb352", ether:  "#6fe0d6",
  };
  var WILD = "#ffce74";

  function hx(c) { c = c.replace("#", ""); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function rgb(a) { return "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")"; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  var WHITE = [255, 255, 255], PIT = [10, 13, 20];

  function degPt(deg, r) {
    var a = (deg - 90) * Math.PI / 180;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function arcPath(centerDeg, spread, r, cw) {
    var p1 = degPt(centerDeg - spread, r), p2 = degPt(centerDeg + spread, r);
    return "M" + fmt(p1.x) + " " + fmt(p1.y) + " A" + r + " " + r + " 0 0 " + (cw ? 1 : 0) + " " + fmt(p2.x) + " " + fmt(p2.y);
  }

  var SPINE_IDX = { tears: 0, nectar: 2, blood: 4, ichor: 6, fuel: 8, ether: 10 };
  var IDX_WEDGE = { 0: "tears", 2: "nectar", 4: "blood", 6: "ichor", 8: "fuel", 10: "ether" };

  function nodeBase(e) {
    if (e.orbit) return hx(WILD);
    var ln = CODEX_DATA.lines[e.line];
    if (ln.kind === "spine") return hx(HUE[IDX_WEDGE[e.line]]);
    var before = HUE[IDX_WEDGE[(e.line + 11) % 12]] || HUE[IDX_WEDGE[e.line - 1]];
    var after = HUE[IDX_WEDGE[(e.line + 1) % 12]];
    return mix(hx(before), hx(after), 0.5);
  }
  function depthShade(base, depth, isVoid) {
    if (isVoid) return mix(base, PIT, 0.42);          // itSwelgeth — the far-god darkening toward black (§4)
    var amt = [-0.06, 0.12, 0.30][depth == null ? 1 : depth];
    return amt < 0 ? mix(base, PIT, -amt) : mix(base, WHITE, amt);
  }
  function derivedSeat(e) {
    if (e.orbit) return "wildcard · " + e.orbit + " — orbiting";
    var ln = CODEX_DATA.lines[e.line];
    return ln.key + " · " + ["close", "between", "far"][e.depth];
  }

  var raf = null;

  function openEntry(e) {
    var old = document.getElementById("cx-box");
    if (old) old.remove();
    var box = document.createElement("div");
    box.id = "cx-box";
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
      box.innerHTML = '<div class="cx-entry frost">'
        + '<canvas class="cx-plate"></canvas>'
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

      // ================= the constellation, read through glass =================
      var s = '<div id="cx-wheelwrap"><svg id="cx-wheel" viewBox="0 0 1040 940" role="img" aria-label="the wheel of the 42">';

      s += "<defs>";
      // real glow — a gaussian bloom any star can wear
      s += '<filter id="cxbloom" x="-140%" y="-140%" width="380%" height="380%"><feGaussianBlur stdDeviation="4.2"/></filter>';
      s += '<filter id="cxbloomlg" x="-160%" y="-160%" width="420%" height="420%"><feGaussianBlur stdDeviation="8"/></filter>';
      // a thin frosted lens — subtle, so the star-field carries it (constellation, not canvas)
      s += '<radialGradient id="cxfrost" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '">'
         +   '<stop offset="0" stop-color="#0a0d13" stop-opacity="0.42"/>'
         +   '<stop offset="0.42" stop-color="#cfe0ff" stop-opacity="0.015"/>'
         +   '<stop offset="0.84" stop-color="#dbe8ff" stop-opacity="0.05"/>'
         +   '<stop offset="0.975" stop-color="#eef5ff" stop-opacity="0.13"/>'
         +   '<stop offset="1" stop-color="#eef5ff" stop-opacity="0"/>'
         + "</radialGradient>";
      // faint nebulae — the wedge-hues bleeding into each other
      Object.keys(SPINE_IDX).forEach(function (w) {
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<radialGradient id="cxw-' + w + '" gradientUnits="userSpaceOnUse" cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250">'
           +   '<stop offset="0" stop-color="' + HUE[w] + '" stop-opacity="0.15"/>'
           +   '<stop offset="0.55" stop-color="' + HUE[w] + '" stop-opacity="0.06"/>'
           +   '<stop offset="1" stop-color="' + HUE[w] + '" stop-opacity="0"/>'
           + "</radialGradient>";
      });
      var sheen = degPt(320, 178);
      s += '<radialGradient id="cxsheen" gradientUnits="userSpaceOnUse" cx="' + fmt(sheen.x) + '" cy="' + fmt(sheen.y) + '" r="250">'
         +   '<stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>'
         +   '<stop offset="0.3" stop-color="#ffffff" stop-opacity="0.045"/>'
         +   '<stop offset="0.65" stop-color="#ffffff" stop-opacity="0.012"/>'
         +   '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>'
         + "</radialGradient>";
      s += '<radialGradient id="cxrim" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '">'
         +   '<stop offset="0.88" stop-color="#dfeeff" stop-opacity="0"/>'
         +   '<stop offset="0.965" stop-color="#dfeeff" stop-opacity="0.13"/>'
         +   '<stop offset="1" stop-color="#dfeeff" stop-opacity="0"/>'
         + "</radialGradient>";
      s += '<radialGradient id="cxhole" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '">'
         +   '<stop offset="0" stop-color="#03050a" stop-opacity="0.9"/>'
         +   '<stop offset="0.72" stop-color="#090c13" stop-opacity="0.66"/>'
         +   '<stop offset="1" stop-color="#111621" stop-opacity="0.2"/>'
         + "</radialGradient>";
      s += '<clipPath id="cxclip"><circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/></clipPath>';
      s += "</defs>";

      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '" fill="url(#cxrim)"/>';
      s += '<g clip-path="url(#cxclip)">';
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxfrost)"/>';
      Object.keys(SPINE_IDX).forEach(function (w) {
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<circle cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250" fill="url(#cxw-' + w + ')"/>';
      });
      // the star-field — the constellation's ground, some bright, some faint
      for (var st = 0; st < 165; st++) {
        var srr = Math.sqrt(R_HOLE * R_HOLE + rnd() * (R_OUT * R_OUT - R_HOLE * R_HOLE));
        var sa = rnd() * TAU, big = rnd() < 0.1;
        s += '<circle class="cxw-star" cx="' + fmt(CX + srr * Math.cos(sa)) + '" cy="' + fmt(CY + srr * Math.sin(sa))
           + '" r="' + fmt(big ? 1.1 + rnd() * 0.9 : 0.35 + rnd() * 0.75) + '" opacity="' + fmt((big ? 0.2 : 0.06) + rnd() * 0.14) + '"/>';
      }
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxsheen)"/>';
      s += '<path class="cxw-hi" d="' + arcPath(0, 60, R_OUT - 2, true) + '" fill="none"/>';
      s += "</g>";

      // ---- the constellation scaffold — delicate lines ----
      R_DEPTH.forEach(function (r) { s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + r + '"/>'; });
      s += '<circle class="cxw-rim" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/>';
      s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + R_IN + '" opacity="0.45"/>';
      lines.forEach(function (ln, i) {
        var p1 = degPt(i * 30, R_IN), p2 = degPt(i * 30, R_OUT);
        s += '<line class="' + (ln.kind === "spine" ? "cxw-spine" : "cxw-seam") + '" x1="' + fmt(p1.x) + '" y1="' + fmt(p1.y)
           + '" x2="' + fmt(p2.x) + '" y2="' + fmt(p2.y) + '"/>';
      });
      s += '<circle class="cxw-hole" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '" fill="url(#cxhole)"/>';
      s += '<path class="cxw-lip" d="' + arcPath(320, 72, R_HOLE - 1, true) + '" fill="none"/>';

      // ---- the uncounted frame — thusNearen within, thusFaren out to the side on the same axis ----
      s += '<text class="cxw-ultra" x="' + CX + '" y="' + (CY + 4) + '" text-anchor="middle">thusNearen</text>';
      s += '<text class="cxw-ultra out" x="' + (CX - R_OUT - 16) + '" y="' + (CY + 4) + '" text-anchor="end">thusFaren</text>';

      // ---- wedge names — big, each in its colour, consistently outside the rim ----
      Object.keys(SPINE_IDX).forEach(function (w) {
        var deg = SPINE_IDX[w] * 30, lp = degPt(deg, R_OUT + 26);
        var a = ((deg % 360) + 360) % 360;
        var anchor = (a < 14 || a > 346 || (a > 166 && a < 194)) ? "middle" : (a < 180 ? "start" : "end");
        var dy = (a > 160 && a < 200) ? 6 : (a < 20 || a > 340) ? -3 : 5;
        var lit = rgb(mix(hx(HUE[w]), WHITE, 0.42));
        s += '<text class="cxw-wedge" x="' + fmt(lp.x) + '" y="' + fmt(lp.y + dy) + '" text-anchor="' + anchor
           + '" fill="' + lit + '" style="text-shadow:0 0 15px ' + HUE[w] + ',0 0 6px ' + HUE[w] + '">' + w + "</text>";
      });

      // ---- the seats: 36 grid stars (fixed) + 6 wildcards (positioned each frame) ----
      es.forEach(function (e, i) {
        var wild = !!e.orbit;
        var base = nodeBase(e);
        var p = wild ? { x: 0, y: 0 } : degPt(e.line * 30, R_DEPTH[e.depth]);
        var cls = "cxw-node " + (e.state === "revealed" ? "lit" : "sealed") + (wild ? " wild" : "");
        s += '<g class="' + cls + '" data-i="' + i + '"' + (wild ? ' data-wild="1"' : "") + ">";
        if (e.state === "revealed") {
          var vd = e.call === "itSwelgeth";
          var col = depthShade(base, e.depth, vd);
          var glow = vd ? mix(base, PIT, 0.24) : mix(base, WHITE, (e.depth || 0) * 0.08);
          var core = rgb(mix(col, WHITE, vd ? 0.16 : 0.28)), lbl = rgb(mix(col, WHITE, 0.72));
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

      s += "</svg></div>";
      html += s;
      html += '<p id="cx-legend">the wheel of the 42 — six wedges, twelve lines, three depths, read from the outside through the glass<br>'
            + '<span class="cx-lg-lit">◆</span> read &nbsp; <span class="cx-lg-seal">◇</span> still sealed &nbsp;·&nbsp; and the six that drift between the grid and the limits'
            + '<br>the frame is uncounted: thusNearen within · thusFaren beyond · thusSceaden the watershed between</p>';
      view.innerHTML = html;

      var svg = view.querySelector("#cx-wheel");
      svg.querySelectorAll(".cxw-node").forEach(function (g) {
        g.addEventListener("click", function () { openEntry(es[+g.getAttribute("data-i")]); });
      });

      var wilds = [];
      svg.querySelectorAll('[data-wild="1"]').forEach(function (g) { wilds.push({ g: g, e: es[+g.getAttribute("data-i")] }); });
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
        var b = document.getElementById("cx-box"); if (b) b.remove();
      };

      function radialLabel(deg, r, depth) {
        var a = ((deg % 360) + 360) % 360;
        var vert = (a < 16 || a > 344 || (a > 164 && a < 196));
        if (depth === 1 && !vert) {
          var pin = degPt(deg, r - 15), anch = a < 180 ? "end" : "start";
          pin.x += a < 180 ? -3 : 3;
          return { x: pin.x, y: pin.y + 3.5, anchor: anch };
        }
        var p = degPt(deg, r + 15), rad = (deg - 90) * Math.PI / 180;
        var k = ((depth == null ? 1 : depth) - 1) * 12;
        p.x += -Math.sin(rad) * k; p.y += Math.cos(rad) * k;
        var anchor = vert ? "middle" : (a < 180 ? "start" : "end");
        if (anchor === "start") p.x += 3; else if (anchor === "end") p.x -= 3;
        return { x: p.x, y: p.y + 3.5, anchor: anchor };
      }
    },

    onHash: function () {
      var h = (location.hash || "").slice(1);
      if (h.indexOf("cx-") === 0) {
        var id = h.slice(3);
        var e = (CODEX_DATA.entries || []).filter(function (x) { return x.id === id; })[0];
        if (e) openEntry(e);
      } else { var b = document.getElementById("cx-box"); if (b) b.remove(); }
    },
  });

  // the private rooms (manuscript · hord) register from their own tab files,
  // behind the encrypted gate in crypt.js
})();
