"use strict";

const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const P=require("./lib/lgtggc-stage1-production.js");
const DIR=process.argv[2]||"artifacts/local/lgtggc-stage1";
const OUT=process.argv[3]||path.join(DIR,"stage1-result.json");
function read(name){return JSON.parse(fs.readFileSync(path.join(DIR,name),"utf8"));}
function fileSha(name){return crypto.createHash("sha256").update(fs.readFileSync(path.join(DIR,name))).digest("hex");}
function uniq(xs){return [...new Set(xs)].sort();}
const s=read("sfcdf.json"),l=read("silgm.json"),g=read("gcld.json");
for(const r of[s,l,g]){if(r.studyId!=="LGTGGC-STUDY1"||r.stageId!==P.STAGE_ID)throw new Error("module identity mismatch");if(r.formalInferencePerformed!==false||r.pValuesComputed!==false)throw new Error("development inference firewall violated");if(r.stage2SeedAccess!==false||r.protectedDepth10Access!==false||r.depth11Access!==false||r.g2_12EstimatorScientificInput!==false)throw new Error("protected evidence firewall violated");}
const ds=[s.stageDisposition,l.stageDisposition,g.stageDisposition];
let stageDisposition=ds.some(x=>x==="STAGE1-TECHNICAL-INVALID")?"STAGE1-TECHNICAL-INVALID":ds.some(x=>x==="STAGE1-NON-ESTIMABLE")?"STAGE1-NON-ESTIMABLE":"STAGE1-PASS";
const identities=[...(s.identityManifest||[]),...(l.identityManifest||[]),...(g.identityManifest||[])];
const trajectories=uniq(identities.map(x=>x.trajectorySha256).filter(Boolean));
const prefixes=uniq(identities.map(x=>x.openingPrefixSha256).filter(Boolean));
const roots=[];for(const x of identities){for(const k of["namuaRaw","mtajiRaw","rootRawSha256"])if(x[k])roots.push(x[k]);for(const r of(x.checkpointRawSha256||[]))roots.push(r);}const rootIds=uniq(roots);
const identityFirewall={
  stage1SeedRanges:["32311001..32311384","32312001..32312768","32313001..32313384"],
  trajectorySha256:trajectories,
  openingPrefixSha256:prefixes,
  rawRootSha256:rootIds,
  scientificOutcomeFieldsRetained:false,
  effectSignsRetained:false,
  pValuesRetained:false
};
const modules={
  "SFCDF-TRANSFER":{disposition:s.stageDisposition,selectedPairs:s.selectedPairs||0,measurementCoreSha256:s.measurementCoreSha256||null,resultFileSha256:fileSha("sfcdf.json")},
  "SILGM-TRANSFER":{disposition:l.stageDisposition,selectedRoots:l.selectedRoots||0,measurementCoreSha256:l.measurementCoreSha256||null,resultFileSha256:fileSha("silgm.json")},
  "GCLD-TRANSFER":{disposition:g.stageDisposition,measuredTrajectories:g.measuredTrajectories||0,measurementCoreSha256:g.measurementCoreSha256||null,resultFileSha256:fileSha("gcld.json")}
};
const core={studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,evidenceClass:"FRESH-DEVELOPMENT",formalInferencePerformed:false,pValuesComputed:false,effectBasedPromotionPerformed:false,directionSelectionPerformed:false,modules,identityFirewall,stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,stageDisposition};
const result={schemaVersion:1,...core,developmentCoreSha256:P.digest(core)};
fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(result,null,2)+"\n","utf8");console.log("LGTGGC_STAGE1_FINAL="+JSON.stringify(result));
if(stageDisposition==="STAGE1-TECHNICAL-INVALID")process.exitCode=2;
