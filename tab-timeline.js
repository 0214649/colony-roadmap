/* colony — timeline template (renders TIMELINE_DATA as dated events) */
(function () {
  "use strict";
  var esc = SITE.esc;

  SITE.tab({
    id: "timeline",
    label: "timeline",
    render: function (view) {
      var evs = (TIMELINE_DATA.events || []).slice().sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
      var html = '<div id="tl"><p class="eyebrow">timeline</p>'
               + '<p class="lede">how the colony grew — the dig, dated.</p><div style="height:26px"></div>';
      evs.forEach(function (e) {
        html += '<div class="tl-ev"><p class="d">' + esc(e.date) + "</p><h3>" + esc(e.title) + "</h3>"
              + "<p>" + esc(e.body) + "</p>"
              + (e.tag ? '<span class="tag">' + esc(e.tag) + "</span>" : "") + "</div>";
      });
      if (TIMELINE_DATA.note) html += '<p class="tl-note">' + esc(TIMELINE_DATA.note) + "</p>";
      html += "</div>";
      view.innerHTML = html;
    },
  });
})();
