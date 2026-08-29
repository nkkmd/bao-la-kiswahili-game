"use strict";

const P0 = require("./pcrpr-stage0-production.js");
const Core = require("./pcrpr-stage1-production.js");

function ensure(ok, message) {
  if (!ok) throw new Error(message);
}

function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function orderedSum(values) {
  let total = 0;
  for (const value of values) {
    ensure(Number.isFinite(value), "non-finite ordered sum");
    total += value;
  }
  return total;
}

function mean(values) {
  return values.length ? orderedSum(values) / values.length : 0;
}

function populationSd(values) {
  if (!values.length) return 0;
  const m = mean(values);
  return Math.sqrt(orderedSum(values.map((value) => (value - m) ** 2)) / values.length);
}

function rmse(actual, predicted) {
  ensure(actual.length === predicted.length && actual.length > 0, "invalid RMSE vectors");
  return Math.sqrt(orderedSum(actual.map((value, index) => (predicted[index] - value) ** 2)) / actual.length);
}

function averageRanks(values, identities) {
  ensure(values.length === identities.length, "rank length mismatch");
  const indexed = values.map((value, index) => ({ value, identity: identities[index], index }))
    .sort((a, b) => a.value - b.value || cmp(a.identity, b.identity));
  const ranks = new Array(values.length);
  let start = 0;
  while (start < indexed.length) {
    let end = start + 1;
    while (end < indexed.length && indexed[end].value === indexed[start].value) end += 1;
    const averageRank = ((start + 1) + end) / 2;
    for (let index = start; index < end; index += 1) ranks[indexed[index].index] = averageRank;
    start = end;
  }
  return ranks;
}

function pearson(left, right) {
  ensure(left.length === right.length && left.length > 0, "invalid correlation vectors");
  const leftMean = mean(left);
  const rightMean = mean(right);
  let numerator = 0;
  let leftDenominator = 0;
  let rightDenominator = 0;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index] - leftMean;
    const b = right[index] - rightMean;
    numerator += a * b;
    leftDenominator += a * a;
    rightDenominator += b * b;
  }
  if (leftDenominator === 0 || rightDenominator === 0) return 0;
  return numerator / Math.sqrt(leftDenominator * rightDenominator);
}

function spearman(rows, predictions) {
  const identities = rows.map((row) => row.rowIdentity);
  const targets = rows.map((row) => row.primaryLift);
  return pearson(averageRanks(targets, identities), averageRanks(predictions, identities));
}

function featureMap(row) {
  const result = new Map();
  for (const cell of row.representation.vector.rows) {
    result.set(cell.family + "." + cell.name, cell.value);
  }
  return result;
}

function activeFeatureNames(row, families) {
  const allowed = new Set(families);
  return row.representation.vector.rows
    .filter((cell) => allowed.has(cell.family))
    .map((cell) => cell.family + "." + cell.name);
}

function prepareRows(rows, measurements) {
  const byIdentity = new Map(measurements.map((measurement) => [measurement.rowIdentity, measurement]));
  return rows.map((row) => {
    const measurement = byIdentity.get(row.rowIdentity);
    ensure(measurement, "measurement missing for row " + row.rowIdentity);
    return {
      rowIdentity: row.rowIdentity,
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      phase: row.phase,
      generationStratum: row.generationStratum,
      representation: row.representation,
      featureMap: featureMap(row),
      strongWin: measurement.strongWin,
      mediumWinRate: measurement.mediumWinRate,
      weakWinRate: measurement.weakWinRate,
      primaryLift: measurement.primaryLift,
      weakLift: measurement.weakLift,
      policySpan: measurement.policySpan,
      administrative: measurement.administrative,
      measurement,
    };
  }).sort((a, b) => cmp(a.rowIdentity, b.rowIdentity));
}

function foldIndex(historicalTrajectoryHash) {
  return Number.parseInt(Core.sha256("PCRPR-S1-CV-v1|" + historicalTrajectoryHash).slice(0, 8), 16) % 5;
}

function preprocessing(rows, featureNames) {
  const orderedRows = rows.slice().sort((a, b) => cmp(a.rowIdentity, b.rowIdentity));
  const means = [];
  const scales = [];
  for (const name of featureNames) {
    const values = orderedRows.map((row) => {
      const value = row.featureMap.get(name);
      ensure(Number.isFinite(value), "missing/non-finite feature " + name);
      return value;
    });
    const featureMean = mean(values);
    const featureSd = populationSd(values);
    means.push(featureMean);
    scales.push(featureSd === 0 ? 1 : featureSd);
  }
  return { means, scales };
}

