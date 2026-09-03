#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/continuous-local-geometry-representation");
const AUTH_PATH="doc/continuous-local-geometry-representation/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json";
const TRIGGER_PATH="doc/continuous-local-geometry-representation/authorizations/clgr-stage1-development-v1-trigger.json";
const PREAUTH_PATH="doc/continuous-local-geometry-representation/results/stage-1-preauthorization-v1/PREAUTH_AUDIT_RESULT.json";
const AUTH=path.join(ROOT,AUTH_PATH),TRIGGER=path.join(ROOT,TRIGGER_PATH),PREAUTH=path.join(ROOT,PREAUTH_PATH);
function need(x,m){if(!x)throw new Error(m);}function git(...a){return cp.execFileSync("git",a,{cwd:ROOT,encoding:"utf8"}).trim();}function json(p){return JSON.parse(fs.readFileSync(p,"utf8"));}function shaFile(p){return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");}function lines(s){return s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}
need(process.env.GITHUB_EVENT_NAME==="push","Stage1 scientific workflow must be push-triggered");
need(process.env.GITHUB_RUN_ATTEMPT==="1","Stage1 rerun attempt prohibited");
need(process.env.GITHUB_REF_NAME==="research/g3-09-continuous-local-geometry-representation","unexpected branch");
need(fs.existsSync(AUTH)&&fs.existsSync(TRIGGER)&&fs.existsSync(PREAUTH),"authorization/trigger/preauth artifact missing");
const a=json(AUTH),t=json(TRIGGER),pre=json(PREAUTH),spec=json(path.join(DOC,"prereg/STAGE_1_DEVELOPMENT_SPEC.json")),study=json(path.join(DOC,"prereg/STUDY_1_SPEC.json"));
need(a.studyId==="CLGR-STUDY1"&&a.stageId==="CLGR-S1-DEVELOPMENT-2026-09-03-v1","authorization identity mismatch");
need(a.authorizationDecision==="STAGE1-AUTHORIZED","Stage1 authorization absent");
need(a.maxAuthorizedScientificExecutions===1&&a.sameEvidenceRerunAuthorized===false&&a.seedExtensionAuthorized===false&&a.rootReplacementAuthorized===false,"execution/no-rescue contract invalid");
need(a.seedStart===31910001&&a.seedEnd===31910256,"authorized seed block mismatch");
need(a.stage2Authorized===false&&a.protectedDepth10AccessAuthorized===false&&a.technicalSeedScientificUseAuthorized===false,"downstream/protected boundary invalid");
need(a.expectedPreauthorizationAuditSha256===shaFile(PREAUTH),"preauthorization exact-byte binding mismatch");
need(pre.auditDisposition==="STAGE1-PREAUTH-STATIC-AUDIT-PASS"&&pre.freshStage1SeedAccess===false&&pre.stage2SeedAccess===false&&pre.protectedDepth10Access===false&&pre.noRescueBoundaryCrossed===false,"preauthorization boundary invalid");
need(spec.seedStart===a.seedStart&&spec.seedEnd===a.seedEnd&&spec.seedExtension===false&&spec.maxAuthorizedScientificExecutions===1,"spec/authorization mismatch");
need(spec.generationAuthorizedAtFreeze===false&&spec.stage2AutomaticallyAuthorized===false,"frozen gate mismatch");
need(study.representationFamily.id==="CLGR-R1-EXACT-SQUASHED-L1"&&study.representationFamily.onlyPrimaryFamily===true,"representation family mismatch");
const authCommit=git("rev-parse","HEAD^"),head=git("rev-parse","HEAD");
need(t.authorizationCommit===authCommit&&t.authorizationNonce===a.authorizationNonce,"trigger authorization binding mismatch");
need(t.expectedPreauthorizationAuditSha256===a.expectedPreauthorizationAuditSha256,"trigger preauth binding mismatch");
const trigDiff=lines(git("diff-tree","--no-commit-id","--name-only","-r","HEAD"));need(trigDiff.length===1&&trigDiff[0]===TRIGGER_PATH,"trigger commit must change only trigger artifact");
const authDiff=lines(git("diff-tree","--no-commit-id","--name-only","-r","HEAD^"));need(authDiff.length===1&&authDiff[0]===AUTH_PATH,"authorization commit must change only authorization artifact");
for(const [p,blob] of Object.entries(a.boundGitBlobs||{})){const got=git("rev-parse",`HEAD:${p}`);need(got===blob,`bound blob mismatch ${p}: ${got} != ${blob}`);}
const runner=fs.readFileSync(path.join(ROOT,"tools/experiments/run-clgr-stage1-development.js"),"utf8"),prod=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-stage1-production.js"),"utf8"),ind=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/clgr-stage1-independent.js"),"utf8");
need(!runner.includes("doc/local-geometry-persistence-memory-length/results/stage-1")&&!runner.includes("local-geometry-persistence-memory-length/results/stage-1"),"runner references prohibited G3-08 partial scientific results");
need(!runner.includes("31920001")&&!runner.includes("31920384"),"runner contains Stage2 seed literals");
need(prod.includes("./clgr-production.js")&&!prod.includes("clgr-independent.js")&&!prod.includes("lgtgmiv-stage1-independent.js"),"production separation invalid");
need(ind.includes("./clgr-independent.js")&&!ind.includes("clgr-production.js")&&!ind.includes("lgtgmiv-stage1-production.js"),"independent separation invalid");
need(prod!==ind,"production and independent sources identical");
console.log(JSON.stringify({authorizationVerified:true,studyId:a.studyId,stageId:a.stageId,head,authorizationCommit:authCommit,authorizationNonce:a.authorizationNonce,seedBlock:`${a.seedStart}..${a.seedEnd}`,maxAuthorizedScientificExecutions:1,freshStage1SeedAccessBeforeRunner:false,stage2Authorized:false,protectedDepth10AccessAuthorized:false,runAttempt:process.env.GITHUB_RUN_ATTEMPT}));
