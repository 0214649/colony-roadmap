/* colony — the manuscript (private bible view: the ONE warm vellum room) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var body = r.html;
    if (r.toc.length) {
      // contents sit under the document's own title, with a rubric
      var tocHtml = '<nav class="ms-toc"><p class="ms-toc-rub">contents</p>' + r.toc.map(function (t) {
        return '<a href="#' + esc(t.id) + '">' + esc(t.t) + "</a>";
      }).join("") + "</nav>";
      body = body.indexOf("</h1>") >= 0 ? body.replace("</h1>", "</h1>\n" + tocHtml) : tocHtml + body;
    }
    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">manuscript</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<div class="vellum">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + body + "</article>";
    html += "</div></div>";
    view.innerHTML = html;

    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "bible", "manuscript", function (p) { room(view, p); });
    });
    // toc links jump within the page without fighting the router
    view.querySelectorAll(".ms-toc a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  SITE.tab({
    id: "manuscript",
    label: "manuscript",
    sealed: true,
    render: function (view) {
      SITE_CRYPT.gate(view, "bible", "manuscript", function (p) { room(view, p); });
    },
  });
})();
