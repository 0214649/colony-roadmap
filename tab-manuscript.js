/* colony — the manuscript (private bible view: the ONE warm vellum room; face = crimson, LOCKED) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function illuminate(t) { // "4. cosmology" — the numeral gets the amber, never mid-word
    var m = String(t).match(/^(\d+\.)\s*(.*)$/);
    return m ? '<span class="ms-num">' + esc(m[1]) + "</span> " + esc(m[2]) : esc(t);
  }

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var body = r.html;
    if (r.toc.length) {
      // contents sit under the document's own title, with a rubric
      var tocHtml = '<nav class="ms-toc"><p class="ms-toc-rub">contents</p>' + r.toc.map(function (t) {
        return '<a href="#' + esc(t.id) + '">' + illuminate(t.t) + "</a>";
      }).join("") + "</nav>";
      body = body.indexOf("</h1>") >= 0 ? body.replace("</h1>", "</h1>\n" + tocHtml) : tocHtml + body;
    }
    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">manuScript</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<p class="lede">the one warm room — the manuscript, carried whole from the vault.</p>';
    html += '<div class="vellum unseal">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + body
          + '<div class="orn">⁘</div><p class="ms-colophon">here ends what the glass has translated — the writing continues.</p>'
          + "</article>";
    html += "</div></div>";
    html += '<button class="tbtn" id="ms-top">contents ⌃</button>';
    view.innerHTML = html;

    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "bible", "manuScript", function (p) { room(view, p); });
    });
    // toc links jump within the page without fighting the router
    view.querySelectorAll(".ms-toc a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    // the way back — a quiet float once the sheet runs deep
    var top = document.getElementById("ms-top"), toc = view.querySelector(".ms-toc");
    if (top && toc) {
      top.addEventListener("click", function () { toc.scrollIntoView({ behavior: "smooth", block: "start" }); });
      var onScroll = function () {
        if (!top.isConnected) { window.removeEventListener("scroll", onScroll); return; }
        top.classList.toggle("show", window.scrollY > 700);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  SITE.tab({
    id: "manuScript",
    label: "manuScript",
    sealed: true,
    render: function (view) {
      SITE_CRYPT.gate(view, "bible", "manuScript", function (p) { room(view, p); });
    },
  });
})();
