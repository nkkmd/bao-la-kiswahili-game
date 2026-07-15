#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const target = args[0] || 'all';
const valueOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const suiteProfile = valueOf('profile', 'screening-2026-07');
const valid = new Set(['all', 'random-openings', 'game-start', 'suite']);
if (!valid.has(target)) {
  console.error('Usage: node tools/experiments/aggregate-first-player-research.js [all|random-openings|game-start|suite] [--profile screening-2026-07|full-2026-07]');
  process.exit(2);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  console.log(`[write] ${file}`);
}

function wilson(successes, total) {
  if (!total) return [0, 0];
  const z = 1.959963984540054;
  const p = successes / total;
  const denom = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denom;
  return [center - margin, center + margin];
}

function jsonFiles(dir, excluded = new Set()) {
  if (!fs.existsSync(dir)) throw new Error(`Missing directory: ${dir}`);
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.json') && !excluded.has(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function aggregateRandomOpenings() {
  const dir = 'artifacts/first-player-random-openings';
  const files = jsonFiles(dir, new Set(['summary.json']));
  if (files.length !== 24) throw new Error(`Expected 24 random-opening reports, found ${files.length}`);
  const groups = new Map();
  for (const name of files) {
    const report = readJson(path.join(dir, name));
    const key = `${report.config.openingPhase}-${report.config.openingPlies}`;
    const group = groups.get(key) || {
      phase: report.config.openingPhase,
      openingPlies: report.config.openingPlies,
      games: 0, southWins: 0, northWins: 0, draws: 0, totalTurns: 0,
    };
    group.games += report.games;
    group.southWins += report.southWins;
    group.northWins += report.northWins;
    group.draws += report.draws;
    group.totalTurns += report.averageTurns * report.games;
    groups.set(key, group);
  }
  const conditions = [...groups.values()].map((group) => {
    const decisive = group.southWins + group.northWins;
    return {
      phase: group.phase,
      openingPlies: group.openingPlies,
      games: group.games,
      southWins: group.southWins,
      northWins: group.northWins,
      draws: group.draws,
      southWinRate: group.southWins / group.games,
      southWinRateWilson95: wilson(group.southWins, decisive),
      averageTurns: group.totalTurns / group.games,
    };
  }).sort((a, b) => a.phase.localeCompare(b.phase) || a.openingPlies - b.openingPlies);
  if (conditions.some((item) => item.games !== 200)) throw new Error('Each random-opening condition must contain 200 games');
  writeJson(path.join(dir, 'summary.json'), {
    generatedAt: new Date().toISOString(),
    methodology: {
      phases: ['namua', 'mtaji'], openingPlies: [4, 8, 12], gamesPerCondition: 200,
      totalGames: 1200, pairedOpenings: true, ai: 'hard vs hard', profile: 'bao',
      search: 'phase2', maxDepth: 2, timeLimitMs: 0,
    },
    conditions,
  });
}

function aggregateGameStart() {
  const dir = 'artifacts/game-start-first-player';
  const files = jsonFiles(dir, new Set(['summary.json']));
  if (files.length !== 20) throw new Error(`Expected 20 game-start reports, found ${files.length}`);
  const groups = new Map();
  for (const name of files) {
    const report = readJson(path.join(dir, name));
    const plies = report.methodology.randomPlies;
    const group = groups.get(plies) || {
      randomPlies: plies, games: 0, southWins: 0, northWins: 0, draws: 0,
      totalTurns: 0, handoffSouth: 0, handoffNorth: 0, handoffPhases: {},
    };
    group.games += report.totals.games;
    group.southWins += report.totals.southWins;
    group.northWins += report.totals.northWins;
    group.draws += report.totals.draws;
    group.totalTurns += report.totals.averageTurns * report.totals.games;
    group.handoffSouth += report.totals.handoffPlayers.south;
    group.handoffNorth += report.totals.handoffPlayers.north;
    for (const [phase, count] of Object.entries(report.totals.handoffPhases)) {
      group.handoffPhases[phase] = (group.handoffPhases[phase] || 0) + count;
    }
    groups.set(plies, group);
  }
  const conditions = [...groups.values()].sort((a, b) => a.randomPlies - b.randomPlies).map((group) => {
    const decisive = group.southWins + group.northWins;
    return {
      randomPlies: group.randomPlies, games: group.games, southWins: group.southWins,
      northWins: group.northWins, draws: group.draws,
      southWinRateDecisive: decisive ? group.southWins / decisive : 0,
      southWinRateWilson95: wilson(group.southWins, decisive),
      averageTurns: group.totalTurns / group.games,
      handoffPlayers: { south: group.handoffSouth, north: group.handoffNorth },
      handoffPhases: group.handoffPhases,
    };
  });
  const totals = conditions.reduce((acc, item) => {
    acc.games += item.games; acc.southWins += item.southWins; acc.northWins += item.northWins; acc.draws += item.draws;
    return acc;
  }, { games: 0, southWins: 0, northWins: 0, draws: 0 });
  const decisive = totals.southWins + totals.northWins;
  writeJson(path.join(dir, 'summary.json'), {
    generatedAt: new Date().toISOString(),
    methodology: {
      totalGames: totals.games, conditions: [2, 4, 6, 8, 12], gamesPerCondition: 200,
      firstPlayer: 'South (player 0)', secondPlayer: 'North (player 1)',
      randomOpeningPolicy: 'uniform over legal move variants from the standard initial position',
      continuationAI: 'hard / bao / phase2 / depth 2',
    },
    totals: { ...totals, southWinRateDecisive: decisive ? totals.southWins / decisive : 0, southWinRateWilson95: wilson(totals.southWins, decisive) },
    conditions,
  });
}

