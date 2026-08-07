#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const TrajectoryAudit = require("./analyze-confirmation-trajectory-duplication.js");
const Evaluator = require("./evaluate-phase-transition-d3-reversal-replication.js");
const E020 = require("./lib/phase-transition-d3-reversal-replication.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-d3-reversal-replication-v1.json",
    p2Games: null,
    p2Candidates: null,
    p2Controls: null,
    lgGames: null,
    lgCandidates: null,
    lgControls: null,
    output: "artifacts/local/phase-transition-d3-reversal-replication-v1/structure",
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
  for (const key of ["p2Games", "p2Candidates", "p2Controls", "lgGames", "lgCandidates", "lgControls"]) {
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

function mean(values) {
  const finite = values.map(Number).filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : null;
}

function mechanismBridge(candidates, minimumPliesRemaining) {
  const eligible = candidates.filter((row) => Number(row.distanceToTerminal) >= minimumPliesRemaining);
  const expansion = eligible.filter((row) => row.classification === "capture-branch-expansion");
  return {
    eligibleCandidateRows: eligible.length,
    expansionCandidateRows: expansion.length,
    candidateToExpansionManifestationRate: eligible.length ? expansion.length / eligible.length : null,
    meanForcedCaptureRegimeLength: mean(eligible.map((row) => row.regimeLength)),
    meanPositionInRegime: mean(eligible.map((row) => row.positionInRegime)),
    meanNormalizedPositionInRegime: mean(eligible.map((row) => row.normalizedPositionInRegime)),
    terminalDistance: {
      min: eligible.length ? Math.min(...eligible.map((row) => Number(row.distanceToTerminal)).filter(Number.isFinite)) : null,
      mean: mean(eligible.map((row) => row.distanceToTerminal)),
    },
  };
}

function summarize(config, p2Audit, lgAudit, p2Candidates, lgCandidates) {
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
    hypothesisId: config.hypothesisId,
    analysisVersion: config.analysisVersion,
    analysisType: "preregistered structural and mechanism-bridge secondary",
    primaryDecisionChanged: false,
    primaryDecisionNote: "Secondary structure/mechanism outputs may not replace, rescue, reverse, or override the paired game-level exact McNemar primary endpoint.",
    conditions: {
      P2: {
        rawEndpoint: p2.rawEndpoint,
        trajectoryPlyDeduplicatedEndpoint: p2Dedup,
        candidateStructure: p2.candidateStructure,
        mechanismBridge: mechanismBridge(p2Candidates, config.primaryPopulation.minimumPliesRemaining),
      },
      LG: {
        rawEndpoint: lg.rawEndpoint,
        trajectoryPlyDeduplicatedEndpoint: lgDedup,
        candidateStructure: lg.candidateStructure,
        mechanismBridge: mechanismBridge(lgCandidates, config.primaryPopulation.minimumPliesRemaining),
      },
    },
    directCandidateTrajectoryPlyComparison: direct,
  };
}

function run(options) {
  const loaded = E020.loadPreregistration(options.config);
  const minimum = loaded.config.primaryPopulation.minimumPliesRemaining;
  const p2Candidates = IO.readCsv(path.resolve(options.p2Candidates));
  const p2Controls = IO.readCsv(path.resolve(options.p2Controls));
  const lgCandidates = IO.readCsv(path.resolve(options.lgCandidates));
  const lgControls = IO.readCsv(path.resolve(options.lgControls));
  const p2Audit = conditionAudit(readGames(options.p2Games), p2Candidates, p2Controls, minimum);
  const lgAudit = conditionAudit(readGames(options.lgGames), lgCandidates, lgControls, minimum);
  const result = summarize(loaded.config, p2Audit, lgAudit, p2Candidates, lgCandidates);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "d3-reversal-structural-secondary.json"), `${JSON.stringify(result, null, 2)}\n`);
  IO.writeCsv(path.join(output, "P2-candidate-duplicate-groups.csv"), p2Audit.duplicateGroups);
  IO.writeCsv(path.join(output, "LG-candidate-duplicate-groups.csv"), lgAudit.duplicateGroups);
  IO.writeCsv(path.join(output, "P2-candidate-archetypes.csv"), p2Audit.archetypes);
  IO.writeCsv(path.join(output, "LG-candidate-archetypes.csv"), lgAudit.archetypes);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (require.main === module) {
  try { run(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { conditionAudit, mechanismBridge, parseArgs, run, summarize };
