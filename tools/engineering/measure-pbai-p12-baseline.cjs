'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { instrumentAiCandidate } = require('./lib/pbai-p12-instrument.cjs');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = process.argv[2] || path.join(ROOT, 'artifacts/pbai-p12/baseline-support.json');
const BASELINE_COMMIT = '56c4993372820096a83b8d853e99995d88f1121e';
const SEED_FIRST = 121200001;
const SEED_LAST = 121200024;
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
  const ctx = vm.createContext({ performance });
  ctx.self = ctx;
  const scripts = ['engine.js', 'ai-weights.js', 'ai.js', 'ai-config.js', 'logic-evaluator.js', 'ai-candidate.js', 'ai-release.js'];
  for (const name of scripts) {
    let source = readPublic(name);
    if (name === 'ai-candidate.js' && instrument) source = instrumentAiCandidate(source);
    vm.runInContext(source, ctx, { filename: name });
  }
  return ctx;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sampleStates(E, seed) {
  const random = rng(seed);
  let state = E.initialState();
  let namua = null;
  let mtaji = null;
  for (let ply = 0; ply < 128 && state.winner === null; ply += 1) {
    const variants = E.moveVariants(state);
    if (!variants.length) break;
    if (!namua && state.phase === 'namua' && ply >= 12) namua = { seed, ply, state: clone(state) };
    if (!mtaji && state.phase === 'mtaji' && variants.length >= 2) mtaji = { seed, ply, state: clone(state) };
    if (namua && mtaji) break;
    const move = variants[Math.floor(random() * variants.length)];
    state = E.applyMove(state, move).state;
  }
  return [namua, mtaji].filter(Boolean);
}

function compactStats(stats) {
  const {
    elapsedMs, pbaiC016, pbaiC016DiagnosticsEnabled, ...stable
  } = stats;
  return stable;
}

function analyze(ctx, sample, instrument) {
  const level = 'expert';
  const options = {
    ...ctx.BaoReleaseConfig.searchOptions(level, { hardwareConcurrency: 4, deviceMemory: 4 }, sample.state),
    maxDepth: FIXED_DEPTH,
    timeLimitMs: Infinity,
    stableBestDepths: 0,
    aspirationWindow: 0,
    ...(instrument ? { pbaiC016Diagnostics: true } : {}),
  };
  return ctx.BaoReleaseAI.analyzeMove(sample.state, level, rng(sample.seed ^ (sample.ply << 8)), options);
}

function main() {
  const baseline = load(false);
  const instrumented = load(true);
  const samples = [];
  for (let seed = SEED_FIRST; seed <= SEED_LAST; seed += 1) samples.push(...sampleStates(baseline.BaoEngine, seed));

  const rows = [];
  let behaviorMatches = true;
  for (const sample of samples) {
    const a = analyze(baseline, sample, false);
    const b = analyze(instrumented, sample, true);
    const same = JSON.stringify({ move: a.move, stats: compactStats(a.stats) })
      === JSON.stringify({ move: b.move, stats: compactStats(b.stats) });
    behaviorMatches &&= same;
    rows.push({
      seed: sample.seed,
      ply: sample.ply,
      phase: sample.state.phase,
      legalMoves: baseline.BaoEngine.moveVariants(sample.state).length,
      hasCapture: baseline.BaoEngine.moveVariants(sample.state).some(move => move.type === 'capture'),
      same,
      moveKey: baseline.BaoAI.moveKey(a.move),
      rootScore: a.stats.rootScore,
      completedDepth: a.stats.completedDepth,
      nodes: a.stats.nodes,
      cutoffs: a.stats.cutoffs,
      cacheHits: a.stats.cacheHits,
      firstSearches: b.stats.pbaiC016.firstSearches,
      firstNodes: b.stats.pbaiC016.firstNodes,
      scoutSearches: b.stats.pbaiC016.scoutSearches,
      scoutNodes: b.stats.pbaiC016.scoutNodes,
      researches: b.stats.pbaiC016.researches,
      researchNodes: b.stats.pbaiC016.researchNodes,
      rootResearchOccurred: b.stats.pbaiC016.rootChoices.some(row => row.researched),
      rootChoices: b.stats.pbaiC016.rootChoices,
    });
  }

  const sum = key => rows.reduce((total, row) => total + row[key], 0);
  const phaseCounts = Object.fromEntries(['namua', 'mtaji'].map(phase => [phase, rows.filter(row => row.phase === phase).length]));
  const totalNodes = sum('nodes');
  const researchNodes = sum('researchNodes');
  const rootResearchPositions = rows.filter(row => row.rootResearchOccurred).length;
  const aggregate = {
    positions: rows.length,
    phaseCounts,
    behaviorMatches,
    totalNodes,
    firstSearches: sum('firstSearches'),
    firstNodes: sum('firstNodes'),
    scoutSearches: sum('scoutSearches'),
    scoutNodes: sum('scoutNodes'),
    researches: sum('researches'),
    researchNodes,
    researchNodeShare: totalNodes ? researchNodes / totalNodes : 0,
    rootResearchPositions,
    rootResearchPositionShare: rows.length ? rootResearchPositions / rows.length : 0,
  };

  const gate = {
    enoughPositions: rows.length >= 24 && phaseCounts.namua >= 8 && phaseCounts.mtaji >= 8,
    behaviorPreserved: behaviorMatches,
    enoughScouts: aggregate.scoutSearches >= 200,
    enoughResearches: aggregate.researches >= 20,
    enoughResearchCost: aggregate.researchNodeShare >= 0.05 || aggregate.rootResearchPositionShare >= 0.20,
  };
  gate.pass = Object.values(gate).every(Boolean);

  const source = readPublic('ai-candidate.js');
  const result = {
    schemaVersion: 1,
    program: 'PBAI-P12',
    candidate: 'PBAI-C016-v1',
    baselineId: 'AI-GEN4-BASELINE-2026-09-17-v1',
    baselineSourceCommit: BASELINE_COMMIT,
    measurementClass: 'DEVELOPMENT-ONLY / NOT-VALIDATION',
    seedBlock: { first: SEED_FIRST, last: SEED_LAST },
    fixedDepth: FIXED_DEPTH,
    timeLimitMs: 'Infinity',
    sourceHashes: {
      aiCandidateSha256: sha256(source),
      instrumentedAiCandidateSha256: sha256(instrumentAiCandidate(source)),
      engineSha256: sha256(readPublic('engine.js')),
      logicEvaluatorSha256: sha256(readPublic('logic-evaluator.js')),
      aiReleaseSha256: sha256(readPublic('ai-release.js')),
    },
    aggregate,
    gate,
    rows,
  };

  assert.equal(aggregate.behaviorMatches, true, 'diagnostic instrumentation changed baseline search output');
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ output: path.relative(ROOT, OUTPUT), aggregate, gate }, null, 2)}\n`);
  if (!gate.pass) process.exitCode = 2;
}

main();
