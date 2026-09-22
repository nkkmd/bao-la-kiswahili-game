"use strict";
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { performance } = require("node:perf_hooks");
const { config, sha256, assert, atomicJSON, validateResponse } = require("./core.cjs");
const RATE_NANO = 42;
const MAX_TOKENS = 65536;
const RESERVE_NANO = RATE_NANO * MAX_TOKENS;
const HARD_NANO = 5_000_000_000;
const WORK_NANO = 4_500_000_000;
const STAGES = { smoke: 100_000_000, pilot: 400_000_000, positions: 500_000_000, matches: 3_500_000_000 };
const dollars = n => Number((n / 1e9).toFixed(9));
class Ledger {
  constructor(dir, binding) {
    this.dir = dir; fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    this.file = path.join(dir, "budget.jsonl"); this.records = new Map(); this.sequence = 0; this.previous = "";
    this.binding = binding; this.halted = false;
    if (fs.existsSync(this.file)) {
      const raw = fs.readFileSync(this.file, "utf8");
      assert(raw.endsWith("\n"), "予算台帳の末尾が不完全です。削除せず共有して確認してください。");
      const rows = raw.trimEnd().split("\n").map(line => JSON.parse(line));
      for (const row of rows) this.accept(row);
      assert(this.sequence > 0, "予算台帳が空です。");
    } else {
      this.append({ type: "init", experimentId: config.experimentId, binding, rateNano: RATE_NANO, maxTokens: MAX_TOKENS,
        hardNano: HARD_NANO, workNano: WORK_NANO, stages: STAGES });
    }
  }
  accept(row) {
    const { hash, ...unsigned } = row;
    assert(hash === sha256(JSON.stringify(unsigned)) && row.seq === this.sequence && row.previous === this.previous,
      "予算台帳の連続性が壊れています。停止しました。");
    if (row.type === "init") {
      assert(this.sequence === 0 && row.binding === this.binding && row.experimentId === config.experimentId,
        "実験設定が既存の予算台帳と一致しません。");
      assert(row.rateNano === RATE_NANO && row.maxTokens === MAX_TOKENS && row.workNano === WORK_NANO && row.hardNano === HARD_NANO,
        "料金または予算設定が一致しません。");
    } else if (row.type === "reserve") {
      assert(!this.records.has(row.id) && STAGES[row.stage] && row.reserveNano === RESERVE_NANO, "予算予約が不正です。");
      this.records.set(row.id, { ...row, chargedNano: row.reserveNano, settled: false });
    } else if (row.type === "settle") {
      const record = this.records.get(row.id);
      assert(record && !record.settled && Number.isSafeInteger(row.chargedNano) && row.chargedNano >= 0, "費用確定記録が不正です。");
      Object.assign(record, { chargedNano: row.chargedNano, settled: true, status: row.status, inputTokens: row.inputTokens });
    } else if (row.type === "halt") this.halted = true;
    else throw new Error("予算台帳の記録形式が不明です。");
    this.sequence++; this.previous = hash;
  }
  append(event) {
    const unsigned = { seq: this.sequence, previous: this.previous, time: new Date().toISOString(), ...event };
    const row = { ...unsigned, hash: sha256(JSON.stringify(unsigned)) };
    const fd = fs.openSync(this.file, "a", 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(row) + "\n"); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    this.accept(row);
  }
  totals() {
    const stages = Object.fromEntries(Object.keys(STAGES).map(k => [k, 0]));
    let total = 0, settled = 0, uncertain = 0;
    for (const r of this.records.values()) {
      total += r.chargedNano; stages[r.stage] += r.chargedNano;
      if (r.settled && r.inputTokens !== null) settled += r.chargedNano; else uncertain += r.chargedNano;
    }
    return { total, stages, settled, uncertain };
  }
  summary() {
    const t = this.totals();
    return { requests: this.records.size, estimatedAndReservedUSD: dollars(t.total), reportedUsageUSD: dollars(t.settled),
      uncertainReservedUSD: dollars(t.uncertain), workLimitUSD: 4.5, overallLimitUSD: 5,
      stageUSD: Object.fromEntries(Object.entries(t.stages).map(([k, n]) => [k, dollars(n)])), halted: this.halted };
  }
  reserve(id, stage, requestHash, timeoutMs) {
    assert(!this.halted, "台帳が停止状態です。確認なしにAPIを再開できません。");
    assert(STAGES[stage], "不明な予算区分です。");
    const existing = this.records.get(id);
    if (existing) { assert(existing.requestHash === requestHash && existing.stage === stage, "既存要求と入力が一致しません。"); return existing; }
    const t = this.totals();
    assert(t.total + RESERVE_NANO <= WORK_NANO && t.stages[stage] + RESERVE_NANO <= STAGES[stage], "BUDGET_STOP");
    this.append({ type: "reserve", id, stage, requestHash, timeoutMs, reserveNano: RESERVE_NANO });
    return null;
  }
  settle(id, inputTokens, status) {
    const valid = Number.isSafeInteger(inputTokens) && inputTokens >= 0;
    const chargedNano = valid ? inputTokens * RATE_NANO : RESERVE_NANO;
    assert(Number.isSafeInteger(chargedNano), "課金使用量の数値が不正です。");
    this.append({ type: "settle", id, inputTokens: valid ? inputTokens : null, chargedNano, status });
    if (valid && inputTokens > MAX_TOKENS) this.halt("usage-exceeded-reservation");
  }
  halt(reason) { if (!this.halted) this.append({ type: "halt", reason }); }
}
function lock(dir) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, "run.lock");
  let fd;
  try { fd = fs.openSync(file, "wx", 0o600); }
  catch { throw new Error("実験が実行中、または中断時のロックがあります。statusを確認してください。"); }
  fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, host: os.hostname(), started: new Date().toISOString() }));
  fs.fsyncSync(fd); fs.closeSync(fd);
  return () => fs.unlinkSync(file);
}
function unlockStale(dir) {
  const file = path.join(dir, "run.lock");
  if (!fs.existsSync(file)) return;
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  assert(value.host === os.hostname() && Number.isSafeInteger(value.pid) && value.pid > 0, "別環境のロックです。手動確認が必要です。");
  let alive = true;
  try { process.kill(value.pid, 0); } catch (e) { if (e.code === "ESRCH") alive = false; }
  assert(!alive, "記録されたプロセスが存在します。ロックを解除しません。");
  fs.unlinkSync(file);
}
function createClient(ledger, output, apiKey, transport = globalThis.fetch) {
  assert(typeof apiKey === "string" && apiKey.length > 0 && !/[\r\n]/.test(apiKey), "TYPESAFE_API_KEYを設定してください。");
  return { async evaluate(packet, { id, stage, timeoutMs }) {
    const body = JSON.stringify(packet.body), requestHash = sha256(body), fileId = sha256(id);
    const requestFile = path.join(output, "requests", fileId + ".json");
    const responseFile = path.join(output, "responses", fileId + ".json");
    const existing = ledger.records.get(id);
    if (existing) {
      ledger.reserve(id, stage, requestHash, timeoutMs);
      if (fs.existsSync(responseFile)) {
        const stored = JSON.parse(fs.readFileSync(responseFile, "utf8"));
        assert(stored.requestHash === requestHash, "保存応答の入力ハッシュが一致しません。");
        return { ...stored.result, recovered: true };
      }
      return { status: "interrupted-request", recovered: true, elapsedMs: existing.timeoutMs, fatal: false };
    }
    atomicJSON(requestFile, { id, requestHash, body: packet.body, keyById: packet.keyById });
    ledger.reserve(id, stage, requestHash, timeoutMs);
    const started = performance.now();
    let data = null, result, statusCode = null;
    try {
      const response = await transport("https://api.typesafe.ai/v1/systemone", { method: "POST", redirect: "error",
        headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
        body, signal: AbortSignal.timeout(Math.max(1, Math.floor(timeoutMs))) });
      statusCode = response.status;
      if (!response.ok) {
        // エラー本文やヘッダーには機密が含まれる可能性があるため保存しない。
        if (response.body) await response.body.cancel();
        result = { status: "http-" + statusCode, fatal: true };
      } else {
        data = await response.json();
        try { result = { status: "ok", ...validateResponse(data, packet) }; }
        catch (e) { result = { status: e.message === "MODEL_MISMATCH" ? "model-mismatch" : "invalid-response", fatal: true }; }
      }
    } catch (e) {
      result = { status: e.name === "TimeoutError" || e.name === "AbortError" ? "timeout" : "network-error", fatal: false };
    }
    result.elapsedMs = performance.now() - started;
    result.recovered = false;
    ledger.settle(id, data?.usage?.input_tokens, result.status);
    if (result.fatal) ledger.halt(result.status);
    if (ledger.halted) result.fatal = true;
    // usageは整数の2項目のみ保存し、応答中の任意の追加文字列を残さない。
    if (result.response) result.response.usage = {
      input_tokens: Number.isSafeInteger(data?.usage?.input_tokens) ? data.usage.input_tokens : null,
      output_tokens: Number.isSafeInteger(data?.usage?.output_tokens) ? data.usage.output_tokens : null,
    };
    atomicJSON(responseFile, { id, requestHash, result, statusCode, savedAt: new Date().toISOString() });
    return result;
  } };
}
module.exports = { Ledger, lock, unlockStale, createClient, RATE_NANO, MAX_TOKENS, RESERVE_NANO, HARD_NANO, WORK_NANO, STAGES };
