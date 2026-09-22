#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const C = require("./core.cjs");
const B = require("./budget.cjs");
const L = require("./latency-diagnostic.cjs");
const V = require("./pilot-v2.cjs");
const ID = "response-diagnostic-v1";
const ORIGINAL_ID = "pilot-v2-pair-0-game-0-ply-26";
const REQUEST_HASH = "6eb3ab603b9d7851a1a4977921f3f9c731e5a45f708cb5cac1a6262105b42864";
const GAME_HASH = "f288e2f7c0920678337c063645e2cfec79cafc1afdd0543f4b1462115403474a";
const OLD_RESPONSE_HASH = "a51e81a4fd5a986521b2787b63773c007b55fe711dc4948c4368343678edace8";
const OLD_SUMMARY_HASH = "29bda1487cec6eac36541679a575df9dde8472bce1c85b26b3828805f1d27b2f";
const API_TIMEOUT_MS = 5000;
const hash = value => C.sha256(JSON.stringify(value));
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const numeric = value => ({ type: value === null ? "null" : Array.isArray(value) ? "array" : typeof value,
  value: Number.isFinite(value) ? value : null, inUnitInterval: Number.isFinite(value) && value >= 0 && value <= 1 });

// 未知の文字列、ヘッダー、エラー本文は保存せず、検証に必要な値だけを残す。
function observe(data, packet) {
  const ids = Object.keys(packet.keyById), a = data?.answers?.priority, p = a?.probabilities;
  const values = Object.fromEntries(ids.map(id => [id, numeric(p?.[id])]));
  const keys = object(p) ? Object.keys(p) : [];
  const knownChoice = typeof a?.choice === "string" && ids.includes(a.choice);
  const allFinite = ids.every(id => values[id].value !== null);
  const total = allFinite ? ids.reduce((n, id) => n + values[id].value, 0) : null;
  const maximum = allFinite ? Math.max(...ids.map(id => values[id].value)) : null;
  const result = {
    modelMatches: data?.model === C.config.model,
    priorityIsObject: object(a), typeIsChoice: a?.type === "choice", choiceKnown: knownChoice,
    choice: knownChoice ? a.choice : null, confidence: numeric(a?.confidence),
    probabilities: { isObject: object(p), expectedCount: ids.length, returnedCount: keys.length,
      missingIds: ids.filter(id => !keys.includes(id)), unexpectedCount: keys.filter(id => !ids.includes(id)).length,
      values, total: Number.isFinite(total) ? total : null,
      differenceFromOne: Number.isFinite(total) ? total - 1 : null,
      maximum: Number.isFinite(maximum) ? maximum : null },
    usage: { input_tokens: Number.isSafeInteger(data?.usage?.input_tokens) ? data.usage.input_tokens : null,
      output_tokens: Number.isSafeInteger(data?.usage?.output_tokens) ? data.usage.output_tokens : null },
    failedChecks: [], legacyValidation: null,
  };
  const fail = (condition, name) => { if (!condition) result.failedChecks.push(name); };
  fail(result.modelMatches, "MODEL_ID"); fail(result.typeIsChoice, "ANSWER_TYPE"); fail(knownChoice, "CHOICE_ID");
  fail(result.confidence.inUnitInterval, "CONFIDENCE_RANGE");
  fail(object(p) && keys.length === ids.length && result.probabilities.missingIds.length === 0, "PROBABILITY_KEYS");
  fail(ids.every(id => values[id].inUnitInterval), "PROBABILITY_RANGE");
  fail(allFinite && Number.isFinite(total) && Math.abs(total - 1) < 0.002, "PROBABILITY_SUM");
  fail(knownChoice && allFinite && p[a.choice] + 0.002 >= maximum, "CHOICE_MAXIMUM");
  try { C.validateResponse(data, packet); result.legacyValidation = "PASS"; }
  catch (e) { result.legacyValidation = e.message === "MODEL_MISMATCH" ? "MODEL_MISMATCH" : "RESPONSE_INVALID"; }
  return result;
}

