"use strict";
// 主BFS・主source・主edge formatterを参照しない。
const assert = require("node:assert/strict"), M = require("../g5-01/measurement.cjs"), Micro = require("../g5-method/microstate-check.cjs");
function verifyEdges(domain, api) {
  const states = new Map(domain.states.map(r => [r.id, r.state]));
  for (let n = 0; n < domain.ids.length; n++) if (domain.legal[n] !== null) {
    const keys = api.variants(states.get(domain.ids[n])).moves.map(M.moveKey).sort();
    assert.deepEqual(keys, domain.legal[n]);
  }
  for (const e of domain.edges) {
    const state = states.get(domain.ids[e.from]), key = domain.keys[e.move];
    const move = api.variants(state).moves.find(m => M.moveKey(m) === key); assert.ok(move);
    const r = api.apply(state, move); Micro.check(r);
    assert.equal(e.status, r.status); assert.equal(e.relays, r.relays); assert.equal(e.microstateCount, r.microstates.length);
    assert.equal(e.microstateHash, M.digest(r.microstates)); assert.deepEqual(e.cycle, r.cycle);
    assert.deepEqual(e.metadata, r.state ? { reason: r.state.reason ?? "", turn: r.state.turn } : null);
    if (e.to !== null) { assert.ok(r.state); assert.equal(domain.ids[e.to], M.rawKey(r.state)); }
    else if (r.state) assert.ok(e.witness);
    if (e.witness) assert.deepEqual(e.witness, r);
  }
  const w = domain.stopWitness;
  if (w?.from && w.moveKey && w.record) {
    const state = states.get(w.from); assert.ok(state);
    const move = api.variants(state).moves.find(m => M.moveKey(m) === w.moveKey); assert.ok(move);
    assert.deepEqual(api.apply(state, move), w.record);
  }
  if (w?.rootState && w.context === "LEGAL-PROBE" && w.record) {
    assert.ok(api.variants(w.rootState).probes.some(p => M.stable(p) === M.stable(w.record)), "STOP-PROBE-MISMATCH");
  }
  return true;
}
module.exports = { verifyEdges };
