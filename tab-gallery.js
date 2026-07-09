/* colony — the gallery (private room: every sprite the colony was given a body with,
   and every iteration behind it — references, first shots, working cuts, finals, and
   the rejects that are witnesses too). the catalogue rides in the `gallery` blob; the
   thumbnails ride in lazy `gallery-img-NN` blobs, all sealed under the one old tongue.
   nothing readable — not one thumbnail file — ever touches the public tree. */
(function () {
  "use strict";
  var esc = SITE.esc;
  var attr = function (s) { return esc(String(s)).replace(/"/g, "&quot;"); };

  var CAT = null;                 // the decrypted catalogue
  var bundleCache = {};           // key -> {id:dataURI}
  var bundlePromise = {};         // key -> Promise
  var io = null;                  // one shared IntersectionObserver

  function loadBundle(key) {
    if (bundleCache[key]) return Promise.resolve(bundleCache[key]);
    if (bundlePromise[key]) return bundlePromise[key];
    var pass = SITE_CRYPT.cachedPass();
    bundlePromise[key] = SITE_CRYPT.unlock(key, pass).then(function (payload) {
      bundleCache[key] = payload.imgs || {};
      return bundleCache[key];
    }).catch(function () { delete bundlePromise[key]; return {}; });
    return bundlePromise[key];
  }

  function fillThumb(imgEl) {
    var id = imgEl.getAttribute("data-id"), bkey = imgEl.getAttribute("data-b");
    if (!bkey) return;
    loadBundle(bkey).then(function (imgs) {
      if (!imgEl.isConnected) return;
      var uri = imgs[id];
      if (uri) { imgEl.src = uri; imgEl.classList.add("loaded"); }
      else imgEl.classList.add("lost");
    });
  }

  /* ---------- lightbox: walk a subject's lineage ---------- */
  var LB = null, lbList = [], lbIdx = 0;
  function stageLabel(st) {
    var m = { reference: "reference", "first-shot": "first shot", working: "working", final: "final", reject: "reject" };
    return m[st] || st;
  }
  function stageBadge(st) {
    var m = { reference: "r", "first-shot": "1", working: "~", final: "✦", reject: "✕" };
    return m[st] || "·";
  }
  function openLightbox(list, idx) {
    lbList = list; lbIdx = idx;
    if (!LB) {
      LB = document.createElement("div"); LB.id = "gal-lb";
      LB.innerHTML = '<button class="gal-lb-x" aria-label="close">✕</button>'
        + '<button class="gal-lb-nav prev" aria-label="previous">‹</button>'
        + '<figure><div class="gal-lb-imgwrap"><img alt=""></div><figcaption></figcaption></figure>'
        + '<button class="gal-lb-nav next" aria-label="next">›</button>';
      document.body.appendChild(LB);
      LB.querySelector(".gal-lb-x").addEventListener("click", closeLightbox);
      LB.addEventListener("click", function (e) { if (e.target === LB) closeLightbox(); });
      LB.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
      LB.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    }
    LB.classList.add("show"); paintLightbox();
  }
  function step(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; paintLightbox(); }
  function paintLightbox() {
    if (!LB) return;
    var id = lbList[lbIdx], m = CAT.imgs[id];
    var img = LB.querySelector("img"), cap = LB.querySelector("figcaption");
    img.classList.remove("ready"); img.removeAttribute("src");
    loadBundle(m.b).then(function (imgs) {
      if (!LB || !LB.classList.contains("show")) return;
      if (lbList[lbIdx] !== id) return;                // navigated away while decrypting
      img.src = imgs[id] || ""; img.classList.add("ready");
    });
    var subj = CAT.subjects.filter(function (s) { return s.slug === m.s; })[0];
    var pos = subj ? (subj.imgs.indexOf(id) + 1) + " of " + subj.imgs.length : "";
    var srcName = String(m.src).split("/").pop();
    cap.innerHTML = '<span class="glc-subj">' + esc(subj ? subj.label : m.s) + "</span>"
      + '<span class="glc-stage st-' + esc(m.st) + '">' + esc(stageLabel(m.st)) + "</span>"
      + (m.n ? '<span class="glc-note">' + esc(m.n) + "</span>" : "")
      + '<span class="glc-meta">' + esc(m.w + "×" + m.h) + " · " + esc(m.d || "")
      + " · " + esc(m.col) + (pos ? " · " + esc(pos) + " in this lineage" : "") + "</span>"
      + '<span class="glc-src">' + esc(srcName) + "</span>";
  }
  function closeLightbox() { if (LB) LB.classList.remove("show"); }
  function onKey(e) {
    if (!LB || !LB.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  }

  /* ---------- render ---------- */
  var activeCat = "all", activeStage = "all", query = "";

  function thumbHtml(id, extra) {
    var m = CAT.imgs[id];
    return '<button class="gal-th' + (extra || "") + ' st-' + esc(m.st) + '" data-id="' + attr(id) + '" '
      + 'title="' + attr((m.n || "") + " — " + stageLabel(m.st)) + '">'
      + '<img alt="" loading="lazy" data-id="' + attr(id) + '" data-b="' + attr(m.b) + '">'
      + '<span class="gal-th-stage">' + esc(stageBadge(m.st)) + "</span>"
      + "</button>";
  }

  function subjectVisible(subj) {
    if (activeCat !== "all" && subj.cat !== activeCat) return false;
    if (query) {
      var hay = (subj.label + " " + subj.slug).toLowerCase();
      if (hay.indexOf(query) < 0) {
        // also match on any image note
        var hit = subj.imgs.some(function (id) { return (CAT.imgs[id].n || "").toLowerCase().indexOf(query) >= 0; });
        if (!hit) return false;
      }
    }
    if (activeStage !== "all") return subj.imgs.some(function (id) { return CAT.imgs[id].st === activeStage; });
    return true;
  }

  function renderBody(mount) {
    var catMap = {}; CAT.cats.forEach(function (c) { catMap[c.key] = c.label; });
    var html = "", shown = 0, shownImgs = 0;
    CAT.cats.forEach(function (c) {
      var subs = CAT.subjects.filter(function (s) { return s.cat === c.key && subjectVisible(s); });
      if (!subs.length) return;
      html += '<section class="gal-cat" id="galc-' + esc(c.key) + '"><h2>' + esc(c.label)
        + ' <span class="gal-cat-n">' + subs.length + "</span></h2><div class=\"gal-shelf\">";
      subs.forEach(function (s) {
        shown++;
        var imgs = s.imgs.filter(function (id) { return activeStage === "all" || CAT.imgs[id].st === activeStage; });
        shownImgs += imgs.length;
        html += '<article class="gal-subj" data-slug="' + attr(s.slug) + '">'
          + '<div class="gal-subj-head"><b>' + esc(s.label) + "</b>"
          + '<span class="gal-subj-n">' + imgs.length + (imgs.length === 1 ? " image" : " images") + "</span></div>"
          + '<div class="gal-rail">'
          + imgs.map(function (id) { return thumbHtml(id, id === s.finalId ? " is-final" : ""); }).join("")
          + "</div></article>";
      });
      html += "</div></section>";
    });
    if (!shown) html = '<p class="gal-empty">nothing in the glass matches — loosen the filter.</p>';
    mount.innerHTML = html;
    // wire thumbs → observer + lightbox
    var subjEls = mount.querySelectorAll(".gal-subj");
    subjEls.forEach(function (el) {
      var slug = el.getAttribute("data-slug");
      var ids = Array.prototype.map.call(el.querySelectorAll(".gal-th"), function (b) { return b.getAttribute("data-id"); });
      el.querySelectorAll(".gal-th").forEach(function (btn, i) {
        btn.addEventListener("click", function () { openLightbox(ids, i); });
      });
    });
    mount.querySelectorAll(".gal-th img").forEach(function (im) { io.observe(im); });
    return { subjects: shown, images: shownImgs };
  }

  function room(view, payload) {
    CAT = payload;
    var total = Object.keys(CAT.imgs).length;
    var catChips = '<button class="gal-chip on" data-cat="all">all</button>'
      + CAT.cats.map(function (c) { return '<button class="gal-chip" data-cat="' + attr(c.key) + '">' + esc(c.label) + "</button>"; }).join("");
    var stageChips = '<button class="gal-chip sc on" data-stage="all">every stage</button>'
      + CAT.stages.map(function (s) { return '<button class="gal-chip sc st-' + esc(s.key) + '" data-stage="' + attr(s.key) + '">' + esc(s.label) + "</button>"; }).join("");

    var html = '<div id="gal">';
    html += '<div class="gal-bar"><div><p class="eyebrow">the gallery</p>'
      + '<button class="tbtn" id="gal-seal">seal the room</button></div></div>';
    html += '<p class="lede">every sprite the colony was given a body with — and the whole road behind each one: the references, the first shots, the working cuts, the finals, and the rejects that are witnesses too. '
      + '<b>' + total + "</b> images, " + CAT.subjects.length + " subjects, sealed behind the glass.</p>";
    html += '<div class="gal-filters"><div class="gal-chips">' + catChips + "</div>"
      + '<div class="gal-chips">' + stageChips + "</div>"
      + '<input type="search" id="gal-q" class="search" placeholder="search a subject or a note…" autocomplete="off"></div>';
    html += '<p class="gal-count" id="gal-count"></p>';
    html += '<div id="gal-body"></div>';
    html += '<div class="orn">⁘</div><p class="ms-colophon">the glass keeps every hand we tried — the kept and the cut alike.</p>';
    html += "</div>";
    view.innerHTML = html;

    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { fillThumb(en.target); io.unobserve(en.target); } });
    }, { rootMargin: "600px 0px" });

    var body = document.getElementById("gal-body"), count = document.getElementById("gal-count");
    function repaint() {
      if (io) io.disconnect();
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { fillThumb(en.target); io.unobserve(en.target); } });
      }, { rootMargin: "600px 0px" });
      var r = renderBody(body);
      count.innerHTML = "showing <b>" + r.images + "</b> images across <b>" + r.subjects + "</b> subjects";
    }

    view.querySelectorAll(".gal-chip[data-cat]").forEach(function (ch) {
      ch.addEventListener("click", function () {
        activeCat = ch.getAttribute("data-cat");
        view.querySelectorAll(".gal-chip[data-cat]").forEach(function (o) { o.classList.toggle("on", o === ch); });
        repaint();
      });
    });
    view.querySelectorAll(".gal-chip[data-stage]").forEach(function (ch) {
      ch.addEventListener("click", function () {
        activeStage = ch.getAttribute("data-stage");
        view.querySelectorAll(".gal-chip[data-stage]").forEach(function (o) { o.classList.toggle("on", o === ch); });
        repaint();
      });
    });
    var qin = document.getElementById("gal-q"), qt = null;
    qin.addEventListener("input", function () { clearTimeout(qt); qt = setTimeout(function () { query = qin.value.trim().toLowerCase(); repaint(); }, 160); });

    document.getElementById("gal-seal").addEventListener("click", function () {
      SITE_CRYPT.seal();
      SITE_CRYPT.gate(view, "gallery", "the gallery", function (p) { room(view, p); });
    });

    document.addEventListener("keydown", onKey);
    SITE._teardown = function () {
      if (LB) { LB.remove(); LB = null; }
      if (io) { io.disconnect(); io = null; }
      document.removeEventListener("keydown", onKey);
    };

    repaint();
  }

  SITE.tab({
    id: "gallery",
    label: "gallery",
    sealed: true,
    render: function (view) {
      SITE_CRYPT.gate(view, "gallery", "the gallery", function (p) { room(view, p); });
    },
  });
})();
