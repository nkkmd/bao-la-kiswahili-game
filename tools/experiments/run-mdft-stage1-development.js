#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const cp = require("node:child_process");
const { performance } = require("node:perf_hooks");
const P = require("./lib/mdft-stage1-production.js");
const I = require("./lib/mdft-stage1-independent.js");

const SPEC_PATH = path.resolve("doc/machine-decision-failure-taxonomy/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.resolve("doc/machine-decision-failure-taxonomy/authorizations/STAGE_1_EXECUTION_AUTHORIZATION.json");
const OUT = path.resolve(process.argv[2] || "artifacts/local/mdft-stage1-development-v1");
const EXPECTED_SPEC_HASH = "85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203";

function stable(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  return `{${Object.keys(x).sort().map((k) => `${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;
}
function shaBytes(x) { return crypto.createHash("sha256").update(x).digest("hex"); }
function hash(x) { return shaBytes(Buffer.from(stable(x))); }
function assert(x, message) { if (!x) throw new Error(message); }
function writeJson(name, value) { fs.writeFileSync(path.join(OUT, name), JSON.stringify(value, null, 2) + "\n"); }
function gitBlob(pathname) { return cp.execFileSync("git", ["hash-object", pathname], { encoding: "utf8" }).trim(); }
function gitHead() { return cp.execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(); }
function elapsed(fn) { const t = performance.now(); const value = fn(); return { value, ms: performance.now() - t }; }
function selectedIdentity(s) {
  return s.selected.map((x) => ({
    seed: x.seed, sourcePolicy: x.sourcePolicy, phase: x.phase, ply: x.ply,
    legalMoveCount: x.legalMoveCount, rawStateKey: x.rawStateKey,
    trajectoryHash: x.trajectoryHash, openingPrefixHash: x.openingPrefixHash, quotaRank: x.quotaRank,
  }));
}
function selectionSummary(s) {
  return {
    generatedGames: s.generatedGames,
    uniqueTrajectories: s.uniqueTrajectories,
    distinctOpeningPrefixes: s.distinctOpeningPrefixes,
    selectedRoots: s.selectedRoots,
    selectedNamua: s.selectedNamua,
    selectedMtaji: s.selectedMtaji,
    sourcePolicyCounts: s.sourcePolicyCounts,
    selectionHash: s.selectionHash,
  };
}
function comparisonRows(rows) {
  const out = JSON.parse(JSON.stringify(rows));
  for (const r of out) {
    for (const key of ["reserve", "house"]) {
      if (r.diagnostics && r.diagnostics.ablation && r.diagnostics.ablation[key]) {
        delete r.diagnostics.ablation[key].bestScore;
      }
    }
  }
  return out;
}
function scientificCore(result, normalizedRows) {
  const core = {
    stageId: result.core.stageId,
    specSha256: result.core.specSha256,
    source: result.core.source,
    readiness: result.core.readiness,
    promotion: result.core.promotion,
    promotedLeafIds: result.core.promotedLeafIds,
    disposition: result.core.disposition,
    rows: normalizedRows,
  };
  core.exactDevelopmentCoreSha256 = hash(core);
  return core;
}
function summaryCore(core) {
  return {
    stageId: core.stageId,
    specSha256: core.specSha256,
    source: core.source,
    readiness: core.readiness,
    promotion: core.promotion,
    promotedLeafIds: core.promotedLeafIds,
    disposition: core.disposition,
    exactDevelopmentCoreSha256: core.exactDevelopmentCoreSha256,
  };
}
function writeGzipShard(side, payload, ceiling) {
  const buffer = zlib.gzipSync(Buffer.from(stable(payload)), { level: 6 });
  assert(buffer.length <= ceiling, `${side} compressed full artifact exceeds frozen shard ceiling`);
  const dir = path.join(OUT, side);
  fs.mkdirSync(dir, { recursive: true });
  const name = "full-shard-0001.json.gz";
  fs.writeFileSync(path.join(dir, name), buffer);
  return { path: `${side}/${name}`, bytes: buffer.length, sha256: shaBytes(buffer) };
}

fs.mkdirSync(OUT, { recursive: true });
const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
const specNoHash = JSON.parse(JSON.stringify(spec));
delete specNoHash.specSha256;
assert(hash(specNoHash) === spec.specSha256, "Stage 1 spec self-hash mismatch");
assert(spec.specSha256 === EXPECTED_SPEC_HASH, "unexpected Stage 1 spec hash");
assert(auth.authorized === true, "Stage 1 authorization is not true");
assert(auth.stageId === spec.stageId, "authorization stage mismatch");
assert(auth.specSha256 === spec.specSha256, "authorization spec mismatch");
assert(auth.seedStart === spec.seedBlock.seedStart && auth.seedEnd === spec.seedBlock.seedEnd, "authorization seed block mismatch");
assert(auth.consumeOnce === true && auth.sameBlockRerunAuthorized === false, "authorization consume-once contract mismatch");
assert(auth.preflightRunId === 33258188633 && auth.preflightAllGatesPass === true, "canonical preflight not bound");
for (const item of auth.sourceBlobs) {
  assert(gitBlob(item.path) === item.gitBlobSha, `source blob mismatch: ${item.path}`);
}

const consumption = {
  schemaVersion: "1.0.0",
  stageId: spec.stageId,
  executionHead: gitHead(),
  seedStart: spec.seedBlock.seedStart,
  seedEnd: spec.seedBlock.seedEnd,
  games: spec.seedBlock.games,
  status: "CONSUMED",
  consumeOnce: true,
  sameBlockRerunAuthorized: false,
  repairAuthorized: false,
  replacementAuthorized: false,
  extensionAuthorized: false,
  consumedAtExecutionStartUtc: new Date().toISOString(),
};
writeJson("CONSUMPTION_RECORD.json", consumption);

const pRun = elapsed(() => P.runDevelopment(spec));
const iRun = elapsed(() => I.runDevelopment(spec));
const pRows = comparisonRows(pRun.value.core.rows);
const iRows = comparisonRows(iRun.value.core.rows);
const pCore = scientificCore(pRun.value, pRows);
const iCore = scientificCore(iRun.value, iRows);

const pGames = pRun.value.records;
const iGames = iRun.value.records;
const pSel = selectedIdentity(pRun.value.selection);
const iSel = selectedIdentity(iRun.value.selection);
const sourceExact = stable(pGames) === stable(iGames);
const selectionSummaryExact = stable(selectionSummary(pRun.value.selection)) === stable(selectionSummary(iRun.value.selection));
const selectedIdentityExact = stable(pSel) === stable(iSel);
const rowsExact = stable(pRows) === stable(iRows);
const coreExact = stable(pCore) === stable(iCore);
const coreHashExact = pCore.exactDevelopmentCoreSha256 === iCore.exactDevelopmentCoreSha256;

const technicalExact = sourceExact && selectionSummaryExact && selectedIdentityExact && rowsExact && coreExact && coreHashExact;
const comparison = {
  schemaVersion: "1.0.0",
  stageId: spec.stageId,
  specSha256: spec.specSha256,
  executionHead: consumption.executionHead,
  sourceGenerationExact: sourceExact,
  rootSelectionSummaryExact: selectionSummaryExact,
  selectedRootIdentityExact: selectedIdentityExact,
  analysisRowsExact: rowsExact,
  developmentCoreExact: coreExact,
  exactDevelopmentCoreHashMatch: coreHashExact,
  productionExactDevelopmentCoreSha256: pCore.exactDevelopmentCoreSha256,
  independentExactDevelopmentCoreSha256: iCore.exactDevelopmentCoreSha256,
  technicalExact,
};
writeJson("FINAL_EXACT_COMPARISON.json", comparison);

const productionPayload = { games: pGames, selection: pSel, rows: pRows };
const independentPayload = { games: iGames, selection: iSel, rows: iRows };
const pShard = writeGzipShard("production", productionPayload, spec.artifactContract.compressedShardCeilingBytes);
const iShard = writeGzipShard("independent", independentPayload, spec.artifactContract.compressedShardCeilingBytes);

let disposition = pCore.disposition;
if (!technicalExact) disposition = "STAGE1-TECHNICAL-INVALID";
const resource = {
  productionMs: pRun.ms,
  independentMs: iRun.ms,
  maxRssKb: process.resourceUsage().maxRSS,
  productionWithinCeiling: pRun.ms <= spec.artifactContract.productionWallClockCeilingMs,
  independentWithinCeiling: iRun.ms <= spec.artifactContract.independentWallClockCeilingMs,
  rssWithinCeiling: process.resourceUsage().maxRSS <= spec.artifactContract.peakRssCeilingKb,
};
if (!resource.productionWithinCeiling || !resource.independentWithinCeiling || !resource.rssWithinCeiling) disposition = "RESOURCE-CENSORED";

const result = {
  schemaVersion: "1.0.0",
  program: "G2-08",
  studyId: "MDFT-STUDY1",
  stageId: spec.stageId,
  stageType: spec.stageType,
  specSha256: spec.specSha256,
  seedBlock: { seedStart: spec.seedBlock.seedStart, seedEnd: spec.seedBlock.seedEnd, games: spec.seedBlock.games, status: "CONSUMED" },
  scientificInferenceAuthorized: technicalExact && disposition !== "STAGE1-TECHNICAL-INVALID" && disposition !== "RESOURCE-CENSORED",
  confirmatoryReuseAllowed: false,
  source: pCore.source,
  readiness: pCore.readiness,
  promotion: pCore.promotion,
  promotedLeafIds: pCore.promotedLeafIds,
  exactDevelopmentCoreSha256: pCore.exactDevelopmentCoreSha256,
  independentExactDevelopmentCoreSha256: iCore.exactDevelopmentCoreSha256,
  exactDevelopmentCoreHashMatch: coreHashExact,
  resource,
  fullArtifacts: { production: pShard, independent: iShard },
  disposition,
  stage2AutomaticAuthorization: false,
};
writeJson("STAGE_1_DEVELOPMENT_RESULT.json", result);
writeJson("ESSENTIAL_CORE.json", summaryCore(pCore));

const manifest = {
  schemaVersion: "1.0.0",
  stageId: spec.stageId,
  sourceBlobs: auth.sourceBlobs,
  outputs: {},
};
for (const rel of [
  "CONSUMPTION_RECORD.json", "FINAL_EXACT_COMPARISON.json", "STAGE_1_DEVELOPMENT_RESULT.json", "ESSENTIAL_CORE.json",
  pShard.path, iShard.path,
]) {
  const b = fs.readFileSync(path.join(OUT, rel));
  manifest.outputs[rel] = { bytes: b.length, sha256: shaBytes(b) };
}
writeJson("HASH_MANIFEST.json", manifest);

console.log(JSON.stringify({
  stageId: result.stageId,
  seeds: result.seedBlock,
  exactDevelopmentCoreHashMatch: result.exactDevelopmentCoreHashMatch,
  readinessPassed: result.readiness.passed,
  promotedLeafIds: result.promotedLeafIds,
  disposition: result.disposition,
  scientificInferenceAuthorized: result.scientificInferenceAuthorized,
  resource: result.resource,
}, null, 2));

if (!technicalExact) process.exitCode = 2;
if (disposition === "RESOURCE-CENSORED") process.exitCode = 3;
