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
const C = require("./lib/tactical-motif-stage1-corpus.js");

function sameSearch(a, b) {
  for (const key of ["completedDepth", "nodes", "quiescenceNodes", "cutoffs", "evaluations", "rootScore", "timedOut"]) {
    if (a?.[key] !== b?.[key]) throw new Error(`Search diagnostic mismatch: ${key}`);
  }
}
function verifyGame(record, gameIndex, spec, specSha256, recomputeSearch = true) {
  if (record.specSha256 !== specSha256 || record.gameIndex !== gameIndex) throw new Error(`Game identity mismatch: ${gameIndex}`);
  const seed = spec.population.seedStart + gameIndex;
  const condition = C.conditionForGame(spec, gameIndex);
  if (record.seed !== seed || record.conditionId !== condition.id) throw new Error(`Seed/condition mismatch: ${gameIndex}`);
  const random = seededRandom(seed); let state = E.initialState(); const observations = []; const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const obs = extractPositionTypologyObservation(state, { gameId: record.gameId, conditionId: condition.id, seed, ply });
    observations.push(obs);
    const storedObs = record.observations[observations.length - 1];
    if (!storedObs || stableStringify(obs) !== stableStringify(storedObs)) throw new Error(`Observation mismatch game ${gameIndex} ply ${ply}`);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    const stored = record.moves[moves.length]; if (!stored || stored.ply !== ply) throw new Error(`Missing move game ${gameIndex} ply ${ply}`);
    let move; let search = null;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state); move = legal[Math.floor(random() * legal.length)];
      if (stored.source !== "opening-random") throw new Error(`Opening source mismatch game ${gameIndex} ply ${ply}`);
    } else if (recomputeSearch) {
      const result = C.aiMove(state, condition, random); move = result.move;
      search = { completedDepth: result.stats.completedDepth, nodes: result.stats.nodes, quiescenceNodes: result.stats.quiescenceNodes, cutoffs: result.stats.cutoffs, evaluations: result.stats.evaluations, rootScore: result.stats.rootScore, timedOut: result.stats.timedOut };
      if (stored.source !== "trajectory-ai") throw new Error(`AI source mismatch game ${gameIndex} ply ${ply}`);
      sameSearch(search, stored.generationSearch);
    } else {
      const legal = E.moveVariants(state); move = legal.find((m) => AI.moveKey(m) === stored.moveKey);
      if (!move) throw new Error(`Stored move not legal game ${gameIndex} ply ${ply}`);
    }
    if (AI.moveKey(move) !== stored.moveKey || stableStringify(move) !== stableStringify(stored.move)) throw new Error(`Move mismatch game ${gameIndex} ply ${ply}`);
    if (stored.beforeHistoricalStateHash !== obs.identity.historicalStateHash || stored.beforeRuleStateKey !== obs.identity.ruleStateKey) throw new Error(`Before identity mismatch game ${gameIndex} ply ${ply}`);
    const applied = E.applyMove(state, move); const after = identityKeys(applied.state);
    if (stored.afterHistoricalStateHash !== after.historicalStateHash || stored.afterRuleStateKey !== after.ruleStateKey) throw new Error(`After identity mismatch game ${gameIndex} ply ${ply}`);
    moves.push({ moveKey: stored.moveKey }); state = applied.state;
  }
  const historicalTrajectoryHash = hashValue(observations.map((o) => o.identity.historicalStateHash));
  const ruleTrajectoryHash = hashValue(observations.map((o) => o.identity.ruleStateKey));
  const openingPrefix = C.openingPrefixIdentity(record.moves, spec);
  if (historicalTrajectoryHash !== record.historicalTrajectoryHash || ruleTrajectoryHash !== record.ruleTrajectoryHash || stableStringify(openingPrefix) !== stableStringify(record.openingPrefix)) throw new Error(`Trajectory/opening hash mismatch game ${gameIndex}`);
  if (record.plies !== record.moves.length || record.observations.length !== observations.length) throw new Error(`Length mismatch game ${gameIndex}`);
  return { gameIndex, seed, conditionId: condition.id, historicalTrajectoryHash, ruleTrajectoryHash, openingPrefixHash: openingPrefix.hash, plies: record.plies };
}
function parseArgs(argv) {
  const o = { output: C.DEFAULT_OUTPUT, recomputeSearch: true };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--no-search-recompute") { o.recomputeSearch = false; continue; }
    if (argv[i] === "--output") { o.output = path.resolve(argv[++i]); continue; }
    throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return o;
}
function main() {
  const o = parseArgs(process.argv.slice(2)); const { spec, specSha256 } = C.loadSpec(); C.loadAuthorization(specSha256);
  const manifest = C.readJson(path.join(o.output, "manifest.json"));
  if (manifest.specSha256 !== specSha256 || manifest.summary.games !== spec.population.games) throw new Error("Manifest/spec mismatch");
  const verified = [];
  for (let i = 0; i < spec.population.games; i += 1) {
    const file = C.gamePath(o.output, i); if (!fs.existsSync(file)) throw new Error(`Missing game ${i}`);
    verified.push(verifyGame(C.readJson(file), i, spec, specSha256, o.recomputeSearch));
    console.error(`[tm stage1 verify] ${i + 1}/${spec.population.games}`);
  }
  const result = {
    schemaVersion: 1, stageId: spec.stageId, specSha256, passed: true,
    fullSearchRecomputation: o.recomputeSearch, gamesVerified: verified.length,
    uniqueHistoricalTrajectories: new Set(verified.map((x) => x.historicalTrajectoryHash)).size,
    distinctOpeningPrefixes: new Set(verified.map((x) => x.openingPrefixHash)).size,
    verificationIdentityHash: hashValue(verified), verifiedAt: new Date().toISOString(),
    provenance: C.provenance(),
  };
  C.writeJson(path.join(o.output, "verification.json"), result); console.log(JSON.stringify(result, null, 2));
}
if (require.main === module) main();
module.exports = { parseArgs, sameSearch, verifyGame };
