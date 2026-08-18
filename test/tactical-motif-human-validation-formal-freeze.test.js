#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const F = require("../tools/experiments/freeze-tactical-motif-human-validation-formal-stimuli.js");

const conditions = ["B-D1", "B-D2", "B-D3", "LS-D2", "V2-D2", "LE-D2"];
const stage1Spec = {
  matching: {
    plyBins: [[44,55],[56,67],[68,79],[80,100]],
    cost: {
      generationConditionMismatch: 4,
      plyBinMismatch: 3,
      actorHouseOwnedMismatch: 4,
      actorLegalMoveCountAbsoluteDifference: 1,
      actorFrontOccupiedAbsoluteDifference: 1,
      actorBoardSeedsAbsoluteDifferencePer8Seeds: 1,
    },
  },
};
const freezeSpec = {
  primaryBlocks: {
    count: 12,
    slotControlSequence: [
      "P_ONLY", "M_ONLY", "MORPH_NEAR",
      "P_ONLY", "M_ONLY", "MORPH_NEAR",
      "P_ONLY", "M_ONLY", "MORPH_NEAR",
      "P_ONLY", "M_ONLY", "MORPH_NEAR",
    ],
    targetBSelection: { maximumAcceptedCost: 10 },
  },
  secondaryMoveChoice: {
    count: 6,
    stratumOrder: conditions,
  },
};

function row(className, index, conditionId) {
  return {
    className,
    historicalTrajectoryHash: `traj-${className}-${index}`,
    seed: 30000000 + index,
    gameId: `g-${className}-${index}`,
    conditionId,
    openingPrefixHash: `opening-${className}-${index}`,
    ply: 48 + (index % 4),
    ruleStateKey: `rule-${className}-${index}`,
    historicalStateHash: `state-${className}-${index}`,
    actorFeatures: {
      houseOwned: false,
      legalMoveCount: 3,
      frontOccupied: 4,
      boardSeeds: 32,
    },
    state: { pits: [], reserve: [0,0], houseOwned: [false,false], player: 0, phase: "mtaji", pending: [] },
    participantStimulus: { stimulusId: `rule-${className}-${index}`, phase: "mtaji", actor: "south", svg: `<svg>${className}-${index}</svg>` },
  };
}

const targets = Array.from({ length: 96 }, (_, i) => row("C03_TARGET", i, conditions[i % conditions.length]));
const controls = Object.fromEntries(["P_ONLY", "M_ONLY", "MORPH_NEAR"].map((className, ci) => [
  className,
  Array.from({ length: 32 }, (_, i) => row(className, i + ci * 1000, conditions[i % conditions.length])),
]));
const pool = {
  classes: { C03_TARGET: targets, ...controls },
  matches: {},
};
for (const className of Object.keys(controls)) {
  pool.matches[className] = controls[className].map((control, i) => ({
    targetRuleStateKey: targets[i].ruleStateKey,
    controlRuleStateKey: control.ruleStateKey,
    cost: 0,
    tieBreak: `legacy-${className}-${i}`,
  }));
}

const a = F.selectFormalStimuli(pool, stage1Spec, freezeSpec);
const b = F.selectFormalStimuli(pool, stage1Spec, freezeSpec);
assert.equal(a.blocks.length, 12);
assert.equal(a.secondary.length, 6);
assert.equal(JSON.stringify(a.blocks), JSON.stringify(b.blocks));
assert.equal(JSON.stringify(a.secondary), JSON.stringify(b.secondary));

const balance = {};
for (const block of a.blocks) {
  balance[block.controlClass] = (balance[block.controlClass] || 0) + 1;
  assert.deepEqual(block.correctPair, ["targetA", "targetB"]);
  assert.notEqual(block.targetA.ruleStateKey, block.targetB.ruleStateKey);
  assert.notEqual(block.targetA.historicalTrajectoryHash, block.targetB.historicalTrajectoryHash);
  assert.notEqual(block.targetA.openingPrefixHash, block.targetB.openingPrefixHash);
}
assert.deepEqual(balance, { P_ONLY: 4, M_ONLY: 4, MORPH_NEAR: 4 });
assert.deepEqual(a.secondary.map((x) => x.conditionId), conditions);

const rows = [
  ...a.blocks.flatMap((x) => [x.targetA, x.targetB, x.control]),
  ...a.secondary.map((x) => x.target),
];
assert.equal(rows.length, 42);
assert.equal(new Set(rows.map((x) => x.ruleStateKey)).size, 42);
assert.equal(new Set(rows.map((x) => x.historicalTrajectoryHash)).size, 42);
assert.equal(new Set(rows.map((x) => x.openingPrefixHash)).size, 42);

console.log(JSON.stringify({
  passed: true,
  primaryBlocks: a.blocks.length,
  secondaryTargets: a.secondary.length,
  totalUniquePositions: rows.length,
  controlBalance: balance,
  secondaryConditions: a.secondary.map((x) => x.conditionId),
}, null, 2));
