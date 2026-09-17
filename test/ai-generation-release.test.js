"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const vm = require("node:vm");
const Config = require("../public/ai-config.js");

const baseManifest = JSON.parse(fs.readFileSync(
  "doc/ai-engineering/public-ai-improvement-program-5/releases/AI-GEN3-RELEASE-001.json",
  "utf8",
));
const currentManifest = JSON.parse(fs.readFileSync(
  "doc/ai-engineering/ai-gen4-release/AI-GEN4-RELEASE-001.json",
  "utf8",
));
const html = fs.readFileSync("public/index.html", "utf8");
const main = fs.readFileSync("public/main.js", "utf8");
const releaseAdapter = fs.readFileSync("public/ai-release.js", "utf8");
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");
const sha256 = (path) => crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");

// AI-GEN4 inherits the immutable AI-GEN3 base assets through the release adapter.
assert.equal(Config.GENERATION, "AI-GEN3");
assert.equal(Config.RELEASE_ID, "AI-GEN3-RELEASE-001");
assert.equal(baseManifest.releaseId, Config.RELEASE_ID);
assert.equal(baseManifest.decision, "ADOPT");
assert.equal(baseManifest.generationLineageBefore, "AI-GEN2");
assert.equal(baseManifest.generationLineageAfter, Config.GENERATION);
assert.equal(baseManifest.status, "ADOPTED / PROMOTED");
assert.equal(baseManifest.verifiedPublicDeployment.sourceCommit,
  "650b4312ed9cd318d9981523533dd692bdce6125");
assert.equal(baseManifest.promotionRecord.publicDefaultAlreadyDeployed, true);
assert.equal(baseManifest.promotionRecord.uiDisclosureDeploymentStatus, "VERIFIED-PUBLIC-ACTIVE");
assert.equal(baseManifest.promotionRecord.uiDisclosureDeployment.sourceCommit,
  "e6a3936ee6285d606be83987b5ae3aa2ee61ec25");
assert.equal(baseManifest.promotionRecord.uiDisclosureDeployment.indexVerification,
  "LIVE-DOM-BADGE-AND-RELEASE-ID-MATCH");

const immutableAIAssets = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "public/ai-config.js",
  "public/ai-worker.js",
];
for (const path of immutableAIAssets) {
  assert.equal(sha256(path), baseManifest.promotionDisclosureAssets[path],
    path + " matches the inherited AI-GEN3 base manifest");
}

// The current public release is AI-GEN4 and must remain tied to PBAI-C015-v1.
assert.equal(currentManifest.releaseId, "AI-GEN4-RELEASE-001");
assert.equal(currentManifest.decision, "ADOPT");
assert.equal(currentManifest.status, "ADOPTED / PROMOTED");
assert.equal(currentManifest.generationLineageBefore, Config.GENERATION);
assert.equal(currentManifest.generationLineageAfter, "AI-GEN4");
assert.equal(currentManifest.candidateId, "PBAI-C015-v1");
assert.deepEqual(currentManifest.programIds, ["PBAI-P8", "PBAI-P9", "PBAI-P11"]);
assert.equal(currentManifest.adoptionIds.hard, "PBAI-C015-HARD-ADOPTION-001");
assert.equal(currentManifest.adoptionIds.expert, "PBAI-C015-EXPERT-ADOPTION-001");
assert.equal(currentManifest.verifiedPublicDeployment.status, "DEPLOYED-ASSETS-VERIFIED");

const releaseContext = vm.createContext({
  BaoAI: {
    analyzeMove: () => ({ move: null, stats: {} }),
  },
  BaoAIConfig: Config,
  BaoLogicGate: {
    evaluate: () => 0,
  },
  BaoCandidateAI: {
    analyzeMove: () => ({ move: null, stats: {} }),
  },
});
vm.runInContext(releaseAdapter, releaseContext, { filename: "public/ai-release.js" });

assert.equal(releaseContext.BaoReleaseConfig.GENERATION, currentManifest.generationLineageAfter);
assert.equal(releaseContext.BaoReleaseConfig.RELEASE_ID, currentManifest.releaseId);
assert.equal(releaseContext.BaoReleaseConfig.searchOptions("hard").pbaiC015LogicGate, true);
assert.equal(releaseContext.BaoReleaseConfig.searchOptions("expert").pbaiC015LogicGate, true);
assert.equal(releaseContext.BaoReleaseConfig.searchOptions("easy").pbaiC015LogicGate, undefined);
assert.equal(releaseContext.BaoReleaseConfig.searchOptions("normal").pbaiC015LogicGate, undefined);

const hardIdentity = releaseContext.BaoReleaseConfig.displayIdentity("hard");
const expertIdentity = releaseContext.BaoReleaseConfig.displayIdentity("expert");
const normalIdentity = releaseContext.BaoReleaseConfig.displayIdentity("normal");
assert.equal(hardIdentity.releaseId, currentManifest.releaseId);
assert.equal(hardIdentity.adoptionId, currentManifest.adoptionIds.hard);
assert.equal(hardIdentity.evaluator, currentManifest.candidateId);
assert.equal(expertIdentity.releaseId, currentManifest.releaseId);
assert.equal(expertIdentity.adoptionId, currentManifest.adoptionIds.expert);
assert.equal(expertIdentity.evaluator, currentManifest.candidateId);
assert.equal(normalIdentity.releaseId, currentManifest.releaseId);
assert.equal(normalIdentity.evaluator, "AI-GEN3-baseline");

// Historical manifests keep promotion-time bytes; the current UI shell may evolve
// as long as it preserves the current generation and release disclosure contract.
assert.match(html, /id="ai-generation-badge"/);
assert.match(html, /AI-GEN4 \/ Normal/);
assert.match(html, /data-ja="AI-GEN4 \/ ふつう"/);
assert.match(html, /easy: \["Easy", "やさしい"\]/);
assert.match(html, /data-ja="ビングワ">Bingwa<\/option>/);
assert.match(html, /expert: \["Bingwa", "ビングワ"\]/);
assert.match(html, /BaoReleaseConfig\.displayIdentity/);
assert.match(main, /AIConfig\.displayIdentity/);
assert.match(serviceWorker, /bao-la-kiswahili-v49/);

console.log("AI-GEN4 release lineage tests passed");
