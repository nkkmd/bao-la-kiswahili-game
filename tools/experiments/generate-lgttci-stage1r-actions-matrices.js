#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(process.cwd());
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT,"doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m);}
function quartetMatrix(block){
  const r=SPEC.freshSeedSlots.primary[block];
  need(r && r.count % 4 === 0, `${block} count not divisible by 4`);
  const include=[];
  for(let s=r.seedStart;s<=r.seedEnd;s+=4){include.push({block,s1:s,s2:s+1,s3:s+2,s4:s+3});}
  need(include.length*4===r.count, `${block} matrix count mismatch`);
  need(include.length<=256, `${block} matrix exceeds 256 jobs`);
  return {include};
}
function measurementMatrix(){
  const include=[];
  for(const p of ["P1","P2"])for(const f of ["RF1","RF2"])include.push({task:`SFCDF-${p}-${f}`});
  for(const p of ["P1","P2"])for(const f of ["RF1","RF2"])for(const ph of ["namua","mtaji"])for(const c of ["LOW-RANKABLE","HIGH"])include.push({task:`SILGM-${p}-${f}-${ph}-${c}`});
  for(const p of ["P1","P2"])include.push({task:`GCLD-${p}`});
  need(include.length===22,"measurement task count mismatch");
  return {include};
}
const matrices={
  sfcdf:quartetMatrix("SFCDF"),
  silgm:quartetMatrix("SILGM"),
  gcld:quartetMatrix("GCLD"),
  measurement:measurementMatrix()
};
const out=process.env.GITHUB_OUTPUT;
if(out){for(const [k,v] of Object.entries(matrices))fs.appendFileSync(out,`${k}=${JSON.stringify(v)}\n`);}else process.stdout.write(JSON.stringify(matrices,null,2)+"\n");
