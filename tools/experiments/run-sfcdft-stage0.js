#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const E=require("../../public/engine.js");
const P=require("./lib/sfcdft-production.js");
const I=require("./lib/sfcdft-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const SPEC_PATH=path.join(ROOT,"doc/sfcdf-transfer-study-1/prereg/STUDY_1_SPEC.json");
const AUTH_PATH=path.join(ROOT,"doc/sfcdf-transfer-study-1/authorizations/STAGE_0_AUTHORIZATION.json");
const UPSTREAM_PATH=path.join(ROOT,"doc/branch-expansion-compression-transition/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const LEGACY_DIR=path.join(ROOT,"doc/research-generation-4/identity-firewalls/g4-02-g4-01-legacy-sfcdf");
const LEGACY_MANIFEST=path.join(LEGACY_DIR,"MANIFEST.json");
const DEFAULT_OUT=path.join(ROOT,"artifacts/sfcdft-stage0/result.json");

function need(x,m){if(!x)throw new Error(m);}
function readJson(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function sha256(x){return crypto.createHash("sha256").update(x).digest("hex");}
function gitBlobSha(p){const b=fs.readFileSync(p);return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`)).update(b).digest("hex");}
function coreRow(r){return{ply:r.ply,phase:r.phase,terminal:r.terminal,rootLegalWidth:r.rootLegalWidth,rawStateSha256:r.rawStateSha256};}
function replayCore(r){return{policyId:r.policyId,seed:r.seed,moveKeys:r.moveKeys,rows:r.rows.map(coreRow),trajectorySha256:r.trajectorySha256,openingPrefixSha256:r.openingPrefixSha256,openingPrefixLength:r.openingPrefixLength,terminal:r.terminal};}
function anchorCore(a){return{familyId:a.familyId,complete:a.complete,namua:P.sourceOnly(a.namua),mtaji:P.sourceOnly(a.mtaji)};}
function loadLines(name){return fs.readFileSync(path.join(LEGACY_DIR,name),"utf8").split(/\r?\n/).filter(Boolean);}
function verifyLegacy(manifest){
  let trajectory=[],root=[];
  for(const c of manifest.chunks){
    const p=path.join(LEGACY_DIR,c.path);
    need(fs.existsSync(p),`legacy chunk missing ${c.path}`);
    need(gitBlobSha(p)===c.gitBlobSha,`legacy chunk blob mismatch ${c.path}`);
    const xs=loadLines(c.path);
    need(xs.length===c.lineCount,`legacy chunk count mismatch ${c.path}`);
    (c.path.startsWith("sourceTrajectory")?trajectory:root).push(...xs);
  }
  need(trajectory.length===manifest.stage1RIdentity.sourceTrajectorySha256Count,"legacy trajectory count mismatch");
  need(root.length===manifest.stage1RIdentity.rootRawSha256Count,"legacy root count mismatch");
  need(new Set(trajectory).size===trajectory.length&&new Set(root).size===root.length,"legacy identity duplicates");
  need(trajectory.every((x,i,a)=>i===0||a[i-1]<x),"legacy trajectory list not sorted");
  need(root.every((x,i,a)=>i===0||a[i-1]<x),"legacy root list not sorted");
  need(manifest.stage1RIdentity.openingPrefixSha256==="NOT-RECORDED","legacy prefix limitation lost");
  return{trajectoryCount:trajectory.length,rootCount:root.length,trajectorySet:new Set(trajectory),rootSet:new Set(root)};
}
function verifyUpstream(fw){
  need(fw&&fw.scientificOutcomeFieldsRetained===false,"upstream firewall not identity-only");
  const ids=fw.identitySets||{};
  for(const k of["rootRawSha256","sourceTrajectorySha256","openingPrefixSha256"])need(Array.isArray(ids[k])&&ids[k].length>0,`upstream firewall missing ${k}`);
  return{root:ids.rootRawSha256.length,trajectory:ids.sourceTrajectorySha256.length,prefix:ids.openingPrefixSha256.length};
}
function staticBoundary(){
  const pp=path.join(__dirname,"lib/sfcdft-production.js"),ip=path.join(__dirname,"lib/sfcdft-independent.js");
  const ps=fs.readFileSync(pp,"utf8"),is=fs.readFileSync(ip,"utf8");
  need(ps.includes('require("./lgttci-compatibility-production.js")'),"production source binding missing");
  need(ps.includes('require("./sfcdf-stage1-production.js")'),"production measurement binding missing");
  need(!ps.includes("independent.js"),"production imports independent implementation");
  need(is.includes('require("./lgttci-compatibility-independent.js")'),"independent source binding missing");
  need(is.includes('require("./sfcdf-stage1-independent.js")'),"independent measurement binding missing");
  need(!is.includes("production.js"),"independent imports production implementation");
  need(ps!==is,"production/independent helpers identical");
  return{productionGitBlobSha:gitBlobSha(pp),independentGitBlobSha:gitBlobSha(ip),productionSha256:sha256(ps),independentSha256:sha256(is)};
}
function exact(a,b,label){need(P.stable(a)===I.stable(b),`${label} production/independent mismatch`);}
function chooseComplete(all){
  for(const policyId of[P.P1,P.P2])for(const familyId of[P.RF1,P.RF2])for(const row of all){
    if(row.policyId!==policyId)continue;
    const a=P.selectAnchors(row.p,familyId);
    if(a.complete&&a.openingPrefixLength===16)return{policyId,familyId,seed:row.seed,replayP:row.p,replayI:row.i,anchorsP:a,anchorsI:I.selectAnchors(row.i,familyId)};
  }
  throw new Error("no complete technical pair available");
}
function resourceCheck(m,spec,label){
  const r=m.resourceView;
  need(BigInt(r.distinctRawStates)<=BigInt(spec.resourceCeilings.perDepth5Root.maxDistinctRawStates),`${label} distinct RAW ceiling`);
  need(BigInt(r.uniqueTransitions)<=BigInt(spec.resourceCeilings.perDepth5Root.maxUniqueTransitions),`${label} transition ceiling`);
  need(BigInt(r.parentExpansions)<=BigInt(spec.resourceCeilings.perDepth5Root.maxParentExpansions),`${label} expansion ceiling`);
  need(BigInt(r.treeNodeOccurrences)<=BigInt(spec.resourceCeilings.perDepth5Root.maxTreeNodeOccurrences),`${label} tree ceiling`);
}
function statsFixtures(){
  const signP=P.signP(18,0),signI=I.signP(18,0);exact(signP,signI,"sign test");need(signP.numerator==="1"&&signP.denominator==="131072","18/0 sign-test fixture mismatch");
  const base=[];
  for(const claim of[P.C1,P.C6])for(let cell=1;cell<=4;cell++)base.push({slotId:`${claim}|CELL${cell}`,claim,cell,estimable:true,direction:claim===P.C1?1:-1,rawP:signP});
  const hp=P.holm(base),hi=I.holm(base);exact(hp,hi,"Holm");need(hp.every(x=>x.holmPass),"all-pass Holm fixture failed");
  const c1=hp.filter(x=>x.claim===P.C1),c6=hp.filter(x=>x.claim===P.C6);
  const generalP=[P.claimDecision(P.C1,c1),P.claimDecision(P.C6,c6)],generalI=[I.claimDecision(I.C1,hi.filter(x=>x.claim===I.C1)),I.claimDecision(I.C6,hi.filter(x=>x.claim===I.C6))];exact(generalP,generalI,"generalization mapping");need(generalP.every(x=>x==="GENERALIZES-WITHIN-FROZEN-DOMAIN"),"generalization fixture failed");
  const counter=c1.map(x=>({...x}));counter[0].direction=-1;need(P.claimDecision(P.C1,counter)==="COUNTEREXAMPLE-BOUNDARY-DETECTED"&&I.claimDecision(I.C1,counter)==="COUNTEREXAMPLE-BOUNDARY-DETECTED","counterexample fixture failed");
  const ne=c1.map(x=>({...x}));ne[0].estimable=false;ne[0].holmPass=false;need(P.claimDecision(P.C1,ne)==="NON-ESTIMABLE"&&I.claimDecision(I.C1,ne)==="NON-ESTIMABLE","non-estimable fixture failed");
  const nc=c1.map(x=>({...x}));nc[0].holmPass=false;need(P.claimDecision(P.C1,nc)==="NOT-CONFIRMED"&&I.claimDecision(I.C1,nc)==="NOT-CONFIRMED","not-confirmed fixture failed");
  need(P.claimDecision(P.C1,c1,{technicalInvalid:true})==="TECHNICAL-INVALID"&&I.claimDecision(I.C1,c1,{technicalInvalid:true})==="TECHNICAL-INVALID","technical-invalid fixture failed");
  return{signTest18to0:signP,holm:hp,decisions:{C1:generalP[0],C6:generalP[1],counterexample:"PASS",nonEstimable:"PASS",notConfirmed:"PASS",technicalInvalid:"PASS"}};
}
function main(outFile){
  const started=Date.now();
  try{
    const spec=readJson(SPEC_PATH),auth=readJson(AUTH_PATH),upstream=readJson(UPSTREAM_PATH),legacy=readJson(LEGACY_MANIFEST);
    need(spec.studyId===P.STUDY_ID&&auth.studyId===P.STUDY_ID,"study identity mismatch");
    need(auth.decision==="SFCDFT-STAGE0-AUTHORIZED","Stage 0 not authorized");
    need(gitBlobSha(SPEC_PATH)===auth.studySpecGitBlobSha,"Study spec blob binding mismatch");
    need(auth.freshStage1SeedAccessAuthorized===false&&auth.freshStage2SeedAccessAuthorized===false,"fresh access unexpectedly authorized");
    need(spec.freshSeedBlocks.stage1.statusAtFreeze==="RESERVED-NOT-ACCESSED"&&spec.freshSeedBlocks.stage2.statusAtFreeze==="RESERVED-NOT-ACCESSED","fresh namespaces not sealed");
    const fixture=spec.technicalFixtureNamespace;
    need(fixture.seedStart===auth.technicalFixtureSeedStart&&fixture.seedEnd===auth.technicalFixtureSeedEnd,"fixture authorization mismatch");
    need(fixture.seedEnd<spec.freshSeedBlocks.stage1.seedStart||fixture.seedStart>spec.freshSeedBlocks.stage2.seedEnd,"fixture/fresh range overlap");

    const upstreamCounts=verifyUpstream(upstream),legacyView=verifyLegacy(legacy),staticAudit=staticBoundary();
    const familySupport={};
    for(const p of[P.P1,P.P2])for(const f of[P.RF1,P.RF2])familySupport[`${p}|${f}`]=0;
    const all=[];let policyDistinct=0;
    for(let seed=fixture.seedStart;seed<=fixture.seedEnd;seed++){
      const byPolicy={};
      for(const policyId of[P.P1,P.P2]){
        const pr=P.replay(E,policyId,seed,spec.selectionContract.sourceMaxPly),ir=I.replay(E,policyId,seed,spec.selectionContract.sourceMaxPly);
        exact(replayCore(pr),replayCore(ir),`replay ${policyId}/${seed}`);
        need(pr.openingPrefixLength>=16||pr.rows.length<16,"opening-prefix length contract anomaly");
        if(pr.openingPrefixLength===16)need(pr.openingPrefixSha256===P.digest(pr.moveKeys.slice(0,16).join("\n")),"prefix digest mismatch");
        byPolicy[policyId]=pr;
        all.push({policyId,seed,p:pr,i:ir});
        for(const familyId of[P.RF1,P.RF2]){
          const pa=P.selectAnchors(pr,familyId),ia=I.selectAnchors(ir,familyId);exact(anchorCore(pa),{familyId:ia.familyId,complete:ia.complete,namua:I.sourceOnly(ia.namua),mtaji:I.sourceOnly(ia.mtaji)},`anchors ${policyId}/${familyId}/${seed}`);
          if(pa.complete&&pa.openingPrefixLength!==0)familySupport[`${policyId}|${familyId}`]++;
        }
      }
      if(byPolicy[P.P1].trajectorySha256!==byPolicy[P.P2].trajectorySha256)policyDistinct++;
    }
    need(policyDistinct>0,"P1/P2 not technically distinguishable");
    for(const [cell,n] of Object.entries(familySupport))need(n>0,`no complete technical anchor in ${cell}`);

    const selected=chooseComplete(all);exact(anchorCore(selected.anchorsP),{familyId:selected.anchorsI.familyId,complete:selected.anchorsI.complete,namua:I.sourceOnly(selected.anchorsI.namua),mtaji:I.sourceOnly(selected.anchorsI.mtaji)},"selected anchors");
    const measured={};
    for(const phase of["namua","mtaji"]){
      const sp=selected.anchorsP[phase],si=selected.anchorsI[phase];
      const mp=P.measureRoot(E,sp),mi=I.measureRoot(E,si);exact(mp,mi,`depth5 measurement ${phase}`);resourceCheck(mp,spec,phase);measured[phase]={p:mp,i:mi};
    }
    const pairP=P.comparePair("TECHNICAL-PAIR",measured.namua.p,measured.mtaji.p),pairI=I.comparePair("TECHNICAL-PAIR",measured.namua.i,measured.mtaji.i);exact(pairP,pairI,"C1/C6 pair endpoints");
    for(const id of[P.C1,P.C6])need(pairP.candidates[id]&&pairP.candidates[id].deltaMtajiMinusNamua,"required endpoint missing");

    const stats=statsFixtures();
    const checks={
      contractBinding:true,fixtureOnly:true,upstreamIdentityFirewall:true,legacyIdentityFirewall:true,
      productionIndependentStaticBoundary:true,sourcePolicyExact:true,rootFamilyExact:true,openingPrefixFixture:true,
      c1c6Depth5Exact:true,resourceCeilings:true,signTestExact:true,holmEightSlotExact:true,decisionMappingExact:true,
      freshStage1SeedAccess:false,freshStage2SeedAccess:false,g3_11Depth10Rerun:false,g3_12Access:false,g4_10Depth11Access:false,publicAiChange:false
    };
    const core={studyId:P.STUDY_ID,stageId:"SFCDFT-S0-TECHNICAL-2026-09-18-v1",evidenceClass:"TECHNICAL-FIXTURE",checks,fixtureNamespace:{seedStart:fixture.seedStart,seedEnd:fixture.seedEnd,count:fixture.count},policyDistinctTrajectoryCount:policyDistinct,familySupport,upstreamFirewallCounts:upstreamCounts,legacyFirewallCounts:{trajectory:legacyView.trajectoryCount,root:legacyView.rootCount},staticAudit,selectedTechnicalPair:{policyId:selected.policyId,familyId:selected.familyId,seed:selected.seed,namua:P.sourceOnly(selected.anchorsP.namua),mtaji:P.sourceOnly(selected.anchorsP.mtaji)},technicalPairEndpoints:pairP,statisticsFixtures:stats};
    const result={schemaVersion:1,...core,deterministicCoreSha256:P.digest(core),stageDisposition:"STAGE0-PASS",freshScientificSeedAccess:false,nextRequiredDecision:"STAGE1-PREACCESS-AUTHORIZATION"};
    fs.mkdirSync(path.dirname(outFile),{recursive:true});fs.writeFileSync(outFile,JSON.stringify(result,null,2)+"\n");
    console.log(`SFCDFT_STAGE0=${JSON.stringify({stageDisposition:result.stageDisposition,deterministicCoreSha256:result.deterministicCoreSha256,elapsedMs:Date.now()-started,policyDistinct,familySupport,selected:{policyId:selected.policyId,familyId:selected.familyId,seed:selected.seed}})}`);
  }catch(error){
    const result={schemaVersion:1,studyId:P.STUDY_ID,stageId:"SFCDFT-S0-TECHNICAL-2026-09-18-v1",stageDisposition:"STAGE0-TECHNICAL-INVALID",freshScientificSeedAccess:false,error:{name:error.name,message:error.message,stack:error.stack}};
    fs.mkdirSync(path.dirname(outFile),{recursive:true});fs.writeFileSync(outFile,JSON.stringify(result,null,2)+"\n");console.error(error.stack||error);process.exitCode=1;
  }
}
main(path.resolve(process.argv[2]||DEFAULT_OUT));
