#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const T = require("./lib/restricted-endgame-transition.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");
const SearchP = require("./lib/silgm-production.js");
const SearchI = require("./lib/silgm-independent.js");
const AgreeP = require("./lib/gcsrea-exact-agreement-production.js");
const AgreeI = require("./lib/gcsrea-exact-agreement-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/prereg/STAGE_2_EXACT_CENSUS_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_2_EXACT_MEASUREMENT_AUTHORIZATION.json");
const STAGE_ID = "GCSREA-S2-EXACT-CENSUS-2026-09-27-v1";

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(typeof value === "string" ? value : stable(value), "utf8").digest("hex"); }
function equal(a, b) { return stable(a) === stable(b); }
function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 1) {
    if (!a[i].startsWith("--")) continue;
    const key = a[i].slice(2);
    const next = a[i + 1];
    if (next && !next.startsWith("--")) { out[key] = next; i += 1; }
    else out[key] = true;
  }
  return out;
}
function independentRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
function materialize(entry, independent = false) {
  const random = independent ? independentRng(entry.seed) : seededRandom(entry.seed);
  let state = E.initialState();
  const moveKey = independent ? V.moveKey : T.moveKey;
  for (let ply = 0; ply < entry.ply; ply += 1) {
    need(state.winner === null, `trajectory ended early:${entry.domainIndex}:${ply}`);
    const moves = E.moveVariants(state).map(clone).sort((a, b) => moveKey(a).localeCompare(moveKey(b)));
    need(moves.length > 0, `no legal move:${entry.domainIndex}:${ply}`);
    const selected = moves[Math.min(moves.length - 1, Math.floor(random() * moves.length))];
    state = E.applyMove(state, selected).state;
    need(state.reason !== "relay-limit", `relay-limit:${entry.domainIndex}:${ply + 1}`);
  }
  const key = independent ? V.stateKey(state) : T.directStateKey(state);
  need(key === entry.rootStateKey, `root identity mismatch:${entry.domainIndex}:${independent ? "independent" : "production"}`);
  return state;
}
function legalKeys(state, independent = false) {
  const moveKey = independent ? V.moveKey : T.moveKey;
  return E.moveVariants(state).map(moveKey).sort();
}
function structuralRows(spec, manifest) {
  const rows = [];
  for (const entry of manifest.domains.slice().sort((a,b)=>a.domainIndex-b.domainIndex)) {
    const pState = materialize(entry, false);
    const iState = materialize(entry, true);
    need(T.directStateKey(pState) === V.stateKey(iState), `production/independent state mismatch:${entry.domainIndex}`);
    const pLegal = legalKeys(pState, false), iLegal = legalKeys(iState, true);
    need(equal(pLegal, iLegal), `legal move identity mismatch:${entry.domainIndex}`);
    need(pLegal.length === entry.rootLegalMoveCount, `root legal width mismatch:${entry.domainIndex}`);
    for (const key of entry.rootOptimalMoveKeys) need(pLegal.includes(key), `exact optimal move missing from legal universe:${entry.domainIndex}:${key}`);
    if (entry.rootLegalMoveCount === 1) {
      need(entry.rootOptimalMoveKeys.length === 1 && entry.rootOptimalMoveKeys[0] === pLegal[0], `forced root exact-set mismatch:${entry.domainIndex}`);
    }
    rows.push({ domainIndex:entry.domainIndex, seed:entry.seed, ply:entry.ply, rootStateKey:entry.rootStateKey, rootLegalMoveCount:pLegal.length, legalMoveKeys:pLegal, exactOptimalMoveKeys:[...entry.rootOptimalMoveKeys].sort() });
  }
  need(rows.filter(x=>x.rootLegalMoveCount===1).length===2, "forced root count mismatch");
  need(rows.filter(x=>x.rootLegalMoveCount>=2).length===6, "nontrivial root count mismatch");
  need(spec.searchConfigurations.length===6, "search configuration count mismatch");
  return rows;
}
function searchComparable(result) {
  if (!result.estimable) return { estimable:false, completedDepth:result.completedDepth || 0 };
  return {
    estimable:true,
    completedDepth:result.completedDepth,
    canonicalBestMoveKey:result.canonicalBestMoveKey,
    topSetMoveKeys:[...result.topSetMoveKeys].sort(),
    bestScore:result.bestScore,
    secondBestScore:result.secondBestScore,
    bestSecondGap:result.bestSecondGap,
    ranking:result.ranking.map(x=>({moveKey:x.moveKey,score:x.score})).sort((a,b)=>a.moveKey.localeCompare(b.moveKey)),
    pvMoveKeys:[...result.pvMoveKeys]
  };
}
function emptyRelationCounts() {
  return { EQUAL:0, "SEARCH-SUBSET-EXACT":0, "SEARCH-SUPERSET-EXACT":0, OVERLAP:0, DISJOINT:0 };
}
function execute(spec, manifest, authorization, lease) {
  need(authorization.studyId === "GCSREA-STUDY1" && authorization.stageId === STAGE_ID, "authorization identity mismatch");
  need(authorization.decision === "GCSREA-STUDY1-STAGE2-EXACT-CENSUS-MEASUREMENT-AUTHORIZED-ONCE", "measurement authorization missing");
  need(authorization.authorizedScientificMeasurements === 1 && authorization.rerunAuthorized === false, "one-shot authorization mismatch");
  need(authorization.fixedDomainCount === 8 && authorization.searchConfigurationCount === 6, "authorization census mismatch");
  need(authorization.generalStage2FreshSeedReadAuthorized === false && authorization.g410Depth11AccessAuthorized === false && authorization.publicAiChangeAuthorized === false, "authorization protected boundary mismatch");
  need(lease && lease.leaseClass === "DURABLE-GITHUB-ACTIONS-SINGLE-EXACT-CENSUS-MEASUREMENT-LEASE", "durable measurement lease required");
  need(lease.effectiveAuthorization === authorization.decision && lease.acquiredBeforeActualMeasurement === true, "lease authorization mismatch");

  const rows = [];
  let prodCalls = 0, indCalls = 0;
  for (const entry of manifest.domains.slice().sort((a,b)=>a.domainIndex-b.domainIndex)) {
    const pState = materialize(entry, false);
    const iState = materialize(entry, true);
    const pLegal = legalKeys(pState, false), iLegal = legalKeys(iState, true);
    need(equal(pLegal, iLegal), `legal universe mismatch:${entry.domainIndex}`);
    need(pLegal.length === entry.rootLegalMoveCount, `legal width mismatch:${entry.domainIndex}`);
    const exact = [...entry.rootOptimalMoveKeys].sort();
    const domain = {
      domainIndex:entry.domainIndex,
      seed:entry.seed,
      ply:entry.ply,
      rootStateKey:entry.rootStateKey,
      rootStatus:entry.rootStatus,
      rootAbsoluteWinner:entry.rootAbsoluteWinner,
      rootDtf:entry.rootDtf,
      rootLegalMoveCount:entry.rootLegalMoveCount,
      exactOptimalMoveKeys:exact,
      measurementClass:entry.rootLegalMoveCount===1 ? "TRIVIAL-FORCED-LEGAL" : "NONTRIVIAL-SEARCH",
      configurations:[]
    };
    for (const config of spec.searchConfigurations) {
      if (entry.rootLegalMoveCount === 1) {
        const p = AgreeP.forcedClassification(pLegal[0], exact);
        const i = AgreeI.forcedClassification(iLegal[0], exact);
        need(equal(p,i), `forced classifier mismatch:${entry.domainIndex}:${config.id}`);
        domain.configurations.push({ configurationId:config.id, estimable:true, forced:true, searchHelperExecuted:false, classification:p });
        continue;
      }
      const pSearch = SearchP.conditionResult(pState, config);
      prodCalls += 1;
      const iSearch = SearchI.conditionResult(iState, config);
      indCalls += 1;
      const pc = searchComparable(pSearch), ic = searchComparable(iSearch);
      need(equal(pc, ic), `production/independent search mismatch:${entry.domainIndex}:${config.id}`);
      if (!pc.estimable) {
        domain.configurations.push({ configurationId:config.id, estimable:false, forced:false, searchHelperExecuted:true, completedDepth:pc.completedDepth, reasonCode:"SEARCH-NON-ESTIMABLE" });
        continue;
      }
      const pClass = AgreeP.classify(pc, exact);
      const iClass = AgreeI.classify(ic, exact);
      need(equal(pClass,iClass), `production/independent classification mismatch:${entry.domainIndex}:${config.id}`);
      domain.configurations.push({ configurationId:config.id, estimable:true, forced:false, searchHelperExecuted:true, completedDepth:pc.completedDepth, search:pc, classification:pClass });
    }
    rows.push(domain);
  }
  need(prodCalls <= spec.resourceCeilingForFutureMeasurement.maximumNontrivialSearchExecutionsPerImplementation, "production search call ceiling exceeded");
  need(indCalls <= spec.resourceCeilingForFutureMeasurement.maximumNontrivialSearchExecutionsPerImplementation, "independent search call ceiling exceeded");
  need(prodCalls + indCalls <= spec.resourceCeilingForFutureMeasurement.maximumTotalNontrivialSearchExecutionsAcrossTwoImplementations, "total search call ceiling exceeded");

  const byConfiguration = [];
  for (const config of spec.searchConfigurations) {
    const forced = [], nontrivial = [];
    for (const domain of rows) {
      const r = domain.configurations.find(x=>x.configurationId===config.id);
      (r.forced ? forced : nontrivial).push(r);
    }
    const estimable = nontrivial.filter(x=>x.estimable);
    const relations = emptyRelationCounts();
    for (const r of estimable) relations[r.classification.topSetRelation] += 1;
    byConfiguration.push({
      configurationId:config.id,
      totalFixedDomains:8,
      forcedDomains:forced.length,
      forcedExactAgreementDomains:forced.filter(x=>x.classification.canonicalBestInExactOptimalSet && x.classification.topSetRelation==="EQUAL" && x.classification.pvFirstMoveInExactOptimalSet).length,
      nontrivialDomains:nontrivial.length,
      nontrivialEstimableDomains:estimable.length,
      nontrivialNonEstimableDomains:nontrivial.length-estimable.length,
      nontrivialCanonicalBestInExactCount:estimable.filter(x=>x.classification.canonicalBestInExactOptimalSet).length,
      nontrivialPvFirstInExactCount:estimable.filter(x=>x.classification.pvFirstMoveInExactOptimalSet===true).length,
      nontrivialTopSetRelationCounts:relations,
      nontrivialExactOptimalBestRankHistogram:Object.fromEntries([...new Set(estimable.map(x=>x.classification.exactOptimalBestRank))].sort((a,b)=>a-b).map(rank=>[String(rank),estimable.filter(x=>x.classification.exactOptimalBestRank===rank).length])),
      nontrivialExactOptimalWorstRankHistogram:Object.fromEntries([...new Set(estimable.map(x=>x.classification.exactOptimalWorstRank))].sort((a,b)=>a-b).map(rank=>[String(rank),estimable.filter(x=>x.classification.exactOptimalWorstRank===rank).length]))
    });
  }

  const core = {
    schemaVersion:1,
    studyId:"GCSREA-STUDY1",
    stageId:STAGE_ID,
    evidenceClass:"FIXED-FINITE-EXACT-CENSUS",
    stageDisposition:"STAGE2-EXACT-CENSUS-MEASUREMENT-COMPLETE",
    fixedDomainCount:8,
    forcedDomainCount:2,
    nontrivialDomainCount:6,
    searchConfigurationCount:6,
    actualNontrivialDomainConfigurationMeasurements:prodCalls,
    productionSearchExecutions:prodCalls,
    independentSearchExecutions:indCalls,
    productionIndependentSearchExact:true,
    productionIndependentClassifierExact:true,
    formalSummaryMode:"FINITE-CENSUS-DESCRIPTIVE-EXACT",
    pValuesComputed:false,
    confidenceIntervalsComputed:false,
    configurationWinnerSelected:false,
    wholeBaoProbabilityEstimated:false,
    generalStage2FreshSeedReads:0,
    g405CandidateRescanCount:0,
    g405DomainReplacementCount:0,
    g410Depth11AccessCount:0,
    publicAiChanged:false,
    domains:rows,
    byConfiguration
  };
  return { ...core, coreSha256:sha256(core) };
}

