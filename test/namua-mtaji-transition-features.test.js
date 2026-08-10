"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const { extractPhaseTransitionFeatures } = require("../tools/experiments/lib/phase-transition-features.js");
const { extractPositionTypologyObservation } = require("../tools/experiments/lib/position-typology-features.js");
const {
  FROZEN_EXPANSION_SETTINGS,
  analyzeFrozenCandidate,
  assertLegacyCompatibility,
  candidateAscertainment,
  summarizeTemporalOutcome,
  toLegacyPhaseTransitionObservation,
} = require("../tools/experiments/lib/namua-mtaji-transition-features.js");

function fakeObservation(ply, {
  phase = "namua",
  captureMoveCount = 1,
  forcedCapture = true,
  terminal = false,
} = {}) {
  return {
    gameId: "fixture",
    conditionId: "fixture",
    seed: 1,
    ply,
    player: ply % 2,
    phase,
    terminal,
    winner: terminal ? 0 : null,
    reason: terminal ? "fixture-terminal" : "",
    state: {
      reserve: phase === "mtaji" ? [0, 0] : [10, 10],
      houseOwned: [true, true],
      pending: [0, 0],
    },
    identity: { historicalStateHash: "0".repeat(64) },
    features: {
      actor: {
        legalMoveCount: Math.max(1, captureMoveCount),
        captureMoveCount,
        forcedCapture,
        frontOccupied: 3,
        frontSeeds: 10,
      },
      opponent: {
        frontOccupied: 3,
        frontSeeds: 10,
      },
      global: { boardSeedCount: 64, nonEmptyPitCount: 12 },
    },
  };
}

(function initialStateCompatibility() {
  const state = E.initialState();
  const position = extractPositionTypologyObservation(state, {
    gameId: "initial",
    conditionId: "C0",
    seed: 1,
    ply: 0,
  });
  const legacy = extractPhaseTransitionFeatures(state, {
    gameId: "initial",
    conditionId: "C0",
    seed: 1,
    ply: 0,
    previousStateHash: null,
  });
  assert.equal(assertLegacyCompatibility(position, legacy), true);
  const adapted = toLegacyPhaseTransitionObservation(position);
  assert.equal(adapted.captureMoveCount, legacy.captureMoveCount);
  assert.deepEqual(adapted.frontRow, legacy.frontRow);
})();

(function frozenSettingsStayExact() {
  assert.deepEqual(FROZEN_EXPANSION_SETTINGS, {
    before: 3,
    after: 8,
    expansionDelta: 3,
    convergenceDelta: -2,
    persistenceFraction: 0.5,
    eventWindow: 8,
  });
})();

(function expansionFixture() {
  const observations = Array.from({ length: 14 }, (_, ply) => fakeObservation(ply, {
    captureMoveCount: ply >= 4 && ply <= 12 ? 4 : 1,
    forcedCapture: true,
  }));
  const metrics = analyzeFrozenCandidate({ gameId: "fixture", ply: 4, category: "A" }, observations);
  assert.equal(metrics.captureDelta, 3);
  assert.equal(metrics.postPersistenceFraction, 1);
  assert.equal(metrics.classification, "capture-branch-expansion");
  const ascertainment = candidateAscertainment(metrics, observations);
  assert.equal(ascertainment.classificationLookAheadPly, 12);
  assert.equal(ascertainment.classificationKnownByPly, 12);
})();

(function precursorPrecedenceFixture() {
  const observations = Array.from({ length: 14 }, (_, ply) => fakeObservation(ply, {
    phase: ply >= 9 ? "mtaji" : "namua",
    captureMoveCount: ply >= 4 && ply <= 12 ? 4 : 1,
    forcedCapture: true,
  }));
  const metrics = analyzeFrozenCandidate({ gameId: "fixture", ply: 4, category: "A" }, observations);
  assert.equal(metrics.distanceToMtaji, 5);
  assert.equal(metrics.classification, "namua-to-mtaji-precursor");
})();

(function temporalOutcomeFixtures() {
  const terminalBeforeMtaji = [
    fakeObservation(0),
    fakeObservation(1),
    fakeObservation(2, { terminal: true }),
  ];
  assert.deepEqual(summarizeTemporalOutcome(terminalBeforeMtaji, 100), {
    firstMtajiPly: null,
    terminalPly: 2,
    maxObservedPly: 2,
    reachedMtaji: false,
    terminalBeforeMtaji: true,
    administrativeTruncation: false,
    firstMtajiMorphologyEligible: false,
  });

  const truncated = [fakeObservation(0), fakeObservation(1), fakeObservation(100)];
  assert.equal(summarizeTemporalOutcome(truncated, 100).administrativeTruncation, true);

  const mtaji = Array.from({ length: 12 }, (_, ply) => fakeObservation(ply, {
    phase: ply >= 9 ? "mtaji" : "namua",
  }));
  const result = summarizeTemporalOutcome(mtaji, 100);
  assert.equal(result.firstMtajiPly, 9);
  assert.equal(result.firstMtajiMorphologyEligible, true);
})();

console.log("namua-mtaji-transition-features.test.js: passed");
