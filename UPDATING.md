# Updating this repo

**Easiest:** tell Claude in plain words — e.g. *"bump Cosmology to 18, add a Memory-god
item at 4 shards"* — and Claude edits `data.js`, commits, and pushes. Live in ~30s.

**By hand / browser Claude (no terminal):**
1. Open `data.js` on github.com → ✏️ Edit.
2. Change a `shards` number, add a line like `{ name: "New thing", shards: 5 },`,
   or copy a whole chamber block.
3. Commit. The site at https://0214649.github.io/colony-roadmap/ updates in ~30s.

You never edit totals or bars — they recompute from the numbers automatically.
Don't edit the old `D:\Downloads\_colony_old_snapshots\` files; they're frozen.
