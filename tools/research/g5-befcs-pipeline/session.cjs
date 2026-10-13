"use strict";
// 読取許可を作るhost側の状態機械。失敗後は同じsessionを再開しない。
const assert = require('node:assert/strict');

function session(registry, request, acquire, check = () => {}) {
  let state = 'NEW', index = 0, sequence = 0;
  const receipts = [];
  function transaction(action) {
    assert.notEqual(state, 'STOPPED', 'SESSION-STOPPED-NO-RETRY');
    assert.notEqual(state, 'FINISHED', 'SESSION-FINISHED-NO-RETRY');
    try { check(); return action(); }
    catch (error) { state = 'STOPPED'; throw error; }
  }
  function verify(sha, count) {
    const current = registry.read();
    assert.equal(current.sha, sha, 'REMOTE-RECEIPT-MISMATCH');
    const lease = current.record.leases.find(l => l.stageId === request.stageId);
    assert.ok(lease, 'LEASE-NOT-DURABLE');
    const { consumes, status, ...identity } = lease;
    assert.deepEqual(identity, request, 'LEASE-IDENTITY-MISMATCH');
    assert.equal(status, 'BLOCK-QUARANTINED-NO-RETRY');
    assert.equal(consumes.length, count, 'REMOTE-CONSUME-COUNT-MISMATCH');
    for (let n = 0; n < count; n++) assert.deepEqual(consumes[n], {
      index: n, logicalId: request.block.start + n, binding: request.binding,
      runId: request.runId, beforeRead: true
    });
    return current;
  }
  function begin() { return transaction(() => {
    assert.equal(state, 'NEW', 'SESSION-ALREADY-STARTED');
    const receipt = acquire(request); verify(receipt.sha, 0);
    receipts.push(receipt.sha); state = 'LEASED'; return receipt.sha;
  }); }
  function mirror(files) {
    const receipt = registry.mirror(request.stageId, request.runId, sequence, files);
    const current = verify(receipt.sha, index);
    const mirrors = current.record.mirrors.filter(m => m.stageId === request.stageId);
    assert.equal(mirrors.length, sequence + 1);
    assert.deepEqual(mirrors.at(-1), receipt.manifest);
    sequence++; receipts.push(receipt.sha); return receipt.sha;
  }
  function permit(message, files = null) { return transaction(() => {
    assert.equal(state, 'LEASED', 'SESSION-NOT-LEASED');
    assert.deepEqual(message, { index, binding: request.binding }, 'REQUEST-NONSEQUENTIAL-OR-UNBOUND');
    assert.ok(index < request.block.count, 'BLOCK-EXHAUSTED');
    if (files !== null) mirror(files); // 必要なmirrorの成功が次consumeより先。
    check();
    let permit;
    registry.consume(request.stageId, request.runId, index, (logicalId, remoteCommit) => {
      verify(remoteCommit, index + 1); check();
      permit = { index, logicalId, binding: request.binding, remoteCommit,
        runId: request.runId, runAttempt: 1, beforeRead: true };
    }, request.binding);
    assert.ok(permit, 'CONSUME-NO-RECEIPT'); index++; receipts.push(permit.remoteCommit);
    return permit;
  }); }
  function checkpoint(files) { return transaction(() => {
    assert.equal(state, 'LEASED', 'SESSION-NOT-LEASED');
    return mirror(files);
  }); }
  function finish(files) { return transaction(() => {
    assert.equal(state, 'LEASED', 'SESSION-NOT-LEASED');
    const sha = mirror(files); state = 'FINISHED'; return sha;
  }); }
  return { begin, permit, checkpoint, finish, stop() { state = 'STOPPED'; },
    get status() { return state; }, get marked() { return index; },
    get mirrors() { return sequence; }, get receipts() { return [...receipts]; } };
}
module.exports = { session };
