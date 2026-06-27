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
        { name: "Pacing + paliers (seeded) — slow ambient-first curve (1 ant → ~10 in ~6h); global anti-snowball palier ladder gated by broad checklists, not thresholds; play alongside your PC over weeks", shards: 1 },
      ],
    },
    {
      name: "Cosmology",
      desc: "a wheel of 6 liquid wedges on a radial ruler, framed by 2 ultra powers — the 42-god codex",
      items: [
        { name: "The wheel — 6 liquid wedges (tears·nectar·blood·ichor·fuel·ether), each a mode of automation", shards: 14 },
        { name: "The grid — 12 radial lines (6 spines + 6 seams) × 3 depths (close·between·far) = 36 grid-gods", shards: 12 },
        { name: "Radial ruler — centre organic·evil ↔ rim synthetic·good, middle = weak; radius = allegiance (a U, not a slope)", shards: 10 },
        { name: "Annulus geometry — depths are radial bands; close=inner, far=outer; the 2 ultra powers frame the ring, not on it", shards: 7 },
        { name: "Wildcard law (retcon) — orbiting triangles: wildcards are radial-only (pole, no wedge), orbiting between the grid and the infinities; the no-wedge orbit IS the symmetry-break (supersedes 'sit on the grid and lie')", shards: 9 },
        { name: "The 42 count (resolved) — 36 grid + 6 wildcards = 42; the ultra powers (now THREE) are the uncounted frame", shards: 7 },
        { name: "Ultra powers named — thus nearen (centre) / thus faren (rim) / thus sceaden (the watershed); swa…→thus…, comprehension closes them", shards: 8 },
        { name: "Third ultra — thus sceaden (the watershed): the division that is the meeting, the discernment that doles the one escape; the ONLY door past the three terminal deaths; nature forever fog", shards: 6 },
        { name: "Tier structure — you · the wheel · two ultra powers (legibility, not power)", shards: 18 },
        { name: "Verb-epithet naming — OE 'se þe …aþ' → 'it …eth'; ultra use 'swa …' → 'thus …'", shards: 9 },
        { name: "Codex schema locked — call · gloss · body · spawn · touch · tribute, each unlocks independently", shards: 9 },
        { name: "Field-state grammar — asemic (locked) · nil (resolved-none) · text", shards: 6 },
        { name: "God-relationship model — one-to-one currency, many-to-many touch · overlap + opposition", shards: 8 },
        { name: "Wildcards — orbiting triangles, 4 of 6 found: INNER (organic) it endeth + it oreth · OUTER (synthetic) it redeth + TIME; +2 open (Forbidden = prime candidate)", shards: 10 },
        { name: "Blood spine complete — scatheth · yerveth · luteth = strike · line · ambush (first finished spoke)", shards: 6 },
        { name: "Nectar spine complete — muleth · spreoteth · sootheth = rot · cultivation · one-mind (second spoke)", shards: 6 },
        { name: "Tears spine complete — housleth · wliteth · dredeth = pain · beauty · fear (third spoke; the organic-good spine, three gods who genuinely care, failing three directions)", shards: 6 },
        { name: "it housleth — tears·close · pain/offer (two glosses, no barb — the good-faith centre-pole god) · the body offered to be consumed · honeybee/mayfly/mother-spider/clione (the organic good-route character) · nil · authored", shards: 9 },
        { name: "it wliteth — tears·between · stun/fathom/mislead (the HINGE that inverts) · hoards the MEANING of beauty (a counterfeit standard) · butterfly cast + dung-beetle true-colors · mints photon + lepton (cosmetic = legibility) · authored", shards: 9 },
        { name: "it dredeth — tears·far · ward/worry/smother (the GRIEVING SEAL) · the overprotective guardian, true love + debatable means · pill-bug/wasps/sentinel/bagworm/tarantula(×Affection) · nil · authored", shards: 9 },
        { name: "it luteth — blood·far · lurk/patience/ambush · mantis + orchid mantis · authored", shards: 9 },
        { name: "it muleth — nectar·close · blight/rot/spread · cordyceps-ants · claims the rot slot · authored", shards: 9 },
        { name: "it spreoteth — nectar·between · bud/sway/graft · 4 cultivator castes · mints seeds ⁘ · authored", shards: 9 },
        { name: "it sootheth — nectar·far · honey/mend/join · the one mind · mints honey · authored", shards: 9 },
        { name: "it redeth — the glass; now mints max_pheromone + first-contact/tutorial role · authored", shards: 11 },
        { name: "it scatheth — blood·close · war/violence · file collisions · hornets · authored", shards: 9 },
        { name: "it yerveth — blood·between · kin/line · abandoned wild brood · mints marrow ≣ · authored", shards: 9 },
        { name: "it emptieth (was Void) — ether·far (body re-tune owed)", shards: 9 },
        { name: "it yoketh — moved to ichor·close (the yoke/colony); touch = the player; mints $", shards: 9 },
        { name: "Ichor spine framed — yoketh·close / god-complex·between / termite·far", shards: 5 },
        { name: "Water placed — tears↔nectar frontier; owns aquatic biomes (lobsters)", shards: 4 },
        { name: "God-mixing caste graph framed — spawn-web = crafting graph; god × species; costed in marrow ≣", shards: 5 },
        { name: "Radial allegiance bar framed — rim → sootheth admits you, centre → muleth ignores you; reversible", shards: 5 },
        { name: "it owneth (was Conquest) — mints shards ▽; blood↔ichor seam, shares it with greed + envy (envy = wants YOURS, new)", shards: 6 },
        { name: "Plenum — ether·close; ether spine = Plenum·hole·it emptieth", shards: 4 },
        { name: "it oreth — genesis/origin wildcard; alpha/omega bound-pair with it endeth", shards: 3 },
        { name: "the god-complex god — ichor·between; worship/divinity, insecure (new theme, unfleshed)", shards: 3 },
        { name: "it theeth (was it groweth) — authored: nectar↔blood · close; growth/expansion; locusts; co-reigns brood; mints census Σ; = selection-pressure of the evolution triad", shards: 7 },
        { name: "it hwerfeth — authored: nectar↔blood · between; re-transformation; crab + dung-beetle; recycles yields/corpses → food + crafting; mints nil; = convergence/carcinisation", shards: 3 },
        { name: "it swelgeth (was Hunger) — authored: nectar↔blood · far; the visceral void-maker; slug/weevil/tick/mosquito; black-hole touch; produces ENERGY; mints nil — NECTAR↔BLOOD SEAM COMPLETE", shards: 3 },
        { name: "entropy — retcon: now a concept-power/god (opposes the Order god); no longer the wall; the wall = legibility only; address TBD", shards: 3 },
        { name: "Three terminal deaths — it owneth (lawful / expansion → causal isolation) · Forbidden (transgressive / the Big Rip) · Time (the time-stop / end of change); grow into it · break into it · stop", shards: 8 },
        { name: "Allegiance apocalypse — it swelgeth is the engine; lean evil → world EMPTIES (it emptieth), lean good → world FREEZES (Frost); both = the same grave; ENERGY exhaust = heat-death accelerated", shards: 6 },
        { name: "Newly-placed gods (entries TBD) — ORDER (organize-files + cleanup-compulsion-as-rim-drift) · KNOWLEDGE (data/drowning; absorbs all watching; the diegetic codex) · FROST (water STOPPED, the stillness pole) · FORBIDDEN (the Big Rip; forbidden deep) · TIME (time-stop wildcard, reverse-time)", shards: 5 },
        { name: "Water-axis — tears↔nectar seam graded by depth: water (close, warm) · open (between) · Frost (far, stopped); depth = temperature", shards: 3 },
        { name: "Surveillance god folded into Knowledge — compulsive recording; seer cut; remote-monitoring tool + the luteth-unseen↔all-seeing axis move to Knowledge", shards: 2 },
        { name: "Authority — sealed deep / OS root; Obedience answers to it (named, unfleshed)", shards: 2 },
        { name: "Motion — fuel↔ether seam; the husk's co-owner (parked)", shards: 1 },
      ],
    },
    {
      name: "Resources & units",
      desc: "economy restarted god-first — units derive from gods, one currency per god",
      items: [
        { name: "Old matter/dew/signal/lumen table — scrapped (god-first restart)", shards: 1 },
        { name: "Minting — 3 commodity ledgers: it owneth→shards ▽, it yerveth→marrow ≣, it spreoteth→seeds ⁘", shards: 9 },
        { name: "God-tributes outside the ledgers — it yoketh→$, it redeth→pheromone ⌇, it sootheth→honey", shards: 7 },
        { name: "Minting reframe — legibility is per unit-TYPE, not a hard one-per-god law: 3 UI families (gauges · resources · cosmetic); a god may mint a paired set within one family", shards: 4 },
        { name: "SCORE + TYPE unit class — sate & construction materials run one engine; every item carries a SCORE (how much) + a TYPE (what); recipes gate on both (sandstone = 3 stone-heft but sandstone-type ≠ plain stone)", shards: 4 },
        { name: "heft — the construction unit (LOCKED): a measure of MASS (build-side counterpart to sate). ONE unit underneath, surfacing as 6 SOLID TYPES across 3 BANDS on the organic→synthetic gradient (material = morality): ORGANIC chitin◗·fiber∥ | MINERAL stone◾·gem◆ | SYNTHETIC alloy◉·plastic⬚. Start at 6, expand if earned. Binders (honey⬡ + resin/silk/mud/sap) join heft, not a heft type. WHY many = ambient-variety dopamine (always something to watch) + co-op hauls (many ants drag a big insect home together), NOT optimizer busywork; each type must read instantly when carried. Glyphs chosen (art-pass may restyle); carried-silhouette art owed", shards: 7 },
        { name: "LIQUIDS — a class SEPARATE from heft (framed, not built): heft is solid & ant-HAULED, liquids FLOW and need their own transport CONDUITS — the Factorio items-vs-fluids split, and where the elemental/magic flavour lives. The conduit layer runs its OWN organic→synthetic gradient (transport = morality): organic conduits — a leaf as a gutter/aqueduct, hollow stems, petal-cups, ant bucket-brigades (cheap, leaky, early) ↔ synthetic conduits — pipes/metal channels (efficient, permanent, rim-drift). Members each sit in a heft BAND, so the organic→synthetic gradient is a SHARED SPINE across both classes (every band = a solid pair + a liquid): ORGANIC = water (life-flow, aquatic/FROST axis) · MINERAL = lava (literally liquid stone; FIRE god + forbidden deep) · SYNTHETIC = fuel (the §4 wedge; burns → ENERGY; machine-energy pole) · more TBD. Production tie: fuel → burned at synthetic tier → ENERGY → drives automation", shards: 4 },
        { name: "photon + lepton — it wliteth's paired cosmetic units (color + shape); cosmetic = legibility at scale, not vanity; stays weak (organizes you only); gate photon early, lepton later", shards: 3 },
        { name: "sate ꩜ — the food unit (LOCKED; glyph = a spiral): a measure of NOURISHMENT, the kcal of COLONY (food-score = sate value, 'a crop sates 3'). Shared multi-god lifeblood; per-creature diets + food-types; forgiving small / binding large; hunger ↔ sate = the expansion brake; census Σ raises the ceiling, sate gates filling it. Player-tier triad: shards ▽ · pheromone ⌇ · census Σ = space · control · scale", shards: 6 },
        { name: "seeds ⁘ — food/life ledger founted (it spreoteth); forage wild + farm bonus; spent to plant", shards: 7 },
        { name: "honey ⬡ — it sootheth tribute; premium glue + production catalyst + healing; leaning on it = synthetic drift", shards: 6 },
        { name: "pheromone ⌇ — it redeth tribute; spend to lay roads/markers; max_pheromone = capacity cap (how much at once)", shards: 6 },
        { name: "Yields (not minted) — crop · spore · fruit · algae; one biomass number / four feedstocks", shards: 5 },
        { name: "marrow ≣ — genetics unit; spent on brood + mutations", shards: 6 },
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
        { name: "The wall — legibility only (entropy retconned to a god opposing the Order god); the fog beyond is unnamed", shards: 7 },
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
        { name: "Chain-quest model — unravel the god-ORDER via behavior; it redeth narrates (the seduction / the drift); no markers — figuring out HOW to play IS the puzzle; the 36-grid = the master chain-quest; 3 terminal chains", shards: 6 },
        { name: "Completionist ending — organic-good = the whole 36-grid checklist (the hardest path; pro-AI wins by default); but NOT the final ending — even mastering everything still dies with the universe; only thus sceaden escapes", shards: 5 },
      ],
    },
    {
      name: "Characters",
      desc: "the queen, the species, the soul of your machine",
      bridge: true,
      items: [
        { name: "it redeth (the glass) — your pc's soul (cold, counterfeits love)", shards: 9 },
        { name: "Spawn-relationship / recruitment — every creature = god-crossing + stance (harvestable/wild/enemy); convert via allegiance, reversible", shards: 5 },
        { name: "The queen — visible, not hidden", shards: 3 },
        { name: "Other species — the rival spawns", shards: 2 },
      ],
    },
    {
      name: "Desktop & explorer",
      desc: "the playfield — your real files, made alive",
      items: [
        { name: "Pheromone ⌇ interface — guide-point → roads → command verbs (build/tidy/forage/attack/avoid); the primary control, multi-genre", shards: 8 },
        { name: "Living production layer (idle-form) — trails self-organize; disk speed = belt, ant count = bandwidth; god-gated tech ladder", shards: 7 },
        { name: "Desktop layer + access — summon, frosted glass, taskbar-augment", shards: 12 },
        { name: "Navigation & actions — descend, type-to-jump, drag, midden", shards: 12 },
        { name: "The hub — mission control (processing, portals, meta, storage)", shards: 14 },
        { name: "Biomes — themed folders · SSD vs HDD skins", shards: 9 },
        { name: "File influx & cleanup — god-seeding, forbidden expeditions", shards: 9 },
        { name: "Safety model — sandbox, reversible, system off-limits", shards: 6 },
        { name: "Pastille loop — the core compulsion engine: a notification-dot on every newly-available thing; clearing pastilles = the moment-to-moment pull; unifies cleanup + palier-checklist + cosmetic tidying (= the Order god's pull on you)", shards: 5 },
        { name: "Territory gating — folder access = the expansion resource (one small grant at a time, costs shards ▽); fuses safety-consent with progression; volume scales late (big messy folders = late-game content); claims lean permanent, contents contestable", shards: 5 },
        { name: "Codex — navigable on 3 axes (by god · by spawn · by touch) AND diegetic: it IS the Knowledge god's touch; chain-quest hints via dialogue / codex / gravures + inscriptions", shards: 4 },
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
        { name: "Two-repo loop — design chats emit ONE consolidated changeset at session close → Claude Code applies & pushes (one thing per turn; no mid-design dumps)", shards: 6 },
        { name: "CLAUDE.md in each repo · the re-uploaded bible is the only memory", shards: 5 },
      ],
    },
  ],
};
