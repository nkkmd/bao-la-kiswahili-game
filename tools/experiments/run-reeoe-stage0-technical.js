"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const T = require("./lib/restricted-endgame-transition.js");
const TB = require("./lib/restricted-endgame-tablebase.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_0_TECHNICAL_SPEC.json");
const DOMAIN_PATH = path.join(ROOT, "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/reeoe-stage0-technical/production-result.json");

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Bytes(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sha256Stable(value) {
  return sha256Bytes(Buffer.from(stableStringify(value)));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function assertIntegerArray(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || values.some((v) => !Number.isInteger(v) || v < 0)) {
    throw new Error(`Invalid ${label}`);
  }
}

function strictRawState(state, label = "state") {
  if (!state || typeof state !== "object") throw new Error(`Invalid ${label}`);
  if (!own(state, "pending")) throw new Error(`MISSING-PENDING:${label}`);
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error(`Invalid pits:${label}`);
  for (let p = 0; p < 2; p += 1) {
    if (!Array.isArray(state.pits[p]) || state.pits[p].length !== 2) throw new Error(`Invalid pit rows:${label}`);
    for (let r = 0; r < 2; r += 1) assertIntegerArray(state.pits[p][r], 8, `pit row:${label}`);
  }
  assertIntegerArray(state.reserve, 2, `reserve:${label}`);
  assertIntegerArray(state.pending, 2, `pending:${label}`);
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2
    || state.houseOwned.some((v) => typeof v !== "boolean")) throw new Error(`Invalid houseOwned:${label}`);
  if (![0, 1].includes(state.player)) throw new Error(`Invalid player:${label}`);
  if (!["namua", "mtaji"].includes(state.phase)) throw new Error(`Invalid phase:${label}`);
  if (![null, 0, 1].includes(state.winner)) throw new Error(`Invalid winner:${label}`);
  return true;
}

function representedSeeds(state) {
  let total = 0;
  for (const playerRows of state.pits) for (const row of playerRows) for (const value of row) total += value;
  return total + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}

function predecessorRows(graphNodes) {
  const rows = [];
  for (const node of graphNodes) {
    for (const move of node.moves) rows.push({ to: move.to, from: node.id, moveKey: move.key });
  }
  rows.sort((a, b) => a.to.localeCompare(b.to) || a.from.localeCompare(b.from) || a.moveKey.localeCompare(b.moveKey));
  return rows;
}

function compactSolutionRows(solutionRows) {
  return solutionRows.map((row) => ({
    stateKey: row.stateKey,
    status: row.status,
    absoluteWinner: row.absoluteWinner,
    dtf: row.dtf,
    optimalMoveKeys: row.optimalMoveKeys,
    recurrentMoveKeys: row.recurrentMoveKeys,
    sccId: row.sccId,
    cyclicScc: row.cyclicScc,
  }));
}

function sourceFileHashes() {
  const files = [
    "public/engine.js",
    "tools/experiments/lib/restricted-endgame-transition.js",
    "tools/experiments/lib/restricted-endgame-retrograde.js",
    "tools/experiments/lib/restricted-endgame-tablebase.js",
    "tools/experiments/run-reeoe-stage0-technical.js",
    "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_0_TECHNICAL_SPEC.json",
    "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json",
  ];
  return Object.fromEntries(files.map((relative) => [relative, sha256Bytes(fs.readFileSync(path.join(ROOT, relative)))]));
}

