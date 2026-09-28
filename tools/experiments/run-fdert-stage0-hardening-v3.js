#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const engine = require("../../public/engine.js");
const legacy = require("./lib/drsse-production.js");
const hardened = require("./lib/fdert-production.js");
const ind = require("./lib/drsse-independent.js");
const contract = require("./lib/fdert-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_0_TECHNICAL_SPEC_V3.json");
const AUTH_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/authorizations/STAGE_0_EXECUTE_V3.json");
const OUT_DIR = process.env.FDERT_STAGE0_OUT
  ? path.resolve(process.env.FDERT_STAGE0_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth11-exact-reachability-topology/stage0-hardening-v3");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function profile(base, overrides = {}) { return Object.freeze({ ...base, ...overrides }); }
function tmp(label) { return fs.mkdtempSync(path.join(os.tmpdir(), `fdert-v3-${label}-`)); }
function sameBytes(a, b) { return fs.readFileSync(a).equals(fs.readFileSync(b)); }

function verifyBinding(auth) {
  for (const [relative, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    contract.ensure(gitBlob(relative) === expected, `source freeze mismatch: ${relative}`);
  }
}

function main() {
  const spec = readJson(SPEC_PATH);
  const auth = readJson(AUTH_PATH);
  contract.ensure(spec.studyId === "FDERT-STUDY1", "unexpected Study identity");
  contract.ensure(spec.stageId === "FDERT-S0-HARDENING-2026-09-28-v3", "unexpected Stage identity");
  contract.ensure(spec.scientificInferenceAuthorized === false, "scientific inference opened");
  contract.ensure(spec.protectedDepth11AccessAuthorized === false, "protected access opened");
  contract.ensure(spec.maximumRealFixtureDepth === 2, "fixture depth changed");
  contract.ensure(auth.executionAuthorized === true && auth.executionCountAuthorized === 1, "v3 execution authorization invalid");
  contract.ensure(auth.scientificInferenceAuthorized === false && auth.protectedDepth11AccessAuthorized === false, "v3 authorization opened protected evidence");
  contract.ensure(auth.stage1ExecutionAuthorized === false, "v3 authorization opened Stage 1");
  verifyBinding(auth);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const legacyDir = path.join(OUT_DIR, "legacy-depth2");
  const hardenedDir = path.join(OUT_DIR, "hardened-depth2");

  const legacyCore = legacy.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: legacyDir,
    profile: profile(spec.technicalProfile),
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "TECHNICAL-LEGACY-DEPTH2",
  });
  const hardenedCore = hardened.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    outDir: hardenedDir,
    profile: profile(spec.technicalProfile),
    studyId: spec.studyId,
    stageId: spec.stageId,
    rootLabel: "TECHNICAL-HARDENED-DEPTH2",
  });

  contract.ensure(legacyCore.targetComplete && hardenedCore.targetComplete, "depth-2 comparison fixture incomplete");
  contract.ensure(legacyCore.rootStateKey === spec.requiredRootRawStateKey, "legacy root key mismatch");
  contract.ensure(hardenedCore.rootStateKey === spec.requiredRootRawStateKey, "hardened root key mismatch");
  contract.ensure(
    ind.canonical(ind.projectForComparison(legacyCore)) === ind.canonical(ind.projectForComparison(hardenedCore)),
    "legacy/hardened topology projection mismatch",
  );

  for (const row of legacyCore.layers) {
    const other = hardenedCore.layers.find((x) => x.depth === row.depth);
    contract.ensure(other, `missing hardened layer ${row.depth}`);
    contract.ensure(row.stateFileSha256 === other.stateFileSha256, `state-file SHA mismatch depth ${row.depth}`);
    contract.ensure(sameBytes(path.join(legacyDir, row.stateFile), path.join(hardenedDir, other.stateFile)), `state-file bytes mismatch depth ${row.depth}`);
  }
  for (const row of legacyCore.parentLayers) {
    const other = hardenedCore.parentLayers.find((x) => x.depth === row.depth);
    contract.ensure(other, `missing hardened parent layer ${row.depth}`);
    contract.ensure(row.edgeFileSha256 === other.edgeFileSha256, `edge-file SHA mismatch depth ${row.depth}`);
    contract.ensure(sameBytes(path.join(legacyDir, row.edgeFile), path.join(hardenedDir, other.edgeFile)), `edge-file bytes mismatch depth ${row.depth}`);
  }

  const materialized = ind.verifyMaterialized({ engine, outDir: hardenedDir, productionCore: hardenedCore });
  contract.ensure(materialized.passed === true, "hardened materialized verification failed");
  const independent = ind.verifyIndependentAgreement({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    profile: profile(spec.technicalProfile),
    productionCore: hardenedCore,
  });
  contract.ensure(independent.passed === true, "hardened independent shallow recomputation failed");

  function expectStop(label, overrides, expected) {
    const core = hardened.enumerateExactDepth({
      engine,
      rootState: engine.initialState(),
      targetDepth: 2,
      outDir: tmp(label),
      profile: profile(spec.technicalProfile, overrides),
      studyId: spec.studyId,
      stageId: spec.stageId,
      rootLabel: `TECHNICAL-HARDENED-${label}`,
    });
    contract.ensure(core.targetComplete === false, `${label} did not fail closed`);
    contract.ensure(core.stopReason === expected, `${label} stop mismatch: ${core.stopReason}`);
    return core.stopReason;
  }

  const forcedStops = {
    uniqueState: expectStop("UNIQUE-STATE", { maxCumulativeDistinctRawStates: 1 }, "UNIQUE_STATE_CAP"),
    work: expectStop("MOVE-WORK", { maxMoveEvaluations: 1 }, "MOVE_EVALUATION_CAP"),
    tree: expectStop("TREE", { maxCumulativeTreeNodeOccurrences: 1 }, "TREE_OCCURRENCE_CAP"),
    artifact: expectStop("ARTIFACT", { maxUncompressedArtifactBytes: 1 }, "ARTIFACT_BYTE_CAP"),
  };

  contract.ensure(hardenedCore.materializationMode === "ROW-STREAMED-BOUNDED-MEMORY", "hardened materialization mode missing");

  const result = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: spec.studyId,
    stageId: spec.stageId,
    stageDisposition: "STAGE0-HARDENING-PASS",
    scientificInferencePerformed: false,
    protectedDepth11Access: false,
    stage1ExecutionAuthorized: false,
    maximumRealFixtureDepthObserved: 2,
    legacyHardenedTopologyProjectionExact: true,
    stateFilesByteExact: true,
    edgeFilesByteExact: true,
    hardenedMaterializedIndependentVerification: materialized.passed,
    hardenedFullIndependentShallowRecomputation: independent.passed,
    hardenedMaterializationMode: hardenedCore.materializationMode,
    forcedStops,
    allMandatoryControlsPassed: true,
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
  };
  hardened.writeJson(path.join(OUT_DIR, "STAGE_0_HARDENING_RESULT.json"), result);
  console.log(`FDERT_STAGE0_V3=${JSON.stringify(result)}`);
}

try {
  main();
} catch (error) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failure = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: "FDERT-STUDY1",
    stageId: "FDERT-S0-HARDENING-2026-09-28-v3",
    stageDisposition: "STAGE0-HARDENING-TECHNICAL-INVALID",
    scientificInferencePerformed: false,
    protectedDepth11Access: false,
    stage1ExecutionAuthorized: false,
    message: error && error.message ? error.message : String(error),
  };
  fs.writeFileSync(path.join(OUT_DIR, "STAGE_0_HARDENING_RESULT.json"), `${JSON.stringify(failure, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 2;
}
