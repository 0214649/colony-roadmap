/* colony — the w ledger template (renders WLEDGER_DATA; newest first) */
(function () {
  "use strict";
  var esc = SITE.esc;

  SITE.tab({
    id: "wLedger",
    label: "wLedger",
    gapAfter: true,
    render: function (view) {
      var es = (WLEDGER_DATA.entries || []).slice().reverse(); // newest first
      var html = '<div id="wl"><p class="eyebrow">the w ledger</p>'
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
      view.innerHTML = html;

      // lightbox
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
    },
  });
})();
