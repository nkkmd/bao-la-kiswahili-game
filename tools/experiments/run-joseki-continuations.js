#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  AI,
  E,
  atomicWriteJson,
  hashValue,
  josekiProvenance,
  moveKey,
  stableStringify,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const { validateTree } = require("./generate-joseki-tree.js");
const { CONDITION_IDS, validateCorpus } = require("./generate-joseki-continuation-corpus.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILES = Object.freeze([
  "tools/experiments/generate-joseki-continuation-corpus.js",
  "tools/experiments/run-joseki-continuations.js",
  "tools/experiments/verify-joseki-continuations.js",
  "tools/experiments/analyze-joseki-continuations.js",
]);
const HORIZONS = Object.freeze([120, 180]);
const CONDITION_CONFIGS = Object.freeze({
  "bao-d1": { depth: 1, evaluation: "bao" },
  "bao-d2": { depth: 2, evaluation: "bao" },
  "bao-d3": { depth: 3, evaluation: "bao" },
  "bao-d4": { depth: 4, evaluation: "bao" },
  "legacy-d2": { depth: 2, evaluation: "legacy" },
  "bao-v2-d2": { depth: 2, evaluation: "bao-v2" },
});
const FIXED_THRESHOLDS = Object.freeze({
  horizon180TerminalRateMinimum: 0.75,
  scoreWinnerAgreementMinimum: 0.60,
  horizonWinnerFlipRateMaximum: 0.10,
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    summary: "artifacts/joseki-study/summaries/phase-4-summary.json",
    phase2: "artifacts/joseki-study/phase-4",
    corpus: "artifacts/joseki-study/corpus/continuation-principal-leaves.json",
    output: "artifacts/joseki-study/robustness/continuations",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--summary") options.summary = value;
      else if (key === "--phase2") options.phase2 = value;
      else if (key === "--corpus") options.corpus = value;
      else if (key === "--output") options.output = value;
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  return options;
}

function fileSha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function continuationProvenance() {
  const base = josekiProvenance();
  return { ...base, sourceFileSha256: { ...base.sourceFileSha256,
    ...Object.fromEntries(SOURCE_FILES.map((file) => [file, fileSha256(file)])) } };
}

function resultConditionId(conditionId, horizon) { return `${conditionId}-t${horizon}`; }

function resultConditions() {
  return HORIZONS.flatMap((horizon) => CONDITION_IDS.map((conditionId) => {
    const base = CONDITION_CONFIGS[conditionId];
    const id = resultConditionId(conditionId, horizon);
    const config = { conditionId: id, baseConditionId: conditionId, level: "hard",
      searchProfile: "phase2", evaluationProfile: base.evaluation, maxDepth: base.depth,
      timeLimitMs: "Infinity", maxTotalPlies: horizon };
    return { id, baseConditionId: conditionId, horizon, config };
  }));
}

function identity(options, tree, corpus) {
  const source = continuationProvenance();
  const selected = resultConditions();
  return {
    schemaVersion: 1,
    experiment: "joseki-principal-leaf-continuation-selfplay",
    treeFile: options.tree,
    treeHash: tree.treeHash,
    corpusFile: options.corpus,
    corpusHash: corpus.corpusHash,
    conditionIds: selected.map(({ id }) => id),
    conditionHashes: Object.fromEntries(selected.map(({ id, config }) => [id, hashValue(config)])),
    horizons: HORIZONS,
    baseConditionIds: CONDITION_IDS,
    fixedThresholds: FIXED_THRESHOLDS,
    sourceCommit: source.sourceCommit,
    node: source.node,
    sourceFileSha256: source.sourceFileSha256,
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function resultPath(output, openingId) { return path.join(output, "blocks", `${openingId}.json`); }
function partialPath(output, openingId) { return path.join(output, "partials", `${openingId}.partial.json`); }

function counts(output, entries) {
  let completedOpenings = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const entry of entries) {
    const complete = resultPath(output, entry.openingId);
    const partial = partialPath(output, entry.openingId);
    if (fs.existsSync(complete)) {
      completedOpenings += 1;
      completedGames += JSON.parse(fs.readFileSync(complete, "utf8")).results.length;
    } else if (fs.existsSync(partial)) {
      partialGames += JSON.parse(fs.readFileSync(partial, "utf8")).results.length;
    }
  }
  return { completedOpenings, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, entries, experimentIdentity, startedAt, status, current = null) {
  const currentCounts = counts(options.output, entries);
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  const secondsPerGame = currentCounts.recordedGames ? elapsedSeconds / currentCounts.recordedGames : null;
  const remaining = entries.length * experimentIdentity.conditionIds.length - currentCounts.recordedGames;
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    identity: experimentIdentity,
    expected: { openings: entries.length, conditions: experimentIdentity.conditionIds.length,
      games: entries.length * experimentIdentity.conditionIds.length },
    ...currentCounts,
    elapsedSeconds,
    etaSeconds: secondsPerGame === null ? null : secondsPerGame * remaining,
    current,
  });
}

function playContinuation(entry, condition, treeHash) {
  const randomSeed = seedFrom(treeHash, entry.openingId, condition.id, "continuation-v1");
  const random = seededRandom(randomSeed);
  let state = E.clone(entry.state);
  const continuationMoveKeys = [];
  const totals = { moves: 0, nodes: 0, evaluations: 0, timeouts: 0, elapsedMoveMs: 0 };
  const started = process.hrtime.bigint();
  while (state.winner === null && entry.moveKeys.length + continuationMoveKeys.length < condition.horizon) {
    const analysis = AI.analyzeMove(state, condition.config.level, random, {
      searchProfile: condition.config.searchProfile,
      evaluationProfile: condition.config.evaluationProfile,
      maxDepth: condition.config.maxDepth,
      timeLimitMs: Infinity,
    });
    if (!analysis.move) break;
    continuationMoveKeys.push(moveKey(analysis.move));
    totals.moves += 1;
    totals.nodes += analysis.stats.nodes || 0;
    totals.evaluations += analysis.stats.evaluations || 0;
    totals.elapsedMoveMs += analysis.stats.elapsedMs || 0;
    if (analysis.stats.timedOut) totals.timeouts += 1;
    state = E.applyMove(state, analysis.move).state;
  }
  const predictedScore = entry.phase2SouthScores[condition.baseConditionId];
  return {
    conditionId: condition.id,
    baseConditionId: condition.baseConditionId,
    conditionConfig: condition.config,
    conditionConfigHash: hashValue(condition.config),
    horizon: condition.horizon,
    seed: randomSeed,
    openingId: entry.openingId,
    openingStateHash: entry.stateHash,
    predictedSouthScore: predictedScore,
    predictedWinner: predictedScore === null || predictedScore === 0 ? null : predictedScore > 0 ? 0 : 1,
    winner: state.winner,
    reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: entry.moveKeys.length,
    continuationPlies: continuationMoveKeys.length,
    totalPlies: entry.moveKeys.length + continuationMoveKeys.length,
    continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys),
    finalState: state,
    finalStateHash: hashValue(state),
    stats: { ...totals, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 },
  };
}

