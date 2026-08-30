"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");

const WIN = 1_000_000;
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
function actorView(state, player) {
  if (state.player === player) return state;
  const view = clone(state);
  view.player = player;
  return view;
}
function occupied(row) { return row.filter((value) => value > 0).length; }
function connections(row) {
  let count = 0;
  for (let i = 0; i < row.length - 1; i += 1) if (row[i] > 0 && row[i + 1] > 0) count += 1;
  return count;
}
function features(state, player) {
  const front = state.pits[player][E.FRONT];
  const back = state.pits[player][E.BACK];
  const all = [...front, ...back];
  const legal = E.moveVariants(actorView(state, player));
  return {
    houseOwned: Boolean(state.houseOwned[player]),
    nyumbaSeeds: front[E.HOUSE],
    reusablePits: all.filter((value) => value >= 2).length,
    frontOccupied: occupied(front),
    frontConnections: connections(front),
    legalMoveCount: legal.length,
    captureMoveCount: legal.filter((move) => move.type === "capture").length,
  };
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
  const actor = features(state, state.player);
  const legal = E.moveVariants(state);
  return legal.length >= 2 && actor.reusablePits <= 2 && legal.some(c03MoveMatches);
}
function sourceStratum(contract, gameIndex) {
  return contract.sourcePopulation.strata[gameIndex % contract.sourcePopulation.strata.length];
}
function openingPrefixHash(moveKeys, prefixPlies) {
  const prefix = moveKeys.slice(0, prefixPlies);
  return sha256(stable({ length: prefix.length, moveKeys: prefix }));
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
    throw new Error(`Independent incomplete Stage1 source generator search: ${stratum.id}`);
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
  const candidates = [];
  for (let ply = 0; ply <= contract.sourcePopulation.maxPly; ply += 1) {
    const stateHash = rawHash(state);
    rawStateHashes.push(stateHash);
    if (eligibleRoot(state, ply)) candidates.push({ ply, rawStateHash: stateHash, state: clone(state) });
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
  candidates.forEach((row) => {
    row.rank = sha256(`TMGC-ROOT-v1|TM-S2-C03|${rawTrajectoryHash}|${row.rawStateHash}|${row.ply}`);
  });
  candidates.sort((a, b) => a.rank.localeCompare(b.rank) || a.rawStateHash.localeCompare(b.rawStateHash) || a.ply - b.ply);
  const selected = candidates[0] || null;
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
  const trajectories = {};
  for (const game of games) {
    const current = trajectories[game.rawTrajectoryHash];
    if (!current || game.seed < current.seed) trajectories[game.rawTrajectoryHash] = game;
  }
  const raw = {};
  for (const game of Object.values(trajectories)) {
    if (!game.selected) continue;
    const key = game.selected.rawStateHash;
    const current = raw[key];
    if (!current || game.rawTrajectoryHash < current.rawTrajectoryHash
      || (game.rawTrajectoryHash === current.rawTrajectoryHash && game.seed < current.seed)) raw[key] = game;
  }
  return Object.values(raw).map((game) => ({
    seed: game.seed, gameIndex: game.gameIndex, stratumId: game.stratumId, sourceFamily: game.sourceFamily,
    rawTrajectoryHash: game.rawTrajectoryHash, openingPrefixHash: game.openingPrefixHash,
    ply: game.selected.ply, rawStateHash: game.selected.rawStateHash, selectionRank: game.selected.rank,
    state: clone(game.selected.state),
  })).sort((a, b) => a.rawTrajectoryHash.localeCompare(b.rawTrajectoryHash)
    || a.rawStateHash.localeCompare(b.rawStateHash) || a.seed - b.seed);
}
function evaluationFunction(profile) {
  if (profile === "legacy") return (state, player) => AI.legacyEvaluate(state, player);
  if (profile === "bao" || profile === "bao-v2") return (state, player) => AI.evaluateWithProfile(state, player, profile);
  throw new Error(`Unsupported independent evaluationProfile: ${profile}`);
}
function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}
function quiescence(state, alpha, beta, player, evaluator, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter((move) => move.type === "capture");
  if (!captures.length || remaining === 0) return evaluator(state, player);
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const next = E.applyMove(state, move).state;
    const value = quiescence(next, alpha, beta, player, evaluator, ply + 1, remaining - 1);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}
