/* colony — public codex template (renders CODEX_DATA; sealed = asemic) */
(function () {
  "use strict";
  var esc = SITE.esc;

  SITE.tab({
    id: "codex",
    label: "codex",
    gapAfter: true,
    render: function (view) {
      var es = CODEX_DATA.entries || [];
      var rev = es.filter(function (e) { return e.state === "revealed"; }).length;
      var html = '<div id="cx-head"><p class="eyebrow">the codex</p>'
               + '<p class="lede" style="margin:0 auto">comprehension is translation. what the game has revealed is readable here — the rest is still in the old tongue.</p>'
               + '<div style="height:12px"></div>'
               + '<p id="cx-count"><b>' + rev + "</b> of <b>" + es.length + "</b> read</p></div>";
      html += '<div id="cx-grid">';
      es.forEach(function (e) {
        if (e.state === "revealed") {
          html += '<div class="plate revealed" data-id="' + esc(e.id) + '">'
                + (e.sprite ? '<img src="' + SITE.asset(e.sprite) + '" alt="' + esc(e.call || "") + '" style="position:absolute;inset:12% 12% 22%;width:76%;height:auto;margin:auto;object-fit:contain">' : "")
                + '<span class="st">' + esc(e.call || "revealed") + "</span></div>";
        } else {
          html += '<div class="plate" data-id="' + esc(e.id) + '"><canvas></canvas><span class="st">sealed</span></div>';
        }
      });
      html += "</div>";
      view.innerHTML = html;
      // asemic marks — stable per slot (seeded by entry id)
      view.querySelectorAll(".plate canvas").forEach(function (c) {
        SITE.asemic(c, c.parentNode.getAttribute("data-id"), { rows: 3, cols: 4 });
      });
    },
  });

  // the sealed private views (placeholders until the encrypted blobs ship)
  function sealedTab(id, label, gapAfter) {
    SITE.tab({
      id: id, label: label, sealed: true, gapAfter: !!gapAfter,
      render: function (view) {
        view.innerHTML = '<div id="sealed" class="frost"><canvas width="240" height="110"></canvas>'
          + "<h2>" + esc(label) + " — sealed</h2>"
          + "<p>this room exists, but the key has not been spoken here.</p>"
          + "<p>what lies behind ships only as ciphertext — nothing readable ever touches the public repo.</p>"
          + '<p class="old">still in the old tongue.</p></div>';
        SITE.asemic(view.querySelector("canvas"), "sealed-" + id, { rows: 2, cols: 6, w: 240, h: 110 });
      },
    });
  }
  sealedTab("manuscript", "manuscript");
  sealedTab("heroes", "heroes");
})();
