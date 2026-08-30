#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_0_SOURCE_PREFLIGHT_SPEC.json");
const OUT = path.resolve(process.argv[2] || "artifacts/local/tmgc-stage0-source-preflight");

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
function openingHash(moveKeys, length) { return sha256(stable({ length, moveKeys: moveKeys.slice(0, length) })); }
function moveKey(move) { return AI.moveKey(move); }
function sameMoveKey(a, b) { return moveKey(a) === b; }
function reusablePits(state) { return state.pits[state.player].flat().filter((value) => value >= 2).length; }
function c03MoveMatches(move) {
  return move.type === "takata" && move.phase === "mtaji" && move.row === E.BACK
    && move.direction === "right" && (move.side ?? null) === null
    && (move.houseChoice ?? null) === null && Boolean(move.houseTwo) === false;
}
function eligibleRoot(state, ply) {
  if (ply < 8 || state.winner !== null || state.phase !== "mtaji") return false;
  const legal = E.moveVariants(state);
  return legal.length >= 2 && reusablePits(state) <= 2 && legal.some(c03MoveMatches);
}
function aiMove(state, stratum, random) {
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
    throw new Error(`Incomplete technical source generator search: ${stratum.id}`);
  }
  return result.move;
}
function generateGame(spec, gameIndex) {
  const seed = spec.technicalPopulation.seedStart + gameIndex;
  const stratum = spec.technicalPopulation.strata[gameIndex % spec.technicalPopulation.strata.length];
  const random = seededRandom(seed);
  let state = E.initialState();
  const rawHashes = [];
  const moves = [];
  const eligible = [];
  for (let ply = 0; ply <= spec.technicalPopulation.maxPly; ply += 1) {
    const stateHash = rawHash(state);
    rawHashes.push(stateHash);
    if (eligibleRoot(state, ply)) eligible.push({ ply, rawStateHash: stateHash, state: clone(state) });
    if (state.winner !== null || ply === spec.technicalPopulation.maxPly) break;
    const legal = E.moveVariants(state);
    if (!legal.length) break;
    let move;
    if (ply < spec.technicalPopulation.openingPlies) {
      move = legal[Math.floor(random() * legal.length)];
    } else {
      move = aiMove(state, stratum, random);
    }
    moves.push({ ply, move: clone(move), moveKey: moveKey(move), beforeRawStateHash: stateHash });
    state = E.applyMove(state, move).state;
  }
  const rawTrajectoryHash = sha256(stable(rawHashes));
  const prefixHash = openingHash(moves.map((row) => row.moveKey), spec.technicalPopulation.openingPlies);
  const ranked = eligible.map((row) => ({
    ...row,
    rank: sha256(`TMGC-ROOT-v1|TM-S2-C03|${rawTrajectoryHash}|${row.rawStateHash}|${row.ply}`),
  })).sort((a, b) => a.rank.localeCompare(b.rank) || a.ply - b.ply);
  const selected = ranked[0] || null;
  return {
    gameIndex, seed, stratumId: stratum.id, sourceFamily: stratum.family,
    rawTrajectoryHash, openingPrefixHash: prefixHash, plies: moves.length,
    rawStateHashes: rawHashes,
    moves,
    selected: selected ? { ply: selected.ply, rawStateHash: selected.rawStateHash, state: selected.state, rank: selected.rank } : null,
  };
}
function replayExact(game) {
  let state = E.initialState();
  const hashes = [];
  for (let ply = 0; ply <= game.moves.length; ply += 1) {
    hashes.push(rawHash(state));
    if (ply === game.moves.length) break;
    const row = game.moves[ply];
    if (row.beforeRawStateHash !== rawHash(state)) return false;
    const legal = E.moveVariants(state);
    const match = legal.find((move) => sameMoveKey(move, row.moveKey));
    if (!match) return false;
    state = E.applyMove(state, match).state;
  }
  return sha256(stable(hashes)) === game.rawTrajectoryHash;
}
function counts(values) {
  const out = {};
  for (const value of values) out[value] = (out[value] || 0) + 1;
  return out;
}
function maxShare(map, total) { return total ? Math.max(...Object.values(map)) / total : 1; }
function selectUniqueRoots(games) {
  const trajectoryRep = new Map();
  for (const game of games) {
    const current = trajectoryRep.get(game.rawTrajectoryHash);
    if (!current || game.seed < current.seed) trajectoryRep.set(game.rawTrajectoryHash, game);
  }
  const candidates = [...trajectoryRep.values()].filter((game) => game.selected);
  const byRaw = new Map();
  for (const game of candidates) {
    const key = game.selected.rawStateHash;
    const current = byRaw.get(key);
    if (!current || game.rawTrajectoryHash < current.rawTrajectoryHash
      || (game.rawTrajectoryHash === current.rawTrajectoryHash && game.seed < current.seed)) byRaw.set(key, game);
  }
  return [...byRaw.values()];
}
function compactGame(game) {
  return {
    gameIndex: game.gameIndex, seed: game.seed, stratumId: game.stratumId, sourceFamily: game.sourceFamily,
    rawTrajectoryHash: game.rawTrajectoryHash, openingPrefixHash: game.openingPrefixHash, plies: game.plies,
    moves: game.moves.map(({ ply, move, moveKey: key, beforeRawStateHash }) => ({ ply, move, moveKey: key, beforeRawStateHash })),
    selected: game.selected ? { ply: game.selected.ply, rawStateHash: game.selected.rawStateHash, rank: game.selected.rank } : null,
  };
}
function main() {
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const start = performance.now();
  const games = [];
  const gameRuntimeMs = [];
  for (let index = 0; index < spec.technicalPopulation.games; index += 1) {
    const one = performance.now();
    games.push(generateGame(spec, index));
    gameRuntimeMs.push(performance.now() - one);
  }
  const generationWallMs = performance.now() - start;
  const replayPass = games.every(replayExact);
  const rerunIndices = spec.technicalPopulation.strata.map((_, index) => index);
  const reruns = rerunIndices.map((index) => {
    const rerun = generateGame(spec, index);
    return { index, exact: stable(compactGame(rerun)) === stable(compactGame(games[index])) };
  });
  const selected = selectUniqueRoots(games);
  const strataCounts = counts(games.map((g) => g.stratumId));
  const openingCounts = counts(games.map((g) => g.openingPrefixHash));
  const selectedStrata = counts(selected.map((g) => g.stratumId));
  const selectedFamilies = counts(selected.map((g) => g.sourceFamily));
  const selectedOpenings = counts(selected.map((g) => g.openingPrefixHash));
  const uniqueTrajectories = new Set(games.map((g) => g.rawTrajectoryHash)).size;
  const compact = Buffer.from(JSON.stringify(games.map(compactGame)), "utf8");
  const gzip = zlib.gzipSync(compact, { level: 9 });
  const meanGameWallSeconds = generationWallMs / 1000 / games.length;
  const projectedShardWallSeconds = meanGameWallSeconds * spec.sourceContractForFutureScientificStages.scientificShardGames;
  const projectedShardCompactGzipBytes = Math.ceil(gzip.length / games.length
    * spec.sourceContractForFutureScientificStages.scientificShardGames);
  const gates = spec.technicalPassGates;
  const checks = {
    allGamesGenerated: games.length === spec.technicalPopulation.games,
    exactGamesPerStratum: Object.values(strataCounts).length === spec.technicalPopulation.strata.length
      && Object.values(strataCounts).every((n) => n === gates.exactGamesPerStratum),
    minimumUniqueRawTrajectoryCount: uniqueTrajectories >= gates.minimumUniqueRawTrajectoryCount,
    minimumDistinctOpeningPrefixCount: Object.keys(openingCounts).length >= gates.minimumDistinctOpeningPrefixCount,
    maximumSingleOpeningPrefixShare: maxShare(openingCounts, games.length) <= gates.maximumSingleOpeningPrefixShare,
    minimumSelectedC03ExactRoots: selected.length >= gates.minimumSelectedC03ExactRoots,
    minimumSelectedRootSourceStrata: Object.keys(selectedStrata).length >= gates.minimumSelectedRootSourceStrata,
    maximumSelectedRootSingleStratumShare: maxShare(selectedStrata, selected.length) <= gates.maximumSelectedRootSingleStratumShare,
    minimumSelectedRootSourceFamilies: Object.keys(selectedFamilies).length >= gates.minimumSelectedRootSourceFamilies,
    maximumSelectedRootSingleFamilyShare: maxShare(selectedFamilies, selected.length) <= gates.maximumSelectedRootSingleFamilyShare,
    minimumSelectedRootDistinctOpeningPrefixes: Object.keys(selectedOpenings).length >= gates.minimumSelectedRootDistinctOpeningPrefixes,
    maximumSelectedRootSingleOpeningPrefixShare: maxShare(selectedOpenings, selected.length) <= gates.maximumSelectedRootSingleOpeningPrefixShare,
    minimumExactDeterministicReruns: reruns.length >= gates.minimumExactDeterministicReruns && reruns.every((row) => row.exact),
    allRecordedTrajectoriesReplayExactly: replayPass,
    maximumProjected256GameShardWallSeconds: projectedShardWallSeconds <= gates.maximumProjected256GameShardWallSeconds,
    maximumProjected256GameCompactGzipBytes: projectedShardCompactGzipBytes <= gates.maximumProjected256GameCompactGzipBytes,
    maximumObservedRssKb: process.resourceUsage().maxRSS <= gates.maximumObservedRssKb,
  };
  const scientificLeakageGuard = {
    candidateConsequenceComputed: false,
    tacticalSearchComputed: false,
    winnerUsedForSelectionOrGate: false,
    futureMotifOccurrenceUsedForSelectionOrGate: false,
  };
  const result = {
    schemaVersion: "TMGC_STAGE0_SOURCE_PREFLIGHT_RESULT_V1",
    studyId: spec.studyId,
    stageId: spec.stageId,
    stageType: "TECHNICAL_ONLY_SOURCE_PREFLIGHT",
    scientificInferenceAuthorized: false,
    scientificSeedUseAllowed: false,
    technicalSeedStart: spec.technicalPopulation.seedStart,
    technicalSeedEnd: spec.technicalPopulation.seedEnd,
    specSha256: sha256(specText),
    scientificLeakageGuard,
    population: {
      games: games.length,
      strataCounts,
      uniqueRawTrajectories: uniqueTrajectories,
      distinctOpeningPrefixes: Object.keys(openingCounts).length,
      maximumSingleOpeningPrefixShare: maxShare(openingCounts, games.length),
    },
    c03ExactSupply: {
      selectedUniqueRawRoots: selected.length,
      sourceStrataCounts: selectedStrata,
      sourceFamilyCounts: selectedFamilies,
      distinctOpeningPrefixes: Object.keys(selectedOpenings).length,
      maximumSingleOpeningPrefixShare: maxShare(selectedOpenings, selected.length),
    },
    deterministicReruns: reruns,
    replay: { allRecordedTrajectoriesReplayExactly: replayPass },
    resource: {
      generationWallMs,
      meanGameWallMs: generationWallMs / games.length,
      maxGameWallMs: Math.max(...gameRuntimeMs),
      maxRssKb: process.resourceUsage().maxRSS,
      compactBytes: compact.length,
      compactGzipBytes: gzip.length,
      projected256GameShardWallSeconds,
      projected256GameCompactGzipBytes,
    },
    checks,
    disposition: Object.values(checks).every(Boolean) ? "SOURCE-PREFLIGHT-PASS" : "SOURCE-PREFLIGHT-FAIL",
  };
  fs.writeFileSync(path.join(OUT, "STAGE_0_SOURCE_PREFLIGHT_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT, "compact-trajectories.json.gz"), gzip);
  fs.writeFileSync(path.join(OUT, "selected-root-identities.json"), `${JSON.stringify(selected.map((g) => ({
    seed: g.seed, stratumId: g.stratumId, sourceFamily: g.sourceFamily,
    rawTrajectoryHash: g.rawTrajectoryHash, openingPrefixHash: g.openingPrefixHash,
    ply: g.selected.ply, rawStateHash: g.selected.rawStateHash,
  })), null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (result.disposition !== "SOURCE-PREFLIGHT-PASS") process.exitCode = 2;
}

if (require.main === module) main();
