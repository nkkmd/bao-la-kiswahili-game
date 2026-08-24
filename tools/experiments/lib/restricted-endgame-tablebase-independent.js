"use strict";

const crypto = require("node:crypto");
const V = require("./restricted-endgame-independent-verifier.js");
const R = require("./restricted-endgame-retrograde-independent.js");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function buildIndependentGraph(rootStates, options = {}) {
  const maxStates = options.maxStates ?? 250_000;
  const maxEdges = options.maxEdges ?? 2_000_000;
  const maxMicrostates = options.maxMicrostates ?? 1_000_000;
  const states = new Map();
  const queue = [];
  const movesByState = new Map();
  const edgeRows = [];
  let queueIndex = 0;
  let maxMoveMicrosteps = 0;

  function add(state) {
    const id = V.stateKey(state);
    const serialized = V.stateSerialization(state);
    const previous = states.get(id);
    if (previous) {
      if (previous.serialized !== serialized) throw new Error(`Independent state hash collision ${id}`);
      return id;
    }
    states.set(id, { state: clone(state), serialized });
    queue.push(id);
    return id;
  }

  const rootKeys = rootStates.map(add).sort();
  while (queueIndex < queue.length) {
    if (states.size > maxStates) throw new Error("Independent graph exceeded frozen state limit");
    const sourceId = queue[queueIndex++];
    const source = states.get(sourceId).state;
    if (source.winner !== null) {
      movesByState.set(sourceId, []);
      continue;
    }
    if (source.phase !== "mtaji") throw new Error(`Independent phase escape ${sourceId}`);
    const moves = V.legalMtajiMoves(source);
    if (!moves.length) throw new Error(`Independent nonterminal state has no move ${sourceId}`);
    const rows = [];
    for (const move of moves) {
      if (edgeRows.length >= maxEdges) throw new Error("Independent graph exceeded frozen edge limit");
      const applied = V.applyGuardFree(source, move, { maxMicrostates });
      if (applied.status !== "TERMINATED") {
        throw new Error(`Independent exact transition failure ${applied.status} at ${sourceId} ${V.moveKey(move)}`);
      }
      maxMoveMicrosteps = Math.max(maxMoveMicrosteps, applied.microstepCount);
      const targetId = add(applied.state);
      const key = V.moveKey(move);
      rows.push({ key, to: targetId });
      edgeRows.push(`${sourceId}\t${key}\t${targetId}`);
    }
    movesByState.set(sourceId, rows.sort((a, b) => a.key.localeCompare(b.key)));
    if (states.size > maxStates) throw new Error("Independent graph exceeded frozen state limit");
  }

  const stateKeys = [...states.keys()].sort();
  edgeRows.sort();
  const graphNodes = stateKeys.map((id) => {
    const state = states.get(id).state;
    return { id, player: state.player, winner: state.winner, moves: movesByState.get(id) || [] };
  });
  const stateRecords = stateKeys.map((id) => ({
    stateKey: id,
    ruleState: V.rawRuleState(states.get(id).state),
  }));
  return {
    rootKeys,
    stateCount: stateKeys.length,
    edgeCount: edgeRows.length,
    maxMoveMicrosteps,
    stateSetSha256: sha256(stateKeys.join("\n")),
    transitionSetSha256: sha256(edgeRows.join("\n")),
    graphNodes,
    stateRecords,
  };
}

function solveIndependentTablebase(rootStates, options = {}) {
  const graph = buildIndependentGraph(rootStates, options);
  const solved = R.solveIndependent(graph.graphNodes);
  const rows = graph.stateRecords.map((record) => ({ ...record, ...solved.results[record.stateKey] }));
  const core = { counts: solved.counts, recurrentSccs: solved.recurrentSccs, rows };
  return {
    graph,
    solution: { ...core, solutionSha256: sha256(stableStringify(core)) },
  };
}

module.exports = { buildIndependentGraph, solveIndependentTablebase, stableStringify };
