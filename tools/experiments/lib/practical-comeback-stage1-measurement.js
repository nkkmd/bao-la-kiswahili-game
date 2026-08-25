"use strict";

const Raw = require("./ssgtc-representation-production.js");
const P = require("./practical-comeback-stage0-production.js");
const Corpus = require("./practical-comeback-stage1-corpus.js");

function postReplyReference(rootActor, state, depth) {
  Raw.assertStudyState(state);
  if (state.winner !== null) {
    return {
      terminal: true,
      rootActorWon: state.winner === rootActor,
      bestScore: state.winner === rootActor ? P.WIN : -P.WIN,
      table: null,
    };
  }
  if (state.player !== rootActor) throw new Error("Expected root actor to move after opponent first reply");
  const table = P.referenceSearch(state, depth);
  return { terminal: false, rootActorWon: null, bestScore: table.bestScore, table };
}

function replyAnalysis(root, rootMove, spec) {
  Raw.assertStudyState(root);
  const rootActor = root.player;
  const rootApplied = P.applyExactMove(root, rootMove);
  const afterRoot = rootApplied.state;
  const rootMoveKey = Raw.moveKey(rootApplied.move);
  if (afterRoot.winner !== null) {
    return {
      rootMoveKey,
      successorRawStateKey: Raw.stateKey(afterRoot),
      terminalAfterRootMove: true,
      legalReplyCount: 0,
      legalReplyMoveKeys: [],
      referenceBestReplyMoveKeys: [],
      referenceBestReplyCount: 0,
      primaryFirstReplyPoolMoveKeys: [],
      referenceDefenseMaintainedMoveKeys: [],
      referenceDefenseMaintainedCount: 0,
      referenceDefenseMaintainedFraction: null,
      exactFirstReplyReferenceErrorProbability: null,
      uniqueLegalReply: false,
      uniqueReferenceBestReply: false,
      uniqueReferenceDefenseMaintainedReply: false,
      noReferenceDefenseMaintainedReply: true,
      referenceMostPunishingReplyMoveKeys: [],
      referenceMostPunishingReplyCount: 0,
      replies: [],
    };
  }

  const replies = P.exactLegalMoves(afterRoot);
  const opponentD2 = P.referenceSearch(afterRoot, spec.replyReference.opponentReferenceBest.searchDepth);
  const opponentD1 = P.referenceSearch(afterRoot, 1);
  const primaryPool = opponentD1.candidates.slice(0, Math.min(3, opponentD1.candidates.length)).map((row) => row.moveKey);
  const rows = replies.map((reply) => {
    const applied = P.applyExactMove(afterRoot, reply);
    const post = postReplyReference(rootActor, applied.state, 2);
    const maintained = post.terminal ? !post.rootActorWon : post.bestScore < 0;
    return {
      moveKey: Raw.moveKey(reply),
      move: reply,
      afterRawStateKey: Raw.stateKey(applied.state),
      terminalAfterReply: applied.state.winner !== null,
      winnerAfterReply: applied.state.winner,
      rootActorPostReplyD2BestScore: post.bestScore,
      rootActorPostReplyD2TableHash: post.table ? P.canonicalHash(post.table) : null,
      referenceDefenseMaintained: maintained,
      opponentD2ReferenceBest: opponentD2.topSetMoveKeys.includes(Raw.moveKey(reply)),
    };
  }).sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  const defenseKeys = rows.filter((row) => row.referenceDefenseMaintained).map((row) => row.moveKey);
  const defenseSet = new Set(defenseKeys);
  const fraction = rows.length ? defenseKeys.length / rows.length : null;
  const errorProbability = defenseKeys.length
    ? 1 - primaryPool.filter((key) => defenseSet.has(key)).length / primaryPool.length
    : null;
  const minimumScore = Math.min(...rows.map((row) => row.rootActorPostReplyD2BestScore));
  const punishmentKeys = rows.filter((row) => row.rootActorPostReplyD2BestScore === minimumScore).map((row) => row.moveKey);
  return {
    rootMoveKey,
    successorRawStateKey: Raw.stateKey(afterRoot),
    terminalAfterRootMove: false,
    legalReplyCount: rows.length,
    legalReplyMoveKeys: rows.map((row) => row.moveKey),
    referenceBestReplyMoveKeys: opponentD2.topSetMoveKeys,
    referenceBestReplyCount: opponentD2.topSetMoveKeys.length,
    primaryFirstReplyPoolMoveKeys: primaryPool,
    referenceDefenseMaintainedMoveKeys: defenseKeys,
    referenceDefenseMaintainedCount: defenseKeys.length,
    referenceDefenseMaintainedFraction: fraction,
    exactFirstReplyReferenceErrorProbability: errorProbability,
    uniqueLegalReply: rows.length === 1,
    uniqueReferenceBestReply: opponentD2.topSetMoveKeys.length === 1,
    uniqueReferenceDefenseMaintainedReply: defenseKeys.length === 1,
    noReferenceDefenseMaintainedReply: defenseKeys.length === 0,
    referenceMostPunishingReplyMoveKeys: punishmentKeys,
    referenceMostPunishingReplyCount: punishmentKeys.length,
    replies: rows,
  };
}

