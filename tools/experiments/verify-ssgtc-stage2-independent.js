#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const indep = require("./lib/ssgtc-representation-independent.js");

const STUDY_ID = "SSGTC-STUDY1";
const STAGE_ID = "SSGTC-S2-FORMAL-2026-08-25-v1";
const TARGET_GRAPH_PARENT_MAX_DEPTH = 7;
const TARGET_GRAPH_STATE_MAX_DEPTH = 8;
const TARGET_TREE_MAX_DEPTH = 8;
const OUT_DIR = process.env.SSGTC_STAGE2_OUT
  ? path.resolve(process.env.SSGTC_STAGE2_OUT)
  : path.resolve(__dirname, "../../artifacts/local/state-space-game-tree-complexity/stage2-formal-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function fileSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function setHash(values) {
  return indep.sha256(values.slice().sort().join("\n"));
}

function transitionFingerprint(row) {
  return indep.sha256(`${row.parentKey}|${row.moveKey}|${row.childKey}`);
}

function withoutRowHash(row) {
  const out = { ...row };
  delete out.rowSha256;
  return out;
}

function parseJsonl(filePath) {
  return fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line));
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

function assertEquivalent(actual, expected, label) {
  if (typeof actual === "number" && typeof expected === "number") {
    ensure(closeEnough(actual, expected), `${label} mismatch: ${actual} != ${expected}`);
  } else {
    ensure(actual === expected, `${label} mismatch`);
  }
}

function independentGraphRerun() {
  const root = indep.project(engine.initialState());
  indep.assertStudyState(root);
  const rootKey = indep.key(root);
  const states = new Map([[rootKey, { state: root, depth: 0 }]]);
  let frontier = [rootKey];
  const transitionFingerprints = [];
  const depthCounts = new Map([[0, 1]]);

  for (let depth = 0; depth <= TARGET_GRAPH_PARENT_MAX_DEPTH; depth += 1) {
    frontier.sort();
    const next = [];
    const nextSet = new Set();
    for (const parentKey of frontier) {
      const parent = states.get(parentKey);
      ensure(parent && parent.depth === depth, "independent formal graph depth mismatch");
      if (parent.state.winner !== null) continue;
      const moves = engine.moveVariants(parent.state).map(normalizeMove)
        .sort((a, b) => indep.moveIdentity(a).localeCompare(indep.moveIdentity(b)));
      for (const move of moves) {
        indep.assertStudyState(parent.state);
        const child = engine.applyMove(parent.state, move).state;
        indep.assertStudyState(child);
        const raw = indep.project(child);
        const childKey = indep.key(raw);
        const moveKey = indep.moveIdentity(move);
        transitionFingerprints.push(indep.sha256(`${parentKey}|${moveKey}|${childKey}`));
        if (!states.has(childKey)) {
          states.set(childKey, { state: raw, depth: depth + 1 });
          if (!nextSet.has(childKey)) {
            nextSet.add(childKey);
            next.push(childKey);
          }
          depthCounts.set(depth + 1, (depthCounts.get(depth + 1) || 0) + 1);
        }
      }
    }
    frontier = next;
  }

  return {
    stateCount: states.size,
    transitionCount: transitionFingerprints.length,
    depthCounts: objectFromMap(depthCounts),
    stateSetSha256: setHash(Array.from(states.keys())),
    transitionSetSha256: setHash(transitionFingerprints),
  };
}

function independentTreeRerun() {
  const rootState = indep.project(engine.initialState());
  let frontier = [{ state: rootState, occurrenceKey: "ROOT" }];
  const depthCounts = new Map([[0, 1]]);
  const fingerprints = [indep.sha256(`ROOT|${indep.key(rootState)}`)];
  let nodes = 1;
  let edges = 0;

  for (let depth = 0; depth < TARGET_TREE_MAX_DEPTH; depth += 1) {
    const next = [];
    for (const parent of frontier) {
      indep.assertStudyState(parent.state);
      if (parent.state.winner !== null) continue;
      const moves = engine.moveVariants(parent.state).map(normalizeMove)
        .sort((a, b) => indep.moveIdentity(a).localeCompare(indep.moveIdentity(b)));
      for (const move of moves) {
        const child = engine.applyMove(parent.state, move).state;
        indep.assertStudyState(child);
        const raw = indep.project(child);
        const moveKey = indep.moveIdentity(move);
        const occurrenceKey = `${parent.occurrenceKey}/${moveKey}`;
        next.push({ state: raw, occurrenceKey });
        nodes += 1;
        edges += 1;
        fingerprints.push(indep.sha256(`${occurrenceKey}|${indep.key(raw)}`));
      }
    }
    frontier = next;
    depthCounts.set(depth + 1, next.length);
  }

  return {
    nodeOccurrences: nodes,
    edgeOccurrences: edges,
    depthCounts: objectFromMap(depthCounts),
    occurrenceSetSha256: setHash(fingerprints),
  };
}

