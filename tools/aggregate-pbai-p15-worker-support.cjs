"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const root = process.argv[2] || "artifacts/local/pbai-p15-worker-support-download";
const output = process.argv[3] || "artifacts/local/pbai-p15-worker-support/canonical.json";
const expectedSeeds = Array.from({ length: 64 }, (_, i) => 2026100201 + i);
const expectedHashes = {
  "public/main.js": "141909c6530f6598679c66a0b969b1b42d6472c5",
  "public/ai-release-worker.js": "6a65aa14e5e322e49dd5f5791bedd47fc2ad5273",
  "public/ai-release.js": "724bb412528f6b0b635e81c2992f1834063dffc6",
  "public/ai-config.js": "dc56e1a9c4af8999045cbf91c530a39ed1d4b8a2",
};
function filesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(item) : [item];
  });
}
function median(values) {
  const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function quantile(values, p) {
  const sorted = values.slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  return sorted[Math.max(0, Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1))];
}
function bootstrap(clusters, level) {
  const values = clusters.map((item) => item.savingPct).filter(Number.isFinite);
  if (values.length < 2) return { clusters: values.length, medianPct: median(values), lower95Pct: null, upper95Pct: null };
  let state = 0x15f10000 + (level === "expert" ? 1 : 0);
  function random() {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  }
  const reps = [];
  for (let rep = 0; rep < 10000; rep += 1) {
    const sample = [];
    for (let i = 0; i < values.length; i += 1) sample.push(values[Math.floor(random() * values.length)]);
    reps.push(median(sample));
  }
  return { clusters: values.length, medianPct: median(values), lower95Pct: quantile(reps, 0.025), upper95Pct: quantile(reps, 0.975) };
}
function checkpointBytes(checkpoint) {
  return median((checkpoint.memory && checkpoint.memory.samples || []).map((sample) => sample.usedSize));
}
const shardFiles = filesUnder(root).filter((file) => /shard-[0-7][0-9]\.json$/.test(file)).sort();
const shards = [];
const errors = [];
for (const file of shardFiles) {
  try { shards.push(JSON.parse(fs.readFileSync(file, "utf8"))); }
  catch (error) { errors.push({ file, error: String(error) }); }
}
const samples = shards.flatMap((shard) => shard.samples || []);
const sessions = shards.flatMap((shard) => (shard.longSessions || []).map((session) => ({ shard: shard.shard, ...session })));
const cancellations = shards.map((shard) => ({ shard: shard.shard, ...shard.cancellation }));
const seen = new Map();
for (const shard of shards) {
  for (const seed of shard.seeds || []) seen.set(seed, (seen.get(seed) || 0) + 1);
}
const coverage = {
  shardCount: shards.length,
  successfulShards: shards.filter((shard) => shard.technicalStatus === "PASS").length,
  expectedSeeds: expectedSeeds.length,
  observedSeeds: [...seen.keys()].sort((a, b) => a - b),
  missingSeeds: expectedSeeds.filter((seed) => !seen.has(seed)),
  duplicateSeeds: [...seen.entries()].filter(([, count]) => count !== 1).map(([seed]) => seed),
};
const levels = {};
for (const level of ["hard", "expert"]) {
  const levelRows = samples.filter((row) => row.level === level && row.status === "OK" && !row.warmFirstRequest);
  const bySeed = new Map();
  for (const row of levelRows) {
    if (!Number.isFinite(row.coldMs) || !Number.isFinite(row.warmMs) || row.coldMs <= 0 || row.warmMs <= 0) continue;
    const savingPct = 100 * (row.coldMs - row.warmMs) / row.coldMs;
    if (!bySeed.has(row.seed)) bySeed.set(row.seed, []);
    bySeed.get(row.seed).push({ savingPct, coldMs: row.coldMs, warmMs: row.warmMs });
  }
  const clusters = [...bySeed.entries()].map(([seed, rows]) => ({
    seed,
    savingPct: median(rows.map((row) => row.savingPct)),
    coldMedianMs: median(rows.map((row) => row.coldMs)),
    warmMedianMs: median(rows.map((row) => row.warmMs)),
    positions: rows.length,
  }));
  const estimate = bootstrap(clusters, level);
  levels[level] = {
    pairedPositionsExcludingFirstWarmRequest: levelRows.length,
    distinctSeeds: clusters.length,
    clusters,
    ...estimate,
    gate: levelRows.length >= 192 && clusters.length >= 48 && estimate.medianPct >= 5 && estimate.lower95Pct > 0,
  };
}
const memory = sessions.map((session) => {
  const checkpoints = session.checkpoints || [];
  const at16 = checkpoints.find((checkpoint) => checkpoint.afterRequests === 16);
  const at64 = checkpoints.find((checkpoint) => checkpoint.afterRequests === 64);
  const delta = at16 && at64 ? checkpointBytes(at64) - checkpointBytes(at16) : null;
  const limit = at16 ? Math.max(8 * 1024 * 1024, checkpointBytes(at16) * 0.1) : null;
  const requestCheckpoints = [1, 16, 32, 64].map((count) =>
    checkpoints.find((checkpoint) => checkpoint.afterRequests === count));
  const requestCheckpointsAttributed = requestCheckpoints.map((checkpoint) =>
    !!(checkpoint && checkpoint.workerTarget && checkpoint.workerTarget.type === "worker"
      && checkpoint.workerTarget.url.endsWith("/public/ai-release-worker.js")
      && checkpoint.memory && checkpoint.memory.afterGarbageCollection === true
      && checkpoint.memory.samples && checkpoint.memory.samples.length === 3));
  return {
    shard: session.shard,
    seed: session.seed,
    level: session.level,
    requestCount: session.requestCount,
    reaches64: session.reaches64,
    allRequestCheckpointsAttributedToWorker: requestCheckpointsAttributed.length === 4 && requestCheckpointsAttributed.every(Boolean),
    bytesAt16: at16 ? checkpointBytes(at16) : null,
    bytesAt64: at64 ? checkpointBytes(at64) : null,
    deltaBytes16To64: delta,
    limitBytes: limit,
    gate: session.reaches64 === true && requestCheckpointsAttributed.length === 4 && requestCheckpointsAttributed.every(Boolean)
      && Number.isFinite(delta) && delta <= limit,
  };
});
const cancelGate = cancellations.length === 8
  && cancellations.every((item) => item && item.deliveredAfterTerminate === false && item.freshWorkerResponded === true);
