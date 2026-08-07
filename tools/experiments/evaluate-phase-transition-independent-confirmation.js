#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const TrajectoryAudit = require("./analyze-confirmation-trajectory-duplication.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-independent-confirmation-v2.json",
    manifest: "artifacts/phase-transition/independent-confirmation-v2/manifest.json",
    games: "artifacts/phase-transition/independent-confirmation-v2/games.json",
    candidates: "artifacts/local/phase-transition-independent-confirmation-v2-controls/candidate-control-metrics.csv",
    controls: "artifacts/local/phase-transition-independent-confirmation-v2-controls/control-point-metrics.csv",
    output: "artifacts/local/phase-transition-independent-confirmation-v2",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--manifest") options.manifest = value;
    else if (key === "--games") options.games = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--controls") options.controls = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function expectedSeeds(config) {
  return Array.from(
    { length: config.corpus.games },
    (_, index) => config.corpus.baseSeed + index,
  );
}

function exactArray(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function corpusChecks(config, manifest, games) {
  const expected = expectedSeeds(config);
  const observedSeeds = games.map((game) => Number(game.seed)).sort((a, b) => a - b);
  const gameIds = games.map((game) => game.gameId);
  const condition = manifest.config?.condition || {};
  const gameConfigHashes = games
    .map((game) => game.configHash)
    .filter((value) => value !== undefined && value !== null && value !== "");
  return {
    manifestCompletedGames:
      Number(manifest.completedGames) === config.corpus.games,
    manifestConfiguredGames:
      Number(manifest.config?.games) === config.corpus.games,
    manifestBaseSeed:
      Number(manifest.config?.baseSeed) === config.corpus.baseSeed,
    manifestProfile:
      manifest.config?.profile === config.corpus.profile,
    manifestLevel:
      condition.level === config.corpus.level,
    manifestEvaluationProfile:
      condition.evaluator === config.corpus.evaluationProfile,
    manifestSearchProfile:
      condition.search === config.corpus.searchProfile,
    manifestMaxDepth:
      Number(condition.maxDepth) === config.corpus.maxDepth,
    gamesCount: games.length === config.corpus.games,
    exactSeedSequence: exactArray(observedSeeds, expected),
    uniqueGameIds: new Set(gameIds).size === games.length,
    allTrajectoryHashesPresent:
      games.every((game) => typeof game.trajectoryHash === "string" && game.trajectoryHash.length > 0),
    gameConfigHashesMatchManifest:
      gameConfigHashes.length === 0
      || gameConfigHashes.every((value) => value === manifest.configHash),
  };
}

function endpointChecks(config, audit) {
  const criteria = config.successCriteria;
  const raw = audit.summary.rawEndpoint;
  const deduplicated = audit.summary.trajectoryPlyDeduplicatedEndpoint;
  const structure = audit.summary.candidateStructure;
  const candidateRate = deduplicated.rates.candidateExpansionRate;
  const controlRate = deduplicated.rates.controlExpansionRate;
  const riskRatio = deduplicated.rates.riskRatio;
  return {
    minimumRawPrimaryCandidateRows:
      raw.counts.candidates >= criteria.minimumRawPrimaryCandidateRows,
    minimumUniqueCandidateTrajectoryPly:
      structure.uniqueTrajectoryPlyCount
        >= criteria.minimumUniqueCandidateTrajectoryPly,
    minimumUniqueCandidateTrajectories:
      structure.uniqueTrajectoryCount
        >= criteria.minimumUniqueCandidateTrajectories,
    minimumUniqueExpansionTrajectoryPly:
      structure.uniqueExpansionTrajectoryPlyCount
        >= criteria.minimumUniqueExpansionTrajectoryPly,
    minimumUniqueExpansionTrajectories:
      structure.uniqueExpansionTrajectoryCount
        >= criteria.minimumUniqueExpansionTrajectories,
    minimumUniqueControlTrajectoryPly:
      deduplicated.counts.controls
        >= criteria.minimumUniqueControlTrajectoryPly,
    minimumDeduplicatedRiskRatio:
      riskRatio !== null
        && riskRatio >= criteria.minimumDeduplicatedRiskRatio,
    deduplicatedCandidateRateGreaterThanControlRate:
      !criteria.requireDeduplicatedCandidateRateGreaterThanControlRate
      || (candidateRate !== null && controlRate !== null && candidateRate > controlRate),
  };
}

function csvRows(result) {
  if (result.decision === "inconclusive" && !result.endpoints) {
    return [{
      experimentId: result.experimentId,
      decision: result.decision,
      error: result.error,
      corpusValid: false,
      allEndpointCriteriaPass: false,
    }];
  }
  const raw = result.endpoints.raw;
  const deduplicated = result.endpoints.trajectoryPlyDeduplicated;
  const structure = result.candidateStructure;
  return [{
    experimentId: result.experimentId,
    decision: result.decision,
    rawCandidates: raw.counts.candidates,
    rawExpansionCandidates: raw.counts.candidateExpansion,
    rawControls: raw.counts.controls,
    rawControlExpansion: raw.counts.controlExpansion,
    rawRiskRatio: raw.rates.riskRatio,
    uniqueCandidateTrajectoryPly: structure.uniqueTrajectoryPlyCount,
    uniqueCandidateTrajectories: structure.uniqueTrajectoryCount,
    uniqueExpansionTrajectoryPly: structure.uniqueExpansionTrajectoryPlyCount,
    uniqueExpansionTrajectories: structure.uniqueExpansionTrajectoryCount,
    uniqueControlTrajectoryPly: deduplicated.counts.controls,
    deduplicatedCandidateExpansion: deduplicated.counts.candidateExpansion,
    deduplicatedControlExpansion: deduplicated.counts.controlExpansion,
    deduplicatedCandidateRate: deduplicated.rates.candidateExpansionRate,
    deduplicatedControlRate: deduplicated.rates.controlExpansionRate,
    deduplicatedRiskRatio: deduplicated.rates.riskRatio,
    corpusValid: Object.values(result.corpusChecks).every(Boolean),
    allEndpointCriteriaPass: Object.values(result.endpointChecks).every(Boolean),
  }];
}

function evaluate(config, manifest, games, candidateRows, controlRows) {
  const audit = TrajectoryAudit.analyze(
    games,
    candidateRows,
    controlRows,
    config.primaryPopulation.minimumPliesRemaining,
  );
  const checkedCorpus = corpusChecks(config, manifest, games);
  const checkedEndpoint = endpointChecks(config, audit);
  const corpusValid = Object.values(checkedCorpus).every(Boolean);
  const endpointValid = Object.values(checkedEndpoint).every(Boolean);
  const decision = !corpusValid
    ? "inconclusive"
    : endpointValid ? "confirmed" : "not-confirmed";
  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
    preregistrationStatus: config.status,
    decision,
    corpusChecks: checkedCorpus,
    endpointChecks: checkedEndpoint,
    endpoints: {
      raw: audit.summary.rawEndpoint,
      trajectoryPlyDeduplicated:
        audit.summary.trajectoryPlyDeduplicatedEndpoint,
    },
    candidateStructure: audit.summary.candidateStructure,
    duplicateGroups: audit.duplicateGroups,
    archetypes: audit.archetypes,
  };
}

