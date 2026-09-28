"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const base = require("./drsse-production.js");
const contract = require("./fdert-contract.js");

const ARTIFACT_RESERVE_BYTES = 1048576;

function rowWithHash(row) {
  return { ...row, rowSha256: base.sha256Text(base.stableStringify(row)) };
}

function median(values) {
  if (!values.length) return null;
  const xs = values.slice().sort((a, b) => a - b);
  const i = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[i] : (xs[i - 1] + xs[i]) / 2;
}

function sha256FileChunked(filePath) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.allocUnsafe(8 * 1024 * 1024);
  try {
    while (true) {
      const n = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (!n) break;
      hash.update(buffer.subarray(0, n));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest("hex");
}

function serializedRowLine(row) {
  return `${JSON.stringify(rowWithHash(row))}\n`;
}

function phaseComposition(stateMap) {
  const out = { namuaNonterminal: 0, mtajiNonterminal: 0, terminal: 0 };
  for (const state of stateMap.values()) {
    if (state.winner !== null) out.terminal += 1;
    else if (state.phase === "namua") out.namuaNonterminal += 1;
    else out.mtajiNonterminal += 1;
  }
  return out;
}

function stateLayerPlan(depth, stateMap, occurrenceMap) {
  const keys = Array.from(stateMap.keys()).sort();
  let bytes = 0;
  let treeNodes = 0n;
  for (const key of keys) {
    const row = {
      depth,
      stateKey: key,
      rawState: stateMap.get(key),
      treeOccurrences: base.bigintString(occurrenceMap.get(key) || 0n),
    };
    bytes += Buffer.byteLength(serializedRowLine(row));
    treeNodes += occurrenceMap.get(key) || 0n;
  }
  return { keys, bytes, treeNodes };
}

function writeStateLayer(filePath, depth, stateMap, occurrenceMap, keys) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const fd = fs.openSync(filePath, "w");
  try {
    for (const key of keys) {
      const row = {
        depth,
        stateKey: key,
        rawState: stateMap.get(key),
        treeOccurrences: base.bigintString(occurrenceMap.get(key) || 0n),
      };
      fs.writeSync(fd, serializedRowLine(row), null, "utf8");
    }
  } finally {
    fs.closeSync(fd);
  }
}

