#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");

function need(value, message) { if (!value) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(stable(value), "utf8").digest("hex"); }
function sumValues(object) { return Object.values(object || {}).reduce((a, b) => a + b, 0); }

function main() {
  const resultPath = process.argv[2];
  const resourcePath = process.argv[3];
  const outputPath = process.argv[4];
  need(resultPath && resourcePath && outputPath, "usage: verify-gcsrea-stage2-exact-result.js <result> <resource-json> <output>");

  const x = readJson(resultPath);
  const resource = readJson(resourcePath);
  const expectedConfigIds = ["D2_Q1", "D3_Q1", "D2_Q0", "D2_Q2", "B256_Q1_MAXD3", "B1024_Q1_MAXD3"];
  const allowedRelations = new Set(["EQUAL", "SEARCH-SUBSET-EXACT", "SEARCH-SUPERSET-EXACT", "OVERLAP", "DISJOINT"]);

  need(x.studyId === "GCSREA-STUDY1", "study mismatch");
  need(x.stageId === "GCSREA-S2-EXACT-CENSUS-2026-09-27-v1", "stage mismatch");
  need(x.evidenceClass === "FIXED-FINITE-EXACT-CENSUS", "evidence class mismatch");
  need(x.stageDisposition === "STAGE2-EXACT-CENSUS-MEASUREMENT-COMPLETE", "measurement did not complete");
  need(x.fixedDomainCount === 8 && x.forcedDomainCount === 2 && x.nontrivialDomainCount === 6, "fixed census size mismatch");
  need(x.searchConfigurationCount === 6, "search configuration count mismatch");
  need(x.actualNontrivialDomainConfigurationMeasurements === 36, "nontrivial measurement count mismatch");
  need(x.productionSearchExecutions === 36 && x.independentSearchExecutions === 36, "per-implementation search execution count mismatch");
  need(x.productionSearchExecutions + x.independentSearchExecutions === 72, "total search execution count mismatch");
  need(x.productionIndependentSearchExact === true && x.productionIndependentClassifierExact === true, "production/independent exactness mismatch");
  need(x.formalSummaryMode === "FINITE-CENSUS-DESCRIPTIVE-EXACT", "formal summary mode mismatch");

  need(x.pValuesComputed === false, "p-values must not be computed");
  need(x.confidenceIntervalsComputed === false, "confidence intervals must not be computed");
  need(x.configurationWinnerSelected === false, "configuration winner must not be selected");
  need(x.wholeBaoProbabilityEstimated === false, "whole-Bao probability must not be estimated");
  need(x.generalStage2FreshSeedReads === 0, "general Stage2 fresh seed access detected");
  need(x.g405CandidateRescanCount === 0 && x.g405DomainReplacementCount === 0, "G4-05 protected boundary violated");
  need(x.g410Depth11AccessCount === 0 && x.publicAiChanged === false, "protected boundary violated");

  need(Array.isArray(x.domains) && x.domains.length === 8, "domain row count mismatch");
  const domainIndexes = x.domains.map(d => d.domainIndex).sort((a, b) => a - b);
  need(stable(domainIndexes) === stable([1,2,3,4,5,6,7,8]), "domain identity mismatch");
  let forcedSeen = 0;
  let nontrivialSeen = 0;
  let nontrivialRows = 0;
  for (const d of x.domains) {
    need(Array.isArray(d.configurations) && d.configurations.length === 6, `configuration row count mismatch domain ${d.domainIndex}`);
    need(stable(d.configurations.map(r => r.configurationId)) === stable(expectedConfigIds), `configuration identity/order mismatch domain ${d.domainIndex}`);
    need(Array.isArray(d.exactOptimalMoveKeys) && d.exactOptimalMoveKeys.length > 0, `exact optimal set missing domain ${d.domainIndex}`);
    if (d.measurementClass === "TRIVIAL-FORCED-LEGAL") {
      forcedSeen += 1;
      need(d.rootLegalMoveCount === 1, `forced legal width mismatch domain ${d.domainIndex}`);
      for (const r of d.configurations) {
        need(r.forced === true && r.estimable === true && r.searchHelperExecuted === false, `forced search execution violation domain ${d.domainIndex}:${r.configurationId}`);
        need(r.classification && r.classification.measurementClass === "TRIVIAL-FORCED-LEGAL", `forced classification missing domain ${d.domainIndex}:${r.configurationId}`);
        need(r.classification.canonicalBestInExactOptimalSet === true, `forced canonical-best mismatch domain ${d.domainIndex}:${r.configurationId}`);
        need(r.classification.topSetRelation === "EQUAL", `forced TopSet relation mismatch domain ${d.domainIndex}:${r.configurationId}`);
        need(r.classification.pvFirstMoveInExactOptimalSet === true, `forced PV mismatch domain ${d.domainIndex}:${r.configurationId}`);
        need(r.classification.exactOptimalBestRank === 1 && r.classification.exactOptimalWorstRank === 1, `forced rank mismatch domain ${d.domainIndex}:${r.configurationId}`);
      }
    } else {
      nontrivialSeen += 1;
      need(d.measurementClass === "NONTRIVIAL-SEARCH" && d.rootLegalMoveCount >= 2, `nontrivial class mismatch domain ${d.domainIndex}`);
      for (const r of d.configurations) {
        nontrivialRows += 1;
        need(r.forced === false && r.searchHelperExecuted === true, `nontrivial search execution flag mismatch domain ${d.domainIndex}:${r.configurationId}`);
        if (r.estimable === false) {
          need(r.reasonCode === "SEARCH-NON-ESTIMABLE", `non-estimable reason mismatch domain ${d.domainIndex}:${r.configurationId}`);
          need(r.classification === undefined, `non-estimable row must not carry classification domain ${d.domainIndex}:${r.configurationId}`);
        } else {
          need(r.estimable === true && r.classification, `estimable classification missing domain ${d.domainIndex}:${r.configurationId}`);
          need(allowedRelations.has(r.classification.topSetRelation), `invalid TopSet relation domain ${d.domainIndex}:${r.configurationId}`);
          need(typeof r.classification.canonicalBestInExactOptimalSet === "boolean", `canonical membership type mismatch domain ${d.domainIndex}:${r.configurationId}`);
          need(r.classification.pvFirstMoveInExactOptimalSet === null || typeof r.classification.pvFirstMoveInExactOptimalSet === "boolean", `PV membership type mismatch domain ${d.domainIndex}:${r.configurationId}`);
          need(Number.isInteger(r.classification.exactOptimalBestRank) && r.classification.exactOptimalBestRank >= 1, `best rank invalid domain ${d.domainIndex}:${r.configurationId}`);
          need(Number.isInteger(r.classification.exactOptimalWorstRank) && r.classification.exactOptimalWorstRank >= r.classification.exactOptimalBestRank, `worst rank invalid domain ${d.domainIndex}:${r.configurationId}`);
        }
      }
    }
  }
  need(forcedSeen === 2 && nontrivialSeen === 6 && nontrivialRows === 36, "forced/nontrivial accounting mismatch");

  need(Array.isArray(x.byConfiguration) && x.byConfiguration.length === 6, "configuration summary count mismatch");
  need(stable(x.byConfiguration.map(r => r.configurationId)) === stable(expectedConfigIds), "configuration summary identity/order mismatch");
  for (const row of x.byConfiguration) {
    need(row.totalFixedDomains === 8 && row.forcedDomains === 2 && row.nontrivialDomains === 6, `configuration census mismatch ${row.configurationId}`);
    need(row.forcedExactAgreementDomains === 2, `forced exact agreement mismatch ${row.configurationId}`);
    need(row.nontrivialEstimableDomains + row.nontrivialNonEstimableDomains === 6, `estimability accounting mismatch ${row.configurationId}`);
    need(sumValues(row.nontrivialTopSetRelationCounts) === row.nontrivialEstimableDomains, `relation accounting mismatch ${row.configurationId}`);
    for (const key of Object.keys(row.nontrivialTopSetRelationCounts || {})) need(allowedRelations.has(key), `invalid relation summary key ${row.configurationId}:${key}`);
    need(row.nontrivialCanonicalBestInExactCount >= 0 && row.nontrivialCanonicalBestInExactCount <= row.nontrivialEstimableDomains, `canonical count invalid ${row.configurationId}`);
    need(row.nontrivialPvFirstInExactCount >= 0 && row.nontrivialPvFirstInExactCount <= row.nontrivialEstimableDomains, `PV count invalid ${row.configurationId}`);
  }

  const withoutDigest = { ...x };
  delete withoutDigest.coreSha256;
  need(/^[0-9a-f]{64}$/.test(x.coreSha256), "core digest missing");
  need(sha256(withoutDigest) === x.coreSha256, "core digest mismatch");

  need(Number.isFinite(resource.elapsedSeconds) && resource.elapsedSeconds >= 0 && resource.elapsedSeconds * 1000 <= 1800000, "elapsed resource ceiling exceeded");
  need(Number.isFinite(resource.maxRssKb) && resource.maxRssKb >= 0 && resource.maxRssKb * 1024 <= 2147483648, "peak RSS ceiling exceeded");
  const artifactBytes = fs.statSync(resultPath).size;
  need(artifactBytes <= 33554432, "result artifact size ceiling exceeded");

  const verification = {
    schemaVersion: 1,
    studyId: x.studyId,
    stageId: x.stageId,
    disposition: "STAGE2-EXACT-CENSUS-STRUCTURED-VERIFICATION-PASS",
    verifiedCoreSha256: x.coreSha256,
    fixedDomainCount: 8,
    forcedDomainCount: 2,
    nontrivialDomainCount: 6,
    searchConfigurationCount: 6,
    productionSearchExecutions: 36,
    independentSearchExecutions: 36,
    totalSearchExecutions: 72,
    productionIndependentSearchExact: true,
    productionIndependentClassifierExact: true,
    pValuesComputed: false,
    confidenceIntervalsComputed: false,
    configurationWinnerSelected: false,
    wholeBaoProbabilityEstimated: false,
    generalStage2FreshSeedReads: 0,
    g405CandidateRescanCount: 0,
    g405DomainReplacementCount: 0,
    g410Depth11AccessCount: 0,
    publicAiChanged: false,
    elapsedSeconds: resource.elapsedSeconds,
    maxRssKb: resource.maxRssKb,
    resultBytes: artifactBytes
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(verification, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(verification, null, 2)}\n`);
}

main();
