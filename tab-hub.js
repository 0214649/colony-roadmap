/* colony — hub template (renders HUB_DATA; itRedeth delivers the pitch) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function stats(tabId) {
    // ▽ stays singular (unit law) — chambers/events/entries are things, not units
    if (tabId === "roadMap" && typeof COLONY_DATA !== "undefined") {
      var total = 0, n = (COLONY_DATA.chambers || []).length;
      (COLONY_DATA.chambers || []).forEach(function (c) {
        (c.items || []).forEach(function (it) { total += it.shards || 0; });
      });
      return "<b>" + total + " ▽</b> carried · <b>" + n + "</b> chambers";
    }
    if (tabId === "timeLine" && typeof TIMELINE_DATA !== "undefined")
      return "<b>" + (TIMELINE_DATA.events || []).length + "</b> events";
    if (tabId === "codex" && typeof CODEX_DATA !== "undefined") {
      var es = CODEX_DATA.entries || [], rev = es.filter(function (e) { return e.state === "revealed"; }).length;
      return "<b>" + es.length + "</b> entries · <b>" + rev + "</b> revealed";
    }
    return "";
  }

  SITE.tab({
    id: "hub",
    label: "hub",
    gapAfter: false,
    render: function (view) {
      var d = HUB_DATA || {};
      var html = '<h1 class="sr-only">colony — an idle game where an ant colony lives on your real file system</h1>';
      var flank = d.flankers || [];
      function sideGod(g) {
        // call left EMPTY (target in data-call) — it starts ciphered, itRedeth decrypts it after herself
        return '<div class="hub-god side g-' + esc(g.asset) + '"><img src="' + SITE.asset(g.asset) + '" alt="' + esc(g.call) + '" decoding="async">'
             + '<b class="hub-god-call etch-amber" data-call="' + esc(g.call) + '"></b>'
             + '<i class="hub-god-gloss">' + esc(g.gloss) + "</i></div>";
      }
      html += '<div id="hub-stage">';
      html += '<div id="hub-trio">';
      if (flank[0]) html += sideGod(flank[0]);
      html += '<div id="hub-aura" class="hub-god main g-itredeth"><img src="' + SITE.asset("itredeth") + '" alt="itRedeth — the glass, the first goddess" decoding="async"></div>';
      if (flank[1]) html += sideGod(flank[1]);
      html += "</div>";                              // #hub-trio
      html += '<div id="hub-name" class="etch-amber"></div>';
      html += '<p id="hub-gloss">' + esc(d.gloss || "") + '</p>';
      html += '<div id="hub-greet" class="etch"></div>';
      html += "</div>";

      html += '<div id="hub-blocks">';
      (d.blocks || []).forEach(function (b) {
        html += '<section class="block frost"><p class="k">' + esc(b.k) + '</p><h3>' + esc(b.t) + "</h3><p>" + b.p + "</p></section>";
      });
      html += "</div>";

      html += '<div id="hub-explore">';
      (d.explore || []).forEach(function (e) {
        html += '<a class="explore frost" href="#' + esc(e.tab) + '"><p class="k">' + esc(e.tab) + '</p><p>' + esc(e.p) + '</p>'
              + '<p class="n">' + stats(e.tab) + "</p></a>";
      });
      html += "</div>";

      view.innerHTML = html;
      // all three names start in the old cipher; itRedeth resolves first, then she
      // turns and decrypts the other two, one after the other (she is the translator).
      var CIPHER = "ΘΔΨΦΞΠΣΩþðæ";
      function cryptStr(seed, len) { var r = SITE.seeded("crypt-" + seed), s = ""; for (var i = 0; i < len; i++) s += CIPHER[Math.floor(r() * CIPHER.length)]; return s; }
      var flankEls = Array.prototype.slice.call(view.querySelectorAll(".hub-god-call"));
      flankEls.forEach(function (el) {
        var call = el.getAttribute("data-call") || "";
        el.textContent = SITE.reduced ? call : cryptStr(call, call.length);
      });
      SITE.glyphMelt(document.getElementById("hub-name"), String(d.call || ""), String(d.name || ""), function () {
        flankEls.forEach(function (el, j) {                 // the cascade — she decrypts them in turn
          var call = el.getAttribute("data-call") || "";
          setTimeout(function () { if (el.isConnected) SITE.glyphMelt(el, cryptStr(call, call.length), call); }, 200 + j * 460);
        });
        var greet = document.getElementById("hub-greet");   // gone if the tab was left
        if (greet) SITE.typeLines(greet, d.greeting || []);
      });
    },
  });
})();