const requiredSourceGate = shards.every((shard) => Object.entries(expectedHashes)
  .every(([file, hash]) => shard.sourceHashes && shard.sourceHashes[file] === hash));
let publicDiff = [];
try {
  publicDiff = execFileSync("git", ["diff", "--name-only", "22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b", "--", "public"], { encoding: "utf8" })
    .trim().split("\n").filter(Boolean);
} catch (error) { errors.push({ stage: "public-source-diff", error: String(error) }); }
const gates = {
  shardAndSeedCoverage: shards.length === 8 && coverage.successfulShards === 8
    && coverage.missingSeeds.length === 0 && coverage.duplicateSeeds.length === 0,
  sourceHashesMatch: requiredSourceGate && publicDiff.length === 0,
  sampleValidity: samples.filter((row) => row.status === "OK").length >= 2 * 192
    && !samples.some((row) => row.status !== "OK"),
  latencyScreening: levels.hard.gate || levels.expert.gate,
  memoryApiAndWorkerAttribution: memory.length === 16 && memory.every((item) => item.allRequestCheckpointsAttributedToWorker),
  longSessionMemoryGrowth: memory.length === 16 && memory.every((item) => item.gate),
  cancellationAndFreshRestart: cancelGate,
};
const result = {
  study: "PBAI-P15-WORKER-BASELINE-SUPPORT",
  baseline: "AI-GEN4-BASELINE-2026-09-28-v1",
  baselineCommit: "22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b",
  gate: Object.values(gates).every(Boolean) ? "BASELINE-SUPPORT-PASS" : "BASELINE-SUPPORT-HOLD",
  gates,
  coverage,
  levels,
  memory,
  cancellations,
  publicDiff,
  errors,
  shards,
  generatedAt: new Date().toISOString(),
};
fs.mkdirSync(path.dirname(output), { recursive: true });
const tmp = output + ".tmp";
fs.writeFileSync(tmp, JSON.stringify(result, null, 2) + "\n");
fs.renameSync(tmp, output);
process.stdout.write(JSON.stringify({ gate: result.gate, gates, coverage, levels: Object.fromEntries(Object.entries(levels).map(([key, value]) => [key, { paired: value.pairedPositionsExcludingFirstWarmRequest, seeds: value.distinctSeeds, medianPct: value.medianPct, lower95Pct: value.lower95Pct }])), output }) + "\n");
if (Object.values(gates).some((value) => !value)) process.exitCode = 2;
