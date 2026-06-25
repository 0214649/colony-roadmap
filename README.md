# COLONY — roadmap site

Live status tracker for COLONY. Depth measured in shards (▽).

- **`index.html`** — the template. You almost never touch this.
- **`data.js`** — the content. **This is the only file you edit to update progress.**
  Shard counts, bars, and the top tally all auto-compute from the numbers here.

## How to update (with browser Claude)

1. In claude.ai, say something like:
   > "Here's my COLONY roadmap data.js. Bump *Cosmology* to lock the pantheon —
   > raise 'The pantheon' to 18, and add a sub-item 'Memory god — drafted' at 4 shards."
   (Paste the contents of `data.js`.)
2. Claude gives you back the edited `data.js`.
3. On GitHub, open `data.js` → pencil (Edit) icon → paste → **Commit changes**.
4. ~30 seconds later the live site shows it. Totals re-add themselves.

That's the whole loop. No build step, no tools installed.

## Local preview

Double-click `index.html` — it opens in your browser straight from disk
(no server needed, because data is a `.js` file, not fetched JSON).

## Hosting (GitHub Pages — one-time setup)

1. Create a free account at github.com.
2. New repository, name it e.g. `colony-roadmap`, **Public**.
3. Upload `index.html`, `data.js`, `README.md` (drag-drop in the browser works).
4. Repo **Settings → Pages → Source: Deploy from a branch → main → /(root) → Save**.
5. Your link appears: `https://<your-username>.github.io/colony-roadmap/`
