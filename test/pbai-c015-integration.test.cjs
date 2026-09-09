"use strict";
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const fixtures = require('../tools/engineering/browser/pbai-p9/fixtures.json').rows;
function load({ model = true, enabled = false } = {}) {
  const listeners = [], ctx = vm.createContext({ console });
  ctx.self = ctx; ctx.addEventListener = (type, cb) => listeners.push(cb);
  ctx.postMessage = r => { ctx.result = r; };
  const script = name => {
    if (name === './logic-evaluator.js' && !model) throw Error('model unavailable');
    let text = fs.readFileSync(path.join(root, 'public', name), 'utf8');
    if (enabled && name.endsWith('ai-release.js')) text = text.replace('const PBAI_C015_ENABLED = false;', 'const PBAI_C015_ENABLED = true;');
    vm.runInContext(text, ctx, { filename: name });
  };
  ctx.importScripts = (...names) => names.forEach(script);
  script('ai-release-worker.js'); script('diagnostics.js');
  return { ctx, send: request => { for (const cb of listeners) cb({ data: request }); return ctx.result; } };
}
const rng = seed => () => { seed += 0x6D2B79F5; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const stable = r => { const { elapsedMs, evaluationCandidate, evaluationFallback, ...stats } = r.stats; return JSON.stringify({ move: r.move, stats }); };
test('公開用の静的モデルはP9で検証したbyteを保持する', () => {
  assert.equal(fs.readFileSync(path.join(root, 'public/logic-evaluator.js'), 'utf8'), fs.readFileSync(path.join(root, 'tools/engineering/browser/pbai-p9/logic-evaluator.js'), 'utf8'));
});
test('候補探索は凍結したP9実装の公開名だけを変更する', () => {
  const old = fs.readFileSync(path.join(root, 'tools/engineering/browser/pbai-p9/candidate-ai.js'), 'utf8');
  assert.equal(fs.readFileSync(path.join(root, 'public/ai-candidate.js'), 'utf8'), old.replace('root.BaoAI = api;', 'root.BaoCandidateAI = api;'));
});
test('既定は無効、有効時もhardだけ。切戻し後は元の設定', () => {
  const off = load().ctx, on = load({ enabled: true }).ctx;
  for (const level of ['easy', 'normal', 'hard', 'expert']) {
    const a = off.BaoReleaseConfig.searchOptions(level), b = on.BaoReleaseConfig.searchOptions(level);
    assert.equal(a.pbaiC015LogicGate, undefined);
    assert.equal(b.pbaiC015LogicGate, level === 'hard' ? true : undefined);
    delete b.pbaiC015LogicGate;
    assert.equal(JSON.stringify(a), JSON.stringify(b));
  }
});
test('既知9局面で公開Worker・直接実行・切戻しが凍結参照に一致', () => {
  for (const enabled of [false, true]) for (const f of fixtures) {
    const { ctx, send } = load({ enabled });
    const options = { ...ctx.BaoReleaseConfig.searchOptions('hard'), maxDepth: 2, timeLimitMs: Infinity };
    // 公開Workerは乱数を置換しない。試験側が参照と同じ乱数を与える。
    ctx.random = rng(f.seed); vm.runInContext('Math.random = random', ctx);
    const r = send({ type: 'search', id: 7, state: f.state, level: 'hard', options });
    assert.equal(r.type, 'result'); assert.equal(r.id, 7);
    assert.equal(stable(r), JSON.stringify(f.expected[enabled ? 'logic' : 'baseline']));
    const direct = ctx.BaoReleaseAI.analyzeMove(f.state, 'hard', rng(f.seed), options);
    assert.equal(stable(direct), stable(r));
    if (enabled) {
      assert.equal(r.stats.evaluationCandidate, 'PBAI-C015-v1');
      const d = ctx.BaoDiagnostics.createSnapshot(f.state, { ai: { level: 'hard', stats: r.stats } });
      assert.equal(d.ai.stats.evaluationCandidate, 'PBAI-C015-v1');
      assert.equal(d.ai.stats.evaluationFallback, false);
    }
  }
});
test('モデル読み込み失敗時はWorker・直接実行とも基準に戻る', () => {
  const f = fixtures[0], { ctx, send } = load({ model: false, enabled: true });
  const options = { ...ctx.BaoReleaseConfig.searchOptions('hard'), maxDepth: 2, timeLimitMs: Infinity };
  ctx.random = rng(f.seed); vm.runInContext('Math.random = random', ctx);
  const r = send({ type: 'search', id: 1, state: f.state, level: 'hard', options });
  assert.equal(r.type, 'result'); assert.equal(r.stats.evaluationFallback, true);
  assert.equal(r.stats.evaluationCandidate, 'AI-GEN3-baseline');
  assert.equal(stable(r), JSON.stringify(f.expected.baseline));
  assert.equal(stable(ctx.BaoReleaseAI.analyzeMove(f.state, 'hard', rng(f.seed), options)), stable(r));
});
test('別難易度・profile・独自重みでは誤って有効にならない', () => {
  const { ctx } = load();
  ctx.BaoLogicGate.evaluate = () => { throw Error('対象外で評価器を呼んだ'); };
  for (const [level, extra] of [['easy', {}], ['normal', {}], ['expert', {}], ['hard', { evaluationProfile: 'legacy' }], ['hard', { evaluationProfile: 'bao-v2' }], ['hard', { searchProfile: 'legacy' }], ['hard', { evaluationAdjustments: {} }]]) {
    assert.doesNotThrow(() => ctx.BaoReleaseAI.analyzeMove(fixtures[0].state, level, rng(1), { maxDepth: 1, timeLimitMs: 10, pbaiC015LogicGate: true, ...extra }));
  }
});
