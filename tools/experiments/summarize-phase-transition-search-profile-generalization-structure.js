#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const Structure = require("./summarize-phase-transition-search-profile-structure.js");
const E019 = require("./lib/phase-transition-search-profile-generalization.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-generalization-v2.json",
    corpusRoot: "artifacts/phase-transition/search-profile-generalization-v2-fixture",
    analysisRoot: "artifacts/local/search-profile-generalization-v2-fixture",
    output: "artifacts/local/search-profile-generalization-v2-fixture/structure",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--corpus-root") options.corpusRoot = value;
    else if (key === "--analysis-root") options.analysisRoot = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function readGames(filePath) {
  const value = JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  if (!Array.isArray(value)) throw new Error(`${filePath}: games must be an array`);
  return value;
}

function conditionInputs(corpusRoot, analysisRoot, conditionId) {
  return {
    games: path.resolve(corpusRoot, conditionId, "games.json"),
    candidates: path.resolve(analysisRoot, conditionId, "controls", "candidate-control-metrics.csv"),
    controls: path.resolve(analysisRoot, conditionId, "controls", "control-point-metrics.csv"),
  };
}

function auditCondition(inputs, minimumPliesRemaining) {
  return Structure.conditionAudit(
    readGames(inputs.games),
    IO.readCsv(inputs.candidates),
    IO.readCsv(inputs.controls),
    minimumPliesRemaining,
  );
}

function run(options) {
  const loaded = E019.loadPreregistration(options.config);
  const minimum = loaded.config.primaryPopulation.minimumPliesRemaining;
  const corpusRoot = path.resolve(options.corpusRoot);
  const analysisRoot = path.resolve(options.analysisRoot);
  const outputRoot = path.resolve(options.output);
  const strata = {};
  for (const stratum of loaded.config.corpus.strata) {
    const p2Id = `${stratum.stratumId}-P2`;
    const lgId = `${stratum.stratumId}-LG`;
    const p2Audit = auditCondition(conditionInputs(corpusRoot, analysisRoot, p2Id), minimum);
    const lgAudit = auditCondition(conditionInputs(corpusRoot, analysisRoot, lgId), minimum);
    const result = Structure.summarize(loaded.config, p2Audit, lgAudit);
    result.stratumId = stratum.stratumId;
    result.conditionIds = { P2: p2Id, LG: lgId };
    result.primaryDecisionChanged = false;
    result.primaryDecisionNote = "E-019 structural secondary is preregistered secondary only and may not replace, rescue, reverse, or override the paired game-level McNemar condition decision or global IUT decision.";
    const output = path.join(outputRoot, stratum.stratumId);
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, "search-profile-structural-secondary.json"), `${JSON.stringify(result, null, 2)}\n`);
    IO.writeCsv(path.join(output, `${p2Id}-candidate-duplicate-groups.csv`), p2Audit.duplicateGroups);
    IO.writeCsv(path.join(output, `${lgId}-candidate-duplicate-groups.csv`), lgAudit.duplicateGroups);
    IO.writeCsv(path.join(output, `${p2Id}-candidate-archetypes.csv`), p2Audit.archetypes);
    IO.writeCsv(path.join(output, `${lgId}-candidate-archetypes.csv`), lgAudit.archetypes);
    strata[stratum.stratumId] = result;
  }
  const summary = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    analysisType: "preregistered structural secondary",
    primaryDecisionChanged: false,
    strata,
  };
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.writeFileSync(path.join(outputRoot, "search-profile-generalization-structural-secondary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

if (require.main === module) {
  try { run(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { auditCondition, conditionInputs, parseArgs, readGames, run };
