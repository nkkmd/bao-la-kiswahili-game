#!/usr/bin/env node
"use strict";
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(process.cwd());
const SPEC_PATH='doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json';
const STAGE0_PATH='doc/structural-forcing-corridor-tree-raw-transfer/results/stage-0-study2/STUDY_2_STAGE_0_TECHNICAL_RESULT.json';
const BINDING_PATH='doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_2_STAGE_1_PRE_EXECUTION_BINDING.json';
const AUTH_PATH='doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_2_STAGE_1_EXECUTION_AUTHORIZATION.json';
function need(x,m){if(!x)throw new Error(m);}function read(rel){return JSON.parse(fs.readFileSync(path.join(ROOT,rel),'utf8'));}function blob(rel){const b=fs.readFileSync(path.join(ROOT,rel)),h=Buffer.from(`blob ${b.length}\0`);return crypto.createHash('sha1').update(h).update(b).digest('hex');}
function main(){
  need(fs.existsSync(path.join(ROOT,AUTH_PATH)),'Study2 final Stage 1 execution authorization missing');
  const spec=read(SPEC_PATH),s0=read(STAGE0_PATH),binding=read(BINDING_PATH),auth=read(AUTH_PATH);
  need(spec.studyId==='SFCDFT-STUDY2'&&spec.stageId==='SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1','Study2 Stage1 spec identity mismatch');
  need(s0.studyId==='SFCDFT-STUDY2'&&s0.decision==='STAGE0-PASS'&&s0.deterministicCoreSha256===spec.prerequisiteStage0.deterministicCoreSha256,'Study2 Stage0 prerequisite mismatch');
  need(binding.studyId===spec.studyId&&binding.stageId===spec.stageId&&binding.status==='FROZEN-PRE-EXECUTION','Study2 pre-execution binding mismatch');
  need(auth.studyId===spec.studyId&&auth.stageId===spec.stageId&&auth.decision==='SFCDFT2-STAGE1-EXECUTION-AUTHORIZED','Study2 final authorization mismatch');
  need(typeof auth.authorizedParentHead==='string'&&/^[0-9a-f]{40}$/.test(auth.authorizedParentHead),'authorized parent HEAD missing/invalid');
  if(process.env.GITHUB_ACTIONS==='true'){
    need(process.env.GITHUB_EVENT_PATH&&fs.existsSync(process.env.GITHUB_EVENT_PATH),'GitHub push event payload missing');
    const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
    need(typeof event.before==='string'&&event.before===auth.authorizedParentHead,`authorized parent HEAD mismatch: event.before=${event.before} authorized=${auth.authorizedParentHead}`);
    need(process.env.GITHUB_RUN_ATTEMPT==='1','Study2 Stage1 run attempt >1 is forbidden');
  }
  need(auth.freshScientificSeedAccessAuthorized===true,'Study2 fresh Stage1 access not authorized');
  need(auth.stage2ScientificSeedAccessAuthorized===false,'Study2 Stage2 must remain sealed');
  need(auth.preExecutionBindingGitBlobSha===blob(BINDING_PATH),'Study2 authorization/binding blob mismatch');
  for(const [rel,expected] of Object.entries(binding.boundGitBlobs)){
    need(fs.existsSync(path.join(ROOT,rel)),`bound file missing ${rel}`);
    need(blob(rel)===expected,`bound blob mismatch ${rel}`);
  }
  const p=spec.freshSeedSlots.primary,r=spec.freshSeedSlots.pairedReserve;
  need(p.seedStart===40411001&&p.seedEnd===40411384&&p.count===384,'Study2 primary seed namespace mismatch');
  need(r.seedStart===41411001&&r.seedEnd===41411384&&r.count===384,'Study2 reserve seed namespace mismatch');
  need(spec.freshSeedSlots.maxFreshSeedReads===400&&spec.freshSeedSlots.maxInfrastructureReplacements===16,'Study2 fresh access ceiling mismatch');
  need(auth.maxFreshSeedReads===400&&auth.maxInfrastructureReplacements===16,'Study2 authorization fresh access ceiling mismatch');
  need(auth.effectDirectionAuthorized===false&&auth.pValueAuthorized===false&&auth.scientificEffectMagnitudeAuthorized===false,'Study2 Stage1 compatibility-only boundary mismatch');
  need(auth.generalizationDecisionAuthorized===false&&auth.counterexampleDecisionAuthorized===false,'Study2 formal decision boundary mismatch');
  need(auth.fullFreshWorkflowRerunAuthorized===false&&auth.sameEvidenceRepairRerunAuthorized===false&&auth.manualWorkflowDispatchAuthorized===false&&auth.runAttemptGreaterThanOneAuthorized===false,'Study2 no-rerun boundary mismatch');
  need(auth.requiredPreflight&&auth.requiredPreflight.conclusion==='success'&&Number.isInteger(auth.requiredPreflight.runId)&&Number.isInteger(auth.requiredPreflight.artifactId),'Study2 successful preflight binding missing');
  process.stdout.write(JSON.stringify({authorized:true,studyId:spec.studyId,stageId:spec.stageId,authorizedParentHead:auth.authorizedParentHead,boundFileCount:Object.keys(binding.boundGitBlobs).length,preflightRunId:auth.requiredPreflight.runId})+'\n');
}
main();
