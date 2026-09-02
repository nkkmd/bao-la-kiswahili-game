#!/usr/bin/env node
"use strict";
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../..');
const DOC=path.join(ROOT,'doc/transposition-concentration-tree-graph-divergence');
const sources=[
  'doc/local-game-tree-geometry-measurement-foundation/results/STAGE_1_DEVELOPMENT_RESULT.json',
  'doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-1/scientific-result.json',
  'doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-2/scientific-result.json'
];
function blob(text){const b=Buffer.from(text,'utf8');return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`,'utf8')).update(b).digest('hex')}
function stable(v){if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'}
const rows=new Map();
function walk(v){if(!v||typeof v!=='object')return;const r={};for(const k of ['rootRawSha256','sourceTrajectorySha256','openingPrefixSha256','openingPrefixLength'])if(Object.prototype.hasOwnProperty.call(v,k))r[k]=v[k];if(Object.keys(r).some(k=>k!=='openingPrefixLength'))rows.set(stable(r),r);if(Array.isArray(v))for(const x of v)walk(x);else for(const x of Object.values(v))walk(x)}
const sourceBindings=[];
for(const rel of sources){const text=fs.readFileSync(path.join(ROOT,rel),'utf8');sourceBindings.push({path:rel,gitBlobSha:blob(text)});walk(JSON.parse(text));}
const identityRecords=[...rows.values()].sort((a,b)=>stable(a).localeCompare(stable(b)));
const manifest={schemaVersion:1,studyId:'TCTGD-STUDY1',purpose:'UPSTREAM-IDENTITY-ONLY-FIREWALL',scientificOutcomeFieldsRetained:false,g302ScientificOutcomeLoaded:false,g302SelectedRootsReconstructed:false,sourceBindings,identityRecordCount:identityRecords.length,identityRecords};
const manifestText=JSON.stringify(manifest,null,2)+'\n';
const manifestPath=path.join(DOC,'prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json');fs.writeFileSync(manifestPath,manifestText);
const oldSpecPath=path.join(DOC,'prereg/STUDY_1_SPEC.json');const spec=JSON.parse(fs.readFileSync(oldSpecPath,'utf8'));
spec.schemaVersion=2;
spec.technicalExecutionRevision={revision:2,reason:'branch-only workflow_dispatch returned HTTP 404 in non-scientific tooling smoke; corrected before any G3-03 fresh evidence',scientificContractChanged:false,unchanged:['Study ID','titles','RAW identity','move identity','relative depth 5','eligible measurement families','candidate endpoints','Stage 1/2 populations','seed blocks','promotion gates','formal tests','decision taxonomy','no-rescue boundary','protected depth-10 boundary'],supersedesTechnicalExecutionOnly:'prereg/STUDY_1_SPEC.json'};
spec.firewall.identityOnlyManifest={path:'doc/transposition-concentration-tree-graph-divergence/prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json',gitBlobSha:blob(manifestText),scientificOutcomeFieldsRetained:false,g302ScientificOutcomeLoaded:false};
spec.executionIntegrity.scientificWorkflowTrigger='single path-filtered push on STAGE1_EXECUTION_TRIGGER only; workflow-definition path is excluded from trigger';
spec.executionIntegrity.workflowDispatchBranchOnlyCapability='NON-SCIENTIFIC-SMOKE-FAILED-HTTP-404';
spec.executionIntegrity.pushPathControlSmoke={runId:33592075136,conclusion:'success',triggerRunCount:1,artifactId:9832086009,artifactZipSha256:'995b566a2c73f8972052315a8b5edc34b15c33602836a028399e3b47f916303a',freshScientificEvidence:false,stage1SeedAccess:false,protectedDepth10Access:false};
fs.writeFileSync(path.join(DOC,'prereg/STUDY_1_SPEC_V2.json'),JSON.stringify(spec,null,2)+'\n');
console.log(JSON.stringify({identityRecordCount:identityRecords.length,manifestGitBlobSha:blob(manifestText),technicalSpecRevision:2,freshScientificEvidence:false,protectedDepth10Access:false}));
