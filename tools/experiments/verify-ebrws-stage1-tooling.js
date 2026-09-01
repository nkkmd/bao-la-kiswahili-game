#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../..");
const P=require("./lib/ebrws-stage1-production.js"),I=require("./lib/ebrws-stage1-independent.js");
const spec=JSON.parse(fs.readFileSync(path.join(ROOT,"doc/effective-branching-reply-width-structure/prereg/STUDY_1_SPEC.json"),"utf8"));
function ok(x,m){if(!x)throw new Error(m)}
function sha(x){return crypto.createHash("sha256").update(x,"utf8").digest("hex")}
ok(spec.studyId==="EBRWS-STUDY1","study id");
ok(spec.relativeLocalHorizon===5,"depth");
const s1=spec.stages.find(x=>x.stageId==="EBRWS-S1-DEVELOPMENT-2026-09-01-v1");
ok(s1&&s1.seedStart===31210001&&s1.seedEnd===31210192,"Stage 1 seed freeze");
ok(s1.targetRoots.namua===12&&s1.targetRoots.mtaji===12,"Stage 1 target roots");
ok(typeof P.selectRoots==="function"&&typeof I.selectRoots==="function","selectors exported");
ok(typeof P.measureRoot==="function"&&typeof I.measureRoot==="function","measure functions exported");
ok(typeof P.candidateSet==="function"&&typeof I.candidateSet==="function","candidate functions exported");
const ps=fs.readFileSync(path.join(__dirname,"lib/ebrws-stage1-production.js"),"utf8"),is=fs.readFileSync(path.join(__dirname,"lib/ebrws-stage1-independent.js"),"utf8");
ok(!ps.includes("ebrws-stage1-independent")&&!is.includes("ebrws-stage1-production"),"cross import forbidden");
ok(ps.includes("ebrws-stage0-production")&&is.includes("ebrws-stage0-independent"),"separate derived endpoints required");
ok(ps.includes("lgtgmiv-stage1-production")&&is.includes("lgtgmiv-stage1-independent"),"separate instrument implementations required");
ok(sha(ps)!==sha(is),"distinct implementation source");
const pc=P.candidateSet([]),ic=I.candidateSet([]);
ok(P.canonical(pc)===I.canonical(ic),"empty candidate canonical agreement");
ok(pc.candidates.length===0&&ic.candidates.length===0,"empty candidate behavior");
console.log(JSON.stringify({studyId:"EBRWS-STUDY1",stageId:"EBRWS-S1-DEVELOPMENT-2026-09-01-v1",toolingPass:true,freshScientificSeedAccessed:false,protectedDepth10Access:false,productionSourceSha256:sha(ps),independentSourceSha256:sha(is)},null,2));
