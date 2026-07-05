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
      es.forEach(function (e, i) {
        if (e.state === "revealed") {
          html += '<div class="plate revealed" data-i="' + i + '">'
                + (e.sprite ? '<img class="cx-sprite" src="' + SITE.asset(e.sprite) + '" alt="">' : "")
                + '<div class="cx-face' + (e.sprite ? " over" : "") + '">'
                + '<div class="cx-call">' + esc(e.call || "") + "</div>"
                + (e.gloss ? '<div class="cx-gloss">' + esc(e.gloss.join(" · ")) + "</div>" : "")
                + "</div>"
                + '<span class="st">' + esc(e.seat || "revealed") + "</span></div>";
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
      // a revealed plate opens its entry
      view.querySelectorAll(".plate.revealed").forEach(function (pl) {
        pl.addEventListener("click", function () {
          var e = es[+pl.getAttribute("data-i")];
          var box = document.createElement("div");
          box.id = "cx-box";
          box.innerHTML = '<div class="cx-entry frost">'
            + (e.sprite ? '<img src="' + SITE.asset(e.sprite) + '" alt="">' : "")
            + '<div class="cx-call">' + esc(e.call || "") + "</div>"
            + (e.gloss ? '<div class="cx-gloss">' + esc(e.gloss.join(" · ")) + "</div>" : "")
            + (e.seat ? '<div class="cx-seat">' + esc(e.seat) + "</div>" : "")
            + (e.body ? "<p>" + esc(e.body) + "</p>" : "")
            + '<div class="cx-close">click anywhere to close</div></div>';
          box.addEventListener("click", function () { box.remove(); });
          document.body.appendChild(box);
        });
      });
    },
  });

  // the private rooms (manuscript · heroes) register from their own tab files,
  // behind the encrypted gate in crypt.js
})();
