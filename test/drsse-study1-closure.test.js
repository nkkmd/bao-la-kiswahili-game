"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));

const FINAL_DECISION = "EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN";
const ROOT_KEY = "2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6";

const stage2 = json("doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json");
const spec = json("doc/deep-raw-state-space-enumeration/preregistration/STAGE_2_FORMAL_SPEC.json");
const finalResult = json("doc/deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json");

assert.equal(stage2.studyId, "DRSSE-STUDY1");
assert.equal(stage2.stageId, "DRSSE-S2-FORMAL-2026-08-28-v1");
assert.equal(stage2.formalDecision, FINAL_DECISION);
assert.equal(stage2.rootRawStateKey, ROOT_KEY);
assert.equal(stage2.targetDepth, 9);
assert.equal(stage2.targetComplete, true);
assert.equal(stage2.lastCompleteDepth, 9);
assert.equal(stage2.firstIncompleteDepth, null);
assert.equal(stage2.stopReason, null);
assert.equal(stage2.technicalStopClassification, null);
assert.deepEqual(stage2.representation.identityFields,
  ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
assert.deepEqual(stage2.representation.excludedIdentityFields, ["turn", "reason"]);
assert.deepEqual(stage2.representation.validatedTransformSet, []);
assert.equal(stage2.representation.symmetryReductionUsed, false);
assert.equal(stage2.representation.canonicalizationUsed, false);

assert.equal(stage2.cumulative.distinctRawStatesThroughLastCompleteDepth, 102857);
assert.equal(stage2.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent, 106773);
assert.equal(stage2.cumulative.uniqueRawGraphEdgesThroughLastCompleteParent, 106773);
assert.equal(stage2.cumulative.treeNodeOccurrencesThroughLastCompleteDepth, "136645");
assert.equal(stage2.cumulative.treeEdgeOccurrencesThroughLastCompleteParent, "136644");
assert.equal(stage2.cumulative.treeToCumulativeRawStateRatio, 1.328494900687362);
assert.equal(stage2.cumulative.cumulativeRawStateSetSha256,
  "993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816");
assert.equal(stage2.cumulative.cumulativeGlobalRawGraphEdgeSetSha256,
  "da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654");
assert.equal(stage2.cumulative.cumulativeDepthLabelledEdgeSetSha256,
  "3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed");

assert.equal(stage2.layers.length, 10);
assert.equal(stage2.parentLayers.length, 9);
assert.deepEqual(stage2.layers.map((row) => row.depth), [0,1,2,3,4,5,6,7,8,9]);
assert.deepEqual(stage2.parentLayers.map((row) => row.depth), [0,1,2,3,4,5,6,7,8]);
assert.ok(stage2.layers.every((row) => row.complete === true));
assert.deepEqual(stage2.layers.map((row) => row.uniqueRawStateCount),
  [1,4,14,38,119,384,1284,4706,18298,78009]);
assert.deepEqual(stage2.layers.map((row) => row.newRawStateCount),
  [1,4,14,38,119,384,1284,4706,18298,78009]);
assert.equal(stage2.layers[9].duplicateArrivalCount, 3116);
assert.equal(stage2.layers[9].statesWithMultiplePredecessors, 2658);
assert.equal(stage2.layers[9].namuaNonterminal, 77658);
assert.equal(stage2.layers[9].mtajiNonterminal, 0);
assert.equal(stage2.layers[9].terminal, 351);
assert.ok(stage2.parentLayers.every((row) => row.zeroLegalMoveNonterminalCount === 0));

assert.equal(stage2.verification.materializedVerificationPassed, true);
assert.equal(stage2.verification.fullIndependentExactRecomputationPerformed, true);
assert.equal(stage2.verification.fullIndependentExactRecomputationPassed, true);
assert.equal(stage2.verification.verifiedLayerCount, 10);
assert.equal(stage2.verification.verifiedParentLayerCount, 9);
assert.equal(stage2.verification.productionResultCoreSha256,
  "b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b");
assert.equal(stage2.verification.independentCoreSha256,
  "02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3");
assert.equal(stage2.verification.decisionCoreSha256,
  "c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f");
assert.equal(stage2.actionsArtifactId, 9679860509);
assert.equal(stage2.actionsArtifactZipSha256,
  "cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e");

// Post-review disposition: the accepted exact run used the target-complete branch,
// so full independent re-enumeration was actually performed. Its recorded final
// resource use also remained below every frozen Stage 2 cap, so the latent
// incomplete-path/final-ambient-check concerns do not alter the canonical result.
assert.equal(spec.formalDomain.targetDepth, stage2.targetDepth);
assert.ok(stage2.resourceUse.parentStateExpansions < spec.formalResourceProfile.maxParentStateExpansions);
assert.ok(stage2.resourceUse.moveEvaluations < spec.formalResourceProfile.maxMoveEvaluations);
assert.ok(stage2.resourceUse.elapsedSeconds < spec.formalResourceProfile.maxWallClockSeconds);
assert.ok(stage2.resourceUse.peakResidentSetBytes < spec.formalResourceProfile.maxResidentSetBytes);
assert.ok(stage2.resourceUse.uncompressedArtifactBytesFinal < spec.formalResourceProfile.maxUncompressedArtifactBytes);
assert.ok(stage2.cumulative.distinctRawStatesThroughLastCompleteDepth < spec.formalResourceProfile.maxCumulativeDistinctRawStates);
assert.ok(stage2.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent < spec.formalResourceProfile.maxDepthLabelledEdges);
assert.ok(BigInt(stage2.cumulative.treeNodeOccurrencesThroughLastCompleteDepth)
  < BigInt(spec.formalResourceProfile.maxCumulativeTreeNodeOccurrences));

assert.equal(stage2.firewall.stage1ArtifactInputUsed, false);
assert.equal(stage2.firewall.stage1RowsReused, false);
assert.equal(stage2.firewall.stage1RootsReused, false);
assert.equal(stage2.firewall.g2_04RootsReused, false);
assert.equal(stage2.firewall.g1PartialDepth9RowsReused, false);
assert.equal(stage2.interpretationBoundary.fullBaoStateSpaceClaimAuthorized, false);
assert.equal(stage2.interpretationBoundary.fullBaoGameTreeComplexityClaimAuthorized, false);
assert.equal(stage2.interpretationBoundary.fullGameExtrapolationAuthorized, false);
assert.equal(stage2.interpretationBoundary.symmetryReducedClaimAuthorized, false);

assert.equal(finalResult.studyId, "DRSSE-STUDY1");
assert.equal(finalResult.formalDecision, FINAL_DECISION);
assert.equal(finalResult.rootRawStateKey, ROOT_KEY);
assert.equal(finalResult.targetDepth, 9);
assert.deepEqual(finalResult.completeLayerRange, [0,1,2,3,4,5,6,7,8,9]);
assert.deepEqual(finalResult.completeParentExpansionRange, [0,1,2,3,4,5,6,7,8]);
assert.equal(finalResult.noRescueBoundary.g2_04FormalDecisionChanged, false);
assert.equal(finalResult.noRescueBoundary.g2_04SelectedRootsReused, false);
assert.equal(finalResult.noRescueBoundary.g1SsgtcFormalDecisionChanged, false);
assert.equal(finalResult.noRescueBoundary.g1Depth9PartialRowsReused, false);
assert.equal(finalResult.noRescueBoundary.stage1RowsReusedInFormalStage, false);
assert.equal(finalResult.noRescueBoundary.stage1RootsReusedInFormalStage, false);

const status = read("doc/deep-raw-state-space-enumeration/CURRENT_STATUS.md");
const report = read("doc/deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md");
const overview = read("doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md");
const decisions = read("doc/deep-raw-state-space-enumeration/DECISION_REGISTER.md");
const reproducibility = read("doc/deep-raw-state-space-enumeration/REPRODUCIBILITY_INDEX.md");
const rootReadme = read("README.md");
const index = read("doc/RESEARCH_INDEX.md");
const agenda = read("doc/FUTURE_RESEARCH_AGENDA.md");
const program = read("doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md");

for (const text of [status, report, overview, decisions, reproducibility]) {
  assert.ok(text.includes(FINAL_DECISION));
  assert.ok(text.includes("DRSSE-STUDY1"));
}
assert.ok(rootReadme.includes("`G2-05` / `DRSSE-STUDY1`"));
assert.ok(index.includes("### 21. Deep RAW State-Space Enumeration — Study 1"));
assert.ok(index.includes("cumulative RAW states = 102857"));
assert.ok(agenda.includes("**状態:** **完了 / `DRSSE-STUDY1` / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**"));
assert.ok(agenda.includes("G2-12 — State-Space / Game-Tree Growth Estimation Study 1"));
assert.ok(program.includes("G2-05 Deep RAW State-Space Enumeration Study 1 closure"));
assert.ok(program.includes("G2-04 / REEOE-STUDY1 = INCONCLUSIVE"));
assert.ok(program.includes("SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN"));

for (const workflow of [
  ".github/workflows/drsse-stage0-technical.yml",
  ".github/workflows/drsse-stage1-development.yml",
  ".github/workflows/drsse-stage2-formal.yml",
  ".github/workflows/drsse-central-docs-materialize.yml",
]) {
  const text = read(workflow);
  assert.ok(text.includes("workflow_dispatch"), `${workflow} is not archived`);
  assert.ok(!text.includes("\n  push:"), `${workflow} still has a push trigger`);
}

console.log("DRSSE-STUDY1 closure consistency audit: PASS");
