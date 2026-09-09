"use strict";
// 既知局面だけを使う採用レビュー補足。対局・学習・棋力判定は行わない。
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { Worker } = require('node:worker_threads');
const { performance } = require('node:perf_hooks');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const E = require('../../public/engine.js');
const A = require('../../public/ai.js');
const config = require('../../public/ai-config.js');
const fixturePath = path.join(root, 'tools/engineering/browser/pbai-p9/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturePath));
const tiers = { low: { hardwareConcurrency: 2, deviceMemory: 2 }, standard: { hardwareConcurrency: 4, deviceMemory: 4 }, high: { hardwareConcurrency: 8, deviceMemory: 8 } };
const cases = [['hard', 'high'], ['expert', 'low'], ['expert', 'standard'], ['expert', 'high']];
const output = process.argv[2];
if (!output) throw Error('保存先JSONを指定してください');
fs.mkdirSync(path.dirname(output), { recursive: true });
const fd = fs.openSync(output, 'wx');
const report = {
  purpose: 'known-fixture-node-release-readiness', sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  scriptSha256: crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
  fixtureSha256: crypto.createHash('sha256').update(fs.readFileSync(fixturePath)).digest('hex'),
  node: process.version, platform: process.platform, startedAt: new Date().toISOString(),
  knownFixturesOnly: true, newGames: 0, physicalDeviceVerified: false, browserVerified: false,
  strengthInferenceAuthorized: false, passed: false, rows: [],
};
let active;
const outer = setTimeout(() => { report.error = '全体240秒期限'; if (active) active.terminate(); save(); process.exit(1); }, 240000);
function save() { report.finishedAt = new Date().toISOString(); fs.writeFileSync(fd, JSON.stringify(report, null, 2) + '\n'); }
function search(actor, f, level, options) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const worker = new Worker(path.join(__dirname, 'lib/pbai-p9-worker.cjs'), { workerData: { actor }, resourceLimits: { maxOldGenerationSizeMb: 256 } });
    active = worker;
    let done = false;
    const finish = async (error, data) => {
      if (done) return;
      done = true; clearTimeout(timer);
      const wallTimeMs = performance.now() - start;
      await worker.terminate(); active = null;
      if (error) reject(error); else resolve({ ...data, wallTimeMs });
    };
    const timer = setTimeout(() => finish(Error('要求10秒期限')), 10000);
    worker.once('error', e => finish(e));
    worker.once('exit', code => { if (!done) finish(Error('応答前終了: ' + code)); });
    worker.once('message', data => finish(data.type === 'error' ? Error(data.message) : null, data));
    worker.postMessage({ type: 'search', id: f.seed, seed: f.seed, state: f.state, level, options });
  });
}
(async () => {
  try {
    for (const [level, tier] of cases) {
      for (const f of fixtures.rows) for (const actor of ['baseline', 'logic']) {
        const options = config.searchOptions(level, tiers[tier], f.state);
        const before = JSON.stringify(f.state);
        const r = await search(actor, f, level, options);
        assert.equal(r.type, 'result'); assert.equal(r.id, f.seed);
        assert.equal(r.positionKey, A.stateKey(f.state));
        assert(E.moveVariants(f.state).some(m => A.moveKey(m) === A.moveKey(r.move)));
        E.applyMove(f.state, r.move);
        assert.equal(JSON.stringify(f.state), before);
        assert(Number.isFinite(r.stats.rootScore)); assert(Number.isFinite(r.stats.elapsedMs));
        assert(r.stats.completedDepth <= options.maxDepth);
        report.rows.push({ level, tier, fixture: f.name, actor, options, ...r });
      }
      console.log(JSON.stringify({ level, tier, completed: report.rows.length }));
    }
    assert.equal(report.rows.length, 72);
    report.passed = true;
  } catch (e) { report.error = String(e); process.exitCode = 1; }
  finally { clearTimeout(outer); save(); fs.closeSync(fd); }
  console.log(JSON.stringify({ passed: report.passed, requests: report.rows.length, error: report.error, physicalDeviceVerified: false, strengthInferenceAuthorized: false }));
})();
