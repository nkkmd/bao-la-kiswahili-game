"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), vm = require("node:vm");
const H = require("../tools/takasia/ai-harness.cjs");
const F = require("../tools/takasia/fixtures.json");
const E = require("../public/engine.js"), AI = require("../public/ai.js");
const copy = x => JSON.parse(JSON.stringify(x));

test("局面キーは対象なし・両手番の全8穴を区別し、旧入力なしとnullを同一視する", () => {
  const { ctx } = H.load(); const s = copy(F.e30.post), keys = new Set(); s.takasia = null;
  keys.add(AI.stateKey(s));
  const absent = copy(s); delete absent.takasia;
  assert.equal(AI.stateKey(absent), AI.stateKey(s));
  for (const player of [0, 1]) for (let index = 0; index < 8; index++) {
    s.takasia = { player, index }; const k = AI.stateKey(s); keys.add(k);
    assert.equal(ctx.BaoCandidateAI.stateKey(s), k);
    assert.equal(ctx.BaoReleaseAI.stateKey(s), k);
  }
  assert.equal(keys.size, 17);
  assert.ok(AI.stateKey(s).includes(AI.RULE_REVISION));
});

for (const f of H.cases()) test(`全難易度の合法性とWorker・直接・軽量・切戻し: ${f.name}`, () => {
  for (const enabled of [true, false]) for (const level of ["easy", "normal", "hard", "expert"]) {
    const { ctx, send } = H.load({ enabled });
    const s = copy(f.state), original = copy(s);
    const options = { ...ctx.BaoReleaseConfig.searchOptions(level), maxDepth: 2, timeLimitMs: Infinity };
    ctx.random = H.rng(1008); vm.runInContext("Math.random = random", ctx);
    const request = { type: "search", id: 7, state: s, level, options,
      positionKey: ctx.BaoReleaseAI.stateKey(s), ruleRevision: ctx.BaoReleaseConfig.RULE_REVISION };
    const result = send(request);
    assert.equal(result.type, "result", result.message);
    assert.equal(result.id, 7); assert.equal(result.ruleRevision, AI.RULE_REVISION);
    assert.equal(result.positionKey, request.positionKey);
    assert.equal(result.stats.ruleRevision, AI.RULE_REVISION);
    assert.equal(H.stable(result), H.stable(ctx.BaoReleaseAI.analyzeMove(s, level, H.rng(1008), options)));
    const detailed = ctx.BaoReleaseAI.analyzeMove(s, level, H.rng(1008), { ...options, pbaiC011LightweightTransitions: false });
    assert.equal(H.stable(result), H.stable(detailed));
    assert.doesNotThrow(() => E.applyMove(s, result.move));
    assert.deepEqual(s, original);
  }
});

test("キャッシュを使う探索と独立した深さ3の全幅minimaxが12局面で一致する", () => {
  const { ctx } = H.load();
  for (const f of H.cases()) for (const enabled of [true, false]) {
    const s = f.state, player = s.player;
    const evaluate = enabled ? ctx.BaoLogicGate.evaluate : ctx.BaoAI.evaluate;
    function full(state, depth) {
      if (state.winner !== null) return state.winner === player ? 1000000 - (3 - depth) : -1000000 + (3 - depth);
      if (!depth) return evaluate(state, player);
      const scores = E.moveVariants(state).map(m => full(E.applyMove(state, m).state, depth - 1));
      return state.player === player ? Math.max(...scores) : Math.min(...scores);
    }
    const expected = full(s, 3);
    for (const evaluationCache of [true, false]) {
      const result = ctx.BaoReleaseAI.analyzeMove(s, "hard", H.rng(1008), {
        maxDepth: 3, timeLimitMs: Infinity, quiescenceDepth: 0, evaluationCache,
        pbaiC015LogicGate: enabled, pbaiC011LightweightTransitions: true,
      });
      assert.equal(result.stats.rootScore, expected);
      assert.equal(full(E.applyMove(s, result.move).state, 2), expected);
    }
  }
});

test("モデル・候補取得失敗でも新ルールを使い、合法な基準AIへ切り戻す", () => {
  for (const missing of ["logic-evaluator.js", "ai-candidate.js"]) for (const level of ["hard", "expert"]) {
    const { ctx, send } = H.load({ missing }), state = F.e30.post;
    const options = { ...ctx.BaoReleaseConfig.searchOptions(level), maxDepth: 2, timeLimitMs: Infinity };
    const result = send({ type: "search", id: 1, state, level, options });
    assert.equal(result.type, "result"); assert.equal(result.stats.evaluationFallback, true);
    assert.equal(result.stats.ruleRevision, AI.RULE_REVISION);
    assert.doesNotThrow(() => E.applyMove(state, result.move));
    const baseline = ctx.BaoAI.analyzeMove(state, level, H.rng(1008), options);
    const { ruleRevision, aiRevision, evaluationCandidate, evaluationFallback, ...stats } = result.stats;
    const { elapsedMs, ...a } = stats, { elapsedMs: ignored, ...b } = baseline.stats;
    assert.deepEqual(copy(result.move), copy(baseline.move)); assert.deepEqual(copy(a), copy(b));
  }
});

test("Workerは旧改訂・誤った局面キー・旧エンジンとの混在を拒否する", () => {
  const { ctx, send } = H.load();
  const req = { type: "search", id: 8, state: F.e30.post, level: "easy" };
  for (const extra of [{ ruleRevision: "old" }, { positionKey: "old" }]) {
    const r = send({ ...req, ...extra }); assert.equal(r.type, "error"); assert.equal(r.id, 8);
  }
  delete ctx.BaoEngine.detectTakasia;
  assert.equal(send(req).type, "error");
});

