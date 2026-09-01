"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-predevelopment-support-spec.json");
const DEFAULT_PRODUCTION = path.join(ROOT, "artifacts/pbai-p2/c008/predevelopment-support.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c008/predevelopment-support-verification.json");

function hashText(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function deepCopy(value) { return JSON.parse(JSON.stringify(value)); }
function fileHash(relative) { return hashText(fs.readFileSync(path.join(ROOT, relative), "utf8")); }

function prng(seed) {
  let current = seed >>> 0;
  return () => {
    current += 0x6D2B79F5;
    let x = current;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function independentMoveKey(move) {
  if (!move || typeof move !== "object") return "";
  const fields = ["type", "phase", "row", "index", "direction", "side", "houseChoice"];
  const parts = fields.map((field) => move[field] === undefined || move[field] === null ? "" : String(move[field]));
  parts.push(move.houseTwo === true ? "true" : "false");
  return parts.join(":");
}

function rawStateObject(state) {
  assert(Array.isArray(state.pending) && state.pending.length === 2, "pending shape invalid");
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
function rawStateHash(state) { return hashText(JSON.stringify(rawStateObject(state))); }
function movesSorted(state) { return E.moveVariants(state).slice().sort((a, b) => independentMoveKey(a).localeCompare(independentMoveKey(b))); }
function requestedPhase(seed) { return (seed & 1) === 1 ? "namua" : "mtaji"; }
function rootRank(spec, phase, seed, ply, state) {
  return hashText(`${spec.candidateVersion}|${phase}|${seed}|${ply}|${rawStateHash(state)}`);
}

function reconstructTrajectoryRoot(spec, seed) {
  const phase = requestedPhase(seed);
  const random = prng(seed);
  let state = E.initialState();
  let best = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const legal = movesSorted(state);
      if (legal.length >= spec.population.rootSource.minimumLegalMoveCount) {
        const item = {
          seed,
          ply,
          phase,
          rawKey: rawStateHash(state),
          rank: rootRank(spec, phase, seed, ply, state),
          state: deepCopy(state),
        };
        if (!best || item.rank < best.rank || (item.rank === best.rank && item.ply < best.ply)) best = item;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const legal = movesSorted(state);
    if (!legal.length) break;
    state = E.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
  }
  return best;
}

function optionsFor(spec, depth) {
  return {
    searchProfile: spec.baselineSearch.searchProfile,
    evaluationProfile: spec.baselineSearch.evaluationProfile,
    maxDepth: depth,
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

function runDepth(spec, state, depth) {
  const out = AI.analyzeMove(state, spec.baselineSearch.level, () => 0, optionsFor(spec, depth));
  return {
    valid: Boolean(out && out.move) && out.stats.timedOut === false && out.stats.completedDepth === depth,
    moveKey: out && out.move ? independentMoveKey(out.move) : null,
    completedDepth: out?.stats?.completedDepth ?? null,
    timedOut: out?.stats?.timedOut ?? null,
  };
}

function eligibilityRank(spec, row) {
  return hashText(`${spec.candidateVersion}|${row.phase}|${row.seed}|${row.ply}|${row.rawKey}|${row.d2MoveKey}|${row.d3MoveKey}`);
}

function chooseExamples(spec, eligible) {
  const limit = spec.population.eligibleSelection;
  const namua = eligible.filter((r) => r.phase === "namua").slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
  const mtaji = eligible.filter((r) => r.phase === "mtaji").slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
  const chosen = [...namua.slice(0, limit.targetPerPhase), ...mtaji.slice(0, limit.targetPerPhase)];
  if (chosen.length < limit.targetTotal) {
    const ids = new Set(chosen.map((r) => `${r.seed}:${r.ply}:${r.rawKey}`));
    const remaining = eligible.filter((r) => !ids.has(`${r.seed}:${r.ply}:${r.rawKey}`))
      .slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
    chosen.push(...remaining.slice(0, limit.targetTotal - chosen.length));
  }
  return chosen.sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
}

function reconstruct(spec) {
  const rows = [];
  let unavailable = 0;
  let technicalFailures = 0;
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const root = reconstructTrajectoryRoot(spec, seed);
    if (!root) {
      unavailable += 1;
      continue;
    }
    let d2;
    let d3;
    let error = null;
    try {
      d2 = runDepth(spec, root.state, spec.baselineSearch.depth2);
      d3 = runDepth(spec, root.state, spec.baselineSearch.depth3);
    } catch (caught) {
      error = String(caught && caught.message ? caught.message : caught);
    }
    const valid = !error && d2.valid && d3.valid;
    if (!valid) technicalFailures += 1;
    const row = {
      seed: root.seed,
      ply: root.ply,
      phase: root.phase,
      rawKey: root.rawKey,
      sourceRank: root.rank,
      technicalValid: valid,
      error,
      d2MoveKey: d2?.moveKey ?? null,
      d2CompletedDepth: d2?.completedDepth ?? null,
      d2TimedOut: d2?.timedOut ?? null,
      d3MoveKey: d3?.moveKey ?? null,
      d3CompletedDepth: d3?.completedDepth ?? null,
      d3TimedOut: d3?.timedOut ?? null,
      rootBestFlipEligible: valid && d2.moveKey !== d3.moveKey,
    };
    row.eligibleRank = row.rootBestFlipEligible ? eligibilityRank(spec, row) : null;
    rows.push(row);
  }

  const eligible = rows.filter((r) => r.rootBestFlipEligible);
  const selected = chooseExamples(spec, eligible);
  const identity = (r) => ({ seed: r.seed, ply: r.ply, phase: r.phase, rawKey: r.rawKey, sourceRank: r.sourceRank });
  const selectedIdentity = (r) => ({ seed: r.seed, ply: r.ply, phase: r.phase, rawKey: r.rawKey, d2MoveKey: r.d2MoveKey, d3MoveKey: r.d3MoveKey, eligibleRank: r.eligibleRank });

  let disposition;
  if (technicalFailures > spec.gate.maximumTechnicalFailures) disposition = spec.gate.decisionMapping.technicalFailure;
  else if (eligible.length < spec.gate.minimumEligibleRoots) disposition = spec.gate.decisionMapping.eligibleBelowMinimum;
  else disposition = spec.gate.decisionMapping.eligibleAtOrAboveMinimum;

  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryRootsAvailable: rows.length,
      unavailableTrajectoryRoots: unavailable,
      sourceNamua: rows.filter((r) => r.phase === "namua").length,
      sourceMtaji: rows.filter((r) => r.phase === "mtaji").length,
      sourceRootDigest: hashText(JSON.stringify(rows.map(identity))),
      eligibleRoots: eligible.length,
      eligibleNamua: eligible.filter((r) => r.phase === "namua").length,
      eligibleMtaji: eligible.filter((r) => r.phase === "mtaji").length,
      selectedEligibleRoots: selected.length,
      selectedEligibleNamua: selected.filter((r) => r.phase === "namua").length,
      selectedEligibleMtaji: selected.filter((r) => r.phase === "mtaji").length,
      selectedEligibleRootDigest: hashText(JSON.stringify(selected.map(selectedIdentity))),
    },
    measurement: {
      technicalFailures,
      rootBestFlipEligible: eligible.length,
    },
    roots: rows,
    selectedEligible: selected.map(selectedIdentity),
    decision: {
      supportPass: disposition === spec.gate.decisionMapping.eligibleAtOrAboveMinimum,
      disposition,
      candidateImplementationAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
    },
  };
}

function argValue(argv, name, fallback) { const i = argv.indexOf(name); return i < 0 ? fallback : path.resolve(argv[i + 1]); }
function main(argv = process.argv.slice(2)) {
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const productionPath = argValue(argv, "--production", DEFAULT_PRODUCTION);
  const outputPath = argValue(argv, "--output", DEFAULT_OUTPUT);
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));

  assert(fileHash("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine source mismatch");
  assert(fileHash("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI source mismatch");
  assert(production.supportSpecSha256 === hashText(specText), "production support spec hash mismatch");
  assert(production.candidateCodeUsed === false && production.candidateImplementationObserved === false, "candidate code leaked into production support");

  const core = reconstruct(spec);
  const sourceSha256 = { "public/engine.js": fileHash("public/engine.js"), "public/ai.js": fileHash("public/ai.js") };
  const independentDeterministicCoreSha256 = hashText(JSON.stringify({
    supportSpecId: spec.supportSpecId,
    supportSpecSha256: hashText(specText),
    baselineId: spec.baselineId,
    sourceSha256,
    core,
  }));
  const fullCoreEquality = JSON.stringify(core) === JSON.stringify(production.core);
  const result = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    supportSpecId: spec.supportSpecId,
    supportSpecSha256: hashText(specText),
    productionRunnerImported: false,
    productionSelectedRootsTrustedWithoutReconstruction: false,
    fullSourceRootD2D3AndEligibilityCoreEquality: fullCoreEquality,
    productionDeterministicCoreSha256: production.deterministicCoreSha256,
    independentDeterministicCoreSha256,
    sourceHashMatch: JSON.stringify(production.sourceSha256) === JSON.stringify(sourceSha256),
    verifiedDisposition: core.decision.disposition,
    verifiedSupportPass: core.decision.supportPass,
    passed: fullCoreEquality
      && production.deterministicCoreSha256 === independentDeterministicCoreSha256
      && JSON.stringify(production.sourceSha256) === JSON.stringify(sourceSha256),
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}

if (require.main === module) main();
