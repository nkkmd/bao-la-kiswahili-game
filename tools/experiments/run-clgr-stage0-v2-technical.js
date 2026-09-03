#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const E=require("../../public/engine.js");
const P=require("./lib/clgr-production.js"),I=require("./lib/clgr-independent.js");
const ROOT=path.resolve(__dirname,"../.."),DOC=path.join(ROOT,"doc/continuous-local-geometry-representation");
const STUDY=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STUDY_1_SPEC.json"),"utf8"));
const SPEC=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STAGE_0_TECHNICAL_SPEC_V2.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m);}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha(v){return crypto.createHash("sha256").update(typeof v==="string"?v:canon(v),"utf8").digest("hex");}
function same(a,b,m){need(canon(a)===canon(b),m);}
function expect(q,n,d,label){need(q&&q.defined,`${label} undefined`);need(BigInt(q.numerator)*BigInt(d)===BigInt(n)*BigInt(q.denominator),`${label} expected ${n}/${d}, got ${q.numerator}/${q.denominator}`);}
function rng(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let n=value;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};}
function clone(x){return JSON.parse(JSON.stringify(x));}

need(STUDY.studyId==="CLGR-STUDY1","study mismatch");
need(SPEC.stageId==="CLGR-S0-TECHNICAL-2026-09-03-v2","stage mismatch");
need(SPEC.supersedesTechnicalVersion.includes("v1 / TECHNICAL-INVALID"),"v1 versioning boundary missing");
need(SPEC.scientificContractChanged===false,"scientific contract changed in technical v2");
need(STUDY.measurementFoundation.relativeDepth===5,"relative depth mismatch");
need(STUDY.representationFamily.id==="CLGR-R1-EXACT-SQUASHED-L1","representation mismatch");
need(STUDY.seedNamespaces.stage1.start===31910001&&STUDY.seedNamespaces.stage2.start===31920001,"scientific seed namespace mismatch");
need(SPEC.technicalSeedStart===31909002&&SPEC.technicalSeedEnd===31909008,"v2 technical seed mismatch");
need(SPEC.stage1SeedAccessAuthorized===false&&SPEC.stage2SeedAccessAuthorized===false,"scientific seed access unexpectedly enabled");
need(SPEC.protectedDepth10AccessAuthorized===false,"protected holdout unexpectedly enabled");
need(STUDY.protectedDepth10==="SEALED / NOT GENERATED / NOT READ / NOT PEEKED","protected holdout contract mismatch");

function fixture(){return{reconstructionCore:{rootRawSha256:"synthetic-root",targetDepth:5,rootLegalMoveCount:4,representation:{mode:"RAW-ONLY",validatedTransformSet:[]},layers:[{depth:0,treeNodeOccurrences:"1",uniqueRawStateCount:1,unitWidthStateCount:0,replyWidthHistogram:{"4":"1"}},{depth:1,treeNodeOccurrences:"4",uniqueRawStateCount:4,unitWidthStateCount:2,replyWidthHistogram:{"1":"2","2":"2"}},{depth:2,treeNodeOccurrences:"6",uniqueRawStateCount:5,unitWidthStateCount:3,replyWidthHistogram:{"1":"3","2":"2"}},{depth:3,treeNodeOccurrences:"8",uniqueRawStateCount:5,unitWidthStateCount:2,replyWidthHistogram:{"1":"2","3":"3"}},{depth:4,treeNodeOccurrences:"9",uniqueRawStateCount:5,unitWidthStateCount:1,replyWidthHistogram:{"0":"1","1":"1","2":"3"}},{depth:5,treeNodeOccurrences:"10",uniqueRawStateCount:6,unitWidthStateCount:1,replyWidthHistogram:{"0":"2","1":"1","2":"3"}}],parentLayers:[{depth:0,uniqueTransitionCount:4,duplicateEncounterCount:0},{depth:1,uniqueTransitionCount:5,duplicateEncounterCount:1},{depth:2,uniqueTransitionCount:5,duplicateEncounterCount:2},{depth:3,uniqueTransitionCount:4,duplicateEncounterCount:1},{depth:4,uniqueTransitionCount:2,duplicateEncounterCount:0}],cumulative:{distinctRawStates:20}}};}
const dp=P.deriveAxes(fixture()),di=I.deriveAxes(fixture());same(dp,di,"synthetic axis derivation mismatch");
expect(dp.axes[P.AXES[0]],4,1,"A1");expect(dp.axes[P.AXES[1]],38,1,"A2");expect(dp.axes[P.AXES[2]],20,1,"A3");expect(dp.axes[P.AXES[3]],19,10,"A4");expect(dp.axes[P.AXES[4]],1,5,"A5");expect(dp.axes[P.AXES[5]],9,23,"A6");
const rp=P.represent(dp),ri=I.represent(di);same(rp,ri,"synthetic representation mismatch");
expect(rp.coordinates[P.AXES[0]],4,5,"S(A1)");expect(rp.coordinates[P.AXES[1]],38,39,"S(A2)");expect(rp.coordinates[P.AXES[2]],20,21,"S(A3)");expect(rp.coordinates[P.AXES[3]],19,29,"S(A4)");expect(rp.coordinates[P.AXES[4]],1,6,"S(A5)");expect(rp.coordinates[P.AXES[5]],9,32,"S(A6)");

