"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const P = require("./pcrpr-stage0-production.js");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sha256(text) { return crypto.createHash("sha256").update(Buffer.from(String(text), "utf8")).digest("hex"); }
function first32(text) { return Number.parseInt(sha256(text).slice(0, 8), 16) >>> 0; }
function canonicalHash(value) { return P.canonicalHash(value); }
function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function orderedSum(values) { let total = 0; for (const value of values) { ensure(Number.isFinite(value), "non-finite ordered sum"); total += value; } return total; }
function mean(values) { return values.length ? orderedSum(values) / values.length : 0; }
function populationSd(values) { if (!values.length) return 0; const m = mean(values); return Math.sqrt(orderedSum(values.map((x) => (x - m) ** 2)) / values.length); }

function conditionForGame(spec, gameIndex) {
  const strata = spec.sourcePopulation.conditionAssignment.strata;
  ensure(Array.isArray(strata) && strata.length > 0, "missing source strata");
  return strata[gameIndex % strata.length];
}

function generatorMove(state, condition, rng, common) {
  P.assertState(state, true);
  const g = condition.generator;
  const result = AI.analyzeMove(state, g.level, rng, {
    evaluationProfile: g.evaluationProfile,
    searchProfile: g.searchProfile,
    maxDepth: g.maxDepth,
    timeLimitMs: common.timeLimitMs === "Infinity" ? Infinity : common.timeLimitMs,
    quiescenceDepth: g.quiescenceDepth,
    orderQuiescenceCaptures: g.orderQuiescenceCaptures,
    adaptive: common.adaptive,
    stableBestDepths: common.stableBestDepths,
    aspirationWindow: common.aspirationWindow,
  });
  ensure(result && result.move, `generator produced no move for ${condition.id}`);
  if (result.stats) {
    ensure(result.stats.timedOut !== true, `generator timeout for ${condition.id}`);
    ensure(result.stats.completedDepth === g.maxDepth, `generator depth mismatch for ${condition.id}`);
  }
  const key = P.moveKey(result.move);
  const exact = P.exactMoves(state).find((m) => P.moveKey(m) === key);
  ensure(exact, `generator move not exact legal variant: ${key}`);
  return exact;
}

function phaseForSeed(seed, spec) {
  const cfg = spec.rootSelection.phaseAssignment;
  const parity = first32(`${cfg.salt}|${seed}`) % 2;
  return parity === 0 ? cfg.mapping.even : cfg.mapping.odd;
}
function rootRank(seed, rawStateKey, ply, spec) {
  const cfg = spec.rootSelection.withinAssignedPhase;
  return sha256(`${cfg.salt}|${seed}|${rawStateKey}|${ply}`);
}
function quotaRank(candidate, spec) {
  const cfg = spec.rootSelection.phaseQuota;
  return sha256(`${cfg.salt}|${candidate.phase}|${candidate.historicalTrajectoryHash}|${candidate.rawStateKey}|${candidate.seed}`);
}
function trajectoryHash(rawStateKeys, moveKeys) { return canonicalHash({ length: rawStateKeys.length, rawStateKeys, moveKeys }); }
function openingHash(moveKeys, plies) { const prefix = moveKeys.slice(0, plies); return canonicalHash({ length: prefix.length, moveKeys: prefix }); }
function historyHash(history) {
  return canonicalHash(history.map((h) => ({ before:P.rawKey(h.before), moveKey:P.moveKey(h.move), after:P.rawKey(h.after) })));
}

