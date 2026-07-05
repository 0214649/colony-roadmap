/* colony — public codex: the wheel of the 42, a cursed glass orrery. the powers
   turn as stars on a dark disc read through the glass; drag to pan · scroll to zoom;
   click a star and the deity opens on a frosted pane — the face, the name, what has
   been read — while the wheel keeps turning, blurred, behind it. bible §9: "a starfield
   you light by understanding." 6 wedges (tears–nectar–blood–ichor–fuel–ether) · 12
   radial lines × 3 depths = 36 grid seats + the two wildcard triangles that orbit the
   limits. deep links: #cx-<id>. */
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
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  var WHITE = [255, 255, 255], PIT = [10, 13, 20];

  function degPt(deg, r) { var a = (deg - 90) * Math.PI / 180; return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }; }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function arcPath(cd, sp, r, cw) { var p1 = degPt(cd - sp, r), p2 = degPt(cd + sp, r); return "M" + fmt(p1.x) + " " + fmt(p1.y) + " A" + r + " " + r + " 0 0 " + (cw ? 1 : 0) + " " + fmt(p2.x) + " " + fmt(p2.y); }

  var SPINE_IDX = { tears: 0, nectar: 2, blood: 4, ichor: 6, fuel: 8, ether: 10 };
  var IDX_WEDGE = { 0: "tears", 2: "nectar", 4: "blood", 6: "ichor", 8: "fuel", 10: "ether" };

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

  // a scatter of asemic runes — invented script, the old tongue, cryptic
  function runePlate(seed, rows, cols) {
    return '<canvas class="cx-rune" data-seed="' + esc(seed) + '" data-r="' + rows + '" data-c="' + cols + '"></canvas>';
  }

  // ---- the deity opens on a frosted pane; the wheel keeps turning, blurred, behind it ----
  function openDeity(e) {
    var old = document.getElementById("cx-deity"); if (old) old.remove();
    var base = nodeBase(e), hue = rgb(base), tint = rgb(depthShade(base, 2, e.call === "itSwelgeth"));
    var box = document.createElement("div"); box.id = "cx-deity";
    var fig, info;
    if (e.state === "revealed") {
      fig = e.sprite
        ? '<img class="cx-deity-sprite" src="' + SITE.asset(e.sprite) + '" alt="' + esc(e.call) + '" decoding="async">'
        : runePlate("deity-" + e.id, 6, 3);
      info = '<div class="cx-deity-eyebrow">' + (e.sprite ? "the face" : "the read power") + "</div>"
        + '<h2 class="cx-deity-call" style="color:' + tint + '">' + esc(e.call) + "</h2>"
        + (e.gloss ? '<div class="cx-deity-gloss">' + esc(e.gloss.join(" · ")) + "</div>" : "")
        + '<div class="cx-deity-seat">' + esc(e.seat || derivedSeat(e)) + "</div>"
        + (e.body ? '<p class="cx-deity-body">' + esc(e.body) + "</p>" : "");
    } else {
      fig = runePlate("deity-" + e.id, 7, 4);
      info = '<div class="cx-deity-eyebrow">unread</div>'
        + '<h2 class="cx-deity-call sealed">still in the old tongue</h2>'
        + '<div class="cx-deity-seat">' + esc(derivedSeat(e)) + "</div>"
        + '<p class="cx-deity-body sealed">this power has not been read. comprehension has not yet dragged its name up into the legible — only the asemic mark remains, turning in the dark.</p>';
    }
    box.innerHTML = '<div class="cx-deity-pane frost" style="--gh:' + hue + '">'
      + '<div class="cx-deity-glow"></div>'
      + '<div class="cx-deity-fig' + (e.sprite ? " has-sprite" : "") + '">' + fig + "</div>"
      + '<div class="cx-deity-info">' + info + '<div class="cx-deity-close">touch the dark to close</div></div>'
      + "</div>";
    // click the void closes; clicks on the pane are read, not dismissed
    box.addEventListener("click", function () { box.remove(); history.replaceState(null, "", "#codex"); });
    box.querySelector(".cx-deity-pane").addEventListener("click", function (ev) { ev.stopPropagation(); });
    document.body.appendChild(box);
    box.querySelectorAll(".cx-rune").forEach(function (c) {
      SITE.asemic(c, c.getAttribute("data-seed"), { rows: +c.getAttribute("data-r"), cols: +c.getAttribute("data-c"), ink: "rgba(198,208,236,.42)" });
    });
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

      var html = '<div id="cx-wheelwrap"><div id="cx-head"><p class="eyebrow">codex</p>'
               + '<p id="cx-count"><b>' + rev + "</b> of <b>" + es.length + "</b> read</p>"
               + '<p class="lede">comprehension is translation — touch a power and its name climbs into the light.</p></div>';

      var s = '<svg id="cx-wheel" viewBox="0 0 ' + VBW + " " + VBH + '" role="img" aria-label="the wheel of the 42"><g id="cx-scene">';

      s += "<defs>";
      s += '<filter id="cxbloom" x="-140%" y="-140%" width="380%" height="380%"><feGaussianBlur stdDeviation="4.2"/></filter>';
      s += '<filter id="cxbloomlg" x="-160%" y="-160%" width="420%" height="420%"><feGaussianBlur stdDeviation="8"/></filter>';
      // the disc runs darker + colder now — a cursed well, barely lit at the rim
      s += '<radialGradient id="cxfrost" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '">'
         + '<stop offset="0" stop-color="#05070c" stop-opacity="0.62"/><stop offset="0.44" stop-color="#0a1016" stop-opacity="0.24"/>'
         + '<stop offset="0.86" stop-color="#9fb6d6" stop-opacity="0.03"/><stop offset="0.975" stop-color="#c7d6ef" stop-opacity="0.08"/>'
         + '<stop offset="1" stop-color="#c7d6ef" stop-opacity="0"/></radialGradient>';
      Object.keys(SPINE_IDX).forEach(function (w) {
        var c = degPt(SPINE_IDX[w] * 30, 262);
        s += '<radialGradient id="cxw-' + w + '" gradientUnits="userSpaceOnUse" cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250">'
           + '<stop offset="0" stop-color="' + HUE[w] + '" stop-opacity="0.115"/><stop offset="0.55" stop-color="' + HUE[w] + '" stop-opacity="0.045"/>'
           + '<stop offset="1" stop-color="' + HUE[w] + '" stop-opacity="0"/></radialGradient>';
      });
      var sheen = degPt(320, 178);
      s += '<radialGradient id="cxsheen" gradientUnits="userSpaceOnUse" cx="' + fmt(sheen.x) + '" cy="' + fmt(sheen.y) + '" r="240">'
         + '<stop offset="0" stop-color="#eef4ff" stop-opacity="0.09"/><stop offset="0.4" stop-color="#eef4ff" stop-opacity="0.02"/>'
         + '<stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></radialGradient>';
      s += '<radialGradient id="cxrim" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '">'
         + '<stop offset="0.88" stop-color="#a9c6ef" stop-opacity="0"/><stop offset="0.965" stop-color="#a9c6ef" stop-opacity="0.11"/>'
         + '<stop offset="1" stop-color="#a9c6ef" stop-opacity="0"/></radialGradient>';
      s += '<radialGradient id="cxhole" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '">'
         + '<stop offset="0" stop-color="#010204" stop-opacity="0.98"/><stop offset="0.7" stop-color="#05070d" stop-opacity="0.82"/>'
         + '<stop offset="1" stop-color="#0d1220" stop-opacity="0.22"/></radialGradient>';
      s += '<clipPath id="cxclip"><circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/></clipPath>';
      s += "</defs>";

      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R_OUT + 30) + '" fill="url(#cxrim)"/>';
      s += '<g clip-path="url(#cxclip)">';
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxfrost)"/>';
      Object.keys(SPINE_IDX).forEach(function (w) { var c = degPt(SPINE_IDX[w] * 30, 262); s += '<circle cx="' + fmt(c.x) + '" cy="' + fmt(c.y) + '" r="250" fill="url(#cxw-' + w + ')"/>'; });
      for (var st = 0; st < 190; st++) {
        var srr = Math.sqrt(R_HOLE * R_HOLE + rnd() * (R_OUT * R_OUT - R_HOLE * R_HOLE)), sa = rnd() * TAU, big = rnd() < 0.09;
        s += '<circle class="cxw-star" cx="' + fmt(CX + srr * Math.cos(sa)) + '" cy="' + fmt(CY + srr * Math.sin(sa)) + '" r="' + fmt(big ? 1.0 + rnd() * 0.9 : 0.32 + rnd() * 0.7) + '" opacity="' + fmt((big ? 0.18 : 0.05) + rnd() * 0.12) + '"/>';
      }
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '" fill="url(#cxsheen)"/>';
      s += '<path class="cxw-hi" d="' + arcPath(0, 56, R_OUT - 2, true) + '" fill="none"/>';
      s += "</g>";

      // ---- the grid, etched faint ----
      R_DEPTH.forEach(function (r) { s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + r + '"/>'; });
      s += '<circle class="cxw-rim" cx="' + CX + '" cy="' + CY + '" r="' + R_OUT + '"/>';
      s += '<circle class="cxw-band" cx="' + CX + '" cy="' + CY + '" r="' + R_IN + '" opacity="0.4"/>';
      lines.forEach(function (ln, i) { var p1 = degPt(i * 30, R_IN), p2 = degPt(i * 30, R_OUT); s += '<line class="' + (ln.kind === "spine" ? "cxw-spine" : "cxw-seam") + '" x1="' + fmt(p1.x) + '" y1="' + fmt(p1.y) + '" x2="' + fmt(p2.x) + '" y2="' + fmt(p2.y) + '"/>'; });

      // ---- the cursed incantation rings — runic marks turning slowly around the void ----
      function runeRing(r, count, sz, dur, cw, cls) {
        var g = '<g class="' + cls + '">';
        for (var i = 0; i < count; i++) {
          var deg = i * 360 / count, p = degPt(deg, r), rn = SITE.seeded(cls + i);
          var tall = sz * (0.6 + rn() * 0.5);
          g += '<g transform="translate(' + fmt(p.x) + " " + fmt(p.y) + ") rotate(" + fmt(deg) + ')">';
          g += '<line x1="0" y1="' + fmt(-tall / 2) + '" x2="0" y2="' + fmt(tall / 2) + '"/>';
          var m = 1 + Math.floor(rn() * 2);
          for (var k = 0; k < m; k++) { var my = -tall / 2 + tall * (0.2 + rn() * 0.6); g += '<line x1="0" y1="' + fmt(my) + '" x2="' + fmt((rn() < .5 ? -1 : 1) * (sz * .35)) + '" y2="' + fmt(my + (rn() - .5) * sz * .3) + '"/>'; }
          g += "</g>";
        }
        if (!SITE.reduced) g += '<animateTransform attributeName="transform" type="rotate" from="0 ' + CX + " " + CY + '" to="' + (cw ? 360 : -360) + " " + CX + " " + CY + '" dur="' + dur + 's" repeatCount="indefinite"/>';
        return g + "</g>";
      }
      s += runeRing(R_HOLE + 20, 22, 11, 150, false, "cx-runering inner");
      s += runeRing(R_OUT - 16, 40, 9, 260, true, "cx-runering outer");

      s += '<circle class="cxw-hole" cx="' + CX + '" cy="' + CY + '" r="' + R_HOLE + '" fill="url(#cxhole)"/>';
      s += '<path class="cxw-lip" d="' + arcPath(320, 72, R_HOLE - 1, true) + '" fill="none"/>';

      s += '<text class="cxw-ultra" x="' + CX + '" y="' + (CY + 4) + '" text-anchor="middle">thusNearen</text>';
      s += '<text class="cxw-ultra out" x="' + (CX - R_OUT - 16) + '" y="' + (CY + 4) + '" text-anchor="end">thusFaren</text>';

      Object.keys(SPINE_IDX).forEach(function (w) {
        var deg = SPINE_IDX[w] * 30, lp = degPt(deg, R_OUT + 26), a = ((deg % 360) + 360) % 360;
        var anchor = (a < 14 || a > 346 || (a > 166 && a < 194)) ? "middle" : (a < 180 ? "start" : "end");
        var dy = (a > 160 && a < 200) ? 6 : (a < 20 || a > 340) ? -3 : 5, lit = rgb(mix(hx(HUE[w]), WHITE, 0.4));
        s += '<text class="cxw-wedge" x="' + fmt(lp.x) + '" y="' + fmt(lp.y + dy) + '" text-anchor="' + anchor + '" fill="' + lit + '" style="text-shadow:0 0 15px ' + HUE[w] + ',0 0 6px ' + HUE[w] + '">' + w + "</text>";
      });

      es.forEach(function (e, i) {
        var wild = !!e.orbit, base = nodeBase(e);
        var p = wild ? { x: 0, y: 0 } : degPt(e.line * 30, R_DEPTH[e.depth]);
        s += '<g class="cxw-node ' + (e.state === "revealed" ? "lit" : "sealed") + (wild ? " wild" : "") + '" data-i="' + i + '"' + (wild ? ' data-wild="1"' : "") + ">";
        if (e.state === "revealed") {
          var vd = e.call === "itSwelgeth", col = depthShade(base, e.depth, vd);
          var glow = vd ? mix(base, PIT, 0.24) : mix(base, WHITE, (e.depth || 0) * 0.08);
          var core = rgb(mix(col, WHITE, vd ? 0.26 : 0.55)), lbl = rgb(mix(col, WHITE, 0.72));
          var lp = wild ? { x: p.x, y: p.y + 32, anchor: "middle" } : radialLabel(e.line * 30, R_DEPTH[e.depth], e.depth, lines[e.line] && lines[e.line].kind === "spine");
          s += '<circle class="bloom-lg" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 14 : 12) + '" fill="' + rgb(glow) + '" filter="url(#cxbloomlg)"/>'
             + '<circle class="bloom" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 8.5 : 7.5) + '" fill="' + rgb(mix(glow, WHITE, 0.4)) + '" filter="url(#cxbloom)"/>'
             + '<circle class="ring" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 6.2 : 5.6) + '" fill="none" stroke="' + rgb(mix(glow, WHITE, 0.35)) + '"/>'
             + '<circle class="gem" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="' + (wild ? 5 : 4.4) + '" fill="' + core + '"/>'
             + '<circle class="spark" cx="' + fmt(p.x - 1) + '" cy="' + fmt(p.y - 1.3) + '" r="1.9" fill="#ffffff"/>'
             + '<text class="lbl" x="' + fmt(lp.x) + '" y="' + fmt(lp.y) + '" text-anchor="' + lp.anchor + '" fill="' + lbl + '">' + esc(e.call) + "</text>";
        } else {
          s += '<circle class="dim-glow" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="5.5" fill="' + rgb(mix(base, WHITE, 0.1)) + '" filter="url(#cxbloom)"/>'
             + '<circle class="dim" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="2.9" fill="' + rgb(mix(base, WHITE, 0.55)) + '"/>';
        }
        s += '<circle class="hit" cx="' + fmt(p.x) + '" cy="' + fmt(p.y) + '" r="18"/>'
           + "<title>" + esc(e.state === "revealed" ? e.call + " — " + (e.seat || "") : "sealed — " + derivedSeat(e)) + "</title></g>";
      });

      s += "</g></svg>";
      s += '<div id="cx-nav"><button type="button" data-z="in" aria-label="zoom in">+</button>'
         + '<button type="button" data-z="out" aria-label="zoom out">−</button>'
         + '<button type="button" data-z="reset" aria-label="reset view">⤢</button></div>';
      s += '<div id="cx-cap">drag to pan · scroll to zoom · touch a star to read it &nbsp;·&nbsp; thusNearen within · thusFaren beyond · thusSceaden between</div>';
      s += "</div>";
      html += s;
      view.innerHTML = html;

      var svg = view.querySelector("#cx-wheel"), scene = view.querySelector("#cx-scene");

      var tx = 0, ty = 0, k = 1, moved = false, down = null;
      function apply() { scene.setAttribute("transform", "translate(" + fmt(tx) + " " + fmt(ty) + ") scale(" + fmt(k) + ")"); }
      function clampPan() { tx = clamp(tx, -(k - 1) * VBW, 0); ty = clamp(ty, -(k - 1) * VBH, 0); if (k <= ZMIN) { tx = 0; ty = 0; } }
      function toVB(cx, cy) { var m = svg.getScreenCTM(), pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; var v = pt.matrixTransform(m.inverse()); return { x: v.x, y: v.y, s: m.a || 1 }; }
      function zoomAt(vx, vy, nk) { nk = clamp(nk, ZMIN, ZMAX); var wx = (vx - tx) / k, wy = (vy - ty) / k; k = nk; tx = vx - wx * k; ty = vy - wy * k; clampPan(); apply(); }
      apply();

      on(svg, "wheel", function (e) { e.preventDefault(); var g = toVB(e.clientX, e.clientY); zoomAt(g.x, g.y, k * (e.deltaY < 0 ? 1.16 : 0.862)); }, { passive: false });
      // NB: do NOT capture the pointer on down — that redirects the mouseup + the
      // synthesized click to the svg, so a star's click never fires. capture only
      // once a real DRAG begins; a plain click then stays on the node it hit.
      on(svg, "pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = false; });
      on(svg, "pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (!moved && dx * dx + dy * dy > 20) { moved = true; svg.classList.add("dragging"); try { svg.setPointerCapture(down.id); } catch (_) {} }
        if (moved) { var s2 = toVB(e.clientX, e.clientY).s; tx += dx / s2; ty += dy / s2; down.x = e.clientX; down.y = e.clientY; clampPan(); apply(); }
      });
      function endDrag() { if (down && moved) { try { svg.releasePointerCapture(down.id); } catch (_) {} } down = null; svg.classList.remove("dragging"); }
      on(svg, "pointerup", endDrag); on(svg, "pointercancel", endDrag);

      view.querySelector("#cx-nav").addEventListener("click", function (e) {
        var z = e.target.getAttribute("data-z"); if (!z) return;
        if (z === "reset") { tx = 0; ty = 0; k = 1; apply(); return; }
        zoomAt(VBW / 2, VBH / 2, z === "in" ? k * 1.5 : k / 1.5);
      });

      scene.querySelectorAll(".cxw-node").forEach(function (g) {
        g.addEventListener("click", function () { if (moved) return; openDeity(es[+g.getAttribute("data-i")]); });
      });

      // ---- the wildcard orbits (they keep turning, even behind the open pane) ----
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
        var b = document.getElementById("cx-deity"); if (b) b.remove();
      };

      function radialLabel(deg, r, depth, onSpine) {
        var a = ((deg % 360) + 360) % 360, vert = (a < 16 || a > 344 || (a > 164 && a < 196));
        // far-depth (outermost) gods ON A SPINE tuck their call INWARD — the rim belongs
        // to the spine names, so itEmptieth/itLuteth no longer collide with ether/blood.
        // seam far-gods keep their outward reach (no rim name there to dodge).
        var far = depth === 2 && onSpine;
        var p = degPt(deg, far ? r - 19 : r + 15), rad = (deg - 90) * Math.PI / 180;
        var kk = far ? 0 : ((depth == null ? 1 : depth) - 1) * 15;
        p.x += -Math.sin(rad) * kk; p.y += Math.cos(rad) * kk;
        var anchor = vert ? "middle" : (a < 180 ? "start" : "end");
        if (anchor === "start") p.x += 3; else if (anchor === "end") p.x -= 3;
        return { x: p.x, y: p.y + 3.5, anchor: anchor };
      }
    },

    onHash: function () {
      var h = (location.hash || "").slice(1);
      if (h.indexOf("cx-") === 0) { var id = h.slice(3), e = (CODEX_DATA.entries || []).filter(function (x) { return x.id === id; })[0]; if (e) openDeity(e); }
      else { var b = document.getElementById("cx-deity"); if (b) b.remove(); }
    },
  });

  // the private rooms (manuscript · witness) register from their own tab files, behind crypt.js
})();
