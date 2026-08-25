#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const indep = require("./lib/ssgtc-representation-independent.js");

const STUDY_ID = "SSGTC-STUDY1";
const STAGE_ID = "SSGTC-S1-EXPLORATORY-2026-08-25-v1";
const OUT_DIR = process.env.SSGTC_STAGE1_OUT
  ? path.resolve(process.env.SSGTC_STAGE1_OUT)
  : path.resolve(__dirname, "../../artifacts/local/state-space-game-tree-complexity/stage1-exploratory-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function fileSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function setHash(values) {
  return indep.sha256(values.slice().sort().join("\n"));
}

function transitionFingerprint(parentKey, moveKey, childKey) {
  return indep.sha256(`${parentKey}|${moveKey}|${childKey}`);
}

function withoutRowHash(row) {
  const out = { ...row };
  delete out.rowSha256;
  return out;
}

function parseJsonl(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return text.split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function normalizeMove(move) {
  const out = {};
  for (const field of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[field] !== undefined) out[field] = move[field];
  }
  if (move.houseTwo === true) out.houseTwo = true;
  return out;
}

function objectFromMap(map) {
  return Object.fromEntries(Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0])));
}

function geometricMean(values) {
  if (!values.length) return null;
  return Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length);
}

function closeEnough(a, b, tolerance = 1e-12) {
  if (a === null || b === null) return a === b;
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

function compareScalar(actual, expected, name) {
  if (typeof actual === "number" && typeof expected === "number") {
    ensure(closeEnough(actual, expected), `${name} mismatch: ${actual} != ${expected}`);
  } else {
    ensure(actual === expected, `${name} mismatch: ${actual} != ${expected}`);
  }
}

function rerunCompletedGraph(lastFullyExpandedDepth) {
  const root = indep.project(engine.initialState());
  indep.assertStudyState(root);
  const rootKey = indep.key(root);
  const states = new Map([[rootKey, { state: root, depth: 0 }]]);
  let frontier = [rootKey];
  const fingerprints = [];

  for (let depth = 0; depth <= lastFullyExpandedDepth; depth += 1) {
    const next = [];
    for (const parentKey of frontier) {
      const parent = states.get(parentKey).state;
      if (parent.winner !== null) continue;
      const moves = engine.moveVariants(parent).map(normalizeMove)
        .sort((a, b) => indep.moveIdentity(a).localeCompare(indep.moveIdentity(b)));
      for (const move of moves) {
        indep.assertStudyState(parent);
        const child = engine.applyMove(parent, move).state;
        indep.assertStudyState(child);
        const childRaw = indep.project(child);
        const childKey = indep.key(childRaw);
        const moveKey = indep.moveIdentity(move);
        fingerprints.push(transitionFingerprint(parentKey, moveKey, childKey));
        if (!states.has(childKey)) {
          states.set(childKey, { state: childRaw, depth: depth + 1 });
          next.push(childKey);
        }
      }
    }
    frontier = next;
  }
  return {
    stateSetSha256: setHash(Array.from(states.keys())),
    transitionSetSha256: setHash(fingerprints),
    states: states.size,
    transitions: fingerprints.length,
  };
}

function rerunCompletedTree(lastFullyExpandedDepth) {
  let frontier = [indep.project(engine.initialState())];
  const depthCounts = new Map([[0, 1]]);
  let nodes = 1;
  let edges = 0;
  for (let depth = 0; depth <= lastFullyExpandedDepth; depth += 1) {
    const next = [];
    for (const parent of frontier) {
      indep.assertStudyState(parent);
      if (parent.winner !== null) continue;
      const moves = engine.moveVariants(parent).map(normalizeMove)
        .sort((a, b) => indep.moveIdentity(a).localeCompare(indep.moveIdentity(b)));
      for (const move of moves) {
        const child = engine.applyMove(parent, move).state;
        indep.assertStudyState(child);
        next.push(indep.project(child));
        nodes += 1;
        edges += 1;
      }
    }
    frontier = next;
    depthCounts.set(depth + 1, next.length);
  }
  return { depthCounts, nodes, edges };
}

function main() {
  const statesPath = path.join(OUT_DIR, "graph-states.jsonl");
  const transitionsPath = path.join(OUT_DIR, "graph-transitions.jsonl");
  const summaryPath = path.join(OUT_DIR, "stage1-exploratory-summary.json");
  const reportingPath = path.join(OUT_DIR, "repository-facing-summary.json");
  const productionVerificationPath = path.join(OUT_DIR, "production-verification.json");
  for (const required of [statesPath, transitionsPath, summaryPath, reportingPath, productionVerificationPath]) {
    ensure(fs.existsSync(required), `missing Stage 1 artifact ${required}`);
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const reporting = JSON.parse(fs.readFileSync(reportingPath, "utf8"));
  const productionVerification = JSON.parse(fs.readFileSync(productionVerificationPath, "utf8"));
  ensure(summary.studyId === STUDY_ID && summary.stageId === STAGE_ID, "summary identity mismatch");
  ensure(reporting.studyId === STUDY_ID && reporting.stageId === STAGE_ID, "reporting identity mismatch");
  ensure(summary.scientificInferenceAuthorized === false && summary.formalReuseInStage2 === false,
    "Stage 1 scientific/formal firewall mismatch");
  ensure(summary.symmetryReductionUsed === false && summary.canonicalizationUsed === false,
    "forbidden reduction reported as used");

  ensure(fileSha256(statesPath) === productionVerification.hashes.graphStatesFileSha256,
    "graph states file hash mismatch");
  ensure(fileSha256(transitionsPath) === productionVerification.hashes.graphTransitionsFileSha256,
    "graph transitions file hash mismatch");
  ensure(fileSha256(summaryPath) === productionVerification.hashes.summaryFileSha256,
    "summary file hash mismatch");
  ensure(fileSha256(reportingPath) === productionVerification.hashes.repositoryFacingFileSha256,
    "reporting file hash mismatch");

  const stateRows = parseJsonl(statesPath);
  const transitionRows = parseJsonl(transitionsPath);
  const states = new Map();
  const depthCounts = new Map();
  const phaseCounts = { namua: 0, mtaji: 0 };
  const terminalCounts = { terminal: 0, nonterminal: 0 };
  const winnerCounts = { player0: 0, player1: 0, none: 0 };

  for (const row of stateRows) {
    ensure(indep.sha256(indep.canonical(withoutRowHash(row))) === row.rowSha256,
      `state row hash mismatch ${row.stateKey}`);
    indep.assertStudyState(row.rawState);
    ensure(indep.key(row.rawState) === row.stateKey, `state key mismatch ${row.stateKey}`);
    ensure(!states.has(row.stateKey), `duplicate materialized state row ${row.stateKey}`);
    states.set(row.stateKey, row);
    depthCounts.set(row.minDepth, (depthCounts.get(row.minDepth) || 0) + 1);
    phaseCounts[row.rawState.phase] += 1;
    if (row.rawState.winner === null) {
      terminalCounts.nonterminal += 1;
      winnerCounts.none += 1;
    } else {
      terminalCounts.terminal += 1;
      winnerCounts[row.rawState.winner === 0 ? "player0" : "player1"] += 1;
    }
  }

  const indegree = new Map(Array.from(states.keys()).map((key) => [key, 0]));
  const outgoing = new Map();
  const transitionFingerprints = [];
  let nonIncreasingDepthEdges = 0;
  for (const row of transitionRows) {
    ensure(indep.sha256(indep.canonical(withoutRowHash(row))) === row.rowSha256,
      `transition row hash mismatch ${row.parentKey}`);
    ensure(states.has(row.parentKey) && states.has(row.childKey), "transition references unknown state");
    ensure(indep.moveIdentity(row.move) === row.moveKey, "move identity mismatch");
    ensure(states.get(row.parentKey).minDepth === row.parentDepth, "parent depth binding mismatch");
    ensure(row.childDepth === row.parentDepth + 1, "emitted transition childDepth must be parentDepth+1 occurrence depth");
    indegree.set(row.childKey, indegree.get(row.childKey) + 1);
    if (!outgoing.has(row.parentKey)) outgoing.set(row.parentKey, []);
    outgoing.get(row.parentKey).push(row);
    transitionFingerprints.push(transitionFingerprint(row.parentKey, row.moveKey, row.childKey));
    if (states.get(row.childKey).minDepth <= row.parentDepth) nonIncreasingDepthEdges += 1;
  }

  const rootRows = stateRows.filter((row) => row.minDepth === 0);
  ensure(rootRows.length === 1, "expected exactly one graph root");
  const rootKey = rootRows[0].stateKey;
  ensure(indep.key(engine.initialState()) === rootKey, "materialized root differs from fresh engine initial state");

  const bfsDepth = new Map([[rootKey, 0]]);
  let bfsFrontier = [rootKey];
  while (bfsFrontier.length) {
    const next = [];
    for (const parentKey of bfsFrontier) {
      const depth = bfsDepth.get(parentKey);
      for (const edge of outgoing.get(parentKey) || []) {
        if (!bfsDepth.has(edge.childKey)) {
          bfsDepth.set(edge.childKey, depth + 1);
          next.push(edge.childKey);
        }
      }
    }
    bfsFrontier = next;
  }
  ensure(bfsDepth.size === states.size, "not all materialized graph states are reachable from root");
  for (const row of stateRows) ensure(bfsDepth.get(row.stateKey) === row.minDepth, `minimum BFS depth mismatch ${row.stateKey}`);

  const lastFullyExpandedDepth = summary.graph.lastFullyExpandedDepth;
  const lastFullyDiscoveredDepth = summary.graph.lastFullyDiscoveredDepth;
  const branchingValues = [];
  let fullyExpandedNonterminalStates = 0;
  let fullyExpandedTerminalStates = 0;
  let forcedSingleStates = 0;
  let captureForcedStates = 0;
  let nonCaptureChoiceStates = 0;
  let mixedMoveTypeStates = 0;
  for (const row of stateRows) {
    if (row.minDepth > lastFullyExpandedDepth) continue;
    if (row.rawState.winner !== null) {
      fullyExpandedTerminalStates += 1;
      ensure((outgoing.get(row.stateKey) || []).length === 0, "terminal state has outgoing materialized edge");
      continue;
    }
    const edges = outgoing.get(row.stateKey) || [];
    ensure(edges.length > 0, `fully expanded nonterminal has no outgoing edges ${row.stateKey}`);
    fullyExpandedNonterminalStates += 1;
    branchingValues.push(edges.length);
    if (edges.length === 1) forcedSingleStates += 1;
    const captures = edges.filter((edge) => edge.move.type === "capture").length;
    if (captures === edges.length) captureForcedStates += 1;
    else if (captures === 0) nonCaptureChoiceStates += 1;
    else mixedMoveTypeStates += 1;
  }

  const indegreeValues = Array.from(indegree.values());
  let maxIndegree = 0;
  let multiParentStates = 0;
  for (const value of indegreeValues) {
    if (value > maxIndegree) maxIndegree = value;
    if (value >= 2) multiParentStates += 1;
  }
  const duplicates = transitionRows.length - (stateRows.length - 1);
  ensure(duplicates >= 0, "negative duplicate encounter reconstruction");
  const exactStateKeys = stateRows.filter((row) => row.minDepth <= lastFullyDiscoveredDepth).map((row) => row.stateKey);
  const exactTransitionFingerprints = transitionRows
    .filter((row) => row.parentDepth <= lastFullyExpandedDepth)
    .map((row) => transitionFingerprint(row.parentKey, row.moveKey, row.childKey));

  const recomputedGraph = {
    uniqueRawStatesObserved: stateRows.length,
    generatedEdgeOccurrencesObserved: transitionRows.length,
    duplicateEncountersObserved: duplicates,
    uniqueStateToGeneratedNodeRatio: transitionRows.length > 0 ? stateRows.length / (transitionRows.length + 1) : 1,
    depthCounts: objectFromMap(depthCounts),
    phaseCounts,
    terminalCounts,
    winnerCounts,
    reachedMtajiStateProportion: stateRows.length ? phaseCounts.mtaji / stateRows.length : null,
    multiParentStates,
    maxIndegree,
    nonIncreasingDepthEdges,
    fullyExpandedNonterminalStates,
    fullyExpandedTerminalStates,
    arithmeticMeanBranchingNonterminal: branchingValues.length
      ? branchingValues.reduce((a, b) => a + b, 0) / branchingValues.length : null,
    geometricMeanBranchingNonterminal: geometricMean(branchingValues.filter((value) => value > 0)),
    forcedSingleMoveProportion: fullyExpandedNonterminalStates ? forcedSingleStates / fullyExpandedNonterminalStates : null,
    captureForcedStateProportion: fullyExpandedNonterminalStates ? captureForcedStates / fullyExpandedNonterminalStates : null,
    nonCaptureChoiceStateProportion: fullyExpandedNonterminalStates ? nonCaptureChoiceStates / fullyExpandedNonterminalStates : null,
    mixedMoveTypeStateProportion: fullyExpandedNonterminalStates ? mixedMoveTypeStates / fullyExpandedNonterminalStates : null,
    graphStateSetSha256: setHash(Array.from(states.keys())),
    graphTransitionSetSha256: setHash(transitionFingerprints),
    completedDomainStateSetSha256: setHash(exactStateKeys),
    completedDomainTransitionSetSha256: setHash(exactTransitionFingerprints),
  };

  for (const name of [
    "uniqueRawStatesObserved", "generatedEdgeOccurrencesObserved", "duplicateEncountersObserved",
    "uniqueStateToGeneratedNodeRatio", "reachedMtajiStateProportion", "multiParentStates", "maxIndegree",
    "nonIncreasingDepthEdges", "fullyExpandedNonterminalStates", "fullyExpandedTerminalStates",
    "arithmeticMeanBranchingNonterminal", "geometricMeanBranchingNonterminal", "forcedSingleMoveProportion",
    "captureForcedStateProportion", "nonCaptureChoiceStateProportion", "mixedMoveTypeStateProportion",
    "graphStateSetSha256", "graphTransitionSetSha256", "completedDomainStateSetSha256",
    "completedDomainTransitionSetSha256",
  ]) compareScalar(recomputedGraph[name], summary.graph[name], `graph.${name}`);
  ensure(JSON.stringify(recomputedGraph.depthCounts) === JSON.stringify(summary.graph.depthCounts), "graph depth counts mismatch");
  ensure(JSON.stringify(recomputedGraph.phaseCounts) === JSON.stringify(summary.graph.phaseCounts), "graph phase counts mismatch");
  ensure(JSON.stringify(recomputedGraph.terminalCounts) === JSON.stringify(summary.graph.terminalCounts), "graph terminal counts mismatch");
  ensure(JSON.stringify(recomputedGraph.winnerCounts) === JSON.stringify(summary.graph.winnerCounts), "graph winner counts mismatch");

  const independentGraph = rerunCompletedGraph(lastFullyExpandedDepth);
  ensure(independentGraph.stateSetSha256 === summary.graph.completedDomainStateSetSha256,
    "independent completed-domain state set mismatch");
  ensure(independentGraph.transitionSetSha256 === summary.graph.completedDomainTransitionSetSha256,
    "independent completed-domain transition set mismatch");

  const independentTree = rerunCompletedTree(summary.tree.lastFullyExpandedDepth);
  const expectedTreeDepthCounts = summary.tree.depthCounts;
  for (const [depthText, count] of Object.entries(expectedTreeDepthCounts)) {
    const depth = Number(depthText);
    if (depth <= summary.tree.lastFullyGeneratedDepth) {
      ensure(independentTree.depthCounts.get(depth) === count,
        `independent tree depth count mismatch at ${depth}`);
    }
  }

  ensure(JSON.stringify(reporting.graph) === JSON.stringify(summary.graph), "reporting graph projection mismatch");
  ensure(JSON.stringify(reporting.tree) === JSON.stringify(summary.tree), "reporting tree projection mismatch");
  ensure(JSON.stringify(reporting.computation) === JSON.stringify(summary.computation), "reporting computation projection mismatch");

  const verifierSource = fs.readFileSync(__filename, "utf8");
  const independence = {
    importsProductionSerializer: /ssgtc-representation-production/.test(verifierSource),
    importsProductionRunner: /run-ssgtc-stage1-exploratory/.test(verifierSource),
    usesIndependentSerializer: /ssgtc-representation-independent/.test(verifierSource),
    independentlyRerunsCompletedGraph: true,
    independentlyRerunsCompletedTree: true,
  };
  ensure(!independence.importsProductionSerializer && !independence.importsProductionRunner
    && independence.usesIndependentSerializer, "independence boundary failed");

  const promotionFeasibility = lastFullyExpandedDepth >= 3
    && summary.tree.lastFullyExpandedDepth >= 3;
  const result = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: `${STAGE_ID}-independent-verification`,
    scientificInferenceAuthorized: false,
    passed: true,
    recomputedGraph,
    completedDomainIndependentRerun: independentGraph,
    completedTreeIndependentRerun: {
      depthCounts: objectFromMap(independentTree.depthCounts),
      nodes: independentTree.nodes,
      edges: independentTree.edges,
    },
    independence,
    promotionFeasibilityMinimumMet: promotionFeasibility,
    interpretationBoundary: {
      globalBaoStateSpaceClaimAuthorized: false,
      estimatorAuthorized: false,
      formalStage2Evidence: false,
    },
  };
  const resultPath = path.join(OUT_DIR, "independent-verification.json");
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
