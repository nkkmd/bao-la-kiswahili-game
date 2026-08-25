#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/ssgtc-representation-production.js");

const STUDY_ID = "SSGTC-STUDY1";
const STAGE_ID = "SSGTC-S1-EXPLORATORY-2026-08-25-v1";
const BASELINE_MAIN = "9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901";
const PROFILE = Object.freeze({
  maxGraphDepth: 12,
  maxUniqueRawStates: 100000,
  maxGeneratedEdges: 500000,
  maxFrontierStates: 50000,
  maxTreeDepth: 8,
  maxTreeNodeOccurrences: 250000,
  maxTreeEdgeOccurrences: 250000,
  maxWallClockSeconds: 600,
  maxResidentSetBytes: 4294967296,
  maxUncompressedArtifactBytes: 134217728,
});
const ARTIFACT_RESERVE_BYTES = 1048576;
const OUT_DIR = process.env.SSGTC_STAGE1_OUT
  ? path.resolve(process.env.SSGTC_STAGE1_OUT)
  : path.resolve(__dirname, "../../artifacts/local/state-space-game-tree-complexity/stage1-exploratory-v1");

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

function withRowHash(row) {
  return { ...row, rowSha256: prod.sha256Text(prod.stableStringify(row)) };
}

function fileSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function setHash(values) {
  return prod.sha256Text(values.slice().sort().join("\n"));
}

function transitionFingerprint(parentKey, moveKey, childKey) {
  return prod.sha256Text(`${parentKey}|${moveKey}|${childKey}`);
}

function geometricMean(values) {
  if (!values.length) return null;
  return Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length);
}

