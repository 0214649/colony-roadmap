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
      desc: "a wheel of 6 liquid wedges on a radial ruler, framed by 2 ultra powers — the 42-god codex",
      items: [
        { name: "The wheel — 6 liquid wedges (tears·nectar·blood·ichor·fuel·ether), each a mode of automation", shards: 14 },
        { name: "The grid — 12 radial lines (6 spines + 6 seams) × 3 depths (close·between·far) = 36 grid-gods", shards: 12 },
        { name: "Radial ruler — centre organic·evil ↔ rim synthetic·good, middle = weak; radius = allegiance (a U, not a slope)", shards: 10 },
        { name: "The 42 frame — 36 grid-gods + 6 wildcards + 2 ultra powers (symbolic); fog beyond the barriers", shards: 8 },
        { name: "Ultra powers named — thus nearen (centre) / thus faren (rim); swa…→thus…, comprehension CLOSES them", shards: 8 },
        { name: "Tier structure — you · the wheel · two ultra powers (legibility, not power)", shards: 18 },
        { name: "Verb-epithet naming — OE 'se þe …aþ' → 'it …eth'; ultra use 'swa …' → 'thus …'", shards: 9 },
        { name: "Codex schema locked — call · gloss · body · spawn · touch · tribute, each unlocks independently", shards: 9 },
        { name: "Field-state grammar — asemic (locked) · nil (resolved-none) · text", shards: 6 },
        { name: "God-relationship model — one-to-one currency, many-to-many touch · overlap + opposition", shards: 8 },
        { name: "Wildcards (off-grid) — it redeth (the glass), it oreth (genesis), it endeth (the end); +3 open", shards: 9 },
        { name: "it redeth (was it interpreteth) — the glass the whole wheel is read through · authored", shards: 11 },
        { name: "it scatheth — blood·close · war/violence · file collisions · hornets · AUTHORED page", shards: 9 },
        { name: "it yerveth — blood·between · kin/line · abandoned wild brood · mints marrow ߷ · AUTHORED page", shards: 9 },
        { name: "it emptieth (was Void) — returns to the grid at ether·far (body re-tune owed)", shards: 9 },
        { name: "it yoketh (Obedience) — entry finished · touch = the player (the hidden reveal)", shards: 9 },
        { name: "it owneth (was Conquest) — mints shards ▽; blood↔ichor seam, shares it with greed", shards: 6 },
        { name: "Plenum — returns to the grid at ether·close; ether spine = Plenum·hole·it emptieth", shards: 4 },
        { name: "it oreth — genesis/origin wildcard; alpha/omega bound-pair with it endeth", shards: 3 },
        { name: "it groweth — growth/maturation (nectar); co-reigns the brood (placeholder)", shards: 2 },
        { name: "entropy / chaos — the unkillable wall; candidate 6th wildcard, no grid address yet", shards: 3 },
        { name: "Authority — sealed deep / OS root; Obedience answers to it (named, unfleshed)", shards: 2 },
        { name: "Motion — fuel↔ether seam; the husk's co-owner (parked)", shards: 1 },
      ],
    },
    {
      name: "Resources & units",
      desc: "economy restarted god-first — units derive from gods, one currency per god",
      items: [
        { name: "Old matter/dew/signal/lumen table — scrapped (god-first restart)", shards: 1 },
        { name: "Minting powers locked — it owneth→shards ▽, it yerveth→marrow ߷, it yoketh→$ (one-to-one)", shards: 8 },
        { name: "marrow ߷ — new genetics/life unit; walled off from shards (geology) and food (life-mass)", shards: 6 },
        { name: "shards ▽ — harvest = nibble empty folders (real cleanup + spawned tide), not bedrock", shards: 7 },
        { name: "Folders are tunnels — empty = dead-end, not-empty = live tunnel; start in the main folders", shards: 6 },
        { name: "Tidying exposes ground → cleanup pays in shards", shards: 5 },
        { name: "Lifetime shards = depth (climbs only) · current = spendable", shards: 4 },
        { name: "brood / population — claimed wild brood, a harvest distinct from shards and food", shards: 3 },
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
    {
      name: "Workflow & tooling",
      desc: "how the project is actually built across chats",
      items: [
        { name: "Two-repo loop — design chats emit changesets → Claude Code applies & pushes", shards: 6 },
        { name: "CLAUDE.md in each repo · the re-uploaded bible is the only memory", shards: 5 },
      ],
    },
  ],
};
