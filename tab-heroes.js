/* colony — heroes & artifacts (private room; renders the vault's heroes file) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">heroes &amp; artifacts</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<div class="vellum">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + r.html + "</article>";
    html += "</div></div>";
    view.innerHTML = html;
    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "heroes", "heroes", function (p) { room(view, p); });
    });
  }

  SITE.tab({
    id: "heroes",
    label: "heroes",
    sealed: true,
    render: function (view) {
      SITE_CRYPT.gate(view, "heroes", "heroes", function (p) { room(view, p); });
    },
  });
})();
