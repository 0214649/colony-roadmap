/* ============================================================
   colony — the w ledger (every artifact render, numbered)
   ------------------------------------------------------------
   THIS is the file you edit when a new wXXX ships.
   One entry = one iteration: { w, date, title, note, img? }.
   img = a key under assets/w/ (drop the screenshot there too).
   These are NOT evolutive — they are iterations of how we use
   the artifact to render things for ourselves; rejects are
   witnesses, not failures. w001–w020 predate the w-naming
   (the hunt's first sitting); w021–w030 predate the git record
   (their renders live in the artifact's version history).
   ============================================================ */

const WLEDGER_DATA = {
  note: "cards 1–20 predate the w-naming · w021–w030 predate the git record — their renders live only in the artifact's version picker.",
  entries: [
    { w: "w021", date: "2026-07-04", title: "the true-perspective pivot", note: "first hand-rolled 3d renderer: 27°/50° camera, glass-grown monoliths, ¾-front chibi ant — 'closer, but not there'." },
    { w: "w022", date: "2026-07-04", title: "38° and four forms", note: "38° default camera, smaller monoliths, four monolith forms + transparency — all four rejected; fullscreen dies: the product is a floating window." },
    { w: "w023", date: "2026-07-04", title: "the window locks", note: "window-on-desk compositor, milky frost, dynamic 8-heading ants — WINDOW + FROST RECIPE + ETCHED UI lock." },
    { w: "w024", date: "2026-07-04", title: "ants stand up", note: "two-layer standing ants (legs flat, body raised) + tabbed-folder icons grown from frost — the folder material becomes an open question." },
    { w: "w025", date: "2026-07-04", title: "paper-mario ants", note: "upright cutout ants + standing pages + the folder material strip (frost / manila / chitin / light) — 'better but not as good'." },
    { w: "w026", date: "2026-07-04", title: "the modeled ant, almost", note: "true-3d ant model pre-rendered to 8 pixel views at the camera's own pitch — 'ALMOST it'; pixel-textured folder boxes rejected." },
    { w: "w027", date: "2026-07-04", title: "THE ANT LOCKS", note: "clip fixed, feet-row anchoring — the modeled-ant pipeline becomes THE colony ant." },
    { w: "w028", date: "2026-07-04", title: "the ladybug + the hunt", note: "the ladybug through the locked pipeline + the folder reference hunt: five territories, six directions." },
    { w: "w029", date: "2026-07-04", title: "the silhouette-shadow law", note: "every light casts the sprite's own shape — 'the secret to hd-2d'; four rendered folder candidates rejected." },
    { w: "w030", date: "2026-07-04", title: "the biome suns + the cave idea", note: "a top light per biome, the five-sun strip, camera sway removed — and the cave-mouth folder idea is born mid-build." },
    { w: "w031", date: "2026-07-04", title: "the standing cave", note: "the cave mound rendered standing — the round mound rejected ('looks cheap'); THE STANDING LAW enters the record.", img: "w031" },
    { w: "w032", date: "2026-07-04", title: "caves + four busts", note: "standing cutout vs arched tunnel-mouth across the biomes + itRedeth's four symbolic busts — all dead; 'keep digging the GATE style'.", img: "w032" },
    { w: "w033", date: "2026-07-04", title: "the gate IS the biome", note: "six constructions, zero props + the anime lineup ×3 — the gate law locks, executions 'less housy'.", img: "w033" },
    { w: "w034", date: "2026-07-04", title: "de-housed gates + the veiled god", note: "mass-around-a-mouth gates + the first full-body veiled itRedeth — 'idk' / 'cheap sketch'.", img: "w034" },
    { w: "w035", date: "2026-07-04", title: "the octopath gate", note: "true-3d mesh, 2d pixel textures, six biome skins — right tech, wrong shape.", img: "w035" },
    { w: "w036", date: "2026-07-04", title: "the shape lineup", note: "dolmen / arch / portal / mound on the locked textured-3d pipeline — 'too random'; the door pivot follows.", img: "w036" },
    { w: "w037", date: "2026-07-04", title: "THE DOORS", note: "the folder is a standing pixel door, twelve styles — 'this is very good'; + the ladybug NaN fix (she had never drawn since w031).", img: "w037" },
    { w: "w038", date: "2026-07-04", title: "the 20-door roster", note: "3 doors per biome + two mix doors — the 18 keep, the mixes die.", img: "w038" },
    { w: "w039", date: "2026-07-04", title: "the inspection sheet", note: "18 doors at ×6 for door-by-door pointing — 'polish all of them evenly'.", img: "w039" },
    { w: "w040", date: "2026-07-04", title: "the even polish pass", note: "one craft pass across the roster (grain · chisel · spall · kiss) — 'more texture; look at how good the ANT looks'.", img: "w040" },
    { w: "w041", date: "2026-07-04", title: "the volume pass", note: "silhouette-aware banded form shading — 'wrong kind of shading' → 'i want BETTER SPRITES'.", img: "w041" },
    { w: "w042", date: "2026-07-04", title: "THE BAR", note: "the millstone proof sprite at 96×120 full craft — 'yes: rebuild all 18 to this'. the door craft law.", img: "w042" },
    { w: "w043", date: "2026-07-04", title: "hd roster, batch 1", note: "fields + frontier trios at the bar; the doorHDR registry.", img: "w043" },
    { w: "w044", date: "2026-07-04", title: "the folder is done", note: "all 18 doors at the craft bar + the doors OPEN (leaf swings, interior glow, walker transit) — 'LOCK the roster'.", img: "w044" },
    { w: "w045", date: "2026-07-04", title: "the living layer", note: "the bush (the box is dead), the stood finds, the bone-ledger typography pass.", img: "w045" },
    { w: "w046", date: "2026-07-04", title: "goddess take 1, first pass", note: "face + all tells landed; body a block-in below the bar. the card pruned of stale sections.", img: "w046" },
    { w: "w047", date: "2026-07-04", title: "goddess take 1, modeled", note: "bodice as a twisted cylinder, skirt as four cloth planes, streaming hair lobes.", img: "w047" },
    { w: "w048", date: "2026-07-05", title: "three goddesses on the board", note: "the bride of the machine + the shrine-bride of copies join take 1 — the choosing set.", img: "w048" },
    { w: "w049", date: "2026-07-05", title: "THE GLASS rebuild", note: "itRedeth per the charadesign bible — 'weird cubist amalgamates' → the generation pipeline is born instead.", img: "w049" },
    { w: "w050", date: "2026-07-05", title: "the reader-law rail", note: "nine per-filetype finds, primal-shamanic → synthetic-mechanic, in axis order.", img: "w050" },
    { w: "w051", date: "2026-07-05", title: "the synthetic termite", note: "the y000 combat enemy through the locked 8-direction pipeline (+ the w051d machine-up).", img: "w051" },
    { w: "w052", date: "2026-07-05", title: "steel-mono + three laws", note: "one recolorable metal tint, sun silhouette shadows, metalSheen, the prompt deck — termite + laws LOCK.", img: "w052" },
    { w: "w053", date: "2026-07-05", title: "the quiet pass", note: "contact blobs + selection ring die (silhouette-only), files up, the font duel — INTER LOCKS.", img: "w053" },
    { w: "w054", date: "2026-07-05", title: "the hostess prompts", note: "itRedeth v5 prompt pair on the deck; the font duel retires from the card.", img: "w054" },
    { w: "w055", date: "2026-07-05", title: "the dialogue — her opening moment", note: "itRedeth manifests over the dimmed colony: aura, floating typewriter text, no box. the dialogue iterations join the w count here.", img: "w055" },
    { w: "w056", date: "2026-07-05", title: "dialogue — the name melts", note: "her name arrives archaic and glyph-melts into itRedeth; the colony stays alive behind her.", img: "w056" },
    { w: "w057", date: "2026-07-05", title: "dialogue — the canon naming", note: "se þe rædaþ, per the vault: the naming line melts on the label and the spoken text at once; the gloss line joins per the codex schema.", img: "w057" },
  ],
};
