"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function node(tagName = "div") {
  return {
    tagName,
    id: "",
    hidden: false,
    style: {},
    children: [],
    listeners: {},
    textContent: "",
    setAttribute() {},
    append(...children) { this.children.push(...children); },
    addEventListener(type, listener) { this.listeners[type] = listener; },
    querySelector(selector) {
      if (!selector.startsWith("#")) return null;
      const id = selector.slice(1);
      return this.children.find((child) => child.id === id) || null;
    },
  };
}

function browserContext() {
  const nodes = new Map();
  const moveChoices = node("div");
  moveChoices.insertAdjacentElement = (_position, child) => nodes.set(`#${child.id}`, child);
  nodes.set("#move-choices", moveChoices);
  nodes.set("#game-mode", { value: "computer" });
  nodes.set("#difficulty", { value: "normal" });
  nodes.set("#player-side", { value: "first" });
  nodes.set("#new-game", node("button"));

  const document = {
    body: node("body"),
    querySelector(selector) { return nodes.get(selector) || null; },
    createElement(tagName) { return node(tagName); },
  };
  const context = {
    console,
    document,
    BaoLocale: { t: (english) => english },
    BaoEngine: {},
    BaoReleaseConfig: {
      GENERATION: "AI-GEN4",
      RELEASE_ID: "AI-GEN4-RELEASE-001",
      displayIdentity: () => ({
        label: "AI-GEN4",
        releaseId: "AI-GEN4-RELEASE-001",
        evaluator: "AI-GEN3-baseline",
      }),
    },
    setTimeout,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob,
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(`
    let state;
    let started = false;
    function freshState() {
      return {
        pits: [[Array(8).fill(0), Array(8).fill(0)], [Array(8).fill(0), Array(8).fill(0)]],
        reserve: [22, 22], houseOwned: [true, true], player: 0, phase: "namua",
        winner: null, reason: "", turn: 1, pending: [0, 0],
      };
    }
    state = freshState();
    function playMove(move) {
      if (move.fail) throw new Error("move failed");
      state.turn += 1;
      state.player = 1 - state.player;
    }
    function afterMove() {}
    function resetGame() { state = freshState(); }
  `, context);
  const source = fs.readFileSync("public/game-record.js", "utf8");
  vm.runInContext(source, context);
  return { context, nodes };
}

test("browser hook starts a memory-only record on reset and records committed moves", () => {
  const { context } = browserContext();
  vm.runInContext(`
    started = true;
    resetGame();
    playMove({ type: "takata", phase: "namua", row: 0, index: 5, direction: "left" });
  `, context);
  const record = vm.runInContext("BaoGameRecord.activeRecord()", context);
  assert.equal(record.settings.mode, "computer");
  assert.equal(record.settings.ai.generation, "AI-GEN4");
  assert.equal(record.moves.length, 1);
  assert.equal(record.moves[0].turn, 1);
  assert.equal(record.moves[0].player, 0);
  assert.equal(record.moves[0].move.index, 5);
});

test("failed UI moves are rolled back from the record", () => {
  const { context } = browserContext();
  vm.runInContext("started = true; resetGame();", context);
  assert.throws(() => vm.runInContext("playMove({ type: 'takata', fail: true });", context), /move failed/);
  const record = vm.runInContext("BaoGameRecord.activeRecord()", context);
  assert.equal(record.moves.length, 0);
});

test("save action appears only after the game has a winner", () => {
  const { context, nodes } = browserContext();
  vm.runInContext(`
    started = true;
    resetGame();
    playMove({ type: "takata", phase: "namua", row: 0, index: 5, direction: "left" });
  `, context);
  const panel = nodes.get("#game-record-actions");
  assert.equal(panel.hidden, true);
  assert.equal(panel.style.display, "none");

  vm.runInContext(`
    state.winner = 0;
    state.reason = "front-empty";
    afterMove();
  `, context);
  const record = vm.runInContext("BaoGameRecord.activeRecord()", context);
  assert.equal(record.result.winner, 0);
  assert.equal(record.result.reason, "front-empty");
  assert.equal(panel.hidden, false);
  assert.equal(panel.style.display, "flex");
});
