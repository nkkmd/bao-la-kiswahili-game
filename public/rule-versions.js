"use strict";

(function exposeBaoRuleVersions(root) {
  const CURRENT_REVISION = "BAO-RULES-V0.2.0-TAKASIA-001";
  const LEGACY_REVISION = "R-002";
  const LEGACY_RULES = Object.freeze({ guide: "bao-la-kiswahili-ja", guideVersion: "v0.1.0-draft", baseline: LEGACY_REVISION });
  const CURRENT_RULES = Object.freeze({ guide: "bao-la-kiswahili-ja", guideVersion: "v0.2.0", baseline: CURRENT_REVISION });
  const POSITION_KEYS = ["pits", "reserve", "houseOwned", "player", "phase", "winner", "reason", "turn", "pending"];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const object = (value) => value && typeof value === "object" && !Array.isArray(value);

  function revisionFor(version, rules) {
    const expected = version === 1 ? LEGACY_RULES : version === 2 ? CURRENT_RULES : null;
    if (!expected || !object(rules) || Object.keys(rules).length !== 3
      || Object.keys(expected).some((key) => rules[key] !== expected[key])) {
      throw new Error("Unsupported Bao game record rules");
    }
    return expected.baseline;
  }

  function assertTakasia(state, value) {
    if (value === null) return;
    if (!object(value) || Object.keys(value).length !== 2
      || !Object.hasOwn(value, "player") || !Object.hasOwn(value, "index")
      || value.player !== state.player || ![0, 1].includes(value.player)
      || !Number.isInteger(value.index) || value.index < 0 || value.index > 7
      || state.phase !== "mtaji" || state.winner !== null
      || state.reserve?.some((count) => count !== 0)
      || (value.index === 4 && state.houseOwned?.[value.player] === true)) {
      throw new Error("Invalid Bao takasia state");
    }
  }

  function canonicalPosition(state, revision = CURRENT_REVISION) {
    if (!state || !Array.isArray(state.pits) || !Array.isArray(state.reserve)) throw new Error("Invalid Bao state");
    if (![CURRENT_REVISION, LEGACY_REVISION].includes(revision)) throw new Error("Unsupported Bao position rules");
    const value = {
      pits: state.pits, reserve: state.reserve, houseOwned: state.houseOwned,
      player: state.player, phase: state.phase, winner: state.winner,
      reason: state.reason || "", turn: state.turn, pending: state.pending || [0, 0],
    };
    if (revision === CURRENT_REVISION) {
      assertTakasia(state, state.takasia ?? null);
      value.takasia = state.takasia ?? null;
    } else if (Object.hasOwn(state, "takasia")) {
      throw new Error("Legacy Bao position cannot contain takasia");
    }
    return clone(value);
  }

  function validatePosition(value, revision) {
    if (![CURRENT_REVISION, LEGACY_REVISION].includes(revision)) throw new Error("Unsupported Bao position rules");
    const allowed = revision === CURRENT_REVISION ? [...POSITION_KEYS, "takasia"] : POSITION_KEYS;
    if (!object(value) || Object.keys(value).some((key) => !allowed.includes(key))
      || allowed.some((key) => !Object.hasOwn(value, key))) throw new Error("Invalid Bao position fields");
    const integer = (n, max) => Number.isInteger(n) && n >= 0 && n <= max;
    if (!Array.isArray(value.pits) || value.pits.length !== 2
      || value.pits.some((rows) => !Array.isArray(rows) || rows.length !== 2
        || rows.some((row) => !Array.isArray(row) || row.length !== 8 || row.some((n) => !integer(n, 64))))
      || !Array.isArray(value.reserve) || value.reserve.length !== 2 || value.reserve.some((n) => !integer(n, 32))
      || !Array.isArray(value.pending) || value.pending.length !== 2 || value.pending.some((n) => !integer(n, 64))
      || !Array.isArray(value.houseOwned) || value.houseOwned.length !== 2 || value.houseOwned.some((b) => typeof b !== "boolean")
      || ![0, 1].includes(value.player) || !["namua", "mtaji"].includes(value.phase)
      || ![null, 0, 1].includes(value.winner) || !integer(value.turn, 10000) || value.turn === 0
      || typeof value.reason !== "string" || value.reason.length > 64 || /[\u0000-\u001f\u007f]/.test(value.reason)) {
      throw new Error("Invalid Bao position values");
    }
    if (revision === CURRENT_REVISION) assertTakasia(value, value.takasia);
    return true;
  }

  function engineFor(version, rules, currentEngine = root.BaoEngine) {
    const revision = revisionFor(version, rules);
    let engine;
    if (revision === CURRENT_REVISION) {
      engine = currentEngine;
      if (!engine && typeof module !== "undefined" && module.exports) engine = require("./engine.js");
      if (typeof engine?.detectTakasia !== "function") throw new Error("Takasia engine is unavailable");
    } else {
      engine = root.BaoLegacyEngine;
      if (!engine && typeof module !== "undefined" && module.exports) engine = require("./engine-r002.js");
      if (typeof engine?.detectTakasia === "function") throw new Error("Legacy Bao engine mismatch");
    }
    if (typeof engine?.applyMove !== "function") throw new Error("Bao engine is required");
    return engine;
  }

  const api = { CURRENT_REVISION, LEGACY_REVISION, CURRENT_RULES, LEGACY_RULES, POSITION_KEYS,
    revisionFor, engineFor, canonicalPosition, validatePosition };
  root.BaoRuleVersions = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
