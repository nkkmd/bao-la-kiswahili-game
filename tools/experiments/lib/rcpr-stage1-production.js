"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const R = require("./rcpr-production.js");

const STAGE1_POLICY_ID = "RCPR-P1-NORMAL-TOP3-v1";

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
  return sha256Text(R.stableStringify(value));
}

function first32(hash) {
  return Number.parseInt(hash.slice(0, 8), 16) >>> 0;
}

function exactMove(state, move) {
  const key = R.moveKey(move);
  const matched = R.exactLegalMoves(state).find((candidate) => R.moveKey(candidate) === key);
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
    rawStateKey: R.rawStateKey(record.state),
    moveKey: R.moveKey(record.move),
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
  R.assertStateShape(state);
  const rawStateKeys = [];
  const openingMoveKeys = [];
  const history = [];
  let bestCandidate = null;
  let finalPly = 0;

  for (let ply = 0; ply <= spec.sourcePopulation.maxPly; ply += 1) {
    finalPly = ply;
    R.assertStateShape(state);
    const rawStateKey = R.rawStateKey(state);
    rawStateKeys.push(rawStateKey);
    const legal = state.winner === null ? R.exactLegalMoves(state) : [];
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
        R.validatePreRootHistory(state, preRootHistory);
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
      openingMoveKeys.push(R.moveKey(move));
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
    const representation = R.extractRepresentation(item.root, item.preRootHistory);
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
  const material = `${cfg.salt}|${R.rawStateKey(root)}|${root.player}|${replicateIndex}`;
  return first32(sha256Text(material));
}

function continuationMove(state, rng) {
  const legal = R.exactLegalMoves(state);
  ensure(legal.length > 0, "continuation state has no legal moves");
  const analysis = AI.analyzeMove(state, "normal", rng, { evaluationProfile: "bao" });
  ensure(analysis && analysis.move, "continuation policy produced no move");
  const key = R.moveKey(analysis.move);
  const rebound = legal.find((candidate) => R.moveKey(candidate) === key);
  ensure(rebound, `continuation policy selected non-exact move variant: ${key}`);
  return rebound;
}

function runContinuation(root, rootMove, replicateIndex, spec) {
  const rootActor = root.player;
  const seed32 = deriveReplicateSeed32(root, replicateIndex, spec);
  const rng = seededRandom(seed32);
  const move = exactMove(root, rootMove);
  const rootMoveKey = R.moveKey(move);
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
    finalRawStateKey: R.rawStateKey(state),
  };
  return { ...audit, recordSha256: canonicalHash(audit) };
}

