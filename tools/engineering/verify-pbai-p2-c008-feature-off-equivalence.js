#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const E = require("../../public/engine.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-feature-off-equivalence-spec.json");
const CURRENT_AI_PATH = path.join(ROOT, "public/ai.js");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function sha256File(file) { return sha256(fs.readFileSync(file)); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function ensure(ok, message) { if (!ok) throw new Error(message); }

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function moveKey(move) {
  if (!move) return "";
  return [
    move.type, move.phase, move.row, move.index, move.direction, move.side,
    move.houseChoice, Boolean(move.houseTwo),
  ].join(":");
}

function rawObject(state) {
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "explicit pending required");
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}
function rawKey(state) { return sha256(JSON.stringify(rawObject(state))); }
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function desiredPhase(seed) { return seed % 2 === 1 ? "namua" : "mtaji"; }
function rootRank(spec, seed, ply, state) {
  return sha256([spec.candidateVersion, desiredPhase(seed), seed, ply, rawKey(state)].join("|"));
}

function trajectoryCandidate(spec, seed) {
  const phase = desiredPhase(seed);
  const random = seededRandom(seed);
  let state = E.initialState();
  let selected = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = sortedMoves(state);
      if (moves.length >= 2) {
        const row = {
          seed,
          ply,
          phase,
          rawKey: rawKey(state),
          rank: rootRank(spec, seed, ply, state),
          state: clone(state),
        };
        if (!selected || row.rank < selected.rank || (row.rank === selected.rank && ply < selected.ply)) {
          selected = row;
        }
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return selected;
}

function selectRoots(spec) {
  const byPhase = { namua: [], mtaji: [] };
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const candidate = trajectoryCandidate(spec, seed);
    if (candidate) byPhase[candidate.phase].push(candidate);
  }
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    byPhase[phase].sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed || a.ply - b.ply);
    ensure(byPhase[phase].length >= spec.population.targetPerPhase, `insufficient ${phase} roots: ${byPhase[phase].length}`);
    selected.push(...byPhase[phase].slice(0, spec.population.targetPerPhase));
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.rank.localeCompare(b.rank));
  ensure(selected.length === spec.population.targetTotal, `root target mismatch: ${selected.length}`);
  return { byPhase, selected };
}

function loadAi(source, filename) {
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    BaoEngine: E,
    BaoAIWeights: Weights,
    performance: { now: () => 0 },
    console,
    require(request) {
      if (request === "./engine.js") return E;
      if (request === "./ai-weights.js") return Weights;
      throw new Error(`unexpected require: ${request}`);
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename });
  return module.exports;
}

function searchOptions(spec, condition) {
  return {
    ...spec.commonSearchOptions,
    maxDepth: condition.maxDepth,
    timeLimitMs: condition.timeLimitMs === "Infinity" ? Infinity : condition.timeLimitMs,
    [spec.candidateFeatureFlag]: false,
  };
}

function execute(ai, state, condition, options) {
  try {
    return { ok: true, result: ai.analyzeMove(clone(state), condition.level, () => 0, options) };
  } catch (error) {
    return { ok: false, error: { name: error?.name || "Error", message: error?.message || String(error) } };
  }
}

function canonicalExecution(ai, execution, featureFlag) {
  if (!execution.ok) return execution;
  const result = execution.result;
  return {
    ok: true,
    move: clone(result.move),
    moveKey: ai.moveKey(result.move),
    stats: clone(result.stats),
    candidateDiagnosticPresent: Object.prototype.hasOwnProperty.call(result.stats, "pbaiC008"),
    featureFlag,
  };
}

