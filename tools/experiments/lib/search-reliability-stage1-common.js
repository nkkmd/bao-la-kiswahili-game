"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const Search = require("./search-reliability-decision-robustness.js");

const SCHEMA_VERSION = 1;

function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256(value) {
  const input = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
  return crypto.createHash("sha256").update(input).digest("hex");
}

function rawStateObject(state) {
  return {
    pits: cloneJson(state.pits),
    reserve: cloneJson(state.reserve),
    houseOwned: cloneJson(state.houseOwned),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: cloneJson(state.pending),
  };
}

function rawStateKey(state) { return stableStringify(rawStateObject(state)); }

function exactLegalMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function continuationMove(state) {
  const result = AI.analyzeMove(state, "hard", () => 0, {
    searchProfile: "phase2",
    evaluationProfile: "bao",
    maxDepth: 2,
    timeLimitMs: Infinity,
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
    adaptive: false,
    stableBestDepths: 0,
    aspirationWindow: 0,
  });
  if (!result.move || result.stats.timedOut || result.stats.completedDepth !== 2) {
    throw new Error("Frozen Stage 1 trajectory continuation did not complete D2");
  }
  return result.move;
}

function generateTrajectory(seed, spec) {
  const random = seededRandom(seed);
  let state = E.initialState();
  const moves = [];
  const observations = [{
    ply: 0,
    state: cloneJson(state),
    rawStateKey: rawStateKey(state),
    phase: state.phase,
    terminal: state.winner !== null,
    legalMoveCount: state.winner === null ? E.moveVariants(state).length : 0,
  }];
  for (let ply = 0; ply < spec.population.maxPly && state.winner === null; ply += 1) {
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      if (!legal.length) throw new Error(`No legal opening move at seed=${seed}, ply=${ply}`);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      move = continuationMove(state);
    }
    const applied = E.applyMove(state, move);
    state = applied.state;
    const key = rawStateKey(state);
    moves.push({ moveKey: AI.moveKey(move), afterRawStateKey: key });
    observations.push({
      ply: ply + 1,
      state: cloneJson(state),
      rawStateKey: key,
      phase: state.phase,
      terminal: state.winner !== null,
      legalMoveCount: state.winner === null ? E.moveVariants(state).length : 0,
    });
  }
  const historicalTrajectoryHash = sha256(stableStringify(moves));
  const openingPrefixHash = sha256(stableStringify(moves.slice(0, spec.population.opening.plies).map((x) => x.moveKey)));
  return {
    seed,
    gameId: `SRDR-S1-G${seed}`,
    historicalTrajectoryHash,
    openingPrefixHash,
    moves,
    observations,
    terminal: state.winner !== null,
    terminalPly: moves.length,
  };
}

function phaseAssignment(trajectory, spec) {
  const digest = sha256(`${spec.stateSelection.phaseAssignment.salt}|${trajectory.historicalTrajectoryHash}`);
  return Number.parseInt(digest.slice(0, 8), 16) % 2 === 0 ? "namua" : "mtaji";
}

function selectionRank(trajectory, observation, spec) {
  return sha256([
    spec.stateSelection.withinAssignedPhase.salt,
    trajectory.historicalTrajectoryHash,
    observation.rawStateKey,
    observation.ply,
  ].join("|"));
}

function collapseTrajectories(trajectories) {
  const map = new Map();
  for (const trajectory of trajectories) {
    const current = map.get(trajectory.historicalTrajectoryHash);
    if (!current || trajectory.seed < current.seed || (trajectory.seed === current.seed && trajectory.gameId < current.gameId)) {
      map.set(trajectory.historicalTrajectoryHash, trajectory);
    }
  }
  return [...map.values()].sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId));
}

