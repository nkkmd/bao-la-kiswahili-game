"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");

const FRONT = E.FRONT;
const BACK = E.BACK;
const HOUSE = E.HOUSE;

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clonePits(pits) {
  return pits.map((rows) => rows.map((row) => row.slice()));
}

function directRuleState(state) {
  return {
    pits: clonePits(state.pits),
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: [...(state.pending || [0, 0])],
  };
}

function directStateSerialization(state) {
  return stableStringify(directRuleState(state));
}

function directStateKey(state) {
  return sha256(directStateSerialization(state));
}

function moveKey(move) {
  if (!move) return "";
  return [
    move.type,
    move.phase,
    move.row,
    move.index,
    move.direction,
    move.side,
    move.houseChoice,
    Boolean(move.houseTwo),
  ].join(":");
}

function comparisonState(state) {
  return {
    ...directRuleState(state),
    reason: state.reason || "",
    turn: state.turn,
  };
}

function pit(player, row, index) {
  return { player, row, index };
}

function ring(direction) {
  const result = [];
  if (direction === "right") {
    for (let i = 0; i < 8; i += 1) result.push({ row: FRONT, index: i });
    for (let i = 7; i >= 0; i -= 1) result.push({ row: BACK, index: i });
  } else {
    for (let i = 7; i >= 0; i -= 1) result.push({ row: FRONT, index: i });
    for (let i = 0; i < 8; i += 1) result.push({ row: BACK, index: i });
  }
  return result;
}

function nextPit(player, position, direction) {
  const path = ring(direction);
  const at = path.findIndex((item) => item.row === position.row && item.index === position.index);
  if (at < 0) throw new Error("Cursor not on sowing ring");
  const next = path[(at + 1) % path.length];
  return pit(player, next.row, next.index);
}

function entryPit(player, side) {
  return pit(player, FRONT, side === "left" ? 0 : 7);
}

function directionForSide(side) {
  return side === "left" ? "right" : "left";
}

function forcedCaptureSide(index, fallbackDirection) {
  if (index <= 1) return "left";
  if (index >= 6) return "right";
  return fallbackDirection === "right" ? "left" : "right";
}

function countAt(state, position) {
  return state.pits[position.player][position.row][position.index];
}

function setAt(state, position, value) {
  state.pits[position.player][position.row][position.index] = value;
}

function opposite(state, player, index) {
  return state.pits[1 - player][FRONT][7 - index];
}

function frontOccupied(state, player) {
  return state.pits[player][FRONT].some((value) => value > 0);
}

function loseHouseIfEmptied(state, position) {
  if (position.row === FRONT && position.index === HOUSE && countAt(state, position) === 0) {
    state.houseOwned[position.player] = false;
  }
}

function sow(state, player, start, seeds, direction, includeStart) {
  let cursor = start;
  let wasEmpty = false;
  for (let i = 0; i < seeds; i += 1) {
    if (!includeStart || i > 0) cursor = nextPit(player, cursor, direction);
    wasEmpty = countAt(state, cursor) === 0;
    setAt(state, cursor, countAt(state, cursor) + 1);
  }
  return { cursor, wasEmpty };
}

function takeOpposite(state, player, index) {
  const opponentIndex = 7 - index;
  const taken = state.pits[1 - player][FRONT][opponentIndex];
  state.pits[1 - player][FRONT][opponentIndex] = 0;
  state.houseOwned[1 - player] = state.houseOwned[1 - player] && opponentIndex !== HOUSE;
  return taken;
}

function finishOnEmptyFront(state, player, captured) {
  if (frontOccupied(state, 1 - player)) return false;
  state.pending ||= [0, 0];
  state.pending[player] += captured;
  state.winner = player;
  state.reason = "front-empty";
  return true;
}

function finishTurnMtaji(state) {
  if (!frontOccupied(state, 1 - state.player)) {
    state.winner = state.player;
    state.reason = "front-empty";
    return;
  }
  if (!frontOccupied(state, state.player)) {
    state.winner = 1 - state.player;
    state.reason = "front-empty";
    return;
  }
  state.player = 1 - state.player;
  state.turn += 1;
  const nextMoves = E.legalMoves(state);
  if (!nextMoves.length) {
    state.winner = 1 - state.player;
    state.reason = "no-move";
  }
}

function moveInternalSerialization(state, cursor, direction, captureTurn) {
  return stableStringify({
    ruleState: directRuleState(state),
    cursor,
    direction,
    captureTurn,
  });
}

function exactMtajiMoves(state) {
  if (state.phase !== "mtaji") throw new Error("Stage 0 exact transition adapter is Mtaji-only");
  return E.legalMoves(state).map((move) => clone(move));
}

