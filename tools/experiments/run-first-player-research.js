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
const force = has('force');
const dryRun = has('dry-run');

const validStudies = new Set(['all', 'diagnostics', 'random-openings', 'game-start', 'suite']);
if (!validStudies.has(study)) {
  console.error(`Unknown --study value: ${study}`);
  process.exit(2);
}

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function runNode(script, scriptArgs, output) {
  if (output && fs.existsSync(output) && !force) {
    console.log(`[skip] ${output}`);
    return;
  }
  if (output) ensureParent(output);
  const command = ['node', script, ...scriptArgs];
  console.log(`[run] ${command.join(' ')}`);
  if (dryRun) return;
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${script} exited with status ${result.status}`);
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

function runSuite() {
  suiteConditions.forEach((condition, conditionIndex) => {
    if (only && condition.name !== only) return;
    for (const batch of [1, 2, 3, 4]) {
      const jobIndex = conditionIndex * 4 + (batch - 1);
      const seed = 20260714 + batch * 1009 + jobIndex * 7919;
      const output = `artifacts/first-player-suite/${condition.name}-batch-${batch}.json`;
      runNode('tools/first-player-experiment-suite.js', [
        '--games', '50', '--seed', String(seed), '--random-plies', '8',
        '--max-depth', String(condition.depth), '--opening-policy', condition.policy,
        '--evaluation-profile', condition.profile, '--search-profile', condition.search,
        '--mcts-iterations', '400', '--mcts-playout-turns', '80', '--max-turns', '300',
        '--output', output,
      ], output);
    }
  });
  if (!only) {
    const symmetryOutput = 'artifacts/first-player-suite/symmetry.json';
    runNode('tools/first-player-symmetry-audit.js', [symmetryOutput], symmetryOutput);
  }
}

try {
  if (study === 'all' || study === 'diagnostics') runDiagnostics();
  if (study === 'all' || study === 'random-openings') runRandomOpenings();
  if (study === 'all' || study === 'game-start') runGameStart();
  if (study === 'all' || study === 'suite') runSuite();
  console.log('Local research run completed.');
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
