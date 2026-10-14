"use strict";
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), cp = require('node:child_process');
const R = require('../tools/research/g5-befcs-workload/registry.cjs');
const { session } = require('../tools/research/g5-befcs-host/session.cjs');
const Host = require('../tools/research/g5-befcs-host/host.cjs');
function fixture(fn) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'befcs-host-'));
  try {
    const remote = path.join(directory, 'remote.git'), repo = path.join(directory, 'registry');
    cp.execFileSync('git', ['init', '--quiet', '--bare', remote]);
    const r = R.open(repo, remote), request = { evidenceClass: 'TECHNICAL-REGISTRY-FIXTURE',
      stageId: 'BEFCS-HOST-FIXTURE', runId: 'seed-free-host', runAttempt: 1,
      binding: R.hash('BEFCS-HOST-FIXTURE-v1'), block: { start: 1, count: 128 } };
    fn(r, request, repo, directory);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
test('科学freeze不在ではGit接続・科学lease・source初期化前に拒否する', () => {
  const directory = path.join(os.tmpdir(), 'befcs-never-created-' + process.pid);
  assert.equal(fs.existsSync(directory), false);
  assert.throws(() => Host.scientificSession(directory, 'unreachable-remote'), /SCIENCE-GATE-NOT-FROZEN/);
  assert.equal(fs.existsSync(directory), false);
});
test('科学専用transportは未固定の取得・consume・mirrorを拒否し、生commitを公開しない', () => fixture((r, request, repo, directory) => {
  const science = require('../tools/research/g5-befcs-host/scientific-registry.cjs');
  assert.throws(() => science.open(path.join(directory, 'bad'), 'unreachable', 'refs/heads/main'), /NAMESPACE-MISMATCH/);
  const transport = science.open(path.join(directory, 'science'), 'unreachable');
  assert.equal(transport.commit, undefined); assert.equal(transport.git, undefined);
  assert.throws(() => transport.acquire(request), /SCIENCE-GATE-NOT-FROZEN/);
  assert.throws(() => transport.consume(request.stageId, request.runId, 0, () => {}, request.binding), /SCIENCE-GATE-NOT-FROZEN/);
  assert.throws(() => transport.mirror(request.stageId, request.runId, 0, {}), /SCIENCE-GATE-NOT-FROZEN/);
}));
test('専用triggerはpush・PR・attempt 2・不正head/ref/namespaceを拒否する', () => {
  const gate = { spec: { operations: { runAttempt: 1,
    executionRef: 'refs/heads/research/fixed-science', registryRef: R.REF } } };
  const env = { GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_RUN_ATTEMPT: '1',
    GITHUB_RUN_ID: '123', GITHUB_REPOSITORY: 'nkkmd/bao-la-kiswahili-game',
    GITHUB_SHA: 'a'.repeat(40), GITHUB_REF: 'refs/heads/research/fixed-science' };
  assert.equal(Host.validateTrigger(gate, env), '123');
  for (const changes of [{ GITHUB_EVENT_NAME: 'push' }, { GITHUB_EVENT_NAME: 'pull_request' },
    { GITHUB_RUN_ATTEMPT: '2' }, { GITHUB_SHA: 'invalid' }, { GITHUB_REF: 'refs/heads/main' },
    { GITHUB_REPOSITORY: 'other/repository' }, { GITHUB_RUN_ID: '0' }])
    assert.throws(() => Host.validateTrigger(gate, { ...env, ...changes }));
  assert.throws(() => Host.validateTrigger({ spec: { operations: { ...gate.spec.operations, registryRef: 'refs/heads/main' } } }, env));
});
test('全128論理markerのreceiptをremote再読取してからpermitを返す', () => fixture((r, request, repo) => {
  const s = session(r, request, r.acquire); s.begin();
  for (let n = 0; n < 128; n++) {
    const permit = s.permit({ index: n, binding: request.binding }, n % 16 === 0 ? { 'prefix.json': Buffer.from('fixed-prefix') } : null);
    assert.equal(permit.logicalId, n + 1); assert.equal(permit.beforeRead, true);
    assert.equal(r.read().sha, permit.remoteCommit);
  }
  s.finish({ 'final.json': Buffer.from('fixed-final') });
  assert.equal(s.status, 'FINISHED'); assert.equal(s.marked, 128);
  const verified = require('../tools/research/g5-befcs-workload/independent-registry.cjs').verify(repo, r.read().sha);
  assert.equal(verified.logicalReadsMarked, 128); assert.equal(verified.mirrors, 9);
  assert.equal(verified.scientificSeedsRead, 0);
  assert.throws(() => s.permit({ index: 128, binding: request.binding }), /SESSION-FINISHED-NO-RETRY/);
}));
test('必要mirror失敗では次consumeもpermitも作らずsessionを停止する', () => fixture((r, request) => {
  const s = session({ ...r, mirror() { throw Error('COMMUNICATION-FAILURE'); } }, request, r.acquire);
  s.begin(); const before = r.read().sha;
  assert.throws(() => s.permit({ index: 0, binding: request.binding }, { a: 'saved' }), /COMMUNICATION-FAILURE/);
  assert.equal(r.read().sha, before); assert.equal(s.marked, 0); assert.equal(s.status, 'STOPPED');
  assert.throws(() => s.permit({ index: 0, binding: request.binding }), /NO-RETRY/);
}));
test('consume保存後の通信不明ではmarkerを保持しpermitを返さない', () => fixture((r, request) => {
  const transport = { ...r, consume(...args) { r.consume(...args); throw Error('RESPONSE-UNKNOWN'); } };
  const s = session(transport, request, r.acquire); s.begin();
  assert.throws(() => s.permit({ index: 0, binding: request.binding }), /RESPONSE-UNKNOWN/);
  assert.equal(s.status, 'STOPPED'); assert.equal(s.marked, 0);
  assert.equal(r.read().record.leases[0].consumes.length, 1);
  assert.throws(() => s.begin(), /NO-RETRY/);
}));
test('receiptのremote不一致では読取許可を作らず保存markerを保持する', () => fixture((r, request) => {
  let fake = false;
  const transport = { ...r, read() { const c = r.read(); return fake ? { ...c, sha: 'f'.repeat(40) } : c; },
    consume(stage, run, index, callback, binding) { return r.consume(stage, run, index, (id, sha) => { fake = true; callback(id, sha); }, binding); } };
  const s = session(transport, request, r.acquire); s.begin();
  assert.throws(() => s.permit({ index: 0, binding: request.binding }), /REMOTE-RECEIPT-MISMATCH/);
  assert.equal(s.status, 'STOPPED'); assert.equal(r.read().record.leases[0].consumes.length, 1);
}));
test('全区画lease後の中断・別runは同じStageを再起動できない', () => fixture((r, request) => {
  const first = session(r, request, r.acquire); first.begin(); first.stop();
  const second = session(r, { ...request, runId: 'another-run' }, r.acquire);
  assert.throws(() => second.begin(), /DUPLICATE-STAGE/); assert.equal(second.status, 'STOPPED');
  assert.equal(r.read().record.leases.length, 1);
}));
test('最終mirror失敗は完了へ昇格せず、permit発行を再開できない', () => fixture((r, request) => {
  const s = session({ ...r, mirror() { throw Error('FINAL-MIRROR-FAILURE'); } }, request, r.acquire);
  s.begin(); s.permit({ index: 0, binding: request.binding });
  assert.throws(() => s.finish({ a: 'saved' }), /FINAL-MIRROR-FAILURE/);
  assert.equal(s.status, 'STOPPED'); assert.equal(s.marked, 1);
}));
test('重複・順序違い・別bindingの要求をconsume前に拒否する', () => {
  for (const kind of ['order', 'binding', 'duplicate']) fixture((r, request) => {
    const s = session(r, request, r.acquire); s.begin();
    if (kind === 'duplicate') s.permit({ index: 0, binding: request.binding });
    const before = r.read().sha;
    assert.throws(() => s.permit({ index: kind === 'order' ? 1 : 0, binding: kind === 'binding' ? 'f'.repeat(64) : request.binding }), /REQUEST-NONSEQUENTIAL-OR-UNBOUND/);
    assert.equal(r.read().sha, before); assert.equal(s.status, 'STOPPED');
  });
});
test('残余予算不足は次consume前に停止しmarkerを追加しない', () => fixture((r, request) => {
  let exhausted = false;
  const s = session(r, request, r.acquire, () => { if (exhausted) throw Error('INSUFFICIENT-REMAINING-BUDGET'); });
  s.begin(); exhausted = true;
  assert.throws(() => s.permit({ index: 0, binding: request.binding }), /INSUFFICIENT-REMAINING-BUDGET/);
  assert.equal(r.read().record.leases[0].consumes.length, 0); assert.equal(s.status, 'STOPPED');
}));