/**
 * Apply one Mtaji move without treating the browser MAX_RELAY guard as a game rule.
 *
 * A repeated full move-internal microstate proves deterministic intra-move
 * recurrence. The administrative microstate ceiling is a Stage 0 resource
 * safeguard only; ADMIN-CUTOFF is never a game outcome and makes a candidate
 * ineligible for an exact claim.
 */
function applyMtajiGuardFree(source, move, options = {}) {
  const administrativeMaxMicrostates = options.administrativeMaxMicrostates ?? 1_000_000;
  if (!Number.isInteger(administrativeMaxMicrostates) || administrativeMaxMicrostates < 1) {
    throw new Error("Invalid administrativeMaxMicrostates");
  }
  if (source.phase !== "mtaji") throw new Error("Mtaji-only transition adapter");
  if (source.winner !== null) throw new Error("Cannot move from terminal state");

  const legal = exactMtajiMoves(source);
  const requestedKey = moveKey(move);
  if (!legal.some((candidate) => moveKey(candidate) === requestedKey)) {
    throw new Error(`Illegal exact Mtaji move: ${requestedKey}`);
  }

  const state = clone(source);
  state.pending ||= [0, 0];
  state.reason ||= "";
  const player = state.player;
  let cursor = pit(player, move.row, move.index);
  let direction = move.direction;
  const captureTurn = move.type === "capture";

  const seeds = countAt(state, cursor);
  setAt(state, cursor, 0);
  loseHouseIfEmptied(state, cursor);
  let result = sow(state, player, cursor, seeds, direction, false);
  cursor = result.cursor;
  let wasEmpty = result.wasEmpty;

  const seen = new Set();
  let microstepCount = 0;

  while (!wasEmpty) {
    const serialization = moveInternalSerialization(state, cursor, direction, captureTurn);
    if (seen.has(serialization)) {
      return {
        status: "MOVE-NONTERMINATION",
        state: null,
        microstepCount,
        repeatedMicrostateHash: sha256(serialization),
        moveKey: requestedKey,
      };
    }
    if (seen.size >= administrativeMaxMicrostates) {
      return {
        status: "ADMIN-CUTOFF",
        state: null,
        microstepCount,
        repeatedMicrostateHash: null,
        moveKey: requestedKey,
      };
    }
    seen.add(serialization);
    microstepCount += 1;

    if (!frontOccupied(state, 1 - player)) {
      state.winner = player;
      state.reason = "front-empty";
      return {
        status: "TERMINATED",
        state,
        microstepCount,
        repeatedMicrostateHash: null,
        moveKey: requestedKey,
      };
    }

    const canCapture = captureTurn
      && cursor.row === FRONT
      && opposite(state, player, cursor.index) > 0;
    if (canCapture) {
      const taken = takeOpposite(state, player, cursor.index);
      state.houseOwned[player] = false;
      if (finishOnEmptyFront(state, player, taken)) {
        return {
          status: "TERMINATED",
          state,
          microstepCount,
          repeatedMicrostateHash: null,
          moveKey: requestedKey,
        };
      }
      const side = forcedCaptureSide(cursor.index, direction);
      direction = directionForSide(side);
      result = sow(state, player, entryPit(player, side), taken, direction, true);
      cursor = result.cursor;
      wasEmpty = result.wasEmpty;
      continue;
    }

    const relaySeeds = countAt(state, cursor);
    setAt(state, cursor, 0);
    loseHouseIfEmptied(state, cursor);
    result = sow(state, player, cursor, relaySeeds, direction, false);
    cursor = result.cursor;
    wasEmpty = result.wasEmpty;
  }

  finishTurnMtaji(state);
  return {
    status: "TERMINATED",
    state,
    microstepCount,
    repeatedMicrostateHash: null,
    moveKey: requestedKey,
  };
}

function compareWithRuntimeEngine(source, move, options = {}) {
  const exact = applyMtajiGuardFree(source, move, options);
  const runtime = E.applyMove(source, move).state;
  if (runtime.reason === "relay-limit") {
    return {
      runtimeGuardHit: true,
      comparable: false,
      equal: null,
      exact,
      runtime,
    };
  }
  const comparable = exact.status === "TERMINATED";
  return {
    runtimeGuardHit: false,
    comparable,
    equal: comparable
      ? stableStringify(comparisonState(exact.state)) === stableStringify(comparisonState(runtime))
      : false,
    exact,
    runtime,
  };
}

module.exports = {
  applyMtajiGuardFree,
  compareWithRuntimeEngine,
  directRuleState,
  directStateKey,
  directStateSerialization,
  exactMtajiMoves,
  moveInternalSerialization,
  moveKey,
  stableStringify,
};
