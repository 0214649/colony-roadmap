/* ============================================================
   colony — asset manifest (THE law: no page hardcodes a sprite path)
   ------------------------------------------------------------
   logical name → file path. Swapping a sprite = drop the new
   file in assets/ + repoint ONE line here; every page updates.
   ============================================================ */

const COLONY_ASSETS = {
  logo:     "logo.svg",
  itredeth: "assets/itredeth-sprite.png",   // the first goddess, LOCKED 2026-07-05
  // THE ANT — the locked modeled-ant pipeline, exported from the style card:
  // 8 pre-rendered headings (cols, 0=up, clockwise 45°) × 4 gait frames (rows)
  antSheet: { src: "assets/ant-sheet.png", cw: 28, ch: 26, dirs: 8, frames: 4 },
  // coming as they are exported from the locked procedural pipelines:
  // ladybug, termite, doors (18), bush, finds rail…
};
