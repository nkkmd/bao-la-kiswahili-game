"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { performance } = require("node:perf_hooks");
const config = require("./config.json");
const sourceManifest = require("./source-manifest.json");
const clone = value => JSON.parse(JSON.stringify(value));
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
function assert(ok, message) { if (!ok) throw new Error(message); }
function atomicJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp-" + process.pid;
  const fd = fs.openSync(tmp, "w", 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + "\n"); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  fs.renameSync(tmp, file);
  const dir = fs.openSync(path.dirname(file), "r");
  try { fs.fsyncSync(dir); } finally { fs.closeSync(dir); }
}
function replaceOnce(source, oldText, replacement) {
  assert(source.split(oldText).length === 2, "探索コードの挿入位置が一致しません。停止しました。");
  return source.replace(oldText, replacement);
}
function checkSources(repo) {
  for (const [file, expected] of Object.entries(sourceManifest)) {
    assert(sha256(fs.readFileSync(path.join(repo, file))) === expected, "基準ファイルの不一致: " + file);
  }
  return sourceManifest;
}
function makeEngine(repo, { hooked = false } = {}) {
  checkSources(repo);
  const context = vm.createContext({ performance });
  const files = ["engine.js", "ai-weights.js", "ai.js", "ai-config.js", "logic-evaluator.js", "ai-candidate.js", "ai-release.js"];
  for (const file of files) {
    let source = fs.readFileSync(path.join(repo, "public", file), "utf8");
    if (hooked && (file === "ai.js" || file === "ai-candidate.js")) {
      source = replaceOnce(source, "const deadline = performanceNow() + timeLimitMs;",
        "const deadline = Number.isFinite(root.__jevDeadline) ? root.__jevDeadline : performanceNow() + timeLimitMs;");
    }
    if (hooked && file === "ai-candidate.js") {
      const anchor = "    if (!choices.length) return state.player === player ? -WIN + ply : WIN - ply;";
      source = replaceOnce(source, anchor,
        "    if (ply === 0 && root.__jevProbabilities) {\n" +
        "      choices.sort((a, b) => b.immediateWin - a.immediateWin\n" +
        "        || (root.__jevProbabilities[moveKey(b.move)] ?? 0) - (root.__jevProbabilities[moveKey(a.move)] ?? 0));\n" +
        "    }\n" + anchor);
    }
    vm.runInContext(source, context, { filename: "public/" + file });
  }
  const E = context.BaoEngine, AI = context.BaoReleaseAI, C = context.BaoReleaseConfig;
  assert(C.GENERATION === "AI-GEN4" && C.RELEASE_ID === "AI-GEN4-RELEASE-001", "AI世代が一致しません。");
  assert(C.displayIdentity("expert").evaluator === "PBAI-C015-v1", "評価器が一致しません。");
  return {
    E, AI, C,
    analyze(state, { deadline = null, probabilities = null, maxDepth = config.maxDepth, timeLimitMs = config.timeLimitMs } = {}) {
      context.__jevDeadline = deadline;
      context.__jevProbabilities = probabilities;
      try {
        const options = { ...C.searchOptions("expert", { hardwareConcurrency: 4, deviceMemory: 4 }, state), maxDepth, timeLimitMs };
        const result = AI.analyzeMove(clone(state), "expert", () => 0.5, options);
        assert(result.stats.evaluationCandidate === "PBAI-C015-v1" && result.stats.evaluationFallback === false,
          "論理ゲート型評価器の実行を確認できません。");
        return clone(result);
      } finally { context.__jevDeadline = null; context.__jevProbabilities = null; }
    },
  };
}
function random(seed) {
  let s = seed >>> 0;
  return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function fixtures(engine, count = config.pilotPositions, seed = config.fixtureSeed) {
  const rng = random(seed), items = [], seen = new Set();
  // 各標本は別の新規対局から生成する。未使用の正式標本はこのキットでは作らない。
  for (let attempt = 0; items.length < count && attempt < count * 200; attempt++) {
    const index = items.length, targetPhase = index % 2 === 0 ? "namua" : "mtaji";
    let state = engine.E.initialState();
    const target = targetPhase === "namua" ? 4 + (index * 7 % 28) : 44 + (index * 11 % 48);
    for (let ply = 0; ply < target && state.winner === null; ply++) {
      const moves = engine.E.moveVariantsForSearch(state);
      if (!moves.length) break;
      // 一様方策と捕獲数重視方策を対局単位で交互に用いる。
      let selected;
      if (attempt % 2) {
        const ranked = moves.map(move => ({ move, captures: engine.E.applyMoveForSearch(state, move).events
          .filter(e => e.kind === "capture").reduce((n, e) => n + e.count, 0) }));
        const best = Math.max(...ranked.map(x => x.captures));
        const pool = ranked.filter(x => x.captures === best);
        selected = pool[Math.floor(rng() * pool.length)].move;
      } else selected = moves[Math.floor(rng() * moves.length)];
      state = engine.E.applyMoveForSearch(state, selected).state;
    }
    const key = sha256(JSON.stringify(state));
    if (state.winner !== null || state.phase !== targetPhase || seen.has(key)) continue;
    if (engine.E.moveVariantsForSearch(state).length < 2) continue;
    seen.add(key); items.push({ id: "pilot-position-" + index, sourceAttempt: attempt, policy: attempt % 2 ? "capture" : "uniform", state: clone(state) });
  }
  assert(items.length === count, "予備局面の生成数が不足しています。");
  return items;
}
const rules = {
  game: "Bao la Kiswahili, repository rules R-002; takasia is not implemented.",
  objective: "Win by emptying the opponent's front row or leaving the opponent without a legal move. Seed total alone is not the objective.",
  coordinates: "pits[player][row][index]. Players are 0 and 1; row 0 is front, row 1 is back; indices 0..7. Opposing front pit has index 7-index. nyumba is front index 4. Follow these coordinates, not a visual board assumption.",
  phases: "namua uses reserve seeds; mtaji starts when both reserves are empty. Capture is compulsory when available. Relay sowing and house choices are already resolved in each supplied after-state.",
  authority: "Every listed move is an exact legal variant generated by the engine. Do not invent moves or recompute sowing. A terminal winner is authoritative. The engine's relay safety limit also applies.",
};
function requestFor(engine, state) {
  const moves = engine.E.moveVariantsForSearch(state);
  assert(moves.length >= 2 && moves.length <= 255, "Jevへ送る候補数が範囲外です。");
  const criteria = {}, keyById = {}, candidates = {};
  moves.forEach((move, i) => {
    const id = "m" + String(i).padStart(3, "0");
    const result = engine.E.applyMoveForSearch(state, move);
    keyById[id] = engine.AI.moveKey(move);
    candidates[id] = { move: clone(move), after: clone(result.state), capturedSeeds: result.events
      .filter(e => e.kind === "capture").reduce((n, e) => n + e.count, 0) };
    criteria[id] = "Candidate " + id + " in state.candidates; evaluate for rootPlayer=" + state.player + ".";
  });
  const body = { model: config.model, state: { rules, rootPlayer: state.player, current: clone(state), candidates },
    questions: { priority: { type: "choice", instructions: "Which legal candidate is most promising to investigate first for rootPlayer? Use the supplied exact after-states to judge positional promise against a resisting opponent. This is a search-order hint, not a proven win probability. Prefer an already won position. Do not assume the player to move in an after-state is rootPlayer.", criteria } } };
  assert(Buffer.byteLength(JSON.stringify(body), "utf8") <= 28000, "局面入力が大きいため、この着手ではJevを使いません。");
  return { body, keyById };
}
function validateResponse(data, packet) {
  assert(data && data.model === config.model, "MODEL_MISMATCH");
  const a = data.answers?.priority, ids = Object.keys(packet.keyById);
  assert(a?.type === "choice" && ids.includes(a.choice), "RESPONSE_INVALID");
  assert(Number.isFinite(a.confidence) && a.confidence >= 0 && a.confidence <= 1, "RESPONSE_INVALID");
  assert(a.probabilities && Object.keys(a.probabilities).length === ids.length, "RESPONSE_INVALID");
  let total = 0; const probabilities = {};
  for (const id of ids) {
    const p = a.probabilities[id];
    assert(Number.isFinite(p) && p >= 0 && p <= 1, "RESPONSE_INVALID");
    probabilities[packet.keyById[id]] = p; total += p;
  }
  assert(Math.abs(total - 1) < 0.002, "RESPONSE_INVALID");
  assert(a.probabilities[a.choice] + 0.002 >= Math.max(...Object.values(a.probabilities)), "RESPONSE_INVALID");
  return { probabilities, confidence: a.confidence, choice: packet.keyById[a.choice],
    response: { model: data.model, answers: { priority: { type: "choice", choice: a.choice, confidence: a.confidence,
      probabilities: Object.fromEntries(ids.map(id => [id, a.probabilities[id]])) } }, usage: {} } };
}
async function decide(engine, state, { candidate = false, client = null, id = "", stage = "pilot", timeMs = config.timeLimitMs } = {}) {
  const started = performance.now();
  const legal = engine.E.moveVariantsForSearch(state);
  assert(legal.length, "終局を着手関数へ渡しています。");
  // 期限超過時にも合法な既定手を返せるよう両側で同じ処理を行う。
  const fallback = clone(legal[0]);
  let remote = { status: "not-requested", elapsedMs: 0 }, probabilities = null, recoveryDebit = 0;
  if (candidate && legal.length > 1) {
    let packet;
    try { packet = requestFor(engine, state); } catch { remote = { status: "input-skipped", elapsedMs: 0 }; }
    const remaining = timeMs - (performance.now() - started);
    if (packet && remaining > 50) {
      remote = await client.evaluate(packet, { id, stage, timeoutMs: Math.min(config.apiTimeoutMs, Math.floor(remaining - 25)) });
      if (remote.recovered) recoveryDebit = remote.elapsedMs;
      if (remote.status === "ok") probabilities = remote.probabilities;
      if (remote.fatal) throw new Error(remote.status);
    } else if (packet) remote = { status: "preparation-deadline", elapsedMs: 0 };
  } else if (legal.length === 1) remote.status = "forced-move";
  const deadline = started + timeMs - recoveryDebit;
  let result = { move: fallback, stats: { completedDepth: 0, nodes: 0, quiescenceNodes: 0, cutoffs: 0, rootScore: null, fallback: "outer-deadline" } };
  if (performance.now() < deadline) result = engine.analyze(state, { deadline, probabilities, timeLimitMs: Math.max(0, deadline - performance.now()) });
  assert(legal.some(move => engine.AI.moveKey(move) === engine.AI.moveKey(result.move)), "探索が不正な手を返しました。");
  const elapsedMs = performance.now() - started;
  return { ...result, remote, elapsedMs, effectiveElapsedMs: elapsedMs + recoveryDebit,
    deadlineOverrunMs: Math.max(0, elapsedMs + recoveryDebit - timeMs), recoveryDebitMs: recoveryDebit };
}
module.exports = { config, clone, sha256, assert, atomicJSON, makeEngine, fixtures, random, requestFor, validateResponse, decide, checkSources };
