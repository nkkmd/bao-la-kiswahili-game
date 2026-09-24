#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),{execFileSync}=require("node:child_process");
const INF=require("./lib/lwsrt-stage2-inference.js");
const ROOT=path.resolve(__dirname,"../..");
const SPEC=path.join(ROOT,"doc/local-width-search-ranking-transfer/prereg/STUDY_1_SPEC.json");
const PROTOCOL=path.join(ROOT,"doc/local-width-search-ranking-transfer/STUDY_1_PROTOCOL.md");
const RECEIPT=path.join(ROOT,"doc/local-width-search-ranking-transfer/results/stage-1/STAGE_1_ARTIFACT_RECEIPT.json");
const FIREWALL_BINDING=path.join(ROOT,"doc/local-width-search-ranking-transfer/prereg/STAGE_1_IDENTITY_FIREWALL_BINDING.json");
const STAGE2_RUNNER=path.join(ROOT,"tools/experiments/run-lwsrt-stage2-formal.js");
function need(x,m){if(!x)throw new Error(m);}
function shaText(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function shaBytes(b){return crypto.createHash("sha256").update(b).digest("hex");}
function args(){const o={},a=process.argv.slice(2);for(let i=0;i<a.length;i++)if(a[i].startsWith("--")){const k=a[i].slice(2);o[k]=a[i+1]&&!a[i+1].startsWith("--")?a[++i]:true;}return o;}
function unzip(z,m){return execFileSync("unzip",["-p",z,m],{encoding:"utf8",maxBuffer:128*1024*1024});}
function linesSha(values){return shaText(values.map(x=>`${x}\n`).join(""));}
function close(a,b,t=1e-12){return Math.abs(a-b)<=t;}
function sortedUnique(values){return [...new Set(values)].sort();}
function checkFirewall(a){
  const b=JSON.parse(fs.readFileSync(FIREWALL_BINDING,"utf8")),r=JSON.parse(fs.readFileSync(RECEIPT,"utf8"));
  need(b.studyId==="LWSRT-STUDY1"&&b.sourceStageId==="LWSRT-S1-DEVELOPMENT-2026-09-24-v1"&&b.targetStageId==="LWSRT-S2-FORMAL-2026-09-24-v1","Stage1 firewall binding identity mismatch");
  need(b.firewallClass==="STAGE1-CANONICAL-ARTIFACT-IDENTITY-ONLY-BINDING"&&b.allowedStage2Use==="IDENTITY-EXCLUSION-ONLY","Stage1 firewall binding class mismatch");
  need(b.stage1ScientificReplayAuthorized===false&&b.stage2FreshSeedAccessDuringBinding===false,"Stage1 firewall boundary mismatch");
  const c=b.canonicalStage1Evidence;
  need(c.artifactSha256===r.canonicalExecution.artifactSha256&&c.stage1ResultSha256===r.canonicalExecution.fullResultSha256&&c.identityManifestSha256===r.resultCore.identityManifestSha256,"Stage1 receipt/firewall binding mismatch");
  const z=path.resolve(String(a["stage1-artifact-zip"]||""));need(z&&fs.existsSync(z),"--stage1-artifact-zip required");
  need(shaBytes(fs.readFileSync(z))===c.artifactSha256,"Stage1 artifact digest mismatch");
  const txt=unzip(z,c.stage1ResultMember);need(shaText(txt)===c.stage1ResultSha256,"Stage1 result member digest mismatch");
  const j=JSON.parse(txt);need(j.studyId==="LWSRT-STUDY1"&&j.stageId==="LWSRT-S1-DEVELOPMENT-2026-09-24-v1"&&j.stageDisposition==="STAGE1-PASS","Stage1 result identity/disposition mismatch");
  need(j.identityManifestSha256===c.identityManifestSha256&&Array.isArray(j.identityManifest)&&j.identityManifest.length===c.identityRows,"Stage1 identity manifest mismatch");
  const actual={
    sourceSeeds:sortedUnique(j.identityManifest.map(x=>String(x.sourceSeed))),
    fullTrajectorySha256:sortedUnique(j.identityManifest.map(x=>x.fullTrajectorySha256)),
    openingPrefixSha256:sortedUnique(j.identityManifest.map(x=>x.openingPrefixSha256)),
    rootRawSha256:sortedUnique(j.identityManifest.map(x=>x.rootRawSha256))
  };
  for(const [k,vals] of Object.entries(actual)){const e=b.expectedIdentitySetDigests[k];need(vals.length===e.count&&linesSha(vals)===e.linesSha256,`${k} Stage1 identity set mismatch`);}
  need(j.formalInferencePerformed===false&&j.pValuesComputed===false&&j.riskDifferencesComputed===false&&j.effectDirectionSummarized===false,"Stage1 scientific outcome boundary mismatch");
  return {identityRows:128,sourceSeedDigest:b.expectedIdentitySetDigests.sourceSeeds.linesSha256,rootDigest:b.expectedIdentitySetDigests.rootRawSha256.linesSha256};
}
function checkSpecAndRunner(){
  const s=JSON.parse(fs.readFileSync(SPEC,"utf8")),p=fs.readFileSync(PROTOCOL,"utf8"),runner=fs.readFileSync(STAGE2_RUNNER,"utf8");
  need(s.studyId==="LWSRT-STUDY1","spec study mismatch");
  need(s.stage2&&s.stage2.seedBlock.start===40322001&&s.stage2.seedBlock.end===40323536&&s.stage2.seedBlock.count===1536,"Stage2 seed block mismatch");
  need(p.includes("LWSRT-S2-FORMAL-2026-09-24-v1")&&p.includes("40322001..40323536 / 1536"),"protocol Stage2 freeze mismatch");
  need(runner.includes('const STAGE="LWSRT-S2-FORMAL-2026-09-24-v1"'),"Stage2 runner identity mismatch");
  need(runner.includes('ASSIGN="LWSRT-S2-ASSIGN-2026-09-24-v1"')&&runner.includes('SELECT="LWSRT-S2-SELECT-2026-09-24-v1"'),"Stage2 namespace mismatch");
  need(!runner.includes("LWSRT-S1-ASSIGN-2026-09-24-v1")&&!runner.includes("LWSRT-S1-SELECT-2026-09-24-v1"),"Stage1 namespace leaked into Stage2 runner");
  need(runner.includes("--execute-authorized-once"),"Stage2 execution guard missing");
  return {seedBlock:"40322001..40323536",freshSeedAccess:false};
}
function checkInference(){
  const z=INF.exactStratifiedTest({highChanged:6,lowChanged:6},{highChanged:6,lowChanged:6});
  need(z.estimable&&z.direction==="ZERO-DIRECTION"&&close(z.pTwoSided,1),"zero-direction fixture mismatch");
  const h=INF.exactStratifiedTest({highChanged:8,lowChanged:4},{highChanged:8,lowChanged:4});
  need(h.estimable&&h.direction==="HIGHER-IN-HIGH"&&close(h.riskDifference,1/3)&&close(h.pTwoSided,0.04457973996974698,1e-14),"higher fixture mismatch");
  const l=INF.exactStratifiedTest({highChanged:4,lowChanged:8},{highChanged:4,lowChanged:8});
  need(l.estimable&&l.direction==="LOWER-IN-HIGH"&&close(l.riskDifference,-1/3)&&close(l.pTwoSided,0.04457973996974698,1e-14),"lower fixture mismatch");
  const n=INF.exactStratifiedTest({highChanged:3,lowChanged:2},{highChanged:6,lowChanged:6});
  need(!n.estimable&&n.decision==="NON-ESTIMABLE","support fixture mismatch");
  const ps=[.001,.002,.003,.004,.005,.006,.01,.02,.03,.04,.05,.5];
  const family=INF.holm12(ps.map((p,i)=>({testId:`T${String(i+1).padStart(2,"0")}`,pTwoSided:p})));
  need(family.filter(x=>x.holmSignificant).length===6,"Holm fixture significance mismatch");
  need(INF.formalDecision({...h,holmSignificant:true})==="GENERALIZATION-CONFIRMED","generalization decision fixture mismatch");
  need(INF.formalDecision({...l,holmSignificant:true})==="COUNTEREXAMPLE-CONFIRMED","counterexample decision fixture mismatch");
  need(INF.formalDecision({...h,holmSignificant:false})==="NOT-GENERALIZED","nonsignificant decision fixture mismatch");
  need(INF.formalDecision(n)==="NON-ESTIMABLE","non-estimable decision fixture mismatch");
  return {exactFixtureP:h.pTwoSided,holmSignificantFixtureCount:6};
}
function main(){
  const a=args(),firewall=checkFirewall(a),contract=checkSpecAndRunner(),inference=checkInference();
  const result={schemaVersion:1,studyId:"LWSRT-STUDY1",stageId:"LWSRT-S2-FORMAL-2026-09-24-v1",
    preflightDisposition:"PASS",freshScientificSeedAccess:false,stage2ScientificExecutionStarted:false,
    stage1ScientificReplay:false,protectedDepth10Access:false,g4_10Depth11Access:false,
    firewall,contract,inference,checkedAt:new Date().toISOString()};
  if(a.output){const f=path.resolve(String(a.output));fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(result,null,2)+"\n","utf8");}
  process.stdout.write(JSON.stringify({event:"LWSRT-STAGE2-PREFLIGHT-PASS",freshScientificSeedAccess:false,identityRows:firewall.identityRows})+"\n");
}
try{main();}catch(e){process.stderr.write(String(e&&e.stack||e)+"\n");process.exit(1);}
