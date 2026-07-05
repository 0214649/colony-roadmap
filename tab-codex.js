/* colony — public codex template: the celestial map (renders CODEX_DATA)
   the wheel is an annulus — 6 wedges in seam-fixed ring order, 12 radial
   lines × 3 depth bands = 36 grid seats, plus the two wildcard triangles
   ORBITING between the grid and the limits (they drift; the grid is fixed).
   sealed = faint unread star · revealed = amber-lit node. deep links: #cx-<id>. */
(function () {
  "use strict";
  var esc = SITE.esc;

  // ---- geometry (viewBox units; 720 square, centre 360) ----
  var C = 360;
  var R_HOLE = 96;                       // thusNearen — the inner hole the close band reaches toward
  var R_IN = 118, R_OUT = 310;           // the annulus (the grid's ground)
  var R_DEPTH = [150, 214, 278];         // close · between · far (value runs dark → light)
  var R_ORBIT = { inner: 108, outer: 332 }; // the wildcard orbits — between the grid and the infinities
  var BASE = { inner: [45, 165, 285], outer: [15, 135, 255] }; // triangle vertices (0 = top, cw), set off-spine so the load frame never covers a wedge name
  var TAU = Math.PI * 2;

  function degPt(deg, r) {               // 0° = top, clockwise
    var a = (deg - 90) * Math.PI / 180;
    return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
  }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function arcPath(centerDeg, spread, r, upright) { // small arc for curved labels
    var a1 = centerDeg - spread, a2 = centerDeg + spread;
    if (upright === false) { var t = a1; a1 = a2; a2 = t; } // reversed sweep — bottom labels stay readable
    var p1 = degPt(a1, r), p2 = degPt(a2, r);
    return "M" + fmt(p1.x) + " " + fmt(p1.y) + " A" + r + " " + r + " 0 0 " + (upright === false ? 0 : 1) + " " + fmt(p2.x) + " " + fmt(p2.y);
  }
  function sectorPath(centerDeg) {       // annular 60° wedge wash
    var a1 = centerDeg - 30, a2 = centerDeg + 30;
    var o1 = degPt(a1, R_OUT), o2 = degPt(a2, R_OUT), i1 = degPt(a1, R_IN), i2 = degPt(a2, R_IN);
    return "M" + fmt(o1.x) + " " + fmt(o1.y) + " A" + R_OUT + " " + R_OUT + " 0 0 1 " + fmt(o2.x) + " " + fmt(o2.y)
         + " L" + fmt(i2.x) + " " + fmt(i2.y) + " A" + R_IN + " " + R_IN + " 0 0 0 " + fmt(i1.x) + " " + fmt(i1.y) + " Z";
  }

  function derivedSeat(e) {              // sealed entries carry no authored seat — the map's coordinates speak
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
      box.innerHTML = '<div class="cx-entry frost">'
        + (e.sprite ? '<img src="' + SITE.asset(e.sprite) + '" alt="">' : "")
        + '<div class="cx-call">' + esc(e.call || "") + "</div>"
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
      var wedges = CODEX_DATA.wedges || {};
      var rev = es.filter(function (e) { return e.state === "revealed"; }).length;
      var rnd = SITE.seeded("cx-field");

      var html = '<div id="cx-head"><p class="eyebrow">codex</p>'
               + '<p class="lede" style="margin:0 auto">comprehension is translation. what the game has revealed is readable here — the rest is still in the old tongue.</p>'
               + '<div style="height:12px"></div>'
               + '<p id="cx-count"><b>' + rev + "</b> of <b>" + es.length + "</b> read</p></div>";

      // ================= the wheel =================
      var s = '<div id="cx-wheelwrap"><svg id="cx-wheel" viewBox="0 0 720 720" role="img" aria-label="the wheel of the 42">';
      s += "<defs>"
         + '<radialGradient id="cxdepth" gradientUnits="userSpaceOnUse" cx="360" cy="360" r="360">'
         +   '<stop offset="0.24" stop-color="#080a0e" stop-opacity="0.55"/>'
         +   '<stop offset="0.40" stop-color="#080a0e" stop-opacity="0.18"/>'
         +   '<stop offset="0.60" stop-color="#080a0e" stop-opacity="0"/>'
         +   '<stop offset="0.78" stop-color="#eef2f8" stop-opacity="0.03"/>'
         +   '<stop offset="0.86" stop-color="#eef2f8" stop-opacity="0.07"/>'
         +   '<stop offset="0.93" stop-color="#eef2f8" stop-opacity="0"/>'
         + "</radialGradient>"
         + '<radialGradient id="cxglow" gradientUnits="objectBoundingBox" cx="0.5" cy="0.5" r="0.5">'
         +   '<stop offset="0" stop-color="#e0a23a" stop-opacity="0.55"/>'
         +   '<stop offset="0.55" stop-color="#e0a23a" stop-opacity="0.18"/>'
         +   '<stop offset="1" stop-color="#e0a23a" stop-opacity="0"/>'
         + "</radialGradient>"
         + "</defs>";

      // wedge washes — hue from the wedge, whispered
      var spineIdx = { tears: 0, nectar: 2, blood: 4, ichor: 6, fuel: 8, ether: 10 };
      Object.keys(spineIdx).forEach(function (w) {
        s += '<path d="' + sectorPath(spineIdx[w] * 30) + '" fill="' + wedges[w] + '" opacity="0.09"/>';
      });
      // value from depth — dark toward the hole, pale toward the rim
      s += '<circle cx="360" cy="360" r="360" fill="url(#cxdepth)"/>';

      // the field — seeded stars, stable forever
      for (var st = 0; st < 90; st++) {
        var srr = Math.sqrt(R_IN * R_IN + rnd() * (R_OUT * R_OUT - R_IN * R_IN));
        var sa = rnd() * TAU;
        s += '<circle class="cxw-star" cx="' + fmt(C + srr * Math.cos(sa)) + '" cy="' + fmt(C + srr * Math.sin(sa))
           + '" r="' + fmt(0.5 + rnd() * 0.9) + '" opacity="' + fmt(0.04 + rnd() * 0.09) + '"/>';
      }

      // the grid — bands, rim, hole, the 12 lines
      R_DEPTH.forEach(function (r) { s += '<circle class="cxw-band" cx="360" cy="360" r="' + r + '"/>'; });
      s += '<circle class="cxw-rim" cx="360" cy="360" r="' + R_OUT + '"/>';
      s += '<circle class="cxw-band" cx="360" cy="360" r="' + R_IN + '" opacity="0.5"/>';
      lines.forEach(function (ln, i) {
        var p1 = degPt(i * 30, R_IN), p2 = degPt(i * 30, R_OUT);
        s += '<line class="' + (ln.kind === "spine" ? "cxw-spine" : "cxw-seam") + '" x1="' + fmt(p1.x) + '" y1="' + fmt(p1.y)
           + '" x2="' + fmt(p2.x) + '" y2="' + fmt(p2.y) + '"/>';
      });
      s += '<circle class="cxw-hole" cx="360" cy="360" r="' + R_HOLE + '"/>';

      // the uncounted frame — the limits, not nodes
      s += '<text class="cxw-ultra" x="360" y="364" text-anchor="middle">thusNearen</text>';
      s += '<path id="cxfar" d="' + arcPath(180, 26, 352, false) + '" fill="none"/>'
         + '<text class="cxw-ultra"><textPath href="#cxfar" startOffset="50%" text-anchor="middle">thusFaren</textPath></text>';

      // wedge names ring the rim, riding their spines
      Object.keys(spineIdx).forEach(function (w) {
        var deg = spineIdx[w] * 30;
        var upright = !(deg > 90 && deg < 270);
        var id = "cxwl-" + w;
        s += '<path id="' + id + '" d="' + arcPath(deg, 24, 326, upright) + '" fill="none"/>'
           + '<text class="cxw-wedge"><textPath href="#' + id + '" startOffset="50%" text-anchor="middle">' + w + "</textPath></text>";
      });

      // the seats — 36 grid stars (fixed) + 6 wildcards (built at origin, positioned each frame)
      es.forEach(function (e, i) {
        var wild = !!e.orbit;
        var p = wild ? { x: 0, y: 0 } : degPt(e.line * 30, R_DEPTH[e.depth]);
        var cls = "cxw-node " + (e.state === "revealed" ? "lit" : "sealed") + (wild ? " wild" : "");
        s += '<g class="' + cls + '" data-i="' + i + '"' + (wild ? ' data-wild="1"' : "") + ">";
        if (e.state === "revealed") {
          s += '<circle class="halo" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="16" fill="url(#cxglow)"/>'
             // a dashed ring = the band is not yet confirmed by the vault (the map must not claim it)
             + '<circle class="ring' + (e.depthUnconfirmed ? " tbd" : "") + '" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 10.5 : 9.5) + '"/>'
             + '<circle class="core" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 7 : 6) + '"/>'
             + '<text class="lbl" x="' + fmt(p.x) + '" y="' + fmt(p.y + 26) + '" text-anchor="middle">' + esc(e.call) + "</text>";
        } else {
          s += '<circle class="dim" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="4.5"/>';
          if (!wild) { // a fragment of unread writing beside the star
            var trnd = SITE.seeded("cx-tick-" + e.id);
            for (var k = 0; k < 2; k++) {
              var ta = trnd() * TAU, tr = 8 + trnd() * 4, tl = 4 + trnd() * 4;
              var tx = p.x + Math.cos(ta) * tr, ty = p.y + Math.sin(ta) * tr;
              s += '<line class="tick" x1="' + fmt(tx) + '" y1="' + fmt(ty) + '" x2="' + fmt(tx + Math.cos(ta + 1.4) * tl) + '" y2="' + fmt(ty + Math.sin(ta + 1.4) * tl) + '"/>';
            }
          }
        }
        s += '<circle class="hit" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="16"/>'
           + "<title>" + esc(e.state === "revealed" ? e.call + " — " + (e.seat || "") : "sealed — " + derivedSeat(e)) + "</title></g>";
      });

      s += "</svg></div>";
      html += s;
      html += '<p id="cx-legend">● read · ○ sealed · six wedges, twelve lines, three depths — and the six that drift between the grid and the limits<br>'
            + "the frame is uncounted: thusNearen within · thusFaren beyond · thusSceaden between</p>";
      view.innerHTML = html;

      // ---- interaction ----
      var svg = view.querySelector("#cx-wheel");
      svg.querySelectorAll(".cxw-node").forEach(function (g) {
        g.addEventListener("click", function () { openEntry(es[+g.getAttribute("data-i")]); });
      });

      // ---- the wildcard orbits (canon: they ORBIT between the grid and the infinities) ----
      var wilds = [];
      svg.querySelectorAll('[data-wild="1"]').forEach(function (g) {
        var e = es[+g.getAttribute("data-i")];
        wilds.push({ g: g, e: e });
      });
      function place(t) {
        wilds.forEach(function (w) {
          var e = w.e;
          var drift = e.orbit === "inner" ? (t * 360 / 240000) : (-t * 360 / 360000); // slow, opposing
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

      // the router calls this when the tab is left — stop the sky, close any entry
      SITE._teardown = function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        var b = document.getElementById("cx-box");
        if (b) b.remove();
      };
    },

    // #cx-<id> deep links — a shared star opens its entry
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
