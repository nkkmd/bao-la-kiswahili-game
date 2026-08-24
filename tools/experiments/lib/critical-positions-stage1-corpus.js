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
const Branch = require("./critical-positions-outcome-branching.js");
const Contract = require("./critical-positions-stage1-contract.js");
const Validator = require("../validate-critical-positions-stage1-spec.js");

const ROOT = path.resolve(__dirname, "../../..");
const SPEC_PATH = Validator.SPEC_PATH;
const AUTH_PATH = path.join(
  ROOT,
  "doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json",
);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1",
);
const STAGE1_CONTINUATION_SALT = "CPOB-S1-CONT-v1";
const TECHNICAL_CONTINUATION_SALT = "CPOB-S1-TECHNICAL-CONT-v1";
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/tactical-motif-features.js",
  "tools/experiments/lib/critical-positions-outcome-branching.js",
  "tools/experiments/lib/critical-positions-stage1-contract.js",
  "tools/experiments/lib/critical-positions-stage1-discovery.js",
  "tools/experiments/lib/critical-positions-stage1-corpus.js",
  "tools/experiments/validate-critical-positions-stage1-spec.js",
  "tools/experiments/run-critical-positions-stage1-exploratory.js",
  "tools/experiments/verify-critical-positions-stage1-exploratory.js",
  "doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
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
  const loaded = Validator.loadSpec();
  Validator.validateSpec(loaded.spec);
  return loaded;
}

function loadAuthorization(specSha256) {
  if (!fs.existsSync(AUTH_PATH)) {
    throw new Error("Stage 1 generation blocked: authorization file absent");
  }
  const text = fs.readFileSync(AUTH_PATH, "utf8");
  const authorization = JSON.parse(text);
  if (authorization.schemaVersion !== 1
    || authorization.stageId !== Contract.STAGE1_ID
    || authorization.stage1GenerationAuthorized !== true
    || authorization.scientificInferenceAuthorized !== false
    || authorization.confirmatoryReuseAllowed !== false
    || authorization.specSha256 !== specSha256) {
    throw new Error("Invalid Stage 1 authorization semantics/spec binding");
  }
  const actual = sourceFileSha256();
  if (JSON.stringify(authorization.authorizedSourceFileSha256) !== JSON.stringify(actual)) {
    throw new Error("Stage 1 authorization source hashes do not match current source");
  }
  return {
    authorization,
    authorizationSha256: sha256(text),
  };
}

function conditionForGame(spec, gameIndex) {
  const strata = spec.population.conditionAssignment.strata;
  return strata[gameIndex % strata.length];
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
    throw new Error(`Incomplete generator search: ${condition.id}`);
  }
  return result;
}

