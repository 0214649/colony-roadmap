/* ============================================================
   colony — public codex data (the 42, sealed first)
   ------------------------------------------------------------
   One entry per power. Each starts state:"locked" (asemic marks,
   stable per slot). REVEALING an entry = flip its state to
   "revealed" and fill the fields — a one-entry change:
     { id:"g07", state:"revealed",
       call:"it…eth",                  // the legible name (se þe …aþ → it…eth)
       gloss:["…","…"], body:"…",
       sprite:"assetKey" }             // sprite = a COLONY_ASSETS key
   Fields not yet revealed simply stay absent (locked = asemic).
   Copy real content in ONLY when the game has revealed it.
   Mirrors the in-game comprehension reveal (the codex IS the
   progression tree). Do not pre-fill entries the game hasn't shown.
   ============================================================ */

const CODEX_DATA = {
  // 36 grid powers + 6 wildcards = 42. ids are slot handles, not names.
  entries: Array.from({ length: 42 }, function (_, i) {
    return { id: "g" + String(i + 1).padStart(2, "0"), state: "locked" };
  }),
};
