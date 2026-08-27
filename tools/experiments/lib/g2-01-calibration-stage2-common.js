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
const SPEC_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const STAGE1_RESULT_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_1_DEVELOPMENT_RESULT.json");
const STAGE1_MAPPING_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_1_FROZEN_MAPPING.json");
const STAGE1_UNIVERSE_MANIFEST_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_1_REFERENCE_UNIVERSE_MANIFEST.json");
const STAGE2_SMOKE_RESULT_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_2_TECHNICAL_SMOKE_RESULT.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage2-formal-v1");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/ssgtc-representation-production.js",
  "tools/experiments/lib/g2-01-calibration-stage2-common.js",
  "tools/experiments/validate-g2-01-calibration-stage2-spec.js",
  "tools/experiments/run-g2-01-calibration-stage2.js",
  "tools/experiments/verify-g2-01-calibration-stage2-independent.js",
  "tools/experiments/evaluate-g2-01-calibration-stage2.js",
  "tools/experiments/run-g2-01-calibration-stage2-smoke.js",
  "tools/experiments/verify-g2-01-calibration-stage2-smoke-independent.js",
  `${STUDY_DIR}/preregistration/STAGE_2_FORMAL_SPEC.json`,
  `${STUDY_DIR}/results/STAGE_1_DEVELOPMENT_RESULT.json`,
  `${STUDY_DIR}/results/STAGE_1_FROZEN_MAPPING.json`,
  `${STUDY_DIR}/results/STAGE_1_REFERENCE_UNIVERSE_MANIFEST.json`,
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
    if (!fs.existsSync(full)) throw new Error(`Missing Stage 2 source file: ${file}`);
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
function fileSha(file) { return sha256(fs.readFileSync(file)); }
function loadFrozenMapping() {
  const resultText = fs.readFileSync(STAGE1_RESULT_PATH, "utf8");
  const mappingText = fs.readFileSync(STAGE1_MAPPING_PATH, "utf8");
  const result = JSON.parse(resultText);
  const mapping = JSON.parse(mappingText);
  if (result.studyId !== "PEOCR-STUDY1" || result.stage1Decision !== "MODEL-FROZEN-DEVELOPMENT"
    || result.stage2GenerationAuthorized !== false || result.inputAudit?.readiness?.passed !== true) {
    throw new Error("Invalid canonical Stage 1 development result");
  }
  if (sha256(mappingText) !== result.model?.modelArtifactSha256
    || mapping.modelFamily !== "phase-stratified-isotonic-PAVA"
    || mapping.refitOnStage2Allowed !== false || mapping.formalCalibrationClaimAuthorized !== false) {
    throw new Error("Invalid canonical Stage 1 frozen mapping");
  }
  return { result, resultSha256: sha256(resultText), mapping, mappingSha256: sha256(mappingText) };
}
function canonicalUniverseObject(trajectoryHashes, openingPrefixHashes, rawStateKeys) {
  return {
    historicalTrajectoryHash: [...trajectoryHashes].sort(),
    openingPrefixHash: [...openingPrefixHashes].sort(),
    rawStateKey: [...rawStateKeys].sort(),
  };
}
function buildStage1Reference(stage1Output) {
  const manifest = readJson(STAGE1_UNIVERSE_MANIFEST_PATH);
  const generationPath = path.join(stage1Output, "generation-manifest.json");
  const verificationPath = path.join(stage1Output, "verification.json");
  if (!fs.existsSync(generationPath) || !fs.existsSync(verificationPath)) {
    throw new Error("Stage 1 artifact directory is missing generation/verification records");
  }
  if (fileSha(generationPath) !== manifest.stage1GenerationManifestSha256
    || fileSha(verificationPath) !== manifest.stage1VerificationSha256) {
    throw new Error("Stage 1 artifact dependency hash mismatch");
  }
  const generation = readJson(generationPath);
  const verification = readJson(verificationPath);
  if (generation.games !== manifest.sourcePopulation.games || verification.passed !== true
    || verification.gamesVerified !== manifest.sourcePopulation.games
    || verification.gameReplayMismatches !== 0 || verification.measurementMismatches !== 0) {
    throw new Error("Stage 1 artifact dependency verification state invalid");
  }
  const trajectoryHashes = new Set();
  const openingPrefixHashes = new Set();
  const rawStateKeys = new Set();
  let observations = 0;
  for (let index = 0; index < manifest.sourcePopulation.games; index += 1) {
    const file = path.join(stage1Output, "games", `game-${String(index).padStart(4, "0")}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 1 game file: ${file}`);
    const game = readJson(file);
    if (game.gameIndex !== index || game.seed !== manifest.sourcePopulation.seedStart + index) {
      throw new Error(`Stage 1 game identity mismatch at index ${index}`);
    }
    trajectoryHashes.add(game.historicalTrajectoryHash);
    openingPrefixHashes.add(game.openingPrefix.hash);
    for (const observation of game.observations) {
      const key = observation?.identity?.rawStateKey;
      if (typeof key !== "string" || key.length !== 64) throw new Error("Missing Stage 1 RAW state key");
      rawStateKeys.add(key);
      observations += 1;
    }
  }
  const canonical = `${JSON.stringify(canonicalUniverseObject(trajectoryHashes, openingPrefixHashes, rawStateKeys))}\n`;
  const universeSha256 = sha256(canonical);
  if (trajectoryHashes.size !== manifest.referenceUniverse.historicalTrajectoryHash.uniqueCount
    || openingPrefixHashes.size !== manifest.referenceUniverse.openingPrefixHash.uniqueCount
    || rawStateKeys.size !== manifest.referenceUniverse.rawStateKey.uniqueCount
    || observations !== manifest.sourcePopulation.observations
    || universeSha256 !== manifest.canonicalSerialization.sha256) {
    throw new Error("Stage 1 reference-universe reconstruction mismatch");
  }
  return { manifest, trajectoryHashes, openingPrefixHashes, rawStateKeys, observations, universeSha256 };
}
function loadAuthorization(spec, specSha256) {
  if (!fs.existsSync(AUTH_PATH)) throw new Error("Stage 2 generation blocked: authorization file absent");
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  if (!fs.existsSync(STAGE2_SMOKE_RESULT_PATH)) throw new Error("Stage 2 smoke result absent");
  const smokeText = fs.readFileSync(STAGE2_SMOKE_RESULT_PATH, "utf8");
  const frozen = loadFrozenMapping();
  const universeManifestText = fs.readFileSync(STAGE1_UNIVERSE_MANIFEST_PATH, "utf8");
  if (auth?.schemaVersion !== 1 || auth.studyId !== spec.studyId || auth.stageId !== spec.stageId
    || auth.specSha256 !== specSha256 || auth.stage2GenerationAuthorized !== true
    || auth.stage2FormalInferenceAuthorized !== true || auth.stage1RefitAllowed !== false
    || auth.stage1FrozenMappingSha256 !== frozen.mappingSha256
    || auth.stage1DevelopmentResultSha256 !== frozen.resultSha256
    || auth.stage1ReferenceUniverseManifestSha256 !== sha256(universeManifestText)
    || auth.stage2TechnicalSmokeResultSha256 !== sha256(smokeText)) {
    throw new Error("Invalid Stage 2 authorization semantics/dependency binding");
  }
  const smoke = JSON.parse(smokeText);
  if (smoke.passed !== true || smoke.scientificGeneration === true || smoke.formalInferencePerformed === true) {
    throw new Error("Stage 2 authorization bound to invalid smoke result");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 2 authorization source hashes do not match current source");
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
    throw new Error("Incomplete frozen Stage 2 continuation search");
  }
  return result;
}
function observationFor(state, context) {
  Raw.assertStudyState(state);
  const observation = extractPositionTypologyObservation(state, context);
  observation.identity.rawStateKey = Raw.stateKey(state);
  return observation;
}
function runGame(spec, specSha256, gameIndex, seedOverride = null, gameIdPrefix = "peocr-s2") {
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
    formal: seedOverride === null,
    scientificInferenceAuthorized: seedOverride === null,
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
function selectStates(games, spec, stage1Reference) {
  const representativesBeforeStage1Firewall = representativeGames(games);
  const trajectoryEligible = [];
  let stage1TrajectoryOverlapExcluded = 0;
  let stage1OpeningPrefixOverlapExcluded = 0;
  for (const game of representativesBeforeStage1Firewall) {
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
  let stage1RawStateObservationsExcluded = 0;
  for (const game of trajectoryEligible) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const phaseRows = game.observations.filter((observation) => observation.ply >= spec.stateSelection.minimumPly
      && observation.terminal === false && observation.phase === phase);
    const eligible = [];
    for (const observation of phaseRows) {
      if (stage1Reference.rawStateKeys.has(observation.identity.rawStateKey)) stage1RawStateObservationsExcluded += 1;
      else eligible.push(observation);
    }
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
    representativesBeforeStage1Firewall,
    trajectoryEligible,
    provisional,
    selected,
    stage1TrajectoryOverlapExcluded,
    stage1OpeningPrefixOverlapExcluded,
    stage1RawStateObservationsExcluded,
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
function predictFrozenModel(mapping, phase, staticBaoEvaluation) {
  const fit = mapping.phaseFits?.[phase];
  if (!fit?.eligible || !fit.blocks?.length) throw new Error(`Missing Stage 1 PAVA fit for ${phase}`);
  const z = staticBaoEvaluation / 100;
  let rawPrediction;
  if (z < fit.blocks[0].minZ) rawPrediction = fit.blocks[0].mean;
  else {
    let chosen = fit.blocks[0];
    for (const block of fit.blocks) {
      if (block.minZ <= z) chosen = block;
      else break;
    }
    rawPrediction = chosen.mean;
  }
  const lower = mapping.formalPredictionClipping.lower;
  const upper = mapping.formalPredictionClipping.upper;
  return { z, rawPrediction, prediction: Math.min(upper, Math.max(lower, rawPrediction)) };
}
function referencePrediction(mapping, phase) {
  const p = mapping.phaseOnlyReference?.[phase]?.actorWinRate;
  if (!Number.isFinite(p) || p <= 0 || p >= 1) throw new Error(`Invalid Stage 1 phase-only reference for ${phase}`);
  return p;
}
function measureSelected(row, spec, frozen) {
  const state = stateFromObservation(row.observation);
  const actor = state.player;
  const staticBaoEvaluation = AI.evaluate(state, actor);
  const model = predictFrozenModel(frozen.mapping, row.phase, staticBaoEvaluation);
  const reference = referencePrediction(frozen.mapping, row.phase);
  const administrativeTruncation = row.game.winner === null;
  const actorFeatures = row.observation.features.actor;
  const opponentFeatures = row.observation.features.opponent;
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
    scoreZ: model.z,
    frozenRawPrediction: model.rawPrediction,
    modelPrediction: model.prediction,
    referencePrediction: reference,
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
function brierLoss(p, y) { return (p - y) ** 2; }
function logLoss(p, y) {
  if (!(p > 0 && p < 1) || ![0, 1].includes(y)) throw new Error("Invalid probability/outcome for log loss");
  return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
}
function gamePath(output, index) { return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`); }
function measurementPath(output, index) { return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`); }
function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, index) => {
    const file = gamePath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game file: ${file}`);
    const game = readJson(file);
    if (game.gameIndex !== index || game.seed !== spec.population.seedStart + index || game.specSha256 !== sha256(fs.readFileSync(SPEC_PATH, "utf8"))) {
      throw new Error(`Stage 2 game identity mismatch at index ${index}`);
    }
    return game;
  });
}

module.exports = {
  AI, AUTH_PATH, DEFAULT_OUTPUT, E, ROOT, SOURCE_FILES, SPEC_PATH, STAGE1_MAPPING_PATH,
  STAGE1_RESULT_PATH, STAGE1_UNIVERSE_MANIFEST_PATH, STAGE2_SMOKE_RESULT_PATH,
  assignedPhase, brierLoss, buildStage1Reference, canonicalUniverseObject, continuationMove,
  fileSha, gamePath, gitValue, loadAuthorization, loadFrozenMapping, loadSpec, logLoss,
  measureSelected, measurementPath, observationFor, openingPrefixIdentity, predictFrozenModel,
  provenance, readGames, readJson, referencePrediction, representativeGames, runGame,
  selectStates, selectionRank, sha256, sourceFileSha256, stateFromObservation, writeJson,
};
