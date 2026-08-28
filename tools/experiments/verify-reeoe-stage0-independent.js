"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const V = require("./lib/restricted-endgame-independent-verifier.js");
const IR = require("./lib/restricted-endgame-retrograde-independent.js");
const ITB = require("./lib/restricted-endgame-tablebase-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/restricted-endgame-exact-oracle-expansion/preregistration/STAGE_0_TECHNICAL_SPEC.json");
const DOMAIN_PATH = path.join(ROOT, "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/local/reeoe-stage0-technical/production-result.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/reeoe-stage0-technical/independent-verification.json");

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function assertIntegerArray(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || values.some((v) => !Number.isInteger(v) || v < 0)) {
    throw new Error(`Independent invalid ${label}`);
  }
}

// Independent strict RAW validator: deliberately not imported from production.
function strictRawStateIndependent(state, label = "state") {
  if (!state || typeof state !== "object") throw new Error(`Independent invalid ${label}`);
  if (!own(state, "pending")) throw new Error(`INDEPENDENT-MISSING-PENDING:${label}`);
  if (!Array.isArray(state.pits) || state.pits.length !== 2) throw new Error(`Independent invalid pits:${label}`);
  for (let p = 0; p < 2; p += 1) {
    if (!Array.isArray(state.pits[p]) || state.pits[p].length !== 2) throw new Error(`Independent invalid pit rows:${label}`);
    for (let r = 0; r < 2; r += 1) assertIntegerArray(state.pits[p][r], 8, `pit row:${label}`);
  }
  assertIntegerArray(state.reserve, 2, `reserve:${label}`);
  assertIntegerArray(state.pending, 2, `pending:${label}`);
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2
    || state.houseOwned.some((v) => typeof v !== "boolean")) throw new Error(`Independent invalid houseOwned:${label}`);
  if (![0, 1].includes(state.player)) throw new Error(`Independent invalid player:${label}`);
  if (!["namua", "mtaji"].includes(state.phase)) throw new Error(`Independent invalid phase:${label}`);
  if (![null, 0, 1].includes(state.winner)) throw new Error(`Independent invalid winner:${label}`);
  return true;
}

function representedSeeds(state) {
  let total = 0;
  for (const playerRows of state.pits) for (const row of playerRows) for (const value of row) total += value;
  return total + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}

function predecessorRows(nodes) {
  const rows = [];
  for (const node of nodes) {
    for (const move of node.moves) rows.push({ to: move.to, from: node.id, moveKey: move.key });
  }
  rows.sort((a, b) => a.to.localeCompare(b.to) || a.from.localeCompare(b.from) || a.moveKey.localeCompare(b.moveKey));
  return rows;
}

