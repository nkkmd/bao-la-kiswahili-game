"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const ORISC = require("../../experiments/lib/orisc-representation-production.js");

const MATERIALIZATION_ID = "PBAI-C-DQ-POPULATION-MATERIALIZATION-2026-08-26-v1";
const HASH_NAMESPACE = "PBAI-C-DQ-v1";

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function hash(parts) {
  return sha256(parts.join("|"));
}

function assignedPhase(seed, startSeed) {
  return ((seed - startSeed) % 2 === 0) ? "namua" : "mtaji";
}

function sortedMoves(state) {
  return E.moveVariants(state).slice().sort(
    (a, b) => ORISC.exactMoveKey(a).localeCompare(ORISC.exactMoveKey(b)),
  );
}

function observationCandidate(state, seed, ply, phase) {
  if (state.winner !== null || state.phase !== phase) return null;
  const moves = sortedMoves(state);
  if (moves.length < 2) return null;
  const rawKey = ORISC.stateKey(state);
  return {
    seed,
    ply,
    phase,
    rawKey,
    legalMoveCount: moves.length,
    observationRankHash: hash([
      HASH_NAMESPACE, "observation", phase, String(seed), String(ply), rawKey,
    ]),
    populationRankHash: hash([
      HASH_NAMESPACE, "population", phase, String(seed), String(ply), rawKey,
    ]),
    state: JSON.parse(JSON.stringify(state)),
  };
}

function trajectoryRoot(seed, startSeed, maximumPlies = 160) {
  const phase = assignedPhase(seed, startSeed);
  const random = seededRandom(seed);
  let state = E.initialState();
  let selected = null;
  for (let ply = 0; ply <= maximumPlies && state.winner === null; ply += 1) {
    const candidate = observationCandidate(state, seed, ply, phase);
    if (candidate && (!selected
      || candidate.observationRankHash < selected.observationRankHash
      || (candidate.observationRankHash === selected.observationRankHash && candidate.ply < selected.ply))) {
      selected = candidate;
    }
    if (ply === maximumPlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    const move = moves[Math.floor(random() * moves.length)];
    state = E.applyMove(state, move).state;
  }
  return selected;
}

function splitTarget(split) {
  if (split === "development") return 128;
  if (split === "validation") return 256;
  if (split === "releaseHoldout") return 512;
  throw new Error(`Unknown split: ${split}`);
}

function materializeSplit({ split, start, end, maximumPlies = 160 }) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
    throw new Error("Invalid source seed block");
  }
  const targetPerPhase = splitTarget(split);
  const trajectoryCandidates = [];
  for (let seed = start; seed <= end; seed += 1) {
    const root = trajectoryRoot(seed, start, maximumPlies);
    if (root) trajectoryCandidates.push(root);
  }
  const selected = {};
  for (const phase of ["namua", "mtaji"]) {
    const seenRaw = new Set();
    selected[phase] = trajectoryCandidates
      .filter((root) => root.phase === phase)
      .sort((a, b) => a.populationRankHash.localeCompare(b.populationRankHash)
        || a.seed - b.seed || a.ply - b.ply)
      .filter((root) => {
        if (seenRaw.has(root.rawKey)) return false;
        seenRaw.add(root.rawKey);
        return true;
      })
      .slice(0, targetPerPhase);
  }
  const roots = [...selected.namua, ...selected.mtaji];
  const rawKeys = new Set(roots.map((root) => root.rawKey));
  const seeds = new Set(roots.map((root) => root.seed));
  if (rawKeys.size !== roots.length) throw new Error("RAW state duplicate in selected population");
  if (seeds.size !== roots.length) throw new Error("Historical trajectory duplicate in selected population");
  return {
    schemaVersion: 1,
    materializationId: MATERIALIZATION_ID,
    split,
    sourceSeedBlock: { start, end },
    maximumPlies,
    targetPerPhase,
    trajectoryCandidates: trajectoryCandidates.length,
    support: {
      namua: selected.namua.length,
      mtaji: selected.mtaji.length,
      total: roots.length,
    },
    roots,
  };
}

function rootRef(root) {
  return { seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey };
}

function populationDigest(population) {
  return sha256(JSON.stringify({
    materializationId: population.materializationId,
    split: population.split,
    sourceSeedBlock: population.sourceSeedBlock,
    maximumPlies: population.maximumPlies,
    roots: population.roots.map(rootRef),
  }));
}

module.exports = {
  HASH_NAMESPACE,
  MATERIALIZATION_ID,
  assignedPhase,
  materializeSplit,
  populationDigest,
  rootRef,
  seededRandom,
  sortedMoves,
  trajectoryRoot,
};
