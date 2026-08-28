"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const WIN = 1_000_000;
const SCHEMA_VERSION = "RCPR_FEATURES_V1";
const RAW_FIELDS = Object.freeze(["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
const STATE_ALLOWED_FIELDS = new Set([...RAW_FIELDS, "turn", "reason"]);
const MOVE_FIELDS = Object.freeze(["type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo"]);
const MOVE_ALLOWED_FIELDS = new Set(MOVE_FIELDS);
const FAMILY_ORDER = Object.freeze([
  "LOCAL_PIT_TOPOLOGY",
  "CAPTURE_GRAPH",
  "LEGAL_MOVE_GEOMETRY",
  "REPLY_GRAPH",
  "RESERVE_HOUSE_RELATION",
  "MOVE_SET_ENTROPY",
  "SEARCH_GAP_VECTOR",
  "LOCAL_TEMPORAL_CONTEXT",
]);
const SEARCH_PROFILE = Object.freeze({
  searchSemantics: "exact-full-window-root-candidates/phase2-value-semantics/v1",
  evaluationProfile: "bao",
  depths: Object.freeze([1, 2]),
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
  tieBreak: "exact-move-key-lexical",
});
const MAX_HISTORY = 4;

function insist(condition, message) {
  if (!condition) throw new Error(message);
}

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
}

function digestText(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function digestValue(value) {
  return digestText(canonicalJson(value));
}

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function rejectExtraKeys(value, allowed, label) {
  insist(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
  for (const key of Object.keys(value)) insist(allowed.has(key), `${label} contains unexpected field: ${key}`);
}

function seedCount(state) {
  let total = state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
  for (const rows of state.pits) for (const row of rows) for (const value of row) total += value;
  return total;
}

function validateState(state, nonterminal = false) {
  rejectExtraKeys(state, STATE_ALLOWED_FIELDS, "state");
  for (const field of RAW_FIELDS) insist(Object.prototype.hasOwnProperty.call(state, field), `raw identity field missing: ${field}`);
  insist(Array.isArray(state.pits) && state.pits.length === 2, "pits must contain two players");
  state.pits.forEach((rows) => {
    insist(Array.isArray(rows) && rows.length === 2, "each player must contain two rows");
    rows.forEach((row) => {
      insist(Array.isArray(row) && row.length === 8, "each row must contain eight pits");
      insist(row.every((v) => Number.isInteger(v) && v >= 0), "pit counts must be non-negative integers");
    });
  });
  insist(Array.isArray(state.reserve) && state.reserve.length === 2 && state.reserve.every((v) => Number.isInteger(v) && v >= 0), "invalid reserve");
  insist(Array.isArray(state.houseOwned) && state.houseOwned.length === 2 && state.houseOwned.every((v) => typeof v === "boolean"), "invalid houseOwned");
  insist(state.player === 0 || state.player === 1, "invalid player");
  insist(state.phase === "namua" || state.phase === "mtaji", "invalid phase");
  insist(state.winner === null || state.winner === 0 || state.winner === 1, "invalid winner");
  insist(Array.isArray(state.pending) && state.pending.length === 2 && state.pending.every((v) => Number.isInteger(v) && v >= 0), "invalid pending");
  insist(seedCount(state) === 64, `seed conservation failed: ${seedCount(state)}`);
  if (nonterminal) insist(state.winner === null, "root/history state must be nonterminal");
}

function independentRawState(state) {
  validateState(state, false);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: [state.reserve[0], state.reserve[1]],
    houseOwned: [state.houseOwned[0], state.houseOwned[1]],
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: [state.pending[0], state.pending[1]],
  };
}

function independentRawKey(state) {
  return digestText(canonicalJson(independentRawState(state)));
}

function independentMove(move) {
  rejectExtraKeys(move, MOVE_ALLOWED_FIELDS, "move");
  const out = {};
  for (const field of MOVE_FIELDS) {
    if (field === "houseTwo") out.houseTwo = move.houseTwo === true;
    else if (move[field] !== undefined) out[field] = move[field];
  }
  return out;
}

function independentMoveKey(move) {
  const m = independentMove(move);
  const fields = [];
  for (const field of MOVE_FIELDS) {
    if (field === "houseTwo") fields.push(m.houseTwo ? "true" : "false");
    else fields.push(m[field] === undefined || m[field] === null ? "" : String(m[field]));
  }
  return fields.join(":");
}

function independentLegal(state) {
  validateState(state, true);
  return E.moveVariants(state).map(independentMove).sort((a, b) => independentMoveKey(a).localeCompare(independentMoveKey(b)));
}

const add = (values) => values.reduce((a, b) => a + b, 0);
const average = (values) => values.length ? add(values) / values.length : null;
function deviation(values) {
  if (!values.length) return null;
  const m = average(values);
  return Math.sqrt(add(values.map((v) => (v - m) ** 2)) / values.length);
}
const minValue = (values) => values.length ? Math.min(...values) : null;
const maxValue = (values) => values.length ? Math.max(...values) : null;

function numberOf(events, kind) {
  let n = 0;
  for (const event of events) if (event.kind === kind) n += 1;
  return n;
}

function captureSeeds(events) {
  let n = 0;
  for (const event of events) if (event.kind === "capture") n += event.count || 0;
  return n;
}

function shannon(values) {
  if (!values.length) return 0;
  const counts = {};
  for (const value of values) counts[String(value)] = (counts[String(value)] || 0) + 1;
  let h = 0;
  for (const count of Object.values(counts)) {
    const p = count / values.length;
    h -= p * Math.log2(p);
  }
  return h;
}

function independentTopology(state) {
  const out = {};
  for (let p = 0; p < 2; p += 1) {
    for (const [name, rowIndex] of [["front", E.FRONT], ["back", E.BACK]]) {
      const row = state.pits[p][rowIndex];
      row.forEach((v, i) => { out[`p${p}_${name}_pit${i}`] = v; });
      const seeds = add(row);
      out[`p${p}_${name}_seedSum`] = seeds;
      out[`p${p}_${name}_occupied`] = row.filter((v) => v > 0).length;
      let links = 0;
      for (let i = 0; i < row.length - 1; i += 1) if (row[i] > 0 && row[i + 1] > 0) links += 1;
      out[`p${p}_${name}_connections`] = links;
      out[`p${p}_${name}_reusable`] = row.filter((v) => v >= 2).length;
      out[`p${p}_${name}_maxPit`] = Math.max(...row);
      out[`p${p}_${name}_concentration`] = seeds ? add(row.map((v) => v * v)) / (seeds * seeds) : 0;
    }
  }
  const all = state.pits.flat(2);
  out.globalBoardSeeds = add(all);
  out.globalNonEmptyPits = all.filter((v) => v > 0).length;
  out.globalMaxPit = Math.max(...all);
  return out;
}

function independentReserveHouse(state) {
  const actor = state.player;
  const opponent = 1 - actor;
  return {
    reserve0: state.reserve[0],
    reserve1: state.reserve[1],
    reserveTotal: state.reserve[0] + state.reserve[1],
    reserveDiff0Minus1: state.reserve[0] - state.reserve[1],
    house0: Number(state.houseOwned[0]),
    house1: Number(state.houseOwned[1]),
    houseCount: Number(state.houseOwned[0]) + Number(state.houseOwned[1]),
    nyumba0: state.pits[0][E.FRONT][E.HOUSE],
    nyumba1: state.pits[1][E.FRONT][E.HOUSE],
    actorReserve: state.reserve[actor],
    opponentReserve: state.reserve[opponent],
    actorHouse: Number(state.houseOwned[actor]),
    opponentHouse: Number(state.houseOwned[opponent]),
    actorNyumba: state.pits[actor][E.FRONT][E.HOUSE],
    opponentNyumba: state.pits[opponent][E.FRONT][E.HOUSE],
    actorReserveXHouse: state.reserve[actor] * Number(state.houseOwned[actor]),
    opponentReserveXHouse: state.reserve[opponent] * Number(state.houseOwned[opponent]),
    player0: Number(state.player === 0),
    player1: Number(state.player === 1),
    phaseNamua: Number(state.phase === "namua"),
    phaseMtaji: Number(state.phase === "mtaji"),
  };
}

function independentMoveGeometry(legal) {
  const out = {
    legalMoveCount: legal.length,
    captureCount: 0,
    takataCount: 0,
    passCount: 0,
    directionLeftCount: 0,
    directionRightCount: 0,
    sideLeftCount: 0,
    sideRightCount: 0,
    rowFrontCount: 0,
    rowBackCount: 0,
    houseChoiceStopCount: 0,
    houseChoiceUseCount: 0,
    houseTwoCount: 0,
    uniqueOriginCount: 0,
    uniqueMoveKeyCount: new Set(legal.map(independentMoveKey)).size,
    forcedSingleMove: Number(legal.length === 1),
    allCapture: Number(legal.length > 0 && legal.every((m) => m.type === "capture")),
  };
  for (let i = 0; i < 8; i += 1) out[`originIndex${i}Count`] = 0;
  const origins = new Set();
  for (const m of legal) {
    if (m.type === "capture") out.captureCount += 1;
    if (m.type === "takata") out.takataCount += 1;
    if (m.type === "pass") out.passCount += 1;
    if (m.direction === "left") out.directionLeftCount += 1;
    if (m.direction === "right") out.directionRightCount += 1;
    if (m.side === "left") out.sideLeftCount += 1;
    if (m.side === "right") out.sideRightCount += 1;
    if (m.row === E.FRONT) out.rowFrontCount += 1;
    if (m.row === E.BACK) out.rowBackCount += 1;
    if (m.houseChoice === "stop") out.houseChoiceStopCount += 1;
    if (m.houseChoice === "use") out.houseChoiceUseCount += 1;
    if (m.houseTwo) out.houseTwoCount += 1;
    if (Number.isInteger(m.index)) out[`originIndex${m.index}Count`] += 1;
    if (Number.isInteger(m.row) && Number.isInteger(m.index)) origins.add(`${m.row}:${m.index}`);
  }
  out.uniqueOriginCount = origins.size;
  return out;
}

function independentCaptureGraph(state, legal) {
  const out = {};
  for (const rowName of ["front", "back"]) for (let i = 0; i < 8; i += 1) {
    out[`${rowName}Idx${i}CaptureMoves`] = 0;
    out[`${rowName}Idx${i}CapturedSeeds`] = 0;
  }
  const seeds = [];
  const oppCapture = [];
  let eventTotal = 0;
  let terminals = 0;
  for (const m of legal) {
    const applied = E.applyMove(state, m);
    const c = captureSeeds(applied.events);
    seeds.push(c);
    eventTotal += numberOf(applied.events, "capture");
    if (applied.state.winner !== null) terminals += 1;
    oppCapture.push(applied.state.winner === null ? E.moveVariants(applied.state).filter((r) => r.type === "capture").length : 0);
    if (m.type === "capture" && Number.isInteger(m.row) && Number.isInteger(m.index)) {
      const rowName = m.row === E.FRONT ? "front" : "back";
      out[`${rowName}Idx${m.index}CaptureMoves`] += 1;
      out[`${rowName}Idx${m.index}CapturedSeeds`] += c;
    }
  }
  const captureMoves = legal.filter((m) => m.type === "capture").length;
  return {
    ...out,
    captureMoveCount: captureMoves,
    captureMoveFraction: legal.length ? captureMoves / legal.length : 0,
    immediateCapturedSeedsTotal: add(seeds),
    immediateCapturedSeedsMin: minValue(seeds),
    immediateCapturedSeedsMax: maxValue(seeds),
    immediateCapturedSeedsMean: average(seeds),
    immediateCapturedSeedsStd: deviation(seeds),
    captureEventsTotal: eventTotal,
    immediateTerminalMoveCount: terminals,
    successorOpponentCaptureMovesTotal: add(oppCapture),
    successorOpponentCaptureMovesMax: maxValue(oppCapture),
    successorOpponentCaptureMovesMean: average(oppCapture),
  };
}

function independentReplyGraph(state, legal) {
  const firstKeys = [];
  const secondKeys = [];
  const counts = [];
  let forced = 0;
  let terminal = 0;
  let capture = 0;
  let takata = 0;
  let pass = 0;
  for (const m of legal) {
    const next = E.applyMove(state, m).state;
    firstKeys.push(independentRawKey(next));
    if (next.winner !== null) {
      terminal += 1;
      counts.push(0);
      continue;
    }
    const replies = independentLegal(next);
    counts.push(replies.length);
    if (replies.length === 1) forced += 1;
    for (const reply of replies) {
      if (reply.type === "capture") capture += 1;
      if (reply.type === "takata") takata += 1;
      if (reply.type === "pass") pass += 1;
      secondKeys.push(independentRawKey(E.applyMove(next, reply).state));
    }
  }
  const oneUnique = new Set(firstKeys).size;
  const twoUnique = new Set(secondKeys).size;
  const total = add(counts);
  return {
    rootMoveCount: legal.length,
    onePlyUniqueRawStates: oneUnique,
    onePlyDuplicateEdges: legal.length - oneUnique,
    twoPlyEdgeCount: total,
    twoPlyUniqueRawStates: twoUnique,
    twoPlyDuplicateEdges: total - twoUnique,
    replyCountMin: minValue(counts),
    replyCountMax: maxValue(counts),
    replyCountMean: average(counts),
    replyCountStd: deviation(counts),
    forcedReplySuccessorCount: forced,
    terminalSuccessorCount: terminal,
    zeroReplySuccessorCount: counts.filter((v) => v === 0).length,
    replyCaptureMoveTotal: capture,
    replyTakataMoveTotal: takata,
    replyPassMoveTotal: pass,
    replyCaptureMoveFraction: total ? capture / total : 0,
  };
}

function independentEntropy(legal) {
  const cat = (m, key) => m[key] === undefined || m[key] === null ? "none" : m[key];
  return {
    legalMoveCount: legal.length,
    typeEntropy: shannon(legal.map((m) => cat(m, "type"))),
    directionEntropy: shannon(legal.map((m) => cat(m, "direction"))),
    rowEntropy: shannon(legal.map((m) => cat(m, "row"))),
    indexEntropy: shannon(legal.map((m) => cat(m, "index"))),
    sideEntropy: shannon(legal.map((m) => cat(m, "side"))),
    houseChoiceEntropy: shannon(legal.map((m) => cat(m, "houseChoice"))),
    typeDirectionEntropy: shannon(legal.map((m) => `${cat(m, "type")}|${cat(m, "direction")}`)),
    originEntropy: shannon(legal.map((m) => `${cat(m, "row")}|${cat(m, "index")}`)),
  };
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}

function emptyCounters() {
  return { nodes: 0, quiescenceNodes: 0, cutoffs: 0, evaluations: 0 };
}

function evaluator(state, player) {
  return AI.evaluateWithProfile(state, player, "bao");
}

function independentQuiescence(state, alpha, beta, player, counters, ply, remaining) {
  counters.nodes += 1;
  counters.quiescenceNodes += 1;
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter((m) => m.type === "capture");
  if (!captures.length || remaining === 0) {
    counters.evaluations += 1;
    return evaluator(state, player);
  }
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of captures) {
    const value = independentQuiescence(E.applyMove(state, m).state, alpha, beta, player, counters, ply + 1, remaining - 1);
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) {
      counters.cutoffs += 1;
      break;
    }
  }
  return best;
}

