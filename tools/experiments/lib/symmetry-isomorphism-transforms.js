"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");

const IDS = Object.freeze({
  IDENTITY: "SIP-C00-IDENTITY",
  SEAT_SWAP: "SIP-T01-SEAT-SWAP-LOCAL",
  LR_MTAJI_HOUSELESS: "SIP-T02-LR-MTAJI-HOUSELESS",
  SEAT_SWAP_LR_MTAJI_HOUSELESS: "SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS",
  NEGATIVE_LR_NO_DIRECTION: "SIP-C01-LR-NO-DIRECTION-FLIP",
});

const DEFINITIONS = Object.freeze({
  [IDS.IDENTITY]: Object.freeze({
    candidateId: IDS.IDENTITY,
    role: "positive-control",
    swapPlayers: false,
    reverseIndex: false,
    flipDirection: false,
    flipSide: false,
    applicability: "all",
  }),
  [IDS.SEAT_SWAP]: Object.freeze({
    candidateId: IDS.SEAT_SWAP,
    role: "scientific",
    swapPlayers: true,
    reverseIndex: false,
    flipDirection: false,
    flipSide: false,
    applicability: "all",
  }),
  [IDS.LR_MTAJI_HOUSELESS]: Object.freeze({
    candidateId: IDS.LR_MTAJI_HOUSELESS,
    role: "scientific",
    swapPlayers: false,
    reverseIndex: true,
    flipDirection: true,
    flipSide: true,
    applicability: "mtaji-houseless",
  }),
  [IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS]: Object.freeze({
    candidateId: IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS,
    role: "scientific",
    swapPlayers: true,
    reverseIndex: true,
    flipDirection: true,
    flipSide: true,
    applicability: "mtaji-houseless",
  }),
  [IDS.NEGATIVE_LR_NO_DIRECTION]: Object.freeze({
    candidateId: IDS.NEGATIVE_LR_NO_DIRECTION,
    role: "negative-control",
    swapPlayers: false,
    reverseIndex: true,
    flipDirection: false,
    flipSide: false,
    applicability: "mtaji-houseless",
  }),
});

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function definitionFor(candidateId) {
  const definition = DEFINITIONS[candidateId];
  if (!definition) throw new Error(`Unknown symmetry candidate: ${candidateId}`);
  return definition;
}

function swap01(value) {
  if (value === null || value === undefined) return value;
  if (value !== 0 && value !== 1) throw new Error(`Expected player id 0/1/null, got ${value}`);
  return 1 - value;
}

function flipLeftRight(value) {
  if (value === undefined || value === null || value === "") return value;
  if (value === "left") return "right";
  if (value === "right") return "left";
  return value;
}

function transformPair(values, swapPlayers) {
  const pair = values || [0, 0];
  return swapPlayers ? [pair[1], pair[0]] : [pair[0], pair[1]];
}

function transformPits(pits, definition) {
  const result = [null, null];
  for (let targetPlayer = 0; targetPlayer < 2; targetPlayer += 1) {
    const sourcePlayer = definition.swapPlayers ? 1 - targetPlayer : targetPlayer;
    result[targetPlayer] = [E.FRONT, E.BACK].map((row) => {
      const source = pits[sourcePlayer][row];
      if (!definition.reverseIndex) return source.slice();
      const target = Array(8).fill(0);
      for (let sourceIndex = 0; sourceIndex < 8; sourceIndex += 1) {
        target[7 - sourceIndex] = source[sourceIndex];
      }
      return target;
    });
  }
  return result;
}

function transformState(state, candidateId) {
  const definition = definitionFor(candidateId);
  const transformed = clone(state);
  transformed.pits = transformPits(state.pits, definition);
  transformed.reserve = transformPair(state.reserve, definition.swapPlayers);
  transformed.houseOwned = transformPair(state.houseOwned, definition.swapPlayers);
  transformed.pending = transformPair(state.pending || [0, 0], definition.swapPlayers);
  transformed.player = definition.swapPlayers ? swap01(state.player) : state.player;
  transformed.winner = definition.swapPlayers ? swap01(state.winner) : state.winner;
  return transformed;
}

function transformMove(move, candidateId) {
  const definition = definitionFor(candidateId);
  const transformed = clone(move);
  if (typeof transformed.player === "number" && definition.swapPlayers) {
    transformed.player = swap01(transformed.player);
  }
  if (typeof transformed.index === "number" && definition.reverseIndex) {
    transformed.index = 7 - transformed.index;
  }
  if (typeof transformed.start === "number" && definition.reverseIndex) {
    transformed.start = 7 - transformed.start;
  }
  if (definition.flipDirection && typeof transformed.direction === "string") {
    transformed.direction = flipLeftRight(transformed.direction);
  }
  if (definition.flipSide && typeof transformed.side === "string") {
    transformed.side = flipLeftRight(transformed.side);
  }
  return transformed;
}

function exactMoveKey(move) {
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

function rawStateKey(state) {
  return sha256(stableStringify(rawRuleState(state)));
}

function isApplicable(state, candidateId) {
  const definition = definitionFor(candidateId);
  if (definition.applicability === "all") return ["namua", "mtaji"].includes(state.phase);
  if (definition.applicability === "mtaji-houseless") {
    return state.phase === "mtaji"
      && state.reserve?.[0] === 0 && state.reserve?.[1] === 0
      && state.houseOwned?.[0] === false && state.houseOwned?.[1] === false;
  }
  throw new Error(`Unknown applicability: ${definition.applicability}`);
}

function definitionHash(candidateId) {
  return sha256(stableStringify(definitionFor(candidateId)));
}

module.exports = {
  DEFINITIONS,
  IDS,
  definitionFor,
  definitionHash,
  exactMoveKey,
  flipLeftRight,
  isApplicable,
  rawRuleState,
  rawStateKey,
  stableStringify,
  transformMove,
  transformState,
};
