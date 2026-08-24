#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  applyMtajiGuardFree,
  directStateKey,
  exactMtajiMoves,
  moveKey,
} = require("./lib/restricted-endgame-transition.js");
const IV = require("./lib/restricted-endgame-independent-verifier.js");

const repoRoot = path.resolve(__dirname, "../..");
const oraclePath = path.join(repoRoot, "doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json");

function seedTotal(state) {
  return state.pits.flat(2).reduce((a, b) => a + b, 0)
    + state.reserve.reduce((a, b) => a + b, 0)
    + (state.pending || [0, 0]).reduce((a, b) => a + b, 0);
}

function inflate(ruleState) {
  return { ...JSON.parse(JSON.stringify(ruleState)), reason: "", turn: 1 };
}

function main() {
  const oracle = JSON.parse(fs.readFileSync(oraclePath));
  const storedKeys = new Set(oracle.stateRows.map((row) => row.stateKey));
  const stateRows = oracle.stateRows.map((row) => {
    const state = inflate(row.ruleState);
    const productionKey = directStateKey(state);
    const independentKey = IV.stateKey(state);
    return {
      storedStateKey: row.stateKey,
      productionRecomputedKey: productionKey,
      independentRecomputedKey: independentKey,
      productionKeyMatchesStored: productionKey === row.stateKey,
      independentKeyMatchesStored: independentKey === row.stateKey,
      productionIndependentKeyEqual: productionKey === independentKey,
      seedTotal: seedTotal(state),
      terminal: state.winner !== null,
      winner: state.winner,
      status: row.status,
    };
  });

  const transitions = [];
  for (const row of oracle.stateRows) {
    if (row.ruleState.winner !== null) continue;
    const state = inflate(row.ruleState);
    for (const move of exactMtajiMoves(state)) {
      const applied = applyMtajiGuardFree(state, move);
      const targetKey = applied.status === "TERMINATED" ? directStateKey(applied.state) : null;
      transitions.push({
        sourceStoredKey: row.stateKey,
        sourceRecomputedKey: directStateKey(state),
        moveKey: moveKey(move),
        transitionStatus: applied.status,
        recomputedTargetKey: targetKey,
        targetInStoredKeySet: targetKey !== null && storedKeys.has(targetKey),
      });
    }
  }

  const result = {
    schemaVersion: 1,
    studyId: "SIP-STUDY1",
    classification: "POST-OUTCOME-READ-ONLY-ORACLE-ANCHOR-DIAGNOSTIC",
    changesFormalDecision: false,
    mutatesUpstreamOracle: false,
    stateRows,
    transitions,
    summary: {
      rows: stateRows.length,
      storedKeyMismatchRows: stateRows.filter((row) => !row.productionKeyMatchesStored || !row.independentKeyMatchesStored).length,
      productionIndependentKeyDisagreements: stateRows.filter((row) => !row.productionIndependentKeyEqual).length,
      seedTotals: [...new Set(stateRows.map((row) => row.seedTotal))].sort((a, b) => a - b),
      transitions: transitions.length,
      successorEscapesStoredKeySet: transitions.filter((row) => !row.targetInStoredKeySet).length,
    },
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) main();
