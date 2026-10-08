"use strict";

(function exposeBaoGameRecordReplay(root) {
  const Rules = root.BaoRuleVersions || (typeof module !== "undefined" && module.exports ? require("./rule-versions.js") : null);
  const SUPPORTED_RULES = Rules.CURRENT_RULES;
  const MAX_FILE_BYTES = 256 * 1024;
  const MAX_PLIES = 1024;
  const TOP_LEVEL_KEYS = ["format", "version", "rules", "settings", "initialPosition", "moves", "result", "finalPosition"];
  const RULE_KEYS = ["guide", "guideVersion", "baseline"];
  const SETTINGS_KEYS = ["mode", "humanSide", "ai"];
  const AI_KEYS = ["difficulty", "generation", "releaseId", "adoptionId", "evaluator", "ruleRevision", "aiRevision"];
  const POSITION_KEYS = ["pits", "reserve", "houseOwned", "player", "phase", "winner", "reason", "turn", "pending"];
  const MOVE_ENTRY_KEYS = ["ply", "turn", "player", "side", "phase", "move"];
  const RESULT_KEYS = ["winner", "winnerSide", "reason", "plies"];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function byteLength(text) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(text).byteLength;
    if (typeof Buffer !== "undefined") return Buffer.byteLength(text, "utf8");
    return unescape(encodeURIComponent(text)).length;
  }

  function stablePosition(value, revision = Object.hasOwn(value || {}, "takasia") ? Rules.CURRENT_REVISION : Rules.LEGACY_REVISION) {
    return Rules.canonicalPosition(value, revision);
  }

  function samePosition(left, right) {
    return JSON.stringify(stablePosition(left)) === JSON.stringify(stablePosition(right));
  }

  function assertOnlyKeys(value, allowed, label) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Invalid Bao game record ${label}`);
    }
    const extra = Object.keys(value).filter((key) => !allowed.includes(key));
    if (extra.length) throw new Error(`Unknown Bao game record ${label} field: ${extra[0]}`);
  }

  function assertShape(record, moveFields) {
    assertOnlyKeys(record, TOP_LEVEL_KEYS, "top-level");
    assertOnlyKeys(record.rules, RULE_KEYS, "rules");
    assertOnlyKeys(record.settings, SETTINGS_KEYS, "settings");
    const positionKeys = record.version === 2 ? [...POSITION_KEYS, "takasia"] : POSITION_KEYS;
    assertOnlyKeys(record.initialPosition, positionKeys, "initial position");
    assertOnlyKeys(record.finalPosition, positionKeys, "final position");
    assertOnlyKeys(record.result, RESULT_KEYS, "result");
    if (record.settings.ai !== undefined) assertOnlyKeys(record.settings.ai,
      record.version === 2 ? AI_KEYS : AI_KEYS.filter((key) => !["ruleRevision", "aiRevision"].includes(key)), "AI settings");
    for (const entry of record.moves) {
      assertOnlyKeys(entry, MOVE_ENTRY_KEYS, "move entry");
      assertOnlyKeys(entry.move, moveFields, "move");
    }
  }

  function assertRuleCompatibility(record) {
    return Rules.revisionFor(record?.version, record?.rules);
  }

  function assertSettings(record) {
    if (!record?.settings || !["computer", "local"].includes(record.settings.mode)) {
      throw new Error("Unsupported Bao game record mode");
    }
    if (record.settings.mode === "computer") {
      if (!["south", "north"].includes(record.settings.humanSide)
        || !record.settings.ai || typeof record.settings.ai !== "object") {
        throw new Error("Invalid Bao game record computer settings");
      }
    }
  }

  function assertMoveMetadata(entry, state, index) {
    if (entry.ply !== index + 1
      || entry.turn !== state.turn
      || entry.player !== state.player
      || entry.side !== (state.player === 0 ? "south" : "north")
      || entry.phase !== state.phase) {
      throw new Error(`Bao game record move metadata mismatch at ply ${index + 1}`);
    }
  }

  function assertResult(record, finalState) {
    if (!record.result || !record.finalPosition) throw new Error("Bao game record is incomplete");
    if (finalState.winner !== 0 && finalState.winner !== 1) {
      throw new Error("Bao game record does not end in a winner");
    }
    if (record.result.plies !== record.moves.length
      || record.result.winner !== finalState.winner
      || record.result.winnerSide !== (finalState.winner === 0 ? "south" : "north")
      || (record.result.reason || "") !== (finalState.reason || "")) {
      throw new Error("Bao game record result mismatch");
    }
  }

  function buildSession(record, engine) {
    const GameRecord = root.BaoGameRecord;
    if (!GameRecord || typeof GameRecord.validateRecord !== "function") {
      throw new Error("Bao game record verifier unavailable");
    }
    GameRecord.validateRecord(record, true);
    assertShape(record, GameRecord.MOVE_FIELDS);
    assertRuleCompatibility(record);
    engine = Rules.engineFor(record.version, record.rules, engine);
    assertSettings(record);
    if (record.moves.length > MAX_PLIES) throw new Error("Bao game record is too long to replay");
    if (typeof engine.initialState !== "function"
      || !samePosition(record.initialPosition, engine.initialState())) {
      throw new Error("Bao game record initial position mismatch");
    }

    let current = stablePosition(record.initialPosition);
    const states = [clone(current)];
    const transitions = [];

    for (let index = 0; index < record.moves.length; index += 1) {
      const entry = record.moves[index];
      assertMoveMetadata(entry, current, index);
      const key = (move) => GameRecord.MOVE_FIELDS.map((field) => Object.hasOwn(move, field) ? JSON.stringify(move[field]) : "<absent>").join("|");
      if (current.winner !== null || !engine.moveVariants(current).some((move) => key(move) === key(entry.move))) {
        throw new Error(`Non-canonical or illegal move at ply ${index + 1}`);
      }
      const applied = engine.applyMove(clone(current), clone(entry.move));
      current = stablePosition(applied.state);
      states.push(clone(current));
      transitions.push({ entry: clone(entry) });
    }

    if (!samePosition(current, record.finalPosition)) {
      throw new Error("Bao game record final position mismatch");
    }
    assertResult(record, current);

    return {
      record: clone(record),
      states,
      transitions,
      index: 0,
      engine,
      ruleRevision: Rules.revisionFor(record.version, record.rules),
    };
  }

  function parseText(text, engine) {
    if (typeof text !== "string" || !text.trim()) throw new Error("Bao game record file is empty");
    if (byteLength(text) > MAX_FILE_BYTES) throw new Error("Bao game record file is too large");
    let record;
    try {
      record = JSON.parse(text);
    } catch {
      throw new Error("Bao game record JSON is invalid");
    }
    return buildSession(record, engine);
  }

  function seek(session, index) {
    if (!session || !Array.isArray(session.states)
      || !Number.isInteger(index) || index < 0 || index >= session.states.length) {
      throw new Error("Invalid Bao replay position");
    }
    session.index = index;
    return clone(session.states[index]);
  }

  function transitionAt(session, index = session?.index) {
    if (!session || !Array.isArray(session.transitions)
      || !Number.isInteger(index) || index < 0 || index >= session.transitions.length) return null;
    return clone(session.transitions[index]);
  }

  function descriptor(record) {
    if (record?.settings?.mode === "computer") {
      const ai = record.settings.ai || {};
      return {
        mode: "computer",
        generation: String(ai.generation || "AI"),
        difficulty: String(ai.difficulty || ""),
        releaseId: String(ai.releaseId || ""),
        adoptionId: String(ai.adoptionId || ""),
      };
    }
    return { mode: "local" };
  }

  const api = {
    SUPPORTED_RULES,
    MAX_FILE_BYTES,
    MAX_PLIES,
    stablePosition,
    samePosition,
    buildSession,
    parseText,
    seek,
    transitionAt,
    descriptor,
  };

  root.BaoGameRecordReplay = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));

