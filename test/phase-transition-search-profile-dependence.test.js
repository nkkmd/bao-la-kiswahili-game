"use strict";

const assert = require("node:assert/strict");
const E018 = require("../tools/experiments/lib/phase-transition-search-profile-dependence.js");
const Evaluator = require("../tools/experiments/evaluate-phase-transition-search-profile-dependence.js");
const Runner = require("../tools/experiments/run-phase-transition-search-profile-dependence.js");
const PairBuilder = require("../tools/experiments/build-phase-transition-search-profile-pairs.js");

const loaded = E018.loadPreregistration(
  "config/experiments/phase-transition-search-profile-dependence-v1.json",
);
assert.equal(loaded.config.experimentId, "E-018");
assert.equal(E018.conditionById(loaded.config, "P2").searchProfile, "phase2");
assert.equal(E018.conditionById(loaded.config, "LG").searchProfile, "legacy");
assert.equal(loaded.config.executionPolicy.formalExecutionApproved, false);
assert.equal(loaded.config.executionPolicy.githubActionsFormalRunAllowed, false);
assert.equal(loaded.config.structuralSecondaryEndpoint.legacyExpansionMinimumRequired, false);

assert.throws(
  () => Runner.parseArgs([]),
  /fixture-only/,
);

const syntheticConfig = JSON.parse(JSON.stringify(loaded.config));
syntheticConfig.corpus.gamesPerCondition = 20;
syntheticConfig.corpus.totalGames = 40;
syntheticConfig.corpus.sharedBaseSeed = 1000;
syntheticConfig.corpus.sharedSeedRange = [1000, 1019];

const confirmedPairs = [];
for (let index = 0; index < 18; index += 1) {
  confirmedPairs.push({ seed: 1000 + index, P2: true, LG: false });
}
for (let index = 18; index < 20; index += 1) {
  confirmedPairs.push({ seed: 1000 + index, P2: false, LG: true });
}
const confirmed = Evaluator.evaluate(syntheticConfig, confirmedPairs);
assert.equal(confirmed.decision, "confirmed");
assert.equal(confirmed.counts.n10, 18);
assert.equal(confirmed.counts.n01, 2);
assert.equal(confirmed.discordantPairs, 20);
assert.ok(confirmed.exactMcNemarTwoSidedP < 0.01);
assert.equal(confirmed.checks.directionP2GreaterThanLG, true);

const notConfirmedPairs = [];
for (let index = 0; index < 11; index += 1) {
  notConfirmedPairs.push({ seed: 2000 + index, P2: true, LG: false });
}
for (let index = 11; index < 20; index += 1) {
  notConfirmedPairs.push({ seed: 2000 + index, P2: false, LG: true });
}
const notConfirmed = Evaluator.evaluate(syntheticConfig, notConfirmedPairs);
assert.equal(notConfirmed.decision, "not-confirmed");
assert.equal(notConfirmed.checks.minimumDiscordantPairs, true);
assert.equal(notConfirmed.checks.exactMcNemarAlpha, false);

const insufficientPairs = [];
for (let index = 0; index < 7; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: true, LG: false });
}
for (let index = 7; index < 10; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: false, LG: true });
}
for (let index = 10; index < 20; index += 1) {
  insufficientPairs.push({ seed: 3000 + index, P2: false, LG: false });
}
const inconclusive = Evaluator.evaluate(syntheticConfig, insufficientPairs);
assert.equal(inconclusive.decision, "inconclusive");
assert.equal(inconclusive.checks.exactPairCount, true);
assert.equal(inconclusive.checks.minimumDiscordantPairs, false);

assert.equal(Evaluator.exactMcNemarTwoSided(18, 2), Evaluator.exactMcNemarTwoSided(2, 18));
assert.equal(Evaluator.exactMcNemarTwoSided(0, 0), 1);
assert.equal(Evaluator.exactMcNemarTwoSided(10, 10), 1);

const structural = Evaluator.structuralComparison(21, 9, 20, 0);
assert.equal(structural.rates.P2, 9 / 21);
assert.equal(structural.rates.LG, 0);
assert.equal(structural.riskRatio, null);
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
  { gameId: "p2-0", distanceToTerminal: "19", classification: "forcing-release-precursor" },
  { gameId: "p2-1", distanceToTerminal: "8", classification: "capture-branch-expansion" },
];
const lgCandidates = [
  { gameId: "lg-1", distanceToTerminal: "12", classification: "capture-branch-expansion" },
];
const builtPairs = PairBuilder.buildPairs(p2Games, p2Candidates, lgGames, lgCandidates, 9);
assert.equal(builtPairs.length, 3);
assert.deepEqual(
  builtPairs.map((row) => [row.seed, row.P2, row.LG]),
  [
    [5000, true, false],
    [5001, false, true],
    [5002, false, false],
  ],
);
assert.equal(builtPairs[0].P2EligibleCandidateCount, 2);
assert.equal(builtPairs[1].P2EligibleCandidateCount, 0);
assert.equal(builtPairs[1].LGExpansionCandidateCount, 1);
assert.throws(
  () => PairBuilder.buildPairs(p2Games, p2Candidates, lgGames.slice(0, 2), lgCandidates, 9),
  /seed sets differ/,
);

console.log("phase transition search profile dependence tests passed");
