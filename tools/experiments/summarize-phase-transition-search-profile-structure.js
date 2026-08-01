#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const TrajectoryAudit = require("./analyze-confirmation-trajectory-duplication.js");
const Evaluator = require("./evaluate-phase-transition-search-profile-dependence.js");
const E018 = require("./lib/phase-transition-search-profile-dependence.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-dependence-v1.json",
    p2Games: null,
    p2Candidates: null,
    p2Controls: null,
    lgGames: null,
    lgCandidates: null,
    lgControls: null,
    output: "artifacts/local/search-profile-dependence-v1-fixture/structure",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--p2-games") options.p2Games = value;
    else if (key === "--p2-candidates") options.p2Candidates = value;
    else if (key === "--p2-controls") options.p2Controls = value;
    else if (key === "--lg-games") options.lgGames = value;
    else if (key === "--lg-candidates") options.lgCandidates = value;
    else if (key === "--lg-controls") options.lgControls = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  for (const key of [
    "p2Games", "p2Candidates", "p2Controls",
    "lgGames", "lgCandidates", "lgControls",
  ]) {
    if (!options[key]) throw new Error(`Missing required ${key} input`);
  }
  return options;
}

function readGames(filePath) {
  const value = JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  if (!Array.isArray(value)) throw new Error(`${filePath}: games must be an array`);
  return value;
}

function conditionAudit(games, candidates, controls, minimumPliesRemaining) {
  return TrajectoryAudit.analyze(games, candidates, controls, minimumPliesRemaining);
}

function summarize(config, p2Audit, lgAudit) {
  const p2 = p2Audit.summary;
  const lg = lgAudit.summary;
  const p2Dedup = p2.trajectoryPlyDeduplicatedEndpoint;
  const lgDedup = lg.trajectoryPlyDeduplicatedEndpoint;
  const direct = Evaluator.structuralComparison(
    p2Dedup.counts.candidates,
    p2Dedup.counts.candidateExpansion,
    lgDedup.counts.candidates,
    lgDedup.counts.candidateExpansion,
  );
  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
    analysisType: "preregistered structural secondary",
    primaryDecisionChanged: false,
    primaryDecisionNote: "This structural comparison is secondary and may not replace the paired game-level exact McNemar primary endpoint.",
    conditions: {
      P2: {
        rawEndpoint: p2.rawEndpoint,
        trajectoryPlyDeduplicatedEndpoint: p2Dedup,
        candidateStructure: p2.candidateStructure,
      },
      LG: {
        rawEndpoint: lg.rawEndpoint,
        trajectoryPlyDeduplicatedEndpoint: lgDedup,
        candidateStructure: lg.candidateStructure,
      },
    },
    directCandidateTrajectoryPlyComparison: direct,
  };
}

function run(options) {
  const loaded = E018.loadPreregistration(options.config);
  const minimum = loaded.config.primaryPopulation.minimumPliesRemaining;
  const p2Audit = conditionAudit(
    readGames(options.p2Games),
    IO.readCsv(path.resolve(options.p2Candidates)),
    IO.readCsv(path.resolve(options.p2Controls)),
    minimum,
  );
  const lgAudit = conditionAudit(
    readGames(options.lgGames),
    IO.readCsv(path.resolve(options.lgCandidates)),
    IO.readCsv(path.resolve(options.lgControls)),
    minimum,
  );
  const result = summarize(loaded.config, p2Audit, lgAudit);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "search-profile-structural-secondary.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  IO.writeCsv(path.join(output, "P2-candidate-duplicate-groups.csv"), p2Audit.duplicateGroups);
  IO.writeCsv(path.join(output, "LG-candidate-duplicate-groups.csv"), lgAudit.duplicateGroups);
  IO.writeCsv(path.join(output, "P2-candidate-archetypes.csv"), p2Audit.archetypes);
  IO.writeCsv(path.join(output, "LG-candidate-archetypes.csv"), lgAudit.archetypes);
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
  conditionAudit,
  parseArgs,
  run,
  summarize,
};
