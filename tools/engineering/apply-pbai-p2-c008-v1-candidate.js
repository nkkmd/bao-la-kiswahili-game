#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const AI_PATH = path.join(ROOT, "public/ai.js");
const BASELINE_SHA256 = "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e";
const MAX_ADDED_BYTES = 4096;

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function ensure(ok, message) { if (!ok) throw new Error(message); }
function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  ensure(first >= 0, `${label}: needle not found`);
  ensure(source.indexOf(needle, first + needle.length) < 0, `${label}: needle occurs more than once`);
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

const original = fs.readFileSync(AI_PATH, "utf8");
ensure(sha256(original) === BASELINE_SHA256, "public/ai.js no longer matches frozen AI-GEN2 baseline");

let transformed = original;

transformed = replaceOnce(
  transformed,
  "    const stats = emptyStats(level);\n    const choices = movesFor(state);",
  `    const stats = emptyStats(level);\n    const pbaiC008Enabled = options.pbaiC008RootFlipConfirmation === true;\n    if (pbaiC008Enabled) {\n      stats.pbaiC008 = {\n        triggered: false,\n        nominalCompletedDepth: 0,\n        previousBestMoveKey: null,\n        nominalBestMoveKey: null,\n        confirmationDepth: null,\n        confirmationCompleted: false,\n        confirmationTimedOut: false,\n        confirmationCandidateCount: 0,\n        confirmationNodes: 0,\n        selectedMoveChanged: false,\n        nominalRootScore: null,\n        selectedConfirmationScore: null,\n      };\n    }\n    const choices = movesFor(state);`,
  "diagnostics initialization",
);

transformed = replaceOnce(
  transformed,
  `      let previousBestKey = moveKey(bestMove);\n      let previousScore = null;\n      let stableIterations = 0;`,
  `      let previousBestKey = moveKey(bestMove);\n      let previousCompletedBestKey = null;\n      let finalPreviousBestKey = null;\n      let finalNominalBestKey = previousBestKey;\n      let previousScore = null;\n      let stableIterations = 0;`,
  "completed-depth tracking initialization",
);

transformed = replaceOnce(
  transformed,
  `          const currentBestKey = moveKey(bestMove);\n          if (currentBestKey === previousBestKey) stableIterations += 1;`,
  `          const currentBestKey = moveKey(bestMove);\n          finalPreviousBestKey = previousCompletedBestKey;\n          previousCompletedBestKey = currentBestKey;\n          finalNominalBestKey = currentBestKey;\n          if (currentBestKey === previousBestKey) stableIterations += 1;`,
  "completed-depth tracking update",
);

transformed = replaceOnce(
  transformed,
  `      stats.elapsedMs = performanceNow() - startedAt;\n      return { move: bestMove, stats };\n    }\n\n    for (let depth = 1; depth <= maxDepth; depth += 1) {`,
  `      const nominalMove = bestMove;\n      const nominalRootScore = stats.rootScore;\n      if (pbaiC008Enabled) {\n        const diagnostics = stats.pbaiC008;\n        diagnostics.nominalCompletedDepth = stats.completedDepth;\n        diagnostics.previousBestMoveKey = finalPreviousBestKey;\n        diagnostics.nominalBestMoveKey = finalNominalBestKey;\n        diagnostics.nominalRootScore = nominalRootScore;\n        const trigger = (level === \"hard\" || level === \"expert\")\n          && stats.completedDepth === maxDepth\n          && maxDepth >= 3\n          && !stats.timedOut\n          && !stats.earlyStopped\n          && finalPreviousBestKey\n          && finalNominalBestKey\n          && finalPreviousBestKey !== finalNominalBestKey;\n        if (trigger) {\n          const rootMoves = movesFor(state);\n          const candidateMoves = [finalPreviousBestKey, finalNominalBestKey]\n            .map((key) => rootMoves.find((move) => moveKey(move) === key) || null)\n            .filter((move, index, array) => move\n              && array.findIndex((other) => moveKey(other) === moveKey(move)) === index)\n            .sort((a, b) => moveKey(a).localeCompare(moveKey(b)));\n          if (candidateMoves.length === 2) {\n            diagnostics.triggered = true;\n            diagnostics.confirmationDepth = stats.completedDepth + 1;\n            diagnostics.confirmationCandidateCount = 2;\n            const nodesBeforeConfirmation = stats.nodes;\n            const scored = [];\n            try {\n              for (const move of candidateMoves) {\n                const next = E.applyMove(state, move).state;\n                const score = enhancedSearch(\n                  next, stats.completedDepth, -Infinity, Infinity, player, context, 1,\n                );\n                scored.push({ move, score });\n              }\n              diagnostics.confirmationNodes = stats.nodes - nodesBeforeConfirmation;\n              diagnostics.confirmationCompleted = true;\n              let selected = scored.find((item) => moveKey(item.move) === finalNominalBestKey);\n              for (const item of scored) {\n                if (item.score > selected.score) selected = item;\n              }\n              bestMove = selected.move;\n              stats.rootScore = selected.score;\n              diagnostics.selectedConfirmationScore = selected.score;\n              diagnostics.selectedMoveChanged = moveKey(bestMove) !== finalNominalBestKey;\n            } catch (error) {\n              diagnostics.confirmationNodes = stats.nodes - nodesBeforeConfirmation;\n              if (error.message !== \"timeout\") throw error;\n              diagnostics.confirmationTimedOut = true;\n              stats.timedOut = true;\n              bestMove = nominalMove;\n              stats.rootScore = nominalRootScore;\n            }\n          }\n        }\n      }\n      stats.elapsedMs = performanceNow() - startedAt;\n      return { move: bestMove, stats };\n    }\n\n    for (let depth = 1; depth <= maxDepth; depth += 1) {`,
  "confirmation search insertion",
);

ensure(transformed.includes("pbaiC008RootFlipConfirmation"), "feature flag missing after transform");
ensure(transformed !== original, "candidate transform made no change");
const addedBytes = Buffer.byteLength(transformed) - Buffer.byteLength(original);
ensure(addedBytes > 0 && addedBytes <= MAX_ADDED_BYTES, `candidate added bytes ${addedBytes} outside contract`);

fs.writeFileSync(AI_PATH, transformed, "utf8");
console.log(JSON.stringify({
  baselineSha256: BASELINE_SHA256,
  candidateSha256: sha256(transformed),
  baselineBytes: Buffer.byteLength(original),
  candidateBytes: Buffer.byteLength(transformed),
  addedBytes,
  featureFlag: "pbaiC008RootFlipConfirmation",
}, null, 2));
