"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const { seededRandom } = require("../../benchmark.js");
const T = require("./restricted-endgame-transition.js");

const DEFAULT_TECHNICAL_SEED_BASE = 22_800_001;
const DEFAULT_TECHNICAL_GAMES = 256;
const DEFAULT_MAX_PLY = 240;
const NON_EMPTY_CAPS = Object.freeze([8, 10, 12, 14]);
const LEGAL_MOVE_CAPS = Object.freeze([2, 4, 6]);
const ROOT_PREFIX_SIZES = Object.freeze([1, 2, 4]);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

function nonEmptyPitCount(state) {
  return state.pits.flat(2).filter((value) => value > 0).length;
}

function totalKete(state) {
  return sum(state.pits.flat(2))
    + sum(state.reserve)
    + sum(state.pending || [0, 0]);
}

function baseRootEligible(state) {
  if (state.phase !== "mtaji" || state.winner !== null) return false;
  if (state.reserve[0] !== 0 || state.reserve[1] !== 0) return false;
  if (state.houseOwned[0] || state.houseOwned[1]) return false;
  if ((state.pending?.[0] || 0) !== 0 || (state.pending?.[1] || 0) !== 0) return false;
  if (totalKete(state) !== 64) return false;
  if (!state.pits[0][E.FRONT].some((value) => value > 0)) return false;
  if (!state.pits[1][E.FRONT].some((value) => value > 0)) return false;
  return T.exactMtajiMoves(state).length > 0;
}

function exactVariants(state) {
  return E.moveVariants(state)
    .map((move) => JSON.parse(JSON.stringify(move)))
    .sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
}

function replayWitness(witness) {
  if (!witness || !Array.isArray(witness.moves) || typeof witness.rootStateKey !== "string") {
    throw new Error("Invalid witness");
  }
  let state = E.initialState();
  for (let ply = 0; ply < witness.moves.length; ply += 1) {
    const row = witness.moves[ply];
    const legal = exactVariants(state);
    const move = legal.find((candidate) => T.moveKey(candidate) === row.moveKey);
    if (!move) return { passed: false, reason: "MOVE-NOT-LEGAL", ply };
    const result = E.applyMove(state, move).state;
    if (result.reason === "relay-limit") {
      return { passed: false, reason: "RUNTIME-RELAY-GUARD", ply };
    }
    state = result;
    if (T.directStateKey(state) !== row.afterStateKey) {
      return { passed: false, reason: "AFTER-STATE-MISMATCH", ply };
    }
  }
  const rootStateKey = T.directStateKey(state);
  return {
    passed: rootStateKey === witness.rootStateKey,
    reason: rootStateKey === witness.rootStateKey ? "PASS" : "ROOT-MISMATCH",
    rootStateKey,
    state,
  };
}

function generateTechnicalTrajectory(seed, maxPly = DEFAULT_MAX_PLY) {
  if (!Number.isInteger(seed)) throw new Error("Invalid technical seed");
  const random = seededRandom(seed);
  let state = E.initialState();
  const witnessMoves = [];
  const roots = [];

  for (let ply = 0; ply <= maxPly; ply += 1) {
    if (baseRootEligible(state)) {
      const rootStateKey = T.directStateKey(state);
      const legalMoveCount = T.exactMtajiMoves(state).length;
      roots.push({
        rootStateKey,
        state: E.clone(state),
        seed,
        ply,
        nonEmptyPitCount: nonEmptyPitCount(state),
        legalMoveCount,
        witness: {
          seed,
          rootPly: ply,
          rootStateKey,
          moves: witnessMoves.map((row) => ({ ...row, move: E.clone(row.move) })),
        },
      });
    }

    if (state.winner !== null || ply === maxPly) break;
    const moves = exactVariants(state);
    if (!moves.length) throw new Error(`Canonical running state has no move at seed ${seed} ply ${ply}`);
    const index = Math.min(moves.length - 1, Math.floor(random() * moves.length));
    const move = moves[index];
    const beforeStateKey = T.directStateKey(state);
    const next = E.applyMove(state, move).state;
    const afterStateKey = T.directStateKey(next);
    witnessMoves.push({
      ply,
      move: E.clone(move),
      moveKey: T.moveKey(move),
      beforeStateKey,
      afterStateKey,
    });
    state = next;
    if (state.reason === "relay-limit") break;
  }

  return { seed, roots };
}

