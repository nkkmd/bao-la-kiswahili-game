#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const AI = require("../../public/ai.js");
const D = require("./lib/position-complexity-search-diagnostic.js");
const S1 = require("./run-position-complexity-stage1-exploratory.js");
const { hashValue } = require("./lib/position-typology-features.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-complexity/stage2-formal-v1");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/symmetry/transform-candidates.js",
  "tools/experiments/lib/phase-transition-features.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/run-position-complexity-stage1-exploratory.js",
  "tools/experiments/run-position-complexity-stage2-formal.js",
  "doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json",
  "doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json",
]);

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function gitValue(args, fallback = null) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function sourceFileHashes() {
  return Object.fromEntries(SOURCE_FILES.filter((file) => fs.existsSync(path.join(ROOT, file))).map((file) => [
    file,
    sha256Text(fs.readFileSync(path.join(ROOT, file))),
  ]));
}

function provenance() {
  const present = SOURCE_FILES.filter((file) => fs.existsSync(path.join(ROOT, file)));
  return {
    sourceCommit: gitValue(["rev-parse", "HEAD"]),
    sourceTreeDirty: Boolean(gitValue(["status", "--porcelain", "--", ...present], "")),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    sourceFileSha256: sourceFileHashes(),
  };
}

function loadSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(text);
  const specSha256 = sha256Text(text);
  if (spec.stageId !== "PCX-S2-FORMAL-2026-08-13-v1" || spec.formalExperiment !== true) {
    throw new Error("Unexpected Stage 2 formal spec identity");
  }
  if (spec.generationAuthorizedByThisSpecAlone !== false) {
    throw new Error("Formal spec must not self-authorize generation");
  }
  if (spec.population.games !== spec.population.seedEnd - spec.population.seedStart + 1) {
    throw new Error("Stage 2 game/seed range mismatch");
  }
  if (spec.stopping.gamesFixed !== spec.population.games || spec.stopping.earlyStopAllowed !== false
    || spec.stopping.outcomeDependentExtensionAllowed !== false
    || spec.stopping.additionalSeedsAfterInspectionAllowed !== false) {
    throw new Error("Stage 2 stopping rule is not fixed");
  }
  if (JSON.stringify(spec.measurement.depths) !== JSON.stringify([2, 3])) {
    throw new Error("Stage 2 formal measurement depths must be exactly D2,D3");
  }
  return { spec, specSha256 };
}

function loadAuthorization(spec, specSha256) {
  if (!fs.existsSync(AUTH_PATH)) {
    throw new Error("Stage 2 generation firewall: missing STAGE_2_FORMAL_AUTHORIZATION.json");
  }
  const auth = readJson(AUTH_PATH);
  if (auth.authorized !== true || auth.stageId !== spec.stageId || auth.specSha256 !== specSha256) {
    throw new Error("Stage 2 generation firewall: authorization identity mismatch");
  }
  const current = sourceFileHashes();
  for (const [file, expected] of Object.entries(auth.sourceFileSha256 || {})) {
    if (current[file] !== expected) {
      throw new Error(`Stage 2 generation firewall: source hash mismatch for ${file}`);
    }
  }
  return auth;
}

