"use strict";

const assert = require("node:assert/strict");
const R = require("../tools/experiments/run-position-complexity-stage2-formal.js");
const V = require("../tools/experiments/verify-position-complexity-stage2-formal.js");

const { spec, specSha256 } = R.loadSpec();

assert.equal(spec.stageId, "PCX-S2-FORMAL-2026-08-13-v1");
assert.equal(spec.population.games, 1024);
assert.equal(spec.population.seedStart, 20410001);
assert.equal(spec.population.seedEnd, 20411024);
assert.deepEqual(spec.measurement.depths, [2, 3]);
assert.equal(spec.generationAuthorizedByThisSpecAlone, false);

const technicalSpec = JSON.parse(JSON.stringify(spec));
technicalSpec.population.games = 1;
technicalSpec.population.seedEnd = technicalSpec.population.seedStart;
technicalSpec.population.maxPly = 12;

const game = R.runGame(technicalSpec, specSha256, 0);
assert.equal(game.stageId, technicalSpec.stageId);
assert.equal(game.gameId, "pcx-s2-0000");
assert.equal(game.seed, 20410001);
assert.equal(game.specSha256, specSha256);
assert.ok(game.observations.length >= 9, "technical formal game reaches post-opening observations");
assert.ok(game.moves.length <= 12, "technical formal game obeys maxPly");
assert.ok(game.observations.every((observation) => observation.gameId === "pcx-s2-0000"),
  "formal game relabels all observation provenance");

const verified = V.verifyGame(game, 0, technicalSpec, specSha256, true);
assert.equal(verified.gameIndex, 0);
assert.equal(verified.seed, 20410001);
assert.ok(verified.searchMovesRecomputed > 0, "technical verifier recomputes post-opening searches");
assert.match(verified.historicalTrajectoryHash, /^[a-f0-9]{64}$/);

const status = R.status("/tmp/nonexistent-pcx-stage2-formal", spec);
assert.equal(status.expectedGames, 1024);
assert.equal(status.generatedGameFiles, 0);
assert.equal(status.hasFormalResult, false);

console.log("Position-complexity Stage 2 formal tooling tests passed");
