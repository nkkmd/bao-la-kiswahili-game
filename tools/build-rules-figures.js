"use strict";

// 図解用の構成局面。到達可能性を主張せず、描画前に現行エンジンの遷移を確認する。
// 生成されたSVGと解説本文: CC BY-SA 4.0。生成プログラム: MIT。
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const E = require("../public/engine.js");

function fixture(phase, entries, reserve = [0, 0], houseOwned = [false, false]) {
  const state = E.initialState();
  Object.assign(state, { phase, reserve, houseOwned, pits: [[Array(8).fill(0), Array(8).fill(0)], [Array(8).fill(0), Array(8).fill(0)]] });
  for (const [player, row, index, count] of entries) state.pits[player][row][index] = count;
  const total = state.pits.flat(2).reduce((a, b) => a + b, 0) + reserve[0] + reserve[1];
  assert.equal(total, 64, "図解用局面の石の総数");
  return state;
}
function play(state, predicate) {
  const move = E.legalMoves(state).find(predicate);
  assert.ok(move, "図解で選んだ手が合法");
  return E.applyMove(state, move);
}
function examples() {
  const initial = E.initialState();
  const sow = fixture("mtaji", [[0, 0, 2, 3], [0, 0, 5, 2], [1, 0, 0, 1], [1, 1, 0, 58]]);
  const relay = play(sow, m => m.row === 0 && m.index === 2 && m.direction === "right");
  assert.deepEqual(relay.state.pits[0], [[0, 0, 0, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 0, 0, 1]]);
  assert.equal(relay.events.filter(e => e.kind === "capture").length, 0);
  const endFirstSow = relay.events.filter(e => e.kind === "sow")[2].state;
  assert.equal(endFirstSow.pits[0][0][5], 3);
  const capture = fixture("namua", [[0, 0, 3, 2], [0, 1, 7, 14], [1, 0, 4, 3], [1, 0, 0, 1]], [22, 22]);
  const captured = play(capture, m => m.type === "capture" && m.index === 3 && m.side === "left");
  assert.deepEqual(captured.state.pits[0][0], [1, 1, 1, 3, 0, 0, 0, 0]);
  assert.equal(captured.state.pits[1][0][4], 0);
  assert.equal(captured.state.reserve[0], 21);
  assert.equal(captured.state.winner, null);
  const afterTake = captured.events.find(e => e.kind === "capture").state;
  const house = fixture("namua", [[0, 0, 4, 6], [1, 0, 0, 1], [1, 1, 0, 13]], [22, 22], [true, false]);
  const houseTwo = play(house, m => m.houseTwo && m.direction === "right").state;
  assert.deepEqual(houseTwo.pits[0][0], [0, 0, 0, 0, 5, 1, 1, 0]);
  assert.equal(houseTwo.houseOwned[0], true);
  const win = fixture("namua", [[0, 0, 3, 2], [0, 1, 7, 15], [1, 0, 4, 3]], [22, 22]);
  const won = play(win, m => m.type === "capture" && m.side === "left").state;
  assert.equal(won.winner, 0);
  assert.equal(won.reason, "front-empty");
  return { initial, sow, endFirstSow, relay: relay.state, capture, afterTake, captured: captured.state, houseTwo, won };
}

