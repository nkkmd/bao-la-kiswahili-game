'use strict';

const assert = require('node:assert/strict');

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  assert.notEqual(first, -1, `PBAI-P12 candidate anchor missing: ${label}`);
  assert.equal(source.indexOf(before, first + 1), -1, `PBAI-P12 candidate anchor not unique: ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function candidateAiCandidate(source) {
  let result = source;

  result = replaceOnce(
    result,
    `  function captureCount(events) {\n    return events.filter((event) => event.kind === "capture")\n      .reduce((total, event) => total + event.count, 0);\n  }\n\n  function enhancedOrdered(`,
    `  function captureCount(events) {\n    return events.filter((event) => event.kind === "capture")\n      .reduce((total, event) => total + event.count, 0);\n  }\n\n  function pbaiC016RootSafety(state, choices) {\n    if (!state || state.winner !== null || !choices.length) return { eligible: false, reason: "terminal-or-no-move" };\n    if (choices.some((move) => move.type === "capture")) return { eligible: false, reason: "capture" };\n    if (state.phase === "namua" && (state.reserve[0] <= 4 || state.reserve[1] <= 4)) {\n      return { eligible: false, reason: "namua-transition" };\n    }\n    if (state.phase === "namua" && choices.some((move) => move.row === E.FRONT && move.index === E.HOUSE)) {\n      return { eligible: false, reason: "nyumba" };\n    }\n    return { eligible: true, reason: "eligible" };\n  }\n\n  function enhancedOrdered(`,
    'root safety helper',
  );

  result = replaceOnce(
    result,
    `    const stats = emptyStats(level);\n    const choices = movesFor(state);`,
    `    const stats = emptyStats(level);\n    const choices = movesFor(state);\n    const requestedMargin = Number.isInteger(options.pbaiC016Margin) && options.pbaiC016Margin > 0\n      ? options.pbaiC016Margin : 0;\n    const candidateMinDepth = options.pbaiC016MinDepth ?? 3;\n    const candidateEnabled = requestedMargin > 0 && (level === "hard" || level === "expert")\n      && (options.aspirationWindow ?? 0) === 0;\n    const candidateSafety = candidateEnabled\n      ? pbaiC016RootSafety(state, choices)\n      : { eligible: false, reason: requestedMargin > 0 ? "incompatible-options" : "disabled" };\n    if (requestedMargin > 0) {\n      stats.pbaiC016 = {\n        requestedMargin,\n        enabled: candidateEnabled,\n        eligible: candidateSafety.eligible,\n        safetyReason: candidateSafety.reason,\n        minDepth: candidateMinDepth,\n        probes: 0,\n        probeNodes: 0,\n        suppressedResearches: 0,\n        materialResearches: 0,\n        researchNodes: 0,\n        approximateRootIterations: 0,\n      };\n    }`,
    'analyzeMove candidate setup',
  );

  result = replaceOnce(
    result,
    `        normalizeTtMateScores: options.normalizeTtMateScores ?? false,\n      };`,
    `        normalizeTtMateScores: options.normalizeTtMateScores ?? false,\n        pbaiC016Margin: candidateEnabled ? requestedMargin : 0,\n        pbaiC016MinDepth: candidateMinDepth,\n        pbaiC016RootSafe: candidateSafety.eligible,\n      };`,
    'enhanced search context',
  );

  result = replaceOnce(
    result,
    `    let best = maximizing ? -Infinity : Infinity;\n    let bestMove = choices[0].move;`,
    `    let best = maximizing ? -Infinity : Infinity;\n    let bestMove = choices[0].move;\n    let pbaiC016Approximate = false;`,
    'approximate root marker',
  );

  const originalPvs = `      if (index === 0) {\n        value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n      } else if (maximizing) {\n        value = enhancedSearch(choice.next, depth - 1, alpha, alpha + 1, player, context, ply + 1);\n        if (value > alpha && value < beta) {\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        }\n      } else {\n        value = enhancedSearch(choice.next, depth - 1, beta - 1, beta, player, context, ply + 1);\n        if (value < beta && value > alpha) {\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        }\n      }`;

  const candidatePvs = `      const p12Active = ply === 0 && maximizing && index > 0\n        && context.pbaiC016RootSafe && context.pbaiC016Margin > 0\n        && depth >= context.pbaiC016MinDepth;\n      if (index === 0) {\n        value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n      } else if (maximizing) {\n        if (p12Active) {\n          const probeBeta = Math.min(beta, alpha + context.pbaiC016Margin + 1);\n          const beforeProbe = context.stats.nodes;\n          const probeValue = enhancedSearch(\n            choice.next, depth - 1, alpha, probeBeta, player, context, ply + 1,\n          );\n          context.stats.pbaiC016.probes += 1;\n          context.stats.pbaiC016.probeNodes += context.stats.nodes - beforeProbe;\n          if (probeValue > alpha && probeValue < probeBeta) {\n            context.stats.pbaiC016.suppressedResearches += 1;\n            pbaiC016Approximate = true;\n            value = alpha;\n          } else if (probeValue >= probeBeta && probeValue < beta) {\n            const beforeResearch = context.stats.nodes;\n            value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n            context.stats.pbaiC016.materialResearches += 1;\n            context.stats.pbaiC016.researchNodes += context.stats.nodes - beforeResearch;\n          } else {\n            value = probeValue;\n          }\n        } else {\n          value = enhancedSearch(choice.next, depth - 1, alpha, alpha + 1, player, context, ply + 1);\n          if (value > alpha && value < beta) {\n            value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n          }\n        }\n      } else {\n        value = enhancedSearch(choice.next, depth - 1, beta - 1, beta, player, context, ply + 1);\n        if (value < beta && value > alpha) {\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        }\n      }`;

  result = replaceOnce(result, originalPvs, candidatePvs, 'root margin PVS block');

  result = replaceOnce(
    result,
    `    const flag = best <= originalAlpha ? "upper" : best >= originalBeta ? "lower" : "exact";\n    const storedValue = context.normalizeTtMateScores ? ttScore(best, ply) : best;\n    storeTable(context, key, { depth, value: storedValue, flag, bestMove: moveKey(bestMove) });`,
    `    const flag = pbaiC016Approximate ? "approx"\n      : best <= originalAlpha ? "upper" : best >= originalBeta ? "lower" : "exact";\n    if (pbaiC016Approximate && ply === 0) context.stats.pbaiC016.approximateRootIterations += 1;\n    const storedValue = context.normalizeTtMateScores ? ttScore(best, ply) : best;\n    storeTable(context, key, { depth, value: storedValue, flag, bestMove: moveKey(bestMove) });`,
    'TT approximate flag',
  );

  return result;
}

module.exports = { candidateAiCandidate };
