"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const { playerFeatures } = require("./position-typology-features.js");
const Search = require("./position-complexity-search-diagnostic.js");

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function rawObject(state) {
  return {
    pits: clone(state.pits), reserve: clone(state.reserve), houseOwned: clone(state.houseOwned),
    player: state.player, phase: state.phase, winner: state.winner, pending: clone(state.pending || [0, 0]),
  };
}
function rawHash(state) { return sha256(stable(rawObject(state))); }
function moveKey(move) { return AI.moveKey(move); }
function reusablePits(state, player = state.player) {
  return state.pits[player].flat().filter((value) => value >= 2).length;
}
function c03MoveMatches(move) {
  return move.type === "takata" && move.phase === "mtaji" && move.row === E.BACK
    && move.direction === "right" && (move.side ?? null) === null
    && (move.houseChoice ?? null) === null && Boolean(move.houseTwo) === false;
}
function matchingC03Moves(state) {
  return E.moveVariants(state).filter(c03MoveMatches)
    .slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
}
function eligibleRoot(state, ply) {
  if (ply < 8 || state.winner !== null || state.phase !== "mtaji") return false;
  const legal = E.moveVariants(state);
  return legal.length >= 2 && reusablePits(state) <= 2 && legal.some(c03MoveMatches);
}
function openingPrefixHash(moveKeys, prefixPlies) {
  const prefix = moveKeys.slice(0, prefixPlies);
  return sha256(stable({ length: prefix.length, moveKeys: prefix }));
}
function sourceStratum(contract, gameIndex) {
  return contract.sourcePopulation.strata[gameIndex % contract.sourcePopulation.strata.length];
}
function generatorMove(state, stratum, random) {
  const result = AI.analyzeMove(state, "hard", random, {
    evaluationProfile: stratum.evaluationProfile,
    searchProfile: stratum.searchProfile,
    maxDepth: stratum.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: stratum.quiescenceDepth,
    orderQuiescenceCaptures: false,
    adaptive: false,
    stableBestDepths: 0,
    aspirationWindow: 0,
  });
  if (!result?.move || result.stats?.timedOut || result.stats?.completedDepth !== stratum.maxDepth) {
    throw new Error(`Incomplete Stage1 source generator search: ${stratum.id}`);
  }
  return result.move;
}
function generateGame(contract, seedStart, gameIndex) {
  const seed = seedStart + gameIndex;
  const stratum = sourceStratum(contract, gameIndex);
  const random = seededRandom(seed);
  let state = E.initialState();
  const rawStateHashes = [];
  const moves = [];
  const eligible = [];
  for (let ply = 0; ply <= contract.sourcePopulation.maxPly; ply += 1) {
    const stateHash = rawHash(state);
    rawStateHashes.push(stateHash);
    if (eligibleRoot(state, ply)) eligible.push({ ply, rawStateHash: stateHash, state: clone(state) });
    if (state.winner !== null || ply === contract.sourcePopulation.maxPly) break;
    const legal = E.moveVariants(state);
    if (!legal.length) break;
    let move;
    let source;
    if (ply < contract.sourcePopulation.openingPlies) {
      move = legal[Math.floor(random() * legal.length)];
      source = "opening-random";
    } else {
      move = generatorMove(state, stratum, random);
      source = "trajectory-ai";
    }
    moves.push({ ply, source, move: clone(move), moveKey: moveKey(move), beforeRawStateHash: stateHash });
    state = E.applyMove(state, move).state;
  }
  const rawTrajectoryHash = sha256(stable(rawStateHashes));
  const openingHash = openingPrefixHash(moves.map((row) => row.moveKey), contract.sourcePopulation.openingPlies);
  const ranked = eligible.map((row) => ({
    ...row,
    rank: sha256(`TMGC-ROOT-v1|TM-S2-C03|${rawTrajectoryHash}|${row.rawStateHash}|${row.ply}`),
  })).sort((a, b) => a.rank.localeCompare(b.rank) || a.rawStateHash.localeCompare(b.rawStateHash) || a.ply - b.ply);
  const selected = ranked[0] || null;
  return {
    schemaVersion: "TMGC_STAGE1_SOURCE_GAME_V1",
    gameIndex, seed, stratumId: stratum.id, sourceFamily: stratum.family,
    rawTrajectoryHash, openingPrefixHash: openingHash, plies: moves.length,
    rawStateHashes, moves,
    selected: selected ? {
      ply: selected.ply, rawStateHash: selected.rawStateHash, rank: selected.rank, state: selected.state,
    } : null,
  };
}
function collapseRoots(games) {
  const byTrajectory = new Map();
  for (const game of games) {
    const current = byTrajectory.get(game.rawTrajectoryHash);
    if (!current || game.seed < current.seed) byTrajectory.set(game.rawTrajectoryHash, game);
  }
  const candidates = [...byTrajectory.values()].filter((game) => game.selected);
  const byRaw = new Map();
  for (const game of candidates) {
    const key = game.selected.rawStateHash;
    const current = byRaw.get(key);
    if (!current || game.rawTrajectoryHash < current.rawTrajectoryHash
      || (game.rawTrajectoryHash === current.rawTrajectoryHash && game.seed < current.seed)) {
      byRaw.set(key, game);
    }
  }
  return [...byRaw.values()].map((game) => ({
    seed: game.seed, gameIndex: game.gameIndex, stratumId: game.stratumId, sourceFamily: game.sourceFamily,
    rawTrajectoryHash: game.rawTrajectoryHash, openingPrefixHash: game.openingPrefixHash,
    ply: game.selected.ply, rawStateHash: game.selected.rawStateHash, selectionRank: game.selected.rank,
    state: clone(game.selected.state),
  })).sort((a, b) => a.rawTrajectoryHash.localeCompare(b.rawTrajectoryHash)
    || a.rawStateHash.localeCompare(b.rawStateHash) || a.seed - b.seed);
}
function binLegal(value) { return value === 2 ? "2" : value <= 4 ? "3-4" : "5+"; }
function binOccupied(value) { return value === 0 ? "0" : value <= 2 ? "1-2" : value <= 5 ? "3-5" : "6-8"; }
function binConnections(value) { return value <= 1 ? "0-1" : value <= 4 ? "2-4" : "5+"; }
function boundaryDescriptors(state, candidateMove, root) {
  const actor = state.player;
  const opponent = 1 - actor;
  const actorFeatures = playerFeatures(state, actor);
  const opponentFeatures = playerFeatures(state, opponent);
  return {
    candidatePitIndex: String(candidateMove.index),
    actorHouseOwned: String(Boolean(state.houseOwned[actor])),
    reusablePitsExact: String(actorFeatures.reusablePits),
    legalMoveCountBin: binLegal(actorFeatures.legalMoveCount),
    actorFrontOccupiedBin: binOccupied(actorFeatures.frontOccupied),
    actorFrontConnectionsBin: binConnections(actorFeatures.frontConnections),
    opponentFrontOccupiedBin: binOccupied(opponentFeatures.frontOccupied),
    sourceStratum: root.stratumId,
    sourceFamily: root.sourceFamily,
  };
}
function searchMeasurement(state, candidateMoveKey, condition) {
  const result = Search.analyzeRootCandidates(state, condition.depth, {
    evaluationProfile: condition.evaluationProfile || "bao",
    quiescenceDepth: condition.quiescenceDepth,
    orderQuiescenceCaptures: false,
  });
  const candidate = result.candidates.find((row) => row.moveKey === candidateMoveKey);
  if (!candidate) throw new Error(`Candidate missing from exact search: ${condition.id}`);
  return {
    conditionId: condition.id,
    depth: condition.depth,
    quiescenceDepth: condition.quiescenceDepth,
    evaluationProfile: condition.evaluationProfile || "bao",
    candidateScore: candidate.score,
    candidateIsTopSet: candidate.isTopSet,
    bestScore: result.bestScore,
    topSetMoveKeys: result.topSetMoveKeys.slice().sort(),
    legalMoveCount: result.legalMoveCount,
  };
}
function measureRoot(root, contract) {
  const state = clone(root.state);
  if (rawHash(state) !== root.rawStateHash) throw new Error("Selected root RAW identity mismatch");
  if (!eligibleRoot(state, root.ply)) throw new Error("Selected root no longer C03-exact eligible");
  const matching = matchingC03Moves(state);
  if (!matching.length) throw new Error("Selected root has no C03 matching move");
  const candidateMove = matching[0];
  const candidateMoveKey = moveKey(candidateMove);
  const actor = state.player;
  const before = playerFeatures(state, actor);
  const afterCandidate = E.applyMove(state, candidateMove).state;
  const after = playerFeatures(afterCandidate, actor);
  const structuralSupport = after.nyumbaSeeds - before.nyumbaSeeds === 0;
  let worstReplyActorCaptureMoveDelta = null;
  if (afterCandidate.winner === null) {
    const replies = E.moveVariants(afterCandidate);
    if (replies.length) {
      worstReplyActorCaptureMoveDelta = Math.min(...replies.map((reply) => {
        const afterReply = E.applyMove(afterCandidate, reply).state;
        return playerFeatures(afterReply, actor).captureMoveCount - before.captureMoveCount;
      }));
    }
  }
  const pairedConsequenceHolds = worstReplyActorCaptureMoveDelta === 0;
  const searches = contract.referenceAndSensitivitySearch.conditions.map((condition) =>
    searchMeasurement(state, candidateMoveKey, condition));
  return {
    schemaVersion: "TMGC_STAGE1_MEASUREMENT_V1",
    seed: root.seed, gameIndex: root.gameIndex, stratumId: root.stratumId, sourceFamily: root.sourceFamily,
    rawTrajectoryHash: root.rawTrajectoryHash, openingPrefixHash: root.openingPrefixHash,
    ply: root.ply, rawStateHash: root.rawStateHash, selectionRank: root.selectionRank,
    legalMoveKeys: E.moveVariants(state).map(moveKey).sort(),
    matchingC03MoveKeys: matching.map(moveKey),
    candidateMoveKey,
    candidateMove: clone(candidateMove),
    structuralSupport,
    pairedPreconditionHolds: reusablePits(state) <= 2,
    pairedConsequenceHolds,
    worstReplyActorCaptureMoveDelta,
    boundary: boundaryDescriptors(state, candidateMove, root),
    searches,
  };
}
module.exports = {
  boundaryDescriptors, c03MoveMatches, clone, collapseRoots, eligibleRoot, generateGame,
  matchingC03Moves, measureRoot, moveKey, rawHash, rawObject, reusablePits, sha256, stable,
};
