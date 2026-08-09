#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { hashValue } = require("./lib/position-typology-features.js");
const { gameFiles } = require("./verify-position-typology-stage1-pilot.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/position-typology/stage1-pilot-v1",
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.output ||= path.join(options.input, "pilot-audit.json");
  return options;
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function increment(object, key, amount = 1) {
  object[key] = (object[key] || 0) + amount;
}

function numericSummary(values) {
  if (!values.length) return { count: 0, min: null, max: null, mean: null };
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean: total / values.length,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifestPath = path.join(input, "manifest.json");
  const verificationPath = path.join(input, "verification.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing manifest: ${manifestPath}`);
  if (!fs.existsSync(verificationPath)) throw new Error(`Missing verification: ${verificationPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const verification = JSON.parse(fs.readFileSync(verificationPath, "utf8"));
  if (!verification.passed || verification.configHash !== manifest.configHash) {
    throw new Error("Stage 1 pilot verification must pass before audit");
  }
  const files = gameFiles(input);
  const games = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const minimumPly = manifest.config.populationPolicy.primaryDiscoveryMinimumPly;

  const eligible = [];
  const ruleOccurrences = new Map();
  const canonicalOccurrences = new Map();
  const perGameEligibleCounts = [];
  const perGamePhaseCounts = { namua: [], mtaji: [] };
  const phaseCounts = {};
  const conditionCounts = {};
  const phaseConditionCounts = {};
  let terminalGames = 0;
  let maxPlyTruncatedGames = 0;

  for (const game of games) {
    const last = game.observations.at(-1);
    if (last?.terminal) terminalGames += 1;
    else if (game.moves.length >= manifest.config.maxPly) maxPlyTruncatedGames += 1;
    let gameEligible = 0;
    const localPhaseCounts = { namua: 0, mtaji: 0 };
    for (const observation of game.observations) {
      if (observation.terminal || observation.ply < minimumPly) continue;
      eligible.push({ game, observation });
      gameEligible += 1;
      increment(localPhaseCounts, observation.phase);
      increment(phaseCounts, observation.phase);
      increment(conditionCounts, game.conditionId);
      phaseConditionCounts[observation.phase] ||= {};
      increment(phaseConditionCounts[observation.phase], game.conditionId);

      const ruleKey = observation.identity.ruleStateKey;
      const canonicalKey = observation.identity.seatCanonicalKey;
      if (!ruleOccurrences.has(ruleKey)) {
        ruleOccurrences.set(ruleKey, { count: 0, games: new Set(), phase: observation.phase });
      }
      const rule = ruleOccurrences.get(ruleKey);
      rule.count += 1;
      rule.games.add(game.gameId);
      if (!canonicalOccurrences.has(canonicalKey)) {
        canonicalOccurrences.set(canonicalKey, { count: 0, games: new Set() });
      }
      const canonical = canonicalOccurrences.get(canonicalKey);
      canonical.count += 1;
      canonical.games.add(game.gameId);
    }
    perGameEligibleCounts.push(gameEligible);
    perGamePhaseCounts.namua.push(localPhaseCounts.namua);
    perGamePhaseCounts.mtaji.push(localPhaseCounts.mtaji);
  }

  const ruleKeysByPhase = { namua: new Set(), mtaji: new Set() };
  for (const { observation } of eligible) {
    ruleKeysByPhase[observation.phase].add(observation.identity.ruleStateKey);
  }
  const duplicateSlotsByPhase = Object.fromEntries(Object.entries(phaseCounts).map(([phase, count]) => [
    phase,
    count - ruleKeysByPhase[phase].size,
  ]));
  const sharedAcrossTrajectories = [...ruleOccurrences.values()].filter((item) => item.games.size > 1);
  const repeatedRuleStates = [...ruleOccurrences.values()].filter((item) => item.count > 1);
  const largestRuleOccurrence = ruleOccurrences.size
    ? Math.max(...[...ruleOccurrences.values()].map((item) => item.count))
    : 0;

  const audit = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    passed: true,
    input,
    configHash: manifest.configHash,
    verificationPassed: true,
    populationDefinition: {
      terminalExcluded: true,
      minimumPly,
      phaseSeparatedPrimaryView: true,
      primaryDedupKey: "ruleStateKey",
      seatCanonicalDedup: "sensitivity",
    },
    games: {
      total: games.length,
      terminal: terminalGames,
      maxPlyTruncated: maxPlyTruncatedGames,
      plies: numericSummary(games.map((game) => game.plies)),
      eligiblePositionsPerGame: numericSummary(perGameEligibleCounts),
      eligiblePositionsPerGameByPhase: {
        namua: numericSummary(perGamePhaseCounts.namua),
        mtaji: numericSummary(perGamePhaseCounts.mtaji),
      },
    },
    eligiblePopulation: {
      rawPositions: eligible.length,
      phaseCounts,
      conditionCounts,
      phaseConditionCounts,
      uniqueRuleState: ruleOccurrences.size,
      duplicateRuleStateSlots: eligible.length - ruleOccurrences.size,
      duplicateRuleStateSlotsByPhase: duplicateSlotsByPhase,
      repeatedRuleStateKeys: repeatedRuleStates.length,
      ruleStatesSharedAcrossTrajectories: sharedAcrossTrajectories.length,
      largestRuleStateOccurrence: largestRuleOccurrence,
      uniqueSeatCanonical: canonicalOccurrences.size,
      seatCanonicalCollapse: ruleOccurrences.size - canonicalOccurrences.size,
    },
    rawCorpusSummaryHash: manifest.summaryHash,
  };
  audit.auditHash = hashValue(audit);
  atomicWriteJson(path.resolve(options.output), audit);
  console.log(JSON.stringify(audit, null, 2));
}

if (require.main === module) main();
module.exports = { numericSummary, parseArgs };
