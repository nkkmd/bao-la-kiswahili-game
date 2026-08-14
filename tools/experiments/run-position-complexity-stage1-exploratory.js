#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./lib/position-typology-features.js");
const D = require("./lib/position-complexity-search-diagnostic.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-complexity/stage1-exploratory-v1");
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
  "doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
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

function parseArgs(argv) {
  const options = {
    phase: "status",
    output: DEFAULT_OUTPUT,
    force: false,
  };
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

function loadSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(text);
  const expectedGames = spec.population.seedEnd - spec.population.seedStart + 1;
  if (spec.population.games !== expectedGames) throw new Error("Stage 1 spec game/seed range mismatch");
  if (spec.stage2Boundary.stage2GenerationAuthorizedByThisSpec !== false) {
    throw new Error("Stage 1 spec must not authorize Stage 2");
  }
  if (spec.stopping.earlyStopAllowed !== false || spec.stopping.outcomeDependentExtensionAllowed !== false) {
    throw new Error("Stage 1 stopping rule is not fixed");
  }
  return { spec, specSha256: sha256Text(text) };
}

function gamePath(output, gameIndex) {
  return path.join(output, "games", `game-${String(gameIndex).padStart(4, "0")}.json`);
}

function chooseOpeningMove(state, random) {
  const moves = E.moveVariants(state);
  if (!moves.length) return null;
  return moves[Math.floor(random() * moves.length)];
}

function chooseTrajectoryMove(state, spec, random) {
  const search = spec.population.trajectoryGenerator;
  return AI.analyzeMove(state, search.level, random, {
    evaluationProfile: search.evaluationProfile,
    searchProfile: search.searchProfile,
    maxDepth: search.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: search.quiescenceDepth,
    stableBestDepths: search.stableBestDepths,
    aspirationWindow: search.aspirationWindow,
  });
}

function runGame(spec, specSha256, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const random = seededRandom(seed);
  const gameId = `pcx-s1-${String(gameIndex).padStart(4, "0")}`;
  const observations = [];
  const moves = [];
  let state = E.initialState();

  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, { gameId, seed, conditionId: "P2-D2", ply });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;

    const opening = ply < spec.population.opening.plies;
    let move = null;
    let generationSearch = null;
    if (opening) {
      move = chooseOpeningMove(state, random);
    } else {
      const analysis = chooseTrajectoryMove(state, spec, random);
      move = analysis.move;
      generationSearch = {
        completedDepth: analysis.stats.completedDepth,
        nodes: analysis.stats.nodes,
        quiescenceNodes: analysis.stats.quiescenceNodes,
        cutoffs: analysis.stats.cutoffs,
        evaluations: analysis.stats.evaluations,
        rootScore: analysis.stats.rootScore,
        timedOut: analysis.stats.timedOut,
      };
      if (analysis.stats.timedOut || analysis.stats.completedDepth !== spec.population.trajectoryGenerator.maxDepth) {
        throw new Error(`Incomplete trajectory-generation search at game ${gameIndex}, ply ${ply}`);
      }
    }
    if (!move) break;
    const before = observation.identity;
    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    moves.push({
      ply,
      player: state.player,
      source: opening ? "opening-random" : "trajectory-ai",
      move: JSON.parse(JSON.stringify(move)),
      moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: before.historicalStateHash,
      beforeRuleStateKey: before.ruleStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRuleStateKey: after.ruleStateKey,
      generationSearch,
    });
    state = applied.state;
  }

  const historicalSequence = observations.map(({ identity }) => identity.historicalStateHash);
  const ruleSequence = observations.map(({ identity }) => identity.ruleStateKey);
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    gameId,
    gameIndex,
    seed,
    observations,
    moves,
    historicalTrajectoryHash: hashValue(historicalSequence),
    ruleTrajectoryHash: hashValue(ruleSequence),
    winner: state.winner,
    reason: state.reason || (moves.length >= spec.population.maxPly ? "max-ply" : "no-move"),
    plies: moves.length,
  };
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
  const observations = games.reduce((total, game) => total + game.observations.length, 0);
  const reachedMtaji = games.filter((game) => game.observations.some(({ phase }) => phase === "mtaji")).length;
  return {
    games: games.length,
    observations,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: trajectoryCounts.size ? Math.max(...trajectoryCounts.values()) : 0,
    reachedMtajiGames: reachedMtaji,
  };
}

function generate(output, spec, specSha256, force) {
  const source = provenance();
  if (source.sourceTreeDirty) throw new Error("Stage 1 generation requires a clean source tree for tracked study source files");
  const games = [];
  for (let gameIndex = 0; gameIndex < spec.population.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    let game = force ? null : readExistingGame(file, specSha256);
    if (!game) {
      game = runGame(spec, specSha256, gameIndex);
      atomicWriteJson(file, game);
    }
    games.push(game);
    console.error(`[pcx stage1 generate] ${gameIndex + 1}/${spec.population.games} ${game.gameId}`);
  }
  const summary = summarizeGames(games);
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    exploratory: true,
    formalExperiment: false,
    confirmatoryReuseAllowed: false,
    generatedAt: new Date().toISOString(),
    output,
    specSha256,
    provenance: source,
    summary,
    summaryHash: hashValue(summary),
  };
  atomicWriteJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}

function readAllGames(output, spec) {
  const games = [];
  for (let gameIndex = 0; gameIndex < spec.population.games; gameIndex += 1) {
    const file = gamePath(output, gameIndex);
    if (!fs.existsSync(file)) throw new Error(`Missing generated game: ${file}`);
    games.push(readJson(file));
  }
  return games;
}

