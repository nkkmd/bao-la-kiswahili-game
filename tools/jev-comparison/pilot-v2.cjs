#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { performance } = require("node:perf_hooks");
const C = require("./core.cjs");
const B = require("./budget.cjs");
const L = require("./latency-diagnostic.cjs");
const ID = "pilot-matches-v2";
const DIAGNOSTIC_HASH = "bec33a37a6edfc939f0aeb37c3493db219f3a10f343508ca7423ddb47650ec33";
const LATENCY_ADDON_HASH = "2533d645b27ed11baf684f821aec04d3f492220b07a2ca2dd9390fb9b0ca90dd";
const SETTINGS = Object.freeze({ ...C.clone(C.config), apiTimeoutMs: 1500 });
const hash = value => C.sha256(JSON.stringify(value));
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const complete = status => ["TERMINAL", "UNRESOLVED", "ENGINE-LIMIT"].includes(status);

function inspect() {
  const env = L.inspect();
  C.assert(env.addonHash === LATENCY_ADDON_HASH, "確認済みの遅延診断プログラムと一致しません。");
  const manifest = read(path.join(__dirname, "pilot-v2-manifest.json"));
  C.assert(manifest.id === ID, "予備対局の識別子が一致しません。");
  for (const name of ["pilot-v2.cjs", "PILOT_V2.md"]) C.assert(typeof manifest.files[name] === "string", "追加ファイルが不完全です。");
  for (const [file, expected] of Object.entries(manifest.files)) {
    C.assert(path.basename(file) === file && C.sha256(fs.readFileSync(path.join(__dirname, file))) === expected,
      "予備対局の固定ファイルが変更されています: " + path.basename(file));
  }
  const diagnostic = read(env.reportFile);
  C.assert(hash(diagnostic) === DIAGNOSTIC_HASH && diagnostic.status === "DIAGNOSTIC-COMPLETE"
    && diagnostic.rows.length === 8 && diagnostic.rows.every(r => r.remote.status === "ok"),
    "確認済みの遅延診断結果と一致しません。");
  return { ...env, addonHash: hash(manifest), root: path.join(env.output, "pilot-v2") };
}

function planFor(engine, addonHash) {
  const openings = C.fixtures(engine, SETTINGS.pilotPairs, SETTINGS.fixtureSeed + 1000);
  const plan = { schema: "bao-jev-pilot-v2-plan", id: ID, experimentId: SETTINGS.experimentId,
    addonHash, originalKitHash: "de638ab06d987e483e992f6d17ba867f13d9273ea184f73415571e3b7cf6fbda",
    diagnosticHash: DIAGNOSTIC_HASH, settings: SETTINGS, openingsHash: hash(openings),
    games: openings.flatMap((opening, pair) => [0, 1].map(seat => ({
      id: "pilot-v2-pair-" + pair + "-game-" + seat, pair, seat,
      candidatePlayer: (pair + seat) % 2, initialState: C.clone(opening.state),
    }))) };
  return { ...plan, planHash: hash(plan) };
}

function freezePlan(env, plan) {
  const file = path.join(env.root, "plan.json");
  if (fs.existsSync(file)) C.assert(hash(read(file)) === hash(plan), "保存済みの対局条件と一致しません。");
  else C.atomicJSON(file, plan);
}

