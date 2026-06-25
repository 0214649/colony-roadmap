/* ============================================================
   COLONY — roadmap data
   ------------------------------------------------------------
   THIS is the file you edit to update the site.
   You never touch index.html.

   - Each chamber's shard count = the sum of its items (auto).
   - The top tally (total ▽ + chamber count)   = auto.
   - The progress bars                          = auto.
   So just change the `shards` numbers, or add/remove lines.

   To add a sub-item:   { name: "New thing", shards: 5 },
   To add a chamber:    copy a whole { name:..., items:[...] } block.
   `open: true`   -> chamber starts expanded.
   `bridge: true` -> teal dot instead of amber.
   ============================================================ */

const COLONY_DATA = {
  eyebrow: "field log",
  title:   "COLONY",
  sub:     "project roadmap",
  lede:    'Every chamber is open, none of them finished. Depth is counted in <b>shards</b> (▽) — more shards means more actually built.',
  note:    "still mostly shallow, and that's the honest part",
  foot:    "a snapshot — we add shards as we dig",

  chambers: [
    {
      name: "Concept & loop",
      desc: "the idle engine the whole game runs on",
      open: true,
      items: [
        { name: "Core idle / incremental loop", shards: 12 },
        { name: "Gather · build · tidy", shards: 12 },
        { name: "Triple dopamine", shards: 10 },
        { name: "Loop: forage → grow → expand → descend", shards: 8 },
        { name: "Work model — big file = more ants + longer haul", shards: 4 },
      ],
    },
    {
      name: "Cosmology",
      desc: "3 tiers, 2 barriers, a pantheon of concept-gods",
      items: [
        { name: "Tier structure — you · lesser gods · two ultra-gods", shards: 18 },
        { name: "The pantheon — the shelf, now filling", shards: 12 },
        { name: "Gods as verbs — how is seen, why is sealed", shards: 6 },
        { name: "The two ultra-gods — kept dim", shards: 6 },
        { name: "Genesis / origin", shards: 2 },
      ],
    },
    {
      name: "Resources & units",
      desc: "shards and the wider economy",
      items: [
        { name: "The unit — shards (▽), plus the wider set", shards: 10 },
        { name: "Resource roles — build · food · logistics · research", shards: 8 },
        { name: "File type → resource map", shards: 8 },
        { name: "God-seeded influx — the renewable tap", shards: 4 },
      ],
    },
    {
      name: "Themes & morality",
      desc: "organic vs synthetic, and whether good is reachable",
      items: [
        { name: "Pro-AI vs pro-human thesis", shards: 12 },
        { name: "The autonomy dial — control = the theme", shards: 8 },
        { name: "The wall — entropy / the file influx", shards: 7 },
        { name: "Moral as a concept", shards: 4 },
        { name: "The immortality knot", shards: 2 },
      ],
    },
    {
      name: "Routes & endings",
      desc: "many deductions, no true end, no restart",
      items: [
        { name: "Reversible choices — no new game", shards: 7 },
        { name: "Scars, not walls", shards: 5 },
        { name: "Many deductions · no real end", shards: 4 },
      ],
    },
    {
      name: "Characters",
      desc: "the queen, the species, the soul of your machine",
      bridge: true,
      items: [
        { name: "God of bridges — your pc's soul (cold, fakes love)", shards: 9 },
        { name: "The queen — visible, not hidden", shards: 3 },
        { name: "Other species — the rival spawns", shards: 2 },
      ],
    },
    {
      name: "Desktop & explorer",
      desc: "the playfield — your real files, made alive",
      items: [
        { name: "Desktop layer + access — summon, frosted glass, taskbar-augment", shards: 12 },
        { name: "Navigation & actions — descend, type-to-jump, drag, midden", shards: 12 },
        { name: "The hub — mission control (processing, portals, meta, storage)", shards: 14 },
        { name: "Biomes — themed folders · SSD vs HDD skins", shards: 9 },
        { name: "File influx & cleanup — god-seeding, forbidden expeditions", shards: 9 },
        { name: "Safety model — sandbox, reversible, system off-limits", shards: 6 },
      ],
    },
    {
      name: "Onboarding / first run",
      desc: "the day-one empty desktop — the colony invites itself in",
      items: [
        { name: 'First-run questionnaire — warm hello + safety promise (never delete · reversible · opt-in) · "where may we forage?" folder consent as granting territory (sandbox-only start) · "how should we live here?" startup · multi-monitor · wallpaper · soft landing that becomes the first descent', shards: 6 },
        { name: '"How did you come to hold this?" — piracy welcomed, nothing detected · asked at start, cashed out late as the colony\'s deepest tribute · branches: bought → real price · key → noted · took it → warmest line · won\'t say → nil · optional · frictionless · never gated · never re-asked · (voice fork open: dev fourth-wall vs codex)', shards: 6 },
      ],
    },
    {
      name: "Build & tech",
      desc: "web → Electron overlay, safety, a prototype that runs",
      items: [
        { name: "Engine path — web stack → Electron / Tauri", shards: 12 },
        { name: "Transparent / frosted overlay + sandbox safety", shards: 10 },
        { name: "Prototype 001 — wandering ants + trails", shards: 7 },
        { name: "Low-resource idle background", shards: 4 },
        { name: "Learning path", shards: 3 },
      ],
    },
    {
      name: "Aesthetics",
      desc: "parked — minimalist, procedural, skinnable",
      items: [
        { name: "Direction options — biolum dark · muted flat · liminal fog · mono terminal", shards: 3 },
        { name: "Principle — minimalist + procedural (solo-sustainable)", shards: 2 },
        { name: "Ants look like ants · each insect unique", shards: 2 },
        { name: "Mood axis — uncanny ↔ bucolic (undecided)", shards: 1 },
      ],
    },
  ],
};
