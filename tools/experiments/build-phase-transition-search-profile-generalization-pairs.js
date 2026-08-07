#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const E018Pairs = require("./build-phase-transition-search-profile-pairs.js");
const E019 = require("./lib/phase-transition-search-profile-generalization.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-generalization-v2.json",
    corpusRoot: "artifacts/phase-transition/search-profile-generalization-v2-fixture",
    analysisRoot: "artifacts/local/search-profile-generalization-v2-fixture",
    output: "artifacts/local/search-profile-generalization-v2-fixture/paired-game-endpoints.json",
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
  const games = JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  if (!Array.isArray(games)) throw new Error(`${filePath}: games must be a JSON array`);
  return games;
}

function pathsFor(corpusRoot, analysisRoot, conditionId) {
  return {
    games: path.resolve(corpusRoot, conditionId, "games.json"),
    candidates: path.resolve(analysisRoot, conditionId, "controls", "candidate-control-metrics.csv"),
  };
}

function buildStratumPairs(stratum, corpusRoot, analysisRoot, minimumPliesRemaining) {
  const p2Id = `${stratum.stratumId}-P2`;
  const lgId = `${stratum.stratumId}-LG`;
  const p2 = pathsFor(corpusRoot, analysisRoot, p2Id);
  const lg = pathsFor(corpusRoot, analysisRoot, lgId);
  const pairs = E018Pairs.buildPairs(
    readGames(p2.games),
    IO.readCsv(p2.candidates),
    readGames(lg.games),
    IO.readCsv(lg.candidates),
    minimumPliesRemaining,
  ).map((pair) => ({ ...pair, stratumId: stratum.stratumId, P2ConditionId: p2Id, LGConditionId: lgId }));
  return pairs;
}

function run(options) {
  const loaded = E019.loadPreregistration(options.config);
  const corpusRoot = path.resolve(options.corpusRoot);
  const analysisRoot = path.resolve(options.analysisRoot);
  const minimum = loaded.config.primaryPopulation.minimumPliesRemaining;
  const strata = {};
  const summaries = {};
  for (const stratum of loaded.config.corpus.strata) {
    const pairs = buildStratumPairs(stratum, corpusRoot, analysisRoot, minimum);
    strata[stratum.stratumId] = pairs;
    summaries[stratum.stratumId] = {
      pairCount: pairs.length,
      P2EventGames: pairs.filter((row) => row.P2).length,
      LGEventGames: pairs.filter((row) => row.LG).length,
      P2Only: pairs.filter((row) => row.P2 && !row.LG).length,
      LGOnly: pairs.filter((row) => !row.P2 && row.LG).length,
    };
  }
  const result = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    preregistrationConfigSha256: loaded.sha256,
    strata,
    summaries,
  };
  const output = path.resolve(options.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ experimentId: result.experimentId, analysisVersion: result.analysisVersion, summaries }, null, 2));
  return result;
}

if (require.main === module) {
  try { run(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { buildStratumPairs, parseArgs, pathsFor, readGames, run };