// 元のcore.cjsの外側の時間計測と同じ処理。API待ち上限だけを別条件で指定する。
async function decide(engine, state, { candidate = false, client = null, id = "", timeMs = SETTINGS.timeLimitMs } = {}) {
  const started = performance.now(), legal = engine.E.moveVariantsForSearch(state);
  C.assert(legal.length, "終局を着手関数へ渡しています。");
  const fallback = C.clone(legal[0]);
  let remote = { status: "not-requested", elapsedMs: 0 }, probabilities = null, recoveryDebit = 0;
  if (candidate && legal.length > 1) {
    let packet;
    try { packet = C.requestFor(engine, state); } catch { remote = { status: "input-skipped", elapsedMs: 0 }; }
    const remaining = timeMs - (performance.now() - started);
    if (packet && remaining > 50) {
      remote = await client.evaluate(packet, { id, stage: "pilot", timeoutMs: Math.min(SETTINGS.apiTimeoutMs, Math.floor(remaining - 25)) });
      if (remote.recovered) recoveryDebit = remote.elapsedMs;
      if (remote.status === "ok") probabilities = remote.probabilities;
      if (remote.fatal) throw new Error(remote.status);
    } else if (packet) remote = { status: "preparation-deadline", elapsedMs: 0 };
  } else if (legal.length === 1) remote.status = "forced-move";
  const deadline = started + timeMs - recoveryDebit;
  let result = { move: fallback, stats: { completedDepth: 0, nodes: 0, quiescenceNodes: 0, cutoffs: 0, rootScore: null, fallback: "outer-deadline" } };
  if (performance.now() < deadline) result = engine.analyze(state, { deadline, probabilities, timeLimitMs: Math.max(0, deadline - performance.now()) });
  C.assert(legal.some(m => engine.AI.moveKey(m) === engine.AI.moveKey(result.move)), "探索が不正な手を返しました。");
  const elapsedMs = performance.now() - started;
  return { ...result, remote, elapsedMs, effectiveElapsedMs: elapsedMs + recoveryDebit,
    deadlineOverrunMs: Math.max(0, elapsedMs + recoveryDebit - timeMs), recoveryDebitMs: recoveryDebit };
}

function validateGame(engine, game, item, plan) {
  C.assert(game.planHash === plan.planHash && game.id === item.id && game.candidatePlayer === item.candidatePlayer
    && game.pair === item.pair && game.seat === item.seat && hash(game.initialState) === hash(item.initialState),
    "棋譜の条件が一致しません。");
  let state = C.clone(item.initialState);
  C.assert(game.moves.length <= SETTINGS.maxGamePlies, "棋譜が着手上限を超えています。");
  for (let i = 0; i < game.moves.length; i++) {
    const row = game.moves[i];
    C.assert(row.ply === i && row.stateHash === hash(state) && state.winner === null, "棋譜の局面を再現できません。");
    C.assert(row.competitor === (state.player === item.candidatePlayer ? "jev" : "baseline"), "担当側が一致しません。");
    const legal = engine.E.moveVariantsForSearch(state);
    C.assert(legal.some(m => engine.AI.moveKey(m) === engine.AI.moveKey(row.decision.move)), "棋譜の着手が合法ではありません。");
    state = C.clone(engine.E.applyMoveForSearch(state, row.decision.move).state);
  }
  C.assert(hash(state) === hash(game.state), "棋譜の再生結果が一致しません。");
  if (complete(game.status)) C.assert(game.status === finalStatus(game), "保存された終局区分が一致しません。");
}

function finalStatus(game) {
  return game.state.reason === "relay-limit" ? "ENGINE-LIMIT" : game.state.winner !== null ? "TERMINAL"
    : game.moves.length >= SETTINGS.maxGamePlies ? "UNRESOLVED" : "PAUSED";
}

function failureStreak(game) {
  let streak = 0;
  for (const row of game.moves) if (row.competitor === "jev") {
    streak = ["ok", "forced-move", "not-requested"].includes(row.decision.remote.status) ? 0 : streak + 1;
  }
  return streak;
}

