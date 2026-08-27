#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const { extractPositionTypologyObservation, hashValue } = require("./lib/position-typology-features.js");
const Raw = require("./lib/ssgtc-representation-production.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/position-evaluation-empirical-outcome-calibration-replication");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(STUDY, "preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const MAPPING_PATH = path.join(STUDY, "results/STAGE_1_FROZEN_MAPPING.json");
const UNIVERSE_MANIFEST_PATH = path.join(STUDY, "results/STAGE_1_REFERENCE_UNIVERSE_MANIFEST.json");
const SOURCE_FILES = [
  "public/engine.js", "public/ai.js", "public/ai-weights.js", "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js", "tools/experiments/lib/ssgtc-representation-production.js",
  "tools/experiments/lib/g2-01-calibration-stage2-common.js", "tools/experiments/validate-g2-01-calibration-stage2-spec.js",
  "tools/experiments/run-g2-01-calibration-stage2.js", "tools/experiments/verify-g2-01-calibration-stage2-independent.js",
  "tools/experiments/evaluate-g2-01-calibration-stage2.js", "tools/experiments/run-g2-01-calibration-stage2-smoke.js",
  "tools/experiments/verify-g2-01-calibration-stage2-smoke-independent.js",
  "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_2_FORMAL_SPEC.json",
  "doc/position-evaluation-empirical-outcome-calibration-replication/results/STAGE_1_DEVELOPMENT_RESULT.json",
  "doc/position-evaluation-empirical-outcome-calibration-replication/results/STAGE_1_FROZEN_MAPPING.json",
  "doc/position-evaluation-empirical-outcome-calibration-replication/results/STAGE_1_REFERENCE_UNIVERSE_MANIFEST.json"
];
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function parseArgs(argv) {
  const o = { stage1Output: null, smokeOutput: path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage2-smoke-v1") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--stage1-output") o.stage1Output = path.resolve(argv[++i]);
    else if (argv[i] === "--smoke-output") o.smokeOutput = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!o.stage1Output) throw new Error("--stage1-output is required");
  return o;
}
function buildUniverse(stage1Output) {
  const manifest = readJson(UNIVERSE_MANIFEST_PATH);
  const trajectories = new Set(); const openings = new Set(); const raws = new Set(); let observations = 0;
  for (let i = 0; i < manifest.sourcePopulation.games; i += 1) {
    const game = readJson(path.join(stage1Output, "games", `game-${String(i).padStart(4, "0")}.json`));
    trajectories.add(game.historicalTrajectoryHash); openings.add(game.openingPrefix.hash);
    for (const o of game.observations) { raws.add(o.identity.rawStateKey); observations += 1; }
  }
  const text = `${JSON.stringify({ historicalTrajectoryHash: [...trajectories].sort(), openingPrefixHash: [...openings].sort(), rawStateKey: [...raws].sort() })}\n`;
  return { trajectories, openings, raws, observations, sha256: sha256(text) };
}
function replay(seed, index, spec) {
  const random = seededRandom(seed); const gameId = `peocr-s2-smoke-${String(index).padStart(4, "0")}`;
  let state = E.initialState(); const observations = []; const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    Raw.assertStudyState(state);
    const o = extractPositionTypologyObservation(state, { gameId, conditionId: "P2-D2", seed, ply });
    o.identity.rawStateKey = Raw.stateKey(state); observations.push(o);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state); move = legal[Math.floor(random() * legal.length)];
    } else {
      const g = spec.population.continuation;
      const result = AI.analyzeMove(state, g.level, random, {
        evaluationProfile: g.evaluationProfile, searchProfile: g.searchProfile, maxDepth: g.maxDepth,
        timeLimitMs: Infinity, quiescenceDepth: g.quiescenceDepth, orderQuiescenceCaptures: g.orderQuiescenceCaptures,
        adaptive: g.adaptive, stableBestDepths: g.stableBestDepths, aspirationWindow: g.aspirationWindow
      });
      if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) throw new Error("Independent smoke replay incomplete search");
      move = result.move;
    }
    if (!move) throw new Error("Independent smoke replay found no move");
    moves.push({ moveKey: AI.moveKey(move) }); state = E.applyMove(state, move).state;
  }
  const prefix = moves.slice(0, spec.population.opening.plies).map((r) => r.moveKey);
  return { seed, historicalTrajectoryHash: hashValue(observations.map((o) => o.identity.historicalStateHash)),
    rawTrajectoryHash: hashValue(observations.map((o) => o.identity.rawStateKey)),
    openingPrefixHash: hashValue({ length: prefix.length, moveKeys: prefix }), winner: state.winner,
    moveKeys: moves.map((r) => r.moveKey) };
}
function sourceHashes() { return Object.fromEntries(SOURCE_FILES.map((file) => [file, sha256(fs.readFileSync(path.join(ROOT, file)))])); }
function main() {
  const options = parseArgs(process.argv.slice(2)); const smoke = readJson(path.join(options.smokeOutput, "stage2-smoke.json"));
  const specText = fs.readFileSync(SPEC_PATH, "utf8"); const spec = JSON.parse(specText); const mappingText = fs.readFileSync(MAPPING_PATH, "utf8"); const mapping = JSON.parse(mappingText);
  const universe = buildUniverse(options.stage1Output);
  const replayed = smoke.technicalSeeds.map((seed, i) => replay(seed, i, spec));
  const storedCore = smoke.technicalGameCore.map((g) => ({ seed: g.seed, historicalTrajectoryHash: g.historicalTrajectoryHash,
    rawTrajectoryHash: g.rawTrajectoryHash, openingPrefixHash: g.openingPrefixHash, winner: g.winner, moveKeys: g.moveKeys }));
  const mappingMonotone = ["namua", "mtaji"].every((phase) => mapping.phaseFits[phase].blocks.every((b, i, a) => i === 0 || a[i - 1].mean <= b.mean));
  const checks = {
    smokePassed: smoke.passed === true,
    scientificGenerationFalse: smoke.scientificGeneration === false,
    formalInferenceFalse: smoke.formalInferencePerformed === false,
    authorizationAbsent: !fs.existsSync(AUTH_PATH),
    specHashMatch: sha256(specText) === smoke.specSha256,
    universeHashMatch: universe.sha256 === "5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063",
    universeCountsMatch: universe.trajectories.size === 1602 && universe.openings.size === 1604 && universe.raws.size === 76010 && universe.observations === 113642,
    mappingHashMatch: sha256(mappingText) === "b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac",
    mappingMonotone,
    clippingFixed: mapping.formalPredictionClipping.lower === 0.01 && mapping.formalPredictionClipping.upper === 0.99,
    technicalReplayMatches: JSON.stringify(replayed) === JSON.stringify(storedCore),
    noScientificSeeds: smoke.technicalSeeds.every((s) => s < spec.population.seedStart || s > spec.population.seedEnd),
    productionSourceHashesMatch: JSON.stringify(smoke.source.sourceFileSha256) === JSON.stringify(sourceHashes())
  };
  const result = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, smokeId: smoke.smokeId,
    passed: Object.values(checks).every(Boolean), scientificGeneration: false, formalInferencePerformed: false, checks,
    independentlyReconstructedUniverseSha256: universe.sha256, independentlyReplayedTechnicalGames: replayed.length };
  fs.writeFileSync(path.join(options.smokeOutput, "stage2-smoke-independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2)); if (!result.passed) process.exitCode = 1;
}
if (require.main === module) main();