function syntheticRep(lib,id,offset){const axes=Object.create(null);for(let i=0;i<lib.AXES.length;i++)axes[lib.AXES[i]]=lib.rational(BigInt(i+1+offset),BigInt(i+2));return lib.represent({rootRawSha256:id,axes});}
const repsP=[0,1,2,3,4].map(i=>syntheticRep(P,`r${i}`,i));const repsI=[0,1,2,3,4].map(i=>syntheticRep(I,`r${i}`,i));same(P.distanceRows(repsP),I.distanceRows(repsI),"synthetic distance matrix mismatch");same(P.neighbors(repsP,3),I.neighbors(repsI,3),"synthetic neighborhood mismatch");
const permuted=[repsP[4],repsP[1],repsP[3],repsP[0],repsP[2]];same(P.distanceRows(repsP),P.distanceRows(permuted),"root-order distance invariance failed");same(P.neighbors(repsP,3),P.neighbors(permuted,3),"root-order neighborhood invariance failed");

const fakeRoot={pits:[[[64]],[]],reserve:[0,0],houseOwned:[false,false],player:0,phase:"namua",winner:null,pending:[0,0]};
const fakeMove={type:"fake",phase:"namua",row:0,index:0,direction:"left",side:"front",houseChoice:null,houseTwo:false};
const fakeEngine={moveVariants:()=>[fakeMove],applyMove:(state)=>({state:{...clone(state),reason:"relay-limit"}})};
let relayP=null,relayI=null;try{P.measureRoot(fakeEngine,{phase:"namua",sourceSeed:31909002,selectedPly:1,rootState:clone(fakeRoot)});}catch(e){relayP=String(e&&e.message);}
try{I.measureRoot(fakeEngine,{phase:"namua",sourceSeed:31909002,selectedPly:1,rootState:clone(fakeRoot)});}catch(e){relayI=String(e&&e.message);}
need(relayP&&/relay-limit enumeration/.test(relayP),`production relay sentinel failed: ${relayP}`);need(relayI&&/(enum relay|occ relay)/.test(relayI),`independent relay sentinel failed: ${relayI}`);

