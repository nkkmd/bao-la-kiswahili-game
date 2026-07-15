#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function classify(detail) {
  const classes = [];
  if (!detail.legalMoveSymmetric) {
    if (detail.expectedMoves.length !== detail.actualMoves.length) classes.push("move-count");
    if (detail.missingMoves.length) classes.push("missing-moves");
    if (detail.unexpectedMoves.length) classes.push("unexpected-moves");
  }
  if (!detail.baoEvaluationSymmetric) {
    classes.push(detail.legalMoveSymmetric ? "evaluation-only" : "with-legal-mismatch");
    for (const [name, delta] of Object.entries(detail.evaluationDelta.features)) {
      if (delta !== 0) classes.push(`feature:${name}`);
    }
  }
  const reversedHouseCoordinate = detail.evaluationDelta.features.houseValue !== 0;
  return {
    index: detail.index,
    phase: detail.state.phase,
    classes: [...new Set(classes)],
    firstDivergence: "mirror-state/local-column-coordinate",
    explanation: reversedHouseCoordinate
      ? "Candidate A reverses player-local pit indices and moves nyumba seeds away from the fixed HOUSE index 4 before move generation."
      : "Candidate A reverses player-local pit indices and directions even though both are already expressed from each player's own viewpoint.",
  };
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) throw new Error("Usage: classify-mismatches.js INPUT OUTPUT");
  const audit = JSON.parse(fs.readFileSync(input, "utf8"));
  const items = audit.details.filter((item) => (
    !item.legalMoveSymmetric || !item.baoEvaluationSymmetric
  )).map(classify);
  const classCounts = {};
  for (const item of items) {
    for (const name of item.classes) classCounts[name] = (classCounts[name] || 0) + 1;
  }
  const result = { candidate: audit.candidate, mismatches: items.length, classCounts, items };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ mismatches: items.length, classCounts }, null, 2)}\n`);
}

if (require.main === module) main();
module.exports = { classify };
