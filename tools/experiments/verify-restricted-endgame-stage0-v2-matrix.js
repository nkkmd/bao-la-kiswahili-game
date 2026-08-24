"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const S0 = require("./lib/restricted-endgame-stage0.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC_V2.json",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function parseArgs(argv) {
  const args = { matrix: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--matrix") args.matrix = path.resolve(argv[++i]);
    else if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.matrix || !args.output) throw new Error("--matrix and --output are required");
  return args;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const matrix = JSON.parse(fs.readFileSync(args.matrix, "utf8"));
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const specSha256 = sha256(specText);
  if (matrix.technicalOnly !== true
    || matrix.scientificOutcomeGenerationAuthorized !== false
    || matrix.scientificTablebaseGenerationAuthorized !== false
    || matrix.outcomeFieldsEmitted !== false
    || matrix.technicalSpecSha256 !== specSha256
    || !matrix.selectedTechnicalDomainCandidate) {
    throw new Error("Invalid Stage 0 matrix input for independent verification");
  }

  // Root discovery/witness source is intentionally shared with the canonical Stage 0 scan.
  // The graph reconstruction below is independent: legality, transition application,
  // state serialization, closure traversal and edge hashing come from V only.
  const p = spec.population;
  const scan = S0.scanWitnessRoots({
    seedBase: p.technicalSeedBase,
    games: p.technicalGames,
    maxPly: p.maximumTrajectoryPly,
  });
  const byKey = new Map(scan.roots.map((root) => [root.rootStateKey, root]));
  const selected = matrix.selectedTechnicalDomainCandidate;
  const roots = selected.rootKeys.map((key) => {
    const root = byKey.get(key);
    if (!root) throw new Error(`Selected root missing from independently rescanned witness pool: ${key}`);
    const independentKey = V.stateKey(root.state);
    if (independentKey !== key) {
      throw new Error(`Independent root serialization mismatch: ${key} != ${independentKey}`);
    }
    return root;
  });

  const started = process.hrtime.bigint();
  const independent = V.enumerateClosure(roots.map((root) => root.state), {
    maxStates: spec.closure.maximumStatesTechnicalStop,
    maxEdges: spec.closure.maximumEdgesTechnicalStop,
    maxMicrostates: spec.closure.maximumMoveMicrostatesTechnicalStop,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  const production = selected.closure;
  const checks = {
    complete: independent.complete === true && independent.technicalStopReason === null,
    stateCount: independent.stateCount === production.stateCount,
    edgeCount: independent.edgeCount === production.edgeCount,
    stateSetSha256: independent.stateSetSha256 === production.stateSetSha256,
    transitionSetSha256: independent.transitionSetSha256 === production.transitionSetSha256,
    rootKeys: stableStringify(independent.rootKeys) === stableStringify(production.rootKeys),
  };
  const passed = Object.values(checks).every(Boolean);

  const result = {
    schemaVersion: 1,
    studyId: "REWR-STUDY1",
    stageId: "REWR-S0-INDEPENDENT-GRAPH-VERIFY-2026-08-24-v1",
    technicalSpecSha256: specSha256,
    matrixResultSha256: matrix.resultSha256,
    technicalOnly: true,
    scientificOutcomeGenerationAuthorized: false,
    scientificTablebaseGenerationAuthorized: false,
    outcomeFieldsEmitted: false,
    selectedRootSetSha256: selected.rootSetSha256,
    selectedRootCount: roots.length,
    selectedRootKeys: selected.rootKeys,
    witnessRootsRescanned: scan.uniqueWitnessRoots,
    graphImplementationIndependence: {
      sharesCanonicalWitnessDiscovery: true,
      sharesCanonicalClosureEnumerator: false,
      sharesCanonicalTransitionAdapter: false,
      independentLegalMoveGenerator: true,
      independentStateSerialization: true,
      independentTransitionApplication: true,
      independentClosureTraversal: true,
    },
    production: {
      stateCount: production.stateCount,
      edgeCount: production.edgeCount,
      stateSetSha256: production.stateSetSha256,
      transitionSetSha256: production.transitionSetSha256,
      maxMoveMicrosteps: production.maxMoveMicrosteps,
    },
    independent: {
      complete: independent.complete,
      technicalStopReason: independent.technicalStopReason,
      stateCount: independent.stateCount,
      edgeCount: independent.edgeCount,
      stateSetSha256: independent.stateSetSha256,
      transitionSetSha256: independent.transitionSetSha256,
      maxMoveMicrosteps: independent.maxMoveMicrosteps,
      elapsedMs,
      heapUsedBytesAfter: process.memoryUsage().heapUsed,
    },
    checks,
    passed,
    stage1ReadinessFromGraphVerification: passed,
  };
  const forbidden = /\b(WIN|LOSS|RECURRENT|DTF|optimalMoveSet|absoluteWinner)\b/;
  if (forbidden.test(stableStringify(result))) {
    throw new Error("Scientific outcome field leaked into Stage 0 independent verification");
  }
  result.resultSha256 = sha256(stableStringify(result));
  writeJson(args.output, result);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    selectedRootSetSha256: result.selectedRootSetSha256,
    production: result.production,
    independent: result.independent,
    checks: result.checks,
    passed: result.passed,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 2;
  return result;
}

if (require.main === module) main();

module.exports = { main, parseArgs };
