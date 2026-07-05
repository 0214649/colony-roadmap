/* colony — timeline template (renders TIMELINE_DATA as dated events) */
(function () {
  "use strict";
  var esc = SITE.esc;

  SITE.tab({
    id: "timeLine",
    label: "timeLine",
    render: function (view) {
      var evs = (TIMELINE_DATA.events || []).slice().sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
      // filter chips derive from whatever tags the data carries
      var tags = [];
      evs.forEach(function (e) { if (e.tag && tags.indexOf(e.tag) < 0) tags.push(e.tag); });

      var html = '<div id="tl"><p class="eyebrow">timeLine</p>'
               + '<p class="lede">how the colony grew — the dig, dated.</p>';
      if (tags.length > 1) {
        html += '<div class="tl-chips"><button class="chip on" data-tag="">all</button>';
        tags.forEach(function (t) { html += '<button class="chip" data-tag="' + esc(t) + '">' + esc(t) + "</button>"; });
        html += "</div>";
      } else html += '<div style="height:26px"></div>';
      evs.forEach(function (e) {
        html += '<div class="tl-ev" data-tag="' + esc(e.tag || "") + '"><p class="d">' + esc(e.date) + "</p><h3>" + esc(e.title) + "</h3>"
              + "<p>" + esc(e.body) + "</p>"
              + (e.tag ? '<span class="tag">' + esc(e.tag) + "</span>" : "") + "</div>";
      });
      if (TIMELINE_DATA.note) html += '<p class="tl-note">' + esc(TIMELINE_DATA.note) + "</p>";
      html += "</div>";
      view.innerHTML = html;

      view.querySelectorAll(".tl-chips .chip").forEach(function (btn) {
        btn.addEventListener("click", function () {
          view.querySelectorAll(".tl-chips .chip").forEach(function (b) { b.classList.remove("on"); });
          btn.classList.add("on");
          var t = btn.getAttribute("data-tag");
          view.querySelectorAll(".tl-ev").forEach(function (ev) {
            ev.style.display = (!t || ev.getAttribute("data-tag") === t) ? "" : "none";
          });
        });
      });
    },
  });
})();
