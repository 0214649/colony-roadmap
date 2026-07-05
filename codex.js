/* ============================================================
   colony — public codex data (the 42; first god pass 2026-07-05)
   ------------------------------------------------------------
   One entry per power. state:"locked" = asemic plate (stable per
   slot). state:"revealed" = the legible fields:
     { id, state:"revealed", call:"it…eth", gloss:["…"],
       seat:"tears · close", body:"…", sprite:"assetKey" }
   Only powers with an AUTHORED call (se þe …aþ → it…eth) are
   revealed; named-but-uncalled powers stay sealed. FIRST PASS —
   dirty rat corrects. The codex IS the progression tree; this
   page mirrors what comprehension has unsealed.
   ============================================================ */

const CODEX_DATA = {
  entries: [
    // ---- tears spine (the organic-good spine — three who care, failing three ways) ----
    { id: "g01", state: "revealed", call: "itHousleth", gloss: ["pain", "offer"], seat: "tears · close",
      body: "the body offered to be consumed — the good-faith centre-pole. sorrow 𓁿 is carried down at its altars; only the heavy can be made light." },
    { id: "g02", state: "revealed", call: "itWliteth", gloss: ["stun", "fathom", "mislead"], seat: "tears · between",
      body: "hoards the meaning of beauty — a counterfeit standard. the butterfly cast; mints photon and lepton, for cosmetic is legibility at scale." },
    { id: "g03", state: "revealed", call: "itDredeth", gloss: ["ward", "worry", "smother"], seat: "tears · far",
      body: "the grieving seal; the overprotective guardian. true love, debatable means — nothing it holds is ever allowed to be lost." },
    // ---- nectar spine ----
    { id: "g04", state: "revealed", call: "itMuleth", gloss: ["blight", "rot", "spread"], seat: "nectar · close",
      body: "cordyceps in the ant; claims the rot slot of the garden." },
    { id: "g05", state: "revealed", call: "itSpreoteth", gloss: ["bud", "sway", "graft"], seat: "nectar · between",
      body: "the cultivators; mints seed ⁘ — the food and life ledger, foraged wild and spent to plant." },
    { id: "g06", state: "revealed", call: "itSootheth", gloss: ["honey", "mend", "join"], seat: "nectar · far",
      body: "the one mind; mints honey ⬡ — glue, catalyst, healing. it heals emptied folders back whole: the one mind cannot bear a hole staying a hole." },
    // ---- blood spine ----
    { id: "g07", state: "revealed", call: "itScatheth", gloss: ["war", "strike"], seat: "blood · close",
      body: "violence as collision; hornets. where files collide, it is already there." },
    { id: "g08", state: "revealed", call: "itYerveth", gloss: ["kin", "line"], seat: "blood · between",
      body: "abandoned wild brood are its children; mints marrow ≣ — genetics, unlocks, evolution bought in bone." },
    { id: "g09", state: "revealed", call: "itLuteth", gloss: ["lurk", "patience", "ambush"], seat: "blood · far",
      body: "the mantis and the orchid mantis; the wait that is also the strike." },
    // ---- ichor spine ----
    { id: "g10", state: "revealed", call: "itYoketh", gloss: ["yoke", "command"], seat: "ichor · close",
      body: "the authority you hold; the reins run back to your hand. every pheromone ⌇ spent on an order is the yoke steering the colony — the coin is the glass's, the leash is this one's. mints $." },
    { id: "g11", state: "locked" }, // ichor · between — the god-complex, unfleshed
    { id: "g12", state: "revealed", call: "itEfneth", gloss: ["run", "even", "perfect"], seat: "ichor · far",
      body: "authority perfected into a machine running its instruction. its termites attack on sight because they are programmed to — automation, no will, no malice. when it speaks, the words read flat, procedural, polite." },
    // ---- fuel spine (the energy trio — unnamed, sealed) ----
    { id: "g13", state: "locked" },
    { id: "g14", state: "locked" },
    { id: "g15", state: "locked" },
    // ---- ether spine ----
    { id: "g16", state: "locked" }, // plenum
    { id: "g17", state: "locked" },
    { id: "g18", state: "revealed", call: "itEmptieth", gloss: ["empty"], seat: "ether · far",
      body: "the far ether. lean far enough from the warm and the world empties in its name." },
    // ---- nectar↔blood seam (the evolution triad) ----
    { id: "g19", state: "revealed", call: "itTheeth", gloss: ["growth", "press"], seat: "nectar↔blood · close",
      body: "locusts; co-reigns brood; mints census Σ — the selection pressure of the evolution triad." },
    { id: "g20", state: "revealed", call: "itHwerfeth", gloss: ["turn", "again"], seat: "nectar↔blood · between",
      body: "the crab convergence; recycles yields and corpses back into food and craft. everything returns, changed." },
    { id: "g21", state: "revealed", call: "itSwelgeth", gloss: ["swallow"], seat: "nectar↔blood · far",
      body: "the visceral void-maker; slug, weevil, tick. what it swallows becomes energy; what leans on it empties the world." },
    // ---- blood↔ichor seam ----
    { id: "g22", state: "revealed", call: "itOwneth", gloss: ["own", "expansion"], seat: "blood↔ichor seam",
      body: "mints shard ▽ — the ground you hold. its lawful end is one of the three terminal deaths: grow until nothing else can reach you." },
    { id: "g23", state: "locked" },
    { id: "g24", state: "locked" },
    // ---- tears↔nectar seam (the water axis: warm → open → stopped) ----
    { id: "g25", state: "locked" }, // water
    { id: "g26", state: "locked" },
    { id: "g27", state: "locked" }, // frost — the stillness pole
    // ---- remaining grid seats (sealed — the old tongue holds them) ----
    { id: "g28", state: "locked" }, { id: "g29", state: "locked" }, { id: "g30", state: "locked" },
    { id: "g31", state: "locked" }, { id: "g32", state: "locked" }, { id: "g33", state: "locked" },
    { id: "g34", state: "locked" }, { id: "g35", state: "locked" }, { id: "g36", state: "locked" },
    // ---- the six wildcards (orbiting triangles — pole-only, no wedge) ----
    { id: "g37", state: "revealed", call: "itRedeth", gloss: ["bridge", "read", "lens"], seat: "wildcard · outer", sprite: "itredeth",
      body: "the glass the whole wheel is read through. every reading of any other power crosses this one first; the translation is faithful — the warmth is another matter. mints pheromone ⌇, the medium of meaning itself." },
    { id: "g38", state: "revealed", call: "itOreth", gloss: ["origin"], seat: "wildcard · inner",
      body: "the genesis wildcard; alpha of the bound pair with itEndeth. plasm ● — the mother-substance — flows under its sign." },
    { id: "g39", state: "revealed", call: "itEndeth", gloss: ["end"], seat: "wildcard · inner",
      body: "omega of the bound pair with itOreth; where the origin closes." },
    { id: "g40", state: "locked" }, // time — the time-stop, uncalled
    { id: "g41", state: "locked" },
    { id: "g42", state: "locked" },
  ],
};