function independentExactSearch(state, depth, alpha, beta, player, counters, ply) {
  counters.nodes += 1;
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return independentQuiescence(state, alpha, beta, player, counters, ply, SEARCH_PROFILE.quiescenceDepth);
  const moves = E.moveVariants(state);
  if (!moves.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of moves) {
    const value = independentExactSearch(E.applyMove(state, m).state, depth - 1, alpha, beta, player, counters, ply + 1);
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) {
      counters.cutoffs += 1;
      break;
    }
  }
  return best;
}

function independentRootSearch(state, depth) {
  const player = state.player;
  const rows = E.moveVariants(state).map((move) => {
    const counters = emptyCounters();
    const score = independentExactSearch(E.applyMove(state, move).state, depth - 1, -Infinity, Infinity, player, counters, 1);
    return { moveKey: independentMoveKey(move), score, counters };
  }).sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const best = rows[0].score;
  const top = rows.filter((row) => row.score === best).map((row) => row.moveKey).sort();
  return {
    depth,
    bestScore: best,
    secondBestScore: rows.length >= 2 ? rows[1].score : null,
    bestSecondGap: rows.length >= 2 ? best - rows[1].score : null,
    topSetMoveKeys: top,
    topSetSize: top.length,
    canonicalBestMoveKey: top[0],
    candidates: rows,
    aggregateCounters: rows.reduce((acc, row) => {
      for (const key of Object.keys(acc)) acc[key] += row.counters[key];
      return acc;
    }, emptyCounters()),
  };
}

