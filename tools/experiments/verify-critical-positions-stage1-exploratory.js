#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
} = require("./lib/position-typology-features.js");
const Search = require("./lib/position-complexity-search-diagnostic.js");
const Tactical = require("./lib/tactical-motif-features.js");
const Branch = require("./lib/critical-positions-outcome-branching.js");
const Contract = require("./lib/critical-positions-stage1-contract.js");
const Discovery = require("./lib/critical-positions-stage1-discovery.js");
const C = require("./lib/critical-positions-stage1-corpus.js");

const SEARCH_OPTIONS = {
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
};

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseArgs(argv) {
  const result = { phase: null, input: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--phase") result.phase = argv[++index];
    else if (arg === "--input") result.input = path.resolve(argv[++index]);
    else if (arg === "--output") result.output = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!result.phase) result.phase = result.input ? "technical-pipeline-smoke" : "corpus";
  return result;
}

function exactMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
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
  assert.equal(result.stats.timedOut, false);
  assert.equal(result.stats.completedDepth, g.maxDepth);
  return result;
}

function replayGame(game, spec, expectedMaxPly = null, conditionIndex = game.gameIndex) {
  const random = seededRandom(game.seed);
  const condition = C.conditionForGame(spec, conditionIndex);
  assert.equal(game.conditionId, condition.id);
  let state = E.initialState();
  const historicalHashes = [];
  const ruleKeys = [];
  const expectedMoves = game.moves.length;
  for (let ply = 0; ply <= expectedMoves; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId: game.gameId,
      conditionId: condition.id,
      seed: game.seed,
      ply,
    });
    historicalHashes.push(observation.identity.historicalStateHash);
    ruleKeys.push(observation.identity.ruleStateKey);
    const stored = game.observations[ply];
    assert.ok(stored, `Missing stored observation at ply ${ply}`);
    assert.equal(stored.identity.historicalStateHash, observation.identity.historicalStateHash);
    assert.equal(stored.identity.ruleStateKey, observation.identity.ruleStateKey);
    assert.equal(stored.phase, observation.phase);
    assert.equal(stored.player, observation.player);
    if (ply === expectedMoves) break;

    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      move = aiMove(state, condition, random).move;
    }
    assert.equal(AI.moveKey(move), game.moves[ply].moveKey);
    const applied = E.applyMove(state, move);
    assert.equal(identityKeys(applied.state).ruleStateKey, game.moves[ply].afterRuleStateKey);
    state = applied.state;
  }
  if (expectedMaxPly !== null) assert.ok(game.moves.length <= expectedMaxPly);
  assert.equal(hashValue(historicalHashes), game.historicalTrajectoryHash);
  assert.equal(hashValue(ruleKeys), game.ruleTrajectoryHash);
  assert.equal(state.winner, game.winner);
  const prefixKeys = game.moves.slice(0, spec.openingFamily.prefixPlies).map((item) => item.moveKey);
  assert.equal(game.openingPrefix.hash, hashValue({ length: prefixKeys.length, moveKeys: prefixKeys }));
  return true;
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

