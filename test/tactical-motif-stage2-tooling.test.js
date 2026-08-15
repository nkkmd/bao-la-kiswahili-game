"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Formal = require("../tools/experiments/lib/tactical-motif-stage2-formal.js");
const Evaluator = require("../tools/experiments/evaluate-tactical-motif-stage2-formal.js");
const C = require("../tools/experiments/lib/tactical-motif-stage2-corpus.js");
const Verifier = require("../tools/experiments/verify-tactical-motif-stage2-formal.js");

const SAMPLE_CANDIDATE = {
  candidateId: "TEST",
  moveAbstractionMode: "coarse-no-index",
  moveAbstractionToken: "move:coarse-no-index:{\"direction\":\"left\",\"houseChoice\":null,\"houseTwo\":false,\"phase\":\"mtaji\",\"row\":1,\"side\":null,\"type\":\"takata\"}",
  preconditions: ["captureMoveCount=0"],
  consequence: "actorCaptureMoveDeltaSign=0",
  pairedDiagnosticDefinition: {
    stage1Rank: 2,
    candidateKey: "paired",
    preconditions: ["reserve=0"],
    consequence: "actorCaptureMoveDeltaSign=0",
  },
};

function nearlyEqual(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test("Stage 2 exact one-sided binomial is deterministic", () => {
  nearlyEqual(Formal.exactBinomialUpper(3, 3, 0.5), 0.125);
  nearlyEqual(Formal.exactBinomialUpper(0, 3, 0.5), 1);
  nearlyEqual(Formal.exactBinomialUpper(2, 2, 0.5), 0.25);
});

test("Stage 2 exact binomial remains numerically stable above floating-point underflow range", () => {
  const centerTail = Formal.exactBinomialUpper(1000, 2000, 0.5);
  assert.ok(centerTail > 0.508 && centerTail < 0.510);
  const highTail = Formal.exactBinomialUpper(1200, 2000, 0.5);
  assert.ok(Number.isFinite(highTail));
  assert.ok(highTail > 0 && highTail < 1e-10);
});

test("Stage 2 Holm-Bonferroni preserves family-wise ordering", () => {
  const adjusted = Formal.holmBonferroni([
    { id: "a", pValue: 0.001 },
    { id: "b", pValue: 0.01 },
    { id: "c", pValue: 0.04 },
  ], 0.05);
  nearlyEqual(adjusted[0].adjustedPValue, 0.003);
  nearlyEqual(adjusted[1].adjustedPValue, 0.02);
  nearlyEqual(adjusted[2].adjustedPValue, 0.04);
  assert.ok(adjusted.every((row) => row.rejected));
});

test("Stage 2 canonical move abstraction ignores index only in coarse mode", () => {
  const matching = {
    type: "takata",
    phase: "mtaji",
    row: 1,
    index: 7,
    direction: "left",
    side: null,
    houseChoice: null,
    houseTwo: false,
  };
  const nonmatching = { ...matching, direction: "right" };
  assert.equal(Formal.moveMatchesCandidate(matching, SAMPLE_CANDIDATE), true);
  assert.equal(Formal.moveMatchesCandidate(nonmatching, SAMPLE_CANDIDATE), false);
});

test("Stage 2 frozen root preconditions and paired diagnostics are evaluated without outcomes", () => {
  const actor = {
    captureMoveCount: 0,
    forcedCapture: false,
    legalMoveCount: 4,
    reserve: 0,
    houseOwned: false,
    nyumbaSeeds: 0,
    frontOccupied: 4,
    frontConnections: 2,
    reusablePits: 3,
  };
  assert.equal(Formal.rootSatisfiesCandidate(actor, SAMPLE_CANDIDATE), true);
  assert.equal(Formal.pairedPreconditionHolds(actor, SAMPLE_CANDIDATE), true);
});

test("Stage 2 consequence predicate uses frozen Stage 1 consequence semantics", () => {
  const moveRecord = {
    transition: {
      events: { capturedSeeds: 0, relayEvents: 0 },
      actorDelta: {
        legalMoveCount: 0,
        captureMoveCount: 0,
        frontConnections: 0,
        reusablePits: 0,
        nyumbaSeeds: 0,
      },
      houseOwnedDelta: { actor: 0 },
      replySet: { forced: false, count: 4 },
      terminal: false,
    },
    responseEnvelope: {
      actorDeltaFromRoot: {
        legalMoveCount: { min: 0 },
        captureMoveCount: { min: 0 },
      },
    },
  };
  assert.equal(Formal.candidateConsequenceHolds(moveRecord, SAMPLE_CANDIDATE), true);
  assert.equal(Formal.pairedConsequenceHolds(moveRecord, SAMPLE_CANDIDATE), true);
});

test("Stage 2 evaluator substitutes p=1 only for non-estimable planned endpoints", () => {
  const { spec } = C.loadSpec();
  const summary = {
    candidateId: "TM-S2-CXX",
    selectedRoots: 10,
    structuralSuccesses: 10,
    structuralSuccessRate: 1,
    d3TopSetSuccesses: 10,
    d3TopSetRate: 1,
    estimable: false,
  };
  const endpoints = Evaluator.endpointEntries([summary], spec);
  assert.equal(endpoints.length, 2);
  assert.ok(endpoints.every((row) => row.rawPValue < 0.01));
  assert.ok(endpoints.every((row) => row.pValue === 1));
  assert.ok(endpoints.every((row) => row.substitutedForNonEstimability));
});

test("Stage 2 short technical trajectory is deterministic and fully replay-verifiable", () => {
  const { spec } = C.loadSpec();
  const { candidateSha256 } = C.loadCandidates();
  const smokeSpec = JSON.parse(JSON.stringify(spec));
  smokeSpec.population.maxPly = 10;
  const smokeSpecSha256 = "technical-smoke-stage2-not-formal-corpus";
  const first = C.runGame(smokeSpec, smokeSpecSha256, candidateSha256, 0);
  const second = C.runGame(smokeSpec, smokeSpecSha256, candidateSha256, 0);
  assert.deepEqual(first, second);
  const verified = Verifier.verifyGame(first, 0, smokeSpec, smokeSpecSha256, candidateSha256);
  assert.equal(verified.seed, smokeSpec.population.seedStart);
  assert.equal(verified.conditionId, "B-D1");
  assert.equal(verified.plies, first.plies);
});
