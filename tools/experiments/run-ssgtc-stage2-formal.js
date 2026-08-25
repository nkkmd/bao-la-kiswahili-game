#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/ssgtc-representation-production.js");

const STUDY_ID = "SSGTC-STUDY1";
const STAGE_ID = "SSGTC-S2-FORMAL-2026-08-25-v1";
const BASELINE_MAIN = "9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901";
const TARGET_GRAPH_PARENT_MAX_DEPTH = 7;
const TARGET_GRAPH_STATE_MAX_DEPTH = 8;
const TARGET_TREE_MAX_DEPTH = 8;
const PROFILE = Object.freeze({
  maxUniqueRawStates: 100000,
  maxGraphTransitionOccurrences: 500000,
  maxGraphFrontierStates: 50000,
  maxTreeNodeOccurrences: 250000,
  maxTreeEdgeOccurrences: 250000,
  maxWallClockSeconds: 600,
  maxResidentSetBytes: 4294967296,
  maxUncompressedArtifactBytes: 134217728,
});
const ARTIFACT_RESERVE_BYTES = 1048576;
const OUT_DIR = process.env.SSGTC_STAGE2_OUT
  ? path.resolve(process.env.SSGTC_STAGE2_OUT)
  : path.resolve(__dirname, "../../artifacts/local/state-space-game-tree-complexity/stage2-formal-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeMove(move) {
  const out = {};
  for (const field of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[field] !== undefined) out[field] = move[field];
  }
  if (move.houseTwo === true) out.houseTwo = true;
  return out;
}

function rowWithHash(row) {
  return { ...row, rowSha256: prod.sha256Text(prod.stableStringify(row)) };
}

function fileSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function setHash(values) {
  return prod.sha256Text(values.slice().sort().join("\n"));
}

function transitionFingerprint(row) {
  return prod.sha256Text(`${row.parentKey}|${row.moveKey}|${row.childKey}`);
}

function objectFromMap(map) {
  return Object.fromEntries(Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0])));
}