function assignedPhase(hash, spec) {
  const digest = sha256(`${spec.rootSelection.phaseAssignment.salt}|${hash}`);
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

function quotaRank(item, spec) {
  return sha256([
    spec.rootSelection.phaseQuota.salt,
    item.assignedPhase,
    item.historicalTrajectoryHash,
    item.ruleStateKey,
    item.seed,
  ].join("|"));
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

function independentSelect(games, spec, phaseQuota) {
  const representatives = representativeGames(games);
  const raw = [];
  for (const game of representatives) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = game.observations
      .filter((observation) => {
        if (observation.terminal || observation.ply < spec.rootSelection.minimumPly
          || observation.phase !== phase) return false;
        const state = stateFromObservation(observation);
        return E.moveVariants(state).length >= spec.rootSelection.minimumLegalMoveCount;
      })
      .map((observation) => ({ observation, rank: selectionRank(game, observation, spec) }))
      .sort((a, b) => a.rank.localeCompare(b.rank)
        || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey));
    if (!eligible.length) continue;
    const chosen = eligible[0];
    const item = {
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
    item.quotaRank = quotaRank(item, spec);
    raw.push(item);
  }
  const byRule = new Map();
  for (const item of raw) {
    const current = byRule.get(item.ruleStateKey);
    if (!current
      || item.historicalTrajectoryHash.localeCompare(current.historicalTrajectoryHash) < 0
      || (item.historicalTrajectoryHash === current.historicalTrajectoryHash && item.seed < current.seed)) {
      byRule.set(item.ruleStateKey, item);
    }
  }
  const deduplicated = [...byRule.values()];
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    const pool = deduplicated.filter((item) => item.assignedPhase === phase)
      .sort((a, b) => a.quotaRank.localeCompare(b.quotaRank)
        || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
    selected.push(...pool.slice(0, phaseQuota[phase]));
  }
  selected.sort((a, b) => a.assignedPhase.localeCompare(b.assignedPhase)
    || a.quotaRank.localeCompare(b.quotaRank));
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
  return { selected, selectionHash };
}

function deriveSeed32(root, replicateIndex, stageSalt) {
  const material = `${stageSalt}|${identityKeys(root).ruleStateKey}|${root.player}|${replicateIndex}`;
  return Number.parseInt(sha256(material).slice(0, 8), 16) >>> 0;
}

function terminalOutcome(state, rootActor) {
  if (state.winner === null) return null;
  return {
    category: state.winner === rootActor ? "ROOT_ACTOR_WIN" : "ROOT_ACTOR_LOSS",
    winner: state.winner,
    reason: state.reason || "",
  };
}

function independentContinuation(root, rootMove, replicateIndex, options) {
  const rootActor = root.player;
  const rootIdentity = identityKeys(root);
  const rootMoveKey = AI.moveKey(rootMove);
  const seed32 = deriveSeed32(root, replicateIndex, options.stageSalt);
  const random = seededRandom(seed32);
  let state = E.applyMove(root, rootMove).state;
  const continuationMoves = [];
  for (let ply = 0; ply < options.maxContinuationPlies && state.winner === null; ply += 1) {
    const analyzed = AI.analyzeMove(state, "normal", random, { evaluationProfile: "bao" });
    const legal = exactMoves(state);
    const moveKey = AI.moveKey(analyzed.move);
    const move = legal.find((candidate) => AI.moveKey(candidate) === moveKey);
    assert.ok(move, `Independent P1 selected non-exact move: ${moveKey}`);
    const applied = E.applyMove(state, move);
    continuationMoves.push({
      continuationPly: ply,
      player: state.player,
      moveKey,
      policyId: Contract.POLICY_ID,
      diagnostic: { completedDepth: analyzed.stats.completedDepth },
      afterRuleStateKey: identityKeys(applied.state).ruleStateKey,
    });
    state = applied.state;
  }
  const outcome = terminalOutcome(state, rootActor) || {
    category: "ADMINISTRATIVE_UNFINISHED",
    winner: null,
    reason: "continuation-cap",
  };
  const full = {
    schemaVersion: 1,
    rootActor,
    rootIdentity,
    rootMoveKey,
    replicateIndex,
    seed32,
    policyId: Contract.POLICY_ID,
    maxContinuationPlies: options.maxContinuationPlies,
    continuationMoves,
    outcome,
    finalIdentity: identityKeys(state),
    finalPhase: state.phase,
    finalTurn: state.turn,
  };
  full.recordHash = Branch.canonicalHash(full);
  return {
    replicateIndex,
    seed32,
    outcome,
    continuationPlies: continuationMoves.length,
    finalRuleStateKey: full.finalIdentity.ruleStateKey,
    finalPhase: full.finalPhase,
    finalTurn: full.finalTurn,
    recordHash: full.recordHash,
  };
}

function summarize(records) {
  const counts = { ROOT_ACTOR_WIN: 0, ROOT_ACTOR_LOSS: 0, ADMINISTRATIVE_UNFINISHED: 0 };
  for (const record of records) counts[record.outcome.category] += 1;
  const completed = counts.ROOT_ACTOR_WIN + counts.ROOT_ACTOR_LOSS;
  return {
    counts,
    total: records.length,
    completed,
    completionRate: completed / records.length,
    empiricalContinuationWinRateCompleted: completed ? counts.ROOT_ACTOR_WIN / completed : null,
  };
}

function independentMeasurement(selected, selectedIndex, spec, options) {
  const state = selected.state;
  const moves = exactMoves(state).map((move) => {
    const records = Array.from({ length: options.replicates }, (_, replicateIndex) =>
      independentContinuation(state, move, replicateIndex, options));
    return {
      moveKey: AI.moveKey(move),
      move: JSON.parse(JSON.stringify(move)),
      summary: summarize(records),
      records,
    };
  });
  const divergence = Contract.summarizeRootDivergence({ moves });
  const secondarySearch = Search.analyzeDepthTrace(state, [2, 3], SEARCH_OPTIONS);
  const secondarySearchFinite = secondarySearch.results.every((result) => result.candidates.length > 0
    && result.candidates.every((candidate) => Number.isFinite(candidate.score)));
  const structuralBranches = exactMoves(state).map((move) => ({
    moveKey: AI.moveKey(move),
    transition: Tactical.summarizeMoveTransition(state, move),
    responseEnvelope: Tactical.summarizeReplyEnvelope(state, move),
  }));
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    selectedIndex,
    selectionHash: options.selectionHash,
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
    rootActor: state.player,
    policyId: Contract.POLICY_ID,
    replicates: options.replicates,
    maxContinuationPlies: options.maxContinuationPlies,
    stageSalt: options.stageSalt,
    exactLegalMoveCount: moves.length,
    rootStructuralTokens: Contract.structuralTokens(state),
    moves,
    divergence,
    secondarySearch,
    secondarySearchFinite,
    structuralBranches,
  };
  result.measurementHash = Branch.canonicalHash(result);
  return result;
}

