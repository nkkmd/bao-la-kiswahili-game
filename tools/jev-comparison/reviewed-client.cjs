"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const C = require("./core.cjs");
const B = require("./budget.cjs");
const { observe } = require("./response-diagnostic.cjs");
const REVIEW_ID = "invalid-response-review-v1";
const TARGET_HALT = "7b23e4799d3df097795b8c6430ccf719b82d9361ca81008219234d05fb2ffead";
const DIAGNOSTIC_HASH = "b8ff4bef790b8ecd8af8f558fe08dad2d0c38b54de29732de3e6cf2323127950";
const hexHash = value => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
function checkReviewBase(ledger) {
  const totals = ledger.totals(), bad = ledger.records.get("pilot-v2-pair-0-game-0-ply-26"), diagnostic = ledger.records.get("response-diagnostic-v1");
  C.assert(ledger.records.size === 42 && totals.total === 11167170 && totals.uncertain === 8257536
    && totals.stages.smoke === 52710 && totals.stages.pilot === 11114460 && totals.stages.positions === 0 && totals.stages.matches === 0,
    "確認済みの42要求の予算台帳と一致しません。");
  C.assert(bad?.status === "invalid-response" && bad.inputTokens === 2317 && bad.chargedNano === 97314
    && diagnostic?.status === "ok" && diagnostic.inputTokens === 2317 && diagnostic.chargedNano === 97314
    && bad.requestHash === "6eb3ab603b9d7851a1a4977921f3f9c731e5a45f708cb5cac1a6262105b42864"
    && diagnostic.requestHash === bad.requestHash, "停止要求と追加診断の費用が一致しません。");
}

class ReviewedLedger extends B.Ledger {
  accept(row) {
    if (row.type !== "review-resume") {
      super.accept(row);
      if (row.type === "halt") { this.lastHaltHash = row.hash; this.lastHaltReason = row.reason; }
      return;
    }
    const { hash, ...unsigned } = row;
    C.assert(hash === C.sha256(JSON.stringify(unsigned)) && row.seq === this.sequence && row.previous === this.previous,
      "再開記録の台帳ハッシュが一致しません。");
    C.assert(this.halted && !this.resumeReview && this.lastHaltHash === TARGET_HALT && this.lastHaltReason === "invalid-response",
      "再開できる停止履歴ではありません。");
    C.assert(row.reviewId === REVIEW_ID && row.targetHaltHash === TARGET_HALT && row.diagnosticHash === DIAGNOSTIC_HASH
      && row.authorization === "user-cli--acknowledge-reviewed-resume" && row.profile === "pilot-matches-v3"
      && hexHash(row.planHash) && hexHash(row.addonHash), "再開の許可範囲が一致しません。");
    checkReviewBase(this);
    this.resumeReview = { hash, planHash: row.planHash, addonHash: row.addonHash };
    this.halted = false;
    this.sequence++; this.previous = hash;
  }
  resumeReviewed(planHash, addonHash, acknowledged) {
    C.assert(acknowledged, "確認後の対局再開には--acknowledge-reviewed-resumeが必要です。");
    C.assert(hexHash(planHash) && hexHash(addonHash), "再開条件のハッシュが不正です。");
    if (this.resumeReview) {
      C.assert(!this.halted && this.resumeReview.planHash === planHash && this.resumeReview.addonHash === addonHash,
        "この再開許可では、新たな停止や別の実行条件を解除できません。");
      return;
    }
    C.assert(this.halted && this.lastHaltHash === TARGET_HALT && this.lastHaltReason === "invalid-response",
      "今回確認した停止以外は解除できません。");
    checkReviewBase(this);
    this.append({ type: "review-resume", reviewId: REVIEW_ID, targetHaltHash: TARGET_HALT,
      diagnosticHash: DIAGNOSTIC_HASH, authorization: "user-cli--acknowledge-reviewed-resume",
      profile: "pilot-matches-v3", planHash, addonHash });
  }
  reserve(id, stage, requestHash, timeoutMs) {
    C.assert(this.resumeReview && stage === "pilot" && /^pilot-v3-pair-[0-3]-game-[01]-ply-(0|[1-9]\d{0,2})$/.test(id)
      && Number(id.split("-ply-")[1]) < 256 && Number.isInteger(timeoutMs) && timeoutMs >= 1 && timeoutMs <= 1500,
      "この再開許可の範囲外の要求です。");
    return super.reserve(id, stage, requestHash, timeoutMs);
  }
}

