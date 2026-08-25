#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const E = require(path.join(ROOT, "public/engine.js"));
const AI = require(path.join(ROOT, "public/ai.js"));
const AIConfig = require(path.join(ROOT, "public/ai-config.js"));
const WeightConfig = require(path.join(ROOT, "public/ai-weights.js"));
const { runSearch } = require(path.join(ROOT, "public/ai-worker.js"));

const BASELINE_ID = "AI-GEN2-BASELINE-2026-08-26-v1";
const SOURCE_COMMIT = "f4ae3b11901180cbe417b3e643e2b357d8045d2d";
const FILES = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "public/ai-config.js",
  "public/ai-worker.js",
  "public/main.js",
  "public/index.html",
  "public/service-worker.js",
];

function sha256File(rel) {
  const bytes = fs.readFileSync(path.join(ROOT, rel));
  return {
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

function moveKey(move) {
  return AI.moveKey(move);
}

function assertLegal(state, move, message) {
  const legalKeys = new Set(E.moveVariants(state).map(moveKey));
  assert.ok(legalKeys.has(moveKey(move)), message);
}

const fileIdentity = Object.fromEntries(FILES.map((rel) => [rel, sha256File(rel)]));
const indexText = fs.readFileSync(path.join(ROOT, "public/index.html"), "utf8");
const mainText = fs.readFileSync(path.join(ROOT, "public/main.js"), "utf8");
const workerText = fs.readFileSync(path.join(ROOT, "public/ai-worker.js"), "utf8");
const serviceWorkerText = fs.readFileSync(path.join(ROOT, "public/service-worker.js"), "utf8");

// Public UI mapping and default level.
for (const [value, label] of [
  ["easy", "やさしい"],
  ["normal", "ふつう"],
  ["hard", "むずかしい"],
  ["expert", "ムタアラム"],
]) {
  assert.ok(indexText.includes(`<option value="${value}"`), `UI difficulty ${value} exists`);
  assert.ok(indexText.includes(label), `UI difficulty label ${label} exists`);
}
assert.ok(indexText.includes('<option value="normal" selected>ふつう</option>'),
  "HTML default difficulty is normal");
assert.ok(mainText.includes('load("bao_ai_level", "normal")'),
  "runtime fallback difficulty is normal");
assert.ok(mainText.includes("AIConfig.searchOptions(difficultySelect.value, navigator, state)"),
  "public UI obtains hard/expert settings from AIConfig.searchOptions");
assert.ok(mainText.includes('new Worker("./ai-worker.js")'), "public UI uses AI worker");
assert.ok(mainText.includes("runAIFallback(request)"), "public UI contains main-thread fallback");
assert.ok(workerText.includes('importScripts("./engine.js", "./ai-weights.js", "./ai.js")'),
  "worker binds the same deployed engine/weights/AI files");

// Device-tier and public hard/expert budget semantics.
const capabilities = {
  low: { hardwareConcurrency: 2, deviceMemory: 2 },
  standard: { hardwareConcurrency: 4, deviceMemory: 4 },
  high: { hardwareConcurrency: 8, deviceMemory: 4 },
};
for (const [tier, caps] of Object.entries(capabilities)) {
  assert.equal(AIConfig.deviceTier(caps), tier, `${tier} device tier is stable`);
}
assert.equal(AIConfig.deviceTier({}), "standard", "missing capability metadata falls back to standard");

const hard = {
  low: { maxDepth: 6, timeLimitMs: 400 },
  standard: { maxDepth: 8, timeLimitMs: 500 },
  high: { maxDepth: 10, timeLimitMs: 600 },
};
const expert = {
  low: { maxDepth: 10, timeLimitMs: 1500 },
  standard: { maxDepth: 12, timeLimitMs: 2000 },
  high: { maxDepth: 14, timeLimitMs: 3000 },
};
for (const tier of Object.keys(capabilities)) {
  assert.deepEqual(AIConfig.baseSearchOptions("hard", capabilities[tier]), hard[tier],
    `hard/${tier} settings`);
  assert.deepEqual(AIConfig.searchOptions("hard", capabilities[tier], E.initialState()), hard[tier],
    `hard/${tier} public settings are non-adaptive base settings`);
  assert.deepEqual(AIConfig.baseSearchOptions("expert", capabilities[tier]), expert[tier],
    `expert/${tier} settings`);
  assert.deepEqual(AIConfig.searchOptions("expert", capabilities[tier], E.initialState()), expert[tier],
    `expert/${tier} public settings are non-adaptive base settings`);
}
assert.deepEqual(AIConfig.searchOptions("easy", capabilities.standard), {}, "easy has no search budget");
assert.deepEqual(AIConfig.searchOptions("normal", capabilities.standard), {}, "normal has no search budget");

// Evaluation profile and fixed-depth deterministic enhanced-search path.
assert.ok(WeightConfig.PROFILES.includes("bao"), "bao evaluation profile exists");
assert.ok(WeightConfig.PROFILES.includes("bao-v2"), "bao-v2 experimental profile exists");
const root = E.initialState();
assert.equal(AI.evaluate(root, root.player), AI.evaluateWithProfile(root, root.player, "bao"),
  "AI.evaluate uses bao semantics");

const fixedOptions = {
  maxDepth: 3,
  timeLimitMs: Infinity,
  evaluationProfile: "bao",
};
const fixedA = AI.analyzeMove(E.clone(root), "hard", () => 0, fixedOptions);
const fixedB = AI.analyzeMove(E.clone(root), "hard", () => 0.999999, fixedOptions);
assert.equal(moveKey(fixedA.move), moveKey(fixedB.move),
  "default hard fixed-depth move is independent of supplied RNG");
assert.equal(fixedA.stats.completedDepth, 3, "fixed-depth hard search completes depth 3");
assert.equal(fixedA.stats.timedOut, false, "infinite-time fixed-depth search does not time out");
assert.ok(fixedA.stats.quiescenceNodes > 0, "default hard search uses quiescence");
assert.ok(fixedA.stats.cacheStores > 0, "default hard search uses transposition table");
assert.ok(fixedA.stats.evaluationCacheHits > 0, "hard search enables evaluation cache by default");
assertLegal(root, fixedA.move, "fixed-depth hard move is legal");

// Exact timeout behavior: still return a legal safe move rather than fail closed.
const timeout = AI.analyzeMove(E.clone(root), "hard", () => 0, {
  maxDepth: 8,
  timeLimitMs: 0,
  evaluationProfile: "bao",
});
assert.equal(timeout.stats.timedOut, true, "zero budget records timeout");
assertLegal(root, timeout.move, "timeout path returns a legal move");

// Worker path uses the same move semantics under deterministic fixed-depth settings.
const workerResult = runSearch({
  type: "search",
  id: 1,
  state: E.clone(root),
  level: "hard",
  options: fixedOptions,
}, E, AI);
assert.equal(workerResult.type, "result");
assert.equal(workerResult.positionKey, AI.stateKey(root));
assert.equal(moveKey(workerResult.move), moveKey(fixedA.move),
  "worker and direct hard path agree at fixed depth");
assertLegal(root, workerResult.move, "worker move is legal");

// Record the exact state-key boundary discovered in PBAI-A. This is a baseline property,
// not an authorization to use this key for research-derived RAW identity/tablebase lookup.
const pendingVariant = E.clone(root);
pendingVariant.pending = [1, 0];
assert.equal(AI.stateKey(root), AI.stateKey(pendingVariant),
  "current AI.stateKey omits pending by construction");

const cacheMatch = serviceWorkerText.match(/const CACHE = "([^"]+)"/);
assert.ok(cacheMatch, "service worker cache version is parseable");
assert.ok(serviceWorkerText.includes('"./ai-worker.js"'), "worker is pre-cached");
assert.ok(serviceWorkerText.includes('"./ai.js"'), "AI is pre-cached");
assert.ok(serviceWorkerText.includes('"./engine.js"'), "engine is pre-cached");

const result = {
  schemaVersion: 1,
  program: "PBAI-P1",
  phase: "PBAI-B",
  baselineId: BASELINE_ID,
  generationLineage: "AI-GEN2",
  repositoryCommit: SOURCE_COMMIT,
  publicEndpoint: "https://bao-la-kiswahili.cultivationdata.net/",
  fileIdentity,
  rulesBinding: {
    rulesBaseline: "R-002",
    externalGuideCommit: "1179267b1f19b27a2138791253f2cb9cbfe98c14",
    takasiaImplemented: false,
  },
  ui: {
    defaultLevel: "normal",
    levels: { easy: "やさしい", normal: "ふつう", hard: "むずかしい", expert: "ムタアラム" },
  },
  evaluation: {
    publicDefaultProfile: "bao",
    baoV2IsExperimentalProfile: true,
    terminalMagnitude: 1_000_000,
  },
  search: {
    publicDefaultHardExpertImplementation: "enhanced-alpha-beta-iterative-deepening",
    historicalBenchmarkIdentifier: "phase2",
    hard,
    expert,
    adaptivePublicDefault: false,
    quiescenceDepthDefault: 1,
    transpositionTableMaxEntriesDefault: 50_000,
    transpositionKeyIncludesPlyByDefault: true,
    normalizeTtMateScoresDefault: false,
    evaluationCacheDefaultHardExpert: true,
    evaluationCacheMaxEntriesDefault: 2_048,
    ttMoveFirstDefault: false,
    orderQuiescenceCapturesDefault: false,
    historyHeuristicDefault: false,
    aspirationWindowDefault: 0,
    stableBestEarlyStopDefault: false,
  },
  randomness: {
    easy: "supplied RNG selects among exact legal moveVariants",
    normal: "supplied RNG selects among top up-to-3 immediate-score moves",
    hardExpertDefault: "deterministic for fixed state/options; supplied RNG unused by default enhanced search",
    workerRng: "Math.random",
  },
  worker: {
    primary: "Web Worker ./ai-worker.js",
    fallback: "main-thread AI.analyzeMove with same request state/level/options",
    staleResultGuard: "AI.stateKey positionKey equality",
  },
  identityBoundary: {
    currentAiStateKeyIncludesPending: false,
    authoritativeResearchRawIdentityInterchangeable: false,
  },
  pwa: {
    cacheVersion: cacheMatch[1],
    strategy: "cache-first for GET; versioned pre-cache; activate deletes non-current cache names",
  },
  smoke: {
    fixedDepth: 3,
    fixedMoveKey: moveKey(fixedA.move),
    fixedRootScore: fixedA.stats.rootScore,
    fixedNodes: fixedA.stats.nodes,
    fixedQuiescenceNodes: fixedA.stats.quiescenceNodes,
    fixedEvaluationRequests: fixedA.stats.evaluationRequests,
    fixedEvaluations: fixedA.stats.evaluations,
    workerMoveKey: moveKey(workerResult.move),
    zeroBudgetTimedOut: timeout.stats.timedOut,
    zeroBudgetMoveKey: moveKey(timeout.move),
  },
  passed: true,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
