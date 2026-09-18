"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-production.js");

const CELLS = {
  0: { cellId: "CTGTS-CELL-P2-RF1", policyId: L.P2, rootFamilyId: L.RF1 },
  1: { cellId: "CTGTS-CELL-P1-RF1", policyId: L.P1, rootFamilyId: L.RF1 },
  2: { cellId: "CTGTS-CELL-P2-RF2", policyId: L.P2, rootFamilyId: L.RF2 },
  3: { cellId: "CTGTS-CELL-P1-RF2", policyId: L.P1, rootFamilyId: L.RF2 }
};

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function sha256(x){return crypto.createHash("sha256").update(x,"utf8").digest("hex");}
function cellForSeed(seed){
  need(Number.isInteger(seed)&&seed>=0,"seed must be nonnegative integer");
  return clone(CELLS[seed % 4]);
}
function sourceDescriptor(replay,row){
  if(!row)return null;
  return {
    phase:row.phase,
    sourceSeed:replay.seed,
    selectedPly:row.ply,
    rootRawSha256:row.rawStateSha256,
    sourceTrajectorySha256:replay.trajectorySha256,
    openingPrefixSha256:sha256(replay.moveKeys.slice(0,16).join("\n")),
    openingPrefixLength:Math.min(16,replay.moveKeys.length),
    rootState:clone(row.state)
  };
}
function replayAssigned(engine,seed,maxPly=80){
  const cell=cellForSeed(seed);
  const replay=L.replay(engine,cell.policyId,seed,maxPly);
  const anchors=L.selectAnchors(replay.rows,cell.rootFamilyId);
  return {
    seed,
    ...cell,
    moveKeys:replay.moveKeys,
    trajectorySha256:replay.trajectorySha256,
    terminal:replay.terminal,
    namua:sourceDescriptor(replay,anchors.namua),
    mtaji:sourceDescriptor(replay,anchors.mtaji),
    pairComplete:Boolean(anchors.complete)
  };
}
function selectionKey(source){
  need(source&&source.pairComplete&&source.namua&&source.mtaji,"complete source pair required");
  return sha256([
    "CTGTS-S1",
    source.cellId,
    source.seed,
    source.trajectorySha256,
    source.namua.openingPrefixSha256,
    source.namua.rootRawSha256,
    source.mtaji.rootRawSha256
  ].join("|"));
}
module.exports={CELLS,cellForSeed,replayAssigned,selectionKey,sha256};
