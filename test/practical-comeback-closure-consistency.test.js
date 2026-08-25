"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const STUDY = path.join(ROOT, "doc/practical-comeback-error-inducing-moves");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function json(rel) {
  return JSON.parse(read(rel));
}

function containsAll(rel, needles) {
  const text = read(rel);
  for (const needle of needles) assert.ok(text.includes(needle), `${rel} missing: ${needle}`);
}

function containsNone(rel, needles) {
  const text = read(rel);
  for (const needle of needles) assert.ok(!text.includes(needle), `${rel} contains stale current-facing text: ${needle}`);
}

const resultPath = "doc/practical-comeback-error-inducing-moves/results/STAGE_1_EXPLORATORY_RESULT.json";
const verificationPath = "doc/practical-comeback-error-inducing-moves/results/STAGE_1_INDEPENDENT_VERIFICATION.json";
const provenancePath = "doc/practical-comeback-error-inducing-moves/results/STAGE_1_ARTIFACT_PROVENANCE.json";
const stage2Path = "doc/practical-comeback-error-inducing-moves/results/STAGE_2_NON_AUTHORIZATION.json";

const result = json(resultPath);
assert.equal(result.studyId, "PCEM-STUDY1");
assert.equal(result.stageId, "PCEM-S1-EXPLORATORY-2026-08-25-v1");
assert.equal(result.scientificLabel, "EXPLORATORY-ONLY");
assert.equal(result.scientificInferenceAuthorized, false);
assert.equal(result.confirmatoryReuseAllowed, false);
assert.equal(result.generatedGames, 3072);
assert.equal(result.uniqueHistoricalTrajectories, 2764);
assert.equal(result.selectedRoots, 300);
assert.deepEqual(result.phaseCounts, { namua: 150, mtaji: 150 });
assert.equal(result.accounting.interventions, 1065);
assert.equal(result.accounting.primaryRows, 12780);
assert.equal(result.accounting.secondaryRows, 4260);
assert.equal(result.accounting.referenceRows, 1065);
assert.equal(result.accounting.totalContinuationRows, 18105);
assert.equal(result.accounting.exhaustedPrimary, 2);
assert.ok(Object.values(result.readiness).every(Boolean));
assert.equal(result.candidateAuditCount, 55);
assert.equal(result.candidatesPassingPromotionGates, 0);
assert.equal(result.promotedCandidateCount, 0);
assert.deepEqual(result.promotedCandidates, []);
assert.equal(result.manualPromotionPerformed, false);
assert.equal(result.resultHash, "4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08");
assert.match(result.resultHashScope, /canonical workflow artifact/);
assert.equal(result.artifactProvenanceRecord, "STAGE_1_ARTIFACT_PROVENANCE.json");
assert.equal(result.repositoryRecordAugmentedAfterCanonicalExecution, true);
assert.equal(result.scientificOutcomeChangedByRepositoryAugmentation, false);

const verification = json(verificationPath);
assert.equal(verification.decision, "TECHNICAL-PASS");
assert.equal(verification.passed, true);
assert.ok(Object.values(verification.gates).every(Boolean));
assert.equal(verification.verified.games, 3072);
assert.equal(verification.verified.selectedRoots, 300);
assert.equal(verification.verified.rootMoveInterventions, 1065);
assert.equal(verification.verified.primaryRows, 12780);
assert.equal(verification.verified.secondaryRows, 4260);
assert.equal(verification.verified.referenceRows, 1065);
assert.equal(verification.verified.candidateAuditCount, 55);
assert.equal(verification.verified.promotedCandidateCount, 0);
assert.equal(verification.scientificLabelVerified, "EXPLORATORY-ONLY");
assert.equal(verification.stage1ResultHash, result.resultHash);
assert.equal(verification.artifactProvenanceRecord, "STAGE_1_ARTIFACT_PROVENANCE.json");

const provenance = json(provenancePath);
assert.equal(provenance.recordRole, "post-closure provenance clarification only");
assert.equal(provenance.scientificResultChanged, false);
assert.equal(provenance.canonicalScientificExecution.sourceCommit, "f4b336ee6655c37f6c456ef1ba6175dc0816a93c");
assert.equal(provenance.canonicalScientificExecution.workflowRunId, 32820391017);
assert.equal(provenance.canonicalScientificExecution.productionArtifact.id, 9557783361);
assert.equal(provenance.canonicalScientificExecution.productionArtifact.digest, "sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693");
assert.equal(provenance.canonicalScientificExecution.verifiedArtifact.id, 9558356215);
assert.equal(provenance.canonicalScientificExecution.verifiedArtifact.digest, "sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067");
assert.equal(provenance.canonicalExecutionBindings.scientificWorkflowGitBlobSha, "3320575988f9f0ec315a8d7474840745a99ae325");
assert.equal(provenance.resultHash.value, result.resultHash);
assert.equal(provenance.resultHash.isRepositoryFileSha256, false);
assert.equal(provenance.resultHash.isCurrentRepositoryJsonPayloadHash, false);
assert.equal(provenance.repositoryCompactRecord.augmentedAfterCanonicalExecution, true);
assert.equal(provenance.repositoryCompactRecord.scientificOutcomeFieldsChangedByAugmentation, false);
assert.equal(provenance.postClosureWorkflowState.currentRole, "closure guard only; heavy scientific regeneration disabled");
assert.equal(provenance.postClosureWorkflowState.matchesCanonicalScientificWorkflowBlob, false);

