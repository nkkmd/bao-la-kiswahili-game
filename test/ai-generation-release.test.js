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
assert.equal(manifest.promotionRecord.uiDisclosureDeploymentStatus, "VERIFIED-PUBLIC-ACTIVE");
assert.equal(manifest.promotionRecord.uiDisclosureDeployment.sourceCommit,
  "e6a3936ee6285d606be83987b5ae3aa2ee61ec25");
assert.equal(manifest.promotionRecord.uiDisclosureDeployment.indexVerification,
  "LIVE-DOM-BADGE-AND-RELEASE-ID-MATCH");

const immutableAIAssets = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "public/ai-config.js",
  "public/ai-worker.js",
];
for (const path of immutableAIAssets) {
  assert.equal(sha256(path), manifest.promotionDisclosureAssets[path],
    path + " matches the release manifest");
}

// The release manifest records the bytes deployed at promotion time. The current
// UI shell may evolve as long as it keeps the generation disclosure contract.
assert.match(html, /id="ai-generation-badge"/);
assert.match(html, /AI-GEN3 \/ Normal/);
assert.match(html, /data-ja="AI-GEN3 \/ ふつう"/);
assert.match(html, /easy: \["Easy", "やさしい"\]/);
assert.match(html, /expert: \["Mtaalamu", "ムタアラム"\]/);
assert.match(html, /BaoReleaseConfig\.displayIdentity/);
assert.match(main, /AIConfig\.displayIdentity/);
assert.match(serviceWorker, /bao-la-kiswahili-v36/);

console.log("AI-GEN3 release tests passed");
