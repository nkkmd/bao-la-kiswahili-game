"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const { extractPositionTypologyObservation, hashValue, identityKeys } = require("./position-typology-features.js");
const Raw = require("./ssgtc-representation-production.js");

const ROOT = path.resolve(__dirname, "../../..");
const STUDY_DIR = "doc/position-evaluation-empirical-outcome-calibration-replication";
const SPEC_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const STAGE0_RESULT_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_0_TECHNICAL_RESULT.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage1-development-v1");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/ssgtc-representation-production.js",
  "tools/experiments/lib/g2-01-calibration-stage1-common.js",
  "tools/experiments/validate-g2-01-calibration-stage1-spec.js",
  "tools/experiments/run-g2-01-calibration-stage1.js",
  "tools/experiments/verify-g2-01-calibration-stage1-independent.js",
  "tools/experiments/analyze-g2-01-calibration-stage1.js",
  "tools/experiments/run-g2-01-calibration-stage1-pipeline-smoke.js",
  `${STUDY_DIR}/preregistration/STAGE_1_DEVELOPMENT_SPEC.json`,
  `${STUDY_DIR}/results/STAGE_0_TECHNICAL_RESULT.json`,
]);

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}
function gitValue(args, fallback = null) {
  try { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return fallback; }
}
function loadSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256(text), text };
}
function sourceFileSha256() {
  return Object.fromEntries(SOURCE_FILES.map((file) => {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing Stage 1 frozen source file: ${file}`);
    return [file, sha256(fs.readFileSync(full))];
  }));
}
function provenance() {
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...SOURCE_FILES], "")),
    sourceFileSha256: sourceFileSha256(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  };
}
function loadAuthorization(spec, specSha256) {
  if (!fs.existsSync(AUTH_PATH)) throw new Error("Stage 1 generation blocked: authorization file absent");
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  const stage0Text = fs.readFileSync(STAGE0_RESULT_PATH, "utf8");
  const stage0 = JSON.parse(stage0Text);
  if (auth?.schemaVersion !== 1 || auth.studyId !== spec.studyId || auth.stageId !== spec.stageId
    || auth.specSha256 !== specSha256 || auth.stage1GenerationAuthorized !== true
    || auth.stage1ScientificOutcomeGenerationAuthorized !== true
    || auth.stage1FormalCalibrationInferenceAuthorized !== false
    || auth.confirmatoryReuseAllowed !== false
    || auth.stage0ResultSha256 !== sha256(stage0Text)
    || stage0.decision !== "STAGE0-TECHNICAL-PASS"
    || stage0.scientificInferenceAuthorized !== false) {
    throw new Error("Invalid Stage 1 authorization semantics/spec/Stage 0 binding");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 1 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}
function openingPrefixIdentity(moves, spec) {
  const moveKeys = moves.slice(0, spec.population.opening.plies).map((row) => row.moveKey);
  return { length: moveKeys.length, moveKeys, hash: hashValue({ length: moveKeys.length, moveKeys }) };
}
function continuationMove(state, spec, random) {
  const g = spec.population.continuation;
  const result = AI.analyzeMove(state, g.level, random, {
    evaluationProfile: g.evaluationProfile,
    searchProfile: g.searchProfile,
    maxDepth: g.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: g.quiescenceDepth,
    orderQuiescenceCaptures: g.orderQuiescenceCaptures,
    adaptive: g.adaptive,
    stableBestDepths: g.stableBestDepths,
    aspirationWindow: g.aspirationWindow,
  });
  if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) {
    throw new Error("Incomplete frozen Stage 1 continuation search");
  }
  return result;
}
function observationFor(state, context) {
  Raw.assertStudyState(state);
  const observation = extractPositionTypologyObservation(state, context);
  observation.identity.rawStateKey = Raw.stateKey(state);
  return observation;
}
function runGame(spec, specSha256, gameIndex, seedOverride = null, gameIdPrefix = "peocr-s1") {
  const seed = seedOverride === null ? spec.population.seedStart + gameIndex : seedOverride;
  const random = seededRandom(seed);
  const gameId = `${gameIdPrefix}-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = observationFor(state, { gameId, conditionId: "P2-D2", seed, ply });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    let source;
    let generationSearch = null;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      if (!legal.length) throw new Error("Nonterminal Stage 1 opening state has no legal move");
      move = legal[Math.floor(random() * legal.length)];
      source = "opening-seeded-uniform";
    } else {
      const result = continuationMove(state, spec, random);
      move = result.move;
      source = "frozen-continuation-ai";
      generationSearch = {
        completedDepth: result.stats.completedDepth,
        nodes: result.stats.nodes,
        quiescenceNodes: result.stats.quiescenceNodes,
        cutoffs: result.stats.cutoffs,
        evaluations: result.stats.evaluations,
        rootScore: result.stats.rootScore,
        timedOut: result.stats.timedOut,
      };
    }
    if (!move) throw new Error("Frozen Stage 1 generator returned no move for nonterminal state");
    const applied = E.applyMove(state, move);
    Raw.assertStudyState(applied.state);
    const after = identityKeys(applied.state);
    moves.push({
      ply,
      player: state.player,
      source,
      move: JSON.parse(JSON.stringify(move)),
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: observation.identity.historicalStateHash,
      beforeRawStateKey: observation.identity.rawStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRawStateKey: Raw.stateKey(applied.state),
      generationSearch,
    });
    state = applied.state;
  }
  return {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    gameId,
    gameIndex,
    seed,
    conditionId: "P2-D2",
    observations,
    moves,
    openingPrefix: openingPrefixIdentity(moves, spec),
    historicalTrajectoryHash: hashValue(observations.map((row) => row.identity.historicalStateHash)),
    rawTrajectoryHash: hashValue(observations.map((row) => row.identity.rawStateKey)),
    winner: state.winner,
    reason: state.reason || (state.winner === null ? "max-ply" : ""),
    administrativeTruncation: state.winner === null,
    plies: moves.length,
  };
}
function representativeGames(games) {
  const groups = new Map();
  for (const game of games) {
    const list = groups.get(game.historicalTrajectoryHash) || [];
    list.push(game); groups.set(game.historicalTrajectoryHash, list);
  }
  return [...groups.values()]
    .map((list) => list.sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId))[0])
    .sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}
