"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const T = require("./restricted-endgame-transition.js");
const R = require("./orisc-representation-production.js");

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function reconstruct(rootInput, options = {}) {
  const maximumStates = options.maximumStates ?? 1000;
  const maximumEdges = options.maximumEdges ?? 10000;
  const administrativeMaximumMoveMicrostates = options.administrativeMaximumMoveMicrostates ?? 1000000;
  const states = new Map();
  const queue = [];
  const edgeRows = [];
  const edges = [];
  let cursor = 0;
  let maximumMoveMicrostepsObserved = 0;

  function add(state) {
    const raw = R.rawRuleState(state);
    const serialized = R.stateSerialization(raw);
    const key = R.stateKey(raw);
    const previous = states.get(key);
    if (previous) {
      if (previous.serialization !== serialized) throw new Error(`ORISC production hash collision ${key}`);
      return key;
    }
    states.set(key, {
      state: { ...clone(raw), reason: state.reason || "", turn: state.turn ?? null },
      raw,
      serialization: serialized,
    });
    queue.push(key);
    return key;
  }

  const root = clone(rootInput);
  const rootKey = add(root);

  while (cursor < queue.length) {
    if (states.size > maximumStates) throw new Error("ORISC production state limit exceeded");
    const sourceKey = queue[cursor++];
    const source = states.get(sourceKey).state;
    if (source.winner !== null) continue;
    if (source.phase !== "mtaji") throw new Error(`ORISC production phase escape ${sourceKey}`);
    const moves = T.exactMtajiMoves(source)
      .map((move) => clone(move))
      .sort((a, b) => R.exactMoveKey(a).localeCompare(R.exactMoveKey(b)));
    if (!moves.length) throw new Error(`ORISC production nonterminal state has no move ${sourceKey}`);
    for (const move of moves) {
      if (edges.length >= maximumEdges) throw new Error("ORISC production edge limit exceeded");
      const applied = T.applyMtajiGuardFree(source, move, {
        administrativeMaxMicrostates: administrativeMaximumMoveMicrostates,
      });
      if (applied.status !== "TERMINATED") {
        throw new Error(`ORISC production transition technical failure ${applied.status}`);
      }
      maximumMoveMicrostepsObserved = Math.max(maximumMoveMicrostepsObserved, applied.microstepCount);
      const targetKey = add(applied.state);
      const moveKey = R.exactMoveKey(move);
      edgeRows.push(`${sourceKey}\t${moveKey}\t${targetKey}`);
      edges.push({ sourceKey, moveKey, targetKey });
    }
  }

  const stateKeys = [...states.keys()].sort();
  edgeRows.sort();
  edges.sort((a, b) => `${a.sourceKey}\t${a.moveKey}\t${a.targetKey}`.localeCompare(`${b.sourceKey}\t${b.moveKey}\t${b.targetKey}`));
  const rows = stateKeys.map((key) => {
    const record = states.get(key);
    return {
      stateKey: key,
      ruleState: record.raw,
      serialization: record.serialization,
      representedSeeds: R.representedSeeds(record.raw),
      terminal: record.raw.winner !== null,
    };
  });
  return {
    rootKey,
    stateCount: stateKeys.length,
    edgeCount: edgeRows.length,
    stateSetSha256: sha256(stateKeys.join("\n")),
    transitionSetSha256: sha256(edgeRows.join("\n")),
    maximumMoveMicrostepsObserved,
    rows,
    edges,
  };
}

function replayFrozenWitness(domain) {
  const S0 = require("./restricted-endgame-stage0.js");
  const root = domain.roots[0];
  const trajectory = S0.generateTechnicalTrajectory(root.seed, root.ply);
  const candidate = trajectory.roots.find((row) => row.rootStateKey === root.rootStateKey && row.ply === root.ply);
  if (!candidate) return { passed: false, reason: "ROOT-NOT-REGENERATED", state: null, rootKey: null };
  const regeneratedKey = R.stateKey(candidate.state);
  return {
    passed: regeneratedKey === root.rootStateKey,
    reason: regeneratedKey === root.rootStateKey ? "PASS" : "ROOT-KEY-MISMATCH",
    state: clone(candidate.state),
    rootKey: regeneratedKey,
  };
}

module.exports = {
  reconstruct,
  replayFrozenWitness,
};