function createClient(ledger, output, apiKey, transport = globalThis.fetch) {
  C.assert(typeof apiKey === "string" && apiKey.length > 0 && !/[\r\n]/.test(apiKey), "TYPESAFE_API_KEYを設定してください。");
  return { async evaluate(packet, { id, stage, timeoutMs }) {
    const body = JSON.stringify(packet.body), requestHash = C.sha256(body), fileId = C.sha256(id);
    const requestFile = path.join(output, "requests", fileId + ".json"), responseFile = path.join(output, "responses", fileId + ".json");
    const existing = ledger.records.get(id);
    if (existing) {
      ledger.reserve(id, stage, requestHash, timeoutMs);
      if (fs.existsSync(responseFile)) {
        const stored = JSON.parse(fs.readFileSync(responseFile, "utf8"));
        C.assert(stored.id === id && stored.requestHash === requestHash, "保存応答の入力が一致しません。");
        return { ...stored.result, recovered: true };
      }
      return { status: "interrupted-request", recovered: true, elapsedMs: existing.timeoutMs, fatal: false };
    }
    C.assert(!fs.existsSync(responseFile), "応答がありますが費用記録がありません。再送しません。");
    C.atomicJSON(requestFile, { id, requestHash, body: packet.body, keyById: packet.keyById });
    ledger.reserve(id, stage, requestHash, timeoutMs);
    const started = performance.now();
    let data = null, result, statusCode = null, jsonParseFailed = false;
    try {
      const response = await transport("https://api.typesafe.ai/v1/systemone", { method: "POST", redirect: "error",
        headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
        body, signal: AbortSignal.timeout(Math.max(1, Math.floor(timeoutMs))) });
      statusCode = response.status;
      if (!response.ok) {
        if (response.body) { try { await response.body.cancel(); } catch {} }
        result = { status: "http-" + statusCode, fatal: true };
      } else {
        try { data = await response.json(); }
        catch (e) { jsonParseFailed = e?.name === "SyntaxError"; throw e; }
        try { result = { status: "ok", ...C.validateResponse(data, packet) }; }
        catch (e) {
          const mismatch = e.message === "MODEL_MISMATCH";
          result = { status: mismatch ? "model-mismatch" : "invalid-response", fatal: mismatch,
            validation: observe(data, packet), handling: mismatch ? "stop" : "reject-answer-and-search-without-jev" };
        }
      }
    } catch (e) {
      result = { status: jsonParseFailed ? "invalid-json" : e.name === "TimeoutError" || e.name === "AbortError" ? "timeout" : "network-error",
        fatal: false, jsonParseFailed };
    }
    result.elapsedMs = performance.now() - started;
    result.recovered = false;
    // 不合格応答でもusageを残す。検証条件と料金計算は元の実装を維持する。
    result.usage = { input_tokens: Number.isSafeInteger(data?.usage?.input_tokens) ? data.usage.input_tokens : null,
      output_tokens: Number.isSafeInteger(data?.usage?.output_tokens) ? data.usage.output_tokens : null };
    ledger.settle(id, data?.usage?.input_tokens, result.status);
    if (result.fatal) ledger.halt(result.status);
    if (ledger.halted) result.fatal = true;
    if (result.response) result.response.usage = result.usage;
    C.atomicJSON(responseFile, { id, requestHash, result, statusCode, savedAt: new Date().toISOString() });
    return result;
  } };
}
module.exports = { ReviewedLedger, createClient, checkReviewBase, TARGET_HALT, DIAGNOSTIC_HASH };
