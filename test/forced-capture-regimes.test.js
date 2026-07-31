"use strict";

const assert = require("node:assert/strict");
const R = require("../tools/experiments/lib/forced-capture-regimes.js");

const observations = [
  { gameId: "g-1", ply: 0, forcedCapture: false, captureMoveCount: 0, phase: "namua" },
  { gameId: "g-1", ply: 1, forcedCapture: true, captureMoveCount: 2, phase: "namua" },
  { gameId: "g-1", ply: 2, forcedCapture: true, captureMoveCount: 8, phase: "namua" },
  { gameId: "g-1", ply: 3, forcedCapture: true, captureMoveCount: 7, phase: "namua" },
  { gameId: "g-1", ply: 4, forcedCapture: false, captureMoveCount: 1, phase: "namua" },
  { gameId: "g-1", ply: 5, forcedCapture: false, captureMoveCount: 0, phase: "mtaji" },
  { gameId: "g-2", ply: 0, forcedCapture: true, captureMoveCount: 3, phase: "mtaji" },
  { gameId: "g-2", ply: 1, forcedCapture: true, captureMoveCount: 3, phase: "mtaji" },
];

{
  const regimes = R.extractForcedCaptureRegimes(observations);
  assert.equal(regimes.length, 2);
  assert.deepEqual(
    regimes.map(({ regimeId, startPly, endPly, length }) => ({ regimeId, startPly, endPly, length })),
    [
      { regimeId: "g-1:1-3", startPly: 1, endPly: 3, length: 3 },
      { regimeId: "g-2:0-1", startPly: 0, endPly: 1, length: 2 },
    ],
  );
}

{
  const regimes = R.extractForcedCaptureRegimes(observations);
  const gameRows = R.groupByGame(observations);
  const result = R.analyzeCandidate(
    { archetypeId: "fixture", category: "A", representativeGameId: "g-1", representativePly: "2" },
    gameRows,
    regimes,
    { before: 1, after: 3, expansionDelta: 3, persistenceFraction: 0.25, eventWindow: 8 },
  );
  assert.equal(result.regimeId, "g-1:1-3");
  assert.equal(result.positionInRegime, 1);
  assert.equal(result.normalizedPositionInRegime, 0.5);
  assert.equal(result.captureDelta, 6);
  assert.equal(result.distanceToForcingRelease, 2);
  assert.equal(result.distanceToMtaji, 3);
  assert.equal(result.returnedToBaseline, true);
  assert.equal(result.classification, "namua-to-mtaji-precursor");
}

{
  assert.equal(R.classifyCandidate({ distanceToMtaji: null, distanceToForcingRelease: null, captureDelta: 5, postPersistenceFraction: 0.75 }), "capture-branch-expansion");
  assert.equal(R.classifyCandidate({ distanceToMtaji: null, distanceToForcingRelease: null, captureDelta: 5, postPersistenceFraction: 0.1 }), "temporary-spike");
  assert.equal(R.classifyCandidate({ distanceToMtaji: null, distanceToForcingRelease: null, captureDelta: -3, postPersistenceFraction: 0 }), "capture-branch-convergence");
}

console.log("forced-capture regime tests passed");
