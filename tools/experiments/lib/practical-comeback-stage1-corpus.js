"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const Raw = require("./ssgtc-representation-production.js");
const P = require("./practical-comeback-stage0-production.js");

function sha256(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function canonicalHash(value) { return sha256(Raw.stableStringify(value)); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function conditionForGame(spec, gameIndex) {
  const strata = spec.population.conditionAssignment.strata;
  return strata[gameIndex % strata.length];
}

function generatorMove(state, condition, rng) {
  Raw.assertStudyState(state);
  const g = condition.generator;
  const result = AI.analyzeMove(state, g.level, rng, {
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
    throw new Error(`Incomplete generator search for ${condition.id}`);
  }
  return result.move;
}

function historicalStateHash(state, ply) {
  Raw.assertStudyState(state);
  return canonicalHash({ rawStateKey: Raw.stateKey(state), turn: Number.isFinite(state.turn) ? state.turn : null, ply });
}

function observation(state, ply) {
  Raw.assertStudyState(state);
  const rawState = Raw.rawRuleState(state);
  const legalMoveCount = state.winner === null ? P.exactLegalMoves(state).length : 0;
  return {
    ply,
    phase: state.phase,
    player: state.player,
    winner: state.winner,
    turn: Number.isFinite(state.turn) ? state.turn : ply,
    reason: state.reason || "",
    rawState,
    rawStateKey: Raw.stateKey(state),
    historicalStateHash: historicalStateHash(state, ply),
    legalMoveCount,
  };
}

function fullStateFromObservation(row) {
  Raw.assertStudyState(row.rawState);
  return { ...clone(row.rawState), turn: row.turn, reason: row.reason || "" };
}

function assignedPhase(trajectoryHash, spec) {
  const digest = sha256(`${spec.rootSelection.phaseAssignment.salt}|${trajectoryHash}`);
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0 ? "namua" : "mtaji";
}

function stateSelectionRank(trajectoryHash, row, spec) {
  return sha256([spec.rootSelection.withinAssignedPhase.salt, trajectoryHash, row.rawStateKey, row.ply].join("|"));
}

function quotaRank(candidate, spec) {
  return sha256([spec.rootSelection.phaseQuota.salt, candidate.assignedPhase, candidate.historicalTrajectoryHash, candidate.rawStateKey, candidate.seed].join("|"));
}

function runGame(spec, gameIndex) {
  const seed = spec.population.seedStart + gameIndex;
  const rng = P.seededRandom(seed);
  const condition = conditionForGame(spec, gameIndex);
  let state = E.initialState();
  Raw.assertStudyState(state);
  const rows = [];
  const moveKeys = [];

  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    rows.push(observation(state, ply));
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = P.exactLegalMoves(state);
      move = legal[Math.floor(rng() * legal.length)];
    } else {
      move = generatorMove(state, condition, rng);
    }
    moveKeys.push(Raw.moveKey(move));
    state = E.applyMove(state, move).state;
    Raw.assertStudyState(state);
  }

  const ruleKeys = rows.map((row) => row.rawStateKey);
  const historicalStateHashes = rows.map((row) => row.historicalStateHash);
  const historicalTrajectoryHash = canonicalHash({ historicalStateHashes, moveKeys, length: rows.length });
  const ruleTrajectoryHash = canonicalHash({ ruleKeys, moveKeys, length: rows.length });
  const prefixMoveKeys = moveKeys.slice(0, spec.openingFamily.prefixPlies);
  const openingPrefixHash = canonicalHash({ length: prefixMoveKeys.length, moveKeys: prefixMoveKeys });
  const phase = assignedPhase(historicalTrajectoryHash, spec);
  const baseEligible = rows.filter((row) => row.winner === null
    && row.ply >= spec.rootSelection.minimumPly
    && row.phase === phase
    && row.legalMoveCount >= spec.rootSelection.minimumLegalMoveCount)
    .map((row) => ({ row, rank: stateSelectionRank(historicalTrajectoryHash, row, spec) }))
    .sort((a, b) => a.rank.localeCompare(b.rank) || a.row.rawStateKey.localeCompare(b.row.rawStateKey));
  const preselected = baseEligible.length ? baseEligible[0] : null;

  return {
    gameSummary: {
      gameIndex, seed, conditionId: condition.id, plies: moveKeys.length,
      winner: state.winner, reason: state.reason || (moveKeys.length >= spec.population.maxPly ? "max-ply" : ""),
      historicalTrajectoryHash, ruleTrajectoryHash, openingPrefixHash,
      openingPrefixLength: prefixMoveKeys.length,
    },
    phaseCandidate: preselected ? {
      gameIndex, seed, conditionId: condition.id, historicalTrajectoryHash, ruleTrajectoryHash, openingPrefixHash,
      assignedPhase: phase, selectionRank: preselected.rank, ply: preselected.row.ply,
      rawStateKey: preselected.row.rawStateKey, historicalStateHash: preselected.row.historicalStateHash,
      state: fullStateFromObservation(preselected.row),
    } : null,
  };
}

function representativeGames(records) {
  const groups = new Map();
  for (const record of records) {
    const key = record.gameSummary.historicalTrajectoryHash;
    const list = groups.get(key) || [];
    list.push(record);
    groups.set(key, list);
  }
  return [...groups.values()].map((list) => list.slice().sort((a, b) => a.gameSummary.seed - b.gameSummary.seed || a.gameSummary.gameIndex - b.gameSummary.gameIndex)[0]);
}

function collapseRawStates(items) {
  const map = new Map();
  for (const item of items) {
    const current = map.get(item.rawStateKey);
    if (!current || item.historicalTrajectoryHash.localeCompare(current.historicalTrajectoryHash) < 0
      || (item.historicalTrajectoryHash === current.historicalTrajectoryHash && item.seed < current.seed)) {
      map.set(item.rawStateKey, item);
    }
  }
  return [...map.values()];
}

function selectRoots(records, spec) {
  const reps = representativeGames(records);
  const disadvantaged = [];
  let unavailableAssignedPhase = 0;
  let failedReferenceDisadvantage = 0;
  for (const record of reps) {
    const candidate = record.phaseCandidate;
    if (!candidate) { unavailableAssignedPhase += 1; continue; }
    Raw.assertStudyState(candidate.state);
    const reference = P.referenceSearch(candidate.state, spec.rootSelection.referenceDisadvantage.depth);
    if (!(reference.bestScore < 0)) { failedReferenceDisadvantage += 1; continue; }
    const item = { ...candidate, referenceDisadvantageBestScore: reference.bestScore, referenceDisadvantageTableHash: P.canonicalHash(reference) };
    item.quotaRank = quotaRank(item, spec);
    disadvantaged.push(item);
  }
  const dedup = collapseRawStates(disadvantaged);
  const poolCounts = {};
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    const pool = dedup.filter((item) => item.assignedPhase === phase)
      .sort((a, b) => a.quotaRank.localeCompare(b.quotaRank) || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
    poolCounts[phase] = pool.length;
    selected.push(...pool.slice(0, spec.rootSelection.phaseQuota[phase]));
  }
  selected.sort((a, b) => a.assignedPhase.localeCompare(b.assignedPhase) || a.quotaRank.localeCompare(b.quotaRank));
  const conditionCounts = {};
  for (const item of selected) conditionCounts[item.conditionId] = (conditionCounts[item.conditionId] || 0) + 1;
  const phaseCounts = Object.fromEntries(["namua","mtaji"].map((p) => [p, selected.filter((x) => x.assignedPhase === p).length]));
  const generatedDistinctOpeningPrefixes = new Set(records.map((r) => r.gameSummary.openingPrefixHash)).size;
  const selectedDistinctOpeningPrefixes = new Set(selected.map((r) => r.openingPrefixHash)).size;
  const maxStratumShare = selected.length ? Math.max(...Object.values(conditionCounts)) / selected.length : 1;
  const g = spec.readinessGates;
  const checks = {
    uniqueHistoricalTrajectories: reps.length >= g.minimumUniqueHistoricalTrajectories,
    generatedDistinctOpeningPrefixes: generatedDistinctOpeningPrefixes >= g.minimumGeneratedDistinctOpeningPrefixes,
    disadvantagedPoolNamua: (poolCounts.namua || 0) >= g.minimumDisadvantagedPoolBeforeQuotaNamua,
    disadvantagedPoolMtaji: (poolCounts.mtaji || 0) >= g.minimumDisadvantagedPoolBeforeQuotaMtaji,
    selectedUniqueRawStates: selected.length === g.requiredSelectedUniqueRawStates && new Set(selected.map((x) => x.rawStateKey)).size === selected.length,
    namuaSelectedRoots: phaseCounts.namua === g.requiredNamuaSelectedRoots,
    mtajiSelectedRoots: phaseCounts.mtaji === g.requiredMtajiSelectedRoots,
    selectedDistinctOpeningPrefixes: selectedDistinctOpeningPrefixes >= g.minimumSelectedDistinctOpeningPrefixes,
    minimumSelectedPerGenerationStratum: spec.population.conditionAssignment.strata.every((s) => (conditionCounts[s.id] || 0) >= g.minimumSelectedPerGenerationStratum),
    maximumSingleSelectedGenerationStratumShare: maxStratumShare <= g.maximumSingleSelectedGenerationStratumShare,
  };
  const selectionHash = canonicalHash(selected.map((x) => ({ historicalTrajectoryHash:x.historicalTrajectoryHash, rawStateKey:x.rawStateKey, ply:x.ply, phase:x.assignedPhase, conditionId:x.conditionId, openingPrefixHash:x.openingPrefixHash, selectionRank:x.selectionRank, quotaRank:x.quotaRank })));
  return {
    generatedGames: records.length,
    uniqueHistoricalTrajectories: reps.length,
    duplicateHistoricalTrajectoriesCollapsed: records.length - reps.length,
    unavailableAssignedPhase,
    failedReferenceDisadvantage,
    disadvantagedBeforeRawStateCollapse: disadvantaged.length,
    duplicateDisadvantagedRawStatesCollapsed: disadvantaged.length - dedup.length,
    disadvantagedPoolAfterRawStateCollapse: poolCounts,
    phaseCounts, conditionCounts, generatedDistinctOpeningPrefixes, selectedDistinctOpeningPrefixes,
    maximumSingleSelectedGenerationStratumShare: maxStratumShare,
    checks, passed: Object.values(checks).every(Boolean), selectionHash, selected,
  };
}

function rootMorphology(state) {
  Raw.assertStudyState(state);
  const actor = state.player;
  const front = state.pits[actor][E.FRONT];
  const all = [...state.pits[actor][0], ...state.pits[actor][1]];
  return {
    actorReserve: state.reserve[actor],
    actorHouseOwned: Boolean(state.houseOwned[actor]),
    actorReusablePits: all.filter((n) => n >= 2).length,
    actorFrontOccupied: front.filter((n) => n > 0).length,
  };
}

module.exports = {
  assignedPhase,
  canonicalHash,
  clone,
  conditionForGame,
  fullStateFromObservation,
  historicalStateHash,
  representativeGames,
  rootMorphology,
  runGame,
  selectRoots,
  sha256,
};
