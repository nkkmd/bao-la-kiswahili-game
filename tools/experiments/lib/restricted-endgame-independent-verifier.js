"use strict";

// Independent Stage 0 verifier implementation.
// Deliberately does not import restricted-endgame-transition.js or restricted-endgame-stage0.js.

const crypto = require("node:crypto");

const FRONT = 0;
const BACK = 1;
const HOUSE = 4;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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

function rawRuleState(state) {
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: [...state.reserve],
    houseOwned: [...state.houseOwned],
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: [...(state.pending || [0, 0])],
  };
}

function stateSerialization(state) {
  return stableStringify(rawRuleState(state));
}

function stateKey(state) {
  return sha256(stateSerialization(state));
}

function moveKey(move) {
  return [
    move?.type,
    move?.phase,
    move?.row,
    move?.index,
    move?.direction,
    move?.side,
    move?.houseChoice,
    Boolean(move?.houseTwo),
  ].join(":");
}

function pit(player, row, index) {
  return { player, row, index };
}

function ring(direction) {
  const out = [];
  if (direction === "right") {
    for (let i = 0; i < 8; i += 1) out.push({ row: FRONT, index: i });
    for (let i = 7; i >= 0; i -= 1) out.push({ row: BACK, index: i });
  } else {
    for (let i = 7; i >= 0; i -= 1) out.push({ row: FRONT, index: i });
    for (let i = 0; i < 8; i += 1) out.push({ row: BACK, index: i });
  }
  return out;
}

