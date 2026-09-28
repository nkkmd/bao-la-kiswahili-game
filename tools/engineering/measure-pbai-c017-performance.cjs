'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '../..');
const BASELINE_COMMIT = '22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b';
const CANDIDATE_COMMIT = 'e9e98290d600bc342a748b80d4589473a0b5ac57';
const FIRST_SEED = 2026100101;
const SEEDS_PER_SHARD = 8;
const MAX_PREFIX_PLY = 128;
const FIXED_DEPTH = 4;
const REPEATS = 7;
const PUBLIC_FILES = ['engine.js', 'ai.js', 'ai-candidate.js', 'ai-config.js',
  'ai-weights.js', 'logic-evaluator.js', 'ai-release.js'];
const LOAD_ORDER = ['engine.js', 'ai-weights.js', 'ai.js', 'ai-config.js',
  'logic-evaluator.js', 'ai-candidate.js', 'ai-release.js'];

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
function source(commit, name) {
  return execFileSync('git', ['show', commit + ':public/' + name], {
    cwd: ROOT, encoding: 'utf8',
  });
}
function load(commit) {
  const context = vm.createContext({ performance });
  context.self = context;
  for (const name of LOAD_ORDER) {
    vm.runInContext(source(commit, name), context, { filename: name });
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
    state = engine.applyMove(state,
      variants[Math.floor(random() * variants.length)]).state;
  }
  return [namua, mtaji].filter(Boolean);
}
function stable(result) {
  const { elapsedMs, ...stats } = result.stats;
  return JSON.stringify(clone({ move: result.move, stats }));
}
function analyze(context, sample, seed, candidate) {
  const level = 'expert';
  const options = {
    ...context.BaoReleaseConfig.searchOptions(level,
      { hardwareConcurrency: 4, deviceMemory: 4 }, sample.state),
    maxDepth: FIXED_DEPTH,
    timeLimitMs: Infinity,
    stableBestDepths: 0,
    aspirationWindow: 0,
  };
  if (candidate) options.pbaiC017ReuseSearchTransitions = true;
  return context.BaoReleaseAI.analyzeMove(sample.state, level,
    rng(seed ^ (sample.ply << 8)), options);
}
function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
function measureSample(base, candidate, sample, seed, onProgress = () => {}) {
  const candidateWarmupFirst = ((seed + sample.ply) % 2) === 0;
  let baseWarmup;
  let candidateWarmup;
  if (candidateWarmupFirst) {
    candidateWarmup = analyze(candidate, sample, seed, true);
    baseWarmup = analyze(base, sample, seed, false);
  } else {
    baseWarmup = analyze(base, sample, seed, false);
    candidateWarmup = analyze(candidate, sample, seed, true);
  }
  const row = {
    seed,
    ply: sample.ply,
    phase: sample.phase,
    status: 'IN_PROGRESS',
    candidateWarmupFirst,
    warmupBaselineMs: baseWarmup.stats.elapsedMs,
    warmupCandidateMs: candidateWarmup.stats.elapsedMs,
    warmupOutputsEqual: stable(baseWarmup) === stable(candidateWarmup),
    baselineTimesMs: [],
    candidateTimesMs: [],
    pairedRuns: [],
  };
  onProgress(row);

  for (let repetition = 0; repetition < REPEATS; repetition += 1) {
    const candidateFirst = ((seed + sample.ply + repetition) % 2) === 0;
    let baselineResult;
    let candidateResult;
    if (candidateFirst) {
      candidateResult = analyze(candidate, sample, seed, true);
      baselineResult = analyze(base, sample, seed, false);
    } else {
      baselineResult = analyze(base, sample, seed, false);
      candidateResult = analyze(candidate, sample, seed, true);
    }
    const pair = {
      repetition,
      candidateFirst,
      baselineMs: baselineResult.stats.elapsedMs,
      candidateMs: candidateResult.stats.elapsedMs,
      outputsEqual: stable(baselineResult) === stable(candidateResult),
      baselineDepth: baselineResult.stats.completedDepth,
      candidateDepth: candidateResult.stats.completedDepth,
      baselineTimedOut: baselineResult.stats.timedOut,
      candidateTimedOut: candidateResult.stats.timedOut,
    };
    row.baselineTimesMs.push(pair.baselineMs);
    row.candidateTimesMs.push(pair.candidateMs);
    row.pairedRuns.push(pair);
    onProgress(row);
  }

  row.baselineMedianMs = median(row.baselineTimesMs);
  row.candidateMedianMs = median(row.candidateTimesMs);
  row.logRatio = Math.log(row.candidateMedianMs / row.baselineMedianMs);
  row.allOutputsEqual = row.warmupOutputsEqual
    && row.pairedRuns.every(pair => pair.outputsEqual);
  row.allDepth4 = row.pairedRuns.every(pair =>
    pair.baselineDepth === FIXED_DEPTH && pair.candidateDepth === FIXED_DEPTH);
  row.noTimeout = row.pairedRuns.every(pair =>
    !pair.baselineTimedOut && !pair.candidateTimedOut);
  row.allTimersPositive = [row.warmupBaselineMs, row.warmupCandidateMs,
    ...row.baselineTimesMs, ...row.candidateTimesMs]
    .every(value => Number.isFinite(value) && value > 0);
  row.status = 'COMPLETE';
  onProgress(row);
  return row;
}
function writeAtomic(output, value) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const temporary = output + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(temporary, output);
}
function makeRecord(shard, seeds) {
  return {
    schemaVersion: 1,
    program: 'PBAI-P14',
    candidate: 'PBAI-C017-v1',
    validation: 'PBAI-C017-PERFORMANCE-002',
    baselineId: 'AI-GEN4-BASELINE-2026-09-28-v1',
    baselineCommit: BASELINE_COMMIT,
    candidateSourceCommit: CANDIDATE_COMMIT,
    measurementClass: 'DEVELOPMENT-ONLY / UNINSTRUMENTED PAIRED FIXED-DEPTH TIMING',
    status: 'IN_PROGRESS',
    shard,
    shardCount: 8,
    seedRange: { first: seeds[0], last: seeds[seeds.length - 1] },
    fixedDepth: FIXED_DEPTH,
    timeLimitMs: 'Infinity',
    repeatsPerCandidate: REPEATS,
    warmupsPerCandidate: 1,
    sourceHashes: {
      baseline: Object.fromEntries(PUBLIC_FILES.map(name =>
        [name, sha256(source(BASELINE_COMMIT, name))])),
      candidate: Object.fromEntries(PUBLIC_FILES.map(name =>
        [name, sha256(source(CANDIDATE_COMMIT, name))])),
    },
    seeds,
    startedSeeds: [],
    completedSeeds: [],
    currentSample: null,
    rows: [],
  };
}
function preflight(output) {
  const base = load(BASELINE_COMMIT);
  const candidate = load(CANDIDATE_COMMIT);
  const developmentSeed = 2026092901;
  const sample = sampleStates(base.BaoEngine, developmentSeed)
    .find(item => item.phase === 'namua');
  assert.ok(sample, 'development-only preflight Namua sample is required');
  const row = measureSample(base, candidate, sample, developmentSeed);
  assert.equal(row.pairedRuns.length, REPEATS);
  assert.equal(row.allOutputsEqual, true);
  assert.equal(row.allDepth4, true);
  assert.equal(row.noTimeout, true);
  assert.equal(row.allTimersPositive, true);
  const result = {
    schemaVersion: 1,
    validation: 'PBAI-C017-PERFORMANCE-002-PREFLIGHT',
    measurementClass: 'DEVELOPMENT-ONLY / NOT-PERFORMANCE-DATA',
    sourceHashes: {
      baseline: Object.fromEntries(PUBLIC_FILES.map(name =>
        [name, sha256(source(BASELINE_COMMIT, name))])),
      candidate: Object.fromEntries(PUBLIC_FILES.map(name =>
        [name, sha256(source(CANDIDATE_COMMIT, name))])),
    },
    checkpointSelfTest: true,
    performanceSeedBlockTouched: false,
    row,
  };
  writeAtomic(output || path.join(ROOT, 'artifacts/pbai-p14/c017-performance-preflight.json'), result);
  process.stdout.write(JSON.stringify({
    validation: result.validation,
    checkpointSelfTest: result.checkpointSelfTest,
    row: { seed: row.seed, phase: row.phase, repeats: row.pairedRuns.length,
      allOutputsEqual: row.allOutputsEqual },
  }, null, 2) + '\n');
}
function runShard(shard, output) {
  assert.ok(Number.isInteger(shard) && shard >= 0 && shard < 8,
    'shard must be an integer from 0 to 7');
  assert.ok(output, 'output path is required');
  const first = FIRST_SEED + shard * SEEDS_PER_SHARD;
  const seeds = Array.from({ length: SEEDS_PER_SHARD }, (_, index) => first + index);
  const record = makeRecord(shard, seeds);
  writeAtomic(output, record);
  const base = load(BASELINE_COMMIT);
  const candidate = load(CANDIDATE_COMMIT);
  for (const seed of seeds) {
    record.startedSeeds.push(seed);
    record.currentSample = { seed, status: 'PREFIX-GENERATION-IN-PROGRESS' };
    writeAtomic(output, record);
    const selected = sampleStates(base.BaoEngine, seed);
    for (const sample of selected) {
      record.currentSample = { seed, ply: sample.ply, phase: sample.phase,
        status: 'SAMPLE-IN-PROGRESS' };
      writeAtomic(output, record);
      const completed = measureSample(base, candidate, sample, seed, partial => {
        record.currentSample = clone(partial);
        writeAtomic(output, record);
      });
      record.rows.push(completed);
      record.currentSample = null;
      writeAtomic(output, record);
    }
    record.completedSeeds.push(seed);
    record.currentSample = null;
    writeAtomic(output, record);
  }
  record.gate = {
    samplesProduced: record.rows.length > 0,
    allOutputsEqual: record.rows.every(row => row.allOutputsEqual),
    allDepth4: record.rows.every(row => row.allDepth4),
    noTimeout: record.rows.every(row => row.noTimeout),
    allTimersPositive: record.rows.every(row => row.allTimersPositive),
  };
  record.status = 'COMPLETE';
  writeAtomic(output, record);
  process.stdout.write(JSON.stringify({
    shard, rowCount: record.rows.length, status: record.status, gate: record.gate,
  }, null, 2) + '\n');
  if (Object.values(record.gate).some(value => value !== true)) process.exitCode = 2;
}
if (process.argv[2] === '--preflight') preflight(process.argv[3]);
else runShard(Number(process.argv[2]), process.argv[3]);
