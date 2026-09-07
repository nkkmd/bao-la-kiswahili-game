"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const Config = require("../public/ai-config.js");

const manifest = JSON.parse(fs.readFileSync(
  "doc/ai-engineering/public-ai-improvement-program-5/releases/AI-GEN3-RELEASE-001.json",
  "utf8",
));
const html = fs.readFileSync("public/index.html", "utf8");
const main = fs.readFileSync("public/main.js", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const sha256 = (path) => crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");

assert.equal(Config.GENERATION, "AI-GEN3");
assert.equal(Config.RELEASE_ID, "AI-GEN3-RELEASE-001");
assert.equal(manifest.releaseId, Config.RELEASE_ID);
assert.equal(manifest.decision, "ADOPT");
assert.equal(manifest.generationLineageBefore, "AI-GEN2");
assert.equal(manifest.generationLineageAfter, Config.GENERATION);
assert.equal(manifest.status, "ADOPTED / PROMOTED");
assert.equal(manifest.verifiedPublicDeployment.sourceCommit,
  "650b4312ed9cd318d9981523533dd692bdce6125");
assert.equal(manifest.promotionRecord.publicDefaultAlreadyDeployed, true);

for (const [path, expected] of Object.entries(manifest.promotionDisclosureAssets)) {
  assert.equal(sha256(path), expected, path + " matches the release manifest");
}

assert.match(html, /id="ai-generation-badge"/);
assert.match(html, /AI · AI-GEN3/);
assert.match(main, /AIConfig\.GENERATION/);
assert.match(main, /AIConfig\.RELEASE_ID/);
assert.match(serviceWorker, /bao-la-kiswahili-v26/);

console.log("AI-GEN3 release tests passed");
