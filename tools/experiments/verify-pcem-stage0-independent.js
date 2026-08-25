#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const Raw = require("./lib/ssgtc-representation-independent.js");

const WIN = 1_000_000;
const SEARCH_SEMANTICS = "pcem-exact-full-window-root-candidates/bao/q0/v1";

function parseArgs(argv) {
  const out = { input: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") out.input = path.resolve(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!out.input) throw new Error("--input is required");
  out.output ||= path.join(path.dirname(out.input), "independent-verification.json");
  return out;
}
function normalizeMove(move) {
  const out = {};
  for (const f of ["type","phase","row","index","direction","side","houseChoice"]) if (move[f] !== undefined) out[f] = move[f];
  if (move.houseTwo === true) out.houseTwo = true;
  return out;
}
function exactMoves(state) {
  Raw.assertStudyState(state);
  assert.equal(state.winner, null);
  return E.moveVariants(state).map(normalizeMove).sort((a,b) => Raw.moveIdentity(a).localeCompare(Raw.moveIdentity(b)));
}
function exactMove(state, moveLike) {
  const key = Raw.moveIdentity(moveLike);
  const found = exactMoves(state).find((m) => Raw.moveIdentity(m) === key);
  assert.ok(found, `independent exact move not found: ${key}`);
  return found;
}
function apply(state, moveLike) {
  Raw.assertStudyState(state);
  const move = exactMove(state, moveLike);
  const applied = E.applyMove(state, move);
  Raw.assertStudyState(applied.state);
  return { move, state: applied.state };
}
function terminalScore(state, actor, ply) {
  if (state.winner === null) return null;
  return state.winner === actor ? WIN - ply : -WIN + ply;
}
function searchValue(state, depth, actor, ply, counters) {
  Raw.assertStudyState(state);
  counters.nodes += 1;
  const terminal = terminalScore(state, actor, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) { counters.evaluations += 1; return AI.evaluateWithProfile(state, actor, "bao"); }
  const legal = exactMoves(state);
  const maximizing = state.player === actor;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of legal) {
    const value = searchValue(apply(state, move).state, depth - 1, actor, ply + 1, counters);
    best = maximizing ? Math.max(best, value) : Math.min(best, value);
  }
  return best;
}
function referenceSearch(state, depth) {
  Raw.assertStudyState(state);
  const actor = state.player;
  const candidates = exactMoves(state).map((move) => {
    const counters = { nodes: 0, evaluations: 0 };
    const score = searchValue(apply(state, move).state, depth - 1, actor, 1, counters);
    return { move, moveKey: Raw.moveIdentity(move), score, counters };
  });
  const ranked = candidates.slice().sort((a,b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSetMoveKeys = ranked.filter((r) => r.score === bestScore).map((r) => r.moveKey).sort();
  return { searchSemantics: SEARCH_SEMANTICS, rawStateKey: Raw.key(state), actor, phase: state.phase, depth,
    legalMoveCount: ranked.length, bestScore, topSetMoveKeys, canonicalBestMoveKey: topSetMoveKeys[0],
    candidates: ranked.map((r,i) => ({ ...r, ordinal: i + 1, scoreRank: 1 + ranked.filter((x) => x.score > r.score).length, isTopSet: r.score === bestScore })),
    aggregateCounters: ranked.reduce((a,r) => ({ nodes: a.nodes + r.counters.nodes, evaluations: a.evaluations + r.counters.evaluations }), { nodes:0, evaluations:0 }) };
}
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => { value += 0x6D2B79F5; let next = value; next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61); return ((next ^ (next >>> 14)) >>> 0) / 4294967296; };
}
function deriveSeed(root, replicateIndex, stageSalt) {
  const material = `${stageSalt}|${Raw.key(root)}|${root.player}|${replicateIndex}`;
  return Number.parseInt(Raw.sha256(material).slice(0,8), 16) >>> 0;
}
function select(state, policyId, random) {
  const legal = exactMoves(state);
  if (policyId === "P_REFERENCE_D2_BEST") {
    const t = referenceSearch(state,2); const move = legal.find((m) => Raw.moveIdentity(m) === t.canonicalBestMoveKey);
    return { move, moveKey: t.canonicalBestMoveKey, poolMoveKeys: t.topSetMoveKeys };
  }
  if (policyId === "P_MEDIUM_D1_TOP3") {
    const t = referenceSearch(state,1); const pool = t.candidates.slice(0, Math.min(3,t.candidates.length));
    const picked = pool[Math.floor(random() * pool.length)]; const move = legal.find((m) => Raw.moveIdentity(m) === picked.moveKey);
    return { move, moveKey: picked.moveKey, poolMoveKeys: pool.map((r) => r.moveKey) };
  }
  assert.equal(policyId, "P_SHALLOW_UNIFORM");
  const move = legal[Math.floor(random() * legal.length)];
  return { move, moveKey: Raw.moveIdentity(move), poolMoveKeys: legal.map(Raw.moveIdentity) };
}
function outcome(state, rootActor, horizonExhausted) {
  if (state.winner !== null) return { category: state.winner === rootActor ? "ROOT_ACTOR_TERMINAL_WIN" : "ROOT_ACTOR_TERMINAL_LOSS", winner: state.winner, reason: state.reason || "" };
  if (horizonExhausted) return { category: "ADMINISTRATIVE_HORIZON_EXHAUSTED", winner: null, reason: "post-root-horizon" };
  return { category: "TECHNICALLY_INVALID", winner: null, reason: "unaccounted-nonterminal" };
}
function continuation(root, rootMove, replicateIndex, options) {
  const rootActor = root.player;
  const seed32 = deriveSeed(root, replicateIndex, options.stageSalt);
  const random = seededRandom(seed32);
  const first = apply(root, rootMove);
  let state = first.state;
  const moves = [];
  for (let ply = 0; ply < options.maxPostRootPlies && state.winner === null; ply += 1) {
    const policyId = state.player === rootActor ? options.actorPolicyId : options.opponentPolicyId;
    const picked = select(state, policyId, random);
    const applied = apply(state, picked.move);
    moves.push({ postRootPly: ply, player: state.player, policyId, moveKey: picked.moveKey,
      poolMoveKeys: picked.poolMoveKeys, afterRawStateKey: Raw.key(applied.state) });
    state = applied.state;
  }
  return { schemaVersion:1, stageSalt: options.stageSalt, rootRawStateKey: Raw.key(root), rootActor,
    rootMoveKey: Raw.moveIdentity(first.move), replicateIndex, seed32, actorPolicyId: options.actorPolicyId,
    opponentPolicyId: options.opponentPolicyId, maxPostRootPlies: options.maxPostRootPlies, moves,
    outcome: outcome(state, rootActor, state.winner === null && moves.length >= options.maxPostRootPlies), finalRawStateKey: Raw.key(state) };
}
function canonicalHash(value) { return Raw.sha256(Raw.canonical(value)); }
function stripHash(record) { const c = { ...record }; delete c.recordSha256; return c; }

