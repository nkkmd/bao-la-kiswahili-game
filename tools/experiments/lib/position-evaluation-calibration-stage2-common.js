"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const { extractPositionTypologyObservation, hashValue, identityKeys } = require("./position-typology-features.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = path.join(ROOT, "doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_STAGE1_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-calibration/stage1-exploratory-v1");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-calibration/stage2-formal-v1");

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}
function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch { return fallback; }
}
function loadSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(text);
  return { spec, specSha256: sha256(text) };
}
function sourceFiles(spec) { return spec.sourceFreeze.files; }
function sourceFileSha256(spec) {
  return Object.fromEntries(sourceFiles(spec).map((file) => {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing frozen Stage 2 source file: ${file}`);
    return [file, sha256(fs.readFileSync(full))];
  }));
}
function provenance(spec) {
  const files = sourceFiles(spec);
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...files], "")),
    sourceFileSha256: sourceFileSha256(spec),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  };
}
function loadAuthorization(spec, specSha256) {
  if (!fs.existsSync(AUTH_PATH)) throw new Error("Stage 2 generation blocked: authorization file absent");
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  if (auth?.schemaVersion !== 1 || auth.studyId !== spec.studyId || auth.stageId !== spec.stageId
    || auth.specSha256 !== specSha256 || auth.stage2GenerationAuthorized !== true
    || auth.stage2FormalInferenceAuthorized !== true || auth.stage1RefitAllowed !== false) {
    throw new Error("Invalid Stage 2 authorization semantics/spec binding");
  }
  const actual = sourceFileSha256(spec);
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 2 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}
function openingPrefixIdentity(moves, spec) {
  const moveKeys = moves.slice(0, spec.population.opening.plies).map(({ moveKey }) => moveKey);
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
    adaptive: false,
    stableBestDepths: 0,
    aspirationWindow: 0,
  });
  if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) {
    throw new Error("Incomplete frozen Stage 2 continuation search");
  }
  return result;
}
function runGame(spec, specSha256, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const random = seededRandom(seed);
  const gameId = `pec-s2-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, { gameId, conditionId: "P2-D2", seed, ply });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    let source;
    let generationSearch = null;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      if (!legal.length) throw new Error("Nonterminal Stage 2 opening state has no legal move");
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
    if (!move) throw new Error("Frozen Stage 2 generator returned no move for nonterminal state");
    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    moves.push({
      ply,
      player: state.player,
      source,
      move: JSON.parse(JSON.stringify(move)),
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: observation.identity.historicalStateHash,
      beforeRuleStateKey: observation.identity.ruleStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRuleStateKey: after.ruleStateKey,
      generationSearch,
    });
    state = applied.state;
  }
  const historicalTrajectoryHash = hashValue(observations.map((row) => row.identity.historicalStateHash));
  const ruleTrajectoryHash = hashValue(observations.map((row) => row.identity.ruleStateKey));
  return {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    formal: true,
    gameId,
    gameIndex,
    seed,
    conditionId: "P2-D2",
    observations,
    moves,
    openingPrefix: openingPrefixIdentity(moves, spec),
    historicalTrajectoryHash,
    ruleTrajectoryHash,
    winner: state.winner,
    reason: state.reason || (state.winner === null ? "max-ply" : ""),
    administrativeTruncation: state.winner === null,
    plies: moves.length,
  };
}
function gamePath(output, index) { return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`); }
function measurementPath(output, index) { return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`); }
function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, index) => {
    const file = gamePath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game file: ${file}`);
    return readJson(file);
  });
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
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0
    ? spec.stateSelection.phaseAssignment.mapping.even : spec.stateSelection.phaseAssignment.mapping.odd;
}
function selectionRank(game, observation, spec) {
  const fields = [game.historicalTrajectoryHash, observation.identity.ruleStateKey, observation.ply];
  return sha256(`${spec.stateSelection.withinAssignedPhase.salt}|${fields.join("|")}`);
}
function stateFromObservation(observation) {
  return {
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
}
function loadStage1Reference(stage1Output, spec) {
  const resultPath = path.join(stage1Output, "stage1-exploratory-calibration-result.json");
  const resultText = fs.readFileSync(resultPath, "utf8");
  if (sha256(resultText) !== spec.stage1Dependency.stage1ResultSha256) {
    throw new Error("Stage 1 calibration result SHA-256 mismatch");
  }
  const result = JSON.parse(resultText);
  if (result.selection.selectedFamily !== spec.stage1Dependency.selectedFamily || !result.fullFit?.eligible) {
    throw new Error("Stage 1 selected mapping identity mismatch");
  }
  const stage1Spec = readJson(path.join(ROOT, "doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_SPEC.json"));
  const stage1Games = Array.from({ length: stage1Spec.population.games }, (_, index) =>
    readJson(path.join(stage1Output, "games", `game-${String(index).padStart(4, "0")}.json`)));
  const stage1Measurements = fs.readdirSync(path.join(stage1Output, "measurements"))
    .filter((name) => /^selected-\d{4}\.json$/.test(name)).sort()
    .map((name) => readJson(path.join(stage1Output, "measurements", name)));
  if (sha256(JSON.stringify(stage1Measurements)) !== spec.stage1Dependency.stage1MeasurementHash) {
    throw new Error("Stage 1 measurement hash mismatch");
  }
  const trajectoryHashes = new Set();
  const openingPrefixHashes = new Set();
  const ruleStateKeys = new Set();
  for (const game of stage1Games) {
    trajectoryHashes.add(game.historicalTrajectoryHash);
    openingPrefixHashes.add(game.openingPrefix.hash);
    for (const observation of game.observations) ruleStateKeys.add(observation.identity.ruleStateKey);
  }
  return { result, trajectoryHashes, openingPrefixHashes, ruleStateKeys };
}
function predictFrozenModel(stage1Result, phase, staticBaoEvaluation) {
  const fit = stage1Result.fullFit.phaseFits[phase];
  if (!fit?.eligible || !fit.blocks?.length) throw new Error(`Missing frozen Stage 1 isotonic fit for ${phase}`);
  const z = staticBaoEvaluation / 100;
  const blocks = fit.blocks;
  if (z < blocks[0].minZ) return blocks[0].mean;
  let chosen = blocks[0];
  for (const block of blocks) {
    if (block.minZ <= z) chosen = block;
    else break;
  }
  return chosen.mean;
}
function selectStates(games, spec, stage1Reference) {
  const repsBeforeFirewall = representativeGames(games);
  const trajectoryEligible = [];
  let stage1TrajectoryOverlapExcluded = 0;
  let stage1OpeningPrefixOverlapExcluded = 0;
  for (const game of repsBeforeFirewall) {
    if (stage1Reference.trajectoryHashes.has(game.historicalTrajectoryHash)) {
      stage1TrajectoryOverlapExcluded += 1; continue;
    }
    if (stage1Reference.openingPrefixHashes.has(game.openingPrefix.hash)) {
      stage1OpeningPrefixOverlapExcluded += 1; continue;
    }
    trajectoryEligible.push(game);
  }
  const provisional = [];
  let unavailableAssignedPhase = 0;
  let stage1RuleStateObservationsExcluded = 0;
  for (const game of trajectoryEligible) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const phaseRows = game.observations.filter((observation) => observation.ply >= spec.stateSelection.minimumPly
      && observation.terminal === false && observation.phase === phase);
    const eligible = [];
    for (const observation of phaseRows) {
      if (stage1Reference.ruleStateKeys.has(observation.identity.ruleStateKey)) {
        stage1RuleStateObservationsExcluded += 1;
      } else eligible.push(observation);
    }
    if (!eligible.length) { unavailableAssignedPhase += 1; continue; }
    const ranked = eligible.map((observation) => ({ observation, rank: selectionRank(game, observation, spec) }))
      .sort((a, b) => a.rank.localeCompare(b.rank));
    provisional.push({ game, phase, observation: ranked[0].observation, selectionRank: ranked[0].rank });
  }
  provisional.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash)
    || a.game.seed - b.game.seed);
  const byRule = new Map();
  for (const row of provisional) {
    const key = row.observation.identity.ruleStateKey;
    const list = byRule.get(key) || []; list.push(row); byRule.set(key, list);
  }
  const selected = [...byRule.values()].map((list) => list.sort((a, b) =>
    a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash) || a.game.seed - b.game.seed)[0]);
  selected.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return {
    representativesBeforeStage1Firewall: repsBeforeFirewall,
    trajectoryEligible,
    provisional,
    selected,
    stage1TrajectoryOverlapExcluded,
    stage1OpeningPrefixOverlapExcluded,
    stage1RuleStateObservationsExcluded,
    unavailableAssignedPhase,
    duplicateSelectedRuleStatesCollapsed: provisional.length - selected.length,
  };
}
function measureSelected(row, spec, stage1Result) {
  const state = stateFromObservation(row.observation);
  const actor = state.player;
  const actorFeatures = row.observation.features.actor;
  const opponentFeatures = row.observation.features.opponent;
  const staticBaoEvaluation = AI.evaluate(state, actor);
  const frozenWinProbability = predictFrozenModel(stage1Result, row.phase, staticBaoEvaluation);
  const administrativeTruncation = row.game.winner === null;
  return {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    gameId: row.game.gameId,
    seed: row.game.seed,
    historicalTrajectoryHash: row.game.historicalTrajectoryHash,
    ruleStateKey: row.observation.identity.ruleStateKey,
    historicalStateHash: row.observation.identity.historicalStateHash,
    openingPrefixHash: row.game.openingPrefix.hash,
    ply: row.observation.ply,
    phase: row.phase,
    actorSeat: actor,
    selectionRank: row.selectionRank,
    staticBaoEvaluation,
    frozenWinProbability,
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

module.exports = {
  AI, AUTH_PATH, DEFAULT_OUTPUT, DEFAULT_STAGE1_OUTPUT, E, ROOT, SPEC_PATH,
  assignedPhase, continuationMove, gamePath, loadAuthorization, loadSpec, loadStage1Reference,
  measureSelected, measurementPath, openingPrefixIdentity, predictFrozenModel, provenance,
  readGames, readJson, representativeGames, runGame, selectStates, selectionRank, sha256,
  sourceFileSha256, stateFromObservation, writeJson,
};
