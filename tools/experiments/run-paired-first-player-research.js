#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  CONDITIONS,
  atomicWriteJson,
  conditionConfig,
  hashValue,
  parseJsonLines,
  playContinuation,
  provenance,
  seedFrom,
  seededRandom,
  sha256Text,
  stableStringify,
  validateCorpus,
} = require("./paired-first-player-common.js");

const PROFILE_COUNTS = Object.freeze({ fixture: 12, screening: 40, confirmatory: 200, sensitivity: 200 });

function parseArgs(argv) {
  const options = {
    profile: "screening",
    corpus: "artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl",
    output: null,
    maxTurns: 120,
    mctsIterations: 12,
    mctsPlayoutTurns: 16,
    count: null,
    conditionIds: CONDITIONS.map(({ id }) => id),
    onlyCondition: null,
    status: false,
    force: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else if (key === "--force") options.force = true;
    else {
      const value = argv[index + 1];
      if (key === "--profile") options.profile = value;
      else if (key === "--corpus") options.corpus = value;
      else if (key === "--output") options.output = value;
      else if (key === "--max-turns") options.maxTurns = Number(value);
      else if (key === "--mcts-iterations") options.mctsIterations = Number(value);
      else if (key === "--mcts-playout-turns") options.mctsPlayoutTurns = Number(value);
      else if (key === "--count") options.count = Number(value);
      else if (key === "--conditions") options.conditionIds = value.split(",").filter(Boolean);
      else if (key === "--only-condition") options.onlyCondition = value;
      else throw new Error(`Unknown argument: ${key}`);
      index += 1;
    }
  }
  if (!(options.profile in PROFILE_COUNTS)) throw new Error(`Unknown profile: ${options.profile}`);
  if (options.count !== null && (!Number.isInteger(options.count) || options.count < 1)) {
    throw new Error("count must be a positive integer");
  }
  if (!Number.isInteger(options.maxTurns) || options.maxTurns < 1) throw new Error("max-turns must be positive");
  if (!Number.isInteger(options.mctsIterations) || options.mctsIterations < 1) throw new Error("mcts-iterations must be positive");
  if (!Number.isInteger(options.mctsPlayoutTurns) || options.mctsPlayoutTurns < 1) throw new Error("mcts-playout-turns must be positive");
  if (options.onlyCondition && !CONDITIONS.some(({ id }) => id === options.onlyCondition)) {
    throw new Error(`Unknown condition: ${options.onlyCondition}`);
  }
  if (!options.conditionIds.length || new Set(options.conditionIds).size !== options.conditionIds.length
    || options.conditionIds.some((id) => !CONDITIONS.some((condition) => condition.id === id))) {
    throw new Error("conditions must be a unique comma-separated list of known condition IDs");
  }
  if (!options.conditionIds.includes("C0")) throw new Error("conditions must include C0");
  if (options.onlyCondition && !options.conditionIds.includes(options.onlyCondition)) {
    throw new Error("only-condition must be included in conditions");
  }
  options.output ||= `artifacts/paired-first-player/2026-07/${options.profile}`;
  return options;
}

function loadCorpus(file) {
  const text = fs.readFileSync(file, "utf8");
  const entries = parseJsonLines(text, file);
  const manifestFile = path.join(path.dirname(file), "manifest.json");
  if (!fs.existsSync(manifestFile)) throw new Error(`Missing corpus manifest: ${manifestFile}`);
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  validateCorpus(entries, manifest, text);
  return { entries, manifest, text, sha256: sha256Text(text), manifestFile };
}

function selectedConditions(conditionIds) {
  return conditionIds.map((id) => CONDITIONS.find((condition) => condition.id === id));
}

function shuffleConditions(openingId, corpusSha256, conditions = CONDITIONS) {
  const values = [...conditions];
  const random = seededRandom(seedFrom(corpusSha256, openingId, "condition-order"));
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function experimentIdentity(options, corpus, source) {
  const conditions = selectedConditions(options.conditionIds);
  const conditionHashes = Object.fromEntries(conditions.map((condition) => [
    condition.id,
    hashValue(conditionConfig(condition, options)),
  ]));
  return {
    schemaVersion: 2,
    profile: options.profile,
    corpusId: corpus.manifest.corpusId,
    corpusFile: options.corpus,
    corpusManifestFile: corpus.manifestFile,
    corpusFileSha256: corpus.sha256,
    requestedOpenings: options.count ?? PROFILE_COUNTS[options.profile],
    conditionIds: options.conditionIds,
    maxTurns: options.maxTurns,
    mctsIterations: options.mctsIterations,
    mctsPlayoutTurns: options.mctsPlayoutTurns,
    conditionHashes,
    sourceCommit: source.sourceCommit,
    sourceTreeDirty: source.sourceTreeDirty,
    node: source.node,
    sourceFileSha256: source.sourceFileSha256,
  };
}

function assertSameIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) {
    throw new Error(`${label} identity mismatch; source, corpus, or experiment settings changed`);
  }
}