function descriptor(seed,ply,state,moves){const pk=P.stateKey(state),ik=I.stateKey(state);need(pk===ik,`state key mismatch ${seed}/${ply}`);return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:pk,sourceTrajectorySha256:sha(moves.join("\n")),openingPrefixSha256:sha(moves.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,moves.length),rootState:clone(state)};}
function replay(seed){let state=E.initialState(),random=rng(seed),moves=[],namua=null,mtaji=null;for(let ply=1;ply<=80&&state.winner===null;ply++){const pv=E.moveVariants(state).map(m=>({m,k:P.moveKey(m)})).sort((a,b)=>a.k.localeCompare(b.k));const iv=E.moveVariants(state).map(m=>I.moveKey(m)).sort();same(pv.map(x=>x.k),iv,`legal move identity mismatch ${seed}/${ply}`);need(pv.length>0,`zero legal moves ${seed}/${ply}`);const chosen=pv[Math.floor(random()*pv.length)];moves.push(chosen.k);state=E.applyMove(state,chosen.m).state;if(state.reason==="relay-limit")return{relayLimit:true};if(!namua&&ply>=24&&state.winner===null&&state.phase==="namua")namua=descriptor(seed,ply,state,moves);if(!mtaji&&ply>=44&&state.winner===null&&state.phase==="mtaji")mtaji=descriptor(seed,ply,state,moves);if(namua&&mtaji)break;}return{relayLimit:false,namua,mtaji};}
let selected=null;for(let seed=SPEC.technicalSeedStart;seed<=SPEC.technicalSeedEnd&&!selected;seed++){const r=replay(seed);if(!r.relayLimit&&r.namua&&r.mtaji)selected={seed,roots:[r.namua,r.mtaji]};}
need(selected,"technical seed namespace produced no Namua+Mtaji technical root pair");
const measuredP=[],measuredI=[],timings=[];for(const src of selected.roots){let t=Date.now(),a=P.measureRoot(E,src),pm=Date.now()-t;t=Date.now();const b=I.measureRoot(E,src),im=Date.now()-t;same(a.source,b.source,"technical source mismatch");need(a.upstreamRootReconstructionCoreSha256===b.upstreamRootReconstructionCoreSha256,"technical reconstruction core mismatch");same(a.upstreamFamilyCoreSha256,b.upstreamFamilyCoreSha256,"technical family core mismatch");same(a.rawPrimitives,b.rawPrimitives,"technical raw primitive mismatch");same(a.axes,b.axes,"technical axes mismatch");same(a.representation,b.representation,"technical coordinate mismatch");measuredP.push(a);measuredI.push(b);timings.push({phase:src.phase,ply:src.selectedPly,productionMs:pm,independentMs:im,combinedMs:pm+im,resourceView:a.resourceView});}
same(P.distanceRows(measuredP.map(x=>x.representation)),I.distanceRows(measuredI.map(x=>x.representation)),"technical exact distance mismatch");

const psrc=fs.readFileSync(path.join(__dirname,"lib/clgr-production.js"),"utf8"),isrc=fs.readFileSync(path.join(__dirname,"lib/clgr-independent.js"),"utf8");need(psrc.includes("lgtgmiv-stage1-production.js")&&!psrc.includes("lgtgmiv-stage1-independent.js")&&!psrc.includes("clgr-independent.js"),"production implementation separation failed");need(isrc.includes("lgtgmiv-stage1-independent.js")&&!isrc.includes("lgtgmiv-stage1-production.js")&&!isrc.includes("clgr-production.js"),"independent implementation separation failed");

const core={schemaVersion:1,studyId:"CLGR-STUDY1",stageId:SPEC.stageId,evidenceClass:"TECHNICAL-FIXTURE",supersedesTechnicalVersion:SPEC.supersedesTechnicalVersion,scientificContractChanged:false,representationId:P.REPRESENTATION_ID,axisUniverse:P.AXES,syntheticAxisExact:true,syntheticTransformExact:true,exactRationalArithmetic:true,exactL1Distance:true,k3TieInclusiveNeighborhood:true,rootOrderInvariance:true,relayLimitFailClosed:true,relaySentinelProduction:relayP,relaySentinelIndependent:relayI,technicalSeed:selected.seed,technicalSeedScientificUseProhibited:true,technicalRoots:selected.roots.map(x=>({phase:x.phase,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256})),productionIndependentDepth5Exact:true,productionIndependentAxisExact:true,productionIndependentCoordinateExact:true,productionIndependentDistanceExact:true,implementationSeparation:true,technicalTimings:timings,maxCombinedRootMs:Math.max(...timings.map(x=>x.combinedMs)),freshScientificSeedAccess:false,stage1SeedAccess:false,stage2SeedAccess:false,protectedDepth10Access:false};
const result={...core,deterministicCoreSha256:sha(core),stageDisposition:"STAGE0-PASS"};
const arg=process.argv.indexOf("--output"),out=arg>=0?process.argv[arg+1]:path.join(DOC,"results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json");fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");console.log(`CLGR_STAGE0_V2_RESULT=${JSON.stringify(result)}`);
