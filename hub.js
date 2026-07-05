/* ============================================================
   colony — hub data (the presentation / the game pitch)
   ------------------------------------------------------------
   THIS is the file you edit to change what the hub says.
   The hub template (tab-hub.js) renders it; itRedeth delivers it.
   ============================================================ */

const HUB_DATA = {
  // the name melt: her old-tongue call resolves into the legible name
  call:  "se þe rædaþ",
  name:  "itRedeth",
  gloss: "bridge · read · lens",

  // her greeting — cryptic-warm, addressed to the visitor
  greeting: [
    "welcome. you found the glass.",
    "i will speak for the colony — it is small, and busy, and it does not know you are watching.",
    "everything here was translated for you. almost everything.",
  ],

  // the pitch blocks (frost panels, 2 per row)
  blocks: [
    {
      k: "the game",
      t: "an ant colony lives on your pc",
      p: "colony is an idle · incremental game where an ant colony settles into your <b>real file system</b> — it forages your actual folders, builds chambers, grows, and genuinely tidies your files. the desktop is the terrarium.",
    },
    {
      k: "triple dopamine",
      t: "watch · ambient · useful",
      p: "a colony to watch, pikmin-style. a creature that lives quietly on your pc for weeks. a cleaner that actually organizes your real files. three pleasures, one loop.",
    },
    {
      k: "the loop",
      t: "forage → grow → expand → descend",
      p: "ants chip empty folders into shard ▽ and haul them home. spend shard to claim new territory. descend — deeper folders are stranger, and the descent is the horror gradient.",
    },
    {
      k: "beneath",
      t: "a cosmology you deduce, never get told",
      p: "42 powers turn under the surface, read through one glass. nothing is explained; comprehension is translation — and reading the story <b>is</b> the skill tree.",
    },
    {
      k: "trust",
      t: "your files never move without consent",
      p: "territory is granted folder by folder. real files are never deleted — every action is previewed, logged, reversible. the colony asks before it touches.",
    },
    {
      k: "the law",
      t: "low-resource, or not at all",
      p: "colony runs for weeks alongside your real work, so idle-cheap is a design law, not an optimization. windows-first. a solo project, built rule by rule.",
    },
  ],

  // the explore row (tab cards; counts are computed live by the template)
  explore: [
    { tab: "roadMap",  p: "the live dig ledger — every chamber of the design, depth counted in shard ▽." },
    { tab: "timeLine", p: "how the colony grew — the project's evolution as dated events." },
    { tab: "codex",    p: "the 42 — the read ones legible, the rest sealed in the old tongue." },
  ],
};
