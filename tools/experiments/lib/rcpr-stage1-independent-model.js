"use strict";
const crypto = require("node:crypto");
function ensure(condition,message){if(!condition)throw new Error(message);}
function canonicalJson(value){if(value===null||typeof value!=="object")return JSON.stringify(value);if(Array.isArray(value))return `[${value.map(canonicalJson).join(",")}]`;return `{${Object.keys(value).sort().map((key)=>`${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;}
function sha256Text(text){return crypto.createHash("sha256").update(String(text),"utf8").digest("hex");}
function canonicalHash(value){return sha256Text(canonicalJson(value));}
function first32(hash){return Number.parseInt(hash.slice(0,8),16)>>>0;}
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
  return { featureNames: featureNames.slice(), coefficients, midpoints, priorTerm: Math.log(pos.count / neg.count), activeFeatureCount: featureNames.length, positiveTrainingRows: pos.count, negativeTrainingRows: neg.count };
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
  for (const p of pos) for (const n of neg) { if (p.score > n.score) wins += 1; else if (p.score === n.score) wins += 0.5; }
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
  return { tp, tn, fp, fn, sensitivity, specificity, balancedAccuracy: sensitivity === null || specificity === null ? null : (sensitivity + specificity) / 2, youdenJ: sensitivity === null || specificity === null ? null : sensitivity + specificity - 1, predictedPositive: tp + fp, predictedPositiveFraction: rows.length ? (tp + fp) / rows.length : null };
}
function evaluateFamilySet(rows, familySetId, families, spec) {
  ensure(rows.length > 0, "no estimable development rows");
  const featureNames = featureNamesForFamilies(rows[0], families);
  ensure(featureNames.length > 0, `empty family set: ${familySetId}`);
  const folds = spec.developmentModel.crossValidation.folds;
  const scored = []; const foldAuc = [];
  for (let fold = 0; fold < folds; fold += 1) {
    const training = rows.filter((row) => row.fold !== fold);
    const test = rows.filter((row) => row.fold === fold);
    if (!test.length || !training.some((row) => row.highDivergence) || !training.some((row) => !row.highDivergence)) return { familySetId, families, featureNames, activeFeatureCount: featureNames.length, estimable: false, reason: `fold-${fold}-class-or-test-support` };
    const fit = fitDiagonalLda(training, featureNames, spec);
    const testScored = test.map((row) => ({ ...row, score: scoreDiagonalLda(row, fit) }));
    scored.push(...testScored); foldAuc.push({ fold, auc: tieAwareAuc(testScored) });
  }
  scored.sort((a, b) => a.representationRowIdentity.localeCompare(b.representationRowIdentity));
  const overallAuc = tieAwareAuc(scored);
  const phaseAuc = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, tieAwareAuc(scored.filter((row) => row.phase === phase))]));
  return { familySetId, families: families.slice(), featureNames, activeFeatureCount: featureNames.length, estimable: overallAuc !== null && phaseAuc.namua !== null && phaseAuc.mtaji !== null && foldAuc.every((item) => item.auc !== null), overallAuc, phaseAuc, foldAuc, scored };
}
function familySetComparator(a, b) {
  if (a.overallAuc !== b.overallAuc) return b.overallAuc - a.overallAuc;
  const amin = Math.min(a.phaseAuc.namua, a.phaseAuc.mtaji); const bmin = Math.min(b.phaseAuc.namua, b.phaseAuc.mtaji);
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
  candidates.sort((a, b) => { if (a.youdenJ !== b.youdenJ) return b.youdenJ - a.youdenJ; if (a.balancedAccuracy !== b.balancedAccuracy) return b.balancedAccuracy - a.balancedAccuracy; if (a.predictedPositive !== b.predictedPositive) return b.predictedPositive - a.predictedPositive; return b.threshold - a.threshold; });
  return candidates[0] || null;
}
function developModel(rows, spec) {
  const estimable = rows.filter((row) => row.primaryEstimable).map((row) => ({ ...row, fold: foldForTrajectory(row.historicalTrajectoryHash, spec) }));
  if (!estimable.some((row) => row.highDivergence) || !estimable.some((row) => !row.highDivergence)) return { estimable: false, reason: "global-class-support" };
  const evaluations = [];
  for (const [familySetId, families] of Object.entries(spec.developmentModel.candidateFamilySets)) evaluations.push(evaluateFamilySet(estimable, familySetId, families, spec));
  const valid = evaluations.filter((item) => item.estimable).sort(familySetComparator);
  if (!valid.length) return { estimable: false, reason: "no-estimable-family-set", evaluations };
  const selected = valid[0]; let top3FoldStabilityCount = 0;
  for (let fold = 0; fold < spec.developmentModel.crossValidation.folds; fold += 1) {
    const ranked = valid.slice().sort((a, b) => { const aa = a.foldAuc.find((item) => item.fold === fold).auc; const bb = b.foldAuc.find((item) => item.fold === fold).auc; if (aa !== bb) return bb - aa; if (a.activeFeatureCount !== b.activeFeatureCount) return a.activeFeatureCount - b.activeFeatureCount; return a.familySetId.localeCompare(b.familySetId); });
    if (ranked.slice(0, 3).some((item) => item.familySetId === selected.familySetId)) top3FoldStabilityCount += 1;
  }
  const threshold = deriveOperatingThreshold(selected.scored, spec); const finalFit = fitDiagonalLda(estimable, selected.featureNames, spec);
  const compactEvaluations = evaluations.map((item) => ({ familySetId: item.familySetId, families: item.families, activeFeatureCount: item.activeFeatureCount, estimable: item.estimable, reason: item.reason || null, overallAuc: item.overallAuc ?? null, phaseAuc: item.phaseAuc || null, foldAuc: item.foldAuc || null }));
  const out = { estimable: true, selectedFamilySetId: selected.familySetId, selectedFamilies: selected.families, selectedFeatureNames: selected.featureNames, selectedActiveFeatureCount: selected.activeFeatureCount, overallAuc: selected.overallAuc, phaseAuc: selected.phaseAuc, foldAuc: selected.foldAuc, top3FoldStabilityCount, operatingThreshold: threshold, finalFit, evaluations: compactEvaluations };
  out.modelDevelopmentSha256 = canonicalHash(out); return out;
}
function evaluateReadiness(selection, rows, model, spec) {
  const g = spec.readinessGates; const estimable = rows.filter((row) => row.primaryEstimable); const high = estimable.filter((row) => row.highDivergence === true); const low = estimable.filter((row) => row.highDivergence === false); const phaseCount = (items, phase) => items.filter((row) => row.phase === phase).length;
  const checks = { ...selection.selectionChecks, minimumPrimaryEstimableRoots: estimable.length >= g.minimumPrimaryEstimableRoots, minimumPrimaryEstimableNamuaRoots: phaseCount(estimable, "namua") >= g.minimumPrimaryEstimableNamuaRoots, minimumPrimaryEstimableMtajiRoots: phaseCount(estimable, "mtaji") >= g.minimumPrimaryEstimableMtajiRoots, minimumHighDivergenceRoots: high.length >= g.minimumHighDivergenceRoots, minimumLowDivergenceRoots: low.length >= g.minimumLowDivergenceRoots, minimumHighDivergencePerPhase: phaseCount(high, "namua") >= g.minimumHighDivergencePerPhase && phaseCount(high, "mtaji") >= g.minimumHighDivergencePerPhase, minimumLowDivergencePerPhase: phaseCount(low, "namua") >= g.minimumLowDivergencePerPhase && phaseCount(low, "mtaji") >= g.minimumLowDivergencePerPhase, selectedModelEstimable: model.estimable === true, minimumSelectedModelCvAuc: model.estimable && model.overallAuc >= g.minimumSelectedModelCvAuc, minimumSelectedModelEachPhaseCvAuc: model.estimable && model.phaseAuc.namua >= g.minimumSelectedModelEachPhaseCvAuc && model.phaseAuc.mtaji >= g.minimumSelectedModelEachPhaseCvAuc, minimumSelectedModelBalancedAccuracy: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.balancedAccuracy >= g.minimumSelectedModelBalancedAccuracy, minimumOperatingThresholdPositiveSupport: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.predictedPositive >= g.minimumOperatingThresholdPositiveSupport, minimumOperatingThresholdPositivePerPhase: model.estimable && model.operatingThreshold !== null && model.operatingThreshold.phasePositive.namua >= g.minimumOperatingThresholdPositivePerPhase && model.operatingThreshold.phasePositive.mtaji >= g.minimumOperatingThresholdPositivePerPhase, minimumTop3FoldStabilityCount: model.estimable && model.top3FoldStabilityCount >= g.minimumTop3FoldStabilityCount };
  const populationKeys = ["minimumUniqueHistoricalTrajectories","minimumDistinctOpeningPrefixesGenerated","requiredSelectedRawStates","requiredNamuaRoots","requiredMtajiRoots","minimumSelectedDistinctOpeningPrefixes","minimumSelectedPerGenerationStratum","maximumSingleGenerationStratumShare","minimumPrimaryEstimableRoots","minimumPrimaryEstimableNamuaRoots","minimumPrimaryEstimableMtajiRoots","minimumHighDivergenceRoots","minimumLowDivergenceRoots","minimumHighDivergencePerPhase","minimumLowDivergencePerPhase"];
  const modelKeys = ["selectedModelEstimable","minimumSelectedModelCvAuc","minimumSelectedModelEachPhaseCvAuc","minimumSelectedModelBalancedAccuracy","minimumOperatingThresholdPositiveSupport","minimumOperatingThresholdPositivePerPhase","minimumTop3FoldStabilityCount"];
  let productionDisposition; if (!populationKeys.every((key) => checks[key])) productionDisposition = spec.developmentDecision.populationOrClassSupportInsufficient; else if (!modelKeys.every((key) => checks[key])) productionDisposition = spec.developmentDecision.modelPerformanceOrStabilityBelowGate; else productionDisposition = "PASS-AWAITING-INDEPENDENT-VERIFICATION";
  return { counts: { primaryEstimable: estimable.length, highDivergence: high.length, lowDivergence: low.length, namuaEstimable: phaseCount(estimable,"namua"), mtajiEstimable: phaseCount(estimable,"mtaji"), namuaHigh: phaseCount(high,"namua"), mtajiHigh: phaseCount(high,"mtaji"), namuaLow: phaseCount(low,"namua"), mtajiLow: phaseCount(low,"mtaji") }, checks, productionDisposition };
}
module.exports={canonicalHash,deriveOperatingThreshold,developModel,evaluateFamilySet,evaluateReadiness,fitDiagonalLda,foldForTrajectory,scoreDiagonalLda,tieAwareAuc};