function selectStates(trajectories, spec) {
  const representatives = collapseTrajectories(trajectories);
  const preliminary = [];
  let unavailableAssignedPhase = 0;
  for (const trajectory of representatives) {
    const assignedPhase = phaseAssignment(trajectory, spec);
    const candidates = trajectory.observations.filter((observation) =>
      observation.ply >= spec.stateSelection.minimumPly
      && !observation.terminal
      && observation.phase === assignedPhase
      && observation.legalMoveCount >= spec.stateSelection.minimumLegalMoveVariants);
    if (!candidates.length) {
      unavailableAssignedPhase += 1;
      continue;
    }
    const ranked = candidates.map((observation) => ({
      observation,
      rank: selectionRank(trajectory, observation, spec),
    })).sort((a, b) => a.rank.localeCompare(b.rank)
      || a.observation.rawStateKey.localeCompare(b.observation.rawStateKey)
      || a.observation.ply - b.observation.ply);
    const chosen = ranked[0];
    preliminary.push({
      seed: trajectory.seed,
      gameId: trajectory.gameId,
      historicalTrajectoryHash: trajectory.historicalTrajectoryHash,
      openingPrefixHash: trajectory.openingPrefixHash,
      assignedPhase,
      selectionRank: chosen.rank,
      ply: chosen.observation.ply,
      phase: chosen.observation.phase,
      rawStateKey: chosen.observation.rawStateKey,
      legalMoveCount: chosen.observation.legalMoveCount,
      state: cloneJson(chosen.observation.state),
    });
  }
  const byRaw = new Map();
  for (const row of preliminary) {
    const current = byRaw.get(row.rawStateKey);
    const better = !current
      || row.selectionRank < current.selectionRank
      || (row.selectionRank === current.selectionRank && row.historicalTrajectoryHash < current.historicalTrajectoryHash)
      || (row.selectionRank === current.selectionRank && row.historicalTrajectoryHash === current.historicalTrajectoryHash && row.seed < current.seed);
    if (better) byRaw.set(row.rawStateKey, row);
  }
  const selected = [...byRaw.values()].sort((a, b) => a.selectionRank.localeCompare(b.selectionRank)
    || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const selectionCore = selected.map(({ state, ...row }) => ({ ...row, state: rawStateObject(state) }));
  return {
    representatives,
    preliminary,
    selected,
    audit: {
      generatedTrajectories: trajectories.length,
      uniqueHistoricalTrajectories: representatives.length,
      duplicateHistoricalTrajectoriesCollapsed: trajectories.length - representatives.length,
      distinctOpeningPrefixes: new Set(representatives.map((x) => x.openingPrefixHash)).size,
      unavailableAssignedPhase,
      preliminarySelectedStates: preliminary.length,
      duplicateSelectedRawStatesCollapsed: preliminary.length - selected.length,
      selectedUniqueRawStates: selected.length,
      phaseCounts: {
        namua: selected.filter((x) => x.phase === "namua").length,
        mtaji: selected.filter((x) => x.phase === "mtaji").length,
      },
    },
    selectionHash: sha256(stableStringify(selectionCore)),
  };
}

function compactSearchResult(condition) {
  if (!condition.estimable) {
    return {
      estimable: false,
      kind: condition.kind,
      completedDepth: condition.completedDepth,
      attemptedDepth: condition.attemptedDepth,
      nodeBudget: condition.nodeBudget,
      nodeBudgetUsed: condition.nodeBudgetUsed,
      remainingNodeBudget: condition.remainingNodeBudget,
      result: null,
      principalVariation: null,
    };
  }
  const r = condition.result;
  return {
    estimable: true,
    kind: condition.kind,
    completedDepth: condition.completedDepth,
    attemptedDepth: condition.attemptedDepth,
    nodeBudget: condition.nodeBudget,
    nodeBudgetUsed: condition.nodeBudgetUsed,
    remainingNodeBudget: condition.remainingNodeBudget,
    result: {
      depth: r.depth,
      legalMoveCount: r.legalMoveCount,
      bestScore: r.bestScore,
      secondBestScore: r.secondBestScore,
      bestSecondGap: r.bestSecondGap,
      topSetMoveKeys: r.topSetMoveKeys,
      topSetSize: r.topSetSize,
      canonicalBestMoveKey: r.canonicalBestMoveKey,
      aggregateCounters: r.aggregateCounters,
      candidates: r.candidates.map((candidate) => ({
        moveKey: candidate.moveKey,
        score: candidate.score,
        scoreClass: candidate.scoreClass,
        ordinal: candidate.ordinal,
        scoreRank: candidate.scoreRank,
        isTopSet: candidate.isTopSet,
      })),
    },
    principalVariation: condition.principalVariation ? {
      semantics: condition.principalVariation.semantics,
      moveKeys: condition.principalVariation.moveKeys,
      nominalPlyLength: condition.principalVariation.nominalPlyLength,
      score: condition.principalVariation.score,
    } : null,
  };
}

function measureState(selectedRow, spec) {
  const common = spec.searchGrid.common;
  const conditions = {};
  for (const configured of spec.searchGrid.conditions) {
    const options = {
      evaluationProfile: common.evaluationProfile,
      quiescenceDepth: configured.quiescenceDepth,
      orderQuiescenceCaptures: common.orderQuiescenceCaptures,
      legalMoveOrdering: common.legalMoveOrdering,
    };
    const observed = configured.kind === "exact-depth"
      ? Search.analyzeExactCondition(selectedRow.state, configured.depth, options)
      : Search.analyzeBudgetCondition(selectedRow.state, configured.nodeBudget, configured.maxDepth, options);
    conditions[configured.id] = compactSearchResult(observed);
  }
  return {
    seed: selectedRow.seed,
    gameId: selectedRow.gameId,
    historicalTrajectoryHash: selectedRow.historicalTrajectoryHash,
    openingPrefixHash: selectedRow.openingPrefixHash,
    selectionRank: selectedRow.selectionRank,
    ply: selectedRow.ply,
    phase: selectedRow.phase,
    rawStateKey: selectedRow.rawStateKey,
    legalMoveCount: selectedRow.legalMoveCount,
    conditions,
  };
}

function sign(value) { return value > 0 ? 1 : value < 0 ? -1 : 0; }

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  const union = new Set([...A, ...B]);
  if (!union.size) return null;
  let intersection = 0;
  for (const key of A) if (B.has(key)) intersection += 1;
  return intersection / union.size;
}

