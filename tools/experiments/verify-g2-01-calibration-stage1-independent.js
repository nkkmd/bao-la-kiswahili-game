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
const SPEC_PATH = path.join(ROOT, STUDY_DIR, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage1-development-v1");
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function loadSpec() { const text = fs.readFileSync(SPEC_PATH, "utf8"); return { spec: JSON.parse(text), specSha256: sha256(text) }; }
function observationFor(state, context) { Raw.assertStudyState(state); const o = extractPositionTypologyObservation(state, context); o.identity.rawStateKey = Raw.stateKey(state); return o; }
function replay(spec, specSha256, index) {
  const seed = spec.population.seedStart + index;
  const random = seededRandom(seed);
  const gameId = `peocr-s1-${String(index).padStart(4, "0")}`;
  let state = E.initialState();
  const observations = [];
  const moves = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = observationFor(state, { gameId, conditionId: "P2-D2", seed, ply });
    observations.push(observation);
    if (state.winner !== null || ply === spec.population.maxPly) break;
    let move;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      if (!legal.length) throw new Error(`Verifier no legal opening move game=${index} ply=${ply}`);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      const g = spec.population.continuation;
      const result = AI.analyzeMove(state, g.level, random, {
        evaluationProfile: g.evaluationProfile, searchProfile: g.searchProfile, maxDepth: g.maxDepth,
        timeLimitMs: Infinity, quiescenceDepth: g.quiescenceDepth,
        orderQuiescenceCaptures: g.orderQuiescenceCaptures, adaptive: g.adaptive,
        stableBestDepths: g.stableBestDepths, aspirationWindow: g.aspirationWindow,
      });
      if (result.stats.timedOut || result.stats.completedDepth !== g.maxDepth) throw new Error(`Verifier incomplete D2 game=${index} ply=${ply}`);
      move = result.move;
    }
    if (!move) throw new Error(`Verifier found no move game=${index} ply=${ply}`);
    const applied = E.applyMove(state, move); Raw.assertStudyState(applied.state);
    const after = identityKeys(applied.state);
    moves.push({ ply, player: state.player, moveKey: AI.moveKey(move),
      beforeHistoricalStateHash: observation.identity.historicalStateHash,
      beforeRawStateKey: observation.identity.rawStateKey,
      afterHistoricalStateHash: after.historicalStateHash,
      afterRawStateKey: Raw.stateKey(applied.state) });
    state = applied.state;
  }
  const prefixKeys = moves.slice(0, spec.population.opening.plies).map((row) => row.moveKey);
  return {
    gameId, seed, specSha256, observations, moves,
    openingPrefixHash: hashValue({ length: prefixKeys.length, moveKeys: prefixKeys }),
    historicalTrajectoryHash: hashValue(observations.map((row) => row.identity.historicalStateHash)),
    rawTrajectoryHash: hashValue(observations.map((row) => row.identity.rawStateKey)),
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-ply" : ""),
  };
}
function sameStoredGame(stored, replayed) {
  const a = {
    gameId: stored.gameId, seed: stored.seed, historicalTrajectoryHash: stored.historicalTrajectoryHash,
    rawTrajectoryHash: stored.rawTrajectoryHash, openingPrefixHash: stored.openingPrefix.hash,
    winner: stored.winner, reason: stored.reason,
    historicalStates: stored.observations.map((r) => r.identity.historicalStateHash),
    rawStates: stored.observations.map((r) => r.identity.rawStateKey),
    moves: stored.moves.map((r) => r.moveKey),
  };
  const b = {
    gameId: replayed.gameId, seed: replayed.seed, historicalTrajectoryHash: replayed.historicalTrajectoryHash,
    rawTrajectoryHash: replayed.rawTrajectoryHash, openingPrefixHash: replayed.openingPrefixHash,
    winner: replayed.winner, reason: replayed.reason,
    historicalStates: replayed.observations.map((r) => r.identity.historicalStateHash),
    rawStates: replayed.observations.map((r) => r.identity.rawStateKey),
    moves: replayed.moves.map((r) => r.moveKey),
  };
  return JSON.stringify(a) === JSON.stringify(b);
}
function representativeGames(games) {
  const groups = new Map();
  for (const game of games) { const list = groups.get(game.historicalTrajectoryHash) || []; list.push(game); groups.set(game.historicalTrajectoryHash, list); }
  return [...groups.values()].map((list) => list.sort((a,b) => a.seed-b.seed || a.gameId.localeCompare(b.gameId))[0])
    .sort((a,b) => a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
}
function assignedPhase(hash, spec) {
  const digest = sha256(`${spec.stateSelection.phaseAssignment.salt}|${hash}`);
  return Number(BigInt(`0x${digest}`) % 2n) === 0 ? spec.stateSelection.phaseAssignment.mapping.even : spec.stateSelection.phaseAssignment.mapping.odd;
}
function rank(game, observation, spec) { return sha256(`${spec.stateSelection.withinAssignedPhase.salt}|${game.historicalTrajectoryHash}|${observation.identity.rawStateKey}|${observation.ply}`); }
function selectStates(games, spec) {
  const representatives = representativeGames(games); const provisional = []; let unavailableAssignedPhase = 0;
  for (const game of representatives) {
    const phase = assignedPhase(game.historicalTrajectoryHash, spec);
    const eligible = game.observations.filter((o) => o.ply >= spec.stateSelection.minimumPly && o.terminal === false && o.phase === phase);
    if (!eligible.length) { unavailableAssignedPhase += 1; continue; }
    const selected = eligible.map((o) => ({ observation:o, rank:rank(game,o,spec) })).sort((a,b)=>a.rank.localeCompare(b.rank))[0];
    provisional.push({ game, phase, observation:selected.observation, selectionRank:selected.rank });
  }
  provisional.sort((a,b)=>a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash)||a.game.seed-b.game.seed);
  const byRaw = new Map();
  for (const row of provisional) { const key=row.observation.identity.rawStateKey; const list=byRaw.get(key)||[]; list.push(row); byRaw.set(key,list); }
  const selected = [...byRaw.values()].map((list)=>list.sort((a,b)=>a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash)||a.game.seed-b.game.seed)[0]);
  selected.sort((a,b)=>a.game.historicalTrajectoryHash.localeCompare(b.game.historicalTrajectoryHash));
  return { representatives, provisional, selected, unavailableAssignedPhase, duplicateSelectedRawStatesCollapsed: provisional.length-selected.length };
}
function stateFromObservation(o) {
  const s={ pits:o.state.pits.map((rows)=>rows.map((row)=>row.slice())), reserve:[...o.state.reserve], houseOwned:[...o.state.houseOwned],
    player:o.player, phase:o.phase, winner:o.winner, reason:o.reason||"", turn:o.turn, pending:[...o.state.pending] };
  Raw.assertStudyState(s); return s;
}
function main() {
  const output = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUTPUT;
  const { spec, specSha256 } = loadSpec();
  const games = Array.from({length:spec.population.games},(_,i)=>readJson(path.join(output,"games",`game-${String(i).padStart(4,"0")}.json`)));
  let gameReplayMismatches = 0;
  for (let i=0;i<games.length;i+=1) {
    if (!sameStoredGame(games[i], replay(spec,specSha256,i))) gameReplayMismatches += 1;
    if ((i+1)%64===0 || i+1===games.length) process.stderr.write(`[verify-games] ${i+1}/${games.length}\n`);
  }
  if (gameReplayMismatches) throw new Error(`Game replay mismatches: ${gameReplayMismatches}`);
  const selection = selectStates(games,spec);
  const summary = readJson(path.join(output,"stage1-selection-measurement-summary.json"));
  const files = fs.readdirSync(path.join(output,"measurements")).filter((n)=>/^selected-\d+\.json$/.test(n)).sort();
  if (files.length !== selection.selected.length) throw new Error("Measurement file count mismatch");
  const verified=[]; let measurementMismatches=0;
  selection.selected.forEach((row,i)=>{
    const stored=readJson(path.join(output,"measurements",files[i])); const state=stateFromObservation(row.observation); const actor=state.player;
    const expected={ historicalTrajectoryHash:row.game.historicalTrajectoryHash, rawStateKey:row.observation.identity.rawStateKey,
      openingPrefixHash:row.game.openingPrefix.hash, ply:row.observation.ply, phase:row.phase, actorSeat:actor,
      selectionRank:row.selectionRank, staticBaoEvaluation:AI.evaluate(state,actor), finalWinner:row.game.winner,
      administrativeTruncation:row.game.winner===null, actorWin:row.game.winner===null?null:(row.game.winner===actor?1:0) };
    for (const [k,v] of Object.entries(expected)) if (stored[k]!==v) measurementMismatches += 1;
    verified.push(stored);
  });
  if (measurementMismatches) throw new Error(`Measurement mismatches: ${measurementMismatches}`);
  const measurementHash=sha256(JSON.stringify(verified));
  const identityRows=verified.map((row)=>({historicalTrajectoryHash:row.historicalTrajectoryHash,rawStateKey:row.rawStateKey,openingPrefixHash:row.openingPrefixHash,ply:row.ply,phase:row.phase}));
  const selectionHash=sha256(JSON.stringify(identityRows));
  const passed = summary.measurementHash===measurementHash && summary.selectionHash===selectionHash
    && summary.uniqueHistoricalTrajectories===selection.representatives.length
    && summary.selectedUniqueRawStates===selection.selected.length
    && summary.unavailableAssignedPhase===selection.unavailableAssignedPhase
    && summary.duplicateSelectedRawStatesCollapsed===selection.duplicateSelectedRawStatesCollapsed;
  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,specSha256,passed,gamesVerified:games.length,
    gameReplayMismatches,measurementMismatches,uniqueHistoricalTrajectories:selection.representatives.length,
    selectedUniqueRawStates:selection.selected.length,storedSelectionHash:summary.selectionHash,recomputedSelectionHash:selectionHash,
    selectionHashMatches:summary.selectionHash===selectionHash,storedMeasurementHash:summary.measurementHash,recomputedMeasurementHash:measurementHash,
    measurementHashMatches:summary.measurementHash===measurementHash,scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false};
  writeJson(path.join(output,"verification.json"),result);
  console.log(JSON.stringify(result,null,2)); if(!passed) process.exitCode=1;
}
try { main(); } catch(e) { console.error(e.stack||e.message); process.exitCode=1; }
