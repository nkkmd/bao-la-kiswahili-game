"use strict";
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const P=require("./object-engine.cjs"),I=require("./ring-engine.cjs"),RuntimeI=require("../g5-01/transition/independent-engine.cjs"),F=require("../g5-01/transition/fixtures.cjs"),M=require("../g5-01/measurement.cjs");
const A=require("./certificates.cjs"),B=require("./independent-certificates.cjs"),Micro=require("./microstate-check.cjs");
const root=path.resolve(__dirname,"../../.."),docs=path.join(root,"doc/research-generation-5/method-review-20261013"),sha=b=>crypto.createHash("sha256").update(b).digest("hex"),read=p=>JSON.parse(fs.readFileSync(p));
const normalize=s=>({...M.raw(s),reason:s.reason??"",turn:s.turn});
const order=moves=>[...moves].sort((a,b)=>M.moveKey(a)<M.moveKey(b)?-1:1);
function binding() {const config=read(path.join(docs,"CONFIG.json")),manifest=read(path.join(docs,"SOURCE_MANIFEST.json"));for(const[p,h]of Object.entries(manifest.files))assert.equal(sha(fs.readFileSync(path.join(root,p))),h,p);assert.equal(config.newScientificSourceGeneration,false);return{config,manifest};}
function run() {
 const {config,manifest}=binding(),started=performance.now(),boundaries=new Set(),projections=new Set(),micros=new Set(),rows=[],allStates=new Map();
 const evidence={technicalId:config.technicalId,known:[],constructed:[],diagnostics:[],proofChecks:null};
 const checkLimits=()=>{assert.ok(performance.now()-started<config.maxTotalMs,"TECHNICAL-TIME-LIMIT");assert.ok(process.resourceUsage().maxRSS*1024<=config.maxRssBytes,"TECHNICAL-RSS-LIMIT");};
 function observeBoundary(s){const id=M.rawKey(s);boundaries.add(id);projections.add(id);allStates.set(id,s);return id;}
 function observeMicro(frame){micros.add(M.digest({ruleRevision:config.ruleRevision,...frame}));projections.add(M.rawKey({...frame,winner:null}));}
 function compare(s,m,label,cap=config.maxMicrostates) {
  checkLimits();const a=P.applyMove(s,m,{maxMicrostates:cap}),b=I.applyMove(s,m,{maxMicrostates:cap});
  assert.equal(a.status,b.status,label);assert.equal(a.relays,b.relays,label);assert.deepEqual(a.microstates,b.microstates,label);assert.deepEqual(a.cycle,b.cycle,label);
  if(a.state){assert.deepEqual(normalize(a.state),normalize(b.state),label);observeBoundary(a.state);}else assert.equal(b.state,null);
  Micro.check(a);Micro.check(b);a.microstates.forEach(observeMicro);
  const row={fixture:label,moveKey:M.moveKey(m),from:observeBoundary(s),status:a.status,relays:a.relays,microstates:a.microstates.length,to:a.state?M.rawKey(a.state):null,cycle:a.cycle};rows.push(row);
  return {a,b,row};
 }
 const queue=F.corpus().map(f=>({state:structuredClone(f.state),depth:0,fixture:f.id})),expanded=new Set(),knownStates=new Set();
 for(let n=0;n<queue.length;n++) {
  const{state,depth,fixture}=queue[n],id=observeBoundary(state);knownStates.add(id);if(depth>=config.knownFixtureDepth||expanded.has(id))continue;expanded.add(id);
  const pm=order(P.moveVariants(state,P.legalMoves(state),{maxMicrostates:config.maxMicrostates})),im=order(I.moveVariants(state,{maxMicrostates:config.maxMicrostates}));assert.deepEqual(pm.map(M.moveKey),im.map(M.moveKey));
  for(const move of pm){const r=compare(state,move,fixture);evidence.known.push({from:id,moveKey:M.moveKey(move),object:r.a,ring:r.b});assert.equal(r.a.status,"TERMINATED","Known fixture transition must terminate");queue.push({state:r.a.state,depth:depth+1,fixture});}
 }
 for(const fixture of read(path.join(__dirname,"constructed.json")).rows) {
  const moves=order(P.moveVariants(fixture.state,P.legalMoves(fixture.state),{maxMicrostates:config.maxMicrostates}));assert.deepEqual(moves.map(M.moveKey),order(I.moveVariants(fixture.state,{maxMicrostates:config.maxMicrostates})).map(M.moveKey));
  for(const move of moves){const r=compare(fixture.state,move,fixture.id);evidence.constructed.push({fixture:fixture.id,evidenceClass:fixture.evidenceClass,move,object:r.a,ring:r.b});}
 }
 const relay=F.corpus().find(f=>f.id==="P9/capture-relay");
 for(const move of order(P.moveVariants(relay.state))) {
  const bounded=compare(relay.state,move,"MICRO-CAP-1",config.diagnosticMicrostateCap),natural=compare(relay.state,move,"NATURAL-RELAY-FIXTURE");
  const runtime=RuntimeI.applyMove(relay.state,move,{mode:"runtime",runtimeRelayCap:config.diagnosticRuntimeRelayCap});observeBoundary(runtime.state);
  evidence.diagnostics.push({moveKey:M.moveKey(move),bounded:bounded.a,natural:natural.a,simulatedRuntimeCap:config.diagnosticRuntimeRelayCap,runtime});
 }
 const f=read(path.join(__dirname,"proof-fixtures.json")),checks=f.choices.map(c=>{const a=A.check(f.graph,c.proof),b=B.check(f.graph,c.proof);assert.deepEqual(a,b);return a;});
 const all=A.allRootChoices(f.graph,"r",f.choices);assert.deepEqual(all.values.map(r=>r.value),[-1,1]);assert.equal(all.formalEligible,false);
 const eligibility=A.closedDomainEligibility({fullClosure:false,ruleValidated:false,allRootValuesKnown:true});assert.equal(eligibility.eligible,false);evidence.proofChecks={checks,allRoot:all,eligibility};
 const prior=new Set();for(const location of ["g5-01/development","g5-02","g5-03","g5-04","g5-05"]){const e=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,"doc/research-generation-5",location,"results/EVIDENCE.json.gz"))));for(const id of e.developmentReadIdentities??e.supplyReadIdentities)prior.add(id);}
 assert.equal(prior.size,101691);
 evidence.boundaryStates=[...allStates].map(([id,state])=>({id,state}));evidence.technicalBoundaryIdentities=[...boundaries].sort();evidence.technicalRawProjectionIdentities=[...projections].sort();evidence.microstateIdentities=[...micros].sort();
 const bytes=Buffer.from(JSON.stringify(evidence));assert.ok(bytes.length<=config.maxEvidenceBytes);checkLimits();
 const union=new Set([...prior,...projections]);
 const result={technicalId:config.technicalId,decision:"SCIENCE-METHOD-TECHNICAL-PASS-NOT-SCIENTIFIC-AUTHORIZATION",sourceManifestSha256:sha(fs.readFileSync(path.join(docs,"SOURCE_MANIFEST.json"))),
  knownFixtureRoots:F.corpus().length,knownBoundaryStates:knownStates.size,knownTransitions:evidence.known.length,constructedTransitions:evidence.constructed.length,
  transitionRows:rows,diagnosticCount:evidence.diagnostics.length,diagnosticOutcomes:evidence.diagnostics.map(d=>({status:d.bounded.status,natural:d.natural.status,simulatedRuntime:d.runtime.status,simulatedRuntimeAssignedWinner:d.runtime.state.winner})),
  abstractCertificateChecks:checks,abstractRootChoiceValues:all.values,abstractProofHasBaoOracle:false,certificateAloneMeetsFullClosure:false,
  technicalBoundaryIdentityCount:boundaries.size,technicalRawProjectionIdentityCount:projections.size,microstateIdentityCount:micros.size,priorReadIdentityCount:prior.size,combinedReadIdentityCount:union.size,
  rawEvidenceBytes:bytes.length,newScientificSources:0,newScientificSeeds:0,newScientificCandidates:0,oldGuardWitnessExtensions:0,formalRelationExecuted:false,publicAiChanged:false,fullClosureRequirementChanged:false,
  evidenceJsonSha256:sha(bytes)};
 return {result,bytes,execution:{elapsedMs:Math.round(performance.now()-started),peakRssBytes:process.resourceUsage().maxRSS*1024}};
}
if(require.main===module){const value=run();if(process.argv.includes("--check")){assert.deepEqual(value.result,read(path.join(docs,"results/RESULT.json")));const gz=fs.readFileSync(path.join(docs,"results/TECHNICAL_EVIDENCE.json.gz"));assert.deepEqual(zlib.gunzipSync(gz),value.bytes);console.log("SCIENCE-METHOD-TECHNICAL-REPLAY-PASS");}else if(process.argv.includes("--write")){fs.writeFileSync(path.join(docs,"results/RESULT.json"),JSON.stringify(value.result,null,2)+"\n");fs.writeFileSync(path.join(docs,"results/TECHNICAL_EVIDENCE.json.gz"),zlib.gzipSync(value.bytes));fs.writeFileSync(path.join(docs,"results/EXECUTION.json"),JSON.stringify(value.execution,null,2)+"\n");console.log(JSON.stringify({...value.result,transitionRows:undefined,execution:value.execution}));}else console.log(JSON.stringify(value.result,null,2));}
module.exports={run,binding};
