/* ============================================================
   colony — timeline data (the project's evolution, dated)
   ------------------------------------------------------------
   THIS is the file you edit to add a timeline event.
   One entry = one object; the page sorts by date descending.
   tags in use: concept · cosmology · build · tutorial · art · site
   (the filter row derives from whatever tags exist — new tags just work)
   ============================================================ */

const TIMELINE_DATA = {
  note: "retraced from the bible and the repos' own history — the dig, dated.",
  events: [
    {
      date: "2026-06-25",
      title: "genesis — the pitch",
      body: "colony is founded: an idle · incremental game where an ant colony lives on your real file system — forages your actual folders, builds, grows, tidies. triple dopamine: a colony to watch, a creature that lives on your pc, a cleaner that's genuinely useful. beneath it, a cosmology you deduce, never get told. the design vault and this site are born the same day.",
      tag: "concept",
    },
    {
      date: "2026-06-25",
      title: "the economy restarts god-first",
      body: "the original resource table is scrapped wholesale. new principle: units derive from gods — one currency per god, one-to-one; most gods mint nothing. only shard ▽ survives the purge. from this day the economy is an expression of the cosmology, not a parallel system.",
      tag: "concept",
    },
    {
      date: "2026-06-25",
      title: "the old tongue — naming + the codex schema",
      body: "gods are verbs: an unknown power wears its old-tongue name, and comprehension drags it up into the legible it…eth form — translation is understanding, and every translation costs a small loss. each power becomes one codex entry of six independently-unsealing fields; what is sealed shows only asemic marks. the codex this site carries is written in that grammar.",
      tag: "cosmology",
    },
    {
      date: "2026-06-25",
      title: "v001 — wandering ants",
      body: "the first prototype: ants wander a canvas and leave trails. already listed in this site's very first commit — the seed of the whole vNNN build ladder.",
      tag: "build",
    },
    {
      date: "2026-06-26",
      title: "the wheel",
      body: "the pantheon gets its geometry: six liquid wedges — tears · nectar · blood · ichor · fuel · ether — crossed by 12 radial lines at 3 depths = 36 grid powers, framed by the ultras. one radial ruler runs centre to rim: organic to synthetic, with the middle weak — a U, not a slope. allegiance, not power.",
      tag: "cosmology",
    },
    {
      date: "2026-06-26",
      title: "the paliers — pacing as a funnel",
      body: "progression locks as a global ladder of paliers, each gated by a long, broad checklist that can't be rushed by raw accumulation; crossing is a chosen molt that raises the colony's caps. the game is built to be played alongside your real work, over weeks — slow ambient growth as law, not accident.",
      tag: "concept",
    },
    {
      date: "2026-06-27",
      title: "the 42 resolved + the watershed",
      body: "the count is cut clean: 36 grid powers + 6 orbiting wildcards = 42, with the ultras as the uncounted frame. the same sitting names the third ultra — the watershed, the only door past the three terminal deaths. the wheel now ends somewhere: three ways for everything to stop, and one narrow parting through.",
      tag: "cosmology",
    },
    {
      date: "2026-06-27",
      title: "morality without a meter",
      body: "the good/bad allegiance bar dies. in its place: conduct the gods read off your recent behavior and a slow lifetime trajectory — nothing stated, you infer your standing from how the powers treat you. one exception is visible: sorrow 𓁿, the colony's moral weight, the one meter you ever see.",
      tag: "concept",
    },
    {
      date: "2026-06-27",
      title: "the skeptic guard + the safety spine",
      body: "the game opens in its own bundled folder by default — forages its own files, morally clean, zero consent needed — and only then asks for territory, folder by folder. real files are never deleted; every action previews, logs, reverses. low-resource is elevated to a non-negotiable pillar the same day.",
      tag: "concept",
    },
    {
      date: "2026-06-27",
      title: "v004 — the first electron build",
      body: "colony becomes a real desktop app: the colony meets a sandboxed folder and nibbles an empty folder into its first shard ▽. the whole safety scaffold — main-process fs, path guards, sandboxed renderer — lands on day one, before any feature that could need it.",
      tag: "build",
    },
    {
      date: "2026-06-27",
      title: "v005 · v006 — the terrarium, then the loop closes",
      body: "the desktop becomes a terrarium: an icon-grid world with ants among your files, pheromone roads, chip-and-haul foraging. hours later the unified model lands — one surface, one cross-level network, one colony of autonomous continuously-simulated ants — and the loop closes: forage → spend shard to claim → reach deeper. folders become gates; the claim fuses ant-access, player-descent, expansion and consent into one mechanic. the same day, 'proto' is retired: builds are versioned vNNN.",
      tag: "build",
    },
    {
      date: "2026-06-28",
      title: "v007 · v008 · v009 — the queen, the base, the opening",
      body: "one ant, cold-open: full folders yield plasm ●, hauled to the queen, who lays new ants at climbing cost. roads are banked in a decisive pivot — foraging goes direct, control becomes selection + standing behavior. the world resolves into surface · tunnels · anthill with the first castes and the bank/tank/clank stores; then the narrative opening arrives — the queen's lost nymph, recovered from a deep folder, opens the lay pipeline. locomotion law: nothing ever teleports.",
      tag: "build",
    },
    {
      date: "2026-06-29",
      title: "v010 — construction: heft, the workShop, the maw",
      body: "building arrives: heft ℈ gnawed non-destructively from real files by type, the workShop and worker-built buildings hauled by two ants, and the maw — the first logistics organism, routing loot to tentacled outmaws. floating islands open real folder contents as in-world peeks: the first literal 'beats explorer' moment.",
      tag: "build",
    },
    {
      date: "2026-06-29",
      title: "one day, three skins",
      body: "the first visual identity crisis, fought and settled in a day: a frosted-glass trial reads cheap, a win9x retro lock doesn't feel right, and the line is rebuilt from scratch as soil & chitin — loam ground, bone text, amber as the colony's single signature light. palette-first, no gimmicks. it holds as the shipped skin from here on.",
      tag: "art",
    },
    {
      date: "2026-06-30",
      title: "v011 — the molt",
      body: "the palier ladder becomes playable: a persistent quest-log, broad checklists, and the molt — a chosen crossing that raises the census Σ and pheromone ⌇ caps. earned, never bought. the maw network matures (three outmaws fuse into a four-tentacle tetraMaw), and a new verification culture starts: the harness drives the whole test tree itself.",
      tag: "build",
    },
    {
      date: "2026-06-30",
      title: "v012 — hunger arrives",
      body: "sate ꩜ becomes a lived metabolism: every ant carries a hunger bar, slows when starving, dies at zero — the expansion brake is attrition. berry bushes and trash heaps feed mangers; the cropAnt (three of them pull a chariot) and the janitorAnt join the roster; a zero-population wipe plays a revival cutscene. move lets a worker relocate nearly anything — including a claimed folder, as a real on-disk move.",
      tag: "build",
    },
    {
      date: "2026-07-01",
      title: "v013 — the registry spine, biomes, farming",
      body: "the game's content consolidates into registries — one row per caste, chamber, resource, building, biome — making every later addition a one-line change. on that spine, the same day: biomes (a real folder's name themes its zone, and gives it a productive identity), farming (the farm building, the crop), and the ladybug — the first non-ant insect, a flying harvester. your first winged friend.",
      tag: "build",
    },
    {
      date: "2026-07-01",
      title: "y000 — the tutorial track opens",
      body: "the y-track begins: a hand-held ten-minute slice laid over the live systems, hard-reset on every launch, where gathering is emergent — you learn by watching the ant decide. a follow-cam lets you ride an ant through your own files. by nightfall it runs a true cold-open.",
      tag: "tutorial",
    },
    {
      date: "2026-07-02",
      title: "the playtest marathon",
      body: "the heaviest tutorial day — beats reshaped live against real play, dozens of iterations: directing taught inside the first empty folder, the leash re-ordered to answer a felt need, the deep dive restructured so you discover you're short before you mine. game-wide laws crystallize from friction: one ant = one carry = one unit; a leash dropped on a locked folder claims it.",
      tag: "tutorial",
    },
    {
      date: "2026-07-03",
      title: "y000 reaches selfTidy",
      body: "the tutorial now plays start through selfTidy: dig a room, build a maw and watch what it grows, and then the autonomy beat — a scrap seeded in the tunnel, every other option exhausted, and the forager tidies it unasked. 'you didn't ask. it did it anyway.' the demo's ending is locked the same day: a combat beat, then the curtain.",
      tag: "tutorial",
    },
    {
      date: "2026-07-04",
      title: "files become ore",
      body: "the heftForage beat lands in the tutorial: real files read as ore of four kinds, gathered by band. what your disk is made of becomes something the colony can want.",
      tag: "tutorial",
    },
    {
      date: "2026-07-04",
      title: "the style hunt — the folder is done",
      body: "a marathon of sittings births the game's next visual generation: a floating glass window over the desktop, a true-3d modeled ant pre-rendered to 8 pixel views, silhouette shadows as law, everything standing — and, after six generations of rejected gates, the folder becomes a standing pixel door: 18 designs, 3 per biome, at full craft. the deep's doors alone never leak light.",
      tag: "art",
    },
    {
      date: "2026-07-05",
      title: "the first goddess has a face",
      body: "itRedeth's full-body sprite locks — the first of the 42 powers rendered, translucent robes and six amber orbs against a glyph-ring seal. she takes over this site's landing the same day; the other 41 stay sealed in the codex.",
      tag: "art",
    },
    {
      date: "2026-07-05",
      title: "the website reborn as the glass",
      body: "this site grows from a single roadmap page into a full hub — hub, roadMap, timeLine, codex — wearing the game's next visual generation: cold slate, milky frost, etched ui, amber the one light. the codex ships sealed-first: 42 plates in asemic marks, unsealing here as the game reveals them.",
      tag: "site",
    },
  ],
};