function measureRoot(item, spec, options = {}) {
  const replicates = options.replicates ?? spec.criticalityMeasurement.replicatesPerExactRootMove;
  const legal = R.exactLegalMoves(item.root);
  const moves = legal.map((move) => {
    const records = Array.from({ length: replicates }, (_, replicateIndex) => runContinuation(item.root, move, replicateIndex, spec));
    const wins = records.filter((record) => record.outcome === "ROOT_ACTOR_WIN").length;
    const losses = records.filter((record) => record.outcome === "ROOT_ACTOR_LOSS").length;
    const unfinished = records.length - wins - losses;
    return {
      moveKey: R.moveKey(move),
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

function foldForTrajectory(trajectoryHash, spec) {
  const cfg = spec.developmentModel.crossValidation;
  return first32(sha256Text(`${cfg.salt}|${trajectoryHash}`)) % cfg.folds;
}

function featureNamesForFamilies(example, families) {
  const prefixes = new Set(families.map((family) => `${family}.`));
  return example.representation.featureNames.filter((name) => [...prefixes].some((prefix) => name.startsWith(prefix)));
}

function classStats(rows, featureNames, positive, varianceFloor) {
  const subset = rows.filter((row) => row.highDivergence === positive);
  ensure(subset.length > 0, `empty ${positive ? "positive" : "negative"} training class`);
  const stats = {};
  for (const name of featureNames) {
    const values = subset.map((row) => row.representation.numericFeatures[name]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((total, value) => total + ((value - mean) ** 2), 0) / values.length;
    stats[name] = { mean, variance: Math.max(variance, varianceFloor) };
  }
  return { count: subset.length, stats };
}

function fitDiagonalLda(rows, featureNames, spec) {
  ensure(rows.length > 1, "insufficient training rows");
  const floor = spec.developmentModel.varianceFloor;
  const pos = classStats(rows, featureNames, true, floor);
  const neg = classStats(rows, featureNames, false, floor);
  const coefficients = {};
  const midpoints = {};
  for (const name of featureNames) {
    const pooledVariance = Math.max((pos.stats[name].variance + neg.stats[name].variance) / 2, floor);
    coefficients[name] = (pos.stats[name].mean - neg.stats[name].mean) / pooledVariance;
    midpoints[name] = (pos.stats[name].mean + neg.stats[name].mean) / 2;
  }
  return {
    featureNames: featureNames.slice(),
    coefficients,
    midpoints,
    priorTerm: Math.log(pos.count / neg.count),
    activeFeatureCount: featureNames.length,
    positiveTrainingRows: pos.count,
    negativeTrainingRows: neg.count,
  };
}

function scoreDiagonalLda(row, fit) {
  let contribution = 0;
  for (const name of fit.featureNames) contribution += fit.coefficients[name] * (row.representation.numericFeatures[name] - fit.midpoints[name]);
  return contribution / Math.sqrt(fit.activeFeatureCount) + fit.priorTerm;
}

function tieAwareAuc(rows) {
  const pos = rows.filter((row) => row.highDivergence === true);
  const neg = rows.filter((row) => row.highDivergence === false);
  if (!pos.length || !neg.length) return null;
  let wins = 0;
  for (const p of pos) {
    for (const n of neg) {
      if (p.score > n.score) wins += 1;
      else if (p.score === n.score) wins += 0.5;
    }
  }
  return wins / (pos.length * neg.length);
}

function confusionAtThreshold(rows, threshold) {
  let tp = 0; let tn = 0; let fp = 0; let fn = 0;
  for (const row of rows) {
    const predicted = row.score >= threshold;
    if (row.highDivergence && predicted) tp += 1;
    else if (row.highDivergence && !predicted) fn += 1;
    else if (!row.highDivergence && predicted) fp += 1;
    else tn += 1;
  }
  const sensitivity = tp + fn ? tp / (tp + fn) : null;
  const specificity = tn + fp ? tn / (tn + fp) : null;
  return {
    tp, tn, fp, fn,
    sensitivity,
    specificity,
    balancedAccuracy: sensitivity === null || specificity === null ? null : (sensitivity + specificity) / 2,
    youdenJ: sensitivity === null || specificity === null ? null : sensitivity + specificity - 1,
    predictedPositive: tp + fp,
    predictedPositiveFraction: rows.length ? (tp + fp) / rows.length : null,
  };
}

function evaluateFamilySet(rows, familySetId, families, spec) {
  ensure(rows.length > 0, "no estimable development rows");
  const featureNames = featureNamesForFamilies(rows[0], families);
  ensure(featureNames.length > 0, `empty family set: ${familySetId}`);
  const folds = spec.developmentModel.crossValidation.folds;
  const scored = [];
  const foldAuc = [];
  for (let fold = 0; fold < folds; fold += 1) {
    const training = rows.filter((row) => row.fold !== fold);
    const test = rows.filter((row) => row.fold === fold);
    if (!test.length || !training.some((row) => row.highDivergence) || !training.some((row) => !row.highDivergence)) {
      return { familySetId, families, featureNames, activeFeatureCount: featureNames.length, estimable: false, reason: `fold-${fold}-class-or-test-support` };
    }
    const fit = fitDiagonalLda(training, featureNames, spec);
    const testScored = test.map((row) => ({ ...row, score: scoreDiagonalLda(row, fit) }));
    scored.push(...testScored);
    foldAuc.push({ fold, auc: tieAwareAuc(testScored) });
  }
  scored.sort((a, b) => a.representationRowIdentity.localeCompare(b.representationRowIdentity));
  const overallAuc = tieAwareAuc(scored);
  const phaseAuc = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, tieAwareAuc(scored.filter((row) => row.phase === phase))]));
  return {
    familySetId,
    families: families.slice(),
    featureNames,
    activeFeatureCount: featureNames.length,
    estimable: overallAuc !== null && phaseAuc.namua !== null && phaseAuc.mtaji !== null && foldAuc.every((item) => item.auc !== null),
    overallAuc,
    phaseAuc,
    foldAuc,
    scored,
  };
}

function familySetComparator(a, b) {
  if (a.overallAuc !== b.overallAuc) return b.overallAuc - a.overallAuc;
  const amin = Math.min(a.phaseAuc.namua, a.phaseAuc.mtaji);
  const bmin = Math.min(b.phaseAuc.namua, b.phaseAuc.mtaji);
  if (amin !== bmin) return bmin - amin;
  if (a.activeFeatureCount !== b.activeFeatureCount) return a.activeFeatureCount - b.activeFeatureCount;
  return a.familySetId.localeCompare(b.familySetId);
}

function deriveOperatingThreshold(scored, spec) {
  const thresholds = [...new Set(scored.map((row) => row.score))].sort((a, b) => b - a);
  const candidates = [];
  for (const threshold of thresholds) {
    const metrics = confusionAtThreshold(scored, threshold);
    const phasePositive = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, scored.filter((row) => row.phase === phase && row.score >= threshold).length]));
    if (metrics.predictedPositiveFraction < 0.10 || metrics.predictedPositiveFraction > 0.50) continue;
    if (phasePositive.namua < 20 || phasePositive.mtaji < 20) continue;
    candidates.push({ threshold, ...metrics, phasePositive });
  }
  candidates.sort((a, b) => {
    if (a.youdenJ !== b.youdenJ) return b.youdenJ - a.youdenJ;
    if (a.balancedAccuracy !== b.balancedAccuracy) return b.balancedAccuracy - a.balancedAccuracy;
    if (a.predictedPositive !== b.predictedPositive) return b.predictedPositive - a.predictedPositive;
    return b.threshold - a.threshold;
  });
  return candidates[0] || null;
}

