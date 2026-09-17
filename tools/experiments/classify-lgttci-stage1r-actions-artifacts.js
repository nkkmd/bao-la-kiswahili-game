#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(process.cwd());
const SPEC=JSON.parse(fs.readFileSync(path.join(ROOT,"doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m);}function parse(){const a=process.argv.slice(2),o={};for(let i=0;i<a.length;i++)if(a[i].startsWith("--"))o[a[i].slice(2)]=a[i+1]&&!a[i+1].startsWith("--")?a[++i]:true;return o;}
function slots(){const out=[];for(const block of ["SFCDF","SILGM","GCLD"]){const r=SPEC.freshSeedSlots.primary[block];for(let s=r.seedStart;s<=r.seedEnd;s++)out.push({block,slot:s});}return out;}
function matrix(items){return {include:items.length?items:[{block:"NONE",slot:0}]};}
function groups(items){
  const defs=[
    ["sfcdf_a",40211001,40211192],["sfcdf_b",40211193,40211384],
    ["silgm_a",40212001,40212256],["silgm_b",40212257,40212512],["silgm_c",40212513,40212768],
    ["gcld_a",40213001,40213192],["gcld_b",40213193,40213384]
  ];
  const out={};
  for(const [name,lo,hi] of defs){const rows=items.filter(x=>x.slot>=lo&&x.slot<=hi);need(rows.length<=256,`${name} retry matrix exceeds 256`);out[name]=matrix(rows);}
  return out;
}
function main(){
  const a=parse(),mode=String(a.mode||""),namesFile=path.resolve(a.names||"");
  need(["primary","post-retry","final"].includes(mode),"bad mode");need(namesFile&&fs.existsSync(namesFile),"artifact names file missing");
  const names=fs.readFileSync(namesFile,"utf8").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const set=new Set(names);need(set.size===names.length,"duplicate artifact names returned by API");
  const expected=slots();
  const retry=[],reserve=[],deterministic=[],reserveFailures=[],unresolved=[];
  let sourceCount=0,primaryStartCount=0,reserveStartCount=0;
  for(const x of expected){
    const s=x.slot;
    const source=set.has(`lgttci-s1r-source-${s}`);
    const pstart=set.has(`lgttci-s1r-primary-start-${s}`);
    const pfail=set.has(`lgttci-s1r-primary-failure-${s}`);
    const rstart=set.has(`lgttci-s1r-reserve-start-${s}`);
    const rfail=set.has(`lgttci-s1r-reserve-failure-${s}`);
    if(source)sourceCount++; if(pstart)primaryStartCount++; if(rstart)reserveStartCount++;
    if(pfail)deterministic.push({...x,kind:"PRIMARY-DETERMINISTIC-FAILURE"});
    if(rfail)reserveFailures.push({...x,kind:"RESERVE-DETERMINISTIC-FAILURE"});
    if(source) continue;
    if(mode==="primary") {
      if(!pstart&&!pfail)retry.push(x);
      continue;
    }
    if(mode==="post-retry") {
      if(pfail){continue;}
      if(!pstart){unresolved.push({...x,kind:"PRIMARY-NOT-STARTED-AFTER-RETRY"});continue;}
      reserve.push(x);
      continue;
    }
    if(mode==="final") {
      if(pfail||rfail)continue;
      if(!pstart){unresolved.push({...x,kind:"PRIMARY-NOT-STARTED"});continue;}
      if(rstart){unresolved.push({...x,kind:"RESERVE-STARTED-WITHOUT-SOURCE"});continue;}
      unresolved.push({...x,kind:"PRIMARY-STARTED-WITHOUT-SOURCE-OR-RESERVE"});
    }
  }
  if(mode==="post-retry") need(reserve.length<=SPEC.freshSeedSlots.maxInfrastructureReplacementsTotal,"reserve candidate count exceeds frozen maximum");
  let fatal=deterministic.length>0||reserveFailures.length>0||unresolved.length>0;
  if(mode==="final" && sourceCount!==SPEC.freshSeedSlots.primaryCount) fatal=true;
  const summary={schemaVersion:1,stageId:SPEC.stageId,mode,sourceCount,primaryStartCount,reserveStartCount,retryCount:retry.length,reserveCount:reserve.length,deterministicFailureCount:deterministic.length,reserveFailureCount:reserveFailures.length,unresolvedCount:unresolved.length,fatal};
  if(a.summary)fs.writeFileSync(path.resolve(a.summary),JSON.stringify({...summary,deterministic,reserveFailures,unresolved},null,2)+"\n");
  const output=process.env.GITHUB_OUTPUT;
  if(output){
    fs.appendFileSync(output,`fatal=${fatal?"true":"false"}\n`);
    fs.appendFileSync(output,`ready=${mode==="final"&&!fatal?"true":"false"}\n`);
    fs.appendFileSync(output,`source_count=${sourceCount}\n`);
    fs.appendFileSync(output,`reserve_count=${reserve.length}\n`);
    if(mode==="primary")for(const [k,v] of Object.entries(groups(retry)))fs.appendFileSync(output,`retry_${k}=${JSON.stringify(v)}\n`);
    if(mode==="post-retry")fs.appendFileSync(output,`reserve_matrix=${JSON.stringify(matrix(reserve))}\n`);
  }
  process.stdout.write(JSON.stringify(summary)+"\n");
}
main();