function parseArgs(argv) {
  const options = { phase: "status", output: DEFAULT_OUTPUT, force: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") { options.force = true; continue; }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    if (arg === "--phase") options.phase = value;
    else if (arg === "--output") options.output = path.resolve(value);
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!["status", "generate", "select", "measure", "all"].includes(options.phase)) {
    throw new Error(`Invalid --phase: ${options.phase}`);
  }
  return options;
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function formalGameId(gameIndex) {
  return `pcx-s2-${String(gameIndex).padStart(4, "0")}`;
}

function runGame(spec, specSha256, gameIndex) {
  const game = S1.runGame(spec, specSha256, gameIndex);
  const oldGameId = game.gameId;
  const gameId = formalGameId(gameIndex);
  game.gameId = gameId;
  for (const observation of game.observations) {
    if (observation.gameId === oldGameId) observation.gameId = gameId;
  }
  return game;
}

function readExistingGame(filePath, specSha256) {
  if (!fs.existsSync(filePath)) return null;
  const game = readJson(filePath);
  if (game.specSha256 !== specSha256) throw new Error(`Spec mismatch in ${filePath}`);
  return game;
}

function summarizeGames(games) {
  const trajectoryCounts = new Map();
  for (const game of games) {
    trajectoryCounts.set(game.historicalTrajectoryHash, (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1);
  }
  return {
    games: games.length,
    observations: games.reduce((total, game) => total + game.observations.length, 0),
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: trajectoryCounts.size ? Math.max(...trajectoryCounts.values()) : 0,
    reachedMtajiGames: games.filter((game) => game.observations.some(({ phase }) => phase === "mtaji")).length,
  };
}

function generate(output, spec, specSha256, force) {
  const authorization = loadAuthorization(spec, specSha256);
  const source = provenance();
  if (source.sourceTreeDirty) throw new Error("Stage 2 formal generation requires a clean tracked source tree");
  const games = [];
  for (let gameIndex = 0; gameIndex < spec.population.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    let game = force ? null : readExistingGame(file, specSha256);
    if (!game) {
      game = runGame(spec, specSha256, gameIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.error(`[pcx stage2 generate] ${gameIndex + 1}/${spec.population.games} ${game.gameId}`);
  }
  const summary = summarizeGames(games);
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    formalExperiment: true,
    scientificInferenceAuthorized: false,
    generatedAt: new Date().toISOString(),
    output,
    specSha256,
    authorizationHash: hashValue(authorization),
    provenance: source,
    summary,
    summaryHash: hashValue(summary),
  };
  atomicWriteJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}

function selectStates(output, spec, specSha256) {
  const audit = S1.selectStates(output, spec, specSha256);
  const formalAudit = { ...audit, formalExperiment: true, scientificInferenceAuthorized: false };
  atomicWriteJson(path.join(output, "selection-audit.json"), formalAudit);
  return formalAudit;
}

function workload(state, depth, measurement) {
  const analysis = AI.analyzeMove(state, "hard", () => 0, {
    searchProfile: measurement.searchProfile,
    evaluationProfile: measurement.evaluationProfile,
    maxDepth: depth,
    timeLimitMs: Infinity,
    quiescenceDepth: measurement.quiescenceDepth,
    orderQuiescenceCaptures: measurement.orderQuiescenceCaptures,
    stableBestDepths: measurement.stableBestDepths,
    aspirationWindow: measurement.aspirationWindow,
  });
  if (analysis.stats.timedOut || analysis.stats.completedDepth !== depth) {
    throw new Error(`Incomplete formal measurement search at depth ${depth}`);
  }
  return {
    moveKey: AI.moveKey(analysis.move),
    completedDepth: analysis.stats.completedDepth,
    rootScore: analysis.stats.rootScore,
    nodes: analysis.stats.nodes,
    quiescenceNodes: analysis.stats.quiescenceNodes,
    cutoffs: analysis.stats.cutoffs,
    evaluationRequests: analysis.stats.evaluationRequests,
    evaluations: analysis.stats.evaluations,
    evaluationCacheHits: analysis.stats.evaluationCacheHits,
    elapsedMs: analysis.stats.elapsedMs,
    timedOut: analysis.stats.timedOut,
  };
}

function measurementPath(output, index) {
  return path.join(output, "measurements", `selected-${String(index).padStart(4, "0")}.json`);
}

function measure(output, spec, specSha256, force) {
  loadAuthorization(spec, specSha256);
  const source = provenance();
  if (source.sourceTreeDirty) throw new Error("Stage 2 formal measurement requires a clean tracked source tree");
  const selectedArtifact = readJson(path.join(output, "selected-states.json"));
  if (selectedArtifact.specSha256 !== specSha256) throw new Error("Selected-state spec mismatch");
  const measurements = [];
  for (let index = 0; index < selectedArtifact.selected.length; index += 1) {
    const selected = selectedArtifact.selected[index];
    const file = measurementPath(output, index);
    let result = !force && fs.existsSync(file) ? readJson(file) : null;
    if (result && (result.specSha256 !== specSha256 || result.selectionHash !== selectedArtifact.selectionHash
      || result.ruleStateKey !== selected.ruleStateKey)) {
      throw new Error(`Measurement identity mismatch in ${file}`);
    }
    if (!result) {
      const trace = D.analyzeDepthTrace(selected.state, spec.measurement.depths, {
        evaluationProfile: spec.measurement.evaluationProfile,
        quiescenceDepth: spec.measurement.quiescenceDepth,
        orderQuiescenceCaptures: spec.measurement.orderQuiescenceCaptures,
      });
      const workloads = spec.measurement.depths.map((depth) => ({ depth, ...workload(selected.state, depth, spec.measurement) }));
      for (const load of workloads) {
        const exact = trace.results.find(({ depth }) => depth === load.depth);
        if (!exact || exact.bestScore !== load.rootScore || !exact.topSetMoveKeys.includes(load.moveKey)) {
          throw new Error(`Exact/engine formal measurement mismatch at selected ${index}, depth ${load.depth}`);
        }
      }
      result = {
        schemaVersion: 1,
        stageId: spec.stageId,
        formalExperiment: true,
        scientificInferenceAuthorized: false,
        specSha256,
        selectionHash: selectedArtifact.selectionHash,
        selectedIndex: index,
        historicalTrajectoryHash: selected.historicalTrajectoryHash,
        ruleStateKey: selected.ruleStateKey,
        historicalStateHash: selected.historicalStateHash,
        seed: selected.seed,
        gameId: selected.gameId,
        assignedPhase: selected.assignedPhase,
        ply: selected.ply,
        structural: selected.observation.features.actor,
        opponentStructural: selected.observation.features.opponent,
        globalStructural: selected.observation.features.global,
        exactTrace: trace,
        engineWorkload: workloads,
      };
      atomicWriteJson(file, result);
    }
    measurements.push(result);
    console.error(`[pcx stage2 measure] ${index + 1}/${selectedArtifact.selected.length} ${selected.ruleStateKey.slice(0, 12)}`);
  }
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    formalExperiment: true,
    scientificInferenceAuthorized: false,
    measuredAt: new Date().toISOString(),
    specSha256,
    selectionHash: selectedArtifact.selectionHash,
    selectedStates: selectedArtifact.selected.length,
    completedMeasurements: measurements.length,
    measurementHash: hashValue(measurements.map(({ ruleStateKey, exactTrace, engineWorkload }) => ({
      ruleStateKey,
      exactTrace,
      engineWorkload: engineWorkload.map(({ elapsedMs, ...stable }) => stable),
    }))),
    provenance: source,
  };
  atomicWriteJson(path.join(output, "measurement-manifest.json"), manifest);
  return manifest;
}

function status(output, spec) {
  const gamesDir = path.join(output, "games");
  const measurementsDir = path.join(output, "measurements");
  return {
    stageId: spec.stageId,
    output,
    generatedGameFiles: fs.existsSync(gamesDir)
      ? fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).length : 0,
    expectedGames: spec.population.games,
    hasManifest: fs.existsSync(path.join(output, "manifest.json")),
    hasVerification: fs.existsSync(path.join(output, "verification.json")),
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    hasSelectedStates: fs.existsSync(path.join(output, "selected-states.json")),
    measurementFiles: fs.existsSync(measurementsDir)
      ? fs.readdirSync(measurementsDir).filter((name) => /^selected-\d+\.json$/.test(name)).length : 0,
    hasMeasurementManifest: fs.existsSync(path.join(output, "measurement-manifest.json")),
    hasFormalResult: fs.existsSync(path.join(output, "stage2-formal-result.json")),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = loadSpec();
  const output = path.resolve(options.output);
  if (options.phase === "status") {
    console.log(JSON.stringify(status(output, spec), null, 2));
    return;
  }
  if (options.phase === "generate" || options.phase === "all") {
    console.log(JSON.stringify(generate(output, spec, specSha256, options.force), null, 2));
  }
  if (options.phase === "select" || options.phase === "all") {
    console.log(JSON.stringify(selectStates(output, spec, specSha256), null, 2));
  }
  if (options.phase === "measure" || options.phase === "all") {
    console.log(JSON.stringify(measure(output, spec, specSha256, options.force), null, 2));
  }
}

if (require.main === module) main();
module.exports = {
  formalGameId,
  loadAuthorization,
  loadSpec,
  measure,
  provenance,
  runGame,
  selectStates,
  sourceFileHashes,
  status,
};
