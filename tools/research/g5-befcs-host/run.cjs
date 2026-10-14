"use strict";
// 科学seedを生成せず、専用host状態機械のGit証拠だけを保存・独立再生する。
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const cp = require('node:child_process'), zlib = require('node:zlib'), assert = require('node:assert/strict');
const R = require('../g5-befcs-workload/registry.cjs');
const I = require('../g5-befcs-workload/independent-registry.cjs');
const { session } = require('./session.cjs');
const base = path.resolve(__dirname, '../../..'), docs = path.join(base, 'doc/research-generation-5/befcs-host-20261013');
function exercise(mode) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'befcs-host-proof-'));
  try {
    const remote = path.join(directory, 'remote.git'), repo = path.join(directory, 'registry');
    cp.execFileSync('git', ['init', '--quiet', '--bare', remote]);
    const registry = R.open(repo, remote), request = { evidenceClass: 'TECHNICAL-REGISTRY-FIXTURE',
      stageId: 'BEFCS-HOST-FIXTURE-' + mode, runId: 'host-protocol-' + mode, runAttempt: 1,
      binding: R.hash('BEFCS-HOST-FIXTURE-v1'), block: { start: 1, count: 128 } };
    let started = 0, issued = 0, error = null;
    const transport = { ...registry,
      consume(...args) {
        const receipt = registry.consume(...args);
        if (mode === 'consume-response-unknown' && issued === 3) throw Error('RESPONSE-UNKNOWN');
        return receipt;
      },
      mirror(...args) {
        if (mode === 'mirror-failure' || mode === 'final-mirror-failure' && issued === 3) throw Error('MIRROR-FAILURE');
        return registry.mirror(...args);
      } };
    const protocol = session(transport, request, registry.acquire);
    try {
      protocol.begin();
      const count = mode === 'complete' ? 128 : mode === 'mirror-failure' ? 1 : mode === 'final-mirror-failure' ? 3 : 4;
      for (let n = 0; n < count; n++) {
        protocol.permit({ index: n, binding: request.binding }, n % 16 === 0 ? {
          'PREFIX.json': Buffer.from(JSON.stringify({ issued, scientificSeedsRead: 0, solution: null }))
        } : null);
        issued++; started++; // byte読取の代わりの論理callbackのみ。PRNGは存在しない。
      }
      protocol.finish({ 'FINAL.json': Buffer.from(JSON.stringify({ issued, scientificSeedsRead: 0, solution: null })) });
    } catch (e) { error = e.message; }
    const head = registry.read().sha, verified = I.verify(repo, head);
    assert.equal(verified.scientificSeedsRead, 0); assert.equal(started, issued);
    assert.equal(protocol.status, mode === 'complete' ? 'FINISHED' : 'STOPPED');
    assert.equal(issued, mode === 'complete' ? 128 : mode === 'mirror-failure' ? 0 : 3);
    assert.equal(verified.logicalReadsMarked, issued + (mode === 'consume-response-unknown' ? 1 : 0));
    cp.execFileSync('git', ['update-ref', registry.ref, head], { cwd: repo });
    const bundle = path.join(directory, 'REGISTRY.bundle');
    cp.execFileSync('git', ['bundle', 'create', bundle, registry.ref], { cwd: repo });
    return { mode, head, ref: registry.ref, registryBundleBase64: fs.readFileSync(bundle).toString('base64'),
      verified, issued, started, status: protocol.status, error, scientificSeedsRead: 0,
      scientificLeaseCreated: false, scientificStudyRegistered: false, interpretationComplete: false, solution: null };
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
function replay(row) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'befcs-host-replay-'));
  try {
    const bundle = path.join(directory, 'REGISTRY.bundle'), repo = path.join(directory, 'registry');
    fs.writeFileSync(bundle, Buffer.from(row.registryBundleBase64, 'base64'));
    cp.execFileSync('git', ['init', '--quiet', repo]);
    cp.execFileSync('git', ['fetch', '--quiet', bundle, row.ref], { cwd: repo });
    assert.deepEqual(I.verify(repo, row.head), row.verified); return true;
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
function write() {
  binding(false);
  const rows = ['complete', 'mirror-failure', 'consume-response-unknown', 'final-mirror-failure'].map(mode => {
    console.error('host-scenario', mode); return exercise(mode);
  });
  const bytes = Buffer.from(JSON.stringify(rows)), target = path.join(docs, 'results');
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'TECHNICAL_EVIDENCE.json.gz'), zlib.gzipSync(bytes));
  const result = { decision: 'HOST-PROTOCOL-PASS-SCIENTIFIC-WORKER-INTEGRATION-PENDING',
    sourceManifestSha256: R.hash(fs.readFileSync(path.join(docs, 'SOURCE_MANIFEST.json'))),
    evidenceSha256: R.hash(bytes), scenarios: rows.map(({ registryBundleBase64, ...row }) => row),
    scientificSeedsRead: 0, scientificLeaseCreated: false, scientificStudyRegistered: false,
    conservativeReadIdentities: 103355, formalRelationRegistered: false, publicAiChanged: false };
  fs.writeFileSync(path.join(target, 'RESULT.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}
function binding(outputs = true) {
  for (const file of ['SOURCE_MANIFEST.json', 'PROTECTED_INPUTS.json', ...(outputs ? ['OUTPUT_BINDING.json'] : [])]) {
    const manifest = JSON.parse(fs.readFileSync(path.join(docs, file)));
    for (const [name, digest] of Object.entries(manifest.files)) assert.equal(R.hash(fs.readFileSync(path.join(base, name))), digest, name);
  }
  return true;
}
function check() {
  binding(); const target = path.join(docs, 'results'), result = JSON.parse(fs.readFileSync(path.join(target, 'RESULT.json')));
  const bytes = zlib.gunzipSync(fs.readFileSync(path.join(target, 'TECHNICAL_EVIDENCE.json.gz')));
  assert.equal(R.hash(bytes), result.evidenceSha256);
  assert.equal(R.hash(fs.readFileSync(path.join(docs, 'SOURCE_MANIFEST.json'))), result.sourceManifestSha256);
  const rows = JSON.parse(bytes); rows.forEach(replay);
  assert.deepEqual(rows.map(({ registryBundleBase64, ...row }) => row), result.scenarios);
  return result;
}
if (require.main === module) {
  assert.ok(['--write', '--check'].includes(process.argv[2]));
  console.log(JSON.stringify(process.argv[2] === '--write' ? write() : check()));
}
module.exports = { exercise, replay, binding, check };