function assignedPhase(hash, spec) {
  const digest = sha256(`${spec.stateSelection.phaseAssignment.salt}|${hash}`);
  return Number(BigInt(`0x${digest}`) % 2n) === 0
    ? spec.stateSelection.phaseAssignment.mapping.even : spec.stateSelection.phaseAssignment.mapping.odd;
}
function selectionRank(game, observation, spec) {
  return sha256(`${spec.stateSelection.withinAssignedPhase.salt}|${game.historicalTrajectoryHash}|${observation.identity.rawStateKey}|${observation.ply}`);
}
function selectStates(games, spec) {
  const representatives = representativeGames(games);
  const provisional = [];
  let unavailableAssignedPhase = 0;
  for (const game of representatives) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = game.observations.filter((observation) => observation.ply >= spec.stateSelection.minimumPly
      && observation.terminal === false && observation.phase === phase);
    if (!eligible.length) { unavailableAssignedPhase += 1; continue; }
    const ranked = eligible.map((observation) => ({ observation, rank: selectionRank(game, observation, spec) }))
      .sort((a, b) => a.rank.localeCompare(b.rank));
    provisional.push({ game, phase, observation: ranked[0].observation, selectionRank: ranked[0].rank });
  }
  provisional.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash) || a.game.seed - b.game.seed);
  const byRaw = new Map();
  for (const row of provisional) {
    const key = row.observation.identity.rawStateKey;
    const list = byRaw.get(key) || []; list.push(row); byRaw.set(key, list);
  }
  const selected = [...byRaw.values()].map((list) => list.sort((a, b) =>
    a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash) || a.game.seed - b.game.seed)[0]);
  selected.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return {
    representatives,
    provisional,
    selected,
    unavailableAssignedPhase,
    duplicateSelectedRawStatesCollapsed: provisional.length - selected.length,
  };
}
function stateFromObservation(observation) {
  const state = {
    pits: observation.state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: [...observation.state.reserve],
    houseOwned: [...observation.state.houseOwned],
    player: observation.player,
    phase: observation.phase,
    winner: observation.winner,
    reason: observation.reason || "",
    turn: observation.turn,
    pending: [...observation.state.pending],
  };
  Raw.assertStudyState(state);
  return state;
}
function measureSelected(row, spec) {
  const state = stateFromObservation(row.observation);
  const actor = state.player;
  const actorFeatures = row.observation.features.actor;
  const opponentFeatures = row.observation.features.opponent;
  const staticBaoEvaluation = AI.evaluate(state, actor);
  const administrativeTruncation = row.game.winner === null;
  return {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    gameId: row.game.gameId,
    seed: row.game.seed,
    historicalTrajectoryHash: row.game.historicalTrajectoryHash,
    rawStateKey: row.observation.identity.rawStateKey,
    historicalStateHash: row.observation.identity.historicalStateHash,
    openingPrefixHash: row.game.openingPrefix.hash,
    openingPrefixLength: row.game.openingPrefix.length,
    ply: row.observation.ply,
    phase: row.phase,
    actorSeat: actor,
    selectionRank: row.selectionRank,
    staticBaoEvaluation,
    forcedCapture: actorFeatures.forcedCapture,
    legalMoveCount: actorFeatures.legalMoveCount,
    captureMoveCount: actorFeatures.captureMoveCount,
    actorReserve: actorFeatures.reserve,
    opponentReserve: opponentFeatures.reserve,
    actorHouseOwned: actorFeatures.houseOwned,
    opponentHouseOwned: opponentFeatures.houseOwned,
    actorNyumbaSeeds: actorFeatures.nyumbaSeeds,
    opponentNyumbaSeeds: opponentFeatures.nyumbaSeeds,
    finalWinner: row.game.winner,
    finalReason: row.game.reason,
    administrativeTruncation,
    actorWin: administrativeTruncation ? null : row.game.winner === actor ? 1 : 0,
  };
}
function fitIsotonicPhase(rows) {
  if (!rows.length) return { eligible: false, reason: "no-rows" };
  const sorted = [...rows].sort((a, b) => a.z - b.z || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const support = [];
  for (const row of sorted) {
    const last = support[support.length - 1];
    if (last && last.z === row.z) { last.weight += 1; last.sumY += row.y; }
    else support.push({ z: row.z, weight: 1, sumY: row.y });
  }
  const blocks = [];
  for (const point of support) {
    blocks.push({ minZ: point.z, maxZ: point.z, weight: point.weight, sumY: point.sumY, mean: point.sumY / point.weight });
    while (blocks.length >= 2 && blocks[blocks.length - 2].mean > blocks[blocks.length - 1].mean) {
      const right = blocks.pop(); const left = blocks.pop();
      const weight = left.weight + right.weight; const sumY = left.sumY + right.sumY;
      blocks.push({ minZ: left.minZ, maxZ: right.maxZ, weight, sumY, mean: sumY / weight });
    }
  }
  return { eligible: blocks.length > 0 && blocks.every((b) => Number.isFinite(b.mean)), supportPoints: support.length, blocks };
}
function fitPhaseStratifiedPava(rows) {
  const phaseFits = {};
  for (const phase of ["namua", "mtaji"]) {
    const fit = fitIsotonicPhase(rows.filter((row) => row.phase === phase));
    if (!fit.eligible) return { eligible: false, reason: `${phase}:${fit.reason || "fit-failed"}`, phaseFits: { ...phaseFits, [phase]: fit } };
    phaseFits[phase] = fit;
  }
  return { eligible: true, phaseFits };
}
function clipProbability(p, spec) {
  const c = spec.modelDevelopment.formalPredictionClipping;
  return Math.min(c.upper, Math.max(c.lower, p));
}
function predictPava(fit, phase, z, spec) {
  const blocks = fit.phaseFits[phase].blocks;
  let chosen = blocks[0];
  if (z >= blocks[0].minZ) {
    for (const block of blocks) { if (block.minZ <= z) chosen = block; else break; }
  }
  return clipProbability(chosen.mean, spec);
}
function gamePath(output, index) { return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`); }
function measurementPath(output, index) { return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`); }
function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, index) => {
    const file = gamePath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 1 game file: ${file}`);
    return readJson(file);
  });
}

module.exports = {
  AI, AUTH_PATH, DEFAULT_OUTPUT, E, ROOT, SOURCE_FILES, SPEC_PATH, STAGE0_RESULT_PATH,
  assignedPhase, clipProbability, continuationMove, fitIsotonicPhase, fitPhaseStratifiedPava,
  gamePath, loadAuthorization, loadSpec, measureSelected, measurementPath, openingPrefixIdentity,
  predictPava, provenance, readGames, readJson, representativeGames, runGame, selectStates,
  selectionRank, sha256, sourceFileSha256, stateFromObservation, writeJson,
};
