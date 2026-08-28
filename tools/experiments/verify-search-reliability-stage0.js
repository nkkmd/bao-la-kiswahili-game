#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const Legacy = require("./lib/position-complexity-search-diagnostic.js");

const WIN = 1_000_000;
const STAGE_ID = "SRDR-S0-TECHNICAL-2026-08-27-v1";
const EXPECTED_SPEC_SHA256 = "12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26";
const BASE_OPTIONS = {
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
};

function parseArgs(argv) {
  let input = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") input = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!input) throw new Error("--input is required");
  return { input };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function stableHash(value) {
  return sha256(JSON.stringify(canonicalize(value)));
}

function rawIdentityObject(state) {
  return {
    pits: JSON.parse(JSON.stringify(state.pits)),
    reserve: JSON.parse(JSON.stringify(state.reserve)),
    houseOwned: JSON.parse(JSON.stringify(state.houseOwned)),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: JSON.parse(JSON.stringify(state.pending)),
  };
}

function rawIdentityHash(state) {
  return sha256(JSON.stringify(rawIdentityObject(state)));
}

function forcedWinFixture() {
  return {
    pits: [
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 1,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 50,
    pending: [0, 0],
  };
}

function scoreMap(result) {
  return Object.fromEntries(result.candidates.map(({ moveKey, score }) => [moveKey, score]));
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}

function canonicalMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function independentQuiescenceValue(state, player, ply, remaining) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = canonicalMoves(state).filter(({ type }) => type === "capture");
  if (!captures.length || remaining === 0) return AI.evaluateWithProfile(state, player, "bao");
  const values = captures.map((move) => independentQuiescenceValue(
    E.applyMove(state, move).state, player, ply + 1, remaining - 1,
  ));
  return state.player === player ? Math.max(...values) : Math.min(...values);
}

function independentPvTail(state, depth, player, ply, qDepth) {
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return { score: terminal, moveKeys: [] };
  if (depth === 0) return {
    score: independentQuiescenceValue(state, player, ply, qDepth),
    moveKeys: [],
  };
  const moves = canonicalMoves(state);
  if (!moves.length) return {
    score: state.player === player ? -WIN + ply : WIN - ply,
    moveKeys: [],
  };
  const maximizing = state.player === player;
  let selected = null;
  for (const move of moves) {
    const child = independentPvTail(E.applyMove(state, move).state, depth - 1, player, ply + 1, qDepth);
    const candidate = { score: child.score, moveKey: AI.moveKey(move), tail: child.moveKeys };
    if (!selected
      || (maximizing && candidate.score > selected.score)
      || (!maximizing && candidate.score < selected.score)
      || (candidate.score === selected.score && candidate.moveKey.localeCompare(selected.moveKey) < 0)) {
      selected = candidate;
    }
  }
  return { score: selected.score, moveKeys: [selected.moveKey, ...selected.tail] };
}

function independentCanonicalPv(state, rootSummary, depth, qDepth) {
  const rootMove = canonicalMoves(state).find((move) => AI.moveKey(move) === rootSummary.canonicalBestMoveKey);
  assert.ok(rootMove, "root canonical best must be legal");
  const tail = independentPvTail(E.applyMove(state, rootMove).state, depth - 1, state.player, 1, qDepth);
  return {
    moveKeys: [rootSummary.canonicalBestMoveKey, ...tail.moveKeys],
    score: tail.score,
  };
}

function verifyCurrentAgainstLegacy(current, legacy) {
  assert.equal(current.result.bestScore, legacy.bestScore);
  assert.deepEqual(current.result.topSetMoveKeys, legacy.topSetMoveKeys);
  assert.deepEqual(current.result.scoreByMoveKey, scoreMap(legacy));
  assert.equal(current.result.legalMoveCount, legacy.legalMoveCount);
}

function expectedCompletedDepth(costs, budget) {
  let cumulative = 0;
  let completed = 0;
  for (let depth = 1; depth <= costs.length; depth += 1) {
    cumulative += costs[depth - 1];
    if (cumulative > budget) break;
    completed = depth;
  }
  return completed;
}

function main() {
  const { input } = parseArgs(process.argv.slice(2));
  const result = JSON.parse(fs.readFileSync(input, "utf8"));
  assert.equal(result.stageId, STAGE_ID);
  assert.equal(result.studyId, "SRDR-STUDY1");
  assert.equal(result.programLabel, "G2-02");
  assert.equal(result.researchGeneration, "Research Generation 2");
  assert.equal(result.technicalOnly, true);
  assert.equal(result.scientificInferenceAuthorized, false);
  assert.equal(result.confirmatoryReuseAllowed, false);
  assert.equal(result.scientificSeedConsumed, false);
  assert.equal(result.reservedScientificSeedBlocksTouched, false);
  assert.equal(result.formalEvidenceAuthorized, false);
  assert.equal(result.specSha256, EXPECTED_SPEC_SHA256);

  const deterministicCore = JSON.parse(JSON.stringify(result));
  delete deterministicCore.resultHash;
  assert.equal(result.resultHash, stableHash(deterministicCore), "resultHash mismatch");
  for (const [relativePath, expectedHash] of Object.entries(result.sourceFileSha256)) {
    assert.equal(sha256(fs.readFileSync(path.resolve(relativePath))), expectedHash, `source hash mismatch: ${relativePath}`);
  }

  const initial = E.initialState();
  const mtaji = forcedWinFixture();
  assert.equal(result.fixtureRawIdentitySha256["engine-initial-namua"], rawIdentityHash(initial));
  assert.equal(result.fixtureRawIdentitySha256["forced-win-mtaji"], rawIdentityHash(mtaji));
  assert.equal(result.stateMutationAudit.initialUnchanged, true);
  assert.equal(result.stateMutationAudit.mtajiUnchanged, true);

  const independentInitial = [1, 2, 3].map((depth) => Legacy.analyzeRootCandidates(initial, depth, BASE_OPTIONS));
  for (let i = 0; i < independentInitial.length; i += 1) {
    const recorded = result.exactLegacyAgreement.initial[i];
    const legacy = independentInitial[i];
    assert.equal(recorded.depth, i + 1);
    verifyCurrentAgainstLegacy(recorded.current, legacy);
    assert.equal(recorded.allRootScoresEqual, true);
    assert.equal(recorded.topSetEqual, true);
    assert.equal(recorded.bestScoreEqual, true);
  }
  const independentMtaji = Legacy.analyzeRootCandidates(mtaji, 4, BASE_OPTIONS);
  verifyCurrentAgainstLegacy(result.exactLegacyAgreement.mtaji.current, independentMtaji);

  const costs = independentInitial.map(({ aggregateCounters }) => aggregateCounters.nodes);
  assert.deepEqual(result.budgetAudit.exactStandaloneNodeCosts, {
    depth1: costs[0], depth2: costs[1], depth3: costs[2],
  });
  for (const item of result.budgetAudit.grid) {
    const expected = expectedCompletedDepth(costs, item.budget);
    assert.equal(item.condition.completedDepth, expected, `budget completedDepth mismatch: ${item.id}`);
    assert.equal(item.condition.estimable, expected > 0, `budget estimability mismatch: ${item.id}`);
    if (expected > 0) verifyCurrentAgainstLegacy(item.condition, independentInitial[expected - 1]);
  }
  assert.equal(result.budgetAudit.grid.find(({ id }) => id === "below-d1").condition.completedDepth, 0);
  assert.equal(result.budgetAudit.grid.find(({ id }) => id === "last-complete-d1").condition.completedDepth, 1);
  assert.equal(result.budgetAudit.grid.find(({ id }) => id === "through-d2").condition.completedDepth, 2);
  assert.equal(result.budgetAudit.grid.find(({ id }) => id === "through-d3").condition.completedDepth, 3);

  for (const item of result.quiescenceAudit.depthGrid) {
    const independent = Legacy.analyzeRootCandidates(initial, 2, {
      evaluationProfile: "bao",
      quiescenceDepth: item.quiescenceDepth,
      orderQuiescenceCaptures: false,
    });
    verifyCurrentAgainstLegacy(item.condition, independent);
  }
  for (const item of result.quiescenceAudit.captureOrderingGrid) {
    const independent = Legacy.analyzeRootCandidates(initial, 2, {
      evaluationProfile: "bao",
      quiescenceDepth: 1,
      orderQuiescenceCaptures: item.orderQuiescenceCaptures,
    });
    verifyCurrentAgainstLegacy(item.condition, independent);
  }

  const baselineScores = scoreMap(independentInitial[1]);
  for (const item of result.moveOrderingAudit) assert.deepEqual(item.condition.result.scoreByMoveKey, baselineScores);
  assert.equal(result.deterministicReplayAudit.equal, true);
  assert.equal(result.deterministicReplayAudit.firstHash, result.deterministicReplayAudit.secondHash);
  assert.equal(result.pvAudit.firstMoveEqualsCanonicalBest, true);
  assert.equal(result.pvAudit.scoreEqualsBestScore, true);

  const pvRecorded = result.exactLegacyAgreement.initial[1].current.principalVariation;
  const pvIndependent = independentCanonicalPv(initial, independentInitial[1], 2, 1);
  assert.deepEqual(pvRecorded.moveKeys, pvIndependent.moveKeys, "independent canonical PV mismatch");
  assert.equal(pvRecorded.score, pvIndependent.score, "independent canonical PV score mismatch");

  console.log(JSON.stringify({
    stageId: result.stageId,
    passed: true,
    exactConditionsVerified: 4,
    budgetConditionsVerified: result.budgetAudit.grid.length,
    quiescenceConditionsVerified: result.quiescenceAudit.depthGrid.length
      + result.quiescenceAudit.captureOrderingGrid.length,
    moveOrderingConditionsVerified: result.moveOrderingAudit.length,
    canonicalPvVerified: true,
    sourceHashesVerified: Object.keys(result.sourceFileSha256).length,
    resultHash: result.resultHash,
    scientificSeedConsumed: false,
    formalEvidenceAuthorized: false,
  }, null, 2));
}

main();
