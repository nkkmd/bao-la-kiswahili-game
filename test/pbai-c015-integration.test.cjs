"use strict";
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const H = require('../tools/takasia/ai-harness.cjs');
const E = require('../public/engine.js');
const Rules = require('../public/rule-versions.js');
const fixtures = require('../tools/engineering/browser/pbai-p9/fixtures.json').rows;
function load({ model = true, enabled = false, expertEnabled = enabled } = {}) {
  const listeners = [], ctx = vm.createContext({ console });
  ctx.self = ctx; ctx.addEventListener = (type, cb) => listeners.push(cb);
  ctx.postMessage = r => { ctx.result = r; };
  const script = name => {
    if (name === './logic-evaluator.js' && !model) throw Error('model unavailable');
    let text = fs.readFileSync(path.join(root, 'public', name), 'utf8');
    if (name.endsWith('ai-release.js')) text = text.replace('const PBAI_C015_ENABLED = true;', `const PBAI_C015_ENABLED = ${enabled};`).replace('const PBAI_C015_EXPERT_ENABLED = true;', `const PBAI_C015_EXPERT_ENABLED = ${expertEnabled};`);
    vm.runInContext(text, ctx, { filename: name });
  };
  ctx.importScripts = (...names) => names.forEach(script);
  script('ai-release-worker.js'); script('rule-versions.js'); script('diagnostics.js');
  return { ctx, send: request => { for (const cb of listeners) cb({ data: request }); return ctx.result; } };
}
const rng = seed => () => { seed += 0x6D2B79F5; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const stable = r => { const { elapsedMs, evaluationCandidate, evaluationFallback, ...stats } = r.stats; return JSON.stringify({ move: r.move, stats }); };
test('公開用の静的モデルはP9で検証したbyteを保持する', () => {
  assert.equal(fs.readFileSync(path.join(root, 'public/logic-evaluator.js'), 'utf8'), fs.readFileSync(path.join(root, 'tools/engineering/browser/pbai-p9/logic-evaluator.js'), 'utf8'));
});
test('候補探索は工程6で固定したtakasia改訂資産と一致する', () => {
  assert.equal(require('../tools/takasia/check-current-assets.cjs').verify().passed, true);
});
test('候補はhard・expertだけ。無効化による切戻し後は元の設定', () => {
  const off = load().ctx, on = load({ enabled: true }).ctx;
  for (const level of ['easy', 'normal', 'hard', 'expert']) {
    const a = off.BaoReleaseConfig.searchOptions(level), b = on.BaoReleaseConfig.searchOptions(level);
    assert.equal(a.pbaiC015LogicGate, undefined);
    assert.equal(b.pbaiC015LogicGate, ['hard', 'expert'].includes(level) ? true : undefined);
    delete b.pbaiC015LogicGate;
    assert.equal(JSON.stringify(a), JSON.stringify(b));
  }
});
test('新ルール12局面で公開Worker・直接実行・切戻しが通常遷移の参照に一致', () => {
  for (const enabled of [false, true]) for (const f of H.cases()) {
    const { ctx, send } = load({ enabled });
    const options = { ...ctx.BaoReleaseConfig.searchOptions('hard'), maxDepth: 2, timeLimitMs: Infinity };
    // 公開Workerは乱数を置換しない。試験側が参照と同じ乱数を与える。
    ctx.random = rng(f.seed ?? 1008); vm.runInContext('Math.random = random', ctx);
    const r = send({ type: 'search', id: 7, state: f.state, level: 'hard', options });
    assert.equal(r.type, 'result'); assert.equal(r.id, 7);
    const reference = H.load({ enabled, detailed: true }).ctx.BaoReleaseAI.analyzeMove(f.state, 'hard', rng(f.seed ?? 1008), { ...options, pbaiC011LightweightTransitions: false });
    assert.equal(stable(r), stable(reference));
    assert.equal(r.ruleRevision, Rules.CURRENT_REVISION);
    assert.equal(r.stats.ruleRevision, Rules.CURRENT_REVISION);
    assert.equal(r.stats.aiRevision, 'AI-GEN4-TAKASIA-001');
    assert.doesNotThrow(() => E.applyMove(f.state, r.move));
    const direct = ctx.BaoReleaseAI.analyzeMove(f.state, 'hard', rng(f.seed ?? 1008), options);
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
  ctx.random = rng(f.seed ?? 1008); vm.runInContext('Math.random = random', ctx);
  const r = send({ type: 'search', id: 1, state: f.state, level: 'hard', options });
  assert.equal(r.type, 'result'); assert.equal(r.stats.evaluationFallback, true);
  assert.equal(r.stats.evaluationCandidate, 'AI-GEN3-baseline');
  const baseline = ctx.BaoAI.analyzeMove(f.state, 'hard', rng(f.seed ?? 1008), options);
  baseline.stats.ruleRevision = Rules.CURRENT_REVISION;
  baseline.stats.aiRevision = 'AI-GEN4-TAKASIA-001';
  assert.equal(stable(r), stable(baseline));
  assert.equal(stable(ctx.BaoReleaseAI.analyzeMove(f.state, 'hard', rng(f.seed ?? 1008), options)), stable(r));
});
test('別難易度・profile・独自重みでは誤って有効にならない', () => {
  const { ctx } = load();
  ctx.BaoLogicGate.evaluate = () => { throw Error('対象外で評価器を呼んだ'); };
  for (const [level, extra] of [['easy', {}], ['normal', {}], ['expert', { evaluationProfile: 'legacy' }], ['hard', { evaluationProfile: 'legacy' }], ['hard', { evaluationProfile: 'bao-v2' }], ['hard', { searchProfile: 'legacy' }], ['hard', { evaluationAdjustments: {} }]]) {
    assert.doesNotThrow(() => ctx.BaoReleaseAI.analyzeMove(fixtures[0].state, level, rng(1), { maxDepth: 1, timeLimitMs: 10, pbaiC015LogicGate: true, ...extra }));
  }
});

test('正式設定と難易度別表示、復帰時の表示を確認', () => {
  assert.match(fs.readFileSync(path.join(root, 'public/ai-release.js'), 'utf8'), /const PBAI_C015_ENABLED = true;/);
  const { ctx } = load({ enabled: true });
  assert.equal(ctx.BaoReleaseConfig.GENERATION, 'AI-GEN4');
  assert.equal(ctx.BaoReleaseConfig.RELEASE_ID, 'AI-GEN4-RELEASE-001');
  for (const level of ['easy', 'normal', 'hard', 'expert']) {
    assert.equal(ctx.BaoReleaseConfig.displayIdentity(level).releaseId, 'AI-GEN4-RELEASE-001');
  }
  assert.equal(ctx.BaoReleaseConfig.displayIdentity('hard').labelJa, 'AI-GEN4');
  assert.equal(ctx.BaoReleaseConfig.displayIdentity('expert').adoptionId, 'PBAI-C015-EXPERT-ADOPTION-001');
  assert.equal(ctx.BaoReleaseConfig.displayIdentity('hard', { evaluationFallback: true }).label, 'AI-GEN3');
});

test('expertだけの切戻しでhardを維持する', () => {
  const { ctx } = load({ enabled: true, expertEnabled: false });
  assert.equal(ctx.BaoReleaseConfig.searchOptions('expert').pbaiC015LogicGate, undefined);
  assert.equal(ctx.BaoReleaseConfig.searchOptions('hard').pbaiC015LogicGate, true);
  assert.equal(ctx.BaoReleaseConfig.displayIdentity('expert').releaseId, 'AI-GEN3-RELEASE-001');
  assert.equal(ctx.BaoReleaseConfig.displayIdentity('hard').adoptionId, 'PBAI-C015-HARD-ADOPTION-001');
});