function developModel(rows, spec) {
  const estimable = rows.filter((row) => row.primaryEstimable).map((row) => ({
    ...row,
    fold: foldForTrajectory(row.historicalTrajectoryHash, spec),
  }));
  if (!estimable.some((row) => row.highDivergence) || !estimable.some((row) => !row.highDivergence)) {
    return { estimable: false, reason: "global-class-support" };
  }
  const evaluations = [];
  for (const [familySetId, families] of Object.entries(spec.developmentModel.candidateFamilySets)) {
    evaluations.push(evaluateFamilySet(estimable, familySetId, families, spec));
  }
  const valid = evaluations.filter((item) => item.estimable).sort(familySetComparator);
  if (!valid.length) return { estimable: false, reason: "no-estimable-family-set", evaluations };
  const selected = valid[0];
  let top3FoldStabilityCount = 0;
  for (let fold = 0; fold < spec.developmentModel.crossValidation.folds; fold += 1) {
    const ranked = valid.slice().sort((a, b) => {
      const aa = a.foldAuc.find((item) => item.fold === fold).auc;
      const bb = b.foldAuc.find((item) => item.fold === fold).auc;
      if (aa !== bb) return bb - aa;
      if (a.activeFeatureCount !== b.activeFeatureCount) return a.activeFeatureCount - b.activeFeatureCount;
      return a.familySetId.localeCompare(b.familySetId);
    });
    if (ranked.slice(0, 3).some((item) => item.familySetId === selected.familySetId)) top3FoldStabilityCount += 1;
  }
  const threshold = deriveOperatingThreshold(selected.scored, spec);
  const finalFit = fitDiagonalLda(estimable, selected.featureNames, spec);
  const compactEvaluations = evaluations.map((item) => ({
    familySetId: item.familySetId,
    families: item.families,
    activeFeatureCount: item.activeFeatureCount,
    estimable: item.estimable,
    reason: item.reason || null,
    overallAuc: item.overallAuc ?? null,
    phaseAuc: item.phaseAuc || null,
    foldAuc: item.foldAuc || null,
  }));
  const out = {
    estimable: true,
    selectedFamilySetId: selected.familySetId,
    selectedFamilies: selected.families,
    selectedFeatureNames: selected.featureNames,
    selectedActiveFeatureCount: selected.activeFeatureCount,
    overallAuc: selected.overallAuc,
    phaseAuc: selected.phaseAuc,
    foldAuc: selected.foldAuc,
    top3FoldStabilityCount,
    operatingThreshold: threshold,
    finalFit,
    evaluations: compactEvaluations,
  };
  out.modelDevelopmentSha256 = canonicalHash(out);
  return out;
}

