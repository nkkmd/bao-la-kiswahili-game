'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const H = require('../tools/takasia/ai-harness.cjs');
const E = require('../public/engine.js');
const Rules = require('../public/rule-versions.js');
const zip = path.join(root, 'artifacts/pbai-p11/device-package/expert-preview.zip');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex'), '911db46a09366336b47ae400bdb0d231d735b451314e57d1d502f7cc496bd91c');
const referenceAdapter = execFileSync('unzip', ['-p', zip, 'ai-release.js'], { encoding: 'utf8' });
const fixtures = require('../tools/engineering/browser/pbai-p9/fixtures.json').rows;
const rng = seed => () => { seed += 0x6D2B79F5; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function load(reference = false, missing = null) {
  const ctx = vm.createContext({ performance }); ctx.self = ctx;
  let cb; ctx.addEventListener = (_, fn) => { cb = fn; }; ctx.postMessage = r => { ctx.result = r; };
  ctx.importScripts = (...names) => names.forEach(name => {
    if (path.basename(name) === missing) throw Error('Injected missing asset');
    const text = reference && path.basename(name) === 'ai-release.js' ? referenceAdapter : fs.readFileSync(path.join(root, 'public', name), 'utf8');
    vm.runInContext(text, ctx);
  });
  ctx.importScripts('ai-release-worker.js');
  return { ctx, send(request) { cb({ data: request }); return ctx.result; } };
}
const stable = r => { const { elapsedMs, ...stats } = r.stats; return JSON.stringify({ move: r.move, stats }); };
test('全難易度・3端末設定の探索条件は実機確認済みコピーと一致する', () => {
  const a = load().ctx, b = load(true).ctx;
  for (const caps of [{ hardwareConcurrency: 2, deviceMemory: 2 }, { hardwareConcurrency: 4, deviceMemory: 4 }, { hardwareConcurrency: 8, deviceMemory: 4 }]) {
    for (const level of ['easy', 'normal', 'hard', 'expert']) assert.equal(JSON.stringify(a.BaoReleaseConfig.searchOptions(level, caps)), JSON.stringify(b.BaoReleaseConfig.searchOptions(level, caps)));
  }
});
test('新ルール12局面のexpertで本番Worker・直接実行は通常遷移の参照と一致する', () => {
  for (const f of H.cases()) {
    const a = load(), b = H.load({ detailed: true });
    const options = { ...a.ctx.BaoReleaseConfig.searchOptions('expert'), maxDepth: 2, timeLimitMs: Infinity };
    const expected = b.ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', rng(f.seed ?? 1008), { ...options, pbaiC011LightweightTransitions: false });
    assert.equal(stable(a.ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', rng(f.seed ?? 1008), options)), stable(expected));
    a.ctx.random = rng(f.seed ?? 1008); vm.runInContext('Math.random = random', a.ctx);
    const result = a.send({ type: 'search', id: 17, state: f.state, level: 'expert', options });
    assert.equal(result.type, 'result'); assert.equal(result.id, 17);
    assert.equal(result.positionKey, a.ctx.BaoAI.stateKey(f.state));
    assert.equal(stable(result), stable(expected));
    assert.equal(result.stats.evaluationCandidate, 'PBAI-C015-v1'); assert.equal(result.stats.evaluationFallback, false);
    assert.equal(result.ruleRevision, Rules.CURRENT_REVISION);
    assert.equal(result.stats.ruleRevision, Rules.CURRENT_REVISION);
    assert.equal(result.stats.aiRevision, 'AI-GEN4-TAKASIA-001');
    assert.doesNotThrow(() => E.applyMove(f.state, result.move));
  }
});
test('expertのモデル・候補取得失敗と対象外profileは基準AIへ戻る', () => {
  const f = fixtures[0];
  for (const missing of ['logic-evaluator.js', 'ai-candidate.js']) {
    const { ctx } = load(false, missing), options = { ...ctx.BaoReleaseConfig.searchOptions('expert'), maxDepth: 2, timeLimitMs: Infinity };
    const result = ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', rng(f.seed ?? 1008), options);
    assert.equal(result.stats.evaluationFallback, true);
    assert.equal(ctx.BaoReleaseConfig.displayIdentity('expert', result.stats).releaseId, 'AI-GEN3-RELEASE-001');
  }
  const { ctx } = load(); ctx.BaoLogicGate.evaluate = () => { throw Error('Out of scope'); };
  for (const extra of [{ evaluationProfile: 'legacy' }, { evaluationProfile: 'bao-v2' }, { searchProfile: 'legacy' }, { evaluationAdjustments: {} }, { evaluationWeights: ctx.BaoAIWeights.cloneWeights(ctx.BaoAIWeights.DEFAULT_WEIGHTS) }]) {
    const result = ctx.BaoReleaseAI.analyzeMove(f.state, 'expert', rng(f.seed ?? 1008), { ...ctx.BaoReleaseConfig.searchOptions('expert'), maxDepth: 1, timeLimitMs: 10, ...extra });
    assert.equal(result.stats.evaluationCandidate, undefined);
  }
});
