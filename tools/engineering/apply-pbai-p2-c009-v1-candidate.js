#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const AI_PATH = path.join(ROOT, "public/ai.js");
const BASELINE_SHA256 = "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e";
const MAX_ADDED_BYTES = 4096;

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function replaceExactlyOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`Missing ${label} needle`);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error(`Ambiguous ${label} needle`);
  return source.replace(needle, replacement);
}

function main() {
  const baseline = fs.readFileSync(AI_PATH, "utf8");
  const baselineHash = sha256(baseline);
  if (baselineHash !== BASELINE_SHA256) {
    throw new Error(`Refusing C009 transform on non-baseline public/ai.js: ${baselineHash}`);
  }
  if (baseline.includes("pbaiC009SingleReplyExtension") || baseline.includes("stats.pbaiC009")) {
    throw new Error("C009 candidate markers already present before transform");
  }

  let source = baseline;

  source = replaceExactlyOnce(
    source,
    "    const stats = emptyStats(level);\n    const choices = movesFor(state);",
    [
      "    const stats = emptyStats(level);",
      "    const pbaiC009Enabled = options.pbaiC009SingleReplyExtension === true",
      "      && (level === \"hard\" || level === \"expert\")",
      "      && options.searchProfile !== \"legacy\"",
      "      && options.searchProfile !== \"mcts\";",
      "    if (pbaiC009Enabled) {",
      "      stats.pbaiC009 = {",
      "        triggeredExtensions: 0,",
      "        forcedReplyCutoffVisits: 0,",
      "        forcedReplyChildQuiescenceNodes: 0,",
      "        maxExtensionsPerObservedPath: 0,",
      "      };",
      "    }",
      "    const choices = movesFor(state);",
    ].join("\n"),
    "analyzeMove feature gate",
  );

  source = replaceExactlyOnce(
    source,
    [
      "    if (depth === 0) return quiescence(",
      "      state, alpha, beta, player, context.deadline, context.stats,",
      "      context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,",
      "    );",
    ].join("\n"),
    [
      "    if (depth === 0) {",
      "      if (context.pbaiC009Enabled && state.player !== player) {",
      "        const forcedReplies = movesFor(state);",
      "        if (forcedReplies.length === 1) {",
      "          const diagnostics = context.stats.pbaiC009;",
      "          diagnostics.triggeredExtensions += 1;",
      "          diagnostics.forcedReplyCutoffVisits += 1;",
      "          diagnostics.maxExtensionsPerObservedPath = Math.max(",
      "            diagnostics.maxExtensionsPerObservedPath, 1,",
      "          );",
      "          const nodesBeforeExtension = context.stats.nodes;",
      "          const forcedChild = E.applyMove(state, forcedReplies[0]).state;",
      "          const value = quiescence(",
      "            forcedChild, alpha, beta, player, context.deadline, context.stats,",
      "            context.evaluator, ply + 1, context.quiescenceDepth,",
      "            context.orderQuiescenceCaptures,",
      "          );",
      "          diagnostics.forcedReplyChildQuiescenceNodes += context.stats.nodes - nodesBeforeExtension;",
      "          return value;",
      "        }",
      "      }",
      "      return quiescence(",
      "        state, alpha, beta, player, context.deadline, context.stats,",
      "        context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,",
      "      );",
      "    }",
    ].join("\n"),
    "enhancedSearch nominal cutoff",
  );

  source = replaceExactlyOnce(
    source,
    [
      "        orderQuiescenceCaptures: options.orderQuiescenceCaptures ?? false,",
      "        normalizeTtMateScores: options.normalizeTtMateScores ?? false,",
      "      };",
    ].join("\n"),
    [
      "        orderQuiescenceCaptures: options.orderQuiescenceCaptures ?? false,",
      "        normalizeTtMateScores: options.normalizeTtMateScores ?? false,",
      "        pbaiC009Enabled,",
      "      };",
    ].join("\n"),
    "enhanced search context binding",
  );

  const addedBytes = Buffer.byteLength(source, "utf8") - Buffer.byteLength(baseline, "utf8");
  if (addedBytes < 1 || addedBytes > MAX_ADDED_BYTES) {
    throw new Error(`C009 source delta ${addedBytes} bytes violates 1..${MAX_ADDED_BYTES}`);
  }
  if (!source.includes("pbaiC009SingleReplyExtension") || !source.includes("stats.pbaiC009")) {
    throw new Error("C009 candidate markers missing after transform");
  }

  fs.writeFileSync(AI_PATH, source);
  console.log(JSON.stringify({
    baselineSha256: baselineHash,
    candidateSha256: sha256(source),
    baselineBytes: Buffer.byteLength(baseline, "utf8"),
    candidateBytes: Buffer.byteLength(source, "utf8"),
    addedBytes,
    featureFlag: "pbaiC009SingleReplyExtension",
  }, null, 2));
}

main();
