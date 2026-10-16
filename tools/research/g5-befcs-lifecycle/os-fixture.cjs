"use strict";
// 専用systemd unit内の既知fixtureだけを実行する。科学API・認証・ネットワークを使わない。
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const crypto = require('node:crypto'), assert = require('node:assert/strict');
const { create } = require('./ledger.cjs');
const { LIMITS, disk } = require('../g5-befcs-envelope/envelope.cjs');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
function ownScope(unit, raw) {
  assert.match(unit, /^bao-g5-lifecycle-[a-f0-9]{16}\.service$/);
  const lines = raw.trim().split('\n'); assert.equal(lines.length, 1);
  assert.ok(lines[0].startsWith('0::/'));
  const name = lines[0].slice(3);
  assert.ok(!name.split('/').some(p => p === '.' || p === '..'));
  assert.equal(path.posix.basename(name), unit, 'NOT-OWN-UNIT');
  return path.resolve('/sys/fs/cgroup', '.' + name);
}
function atomic(file, value) {
  const data = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, data); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  const d = fs.openSync(path.dirname(file), 'r'); try { fs.fsyncSync(d); } finally { fs.closeSync(d); }
  return sha(data);
}
function run(directory, mode, unit) {
  assert.ok(['complete', 'memory', 'preserve-no-ack'].includes(mode));
  assert.equal(process.getuid(), 0, 'DEDICATED-ROOT-UNIT-REQUIRED');
  const root = ownScope(unit, fs.readFileSync('/proc/self/cgroup', 'utf8'));
  assert.equal(fs.readFileSync(root + '/memory.max', 'utf8').trim(), String(LIMITS.maxRssBytes));
  assert.equal(fs.readFileSync(root + '/memory.swap.max', 'utf8').trim(), '0');
  assert.ok(!fs.existsSync(directory), 'NEW-OUTPUT-REQUIRED'); fs.mkdirSync(directory, { recursive: true });
  const started = performance.now(), roles = [], children = [];
  let preservedBytes = 0;
  const read = file => Number(fs.readFileSync(root + '/' + file, 'utf8').trim());
  const ledger = create({ evidenceClass: 'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE', scientificSeedsRead: 0, limits: { ...LIMITS } },
    () => performance.now() - started,
    () => ({ scopeCreatedBeforeCheckout: true, controllerIncluded: (() => { const current = fs.readFileSync('/proc/self/cgroup', 'utf8').trim().slice(3); const actual = path.resolve('/sys/fs/cgroup', '.' + current); return actual === root || actual.startsWith(root + '/'); })(),
      scopeId: root, hardMemoryBytes: read('memory.max'), swapMaxBytes: read('memory.swap.max'),
      coveredRoles: ['supervisor', 'checkout', 'worker', 'transport', 'preserver'],
      memoryPeakBytes: read('memory.peak'), workspaceBytes: disk(directory).charged,
      remoteBytes: preservedBytes, accountingComplete: true }));
  function child(role, command, args, options = {}) {
    // spawnSyncの全子はこの専用unitを継承する。fixture以外のcommandを受付けるCLIは持たない。
    roles.push(role);
    const r = cp.spawnSync(command, args, { cwd: directory, timeout: 10000, encoding: 'utf8', maxBuffer: 65536, ...options });
    children.push({ role, status: r.status, signal: r.signal, error: r.error?.code ?? null });
    return r;
  }
  const ok = r => assert.equal(r.status, 0, r.stderr);
  let finished = null, failure = null;
  try {
    ledger.enter('checkout');
    ok(child('checkout', 'git', ['init', '-q', 'fixture-origin']));
    fs.writeFileSync(directory + '/fixture-origin/fixture.txt', 'fixed-lifecycle-fixture-v1\n');
    ok(child('checkout', 'git', ['-C', 'fixture-origin', 'add', 'fixture.txt']));
    ok(child('checkout', 'git', ['-C', 'fixture-origin', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@invalid', 'commit', '-qm', 'fixed fixture'],
      { env: { ...process.env, GIT_AUTHOR_DATE: '2026-10-15T00:00:00Z', GIT_COMMITTER_DATE: '2026-10-15T00:00:00Z' } }));
    ok(child('checkout', 'git', ['clone', '-q', '--no-hardlinks', 'fixture-origin', 'checkout']));
    ledger.enter('prepare');
    if (mode === 'memory') {
      // 子だけを128 MiBで制限し、親1 GiBとsupervisorを保持する。
      fs.mkdirSync(root + '/controller'); fs.writeFileSync(root + '/controller/cgroup.procs', String(process.pid));
      fs.writeFileSync(root + '/cgroup.subtree_control', '+memory'); fs.mkdirSync(root + '/memory-child');
      fs.writeFileSync(root + '/memory-child/memory.max', '134217728'); fs.writeFileSync(root + '/memory-child/memory.swap.max', '0');
      ledger.enter('work');
      const r = child('worker', 'bash', ['-c', 'echo $$ > "$1/cgroup.procs"; exec "$2" -e \'const a=[]; for(;;) a.push(Buffer.alloc(8*1024*1024,1));\'', 'fixture', root + '/memory-child', process.execPath]);
      assert.equal(r.signal, 'SIGKILL');
      assert.match(fs.readFileSync(root + '/memory-child/memory.events', 'utf8'), /oom_kill [1-9]/);
      assert.equal(fs.readFileSync(root + '/memory-child/cgroup.procs', 'utf8').trim(), '');
      ledger.stop('EXPECTED-CHILD-CGROUP-OOM'); failure = 'EXPECTED-CHILD-CGROUP-OOM';
    } else {
      ledger.enter('work');
      ok(child('worker', process.execPath, ['-e', 'require("fs").writeFileSync("WORK.json",JSON.stringify({fixture:true,scientificSeedsRead:0}))']));
      ledger.enter('finalize');
      const work = fs.readFileSync(directory + '/WORK.json');
      atomic(directory + '/FINAL.json', { workSha256: sha(work), scientificSeedsRead: 0 });
      ledger.enter('preserve');
      fs.mkdirSync(directory + '/sink');
      ok(child('transport', process.execPath, ['-e', 'const f=require("fs");f.copyFileSync("FINAL.json","sink/FINAL.json");const d=f.openSync("sink/FINAL.json","r");f.fsyncSync(d);f.closeSync(d);const p=f.openSync("sink","r");f.fsyncSync(p);f.closeSync(p);']));
      preservedBytes = fs.statSync(directory + '/sink/FINAL.json').size;
      const hash = sha(fs.readFileSync(directory + '/sink/FINAL.json'));
      const acknowledged = child('preserver', process.execPath, ['-e', 'const f=require("fs"),c=require("crypto");process.stdout.write(c.createHash("sha256").update(f.readFileSync("sink/FINAL.json")).digest("hex"))']);
      ok(acknowledged); assert.equal(acknowledged.stdout, hash);
      assert.equal(hash, sha(fs.readFileSync(directory + '/FINAL.json')));
      // 同期子がすべて終了し、現在の専用scopeにcontroller以外がいないことを確認する。
      const expectedPids = [String(process.pid)];
      assert.deepEqual(fs.readFileSync(root + '/cgroup.procs', 'utf8').trim().split(/\s+/).sort(), expectedPids);
      finished = ledger.finish({ workStopped: true, allManagedChildrenStopped: true,
        durableReceipt: { sha256: hash, acknowledged: mode !== 'preserve-no-ack' } });
    }
  } catch (e) { failure = e.message; }
  if (mode === 'complete') assert.ok(finished, failure);
  if (mode === 'preserve-no-ack') assert.match(failure ?? '', /PRESERVATION-NOT-ACKNOWLEDGED/);
  if (mode === 'memory') assert.equal(failure, 'EXPECTED-CHILD-CGROUP-OOM');
  const result = { mode, fixturePassed: true, finished, failure, roles, children, records: ledger.records,
    memoryPeakBytes: read('memory.peak'), elapsedMs: performance.now() - started,
    preservation: 'LOCAL-FSYNC-SINK-ONLY', wholeLifecycleOsProven: false,
    externalBootstrapAndActionsUploadCovered: false, scientificSeedsRead: 0, scientificExecutionAuthorized: false };
  atomic(directory + '/OS_RESULT.json', result); return result;
}
if (require.main === module) {
  assert.equal(process.argv[2], '--os-fixture');
  console.log(JSON.stringify(run(path.resolve(process.argv[3]), process.argv[4], process.argv[5])));
}
module.exports = { ownScope, run };