function averageScoreRanks(candidates) {
  const byScore = new Map();
  for (const candidate of candidates) {
    if (!byScore.has(candidate.score)) byScore.set(candidate.score, []);
    byScore.get(candidate.score).push(candidate.moveKey);
  }
  const scores = [...byScore.keys()].sort((a, b) => b - a);
  const ranks = new Map();
  let ordinal = 1;
  for (const score of scores) {
    const keys = byScore.get(score);
    const average = (ordinal + (ordinal + keys.length - 1)) / 2;
    for (const key of keys) ranks.set(key, average);
    ordinal += keys.length;
  }
  return ranks;
}

function pearson(xs, ys) {
  if (xs.length !== ys.length || xs.length < 2) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i += 1) {
    const ax = xs[i] - mx;
    const ay = ys[i] - my;
    num += ax * ay;
    dx += ax * ax;
    dy += ay * ay;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

function spearman(aCandidates, bCandidates) {
  const aRanks = averageScoreRanks(aCandidates);
  const bRanks = averageScoreRanks(bCandidates);
  const keys = [...aRanks.keys()].sort();
  return pearson(keys.map((k) => aRanks.get(k)), keys.map((k) => bRanks.get(k)));
}

function kendallTauB(aCandidates, bCandidates) {
  const a = new Map(aCandidates.map((x) => [x.moveKey, x.score]));
  const b = new Map(bCandidates.map((x) => [x.moveKey, x.score]));
  const keys = [...a.keys()].sort();
  let concordant = 0;
  let discordant = 0;
  let tieA = 0;
  let tieB = 0;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      const sa = sign(a.get(keys[i]) - a.get(keys[j]));
      const sb = sign(b.get(keys[i]) - b.get(keys[j]));
      if (sa === 0 && sb === 0) continue;
      if (sa === 0) tieA += 1;
      else if (sb === 0) tieB += 1;
      else if (sa === sb) concordant += 1;
      else discordant += 1;
    }
  }
  const denominator = Math.sqrt((concordant + discordant + tieA) * (concordant + discordant + tieB));
  return denominator === 0 ? null : (concordant - discordant) / denominator;
}

