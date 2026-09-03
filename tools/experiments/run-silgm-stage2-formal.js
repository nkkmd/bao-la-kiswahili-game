#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const P=require("./lib/silgm-stage2-production.js");
const I=require("./lib/silgm-stage2-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const S2_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_2_FORMAL_SPEC.json");
const S1_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json");
const INPUT_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_2_FORMAL_INPUT.json");
const STAGE1_ID_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");
const BASE_FW_PATH=path.join(ROOT,"doc/bao-rule-mechanism-geometry-intervention/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const SILGM_FW_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const BRMGI_PATH=path.join(ROOT,"doc/bao-rule-mechanism-geometry-intervention/results/stage-1/scientific-result.json");
const AUTH_PATH=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/authorizations/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_OUT=path.join(ROOT,"artifacts/local/search-instability-local-geometry-mechanism/stage2-formal-v1");

function need(v,m){if(!v)throw new Error(m);}
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`);}
function canonical(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(canonical).join(",")}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;}
function digest(v){return crypto.createHash("sha256").update(canonical(v),"utf8").digest("hex");}
function elapsedMs(t){return Number(process.hrtime.bigint()-t)/1e6;}
function maxRss(){return process.resourceUsage().maxRSS*1024;}
function parseArgs(){const a=process.argv.slice(2),o={output:DEFAULT_OUT,unarmedSmoke:false};for(let i=0;i<a.length;i++){if(a[i]==="--output")o.output=path.resolve(a[++i]);else if(a[i]==="--unarmed-smoke")o.unarmedSmoke=true;else throw new Error(`unknown arg ${a[i]}`);}return o;}
function authCheck(s2,input){need(fs.existsSync(AUTH_PATH),"Stage2 authorization artifact absent; fresh seed access prohibited");const a=read(AUTH_PATH);need(a.studyId==="SILGM-STUDY1"&&a.stageId===s2.stageId,"Stage2 authorization identity mismatch");need(a.authorizationDecision==="STAGE2-AUTHORIZED","Stage2 not authorized");need(a.maxAuthorizedScientificExecutions===1,"Stage2 execution count contract mismatch");need(a.seedStart===s2.seedStart&&a.seedEnd===s2.seedEnd,"Stage2 seed authorization mismatch");need(a.formalInputCoreSha256===input.sourceMaterialization.formalInputCoreSha256,"Stage2 formal input authorization mismatch");need(a.protectedDepth10AccessAuthorized===false,"protected evidence authorization invalid");return a;}
function status(base,disposition,extra={}){return{schemaVersion:1,studyId:"SILGM-STUDY1",stageId:"SILGM-S2-FORMAL-2026-09-03-v1",evidenceClass:"FRESH-FORMAL",...base,stageDisposition:disposition,...extra};}
function main(){
  const args=parseArgs();if(args.unarmedSmoke){need(!fs.existsSync(AUTH_PATH),"unarmed smoke requires Stage2 authorization absent");console.log(JSON.stringify({studyId:"SILGM-STUDY1",stageId:"SILGM-S2-FORMAL-2026-09-03-v1",unarmedFailClosed:true,stage2FreshSeedAccess:false,protectedDepth10Access:false}));return;}
  const s2=read(S2_PATH),s1=read(S1_PATH),input=read(INPUT_PATH),stage1Id=read(STAGE1_ID_PATH),baseFw=read(BASE_FW_PATH),silgmFw=read(SILGM_FW_PATH),brmgi=read(BRMGI_PATH),auth=authCheck(s2,input);
  need(input.promotedCandidateCount===8&&input.stage2FreshSeedAccess===false&&input.protectedDepth10Access===false,"formal input boundary invalid");need(stage1Id.identityRowCount===48&&stage1Id.scientificOutcomeFieldsRetained===false,"Stage1 identity exclusion invalid");
  const out=args.output;fs.mkdirSync(out,{recursive:true});const started=process.hrtime.bigint();let seedAccess=false,result=null;
  const base={authorizedScientificExecutions:1,actualScientificExecutions:1,authorizationNonce:auth.authorizationNonce,seedBlock:`${s2.seedStart}..${s2.seedEnd}`,seedBlockConsumed:false,stage2NoRescueBoundaryCrossed:false,stage2FreshScientificSeedAccess:false,protectedDepth10Access:false,stage1PromotedCandidateCount:8};
  try{
    seedAccess=true;base.seedBlockConsumed=true;base.stage2NoRescueBoundaryCrossed=true;base.stage2FreshScientificSeedAccess=true;
    const ps=P.selectPopulation(s2,s1,baseFw,silgmFw,brmgi,stage1Id),is=I.selectPopulation(s2,s1,baseFw,silgmFw,brmgi,stage1Id);const selectionExact=canonical(ps.selectionCore)===canonical(is.selectionCore);const selection={productionSha256:ps.selectionCoreSha256,independentSha256:is.selectionCoreSha256,exact:selectionExact,core:ps.selectionCore};
    if(!selectionExact)result=status(base,"STAGE2-TECHNICAL-INVALID",{technicalError:"production/independent population selection mismatch",selection});
    else if(!ps.selectionCore.populationComplete)result=status(base,"STAGE2-NON-ESTIMABLE",{nonEstimableReason:"frozen Stage2 36+36 population incomplete within seed block",selection});
    else{
      const pRows=[],iRows=[],unitTimings=[];let technicalFailure=null,nonEstimable=null;
      for(let idx=0;idx<ps.selected.length;idx++){
        const t=process.hrtime.bigint();try{const pm=P.measureSelected(ps.selected[idx],s2,s1),im=I.measureSelected(is.selected[idx],s2,s1);if(canonical(pm.row)!==canonical(im.row)){technicalFailure={index:idx,source:ps.selectionCore.selected[idx],reason:"production/independent selected-root measurement mismatch",productionRowSha256:pm.rowSha256,independentRowSha256:im.rowSha256};break;}if(pm.row.allSearchEstimable!==true||im.row.allSearchEstimable!==true){nonEstimable={index:idx,source:ps.selectionCore.selected[idx],reason:"one or more frozen search conditions non-estimable"};break;}pRows.push(pm.row);iRows.push(im.row);}catch(e){technicalFailure={index:idx,source:ps.selectionCore.selected[idx],reason:e.message,errorName:e.name};break;}
        const ms=elapsedMs(t);unitTimings.push({index:idx,sourceSeed:ps.selected[idx].seed,phase:ps.selected[idx].phase,selectedPly:ps.selected[idx].selectedPly,elapsedMs:ms});if(ms>s2.resourceCeilings.perSelectedRootCombinedElapsedMs){nonEstimable={index:idx,reason:"per-selected-root combined elapsed ceiling exceeded",elapsedMs:ms,ceilingMs:s2.resourceCeilings.perSelectedRootCombinedElapsedMs};break;}if(elapsedMs(started)>s2.resourceCeilings.stageElapsedMs){nonEstimable={index:idx,reason:"stage elapsed ceiling exceeded",elapsedMs:elapsedMs(started),ceilingMs:s2.resourceCeilings.stageElapsedMs};break;}if(maxRss()>s2.resourceCeilings.stagePeakRssBytes){nonEstimable={index:idx,reason:"stage RSS ceiling exceeded",peakRssBytes:maxRss(),ceilingBytes:s2.resourceCeilings.stagePeakRssBytes};break;}
      }
      if(technicalFailure)result=status(base,"STAGE2-TECHNICAL-INVALID",{technicalError:technicalFailure.reason,selection,technicalFailure,unitTimings,measuredRootCount:pRows.length});
      else if(nonEstimable)result=status(base,"STAGE2-NON-ESTIMABLE",{nonEstimableReason:nonEstimable.reason,selection,nonEstimable,unitTimings,measuredRootCount:pRows.length});
      else{
        need(canonical(pRows)===canonical(iRows),"post-loop measurement core mismatch");const pf=P.formalEvaluate(pRows,input),inf=I.formalEvaluate(iRows,input);if(canonical(pf)!==canonical(inf))result=status(base,"STAGE2-TECHNICAL-INVALID",{technicalError:"production/independent formal evaluation mismatch",selection,measurementCoreSha256:digest(pRows),productionFormalSha256:digest(pf),independentFormalSha256:digest(inf),unitTimings});
        else{const scientificCore={selection:selection.core,measurements:pRows,formal:pf};result=status(base,"STAGE2-PASS",{selection,measurementCoreSha256:digest(pRows),formalCoreSha256:pf.formalCoreSha256,scientificCoreSha256:digest(scientificCore),measurements:pRows,formal:pf,unitTimings,studyClosurePendingDocumentation:true});}
      }
    }
  }catch(e){result=status({...base,seedBlockConsumed:seedAccess,stage2NoRescueBoundaryCrossed:seedAccess,stage2FreshScientificSeedAccess:seedAccess},seedAccess?"STAGE2-TECHNICAL-INVALID":"PRECOMPUTATION-TECHNICAL-INVALID",{technicalError:{name:e.name,message:e.message,stack:e.stack}});}
  const telemetry={studyId:"SILGM-STUDY1",stageId:s2.stageId,elapsedMs:elapsedMs(started),peakRssBytes:maxRss(),stage2FreshScientificSeedAccess:seedAccess,protectedDepth10Access:false,scientificDigestExcluded:true};let text=`${JSON.stringify(result,null,2)}\n`;telemetry.resultArtifactBytes=Buffer.byteLength(text);
  if(result.stageDisposition==="STAGE2-PASS"&&(telemetry.elapsedMs>s2.resourceCeilings.stageElapsedMs||telemetry.peakRssBytes>s2.resourceCeilings.stagePeakRssBytes||telemetry.resultArtifactBytes>s2.resourceCeilings.stageResultArtifactBytes)){result=status({...base,seedBlockConsumed:true,stage2NoRescueBoundaryCrossed:true,stage2FreshScientificSeedAccess:true},"STAGE2-NON-ESTIMABLE",{nonEstimableReason:"frozen Stage2 stage-level resource/artifact ceiling exceeded after complete computation",resourceObserved:telemetry,formalCandidateResultsRetained:false});text=`${JSON.stringify(result,null,2)}\n`;}
  write(path.join(out,"scientific-result.json"),result);write(path.join(out,"telemetry.json"),telemetry);write(path.join(out,"execution-summary.json"),{studyId:"SILGM-STUDY1",stageId:s2.stageId,authorizationNonce:auth.authorizationNonce,authorizedScientificExecutions:1,actualScientificExecutions:1,stageDisposition:result.stageDisposition,seedBlockConsumed:seedAccess,stage2NoRescueBoundaryCrossed:seedAccess,protectedDepth10Access:false});
  console.log(`SILGM_STAGE2=${JSON.stringify({stageDisposition:result.stageDisposition,seedBlockConsumed:seedAccess,selectedCounts:result.selection&&result.selection.core?result.selection.core.selectedCounts:null,estimableCandidateCount:result.formal?result.formal.estimableCandidateCount:null,confirmedCandidateCount:result.formal?result.formal.confirmedCandidateCount:null,nonEstimableCandidateCount:result.formal?result.formal.nonEstimableCandidateCount:null,elapsedMs:telemetry.elapsedMs,peakRssBytes:telemetry.peakRssBytes})}`);if(result.stageDisposition!=="STAGE2-PASS")process.exitCode=2;
}
main();
