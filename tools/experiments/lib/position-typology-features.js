"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const { stateHash: historicalStateHash } = require("./phase-transition-features.js");
const { mirrorState } = require("../../symmetry/transform-candidates.js");

const SCHEMA_VERSION = "1.0.0";

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function hashValue(value) {
  return crypto.createHash("sha256").update(stableStringify(value)).digest("hex");
}

function clonePits(pits) {
  return pits.map((rows) => rows.map((row) => row.slice()));
}

function ruleState(state) {
  return {
    pits: clonePits(state.pits),
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: [...(state.pending || [0, 0])],
  };
}

function identityKeys(state) {
  const directRuleState = ruleState(state);
  const seatSwappedRuleState = ruleState(mirrorState(state));
  const direct = hashValue(directRuleState);
  const seatSwap = hashValue(seatSwappedRuleState);
  return {
    historicalStateHash: historicalStateHash(state),
    ruleStateKey: direct,
    seatCanonicalKey: direct <= seatSwap ? direct : seatSwap,
    seatCanonicalTransform: direct <= seatSwap ? "direct" : "seat-swap",
  };
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function mean(values) {
  return values.length ? sum(values) / values.length : 0;
}

function variance(values) {
  if (!values.length) return 0;
  const center = mean(values);
  return mean(values.map((value) => (value - center) ** 2));
}

function occupied(values) {
  return values.filter((value) => value > 0).length;
}

function frontConnections(front) {
  let result = 0;
  for (let index = 0; index < front.length - 1; index += 1) {
    if (front[index] > 0 && front[index + 1] > 0) result += 1;
  }
  return result;
}

function playerView(state, player) {
  if (state.player === player) return state;
  return { ...E.clone(state), player };
}

function moveMorphology(state, moves) {
  const rows = moves.map((move) => {
    const events = E.applyMove(state, move).events;
    const captureEvents = events.filter(({ kind }) => kind === "capture");
    const relayEvents = events.filter(({ kind }) => kind === "relay");
    return {
      capturedSeeds: sum(captureEvents.map(({ count }) => count || 0)),
      captureEvents: captureEvents.length,
      relayEvents: relayEvents.length,
      chainEvents: captureEvents.length + relayEvents.length,
    };
  });
  const captureRows = rows.filter((_, index) => moves[index]?.type === "capture");
  const values = (selected, field) => selected.map((row) => row[field]);
  return {
    maxCapturableSeeds: captureRows.length ? Math.max(...values(captureRows, "capturedSeeds")) : 0,
    meanCapturableSeeds: mean(values(captureRows, "capturedSeeds")),
    maxCaptureEvents: rows.length ? Math.max(...values(rows, "captureEvents")) : 0,
    meanCaptureEvents: mean(values(rows, "captureEvents")),
    maxRelayEvents: rows.length ? Math.max(...values(rows, "relayEvents")) : 0,
    meanRelayEvents: mean(values(rows, "relayEvents")),
    maxChainEvents: rows.length ? Math.max(...values(rows, "chainEvents")) : 0,
    meanChainEvents: mean(values(rows, "chainEvents")),
  };
}

function playerFeatures(state, player) {
  const view = playerView(state, player);
  const front = state.pits[player][E.FRONT];
  const back = state.pits[player][E.BACK];
  const all = [...front, ...back];
  const moves = E.moveVariants(view);
  const captures = moves.filter(({ type }) => type === "capture");
  const boardSeeds = sum(all);
  const morphology = moveMorphology(view, moves);
  return {
    reserve: state.reserve[player],
    houseOwned: Boolean(state.houseOwned[player]),
    nyumbaSeeds: front[E.HOUSE],
    boardSeeds,
    frontSeeds: sum(front),
    backSeeds: sum(back),
    occupiedPits: occupied(all),
    frontOccupied: occupied(front),
    backOccupied: occupied(back),
    reusablePits: all.filter((value) => value >= 2).length,
    frontConnections: frontConnections(front),
    legalMoveCount: moves.length,
    captureMoveCount: captures.length,
    forcedCapture: moves.length > 0 && captures.length === moves.length,
    maxPitSeeds: all.length ? Math.max(...all) : 0,
    pitSeedVariance: variance(all),
    seedConcentration: boardSeeds > 0 ? sum(all.map((value) => value ** 2)) / (boardSeeds ** 2) : 0,
    ...morphology,
  };
}

const DIFFERENCE_FIELDS = Object.freeze([
  "reserve", "nyumbaSeeds", "boardSeeds", "frontSeeds", "backSeeds",
  "occupiedPits", "frontOccupied", "backOccupied", "reusablePits", "frontConnections",
  "legalMoveCount", "captureMoveCount", "maxCapturableSeeds", "meanCapturableSeeds",
  "maxCaptureEvents", "meanCaptureEvents", "maxRelayEvents", "meanRelayEvents",
  "maxChainEvents", "meanChainEvents", "maxPitSeeds", "pitSeedVariance", "seedConcentration",
]);

function featureDifference(actor, opponent) {
  return Object.fromEntries(DIFFERENCE_FIELDS.map((field) => [field, actor[field] - opponent[field]]));
}

function extractPositionTypologyObservation(state, context = {}) {
  const before = stableStringify(state);
  const actor = playerFeatures(state, state.player);
  const opponent = playerFeatures(state, 1 - state.player);
  const allPits = state.pits.flat(2);
  const observation = {
    schemaVersion: SCHEMA_VERSION,
    ...(context.gameId === undefined ? {} : { gameId: context.gameId }),
    ...(context.conditionId === undefined ? {} : { conditionId: context.conditionId }),
    ...(context.seed === undefined ? {} : { seed: context.seed }),
    ply: context.ply ?? 0,
    player: state.player,
    phase: state.phase,
    turn: state.turn,
    terminal: state.winner !== null,
    winner: state.winner,
    reason: state.reason || "",
    state: {
      pits: clonePits(state.pits),
      reserve: [...state.reserve],
      houseOwned: [...state.houseOwned],
      pending: [...(state.pending || [0, 0])],
    },
    identity: identityKeys(state),
    features: {
      actor,
      opponent,
      difference: featureDifference(actor, opponent),
      global: {
        boardSeedCount: sum(allPits),
        nonEmptyPitCount: occupied(allPits),
      },
    },
  };
  if (stableStringify(state) !== before) throw new Error("Position typology feature extraction mutated source state");
  validateObservation(observation);
  return observation;
}

function assertHash(value, label) {
  if (typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value)) {
    throw new Error(`Invalid ${label}`);
  }
}

