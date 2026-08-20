"use strict";

const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const BMP = require("./lib/blunder-misvaluation-patterns.js");
const Tactical = require("./lib/tactical-motif-features.js");

const DEFAULT_TARGET_PER_PHASE = 4;
const MAX_PLY = 140;

const POLICIES = Object.freeze([
  { id: "lex-first", pick: (_moves, _ply) => 0 },
  { id: "lex-last", pick: (moves, _ply) => moves.length - 1 },
  { id: "middle", pick: (moves, _ply) => Math.floor((moves.length - 1) / 2) },
  { id: "ply-cycle", pick: (moves, ply) => ply % moves.length },
  { id: "reverse-cycle", pick: (moves, ply) => moves.length - 1 - (ply % moves.length) },
  { id: "third-cycle", pick: (moves, ply) => Math.floor((ply % 3) * (moves.length - 1) / 2) },
]);

function integerArg(value, fallback) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 32) {
    throw new Error(`targetPerPhase must be an integer in [1,32], got ${value}`);
  }
  return parsed;
}

function sortedMoves(state) {
  return E.moveVariants(state).slice()
    .sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function collectTechnicalCandidates() {
  const seen = new Set();
  const byPhase = { namua: [], mtaji: [] };
  for (const policy of POLICIES) {
    let state = E.initialState();
    for (let ply = 0; ply <= MAX_PLY && state.winner === null; ply += 1) {
      const moves = sortedMoves(state);
      const stateKey = AI.stateKey(state);
      if (moves.length >= 2 && !seen.has(stateKey)) {
        seen.add(stateKey);
        byPhase[state.phase].push({
          policyId: policy.id,
          ply,
          stateKey,
          legalMoveCount: moves.length,
          state: E.clone(state),
        });
      }
      if (!moves.length || ply === MAX_PLY) break;
      const index = policy.pick(moves, ply);
      state = E.applyMove(state, moves[index]).state;
    }
  }
  return byPhase;
}

function evenlySelect(entries, target) {
  if (entries.length <= target) return entries.slice();
  const selected = [];
  const used = new Set();
  for (let i = 0; i < target; i += 1) {
    const index = target === 1 ? 0 : Math.round(i * (entries.length - 1) / (target - 1));
    if (!used.has(index)) {
      used.add(index);
      selected.push(entries[index]);
    }
  }
  for (let index = 0; selected.length < target && index < entries.length; index += 1) {
    if (!used.has(index)) {
      used.add(index);
      selected.push(entries[index]);
    }
  }
  return selected;
}

function summarizeNumbers(values) {
  if (!values.length) return { n: 0, min: null, median: null, mean: null, max: null };
  const ordered = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  const median = ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) / 2;
  return {
    n: values.length,
    min: ordered[0],
    median,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: ordered.at(-1),
  };
}

function benchmarkState(entry) {
  const state = E.clone(entry.state);
  const before = JSON.stringify(state);

  const traceStart = performance.now();
  const trace = BMP.analyzeDepthAgreement(state, [1, 2, 3]);
  const traceMs = performance.now() - traceStart;

  const structuralStart = performance.now();
  const moves = sortedMoves(state);
  for (const move of moves) {
    Tactical.summarizeMoveTransition(state, move);
    Tactical.summarizeReplyEnvelope(state, move);
    BMP.staticPostMoveEvaluation(state, move);
  }
  const structuralMs = performance.now() - structuralStart;

  if (JSON.stringify(state) !== before) throw new Error("Technical benchmark mutated fixture state");

  const d3 = trace.results.find((result) => result.depth === 3);
  const aggregate = trace.results.reduce((totals, result) => {
    totals.nodes += result.aggregateCounters.nodes;
    totals.quiescenceNodes += result.aggregateCounters.quiescenceNodes;
    totals.cutoffs += result.aggregateCounters.cutoffs;
    totals.evaluations += result.aggregateCounters.evaluations;
    return totals;
  }, { nodes: 0, quiescenceNodes: 0, cutoffs: 0, evaluations: 0 });

  return {
    policyId: entry.policyId,
    ply: entry.ply,
    phase: state.phase,
    legalMoveCount: moves.length,
    trace123Ms: traceMs,
    structuralAllMovesMs: structuralMs,
    totalMeasurementMs: traceMs + structuralMs,
    d3Nodes: d3.aggregateCounters.nodes,
    d3QuiescenceNodes: d3.aggregateCounters.quiescenceNodes,
    traceNodes: aggregate.nodes,
    traceQuiescenceNodes: aggregate.quiescenceNodes,
    traceEvaluations: aggregate.evaluations,
  };
}

function phaseSummary(rows) {
  return {
    roots: rows.length,
    legalMoveCount: summarizeNumbers(rows.map((row) => row.legalMoveCount)),
    trace123Ms: summarizeNumbers(rows.map((row) => row.trace123Ms)),
    structuralAllMovesMs: summarizeNumbers(rows.map((row) => row.structuralAllMovesMs)),
    totalMeasurementMs: summarizeNumbers(rows.map((row) => row.totalMeasurementMs)),
    traceNodes: summarizeNumbers(rows.map((row) => row.traceNodes)),
    traceEvaluations: summarizeNumbers(rows.map((row) => row.traceEvaluations)),
  };
}

function main() {
  const targetPerPhase = integerArg(process.argv[2], DEFAULT_TARGET_PER_PHASE);
  const candidates = collectTechnicalCandidates();
  const selected = [
    ...evenlySelect(candidates.namua, targetPerPhase),
    ...evenlySelect(candidates.mtaji, targetPerPhase),
  ];
  const rows = selected.map(benchmarkState);
  const namuaRows = rows.filter((row) => row.phase === "namua");
  const mtajiRows = rows.filter((row) => row.phase === "mtaji");
  const coveragePassed = namuaRows.length === targetPerPhase && mtajiRows.length === targetPerPhase;
  const totalMean = summarizeNumbers(rows.map((row) => row.totalMeasurementMs)).mean;

  const result = {
    schemaVersion: 1,
    benchmarkId: "BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1",
    technicalOnly: true,
    scientificInferenceAuthorized: false,
    scientificCorpusGenerated: false,
    reservedScientificSeedNamespaceUsed: false,
    stateSource: "deterministic-no-rng-multi-policy-fixture-walk",
    targetPerPhase,
    availableTechnicalStates: {
      namua: candidates.namua.length,
      mtaji: candidates.mtaji.length,
    },
    selectedTechnicalStates: {
      namua: namuaRows.length,
      mtaji: mtajiRows.length,
    },
    coveragePassed,
    searchReference: {
      depths: [1, 2, 3],
      primaryDepth: BMP.PRIMARY_DEPTH,
      options: BMP.PRIMARY_SEARCH_OPTIONS,
    },
    perRoot: rows,
    summary: {
      namua: phaseSummary(namuaRows),
      mtaji: phaseSummary(mtajiRows),
      overall: phaseSummary(rows),
      projectedSerialHoursPer1000MeasuredRoots:
        totalMean === null ? null : totalMean * 1000 / 3_600_000,
      projectedSerialHoursPer2000MeasuredRoots:
        totalMean === null ? null : totalMean * 2000 / 3_600_000,
    },
    interpretationBoundary:
      "Timing/workload only. No score, regret, candidate-pattern, outcome, or scientific-effect inference is authorized.",
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!coveragePassed) process.exitCode = 2;
}

main();
