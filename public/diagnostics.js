"use strict";

(function exposeBaoDiagnostics(root) {
  const Rules = root.BaoRuleVersions || (typeof module !== "undefined" && module.exports ? require("./rule-versions.js") : null);
  const STORAGE_KEY = "bao_ai_feedback_v1";
  const FORMAT_VERSION = 2;
  const MOVE_FIELDS = [
    "type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo",
  ];
  const STAT_FIELDS = [
    "elapsedMs", "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
    "completedDepth", "timedOut", "evaluationRequests", "evaluations",
    "evaluationCacheHits", "evaluationCachePeak", "evaluationCacheEvictions",
    "evaluationCandidate", "evaluationFallback", "ruleRevision", "aiRevision",
  ];
  const NUMERIC_STAT_FIELDS = STAT_FIELDS.filter((field) => !["timedOut", "evaluationCandidate", "evaluationFallback", "ruleRevision", "aiRevision"].includes(field));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function finiteOrNull(value) {
    return Number.isFinite(value) ? value : null;
  }

  function positionFromState(state, revision = Rules.CURRENT_REVISION) {
    return Rules.canonicalPosition(state, revision);
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
    const version = context.version ?? FORMAT_VERSION;
    const rules = context.rules ?? (version === 1 ? Rules.LEGACY_RULES : Rules.CURRENT_RULES);
    const revision = Rules.revisionFor(version, rules);
    const snapshot = {
      format: "bao-ai-diagnostic",
      version,
      ...(version === 2 ? { rules: clone(rules) } : {}),
      position: positionFromState(state, revision),
    };
    if (context.mode === "computer" || context.mode === "local") snapshot.mode = context.mode;
    if (context.ai) {
      snapshot.ai = {
        level: String(context.ai.level || "unknown"),
        profile: String(context.ai.profile || "bao"),
        move: selectedFields(context.ai.move, MOVE_FIELDS),
        stats: selectedFields(context.ai.stats, STAT_FIELDS, NUMERIC_STAT_FIELDS),
      };
    }
    if (context.reason === "unexpected-ai-move") snapshot.reason = context.reason;
    stateFromSnapshot(snapshot);
    return snapshot;
  }

  function stateFromSnapshot(snapshot) {
    if (snapshot?.format !== "bao-ai-diagnostic" || ![1, FORMAT_VERSION].includes(snapshot.version)) {
      throw new Error("Unsupported Bao diagnostic format");
    }
    const rules = rulesFromSnapshot(snapshot);
    Rules.validatePosition(snapshot.position, rules.baseline);
    if (snapshot.ai?.stats?.ruleRevision !== undefined && snapshot.ai.stats.ruleRevision !== rules.baseline) {
      throw new Error("Bao diagnostic AI rules mismatch");
    }
    return positionFromState(snapshot.position, rules.baseline);
  }

  function rulesFromSnapshot(snapshot) {
    if (snapshot?.format !== "bao-ai-diagnostic" || ![1, FORMAT_VERSION].includes(snapshot.version)) throw new Error("Unsupported Bao diagnostic format");
    if (snapshot.version === 1 && Object.hasOwn(snapshot, "rules")) throw new Error("Legacy Bao diagnostic cannot contain rules");
    const rules = snapshot.version === 1 ? Rules.LEGACY_RULES : snapshot.rules;
    Rules.revisionFor(snapshot.version, rules);
    return clone(rules);
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
    rulesFromSnapshot,
    readMarked,
    markSnapshot,
    clearMarked,
    stringify,
  };
  root.BaoDiagnostics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