function main() {
  const a = args();
  const spec = readJson(SPEC_PATH);
  need(spec.studyId === "GCSREA-STUDY1" && spec.stageId === STAGE_ID, "spec identity mismatch");
  const manifest = readJson(path.join(ROOT, spec.population.manifestPath));
  need(manifest.populationRole === spec.population.populationRoleRequired, "manifest population role mismatch");
  need(manifest.formalDomainCount===8 && manifest.domains.length===8, "fixed-8 manifest required");

  if (a["preflight-only"]) {
    const rows = structuralRows(spec, manifest);
    const out = {
      schemaVersion:1,
      studyId:spec.studyId,
      stageId:spec.stageId,
      disposition:"STAGE2-EXACT-CENSUS-PREMEASUREMENT-STRUCTURAL-PASS",
      fixedDomainCount:8,
      forcedRootCount:2,
      nontrivialRootCount:6,
      legalIdentityProductionIndependentExact:true,
      actualFixed8SearchMeasurements:0,
      productionSearchExecutions:0,
      independentSearchExecutions:0,
      generalStage2FreshSeedReads:0,
      g410Depth11AccessCount:0,
      scientificMeasurementPerformed:false,
      rows
    };
    if (a.output) { fs.mkdirSync(path.dirname(path.resolve(a.output)),{recursive:true}); fs.writeFileSync(path.resolve(a.output),`${JSON.stringify(out,null,2)}\n`); }
    process.stdout.write(`${JSON.stringify(out,null,2)}\n`);
    return;
  }

  need(a["execute-authorized-once"], "only --preflight-only or --execute-authorized-once is allowed");
  need(fs.existsSync(AUTH_PATH), "measurement authorization file missing");
  need(a.lease && fs.existsSync(path.resolve(a.lease)), "measurement lease file missing");
  need(a["output-dir"], "--output-dir required");
  const authorization = readJson(AUTH_PATH);
  const lease = readJson(path.resolve(a.lease));
  const result = execute(spec, manifest, authorization, lease);
  const outputDir = path.resolve(a["output-dir"]);
  fs.mkdirSync(outputDir,{recursive:true});
  fs.writeFileSync(path.join(outputDir,"STAGE_2_EXACT_CENSUS_RESULT.json"),`${JSON.stringify(result,null,2)}\n`);
  process.stdout.write(`${JSON.stringify({event:"GCSREA-STAGE2-EXACT-CENSUS-COMPLETE",stageDisposition:result.stageDisposition,fixedDomainCount:result.fixedDomainCount,nontrivialMeasurements:result.actualNontrivialDomainConfigurationMeasurements,productionSearchExecutions:result.productionSearchExecutions,independentSearchExecutions:result.independentSearchExecutions,coreSha256:result.coreSha256},null,2)}\n`);
}

main();