function exactSearch(state, depth, alpha, beta, player, evaluator, qDepth, ply) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return quiescence(state, alpha, beta, player, evaluator, ply, qDepth);
  const legal = E.moveVariants(state);
  if (!legal.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of legal) {
    const next = E.applyMove(state, move).state;
    const value = exactSearch(next, depth - 1, alpha, beta, player, evaluator, qDepth, ply + 1);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}
function analyzeRoot(state, condition) {
  const player = state.player;
  const evaluator = evaluationFunction(condition.evaluationProfile || "bao");
  const rows = E.moveVariants(state).map((move) => {
    const next = E.applyMove(state, move).state;
    const score = exactSearch(next, condition.depth - 1, -Infinity, Infinity, player, evaluator, condition.quiescenceDepth, 1);
    return { moveKey: moveKey(move), score };
  });
  rows.sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = rows[0].score;
  const topSetMoveKeys = rows.filter((row) => row.score === bestScore).map((row) => row.moveKey).sort();
  return { bestScore, topSetMoveKeys, legalMoveCount: rows.length, rows };
}
function binLegal(value) { return value === 2 ? "2" : value <= 4 ? "3-4" : "5+"; }
function binOccupied(value) { return value === 0 ? "0" : value <= 2 ? "1-2" : value <= 5 ? "3-5" : "6-8"; }
function binConnections(value) { return value <= 1 ? "0-1" : value <= 4 ? "2-4" : "5+"; }
function boundaryDescriptors(state, candidateMove, root) {
  const actor = state.player;
  const opponent = 1 - actor;
  const a = features(state, actor);
  const o = features(state, opponent);
  return {
    candidatePitIndex: String(candidateMove.index),
    actorHouseOwned: String(Boolean(state.houseOwned[actor])),
    reusablePitsExact: String(a.reusablePits),
    legalMoveCountBin: binLegal(a.legalMoveCount),
    actorFrontOccupiedBin: binOccupied(a.frontOccupied),
    actorFrontConnectionsBin: binConnections(a.frontConnections),
    opponentFrontOccupiedBin: binOccupied(o.frontOccupied),
    sourceStratum: root.stratumId,
    sourceFamily: root.sourceFamily,
  };
}
function measureRoot(root, contract) {
  const state = clone(root.state);
  if (rawHash(state) !== root.rawStateHash) throw new Error("Independent selected root RAW identity mismatch");
  if (!eligibleRoot(state, root.ply)) throw new Error("Independent selected root not eligible");
  const matching = matchingC03Moves(state);
  const candidateMove = matching[0];
  if (!candidateMove) throw new Error("Independent candidate move missing");
  const candidateMoveKey = moveKey(candidateMove);
  const actor = state.player;
  const before = features(state, actor);
  const afterCandidate = E.applyMove(state, candidateMove).state;
  const after = features(afterCandidate, actor);
  const structuralSupport = after.nyumbaSeeds - before.nyumbaSeeds === 0;
  let worstReplyActorCaptureMoveDelta = null;
  if (afterCandidate.winner === null) {
    const replies = E.moveVariants(afterCandidate);
    if (replies.length) {
      const deltas = [];
      for (const reply of replies) {
        const afterReply = E.applyMove(afterCandidate, reply).state;
        deltas.push(features(afterReply, actor).captureMoveCount - before.captureMoveCount);
      }
      worstReplyActorCaptureMoveDelta = Math.min(...deltas);
    }
  }
  const searches = contract.referenceAndSensitivitySearch.conditions.map((condition) => {
    const result = analyzeRoot(state, condition);
    const candidate = result.rows.find((row) => row.moveKey === candidateMoveKey);
    if (!candidate) throw new Error(`Independent candidate absent from search ${condition.id}`);
    return {
      conditionId: condition.id,
      depth: condition.depth,
      quiescenceDepth: condition.quiescenceDepth,
      evaluationProfile: condition.evaluationProfile || "bao",
      candidateScore: candidate.score,
      candidateIsTopSet: candidate.score === result.bestScore,
      bestScore: result.bestScore,
      topSetMoveKeys: result.topSetMoveKeys,
      legalMoveCount: result.legalMoveCount,
    };
  });
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
    pairedPreconditionHolds: before.reusablePits <= 2,
    pairedConsequenceHolds: worstReplyActorCaptureMoveDelta === 0,
    worstReplyActorCaptureMoveDelta,
    boundary: boundaryDescriptors(state, candidateMove, root),
    searches,
  };
}
module.exports = { clone, collapseRoots, generateGame, measureRoot, rawHash, sha256, stable };
