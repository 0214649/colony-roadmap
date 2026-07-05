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
            if (/SHIPPED|SHIPPED ✓|\bDONE\b|\bBUILT\b/.test(it.name) && v > shippedV) shippedV = v;
            if (/PLANNED/.test(it.name) && (nextPlanned === 0 || v < nextPlanned)) nextPlanned = v;
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
            + '<div class="count" id="count"></div>';

      chambers.forEach(function (c) {
        var openAttr = c.open ? " open" : "";
        var bridgeClass = c.bridge ? " bridge" : "";
        html += '<details class="ch frost' + bridgeClass + '" id="ch-' + slug(c.name) + '"' + openAttr + ">";
        html += '<summary><span class="dot"></span>'
              + '<span class="head"><div class="name">' + esc(c.name) + "</div>"
              + '<div class="desc">' + esc(c.desc) + "</div></span>"
              + '<span class="g" style="color:' + heat(maxChamber ? c._total / maxChamber : 0) + '">'
              + c._total + ' ▽</span><span class="chev">›</span></summary>';
        html += '<div class="bar"><i style="width:' + clamp(c._total) + '%"></i></div>';
        html += '<div class="subs">';
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
          if (/^v\d{3}\b/.test(it.name)) {
            if (/SHIPPED|\bBUILT\b|\bDONE\b/.test(it.name)) pill = '<span class="pill shipped">shipped</span>';
            else if (/PLANNED/.test(it.name)) pill = '<span class="pill planned">planned</span>';
            else if (/parked|banked|deferred/i.test(it.name)) pill = '<span class="pill parked">parked</span>';
          }
          html += '<div class="item"><div class="ibody">'
                + '<div class="sname">' + pill + label + "</div>"
                + (detail ? '<div class="sdetail">' + detail + "</div>" : "")
                + '</div><div class="smeta">'
                + '<span class="sg" style="color:' + col + '">' + s + "</span>"
                + '<span class="sbar"><i style="width:' + w + '%;background:' + col + '"></i></span>'
                + "</div></div>";
        });
        html += "</div></details>";
      });

      html += '<div class="nohit" id="nohit">nothing matches — clear the filter</div>';
      var footTxt = esc(d.foot) + (d.updated ? "  ·  updated " + esc(d.updated) : "");
      html += '<p class="rm-foot">' + footTxt + "</p>";
      html += "</div>";
      view.innerHTML = html;

      // ---- interaction: deep-links, search filter, expand/collapse ----
      var allCh = Array.prototype.slice.call(view.querySelectorAll("details.ch"));
      var items = Array.prototype.slice.call(view.querySelectorAll(".item"));
      var nohit = document.getElementById("nohit");
      var countEl = document.getElementById("count");
      var q = document.getElementById("q");

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
        if (!raw) {
          items.forEach(function (it) { it.classList.remove("hide"); });
          allCh.forEach(function (c) { c.classList.remove("hide"); c.open = false; });
          nohit.style.display = "none"; countEl.textContent = "";
          return;
        }
        var re = new RegExp(raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        var hits = 0;
        allCh.forEach(function (c) {
          var any = 0;
          c.querySelectorAll(".item").forEach(function (it) {
            var match = re.test(it.textContent); re.lastIndex = 0;
            if (match) { it.classList.remove("hide"); markText(it, re); re.lastIndex = 0; any++; hits++; }
            else it.classList.add("hide");
          });
          if (any) { c.classList.remove("hide"); c.open = true; } else c.classList.add("hide");
        });
        nohit.style.display = hits ? "none" : "block";
        countEl.textContent = hits + (hits === 1 ? " line" : " lines") + " matched";
      }
      q.addEventListener("input", filter);

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