function runGameCore(spec, specSha256, gameIndex, seed,
  maxPly = spec.population.maxPly, technicalOnly = false, conditionIndex = gameIndex) {
  const random = seededRandom(seed);
  const condition = conditionForGame(spec, conditionIndex);
  const gameId = technicalOnly
    ? `cpob-tech-${condition.id}-${seed}`
    : `cpob-s1-${String(gameIndex).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];

  for (let ply = 0; ply <= maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId,
      conditionId: condition.id,
      seed,
      ply,
    });
    observations.push(observation);
    if (state.winner !== null || ply === maxPly) break;

    let move;
    let source;
    let generationSearch = null;
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
        rootScore: result.stats.rootScore,
        nodes: result.stats.nodes,
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

  const prefixKeys = moves.slice(0, spec.openingFamily.prefixPlies).map((item) => item.moveKey);
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    technicalOnly,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    gameId,
    gameIndex,
    seed,
    conditionId: condition.id,
    observations,
    moves,
    openingPrefix: {
      length: prefixKeys.length,
      moveKeys: prefixKeys,
      hash: hashValue({ length: prefixKeys.length, moveKeys: prefixKeys }),
    },
    historicalTrajectoryHash: hashValue(observations.map((o) => o.identity.historicalStateHash)),
    ruleTrajectoryHash: hashValue(observations.map((o) => o.identity.ruleStateKey)),
    winner: state.winner,
    reason: state.reason || (moves.length >= maxPly ? "max-ply" : ""),
    plies: moves.length,
  };
}

function runScientificGame(spec, specSha256, gameIndex) {
  return runGameCore(spec, specSha256, gameIndex, spec.population.seedStart + gameIndex);
}

function technicalSeed(index = 0) {
  return (0xc0b10000 + index) >>> 0;
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
    .map((list) => list.slice().sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId))[0])
    .sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}

function assignedPhase(historicalTrajectoryHash, spec) {
  const digest = sha256(`${spec.rootSelection.phaseAssignment.salt}|${historicalTrajectoryHash}`);
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0
    ? spec.rootSelection.phaseAssignment.mapping.even
    : spec.rootSelection.phaseAssignment.mapping.odd;
}

function selectionRank(game, observation, spec) {
  return sha256([
    spec.rootSelection.withinAssignedPhase.salt,
    game.historicalTrajectoryHash,
    observation.identity.ruleStateKey,
    observation.ply,
  ].join("|"));
}

function quotaRank(selected, spec) {
  return sha256([
    spec.rootSelection.phaseQuota.salt,
    selected.assignedPhase,
    selected.historicalTrajectoryHash,
    selected.ruleStateKey,
    selected.seed,
  ].join("|"));
}

function candidateForGame(game, spec) {
  const phase = assignedPhase(game.historicalTrajectoryHash, spec);
  const eligible = game.observations
    .filter((observation) => !observation.terminal
      && observation.ply >= spec.rootSelection.minimumPly
      && observation.phase === phase
      && observation.features.actor.legalMoveCount >= spec.rootSelection.minimumLegalMoveCount)
    .map((observation) => ({ observation, rank: selectionRank(game, observation, spec) }))
    .sort((a, b) => a.rank.localeCompare(b.rank)
      || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey));
  if (!eligible.length) return { assignedPhase: phase, selected: null };
  const chosen = eligible[0];
  const selected = {
    historicalTrajectoryHash: game.historicalTrajectoryHash,
    ruleTrajectoryHash: game.ruleTrajectoryHash,
    seed: game.seed,
    gameId: game.gameId,
    gameIndex: game.gameIndex,
    conditionId: game.conditionId,
    openingPrefixHash: game.openingPrefix.hash,
    assignedPhase: phase,
    selectionRank: chosen.rank,
    ply: chosen.observation.ply,
    ruleStateKey: chosen.observation.identity.ruleStateKey,
    historicalStateHash: chosen.observation.identity.historicalStateHash,
    observation: chosen.observation,
    state: stateFromObservation(chosen.observation),
  };
  selected.quotaRank = quotaRank(selected, spec);
  return { assignedPhase: phase, selected };
}

function collapseDuplicateRuleStates(items) {
  const byRule = new Map();
  for (const item of items) {
    const current = byRule.get(item.ruleStateKey);
    if (!current
      || item.historicalTrajectoryHash.localeCompare(current.historicalTrajectoryHash) < 0
      || (item.historicalTrajectoryHash === current.historicalTrajectoryHash && item.seed < current.seed)) {
      byRule.set(item.ruleStateKey, item);
    }
  }
  return [...byRule.values()];
}

function applyPhaseQuota(items, spec, phaseQuota = spec.rootSelection.phaseQuota) {
  const selected = [];
  const poolCounts = {};
  const quotaDropped = {};
  for (const phase of ["namua", "mtaji"]) {
    const pool = items.filter((item) => item.assignedPhase === phase)
      .sort((a, b) => a.quotaRank.localeCompare(b.quotaRank)
        || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
    const quota = phaseQuota[phase];
    poolCounts[phase] = pool.length;
    selected.push(...pool.slice(0, quota));
    quotaDropped[phase] = Math.max(0, pool.length - quota);
  }
  selected.sort((a, b) => a.assignedPhase.localeCompare(b.assignedPhase)
    || a.quotaRank.localeCompare(b.quotaRank));
  return { selected, poolCounts, quotaDropped };
}

function selectionReadiness(games, representatives, selected, spec) {
  const phaseCounts = {};
  const conditionCounts = {};
  for (const item of selected) {
    phaseCounts[item.assignedPhase] = (phaseCounts[item.assignedPhase] || 0) + 1;
    conditionCounts[item.conditionId] = (conditionCounts[item.conditionId] || 0) + 1;
  }
  const selectedDistinctOpeningPrefixes = new Set(selected.map((item) => item.openingPrefixHash)).size;
  const generatedDistinctOpeningPrefixes = new Set(games.map((game) => game.openingPrefix.hash)).size;
  const maxConditionShare = selected.length
    ? Math.max(0, ...Object.values(conditionCounts)) / selected.length
    : 1;
  const gates = spec.readinessGates;
  const checks = {
    uniqueHistoricalTrajectories:
      representatives.length >= gates.minimumUniqueHistoricalTrajectories,
    generatedDistinctOpeningPrefixes:
      generatedDistinctOpeningPrefixes >= gates.minimumGeneratedDistinctOpeningPrefixes,
    selectedUniqueRuleStates:
      selected.length === gates.requiredSelectedUniqueRuleStates,
    namuaSelectedRoots:
      (phaseCounts.namua || 0) === gates.requiredNamuaSelectedRoots,
    mtajiSelectedRoots:
      (phaseCounts.mtaji || 0) === gates.requiredMtajiSelectedRoots,
    selectedDistinctOpeningPrefixes:
      selectedDistinctOpeningPrefixes >= gates.minimumSelectedDistinctOpeningPrefixes,
    selectedPerGenerationStratum:
      spec.population.conditionAssignment.strata.every(({ id }) =>
        (conditionCounts[id] || 0) >= gates.minimumSelectedPerGenerationStratum),
    maximumSingleSelectedGenerationStratumShare:
      maxConditionShare <= gates.maximumSingleSelectedGenerationStratumShare,
  };
  return {
    phaseCounts,
    conditionCounts,
    selectedDistinctOpeningPrefixes,
    generatedDistinctOpeningPrefixes,
    maximumSingleSelectedGenerationStratumShare: maxConditionShare,
    gates: checks,
    passed: Object.values(checks).every(Boolean),
  };
}

function selectRoots(games, spec, options = {}) {
  const representatives = representativeGames(games);
  const raw = [];
  const unavailable = [];
  for (const game of representatives) {
    const candidate = candidateForGame(game, spec);
    if (!candidate.selected) {
      unavailable.push({
        historicalTrajectoryHash: game.historicalTrajectoryHash,
        seed: game.seed,
        conditionId: game.conditionId,
        assignedPhase: candidate.assignedPhase,
      });
    } else {
      raw.push(candidate.selected);
    }
  }
  const deduplicated = collapseDuplicateRuleStates(raw);
  const quota = applyPhaseQuota(
    deduplicated,
    spec,
    options.phaseQuota || spec.rootSelection.phaseQuota,
  );
  const selected = quota.selected;
  const selectionHash = hashValue(selected.map((item) => ({
    historicalTrajectoryHash: item.historicalTrajectoryHash,
    ruleStateKey: item.ruleStateKey,
    ply: item.ply,
    assignedPhase: item.assignedPhase,
    conditionId: item.conditionId,
    openingPrefixHash: item.openingPrefixHash,
    selectionRank: item.selectionRank,
    quotaRank: item.quotaRank,
  })));
  const readiness = options.strictReadiness === false
    ? { passed: true, technicalOverride: true }
    : selectionReadiness(games, representatives, selected, spec);
  return {
    schemaVersion: 1,
    stageId: spec.stageId,
    generatedGames: games.length,
    uniqueHistoricalTrajectories: representatives.length,
    unavailableAssignedPhase: unavailable.length,
    unavailable,
    selectedBeforeRuleStateCollapse: raw.length,
    duplicateSelectedRuleStatesCollapsed: raw.length - deduplicated.length,
    phasePoolAfterRuleStateCollapse: quota.poolCounts,
    droppedByPhaseQuota: quota.quotaDropped,
    selectedUniqueRuleStates: selected.length,
    replacementPerformed: false,
    phaseReassignmentPerformed: false,
    selectionHash,
    readiness,
    selected,
  };
}

function compactContinuation(record) {
  return {
    replicateIndex: record.replicateIndex,
    seed32: record.seed32,
    outcome: record.outcome,
    continuationPlies: record.continuationMoves.length,
    finalRuleStateKey: record.finalIdentity.ruleStateKey,
    finalPhase: record.finalPhase,
    finalTurn: record.finalTurn,
    recordHash: record.recordHash,
  };
}

function finiteSearchTrace(trace) {
  return trace.results.every((result) => result.candidates.length > 0
    && result.candidates.every((candidate) => Number.isFinite(candidate.score)));
}

function measureSelectedRoot(selected, selectedIndex, spec, options = {}) {
  const replicates = options.replicates ?? Contract.REPLICATES;
  const maxContinuationPlies = options.maxContinuationPlies ?? Contract.MAX_CONTINUATION_PLIES;
  const stageSalt = options.stageSalt || STAGE1_CONTINUATION_SALT;
  const measurement = Branch.measureRoot(selected.state, {
    policyId: Contract.POLICY_ID,
    replicates,
    maxContinuationPlies,
    stageSalt,
  });
  const compactMoves = measurement.moves.map((item) => ({
    moveKey: item.moveKey,
    move: item.move,
    summary: item.summary,
    records: item.records.map(compactContinuation),
  }));
  const divergence = Contract.summarizeRootDivergence({ moves: compactMoves });
  const secondarySearch = Branch.secondarySearchAxes(selected.state);
  const structuralBranches = Branch.structuralBranchSummary(selected.state);
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    selectedIndex,
    selectionHash: options.selectionHash || null,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleStateKey: selected.ruleStateKey,
    historicalStateHash: selected.historicalStateHash,
    seed: selected.seed,
    gameId: selected.gameId,
    gameIndex: selected.gameIndex,
    conditionId: selected.conditionId,
    openingPrefixHash: selected.openingPrefixHash,
    phase: selected.assignedPhase,
    ply: selected.ply,
    rootActor: selected.state.player,
    policyId: Contract.POLICY_ID,
    replicates,
    maxContinuationPlies,
    stageSalt,
    exactLegalMoveCount: compactMoves.length,
    rootStructuralTokens: Contract.structuralTokens(selected.state),
    moves: compactMoves,
    divergence,
    secondarySearch,
    secondarySearchFinite: finiteSearchTrace(secondarySearch),
    structuralBranches,
  };
  result.measurementHash = Branch.canonicalHash(result);
  return result;
}

function measurementReadiness(measurements, spec) {
  const estimable = measurements.filter((item) => item.divergence.estimable);
  const estimableNamua = estimable.filter((item) => item.phase === "namua").length;
  const estimableMtaji = estimable.filter((item) => item.phase === "mtaji").length;
  const interventions = measurements.reduce((sum, item) => sum + item.exactLegalMoveCount, 0);
  const gates = spec.readinessGates;
  const checks = {
    measuredExactRootMoveInterventions:
      interventions >= gates.minimumMeasuredExactRootMoveInterventions,
    primaryEstimableRoots:
      estimable.length >= gates.minimumPrimaryEstimableRoots,
    primaryEstimableNamuaRoots:
      estimableNamua >= gates.minimumPrimaryEstimableNamuaRoots,
    primaryEstimableMtajiRoots:
      estimableMtaji >= gates.minimumPrimaryEstimableMtajiRoots,
    finiteD2D3CandidateTables:
      measurements.every((item) => item.secondarySearchFinite),
  };
  return {
    measuredExactRootMoveInterventions: interventions,
    primaryEstimableRoots: estimable.length,
    primaryNonEstimableRoots: measurements.length - estimable.length,
    primaryEstimableNamuaRoots: estimableNamua,
    primaryEstimableMtajiRoots: estimableMtaji,
    gates: checks,
    passed: Object.values(checks).every(Boolean),
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
  AUTH_PATH,
  DEFAULT_OUTPUT,
  ROOT,
  SOURCE_FILES,
  SPEC_PATH,
  STAGE1_CONTINUATION_SALT,
  TECHNICAL_CONTINUATION_SALT,
  aiMove,
  assignedPhase,
  candidateForGame,
  conditionForGame,
  gamePath,
  loadAuthorization,
  loadSpec,
  measureSelectedRoot,
  measurementPath,
  measurementReadiness,
  provenance,
  quotaRank,
  readGames,
  readJson,
  representativeGames,
  runGameCore,
  runScientificGame,
  selectRoots,
  selectionRank,
  sha256,
  sourceFileSha256,
  stateFromObservation,
  technicalSeed,
  writeJson,
};
