"use strict";

const fs = require("node:fs");
const path = require("node:path");
const S0 = require("./lib/restricted-endgame-stage0.js");
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

function regenerateFrozenWitness(root) {
  const trajectory = S0.generateTechnicalTrajectory(root.seed, root.ply);
  const candidate = trajectory.roots.find((row) => row.rootStateKey === root.rootStateKey && row.ply === root.ply);
  if (!candidate) throw new Error("Frozen witness root not regenerated");
  const witnessHash = Contract.sha256(Contract.stableStringify(candidate.witness));
  if (witnessHash !== root.witnessStableSha256) throw new Error("Frozen witness stable hash mismatch");
  if (Contract.sha256(Contract.stableStringify(candidate.state)) !== root.rootStateStableSha256) {
    throw new Error("Frozen regenerated root-state hash mismatch");
  }
  if (T.directStateKey(candidate.state) !== root.rootStateKey
    || Contract.stableStringify(candidate.state) !== Contract.stableStringify(root.state)) {
    throw new Error("Frozen regenerated root-state mismatch");
  }
  return candidate.state;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const contract = Contract.loadFrozenContract();
  const auth = Contract.loadAuthorization(contract);
  const roots = contract.domain.roots.map(regenerateFrozenWitness);
  const limits = contract.spec.resourceLimits;
  const started = process.hrtime.bigint();
  const tablebase = TB.solveExactTablebase(roots, {
    maxStates: limits.maximumStates,
    maxEdges: limits.maximumEdges,
    maxMicrostates: limits.administrativeMaximumMoveMicrostates,
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
  const result = { ...resultCore, resultSha256: Contract.sha256(Contract.stableStringify(resultCore)) };
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
module.exports = { main, parseArgs, regenerateFrozenWitness };
