"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const I = require("./rcpr-independent.js");

const STAGE1_POLICY_ID = "RCPR-P1-NORMAL-TOP3-v1";

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
}

function validateStateLight(state) {
  ensure(state && typeof state === "object", "state must be object");
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "invalid pits");
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2, "invalid reserve");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2, "invalid houseOwned");
  ensure(state.player === 0 || state.player === 1, "invalid player");
  ensure(state.phase === "namua" || state.phase === "mtaji", "invalid phase");
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "invalid pending");
  return true;
}

function independentLegal(state) {
  validateStateLight(state);
  ensure(state.winner === null, "expected nonterminal state");
  return E.moveVariants(state).slice().sort((a, b) => I.independentMoveKey(a).localeCompare(I.independentMoveKey(b)));
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(String(text), "utf8").digest("hex");
}

function canonicalHash(value) {
  return sha256Text(canonicalJson(value));
}

function first32(hash) {
  return Number.parseInt(hash.slice(0, 8), 16) >>> 0;
}

function exactMove(state, move) {
  const key = I.independentMoveKey(move);
  const matched = independentLegal(state).find((candidate) => I.independentMoveKey(candidate) === key);
  ensure(matched, `move is not an exact legal variant: ${key}`);
  return matched;
}

function conditionForGame(spec, gameIndex) {
  const strata = spec.sourcePopulation.conditionAssignment.strata;
  ensure(Array.isArray(strata) && strata.length > 0, "missing generation strata");
  return strata[gameIndex % strata.length];
}

function generatorMove(state, condition, rng, commonOptions) {
  const g = condition.generator;
  const analysis = AI.analyzeMove(state, g.level, rng, {
    evaluationProfile: g.evaluationProfile,
    searchProfile: g.searchProfile,
    maxDepth: g.maxDepth,
    timeLimitMs: commonOptions.timeLimitMs === "Infinity" ? Infinity : commonOptions.timeLimitMs,
    quiescenceDepth: g.quiescenceDepth,
    orderQuiescenceCaptures: g.orderQuiescenceCaptures,
    adaptive: commonOptions.adaptive,
    stableBestDepths: commonOptions.stableBestDepths,
    aspirationWindow: commonOptions.aspirationWindow,
  });
  ensure(analysis && analysis.move, `generator produced no move for ${condition.id}`);
  if (Number.isInteger(g.maxDepth) && analysis.stats) {
    ensure(analysis.stats.timedOut !== true, `generator timed out for ${condition.id}`);
    ensure(analysis.stats.completedDepth === g.maxDepth, `generator depth mismatch for ${condition.id}: ${analysis.stats.completedDepth}/${g.maxDepth}`);
  }
  return exactMove(state, analysis.move);
}

function assignedPhase(seed, spec) {
  const cfg = spec.rootSelection.phaseAssignment;
  const parity = first32(sha256Text(`${cfg.salt}|${seed}`)) % 2;
  return parity === 0 ? cfg.mapping.even : cfg.mapping.odd;
}

function rootRank(seed, rawStateKey, ply, spec) {
  const cfg = spec.rootSelection.withinAssignedPhase;
  return sha256Text(`${cfg.salt}|${seed}|${rawStateKey}|${ply}`);
}

function quotaRank(candidate, spec) {
  const cfg = spec.rootSelection.phaseQuota;
  return sha256Text(`${cfg.salt}|${candidate.phase}|${candidate.historicalTrajectoryHash}|${candidate.rawStateKey}|${candidate.seed}`);
}

function historyWindowHash(history) {
  return canonicalHash(history.map((record) => ({
    rawStateKey: I.independentRawKey(record.state),
    moveKey: I.independentMoveKey(record.move),
  })));
}