function standardizedVector(row, featureNames, prep) {
  return featureNames.map((name, index) => (row.featureMap.get(name) - prep.means[index]) / prep.scales[index]);
}

function baseNormalSystem(rows, featureNames, prep) {
  const orderedRows = rows.slice().sort((a, b) => cmp(a.rowIdentity, b.rowIdentity));
  const size = featureNames.length + 1;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  const rhs = Array(size).fill(0);

  for (const row of orderedRows) {
    const values = [1, ...standardizedVector(row, featureNames, prep)];
    const target = row.primaryLift;
    for (let left = 0; left < size; left += 1) {
      rhs[left] += values[left] * target;
      for (let right = 0; right <= left; right += 1) {
        matrix[left][right] += values[left] * values[right];
      }
    }
  }
  for (let left = 0; left < size; left += 1) {
    for (let right = 0; right < left; right += 1) matrix[right][left] = matrix[left][right];
  }
  return { matrix, rhs };
}

function choleskySolve(base, lambda) {
  const matrix = base.matrix.map((row) => row.slice());
  const rhs = base.rhs.slice();
  const size = matrix.length;
  for (let index = 1; index < size; index += 1) matrix[index][index] += lambda;

  const lower = Array.from({ length: size }, () => Array(size).fill(0));
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      let value = matrix[row][column];
      for (let inner = 0; inner < column; inner += 1) value -= lower[row][inner] * lower[column][inner];
      if (row === column) {
        ensure(Number.isFinite(value) && value > 0, "non-positive/non-finite Cholesky pivot");
        lower[row][column] = Math.sqrt(value);
      } else {
        lower[row][column] = value / lower[column][column];
      }
    }
  }

  const forward = Array(size).fill(0);
  for (let row = 0; row < size; row += 1) {
    let value = rhs[row];
    for (let column = 0; column < row; column += 1) value -= lower[row][column] * forward[column];
    forward[row] = value / lower[row][row];
  }

  const beta = Array(size).fill(0);
  for (let row = size - 1; row >= 0; row -= 1) {
    let value = forward[row];
    for (let column = size - 1; column > row; column -= 1) value -= lower[column][row] * beta[column];
    beta[row] = value / lower[row][row];
  }
  ensure(beta.every(Number.isFinite), "non-finite ridge solution");
  return beta;
}

function predictRow(row, featureNames, prep, beta) {
  const vector = standardizedVector(row, featureNames, prep);
  let prediction = beta[0];
  for (let index = 0; index < vector.length; index += 1) prediction += beta[index + 1] * vector[index];
  return prediction;
}

function fit(rows, featureNames, lambda) {
  const prep = preprocessing(rows, featureNames);
  const base = baseNormalSystem(rows, featureNames, prep);
  const beta = choleskySolve(base, lambda);
  return { featureNames, lambda, prep, beta };
}

function serializeModel(model) {
  return {
    featureNames: model.featureNames.slice(),
    lambda: model.lambda,
    lambdaF64be: P0.f64be(model.lambda),
    means: model.prep.means.map((value) => ({ value, f64be:P0.f64be(value) })),
    scales: model.prep.scales.map((value) => ({ value, f64be:P0.f64be(value) })),
    intercept: { value:model.beta[0], f64be:P0.f64be(model.beta[0]) },
    coefficients: model.beta.slice(1).map((value) => ({ value, f64be:P0.f64be(value) })),
  };
}

function topQuintileEnrichment(rows, predictions) {
  ensure(rows.length === predictions.length && rows.length > 1, "invalid enrichment rows");
  const ranked = rows.map((row, index) => ({ row, prediction:predictions[index] }))
    .sort((a, b) => b.prediction - a.prediction || cmp(a.row.rowIdentity, b.row.rowIdentity));
  const topCount = Math.max(1, Math.floor(0.20 * ranked.length));
  const top = ranked.slice(0, topCount).map((item) => item.row.primaryLift);
  const rest = ranked.slice(topCount).map((item) => item.row.primaryLift);
  ensure(rest.length > 0, "empty enrichment remainder");
  return { topCount, topMean:mean(top), remainingMean:mean(rest), difference:mean(top)-mean(rest) };
}