function geometricMean(values) {
  if (!values.length) return null;
  return Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length);
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const statesPath = path.join(OUT_DIR, "formal-graph-states.jsonl");
  const transitionsPath = path.join(OUT_DIR, "formal-graph-transitions.jsonl");
  fs.writeFileSync(statesPath, "", "utf8");
  fs.writeFileSync(transitionsPath, "", "utf8");

  const startHr = process.hrtime.bigint();
  const startCpu = process.cpuUsage();
  let peakRss = process.memoryUsage().rss;
  let emittedBytes = 0;
  let engineEntryCalls = 0;
  let replayChecks = 0;

  function elapsedSeconds() {
    return Number(process.hrtime.bigint() - startHr) / 1e9;
  }

  function updatePeakRss() {
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
    return peakRss;
  }

  function globalCapReason() {
    updatePeakRss();
    if (elapsedSeconds() >= PROFILE.maxWallClockSeconds) return "WALL_CLOCK_CAP";
    if (peakRss >= PROFILE.maxResidentSetBytes) return "RSS_CAP";
    return null;
  }

  function guardedMoves(state) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    return engine.moveVariants(state).map(normalizeMove)
      .sort((a, b) => prod.moveKey(a).localeCompare(prod.moveKey(b)));
  }

  function guardedApply(state, move) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    const child = engine.applyMove(state, move).state;
    prod.assertStudyState(child);
    return child;
  }

  const missingPending = engine.initialState();
  delete missingPending.pending;
  const beforeNegative = engineEntryCalls;
  let missingPendingRejected = false;
  try {
    guardedMoves(missingPending);
  } catch (error) {
    missingPendingRejected = /pending/.test(error.message);
  }
  ensure(missingPendingRejected && engineEntryCalls === beforeNegative,
    "formal missing-pending negative control failed before engine entry");

  function asLine(row) {
    return `${JSON.stringify(rowWithHash(row))}\n`;
  }

  function canEmit(texts) {
    const bytes = texts.reduce((sum, text) => sum + Buffer.byteLength(text), 0);
    return emittedBytes + bytes <= PROFILE.maxUncompressedArtifactBytes - ARTIFACT_RESERVE_BYTES;
  }

  function emit(filePath, text) {
    fs.appendFileSync(filePath, text, "utf8");
    emittedBytes += Buffer.byteLength(text);
  }

  const stateByKey = new Map();
  const stateRows = [];
  const transitionRows = [];
  const depthCounts = new Map();

  function prepareState(state, minDepth) {
    prod.assertStudyState(state);
    const rawState = prod.rawRuleState(state);
    const stateKey = prod.stateKey(rawState);
    const row = { stateKey, minDepth, rawState };
    return { stateKey, rawState, minDepth, row, text: asLine(row) };
  }

  function commitState(prepared) {
    emit(statesPath, prepared.text);
    stateByKey.set(prepared.stateKey, { state: prepared.rawState, depth: prepared.minDepth });
    stateRows.push(prepared.row);
    depthCounts.set(prepared.minDepth, (depthCounts.get(prepared.minDepth) || 0) + 1);
  }

  const root = prepareState(engine.initialState(), 0);
  ensure(canEmit([root.text]), "artifact cap cannot hold formal root");
  commitState(root);
  let frontier = [root.stateKey];
  let graphStopReason = null;
  let lastFullyExpandedGraphDepth = -1;
  let maxGraphFrontierObserved = 1;

  graphLoop:
  for (let depth = 0; depth <= TARGET_GRAPH_PARENT_MAX_DEPTH; depth += 1) {
    frontier.sort();
    const nextFrontier = [];
    const nextFrontierSet = new Set();
    for (const parentKey of frontier) {
      const resourceReason = globalCapReason();
      if (resourceReason) {
        graphStopReason = resourceReason;
        break graphLoop;
      }
      const parent = stateByKey.get(parentKey);
      ensure(parent && parent.depth === depth, `formal graph frontier depth mismatch ${parentKey}`);
      if (parent.state.winner !== null) continue;
      const moves = guardedMoves(parent.state);
      const stagedTransitions = [];
      const stagedNew = new Map();
      const provisionalNew = new Set();
      for (const move of moves) {
        const child = guardedApply(parent.state, move);
        const replay = guardedApply(parent.state, move);
        replayChecks += 1;
        const prepared = prepareState(child, depth + 1);
        ensure(prod.stateKey(replay) === prepared.stateKey, "formal deterministic replay mismatch");
        const moveKey = prod.moveKey(move);
        const row = {
          parentKey,
          moveKey,
          move,
          childKey: prepared.stateKey,
          parentDepth: depth,
          childOccurrenceDepth: depth + 1,
        };
        stagedTransitions.push({ row, text: asLine(row), prepared });
        if (!stateByKey.has(prepared.stateKey) && !provisionalNew.has(prepared.stateKey)) {
          stagedNew.set(prepared.stateKey, prepared);
          provisionalNew.add(prepared.stateKey);
        }
      }

      let stop = globalCapReason();
      const prospectiveUnique = stateByKey.size + stagedNew.size;
      const prospectiveEdges = transitionRows.length + stagedTransitions.length;
      const prospectiveFrontier = nextFrontierSet.size
        + Array.from(stagedNew.keys()).filter((key) => !nextFrontierSet.has(key)).length;
      const prospectiveTexts = [
        ...Array.from(stagedNew.values()).map((item) => item.text),
        ...stagedTransitions.map((item) => item.text),
      ];
      if (!stop && prospectiveUnique > PROFILE.maxUniqueRawStates) stop = "UNIQUE_STATE_CAP";
      if (!stop && prospectiveEdges > PROFILE.maxGraphTransitionOccurrences) stop = "GRAPH_EDGE_CAP";
      if (!stop && prospectiveFrontier > PROFILE.maxGraphFrontierStates) stop = "GRAPH_FRONTIER_CAP";
      if (!stop && !canEmit(prospectiveTexts)) stop = "ARTIFACT_BYTE_CAP";
      if (stop) {
        graphStopReason = stop;
        break graphLoop;
      }

      for (const prepared of stagedNew.values()) {
        commitState(prepared);
        if (!nextFrontierSet.has(prepared.stateKey)) {
          nextFrontierSet.add(prepared.stateKey);
          nextFrontier.push(prepared.stateKey);
        }
      }
      for (const item of stagedTransitions) {
        emit(transitionsPath, item.text);
        transitionRows.push(item.row);
      }
    }
    lastFullyExpandedGraphDepth = depth;
    frontier = nextFrontier;
    maxGraphFrontierObserved = Math.max(maxGraphFrontierObserved, frontier.length);
    if (depth < TARGET_GRAPH_PARENT_MAX_DEPTH && frontier.length === 0) {
      graphStopReason = "FRONTIER_EXHAUSTED-BEFORE-TARGET";
      break;
    }
  }

  const graphComplete = lastFullyExpandedGraphDepth === TARGET_GRAPH_PARENT_MAX_DEPTH
    && graphStopReason === null;

  const phaseCounts = { namua: 0, mtaji: 0 };
  const terminalCounts = { terminal: 0, nonterminal: 0 };
  const winnerCounts = { player0: 0, player1: 0, none: 0 };
  for (const row of stateRows) {
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
  const indegree = new Map(stateRows.map((row) => [row.stateKey, 0]));
  let nonIncreasingDepthEdges = 0;
  for (const row of transitionRows) {
    if (!outgoing.has(row.parentKey)) outgoing.set(row.parentKey, []);
    outgoing.get(row.parentKey).push(row);
    indegree.set(row.childKey, (indegree.get(row.childKey) || 0) + 1);
    const childDepth = stateByKey.get(row.childKey).depth;
    if (childDepth <= row.parentDepth) nonIncreasingDepthEdges += 1;
  }

  const branching = [];
  let expandedNonterminalStates = 0;
  let expandedTerminalStates = 0;
  let forcedSingleStates = 0;
  let captureForcedStates = 0;
  let nonCaptureChoiceStates = 0;
  let mixedMoveTypeStates = 0;
  for (const row of stateRows) {
    if (row.minDepth > lastFullyExpandedGraphDepth) continue;
    if (row.rawState.winner !== null) {
      expandedTerminalStates += 1;
      continue;
    }
    const edges = outgoing.get(row.stateKey) || [];
    if (graphComplete) ensure(edges.length > 0, `formal complete nonterminal without outgoing edge ${row.stateKey}`);
    if (!edges.length) continue;
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
  const duplicateEncounters = transitionRows.length - Math.max(0, stateRows.length - 1);
  ensure(duplicateEncounters >= 0, "formal duplicate count became negative");
  const graphStateSetSha256 = setHash(stateRows.map((row) => row.stateKey));
  const graphTransitionSetSha256 = setHash(transitionRows.map(transitionFingerprint));

  let treeFrontier = [{ state: prod.rawRuleState(engine.initialState()), occurrenceKey: "ROOT" }];
  const treeDepthCounts = new Map([[0, 1]]);
  const treeOccurrenceFingerprints = [prod.sha256Text(`ROOT|${prod.stateKey(treeFrontier[0].state)}`)];
  let treeNodeOccurrences = 1;
  let treeEdgeOccurrences = 0;
  let treeStopReason = null;
  let lastFullyGeneratedTreeDepth = 0;
  let maxTreeFrontierObserved = 1;

  treeLoop:
  for (let depth = 0; depth < TARGET_TREE_MAX_DEPTH; depth += 1) {
    const next = [];
    for (const parent of treeFrontier) {
      const resourceReason = globalCapReason();
      if (resourceReason) {
        treeStopReason = resourceReason;
        break treeLoop;
      }
      if (parent.state.winner !== null) continue;
      const moves = guardedMoves(parent.state);
      const children = [];
      for (const move of moves) {
        const child = guardedApply(parent.state, move);
        const moveKey = prod.moveKey(move);
        const occurrenceKey = `${parent.occurrenceKey}/${moveKey}`;
        children.push({ state: prod.rawRuleState(child), occurrenceKey });
      }
      let stop = globalCapReason();
      if (!stop && treeNodeOccurrences + children.length > PROFILE.maxTreeNodeOccurrences) stop = "TREE_NODE_CAP";
      if (!stop && treeEdgeOccurrences + children.length > PROFILE.maxTreeEdgeOccurrences) stop = "TREE_EDGE_CAP";
      if (stop) {
        treeStopReason = stop;
        break treeLoop;
      }
      for (const child of children) {
        next.push(child);
        treeNodeOccurrences += 1;
        treeEdgeOccurrences += 1;
        treeOccurrenceFingerprints.push(prod.sha256Text(`${child.occurrenceKey}|${prod.stateKey(child.state)}`));
      }
    }
    treeFrontier = next;
    lastFullyGeneratedTreeDepth = depth + 1;
    treeDepthCounts.set(depth + 1, next.length);
    maxTreeFrontierObserved = Math.max(maxTreeFrontierObserved, next.length);
  }
  const treeComplete = lastFullyGeneratedTreeDepth === TARGET_TREE_MAX_DEPTH && treeStopReason === null;
  const treeOccurrenceSetSha256 = setHash(treeOccurrenceFingerprints);

  const exactTargetComplete = graphComplete && treeComplete;
  const formalDecision = exactTargetComplete
    ? "SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN"
    : "SSGTC-RESOURCE-CENSORED";

  const cpu = process.cpuUsage(startCpu);
  updatePeakRss();
  const graphSummary = {
    targetParentMaxDepth: TARGET_GRAPH_PARENT_MAX_DEPTH,
    targetStateMaxDepth: TARGET_GRAPH_STATE_MAX_DEPTH,
    complete: graphComplete,
    stopReason: graphStopReason,
    lastFullyExpandedDepth: lastFullyExpandedGraphDepth,
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
    maxFrontierObserved: maxGraphFrontierObserved,
    stateSetSha256: graphStateSetSha256,
    transitionSetSha256: graphTransitionSetSha256,
  };
  const treeSummary = {
    targetMaxDepth: TARGET_TREE_MAX_DEPTH,
    complete: treeComplete,
    stopReason: treeStopReason,
    lastFullyGeneratedDepth: lastFullyGeneratedTreeDepth,
    nodeOccurrences: treeNodeOccurrences,
    edgeOccurrences: treeEdgeOccurrences,
    depthCounts: objectFromMap(treeDepthCounts),
    maxFrontierObserved: maxTreeFrontierObserved,
    occurrenceSetSha256: treeOccurrenceSetSha256,
  };

  const summary = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    evidenceClass: "FORMAL-FRESH-BOUNDED-ENUMERATION",
    formalDecision,
    exactTargetComplete,
    scientificInferenceAuthorized: true,
    estimationAuthorized: false,
    symmetryReductionUsed: false,
    canonicalizationUsed: false,
    baselineMain: BASELINE_MAIN,
    graph: graphSummary,
    tree: treeSummary,
    primary: {
      reachableRawStatesThroughDepth8: graphSummary.uniqueRawStates,
      graphTransitionOccurrencesParentDepth0Through7: graphSummary.transitionOccurrences,
      gameTreeNodeOccurrencesThroughDepth8: treeSummary.nodeOccurrences,
      gameTreeEdgeOccurrencesThroughDepth8: treeSummary.edgeOccurrences,
      rawStateToTreeNodeRatioThroughDepth8: treeSummary.nodeOccurrences
        ? graphSummary.uniqueRawStates / treeSummary.nodeOccurrences : null,
    },
    computation: {
      wallClockSeconds: elapsedSeconds(),
      cpuUserMicroseconds: cpu.user,
      cpuSystemMicroseconds: cpu.system,
      peakObservedRssBytes: peakRss,
      engineEntryCalls,
      replayChecks,
      rawRowBytesBeforeSummary: emittedBytes,
    },
    interpretationBoundary: {
      claimAppliesOnlyToFrozenDepth8Domain: true,
      globalBaoStateSpaceClaimAuthorized: false,
      fullGameTreeComplexityClaimAuthorized: false,
      estimatorAuthorized: false,
      stage1RowsUsedAsEvidence: false,
    },
  };

  const summaryPath = path.join(OUT_DIR, "stage2-formal-summary.json");
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  const reporting = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    formalDecision,
    exactTargetComplete,
    representation: "RAW-ONLY",
    graph: graphSummary,
    tree: treeSummary,
    primary: summary.primary,
    computation: summary.computation,
    interpretationBoundary: summary.interpretationBoundary,
  };
  const reportingPath = path.join(OUT_DIR, "repository-facing-formal-summary.json");
  fs.writeFileSync(reportingPath, `${JSON.stringify(reporting, null, 2)}\n`, "utf8");

  const source = fs.readFileSync(__filename, "utf8");
  const requireLines = source.split("\n").filter((line) => /^\s*const\s+[^=]+?=\s*require\(/.test(line));
  const gates = {
    "S2-G1-RAW-SHAPE": true,
    "S2-G2-MISSING-PENDING-REJECTED": missingPendingRejected,
    "S2-G3-SEED-CONSERVATION": stateRows.every((row) => prod.representedSeeds(row.rawState) === 64),
    "S2-G4-UNIQUE-RAW-KEYS": stateRows.length === new Set(stateRows.map((row) => row.stateKey)).size,
    "S2-G5-REPLAY-BINDING": replayChecks === transitionRows.length,
    "S2-G6-DEPTH-BOUNDARY": stateRows.every((row) => row.minDepth <= TARGET_GRAPH_STATE_MAX_DEPTH)
      && transitionRows.every((row) => row.parentDepth <= TARGET_GRAPH_PARENT_MAX_DEPTH),
    "S2-G7-RAW-REPORT-SEPARATION": !Object.prototype.hasOwnProperty.call(reporting, "states"),
    "S2-G8-POST-WRITE-REOPEN": JSON.parse(fs.readFileSync(summaryPath, "utf8")).stageId === STAGE_ID
      && JSON.parse(fs.readFileSync(reportingPath, "utf8")).stageId === STAGE_ID,
    "S2-G9-NO-FORBIDDEN-IMPORT": !requireLines.some((line) => /stage1|symmetry|orisc|sip/i.test(line)),
    "S2-G10-NO-ESTIMATOR": summary.estimationAuthorized === false,
  };
  ensure(Object.values(gates).every(Boolean), `Stage 2 production integrity gate failed: ${JSON.stringify(gates)}`);

  const currentBytes = fs.readdirSync(OUT_DIR)
    .map((name) => fs.statSync(path.join(OUT_DIR, name)).size)
    .reduce((a, b) => a + b, 0);
  ensure(currentBytes <= PROFILE.maxUncompressedArtifactBytes, "formal artifact cap exceeded before verification file");

  const productionVerification = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    productionIntegrityPassed: true,
    formalDecision,
    gates,
    hashes: {
      graphStatesFileSha256: fileSha256(statesPath),
      graphTransitionsFileSha256: fileSha256(transitionsPath),
      summaryFileSha256: fileSha256(summaryPath),
      repositoryFacingFileSha256: fileSha256(reportingPath),
      stateSetSha256: graphStateSetSha256,
      transitionSetSha256: graphTransitionSetSha256,
      treeOccurrenceSetSha256,
    },
  };
  const productionVerificationPath = path.join(OUT_DIR, "production-verification.json");
  fs.writeFileSync(productionVerificationPath, `${JSON.stringify(productionVerification, null, 2)}\n`, "utf8");
  const finalBytes = fs.readdirSync(OUT_DIR)
    .map((name) => fs.statSync(path.join(OUT_DIR, name)).size)
    .reduce((a, b) => a + b, 0);
  ensure(finalBytes <= PROFILE.maxUncompressedArtifactBytes, "formal artifact cap exceeded");

  process.stdout.write(`${JSON.stringify({ summary, productionVerification, finalBytes }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
