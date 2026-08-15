"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const Spec = require("../tools/experiments/validate-tactical-motif-stage1-spec.js");
const TM = require("../tools/experiments/lib/tactical-motif-features.js");
const Discovery = require("../tools/experiments/lib/tactical-motif-discovery.js");
const Corpus = require("../tools/experiments/lib/tactical-motif-stage1-corpus.js");
const Runner = require("../tools/experiments/run-tactical-motif-stage1-exploratory.js");
const Verifier = require("../tools/experiments/verify-tactical-motif-stage1-exploratory.js");

const { spec, specSha256 } = Spec.loadSpec();
assert.equal(Spec.validateSpec(spec), true);
assert.match(specSha256, /^[a-f0-9]{64}$/);
assert.equal(spec.authorization.generationAuthorizedBySpecAlone, false);
assert.equal(spec.stage2Boundary.stage2GenerationAuthorizedByThisSpec, false);
assert.deepEqual(Array.from({ length: 6 }, (_, i) => Corpus.conditionForGame(spec, i).id),
  ["B-D1", "B-D2", "B-D3", "LS-D2", "V2-D2", "LE-D2"]);

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
}

{
  const technical = JSON.parse(JSON.stringify(spec));
  technical.population.maxPly = 10;
  const technicalSha = "c".repeat(64);
  for (let i = 0; i < 6; i += 1) {
    const first = Corpus.runGame(technical, technicalSha, i);
    const second = Corpus.runGame(technical, technicalSha, i);
    assert.deepEqual(first.moves.map(({ moveKey }) => moveKey), second.moves.map(({ moveKey }) => moveKey),
      `technical trajectory ${i} is deterministic`);
    const verified = Verifier.verifyGame(first, i, technical, technicalSha, true);
    assert.equal(verified.conditionId, Corpus.conditionForGame(technical, i).id);
    assert.equal(verified.historicalTrajectoryHash, first.historicalTrajectoryHash);
  }
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
      moveKey, transition, responseEnvelope,
      search: { d3ScoreMinusStateMedian: 0, d3IsTopSet: d3Candidate.isTopSet, d3AtOrAboveStateMedian: true, d3UniqueWorst: false },
    }],
  };
  const first = Discovery.recordCandidateInstances(measurement, spec);
  const second = Discovery.recordCandidateInstances(measurement, spec);
  assert.deepEqual(first.map(({ descriptor }) => descriptor), second.map(({ descriptor }) => descriptor),
    "candidate grammar is deterministic");
  assert.ok(first.some(({ descriptor }) => descriptor.moveAbstractionMode === "coarse-no-index"));
  assert.ok(first.some(({ descriptor }) => descriptor.moveAbstractionMode === "indexed"));
}

{
  const status = Runner.status("/tmp/tm-stage1-does-not-exist", spec, specSha256);
  assert.equal(status.authorizationFilePresent, true);
  assert.equal(status.generatedGames, 0);
  assert.equal(Object.keys(status.sourceFileSha256).length, Corpus.SOURCE_FILES.length);

  const { authorization, authorizationSha256 } = Corpus.loadAuthorization(specSha256);
  assert.equal(authorization.stage1GenerationAuthorized, true);
  assert.equal(authorization.scientificInferenceAuthorized, false);
  assert.equal(authorization.confirmatoryReuseAllowed, false);
  assert.match(authorizationSha256, /^[a-f0-9]{64}$/);
}

console.log("Tactical motif Stage 1 tooling tests passed");
