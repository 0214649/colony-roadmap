# COLONY roadmap — notes for Claude

Live **public** roadmap for the game COLONY. Served via GitHub Pages at
https://0214649.github.io/colony-roadmap/ (branch `main`, root). Local clone:
`~/colony/colony-roadmap`.

Claude owns updates here: when dirty rat asks for a roadmap change, make it and
**commit + push without asking** (same convention as the `claude-setup` repo).

## Edit ONLY `data.js`
- `data.js` holds all content — change `shards` numbers, add/remove items, or add a
  whole chamber block.
- Totals, bar widths, and the top tally **all auto-compute** in `index.html` — never
  hand-edit them.
- Touch `index.html` only for genuine layout/style changes.

## Protocol
1. `git pull` (a browser edit may have landed).
2. Edit `data.js`.
3. `git commit -am "..." && git push` → Pages redeploys in ~30s.

## Conventions
- unit = ▽ shards · `open: true` = chamber starts expanded · `bridge: true` = teal dot.
- `data.js` also carries two optional reader-aids: `updated` (a date string, shown in
  the footer) and `legend` (array of `{ g, name, note }` glyph rows for the units key).
  Keep `legend` current as new units are coined; bump `updated` when you change content.
- `index.html` auto-derives the build-status line and the shipped/planned/parked pills
  from the `vNNN (...)` item names — don't hand-maintain those.
- The `D:\Downloads\_colony_old_snapshots\` files are STALE — ignore them.
- Full design lives in the private `colony-design` repo. When design depth changes,
  bump the matching chamber's shards here too.