function inspect() {
  const env = V.inspect();
  C.assert(env.addonHash === "8851b1c461095d4c7987aeba7a93a95dfe37663e675b63935432515cb8b51070", "確認済みの予備対局プログラムと一致しません。");
  const manifest = read(path.join(__dirname, "response-diagnostic-manifest.json"));
  C.assert(manifest.id === ID, "応答診断の識別子が一致しません。");
  for (const name of ["response-diagnostic.cjs", "RESPONSE_DIAGNOSTIC.md"]) C.assert(typeof manifest.files[name] === "string", "追加ファイルが不完全です。");
  for (const [file, expected] of Object.entries(manifest.files)) C.assert(path.basename(file) === file
    && C.sha256(fs.readFileSync(path.join(__dirname, file))) === expected, "応答診断の固定ファイルが変更されています。");
  const game = read(path.join(env.output, "pilot-v2/games/pilot-v2-pair-0-game-0.json"));
  C.assert(hash(game) === GAME_HASH, "確認済みの停止棋譜と一致しません。");
  const plan = read(path.join(env.output, "pilot-v2/plan.json")), engine = C.makeEngine(env.repo);
  V.validateGame(engine, game, plan.games[0], plan);
  const packet = C.requestFor(engine, game.state), oldFile = C.sha256(ORIGINAL_ID) + ".json";
  C.assert(hash(packet.body) === REQUEST_HASH, "停止した要求を再現できません。");
  const oldRequest = read(path.join(env.output, "requests", oldFile));
  C.assert(oldRequest.id === ORIGINAL_ID && hash(oldRequest.body) === REQUEST_HASH
    && hash(oldRequest.keyById) === hash(packet.keyById), "元の要求記録が一致しません。");
  C.assert(hash(read(path.join(env.output, "responses", oldFile))) === OLD_RESPONSE_HASH, "元の不正応答記録が一致しません。");
  const oldSummary = read(path.join(env.output, "pilot-v2/summary.json"));
  C.assert(hash(oldSummary) === OLD_SUMMARY_HASH, "停止時の集計が一致しません。");
  return { ...env, addonHash: hash(manifest), packet, oldSummary,
    reviewFile: path.join(env.output, "diagnostics", ID + "-review.json"),
    observationFile: path.join(env.output, "diagnostics", ID + "-observation.json"),
    reportFile: path.join(env.output, "diagnostics", ID + ".json") };
}

function verifyAccount(env, ledger) {
  C.assert(ledger.halted, "確認済みの停止状態と一致しません。");
  const original = ledger.records.get(ORIGINAL_ID);
  C.assert(original && original.requestHash === REQUEST_HASH && original.stage === "pilot" && original.status === "invalid-response"
    && original.settled && original.inputTokens === 2317 && original.chargedNano === 97314, "停止した要求の費用記録が一致しません。");
  const existing = ledger.records.get(ID), totals = ledger.totals(), expected = env.oldSummary.budget;
  C.assert(ledger.records.size - (existing ? 1 : 0) === 41
    && totals.total - (existing?.chargedNano || 0) === Math.round(expected.estimatedAndReservedUSD * 1e9),
    "停止時から、許可した1要求以外の予算記録が変わっています。");
  for (const [stage, amount] of Object.entries(expected.stageUSD)) C.assert(
    totals.stages[stage] - (existing?.stage === stage ? existing.chargedNano : 0) === Math.round(amount * 1e9),
    "停止時の費用区分が一致しません。");
  if (existing) C.assert(existing.requestHash === REQUEST_HASH && existing.stage === "pilot" && existing.timeoutMs === API_TIMEOUT_MS,
    "保存された診断要求が条件と一致しません。");
}

// haltedは解除しない。ユーザーが明示許可した、固定ID・固定入力の診断1件だけに予約を限定する。
function reviewedLedger(env, ledger, acknowledged) {
  verifyAccount(env, ledger);
  const scope = { id: ID, requestHash: REQUEST_HASH, stage: "pilot", timeoutMs: API_TIMEOUT_MS,
    maxNewRequests: 1, reserveNano: B.RESERVE_NANO, addonHash: env.addonHash, originalFailureId: ORIGINAL_ID,
    originalGameHash: GAME_HASH, originalSummaryHash: OLD_SUMMARY_HASH };
  const scopeHash = hash(scope);
  return new Proxy(ledger, { get(target, property) {
    if (property === "reserve") return (id, stage, requestHash, timeoutMs) => {
      C.assert(acknowledged, "停止後の診断には--acknowledge-stopによる明示許可が必要です。");
      C.assert(id === ID && stage === scope.stage && requestHash === REQUEST_HASH && timeoutMs === API_TIMEOUT_MS,
        "許可範囲外のAPI要求は送信しません。");
      verifyAccount(env, target);
      const existing = target.records.get(ID);
      if (fs.existsSync(env.reviewFile)) C.assert(read(env.reviewFile).scopeHash === scopeHash
        && hash(read(env.reviewFile).scope) === scopeHash, "診断の明示許可記録が一致しません。");
      else {
        C.assert(!existing, "診断要求がありますが明示許可記録がありません。");
        C.atomicJSON(env.reviewFile, { schema: "bao-jev-explicit-diagnostic-review", createdAt: new Date().toISOString(),
          authorization: "user-cli--acknowledge-stop", scope, scopeHash, ledgerTailBefore: target.previous,
          budgetBefore: target.summary(), haltRemainsInEffect: true });
      }
      if (existing) { C.assert(existing.reviewHash === scopeHash, "台帳の診断許可が一致しません。"); return existing; }
      const t = target.totals();
      C.assert(t.total + B.RESERVE_NANO <= B.WORK_NANO && t.stages.pilot + B.RESERVE_NANO <= B.STAGES.pilot, "BUDGET_STOP");
      target.append({ type: "reserve", id, stage, requestHash, timeoutMs, reserveNano: B.RESERVE_NANO,
        reviewHash: scopeHash, scope: "explicit-single-diagnostic-while-halted" });
      C.assert(target.halted, "停止状態を維持できませんでした。");
      return null;
    };
    const value = Reflect.get(target, property);
    return typeof value === "function" ? value.bind(target) : value;
  } });
}