function runGame(spec, gameIndex, options = {}) {
  const seedStart = options.seedStart ?? spec.sourcePopulation.seedStart;
  const seed = seedStart + gameIndex;
  const rng = seededRandom(seed >>> 0);
  const condition = conditionForGame(spec, gameIndex);
  const assignedPhase = phaseForSeed(seed, spec);
  const maxPly = options.maxPly ?? spec.sourcePopulation.maxObservedPly;
  const openingPlies = spec.sourcePopulation.opening.plies;
  let state = E.initialState();
  P.assertState(state, true);
  const rawStateKeys = [];
  const moveKeys = [];
  const recentHistory = [];
  let candidate = null;
  let finalPly = 0;

  for (let ply = 0; ply <= maxPly; ply += 1) {
    finalPly = ply;
    P.assertState(state);
    const rawStateKey = P.rawKey(state);
    rawStateKeys.push(rawStateKey);
    const legal = state.winner === null ? P.exactMoves(state) : [];
    const eligible = state.winner === null
      && ply >= spec.rootSelection.minimumPly
      && legal.length >= spec.rootSelection.minimumLegalMoveCount
      && state.phase === assignedPhase;
    if (eligible) {
      const rank = rootRank(seed, rawStateKey, ply, spec);
      if (!candidate || cmp(rank, candidate.selectionRank) < 0 || (rank === candidate.selectionRank && cmp(rawStateKey, candidate.rawStateKey) < 0)) {
        candidate = {
          gameIndex, seed, generationStratum:condition.id, phase:assignedPhase, ply,
          legalMoveCount:legal.length, rawStateKey, selectionRank:rank, root:clone(state),
          history:clone(recentHistory.slice(-spec.representation.historyWindowMoves)),
        };
      }
    }
    if (state.winner !== null || ply === maxPly) break;
    let move;
    if (ply < openingPlies) {
      ensure(legal.length > 0, "opening state has no exact legal move");
      move = legal[Math.floor(rng() * legal.length)];
    } else {
      move = generatorMove(state, condition, rng, spec.sourcePopulation.conditionAssignment.commonOptions);
    }
    const before = clone(state);
    const after = P.applyExact(state, move).state;
    recentHistory.push({ before, move:clone(move), after:clone(after) });
    while (recentHistory.length > spec.representation.historyWindowMoves) recentHistory.shift();
    moveKeys.push(P.moveKey(move));
    state = after;
  }

  const historicalTrajectoryHash = trajectoryHash(rawStateKeys, moveKeys);
  const openingPrefixHash = openingHash(moveKeys, spec.sourcePopulation.opening.plies);
  if (candidate) {
    candidate.historicalTrajectoryHash = historicalTrajectoryHash;
    candidate.openingPrefixHash = openingPrefixHash;
    candidate.rootOccurrenceHistoryHash = historyHash(candidate.history);
  }
  return {
    gameSummary: {
      gameIndex, seed, generationStratum:condition.id, assignedPhase,
      observedStates:rawStateKeys.length, plies:moveKeys.length, finalPly,
      terminal:state.winner !== null, winner:state.winner,
      historicalTrajectoryHash, openingPrefixHash,
    },
    candidate,
  };
}

function generateCorpus(spec, options = {}) {
  const games = options.games ?? spec.sourcePopulation.games;
  const records = [];
  for (let i = 0; i < games; i += 1) records.push(runGame(spec, i, options));
  return records;
}

function representativeRecords(records) {
  const groups = new Map();
  for (const record of records) {
    const key = record.gameSummary.historicalTrajectoryHash;
    const list = groups.get(key) || [];
    list.push(record); groups.set(key, list);
  }
  return [...groups.values()].map((list) => list.slice().sort((a,b)=>a.gameSummary.seed-b.gameSummary.seed||a.gameSummary.gameIndex-b.gameSummary.gameIndex)[0]);
}
function collapseRaw(items) {
  const map = new Map();
  for (const item of items) {
    const old = map.get(item.rawStateKey);
    if (!old || cmp(item.historicalTrajectoryHash, old.historicalTrajectoryHash) < 0 || (item.historicalTrajectoryHash === old.historicalTrajectoryHash && item.seed < old.seed)) map.set(item.rawStateKey, item);
  }
  return [...map.values()];
}

