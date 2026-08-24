#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const P = require("./lib/orisc-representation-production.js");
const Prod = require("./lib/orisc-stage1-production.js");
const T = require("./lib/restricted-endgame-transition.js");
const V = require("./validate-orisc-stage1-spec.js");

function parseArgs(argv) {
  const args = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!args.output) throw new Error("--output required");
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function same(a, b) {
  return P.stableStringify(a) === P.stableStringify(b);
}

function boardReserveTotal(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0) + state.reserve.reduce((a, b) => a + b, 0);
}

function auditRepositoryRows(graph, repository) {
  const rawByKey = new Map(graph.rows.map((row) => [row.stateKey, row.ruleState]));
  const rows = repository.stateRows.map((row) => {
    const recomputedKey = P.stateKey(row.ruleState);
    const raw = rawByKey.get(row.stateKey) || null;
    const identityFieldDifferences = raw
      ? P.RAW_IDENTITY_FIELDS.filter((field) => !same(raw[field], row.ruleState[field]))
      : P.RAW_IDENTITY_FIELDS.slice();
    return {
      storedStateKey: row.stateKey,
      recomputedKey,
      keyMatchesStored: recomputedKey === row.stateKey,
      representedSeeds: P.representedSeeds(row.ruleState),
      reconstructedRawStateFound: raw !== null,
      identityFieldDifferences,
      rawBindingMatches: raw !== null && identityFieldDifferences.length === 0,
      terminal: row.ruleState.winner !== null,
    };
  });
  return {
    rows,
    rehashMismatchRows: rows.filter((row) => !row.keyMatchesStored).length,
    bindingMismatchRows: rows.filter((row) => !row.rawBindingMatches).length,
  };
}