function nextPit(player, position, direction) {
  const path = ring(direction);
  const at = path.findIndex((item) => item.row === position.row && item.index === position.index);
  if (at < 0) throw new Error("Independent verifier cursor outside ring");
  const next = path[(at + 1) % path.length];
  return pit(player, next.row, next.index);
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

function wouldCapture(state, player, row, index, direction) {
  const seeds = state.pits[player][row][index];
  if (seeds < 2 || seeds > 15) return false;
  let cursor = pit(player, row, index);
  for (let i = 0; i < seeds; i += 1) cursor = nextPit(player, cursor, direction);
  return cursor.row === FRONT
    && state.pits[player][FRONT][cursor.index] > 0
    && opposite(state, player, cursor.index) > 0;
}

function emptiesOwnFront(state, move) {
  const occupied = state.pits[state.player][FRONT].filter((value) => value > 0).length;
  if (move.row !== FRONT || occupied !== 1) return false;
  return (move.index === 0 && move.direction === "left")
    || (move.index === 7 && move.direction === "right");
}

function legalMtajiMoves(state) {
  if (state.phase !== "mtaji") throw new Error("Independent verifier is Mtaji-only");
  if (state.winner !== null) return [];
  const player = state.player;
  const candidates = [];
  for (let row = 0; row < 2; row += 1) {
    for (let index = 0; index < 8; index += 1) {
      if (state.pits[player][row][index] < 2) continue;
      for (const direction of ["left", "right"]) candidates.push({ row, index, direction });
    }
  }
  const captures = candidates.filter((move) => wouldCapture(
    state, player, move.row, move.index, move.direction,
  ));
  if (captures.length) {
    return captures.map((move) => ({ ...move, type: "capture", phase: "mtaji" }))
      .sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
  }
  const hasFront = candidates.some((move) => move.row === FRONT);
  return candidates.filter((move) => !hasFront || move.row === FRONT)
    .map((move) => ({ ...move, type: "takata", phase: "mtaji" }))
    .filter((move) => !emptiesOwnFront(state, move))
    .sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
}

function forcedCaptureSide(index, fallbackDirection) {
  if (index <= 1) return "left";
  if (index >= 6) return "right";
  return fallbackDirection === "right" ? "left" : "right";
}

function entryPit(player, side) {
  return pit(player, FRONT, side === "left" ? 0 : 7);
}

function directionForSide(side) {
  return side === "left" ? "right" : "left";
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

function finishTurn(state) {
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
  state.turn = (state.turn || 0) + 1;
  if (!legalMtajiMoves(state).length) {
    state.winner = 1 - state.player;
    state.reason = "no-move";
  }
}

function internalKey(state, cursor, direction, captureTurn) {
  return stableStringify({ rawRuleState: rawRuleState(state), cursor, direction, captureTurn });
}

function applyGuardFree(stateInput, moveInput, options = {}) {
  const maxMicrostates = options.maxMicrostates ?? 1_000_000;
  if (!Number.isInteger(maxMicrostates) || maxMicrostates < 1) throw new Error("Invalid maxMicrostates");
  const legal = legalMtajiMoves(stateInput);
  const requested = moveKey(moveInput);
  const move = legal.find((candidate) => moveKey(candidate) === requested);
  if (!move) throw new Error(`Independent illegal move ${requested}`);

  const state = clone(stateInput);
  state.pending ||= [0, 0];
  state.reason ||= "";
  const player = state.player;
  const captureTurn = move.type === "capture";
  let direction = move.direction;
  let cursor = pit(player, move.row, move.index);
  const seeds = countAt(state, cursor);
  setAt(state, cursor, 0);
  loseHouseIfEmptied(state, cursor);
  let sowed = sow(state, player, cursor, seeds, direction, false);
  cursor = sowed.cursor;
  let wasEmpty = sowed.wasEmpty;
  const seen = new Set();
  let microstepCount = 0;

  while (!wasEmpty) {
    const key = internalKey(state, cursor, direction, captureTurn);
    if (seen.has(key)) {
      return { status: "MOVE-NONTERMINATION", state: null, microstepCount };
    }
    if (seen.size >= maxMicrostates) {
      return { status: "ADMIN-CUTOFF", state: null, microstepCount };
    }
    seen.add(key);
    microstepCount += 1;

    if (!frontOccupied(state, 1 - player)) {
      state.winner = player;
      state.reason = "front-empty";
      return { status: "TERMINATED", state, microstepCount };
    }

    if (captureTurn && cursor.row === FRONT && opposite(state, player, cursor.index) > 0) {
      const taken = takeOpposite(state, player, cursor.index);
      state.houseOwned[player] = false;
      if (finishOnEmptyFront(state, player, taken)) {
        return { status: "TERMINATED", state, microstepCount };
      }
      const side = forcedCaptureSide(cursor.index, direction);
      direction = directionForSide(side);
      sowed = sow(state, player, entryPit(player, side), taken, direction, true);
      cursor = sowed.cursor;
      wasEmpty = sowed.wasEmpty;
      continue;
    }

    const relaySeeds = countAt(state, cursor);
    setAt(state, cursor, 0);
    loseHouseIfEmptied(state, cursor);
    sowed = sow(state, player, cursor, relaySeeds, direction, false);
    cursor = sowed.cursor;
    wasEmpty = sowed.wasEmpty;
  }

  finishTurn(state);
  return { status: "TERMINATED", state, microstepCount };
}

function summarizeBranching(counts) {
  if (!counts.length) return { expandedStates: 0, min: 0, max: 0, mean: 0 };
  return {
    expandedStates: counts.length,
    min: Math.min(...counts),
    max: Math.max(...counts),
    mean: counts.reduce((a, b) => a + b, 0) / counts.length,
  };
}

function enumerateClosure(rootStates, options = {}) {
  const maxStates = options.maxStates ?? 250_000;
  const maxEdges = options.maxEdges ?? 2_000_000;
  const maxMicrostates = options.maxMicrostates ?? 1_000_000;
  const states = new Map();
  const queue = [];
  const edges = [];
  const branching = [];
  let cursor = 0;
  let maxMoveMicrosteps = 0;

  function add(state) {
    const key = stateKey(state);
    const serialized = stateSerialization(state);
    const old = states.get(key);
    if (old) {
      if (old.serialized !== serialized) throw new Error(`Independent state hash collision ${key}`);
      return key;
    }
    states.set(key, { state: clone(state), serialized });
    queue.push(key);
    return key;
  }

  const rootKeys = rootStates.map(add).sort();
  while (cursor < queue.length) {
    if (states.size > maxStates) {
      return { complete: false, technicalStopReason: "STATE-LIMIT", rootKeys,
        stateCountObserved: states.size, edgeCountObserved: edges.length };
    }
    const sourceKey = queue[cursor++];
    const source = states.get(sourceKey).state;
    if (source.winner !== null) continue;
    if (source.phase !== "mtaji") {
      return { complete: false, technicalStopReason: "PHASE-ESCAPE", rootKeys,
        stateCountObserved: states.size, edgeCountObserved: edges.length };
    }
    const moves = legalMtajiMoves(source);
    if (!moves.length) {
      return { complete: false, technicalStopReason: "NONCANONICAL-NO-MOVE", rootKeys,
        stateCountObserved: states.size, edgeCountObserved: edges.length };
    }
    branching.push(moves.length);
    for (const move of moves) {
      if (edges.length >= maxEdges) {
        return { complete: false, technicalStopReason: "EDGE-LIMIT", rootKeys,
          stateCountObserved: states.size, edgeCountObserved: edges.length };
      }
      const applied = applyGuardFree(source, move, { maxMicrostates });
      maxMoveMicrosteps = Math.max(maxMoveMicrosteps, applied.microstepCount);
      if (applied.status !== "TERMINATED") {
        return { complete: false, technicalStopReason: applied.status, rootKeys,
          stateCountObserved: states.size, edgeCountObserved: edges.length, maxMoveMicrosteps };
      }
      const targetKey = add(applied.state);
      edges.push(`${sourceKey}\t${moveKey(move)}\t${targetKey}`);
      if (states.size > maxStates) {
        return { complete: false, technicalStopReason: "STATE-LIMIT", rootKeys,
          stateCountObserved: states.size, edgeCountObserved: edges.length, maxMoveMicrosteps };
      }
    }
  }

  const stateKeys = [...states.keys()].sort();
  edges.sort();
  return {
    complete: true,
    technicalStopReason: null,
    rootKeys,
    stateCount: stateKeys.length,
    edgeCount: edges.length,
    branching: summarizeBranching(branching),
    maxMoveMicrosteps,
    stateSetSha256: sha256(stateKeys.join("\n")),
    transitionSetSha256: sha256(edges.join("\n")),
  };
}

module.exports = {
  applyGuardFree,
  enumerateClosure,
  legalMtajiMoves,
  moveKey,
  rawRuleState,
  stableStringify,
  stateKey,
  stateSerialization,
};