function resultPaths(output, openingId) {
  return {
    block: path.join(output, "blocks", `${openingId}.json`),
    partial: path.join(output, "partials", `${openingId}.partial.json`),
  };
}

function existingCounts(options, openings) {
  let completedBlocks = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const opening of openings) {
    const files = resultPaths(options.output, opening.openingId);
    if (fs.existsSync(files.block)) {
      const block = JSON.parse(fs.readFileSync(files.block, "utf8"));
      completedBlocks += 1;
      completedGames += block.results.length;
    } else if (fs.existsSync(files.partial)) {
      const partial = JSON.parse(fs.readFileSync(files.partial, "utf8"));
      partialGames += partial.results.length;
    }
  }
  return { completedBlocks, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, openings, identity, startedAt, current = null, status = "running") {
  const counts = existingCounts(options, openings);
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  const gamesRemaining = openings.length * options.conditionIds.length - counts.recordedGames;
  const secondsPerGame = counts.recordedGames ? elapsedSeconds / counts.recordedGames : null;
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1,
    profile: options.profile,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    identity,
    expected: {
      openings: openings.length,
      conditions: options.conditionIds.length,
      conditionIds: options.conditionIds,
      games: openings.length * options.conditionIds.length,
    },
    ...counts,
    current,
    elapsedSeconds,
    etaSeconds: secondsPerGame === null ? null : secondsPerGame * gamesRemaining,
  });
}

function loadOrCreatePartial(files, opening, conditionOrder, identity) {
  if (!fs.existsSync(files.partial)) {
    return {
      schemaVersion: 1,
      status: "partial",
      openingId: opening.openingId,
      openingStateHash: opening.openingStateHash,
      conditionOrder: conditionOrder.map(({ id }) => id),
      identity,
      results: [],
    };
  }
  const partial = JSON.parse(fs.readFileSync(files.partial, "utf8"));
  assertSameIdentity(identity, partial.identity, `Partial ${opening.openingId}`);
  if (partial.openingStateHash !== opening.openingStateHash) throw new Error(`Partial opening hash mismatch: ${opening.openingId}`);
  if (stableStringify(partial.conditionOrder) !== stableStringify(conditionOrder.map(({ id }) => id))) {
    throw new Error(`Partial condition order mismatch: ${opening.openingId}`);
  }
  return partial;
}

function validateCompleteBlock(block, opening, identity) {
  assertSameIdentity(identity, block.identity, `Block ${opening.openingId}`);
  if (block.status !== "complete" || block.openingStateHash !== opening.openingStateHash) {
    throw new Error(`Invalid complete block: ${opening.openingId}`);
  }
  const ids = block.results.map(({ conditionId }) => conditionId);
  const conditionIds = identity.conditionIds || CONDITIONS.map(({ id }) => id);
  if (ids.length !== conditionIds.length || new Set(ids).size !== conditionIds.length
    || conditionIds.some((id) => !ids.includes(id))) throw new Error(`Incomplete condition block: ${opening.openingId}`);
  if (block.results.some((result) => result.openingStateHash !== opening.openingStateHash)) {
    throw new Error(`Result opening hash mismatch: ${opening.openingId}`);
  }
}

