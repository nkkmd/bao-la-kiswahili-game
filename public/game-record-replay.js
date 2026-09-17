"use strict";

(function exposeBaoGameRecordReplay(root) {
  const SUPPORTED_RULES = Object.freeze({
    guide: "bao-la-kiswahili-ja",
    guideVersion: "v0.1.0-draft",
    baseline: "R-002",
  });
  const MAX_FILE_BYTES = 1024 * 1024;
  const MAX_PLIES = 4096;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function byteLength(text) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(text).byteLength;
    if (typeof Buffer !== "undefined") return Buffer.byteLength(text, "utf8");
    return unescape(encodeURIComponent(text)).length;
  }

  function stablePosition(value) {
    if (!value) throw new Error("Bao replay position is missing");
    return clone({
      pits: value.pits,
      reserve: value.reserve,
      houseOwned: value.houseOwned,
      player: value.player,
      phase: value.phase,
      winner: value.winner,
      reason: value.reason || "",
      turn: value.turn,
      pending: value.pending || [0, 0],
    });
  }

  function samePosition(left, right) {
    return JSON.stringify(stablePosition(left)) === JSON.stringify(stablePosition(right));
  }

  function assertRuleCompatibility(record) {
    const rules = record?.rules;
    if (!rules
      || rules.guide !== SUPPORTED_RULES.guide
      || rules.guideVersion !== SUPPORTED_RULES.guideVersion
      || rules.baseline !== SUPPORTED_RULES.baseline) {
      throw new Error("Unsupported Bao game record rules");
    }
  }

  function assertSettings(record) {
    if (!record?.settings || !["computer", "local"].includes(record.settings.mode)) {
      throw new Error("Unsupported Bao game record mode");
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
    if (!engine || typeof engine.applyMove !== "function") throw new Error("Bao engine is required");

    GameRecord.validateRecord(record, true);
    assertRuleCompatibility(record);
    assertSettings(record);
    if (record.moves.length > MAX_PLIES) throw new Error("Bao game record is too long to replay");

    let current = stablePosition(record.initialPosition);
    const states = [clone(current)];
    const transitions = [];

    for (let index = 0; index < record.moves.length; index += 1) {
      const entry = record.moves[index];
      assertMoveMetadata(entry, current, index);
      const applied = engine.applyMove(clone(current), clone(entry.move));
      current = stablePosition(applied.state);
      states.push(clone(current));
      transitions.push({
        entry: clone(entry),
        events: clone(applied.events || []),
      });
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
