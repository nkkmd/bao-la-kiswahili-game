"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const E = require("../../public/engine.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/local/reeoe-stage1-development-v2/production-result.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/reeoe-stage1-development-v2/independent-verification.json");

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
function sha256Bytes(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function sha256Stable(value) { return sha256Bytes(Buffer.from(stableStringify(value))); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function own(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function assertIntegerArray(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || values.some((v) => !Number.isInteger(v) || v < 0)) throw new Error(`Independent invalid ${label}`);
}
function strictRawState(state, label = "state") {
  if (!state || typeof state !== "object") throw new Error(`Independent invalid ${label}`);
  if (!own(state, "pending")) throw new Error(`INDEPENDENT-MISSING-PENDING:${label}`);
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error(`Independent invalid pits:${label}`);
  for (let p = 0; p < 2; p += 1) {
    if (!Array.isArray(state.pits[p]) || state.pits[p].length !== 2) throw new Error(`Independent invalid pit rows:${label}`);
    for (let r = 0; r < 2; r += 1) assertIntegerArray(state.pits[p][r], 8, `pit row:${label}`);
  }
  assertIntegerArray(state.reserve, 2, `reserve:${label}`);
  assertIntegerArray(state.pending, 2, `pending:${label}`);
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2 || state.houseOwned.some((v) => typeof v !== "boolean")) throw new Error(`Independent invalid houseOwned:${label}`);
  if (![0, 1].includes(state.player)) throw new Error(`Independent invalid player:${label}`);
  if (!["namua", "mtaji"].includes(state.phase)) throw new Error(`Independent invalid phase:${label}`);
  if (![null, 0, 1].includes(state.winner)) throw new Error(`Independent invalid winner:${label}`);
  return true;
}
function representedSeeds(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0) + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}
function seededRandomIndependent(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
function exactVariants(state) {
  return E.moveVariants(state).map((move) => clone(move)).sort((a, b) => V.moveKey(a).localeCompare(V.moveKey(b)));
}
function nonEmptyPitCount(state) { return state.pits.flat(2).filter((value) => value > 0).length; }
function frontOccupied(state, player) { return state.pits[player][0].some((value) => value > 0); }
function baseRootEligible(state) {
  strictRawState(state, "eligibility");
  if (state.phase !== "mtaji" || state.winner !== null) return false;
  if (state.reserve[0] !== 0 || state.reserve[1] !== 0) return false;
  if (state.houseOwned[0] || state.houseOwned[1]) return false;
  if (state.pending[0] !== 0 || state.pending[1] !== 0) return false;
  if (representedSeeds(state) !== 64) return false;
  if (!frontOccupied(state, 0) || !frontOccupied(state, 1)) return false;
  return V.legalMtajiMoves(state).length > 0;
}
function generateIndependentRoots(seed, maxPly) {
  const random = seededRandomIndependent(seed);
  let state = E.initialState();
  const roots = [];
  for (let ply = 0; ply <= maxPly; ply += 1) {
    strictRawState(state, `trajectory:${seed}:${ply}`);
    if (baseRootEligible(state)) {
      const rootStateKey = V.stateKey(state);
      roots.push({
        seed,
        ply,
        rootStateKey,
        state: clone(state),
        nonEmptyPitCount: nonEmptyPitCount(state),
        legalMoveCount: V.legalMtajiMoves(state).length,
      });
    }
    if (state.winner !== null || ply === maxPly) break;
    const moves = exactVariants(state);
    if (!moves.length) throw new Error(`Independent running state has no move seed=${seed} ply=${ply}`);
    const index = Math.min(moves.length - 1, Math.floor(random() * moves.length));
    const next = E.applyMove(state, moves[index]).state;
    if (next.reason === "relay-limit") break;
    state = next;
  }
  return roots;
}
function fullIndependentScan(spec) {
  const block = spec.freshTrajectoryBlock;
  const unique = new Map();
  for (let i = 0; i < block.games; i += 1) {
    const seed = block.seedBase + i;
    for (const root of generateIndependentRoots(seed, block.maxPly)) {
      if (!unique.has(root.rootStateKey)) unique.set(root.rootStateKey, root);
    }
  }
  const allRoots = [...unique.values()].sort((a, b) => a.rootStateKey.localeCompare(b.rootStateKey));
  const envelope = spec.developmentStructuralEnvelope;
  const eligible = allRoots.filter((root) => root.nonEmptyPitCount <= envelope.maximumNonEmptyPitCount && root.legalMoveCount <= envelope.maximumExactLegalMoveCount)
    .sort((a, b) => a.seed - b.seed || a.ply - b.ply || a.rootStateKey.localeCompare(b.rootStateKey));
  const selected = eligible.slice(0, envelope.maximumSelectedRoots);
  return {
    allRoots,
    eligible,
    selected,
    allEncounteredRootSetSha256: sha256Bytes(Buffer.from(allRoots.map((r) => r.rootStateKey).sort().join("\n"))),
    eligibleRootSetSha256: sha256Bytes(Buffer.from(eligible.map((r) => r.rootStateKey).sort().join("\n"))),
    selectedRootSetSha256: sha256Bytes(Buffer.from(selected.map((r) => r.rootStateKey).sort().join("\n"))),
    selectedRootOrderSha256: sha256Bytes(Buffer.from(selected.map((r) => `${r.seed}\t${r.ply}\t${r.rootStateKey}`).join("\n"))),
  };
}
function gitBlob(relative) { return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim(); }
function verifyAuthorization(auth) {
  if (auth.studyId !== "REEOE-STUDY1" || auth.stageId !== "REEOE-S1-DEVELOPMENT-2026-08-28-v2") throw new Error("Independent unexpected Stage 1 v2 authorization identity");
  if (auth.executionAuthorized !== true || auth.scientificInferenceAuthorized !== false || auth.formalExactDecisionAuthorized !== false || auth.stage2ExecutionAuthorized !== false) throw new Error("Independent invalid Stage 1 v2 authorization flags");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha)) {
    const observed = gitBlob(relative);
    if (observed !== expected) throw new Error(`Independent Stage 1 v2 source freeze mismatch ${relative}: ${observed} != ${expected}`);
  }
}
function normalizeIndependentClosure(closure) {
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
  const productionPath = path.resolve(process.argv[2] || DEFAULT_PRODUCTION);
  const outputPath = path.resolve(process.argv[3] || DEFAULT_OUTPUT);
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  if (spec.stageId !== "REEOE-S1-DEVELOPMENT-2026-08-28-v2") throw new Error("Independent unexpected v2 spec");
  verifyAuthorization(auth);
  const productionBytes = fs.readFileSync(productionPath);
  const production = JSON.parse(productionBytes.toString("utf8"));
  if (production.studyId !== "REEOE-STUDY1" || production.stageId !== spec.stageId) throw new Error("Stage 1 v2 production identity mismatch");
  if (production.scientificInferenceAuthorized !== false || production.formalExactDecisionAuthorized !== false || production.stage2ExecutionAuthorized !== false || production.forbiddenOutcomeInspectionPerformed !== false) throw new Error("Stage 1 v2 production authorization boundary mismatch");

  const missingPending = E.initialState();
  delete missingPending.pending;
  let missingPendingRejected = false;
  try { strictRawState(missingPending, "missing-pending-control"); } catch (error) { missingPendingRejected = String(error.message).startsWith("INDEPENDENT-MISSING-PENDING:"); }
  if (!missingPendingRejected) throw new Error("Independent v2 validator accepted missing pending");

  const scan = fullIndependentScan(spec);
  const fullScanChecks = {
    uniqueWitnessRootCount: scan.allRoots.length === production.development.uniqueWitnessRootCount,
    allEncounteredRootSetSha256: scan.allEncounteredRootSetSha256 === production.development.allEncounteredRootSetSha256,
    eligibleRootCount: scan.eligible.length === production.development.eligibleRootCount,
    eligibleRootSetSha256: scan.eligibleRootSetSha256 === production.development.eligibleRootSetSha256,
    selectedRootCount: scan.selected.length === production.development.selectedRootCount,
    selectedRootSetSha256: scan.selectedRootSetSha256 === production.development.selectedRootSetSha256,
    selectedRootOrderSha256: scan.selectedRootOrderSha256 === production.development.selectedRootOrderSha256,
  };
  if (Object.values(fullScanChecks).some((value) => !value)) throw new Error(`Independent full scan/selection mismatch ${JSON.stringify(fullScanChecks)}`);

  const closureOptions = { maxStates: spec.perRootClosureResourceProfile.maximumStates, maxEdges: spec.perRootClosureResourceProfile.maximumEdges, maxMicrostates: spec.perRootClosureResourceProfile.maximumMoveMicrostates };
  const rows = [];
  for (let i = 0; i < scan.selected.length; i += 1) {
    const root = scan.selected[i];
    const productionRow = production.development.selectedRoots[i];
    const selectionIdentityAgreement = productionRow.seed === root.seed && productionRow.ply === root.ply && productionRow.rootStateKey === root.rootStateKey && productionRow.nonEmptyPitCount === root.nonEmptyPitCount && productionRow.exactLegalMoveCount === root.legalMoveCount;
    if (!selectionIdentityAgreement) throw new Error(`Selected-root row mismatch index=${i}`);
    const independentClosure = normalizeIndependentClosure(V.enumerateClosure([root.state], closureOptions));
    const closureAgreement = stableStringify(independentClosure) === stableStringify(productionRow.closure);
    if (!closureAgreement) throw new Error(`Independent v2 closure mismatch ${root.rootStateKey}: ${JSON.stringify({ production: productionRow.closure, independent: independentClosure })}`);
    rows.push({ seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey, selectionIdentityAgreement, closureAgreement, closure: independentClosure });
  }

  const completeCount = rows.filter((row) => row.closure.complete).length;
  const acceptance = rows.length >= spec.stage1AcceptanceRule.minimumSelectedRoots && completeCount >= spec.stage1AcceptanceRule.minimumIndependentlyVerifiedCompleteClosures && Object.values(fullScanChecks).every(Boolean) && rows.every((row) => row.selectionIdentityAgreement && row.closureAgreement);
  const verificationCore = {
    missingPendingRejected,
    fullScanChecks,
    uniqueWitnessRootCount: scan.allRoots.length,
    eligibleRootCount: scan.eligible.length,
    selectedRootCount: rows.length,
    independentlyVerifiedCompleteClosures: completeCount,
    allEncounteredRootSetSha256: scan.allEncounteredRootSetSha256,
    eligibleRootSetSha256: scan.eligibleRootSetSha256,
    selectedRootSetSha256: scan.selectedRootSetSha256,
    selectedRootOrderSha256: scan.selectedRootOrderSha256,
    rows,
  };
  const result = {
    schemaVersion: 1,
    programLabel: "G2-04",
    studyId: "REEOE-STUDY1",
    stageId: spec.stageId,
    resultRole: "independent-development-verification-only",
    stage1DevelopmentDecision: acceptance ? spec.stage1AcceptanceRule.passLabel : spec.stage1AcceptanceRule.failLabel,
    scientificInferenceAuthorized: false,
    formalExactDecisionAuthorized: false,
    stage2ExecutionAuthorized: false,
    productionResultFileSha256: sha256Bytes(productionBytes),
    verification: verificationCore,
    verificationCoreSha256: sha256Stable(verificationCore),
    forbiddenRetrogradeOutcomeInspectionPerformed: false,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopened = readJson(outputPath);
  if (sha256Stable(reopened.verification) !== result.verificationCoreSha256) throw new Error("Stage 1 v2 independent reopen/hash mismatch");
  if (!acceptance) throw new Error(`Stage 1 v2 development acceptance failed: selected=${rows.length} complete=${completeCount}`);
  console.log(JSON.stringify({ outputPath, stage1DevelopmentDecision: result.stage1DevelopmentDecision, uniqueWitnessRootCount: scan.allRoots.length, eligibleRootCount: scan.eligible.length, selectedRootCount: rows.length, independentlyVerifiedCompleteClosures: completeCount, fullScanChecks, selectedRoots: rows, productionResultFileSha256: result.productionResultFileSha256, verificationCoreSha256: result.verificationCoreSha256 }, null, 2));
}
main();
