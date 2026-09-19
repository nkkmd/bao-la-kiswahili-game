#!/usr/bin/env node
"use strict";
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(process.cwd());
const SPEC=JSON.parse(fs.readFileSync(path.join(ROOT,'doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_4_STAGE_2_FORMAL_HELDOUT_SPEC.json'),'utf8'));
function need(x,m){if(!x)throw new Error(m);}
function main(){const r=SPEC.freshSeedSlots.primary;need(r.count===768&&r.seedEnd-r.seedStart+1===768,'Study4 Stage2 primary block must contain 768 slots');const include=[];for(let s=r.seedStart;s<=r.seedEnd;s+=4)include.push({s1:s,s2:s+1,s3:s+2,s4:s+3});need(include.length===192,'quartet matrix must have 192 rows');const measurement={include:Array.from({length:18},(_,task)=>({task}))};const out=process.env.GITHUB_OUTPUT;if(out){fs.appendFileSync(out,`source=${JSON.stringify({include})}\n`);fs.appendFileSync(out,`measurement=${JSON.stringify(measurement)}\n`);}process.stdout.write(JSON.stringify({studyId:'SFCDFT-STUDY4',stageId:SPEC.stageId,sourceQuartets:include.length,measurementTasks:18})+'\n');}
main();
