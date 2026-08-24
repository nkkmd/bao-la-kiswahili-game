"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const I = require("./lib/restricted-endgame-tablebase-independent.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");
const Contract = require("./validate-restricted-endgame-stage1-spec.js");

function parseArgs(argv) {
  const args = { input: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = path.resolve(argv[++i]);
    else if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.input || !args.output) throw new Error("--input and --output required");
  return args;
}

function reconstructRootFromWitness(root) {
  // Reachability replay intentionally uses the authoritative full Bao engine;
  // the exact Mtaji graph/solution below is independently reconstructed.
  let state = E.initialState();
  for (let ply = 0; ply < root.witness.moves.length; ply += 1) {
    const row = root.witness.moves[ply];
    const legal = E.moveVariants(state);
    const move = legal.find((candidate) => {
      const key = [candidate.type, candidate.phase, candidate.row, candidate.index,
        candidate.direction, candidate.side, candidate.houseChoice, Boolean(candidate.houseTwo)].join(":");
      return key === row.moveKey;
    });
    if (!move) throw new Error(`Verifier witness move illegal at ply ${ply}`);
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") throw new Error(`Verifier witness hit runtime relay guard at ply ${ply}`);
    state = next;
  }
  if (V.stateKey(state) !== root.rootStateKey) throw new Error("Verifier witness root hash mismatch");
  if (Contract.stableStringify(state) !== Contract.stableStringify(root.state)) {
    throw new Error("Verifier witness root-state mismatch");
  }
  return state;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const contract = Contract.loadFrozenContract();
  const auth = Contract.loadAuthorization(contract);
  const productionText = fs.readFileSync(args.input, "utf8");
  const production = JSON.parse(productionText);
  if (production.specSha256 !== contract.specSha256
    || production.domainSha256 !== contract.domainSha256
    || production.authorizationSha256 !== auth.authorizationSha256
    || production.scientificOutcomeGenerationAuthorized !== true
    || production.scientificInferenceAuthorized !== true
    || production.exactClaimAuthorized !== false) {
    throw new Error("Invalid production Stage 1 result for verification");
  }

  const roots = contract.domain.roots.map(reconstructRootFromWitness);
  const limits = contract.spec.resourceLimits;
  const started = process.hrtime.bigint();
  const independent = I.solveIndependentTablebase(roots, {
    maxStates: limits.maximumStates,
    maxEdges: limits.maximumEdges,
    maxMicrostates: limits.maximumMoveMicrostates,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

  const checks = {
    rootKeys: Contract.stableStringify(independent.graph.rootKeys)
      === Contract.stableStringify(production.graph.rootKeys),
    stateCount: independent.graph.stateCount === production.graph.stateCount,
    edgeCount: independent.graph.edgeCount === production.graph.edgeCount,
    stateSetSha256: independent.graph.stateSetSha256 === production.graph.stateSetSha256,
    transitionSetSha256: independent.graph.transitionSetSha256 === production.graph.transitionSetSha256,
    counts: Contract.stableStringify(independent.solution.counts)
      === Contract.stableStringify(production.solution.counts),
    fullStateRows: Contract.stableStringify(independent.solution.rows)
      === Contract.stableStringify(production.solution.rows),
    recurrentSccs: Contract.stableStringify(independent.solution.recurrentSccs)
      === Contract.stableStringify(production.solution.recurrentSccs),
    solutionSha256: independent.solution.solutionSha256 === production.solution.solutionSha256,
  };
  const passed = Object.values(checks).every(Boolean);
  const resultCore = {
    schemaVersion: 1,
    studyId: contract.spec.studyId,
    stageId: "REWR-S1-INDEPENDENT-VERIFY-2026-08-24-v1",
    scientificInferenceAuthorized: true,
    exactClaimAuthorized: passed,
    specSha256: contract.specSha256,
    domainSha256: contract.domainSha256,
    authorizationSha256: auth.authorizationSha256,
    productionResultSha256: production.resultSha256,
    productionRawFileSha256: Contract.sha256(productionText),
    graphImplementationIndependence: {
      exactMtajiLegalMoveGeneratorShared: false,
      guardFreeTransitionShared: false,
      stateSerializationShared: false,
      closureTraversalShared: false,
      retrogradeAlgorithmShared: false,
      reachabilityWitnessReplayUsesAuthoritativeEngine: true
    },
    checks,
    passed,
    independent: {
      graph: {
        rootKeys: independent.graph.rootKeys,
        stateCount: independent.graph.stateCount,
        edgeCount: independent.graph.edgeCount,
        maxMoveMicrosteps: independent.graph.maxMoveMicrosteps,
        stateSetSha256: independent.graph.stateSetSha256,
        transitionSetSha256: independent.graph.transitionSetSha256,
      },
      solution: independent.solution,
      runtime: {
        elapsedMs,
        heapUsedBytesAfter: process.memoryUsage().heapUsed,
      },
    },
  };
  const result = { ...resultCore, resultSha256: Contract.sha256(Contract.stableStringify(resultCore)) };
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    checks: result.checks,
    passed: result.passed,
    exactClaimAuthorized: result.exactClaimAuthorized,
    solutionSha256: result.independent.solution.solutionSha256,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 2;
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs, reconstructRootFromWitness };
