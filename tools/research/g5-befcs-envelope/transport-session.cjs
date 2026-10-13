"use strict";
// Nodeとconnectorの実通信fixtureで同じ状態機械を使うため、runtime importを持たない。
function createSession(adapter, request, check = () => {}) {
  function insist(value, code) { if (!value) throw Error(code); }
  insist(request.evidenceClass === 'TECHNICAL-ENVELOPE-REGISTRY-FIXTURE', 'SCIENCE-TRANSPORT-REFUSED');
  insist(request.runAttempt === 1 && /^[a-f0-9]{64}$/.test(request.binding), 'FIXTURE-BINDING-INVALID');
  const { start, count } = request.block;
  insist(Number.isSafeInteger(start) && Number.isSafeInteger(count) && start > 0 && count > 0 &&
    start + count <= 4294967296 && (start + count - 1 < 50613001 || start > 50613128), 'SCIENTIFIC-BLOCK-REFUSED');
  let state = 'NEW', marked = 0, head = null;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  async function transaction(fn) {
    insist(state !== 'STOPPED' && state !== 'FINISHED', 'SESSION-STOPPED-NO-RETRY');
    try { await check(); return await fn(); } catch (e) { state = 'STOPPED'; throw e; }
  }
  async function durable(record, expected) {
    const receipt = await adapter.update(record, expected);
    insist(/^[a-f0-9]{40}$/.test(receipt.sha), 'INVALID-REMOTE-RECEIPT');
    const observed = await adapter.read();
    insist(observed.sha === receipt.sha && same(observed.record, record), 'REMOTE-RECEIPT-MISMATCH');
    await check(); head = receipt.sha; return receipt.sha;
  }
  async function current() {
    const r = await adapter.read(); insist(r.sha === head, 'REGISTRY-HEAD-CHANGED');
    insist(same(r.record.lease.request, request), 'LEASE-IDENTITY-CHANGED');
    insist(r.record.lease.status === 'BLOCK-QUARANTINED-NO-RETRY' && r.record.lease.consumes.length === marked,
      'REGISTRY-MARKER-PREFIX-CHANGED');
    for (let i = 0; i < marked; i++) insist(same(r.record.lease.consumes[i], marker(i)), 'REGISTRY-MARKER-CHANGED');
    return r;
  }
  function marker(index) { return { index, logicalId: start + index, binding: request.binding, runId: request.runId, beforeRead: true }; }
  return {
    begin: () => transaction(async () => {
      insist(state === 'NEW', 'SESSION-ALREADY-STARTED'); const r = await adapter.read();
      insist(r.record === null, 'EXISTING-REGISTRY-NO-RETRY');
      const record = { version: 1, evidenceClass: request.evidenceClass,
        lease: { request: structuredClone(request), status: 'BLOCK-QUARANTINED-NO-RETRY', consumes: [] }, mirrors: [] };
      const sha = await durable(record, r.sha); state = 'LEASED'; return sha;
    }),
    permit: index => transaction(async () => {
      insist(state === 'LEASED' && index === marked && index < count, 'INVALID-CONSUME-INDEX');
      const r = await current(); await check(); r.record.lease.consumes.push(marker(index));
      const sha = await durable(r.record, r.sha); marked++; return { ...marker(index), remoteCommit: sha, runAttempt: 1 };
    }),
    mirror: (proof, final = false) => transaction(async () => {
      insist(state === 'LEASED', 'SESSION-NOT-LEASED');
      insist(proof && /^[a-f0-9]{64}$/.test(proof.sha256) && Number.isSafeInteger(proof.bytes) && proof.bytes >= 0, 'INVALID-MIRROR-PROOF');
      const r = await current(); r.record.mirrors.push({ ...structuredClone(proof), sequence: r.record.mirrors.length,
        coverage: 'FIXED-TECHNICAL-BYTES-NOT-SCIENTIFIC-COMPLETENESS', final });
      const sha = await durable(r.record, r.sha); if (final) state = 'FINISHED'; return sha;
    }),
    stop() { state = 'STOPPED'; }, get status() { return state; }, get marked() { return marked; }, get head() { return head; }
  };
}
if (typeof module !== 'undefined') module.exports = { createSession };