function scanWitnessRoots(options = {}) {
  const seedBase = options.seedBase ?? DEFAULT_TECHNICAL_SEED_BASE;
  const games = options.games ?? DEFAULT_TECHNICAL_GAMES;
  const maxPly = options.maxPly ?? DEFAULT_MAX_PLY;
  if (!Number.isInteger(games) || games < 1) throw new Error("Invalid games");
  if (!Number.isInteger(maxPly) || maxPly < 1) throw new Error("Invalid maxPly");

  const unique = new Map();
  for (let gameIndex = 0; gameIndex < games; gameIndex += 1) {
    const seed = seedBase + gameIndex;
    const trajectory = generateTechnicalTrajectory(seed, maxPly);
    for (const root of trajectory.roots) {
      if (!unique.has(root.rootStateKey)) unique.set(root.rootStateKey, root);
    }
  }
  const roots = [...unique.values()].sort((a, b) => a.rootStateKey.localeCompare(b.rootStateKey));
  for (const root of roots) {
    const verification = replayWitness(root.witness);
    if (!verification.passed) {
      throw new Error(`Witness replay failed for ${root.rootStateKey}: ${verification.reason}`);
    }
  }
  return {
    technicalOnly: true,
    scientificOutcomeGenerationAuthorized: false,
    seedBase,
    seedEnd: seedBase + games - 1,
    games,
    maxPly,
    uniqueWitnessRoots: roots.length,
    roots,
  };
}

function rootSetKey(rootKeys) {
  return sha256([...rootKeys].sort().join("\n"));
}

function buildCandidatePlans(roots) {
  const bySet = new Map();
  for (const nonEmptyCap of NON_EMPTY_CAPS) {
    for (const legalMoveCap of LEGAL_MOVE_CAPS) {
      const eligible = roots.filter(
        (root) => root.nonEmptyPitCount <= nonEmptyCap && root.legalMoveCount <= legalMoveCap,
      );
      for (const prefixSize of ROOT_PREFIX_SIZES) {
        if (eligible.length < prefixSize) continue;
        const selected = eligible.slice(0, prefixSize);
        const rootKeys = selected.map((root) => root.rootStateKey);
        const setKey = rootSetKey(rootKeys);
        const origin = { nonEmptyCap, legalMoveCap, prefixSize };
        if (!bySet.has(setKey)) {
          bySet.set(setKey, {
            planKey: setKey,
            rootKeys,
            roots: selected,
            origins: [origin],
          });
        } else {
          bySet.get(setKey).origins.push(origin);
        }
      }
    }
  }
  return [...bySet.values()].sort((a, b) => {
    const ao = a.origins[0];
    const bo = b.origins[0];
    return ao.nonEmptyCap - bo.nonEmptyCap
      || ao.legalMoveCap - bo.legalMoveCap
      || ao.prefixSize - bo.prefixSize
      || a.planKey.localeCompare(b.planKey);
  });
}

function addState(states, state, queue) {
  const key = T.directStateKey(state);
  const serialized = T.directStateSerialization(state);
  if (states.has(key)) {
    if (states.get(key).serialized !== serialized) throw new Error(`State hash collision at ${key}`);
    return { key, added: false };
  }
  states.set(key, { state: E.clone(state), serialized });
  queue.push(key);
  return { key, added: true };
}

function summarizeBranching(branchCounts) {
  if (!branchCounts.length) return { expandedStates: 0, min: 0, max: 0, mean: 0 };
  return {
    expandedStates: branchCounts.length,
    min: Math.min(...branchCounts),
    max: Math.max(...branchCounts),
    mean: sum(branchCounts) / branchCounts.length,
  };
}

/**
 * Enumerate the complete raw forward closure from a technical root set.
 * This function deliberately does not import or call the retrograde solver.
 */
