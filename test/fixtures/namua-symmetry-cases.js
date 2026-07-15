"use strict";

const E = require("../../public/engine.js");

function initialNyumba() {
  return E.initialState();
}

function oneEntryCapture() {
  const state = E.initialState();
  state.pits = [
    [[0, 0, 2, 0, 6, 0, 0, 0], Array(8).fill(0)],
    [[0, 0, 0, 0, 0, 3, 0, 0], Array(8).fill(0)],
  ];
  return state;
}

module.exports = { initialNyumba, oneEntryCapture };
