/* colony — heroes & artifacts (private room: ONE manuscript — the vault's writings,
   then THE W LEDGER as the artifacts record, all on the vellum; face = crimson) */
(function () {
  "use strict";
  var esc = SITE.esc;

  function ledgerHtml() {
    var es = ((typeof WLEDGER_DATA !== "undefined" && WLEDGER_DATA.entries) || []).slice().reverse(); // newest first
    if (!es.length) return "";
    var html = '<h2 id="hv-ledger">the w ledger — the artifacts</h2>';
    html += "<p><em>every artifact render, numbered, newest first — not evolutive: iterations of how we render things for ourselves. the rejects are witnesses.</em></p>";
    if (WLEDGER_DATA.note) html += '<p class="wv-note">' + esc(WLEDGER_DATA.note) + "</p>";
    html += '<div class="wv">';
    es.forEach(function (e) {
      html += '<div class="wv-row' + (e.img ? "" : " lost") + '"' + (e.img ? ' data-img="assets/w/' + esc(e.img) + '.jpg" data-cap="' + esc(e.w + " — " + e.title) + '"' : "") + ">";
      if (e.img) html += '<img src="assets/w/' + esc(e.img) + '.jpg" alt="' + esc(e.w) + '" loading="lazy" decoding="async">';
      else html += '<div class="wv-stub">lost to the wind</div>';
      html += '<div class="wv-txt"><span class="wv-w">' + esc(e.w) + "</span> <b>" + esc(e.title) + "</b>"
            + '<span class="wv-d">' + esc(e.date) + "</span>"
            + "<p>" + esc(e.note) + "</p></div></div>";
    });
    html += "</div>";
    return html;
  }

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">heroes &amp; artifacts</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<div class="vellum">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    // contents — the room in two strokes
    html += '<nav class="ms-toc"><p class="ms-toc-rub">contents</p>'
          + '<a href="#hv-writings">the writings — heroes</a>'
          + '<a href="#hv-ledger">the w ledger — the artifacts</a></nav>';
    html += '<article class="ms-body"><div id="hv-writings"></div>' + r.html + ledgerHtml() + "</article>";
    html += "</div></div>";
    view.innerHTML = html;

    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "heroes", "heroes", function (p) { room(view, p); });
    });
    view.querySelectorAll(".ms-toc a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    view.querySelectorAll(".wv-row[data-img]").forEach(function (row) {
      row.addEventListener("click", function () {
        var box = document.createElement("div");
        box.id = "wl-box";
        box.innerHTML = '<figure><img src="' + row.getAttribute("data-img") + '" alt="">'
                      + "<figcaption>" + esc(row.getAttribute("data-cap")) + " · click anywhere to close</figcaption></figure>";
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