function assertPair(value, label) {
  if (!Array.isArray(value) || value.length !== 2) throw new Error(`Invalid ${label}`);
}

function validateObservation(observation) {
  if (!observation || observation.schemaVersion !== SCHEMA_VERSION) throw new Error("Invalid schemaVersion");
  if (!Number.isInteger(observation.ply) || observation.ply < 0) throw new Error("Invalid ply");
  if (![0, 1].includes(observation.player)) throw new Error("Invalid player");
  if (!["namua", "mtaji"].includes(observation.phase)) throw new Error("Invalid phase");
  if (!observation.state || !Array.isArray(observation.state.pits)
    || observation.state.pits.length !== 2
    || observation.state.pits.some((rows) => !Array.isArray(rows) || rows.length !== 2
      || rows.some((row) => !Array.isArray(row) || row.length !== 8))) {
    throw new Error("Invalid pits");
  }
  assertPair(observation.state.reserve, "reserve");
  assertPair(observation.state.houseOwned, "houseOwned");
  assertPair(observation.state.pending, "pending");
  if (!observation.identity) throw new Error("Missing identity");
  assertHash(observation.identity.historicalStateHash, "historicalStateHash");
  assertHash(observation.identity.ruleStateKey, "ruleStateKey");
  assertHash(observation.identity.seatCanonicalKey, "seatCanonicalKey");
  if (!["direct", "seat-swap"].includes(observation.identity.seatCanonicalTransform)) {
    throw new Error("Invalid seatCanonicalTransform");
  }
  for (const side of ["actor", "opponent"]) {
    if (!observation.features?.[side]) throw new Error(`Missing ${side} features`);
    for (const field of ["legalMoveCount", "captureMoveCount", "maxCapturableSeeds", "maxRelayEvents"]) {
      if (!Number.isFinite(observation.features[side][field]) || observation.features[side][field] < 0) {
        throw new Error(`Invalid ${side}.${field}`);
      }
    }
  }
  return true;
}

module.exports = {
  DIFFERENCE_FIELDS,
  SCHEMA_VERSION,
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
  playerFeatures,
  ruleState,
  stableStringify,
  validateObservation,
};