function crossValidate(rows, spec) {
  ensure(rows.length > 0, "no development rows");
  const familySets = spec.developmentModel.candidateFamilySets;
  const lambdas = spec.developmentModel.ridgeLambdas.slice().sort((a,b)=>a-b);
  const candidates = [];
  const baselinePredictions = new Map();

  for (let fold = 0; fold < 5; fold += 1) {
    const training = rows.filter((row) => foldIndex(row.historicalTrajectoryHash) !== fold);
    const testing = rows.filter((row) => foldIndex(row.historicalTrajectoryHash) === fold);
    ensure(training.length > 0 && testing.length > 0, "empty CV fold");
    const trainingMean = mean(training.map((row) => row.primaryLift));
    for (const row of testing) baselinePredictions.set(row.rowIdentity, trainingMean);
  }

  for (const familySetId of Object.keys(familySets).sort(cmp)) {
    const featureNames = activeFeatureNames(rows[0], familySets[familySetId]);
    ensure(featureNames.length > 0, "empty active feature set " + familySetId);
    const predictionsByLambda = new Map(lambdas.map((lambda) => [lambda, new Map()]));
    for (let fold = 0; fold < 5; fold += 1) {
      const training = rows.filter((row) => foldIndex(row.historicalTrajectoryHash) !== fold);
      const testing = rows.filter((row) => foldIndex(row.historicalTrajectoryHash) === fold);
      const prep = preprocessing(training, featureNames);
      const base = baseNormalSystem(training, featureNames, prep);
      for (const lambda of lambdas) {
        const beta = choleskySolve(base, lambda);
        for (const row of testing) predictionsByLambda.get(lambda).set(row.rowIdentity, predictRow(row, featureNames, prep, beta));
      }
    }
    for (const lambda of lambdas) {
      const predictions = rows.map((row) => {
        const value = predictionsByLambda.get(lambda).get(row.rowIdentity);
        ensure(Number.isFinite(value), "missing OOF prediction");
        return value;
      });
      const actual = rows.map((row) => row.primaryLift);
      candidates.push({
        familySetId,
        activeFeatureCount:featureNames.length,
        lambda,
        pooledOofRmse:rmse(actual,predictions),
        pooledOofSpearman:spearman(rows,predictions),
        predictions,
        predictionHash:Core.canonicalHash(rows.map((row,index)=>({rowIdentity:row.rowIdentity,prediction:predictions[index],f64be:P0.f64be(predictions[index])}))),
      });
    }
  }

  candidates.sort((a,b)=>a.pooledOofRmse-b.pooledOofRmse
    || b.pooledOofSpearman-a.pooledOofSpearman
    || a.activeFeatureCount-b.activeFeatureCount
    || cmp(a.familySetId,b.familySetId)
    || a.lambda-b.lambda);
  const selected = candidates[0];
  const baseline = rows.map((row) => baselinePredictions.get(row.rowIdentity));
  const baselineRmse = rmse(rows.map((row)=>row.primaryLift), baseline);
  const namuaRows = rows.filter((row)=>row.phase==="namua");
  const mtajiRows = rows.filter((row)=>row.phase==="mtaji");
  const predMap = new Map(rows.map((row,index)=>[row.rowIdentity,selected.predictions[index]]));
  const namuaPred = namuaRows.map((row)=>predMap.get(row.rowIdentity));
  const mtajiPred = mtajiRows.map((row)=>predMap.get(row.rowIdentity));
  return {
    candidates: candidates.map((candidate)=>({
      familySetId:candidate.familySetId,
      activeFeatureCount:candidate.activeFeatureCount,
      lambda:candidate.lambda,
      pooledOofRmse:candidate.pooledOofRmse,
      pooledOofSpearman:candidate.pooledOofSpearman,
      predictionHash:candidate.predictionHash,
    })),
    selectedFamilySetId:selected.familySetId,
    selectedLambda:selected.lambda,
    selectedActiveFeatureCount:selected.activeFeatureCount,
    selectedPooledOofRmse:selected.pooledOofRmse,
    selectedPooledOofSpearman:selected.pooledOofSpearman,
    selectedNamuaOofSpearman:spearman(namuaRows,namuaPred),
    selectedMtajiOofSpearman:spearman(mtajiRows,mtajiPred),
    baselineOofRmse:baselineRmse,
    relativeRmseImprovement:baselineRmse===0?0:1-(selected.pooledOofRmse/baselineRmse),
    topScoreQuintile:topQuintileEnrichment(rows,selected.predictions),
    selectedOofPredictions:rows.map((row,index)=>({rowIdentity:row.rowIdentity,prediction:selected.predictions[index],f64be:P0.f64be(selected.predictions[index])})),
  };
}