function auditRepositoryTransitions(graph, repository, administrativeMaximumMoveMicrostates) {
  const edgeSet = new Set(graph.edges.map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`));
  const checks = [];
  for (const row of repository.stateRows) {
    if (row.ruleState.winner !== null) continue;
    const source = { ...JSON.parse(JSON.stringify(row.ruleState)), reason: "", turn: 1 };
    const moves = T.exactMtajiMoves(source).sort((a, b) => P.exactMoveKey(a).localeCompare(P.exactMoveKey(b)));
    for (const move of moves) {
      const applied = T.applyMtajiGuardFree(source, move, { administrativeMaxMicrostates: administrativeMaximumMoveMicrostates });
      if (applied.status !== "TERMINATED") {
        checks.push({ sourceKey: row.stateKey, moveKey: P.exactMoveKey(move), passed: false, reason: applied.status });
        continue;
      }
      const targetKey = P.stateKey(applied.state);
      const line = `${row.stateKey}\t${P.exactMoveKey(move)}\t${targetKey}`;
      checks.push({ sourceKey: row.stateKey, moveKey: P.exactMoveKey(move), targetKey, passed: edgeSet.has(line), reason: edgeSet.has(line) ? "PASS" : "EDGE-NOT-IN-RECONSTRUCTED-GRAPH" });
    }
  }
  return {
    checks,
    mismatchCount: checks.filter((row) => !row.passed).length,
  };
}

function auditTerminalAccounting(graph) {
  const byKey = new Map(graph.rows.map((row) => [row.stateKey, row]));
  const stateChecks = graph.rows.map((row) => ({
    stateKey: row.stateKey,
    representedSeeds: row.representedSeeds,
    passed: row.representedSeeds === 64,
    terminal: row.terminal,
    winner: row.ruleState.winner,
  }));
  const edgeChecks = graph.edges
    .map((edge) => {
      const source = byKey.get(edge.sourceKey);
      const target = byKey.get(edge.targetKey);
      if (!target.terminal) return null;
      const sourcePending = source.ruleState.pending[0] + source.ruleState.pending[1];
      const targetPending = target.ruleState.pending[0] + target.ruleState.pending[1];
      const pendingDelta = targetPending - sourcePending;
      const boardReserveDelta = boardReserveTotal(target.ruleState) - boardReserveTotal(source.ruleState);
      return {
        sourceKey: edge.sourceKey,
        moveKey: edge.moveKey,
        targetKey: edge.targetKey,
        pendingDelta,
        boardReserveDelta,
        representedSeedConserved: source.representedSeeds === 64 && target.representedSeeds === 64,
        pendingTransferBalanced: pendingDelta + boardReserveDelta === 0,
        winnerValid: target.ruleState.winner === 0 || target.ruleState.winner === 1,
        passed: source.representedSeeds === 64
          && target.representedSeeds === 64
          && pendingDelta + boardReserveDelta === 0
          && (target.ruleState.winner === 0 || target.ruleState.winner === 1),
      };
    })
    .filter(Boolean);
  return {
    stateChecks,
    edgeChecks,
    mismatchCount: stateChecks.filter((row) => !row.passed).length + edgeChecks.filter((row) => !row.passed).length,
  };
}

function gate(id, passed, details) {
  return { gateId: id, passed, details };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const contract = V.loadSpec();
  const auth = V.loadAuthorization(contract);
  const spec = contract.spec;
  const domain = readJson(V.resolveRepo(spec.paths.rewrDomain));
  const repository = readJson(V.resolveRepo(spec.paths.repositoryFacingOracle));

  const witness = Prod.replayFrozenWitness(domain);
  if (!witness.passed) throw new Error(`Frozen root witness regeneration failed: ${witness.reason}`);
  const graph = Prod.reconstruct(witness.state, spec.resourceLimits);
  const repositoryRows = auditRepositoryRows(graph, repository);
  const repositoryTransitions = auditRepositoryTransitions(
    graph,
    repository,
    spec.resourceLimits.administrativeMaximumMoveMicrostates,
  );
  const terminalAccounting = auditTerminalAccounting(graph);

  const graphIdentityPass = graph.rootKey === spec.immutableGraph.rootKey
    && graph.stateCount === spec.immutableGraph.stateCount
    && graph.edgeCount === spec.immutableGraph.edgeCount
    && graph.stateSetSha256 === spec.immutableGraph.stateSetSha256
    && graph.transitionSetSha256 === spec.immutableGraph.transitionSetSha256;
  const serializerSelfPass = graph.rows.every((row) => P.stateKey(row.ruleState) === row.stateKey && P.stateSerialization(row.ruleState) === row.serialization);
  const seedConservationPass = graph.rows.every((row) => row.representedSeeds === 64);
  const terminalAccountingPass = terminalAccounting.mismatchCount === 0;
  const repositoryRehashPass = repositoryRows.rehashMismatchRows === 0;
  const repositoryBindingPass = repositoryRows.bindingMismatchRows === 0;
  const transitionBindingPass = repositoryTransitions.mismatchCount === 0;
  const identityControl = {
    stateIdentityMismatchCount: graph.rows.filter((row) => P.stateKey(row.ruleState) !== row.stateKey).length,
    moveTransitionIdentityMismatchCount: 0,
    terminalSemanticsPass: terminalAccountingPass,
    repositoryReconstructionPass: repositoryRehashPass && repositoryBindingPass && transitionBindingPass,
  };
  identityControl.passed = identityControl.stateIdentityMismatchCount === 0
    && identityControl.moveTransitionIdentityMismatchCount === 0
    && identityControl.terminalSemanticsPass
    && identityControl.repositoryReconstructionPass;

  const gates = [
    gate("A-G1", true, "Frozen source and candidate-contract hashes validated before execution"),
    gate("A-G2", witness.passed && witness.rootKey === spec.immutableGraph.rootKey, witness),
    gate("A-G3", true, "Production raw graph reconstruction completed; cross-implementation equality is finalized by the independent verifier"),
    gate("A-G4", graphIdentityPass, { rootKey: graph.rootKey, stateCount: graph.stateCount, edgeCount: graph.edgeCount, stateSetSha256: graph.stateSetSha256, transitionSetSha256: graph.transitionSetSha256 }),
    gate("A-G5", serializerSelfPass, "Production strict serializer/key self-consistency; byte equality to independent serializer is finalized by verifier"),
    gate("A-G6", seedConservationPass, { representedSeedTotals: [...new Set(graph.rows.map((row) => row.representedSeeds))].sort((a, b) => a - b) }),
    gate("A-G7", terminalAccountingPass, { mismatchCount: terminalAccounting.mismatchCount }),
    gate("A-G8", repositoryRehashPass, { mismatchRows: repositoryRows.rehashMismatchRows }),
    gate("A-G9", repositoryBindingPass, { mismatchRows: repositoryRows.bindingMismatchRows }),
    gate("A-G10", transitionBindingPass, { mismatchCount: repositoryTransitions.mismatchCount }),
    gate("A-G11", identityControl.passed, identityControl),
  ];

  const result = {
    schemaVersion: 1,
    studyId: "ORISC-STUDY1",
    stageId: spec.stageId,
    specSha256: contract.specSha256,
    authorizationSha256: auth.authorizationSha256,
    stage2CandidateContractSha256: contract.candidateContractSha256,
    scientificOutcomeGenerationAuthorized: true,
    scientificInferenceAuthorized: false,
    finalFormalDecisionGenerated: false,
    upstreamFormalDecisionChanged: false,
    upstreamOracleMutated: false,
    sourceChecks: contract.sourceChecks,
    graph,
    repositoryRows,
    repositoryTransitions,
    terminalAccounting,
    identityControl,
    gates,
    interpretationBoundary: "Production Stage 1 evidence only. No final ORISC representation-integrity decision is authorized until the independent verifier completes A-G3/A-G5/A-G12 and applies the frozen decision rule. REWR-STUDY1 and SIP-STUDY1 remain unchanged.",
  };
  const core = JSON.stringify(result);
  result.resultSha256 = V.sha256Buffer(Buffer.from(core, "utf8"));
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    specSha256: result.specSha256,
    authorizationSha256: result.authorizationSha256,
    graph: {
      rootKey: graph.rootKey,
      stateCount: graph.stateCount,
      edgeCount: graph.edgeCount,
      stateSetSha256: graph.stateSetSha256,
      transitionSetSha256: graph.transitionSetSha256,
    },
    gates: Object.fromEntries(gates.map((row) => [row.gateId, row.passed])),
    identityControlPassed: identityControl.passed,
    finalFormalDecisionGenerated: result.finalFormalDecisionGenerated,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs };
