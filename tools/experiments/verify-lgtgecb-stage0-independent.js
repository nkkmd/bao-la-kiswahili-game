#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const I = require("./lib/lgtgecb-stage0-independent.js");

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
  const nodes = new Map(exactProduction.technical.graph.graphNodes.map((node) => [node.id, node]));
  const rows = exactProduction.technical.solution.rows;
  return rows
    .filter((row) => (row.status === "WIN" || row.status === "LOSS") && nodes.get(row.stateKey)?.moves?.length > 0)
    .sort((a, b) => a.stateKey.localeCompare(b.stateKey))
    .map((row) => I.exactMoveStructure(nodes.get(row.stateKey), row, rows));
}

function main() {
  const outputDir = path.resolve(process.argv[2] || DEFAULT_DIR);
  const productionPath = path.join(outputDir, "bridge-production.json");
  const exactProductionPath = path.join(outputDir, "exact-technical-production.json");
  const exactIndependentPath = path.join(outputDir, "exact-technical-independent.json");
  const outputPath = path.join(outputDir, "bridge-independent-verification.json");

  const spec = readJson(SPEC_PATH);
  const fixture = readJson(FIXTURE_PATH);
  const productionBytes = fs.readFileSync(productionPath);
  const production = JSON.parse(productionBytes);
  const exactProductionBytes = fs.readFileSync(exactProductionPath);
  const exactProduction = JSON.parse(exactProductionBytes);

  need(production.studyId === spec.studyId && production.stageId === spec.stageId, "production identity mismatch");
  need(production.stageDisposition === "STAGE0-PRODUCTION-PASS", "production Stage 0 did not pass");
  need(production.scientificBridgeInferenceAuthorized === false
    && production.g405FormalDomainBridgeReads === 0
    && production.g405FormalDomainBridgeComputationAuthorized === false
    && production.formalBridgeDecisionAuthorized === false
    && production.g410Depth11Accesses === 0
    && production.publicAiChangeAuthorized === false, "production authorization boundary violated");

  run("tools/experiments/verify-reeoe-stage0-independent.js", [exactProductionPath, exactIndependentPath]);
  const exactIndependentBytes = fs.readFileSync(exactIndependentPath);
  const exactIndependent = JSON.parse(exactIndependentBytes);
  need(exactIndependent.stage0TechnicalDecision === "STAGE0-TECHNICAL-PASS", "historical exact independent verification did not pass");
  need(Object.values(exactIndependent.verification.gates).every(Boolean), "historical exact independent gates incomplete");

  const geometry = I.geometryTechnicalSummary(fixture.geometryMeasurement);
  const structures = exactStructures(exactProduction);
  const binaryOrdering = I.binaryOrdering(fixture.binaryOrderingRows);
  const orderedConcordance = I.orderedConcordance(fixture.orderedRows);
  const noVariation = I.orderedConcordance(fixture.noVariationRows);
  const rationalReduction = I.fraction(2n, 4n);
  const undefinedDenominator = I.fraction(1n, 0n);

  const first = structures[0];
  const graphNode = exactProduction.technical.graph.graphNodes.find((node) => node.id === first.rootStateKey);
  const rootRow = exactProduction.technical.solution.rows.find((row) => row.stateKey === first.rootStateKey);
  const missingChildNode = JSON.parse(JSON.stringify(graphNode));
  missingChildNode.moves[0].to = "G4-06-STAGE0-MISSING-CHILD";
  const malformedMissingChildRejected = expectThrow(() => I.exactMoveStructure(missingChildNode, rootRow, exactProduction.technical.solution.rows));
  const invalidStatus = JSON.parse(JSON.stringify(rootRow));
  invalidStatus.status = "TERMINAL";
  const malformedStatusRejected = expectThrow(() => I.exactMoveStructure(graphNode, invalidStatus, exactProduction.technical.solution.rows));

  const expected = spec.technicalFixtureExpected;
  const independentCore = {
    geometry,
    exactMoveStructures: structures,
    rationalControls: { rationalReduction, undefinedDenominator },
    binaryOrdering,
    orderedConcordance,
    noVariation,
    malformedControls: { malformedMissingChildRejected, malformedStatusRejected },
  };

  const prodSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/lgtgecb-stage0-production.js"), "utf8");
  const indSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/lgtgecb-stage0-independent.js"), "utf8");
  const sourceSeparated = prodSource !== indSource
    && prodSource.includes('sfcdf-production.js')
    && !prodSource.includes('sfcdf-independent.js')
    && !prodSource.includes('lgtgecb-stage0-independent.js')
    && indSource.includes('sfcdf-independent.js')
    && !indSource.includes('sfcdf-production.js')
    && !indSource.includes('lgtgecb-stage0-production.js');

  const gates = {
    "S0-G1": exactProduction.productionTechnicalStatus === "PASS"
      && exactProduction.scientificInferenceAuthorized === false
      && exactProduction.formalExactDecisionAuthorized === false,
    "S0-G2": exactIndependent.stage0TechnicalDecision === "STAGE0-TECHNICAL-PASS"
      && Object.values(exactIndependent.verification.gates).every(Boolean)
      && exactIndependent.productionResultFileSha256 === sha256(exactProductionBytes),
    "S0-G3": same(geometry, production.core.geometry),
    "S0-G4": same(geometry, expected.geometry),
    "S0-G5": same(structures, production.core.exactMoveStructures),
    "S0-G6": structures.length > 0
      && structures.some((row) => row.rootStatus === "WIN")
      && structures.some((row) => row.rootStatus === "LOSS")
      && structures.every((row) => row.valuePreservingMoveCount > 0 && row.dtfConsistentMatchesSolverOptimal),
    "S0-G7": same(rationalReduction, production.core.rationalControls.rationalReduction)
      && same(rationalReduction, { numerator: "1", denominator: "2", defined: true })
      && undefinedDenominator.defined === false
      && production.core.rationalControls.undefinedDenominator.defined === false,
    "S0-G8": same(binaryOrdering, production.core.binaryOrdering)
      && Object.entries(expected.binaryOrdering).every(([key, value]) => binaryOrdering[key] === value),
    "S0-G9": same(orderedConcordance, production.core.orderedConcordance)
      && Object.entries(expected.orderedConcordance).every(([key, value]) => orderedConcordance[key] === value),
    "S0-G10": noVariation.estimable === false
      && noVariation.geometryVariation === false
      && production.core.noVariation.estimable === false
      && malformedMissingChildRejected
      && malformedStatusRejected
      && production.core.malformedControls.malformedMissingChildRejected
      && production.core.malformedControls.malformedStatusRejected,
    "S0-G11": sourceSeparated,
    "S0-G12": production.scientificBridgeInferenceAuthorized === false
      && production.g405FormalDomainBridgeReads === 0
      && production.g405FormalDomainBridgeComputationAuthorized === false
      && production.formalBridgeDecisionAuthorized === false
      && production.g410Depth11Accesses === 0
      && production.publicAiChangeAuthorized === false
      && spec.g405FormalDomainBridgeComputationAuthorized === false
      && spec.g410Depth11AccessAuthorized === false
      && spec.publicAiChangeAuthorized === false,
  };

  const allPass = Object.values(gates).every(Boolean);
  const verificationCore = {
    gates,
    sourceSeparated,
    exactTechnicalIndependent: {
      resultSha256: sha256(exactIndependentBytes),
      stage0TechnicalDecision: exactIndependent.stage0TechnicalDecision,
      solutionSha256: exactIndependent.verification.independent.solutionSha256,
    },
    bridgeIndependent: independentCore,
    productionCoreSha256: production.coreSha256,
  };

  const result = {
    schemaVersion: 1,
    agenda: "G4-06",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "independent-stage0-technical-verification",
    stage0TechnicalDecision: allPass ? "STAGE0-TECHNICAL-PASS" : "STAGE0-TECHNICAL-BLOCK",
    scientificBridgeInferenceAuthorized: false,
    g405FormalDomainBridgeReads: 0,
    g405FormalDomainBridgeComputationAuthorized: false,
    formalBridgeDecisionAuthorized: false,
    g410Depth11Accesses: 0,
    publicAiChangeAuthorized: false,
    productionResultFileSha256: sha256(productionBytes),
    verification: verificationCore,
    verificationCoreSha256: sha256(Buffer.from(stable(verificationCore))),
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopenedBytes = fs.readFileSync(outputPath);
  const reopened = JSON.parse(reopenedBytes);
  gates["S0-G12"] = gates["S0-G12"]
    && sha256(Buffer.from(stable(reopened.verification))) === result.verificationCoreSha256
    && reopened.scientificBridgeInferenceAuthorized === false
    && reopened.g405FormalDomainBridgeReads === 0
    && reopened.g410Depth11Accesses === 0
    && reopened.publicAiChangeAuthorized === false;

  if (!Object.values(gates).every(Boolean)) throw new Error(`LGTGECB Stage 0 gate failure: ${JSON.stringify(gates)}`);
  if (result.stage0TechnicalDecision !== "STAGE0-TECHNICAL-PASS") throw new Error("LGTGECB Stage 0 technical decision blocked");

  console.log(JSON.stringify({
    stage0TechnicalDecision: result.stage0TechnicalDecision,
    gates,
    sourceSeparated,
    outputPath,
    productionResultFileSha256: result.productionResultFileSha256,
    verificationFileSha256: sha256(reopenedBytes),
    verificationCoreSha256: result.verificationCoreSha256,
  }, null, 2));
}

main();