function selectRoots(records, spec, options = {}) {
  const reps = representativeRecords(records);
  let unavailableAssignedPhase = 0, failedReferenceDisadvantage = 0;
  const disadvantaged = [];
  for (const record of reps) {
    const candidate = record.candidate;
    if (!candidate) { unavailableAssignedPhase += 1; continue; }
    const d3 = P.searchTable(candidate.root, 3);
    if (!(d3.bestScore < 0)) { failedReferenceDisadvantage += 1; continue; }
    const item = { ...clone(candidate), referenceDisadvantageBestScore:d3.bestScore, referenceD3TableHash:canonicalHash(d3) };
    item.quotaRank = quotaRank(item, spec);
    disadvantaged.push(item);
  }
  const dedup = collapseRaw(disadvantaged);
  const selected = [], poolCounts = {}, quota = options.phaseQuota || spec.rootSelection.phaseQuota;
  for (const phase of ["namua","mtaji"]) {
    const pool = dedup.filter((x)=>x.phase===phase).sort((a,b)=>cmp(a.quotaRank,b.quotaRank)||cmp(a.historicalTrajectoryHash,b.historicalTrajectoryHash)||cmp(a.rawStateKey,b.rawStateKey)||a.seed-b.seed);
    poolCounts[phase]=pool.length; selected.push(...pool.slice(0,quota[phase]||0));
  }
  selected.sort((a,b)=>cmp(a.phase,b.phase)||cmp(a.quotaRank,b.quotaRank)||cmp(a.historicalTrajectoryHash,b.historicalTrajectoryHash)||cmp(a.rawStateKey,b.rawStateKey)||a.seed-b.seed);
  const conditionCounts={}; for(const x of selected)conditionCounts[x.generationStratum]=(conditionCounts[x.generationStratum]||0)+1;
  return {
    generatedGames:records.length,
    uniqueHistoricalTrajectories:reps.length,
    duplicateHistoricalTrajectoriesCollapsed:records.length-reps.length,
    unavailableAssignedPhase, failedReferenceDisadvantage,
    disadvantagedBeforeRawStateCollapse:disadvantaged.length,
    duplicateDisadvantagedRawStatesCollapsed:disadvantaged.length-dedup.length,
    disadvantagedPool:poolCounts,
    selectedDistinctOpeningPrefixes:new Set(selected.map((x)=>x.openingPrefixHash)).size,
    generatedDistinctOpeningPrefixes:new Set(records.map((r)=>r.gameSummary.openingPrefixHash)).size,
    conditionCounts,
    selected,
    selectionHash:canonicalHash(selected.map((x)=>({seed:x.seed,phase:x.phase,ply:x.ply,rawStateKey:x.rawStateKey,historicalTrajectoryHash:x.historicalTrajectoryHash,openingPrefixHash:x.openingPrefixHash,quotaRank:x.quotaRank,referenceDisadvantageBestScore:x.referenceDisadvantageBestScore}))),
  };
}

function rowIdentity(root, rootMoveKey, spec) {
  return sha256(`${spec.stageId}|${root.historicalTrajectoryHash}|${root.ply}|${root.rawStateKey}|${rootMoveKey}`);
}
function makeRows(selection, spec, options = {}) {
  const rows=[];
  const limitPerRoot=options.maxMovesPerRoot || Infinity;
  for(const root of selection.selected){
    const moves=P.exactMoves(root.root).slice(0,limitPerRoot);
    for(const move of moves){
      const rootMoveKey=P.moveKey(move), id=rowIdentity(root,rootMoveKey,spec);
      const representation=P.buildRepresentation({root:root.root,rootMove:move,history:root.history,searchConfigId:P.SEARCH_ID});
      rows.push({rowIdentity:id,seed:root.seed,generationStratum:root.generationStratum,phase:root.phase,ply:root.ply,historicalTrajectoryHash:root.historicalTrajectoryHash,openingPrefixHash:root.openingPrefixHash,rawStateKey:root.rawStateKey,rootOccurrenceHistoryHash:root.rootOccurrenceHistoryHash,rootMoveKey,rootActor:root.root.player,root:clone(root.root),history:clone(root.history),representation});
    }
  }
  rows.sort((a,b)=>cmp(a.rowIdentity,b.rowIdentity));
  return rows;
}