test("メイン画面は古いWorker応答を直接実行へ戻し、変化した局面は破棄する", () => {
  const source = fs.readFileSync(require.resolve("../public/main.js"), "utf8");
  const accept = source.slice(source.indexOf("function acceptAIMove("), source.indexOf("function runAIFallback("));
  const state = copy(F.e30.post), key = AI.stateKey(state);
  const req = { id: 5, state, positionKey: key, ruleRevision: AI.RULE_REVISION, level: "hard", options: {} };
  const ctx = vm.createContext({ state, AI, E, aiGeneration: 5, aiThinking: true, started: true,
    humanPlayer: 0, isComputerGame: () => true, setAIThinking: x => { ctx.aiThinking = x; },
    helpNode: {}, t: x => x, runAIFallback: () => { ctx.fallbacks++; }, fallbacks: 0,
    Diagnostics: { createSnapshot: () => ({}) }, gameModeSelect: { value: "computer" },
    updateAIGenerationBadge: () => {}, playMove: () => { ctx.played++; }, played: 0, announce: () => {} });
  vm.runInContext(accept, ctx);
  const valid = { positionKey: key, ruleRevision: AI.RULE_REVISION, move: E.legalMoves(state)[0], stats: {} };
  for (const extra of [{ ruleRevision: undefined }, { ruleRevision: "old" }, { positionKey: "old" }]) {
    ctx.acceptAIMove(req, { ...valid, ...extra }); assert.equal(ctx.played, 0);
  }
  assert.equal(ctx.fallbacks, 3);
  ctx.state = { ...state, takasia: null }; ctx.acceptAIMove(req, valid);
  assert.equal(ctx.fallbacks, 3); assert.equal(ctx.played, 0);
  ctx.state = state; ctx.aiThinking = true; ctx.acceptAIMove(req, valid);
  assert.equal(ctx.played, 1);
});

test("既知9局面の旧ルール結果とモデルのbyteを変更せず再検証する", () => {
  const ctx = vm.createContext({ performance });
  for (const name of ["engine.js", "baseline-ai.js", "logic-evaluator.js", "candidate-ai.js"]) {
    if (name === "baseline-ai.js") vm.runInContext(fs.readFileSync(require.resolve("../public/ai-weights.js"), "utf8"), ctx);
    let s = fs.readFileSync(require.resolve(`../tools/engineering/browser/pbai-p9/${name}`), "utf8");
    if (name === "candidate-ai.js") s = s.replace("root.BaoAI = api;", "root.BaoCandidateAI = api;");
    vm.runInContext(s, ctx);
  }
  vm.runInContext(fs.readFileSync(require.resolve("../public/ai-config.js"), "utf8"), ctx);
  for (const f of require("../tools/engineering/browser/pbai-p9/fixtures.json").rows) for (const enabled of [true, false]) {
    const options = { ...ctx.BaoAIConfig.searchOptions("hard"), maxDepth: 2, timeLimitMs: Infinity, pbaiC015LogicGate: enabled };
    const result = (enabled ? ctx.BaoCandidateAI : ctx.BaoAI).analyzeMove(f.state, "hard", H.rng(f.seed), options);
    const { elapsedMs, ...stats } = result.stats;
    assert.equal(JSON.stringify({ move: result.move, stats }), JSON.stringify(f.expected[enabled ? "logic" : "baseline"]));
  }
  assert.equal(fs.readFileSync(require.resolve("../public/logic-evaluator.js"), "utf8"),
    fs.readFileSync(require.resolve("../tools/engineering/browser/pbai-p9/logic-evaluator.js"), "utf8"));
});

test("古い候補AIは新ルールの基準へ戻し、古い基準AIとの混在は拒否する", () => {
  const { ctx } = H.load(); delete ctx.BaoCandidateAI.RULE_REVISION;
  const r = ctx.BaoReleaseAI.analyzeMove(F.e30.post, "hard", H.rng(1008), {
    pbaiC015LogicGate: true, maxDepth: 1, timeLimitMs: Infinity });
  assert.equal(r.stats.evaluationFallback, true); assert.doesNotThrow(() => E.applyMove(F.e30.post, r.move));
  delete ctx.BaoAI.RULE_REVISION;
  assert.throws(() => ctx.BaoReleaseAI.analyzeMove(F.e30.post, "easy"), /AI rule revision mismatch/);
});

test("旧AI-GEN3 manifestの5資産を固定した履歴から厳格に照合する", () => {
  const crypto = require("node:crypto");
  const manifest = require("../doc/ai-engineering/public-ai-improvement-program-5/releases/AI-GEN3-RELEASE-001.json");
  const assets = {
    "public/engine.js": "tools/engineering/browser/pbai-p9/engine.js",
    "public/ai.js": "tools/engineering/browser/pbai-p9/baseline-ai.js",
    "public/ai-weights.js": "public/ai-weights.js", "public/ai-config.js": "public/ai-config.js",
    "public/ai-worker.js": "tools/takasia/history/ai-worker.js",
  };
  for (const [name, file] of Object.entries(assets)) assert.equal(
    crypto.createHash("sha256").update(fs.readFileSync(require.resolve("../" + file))).digest("hex"),
    manifest.promotionDisclosureAssets[name], name);
});

test("直接実行でも新AIと旧エンジンの混在を拒否する", () => {
  const { ctx } = H.load(); delete ctx.BaoEngine.detectTakasia;
  for (const level of ["easy", "normal", "hard", "expert"]) assert.throws(() =>
    ctx.BaoReleaseAI.analyzeMove(F.e30.post, level, H.rng(1008), {
      ...ctx.BaoReleaseConfig.searchOptions(level), maxDepth: 1, timeLimitMs: Infinity }), /Takasia engine is unavailable/);
});
