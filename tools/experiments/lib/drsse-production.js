"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const RAW_IDENTITY_FIELDS = Object.freeze([
  "pits",
  "reserve",
  "houseOwned",
  "player",
  "phase",
  "winner",
  "pending",
]);
const MOVE_IDENTITY_FIELDS = Object.freeze([
  "type",
  "phase",
  "row",
  "index",
  "direction",
  "side",
  "houseChoice",
  "houseTwo",
]);

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function assertRawStateShape(state) {
  ensure(state && typeof state === "object" && !Array.isArray(state), "state must be an object");
  for (const field of RAW_IDENTITY_FIELDS) ensure(hasOwn(state, field), `raw identity field missing: ${field}`);
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "pits must contain two players");
  for (const rows of state.pits) {
    ensure(Array.isArray(rows) && rows.length === 2, "each player must contain two pit rows");
    for (const row of rows) {
      ensure(Array.isArray(row) && row.length === 8, "each pit row must contain eight pits");
      ensure(row.every((n) => Number.isInteger(n) && n >= 0), "pit counts must be non-negative integers");
    }
  }
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2, "reserve must contain two values");
  ensure(state.reserve.every((n) => Number.isInteger(n) && n >= 0), "reserve counts must be non-negative integers");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2, "houseOwned must contain two values");
  ensure(state.houseOwned.every((v) => typeof v === "boolean"), "houseOwned values must be boolean");
  ensure(state.player === 0 || state.player === 1, "player must be 0 or 1");
  ensure(state.phase === "namua" || state.phase === "mtaji", "phase must be namua or mtaji");
  ensure(state.winner === null || state.winner === 0 || state.winner === 1, "winner must be null, 0, or 1");
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "pending must contain two values");
  ensure(state.pending.every((n) => Number.isInteger(n) && n >= 0), "pending counts must be non-negative integers");
}

function rawRuleState(state) {
  assertRawStateShape(state);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function representedSeeds(state) {
  const raw = rawRuleState(state);
  return raw.pits.flat(2).reduce((sum, n) => sum + n, 0)
    + raw.reserve[0] + raw.reserve[1]
    + raw.pending[0] + raw.pending[1];
}

function assertStudyState(state) {
  assertRawStateShape(state);
  ensure(representedSeeds(state) === 64, `seed conservation failed: ${representedSeeds(state)}`);
  return state;
}

function stateSerialization(state) {
  return stableStringify(rawRuleState(assertStudyState(state)));
}

function stateKey(state) {
  return sha256Text(stateSerialization(state));
}

function normalizeMove(move) {
  ensure(move && typeof move === "object" && !Array.isArray(move), "move must be an object");
  const out = {};
  for (const field of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[field] !== undefined) out[field] = move[field];
  }
  out.houseTwo = move.houseTwo === true;
  return out;
}

function moveKey(move) {
  const normalized = normalizeMove(move);
  const parts = ["type", "phase", "row", "index", "direction", "side", "houseChoice"]
    .map((field) => (normalized[field] === undefined || normalized[field] === null ? "" : String(normalized[field])));
  parts.push(normalized.houseTwo ? "true" : "false");
  return parts.join(":");
}

function rowWithHash(row) {
  return { ...row, rowSha256: sha256Text(stableStringify(row)) };
}

function setHash(values) {
  return sha256Text(values.slice().sort().join("\n"));
}

function histogram(values) {
  const out = {};
  for (const value of values) out[String(value)] = (out[String(value)] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort((a, b) => Number(a[0]) - Number(b[0])));
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
}

function bigintString(value) {
  return BigInt(value).toString(10);
}

function safeRatio(bigValue, denominator) {
  if (!denominator) return null;
  const value = BigInt(bigValue);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(value) / denominator;
}

function directoryBytes(root) {
  let total = 0;
  if (!fs.existsSync(root)) return 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) total += directoryBytes(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const text = rows.length ? `${rows.map((row) => JSON.stringify(rowWithHash(row))).join("\n")}\n` : "";
  fs.writeFileSync(filePath, text, "utf8");
  return Buffer.byteLength(text);
}

function classifyStop(reason) {
  if (!reason) return null;
  return reason === "WALL_CLOCK_CAP" ? "ADMIN-CUTOFF" : "RESOURCE-LIMIT";
}

