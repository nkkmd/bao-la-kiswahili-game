"use strict";
const C=require("./rcpr-stage1-independent-corpus.js");
const M=require("./rcpr-stage1-independent-model.js");
function ensure(condition,message){if(!condition)throw new Error(message);}
function runDevelopment(spec, options = {}) {
  const gameCount = options.gameCount ?? spec.sourcePopulation.games;
  ensure(Number.isInteger(gameCount) && gameCount > 0, "invalid gameCount");
  const records = Array.from({ length: gameCount }, (_, gameIndex) => C.runGame(spec, gameIndex));
  const selection = C.selectRoots(records, spec);
  const represented = C.materializeRepresentations(selection.selected, spec);
  const measured = represented.map((item) => ({ ...item, ...C.measureRoot(item, spec, options.measurementOptions || {}) }));
  const model = M.developModel(measured, spec);
  const readiness = M.evaluateReadiness(selection, measured, model, spec);
  const compactRows = measured.map((row) => ({
    gameIndex: row.gameIndex, seed: row.seed, generationStratum: row.generationStratum, phase: row.phase, ply: row.ply,
    rawStateKey: row.rawStateKey, historicalTrajectoryHash: row.historicalTrajectoryHash, openingPrefixHash: row.openingPrefixHash,
    historyWindowHash: row.historyWindowHash, representationRowIdentity: row.representationRowIdentity,
    featureSchemaSha256: row.representation.featureSchemaSha256, featureVectorSha256: row.featureVectorSha256,
    representation: row.representation, primaryEstimable: row.primaryEstimable, dRange: row.dRange, highDivergence: row.highDivergence,
    measurementSha256: row.measurementSha256, moves: row.moves,
  }));
  const result = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, policyId: C.STAGE1_POLICY_ID,
    selection: { ...selection, selected: undefined }, rows: compactRows, model, readiness };
  delete result.selection.selected;
  result.developmentCoreSha256 = M.canonicalHash(result);
  return result;
}
module.exports={...C,...M,runDevelopment};