#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const ind = require("./lib/drsse-independent.js");

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

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}

function moves(state) {
  ind.checkState(state);
  return engine.moveVariants(state)
    .map(ind.normalizedMove)
    .sort((a, b) => ind.moveSignature(a).localeCompare(ind.moveSignature(b)));
}

function generateCandidates(seed, maxPly) {
  const random = seededRandom(seed);
  let state = engine.initialState();
  let namuaCandidate = null;
  let mtajiCandidate = null;
  let mtajiEncounteredAtOrAfter44 = false;
  for (let ply = 0; ply <= maxPly; ply += 1) {
    ind.checkState(state);
    if (ply === 12 && state.phase === "namua" && state.winner === null) {
      namuaCandidate = { seed, ply, phase: "namua", state: ind.rawCopy(state), rootStateKey: ind.rawKey(state) };
    }
    if (ply >= 44 && !mtajiEncounteredAtOrAfter44 && state.phase === "mtaji") {
      mtajiEncounteredAtOrAfter44 = true;
      if (state.winner === null) {
        mtajiCandidate = { seed, ply, phase: "mtaji", state: ind.rawCopy(state), rootStateKey: ind.rawKey(state) };
      }
    }
    if (state.winner !== null || ply === maxPly) break;
    const legal = moves(state);
    ensure(legal.length > 0, `independent running state has zero moves seed=${seed} ply=${ply}`);
    const index = Math.min(legal.length - 1, Math.floor(random() * legal.length));
    state = engine.applyMove(state, legal[index]).state;
    ind.checkState(state);
    if (state.reason === "relay-limit") throw new Error("independent trajectory relay-limit");
  }
  return { namuaCandidate, mtajiCandidate };
}

function select(spec) {
  const roots = { namua: [], mtaji: [] };
  const seen = new Set();
  const initialKey = ind.rawKey(engine.initialState());
  let lastSeedScanned = null;
  for (let seed = spec.freshTrajectoryBlock.seedBase; seed <= spec.freshTrajectoryBlock.seedEnd; seed += 1) {
    lastSeedScanned = seed;
    const candidates = generateCandidates(seed, spec.freshTrajectoryBlock.maxPly);
    for (const phase of ["namua", "mtaji"]) {
      const required = spec.rootSelection[phase].requiredRoots;
      if (roots[phase].length >= required) continue;
      const candidate = candidates[`${phase}Candidate`];
      if (!candidate) continue;
      ensure(candidate.rootStateKey !== initialKey, "independent initial root selected");
      if (seen.has(candidate.rootStateKey)) continue;
      seen.add(candidate.rootStateKey);
      roots[phase].push(candidate);
    }
    if (roots.namua.length === spec.rootSelection.namua.requiredRoots
      && roots.mtaji.length === spec.rootSelection.mtaji.requiredRoots) break;
  }
  return { roots, lastSeedScanned, initialKey };
}

function profile(spec) {
  const x = spec.localEnumeration;
  return {
    maxCumulativeDistinctRawStates: x.maxCumulativeDistinctRawStatesPerRoot,
    maxDepthLabelledEdges: x.maxDepthLabelledEdgesPerRoot,
    maxParentStateExpansions: x.maxParentStateExpansionsPerRoot,
    maxMoveEvaluations: x.maxMoveEvaluationsPerRoot,
    maxCumulativeTreeNodeOccurrences: x.maxCumulativeTreeNodeOccurrencesPerRoot,
    maxResidentSetBytes: x.maxResidentSetBytes,
    maxWallClockSeconds: x.maxWallClockSecondsTotal,
    maxUncompressedArtifactBytes: x.maxUncompressedArtifactBytesTotal,
  };
}

function verifyAuthorization(spec, auth) {
  ensure(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "independent auth identity mismatch");
  ensure(auth.executionAuthorized === true && auth.scientificInferenceAuthorized === false && auth.stage2ExecutionAuthorized === false,
    "independent auth flags invalid");
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    ensure(gitBlob(relative) === expected, `independent source freeze mismatch ${relative}`);
  }
}