function selectionSupport(selection, rows, spec) {
  const g = spec.readinessGates;
  const selectedRoots = selection.selected.length;
  const rootsByPhase = {
    namua:selection.selected.filter((root)=>root.phase==="namua").length,
    mtaji:selection.selected.filter((root)=>root.phase==="mtaji").length,
  };
  const maxStratumShare = selectedRoots ? Math.max(...Object.values(selection.conditionCounts),0) / selectedRoots : 1;
  const rowsByPhase = {
    namua:rows.filter((row)=>row.phase==="namua").length,
    mtaji:rows.filter((row)=>row.phase==="mtaji").length,
  };
  const primary = rows.map((row)=>row.primaryLift);
  const phaseSd = {
    namua:populationSd(rows.filter((row)=>row.phase==="namua").map((row)=>row.primaryLift)),
    mtaji:populationSd(rows.filter((row)=>row.phase==="mtaji").map((row)=>row.primaryLift)),
  };
  const admin = { strong:0, medium:0, weak:0 };
  let strongDenominator=0, mediumDenominator=0, weakDenominator=0;
  for (const row of rows) {
    admin.strong += row.administrative.strong;
    admin.medium += row.administrative.medium;
    admin.weak += row.administrative.weak;
    strongDenominator += row.measurement.outcomes.STRONG.length;
    mediumDenominator += row.measurement.outcomes.MEDIUM.length;
    weakDenominator += row.measurement.outcomes.WEAK.length;
  }
  const adminFractions = {
    strong: strongDenominator ? admin.strong/strongDenominator : 1,
    medium: mediumDenominator ? admin.medium/mediumDenominator : 1,
    weak: weakDenominator ? admin.weak/weakDenominator : 1,
  };
  const checks = {
    minimumUniqueHistoricalTrajectoriesGenerated: selection.uniqueHistoricalTrajectories >= g.minimumUniqueHistoricalTrajectoriesGenerated,
    minimumDistinctOpeningPrefixesGenerated: selection.generatedDistinctOpeningPrefixes >= g.minimumDistinctOpeningPrefixesGenerated,
    requiredSelectedRoots: selectedRoots === g.requiredSelectedRoots,
    requiredNamuaRoots: rootsByPhase.namua === g.requiredNamuaRoots,
    requiredMtajiRoots: rootsByPhase.mtaji === g.requiredMtajiRoots,
    minimumSelectedDistinctOpeningPrefixes: selection.selectedDistinctOpeningPrefixes >= g.minimumSelectedDistinctOpeningPrefixes,
    minimumSelectedRootsPerGenerationStratum: spec.sourcePopulation.conditionAssignment.strata.every((stratum)=>(selection.conditionCounts[stratum.id]||0)>=g.minimumSelectedRootsPerGenerationStratum),
    maximumSingleGenerationStratumShare: maxStratumShare <= g.maximumSingleGenerationStratumShare,
    minimumDevelopmentRows: rows.length >= g.minimumDevelopmentRows,
    minimumDevelopmentRowsNamua: rowsByPhase.namua >= g.minimumDevelopmentRowsNamua,
    minimumDevelopmentRowsMtaji: rowsByPhase.mtaji >= g.minimumDevelopmentRowsMtaji,
    minimumPrimaryTargetPopulationSd: populationSd(primary) >= g.minimumPrimaryTargetPopulationSd,
    minimumPrimaryTargetPopulationSdEachPhase: phaseSd.namua >= g.minimumPrimaryTargetPopulationSdEachPhase && phaseSd.mtaji >= g.minimumPrimaryTargetPopulationSdEachPhase,
    minimumRowsWithPrimaryLiftGreaterThanZero: rows.filter((row)=>row.primaryLift>0).length >= g.minimumRowsWithPrimaryLiftGreaterThanZero,
    minimumRowsWithPrimaryLiftLessThanOrEqualZero: rows.filter((row)=>row.primaryLift<=0).length >= g.minimumRowsWithPrimaryLiftLessThanOrEqualZero,
    minimumPrimaryTargetObservedRange: primary.length>0 && (Math.max(...primary)-Math.min(...primary)) >= g.minimumPrimaryTargetObservedRange,
    maximumMediumAdministrativeHorizonFraction: adminFractions.medium <= g.maximumMediumAdministrativeHorizonFraction,
    maximumWeakAdministrativeHorizonFraction: adminFractions.weak <= g.maximumWeakAdministrativeHorizonFraction,
    maximumStrongAdministrativeHorizonFraction: adminFractions.strong <= g.maximumStrongAdministrativeHorizonFraction,
  };
  return {
    counts:{selectedRoots,rootsByPhase,rows:rows.length,rowsByPhase,conditionCounts:selection.conditionCounts},
    target:{sd:populationSd(primary),phaseSd,positiveRows:rows.filter((row)=>row.primaryLift>0).length,nonPositiveRows:rows.filter((row)=>row.primaryLift<=0).length,range:primary.length?Math.max(...primary)-Math.min(...primary):0},
    adminFractions,maxStratumShare,checks,passed:Object.values(checks).every(Boolean),
  };
}

