"use strict";

const S1 = require("./sfcdf-stage1-production.js");
const M = require("./sfcdf-production.js");

const STAGE_ID = "SFCDF-S2-FORMAL-2026-09-02-v1";
const EXPECTED_PROMOTED = [
  { candidateId: "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION", direction: "MTAJI-GREATER" },
  { candidateId: "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO", direction: "NAMUA-GREATER" }
];

function need(x,m){if(!x)throw new Error(m);}
function canonical(v){return S1.canonical(v);}
function formalExtra(input){
  need(input && input.studyId === "SFCDF-STUDY1" && input.stageId === STAGE_ID, "Stage 2 formal input identity mismatch");
  need(input.materializationClass === "STAGE2-PREAUTH-FORMAL-INPUT", "Stage 2 formal input class mismatch");
  need(input.freshStage2ScientificEvidenceGenerated === false && input.stage2SeedAccess === false && input.protectedDepth10Access === false, "Stage 2 formal input boundary violated");
  need(input.discardedStage1ScientificOutcomes === true, "Stage 1 outcomes not discarded");
  need(canonical(input.promotedCandidates) === canonical(EXPECTED_PROMOTED), "frozen promoted set mismatch");
  const s=input.stage1IdentitySets||{};
  need(Array.isArray(s.rootRawSha256)&&s.rootRawSha256.length===24,"Stage 1 root firewall count mismatch");
  need(Array.isArray(s.sourceTrajectorySha256)&&s.sourceTrajectorySha256.length===24,"Stage 1 trajectory firewall count mismatch");
  need(Array.isArray(s.openingPrefixSha256)&&s.openingPrefixSha256.length===12,"Stage 1 prefix firewall count mismatch");
  return {root:s.rootRawSha256,trajectory:s.sourceTrajectorySha256,prefix:s.openingPrefixSha256};
}
function selectPairedRoots(E,S,upstreamManifest,formalInput){return S1.selectPairedRoots(E,S,upstreamManifest,formalExtra(formalInput));}

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
  validateFormal:M.validateFormal,
  canonical:S1.canonical,
  digest:S1.digest
};
