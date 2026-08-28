#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const engine = require("../../public/engine.js");
const prod = require("./lib/drsse-production.js");

const STUDY_ID = "DRSSE-STUDY1";
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

const G1_FIXTURE = Object.freeze({
  targetDepth: 2,
  cumulativeRawStates: 19,
  cumulativeEdges: 18,
  cumulativeRawStateSetSha256: "0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f",
  cumulativeGlobalRawGraphEdgeSetSha256: "be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1",
});

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function g1CompatibleTransitionHash(core) {
  const fingerprints = [];
  for (const parentLayer of core.parentLayers) {
    const filePath = path.join(OUT_DIR, parentLayer.edgeFile);
    const text = fs.readFileSync(filePath, "utf8").trim();
    if (!text) continue;
    for (const line of text.split("\n")) {
      const row = JSON.parse(line);
      fingerprints.push(`${row.sourceKey}|${row.moveKey}|${row.childKey}`);
    }
  }
  return prod.sha256Text(fingerprints.sort().join("\n"));
}

function main() {
  const core = prod.enumerateExactDepth({
    engine,
    rootState: engine.initialState(),
    targetDepth: G1_FIXTURE.targetDepth,
    outDir: OUT_DIR,
    profile: PROFILE,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    rootLabel: "G1-SSGTC-DEPTH2-TECHNICAL-POSITIVE-FIXTURE",
  });

  const g1TransitionSetSha256 = g1CompatibleTransitionHash(core);
  const gates = {
    "S0-G1-RAW-IDENTITY": core.representation.mode === "RAW-ONLY" && core.representation.pendingRequired === true,
    "S0-G2-COMPLETE-LAYERS": core.targetComplete === true && core.lastCompleteDepth === 2,
    "S0-G3-G1-STATE-COUNT-FIXTURE": core.cumulative.distinctRawStatesThroughLastCompleteDepth === G1_FIXTURE.cumulativeRawStates,
    "S0-G4-G1-EDGE-COUNT-FIXTURE": core.cumulative.depthLabelledLegalEdgesThroughLastCompleteParent === G1_FIXTURE.cumulativeEdges,
    "S0-G5-G1-STATE-HASH-FIXTURE": core.cumulative.cumulativeRawStateSetSha256 === G1_FIXTURE.cumulativeRawStateSetSha256,
    "S0-G6-G1-EDGE-HASH-FIXTURE": g1TransitionSetSha256 === G1_FIXTURE.cumulativeGlobalRawGraphEdgeSetSha256,
    "S0-G7-NO-TRANSFORM": Array.isArray(core.representation.validatedTransformSet) && core.representation.validatedTransformSet.length === 0,
    "S0-G8-NO-RESOURCE-STOP": core.stopReason === null,
  };
  ensure(Object.values(gates).every(Boolean), `Stage 0 production gate failure: ${JSON.stringify(gates)}`);

  const result = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    resultClass: "TECHNICAL-DIAGNOSTIC-ONLY",
    scientificInferenceAuthorized: false,
    productionPassed: true,
    gates,
    fixture: G1_FIXTURE,
    fixtureCompatibility: {
      g1TransitionSetSha256,
      note: "G1 SSGTC hashes sorted raw transition fingerprints directly; DRSSE internal cumulative edge hashes use a separately frozen deterministic fingerprint-hash convention. Both are retained and not conflated.",
    },
    productionCore: core,
    independentVerificationRequired: true,
  };
  fs.writeFileSync(path.join(OUT_DIR, "stage0-production-summary.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`DRSSE_STAGE0_PRODUCTION=${JSON.stringify({ passed: true, resultCoreSha256: core.resultCoreSha256, g1TransitionSetSha256, outDir: OUT_DIR })}`);
}

main();
