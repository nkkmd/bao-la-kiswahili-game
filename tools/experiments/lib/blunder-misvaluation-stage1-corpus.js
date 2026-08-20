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
const Generic = require("./tactical-motif-stage1-corpus.js");
const SpecValidator = require("../validate-blunder-misvaluation-stage1-spec.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/tactical-motif-features.js",
  "tools/experiments/lib/tactical-motif-stage1-corpus.js",
  "tools/experiments/lib/blunder-misvaluation-patterns.js",
  "tools/experiments/lib/blunder-misvaluation-stage1-contract.js",
  "tools/experiments/lib/blunder-misvaluation-stage1-discovery.js",
  "tools/experiments/lib/blunder-misvaluation-stage1-corpus.js",
  "tools/experiments/validate-blunder-misvaluation-stage1-spec.js",
  "tools/experiments/run-blunder-misvaluation-stage1-exploratory.js",
  "tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js",
  "doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
]);

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
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
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
  const loaded = SpecValidator.loadSpec(SPEC_PATH);
  SpecValidator.validateSpec(loaded.spec);
  return loaded;
}
function loadAuthorization(specSha256, authPath = AUTH_PATH) {
  if (!fs.existsSync(authPath)) throw new Error("Stage 1 generation blocked: authorization file absent");
  const text = fs.readFileSync(authPath, "utf8");
  const auth = JSON.parse(text);
  if (auth.schemaVersion !== 1
      || auth.stageId !== "BMP-S1-EXPLORATORY-2026-08-20-v1"
      || auth.authorizationType !== "stage1-exploratory-scientific-generation"
      || auth.stage1GenerationAuthorized !== true
      || auth.scientificInferenceAuthorized !== false
      || auth.confirmatoryReuseAllowed !== false
      || auth.stage2GenerationAuthorized !== false
      || auth.specSha256 !== specSha256) {
    throw new Error("Invalid Stage 1 authorization semantics/spec binding");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 1 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}
function conditionForGame(spec, gameIndex) {
  const assignment = spec.population.conditionAssignment;
  const remainder = gameIndex % assignment.strata.length;
  const condition = assignment.strata.find((item) => item.moduloRemainder === remainder);
  if (!condition) throw new Error(`No generation stratum for modulo remainder ${remainder}`);
  return condition;
}
function openingPrefixIdentity(moves, spec) {
  return Generic.openingPrefixIdentity(moves, spec);
}
function aiMove(state, condition, random) {
  return Generic.aiMove(state, condition, random);
}
function runGame(spec, specSha256, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const random = seededRandom(seed);
  const condition = conditionForGame(spec, gameIndex);
  const gameId = `bmp-s1-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId, conditionId: condition.id, seed, ply,
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
    exploratory: true,
    confirmatoryReuseAllowed: false,
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
function stateFromObservation(observation) { return Generic.stateFromObservation(observation); }
function representativeGames(games) { return Generic.representativeGames(games); }
function assignedPhase(hash, spec) { return Generic.assignedPhase(hash, spec); }
function selectionRank(game, observation, spec) { return Generic.selectionRank(game, observation, spec); }
function quotaRank(item, spec) {
  const q = spec.stateSelection.phaseQuota;
  const fields = [item.assignedPhase, item.historicalTrajectoryHash, item.ruleStateKey, item.seed];
  return sha256(`${q.salt}|${fields.join("|")}`);
}
function gamePath(output, index) {
  return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`);
}
function measurementPath(output, index) {
  return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`);
}
function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, i) => {
    const file = gamePath(output, i);
    if (!fs.existsSync(file)) throw new Error(`Missing game file: ${file}`);
    return readJson(file);
  });
}

module.exports = {
  AUTH_PATH,
  DEFAULT_OUTPUT,
  ROOT,
  SOURCE_FILES,
  SPEC_PATH,
  aiMove,
  assignedPhase,
  conditionForGame,
  gamePath,
  loadAuthorization,
  loadSpec,
  measurementPath,
  openingPrefixIdentity,
  provenance,
  quotaRank,
  readGames,
  readJson,
  representativeGames,
  runGame,
  selectionRank,
  sha256,
  sourceFileSha256,
  stateFromObservation,
  writeJson,
};