function representativeGames(games) {
  const groups = new Map();
  for (const game of games) {
    const list = groups.get(game.historicalTrajectoryHash) || [];
    list.push(game);
    groups.set(game.historicalTrajectoryHash, list);
  }
  const representatives = [];
  for (const list of groups.values()) {
    list.sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId));
    representatives.push(list[0]);
  }
  return representatives.sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}

function assignedPhase(historicalTrajectoryHash, selection) {
  const digest = sha256Text(`${selection.phaseAssignment.salt}|${historicalTrajectoryHash}`);
  const parity = Number.parseInt(digest.slice(0, 8), 16) % 2;
  return parity === 0 ? selection.phaseAssignment.mapping.even : selection.phaseAssignment.mapping.odd;
}

function selectionRank(game, observation, selection) {
  const fields = [game.historicalTrajectoryHash, observation.identity.ruleStateKey, observation.ply];
  return sha256Text(`${selection.withinAssignedPhase.salt}|${fields.join("|")}`);
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

function selectStates(output, spec, specSha256) {
  const games = readAllGames(output, spec);
  const representatives = representativeGames(games);
  const selectedRaw = [];
  const unavailable = [];
  for (const game of representatives) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec.stateSelection);
    const eligible = game.observations.filter((observation) => !observation.terminal
      && observation.ply >= spec.stateSelection.minimumPly
      && observation.phase === phase
      && observation.features.actor.legalMoveCount >= spec.stateSelection.minimumLegalMoveCount)
      .map((observation) => ({ observation, rank: selectionRank(game, observation, spec.stateSelection) }))
      .sort((a, b) => a.rank.localeCompare(b.rank)
        || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey)
        || a.observation.ply - b.observation.ply);
    if (!eligible.length) {
      unavailable.push({ historicalTrajectoryHash: game.historicalTrajectoryHash, seed: game.seed, assignedPhase: phase });
      continue;
    }
    const chosen = eligible[0];
    selectedRaw.push({
      historicalTrajectoryHash: game.historicalTrajectoryHash,
      ruleTrajectoryHash: game.ruleTrajectoryHash,
      seed: game.seed,
      gameId: game.gameId,
      assignedPhase: phase,
      selectionRank: chosen.rank,
      ply: chosen.observation.ply,
      ruleStateKey: chosen.observation.identity.ruleStateKey,
      historicalStateHash: chosen.observation.identity.historicalStateHash,
      observation: chosen.observation,
      state: stateFromObservation(chosen.observation),
    });
  }

  const byRuleState = new Map();
  for (const selected of selectedRaw) {
    const current = byRuleState.get(selected.ruleStateKey);
    if (!current || selected.historicalTrajectoryHash < current.historicalTrajectoryHash) {
      byRuleState.set(selected.ruleStateKey, selected);
    }
  }
  const selected = [...byRuleState.values()].sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const selectedKeys = new Set(selected.map(({ historicalTrajectoryHash }) => historicalTrajectoryHash));
  const collapsedRuleDuplicates = selectedRaw.filter(({ historicalTrajectoryHash }) => !selectedKeys.has(historicalTrajectoryHash))
    .map(({ historicalTrajectoryHash, ruleStateKey, seed, assignedPhase, ply }) => ({
      historicalTrajectoryHash, ruleStateKey, seed, assignedPhase, ply,
    }));
  const phaseCounts = selected.reduce((counts, item) => {
    counts[item.assignedPhase] = (counts[item.assignedPhase] || 0) + 1;
    return counts;
  }, {});
  const audit = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    generatedGames: games.length,
    uniqueHistoricalTrajectories: representatives.length,
    assignedPhaseCounts: representatives.reduce((counts, game) => {
      const phase = assignedPhase(game.historicalTrajectoryHash, spec.stateSelection);
      counts[phase] = (counts[phase] || 0) + 1;
      return counts;
    }, {}),
    unavailableAssignedPhase: unavailable.length,
    unavailable,
    selectedBeforeRuleStateCollapse: selectedRaw.length,
    duplicateSelectedRuleStatesCollapsed: collapsedRuleDuplicates.length,
    collapsedRuleDuplicates,
    selectedUniqueRuleStates: selected.length,
    selectedPhaseCounts: phaseCounts,
    selectionHash: hashValue(selected.map(({ historicalTrajectoryHash, ruleStateKey, ply, assignedPhase, selectionRank }) => ({
      historicalTrajectoryHash, ruleStateKey, ply, assignedPhase, selectionRank,
    }))),
  };
  atomicWriteJson(path.join(output, "selection-audit.json"), audit);
  atomicWriteJson(path.join(output, "selected-states.json"), {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash: audit.selectionHash,
    selected,
  });
  return audit;
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
    throw new Error(`Incomplete measurement search at depth ${depth}`);
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
  const source = provenance();
  if (source.sourceTreeDirty) throw new Error("Stage 1 measurement requires a clean source tree for tracked study source files");
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
          throw new Error(`Exact/engine measurement mismatch at selected ${index}, depth ${load.depth}`);
        }
      }
      result = {
        schemaVersion: 1,
        stageId: spec.stageId,
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
    console.error(`[pcx stage1 measure] ${index + 1}/${selectedArtifact.selected.length} ${selected.ruleStateKey.slice(0, 12)}`);
  }
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    exploratory: true,
    formalExperiment: false,
    confirmatoryReuseAllowed: false,
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
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    hasSelectedStates: fs.existsSync(path.join(output, "selected-states.json")),
    measurementFiles: fs.existsSync(measurementsDir)
      ? fs.readdirSync(measurementsDir).filter((name) => /^selected-\d+\.json$/.test(name)).length : 0,
    hasMeasurementManifest: fs.existsSync(path.join(output, "measurement-manifest.json")),
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
  assignedPhase,
  loadSpec,
  representativeGames,
  runGame,
  selectStates,
  selectionRank,
  stateFromObservation,
  status,
};
