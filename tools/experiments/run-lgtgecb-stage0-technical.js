#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const P = require("./lib/lgtgecb-stage0-production.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_DIR = path.join(ROOT, "doc/local-game-tree-geometry-exact-consequence-bridge");
const SPEC_PATH = path.join(STUDY_DIR, "preregistration/STAGE_0_TECHNICAL_SPEC.json");
const FIXTURE_PATH = path.join(STUDY_DIR, "preregistration/STAGE_0_TECHNICAL_FIXTURE.json");
const DEFAULT_DIR = path.join(ROOT, "artifacts/local/lgtgecb-stage0-technical");

function need(value, message) { if (!value) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function same(a, b) { return stable(a) === stable(b); }
function run(script, args) {
  childProcess.execFileSync(process.execPath, [path.join(ROOT, script), ...args], { cwd: ROOT, stdio: "inherit" });
}
function expectThrow(fn) { try { fn(); return false; } catch { return true; } }

function exactStructures(exactProduction) {
  const graphNodes = exactProduction.technical.graph.graphNodes;
  const solutionRows = exactProduction.technical.solution.rows;
  const byNode = new Map(graphNodes.map((node) => [node.id, node]));
  return solutionRows
    .filter((row) => (row.status === "WIN" || row.status === "LOSS") && byNode.get(row.stateKey)?.moves?.length > 0)
    .sort((a, b) => a.stateKey.localeCompare(b.stateKey))
    .map((row) => P.exactMoveStructure(byNode.get(row.stateKey), row, solutionRows));
}

function main() {
  const outputDir = path.resolve(process.argv[2] || DEFAULT_DIR);
  fs.mkdirSync(outputDir, { recursive: true });
  const exactProductionPath = path.join(outputDir, "exact-technical-production.json");
  const resultPath = path.join(outputDir, "bridge-production.json");
  const spec = readJson(SPEC_PATH);
  const fixture = readJson(FIXTURE_PATH);

  need(spec.studyId === "LGTGECB-STUDY1", "unexpected study ID");
  need(spec.stageId === "LGTGECB-S0-TECHNICAL-2026-09-26-v1", "unexpected Stage 0 ID");
  need(fixture.stageId === spec.stageId && fixture.scientificEvidence === false, "unexpected technical fixture identity");
  need(spec.scientificBridgeInferenceAuthorized === false, "scientific bridge inference unexpectedly authorized");
  need(spec.g405FormalDomainBridgeComputationAuthorized === false, "G4-05 formal-domain bridge computation unexpectedly authorized");
  need(spec.formalBridgeDecisionAuthorized === false, "formal bridge decision unexpectedly authorized");
  need(spec.g410Depth11AccessAuthorized === false, "G4-10 depth-11 unexpectedly authorized");
  need(spec.publicAiChangeAuthorized === false, "public AI change unexpectedly authorized");

  run("tools/experiments/run-reeoe-stage0-technical.js", [exactProductionPath]);
  const exactProductionBytes = fs.readFileSync(exactProductionPath);
  const exactProduction = JSON.parse(exactProductionBytes);
  need(exactProduction.productionTechnicalStatus === "PASS", "historical exact technical production did not pass");
  need(exactProduction.technical.graph.stateCount === spec.upstreamExactTechnicalControl.expectedStates, "exact technical state count mismatch");
  need(exactProduction.technical.graph.edgeCount === spec.upstreamExactTechnicalControl.expectedEdges, "exact technical edge count mismatch");
  need(exactProduction.technical.solution.solutionSha256 === spec.upstreamExactTechnicalControl.expectedSolutionSha256, "exact technical solution mismatch");
  need(exactProduction.scientificInferenceAuthorized === false && exactProduction.formalExactDecisionAuthorized === false, "historical technical control contains scientific authorization");

  const geometry = P.geometryTechnicalSummary(fixture.geometryMeasurement);
  const structures = exactStructures(exactProduction);
  need(structures.length > 0, "no exact WIN/LOSS technical structures available");
  need(structures.some((row) => row.rootStatus === "WIN"), "WIN technical structure missing");
  need(structures.some((row) => row.rootStatus === "LOSS"), "LOSS technical structure missing");

  const binaryOrdering = P.binaryOrdering(fixture.binaryOrderingRows);
  const orderedConcordance = P.orderedConcordance(fixture.orderedRows);
  const noVariation = P.orderedConcordance(fixture.noVariationRows);
  const rationalReduction = P.fraction(2n, 4n);
  const undefinedDenominator = P.fraction(1n, 0n);

  const first = structures[0];
  const graphNode = exactProduction.technical.graph.graphNodes.find((node) => node.id === first.rootStateKey);
  const rootRow = exactProduction.technical.solution.rows.find((row) => row.stateKey === first.rootStateKey);
  const missingChildNode = JSON.parse(JSON.stringify(graphNode));
  missingChildNode.moves[0].to = "G4-06-STAGE0-MISSING-CHILD";
  const malformedMissingChildRejected = expectThrow(() => P.exactMoveStructure(missingChildNode, rootRow, exactProduction.technical.solution.rows));
  const invalidStatus = JSON.parse(JSON.stringify(rootRow));
  invalidStatus.status = "TERMINAL";
  const malformedStatusRejected = expectThrow(() => P.exactMoveStructure(graphNode, invalidStatus, exactProduction.technical.solution.rows));

  const expected = spec.technicalFixtureExpected;
  const productionChecks = {
    exactTechnicalIdentity: exactProduction.technical.graph.stateCount === spec.upstreamExactTechnicalControl.expectedStates
      && exactProduction.technical.graph.edgeCount === spec.upstreamExactTechnicalControl.expectedEdges
      && exactProduction.technical.solution.solutionSha256 === spec.upstreamExactTechnicalControl.expectedSolutionSha256,
    geometryExpected: same(geometry, expected.geometry),
    exactMoveStructuresDtfMatch: structures.every((row) => row.valuePreservingMoveCount > 0 && row.dtfConsistentMatchesSolverOptimal),
    rationalReduction: same(rationalReduction, { numerator: "1", denominator: "2", defined: true }),
    undefinedDenominator: undefinedDenominator.defined === false,
    binaryExpected: Object.entries(expected.binaryOrdering).every(([key, value]) => binaryOrdering[key] === value),
    orderedExpected: Object.entries(expected.orderedConcordance).every(([key, value]) => orderedConcordance[key] === value),
    noVariationNonEstimable: noVariation.estimable === expected.noVariationEstimable && noVariation.geometryVariation === false,
    malformedControls: malformedMissingChildRejected && malformedStatusRejected,
  };
  need(Object.values(productionChecks).every(Boolean), `production technical check failed: ${JSON.stringify(productionChecks)}`);

  const core = {
    exactTechnicalControl: {
      productionResultSha256: sha256(exactProductionBytes),
      stateCount: exactProduction.technical.graph.stateCount,
      edgeCount: exactProduction.technical.graph.edgeCount,
      solutionSha256: exactProduction.technical.solution.solutionSha256,
      scientificInferenceAuthorized: false,
    },
    geometry,
    exactMoveStructures: structures,
    rationalControls: { rationalReduction, undefinedDenominator },
    binaryOrdering,
    orderedConcordance,
    noVariation,
    malformedControls: { malformedMissingChildRejected, malformedStatusRejected },
    productionChecks,
  };

  const result = {
    schemaVersion: 1,
    agenda: "G4-06",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "technical-production-only",
    stageDisposition: "STAGE0-PRODUCTION-PASS",
    scientificBridgeInferenceAuthorized: false,
    g405FormalDomainBridgeReads: 0,
    g405FormalDomainBridgeComputationAuthorized: false,
    formalBridgeDecisionAuthorized: false,
    g410Depth11Accesses: 0,
    publicAiChangeAuthorized: false,
    specFileSha256: sha256(fs.readFileSync(SPEC_PATH)),
    fixtureFileSha256: sha256(fs.readFileSync(FIXTURE_PATH)),
    core,
    coreSha256: sha256(Buffer.from(stable(core))),
  };

  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopenedBytes = fs.readFileSync(resultPath);
  const reopened = JSON.parse(reopenedBytes);
  need(sha256(Buffer.from(stable(reopened.core))) === result.coreSha256, "production result reopen/hash mismatch");
  need(reopened.scientificBridgeInferenceAuthorized === false
    && reopened.g405FormalDomainBridgeReads === 0
    && reopened.g410Depth11Accesses === 0
    && reopened.publicAiChangeAuthorized === false, "production result authorization boundary mismatch");

  console.log(JSON.stringify({
    stageDisposition: result.stageDisposition,
    resultPath,
    exactTechnicalStates: core.exactTechnicalControl.stateCount,
    exactTechnicalEdges: core.exactTechnicalControl.edgeCount,
    exactMoveStructureCount: structures.length,
    coreSha256: result.coreSha256,
    resultFileSha256: sha256(reopenedBytes),
  }, null, 2));
}

main();