function verifyTechnical(input, spec, specSha256) {
  const payload = C.readJson(input);
  assert.equal(payload.technicalOnly, true);
  assert.equal(payload.scientificSeedConsumed, false);
  assert.equal(payload.reservedScientificSeedBlocksTouched, false);
  assert.equal(payload.specSha256, specSha256);
  const withoutHash = { ...payload };
  delete withoutHash.resultHash;
  assert.equal(payload.resultHash, hashValue(withoutHash));
  for (const game of payload.games) {
    assert.equal(game.seed >= spec.population.seedStart && game.seed <= spec.population.seedEnd, false);
    assert.equal(game.seed >= spec.stage2Boundary.stage2SeedReservation.seedStart
      && game.seed <= spec.stage2Boundary.stage2SeedReservation.seedEnd, false);
    replayGame(game, spec, payload.technicalConfig.maxGamePly, 0);
  }
  const selected = independentSelect(payload.games, spec, payload.technicalConfig.phaseQuota);
  assert.equal(selected.selectionHash, payload.selection.selectionHash);
  assert.deepEqual(selected.selected, payload.selection.selected);
  const measurements = selected.selected.map((root, index) => independentMeasurement(root, index, spec, {
    selectionHash: selected.selectionHash,
    replicates: payload.technicalConfig.replicates,
    maxContinuationPlies: payload.technicalConfig.maxContinuationPlies,
    stageSalt: payload.technicalConfig.stageSalt,
  }));
  assert.deepEqual(measurements, payload.measurements);
  const discovery = Discovery.discover(selected.selected, measurements, spec);
  assert.deepEqual(discovery, payload.discovery);
  return {
    stageId: spec.stageId,
    passed: true,
    technicalOnly: true,
    gamesVerified: payload.games.length,
    rootsReselected: selected.selected.length,
    measurementsFullyRemeasured: measurements.length,
    deterministicDiscoveryRecomputed: true,
    scientificSeedConsumed: false,
  };
}

