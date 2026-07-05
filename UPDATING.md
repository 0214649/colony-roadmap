# Updating this site

**Easiest:** tell Claude in plain words — e.g. *"bump Cosmology to 18"*, *"add a
timeline event for the demo"*, *"reveal itRedeth in the codex"* — and Claude edits the
right data file, commits, and pushes. Live in ~30s.

**By hand / browser Claude (no terminal):** open the data file on github.com → ✏️ Edit → commit.

| to change…            | edit…         |
|-----------------------|---------------|
| roadMap shards/items  | `data.js`     |
| the hub pitch/greeting| `hub.js`      |
| timeline events       | `timeline.js` |
| codex reveals         | `codex.js` — flip one entry's `state` to `"revealed"` + fill its fields |
| a sprite              | drop the file in `assets/` + repoint its line in `assets.js` |

You never edit totals or bars — they recompute from the numbers automatically.
Never commit readable private content (bible/heroes) here — encrypted blobs only.
Don't edit the old `D:\Downloads\_colony_old_snapshots\` files; they're frozen.