function validateBlock(block, entry, experimentIdentity) {
  assertIdentity(experimentIdentity, block.identity, `Opening ${entry.openingId}`);
  if (block.openingId !== entry.openingId || block.openingStateHash !== entry.stateHash) {
    throw new Error(`Opening mismatch: ${entry.openingId}`);
  }
  const ids = block.results.map(({ conditionId }) => conditionId);
  if (ids.length !== experimentIdentity.conditionIds.length || new Set(ids).size !== ids.length
    || experimentIdentity.conditionIds.some((id) => !ids.includes(id))) throw new Error(`Incomplete opening: ${entry.openingId}`);
  for (const result of block.results) {
    if (result.openingStateHash !== entry.stateHash
      || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
      || result.continuationHash !== hashValue(result.continuationMoveKeys)
      || result.finalStateHash !== hashValue(result.finalState)
      || result.stats.timeouts !== 0) throw new Error(`Continuation integrity mismatch: ${entry.openingId}/${result.conditionId}`);
  }
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const summary = JSON.parse(fs.readFileSync(options.summary, "utf8"));
  const corpus = JSON.parse(fs.readFileSync(options.corpus, "utf8"));
  validateTree(tree);
  validateCorpus(corpus, tree, summary, options.phase2);
  return { tree, summary, corpus };
}

function run(options) {
  if (options.status) {
    const file = path.join(options.output, "progress.json");
    console.log(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : JSON.stringify({ status: "not-started" }, null, 2));
    return null;
  }
  const { tree, corpus } = loadInputs(options);
  const experimentIdentity = identity(options, tree, corpus);
  const selected = resultConditions();
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const previous = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (previous) assertIdentity(experimentIdentity, previous.identity, "Progress");
  const startedAt = previous?.startedAt || new Date().toISOString();
  writeProgress(options, corpus.entries, experimentIdentity, startedAt, "running");
  for (const entry of corpus.entries) {
    const completeFile = resultPath(options.output, entry.openingId);
    const partialFile = partialPath(options.output, entry.openingId);
    if (fs.existsSync(completeFile)) {
      validateBlock(JSON.parse(fs.readFileSync(completeFile, "utf8")), entry, experimentIdentity);
      continue;
    }
    const partial = fs.existsSync(partialFile)
      ? JSON.parse(fs.readFileSync(partialFile, "utf8"))
      : { schemaVersion: 1, status: "partial", openingId: entry.openingId,
        openingStateHash: entry.stateHash, identity: experimentIdentity, results: [] };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${entry.openingId}`);
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const condition of selected) {
      if (done.has(condition.id)) continue;
      writeProgress(options, corpus.entries, experimentIdentity, startedAt, "running",
        { openingId: entry.openingId, conditionId: condition.id });
      partial.results.push(playContinuation(entry, condition, tree.treeHash));
      partial.updatedAt = new Date().toISOString();
      atomicWriteJson(partialFile, partial);
      const progress = counts(options.output, corpus.entries);
      console.log(`[joseki-continuation] ${progress.recordedGames}/${corpus.entries.length * selected.length} games`);
    }
    const block = { ...partial, status: "complete", completedAt: new Date().toISOString(),
      results: partial.results.slice().sort((a, b) => a.conditionId.localeCompare(b.conditionId)) };
    validateBlock(block, entry, experimentIdentity);
    atomicWriteJson(completeFile, block);
    fs.unlinkSync(partialFile);
  }
  const finalCounts = counts(options.output, corpus.entries);
  writeProgress(options, corpus.entries, experimentIdentity, startedAt, "complete");
  console.log(JSON.stringify({ status: "complete", ...finalCounts }, null, 2));
  return finalCounts;
}

function main() { run(parseArgs(process.argv.slice(2))); }
if (require.main === module) main();

module.exports = {
  CONDITION_CONFIGS, FIXED_THRESHOLDS, HORIZONS, assertIdentity, continuationProvenance,
  counts, identity, loadInputs, parseArgs, playContinuation, resultConditions, run, validateBlock,
};