function run(options) {
  const corpus = loadCorpus(options.corpus);
  const requested = options.count ?? PROFILE_COUNTS[options.profile];
  if (corpus.entries.length < requested) throw new Error(`Profile requires ${requested} openings; corpus has ${corpus.entries.length}`);
  const openings = corpus.entries.slice(0, requested);
  const currentSource = provenance();
  const corpusSource = corpus.manifest.provenance;
  if (!corpusSource || stableStringify(currentSource.sourceFileSha256) !== stableStringify(corpusSource.sourceFileSha256)) {
    throw new Error("Current research source does not match the source that generated the corpus");
  }
  if (currentSource.node !== corpusSource.node) {
    throw new Error(`Node.js mismatch: corpus=${corpusSource.node} current=${currentSource.node}`);
  }
  // A later commit may add the immutable corpus without changing research source files.
  // Attribute every result to the source commit recorded by that corpus.
  const source = {
    ...currentSource,
    sourceCommit: corpusSource.sourceCommit,
    sourceTreeDirty: corpusSource.sourceTreeDirty,
  };
  const identity = experimentIdentity(options, corpus, source);
  const conditions = selectedConditions(options.conditionIds);
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  if (options.status) {
    console.log(fs.existsSync(progressFile)
      ? fs.readFileSync(progressFile, "utf8")
      : JSON.stringify({ profile: options.profile, status: "not-started" }, null, 2));
    return;
  }
  if (options.force) {
    for (const opening of openings) {
      const files = resultPaths(options.output, opening.openingId);
      for (const file of Object.values(files)) if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    if (fs.existsSync(progressFile)) fs.unlinkSync(progressFile);
  }
  if (fs.existsSync(progressFile)) {
    const previous = JSON.parse(fs.readFileSync(progressFile, "utf8"));
    assertSameIdentity(identity, previous.identity, "Progress");
  }
  const startedAt = fs.existsSync(progressFile)
    ? JSON.parse(fs.readFileSync(progressFile, "utf8")).startedAt
    : new Date().toISOString();
  writeProgress(options, openings, identity, startedAt);
  for (const opening of openings) {
    const files = resultPaths(options.output, opening.openingId);
    if (fs.existsSync(files.block)) {
      validateCompleteBlock(JSON.parse(fs.readFileSync(files.block, "utf8")), opening, identity);
      continue;
    }
    const order = shuffleConditions(opening.openingId, corpus.sha256, conditions);
    const partial = loadOrCreatePartial(files, opening, order, identity);
    const completed = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const condition of order) {
      if (completed.has(condition.id) || (options.onlyCondition && options.onlyCondition !== condition.id)) continue;
      writeProgress(options, openings, identity, startedAt, { openingId: opening.openingId, conditionId: condition.id });
      const randomSeed = seedFrom(corpus.sha256, opening.openingId, condition.id, "replicate-1");
      const result = playContinuation(opening, condition, randomSeed, options);
      partial.results.push(result);
      partial.updatedAt = new Date().toISOString();
      atomicWriteJson(files.partial, partial);
      const counts = existingCounts(options, openings);
      const elapsed = (Date.now() - Date.parse(startedAt)) / 1000;
      const secondsPerGame = elapsed / Math.max(1, counts.recordedGames);
      console.log(`[progress] ${counts.recordedGames}/${openings.length * conditions.length} ${opening.openingId}/${condition.id} elapsed=${elapsed.toFixed(1)}s eta=${(secondsPerGame * (openings.length * conditions.length - counts.recordedGames)).toFixed(1)}s`);
    }
    if (partial.results.length === conditions.length) {
      const block = {
        ...partial,
        status: "complete",
        completedAt: new Date().toISOString(),
        results: [...partial.results].sort((a, b) => a.conditionId.localeCompare(b.conditionId)),
        totals: {
          southWins: partial.results.filter(({ winner }) => winner === 0).length,
          northWins: partial.results.filter(({ winner }) => winner === 1).length,
          draws: partial.results.filter(({ winner }) => winner === null).length,
        },
      };
      validateCompleteBlock(block, opening, identity);
      atomicWriteJson(files.block, block);
      fs.unlinkSync(files.partial);
    }
    writeProgress(options, openings, identity, startedAt);
  }
  const counts = existingCounts(options, openings);
  const complete = counts.completedBlocks === openings.length;
  writeProgress(options, openings, identity, startedAt, null, complete ? "complete" : "diagnostic-partial");
  console.log(JSON.stringify({ profile: options.profile, status: complete ? "complete" : "diagnostic-partial", ...counts }, null, 2));
}

function main() {
  run(parseArgs(process.argv.slice(2)));
}

if (require.main === module) main();

module.exports = {
  PROFILE_COUNTS,
  assertSameIdentity,
  experimentIdentity,
  existingCounts,
  loadCorpus,
  parseArgs,
  resultPaths,
  run,
  selectedConditions,
  shuffleConditions,
  validateCompleteBlock,
};
