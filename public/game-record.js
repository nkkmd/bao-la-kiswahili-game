"use strict";

(function exposeBaoGameRecord(root) {
  const FORMAT = "bao-game-record";
  const VERSION = 1;
  const MOVE_FIELDS = [
    "type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo",
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

  function moveFromValue(move) {
    if (!move || typeof move !== "object") throw new Error("Invalid Bao move");
    const selected = {};
    for (const field of MOVE_FIELDS) {
      if (move[field] !== undefined) selected[field] = clone(move[field]);
    }
    if (!selected.type) throw new Error("Bao move type is required");
    return selected;
  }

  function createRecord(initialState, metadata = {}) {
    return {
      format: FORMAT,
      version: VERSION,
      rules: {
        guide: "bao-la-kiswahili-ja",
        guideVersion: "v0.1.0-draft",
        baseline: "R-002",
      },
      settings: clone(metadata),
      initialPosition: positionFromState(initialState),
      moves: [],
      result: null,
      finalPosition: null,
    };
  }

  function appendMove(record, stateBefore, move) {
    validateRecord(record, false);
    if (record.result !== null) throw new Error("Completed Bao record cannot be changed");
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
    validateRecord(record, false);
    const finalPosition = positionFromState(finalState);
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
    if (!record || record.format !== FORMAT || record.version !== VERSION || !Array.isArray(record.moves)) {
      throw new Error("Unsupported Bao game record format");
    }
    positionFromState(record.initialPosition);
    for (let i = 0; i < record.moves.length; i += 1) {
      const entry = record.moves[i];
      if (!entry || entry.ply !== i + 1 || !entry.move) throw new Error("Invalid Bao move record");
      moveFromValue(entry.move);
    }
    if (requireComplete && (!record.result || !record.finalPosition)) {
      throw new Error("Bao game record is incomplete");
    }
    if (record.finalPosition) positionFromState(record.finalPosition);
    return true;
  }

  function replay(record, engine) {
    validateRecord(record, false);
    if (!engine || typeof engine.applyMove !== "function") throw new Error("Bao engine is required");
    let replayState = positionFromState(record.initialPosition);
    for (const entry of record.moves) replayState = engine.applyMove(replayState, entry.move).state;
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
  const Engine = root.BaoEngine;
  const ReleaseConfig = root.BaoReleaseConfig;
  const t = (english, japanese) => Locale?.t ? Locale.t(english, japanese) : english;
  let currentRecord = null;

  function gameMetadata() {
    const mode = document.querySelector("#game-mode")?.value === "local" ? "local" : "computer";
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
    if (started) currentRecord = createRecord(state, gameMetadata());
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
