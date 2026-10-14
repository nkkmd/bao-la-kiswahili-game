"use strict";
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),assert=require("node:assert/strict");
const I=require("../g5-01/transition/independent-engine.cjs"),M=require("../g5-01/measurement.cjs"),S=require("../../experiments/lib/restricted-endgame-retrograde-independent.js");
const C=require("./core.cjs"),R=require("./run.cjs"),V=require("./independent-source.cjs");
function verify(directory) {
  const binding = R.binding(), result = JSON.parse(fs.readFileSync(path.join(directory, "RESULT.json")));
  assert.equal(result.binding, binding.digest); assert.equal(result.disposition, "STAGE1-SUPPLY-COMPLETE");
  const compressed = fs.readFileSync(path.join(directory, "EVIDENCE.json.gz"));
  assert.equal(R.shaBytes(compressed), result.evidenceGzipSha256);
  const bytes = zlib.gunzipSync(compressed, { maxOutputLength: binding.spec.maxEvidenceBytes });
  const evidence = JSON.parse(bytes); assert.equal(evidence.binding, binding.digest);
  assert.equal(evidence.formalInference, false); assert.equal(result.formalInference, false);
  assert.equal(evidence.scientificSeedsRead, binding.spec.seedBlock.count);
  assert.equal(evidence.sources.length, binding.spec.seedBlock.count);
  assert.equal(result.scientificSeedsRead, binding.spec.seedBlock.count);
  assert.equal(result.sourceCount, evidence.sources.length);
  const reads = fs.readFileSync(path.join(directory, "SEED_READS.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(reads.length, binding.spec.seedBlock.count);
  const technical = C.technicalFirewall(); assert.deepEqual([...technical].sort(), evidence.technicalFirewall);
  const prior = C.priorFirewall(); assert.deepEqual([...prior].sort(), evidence.priorReadFirewall);
  const fixedExclusion = new Set([...technical, ...prior]);
  const exclusion = new Set(fixedExclusion), selected = [];
  for (let n = 0; n < evidence.sources.length; n++) {
    const source = evidence.sources[n], expected = binding.spec.seedBlock.start + n;
    assert.equal(reads[n].index, n); assert.equal(reads[n].seed, expected); assert.equal(source.seed, expected);
    V.replay(source, binding.spec.selection, exclusion);
    if (source.candidate) {
      exclusion.add(source.candidate.raw);
      if (selected.length < binding.spec.maxCandidates) selected.push({ sourceIndex: n, ...source.candidate });
    }
  }
  assert.deepEqual(selected, evidence.selectedCandidates);
  assert.equal(result.candidateCount, selected.length);
  const frozen = JSON.parse(fs.readFileSync(path.join(directory, "CANDIDATES_FROZEN.json")));
  assert.deepEqual(frozen.candidates, selected); assert.equal(frozen.digest, M.digest(selected));
  assert.equal(evidence.domains.length, selected.length);assert.equal(evidence.activeSource,null);assert.equal(evidence.activeDomain,null);
  let verifiedEdges = 0;
  for (let n = 0; n < evidence.domains.length; n++) {
    const domain = evidence.domains[n], byId = new Map(domain.states.map(row => [row.id, row.state]));
    assert.equal(byId.size, domain.states.length); assert.equal(domain.rootKey, selected[n].raw);
    for (const { id, state } of domain.states) assert.equal(id, M.rawKey(state));
    const edgeKeys = new Set();
    for (const edge of domain.edges) {
      const from = byId.get(edge.from), to = byId.get(edge.to);
      assert.ok(from && to); const choices = I.moveVariants(from, { mode: "runtime" });
      const move = choices.find(m => M.moveKey(m) === edge.moveKey); assert.ok(move);
      const child = I.applyMove(from, move, { maxMicrostates: binding.spec.closure.maxMicrostates });
      assert.equal(child.status, "TERMINATED"); assert.equal(M.rawKey(child.state), edge.to);
      const key = edge.from + ":" + edge.moveKey; assert.ok(!edgeKeys.has(key)); edgeKeys.add(key); verifiedEdges++;
    }
    for (const node of domain.nodes) {
      const state = byId.get(node.id); assert.equal(node.player, state.player); assert.equal(node.winner, state.winner);
      assert.deepEqual(node.moves.map(m => m.key).sort(), I.moveVariants(state, { mode: "runtime" }).map(M.moveKey).sort());
      for (const m of node.moves) assert.ok(edgeKeys.has(node.id + ":" + m.key));
    }
    assert.ok(domain.states.length <= binding.spec.closure.maxStates && domain.edges.length <= binding.spec.closure.maxEdges);
    if (domain.stopWitness?.from) {
      const witness = domain.stopWitness, from = byId.get(witness.from);
      const move = I.moveVariants(from, { mode: "runtime" }).find(m => M.moveKey(m) === witness.moveKey);
      assert.ok(move);
      if(witness.runtimeGuardOnly||witness.independent) {
        const runtime=I.applyMove(from,move,{mode:"runtime"});assert.equal(M.rawKey(runtime.state),witness.raw);
        assert.deepEqual(C.normalize(runtime.state),C.normalize(witness.state));
        if(witness.runtimeGuardOnly)assert.equal(runtime.state.reason,"relay-limit");
        else assert.deepEqual(I.applyMove(from,move,{maxMicrostates:binding.spec.closure.maxMicrostates}),witness.independent);
      } else {
        const child=I.applyMove(from,move,{maxMicrostates:binding.spec.closure.maxMicrostates});assert.equal(child.status,"TERMINATED");
        assert.equal(M.rawKey(child.state),witness.raw);assert.deepEqual(C.normalize(child.state),C.normalize(witness.state));
      }
    }
    if (domain.status === "PRIOR-READ-OVERLAP") assert.ok(fixedExclusion.has(domain.stopWitness.raw));
    if (domain.status === "STATE-LIMIT") assert.equal(domain.states.length, binding.spec.closure.maxStates);
    if (domain.complete) {
      for (const { id } of domain.states) assert.equal(fixedExclusion.has(id), false);
      assert.equal(domain.nodes.length, domain.states.length);
      assert.equal(domain.status, "COMPLETE-INDEPENDENT-AGREEMENT");
      assert.deepEqual(S.solveIndependent(domain.nodes), domain.solution);
    } else { assert.equal(domain.solution, null); assert.notEqual(domain.status, "COMPLETE-INDEPENDENT-AGREEMENT"); }
  }
  assert.deepEqual(C.domainGroups(evidence.domains), evidence.groups);
  assert.equal(result.completeDomains, evidence.domains.filter(d => d.complete).length);
  assert.deepEqual(result.domainStatuses, evidence.domains.map(d => ({ status: d.status, states: d.states.length,
    edges: d.edges.length, elapsedMs: d.elapsedMs, complete: d.complete, counts: d.complete ? d.solution.counts : null })));
  assert.deepEqual(result.domainGroups, evidence.groups);
  const journal=fs.readFileSync(path.join(directory,"STATE_READS.jsonl"));assert.equal(R.shaBytes(journal),result.stateJournalSha256);
  const observations=journal.toString("utf8").trim().split("\n").filter(Boolean).map(JSON.parse),logged=new Set(evidence.technicalFirewall);
  for(const row of observations){assert.equal(M.rawKey(row.state),row.id);assert.ok(!logged.has(row.id));logged.add(row.id);}
  assert.equal(journal.length,result.stateJournalBytes);assert.ok(bytes.length+journal.length<=binding.spec.maxEvidenceBytes);
  const identities = new Set(evidence.technicalFirewall);
  for (const source of evidence.sources) {
    identities.add(M.rawKey(source.finalState));
    for (const row of source.trace) { identities.add(row.rawBefore); identities.add(row.rawAfter); }
  }
  for(const source of evidence.sources) {
    for(const screen of source.screens){identities.add(screen.rootKey);for(const branch of screen.branches)identities.add(branch.to);
      if(screen.stopped){identities.add(M.rawKey(screen.stopped.runtimeState));if(screen.stopped.independent.state)identities.add(M.rawKey(screen.stopped.independent.state));}}
    if(source.stopped){identities.add(M.rawKey(source.stopped.runtimeState));if(source.stopped.independent.state)identities.add(M.rawKey(source.stopped.independent.state));}
  }
  for (const domain of evidence.domains) {
    for (const { id } of domain.states) identities.add(id);
    if (domain.stopWitness?.raw) identities.add(domain.stopWitness.raw);
  }
  assert.deepEqual([...identities].sort(),[...logged].sort());
  assert.deepEqual([...identities].sort(), evidence.supplyReadIdentities);
  assert.equal(identities.size, result.supplyIdentityCount);
  assert.ok(result.execution.elapsedMs <= binding.spec.maxTotalMs && result.execution.peakRssBytes <= binding.spec.maxRssBytes);
  const sourceStops={},selectionStops={},screenStops={};let screenCount=0;
  for(const source of evidence.sources){sourceStops[source.stop]=(sourceStops[source.stop]??0)+1;selectionStops[source.selectionStatus]=(selectionStops[source.selectionStatus]??0)+1;for(const screen of source.screens){screenCount++;screenStops[screen.status]=(screenStops[screen.status]??0)+1;}}
  assert.deepEqual(result.sourceStops,sourceStops);assert.deepEqual(result.selectionStops,selectionStops);assert.deepEqual(result.screenStops,screenStops);assert.equal(result.screenCount,screenCount);
  const receipt = { stateJournalRows:observations.length,screensChecked:screenCount,screenTransitionsChecked:evidence.sources.reduce((n,s)=>n+s.screens.reduce((m,p)=>m+p.branches.length,0),0),decision: "STAGE1-SUPPLY-INDEPENDENT-PASS", binding: binding.digest,
    sourcesReplayed: evidence.sources.length, domainsChecked: evidence.domains.length, verifiedEdges,
    completeDomains: result.completeDomains, freshSeedGenerationDuringVerification: 0, formalInference: false,
    evidenceGzipSha256: result.evidenceGzipSha256 };
  fs.writeFileSync(path.join(directory, "VERIFICATION.json"), JSON.stringify(receipt, null, 2) + "\n");
  return receipt;
}
if (require.main === module) console.log(JSON.stringify(verify(path.resolve(process.argv[2]))));
module.exports = {verify};
