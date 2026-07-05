/* ============================================================
   colony — asset manifest (THE law: no page hardcodes a sprite path)
   ------------------------------------------------------------
   logical name → file path. Swapping a sprite = drop the new
   file in assets/ + repoint ONE line here; every page updates.
   ============================================================ */

const COLONY_ASSETS = {
  logo:     "logo.svg",
  itredeth: "assets/itredeth-sprite.png",   // the first goddess, LOCKED 2026-07-05
  // coming as they are exported from the locked procedural pipelines:
  // ant, ladybug, termite, doors (18), bush, finds rail…
};
