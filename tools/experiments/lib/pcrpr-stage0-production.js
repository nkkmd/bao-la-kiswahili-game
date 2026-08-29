"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const STUDY_ID = "PCRPR-STUDY1";
const STAGE_ID = "PCRPR-S0-TECHNICAL-2026-08-29-v1";
const SCHEMA_ID = "PCRPR_FEATURES_STAGE0_V1";
const SEARCH_ID = "pcrpr-exact-full-window/bao/q0/v1";
const WIN = 1_000_000;
const FAMILY_ORDER = Object.freeze([
  "REPLY_SET_WIDTH",
  "DEFENSE_MAINTAINING_REPLY_FRACTION",
  "REPLY_QUALITY_DISTRIBUTION",
  "PUNISHMENT_CONCENTRATION",
  "BEST_REPLY_GAP_VECTOR",
  "FORCING_REPLY_STRUCTURE",
  "REPLY_BRANCH_ASYMMETRY",
  "REPLY_SEARCH_STABILITY",
  "OPPONENT_POLICY_SENSITIVITY",
  "ROOT_MOVE_REFERENCE_CONTEXT",
  "LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE",
  "LOCAL_TEMPORAL_CONTEXT",
]);
const MOVE_FIELDS = Object.freeze(["type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo"]);
const RAW_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
const STATE_ALLOWED = new Set([...RAW_FIELDS, "turn", "reason"]);
const INPUT_ALLOWED = new Set(["root", "rootMove", "history", "searchConfigId"]);
const EXPECTED_FEATURES = Object.freeze({
  REPLY_SET_WIDTH: ["legalReplyCount","log1pLegalReplyCount","replyCaptureCount","replyPassCount","replyTakataCount"],
  DEFENSE_MAINTAINING_REPLY_FRACTION: ["d1TopSetCount","d1TopSetFraction","d2TopSetCount","d2TopSetFraction"],
  REPLY_QUALITY_DISTRIBUTION: ["d2GapMax","d2GapMean","d2GapMin","d2GapQ25","d2GapQ50","d2GapQ75","d2GapStd","distinctD2ScoreCount"],
  PUNISHMENT_CONCENTRATION: ["positiveGapCount","positiveGapFraction","positiveGapHhi","positiveGapTop1Share","positiveGapTop2Share","positiveGapTotal"],
  BEST_REPLY_GAP_VECTOR: ["d1BestToSecondGap","d2BestToMedianGap","d2BestToSecondGap","d2BestToWorstGap"],
  FORCING_REPLY_STRUCTURE: ["allRepliesCapture","anyReplyCapture","d2TopSetCount","immediateTerminalAfterRootMove","uniqueD2BestReply","uniqueLegalReply"],
  REPLY_BRANCH_ASYMMETRY: ["forcedRootActorReplyFraction","replySuccessorLegalCountMax","replySuccessorLegalCountMean","replySuccessorLegalCountMin","replySuccessorLegalCountRange","replySuccessorLegalCountStd","terminalReplySuccessorFraction"],
  REPLY_SEARCH_STABILITY: ["d1D2CanonicalBestMatch","d1D2MeanAbsoluteRankDifference","d1D2TopSetIntersectionCount","d1D2TopSetJaccard"],
  OPPONENT_POLICY_SENSITIVITY: ["expectedGapMedium","expectedGapPolicySpan","expectedGapStrong","expectedGapWeak","mediumMinusStrongExpectedGap","tvMediumWeak","tvStrongMedium","tvStrongWeak","weakMinusStrongExpectedGap"],
  ROOT_MOVE_REFERENCE_CONTEXT: ["rootD2BestToSecondGap","rootLegalMoveCount","rootMoveInD2TopSet","rootMoveScoreMinusBest","rootMoveTieAwareRank"],
  LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE: ["actorHouse","actorReserve","opponentHouse","opponentReserve","phaseMtaji","phaseNamua","reserveDiffActorMinusOpponent","rootMoveCapturedSeeds","rootMoveIsCapture","rootMoveTerminal","successorActorFrontOccupied","successorActorReusablePits","successorOpponentFrontOccupied","successorOpponentReusablePits"],
  LOCAL_TEMPORAL_CONTEXT: ["historyLength","immediatelyPriorCapture","priorCaptureCount","priorDirectionLeftCount","priorDirectionRightCount","priorPassCount","priorPhaseChangeCount","priorTakataCount"],
});

