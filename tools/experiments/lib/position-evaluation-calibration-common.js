"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./position-typology-features.js");
const SearchDiagnostic = require("./position-complexity-search-diagnostic.js");
const SpecValidator = require("../validate-position-evaluation-calibration-stage1-spec.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
);
const AUTH_PATH = path.join(
  ROOT,
  "doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json",
);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "artifacts/local/position-evaluation-calibration/stage1-exploratory-v1",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}
function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch { return fallback; }
}
function loadSpec() {
  const loaded = SpecValidator.loadSpec(SPEC_PATH);
  SpecValidator.validateSpec(loaded.spec);
  return loaded;
}
function sourceFiles(spec) { return spec.sourceFreeze.files; }
function sourceFileSha256(spec) {
  return Object.fromEntries(sourceFiles(spec).map((file) => {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing frozen source file: ${file}`);
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
  if (!fs.existsSync(AUTH_PATH)) {
    throw new Error("Stage 1 generation blocked: authorization file absent");
  }
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  if (auth?.schemaVersion !== 1
    || auth.studyId !== spec.studyId
    || auth.stageId !== spec.stageId
    || auth.specSha256 !== specSha256
    || auth.stage1GenerationAuthorized !== true
    || auth.scientificInferenceAuthorized !== false
    || auth.confirmatoryReuseAllowed !== false) {
    throw new Error("Invalid Stage 1 authorization semantics/spec binding");
  }
  const actual = sourceFileSha256(spec);
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 1 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}
function openingPrefixIdentity(moves, spec) {
  const moveKeys = moves.slice(0, spec.openingFamily.prefixPlies).map(({ moveKey }) => moveKey);
  return {
    length: moveKeys.length,
    moveKeys,
    hash: hashValue({ length: moveKeys.length, moveKeys }),
  };
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
    throw new Error("Incomplete frozen continuation search");
  }
  return result;
}
function runGame(spec, specSha256, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const random = seededRandom(seed);
  const gameId = `pec-s1-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId, conditionId: "P2-D2", seed, ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    let generationSearch = null;
    let source;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      if (!legal.length) throw new Error("Nonterminal opening state has no legal move");
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
    if (!move) throw new Error("Frozen generator returned no move for nonterminal state");
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
  const historicalTrajectoryHash = hashValue(
    observations.map((observation) => observation.identity.historicalStateHash),
  );
  const ruleTrajectoryHash = hashValue(
    observations.map((observation) => observation.identity.ruleStateKey),
  );
  return {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    exploratory: true,
    confirmatoryReuseAllowed: false,
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
function representativeGames(games) {
  const groups = new Map();
  for (const game of games) {
    const list = groups.get(game.historicalTrajectoryHash) || [];
    list.push(game);
    groups.set(game.historicalTrajectoryHash, list);
  }
  return [...groups.values()]
    .map((list) => list.sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId))[0])
    .sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}
function assignedPhase(hash, spec) {
  const digest = sha256(`${spec.stateSelection.phaseAssignment.salt}|${hash}`);
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0
    ? spec.stateSelection.phaseAssignment.mapping.even
    : spec.stateSelection.phaseAssignment.mapping.odd;
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
function eligibleObservations(game, spec, phase) {
  return game.observations.filter((observation) => observation.ply >= spec.stateSelection.minimumPly
    && observation.terminal === false && observation.phase === phase);
}
function selectStates(games, spec) {
  const representatives = representativeGames(games);
  const provisional = [];
  let unavailableAssignedPhase = 0;
  for (const game of representatives) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = eligibleObservations(game, spec, phase);
    if (!eligible.length) {
      unavailableAssignedPhase += 1;
      continue;
    }
    const ranked = eligible.map((observation) => ({
      observation,
      rank: selectionRank(game, observation, spec),
    })).sort((a, b) => a.rank.localeCompare(b.rank));
    provisional.push({ game, phase, observation: ranked[0].observation, selectionRank: ranked[0].rank });
  }
  provisional.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash)
    || a.game.seed - b.game.seed);
  const byRuleState = new Map();
  for (const row of provisional) {
    const key = row.observation.identity.ruleStateKey;
    const list = byRuleState.get(key) || [];
    list.push(row);
    byRuleState.set(key, list);
  }
  const selected = [...byRuleState.values()].map((list) => list.sort((a, b) =>
    a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash)
      || a.game.seed - b.game.seed)[0]);
  selected.sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return {
    representatives,
    provisional,
    selected,
    unavailableAssignedPhase,
    duplicateSelectedRuleStatesCollapsed: provisional.length - selected.length,
  };
}
function measureSelected(row, spec) {
  const state = stateFromObservation(row.observation);
  const actor = state.player;
  const staticBaoEvaluation = AI.evaluate(state, actor);
  const d2 = SearchDiagnostic.analyzeRootCandidates(state, 2, {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
  const actorFeatures = row.observation.features.actor;
  const opponentFeatures = row.observation.features.opponent;
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
    openingPrefixLength: row.game.openingPrefix.length,
    ply: row.observation.ply,
    phase: row.phase,
    actorSeat: actor,
    selectionRank: row.selectionRank,
    staticBaoEvaluation,
    exactD2RootBestScore: d2.bestScore,
    exactD2RootBestScoreClass: d2.bestScoreClass,
    exactD2TopSetSize: d2.topSetSize,
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
function gamePath(output, index) {
  return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`);
}
function measurementPath(output, index) {
  return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`);
}
function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, index) => {
    const file = gamePath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing game file: ${file}`);
    return readJson(file);
  });
}

module.exports = {
  AI,
  AUTH_PATH,
  DEFAULT_OUTPUT,
  E,
  ROOT,
  SPEC_PATH,
  assignedPhase,
  continuationMove,
  gamePath,
  loadAuthorization,
  loadSpec,
  measureSelected,
  measurementPath,
  openingPrefixIdentity,
  provenance,
  readGames,
  readJson,
  representativeGames,
  runGame,
  selectStates,
  selectionRank,
  sha256,
  sourceFileSha256,
  stateFromObservation,
  writeJson,
};
