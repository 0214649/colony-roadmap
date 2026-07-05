/* colony — roadMap template (ported shell-side, logic intact)
   Renders COLONY_DATA. All totals + bar widths are computed here, so
   data.js only ever holds raw shard numbers (+ optional legend/updated). */
(function () {
  "use strict";
  var esc = SITE.esc;
  var clamp = function (n) { return Math.max(0, Math.min(100, n)); };
  var clamp01 = function (x) { return Math.max(0, Math.min(1, x)); };
  var lerp = function (a, b, t) { return Math.round(a + (b - a) * t); };
  var slug = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
  // depth heat ramp: faint cold-brown (shallow) -> amber -> bright gold (deep)
  var heat = function (t) {
    var c0 = [111, 103, 84], c1 = [224, 168, 90], c2 = [255, 216, 138], a, b, u;
    if (t < 0.5) { a = c0; b = c1; u = t / 0.5; } else { a = c1; b = c2; u = (t - 0.5) / 0.5; }
    return "rgb(" + lerp(a[0], b[0], u) + "," + lerp(a[1], b[1], u) + "," + lerp(a[2], b[2], u) + ")";
  };

  function openHash() {
    if (location.hash.indexOf("#ch-") !== 0) return;
    var el = document.querySelector(location.hash.replace(/[^#\w-]/g, ""));
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      if (el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  var keysBound = false;

  // presentation bands (template concern — an unmapped chamber lands in "the dig")
  var BANDS = [
    { label: "the game",  slugs: ["concept-loop", "desktop-explorer", "onboarding-first-run"] },
    { label: "the world", slugs: ["cosmology", "resources-units", "themes-morality", "routes-endings", "characters"] },
    { label: "the work",  slugs: ["build-tech", "aesthetics", "workflow-tooling"] },
  ];
  var CLAMP_AT = 240; // details longer than this fold to two lines

  // quick-filter kinds, derived from the item text itself (case-law: markers are
  // lowercase now, so status anchors to the version's own parenthesis)
  var ST_SHIP = /^[vy]\d{3}[^(]*\(\s*(shipped|built|done)\b/i;
  var ST_PLAN = /^[vy]\d{3}[^(]*\(\s*planned\b/i;
  function kindsOf(name) {
    var k = [];
    if (ST_SHIP.test(name)) k.push("ship");
    else if (ST_PLAN.test(name)) k.push("plan");
    if (/[(—]\s*lock(ed)?\b/i.test(name)) k.push("lock"); // a lock MARKER — "(locked)" or "— locked:" — not prose "a locked folder"
    if (/\b(banked|parked|deferred)\b/i.test(name)) k.push("bank");
    return k.join(" ");
  }

  SITE.tab({
    id: "roadMap",
    label: "roadMap",
    render: function (view) {
      var d = COLONY_DATA;
      var chambers = d.chambers || [];
      var total = 0, maxItem = 0, maxChamber = 0;
      var shippedV = 0, nextPlanned = 0; // derived build cursor
      chambers.forEach(function (c) {
        c._total = (c.items || []).reduce(function (a, it) { return a + (it.shards || 0); }, 0);
        total += c._total;
        if (c._total > maxChamber) maxChamber = c._total;
        (c.items || []).forEach(function (it) {
          if ((it.shards || 0) > maxItem) maxItem = it.shards || 0;
          var vm = String(it.name).match(/^v(\d{3})\b/);
          if (vm) {
            var v = parseInt(vm[1], 10);
            if (ST_SHIP.test(it.name) && v > shippedV) shippedV = v;
            if (ST_PLAN.test(it.name) && (nextPlanned === 0 || v < nextPlanned)) nextPlanned = v;
          }
        });
      });
      var itemScale = Math.max(12, maxItem); // deepest item = hot end of the ramp
      var vlabel = function (n) { return "v" + ("00" + n).slice(-3); };
      // a version both BUILT-in-slices and PLANNED is still being dug — the cursor
      // must not read "runs through vN → now digging vN"
      if (nextPlanned && shippedV >= nextPlanned) shippedV = nextPlanned - 1;

      var html = '<div id="rm">';
      html += '<p class="eyebrow">' + esc(d.eyebrow) + "</p>";
      if (d.sub) html += '<p class="lede" style="font-style:normal;font-size:12px;letter-spacing:.15em">' + esc(d.sub) + "</p>";
      html += '<p class="lede">' + (d.lede || "") + "</p>"; // lede allows inline HTML on purpose
      html += '<p class="tally"><b>' + total + " ▽</b> carried so far · across "
            + chambers.length + " chambers" + (d.note ? " · " + esc(d.note) : "") + "</p>";

      if (shippedV || nextPlanned) {
        html += '<p class="status">';
        if (shippedV) html += '<span class="ship">▣ build runs through ' + esc(vlabel(shippedV)) + "</span>";
        if (shippedV && nextPlanned) html += '<span class="arrow">→</span>';
        if (nextPlanned) html += '<span class="dig">now digging ' + esc(vlabel(nextPlanned)) + "</span>";
        html += "</p>";
      }

      // glyph legend (optional data) — collapsible key so the unit symbols read
      if (d.legend && d.legend.length) {
        html += '<details class="legend frost"><summary>units · the shorthand below'
              + '<span class="chev">›</span></summary><div class="legkey">';
        d.legend.forEach(function (u) {
          var nd = esc(u.note || "");
          if (u.bands) {
            nd += '<span class="legbands">';
            u.bands.forEach(function (b) {
              nd += '<span class="legband"><span class="lbn">' + esc(b[0]) + '</span>'
                  + '<span class="lbt">' + esc(b[1]) + '</span><span class="lbt">' + esc(b[2]) + '</span></span>';
            });
            nd += '</span>';
          }
          html += '<div class="legrow"><span class="lg">' + esc(u.g) + '</span>'
                + '<span class="ln">' + esc(u.name) + '</span>'
                + '<span class="ld">' + nd + "</span></div>";
        });
        html += "</div></details>";
      }

      // toolbar
      html += '<div class="bar2">'
            + '<input class="search" id="q" type="search" placeholder="filter the roadMap… (try \'maw\', \'tears\', \'v010\')" autocomplete="off">'
            + '<button class="tbtn" id="expand">expand</button>'
            + '<button class="tbtn" id="collapse">collapse</button>'
            + '</div>'
            + '<div class="rm-chips"><button class="chip on" data-k="">all</button>'
            + '<button class="chip" data-k="ship">shipped</button>'
            + '<button class="chip" data-k="plan">planned</button>'
            + '<button class="chip" data-k="lock">locked</button>'
            + '<button class="chip" data-k="bank">banked</button></div>'
            + '<div class="count" id="count"></div>';

      // group chambers under the presentation bands (data order kept within a band)
      var banded = BANDS.map(function (b) { return { label: b.label, list: [] }; });
      var leftover = { label: "the dig", list: [] };
      chambers.forEach(function (c) {
        var s = slug(c.name), hit = null;
        BANDS.forEach(function (b, i) { if (b.slugs.indexOf(s) >= 0) hit = i; });
        (hit === null ? leftover : banded[hit]).list.push(c);
      });
      if (leftover.list.length) banded.push(leftover);

      function chamberHtml(c) {
        var h = "";
        var openAttr = c.open ? " open" : "";
        var bridgeClass = c.bridge ? " bridge" : "";
        h += '<details class="ch frost' + bridgeClass + '" id="ch-' + slug(c.name) + '"' + openAttr + ">";
        h += '<summary><span class="dot"></span>'
           + '<span class="head"><div class="name">' + esc(c.name) + "</div>"
           + '<div class="desc">' + esc(c.desc) + "</div></span>"
           + '<span class="g" style="color:' + heat(maxChamber ? c._total / maxChamber : 0) + '">'
           + c._total + ' ▽</span><span class="chev">›</span></summary>';
        h += '<div class="bar"><i style="width:' + clamp(c._total) + '%"></i></div>';
        h += '<div class="subs">';
        (c.items || []).forEach(function (it) {
          // Split "Label — detail" into a bold label + a muted detail line (first dash only).
          var m = String(it.name).match(/^([\s\S]*?)\s+[—–]\s+([\s\S]*)$/);
          var label = esc(m ? m[1] : it.name);
          var detail = m ? esc(m[2]) : "";
          var s = it.shards || 0;
          var t = clamp01(s / itemScale);   // depth, 0..1
          var col = heat(t);
          var w = Math.max(6, Math.round(t * 100)); // min nub so shallow items still read
          var pill = "";
          if (/^[vy]\d{3}\b/.test(it.name)) {
            if (ST_SHIP.test(it.name)) pill = '<span class="pill shipped">shipped</span>';
            else if (ST_PLAN.test(it.name)) pill = '<span class="pill planned">planned</span>';
            else if (/^[vy]\d{3}[^(]*\(\s*(parked|banked|deferred)/i.test(it.name)) pill = '<span class="pill parked">parked</span>';
          }
          var long = (m ? m[2] : "").length > CLAMP_AT;
          h += '<div class="item" data-k="' + kindsOf(String(it.name)) + '"><div class="ibody">'
             + '<div class="sname">' + pill + label + "</div>"
             + (detail ? '<div class="sdetail' + (long ? " clamp" : "") + '">' + detail + "</div>" : "")
             + (long ? '<button class="morebtn" type="button">more ⌄</button>' : "")
             + '</div><div class="smeta">'
             + '<span class="sg" style="color:' + col + '">' + s + "</span>"
             + '<span class="sbar"><i style="width:' + w + '%;background:' + col + '"></i></span>'
             + "</div></div>";
        });
        h += "</div></details>";
        return h;
      }

      banded.forEach(function (b, bi) {
        html += '<div class="bandhead" data-band="' + bi + '">' + esc(b.label) + "</div>";
        b.list.forEach(function (c) { html += chamberHtml(c); });
      });

      html += '<div class="nohit" id="nohit">nothing matches — clear the filter</div>';
      var footTxt = esc(d.foot) + (d.updated ? " · updated " + esc(d.updated) : "");
      html += '<p class="rm-foot">' + footTxt + "</p>";
      html += "</div>";
      view.innerHTML = html;

      // ---- interaction: deep-links, search filter, expand/collapse ----
      var allCh = Array.prototype.slice.call(view.querySelectorAll("details.ch"));
      var items = Array.prototype.slice.call(view.querySelectorAll(".item"));
      var nohit = document.getElementById("nohit");
      var countEl = document.getElementById("count");
      var q = document.getElementById("q");
      var kFilter = ""; // active quick-filter kind ("" = all)

      // long details fold to two lines; the button unfolds them
      view.querySelectorAll(".morebtn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var det = btn.previousElementSibling;
          var folded = det.classList.toggle("clamp");
          btn.textContent = folded ? "more ⌄" : "less ⌃";
        });
      });

      // band headers hide when everything under them is hidden
      var bandHeads = Array.prototype.slice.call(view.querySelectorAll(".bandhead"));
      function syncBands() {
        bandHeads.forEach(function (bh) {
          var el = bh.nextElementSibling, any = false;
          while (el && !el.classList.contains("bandhead")) {
            if (el.classList.contains("ch") && !el.classList.contains("hide")) any = true;
            el = el.nextElementSibling;
          }
          bh.style.display = any ? "" : "none";
        });
      }

      var ready = false; // suppress URL rewrites from the initial programmatic open
      var bulk = false;  // …and from the expand/collapse buttons (toggle fires for those too)
      allCh.forEach(function (c) {
        c.addEventListener("toggle", function () {
          if (ready && !bulk && c.open && !q.value) {
            try { history.replaceState(null, "", "#" + c.id); } catch (e) {}
          }
        });
      });

      function bulkOp(fn) {
        bulk = true; fn();
        setTimeout(function () { bulk = false; }, 60); // outlive the queued toggle tasks
      }
      document.getElementById("expand").onclick = function () { bulkOp(function () { allCh.forEach(function (c) { if (!c.classList.contains("hide")) c.open = true; }); }); };
      document.getElementById("collapse").onclick = function () {
        bulkOp(function () { allCh.forEach(function (c) { c.open = false; }); });
        if (location.hash.indexOf("#ch-") === 0) { try { history.replaceState(null, "", "#roadMap"); } catch (e) {} }
      };

      // live text filter — highlight hits, hide misses, auto-open chambers with a match
      function unmark(el) {
        el.querySelectorAll("mark").forEach(function (mk) { var p = mk.parentNode; p.replaceChild(document.createTextNode(mk.textContent), mk); p.normalize(); });
      }
      function markText(el, re) {
        // DOM-safe highlighting on the RAW text (never innerHTML over escaped text —
        // a hit inside '&amp;' used to corrupt items containing '&')
        el.querySelectorAll(".sname, .sdetail").forEach(function (node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (n) {
            if (n.nodeType !== 3) return;
            var txt = n.nodeValue;
            re.lastIndex = 0;
            if (!re.test(txt)) return;
            re.lastIndex = 0;
            var frag = document.createDocumentFragment(), last = 0, m;
            while ((m = re.exec(txt)) !== null) {
              if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
              var mk = document.createElement("mark"); mk.textContent = m[0]; frag.appendChild(mk);
              last = m.index + m[0].length;
              if (m[0].length === 0) re.lastIndex++; // safety on zero-width matches
            }
            if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
            node.parentNode.replaceChild(frag, node);
          });
        });
      }
      function filter() {
        var raw = q.value.trim();
        items.forEach(unmark);
        var idle = !raw && !kFilter;
        if (idle) {
          items.forEach(function (it) {
            it.classList.remove("hide");
            var det = it.querySelector(".sdetail"), btn = it.querySelector(".morebtn");
            if (btn && det) { det.classList.add("clamp"); btn.textContent = "more ⌄"; } // re-fold
          });
          allCh.forEach(function (c) { c.classList.remove("hide"); c.open = false; });
          nohit.style.display = "none"; countEl.textContent = "";
          syncBands();
          return;
        }
        var re = raw ? new RegExp(raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi") : null;
        var hits = 0;
        allCh.forEach(function (c) {
          var any = 0;
          c.querySelectorAll(".item").forEach(function (it) {
            var ok = true;
            if (kFilter) ok = (" " + (it.getAttribute("data-k") || "") + " ").indexOf(" " + kFilter + " ") >= 0;
            if (ok && re) { ok = re.test(it.textContent); re.lastIndex = 0; }
            if (ok) {
              it.classList.remove("hide");
              if (re) {
                markText(it, re); re.lastIndex = 0;
                // a hit may sit in the folded part — unfold so the mark is visible
                var det = it.querySelector(".sdetail"), btn = it.querySelector(".morebtn");
                if (btn && det) { det.classList.remove("clamp"); btn.textContent = "less ⌃"; }
              }
              any++; hits++;
            } else it.classList.add("hide");
          });
          if (any) { c.classList.remove("hide"); c.open = true; } else c.classList.add("hide");
        });
        nohit.style.display = hits ? "none" : "block";
        countEl.textContent = hits + (hits === 1 ? " line" : " lines") + " matched";
        syncBands();
      }
      q.addEventListener("input", filter);

      view.querySelectorAll(".rm-chips .chip").forEach(function (btn) {
        btn.addEventListener("click", function () {
          view.querySelectorAll(".rm-chips .chip").forEach(function (b) { b.classList.remove("on"); });
          btn.classList.add("on");
          kFilter = btn.getAttribute("data-k") || "";
          filter();
        });
      });

      // "/" jumps to the filter · Escape clears — bound once, inert off this tab
      if (!keysBound) {
        keysBound = true;
        document.addEventListener("keydown", function (e) {
          var qq = document.getElementById("q");
          if (!qq) return;
          if (e.key === "/" && document.activeElement !== qq) { e.preventDefault(); qq.focus(); }
          if (e.key === "Escape" && document.activeElement === qq) { qq.value = ""; qq.dispatchEvent(new Event("input")); qq.blur(); }
        });
      }

      openHash();          // honor a #ch- deep link on entry
      // go live only after the render's queued toggle tasks have run
      // (toggle events dispatch async — a sync ready=true never suppressed them)
      requestAnimationFrame(function () { setTimeout(function () { ready = true; }, 0); });
    },
    onHash: openHash,
  });
})();
