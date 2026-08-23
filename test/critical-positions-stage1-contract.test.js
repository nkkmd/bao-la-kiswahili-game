"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Contract = require("../tools/experiments/lib/critical-positions-stage1-contract.js");
const Validator = require("../tools/experiments/validate-critical-positions-stage1-spec.js");

{
  const loaded = Validator.loadSpec();
  assert.equal(Validator.validateSpec(loaded.spec), true);
  assert.match(loaded.specSha256, /^[0-9a-f]{64}$/);
}

{
  const root = E.initialState();
  const tokens = Contract.structuralTokens(root);
  const families = tokens.map(({ family }) => family);
  assert.ok(families.includes("legalMoveCount"));
  assert.ok(families.includes("captureMoveCount"));
  assert.ok(families.includes("actorReserveNamuaOnly"));
  assert.ok(families.includes("opponentReserveNamuaOnly"));
  assert.equal(new Set(families).size, families.length);
  for (const { family, value } of tokens) assert.ok(Contract.TOKEN_FAMILIES[family].includes(value));
  const matchers = Contract.enumerateCandidateMatchers(root);
  assert.ok(matchers.length > tokens.length);
  assert.equal(matchers.every((item) => item.phase === "namua"), true);
  assert.equal(matchers.every((item) => item.tokens.length >= 1 && item.tokens.length <= 2), true);
  assert.equal(matchers.every((item) => item.families.length === new Set(item.families).size), true);
  assert.equal(matchers.some((item) => /D_range|winner|outcome|D2|D3/i.test(item.candidateKey)), false);
}

{
  const root = E.initialState();
  root.phase = "mtaji";
  root.reserve = [0, 0];
  const families = Contract.structuralTokens(root).map(({ family }) => family);
  assert.equal(families.includes("actorReserveNamuaOnly"), false);
  assert.equal(families.includes("opponentReserveNamuaOnly"), false);
}

function move(moveKey, wins, losses, unfinished = 0) {
  return {
    moveKey,
    summary: {
      counts: {
        ROOT_ACTOR_WIN: wins,
        ROOT_ACTOR_LOSS: losses,
        ADMINISTRATIVE_UNFINISHED: unfinished,
      },
      total: wins + losses + unfinished,
      completed: wins + losses,
    },
  };
}

{
  const summary = Contract.summarizeRootDivergence({
    moves: [move("A", 48, 16), move("B", 16, 48), move("C", 32, 32)],
  });
  assert.equal(summary.estimable, true);
  assert.equal(summary.dRange, 0.5);
  assert.equal(summary.highDivergence, true);
  assert.deepEqual(summary.moveRates.map(({ winRate }) => winRate), [0.75, 0.25, 0.5]);
}

{
  const summary = Contract.summarizeRootDivergence({
    moves: [move("A", 40, 24), move("B", 25, 39)],
  });
  assert.equal(summary.estimable, true);
  assert.equal(summary.highDivergence, false);
  assert.ok(summary.dRange < Contract.HIGH_DIVERGENCE_THRESHOLD);
}

{
  const summary = Contract.summarizeRootDivergence({
    moves: [move("A", 48, 16), move("B", 16, 47, 1)],
  });
  assert.equal(summary.estimable, false);
  assert.equal(summary.dRange, null);
  assert.equal(summary.highDivergence, null);
}

{
  const rows = [
    { historicalTrajectoryHash: "b", ruleStateKey: "2" },
    { historicalTrajectoryHash: "a", ruleStateKey: "1" },
  ];
  assert.equal(Contract.supportIdentity(rows), Contract.supportIdentity(rows.slice().reverse()));
}

assert.equal(Contract.GAME_COUNT, 3072);
assert.equal(Contract.SEED_START, 22600001);
assert.equal(Contract.SEED_END, 22603072);
assert.deepEqual(Contract.PHASE_QUOTA, { namua: 300, mtaji: 300 });
assert.equal(Contract.POLICY_ID, "P1_NORMAL_TOP3");
assert.equal(Contract.REPLICATES, 64);
assert.equal(Contract.MAX_CONTINUATION_PLIES, 200);
assert.equal(Contract.HIGH_DIVERGENCE_THRESHOLD, 0.30);

console.log("Critical positions Stage 1 contract tests passed");