function verifyCorpus(output, spec, specSha256) {
  const manifestPath = path.join(output, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error("manifest.json absent");
  const manifest = C.readJson(manifestPath);
  assert.equal(manifest.specSha256, specSha256);
  const games = C.readGames(output, spec);
  const conditionCounts = {};
  for (let index = 0; index < games.length; index += 1) {
    const game = games[index];
    assert.equal(game.gameIndex, index);
    assert.equal(game.seed, spec.population.seedStart + index);
    assert.equal(game.technicalOnly, false);
    replayGame(game, spec);
    conditionCounts[game.conditionId] = (conditionCounts[game.conditionId] || 0) + 1;
  }
  const trajectoryCounts = new Map();
  for (const game of games) {
    trajectoryCounts.set(game.historicalTrajectoryHash, (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1);
  }
  const summary = {
    games: games.length,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: Math.max(...trajectoryCounts.values()),
    distinctOpeningPrefixes: new Set(games.map((game) => game.openingPrefix.hash)).size,
    conditionCounts,
  };
  assert.deepEqual(summary, manifest.summary);
  assert.equal(hashValue(summary), manifest.summaryHash);
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    passed: true,
    gamesVerified: games.length,
    fullCorpusReplay: true,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    distinctOpeningPrefixes: summary.distinctOpeningPrefixes,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
  };
  C.writeJson(path.join(output, "verification.json"), result);
  return result;
}

function verifyMeasurements(output, spec, specSha256) {
  const verification = C.readJson(path.join(output, "verification.json"));
  assert.equal(verification.passed, true);
  assert.equal(verification.fullCorpusReplay, true);
  const games = C.readGames(output, spec);
  const independentlySelected = independentSelect(games, spec, spec.rootSelection.phaseQuota);
  const storedRoots = C.readJson(path.join(output, "selected-roots.json"));
  assert.equal(storedRoots.specSha256, specSha256);
  assert.equal(independentlySelected.selectionHash, storedRoots.selectionHash);
  assert.deepEqual(independentlySelected.selected, storedRoots.selected);
  const measurements = [];
  for (let index = 0; index < independentlySelected.selected.length; index += 1) {
    const expected = independentMeasurement(independentlySelected.selected[index], index, spec, {
      selectionHash: independentlySelected.selectionHash,
      replicates: Contract.REPLICATES,
      maxContinuationPlies: Contract.MAX_CONTINUATION_PLIES,
      stageSalt: C.STAGE1_CONTINUATION_SALT,
    });
    const stored = C.readJson(C.measurementPath(output, index));
    assert.deepEqual(stored, expected);
    measurements.push(expected);
    console.error(`[cpob stage1 verify measurement] ${index + 1}/${independentlySelected.selected.length}`);
  }
  const readiness = C.measurementReadiness(measurements, spec);
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash: independentlySelected.selectionHash,
    passed: readiness.passed,
    rootsReselectedIndependently: independentlySelected.selected.length,
    fullContinuationRemeasurement: true,
    fullSecondaryRecomputation: true,
    fullStructuralRecomputation: true,
    ...readiness,
  };
  C.writeJson(path.join(output, "measurement-verification.json"), result);
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  let result;
  if (args.phase === "technical-pipeline-smoke") {
    if (!args.input) throw new Error("--input required for technical pipeline verification");
    result = verifyTechnical(args.input, loaded.spec, loaded.specSha256);
  } else if (args.phase === "corpus") {
    if (!args.output) throw new Error("--output required for corpus verification");
    result = verifyCorpus(args.output, loaded.spec, loaded.specSha256);
  } else if (args.phase === "measurement") {
    if (!args.output) throw new Error("--output required for measurement verification");
    result = verifyMeasurements(args.output, loaded.spec, loaded.specSha256);
  } else {
    throw new Error(`Unsupported verification phase: ${args.phase}`);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) main();
module.exports = {
  independentMeasurement,
  independentSelect,
  replayGame,
  verifyCorpus,
  verifyMeasurements,
  verifyTechnical,
};
