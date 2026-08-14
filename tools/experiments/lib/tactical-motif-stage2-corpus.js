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
const SpecValidator = require("../validate-tactical-motif-stage2-formal-spec.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json");
const CANDIDATE_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json");
const AUTH_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/tactical-motifs/stage2-formal-v1");

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/tactical-motif-features.js",
  "tools/experiments/lib/tactical-motif-discovery.js",
  "tools/experiments/lib/tactical-motif-stage2-formal.js",
  "tools/experiments/lib/tactical-motif-stage2-corpus.js",
  "tools/experiments/validate-tactical-motif-stage2-formal-spec.js",
  "tools/experiments/run-tactical-motif-stage2-formal.js",
  "tools/experiments/verify-tactical-motif-stage2-formal.js",
  "tools/experiments/evaluate-tactical-motif-stage2-formal.js",
  "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json",
  "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json"
]);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return fallback;
  }
}

function sourceFileSha256() {
  return Object.fromEntries(SOURCE_FILES.map((file) => {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing frozen source file: ${file}`);
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

function loadSpec() {
  SpecValidator.validate();
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256(text) };
}

function loadCandidates() {
  const text = fs.readFileSync(CANDIDATE_PATH, "utf8");
  return { candidates: JSON.parse(text), candidateSha256: sha256(text) };
}

function loadAuthorization(specSha256, candidateSha256) {
  if (!fs.existsSync(AUTH_PATH)) {
    throw new Error("Stage 2 generation blocked: authorization file absent");
  }
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  if (auth.schemaVersion !== 1
    || auth.stageId !== "TM-S2-FORMAL-2026-08-14-v1"
    || auth.stage2GenerationAuthorized !== true
    || auth.scientificInferenceAuthorized !== true
    || auth.specSha256 !== specSha256
    || auth.candidateDefinitionSha256 !== candidateSha256
    || auth.stage1FormalObservationReuseAllowed !== false) {
    throw new Error("Invalid Stage 2 authorization semantics/spec/candidate binding");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 2 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}

function conditionForGame(spec, gameIndex) {
  const strata = spec.population.conditionAssignment.strata;
  return strata[gameIndex % strata.length];
}

function openingPrefixIdentity(moves, spec) {
  const moveKeys = moves.slice(0, spec.openingFamily.prefixPlies).map(({ moveKey }) => moveKey);
  return {
    length: moveKeys.length,
    moveKeys,
    hash: hashValue({ length: moveKeys.length, moveKeys }),
  };
}

function aiMove(state, condition, random) {
  const g = condition.generator;
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
    throw new Error(`Incomplete Stage 2 generator search: ${condition.id}`);
  }
  return result;
}

function runGame(spec, specSha256, candidateSha256, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const random = seededRandom(seed);
  const condition = conditionForGame(spec, gameIndex);
  const gameId = `tm-s2-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];

  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId,
      conditionId: condition.id,
      seed,
      ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;

    let move;
    let generationSearch = null;
    let source;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
      source = "opening-random";
    } else {
      const result = aiMove(state, condition, random);
      move = result.move;
      source = "trajectory-ai";
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

    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    moves.push({
      ply,
      player: state.player,
      source,
      conditionId: condition.id,
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

  const historicalTrajectoryHash = hashValue(observations.map((o) => o.identity.historicalStateHash));
  const ruleTrajectoryHash = hashValue(observations.map((o) => o.identity.ruleStateKey));
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    stage1FormalObservationReuseAllowed: false,
    gameId,
    gameIndex,
    seed,
    conditionId: condition.id,
    observations,
    moves,
    openingPrefix: openingPrefixIdentity(moves, spec),
    historicalTrajectoryHash,
    ruleTrajectoryHash,
    winner: state.winner,
    reason: state.reason || (moves.length >= spec.population.maxPly ? "max-ply" : "no-move"),
    plies: moves.length,
  };
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

function candidateSelectionRank(candidateId, game, observation, spec) {
  const salt = spec.candidateSpecificRootSelection.withinTrajectory.saltTemplate
    .replace("<candidateId>", candidateId);
  const fields = [
    candidateId,
    game.historicalTrajectoryHash,
    observation.identity.ruleStateKey,
    observation.ply,
  ];
  return sha256(`${salt}|${fields.join("|")}`);
}

function gamePath(output, index) {
  return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`);
}

function candidateMeasurementPath(output, candidateId, index) {
  return path.join(output, "measurements", candidateId, `selected-${String(index).padStart(4, "0")}.json`);
}

function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, i) => {
    const file = gamePath(output, i);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game file: ${file}`);
    return readJson(file);
  });
}

module.exports = {
  AUTH_PATH,
  CANDIDATE_PATH,
  DEFAULT_OUTPUT,
  ROOT,
  SOURCE_FILES,
  SPEC_PATH,
  aiMove,
  candidateMeasurementPath,
  candidateSelectionRank,
  conditionForGame,
  gamePath,
  loadAuthorization,
  loadCandidates,
  loadSpec,
  openingPrefixIdentity,
  provenance,
  readGames,
  readJson,
  representativeGames,
  runGame,
  sha256,
  sourceFileSha256,
  stateFromObservation,
  writeJson,
};
