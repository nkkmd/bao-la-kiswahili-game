#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
const C=require('./core.cjs');
const repo=path.resolve(__dirname,'../..');
function currentEnvironment(){
 let osRelease={};
 try{for(const line of fs.readFileSync('/etc/os-release','utf8').split('\n')){const i=line.indexOf('=');if(i>0)osRelease[line.slice(0,i)]=line.slice(i+1).replace(/^"|"$/g,'');}}catch{}
 return{node:process.version,platform:process.platform,kernel:os.release(),cpu:os.cpus()[0]?.model||null,logicalCPUs:os.cpus().length,
  totalMemoryBytes:os.totalmem(),osPrettyName:osRelease.PRETTY_NAME||null};
}
function main(){
 const env=currentEnvironment(),expected=C.protocol.environment.previous;
 const meaningful=[];
 if(env.node!==expected.node)meaningful.push({field:'node',expected:expected.node,actual:env.node});
 if(env.platform!==expected.platform)meaningful.push({field:'platform',expected:expected.platform,actual:env.platform});
 if(env.cpu!==expected.cpu)meaningful.push({field:'cpu',expected:expected.cpu,actual:env.cpu});
 if(env.logicalCPUs!==expected.logicalCPUs)meaningful.push({field:'logicalCPUs',expected:expected.logicalCPUs,actual:env.logicalCPUs});
 const contextual=[];
 if(env.kernel!==expected.kernel)contextual.push({field:'kernel',expected:expected.kernel,actual:env.kernel});
 if(expected.userRecordedOS&&env.osPrettyName!==expected.userRecordedOS)contextual.push({field:'osPrettyName',expected:expected.userRecordedOS,actual:env.osPrettyName});
 C.checkSources(repo);
 const qa=spawnSync(process.execPath,[path.join(__dirname,'mock-qa.cjs')],{cwd:repo,encoding:'utf8'});
 C.assert(qa.status===0,'MOCK_QA_FAILED\n'+qa.stderr);const qaResult=JSON.parse(qa.stdout);
 const openingFile=path.join(__dirname,'design/openings.json');C.assert(fs.existsSync(openingFile),'OPENINGS_NOT_FROZEN: run build-openings.cjs first');
 const openings=JSON.parse(fs.readFileSync(openingFile,'utf8')),{openingsHash,...payload}=openings;
 C.assert(C.sha256(payload)===openingsHash,'OPENINGS_HASH_MISMATCH');
 C.assert(openings.studyId===C.protocol.id&&openings.baselineCommit===C.protocol.baselineCommit,'OPENINGS_BINDING_MISMATCH');
 const engine=C.makeEngine(repo);let replayed=0;
 for(const row of[...openings.pilot,...openings.formal]){
  let state=engine.E.initialState();
  for(const move of row.generationMoves){C.assert(engine.E.moveVariantsForSearch(state).some(m=>engine.AI.moveKey(m)===engine.AI.moveKey(move)),'OPENING_ILLEGAL_MOVE');state=C.clone(engine.E.applyMoveForSearch(state,move).state);}
  C.assert(C.sha256(state)===row.stateHash,'OPENING_REPLAY_HASH_MISMATCH');C.requestFor(engine,state);replayed++;
 }
 C.assert(openings.pilot.length===2&&openings.formal.length===32,'OPENING_COUNT_MISMATCH');
 C.assert(openings.formal.filter(o=>o.phase==='namua').length===16&&openings.formal.filter(o=>o.phase==='mtaji').length===16,'PHASE_BALANCE_MISMATCH');
 const allSchedules=[...openings.pilotSchedule,...openings.formalSchedule];
 for(const o of openings.formal){const p=openings.formalSchedule.filter(g=>g.openingId===o.id);C.assert(p.length===2&&p[0].jevPlayer+p[1].jevPlayer===1,'FORMAL_PAIR_SWAP_MISMATCH');}
 const result={status:meaningful.length?'ENVIRONMENT-PAUSE':'PASS-OFFLINE',studyId:C.protocol.id,paidApiRequests:0,networkRequests:0,
  environment:{current:env,expected,meaningfulDifferences:meaningful,contextualDifferences:contextual},mockQA:qaResult.status,
  openings:{replayed,openingsHash,pilotPairs:openings.pilot.length,formalPairs:openings.formal.length,scheduledGames:allSchedules.length},
  protocol:{paidExecutionGate:C.protocol.paidExecutionGate,protocolOpeningsHash:C.protocol.openings.openingsHash,
   needsFinalFreeze:C.protocol.openings.openingsHash!==openingsHash||C.protocol.paidExecutionGate!=='CLOSED'},
  paidPilotAuthorized:false};
 fs.mkdirSync(path.join(__dirname,'results'),{recursive:true});fs.writeFileSync(path.join(__dirname,'results/preflight.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));
 if(meaningful.length)process.exitCode=2;
}
main();
