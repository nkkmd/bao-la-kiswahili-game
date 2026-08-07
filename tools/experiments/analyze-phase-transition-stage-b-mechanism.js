#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");

const MINIMUM_PLIES_REMAINING = 9;

const ANALYSIS_BOUNDARY = Object.freeze({
  analysisType: "Stage B retrospective non-formal mechanism decomposition",
  generatesGames: false,
  invokesFormalRunner: false,
  changesPrimaryDecision: false,
  formalDecisions: Object.freeze({
    E018: "confirmed",
    E019: "not-confirmed",
    E020: "confirmed",
  }),
  note: "This analysis reads existing fixed formal-analysis outputs only. It may not replace, rescue, reverse, merge, or generalize any formal decision.",
});

const CONDITION_DEFINITIONS = Object.freeze({
  e018P2: Object.freeze({
    key: "E018-D2-P2",
    experimentId: "E-018",
    depth: 2,
    evaluator: "bao",
    searchProfile: "phase2",
    gameCount: 2000,
    expectedPrimaryExpansionGames: 63,
  }),
  e018Lg: Object.freeze({
    key: "E018-D2-LG",
    experimentId: "E-018",
    depth: 2,
    evaluator: "bao",
    searchProfile: "legacy",
    gameCount: 2000,
    expectedPrimaryExpansionGames: 9,
  }),
  e019D3P2: Object.freeze({
    key: "E019-D3-P2",
    experimentId: "E-019",
    depth: 3,
    evaluator: "bao",
    searchProfile: "phase2",
    gameCount: 4500,
    expectedPrimaryExpansionGames: 13,
  }),
  e019D3Lg: Object.freeze({
    key: "E019-D3-LG",
    experimentId: "E-019",
    depth: 3,
    evaluator: "bao",
    searchProfile: "legacy",
    gameCount: 4500,
    expectedPrimaryExpansionGames: 140,
  }),
  e020P2: Object.freeze({
    key: "E020-D3-P2",
    experimentId: "E-020",
    depth: 3,
    evaluator: "bao",
    searchProfile: "phase2",
    gameCount: 4500,
    expectedPrimaryExpansionGames: 18,
  }),
  e020Lg: Object.freeze({
    key: "E020-D3-LG",
    experimentId: "E-020",
    depth: 3,
    evaluator: "bao",
    searchProfile: "legacy",
    gameCount: 4500,
    expectedPrimaryExpansionGames: 129,
  }),
});

const ARGUMENTS = Object.freeze({
  "--e018-p2-candidates": "e018P2",
  "--e018-lg-candidates": "e018Lg",
  "--e019-d3-p2-candidates": "e019D3P2",
  "--e019-d3-lg-candidates": "e019D3Lg",
  "--e020-p2-candidates": "e020P2",
  "--e020-lg-candidates": "e020Lg",
});

function parseArgs(argv) {
  const options = {
    inputs: {},
    output: "artifacts/local/phase-transition-stage-b-mechanism/stage-b-mechanism-summary.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--output") options.output = value;
    else if (ARGUMENTS[key]) options.inputs[ARGUMENTS[key]] = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  for (const conditionKey of Object.keys(CONDITION_DEFINITIONS)) {
    if (!options.inputs[conditionKey]) {
      const flag = Object.entries(ARGUMENTS).find(([, value]) => value === conditionKey)?.[0];
      throw new Error(`${flag} is required`);
    }
  }
  return options;
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function finiteNumber(row, name) {
  if (row[name] === undefined || row[name] === null || row[name] === "") return null;
  const value = Number(row[name]);
  return Number.isFinite(value) ? value : null;
}

function eligibleCandidate(row, minimumPliesRemaining = MINIMUM_PLIES_REMAINING) {
  const distance = finiteNumber(row, "distanceToTerminal");
  return distance !== null && distance >= minimumPliesRemaining;
}

function mean(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : null;
}

function median(values) {
  const finite = values.filter(Number.isFinite).sort((left, right) => left - right);
  if (!finite.length) return null;
  const middle = Math.floor(finite.length / 2);
  return finite.length % 2 ? finite[middle] : (finite[middle - 1] + finite[middle]) / 2;
}

function numericSummary(rows, name) {
  const values = rows.map((row) => finiteNumber(row, name)).filter((value) => value !== null);
  return {
    n: values.length,
    min: values.length ? Math.min(...values) : null,
    mean: mean(values),
    median: median(values),
    max: values.length ? Math.max(...values) : null,
  };
}

function countBy(rows, name) {
  const counts = new Map();
  for (const row of rows) {
    const key = row[name] === undefined || row[name] === null || row[name] === "" ? "<missing>" : String(row[name]);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort((left, right) => left[0].localeCompare(right[0], undefined, { numeric: true })));
}

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : null;
}

