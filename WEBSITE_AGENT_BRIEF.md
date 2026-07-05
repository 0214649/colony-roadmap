# WEBSITE AGENT — briefing (read fully before building)

You are the agent (running **ultra fable 5 / ultracode**) that reworks the **COLONY website**.
dirty rat wants the current single-page roadmap grown into a genuine,
well-designed, modular site. Read the `colony-website` skill in
`.claude/skills/colony-website/SKILL.md` FIRST — it is the law for how you build. Then read
this for the concrete spec.

## Read before starting
- `.claude/skills/colony-website/SKILL.md` (the prime law: data-driven, modular, the security
  rule, bible lockstep).
- The current site: `index.html` + `data.js` + `CLAUDE.md` + `UPDATING.md` here.
- `~/.claude/memory/MEMORY.md` → `project_colony_visual.md` (the whole visual hunt + sprites).
- The design bible `~/colony/colony-design/design-bible.md` (the source of truth for content).
- The sprites we've built, in `~/colony/y000-play/stylehunt/gen-candidates/` (itRedeth:
  `itredeth-sprite.png`) and the procedural creatures in the game/style card.

## What to build (the spec, in dirty rat's words)
### PUBLIC (no password)
1. **A hub / landing page** — the default view is a **brief presentation of the game** (what
   COLONY is). From the hub you navigate to the other tabs.
2. **Tabs:** **roadMap** (the existing content, ported into the new shell) · **timeline** (the
   project's evolution as dated events) · **presentation** (the pitch; may live on the hub by
   default).
3. **A public codex page** — an **ARCHAIC form of the codex exists there FIRST** (asemic /
   archaic marks, entries sealed), and **as we reveal codex entries in the game we add the
   revealed ones here.** This mirrors the in-game comprehension-reveal (bible §9 "the codex IS
   the progression tree"). Data-driven: each entry has a `locked → revealed` state.
4. **Use the sprites we built** (via the asset manifest — see the skill). Make swapping an old
   sprite for a new one trivial (drop file + repoint manifest). Build it **evolutive + modular**
   so we keep swapping sprites and revealing entries as the game grows.

### PRIVATE (password-gated)
5. **The design bible, redesigned to look like an OLD MANUSCRIPT** — a beautiful rendering of
   `colony-design/design-bible.md`.
6. **Heroes & artifacts, with a timeline** — also password-gated.
   - ⚠ **SECURITY (do not skip):** a JS password on a public Pages site does NOT hide content —
     see the skill. Store private content as **client-side-encrypted blobs** (password = key),
     never plaintext. **Confirm this approach + which password(s) with dirty rat before building
     the private pages.**

### VISUAL IDENTITY
7. **Rework the whole website UI / visual identity — make it a genuinely good website.** Keep it
   *of the game's world* (cold-world/warm-life, pixel creatures, archaic-codex feel). **Propose
   the new direction to dirty rat and get his nod before the big restyle commit.**

## How to work (dirty rat's standing style — obey)
- **Propose before big moves.** Confirm the visual-identity direction AND the password/security
  architecture with him before committing those. His verdicts are law.
- **Modular + data-driven** per the skill: every page reads a data file; adding content is a
  one-file change. No hardcoded content or sprite paths.
- **Don't over-run.** You have ultracode, but this is his site — build in reviewable phases
  (shell + hub → tabs → codex → private views → restyle), show him each, iterate.
- Keep **bible ↔ roadmap ↔ codex** in lockstep; dated changesets, flag-don't-erase.
- Commit + push without asking (repo convention); Pages redeploys in ~30s.

## LATER (separate asks — do NOT start until dirty rat says)
After the website is done, dirty rat will ask this same agent, in order:
1. **The PORT** — port the new pixel-art visuals / assets into the actual game.
2. **Optimize the whole game code** — performance is a **central pillar** (bible §1
   "low-resource is a load-bearing pillar"); a real optimization pass on the game.
Do not begin either until he explicitly asks.
