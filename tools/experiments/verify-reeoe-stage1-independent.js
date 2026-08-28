"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const E = require("../public/engine.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/local/reeoe-stage1-development/production-result.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/reeoe-stage1-development/independent-verification.json");

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Bytes(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sha256Stable(value) {
  return sha256Bytes(Buffer.from(stableStringify(value)));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function assertIntegerArray(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || values.some((v) => !Number.isInteger(v) || v < 0)) {
    throw new Error(`Independent invalid ${label}`);
  }
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
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2
    || state.houseOwned.some((v) => typeof v !== "boolean")) throw new Error(`Independent invalid houseOwned:${label}`);
  if (![0, 1].includes(state.player)) throw new Error(`Independent invalid player:${label}`);
  if (state.phase !== "mtaji") throw new Error(`Independent root phase must be mtaji:${label}`);
  if (state.winner !== null) throw new Error(`Independent root must be nonterminal:${label}`);
  return true;
}

function representedSeeds(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0)
    + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
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
  return E.moveVariants(state)
    .map((move) => clone(move))
    .sort((a, b) => V.moveKey(a).localeCompare(V.moveKey(b)));
}

function regenerateRoot(seed, targetPly) {
  const random = seededRandomIndependent(seed);
  let state = E.initialState();
  for (let ply = 0; ply < targetPly; ply += 1) {
    if (state.winner !== null) throw new Error(`Independent trajectory terminated before target: seed=${seed} ply=${ply}`);
    const moves = exactVariants(state);
    if (!moves.length) throw new Error(`Independent trajectory no move: seed=${seed} ply=${ply}`);
    const index = Math.min(moves.length - 1, Math.floor(random() * moves.length));
    const next = E.applyMove(state, moves[index]).state;
    if (next.reason === "relay-limit") throw new Error(`Independent runtime relay guard before target: seed=${seed} ply=${ply}`);
    state = next;
  }
  return state;
}

function nonEmptyPitCount(state) {
  return state.pits.flat(2).filter((value) => value > 0).length;
}

function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}

function verifyAuthorization(auth) {
  if (auth.executionAuthorized !== true || auth.scientificInferenceAuthorized !== false
    || auth.formalExactDecisionAuthorized !== false || auth.stage2ExecutionAuthorized !== false) {
    throw new Error("Independent invalid Stage 1 authorization flags");
  }
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha)) {
    const observed = gitBlob(relative);
    if (observed !== expected) throw new Error(`Independent Stage 1 source freeze mismatch ${relative}`);
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
    deterministicWorkUnits: closure.complete && closure.branching
      ? closure.branching.expandedStates + closure.edgeCount
      : null,
  };
}

function main() {
  const productionPath = path.resolve(process.argv[2] || DEFAULT_PRODUCTION);
  const outputPath = path.resolve(process.argv[3] || DEFAULT_OUTPUT);
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  verifyAuthorization(auth);
  const productionBytes = fs.readFileSync(productionPath);
  const production = JSON.parse(productionBytes.toString("utf8"));
  if (production.studyId !== "REEOE-STUDY1" || production.stageId !== spec.stageId) throw new Error("Stage 1 production identity mismatch");
  if (production.scientificInferenceAuthorized !== false || production.formalExactDecisionAuthorized !== false
    || production.stage2ExecutionAuthorized !== false || production.forbiddenOutcomeInspectionPerformed !== false) {
    throw new Error("Stage 1 production authorization boundary mismatch");
  }

  const missingPending = E.initialState();
  delete missingPending.pending;
  let missingPendingRejected = false;
  try {
    strictRawState(missingPending, "missing-pending-control");
  } catch (error) {
    missingPendingRejected = String(error.message).startsWith("INDEPENDENT-MISSING-PENDING:");
  }
  if (!missingPendingRejected) throw new Error("Independent Stage 1 validator accepted missing pending");

  const closureOptions = {
    maxStates: spec.perRootClosureResourceProfile.maximumStates,
    maxEdges: spec.perRootClosureResourceProfile.maximumEdges,
    maxMicrostates: spec.perRootClosureResourceProfile.maximumMoveMicrostates,
  };

  const rows = [];
  for (const row of production.development.selectedRoots) {
    const state = regenerateRoot(row.seed, row.ply);
    strictRawState(state, `regenerated:${row.rootStateKey}`);
    if (representedSeeds(state) !== 64) throw new Error(`Independent seed conservation failure ${row.rootStateKey}`);
    const rootKey = V.stateKey(state);
    const legalMoveCount = V.legalMtajiMoves(state).length;
    const structure = {
      rootKey,
      nonEmptyPitCount: nonEmptyPitCount(state),
      exactLegalMoveCount: legalMoveCount,
    };
    const identityAgreement = rootKey === row.rootStateKey
      && structure.nonEmptyPitCount === row.nonEmptyPitCount
      && structure.exactLegalMoveCount === row.exactLegalMoveCount;
    if (!identityAgreement) throw new Error(`Independent selected-root mismatch ${row.rootStateKey}`);

    const independentClosure = normalizeIndependentClosure(V.enumerateClosure([state], closureOptions));
    const productionClosure = row.closure;
    const closureAgreement = stableStringify(independentClosure) === stableStringify(productionClosure);
    if (!closureAgreement) {
      throw new Error(`Independent closure mismatch ${row.rootStateKey}: ${JSON.stringify({ productionClosure, independentClosure })}`);
    }
    rows.push({
      seed: row.seed,
      ply: row.ply,
      rootStateKey: row.rootStateKey,
      identityAgreement,
      closureAgreement,
      closure: independentClosure,
    });
  }

  const selectedCount = rows.length;
  const completeCount = rows.filter((row) => row.closure.complete).length;
  const acceptance = selectedCount >= spec.stage1AcceptanceRule.minimumSelectedRoots
    && completeCount >= spec.stage1AcceptanceRule.minimumIndependentlyVerifiedCompleteClosures
    && rows.every((row) => row.identityAgreement && row.closureAgreement);

  const verificationCore = {
    missingPendingRejected,
    selectedRootCount: selectedCount,
    independentlyVerifiedCompleteClosures: completeCount,
    selectedRootSetSha256: sha256Bytes(Buffer.from(rows.map((row) => row.rootStateKey).sort().join("\n"))),
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
  if (sha256Stable(reopened.verification) !== result.verificationCoreSha256) throw new Error("Stage 1 independent reopen/hash mismatch");
  if (!acceptance) throw new Error(`Stage 1 development acceptance failed: selected=${selectedCount} complete=${completeCount}`);

  console.log(JSON.stringify({
    outputPath,
    stage1DevelopmentDecision: result.stage1DevelopmentDecision,
    selectedRootCount: selectedCount,
    independentlyVerifiedCompleteClosures: completeCount,
    selectedRoots: rows,
    productionResultFileSha256: result.productionResultFileSha256,
    verificationCoreSha256: result.verificationCoreSha256,
  }, null, 2));
}

main();
