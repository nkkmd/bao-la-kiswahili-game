"use strict";
const assert = require("node:assert/strict");
const M = require("../g5-01/measurement.cjs"), Micro = require("../g5-method/microstate-check.cjs");

class Stop extends Error {
  constructor(code, witness = null) { super(code); this.code = code; this.witness = witness; }
}
const order = moves => [...moves].sort((a, b) => M.moveKey(a) < M.moveKey(b) ? -1 : 1);
const normalized = s => ({ ...M.raw(s), reason: s.reason ?? "", turn: s.turn });
function draw(random, width) {
  assert.ok(Number.isSafeInteger(width) && width > 0 && width <= 0xffffffff);
  const ceiling = Math.floor(0x100000000 / width) * width, draws = [];
  do { random ^= random << 13; random ^= random >>> 17; random ^= random << 5; random >>>= 0; draws.push(random); } while (random >= ceiling);
  return { random, draws, index: random % width };
}
function summary(r) {
  Micro.check(r);
  return { status: r.status, to: r.state ? M.rawKey(r.state) : null,
    metadata: r.state ? { reason: r.state.reason ?? "", turn: r.state.turn } : null,
    relays: r.relays, microstateCount: r.microstates.length, microstateHash: M.digest(r.microstates), cycle: r.cycle,
    witness: r.state ? null : r };
}
function rawStates(r) {
  return [...(r.state ? [r.state] : []), ...r.microstates.filter(s => s.pits).map(s => ({ ...s, winner: null }))];
}
function structural(root, branches, spec) {
  // 判定器へ勝者名・値・DTF・探索順位を渡さない。
  if (root.nonterminal !== true || root.phase !== "mtaji" || root.reserve.length !== 2 || root.reserve.some(v => v !== 0)
    || !Number.isInteger(root.width) || root.width < spec.minRootWidth || root.width > spec.maxRootWidth) return "ROOT-EXCLUDED";
  if (branches.length !== root.width || branches.some(b => typeof b.nonterminal !== "boolean" || !Number.isInteger(b.width))) return "UNKNOWN";
  if (branches.some(b => !b.nonterminal)) return "TERMINAL-CHILD-EXCLUDED";
  if (branches.some(b => b.width < spec.minReplyWidth || b.width > spec.maxReplyWidth)) return "REPLY-WIDTH-EXCLUDED";
  if (branches.reduce((a, b) => a + b.width, 0) > spec.maxAggregateReplyWidth) return "AGGREGATE-WIDTH-EXCLUDED";
  if (branches.some(b => !["capture", "takata"].includes(b.mode))) return "MODE-EXCLUDED";
  return branches.some(b => b.mode === "capture") && branches.some(b => b.mode === "takata")
    ? "BRANCH-ENVELOPE-ELIGIBLE" : "HOMOGENEOUS-REPLY-EXCLUDED";
}
function paired(primary, reference, hooks = {}) {
  const check = hooks.check ?? (() => {}), observe = hooks.observe ?? (() => {});
  function outcome(r, context) {
    Micro.check(r);
    for (const s of rawStates(r)) {
      try { observe(s, context, { record: r }); }
      catch (error) { if (error instanceof Stop) error.witness = { cause: error.witness, context, state: s, record: r }; throw error; }
    }
  }
  return {
    variants(s) {
      check(); observe(s, "LEGAL-ROOT");
      const a = primary.variants(s), b = reference.variants(s);
      assert.deepEqual(a.probes, b.probes, "LEGAL-PROBE-MISMATCH");
      for (const r of a.probes) outcome(r, "LEGAL-PROBE");
      const moves = order(a.moves), other = order(b.moves);
      assert.deepEqual(moves.map(M.moveKey), other.map(M.moveKey), "LEGAL-SET-MISMATCH");
      assert.equal(new Set(moves.map(M.moveKey)).size, moves.length);
      return { moves, probes: a.probes };
    },
    apply(s, move) {
      check(); const a = primary.apply(s, move), b = reference.apply(s, move);
      assert.deepEqual(a, b, "SCIENTIFIC-TRANSITION-MISMATCH"); outcome(a, "TRANSITION"); return a;
    }
  };
}
function screen(state, ply, spec, api, observe = () => {}) {
  const reads = new Set([M.rawKey(state)]);
  function remember(r) { for (const s of rawStates(r)) { reads.add(M.rawKey(s)); observe(s, "SCREEN"); } }
  const options = api.variants(state); options.probes.forEach(remember);
  const result = { ply, root: M.rawKey(state), width: options.moves.length, branches: [], status: null, readIdentities: [] };
  for (const move of options.moves) {
    const r = api.apply(state, move); remember(r);
    const branch = { moveKey: M.moveKey(move), outcome: summary(r), nonterminal: r.state?.winner === null, replies: [] };
    result.branches.push(branch);
    if (r.status !== "TERMINATED") { result.status = "SCREEN-" + r.status; break; }
    const replies = api.variants(r.state); replies.probes.forEach(remember);
    branch.replyKeys = replies.moves.map(M.moveKey);
    for (const reply of replies.moves) {
      const next = api.apply(r.state, reply); remember(next);
      branch.replies.push({ moveKey: M.moveKey(reply), outcome: summary(next) });
      if (next.status !== "TERMINATED") { result.status = "SCREEN-REPLY-" + next.status; break; }
    }
    if (result.status) break;
  }
  if (!result.status) result.status = structural({ nonterminal: state.winner === null, phase: state.phase,
    reserve: state.reserve, width: options.moves.length }, result.branches.map(b => {
    const types = new Set(b.replyKeys.map(k => JSON.parse(k).type));
    return { nonterminal: b.nonterminal, width: b.replyKeys.length, mode: types.size === 1 ? [...types][0] : "mixed" };
  }), spec);
  result.readIdentities = [...reads].sort(); return result;
}
function fixtureAccess(seed, context) {
  assert.equal(context?.evidenceClass, "TECHNICAL-FIXTURE");
  assert.ok(context.fixtureId && Array.isArray(context.allowedSeeds) && context.allowedSeeds.includes(seed), "FIXTURE-SEED-NOT-ALLOWLISTED");
  assert.ok(Number.isInteger(seed) && seed > 0 && seed <= 0xffffffff);
  assert.ok(seed < 50613001 || seed > 50613128, "PROPOSED-SCIENTIFIC-SEED-REFUSED");
}
function generateFixture(seed, spec, initial, api, exclusions, context, hooks = {}) {
  fixtureAccess(seed, context);
  const source = { fixtureId: context.fixtureId, evidenceClass: "TECHNICAL-FIXTURE", seed, trace: [], screens: [],
    firstEligible: null, finalState: initial, stop: null, candidate: null, selectionStatus: null };
  let state = structuredClone(initial), random = seed, ply = 0;
  const emit = hooks.emit ?? (() => {}), observe = hooks.observe ?? (() => {}), check = hooks.check ?? (() => {});
  // fixtureにも読取前markerを置く。科学用consume marker/leaseの代用にはしない。
  emit({ kind: "fixture-seed", seed, fixtureId: context.fixtureId }); observe(state, "SOURCE-INITIAL");
  try {
    for (; ply <= spec.maxPly; ply++) {
      check(); source.finalState = state;
      if (state.winner !== null) { source.stop = "NATURAL-TERMINAL"; break; }
      const options = api.variants(state), width = options.moves.length;
      assert.ok(width, "SOURCE-NONTERMINAL-NO-MOVES");
      if (ply >= spec.minCandidatePly && state.phase === "mtaji" && state.reserve.every(v => v === 0)
        && width >= spec.minRootWidth && width <= spec.maxRootWidth) {
        const examined = screen(state, ply, spec, api, observe);
        source.screens.push(examined); emit({ kind: "source-screen", screen: examined });
        if (examined.status === "BRANCH-ENVELOPE-ELIGIBLE" && source.firstEligible === null)
          source.firstEligible = { ply, raw: M.rawKey(state), state: structuredClone(state), screenIndex: source.screens.length - 1 };
        if (examined.status.startsWith("SCREEN-")) { source.stop = examined.status; break; }
      }
      if (ply === spec.maxPly) { source.stop = "PLY-LIMIT"; break; }
      const picked = draw(random, width), move = options.moves[picked.index], r = api.apply(state, move);
      for (const s of rawStates(r)) observe(s, "SOURCE-TRANSITION");
      const row = { ply, randomBefore: random, draws: picked.draws, moveKey: M.moveKey(move), move,
        rawBefore: M.rawKey(state), outcome: summary(r) };
      if (r.status !== "TERMINATED") { source.stopped = row; source.stop = r.status; emit({ kind: "source-stop", row }); break; }
      emit({ kind: "source-step", row }); source.trace.push(row);
      state = r.state; random = picked.random; source.finalState = state;
      if ((ply + 1) % spec.checkpointSourcePlyInterval === 0) hooks.checkpoint?.(source);
    }
  } catch (error) {
    if (!(error instanceof Stop)) throw error;
    source.stop = error.code; source.interruption = { ply, witness: error.witness, verification: "PREFIX-ONLY-NOT-FULL" };
  }
  source.finalState = state;
  const first = source.firstEligible;
  const overlap = first ? source.screens[first.screenIndex].readIdentities.some(id => exclusions.has(id)) : false;
  const regular = ["NATURAL-TERMINAL", "PLY-LIMIT"].includes(source.stop);
  source.selectionStatus = !regular ? "SOURCE-FAILURE-NO-CANDIDATE" : !first ? "NO-STRUCTURAL-ROOT"
    : overlap ? "FIRST-ROOT-OVERLAP-EXCLUDED" : "FIRST-ROOT-FROZEN";
  if (regular && first && !overlap) source.candidate = { raw: first.raw, ply: first.ply, state: first.state };
  hooks.checkpoint?.(source, { final: true }); return source;
}
function freezeCandidates(sources, count) {
  const roots = new Set(), candidates = [], dispositions = [];
  for (const source of sources) {
    if (!source.candidate) { dispositions.push({ fixtureId: source.fixtureId, status: source.selectionStatus }); continue; }
    const duplicate = roots.has(source.candidate.raw); roots.add(source.candidate.raw);
    dispositions.push({ fixtureId: source.fixtureId, status: duplicate ? "DUPLICATE-FIRST-ROOT-EXCLUDED" : candidates.length >= count ? "UNSELECTED-NO-REPLACEMENT" : "FROZEN" });
    if (!duplicate && candidates.length < count) candidates.push({ fixtureId: source.fixtureId, ...source.candidate });
  }
  return { candidates, dispositions };
}
module.exports = { Stop, order, normalized, draw, summary, rawStates, structural, paired, screen, generateFixture, freezeCandidates };
