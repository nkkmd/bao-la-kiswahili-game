#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { runGame } = require("./run-phase-transition-research.js");

const DEFAULT_ARCHETYPES = [
  "9f778d512ae1",
  "22807aff1baf",
  "0eb352745c9b",
  "2e79188a987a",
  "7360876ad5c7",
  "6b364e603366",
];

function parseArgs(argv) {
  const options = {
    input: "artifacts/phase-transition/pilot-v2",
    archetypes: "artifacts/local/phase-transition-archetypes/candidate-archetypes.csv",
    output: "artifacts/local/phase-transition-candidate-audit",
    before: 1,
    after: 8,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = argv[i + 1];
    if (arg === "--input") options.input = value;
    else if (arg === "--archetypes") options.archetypes = value;
    else if (arg === "--output") options.output = value;
    else if (arg === "--before") options.before = Number(value);
    else if (arg === "--after") options.after = Number(value);
    else throw new Error(`Unknown argument: ${arg}`);
    i += 1;
  }
  return options;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else current += char;
  }
  values.push(current);
  return values;
}

function readCsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => Object.fromEntries(headers.map((key, index) => [key, parseCsvLine(line)[index]])));
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  if (!rows.length) return fs.writeFileSync(filePath, "\n");
  const headers = Object.keys(rows[0]);
  const body = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
  fs.writeFileSync(filePath, `${body}\n`);
}

function gameIndex(gameId) {
  const match = gameId.match(/(\d+)$/);
  if (!match) throw new Error(`Cannot parse game index: ${gameId}`);
  return Number(match[1]);
}

function loadOrRebuildGame(inputDir, config, gameId) {
  const index = gameIndex(gameId);
  const filePath = path.join(inputDir, "games", `game-${String(index).padStart(4, "0")}.json`);
  if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf8"));
  return runGame(config, index);
}

function replayStates(game) {
  const states = [];
  let state = E.initialState();
  states.push(JSON.parse(JSON.stringify(state)));
  for (const entry of game.moves) {
    state = E.applyMove(state, entry.move).state;
    states.push(JSON.parse(JSON.stringify(state)));
  }
  return states;
}

function moveLabel(entry) {
  if (!entry) return null;
  const move = entry.move || {};
  return [move.phase, move.type, move.row, move.index, move.direction, move.side, move.houseChoice]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .join(":");
}

function boardRows(state) {
  return {
    northBack: [...state.pits[1][1]].reverse(),
    northFront: [...state.pits[1][0]].reverse(),
    southFront: [...state.pits[0][0]],
    southBack: [...state.pits[0][1]],
  };
}

function auditRows(candidate, game, states, before, after) {
  const target = Number(candidate.representativePly);
  const start = Math.max(0, target - before);
  const end = Math.min(game.observations.length - 1, target + after);
  const rows = [];
  for (let ply = start; ply <= end; ply += 1) {
    const observation = game.observations[ply];
    const state = states[ply];
    const legal = E.moveVariants(state);
    const captureMoves = legal.filter((move) => move.type === "capture");
    const board = boardRows(state);
    rows.push({
      archetypeId: candidate.archetypeId,
      category: candidate.category,
      gameId: game.gameId,
      targetPly: target,
      ply,
      relativePly: ply - target,
      isTarget: ply === target,
      player: state.player,
      phase: state.phase,
      winner: state.winner,
      reason: state.reason || "",
      reserveSouth: state.reserve[0],
      reserveNorth: state.reserve[1],
      forcedCapture: observation.forcedCapture,
      legalMoveCount: legal.length,
      captureMoveCount: captureMoves.length,
      selectedMove: moveLabel(game.moves[ply]),
      stateHash: observation.stateHash,
      northBack: board.northBack,
      northFront: board.northFront,
      southFront: board.southFront,
      southBack: board.southBack,
    });
  }
  return rows;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputDir = path.resolve(options.input);
  const outputDir = path.resolve(options.output);
  const manifest = JSON.parse(fs.readFileSync(path.join(inputDir, "manifest.json"), "utf8"));
  const candidates = readCsv(path.resolve(options.archetypes))
    .filter((row) => row.category === "A" && Number(row.pliesRemaining) >= 5)
    .filter((row) => DEFAULT_ARCHETYPES.includes(row.archetypeId))
    .sort((a, b) => DEFAULT_ARCHETYPES.indexOf(a.archetypeId) - DEFAULT_ARCHETYPES.indexOf(b.archetypeId));

  if (!candidates.length) throw new Error("No priority A archetypes found");
  fs.mkdirSync(outputDir, { recursive: true });
  const allRows = [];
  const details = [];

  for (const candidate of candidates) {
    const game = loadOrRebuildGame(inputDir, manifest.config, candidate.representativeGameId);
    const states = replayStates(game);
    const rows = auditRows(candidate, game, states, options.before, options.after);
    allRows.push(...rows);
    details.push({
      ...candidate,
      winner: game.winner,
      reason: game.reason,
      gamePlies: game.plies,
      context: rows,
    });
  }

  const summary = {
    analysisVersion: "5-candidate-board-audit",
    studyVersion: manifest.studyVersion,
    configHash: manifest.configHash,
    selectedArchetypeIds: candidates.map((row) => row.archetypeId),
    candidateCount: candidates.length,
    contextWindow: { before: options.before, after: options.after },
  };

  fs.writeFileSync(path.join(outputDir, "candidate-board-audit.json"), `${JSON.stringify({ summary, candidates: details }, null, 2)}\n`);
  writeCsv(path.join(outputDir, "candidate-board-audit.csv"), allRows);
  fs.writeFileSync(path.join(outputDir, "candidate-board-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();

module.exports = { auditRows, boardRows, gameIndex, moveLabel, parseCsvLine, replayStates };