function compactContinuation(record, reply) {
  const firstReplyMoveKey = record.moves.length ? record.moves[0].moveKey : null;
  let firstReplyReferenceError = null;
  if (firstReplyMoveKey !== null && reply.referenceDefenseMaintainedCount >= 1) {
    firstReplyReferenceError = !reply.referenceDefenseMaintainedMoveKeys.includes(firstReplyMoveKey);
  }
  const boundedComeback96 = record.outcome.category === "ROOT_ACTOR_TERMINAL_WIN" ? 1 : 0;
  return {
    replicateIndex: record.replicateIndex,
    seed32: record.seed32,
    opponentPolicyId: record.opponentPolicyId,
    outcomeCategory: record.outcome.category,
    winner: record.outcome.winner,
    firstReplyMoveKey,
    firstReplyReferenceError,
    boundedComeback96,
    continuationPlies: record.moves.length,
    finalRawStateKey: record.finalRawStateKey,
    fullRecordSha256: record.recordSha256,
  };
}

function runCondition(root, move, reply, policy, spec) {
  const records = [];
  for (let replicateIndex = 0; replicateIndex < policy.replicatesPerExactRootMove; replicateIndex += 1) {
    const full = P.runAsymmetricContinuation(root, move, replicateIndex, {
      actorPolicyId: spec.continuation.rootActorPolicy,
      opponentPolicyId: policy.id,
      maxPostRootPlies: spec.continuation.maximumPostRootPlies,
      stageSalt: spec.continuation.stageSalt,
    });
    if (full.outcome.category === "TECHNICALLY_INVALID") throw new Error("Technically invalid continuation encountered");
    records.push(compactContinuation(full, reply));
  }
  const wins = records.reduce((sum, row) => sum + row.boundedComeback96, 0);
  const exhausted = records.filter((row) => row.outcomeCategory === "ADMINISTRATIVE_HORIZON_EXHAUSTED").length;
  return {
    policyId: policy.id,
    role: policy.role,
    replicates: records.length,
    boundedComebackWins: wins,
    boundedComebackFrequency: records.length ? wins / records.length : null,
    administrativeHorizonExhausted: exhausted,
    records,
  };
}

function measureRoot(selected, selectedIndex, spec) {
  Raw.assertStudyState(selected.state);
  const reference = P.referenceSearch(selected.state, spec.referenceComparator.depth);
  if (!(reference.bestScore < 0)) throw new Error("Selected root no longer satisfies frozen disadvantage rule");
  const legal = P.exactLegalMoves(selected.state);
  const morphology = Corpus.rootMorphology(selected.state);
  const rows = legal.map((move) => {
    const moveKey = Raw.moveKey(move);
    const searchRow = reference.candidates.find((row) => row.moveKey === moveKey);
    if (!searchRow) throw new Error(`Missing D3 search row for ${moveKey}`);
    const reply = replyAnalysis(selected.state, move, spec);
    const primary = runCondition(selected.state, move, reply, spec.continuation.primaryOpponentPolicy, spec);
    const secondary = runCondition(selected.state, move, reply, spec.continuation.secondaryOpponentPolicy, spec);
    const referenceCondition = runCondition(selected.state, move, reply, spec.continuation.referenceOpponentPolicy, spec);
    return {
      moveKey,
      move,
      d3ReferenceScore: searchRow.score,
      d3ReferenceRank: searchRow.scoreRank,
      d3ReferenceBest: searchRow.isTopSet,
      moveOptimalityGap: reference.bestScore - searchRow.score,
      strictReferenceInferior: reference.bestScore - searchRow.score > 0,
      reply,
      continuation: { primary, secondary, reference: referenceCondition },
    };
  });
  const canonicalBestMoveKey = reference.canonicalBestMoveKey;
  const canonicalBest = rows.find((row) => row.moveKey === canonicalBestMoveKey);
  if (!canonicalBest) throw new Error("Canonical reference best move missing from measured rows");
  for (const row of rows) {
    row.primaryComebackDifferenceVersusCanonicalBest = row.continuation.primary.boundedComebackFrequency - canonicalBest.continuation.primary.boundedComebackFrequency;
  }
  const measurement = {
    schemaVersion: 1,
    stageId: spec.stageId,
    selectedIndex,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleTrajectoryHash: selected.ruleTrajectoryHash,
    openingPrefixHash: selected.openingPrefixHash,
    conditionId: selected.conditionId,
    seed: selected.seed,
    ply: selected.ply,
    phase: selected.assignedPhase,
    rawStateKey: selected.rawStateKey,
    rootActor: selected.state.player,
    rootMorphology: morphology,
    referenceSearch: {
      semantics: reference.searchSemantics,
      depth: reference.depth,
      bestScore: reference.bestScore,
      topSetMoveKeys: reference.topSetMoveKeys,
      canonicalBestMoveKey,
      tableHash: P.canonicalHash(reference),
    },
    exactLegalMoveCount: rows.length,
    moves: rows,
  };
  measurement.measurementHash = P.canonicalHash(measurement);
  return measurement;
}

function accounting(measurements) {
  let interventions = 0;
  let primaryRows = 0;
  let secondaryRows = 0;
  let referenceRows = 0;
  let exhaustedPrimary = 0;
  for (const root of measurements) for (const move of root.moves) {
    interventions += 1;
    primaryRows += move.continuation.primary.records.length;
    secondaryRows += move.continuation.secondary.records.length;
    referenceRows += move.continuation.reference.records.length;
    exhaustedPrimary += move.continuation.primary.administrativeHorizonExhausted;
  }
  return { interventions, primaryRows, secondaryRows, referenceRows, totalContinuationRows: primaryRows + secondaryRows + referenceRows, exhaustedPrimary };
}

module.exports = { accounting, measureRoot, replyAnalysis };
