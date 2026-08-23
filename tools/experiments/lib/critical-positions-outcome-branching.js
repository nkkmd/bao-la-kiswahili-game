"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const {
  identityKeys,
  stableStringify,
} = require("./position-typology-features.js");
const Search = require("./position-complexity-search-diagnostic.js");
const Tactical = require("./tactical-motif-features.js");

const SCHEMA_VERSION = 1;
const TECHNICAL_STAGE_SALT = "CPOB-S0-TECHNICAL-2026-08-23-v1";
const POLICY_IDS = Object.freeze(["P1_NORMAL_TOP3", "P2_D2_TOP3", "P3_UNIFORM_LEGAL"]);
const SEARCH_OPTIONS = Object.freeze({
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalHash(value) {
  return sha256(stableStringify(value));
}

function assertNonterminalRoot(state) {
  if (!state || state.winner !== null) throw new Error("Expected nonterminal root state");
}

function exactLegalMoves(state) {
  assertNonterminalRoot(state);
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function exactMove(state, move) {
  const key = AI.moveKey(move);
  const matched = exactLegalMoves(state).find((candidate) => AI.moveKey(candidate) === key);
  if (!matched) throw new Error(`Move is not an exact legal moveVariant: ${key}`);
  return matched;
}

function deriveReplicateSeed32(root, replicateIndex, stageSalt = TECHNICAL_STAGE_SALT) {
  assertNonterminalRoot(root);
  if (!Number.isInteger(replicateIndex) || replicateIndex < 0) {
    throw new Error(`Invalid replicateIndex: ${replicateIndex}`);
  }
  const identity = identityKeys(root);
  const material = `${stageSalt}|${identity.ruleStateKey}|${root.player}|${replicateIndex}`;
  return Number.parseInt(sha256(material).slice(0, 8), 16) >>> 0;
}

function createPolicySelector(policyId, seed32) {
  if (!POLICY_IDS.includes(policyId)) throw new Error(`Unknown policy: ${policyId}`);
  const random = seededRandom(seed32 >>> 0);
  return (state) => {
    assertNonterminalRoot(state);
    const legal = exactLegalMoves(state);
    if (!legal.length) throw new Error("Policy selector received state with no legal moves");

    if (policyId === "P1_NORMAL_TOP3") {
      const analyzed = AI.analyzeMove(state, "normal", random, { evaluationProfile: "bao" });
      const selectedKey = AI.moveKey(analyzed.move);
      const selected = legal.find((move) => AI.moveKey(move) === selectedKey);
      if (!selected) throw new Error("P1 selected a non-variant legal move");
      return {
        move: selected,
        moveKey: selectedKey,
        policyId,
        diagnostic: { completedDepth: analyzed.stats.completedDepth },
      };
    }

    if (policyId === "P2_D2_TOP3") {
      const diagnostic = Search.analyzeRootCandidates(state, 2, SEARCH_OPTIONS);
      const pool = diagnostic.candidates.slice(0, Math.min(3, diagnostic.candidates.length));
      const index = Math.floor(random() * pool.length);
      const selectedKey = pool[index].moveKey;
      const selected = legal.find((move) => AI.moveKey(move) === selectedKey);
      if (!selected) throw new Error("P2 selected a move outside exact legal variants");
      return {
        move: selected,
        moveKey: selectedKey,
        policyId,
        diagnostic: {
          searchSemantics: diagnostic.searchSemantics,
          depth: diagnostic.depth,
          poolMoveKeys: pool.map((item) => item.moveKey),
          bestScore: diagnostic.bestScore,
          aggregateCounters: diagnostic.aggregateCounters,
        },
      };
    }

    const index = Math.floor(random() * legal.length);
    const selected = legal[index];
    return {
      move: selected,
      moveKey: AI.moveKey(selected),
      policyId,
      diagnostic: { legalMoveCount: legal.length },
    };
  };
}

function encodeTerminal(state, rootActor) {
  if (state.winner === null) return null;
  return {
    category: state.winner === rootActor ? "ROOT_ACTOR_WIN" : "ROOT_ACTOR_LOSS",
    winner: state.winner,
    reason: state.reason || "",
  };
}

function runContinuation(root, rootMove, replicateIndex, options = {}) {
  assertNonterminalRoot(root);
  const before = stableStringify(root);
  const rootActor = root.player;
  const policyId = options.policyId || "P1_NORMAL_TOP3";
  const maxContinuationPlies = options.maxContinuationPlies ?? 80;
  const stageSalt = options.stageSalt || TECHNICAL_STAGE_SALT;
  if (!Number.isInteger(maxContinuationPlies) || maxContinuationPlies < 0) {
    throw new Error(`Invalid maxContinuationPlies: ${maxContinuationPlies}`);
  }

  const move = exactMove(root, rootMove);
  const rootMoveKey = AI.moveKey(move);
  const seed32 = deriveReplicateSeed32(root, replicateIndex, stageSalt);
  let state = E.applyMove(root, move).state;
  const continuationMoves = [];
  const rootTerminal = encodeTerminal(state, rootActor);

  if (!rootTerminal) {
    const select = createPolicySelector(policyId, seed32);
    for (let continuationPly = 0; continuationPly < maxContinuationPlies; continuationPly += 1) {
      if (state.winner !== null) break;
      const selection = select(state);
      const applied = E.applyMove(state, selection.move);
      continuationMoves.push({
        continuationPly,
        player: state.player,
        moveKey: selection.moveKey,
        policyId,
        diagnostic: selection.diagnostic,
        afterRuleStateKey: identityKeys(applied.state).ruleStateKey,
      });
      state = applied.state;
    }
  }

  const terminal = encodeTerminal(state, rootActor);
  const outcome = terminal || {
    category: "ADMINISTRATIVE_UNFINISHED",
    winner: null,
    reason: "continuation-cap",
  };
  const result = {
    schemaVersion: SCHEMA_VERSION,
    rootActor,
    rootIdentity: identityKeys(root),
    rootMoveKey,
    replicateIndex,
    seed32,
    policyId,
    maxContinuationPlies,
    continuationMoves,
    outcome,
    finalIdentity: identityKeys(state),
    finalPhase: state.phase,
    finalTurn: state.turn,
  };
  result.recordHash = canonicalHash({ ...result, recordHash: undefined });
  if (stableStringify(root) !== before) throw new Error("Continuation executor mutated root state");
  return result;
}

function summarizeOutcomes(records) {
  const counts = {
    ROOT_ACTOR_WIN: 0,
    ROOT_ACTOR_LOSS: 0,
    ADMINISTRATIVE_UNFINISHED: 0,
  };
  for (const record of records) counts[record.outcome.category] += 1;
  const completed = counts.ROOT_ACTOR_WIN + counts.ROOT_ACTOR_LOSS;
  return {
    counts,
    total: records.length,
    completed,
    completionRate: records.length ? completed / records.length : null,
    empiricalContinuationWinRateCompleted: completed ? counts.ROOT_ACTOR_WIN / completed : null,
  };
}

function measureRoot(root, options = {}) {
  assertNonterminalRoot(root);
  const before = stableStringify(root);
  const policyId = options.policyId || "P1_NORMAL_TOP3";
  const replicates = options.replicates ?? 8;
  const maxContinuationPlies = options.maxContinuationPlies ?? 80;
  if (!Number.isInteger(replicates) || replicates < 1) throw new Error(`Invalid replicates: ${replicates}`);

  const moves = exactLegalMoves(root).map((move) => {
    const records = Array.from({ length: replicates }, (_, replicateIndex) => runContinuation(
      root, move, replicateIndex, { policyId, maxContinuationPlies, stageSalt: options.stageSalt },
    ));
    return {
      moveKey: AI.moveKey(move),
      move: clone(move),
      summary: summarizeOutcomes(records),
      records,
    };
  });
  const rates = moves.map((item) => item.summary.empiricalContinuationWinRateCompleted);
  const finiteRates = rates.filter((value) => Number.isFinite(value));
  const allMovesFullyCompleted = moves.every((item) => item.summary.completed === replicates);
  const dRangeCompletedOnly = finiteRates.length === moves.length
    ? Math.max(...finiteRates) - Math.min(...finiteRates)
    : null;
  const result = {
    schemaVersion: SCHEMA_VERSION,
    rootActor: root.player,
    rootIdentity: identityKeys(root),
    phase: root.phase,
    policyId,
    replicates,
    maxContinuationPlies,
    legalMoveCount: moves.length,
    allMovesFullyCompleted,
    dRangeCompletedOnly,
    moves,
  };
  result.measurementHash = canonicalHash({ ...result, measurementHash: undefined });
  if (stableStringify(root) !== before) throw new Error("Root measurement mutated root state");
  return result;
}

function structuralBranchSummary(root) {
  assertNonterminalRoot(root);
  return exactLegalMoves(root).map((move) => ({
    moveKey: AI.moveKey(move),
    transition: Tactical.summarizeMoveTransition(root, move),
    responseEnvelope: Tactical.summarizeReplyEnvelope(root, move),
  }));
}

function secondarySearchAxes(root) {
  assertNonterminalRoot(root);
  return Search.analyzeDepthTrace(root, [2, 3], SEARCH_OPTIONS);
}

module.exports = {
  POLICY_IDS,
  SCHEMA_VERSION,
  SEARCH_OPTIONS,
  TECHNICAL_STAGE_SALT,
  canonicalHash,
  createPolicySelector,
  deriveReplicateSeed32,
  encodeTerminal,
  exactLegalMoves,
  measureRoot,
  runContinuation,
  secondarySearchAxes,
  structuralBranchSummary,
  summarizeOutcomes,
};