function runGame(spec, gameIndex) {
  ensure(Number.isInteger(gameIndex) && gameIndex >= 0, "invalid gameIndex");
  const seed = spec.sourcePopulation.seedStart + gameIndex;
  ensure(seed <= spec.sourcePopulation.seedEnd, `seed exceeds frozen block: ${seed}`);
  const rng = seededRandom(seed >>> 0);
  const condition = conditionForGame(spec, gameIndex);
  const openingPlies = spec.sourcePopulation.opening.plies;
  const historyNeed = spec.rootSelection.minimumPreRootHistoryMoves;
  const assigned = assignedPhase(seed, spec);
  let state = E.initialState();
  validateStateLight(state);
  const rawStateKeys = [];
  const openingMoveKeys = [];
  const history = [];
  let bestCandidate = null;
  let finalPly = 0;

  for (let ply = 0; ply <= spec.sourcePopulation.maxPly; ply += 1) {
    finalPly = ply;
    validateStateLight(state);
    const rawStateKey = I.independentRawKey(state);
    rawStateKeys.push(rawStateKey);
    const legal = state.winner === null ? independentLegal(state) : [];
    const eligible = state.winner === null
      && ply >= spec.rootSelection.minimumPly
      && legal.length >= spec.rootSelection.minimumLegalMoveCount
      && history.length >= historyNeed
      && state.phase === assigned;
    if (eligible) {
      const rank = rootRank(seed, rawStateKey, ply, spec);
      if (!bestCandidate || rank.localeCompare(bestCandidate.selectionRank) < 0
        || (rank === bestCandidate.selectionRank && rawStateKey.localeCompare(bestCandidate.rawStateKey) < 0)) {
        const preRootHistory = history.slice(-historyNeed).map(clone);
        I.independentHistoryCheck(state, preRootHistory);
        bestCandidate = {
          gameIndex,
          seed,
          generationStratum: condition.id,
          phase: assigned,
          ply,
          legalMoveCount: legal.length,
          rawStateKey,
          selectionRank: rank,
          root: clone(state),
          preRootHistory,
          historyWindowHash: historyWindowHash(preRootHistory),
        };
      }
    }

    if (state.winner !== null || ply === spec.sourcePopulation.maxPly) break;
    let move;
    if (ply < openingPlies) {
      ensure(legal.length > 0, "opening state has no legal moves");
      move = legal[Math.floor(rng() * legal.length)];
      openingMoveKeys.push(I.independentMoveKey(move));
    } else {
      move = generatorMove(state, condition, rng, spec.sourcePopulation.conditionAssignment.commonGeneratorOptions);
    }
    history.push({ state: clone(state), move: clone(move) });
    if (history.length > historyNeed) history.shift();
    state = E.applyMove(state, move).state;
  }

  const historicalTrajectoryHash = canonicalHash({ length: rawStateKeys.length, rawStateKeys });
  const openingPrefixHash = canonicalHash({ length: openingMoveKeys.length, moveKeys: openingMoveKeys });
  if (bestCandidate) {
    bestCandidate.historicalTrajectoryHash = historicalTrajectoryHash;
    bestCandidate.openingPrefixHash = openingPrefixHash;
    bestCandidate.representationRowIdentity = canonicalHash({
      historicalTrajectoryHash,
      rawStateKey: bestCandidate.rawStateKey,
      ply: bestCandidate.ply,
      historyWindowHash: bestCandidate.historyWindowHash,
    });
  }
  return {
    gameSummary: {
      gameIndex,
      seed,
      generationStratum: condition.id,
      assignedPhase: assigned,
      observedStates: rawStateKeys.length,
      finalPly,
      terminal: state.winner !== null,
      winner: state.winner,
      historicalTrajectoryHash,
      openingPrefixHash,
      openingPrefixLength: openingMoveKeys.length,
    },
    candidate: bestCandidate,
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

function collapseSelectedRawStates(items) {
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
  const candidates = reps.filter((record) => record.candidate).map((record) => ({ ...record.candidate }));
  const dedup = collapseSelectedRawStates(candidates);
  for (const item of dedup) item.quotaRank = quotaRank(item, spec);
  const selected = [];
  const poolCounts = {};
  for (const phase of ["namua", "mtaji"]) {
    const pool = dedup.filter((item) => item.phase === phase)
      .sort((a, b) => a.quotaRank.localeCompare(b.quotaRank)
        || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash)
        || a.rawStateKey.localeCompare(b.rawStateKey)
        || a.seed - b.seed);
    poolCounts[phase] = pool.length;
    selected.push(...pool.slice(0, spec.rootSelection.phaseQuota[phase]));
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.quotaRank.localeCompare(b.quotaRank));
  const conditionCounts = {};
  for (const item of selected) conditionCounts[item.generationStratum] = (conditionCounts[item.generationStratum] || 0) + 1;
  const phaseCounts = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, selected.filter((item) => item.phase === phase).length]));
  const generatedDistinctOpeningPrefixes = new Set(records.map((record) => record.gameSummary.openingPrefixHash)).size;
  const selectedDistinctOpeningPrefixes = new Set(selected.map((item) => item.openingPrefixHash)).size;
  const maxStratumShare = selected.length ? Math.max(0, ...Object.values(conditionCounts)) / selected.length : 1;
  const g = spec.readinessGates;
  const selectionChecks = {
    minimumUniqueHistoricalTrajectories: reps.length >= g.minimumUniqueHistoricalTrajectories,
    minimumDistinctOpeningPrefixesGenerated: generatedDistinctOpeningPrefixes >= g.minimumDistinctOpeningPrefixesGenerated,
    requiredSelectedRawStates: selected.length === g.requiredSelectedRawStates && new Set(selected.map((item) => item.rawStateKey)).size === selected.length,
    requiredNamuaRoots: phaseCounts.namua === g.requiredNamuaRoots,
    requiredMtajiRoots: phaseCounts.mtaji === g.requiredMtajiRoots,
    minimumSelectedDistinctOpeningPrefixes: selectedDistinctOpeningPrefixes >= g.minimumSelectedDistinctOpeningPrefixes,
    minimumSelectedPerGenerationStratum: spec.sourcePopulation.conditionAssignment.strata.every((stratum) => (conditionCounts[stratum.id] || 0) >= g.minimumSelectedPerGenerationStratum),
    maximumSingleGenerationStratumShare: maxStratumShare <= g.maximumSingleGenerationStratumShare,
  };
  const selectionHash = canonicalHash(selected.map((item) => ({
    historicalTrajectoryHash: item.historicalTrajectoryHash,
    openingPrefixHash: item.openingPrefixHash,
    historyWindowHash: item.historyWindowHash,
    representationRowIdentity: item.representationRowIdentity,
    rawStateKey: item.rawStateKey,
    phase: item.phase,
    ply: item.ply,
    seed: item.seed,
    generationStratum: item.generationStratum,
    selectionRank: item.selectionRank,
    quotaRank: item.quotaRank,
  })));
  return {
    generatedGames: records.length,
    uniqueHistoricalTrajectories: reps.length,
    duplicateHistoricalTrajectoriesCollapsed: records.length - reps.length,
    candidateCountBeforeRawCollapse: candidates.length,
    duplicateSelectedRawStatesCollapsed: candidates.length - dedup.length,
    poolCounts,
    phaseCounts,
    conditionCounts,
    generatedDistinctOpeningPrefixes,
    selectedDistinctOpeningPrefixes,
    maximumSingleGenerationStratumShare: maxStratumShare,
    selectionChecks,
    selectionPassed: Object.values(selectionChecks).every(Boolean),
    selectionHash,
    selected,
  };
}

