'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const EXPECTED_SHARDS = 8;
const EXPECTED_SEEDS = Array.from({ length: 64 }, (_, i) => 2026092801 + i);
function jsonFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(item => {
    const full = path.join(root, item.name);
    return item.isDirectory() ? jsonFiles(full) : (item.isFile() && item.name.endsWith('.json') ? [full] : []);
  });
}
function main() {
  const input = process.argv[2], output = process.argv[3];
  assert.ok(input && output, 'usage: aggregate-pbai-p14-baseline.cjs <shard-dir> <output.json>');
  const shards = jsonFiles(input).map(file => JSON.parse(fs.readFileSync(file, 'utf8')));
  const byShard = new Map(shards.map(item => [item.shard, item]));
  assert.equal(byShard.size, EXPECTED_SHARDS, 'all eight unique shard artifacts are required');
  const ordered = Array.from({ length: EXPECTED_SHARDS }, (_, index) => byShard.get(index));
  assert.ok(ordered.every(Boolean), 'a shard artifact is missing');
  const sourceHashes = JSON.stringify(ordered[0].sourceHashes);
  assert.ok(ordered.every(item => JSON.stringify(item.sourceHashes) === sourceHashes),
    'source hashes differ between shards');
  assert.ok(ordered.every(item => item.baselineCommit === ordered[0].baselineCommit));
  const seenSeeds = ordered.flatMap(item => item.seeds).sort((a, b) => a - b);
  assert.deepEqual(seenSeeds, EXPECTED_SEEDS, 'seed manifest has omissions or duplicates');
  const rows = ordered.flatMap(item => item.rows);
  const phaseCounts = Object.fromEntries(['namua', 'mtaji'].map(phase =>
    [phase, rows.filter(row => row.phase === phase).length]));
  const phaseSeedCounts = Object.fromEntries(['namua', 'mtaji'].map(phase =>
    [phase, new Set(rows.filter(row => row.phase === phase).map(row => row.seed)).size]));
  const total = key => rows.reduce((sum, row) => sum + row[key], 0);
  const gate = {
    completeShards: ordered.length === EXPECTED_SHARDS,
    exactSeedCoverage: JSON.stringify(seenSeeds) === JSON.stringify(EXPECTED_SEEDS),
    enoughPositions: rows.length >= 48,
    enoughNamua: phaseCounts.namua >= 16 && phaseSeedCounts.namua >= 16,
    enoughMtaji: phaseCounts.mtaji >= 16 && phaseSeedCounts.mtaji >= 16,
    depth4Complete: ordered.every(item => item.gate.allSamplesDepth4),
    instrumentationPreservesBehavior: ordered.every(item => item.gate.instrumentationPreservesBehavior),
    enoughNamuaCaptureOpportunities: total('namuaCaptureVariantInputs') >= 32,
  };
  gate.pass = Object.values(gate).every(Boolean);
  const result = {
    schemaVersion: 1,
    program: 'PBAI-P14',
    baselineId: 'AI-GEN4-BASELINE-2026-09-28-v1',
    baselineCommit: ordered[0].baselineCommit,
    measurementClass: 'DEVELOPMENT-ONLY / SUPPORT-PROBE',
    seedBlock: { first: EXPECTED_SEEDS[0], last: EXPECTED_SEEDS.at(-1), count: EXPECTED_SEEDS.length },
    sampleCount: rows.length,
    phaseCounts,
    phaseSeedCounts,
    totals: {
      applyMoveCalls: total('applyMoveCalls'),
      namuaCaptureVariantInputs: total('namuaCaptureVariantInputs'),
      collapsedStopUsePairs: total('collapsedStopUsePairs'),
      splitStopUsePairs: total('splitStopUsePairs'),
    },
    sourceHashes: ordered[0].sourceHashes,
    gate,
    rows,
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ output, sampleCount: result.sampleCount,
    phaseCounts, totals: result.totals, gate }, null, 2)}\n`);
  if (!gate.pass) process.exitCode = 2;
}
main();
