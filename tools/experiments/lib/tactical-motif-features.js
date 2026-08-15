"use strict";

const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const {
  identityKeys,
  playerFeatures,
  stableStringify,
} = require("./position-typology-features.js");
const Search = require("./position-complexity-search-diagnostic.js");

const SCHEMA_VERSION = "1.1.0";

const DELTA_FIELDS = Object.freeze([
  "reserve", "nyumbaSeeds", "boardSeeds", "frontSeeds", "backSeeds",
  "occupiedPits", "frontOccupied", "backOccupied", "reusablePits", "frontConnections",
  "legalMoveCount", "captureMoveCount", "maxCapturableSeeds", "maxCaptureEvents",
  "maxRelayEvents", "maxChainEvents", "maxPitSeeds", "pitSeedVariance", "seedConcentration",
]);

const RESPONSE_ENVELOPE_FIELDS = Object.freeze([
  "boardSeeds", "frontSeeds", "backSeeds", "occupiedPits",
  "frontOccupied", "backOccupied", "reusablePits", "frontConnections",
  "legalMoveCount", "captureMoveCount", "maxCapturableSeeds", "nyumbaSeeds",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePosition(position, actor) {
  if (!position) return null;
  return {
    side: position.player === actor ? "actor" : "opponent",
    row: position.row,
    index: position.index,
  };
}

function numericDelta(before, after, fields = DELTA_FIELDS) {
  return Object.fromEntries(fields.map((field) => [field, after[field] - before[field]]));
}

function eventSummary(events, actor) {
  const captures = events.filter(({ kind }) => kind === "capture");
  const relays = events.filter(({ kind }) => kind === "relay");
  const sows = events.filter(({ kind }) => kind === "sow");
  const capturedSeeds = captures.reduce((total, event) => total + (event.count || 0), 0);
  return {
    eventKinds: events.map(({ kind }) => kind),
    capturedSeeds,
    captureEvents: captures.length,
    relayEvents: relays.length,
    sowEvents: sows.length,
    chainEvents: captures.length + relays.length,
    captureSites: captures.map((event) => ({
      side: event.player === actor ? "actor" : "opponent",
      index: event.index,
      count: event.count || 0,
    })),
    relaySites: relays.map((event) => ({
      position: normalizePosition(event.position, actor),
      count: event.count || 0,
    })),
    lastSowPosition: sows.length ? normalizePosition(sows.at(-1).position, actor) : null,
    lastRelayPosition: relays.length ? normalizePosition(relays.at(-1).position, actor) : null,
  };
}

function moveFamily(move) {
  return {
    type: move.type || null,
    phase: move.phase || null,
    row: Number.isInteger(move.row) ? move.row : null,
    index: Number.isInteger(move.index) ? move.index : null,
    direction: move.direction || null,
    side: move.side || null,
    houseChoice: move.houseChoice || null,
    houseTwo: Boolean(move.houseTwo),
  };
}

function abstractMoveFamily(move, mode = "coarse-no-index") {
  if (!["coarse-no-index", "indexed"].includes(mode)) {
    throw new Error(`Unsupported move abstraction mode: ${mode}`);
  }
  const family = moveFamily(move);
  if (mode === "coarse-no-index") delete family.index;
  return family;
}

function summarizeMoveTransition(state, move) {
  if (!state || state.winner !== null) throw new Error("Move transition requires a nonterminal state");
  const before = stableStringify(state);
  const actor = state.player;
  const opponent = 1 - actor;
  const legalKeys = E.moveVariants(state).map((candidate) => AI.moveKey(candidate));
  const moveKey = AI.moveKey(move);
  if (!legalKeys.includes(moveKey)) throw new Error(`Move is not a legal moveVariant: ${moveKey}`);

  const actorBefore = playerFeatures(state, actor);
  const opponentBefore = playerFeatures(state, opponent);
  const beforeIdentity = identityKeys(state);
  const applied = E.applyMove(state, move);
  const actorAfter = playerFeatures(applied.state, actor);
  const opponentAfter = playerFeatures(applied.state, opponent);
  const afterIdentity = identityKeys(applied.state);
  const replies = applied.state.winner === null ? E.moveVariants(applied.state) : [];

  const result = {
    schemaVersion: SCHEMA_VERSION,
    actor,
    phase: state.phase,
    move: clone(move),
    moveKey,
    moveFamily: moveFamily(move),
    beforeIdentity,
    afterIdentity,
    actorDelta: numericDelta(actorBefore, actorAfter),
    opponentDelta: numericDelta(opponentBefore, opponentAfter),
    houseOwnedDelta: {
      actor: Number(applied.state.houseOwned[actor]) - Number(state.houseOwned[actor]),
      opponent: Number(applied.state.houseOwned[opponent]) - Number(state.houseOwned[opponent]),
    },
    events: eventSummary(applied.events, actor),
    replySet: {
      count: replies.length,
      forced: applied.state.winner === null && replies.length === 1,
      moveKeys: replies.map((reply) => AI.moveKey(reply)).sort(),
    },
    terminal: applied.state.winner !== null,
    winnerRelativeToActor: applied.state.winner === null
      ? null
      : applied.state.winner === actor ? "actor" : "opponent",
    reason: applied.state.reason || "",
  };

  if (stableStringify(state) !== before) throw new Error("Move transition extraction mutated source state");
  return result;
}

function aggregate(values) {
  if (!values.length) return { min: null, max: null, mean: null };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
  };
}

function summarizeReplyEnvelope(state, move, fields = RESPONSE_ENVELOPE_FIELDS) {
  if (!state || state.winner !== null) throw new Error("Reply envelope requires a nonterminal root");
  const before = stableStringify(state);
  const actor = state.player;
  const opponent = 1 - actor;
  const actorRoot = playerFeatures(state, actor);
  const opponentRoot = playerFeatures(state, opponent);
  const applied = E.applyMove(state, move);

  if (applied.state.winner !== null) {
    return {
      schemaVersion: SCHEMA_VERSION,
      rootActor: actor,
      moveKey: AI.moveKey(move),
      replyCount: 0,
      forced: false,
      candidateTerminal: true,
      candidateWinnerRelativeToActor: applied.state.winner === actor ? "actor" : "opponent",
      replies: [],
      actorDeltaFromRoot: Object.fromEntries(fields.map((field) => [field, aggregate([])])),
      opponentDeltaFromRoot: Object.fromEntries(fields.map((field) => [field, aggregate([])])),
      replyCapturedSeeds: aggregate([]),
      replyRelayEvents: aggregate([]),
      terminalCounts: {
        actorWin: applied.state.winner === actor ? 1 : 0,
        opponentWin: applied.state.winner === opponent ? 1 : 0,
        nonterminal: 0,
      },
    };
  }

  const replies = E.moveVariants(applied.state).map((reply) => {
    const result = E.applyMove(applied.state, reply);
    const actorAfterReply = playerFeatures(result.state, actor);
    const opponentAfterReply = playerFeatures(result.state, opponent);
    const events = eventSummary(result.events, actor);
    return {
      replyMoveKey: AI.moveKey(reply),
      replyMove: clone(reply),
      actorDeltaFromRoot: numericDelta(actorRoot, actorAfterReply, fields),
      opponentDeltaFromRoot: numericDelta(opponentRoot, opponentAfterReply, fields),
      events,
      terminal: result.state.winner !== null,
      winnerRelativeToActor: result.state.winner === null
        ? null
        : result.state.winner === actor ? "actor" : "opponent",
      afterRuleStateKey: identityKeys(result.state).ruleStateKey,
    };
  }).sort((a, b) => a.replyMoveKey.localeCompare(b.replyMoveKey));

  const actorAggregate = Object.fromEntries(fields.map((field) => [
    field, aggregate(replies.map((reply) => reply.actorDeltaFromRoot[field])),
  ]));
  const opponentAggregate = Object.fromEntries(fields.map((field) => [
    field, aggregate(replies.map((reply) => reply.opponentDeltaFromRoot[field])),
  ]));

  const envelope = {
    schemaVersion: SCHEMA_VERSION,
    rootActor: actor,
    moveKey: AI.moveKey(move),
    replyCount: replies.length,
    forced: replies.length === 1,
    candidateTerminal: false,
    candidateWinnerRelativeToActor: null,
    replies,
    actorDeltaFromRoot: actorAggregate,
    opponentDeltaFromRoot: opponentAggregate,
    replyCapturedSeeds: aggregate(replies.map((reply) => reply.events.capturedSeeds)),
    replyRelayEvents: aggregate(replies.map((reply) => reply.events.relayEvents)),
    terminalCounts: {
      actorWin: replies.filter(({ winnerRelativeToActor }) => winnerRelativeToActor === "actor").length,
      opponentWin: replies.filter(({ winnerRelativeToActor }) => winnerRelativeToActor === "opponent").length,
      nonterminal: replies.filter(({ terminal }) => !terminal).length,
    },
  };

  if (stableStringify(state) !== before) throw new Error("Reply-envelope extraction mutated source state");
  return envelope;
}

function structuralSignature(summary) {
  return {
    schemaVersion: summary.schemaVersion,
    phase: summary.phase,
    moveFamily: summary.moveFamily,
    actorDelta: summary.actorDelta,
    opponentDelta: summary.opponentDelta,
    houseOwnedDelta: summary.houseOwnedDelta,
    events: summary.events,
    replySet: {
      count: summary.replySet.count,
      forced: summary.replySet.forced,
    },
    terminal: summary.terminal,
    winnerRelativeToActor: summary.winnerRelativeToActor,
    reason: summary.reason,
  };
}

function analyzeExactRootValues(state, depths = [1, 2, 3], options = {}) {
  if (!Array.isArray(depths) || !depths.length) throw new Error("depths must be non-empty");
  return Search.analyzeDepthTrace(state, depths, options);
}

function analyzeReplyValues(state, move, depth = 1, options = {}) {
  const applied = E.applyMove(state, move);
  if (applied.state.winner !== null) {
    return {
      terminal: true,
      replyPlayer: null,
      replyCount: 0,
      diagnostic: null,
    };
  }
  const diagnostic = Search.analyzeRootCandidates(applied.state, depth, options);
  return {
    terminal: false,
    replyPlayer: applied.state.player,
    replyCount: diagnostic.legalMoveCount,
    diagnostic,
  };
}

module.exports = {
  DELTA_FIELDS,
  RESPONSE_ENVELOPE_FIELDS,
  SCHEMA_VERSION,
  abstractMoveFamily,
  analyzeExactRootValues,
  analyzeReplyValues,
  eventSummary,
  moveFamily,
  normalizePosition,
  structuralSignature,
  summarizeMoveTransition,
  summarizeReplyEnvelope,
};
