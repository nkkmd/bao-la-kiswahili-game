"use strict";
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const { ownScope } = require('../g5-befcs-lifecycle/os-fixture.cjs');
const { create } = require('../g5-befcs-lifecycle/ledger.cjs');
const { LIMITS, disk } = require('../g5-befcs-envelope/envelope.cjs');
const T = require('./transport.cjs');
async function run(output, mode, unit, env = process.env) {
  const ref = T.validate(env, mode); // 認証通信の前に技術専用namespaceを確定する。
  assert.equal(process.getuid(), 0); const root = ownScope(unit, fs.readFileSync('/proc/self/cgroup', 'utf8'));
  assert.ok(!fs.existsSync(output), 'NEW-OUTPUT-REQUIRED'); fs.mkdirSync(output, { recursive: true });
  const start = performance.now(), read = name => Number(fs.readFileSync(root + '/' + name, 'utf8'));
  let chargedRemote = 0;
  const ledger = create({ evidenceClass: 'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE', scientificSeedsRead: 0, limits: { ...LIMITS } }, () => performance.now() - start,
    () => ({ scopeCreatedBeforeCheckout: true, controllerIncluded: fs.readFileSync(root + '/cgroup.procs', 'utf8').trim().split(/\s+/).includes(String(process.pid)),
      scopeId: root, hardMemoryBytes: read('memory.max'), swapMaxBytes: read('memory.swap.max'),
      coveredRoles: ['supervisor', 'checkout', 'worker', 'transport', 'preserver'], memoryPeakBytes: read('memory.peak'), workspaceBytes: disk(output).charged, remoteBytes: chargedRemote, accountingComplete: true }));
  const children = [];
  const git = args => { const r = cp.spawnSync('git', args, { cwd: output, timeout: 5000, encoding: 'utf8', maxBuffer: 65536,
    env: { PATH: env.PATH, HOME: output, GIT_AUTHOR_DATE: '2026-10-15T00:00:00Z', GIT_COMMITTER_DATE: '2026-10-15T00:00:00Z', GIT_CONFIG_NOSYSTEM: '1' } });
    children.push({ status: r.status, signal: r.signal }); assert.equal(r.status, 0, 'FIXTURE-GIT-FAILED'); ledger.sample(); };
  function save(name, value) { const fd = fs.openSync(path.join(output, name), 'wx', 0o600); try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); } }
  let remote = null, finished = null, failure = null;
  const journal = fs.openSync(path.join(output, 'TRANSPORT.jsonl'), 'wx', 0o600);
  try {
    ledger.enter('checkout'); git(['init', '-q', 'origin']); fs.writeFileSync(path.join(output, 'origin/FIXTURE.txt'), 'known-fixture-only\n');
    git(['-C', 'origin', 'add', 'FIXTURE.txt']); git(['-C', 'origin', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@invalid', 'commit', '-qm', 'fixed']);
    git(['clone', '-q', '--no-hardlinks', 'origin', 'checkout']); ledger.enter('prepare');
    ledger.enter('work'); const bytes = Buffer.from('{"fixtureVersion":1,"scientificSeedsRead":0}\n'); fs.writeFileSync(path.join(output, 'FIXTURE.json'), bytes);
    ledger.enter('finalize'); ledger.enter('preserve');
    const client = T.client(env, Math.min(start + 60000, start + LIMITS.maxTotalMs));
    remote = await T.preserve(bytes, mode, env, async (method, suffix, body) => {
      fs.writeSync(journal, JSON.stringify({ event: 'BEFORE', method, suffix, elapsedMs: performance.now() - start }) + '\n'); fs.fsyncSync(journal);
      const response = await client(method, suffix, body);
      chargedRemote += Buffer.byteLength(JSON.stringify(body ?? {})) + Buffer.byteLength(JSON.stringify(response));
      fs.writeSync(journal, JSON.stringify({ event: 'RESPONSE', method, suffix, response, elapsedMs: performance.now() - start }) + '\n'); fs.fsyncSync(journal); return response;
    }, () => ledger.sample());
    save('REMOTE_RECEIPT.json', remote);
    assert.deepEqual(fs.readFileSync(root + '/cgroup.procs', 'utf8').trim().split(/\s+/), [String(process.pid)]);
    finished = ledger.finish({ workStopped: true, allManagedChildrenStopped: true, durableReceipt: remote });
  } catch (e) { failure = e.message; }
  finally { fs.closeSync(journal); }
  const result = { mode, ref, finished, failure, remote, children, records: ledger.records,
    elapsedMs: performance.now() - start, memoryPeakBytes: read('memory.peak'),
    externalBootstrapCovered: false, actionsArtifactUploadCovered: false, physicalWorkspaceHardLimitProven: false,
    wholeLifecycleOsProven: false, scientificSeedsRead: 0, scientificExecutionAuthorized: false };
  save('RESULT.json', result);
  if (mode === 'complete') assert.ok(finished, failure);
  else { assert.ok(remote && !remote.acknowledged); assert.match(failure ?? '', /PRESERVATION-NOT-ACKNOWLEDGED/); }
  return result;
}
if (require.main === module) run(path.resolve(process.argv[2]), process.argv[3], process.argv[4]).then(r => console.log(JSON.stringify(r))).catch(e => { console.error(e.message); process.exitCode = 1; });
module.exports = { run };
