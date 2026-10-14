"use strict";
// 主source、主構造判定、主PRNGをimportしない。保存prefix以上を生成しない。
const assert = require("node:assert/strict"), M = require("../g5-01/measurement.cjs"), Micro = require("../g5-method/microstate-check.cjs");
const sorted = xs => [...xs].sort((a, b) => M.moveKey(a) < M.moveKey(b) ? -1 : 1);
function detail(r) {
  Micro.check(r);
  return { status: r.status, to: r.state === null ? null : M.rawKey(r.state),
    metadata: r.state === null ? null : { reason: r.state.reason ?? "", turn: r.state.turn },
    relays: r.relays, microstateCount: r.microstates.length, microstateHash: M.digest(r.microstates), cycle: r.cycle,
    witness: r.state === null ? r : null };
}
function inspect(state, ply, spec, api) {
  const rootOptions = api.variants(state), moves = sorted(rootOptions.moves), ids = new Set([M.rawKey(state)]);
  function collect(r) {
    Micro.check(r);
    if (r.state) ids.add(M.rawKey(r.state));
    for (const v of r.microstates) if (v.pits) ids.add(M.rawKey({ ...v, winner: null }));
  }
  rootOptions.probes.forEach(collect);
  const result = { ply, root: M.rawKey(state), width: moves.length, branches: [], status: null, readIdentities: [] };
  for (const m of moves) {
    const r = api.apply(state, m); collect(r);
    const branch = { moveKey: M.moveKey(m), outcome: detail(r), nonterminal: r.state?.winner === null, replies: [] };
    result.branches.push(branch);
    if (!r.state) { result.status = "SCREEN-" + r.status; break; }
    const choices = api.variants(r.state); choices.probes.forEach(collect);
    const replies = sorted(choices.moves); branch.replyKeys = replies.map(M.moveKey);
    for (const reply of replies) {
      const next = api.apply(r.state, reply); collect(next);
      branch.replies.push({ moveKey: M.moveKey(reply), outcome: detail(next) });
      if (!next.state) { result.status = "SCREEN-REPLY-" + next.status; break; }
    }
    if (result.status) break;
  }
  if (!result.status) {
    const widths = result.branches.map(b => b.replyKeys.length);
    const modes = result.branches.map(b => {
      const types = b.replyKeys.map(k => JSON.parse(k).type);
      return types.every(t => t === types[0]) ? types[0] : "mixed";
    });
    result.status = result.branches.some(b => !b.nonterminal) ? "TERMINAL-CHILD-EXCLUDED"
      : widths.some(w => w < spec.minReplyWidth || w > spec.maxReplyWidth) ? "REPLY-WIDTH-EXCLUDED"
      : widths.reduce((a, b) => a + b, 0) > spec.maxAggregateReplyWidth ? "AGGREGATE-WIDTH-EXCLUDED"
      : modes.some(m => m !== "capture" && m !== "takata") ? "MODE-EXCLUDED"
      : modes.includes("capture") && modes.includes("takata") ? "BRANCH-ENVELOPE-ELIGIBLE" : "HOMOGENEOUS-REPLY-EXCLUDED";
  }
  result.readIdentities = [...ids].sort(); return result;
}
function replay(source, spec, initial, api, excluded, context) {
  require("./science-gate.cjs").openScience();
  assert.equal(source.evidenceClass, "BEFCS-SCIENTIFIC-SOURCE");
  assert.equal(source.sourceId, context.sourceId); assert.equal(source.seed,50613001+context.index);
  assert.ok(source.seed >= 50613001 && source.seed <= 50613128);
  assert.ok(source.trace.length <= spec.maxPly);
  let state = structuredClone(initial), random = source.seed, screenIndex = 0, first = null;
  function examine(ply, permitMissing = false) {
    const moves = sorted(api.variants(state).moves);
    if (state.winner === null && state.phase === "mtaji" && state.reserve[0] === 0 && state.reserve[1] === 0
      && ply >= spec.minCandidatePly && moves.length >= spec.minRootWidth && moves.length <= spec.maxRootWidth) {
      if (permitMissing && !source.screens[screenIndex]) return null;
      const expected = inspect(state, ply, spec, api);
      assert.deepEqual(source.screens[screenIndex], expected, "INDEPENDENT-SCREEN-MISMATCH");
      if (expected.status === "BRANCH-ENVELOPE-ELIGIBLE" && first === null)
        first = { ply, raw: M.rawKey(state), state: structuredClone(state), screenIndex };
      screenIndex++; return expected;
    }
    return null;
  }
  function select(row, options) {
    assert.equal(row.randomBefore, random); assert.ok(row.draws.length > 0);
    const width = options.length, acceptedBelow = 4294967296 - (4294967296 % width);
    for (let i = 0; i < row.draws.length; i++) {
      let next = random >>> 0; next ^= next << 13; next ^= next >>> 17; next ^= next << 5; random = next >>> 0;
      assert.equal(row.draws[i], random); assert.equal(random < acceptedBelow, i === row.draws.length - 1);
    }
    const move = options[random % width]; assert.equal(M.moveKey(move), row.moveKey); assert.equal(M.moveKey(row.move), row.moveKey); return move;
  }
  for (let ply = 0; ply < source.trace.length; ply++) {
    assert.equal(state.winner, null);
    const screen = examine(ply); assert.ok(!screen?.status.startsWith("SCREEN-"), "SKIPPED-FATAL-SCREEN");
    const options = sorted(api.variants(state).moves), row = source.trace[ply];
    assert.equal(row.ply, ply); assert.equal(row.rawBefore, M.rawKey(state));
    const r = api.apply(state, select(row, options)); assert.equal(r.status, "TERMINATED");
    assert.deepEqual(row.outcome, detail(r)); state = r.state;
  }
  const ply = source.trace.length;
  const last = state.winner === null ? examine(ply, Boolean(source.interruption)) : null;
  assert.equal(screenIndex, source.screens.length);
  assert.deepEqual(source.firstEligible, first); assert.deepEqual(source.finalState, state);
  if (source.stop === "NATURAL-TERMINAL") assert.notEqual(state.winner, null);
  else if (source.stop === "PLY-LIMIT") { assert.equal(ply, spec.maxPly); assert.equal(state.winner, null); }
  else if (source.stop.startsWith("SCREEN-")) assert.equal(source.stop, last?.status);
  else if (source.interruption) { assert.equal(source.candidate, null); assert.equal(source.interruption.verification, "PREFIX-ONLY-NOT-FULL"); }
  else {
    const row = source.stopped; assert.ok(row); assert.equal(row.ply, ply); assert.equal(row.rawBefore, M.rawKey(state));
    const r = api.apply(state, select(row, sorted(api.variants(state).moves)));
    assert.equal(r.status, source.stop); assert.deepEqual(row.outcome, detail(r));
  }
  const regular = ["NATURAL-TERMINAL", "PLY-LIMIT"].includes(source.stop);
  const hit = first && source.screens[first.screenIndex].readIdentities.some(id => excluded.has(id));
  const status = !regular ? "SOURCE-FAILURE-NO-CANDIDATE" : !first ? "NO-STRUCTURAL-ROOT" : hit ? "FIRST-ROOT-OVERLAP-EXCLUDED" : "FIRST-ROOT-FROZEN";
  assert.equal(source.selectionStatus, status);
  assert.deepEqual(source.candidate, regular && first && !hit ? { raw: first.raw, ply: first.ply, state: first.state } : null);
  return { verified: true, scope: source.interruption ? "PREFIX-ONLY-NOT-FULL" : "FULL-SCIENTIFIC-SOURCE" };
}
function verifyFrozen(sources, count, actual) {
  const rows = [], chosen = [], prior = [];
  for (const source of sources) {
    let status = source.selectionStatus;
    if (source.candidate) {
      const raw = source.candidate.raw;
      status = prior.includes(raw) ? "DUPLICATE-FIRST-ROOT-EXCLUDED" : chosen.length === count ? "UNSELECTED-NO-REPLACEMENT" : "FROZEN";
      prior.push(raw);
      if (status === "FROZEN") chosen.push({ sourceId: source.sourceId, ...source.candidate });
    }
    rows.push({ sourceId: source.sourceId, status });
  }
  assert.deepEqual(actual, { candidates: chosen, dispositions: rows }); return true;
}
module.exports = { inspect, replay, verifyFrozen };
