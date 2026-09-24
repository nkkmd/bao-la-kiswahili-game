#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),{execFileSync}=require("node:child_process");
const E=require("../../public/engine.js");
const P=require("./lib/lgttci-compatibility-production.js"),I=require("./lib/lgttci-compatibility-independent.js");
const SP=require("./lib/silgm-production.js"),SI=require("./lib/silgm-independent.js");
const INF=require("./lib/lwsrt-stage2-inference.js");
const ROOT=path.resolve(__dirname,"../..");
const SPEC=path.join(ROOT,"doc/local-width-search-ranking-transfer/prereg/STUDY_1_SPEC.json");
const FINAL_AUTH=path.join(ROOT,"doc/local-width-search-ranking-transfer/authorizations/STAGE_2_FINAL_AUTHORIZATION.json");
const UPSTREAM_FW=path.join(ROOT,"doc/local-width-search-ranking-transfer/prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const STAGE1_FW_BINDING=path.join(ROOT,"doc/local-width-search-ranking-transfer/prereg/STAGE_1_IDENTITY_FIREWALL_BINDING.json");
const G307S1=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");
const OUT0=path.join(ROOT,"artifacts/local/lwsrt-stage2/STAGE_2_RESULT.json");
const LEASE0=path.join(ROOT,"artifacts/local/lwsrt-stage2/FRESH_ACCESS_LEASE.json");
const STAGE="LWSRT-S2-FORMAL-2026-09-24-v1",ASSIGN="LWSRT-S2-ASSIGN-2026-09-24-v1",SELECT="LWSRT-S2-SELECT-2026-09-24-v1";
const COND={"SC1-DEPTH":[{kind:"exact-depth",depth:2,quiescenceDepth:1},{kind:"exact-depth",depth:3,quiescenceDepth:1}],"SC2-NODE-BUDGET":[{kind:"node-budget",maxDepth:3,nodeBudget:256,quiescenceDepth:1},{kind:"node-budget",maxDepth:3,nodeBudget:1024,quiescenceDepth:1}],"SC3-QUIESCENCE":[{kind:"exact-depth",depth:2,quiescenceDepth:0},{kind:"exact-depth",depth:2,quiescenceDepth:2}]};
function need(x,m){if(!x)throw new Error(m);}
function sha(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function shab(b){return crypto.createHash("sha256").update(b).digest("hex");}
function stable(x){return P.stable(x);}function clone(x){return JSON.parse(JSON.stringify(x));}
function eq(a,b,m){need(stable(a)===I.stable(b),m);}
function canon(x){if(x===null||typeof x!=="object")return JSON.stringify(x);if(Array.isArray(x))return`[${x.map(canon).join(",")}]`;return`{${Object.keys(x).sort().map(k=>`${JSON.stringify(k)}:${canon(x[k])}`).join(",")}}`;}
function setDigest(xs){const a=[...new Set(xs)].sort();return{uniqueCount:a.length,sha256:sha(a.map(x=>`${x}\n`).join("")),set:new Set(a)};}
function rowDigest(rows){return sha(rows.map(canon).sort().map(x=>`${x}\n`).join(""));}
function args(){const o={},a=process.argv.slice(2);for(let i=0;i<a.length;i++)if(a[i].startsWith("--")){const k=a[i].slice(2);o[k]=a[i+1]&&!a[i+1].startsWith("--")?a[++i]:true;}return o;}
function unzip(z,m){return execFileSync("unzip",["-p",z,m],{encoding:"utf8",maxBuffer:128*1024*1024});}
function zlist(z){return execFileSync("unzip",["-Z1",z],{encoding:"utf8",maxBuffer:64*1024*1024}).split(/\r?\n/).filter(Boolean);}
function verifyZip(z,d,l){need(z&&fs.existsSync(z),`${l} artifact ZIP missing`);need(shab(fs.readFileSync(z))===d.replace(/^sha256:/,""),`${l} artifact digest mismatch`);}
function upstreamFirewall(a,f){
  const root=new Set(),traj=new Set(),prefix=new Set(),seed=new Set();
  const s1=JSON.parse(fs.readFileSync(G307S1,"utf8"));need(s1.scientificOutcomeFieldsRetained===false&&s1.identityRows.length===48,"G3-07 Stage1 identity contract mismatch");
  for(const r of s1.identityRows){root.add(r.rootRawSha256);traj.add(r.fullTrajectorySha256);prefix.add(r.openingPrefixSha256);seed.add(r.sourceSeed);}
  const z307=path.resolve(String(a["g3-stage2-zip"]||"")),e307=f.identitySources.g3_07_stage2;verifyZip(z307,e307.artifactDigest,"G3-07 Stage2");
  const j=JSON.parse(unzip(z307,"scientific-result.json")),sel=j?.selection?.core?.selected;need(Array.isArray(sel)&&sel.length===72,"G3-07 Stage2 selected identity count mismatch");
  const rows=sel.map(x=>({seed:x.seed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,fullTrajectorySha256:x.fullTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256}));
  need(rowDigest(rows)===e307.canonicalIdentityRowDigest.replace(/^sha256:/,""),"G3-07 Stage2 row digest mismatch");
  for(const [k,field] of [["rootRawSha256","rootRawSha256"],["fullTrajectorySha256","fullTrajectorySha256"],["openingPrefixSha256","openingPrefixSha256"]]){const g=setDigest(rows.map(r=>r[field])),e=e307.setDigests[k];need(g.uniqueCount===e.uniqueCount&&g.sha256===e.sha256,`G3-07 Stage2 ${k} set digest mismatch`);}
  for(const r of rows){root.add(r.rootRawSha256);traj.add(r.fullTrajectorySha256);prefix.add(r.openingPrefixSha256);seed.add(r.seed);}
  const z401=path.resolve(String(a["g4-stage1r-source-zip"]||"")),e401=f.identitySources.g4_01_stage1r_silgm;verifyZip(z401,e401.artifactDigest,"G4-01 Stage1R source bundle");
  const names=zlist(z401).filter(n=>/^source\/SILGM\/\d+\.json$/.test(n)).sort();need(names.length===768,"G4-01 Stage1R SILGM row count mismatch");
  const r401=names.map(n=>{const x=JSON.parse(unzip(z401,n));return{sourceSeed:x.effectiveSeed,fullTrajectorySha256:x.trajectorySha256,rootRawSha256:x.root?x.root.rawStateSha256:null};});
  need(rowDigest(r401)===e401.canonicalIdentityRowDigest.replace(/^sha256:/,""),"G4-01 Stage1R row digest mismatch");
  const ss=setDigest(r401.map(r=>String(r.sourceSeed))),ts=setDigest(r401.map(r=>r.fullTrajectorySha256)),rs=setDigest(r401.filter(r=>r.rootRawSha256).map(r=>r.rootRawSha256));
  need(ss.uniqueCount===e401.setDigests.sourceSeed.uniqueCount&&ss.sha256===e401.setDigests.sourceSeed.sha256,"G4-01 seed set digest mismatch");
  need(ts.uniqueCount===e401.setDigests.fullTrajectorySha256.uniqueCount&&ts.sha256===e401.setDigests.fullTrajectorySha256.sha256,"G4-01 trajectory set digest mismatch");
  need(rs.uniqueCount===e401.setDigests.rootRawSha256.uniqueCount&&rs.sha256===e401.setDigests.rootRawSha256.sha256,"G4-01 root set digest mismatch");
  for(const r of r401){seed.add(r.sourceSeed);traj.add(r.fullTrajectorySha256);if(r.rootRawSha256)root.add(r.rootRawSha256);}
  for(const [x,y] of [[31710001,31710256],[31720001,31720384],[40112001,40112768],[40212001,40212768],[41212001,41212768]])for(let s=x;s<=y;s++)seed.add(s);
  return{root,traj,prefix,seed,audit:{g3Stage1Rows:48,g3Stage2Rows:72,g4Stage1rRows:768,g4Stage1rTrajectoryUnique:ts.uniqueCount,g4Stage1rRootUnique:rs.uniqueCount,g4Stage1rOpeningPrefixAudited:false}};
}
function addStage1Firewall(fw,a,b){
  need(b.firewallClass==="STAGE1-CANONICAL-ARTIFACT-IDENTITY-ONLY-BINDING"&&b.allowedStage2Use==="IDENTITY-EXCLUSION-ONLY","Stage1 identity firewall binding mismatch");
  const z=path.resolve(String(a["stage1-artifact-zip"]||""));verifyZip(z,b.canonicalStage1Evidence.artifactSha256,"G4-03 Stage1");
  const txt=unzip(z,b.canonicalStage1Evidence.stage1ResultMember);need(sha(txt)===b.canonicalStage1Evidence.stage1ResultSha256,"G4-03 Stage1 result digest mismatch");
  const j=JSON.parse(txt);need(j.studyId==="LWSRT-STUDY1"&&j.stageId==="LWSRT-S1-DEVELOPMENT-2026-09-24-v1"&&j.stageDisposition==="STAGE1-PASS","G4-03 Stage1 result identity mismatch");
  need(j.identityManifestSha256===b.canonicalStage1Evidence.identityManifestSha256&&Array.isArray(j.identityManifest)&&j.identityManifest.length===128,"G4-03 Stage1 identity manifest mismatch");
  const sets={
    sourceSeeds:setDigest(j.identityManifest.map(x=>String(x.sourceSeed))),
    fullTrajectorySha256:setDigest(j.identityManifest.map(x=>x.fullTrajectorySha256)),
    openingPrefixSha256:setDigest(j.identityManifest.map(x=>x.openingPrefixSha256)),
    rootRawSha256:setDigest(j.identityManifest.map(x=>x.rootRawSha256))
  };
  for(const [k,g] of Object.entries(sets)){const e=b.expectedIdentitySetDigests[k];need(g.uniqueCount===e.count&&g.sha256===e.linesSha256,`G4-03 Stage1 ${k} identity set mismatch`);}
  for(const r of j.identityManifest){fw.seed.add(r.sourceSeed);fw.traj.add(r.fullTrajectorySha256);fw.prefix.add(r.openingPrefixSha256);fw.root.add(r.rootRawSha256);}
  fw.audit.stage1IdentityRows=128;fw.audit.stage1IdentityManifestSha256=j.identityManifestSha256;
}
function assign(s){const h=sha(`${ASSIGN}|${s}`);return{policyId:parseInt(h.slice(0,2),16)%2?P.P2:P.P1,familyId:parseInt(h.slice(2,4),16)%2?P.RF2:P.RF1,phase:parseInt(h.slice(4,6),16)%2?"mtaji":"namua"};}
function wc(ph,w){const t=ph==="namua"?4:3;return w<2?"SINGLETON-NON-ESTIMABLE":w<t?"LOW":w===t?"EQUAL":"HIGH";}
function rank(c){return sha([SELECT,c.cell,c.seed,c.fullTrajectorySha256,c.rootRawSha256].join("|"));}
function endpoints(st,pair){
  const pa=SP.conditionResult(st,pair[0]),pb=SP.conditionResult(st,pair[1]),ia=SI.conditionResult(st,pair[0]),ib=SI.conditionResult(st,pair[1]);
  need(stable(pa)===stable(ia)&&stable(pb)===stable(ib),"search condition production/independent mismatch");
  need(pa.estimable&&pb.estimable,"required selected search condition non-estimable");
  const pe=SP.endpoints(pa,pb),ie=SI.endpoints(ia,ib);need(stable(pe)===stable(ie),"search endpoint production/independent mismatch");
  need(Object.prototype.hasOwnProperty.call(pe,"SILGM-E3-RANKING-PREORDER-CHANGE"),"required ranking endpoint missing");
  return Boolean(pe["SILGM-E3-RANKING-PREORDER-CHANGE"]);
}
function ident(c){return{sourceSeed:c.seed,policyId:c.policyId,rootFamilyId:c.familyId,phase:c.phase,widthClass:c.widthClass,rootLegalWidth:c.rootLegalWidth,selectedPly:c.selectedPly,fullTrajectorySha256:c.fullTrajectorySha256,openingPrefixSha256:c.openingPrefixSha256,rootRawSha256:c.rootRawSha256,selectionRank:c.selectionRank};}
function write(f,x){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(x,null,2)+"\n","utf8");}
function testId(c,p,r){return`${c}|${p}|${r}`;}
function main(){
  const a=args(),spec=JSON.parse(fs.readFileSync(SPEC,"utf8")),up=JSON.parse(fs.readFileSync(UPSTREAM_FW,"utf8")),s1fw=JSON.parse(fs.readFileSync(STAGE1_FW_BINDING,"utf8"));
  need(spec.studyId==="LWSRT-STUDY1"&&spec.stage2.seedBlock.start===40322001&&spec.stage2.seedBlock.end===40323536&&spec.stage2.seedBlock.count===1536,"frozen Stage2 spec mismatch");
  need(fs.existsSync(FINAL_AUTH),"Stage2 final one-shot authorization absent");
  const auth=JSON.parse(fs.readFileSync(FINAL_AUTH,"utf8"));
  need(auth.stageId===STAGE&&auth.decision==="LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE","Stage2 final authorization token mismatch");
  need(auth.authorizedScientificExecutions===1&&auth.freshSeedAccessAtAuthorization===0&&auth.rerunAfterFreshAccessAuthorized===false,"Stage2 one-shot authorization boundary mismatch");
  need(a["execute-authorized-once"]===true,"--execute-authorized-once required");
  const fw=upstreamFirewall(a,up);addStage1Firewall(fw,a,s1fw);
  const out=path.resolve(String(a.output||OUT0)),lease=path.resolve(String(a.lease||LEASE0));
  fs.mkdirSync(path.dirname(lease),{recursive:true});const fd=fs.openSync(lease,"wx");
  fs.writeFileSync(fd,JSON.stringify({schemaVersion:1,studyId:"LWSRT-STUDY1",stageId:STAGE,effectiveAuthorization:auth.decision,freshSeedBlock:{start:40322001,end:40323536,count:1536},startedAt:new Date().toISOString()})+"\n");fs.closeSync(fd);
  const t0=process.hrtime.bigint(),cand=[],rej={UPSTREAM_OR_STAGE1_TRAJECTORY:0,UPSTREAM_OR_STAGE1_PREFIX:0,UPSTREAM_OR_STAGE1_ROOT:0,ANCHOR_UNAVAILABLE:0,WIDTH_EQUAL:0,WIDTH_LT2:0};
  for(let s=40322001;s<=40323536;s++){
    need(!fw.seed.has(s),`fresh seed collides excluded namespace ${s}`);const as=assign(s),x=P.replay(E,as.policyId,s,80),y=I.replay(E,as.policyId,s,80);eq(x,y,`source replay mismatch seed ${s}`);
    const tr=x.trajectorySha256,pr=sha(x.moveKeys.slice(0,16).join("\n"));if(fw.traj.has(tr)){rej.UPSTREAM_OR_STAGE1_TRAJECTORY++;continue;}if(fw.prefix.has(pr)){rej.UPSTREAM_OR_STAGE1_PREFIX++;continue;}
    const aa=P.selectAnchors(x.rows,as.familyId),bb=I.selectAnchors(y.rows,as.familyId);eq(aa,bb,`anchor mismatch seed ${s}`);const r=as.phase==="namua"?aa.namua:aa.mtaji;if(!r){rej.ANCHOR_UNAVAILABLE++;continue;}
    if(fw.root.has(r.rawStateSha256)){rej.UPSTREAM_OR_STAGE1_ROOT++;continue;}const w=wc(as.phase,r.rootLegalWidth);if(w==="EQUAL"){rej.WIDTH_EQUAL++;continue;}if(w==="SINGLETON-NON-ESTIMABLE"){rej.WIDTH_LT2++;continue;}
    const c={seed:s,...as,widthClass:w,rootLegalWidth:r.rootLegalWidth,selectedPly:r.ply,fullTrajectorySha256:tr,openingPrefixSha256:pr,rootRawSha256:r.rawStateSha256,rootState:clone(r.state)};
    c.cell=`${c.policyId}|${c.familyId}|${c.phase}|${c.widthClass}`;c.selectionRank=rank(c);cand.push(c);
  }
  const prov=[],support={};for(const p of[P.P1,P.P2])for(const r of[P.RF1,P.RF2])for(const ph of["namua","mtaji"])for(const w of["HIGH","LOW"]){
    const cell=`${p}|${r}|${ph}|${w}`,pool=cand.filter(c=>c.cell===cell).sort((a,b)=>a.selectionRank.localeCompare(b.selectionRank)||a.seed-b.seed),take=pool.slice(0,12);
    prov.push(...take);support[cell]={firewallCleanEligiblePool:pool.length,provisionalSelected:take.length,selectedAfterRawDedup:0,target:12};
  }
  const byRaw=new Map();for(const c of prov){const q=byRaw.get(c.rootRawSha256);if(!q||c.selectionRank.localeCompare(q.selectionRank)<0)byRaw.set(c.rootRawSha256,c);}
  const selected=[...byRaw.values()].sort((a,b)=>a.cell.localeCompare(b.cell)||a.selectionRank.localeCompare(b.selectionRank)||a.seed-b.seed);for(const c of selected)support[c.cell].selectedAfterRawDedup++;
  const endpointRows=[];for(const c of selected){const row={...ident(c),endpoints:{}};for(const[k,pair]of Object.entries(COND))row.endpoints[k]=endpoints(c.rootState,pair);endpointRows.push(row);}
  const tests=[];for(const contrast of Object.keys(COND))for(const p of[P.P1,P.P2])for(const r of[P.RF1,P.RF2]){
    const id=testId(contrast,p,r),cells={};
    for(const ph of["namua","mtaji"])for(const w of["HIGH","LOW"])cells[`${ph}|${w}`]=endpointRows.filter(x=>x.policyId===p&&x.rootFamilyId===r&&x.phase===ph&&x.widthClass===w);
    const cellComplete=Object.values(cells).every(xs=>xs.length===12);
    if(!cellComplete){tests.push({testId:id,contrast,policyId:p,rootFamilyId:r,estimable:false,decision:"NON-ESTIMABLE",reason:"SELECTION-SUPPORT",pForHolm:1});continue;}
    const counts={};for(const ph of["namua","mtaji"]){counts[ph]={highChanged:cells[`${ph}|HIGH`].filter(x=>x.endpoints[contrast]).length,lowChanged:cells[`${ph}|LOW`].filter(x=>x.endpoints[contrast]).length};}
    const ex=INF.exactStratifiedTest(counts.namua,counts.mtaji);
    tests.push({testId:id,contrast,policyId:p,rootFamilyId:r,counts,...ex,pForHolm:ex.estimable?ex.pTwoSided:1});
  }
  const holm=INF.holm12(tests.map(x=>({testId:x.testId,pTwoSided:x.pForHolm}))),hm=new Map(holm.map(x=>[x.testId,x]));
  for(const t of tests){const h=hm.get(t.testId);t.holmRank=h.holmRank;t.holmCutoff=h.holmCutoff;t.holmAdjustedP=h.holmAdjustedP;t.holmSignificant=t.estimable&&h.holmSignificant;t.decision=INF.formalDecision({...t,holmSignificant:t.holmSignificant});delete t.pForHolm;}
  const identities=selected.map(ident),allCellsComplete=Object.values(support).every(x=>x.selectedAfterRawDedup===12),nonEstimable=tests.filter(x=>!x.estimable).length;
  const stageDisposition=allCellsComplete&&nonEstimable===0?"STAGE2-COMPLETE":"STAGE2-COMPLETE-WITH-NON-ESTIMABLE",elapsedMs=Number(process.hrtime.bigint()-t0)/1e6;
  write(out,{schemaVersion:1,studyId:"LWSRT-STUDY1",stageId:STAGE,evidenceClass:"FRESH-FORMAL-HELDOUT",stageDisposition,seedBlock:{start:40322001,end:40323536,count:1536},scientificSeedsRead:1536,authorizedScientificExecutions:1,actualScientificExecutions:1,assignmentNamespace:ASSIGN,selectionNamespace:SELECT,support,rejectionCounts:rej,selectedRoots:selected.length,productionIndependentExact:true,identityManifestSha256:P.digest(identities),identityManifest:identities,formalTests:tests,holmFamily:{tests:12,alpha:1/20,nonEstimableSlotsRetainedWithConservativeP1ForMultiplicity:nonEstimable},firewallAudit:fw.audit,resourceReadiness:{elapsedMs,peakRssBytes:process.memoryUsage().rss},protectedDepth10Access:false,g4_10Depth11Access:false,thresholdRelearningPerformed:false,seedExtensionPerformed:false,rootReplacementPerformed:false});
  console.log(JSON.stringify({event:"LWSRT-STAGE2-COMPLETE",stageDisposition,selectedRoots:selected.length,nonEstimableTests:nonEstimable,output:out}));
}
try{main();}catch(e){
  const m=String(e&&e.stack||e);process.stderr.write(m+"\n");
  try{
    const a=args(),lease=path.resolve(String(a.lease||LEASE0)),out=path.resolve(String(a.output||OUT0));
    if(fs.existsSync(lease)&&!fs.existsSync(out))write(out,{schemaVersion:1,studyId:"LWSRT-STUDY1",stageId:STAGE,evidenceClass:"FRESH-FORMAL-HELDOUT",stageDisposition:"STAGE2-TECHNICAL-INVALID",scientificExecutionStarted:true,rerunAuthorized:false,error:m,protectedDepth10Access:false,g4_10Depth11Access:false});
  }catch(_){}
  process.exit(1);
}