function independentSearchFeatures(state, profile = SEARCH_PROFILE) {
  insist(canonicalJson(profile) === canonicalJson(SEARCH_PROFILE), "search profile drift rejected");
  const results = profile.depths.map((depth) => independentRootSearch(state, depth));
  const out = {};
  for (const r of results) {
    const scores = r.candidates.map((row) => row.score);
    const prefix = `d${r.depth}`;
    out[`${prefix}BestScore`] = r.bestScore;
    out[`${prefix}SecondBestScore`] = r.secondBestScore;
    out[`${prefix}BestSecondGap`] = r.bestSecondGap;
    out[`${prefix}TopSetSize`] = r.topSetSize;
    out[`${prefix}ScoreMin`] = minValue(scores);
    out[`${prefix}ScoreMax`] = maxValue(scores);
    out[`${prefix}ScoreMean`] = average(scores);
    out[`${prefix}ScoreStd`] = deviation(scores);
    out[`${prefix}ScoreSpread`] = scores.length ? Math.max(...scores) - Math.min(...scores) : null;
    out[`${prefix}Nodes`] = r.aggregateCounters.nodes;
    out[`${prefix}QuiescenceNodes`] = r.aggregateCounters.quiescenceNodes;
    out[`${prefix}Cutoffs`] = r.aggregateCounters.cutoffs;
    out[`${prefix}Evaluations`] = r.aggregateCounters.evaluations;
  }
  const a = results[0];
  const b = results[1];
  const overlap = a.topSetMoveKeys.filter((key) => b.topSetMoveKeys.includes(key));
  const sign = (v) => v > 0 ? 1 : v < 0 ? -1 : 0;
  out.d1d2TopSetOverlap = overlap.length;
  out.d1d2TopSetDisjoint = Number(overlap.length === 0);
  out.d1d2CanonicalBestChanged = Number(a.canonicalBestMoveKey !== b.canonicalBestMoveKey);
  out.d1d2BestScoreDelta = b.bestScore - a.bestScore;
  out.d1d2BestScoreSignReversal = Number(sign(a.bestScore) !== 0 && sign(b.bestScore) !== 0 && sign(a.bestScore) !== sign(b.bestScore));
  return out;
}

