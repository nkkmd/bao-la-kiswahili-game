"use strict";

const assert = require("node:assert/strict");
const StageB = require("../tools/experiments/analyze-phase-transition-stage-b-trajectory-dedup.js");

assert.equal(StageB.BOUNDARY.generatesGames, false);
assert.equal(StageB.BOUNDARY.invokesFormalRunner, false);
assert.equal(StageB.BOUNDARY.recomputesTrajectoryAudit, false);
assert.equal(StageB.BOUNDARY.changesPrimaryDecision, false);

function document(experimentId, p2, lg, extra = {}) {
  function condition(value) {
    return {
      trajectoryPlyDeduplicatedEndpoint: {
        counts: {
          candidates: value.candidates,
          candidateExpansion: value.expansion,
          controls: 1,
          controlExpansion: 0,
        },
      },
      candidateStructure: {
        rawCandidateCount: value.raw ?? value.candidates,
        rawExpansionCandidateCount: value.rawExpansion ?? value.expansion,
        largestTrajectoryPlyMultiplicity: value.maxMultiplicity ?? 1,
      },
    };
  }
  return {
    experimentId,
    primaryDecisionChanged: false,
    conditions: { P2: condition(p2), LG: condition(lg) },
    ...extra,
  };
}

const e018 = document(
  "E-018",
  { candidates: 10, expansion: 6, raw: 20, maxMultiplicity: 4 },
  { candidates: 8, expansion: 2, raw: 12, maxMultiplicity: 3 },
);
const e019 = document(
  "E-019",
  { candidates: 12, expansion: 2 },
  { candidates: 10, expansion: 7 },
  { stratumId: "D3" },
);
const e020 = document(
  "E-020",
  { candidates: 42, expansion: 5, raw: 112 },
  { candidates: 35, expansion: 13, raw: 176 },
);

const d2P2 = StageB.conditionSummary(e018.conditions.P2, "e018.P2");
assert.equal(d2P2.trajectoryPlyCandidates, 10);
assert.equal(d2P2.trajectoryPlyExpansions, 6);
assert.equal(d2P2.trajectoryPlyExpansionRate, 0.6);
assert.equal(d2P2.rawToTrajectoryPlyMultiplicity, 2);

const e018Validated = StageB.validateDocument(e018, "e018");
assert.equal(StageB.comparison(e018Validated.P2, e018Validated.LG).direction, "P2>LG");
const e019Validated = StageB.validateDocument(e019, "e019D3");
assert.equal(StageB.comparison(e019Validated.P2, e019Validated.LG).direction, "LG>P2");
const e020Validated = StageB.validateDocument(e020, "e020");
assert.equal(e020Validated.P2.trajectoryPlyExpansionRate, 5 / 42);
assert.equal(e020Validated.LG.trajectoryPlyExpansionRate, 13 / 35);
assert.equal(StageB.comparison(e020Validated.P2, e020Validated.LG).direction, "LG>P2");

assert.throws(
  () => StageB.validateDocument({ ...e019, stratumId: "D1" }, "e019D3"),
  /expected stratumId D3/,
);
assert.throws(
  () => StageB.validateDocument(
    document("E-020", { candidates: 41, expansion: 5 }, { candidates: 35, expansion: 13 }),
    "e020",
  ),
  /expected dedup 5\/42/,
);
assert.throws(() => StageB.parseArgs([]), /--e018-structure is required/);

console.log("phase transition Stage B trajectory dedup tests passed");
