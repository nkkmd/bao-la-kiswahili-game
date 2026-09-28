'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { instrumentEngine } = require('./lib/pbai-p14-instrument.cjs');

const ROOT = path.resolve(__dirname, '../..');
const BASELINE_COMMIT = '22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b';
const SEED_FIRST = 2026092801;
const SEED_COUNT = 64;
const SEEDS_PER_SHARD = 8;
const MAX_PREFIX_PLY = 128;
const FIXED_DEPTH = 4;

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}
function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 1831565813) >>> 0;
    let z = Math.imul(value ^ (value >>> 15), value | 1);
    z = (z ^ (z + Math.imul(z ^ (z >>> 7), z | 61))) >>> 0;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}
function readPublic(name) {
  return fs.readFileSync(path.join(ROOT, 'public', name), 'utf8');
}
function load(instrument = false) {
  const context = vm.createContext({
    performance,
    __pbaiP14Diagnostics: instrument ? {
      applyMoveCalls: 0,
      namuaCaptureVariantInputs: 0,
      collapsedStopUsePairs: 0,
      splitStopUsePairs: 0,
    } : null,
  });
  context.self = context;
  const scripts = ['engine.js', 'ai-weights.js', 'ai.js', 'ai-config.js',
    'logic-evaluator.js', 'ai-candidate.js', 'ai-release.js'];
  for (const name of scripts) {
    const source = readPublic(name);
    vm.runInContext(name === 'engine.js' && instrument ? instrumentEngine(source) : source,
      context, { filename: name });
  }
  return context;
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function sampleStates(engine, seed) {
  const random = rng(seed);
  let state = engine.initialState();
  let namua = null;
  let mtaji = null;
  for (let ply = 0; ply < MAX_PREFIX_PLY && state.winner === null; ply += 1) {
    const variants = engine.moveVariants(state);
    if (!namua && state.phase === 'namua' && ply >= 12) {
      namua = { seed, ply, phase: state.phase, state: clone(state) };
    }
    if (!mtaji && state.phase === 'mtaji' && variants.length >= 2) {
      mtaji = { seed, ply, phase: state.phase, state: clone(state) };
    }
    if (namua && mtaji) break;
    if (!variants.length) break;
    state = engine.applyMove(state, variants[Math.floor(random() * variants.length)]).state;
  }
  return [namua, mtaji].filter(Boolean);
}
function stableResult(result) {
  const { elapsedMs, ...stats } = result.stats;
  return { move: result.move, stats };
}
function analyze(context, sample, seed) {
  const level = 'expert';
  const options = {
    ...context.BaoReleaseConfig.searchOptions(level,
      { hardwareConcurrency: 4, deviceMemory: 4 }, sample.state),
    maxDepth: FIXED_DEPTH,
    timeLimitMs: Infinity,
    stableBestDepths: 0,
    aspirationWindow: 0,
  };
  return context.BaoReleaseAI.analyzeMove(sample.state, level,
    rng(seed ^ (sample.ply << 8)), options);
}
function main() {
  const shard = Number(process.argv[2]);
  const output = process.argv[3];
  assert.ok(Number.isInteger(shard) && shard >= 0 && shard < SEED_COUNT / SEEDS_PER_SHARD,
    'shard must be an integer from 0 to 7');
  assert.ok(output, 'output path is required');

  const startSeed = SEED_FIRST + shard * SEEDS_PER_SHARD;
  const endSeed = startSeed + SEEDS_PER_SHARD - 1;
  const baseline = load(false);
  const measured = load(true);
  const rows = [];
  for (let seed = startSeed; seed <= endSeed; seed += 1) {
    const samples = sampleStates(baseline.BaoEngine, seed);
    for (const sample of samples) {
      const a = analyze(baseline, sample, seed);
      const before = { ...measured.__pbaiP14Diagnostics };
      const b = analyze(measured, sample, seed);
      const after = measured.__pbaiP14Diagnostics;
      rows.push({
        seed, ply: sample.ply, phase: sample.phase,
        legalVariants: baseline.BaoEngine.moveVariants(sample.state).length,
        sameDecisionAndStats: JSON.stringify(stableResult(a)) === JSON.stringify(stableResult(b)),
        move: JSON.parse(JSON.stringify(b.move)),
        rootScore: b.stats.rootScore,
        completedDepth: b.stats.completedDepth,
        timedOut: b.stats.timedOut,
        nodes: b.stats.nodes,
        applyMoveCalls: after.applyMoveCalls - before.applyMoveCalls,
        namuaCaptureVariantInputs: after.namuaCaptureVariantInputs - before.namuaCaptureVariantInputs,
        collapsedStopUsePairs: after.collapsedStopUsePairs - before.collapsedStopUsePairs,
        splitStopUsePairs: after.splitStopUsePairs - before.splitStopUsePairs,
      });
    }
  }
  const result = {
    schemaVersion: 1,
    program: 'PBAI-P14',
    baselineId: 'AI-GEN4-BASELINE-2026-09-28-v1',
    baselineCommit: BASELINE_COMMIT,
    measurementClass: 'DEVELOPMENT-ONLY / SUPPORT-PROBE',
    shard,
    shardCount: 8,
    seedRange: { first: startSeed, last: endSeed },
    fixedDepth: FIXED_DEPTH,
    timeLimitMs: 'Infinity',
    sourceHashes: Object.fromEntries(['engine.js', 'ai.js', 'ai-candidate.js', 'ai-config.js',
      'ai-weights.js', 'logic-evaluator.js', 'ai-release.js'].map(name =>
      [name, sha256(readPublic(name))])),
    seeds: Array.from({ length: SEEDS_PER_SHARD }, (_, i) => startSeed + i),
    rows,
    gate: {
      allSamplesDepth4: rows.every(row => row.completedDepth === FIXED_DEPTH && !row.timedOut),
      instrumentationPreservesBehavior: rows.every(row => row.sameDecisionAndStats),
    },
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ shard, rows: rows.length, gate: result.gate }, null, 2)}\n`);
  if (!result.gate.allSamplesDepth4 || !result.gate.instrumentationPreservesBehavior) process.exitCode = 2;
}
main();
