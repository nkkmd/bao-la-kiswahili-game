#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/sfcdft2-production.js");
const I = require("./lib/sfcdft2-independent.js");
const LP = require("./lib/lgttci-compatibility-production.js");
const LI = require("./lib/lgttci-compatibility-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_2_STAGE_1_EXECUTION_AUTHORIZATION.json");
const STAGE_ID = "SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1";

function need(x,m){if(!x)throw new Error(m);}
function parseArgs(){const a=process.argv.slice(2),o={};for(let i=0;i<a.length;i++)if(a[i].startsWith('--'))o[a[i].slice(2)]=a[i+1]&&!a[i+1].startsWith('--')?a[++i]:true;return o;}
function clone(x){return JSON.parse(JSON.stringify(x));}
function exact(a,b,label){need(P.canonical(a)===I.canonical(b),`${label} production/independent mismatch`);}
function atomicWrite(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=`${file}.tmp-${process.pid}`;fs.writeFileSync(tmp,JSON.stringify(value)+'\n','utf8');fs.renameSync(tmp,file);}
function stripRoot(row){if(!row)return null;return{ply:row.ply,phase:row.phase,rootLegalWidth:row.rootLegalWidth,rawStateSha256:row.rawStateSha256,state:clone(row.state)};}
function gitBlobSha(file){const body=fs.readFileSync(file),header=Buffer.from(`blob ${body.length}\0`,'utf8');return crypto.createHash('sha1').update(header).update(body).digest('hex');}

function main(){
  const args=parseArgs();
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,'utf8'));
  const slotSeed=Number(args['slot-seed']);
  const effectiveSeed=Number(args['effective-seed']||slotSeed);
  const output=args.output;
  const technical=Boolean(args['technical-fixture']);
  need(spec.stageId===STAGE_ID,'Stage 1 spec identity mismatch');
  need(Number.isInteger(slotSeed)&&Number.isInteger(effectiveSeed),'slot/effective seed required');
  need(output,'--output required');

  if(!technical){
    need(fs.existsSync(AUTH_PATH),'Study2 Stage 1 execution authorization absent');
    const auth=JSON.parse(fs.readFileSync(AUTH_PATH,'utf8'));
    need(auth.stageId===STAGE_ID&&auth.decision==='SFCDFT2-STAGE1-EXECUTION-AUTHORIZED','Study2 Stage 1 not authorized');
    const r=spec.freshSeedSlots.primary;
    need(slotSeed>=r.seedStart&&slotSeed<=r.seedEnd,'slot seed outside frozen Study2 Stage 1 block');
    need(effectiveSeed===slotSeed||effectiveSeed===slotSeed+1000000,'effective seed must be primary or paired reserve');
    if(effectiveSeed!==slotSeed){const rr=spec.freshSeedSlots.pairedReserve;need(effectiveSeed>=rr.seedStart&&effectiveSeed<=rr.seedEnd,'paired reserve outside frozen Study2 reserve block');}
  }

  const policyP=P.policyForSeed(slotSeed),policyI=I.policyForSeed(slotSeed);need(policyP===policyI,'policy assignment mismatch');
  const familyP=P.familyForSeed(STAGE_ID,slotSeed),familyI=I.familyForSeed(STAGE_ID,slotSeed);need(familyP===familyI,'root-family assignment mismatch');
  const domainP=P.domainId(policyP,familyP),domainI=I.domainId(policyI,familyI);need(domainP===domainI,'domain assignment mismatch');

  const rp=LP.replay(E,policyP,effectiveSeed,240),ri=LI.replay(E,policyI,effectiveSeed,240);exact(rp,ri,`source replay slot=${slotSeed} effective=${effectiveSeed}`);
  const ap=LP.selectAnchors(rp.rows,familyP),ai=LI.selectAnchors(ri.rows,familyI);exact(ap,ai,'anchor selection');
  const prefixP=P.openingPrefix(rp.moveKeys,ap.complete),prefixI=I.openingPrefix(ri.moveKeys,ai.complete);exact(prefixP,prefixI,'opening prefix');
  const candidateStatus=ap.complete?'CANDIDATE-PAIR-COMPLETE':'NO-CANDIDATE-ROOT-SHORTAGE';
  if(ap.complete){need(prefixP.openingPrefixAvailable===true&&prefixP.openingPrefixLength===16&&typeof prefixP.openingPrefixSha256==='string','complete candidate prefix invalid');}
  else if(rp.moveKeys.length<16){need(prefixP.openingPrefixAvailable===false&&prefixP.openingPrefixLength===rp.moveKeys.length&&prefixP.openingPrefixSha256===null,'short no-candidate serialization invalid');}

  const payload={
    schemaVersion:1,
    studyId:'SFCDFT-STUDY2',
    stageId:STAGE_ID,
    evidenceClass:technical?'TECHNICAL-FIXTURE':'FRESH-COMPATIBILITY-SOURCE',
    slotSeed,effectiveSeed,
    seedRole:effectiveSeed===slotSeed?'PRIMARY':'PAIRED-RESERVE',
    policyId:policyP,rootFamilyId:familyP,domainId:domainP,
    sourceTrajectorySha256:rp.trajectorySha256,
    candidateStatus,
    openingPrefixAvailable:prefixP.openingPrefixAvailable,
    openingPrefixSha256:prefixP.openingPrefixSha256,
    openingPrefixLength:prefixP.openingPrefixLength,
    moveCount:rp.moveKeys.length,terminal:rp.terminal,
    pairComplete:Boolean(ap.complete),
    namua:stripRoot(ap.namua),mtaji:stripRoot(ap.mtaji),
    endpointValuesRetained:false,
    sourceImplementationBindings:{
      production:gitBlobSha(path.join(__dirname,'lib/sfcdft2-production.js')),
      independent:gitBlobSha(path.join(__dirname,'lib/sfcdft2-independent.js'))
    }
  };
  atomicWrite(path.resolve(output),payload);
  process.stdout.write(JSON.stringify({event:'SOURCE-UNIT-COMPUTED',slotSeed,effectiveSeed,domainId:domainP,candidateStatus,pairComplete:Boolean(ap.complete),moveCount:rp.moveKeys.length})+'\n');
}
main();
