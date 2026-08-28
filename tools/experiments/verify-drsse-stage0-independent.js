#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const engine = require("../../public/engine.js");
const ind = require("./lib/drsse-independent.js");

const STAGE_ID = "DRSSE-S0-TECHNICAL-2026-08-28-v1";
const OUT_DIR = process.env.DRSSE_STAGE0_OUT
  ? path.resolve(process.env.DRSSE_STAGE0_OUT)
  : path.resolve(__dirname, "../../artifacts/local/deep-raw-state-space-enumeration/stage0-technical-v1");

const PROFILE = Object.freeze({
  maxCumulativeDistinctRawStates: 10000,
  maxDepthLabelledEdges: 50000,
  maxParentStateExpansions: 10000,
  maxMoveEvaluations: 50000,
  maxCumulativeTreeNodeOccurrences: 1000000,
  maxResidentSetBytes: 2147483648,
  maxWallClockSeconds: 180,
  maxUncompressedArtifactBytes: 67108864,
});

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function expectFailure(label, fn) {
  let failed = false;
  try { fn(); } catch (_) { failed = true; }
  ensure(failed, `negative control not detected: ${label}`);
  return true;
}

function loadCore(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, "result-core.json"), "utf8"));
}

function copyDir() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "drsse-s0-negative-"));
  fs.cpSync(OUT_DIR, temp, { recursive: true });
  return temp;
}

function rewriteFirstJsonlRow(filePath, mutator) {
  const lines = fs.readFileSync(filePath, "utf8").trimEnd().split("\n");
  const row = JSON.parse(lines[0]);
  mutator(row);
  lines[0] = JSON.stringify(row);
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function removeLastJsonlRow(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").trimEnd().split("\n");
  lines.pop();
  fs.writeFileSync(filePath, lines.length ? `${lines.join("\n")}\n` : "", "utf8");
}

function main() {
  const core = loadCore(OUT_DIR);
  ensure(core.stageId === STAGE_ID, "Stage 0 core stage mismatch");
  const materialized = ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: core });
  const agreement = ind.verifyIndependentAgreement({
    engine,
    rootState: engine.initialState(),
    targetDepth: 2,
    profile: PROFILE,
    productionCore: core,
  });

  const invalid = engine.initialState();
  delete invalid.pending;
  const controls = {};
  controls.missingPending = expectFailure("missing pending", () => ind.checkState(invalid));

  {
    const temp = copyDir();
    const corruptCore = loadCore(temp);
    const stateFile = path.join(temp, corruptCore.layers[1].stateFile);
    rewriteFirstJsonlRow(stateFile, (row) => { row.stateKey = "0".repeat(64); });
    controls.rawKeyCorruption = expectFailure("raw key corruption", () => ind.verifyMaterialized({ engine, outDir: temp, productionCore: corruptCore }));
  }
  {
    const temp = copyDir();
    const corruptCore = loadCore(temp);
    const stateFile = path.join(temp, corruptCore.layers[2].stateFile);
    removeLastJsonlRow(stateFile);
    controls.missingSuccessor = expectFailure("missing successor", () => ind.verifyMaterialized({ engine, outDir: temp, productionCore: corruptCore }));
  }
  {
    const temp = copyDir();
    const corruptCore = loadCore(temp);
    const edgeFile = path.join(temp, corruptCore.parentLayers[1].edgeFile);
    removeLastJsonlRow(edgeFile);
    controls.missingEdge = expectFailure("missing edge", () => ind.verifyMaterialized({ engine, outDir: temp, productionCore: corruptCore }));
  }
  {
    const temp = copyDir();
    const corruptCore = loadCore(temp);
    const stateFile = path.join(temp, corruptCore.layers[1].stateFile);
    rewriteFirstJsonlRow(stateFile, (row) => { row.depth = 99; });
    controls.depthMisassignment = expectFailure("depth misassignment", () => ind.verifyMaterialized({ engine, outDir: temp, productionCore: corruptCore }));
  }
  {
    const corruptCore = JSON.parse(JSON.stringify(core));
    corruptCore.layers[1].uniqueRawStateCount += 1;
    controls.uniqueStateAccounting = expectFailure("unique state accounting", () => ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: corruptCore }));
  }
  {
    const corruptCore = JSON.parse(JSON.stringify(core));
    corruptCore.layers[1].treeNodeOccurrences = String(BigInt(corruptCore.layers[1].treeNodeOccurrences) - 1n);
    controls.treeOccurrenceUndercount = expectFailure("tree occurrence undercount", () => ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: corruptCore }));
  }
  {
    const corruptCore = JSON.parse(JSON.stringify(core));
    corruptCore.layers[2].arrival.predecessorMultiplicityHistogram = { "999": 1 };
    controls.predecessorCorruption = expectFailure("predecessor corruption", () => ind.verifyMaterialized({ engine, outDir: OUT_DIR, productionCore: corruptCore }));
  }

  const passed = materialized.passed && agreement.passed && Object.values(controls).every(Boolean);
  ensure(passed, "Stage 0 independent verification failed");
  const result = {
    schemaVersion: 1,
    studyId: "DRSSE-STUDY1",
    stageId: STAGE_ID,
    resultClass: "TECHNICAL-DIAGNOSTIC-ONLY",
    scientificInferenceAuthorized: false,
    passed,
    materialized,
    independentCoreSha256: agreement.independentCoreSha256,
    negativeControls: controls,
    importsProductionEnumerator: false,
    importsProductionSerializer: false,
  };
  fs.writeFileSync(path.join(OUT_DIR, "stage0-independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`DRSSE_STAGE0_INDEPENDENT=${JSON.stringify(result)}`);
}

main();
