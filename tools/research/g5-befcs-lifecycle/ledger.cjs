"use strict";
// 技術fixture用。実OSの計測・強制停止adapterがない限り科学実行を認めない。
const assert = require('node:assert/strict');
const { LIMITS } = require('../g5-befcs-envelope/envelope.cjs');
const PHASES = Object.freeze(['checkout', 'prepare', 'work', 'finalize', 'preserve']);
const ROLES = Object.freeze(['supervisor', 'checkout', 'worker', 'transport', 'preserver']);
function create({ evidenceClass, scientificSeedsRead, limits }, clock, measure) {
  assert.equal(evidenceClass, 'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE');
  assert.equal(scientificSeedsRead, 0);
  assert.deepEqual(limits, LIMITS);
  const start = clock();
  assert.ok(Number.isFinite(start));
  let previous = start, index = -1, stopped = null, closed = false;
  let scopeId = null, lastPeak = 0, lastRemote = 0;
  const samples = [], receipts = [];
  function stop(reason) { stopped ??= reason; }
  function sample(phase) {
    assert.equal(closed, false, 'LIFECYCLE-CLOSED');
    if (stopped) throw Error(stopped);
    try {
      const now = clock();
      assert.ok(Number.isFinite(now) && now >= previous, 'CLOCK-REGRESSION');
      previous = now;
      const elapsed = now - start;
      const m = measure();
      assert.equal(m.scopeCreatedBeforeCheckout, true, 'LATE-RESOURCE-SCOPE');
      assert.equal(m.controllerIncluded, true, 'CONTROLLER-OUTSIDE-SCOPE');
      assert.equal(m.hardMemoryBytes, LIMITS.maxRssBytes, 'MEMORY-HARD-LIMIT-MISMATCH');
      assert.equal(m.swapMaxBytes, 0, 'SWAP-NOT-DISABLED');
      assert.ok(typeof m.scopeId === 'string' && m.scopeId.length, 'MISSING-SCOPE');
      scopeId ??= m.scopeId;
      assert.equal(m.scopeId, scopeId, 'RESOURCE-SCOPE-CHANGED');
      assert.deepEqual([...m.coveredRoles].sort(), [...ROLES].sort(), 'UNCOVERED-LIFECYCLE-ROLE');
      for (const k of ['memoryPeakBytes', 'workspaceBytes', 'remoteBytes'])
        assert.ok(Number.isSafeInteger(m[k]) && m[k] >= 0, 'INVALID-RESOURCE-MEASUREMENT');
      assert.equal(m.accountingComplete, true, 'INCOMPLETE-RESOURCE-ACCOUNTING');
      assert.ok(m.memoryPeakBytes >= lastPeak, 'PEAK-COUNTER-REGRESSION');
      assert.ok(m.remoteBytes >= lastRemote, 'REMOTE-COUNTER-REGRESSION');
      lastPeak = m.memoryPeakBytes; lastRemote = m.remoteBytes;
      const chargedBytes = m.workspaceBytes + m.remoteBytes;
      assert.ok(Number.isSafeInteger(chargedBytes), 'RESOURCE-COUNTER-OVERFLOW');
      assert.ok(elapsed < LIMITS.maxTotalMs, 'LIFECYCLE-DEADLINE');
      assert.ok(m.memoryPeakBytes <= LIMITS.maxRssBytes, 'LIFECYCLE-MEMORY-LIMIT');
      const final = ['finalize', 'preserve', 'closed'].includes(phase);
      assert.ok(chargedBytes <= LIMITS.maxEvidenceBytes - (final ? 0 : LIMITS.storageReserveBytes), 'LIFECYCLE-STORAGE-LIMIT');
      assert.ok(final || elapsed < LIMITS.maxTotalMs - LIMITS.finalizationReserveMs, 'LIFECYCLE-FINALIZATION-RESERVE');
      const row = { phase, elapsedMs: elapsed, memoryPeakBytes: m.memoryPeakBytes, chargedBytes, scopeId };
      samples.push(row); return row;
    } catch (e) { stop(e.message); throw e; }
  }
  function enter(phase) {
    assert.equal(phase, PHASES[index + 1], 'LIFECYCLE-PHASE-ORDER');
    const row = sample(phase); index++; receipts.push(row); return row;
  }
  function finish({ workStopped, durableReceipt, allManagedChildrenStopped }) {
    assert.equal(index, PHASES.length - 1, 'LIFECYCLE-NOT-PRESERVED');
    try {
      assert.equal(workStopped, true, 'WORK-NOT-STOPPED');
      assert.equal(allManagedChildrenStopped, true, 'DESCENDANTS-NOT-STOPPED');
      assert.equal(typeof durableReceipt?.sha256, 'string', 'MISSING-DURABLE-RECEIPT');
      assert.match(durableReceipt.sha256, /^[a-f0-9]{64}$/, 'INVALID-DURABLE-RECEIPT');
      assert.equal(durableReceipt.acknowledged, true, 'PRESERVATION-NOT-ACKNOWLEDGED');
      const row = sample('closed'); closed = true;
      return { decision: 'TECHNICAL-LIFECYCLE-LEDGER-PASS-OS-ADAPTER-PENDING', ...row,
        scientificSeedsRead: 0, scientificExecutionAuthorized: false, wholeLifecycleOsProven: false };
    } catch (e) { stop(e.message); throw e; }
  }
  return { enter, sample() { assert.ok(index >= 0, 'LIFECYCLE-NOT-STARTED'); return sample(PHASES[index]); }, finish,
    stop, get status() { return closed ? 'CLOSED' : stopped ? 'STOPPED' : 'ACTIVE'; },
    get reason() { return stopped; }, get records() { return { samples: structuredClone(samples), receipts: structuredClone(receipts) }; } };
}
module.exports = { create, PHASES, ROLES };