function compactSelection(selected) {
  return {
    seedBase: null,
    seedEnd: null,
    lastSeedScanned: selected.lastSeedScanned,
    initialRawStateKeyExcluded: selected.initialKey,
    namua: selected.roots.namua.map((root) => ({ seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey })),
    mtaji: selected.roots.mtaji.map((root) => ({ seed: root.seed, ply: root.ply, rootStateKey: root.rootStateKey })),
  };
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  const summaryPath = path.join(OUT_DIR, "stage1-production-summary.json");
  const production = readJson(summaryPath);
  verifyAuthorization(spec, auth);
  ensure(production.studyId === spec.studyId && production.stageId === spec.stageId, "production summary identity mismatch");
  ensure(production.scientificInferenceAuthorized === false && production.stage2ExecutionAuthorized === false,
    "production firewall invalid");
  ensure(production.specFileSha256 === sha256File(SPEC_PATH), "Stage 1 spec file hash mismatch");
  ensure(production.authorizationFileSha256 === sha256File(AUTH_PATH), "Stage 1 auth file hash mismatch");

  const selected = select(spec);
  const independentSelection = compactSelection(selected);
  independentSelection.seedBase = spec.freshTrajectoryBlock.seedBase;
  independentSelection.seedEnd = spec.freshTrajectoryBlock.seedEnd;
  ensure(ind.canonical(independentSelection) === ind.canonical(production.selection), "independent Stage 1 root selection mismatch");

  const regeneratedByKey = new Map([
    ...selected.roots.namua,
    ...selected.roots.mtaji,
  ].map((root) => [root.rootStateKey, root]));

  const rootVerification = [];
  let independentlyComplete = 0;
  for (const row of production.selectedRoots) {
    const regenerated = regeneratedByKey.get(row.rootStateKey);
    ensure(regenerated, `production root not independently selected: ${row.rootStateKey}`);
    ensure(ind.rawKey(row.rawState) === row.rootStateKey, `stored root RAW key mismatch: ${row.rootStateKey}`);
    ensure(ind.canonical(ind.rawCopy(row.rawState)) === ind.canonical(ind.rawCopy(regenerated.state)),
      `stored root differs from independent trajectory replay: ${row.rootStateKey}`);
    const rootDir = path.join(OUT_DIR, row.artifactDirectory);
    const core = readJson(path.join(rootDir, "result-core.json"));
    ensure(core.rootStateKey === row.rootStateKey, `root core identity mismatch: ${row.rootStateKey}`);
    ensure(core.resultCoreSha256 === row.resultCoreSha256, `root result core hash mismatch: ${row.rootStateKey}`);
    const materialized = ind.verifyMaterialized({ engine, outDir: rootDir, productionCore: core });
    let fullAgreement = null;
    if (core.targetComplete) {
      fullAgreement = ind.verifyIndependentAgreement({
        engine,
        rootState: regenerated.state,
        targetDepth: spec.localEnumeration.targetDepth,
        profile: profile(spec),
        productionCore: core,
      });
      independentlyComplete += 1;
    }
    rootVerification.push({
      phase: row.phase,
      ordinal: row.ordinal,
      seed: row.seed,
      ply: row.ply,
      rootStateKey: row.rootStateKey,
      targetComplete: core.targetComplete,
      lastCompleteDepth: core.lastCompleteDepth,
      materializedPassed: materialized.passed,
      fullIndependentAgreementPassed: fullAgreement ? fullAgreement.passed : false,
      independentCoreSha256: fullAgreement ? fullAgreement.independentCoreSha256 : null,
    });
  }

  const selectionComplete = selected.roots.namua.length === spec.rootSelection.namua.requiredRoots
    && selected.roots.mtaji.length === spec.rootSelection.mtaji.requiredRoots;
  const independentlyReady = selectionComplete
    && production.productionReadiness === true
    && production.selectedRoots.length === 6
    && independentlyComplete === 6
    && rootVerification.every((row) => row.materializedPassed && row.fullIndependentAgreementPassed);

  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    scientificInferenceAuthorized: false,
    formalStage2EvidenceAuthorized: false,
    stage2ExecutionAuthorized: false,
    integrityPassed: true,
    readinessPassed: independentlyReady,
    decision: independentlyReady ? "STAGE1-DEVELOPMENT-PASS" : "STAGE1-DEVELOPMENT-BLOCKED",
    independentSelection,
    rootVerification,
    independentlyCompleteDepth5RootCount: independentlyComplete,
    importsProductionEnumerator: false,
    importsProductionSerializer: false,
    productionSummarySha256: sha256File(summaryPath),
  };
  fs.writeFileSync(path.join(OUT_DIR, "stage1-independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`DRSSE_STAGE1_INDEPENDENT=${JSON.stringify({
    integrityPassed: result.integrityPassed,
    readinessPassed: result.readinessPassed,
    decision: result.decision,
    independentlyCompleteDepth5RootCount: result.independentlyCompleteDepth5RootCount,
  })}`);
}

main();
