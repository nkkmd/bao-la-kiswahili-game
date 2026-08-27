#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const { extractPositionTypologyObservation, hashValue, identityKeys } = require("./lib/position-typology-features.js");
const Raw = require("./lib/ssgtc-representation-production.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_DIR = "doc/position-evaluation-empirical-outcome-calibration-replication";
const SPEC_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_2_FORMAL_SPEC.json");
const MAPPING_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_1_FROZEN_MAPPING.json");
const UNIVERSE_MANIFEST_PATH = path.join(ROOT, STUDY_DIR, "results/STAGE_1_REFERENCE_UNIVERSE_MANIFEST.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage2-formal-v1");
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function loadSpec() { const text = fs.readFileSync(SPEC_PATH, "utf8"); return { spec: JSON.parse(text), specSha256: sha256(text) }; }
function observationFor(state, context) { Raw.assertStudyState(state); const o = extractPositionTypologyObservation(state, context); o.identity.rawStateKey = Raw.stateKey(state); return o; }
function replay(spec, specSha256, index) {
  const seed = spec.population.seedStart + index;
  const random = seededRandom(seed);
  const gameId = `peocr-s2-${String(index).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = []; const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = observationFor(state, { gameId, conditionId: "P2-D2", seed, ply }); observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state); if (!legal.length) throw new Error(`Verifier no opening move index=${index} ply=${ply}`);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      const g = spec.population.continuation;
      const result = AI.analyzeMove(state, g.level, random, {
        evaluationProfile: g.evaluationProfile, searchProfile: g.searchProfile, maxDepth: g.maxDepth,
        timeLimitMs: Infinity, quiescenceDepth: g.quiescenceDepth, orderQuiescenceCaptures: g.orderQuiescenceCaptures,
        adaptive: g.adaptive, stableBestDepths: g.stableBestDepths, aspirationWindow: g.aspirationWindow,
      });
      if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) throw new Error(`Verifier incomplete D2 index=${index} ply=${ply}`);
      move = result.move;
    }
    if (!move) throw new Error(`Verifier no move index=${index} ply=${ply}`);
    const applied = E.applyMove(state, move); Raw.assertStudyState(applied.state); const after = identityKeys(applied.state);
    moves.push({ ply, player: state.player, moveKey: AI.moveKey(move), beforeHistoricalStateHash: observation.identity.historicalStateHash,
      beforeRawStateKey: observation.identity.rawStateKey, afterHistoricalStateHash: after.historicalStateHash, afterRawStateKey: Raw.stateKey(applied.state) });
    state = applied.state;
  }
  const prefixKeys = moves.slice(0, spec.population.opening.plies).map((row) => row.moveKey);
  return { gameId, seed, specSha256, observations, moves,
    openingPrefixHash: hashValue({ length: prefixKeys.length, moveKeys: prefixKeys }),
    historicalTrajectoryHash: hashValue(observations.map((row) => row.identity.historicalStateHash)),
    rawTrajectoryHash: hashValue(observations.map((row) => row.identity.rawStateKey)),
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-ply" : "") };
}
function sameGame(stored, replayed) {
  return JSON.stringify({
    gameId: stored.gameId, seed: stored.seed, historicalTrajectoryHash: stored.historicalTrajectoryHash,
    rawTrajectoryHash: stored.rawTrajectoryHash, openingPrefixHash: stored.openingPrefix.hash, winner: stored.winner, reason: stored.reason,
    historicalStates: stored.observations.map((r) => r.identity.historicalStateHash), rawStates: stored.observations.map((r) => r.identity.rawStateKey),
    moves: stored.moves.map((r) => r.moveKey),
  }) === JSON.stringify({
    gameId: replayed.gameId, seed: replayed.seed, historicalTrajectoryHash: replayed.historicalTrajectoryHash,
    rawTrajectoryHash: replayed.rawTrajectoryHash, openingPrefixHash: replayed.openingPrefixHash, winner: replayed.winner, reason: replayed.reason,
    historicalStates: replayed.observations.map((r) => r.identity.historicalStateHash), rawStates: replayed.observations.map((r) => r.identity.rawStateKey),
    moves: replayed.moves.map((r) => r.moveKey),
  });
}
function buildReference(stage1Output) {
  const manifest = readJson(UNIVERSE_MANIFEST_PATH);
  const trajectoryHashes = new Set(); const openingPrefixHashes = new Set(); const rawStateKeys = new Set(); let observations = 0;
  for (let index = 0; index < manifest.sourcePopulation.games; index += 1) {
    const game = readJson(path.join(stage1Output, "games", `game-${String(index).padStart(4, "0")}.json`));
    trajectoryHashes.add(game.historicalTrajectoryHash); openingPrefixHashes.add(game.openingPrefix.hash);
    for (const observation of game.observations) { rawStateKeys.add(observation.identity.rawStateKey); observations += 1; }
  }
  const canonical = `${JSON.stringify({ historicalTrajectoryHash: [...trajectoryHashes].sort(), openingPrefixHash: [...openingPrefixHashes].sort(), rawStateKey: [...rawStateKeys].sort() })}\n`;
  if (sha256(canonical) !== manifest.canonicalSerialization.sha256 || trajectoryHashes.size !== 1602 || openingPrefixHashes.size !== 1604
    || rawStateKeys.size !== 76010 || observations !== 113642) throw new Error("Independent Stage 1 reference reconstruction mismatch");
  return { trajectoryHashes, openingPrefixHashes, rawStateKeys, universeSha256: sha256(canonical) };
}
function representatives(games) {
  const groups = new Map(); for (const game of games) { const a = groups.get(game.historicalTrajectoryHash) || []; a.push(game); groups.set(game.historicalTrajectoryHash, a); }
  return [...groups.values()].map((a) => a.sort((x, y) => x.seed - y.seed || x.gameId.localeCompare(y.gameId))[0])
    .sort((a, b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}
function assignedPhase(hash, spec) { const d = sha256(`${spec.stateSelection.phaseAssignment.salt}|${hash}`); return Number(BigInt(`0x${d}`) % 2n) === 0 ? "namua" : "mtaji"; }
function rank(game, observation, spec) { return sha256(`${spec.stateSelection.withinAssignedPhase.salt}|${game.historicalTrajectoryHash}|${observation.identity.rawStateKey}|${observation.ply}`); }
function select(games, spec, reference) {
  const reps = representatives(games); const trajectoryEligible = []; let trajectoryExcluded = 0; let openingExcluded = 0;
  for (const game of reps) {
    if (reference.trajectoryHashes.has(game.historicalTrajectoryHash)) { trajectoryExcluded += 1; continue; }
    if (reference.openingPrefixHashes.has(game.openingPrefix.hash)) { openingExcluded += 1; continue; }
    trajectoryEligible.push(game);
  }
  const provisional = []; let rawExcluded = 0; let unavailable = 0;
  for (const game of trajectoryEligible) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = [];
    for (const o of game.observations.filter((x) => x.ply >= spec.stateSelection.minimumPly && !x.terminal && x.phase === phase)) {
      if (reference.rawStateKeys.has(o.identity.rawStateKey)) rawExcluded += 1; else eligible.push(o);
    }
    if (!eligible.length) { unavailable += 1; continue; }
    const chosen = eligible.map((o) => ({ o, r: rank(game, o, spec) })).sort((a, b) => a.r.localeCompare(b.r))[0];
    provisional.push({ game, phase, observation: chosen.o, selectionRank: chosen.r });
  }
  const byRaw = new Map(); for (const row of provisional) { const a = byRaw.get(row.observation.identity.rawStateKey) || []; a.push(row); byRaw.set(row.observation.identity.rawStateKey, a); }
  const selected = [...byRaw.values()].map((a) => a.sort((x, y) => x.game.historicalTrajectoryHash.localeCompare(y.game.historicalTrajectoryHash) || x.game.seed - y.game.seed)[0])
    .sort((a, b) => a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return { reps, trajectoryEligible, provisional, selected, trajectoryExcluded, openingExcluded, rawExcluded, unavailable, duplicateCollapsed: provisional.length - selected.length };
}
function stateFromObservation(o) { const s = { pits: o.state.pits.map((rows) => rows.map((row) => row.slice())), reserve: [...o.state.reserve], houseOwned: [...o.state.houseOwned], player: o.player, phase: o.phase, winner: o.winner, reason: o.reason || "", turn: o.turn, pending: [...o.state.pending] }; Raw.assertStudyState(s); return s; }
function predict(mapping, phase, score) {
  const fit = mapping.phaseFits[phase]; const z = score / 100; let p;
  if (z < fit.blocks[0].minZ) p = fit.blocks[0].mean; else { let chosen = fit.blocks[0]; for (const block of fit.blocks) { if (block.minZ <= z) chosen = block; else break; } p = chosen.mean; }
  return Math.min(mapping.formalPredictionClipping.upper, Math.max(mapping.formalPredictionClipping.lower, p));
}
function expectedMeasurement(row, spec, mapping) {
  const state = stateFromObservation(row.observation); const actor = state.player; const score = AI.evaluate(state, actor); const truncated = row.game.winner === null;
  return { historicalTrajectoryHash: row.game.historicalTrajectoryHash, rawStateKey: row.observation.identity.rawStateKey,
    openingPrefixHash: row.game.openingPrefix.hash, ply: row.observation.ply, phase: row.phase, actorSeat: actor,
    selectionRank: row.selectionRank, staticBaoEvaluation: score, modelPrediction: predict(mapping, row.phase, score),
    referencePrediction: mapping.phaseOnlyReference[row.phase].actorWinRate, finalWinner: row.game.winner,
    administrativeTruncation: truncated, actorWin: truncated ? null : row.game.winner === actor ? 1 : 0 };
}
function parseArgs(argv) {
  const o = { mode: "games", output: DEFAULT_OUTPUT, stage1Output: null, startIndex: 0, count: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--mode") o.mode = argv[++i]; else if (argv[i] === "--output") o.output = path.resolve(argv[++i]);
    else if (argv[i] === "--stage1-output") o.stage1Output = path.resolve(argv[++i]); else if (argv[i] === "--start-index") o.startIndex = Number(argv[++i]);
    else if (argv[i] === "--count") o.count = Number(argv[++i]); else throw new Error(`Unknown arg ${argv[i]}`);
  }
  return o;
}
function verifyGames(options, loaded) {
  const { spec, specSha256 } = loaded; const n = options.count === null ? spec.population.games - options.startIndex : options.count; let mismatches = 0;
  for (let offset = 0; offset < n; offset += 1) {
    const index = options.startIndex + offset; const file = path.join(options.output, "games", `game-${String(index).padStart(4, "0")}.json`);
    if (!fs.existsSync(file) || !sameGame(readJson(file), replay(spec, specSha256, index))) mismatches += 1;
    if ((offset + 1) % 64 === 0 || offset + 1 === n) process.stderr.write(`[stage2-verify-games] ${offset + 1}/${n} global-index=${index}\n`);
  }
  const result = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, specSha256, mode: "games", passed: mismatches === 0,
    startIndex: options.startIndex, count: n, gameReplayMismatches: mismatches };
  writeJson(path.join(options.output, `verification-games-${String(options.startIndex).padStart(4, "0")}-${String(options.startIndex + n - 1).padStart(4, "0")}.json`), result);
  if (!result.passed) throw new Error(`Stage 2 game replay mismatches: ${mismatches}`); return result;
}
function verifySelection(options, loaded) {
  if (!options.stage1Output) throw new Error("--stage1-output required for selection verification");
  const { spec, specSha256 } = loaded; const reference = buildReference(options.stage1Output); const mappingText = fs.readFileSync(MAPPING_PATH, "utf8"); const mapping = JSON.parse(mappingText);
  if (sha256(mappingText) !== "b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac") throw new Error("Frozen mapping hash mismatch");
  const games = Array.from({ length: spec.population.games }, (_, i) => readJson(path.join(options.output, "games", `game-${String(i).padStart(4, "0")}.json`)));
  const selected = select(games, spec, reference); const summary = readJson(path.join(options.output, "stage2-selection-measurement-summary.json"));
  const files = fs.readdirSync(path.join(options.output, "measurements")).filter((n) => /^selected-\d{4}\.json$/.test(n)).sort();
  if (files.length !== selected.selected.length) throw new Error("Measurement count mismatch");
  let measurementMismatches = 0; const measurements = [];
  selected.selected.forEach((row, index) => {
    const stored = readJson(path.join(options.output, "measurements", files[index])); const expected = expectedMeasurement(row, spec, mapping);
    for (const [key, value] of Object.entries(expected)) if (stored[key] !== value) measurementMismatches += 1;
    measurements.push(stored);
  });
  const measurementHash = sha256(JSON.stringify(measurements));
  const selectionHash = sha256(JSON.stringify(measurements.map((row) => ({ historicalTrajectoryHash: row.historicalTrajectoryHash, rawStateKey: row.rawStateKey, ply: row.ply, phase: row.phase, openingPrefixHash: row.openingPrefixHash }))));
  const overlap = { historicalTrajectoryHash: measurements.filter((r) => reference.trajectoryHashes.has(r.historicalTrajectoryHash)).length,
    openingPrefixHash: measurements.filter((r) => reference.openingPrefixHashes.has(r.openingPrefixHash)).length,
    rawStateKey: measurements.filter((r) => reference.rawStateKeys.has(r.rawStateKey)).length };
  const result = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, specSha256, mode: "selection", passed: measurementMismatches === 0
      && measurementHash === summary.measurementHash && selectionHash === summary.selectionHash && Object.values(overlap).every((x) => x === 0),
    measurementMismatches, selectedUniqueRawStates: selected.selected.length, measurementHash, storedMeasurementHash: summary.measurementHash,
    measurementHashMatches: measurementHash === summary.measurementHash, selectionHash, storedSelectionHash: summary.selectionHash,
    selectionHashMatches: selectionHash === summary.selectionHash, stage1HistoricalTrajectoryOverlap: overlap.historicalTrajectoryHash,
    stage1OpeningPrefixOverlap: overlap.openingPrefixHash, stage1RawStateOverlap: overlap.rawStateKey,
    stage1ReferenceUniverseSha256: reference.universeSha256 };
  writeJson(path.join(options.output, "verification.json"), result); if (!result.passed) throw new Error("Stage 2 independent selection verification failed"); return result;
}
function main() { const options = parseArgs(process.argv.slice(2)); const loaded = loadSpec(); const result = options.mode === "games" ? verifyGames(options, loaded) : options.mode === "selection" ? verifySelection(options, loaded) : (() => { throw new Error("--mode must be games or selection"); })(); console.log(JSON.stringify(result, null, 2)); }
if (require.main === module) main();
module.exports = { buildReference, replay, select, verifyGames, verifySelection };
