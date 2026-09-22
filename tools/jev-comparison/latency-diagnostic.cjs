#!/usr/bin/env node
"use strict";
// 既存キットを変更せず、共有台帳へ最大8要求だけ追加する遅延診断。
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");
const { setTimeout: wait } = require("node:timers/promises");
const C = require("./core.cjs");
const B = require("./budget.cjs");
const ID = "latency-diagnostic-v1";
const KIT_HASH = "de638ab06d987e483e992f6d17ba867f13d9273ea184f73415571e3b7cf6fbda";
const GAME_FILE = "games/pilot-pair-0-game-0.json";
const GAME_HASH = "e87e251ebf6e135e80f46b1dc9731f3e600affa629c280b614226e7eff797df4";
const CONTROL_HASH = "984962246fb7927f8526afb0dfbb5d448688b77dd75cd388fd28d9bbecc1373b";
const SETTINGS = { timeoutMs: 5000, spacedWaitMs: 4000, maxNewRequests: 8, stage: "pilot" };
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hashJSON = value => C.sha256(JSON.stringify(value));
const binding = () => hashJSON({ experimentId: C.config.experimentId, baselineCommit: C.config.baselineCommit, model: C.config.model });

function verifyFiles(kitDir) {
  const manifest = read(path.join(kitDir, "kit-manifest.json"));
  C.assert(hashJSON(manifest) === KIT_HASH, "対応する予備試験キットは0.1.0だけです。");
  const addon = read(path.join(kitDir, "latency-diagnostic-manifest.json"));
  C.assert(addon.id === ID, "追加診断の識別子が一致しません。");
  for (const file of ["latency-diagnostic.cjs", "LATENCY_DIAGNOSTIC.md"]) {
    C.assert(typeof addon.files[file] === "string", "追加診断の構成が不完全です。");
  }
  for (const entries of [manifest.files, addon.files]) for (const [file, expected] of Object.entries(entries)) {
    C.assert(path.basename(file) === file && C.sha256(fs.readFileSync(path.join(kitDir, file))) === expected,
      "固定ファイルが変更されています: " + path.basename(file));
  }
  return hashJSON(addon);
}

function preparePlan(engine, output, ledger) {
  const game = read(path.join(output, GAME_FILE));
  const control = read(path.join(output, "positions/pilot-position-0.json"));
  C.assert(hashJSON(game) === GAME_HASH && hashJSON(control) === CONTROL_HASH,
    "確認済みの対局・局面記録と一致しません。上書きせず結果を共有してください。");
  C.assert(game.status === "PAUSED" && game.moves.length === 5, "対象対局が停止時点と一致しません。");
  let state = C.clone(game.initialState);
  const sources = [];
  for (const row of game.moves) {
    C.assert(row.stateHash === hashJSON(state) && state.winner === null, "棋譜を再現できません。");
    const legal = engine.E.moveVariantsForSearch(state);
    C.assert(legal.some(m => engine.AI.moveKey(m) === engine.AI.moveKey(row.decision.move)), "棋譜に不正な着手があります。");
    if (row.competitor === "jev") {
      const originalId = game.id + "-ply-" + row.ply;
      const packet = C.requestFor(engine, state), requestHash = hashJSON(packet.body);
      const request = read(path.join(output, "requests", C.sha256(originalId) + ".json"));
      const response = read(path.join(output, "responses", C.sha256(originalId) + ".json"));
      const account = ledger.records.get(originalId);
      C.assert(request.id === originalId && request.requestHash === requestHash && hashJSON(request.body) === requestHash,
        "元の送信内容が一致しません。");
      C.assert(response.requestHash === requestHash && hashJSON(response.result) === hashJSON(row.decision.remote)
        && response.result.status === "timeout", "元のタイムアウト記録が一致しません。");
      C.assert(account && account.requestHash === requestHash && account.stage === "pilot"
        && account.status === "timeout" && account.chargedNano === B.RESERVE_NANO && account.inputTokens === null,
        "既存のタイムアウト費用が台帳に保持されていません。");
      sources.push({ source: originalId, packet, requestHash });
    }
    state = C.clone(engine.E.applyMoveForSearch(state, row.decision.move).state);
  }
  C.assert(hashJSON(state) === hashJSON(game.state) && sources.length === 3, "停止局面を再現できません。");
  const packet = C.requestFor(engine, control.state);
  sources.push({ source: control.id, packet, requestHash: hashJSON(packet.body) });
  return ["burst", "spaced"].flatMap(mode => sources.map((s, i) => ({
    id: ID + "-" + mode + "-" + i, mode, source: s.source,
    waitBeforeMs: mode === "spaced" ? SETTINGS.spacedWaitMs : 0,
    requestHash: s.requestHash, packet: s.packet,
  })));
}

