"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const F = require("../tools/takasia/fixtures.json");
const records = require("../tools/takasia/record-fixtures.json");

// DOM・Canvasはmock。main全体と実エンジンを実行するが、実ブラウザー確認とは区別する。
function page(language = "ja") {
  const nodes = new Map(), drawn = [];
  const ctx = new Proxy({}, { get: (target, key) => target[key] || ((...args) => drawn.push([key, ...args])) });
  function node() {
    return { textContent: "", hidden: false, children: [], value: "", style: {},
      setAttribute() {}, addEventListener() {}, focus() {}, append(...n) { this.children.push(...n); },
      replaceChildren(...n) { this.children = n; }, clientWidth: 640,
      getContext: () => ctx, getBoundingClientRect: () => ({ width: 640, height: 330 }) };
  }
  const document = { baseURI: "https://example.test/", createElement: node,
    querySelector: selector => { if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector); } };
  const context = vm.createContext({ document, console, URL, URLSearchParams, performance,
    navigator: { language }, location: { search: "?lang=" + language, protocol: "file:" },
    matchMedia: () => ({ matches: false }), requestAnimationFrame() {}, setTimeout(fn) { fn(); return 1; }, clearTimeout() {},
    localStorage: { getItem: key => key === "bao_sound" ? "off" : null, setItem() {} } });
  context.window = context;
  for (const source of ["locale", "engine", "engine-r002", "ai-weights", "logic-evaluator", "ai", "ai-config",
    "ai-candidate", "ai-release", "rule-versions", "diagnostics", "game-record", "game-record-replay", "main"]) {
    vm.runInContext(fs.readFileSync("public/" + source + ".js", "utf8"), context, { filename: source + ".js" });
  }
  const run = code => vm.runInContext(code, context);
  run('gameModeSelect.value = "local"; started = true; sound = false;');
  return { run, context, nodes, drawn };
}
function setPosition(p, state) {
  p.context.input = structuredClone(state);
  p.run("state = E.clone(input); displayState = E.clone(state); moves = E.legalMoves(state); animation = null; selected = null;");
}

for (const lang of ["ja", "en"]) {
  test(lang + "：Northのa4を開始不可として表示し、タップ時に規則を説明する", () => {
    const p = page(lang); setPosition(p, F.e30.post);
    p.run("drawHeader(); drawPit(1, 0, 3);");
    assert.equal(p.nodes.get("#takasia-status").hidden, false);
    assert.match(p.nodes.get("#takasia-status").textContent, /a4/);
    assert.ok(p.drawn.some(x => x[0] === "fillText" && x[1] === "T" && x[2] === 371.5));
    const before = p.run("JSON.stringify(state)");
    p.run("choosePit({ player: 1, row: 0, index: 3 });");
    assert.equal(p.run("selected"), null);
    assert.equal(p.run("JSON.stringify(state)"), before);
    const message = p.nodes.get("#visible-help").children[0].textContent;
    assert.match(message, lang === "ja" ? /開始できません/ : /cannot start/);
    assert.ok(p.nodes.get("#visible-help").children.at(-1).href.endsWith("?lang=" + lang + "#takasia"));
  });
  test(lang + "：通常アニメーションとFASTの終了理由にtakasia停止を残す", () => {
    for (const fast of [false, true]) {
      const p = page(lang); setPosition(p, F.e30.post);
      p.run("fast = " + fast + '; playMove(moves.find(m => m.index === 7 && m.direction === "left"));');
      p.run("for (let n = 0; animation && n < 200; n++) loop(animation.nextAt + 1); drawHeader();");
      assert.equal(p.run("animation"), null);
      assert.equal(p.run("state.takasia"), null);
      assert.equal(p.nodes.get("#takasia-status").hidden, true);
      assert.equal(p.run("state.pits[1][0][3]"), 5);
      assert.match(p.run("latestRuleCommentary.message"), /TAKASIA STOP/);
      assert.match(p.run("latestRuleCommentary.message"), /a4/);
    }
  });
  test(lang + "：新旧の実棋譜で戻る・進む・対象・終了理由・版表示が一致する", () => {
    const p = page(lang);
    p.context.current = records.current.record; p.context.legacy = records.legacy.record;
    p.run('gameModeSelect.value = "replay"; replaySession = BaoGameRecordReplay.buildSession(current, E);');
    const index = p.run("replaySession.states.findIndex(s => s.takasia)");
    assert.ok(index > 0);
    p.run("setReplayPosition(" + index + "); drawHeader();");
    assert.equal(p.nodes.get("#takasia-status").hidden, false);
    assert.match(p.run("latestRuleCommentary.message"), /TAKASIA/);
    assert.match(p.nodes.get("#replay-move-detail").textContent, /v0.2.0/);
    p.run("fast = true; replayNext(); drawHeader();");
    assert.equal(p.run("replaySession.index"), index + 1);
    assert.equal(p.nodes.get("#takasia-status").hidden, true);
    assert.match(p.run("latestRuleCommentary.message"), /TAKASIA STOP/);
    p.run("replayBack(); drawHeader();");
    assert.equal(p.run("replaySession.index"), index);
    assert.equal(p.nodes.get("#takasia-status").hidden, false);
    p.run("replaySession = BaoGameRecordReplay.buildSession(legacy, E); setReplayPosition(60); drawHeader();");
    assert.equal(p.nodes.get("#takasia-status").hidden, true);
    assert.match(p.nodes.get("#replay-move-detail").textContent, /R-002/);
    assert.equal(p.run("replaySession.engine === BaoLegacyEngine"), true);
  });
}

