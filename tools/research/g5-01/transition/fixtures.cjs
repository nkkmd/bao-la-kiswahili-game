"use strict";
const F = require("../../../takasia/fixtures.json");
const known = require("../../../engineering/browser/pbai-p9/fixtures.json").rows;
function blank(phase = "mtaji") {
  return { pits: Array.from({ length: 2 }, () => [Array(8).fill(0), Array(8).fill(0)]),
    reserve: phase === "namua" ? [10, 10] : [0, 0], houseOwned: [false, false],
    player: 0, phase, winner: null, reason: "", turn: 1, pending: [0, 0], takasia: null };
}
function constructed() {
  const rows = [], add = (id, state) => rows.push({ id, state, evidenceClass: "TECHNICAL-CONSTRUCTED" });
  let s = blank("namua"); s.reserve = [0, 1]; s.pits[0][0][2] = 2; s.pits[1][0][5] = 2; add("PASS", s);
  s = blank("namua"); s.houseOwned[0] = true; s.pits[0][0][4] = 6; s.pits[1][0][0] = 1; add("ONLY-HOUSE-TWO", s);
  s = blank("namua"); s.reserve = [0, 1]; s.player = 1; s.pits[0][0][0] = 1; s.pits[1][0][3] = 2;
  s.takasia = { player: 1, index: 3 }; add("NAMUA-TO-MTAJI", s);
  s = blank(); s.houseOwned = [true, true]; s.pits[0][0] = [0,0,2,1,6,0,0,0]; s.pits[1][0][3] = 3;
  s.takasia = { player: 0, index: 2 }; add("LAST-FRONT-CAPTURE-PENDING", s);
  s = blank(); s.pits[0][0][2] = 2; s.pits[1][0][0] = 1; add("NO-MOVE-TERMINAL", s);
  s = blank(); s.pits[0][0][0] = 16; s.pits[1][0][0] = 2; add("SIXTEEN-NOT-CAPTURE", s);
  s = blank(); s.pits[0][0][0] = 8; s.pits[0][1][3] = 2; s.pits[1][0][0] = 1; add("SINGLE-FRONT-INWARD", s);
  s = blank(); s.pits[0][0][2] = 1; s.pits[0][1][3] = 2; s.pits[1][0][0] = 1; add("BACK-ROW-TAKATA", s);
  s = structuredClone(F.e30.post); s.takasia = { player: 0, index: 3 }; add("FOREIGN-TAKASIA", s);
  s = structuredClone(F.e30.predecessor); s.takasia = { player: 0, index: 1 }; add("TAKASIA-REPLACEMENT", s);
  s = structuredClone(F.e30.predecessor); delete s.takasia; add("ABSENT-TAKASIA", s);
  return rows;
}
function corpus() {
  return [...known.map(r => ({ id: `P9/${r.name}`, state: { ...structuredClone(r.state), takasia: null }, evidenceClass: "TECHNICAL-KNOWN" })),
    { id: "E30/PREDECESSOR", state: F.e30.predecessor, evidenceClass: "TECHNICAL-KNOWN" },
    { id: "E30/POST", state: F.e30.post, evidenceClass: "TECHNICAL-KNOWN" },
    ...F.detectionCases.map(r => ({ id: `DETECTION/${r.id}`, state: r.state, evidenceClass: "TECHNICAL-KNOWN" })),
    ...F.sowingCases.map(r => ({ id: `SOWING/${r.id}`, state: r.state, evidenceClass: "TECHNICAL-KNOWN" })),
    ...constructed()];
}
module.exports = { corpus, blank };
