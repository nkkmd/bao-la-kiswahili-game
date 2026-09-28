#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const ind = require("./lib/drsse-independent.js");
const contract = require("./lib/fdert-stage1-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_1_PROTECTED_EXACT_SPEC.json");
const S0V2_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json");
const S0V3_PATH = path.join(ROOT, "doc/fresh-depth11-exact-reachability-topology/results/stage-0-v3/STAGE_0_HARDENING_RESULT.json");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function gitBlob(relative) {
  return childProcess.execFileSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" }).trim();
}
function need(condition, message) { if (!condition) throw new Error(message); }

function main() {
  const spec = readJson(SPEC_PATH);
  const s0v2 = readJson(S0V2_PATH);
  const s0v3 = readJson(S0V3_PATH);

  need(spec.studyId === "FDERT-STUDY1", "Study identity mismatch");
  need(spec.stageId === "FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1", "Stage identity mismatch");
  need(spec.formalDomain.targetDepth === 11 && spec.formalDomain.depth12AccessAuthorized === false, "depth contract invalid");
  need(spec.representation.mode === "RAW-ONLY" && spec.representation.validatedTransformSet.length === 0, "representation contract invalid");
  need(spec.representation.symmetryReductionAuthorized === false && spec.representation.canonicalizationAuthorized === false, "transform firewall invalid");
  need(spec.firewall.g2_12EstimatorScientificInputAuthorized === false, "G2-12 firewall invalid");
  need(spec.firewall.historicalSearchDepth11ScientificInputAuthorized === false, "search-depth firewall invalid");
  need(spec.firewall.depth11PartialProbeBeforeAuthorizationAuthorized === false, "preaccess probe firewall invalid");
  need(spec.firewall.outcomeDrivenCapIncreaseAuthorized === false && spec.firewall.sameEvidenceRerunAuthorized === false, "no-rescue firewall invalid");
  need(s0v2.stageDisposition === "STAGE0-PASS" && s0v2.protectedDepth11Access === false, "Stage 0 v2 not PASS/sealed");
  need(s0v3.stageDisposition === "STAGE0-HARDENING-PASS" && s0v3.protectedDepth11Access === false, "Stage 0 v3 not PASS/sealed");

  need(ind.rawKey(engine.initialState()) === spec.formalDomain.requiredRootRawStateKey, "current engine standard-root identity mismatch");

  const historicalPath = spec.historicalPrefixIntegrityReference.canonicalResultPath;
  need(gitBlob(historicalPath) === spec.historicalPrefixIntegrityReference.canonicalResultGitBlobSha, "historical G3-11 result blob mismatch");
  const historical = readJson(path.join(ROOT, historicalPath));
  need(historical.formalDecision === "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN", "historical G3-11 decision mismatch");
  need(historical.scientificCore && historical.scientificCore.targetDepth === 10, "historical scientific core mismatch");

  const productionSource = fs.readFileSync(path.join(ROOT, "tools/experiments/run-fdert-stage1-protected.js"), "utf8");
  const verifierSource = fs.readFileSync(path.join(ROOT, "tools/experiments/verify-fdert-stage1-independent.js"), "utf8");
  need(productionSource.includes("fdert-production.js"), "Stage 1 production runner not bound to hardened enumerator");
  need(!verifierSource.includes("fdert-production.js"), "independent verifier imports G4-10 production module");
  need(!verifierSource.includes("drsse-production.js"), "independent verifier imports historical production module");
  need(verifierSource.includes("drsse-independent.js"), "independent verifier missing independent enumerator");

  const p = spec.resourceProfile;
  need(p.maxCumulativeDistinctRawStates === 2000000, "state ceiling changed");
  need(p.maxDepthLabelledEdges === 12000000 && p.maxMoveEvaluations === 12000000, "edge/work ceiling changed");
  need(p.maxResidentSetBytes === 12884901888, "RSS ceiling changed");
  need(p.maxWallClockSeconds === 7200, "wall ceiling changed");
  need(p.maxUncompressedArtifactBytes === 2147483648, "artifact ceiling changed");
  need(p.maxNodeOldSpaceMiB === 10240, "Node heap ceiling changed");

  const synthetic = {
    targetComplete: true,
    targetDepth: 11,
    layers: [
      { depth: 10, cumulativeTreeNodeOccurrences: "100", cumulativeRawStateCount: 80 },
      {
        depth: 11,
        newRawStateCount: 40,
        uniqueRawStateCount: 40,
        treeNodeOccurrences: "60",
        cumulativeTreeNodeOccurrences: "160",
        cumulativeRawStateCount: 120,
        arrival: { duplicateArrivalCount: 7, statesWithMultiplePredecessors: 5 }
      }
    ]
  };
  const targets = contract.targetValues(synthetic);
  need(targets.T1.condition === true, "T1 synthetic control failed");
  need(targets.T2.condition === true, "T2 synthetic control failed");
  need(targets.T3.condition === true, "T3 synthetic control failed");
  need(targets.T4.condition === true, "T4 synthetic control failed");
  const labels = contract.labelTargets(targets);
  need(Object.values(labels).every((x) => x.decision === "DEEPER-CONFIRMED"), "target labeling control failed");
  need(Object.values(contract.nonEstimableTargets()).every((x) => x.decision === "NON-ESTIMABLE"), "non-estimable target control failed");

  const result = {
    schemaVersion: 1,
    programLabel: "G4-10",
    studyId: spec.studyId,
    stageId: spec.stageId,
    preAccessDisposition: "PASS",
    protectedDepth11Access: false,
    scientificInferencePerformed: false,
    stage0V2: "PASS",
    stage0V3Hardening: "PASS",
    currentEngineRootIdentity: "PASS",
    historicalG3_11PrefixReferenceIntegrity: "PASS",
    productionIndependentSourceSeparation: "PASS",
    resourceCeilingFreeze: "PASS",
    targetLogicSyntheticControls: "PASS",
    depth12AccessAuthorized: false,
    sameEvidenceRerunAuthorized: false
  };
  const out = process.env.FDERT_PREACCESS_OUT || path.join(ROOT, "artifacts/local/fdert-stage1-preaccess.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`FDERT_STAGE1_PREACCESS=${JSON.stringify(result)}`);
}

try { main(); }
catch (error) {
  console.error(error);
  process.exitCode = 2;
}
