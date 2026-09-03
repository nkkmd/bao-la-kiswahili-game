#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const S2=require("./lib/silgm-stage2-production.js");
const ROOT=path.resolve(__dirname,"../..");
function read(p){return JSON.parse(fs.readFileSync(path.join(ROOT,p),"utf8"));}
function need(x,m){if(!x)throw Error(m);}
function uniq(a){return [...new Set(a)].sort();}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha(v){return crypto.createHash("sha256").update(typeof v==="string"?v:canon(v),"utf8").digest("hex");}
const BASE_PATH="doc/bao-rule-mechanism-geometry-intervention/prereg/UPSTREAM_IDENTITY_FIREWALL.json";
const SILGM_FW_PATH="doc/search-instability-local-geometry-mechanism/prereg/UPSTREAM_IDENTITY_FIREWALL.json";
const S1_ID_PATH="doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json";
const S1_SPEC_PATH="doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json";
const S2_SPEC_PATH="doc/search-instability-local-geometry-mechanism/prereg/STAGE_2_FORMAL_SPEC.json";
const OUT=path.join(ROOT,"doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const base=read(BASE_PATH),silgmFw=read(SILGM_FW_PATH),s1Id=read(S1_ID_PATH),s1=read(S1_SPEC_PATH),s2=read(S2_SPEC_PATH);
need(base.scientificOutcomeFieldsRetained===false,"base scientific fields retained");
need(base.g303DiagnosticScientificFieldsRetained===false,"base G3-03 diagnostics retained");
need(base.g304ScientificOutcomeFieldsRetained===false,"base G3-04 outcomes retained");
need(base.g305PartialScientificFieldsRetained===false,"base G3-05 scientific fields retained");
need(silgmFw.scientificOutcomeFieldsRetained===false&&silgmFw.g306SelectionMismatchDiagnosticsRetained===false,"SILGM firewall invalid");
need(s1Id.scientificOutcomeFieldsRetained===false&&s1Id.identityRowCount===48,"SILGM Stage1 identity manifest invalid");
const brmgiControl={stageDisposition:"TECHNICAL-INVALID",formalPromotedCandidateSet:[]};
const selection=S2.selectPopulation(s2,s1,base,silgmFw,brmgiControl,s1Id);
need(selection.selectionCore.populationComplete===true,"SILGM Stage2 identity population incomplete");
need(selection.selectionCore.selectedCounts.total===72,"SILGM Stage2 identity count mismatch");
need(selection.selectionCoreSha256==="c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89","SILGM Stage2 selection identity mismatch");
const s1rows=s1Id.identityRows.map(x=>({sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.fullTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256}));
const s2rows=selection.selectionCore.selected.map(x=>({sourceSeed:x.seed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.fullTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256}));
const roots=uniq([...(base.identitySets.rootRawSha256||[]),...s1rows.map(x=>x.rootRawSha256),...s2rows.map(x=>x.rootRawSha256)]);
const traj=uniq([...(base.identitySets.sourceTrajectorySha256||[]),...s1rows.map(x=>x.sourceTrajectorySha256),...s2rows.map(x=>x.sourceTrajectorySha256)]);
const prefix=uniq([...(base.identitySets.openingPrefixSha256||[]),...s1rows.map(x=>x.openingPrefixSha256),...s2rows.map(x=>x.openingPrefixSha256)]);
const identityCore={rootRawSha256:roots,sourceTrajectorySha256:traj,openingPrefixSha256:prefix};
const out={schemaVersion:1,studyId:"LGPML-STUDY1",stageId:"LGPML-S1-DEVELOPMENT-2026-09-03-v1",purpose:"UPSTREAM-IDENTITY-ONLY-EXCLUSION-FIREWALL",scientificOutcomeFieldsRetained:false,g303DiagnosticScientificFieldsRetained:false,g304ScientificOutcomeFieldsRetained:false,g305PartialScientificFieldsRetained:false,g306SelectionMismatchDiagnosticsRetained:false,g307ScientificOutcomeFieldsRetained:false,baseIdentitySource:{path:BASE_PATH,inputClass:"IDENTITY-ONLY"},g307Stage1IdentitySource:{path:S1_ID_PATH,inputClass:"IDENTITY-ONLY",identityRowCount:s1rows.length},g307Stage2IdentityMaterialization:{method:"deterministic frozen source-selection replay only; no geometry/search measurement",selectionCoreSha256:selection.selectionCoreSha256,expectedSelectionCoreSha256:"c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89",identityRowCount:s2rows.length,scientificMeasurementFunctionsCalled:false},identitySets:identityCore,identityCounts:{rootRawSha256:roots.length,sourceTrajectorySha256:traj.length,openingPrefixSha256:prefix.length},identityCoreSha256:sha(identityCore),freshLgpmlStage1SeedAccess:false,freshLgpmlStage2SeedAccess:false,protectedDepth10Access:false};
fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(out,null,2)+"\n");
console.log(`LGPML_FIREWALL_SUMMARY=${JSON.stringify({g307Stage1:s1rows.length,g307Stage2:s2rows.length,identityCounts:out.identityCounts,identityCoreSha256:out.identityCoreSha256,selectionCoreSha256:selection.selectionCoreSha256,freshLgpmlStage1SeedAccess:false,protectedDepth10Access:false})}`);
