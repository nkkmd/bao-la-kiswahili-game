#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const E018 = require("./lib/phase-transition-search-profile-dependence.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-search-profile-dependence-v1.json",
    p2Games: null,
    p2Candidates: null,
    lgGames: null,
    lgCandidates: null,
    output: "artifacts/phase-transition/search-profile-dependence-v1-fixture/paired-game-endpoints.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--p2-games") options.p2Games = value;
    else if (key === "--p2-candidates") options.p2Candidates = value;
    else if (key === "--lg-games") options.lgGames = value;
    else if (key === "--lg-candidates") options.lgCandidates = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  for (const key of ["p2Games", "p2Candidates", "lgGames", "lgCandidates"]) {
    if (!options[key]) throw new Error(`--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)} is required`);
  }
  return options;
}

function readGames(filePath) {
  const games = JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  if (!Array.isArray(games)) throw new Error(`${filePath}: games must be a JSON array`);
  return games;
}

function eligibleCandidate(row, minimumPliesRemaining) {
  const distance = Number(row.distanceToTerminal);
  return Number.isFinite(distance) && distance >= minimumPliesRemaining;
}

function endpointsBySeed(games, candidates, minimumPliesRemaining, conditionId) {
  const candidatesByGame = new Map();
  for (const row of candidates) {
    if (!eligibleCandidate(row, minimumPliesRemaining)) continue;
    const rows = candidatesByGame.get(row.gameId) || [];
    rows.push(row);
    candidatesByGame.set(row.gameId, rows);
  }

  const bySeed = new Map();
  for (const game of games) {
    const seed = Number(game.seed);
    const gameIndex = Number(game.gameIndex);
    if (!Number.isInteger(seed) || !Number.isInteger(gameIndex)) {
      throw new Error(`${conditionId}: each game requires integer seed and gameIndex`);
    }
    if (bySeed.has(seed)) throw new Error(`${conditionId}: duplicate seed ${seed}`);
    const rows = candidatesByGame.get(game.gameId) || [];
    const expansionRows = rows.filter((row) => row.classification === "capture-branch-expansion");
    bySeed.set(seed, {
      conditionId,
      seed,
      gameIndex,
      gameId: game.gameId,
      eligibleCandidateCount: rows.length,
      expansionCandidateCount: expansionRows.length,
      endpoint: expansionRows.length > 0,
    });
  }
  return bySeed;
}

function buildPairs(p2Games, p2Candidates, lgGames, lgCandidates, minimumPliesRemaining) {
  const p2 = endpointsBySeed(p2Games, p2Candidates, minimumPliesRemaining, "P2");
  const lg = endpointsBySeed(lgGames, lgCandidates, minimumPliesRemaining, "LG");
  const p2Seeds = [...p2.keys()].sort((a, b) => a - b);
  const lgSeeds = [...lg.keys()].sort((a, b) => a - b);
  if (E018.canonicalJson(p2Seeds) !== E018.canonicalJson(lgSeeds)) {
    throw new Error("P2 and LG game seed sets differ");
  }
  return p2Seeds.map((seed) => {
    const left = p2.get(seed);
    const right = lg.get(seed);
    if (left.gameIndex !== right.gameIndex) {
      throw new Error(`Paired gameIndex mismatch for seed ${seed}`);
    }
    return {
      seed,
      gameIndex: left.gameIndex,
      P2: left.endpoint,
      LG: right.endpoint,
      P2GameId: left.gameId,
      LGGameId: right.gameId,
      P2EligibleCandidateCount: left.eligibleCandidateCount,
      LGEligibleCandidateCount: right.eligibleCandidateCount,
      P2ExpansionCandidateCount: left.expansionCandidateCount,
      LGExpansionCandidateCount: right.expansionCandidateCount,
    };
  });
}

function run(options) {
  const loaded = E018.loadPreregistration(options.config);
  const minimum = loaded.config.primaryPopulation.minimumPliesRemaining;
  const pairs = buildPairs(
    readGames(options.p2Games),
    IO.readCsv(path.resolve(options.p2Candidates)),
    readGames(options.lgGames),
    IO.readCsv(path.resolve(options.lgCandidates)),
    minimum,
  );
  const output = path.resolve(options.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(pairs, null, 2)}\n`);
  const summary = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    pairCount: pairs.length,
    P2EventGames: pairs.filter((row) => row.P2).length,
    LGEventGames: pairs.filter((row) => row.LG).length,
    P2Only: pairs.filter((row) => row.P2 && !row.LG).length,
    LGOnly: pairs.filter((row) => !row.P2 && row.LG).length,
  };
  console.log(JSON.stringify(summary, null, 2));
  return { pairs, summary };
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
  buildPairs,
  eligibleCandidate,
  endpointsBySeed,
  parseArgs,
  run,
};
