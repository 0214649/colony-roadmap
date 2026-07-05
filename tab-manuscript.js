/* colony — the manuscript (private bible view: the ONE warm vellum room) */
(function () {
  "use strict";
  var esc = SITE.esc;

  // FONT DUEL (temporary — losers strip once dirty rat crowns one)
  var FONTS = [
    { k: "garamond",  n: "garamond" },
    { k: "cormorant", n: "cormorant" },
    { k: "lora",      n: "lora" },
    { k: "crimson",   n: "crimson" },
    { k: "source",    n: "sourceSerif" },
    { k: "spectral",  n: "spectral" },
    { k: "inter",     n: "inter" },
  ];
  window.msFont = function () { try { return localStorage.getItem("ms-font") || "garamond"; } catch (e) { return "garamond"; } };

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
    html += '<div class="ms-bar"><p class="eyebrow">manuScript</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<div class="ms-duel"><span>font duel ·</span>' + FONTS.map(function (f) {
      return '<button class="chip' + (window.msFont() === f.k ? " on" : "") + '" data-f="' + f.k + '">' + esc(f.n) + "</button>";
    }).join("") + "</div>";
    html += '<div class="vellum f-' + esc(window.msFont()) + '">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + body + "</article>";
    html += "</div></div>";
    view.innerHTML = html;

    var vel = view.querySelector(".vellum");
    view.querySelectorAll(".ms-duel .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        view.querySelectorAll(".ms-duel .chip").forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        var f = btn.getAttribute("data-f");
        vel.className = "vellum f-" + f;
        try { localStorage.setItem("ms-font", f); } catch (e) {}
      });
    });

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
