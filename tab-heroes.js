/* colony — heroes & artifacts (private room: the vault's heroes file + THE W LEDGER
   — the w renders ARE the project's artifacts, so they live here) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function wLedgerHtml() {
    var es = ((typeof WLEDGER_DATA !== "undefined" && WLEDGER_DATA.entries) || []).slice().reverse(); // newest first
    if (!es.length) return "";
    var html = '<div id="wl" style="margin-top:44px"><p class="eyebrow">the w ledger — the artifacts</p>'
             + '<p class="lede">every artifact render, numbered — not evolutive: iterations of how we render things for ourselves. the rejects are witnesses.</p>';
    if (WLEDGER_DATA.note) html += '<p class="wl-note">' + esc(WLEDGER_DATA.note) + "</p>";
    html += '<div id="wl-grid">';
    es.forEach(function (e) {
      html += '<figure class="wl-card frost' + (e.img ? "" : " noimg") + '"' + (e.img ? ' data-img="assets/w/' + esc(e.img) + '.jpg" data-cap="' + esc(e.w + " — " + e.title) + '"' : "") + ">";
      if (e.img) html += '<img src="assets/w/' + esc(e.img) + '.jpg" alt="' + esc(e.w + " — " + e.title) + '" loading="lazy" decoding="async">';
      else html += '<div class="wl-lost">render lost to the wind</div>';
      html += '<figcaption><span class="wl-w">' + esc(e.w) + '</span> <b>' + esc(e.title) + "</b>"
            + '<span class="wl-d">' + esc(e.date) + "</span>"
            + "<p>" + esc(e.note) + "</p></figcaption></figure>";
    });
    html += "</div></div>";
    return html;
  }

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">heroes &amp; artifacts</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<div class="vellum f-' + esc(window.msFont ? window.msFont() : "garamond") + '">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + r.html + "</article>";
    html += "</div>";
    html += wLedgerHtml();
    html += "</div>";
    view.innerHTML = html;

    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "heroes", "heroes", function (p) { room(view, p); });
    });
    view.querySelectorAll(".wl-card[data-img]").forEach(function (card) {
      card.addEventListener("click", function () {
        var box = document.createElement("div");
        box.id = "wl-box";
        box.innerHTML = '<figure><img src="' + card.getAttribute("data-img") + '" alt="">'
                      + "<figcaption>" + esc(card.getAttribute("data-cap")) + " · click anywhere to close</figcaption></figure>";
        box.addEventListener("click", function () { box.remove(); });
        document.body.appendChild(box);
      });
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
