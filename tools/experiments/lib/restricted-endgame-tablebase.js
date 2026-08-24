"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const T = require("./restricted-endgame-transition.js");
const R = require("./restricted-endgame-retrograde.js");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function buildExactGraph(rootStates, options = {}) {
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
    const id = T.directStateKey(state);
    const serialized = T.directStateSerialization(state);
    const previous = states.get(id);
    if (previous) {
      if (previous.serialized !== serialized) throw new Error(`State hash collision ${id}`);
      return id;
    }
    states.set(id, { state: E.clone(state), serialized });
    queue.push(id);
    return id;
  }

  const rootKeys = rootStates.map(add).sort();
  while (queueIndex < queue.length) {
    if (states.size > maxStates) throw new Error("Stage 1 graph exceeded frozen state limit");
    const sourceId = queue[queueIndex++];
    const source = states.get(sourceId).state;
    if (source.winner !== null) {
      movesByState.set(sourceId, []);
      continue;
    }
    if (source.phase !== "mtaji") throw new Error(`Stage 1 phase escape at ${sourceId}`);
    const moves = T.exactMtajiMoves(source).sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    if (!moves.length) throw new Error(`Nonterminal Stage 1 state has no legal move: ${sourceId}`);
    const rows = [];
    for (const move of moves) {
      if (edgeRows.length >= maxEdges) throw new Error("Stage 1 graph exceeded frozen edge limit");
      const applied = T.applyMtajiGuardFree(source, move, { administrativeMaxMicrostates: maxMicrostates });
      if (applied.status !== "TERMINATED") {
        throw new Error(`Stage 1 exact transition failure ${applied.status} at ${sourceId} ${T.moveKey(move)}`);
      }
      maxMoveMicrosteps = Math.max(maxMoveMicrosteps, applied.microstepCount);
      const targetId = add(applied.state);
      const key = T.moveKey(move);
      rows.push({ key, to: targetId });
      edgeRows.push(`${sourceId}\t${key}\t${targetId}`);
    }
    movesByState.set(sourceId, rows.sort((a, b) => a.key.localeCompare(b.key)));
    if (states.size > maxStates) throw new Error("Stage 1 graph exceeded frozen state limit");
  }

  const stateKeys = [...states.keys()].sort();
  edgeRows.sort();
  const graphNodes = stateKeys.map((id) => {
    const state = states.get(id).state;
    return {
      id,
      player: state.player,
      winner: state.winner,
      moves: movesByState.get(id) || [],
    };
  });
  const stateRecords = stateKeys.map((id) => ({
    stateKey: id,
    ruleState: T.directRuleState(states.get(id).state),
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

function solveExactTablebase(rootStates, options = {}) {
  const graph = buildExactGraph(rootStates, options);
  const solved = R.solveRetrograde(graph.graphNodes);
  const tablebaseRows = graph.stateRecords.map((record) => ({
    ...record,
    ...solved.results[record.stateKey],
  }));
  const solutionCore = {
    counts: solved.counts,
    recurrentSccs: solved.recurrentSccs,
    rows: tablebaseRows,
  };
  return {
    graph,
    solution: {
      ...solutionCore,
      solutionSha256: sha256(stableStringify(solutionCore)),
    },
  };
}

module.exports = { buildExactGraph, solveExactTablebase, stableStringify };
