"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");
const Engine = require("../../public/engine.js");
const BaselineAI = require("../../public/ai.js");
const WeightConfig = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C007-v1-predevelopment-support-spec.json");
const AI_FILE = path.join(ROOT, "public/ai.js");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/pbai-p2/c007/predevelopment-support.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c007/predevelopment-support-verification.json");
const HostMap = Map;

function digest(v) { return crypto.createHash("sha256").update(String(v), "utf8").digest("hex"); }
function check(v, m) { if (!v) throw new Error(m); }
function sourceHash(p) { return digest(fs.readFileSync(path.join(ROOT, p), "utf8")); }
function copied(v) { return JSON.parse(JSON.stringify(v)); }
function specRead() { const text = fs.readFileSync(SPEC, "utf8"); return { value: JSON.parse(text), hash: digest(text) }; }

function randomFor(seed) {
  let n = seed >>> 0;
  return () => {
    n += 0x6D2B79F5;
    let z = n;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function strictStateHash(state) {
  check(Array.isArray(state.pending) && state.pending.length === 2, "pending missing");
  const raw = {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
  return digest(JSON.stringify(raw));
}

function moves(state) { return Engine.moveVariants(state).slice().sort((a, b) => BaselineAI.moveKey(a).localeCompare(BaselineAI.moveKey(b))); }
function phaseFor(seed, start) { return ((seed - start) & 1) === 0 ? "namua" : "mtaji"; }
function rootRank(spec, phase, seed, ply, state) { return digest([spec.candidateVersion, phase, seed, ply, strictStateHash(state)].join("|")); }

function perSeedRoot(spec, seed) {
  const requiredPhase = phaseFor(seed, spec.population.seedStart);
  const random = randomFor(seed);
  let state = Engine.initialState();
  let best = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === requiredPhase) {
      const legal = moves(state);
      if (legal.length >= spec.population.rootSelection.minimumLegalMoveCount) {
        const rank = rootRank(spec, requiredPhase, seed, ply, state);
        const row = { seed, ply, phase: requiredPhase, rawKey: strictStateHash(state), rank, state: copied(state) };
        if (!best || row.rank < best.rank || (row.rank === best.rank && row.ply < best.ply)) best = row;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const legal = moves(state);
    if (!legal.length) break;
    state = Engine.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
  }
  return best;
}

function population(spec) {
  const byPhase = { namua: [], mtaji: [] };
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const row = perSeedRoot(spec, seed);
    if (row) byPhase[row.phase].push(row);
  }
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    byPhase[phase].sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed || a.ply - b.ply);
    selected.push(...byPhase[phase].slice(0, spec.population.rootSelection.targetPerPhase));
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.rank.localeCompare(b.rank));
  return { byPhase, selected };
}

function ttEntry(value) {
  return value && typeof value === "object" && Number.isInteger(value.depth)
    && typeof value.flag === "string" && Object.prototype.hasOwnProperty.call(value, "bestMove")
    && Object.prototype.hasOwnProperty.call(value, "value");
}

function observingAi() {
  const totals = { same: 0, shallower: 0, later: 0, clear() { this.same = 0; this.shallower = 0; this.later = 0; } };
  class ReadOnlyTrackingMap extends HostMap {
    constructor(...args) { super(...args); this.displaced = new HostMap(); }
    set(key, value) {
      if (ttEntry(value) && super.has(key)) {
        totals.same += 1;
        const old = super.get(key);
        if (ttEntry(old) && old.depth > value.depth) {
          totals.shallower += 1;
          this.displaced.set(key, Math.max(this.displaced.get(key) ?? -Infinity, old.depth));
        }
      }
      return super.set(key, value);
    }
    __pbaiC007ObserveLookup(key, requested, cached) {
      const oldDepth = this.displaced.get(key);
      if (oldDepth === undefined || !ttEntry(cached)) return;
      if (cached.depth < requested && requested <= oldDepth) totals.later += 1;
    }
  }
  const text = fs.readFileSync(AI_FILE, "utf8");
  const line = "    const cached = context.table.get(key);";
  check(text.includes(line), "AI lookup line unavailable");
  const patched = text.replace(line, `${line}\n    if (typeof context.table.__pbaiC007ObserveLookup === \"function\") {\n      context.table.__pbaiC007ObserveLookup(key, depth, cached);\n    }`);
  check(patched !== text, "AI observation patch unavailable");
  const module = { exports: {} };
  const world = {
    module,
    exports: module.exports,
    Map: ReadOnlyTrackingMap,
    performance,
    console,
    require(name) {
      if (name === "./engine.js") return Engine;
      if (name === "./ai-weights.js") return WeightConfig;
      throw new Error(`unexpected require ${name}`);
    },
  };
  world.globalThis = world;
  vm.createContext(world);
  vm.runInContext(patched, world, { filename: "public/ai.js#c007-independent-observer" });
  return { api: module.exports, totals };
}