function enumerateClosure(rootStates, options = {}) {
  const maxStates = options.maxStates ?? 1_000_000;
  const maxEdges = options.maxEdges ?? 10_000_000;
  const administrativeMaxMicrostates = options.administrativeMaxMicrostates ?? 1_000_000;
  const states = new Map();
  const queue = [];
  const edgeRows = [];
  const branchCounts = [];
  let queueIndex = 0;
  let maxMoveMicrosteps = 0;

  for (const root of rootStates) addState(states, root, queue);
  const rootKeys = rootStates.map((state) => T.directStateKey(state)).sort();

  while (queueIndex < queue.length) {
    if (states.size > maxStates) {
      return {
        complete: false,
        technicalStopReason: "STATE-LIMIT",
        rootKeys,
        stateCountObserved: states.size,
        edgeCountObserved: edgeRows.length,
      };
    }
    const sourceKey = queue[queueIndex];
    queueIndex += 1;
    const source = states.get(sourceKey).state;
    if (source.winner !== null) continue;
    if (source.phase !== "mtaji") {
      return {
        complete: false,
        technicalStopReason: "PHASE-ESCAPE",
        sourceKey,
        rootKeys,
        stateCountObserved: states.size,
        edgeCountObserved: edgeRows.length,
      };
    }
    const moves = T.exactMtajiMoves(source)
      .sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    if (!moves.length) {
      return {
        complete: false,
        technicalStopReason: "NONCANONICAL-NO-MOVE",
        sourceKey,
        rootKeys,
        stateCountObserved: states.size,
        edgeCountObserved: edgeRows.length,
      };
    }
    branchCounts.push(moves.length);

    for (const move of moves) {
      if (edgeRows.length >= maxEdges) {
        return {
          complete: false,
          technicalStopReason: "EDGE-LIMIT",
          rootKeys,
          stateCountObserved: states.size,
          edgeCountObserved: edgeRows.length,
        };
      }
      const applied = T.applyMtajiGuardFree(source, move, { administrativeMaxMicrostates });
      maxMoveMicrosteps = Math.max(maxMoveMicrosteps, applied.microstepCount);
      if (applied.status !== "TERMINATED") {
        return {
          complete: false,
          technicalStopReason: applied.status,
          sourceKey,
          moveKey: T.moveKey(move),
          repeatedMicrostateHash: applied.repeatedMicrostateHash,
          rootKeys,
          stateCountObserved: states.size,
          edgeCountObserved: edgeRows.length,
          maxMoveMicrosteps,
        };
      }
      const successor = addState(states, applied.state, queue);
      edgeRows.push(`${sourceKey}\t${T.moveKey(move)}\t${successor.key}`);
      if (states.size > maxStates) {
        return {
          complete: false,
          technicalStopReason: "STATE-LIMIT",
          rootKeys,
          stateCountObserved: states.size,
          edgeCountObserved: edgeRows.length,
          maxMoveMicrosteps,
        };
      }
    }
  }

  const stateKeys = [...states.keys()].sort();
  edgeRows.sort();
  return {
    complete: true,
    technicalStopReason: null,
    rootKeys,
    stateCount: stateKeys.length,
    edgeCount: edgeRows.length,
    branching: summarizeBranching(branchCounts),
    maxMoveMicrosteps,
    stateSetSha256: sha256(stateKeys.join("\n")),
    transitionSetSha256: sha256(edgeRows.join("\n")),
  };
}

function benchmarkPlans(scan, options = {}) {
  const plans = buildCandidatePlans(scan.roots);
  return plans.map((plan) => {
    const started = process.hrtime.bigint();
    const closure = enumerateClosure(plan.roots.map((root) => root.state), options);
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    return {
      planKey: plan.planKey,
      origins: plan.origins,
      rootKeys: plan.rootKeys,
      closure,
      elapsedMs,
    };
  });
}

module.exports = {
  DEFAULT_MAX_PLY,
  DEFAULT_TECHNICAL_GAMES,
  DEFAULT_TECHNICAL_SEED_BASE,
  LEGAL_MOVE_CAPS,
  NON_EMPTY_CAPS,
  ROOT_PREFIX_SIZES,
  baseRootEligible,
  benchmarkPlans,
  buildCandidatePlans,
  enumerateClosure,
  generateTechnicalTrajectory,
  nonEmptyPitCount,
  replayWitness,
  scanWitnessRoots,
  totalKete,
};
