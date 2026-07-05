/* ============================================================
   colony — site shell (router · ground · shared craft)
   ------------------------------------------------------------
   Templates only — all content lives in the data files
   (hub.js · data.js · timeline.js · codex.js · assets.js).
   Tabs register themselves via SITE.tab(); boot runs on load.
   ============================================================ */

var SITE = (function () {
  "use strict";

  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // deterministic prng — asemic marks must be STABLE per slot (bible §4)
  function seeded(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h |= 0;
      return ((h >>> 0) % 100000) / 100000;
    };
  }

  // ---- asemic script (invented marks, canvas-drawn — no font, no tofu) ----
  // one "glyph" = a vertical spine + 2-3 seeded hooks/bars/dots
  function asemic(canvas, seedStr, opts) {
    opts = opts || {};
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth || opts.w || 150, h = canvas.clientHeight || opts.h || 180;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var x = canvas.getContext("2d"); x.scale(dpr, dpr);
    var rnd = seeded(seedStr);
    var rows = opts.rows || 3, cols = opts.cols || 5;
    var gw = w / (cols + 1.6), gh = Math.min(26, h / (rows + 2));
    var ox = (w - gw * cols) / 2, oy = (h - gh * rows * 1.7) / 2 + gh * .4;
    x.strokeStyle = opts.ink || "rgba(232,220,192,.34)";
    x.fillStyle = x.strokeStyle;
    x.lineWidth = 1.1; x.lineCap = "round";
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      if (rnd() < 0.12) continue; // gaps — writing, not wallpaper
      var gx = ox + c * gw + rnd() * 2, gy = oy + r * gh * 1.7;
      var tall = gh * (0.65 + rnd() * 0.35);
      x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + (rnd() - .5) * 3, gy + tall); x.stroke();
      var marks = 2 + Math.floor(rnd() * 2);
      for (var m = 0; m < marks; m++) {
        var my = gy + tall * (0.15 + rnd() * 0.7), kind = rnd();
        if (kind < 0.4) {                                   // bar
          x.beginPath(); x.moveTo(gx, my); x.lineTo(gx + gw * (0.3 + rnd() * 0.4), my + (rnd() - .5) * 4); x.stroke();
        } else if (kind < 0.75) {                           // hook
          x.beginPath(); x.arc(gx + 3, my, 2.6 + rnd() * 2.4, Math.PI * rnd(), Math.PI * (1.1 + rnd())); x.stroke();
        } else {                                            // dot
          x.beginPath(); x.arc(gx + gw * 0.35, my, 1.2, 0, 6.283); x.fill();
        }
      }
    }
  }

  // ---- the glyph melt (name resolves old tongue → legible) ----
  // pool constrained to Inter-covered glyphs — runic tofu-boxes on fontless systems
  var MELT_POOL = "ΘΔΨΦΞΠΣΩþðæ";
  function glyphMelt(el, from, to, done) {
    if (reduced) { el.textContent = to; if (done) done(); return; }
    var slots = Math.max(from.length, to.length);
    el.textContent = "";
    var spans = [];
    for (var i = 0; i < slots; i++) {
      var sp = document.createElement("span");
      sp.textContent = from[i] || " ";
      el.appendChild(sp); spans.push(sp);
    }
    var rnd = seeded(from + to);
    setTimeout(function () {
      if (!el.isConnected) return; // tab was left mid-hold — die quietly
      spans.forEach(function (sp, i) {
        setTimeout(function () {
          var flips = 2 + Math.floor(rnd() * 2), f = 0;
          var t = setInterval(function () {
            if (!sp.isConnected) { clearInterval(t); return; } // stale instance
            if (f++ < flips) { sp.textContent = MELT_POOL[Math.floor(rnd() * MELT_POOL.length)]; return; }
            clearInterval(t);
            sp.textContent = to[i] || ""; if (!to[i]) sp.remove();
            if (i === slots - 1 && done) done();
          }, 70);
        }, i * 85);
      });
    }, 1100); // hold the old tongue first — the melt is the translation
  }

  // ---- typewriter (floating etched lines, no box) ----
  function typeLines(mount, lines, done) {
    mount.textContent = "";
    var ps = lines.map(function () { var p = document.createElement("p"); mount.appendChild(p); return p; });
    if (reduced) { ps.forEach(function (p, i) { p.textContent = lines[i]; }); if (done) done(); return; }
    var li = 0;
    (function nextLine() {
      if (li >= lines.length) { if (done) done(); return; }
      var p = ps[li], text = lines[li], ci = 0;
      var cur = document.createElement("i"); cur.className = "cursor"; p.appendChild(cur);
      var t = setInterval(function () {
        if (!p.isConnected) { clearInterval(t); return; } // tab was left — die quietly
        if (ci < text.length) { p.insertBefore(document.createTextNode(text[ci++]), cur); return; }
        clearInterval(t); cur.remove(); li++;
        setTimeout(nextLine, 420);
      }, 17);
    })();
  }

  // ---- the cold ground (ember pools = life · amber motes · teal glints) ----
  function ground() {
    var c = document.getElementById("ground"), x = c.getContext("2d"), W, H;
    function size() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    size();
    window.addEventListener("resize", function () { size(); if (reduced) paint(0); }); // resize clears the bitmap — repaint the still frame
    var pools = [
      { x: .22, y: .30, r: .38, ph: 0.0 },
      { x: .80, y: .18, r: .30, ph: 2.1 },
      { x: .62, y: .82, r: .42, ph: 4.2 },
    ];
    var motes = [], glints = [];
    for (var i = 0; i < 30; i++) motes.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.4, s: 6 + Math.random() * 13, a: .05 + Math.random() * .11, ph: Math.random() * 6.28 });
    for (var g = 0; g < 14; g++) glints.push({ x: Math.random(), y: Math.random(), a: .04 + Math.random() * .08, ph: Math.random() * 6.28 });
    function paint(t) {
      x.clearRect(0, 0, W, H);
      var grad = x.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#11151c"); grad.addColorStop(.55, "#0c0f14"); grad.addColorStop(1, "#080a0e");
      x.fillStyle = grad; x.fillRect(0, 0, W, H);
      for (var p = 0; p < pools.length; p++) {                     // warm life pooling under the glass
        var pl = pools[p], breath = .75 + .25 * Math.sin(t * .00022 + pl.ph);
        var rg = x.createRadialGradient(pl.x * W, pl.y * H, 0, pl.x * W, pl.y * H, pl.r * Math.min(W, H));
        rg.addColorStop(0, "rgba(200,120,40," + (.075 * breath) + ")");
        rg.addColorStop(.5, "rgba(160,90,35," + (.035 * breath) + ")");
        rg.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = rg; x.beginPath(); x.arc(pl.x * W, pl.y * H, pl.r * Math.min(W, H), 0, 6.283); x.fill();
      }
      for (var gl = 0; gl < glints.length; gl++) {                 // cold spore glints, sparse
        var q = glints[gl], tw = .5 + .5 * Math.sin(t * .0006 + q.ph);
        x.beginPath(); x.arc(q.x * W, q.y * H, 1, 0, 6.283);
        x.fillStyle = "rgba(127,179,196," + (q.a * tw) + ")"; x.fill();
      }
      for (var m = 0; m < motes.length; m++) {                     // amber grit drifting up
        var mo = motes[m];
        mo.y -= mo.s / (H * 60); if (mo.y < -.03) { mo.y = 1.03; mo.x = Math.random(); }
        x.beginPath(); x.arc(mo.x * W + Math.sin(t * .0004 + mo.ph) * 9, mo.y * H, mo.r, 0, 6.283);
        x.fillStyle = "rgba(224,162,58," + mo.a + ")"; x.fill();
      }
    }
    if (reduced) { paint(0); return; }                             // one still frame
    (function tick(t) {                                            // idle-cheap: never paint unseen
      if (!document.hidden) paint(t || 0);
      requestAnimationFrame(tick);
    })(0);
  }

  // ---- THE ANTS — the locked modeled ant, living in PAGE space, above everything ----
  // fixed in the document (they scroll with the content), drawn on the top layer
  function antLayer() {
    var meta = (typeof COLONY_ASSETS !== "undefined" && COLONY_ASSETS.antSheet) || null;
    if (!meta || reduced) return;
    var c = document.getElementById("antlayer"), x = c.getContext("2d"), W, H;
    function size() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    size(); window.addEventListener("resize", size);
    var img = new Image(); img.src = meta.src;
    var docH = 1200, docTick = 0;
    var ants = [];
    for (var i = 0; i < 4; i++) ants.push({
      x: Math.random() * 1200, y: 120 + Math.random() * 900,
      tx: 0, ty: 0, pause: Math.random() * 4, trav: Math.random() * 40, ang: Math.random() * 6.28, has: false,
    });
    var lastT = 0;
    (function tick(t) {
      t = t || 0;
      var dt = Math.min(.06, (t - lastT) / 1000); lastT = t;
      if (!document.hidden) {
        if (--docTick <= 0) { docH = Math.max(600, document.documentElement.scrollHeight); docTick = 90; }
        x.clearRect(0, 0, W, H);
        if (img.complete && img.naturalWidth) {
          var S = 1.5, sy = window.scrollY || 0;
          x.imageSmoothingEnabled = false;
          for (var i = 0; i < ants.length; i++) {
            var a = ants[i];
            if (a.x > W) a.x = Math.random() * W;                 // window shrank
            if (a.y > docH) a.y = Math.random() * docH;
            if (!a.has) { a.tx = 20 + Math.random() * (W - 40); a.ty = 60 + Math.random() * (docH - 120); a.has = true; }
            var dx = a.tx - a.x, dy = a.ty - a.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (a.pause > 0) a.pause -= dt;
            else if (dist < 6) { a.pause = 2 + Math.random() * 6; a.has = false; }
            else {
              var sp = 20; // px/s — ambient, unhurried
              a.x += (dx / dist) * sp * dt; a.y += (dy / dist) * sp * dt;
              a.trav += sp * dt; a.ang = Math.atan2(dy, dx);
            }
            var vy = a.y - sy;                                     // page space → screen
            if (vy < -40 || vy > H + 40) continue;
            var dir = Math.round((((a.ang * 180 / Math.PI) + 90 + 360) % 360) / 45) % 8; // 0=up, cw
            var fr = Math.floor(a.trav / 6) % meta.frames;
            x.globalAlpha = .95;
            x.drawImage(img, dir * meta.cw, fr * meta.ch, meta.cw, meta.ch,
                        Math.round(a.x - meta.cw * S / 2), Math.round(vy - meta.ch * S / 2), meta.cw * S, meta.ch * S);
            x.globalAlpha = 1;
          }
          x.imageSmoothingEnabled = true;
        }
      }
      requestAnimationFrame(tick);
    })(0);
  }

  // ---- tabs & router ----
  var TABS = [], byId = {};
  function tab(def) { TABS.push(def); byId[def.id] = def; }

  var LOCK_SVG = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="4.5" width="7" height="4.5" rx="1"/><path d="M3 4.5V3a2 2 0 0 1 4 0v1.5"/></svg>';

  function nav(active) {
    var n = document.getElementById("tabs");
    var html = "";
    TABS.forEach(function (t) {
      if (t.hidden) return;
      html += '<a href="#' + t.id + '" class="' + (t.id === active ? "on" : "") + (t.sealed ? " sealed" : "") + '">'
            + (t.sealed ? LOCK_SVG : "") + esc(t.label) + "</a>";
      if (t.gapAfter) html += '<span class="sep"></span>';
    });
    n.innerHTML = html;
  }

  // legacy hash aliases (renames + the ledger's move into the witness room)
  var ALIAS = { timeline: "timeLine", manuscript: "manuScript", heroes: "witness", hord: "witness", wLedger: "witness", wledger: "witness" };

  var current = null;
  function route() {
    var h = (location.hash || "#hub").slice(1);
    var id = h.indexOf("ch-") === 0 ? "roadMap" : h;          // legacy chamber deep-links
    if (h.indexOf("cx-") === 0) id = "codex";                 // codex star deep-links
    if (ALIAS[id]) id = ALIAS[id];
    if (!byId[id]) id = "hub";
    var t = byId[id];
    if (current === id) { if (t.onHash) t.onHash(); return; } // in-tab hash moves (roadMap chambers)
    current = id;
    SITE.seq = (SITE.seq || 0) + 1; // render token — async work checks it before touching #view
    var view = document.getElementById("view");
    view.innerHTML = "";
    if (SITE._teardown) { SITE._teardown(); SITE._teardown = null; }
    nav(id);
    document.title = "▽" + t.label;   // {logo}{section}, no space — style first
    window.scrollTo(0, 0);
    t.render(view);
    if (t.onHash) t.onHash();
  }

  function boot() {
    ground();
    antLayer();
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // the wordmark speaks data.js (never hardcode the name)
    if (typeof COLONY_DATA !== "undefined" && COLONY_DATA.title)
      document.querySelector("#chrome .mark b").textContent = COLONY_DATA.title;
    window.addEventListener("hashchange", route);
    route();
    // the footer date = the newest thing the site knows about
    var upd = (typeof COLONY_DATA !== "undefined" && COLONY_DATA.updated) ? COLONY_DATA.updated : "";
    if (typeof TIMELINE_DATA !== "undefined") (TIMELINE_DATA.events || []).forEach(function (e) {
      if (e.date && e.date > upd) upd = e.date;
    });
    document.getElementById("foot").innerHTML =
      "the glass shows what has been translated" + (upd ? " · updated <b>" + esc(upd) + "</b>" : "");
  }
  document.addEventListener("DOMContentLoaded", boot);

  return {
    esc: esc, seeded: seeded, asemic: asemic, glyphMelt: glyphMelt,
    typeLines: typeLines, tab: tab, reduced: reduced,
    asset: function (k) { return (typeof COLONY_ASSETS !== "undefined" && COLONY_ASSETS[k]) || ""; },
    _teardown: null,
  };
})();
