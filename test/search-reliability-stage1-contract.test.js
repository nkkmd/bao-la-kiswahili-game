"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const C = require("../tools/experiments/lib/search-reliability-stage1-common.js");

const SPEC_PATH = path.join(__dirname, "../doc/search-reliability-decision-robustness/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));

{
  assert.equal(Object.hasOwn(C, "measureState"), false,
    "shared Stage 1 common module must not expose a duplicate measurement implementation");
}

{
  const state = E.initialState();
  const base = C.rawStateKey(state);
  const administrative = C.cloneJson(state);
  administrative.turn += 99;
  administrative.reason = "technical-only-change";
  assert.equal(C.rawStateKey(administrative), base, "turn/reason are excluded from authoritative RAW identity");
  const authoritative = C.cloneJson(state);
  authoritative.reserve[0] -= 1;
  assert.notEqual(C.rawStateKey(authoritative), base, "authoritative field changes RAW identity");
}

{
  const technicalSpec = C.cloneJson(spec);
  technicalSpec.population.maxPly = 24;
  const a = C.generateTrajectory(99003001, technicalSpec);
  const b = C.generateTrajectory(99003001, technicalSpec);
  assert.deepEqual(a, b, "technical trajectory generation is deterministic");
  assert.equal(a.seed, 99003001);
  assert.equal(a.moves.length <= 24, true);
  assert.equal(a.historicalTrajectoryHash.length, 64);
  assert.equal(a.openingPrefixHash.length, 64);
  assert.equal(a.observations[0].rawStateKey, C.rawStateKey(E.initialState()));
}

{
  const technicalSpec = C.cloneJson(spec);
  technicalSpec.population.maxPly = 36;
  const trajectories = [99003001, 99003002, 99003003, 99003004].map((seed) => C.generateTrajectory(seed, technicalSpec));
  const before = JSON.stringify(trajectories);
  const selection = C.selectStates(trajectories, technicalSpec);
  assert.equal(JSON.stringify(trajectories), before, "selection does not mutate generated trajectories");
  assert.equal(new Set(selection.selected.map((x) => x.historicalTrajectoryHash)).size, selection.selected.length,
    "at most one selected state per historical trajectory");
  assert.equal(new Set(selection.selected.map((x) => x.rawStateKey)).size, selection.selected.length,
    "selected RAW states are unique after deterministic deduplication");
  for (const row of selection.selected) {
    assert.ok(row.ply >= technicalSpec.stateSelection.minimumPly);
    assert.ok(row.legalMoveCount >= technicalSpec.stateSelection.minimumLegalMoveVariants);
    assert.ok(["namua", "mtaji"].includes(row.phase));
  }
}

function fakeCondition(scores, pv) {
  const candidates = Object.entries(scores).map(([moveKey, score]) => ({ moveKey, score }))
    .sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = candidates[0].score;
  const topSetMoveKeys = candidates.filter((x) => x.score === bestScore).map((x) => x.moveKey).sort();
  const secondBestScore = candidates.length >= 2 ? candidates[1].score : null;
  return {
    estimable: true,
    result: {
      bestScore,
      secondBestScore,
      bestSecondGap: secondBestScore === null ? null : bestScore - secondBestScore,
      topSetMoveKeys,
      topSetSize: topSetMoveKeys.length,
      canonicalBestMoveKey: topSetMoveKeys[0],
      candidates,
    },
    principalVariation: { moveKeys: pv },
  };
}

{
  const comparison = fakeCondition({ a: 10, b: 10, c: 2 }, ["a", "x", "y"]);
  const reference = fakeCondition({ a: 8, b: 9, c: 2 }, ["b", "x", "z"]);
  const result = C.compareConditions(comparison, reference);
  assert.equal(result.defined, true);
  assert.equal(result.canonicalBestAgreement, 0);
  assert.equal(result.referenceBestIncludedInComparisonTopSet, 1,
    "reference canonical best may be retained by comparison TopSet even when deterministic representatives differ");
  assert.equal(result.topSetJaccard, 0.5);
  assert.equal(result.pvFirstMoveAgreement, 0);
  assert.equal(result.pvCommonPrefixLength, 0);
  assert.equal(result.pvDivergencePly, 1);
  assert.ok(result.kendallTauB !== null);
  assert.ok(result.spearman !== null);
}

{
  const result = C.compareConditions({ estimable: false }, fakeCondition({ a: 1, b: 0 }, ["a"]));
  assert.deepEqual(result, { defined: false }, "non-estimable budget condition remains undefined without imputation");
}

{
  assert.equal(spec.searchGrid.common.legalMoveOrdering, "canonical");
  assert.equal(spec.moveAndTieContract.scoreTieTolerance, 0);
  assert.equal(spec.searchGrid.conditions.find((x) => x.id === "D3_Q1").role,
    "frozen-higher-resource-reference-not-truth");
  assert.deepEqual(spec.searchGrid.conditions.filter((x) => x.kind === "node-budget").map((x) => x.nodeBudget), [64, 256, 1024]);
  assert.equal(spec.stopping.seedExtensionAllowed, false);
  assert.equal(spec.stopping.replacementAllowed, false);
  assert.equal(spec.stage1Decision.stage2AuthorizedByStage1ResultAlone, false);
}

console.log("SRDR Stage 1 prospective contract tests passed");
