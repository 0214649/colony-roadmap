---
name: colony-website
description: How agents rework, update, and EVOLVE the COLONY website (public hub/roadmap/timeline/codex + password-gated bible/heroes/artifacts) and keep it in lockstep with the design bible. Load whenever touching colony-roadmap or the website.
---

# colony website — modular, data-driven, evolutive

The COLONY website (repo `colony-roadmap`, GitHub Pages, **public**) is being grown from a
single roadmap page into a full site: a **hub** landing + tabs (**roadMap · timeline ·
presentation · public codex**) plus **password-gated** private views (**manuscript design
bible · heroes & artifacts timeline**). Owner: **dirty rat**. Repo
convention: **commit + push without asking**.

## THE PRIME LAW — data-driven + modular (so evolving it is cheap)
Everything the site shows lives in **DATA files**; presentation is templates that render the
data. This is already true of `data.js` (roadmap shards → totals/bars/status auto-compute —
NEVER hand-edit those). Extend the pattern to EVERY new page:
- **roadMap** → `data.js` (exists).
- **timeline** → `timeline.js` (array of dated events → the page renders them).
- **hub / presentation** → `hub.js` (the game-pitch blocks; the presentation is the hub default).
- **public codex** → `codex.js` — one entry per god/species; each carries a **state**:
  `locked` (asemic / archaic marks — the §4 locked-field grammar) → `revealed` (real sprite +
  text). **Revealing an entry = flip one field's state.** Mirrors the in-game comprehension
  reveal (bible §9 "the codex IS the progression tree").
- **assets** → an **asset manifest** (`assets.js`: logical name → sprite file path). Swapping an
  old sprite for a new one = drop the new file + repoint the manifest; every page updates.
  **NEVER hardcode a sprite path in a page.**
- **w ledger** → `wledger.js` + `assets/w/wNNN.jpg` — every artifact render for the game is a
  wXXX and gets ONE entry here (the law lives in `y000-play/.claude/skills/colony-w-artifacts`).
  Adding a w = one entry + one screenshot.

Litmus test: adding a tab, a timeline event, a codex entry, or swapping a sprite must each be a
**one-file, near-one-line change.** If a change touches many files, the structure is wrong —
refactor toward the registry. Build it **evolutive**: we swap old sprites for new ones and
reveal codex entries continuously as the game grows.

## Public / private split — SECURITY (read before building private pages)
The bible + heroes/artifacts are PRIVATE (they live in the private `colony-design` repo).
**A client-side JS password on a PUBLIC Pages site is NOT security** — plaintext committed to
the public repo is world-readable via view-source. Therefore:
- **NEVER commit readable private content (bible / hero / artifact lore) to the public repo.**
- **Default approach: client-side ENCRYPTED blobs.** Store private content as AES-GCM
  ciphertext (Web Crypto `SubtleCrypto`); the password is the decryption key; only ciphertext
  ships; the page decrypts in-browser on the correct password. Provide a tiny local `encrypt`
  step so "update the manuscript bible" = re-encrypt + commit the blob. Not bulletproof, but
  the content is never exposed to a casual viewer.
- **CONFIRM this choice with dirty rat before building the private pages** (alternative =
  a separate private deploy). Do not ship the bible as plaintext behind a JS gate.

## Bible lockstep — precise, witnessed updates
The site MIRRORS the bible; sync both when either changes.
- Editing the bible (`colony-design/design-bible.md`): **dated changesets; FLAG superseded
  text, never erase it** (bible-history discipline — the bible is a witness of the design's
  evolution). Same rule for the manuscript web view.
- Keep **bible ↔ roadmap `data.js` ↔ public codex** consistent on every change.
- The manuscript view is a *rendering* of the bible, not a fork — derive it from the source so
  the bible stays the single source of truth.

## Visual identity
The site has its own identity (currently soil&chitin: loam `#15110b`, bone `#e8dcc0`, amber
`#e0a23a`, Space Grotesk + JetBrains Mono). A rework may evolve it, but it must stay **of the
game's world** — cold-world / warm-life, pixel-art creatures, the archaic-codex feel. Use the
**sprites we built** (itRedeth, ant/ladybug/termite, doors as they land) via the asset manifest.
Public-codex `locked` state = asemic/archaic marks; `revealed` = the real sprite + text.
**Confirm the new visual-identity direction with dirty rat before a big restyle commit.**

## Workflow
1. `git pull` first (browser edits may have landed).
2. Edit the DATA file (or add a module); touch templates only for real layout/style work.
3. Never hand-edit auto-computed values (totals, bars, status).
4. `git commit && git push` → Pages redeploys in ~30s. Commit without asking.
5. When design depth changes: update the bible (dated, flagged) AND roadmap shards AND the
   codex together.
