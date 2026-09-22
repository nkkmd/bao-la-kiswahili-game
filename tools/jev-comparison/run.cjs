#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const { config, assert, clone, sha256, atomicJSON, checkSources, makeEngine, fixtures, requestFor, decide } = require("./core.cjs");
const { Ledger, lock, unlockStale, createClient } = require("./budget.cjs");
const { selftest } = require("./selftest.cjs");
const repo = path.resolve(__dirname, "../..");
const output = path.join(__dirname, "results");
const git = (...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const binding = sha256(JSON.stringify({ experimentId: config.experimentId, baselineCommit: config.baselineCommit, model: config.model }));
let paused = false, interrupts = 0;
process.on("SIGINT", () => { paused = true; if (++interrupts > 1) process.exit(130); });
process.on("SIGTERM", () => { paused = true; });
function integrity() {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "kit-manifest.json"), "utf8"));
  for (const [name, expected] of Object.entries(manifest.files)) {
    assert(sha256(fs.readFileSync(path.join(__dirname, name))) === expected, "実験キットのファイルが変更されています: " + name);
  }
  return sha256(JSON.stringify(manifest));
}
function environment() {
  assert(Number(process.versions.node.split(".")[0]) >= 24, "Node.js 24以上で実行してください。");
  const kitHash = integrity();
  const branch = git("branch", "--show-current");
  assert(branch === config.branch, "実験専用ブランチで実行してください: " + config.branch);
  git("merge-base", "--is-ancestor", config.baselineCommit, "HEAD");
  const sourceHashes = checkSources(repo);
  const common = path.resolve(repo, git("rev-parse", "--git-common-dir"));
  const ledgerDir = path.join(common, "jev-comparison", config.experimentId);
  if (!fs.existsSync(path.join(ledgerDir, "budget.jsonl")) && fs.existsSync(path.join(output, "requests"))) {
    assert(fs.readdirSync(path.join(output, "requests")).length === 0, "要求記録がありますが予算台帳が見つかりません。削除せず確認してください。");
  }
  return { kitHash, branch, head: git("rev-parse", "HEAD"), sourceHashes, ledgerDir };
}
function metadata(env) {
  return { schema: "bao-jev-local-v1", createdAt: new Date().toISOString(), experimentId: config.experimentId,
    kitVersion: config.version, kitHash: env.kitHash, baselineCommit: config.baselineCommit, head: env.head,
    branch: env.branch, sources: env.sourceHashes, model: config.model, purpose: config.purpose,
    environment: { platform: process.platform, release: os.release(), architecture: process.arch,
      node: process.version, cpu: os.cpus()[0]?.model, logicalCPUs: os.cpus().length,
      totalMemoryBytes: os.totalmem(), freeMemoryBytes: os.freemem() },
    settings: config, formalStatus: "NOT-STARTED" };
}
function loadJSON(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function readFixtures(engine) {
  const file = path.join(output, "pilot-fixtures.json");
  const generated = fixtures(engine), fixtureHash = sha256(JSON.stringify(generated));
  if (fs.existsSync(file)) assert(loadJSON(file).fixtureHash === fixtureHash, "保存局面と再生成局面が一致しません。");
  else atomicJSON(file, { fixtureHash, seed: config.fixtureSeed, items: generated });
  return generated;
}
function checkPreflight(env) {
  const file = path.join(output, "preflight.json");
  assert(fs.existsSync(file), "先にpreflightを実行してください。");
  const report = loadJSON(file);
  assert(report.kitHash === env.kitHash && report.status === "PASS", "この版でのpreflight通過記録が必要です。");
}
function summary(env, ledger, status) {
  const report = { ...metadata(env), status, budget: ledger.summary(), completedPositions: [], games: [],
    interpretation: "予備試験の記録です。正式な性能差・正式採用を判断する結果ではありません。" };
  const posDir = path.join(output, "positions");
  if (fs.existsSync(posDir)) for (const file of fs.readdirSync(posDir).filter(f => f.endsWith(".json")).sort()) {
    const item = loadJSON(path.join(posDir, file));
    report.completedPositions.push({ id: item.id, phase: item.state.phase, remote: { status: item.remote.status, elapsedMs: item.remote.elapsedMs,
      confidence: item.remote.confidence, recovered: item.remote.recovered }, baseline: item.baseline.stats, candidate: item.candidate.stats });
  }
  const gameDir = path.join(output, "games");
  if (fs.existsSync(gameDir)) for (const file of fs.readdirSync(gameDir).filter(f => f.endsWith(".json")).sort()) {
    const item = loadJSON(path.join(gameDir, file));
    report.games.push({ id: item.id, pair: item.pair, candidatePlayer: item.candidatePlayer, status: item.status,
      winner: item.state.winner, reason: item.state.reason, plies: item.moves.length,
      apiStatus: item.moves.filter(m => m.competitor === "jev").reduce((acc, m) => { acc[m.decision.remote.status] = (acc[m.decision.remote.status] || 0) + 1; return acc; }, {}) });
  }
  atomicJSON(path.join(output, "summary.json"), report);
  console.log(JSON.stringify({ status, completedPositions: report.completedPositions.length, games: report.games, budget: report.budget }, null, 2));
}
async function preflight(env) {
  const tests = await selftest(repo);
  const e = makeEngine(repo, { hooked: true }), items = readFixtures(e);
  const requests = items.map(item => ({ id: item.id, phase: item.state.phase,
    bytes: Buffer.byteLength(JSON.stringify(requestFor(e, item.state).body)) }));
  const dry = [];
  for (const item of [items[0], items[1]]) {
    const move = await decide(e, item.state, { timeMs: 250 });
    e.E.applyMove(item.state, move.move);
    dry.push({ phase: item.state.phase, elapsedMs: move.elapsedMs, depth: move.stats.completedDepth,
      nodes: move.stats.nodes, deadlineOverrunMs: move.deadlineOverrunMs });
  }
  const report = { ...metadata(env), status: "PASS", selftest: tests, requestSizes: requests, drySearch: dry,
    realApiRequestsThisCommand: 0, apiCostThisCommandUSD: 0,
    nextStep: "preflight.jsonを共有してから、接続確認の手順へ進んでください。" };
  atomicJSON(path.join(output, "preflight.json"), report);
  console.log(JSON.stringify({ status: report.status, selftest: tests, drySearch: dry,
    realApiRequestsThisCommand: 0, apiCostThisCommandUSD: 0, report: "tools/jev-comparison/results/preflight.json" }, null, 2));
}
function validateGame(engine, game, opening) {
  assert(game.baselineCommit === config.baselineCommit && game.kitHash === integrity(), "対局記録の実装が一致しません。");
  let state = clone(opening);
  for (const row of game.moves) {
    assert(row.stateHash === sha256(JSON.stringify(state)), "棋譜の局面ハッシュ不一致です。");
    assert(state.winner === null, "終局後の着手が記録されています。");
    state = engine.E.applyMoveForSearch(state, row.decision.move).state;
  }
  assert(JSON.stringify(state) === JSON.stringify(game.state), "棋譜の再生結果が一致しません。");
}
async function pilotPositions(env, ledger, client) {
  const engine = makeEngine(repo, { hooked: true }), items = readFixtures(engine);
  for (const item of items) {
    const file = path.join(output, "positions", item.id + ".json");
    if (fs.existsSync(file)) {
      const old = loadJSON(file);
      assert(old.kitHash === env.kitHash && JSON.stringify(old.state) === JSON.stringify(item.state), "予備局面の保存結果が一致しません。");
      continue;
    }
    if (paused) break;
    const packet = requestFor(engine, item.state);
    const remote = await client.evaluate(packet, { id: item.id, stage: "pilot", timeoutMs: config.smokeTimeoutMs });
    if (remote.fatal) throw new Error(remote.status);
    const options = { maxDepth: 3, timeLimitMs: 5000 };
    const baseline = engine.analyze(item.state, options);
    const candidate = engine.analyze(item.state, { ...options, probabilities: remote.status === "ok" ? remote.probabilities : null });
    atomicJSON(file, { ...metadata(env), id: item.id, state: item.state, remote, baseline, candidate,
      comparison: "固定深度の機構確認です。API待ち時間を含む実用性能の測定とは区別します。" });
    console.log(item.id + ": " + remote.status + ", API " + Math.round(remote.elapsedMs) + " ms");
    if (remote.status !== "ok") { paused = true; break; }
  }
  summary(env, ledger, paused ? "PILOT-PAUSED" : "PILOT-POSITIONS-COMPLETE");
}
async function pilotMatches(env, ledger, client) {
  const engine = makeEngine(repo, { hooked: true });
  const openings = fixtures(engine, config.pilotPairs, config.fixtureSeed + 1000);
  const baseline = makeEngine(repo, { hooked: true }), candidate = makeEngine(repo, { hooked: true });
  // 両側へ同じ小さなウォームアップを行う。APIは呼ばない。
  for (const e of [baseline, candidate]) e.analyze(e.E.initialState(), { maxDepth: 2, timeLimitMs: Infinity });
  for (let pair = 0; pair < config.pilotPairs; pair++) {
    for (let seat = 0; seat < 2; seat++) {
      if (paused) break;
      const candidatePlayer = (pair + seat) % 2;
      const id = "pilot-pair-" + pair + "-game-" + seat;
      const file = path.join(output, "games", id + ".json");
      const opening = openings[pair].state;
      const game = fs.existsSync(file) ? loadJSON(file) : { ...metadata(env), id, pair, candidatePlayer,
        initialState: clone(opening), state: clone(opening), moves: [], status: "RUNNING" };
      assert(game.candidatePlayer === candidatePlayer, "担当側が一致しません。");
      validateGame(engine, game, opening);
      if (["TERMINAL", "UNRESOLVED", "ENGINE-LIMIT"].includes(game.status)) continue;
      let failedStreak = 0;
      while (game.state.winner === null && game.moves.length < config.maxGamePlies && !paused) {
        const stateHash = sha256(JSON.stringify(game.state)), candidateTurn = game.state.player === candidatePlayer;
        const decision = await decide(candidateTurn ? candidate : baseline, game.state, {
          candidate: candidateTurn, client, id: id + "-ply-" + game.moves.length, stage: "pilot" });
        game.moves.push({ ply: game.moves.length, stateHash, competitor: candidateTurn ? "jev" : "baseline", decision });
        game.state = clone(engine.E.applyMoveForSearch(game.state, decision.move).state);
        atomicJSON(file, game);
        if (candidateTurn) {
          failedStreak = ["ok", "forced-move", "not-requested"].includes(decision.remote.status) ? 0 : failedStreak + 1;
          if (failedStreak >= 3) { paused = true; game.pauseReason = "APIの代替処理が3回続いたため確認待ち"; }
        }
        if (game.moves.length % 10 === 0) console.log(id + ": " + game.moves.length + " 手、予算計上 $" + ledger.summary().estimatedAndReservedUSD);
      }
      game.status = game.state.reason === "relay-limit" ? "ENGINE-LIMIT"
        : game.state.winner !== null ? "TERMINAL"
        : game.moves.length >= config.maxGamePlies ? "UNRESOLVED" : "PAUSED";
      atomicJSON(file, game);
      summary(env, ledger, "PILOT-IN-PROGRESS");
    }
    if (paused) break;
  }
  summary(env, ledger, paused ? "PILOT-PAUSED" : "PILOT-MATCHES-COMPLETE");
}
async function main() {
  const command = process.argv[2] || "help", args = process.argv.slice(3);
  if (command === "help") {
    console.log("無課金確認: node tools/jev-comparison/run.cjs preflight\n状況確認: node tools/jev-comparison/run.cjs status\n有料の接続確認: smoke --live\n予備測定: pilot-positions --live / pilot-matches --live\n正式測定は未実装・未開始です。"); return;
  }
  assert(["preflight", "status", "unlock", "smoke", "pilot-positions", "pilot-matches"].includes(command), "不明なコマンドです。");
  assert(args.every(a => a === "--live") && args.length <= 1, "不明なオプションです。");
  const env = environment();
  if (command === "unlock") { unlockStale(env.ledgerDir); console.log("停止済みプロセスのロックを解除しました。費用台帳は保持しています。"); return; }
  if (command === "status") {
    const exists = fs.existsSync(path.join(env.ledgerDir, "budget.jsonl"));
    console.log(JSON.stringify({ experimentId: config.experimentId, lockExists: fs.existsSync(path.join(env.ledgerDir, "run.lock")),
      budget: exists ? new Ledger(env.ledgerDir, binding).summary() : { requests: 0, estimatedAndReservedUSD: 0 }, formalStatus: "NOT-STARTED" }, null, 2)); return;
  }
  const release = lock(env.ledgerDir);
  let ledger;
  try {
    if (command === "preflight") { assert(!args.length, "preflightに--liveは不要です。"); await preflight(env); return; }
    assert(args.includes("--live"), "API接続には--liveが必要です。この実行では送信していません。");
    checkPreflight(env);
    assert(process.env.TYPESAFE_API_KEY, "TYPESAFE_API_KEYを設定してください。");
    ledger = new Ledger(env.ledgerDir, binding);
    const client = createClient(ledger, output, process.env.TYPESAFE_API_KEY);
    if (command === "smoke") {
      const engine = makeEngine(repo, { hooked: true }), state = readFixtures(engine)[0].state;
      const result = await client.evaluate(requestFor(engine, state), { id: "smoke-v1", stage: "smoke", timeoutMs: config.smokeTimeoutMs });
      atomicJSON(path.join(output, "smoke.json"), { ...metadata(env), result, budget: ledger.summary() });
      summary(env, ledger, result.status === "ok" && !result.fatal ? "SMOKE-PASS" : "SMOKE-FAILED");
      if (result.status !== "ok" || result.fatal) process.exitCode = 1;
    } else {
      const smoke = path.join(output, "smoke.json");
      assert(fs.existsSync(smoke) && loadJSON(smoke).result.status === "ok" && !loadJSON(smoke).result.fatal && loadJSON(smoke).kitHash === env.kitHash,
        "この版でsmokeを通過してから予備試験へ進んでください。");
      if (command === "pilot-positions") await pilotPositions(env, ledger, client);
      else {
        assert(fs.existsSync(path.join(output, "positions")) && fs.readdirSync(path.join(output, "positions")).filter(f => f.endsWith(".json")).length === config.pilotPositions,
          "予備局面の確認を完了してから対局へ進んでください。");
        await pilotMatches(env, ledger, client);
      }
    }
  } catch (e) {
    if (ledger) summary(env, ledger, e.message === "BUDGET_STOP" ? "BUDGET-STOP" : "TECHNICAL-STOP");
    throw e;
  } finally { release(); }
}
if (require.main === module) main().catch(e => {
  // fetchの例外はclientで分類済み。Gitの標準エラーや環境変数は表示しない。
  const message = typeof e.message === "string" ? e.message : "実行を停止しました。";
  console.error(message.startsWith("Command failed") ? "Gitの状態確認に失敗しました。" : message);
  process.exitCode = 1;
});
