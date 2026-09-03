#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../.."),DOC=path.join(ROOT,"doc/continuous-local-geometry-representation");
function need(x,m){if(!x)throw new Error(m);}function json(p){return JSON.parse(fs.readFileSync(p,"utf8"));}function git(...a){return cp.execFileSync("git",a,{cwd:ROOT,encoding:"utf8"}).trim();}function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}function sha(x){return crypto.createHash("sha256").update(typeof x==="string"?x:canon(x),"utf8").digest("hex");}
const study=json(path.join(DOC,"prereg/STUDY_1_SPEC.json")),spec=json(path.join(DOC,"prereg/STAGE_1_DEVELOPMENT_SPEC.json")),sel=json(path.join(DOC,"prereg/STAGE_1_SELECTION_CONTRACT.json")),s0=json(path.join(DOC,"results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json")),fw=json(path.join(ROOT,"doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json"));
need(study.studyId==="CLGR-STUDY1"&&spec.stageId==="CLGR-S1-DEVELOPMENT-2026-09-03-v1","identity mismatch");
need(study.representationFamily.id==="CLGR-R1-EXACT-SQUASHED-L1"&&study.representationFamily.onlyPrimaryFamily===true,"representation family not frozen");
need(study.representationFamily.pca===false&&study.representationFamily.clustering===false&&study.representationFamily.learnedWeights===false&&study.representationFamily.phaseSpecificScaling===false,"data-dependent representation enabled");
need(s0.stageDisposition==="STAGE0-PASS"&&s0.stageId==="CLGR-S0-TECHNICAL-2026-09-03-v2","Stage0 PASS prerequisite missing");
need(s0.freshScientificSeedAccess===false&&s0.stage1SeedAccess===false&&s0.stage2SeedAccess===false&&s0.protectedDepth10Access===false,"Stage0 evidence boundary invalid");
need(spec.generationAuthorizedAtFreeze===false&&spec.sameEvidenceRerun===false&&spec.seedExtension===false&&spec.maxAuthorizedScientificExecutions===1,"Stage1 frozen authorization/no-rescue contract invalid");
need(spec.seedStart===31910001&&spec.seedEnd===31910256&&spec.targetNamua===24&&spec.targetMtaji===24&&spec.targetTotal===48,"Stage1 population/seed mismatch");
need(sel.freshEvidenceAccessAtFreeze===false&&sel.seedStart===spec.seedStart&&sel.seedEnd===spec.seedEnd,"selection freeze boundary invalid");
need(Array.isArray(sel.prohibitedSelectionInputs)&&sel.prohibitedSelectionInputs.includes("local geometry measurement")&&sel.prohibitedSelectionInputs.includes("G3-08 partial scientific measurement")&&sel.prohibitedSelectionInputs.includes("resource size of bounded root reconstruction"),"selection prohibited-input firewall incomplete");
need(fw.scientificOutcomeFieldsRetained===false&&fw.g307ScientificOutcomeFieldsRetained===false,"upstream firewall retains scientific outcome");
need(study.protectedDepth10==="SEALED / NOT GENERATED / NOT READ / NOT PEEKED"&&spec.protectedDepth10==="SEALED / NOT GENERATED / NOT READ / NOT PEEKED","protected holdout boundary invalid");
const files={
  "public/engine.js":null,
  "tools/experiments/lib/lgtgmiv-stage1-production.js":null,
  "tools/experiments/lib/lgtgmiv-stage1-independent.js":null,
  "tools/experiments/lib/clgr-production.js":null,
  "tools/experiments/lib/clgr-independent.js":null,
  "tools/experiments/lib/clgr-stage1-production.js":null,
  "tools/experiments/lib/clgr-stage1-independent.js":null,
  "tools/experiments/run-clgr-stage1-development.js":null,
  "tools/experiments/verify-clgr-stage1-authorization.js":null,
  ".github/workflows/clgr-stage1-development-v1.yml":null,
  "doc/continuous-local-geometry-representation/prereg/STUDY_1_SPEC.json":null,
  "doc/continuous-local-geometry-representation/prereg/STAGE_1_DEVELOPMENT_SPEC.json":null,
  "doc/continuous-local-geometry-representation/prereg/STAGE_1_SELECTION_CONTRACT.json":null,
  "doc/continuous-local-geometry-representation/results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json":null,
  "doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json":null
};
for(const p of Object.keys(files))files[p]=git("rev-parse",`HEAD:${p}`);
const prod=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-stage1-production.js"),"utf8"),ind=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-stage1-independent.js"),"utf8"),cp=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-production.js"),"utf8"),ci=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-independent.js"),"utf8"),runner=fs.readFileSync(path.join(ROOT,"tools/experiments/run-clgr-stage1-development.js"),"utf8"),workflow=fs.readFileSync(path.join(ROOT,".github/workflows/clgr-stage1-development-v1.yml"),"utf8");
need(prod.includes("./clgr-production.js")&&!prod.includes("clgr-independent.js")&&!prod.includes("lgtgmiv-stage1-independent.js"),"Stage1 production aliases independent");
need(ind.includes("./clgr-independent.js")&&!ind.includes("clgr-production.js")&&!ind.includes("lgtgmiv-stage1-production.js"),"Stage1 independent aliases production");
need(cp.includes("./lgtgmiv-stage1-production.js")&&!cp.includes("lgtgmiv-stage1-independent.js"),"CLGR production upstream separation invalid");
need(ci.includes("./lgtgmiv-stage1-independent.js")&&!ci.includes("lgtgmiv-stage1-production.js"),"CLGR independent upstream separation invalid");
need(runner.includes("doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json")&&!runner.includes("local-geometry-persistence-memory-length/results/stage-1"),"runner G3-08 firewall/result boundary invalid");
need(runner.indexOf("P.selectRoots")>=0&&runner.indexOf("P.measureRoot")>runner.indexOf("P.selectRoots"),"measurement may precede selection");
need(!runner.includes("31920001")&&!runner.includes("31920384"),"Stage2 seed literal in Stage1 runner");
need(workflow.includes("clgr-stage1-development-v1-trigger.json")&&!workflow.includes("workflow_dispatch")&&workflow.includes("permissions:\n  contents: read")&&workflow.includes("Verify exact Stage 1 authorization and source binding")&&workflow.indexOf("Upload Stage 1 lease before scientific computation")<workflow.indexOf("Execute exactly one authorized fresh Stage 1 computation"),"scientific workflow gate/order invalid");
const sciAuth=path.join(DOC,"authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json"),sciTrigger=path.join(DOC,"authorizations/clgr-stage1-development-v1-trigger.json");need(!fs.existsSync(sciAuth)&&!fs.existsSync(sciTrigger),"Stage1 scientific execution already armed during preauth audit");
const core={schemaVersion:1,studyId:"CLGR-STUDY1",stageId:spec.stageId,auditClass:"FRESH-FREE-STATIC-PREAUTHORIZATION",stage0Disposition:s0.stageDisposition,representationId:study.representationFamily.id,stage1SeedBlock:`${spec.seedStart}..${spec.seedEnd}`,targetPopulation:{namua:spec.targetNamua,mtaji:spec.targetMtaji,total:spec.targetTotal},sourceBindings:files,checks:{studyFreeze:true,stage0Pass:true,stage0FreshBoundary:true,selectionOutcomeBlind:true,upstreamIdentityOnly:true,productionIndependentSeparation:true,scientificWorkflowUnarmed:true,durableLeaseBeforeComputation:true,resultBeforeMirror:true,noSameEvidenceRerun:true,stage2NotAuthorized:true,protectedDepth10Sealed:true},freshStage1SeedAccess:false,stage2SeedAccess:false,protectedDepth10Access:false,noRescueBoundaryCrossed:false};
const result={...core,deterministicCoreSha256:sha(core),auditDisposition:"STAGE1-PREAUTH-STATIC-AUDIT-PASS"};
const arg=process.argv.indexOf("--output"),out=arg>=0?process.argv[arg+1]:path.join(ROOT,"artifacts/local/continuous-local-geometry-representation/stage1-preauth-v1/PREAUTH_AUDIT_RESULT.json");fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");console.log(`CLGR_STAGE1_PREAUTH_RESULT=${JSON.stringify(result)}`);
