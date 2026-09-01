"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C007-v1-predevelopment-support-spec.json");
const AI_PATH = path.join(ROOT, "public/ai.js");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c007/predevelopment-support.json");
const NativeMap = Map;

function sha256(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function ensure(ok, message) { if (!ok) throw new Error(message); }
function readSpec() { const text = fs.readFileSync(SPEC_PATH, "utf8"); return { spec: JSON.parse(text), sha256: sha256(text) }; }
function fileSha256(relative) { return sha256(fs.readFileSync(path.join(ROOT, relative), "utf8")); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

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
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b))); }
function assignedPhase(seed, start) { return ((seed - start) % 2 === 0) ? "namua" : "mtaji"; }
function rank(candidateVersion, phase, seed, ply, state) { return sha256([candidateVersion, phase, seed, ply, rawKey(state)].join("|")); }

function trajectoryCandidate(spec, seed) {
  const phase = assignedPhase(seed, spec.population.seedStart);
  const random = seededRandom(seed);
  let state = E.initialState();
  let chosen = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = sortedMoves(state);
      if (moves.length >= spec.population.rootSelection.minimumLegalMoveCount) {
        const candidate = {
          seed, ply, phase, rawKey: rawKey(state),
          rank: rank(spec.candidateVersion, phase, seed, ply, state),
          state: clone(state),
        };
        if (!chosen || candidate.rank < chosen.rank || (candidate.rank === chosen.rank && ply < chosen.ply)) chosen = candidate;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return chosen;
}

function selectRoots(spec) {
  const candidates = { namua: [], mtaji: [] };
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const candidate = trajectoryCandidate(spec, seed);
    if (candidate) candidates[candidate.phase].push(candidate);
  }
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    candidates[phase].sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed || a.ply - b.ply);
    selected.push(...candidates[phase].slice(0, spec.population.rootSelection.targetPerPhase));
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.rank.localeCompare(b.rank));
  return { candidates, selected };
}

function createCollector() {
  return {
    sameKeyStoreEvents: 0,
    incomingShallowerThanExistingEvents: 0,
    laterPotentialDepthBenefitHits: 0,
    reset() {
      this.sameKeyStoreEvents = 0;
      this.incomingShallowerThanExistingEvents = 0;
      this.laterPotentialDepthBenefitHits = 0;
    },
  };
}

function isTtEntry(value) {
  return value && typeof value === "object" && Number.isInteger(value.depth)
    && typeof value.flag === "string" && Object.prototype.hasOwnProperty.call(value, "bestMove")
    && Object.prototype.hasOwnProperty.call(value, "value");
}