const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
function board(state, { half = false, labelsOnly = false, focus = [], arrows = [], footer = "", frontsOnly = false } = {}) {
  const height = half ? 260 : frontsOnly ? 260 : 410;
  const points = {};
  let body = `<rect width="660" height="${height}" rx="12" fill="#f5f3e9"/>`;
  const txt = (x, y, value, size = 16, fill = "#243e37", weight = 600) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(value)}</text>`;
  const rows = half ? [[0, 0, 78], [0, 1, 172]] : frontsOnly ? [[1, 0, 78], [0, 0, 172]] : [[1, 1, 70], [1, 0, 152], [0, 0, 262], [0, 1, 344]];
  for (const [player, row, y] of rows) {
    body += `<rect x="16" y="${y - 35}" width="628" height="76" rx="12" fill="${row === 0 ? "#dfebd6" : "#e9e8df"}"/>`;
    for (let screenIndex = 0; screenIndex < 8; screenIndex++) {
      const index = player === 0 ? screenIndex : 7 - screenIndex;
      const name = `${player === 0 ? row === 0 ? "A" : "B" : row === 0 ? "a" : "b"}${index + 1}`;
      const x = 57 + screenIndex * 78;
      points[name] = { x, y };
      const house = row === 0 && index === 4;
      const on = focus.includes(name);
      const stroke = on ? "#a54824" : house ? "#8c6b15" : "#527161";
      const fill = house ? "#f6de92" : on ? "#fbe0ca" : "#fffefa";
      const shape = house ? `<rect x="${x - 25}" y="${y - 25}" width="50" height="50" rx="9"` : `<circle cx="${x}" cy="${y}" r="25"`;
      body += `${shape} fill="${fill}" stroke="${stroke}" stroke-width="${on ? 3.5 : 2}"/>`;
      body += txt(x, y + 7, labelsOnly ? name : state.pits[player][row][index], labelsOnly ? 20 : 24);
      if (!labelsOnly) body += txt(x, y + 40, name, 14);
    }
  }
  if (!half) body += txt(330, 23, "NORTH", 17);
  else body += txt(330, 23, "SOUTH", 17);
  if (!half && !frontsOnly) body += txt(330, 218, "SOUTH", 17);
  if (frontsOnly) body += txt(330, 128, "SOUTH", 15);
  for (const [from, to, curve = false] of arrows) {
    const a = points[from], b = points[to];
    if (curve) {
      const y = Math.min(a.y, b.y) - 39;
      body += `<path d="M ${a.x} ${a.y - 28} Q ${(a.x + b.x) / 2} ${y - 20} ${b.x} ${b.y - 28}" fill="none" stroke="#a54824" stroke-width="3" marker-end="url(#arrow)"/>`;
    } else if (a.x === b.x) {
      // 前列から後列への折返しは穴の外側を回し、下の穴番号と重ねない。
      const side = a.x > 330 ? 1 : -1;
      body += `<path d="M ${a.x + side * 29} ${a.y} C ${a.x + side * 55} ${a.y} ${b.x + side * 55} ${b.y} ${b.x + side * 29} ${b.y}" fill="none" stroke="#a54824" stroke-width="3" marker-end="url(#arrow)"/>`;
    } else {
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      body += `<path d="M ${a.x + ux * 29} ${a.y + uy * 29} L ${b.x - ux * 31} ${b.y - uy * 31}" fill="none" stroke="#a54824" stroke-width="3" marker-end="url(#arrow)"/>`;
    }
  }
  if (footer) body += txt(330, height - 9, footer, 17);
  return { body, height };
}
function wrap({ body, height }, title, desc) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="660" height="${height}" viewBox="0 0 660 ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(desc)}</desc>
  <metadata>Adapted from the rule explanations of bao-la-kiswahili-ja contributors, reference 1179267b1f19b27a2138791253f2cb9cbfe98c14. New diagram design and engine-checked examples by bao-la-kiswahili-game contributors, 2026. CC BY-SA 4.0. https://creativecommons.org/licenses/by-sa/4.0/</metadata>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a54824"/></marker></defs>
  <g font-family="system-ui, sans-serif">${body}</g>
