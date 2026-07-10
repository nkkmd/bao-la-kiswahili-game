"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("public/index.html", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const privacy = fs.readFileSync("public/privacy.html", "utf8");

for (const id of ["copy-position", "mark-ai-move", "copy-marked", "clear-marked"]) {
  assert.match(html, new RegExp(`id="${id}"`), `diagnostic UI includes ${id}`);
}
assert.ok(html.indexOf("./diagnostics.js") < html.indexOf("./main.js"),
  "diagnostics load before the main UI module");
assert.match(serviceWorker, /\.\/diagnostics\.js/,
  "diagnostics remain available in the offline cache");
assert.match(privacy, /AI診断記録を外部へ自動送信する機能はありません/,
  "privacy policy states that diagnostic records are not uploaded automatically");
assert.match(privacy, /最大50件/, "privacy policy documents the local record limit");

console.log("Bao diagnostics UI tests passed");