function enumerateExactDepth({ engine, rootState, targetDepth, outDir, profile, studyId, stageId, rootLabel }) {
  contract.ensure(Number.isInteger(targetDepth) && targetDepth >= 0, "targetDepth must be a non-negative integer");
  contract.ensure(profile && typeof profile === "object", "profile is required");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const started = process.hrtime.bigint();
  const startedCpu = process.cpuUsage();
  let peakRss = process.memoryUsage().rss;
  let parentExpansions = 0;
  let moveEvaluations = 0;
  let cumulativeDepthLabelledEdges = 0;
  let cumulativeTreeNodes = 1n;
  let cumulativeTreeEdges = 0n;
  let stopReason = null;
  let lastCompleteDepth = 0;
  let firstIncompleteDepth = null;

  function elapsedSeconds() {
    return Number(process.hrtime.bigint() - started) / 1e9;
  }

  function updateRss() {
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
  }

  function ambientStop() {
    updateRss();
    if (elapsedSeconds() >= profile.maxWallClockSeconds) return "WALL_CLOCK_CAP";
    if (peakRss >= profile.maxResidentSetBytes) return "RSS_CAP";
    return null;
  }

  function guardedMoves(state) {
    base.assertStudyState(state);
    return engine.moveVariants(state).map(base.normalizeMove).sort((a, b) => base.moveKey(a).localeCompare(base.moveKey(b)));
  }

  function guardedApply(state, move) {
    base.assertStudyState(state);
    const child = engine.applyMove(state, move).state;
    base.assertStudyState(child);
    return base.rawRuleState(child);
  }

  const invalid = base.clone(engine.initialState());
  delete invalid.pending;
  let missingPendingRejected = false;
  try {
    base.assertStudyState(invalid);
  } catch (error) {
    missingPendingRejected = /pending/.test(error.message);
  }
  contract.ensure(missingPendingRejected, "missing pending negative control failed");

  const rootRaw = base.rawRuleState(base.assertStudyState(rootState));
  const rootKey = base.stateKey(rootRaw);
  let currentStates = new Map([[rootKey, rootRaw]]);
  let currentOccurrences = new Map([[rootKey, 1n]]);
  const globalStates = new Set([rootKey]);
  const globalEdges = new Set();
  const depthLabelledEdges = new Set();
  const layers = [];
  const parentLayers = [];

  function materializeCommittedLayer(depth, stateMap, occurrenceMap, newCount, arrival, plan) {
    const fileName = `layer-${String(depth).padStart(2, "0")}-states.jsonl`;
    const filePath = path.join(outDir, fileName);
    writeStateLayer(filePath, depth, stateMap, occurrenceMap, plan.keys);
    return {
      depth,
      complete: true,
      uniqueRawStateCount: stateMap.size,
      newRawStateCount: newCount,
      cumulativeRawStateCount: globalStates.size,
      treeNodeOccurrences: base.bigintString(plan.treeNodes),
      cumulativeTreeNodeOccurrences: base.bigintString(cumulativeTreeNodes),
      treeToLayerUniqueRatio: base.safeRatio(plan.treeNodes, stateMap.size),
      phaseComposition: phaseComposition(stateMap),
      stateSetSha256: base.setHash(plan.keys),
      stateFile: fileName,
      stateFileSha256: sha256FileChunked(filePath),
      arrival: arrival || {
        arrivalEdgeCount: 0,
        duplicateArrivalCount: 0,
        statesWithMultiplePredecessors: 0,
        predecessorMultiplicityHistogram: {},
        arrivalMultiplicityHistogram: {},
      },
    };
  }

  const rootPlan = stateLayerPlan(0, currentStates, currentOccurrences);
  if (rootPlan.bytes + ARTIFACT_RESERVE_BYTES > profile.maxUncompressedArtifactBytes) {
    stopReason = "ARTIFACT_BYTE_CAP";
    firstIncompleteDepth = 0;
  } else {
    const rootLayer = materializeCommittedLayer(0, currentStates, currentOccurrences, 1, null, rootPlan);
    layers.push(rootLayer);
    base.writeJson(path.join(outDir, "checkpoint-depth-00.json"), {
      studyId, stageId, rootLabel, depth: 0, stateSetSha256: rootLayer.stateSetSha256, complete: true,
    });
    if (contract.directoryBytes(outDir) + ARTIFACT_RESERVE_BYTES > profile.maxUncompressedArtifactBytes) {
      stopReason = "ARTIFACT_BYTE_CAP";
      firstIncompleteDepth = 0;
    }
  }

  for (let parentDepth = 0; !stopReason && parentDepth < targetDepth; parentDepth += 1) {
    const nextStates = new Map();
    const nextOccurrences = new Map();
    const nextArrivalCount = new Map();
    const nextPredecessors = new Map();
    const newGlobalKeys = new Set();
    const layerEdgeFingerprints = [];
    const layerBranching = [];
    let terminalParents = 0;
    let zeroLegalMoveNonterminal = 0;
    let layerTreeEdges = 0n;
    let edgeCount = 0;
    let edgeBytes = 0;

    const baseArtifactBytes = contract.directoryBytes(outDir);
    const edgeFileName = `layer-${String(parentDepth).padStart(2, "0")}-edges.jsonl`;
    const edgeFilePath = path.join(outDir, edgeFileName);
    const edgeTempPath = `${edgeFilePath}.partial`;
    const edgeFd = fs.openSync(edgeTempPath, "w");
    let edgeClosed = false;

    function closeEdge() {
      if (!edgeClosed) {
        fs.closeSync(edgeFd);
        edgeClosed = true;
      }
    }

    const orderedParents = Array.from(currentStates.keys()).sort();
    layerExpansion:
    for (const sourceKey of orderedParents) {
      const ambient = ambientStop();
      if (ambient) { stopReason = ambient; break; }
      if (parentExpansions + 1 > profile.maxParentStateExpansions) {
        stopReason = "PARENT_EXPANSION_CAP";
        break;
      }
      parentExpansions += 1;
      const source = currentStates.get(sourceKey);
      const sourceOccurrences = currentOccurrences.get(sourceKey) || 0n;
      if (source.winner !== null) {
        terminalParents += 1;
        layerBranching.push(0);
        continue;
      }
      const moves = guardedMoves(source);
      layerBranching.push(moves.length);
      if (moves.length === 0) zeroLegalMoveNonterminal += 1;

      for (const move of moves) {
        const ambientInner = ambientStop();
        if (ambientInner) { stopReason = ambientInner; break layerExpansion; }
        if (moveEvaluations + 1 > profile.maxMoveEvaluations) {
          stopReason = "MOVE_EVALUATION_CAP";
          break layerExpansion;
        }
        if (cumulativeDepthLabelledEdges + edgeCount + 1 > profile.maxDepthLabelledEdges) {
          stopReason = "DEPTH_LABELLED_EDGE_CAP";
          break layerExpansion;
        }

        moveEvaluations += 1;
        const child = guardedApply(source, move);
        const childKey = base.stateKey(child);
        if (!nextStates.has(childKey)) nextStates.set(childKey, child);
        if (!globalStates.has(childKey)) newGlobalKeys.add(childKey);
        if (globalStates.size + newGlobalKeys.size > profile.maxCumulativeDistinctRawStates) {
          stopReason = "UNIQUE_STATE_CAP";
          break layerExpansion;
        }

        const exactMoveKey = base.moveKey(move);
        const edgeRow = { parentDepth, sourceKey, moveKey: exactMoveKey, move, childKey };
        const edgeLine = serializedRowLine(edgeRow);
        const lineBytes = Buffer.byteLength(edgeLine);
        if (baseArtifactBytes + edgeBytes + lineBytes + ARTIFACT_RESERVE_BYTES > profile.maxUncompressedArtifactBytes) {
          stopReason = "ARTIFACT_BYTE_CAP";
          break layerExpansion;
        }
        fs.writeSync(edgeFd, edgeLine, null, "utf8");
        edgeBytes += lineBytes;
        edgeCount += 1;

        const nextCount = (nextOccurrences.get(childKey) || 0n) + sourceOccurrences;
        nextOccurrences.set(childKey, nextCount);
        layerTreeEdges += sourceOccurrences;
        if (cumulativeTreeNodes + layerTreeEdges > BigInt(profile.maxCumulativeTreeNodeOccurrences)) {
          stopReason = "TREE_OCCURRENCE_CAP";
          break layerExpansion;
        }
        nextArrivalCount.set(childKey, (nextArrivalCount.get(childKey) || 0) + 1);
        if (!nextPredecessors.has(childKey)) nextPredecessors.set(childKey, new Set());
        nextPredecessors.get(childKey).add(sourceKey);

        const globalFingerprint = `${sourceKey}|${exactMoveKey}|${childKey}`;
        layerEdgeFingerprints.push(base.sha256Text(globalFingerprint));
      }
    }

    closeEdge();

    if (stopReason) {
      fs.rmSync(edgeTempPath, { force: true });
      firstIncompleteDepth = parentDepth + 1;
      break;
    }

    const nextTreeNodes = Array.from(nextOccurrences.values()).reduce((sum, n) => sum + n, 0n);
    contract.ensure(nextTreeNodes === layerTreeEdges, `tree node/edge propagation mismatch at depth ${parentDepth + 1}`);

    const nextPlan = stateLayerPlan(parentDepth + 1, nextStates, nextOccurrences);
    if (baseArtifactBytes + edgeBytes + nextPlan.bytes + ARTIFACT_RESERVE_BYTES > profile.maxUncompressedArtifactBytes) {
      fs.rmSync(edgeTempPath, { force: true });
      stopReason = "ARTIFACT_BYTE_CAP";
      firstIncompleteDepth = parentDepth + 1;
      break;
    }

    fs.renameSync(edgeTempPath, edgeFilePath);
    cumulativeDepthLabelledEdges += edgeCount;
    cumulativeTreeEdges += layerTreeEdges;
    cumulativeTreeNodes += nextTreeNodes;

    let newGlobalEdges = 0;
    for (const sourceKey of orderedParents) {
      const source = currentStates.get(sourceKey);
      if (source.winner !== null) continue;
      const moves = guardedMoves(source);
      for (const move of moves) {
        const child = guardedApply(source, move);
        const childKey = base.stateKey(child);
        const globalFingerprint = `${sourceKey}|${base.moveKey(move)}|${childKey}`;
        const depthFingerprint = `${parentDepth}|${globalFingerprint}`;
        depthLabelledEdges.add(base.sha256Text(depthFingerprint));
        if (!globalEdges.has(globalFingerprint)) {
          globalEdges.add(globalFingerprint);
          newGlobalEdges += 1;
        }
      }
    }

    for (const key of newGlobalKeys) globalStates.add(key);

    const arrivalCounts = Array.from(nextArrivalCount.values());
    const predecessorCounts = Array.from(nextPredecessors.values()).map((set) => set.size);
    const arrival = {
      arrivalEdgeCount: edgeCount,
      duplicateArrivalCount: edgeCount - nextStates.size,
      statesWithMultiplePredecessors: predecessorCounts.filter((n) => n >= 2).length,
      predecessorMultiplicityHistogram: base.histogram(predecessorCounts),
      arrivalMultiplicityHistogram: base.histogram(arrivalCounts),
    };
    const branchingSum = layerBranching.reduce((sum, n) => sum + n, 0);
    parentLayers.push({
      depth: parentDepth,
      complete: true,
      uniqueParentRawStateCount: currentStates.size,
      legalEdgeCount: edgeCount,
      treeEdgeOccurrences: base.bigintString(layerTreeEdges),
      terminalParentCount: terminalParents,
      zeroLegalMoveNonterminalCount: zeroLegalMoveNonterminal,
      meanLegalBranching: layerBranching.length ? branchingSum / layerBranching.length : null,
      medianLegalBranching: median(layerBranching),
      branchingDistribution: base.histogram(layerBranching),
      edgeSetSha256: base.setHash(layerEdgeFingerprints),
      edgeFile: edgeFileName,
      edgeFileSha256: sha256FileChunked(edgeFilePath),
      newGlobalRawGraphEdges: newGlobalEdges,
    });

    currentStates = nextStates;
    currentOccurrences = nextOccurrences;
    lastCompleteDepth = parentDepth + 1;
    const layerSummary = materializeCommittedLayer(parentDepth + 1, currentStates, currentOccurrences, newGlobalKeys.size, arrival, nextPlan);
    layers.push(layerSummary);
    base.writeJson(path.join(outDir, `checkpoint-depth-${String(parentDepth + 1).padStart(2, "0")}.json`), {
      studyId,
      stageId,
      rootLabel,
      depth: parentDepth + 1,
      stateSetSha256: layerSummary.stateSetSha256,
      precedingEdgeSetSha256: parentLayers[parentLayers.length - 1].edgeSetSha256,
      complete: true,
    });

    if (contract.directoryBytes(outDir) + ARTIFACT_RESERVE_BYTES > profile.maxUncompressedArtifactBytes) {
      stopReason = "ARTIFACT_BYTE_CAP";
      firstIncompleteDepth = parentDepth + 2;
      break;
    }
  }

  updateRss();
  const targetComplete = !stopReason && lastCompleteDepth === targetDepth;
  if (!targetComplete && firstIncompleteDepth === null) firstIncompleteDepth = lastCompleteDepth + 1;
  const cpu = process.cpuUsage(startedCpu);

  const completedLayers = layers.filter((row) => row.depth <= lastCompleteDepth);
  const completedParentLayers = parentLayers.filter((row) => row.depth < lastCompleteDepth || (targetComplete && row.depth < targetDepth));
  const core = {
    schemaVersion: 1,
    studyId,
    stageId,
    rootLabel,
    representation: {
      mode: "RAW-ONLY",
      identityFields: base.RAW_IDENTITY_FIELDS,
      excludedFields: ["turn", "reason"],
      pendingRequired: true,
      representedSeedInvariant: 64,
      validatedTransformSet: [],
      symmetryReductionUsed: false,
      canonicalizationUsed: false,
    },
    moveIdentityFields: base.MOVE_IDENTITY_FIELDS,
    targetDepth,
    rootStateKey: rootKey,
    targetComplete,
    lastCompleteDepth,
    firstIncompleteDepth: targetComplete ? null : firstIncompleteDepth,
    stopReason,
    technicalStopClassification: base.classifyStop(stopReason),
    layers: completedLayers,
    parentLayers: completedParentLayers,
    cumulative: {
      distinctRawStatesThroughLastCompleteDepth: globalStates.size,
      depthLabelledLegalEdgesThroughLastCompleteParent: cumulativeDepthLabelledEdges,
      uniqueRawGraphEdgesThroughLastCompleteParent: globalEdges.size,
      treeNodeOccurrencesThroughLastCompleteDepth: base.bigintString(cumulativeTreeNodes),
      treeEdgeOccurrencesThroughLastCompleteParent: base.bigintString(cumulativeTreeEdges),
      treeToCumulativeRawStateRatio: base.safeRatio(cumulativeTreeNodes, globalStates.size),
      cumulativeRawStateSetSha256: base.setHash(Array.from(globalStates)),
      cumulativeGlobalRawGraphEdgeSetSha256: base.setHash(Array.from(globalEdges).map((fp) => base.sha256Text(fp))),
      cumulativeDepthLabelledEdgeSetSha256: base.setHash(Array.from(depthLabelledEdges)),
    },
    resourceUse: {
      parentStateExpansions: parentExpansions,
      moveEvaluations,
      elapsedSeconds: elapsedSeconds(),
      cpuUserMicros: cpu.user,
      cpuSystemMicros: cpu.system,
      peakResidentSetBytes: peakRss,
      uncompressedArtifactBytesBeforeCore: contract.directoryBytes(outDir),
    },
    profile,
    completeLayerPrincipleSatisfied: targetComplete,
    materializationMode: "ROW-STREAMED-BOUNDED-MEMORY",
  };
  core.resultCoreSha256 = base.sha256Text(base.stableStringify(core));
  base.writeJson(path.join(outDir, "result-core.json"), core);
  core.resourceUse.uncompressedArtifactBytesFinal = contract.directoryBytes(outDir);
  return core;
}

module.exports = {
  ...base,
  enumerateExactDepth,
  sha256FileChunked,
};
