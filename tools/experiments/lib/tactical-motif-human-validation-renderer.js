"use strict";

const Sym = require("../../symmetry/transform-candidates.js");

function participantState(state) {
  return state.player === 0 ? JSON.parse(JSON.stringify(state)) : Sym.mirrorState(state);
}
function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"}[ch]));
}
function renderPositionSvg(inputState, options = {}) {
  const state = participantState(inputState);
  const width = options.width || 720, height = options.height || 360;
  const xs = Array.from({length:8}, (_, i) => 92 + i * 76), ys = [92,150,226,284];
  const rowFor = (player, row) => player === 1 ? (row === 1 ? 0 : 1) : (row === 0 ? 2 : 3);
  const screenIndex = (player, index) => player === 1 ? 7 - index : index;
  const marks = [];
  for (let player = 0; player < 2; player += 1) for (let row = 0; row < 2; row += 1) for (let index = 0; index < 8; index += 1) {
    const x = xs[screenIndex(player,index)], y = ys[rowFor(player,row)], count = state.pits[player][row][index];
    const house = row === 0 && index === 4, owned = house && state.houseOwned[player];
    marks.push(`<circle cx="${x}" cy="${y}" r="${house ? 27 : 23}" fill="none" stroke="currentColor" stroke-width="${owned ? 4 : 2}"/>` + `<text x="${x}" y="${y+6}" text-anchor="middle" font-family="monospace" font-size="18">${escapeXml(count)}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bao position"><rect x="40" y="55" width="640" height="270" rx="18" fill="none" stroke="currentColor" stroke-width="3"/><line x1="52" y1="188" x2="668" y2="188" stroke="currentColor" stroke-width="3"/>${marks.join("")}<text x="360" y="30" text-anchor="middle" font-family="sans-serif" font-size="16">MTAJI · SOUTH TO MOVE</text></svg>`;
}
function participantStimulus(row) { return {stimulusId:row.ruleStateKey,phase:"mtaji",actor:"south",svg:renderPositionSvg(row.state)}; }
module.exports = { participantState, participantStimulus, renderPositionSvg };
