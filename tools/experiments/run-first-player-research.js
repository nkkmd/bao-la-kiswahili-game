#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const valueOf = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const has = (name) => args.includes(`--${name}`);

const study = valueOf('study', 'all');
const only = valueOf('only', null);
const suiteProfile = valueOf('suite-profile', 'screening');
const force = has('force');
const dryRun = has('dry-run');
const statusOnly = has('status');

const validStudies = new Set(['all', 'diagnostics', 'random-openings', 'game-start', 'suite']);
if (!validStudies.has(study)) {
  console.error(`Unknown --study value: ${study}`);
  process.exit(2);
}
if (!['screening', 'full'].includes(suiteProfile)) {
  console.error(`Unknown --suite-profile value: ${suiteProfile}`);
  process.exit(2);
}

function atomicWriteJson(file, value) {
  ensureParent(file);
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, file);
}

function partialPath(output) {
  return output.endsWith('.json') ? `${output.slice(0, -5)}.partial.json` : `${output}.partial.json`;
}

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function runNode(script, scriptArgs, output) {
  if (output && fs.existsSync(output) && !force) {
    console.log(`[skip] ${output}`);
    return 'skipped';
  }
  if (output) ensureParent(output);
  if (output && force) {
    if (fs.existsSync(output)) fs.unlinkSync(output);
    const partial = partialPath(output);
    if (fs.existsSync(partial)) fs.unlinkSync(partial);
  }
  const command = ['node', script, ...scriptArgs];
  console.log(`[run] ${command.join(' ')}`);
  if (dryRun) return 'dry-run';
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${script} exited with status ${result.status}`);
  return 'completed';
}

function runDiagnostics() {
  const output = 'artifacts/first-player-study/diagnostics.json';
  runNode('tools/first-player-diagnostics.js', [output], output);
}

function runRandomOpenings() {
  for (const phase of ['namua', 'mtaji']) {
    for (const plies of [4, 8, 12]) {
      for (const batch of [1, 2, 3, 4]) {
        const phaseOffset = phase === 'mtaji' ? 500000 : 0;
        const seed = 20270000 + phaseOffset + plies * 1000 + batch * 50;
        const output = `artifacts/first-player-random-openings/${phase}-${plies}-batch-${batch}.json`;
        runNode('tools/benchmark.js', [
          '--games', '50', '--seed', String(seed), '--first', 'hard', '--second', 'hard',
          '--first-profile', 'bao', '--second-profile', 'bao',
          '--first-search', 'phase2', '--second-search', 'phase2', '--time-limit', '0',
          '--max-depth', '2', '--max-turns', '300', '--opening-plies', String(plies),
          '--opening-phase', phase, '--output', output,
        ], output);
      }
    }
  }
}

function runGameStart() {
  const seedBases = new Map([
    [2, 20262000], [4, 20264000], [6, 20266000], [8, 20268000], [12, 20261200],
  ]);
  for (const plies of [2, 4, 6, 8, 12]) {
    for (const batch of [1, 2, 3, 4]) {
      const seed = seedBases.get(plies) + batch;
      const output = `artifacts/game-start-first-player/random-${plies}-batch-${batch}.json`;
      runNode('tools/game-start-first-player-study.js', [
        '--games', '50', '--seed', String(seed), '--random-plies', String(plies),
        '--max-depth', '2', '--max-turns', '300', '--output', output,
      ], output);
    }
  }
}

const suiteConditions = [
  { name: 'depth-1', depth: 1, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'depth-2', depth: 2, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'depth-3', depth: 3, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'depth-4', depth: 4, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'policy-uniform', depth: 2, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'policy-top3', depth: 2, policy: 'top3', profile: 'bao', search: 'phase2' },
  { name: 'policy-softmax', depth: 2, policy: 'softmax', profile: 'bao', search: 'phase2' },
  { name: 'eval-legacy', depth: 2, policy: 'uniform', profile: 'legacy', search: 'phase2' },
  { name: 'eval-bao', depth: 2, policy: 'uniform', profile: 'bao', search: 'phase2' },
  { name: 'eval-bao-v2', depth: 2, policy: 'uniform', profile: 'bao-v2', search: 'phase2' },
  { name: 'eval-mcts', depth: 2, policy: 'uniform', profile: 'bao', search: 'mcts' },
];

const suiteProfiles = {
  screening: {
    name: 'screening-2026-07',
    gamesPerBatch: 10,
    batches: 4,
    maxTurns: 120,
    mctsIterations: 12,
    mctsPlayoutTurns: 16,
    estimatedMinutes: [80, 150],
  },
  full: {
    name: 'full-2026-07',
    gamesPerBatch: 50,
    batches: 4,
    maxTurns: 300,
    mctsIterations: 400,
    mctsPlayoutTurns: 80,
    estimatedMinutes: [3000, 7200],
  },
};

function readProgress(file, profile) {
  if (!fs.existsSync(file)) return null;
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  return value.profile === profile.name ? value : null;
}

function countSuiteProgress(profile, suiteDir) {
  let completedBatches = 0;
  let completedGames = 0;
  let checkpointedGames = 0;
  const completedReports = [];
  for (const condition of suiteConditions) {
    for (let batch = 1; batch <= profile.batches; batch += 1) {
      const output = `${suiteDir}/${condition.name}-batch-${batch}.json`;
      if (fs.existsSync(output)) {
        const report = JSON.parse(fs.readFileSync(output, 'utf8'));
        completedBatches += 1;
        completedGames += report.totals.games;
        completedReports.push({
          condition: condition.name,
          batch,
          file: output,
          generatedAt: report.generatedAt,
          games: report.totals.games,
          southWins: report.totals.southWins,
          northWins: report.totals.northWins,
          draws: report.totals.draws,
        });
      } else {
        const partial = partialPath(output);
        if (fs.existsSync(partial)) {
          const checkpoint = JSON.parse(fs.readFileSync(partial, 'utf8'));
          checkpointedGames += checkpoint.completedGames || 0;
        }
      }
    }
  }
  return { completedBatches, completedGames, checkpointedGames, recordedGames: completedGames + checkpointedGames, completedReports };
}

function writeSuiteProgress(profile, suiteDir, current = null, status = 'running') {
  if (dryRun) return;
  const file = `${suiteDir}/progress.json`;
  const previous = readProgress(file, profile);
  const counts = countSuiteProgress(profile, suiteDir);
  atomicWriteJson(file, {
    profile: profile.name,
    status,
    startedAt: previous?.startedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expected: {
      conditions: suiteConditions.length,
      batchesPerCondition: profile.batches,
      gamesPerBatch: profile.gamesPerBatch,
      totalBatches: suiteConditions.length * profile.batches,
      totalGames: suiteConditions.length * profile.batches * profile.gamesPerBatch,
      estimatedMinutes: profile.estimatedMinutes,
    },
    ...counts,
    current,
  });
}

function showSuiteStatus() {
  const profile = suiteProfiles[suiteProfile];
  const suiteDir = `artifacts/first-player-suite/${profile.name}`;
  const file = `${suiteDir}/progress.json`;
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ profile: profile.name, status: 'not-started' }, null, 2));
    return;
  }
  const progress = JSON.parse(fs.readFileSync(file, 'utf8'));
  const liveCounts = countSuiteProgress(profile, suiteDir);
  let currentCheckpoint = null;
  if (progress.current?.output) {
    const partial = partialPath(progress.current.output);
    if (fs.existsSync(partial)) {
      const checkpoint = JSON.parse(fs.readFileSync(partial, 'utf8'));
      currentCheckpoint = {
        file: partial,
        completedGames: checkpoint.completedGames,
        totals: checkpoint.totals,
        updatedAt: checkpoint.updatedAt,
      };
    }
  }
  console.log(JSON.stringify({ ...progress, ...liveCounts, currentCheckpoint }, null, 2));
}

function resetSuiteOutputs(profile, suiteDir) {
  if (!force) return;
  for (const condition of suiteConditions) {
    if (only && condition.name !== only) continue;
    for (let batch = 1; batch <= profile.batches; batch += 1) {
      const output = `${suiteDir}/${condition.name}-batch-${batch}.json`;
      for (const file of [output, partialPath(output)]) {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      }
    }
  }
  for (const name of ['summary.json', 'progress.json']) {
    const file = `${suiteDir}/${name}`;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  if (!only) {
    const symmetry = `${suiteDir}/symmetry.json`;
    if (fs.existsSync(symmetry)) fs.unlinkSync(symmetry);
  }
}

function runSuite() {
  const profile = suiteProfiles[suiteProfile];
  const suiteDir = `artifacts/first-player-suite/${profile.name}`;
  resetSuiteOutputs(profile, suiteDir);
  writeSuiteProgress(profile, suiteDir);
  suiteConditions.forEach((condition, conditionIndex) => {
    if (only && condition.name !== only) return;
    for (let batch = 1; batch <= profile.batches; batch += 1) {
      const jobIndex = conditionIndex * 4 + (batch - 1);
      const seed = 20260714 + batch * 1009 + jobIndex * 7919;
      const output = `${suiteDir}/${condition.name}-batch-${batch}.json`;
      writeSuiteProgress(profile, suiteDir, { condition: condition.name, batch, output });
      runNode('tools/first-player-experiment-suite.js', [
        '--condition-name', condition.name, '--experiment-profile', profile.name,
        '--games', String(profile.gamesPerBatch), '--seed', String(seed), '--random-plies', '8',
        '--max-depth', String(condition.depth), '--opening-policy', condition.policy,
        '--evaluation-profile', condition.profile, '--search-profile', condition.search,
        '--mcts-iterations', String(profile.mctsIterations),
        '--mcts-playout-turns', String(profile.mctsPlayoutTurns), '--max-turns', String(profile.maxTurns),
        '--checkpoint-every', '1', '--progress-every', '1',
        '--output', output,
      ], output);
      writeSuiteProgress(profile, suiteDir, { condition: condition.name, batch, output });
    }
  });
  if (!only) {
    const symmetryOutput = `${suiteDir}/symmetry.json`;
    runNode('tools/first-player-symmetry-audit.js', [symmetryOutput], symmetryOutput);
    const summaryOutput = `${suiteDir}/summary.json`;
    runNode('tools/experiments/aggregate-first-player-research.js', ['suite', '--profile', profile.name], summaryOutput);
    writeSuiteProgress(profile, suiteDir, null, 'complete');
  } else {
    writeSuiteProgress(profile, suiteDir, null, 'partial');
  }
}

try {
  if (statusOnly) {
    showSuiteStatus();
  } else {
    if (study === 'all' || study === 'diagnostics') runDiagnostics();
    if (study === 'all' || study === 'random-openings') runRandomOpenings();
    if (study === 'all' || study === 'game-start') runGameStart();
    if (study === 'all' || study === 'suite') runSuite();
    console.log('Local research run completed.');
  }
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