function pairwiseOrderingAgreement(aCandidates, bCandidates) {
  const a = new Map(aCandidates.map((x) => [x.moveKey, x.score]));
  const b = new Map(bCandidates.map((x) => [x.moveKey, x.score]));
  const keys = [...a.keys()].sort();
  let matches = 0;
  let total = 0;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      total += 1;
      if (sign(a.get(keys[i]) - a.get(keys[j])) === sign(b.get(keys[i]) - b.get(keys[j]))) matches += 1;
    }
  }
  return total ? matches / total : null;
}

function pvComparison(aPv, bPv) {
  if (!aPv || !bPv) return {
    firstMoveAgreement: null,
    commonPrefixLength: null,
    normalizedCommonPrefix: null,
    divergencePly: null,
  };
  const a = aPv.moveKeys;
  const b = bPv.moveKeys;
  const minLength = Math.min(a.length, b.length);
  let common = 0;
  while (common < minLength && a[common] === b[common]) common += 1;
  let divergencePly = null;
  if (common < minLength) divergencePly = common + 1;
  else if (a.length !== b.length) divergencePly = minLength + 1;
  return {
    firstMoveAgreement: a.length && b.length ? (a[0] === b[0] ? 1 : 0) : null,
    commonPrefixLength: common,
    normalizedCommonPrefix: minLength ? common / minLength : null,
    divergencePly,
  };
}

function compareConditions(aCondition, bCondition) {
  if (!aCondition || !bCondition || !aCondition.estimable || !bCondition.estimable) return { defined: false };
  const a = aCondition.result;
  const b = bCondition.result;
  const aKeys = a.candidates.map((x) => x.moveKey).sort();
  const bKeys = b.candidates.map((x) => x.moveKey).sort();
  if (stableStringify(aKeys) !== stableStringify(bKeys)) throw new Error("Legal move identity mismatch across search conditions");
  const topK = (r) => r.candidates.slice(0, Math.min(3, r.candidates.length)).map((x) => x.moveKey);
  const pv = pvComparison(aCondition.principalVariation, bCondition.principalVariation);
  return {
    defined: true,
    canonicalBestAgreement: a.canonicalBestMoveKey === b.canonicalBestMoveKey ? 1 : 0,
    topSetJaccard: jaccard(a.topSetMoveKeys, b.topSetMoveKeys),
    referenceBestIncludedInComparisonTopSet: a.topSetMoveKeys.includes(b.canonicalBestMoveKey) ? 1 : 0,
    top3Jaccard: jaccard(topK(a), topK(b)),
    spearman: spearman(a.candidates, b.candidates),
    kendallTauB: kendallTauB(a.candidates, b.candidates),
    pairwiseOrderingAgreement: pairwiseOrderingAgreement(a.candidates, b.candidates),
    bestScoreSignAgreement: sign(a.bestScore) === sign(b.bestScore) ? 1 : 0,
    bestScoreDeltaComparisonMinusReference: a.bestScore - b.bestScore,
    bestScoreAbsoluteDelta: Math.abs(a.bestScore - b.bestScore),
    comparisonBestSecondGap: a.bestSecondGap,
    referenceBestSecondGap: b.bestSecondGap,
    gapAbsoluteDelta: a.bestSecondGap === null || b.bestSecondGap === null ? null : Math.abs(a.bestSecondGap - b.bestSecondGap),
    comparisonTopSetSize: a.topSetSize,
    referenceTopSetSize: b.topSetSize,
    pvFirstMoveAgreement: pv.firstMoveAgreement,
    pvCommonPrefixLength: pv.commonPrefixLength,
    pvNormalizedCommonPrefix: pv.normalizedCommonPrefix,
    pvDivergencePly: pv.divergencePly,
  };
}

function measurementCore(rows) {
  return rows.map((row) => ({
    historicalTrajectoryHash: row.historicalTrajectoryHash,
    rawStateKey: row.rawStateKey,
    phase: row.phase,
    conditions: row.conditions,
  }));
}

module.exports = {
  SCHEMA_VERSION,
  Search,
  cloneJson,
  stableStringify,
  sha256,
  rawStateObject,
  rawStateKey,
  exactLegalMoves,
  generateTrajectory,
  collapseTrajectories,
  selectStates,
  measureState,
  compareConditions,
  measurementCore,
  sign,
};