function main() {
  const statesPath = path.join(OUT_DIR, "formal-graph-states.jsonl");
  const transitionsPath = path.join(OUT_DIR, "formal-graph-transitions.jsonl");
  const summaryPath = path.join(OUT_DIR, "stage2-formal-summary.json");
  const reportingPath = path.join(OUT_DIR, "repository-facing-formal-summary.json");
  const productionVerificationPath = path.join(OUT_DIR, "production-verification.json");
  for (const required of [statesPath, transitionsPath, summaryPath, reportingPath, productionVerificationPath]) {
    ensure(fs.existsSync(required), `missing formal artifact ${required}`);
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const reporting = JSON.parse(fs.readFileSync(reportingPath, "utf8"));
  const productionVerification = JSON.parse(fs.readFileSync(productionVerificationPath, "utf8"));
  ensure(summary.studyId === STUDY_ID && summary.stageId === STAGE_ID, "formal summary identity mismatch");
  ensure(summary.estimationAuthorized === false, "formal estimator unexpectedly authorized");
  ensure(summary.symmetryReductionUsed === false && summary.canonicalizationUsed === false,
    "formal forbidden reduction used");
  ensure(summary.interpretationBoundary.stage1RowsUsedAsEvidence === false,
    "formal summary claims Stage 1 evidence reuse");

  ensure(fileSha256(statesPath) === productionVerification.hashes.graphStatesFileSha256,
    "formal graph-state file hash mismatch");
  ensure(fileSha256(transitionsPath) === productionVerification.hashes.graphTransitionsFileSha256,
    "formal graph-transition file hash mismatch");
  ensure(fileSha256(summaryPath) === productionVerification.hashes.summaryFileSha256,
    "formal summary file hash mismatch");
  ensure(fileSha256(reportingPath) === productionVerification.hashes.repositoryFacingFileSha256,
    "formal reporting file hash mismatch");

  const stateRows = parseJsonl(statesPath);
  const transitionRows = parseJsonl(transitionsPath);
  const states = new Map();
  const depthCounts = new Map();
  const phaseCounts = { namua: 0, mtaji: 0 };
  const terminalCounts = { terminal: 0, nonterminal: 0 };
  const winnerCounts = { player0: 0, player1: 0, none: 0 };

  for (const row of stateRows) {
    ensure(indep.sha256(indep.canonical(withoutRowHash(row))) === row.rowSha256,
      `formal state row hash mismatch ${row.stateKey}`);
    indep.assertStudyState(row.rawState);
    ensure(indep.key(row.rawState) === row.stateKey, `formal state key mismatch ${row.stateKey}`);
    ensure(!states.has(row.stateKey), `duplicate formal state row ${row.stateKey}`);
    ensure(row.minDepth >= 0 && row.minDepth <= TARGET_GRAPH_STATE_MAX_DEPTH, "formal state outside frozen depth");
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

  const outgoing = new Map();
  const indegree = new Map(Array.from(states.keys()).map((key) => [key, 0]));
  const transitionFingerprints = [];
  let nonIncreasingDepthEdges = 0;
  for (const row of transitionRows) {
    ensure(indep.sha256(indep.canonical(withoutRowHash(row))) === row.rowSha256,
      `formal transition row hash mismatch ${row.parentKey}`);
    ensure(states.has(row.parentKey) && states.has(row.childKey), "formal transition unknown state binding");
    ensure(row.parentDepth >= 0 && row.parentDepth <= TARGET_GRAPH_PARENT_MAX_DEPTH,
      "formal transition parent outside target depth");
    ensure(row.childOccurrenceDepth === row.parentDepth + 1, "formal transition occurrence depth mismatch");
    ensure(states.get(row.parentKey).minDepth === row.parentDepth, "formal transition parent min-depth mismatch");
    ensure(indep.moveIdentity(row.move) === row.moveKey, "formal transition move-key mismatch");
    if (!outgoing.has(row.parentKey)) outgoing.set(row.parentKey, []);
    outgoing.get(row.parentKey).push(row);
    indegree.set(row.childKey, indegree.get(row.childKey) + 1);
    if (states.get(row.childKey).minDepth <= row.parentDepth) nonIncreasingDepthEdges += 1;
    transitionFingerprints.push(transitionFingerprint(row));
  }

  const roots = stateRows.filter((row) => row.minDepth === 0);
  ensure(roots.length === 1, "formal graph must contain exactly one root");
  ensure(indep.key(engine.initialState()) === roots[0].stateKey, "formal root differs from fresh engine root");

  const bfs = new Map([[roots[0].stateKey, 0]]);
  let frontier = [roots[0].stateKey];
  while (frontier.length) {
    const next = [];
    for (const parentKey of frontier) {
      const parentDepth = bfs.get(parentKey);
      if (parentDepth > TARGET_GRAPH_PARENT_MAX_DEPTH) continue;
      for (const edge of outgoing.get(parentKey) || []) {
        if (!bfs.has(edge.childKey)) {
          bfs.set(edge.childKey, parentDepth + 1);
          next.push(edge.childKey);
        }
      }
    }
    frontier = next;
  }
  ensure(bfs.size === states.size, "formal materialized state is unreachable from root");
  for (const row of stateRows) ensure(bfs.get(row.stateKey) === row.minDepth,
    `formal BFS minimum depth mismatch ${row.stateKey}`);

  const branching = [];
  let expandedNonterminalStates = 0;
  let expandedTerminalStates = 0;
  let forcedSingleStates = 0;
  let captureForcedStates = 0;
  let nonCaptureChoiceStates = 0;
  let mixedMoveTypeStates = 0;
  for (const row of stateRows) {
    if (row.minDepth > TARGET_GRAPH_PARENT_MAX_DEPTH) continue;
    const edges = outgoing.get(row.stateKey) || [];
    if (row.rawState.winner !== null) {
      expandedTerminalStates += 1;
      ensure(edges.length === 0, "formal terminal state has outgoing edge");
      continue;
    }
    ensure(edges.length > 0, `formal nonterminal parent not fully expanded ${row.stateKey}`);
    expandedNonterminalStates += 1;
    branching.push(edges.length);
    if (edges.length === 1) forcedSingleStates += 1;
    const captures = edges.filter((edge) => edge.move.type === "capture").length;
    if (captures === edges.length) captureForcedStates += 1;
    else if (captures === 0) nonCaptureChoiceStates += 1;
    else mixedMoveTypeStates += 1;
  }

  const indegreeValues = Array.from(indegree.values());
  const multiParentStates = indegreeValues.filter((value) => value >= 2).length;
  const maxIndegree = indegreeValues.length ? Math.max(...indegreeValues) : 0;
  const duplicateEncounters = transitionRows.length - (stateRows.length - 1);
  ensure(duplicateEncounters >= 0, "formal independently reconstructed duplicates negative");

  const recomputedGraph = {
    targetParentMaxDepth: TARGET_GRAPH_PARENT_MAX_DEPTH,
    targetStateMaxDepth: TARGET_GRAPH_STATE_MAX_DEPTH,
    complete: true,
    stopReason: null,
    lastFullyExpandedDepth: TARGET_GRAPH_PARENT_MAX_DEPTH,
    uniqueRawStates: stateRows.length,
    transitionOccurrences: transitionRows.length,
    duplicateEncounters,
    uniqueStateToGeneratedNodeRatio: transitionRows.length ? stateRows.length / (transitionRows.length + 1) : 1,
    depthCounts: objectFromMap(depthCounts),
    phaseCounts,
    terminalCounts,
    winnerCounts,
    multiParentStates,
    maxIndegree,
    nonIncreasingDepthEdges,
    expandedNonterminalStates,
    expandedTerminalStates,
    arithmeticMeanBranchingNonterminal: branching.length
      ? branching.reduce((a, b) => a + b, 0) / branching.length : null,
    geometricMeanBranchingNonterminal: geometricMean(branching.filter((value) => value > 0)),
    forcedSingleMoveProportion: expandedNonterminalStates ? forcedSingleStates / expandedNonterminalStates : null,
    captureForcedStateProportion: expandedNonterminalStates ? captureForcedStates / expandedNonterminalStates : null,
    nonCaptureChoiceStateProportion: expandedNonterminalStates ? nonCaptureChoiceStates / expandedNonterminalStates : null,
    mixedMoveTypeStateProportion: expandedNonterminalStates ? mixedMoveTypeStates / expandedNonterminalStates : null,
    stateSetSha256: setHash(Array.from(states.keys())),
    transitionSetSha256: setHash(transitionFingerprints),
  };

  const independentGraph = independentGraphRerun();
  const independentTree = independentTreeRerun();

  if (summary.formalDecision === "SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN") {
    ensure(summary.exactTargetComplete === true && summary.graph.complete === true && summary.tree.complete === true,
      "exact formal decision without complete target");
    for (const [key, value] of Object.entries(recomputedGraph)) {
      if (["depthCounts", "phaseCounts", "terminalCounts", "winnerCounts"].includes(key)) {
        ensure(JSON.stringify(value) === JSON.stringify(summary.graph[key]), `formal graph ${key} mismatch`);
      } else {
        assertEquivalent(value, summary.graph[key], `formal graph ${key}`);
      }
    }
    ensure(independentGraph.stateCount === summary.graph.uniqueRawStates, "independent formal graph state count mismatch");
    ensure(independentGraph.transitionCount === summary.graph.transitionOccurrences, "independent formal graph edge count mismatch");
    ensure(JSON.stringify(independentGraph.depthCounts) === JSON.stringify(summary.graph.depthCounts),
      "independent formal graph depth counts mismatch");
    ensure(independentGraph.stateSetSha256 === summary.graph.stateSetSha256,
      "independent formal graph state-set hash mismatch");
    ensure(independentGraph.transitionSetSha256 === summary.graph.transitionSetSha256,
      "independent formal graph transition-set hash mismatch");
    ensure(independentTree.nodeOccurrences === summary.tree.nodeOccurrences, "independent formal tree nodes mismatch");
    ensure(independentTree.edgeOccurrences === summary.tree.edgeOccurrences, "independent formal tree edges mismatch");
    ensure(JSON.stringify(independentTree.depthCounts) === JSON.stringify(summary.tree.depthCounts),
      "independent formal tree depth counts mismatch");
    ensure(independentTree.occurrenceSetSha256 === summary.tree.occurrenceSetSha256,
      "independent formal tree occurrence hash mismatch");
  } else {
    ensure(summary.formalDecision === "SSGTC-RESOURCE-CENSORED",
      `unexpected formal decision ${summary.formalDecision}`);
    throw new Error("resource-censored formal run requires a separately scoped partial-domain verifier path; exact verifier refuses promotion");
  }

  ensure(JSON.stringify(reporting.graph) === JSON.stringify(summary.graph), "formal reporting graph projection mismatch");
  ensure(JSON.stringify(reporting.tree) === JSON.stringify(summary.tree), "formal reporting tree projection mismatch");
  ensure(JSON.stringify(reporting.primary) === JSON.stringify(summary.primary), "formal reporting primary projection mismatch");
  ensure(JSON.stringify(reporting.computation) === JSON.stringify(summary.computation), "formal reporting computation projection mismatch");

  const source = fs.readFileSync(__filename, "utf8");
  const requireLines = source.split("\n").filter((line) => /^\s*const\s+[^=]+?=\s*require\(/.test(line));
  const independence = {
    importsProductionSerializer: requireLines.some((line) => line.includes("ssgtc-representation-production")),
    importsProductionFormalRunner: requireLines.some((line) => line.includes("run-ssgtc-stage2-formal")),
    importsStage1ArtifactCode: requireLines.some((line) => /stage1/i.test(line)),
    usesIndependentSerializer: requireLines.some((line) => line.includes("ssgtc-representation-independent")),
    independentlyRerunsEntireFrozenGraphDomain: true,
    independentlyRerunsEntireFrozenTreeDomain: true,
  };
  ensure(!independence.importsProductionSerializer && !independence.importsProductionFormalRunner
    && !independence.importsStage1ArtifactCode && independence.usesIndependentSerializer,
  "formal independent verifier boundary failed");

  const result = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: `${STAGE_ID}-independent-verification`,
    passed: true,
    verifiedFormalDecision: summary.formalDecision,
    recomputedGraph,
    independentGraphRerun: independentGraph,
    independentTreeRerun: independentTree,
    independence,
    interpretationBoundary: {
      claimAppliesOnlyToFrozenDepth8Domain: true,
      globalBaoStateSpaceClaimAuthorized: false,
      estimatorAuthorized: false,
      symmetryReducedClaimAuthorized: false,
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
