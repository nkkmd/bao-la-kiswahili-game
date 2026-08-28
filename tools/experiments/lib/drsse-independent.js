"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ID_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);

function fail(message) {
  throw new Error(message);
}

function requireTrue(condition, message) {
  if (!condition) fail(message);
}

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function digest(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function digestFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function own(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function checkState(state) {
  requireTrue(state && typeof state === "object" && !Array.isArray(state), "independent state object required");
  for (const field of ID_FIELDS) requireTrue(own(state, field), `independent missing identity field: ${field}`);
  requireTrue(Array.isArray(state.pits) && state.pits.length === 2, "independent pits players invalid");
  let seeds = 0;
  for (const rows of state.pits) {
    requireTrue(Array.isArray(rows) && rows.length === 2, "independent pit rows invalid");
    for (const row of rows) {
      requireTrue(Array.isArray(row) && row.length === 8, "independent pit row width invalid");
      for (const n of row) {
        requireTrue(Number.isInteger(n) && n >= 0, "independent pit count invalid");
        seeds += n;
      }
    }
  }
  requireTrue(Array.isArray(state.reserve) && state.reserve.length === 2, "independent reserve invalid");
  requireTrue(Array.isArray(state.pending) && state.pending.length === 2, "independent pending invalid");
  for (const n of [...state.reserve, ...state.pending]) {
    requireTrue(Number.isInteger(n) && n >= 0, "independent reserve/pending count invalid");
    seeds += n;
  }
  requireTrue(seeds === 64, `independent seed invariant failed: ${seeds}`);
  requireTrue(Array.isArray(state.houseOwned) && state.houseOwned.length === 2 && state.houseOwned.every((v) => typeof v === "boolean"), "independent houseOwned invalid");
  requireTrue(state.player === 0 || state.player === 1, "independent player invalid");
  requireTrue(state.phase === "namua" || state.phase === "mtaji", "independent phase invalid");
  requireTrue(state.winner === null || state.winner === 0 || state.winner === 1, "independent winner invalid");
  return state;
}

function rawCopy(state) {
  checkState(state);
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

function rawKey(state) {
  return digest(canonical(rawCopy(state)));
}

function normalizedMove(move) {
  requireTrue(move && typeof move === "object", "independent move object required");
  const out = {};
  for (const name of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[name] !== undefined) out[name] = move[name];
  }
  out.houseTwo = move.houseTwo === true;
  return out;
}

function moveSignature(move) {
  const m = normalizedMove(move);
  const parts = ["type", "phase", "row", "index", "direction", "side", "houseChoice"]
    .map((field) => (m[field] === undefined || m[field] === null ? "" : String(m[field])));
  parts.push(m.houseTwo ? "true" : "false");
  return parts.join(":");
}

function setDigest(values) {
  return digest(values.slice().sort().join("\n"));
}

function hist(values) {
  const result = new Map();
  for (const value of values) result.set(value, (result.get(value) || 0) + 1);
  return Object.fromEntries(Array.from(result.entries()).sort((a, b) => Number(a[0]) - Number(b[0])).map(([k, v]) => [String(k), v]));
}

function mid(values) {
  if (!values.length) return null;
  const xs = values.slice().sort((a, b) => a - b);
  const i = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[i] : (xs[i - 1] + xs[i]) / 2;
}

function ratio(value, denominator) {
  if (!denominator) return null;
  const b = BigInt(value);
  if (b > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(b) / denominator;
}

function independentEnumerate({ engine, rootState, targetDepth, profile }) {
  const root = rawCopy(rootState);
  const rootId = rawKey(root);
  let current = new Map([[rootId, root]]);
  let occurrences = new Map([[rootId, 1n]]);
  const everStates = new Set([rootId]);
  const everEdges = new Set();
  const depthEdges = new Set();
  const layers = [];
  const parentLayers = [];
  let cumulativeTreeNodes = 1n;
  let cumulativeTreeEdges = 0n;
  let totalEdges = 0;
  let expansions = 0;
  let moveCalls = 0;
  let stopReason = null;
  let lastCompleteDepth = 0;
  let firstIncompleteDepth = null;

  function composition(map) {
    const out = { namuaNonterminal: 0, mtajiNonterminal: 0, terminal: 0 };
    for (const state of map.values()) {
      if (state.winner !== null) out.terminal += 1;
      else if (state.phase === "namua") out.namuaNonterminal += 1;
      else out.mtajiNonterminal += 1;
    }
    return out;
  }

  function layerRow(depth, map, counts, newCount, arrival) {
    const nodeCount = Array.from(counts.values()).reduce((a, b) => a + b, 0n);
    return {
      depth,
      complete: true,
      uniqueRawStateCount: map.size,
      newRawStateCount: newCount,
      cumulativeRawStateCount: everStates.size,
      treeNodeOccurrences: nodeCount.toString(),
      cumulativeTreeNodeOccurrences: cumulativeTreeNodes.toString(),
      treeToLayerUniqueRatio: ratio(nodeCount, map.size),
      phaseComposition: composition(map),
      stateSetSha256: setDigest(Array.from(map.keys())),
      arrival: arrival || {
        arrivalEdgeCount: 0,
        duplicateArrivalCount: 0,
        statesWithMultiplePredecessors: 0,
        predecessorMultiplicityHistogram: {},
        arrivalMultiplicityHistogram: {},
      },
    };
  }

  layers.push(layerRow(0, current, occurrences, 1, null));

  for (let d = 0; d < targetDepth && !stopReason; d += 1) {
    const next = new Map();
    const nextCounts = new Map();
    const incoming = new Map();
    const predecessors = new Map();
    const newEver = new Set();
    const edgeFingerprints = [];
    const branching = [];
    let terminalParents = 0;
    let zeroNonterminal = 0;
    let treeEdgesThisDepth = 0n;
    const ordered = Array.from(current.keys()).sort();

    outer:
    for (const sourceId of ordered) {
      if (expansions + 1 > profile.maxParentStateExpansions) { stopReason = "PARENT_EXPANSION_CAP"; break; }
      expansions += 1;
      const source = current.get(sourceId);
      const sourceCount = occurrences.get(sourceId) || 0n;
      if (source.winner !== null) {
        branching.push(0);
        terminalParents += 1;
        continue;
      }
      const legal = engine.moveVariants(source).map(normalizedMove).sort((a, b) => moveSignature(a).localeCompare(moveSignature(b)));
      branching.push(legal.length);
      if (!legal.length) zeroNonterminal += 1;
      for (const move of legal) {
        if (moveCalls + 1 > profile.maxMoveEvaluations) { stopReason = "MOVE_EVALUATION_CAP"; break outer; }
        if (totalEdges + edgeFingerprints.length + 1 > profile.maxDepthLabelledEdges) { stopReason = "DEPTH_LABELLED_EDGE_CAP"; break outer; }
        moveCalls += 1;
        const child = rawCopy(engine.applyMove(source, move).state);
        const childId = rawKey(child);
        if (!next.has(childId)) next.set(childId, child);
        if (!everStates.has(childId)) newEver.add(childId);
        if (everStates.size + newEver.size > profile.maxCumulativeDistinctRawStates) { stopReason = "UNIQUE_STATE_CAP"; break outer; }
        const mk = moveSignature(move);
        const fp = `${sourceId}|${mk}|${childId}`;
        edgeFingerprints.push(fp);
        nextCounts.set(childId, (nextCounts.get(childId) || 0n) + sourceCount);
        treeEdgesThisDepth += sourceCount;
        if (cumulativeTreeNodes + treeEdgesThisDepth > BigInt(profile.maxCumulativeTreeNodeOccurrences)) { stopReason = "TREE_OCCURRENCE_CAP"; break outer; }
        incoming.set(childId, (incoming.get(childId) || 0) + 1);
        if (!predecessors.has(childId)) predecessors.set(childId, new Set());
        predecessors.get(childId).add(sourceId);
      }
    }

    if (stopReason) {
      firstIncompleteDepth = d + 1;
      break;
    }

    const nextNodeCount = Array.from(nextCounts.values()).reduce((a, b) => a + b, 0n);
    requireTrue(nextNodeCount === treeEdgesThisDepth, `independent tree propagation mismatch at depth ${d + 1}`);
    totalEdges += edgeFingerprints.length;
    cumulativeTreeEdges += treeEdgesThisDepth;
    cumulativeTreeNodes += nextNodeCount;
    for (const key of newEver) everStates.add(key);

    let newGlobalEdges = 0;
    const layerHashedEdges = [];
    for (const fp of edgeFingerprints) {
      layerHashedEdges.push(digest(fp));
      depthEdges.add(digest(`${d}|${fp}`));
      if (!everEdges.has(fp)) {
        everEdges.add(fp);
        newGlobalEdges += 1;
      }
    }
    const predCounts = Array.from(predecessors.values()).map((set) => set.size);
    const incomingCounts = Array.from(incoming.values());
    const arrival = {
      arrivalEdgeCount: edgeFingerprints.length,
      duplicateArrivalCount: edgeFingerprints.length - next.size,
      statesWithMultiplePredecessors: predCounts.filter((n) => n >= 2).length,
      predecessorMultiplicityHistogram: hist(predCounts),
      arrivalMultiplicityHistogram: hist(incomingCounts),
    };
    const branchTotal = branching.reduce((a, b) => a + b, 0);
    parentLayers.push({
      depth: d,
      complete: true,
      uniqueParentRawStateCount: current.size,
      legalEdgeCount: edgeFingerprints.length,
      treeEdgeOccurrences: treeEdgesThisDepth.toString(),
      terminalParentCount: terminalParents,
      zeroLegalMoveNonterminalCount: zeroNonterminal,
      meanLegalBranching: branching.length ? branchTotal / branching.length : null,
      medianLegalBranching: mid(branching),
      branchingDistribution: hist(branching),
      edgeSetSha256: setDigest(layerHashedEdges),
      newGlobalRawGraphEdges: newGlobalEdges,
    });
    current = next;
    occurrences = nextCounts;
    lastCompleteDepth = d + 1;
    layers.push(layerRow(d + 1, current, occurrences, newEver.size, arrival));
  }

  const complete = !stopReason && lastCompleteDepth === targetDepth;
  if (!complete && firstIncompleteDepth === null) firstIncompleteDepth = lastCompleteDepth + 1;
  return {
    rootStateKey: rootId,
    targetDepth,
    targetComplete: complete,
    lastCompleteDepth,
    firstIncompleteDepth: complete ? null : firstIncompleteDepth,
    stopReason,
    layers,
    parentLayers,
    cumulative: {
      distinctRawStatesThroughLastCompleteDepth: everStates.size,
      depthLabelledLegalEdgesThroughLastCompleteParent: totalEdges,
      uniqueRawGraphEdgesThroughLastCompleteParent: everEdges.size,
      treeNodeOccurrencesThroughLastCompleteDepth: cumulativeTreeNodes.toString(),
      treeEdgeOccurrencesThroughLastCompleteParent: cumulativeTreeEdges.toString(),
      treeToCumulativeRawStateRatio: ratio(cumulativeTreeNodes, everStates.size),
      cumulativeRawStateSetSha256: setDigest(Array.from(everStates)),
      cumulativeGlobalRawGraphEdgeSetSha256: setDigest(Array.from(everEdges).map((fp) => digest(fp))),
      cumulativeDepthLabelledEdgeSetSha256: setDigest(Array.from(depthEdges)),
    },
  };
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) fail(`independent missing artifact file: ${filePath}`);
  const text = fs.readFileSync(filePath, "utf8").trim();
  return text ? text.split("\n").map((line) => JSON.parse(line)) : [];
}

function validateRowHash(row, label) {
  const copy = { ...row };
  const stored = copy.rowSha256;
  delete copy.rowSha256;
  requireTrue(typeof stored === "string" && stored === digest(canonical(copy)), `${label} row hash mismatch`);
}

function verifyMaterialized({ engine, outDir, productionCore }) {
  const layerMaps = new Map();
  for (const layer of productionCore.layers) {
    const filePath = path.join(outDir, layer.stateFile);
    requireTrue(digestFile(filePath) === layer.stateFileSha256, `state file hash mismatch depth ${layer.depth}`);
    const rows = readJsonl(filePath);
    requireTrue(rows.length === layer.uniqueRawStateCount, `state row count mismatch depth ${layer.depth}`);
    const map = new Map();
    let treeNodes = 0n;
    for (const row of rows) {
      validateRowHash(row, `state depth ${layer.depth}`);
      requireTrue(row.depth === layer.depth, `state depth assignment mismatch at ${row.stateKey}`);
      checkState(row.rawState);
      requireTrue(rawKey(row.rawState) === row.stateKey, `RAW key corruption at depth ${layer.depth}`);
      requireTrue(!map.has(row.stateKey), `duplicate materialized state row at depth ${layer.depth}`);
      map.set(row.stateKey, row.rawState);
      treeNodes += BigInt(row.treeOccurrences);
    }
    requireTrue(setDigest(Array.from(map.keys())) === layer.stateSetSha256, `state set hash mismatch depth ${layer.depth}`);
    requireTrue(treeNodes.toString() === layer.treeNodeOccurrences, `tree occurrence row sum mismatch depth ${layer.depth}`);
    layerMaps.set(layer.depth, map);
  }

  for (const parentLayer of productionCore.parentLayers) {
    const sourceMap = layerMaps.get(parentLayer.depth);
    const childMap = layerMaps.get(parentLayer.depth + 1);
    requireTrue(sourceMap && childMap, `missing state layer for edge verification depth ${parentLayer.depth}`);
    const edgePath = path.join(outDir, parentLayer.edgeFile);
    requireTrue(digestFile(edgePath) === parentLayer.edgeFileSha256, `edge file hash mismatch depth ${parentLayer.depth}`);
    const rows = readJsonl(edgePath);
    requireTrue(rows.length === parentLayer.legalEdgeCount, `edge row count mismatch depth ${parentLayer.depth}`);
    const fps = [];
    const childIncoming = new Map();
    const childPred = new Map();
    for (const row of rows) {
      validateRowHash(row, `edge depth ${parentLayer.depth}`);
      requireTrue(row.parentDepth === parentLayer.depth, `edge depth misassignment ${row.sourceKey}`);
      requireTrue(sourceMap.has(row.sourceKey), `edge missing source ${row.sourceKey}`);
      requireTrue(childMap.has(row.childKey), `edge missing successor ${row.childKey}`);
      requireTrue(moveSignature(row.move) === row.moveKey, `move key mismatch ${row.sourceKey}`);
      const applied = rawCopy(engine.applyMove(sourceMap.get(row.sourceKey), row.move).state);
      requireTrue(rawKey(applied) === row.childKey, `successor binding mismatch ${row.sourceKey}`);
      const fp = `${row.sourceKey}|${row.moveKey}|${row.childKey}`;
      fps.push(digest(fp));
      childIncoming.set(row.childKey, (childIncoming.get(row.childKey) || 0) + 1);
      if (!childPred.has(row.childKey)) childPred.set(row.childKey, new Set());
      childPred.get(row.childKey).add(row.sourceKey);
    }
    requireTrue(setDigest(fps) === parentLayer.edgeSetSha256, `edge set hash mismatch depth ${parentLayer.depth}`);
    const nextLayer = productionCore.layers.find((x) => x.depth === parentLayer.depth + 1);
    const predCounts = Array.from(childPred.values()).map((set) => set.size);
    const incomingCounts = Array.from(childIncoming.values());
    requireTrue(rows.length - childMap.size === nextLayer.arrival.duplicateArrivalCount, `duplicate arrival mismatch depth ${parentLayer.depth + 1}`);
    requireTrue(predCounts.filter((n) => n >= 2).length === nextLayer.arrival.statesWithMultiplePredecessors, `multiple predecessor count mismatch depth ${parentLayer.depth + 1}`);
    requireTrue(canonical(hist(predCounts)) === canonical(nextLayer.arrival.predecessorMultiplicityHistogram), `predecessor histogram mismatch depth ${parentLayer.depth + 1}`);
    requireTrue(canonical(hist(incomingCounts)) === canonical(nextLayer.arrival.arrivalMultiplicityHistogram), `arrival histogram mismatch depth ${parentLayer.depth + 1}`);
  }

  return { passed: true, verifiedLayerCount: productionCore.layers.length, verifiedParentLayerCount: productionCore.parentLayers.length };
}

function projectForComparison(summary) {
  return {
    rootStateKey: summary.rootStateKey,
    targetDepth: summary.targetDepth,
    targetComplete: summary.targetComplete,
    lastCompleteDepth: summary.lastCompleteDepth,
    firstIncompleteDepth: summary.firstIncompleteDepth,
    stopReason: summary.stopReason,
    layers: summary.layers.map((row) => ({
      depth: row.depth,
      complete: row.complete,
      uniqueRawStateCount: row.uniqueRawStateCount,
      newRawStateCount: row.newRawStateCount,
      cumulativeRawStateCount: row.cumulativeRawStateCount,
      treeNodeOccurrences: row.treeNodeOccurrences,
      cumulativeTreeNodeOccurrences: row.cumulativeTreeNodeOccurrences,
      treeToLayerUniqueRatio: row.treeToLayerUniqueRatio,
      phaseComposition: row.phaseComposition,
      stateSetSha256: row.stateSetSha256,
      arrival: row.arrival,
    })),
    parentLayers: summary.parentLayers.map((row) => ({
      depth: row.depth,
      complete: row.complete,
      uniqueParentRawStateCount: row.uniqueParentRawStateCount,
      legalEdgeCount: row.legalEdgeCount,
      treeEdgeOccurrences: row.treeEdgeOccurrences,
      terminalParentCount: row.terminalParentCount,
      zeroLegalMoveNonterminalCount: row.zeroLegalMoveNonterminalCount,
      meanLegalBranching: row.meanLegalBranching,
      medianLegalBranching: row.medianLegalBranching,
      branchingDistribution: row.branchingDistribution,
      edgeSetSha256: row.edgeSetSha256,
      newGlobalRawGraphEdges: row.newGlobalRawGraphEdges,
    })),
    cumulative: summary.cumulative,
  };
}

function verifyIndependentAgreement({ engine, rootState, targetDepth, profile, productionCore }) {
  const independent = independentEnumerate({ engine, rootState, targetDepth, profile });
  const a = canonical(projectForComparison(productionCore));
  const b = canonical(projectForComparison(independent));
  requireTrue(a === b, "independent full-domain recomputation mismatch");
  return {
    passed: true,
    independentCoreSha256: digest(b),
    independentSummary: independent,
  };
}

module.exports = {
  ID_FIELDS,
  canonical,
  checkState,
  digest,
  digestFile,
  independentEnumerate,
  moveSignature,
  normalizedMove,
  projectForComparison,
  rawCopy,
  rawKey,
  readJsonl,
  setDigest,
  validateRowHash,
  verifyIndependentAgreement,
  verifyMaterialized,
};