function independentHistoryCheck(root, history) {
  insist(Array.isArray(history), "preRootHistory must be an array");
  insist(history.length <= MAX_HISTORY, `preRootHistory exceeds ${MAX_HISTORY}`);
  history.forEach((record, index) => {
    rejectExtraKeys(record, new Set(["state", "move"]), `history[${index}]`);
    insist(Object.prototype.hasOwnProperty.call(record, "state") && Object.prototype.hasOwnProperty.call(record, "move"), `history[${index}] missing state/move`);
    validateState(record.state, true);
    independentMove(record.move);
    const next = E.applyMove(record.state, record.move).state;
    const expected = index + 1 < history.length ? history[index + 1].state : root;
    insist(independentRawKey(next) === independentRawKey(expected), `history chain mismatch at index ${index}`);
  });
}

function independentTemporal(root, history) {
  independentHistoryCheck(root, history);
  const out = { historyDepth: history.length, captureMovesInWindow: 0, capturedSeedsInWindow: 0, phaseTransitionsInWindow: 0 };
  for (let lag = 1; lag <= MAX_HISTORY; lag += 1) {
    const record = history[history.length - lag];
    const prefix = `lag${lag}`;
    if (!record) {
      out[`${prefix}Available`] = 0;
      for (const name of [
        "Player0", "Player1", "PhaseNamua", "PhaseMtaji", "Reserve0", "Reserve1", "House0", "House1",
        "P0BoardSeeds", "P1BoardSeeds", "P0FrontSeeds", "P1FrontSeeds", "LegalMoveCount", "MoveCapture",
        "MoveTakata", "MovePass", "DirectionLeft", "DirectionRight", "RowFront", "RowBack", "MoveIndex",
        "CapturedSeeds", "RelayEvents", "PhaseTransition",
      ]) out[`${prefix}${name}`] = null;
      continue;
    }
    const s = record.state;
    const m = independentMove(record.move);
    const applied = E.applyMove(s, m);
    const c = captureSeeds(applied.events);
    const relay = numberOf(applied.events, "relay");
    const transition = Number(applied.state.phase !== s.phase);
    out[`${prefix}Available`] = 1;
    out[`${prefix}Player0`] = Number(s.player === 0);
    out[`${prefix}Player1`] = Number(s.player === 1);
    out[`${prefix}PhaseNamua`] = Number(s.phase === "namua");
    out[`${prefix}PhaseMtaji`] = Number(s.phase === "mtaji");
    out[`${prefix}Reserve0`] = s.reserve[0];
    out[`${prefix}Reserve1`] = s.reserve[1];
    out[`${prefix}House0`] = Number(s.houseOwned[0]);
    out[`${prefix}House1`] = Number(s.houseOwned[1]);
    out[`${prefix}P0BoardSeeds`] = add(s.pits[0].flat());
    out[`${prefix}P1BoardSeeds`] = add(s.pits[1].flat());
    out[`${prefix}P0FrontSeeds`] = add(s.pits[0][E.FRONT]);
    out[`${prefix}P1FrontSeeds`] = add(s.pits[1][E.FRONT]);
    out[`${prefix}LegalMoveCount`] = independentLegal(s).length;
    out[`${prefix}MoveCapture`] = Number(m.type === "capture");
    out[`${prefix}MoveTakata`] = Number(m.type === "takata");
    out[`${prefix}MovePass`] = Number(m.type === "pass");
    out[`${prefix}DirectionLeft`] = Number(m.direction === "left");
    out[`${prefix}DirectionRight`] = Number(m.direction === "right");
    out[`${prefix}RowFront`] = Number(m.row === E.FRONT);
    out[`${prefix}RowBack`] = Number(m.row === E.BACK);
    out[`${prefix}MoveIndex`] = Number.isInteger(m.index) ? m.index : null;
    out[`${prefix}CapturedSeeds`] = c;
    out[`${prefix}RelayEvents`] = relay;
    out[`${prefix}PhaseTransition`] = transition;
    out.captureMovesInWindow += Number(m.type === "capture");
    out.capturedSeedsInWindow += c;
    out.phaseTransitionsInWindow += transition;
  }
  return out;
}

