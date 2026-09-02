#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const crypto=require("node:crypto");

const SFCDF_FW="doc/structural-forcing-corridor-decision-funnel/prereg/UPSTREAM_IDENTITY_FIREWALL.json";
const SFCDF_S2_INPUT="doc/structural-forcing-corridor-decision-funnel/prereg/STAGE_2_FORMAL_INPUT.json";
const SFCDF_S2_RESULT="doc/structural-forcing-corridor-decision-funnel/results/stage-2/scientific-result.json";
const OUT="doc/branch-expansion-compression-transition/prereg/UPSTREAM_IDENTITY_FIREWALL.json";

function need(x,m){if(!x)throw new Error(m);}
function readText(p){return fs.readFileSync(p,"utf8");}
function gitBlobSha(text){const b=Buffer.from(text,"utf8");return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`)).update(b).digest("hex");}
function sha256(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sortedSet(xs){return[...new Set(xs)].sort();}

const fwText=readText(SFCDF_FW),s2InputText=readText(SFCDF_S2_INPUT),s2ResultText=readText(SFCDF_S2_RESULT);
const fw=JSON.parse(fwText),s2in=JSON.parse(s2InputText),s2=JSON.parse(s2ResultText);
need(fw.scientificOutcomeFieldsRetained===false,"upstream SFCDF firewall is not identity-only");
need(s2in.stage1IdentitySets&&s2in.discardedStage1ScientificOutcomes===true,"Stage 1 identity-only extraction boundary missing");
need(s2.sourceSelection&&s2.sourceSelection.production&&Array.isArray(s2.sourceSelection.production.pairs),"Stage 2 source identity records missing");

const roots=[...(fw.identitySets.rootRawSha256||[]),...(s2in.stage1IdentitySets.rootRawSha256||[])];
const trajectories=[...(fw.identitySets.sourceTrajectorySha256||[]),...(s2in.stage1IdentitySets.sourceTrajectorySha256||[])];
const prefixes=[...(fw.identitySets.openingPrefixSha256||[]),...(s2in.stage1IdentitySets.openingPrefixSha256||[])];

let stage2Pairs=0;
for(const pair of s2.sourceSelection.production.pairs){
  stage2Pairs++;
  for(const src of [pair.namua,pair.mtaji]){
    need(src&&src.rootRawSha256&&src.sourceTrajectorySha256&&src.openingPrefixSha256,"Stage 2 source identity incomplete");
    roots.push(src.rootRawSha256);
    trajectories.push(src.sourceTrajectorySha256);
    prefixes.push(src.openingPrefixSha256);
  }
}

const identitySets={
  rootRawSha256:sortedSet(roots),
  sourceTrajectorySha256:sortedSet(trajectories),
  openingPrefixSha256:sortedSet(prefixes)
};
const identityCoreSha256=sha256(canon(identitySets));
const out={
  schemaVersion:1,
  studyId:"BECT-STUDY1",
  purpose:"UPSTREAM-IDENTITY-ONLY-EXCLUSION-FIREWALL",
  scientificOutcomeFieldsRetained:false,
  g303DiagnosticScientificFieldsRetained:false,
  g304ScientificOutcomeFieldsRetained:false,
  sourceBindings:[
    {path:SFCDF_FW,gitBlobSha:gitBlobSha(fwText),inputClass:"IDENTITY-ONLY"},
    {path:SFCDF_S2_INPUT,gitBlobSha:gitBlobSha(s2InputText),inputClass:"READ-ONLY-STAGE1-IDENTITY-SETS-ONLY",retainedScientificFields:[]},
    {path:SFCDF_S2_RESULT,gitBlobSha:gitBlobSha(s2ResultText),inputClass:"READ-ONLY-STAGE2-SOURCE-IDENTITIES-ONLY",retainedScientificFields:[]}
  ],
  g304Stage1IdentityCounts:{
    rootRawSha256:(s2in.stage1IdentitySets.rootRawSha256||[]).length,
    sourceTrajectorySha256:(s2in.stage1IdentitySets.sourceTrajectorySha256||[]).length,
    openingPrefixSha256:(s2in.stage1IdentitySets.openingPrefixSha256||[]).length
  },
  g304Stage2PairCount:stage2Pairs,
  identitySets,
  identityCounts:{
    rootRawSha256:identitySets.rootRawSha256.length,
    sourceTrajectorySha256:identitySets.sourceTrajectorySha256.length,
    openingPrefixSha256:identitySets.openingPrefixSha256.length
  },
  identityCoreSha256,
  freshBectStage1SeedAccess:false,
  freshBectStage2SeedAccess:false,
  protectedDepth10Access:false
};

fs.mkdirSync(require("node:path").dirname(OUT),{recursive:true});
fs.writeFileSync(OUT,JSON.stringify(out,null,2)+"\n");
console.log(`BECT_IDENTITY_FIREWALL=${JSON.stringify({identityCounts:out.identityCounts,identityCoreSha256})}`);
