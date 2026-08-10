"use strict";

const {
  analyzeCandidate,
  extractForcedCaptureRegimes,
  groupByGame,
} = require("./forced-capture-regimes.js");
const { stableStringify } = require("./position-typology-features.js");

const FROZEN_EXPANSION_SETTINGS = Object.freeze({
  before: 3,
  after: 8,
  expansionDelta: 3,
  convergenceDelta: -2,
  persistenceFraction: 0.5,
  eventWindow: 8,
});

function playerIndexedPair(observation, actorValue, opponentValue) {
  return observation.player === 0
    ? [actorValue, opponentValue]
    : [opponentValue, actorValue];
}

function toLegacyPhaseTransitionObservation(observation) {
  const actor = observation.features.actor;
  const opponent = observation.features.opponent;
  return {
    ...(observation.gameId === undefined ? {} : { gameId: observation.gameId }),
    ...(observation.conditionId === undefined ? {} : { conditionId: observation.conditionId }),
    ...(observation.seed === undefined ? {} : { seed: observation.seed }),
    ply: observation.ply,
    player: observation.player,
    phase: observation.phase,
    winner: observation.winner,
    reason: observation.reason,
    stateHash: observation.identity.historicalStateHash,
    reserve: [...observation.state.reserve],
    houseOwned: [...observation.state.houseOwned],
    pending: [...observation.state.pending],
    legalMoveCount: actor.legalMoveCount,
    captureMoveCount: actor.captureMoveCount,
    nonCaptureMoveCount: actor.legalMoveCount - actor.captureMoveCount,
    forcedCapture: actor.forcedCapture,
    boardSeedCount: observation.features.global.boardSeedCount,
    nonEmptyPitCount: observation.features.global.nonEmptyPitCount,
    frontRow: {
      occupiedPits: playerIndexedPair(observation, actor.frontOccupied, opponent.frontOccupied),
      occupancyRate: playerIndexedPair(observation, actor.frontOccupied / 8, opponent.frontOccupied / 8),
      seedCount: playerIndexedPair(observation, actor.frontSeeds, opponent.frontSeeds),
    },
  };
}

function assertLegacyCompatibility(observation, legacyObservation) {
  const adapted = toLegacyPhaseTransitionObservation(observation);
  const fields = [
    "gameId", "conditionId", "seed", "ply", "player", "phase", "winner", "reason",
    "stateHash", "reserve", "houseOwned", "pending", "legalMoveCount", "captureMoveCount",
    "nonCaptureMoveCount", "forcedCapture", "boardSeedCount", "nonEmptyPitCount", "frontRow",
  ];
  for (const field of fields) {
    if (stableStringify(adapted[field]) !== stableStringify(legacyObservation[field])) {
      throw new Error(`Legacy phase-transition compatibility mismatch: ${field}`);
    }
  }
  return true;
}

function sortedObservations(observations) {
  return [...observations].sort((a, b) => Number(a.ply) - Number(b.ply));
}

function firstMtajiObservation(observations) {
  return sortedObservations(observations).find((row) => row.phase === "mtaji") || null;
}

function firstTerminalObservation(observations) {
  return sortedObservations(observations).find((row) => row.terminal === true) || null;
}

function validatePhaseMonotonicity(observations) {
  let seenMtaji = false;
  for (const row of sortedObservations(observations)) {
    if (row.phase === "mtaji") seenMtaji = true;
    if (seenMtaji && row.phase === "namua") {
      throw new Error(`Mtaji-to-Namua phase reversion at ply ${row.ply}`);
    }
  }
  return true;
}

function summarizeTemporalOutcome(observations, maxPly) {
  const rows = sortedObservations(observations);
  if (!rows.length) throw new Error("Cannot summarize empty observation sequence");
  validatePhaseMonotonicity(rows);
  const mtaji = firstMtajiObservation(rows);
  const terminal = firstTerminalObservation(rows);
  const maxObservedPly = Number(rows.at(-1).ply);
  const firstMtajiPly = mtaji ? Number(mtaji.ply) : null;
  const terminalPly = terminal ? Number(terminal.ply) : null;
  return {
    firstMtajiPly,
    terminalPly,
    maxObservedPly,
    reachedMtaji: firstMtajiPly !== null,
    terminalBeforeMtaji: terminalPly !== null && (firstMtajiPly === null || terminalPly < firstMtajiPly),
    administrativeTruncation: terminalPly === null && maxObservedPly >= Number(maxPly),
    firstMtajiMorphologyEligible: Boolean(
      mtaji && mtaji.terminal === false && Number(mtaji.ply) >= 8
    ),
  };
}

function analyzeFrozenCandidate(candidate, observations) {
  const legacyRows = sortedObservations(observations).map(toLegacyPhaseTransitionObservation);
  const games = groupByGame(legacyRows);
  const regimes = extractForcedCaptureRegimes(legacyRows);
  return analyzeCandidate(candidate, games, regimes, FROZEN_EXPANSION_SETTINGS);
}

function candidateAscertainment(metrics, observations) {
  const rows = sortedObservations(observations);
  if (!rows.length) throw new Error("Cannot ascertain candidate in empty sequence");
  const candidatePly = Number(metrics.candidatePly);
  const lookAheadPly = candidatePly + FROZEN_EXPANSION_SETTINGS.after;
  const maxObservedPly = Number(rows.at(-1).ply);
  const mtaji = firstMtajiObservation(rows);
  const terminal = firstTerminalObservation(rows);
  return {
    candidatePly,
    classification: metrics.classification,
    classificationLookAheadPly: lookAheadPly,
    classificationKnownByPly: maxObservedPly >= lookAheadPly ? lookAheadPly : null,
    firstMtajiPly: mtaji ? Number(mtaji.ply) : null,
    firstForcingReleasePly: metrics.distanceToForcingRelease === null
      ? null
      : candidatePly + Number(metrics.distanceToForcingRelease),
    terminalPly: terminal ? Number(terminal.ply) : null,
    maxObservedPly,
  };
}

module.exports = {
  FROZEN_EXPANSION_SETTINGS,
  analyzeFrozenCandidate,
  assertLegacyCompatibility,
  candidateAscertainment,
  firstMtajiObservation,
  firstTerminalObservation,
  summarizeTemporalOutcome,
  toLegacyPhaseTransitionObservation,
  validatePhaseMonotonicity,
};
