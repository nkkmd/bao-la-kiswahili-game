#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const E = require(path.join(ROOT, "public/engine.js"));
const AI = require(path.join(ROOT, "public/ai.js"));
const AIConfig = require(path.join(ROOT, "public/ai-config.js"));

const tiers = {
  low: { hardwareConcurrency: 2, deviceMemory: 2 },
  standard: { hardwareConcurrency: 4, deviceMemory: 4 },
  high: { hardwareConcurrency: 8, deviceMemory: 4 },
};

function legal(state, move) {
  return new Set(E.moveVariants(state).map(AI.moveKey)).has(AI.moveKey(move));
}

const measurements = [];
for (const level of ["hard", "expert"]) {
  for (const [tier, capabilities] of Object.entries(tiers)) {
    const options = {
      ...AIConfig.searchOptions(level, capabilities, E.initialState()),
      evaluationProfile: "bao",
    };
    const root = E.initialState();
    const analysis = AI.analyzeMove(E.clone(root), level, () => 0.5, options);
    assert.ok(analysis.move, `${level}/${tier} returns a move`);
    assert.ok(legal(root, analysis.move), `${level}/${tier} returns a legal move`);
    assert.ok(Number.isFinite(analysis.stats.elapsedMs), `${level}/${tier} elapsedMs is finite`);
    assert.ok(analysis.stats.completedDepth >= 0, `${level}/${tier} reports completed depth`);
    measurements.push({
      level,
      tier,
      configuredMaxDepth: options.maxDepth,
      configuredTimeLimitMs: options.timeLimitMs,
      moveKey: AI.moveKey(analysis.move),
      elapsedMs: analysis.stats.elapsedMs,
      completedDepth: analysis.stats.completedDepth,
      timedOut: analysis.stats.timedOut,
      nodes: analysis.stats.nodes,
      quiescenceNodes: analysis.stats.quiescenceNodes,
      cutoffs: analysis.stats.cutoffs,
      cacheHits: analysis.stats.cacheHits,
      evaluationRequests: analysis.stats.evaluationRequests,
      evaluations: analysis.stats.evaluations,
      evaluationCacheHits: analysis.stats.evaluationCacheHits,
    });
  }
}

const result = {
  schemaVersion: 1,
  program: "PBAI-P1",
  phase: "PBAI-B",
  baselineId: "AI-GEN2-BASELINE-2026-08-26-v1",
  sourceCommit: "f4ae3b11901180cbe417b3e643e2b357d8045d2d",
  measurementClass: "descriptive-operational-time-limited-smoke",
  environmentBoundary: "GitHub-hosted runner; latency/depth are descriptive and not cross-device guarantees",
  root: "standard initial state",
  evaluationProfile: "bao",
  searchImplementation: "enhanced default hard/expert path",
  measurements,
  passed: true,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
