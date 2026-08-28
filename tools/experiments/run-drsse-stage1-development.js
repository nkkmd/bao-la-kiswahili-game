#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const prod = require("./lib/drsse-production.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/deep-raw-state-space-enumeration/authorizations/STAGE_1_EXECUTE.json");
const OUT_DIR = process.env.DRSSE_STAGE1_OUT
  ? path.resolve(process.env.DRSSE_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/deep-raw-state-space-enumeration/stage1-development-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function directoryBytes(root) {
  if (!fs.existsSync(root)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    total += entry.isDirectory() ? directoryBytes(p) : fs.statSync(p).size;
  }
  return total;
}

function exactMoves(state) {
  prod.assertStudyState(state);
  return engine.moveVariants(state)
    .map(prod.normalizeMove)
    .sort((a, b) => prod.moveKey(a).localeCompare(prod.moveKey(b)));
}

function strictNext(state, move) {
  prod.assertStudyState(state);
  const next = engine.applyMove(state, move).state;
  prod.assertStudyState(next);
  if (next.reason === "relay-limit") throw new Error("TRAJECTORY-RELAY-LIMIT");
  return next;
}

function generateSeedCandidates(seed, maxPly) {
  const random = seededRandom(seed);
  let state = engine.initialState();
  let namuaCandidate = null;
  let mtajiCandidate = null;
  let mtajiEncounteredAtOrAfter44 = false;

  for (let ply = 0; ply <= maxPly; ply += 1) {
    prod.assertStudyState(state);
    if (ply === 12 && state.phase === "namua" && state.winner === null) {
      namuaCandidate = {
        seed,
        ply,
        phase: "namua",
        state: prod.rawRuleState(state),
        rootStateKey: prod.stateKey(state),
      };
    }
    if (ply >= 44 && !mtajiEncounteredAtOrAfter44 && state.phase === "mtaji") {
      mtajiEncounteredAtOrAfter44 = true;
      if (state.winner === null) {
        mtajiCandidate = {
          seed,
          ply,
          phase: "mtaji",
          state: prod.rawRuleState(state),
          rootStateKey: prod.stateKey(state),
        };
      }
    }
    if (state.winner !== null || ply === maxPly) break;
    const moves = exactMoves(state);
    ensure(moves.length > 0, `running nonterminal state has zero moves seed=${seed} ply=${ply}`);
    const index = Math.min(moves.length - 1, Math.floor(random() * moves.length));
    state = strictNext(state, moves[index]);
  }
  return { namuaCandidate, mtajiCandidate };
}

function selectRoots(spec) {
  const roots = { namua: [], mtaji: [] };
  const seen = new Set();
  const initialKey = prod.stateKey(engine.initialState());
  let lastSeedScanned = null;

  for (let seed = spec.freshTrajectoryBlock.seedBase; seed <= spec.freshTrajectoryBlock.seedEnd; seed += 1) {
    lastSeedScanned = seed;
    const candidates = generateSeedCandidates(seed, spec.freshTrajectoryBlock.maxPly);
    for (const phase of ["namua", "mtaji"]) {
      const required = spec.rootSelection[phase].requiredRoots;
      if (roots[phase].length >= required) continue;
      const candidate = candidates[`${phase}Candidate`];
      if (!candidate) continue;
      ensure(candidate.rootStateKey !== initialKey, "initial root illegally selected for Stage 1");
      if (seen.has(candidate.rootStateKey)) continue;
      seen.add(candidate.rootStateKey);
      roots[phase].push(candidate);
    }
    if (roots.namua.length === spec.rootSelection.namua.requiredRoots
      && roots.mtaji.length === spec.rootSelection.mtaji.requiredRoots) break;
  }

  return { roots, lastSeedScanned, initialKey };
}

function verifyAuthorization(spec, auth) {
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "Stage 1 authorization identity mismatch");
  ensure(auth.executionAuthorized === true, "Stage 1 execution not authorized");
  ensure(auth.scientificInferenceAuthorized === false, "Stage 1 scientific inference must remain false");
  ensure(auth.stage2ExecutionAuthorized === false, "Stage 2 must remain unauthorized");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    ensure(gitBlob(relative) === expected, `Stage 1 source freeze mismatch: ${relative}`);
  }
}

