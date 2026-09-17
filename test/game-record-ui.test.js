"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("public/index.html", "utf8");
const style = fs.readFileSync("public/style.css", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const privacy = fs.readFileSync("public/privacy.html", "utf8");
const recordSource = fs.readFileSync("public/game-record.js", "utf8");
const replaySource = fs.readFileSync("public/game-record-replay.js", "utf8");
const mainSource = fs.readFileSync("public/main.js", "utf8");
const contributionSource = fs.readFileSync("public/game-record-contribution.js", "utf8");
const contributionConfig = fs.readFileSync("public/game-record-contribution-config.js", "utf8");
const cachedFiles = vm.runInNewContext(serviceWorker + "\nFILES;", {
  URL,
  self: { registration: { scope: "https://example.test/" }, addEventListener() {} },
});

test("game record module loads after the main game runtime", () => {
  assert.ok(html.indexOf("./main.js") < html.indexOf("./game-record.js"));
});

test("replay and contribution clients load in dependency order", () => {
  assert.ok(html.indexOf("./game-record.js") < html.indexOf("./game-record-replay.js"));
  assert.ok(html.indexOf("./game-record-replay.js") < html.indexOf("./game-record-contribution-config.js"));
  assert.ok(html.indexOf("./game-record-contribution-config.js") < html.indexOf("./game-record-contribution.js"));
  assert.match(contributionConfig, /enabled:\s*true/);
  assert.match(contributionConfig,
    /endpoint:\s*"https:\/\/bao-data\.cultivationdata\.net\/v1\/game-records"/);
  assert.match(contributionConfig, /turnstileSiteKey:\s*"0x4AAAAAAE4W_jsKIMA65M99"/);
});

test("game record and contribution client remain available offline", () => {
  assert.ok(cachedFiles.includes("./game-record.js"));
  assert.ok(cachedFiles.includes("./game-record-replay.js"));
  assert.ok(cachedFiles.includes("./game-record-contribution-config.js"));
  assert.ok(cachedFiles.includes("./game-record-contribution.js"));
  assert.match(serviceWorker, /bao-la-kiswahili-v50/);
});

test("save action is created only for a completed game", () => {
  assert.match(recordSource, /state\?\.winner === null/);
  assert.match(recordSource, /finalize\(currentRecord, state\)/);
  assert.match(recordSource, /showSaveAction\(\)/);
  assert.match(recordSource, /Save game record/);
  assert.match(recordSource, /棋譜を保存/);
});

test("recording wraps committed UI moves without touching AI search", () => {
  assert.match(recordSource, /const originalPlayMove = root\.playMove/);
  assert.match(recordSource, /appendMove\(currentRecord, state, move\)/);
  assert.match(recordSource, /const originalAfterMove = root\.afterMove/);
  assert.doesNotMatch(recordSource, /analyzeMove|startAI|aiWorker|postMessage/);
});

test("contribution is explicit, computer-only, locally verified, and never background retried", () => {
  assert.match(contributionSource, /settings\?\.mode === "computer"/);
  assert.match(contributionSource, /Send game record for AI improvement/);
  assert.match(contributionSource, /AI改善のため棋譜を送信/);
  assert.match(contributionSource, /Agree and send/);
  assert.match(contributionSource, /同意して送信/);
  assert.match(contributionSource, /GameRecord\.validateRecord\(record, true\)/);
  assert.match(contributionSource, /GameRecord\.replay\(record, Engine\)/);
  assert.match(contributionSource, /turnstileToken/);
  assert.match(contributionSource, /purpose: "ai-improvement"/);
  assert.doesNotMatch(contributionSource, /localStorage|sessionStorage|sendBeacon|setInterval/);
});

test("privacy policy distinguishes local saving from explicit contribution", () => {
  assert.match(privacy, /対局中の棋譜は、その対局が開かれている間だけブラウザのメモリ上に保持されます/);
  assert.match(privacy, /棋譜提供を行わない限り、棋譜は外部へ送信されません/);
  assert.match(privacy, /AI改善のための任意の棋譜提供/);
  assert.match(privacy, /自動送信、一括同意、バックグラウンド再送は行いません/);
  assert.match(privacy, /2人対戦の棋譜は送信対象にしません/);
  assert.match(privacy, /source IP address or Turnstile token/);
  assert.match(privacy, /R2 record metadata/);
  assert.match(privacy, /automatically deletes them after 90 days/);
});


test("setup exposes a non-persistent saved-record replay mode", () => {
  assert.match(html, /option value="replay" data-ja="棋譜再生">Replay game record/);
  assert.match(html, /id="replay-file"/);
  assert.match(html, /id="replay-back"/);
  assert.match(html, /id="replay-next"/);
  assert.match(mainSource, /if \(!isReplayMode\(\)\) save\("bao_game_mode"/);
  assert.match(mainSource, /savedMode === "local" \? "local" : "computer"/);
});

test("replay blocks play interaction and reuses the normal forward animation path", () => {
  assert.match(mainSource, /function isHumanTurn\(\) \{ return !isReplayMode\(\)/);
  assert.match(mainSource, /replayTargetIndex = replaySession\.index \+ 1/);
  assert.match(mainSource, /playMove\(transition\.entry\.move\)/);
  assert.match(mainSource, /window\.BaoGameRecordReplay\.seek\(replaySession, index\)/);
  assert.match(replaySource, /engine\.applyMove\(clone\(current\), clone\(entry\.move\)\)/);
  assert.match(replaySource, /initial position mismatch/);
  assert.match(replaySource, /final position mismatch/);
});


test("replay file input cannot widen the mobile setup panel", () => {
  assert.match(style, /\.start-panel \{[^}]*max-width:\s*100%[^}]*box-sizing:\s*border-box/s);
  assert.match(style, /\.setup-field \{[^}]*grid-template-columns:\s*64px minmax\(0, 1fr\)/s);
  assert.match(style, /\.replay-file-field input \{[^}]*max-width:\s*100%[^}]*min-width:\s*0[^}]*box-sizing:\s*border-box[^}]*overflow:\s*hidden/s);
  assert.match(style, /\.replay-load-status \{[^}]*max-width:\s*100%[^}]*min-width:\s*0[^}]*overflow-wrap:\s*anywhere[^}]*word-break:\s*break-word/s);
});