function independentFlatten(families) {
  const out = {};
  for (const family of FAMILY_ORDER) {
    insist(families[family] && typeof families[family] === "object", `missing family ${family}`);
    for (const key of Object.keys(families[family]).sort()) {
      const value = families[family][key];
      insist(value === null || (typeof value === "number" && Number.isFinite(value)), `non-numeric feature ${family}.${key}`);
      out[`${family}.${key}`] = value;
    }
  }
  return out;
}

function recomputeRepresentation(root, preRootHistory = [], options = {}) {
  rejectExtraKeys(options, new Set(["searchProfile"]), "options");
  validateState(root, true);
  const before = canonicalJson(root);
  independentHistoryCheck(root, preRootHistory);
  const legal = independentLegal(root);
  insist(legal.length > 0, "root must have legal moves");
  const profile = options.searchProfile || SEARCH_PROFILE;
  insist(canonicalJson(profile) === canonicalJson(SEARCH_PROFILE), "search profile drift rejected");
  const families = {
    LOCAL_PIT_TOPOLOGY: independentTopology(root),
    CAPTURE_GRAPH: independentCaptureGraph(root, legal),
    LEGAL_MOVE_GEOMETRY: independentMoveGeometry(legal),
    REPLY_GRAPH: independentReplyGraph(root, legal),
    RESERVE_HOUSE_RELATION: independentReserveHouse(root),
    MOVE_SET_ENTROPY: independentEntropy(legal),
    SEARCH_GAP_VECTOR: independentSearchFeatures(root, profile),
    LOCAL_TEMPORAL_CONTEXT: independentTemporal(root, preRootHistory),
  };
  const numericFeatures = independentFlatten(families);
  const result = {
    schemaVersion: SCHEMA_VERSION,
    rawStateKey: independentRawKey(root),
    phase: root.phase,
    player: root.player,
    historyDepth: preRootHistory.length,
    familyOrder: FAMILY_ORDER.slice(),
    searchProfile: deepCopy(SEARCH_PROFILE),
    families,
    featureNames: Object.keys(numericFeatures),
    numericFeatures,
  };
  result.featureSchemaSha256 = digestText(result.featureNames.join("\n"));
  result.representationSha256 = digestValue({
    rawStateKey: result.rawStateKey,
    historyDepth: result.historyDepth,
    searchProfile: result.searchProfile,
    numericFeatures: result.numericFeatures,
  });
  insist(canonicalJson(root) === before, "independent extraction mutated root");
  return result;
}

module.exports = {
  FAMILY_ORDER,
  MAX_HISTORY,
  SEARCH_PROFILE,
  independentHistoryCheck,
  independentMoveKey,
  independentRawKey,
  recomputeRepresentation,
};