test("Southの対象も本人の座標で表示し、後列や旧局面へ印を付けない", () => {
  const p = page(); const state = structuredClone(F.e30.post);
  state.pits.reverse(); state.houseOwned.reverse(); state.player = 0; state.takasia.player = 0;
  setPosition(p, state); p.run("drawHeader(); drawPit(0, 0, 3);");
  assert.match(p.nodes.get("#takasia-status").textContent, /A4/);
  assert.ok(p.drawn.some(x => x[0] === "fillText" && x[1] === "T" && x[2] === 301.5));
  assert.equal(p.run("isTakasiaTarget(state, { player: 0, row: 1, index: 3 })"), false);
  p.run("delete displayState.takasia; drawHeader();");
  assert.equal(p.nodes.get("#takasia-status").hidden, true);
});
test("対象に着地しない応手でも失効を説明し、リセットで表示を消す", () => {
  const p = page(); setPosition(p, F.e30.post);
  p.run('fast = true; playMove(moves.find(m => m.index === 7 && m.direction === "right")); drawHeader();');
  assert.match(p.run("latestRuleCommentary.message"), /失効/);
  p.run("resetGame(); drawHeader();");
  assert.equal(p.nodes.get("#takasia-status").hidden, true);
  assert.equal(p.nodes.get("#takasia-status").textContent, "");
});

test("日英説明・図版・既存anchor・新キャッシュの参照が整合する", () => {
  const guide = fs.readFileSync("public/rules.html", "utf8");
  const ids = [...guide.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const m of guide.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(m[1]), m[1]);
  for (const id of ["goal", "board", "setup", "sowing", "namua", "capture", "mtaji", "nyumba", "takasia", "controls", "rules-used"]) {
    assert.ok(ids.includes(id), id);
  }
  assert.doesNotMatch(guide, /Takasia is not applied|takasiaは不適用|特殊な制約takasiaは、このブラウザゲームでは適用しません/);
  const sw = fs.readFileSync("public/service-worker.js", "utf8");
  for (const name of ["takasia-target", "takasia-stop"]) {
    assert.ok(sw.includes(name));
    assert.match(guide, new RegExp(name + '\\.svg'));
    assert.match(fs.readFileSync("public/assets/rules/" + name + ".svg", "utf8"), /aad9fda3ffb12c2ca785509951c71ce8a42bef5a/);
  }
});
