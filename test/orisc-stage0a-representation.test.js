"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const P = require("../tools/experiments/lib/orisc-representation-production.js");
const I = require("../tools/experiments/lib/orisc-representation-independent.js");

function emptyRows() {
  return [Array(8).fill(0), Array(8).fill(0)];
}

function terminalCaptureFixture() {
  const pits = [emptyRows(), emptyRows()];
  pits[0][E.FRONT][0] = 2;
  pits[0][E.FRONT][2] = 1;
  pits[0][E.BACK][0] = 60;
  pits[1][E.FRONT][5] = 1;
  return {
    pits,
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 0,
    phase: "mtaji",
    winner: null,
    reason: "synthetic-input",
    turn: 777,
    pending: [0, 0],
  };
}

function frontEmptyFinishTurnFixture() {
  const pits = [emptyRows(), emptyRows()];
  pits[0][E.FRONT][0] = 2;
  pits[0][E.BACK][0] = 61;
  pits[1][E.BACK][0] = 1;
  return {
    pits,
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 0,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 91,
    pending: [0, 0],
  };
}

function assertImplementationsAgree(state) {
  assert.equal(P.stateSerialization(state), I.serialize(state));
  assert.equal(P.stateKey(state), I.key(state));
  assert.equal(P.representedSeeds(state), I.seedCount(state));
}

(function main() {
  const base = terminalCaptureFixture();
  assert.equal(P.representedSeeds(base), 64);
  assertImplementationsAgree(base);

  const changedTurn = P.clone(base);
  changedTurn.turn += 1000;
  assert.equal(P.stateKey(changedTurn), P.stateKey(base));
  assert.equal(I.key(changedTurn), I.key(base));

  const changedReason = P.clone(base);
  changedReason.reason = "different-reporting-text";
  assert.equal(P.stateKey(changedReason), P.stateKey(base));
  assert.equal(I.key(changedReason), I.key(base));

  const changedPending = P.clone(base);
  changedPending.pending = [1, 0];
  changedPending.pits[0][E.BACK][0] -= 1;
  assert.notEqual(P.stateKey(changedPending), P.stateKey(base));
  assert.notEqual(I.key(changedPending), I.key(base));
  assertImplementationsAgree(changedPending);
  assert.equal(P.representedSeeds(changedPending), 64);

  const missingPending = P.clone(base);
  delete missingPending.pending;
  assert.throws(() => P.stateKey(missingPending), /pending/);
  assert.throws(() => I.key(missingPending), /pending/);

  const captureMove = {
    type: "capture",
    phase: "mtaji",
    row: E.FRONT,
    index: 0,
    direction: "right",
  };
  assert(E.legalMoves(base).some((move) => P.exactMoveKey(move) === P.exactMoveKey(captureMove)));
  assert.equal(P.exactMoveKey(captureMove), I.moveIdentity(captureMove));
  const terminalCapture = E.applyMove(base, captureMove).state;
  assert.equal(terminalCapture.winner, 0);
  assert.deepEqual(terminalCapture.pending, [1, 0]);
  assert.equal(terminalCapture.pits[1][E.FRONT].reduce((a, b) => a + b, 0), 0);
  assert.equal(P.representedSeeds(terminalCapture), 64);
  assertImplementationsAgree(terminalCapture);

  const erasedPending = P.clone(terminalCapture);
  erasedPending.pending = [0, 0];
  assert.equal(P.representedSeeds(erasedPending), 63);
  assert.equal(I.seedCount(erasedPending), 63);
  assert.notEqual(P.stateKey(erasedPending), P.stateKey(terminalCapture));
  assert.notEqual(I.key(erasedPending), I.key(terminalCapture));

  const frontEmpty = frontEmptyFinishTurnFixture();
  assert.equal(P.representedSeeds(frontEmpty), 64);
  const frontEmptyMove = {
    type: "takata",
    phase: "mtaji",
    row: E.FRONT,
    index: 0,
    direction: "right",
  };
  assert(E.legalMoves(frontEmpty).some((move) => P.exactMoveKey(move) === P.exactMoveKey(frontEmptyMove)));
  const frontEmptyTerminal = E.applyMove(frontEmpty, frontEmptyMove).state;
  assert.equal(frontEmptyTerminal.winner, 0);
  assert.deepEqual(frontEmptyTerminal.pending, [0, 0]);
  assert.equal(P.representedSeeds(frontEmptyTerminal), 64);
  assertImplementationsAgree(frontEmptyTerminal);

  const stopMove = {
    type: "capture",
    phase: "namua",
    row: E.FRONT,
    index: E.HOUSE,
    direction: "right",
    side: "left",
    houseChoice: "stop",
  };
  const useMove = { ...stopMove, houseChoice: "use" };
  assert.notEqual(P.exactMoveKey(stopMove), P.exactMoveKey(useMove));
  assert.equal(P.exactMoveKey(stopMove), I.moveIdentity(stopMove));
  assert.equal(P.exactMoveKey(useMove), I.moveIdentity(useMove));

  process.stdout.write(`${JSON.stringify({
    test: "ORISC Stage 0A synthetic representation fixtures",
    passed: true,
    scientificOutcomeGenerated: false,
    representationChecks: {
      serializerAgreement: true,
      pendingAffectsIdentity: true,
      turnExcludedFromIdentity: true,
      reasonExcludedFromIdentity: true,
      missingPendingRejected: true,
      terminalCapturePendingAccounting: true,
      frontEmptyNoPendingCreation: true,
      representedSeedConservation: true,
      moveHouseChoiceDistinguished: true,
    },
  }, null, 2)}\n`);
}());
