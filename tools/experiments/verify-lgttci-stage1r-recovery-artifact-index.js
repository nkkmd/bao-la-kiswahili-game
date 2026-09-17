#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1R_DOWNSTREAM_RECOVERY_AUTHORIZATION.json");

function need(value, message) {
  if (!value) throw new Error(message);
}
function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    out[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
  return out;
}
function expectedSlots(spec) {
  const result = new Map();
  for (const block of ["SFCDF", "SILGM", "GCLD"]) {
    const range = spec.freshSeedSlots.primary[block];
    for (let seed = range.seedStart; seed <= range.seedEnd; seed++) result.set(seed, block);
  }
  return result;
}
function atomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + "\n");
  fs.renameSync(tmp, file);
}

function main() {
  const args = parseArgs();
  const input = path.resolve(args.input || "");
  const output = path.resolve(args.output || "");
  need(input && output && fs.existsSync(input), "--input and --output are required");
  need(fs.existsSync(AUTH_PATH), "downstream recovery authorization is absent");

  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
  need(auth.status === "AUTHORIZED", "recovery authorization status mismatch");
  need(auth.recoveryType === "DOWNSTREAM-ONLY", "recovery type mismatch");
  need(auth.stageId === spec.stageId, "stage identity mismatch");
  need(auth.sourceExecutionRun && Number.isInteger(auth.sourceExecutionRun.runId), "source run id missing");
  need(typeof auth.sourceExecutionRun.headSha === "string", "source run head SHA missing");

  const expected = expectedSlots(spec);
  need(expected.size === spec.freshSeedSlots.primaryCount, "spec primary count mismatch");

  const rawLines = fs.readFileSync(input, "utf8").split(/\r?\n/).filter(Boolean);
  const entries = [];
  const seenNames = new Set();
  const seenIds = new Set();
  for (const line of rawLines) {
    const parts = line.split("\t");
    need(parts.length === 6, `bad artifact index row: ${line}`);
    const [idText, name, expiredText, digest, headSha, runIdText] = parts;
    const id = Number(idText);
    const runId = Number(runIdText);
    need(Number.isInteger(id) && id > 0, `bad artifact id ${idText}`);
    need(Number.isInteger(runId), `bad run id ${runIdText}`);
    need(!seenIds.has(id), `duplicate artifact id ${id}`);
    need(!seenNames.has(name), `duplicate artifact name ${name}`);
    seenIds.add(id);
    seenNames.add(name);
    need(expiredText === "false", `expired source artifact ${name}`);
    need(/^sha256:[0-9a-f]{64}$/.test(digest), `bad artifact digest ${name}`);
    need(headSha === auth.sourceExecutionRun.headSha, `origin head SHA mismatch ${name}`);
    need(runId === auth.sourceExecutionRun.runId, `origin run mismatch ${name}`);
    const match = /^lgttci-s1r-source-(\d+)$/.exec(name);
    need(match, `unexpected source artifact name ${name}`);
    const slotSeed = Number(match[1]);
    need(expected.has(slotSeed), `unexpected source slot ${slotSeed}`);
    entries.push({ id, name, slotSeed, block: expected.get(slotSeed), digest, headSha, runId });
  }

  need(entries.length === spec.freshSeedSlots.primaryCount, `expected ${spec.freshSeedSlots.primaryCount} source artifacts, got ${entries.length}`);
  for (const slotSeed of expected.keys()) need(seenNames.has(`lgttci-s1r-source-${slotSeed}`), `missing source artifact ${slotSeed}`);
  entries.sort((a, b) => a.slotSeed - b.slotSeed);
  const core = {
    stageId: spec.stageId,
    recoveryType: "DOWNSTREAM-ONLY",
    sourceRunId: auth.sourceExecutionRun.runId,
    sourceRunHeadSha: auth.sourceExecutionRun.headSha,
    sourceArtifactCount: entries.length,
    entries
  };
  const result = {
    schemaVersion: 1,
    ...core,
    deterministicCoreSha256: sha256(JSON.stringify(core))
  };
  atomic(output, result);
  process.stdout.write(JSON.stringify({
    event: "RECOVERY-SOURCE-INDEX-VERIFIED",
    sourceRunId: core.sourceRunId,
    sourceArtifactCount: entries.length,
    deterministicCoreSha256: result.deterministicCoreSha256
  }) + "\n");
}

main();
