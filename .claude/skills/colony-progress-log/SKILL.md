---
name: colony-progress-log
description: THE LAW for logging every COLONY advancement onto the site so nothing goes untracked — a god progressed, an archetype/hero, a wNNN artifact, a design change. Load + FOLLOW whenever we finish or advance ANYTHING. Pairs with colony-website.
---

# colony progress log — track every advancement (dirty rat, 2026-07-05)

Every real advancement (a god gains/changes a face · an archetype or hero earns a page · a
wNNN artifact render · a design/lore change · a build milestone) gets logged **across the site
in the same pass**, so the whole project's progress is always visible and nothing drifts.
**This is a strict checklist — do the relevant rows every time, don't cherry-pick.**

## THE SIX PLACES (update the ones the advancement touches, together)
| place | file | when | entry |
|---|---|---|---|
| **codex** | `codex.js` (public) | a **god progresses** (face, design, reveal) | keep the god's entry **up to date** — flip `state:"locked"→"revealed"`, fill `call · gloss · seat · body · sprite`; update sprite/body as the design evolves. the codex mirrors comprehension — maintain it per-god. |
| **heroes** | `colony-design/heroes-artifacts.md` (vault → encrypted) | a god gains a **face**, or a colony **first** / figure earns a page | one `##` hero section: **name · era (dated) · face (sprite key) · body (lore)**. archetypes-with-faces + heroes both live here. |
| **w-ledger** | `wledger.js` (public) + `assets/w/wNNN.jpg` | every **artifact render** (a mock, style card, dialogue frame, anything rendered *for us*) | one line `{ w, date, title, note, img? }` + drop the screenshot. rejects are witnesses, not failures. |
| **timeline** | `timeline.js` (public) | any dated milestone | `{ date, title, body, tag }` — tags: concept · cosmology · build · tutorial · art · site (new tags just work). |
| **roadMap (the brief)** | `data.js` (public) | progress on any chamber | add/adjust the chamber's item(s) = **the brief** of what advanced, and bump `shards`. NEVER hand-edit totals/bars/status — they auto-compute. |
| **manuscript** | `colony-design/design-bible.md` (vault → encrypted) | design **depth** changed (new canon/lore/decision) | a **dated changeset**; FLAG superseded text, never erase (bible-history discipline). **the bible IS the manuscript.** |

Litmus (from colony-website): each row is a **one-file, near-one-line change**. If it sprawls,
the structure's wrong.

## UPDATE MECHANICS
- **Public files** (`data.js` · `timeline.js` · `codex.js` · `wledger.js` · `assets.js`): edit →
  commit → push. **Bump `SITE_V` in `index.html`** if any `.js`/`.css` changed (Pages caches 10 min;
  `SITE.asset()` stamps `?v=SITE_V` so a sprite swap actually busts). Pages redeploys ~30s.
- **Private (vault) files** (`design-bible.md` = manuscript · `heroes-artifacts.md` = heroes): edit
  the vault in **`~/colony/colony-design`** (commit+push there) → then **re-encrypt**:
  `COLONY_PASS='<the passphrase>' node tools/encrypt.mjs` (run in colony-roadmap) → commit the
  regenerated `private/*.enc.js`. **PLAINTEXT NEVER ENTERS colony-roadmap.** One Claude-minted
  passphrase for both rooms (in Claude memory + with dirty rat; never in the repo). A vault edit
  WITHOUT the re-encrypt leaves the site stale — always do both.
- **Sprites**: new/updated sprite → drop the file under `assets/`, repoint `assets.js` (logical
  name → path). **NEVER hardcode a sprite path in a page.**

## THE AESTHETIC — LOWERCASE HOUSE VOICE (strict, dirty rat)
All prose/titles/labels are **lowercase**. **The ONLY things that keep case:**
- **camelCase** names (antHill · royalSuite · broodAnt · itRedeth · itYoketh · itEfneth)
- **god names** & OE forms (`se þe rædaþ`), **acronyms** (UI · PC · HD-2D), **proper nouns**
  (Electron · Windows · Midjourney · Hades), **THE GLASS** (the identity), **vNNN / wNNN** ids.
- Everything else — headlines, status tokens, notes — is lowercase. No shouting caps.
When in doubt, lowercase it. (A wrongly-uppercased word is a bug; the site has been swept for these.)

## CONCURRENCY — a website agent shares colony-roadmap
Another Claude agent works this repo (doors/props/files, the hub, the codex, the glass dialogue).
So: **`git pull` FIRST, every time.** Edits are **append-only** — add your rows, never rewrite or
reorder its work. **Don't double-log what the agent owns** (dirty rat: the agent carries the glass
dialogue — don't add that wNNN). If a change would touch its live layout/template work, coordinate
or leave it. Commit only your own lines.

## THE FLOW (every advancement)
1. `git pull` (colony-roadmap AND the vault).
2. Log the relevant rows from the table (codex · heroes · w · timeline · brief · manuscript).
3. Public files → commit + push (+ `SITE_V` bump if js/css). Vault files → commit in vault, then
   re-encrypt → commit the blobs.
4. Everything lowercase but the case-keepers. Nothing advances without a line somewhere.
