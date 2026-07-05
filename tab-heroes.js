/* colony — the hord (private room: ONE manuscript — the vault's writings, then
   THE W LEDGER as the artifacts record, all on the vellum; face = crimson).
   hord = OE treasure-store; Beowulf's "wordhord onleac" — the word-hoard,
   unlocked. at THIS hoard's gate the unlocking is done by a word, which is
   the joke. (was "heroes"; hashes alias; blob key + vault file stay heroes.) */
(function () {
  "use strict";
  var esc = SITE.esc;
  // esc() leaves double quotes alone — values bound for HTML attributes need this too
  var attr = function (s) { return esc(s).replace(/"/g, "&quot;"); };

  function ledgerHtml() {
    var es = ((typeof WLEDGER_DATA !== "undefined" && WLEDGER_DATA.entries) || []).slice().reverse(); // newest first
    if (!es.length) return "";
    var html = '<h2 id="hv-ledger">the w ledger — the artifacts</h2>';
    html += "<p><em>every artifact render, numbered, newest first — not evolutive: iterations of how we render things for ourselves. the rejects are witnesses.</em></p>";
    if (WLEDGER_DATA.note) html += '<p class="wv-note">' + esc(WLEDGER_DATA.note) + "</p>";
    html += '<div class="wv">';
    var day = "";
    es.forEach(function (e) {
      if (e.date !== day) { day = e.date; html += '<p class="wv-day">' + esc(day) + "</p>"; }
      var lock = /lock/i.test(e.title || "");
      html += '<div class="wv-row' + (e.img ? "" : " lost") + (lock ? " lock" : "") + '"'
            + (e.img ? ' data-img="assets/w/' + attr(e.img) + '.jpg" data-cap="' + attr(e.w + " — " + e.title) + '"' : "") + ">";
      if (e.img) html += '<img src="assets/w/' + esc(e.img) + '.jpg" alt="' + esc(e.w) + '" loading="lazy" decoding="async">';
      else html += '<div class="wv-stub">lost to the wind</div>';
      html += '<div class="wv-txt"><div class="wv-head"><span class="wv-w">' + esc(e.w) + "</span> <b>" + esc(e.title) + "</b>"
            + '<span class="wv-d">' + esc(e.date) + "</span></div>"
            + "<p>" + esc(e.note) + "</p></div></div>";
    });
    html += "</div>";
    return html;
  }

  function room(view, payload) {
    var r = SITE_CRYPT.mdRender(payload.md);
    var body = r.html;
    // contents sit under the document's own title — the writings, then the ledger
    var tocHtml = '<nav class="ms-toc"><p class="ms-toc-rub">contents</p>'
                + r.toc.map(function (t) {
                    return '<a href="#' + esc(t.id) + '">' + esc(t.t) + "</a>";
                  }).join("")
                + '<a href="#hv-ledger">the w ledger — the artifacts</a></nav>';
    body = body.indexOf("</h1>") >= 0 ? body.replace("</h1>", "</h1>\n" + tocHtml) : tocHtml + body;

    var html = '<div id="ms">';
    html += '<div class="ms-bar"><p class="eyebrow">hord</p>'
          + '<button class="tbtn" id="ms-seal">seal the room</button></div>';
    html += '<p class="lede">the hoard — the named and the made, kept under one word.</p>';
    html += '<div class="vellum unseal">';
    html += '<p class="ms-meta">transcribed from the vault · ' + esc(payload.meta.vault || "")
          + " · " + esc(payload.meta.generated || "") + "</p>";
    html += '<article class="ms-body">' + body + ledgerHtml()
          + '<div class="orn">⁘</div><p class="ms-colophon">the hord stays open — more is carried in with every sitting.</p>'
          + "</article>";
    html += "</div></div>";
    html += '<button class="tbtn" id="ms-top">contents ⌃</button>';
    view.innerHTML = html;

    document.getElementById("ms-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "heroes", "hord", function (p) { room(view, p); });
    });
    view.querySelectorAll(".ms-toc a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    var top = document.getElementById("ms-top"), toc = view.querySelector(".ms-toc");
    if (top && toc) {
      top.addEventListener("click", function () { toc.scrollIntoView({ behavior: "smooth", block: "start" }); });
      var onScroll = function () {
        if (!top.isConnected) { window.removeEventListener("scroll", onScroll); return; }
        top.classList.toggle("show", window.scrollY > 700);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    view.querySelectorAll(".wv-row[data-img]").forEach(function (row) {
      row.addEventListener("click", function () {
        var box = document.createElement("div");
        box.id = "wl-box";
        box.innerHTML = '<figure><img src="' + attr(row.getAttribute("data-img")) + '" alt="">'
                      + "<figcaption>" + esc(row.getAttribute("data-cap")) + " · click anywhere to close</figcaption></figure>";
        box.addEventListener("click", function () { box.remove(); });
        document.body.appendChild(box);
      });
    });
    // the lightbox lives on document.body — the router must not strand it on tab exit
    SITE._teardown = function () {
      var b = document.getElementById("wl-box");
      if (b) b.remove();
    };
  }

  SITE.tab({
    id: "hord",
    label: "hord",
    sealed: true,
    render: function (view) {
      SITE_CRYPT.gate(view, "heroes", "hord", function (p) { room(view, p); });
    },
  });
})();
