"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const Spec = require("../tools/experiments/validate-tactical-motif-stage1-spec.js");
const TM = require("../tools/experiments/lib/tactical-motif-features.js");
const Discovery = require("../tools/experiments/lib/tactical-motif-discovery.js");

const { spec, specSha256 } = Spec.loadSpec();
assert.equal(Spec.validateSpec(spec), true);
assert.match(specSha256, /^[a-f0-9]{64}$/);
assert.equal(spec.authorization.generationAuthorizedBySpecAlone, false);
assert.equal(spec.stage2Boundary.stage2GenerationAuthorizedByThisSpec, false);

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const before = JSON.stringify(state);
  const transition = TM.summarizeMoveTransition(state, move);
  const envelope = TM.summarizeReplyEnvelope(state, move, spec.measurement.responseEnvelope.numericFields);
  assert.equal(JSON.stringify(state), before, "Stage 1 instrumentation must not mutate roots");
  assert.equal(transition.moveKey, AI.moveKey(move));
  assert.equal(envelope.replyCount, transition.replySet.count);
  assert.equal(envelope.replies.length, transition.replySet.count);
  assert.equal(Object.hasOwn(envelope.actorDeltaFromRoot, "legalMoveCount"), true);
}

{
  const state = E.initialState();
  const trace = TM.analyzeExactRootValues(state, [1, 2, 3], {
    evaluationProfile: spec.measurement.rootSearch.evaluationProfile,
    quiescenceDepth: spec.measurement.rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: spec.measurement.rootSearch.orderQuiescenceCaptures,
  });
  const d3 = trace.results.find(({ depth }) => depth === 3);
  const move = E.moveVariants(state)[0];
  const moveKey = AI.moveKey(move);
  const d3Candidate = d3.candidates.find((candidate) => candidate.moveKey === moveKey);
  const transition = TM.summarizeMoveTransition(state, move);
  const responseEnvelope = TM.summarizeReplyEnvelope(state, move, spec.measurement.responseEnvelope.numericFields);
  const measurement = {
    phase: state.phase,
    historicalTrajectoryHash: "a".repeat(64),
    ruleStateKey: transition.beforeIdentity.ruleStateKey,
    conditionId: "B-D1",
    openingPrefixHash: "b".repeat(64),
    root: { actor: require("../tools/experiments/lib/position-typology-features.js").playerFeatures(state, state.player) },
    moves: [{
      moveKey,
      transition,
      responseEnvelope,
      search: {
        d3ScoreMinusStateMedian: 0,
        d3IsTopSet: d3Candidate.isTopSet,
        d3AtOrAboveStateMedian: true,
        d3UniqueWorst: false,
      },
    }],
  };
  const first = Discovery.recordCandidateInstances(measurement, spec);
  const second = Discovery.recordCandidateInstances(measurement, spec);
  assert.deepEqual(first.map(({ descriptor }) => descriptor), second.map(({ descriptor }) => descriptor),
    "candidate grammar is deterministic");
  assert.ok(first.length > 0);
  assert.ok(first.every(({ descriptor }) => descriptor.phase === state.phase));
  assert.ok(first.some(({ descriptor }) => descriptor.moveAbstractionMode === "coarse-no-index"));
  assert.ok(first.some(({ descriptor }) => descriptor.moveAbstractionMode === "indexed"));
}

console.log("Tactical motif Stage 1 pre-generation tooling tests passed");