function inconclusiveResult(config, error) {
  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
    preregistrationStatus: config.status,
    decision: "inconclusive",
    error: error instanceof Error ? error.message : String(error),
    corpusChecks: {},
    endpointChecks: {},
    duplicateGroups: [],
    archetypes: [],
  };
}

function writeResult(output, result) {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "independent-confirmation-result.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  IO.writeCsv(
    path.join(output, "independent-confirmation-summary.csv"),
    csvRows(result),
  );
  IO.writeCsv(
    path.join(output, "candidate-duplicate-groups.csv"),
    result.duplicateGroups || [],
  );
  IO.writeCsv(
    path.join(output, "candidate-archetypes.csv"),
    result.archetypes || [],
  );
}

function run(options) {
  const config = JSON.parse(fs.readFileSync(path.resolve(options.config), "utf8"));
  const output = path.resolve(options.output);
  let result;
  try {
    const manifest = JSON.parse(fs.readFileSync(path.resolve(options.manifest), "utf8"));
    const games = JSON.parse(fs.readFileSync(path.resolve(options.games), "utf8"));
    const candidates = IO.readCsv(path.resolve(options.candidates));
    const controls = IO.readCsv(path.resolve(options.controls));
    result = evaluate(config, manifest, games, candidates, controls);
  } catch (error) {
    result = inconclusiveResult(config, error);
  }
  writeResult(output, result);
  console.log(JSON.stringify(result, null, 2));
  if (result.decision === "inconclusive") process.exitCode = 2;
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
  corpusChecks,
  csvRows,
  endpointChecks,
  evaluate,
  expectedSeeds,
  inconclusiveResult,
  parseArgs,
  run,
  writeResult,
};
