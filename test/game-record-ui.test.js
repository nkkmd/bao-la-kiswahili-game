"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("public/index.html", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const privacy = fs.readFileSync("public/privacy.html", "utf8");
const recordSource = fs.readFileSync("public/game-record.js", "utf8");
const cachedFiles = vm.runInNewContext(serviceWorker + "\nFILES;", {
  URL,
  self: { registration: { scope: "https://example.test/" }, addEventListener() {} },
});

test("game record module loads after the main game runtime", () => {
  assert.ok(html.indexOf("./main.js") < html.indexOf("./game-record.js"));
});

test("game record remains available offline", () => {
  assert.ok(cachedFiles.includes("./game-record.js"));
  assert.match(serviceWorker, /bao-la-kiswahili-v42/);
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

test("privacy policy documents memory-only recording and explicit download", () => {
  assert.match(privacy, /対局中の棋譜は、その対局が開かれている間だけブラウザのメモリ上に保持されます/);
  assert.match(privacy, /棋譜をlocalStorageへ自動保存したり、外部へ送信したりする機能はありません/);
  assert.match(privacy, /Game records are not automatically stored in localStorage or transmitted externally/);
});
