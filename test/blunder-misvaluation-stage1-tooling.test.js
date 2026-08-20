"use strict";

const assert = require("node:assert/strict");
const os = require("node:os");
const path = require("node:path");
const E = require("../public/engine.js");
const {
  extractPositionTypologyObservation,
} = require("../tools/experiments/lib/position-typology-features.js");
const C = require("../tools/experiments/lib/blunder-misvaluation-stage1-corpus.js");
const Discovery = require("../tools/experiments/lib/blunder-misvaluation-stage1-discovery.js");
const Runner = require("../tools/experiments/run-blunder-misvaluation-stage1-exploratory.js");
const Verifier = require("../tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js");

const { spec, specSha256 } = C.loadSpec();
assert.equal(spec.stageId, "BMP-S1-EXPLORATORY-2026-08-20-v1");
assert.equal(specSha256, "f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd");

const counts = Object.fromEntries(spec.population.conditionAssignment.strata.map(({ id }) => [id, 0]));
for (let i = 0; i < spec.population.games; i += 1) counts[C.conditionForGame(spec, i).id] += 1;
assert.deepEqual(counts, {
  "B-D1": 342,
  "B-D2": 342,
  "B-D3": 341,
  "LS-D2": 341,
  "V2-D2": 341,
  "LE-D2": 341,
});

assert.throws(() => C.loadAuthorization(specSha256, path.join(os.tmpdir(), "bmp-stage1-auth-definitely-absent.json")),
  /authorization file absent/);
assert.ok(C.SOURCE_FILES.includes("tools/experiments/run-blunder-misvaluation-stage1-exploratory.js"));
assert.ok(C.SOURCE_FILES.includes("tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js"));
assert.ok(C.SOURCE_FILES.includes("doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json"));

const initialObservation = extractPositionTypologyObservation(E.initialState(), {
  gameId: "technical-root",
  conditionId: "B-D1",
  seed: 99000001,
  ply: 0,
});
const tokens = Discovery.rootPreconditionTokens({ actor: initialObservation.features.actor });
assert.equal(tokens.length, 9);
assert.equal(new Set(tokens.map(({ family }) => family)).size, 9);
assert.equal(Discovery.combinations(tokens).length, 45);

const syntheticMove = {
  transition: {
    actorDelta: {
      legalMoveCount: -1,
      captureMoveCount: -1,
      frontConnections: -1,
      reusablePits: -1,
      nyumbaSeeds: -1,
    },
    houseOwnedDelta: { actor: -1 },
  },
  responseEnvelope: {
    replyCount: 1,
    actorDeltaFromRoot: {
      legalMoveCount: { min: -2, max: -2, mean: -2 },
      captureMoveCount: { min: -1, max: -1, mean: -1 },
      frontConnections: { min: -1, max: 0, mean: -0.5 },
      reusablePits: { min: -1, max: 0, mean: -0.5 },
    },
    terminalCounts: { actorWin: 0, opponentWin: 1, nonterminal: 0 },
  },
  staticPostMove: { isTopSet: true, isAtOrAboveStateMedian: true },
  search: {
    d1: { isTopSet: true },
    d2: { isTopSet: true, isAtOrAboveStateMedian: true },
    d3: { isTopSet: false, isBelowStateMedian: true },
  },
};
const flags = Discovery.failureFlags(syntheticMove);
for (const key of [
  "actorLegalMoveDeltaNegative",
  "actorHouseOwnershipLost",
  "allRepliesActorLegalMoveDeltaNegative",
  "opponentImmediateWinningReplyExists",
  "singleReplyAndActorCaptureMoveDeltaNegative",
  "d1TopSetAndD3NonTop",
  "d2AtOrAboveMedianAndD3BelowMedian",
  "staticTopSetAndD3NonTop",
]) assert.equal(flags[key], true, key);

const quotaItems = [];
for (const phase of ["namua", "mtaji"]) {
  for (let i = 0; i < 605; i += 1) {
    quotaItems.push({
      assignedPhase: phase,
      quotaRank: String(i).padStart(4, "0"),
      historicalTrajectoryHash: `${phase}-t-${String(i).padStart(4, "0")}`,
      ruleStateKey: `${phase}-r-${String(i).padStart(4, "0")}`,
      seed: 99000000 + i,
      conditionId: spec.population.conditionAssignment.strata[i % 6].id,
      openingPrefixHash: `opening-${i % 128}`,
    });
  }
}
const quota = Runner.applyPhaseQuota(quotaItems, spec);
assert.equal(quota.selected.length, 1200);
assert.deepEqual(quota.poolCounts, { namua: 605, mtaji: 605 });
assert.deepEqual(quota.quotaDropped, { namua: 5, mtaji: 5 });
const readiness = Runner.selectionReadiness(Array.from({ length: 1600 }, (_, i) => ({ i })), quota.selected, spec);
assert.equal(readiness.passed, true);

const technicalSpec = JSON.parse(JSON.stringify(spec));
technicalSpec.population.seedStart = 99000001;
technicalSpec.population.seedEnd = 99000001 + technicalSpec.population.games - 1;
technicalSpec.population.maxPly = 10;
const technicalSpecSha = "technical-fixture-not-scientific";
const game = C.runGame(technicalSpec, technicalSpecSha, 0);
assert.equal(game.seed, 99000001);
assert.equal(game.gameId, "bmp-s1-0000");
assert.ok(game.moves.length <= 10);
const verified = Verifier.verifyGame(game, 0, technicalSpec, technicalSpecSha, true);
assert.equal(verified.historicalTrajectoryHash, game.historicalTrajectoryHash);

const selectedFixture = {
  historicalTrajectoryHash: "technical-trajectory",
  ruleStateKey: initialObservation.identity.ruleStateKey,
  seed: 99000001,
  gameId: "technical-root",
  conditionId: "B-D1",
  openingPrefixHash: "technical-opening",
  assignedPhase: initialObservation.phase,
  ply: 0,
  observation: initialObservation,
  state: C.stateFromObservation(initialObservation),
};
const measurement = Runner.measureOne(selectedFixture, 0, spec, specSha256, "technical-selection");
assert.equal(measurement.moves.length, E.moveVariants(E.initialState()).length);
assert.ok(measurement.moves.every((move) => typeof move.search.d3Inferior === "boolean"));
assert.ok(measurement.moves.every((move) => Number.isFinite(move.search.d3.normalizedRankLoss)));
assert.ok(measurement.moves.every((move) => Object.values(move.failureFlags).every((value) => typeof value === "boolean")));
const matcherMap = Discovery.opportunityRecords([measurement]);
assert.ok(matcherMap.size > 0);

console.log("Blunder / misvaluation Stage 1 tooling tests passed");