assert.deepEqual(provenance.canonicalVerifiedArtifactFileSha256, {
  "stage1-result.json": "0302b39d739e437175a054585ba53cb5b582c9ca8d015ecf671a4e28576b9b95",
  "independent-verification.json": "89ba84c235c784d49fe2f6b0e9aed43549f77d65b26bbacd74866ffda7b074c6",
  "discovery.json": "084a848d2c59b9407f1bf1dec593e9a43dfea031f1c39623f8b715f22106515d",
  "selection.json": "6a47b73e229959256c18ec03f2de2542386d7a4a626972f0575be0f438467f7b",
  "measurements.json": "95db19310648d8a6d5cdbf693c0000e9a74ec6a680773782dedcb21c668c5fb3",
  "source-summary.json": "5d84a42938b0ca5bed14c505207313558b1d2be945e33934b5fa89d6ba25c1ea",
  "parallel-control.json": "67a3cc16d841a35ee9ee496e1b6852657e441f0e80e3de75b6192e4adb6572bb"
});

const stage2 = json(stage2Path);
assert.equal(stage2.stage2Status, "NOT-AUTHORIZED-NOT-EXECUTED");
assert.equal(stage2.stage2GenerationAuthorized, false);
assert.equal(stage2.stage1PromotedCandidateCount, 0);
assert.equal(stage2.stage1ResultHash, result.resultHash);
assert.equal(stage2.stage1IndependentVerificationPassed, true);
assert.equal(stage2.stage1ScientificLabel, "EXPLORATORY-ONLY");
assert.equal(stage2.reservedStage2SeedStart, 23300001);
assert.equal(stage2.reservedStage2SeedEnd, 23306144);
assert.equal(stage2.reservedStage2SeedsConsumed, false);
assert.ok(Object.values(stage2.rescueProhibited).every(Boolean));

const currentFacing = [
  "README.md",
  "doc/RESEARCH_INDEX.md",
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "doc/practical-comeback-error-inducing-moves/README.md",
  "doc/practical-comeback-error-inducing-moves/CURRENT_STATUS.md",
  "doc/practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md",
  "doc/practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md",
  "doc/practical-comeback-error-inducing-moves/REPRODUCIBILITY_INDEX.md",
  "doc/practical-comeback-error-inducing-moves/results/README.md",
  "doc/practical-comeback-error-inducing-moves/checkpoints/2026-08-25-stage1-exploratory-complete-stage2-not-authorized.md",
  "doc/research-program-decisions/2026-08-25-practical-comeback-error-inducing-move-study1-closure.md"
];

for (const rel of currentFacing) {
  containsAll(rel, ["PCEM", "EXPLORATORY-ONLY"]);
  containsNone(rel, [
    "Stage 1 = AUTHORIZED-NOT-YET-EXECUTED",
    "Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED",
    "Stage 0 technical-only未実行",
    "scientific result未生成",
    "NO SCIENTIFIC RESULT YET"
  ]);
}

containsAll("README.md", ["55 candidate audits", "promoted candidates 0", "NOT-AUTHORIZED-NOT-EXECUTED"]);
containsAll("doc/RESEARCH_INDEX.md", ["### 16. Practical Comeback / Error-Inducing Move — Study 1", "promotedCandidateCount = 0"]);
containsAll("doc/FUTURE_RESEARCH_AGENDA.md", ["Version: 1.15.0", "Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`)も完了した。"]);
containsAll("doc/practical-comeback-error-inducing-moves/REPRODUCIBILITY_INDEX.md", [
  "scientificWorkflowGitBlobSha = 3320575988f9f0ec315a8d7474840745a99ae325",
  "Post-closure workflow-path distinction",
  "STAGE_1_ARTIFACT_PROVENANCE.json"
]);

const frozenSpec = json("doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXPLORATORY_SPEC.json");
assert.equal(frozenSpec.status, "prospective-frozen-not-authorized");
const authorization = json("doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json");
assert.equal(authorization.stage1GenerationAuthorized, true);
assert.equal(authorization.stage2GenerationAuthorized, false);
const amendment = json("doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json");
assert.equal(amendment.executionBindings.parallelWorkflowGitBlobSha, "3320575988f9f0ec315a8d7474840745a99ae325");
assert.equal(amendment.scientificContract.scientificLogicChanged, false);

containsAll(".github/workflows/pcem-stage1-parallel.yml", [
  "PCEM Stage 1 exploratory scientific (closed)",
  "Refuse scientific rerun after canonical closure",
  result.resultHash
]);

console.log("PCEM closure consistency audit: PASS");
