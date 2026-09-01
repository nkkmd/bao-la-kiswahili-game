#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const E = require("../../public/engine.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-feature-off-equivalence-spec.json");
const CURRENT_AI_PATH = path.join(ROOT, "public/ai.js");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function sha256File(file) { return sha256(fs.readFileSync(file)); }
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let x = value;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function moveKey(move) {
  if (!move) return "";
  return [move.type, move.phase, move.row, move.index, move.direction, move.side, move.houseChoice, Boolean(move.houseTwo)].join(":");
}
function rawObject(state) {
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "explicit pending required");
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(), houseOwned: state.houseOwned.slice(), player: state.player,
    phase: state.phase, winner: state.winner, pending: state.pending.slice(),
  };
}
function rawKey(state) { return sha256(JSON.stringify(rawObject(state))); }
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function desiredPhase(seed) { return seed % 2 === 1 ? "namua" : "mtaji"; }

function firstTrajectoryRoot(spec, seed) {
  const wanted = desiredPhase(seed);
  const random = seededRandom(seed);
  let state = E.initialState();
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === wanted) {
      const legal = sortedMoves(state);
      if (legal.length >= 2) return { seed, ply, phase: wanted, rawKey: rawKey(state), state: clone(state) };
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const legal = sortedMoves(state);
    if (!legal.length) break;
    state = E.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
  }
  return null;
}

function selectRoots(spec) {
  const byPhase = { namua: [], mtaji: [] };
  let technicalFailures = 0;
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    try {
      const row = firstTrajectoryRoot(spec, seed);
      if (row) byPhase[row.phase].push(row);
    } catch (_) { technicalFailures += 1; }
  }
  for (const phase of ["namua", "mtaji"]) byPhase[phase].sort((a, b) => a.seed - b.seed || a.ply - b.ply);
  ensure(technicalFailures <= spec.gate.rootSelectionTechnicalFailuresMaximum, `root selection technical failures: ${technicalFailures}`);
  ensure(byPhase.namua.length >= spec.population.targetPerPhase, `insufficient namua roots: ${byPhase.namua.length}`);
  ensure(byPhase.mtaji.length >= spec.population.targetPerPhase, `insufficient mtaji roots: ${byPhase.mtaji.length}`);
  const selected = [
    ...byPhase.namua.slice(0, spec.population.targetPerPhase),
    ...byPhase.mtaji.slice(0, spec.population.targetPerPhase),
  ];
  ensure(selected.length === spec.population.targetTotal, `selected root count mismatch: ${selected.length}`);
  return { byPhase, selected, technicalFailures };
}

function loadAi(source, filename) {
  const module = { exports: {} };
  const sandbox = {
    module, exports: module.exports, BaoEngine: E, BaoAIWeights: Weights,
    performance: { now: () => 0 }, Math: Object.assign(Object.create(Math), { random: () => 0 }), console,
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

function optionsFor(spec, condition) {
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
function canonical(ai, execution) {
  if (!execution.ok) return execution;
  const r = execution.result;
  return {
    ok: true,
    move: clone(r.move),
    moveKey: ai.moveKey(r.move),
    stats: clone(r.stats),
    candidateDiagnosticPresent: Object.prototype.hasOwnProperty.call(r.stats, "pbaiC009"),
  };
}
function parseArgs(argv) {
  const get = (name) => { const i = argv.indexOf(name); ensure(i >= 0 && argv[i + 1], `${name} required`); return path.resolve(argv[i + 1]); };
  return { baselineAi: get("--baseline-ai"), output: get("--output") };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const baselineSource = fs.readFileSync(args.baselineAi, "utf8");
  const candidateSource = fs.readFileSync(CURRENT_AI_PATH, "utf8");
  ensure(sha256(baselineSource) === spec.baselineAiSha256, "baseline AI hash mismatch");
  ensure(sha256File(path.join(ROOT, "public/engine.js")) === spec.publicEngineSha256, "engine hash mismatch");
  ensure(candidateSource.includes(spec.candidateFeatureFlag), "candidate feature flag missing");

  const baseline = loadAi(baselineSource, "baseline-ai.js");
  const candidate = loadAi(candidateSource, "candidate-ai.js");
  const pop = selectRoots(spec);
  const comparisons = [];
  let mismatches = 0;
  let diagnosticPresence = 0;
  for (const root of pop.selected) {
    for (const condition of spec.searchConditions) {
      const options = optionsFor(spec, condition);
      const a = canonical(baseline, execute(baseline, root.state, condition, options));
      const b = canonical(candidate, execute(candidate, root.state, condition, options));
      if (b.ok && b.candidateDiagnosticPresent) diagnosticPresence += 1;
      const equal = JSON.stringify(a) === JSON.stringify(b);
      if (!equal) mismatches += 1;
      comparisons.push({ seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey, conditionId: condition.id, equal, baseline: a, candidate: b });
    }
  }
  const passed = pop.technicalFailures <= spec.gate.rootSelectionTechnicalFailuresMaximum
    && mismatches <= spec.gate.comparisonMismatchesMaximum
    && diagnosticPresence <= spec.gate.candidateDiagnosticPresenceMaximum;
  const result = {
    schemaVersion: 1, program: spec.program, stage: spec.stage, candidateVersion: spec.candidateVersion,
    specId: spec.specId, specSha256: sha256(specText), baselineAiSha256: sha256(baselineSource),
    candidateAiSha256: sha256(candidateSource), engineSha256: sha256File(path.join(ROOT, "public/engine.js")),
    candidateFeatureValue: false, candidateBenefitMetricsComputed: false, developmentSeedsAccessed: false,
    validationSeedsAccessed: false, releaseHoldoutSeedsAccessed: false, researchGeneration3ArtifactsAccessed: false,
    rootSelectionRule: "first eligible state per trajectory; first targetPerPhase roots by ascending seed",
    population: {
      sourceSeeds: spec.population.seedCount, availableNamua: pop.byPhase.namua.length, availableMtaji: pop.byPhase.mtaji.length,
      selectedRoots: pop.selected.length, selectedNamua: pop.selected.filter((x) => x.phase === "namua").length,
      selectedMtaji: pop.selected.filter((x) => x.phase === "mtaji").length, rootSelectionTechnicalFailures: pop.technicalFailures,
      selectedRootDigest: sha256(JSON.stringify(pop.selected.map((x) => ({ seed: x.seed, ply: x.ply, phase: x.phase, rawKey: x.rawKey })))),
    },
    measurement: { conditionsPerRoot: spec.searchConditions.length, totalComparisons: comparisons.length, comparisonMismatches: mismatches, candidateDiagnosticPresence: diagnosticPresence },
    decision: { passed, disposition: passed ? spec.gate.decisionMapping.allPass : spec.gate.decisionMapping.anyFailure, developmentBenefitExecutionAuthorizedByThisResult: passed, validationAuthorized: false, releaseHoldoutAuthorized: false },
    comparisons,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({ specId: result.specId, specSha256: result.specSha256, baselineAiSha256: result.baselineAiSha256, candidateAiSha256: result.candidateAiSha256, engineSha256: result.engineSha256, rootSelectionRule: result.rootSelectionRule, population: result.population, measurement: result.measurement, decision: result.decision }));
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ deterministicCoreSha256: result.deterministicCoreSha256, population: result.population, measurement: result.measurement, decision: result.decision }, null, 2));
  if (!passed) process.exitCode = 1;
}
if (require.main === module) main();
