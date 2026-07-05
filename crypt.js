/* ============================================================
   colony — the old tongue (private-room gate + decryptor + vellum md)
   ------------------------------------------------------------
   Blobs are AES-GCM ciphertext (see tools/encrypt.mjs); the
   passphrase is the key. Blob scripts lazy-load on first need so
   public visits never pay for the private rooms. The passphrase
   is cached for the tab session only.
   ============================================================ */

var SITE_CRYPT = (function () {
  "use strict";
  var esc = SITE.esc;
  var CACHE_KEY = "colony-oldtongue";

  var b64d = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };

  // fetch a room's blob script only when someone actually knocks
  var loading = {};
  function ensureBlob(key) {
    if (window.COLONY_BLOBS && window.COLONY_BLOBS[key]) return Promise.resolve();
    if (loading[key]) return loading[key];
    loading[key] = new Promise(function (res, rej) {
      var sc = document.createElement("script");
      sc.src = "private/" + key + ".enc.js" + (window.SITE_V ? "?v=" + window.SITE_V : "");
      sc.onload = function () {
        // a 200 that isn't a real blob (host fallback page, truncation) must not
        // masquerade as a wrong passphrase forever
        if (window.COLONY_BLOBS && window.COLONY_BLOBS[key]) res();
        else { delete loading[key]; rej(new Error("no blob")); }
      };
      sc.onerror = function () { delete loading[key]; rej(new Error("no blob")); };
      document.head.appendChild(sc);
    });
    return loading[key];
  }

  async function unlock(key, pass) {
    await ensureBlob(key);
    var blob = window.COLONY_BLOBS[key];
    var base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
    var k = await crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: b64d(blob.salt), iterations: blob.iter },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    var pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64d(blob.iv) }, k, b64d(blob.ct));
    return JSON.parse(new TextDecoder().decode(pt)); // { meta:{generated,vault}, md }
  }

  function cachedPass() { try { return sessionStorage.getItem(CACHE_KEY); } catch (e) { return null; } }
  function remember(pass) { try { sessionStorage.setItem(CACHE_KEY, pass); } catch (e) {} }
  function seal() { try { sessionStorage.removeItem(CACHE_KEY); } catch (e) {} }

  /* ---- the gate (diegetic: speak the old tongue) ---- */
  function gate(view, key, title, onOpen) {
    view.innerHTML = '<div id="sealed" class="frost"><canvas width="240" height="110"></canvas>'
      + "<h2>" + esc(title) + " — sealed</h2>"
      + "<p>speak the old tongue.</p>"
      + '<form id="gate-form"><input type="password" id="gate-pass" class="search" placeholder="the passphrase…" autocomplete="off">'
      + '<button type="submit" class="tbtn" id="gate-open">unseal</button></form>'
      + '<p class="gate-err" id="gate-err"></p>'
      + '<p class="old">what lies behind ships only as ciphertext — nothing readable ever touches the public repo.</p></div>';
    SITE.asemic(view.querySelector("canvas"), "sealed-" + key, { rows: 2, cols: 6, w: 240, h: 110, ink: "rgba(232,220,192,.5)" });

    var form = view.querySelector("#gate-form"), input = view.querySelector("#gate-pass"),
        btn = view.querySelector("#gate-open"), err = view.querySelector("#gate-err");
    var mySeq = SITE.seq; // this gate's render generation

    function attempt(pass, silent) {
      btn.disabled = true; btn.textContent = "translating…"; err.textContent = "";
      form.classList.remove("err");
      unlock(key, pass).then(function (payload) {
        remember(pass);
        // only touch the view if the user is still on THIS tab render
        if (SITE.seq === mySeq) onOpen(payload);
      }).catch(function (e) {
        if (SITE.seq !== mySeq) return; // gate is gone — stay quiet
        btn.disabled = false; btn.textContent = "unseal";
        if (!silent) {
          form.classList.add("err");
          err.textContent = (e && e.message === "no blob")
            ? "this room has no seal yet — nothing is stored behind it."
            : "the glass does not recognize these words.";
        }
      });
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); if (input.value && !btn.disabled) attempt(input.value, false); });

    var c = cachedPass();
    if (c) attempt(c, true); else input.focus();
  }

  /* ---- vellum markdown (covers the bible's shapes: headings ·
     nested lists · blockquotes · pipe tables · hr · inline md) ---- */
  function inline(s) { // s arrives HTML-escaped
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+(?:\*[^*]+\*[^*]*)*)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(>])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, function (m, txt, url) {
      // esc() leaves double quotes alone — a " in the URL must not escape the attribute
      return '<a href="' + url.replace(/"/g, "%22") + '" target="_blank" rel="noopener">' + txt + "</a>";
    });
    return s;
  }
  var slugify = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };

  function mdRender(md, opts) {
    opts = opts || {};
    var lines = String(md).split(/\r?\n/);
    var out = [], para = [], listStack = [], i, toc = [];

    function flushPara() {
      if (!para.length) return;
      out.push("<p>" + inline(esc(para.join(" "))) + "</p>");
      para = [];
    }
    function closeLists(to) {
      while (listStack.length > to) { out.push("</ul>"); listStack.pop(); }
    }
    function flushAll() { flushPara(); closeLists(0); }

    for (i = 0; i < lines.length; i++) {
      var ln = lines[i];

      var h = ln.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        flushAll();
        var lvl = h[1].length, txt = h[2];
        var id = "";
        if (lvl === 2) { var sl = "ms-" + slugify(txt); toc.push({ id: sl, t: txt }); id = ' id="' + sl + '"'; }
        // "12. section" numerals get the amber illumination (deliberate, never mid-word)
        var num = txt.match(/^(\d+\.)\s*(.*)$/);
        var body = num ? '<span class="ms-num">' + esc(num[1]) + "</span> " + inline(esc(num[2])) : inline(esc(txt));
        out.push("<h" + lvl + id + ">" + body + "</h" + lvl + ">");
        continue;
      }
      if (/^\s*---+\s*$/.test(ln)) { flushAll(); out.push('<div class="orn">⁘</div>'); continue; }

      if (/^>/.test(ln)) { // gather the whole quote block, render its inside recursively
        flushAll();
        var qs = [];
        while (i < lines.length && /^>/.test(lines[i])) { qs.push(lines[i].replace(/^>\s?/, "")); i++; }
        i--;
        out.push("<blockquote>" + mdRender(qs.join("\n"), { inner: true }).html + "</blockquote>");
        continue;
      }

      if (/^\s*\|/.test(ln)) { // pipe table
        flushAll();
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i].trim()); i++; }
        i--;
        var t = "<table>";
        rows.forEach(function (r, ri) {
          if (/^\|[\s:|-]+\|$/.test(r)) return; // separator row
          var cells = r.replace(/^\||\|$/g, "").split("|");
          var tag = ri === 0 ? "th" : "td";
          t += "<tr>" + cells.map(function (c) { return "<" + tag + ">" + inline(esc(c.trim())) + "</" + tag + ">"; }).join("") + "</tr>";
        });
        out.push(t + "</table>");
        continue;
      }

      var li = ln.match(/^(\s*)(-|\d+\.)\s+(.*)$/);
      if (li) {
        flushPara();
        var depth = Math.floor(li[1].length / 2) + 1;
        while (listStack.length < depth) { out.push("<ul>"); listStack.push(1); }
        closeLists(depth);
        var lead = li[2] === "-" ? "" : '<span class="ms-num">' + esc(li[2]) + "</span> ";
        // numbered items carry their own amber numeral — the disc bullet would double the marker
        out.push("<li" + (lead ? ' class="num"' : "") + ">" + lead + inline(esc(li[3])) + "</li>");
        continue;
      }

      if (!ln.trim()) { flushAll(); continue; }
      // a plain line while a list is open = continuation of the last item
      if (listStack.length) { out.push("<li class=\"cont\">" + inline(esc(ln.trim())) + "</li>"); continue; }
      para.push(ln.trim());
    }
    flushAll();
    return { html: out.join("\n"), toc: toc };
  }

  return { gate: gate, unlock: unlock, mdRender: mdRender, seal: seal, cachedPass: cachedPass };
})();
