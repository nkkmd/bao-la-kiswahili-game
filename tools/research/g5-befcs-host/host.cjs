"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const R = require('../g5-befcs-workload/registry.cjs');
const ScientificRegistry = require('./scientific-registry.cjs');
const { session } = require('./session.cjs');

function validateTrigger(gate, env) {
  assert.equal(env.GITHUB_EVENT_NAME, 'workflow_dispatch', 'SEPARATE-TRIGGER-REQUIRED');
  assert.equal(env.GITHUB_RUN_ATTEMPT, '1', 'ATTEMPT-ONE-ONLY');
  assert.match(env.GITHUB_RUN_ID ?? '', /^[1-9][0-9]*$/);
  assert.equal(env.GITHUB_REPOSITORY, 'nkkmd/bao-la-kiswahili-game');
  const operations = gate.spec.operations;
  assert.equal(operations.runAttempt, 1);
  assert.equal(operations.executionRef, env.GITHUB_REF, 'EXECUTION-REF-MISMATCH');
  // 実行headはreceiptへ記録する。SPECへ自身のcommit SHAを埋める循環を作らず、
  // 実行codeは既存science-gateの全入力manifestとreview bindingで固定する。
  assert.match(env.GITHUB_SHA ?? '', /^[a-f0-9]{40}$/);
  assert.match(operations.executionRef, /^refs\/heads\/research\/[a-z0-9-]+$/);
  assert.equal(operations.registryRef, R.REF, 'REGISTRY-NAMESPACE-MISMATCH');
  return env.GITHUB_RUN_ID;
}
function scientificSession(repository, remote, env = process.env) {
  // 最終科学gateと独立triggerを確認するまで、Git接続もlease作成もしない。
  const gate = require('../g5-befcs-workload/science-gate.cjs').openScience();
  const runId = validateTrigger(gate, env);
  const base = path.resolve(__dirname, '../../..');
  const manifest = JSON.parse(fs.readFileSync(path.join(base, 'doc/research-generation-5/befcs-study1/SOURCE_MANIFEST.json')));
  for (const name of ['tools/research/g5-befcs-host/host.cjs', 'tools/research/g5-befcs-host/session.cjs',
    'tools/research/g5-befcs-host/scientific-registry.cjs',
    'tools/research/g5-befcs-workload/science-gate.cjs', 'tools/research/g5-befcs-workload/registry.cjs',
    'tools/research/g5-befcs-workload/scientific-source.cjs',
    'tools/research/g5-befcs-workload/independent-scientific-source.cjs',
    'tools/research/g5-befcs-workload/scientific-closure.cjs'])
    assert.match(manifest.files[name] ?? '', /^[a-f0-9]{64}$/, 'HOST-SCIENTIFIC-INPUT-NOT-BOUND');
  const request = { evidenceClass: 'BEFCS-SCIENTIFIC-SOURCE', studyId: gate.spec.studyId,
    stageId: gate.spec.stageId, runId, runAttempt: 1, executionCommit: env.GITHUB_SHA, binding: gate.binding,
    block: { start: gate.spec.seedBlock.start, count: gate.spec.seedBlock.count } };
  const registry = ScientificRegistry.open(repository, remote);
  function check() {
    const current = require('../g5-befcs-workload/science-gate.cjs').openScience();
    assert.equal(current.binding, gate.binding, 'SCIENCE-FREEZE-CHANGED');
    assert.equal(validateTrigger(current, env), runId);
  }
  function acquire(input) {
    check(); assert.deepEqual(input, request);
    return registry.acquire(input);
  }
  const protocol = session(registry, request, acquire, check);
  return { protocol, registry, binding: gate.binding,
    context(permit) { try {
      check(); assert.equal(protocol.status, 'LEASED');
      assert.equal(permit.index, protocol.marked - 1);
      const record = registry.read(); assert.equal(record.sha, permit.remoteCommit);
      const lease = record.record.leases.find(l => l.stageId === request.stageId);
      assert.equal(lease.binding, gate.binding); assert.equal(lease.runId, runId);
      assert.equal(lease.consumes.length, protocol.marked);
      assert.deepEqual(lease.consumes[permit.index], { index: permit.index,
        logicalId: permit.logicalId, binding: gate.binding, runId, beforeRead: true });
      return { evidenceClass: request.evidenceClass, sourceId: 'BEFCS/source-' + permit.index,
        ...permit };
    } catch (error) { protocol.stop(); throw error; } } };
}
module.exports = { scientificSession, validateTrigger };