function parseArgs(argv) {
  const at = (name) => argv.indexOf(name);
  const baselineAt = at("--baseline-ai");
  const outputAt = at("--output");
  ensure(baselineAt >= 0 && argv[baselineAt + 1], "--baseline-ai required");
  ensure(outputAt >= 0 && argv[outputAt + 1], "--output required");
  return { baselineAi: path.resolve(argv[baselineAt + 1]), output: path.resolve(argv[outputAt + 1]) };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const baselineSource = fs.readFileSync(args.baselineAi, "utf8");
  const candidateSource = fs.readFileSync(CURRENT_AI_PATH, "utf8");

  ensure(sha256(baselineSource) === spec.baselineAiSha256, "baseline AI hash mismatch");
  ensure(sha256File(path.join(ROOT, "public/engine.js")) === spec.publicEngineSha256, "engine hash mismatch");
  ensure(candidateSource.includes(spec.candidateFeatureFlag), "candidate feature flag not found in current AI source");

  const baseline = loadAi(baselineSource, "baseline-ai.js");
  const candidate = loadAi(candidateSource, "candidate-ai.js");
  const population = selectRoots(spec);
  const comparisons = [];
  let mismatches = 0;
  let candidateDiagnosticPresence = 0;

  for (const root of population.selected) {
    for (const condition of spec.searchConditions) {
      const options = searchOptions(spec, condition);
      const baselineExecution = canonicalExecution(
        baseline, execute(baseline, root.state, condition, options), false,
      );
      const candidateExecution = canonicalExecution(
        candidate, execute(candidate, root.state, condition, options), false,
      );
      const baselineComparable = clone(baselineExecution);
      const candidateComparable = clone(candidateExecution);
      delete baselineComparable.featureFlag;
      delete candidateComparable.featureFlag;
      if (candidateExecution.ok && candidateExecution.candidateDiagnosticPresent) candidateDiagnosticPresence += 1;
      const equal = JSON.stringify(baselineComparable) === JSON.stringify(candidateComparable);
      if (!equal) mismatches += 1;
      comparisons.push({
        seed: root.seed,
        ply: root.ply,
        phase: root.phase,
        rawKey: root.rawKey,
        conditionId: condition.id,
        equal,
        baseline: baselineComparable,
        candidate: candidateComparable,
      });
    }
  }

  const passed = mismatches <= spec.gate.comparisonMismatchesMaximum
    && candidateDiagnosticPresence <= spec.gate.candidateDiagnosticPresenceMaximum;
  const result = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    specId: spec.specId,
    specSha256: sha256(specText),
    baselineAiSha256: sha256(baselineSource),
    candidateAiSha256: sha256(candidateSource),
    engineSha256: sha256File(path.join(ROOT, "public/engine.js")),
    candidateFeatureValue: false,
    candidateBenefitMetricsComputed: false,
    developmentSeedsAccessed: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    researchGeneration3ArtifactsAccessed: false,
    population: {
      sourceSeeds: spec.population.seedCount,
      availableNamua: population.byPhase.namua.length,
      availableMtaji: population.byPhase.mtaji.length,
      selectedRoots: population.selected.length,
      selectedNamua: population.selected.filter((root) => root.phase === "namua").length,
      selectedMtaji: population.selected.filter((root) => root.phase === "mtaji").length,
      selectedRootDigest: sha256(JSON.stringify(population.selected.map((root) => ({
        seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey, rank: root.rank,
      })))),
    },
    measurement: {
      conditionsPerRoot: spec.searchConditions.length,
      totalComparisons: comparisons.length,
      comparisonMismatches: mismatches,
      candidateDiagnosticPresence,
    },
    decision: {
      passed,
      disposition: passed ? spec.gate.decisionMapping.allPass : spec.gate.decisionMapping.anyFailure,
      developmentBenefitExecutionAuthorizedByThisResult: passed,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
    comparisons,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({
    specId: result.specId,
    specSha256: result.specSha256,
    baselineAiSha256: result.baselineAiSha256,
    candidateAiSha256: result.candidateAiSha256,
    engineSha256: result.engineSha256,
    population: result.population,
    measurement: result.measurement,
    decision: result.decision,
  }));

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({
    deterministicCoreSha256: result.deterministicCoreSha256,
    population: result.population,
    measurement: result.measurement,
    decision: result.decision,
  }, null, 2));
  if (!passed) process.exitCode = 1;
}

if (require.main === module) main();
