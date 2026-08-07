"use strict";

const assert = require("node:assert/strict");
const E020 = require("../tools/experiments/lib/phase-transition-d3-reversal-replication.js");
const Evaluator = require("../tools/experiments/evaluate-phase-transition-d3-reversal-replication.js");
const Runner = require("../tools/experiments/run-phase-transition-d3-reversal-replication.js");
const PairBuilder = require("../tools/experiments/build-phase-transition-d3-reversal-replication-pairs.js");

const loaded = E020.loadPreregistration(
  "config/experiments/phase-transition-d3-reversal-replication-v1.json",
);
assert.equal(loaded.config.experimentId, "E-020");
assert.equal(loaded.config.hypothesisId, "H18");
assert.equal(loaded.config.corpus.maxDepth, 3);
assert.equal(loaded.config.corpus.evaluationProfile, "bao");
assert.equal(E020.conditionById(loaded.config, "P2").searchProfile, "phase2");
assert.equal(E020.conditionById(loaded.config, "LG").searchProfile, "legacy");
assert.equal(loaded.config.executionPolicy.formalExecutionApproved, false);
assert.equal(loaded.config.executionPolicy.githubActionsFormalRunAllowed, false);
assert.equal(
  loaded.config.primaryEndpoint.directionRequirement,
  "legacy-only discordant pairs must exceed phase2-only discordant pairs",
);

assert.throws(() => Runner.parseArgs([]), /fixture-only/);
assert.throws(
  () => Runner.parseArgs(["--fixture-games", "2"]),
  /fixture-games and --fixture-base-seed/,
);

const fixtureArgs = Runner.parseArgs([
  "--fixture-games", "2",
  "--fixture-base-seed", "90902001",
]);
assert.equal(fixtureArgs.fixtureGames, 2);
assert.equal(fixtureArgs.fixtureBaseSeed, 90902001);

const syntheticConfig = JSON.parse(JSON.stringify(loaded.config));
syntheticConfig.corpus.pairedSeeds = 20;
syntheticConfig.corpus.gamesPerCondition = 20;
syntheticConfig.corpus.totalGames = 40;
syntheticConfig.corpus.seedRange = [1000, 1019];
syntheticConfig.independence.newSeedRange = [1000, 1019];

const confirmedPairs = [];
for (let index = 0; index < 18; index += 1) {
  confirmedPairs.push({ seed: 1000 + index, P2: false, LG: true });
}
for (let index = 18; index < 20; index += 1) {
  confirmedPairs.push({ seed: 1000 + index, P2: true, LG: false });
}
const confirmed = Evaluator.evaluate(syntheticConfig, confirmedPairs);
assert.equal(confirmed.decision, "confirmed");
assert.equal(confirmed.counts.n01, 18);
assert.equal(confirmed.counts.n10, 2);
assert.equal(confirmed.discordantPairs, 20);
assert.ok(confirmed.exactMcNemarTwoSidedP < 0.01);
assert.equal(confirmed.checks.directionLegacyGreaterThanPhase2, true);
assert.equal(confirmed.discordantOddsRatioLegacyOverPhase2, 9);

const significantWrongDirectionPairs = [];
for (let index = 0; index < 18; index += 1) {
  significantWrongDirectionPairs.push({ seed: 2000 + index, P2: true, LG: false });
}
for (let index = 18; index < 20; index += 1) {
  significantWrongDirectionPairs.push({ seed: 2000 + index, P2: false, LG: true });
}
const wrongDirection = Evaluator.evaluate(syntheticConfig, significantWrongDirectionPairs);
assert.equal(wrongDirection.decision, "not-confirmed");
assert.equal(wrongDirection.checks.exactMcNemarAlpha, true);
assert.equal(wrongDirection.checks.directionLegacyGreaterThanPhase2, false);

const insufficientPairs = [];
for (let index = 0; index < 7; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: false, LG: true });
}
for (let index = 7; index < 10; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: true, LG: false });
}
for (let index = 10; index < 20; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: false, LG: false });
}
const inconclusive = Evaluator.evaluate(syntheticConfig, insufficientPairs);
assert.equal(inconclusive.decision, "inconclusive");
assert.equal(inconclusive.checks.minimumDiscordantPairs, false);

assert.equal(Evaluator.exactMcNemarTwoSided(18, 2), Evaluator.exactMcNemarTwoSided(2, 18));
assert.equal(Evaluator.exactMcNemarTwoSided(0, 0), 1);
assert.equal(Evaluator.exactMcNemarTwoSided(10, 10), 1);

const structural = Evaluator.structuralComparison(20, 0, 21, 9);
assert.equal(structural.rates.P2, 0);
assert.equal(structural.rates.LG, 9 / 21);
assert.equal(structural.legacyOverPhase2RiskRatio, null);
assert.equal(structural.riskRatioLabel, "Infinity");
assert.ok(structural.fisherExactTwoSidedP < 0.01);

const openingGame = {
  openingPliesApplied: 2,
  initialStateHash: "initial",
  moves: [
    { afterStateHash: "opening-1" },
    { afterStateHash: "opening-2" },
  ],
};
assert.equal(Runner.openingBoundaryHash(openingGame), "opening-2");

const p2Games = [
  { gameId: "p2-0", gameIndex: 0, seed: 5000 },
  { gameId: "p2-1", gameIndex: 1, seed: 5001 },
  { gameId: "p2-2", gameIndex: 2, seed: 5002 },
];
const lgGames = [
  { gameId: "lg-0", gameIndex: 0, seed: 5000 },
  { gameId: "lg-1", gameIndex: 1, seed: 5001 },
  { gameId: "lg-2", gameIndex: 2, seed: 5002 },
];
const p2Candidates = [
  { gameId: "p2-0", distanceToTerminal: "20", classification: "capture-branch-expansion" },
  { gameId: "p2-1", distanceToTerminal: "8", classification: "capture-branch-expansion" },
];
const lgCandidates = [
  { gameId: "lg-1", distanceToTerminal: "12", classification: "capture-branch-expansion" },
];
const builtPairs = PairBuilder.buildPairs(p2Games, p2Candidates, lgGames, lgCandidates, 9);
assert.deepEqual(
  builtPairs.map((row) => [row.seed, row.P2, row.LG]),
  [
    [5000, true, false],
    [5001, false, true],
    [5002, false, false],
  ],
);
assert.throws(
  () => PairBuilder.buildPairs(p2Games, p2Candidates, lgGames.slice(0, 2), lgCandidates, 9),
  /seed sets differ/,
);

console.log("phase transition D3 reversal replication tests passed");