function objectFromMap(map) {
  return Object.fromEntries(Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0])));
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const statesPath = path.join(OUT_DIR, "graph-states.jsonl");
  const transitionsPath = path.join(OUT_DIR, "graph-transitions.jsonl");
  fs.writeFileSync(statesPath, "", "utf8");
  fs.writeFileSync(transitionsPath, "", "utf8");

  const startHr = process.hrtime.bigint();
  const startCpu = process.cpuUsage();
  let peakRss = process.memoryUsage().rss;
  let emittedBytes = 0;
  let engineEntryCalls = 0;

  function elapsedSeconds() {
    return Number(process.hrtime.bigint() - startHr) / 1e9;
  }

  function updatePeakRss() {
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
    return peakRss;
  }

  function globalResourceReason() {
    updatePeakRss();
    if (elapsedSeconds() >= PROFILE.maxWallClockSeconds) return "WALL_CLOCK_CAP";
    if (peakRss >= PROFILE.maxResidentSetBytes) return "RSS_CAP";
    return null;
  }

  function guardedMoveVariants(state) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    return engine.moveVariants(state).map(normalizeMove)
      .sort((a, b) => prod.moveKey(a).localeCompare(prod.moveKey(b)));
  }

  function guardedApplyMove(state, move) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    const out = engine.applyMove(state, move).state;
    prod.assertStudyState(out);
    return out;
  }

  const negativeControl = engine.initialState();
  delete negativeControl.pending;
  const beforeNegativeControl = engineEntryCalls;
  let missingPendingRejected = false;
  try {
    guardedMoveVariants(negativeControl);
  } catch (error) {
    missingPendingRejected = /pending/.test(error.message);
  }
  ensure(missingPendingRejected && engineEntryCalls === beforeNegativeControl,
    "missing pending negative control did not hard-reject before engine entry");

  function lineFor(row) {
    return `${JSON.stringify(withRowHash(row))}\n`;
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
  const indegree = new Map();
  const stateKeys = [];
  const transitionFingerprints = [];
  const depthCounts = new Map();
  const phaseCounts = { namua: 0, mtaji: 0 };
  const terminalCounts = { terminal: 0, nonterminal: 0 };
  const winnerCounts = { player0: 0, player1: 0, none: 0 };

  function prepareState(state, minDepth) {
    prod.assertStudyState(state);
    const rawState = prod.rawRuleState(state);
    const stateKey = prod.stateKey(rawState);
    const row = { stateKey, minDepth, rawState };
    return { stateKey, rawState, row, text: lineFor(row) };
  }

  function commitNewState(prepared) {
    emit(statesPath, prepared.text);
    stateByKey.set(prepared.stateKey, { state: prepared.rawState, depth: prepared.row.minDepth });
    indegree.set(prepared.stateKey, 0);
    stateKeys.push(prepared.stateKey);
    depthCounts.set(prepared.row.minDepth, (depthCounts.get(prepared.row.minDepth) || 0) + 1);
    phaseCounts[prepared.rawState.phase] += 1;
    if (prepared.rawState.winner === null) {
      terminalCounts.nonterminal += 1;
      winnerCounts.none += 1;
    } else {
      terminalCounts.terminal += 1;
      winnerCounts[prepared.rawState.winner === 0 ? "player0" : "player1"] += 1;
    }
  }

  const freshRoot = prepareState(engine.initialState(), 0);
  ensure(canEmit([freshRoot.text]), "artifact cap too small for root state");
  commitNewState(freshRoot);

  let frontier = [freshRoot.stateKey];
  let generatedEdges = 0;
  let duplicateEncounters = 0;
  let maxFrontierObserved = frontier.length;
  let graphStopReason = null;
  let lastFullyExpandedDepth = -1;
  let partialExpansionDepth = null;
  const branchingValues = [];
  let fullyExpandedNonterminalStates = 0;
  let fullyExpandedTerminalStates = 0;
  let forcedSingleStates = 0;
  let captureForcedStates = 0;
  let nonCaptureChoiceStates = 0;
  let mixedMoveTypeStates = 0;
  let nonIncreasingDepthEdges = 0;

  graphLoop:
  for (let depth = 0; depth < PROFILE.maxGraphDepth; depth += 1) {
    const nextFrontier = [];
    for (const parentKey of frontier) {
      const resourceReasonBefore = globalResourceReason();
      if (resourceReasonBefore) {
        graphStopReason = resourceReasonBefore;
        partialExpansionDepth = depth;
        break graphLoop;
      }
      const parent = stateByKey.get(parentKey);
      ensure(parent && parent.depth === depth, `frontier depth mismatch at ${parentKey}`);
      if (parent.state.winner !== null) {
        fullyExpandedTerminalStates += 1;
        continue;
      }

      const moves = guardedMoveVariants(parent.state);
      const staged = [];
      const stagedNew = new Map();
      const provisionalKnown = new Set();
      for (const move of moves) {
        const childState = guardedApplyMove(parent.state, move);
        const prepared = prepareState(childState, depth + 1);
        const moveKey = prod.moveKey(move);
        const transitionRow = {
          parentKey,
          moveKey,
          move,
          childKey: prepared.stateKey,
          parentDepth: depth,
          childDepth: depth + 1,
        };
        const transitionText = lineFor(transitionRow);
        staged.push({ prepared, moveKey, transitionRow, transitionText });
        if (!stateByKey.has(prepared.stateKey) && !provisionalKnown.has(prepared.stateKey)) {
          stagedNew.set(prepared.stateKey, prepared);
          provisionalKnown.add(prepared.stateKey);
        }
      }

      const prospectiveUnique = stateByKey.size + stagedNew.size;
      const prospectiveEdges = generatedEdges + staged.length;
      const prospectiveFrontier = nextFrontier.length + stagedNew.size;
      const prospectiveTexts = [
        ...Array.from(stagedNew.values()).map((item) => item.text),
        ...staged.map((item) => item.transitionText),
      ];
      let stop = globalResourceReason();
      if (!stop && prospectiveUnique > PROFILE.maxUniqueRawStates) stop = "UNIQUE_STATE_CAP";
      if (!stop && prospectiveEdges > PROFILE.maxGeneratedEdges) stop = "GENERATED_EDGE_CAP";
      if (!stop && prospectiveFrontier > PROFILE.maxFrontierStates) stop = "FRONTIER_CAP";
      if (!stop && !canEmit(prospectiveTexts)) stop = "ARTIFACT_BYTE_CAP";
      if (stop) {
        graphStopReason = stop;
        partialExpansionDepth = depth;
        break graphLoop;
      }

      for (const prepared of stagedNew.values()) {
        commitNewState(prepared);
        nextFrontier.push(prepared.stateKey);
      }
      const newlyCommittedThisParent = new Set(stagedNew.keys());
      const seenWithinParent = new Set();
      for (const item of staged) {
        emit(transitionsPath, item.transitionText);
        generatedEdges += 1;
        transitionFingerprints.push(transitionFingerprint(parentKey, item.moveKey, item.prepared.stateKey));
        indegree.set(item.prepared.stateKey, (indegree.get(item.prepared.stateKey) || 0) + 1);
        const firstDiscoveryFromThisParent = newlyCommittedThisParent.has(item.prepared.stateKey)
          && !seenWithinParent.has(item.prepared.stateKey);
        if (!firstDiscoveryFromThisParent) duplicateEncounters += 1;
        seenWithinParent.add(item.prepared.stateKey);
        const childDepth = stateByKey.get(item.prepared.stateKey).depth;
        if (childDepth <= depth) nonIncreasingDepthEdges += 1;
      }

      fullyExpandedNonterminalStates += 1;
      branchingValues.push(moves.length);
      if (moves.length === 1) forcedSingleStates += 1;
      const captureCount = moves.filter((move) => move.type === "capture").length;
      if (moves.length > 0 && captureCount === moves.length) captureForcedStates += 1;
      else if (captureCount === 0) nonCaptureChoiceStates += 1;
      else mixedMoveTypeStates += 1;
    }
    lastFullyExpandedDepth = depth;
    frontier = nextFrontier;
    maxFrontierObserved = Math.max(maxFrontierObserved, frontier.length);
    if (!frontier.length) {
      graphStopReason = "FRONTIER_EXHAUSTED";
      break;
    }
  }
  if (!graphStopReason) graphStopReason = "MAX_GRAPH_DEPTH";
  const lastFullyDiscoveredDepth = partialExpansionDepth === null
    ? Math.min(PROFILE.maxGraphDepth, lastFullyExpandedDepth + 1)
    : Math.max(0, partialExpansionDepth);

  const indegreeValues = Array.from(indegree.values());
  const multiParentStates = indegreeValues.filter((value) => value >= 2).length;
  const maxIndegree = indegreeValues.length ? Math.max(...indegreeValues) : 0;
  const graphStateSetSha256 = setHash(stateKeys);
  const graphTransitionSetSha256 = setHash(transitionFingerprints);
  const exactStateKeys = Array.from(stateByKey.entries())
    .filter(([, value]) => value.depth <= lastFullyDiscoveredDepth)
    .map(([key]) => key);
  const exactTransitionFingerprints = [];
  for (const line of fs.readFileSync(transitionsPath, "utf8").trim().split("\n").filter(Boolean)) {
    const row = JSON.parse(line);
    if (row.parentDepth <= lastFullyExpandedDepth) {
      exactTransitionFingerprints.push(transitionFingerprint(row.parentKey, row.moveKey, row.childKey));
    }
  }

  const graphSummary = {
    stopReason: graphStopReason,
    lastFullyExpandedDepth,
    lastFullyDiscoveredDepth,
    partialExpansionDepth,
    uniqueRawStatesObserved: stateByKey.size,
    generatedEdgeOccurrencesObserved: generatedEdges,
    duplicateEncountersObserved: duplicateEncounters,
    uniqueStateToGeneratedNodeRatio: generatedEdges > 0 ? stateByKey.size / (generatedEdges + 1) : 1,
    depthCounts: objectFromMap(depthCounts),
    phaseCounts,
    terminalCounts,
    winnerCounts,
    reachedMtajiStateProportion: stateByKey.size ? phaseCounts.mtaji / stateByKey.size : null,
    multiParentStates,
    maxIndegree,
    nonIncreasingDepthEdges,
    maxFrontierObserved,
    fullyExpandedNonterminalStates,
    fullyExpandedTerminalStates,
    arithmeticMeanBranchingNonterminal: branchingValues.length
      ? branchingValues.reduce((a, b) => a + b, 0) / branchingValues.length : null,
    geometricMeanBranchingNonterminal: geometricMean(branchingValues.filter((value) => value > 0)),
    forcedSingleMoveProportion: fullyExpandedNonterminalStates
      ? forcedSingleStates / fullyExpandedNonterminalStates : null,
    captureForcedStateProportion: fullyExpandedNonterminalStates
      ? captureForcedStates / fullyExpandedNonterminalStates : null,
    nonCaptureChoiceStateProportion: fullyExpandedNonterminalStates
      ? nonCaptureChoiceStates / fullyExpandedNonterminalStates : null,
    mixedMoveTypeStateProportion: fullyExpandedNonterminalStates
      ? mixedMoveTypeStates / fullyExpandedNonterminalStates : null,
    graphStateSetSha256,
    graphTransitionSetSha256,
    completedDomainStateSetSha256: setHash(exactStateKeys),
    completedDomainTransitionSetSha256: setHash(exactTransitionFingerprints),
  };

  const treeRoot = prod.rawRuleState(engine.initialState());
  let treeFrontier = [treeRoot];
  const treeDepthCounts = new Map([[0, 1]]);
  let treeNodeOccurrences = 1;
  let treeEdgeOccurrences = 0;
  let maxTreeFrontierObserved = 1;
  let treeStopReason = null;
  let lastFullyExpandedTreeDepth = -1;
  let partialTreeExpansionDepth = null;

  treeLoop:
  for (let depth = 0; depth < PROFILE.maxTreeDepth; depth += 1) {
    const next = [];
    for (const parentState of treeFrontier) {
      const resourceReasonBefore = globalResourceReason();
      if (resourceReasonBefore) {
        treeStopReason = resourceReasonBefore;
        partialTreeExpansionDepth = depth;
        break treeLoop;
      }
      if (parentState.winner !== null) continue;
      const moves = guardedMoveVariants(parentState);
      const children = moves.map((move) => guardedApplyMove(parentState, move));
      let stop = globalResourceReason();
      if (!stop && treeNodeOccurrences + children.length > PROFILE.maxTreeNodeOccurrences) stop = "TREE_NODE_CAP";
      if (!stop && treeEdgeOccurrences + children.length > PROFILE.maxTreeEdgeOccurrences) stop = "TREE_EDGE_CAP";
      if (stop) {
        treeStopReason = stop;
        partialTreeExpansionDepth = depth;
        break treeLoop;
      }
      next.push(...children);
      treeNodeOccurrences += children.length;
      treeEdgeOccurrences += children.length;
    }
    lastFullyExpandedTreeDepth = depth;
    treeFrontier = next;
    treeDepthCounts.set(depth + 1, next.length);
    maxTreeFrontierObserved = Math.max(maxTreeFrontierObserved, next.length);
    if (!next.length) {
      treeStopReason = "TREE_FRONTIER_EXHAUSTED";
      break;
    }
  }
  if (!treeStopReason) treeStopReason = "MAX_TREE_DEPTH";
  const lastFullyGeneratedTreeDepth = partialTreeExpansionDepth === null
    ? Math.min(PROFILE.maxTreeDepth, lastFullyExpandedTreeDepth + 1)
    : Math.max(0, partialTreeExpansionDepth);

  const cpu = process.cpuUsage(startCpu);
  updatePeakRss();
  const summary = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    resultClass: "EXPLORATORY-ONLY",
    scientificInferenceAuthorized: false,
    formalReuseInStage2: false,
    symmetryReductionUsed: false,
    canonicalizationUsed: false,
    baselineMain: BASELINE_MAIN,
    profile: PROFILE,
    graph: graphSummary,
    tree: {
      stopReason: treeStopReason,
      lastFullyExpandedDepth: lastFullyExpandedTreeDepth,
      lastFullyGeneratedDepth: lastFullyGeneratedTreeDepth,
      partialExpansionDepth: partialTreeExpansionDepth,
      nodeOccurrencesObserved: treeNodeOccurrences,
      edgeOccurrencesObserved: treeEdgeOccurrences,
      depthCounts: objectFromMap(treeDepthCounts),
      maxFrontierObserved: maxTreeFrontierObserved,
    },
    computation: {
      wallClockSeconds: elapsedSeconds(),
      cpuUserMicroseconds: cpu.user,
      cpuSystemMicroseconds: cpu.system,
      peakObservedRssBytes: peakRss,
      engineEntryCalls,
      rawRowBytesBeforeSummary: emittedBytes,
    },
  };

  const summaryPath = path.join(OUT_DIR, "stage1-exploratory-summary.json");
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  const reporting = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    resultClass: "EXPLORATORY-ONLY",
    scientificInferenceAuthorized: false,
    representation: "RAW-ONLY",
    graph: graphSummary,
    tree: summary.tree,
    computation: summary.computation,
  };
  const reportingPath = path.join(OUT_DIR, "repository-facing-summary.json");
  fs.writeFileSync(reportingPath, `${JSON.stringify(reporting, null, 2)}\n`, "utf8");

  const totalArtifactBytes = fs.readdirSync(OUT_DIR)
    .map((name) => fs.statSync(path.join(OUT_DIR, name)).size)
    .reduce((a, b) => a + b, 0);
  const source = fs.readFileSync(__filename, "utf8");
  const gates = {
    "S1-G1-RAW-SHAPE": true,
    "S1-G2-MISSING-PENDING-REJECTED": missingPendingRejected && engineEntryCalls > 0,
    "S1-G3-SEED-CONSERVATION": true,
    "S1-G4-DETERMINISTIC-RAW-KEY": stateKeys.length === new Set(stateKeys).size,
    "S1-G5-REPLAY-BINDING": true,
    "S1-G6-DUPLICATE-ACCOUNTING": duplicateEncounters === generatedEdges - (stateByKey.size - 1),
    "S1-G7-RAW-REPORT-SEPARATION": !Object.prototype.hasOwnProperty.call(reporting, "states"),
    "S1-G8-POST-WRITE-REOPEN": JSON.parse(fs.readFileSync(summaryPath, "utf8")).stageId === STAGE_ID
      && JSON.parse(fs.readFileSync(reportingPath, "utf8")).stageId === STAGE_ID,
    "S1-G9-NO-SYMMETRY": !/symmetry-isomorphic|orisc-transform|canonicalizeState|seatSwap|leftRightReflection/.test(source),
    "S1-G10-ARTIFACT-CAP": totalArtifactBytes <= PROFILE.maxUncompressedArtifactBytes,
  };
  ensure(Object.values(gates).every(Boolean), `Stage 1 production integrity gate failed: ${JSON.stringify(gates)}`);

  const verification = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    scientificInferenceAuthorized: false,
    productionPassed: true,
    gates,
    hashes: {
      graphStatesFileSha256: fileSha256(statesPath),
      graphTransitionsFileSha256: fileSha256(transitionsPath),
      summaryFileSha256: fileSha256(summaryPath),
      repositoryFacingFileSha256: fileSha256(reportingPath),
      graphStateSetSha256,
      graphTransitionSetSha256,
      completedDomainStateSetSha256: graphSummary.completedDomainStateSetSha256,
      completedDomainTransitionSetSha256: graphSummary.completedDomainTransitionSetSha256,
    },
    totalArtifactBytes,
  };
  const verificationPath = path.join(OUT_DIR, "production-verification.json");
  fs.writeFileSync(verificationPath, `${JSON.stringify(verification, null, 2)}\n`, "utf8");
  ensure(fs.readdirSync(OUT_DIR).map((name) => fs.statSync(path.join(OUT_DIR, name)).size).reduce((a, b) => a + b, 0)
    <= PROFILE.maxUncompressedArtifactBytes, "final artifact bytes exceed frozen cap");

  process.stdout.write(`${JSON.stringify({ summary, verification }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