function inspect(kitDir = __dirname) {
  C.assert(Number(process.versions.node.split(".")[0]) >= 24, "Node.js 24以上で実行してください。");
  const addonHash = verifyFiles(kitDir), repo = path.resolve(kitDir, "../.."), output = path.join(kitDir, "results");
  const git = (...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  C.assert(git("branch", "--show-current") === C.config.branch, "実験専用ブランチで実行してください。");
  git("merge-base", "--is-ancestor", C.config.baselineCommit, "HEAD");
  C.checkSources(repo);
  const ledgerDir = path.join(path.resolve(repo, git("rev-parse", "--git-common-dir")), "jev-comparison", C.config.experimentId);
  C.assert(fs.existsSync(path.join(ledgerDir, "budget.jsonl")), "既存の予算台帳が必要です。新規作成・リセットはしません。");
  const reportFile = path.join(output, "diagnostics", ID + ".json");
  return { repo, output, ledgerDir, reportFile, addonHash, head: git("rev-parse", "HEAD") };
}

function openReport(env, plan, ledger) {
  const specification = { id: ID, addonHash: env.addonHash, kitHash: KIT_HASH, settings: SETTINGS,
    baselineCommit: C.config.baselineCommit, model: C.config.model, gameHash: GAME_HASH,
    items: plan.map(({ packet, ...item }) => item) };
  const specificationHash = hashJSON(specification);
  if (fs.existsSync(env.reportFile)) {
    const old = read(env.reportFile);
    C.assert(old.specificationHash === specificationHash && hashJSON(old.specification) === specificationHash,
      "既存診断と条件が違います。削除や上書きはせず確認してください。");
    C.assert(Array.isArray(old.rows) && old.rows.length <= plan.length, "診断記録の件数が不正です。");
    for (let i = 0; i < old.rows.length; i++) {
      const row = old.rows[i], item = plan[i];
      const responseFile = path.join(env.output, "responses", C.sha256(item.id) + ".json");
      C.assert(row.id === item.id && row.requestHash === item.requestHash && ledger.records.get(item.id)?.requestHash === item.requestHash,
        "診断記録と台帳が一致しません。");
      // recoveredはファイルの再利用時だけ変わるため、保存応答との比較から除く。
      if (fs.existsSync(responseFile)) {
        const saved = read(responseFile);
        const a = { ...row.remote }, b = { ...saved.result }; delete a.recovered; delete b.recovered;
        C.assert(saved.id === item.id && saved.requestHash === item.requestHash && hashJSON(a) === hashJSON(b), "診断応答が一致しません。");
      } else {
        C.assert(row.remote.status === "interrupted-request" && row.remote.recovered
          && !ledger.records.get(item.id).settled, "診断応答が欠落しています。");
      }
    }
    return old;
  }
  return { schema: "bao-jev-latency-v1", experimentId: C.config.experimentId, createdAt: new Date().toISOString(),
    node: process.version, head: env.head, purpose: C.config.purpose, formalStatus: "NOT-STARTED",
    specification, specificationHash, status: "READY", rows: [], budgetBefore: ledger.summary() };
}

async function runDiagnostic(env, plan, ledger, client, { sleep = wait, shouldPause = () => false, log = console.log } = {}) {
  const report = openReport(env, plan, ledger);
  const save = status => {
    report.status = status; report.updatedAt = new Date().toISOString(); report.budget = ledger.summary();
    C.atomicJSON(env.reportFile, report);
    return report;
  };
  // 障害済みの8件を別IDで再送する機能はない。診断の障害も結果として保持する。
  if (report.rows.some(r => r.remote.status !== "ok")) return save("DIAGNOSTIC-STOP");
  if (report.rows.length === plan.length) return save("DIAGNOSTIC-COMPLETE");
  let previousEnd = null;
  const invocation = new Date().toISOString();
  try {
    save("RUNNING");
    for (let i = report.rows.length; i < plan.length; i++) {
      if (shouldPause()) return save("PAUSED");
      const item = plan[i], existing = ledger.records.has(item.id);
      if (!existing && item.waitBeforeMs) await sleep(item.waitBeforeMs);
      if (shouldPause()) return save("PAUSED");
      const began = performance.now(), startedAt = new Date().toISOString();
      const remote = await client.evaluate(item.packet, { id: item.id, stage: SETTINGS.stage, timeoutMs: SETTINGS.timeoutMs });
      const completed = performance.now();
      report.rows.push({ id: item.id, mode: item.mode, source: item.source, requestHash: item.requestHash,
        invocation, startedAt, finishedAt: new Date().toISOString(), waitBeforeMs: item.waitBeforeMs,
        observedGapMs: existing || previousEnd === null ? null : began - previousEnd,
        clientElapsedMs: completed - began, remote });
      previousEnd = completed;
      save(remote.status === "ok" && !remote.fatal ? "RUNNING" : "DIAGNOSTIC-STOP");
      log(item.id + ": " + remote.status + ", API " + Math.round(remote.elapsedMs) + " ms" + (remote.recovered ? "（保存応答）" : ""));
      if (remote.status !== "ok" || remote.fatal) return report;
    }
    return save("DIAGNOSTIC-COMPLETE");
  } catch (e) {
    save(e.message === "BUDGET_STOP" ? "BUDGET-STOP" : "TECHNICAL-STOP");
    throw e;
  }
}

async function main() {
  const args = process.argv.slice(2), command = args[0] || "help";
  if (command === "help") {
    console.log("無課金確認: node tools/jev-comparison/latency-diagnostic.cjs preflight\n遅延診断（最大8要求）: node tools/jev-comparison/latency-diagnostic.cjs run --live"); return;
  }
  C.assert((command === "preflight" && args.length === 1) || (command === "run" && args.length === 2 && args[1] === "--live"),
    "preflight、またはrun --liveを指定してください。");
  const env = inspect(), release = B.lock(env.ledgerDir);
  try {
    const ledger = new B.Ledger(env.ledgerDir, binding());
    C.assert(!ledger.halted, "台帳は停止状態です。診断を開始しません。");
    const engine = C.makeEngine(env.repo), plan = preparePlan(engine, env.output, ledger);
    openReport(env, plan, ledger);
    if (command === "preflight") {
      console.log(JSON.stringify({ status: "PASS", realApiRequests: 0, existingBudget: ledger.summary(),
        plannedDiagnosticRequests: plan.length, maximumAdditionalReservationUSD: plan.length * B.RESERVE_NANO / 1e9,
        timeoutMs: SETTINGS.timeoutMs, spacedWaitMs: SETTINGS.spacedWaitMs }, null, 2)); return;
    }
    C.assert(process.env.TYPESAFE_API_KEY, "TYPESAFE_API_KEYを設定してください。");
    let paused = false, interrupts = 0;
    process.on("SIGINT", () => { paused = true; if (++interrupts > 1) process.exit(130); });
    process.on("SIGTERM", () => { paused = true; });
    const client = B.createClient(ledger, env.output, process.env.TYPESAFE_API_KEY);
    const report = await runDiagnostic(env, plan, ledger, client, { shouldPause: () => paused });
    console.log(JSON.stringify({ status: report.status, completed: report.rows.length, budget: report.budget,
      report: "tools/jev-comparison/results/diagnostics/" + ID + ".json" }, null, 2));
    if (report.status === "DIAGNOSTIC-STOP") process.exitCode = 1;
  } finally { release(); }
}
module.exports = { ID, SETTINGS, verifyFiles, preparePlan, inspect, openReport, runDiagnostic, binding };
if (require.main === module) main().catch(e => {
  console.error(e.message?.startsWith("Command failed") ? "Gitの状態確認に失敗しました。" : e.message);
  process.exitCode = 1;
});
