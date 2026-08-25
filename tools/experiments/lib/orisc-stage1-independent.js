"use strict";

const crypto = require("node:crypto");
const IV = require("./restricted-endgame-independent-verifier.js");
const R = require("./orisc-representation-independent.js");

function digest(text) {
  const h = crypto.createHash("sha256");
  h.update(Buffer.from(text, "utf8"));
  return h.digest("hex");
}

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function rebuild(rootInput, options = {}) {
  const stateCeiling = options.maximumStates ?? 1000;
  const edgeCeiling = options.maximumEdges ?? 10000;
  const relayCeiling = options.administrativeMaximumMoveMicrostates ?? 1000000;
  const records = Object.create(null);
  const pendingKeys = [];
  const edgeObjects = [];
  let next = 0;
  let maxMicrosteps = 0;

  function register(state) {
    const raw = R.project(state);
    const serialization = R.serialize(raw);
    const key = R.key(raw);
    if (records[key]) {
      if (records[key].serialization !== serialization) throw new Error(`ORISC independent hash collision ${key}`);
      return key;
    }
    records[key] = {
      raw,
      serialization,
      executionState: { ...deepCopy(raw), reason: state.reason || "", turn: state.turn ?? null },
    };
    pendingKeys.push(key);
    return key;
  }

  const rootKey = register(deepCopy(rootInput));
  while (next < pendingKeys.length) {
    if (Object.keys(records).length > stateCeiling) throw new Error("ORISC independent state ceiling exceeded");
    const sourceKey = pendingKeys[next++];
    const source = records[sourceKey].executionState;
    if (source.winner !== null) continue;
    if (source.phase !== "mtaji") throw new Error(`ORISC independent phase escape ${sourceKey}`);
    const moves = IV.legalMtajiMoves(source)
      .map((move) => deepCopy(move))
      .sort((a, b) => R.moveIdentity(a).localeCompare(R.moveIdentity(b)));
    if (moves.length === 0) throw new Error(`ORISC independent nonterminal state has no move ${sourceKey}`);
    for (const move of moves) {
      if (edgeObjects.length >= edgeCeiling) throw new Error("ORISC independent edge ceiling exceeded");
      const applied = IV.applyGuardFree(source, move, { maxMicrostates: relayCeiling });
      if (applied.status !== "TERMINATED") throw new Error(`ORISC independent transition technical failure ${applied.status}`);
      if (applied.microstepCount > maxMicrosteps) maxMicrosteps = applied.microstepCount;
      const targetKey = register(applied.state);
      edgeObjects.push({ sourceKey, moveKey: R.moveIdentity(move), targetKey });
    }
  }

  const stateKeys = Object.keys(records).sort();
  const edgeLines = edgeObjects
    .map((edge) => `${edge.sourceKey}\t${edge.moveKey}\t${edge.targetKey}`)
    .sort();
  edgeObjects.sort((a, b) => `${a.sourceKey}\t${a.moveKey}\t${a.targetKey}`.localeCompare(`${b.sourceKey}\t${b.moveKey}\t${b.targetKey}`));
  const rows = stateKeys.map((stateKey) => ({
    stateKey,
    ruleState: records[stateKey].raw,
    serialization: records[stateKey].serialization,
    representedSeeds: R.seedCount(records[stateKey].raw),
    terminal: records[stateKey].raw.winner !== null,
  }));

  return {
    rootKey,
    stateCount: stateKeys.length,
    edgeCount: edgeLines.length,
    stateSetSha256: digest(stateKeys.join("\n")),
    transitionSetSha256: digest(edgeLines.join("\n")),
    maximumMoveMicrostepsObserved: maxMicrosteps,
    rows,
    edges: edgeObjects,
  };
}

function replayFrozenWitness(domain) {
  const S0 = require("./restricted-endgame-stage0.js");
  const root = domain.roots[0];
  const trajectory = S0.generateTechnicalTrajectory(root.seed, root.ply);
  const candidate = trajectory.roots.find((row) => row.rootStateKey === root.rootStateKey && row.ply === root.ply);
  if (!candidate) return { passed: false, reason: "ROOT-NOT-REGENERATED", state: null, rootKey: null };
  const regeneratedKey = R.key(candidate.state);
  return {
    passed: regeneratedKey === root.rootStateKey,
    reason: regeneratedKey === root.rootStateKey ? "PASS" : "ROOT-KEY-MISMATCH",
    state: deepCopy(candidate.state),
    rootKey: regeneratedKey,
  };
}

module.exports = {
  rebuild,
  replayFrozenWitness,
};
