"use strict";

(function exposeBaoGameRecord(root) {
  const FORMAT = "bao-game-record";
  const VERSION = 2;
  const Rules = root.BaoRuleVersions || (typeof module !== "undefined" && module.exports ? require("./rule-versions.js") : null);
  const MOVE_FIELDS = [
    "type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo",
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function positionFromState(state, revision = Rules.CURRENT_REVISION) {
    return Rules.canonicalPosition(state, revision);
  }

  function moveFromValue(move) {
    if (!move || typeof move !== "object") throw new Error("Invalid Bao move");
    const selected = {};
    for (const field of MOVE_FIELDS) {
      if (move[field] !== undefined) selected[field] = clone(move[field]);
    }
    if (!selected.type) throw new Error("Bao move type is required");
    return selected;
  }

  function assertRecordHeader(record) {
    if (!record || record.format !== FORMAT || ![1, VERSION].includes(record.version) || !Array.isArray(record.moves)) {
      throw new Error("Unsupported Bao game record format");
    }
    return Rules.revisionFor(record.version, record.rules);
  }

  function createRecord(initialState, metadata = {}, version = VERSION) {
    const rules = version === 1 ? Rules.LEGACY_RULES : Rules.CURRENT_RULES;
    const revision = Rules.revisionFor(version, rules);
    return {
      format: FORMAT,
      version,
      rules: clone(rules),
      settings: clone(metadata),
      initialPosition: positionFromState(initialState, revision),
      moves: [],
      result: null,
      finalPosition: null,
    };
  }

  function appendMove(record, stateBefore, move) {
    assertRecordHeader(record);
    if (record.result !== null) throw new Error("Completed Bao record cannot be changed");
    if (!stateBefore || !Number.isInteger(stateBefore.turn)
      || (stateBefore.player !== 0 && stateBefore.player !== 1) || !stateBefore.phase) {
      throw new Error("Invalid Bao move state");
    }
    const entry = {
      ply: record.moves.length + 1,
      turn: stateBefore.turn,
      player: stateBefore.player,
      side: stateBefore.player === 0 ? "south" : "north",
      phase: stateBefore.phase,
      move: moveFromValue(move),
    };
    record.moves.push(entry);
    return entry;
  }

  function finalize(record, finalState) {
    const revision = assertRecordHeader(record);
    const finalPosition = positionFromState(finalState, revision);
    if (finalPosition.winner !== 0 && finalPosition.winner !== 1) {
      throw new Error("Bao game is not complete");
    }
    record.result = {
      winner: finalPosition.winner,
      winnerSide: finalPosition.winner === 0 ? "south" : "north",
      reason: finalPosition.reason || "",
      plies: record.moves.length,
    };
    record.finalPosition = finalPosition;
    return record;
  }

  function validateRecord(record, requireComplete = true) {
    const revision = assertRecordHeader(record);
    if (record.settings?.ai?.ruleRevision !== undefined && record.settings.ai.ruleRevision !== revision) {
      throw new Error("Bao game record AI rules mismatch");
    }
    Rules.validatePosition(record.initialPosition, revision);
    for (let i = 0; i < record.moves.length; i += 1) {
      const entry = record.moves[i];
      if (!entry || entry.ply !== i + 1 || !entry.move) throw new Error("Invalid Bao move record");
      moveFromValue(entry.move);
    }
    if (requireComplete && (!record.result || !record.finalPosition)) {
      throw new Error("Bao game record is incomplete");
    }
    if (record.finalPosition) Rules.validatePosition(record.finalPosition, revision);
    return true;
  }

  function replay(record, engine) {
    validateRecord(record, false);
    engine = Rules.engineFor(record.version, record.rules, engine);
    const revision = Rules.revisionFor(record.version, record.rules);
    let replayState = positionFromState(record.initialPosition, revision);
    const moveKey = (move) => MOVE_FIELDS.map((field) => Object.hasOwn(move, field) ? JSON.stringify(move[field]) : "<absent>").join("|");
    for (const entry of record.moves) {
      if (entry.turn !== replayState.turn || entry.player !== replayState.player
        || entry.phase !== replayState.phase || entry.side !== (replayState.player === 0 ? "south" : "north")
        || replayState.winner !== null) throw new Error("Bao game record move metadata mismatch");
      if (!engine.moveVariants(replayState).some((move) => moveKey(move) === moveKey(entry.move))) throw new Error("Non-canonical or illegal move in record");
      replayState = engine.applyMove(replayState, entry.move).state;
    }
    return replayState;
  }

  function stringify(record) {
    validateRecord(record, true);
    return JSON.stringify(record, null, 2);
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function timestamp(date = new Date()) {
    return [
      date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()), "-",
      pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()),
    ].join("");
  }

  function filename(date = new Date()) {
    return `bao-game-record-${timestamp(date)}.json`;
  }

  function download(record, date = new Date()) {
    const text = stringify(record);
    const name = filename(date);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return name;
  }

  const api = {
    FORMAT,
    VERSION,
    MOVE_FIELDS,
    createRecord,
    appendMove,
    finalize,
    validateRecord,
    replay,
    stringify,
    filename,
    download,
  };
  root.BaoGameRecord = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (typeof document === "undefined" || typeof root.playMove !== "function"
    || typeof root.afterMove !== "function" || typeof root.resetGame !== "function") return;

  const Locale = root.BaoLocale;
  const ReleaseConfig = root.BaoReleaseConfig;
  const t = (english, japanese) => Locale?.t ? Locale.t(english, japanese) : english;
  let currentRecord = null;

  function gameMetadata() {
    const selectedMode = document.querySelector("#game-mode")?.value || "computer";
    if (selectedMode === "replay") return null;
    const mode = selectedMode === "local" ? "local" : "computer";
    const metadata = { mode };
    if (mode === "computer") {
      const difficulty = document.querySelector("#difficulty")?.value || "normal";
      const playerSide = document.querySelector("#player-side")?.value === "second" ? "north" : "south";
      const identity = ReleaseConfig?.displayIdentity?.(difficulty) || {};
      metadata.humanSide = playerSide;
      metadata.ai = {
        difficulty,
        generation: identity.label || ReleaseConfig?.GENERATION || "unknown",
        releaseId: identity.releaseId || ReleaseConfig?.RELEASE_ID || "unknown",
      };
      if (identity.adoptionId) metadata.ai.adoptionId = identity.adoptionId;
      if (identity.evaluator) metadata.ai.evaluator = identity.evaluator;
      if (ReleaseConfig?.RULE_REVISION) metadata.ai.ruleRevision = ReleaseConfig.RULE_REVISION;
      if (ReleaseConfig?.AI_REVISION) metadata.ai.aiRevision = ReleaseConfig.AI_REVISION;
    }
    return metadata;
  }

  function ensureUi() {
    let panel = document.querySelector("#game-record-actions");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "game-record-actions";
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    panel.style.display = "none";
    panel.style.flexWrap = "wrap";
    panel.style.alignItems = "center";
    panel.style.justifyContent = "center";
    panel.style.gap = "8px";
    panel.style.padding = "10px 8px 12px";

    const button = document.createElement("button");
    button.id = "save-game-record";
    button.type = "button";
    button.textContent = t("Save game record", "棋譜を保存");

    const status = document.createElement("span");
    status.id = "game-record-status";
    status.style.fontSize = "12px";
    status.style.color = "#a8c98b";

    panel.append(button, status);
    const choices = document.querySelector("#move-choices");
    if (choices) choices.insertAdjacentElement("afterend", panel);
    else document.querySelector("#game")?.insertAdjacentElement("afterend", panel);

    button.addEventListener("click", () => {
      if (!currentRecord?.result) return;
      try {
        const name = download(currentRecord);
        status.textContent = t(`Saved: ${name}`, `保存しました: ${name}`);
      } catch {
        status.textContent = t("Could not save the game record.", "棋譜を保存できませんでした。");
      }
    });
    return panel;
  }

  function hideSaveAction() {
    const panel = ensureUi();
    panel.hidden = true;
    panel.style.display = "none";
    const status = panel.querySelector?.("#game-record-status") || document.querySelector("#game-record-status");
    if (status) status.textContent = "";
  }

  function showSaveAction() {
    const panel = ensureUi();
    panel.hidden = false;
    panel.style.display = "flex";
  }

  function finishRecordIfNeeded() {
    if (!currentRecord || currentRecord.result || state?.winner === null || state?.winner === undefined) return;
    try {
      finalize(currentRecord, state);
      showSaveAction();
    } catch {
      hideSaveAction();
    }
  }

  const originalPlayMove = root.playMove;
  root.playMove = function recordablePlayMove(move) {
    let appended = false;
    if (currentRecord && started && state?.winner === null) {
      appendMove(currentRecord, state, move);
      appended = true;
    }
    try {
      return originalPlayMove(move);
    } catch (error) {
      if (appended) currentRecord.moves.pop();
      throw error;
    }
  };

  const originalAfterMove = root.afterMove;
  root.afterMove = function recordableAfterMove(...args) {
    const value = originalAfterMove(...args);
    finishRecordIfNeeded();
    return value;
  };

  const originalResetGame = root.resetGame;
  root.resetGame = function recordableResetGame(...args) {
    currentRecord = null;
    hideSaveAction();
    const value = originalResetGame(...args);
    const metadata = gameMetadata();
    if (started && metadata) currentRecord = createRecord(state, metadata);
    return value;
  };

  document.querySelector("#new-game")?.addEventListener("click", () => {
    if (!started) {
      currentRecord = null;
      hideSaveAction();
    }
  });

  ensureUi();
  api.activeRecord = () => currentRecord ? clone(currentRecord) : null;
}(typeof window !== "undefined" ? window : globalThis));