function summarizeCondition(definition, rows, minimumPliesRemaining = MINIMUM_PLIES_REMAINING) {
  const eligible = rows.filter((row) => eligibleCandidate(row, minimumPliesRemaining));
  const expansion = eligible.filter((row) => row.classification === "capture-branch-expansion");
  const candidateGames = new Set(eligible.map((row) => row.gameId).filter(Boolean));
  const expansionGames = new Set(expansion.map((row) => row.gameId).filter(Boolean));
  const regimeRows = eligible.filter((row) => row.regimeId);
  const uniqueRegimes = new Set(regimeRows.map((row) => row.regimeId));

  if (definition.expectedPrimaryExpansionGames !== undefined
      && expansionGames.size !== definition.expectedPrimaryExpansionGames) {
    throw new Error(
      `${definition.key}: expected ${definition.expectedPrimaryExpansionGames} primary expansion games, found ${expansionGames.size}`,
    );
  }

  const metricNames = [
    "regimeLength",
    "positionInRegime",
    "normalizedPositionInRegime",
    "candidateCaptureMoveCount",
    "preCaptureMean",
    "postCaptureMean",
    "postCaptureMax",
    "captureDelta",
    "postPersistenceFraction",
    "recoveryDistance",
    "distanceToForcingRelease",
    "distanceToTerminal",
  ];
  const morphology = Object.fromEntries(metricNames.map((name) => [name, numericSummary(eligible, name)]));
  const expansionMorphology = Object.fromEntries(metricNames.map((name) => [name, numericSummary(expansion, name)]));

  return {
    key: definition.key,
    experimentId: definition.experimentId,
    condition: {
      evaluator: definition.evaluator,
      depth: definition.depth,
      searchProfile: definition.searchProfile,
      gameCount: definition.gameCount,
      minimumPliesRemaining,
    },
    integrityCheck: {
      expectedPrimaryExpansionGames: definition.expectedPrimaryExpansionGames,
      observedPrimaryExpansionGames: expansionGames.size,
      matchesFormalPrimaryEventGameCount: definition.expectedPrimaryExpansionGames === expansionGames.size,
    },
    counts: {
      rawCandidateRows: rows.length,
      eligibleCandidateRows: eligible.length,
      eligibleCandidateGames: candidateGames.size,
      primaryExpansionCandidateRows: expansion.length,
      primaryExpansionGames: expansionGames.size,
      uniqueForcedCaptureRegimesAmongEligibleCandidates: uniqueRegimes.size,
      eligibleCandidatesOutsideForcedCaptureRegime: eligible.length - regimeRows.length,
    },
    rates: {
      candidateGameRate: ratio(candidateGames.size, definition.gameCount),
      primaryExpansionGameRate: ratio(expansionGames.size, definition.gameCount),
      eligibleCandidateRowsPerGame: ratio(eligible.length, definition.gameCount),
      candidateToExpansionManifestationRate: ratio(expansion.length, eligible.length),
      expansionGamesAmongCandidateGames: ratio(expansionGames.size, candidateGames.size),
    },
    morphology,
    expansionMorphology,
    composition: {
      classificationCounts: countBy(eligible, "classification"),
      phaseAtCandidateCounts: countBy(eligible, "phaseAtCandidate"),
      forcedCaptureAtCandidateCounts: countBy(eligible, "forcedCaptureAtCandidate"),
      regimeLengthCounts: countBy(regimeRows, "regimeLength"),
    },
  };
}

function difference(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  return left - right;
}

