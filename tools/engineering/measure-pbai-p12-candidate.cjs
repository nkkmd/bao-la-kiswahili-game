'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { candidateAiCandidate } = require('./lib/pbai-p12-candidate.cjs');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = process.argv[2] || path.join(ROOT, 'artifacts/pbai-p12/candidate-development.json');
const BASELINE_COMMIT = '56c4993372820096a83b8d853e99995d88f1121e';
const SEED_FIRST = 121210001;
const SEED_LAST = 121210032;
const FIXED_DEPTH = 4;
const MARGINS = [16, 32, 64];

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

function load(candidate = false) {
  const ctx = vm.createContext({ performance });
  ctx.self = ctx;
  const scripts = ['engine.js', 'ai-weights.js', 'ai.js', 'ai-config.js', 'logic-evaluator.js', 'ai-candidate.js', 'ai-release.js'];
  for (const name of scripts) {
    let source = readPublic(name);
    if (candidate && name === 'ai-candidate.js') source = candidateAiCandidate(source);
    vm.runInContext(source, ctx, { filename: name });
  }
  return ctx;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeShape(E, state, moves) {
  if (!moves.length || moves.some(move => move.type === 'capture')) return false;
  if (state.phase === 'namua' && (state.reserve[0] <= 4 || state.reserve[1] <= 4)) return false;
  if (state.phase === 'namua' && moves.some(move => move.row === E.FRONT && move.index === E.HOUSE)) return false;
  return true;
}

function sampleStates(E, seed) {
  const random = rng(seed);
  let state = E.initialState();
  const found = { namuaGeneral: null, namuaSafe: null, mtajiGeneral: null, mtajiSafe: null };
  for (let ply = 0; ply < 160 && state.winner === null; ply += 1) {
    const moves = E.moveVariants(state);
    if (!moves.length) break;
    if (state.phase === 'namua' && ply >= 12 && moves.length >= 2) {
      if (!found.namuaGeneral) found.namuaGeneral = { seed, ply, kind: 'namua-general', state: clone(state) };
      if (!found.namuaSafe && safeShape(E, state, moves)) found.namuaSafe = { seed, ply, kind: 'namua-safe', state: clone(state) };
    }
    if (state.phase === 'mtaji' && moves.length >= 2) {
      if (!found.mtajiGeneral) found.mtajiGeneral = { seed, ply, kind: 'mtaji-general', state: clone(state) };
      if (!found.mtajiSafe && safeShape(E, state, moves)) found.mtajiSafe = { seed, ply, kind: 'mtaji-safe', state: clone(state) };
    }
    if (Object.values(found).every(Boolean)) break;
    const move = moves[Math.floor(random() * moves.length)];
    state = E.applyMove(state, move).state;
  }
  const seen = new Set();
  return Object.values(found).filter(Boolean).filter(sample => {
    const key = E.stateKey ? E.stateKey(sample.state) : JSON.stringify(sample.state);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stable(result) {
  const { elapsedMs, ...stats } = result.stats;
  return JSON.stringify({ move: result.move, stats });
}

function analyze(ctx, sample, margin = 0) {
  const level = 'expert';
  const options = {
    ...ctx.BaoReleaseConfig.searchOptions(level, { hardwareConcurrency: 4, deviceMemory: 4 }, sample.state),
    maxDepth: FIXED_DEPTH,
    timeLimitMs: Infinity,
    stableBestDepths: 0,
    aspirationWindow: 0,
    ...(margin > 0 ? { pbaiC016Margin: margin, pbaiC016MinDepth: 3 } : {}),
  };
  return ctx.BaoReleaseAI.analyzeMove(sample.state, level, rng(sample.seed ^ (sample.ply << 8)), options);
}

function main() {
  const baseline = load(false);
  const candidate = load(true);
  const samples = [];
  for (let seed = SEED_FIRST; seed <= SEED_LAST; seed += 1) samples.push(...sampleStates(baseline.BaoEngine, seed));

  let flagOffMatches = true;
  const baselineRows = samples.map(sample => {
    const base = analyze(baseline, sample, 0);
    const off = analyze(candidate, sample, 0);
    const same = stable(base) === stable(off);
    flagOffMatches &&= same;
    return { sample, base, flagOffSame: same };
  });

  const results = [];
  for (const margin of MARGINS) {
    const rows = baselineRows.map(({ sample, base, flagOffSame }) => {
      const cand = analyze(candidate, sample, margin);
      const meta = cand.stats.pbaiC016;
      assert.ok(meta, 'candidate stats missing');
      return {
        seed: sample.seed,
        ply: sample.ply,
        kind: sample.kind,
        phase: sample.state.phase,
        legalMoves: baseline.BaoEngine.moveVariants(sample.state).length,
        flagOffSame,
        eligible: meta.eligible,
        safetyReason: meta.safetyReason,
        baselineMove: baseline.BaoAI.moveKey(base.move),
        candidateMove: candidate.BaoAI.moveKey(cand.move),
        sameMove: baseline.BaoAI.moveKey(base.move) === candidate.BaoAI.moveKey(cand.move),
        baselineScore: base.stats.rootScore,
        candidateScore: cand.stats.rootScore,
        baselineNodes: base.stats.nodes,
        candidateNodes: cand.stats.nodes,
        completedDepth: cand.stats.completedDepth,
        timedOut: cand.stats.timedOut,
        probes: meta.probes,
        probeNodes: meta.probeNodes,
        suppressedResearches: meta.suppressedResearches,
        materialResearches: meta.materialResearches,
        researchNodes: meta.researchNodes,
        approximateRootIterations: meta.approximateRootIterations,
      };
    });

    const eligible = rows.filter(row => row.eligible);
    const sum = (list, key) => list.reduce((total, row) => total + row[key], 0);
    const phaseCounts = Object.fromEntries(['namua', 'mtaji'].map(phase => [phase, eligible.filter(row => row.phase === phase).length]));
    const baselineNodes = sum(rows, 'baselineNodes');
    const candidateNodes = sum(rows, 'candidateNodes');
    const eligibleBaselineNodes = sum(eligible, 'baselineNodes');
    const eligibleCandidateNodes = sum(eligible, 'candidateNodes');
    const sameMoves = rows.filter(row => row.sameMove).length;
    const aggregate = {
      margin,
      positions: rows.length,
      eligiblePositions: eligible.length,
      eligiblePhaseCounts: phaseCounts,
      safetyReasons: rows.reduce((acc, row) => { acc[row.safetyReason] = (acc[row.safetyReason] || 0) + 1; return acc; }, {}),
      suppressedResearches: sum(rows, 'suppressedResearches'),
      materialResearches: sum(rows, 'materialResearches'),
      probes: sum(rows, 'probes'),
      probeNodes: sum(rows, 'probeNodes'),
      researchNodes: sum(rows, 'researchNodes'),
      approximateRootIterations: sum(rows, 'approximateRootIterations'),
      baselineNodes,
      candidateNodes,
      overallNodeRatio: baselineNodes ? candidateNodes / baselineNodes : null,
      eligibleBaselineNodes,
      eligibleCandidateNodes,
      eligibleNodeRatio: eligibleBaselineNodes ? eligibleCandidateNodes / eligibleBaselineNodes : null,
      sameMoves,
      sameMoveShare: rows.length ? sameMoves / rows.length : 0,
      completedAll: rows.every(row => row.completedDepth === FIXED_DEPTH && !row.timedOut),
      flagOffMatches,
    };
    const gate = {
      enoughEligible: aggregate.eligiblePositions >= 8,
      phaseCoverage: phaseCounts.namua >= 3 && phaseCounts.mtaji >= 3,
      enoughSuppressions: aggregate.suppressedResearches >= 8,
      eligibleSavings: aggregate.eligibleNodeRatio !== null && aggregate.eligibleNodeRatio <= 0.97,
      overallCostBound: aggregate.overallNodeRatio !== null && aggregate.overallNodeRatio <= 1.02,
      moveStability: aggregate.sameMoveShare >= 0.75,
      completedAll: aggregate.completedAll,
      flagOffMatches,
    };
    gate.pass = Object.values(gate).every(Boolean);
    results.push({ margin, aggregate, gate, rows });
  }

  const selected = results.find(item => item.gate.pass) || null;
  const source = readPublic('ai-candidate.js');
  const output = {
    schemaVersion: 1,
    program: 'PBAI-P12',
    candidate: 'PBAI-C016-v1',
    baselineId: 'AI-GEN4-BASELINE-2026-09-17-v1',
    baselineSourceCommit: BASELINE_COMMIT,
    measurementClass: 'DEVELOPMENT-ONLY / NOT-VALIDATION',
    seedBlock: { first: SEED_FIRST, last: SEED_LAST },
    fixedDepth: FIXED_DEPTH,
    margins: MARGINS,
    selectionRule: 'smallest passing margin in ascending order 16,32,64',
    flagOffMatches,
    selectedMargin: selected?.margin ?? null,
    sourceHashes: {
      aiCandidateSha256: sha256(source),
      transformedCandidateSha256: sha256(candidateAiCandidate(source)),
      engineSha256: sha256(readPublic('engine.js')),
      logicEvaluatorSha256: sha256(readPublic('logic-evaluator.js')),
      aiReleaseSha256: sha256(readPublic('ai-release.js')),
    },
    results,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ output: path.relative(ROOT, OUTPUT), flagOffMatches, selectedMargin: output.selectedMargin, summaries: results.map(({ margin, aggregate, gate }) => ({ margin, aggregate, gate })) }, null, 2)}\n`);
  if (!flagOffMatches || output.selectedMargin === null) process.exitCode = 2;
}

main();
