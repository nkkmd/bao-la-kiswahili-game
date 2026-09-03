#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const P = require("./lib/silgm-stage1-production.js");
const I = require("./lib/silgm-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json");
const FW_PATH = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const BASE_FW_PATH = path.join(ROOT, "doc/bao-rule-mechanism-geometry-intervention/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const BRMGI_RESULT_PATH = path.join(ROOT, "doc/bao-rule-mechanism-geometry-intervention/results/stage-1/scientific-result.json");
const AUTH_PATH = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/search-instability-local-geometry-mechanism/stage1-development-v1");

function need(x,m){if(!x)throw new Error(m);}
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`);}
function shaText(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function canonical(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(canonical).join(",")}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;}
function digest(v){return shaText(canonical(v));}
function maxRss(){return process.resourceUsage().maxRSS*1024;}
function elapsedMs(start){return Number(process.hrtime.bigint()-start)/1e6;}
function parseArgs(){const a=process.argv.slice(2),out={output:DEFAULT_OUT,unarmedSmoke:false};for(let i=0;i<a.length;i++){if(a[i]==="--output")out.output=path.resolve(a[++i]);else if(a[i]==="--unarmed-smoke")out.unarmedSmoke=true;else throw new Error(`unknown arg ${a[i]}`);}return out;}
function authCheck(spec){
  need(fs.existsSync(AUTH_PATH),"Stage 1 authorization artifact absent; fresh seed access prohibited");
  const a=read(AUTH_PATH);need(a.studyId==="SILGM-STUDY1"&&a.stageId===spec.stageId,"Stage1 authorization identity mismatch");need(a.authorizationDecision==="STAGE1-AUTHORIZED","Stage1 not authorized");need(a.maxAuthorizedScientificExecutions===1,"Stage1 execution count contract mismatch");need(a.seedStart===spec.seedStart&&a.seedEnd===spec.seedEnd,"Stage1 seed authorization mismatch");need(a.protectedDepth10AccessAuthorized===false,"protected evidence authorization invalid");return a;
}
function publicMeasurements(rows){return rows.map(x=>x.row);}
function publicSelection(sel){return sel.selectionCore;}
function coreEqual(a,b){return canonical(a)===canonical(b);}
function statusResult(base,disposition,extra={}){return{schemaVersion:1,studyId:"SILGM-STUDY1",stageId:"SILGM-S1-DEVELOPMENT-2026-09-03-v1",evidenceClass:"FRESH-DEVELOPMENT",...base,stageDisposition:disposition,...extra};}
function main(){
  const args=parseArgs();
  if(args.unarmedSmoke){need(!fs.existsSync(AUTH_PATH),"unarmed smoke requires authorization artifact to be absent");console.log(JSON.stringify({studyId:"SILGM-STUDY1",stageId:"SILGM-S1-DEVELOPMENT-2026-09-03-v1",unarmedFailClosed:true,freshScientificSeedAccess:false,protectedDepth10Access:false}));return;}
  const spec=read(SPEC_PATH),fw=read(FW_PATH),baseFw=read(BASE_FW_PATH),brmgi=read(BRMGI_RESULT_PATH),auth=authCheck(spec);
  const out=args.output;fs.mkdirSync(out,{recursive:true});const started=process.hrtime.bigint();let seedAccess=false,noRescue=false,result=null,telemetry={};
  const base={authorizedScientificExecutions:1,actualScientificExecutions:1,authorizationNonce:auth.authorizationNonce,seedBlock:`${spec.seedStart}..${spec.seedEnd}`,seedBlockConsumed:false,noRescueBoundaryCrossed:false,freshScientificSeedAccess:false,protectedDepth10Access:false,formalPromotedCandidateSet:[],stage2AuthorizedByThisResult:false};
  try{
    seedAccess=true;noRescue=true;base.seedBlockConsumed=true;base.noRescueBoundaryCrossed=true;base.freshScientificSeedAccess=true;
    const pSel=P.selectPopulation(spec,baseFw,fw,brmgi),iSel=I.selectPopulation(spec,baseFw,fw,brmgi);
    const selectionExact=coreEqual(publicSelection(pSel),publicSelection(iSel));
    const selection={productionSha256:pSel.selectionCoreSha256,independentSha256:iSel.selectionCoreSha256,exact:selectionExact,core:publicSelection(pSel)};
    if(!selectionExact){result=statusResult(base,"STAGE1-TECHNICAL-INVALID",{technicalError:"production/independent population selection mismatch",selection});}
    else if(!pSel.selectionCore.populationComplete){result=statusResult(base,"STAGE1-NON-ESTIMABLE",{nonEstimableReason:"frozen Stage1 24+24 population incomplete within seed block",selection});}
    else{
      const pRows=[],iRows=[],unitTimings=[];let measurementFailure=null,nonEstimable=null;
      for(let idx=0;idx<pSel.selected.length;idx++){
        const unitStart=process.hrtime.bigint();
        try{
          const pm=P.measureSelected(pSel.selected[idx],spec),im=I.measureSelected(iSel.selected[idx],spec);const exact=coreEqual(pm.row,im.row);
          if(!exact){measurementFailure={index:idx,source:pSel.selectionCore.selected[idx],reason:"production/independent selected-root measurement mismatch",productionRowSha256:pm.rowSha256,independentRowSha256:im.rowSha256};break;}
          if(pm.row.allSearchEstimable!==true||im.row.allSearchEstimable!==true){nonEstimable={index:idx,source:pSel.selectionCore.selected[idx],reason:"one or more frozen search conditions non-estimable"};break;}
          pRows.push(pm);iRows.push(im);
        }catch(e){measurementFailure={index:idx,source:pSel.selectionCore.selected[idx],reason:e.message,errorName:e.name};break;}
        const ms=elapsedMs(unitStart);unitTimings.push({index:idx,sourceSeed:pSel.selected[idx].seed,phase:pSel.selected[idx].phase,selectedPly:pSel.selected[idx].selectedPly,elapsedMs:ms});
        if(ms>spec.resourceCeilings.perSelectedRootCombinedElapsedMs){nonEstimable={index:idx,source:pSel.selectionCore.selected[idx],reason:"per-selected-root combined elapsed ceiling exceeded",elapsedMs:ms,ceilingMs:spec.resourceCeilings.perSelectedRootCombinedElapsedMs};break;}
        if(elapsedMs(started)>spec.resourceCeilings.stageElapsedMs){nonEstimable={index:idx,reason:"stage elapsed ceiling exceeded",elapsedMs:elapsedMs(started),ceilingMs:spec.resourceCeilings.stageElapsedMs};break;}
        if(maxRss()>spec.resourceCeilings.stagePeakRssBytes){nonEstimable={index:idx,reason:"stage RSS ceiling exceeded",peakRssBytes:maxRss(),ceilingBytes:spec.resourceCeilings.stagePeakRssBytes};break;}
      }
      if(measurementFailure)result=statusResult(base,"STAGE1-TECHNICAL-INVALID",{technicalError:measurementFailure.reason,selection,measurementFailure,unitTimings,measuredRootCount:pRows.length});
      else if(nonEstimable)result=statusResult(base,"STAGE1-NON-ESTIMABLE",{nonEstimableReason:nonEstimable.reason,selection,nonEstimable,unitTimings,measuredRootCount:pRows.length});
      else{
        const pCore=publicMeasurements(pRows),iCore=publicMeasurements(iRows),measurementExact=coreEqual(pCore,iCore);need(measurementExact,"post-loop measurement core mismatch");
        const pDev=P.summarizeDevelopment(pCore,spec),iDev=I.summarizeDevelopment(iCore,spec),developmentExact=coreEqual(pDev,iDev);
        if(!developmentExact)result=statusResult(base,"STAGE1-TECHNICAL-INVALID",{technicalError:"production/independent development summary mismatch",selection,measurementCoreSha256:digest(pCore),productionDevelopmentSha256:digest(pDev),independentDevelopmentSha256:digest(iDev),unitTimings});
        else{
          const scientificCore={selection:selection.core,measurements:pCore,development:pDev};
          result=statusResult(base,"STAGE1-PASS",{selection:{...selection,core:selection.core},measurementCoreSha256:digest(pCore),developmentCoreSha256:pDev.developmentCoreSha256,scientificCoreSha256:digest(scientificCore),measurements:pCore,development:pDev,formalPromotedCandidateSet:pDev.promotedCandidates,unitTimings,stage2AuthorizedByThisResult:false});
        }
      }
    }
  }catch(e){result=statusResult({...base,seedBlockConsumed:seedAccess,noRescueBoundaryCrossed:noRescue,freshScientificSeedAccess:seedAccess},seedAccess?"STAGE1-TECHNICAL-INVALID":"PRECOMPUTATION-TECHNICAL-INVALID",{technicalError:{name:e.name,message:e.message,stack:e.stack}});}
  const elapsed=elapsedMs(started),rss=maxRss();telemetry={studyId:"SILGM-STUDY1",stageId:spec.stageId,elapsedMs:elapsed,peakRssBytes:rss,freshScientificSeedAccess:seedAccess,protectedDepth10Access:false,scientificDigestExcluded:true};
  const resultText=`${JSON.stringify(result,null,2)}\n`;telemetry.resultArtifactBytes=Buffer.byteLength(resultText);
  if(result.stageDisposition==="STAGE1-PASS"&&(elapsed>spec.resourceCeilings.stageElapsedMs||rss>spec.resourceCeilings.stagePeakRssBytes||telemetry.resultArtifactBytes>spec.resourceCeilings.stageResultArtifactBytes)){
    result=statusResult({...base,seedBlockConsumed:true,noRescueBoundaryCrossed:true,freshScientificSeedAccess:true},"STAGE1-NON-ESTIMABLE",{nonEstimableReason:"frozen stage-level resource/artifact ceiling exceeded after complete measurement",resourceObserved:telemetry,formalPromotedCandidateSet:[]});
  }
  write(path.join(out,"scientific-result.json"),result);write(path.join(out,"telemetry.json"),telemetry);write(path.join(out,"execution-summary.json"),{studyId:"SILGM-STUDY1",stageId:spec.stageId,authorizationNonce:auth.authorizationNonce,authorizedScientificExecutions:1,actualScientificExecutions:1,stageDisposition:result.stageDisposition,seedBlockConsumed:seedAccess,protectedDepth10Access:false});
  console.log(`SILGM_STAGE1=${JSON.stringify({stageDisposition:result.stageDisposition,seedBlockConsumed:seedAccess,selectedCounts:result.selection&&result.selection.core?result.selection.core.selectedCounts:null,promotedCount:Array.isArray(result.formalPromotedCandidateSet)?result.formalPromotedCandidateSet.length:0,elapsedMs:elapsed,peakRssBytes:rss})}`);
  if(result.stageDisposition!=="STAGE1-PASS")process.exitCode=2;
}
main();
