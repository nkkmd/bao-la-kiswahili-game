"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const T = require("./lib/restricted-endgame-transition.js");
const TB = require("./lib/restricted-endgame-tablebase.js");
const Contract = require("./validate-restricted-endgame-stage1-spec.js");

function parseArgs(argv) {
  const args = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.output) throw new Error("--output required");
  return args;
}

function replayFrozenWitness(root) {
  let state = E.initialState();
  for (let ply = 0; ply < root.witness.moves.length; ply += 1) {
    const row = root.witness.moves[ply];
    const legal = E.moveVariants(state).slice().sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    const move = legal.find((candidate) => T.moveKey(candidate) === row.moveKey);
    if (!move) throw new Error(`Frozen witness move is not legal at ply ${ply}`);
    const before = T.directStateKey(state);
    if (before !== row.beforeStateKey) throw new Error(`Frozen witness before-state mismatch at ply ${ply}`);
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") throw new Error(`Frozen witness hit runtime relay guard at ply ${ply}`);
    const after = T.directStateKey(next);
    if (after !== row.afterStateKey) throw new Error(`Frozen witness after-state mismatch at ply ${ply}`);
    state = next;
  }
  const rootKey = T.directStateKey(state);
  if (rootKey !== root.rootStateKey) throw new Error("Frozen witness root mismatch");
  if (Contract.stableStringify(state) !== Contract.stableStringify(root.state)) {
    throw new Error("Frozen witness root-state serialization mismatch");
  }
  return state;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const contract = Contract.loadFrozenContract();
  const auth = Contract.loadAuthorization(contract);
  const roots = contract.domain.roots.map(replayFrozenWitness);
  const limits = contract.spec.resourceLimits;
  const started = process.hrtime.bigint();
  const tablebase = TB.solveExactTablebase(roots, {
    maxStates: limits.maximumStates,
    maxEdges: limits.maximumEdges,
    maxMicrostates: limits.maximumMoveMicrostates,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  const expected = contract.domain.expectedGraph;
  if (tablebase.graph.stateCount !== expected.stateCount
    || tablebase.graph.edgeCount !== expected.edgeCount
    || tablebase.graph.stateSetSha256 !== expected.stateSetSha256
    || tablebase.graph.transitionSetSha256 !== expected.transitionSetSha256) {
    throw new Error("Scientific graph does not match frozen Stage 0 domain identity");
  }

  const resultCore = {
    schemaVersion: 1,
    studyId: contract.spec.studyId,
    stageId: contract.spec.stageId,
    specSha256: contract.specSha256,
    domainSha256: contract.domainSha256,
    authorizationSha256: auth.authorizationSha256,
    scientificOutcomeGenerationAuthorized: true,
    scientificInferenceAuthorized: true,
    exactClaimAuthorized: false,
    exactClaimPendingIndependentVerification: true,
    sourceFileSha256: contract.sourceFileSha256,
    graph: {
      rootKeys: tablebase.graph.rootKeys,
      stateCount: tablebase.graph.stateCount,
      edgeCount: tablebase.graph.edgeCount,
      maxMoveMicrosteps: tablebase.graph.maxMoveMicrosteps,
      stateSetSha256: tablebase.graph.stateSetSha256,
      transitionSetSha256: tablebase.graph.transitionSetSha256,
    },
    solution: tablebase.solution,
    runtime: {
      elapsedMs,
      heapUsedBytesAfter: process.memoryUsage().heapUsed,
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };
  const result = {
    ...resultCore,
    resultSha256: Contract.sha256(Contract.stableStringify(resultCore)),
  };
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    studyId: result.studyId,
    stageId: result.stageId,
    specSha256: result.specSha256,
    domainSha256: result.domainSha256,
    graph: result.graph,
    counts: result.solution.counts,
    solutionSha256: result.solution.solutionSha256,
    exactClaimAuthorized: result.exactClaimAuthorized,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs, replayFrozenWitness };