function enumerateExactDepth({ engine, rootState, targetDepth, outDir, profile, studyId, stageId, rootLabel }) {
  ensure(Number.isInteger(targetDepth) && targetDepth >= 0, "targetDepth must be a non-negative integer");
  ensure(profile && typeof profile === "object", "profile is required");
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
    assertStudyState(state);
    return engine.moveVariants(state).map(normalizeMove).sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
  }

  function guardedApply(state, move) {
    assertStudyState(state);
    const child = engine.applyMove(state, move).state;
    assertStudyState(child);
    return rawRuleState(child);
  }

  const invalid = clone(engine.initialState());
  delete invalid.pending;
  let missingPendingRejected = false;
  try {
    assertStudyState(invalid);
  } catch (error) {
    missingPendingRejected = /pending/.test(error.message);
  }
  ensure(missingPendingRejected, "missing pending negative control failed");

  const rootRaw = rawRuleState(assertStudyState(rootState));
  const rootKey = stateKey(rootRaw);
  let currentStates = new Map([[rootKey, rootRaw]]);
  let currentOccurrences = new Map([[rootKey, 1n]]);
  const globalStates = new Set([rootKey]);
  const globalEdges = new Set();
  const depthLabelledEdges = new Set();
  const layers = [];
  const parentLayers = [];

  function phaseComposition(stateMap) {
    const out = { namuaNonterminal: 0, mtajiNonterminal: 0, terminal: 0 };
    for (const state of stateMap.values()) {
      if (state.winner !== null) out.terminal += 1;
      else if (state.phase === "namua") out.namuaNonterminal += 1;
      else out.mtajiNonterminal += 1;
    }
    return out;
  }

  function materializeLayer(depth, stateMap, occurrenceMap, newCount, arrival) {
    const rows = Array.from(stateMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([key, rawState]) => ({
      depth,
      stateKey: key,
      rawState,
      treeOccurrences: bigintString(occurrenceMap.get(key) || 0n),
    }));
    const fileName = `layer-${String(depth).padStart(2, "0")}-states.jsonl`;
    const filePath = path.join(outDir, fileName);
    writeJsonl(filePath, rows);
    const treeNodes = Array.from(occurrenceMap.values()).reduce((sum, n) => sum + n, 0n);
    return {
      depth,
      complete: true,
      uniqueRawStateCount: stateMap.size,
      newRawStateCount: newCount,
      cumulativeRawStateCount: globalStates.size,
      treeNodeOccurrences: bigintString(treeNodes),
      cumulativeTreeNodeOccurrences: bigintString(cumulativeTreeNodes),
      treeToLayerUniqueRatio: safeRatio(treeNodes, stateMap.size),
      phaseComposition: phaseComposition(stateMap),
      stateSetSha256: setHash(Array.from(stateMap.keys())),
      stateFile: fileName,
      stateFileSha256: sha256File(filePath),
      arrival: arrival || {
        arrivalEdgeCount: 0,
        duplicateArrivalCount: 0,
        statesWithMultiplePredecessors: 0,
        predecessorMultiplicityHistogram: {},
        arrivalMultiplicityHistogram: {},
      },
    };
  }

  const rootLayer = materializeLayer(0, currentStates, currentOccurrences, 1, null);
  layers.push(rootLayer);
  writeJson(path.join(outDir, "checkpoint-depth-00.json"), {
    studyId, stageId, rootLabel, depth: 0, stateSetSha256: rootLayer.stateSetSha256, complete: true,
  });
  if (directoryBytes(outDir) > profile.maxUncompressedArtifactBytes) {
    stopReason = "ARTIFACT_BYTE_CAP";
    firstIncompleteDepth = 0;
  }

  for (let parentDepth = 0; !stopReason && parentDepth < targetDepth; parentDepth += 1) {
    const nextStates = new Map();
    const nextOccurrences = new Map();
    const nextArrivalCount = new Map();
    const nextPredecessors = new Map();
    const newGlobalKeys = new Set();
    const edgeRows = [];
    const layerBranching = [];
    let terminalParents = 0;
    let zeroLegalMoveNonterminal = 0;
    let layerTreeEdges = 0n;

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
        if (cumulativeDepthLabelledEdges + edgeRows.length + 1 > profile.maxDepthLabelledEdges) {
          stopReason = "DEPTH_LABELLED_EDGE_CAP";
          break layerExpansion;
        }
        moveEvaluations += 1;
        const child = guardedApply(source, move);
        const childKey = stateKey(child);
        if (!nextStates.has(childKey)) nextStates.set(childKey, child);
        if (!globalStates.has(childKey)) newGlobalKeys.add(childKey);
        if (globalStates.size + newGlobalKeys.size > profile.maxCumulativeDistinctRawStates) {
          stopReason = "UNIQUE_STATE_CAP";
          break layerExpansion;
        }
        const exactMoveKey = moveKey(move);
        edgeRows.push({
          parentDepth,
          sourceKey,
          moveKey: exactMoveKey,
          move,
          childKey,
        });
        const nextCount = (nextOccurrences.get(childKey) || 0n) + sourceOccurrences;
        nextOccurrences.set(childKey, nextCount);
        layerTreeEdges += sourceOccurrences;
        const nextTotal = cumulativeTreeNodes + layerTreeEdges;
        if (nextTotal > BigInt(profile.maxCumulativeTreeNodeOccurrences)) {
          stopReason = "TREE_OCCURRENCE_CAP";
          break layerExpansion;
        }
        nextArrivalCount.set(childKey, (nextArrivalCount.get(childKey) || 0) + 1);
        if (!nextPredecessors.has(childKey)) nextPredecessors.set(childKey, new Set());
        nextPredecessors.get(childKey).add(sourceKey);
      }
    }

    if (stopReason) {
      firstIncompleteDepth = parentDepth + 1;
      break;
    }

    const nextTreeNodes = Array.from(nextOccurrences.values()).reduce((sum, n) => sum + n, 0n);
    ensure(nextTreeNodes === layerTreeEdges, `tree node/edge propagation mismatch at depth ${parentDepth + 1}`);

    const edgeLines = edgeRows.map((row) => JSON.stringify(rowWithHash(row))).join("\n");
    const edgeTextBytes = edgeLines ? Buffer.byteLength(`${edgeLines}\n`) : 0;
    const stateRowsPreview = Array.from(nextStates.entries()).map(([key, rawState]) => rowWithHash({
      depth: parentDepth + 1,
      stateKey: key,
      rawState,
      treeOccurrences: bigintString(nextOccurrences.get(key) || 0n),
    }));
    const stateLines = stateRowsPreview.map((row) => JSON.stringify(row)).join("\n");
    const stateTextBytes = stateLines ? Buffer.byteLength(`${stateLines}\n`) : 0;
    if (directoryBytes(outDir) + edgeTextBytes + stateTextBytes + 1048576 > profile.maxUncompressedArtifactBytes) {
      stopReason = "ARTIFACT_BYTE_CAP";
      firstIncompleteDepth = parentDepth + 1;
      break;
    }

    const edgeFileName = `layer-${String(parentDepth).padStart(2, "0")}-edges.jsonl`;
    const edgeFilePath = path.join(outDir, edgeFileName);
    writeJsonl(edgeFilePath, edgeRows);
    cumulativeDepthLabelledEdges += edgeRows.length;
    cumulativeTreeEdges += layerTreeEdges;
    cumulativeTreeNodes += nextTreeNodes;

    const layerEdgeFingerprints = [];
    let newGlobalEdges = 0;
    for (const row of edgeRows) {
      const globalFingerprint = `${row.sourceKey}|${row.moveKey}|${row.childKey}`;
      const depthFingerprint = `${parentDepth}|${globalFingerprint}`;
      layerEdgeFingerprints.push(sha256Text(globalFingerprint));
      depthLabelledEdges.add(sha256Text(depthFingerprint));
      if (!globalEdges.has(globalFingerprint)) {
        globalEdges.add(globalFingerprint);
        newGlobalEdges += 1;
      }
    }

    for (const key of newGlobalKeys) globalStates.add(key);

    const arrivalCounts = Array.from(nextArrivalCount.values());
    const predecessorCounts = Array.from(nextPredecessors.values()).map((set) => set.size);
    const arrival = {
      arrivalEdgeCount: edgeRows.length,
      duplicateArrivalCount: edgeRows.length - nextStates.size,
      statesWithMultiplePredecessors: predecessorCounts.filter((n) => n >= 2).length,
      predecessorMultiplicityHistogram: histogram(predecessorCounts),
      arrivalMultiplicityHistogram: histogram(arrivalCounts),
    };
    const branchingSum = layerBranching.reduce((sum, n) => sum + n, 0);
    parentLayers.push({
      depth: parentDepth,
      complete: true,
      uniqueParentRawStateCount: currentStates.size,
      legalEdgeCount: edgeRows.length,
      treeEdgeOccurrences: bigintString(layerTreeEdges),
      terminalParentCount: terminalParents,
      zeroLegalMoveNonterminalCount: zeroLegalMoveNonterminal,
      meanLegalBranching: layerBranching.length ? branchingSum / layerBranching.length : null,
      medianLegalBranching: median(layerBranching),
      branchingDistribution: histogram(layerBranching),
      edgeSetSha256: setHash(layerEdgeFingerprints),
      edgeFile: edgeFileName,
      edgeFileSha256: sha256File(edgeFilePath),
      newGlobalRawGraphEdges: newGlobalEdges,
    });

    currentStates = nextStates;
    currentOccurrences = nextOccurrences;
    lastCompleteDepth = parentDepth + 1;
    const layerSummary = materializeLayer(parentDepth + 1, currentStates, currentOccurrences, newGlobalKeys.size, arrival);
    layers.push(layerSummary);
    writeJson(path.join(outDir, `checkpoint-depth-${String(parentDepth + 1).padStart(2, "0")}.json`), {
      studyId,
      stageId,
      rootLabel,
      depth: parentDepth + 1,
      stateSetSha256: layerSummary.stateSetSha256,
      precedingEdgeSetSha256: parentLayers[parentLayers.length - 1].edgeSetSha256,
      complete: true,
    });
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
      identityFields: RAW_IDENTITY_FIELDS,
      excludedFields: ["turn", "reason"],
      pendingRequired: true,
      representedSeedInvariant: 64,
      validatedTransformSet: [],
      symmetryReductionUsed: false,
      canonicalizationUsed: false,
    },
    moveIdentityFields: MOVE_IDENTITY_FIELDS,
    targetDepth,
    rootStateKey: rootKey,
    targetComplete,
    lastCompleteDepth,
    firstIncompleteDepth: targetComplete ? null : firstIncompleteDepth,
    stopReason,
    technicalStopClassification: classifyStop(stopReason),
    layers: completedLayers,
    parentLayers: completedParentLayers,
    cumulative: {
      distinctRawStatesThroughLastCompleteDepth: globalStates.size,
      depthLabelledLegalEdgesThroughLastCompleteParent: cumulativeDepthLabelledEdges,
      uniqueRawGraphEdgesThroughLastCompleteParent: globalEdges.size,
      treeNodeOccurrencesThroughLastCompleteDepth: bigintString(cumulativeTreeNodes),
      treeEdgeOccurrencesThroughLastCompleteParent: bigintString(cumulativeTreeEdges),
      treeToCumulativeRawStateRatio: safeRatio(cumulativeTreeNodes, globalStates.size),
      cumulativeRawStateSetSha256: setHash(Array.from(globalStates)),
      cumulativeGlobalRawGraphEdgeSetSha256: setHash(Array.from(globalEdges).map((fp) => sha256Text(fp))),
      cumulativeDepthLabelledEdgeSetSha256: setHash(Array.from(depthLabelledEdges)),
    },
    resourceUse: {
      parentStateExpansions: parentExpansions,
      moveEvaluations,
      elapsedSeconds: elapsedSeconds(),
      cpuUserMicros: cpu.user,
      cpuSystemMicros: cpu.system,
      peakResidentSetBytes: peakRss,
      uncompressedArtifactBytesBeforeCore: directoryBytes(outDir),
    },
    profile,
    completeLayerPrincipleSatisfied: targetComplete,
  };
  core.resultCoreSha256 = sha256Text(stableStringify(core));
  writeJson(path.join(outDir, "result-core.json"), core);
  core.resourceUse.uncompressedArtifactBytesFinal = directoryBytes(outDir);
  return core;
}

module.exports = {
  RAW_IDENTITY_FIELDS,
  MOVE_IDENTITY_FIELDS,
  assertRawStateShape,
  assertStudyState,
  bigintString,
  classifyStop,
  clone,
  enumerateExactDepth,
  histogram,
  moveKey,
  normalizeMove,
  rawRuleState,
  representedSeeds,
  safeRatio,
  setHash,
  sha256File,
  sha256Text,
  stableStringify,
  stateKey,
  stateSerialization,
  writeJson,
};
