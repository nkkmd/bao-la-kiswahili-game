"use strict";

const fs=require("node:fs"),path=require("node:path");
const E=require("../../public/engine.js");
const P=require("./lib/lgtggc-stage1-production.js");
const I=require("./lib/lgtggc-stage1-independent.js");
const SP=require("./lib/sfcdf-production.js");
const SI=require("./lib/sfcdf-independent.js");
const OUT=process.argv[2]||"artifacts/local/lgtggc-stage1/sfcdf.json";
const START=32311001,END=32311384,TARGET=10;
const C1="SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",C6="SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
function stable(x){return P.stable(x);}function need(x,m){if(!x)throw new Error(m);}function eq(a,b,m){need(stable(a)===stable(b),m);}
function candidateCore(c,lib){if(!c.eligible)return{seed:c.seed,policyId:c.policyId,familyId:c.familyId,eligible:false,reason:c.reason,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256};return{eligible:true,...lib.identitySfcdf(c)};}
function write(result){fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(result,null,2)+"\n","utf8");console.log("LGTGGC_STAGE1_SFCDF="+JSON.stringify(result));}
try{
  const pc=[],ic=[];for(let seed=START;seed<=END;seed++){pc.push(P.sfcdfCandidate(E,seed));ic.push(I.sfcdfCandidate(E,seed));}
  eq(pc.map(c=>candidateCore(c,P)),ic.map(c=>candidateCore(c,I)),"SFCDF source/candidate reconstruction mismatch");
  const ps=P.selectSfcdf(pc,TARGET),is=I.selectSfcdf(ic,TARGET);
  eq({support:ps.support,ids:ps.selected.map(P.identitySfcdf),selectionCoreSha256:ps.selectionCoreSha256},{support:is.support,ids:is.selected.map(I.identitySfcdf),selectionCoreSha256:is.selectionCoreSha256},"SFCDF selection mismatch");
  const identityManifest=ps.selected.map(P.identitySfcdf);
  let disposition="STAGE1-PASS",definedRoots=0,measurementRows=[];
  if(!ps.complete)disposition="STAGE1-NON-ESTIMABLE";
  else{
    const imap=new Map(is.selected.map(c=>[c.seed,c]));
    for(const c of ps.selected){const d=imap.get(c.seed);need(d,"independent selected pair missing");for(const role of["namua","mtaji"]){const pm=SP.measureRoot(E,c[role]),im=SI.measureRoot(E,d[role]);const pe={c1:pm.sfcdf.endpoints[C1],c6:pm.sfcdf.endpoints[C6]},ie={c1:im.sfcdf.endpoints[C1],c6:im.sfcdf.endpoints[C6]};eq(pe,ie,`SFCDF endpoint mismatch seed ${c.seed} ${role}`);if(pe.c1.defined&&pe.c6.defined)definedRoots++;measurementRows.push({seed:c.seed,role,rootRawSha256:c[role].rootRawSha256,c1:pe.c1,c6:pe.c6});}}
    if(definedRoots!==TARGET*4*2)disposition="STAGE1-NON-ESTIMABLE";
  }
  const result={schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"SFCDF-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,scientificSeedsRead:END-START+1,formalInferencePerformed:false,pValuesComputed:false,effectDirectionSummarized:false,support:ps.support,selectedPairs:ps.selected.length,selectedRoots:ps.selected.length*2,definedRoots,selectionCoreSha256:ps.selectionCoreSha256,measurementCoreSha256:P.digest(measurementRows),identityManifest,productionIndependentExact:true,stageDisposition:disposition,stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false};write(result);
}catch(error){write({schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"SFCDF-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,formalInferencePerformed:false,pValuesComputed:false,stageDisposition:"STAGE1-TECHNICAL-INVALID",stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,fatalError:String(error&&error.stack||error)});process.exitCode=2;}
