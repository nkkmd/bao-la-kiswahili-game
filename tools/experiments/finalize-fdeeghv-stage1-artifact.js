#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_1_FORMAL_SPEC.json");
const OUT_DIR = process.env.FDEGHV_STAGE1_OUT
  ? path.resolve(process.env.FDEGHV_STAGE1_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/stage1-formal-v1");
const RESULT_PATH = path.join(OUT_DIR, "STAGE_1_FORMAL_RESULT.json");
const CORE_PATH = path.join(OUT_DIR, "result-core.json");
const MANIFEST_PATH = path.join(OUT_DIR, "ARTIFACT_MANIFEST.json");

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
}
function hashCanonical(value) { return crypto.createHash("sha256").update(canonical(value), "utf8").digest("hex"); }
function hashBytes(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function writeJson(p, value) { fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
function directoryBytes(root) {
  let total = 0;
  if (!fs.existsSync(root)) return 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    total += entry.isDirectory() ? directoryBytes(p) : fs.statSync(p).size;
  }
  return total;
}
function nonEstimableTargets() {
  return { H1: { decision: "NON-ESTIMABLE" }, H2: { decision: "NON-ESTIMABLE" }, H3: { decision: "NON-ESTIMABLE" }, H4: { decision: "NON-ESTIMABLE" } };
}
function productionLogicalViolations(core, spec) {
  if (!core || !core.resourceUse || !core.cumulative) return ["PRODUCTION-RESOURCE-METADATA-MISSING"];
  const p = spec.resourceProfile;
  const r = core.resourceUse;
  const c = core.cumulative;
  const violations = [];
  if (c.distinctRawStatesThroughLastCompleteDepth > p.maxCumulativeDistinctRawStates) violations.push("UNIQUE_STATE_CAP");
  if (c.depthLabelledLegalEdgesThroughLastCompleteParent > p.maxDepthLabelledEdges) violations.push("DEPTH_LABELLED_EDGE_CAP");
  if (r.parentStateExpansions > p.maxParentStateExpansions) violations.push("PARENT_EXPANSION_CAP");
  if (r.moveEvaluations > p.maxMoveEvaluations) violations.push("MOVE_EVALUATION_CAP");
  if (BigInt(c.treeNodeOccurrencesThroughLastCompleteDepth) > BigInt(p.maxCumulativeTreeNodeOccurrences)) violations.push("TREE_OCCURRENCE_CAP");
  if (r.peakResidentSetBytes >= p.maxResidentSetBytes) violations.push("RSS_CAP");
  if (r.elapsedSeconds >= p.maxWallClockSeconds) violations.push("WALL_CLOCK_CAP");
  return violations;
}
function downgradeExactToNonEstimable(result, reason) {
  if (result.formalDecision !== "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN") return result;
  const targets = nonEstimableTargets();
  result.formalDecision = "NON-ESTIMABLE";
  result.targetDecisions = targets;
  if (result.scientificCore) {
    result.scientificCore.formalDecision = "NON-ESTIMABLE";
    result.scientificCore.targets = targets;
    result.scientificResultCoreSha256 = hashCanonical(result.scientificCore);
  }
  result.finalizationDowngrade = { applied: true, reason };
  return result;
}
function buildManifest() {
  const rows = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (path.resolve(p) !== path.resolve(MANIFEST_PATH)) {
        const data = fs.readFileSync(p);
        rows.push({ path: path.relative(OUT_DIR, p), bytes: data.length, sha256: hashBytes(data) });
      }
    }
  }
  walk(OUT_DIR);
  writeJson(MANIFEST_PATH, { schemaVersion: 2, manifestSelfExcluded: true, files: rows });
}
function finalize() {
  const spec = readJson(SPEC_PATH);
  let result = readJson(RESULT_PATH);
  const core = fs.existsSync(CORE_PATH) ? readJson(CORE_PATH) : null;
  const logicalViolations = productionLogicalViolations(core, spec);
  const productionGateFailed = result.productionFinalResourceGate && result.productionFinalResourceGate.passed === false;
  const independentGateFailed = result.independentResourceGate && result.independentResourceGate.passed === false;
  if ((logicalViolations.length || productionGateFailed || independentGateFailed) && result.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN") {
    result = downgradeExactToNonEstimable(result, "FINAL-RESOURCE-GATE");
  }

  let artifactViolationObserved = Boolean(result.resourceFinalization && result.resourceFinalization.artifactViolationObserved);
  const cap = spec.resourceProfile.maxUncompressedArtifactBytes;
  let stable = false;
  for (let iteration = 1; iteration <= 20; iteration += 1) {
    result.resourceFinalization = {
      productionLogicalViolations: logicalViolations,
      productionGateFailed: Boolean(productionGateFailed),
      independentGateFailed: Boolean(independentGateFailed),
      artifactViolationObserved,
      fixedPointIteration: iteration,
      manifestSelfExcludedFromManifestHashList: true,
      manifestIncludedInArtifactByteCount: true,
    };
    writeJson(RESULT_PATH, result);
    buildManifest();
    const total = directoryBytes(OUT_DIR);
    if (total > cap) artifactViolationObserved = true;
    if (artifactViolationObserved && result.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN") {
      result = downgradeExactToNonEstimable(result, "FINAL-ARTIFACT-BYTE-CAP");
    }
    const desiredGate = {
      passed: !artifactViolationObserved && total <= cap,
      artifactBytes: total,
      maxUncompressedArtifactBytes: cap,
      violationObservedIrrevocably: artifactViolationObserved,
      manifestIncluded: true,
    };
    const priorSerialized = JSON.stringify(result);
    result.artifactFinalResourceGate = desiredGate;
    result.resourceFinalization.artifactViolationObserved = artifactViolationObserved;
    const afterSerialized = JSON.stringify(result);
    if (priorSerialized === afterSerialized) {
      stable = true;
      break;
    }
  }
  if (!stable) throw new Error("final artifact fixed-point did not converge");

  writeJson(RESULT_PATH, result);
  buildManifest();
  const finalBytes = directoryBytes(OUT_DIR);
  if (finalBytes !== result.artifactFinalResourceGate.artifactBytes) {
    result.artifactFinalResourceGate.artifactBytes = finalBytes;
    if (finalBytes > cap) {
      result.artifactFinalResourceGate.passed = false;
      result.artifactFinalResourceGate.violationObservedIrrevocably = true;
      result.resourceFinalization.artifactViolationObserved = true;
      result = downgradeExactToNonEstimable(result, "FINAL-ARTIFACT-BYTE-CAP");
    }
    writeJson(RESULT_PATH, result);
    buildManifest();
  }
  const confirmedBytes = directoryBytes(OUT_DIR);
  if (confirmedBytes !== result.artifactFinalResourceGate.artifactBytes) {
    throw new Error(`final artifact byte accounting unstable: ${confirmedBytes} != ${result.artifactFinalResourceGate.artifactBytes}`);
  }
  console.log(`FDEGHV_STAGE1_FINALIZED=${JSON.stringify({ formalDecision: result.formalDecision, artifactFinalResourceGate: result.artifactFinalResourceGate, productionLogicalViolations: logicalViolations })}`);
}

if (require.main === module) {
  try { finalize(); }
  catch (error) {
    console.error(error);
    process.exitCode = 2;
  }
}

module.exports = { buildManifest, downgradeExactToNonEstimable, nonEstimableTargets, productionLogicalViolations };
