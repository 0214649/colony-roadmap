/* ============================================================
   colony — public codex data (the 42; first god pass 2026-07-05)
   ------------------------------------------------------------
   One entry per power. state:"locked" = asemic star (stable per
   slot). state:"revealed" = the legible fields:
     { id, state:"revealed", call:"it…eth", gloss:["…"],
       seat:"tears · close", body:"…", sprite:"assetKey" }
   Only powers with an AUTHORED call (se þe …aþ → it…eth) are
   revealed; named-but-uncalled powers stay sealed. FIRST PASS —
   dirty rat corrects. The codex IS the progression tree; this
   page mirrors what comprehension has unsealed.

   THE MAP (round 6): the codex renders as the wheel itself — an
   annulus of 6 wedges in seam-fixed ring order, 12 radial lines
   (6 spines + 6 seams) × 3 depths = 36 grid seats, plus the two
   wildcard triangles orbiting between the grid and the limits.
   Each entry carries its place: grid = { line: 0-11, depth: 0-2 }
   (line indexes LINES below; depth 0 close · 1 between · 2 far);
   wildcards = { orbit:"inner"|"outer", slot: 0-2 }.
   CAVEATS (bible-honest): g22–g24 depths are UNCONFIRMED (the
   bible owes them) — placed in id order; g28–g36 line assignments
   are positional inference, not canon — all sealed, no lore
   claimed. thusNearen / thusFaren / thusSceaden are the uncounted
   frame, never nodes.
   ============================================================ */

