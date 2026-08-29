#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const Core = require("./lib/pcrpr-stage1-production.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function now() { return performance.now(); }
function parseOut() {
  const at = process.argv.indexOf("--out");
  return at >= 0 && process.argv[at + 1]
    ? path.resolve(process.argv[at + 1])
    : path.join(ROOT, "artifacts/local/practical-comeback-reply-pressure-representation/stage1-resource-preflight-v1.json");
}
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive:true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}
function rssGiB() { return process.memoryUsage().rss / (1024 ** 3); }

function run() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  ensure(spec.studyId === "PCRPR-STUDY1", "study drift");
  ensure(spec.stageId === "PCRPR-S1-DEVELOPMENT-2026-08-29-v1", "stage drift");
  ensure(spec.scientificInferenceAuthorized === false, "preflight must remain non-scientific");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone === false, "authorization firewall absent");
  ensure(spec.technicalPreflight.technicalSeedMenu === "28701001..28701064", "technical seed menu drift");

  const maxRss = { value:rssGiB() };
  const sample = { games:64, seedStart:28701001, maxPly:100, phaseQuota:{namua:2, mtaji:2} };

  const sourceStart = now();
  const records = Core.generateCorpus(spec, { games:sample.games, seedStart:sample.seedStart, maxPly:sample.maxPly });
  const selection = Core.selectRoots(records, spec, { phaseQuota:sample.phaseQuota });
  const sourceMs = now() - sourceStart;
  maxRss.value = Math.max(maxRss.value, rssGiB());
  ensure(records.length === 64, "technical preflight source count drift");
  ensure(selection.selected.length > 0, "technical preflight found no disadvantaged root");

  const representationStart = now();
  const allRows = Core.makeRows(selection, spec);
  const representationMs = now() - representationStart;
  maxRss.value = Math.max(maxRss.value, rssGiB());
  ensure(allRows.length > 0, "technical preflight produced no representation rows");
  ensure(allRows.every((row) => row.representation.vector.scalarCount === 80), "feature width drift");

  const continuationRows = allRows.slice(0, Math.min(2, allRows.length));
  const continuationStart = now();
  const measurements = Core.measureRows(continuationRows, spec, {
    replicates:{STRONG:1, MEDIUM:16, WEAK:8},
    horizon:96,
  });
  const continuationMs = now() - continuationStart;
  maxRss.value = Math.max(maxRss.value, rssGiB());
  ensure(measurements.length === continuationRows.length, "continuation preflight row mismatch");

  const selectedRoots = selection.selected.length;
  const rowsPerRoot = allRows.length / selectedRoots;
  const projectedRows = Math.max(spec.readinessGates.minimumDevelopmentRows, Math.ceil(rowsPerRoot * spec.rootSelection.phaseQuota.namua * 2));
  const sourceProjectionMs = sourceMs * (spec.sourcePopulation.games / sample.games);
  const representationPerRowMs = representationMs / allRows.length;
  const continuationPerRowMs = continuationMs / continuationRows.length;
  const productionProjectionMs = sourceProjectionMs + representationPerRowMs * projectedRows + continuationPerRowMs * projectedRows;
  const independentProjectionMs = productionProjectionMs * 1.15;
  const compareAndIoBufferMs = 10 * 60 * 1000;
  const projectedParallelWorkflowWallMs = Math.max(productionProjectionMs, independentProjectionMs) + compareAndIoBufferMs;

  const wallLimitMs = spec.resourceCeilings.workflowWallMinutes * 60 * 1000;
  const rssLimitGiB = spec.resourceCeilings.perJobMaxRSSGiB;
  const gates = {
    sourceSampleCompleted:true,
    representationSampleCompleted:true,
    actualContinuationContractSampleCompleted:true,
    projectedRowsAtLeastReadinessMinimum:projectedRows >= spec.readinessGates.minimumDevelopmentRows,
    productionJobWithinWallCeiling:productionProjectionMs < wallLimitMs,
    independentJobWithinWallCeiling:independentProjectionMs < wallLimitMs,
    parallelWorkflowWithinWallCeiling:projectedParallelWorkflowWallMs < wallLimitMs,
    measuredRssWithinCeiling:maxRss.value < rssLimitGiB,
    scientificSeedBlockUntouched:true,
    scientificTargetPrevalenceNotEstimated:true,
  };
  const passed = Object.values(gates).every(Boolean);
  const result = {
    schemaVersion:1,
    studyId:spec.studyId,
    stageId:spec.stageId,
    classification:"PREAUTHORIZATION-RESOURCE-PREFLIGHT-TECHNICAL-ONLY",
    scientificInferenceAuthorized:false,
    scientificOutcomeGenerated:false,
    scientificSeedsConsumed:false,
    technicalSeedMenu:"28701001..28701064",
    sample:{
      games:sample.games,
      maxPly:sample.maxPly,
      selectedRoots,
      representationRows:allRows.length,
      rowsPerRoot,
      continuationRows:continuationRows.length,
      continuationReplicatesPerRow:25,
      continuationHorizon:96,
    },
    measured:{sourceAndRootSelectionMs:sourceMs,representationMs,continuationMs,maxRssGiB:maxRss.value},
    projected:{
      scientificGames:spec.sourcePopulation.games,
      selectedRoots:spec.rootSelection.phaseQuota.namua + spec.rootSelection.phaseQuota.mtaji,
      rows:projectedRows,
      productionJobMinutes:productionProjectionMs/60000,
      independentJobMinutes:independentProjectionMs/60000,
      parallelWorkflowWallMinutes:projectedParallelWorkflowWallMs/60000,
      workflowCeilingMinutes:spec.resourceCeilings.workflowWallMinutes,
    },
    projectionMethod:"linear source-game scaling + measured per-row representation and full-contract continuation costs; independent job conservatively multiplied by 1.15; production and independent intended to run in parallel with 10-minute compare/I/O buffer",
    targetDistributionInspected:false,
    gates,
    passed,
  };
  writeJson(parseOut(), result);
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  ensure(passed, "PCRPR Stage 1 resource preflight failed");
}

try { run(); }
catch (error) { console.error(error.stack || error.message || String(error)); process.exitCode = 1; }
