"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const {
  IDS,
  exactMoveKey,
  isApplicable,
  rawRuleState,
  transformMove,
  transformState,
} = require("../tools/experiments/lib/symmetry-isomorphism-transforms.js");

function keys(moves) {
  return moves.map(exactMoveKey).sort();
}

function mappedKeys(state, candidateId) {
  return keys(E.moveVariants(state).map((move) => transformMove(move, candidateId)));
}

function transformedKeys(state, candidateId) {
  return keys(E.moveVariants(transformState(state, candidateId)));
}

function assertSyntheticCommutation(state, candidateId) {
  assert.equal(isApplicable(state, candidateId), true, `${candidateId} fixture applicability`);
  assert.deepEqual(mappedKeys(state, candidateId), transformedKeys(state, candidateId), `${candidateId} exact move set`);
  for (const move of E.moveVariants(state)) {
    const left = rawRuleState(transformState(E.applyMove(state, move).state, candidateId));
    const right = rawRuleState(E.applyMove(
      transformState(state, candidateId),
      transformMove(move, candidateId),
    ).state);
    assert.deepEqual(right, left, `${candidateId} transition ${exactMoveKey(move)}`);
  }
}

function mtajiHouselessFixture() {
  const state = E.initialState();
  state.pits = [
    [
      [2, 0, 0, 0, 1, 1, 1, 1],
      [10, 0, 8, 8, 0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 1, 0, 0, 0, 2],
      [0, 0, 0, 0, 8, 8, 0, 10],
    ],
  ];
  state.reserve = [0, 0];
  state.houseOwned = [false, false];
  state.player = 0;
  state.phase = "mtaji";
  state.winner = null;
  state.reason = "";
  state.turn = 45;
  state.pending = [0, 0];
  assert.equal(state.pits.flat(2).reduce((sum, value) => sum + value, 0), 64);
  return state;
}

const initial = E.initialState();
const mtaji = mtajiHouselessFixture();

for (const candidateId of Object.values(IDS)) {
  for (const state of [initial, mtaji]) {
    const once = transformState(state, candidateId);
    const twice = transformState(once, candidateId);
    assert.deepEqual(twice, state, `${candidateId} state involution`);
    for (const move of E.moveVariants(state)) {
      assert.deepEqual(
        transformMove(transformMove(move, candidateId), candidateId),
        move,
        `${candidateId} move involution`,
      );
    }
  }
}

assert.deepEqual(transformState(initial, IDS.IDENTITY), initial);
assertSyntheticCommutation(initial, IDS.IDENTITY);
assertSyntheticCommutation(initial, IDS.SEAT_SWAP);
assert.equal(isApplicable(initial, IDS.LR_MTAJI_HOUSELESS), false);
assert.equal(isApplicable(initial, IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS), false);
assertSyntheticCommutation(mtaji, IDS.LR_MTAJI_HOUSELESS);
assertSyntheticCommutation(mtaji, IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS);

const terminal = mtajiHouselessFixture();
terminal.player = 1;
terminal.winner = 0;
const terminalSwap = transformState(terminal, IDS.SEAT_SWAP);
assert.equal(terminalSwap.player, 0);
assert.equal(terminalSwap.winner, 1);
assert.equal(E.moveVariants(terminalSwap).length, 0);

let negativeMismatch = false;
for (const move of E.moveVariants(mtaji)) {
  const expected = rawRuleState(transformState(E.applyMove(mtaji, move).state, IDS.NEGATIVE_LR_NO_DIRECTION));
  let actual = null;
  try {
    actual = rawRuleState(E.applyMove(
      transformState(mtaji, IDS.NEGATIVE_LR_NO_DIRECTION),
      transformMove(move, IDS.NEGATIVE_LR_NO_DIRECTION),
    ).state);
  } catch {
    negativeMismatch = true;
    break;
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    negativeMismatch = true;
    break;
  }
}
assert.equal(negativeMismatch, true, "negative control must detect omitted direction mapping on synthetic fixture");

console.log("Symmetry/isomorphism Stage 0 synthetic tests passed");
