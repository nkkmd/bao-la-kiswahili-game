#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const v2 = require("./verify-fdeeghv-stage1-independent-v2.js");
const finalizer = require("./finalize-fdeeghv-stage1-artifact.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = process.env.FDEGHV_PREACCESS_HARDENING_OUT
  ? path.resolve(process.env.FDEGHV_PREACCESS_HARDENING_OUT)
  : path.join(ROOT, "artifacts/local/fresh-depth10-exact-geometry-holdout/preaccess-hardening");

function ensure(value, message) { if (!value) throw new Error(message); }
function has(violations, value) { return violations.includes(value); }

function syntheticSummary() {
  return {
    cumulative: {
      distinctRawStatesThroughLastCompleteDepth: 3,
      depthLabelledLegalEdgesThroughLastCompleteParent: 4,
      treeNodeOccurrencesThroughLastCompleteDepth: "5",
    },
    parentLayers: [
      { uniqueParentRawStateCount: 2 },
      { uniqueParentRawStateCount: 1 },
    ],
  };
}

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const baseProfile = {
    maxCumulativeDistinctRawStates: 3,
    maxDepthLabelledEdges: 4,
    maxParentStateExpansions: 3,
    maxMoveEvaluations: 4,
    maxCumulativeTreeNodeOccurrences: 5,
    maxResidentSetBytes: 1000,
    maxWallClockSeconds: 100,
    maxUncompressedArtifactBytes: 100000,
  };
  const summary = syntheticSummary();
  const boundary = v2.resourceGate(summary, baseProfile, 99, 999);
  ensure(boundary.passed, `inclusive logical boundary should pass: ${boundary.violations}`);

  const parentGate = v2.resourceGate(summary, { ...baseProfile, maxParentStateExpansions: 2 }, 1, 1);
  ensure(!parentGate.passed && has(parentGate.violations, "PARENT_EXPANSION_CAP"), "parent-expansion cap negative control failed");
  const moveGate = v2.resourceGate(summary, { ...baseProfile, maxMoveEvaluations: 3 }, 1, 1);
  ensure(!moveGate.passed && has(moveGate.violations, "MOVE_EVALUATION_CAP"), "move-evaluation cap negative control failed");
  const rssGate = v2.resourceGate(summary, baseProfile, 1, 1000);
  ensure(!rssGate.passed && has(rssGate.violations, "RSS_CAP"), "RSS strict boundary negative control failed");
  const wallGate = v2.resourceGate(summary, baseProfile, 100, 1);
  ensure(!wallGate.passed && has(wallGate.violations, "WALL_CLOCK_CAP"), "wall strict boundary negative control failed");

  const fakeSpec = { resourceProfile: baseProfile };
  const fakeCore = {
    cumulative: summary.cumulative,
    resourceUse: { parentStateExpansions: 3, moveEvaluations: 4, peakResidentSetBytes: 999, elapsedSeconds: 99 },
  };
  ensure(finalizer.productionLogicalViolations(fakeCore, fakeSpec).length === 0, "finalizer boundary positive control failed");
  ensure(has(finalizer.productionLogicalViolations({ ...fakeCore, resourceUse: { ...fakeCore.resourceUse, parentStateExpansions: 4 } }, fakeSpec), "PARENT_EXPANSION_CAP"), "finalizer parent cap control failed");
  ensure(has(finalizer.productionLogicalViolations({ ...fakeCore, resourceUse: { ...fakeCore.resourceUse, moveEvaluations: 5 } }, fakeSpec), "MOVE_EVALUATION_CAP"), "finalizer move cap control failed");

  const verifierText = fs.readFileSync(path.join(ROOT, "tools/experiments/verify-fdeeghv-stage1-independent-v2.js"), "utf8");
  ensure(!verifierText.includes("drsse-production.js"), "independent V2 imports production enumerator");
  ensure(!verifierText.includes("fdeeghv-contract.js"), "independent V2 imports production target contract");
  ensure(!verifierText.includes("run-fdeeghv-stage1-formal.js"), "independent V2 imports production runner");
  ensure(verifierText.includes("independentEnumerate"), "independent V2 full enumerator binding missing");

  const workflowText = fs.readFileSync(path.join(ROOT, ".github/workflows/fdeeghv-stage1-formal.yml"), "utf8");
  for (const required of [
    "Validate release authorization before durable lease",
    "STAGE_1_CONSUMED.json",
    "GITHUB_RUN_ATTEMPT",
    "verify-fdeeghv-stage1-independent-v2.js",
    "finalize-fdeeghv-stage1-artifact.js",
    "timeout --signal=TERM 5500s node tools/experiments/run-fdeeghv-stage1-formal.js",
  ]) ensure(workflowText.includes(required), `Stage 1 workflow guard missing: ${required}`);
  ensure(!workflowText.includes("node tools/experiments/verify-fdeeghv-stage1-independent.js"), "obsolete independent verifier remains executable in Stage 1 workflow");

  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_1_FORMAL_SPEC.json"), "utf8"));
  ensure(spec.formalDomain.targetDepth === 10 && spec.formalDomain.depth11AccessAuthorized === false, "formal depth firewall changed");
  ensure(spec.firewall.sameEvidenceRerunAuthorized === false && spec.firewall.g2_12EstimatorScientificInputAuthorized === false, "formal firewall changed");

  const result = {
    schemaVersion: 1,
    programLabel: "G3-11",
    studyId: "FDEGHV-STUDY1",
    checkRole: "post-stage0-pre-stage1-source-hardening",
    disposition: "PREACCESS-HARDENING-PASS",
    scientificInferencePerformed: false,
    protectedDepth10Access: false,
    depth10Generated: false,
    depth10Read: false,
    depth10Peeked: false,
    checks: {
      independentLogicalResourceBoundary: true,
      independentParentExpansionNegativeControl: true,
      independentMoveEvaluationNegativeControl: true,
      independentAmbientBoundaryControls: true,
      finalizerLogicalResourceBoundary: true,
      staticImplementationSeparation: true,
      oneShotLeaseGuardsPresent: true,
      finalManifestFinalizerPresent: true,
      formalDepthAndFirewallsUnchanged: true,
    },
  };
  fs.writeFileSync(path.join(OUT, "PREACCESS_HARDENING_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log("FDEGHV_PREACCESS_HARDENING=PASS");
}

try { main(); }
catch (error) { console.error(error); process.exitCode = 2; }
