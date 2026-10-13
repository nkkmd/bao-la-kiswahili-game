"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const S = require("./source.cjs"), C = require("../g5-method/raw-codec.cjs"), M = require("../g5-01/measurement.cjs");
const A = require("../g5-compact-bfs/compact.cjs"), B = require("../g5-compact-bfs/reference.cjs"), J = require("../g5-compact-bfs/journal.cjs");
const Solver = require("../../experiments/lib/restricted-endgame-retrograde.js"), IndependentSolver = require("../../experiments/lib/restricted-endgame-retrograde-independent.js");
const { verifyEdges } = require("./independent-closure.cjs");
function runFixture(primary, reference, limits, output, excluded = new Set(), check = () => {}) {
  assert.ok(["TECHNICAL-KNOWN-BAO", "ABSTRACT-NOT-BAO-EVIDENCE"].includes(primary.evidenceClass));
  const reads = new Map(), boundary = new Set(), logName = "closure.jsonl";
  let lastOperation = null, stopped = null, value = null;
  function observe(state, context) {
    const id = M.rawKey(state); if (reads.has(id)) return;
    reads.set(id, state);
    output.append("reads.jsonl", { id, payload: C.encodeRaw(state).toString("base64"), metadata: { reason: state.reason ?? "", turn: state.turn }, context });
  }
  const paired = S.paired({ ...primary.adapter, apply(s, m) { const r = primary.adapter.apply(s, m); lastOperation = { from: M.rawKey(s), moveKey: M.moveKey(m), record: r }; return r; } }, reference.adapter, { check, observe });
  function blocked(states, witness) {
    const hit = states.map(M.rawKey).find(id => excluded.has(id));
    if (hit) throw new S.Stop("READ-FIREWALL-HIT", { ...witness, raw: hit });
  }
  const adapter = {
    variants(state) {
      lastOperation = { from: M.rawKey(state), rootState: state };
      observe(state, "CLOSURE-ROOT"); boundary.add(M.rawKey(state)); blocked([state], { state });
      const options = paired.variants(state);
      for (const r of options.probes) { if (r.state) boundary.add(M.rawKey(r.state)); blocked(S.rawStates(r), { from: M.rawKey(state), rootState: state, context: "LEGAL-PROBE", record: r }); }
      return options;
    },
    apply(state, move) {
      const r = paired.apply(state, move); if (r.state) boundary.add(M.rawKey(r.state));
      blocked(S.rawStates(r), lastOperation); return r;
    }
  };
  try { check(); value = A.build({ ...primary, adapter }, limits, record => output.append(logName, record)); }
  catch (error) {
    if (!(error instanceof S.Stop)) throw error;
    stopped = error;
    const file = path.join(output.directory, logName);
    let prefix = fs.existsSync(file) ? J.replay(fs.readFileSync(file), false) : { ids: [], metadata: [], legal: [], expanded: [], keys: [], edges: [], states: [] };
    if (!prefix.ids.length) {
      const state = primary.state, id = M.rawKey(state), metadata = { reason: state.reason ?? "", turn: state.turn };
      output.append(logName, { kind: "node", id, payload: C.encodeRaw(state).toString("base64"), metadata }, true);
      prefix = J.replay(fs.readFileSync(file), false); boundary.add(id);
    }
    const domain = { version: 1, ruleRevision: M.RULE, codec: "RAW263-LE-v1", fixtureId: primary.id, evidenceClass: primary.evidenceClass,
      root: M.rawKey(primary.state), ids: prefix.ids, metadata: prefix.metadata, legal: prefix.legal, expanded: prefix.expanded, keys: prefix.keys, edges: prefix.edges,
      complete: false, status: error.code, stopWitness: { ...lastOperation, ...error.witness }, frontier: prefix.ids.filter((_, i) => !prefix.expanded[i]),
      boundaryIdentities: [...boundary].sort(), rawProjectionIdentities: [...reads.keys()].sort() };
    value = { domain, payloads: prefix.states.map(r => C.encodeRaw(r.state)) };
    output.append(logName, { kind: "finish", domain: { ...domain, ids: undefined, metadata: undefined, legal: undefined, expanded: undefined, keys: undefined, edges: undefined } }, true);
  }
  let canonical = A.canonical(value), solution = null;
  verifyEdges(canonical, reference.adapter);
  const journal = J.replay(fs.readFileSync(path.join(output.directory, logName)));
  assert.deepEqual(journal, canonical, "DURABLE-CLOSURE-PREFIX-MISMATCH");
  if (canonical.complete) {
    assert.deepEqual(B.build(reference, limits), canonical, "INDEPENDENT-CLOSURE-MISMATCH");
    try {
      check(); solution = Solver.solveRetrograde(A.graph(canonical));
      assert.deepEqual(solution, IndependentSolver.solveIndependent(B.graph(canonical))); check();
    } catch (error) { if (!(error instanceof S.Stop)) throw error; solution = null; stopped = error; }
  }
  const bytes = A.serialize(value);
  try { check(); output.snapshot("closure.bin", bytes); check(); }
  catch (error) {
    if (!(error instanceof S.Stop)) throw error; stopped = error; solution = null;
    output.snapshot("closure.bin", bytes, true);
  }
  assert.deepEqual(B.decode(fs.readFileSync(path.join(output.directory, "closure.bin"))), canonical);
  const result = { domain: canonical, solution, stageStatus: stopped?.code ?? canonical.status,
    interpretationComplete: canonical.complete && stopped === null, observedReadIdentities: [...reads.keys()].sort() };
  output.snapshot("CHECKPOINT.json", { complete: false, domainComplete: canonical.complete, status: result.stageStatus, solution: result.solution,
    frontier: canonical.frontier, resumeAuthorized: false, stopWitness: canonical.stopWitness }, true);
  return result;
}
module.exports = { runFixture, verifyEdges };