function compareProfiles(p2, lg) {
  return {
    direction: "P2-minus-LG; descriptive Stage B secondary only",
    candidateAvailability: {
      candidateGameRateDifference: difference(p2.rates.candidateGameRate, lg.rates.candidateGameRate),
      candidateRowsPerGameDifference: difference(p2.rates.eligibleCandidateRowsPerGame, lg.rates.eligibleCandidateRowsPerGame),
    },
    manifestation: {
      primaryExpansionGameRateDifference: difference(p2.rates.primaryExpansionGameRate, lg.rates.primaryExpansionGameRate),
      candidateToExpansionRateDifference: difference(
        p2.rates.candidateToExpansionManifestationRate,
        lg.rates.candidateToExpansionManifestationRate,
      ),
      expansionGamesAmongCandidateGamesDifference: difference(
        p2.rates.expansionGamesAmongCandidateGames,
        lg.rates.expansionGamesAmongCandidateGames,
      ),
    },
    forcedCaptureRegime: {
      meanRegimeLengthDifference: difference(
        p2.morphology.regimeLength.mean,
        lg.morphology.regimeLength.mean,
      ),
      meanNormalizedPositionDifference: difference(
        p2.morphology.normalizedPositionInRegime.mean,
        lg.morphology.normalizedPositionInRegime.mean,
      ),
    },
    captureBranchDynamics: {
      meanCandidateCaptureMoveCountDifference: difference(
        p2.morphology.candidateCaptureMoveCount.mean,
        lg.morphology.candidateCaptureMoveCount.mean,
      ),
      meanCaptureDeltaDifference: difference(
        p2.morphology.captureDelta.mean,
        lg.morphology.captureDelta.mean,
      ),
      meanPostCaptureMaxDifference: difference(
        p2.morphology.postCaptureMax.mean,
        lg.morphology.postCaptureMax.mean,
      ),
      meanPostPersistenceFractionDifference: difference(
        p2.morphology.postPersistenceFraction.mean,
        lg.morphology.postPersistenceFraction.mean,
      ),
    },
  };
}

function direction(value) {
  if (!Number.isFinite(value) || value === 0) return "zero-or-unavailable";
  return value > 0 ? "P2>LG" : "LG>P2";
}

function mechanismDirections(comparison) {
  return {
    candidateGameRate: direction(comparison.candidateAvailability.candidateGameRateDifference),
    candidateRowsPerGame: direction(comparison.candidateAvailability.candidateRowsPerGameDifference),
    candidateToExpansionRate: direction(comparison.manifestation.candidateToExpansionRateDifference),
    expansionGamesAmongCandidateGames: direction(comparison.manifestation.expansionGamesAmongCandidateGamesDifference),
    meanRegimeLength: direction(comparison.forcedCaptureRegime.meanRegimeLengthDifference),
    meanNormalizedPosition: direction(comparison.forcedCaptureRegime.meanNormalizedPositionDifference),
    meanCandidateCaptureMoveCount: direction(comparison.captureBranchDynamics.meanCandidateCaptureMoveCountDifference),
    meanCaptureDelta: direction(comparison.captureBranchDynamics.meanCaptureDeltaDifference),
    meanPostCaptureMax: direction(comparison.captureBranchDynamics.meanPostCaptureMaxDifference),
    meanPostPersistenceFraction: direction(comparison.captureBranchDynamics.meanPostPersistenceFractionDifference),
  };
}

function run(options) {
  const conditions = {};
  const inputs = {};
  for (const [conditionKey, definition] of Object.entries(CONDITION_DEFINITIONS)) {
    const input = path.resolve(options.inputs[conditionKey]);
    const rows = IO.readCsv(input);
    conditions[definition.key] = summarizeCondition(definition, rows);
    inputs[conditionKey] = {
      path: input,
      sha256: sha256File(input),
    };
  }

  const comparisons = {
    E018_D2: compareProfiles(conditions["E018-D2-P2"], conditions["E018-D2-LG"]),
    E019_D3: compareProfiles(conditions["E019-D3-P2"], conditions["E019-D3-LG"]),
    E020_D3: compareProfiles(conditions["E020-D3-P2"], conditions["E020-D3-LG"]),
  };

  const result = {
    schemaVersion: "1.0.0",
    analysisVersion: "stage-b-mechanism-1",
    boundary: ANALYSIS_BOUNDARY,
    inputs,
    conditions,
    comparisons,
    directionSummary: {
      E018_D2: mechanismDirections(comparisons.E018_D2),
      E019_D3: mechanismDirections(comparisons.E019_D3),
      E020_D3: mechanismDirections(comparisons.E020_D3),
    },
    interpretationBoundary: [
      "All outputs are descriptive retrospective mechanism analyses of already-fixed formal corpora.",
      "Candidate rows, regimes, trajectory-ply units, and games are not interchangeable independent units.",
      "Cross-experiment depth comparisons are not paired depth-effect estimates.",
      "No result in this file changes E-018/H16=confirmed, E-019/H17=not-confirmed, or E-020/H18=confirmed.",
      "Direct search-tree mediation, evaluator generalization, and a general search-profile-by-depth interaction are outside this analysis.",
    ],
  };

  const output = path.resolve(options.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (require.main === module) {
  try {
    run(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  ANALYSIS_BOUNDARY,
  CONDITION_DEFINITIONS,
  MINIMUM_PLIES_REMAINING,
  compareProfiles,
  direction,
  eligibleCandidate,
  mean,
  median,
  numericSummary,
  parseArgs,
  run,
  sha256File,
  summarizeCondition,
};
