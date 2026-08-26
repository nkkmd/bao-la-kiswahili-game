"use strict";

const assert = require("node:assert/strict");
const Population = require("../tools/engineering/lib/pbai-p1-decision-population.js");
const AI = require("../public/ai.js");

const population = Population.materializeSplit({ split: "development", start: 31300001, end: 31300512, maximumPlies: 160 });
const target = population.roots
  .map((root) => ({ ...root, moves: Population.sortedMoves(root.state) }))
  .filter((root) => root.phase === "namua" && root.moves.length >= 2 && root.moves.every((move) => move.type === "capture"))
  .sort((a, b) => a.populationRankHash.localeCompare(b.populationRankHash) || a.seed - b.seed || a.ply - b.ply)[0];

assert.ok(target, "expected at least one frozen C001 target root");
const base = { evaluationProfile: "bao", maxDepth: 3, timeLimitMs: Infinity, quiescenceDepth: 1 };
const on = AI.analyzeMove(target.state, "hard", Population.seededRandom(target.seed), { ...base, pbaiC001NamuaForcedCaptureLegacy: true });
const legacy = AI.analyzeMove(target.state, "hard", Population.seededRandom(target.seed), { ...base, searchProfile: "legacy" });
assert.equal(on.stats.pbaiC001Triggered, true);
assert.equal(AI.moveKey(on.move), AI.moveKey(legacy.move));
assert.equal(on.stats.rootScore, legacy.stats.rootScore);
assert.equal(on.stats.completedDepth, legacy.stats.completedDepth);

const off = AI.analyzeMove(target.state, "hard", Population.seededRandom(target.seed), { ...base, pbaiC001NamuaForcedCaptureLegacy: false });
assert.notEqual(off.stats.pbaiC001Triggered, true);
console.log("PBAI-C001-v1 routing unit check: PASS");
