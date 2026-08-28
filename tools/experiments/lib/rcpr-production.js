"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const Search = require("./position-complexity-search-diagnostic.js");

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

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function canonicalHash(value) {
  return sha256Text(stableStringify(value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoUnexpectedKeys(value, allowed, label) {
  ensure(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
  for (const key of Object.keys(value)) ensure(allowed.has(key), `${label} contains unexpected field: ${key}`);
}

function representedSeeds(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0)
    + state.reserve[0] + state.reserve[1] + state.pending[0] + state.pending[1];
}

function assertStateShape(state, { requireNonterminal = false } = {}) {
  assertNoUnexpectedKeys(state, STATE_ALLOWED_FIELDS, "state");
  for (const field of RAW_FIELDS) ensure(Object.prototype.hasOwnProperty.call(state, field), `raw identity field missing: ${field}`);
  ensure(Array.isArray(state.pits) && state.pits.length === 2, "pits must contain two players");
  for (const rows of state.pits) {
    ensure(Array.isArray(rows) && rows.length === 2, "each player must contain two rows");
    for (const row of rows) {
      ensure(Array.isArray(row) && row.length === 8, "each row must contain eight pits");
      ensure(row.every((v) => Number.isInteger(v) && v >= 0), "pit counts must be non-negative integers");
    }
  }
  ensure(Array.isArray(state.reserve) && state.reserve.length === 2 && state.reserve.every((v) => Number.isInteger(v) && v >= 0), "invalid reserve");
  ensure(Array.isArray(state.houseOwned) && state.houseOwned.length === 2 && state.houseOwned.every((v) => typeof v === "boolean"), "invalid houseOwned");
  ensure(state.player === 0 || state.player === 1, "invalid player");
  ensure(state.phase === "namua" || state.phase === "mtaji", "invalid phase");
  ensure(state.winner === null || state.winner === 0 || state.winner === 1, "invalid winner");
  ensure(Array.isArray(state.pending) && state.pending.length === 2 && state.pending.every((v) => Number.isInteger(v) && v >= 0), "invalid pending");
  ensure(representedSeeds(state) === 64, `seed conservation failed: ${representedSeeds(state)}`);
  if (requireNonterminal) ensure(state.winner === null, "root/history state must be nonterminal");
}

function rawRuleState(state) {
  assertStateShape(state);
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function rawStateKey(state) {
  return sha256Text(stableStringify(rawRuleState(state)));
}

function normalizeMove(move) {
  assertNoUnexpectedKeys(move, MOVE_ALLOWED_FIELDS, "move");
  const out = {};
  for (const field of MOVE_FIELDS) {
    if (field === "houseTwo") out.houseTwo = move.houseTwo === true;
    else if (move[field] !== undefined) out[field] = move[field];
  }
  return out;
}

function moveKey(move) {
  const normalized = normalizeMove(move);
  return MOVE_FIELDS.map((field) => {
    const value = normalized[field];
    if (field === "houseTwo") return value ? "true" : "false";
    return value === undefined || value === null ? "" : String(value);
  }).join(":");
}

function exactLegalMoves(state) {
  assertStateShape(state, { requireNonterminal: true });
  return E.moveVariants(state).map(normalizeMove).sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

function mean(values) {
  return values.length ? sum(values) / values.length : null;
}

function std(values) {
  if (!values.length) return null;
  const m = mean(values);
  return Math.sqrt(sum(values.map((v) => (v - m) ** 2)) / values.length);
}

function minOrNull(values) {
  return values.length ? Math.min(...values) : null;
}

function maxOrNull(values) {
  return values.length ? Math.max(...values) : null;
}

function eventCount(events, kind) {
  return events.filter((event) => event.kind === kind).length;
}

function capturedSeeds(events) {
  return events.filter((event) => event.kind === "capture").reduce((total, event) => total + (event.count || 0), 0);
}

function entropy(values) {
  if (!values.length) return 0;
  const counts = new Map();
  for (const value of values) counts.set(String(value), (counts.get(String(value)) || 0) + 1);
  let result = 0;
  for (const count of counts.values()) {
    const p = count / values.length;
    result -= p * Math.log2(p);
  }
  return result;
}

function rowStats(row) {
  const seeds = sum(row);
  return {
    seedSum: seeds,
    occupied: row.filter((v) => v > 0).length,
    connections: row.slice(0, -1).filter((v, i) => v > 0 && row[i + 1] > 0).length,
    reusable: row.filter((v) => v >= 2).length,
    maxPit: Math.max(...row),
    concentration: seeds ? sum(row.map((v) => v ** 2)) / (seeds ** 2) : 0,
  };
}

function localPitTopology(state) {
  const out = {};
  for (let p = 0; p < 2; p += 1) {
    for (const [rowName, rowIndex] of [["front", E.FRONT], ["back", E.BACK]]) {
      const row = state.pits[p][rowIndex];
      row.forEach((value, index) => { out[`p${p}_${rowName}_pit${index}`] = value; });
      const stats = rowStats(row);
      for (const [key, value] of Object.entries(stats)) out[`p${p}_${rowName}_${key}`] = value;
    }
  }
  const all = state.pits.flat(2);
  out.globalBoardSeeds = sum(all);
  out.globalNonEmptyPits = all.filter((v) => v > 0).length;
  out.globalMaxPit = Math.max(...all);
  return out;
}

function reserveHouseRelation(state) {
  const actor = state.player;
  const opponent = 1 - actor;
  const n0 = state.pits[0][E.FRONT][E.HOUSE];
  const n1 = state.pits[1][E.FRONT][E.HOUSE];
  return {
    reserve0: state.reserve[0],
    reserve1: state.reserve[1],
    reserveTotal: state.reserve[0] + state.reserve[1],
    reserveDiff0Minus1: state.reserve[0] - state.reserve[1],
    house0: Number(state.houseOwned[0]),
    house1: Number(state.houseOwned[1]),
    houseCount: Number(state.houseOwned[0]) + Number(state.houseOwned[1]),
    nyumba0: n0,
    nyumba1: n1,
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

function legalMoveGeometry(state, legal) {
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
    uniqueMoveKeyCount: new Set(legal.map(moveKey)).size,
    forcedSingleMove: Number(legal.length === 1),
    allCapture: Number(legal.length > 0 && legal.every((move) => move.type === "capture")),
  };
  for (let index = 0; index < 8; index += 1) out[`originIndex${index}Count`] = 0;
  const origins = new Set();
  for (const move of legal) {
    if (move.type === "capture") out.captureCount += 1;
    else if (move.type === "takata") out.takataCount += 1;
    else if (move.type === "pass") out.passCount += 1;
    if (move.direction === "left") out.directionLeftCount += 1;
    if (move.direction === "right") out.directionRightCount += 1;
    if (move.side === "left") out.sideLeftCount += 1;
    if (move.side === "right") out.sideRightCount += 1;
    if (move.row === E.FRONT) out.rowFrontCount += 1;
    if (move.row === E.BACK) out.rowBackCount += 1;
    if (move.houseChoice === "stop") out.houseChoiceStopCount += 1;
    if (move.houseChoice === "use") out.houseChoiceUseCount += 1;
    if (move.houseTwo) out.houseTwoCount += 1;
    if (Number.isInteger(move.index)) out[`originIndex${move.index}Count`] += 1;
    if (Number.isInteger(move.row) && Number.isInteger(move.index)) origins.add(`${move.row}:${move.index}`);
  }
  out.uniqueOriginCount = origins.size;
  return out;
}

function captureGraph(state, legal) {
  const captures = [];
  const opponentCaptureCounts = [];
  const out = {};
  for (const rowName of ["front", "back"]) {
    for (let index = 0; index < 8; index += 1) {
      out[`${rowName}Idx${index}CaptureMoves`] = 0;
      out[`${rowName}Idx${index}CapturedSeeds`] = 0;
    }
  }
  let captureEventsTotal = 0;
  let terminalCount = 0;
  for (const move of legal) {
    const applied = E.applyMove(state, move);
    const seeds = capturedSeeds(applied.events);
    const events = eventCount(applied.events, "capture");
    captures.push(seeds);
    captureEventsTotal += events;
    if (applied.state.winner !== null) terminalCount += 1;
    let opponentCaptures = 0;
    if (applied.state.winner === null) opponentCaptures = E.moveVariants(applied.state).filter((reply) => reply.type === "capture").length;
    opponentCaptureCounts.push(opponentCaptures);
    if (move.type === "capture" && Number.isInteger(move.row) && Number.isInteger(move.index)) {
      const rowName = move.row === E.FRONT ? "front" : "back";
      out[`${rowName}Idx${move.index}CaptureMoves`] += 1;
      out[`${rowName}Idx${move.index}CapturedSeeds`] += seeds;
    }
  }
  const captureMoveCount = legal.filter((move) => move.type === "capture").length;
  return {
    ...out,
    captureMoveCount,
    captureMoveFraction: legal.length ? captureMoveCount / legal.length : 0,
    immediateCapturedSeedsTotal: sum(captures),
    immediateCapturedSeedsMin: minOrNull(captures),
    immediateCapturedSeedsMax: maxOrNull(captures),
    immediateCapturedSeedsMean: mean(captures),
    immediateCapturedSeedsStd: std(captures),
    captureEventsTotal,
    immediateTerminalMoveCount: terminalCount,
    successorOpponentCaptureMovesTotal: sum(opponentCaptureCounts),
    successorOpponentCaptureMovesMax: maxOrNull(opponentCaptureCounts),
    successorOpponentCaptureMovesMean: mean(opponentCaptureCounts),
  };
}

function replyGraph(state, legal) {
  const onePlyKeys = [];
  const twoPlyKeys = [];
  const replyCounts = [];
  let forced = 0;
  let terminalSuccessors = 0;
  let replyCapture = 0;
  let replyTakata = 0;
  let replyPass = 0;
  for (const move of legal) {
    const first = E.applyMove(state, move).state;
    onePlyKeys.push(rawStateKey(first));
    if (first.winner !== null) {
      terminalSuccessors += 1;
      replyCounts.push(0);
      continue;
    }
    const replies = exactLegalMoves(first);
    replyCounts.push(replies.length);
    if (replies.length === 1) forced += 1;
    for (const reply of replies) {
      if (reply.type === "capture") replyCapture += 1;
      else if (reply.type === "takata") replyTakata += 1;
      else if (reply.type === "pass") replyPass += 1;
      twoPlyKeys.push(rawStateKey(E.applyMove(first, reply).state));
    }
  }
  const uniqueOne = new Set(onePlyKeys).size;
  const uniqueTwo = new Set(twoPlyKeys).size;
  const totalReplies = sum(replyCounts);
  return {
    rootMoveCount: legal.length,
    onePlyUniqueRawStates: uniqueOne,
    onePlyDuplicateEdges: legal.length - uniqueOne,
    twoPlyEdgeCount: totalReplies,
    twoPlyUniqueRawStates: uniqueTwo,
    twoPlyDuplicateEdges: totalReplies - uniqueTwo,
    replyCountMin: minOrNull(replyCounts),
    replyCountMax: maxOrNull(replyCounts),
    replyCountMean: mean(replyCounts),
    replyCountStd: std(replyCounts),
    forcedReplySuccessorCount: forced,
    terminalSuccessorCount: terminalSuccessors,
    zeroReplySuccessorCount: replyCounts.filter((v) => v === 0).length,
    replyCaptureMoveTotal: replyCapture,
    replyTakataMoveTotal: replyTakata,
    replyPassMoveTotal: replyPass,
    replyCaptureMoveFraction: totalReplies ? replyCapture / totalReplies : 0,
  };
}

function moveSetEntropy(legal) {
  const category = (move, field) => move[field] === undefined || move[field] === null ? "none" : move[field];
  return {
    legalMoveCount: legal.length,
    typeEntropy: entropy(legal.map((move) => category(move, "type"))),
    directionEntropy: entropy(legal.map((move) => category(move, "direction"))),
    rowEntropy: entropy(legal.map((move) => category(move, "row"))),
    indexEntropy: entropy(legal.map((move) => category(move, "index"))),
    sideEntropy: entropy(legal.map((move) => category(move, "side"))),
    houseChoiceEntropy: entropy(legal.map((move) => category(move, "houseChoice"))),
    typeDirectionEntropy: entropy(legal.map((move) => `${category(move, "type")}|${category(move, "direction")}`)),
    originEntropy: entropy(legal.map((move) => `${category(move, "row")}|${category(move, "index")}`)),
  };
}

function assertFrozenSearchProfile(profile) {
  ensure(stableStringify(profile) === stableStringify(SEARCH_PROFILE), "search profile drift rejected");
}

function searchGapVector(state, profile = SEARCH_PROFILE) {
  assertFrozenSearchProfile(profile);
  const trace = Search.analyzeDepthTrace(state, profile.depths, {
    evaluationProfile: profile.evaluationProfile,
    quiescenceDepth: profile.quiescenceDepth,
    orderQuiescenceCaptures: profile.orderQuiescenceCaptures,
  });
  ensure(trace.searchSemantics === profile.searchSemantics, "search semantics drift");
  const out = {};
  for (const result of trace.results) {
    const scores = result.candidates.map((candidate) => candidate.score);
    const prefix = `d${result.depth}`;
    out[`${prefix}BestScore`] = result.bestScore;
    out[`${prefix}SecondBestScore`] = result.secondBestScore;
    out[`${prefix}BestSecondGap`] = result.bestSecondGap;
    out[`${prefix}TopSetSize`] = result.topSetSize;
    out[`${prefix}ScoreMin`] = minOrNull(scores);
    out[`${prefix}ScoreMax`] = maxOrNull(scores);
    out[`${prefix}ScoreMean`] = mean(scores);
    out[`${prefix}ScoreStd`] = std(scores);
    out[`${prefix}ScoreSpread`] = scores.length ? Math.max(...scores) - Math.min(...scores) : null;
    out[`${prefix}Nodes`] = result.aggregateCounters.nodes;
    out[`${prefix}QuiescenceNodes`] = result.aggregateCounters.quiescenceNodes;
    out[`${prefix}Cutoffs`] = result.aggregateCounters.cutoffs;
    out[`${prefix}Evaluations`] = result.aggregateCounters.evaluations;
  }
  const transition = trace.transitions[0];
  out.d1d2TopSetOverlap = transition.topSetOverlap.length;
  out.d1d2TopSetDisjoint = Number(transition.topSetDisjoint);
  out.d1d2CanonicalBestChanged = Number(transition.canonicalBestChanged);
  out.d1d2BestScoreDelta = transition.bestScoreDelta;
  out.d1d2BestScoreSignReversal = Number(transition.bestScoreSignReversal);
  return out;
}

function validatePreRootHistory(root, history) {
  ensure(Array.isArray(history), "preRootHistory must be an array");
  ensure(history.length <= MAX_HISTORY, `preRootHistory exceeds ${MAX_HISTORY}`);
  for (const [index, record] of history.entries()) {
    assertNoUnexpectedKeys(record, new Set(["state", "move"]), `history[${index}]`);
    ensure(Object.prototype.hasOwnProperty.call(record, "state") && Object.prototype.hasOwnProperty.call(record, "move"), `history[${index}] missing state/move`);
    assertStateShape(record.state, { requireNonterminal: true });
    normalizeMove(record.move);
    const applied = E.applyMove(record.state, record.move).state;
    const target = index + 1 < history.length ? history[index + 1].state : root;
    ensure(rawStateKey(applied) === rawStateKey(target), `history chain mismatch at index ${index}`);
  }
  return true;
}

function temporalContext(root, history) {
  validatePreRootHistory(root, history);
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
    const state = record.state;
    const move = normalizeMove(record.move);
    const applied = E.applyMove(state, move);
    const capture = capturedSeeds(applied.events);
    const relay = eventCount(applied.events, "relay");
    const phaseTransition = Number(applied.state.phase !== state.phase);
    out[`${prefix}Available`] = 1;
    out[`${prefix}Player0`] = Number(state.player === 0);
    out[`${prefix}Player1`] = Number(state.player === 1);
    out[`${prefix}PhaseNamua`] = Number(state.phase === "namua");
    out[`${prefix}PhaseMtaji`] = Number(state.phase === "mtaji");
    out[`${prefix}Reserve0`] = state.reserve[0];
    out[`${prefix}Reserve1`] = state.reserve[1];
    out[`${prefix}House0`] = Number(state.houseOwned[0]);
    out[`${prefix}House1`] = Number(state.houseOwned[1]);
    out[`${prefix}P0BoardSeeds`] = sum(state.pits[0].flat());
    out[`${prefix}P1BoardSeeds`] = sum(state.pits[1].flat());
    out[`${prefix}P0FrontSeeds`] = sum(state.pits[0][E.FRONT]);
    out[`${prefix}P1FrontSeeds`] = sum(state.pits[1][E.FRONT]);
    out[`${prefix}LegalMoveCount`] = exactLegalMoves(state).length;
    out[`${prefix}MoveCapture`] = Number(move.type === "capture");
    out[`${prefix}MoveTakata`] = Number(move.type === "takata");
    out[`${prefix}MovePass`] = Number(move.type === "pass");
    out[`${prefix}DirectionLeft`] = Number(move.direction === "left");
    out[`${prefix}DirectionRight`] = Number(move.direction === "right");
    out[`${prefix}RowFront`] = Number(move.row === E.FRONT);
    out[`${prefix}RowBack`] = Number(move.row === E.BACK);
    out[`${prefix}MoveIndex`] = Number.isInteger(move.index) ? move.index : null;
    out[`${prefix}CapturedSeeds`] = capture;
    out[`${prefix}RelayEvents`] = relay;
    out[`${prefix}PhaseTransition`] = phaseTransition;
    out.captureMovesInWindow += Number(move.type === "capture");
    out.capturedSeedsInWindow += capture;
    out.phaseTransitionsInWindow += phaseTransition;
  }
  return out;
}

function flattenNumeric(families) {
  const values = {};
  for (const family of FAMILY_ORDER) {
    ensure(families[family] && typeof families[family] === "object", `missing family ${family}`);
    for (const key of Object.keys(families[family]).sort()) {
      const value = families[family][key];
      ensure(value === null || (typeof value === "number" && Number.isFinite(value)), `non-numeric feature ${family}.${key}`);
      values[`${family}.${key}`] = value;
    }
  }
  return values;
}

function extractRepresentation(root, preRootHistory = [], options = {}) {
  assertNoUnexpectedKeys(options, new Set(["searchProfile"]), "options");
  assertStateShape(root, { requireNonterminal: true });
  const before = stableStringify(root);
  validatePreRootHistory(root, preRootHistory);
  const legal = exactLegalMoves(root);
  ensure(legal.length > 0, "root must have at least one exact legal move");
  const profile = options.searchProfile || SEARCH_PROFILE;
  assertFrozenSearchProfile(profile);
  const families = {
    LOCAL_PIT_TOPOLOGY: localPitTopology(root),
    CAPTURE_GRAPH: captureGraph(root, legal),
    LEGAL_MOVE_GEOMETRY: legalMoveGeometry(root, legal),
    REPLY_GRAPH: replyGraph(root, legal),
    RESERVE_HOUSE_RELATION: reserveHouseRelation(root),
    MOVE_SET_ENTROPY: moveSetEntropy(legal),
    SEARCH_GAP_VECTOR: searchGapVector(root, profile),
    LOCAL_TEMPORAL_CONTEXT: temporalContext(root, preRootHistory),
  };
  const numericFeatures = flattenNumeric(families);
  const result = {
    schemaVersion: SCHEMA_VERSION,
    rawStateKey: rawStateKey(root),
    phase: root.phase,
    player: root.player,
    historyDepth: preRootHistory.length,
    familyOrder: FAMILY_ORDER.slice(),
    searchProfile: clone(SEARCH_PROFILE),
    families,
    featureNames: Object.keys(numericFeatures),
    numericFeatures,
  };
  result.featureSchemaSha256 = sha256Text(result.featureNames.join("\n"));
  result.representationSha256 = canonicalHash({
    rawStateKey: result.rawStateKey,
    historyDepth: result.historyDepth,
    searchProfile: result.searchProfile,
    numericFeatures: result.numericFeatures,
  });
  ensure(stableStringify(root) === before, "feature extraction mutated root");
  return result;
}

module.exports = {
  FAMILY_ORDER,
  MAX_HISTORY,
  MOVE_FIELDS,
  RAW_FIELDS,
  SCHEMA_VERSION,
  SEARCH_PROFILE,
  assertFrozenSearchProfile,
  assertStateShape,
  canonicalHash,
  exactLegalMoves,
  extractRepresentation,
  moveKey,
  normalizeMove,
  rawRuleState,
  rawStateKey,
  stableStringify,
  validatePreRootHistory,
};
