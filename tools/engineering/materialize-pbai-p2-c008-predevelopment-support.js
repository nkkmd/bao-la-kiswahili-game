"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-predevelopment-support-spec.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/pbai-p2/c008/predevelopment-support.json");

function sha256(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function ensure(ok, message) { if (!ok) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readSpec() { const text = fs.readFileSync(SPEC_PATH, "utf8"); return { spec: JSON.parse(text), sha256: sha256(text) }; }
function fileSha256(relative) { return sha256(fs.readFileSync(path.join(ROOT, relative), "utf8")); }

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
function moveKey(move) { return AI.moveKey(move); }
function sortedMoves(state) { return E.moveVariants(state).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function desiredPhase(seed) { return seed % 2 === 1 ? "namua" : "mtaji"; }
function sourceRank(candidateVersion, phase, seed, ply, state) {
  return sha256([candidateVersion, phase, seed, ply, rawKey(state)].join("|"));
}
function eligibleRank(spec, row) {
  return sha256([spec.candidateVersion, row.phase, row.seed, row.ply, row.rawKey, row.d2MoveKey, row.d3MoveKey].join("|"));
}

function trajectoryRoot(spec, seed) {
  const phase = desiredPhase(seed);
  const random = seededRandom(seed);
  let state = E.initialState();
  let chosen = null;
  for (let ply = 0; ply <= spec.population.maximumGamePlies; ply += 1) {
    if (state.winner === null && state.phase === phase) {
      const moves = sortedMoves(state);
      if (moves.length >= spec.population.rootSource.minimumLegalMoveCount) {
        const candidate = {
          seed,
          ply,
          phase,
          rawKey: rawKey(state),
          rank: sourceRank(spec.candidateVersion, phase, seed, ply, state),
          state: clone(state),
        };
        if (!chosen || candidate.rank < chosen.rank || (candidate.rank === chosen.rank && candidate.ply < chosen.ply)) chosen = candidate;
      }
    }
    if (state.winner !== null || ply === spec.population.maximumGamePlies) break;
    const moves = sortedMoves(state);
    if (!moves.length) break;
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return chosen;
}

function searchOptions(spec, depth) {
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

function fixedAnalysis(spec, state, depth) {
  const result = AI.analyzeMove(state, spec.baselineSearch.level, () => 0, searchOptions(spec, depth));
  const valid = Boolean(result && result.move)
    && result.stats.timedOut === false
    && result.stats.completedDepth === depth;
  return {
    valid,
    moveKey: result && result.move ? moveKey(result.move) : null,
    completedDepth: result?.stats?.completedDepth ?? null,
    timedOut: result?.stats?.timedOut ?? null,
  };
}

function selectEligibleExamples(spec, eligibleRows) {
  const target = spec.population.eligibleSelection;
  const byPhase = {
    namua: eligibleRows.filter((row) => row.phase === "namua").slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank)),
    mtaji: eligibleRows.filter((row) => row.phase === "mtaji").slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank)),
  };
  const selected = [
    ...byPhase.namua.slice(0, target.targetPerPhase),
    ...byPhase.mtaji.slice(0, target.targetPerPhase),
  ];
  if (selected.length < target.targetTotal) {
    const used = new Set(selected.map((row) => `${row.seed}:${row.ply}:${row.rawKey}`));
    const remainder = eligibleRows.filter((row) => !used.has(`${row.seed}:${row.ply}:${row.rawKey}`))
      .slice().sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
    selected.push(...remainder.slice(0, target.targetTotal - selected.length));
  }
  selected.sort((a, b) => a.eligibleRank.localeCompare(b.eligibleRank));
  return selected;
}

function measure(spec) {
  ensure(fileSha256("public/engine.js") === spec.sourceBindings["public/engine.js"], "engine source mismatch");
  ensure(fileSha256("public/ai.js") === spec.sourceBindings["public/ai.js"], "AI source mismatch");
  ensure(spec.status === "FROZEN-BEFORE-DYNAMIC-SUPPORT-OUTCOME", "support spec not frozen");
  ensure(spec.candidateCodeAllowed === false && spec.publicImplementationChangeAllowed === false, "candidate code must remain prohibited");
  ensure(spec.researchGeneration3Influence === false, "G3 firewall changed");

  const rows = [];
  let unavailableRoots = 0;
  let technicalFailures = 0;
  for (let seed = spec.population.seedStart; seed <= spec.population.seedEnd; seed += 1) {
    const root = trajectoryRoot(spec, seed);
    if (!root) {
      unavailableRoots += 1;
      continue;
    }
    let d2;
    let d3;
    let error = null;
    try {
      d2 = fixedAnalysis(spec, root.state, spec.baselineSearch.depth2);
      d3 = fixedAnalysis(spec, root.state, spec.baselineSearch.depth3);
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
    row.eligibleRank = row.rootBestFlipEligible ? eligibleRank(spec, row) : null;
    rows.push(row);
  }

  const eligible = rows.filter((row) => row.rootBestFlipEligible);
  const selected = selectEligibleExamples(spec, eligible);
  const eligibleNamua = eligible.filter((row) => row.phase === "namua").length;
  const eligibleMtaji = eligible.filter((row) => row.phase === "mtaji").length;
  let disposition;
  if (technicalFailures > spec.gate.maximumTechnicalFailures) disposition = spec.gate.decisionMapping.technicalFailure;
  else if (eligible.length < spec.gate.minimumEligibleRoots) disposition = spec.gate.decisionMapping.eligibleBelowMinimum;
  else disposition = spec.gate.decisionMapping.eligibleAtOrAboveMinimum;

  const identity = (row) => ({ seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey, sourceRank: row.sourceRank });
  const selectedIdentity = (row) => ({
    seed: row.seed, ply: row.ply, phase: row.phase, rawKey: row.rawKey,
    d2MoveKey: row.d2MoveKey, d3MoveKey: row.d3MoveKey, eligibleRank: row.eligibleRank,
  });

  return {
    population: {
      sourceSeeds: spec.population.seedCount,
      trajectoryRootsAvailable: rows.length,
      unavailableTrajectoryRoots: unavailableRoots,
      sourceNamua: rows.filter((row) => row.phase === "namua").length,
      sourceMtaji: rows.filter((row) => row.phase === "mtaji").length,
      sourceRootDigest: sha256(JSON.stringify(rows.map(identity))),
      eligibleRoots: eligible.length,
      eligibleNamua,
      eligibleMtaji,
      selectedEligibleRoots: selected.length,
      selectedEligibleNamua: selected.filter((row) => row.phase === "namua").length,
      selectedEligibleMtaji: selected.filter((row) => row.phase === "mtaji").length,
      selectedEligibleRootDigest: sha256(JSON.stringify(selected.map(selectedIdentity))),
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
    developmentSeedsAccessed: false,
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