function main() {
  const args = parseArgs(process.argv.slice(2));
  const artifact = JSON.parse(fs.readFileSync(args.input, "utf8"));
  const gates = {};
  assert.equal(artifact.studyId, "PCEM-STUDY1");
  assert.equal(artifact.scientificInferenceAuthorized, false);
  gates.rawIdentity = artifact.roots.every((root) => { Raw.assertStudyState(root.rawState); return Raw.key(root.rawState) === root.rawStateKey && Raw.seedCount(root.rawState) === 64; });
  gates.legalMoves = true; gates.moveApplication = true; gates.replyEnumeration = true; gates.referenceSearch = true;
  gates.continuation = true; gates.hashBinding = true;
  let verifiedRootMoves = 0, verifiedReplyMoves = 0, verifiedContinuations = 0;

  for (const rootRow of artifact.roots) {
    const root = rootRow.rawState;
    const legal = exactMoves(root);
    assert.deepEqual(legal.map(Raw.moveIdentity), rootRow.legalMoveKeys);
    for (const depth of [2,3]) {
      assert.deepEqual(referenceSearch(root, depth), rootRow.reference[`D${depth}`]);
    }
    for (let i = 0; i < legal.length; i += 1) {
      const move = legal[i];
      const stored = rootRow.replies[i];
      assert.equal(Raw.moveIdentity(move), stored.rootMoveKey);
      const child = apply(root, move).state;
      assert.equal(Raw.key(child), stored.successorRawStateKey);
      verifiedRootMoves += 1;
      if (child.winner !== null) {
        assert.equal(stored.terminalAfterRootMove, true);
        assert.equal(stored.legalReplyCount, 0);
      } else {
        const replies = exactMoves(child);
        assert.deepEqual(replies.map(Raw.moveIdentity), stored.legalReplyMoveKeys);
        assert.deepEqual(referenceSearch(child,2), stored.referenceReplyTable);
        assert.deepEqual(stored.referenceBestReplyMoveKeys, stored.referenceReplyTable.topSetMoveKeys);
        verifiedReplyMoves += replies.length;
      }
    }
    for (const stored of rootRow.continuations) {
      const rootMove = legal.find((m) => Raw.moveIdentity(m) === stored.rootMoveKey);
      const recomputed = continuation(root, rootMove, stored.replicateIndex, {
        stageSalt: artifact.design.stageSalt, actorPolicyId: stored.actorPolicyId,
        opponentPolicyId: stored.opponentPolicyId, maxPostRootPlies: stored.maxPostRootPlies,
      });
      assert.deepEqual(recomputed, stripHash(stored));
      assert.equal(canonicalHash(recomputed), stored.recordSha256);
      verifiedContinuations += 1;
    }
  }
  const source = fs.readFileSync(__filename, "utf8");
  gates.independence = !/practical-comeback-stage0-production/.test(source)
    && !/critical-positions-outcome-branching/.test(source)
    && !/position-complexity-search-diagnostic/.test(source);
  const passed = Object.values(gates).every(Boolean);
  const result = { schemaVersion:1, studyId:artifact.studyId, stageId:artifact.stageId,
    scientificInferenceAuthorized:false, decision: passed ? "TECHNICAL-PASS" : "TECHNICALLY-INVALID",
    passed, gates, verified: { roots: artifact.roots.length, rootMoves: verifiedRootMoves,
      replyMoves: verifiedReplyMoves, continuations: verifiedContinuations },
    productionSha256Matches: artifact.productionSha256 === canonicalHash(Object.fromEntries(Object.entries(artifact).filter(([k]) => k !== "productionSha256"))) };
  assert.equal(result.productionSha256Matches, true);
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}
try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