function options(spec) {
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

function behavior(api, result) {
  return {
    move: api.moveKey(result.move), completedDepth: result.stats.completedDepth,
    rootScore: result.stats.rootScore, nodes: result.stats.nodes,
    cacheHits: result.stats.cacheHits, cacheStores: result.stats.cacheStores,
    evaluationRequests: result.stats.evaluationRequests, evaluations: result.stats.evaluations,
    evaluationCacheHits: result.stats.evaluationCacheHits, timedOut: result.stats.timedOut,
  };
}

function calculate(spec) {
  check(sourceHash("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine hash changed");
  check(sourceHash("public/ai.js") === spec.sourceBindings["public/ai.js"], "ai hash changed");
  const pop = population(spec);
  check(pop.selected.length === spec.population.rootSelection.targetTotal, "root target unavailable");
  const instrument = observingAi();
  const opts = options(spec);
  let same = 0;
  let shallow = 0;
  let rootsWith = 0;
  let later = 0;
  let mismatch = 0;
  const rows = [];
  for (const root of pop.selected) {
    const plain = BaselineAI.analyzeMove(root.state, spec.baselineSearch.level, () => 0, opts);
    instrument.totals.clear();
    const observed = instrument.api.analyzeMove(root.state, spec.baselineSearch.level, () => 0, opts);
    const a = behavior(BaselineAI, plain);
    const b = behavior(instrument.api, observed);
    const equal = JSON.stringify(a) === JSON.stringify(b);
    if (!equal) mismatch += 1;
    same += instrument.totals.same;
    shallow += instrument.totals.shallower;
    later += instrument.totals.later;
    if (instrument.totals.shallower > 0) rootsWith += 1;
    rows.push({ seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey, rank: root.rank,
      baselineMove: a.move, completedDepth: a.completedDepth, nodes: a.nodes, cacheHits: a.cacheHits, cacheStores: a.cacheStores,
      sameKeyStoreEvents: instrument.totals.same, incomingShallowerThanExistingEvents: instrument.totals.shallower,
      laterPotentialDepthBenefitHits: instrument.totals.later, baselineEquivalent: equal });
  }
  let disposition;
  if (mismatch > spec.gate.maximumBaselineEquivalenceMismatches) disposition = spec.gate.decisionMapping.equivalenceMismatch;
  else if (shallow < spec.gate.minimumIncomingShallowerThanExistingEvents || rootsWith < spec.gate.minimumRootsWithIncomingShallowerEvent) disposition = spec.gate.decisionMapping.supportBelowEitherMinimum;
  else disposition = spec.gate.decisionMapping.supportMeetsBothMinimums;
  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryCandidates: { namua: pop.byPhase.namua.length, mtaji: pop.byPhase.mtaji.length },
      selectedRoots: pop.selected.length,
      selectedNamua: pop.selected.filter((x) => x.phase === "namua").length,
      selectedMtaji: pop.selected.filter((x) => x.phase === "mtaji").length,
      rootDigest: digest(JSON.stringify(rows.map((r) => ({ seed: r.seed, ply: r.ply, phase: r.phase, rawKey: r.rawKey, rank: r.rank })))),
    },
    measurement: {
      sameKeyStoreEvents: same,
      incomingShallowerThanExistingEvents: shallow,
      rootsWithIncomingShallowerEvent: rootsWith,
      laterPotentialDepthBenefitHits: later,
      baselineEquivalenceMismatches: mismatch,
    },
    roots: rows,
    decision: {
      supportPass: disposition === spec.gate.decisionMapping.supportMeetsBothMinimums,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function namedPath(argv, name, fallback) { const i = argv.indexOf(name); return i < 0 ? fallback : path.resolve(argv[i + 1]); }
function main(argv = process.argv.slice(2)) {
  const productionPath = namedPath(argv, "--production", DEFAULT_PRODUCTION);
  const outputPath = namedPath(argv, "--output", DEFAULT_OUTPUT);
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  const loaded = specRead();
  check(production.supportSpecId === loaded.value.supportSpecId, "spec id mismatch");
  check(production.supportSpecSha256 === loaded.hash, "spec hash mismatch");
  check(production.candidateCodeUsed === false && production.candidateBenefitMetricsObserved === false, "candidate evidence leaked");
  check(production.validationSeedsAccessed === false && production.releaseHoldoutSeedsAccessed === false, "protected split leaked");
  check(production.researchGeneration3ArtifactsAccessed === false, "G3 artifact access reported");
  const core = calculate(loaded.value);
  const coreEqual = JSON.stringify(core) === JSON.stringify(production.core);
  check(coreEqual, "independent C007 deterministic core mismatch");
  const independentHash = digest(JSON.stringify({ supportSpecId: production.supportSpecId, supportSpecSha256: production.supportSpecSha256,
    baselineId: production.baselineId, sourceSha256: production.sourceSha256, core }));
  check(independentHash === production.deterministicCoreSha256, "core hash mismatch");
  const verification = {
    schemaVersion: 1, program: loaded.value.program, stage: loaded.value.stage, candidateVersion: loaded.value.candidateVersion,
    supportSpecId: loaded.value.supportSpecId, supportSpecSha256: loaded.hash,
    productionRunnerImported: false, productionInstrumentedAiInstanceReused: false,
    fullSelectedRootAndMeasurementCoreEquality: coreEqual,
    productionDeterministicCoreSha256: production.deterministicCoreSha256,
    independentDeterministicCoreSha256: independentHash,
    sourceHashMatch: production.sourceSha256["public/engine.js"] === sourceHash("public/engine.js")
      && production.sourceSha256["public/ai.js"] === sourceHash("public/ai.js"),
    verifiedDisposition: core.decision.disposition, verifiedSupportPass: core.decision.supportPass, passed: true,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(verification, null, 2)}\n`);
  console.log(JSON.stringify(verification, null, 2));
}
if (require.main === module) main();