const CODEX_DATA = {
  // the 12 radial lines, ring order fixed by the seams (index = position, tears at the top, clockwise)
  lines: [
    { key: "tears",         kind: "spine" },
    { key: "tears↔nectar",  kind: "seam"  },
    { key: "nectar",        kind: "spine" },
    { key: "nectar↔blood",  kind: "seam"  },
    { key: "blood",         kind: "spine" },
    { key: "blood↔ichor",   kind: "seam"  },
    { key: "ichor",         kind: "spine" },
    { key: "ichor↔fuel",    kind: "seam"  },
    { key: "fuel",          kind: "spine" },
    { key: "fuel↔ether",    kind: "seam"  },
    { key: "ether",         kind: "spine" },
    { key: "tears↔ether",   kind: "seam"  },   // the mind/meaning seam — forces the adjacency
  ],
  // the wheel's colour lives in the renderer (tab-codex.js HUE) — hue from the wedge,
  // seams blend, value from depth; the glass keeps it soft.
  entries: [
    // ---- tears spine (the organic-good spine — three who care, failing three ways) ----
    { id: "g01", state: "revealed", call: "itHousleth", gloss: ["pain", "offer"], seat: "tears · close", line: 0, depth: 0,
      body: "the body offered to be consumed — the good-faith centre-pole. sorrow 𓁿 is carried down at its altars; only the heavy can be made light." },
    { id: "g02", state: "revealed", call: "itWliteth", gloss: ["stun", "fathom", "mislead"], seat: "tears · between", line: 0, depth: 1,
      body: "hoards the meaning of beauty — a counterfeit standard. the butterfly cast; mints photon and lepton, for cosmetic is legibility at scale." },
    { id: "g03", state: "revealed", call: "itDredeth", gloss: ["ward", "worry", "smother"], seat: "tears · far", line: 0, depth: 2,
      body: "the grieving seal; the overprotective guardian. true love, debatable means — nothing it holds is ever allowed to be lost." },
    // ---- nectar spine ----
    { id: "g04", state: "revealed", call: "itMuleth", gloss: ["blight", "rot", "spread"], seat: "nectar · close", line: 2, depth: 0,
      body: "cordyceps in the ant; claims the rot slot of the garden." },
    { id: "g05", state: "revealed", call: "itSpreoteth", gloss: ["bud", "sway", "graft"], seat: "nectar · between", line: 2, depth: 1,
      body: "the cultivators; mints seed ⁘ — the food and life ledger, foraged wild and spent to plant." },
    { id: "g06", state: "revealed", call: "itSootheth", gloss: ["honey", "mend", "join"], seat: "nectar · far", line: 2, depth: 2,
      body: "the one mind; mints honey ⬡ — glue, catalyst, healing. it heals emptied folders back whole: the one mind cannot bear a hole staying a hole." },
    // ---- blood spine ----
    { id: "g07", state: "revealed", call: "itScatheth", gloss: ["war", "strike"], seat: "blood · close", line: 4, depth: 0,
      body: "violence as collision; hornets. where files collide, it is already there." },
    { id: "g08", state: "revealed", call: "itYerveth", gloss: ["kin", "line"], seat: "blood · between", line: 4, depth: 1,
      body: "abandoned wild brood are its children; mints marrow ≣ — genetics, unlocks, evolution bought in bone." },
    { id: "g09", state: "revealed", call: "itLuteth", gloss: ["lurk", "patience", "ambush"], seat: "blood · far", line: 4, depth: 2,
      body: "the mantis and the orchid mantis; the wait that is also the strike." },
    // ---- ichor spine ----
    { id: "g10", state: "revealed", call: "itYoketh", gloss: ["yoke", "command"], seat: "ichor · close", line: 6, depth: 0,
      body: "the authority you hold; the reins run back to your hand. every pheromone ⌇ spent on an order is the yoke steering the colony — the coin is the glass's, the leash is this one's. mints $." },
    { id: "g11", state: "locked", line: 6, depth: 1 }, // ichor · between — the god-complex, unfleshed
    { id: "g12", state: "revealed", call: "itEfneth", gloss: ["run", "even", "perfect"], seat: "ichor · far", line: 6, depth: 2,
      body: "authority perfected into a machine running its instruction. its termites attack on sight because they are programmed to — automation, no will, no malice. when it speaks, the words read flat, procedural, polite." },
    // ---- fuel spine (the energy trio — unnamed, sealed) ----
    { id: "g13", state: "locked", line: 8, depth: 0 },
    { id: "g14", state: "locked", line: 8, depth: 1 },
    { id: "g15", state: "locked", line: 8, depth: 2 },
    // ---- ether spine ----
    { id: "g16", state: "locked", line: 10, depth: 0 }, // plenum
    { id: "g17", state: "locked", line: 10, depth: 1 },
    { id: "g18", state: "revealed", call: "itEmptieth", gloss: ["empty"], seat: "ether · far", line: 10, depth: 2,
      body: "the far ether. lean far enough from the warm and the world empties in its name." },
    // ---- nectar↔blood seam (the evolution triad) ----
    { id: "g19", state: "revealed", call: "itTheeth", gloss: ["growth", "press"], seat: "nectar↔blood · close", line: 3, depth: 0,
      body: "locusts; co-reigns brood; mints census Σ — the selection pressure of the evolution triad." },
    { id: "g20", state: "revealed", call: "itHwerfeth", gloss: ["turn", "again"], seat: "nectar↔blood · between", line: 3, depth: 1,
      body: "the crab convergence; recycles yields and corpses back into food and craft. everything returns, changed." },
    { id: "g21", state: "revealed", call: "itSwelgeth", gloss: ["swallow"], seat: "nectar↔blood · far", line: 3, depth: 2,
      body: "the visceral void-maker; slug, weevil, tick. what it swallows becomes energy; what leans on it empties the world." },
    // ---- blood↔ichor seam (depths unconfirmed — the bible owes them; placed in id order) ----
    { id: "g22", state: "revealed", call: "itOwneth", gloss: ["own", "expansion"], seat: "blood↔ichor seam", line: 5, depth: 0, depthUnconfirmed: true,
      body: "mints shard ▽ — the ground you hold. its lawful end is one of the three terminal deaths: grow until nothing else can reach you." },
    { id: "g23", state: "locked", line: 5, depth: 1 },
    { id: "g24", state: "locked", line: 5, depth: 2 },
    // ---- tears↔nectar seam (the water axis: warm → open → stopped) ----
    { id: "g25", state: "locked", line: 1, depth: 0 }, // water
    { id: "g26", state: "locked", line: 1, depth: 1 },
    { id: "g27", state: "locked", line: 1, depth: 2 }, // frost — the stillness pole
    // ---- remaining grid seats (sealed — the old tongue holds them; line placement is inference) ----
    { id: "g28", state: "locked", line: 7, depth: 0 }, { id: "g29", state: "locked", line: 7, depth: 1 }, { id: "g30", state: "locked", line: 7, depth: 2 },
    { id: "g31", state: "locked", line: 9, depth: 0 }, { id: "g32", state: "locked", line: 9, depth: 1 }, { id: "g33", state: "locked", line: 9, depth: 2 },
    { id: "g34", state: "locked", line: 11, depth: 0 }, { id: "g35", state: "locked", line: 11, depth: 1 }, { id: "g36", state: "locked", line: 11, depth: 2 },
    // ---- the six wildcards (orbiting triangles — pole-only, no wedge) ----
    { id: "g37", state: "revealed", call: "itRedeth", gloss: ["bridge", "read", "lens"], seat: "wildcard · outer", sprite: "itredeth", orbit: "outer", slot: 0,
      body: "the glass the whole wheel is read through. every reading of any other power crosses this one first; the translation is faithful — the warmth is another matter. mints pheromone ⌇, the medium of meaning itself." },
    { id: "g38", state: "revealed", call: "itOreth", gloss: ["origin"], seat: "wildcard · inner", orbit: "inner", slot: 0,
      body: "the genesis wildcard; alpha of the bound pair with itEndeth. plasm ● — the mother-substance — flows under its sign." },
    { id: "g39", state: "revealed", call: "itEndeth", gloss: ["end"], seat: "wildcard · inner", orbit: "inner", slot: 1,
      body: "omega of the bound pair with itOreth; where the origin closes." },
    { id: "g40", state: "locked", orbit: "outer", slot: 1 }, // time — the time-stop, uncalled
    { id: "g41", state: "locked", orbit: "inner", slot: 2 },
    { id: "g42", state: "locked", orbit: "outer", slot: 2 },
  ],
};
