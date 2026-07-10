"use strict";

(function exposeBaoDiagnostics(root) {
  const STORAGE_KEY = "bao_ai_feedback_v1";
  const FORMAT_VERSION = 1;
  const MOVE_FIELDS = [
    "type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo",
  ];
  const STAT_FIELDS = [
    "elapsedMs", "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
    "completedDepth", "timedOut", "evaluationRequests", "evaluations",
    "evaluationCacheHits", "evaluationCachePeak", "evaluationCacheEvictions",
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function finiteOrNull(value) {
    return Number.isFinite(value) ? value : null;
  }

  function positionFromState(state) {
    if (!state || !Array.isArray(state.pits) || !Array.isArray(state.reserve)) {
      throw new Error("Invalid Bao state");
    }
    return clone({
      pits: state.pits,
      reserve: state.reserve,
      houseOwned: state.houseOwned,
      player: state.player,
      phase: state.phase,
      winner: state.winner,
      reason: state.reason || "",
      turn: state.turn,
      pending: state.pending || [0, 0],
    });
  }

  function selectedFields(source, fields, numericFields = []) {
    if (!source) return null;
    const result = {};
    for (const field of fields) {
      if (source[field] === undefined) continue;
      result[field] = numericFields.includes(field)
        ? finiteOrNull(source[field]) : clone(source[field]);
    }
    return result;
  }

  function createSnapshot(state, context = {}) {
    const snapshot = {
      format: "bao-ai-diagnostic",
      version: FORMAT_VERSION,
      position: positionFromState(state),
    };
    if (context.mode === "computer" || context.mode === "local") snapshot.mode = context.mode;
    if (context.ai) {
      snapshot.ai = {
        level: String(context.ai.level || "unknown"),
        profile: String(context.ai.profile || "bao"),
        move: selectedFields(context.ai.move, MOVE_FIELDS),
        stats: selectedFields(context.ai.stats, STAT_FIELDS, STAT_FIELDS),
      };
    }
    if (context.reason === "unexpected-ai-move") snapshot.reason = context.reason;
    return snapshot;
  }

  function stateFromSnapshot(snapshot) {
    if (snapshot?.format !== "bao-ai-diagnostic" || snapshot.version !== FORMAT_VERSION) {
      throw new Error("Unsupported Bao diagnostic format");
    }
    return positionFromState(snapshot.position);
  }

  function readMarked(storage) {
    try {
      const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function markSnapshot(storage, snapshot, limit = 50) {
    stateFromSnapshot(snapshot);
    const records = readMarked(storage);
    records.push(clone(snapshot));
    const limited = records.slice(-Math.max(1, limit));
    storage.setItem(STORAGE_KEY, JSON.stringify(limited));
    return limited;
  }

  function clearMarked(storage) {
    storage.removeItem(STORAGE_KEY);
  }

  function stringify(value) {
    return JSON.stringify(value, null, 2);
  }

  const api = {
    STORAGE_KEY,
    FORMAT_VERSION,
    createSnapshot,
    stateFromSnapshot,
    readMarked,
    markSnapshot,
    clearMarked,
    stringify,
  };
  root.BaoDiagnostics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