function evaluateReadiness(selection, rows, model, spec) {
  const g = spec.readinessGates;
  const estimable = rows.filter((row) => row.primaryEstimable);
  const high = estimable.filter((row) => row.highDivergence === true);
  const low = estimable.filter((row) => row.highDivergence === false);
  const phaseCount = (items, phase) => items.filter((row) => row.phase === phase).length;
  const checks = {
    ...selection.selectionChecks,
    minimumPrimaryEstimableRoots: estimable.length >= g.minimumPrimaryEstimableRoots,
    minimumPrimaryEstimableNamuaRoots: phaseCount(estimable, "namua") >= g.minimumPrimaryEstimableNamuaRoots,
    minimumPrimaryEstimableMtajiRoots: phaseCount(estimable, "mtaji") >= g.minimumPrimaryEstimableMtajiRoots,
    minimumHighDivergenceRoots: high.length >= g.minimumHighDivergenceRoots,
    minimumLowDivergenceRoots: low.length >= g.minimumLowDivergenceRoots,
    minimumHighDivergencePerPhase: phaseCount(high, "namua") >= g.minimumHighDivergencePerPhase && phaseCount(high, "mtaji") >= g.minimumHighDivergencePerPhase,
    minimumLowDivergencePerPhase: phaseCount(low, "namua") >= g.minimumLowDivergencePerPhase && phaseCount(low, "mtaji") >= g.minimumLowDivergencePerPhase,
    selectedModelEstimable: model.estimable === true,
    minimumSelectedModelCvAuc: model.estimable && model.overallAuc >= g.minimumSelectedModelCvAuc,
    minimumSelectedModelEachPhaseCvAuc: model.estimable && model.phaseAuc.namua >= g.minimumSelectedModelEachPhaseCvAuc && model.phaseAuc.mtaji >= g.minimumSelectedModelEachPhaseCvAuc,
    minimumSelectedModelBalancedAccuracy: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.balancedAccuracy >= g.minimumSelectedModelBalancedAccuracy,
    minimumOperatingThresholdPositiveSupport: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.predictedPositive >= g.minimumOperatingThresholdPositiveSupport,
    minimumOperatingThresholdPositivePerPhase: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.phasePositive.namua >= g.minimumOperatingThresholdPositivePerPhase && model.operatingThreshold.phasePositive.mtaji >= g.minimumOperatingThresholdPositivePerPhase,
    minimumTop3FoldStabilityCount: model.estimable && model.top3FoldStabilityCount >= g.minimumTop3FoldStabilityCount,
  };
  const populationKeys = [
    "minimumUniqueHistoricalTrajectories", "minimumDistinctOpeningPrefixesGenerated", "requiredSelectedRawStates", "requiredNamuaRoots", "requiredMtajiRoots",
    "minimumSelectedDistinctOpeningPrefixes", "minimumSelectedPerGenerationStratum", "maximumSingleGenerationStratumShare",
    "minimumPrimaryEstimableRoots", "minimumPrimaryEstimableNamuaRoots", "minimumPrimaryEstimableMtajiRoots", "minimumHighDivergenceRoots", "minimumLowDivergenceRoots",
    "minimumHighDivergencePerPhase", "minimumLowDivergencePerPhase",
  ];
  const modelKeys = [
    "selectedModelEstimable", "minimumSelectedModelCvAuc", "minimumSelectedModelEachPhaseCvAuc", "minimumSelectedModelBalancedAccuracy",
    "minimumOperatingThresholdPositiveSupport", "minimumOperatingThresholdPositivePerPhase", "minimumTop3FoldStabilityCount",
  ];
  let productionDisposition;
  if (!populationKeys.every((key) => checks[key])) productionDisposition = spec.developmentDecision.populationOrClassSupportInsufficient;
  else if (!modelKeys.every((key) => checks[key])) productionDisposition = spec.developmentDecision.modelPerformanceOrStabilityBelowGate;
  else productionDisposition = "PASS-AWAITING-INDEPENDENT-VERIFICATION";
  return {
    counts: {
      primaryEstimable: estimable.length,
      highDivergence: high.length,
      lowDivergence: low.length,
      namuaEstimable: phaseCount(estimable, "namua"),
      mtajiEstimable: phaseCount(estimable, "mtaji"),
      namuaHigh: phaseCount(high, "namua"),
      mtajiHigh: phaseCount(high, "mtaji"),
      namuaLow: phaseCount(low, "namua"),
      mtajiLow: phaseCount(low, "mtaji"),
    },
    checks,
    productionDisposition,
  };
}