function saveSummary(env, plan, ledger, status, log) {
  const games = [];
  for (const item of plan.games) {
    const file = path.join(env.root, "games", item.id + ".json");
    if (!fs.existsSync(file)) continue;
    const g = read(file), apiStatus = {};
    for (const m of g.moves) if (m.competitor === "jev") apiStatus[m.decision.remote.status] = (apiStatus[m.decision.remote.status] || 0) + 1;
    games.push({ id: g.id, pair: g.pair, seat: g.seat, candidatePlayer: g.candidatePlayer,
      status: g.status, plies: g.moves.length, winner: g.state.winner, reason: g.state.reason,
      pauseReason: g.pauseReason || null, apiStatus });
  }
  const report = { schema: "bao-jev-pilot-v2-summary", createdAt: new Date().toISOString(), id: ID,
    experimentId: SETTINGS.experimentId, planHash: plan.planHash, addonHash: env.addonHash,
    purpose: SETTINGS.purpose, formalStatus: "NOT-STARTED", settings: SETTINGS, status,
    budget: ledger.summary(), games,
    interpretation: "API待ち上限1,500msの予備対局です。旧条件の5手や正式測定の結果とは合算しません。" };
  C.atomicJSON(path.join(env.root, "summary.json"), report);
  log(JSON.stringify({ status, games, budget: report.budget }, null, 2));
  return report;
}

async function runMatches(env, plan, ledger, client, { shouldPause = () => false, choose = decide,
  engineFactory = () => C.makeEngine(env.repo, { hooked: true }), log = console.log } = {}) {
  const engine = engineFactory(), baseline = engineFactory(), candidate = engineFactory();
  for (const e of [baseline, candidate]) e.analyze(e.E.initialState(), { maxDepth: 2, timeLimitMs: Infinity });
  let active = null, activeFile = null;
  try {
    for (const item of plan.games) {
      const file = path.join(env.root, "games", item.id + ".json");
      const game = fs.existsSync(file) ? read(file) : { schema: "bao-jev-pilot-v2-game", ...C.clone(item),
        createdAt: new Date().toISOString(), planHash: plan.planHash, addonHash: env.addonHash,
        baselineCommit: SETTINGS.baselineCommit, head: env.head, model: SETTINGS.model, settings: SETTINGS,
        environment: { node: process.version, platform: process.platform, release: os.release(), cpu: os.cpus()[0]?.model },
        purpose: SETTINGS.purpose, formalStatus: "NOT-STARTED", state: C.clone(item.initialState), moves: [], status: "RUNNING" };
      validateGame(engine, game, item, plan);
      if (game.pauseReason === "API-FALLBACK-STREAK") return saveSummary(env, plan, ledger, "PILOT-V2-PAUSED", log);
      if (complete(game.status)) continue;
      if (shouldPause()) return saveSummary(env, plan, ledger, "PILOT-V2-PAUSED", log);
      active = game; activeFile = file;
      C.atomicJSON(file, game);
      let streak = failureStreak(game);
      if (streak >= 3) { game.pauseReason = "API-FALLBACK-STREAK"; game.status = "PAUSED"; C.atomicJSON(file, game); return saveSummary(env, plan, ledger, "PILOT-V2-PAUSED", log); }
      while (game.state.winner === null && game.moves.length < SETTINGS.maxGamePlies && !shouldPause()) {
        const candidateTurn = game.state.player === game.candidatePlayer;
        const decision = await choose(candidateTurn ? candidate : baseline, game.state, {
          candidate: candidateTurn, client, id: item.id + "-ply-" + game.moves.length });
        const next = C.clone(engine.E.applyMoveForSearch(game.state, decision.move).state);
        game.moves.push({ ply: game.moves.length, stateHash: hash(game.state), competitor: candidateTurn ? "jev" : "baseline", decision });
        game.state = next;
        if (candidateTurn) streak = ["ok", "forced-move", "not-requested"].includes(decision.remote.status) ? 0 : streak + 1;
        const ended = finalStatus(game);
        game.status = complete(ended) ? ended : "RUNNING";
        if (streak >= 3) { game.pauseReason = "API-FALLBACK-STREAK"; if (!complete(ended)) game.status = "PAUSED"; }
        C.atomicJSON(file, game);
        if (game.moves.length % 10 === 0) log(item.id + ": " + game.moves.length + " 手、累計計上 $" + ledger.summary().estimatedAndReservedUSD);
        if (streak >= 3) return saveSummary(env, plan, ledger, "PILOT-V2-PAUSED", log);
      }
      game.status = finalStatus(game);
      C.atomicJSON(file, game);
      active = null; activeFile = null;
      if (!complete(game.status)) return saveSummary(env, plan, ledger, "PILOT-V2-PAUSED", log);
      saveSummary(env, plan, ledger, "PILOT-V2-IN-PROGRESS", log);
    }
    return saveSummary(env, plan, ledger, "PILOT-V2-COMPLETE", log);
  } catch (e) {
    const status = e.message === "BUDGET_STOP" ? "BUDGET-STOP" : "TECHNICAL-STOP";
    if (active) { active.status = status; C.atomicJSON(activeFile, active); }
    saveSummary(env, plan, ledger, status, log);
    throw e;
  }
}

