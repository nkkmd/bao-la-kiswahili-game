#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
function band(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "unknown";
  if (n <= 4) return "0-4";
  if (n <= 8) return "5-8";
  if (n <= 16) return "9-16";
  return "17+";
}
function summarize(rows, cohort) {
  return ["0-4", "5-8", "9-16", "17+", "unknown"].map((terminalBand) => {
    const members = rows.filter((row) => band(row.distanceToTerminal) === terminalBand);
    const positives = members.filter((row) => row.classification === "forcing-release-precursor").length;
    return { cohort, terminalBand, total: members.length, positives, rate: members.length ? positives / members.length : null };
  });
}
function main() {
  const input = path.resolve(process.argv[2] || "artifacts/local/phase-transition-regime-controls-current-source");
  const candidates = IO.readCsv(path.join(input, "candidate-control-metrics.csv"));
  const controls = IO.readCsv(path.join(input, "control-point-metrics.csv"));
  const rows = [...summarize(candidates, "candidate"), ...summarize(controls, "control")];
  IO.writeCsv(path.join(input, "terminal-distance-strata.csv"), rows);
  const nonTerminalCandidates = candidates.filter((row) => Number(row.distanceToTerminal) >= 9);
  const nonTerminalControls = controls.filter((row) => Number(row.distanceToTerminal) >= 9);
  const count = (items) => items.filter((row) => row.classification === "forcing-release-precursor").length;
  const summary = {
    analysisVersion: "8-terminal-distance-summary",
    candidateTotal: nonTerminalCandidates.length,
    candidatePositive: count(nonTerminalCandidates),
    controlTotal: nonTerminalControls.length,
    controlPositive: count(nonTerminalControls),
  };
  fs.writeFileSync(path.join(input, "terminal-distance-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}
if (require.main === module) main();
module.exports = { band, summarize };