function performanceSupport(model, spec) {
  const g = spec.readinessGates;
  const checks = {
    minimumSelectedModelPooledOofSpearman:model.selectedPooledOofSpearman >= g.minimumSelectedModelPooledOofSpearman,
    minimumSelectedModelNamuaOofSpearman:model.selectedNamuaOofSpearman >= g.minimumSelectedModelNamuaOofSpearman,
    minimumSelectedModelMtajiOofSpearman:model.selectedMtajiOofSpearman >= g.minimumSelectedModelMtajiOofSpearman,
    minimumRelativeRmseImprovementVersusFoldMeanBaseline:model.relativeRmseImprovement >= g.minimumRelativeRmseImprovementVersusFoldMeanBaseline,
    minimumTopScoreQuintileMeanLiftMinusRemainingMeanLift:model.topScoreQuintile.difference >= g.minimumTopScoreQuintileMeanLiftMinusRemainingMeanLift,
  };
  return { checks, passed:Object.values(checks).every(Boolean) };
}

function develop(rows, measurements, selection, spec) {
  const prepared = prepareRows(rows, measurements);
  const model = crossValidate(prepared, spec);
  const support = selectionSupport(selection, prepared, spec);
  const performance = performanceSupport(model, spec);
  let productionDisposition;
  if (!support.passed) productionDisposition = "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE";
  else if (!performance.passed) productionDisposition = "STAGE1-DEVELOPMENT-BLOCKED-ZERO-PROMOTION";
  else productionDisposition = "STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION";

  const selectedFamilies = spec.developmentModel.candidateFamilySets[model.selectedFamilySetId];
  const selectedFeatureNames = activeFeatureNames(prepared[0], selectedFamilies);
  const finalModel = fit(prepared, selectedFeatureNames, model.selectedLambda);
  const serializedFinalModel = serializeModel(finalModel);
  const finalPredictions = prepared.map((row)=>predictRow(row,selectedFeatureNames,finalModel.prep,finalModel.beta));
  const developmentCore = {
    selectionHash:selection.selectionHash,
    rowCount:prepared.length,
    rowIdentities:prepared.map((row)=>row.rowIdentity),
    targetRows:prepared.map((row)=>({rowIdentity:row.rowIdentity,primaryLift:row.primaryLift,weakLift:row.weakLift,policySpan:row.policySpan})),
    support,
    model,
    performance,
    finalModel:serializedFinalModel,
    finalPredictionHash:Core.canonicalHash(prepared.map((row,index)=>({rowIdentity:row.rowIdentity,prediction:finalPredictions[index],f64be:P0.f64be(finalPredictions[index])}))),
    productionDisposition,
  };
  return { ...developmentCore, developmentCoreSha256:Core.canonicalHash(developmentCore) };
}

module.exports = {
  activeFeatureNames,
  averageRanks,
  choleskySolve,
  crossValidate,
  develop,
  fit,
  foldIndex,
  mean,
  pearson,
  populationSd,
  prepareRows,
  rmse,
  serializeModel,
  spearman,
  topQuintileEnrichment,
};