async function diagnose(env, ledger, apiKey, { acknowledged = false, transport = globalThis.fetch } = {}) {
  C.assert(acknowledged, "停止後の診断には--acknowledge-stopによる明示許可が必要です。");
  verifyAccount(env, ledger);
  if (!ledger.records.has(ID)) C.assert(!fs.existsSync(env.observationFile)
    && !fs.existsSync(path.join(env.output, "responses", C.sha256(ID) + ".json")),
    "診断の応答記録がありますが費用記録がありません。再送せず確認してください。");
  const scopedLedger = reviewedLedger(env, ledger, acknowledged);
  let observationWriteFailed = false;
  const observedTransport = async (url, args) => {
    const response = await transport(url, args);
    return { ok: response.ok, status: response.status, body: response.body,
      json: async () => {
        const data = await response.json();
        const observation = { schema: "bao-jev-response-observation-v1", id: ID, createdAt: new Date().toISOString(),
          addonHash: env.addonHash, requestHash: REQUEST_HASH, httpStatus: response.status, observation: observe(data, env.packet) };
        try { C.atomicJSON(env.observationFile, observation); }
        catch (e) { observationWriteFailed = true; throw e; }
        return data;
      } };
  };
  const client = B.createClient(scopedLedger, env.output, apiKey, observedTransport);
  let remote, error;
  try { remote = await client.evaluate(env.packet, { id: ID, stage: "pilot", timeoutMs: API_TIMEOUT_MS }); }
  catch (e) { error = e; }
  C.assert(ledger.halted, "対局の停止状態が変更されています。");
  const observation = fs.existsSync(env.observationFile) ? read(env.observationFile) : null;
  if (observation) C.assert(observation.id === ID && observation.requestHash === REQUEST_HASH && observation.addonHash === env.addonHash,
    "保存された診断内容が一致しません。");
  const report = { schema: "bao-jev-response-diagnostic-v1", id: ID, createdAt: new Date().toISOString(),
    experimentId: C.config.experimentId, purpose: C.config.purpose, formalStatus: "NOT-STARTED",
    addonHash: env.addonHash, originalFailureId: ORIGINAL_ID, requestHash: REQUEST_HASH,
    status: error ? (error.message === "BUDGET_STOP" ? "BUDGET-STOP" : "TECHNICAL-STOP")
      : observation ? "DIAGNOSTIC-RECORDED" : "DIAGNOSTIC-NO-ANSWER",
    remote: remote || null, observation: observation?.observation || null, observationWriteFailed,
    budget: ledger.summary(), gameHaltMaintained: ledger.halted,
    interpretation: "新たな診断1要求の記録です。過去の異常応答の復元ではありません。対局は再開しません。" };
  C.atomicJSON(env.reportFile, report);
  if (error) throw error;
  return report;
}

async function main() {
  const args = process.argv.slice(2), command = args[0] || "help";
  if (command === "help") { console.log("無課金確認: node tools/jev-comparison/response-diagnostic.cjs preflight\n停止後の診断1要求を明示許可: node tools/jev-comparison/response-diagnostic.cjs run --live --acknowledge-stop"); return; }
  C.assert((command === "preflight" && args.length === 1)
    || (command === "run" && args.length === 3 && args[1] === "--live" && args[2] === "--acknowledge-stop"),
    "preflight、またはrun --live --acknowledge-stopを指定してください。");
  const env = inspect(), release = B.lock(env.ledgerDir);
  try {
    const ledger = new B.Ledger(env.ledgerDir, L.binding());
    verifyAccount(env, ledger);
    if (command === "preflight") {
      console.log(JSON.stringify({ status: "PASS", realApiRequests: 0, plannedMaximumNewRequests: 1,
        maximumAdditionalReservationUSD: B.RESERVE_NANO / 1e9, budget: ledger.summary(),
        originalHaltMaintained: true, nextStep: "診断1要求だけを明示許可する場合はrun --live --acknowledge-stopを実行します。" }, null, 2)); return;
    }
    C.assert(process.env.TYPESAFE_API_KEY, "TYPESAFE_API_KEYを設定してください。");
    const report = await diagnose(env, ledger, process.env.TYPESAFE_API_KEY, { acknowledged: true });
    console.log(JSON.stringify({ status: report.status, responseStatus: report.remote?.status,
      failedChecks: report.observation?.failedChecks || null, legacyValidation: report.observation?.legacyValidation || null,
      probabilitySum: report.observation?.probabilities.total ?? null, budget: report.budget,
      gameHaltMaintained: report.gameHaltMaintained }, null, 2));
  } finally { release(); }
}
module.exports = { ID, ORIGINAL_ID, REQUEST_HASH, API_TIMEOUT_MS, observe, verifyAccount, reviewedLedger, diagnose };
if (require.main === module) main().catch(e => {
  console.error(e.message?.startsWith("Command failed") ? "Gitの状態確認に失敗しました。" : e.message);
  process.exitCode = 1;
});
