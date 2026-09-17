'use strict';

const assert = require('node:assert/strict');

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  assert.notEqual(first, -1, `PBAI-P12 instrumentation anchor missing: ${label}`);
  assert.equal(source.indexOf(before, first + 1), -1, `PBAI-P12 instrumentation anchor not unique: ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function instrumentAiCandidate(source) {
  let result = source;

  result = replaceOnce(
    result,
    '    const stats = emptyStats(level);\n    const choices = movesFor(state);',
    `    const stats = emptyStats(level);\n    stats.pbaiC016DiagnosticsEnabled = options.pbaiC016Diagnostics === true;\n    if (stats.pbaiC016DiagnosticsEnabled) {\n      stats.pbaiC016 = {\n        firstSearches: 0, firstNodes: 0, scoutSearches: 0, scoutNodes: 0,\n        researches: 0, researchNodes: 0, rootChoices: [],\n      };\n    }\n    const choices = movesFor(state);`,
    'analyzeMove stats initialization',
  );

  const originalPvs = `      if (index === 0) {\n        value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n      } else if (maximizing) {\n        value = enhancedSearch(choice.next, depth - 1, alpha, alpha + 1, player, context, ply + 1);\n        if (value > alpha && value < beta) {\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        }\n      } else {\n        value = enhancedSearch(choice.next, depth - 1, beta - 1, beta, player, context, ply + 1);\n        if (value < beta && value > alpha) {\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        }\n      }`;

  const instrumentedPvs = `      const p12 = context.stats.pbaiC016DiagnosticsEnabled ? context.stats.pbaiC016 : null;\n      const rootRecord = p12 && ply === 0 ? {\n        depth, index, moveKey: moveKey(choice.move), firstNodes: 0, scoutNodes: 0,\n        researchNodes: 0, researched: false, scoutValue: null, value: null,\n      } : null;\n      if (index === 0) {\n        const beforeNodes = context.stats.nodes;\n        value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n        if (p12) {\n          const used = context.stats.nodes - beforeNodes;\n          p12.firstSearches += 1; p12.firstNodes += used;\n          if (rootRecord) rootRecord.firstNodes = used;\n        }\n      } else if (maximizing) {\n        const beforeScout = context.stats.nodes;\n        value = enhancedSearch(choice.next, depth - 1, alpha, alpha + 1, player, context, ply + 1);\n        if (p12) {\n          const used = context.stats.nodes - beforeScout;\n          p12.scoutSearches += 1; p12.scoutNodes += used;\n          if (rootRecord) { rootRecord.scoutNodes = used; rootRecord.scoutValue = value; }\n        }\n        if (value > alpha && value < beta) {\n          const beforeResearch = context.stats.nodes;\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n          if (p12) {\n            const used = context.stats.nodes - beforeResearch;\n            p12.researches += 1; p12.researchNodes += used;\n            if (rootRecord) { rootRecord.researched = true; rootRecord.researchNodes = used; }\n          }\n        }\n      } else {\n        const beforeScout = context.stats.nodes;\n        value = enhancedSearch(choice.next, depth - 1, beta - 1, beta, player, context, ply + 1);\n        if (p12) {\n          const used = context.stats.nodes - beforeScout;\n          p12.scoutSearches += 1; p12.scoutNodes += used;\n          if (rootRecord) { rootRecord.scoutNodes = used; rootRecord.scoutValue = value; }\n        }\n        if (value < beta && value > alpha) {\n          const beforeResearch = context.stats.nodes;\n          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);\n          if (p12) {\n            const used = context.stats.nodes - beforeResearch;\n            p12.researches += 1; p12.researchNodes += used;\n            if (rootRecord) { rootRecord.researched = true; rootRecord.researchNodes = used; }\n          }\n        }\n      }\n      if (rootRecord) { rootRecord.value = value; p12.rootChoices.push(rootRecord); }`;

  result = replaceOnce(result, originalPvs, instrumentedPvs, 'PVS child-search block');
  return result;
}

module.exports = { instrumentAiCandidate };