function deterministicBest(state, depth) { return P.searchTable(state,depth).canonicalBestMoveKey; }
function mediumMove(state,rng){ const table=P.searchTable(state,1),rows=table.rows.slice(0,Math.min(3,table.rows.length));return rows[Math.floor(rng()*rows.length)].moveKey; }
function weakMove(state,rng){const legal=P.exactMoves(state);return P.moveKey(legal[Math.floor(rng()*legal.length)]);}
function moveByKey(state,key){const move=P.exactMoves(state).find((m)=>P.moveKey(m)===key);ensure(move,`policy move missing ${key}`);return move;}
function continuationSeed(row,replicateIndex,spec){return first32(`${spec.continuationInstrument.replicateSeedDerivation.salt}|${row.rowIdentity}|${row.rootActor}|${replicateIndex}`);}
function continuePolicy(row, role, replicateIndex, spec, options={}){
  const horizon=options.horizon ?? spec.continuationInstrument.maximumPostRootPlies;
  const rootMove=moveByKey(row.root,row.rootMoveKey);
  let state=P.applyExact(row.root,rootMove).state;
  const rootActor=row.rootActor;
  const rng=seededRandom(continuationSeed(row,replicateIndex,spec));
  let plies=0;
  while(state.winner===null && plies<horizon){
    let key;
    if(state.player===rootActor) key=deterministicBest(state,2);
    else if(role==="STRONG") key=deterministicBest(state,2);
    else if(role==="MEDIUM") key=mediumMove(state,rng);
    else if(role==="WEAK") key=weakMove(state,rng);
    else throw new Error(`unknown continuation role ${role}`);
    state=P.applyExact(state,moveByKey(state,key)).state;
    plies+=1;
  }
  return {role,replicateIndex,seed:continuationSeed(row,replicateIndex,spec),terminal:state.winner!==null,winner:state.winner,postRootPlies:plies,administrativeHorizonExhausted:state.winner===null,boundedWin:Number(state.winner===rootActor)};
}
function measureRow(row,spec,options={}){
  const reps=options.replicates || {STRONG:1,MEDIUM:16,WEAK:8};
  ensure(reps.STRONG === 1, "strong policy must have one deterministic replicate");
  const outcomes={};
  for(const role of ["STRONG","MEDIUM","WEAK"]){outcomes[role]=[];for(let r=0;r<reps[role];r+=1)outcomes[role].push(continuePolicy(row,role,r,spec,options));}
  const strongWin=outcomes.STRONG[0].boundedWin,mediumWinRate=mean(outcomes.MEDIUM.map((x)=>x.boundedWin)),weakWinRate=mean(outcomes.WEAK.map((x)=>x.boundedWin));
  return {rowIdentity:row.rowIdentity,strongWin,mediumWinRate,weakWinRate,primaryLift:mediumWinRate-strongWin,weakLift:weakWinRate-strongWin,policySpan:Math.max(strongWin,mediumWinRate,weakWinRate)-Math.min(strongWin,mediumWinRate,weakWinRate),administrative:{strong:outcomes.STRONG.filter((x)=>x.administrativeHorizonExhausted).length,medium:outcomes.MEDIUM.filter((x)=>x.administrativeHorizonExhausted).length,weak:outcomes.WEAK.filter((x)=>x.administrativeHorizonExhausted).length},outcomes};
}
function measureRows(rows,spec,options={}){return rows.map((row)=>measureRow(row,spec,options));}

module.exports={
  canonicalHash, clone, cmp, conditionForGame, continuationSeed, continuePolicy,
  generateCorpus, historyHash, makeRows, mean, measureRow, measureRows, openingHash,
  phaseForSeed, populationSd, quotaRank, representativeRecords, rootRank, rowIdentity,
  runGame, selectRoots, sha256, trajectoryHash,
};
