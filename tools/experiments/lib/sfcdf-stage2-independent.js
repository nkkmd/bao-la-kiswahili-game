"use strict";

const S1 = require("./sfcdf-stage1-independent.js");
const G = require("./sfcdf-independent.js");

const STAGE_ID = "SFCDF-S2-FORMAL-2026-09-02-v1";
const EXPECTED_PROMOTED = [
  { candidateId: "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION", direction: "MTAJI-GREATER" },
  { candidateId: "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO", direction: "NAMUA-GREATER" }
];

function assertOk(v,m){if(!v)throw new Error(m);}
function formalFirewallExtra(input){
  assertOk(input&&input.studyId==="SFCDF-STUDY1"&&input.stageId===STAGE_ID,"Stage 2 formal input identity mismatch");
  assertOk(input.materializationClass==="STAGE2-PREAUTH-FORMAL-INPUT","Stage 2 formal input class mismatch");
  assertOk(input.freshStage2ScientificEvidenceGenerated===false&&input.stage2SeedAccess===false&&input.protectedDepth10Access===false,"Stage 2 formal input boundary violated");
  assertOk(input.discardedStage1ScientificOutcomes===true,"Stage 1 outcomes not discarded");
  assertOk(S1.canonical(input.promotedCandidates)===S1.canonical(EXPECTED_PROMOTED),"frozen promoted set mismatch");
  const ids=input.stage1IdentitySets||{};
  assertOk(Array.isArray(ids.rootRawSha256)&&ids.rootRawSha256.length===24,"Stage 1 root firewall count mismatch");
  assertOk(Array.isArray(ids.sourceTrajectorySha256)&&ids.sourceTrajectorySha256.length===24,"Stage 1 trajectory firewall count mismatch");
  assertOk(Array.isArray(ids.openingPrefixSha256)&&ids.openingPrefixSha256.length===12,"Stage 1 prefix firewall count mismatch");
  return {root:[...ids.rootRawSha256],trajectory:[...ids.sourceTrajectorySha256],prefix:[...ids.openingPrefixSha256]};
}
function selectPairedRoots(E,S,upstreamManifest,formalInput){return S1.selectPairedRoots(E,S,upstreamManifest,formalFirewallExtra(formalInput));}

module.exports={
  STUDY_ID:S1.STUDY_ID,
  STAGE_ID,
  HORIZON:S1.HORIZON,
  CANDIDATES:S1.CANDIDATES,
  EXPECTED_PROMOTED,
  sourceOnly:S1.sourceOnly,
  selectPairedRoots,
  measureRoot:S1.measureRoot,
  comparePair:S1.comparePair,
  validateFormal:G.validateFormal,
  canonical:S1.canonical,
  digest:S1.digest
};