function materializeRepresentations(selected, spec) {
  const expectedWidth = 310;
  const expectedSchema = spec.representation.stage0FeatureSchemaSha256;
  return selected.map((item) => {
    const representation = I.recomputeRepresentation(item.root, item.preRootHistory);
    ensure(representation.featureSchemaSha256 === expectedSchema, `feature schema drift at ${item.rawStateKey}`);
    const values = Object.values(representation.numericFeatures);
    ensure(values.length === expectedWidth, `feature width drift at ${item.rawStateKey}: ${values.length}`);
    ensure(values.every((value) => typeof value === "number" && Number.isFinite(value)), `non-finite Stage 1 feature at ${item.rawStateKey}`);
    return {
      ...item,
      representation,
      featureVectorSha256: canonicalHash(representation.numericFeatures),
    };
  });
}

function deriveReplicateSeed32(root, replicateIndex, spec) {
  ensure(Number.isInteger(replicateIndex) && replicateIndex >= 0, "invalid replicateIndex");
  const cfg = spec.criticalityMeasurement.replicateSeedDerivation;
  const material = `${cfg.salt}|${I.independentRawKey(root)}|${root.player}|${replicateIndex}`;
  return first32(sha256Text(material));
}

function continuationMove(state, rng) {
  const legal = independentLegal(state);
  ensure(legal.length > 0, "continuation state has no legal moves");
  const analysis = AI.analyzeMove(state, "normal", rng, { evaluationProfile: "bao" });
  ensure(analysis && analysis.move, "continuation policy produced no move");
  const key = I.independentMoveKey(analysis.move);
  const rebound = legal.find((candidate) => I.independentMoveKey(candidate) === key);
  ensure(rebound, `continuation policy selected non-exact move variant: ${key}`);
  return rebound;
}

