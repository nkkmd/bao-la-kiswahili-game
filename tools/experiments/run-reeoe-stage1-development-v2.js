"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const S = require("./lib/restricted-endgame-stage0.js");
const T = require("./lib/restricted-endgame-transition.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/reeoe-stage1-development-v2/production-result.json");

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
function sha256Bytes(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function sha256Stable(value) { return sha256Bytes(Buffer.from(stableStringify(value))); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function own(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function assertIntegerArray(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || values.some((v) => !Number.isInteger(v) || v < 0)) throw new Error(`Invalid ${label}`);
}
function strictRawState(state, label = "state") {
  if (!state || typeof state !== "object") throw new Error(`Invalid ${label}`);
  if (!own(state, "pending")) throw new Error(`MISSING-PENDING:${label}`);
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error(`Invalid pits:${label}`);
  for (let p = 0; p < 2; p += 1) {
    if (!Array.isArray(state.pits[p]) || state.pits[p].length !== 2) throw new Error(`Invalid pit rows:${label}`);
    for (let r = 0; r < 2; r += 1) assertIntegerArray(state.pits[p][r], 8, `pit row:${label}`);
  }
  assertIntegerArray(state.reserve, 2, `reserve:${label}`);
  assertIntegerArray(state.pending, 2, `pending:${label}`);
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2 || state.houseOwned.some((v) => typeof v !== "boolean")) throw new Error(`Invalid houseOwned:${label}`);
  if (![0, 1].includes(state.player)) throw new Error(`Invalid player:${label}`);
  if (state.phase !== "mtaji" || state.winner !== null) throw new Error(`Invalid development root:${label}`);
  return true;
}
function representedSeeds(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0) + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}
function gitBlob(relative) { return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim(); }
function verifyAuthorization(auth) {
  if (auth.studyId !== "REEOE-STUDY1" || auth.stageId !== "REEOE-S1-DEVELOPMENT-2026-08-28-v2") throw new Error("Unexpected Stage 1 v2 authorization identity");
  if (auth.executionAuthorized !== true || auth.scientificInferenceAuthorized !== false || auth.formalExactDecisionAuthorized !== false || auth.stage2ExecutionAuthorized !== false) throw new Error("Invalid Stage 1 v2 authorization flags");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha)) {
    const observed = gitBlob(relative);
    if (observed !== expected) throw new Error(`Stage 1 v2 source freeze mismatch ${relative}: ${observed} != ${expected}`);
  }
}
function selectedRootRow(root) {
  return { seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey, nonEmptyPitCount: root.nonEmptyPitCount, exactLegalMoveCount: root.legalMoveCount };
}
function normalizeClosure(closure) {
  const stateCount = closure.complete ? closure.stateCount : closure.stateCountObserved;
  const edgeCount = closure.complete ? closure.edgeCount : closure.edgeCountObserved;
  return {
    complete: closure.complete,
    stopReason: closure.complete ? "COMPLETE" : closure.technicalStopReason,
    stateCount,
    edgeCount,
    stateSetSha256: closure.complete ? closure.stateSetSha256 : null,
    transitionSetSha256: closure.complete ? closure.transitionSetSha256 : null,
    branching: closure.complete ? closure.branching : null,
    maxMoveMicrosteps: closure.maxMoveMicrosteps ?? null,
    deterministicWorkUnits: closure.complete && closure.branching ? closure.branching.expandedStates + closure.edgeCount : null,
  };
}
function main() {
  const outputPath = path.resolve(process.argv[2] || DEFAULT_OUTPUT);
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  if (spec.studyId !== "REEOE-STUDY1" || spec.stageId !== "REEOE-S1-DEVELOPMENT-2026-08-28-v2") throw new Error("Unexpected Stage 1 v2 spec identity");
  verifyAuthorization(auth);
  const block = spec.freshTrajectoryBlock;
  const scan = S.scanWitnessRoots({ seedBase: block.seedBase, games: block.games, maxPly: block.maxPly });
  const allRoots = scan.roots.map((root) => {
    strictRawState(root.state, `scan-root:${root.rootStateKey}`);
    if (representedSeeds(root.state) !== 64) throw new Error(`Seed conservation failure ${root.rootStateKey}`);
    if (T.directStateKey(root.state) !== root.rootStateKey) throw new Error(`Root identity mismatch ${root.rootStateKey}`);
    return root;
  });
  const allRootKeys = allRoots.map((root) => root.rootStateKey).sort();
  const envelope = spec.developmentStructuralEnvelope;
  const eligible = allRoots.filter((root) => root.nonEmptyPitCount <= envelope.maximumNonEmptyPitCount && root.legalMoveCount <= envelope.maximumExactLegalMoveCount)
    .sort((a, b) => a.seed - b.seed || a.ply - b.ply || a.rootStateKey.localeCompare(b.rootStateKey));
  const selected = eligible.slice(0, envelope.maximumSelectedRoots);
  const closureOptions = {
    maxStates: spec.perRootClosureResourceProfile.maximumStates,
    maxEdges: spec.perRootClosureResourceProfile.maximumEdges,
    administrativeMaxMicrostates: spec.perRootClosureResourceProfile.maximumMoveMicrostates,
  };
  const developmentRows = selected.map((root) => ({ ...selectedRootRow(root), closure: normalizeClosure(S.enumerateClosure([root.state], closureOptions)) }));
  const completeCount = developmentRows.filter((row) => row.closure.complete).length;
  const productionAcceptance = selected.length >= spec.stage1AcceptanceRule.minimumSelectedRoots && completeCount >= spec.stage1AcceptanceRule.minimumIndependentlyVerifiedCompleteClosures;
  const developmentCore = {
    seedBase: block.seedBase,
    seedEnd: block.seedEnd,
    games: block.games,
    maxPly: block.maxPly,
    uniqueWitnessRootCount: allRoots.length,
    allEncounteredRootSetSha256: sha256Bytes(Buffer.from(allRootKeys.join("\n"))),
    eligibleRootCount: eligible.length,
    eligibleRootSetSha256: sha256Bytes(Buffer.from(eligible.map((root) => root.rootStateKey).sort().join("\n"))),
    selectedRootCount: selected.length,
    selectedRootSetSha256: sha256Bytes(Buffer.from(selected.map((root) => root.rootStateKey).sort().join("\n"))),
    selectedRootOrderSha256: sha256Bytes(Buffer.from(selected.map((root) => `${root.seed}\t${root.ply}\t${root.rootStateKey}`).join("\n"))),
    selectedRoots: developmentRows,
    completeClosureCount: completeCount,
  };
  const result = {
    schemaVersion: 1,
    programLabel: "G2-04",
    studyId: "REEOE-STUDY1",
    stageId: spec.stageId,
    resultRole: "development-resource-characterization-only",
    productionDevelopmentStatus: productionAcceptance ? "PRODUCTION-DEVELOPMENT-ELIGIBLE" : "PRODUCTION-DEVELOPMENT-INSUFFICIENT",
    scientificInferenceAuthorized: false,
    formalExactDecisionAuthorized: false,
    stage2ExecutionAuthorized: false,
    specFileSha256: sha256Bytes(fs.readFileSync(SPEC_PATH)),
    authorizationFileSha256: sha256Bytes(fs.readFileSync(AUTH_PATH)),
    development: developmentCore,
    developmentCoreSha256: sha256Stable(developmentCore),
    forbiddenOutcomeInspectionPerformed: false,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopened = readJson(outputPath);
  if (sha256Stable(reopened.development) !== result.developmentCoreSha256) throw new Error("Stage 1 v2 reopen/hash mismatch");
  if (reopened.scientificInferenceAuthorized !== false || reopened.formalExactDecisionAuthorized !== false || reopened.stage2ExecutionAuthorized !== false || reopened.forbiddenOutcomeInspectionPerformed !== false) throw new Error("Stage 1 v2 authorization boundary failure");
  console.log(JSON.stringify({ outputPath, productionDevelopmentStatus: result.productionDevelopmentStatus, uniqueWitnessRootCount: allRoots.length, eligibleRootCount: eligible.length, selectedRootCount: selected.length, completeClosureCount: completeCount, selectedRoots: developmentRows, allEncounteredRootSetSha256: developmentCore.allEncounteredRootSetSha256, eligibleRootSetSha256: developmentCore.eligibleRootSetSha256, selectedRootOrderSha256: developmentCore.selectedRootOrderSha256, developmentCoreSha256: result.developmentCoreSha256 }, null, 2));
}
main();
