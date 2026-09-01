#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

const ROOT = "doc/state-space-game-tree-complexity";
const DECISION = "SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN";
const STATE_HASH = "8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9";
const TRANSITION_HASH = "f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e";
const TREE_HASH = "194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08";
const INTEGRATION_MERGE_COMMIT = "ced3751f2c063a0e5e801a3c0f59afbdbae7922d";

function fail(message) { throw new Error(message); }
function read(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return fs.readFileSync(path, "utf8");
}
function json(path) { return JSON.parse(read(path)); }
function includes(path, needles) {
  const text = read(path);
  for (const needle of needles) if (!text.includes(needle)) fail(`${path}: missing ${JSON.stringify(needle)}`);
  return text;
}
function excludes(path, needles) {
  const text = read(path);
  for (const needle of needles) if (text.includes(needle)) fail(`${path}: stale/prohibited text remains: ${JSON.stringify(needle)}`);
  return text;
}
function includesNumber(path, value) {
  const text = read(path);
  const plain = String(value);
  const grouped = Number(value).toLocaleString("en-US");
  if (!text.includes(plain) && !text.includes(grouped)) fail(`${path}: missing numeric value ${value}`);
}

const formal = json(`${ROOT}/results/STAGE_2_FORMAL_RESULT.json`);
if (formal.studyId !== "SSGTC-STUDY1") fail("formal result studyId mismatch");
if (formal.formalDecision !== DECISION) fail("formal decision mismatch");
if (formal.exactTargetComplete !== true) fail("formal exact target not complete");
if (formal.primaryEndpoints.reachableRawStatesThroughDepth8 !== 24848) fail("formal raw-state count mismatch");
if (formal.primaryEndpoints.graphTransitionOccurrencesParentDepth0Through7 !== 25648) fail("formal transition count mismatch");
if (formal.primaryEndpoints.gameTreeNodeOccurrencesThroughDepth8 !== 30941) fail("formal tree-node count mismatch");
if (formal.primaryEndpoints.gameTreeEdgeOccurrencesThroughDepth8 !== 30940) fail("formal tree-edge count mismatch");
if (formal.graph.stateSetSha256 !== STATE_HASH) fail("formal state hash mismatch");
if (formal.graph.transitionSetSha256 !== TRANSITION_HASH) fail("formal transition hash mismatch");
if (formal.tree.occurrenceSetSha256 !== TREE_HASH) fail("formal tree hash mismatch");
if (!formal.independentVerification || formal.independentVerification.passed !== true) fail("formal independent verification is not PASS");
if (formal.interpretationBoundary.claimAppliesOnlyToFrozenDepth8Domain !== true) fail("formal bounded-claim flag changed");
if (formal.interpretationBoundary.globalBaoStateSpaceClaimAuthorized !== false) fail("global Bao state-space claim must remain unauthorized");
if (formal.interpretationBoundary.fullGameTreeComplexityClaimAuthorized !== false) fail("full game-tree claim must remain unauthorized");
if (formal.interpretationBoundary.symmetryReducedCountClaimAuthorized !== false) fail("symmetry-reduced count must remain unauthorized");
if (formal.interpretationBoundary.estimatorAuthorized !== false) fail("estimator must remain unauthorized");
if (formal.interpretationBoundary.stage1RowsUsedAsFormalEvidence !== false) fail("Stage 1 rows must not become formal evidence");
if (formal.symmetryReductionUsed !== false || formal.canonicalizationUsed !== false) fail("symmetry/canonicalization boundary changed");

const exploratory = json(`${ROOT}/results/STAGE_1_EXPLORATORY_RESULT.json`);
if (exploratory.resultClass !== "EXPLORATORY-ONLY") fail("Stage 1 result class changed");
if (exploratory.scientificInferenceAuthorized !== false) fail("Stage 1 scientific inference must remain false");
if (exploratory.formalReuseInStage2 !== false) fail("Stage 1 formal reuse must remain false");
if (exploratory.technicalAcceptance !== "PASS") fail("Stage 1 technical acceptance mismatch");
if (exploratory.completedVerifiedDomain.graphRawStatesThroughDepth8 !== 24848) fail("Stage 1 completed-domain count mismatch");
if (exploratory.completedVerifiedDomain.graphTransitionOccurrencesFromParentDepth0Through7 !== 25648) fail("Stage 1 completed-domain transition count mismatch");
if (exploratory.completedVerifiedDomain.stateSetSha256 !== STATE_HASH) fail("Stage 1 completed-domain state hash mismatch");
if (exploratory.completedVerifiedDomain.transitionSetSha256 !== TRANSITION_HASH) fail("Stage 1 completed-domain transition hash mismatch");
if (exploratory.interpretationBoundary.partialDepth9StateRowsAreCensoredObservedOnly !== true) fail("Stage 1 partial-depth censoring boundary changed");
if (exploratory.independentVerification.passed !== true) fail("Stage 1 independent verification is not PASS");

