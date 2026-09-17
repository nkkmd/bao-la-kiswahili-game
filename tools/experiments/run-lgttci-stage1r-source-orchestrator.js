#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const ROOT = path.resolve(__dirname, "../..");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json"), "utf8"));
const AUTH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1R_EXECUTION_AUTHORIZATION.json");
function need(x,m){if(!x)throw new Error(m);} 
function parse(){const a=process.argv.slice(2),o={};for(let i=0;i<a.length;i++)if(a[i].startsWith("--"))o[a[i].slice(2)]=a[i+1]&&!a[i+1].startsWith("--")?a[++i]:true;return o;}
function appendDurable(file,obj){fs.mkdirSync(path.dirname(file),{recursive:true});const fd=fs.openSync(file,"a");try{fs.writeSync(fd,`${JSON.stringify(obj)}\n`);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function readLedger(file){const rows=fs.existsSync(file)?fs.readFileSync(file,"utf8").split(/\n/).filter(Boolean).map(JSON.parse):[];const map=new Map();for(const r of rows){if(!map.has(r.slotSeed))map.set(r.slotSeed,[]);map.get(r.slotSeed).push(r);}return {rows,map};}
function main(){
  const a=parse(),block=String(a.block||""),artifactRoot=path.resolve(a["artifact-root"]||"");
  need(["SFCDF","SILGM","GCLD"].includes(block),"invalid block"); need(artifactRoot,"artifact-root required");
  need(fs.existsSync(AUTH),"final execution authorization absent"); const auth=JSON.parse(fs.readFileSync(AUTH,"utf8")); need(auth.decision==="LGTTCI-STAGE1R-EXECUTION-AUTHORIZED","not authorized");
  const range=SPEC.freshSeedSlots.primary[block],ledger=path.join(artifactRoot,"ledger",`${block}.jsonl`),sourceDir=path.join(artifactRoot,"source",block); fs.mkdirSync(sourceDir,{recursive:true});
  let replacements=0;
  for(let slot=range.seedStart;slot<=range.seedEnd;slot++){
    const history=readLedger(ledger).map.get(slot)||[]; if(history.some(x=>x.event==="SOURCE-COMMIT")) continue;
    const hadStart=history.some(x=>x.event==="SOURCE-START"),hadReserveStart=history.some(x=>x.event==="RESERVE-START");
    let effective=slot,role="PRIMARY";
    if(hadStart){need(!hadReserveStart,"paired reserve was already started without commit; reserve-of-reserve forbidden");effective=slot+1000000;role="PAIRED-RESERVE";replacements+=1;need(replacements<=SPEC.freshSeedSlots.maxInfrastructureReplacementsTotal,"replacement limit exceeded");}
    appendDurable(ledger,{event:role==="PRIMARY"?"SOURCE-START":"RESERVE-START",block,slotSeed:slot,effectiveSeed:effective,at:new Date().toISOString()});
    const out=path.join(sourceDir,`${slot}.json`);
    const r=spawnSync(process.execPath,[path.join(__dirname,"run-lgttci-stage1r-source-unit.js"),"--block",block,"--slot-seed",String(slot),"--effective-seed",String(effective),"--output",out],{encoding:"utf8"});
    if(r.stdout)process.stdout.write(r.stdout); if(r.stderr)process.stderr.write(r.stderr);
    if(r.status!==0){appendDurable(ledger,{event:"SOURCE-PROCESS-FAILED",block,slotSeed:slot,effectiveSeed:effective,status:r.status,at:new Date().toISOString()});process.exit(r.status||1);}
    appendDurable(ledger,{event:"SOURCE-COMMIT",block,slotSeed:slot,effectiveSeed:effective,role,artifact:path.relative(artifactRoot,out),at:new Date().toISOString()});
  }
  process.stdout.write(`${JSON.stringify({event:"BLOCK-SOURCE-COMPLETE",block,range,replacements})}\n`);
}
main();
