"use strict";

const crypto = require("node:crypto");

const RAW_IDENTITY_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
const MOVE_IDENTITY_FIELDS = Object.freeze(["type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo"]);

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
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

function setHash(values) {
  return sha256Text(Array.from(values).sort().join("\n"));
}

function assertRawStateShape(state) {
  ensure(state && typeof state === "object" && !Array.isArray(state), "state must be object");
  for (const field of RAW_IDENTITY_FIELDS) ensure(hasOwn(state, field), `raw identity field missing: ${field}`);
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "pits shape invalid");
  for (const rows of state.pits) {
    ensure(Array.isArray(rows) && rows.length === 2, "pit rows shape invalid");
    for (const row of rows) ensure(Array.isArray(row) && row.length === 8 && row.every((n) => Number.isInteger(n) && n >= 0), "pit counts invalid");
  }
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2 && state.reserve.every((n) => Number.isInteger(n) && n >= 0), "reserve invalid");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2 && state.houseOwned.every((v) => typeof v === "boolean"), "houseOwned invalid");
  ensure(state.player === 0 || state.player === 1, "player invalid");
  ensure(state.phase === "namua" || state.phase === "mtaji", "phase invalid");
  ensure(state.winner === null || state.winner === 0 || state.winner === 1, "winner invalid");
  ensure(Array.isArray(state.pending) && state.pending.length === 2 && state.pending.every((n) => Number.isInteger(n) && n >= 0), "pending invalid");
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
  return raw.pits.flat(2).reduce((sum, n) => sum + n, 0) + raw.reserve[0] + raw.reserve[1] + raw.pending[0] + raw.pending[1];
}

function stateSerialization(state) {
  ensure(representedSeeds(state) === 64, `represented seed total must be 64, got ${representedSeeds(state)}`);
  return stableStringify(rawRuleState(state));
}

function stateKey(state) {
  return sha256Text(stateSerialization(state));
}

function normalizeMove(move) {
  ensure(move && typeof move === "object" && !Array.isArray(move), "move must be object");
  const out = {};
  for (const field of MOVE_IDENTITY_FIELDS.slice(0, 7)) if (move[field] !== undefined) out[field] = move[field];
  out.houseTwo = move.houseTwo === true;
  return out;
}

function moveKey(move) {
  const normalized = normalizeMove(move);
  const parts = MOVE_IDENTITY_FIELDS.slice(0, 7).map((field) => normalized[field] === undefined || normalized[field] === null ? "" : String(normalized[field]));
  parts.push(normalized.houseTwo ? "true" : "false");
  return parts.join(":");
}

function ratio(numerator, denominator) {
  return { numerator: String(numerator), denominator: String(denominator), defined: BigInt(denominator) !== 0n };
}

function incrementHistogram(hist, value, amount = 1n) {
  const key = String(value);
  hist[key] = String(BigInt(hist[key] || "0") + BigInt(amount));
}

function orderArray(items, mode, salt = 0) {
  const copy = items.slice();
  if (mode === "descending") return copy.reverse();
  if (mode === "shuffled") {
    return copy.sort((a, b) => {
      const ha = sha256Text(`${salt}|${a.sortKey}`);
      const hb = sha256Text(`${salt}|${b.sortKey}`);
      return ha.localeCompare(hb) || a.sortKey.localeCompare(b.sortKey);
    });
  }
  return copy;
}

function summarizeLayer({ depth, layer, engine }) {
  let occurrenceCount = 0n;
  let terminalOccurrences = 0n;
  const uniqueWidth = {};
  const occurrenceWidth = {};
  let unitWidthStates = 0;
  for (const entry of layer.values()) {
    occurrenceCount += entry.occurrences;
    const terminal = entry.state.winner !== null;
    const width = terminal ? 0 : engine.moveVariants(entry.state).length;
    ensure(terminal || width > 0, `nonterminal zero-move state at depth ${depth}: ${entry.key}`);
    incrementHistogram(uniqueWidth, width, 1n);
    incrementHistogram(occurrenceWidth, width, entry.occurrences);
    if (width === 1) unitWidthStates += 1;
    if (terminal) terminalOccurrences += entry.occurrences;
  }
  return {
    depth,
    treeNodeOccurrences: String(occurrenceCount),
    uniqueRawStateCount: layer.size,
    terminalOccurrenceCount: String(terminalOccurrences),
    replyWidthHistogram: uniqueWidth,
    treeOccurrenceReplyWidthHistogram: occurrenceWidth,
    unitWidthStateCount: unitWidthStates,
    stateSetSha256: setHash(layer.keys()),
  };
}