</svg>
`;
}
function figures() {
  const e = examples();
  const items = [
    ["board-overview", e.initial, { labelsOnly: true }, "Board coordinates / 盤の座標", "North uses b and a; South uses A and B. A1 faces a8. / Northはb・a列、SouthはA・B列。A1の向かいはa8。"],
    ["initial-setup", e.initial, { footer: "10 + 22 = 32     × 2 = 64" }, "Initial setup / 初期配置", "A5 and a5: 6; A6, A7, a6 and a7: 2; 22 in each hand. / A5・a5に6個、A6・A7・a6・a7に2個、手元は各22個。"],
    ["sowing-before", e.sow, { half: true, focus: ["A3"], arrows: [["A3", "A4"], ["A4", "A5"], ["A5", "A6"]] }, "Sowing: before / 種まき前", "South only. Lift the 3 seeds from A3 and sow to A4, A5, A6. / South側だけを表示。A3の3個をA4・A5・A6へ。"],
    ["sowing-relay", e.endFirstSow, { half: true, focus: ["A6"], footer: "A6: 2 + 1 = 3", arrows: [["A6", "A7"], ["A7", "A8"], ["A8", "B8"]] }, "Relay: continue / 連続種まき", "A6 already held 2 seeds; lift all 3 and continue to A7, A8, B8. / A6は2個から3個になり、全3個をA7・A8・B8へ蒔く。"],
    ["sowing-stop", e.relay, { half: true, focus: ["B8"], footer: "B8: 0 + 1 = 1" }, "Sowing: stop / 種まきの終了", "B8 was empty, so the move ends there. / 最後の石が入る前にB8は空だったため終了。"],
    ["capture-before", e.capture, { frontsOnly: true, focus: ["A4", "a5"], footer: "A4: 2 + 1 = 3" }, "Namua capture: add / namuaの捕獲・投入", "Before adding one seed from hand to A4; a5 holds 3. / 手元からA4へ1個加える前。向かいのa5には3個。"],
    ["capture-taken", e.afterTake, { frontsOnly: true, focus: ["A4", "a5"], footer: "a5: 3 → 0     +3 → A1" }, "Namua capture: take / namuaの捕獲・取り上げ", "A4 now holds 3. All 3 from a5 are lifted, ready to enter at A1. / A4は3個。a5の全3個は取り上げられ、A1から蒔く直前。"],
    ["capture-after", e.captured, { frontsOnly: true, focus: ["A1", "A2", "A3"], arrows: [["A1", "A2"], ["A2", "A3"]] }, "Namua capture: sow / namuaの捕獲・種まき", "Sow the captured 3 into A1, A2, A3. A4 keeps its 3 seeds. / 捕獲した3個をA1・A2・A3へ。A4の3個は残る。"],
    ["nyumba-two", e.houseTwo, { half: true, focus: ["A5"], footer: "A5: 6 + 1 − 2 = 5", arrows: [["A5", "A6"], ["A6", "A7"]] }, "Nyumba: two seeds / nyumbaの2個蒔き", "Starting with only an owned nyumba of 6 in the front row: add 1, sow 2, leave 5. / 前列に所有中のnyumba6個だけがある状態から、1個加え2個蒔き5個残る。"],
    ["front-empty", e.won, { frontsOnly: true, focus: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"] }, "Win: empty front row / 勝利・前列が空", "North's entire front row is empty; South wins immediately. / Northの前列がすべて空となりSouthが直ちに勝つ。"],
  ];
  return Object.fromEntries(items.map(([name, state, options, title, desc]) => [`${name}.svg`, wrap(board(state, options), title, desc)]));
}
if (require.main === module) {
  const out = path.resolve(__dirname, "../public/assets/rules");
  fs.mkdirSync(out, { recursive: true });
  for (const [name, svg] of Object.entries(figures())) {
    if (process.argv.includes("--check")) assert.equal(fs.readFileSync(path.join(out, name), "utf8"), svg, `${name}の再生成一致`);
    else fs.writeFileSync(path.join(out, name), svg);
  }
  console.log("図解10点: 合法手・石数・遷移の確認と" + (process.argv.includes("--check") ? "再生成照合" : "SVG生成") + "に成功");
}
module.exports = { figures, examples };
