/* colony — public codex template: the wheel of the 42, a frosted GLASS DISC.
   the glass is the hero — colour is a soft tie-dye tint diffused within it, the
   six wedge-hues bleeding into each other at the seams. an annulus of 6 wedges
   in seam-fixed ring order, 12 radial lines × 3 depth bands = 36 grid seats, plus
   the two wildcard triangles ORBITING between the grid and the limits. sealed = a
   faint frosted star in its region's hue · revealed = a lit gem. deep links: #cx-<id>. */
(function () {
  "use strict";
  var esc = SITE.esc;

  // ---- geometry (viewBox 940 square, centre 470 — spread wide) ----
  var C = 470;
  var R_HOLE = 100;                      // thusNearen — the inner hole
  var R_IN = 138, R_OUT = 398;           // the glass disc
  var R_DEPTH = [186, 280, 368];         // close · between · far (spread; value deep → bright toward the rim)
  var R_ORBIT = { inner: 118, outer: 438 }; // the wildcard orbits — inside the hole-lip · beyond the rim
  var BASE = { inner: [45, 165, 285], outer: [15, 135, 255] }; // triangle vertices (0 = top, cw), off-spine
  var TAU = Math.PI * 2;

  // ---- jewel palette (soft, diffused — the glass shows through) ----
  var HUE = {
    tears:  "#5aa6ff",  // sapphire — emotion / the mind seam
    nectar: "#4fd694",  // emerald — life / growth
    blood:  "#ff6a7e",  // crimson-rose — destruction
    ichor:  "#b98bff",  // amethyst — magic / authority
    fuel:   "#ffb352",  // amber-gold — the machine
    ether:  "#6fe0d6",  // aqua — the unknown
  };
  var WILD = "#ffce74";  // the wildcards wear no wedge — a warm gold, outside the wheel (her light)

  function hx(c) { c = c.replace("#", ""); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function rgb(a) { return "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")"; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  var WHITE = [255, 255, 255], PIT = [10, 13, 20];

  function degPt(deg, r) {                // 0° = top, clockwise
    var a = (deg - 90) * Math.PI / 180;
    return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
  }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function arcPath(centerDeg, spread, r, cw) {
    var p1 = degPt(centerDeg - spread, r), p2 = degPt(centerDeg + spread, r);
    return "M" + fmt(p1.x) + " " + fmt(p1.y) + " A" + r + " " + r + " 0 0 " + (cw ? 1 : 0) + " " + fmt(p2.x) + " " + fmt(p2.y);
  }

  var SPINE_IDX = { tears: 0, nectar: 2, blood: 4, ichor: 6, fuel: 8, ether: 10 };
  var IDX_WEDGE = { 0: "tears", 2: "nectar", 4: "blood", 6: "ichor", 8: "fuel", 10: "ether" };

  function nodeBase(e) {                  // the god's own hue: spine = wedge, seam = blend
    if (e.orbit) return hx(WILD);
    var ln = CODEX_DATA.lines[e.line];
    if (ln.kind === "spine") return hx(HUE[IDX_WEDGE[e.line]]);
    var before = HUE[IDX_WEDGE[(e.line + 11) % 12]] || HUE[IDX_WEDGE[e.line - 1]];
    var after = HUE[IDX_WEDGE[(e.line + 1) % 12]];
    return mix(hx(before), hx(after), 0.5);
  }
  function depthShade(base, depth, isVoid) {   // value from depth: close deep, far bright
    if (isVoid) return mix(base, PIT, 0.42);     // itSwelgeth — the lone far-god darkening toward black (§4 rule-break)
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
    box.addEventListener("click", function () {
      box.remove();
      history.replaceState(null, "", "#codex");
    });
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

      // ================= the frosted glass disc =================
      var s = '<div id="cx-wheelwrap"><svg id="cx-wheel" viewBox="0 0 940 940" role="img" aria-label="the wheel of the 42">';

      s += "<defs>";
      // the frosted glass BODY — milky, brightest toward the rim (the glass is the hero)
      s += '<radialGradient id="cxfrost" gradientUnits="userSpaceOnUse" cx="470" cy="470" r="' + R_OUT + '">'
         +   '<stop offset="0" stop-color="#0a0d13" stop-opacity="0.5"/>'
         +   '<stop offset="0.26" stop-color="#dbe8ff" stop-opacity="0.03"/>'
         +   '<stop offset="0.62" stop-color="#dbe8ff" stop-opacity="0.075"/>'
         +   '<stop offset="0.9" stop-color="#eaf3ff" stop-opacity="0.13"/>'
         +   '<stop offset="0.985" stop-color="#f4f9ff" stop-opacity="0.2"/>'
         +   '<stop offset="1" stop-color="#f4f9ff" stop-opacity="0"/>'
         + "</radialGradient>";
      // the tie-dye — 6 soft colour clouds bleeding into each other (subtle; the glass shows through)
      Object.keys(SPINE_IDX).forEach(function (w) {
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<radialGradient id="cxw-' + w + '" gradientUnits="userSpaceOnUse" cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="248">'
           +   '<stop offset="0" stop-color="' + HUE[w] + '" stop-opacity="0.2"/>'
           +   '<stop offset="0.55" stop-color="' + HUE[w] + '" stop-opacity="0.09"/>'
           +   '<stop offset="1" stop-color="' + HUE[w] + '" stop-opacity="0"/>'
           + "</radialGradient>";
      });
      // specular sheen — a tight lens catch, upper-left (glass curvature)
      var sheen = degPt(320, 176);
      s += '<radialGradient id="cxsheen" gradientUnits="userSpaceOnUse" cx="' + fmt(sheen.x) + '" cy="' + fmt(sheen.y) + '" r="252">'
         +   '<stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/>'
         +   '<stop offset="0.28" stop-color="#ffffff" stop-opacity="0.07"/>'
         +   '<stop offset="0.62" stop-color="#ffffff" stop-opacity="0.02"/>'
         +   '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>'
         + "</radialGradient>";
      // the hole — a well that deepens toward the centre
      s += '<radialGradient id="cxhole" gradientUnits="userSpaceOnUse" cx="470" cy="470" r="' + R_HOLE + '">'
         +   '<stop offset="0" stop-color="#03050a" stop-opacity="0.95"/>'
         +   '<stop offset="0.7" stop-color="#090c13" stop-opacity="0.82"/>'
         +   '<stop offset="1" stop-color="#111621" stop-opacity="0.5"/>'
         + "</radialGradient>";
      s += '<radialGradient id="cxrim" gradientUnits="userSpaceOnUse" cx="470" cy="470" r="' + (R_OUT + 30) + '">'
         +   '<stop offset="0.87" stop-color="#dfeeff" stop-opacity="0"/>'
         +   '<stop offset="0.96" stop-color="#dfeeff" stop-opacity="0.16"/>'
         +   '<stop offset="1" stop-color="#dfeeff" stop-opacity="0"/>'
         + "</radialGradient>";
      s += '<clipPath id="cxclip"><circle cx="470" cy="470" r="' + R_OUT + '"/></clipPath>';
      s += "</defs>";

      s += '<circle cx="470" cy="470" r="' + (R_OUT + 30) + '" fill="url(#cxrim)"/>';        // rim halo
      s += '<g clip-path="url(#cxclip)">';
      s += '<circle cx="470" cy="470" r="' + R_OUT + '" fill="url(#cxfrost)"/>';               // frosted body
      Object.keys(SPINE_IDX).forEach(function (w) {                                            // tie-dye clouds
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<circle cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="248" fill="url(#cxw-' + w + ')"/>';
      });
      for (var st = 0; st < 120; st++) {                                                       // stars in the glass
        var srr = Math.sqrt(R_HOLE * R_HOLE + rnd() * (R_OUT * R_OUT - R_HOLE * R_HOLE));
        var sa = rnd() * TAU;
        s += '<circle class="cxw-star" cx="' + fmt(C + srr * Math.cos(sa)) + '" cy="' + fmt(C + srr * Math.sin(sa))
           + '" r="' + fmt(0.4 + rnd() * 1.0) + '" opacity="' + fmt(0.05 + rnd() * 0.1) + '"/>';
      }
      s += '<circle cx="470" cy="470" r="' + R_OUT + '" fill="url(#cxsheen)"/>';                // sheen on top
      // the top highlight — light kissing the glass edge
      s += '<path class="cxw-hi" d="' + arcPath(0, 62, R_OUT - 2, true) + '" fill="none"/>';
      s += "</g>";

      // ---- the grid etched in the glass ----
      R_DEPTH.forEach(function (r) { s += '<circle class="cxw-band" cx="470" cy="470" r="' + r + '"/>'; });
      s += '<circle class="cxw-rim" cx="470" cy="470" r="' + R_OUT + '"/>';
      s += '<circle class="cxw-band" cx="470" cy="470" r="' + R_IN + '" opacity="0.5"/>';
      lines.forEach(function (ln, i) {
        var p1 = degPt(i * 30, R_IN), p2 = degPt(i * 30, R_OUT);
        s += '<line class="' + (ln.kind === "spine" ? "cxw-spine" : "cxw-seam") + '" x1="' + fmt(p1.x) + '" y1="' + fmt(p1.y)
           + '" x2="' + fmt(p2.x) + '" y2="' + fmt(p2.y) + '"/>';
      });
      s += '<circle class="cxw-hole" cx="470" cy="470" r="' + R_HOLE + '" fill="url(#cxhole)"/>';
      s += '<path class="cxw-lip" d="' + arcPath(320, 74, R_HOLE - 1, true) + '" fill="none"/>';  // light wraps the lip

      // ---- the uncounted frame — the limits, not nodes (both flat, never mirrored) ----
      s += '<text class="cxw-ultra" x="470" y="474" text-anchor="middle">thusNearen</text>';
      s += '<text class="cxw-ultra out" x="470" y="' + (C + R_OUT + 58) + '" text-anchor="middle">thusFaren</text>';

      // ---- wedge names — BIG, each in its colour, all consistently OUTSIDE the rim ----
      Object.keys(SPINE_IDX).forEach(function (w) {
        var deg = SPINE_IDX[w] * 30;
        var lp = degPt(deg, R_OUT + 26);
        var a = ((deg % 360) + 360) % 360;
        var anchor = (a < 14 || a > 346 || (a > 166 && a < 194)) ? "middle" : (a < 180 ? "start" : "end");
        var dy = (a > 160 && a < 200) ? 6 : (a < 20 || a > 340) ? -3 : 5;   // sit above/below/beside cleanly
        var lit = rgb(mix(hx(HUE[w]), WHITE, 0.4));
        s += '<text class="cxw-wedge" x="' + fmt(lp.x) + '" y="' + fmt(lp.y + dy) + '" text-anchor="' + anchor
           + '" fill="' + lit + '" style="text-shadow:0 0 14px ' + HUE[w] + ',0 0 5px ' + HUE[w] + '">' + w + "</text>";
      });

      // ---- the seats: 36 grid gems (fixed) + 6 wildcards (positioned each frame) ----
      es.forEach(function (e, i) {
        var wild = !!e.orbit;
        var base = nodeBase(e);
        var p = wild ? { x: 0, y: 0 } : degPt(e.line * 30, R_DEPTH[e.depth]);
        var cls = "cxw-node " + (e.state === "revealed" ? "lit" : "sealed") + (wild ? " wild" : "");
        s += '<g class="' + cls + '" data-i="' + i + '"' + (wild ? ' data-wild="1"' : "") + ">";
        if (e.state === "revealed") {
          var vd = e.call === "itSwelgeth";                 // the void-maker wears the wrong pole
          var col = depthShade(base, e.depth, vd);
          var glow = vd ? rgb(mix(base, PIT, 0.26)) : rgb(mix(base, WHITE, (e.depth || 0) * 0.06));
          var core = rgb(mix(col, WHITE, vd ? 0.13 : 0.16)), lbl = rgb(mix(col, WHITE, vd ? 0.62 : 0.55));
          var lp = wild ? { x: p.x, y: p.y + 32, anchor: "middle" } : radialLabel(e.line * 30, R_DEPTH[e.depth], e.depth);
          s += '<circle class="halo" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="20" fill="' + glow + '"/>'
             + '<circle class="glow" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 12 : 11) + '" fill="' + glow + '"/>'
             + '<circle class="gem" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 7 : 6.2) + '" fill="' + core + '"/>'
             + '<circle class="spark" cx="' + fmt(p.x - 2) + '" cy="' + fmt(p.y - 2.4) + '" r="1.9" fill="#ffffff"/>'
             + '<text class="lbl" x="' + fmt(lp.x) + '" y="' + fmt(lp.y) + '" text-anchor="' + lp.anchor + '" fill="' + lbl + '">' + esc(e.call) + "</text>";
        } else {
          var dim = rgb(mix(base, PIT, 0.4));
          s += '<circle class="dim" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="4.6" fill="' + dim + '"/>'
             + '<circle class="dim-ring" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="4.6" stroke="' + rgb(mix(base, WHITE, 0.2)) + '"/>';
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

      // ---- the wildcard orbits (canon: they DRIFT between the grid and the infinities) ----
      var wilds = [];
      svg.querySelectorAll('[data-wild="1"]').forEach(function (g) {
        wilds.push({ g: g, e: es[+g.getAttribute("data-i")] });
      });
      function place(t) {
        wilds.forEach(function (w) {
          var e = w.e;
          var drift = e.orbit === "inner" ? (t * 360 / 240000) : (-t * 360 / 360000);
          var deg = BASE[e.orbit][e.slot] + drift;
          var p = degPt(deg, R_ORBIT[e.orbit]);
          w.g.setAttribute("transform", "translate(" + fmt(p.x) + " " + fmt(p.y) + ")");
        });
      }
      place(0);
      if (!SITE.reduced) {
        (function tick(t) {
          if (!document.hidden) place(t || 0);
          raf = requestAnimationFrame(tick);
        })(0);
      }

      SITE._teardown = function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        var b = document.getElementById("cx-box");
        if (b) b.remove();
      };

      // radial label — the name sits just outside its gem. the three depths on one
      // line never pile up: close & far fan OUT (tangential stagger), between flips
      // to the INNER side, so the stack always breaks in three directions
      function radialLabel(deg, r, depth) {
        var a = ((deg % 360) + 360) % 360;
        var vert = (a < 16 || a > 344 || (a > 164 && a < 196));
        if (depth === 1 && !vert) {                    // between god → inner side, opposite anchor
          var pin = degPt(deg, r - 15);
          var anch = a < 180 ? "end" : "start";
          pin.x += a < 180 ? -3 : 3;
          return { x: pin.x, y: pin.y + 3.5, anchor: anch };
        }
        var p = degPt(deg, r + 16);
        var rad = (deg - 90) * Math.PI / 180;
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
      } else {
        var b = document.getElementById("cx-box");
        if (b) b.remove();
      }
    },
  });

  // the private rooms (manuscript · hord) register from their own tab files,
  // behind the encrypted gate in crypt.js
})();
