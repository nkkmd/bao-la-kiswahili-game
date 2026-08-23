"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const E = require("../public/engine.js");
const C = require("../tools/experiments/lib/critical-positions-stage1-corpus.js");
const Contract = require("../tools/experiments/lib/critical-positions-stage1-contract.js");
const Discovery = require("../tools/experiments/lib/critical-positions-stage1-discovery.js");

const loaded = C.loadSpec();
assert.throws(() => C.loadAuthorization(loaded.specSha256), /authorization file absent/);
assert.equal(fs.existsSync(C.AUTH_PATH), false);

for (let index = 0; index < 16; index += 1) {
  const seed = C.technicalSeed(index);
  assert.equal(seed >= loaded.spec.population.seedStart && seed <= loaded.spec.population.seedEnd, false);
  assert.equal(seed >= loaded.spec.stage2Boundary.stage2SeedReservation.seedStart
    && seed <= loaded.spec.stage2Boundary.stage2SeedReservation.seedEnd, false);
}

{
  const game = C.runGameCore(loaded.spec, loaded.specSha256, 0, C.technicalSeed(), 10, true, 0);
  assert.equal(game.technicalOnly, true);
  assert.equal(game.moves.length, 10);
  assert.equal(game.observations.length, 11);
  assert.equal(game.openingPrefix.length, 8);
  assert.equal(game.conditionId, "B-D1");
  assert.match(game.historicalTrajectoryHash, /^[0-9a-f]{64}$/);
  assert.match(game.ruleTrajectoryHash, /^[0-9a-f]{64}$/);
}

{
  const root = E.initialState();
  const selected = Array.from({ length: 24 }, (_, index) => ({
    historicalTrajectoryHash: `trajectory-${String(index).padStart(2, "0")}`,
    ruleStateKey: `rule-${String(index).padStart(2, "0")}`,
    openingPrefixHash: `opening-${index % 6}`,
    conditionId: ["B-D1", "B-D2", "B-D3"][index % 3],
    state: E.clone(root),
  }));
  const measurements = selected.map((item, index) => ({
    selectedIndex: index,
    ruleStateKey: item.ruleStateKey,
    divergence: { estimable: true, dRange: 0.5, highDivergence: true },
  }));
  const discovery = Discovery.discover(selected, measurements, loaded.spec);
  assert.ok(discovery.candidateAuditCount > 0);
  assert.ok(discovery.candidatesPassingPromotionGates > 0);
  assert.equal(discovery.supportEquivalenceRepresentativeCount, 1);
  assert.equal(discovery.promotedCandidateCount, 1);
  assert.equal(discovery.promotedCandidates[0].patternComplexity, 1);
  assert.equal(discovery.manualOverridePerformed, false);
}

{
  const synthetic = {
    moves: [
      {
        moveKey: "A",
        summary: {
          counts: { ROOT_ACTOR_WIN: 48, ROOT_ACTOR_LOSS: 16, ADMINISTRATIVE_UNFINISHED: 0 },
          total: 64,
          completed: 64,
        },
      },
      {
        moveKey: "B",
        summary: {
          counts: { ROOT_ACTOR_WIN: 16, ROOT_ACTOR_LOSS: 48, ADMINISTRATIVE_UNFINISHED: 0 },
          total: 64,
          completed: 64,
        },
      },
    ],
  };
  const summary = Contract.summarizeRootDivergence(synthetic);
  assert.equal(summary.estimable, true);
  assert.equal(summary.dRange, 0.5);
  assert.equal(summary.highDivergence, true);
}

const hashes = C.sourceFileSha256();
assert.equal(Object.keys(hashes).length, C.SOURCE_FILES.length);
assert.ok(hashes["tools/experiments/lib/critical-positions-stage1-discovery.js"]);
console.log("Critical positions Stage 1 production-tooling tests passed");
