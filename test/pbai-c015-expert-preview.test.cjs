'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { prepare } = require('../tools/engineering/prepare-pbai-c015-expert-preview.cjs');
const fixtures = require('../tools/engineering/browser/pbai-p9/fixtures.json').rows;
const C = require('../tools/engineering/lib/pbai-p11-common.js');
const temp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'bao-expert-test-'));
const dirs = Object.fromEntries(['candidate', 'rollback'].map(m => [m, path.join(temp, m)]));
const manifests = Object.fromEntries(Object.entries(dirs).map(([m, d]) => [m, prepare(d, m)]));
function load(mode, missing) {
  const ctx = vm.createContext({ performance }); ctx.self = ctx;
  let listener; ctx.addEventListener = (_, fn) => { listener = fn; };
  ctx.postMessage = r => { ctx.result = r; };
  ctx.importScripts = (...files) => files.forEach(file => {
    if (path.basename(file) === missing) throw Error('Injected missing asset');
    vm.runInContext(fs.readFileSync(path.join(dirs[mode], file), 'utf8'), ctx);
  });
  ctx.importScripts('ai-release-worker.js');
  return { ctx, send(request) { listener({ data: request }); return ctx.result; } };
}
const stable = r => { const { elapsedMs, evaluationCandidate, evaluationFallback, ...stats } = r.stats; return JSON.stringify({ move: r.move, stats }); };
test('生成した候補は凍結したP11アダプターと完全一致し、切戻しは公開版と一致する', () => {
  const original = fs.readFileSync(path.join(C.ROOT, 'public/ai-release.js'), 'utf8');
  assert.equal(fs.readFileSync(path.join(dirs.candidate, 'ai-release.js'), 'utf8'), require('../tools/engineering/lib/pbai-p11-adapter.cjs')(original));
  assert.equal(fs.readFileSync(path.join(dirs.rollback, 'ai-release.js'), 'utf8'), original);
  assert.notEqual(manifests.candidate.cache, manifests.rollback.cache);
  assert.throws(() => prepare(dirs.candidate));
});
test('既知9局面で生成済み候補のWorker・直接実行・候補本体が一致する', () => {
  for (const f of fixtures) {
    const { ctx, send } = load('candidate');
    const options = { ...ctx.BaoReleaseConfig.searchOptions('expert'), maxDepth: 2, timeLimitMs: Infinity };
    ctx.random = C.rng(f.seed); vm.runInContext('Math.random = random', ctx);
    const worker = send({ type: 'search', id: 41, level: 'expert', state: f.state, options });
    assert.equal(worker.type, 'result'); assert.equal(worker.id, 41);
    assert.equal(worker.stats.evaluationCandidate, 'PBAI-C015-v1');
    assert.equal(stable(worker), stable(ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', C.rng(f.seed), options)));
    assert.equal(stable(worker), stable(ctx.BaoCandidateAI.analyzeMove(f.state, 'expert', C.rng(f.seed), options)));
  }
});
test('hard・easy・normalの挙動とexpertの3設定を維持する', () => {
  const a = load('candidate').ctx, b = load('rollback').ctx;
  for (const level of ['easy', 'normal', 'hard']) {
    assert.equal(JSON.stringify(a.BaoReleaseConfig.searchOptions(level)), JSON.stringify(b.BaoReleaseConfig.searchOptions(level)));
    assert.equal(JSON.stringify(a.BaoReleaseConfig.displayIdentity(level)), JSON.stringify(b.BaoReleaseConfig.displayIdentity(level)));
    for (const f of fixtures) {
      const options = { ...a.BaoReleaseConfig.searchOptions(level), maxDepth: 2, timeLimitMs: Infinity };
      assert.equal(stable(a.BaoReleaseAI.analyzeMove(f.state, level, C.rng(f.seed), options)), stable(b.BaoReleaseAI.analyzeMove(f.state, level, C.rng(f.seed), options)));
    }
  }
  for (const caps of [{ hardwareConcurrency: 2, deviceMemory: 2 }, { hardwareConcurrency: 4, deviceMemory: 4 }, { hardwareConcurrency: 8, deviceMemory: 4 }]) {
    const options = a.BaoReleaseConfig.searchOptions('expert', caps);
    assert.equal(options.pbaiC015LogicGate, true); delete options.pbaiC015LogicGate;
    assert.equal(JSON.stringify(options), JSON.stringify(b.BaoReleaseConfig.searchOptions('expert', caps)));
  }
});
test('候補とモデルの取得失敗で直接実行・Workerとも基準AIへ戻る', () => {
  for (const missing of ['logic-evaluator.js', 'ai-candidate.js']) {
    const { ctx, send } = load('candidate', missing), f = fixtures[0];
    const options = { ...ctx.BaoReleaseConfig.searchOptions('expert'), maxDepth: 2, timeLimitMs: Infinity };
    ctx.random = C.rng(f.seed); vm.runInContext('Math.random = random', ctx);
    const r = send({ type: 'search', id: 42, level: 'expert', state: f.state, options });
    assert.equal(r.type, 'result'); assert.equal(r.stats.evaluationFallback, true);
    assert.equal(stable(r), stable(ctx.BaoAI.analyzeMove(f.state, 'expert', C.rng(f.seed), options)));
    assert.equal(ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', C.rng(f.seed), options).stats.evaluationFallback, true);
    assert.equal(ctx.BaoReleaseConfig.displayIdentity('expert', r.stats).releaseId, 'AI-GEN3-RELEASE-001');
  }
});
test('対象外profile・独自重みで候補を誤適用しない', () => {
  const { ctx } = load('candidate');
  ctx.BaoLogicGate.evaluate = () => { throw Error('Out of scope'); };
  for (const extra of [{ evaluationProfile: 'legacy' }, { evaluationProfile: 'bao-v2' }, { searchProfile: 'legacy' }, { evaluationAdjustments: {} }, { evaluationWeights: ctx.BaoAIWeights.cloneWeights(ctx.BaoAIWeights.DEFAULT_WEIGHTS) }]) {
    assert.doesNotThrow(() => ctx.BaoReleaseAI.analyzeMove(fixtures[0].state, 'expert', C.rng(1), { ...C.options(1, 10), pbaiC015LogicGate: true, ...extra }));
  }
});