function edgeRows(nodes) {
  const rows = [];
  for (const node of nodes) for (const move of node.moves) rows.push(`${node.id}\t${move.key}\t${move.to}`);
  return rows.sort();
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

function expectThrow(fn, predicate) {
  try {
    fn();
    return false;
  } catch (error) {
    return predicate(error);
  }
}

function negativeControlResults(exactNodes, exactPredecessors) {
  // C01: remove a referenced successor node.
  const c01Nodes = clone(exactNodes);
  const referencing = c01Nodes.find((node) => node.moves.length > 0);
  const missingTarget = referencing.moves[0].to;
  const filtered = c01Nodes.filter((node) => node.id !== missingTarget);
  const c01 = expectThrow(
    () => IR.validate(filtered),
    (error) => String(error.message).includes("Missing successor"),
  );

  // C02: terminal -> winner null while retaining zero moves.
  const c02Nodes = clone(exactNodes);
  const terminal = c02Nodes.find((node) => node.winner !== null && node.moves.length === 0);
  terminal.winner = null;
  const c02 = expectThrow(
    () => IR.validate(c02Nodes),
    (error) => String(error.message).includes("Nonterminal node has no moves"),
  );

  // C03: omit one legal edge but retain a syntactically valid graph if possible.
  const c03Nodes = clone(exactNodes);
  const multi = c03Nodes.find((node) => node.winner === null && node.moves.length >= 2);
  if (!multi) throw new Error("No multi-move node available for C03 fixture");
  multi.moves.pop();
  IR.validate(c03Nodes);
  const c03 = stableStringify(edgeRows(c03Nodes)) !== stableStringify(edgeRows(exactNodes));

  // C04: corrupt predecessor materialization and compare with reconstruction.
  const corruptedPredecessors = clone(exactPredecessors);
  corruptedPredecessors.pop();
  const c04 = sha256Stable(corruptedPredecessors) !== sha256Stable(predecessorRows(exactNodes));

  return {
    "REEOE-C01-MISSING-SUCCESSOR": c01,
    "REEOE-C02-INCORRECT-TERMINAL": c02,
    "REEOE-C03-INCOMPLETE-EDGE-SET": c03,
    "REEOE-C04-CORRUPTED-PREDECESSOR": c04,
  };
}

function main() {
  const productionPath = path.resolve(process.argv[2] || DEFAULT_PRODUCTION);
  const outputPath = path.resolve(process.argv[3] || DEFAULT_OUTPUT);
  const spec = readJson(SPEC_PATH);
  const domain = readJson(DOMAIN_PATH);
  const productionBytes = fs.readFileSync(productionPath);
  const production = JSON.parse(productionBytes.toString("utf8"));

  if (production.studyId !== "REEOE-STUDY1" || production.stageId !== spec.stageId) {
    throw new Error("Production result identity mismatch");
  }
  if (production.productionTechnicalStatus !== "PASS") throw new Error("Production technical runner did not pass");
  if (production.scientificInferenceAuthorized !== false || production.formalExactDecisionAuthorized !== false
    || production.stage1ScientificGenerationAuthorized !== false || production.stage2ScientificGenerationAuthorized !== false) {
    throw new Error("Production result contains unauthorized scientific flag");
  }

  const root = clone(domain.roots[0].state);
  strictRawStateIndependent(root, "positive-root");
  const independentRootKey = V.stateKey(root);
  if (independentRootKey !== spec.positiveControl.rootStateKey) throw new Error("Independent root key mismatch");

  const missingPending = clone(root);
  delete missingPending.pending;
  const missingPendingRejected = expectThrow(
    () => strictRawStateIndependent(missingPending, "missing-pending-control"),
    (error) => String(error.message).startsWith("INDEPENDENT-MISSING-PENDING:"),
  );
  if (!missingPendingRejected) throw new Error("Independent strict RAW validator accepted missing pending");

  const options = {
    maxStates: spec.resourceProfile.positiveFixtureMaxStates,
    maxEdges: spec.resourceProfile.positiveFixtureMaxEdges,
    maxMicrostates: spec.resourceProfile.maxMoveMicrostates,
  };
  const independent = ITB.solveIndependentTablebase([root], options);
  for (const record of independent.graph.stateRecords) {
    strictRawStateIndependent(record.ruleState, `graph:${record.stateKey}`);
    if (representedSeeds(record.ruleState) !== 64) throw new Error(`Independent seed conservation failure ${record.stateKey}`);
  }

  const expected = spec.positiveControl.expected;
  const rootResult = independent.solution.rows.find((row) => row.stateKey === spec.positiveControl.rootStateKey);
  const independentExpectedChecks = {
    stateCount: independent.graph.stateCount === expected.stateCount,
    edgeCount: independent.graph.edgeCount === expected.edgeCount,
    stateSetSha256: independent.graph.stateSetSha256 === expected.stateSetSha256,
    transitionSetSha256: independent.graph.transitionSetSha256 === expected.transitionSetSha256,
    terminalCount: independent.solution.counts.terminal === expected.terminal,
    winCount: independent.solution.counts.win === expected.win,
    lossCount: independent.solution.counts.loss === expected.loss,
    recurrentCount: independent.solution.counts.recurrent === expected.recurrent,
    solutionSha256: independent.solution.solutionSha256 === expected.solutionSha256,
    rootStatus: rootResult?.status === expected.rootStatus,
    rootAbsoluteWinner: rootResult?.absoluteWinner === expected.rootAbsoluteWinner,
    rootDtf: rootResult?.dtf === expected.rootDtf,
    rootOptimalMoveKeys: stableStringify(rootResult?.optimalMoveKeys) === stableStringify(expected.rootOptimalMoveKeys),
  };

  const independentPredecessors = predecessorRows(independent.graph.graphNodes);
  const productionGraph = production.technical.graph;
  const productionSolution = production.technical.solution;
  const crossChecks = {
    graphNodes: stableStringify(independent.graph.graphNodes) === stableStringify(productionGraph.graphNodes),
    stateRecords: stableStringify(independent.graph.stateRecords) === stableStringify(productionGraph.stateRecords),
    predecessorRows: stableStringify(independentPredecessors) === stableStringify(productionGraph.predecessorRows),
    predecessorSha256: sha256Stable(independentPredecessors) === productionGraph.predecessorSha256,
    solutionRows: stableStringify(compactSolutionRows(independent.solution.rows)) === stableStringify(productionSolution.rows),
    recurrentSccs: stableStringify(independent.solution.recurrentSccs) === stableStringify(productionSolution.recurrentSccs),
    solutionSha256: independent.solution.solutionSha256 === productionSolution.solutionSha256,
  };

  const negativeControls = negativeControlResults(independent.graph.graphNodes, independentPredecessors);

  const gates = {
    "S0-G1": production.technical.strictRawValidation.missingPendingRejected === true && missingPendingRejected === true,
    "S0-G2": production.technical.rootKey === spec.positiveControl.rootStateKey && independentRootKey === spec.positiveControl.rootStateKey,
    "S0-G3": Object.values(production.positiveChecks).every(Boolean),
    "S0-G4": Object.values(independentExpectedChecks).every(Boolean),
    "S0-G5": crossChecks.graphNodes && crossChecks.stateRecords,
    "S0-G6": crossChecks.predecessorRows && crossChecks.predecessorSha256,
    "S0-G7": production.positiveChecks.solutionSha256 === true
      && production.positiveChecks.rootDtf === true
      && production.positiveChecks.rootOptimalMoveKeys === true,
    "S0-G8": crossChecks.solutionRows && crossChecks.solutionSha256 && Object.values(independentExpectedChecks).every(Boolean),
    "S0-G9": crossChecks.recurrentSccs,
    "S0-G10": Object.values(negativeControls).every(Boolean),
    "S0-G11": production.technical.runtimeComparison.runtimeGuardHits === 0
      && production.technical.runtimeComparison.transitionComparisonMismatches === 0
      && independent.graph.maxMoveMicrosteps <= spec.resourceProfile.maxMoveMicrostates,
    "S0-G12": production.scientificInferenceAuthorized === false
      && production.formalExactDecisionAuthorized === false
      && production.stage1ScientificGenerationAuthorized === false
      && production.stage2ScientificGenerationAuthorized === false,
  };

  const allPass = Object.values(gates).every(Boolean);
  const verificationCore = {
    gates,
    independentExpectedChecks,
    crossChecks,
    negativeControls,
    independent: {
      rootKey: independentRootKey,
      stateCount: independent.graph.stateCount,
      edgeCount: independent.graph.edgeCount,
      stateSetSha256: independent.graph.stateSetSha256,
      transitionSetSha256: independent.graph.transitionSetSha256,
      predecessorSha256: sha256Stable(independentPredecessors),
      maxMoveMicrosteps: independent.graph.maxMoveMicrosteps,
      solutionSha256: independent.solution.solutionSha256,
      counts: independent.solution.counts,
      recurrentSccs: independent.solution.recurrentSccs,
      representedSeedTotals: [...new Set(independent.graph.stateRecords.map((record) => representedSeeds(record.ruleState)))].sort((a, b) => a - b),
    },
  };

  const result = {
    schemaVersion: 1,
    programLabel: "G2-04",
    studyId: "REEOE-STUDY1",
    stageId: spec.stageId,
    resultRole: "independent-stage0-technical-verification",
    stage0TechnicalDecision: allPass ? "STAGE0-TECHNICAL-PASS" : "STAGE0-TECHNICAL-BLOCK",
    scientificInferenceAuthorized: false,
    formalExactDecisionAuthorized: false,
    stage1ScientificGenerationAuthorized: false,
    stage2ScientificGenerationAuthorized: false,
    productionResultFileSha256: sha256Bytes(productionBytes),
    independentVerifierFileSha256: sha256Bytes(fs.readFileSync(__filename)),
    verification: verificationCore,
    verificationCoreSha256: sha256Stable(verificationCore),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopenedBytes = fs.readFileSync(outputPath);
  const reopened = JSON.parse(reopenedBytes.toString("utf8"));
  if (sha256Stable(reopened.verification) !== result.verificationCoreSha256) throw new Error("Independent verification reopen/hash mismatch");
  if (!allPass) throw new Error(`Stage 0 technical gate failure: ${JSON.stringify(gates)}`);

  console.log(JSON.stringify({
    outputPath,
    stage0TechnicalDecision: result.stage0TechnicalDecision,
    gates,
    negativeControls,
    independentSolutionSha256: independent.solution.solutionSha256,
    predecessorSha256: verificationCore.independent.predecessorSha256,
    productionResultFileSha256: result.productionResultFileSha256,
    verificationFileSha256: sha256Bytes(reopenedBytes),
  }, null, 2));
}

main();