function ensure(ok, message) { if (!ok) throw new Error(message); }
function asciiCompare(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sha256(text) { return crypto.createHash("sha256").update(Buffer.from(String(text), "utf8")).digest("hex"); }
function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort(asciiCompare).map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(",")}}`;
}
function canonicalHash(value) { return sha256(canonicalJson(value)); }
function assertNoExtra(value, allowed, label) {
  ensure(value && typeof value === "object" && !Array.isArray(value), `${label} must be object`);
  for (const key of Object.keys(value)) ensure(allowed.has(key), `${label} forbidden/unexpected field: ${key}`);
}
function representedSeeds(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0) + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}
function assertState(state, requireNonterminal = false) {
  assertNoExtra(state, STATE_ALLOWED, "state");
  for (const key of RAW_FIELDS) ensure(Object.prototype.hasOwnProperty.call(state, key), `raw identity field missing: ${key}`);
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "invalid pits players");
  for (const rows of state.pits) {
    ensure(Array.isArray(rows) && rows.length === 2, "invalid pits rows");
    for (const row of rows) ensure(Array.isArray(row) && row.length === 8 && row.every((n) => Number.isInteger(n) && n >= 0), "invalid pit row");
  }
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2 && state.reserve.every((n) => Number.isInteger(n) && n >= 0), "invalid reserve");
  ensure(Array.isArray(state.pending) && state.pending.length === 2 && state.pending.every((n) => Number.isInteger(n) && n >= 0), "invalid pending");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2 && state.houseOwned.every((v) => typeof v === "boolean"), "invalid houseOwned");
  ensure(state.player === 0 || state.player === 1, "invalid player");
  ensure(state.phase === "namua" || state.phase === "mtaji", "invalid phase");
  ensure(state.winner === null || state.winner === 0 || state.winner === 1, "invalid winner");
  ensure(representedSeeds(state) === 64, `seed conservation failed: ${representedSeeds(state)}`);
  if (requireNonterminal) ensure(state.winner === null, "expected nonterminal state");
}
function rawState(state) {
  assertState(state);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(), houseOwned: state.houseOwned.slice(), player: state.player,
    phase: state.phase, winner: state.winner, pending: state.pending.slice(),
  };
}
function rawKey(state) { return sha256(canonicalJson(rawState(state))); }
function normalizeMove(move) {
  ensure(move && typeof move === "object", "move required");
  const out = {};
  for (const f of MOVE_FIELDS) {
    if (f === "houseTwo") out.houseTwo = move.houseTwo === true;
    else if (move[f] !== undefined) out[f] = move[f];
  }
  return out;
}
function moveKey(move) {
  const m = normalizeMove(move);
  return MOVE_FIELDS.map((f) => f === "houseTwo" ? (m.houseTwo ? "true" : "false") : (m[f] === undefined || m[f] === null ? "" : String(m[f]))).join(":");
}
function exactMoves(state) {
  assertState(state, true);
  return E.moveVariants(state).map(normalizeMove).sort((a, b) => asciiCompare(moveKey(a), moveKey(b)));
}
function exactMove(state, moveLike) {
  const key = moveKey(moveLike);
  const found = exactMoves(state).find((m) => moveKey(m) === key);
  ensure(found, `exact move not legal: ${key}`);
  return found;
}
function applyExact(state, moveLike) {
  const move = exactMove(state, moveLike);
  const applied = E.applyMove(state, move);
  assertState(applied.state);
  return { move, state: applied.state, events: applied.events || [] };
}
function terminalScore(state, actor, ply) {
  return state.winner === null ? null : (state.winner === actor ? WIN - ply : -WIN + ply);
}
function minimaxValue(state, depth, actor, ply) {
  assertState(state);
  const terminal = terminalScore(state, actor, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return AI.evaluateWithProfile(state, actor, "bao");
  const legal = exactMoves(state);
  ensure(legal.length > 0, "nonterminal state has no exact legal moves");
  const maximizing = state.player === actor;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of legal) {
    const value = minimaxValue(applyExact(state, move).state, depth - 1, actor, ply + 1);
    best = maximizing ? Math.max(best, value) : Math.min(best, value);
  }
  return best;
}
function searchTable(state, depth) {
  assertState(state, true);
  ensure(depth === 1 || depth === 2 || depth === 3, "unsupported technical depth");
  const actor = state.player;
  const rows = exactMoves(state).map((move) => ({
    move, moveKey: moveKey(move), score: minimaxValue(applyExact(state, move).state, depth - 1, actor, 1),
  })).sort((a, b) => b.score - a.score || asciiCompare(a.moveKey, b.moveKey));
  const bestScore = rows[0].score;
  return {
    searchId: SEARCH_ID, depth, actor, rawStateKey: rawKey(state), bestScore,
    topSetMoveKeys: rows.filter((r) => r.score === bestScore).map((r) => r.moveKey).sort(asciiCompare),
    canonicalBestMoveKey: rows.filter((r) => r.score === bestScore).map((r) => r.moveKey).sort(asciiCompare)[0],
    rows: rows.map((r, i) => ({ moveKey: r.moveKey, score: r.score, ordinal: i + 1, rank: 1 + rows.filter((x) => x.score > r.score).length })),
  };
}
function orderedSum(values) { let total = 0; for (const value of values) { ensure(Number.isFinite(value), "non-finite aggregate input"); total += value; } return total; }
function mean(values) { return values.length ? orderedSum(values) / values.length : 0; }
function std(values) { if (!values.length) return 0; const m = mean(values); return Math.sqrt(orderedSum(values.map((v) => (v - m) ** 2)) / values.length); }
function quantile(values, p) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const h = (sorted.length - 1) * p;
  const lo = Math.floor(h), hi = Math.ceil(h);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (h - lo);
}
function rankMap(rows, scoreField) {
  const ranked = rows.slice().sort((a, b) => b[scoreField] - a[scoreField] || asciiCompare(a.key, b.key));
  const out = new Map();
  for (const row of ranked) out.set(row.key, 1 + ranked.filter((x) => x[scoreField] > row[scoreField]).length);
  return { ranked, ranks: out };
}
function policyProbabilities(rows) {
  if (!rows.length) return { strong: new Map(), medium: new Map(), weak: new Map() };
  const d1 = rankMap(rows, "d1").ranked;
  const d2 = rankMap(rows, "d2").ranked;
  const d2Best = d2[0].d2;
  const strongKeys = d2.filter((r) => r.d2 === d2Best).map((r) => r.key);
  const mediumKeys = d1.slice(0, Math.min(3, d1.length)).map((r) => r.key);
  const weakKeys = rows.map((r) => r.key);
  const make = (keys) => new Map(keys.map((key) => [key, 1 / keys.length]));
  return { strong: make(strongKeys), medium: make(mediumKeys), weak: make(weakKeys) };
}
function tvDistance(a, b, keys) { return 0.5 * orderedSum(keys.map((k) => Math.abs((a.get(k) || 0) - (b.get(k) || 0)))); }
function replyNumericFamilies(replyRows) {
  const rows = replyRows.map((r) => ({ key: String(r.key), d1: Number(r.d1), d2: Number(r.d2) })).sort((a, b) => asciiCompare(a.key, b.key));
  for (const r of rows) ensure(Number.isFinite(r.d1) && Number.isFinite(r.d2), "non-finite synthetic/reply score");
  if (!rows.length) return {
    defense: { d1TopSetCount:0,d1TopSetFraction:0,d2TopSetCount:0,d2TopSetFraction:0 },
    quality: { d2GapMax:0,d2GapMean:0,d2GapMin:0,d2GapQ25:0,d2GapQ50:0,d2GapQ75:0,d2GapStd:0,distinctD2ScoreCount:0 },
    punishment: { positiveGapCount:0,positiveGapFraction:0,positiveGapHhi:0,positiveGapTop1Share:0,positiveGapTop2Share:0,positiveGapTotal:0 },
    gaps: { d1BestToSecondGap:0,d2BestToMedianGap:0,d2BestToSecondGap:0,d2BestToWorstGap:0 },
    stability: { d1D2CanonicalBestMatch:0,d1D2MeanAbsoluteRankDifference:0,d1D2TopSetIntersectionCount:0,d1D2TopSetJaccard:0 },
    policy: { expectedGapMedium:0,expectedGapPolicySpan:0,expectedGapStrong:0,expectedGapWeak:0,mediumMinusStrongExpectedGap:0,tvMediumWeak:0,tvStrongMedium:0,tvStrongWeak:0,weakMinusStrongExpectedGap:0 },
  };
  const d1rank = rankMap(rows, "d1");
  const d2rank = rankMap(rows, "d2");
  const best1 = d1rank.ranked[0].d1, best2 = d2rank.ranked[0].d2;
  const top1 = d1rank.ranked.filter((r) => r.d1 === best1).map((r) => r.key);
  const top2 = d2rank.ranked.filter((r) => r.d2 === best2).map((r) => r.key);
  const gapsByKey = new Map(rows.map((r) => [r.key, best2 - r.d2]));
  const gapsLex = rows.map((r) => gapsByKey.get(r.key));
  const positive = gapsLex.filter((g) => g > 0);
  const total = orderedSum(positive);
  const descPositive = positive.slice().sort((a,b) => b-a);
  const top1share = total ? descPositive[0] / total : 0;
  const top2share = total ? orderedSum(descPositive.slice(0,2)) / total : 0;
  const hhi = total ? orderedSum(positive.map((g) => g * g)) / (total * total) : 0;
  const set1 = new Set(top1), set2 = new Set(top2);
  const intersection = top1.filter((k) => set2.has(k)).length;
  const union = new Set([...top1, ...top2]).size;
  const meanRankDiff = mean(rows.map((r) => Math.abs(d1rank.ranks.get(r.key) - d2rank.ranks.get(r.key))));
  const policies = policyProbabilities(rows);
  const expected = (p) => orderedSum(rows.map((r) => (p.get(r.key) || 0) * gapsByKey.get(r.key)));
  const es = expected(policies.strong), em = expected(policies.medium), ew = expected(policies.weak);
  const keys = rows.map((r) => r.key);
  const d1Second = d1rank.ranked.length >= 2 ? best1 - d1rank.ranked[1].d1 : 0;
  const d2Second = d2rank.ranked.length >= 2 ? best2 - d2rank.ranked[1].d2 : 0;
  return {
    defense: { d1TopSetCount:top1.length,d1TopSetFraction:top1.length/rows.length,d2TopSetCount:top2.length,d2TopSetFraction:top2.length/rows.length },
    quality: { d2GapMax:Math.max(...gapsLex),d2GapMean:mean(gapsLex),d2GapMin:Math.min(...gapsLex),d2GapQ25:quantile(gapsLex,0.25),d2GapQ50:quantile(gapsLex,0.5),d2GapQ75:quantile(gapsLex,0.75),d2GapStd:std(gapsLex),distinctD2ScoreCount:new Set(rows.map((r)=>r.d2)).size },
    punishment: { positiveGapCount:positive.length,positiveGapFraction:positive.length/rows.length,positiveGapHhi:hhi,positiveGapTop1Share:top1share,positiveGapTop2Share:top2share,positiveGapTotal:total },
    gaps: { d1BestToSecondGap:d1Second,d2BestToMedianGap:best2-quantile(rows.map((r)=>r.d2),0.5),d2BestToSecondGap:d2Second,d2BestToWorstGap:best2-d2rank.ranked[d2rank.ranked.length-1].d2 },
    stability: { d1D2CanonicalBestMatch:Number(top1.slice().sort(asciiCompare)[0]===top2.slice().sort(asciiCompare)[0]),d1D2MeanAbsoluteRankDifference:meanRankDiff,d1D2TopSetIntersectionCount:intersection,d1D2TopSetJaccard:union?intersection/union:0 },
    policy: { expectedGapMedium:em,expectedGapPolicySpan:Math.max(es,em,ew)-Math.min(es,em,ew),expectedGapStrong:es,expectedGapWeak:ew,mediumMinusStrongExpectedGap:em-es,tvMediumWeak:tvDistance(policies.medium,policies.weak,keys),tvStrongMedium:tvDistance(policies.strong,policies.medium,keys),tvStrongWeak:tvDistance(policies.strong,policies.weak,keys),weakMinusStrongExpectedGap:ew-es },
  };
}
function capturedSeeds(events) { return events.filter((e) => e.kind === "capture").reduce((a,e) => a + (e.count || 0), 0); }
function frontOccupied(state, player) { return state.pits[player][E.FRONT].filter((n) => n > 0).length; }
function reusablePits(state, player) { return state.pits[player].flat().filter((n) => n >= 2).length; }
function rootContext(root, rootMoveKeyValue) {
  const table = searchTable(root, 2);
  const row = table.rows.find((r) => r.moveKey === rootMoveKeyValue);
  ensure(row, "root move absent from root search");
  const second = table.rows.length >= 2 ? table.bestScore - table.rows[1].score : 0;
  return {
    rootD2BestToSecondGap: second,
    rootLegalMoveCount: table.rows.length,
    rootMoveInD2TopSet: Number(row.score === table.bestScore),
    rootMoveScoreMinusBest: row.score - table.bestScore,
    rootMoveTieAwareRank: row.rank,
  };
}
function historyFeatures(history, root) {
  ensure(Array.isArray(history) && history.length <= 4, "history must be array length <=4");
  if (history.length) ensure(rawKey(history[history.length-1].after) === rawKey(root), "history must end exactly at root");
  let capture=0,takata=0,pass=0,left=0,right=0,phaseChanges=0;
  for (const h of history) {
    assertNoExtra(h, new Set(["before","move","after"]), "history entry");
    assertState(h.before, true); assertState(h.after);
    const m = normalizeMove(h.move);
    if (m.type === "capture") capture += 1; if (m.type === "takata") takata += 1; if (m.type === "pass") pass += 1;
    if (m.direction === "left") left += 1; if (m.direction === "right") right += 1;
    if (h.before.phase !== h.after.phase) phaseChanges += 1;
  }
  const last = history.length ? normalizeMove(history[history.length-1].move) : null;
  return { historyLength:history.length,immediatelyPriorCapture:Number(last?.type==="capture"),priorCaptureCount:capture,priorDirectionLeftCount:left,priorDirectionRightCount:right,priorPassCount:pass,priorPhaseChangeCount:phaseChanges,priorTakataCount:takata };
}
function assertFeatureSchema(families) {
  ensure(Object.keys(families).length === FAMILY_ORDER.length, "family count drift");
  for (const family of FAMILY_ORDER) {
    ensure(Object.prototype.hasOwnProperty.call(families, family), `missing family ${family}`);
    const expected = EXPECTED_FEATURES[family].slice().sort(asciiCompare);
    const actual = Object.keys(families[family]).sort(asciiCompare);
    ensure(JSON.stringify(actual) === JSON.stringify(expected), `feature schema drift in ${family}`);
    for (const name of actual) ensure(Number.isFinite(families[family][name]), `non-finite feature ${family}.${name}`);
  }
}
function f64be(value) { ensure(Number.isFinite(value), "finite scalar required"); const b=Buffer.alloc(8); b.writeDoubleBE(value,0); return b.toString("hex"); }
function vectorize(families) {
  assertFeatureSchema(families);
  const rows=[];
  for (const family of FAMILY_ORDER) for (const name of EXPECTED_FEATURES[family].slice().sort(asciiCompare)) rows.push({ family,name,value:families[family][name],encoding:`f64be:${f64be(families[family][name])}` });
  const text = `${SCHEMA_ID}\n${rows.map((r)=>`${r.family}\t${r.name}\t${r.encoding}\n`).join("")}`;
  return { schemaId:SCHEMA_ID, scalarCount:rows.length, rows, vectorSha256:sha256(text) };
}
function buildRepresentation(input) {
  assertNoExtra(input, INPUT_ALLOWED, "representation input");
  ensure(input.searchConfigId === SEARCH_ID, `search config drift: ${input.searchConfigId}`);
  assertState(input.root, true);
  const root = clone(input.root), history = clone(input.history || []);
  const rootMove = exactMove(root, input.rootMove);
  const rootMoveKeyValue = moveKey(rootMove);
  const applied = applyExact(root, rootMove);
  const actor=root.player, opponent=1-actor;
  const terminal = applied.state.winner !== null;
  let replyRows=[], replyMoves=[], branchCounts=[], terminalReplyCount=0;
  if (!terminal) {
    replyMoves=exactMoves(applied.state);
    ensure(replyMoves.length>0,"nonterminal successor has no replies");
    const d1=searchTable(applied.state,1), d2=searchTable(applied.state,2);
    const d1map=new Map(d1.rows.map((r)=>[r.moveKey,r.score])), d2map=new Map(d2.rows.map((r)=>[r.moveKey,r.score]));
    replyRows=replyMoves.map((reply)=>({key:moveKey(reply),d1:d1map.get(moveKey(reply)),d2:d2map.get(moveKey(reply))}));
    for (const reply of replyMoves) {
      const s=applyExact(applied.state,reply).state;
      if (s.winner!==null) { terminalReplyCount+=1; branchCounts.push(0); }
      else branchCounts.push(exactMoves(s).length);
    }
  }
  const numeric=replyNumericFamilies(replyRows);
  const replyCaptureCount=replyMoves.filter((m)=>m.type==="capture").length;
  const replyTakataCount=replyMoves.filter((m)=>m.type==="takata").length;
  const replyPassCount=replyMoves.filter((m)=>m.type==="pass").length;
  const rootEvents=applied.events;
  const families={
    REPLY_SET_WIDTH:{legalReplyCount:replyMoves.length,log1pLegalReplyCount:Math.log1p(replyMoves.length),replyCaptureCount,replyPassCount,replyTakataCount},
    DEFENSE_MAINTAINING_REPLY_FRACTION:numeric.defense,
    REPLY_QUALITY_DISTRIBUTION:numeric.quality,
    PUNISHMENT_CONCENTRATION:numeric.punishment,
    BEST_REPLY_GAP_VECTOR:numeric.gaps,
    FORCING_REPLY_STRUCTURE:{allRepliesCapture:Number(replyMoves.length>0&&replyMoves.every((m)=>m.type==="capture")),anyReplyCapture:Number(replyCaptureCount>0),d2TopSetCount:numeric.defense.d2TopSetCount,immediateTerminalAfterRootMove:Number(terminal),uniqueD2BestReply:Number(numeric.defense.d2TopSetCount===1&&replyMoves.length>0),uniqueLegalReply:Number(replyMoves.length===1)},
    REPLY_BRANCH_ASYMMETRY:{forcedRootActorReplyFraction:branchCounts.length?branchCounts.filter((n)=>n===1).length/branchCounts.length:0,replySuccessorLegalCountMax:branchCounts.length?Math.max(...branchCounts):0,replySuccessorLegalCountMean:mean(branchCounts),replySuccessorLegalCountMin:branchCounts.length?Math.min(...branchCounts):0,replySuccessorLegalCountRange:branchCounts.length?Math.max(...branchCounts)-Math.min(...branchCounts):0,replySuccessorLegalCountStd:std(branchCounts),terminalReplySuccessorFraction:replyMoves.length?terminalReplyCount/replyMoves.length:0},
    REPLY_SEARCH_STABILITY:numeric.stability,
    OPPONENT_POLICY_SENSITIVITY:numeric.policy,
    ROOT_MOVE_REFERENCE_CONTEXT:rootContext(root,rootMoveKeyValue),
    LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE:{actorHouse:Number(root.houseOwned[actor]),actorReserve:root.reserve[actor],opponentHouse:Number(root.houseOwned[opponent]),opponentReserve:root.reserve[opponent],phaseMtaji:Number(root.phase==="mtaji"),phaseNamua:Number(root.phase==="namua"),reserveDiffActorMinusOpponent:root.reserve[actor]-root.reserve[opponent],rootMoveCapturedSeeds:capturedSeeds(rootEvents),rootMoveIsCapture:Number(rootMove.type==="capture"),rootMoveTerminal:Number(terminal),successorActorFrontOccupied:frontOccupied(applied.state,actor),successorActorReusablePits:reusablePits(applied.state,actor),successorOpponentFrontOccupied:frontOccupied(applied.state,opponent),successorOpponentReusablePits:reusablePits(applied.state,opponent)},
    LOCAL_TEMPORAL_CONTEXT:historyFeatures(history,root),
  };
  const vector=vectorize(families);
  return { studyId:STUDY_ID,stageId:STAGE_ID,schemaId:SCHEMA_ID,searchId:SEARCH_ID,rootRawStateKey:rawKey(root),rootMoveKey:rootMoveKeyValue,successorRawStateKey:rawKey(applied.state),terminalAfterRootMove:terminal,replyMoveKeys:replyMoves.map(moveKey),families,vector };
}

module.exports={FAMILY_ORDER,EXPECTED_FEATURES,SCHEMA_ID,SEARCH_ID,STAGE_ID,STUDY_ID,applyExact,asciiCompare,assertState,buildRepresentation,canonicalHash,canonicalJson,clone,exactMoves,f64be,moveKey,normalizeMove,rawKey,rawState,replyNumericFamilies,searchTable,sha256,vectorize};