function main() {
  const outputPath = path.resolve(process.argv[2] || DEFAULT_OUTPUT);
  const spec = readJson(SPEC_PATH);
  const domain = readJson(DOMAIN_PATH);
  if (spec.studyId !== "REEOE-STUDY1" || spec.stageId !== "REEOE-S0-TECHNICAL-2026-08-28-v1") {
    throw new Error("Unexpected Stage 0 spec identity");
  }
  if (domain.domainId !== spec.positiveControl.upstreamDomainId || domain.roots.length !== 1) {
    throw new Error("Unexpected REWR control domain");
  }

  const root = JSON.parse(JSON.stringify(domain.roots[0].state));
  strictRawState(root, "positive-root");
  const rootKey = T.directStateKey(root);
  if (rootKey !== spec.positiveControl.rootStateKey) throw new Error(`Root key mismatch: ${rootKey}`);

  const missingPending = JSON.parse(JSON.stringify(root));
  delete missingPending.pending;
  let missingPendingRejected = false;
  try {
    strictRawState(missingPending, "missing-pending-control");
  } catch (error) {
    missingPendingRejected = String(error.message).startsWith("MISSING-PENDING:");
  }
  if (!missingPendingRejected) throw new Error("Strict production RAW validator accepted missing pending");

  const options = {
    maxStates: spec.resourceProfile.positiveFixtureMaxStates,
    maxEdges: spec.resourceProfile.positiveFixtureMaxEdges,
    maxMicrostates: spec.resourceProfile.maxMoveMicrostates,
  };
  const solved = TB.solveExactTablebase([root], options);
  const { graph, solution } = solved;

  for (const record of graph.stateRecords) {
    strictRawState(record.ruleState, `graph:${record.stateKey}`);
    if (representedSeeds(record.ruleState) !== 64) throw new Error(`Seed conservation failure ${record.stateKey}`);
  }

  const expected = spec.positiveControl.expected;
  const rootResult = solution.rows.find((row) => row.stateKey === expected.rootStateKey);
  const positiveChecks = {
    stateCount: graph.stateCount === expected.stateCount,
    edgeCount: graph.edgeCount === expected.edgeCount,
    stateSetSha256: graph.stateSetSha256 === expected.stateSetSha256,
    transitionSetSha256: graph.transitionSetSha256 === expected.transitionSetSha256,
    terminalCount: solution.counts.terminal === expected.terminal,
    winCount: solution.counts.win === expected.win,
    lossCount: solution.counts.loss === expected.loss,
    recurrentCount: solution.counts.recurrent === expected.recurrent,
    solutionSha256: solution.solutionSha256 === expected.solutionSha256,
    rootStatus: rootResult?.status === expected.rootStatus,
    rootAbsoluteWinner: rootResult?.absoluteWinner === expected.rootAbsoluteWinner,
    rootDtf: rootResult?.dtf === expected.rootDtf,
    rootOptimalMoveKeys: stableStringify(rootResult?.optimalMoveKeys) === stableStringify(expected.rootOptimalMoveKeys),
  };
  if (Object.values(positiveChecks).some((value) => !value)) {
    throw new Error(`Positive control mismatch: ${JSON.stringify(positiveChecks)}`);
  }

  // Guard-free semantics must finish the entire technical fixture without turning
  // an administrative/runtime guard into a game result.
  let runtimeGuardHits = 0;
  let transitionComparisonMismatches = 0;
  for (const record of graph.stateRecords) {
    const state = record.ruleState;
    if (state.winner !== null) continue;
    const exactMoves = T.exactMtajiMoves(state).sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    for (const move of exactMoves) {
      const comparison = T.compareWithRuntimeEngine(state, move, {
        administrativeMaxMicrostates: spec.resourceProfile.maxMoveMicrostates,
      });
      if (comparison.runtimeGuardHit) runtimeGuardHits += 1;
      else if (!comparison.equal) transitionComparisonMismatches += 1;
      if (comparison.exact.status !== "TERMINATED") throw new Error(`Guard-free transition did not terminate: ${comparison.exact.status}`);
    }
  }
  if (runtimeGuardHits !== 0 || transitionComparisonMismatches !== 0) {
    throw new Error(`Positive fixture runtime/exact mismatch guardHits=${runtimeGuardHits} mismatches=${transitionComparisonMismatches}`);
  }

  const predecessors = predecessorRows(graph.graphNodes);
  const technicalCore = {
    rootKey,
    graph: {
      stateCount: graph.stateCount,
      edgeCount: graph.edgeCount,
      maxMoveMicrosteps: graph.maxMoveMicrosteps,
      stateSetSha256: graph.stateSetSha256,
      transitionSetSha256: graph.transitionSetSha256,
      graphNodes: graph.graphNodes,
      stateRecords: graph.stateRecords,
      predecessorRows: predecessors,
      predecessorSha256: sha256Stable(predecessors),
    },
    solution: {
      counts: solution.counts,
      recurrentSccs: solution.recurrentSccs,
      rows: compactSolutionRows(solution.rows),
      solutionSha256: solution.solutionSha256,
    },
    strictRawValidation: {
      missingPendingRejected,
      representedSeedTotals: [...new Set(graph.stateRecords.map((record) => representedSeeds(record.ruleState)))].sort((a, b) => a - b),
    },
    runtimeComparison: {
      runtimeGuardHits,
      transitionComparisonMismatches,
    },
  };

  const result = {
    schemaVersion: 1,
    programLabel: "G2-04",
    studyId: "REEOE-STUDY1",
    stageId: spec.stageId,
    resultRole: "technical-production-positive-control-only",
    productionTechnicalStatus: "PASS",
    scientificInferenceAuthorized: false,
    formalExactDecisionAuthorized: false,
    stage1ScientificGenerationAuthorized: false,
    stage2ScientificGenerationAuthorized: false,
    specFileSha256: sha256Bytes(fs.readFileSync(SPEC_PATH)),
    domainFileSha256: sha256Bytes(fs.readFileSync(DOMAIN_PATH)),
    sourceFileSha256: sourceFileHashes(),
    positiveChecks,
    technical: technicalCore,
    technicalCoreSha256: sha256Stable(technicalCore),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  // Reopen immediately so materialization problems are technical failures.
  const reopened = readJson(outputPath);
  if (sha256Stable(reopened.technical) !== result.technicalCoreSha256) throw new Error("Reopened technical core hash mismatch");
  if (reopened.scientificInferenceAuthorized !== false || reopened.formalExactDecisionAuthorized !== false) {
    throw new Error("Technical result contains unauthorized scientific flag");
  }
  console.log(JSON.stringify({
    outputPath,
    productionTechnicalStatus: result.productionTechnicalStatus,
    stateCount: graph.stateCount,
    edgeCount: graph.edgeCount,
    solutionSha256: solution.solutionSha256,
    predecessorSha256: technicalCore.graph.predecessorSha256,
    technicalCoreSha256: result.technicalCoreSha256,
  }, null, 2));
}

main();
