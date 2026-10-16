"use strict";
// 新規の専用unitと専用imageだけを操作する、科学未実行の容量fixture。
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const { ownScope } = require('../g5-befcs-lifecycle/os-fixture.cjs');
const { LIMITS, disk } = require('../g5-befcs-envelope/envelope.cjs');
const IMAGE_BYTES = LIMITS.maxEvidenceBytes - LIMITS.storageReserveBytes;
function run(output, mode, unit) {
  assert.ok(['complete', 'enospc'].includes(mode)); assert.equal(process.getuid(), 0);
  const root = ownScope(unit, fs.readFileSync('/proc/self/cgroup', 'utf8'));
  assert.equal(fs.readFileSync(root + '/memory.max', 'utf8').trim(), String(LIMITS.maxRssBytes));
  assert.equal(fs.readFileSync(root + '/memory.swap.max', 'utf8').trim(), '0');
  assert.ok(!fs.existsSync(output), 'NEW-OUTPUT-REQUIRED'); fs.mkdirSync(output, { recursive: true });
  const began = performance.now(), image = path.join(output, 'WORKSPACE.img'), mount = path.join(output, 'workspace');
  const fd = fs.openSync(image, 'wx'); fs.ftruncateSync(fd, IMAGE_BYTES); fs.closeSync(fd); fs.mkdirSync(mount);
  const commands = [];
  function exec(file, args) {
    assert.ok(performance.now() - began < 60000, 'FIXTURE-TIME-LIMIT');
    const r = cp.spawnSync(file, args, { timeout: 30000, encoding: 'utf8', maxBuffer: 65536 });
    commands.push({ file, status: r.status, signal: r.signal }); assert.equal(r.status, 0, 'CAPACITY-COMMAND-FAILED:' + file);
  }
  let mounted = false, filesystem = null, fill = null, released = false;
  const states = [];
  try {
    exec('mkfs.ext4', ['-q', '-F', '-m', '0', image]);
    exec('mount', ['-o', 'loop,nosuid,nodev,noexec', image, mount]); mounted = true;
    const st = fs.statfsSync(mount); filesystem = { type: st.type, blockSize: st.bsize, blocks: st.blocks, bytes: st.blocks * st.bsize };
    assert.equal(st.type, 0xEF53); assert.ok(filesystem.bytes <= IMAGE_BYTES);
    exec('fallocate', ['-l', String(LIMITS.storageReserveBytes), path.join(mount, 'FINAL_RESERVE')]);
    states.push({ phase: 'reserve-created', freeBytes: fs.statfsSync(mount).bfree * st.bsize });
    const script = 'import os,sys,json\np=sys.argv[1]; mode=sys.argv[2]; n=0; code=None\nf=open(p,"wb",buffering=0)\ntry:\n while mode=="enospc" or n<1048576:\n  n+=f.write(b"x"*1048576)\nexcept OSError as e:\n code=e.errno\nfinally:\n f.close()\nprint(json.dumps({"writtenBytes":n,"errno":code}))';
    const r = cp.spawnSync('python3', ['-c', script, path.join(mount, 'WORK.bin'), mode], { timeout: 30000, encoding: 'utf8', maxBuffer: 65536 });
    assert.equal(r.status, 0); fill = JSON.parse(r.stdout);
    if (mode === 'enospc') assert.equal(fill.errno, 28); else assert.equal(fill.errno, null);
    states.push({ phase: 'after-work', freeBytes: fs.statfsSync(mount).bfree * st.bsize });
    fs.unlinkSync(path.join(mount, 'FINAL_RESERVE')); released = true;
    const witness = { fixtureOnly: true, mode, fill, solution: null, scientificSeedsRead: 0 };
    const w = fs.openSync(path.join(mount, 'STOP_WITNESS.json'), 'wx'); fs.writeFileSync(w, JSON.stringify(witness)); fs.fsyncSync(w); fs.closeSync(w);
    const d = fs.openSync(mount, 'r'); fs.fsyncSync(d); fs.closeSync(d);
    states.push({ phase: 'witness-saved', freeBytes: fs.statfsSync(mount).bfree * st.bsize });
    exec('sync', ['-f', mount]);
  } finally {
    if (mounted) { exec('umount', [mount]); mounted = false; }
  }
  // imageを別プロセスで読取り検査する。元のファイルシステムを修復・再生成しない。
  exec('e2fsck', ['-fn', image]);
  const check = cp.spawnSync('debugfs', ['-R', 'cat /STOP_WITNESS.json', image], { encoding: 'utf8', timeout: 10000, maxBuffer: 65536 });
  assert.equal(check.status, 0); const witness = JSON.parse(check.stdout); assert.equal(witness.fill.errno, fill.errno);
  const charged = disk(output); assert.ok(charged.charged + 65536 <= LIMITS.maxEvidenceBytes, 'SIDECAR-RESERVE-EXCEEDED');
  const imageSha256 = cp.execFileSync('sha256sum', [image], { encoding: 'utf8', timeout: 10000 }).split(' ')[0];
  const result = { decision: 'PHYSICAL-FIXTURE-CAP-VERIFIED-WHOLE-LIFECYCLE-PENDING', mode, filesystem, imageBytes: fs.statSync(image).size,
    imageSha256, chargedBeforeResult: charged, storageReserveBytes: LIMITS.storageReserveBytes, reserveReleased: released, fill, states, commands,
    witness, elapsedMs: performance.now() - began, memoryPeakBytes: Number(fs.readFileSync(root + '/memory.peak', 'utf8')),
    fixtureWorkCompleted: mode === 'complete', dedicatedImageHardLimitProven: true, externalBootstrapCovered: false,
    actionsArtifactUploadCovered: false, wholeLifecycleOsProven: false, scientificSeedsRead: 0, scientificExecutionAuthorized: false };
  const out = fs.openSync(path.join(output, 'RESULT.json'), 'wx'); fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n'); fs.fsyncSync(out); fs.closeSync(out);
  assert.ok(disk(output).charged <= LIMITS.maxEvidenceBytes);
  return result;
}
if (require.main === module) { try { console.log(JSON.stringify(run(path.resolve(process.argv[2]), process.argv[3], process.argv[4]))); } catch (e) { console.error(e.message); process.exitCode = 1; } }
module.exports = { IMAGE_BYTES };
