# colony website — notes for Claude

Live **public** site for the game colony. Served via GitHub Pages at
https://0214649.github.io/colony-roadmap/ (branch `main`, root). Local clone:
`~/colony/colony-roadmap`. **Read the `colony-website` skill first — it is the law**
(data-driven + modular, the security rule, bible lockstep).

Claude owns updates here: when dirty rat asks for a change, make it and
**commit + push without asking** (same convention as the `claude-setup` repo).

## The structure (since the glass rework, 2026-07-05)
**Every page reads a DATA file; templates only render.** Adding content = a one-file,
near-one-line change. NEVER hardcode content or a sprite path in a template.

| data (edit these)  | what it holds                                             |
|--------------------|-----------------------------------------------------------|
| `data.js`          | the roadMap — chambers/shards (totals/bars/status AUTO-compute; never hand-edit those) |
| `hub.js`           | the hub/presentation — itRedeth's greeting + pitch blocks |
| `timeline.js`      | dated project events (the timeLine tab)                   |
| `codex.js`         | the 42 — `state:"locked"` → flip to `"revealed"` + fields  |
| `wledger.js`       | the w ledger (renders inside the gated witness room)      |
| `assets.js`        | the sprite manifest: logical name → `assets/` path        |

Tab names are camelCase: hub · roadMap · timeLine · codex · manuScript · witness
(witness = the old heroes room, renamed 2026-07-05 heroes→hord→witness;
#heroes/#hord/#wLedger alias to it; the blob key + vault file stay `heroes`).
Browser title = `▽` + section (no site name — style first). The ants on the top layer
live in PAGE space (antLayer in site.js, sheet via the manifest).

| templates (layout/style work only) |
|------------------------------------|
| `index.html` (shell) · `site.css` (the glass identity tokens) · `site.js` (router · ground · shared craft) · `tab-hub.js` · `tab-roadmap.js` · `tab-timeline.js` · `tab-codex.js` |

## Identity (LOCKED by dirty rat, 2026-07-05): THE GLASS
The site is itRedeth's interface. Cold slate ground (`#0c0f14`), milky-frost panels,
etched UI, **Inter**, amber `#e0a23a` = the single signature light; bone text; teal for
gloss/meta lines; coral for shipped/bridge. camelCase everywhere, units singular.
The manuscript (private bible view) = the one warm vellum room.

## Security (LOCKED): private views ship ONLY as client-side AES-GCM blobs
Bible/heroes content NEVER touches this repo readable. Sources of truth live in
`~/colony/colony-design` (`design-bible.md` · `heroes-artifacts.md`); the site ships
ciphertext only (`private/*.enc.js`, lazy-loaded on first knock).
**Update flow (after any vault edit):** `COLONY_PASS='<the passphrase>' node tools/encrypt.mjs`
→ commit the blobs. One Claude-minted passphrase for both rooms (never write it in this
repo; it lives in Claude's local memory + with dirty rat). Rotation = rerun with a new
passphrase. `.gitignore` backstops vault filenames; the leak-scan before commit is law.

## Protocol
1. `git pull` (a browser edit may have landed).
2. Edit the DATA file (or add a module).
3. **If any .js/.css changed: bump `SITE_V` in index.html** (the inline constant AND every
   `?v=` on the asset tags — one number). Pages caches everything for 10 min
   (`max-age=600`, not configurable); the stamp keeps each HTML refresh atomic.
   Tell dirty rat to hard-refresh (Ctrl+Shift+R) when he's checking right after a deploy.
4. `git commit -am "..." && git push` → Pages builds in ~30s (check:
   `gh api repos/0214649/colony-roadmap/pages/builds/latest`).
5. When design depth changes: bible (dated, flagged) + `data.js` shards + codex together.

## Conventions
- unit = ▽ shard · `open: true` = chamber starts expanded · `bridge: true` = coral dot.
- Chamber names are lowercase voice (camelCase law). The roadMap groups chambers under
  3 bands (the game / the world / the work) via the `BANDS` slug map in `tab-roadmap.js` —
  a new chamber lands in a trailing "the dig" band until mapped there (one line).
- Long item details auto-fold to 2 lines (>240 chars) with a more/less toggle; the
  shipped/planned/locked/banked chips filter on patterns in the item text (LOCKED
  uppercase = the lock convention).
- `data.js` reader-aids: `updated` (footer date) + `legend` (units key) — keep current.
- Build-status line + shipped/planned/parked pills auto-derive from `vNNN (...)` names.
- Legacy `#ch-<slug>` deep links still work (router maps them into the roadMap tab).
- The `D:\Downloads\_colony_old_snapshots\` files are STALE — ignore them.
- Full design lives in the private `colony-design` repo.
