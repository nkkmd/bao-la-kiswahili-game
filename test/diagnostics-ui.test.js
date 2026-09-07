"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("public/index.html", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const privacy = fs.readFileSync("public/privacy.html", "utf8");
const main = fs.readFileSync("public/main.js", "utf8");

assert.match(html, /id="ai-generation-badge"[^>]*>[\s\S]*?AI · AI-GEN3<\/span>/,
  "the game header identifies the AI-GEN3 lineage");
assert.match(html, /title="AI-GEN3-RELEASE-001"/,
  "the AI badge exposes the exact release ID");
assert.match(main, /aiGenerationBadge\.hidden = !isComputerGame\(\)/,
  "the AI generation badge is hidden for local two-player games");

for (const id of ["copy-position", "mark-ai-move", "copy-marked", "clear-marked"]) {
  assert.match(html, new RegExp(`id="${id}"`), `diagnostic UI includes ${id}`);
}
assert.ok(html.indexOf("./diagnostics.js") < html.indexOf("./main.js"),
  "diagnostics load before the main UI module");
assert.ok(html.indexOf("./engine.js") < html.indexOf("./review-suggestion.js"),
  "the engine loads before review suggestions");
assert.ok(html.indexOf("./diagnostics.js") < html.indexOf("./review-suggestion.js"),
  "diagnostics load before review suggestions");
assert.ok(html.indexOf("./review-suggestion.js") < html.indexOf("./main.js"),
  "review suggestions load before the main UI module");
assert.match(serviceWorker, /\.\/diagnostics\.js/,
  "diagnostics remain available in the offline cache");
assert.match(serviceWorker, /\.\/review-suggestion\.js/,
  "review suggestions remain available in the offline cache");
assert.match(serviceWorker, /\.\/diagnostic-download\.js/,
  "diagnostic downloads remain available in the offline cache");
assert.match(serviceWorker, /["']\.\/privacy["']/,
  "the Privacy Policy clean URL remains available in the offline cache");
assert.doesNotMatch(serviceWorker, /["']\.\/privacy\.html["']/,
  "the offline cache does not store the redirected Privacy Policy URL");
assert.match(privacy, /AI診断記録を外部へ自動送信する機能はありません/,
  "privacy policy states that diagnostic records are not uploaded automatically");
assert.match(privacy, /最大50件/, "privacy policy documents the local record limit");

console.log("Bao diagnostics UI tests passed");
