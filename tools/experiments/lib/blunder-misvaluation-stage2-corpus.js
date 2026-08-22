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
const SpecValidator = require("../validate-blunder-misvaluation-stage2-formal-spec.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_SPEC.json");
const CANDIDATE_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_CANDIDATES.json");
const AUTH_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1");
const STAGE1_OUTPUT = path.join(ROOT, "artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1");

const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/tactical-motif-features.js",
  "tools/experiments/lib/blunder-misvaluation-patterns.js",
  "tools/experiments/lib/blunder-misvaluation-stage1-contract.js",
  "tools/experiments/lib/blunder-misvaluation-stage1-discovery.js",
  "tools/experiments/lib/blunder-misvaluation-stage2-formal.js",
  "tools/experiments/lib/blunder-misvaluation-stage2-corpus.js",
  "tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js",
  "tools/experiments/run-blunder-misvaluation-stage2-formal.js",
  "tools/experiments/verify-blunder-misvaluation-stage2-formal.js",
  "tools/experiments/evaluate-blunder-misvaluation-stage2-formal.js",
  "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_CANDIDATES.json",
  "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_SPEC.json",
  "doc/blunder-misvaluation-patterns/results/STAGE_1_DISCOVERY_RESULT.json",
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
    if (!fs.existsSync(full)) throw new Error(`Missing frozen Stage 2 source file: ${file}`);
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
      || auth.studyId !== "BMP-STUDY1"
      || auth.stageId !== "BMP-S2-FORMAL-2026-08-22-v1"
      || auth.authorizationType !== "stage2-formal-scientific-generation"
      || auth.stage2GenerationAuthorized !== true
      || auth.scientificInferenceAuthorized !== true
      || auth.confirmatoryReuseOfStage1DataAllowed !== false
      || auth.specSha256 !== specSha256
      || auth.candidateDefinitionSha256 !== candidateSha256) {
    throw new Error("Invalid Stage 2 authorization semantics/spec/candidate binding");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 2 authorization source hashes do not match current source");
  }
  return { authorization: auth, authorizationSha256: sha256(text) };
}

function conditionForGame(spec, gameIndex) {
  const assignment = spec.population.conditionAssignment;
  const remainder = gameIndex % assignment.strata.length;
  const condition = assignment.strata.find((item) => item.moduloRemainder === remainder);
  if (!condition) throw new Error(`No Stage 2 generation stratum for modulo remainder ${remainder}`);
  return condition;
}

function openingPrefixIdentity(moves, spec) {
  const moveKeys = moves.slice(0, spec.population.opening.plies).map(({ moveKey }) => moveKey);
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
  const gameId = `bmp-s2-${String(gameIndex).padStart(4, "0")}`;
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
    confirmatoryReuseOfStage1DataAllowed: false,
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

function supportGroupSelectionRank(supportGroup, game, observation) {
  const fields = [
    supportGroup.supportGroupId,
    game.historicalTrajectoryHash,
    observation.identity.ruleStateKey,
    observation.ply,
  ];
  return sha256(`${supportGroup.stage2RootSelectionSalt}|${fields.join("|")}`);
}

function gamePath(output, index) {
  return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`);
}

function supportGroupMeasurementPath(output, supportGroupId, index) {
  return path.join(output, "measurements", supportGroupId, `selected-${String(index).padStart(4, "0")}.json`);
}

function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, i) => {
    const file = gamePath(output, i);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game file: ${file}`);
    return readJson(file);
  });
}

function loadStage1IdentitySets() {
  const gamesDir = path.join(STAGE1_OUTPUT, "games");
  const selectedFile = path.join(STAGE1_OUTPUT, "selected-states.json");
  const manifestFile = path.join(STAGE1_OUTPUT, "manifest.json");
  if (!fs.existsSync(gamesDir) || !fs.existsSync(selectedFile) || !fs.existsSync(manifestFile)) {
    throw new Error(`Stage 1 identity firewall artifacts are missing under ${STAGE1_OUTPUT}`);
  }
  const manifest = readJson(manifestFile);
  if (manifest.stageId !== "BMP-S1-EXPLORATORY-2026-08-20-v1"
      || manifest.specSha256 !== "f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd") {
    throw new Error("Stage 1 manifest identity mismatch for Stage 2 firewall");
  }
  const gameFiles = fs.readdirSync(gamesDir).filter((file) => /^game-\d+\.json$/.test(file)).sort();
  if (gameFiles.length !== 2048) throw new Error(`Stage 1 firewall requires 2048 games; found ${gameFiles.length}`);
  const historicalTrajectoryHashes = new Set();
  const openingPrefixHashes = new Set();
  for (const file of gameFiles) {
    const game = readJson(path.join(gamesDir, file));
    historicalTrajectoryHashes.add(game.historicalTrajectoryHash);
    openingPrefixHashes.add(game.openingPrefix.hash);
  }
  const selected = readJson(selectedFile);
  if (selected.stageId !== "BMP-S1-EXPLORATORY-2026-08-20-v1"
      || selected.selectionHash !== "80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df"
      || !Array.isArray(selected.selected) || selected.selected.length !== 1200) {
    throw new Error("Stage 1 selected-state identity mismatch for Stage 2 firewall");
  }
  const ruleStateKeys = new Set(selected.selected.map((row) => row.ruleStateKey));
  const summary = {
    historicalTrajectoryHashes: [...historicalTrajectoryHashes].sort(),
    openingPrefixHashes: [...openingPrefixHashes].sort(),
    ruleStateKeys: [...ruleStateKeys].sort(),
  };
  return {
    historicalTrajectoryHashes,
    openingPrefixHashes,
    ruleStateKeys,
    identityHash: hashValue(summary),
    counts: {
      historicalTrajectoryHashes: historicalTrajectoryHashes.size,
      openingPrefixHashes: openingPrefixHashes.size,
      ruleStateKeys: ruleStateKeys.size,
    },
  };
}

module.exports = {
  AUTH_PATH,
  CANDIDATE_PATH,
  DEFAULT_OUTPUT,
  ROOT,
  SOURCE_FILES,
  SPEC_PATH,
  STAGE1_OUTPUT,
  aiMove,
  conditionForGame,
  gamePath,
  loadAuthorization,
  loadCandidates,
  loadSpec,
  loadStage1IdentitySets,
  openingPrefixIdentity,
  provenance,
  readGames,
  readJson,
  representativeGames,
  runGame,
  sha256,
  sourceFileSha256,
  stateFromObservation,
  supportGroupMeasurementPath,
  supportGroupSelectionRank,
  writeJson,
};