async function main() {
  const args = process.argv.slice(2), command = args[0] || "help";
  if (command === "help") { console.log("無課金確認: node tools/jev-comparison/pilot-v2.cjs preflight\n予備対局: node tools/jev-comparison/pilot-v2.cjs run --live"); return; }
  C.assert((command === "preflight" && args.length === 1) || (command === "run" && args.length === 2 && args[1] === "--live"),
    "preflight、またはrun --liveを指定してください。");
  const env = inspect(), release = B.lock(env.ledgerDir);
  try {
    const ledger = new B.Ledger(env.ledgerDir, L.binding());
    C.assert(!ledger.halted, "台帳は停止状態です。");
    const engine = C.makeEngine(env.repo, { hooked: true });
    L.preparePlan(engine, env.output, ledger);
    // 遅延診断8件の費用も同じ台帳に残っていることを確認する。
    const diagnostic = read(path.join(env.output, "diagnostics/latency-diagnostic-v1.json"));
    for (const row of diagnostic.rows) {
      const account = ledger.records.get(row.id);
      C.assert(account && account.requestHash === row.requestHash && account.settled && account.status === "ok"
        && account.chargedNano === row.remote.response.usage.input_tokens * B.RATE_NANO, "遅延診断の費用記録が一致しません。");
    }
    const plan = planFor(engine, env.addonHash);
    freezePlan(env, plan);
    const preflightFile = path.join(env.root, "preflight.json");
    if (command === "preflight") {
      for (const item of plan.games) {
        const file = path.join(env.root, "games", item.id + ".json");
        if (fs.existsSync(file)) validateGame(engine, read(file), item, plan);
      }
      const dry = await decide(engine, plan.games[0].initialState, { timeMs: 100 });
      const report = { status: "PASS", planHash: plan.planHash, addonHash: env.addonHash, pairs: SETTINGS.pilotPairs,
        games: plan.games.length, timeLimitMs: SETTINGS.timeLimitMs, apiTimeoutMs: SETTINGS.apiTimeoutMs,
        realApiRequests: 0, drySearch: { elapsedMs: dry.elapsedMs, depth: dry.stats.completedDepth }, budget: ledger.summary() };
      C.atomicJSON(preflightFile, report); console.log(JSON.stringify(report, null, 2)); return;
    }
    C.assert(fs.existsSync(preflightFile) && read(preflightFile).status === "PASS" && read(preflightFile).planHash === plan.planHash,
      "この条件でpreflightを通過してください。");
    C.assert(process.env.TYPESAFE_API_KEY, "TYPESAFE_API_KEYを設定してください。");
    let paused = false, interrupts = 0;
    process.on("SIGINT", () => { paused = true; if (++interrupts > 1) process.exit(130); });
    process.on("SIGTERM", () => { paused = true; });
    const client = B.createClient(ledger, env.output, process.env.TYPESAFE_API_KEY);
    await runMatches(env, plan, ledger, client, { shouldPause: () => paused });
  } finally { release(); }
}
module.exports = { SETTINGS, planFor, freezePlan, decide, validateGame, finalStatus, failureStreak, runMatches, inspect };
if (require.main === module) main().catch(e => {
  console.error(e.message?.startsWith("Command failed") ? "Gitの状態確認に失敗しました。" : e.message);
  process.exitCode = 1;
});
