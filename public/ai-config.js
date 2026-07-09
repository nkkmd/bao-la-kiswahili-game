"use strict";

(function exposeBaoAIConfig(root) {
  const E = root.BaoEngine || (typeof require !== "undefined" ? require("./engine.js") : null);

  function deviceTier(capabilities = {}) {
    const cores = capabilities.hardwareConcurrency || 4;
    const memory = capabilities.deviceMemory || 4;
    if (cores <= 2 || memory <= 2) return "low";
    if (cores >= 8 && memory >= 4) return "high";
    return "standard";
  }

  function baseSearchOptions(level, capabilities = {}) {
    const tier = deviceTier(capabilities);
    if (level === "expert") {
      if (tier === "low") return { maxDepth: 10, timeLimitMs: 1500 };
      if (tier === "high") return { maxDepth: 14, timeLimitMs: 3000 };
      return { maxDepth: 12, timeLimitMs: 2000 };
    }
    if (level === "hard") {
      if (tier === "low") return { maxDepth: 6, timeLimitMs: 400 };
      if (tier === "high") return { maxDepth: 10, timeLimitMs: 600 };
      return { maxDepth: 8, timeLimitMs: 500 };
    }
    return {};
  }

  function sum(values) {
    return values.reduce((total, value) => total + value, 0);
  }

  function countOccupied(values) {
    return values.filter((value) => value > 0).length;
  }

  function captureCount(events) {
    return events.filter((event) => event.kind === "capture")
      .reduce((total, event) => total + event.count, 0);
  }

  function positionMetrics(state) {
    if (!E || !state || state.winner !== null) return null;
    const moves = E.legalMoves(state);
    const captureAmounts = moves.map((move) => {
      if (move.type !== "capture") return 0;
      return captureCount(E.applyMove(state, move).events);
    });
    const front = state.pits[state.player][E.FRONT];
    const enemyFront = state.pits[1 - state.player][E.FRONT];
    const boardSeeds = state.pits.flat(2).reduce((total, value) => total + value, 0);
    return {
      legalMoves: moves.length,
      captureMoves: captureAmounts.filter((value) => value > 0).length,
      maxCapture: captureAmounts.length ? Math.max(...captureAmounts) : 0,
      frontOccupied: countOccupied(front),
      frontSeeds: sum(front),
      enemyFrontSeeds: sum(enemyFront),
      boardSeeds,
      phase: state.phase,
      reserve: state.reserve[state.player],
      enemyReserve: state.reserve[1 - state.player],
    };
  }

  function complexityScore(metrics) {
    if (!metrics) return 0;
    let score = 0;
    if (metrics.legalMoves <= 2) score -= 0.35;
    else if (metrics.legalMoves <= 4) score -= 0.15;
    else if (metrics.legalMoves >= 10) score += 0.2;
    else if (metrics.legalMoves >= 7) score += 0.1;

    if (metrics.captureMoves === 0) score -= 0.1;
    else if (metrics.captureMoves >= 3) score += 0.25;
    else score += 0.1;

    if (metrics.maxCapture >= Math.max(6, metrics.enemyFrontSeeds / 2)) score += 0.2;
    if (metrics.frontOccupied <= 2) score += 0.2;
    if (metrics.phase === "mtaji") score += 0.1;
    if (metrics.phase === "mtaji" && metrics.boardSeeds <= 24) score += 0.15;
    if (metrics.phase === "namua" && (metrics.reserve <= 4 || metrics.enemyReserve <= 4)) score += 0.15;
    return Math.max(-0.5, Math.min(1, score));
  }

  function adaptiveSearchOptions(level, baseOptions = {}, state = null) {
    const metrics = positionMetrics(state);
    if (!metrics || !Number.isFinite(baseOptions.timeLimitMs)) return { ...baseOptions };
    const complexity = complexityScore(metrics);
    const hardCeiling = baseOptions.timeLimitMs;
    const expertCeiling = 3000;
    const absoluteCeiling = level === "expert" ? expertCeiling : hardCeiling;
    const maxMultiplier = Math.max(1, absoluteCeiling / baseOptions.timeLimitMs);
    const minMultiplier = level === "expert" ? 0.65 : 0.85;
    const multiplier = Math.max(minMultiplier, Math.min(maxMultiplier, 1 + complexity * 0.45));
    const maxDepth = baseOptions.maxDepth || 4;
    const depthDelta = level === "expert"
      ? (complexity >= 0.75 ? 1 : complexity <= -0.35 ? -1 : 0)
      : 0;
    return {
      ...baseOptions,
      maxDepth: Math.max(1, maxDepth + depthDelta),
      timeLimitMs: Math.max(1, Math.round(baseOptions.timeLimitMs * multiplier)),
      adaptive: {
        enabled: true,
        baseTimeLimitMs: baseOptions.timeLimitMs,
        timeLimitMultiplier: multiplier,
        complexityScore: complexity,
        metrics,
      },
      stableBestDepths: baseOptions.stableBestDepths ?? 0,
      stableBestMinDepth: baseOptions.stableBestMinDepth ?? 5,
    };
  }

  function searchOptions(level, capabilities = {}, state = null) {
    const base = baseSearchOptions(level, capabilities);
    return base;
  }

  const api = {
    deviceTier,
    searchOptions,
    baseSearchOptions,
    adaptiveSearchOptions,
    positionMetrics,
    complexityScore,
  };
  root.BaoAIConfig = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
