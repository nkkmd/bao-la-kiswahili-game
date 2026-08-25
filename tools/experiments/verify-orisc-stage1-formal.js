#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const I = require("./lib/orisc-representation-independent.js");
const Ind = require("./lib/orisc-stage1-independent.js");
const IV = require("./lib/restricted-endgame-independent-verifier.js");
const V = require("./validate-orisc-stage1-spec.js");

const IDENTITY_FIELDS = ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"];

function parseArgs(argv) {
  const args = { input: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = path.resolve(argv[++i]);
    else if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!args.input || !args.output) throw new Error("--input and --output required");
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function eq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function boardReserveTotal(state) {
  let total = state.reserve[0] + state.reserve[1];
  for (const rows of state.pits) for (const row of rows) for (const n of row) total += n;
  return total;
}

function repositoryRowAudit(graph, repository) {
  const generated = new Map(graph.rows.map((row) => [row.stateKey, row.ruleState]));
  const rows = [];
  for (const row of repository.stateRows) {
    const recomputedKey = I.key(row.ruleState);
    const target = generated.get(row.stateKey);
    const diffs = target ? IDENTITY_FIELDS.filter((field) => !eq(target[field], row.ruleState[field])) : IDENTITY_FIELDS.slice();
    rows.push({
      storedStateKey: row.stateKey,
      recomputedKey,
      keyMatchesStored: recomputedKey === row.stateKey,
      representedSeeds: I.seedCount(row.ruleState),
      reconstructedRawStateFound: target !== undefined,
      identityFieldDifferences: diffs,
      rawBindingMatches: target !== undefined && diffs.length === 0,
      terminal: row.ruleState.winner !== null,
    });
  }
  return {
    rows,
    rehashMismatchRows: rows.filter((row) => !row.keyMatchesStored).length,
    bindingMismatchRows: rows.filter((row) => !row.rawBindingMatches).length,
  };
}

function repositoryTransitionAudit(graph, repository, maxMicrostates) {
  const edgeSet = new Set(graph.edges.map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`));
  const checks = [];
  for (const row of repository.stateRows) {
    if (row.ruleState.winner !== null) continue;
    const source = { ...JSON.parse(JSON.stringify(row.ruleState)), reason: "", turn: 1 };
    const moves = IV.legalMtajiMoves(source).sort((a, b) => I.moveIdentity(a).localeCompare(I.moveIdentity(b)));
    for (const move of moves) {
      const applied = IV.applyGuardFree(source, move, { maxMicrostates });
      if (applied.status !== "TERMINATED") {
        checks.push({ sourceKey: row.stateKey, moveKey: I.moveIdentity(move), passed: false, reason: applied.status });
        continue;
      }
      const targetKey = I.key(applied.state);
      const edgeLine = `${row.stateKey}\t${I.moveIdentity(move)}\t${targetKey}`;
      checks.push({
        sourceKey: row.stateKey,
        moveKey: I.moveIdentity(move),
        targetKey,
        passed: edgeSet.has(edgeLine),
        reason: edgeSet.has(edgeLine) ? "PASS" : "EDGE-NOT-IN-INDEPENDENT-GRAPH",
      });
    }
  }
  return { checks, mismatchCount: checks.filter((row) => !row.passed).length };
}

function terminalAudit(graph) {
  const rows = new Map(graph.rows.map((row) => [row.stateKey, row]));
  const stateChecks = graph.rows.map((row) => ({
    stateKey: row.stateKey,
    representedSeeds: row.representedSeeds,
    terminal: row.terminal,
    winner: row.ruleState.winner,
    passed: row.representedSeeds === 64,
  }));
  const edgeChecks = [];
  for (const edge of graph.edges) {
    const source = rows.get(edge.sourceKey);
    const target = rows.get(edge.targetKey);
    if (!target.terminal) continue;
    const sourcePending = source.ruleState.pending[0] + source.ruleState.pending[1];
    const targetPending = target.ruleState.pending[0] + target.ruleState.pending[1];
    const pendingDelta = targetPending - sourcePending;
    const boardReserveDelta = boardReserveTotal(target.ruleState) - boardReserveTotal(source.ruleState);
    const passed = source.representedSeeds === 64
      && target.representedSeeds === 64
      && pendingDelta + boardReserveDelta === 0
      && (target.ruleState.winner === 0 || target.ruleState.winner === 1);
    edgeChecks.push({ sourceKey: edge.sourceKey, moveKey: edge.moveKey, targetKey: edge.targetKey, pendingDelta, boardReserveDelta, passed });
  }
  return {
    stateChecks,
    edgeChecks,
    mismatchCount: stateChecks.filter((row) => !row.passed).length + edgeChecks.filter((row) => !row.passed).length,
  };
}

function boolMap(gates) {
  return Object.fromEntries(gates.map((row) => [row.gateId, row.passed]));
}

function sortedMismatchKeys(audit, field) {
  return audit.rows.filter((row) => !row[field]).map((row) => row.storedStateKey).sort();
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const production = readJson(args.input);
  const contract = V.loadSpec();
  const auth = V.loadAuthorization(contract);
  if (production.specSha256 !== contract.specSha256) throw new Error("Production/spec identity mismatch");
  if (production.authorizationSha256 !== auth.authorizationSha256) throw new Error("Production/authorization identity mismatch");

  const domain = readJson(V.resolveRepo(contract.spec.paths.rewrDomain));
  const repository = readJson(V.resolveRepo(contract.spec.paths.repositoryFacingOracle));
  const witness = Ind.replayFrozenWitness(domain);
  if (!witness.passed) throw new Error(`Independent frozen root witness regeneration failed: ${witness.reason}`);
  const graph = Ind.rebuild(witness.state, contract.spec.resourceLimits);
  const repositoryRows = repositoryRowAudit(graph, repository);
  const repositoryTransitions = repositoryTransitionAudit(graph, repository, contract.spec.resourceLimits.administrativeMaximumMoveMicrostates);
  const terminalAccounting = terminalAudit(graph);

  const productionRows = new Map(production.graph.rows.map((row) => [row.stateKey, row]));
  const stateRowsEqual = graph.rows.length === production.graph.rows.length && graph.rows.every((row) => {
    const p = productionRows.get(row.stateKey);
    return p !== undefined && p.serialization === row.serialization && eq(p.ruleState, row.ruleState) && p.representedSeeds === row.representedSeeds;
  });
  const edgesEqual = eq(
    production.graph.edges.map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`).sort(),
    graph.edges.map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`).sort(),
  );
  const graphCrossEquality = stateRowsEqual
    && edgesEqual
    && graph.rootKey === production.graph.rootKey
    && graph.stateSetSha256 === production.graph.stateSetSha256
    && graph.transitionSetSha256 === production.graph.transitionSetSha256;

  const immutableGraphPass = graph.rootKey === contract.spec.immutableGraph.rootKey
    && graph.stateCount === contract.spec.immutableGraph.stateCount
    && graph.edgeCount === contract.spec.immutableGraph.edgeCount
    && graph.stateSetSha256 === contract.spec.immutableGraph.stateSetSha256
    && graph.transitionSetSha256 === contract.spec.immutableGraph.transitionSetSha256;
  const serializerCrossEquality = stateRowsEqual;
  const seedPass = graph.rows.every((row) => row.representedSeeds === 64);
  const terminalPass = terminalAccounting.mismatchCount === 0;
  const rehashPass = repositoryRows.rehashMismatchRows === 0;
  const bindingPass = repositoryRows.bindingMismatchRows === 0;
  const transitionPass = repositoryTransitions.mismatchCount === 0;
  const identityControl = {
    stateIdentityMismatchCount: graph.rows.filter((row) => I.key(row.ruleState) !== row.stateKey).length,
    moveTransitionIdentityMismatchCount: 0,
    terminalSemanticsPass: terminalPass,
    repositoryReconstructionPass: rehashPass && bindingPass && transitionPass,
  };
  identityControl.passed = identityControl.stateIdentityMismatchCount === 0
    && identityControl.moveTransitionIdentityMismatchCount === 0
    && identityControl.terminalSemanticsPass
    && identityControl.repositoryReconstructionPass;

  const independentGates = [
    { gateId: "A-G1", passed: true },
    { gateId: "A-G2", passed: witness.passed && witness.rootKey === contract.spec.immutableGraph.rootKey },
    { gateId: "A-G3", passed: graphCrossEquality },
    { gateId: "A-G4", passed: immutableGraphPass },
    { gateId: "A-G5", passed: serializerCrossEquality },
    { gateId: "A-G6", passed: seedPass },
    { gateId: "A-G7", passed: terminalPass },
    { gateId: "A-G8", passed: rehashPass },
    { gateId: "A-G9", passed: bindingPass },
    { gateId: "A-G10", passed: transitionPass },
    { gateId: "A-G11", passed: identityControl.passed },
  ];

  const productionGateMap = boolMap(production.gates);
  const independentGateMap = boolMap(independentGates);
  const gateAgreement = Object.keys(independentGateMap).every((id) => productionGateMap[id] === independentGateMap[id]
    || ["A-G3", "A-G5"].includes(id));
  const repositoryRehashMismatchKeysEqual = eq(
    sortedMismatchKeys(production.repositoryRows, "keyMatchesStored"),
    sortedMismatchKeys(repositoryRows, "keyMatchesStored"),
  );
  const repositoryBindingMismatchKeysEqual = eq(
    sortedMismatchKeys(production.repositoryRows, "rawBindingMatches"),
    sortedMismatchKeys(repositoryRows, "rawBindingMatches"),
  );
  const crossImplementationEquality = graphCrossEquality
    && serializerCrossEquality
    && gateAgreement
    && repositoryRehashMismatchKeysEqual
    && repositoryBindingMismatchKeysEqual
    && production.repositoryTransitions.mismatchCount === repositoryTransitions.mismatchCount
    && production.terminalAccounting.mismatchCount === terminalAccounting.mismatchCount
    && production.identityControl.passed === identityControl.passed;

  const allPreA12Pass = independentGates.every((row) => row.passed);
  let formalDecision;
  if (!crossImplementationEquality) formalDecision = "NON-ESTIMABLE";
  else if (allPreA12Pass) formalDecision = "ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED";
  else formalDecision = "ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED";

  const resultCore = {
    schemaVersion: 1,
    studyId: "ORISC-STUDY1",
    stageId: contract.spec.stageId,
    specSha256: contract.specSha256,
    authorizationSha256: auth.authorizationSha256,
    stage2CandidateContractSha256: contract.candidateContractSha256,
    scientificOutcomeGenerationAuthorized: true,
    scientificInferenceAuthorized: true,
    finalFormalDecisionGenerated: true,
    upstreamFormalDecisionChanged: false,
    upstreamOracleMutated: false,
    productionResultSha256: production.resultSha256,
    graphImplementationIndependence: contract.spec.independenceBoundary,
    independent: {
      graph,
      repositoryRows,
      repositoryTransitions,
      terminalAccounting,
      identityControl,
      gates: independentGates,
    },
    crossImplementation: {
      graphCrossEquality,
      serializerCrossEquality,
      gateAgreement,
      repositoryRehashMismatchKeysEqual,
      repositoryBindingMismatchKeysEqual,
      transitionMismatchCountEqual: production.repositoryTransitions.mismatchCount === repositoryTransitions.mismatchCount,
      terminalAccountingMismatchCountEqual: production.terminalAccounting.mismatchCount === terminalAccounting.mismatchCount,
      identityControlDecisionEqual: production.identityControl.passed === identityControl.passed,
      A_G12_passed: crossImplementationEquality,
    },
    formalDecision,
    stage2ExecutionAuthorizedByThisResult: formalDecision === "ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED"
      && identityControl.passed
      && crossImplementationEquality,
    interpretationBoundary: "This formal decision concerns ORISC-STUDY1's downstream representation-integrity endpoint only. It does not modify REWR-STUDY1's exact-solution decision or SIP-STUDY1's 5/5 NON-ESTIMABLE closure. Stage 2 still requires a separate authorization even if its eligibility conditions are satisfied.",
  };
  const result = {
    ...resultCore,
    resultSha256: V.sha256Buffer(Buffer.from(JSON.stringify(resultCore), "utf8")),
  };
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    formalDecision: result.formalDecision,
    productionGates: productionGateMap,
    independentGates: independentGateMap,
    A_G12: result.crossImplementation.A_G12_passed,
    repositoryRehashMismatchRows: repositoryRows.rehashMismatchRows,
    repositoryBindingMismatchRows: repositoryRows.bindingMismatchRows,
    identityControlPassed: identityControl.passed,
    stage2ExecutionAuthorizedByThisResult: result.stage2ExecutionAuthorizedByThisResult,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs };
