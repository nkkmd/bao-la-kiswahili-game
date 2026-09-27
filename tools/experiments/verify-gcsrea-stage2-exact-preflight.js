#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const Prod = require("./lib/gcsrea-exact-agreement-production.js");
const Indep = require("./lib/gcsrea-exact-agreement-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC = "doc/geometry-conditioned-search-reliability-exact-agreement/prereg/STAGE_2_EXACT_CENSUS_SPEC.json";
const MANIFEST = "doc/local-game-tree-geometry-exact-consequence-bridge/preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json";
const PROD_LIB = "tools/experiments/lib/gcsrea-exact-agreement-production.js";
const IND_LIB = "tools/experiments/lib/gcsrea-exact-agreement-independent.js";

function need(value, message) { if (!value) throw new Error(message); }
function json(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); }
function raw(rel) { return fs.readFileSync(path.join(ROOT, rel)); }
function sha256(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }
function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
}
function equal(a, b) { return canonical(a) === canonical(b); }

function syntheticFixtures() {
  return [
    {
      id: "EQUAL",
      exact: ["a", "b"],
      search: { estimable:true, canonicalBestMoveKey:"a", topSetMoveKeys:["a","b"], ranking:[{moveKey:"a",score:10},{moveKey:"b",score:10},{moveKey:"c",score:2}], pvMoveKeys:["b"] },
      expected: "EQUAL"
    },
    {
      id: "SEARCH-SUBSET-EXACT",
      exact: ["a", "b"],
      search: { estimable:true, canonicalBestMoveKey:"a", topSetMoveKeys:["a"], ranking:[{moveKey:"a",score:10},{moveKey:"b",score:9},{moveKey:"c",score:2}], pvMoveKeys:["a"] },
      expected: "SEARCH-SUBSET-EXACT"
    },
    {
      id: "SEARCH-SUPERSET-EXACT",
      exact: ["a"],
      search: { estimable:true, canonicalBestMoveKey:"a", topSetMoveKeys:["a","b"], ranking:[{moveKey:"a",score:10},{moveKey:"b",score:10},{moveKey:"c",score:2}], pvMoveKeys:["a"] },
      expected: "SEARCH-SUPERSET-EXACT"
    },
    {
      id: "OVERLAP",
      exact: ["a", "b"],
      search: { estimable:true, canonicalBestMoveKey:"b", topSetMoveKeys:["b","c"], ranking:[{moveKey:"a",score:5},{moveKey:"b",score:10},{moveKey:"c",score:10}], pvMoveKeys:["c"] },
      expected: "OVERLAP"
    },
    {
      id: "DISJOINT",
      exact: ["a"],
      search: { estimable:true, canonicalBestMoveKey:"b", topSetMoveKeys:["b"], ranking:[{moveKey:"a",score:5},{moveKey:"b",score:10}], pvMoveKeys:["b"] },
      expected: "DISJOINT"
    },
    {
      id: "RANK-TIE",
      exact: ["b", "c"],
      search: { estimable:true, canonicalBestMoveKey:"a", topSetMoveKeys:["a"], ranking:[{moveKey:"a",score:12},{moveKey:"b",score:8},{moveKey:"c",score:8},{moveKey:"d",score:1}], pvMoveKeys:["a"] },
      expected: "DISJOINT",
      expectedBestRank: 2,
      expectedWorstRank: 2
    }
  ];
}

function main() {
  const exactPreflightPath = process.argv[2];
  const outputPath = process.argv[3];
  need(exactPreflightPath && outputPath, "usage: verify-gcsrea-stage2-exact-preflight.js <exact-oracle-preflight-json> <output-json>");

  const spec = json(SPEC);
  const manifest = json(MANIFEST);
  const exactPreflight = JSON.parse(fs.readFileSync(exactPreflightPath, "utf8"));

  need(spec.studyId === "GCSREA-STUDY1", "study mismatch");
  need(spec.stageId === "GCSREA-S2-EXACT-CENSUS-2026-09-27-v1", "stage mismatch");
  need(spec.statusAtFreeze.includes("ACTUAL-MEASUREMENT-NOT-AUTHORIZED"), "preflight must not authorize measurement");
  need(spec.technicalPreflight.actualFixed8SearchMeasurementAuthorized === false, "actual measurement unexpectedly authorized");
  need(spec.finalMeasurementRequiresSeparateAuthorization === true, "separate final authorization required");
  need(spec.generalDomainStage2.authorized === false && spec.generalDomainStage2.readsAuthorized === 0, "general Stage 2 must remain closed");
  need(spec.protectedBoundary.g410Depth11Access === false && spec.protectedBoundary.publicAiChange === false, "protected boundary mismatch");

  need(manifest.populationRole === "IMMUTABLE-G4-05-FORMAL-DOMAINS-ONLY", "manifest role mismatch");
  need(manifest.formalDomainCount === 8 && manifest.domains.length === 8, "fixed-8 manifest required");
  need(manifest.selectionChangesAfterFreezeAllowed === false && manifest.seedExtensionAllowed === false && manifest.candidateRescanAllowed === false, "manifest mutability detected");
  need(Array.isArray(manifest.authoritativeIdentity.validatedTransformSet) && manifest.authoritativeIdentity.validatedTransformSet.length === 0, "transform set must be empty");
  const widths = manifest.domains.map(x => x.rootLegalMoveCount);
  need(widths.filter(x => x === 1).length === 2 && widths.filter(x => x === 2).length === 6, "expected 2 width-1 and 6 width-2 roots");
  for (const d of manifest.domains) {
    need(Number.isInteger(d.seed) && Number.isInteger(d.ply), `invalid source identity domain ${d.domainIndex}`);
    need(/^[0-9a-f]{64}$/.test(d.rootStateKey), `invalid rootStateKey domain ${d.domainIndex}`);
    need(/^[0-9a-f]{64}$/.test(d.stateSetSha256) && /^[0-9a-f]{64}$/.test(d.transitionSetSha256) && /^[0-9a-f]{64}$/.test(d.solutionSha256), `invalid exact digest domain ${d.domainIndex}`);
    need(["WIN","LOSS"].includes(d.rootStatus), `unexpected root status domain ${d.domainIndex}`);
    need(Array.isArray(d.rootOptimalMoveKeys) && d.rootOptimalMoveKeys.length > 0, `missing exact optimal set domain ${d.domainIndex}`);
    if (d.rootLegalMoveCount === 1) need(d.rootOptimalMoveKeys.length === 1, `forced root must have singleton exact set domain ${d.domainIndex}`);
  }

  need(exactPreflight.disposition === "EXACT-ORACLE-INTEGRITY-PREFLIGHT-PASS", "exact oracle integrity preflight failed");
  need(exactPreflight.core && exactPreflight.core.fixedDomainCount === 8, "exact preflight fixed domain count mismatch");
  need(exactPreflight.core.actualSearchVsExactMeasurements === 0, "exact preflight performed forbidden search measurement");
  need(exactPreflight.scientificOutcomeGenerated === false, "exact preflight unexpectedly generated scientific outcome");

  const prodSource = raw(PROD_LIB).toString("utf8");
  const indSource = raw(IND_LIB).toString("utf8");
  for (const [name, source] of [["production", prodSource], ["independent", indSource]]) {
    for (const banned of ["silgm-", "conditionResult(", "public/engine", "public/ai", "applyMove(", "moveVariants("]) {
      need(!source.includes(banned), `${name} classifier must remain search/engine independent: ${banned}`);
    }
  }

  const fixtureResults = [];
  for (const fixture of syntheticFixtures()) {
    const p = Prod.classify(fixture.search, fixture.exact);
    const i = Indep.classify(fixture.search, fixture.exact);
    need(equal(p, i), `production/independent mismatch fixture ${fixture.id}`);
    need(p.topSetRelation === fixture.expected, `relation mismatch fixture ${fixture.id}`);
    if (fixture.expectedBestRank !== undefined) need(p.exactOptimalBestRank === fixture.expectedBestRank, `best rank mismatch fixture ${fixture.id}`);
    if (fixture.expectedWorstRank !== undefined) need(p.exactOptimalWorstRank === fixture.expectedWorstRank, `worst rank mismatch fixture ${fixture.id}`);
    fixtureResults.push({ id: fixture.id, classification: p });
  }
  const forcedP = Prod.forcedClassification("only", ["only"]);
  const forcedI = Indep.forcedClassification("only", ["only"]);
  need(equal(forcedP, forcedI), "forced classification mismatch");
  need(forcedP.searchHelperExecuted === false && forcedP.topSetRelation === "EQUAL", "forced classification semantics mismatch");

  const expectedConfigs = ["D2_Q1","D3_Q1","D2_Q0","D2_Q2","B256_Q1_MAXD3","B1024_Q1_MAXD3"];
  need(spec.searchConfigurations.length === 6, "six frozen search configurations required");
  need(equal(spec.searchConfigurations.map(x => x.id), expectedConfigs), "search configuration order/identity mismatch");
  need(spec.resourceCeilingForFutureMeasurement.maximumNontrivialSearchExecutionsPerImplementation === 36, "per-implementation search ceiling mismatch");
  need(spec.resourceCeilingForFutureMeasurement.maximumTotalNontrivialSearchExecutionsAcrossTwoImplementations === 72, "total search ceiling mismatch");

  const out = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditClass: "TECHNICAL-PREFLIGHT / NO-ACTUAL-FIXED8-SEARCH-MEASUREMENT",
    disposition: "STAGE2-EXACT-CENSUS-PREFLIGHT-PASS",
    specSha256: sha256(raw(SPEC)),
    fixedManifestSha256: sha256(raw(MANIFEST)),
    fixedDomainCount: 8,
    forcedRootCount: 2,
    nontrivialRootCount: 6,
    searchConfigurationCount: 6,
    syntheticFixtureCount: fixtureResults.length,
    productionIndependentClassifierExact: true,
    exactOracleIntegrityDisposition: exactPreflight.disposition,
    exactOracleIntegrityCoreSha256: exactPreflight.coreSha256,
    actualFixed8SearchMeasurements: 0,
    generalStage2FreshSeedReads: 0,
    g405CandidateRescanCount: 0,
    g405DomainReplacementCount: 0,
    g410Depth11AccessCount: 0,
    publicAiChanged: false,
    scientificMeasurementPerformed: false,
    fixtureResults,
    forcedFixture: forcedP
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
