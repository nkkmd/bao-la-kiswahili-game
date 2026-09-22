#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {performance}=require('node:perf_hooks');
const C=require('./core.cjs');
const B=require('./live-ledger.cjs');
const R=require('./live-client.cjs');
const T=require('./stats.cjs');
const repo=path.resolve(__dirname,'../..');
const designFile=path.join(__dirname,'design','openings.json');
const manifestFile=path.join(__dirname,'runtime-manifest.json');
const authorizationFile=path.join(__dirname,'.live-authorization.json');
const resultsRoot=path.join(__dirname,'results','direct-policy-v1');
const ledgerDir=path.join(repo,'.git','jev-direct-policy',C.protocol.budget.costManagementId);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
function environment(){
 let pretty=null;try{const text=fs.readFileSync('/etc/os-release','utf8'),m=text.match(/^PRETTY_NAME=(?:"([^"]+)"|([^\n]+))/m);pretty=m?.[1]||m?.[2]||null;}catch{}
 return{node:process.version,platform:process.platform,kernel:os.release(),cpu:os.cpus()[0]?.model||null,logicalCPUs:os.cpus().length,totalMemoryBytes:os.totalmem(),osPrettyName:pretty};
}
function checkEnvironment(){
 const now=environment(),p=C.protocol.environment.previous,d=[];
 for(const[k,a,b]of[['node',now.node,p.node],['platform',now.platform,p.platform],['kernel',now.kernel,p.kernel],['cpu',now.cpu,p.cpu],['logicalCPUs',now.logicalCPUs,p.logicalCPUs]])if(a!==b)d.push({field:k,current:a,expected:b});
 C.assert(!d.length,'ENVIRONMENT_MISMATCH');return now;
}
function verifyOpenings(){
 C.assert(fs.existsSync(designFile),'OPENINGS_MISSING');const O=read(designFile),{openingsHash,...payload}=O;
 C.assert(C.sha256(payload)===openingsHash&&openingsHash===C.protocol.openings.openingsHash,'OPENINGS_HASH_MISMATCH');return O;
}
function verifyManifest(){
 C.assert(fs.existsSync(manifestFile),'RUNTIME_MANIFEST_MISSING');const m=read(manifestFile),{manifestHash,...unsigned}=m;
 C.assert(C.sha256(unsigned)===manifestHash&&m.studyId===C.protocol.id&&m.openingsHash===C.protocol.openings.openingsHash,'RUNTIME_MANIFEST_BINDING_ERROR');
 for(const[name,wanted]of Object.entries(m.files)){
  C.assert(!path.isAbsolute(name)&&!name.split('/').includes('..'),'RUNTIME_MANIFEST_PATH_ERROR');
  C.assert(C.sha256(fs.readFileSync(path.join(__dirname,name)))===wanted,'RUNTIME_FILE_CHANGED: '+name);
 }
 return m;
}
function specification(O,M){const spec={studyId:C.protocol.id,protocolHash:C.sha256(C.protocol),openingsHash:O.openingsHash,runtimeManifestHash:M.manifestHash};return{...spec,specHash:C.sha256(spec)};}
function requireAuthorization(stage,spec){
 C.assert(fs.existsSync(authorizationFile),'LIVE_NOT_AUTHORIZED');const a=read(authorizationFile);
 C.assert(a.authorized===true&&a.studyId===C.protocol.id&&a.stage===stage&&a.specHash===spec.specHash&&a.openingsHash===spec.openingsHash,'LIVE_AUTHORIZATION_MISMATCH');
 return a;
}
function games(O,stage){
 const book=stage==='pilot'?O.pilot:O.formal,schedule=stage==='pilot'?O.pilotSchedule:O.formalSchedule;
 return schedule.map(s=>({...s,id:'direct-v1-'+s.id,stage,initialState:C.clone(book.find(o=>o.id===s.openingId).state)}));
}
function gameFile(id){return path.join(resultsRoot,'games',id+'.json');}
function decisionFile(id,ply){return path.join(resultsRoot,'decisions',C.sha256(id+'-ply-'+ply)+'.json');}
function finalStatus(game){if(game.state.reason==='relay-limit')return'ENGINE-LIMIT';if(game.state.winner!==null)return'TERMINAL';if(game.moves.length>=C.protocol.outcomes.maxPlies)return'UNRESOLVED';return'PAUSED';}
function validateDecision(engine,state,row,item,ledger,responseRoot=resultsRoot){
 C.assert(row.stateHash===C.sha256(state),'MOVE_STATE_HASH_MISMATCH');const isJev=state.player===item.jevPlayer;
 C.assert(row.competitor===(isJev?'jev-direct':'ai-gen4'),'COMPETITOR_MISMATCH');
 const legal=engine.E.moveVariantsForSearch(state),serialized=JSON.stringify(row.move),key=engine.AI.moveKey(row.move);
 C.assert(legal.some(m=>JSON.stringify(m)===serialized),'RECORDED_MOVE_ILLEGAL');C.assert(row.moveKey===key,'RECORDED_MOVE_KEY_MISMATCH');
 const after=engine.E.applyMoveForSearch(state,row.move).state;C.assert(row.afterHash===C.sha256(after),'AFTER_STATE_HASH_MISMATCH');
 if(isJev){
  if(legal.length===1){
   C.assert(row.remote?.status==='forced-move'&&row.candidateId===null&&row.candidateSetHash===null&&row.requestHash===null,'FORCED_MOVE_RECORD_ERROR');
  }else{
   const packet=C.requestFor(engine,state);C.assert(row.candidateSetHash===packet.candidateSetHash&&row.requestHash===C.sha256(JSON.stringify(packet.body)),'JEV_REQUEST_BINDING_ERROR');
   const mapped=packet.moveById[row.candidateId];C.assert(mapped&&JSON.stringify(mapped.move)===serialized&&mapped.moveKey===row.moveKey,'JEV_CANDIDATE_BINDING_ERROR');
   const attemptId=row.remote?.attemptId;C.assert(typeof attemptId==='string'&&(attemptId.endsWith('-attempt-1')||attemptId.endsWith('-attempt-2')),'JEV_ATTEMPT_ID_ERROR');
   const saved=R.verifySaved(ledger,responseRoot,attemptId,packet,{repair:true});
   C.assert(saved.status==='ok'&&saved.candidateId===row.candidateId&&saved.moveKey===row.moveKey&&C.sha256(saved.move)===C.sha256(row.move),'JEV_SAVED_RESPONSE_MOVE_MISMATCH');
   C.assert(saved.responseDigest===row.remote.responseDigest,'JEV_RESPONSE_DIGEST_MISMATCH');
   if(attemptId.endsWith('-attempt-2')){
    const firstId=attemptId.replace(/-attempt-2$/,'-attempt-1'),first=R.verifySaved(ledger,responseRoot,firstId,packet,{repair:true});
    C.assert(first.status!=='ok'&&first.retryable,'JEV_FIRST_VALID_RESPONSE_IGNORED');
   }
  }
 }else{
  C.assert(row.remote===null&&row.candidateId===null&&row.candidateSetHash===null&&row.requestHash===null,'BASELINE_REMOTE_RECORD_ERROR');
  C.assert(row.search?.allocationMs===C.protocol.baselineSearch.timeLimitMs&&row.search?.evaluator==='PBAI-C015-v1'&&row.search?.evaluationFallback===false,'BASELINE_SEARCH_RECORD_ERROR');
  C.assert(Number.isFinite(row.search.elapsedMs)&&row.search.elapsedMs>=0&&Number.isInteger(row.search.completedDepth)&&row.search.completedDepth<=C.protocol.baselineSearch.maxDepth,'BASELINE_SEARCH_STATS_ERROR');
 }
 return C.clone(after);
}
function replayGame(engine,game,item,spec,ledger){
 C.assert(game.studyId===C.protocol.id&&game.specHash===spec.specHash&&game.id===item.id&&game.openingId===item.openingId&&game.jevPlayer===item.jevPlayer,'GAME_BINDING_MISMATCH');
 C.assert(C.sha256(game.initialState)===C.sha256(item.initialState),'GAME_OPENING_MISMATCH');let state=C.clone(item.initialState);
 for(let ply=0;ply<game.moves.length;ply++){const row=game.moves[ply];C.assert(row.ply===ply,'MOVE_SEQUENCE_MISMATCH');state=validateDecision(engine,state,row,item,ledger);}
 C.assert(C.sha256(state)===C.sha256(game.state),'GAME_STATE_MISMATCH');return state;
}
function loadGames(O,spec,engine,ledger){
 const all=[...games(O,'pilot'),...games(O,'formal')],rows=[];
 for(const item of all){const file=gameFile(item.id);if(!fs.existsSync(file))continue;const g=read(file);replayGame(engine,g,item,spec,ledger);rows.push({id:g.id,stage:g.stage,openingId:g.openingId,jevPlayer:g.jevPlayer,status:g.status,winner:g.state.winner,plies:g.moves.length,pause:g.pause||null});}
 return rows;
}
function report(O,spec,ledger,engine,status){
 const rows=loadGames(O,spec,engine,ledger),value={studyId:C.protocol.id,status,createdAt:new Date().toISOString(),spec,budget:ledger.summary(),
  pilot:T.summarize(rows,'pilot'),formal:T.summarize(rows,'formal'),games:rows};
 C.atomicJSON(path.join(resultsRoot,'summary.json'),value);return value;
}
async function choose(engine,state,{isJev,client,logicalId,stage,allowRetry}){
 const legal=engine.E.moveVariantsForSearch(state);C.assert(legal.length,'NO_LEGAL_MOVE');
 if(isJev){
  if(legal.length===1){const d=C.forcedDecision(engine,state);return{competitor:'jev-direct',...d,remote:{status:'forced-move',apiAttempts:0}};}
  const packet=C.requestFor(engine,state),remote=await client.evaluate(packet,{logicalId,stage,allowRetry});
  C.assert(remote.status==='ok','JEV_RESPONSE_NOT_OK');const d=C.directDecision(engine,state,remote);
  return{competitor:'jev-direct',...d,candidateId:remote.candidateId,candidateSetHash:packet.candidateSetHash,requestHash:C.sha256(JSON.stringify(packet.body)),
   remote:{status:'ok',attemptId:remote.attemptId,responseDigest:remote.responseDigest,elapsedMs:remote.elapsedMs,recovered:remote.recovered,confidence:remote.confidence,usage:remote.usage}};
 }
 const started=performance.now(),result=engine.baseline(state),elapsedMs=performance.now()-started,applied=engine.E.applyMoveForSearch(state,result.move);
 return{competitor:'ai-gen4',move:C.clone(result.move),moveKey:engine.AI.moveKey(result.move),after:C.clone(applied.state),afterHash:C.sha256(applied.state),
  search:{allocationMs:C.protocol.baselineSearch.timeLimitMs,elapsedMs,completedDepth:result.stats.completedDepth,evaluator:result.stats.evaluationCandidate,evaluationFallback:result.stats.evaluationFallback}};
}
async function runStage(O,spec,ledger,engine,client,stage,{allowRetry=false,log=console.log}={}){
 const prior=report(O,spec,ledger,engine,'VALIDATED');if(stage==='formal')C.assert(prior.pilot.terminalGames===4&&prior.pilot.incompletePairs===0,'PILOT_NOT_TECHNICALLY_COMPLETE');
 for(const item of games(O,stage)){
  const file=gameFile(item.id);let game;
  if(fs.existsSync(file)){game=read(file);replayGame(engine,game,item,spec,ledger);}else{
   game={studyId:C.protocol.id,specHash:spec.specHash,id:item.id,stage,openingId:item.openingId,jevPlayer:item.jevPlayer,initialState:C.clone(item.initialState),createdAt:new Date().toISOString(),
    environment:environment(),state:C.clone(item.initialState),moves:[],status:'PAUSED',pause:null};C.atomicJSON(file,game);
  }
  if(game.status==='TERMINAL')continue;if(['UNRESOLVED','ENGINE-LIMIT'].includes(game.status))return report(O,spec,ledger,engine,game.status);
  try{
   while(game.state.winner===null&&game.moves.length<C.protocol.outcomes.maxPlies&&game.state.reason!=='relay-limit'){
    const ply=game.moves.length,id=item.id+'-ply-'+ply,df=decisionFile(item.id,ply);let row;
    if(fs.existsSync(df)){row=read(df);C.assert(row.ply===ply,'PENDING_PLY_MISMATCH');validateDecision(engine,game.state,row,item,ledger);}
    else{
     const d=await choose(engine,game.state,{isJev:game.state.player===item.jevPlayer,client,logicalId:id,stage,allowRetry});
     row={ply,stateHash:C.sha256(game.state),competitor:d.competitor,move:d.move,moveKey:d.moveKey,afterHash:d.afterHash,candidateId:d.candidateId||null,
      candidateSetHash:d.candidateSetHash||null,requestHash:d.requestHash||null,remote:d.remote||null,search:d.search||null};
     C.atomicJSON(df,row);validateDecision(engine,game.state,row,item,ledger);
    }
    game.state=C.clone(engine.E.applyMoveForSearch(game.state,row.move).state);C.assert(row.afterHash===C.sha256(game.state),'COMMITTED_AFTER_STATE_MISMATCH');
    game.moves.push(row);game.pause=null;game.status=finalStatus(game);C.atomicJSON(file,game);
    if(game.moves.length%10===0)log(item.id+': '+game.moves.length+' plies; budget $'+ledger.summary().estimatedAndReservedUSD);
   }
   game.status=finalStatus(game);C.atomicJSON(file,game);if(game.status!=='TERMINAL')return report(O,spec,ledger,engine,game.status);log(item.id+': TERMINAL '+game.moves.length+' plies');
  }catch(e){game.pause={code:e.message,details:e.details||null,time:new Date().toISOString()};game.status='PAUSED';C.atomicJSON(file,game);return report(O,spec,ledger,engine,e.message);}
 }
 return report(O,spec,ledger,engine,stage==='pilot'?'PILOT-COMPLETE':'FORMAL-COMPLETE');
}
async function main(){
 const args=process.argv.slice(2),cmd=args[0]||'help';
 if(cmd==='help'){console.log('Offline: status / verify / unlock-stale\nPaid (requires local ignored .live-authorization.json): run pilot --live | resume pilot --live | run formal --live | resume formal --live');return;}
 const O=verifyOpenings(),M=verifyManifest(),spec=specification(O,M),engine=C.makeEngine(repo);checkEnvironment();
 if(cmd==='unlock-stale'){console.log(JSON.stringify({unlocked:B.unlockStale(ledgerDir)}));return;}
 if(cmd==='status'||cmd==='verify'){const ledger=new B.Ledger(ledgerDir,spec.specHash),r=report(O,spec,ledger,engine,cmd==='verify'?'VERIFIED':'STATUS');console.log(JSON.stringify(r,null,2));return;}
 C.assert(['run','resume'].includes(cmd)&&['pilot','formal'].includes(args[1])&&args[2]==='--live'&&args.length===3,'COMMAND_INVALID');
 const stage=args[1];requireAuthorization(stage,spec);C.assert(process.env.TYPESAFE_API_KEY,'TYPESAFE_API_KEY_REQUIRED');const release=B.lock(ledgerDir);
 try{const ledger=new B.Ledger(ledgerDir,spec.specHash),client=R.createClient(ledger,resultsRoot,process.env.TYPESAFE_API_KEY);const r=await runStage(O,spec,ledger,engine,client,stage,{allowRetry:cmd==='resume'});console.log(JSON.stringify(r,null,2));}
 finally{release();}
}
if(require.main===module)main().catch(e=>{console.error(JSON.stringify({status:'ERROR',code:e.message,details:e.details||null},null,2));process.exitCode=1;});
module.exports={environment,checkEnvironment,verifyOpenings,verifyManifest,specification,games,validateDecision,replayGame,report,choose,runStage};