function createInstrumentedAi() {
  const collector = createCollector();
  class TrackingMap extends NativeMap {
    constructor(...args) {
      super(...args);
      this.__c007DisplacedDepth = new NativeMap();
    }
    set(key, value) {
      if (isTtEntry(value) && super.has(key)) {
        collector.sameKeyStoreEvents += 1;
        const existing = super.get(key);
        if (isTtEntry(existing) && existing.depth > value.depth) {
          collector.incomingShallowerThanExistingEvents += 1;
          this.__c007DisplacedDepth.set(key, Math.max(this.__c007DisplacedDepth.get(key) || -Infinity, existing.depth));
        }
      }
      return super.set(key, value);
    }
    __pbaiC007ObserveLookup(key, requestedDepth, cached) {
      const displacedDepth = this.__c007DisplacedDepth.get(key);
      if (displacedDepth === undefined || !isTtEntry(cached)) return;
      if (cached.depth < requestedDepth && requestedDepth <= displacedDepth) collector.laterPotentialDepthBenefitHits += 1;
    }
  }

  const original = fs.readFileSync(AI_PATH, "utf8");
  const needle = "    const cached = context.table.get(key);";
  const replacement = `${needle}\n    if (typeof context.table.__pbaiC007ObserveLookup === \"function\") {\n      context.table.__pbaiC007ObserveLookup(key, depth, cached);\n    }`;
  ensure(original.includes(needle), "frozen AI lookup needle missing");
  const transformed = original.replace(needle, replacement);
  ensure(transformed !== original, "instrumentation transform failed");
  ensure(transformed.indexOf(replacement) === transformed.lastIndexOf(replacement), "instrumentation applied more than once");

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    Map: TrackingMap,
    performance,
    console,
    require(request) {
      if (request === "./engine.js") return E;
      if (request === "./ai-weights.js") return Weights;
      throw new Error(`Unexpected require from frozen AI source: ${request}`);
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(transformed, sandbox, { filename: "public/ai.js#pbai-c007-observation-only" });
  return { ai: module.exports, collector };
}

function searchOptions(spec) {
  return {
    searchProfile: spec.baselineSearch.searchProfile,
    evaluationProfile: spec.baselineSearch.evaluationProfile,
    maxDepth: spec.baselineSearch.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: spec.baselineSearch.quiescenceDepth,
    maxTableEntries: spec.baselineSearch.maxTableEntries,
    ttMoveFirst: spec.baselineSearch.ttMoveFirst,
    orderQuiescenceCaptures: spec.baselineSearch.orderQuiescenceCaptures,
    normalizeTtMateScores: spec.baselineSearch.normalizeTtMateScores,
    evaluationCache: spec.baselineSearch.evaluationCache,
    maxEvaluationCacheEntries: spec.baselineSearch.maxEvaluationCacheEntries,
    stableBestDepths: spec.baselineSearch.stableBestDepths,
    aspirationWindow: spec.baselineSearch.aspirationWindow,
  };
}

function comparisonCore(ai, result) {
  return {
    move: ai.moveKey(result.move),
    completedDepth: result.stats.completedDepth,
    rootScore: result.stats.rootScore,
    nodes: result.stats.nodes,
    cacheHits: result.stats.cacheHits,
    cacheStores: result.stats.cacheStores,
    evaluationRequests: result.stats.evaluationRequests,
    evaluations: result.stats.evaluations,
    evaluationCacheHits: result.stats.evaluationCacheHits,
    timedOut: result.stats.timedOut,
  };
}

function measure(spec) {
  ensure(fileSha256("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine source mismatch");
  ensure(fileSha256("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI source mismatch");
  ensure(spec.dependency.dependencyPass === true, "C007 dependency not passed");
  ensure(spec.candidateCodeAllowed === false && spec.publicImplementationChangeAllowed === false, "candidate code must remain prohibited");
  const population = selectRoots(spec);
  ensure(population.selected.length === spec.population.rootSelection.targetTotal, `selected roots ${population.selected.length}`);
  ensure(population.selected.filter((r) => r.phase === "namua").length === spec.population.rootSelection.targetPerPhase, "Namua target not met");
  ensure(population.selected.filter((r) => r.phase === "mtaji").length === spec.population.rootSelection.targetPerPhase, "Mtaji target not met");

  const instrumented = createInstrumentedAi();
  const options = searchOptions(spec);
  let sameKeyStoreEvents = 0;
  let shallowerEvents = 0;
  let rootsWithShallower = 0;
  let laterPotential = 0;
  let equivalenceMismatches = 0;
  const rootRows = [];

  for (const root of population.selected) {
    const baseline = AI.analyzeMove(root.state, spec.baselineSearch.level, () => 0, options);
    instrumented.collector.reset();
    const observed = instrumented.ai.analyzeMove(root.state, spec.baselineSearch.level, () => 0, options);
    const baselineCore = comparisonCore(AI, baseline);
    const observedCore = comparisonCore(instrumented.ai, observed);
    const equivalent = JSON.stringify(baselineCore) === JSON.stringify(observedCore);
    if (!equivalent) equivalenceMismatches += 1;
    const shallower = instrumented.collector.incomingShallowerThanExistingEvents;
    sameKeyStoreEvents += instrumented.collector.sameKeyStoreEvents;
    shallowerEvents += shallower;
    laterPotential += instrumented.collector.laterPotentialDepthBenefitHits;
    if (shallower > 0) rootsWithShallower += 1;
    rootRows.push({
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      rank: root.rank,
      baselineMove: baselineCore.move,
      completedDepth: baselineCore.completedDepth,
      nodes: baselineCore.nodes,
      cacheHits: baselineCore.cacheHits,
      cacheStores: baselineCore.cacheStores,
      sameKeyStoreEvents: instrumented.collector.sameKeyStoreEvents,
      incomingShallowerThanExistingEvents: shallower,
      laterPotentialDepthBenefitHits: instrumented.collector.laterPotentialDepthBenefitHits,
      baselineEquivalent: equivalent,
    });
  }

  let disposition;
  if (equivalenceMismatches > spec.gate.maximumBaselineEquivalenceMismatches) disposition = spec.gate.decisionMapping.equivalenceMismatch;
  else if (shallowerEvents < spec.gate.minimumIncomingShallowerThanExistingEvents
    || rootsWithShallower < spec.gate.minimumRootsWithIncomingShallowerEvent) disposition = spec.gate.decisionMapping.supportBelowEitherMinimum;
  else disposition = spec.gate.decisionMapping.supportMeetsBothMinimums;

  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryCandidates: { namua: population.candidates.namua.length, mtaji: population.candidates.mtaji.length },
      selectedRoots: population.selected.length,
      selectedNamua: population.selected.filter((r) => r.phase === "namua").length,
      selectedMtaji: population.selected.filter((r) => r.phase === "mtaji").length,
      rootDigest: sha256(JSON.stringify(rootRows.map((r) => ({ seed: r.seed, ply: r.ply, phase: r.phase, rawKey: r.rawKey, rank: r.rank })))),
    },
    measurement: {
      sameKeyStoreEvents,
      incomingShallowerThanExistingEvents: shallowerEvents,
      rootsWithIncomingShallowerEvent: rootsWithShallower,
      laterPotentialDepthBenefitHits: laterPotential,
      baselineEquivalenceMismatches: equivalenceMismatches,
    },
    roots: rootRows,
    decision: {
      supportPass: disposition === spec.gate.decisionMapping.supportMeetsBothMinimums,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function parseOutput(argv) { const at = argv.indexOf("--output"); return at < 0 ? DEFAULT_OUTPUT : path.resolve(argv[at + 1]); }
function main(argv = process.argv.slice(2)) {
  const loaded = readSpec();
  const core = measure(loaded.spec);
  const result = {
    schemaVersion: 1,
    program: loaded.spec.program,
    stage: loaded.spec.stage,
    candidateVersion: loaded.spec.candidateVersion,
    supportSpecId: loaded.spec.supportSpecId,
    supportSpecSha256: loaded.sha256,
    baselineId: loaded.spec.baselineId,
    sourceSha256: { "public/engine.js": fileSha256("public/engine.js"), "public/ai.js": fileSha256("public/ai.js") },
    candidateCodeUsed: false,
    candidateImplementationObserved: false,
    candidateBenefitMetricsObserved: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    researchGeneration3ArtifactsAccessed: false,
    core,
  };
  result.deterministicCoreSha256 = sha256(JSON.stringify({ supportSpecId: result.supportSpecId, supportSpecSha256: result.supportSpecSha256, baselineId: result.baselineId, sourceSha256: result.sourceSha256, core: result.core }));
  const output = parseOutput(argv);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({
    deterministicCoreSha256: result.deterministicCoreSha256,
    population: result.core.population,
    measurement: result.core.measurement,
    decision: result.core.decision,
  }, null, 2));
}
if (require.main === module) main();
module.exports = { rawKey, seededRandom };