const coreDocs = [
  `${ROOT}/README.md`,
  `${ROOT}/STUDY_1_OVERVIEW.md`,
  `${ROOT}/STUDY_1_FINAL_REPORT.md`,
  `${ROOT}/CURRENT_STATUS.md`,
  `${ROOT}/DECISION_REGISTER.md`,
  `${ROOT}/REPRODUCIBILITY_INDEX.md`,
  `${ROOT}/results/README.md`,
  "README.md",
  "doc/RESEARCH_INDEX.md",
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "doc/research-program-decisions/2026-08-25-state-space-game-tree-complexity-study1-closure.md",
];
for (const path of coreDocs) includes(path, [DECISION]);

for (const path of [
  `${ROOT}/README.md`,
  `${ROOT}/STUDY_1_OVERVIEW.md`,
  `${ROOT}/STUDY_1_FINAL_REPORT.md`,
  `${ROOT}/CURRENT_STATUS.md`,
  `${ROOT}/REPRODUCIBILITY_INDEX.md`,
  "README.md",
  "doc/RESEARCH_INDEX.md",
  "doc/FUTURE_RESEARCH_AGENDA.md",
]) {
  includesNumber(path, 24848);
  includesNumber(path, 30941);
}

for (const path of [
  `${ROOT}/STUDY_1_OVERVIEW.md`,
  `${ROOT}/STUDY_1_FINAL_REPORT.md`,
  `${ROOT}/CURRENT_STATUS.md`,
  `${ROOT}/REPRODUCIBILITY_INDEX.md`,
  "doc/RESEARCH_INDEX.md",
  "doc/FUTURE_RESEARCH_AGENDA.md",
]) includes(path, [STATE_HASH, TRANSITION_HASH, TREE_HASH]);

includes(`${ROOT}/CURRENT_STATUS.md`, [
  "studyStatus = COMPLETED",
  "mergeToMain = PERFORMED",
  `integrationMergeCommit = ${INTEGRATION_MERGE_COMMIT}`,
  "symmetryReductionUsed = false",
  "estimationAuthorized = false",
]);
excludes(`${ROOT}/CURRENT_STATUS.md`, [
  "mergeToMain = NOT-YET-PERFORMED",
  "PR #49 must remain unmerged",
]);

includes("doc/RESEARCH_INDEX.md", [
  "### 15. State Space / Game Tree Complexity — Study 1",
  "**状態:** **COMPLETED",
  "`Bao state space = 24,848`",
]);

// SSGTC closure must remain represented in the current repository-wide agenda,
// but the agenda's global version may legitimately advance as later research
// generations are added. Pin the G2 closure boundary, not historical v2.0.0.
includes("doc/FUTURE_RESEARCH_AGENDA.md", [
  "Research Generation 2: **Closed (2026-08-31)**",
  "### 4.12 状態空間とゲーム木複雑度 — Study 1完了",
  "**[完了] 状態空間とゲーム木複雑度 — Study 1",
  "`Bao state space = 24,848`",
]);
excludes("doc/FUTURE_RESEARCH_AGENDA.md", [
  "**未着手 / RAW-ONLYで進行可能**",
  "**[次研究候補 / RAW-ONLY] 状態空間とゲーム木複雑度**",
  "**現在のmachine-only programmatic next stepはraw-state State Space / Game Tree Complexity Studyである。**",
]);

for (const path of [
  `${ROOT}/STUDY_1_OVERVIEW.md`,
  `${ROOT}/STUDY_1_FINAL_REPORT.md`,
  `${ROOT}/CURRENT_STATUS.md`,
  "doc/RESEARCH_INDEX.md",
  "doc/FUTURE_RESEARCH_AGENDA.md",
]) {
  const text = read(path);
  if (!/(full|全体|frozen|bounded|限定)/.test(text)) fail(`${path}: missing visible bounded/full-game claim boundary`);
}

const stage0Workflow = read(".github/workflows/ssgtc-stage0-technical.yml");
if (!stage0Workflow.includes("contents: read")) fail("Stage 0 workflow must be read-only");
if (stage0Workflow.includes("contents: write")) fail("Stage 0 workflow unexpectedly has write permission");
if (fs.existsSync(".github/workflows/ssgtc-program-doc-sync.yml")) fail("one-shot program doc sync workflow still present");
if (fs.existsSync("tools/experiments/sync-ssgtc-program-docs.js")) fail("one-shot program doc sync script still present");

process.stdout.write(`${JSON.stringify({
  passed: true,
  studyId: "SSGTC-STUDY1",
  formalDecision: DECISION,
  checkedDocuments: coreDocs.length,
  formalEndpoints: {
    reachableRawStatesThroughDepth8: 24848,
    graphTransitionOccurrencesParentDepth0Through7: 25648,
    gameTreeNodeOccurrencesThroughDepth8: 30941,
    gameTreeEdgeOccurrencesThroughDepth8: 30940,
  },
  hashes: {
    stateSetSha256: STATE_HASH,
    transitionSetSha256: TRANSITION_HASH,
    treeOccurrenceSetSha256: TREE_HASH,
  },
  integrationBoundary: "INTEGRATED-IN-MAIN",
  integrationMergeCommit: INTEGRATION_MERGE_COMMIT,
}, null, 2)}\n`);
