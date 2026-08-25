#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const Prod = require("./lib/orisc-stage1-production.js");
const Ind = require("./lib/orisc-stage1-independent.js");

const repoRoot = path.resolve(__dirname, "../..");

const SOURCE_PATHS = Object.freeze([
  "public/engine.js",
  "tools/benchmark.js",
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json",
  "doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json",
  "tools/experiments/lib/restricted-endgame-transition.js",
  "tools/experiments/lib/restricted-endgame-independent-verifier.js",
  "tools/experiments/lib/restricted-endgame-stage0.js",
  "tools/experiments/lib/orisc-representation-production.js",
  "tools/experiments/lib/orisc-representation-independent.js",
  "tools/experiments/lib/orisc-stage1-production.js",
  "tools/experiments/lib/orisc-stage1-independent.js",
  "tools/experiments/validate-orisc-stage1-spec.js",
  "tools/experiments/run-orisc-stage1-formal.js",
  "tools/experiments/verify-orisc-stage1-formal.js",
  ".github/workflows/orisc-stage1-formal.yml",
  "doc/oracle-representation-integrity-symmetry-confirmation/preregistration/STAGE_2_CANDIDATE_CONTRACT.json"
]);

const IMMUTABLE_GRAPH = Object.freeze({
  rootKey: "fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33",
  stateCount: 8,
  edgeCount: 7,
  stateSetSha256: "95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307",
  transitionSetSha256: "33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11"
});

function sha256File(relativePath) {
  const file = path.join(repoRoot, relativePath);
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function parseArgs(argv) {
  const args = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.output) throw new Error("--output required");
  return args;
}

function edgeLines(graph) {
  return graph.edges.map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`).sort();
}

function rowLines(graph) {
  return graph.rows.map((row) => `${row.stateKey}\t${row.serialization}\t${row.representedSeeds}`).sort();
}

function graphMatchesImmutable(graph) {
  return graph.rootKey === IMMUTABLE_GRAPH.rootKey
    && graph.stateCount === IMMUTABLE_GRAPH.stateCount
    && graph.edgeCount === IMMUTABLE_GRAPH.edgeCount
    && graph.stateSetSha256 === IMMUTABLE_GRAPH.stateSetSha256
    && graph.transitionSetSha256 === IMMUTABLE_GRAPH.transitionSetSha256;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const domain = readJson("doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json");

  const productionWitness = Prod.replayFrozenWitness(domain);
  const independentWitness = Ind.replayFrozenWitness(domain);
  if (!productionWitness.passed || !independentWitness.passed) throw new Error("Frozen witness reconstruction failed");

  const limits = {
    maximumStates: 1000,
    maximumEdges: 10000,
    administrativeMaximumMoveMicrostates: 1000000
  };
  const production = Prod.reconstruct(productionWitness.state, limits);
  const independent = Ind.rebuild(independentWitness.state, limits);

  const productionImmutablePass = graphMatchesImmutable(production);
  const independentImmutablePass = graphMatchesImmutable(independent);
  const stateRowsEqual = JSON.stringify(rowLines(production)) === JSON.stringify(rowLines(independent));
  const edgesEqual = JSON.stringify(edgeLines(production)) === JSON.stringify(edgeLines(independent));
  const seedConservationPass = production.rows.every((row) => row.representedSeeds === 64)
    && independent.rows.every((row) => row.representedSeeds === 64);

  if (!productionImmutablePass || !independentImmutablePass || !stateRowsEqual || !edgesEqual || !seedConservationPass) {
    throw new Error("Stage 0B raw graph prefreeze readiness failed");
  }

  const sourceSha256 = Object.fromEntries(SOURCE_PATHS.map((relativePath) => [relativePath, sha256File(relativePath)]));
  const result = {
    schemaVersion: 1,
    studyId: "ORISC-STUDY1",
    stageId: "ORISC-STAGE0B-PREFREEZE-2026-08-25-v2",
    classification: "TECHNICAL-PREFREEZE-NO-STAGE1-OUTCOME",
    technicalOnly: true,
    scientificOutcomeGenerated: false,
    repositoryFacingOracleSemanticGateEvaluated: false,
    symmetryCandidateOutcomeEvaluated: false,
    stage1AuthorizationCreated: false,
    immutableGraph: IMMUTABLE_GRAPH,
    resourceLimits: limits,
    production: {
      witnessPassed: productionWitness.passed,
      rootKey: production.rootKey,
      stateCount: production.stateCount,
      edgeCount: production.edgeCount,
      stateSetSha256: production.stateSetSha256,
      transitionSetSha256: production.transitionSetSha256,
      representedSeedTotals: [...new Set(production.rows.map((row) => row.representedSeeds))].sort((a, b) => a - b),
      immutableGraphPass: productionImmutablePass
    },
    independent: {
      witnessPassed: independentWitness.passed,
      rootKey: independent.rootKey,
      stateCount: independent.stateCount,
      edgeCount: independent.edgeCount,
      stateSetSha256: independent.stateSetSha256,
      transitionSetSha256: independent.transitionSetSha256,
      representedSeedTotals: [...new Set(independent.rows.map((row) => row.representedSeeds))].sort((a, b) => a - b),
      immutableGraphPass: independentImmutablePass
    },
    crossImplementation: {
      stateRowsEqual,
      edgesEqual,
      seedConservationPass
    },
    sourceSha256,
    stage2CandidateContractSha256: sourceSha256["doc/oracle-representation-integrity-symmetry-confirmation/preregistration/STAGE_2_CANDIDATE_CONTRACT.json"],
    readyForStage1SpecFreeze: true,
    interpretationBoundary: "Stage 0B verifies only technical raw-graph reconstruction readiness and source identities. It does not evaluate the repository-facing oracle representation gates A-G8/A-G9/A-G11, does not issue a Stage 1 decision, and does not evaluate symmetry candidates."
  };

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    technicalOnly: result.technicalOnly,
    production: result.production,
    independent: result.independent,
    crossImplementation: result.crossImplementation,
    stage2CandidateContractSha256: result.stage2CandidateContractSha256,
    readyForStage1SpecFreeze: result.readyForStage1SpecFreeze
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { IMMUTABLE_GRAPH, SOURCE_PATHS, main, parseArgs };
