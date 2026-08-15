#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
  stableStringify,
} = require("./lib/position-typology-features.js");
const C = require("./lib/tactical-motif-stage2-corpus.js");

function sameSearch(actual, stored) {
  for (const key of [
    "completedDepth",
    "nodes",
    "quiescenceNodes",
    "cutoffs",
    "evaluations",
    "rootScore",
    "timedOut",
  ]) {
    if (actual?.[key] !== stored?.[key]) {
      throw new Error(`Stage 2 generation-search diagnostic mismatch: ${key}`);
    }
  }
}

function verifyGame(record, gameIndex, spec, specSha256, candidateSha256) {
  if (record.stageId !== spec.stageId
    || record.specSha256 !== specSha256
    || record.candidateDefinitionSha256 !== candidateSha256
    || record.gameIndex !== gameIndex
    || record.formalExperiment !== true
    || record.stage1FormalObservationReuseAllowed !== false) {
    throw new Error(`Stage 2 game identity/binding mismatch: ${gameIndex}`);
  }

  const seed = spec.population.seedStart + gameIndex;
  const condition = C.conditionForGame(spec, gameIndex);
  if (record.seed !== seed || record.conditionId !== condition.id) {
    throw new Error(`Stage 2 seed/condition mismatch: ${gameIndex}`);
  }

  const random = seededRandom(seed);
  let state = E.initialState();
  const observations = [];

  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId: record.gameId,
      conditionId: condition.id,
      seed,
      ply,
    });
    observations.push(observation);
    const storedObservation = record.observations[observations.length - 1];
    if (!storedObservation || stableStringify(observation) !== stableStringify(storedObservation)) {
      throw new Error(`Stage 2 observation mismatch game ${gameIndex} ply ${ply}`);
    }
    if (state.winner !== null || ply === spec.population.maxPly) break;

    const storedMove = record.moves[ply];
    if (!storedMove || storedMove.ply !== ply) {
      throw new Error(`Stage 2 missing move game ${gameIndex} ply ${ply}`);
    }

    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
      if (storedMove.source !== "opening-random") {
        throw new Error(`Stage 2 opening source mismatch game ${gameIndex} ply ${ply}`);
      }
    } else {
      const result = C.aiMove(state, condition, random);
      move = result.move;
      const search = {
        completedDepth: result.stats.completedDepth,
        nodes: result.stats.nodes,
        quiescenceNodes: result.stats.quiescenceNodes,
        cutoffs: result.stats.cutoffs,
        evaluations: result.stats.evaluations,
        rootScore: result.stats.rootScore,
        timedOut: result.stats.timedOut,
      };
      if (storedMove.source !== "trajectory-ai") {
        throw new Error(`Stage 2 AI source mismatch game ${gameIndex} ply ${ply}`);
      }
      sameSearch(search, storedMove.generationSearch);
    }

    if (AI.moveKey(move) !== storedMove.moveKey
      || stableStringify(move) !== stableStringify(storedMove.move)) {
      throw new Error(`Stage 2 move mismatch game ${gameIndex} ply ${ply}`);
    }
    if (storedMove.beforeHistoricalStateHash !== observation.identity.historicalStateHash
      || storedMove.beforeRuleStateKey !== observation.identity.ruleStateKey) {
      throw new Error(`Stage 2 before-state identity mismatch game ${gameIndex} ply ${ply}`);
    }

    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    if (storedMove.afterHistoricalStateHash !== after.historicalStateHash
      || storedMove.afterRuleStateKey !== after.ruleStateKey) {
      throw new Error(`Stage 2 after-state identity mismatch game ${gameIndex} ply ${ply}`);
    }
    state = applied.state;
  }

  const historicalTrajectoryHash = hashValue(observations.map((row) => row.identity.historicalStateHash));
  const ruleTrajectoryHash = hashValue(observations.map((row) => row.identity.ruleStateKey));
  const openingPrefix = C.openingPrefixIdentity(record.moves, spec);
  if (historicalTrajectoryHash !== record.historicalTrajectoryHash
    || ruleTrajectoryHash !== record.ruleTrajectoryHash
    || stableStringify(openingPrefix) !== stableStringify(record.openingPrefix)) {
    throw new Error(`Stage 2 trajectory/opening hash mismatch game ${gameIndex}`);
  }
  if (record.plies !== record.moves.length || record.observations.length !== observations.length) {
    throw new Error(`Stage 2 length mismatch game ${gameIndex}`);
  }

  return {
    gameIndex,
    seed,
    conditionId: condition.id,
    historicalTrajectoryHash,
    ruleTrajectoryHash,
    openingPrefixHash: openingPrefix.hash,
    plies: record.plies,
  };
}

function parseArgs(argv) {
  const options = { output: C.DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") {
      options.output = path.resolve(argv[++i]);
      continue;
    }
    throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  const { candidateSha256 } = C.loadCandidates();
  const auth = C.loadAuthorization(specSha256, candidateSha256);
  const manifest = C.readJson(path.join(options.output, "manifest.json"));
  if (manifest.stageId !== spec.stageId
    || manifest.specSha256 !== specSha256
    || manifest.candidateDefinitionSha256 !== candidateSha256
    || manifest.authorizationSha256 !== auth.authorizationSha256
    || manifest.summary.games !== spec.population.games
    || manifest.formalExperiment !== true
    || manifest.scientificInferenceAuthorized !== true) {
    throw new Error("Stage 2 manifest/spec/authorization mismatch");
  }

  const verified = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const file = C.gamePath(options.output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game ${index}`);
    verified.push(verifyGame(C.readJson(file), index, spec, specSha256, candidateSha256));
    console.error(`[tm stage2 verify] ${index + 1}/${spec.population.games}`);
  }

  const conditionCounts = verified.reduce((counts, row) => {
    counts[row.conditionId] = (counts[row.conditionId] || 0) + 1;
    return counts;
  }, {});
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    passed: true,
    fullSearchRecomputation: true,
    gamesVerified: verified.length,
    uniqueHistoricalTrajectories: new Set(verified.map((row) => row.historicalTrajectoryHash)).size,
    distinctOpeningPrefixes: new Set(verified.map((row) => row.openingPrefixHash)).size,
    conditionCounts,
    verificationIdentityHash: hashValue(verified),
    verifiedAt: new Date().toISOString(),
    provenance: C.provenance(),
  };
  C.writeJson(path.join(options.output, "verification.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  parseArgs,
  sameSearch,
  verifyGame,
};