function runDevelopment(spec, options = {}) {
  const gameCount = options.gameCount ?? spec.sourcePopulation.games;
  ensure(Number.isInteger(gameCount) && gameCount > 0, "invalid gameCount");
  const records = Array.from({ length: gameCount }, (_, gameIndex) => runGame(spec, gameIndex));
  const selection = selectRoots(records, spec);
  const represented = materializeRepresentations(selection.selected, spec);
  const measured = represented.map((item) => ({
    ...item,
    ...measureRoot(item, spec, options.measurementOptions || {}),
  }));
  const model = developModel(measured, spec);
  const readiness = evaluateReadiness(selection, measured, model, spec);
  const compactRows = measured.map((row) => ({
    gameIndex: row.gameIndex,
    seed: row.seed,
    generationStratum: row.generationStratum,
    phase: row.phase,
    ply: row.ply,
    rawStateKey: row.rawStateKey,
    historicalTrajectoryHash: row.historicalTrajectoryHash,
    openingPrefixHash: row.openingPrefixHash,
    historyWindowHash: row.historyWindowHash,
    representationRowIdentity: row.representationRowIdentity,
    featureSchemaSha256: row.representation.featureSchemaSha256,
    featureVectorSha256: row.featureVectorSha256,
    representation: row.representation,
    primaryEstimable: row.primaryEstimable,
    dRange: row.dRange,
    highDivergence: row.highDivergence,
    measurementSha256: row.measurementSha256,
    moves: row.moves,
  }));
  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    policyId: STAGE1_POLICY_ID,
    selection: { ...selection, selected: undefined },
    rows: compactRows,
    model,
    readiness,
  };
  delete result.selection.selected;
  result.developmentCoreSha256 = canonicalHash(result);
  return result;
}

module.exports = {
  STAGE1_POLICY_ID,
  assignedPhase,
  canonicalHash,
  collapseSelectedRawStates,
  conditionForGame,
  deriveOperatingThreshold,
  deriveReplicateSeed32,
  developModel,
  evaluateFamilySet,
  evaluateReadiness,
  fitDiagonalLda,
  foldForTrajectory,
  generatorMove,
  historyWindowHash,
  materializeRepresentations,
  measureRoot,
  quotaRank,
  representativeGames,
  rootRank,
  runContinuation,
  runDevelopment,
  runGame,
  scoreDiagonalLda,
  selectRoots,
  sha256Text,
  tieAwareAuc,
};