function runContinuation(root, rootMove, replicateIndex, spec) {
  const rootActor = root.player;
  const seed32 = deriveReplicateSeed32(root, replicateIndex, spec);
  const rng = seededRandom(seed32);
  const move = exactMove(root, rootMove);
  const rootMoveKey = I.independentMoveKey(move);
  let state = E.applyMove(root, move).state;
  let continuationPlies = 0;
  while (state.winner === null && continuationPlies < spec.criticalityMeasurement.maximumPostRootContinuationPlies) {
    const selected = continuationMove(state, rng);
    state = E.applyMove(state, selected).state;
    continuationPlies += 1;
  }
  const outcome = state.winner === null ? "ADMINISTRATIVE_UNFINISHED" : (state.winner === rootActor ? "ROOT_ACTOR_WIN" : "ROOT_ACTOR_LOSS");
  const audit = {
    rootMoveKey,
    replicateIndex,
    seed32,
    outcome,
    continuationPlies,
    finalRawStateKey: I.independentRawKey(state),
  };
  return { ...audit, recordSha256: canonicalHash(audit) };
}

function measureRoot(item, spec, options = {}) {
  const replicates = options.replicates ?? spec.criticalityMeasurement.replicatesPerExactRootMove;
  const legal = independentLegal(item.root);
  const moves = legal.map((move) => {
    const records = Array.from({ length: replicates }, (_, replicateIndex) => runContinuation(item.root, move, replicateIndex, spec));
    const wins = records.filter((record) => record.outcome === "ROOT_ACTOR_WIN").length;
    const losses = records.filter((record) => record.outcome === "ROOT_ACTOR_LOSS").length;
    const unfinished = records.length - wins - losses;
    return {
      moveKey: I.independentMoveKey(move),
      wins,
      losses,
      unfinished,
      terminalReplicates: wins + losses,
      winRate: unfinished === 0 ? wins / replicates : null,
      replicateAggregateSha256: canonicalHash(records.map((record) => record.recordSha256)),
    };
  });
  const primaryEstimable = moves.every((move) => move.terminalReplicates === replicates);
  const winRates = primaryEstimable ? moves.map((move) => move.winRate) : [];
  const dRange = primaryEstimable ? Math.max(...winRates) - Math.min(...winRates) : null;
  const highDivergence = primaryEstimable ? dRange >= spec.criticalityMeasurement.highDivergenceThresholdInclusive : null;
  const core = {
    rawStateKey: item.rawStateKey,
    representationRowIdentity: item.representationRowIdentity,
    historicalTrajectoryHash: item.historicalTrajectoryHash,
    phase: item.phase,
    rootActor: item.root.player,
    legalMoveCount: moves.length,
    replicatesPerMove: replicates,
    primaryEstimable,
    dRange,
    highDivergence,
    moves,
  };
  return { ...core, measurementSha256: canonicalHash(core) };
}

module.exports = {
  STAGE1_POLICY_ID, assignedPhase, canonicalHash, conditionForGame, deriveReplicateSeed32, historyWindowHash,
  materializeRepresentations, measureRoot, quotaRank, representativeGames, rootRank, runContinuation, runGame, selectRoots, sha256Text,
};