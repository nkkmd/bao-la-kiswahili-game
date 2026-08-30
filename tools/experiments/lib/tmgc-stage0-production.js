"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const PT = require("./position-typology-features.js");
const TM = require("./tactical-motif-features.js");
const Formal = require("./tactical-motif-stage2-formal.js");

const SEMANTICS = "tmgc-stage0-production/upstream-c03-reference/v1";

function stableStringify(value) { return PT.stableStringify(value); }
function moveKey(move) { return AI.moveKey(move); }

function normalizedSearch(trace) {
  return trace.results.map((result) => ({
    depth: result.depth,
    bestScore: result.bestScore,
    topSetMoveKeys: result.topSetMoveKeys.slice().sort(),
    candidates: result.candidates.map((row) => ({
      moveKey: row.moveKey,
      score: row.score,
      scoreRank: row.scoreRank,
      isTopSet: row.isTopSet,
    })).sort((a, b) => a.moveKey.localeCompare(b.moveKey)),
  }));
}

function analyzeFixture(state, candidate) {
  const before = stableStringify(state);
  const legalMoves = E.moveVariants(state);
  const actorFeatures = PT.playerFeatures(state, state.player);
  const preconditionHolds = state.phase === candidate.phase
    && Formal.rootSatisfiesCandidate(actorFeatures, candidate);
  const matchingMoves = Formal.canonicalMatchingMoves(legalMoves, candidate);
  const eligible = preconditionHolds && matchingMoves.length > 0;
  const base = {
    semantics: SEMANTICS,
    rawIdentityHash: PT.identityKeys(state).ruleStateKey,
    phase: state.phase,
    player: state.player,
    legalMoveKeys: legalMoves.map(moveKey).sort(),
    preconditionHolds,
    matchingMoveKeys: matchingMoves.map(moveKey),
    eligible,
  };
  if (!eligible) {
    if (stableStringify(state) !== before) throw new Error("Production analysis mutated ineligible fixture");
    return base;
  }

  const candidateMove = matchingMoves[0];
  const candidateMoveKey = moveKey(candidateMove);
  const transition = TM.summarizeMoveTransition(state, candidateMove);
  const responseEnvelope = TM.summarizeReplyEnvelope(state, candidateMove);
  const moveRecord = { transition, responseEnvelope };
  const search = TM.analyzeExactRootValues(state, [1, 2, 3], {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
  const successor = E.applyMove(state, candidateMove).state;
  const result = {
    ...base,
    candidateMoveKey,
    successorRawIdentityHash: PT.identityKeys(successor).ruleStateKey,
    structuralSuccess: Formal.candidateConsequenceHolds(moveRecord, candidate),
    pairedPreconditionHolds: Formal.pairedPreconditionHolds(actorFeatures, candidate),
    pairedConsequenceHolds: Formal.pairedConsequenceHolds(moveRecord, candidate),
    search: normalizedSearch(search),
  };
  if (stableStringify(state) !== before) throw new Error("Production analysis mutated fixture");
  return result;
}

module.exports = { SEMANTICS, analyzeFixture, moveKey, stableStringify };