function rootProfile(spec) {
  const local = spec.localEnumeration;
  return Object.freeze({
    maxCumulativeDistinctRawStates: local.maxCumulativeDistinctRawStatesPerRoot,
    maxDepthLabelledEdges: local.maxDepthLabelledEdgesPerRoot,
    maxParentStateExpansions: local.maxParentStateExpansionsPerRoot,
    maxMoveEvaluations: local.maxMoveEvaluationsPerRoot,
    maxCumulativeTreeNodeOccurrences: local.maxCumulativeTreeNodeOccurrencesPerRoot,
    maxResidentSetBytes: local.maxResidentSetBytes,
    maxWallClockSeconds: local.maxWallClockSecondsTotal,
    maxUncompressedArtifactBytes: local.maxUncompressedArtifactBytesTotal,
  });
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  ensure(spec.studyId === "DRSSE-STUDY1" && spec.stageId === "DRSSE-S1-DEVELOPMENT-2026-08-28-v1", "unexpected Stage 1 spec");
  verifyAuthorization(spec, auth);
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const start = process.hrtime.bigint();
  const selected = selectRoots(spec);
  const orderedRoots = [
    ...selected.roots.namua.map((root, i) => ({ ...root, ordinal: i + 1 })),
    ...selected.roots.mtaji.map((root, i) => ({ ...root, ordinal: i + 1 })),
  ];
  const profile = rootProfile(spec);
  const rootResults = [];
  let totalWallStop = false;

  for (const root of orderedRoots) {
    const elapsed = Number(process.hrtime.bigint() - start) / 1e9;
    if (elapsed >= spec.localEnumeration.maxWallClockSecondsTotal) {
      totalWallStop = true;
      break;
    }
    const label = `${root.phase}-${root.ordinal}-seed-${root.seed}-ply-${root.ply}`;
    const rootDir = path.join(OUT_DIR, `root-${root.phase}-${String(root.ordinal).padStart(2, "0")}`);
    const core = prod.enumerateExactDepth({
      engine,
      rootState: root.state,
      targetDepth: spec.localEnumeration.targetDepth,
      outDir: rootDir,
      profile,
      studyId: spec.studyId,
      stageId: spec.stageId,
      rootLabel: label,
    });
    rootResults.push({
      phase: root.phase,
      ordinal: root.ordinal,
      seed: root.seed,
      ply: root.ply,
      rootStateKey: root.rootStateKey,
      rawState: root.state,
      artifactDirectory: path.basename(rootDir),
      resultCoreSha256: core.resultCoreSha256,
      targetComplete: core.targetComplete,
      lastCompleteDepth: core.lastCompleteDepth,
      firstIncompleteDepth: core.firstIncompleteDepth,
      stopReason: core.stopReason,
      cumulative: core.cumulative,
      resourceUse: core.resourceUse,
    });
    if (directoryBytes(OUT_DIR) > spec.localEnumeration.maxUncompressedArtifactBytesTotal) break;
  }

  const elapsedSeconds = Number(process.hrtime.bigint() - start) / 1e9;
  const selectionComplete = selected.roots.namua.length === spec.rootSelection.namua.requiredRoots
    && selected.roots.mtaji.length === spec.rootSelection.mtaji.requiredRoots;
  const enumerationComplete = rootResults.length === 6
    && rootResults.every((row) => row.targetComplete && row.lastCompleteDepth === spec.localEnumeration.targetDepth);
  const withinTotalWall = !totalWallStop && elapsedSeconds < spec.localEnumeration.maxWallClockSecondsTotal;
  const artifactBytes = directoryBytes(OUT_DIR);
  const withinArtifactCap = artifactBytes <= spec.localEnumeration.maxUncompressedArtifactBytesTotal;
  const productionReadiness = selectionComplete && enumerationComplete && withinTotalWall && withinArtifactCap;

  const selectionCore = {
    seedBase: spec.freshTrajectoryBlock.seedBase,
    seedEnd: spec.freshTrajectoryBlock.seedEnd,
    lastSeedScanned: selected.lastSeedScanned,
    initialRawStateKeyExcluded: selected.initialKey,
    namua: selected.roots.namua.map((root) => ({ seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey })),
    mtaji: selected.roots.mtaji.map((root) => ({ seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey })),
  };

  const summary = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "development-resource-characterization-only",
    scientificInferenceAuthorized: false,
    formalStage2EvidenceAuthorized: false,
    stage2ExecutionAuthorized: false,
    specFileSha256: sha256File(SPEC_PATH),
    authorizationFileSha256: sha256File(AUTH_PATH),
    selection: selectionCore,
    selectionCoreSha256: prod.sha256Text(prod.stableStringify(selectionCore)),
    selectedRoots: rootResults,
    selectedNamuaRootCount: selected.roots.namua.length,
    selectedMtajiRootCount: selected.roots.mtaji.length,
    locallyEnumeratedRootCount: rootResults.length,
    completeDepth5RootCount: rootResults.filter((row) => row.targetComplete).length,
    totalElapsedSeconds: elapsedSeconds,
    totalArtifactBytesBeforeSummary: artifactBytes,
    productionReadiness,
    productionStatus: productionReadiness ? "PRODUCTION-READY-PENDING-INDEPENDENT" : "STAGE1-DEVELOPMENT-BLOCKED",
    independentVerificationRequired: true,
    firewall: spec.firewall,
  };
  summary.developmentCoreSha256 = prod.sha256Text(prod.stableStringify(summary));
  prod.writeJson(path.join(OUT_DIR, "stage1-production-summary.json"), summary);
  console.log(`DRSSE_STAGE1_PRODUCTION=${JSON.stringify({
    productionStatus: summary.productionStatus,
    selectedNamuaRootCount: summary.selectedNamuaRootCount,
    selectedMtajiRootCount: summary.selectedMtajiRootCount,
    completeDepth5RootCount: summary.completeDepth5RootCount,
    lastSeedScanned: selected.lastSeedScanned,
    developmentCoreSha256: summary.developmentCoreSha256,
  })}`);
}

main();
