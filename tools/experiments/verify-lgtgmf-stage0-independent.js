#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const engine = require("../../public/engine.js");
const ind = require("./lib/lgtgmf-independent.js");

const STAGE_ID = "LGTGMF-S0-TECHNICAL-2026-08-31-v1";
const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "../../artifacts/local/local-game-tree-geometry-measurement-foundation/stage0-technical-v1");
const EXPECTED = Object.freeze({rootRawKey:"2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6",states:19,edges:18,stateHash:"0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f",edgeHash:"be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1"});
function ok(v,m){if(!v)throw new Error(m);}
function g(id,root,nodes){return{id,root,nodes};}
function fx(){return{
 T01:{depth:0,graph:g("T01-IDENTITY-TRIVIAL","R",{R:{moves:[]}})},
 T02:{depth:2,graph:g("T02-NO-TRANSPOSITION-SYNTHETIC","R",{R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]},A:{moves:[{id:"c",to:"C"},{id:"d",to:"D"}]},B:{moves:[{id:"e",to:"E"}]},C:{moves:[]},D:{moves:[]},E:{moves:[]}})},
 T03:{depth:2,graph:g("T03-KNOWN-TRANSPOSITION-SYNTHETIC","R",{R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]},A:{moves:[{id:"c",to:"C"}]},B:{moves:[{id:"d",to:"C"}]},C:{moves:[]}})},
 T04:{depth:3,graph:g("T04-KNOWN-RECONVERGENCE-SYNTHETIC","R",{R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]},A:{moves:[{id:"c",to:"C"}]},B:{moves:[{id:"d",to:"D"}]},C:{moves:[{id:"e",to:"E"}]},D:{moves:[{id:"f",to:"E"}]},E:{moves:[]}})},
 T05:{depth:2,graph:g("T05-BRANCH-EXPANSION-SYNTHETIC","R",{R:{moves:[{id:"a",to:"A"}]},A:{moves:[{id:"b",to:"B"},{id:"c",to:"C"},{id:"d",to:"D"}]},B:{moves:[]},C:{moves:[]},D:{moves:[]}})},
 T06:{depth:2,graph:g("T06-BRANCH-COMPRESSION-SYNTHETIC","R",{R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"},{id:"c",to:"C"}]},A:{moves:[{id:"d",to:"D"}]},B:{moves:[{id:"e",to:"E"}]},C:{moves:[{id:"f",to:"F"}]},D:{moves:[]},E:{moves:[]},F:{moves:[]}})},
 T07:{depth:1,graph:g("T07-TERMINAL-SYNTHETIC","R",{R:{moves:[{id:"a",to:"T"}]},T:{terminal:true,moves:[]}})},
};}
function stripTraversal(obj){const c=JSON.parse(JSON.stringify(obj));delete c.traversalOrder;return c;}
function main(){
 const production=JSON.parse(fs.readFileSync(path.join(OUT_DIR,"stage0-production-result.json"),"utf8"));ok(production.stageId===STAGE_ID,"production stage mismatch");
 const initial=engine.initialState();ok(ind.rawId(initial)===EXPECTED.rootRawKey,"T00 independent RAW key mismatch");const transient=engine.clone(initial);transient.turn=123456;transient.reason="x";ok(ind.rawId(transient)===EXPECTED.rootRawKey,"T00 transient leak");
 const synthetic={};for(const[id,f]of Object.entries(fx())){const r=ind.syntheticCheck(f.graph,f.depth,"ascending");synthetic[id]=r;ok(ind.canon(stripTraversal(r))===ind.canon(stripTraversal(production.synthetic[id])),`${id} production/independent mismatch`);}
 ok(synthetic.T03.parentLayers[1].duplicateEncounterCount===1&&synthetic.T03.parentLayers[1].multiParentStateCount===1,"T03 expected control failed");ok(synthetic.T04.firstReconvergenceDepth===3,"T04 expected control failed");ok(synthetic.T05.parentLayers[0].branchReopeningCount===1,"T05 expected control failed");ok(synthetic.T06.parentLayers[0].widthCompressionCount===3,"T06 expected control failed");ok(synthetic.T07.parentLayers[0].branchExtinctionCount===1,"T07 expected control failed");
 const t08=["ascending","descending","shuffled"].map((o)=>ind.syntheticCheck(fx().T04.graph,3,o));ok(new Set(t08.map((x)=>x.coreSha256)).size===1,"T08 independent traversal failure");
 const historical=ind.reconstruct({engine,rootState:initial,targetDepth:2,traversalOrder:"ascending"});ok(historical.cumulative.distinctRawStates===EXPECTED.states,"T09 state count");ok(historical.cumulative.uniqueGlobalTransitions===EXPECTED.edges,"T09 edge count");ok(historical.cumulative.cumulativeRawStateSetSha256===EXPECTED.stateHash,"T09 state hash");ok(historical.cumulative.cumulativeGlobalRawGraphEdgeSetSha256===EXPECTED.edgeHash,"T09 edge hash");
 const prodCore=production.T09.measurement;ok(ind.canon(stripTraversal(historical))===ind.canon(stripTraversal(prodCore)),"T09 production/independent full core mismatch");
 const orders=["descending","shuffled"].map((o)=>ind.reconstruct({engine,rootState:initial,targetDepth:2,traversalOrder:o}));ok(orders.every((x)=>x.measurementCoreSha256===historical.measurementCoreSha256),"T09 independent traversal mismatch");
 const result={schemaVersion:1,studyId:"LGTGMF-STUDY1",stageId:STAGE_ID,resultClass:"TECHNICAL-FIXTURE",scientificInferenceAuthorized:false,scientificSeedConsumption:"NONE",passed:true,importsProductionEnumerator:false,importsProductionSerializer:false,importsProductionMoveKey:false,importsProductionAggregation:false,syntheticAgreement:true,traversalOrderInvariance:true,historicalReferenceAgreement:true,productionIndependentCoreAgreement:true,independentHistoricalMeasurementCoreSha256:historical.measurementCoreSha256,protectedStandardRootDepth10Generated:false,protectedStandardRootDepth10Read:false};
 result.verificationSha256=ind.digest(ind.canon(result));fs.writeFileSync(path.join(OUT_DIR,"stage0-independent-verification.json"),`${JSON.stringify(result,null,2)}\n`,`utf8`);console.log(`LGTGMF_STAGE0_INDEPENDENT=${JSON.stringify(result)}`);
}
main();
