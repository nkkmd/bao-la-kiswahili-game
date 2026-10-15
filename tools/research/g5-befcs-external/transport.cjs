"use strict";
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const REPO = 'nkkmd/bao-la-kiswahili-game';
const FIXTURE = Buffer.from('{"fixtureVersion":1,"scientificSeedsRead":0}\n');
function validate(env, mode) {
  assert.equal(env.GITHUB_ACTIONS, 'true'); assert.equal(env.GITHUB_REPOSITORY, REPO);
  assert.equal(env.GITHUB_EVENT_NAME, 'push'); assert.equal(env.GITHUB_RUN_ATTEMPT, '1');
  assert.equal(env.GITHUB_REF, 'refs/heads/research/g5-resume-audit-20261015');
  assert.match(env.GITHUB_RUN_ID ?? '', /^[1-9][0-9]*$/);
  assert.ok(['complete', 'ack-loss'].includes(mode)); assert.ok(env.BEFCS_FIXTURE_TOKEN);
  return 'refs/heads/research/g5-lifecycle-preservation-' + env.GITHUB_RUN_ID + '-a1-' + mode;
}
async function preserve(bytes, mode, env, request, check) {
  const ref = validate(env, mode);
  assert.ok(Buffer.isBuffer(bytes) && bytes.length <= 4096, 'FIXED-SMALL-FIXTURE-ONLY');
  assert.deepEqual(bytes, FIXTURE, 'NONFIXTURE-CONTENT-REFUSED');
  const expectedBlob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const calls = []; let locked = false;
  async function call(method, suffix, body) {
    assert.ok(!locked || method === 'GET', 'TRANSPORT-LOCKED-NO-WRITE'); check();
    calls.push({ method, suffix });
    try { const r = await request(method, suffix, body); check(); return r; }
    catch (e) { locked = true; throw e; }
  }
  const blob = await call('POST', '/git/blobs', { content: bytes.toString('base64'), encoding: 'base64' });
  assert.equal(blob.sha, expectedBlob);
  const tree = await call('POST', '/git/trees', { tree: [{ path: 'FIXTURE.json', mode: '100644', type: 'blob', sha: blob.sha }] });
  const commit = await call('POST', '/git/commits', { message: 'Technical lifecycle preservation fixture; scientific seeds 0', tree: tree.sha, parents: [] });
  const created = await call('POST', '/git/refs', { ref, sha: commit.sha });
  assert.equal(created.object.sha, commit.sha);
  // 応答消失の技術注入後は再書込みを行わず、未ACKのまま終了する。
  if (mode === 'ack-loss') { locked = true; return { ref, commit: commit.sha, blob: blob.sha, sha256, acknowledged: false, calls, writesLocked: true }; }
  const remoteRef = await call('GET', '/git/ref/' + ref.slice(5)); assert.equal(remoteRef.object.sha, commit.sha);
  const remoteCommit = await call('GET', '/git/commits/' + commit.sha); assert.equal(remoteCommit.tree.sha, tree.sha);
  const remoteBlob = await call('GET', '/git/blobs/' + blob.sha); assert.equal(remoteBlob.encoding, 'base64');
  assert.deepEqual(Buffer.from(remoteBlob.content.replace(/\s/g, ''), 'base64'), bytes);
  locked = true;
  return { ref, commit: commit.sha, blob: blob.sha, sha256, acknowledged: true, calls, writesLocked: true };
}
function client(env, deadline) {
  return async (method, suffix, body) => {
    const remaining = Math.floor(deadline - performance.now()); assert.ok(remaining > 0, 'TRANSPORT-DEADLINE');
    const response = await fetch('https://api.github.com/repos/' + REPO + suffix, { method, redirect: 'error',
      headers: { Authorization: 'Bearer ' + env.BEFCS_FIXTURE_TOKEN, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(Math.min(remaining, 15000)) });
    assert.ok(response.ok, 'FIXTURE-HTTP-' + response.status);
    const content = await response.text(); assert.ok(content.length <= 65536, 'FIXTURE-RESPONSE-LIMIT');
    return JSON.parse(content);
  };
}
module.exports = { validate, preserve, client, fixtureBytes: () => Buffer.from(FIXTURE) };
