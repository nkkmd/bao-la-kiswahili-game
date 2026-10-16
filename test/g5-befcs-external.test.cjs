"use strict";
const test = require('node:test'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const T = require('../tools/research/g5-befcs-external/transport.cjs');
const env = { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'nkkmd/bao-la-kiswahili-game', GITHUB_EVENT_NAME: 'push', GITHUB_RUN_ATTEMPT: '1', GITHUB_REF: 'refs/heads/research/g5-resume-audit-20261015', GITHUB_RUN_ID: '123', BEFCS_FIXTURE_TOKEN: 'fixture' };
test('科学namespace・retry・別triggerを通信前に拒否する', () => {
  for (const change of [{ GITHUB_EVENT_NAME: 'workflow_dispatch' }, { GITHUB_RUN_ATTEMPT: '2' }, { GITHUB_REF: 'refs/heads/main' }]) assert.throws(() => T.validate({ ...env, ...change }, 'complete'));
});
test('応答欠落は同じPOSTを再実行せず書込みを止める', async () => {
  const bytes = T.fixtureBytes(), blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
  let writes = 0;
  const r = await T.preserve(bytes, 'ack-loss', env, async (method, suffix) => { writes++; return suffix === '/git/blobs' ? { sha: blob } : suffix === '/git/trees' ? { sha: 'tree' } : suffix === '/git/commits' ? { sha: 'commit' } : { object: { sha: 'commit' } }; }, () => {});
  assert.equal(writes, 4); assert.equal(r.acknowledged, false); assert.equal(r.writesLocked, true);
});
test('通信失敗時にretryしない', async () => {
  let calls = 0; await assert.rejects(() => T.preserve(T.fixtureBytes(), 'complete', env, async () => { calls++; throw Error('lost'); }, () => {}), /lost/); assert.equal(calls, 1);
});

test('固定技術データ以外は通信前に拒否する', async () => {
 let calls = 0; await assert.rejects(() => T.preserve(Buffer.from('other'), 'complete', env, async () => { calls++; }, () => {}), /NONFIXTURE/); assert.equal(calls, 0);
});
test('remoteのref・commit・blobを読み戻した後だけACKを返す', async () => {
 const bytes = T.fixtureBytes(), blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
 const replies = [{sha:blob},{sha:'tree'},{sha:'commit'},{object:{sha:'commit'}},{object:{sha:'commit'}},{tree:{sha:'tree'}},{encoding:'base64',content:bytes.toString('base64')}];
 let n = 0; const r = await T.preserve(bytes, 'complete', env, async () => replies[n++], () => {});
 assert.equal(n,7); assert.equal(r.acknowledged,true); assert.equal(r.calls.filter(c=>c.method==='POST').length,4);
});