function aggregateSuite() {
  const profiles = {
    'screening-2026-07': { gamesPerCondition: 40, totalGames: 440 },
    'full-2026-07': { gamesPerCondition: 200, totalGames: 2200 },
  };
  const expected = profiles[suiteProfile];
  if (!expected) throw new Error(`Unknown suite profile: ${suiteProfile}`);
  const expectedConditionNames = new Set([
    'depth-1', 'depth-2', 'depth-3', 'depth-4',
    'policy-uniform', 'policy-top3', 'policy-softmax',
    'eval-legacy', 'eval-bao', 'eval-bao-v2', 'eval-mcts',
  ]);
  const dir = `artifacts/first-player-suite/${suiteProfile}`;
  const files = jsonFiles(dir, new Set(['progress.json', 'symmetry.json', 'summary.json']));
  if (files.length !== 44) throw new Error(`Expected 44 suite reports, found ${files.length}`);
  const groups = new Map();
  for (const name of files) {
    const nameMatch = name.match(/^(.*)-batch-(\d+)\.json$/);
    if (!nameMatch) throw new Error(`Unexpected suite report name: ${name}`);
    const conditionName = nameMatch[1];
    const batch = Number(nameMatch[2]);
    if (!expectedConditionNames.has(conditionName) || batch < 1 || batch > 4) {
      throw new Error(`Unexpected suite report name: ${name}`);
    }
    const report = readJson(path.join(dir, name));
    const c = report.config;
    const expectedGamesPerBatch = expected.gamesPerCondition / 4;
    if (report.status !== 'complete' || report.totals.games !== expectedGamesPerBatch || report.games?.length !== expectedGamesPerBatch) {
      throw new Error(`Incomplete or invalid suite report: ${name}`);
    }
    if (c.conditionName !== conditionName) {
      throw new Error(`Suite condition mismatch in ${name}: ${c.conditionName || '(missing)'}`);
    }
    if (c.experimentProfile !== suiteProfile) {
      throw new Error(`Suite profile mismatch in ${name}: ${c.experimentProfile || '(missing)'}`);
    }
    const configSignature = JSON.stringify({
      maxDepth: c.maxDepth,
      maxTurns: c.maxTurns,
      openingPolicy: c.openingPolicy,
      evaluationProfile: c.evaluationProfile,
      searchProfile: c.searchProfile,
      randomPlies: c.randomPlies,
      mctsIterations: c.mctsIterations,
      mctsPlayoutTurns: c.mctsPlayoutTurns,
    });
    const group = groups.get(conditionName) || {
      name: conditionName, config: c, configSignature, games: 0, southWins: 0, northWins: 0, draws: 0, turns: 0, firstMoves: {}, batches: 0,
    };
    if (group.configSignature !== configSignature) throw new Error(`Suite config mismatch within ${conditionName}`);
    group.batches += 1;
    group.games += report.totals.games;
    group.southWins += report.totals.southWins;
    group.northWins += report.totals.northWins;
    group.draws += report.totals.draws;
    group.turns += report.totals.averageTurns * report.totals.games;
    for (const item of report.firstMoves) {
      group.firstMoves[item.move] ||= { games: 0, southWins: 0, northWins: 0, draws: 0 };
      for (const field of ['games', 'southWins', 'northWins', 'draws']) group.firstMoves[item.move][field] += item[field];
    }
    groups.set(conditionName, group);
  }
  const symmetryFile = path.join(dir, 'symmetry.json');
  if (!fs.existsSync(symmetryFile)) throw new Error('Missing symmetry.json');
  const conditions = [...groups.values()].map((group) => {
    const decisive = group.southWins + group.northWins;
    return {
      name: group.name,
      config: {
        maxDepth: group.config.maxDepth, maxTurns: group.config.maxTurns, openingPolicy: group.config.openingPolicy,
        evaluationProfile: group.config.evaluationProfile, searchProfile: group.config.searchProfile,
        randomPlies: group.config.randomPlies, mctsIterations: group.config.mctsIterations,
        mctsPlayoutTurns: group.config.mctsPlayoutTurns,
      },
      batches: group.batches, games: group.games, southWins: group.southWins,
      northWins: group.northWins, draws: group.draws,
      southWinRate: decisive ? group.southWins / decisive : 0,
      averageTurns: group.turns / group.games,
      firstMoves: Object.entries(group.firstMoves).map(([move, value]) => ({
        move, ...value, southWinRate: value.southWins / Math.max(1, value.southWins + value.northWins),
      })).sort((a, b) => b.games - a.games),
    };
  });
  const summary = {
    generatedAt: new Date().toISOString(),
    profile: suiteProfile,
    totalBatchReports: files.length,
    totalGames: conditions.reduce((sum, item) => sum + item.games, 0),
    conditions,
    symmetry: readJson(symmetryFile).summary,
  };
  if (conditions.length !== 11) throw new Error(`Expected 11 suite conditions, found ${conditions.length}`);
  if (conditions.some((item) => item.batches !== 4 || item.games !== expected.gamesPerCondition)) {
    throw new Error(`Each suite condition must contain 4 batches and ${expected.gamesPerCondition} games`);
  }
  if (summary.totalGames !== expected.totalGames) throw new Error(`Expected ${expected.totalGames} suite games, found ${summary.totalGames}`);
  writeJson(path.join(dir, 'summary.json'), summary);
}

try {
  if (target === 'all' || target === 'random-openings') aggregateRandomOpenings();
  if (target === 'all' || target === 'game-start') aggregateGameStart();
  if (target === 'all' || target === 'suite') aggregateSuite();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
