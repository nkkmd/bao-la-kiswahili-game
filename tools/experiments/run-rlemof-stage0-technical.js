"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const R = require("./lib/restricted-endgame-retrograde.js");
const IR = require("./lib/restricted-endgame-retrograde-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/reachable-late-game-exact-microdomain-oracle-foundation/preregistration/STAGE_0_TECHNICAL_SPEC.json");
const DEFAULT_DIR = path.join(ROOT, "artifacts/local/rlemof-stage0-technical");

function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function sha256Bytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sha256Stable(value) { return sha256Bytes(Buffer.from(stable(value))); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function run(script, args) {
  childProcess.execFileSync(process.execPath, [path.join(ROOT, script), ...args], { cwd: ROOT, stdio: "inherit" });
}

function recurrentFixture() {
  return [
    { id: "R-A", player: 0, winner: null, moves: [{ key: "a-to-b", to: "R-B" }] },
    { id: "R-B", player: 1, winner: null, moves: [{ key: "b-to-a", to: "R-A" }] },
    { id: "T-0", player: 0, winner: 0, moves: [] }
  ];
}

function main() {
  const outputDir = path.resolve(process.argv[2] || DEFAULT_DIR);
  fs.mkdirSync(outputDir, { recursive: true });
  const productionPath = path.join(outputDir, "technical-production.json");
  const independentPath = path.join(outputDir, "technical-independent.json");
  const resultPath = path.join(outputDir, "RLEMOF_STAGE_0_RESULT.json");
  const spec = readJson(SPEC_PATH);
  if (spec.studyId !== "RLEMOF-STUDY1" || spec.stageId !== "RLEMOF-S0-TECHNICAL-2026-09-25-v1") throw new Error("Unexpected RLEMOF Stage 0 spec");

  run("tools/experiments/run-reeoe-stage0-technical.js", [productionPath]);
  run("tools/experiments/verify-reeoe-stage0-independent.js", [productionPath, independentPath]);

  const productionBytes = fs.readFileSync(productionPath);
  const independentBytes = fs.readFileSync(independentPath);
  const production = JSON.parse(productionBytes);
  const independent = JSON.parse(independentBytes);

  const fixture = recurrentFixture();
  const prodRec = R.solveRetrograde(fixture);
  const indRec = IR.solveIndependent(fixture);
  const recurrentIdsProd = Object.entries(prodRec.results).filter(([, v]) => v.status === "RECURRENT").map(([k]) => k).sort();
  const recurrentIdsInd = Object.entries(indRec.results).filter(([, v]) => v.status === "RECURRENT").map(([k]) => k).sort();
  const terminalIdsProd = Object.entries(prodRec.results).filter(([, v]) => v.status === "TERMINAL").map(([k]) => k).sort();
  const terminalIdsInd = Object.entries(indRec.results).filter(([, v]) => v.status === "TERMINAL").map(([k]) => k).sort();

  const gameLabels = new Set(spec.semanticSeparation.gameStateValueLabels);
  const transitionLabels = spec.semanticSeparation.transitionStopLabels;
  const vocabularyDisjoint = transitionLabels.every((label) => !gameLabels.has(label));
  const oldGates = independent.verification?.gates || {};
  const gates = {
    "S0-G1": production.productionTechnicalStatus === "PASS",
    "S0-G2": independent.stage0TechnicalDecision === "STAGE0-TECHNICAL-PASS" && Object.values(oldGates).every(Boolean),
    "S0-G3": production.technical?.graph?.stateCount === spec.positiveControl.expectedStates
      && production.technical?.graph?.edgeCount === spec.positiveControl.expectedEdges
      && production.technical?.solution?.solutionSha256 === spec.positiveControl.expectedSolutionSha256,
    "S0-G4": stable(prodRec.results) === stable(indRec.results) && stable(prodRec.recurrentSccs) === stable(indRec.recurrentSccs),
    "S0-G5": recurrentIdsProd.length === 2 && recurrentIdsInd.length === 2
      && terminalIdsProd.length === 1 && terminalIdsInd.length === 1,
    "S0-G6": spec.syntheticRecurrenceFixture.drawInferenceAuthorized === false
      && Object.values(prodRec.results).every((row) => row.status !== "DRAW")
      && Object.values(indRec.results).every((row) => row.status !== "DRAW"),
    "S0-G7": vocabularyDisjoint && !gameLabels.has("MOVE-NONTERMINATION"),
    "S0-G8": spec.scientificInferenceAuthorized === false
      && spec.freshScientificSeedReadAuthorized === false
      && spec.freshScientificRootReadAuthorized === false
      && spec.formalExactDecisionAuthorized === false
      && production.scientificInferenceAuthorized === false
      && independent.scientificInferenceAuthorized === false,
    "S0-G9": true
  };
  const allPassBeforeWrite = Object.values(gates).every(Boolean);

  const core = {
    gates,
    historicalTechnicalFixture: {
      productionResultSha256: sha256Bytes(productionBytes),
      independentResultSha256: sha256Bytes(independentBytes),
      stateCount: production.technical.graph.stateCount,
      edgeCount: production.technical.graph.edgeCount,
      solutionSha256: production.technical.solution.solutionSha256
    },
    syntheticRecurrence: {
      fixture,
      production: prodRec,
      independent: indRec,
      recurrentIdsProd,
      recurrentIdsInd,
      terminalIdsProd,
      terminalIdsInd
    },
    semanticSeparation: {
      vocabularyDisjoint,
      recurrentImpliesDraw: false,
      moveNonterminationIsGameStateValue: false
    }
  };

  const result = {
    schemaVersion: 1,
    agenda: "G4-05",
    studyId: "RLEMOF-STUDY1",
    stageId: spec.stageId,
    resultRole: "technical-only",
    stage0TechnicalDecision: allPassBeforeWrite ? "STAGE0-TECHNICAL-PASS" : "STAGE0-TECHNICAL-BLOCK",
    scientificInferenceAuthorized: false,
    freshScientificSeedReads: 0,
    freshScientificRootReads: 0,
    formalExactDecisionAuthorized: false,
    specFileSha256: sha256Bytes(fs.readFileSync(SPEC_PATH)),
    core,
    coreSha256: sha256Stable(core)
  };
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopenedBytes = fs.readFileSync(resultPath);
  const reopened = JSON.parse(reopenedBytes);
  gates["S0-G9"] = sha256Stable(reopened.core) === result.coreSha256
    && reopened.scientificInferenceAuthorized === false
    && reopened.freshScientificSeedReads === 0
    && reopened.freshScientificRootReads === 0;
  if (!gates["S0-G9"] || !Object.values(gates).every(Boolean)) throw new Error(`RLEMOF Stage 0 gate failure: ${JSON.stringify(gates)}`);

  console.log(JSON.stringify({
    stage0TechnicalDecision: result.stage0TechnicalDecision,
    resultPath,
    resultFileSha256: sha256Bytes(reopenedBytes),
    coreSha256: result.coreSha256,
    gates
  }, null, 2));
}

main();