function enumerateBaoLocal({ engine, rootState, targetDepth, traversalOrder = "ascending" }) {
  ensure(Number.isInteger(targetDepth) && targetDepth >= 0, "targetDepth invalid");
  const rootKey = stateKey(rootState);
  const layers = [new Map([[rootKey, { key: rootKey, state: engine.clone(rootState), occurrences: 1n, labels: new Set(), labelOccurrences: new Map() }]])];
  const layerSummaries = [];
  const parentSummaries = [];
  const cumulativeStateKeys = new Set([rootKey]);
  const globalTransitionKeys = new Set();
  const rootMoveSurvival = new Map();
  const immediateReplyWidth = {};
  let firstReconvergenceDepth = null;

  for (let depth = 0; depth <= targetDepth; depth += 1) {
    const layer = layers[depth];
    const summary = summarizeLayer({ depth, layer, engine });
    let reconvergent = 0;
    for (const entry of layer.values()) if (entry.labels.size >= 2) reconvergent += 1;
    summary.reconvergentRawStateCount = reconvergent;
    if (firstReconvergenceDepth === null && reconvergent > 0) firstReconvergenceDepth = depth;
    summary.cumulativeUniqueRawStateCount = cumulativeStateKeys.size;
    layerSummaries.push(summary);
    if (depth === targetDepth) break;

    const next = new Map();
    const transitions = new Map();
    const arrivals = new Map();
    let treeEdges = 0n;
    let widthExpansion = 0;
    let widthCompression = 0;
    let widthStable = 0;
    let branchReopening = 0;
    let branchExtinction = 0;

    const parentItems = Array.from(layer.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((value) => ({ value, sortKey: value.key }));
    for (const wrapped of orderArray(parentItems, traversalOrder, depth)) {
      const parent = wrapped.value;
      const parentTerminal = parent.state.winner !== null;
      const legal = parentTerminal ? [] : engine.moveVariants(parent.state)
        .map((move) => ({ move, moveKey: moveKey(move) }))
        .sort((a, b) => a.moveKey.localeCompare(b.moveKey));
      ensure(parentTerminal || legal.length > 0, `nonterminal zero-move parent ${parent.key}`);
      const moveItems = legal.map((value) => ({ value, sortKey: value.moveKey }));
      const parentWidth = legal.length;
      for (const moveWrapped of orderArray(moveItems, traversalOrder, depth + 1009)) {
        const { move, moveKey: mKey } = moveWrapped.value;
        const applied = engine.applyMove(parent.state, move);
        if (applied.state.reason === "relay-limit") {
          const error = new Error(`relay-limit encountered at depth ${depth} parent ${parent.key}`);
          error.code = "MOVE-NONTERMINATION";
          throw error;
        }
        const childState = applied.state;
        const childKey = stateKey(childState);
        const tKey = `${parent.key}|${mKey}|${childKey}`;
        if (!transitions.has(tKey)) transitions.set(tKey, { sourceKey: parent.key, moveKey: mKey, childKey });
        globalTransitionKeys.add(tKey);
        treeEdges += parent.occurrences;

        let child = next.get(childKey);
        if (!child) {
          child = { key: childKey, state: engine.clone(childState), occurrences: 0n, labels: new Set(), labelOccurrences: new Map() };
          next.set(childKey, child);
        }
        child.occurrences += parent.occurrences;
        if (depth === 0) {
          child.labels.add(mKey);
          child.labelOccurrences.set(mKey, (child.labelOccurrences.get(mKey) || 0n) + parent.occurrences);
        } else {
          for (const [label, labelCount] of parent.labelOccurrences.entries()) {
            child.labels.add(label);
            child.labelOccurrences.set(label, (child.labelOccurrences.get(label) || 0n) + labelCount);
          }
        }

        let arrival = arrivals.get(childKey);
        if (!arrival) {
          arrival = { transitions: new Set(), parents: new Set() };
          arrivals.set(childKey, arrival);
        }
        arrival.transitions.add(tKey);
        arrival.parents.add(parent.key);

        const childTerminal = childState.winner !== null;
        const childWidth = childTerminal ? 0 : engine.moveVariants(childState).length;
        ensure(childTerminal || childWidth > 0, `nonterminal zero-move child ${childKey}`);
        if (childWidth > parentWidth) widthExpansion += 1;
        else if (childWidth < parentWidth) widthCompression += 1;
        else widthStable += 1;
        if (parentWidth === 1 && childWidth >= 2) branchReopening += 1;
        if (childTerminal) branchExtinction += 1;

        if (depth === 0) {
          immediateReplyWidth[mKey] = childWidth;
          rootMoveSurvival.set(mKey, 1);
        } else {
          for (const label of child.labels) rootMoveSurvival.set(label, Math.max(rootMoveSurvival.get(label) || 0, depth + 1));
        }
      }
    }

    let duplicateEncounterCount = 0;
    let multiParentRawStateCount = 0;
    const arrivalMultiplicityHistogram = {};
    const parentMultiplicityHistogram = {};
    for (const arrival of arrivals.values()) {
      const am = arrival.transitions.size;
      const pm = arrival.parents.size;
      duplicateEncounterCount += Math.max(0, am - 1);
      if (pm >= 2) multiParentRawStateCount += 1;
      incrementHistogram(arrivalMultiplicityHistogram, am);
      incrementHistogram(parentMultiplicityHistogram, pm);
    }

    const transitionKeys = Array.from(transitions.keys()).sort();
    parentSummaries.push({
      depth,
      treeEdgeOccurrences: String(treeEdges),
      uniqueTransitionCount: transitions.size,
      transitionSetSha256: setHash(transitionKeys),
      arrivalTransitionCount: transitions.size,
      duplicateEncounterCount,
      duplicateEncounterFraction: ratio(duplicateEncounterCount, transitions.size),
      multiParentRawStateCount,
      arrivalMultiplicityHistogram,
      parentMultiplicityHistogram,
      widthExpansionCount: widthExpansion,
      widthCompressionCount: widthCompression,
      widthStableCount: widthStable,
      branchReopeningCount: branchReopening,
      branchExtinctionCount: branchExtinction,
    });

    layers.push(next);
    for (const key of next.keys()) cumulativeStateKeys.add(key);
  }

  for (let depth = 0; depth < layerSummaries.length; depth += 1) {
    const layer = layerSummaries[depth];
    layer.treeNodeExcess = String(BigInt(layer.treeNodeOccurrences) - BigInt(layer.uniqueRawStateCount));
    layer.treeToUniqueRawRatio = ratio(layer.treeNodeOccurrences, layer.uniqueRawStateCount);
    if (depth < parentSummaries.length) {
      const parent = parentSummaries[depth];
      parent.treeEdgeToUniqueTransitionRatio = ratio(parent.treeEdgeOccurrences, parent.uniqueTransitionCount);
      parent.graphTransitionBranching = ratio(parent.uniqueTransitionCount, layer.uniqueRawStateCount);
      parent.graphStateExpansion = ratio(layerSummaries[depth + 1].uniqueRawStateCount, layer.uniqueRawStateCount);
    }
  }

  const branchSurvival = Array.from(rootMoveSurvival.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([rootMoveKey, length]) => ({
    rootMoveKey,
    branchSurvivalLength: length,
    rightCensored: length === targetDepth,
  }));

  const cumulativeRawStateSetSha256 = setHash(cumulativeStateKeys);
  const cumulativeGlobalRawGraphEdgeSetSha256 = setHash(globalTransitionKeys);
  const rootMoveSubtreeOccurrences = {};
  if (targetDepth >= 1) {
    for (const [label] of Array.from(rootMoveSurvival.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      rootMoveSubtreeOccurrences[label] = {};
      for (let depth = 1; depth < layers.length; depth += 1) {
        let count = 0n;
        for (const entry of layers[depth].values()) count += entry.labelOccurrences.get(label) || 0n;
        rootMoveSubtreeOccurrences[label][String(depth)] = String(count);
      }
    }
  }

  const core = {
    schemaVersion: 1,
    rootRawKey: rootKey,
    targetDepth,
    traversalOrder,
    complete: true,
    representation: { mode: "RAW-ONLY", identityFields: RAW_IDENTITY_FIELDS, validatedTransformSet: [], pendingRequired: true },
    moveIdentityFields: MOVE_IDENTITY_FIELDS,
    rootLegalMoveCount: targetDepth === 0 ? (rootState.winner !== null ? 0 : engine.moveVariants(rootState).length) : parentSummaries[0].uniqueTransitionCount,
    layers: layerSummaries,
    parentLayers: parentSummaries,
    firstReconvergenceDepth,
    immediateReplyWidth,
    branchSurvival,
    rootMoveSubtreeOccurrences,
    cumulative: {
      distinctRawStates: cumulativeStateKeys.size,
      uniqueGlobalTransitions: globalTransitionKeys.size,
      cumulativeRawStateSetSha256,
      cumulativeGlobalRawGraphEdgeSetSha256,
    },
  };
  const forHash = { ...core };
  delete forHash.traversalOrder;
  core.measurementCoreSha256 = sha256Text(stableStringify(forHash));
  return core;
}

function syntheticMeasure(graph, targetDepth, traversalOrder = "ascending") {
  ensure(graph && graph.root && graph.nodes && graph.nodes[graph.root], "synthetic graph invalid");
  const nodeAt = (id) => {
    const node = graph.nodes[id];
    ensure(node, `unknown synthetic node ${id}`);
    return node;
  };
  const layers = [new Map([[graph.root, { id: graph.root, occurrences: 1n, labels: new Set() }]])];
  const summaries = [];
  const edges = [];
  let firstReconvergenceDepth = null;
  for (let depth = 0; depth <= targetDepth; depth += 1) {
    const layer = layers[depth];
    let occurrences = 0n;
    let recon = 0;
    for (const entry of layer.values()) {
      occurrences += entry.occurrences;
      if (entry.labels.size >= 2) recon += 1;
    }
    if (firstReconvergenceDepth === null && recon > 0) firstReconvergenceDepth = depth;
    summaries.push({ depth, treeNodeOccurrences: String(occurrences), uniqueStateCount: layer.size, reconvergentStateCount: recon, stateSetSha256: setHash(layer.keys()) });
    if (depth === targetDepth) break;
    const next = new Map();
    const transitionSet = new Set();
    const arrivals = new Map();
    let treeEdgeOccurrences = 0n;
    let expansion = 0, compression = 0, stable = 0, reopening = 0, extinction = 0;
    const parents = Array.from(layer.values()).sort((a,b) => a.id.localeCompare(b.id)).map((value) => ({ value, sortKey: value.id }));
    for (const wrapped of orderArray(parents, traversalOrder, depth)) {
      const parent = wrapped.value;
      const pnode = nodeAt(parent.id);
      const moves = (pnode.moves || []).slice().sort((a,b) => a.id.localeCompare(b.id)).map((value) => ({ value, sortKey: value.id }));
      for (const mw of orderArray(moves, traversalOrder, depth + 701)) {
        const move = mw.value;
        const cnode = nodeAt(move.to);
        const t = `${parent.id}|${move.id}|${move.to}`;
        transitionSet.add(t);
        treeEdgeOccurrences += parent.occurrences;
        let child = next.get(move.to);
        if (!child) { child = { id: move.to, occurrences: 0n, labels: new Set() }; next.set(move.to, child); }
        child.occurrences += parent.occurrences;
        if (depth === 0) child.labels.add(move.id); else for (const label of parent.labels) child.labels.add(label);
        let arrival = arrivals.get(move.to);
        if (!arrival) { arrival = { transitions: new Set(), parents: new Set() }; arrivals.set(move.to, arrival); }
        arrival.transitions.add(t); arrival.parents.add(parent.id);
        const pw = (pnode.moves || []).length;
        const cw = cnode.terminal ? 0 : (cnode.moves || []).length;
        if (cw > pw) expansion += 1; else if (cw < pw) compression += 1; else stable += 1;
        if (pw === 1 && cw >= 2) reopening += 1;
        if (cnode.terminal) extinction += 1;
      }
    }
    let dup = 0, multiParent = 0;
    for (const a of arrivals.values()) { dup += Math.max(0, a.transitions.size - 1); if (a.parents.size >= 2) multiParent += 1; }
    edges.push({ depth, treeEdgeOccurrences: String(treeEdgeOccurrences), uniqueTransitionCount: transitionSet.size, duplicateEncounterCount: dup, multiParentStateCount: multiParent, widthExpansionCount: expansion, widthCompressionCount: compression, widthStableCount: stable, branchReopeningCount: reopening, branchExtinctionCount: extinction, transitionSetSha256: setHash(transitionSet) });
    layers.push(next);
  }
  const result = { graphId: graph.id, targetDepth, traversalOrder, layers: summaries, parentLayers: edges, firstReconvergenceDepth };
  const hashView = { ...result }; delete hashView.traversalOrder;
  result.coreSha256 = sha256Text(stableStringify(hashView));
  return result;
}

module.exports = {
  RAW_IDENTITY_FIELDS,
  MOVE_IDENTITY_FIELDS,
  stableStringify,
  sha256Text,
  setHash,
  rawRuleState,
  representedSeeds,
  stateSerialization,
  stateKey,
  normalizeMove,
  moveKey,
  enumerateBaoLocal,
  syntheticMeasure,
};
