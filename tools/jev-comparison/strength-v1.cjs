#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {performance}=require('node:perf_hooks');
const C=require('./core.cjs'),B=require('./budget.cjs'),L=require('./latency-diagnostic.cjs');
const S=require('./strength-ledger.cjs'),R=require('./strength-client.cjs'),T=require('./strength-stats.cjs');
const {hash,read,P,O}=S;
const stamp=()=>({node:process.version,platform:process.platform,release:os.release(),cpu:os.cpus()[0]?.model,logicalCPUs:os.cpus().length});
function inspect(){
 const base=require('./pilot-v3.cjs').inspect();
 const manifest=read(path.join(__dirname,'strength-manifest.json'));
 C.assert(manifest.id===P.id && manifest.files['strength-v1.cjs'] && manifest.files['strength-ledger.cjs'] && manifest.files['strength-client.cjs'],'MANIFEST_ERROR');
 for(const [name,wanted]of Object.entries(manifest.files)){
  C.assert(!path.isAbsolute(name)&&!name.split('/').includes('..')&&C.sha256(fs.readFileSync(path.join(__dirname,name)))===wanted,'ADDON_CHANGED: '+name);
 }
 const frozen=read(path.join(__dirname,'strength-v1-design/manifest.json'));
 for(const[name,wanted]of Object.entries(frozen.files))C.assert(C.sha256(fs.readFileSync(path.join(__dirname,'strength-v1-design',name)))===wanted,'DESIGN_CHANGED');
 const {openingsHash,...payload}=O;C.assert(hash(payload)===openingsHash && openingsHash===P.openings.openingsHash,'OPENINGS_CHANGED');
 const historical=read(path.join(__dirname,'strength-v1-design/source-history-manifest.json'));
 for(const[name,wanted]of Object.entries(historical))C.assert(hash(read(path.join(__dirname,name)))===wanted,'HISTORY_CHANGED: '+name);
 return{...base,root:path.join(base.output,'strength-v1'),spec:S.specification()};
}
function saveFrozen(file,data){if(fs.existsSync(file))C.assert(hash(read(file))===hash(data),'FROZEN_FILE_CHANGED');else C.atomicJSON(file,data);}
function gameFile(env,id){return path.join(env.root,'games',id+'.json');}
function decisionFile(env,id){return path.join(env.root,'decisions',C.sha256(id)+'.json');}
function finalStatus(game){return game.state.reason==='relay-limit'?'ENGINE-LIMIT':game.state.winner!==null?'TERMINAL':game.moves.length>=512?'UNRESOLVED':'PAUSED';}
async function decide(engine,state,{candidate=false,client=null,id='',stage='pilot'}={}){
 const begin=performance.now(),legal=engine.E.moveVariantsForSearch(state);C.assert(legal.length,'NO_LEGAL_MOVE');
 let remote={status:legal.length===1?'forced-move':'not-requested',elapsedMs:0},probabilities=null;
 if(candidate&&legal.length>1){
  let packet;try{packet=C.requestFor(engine,state);}catch{throw R.stop('INPUT-LIMIT');}
  remote=await client.evaluate(packet,{id,stage:stage==='pilot'?'pilot':'matches'});
  C.assert(remote.status==='ok','API_NOT_VALID');probabilities=remote.probabilities;
 }
 // Both sides start their entire search allocation here, after all API work and persistence.
 const searchStart=performance.now();
 const result=engine.analyze(state,{deadline:searchStart+2000,timeLimitMs:2000,maxDepth:12,probabilities});
 const searchEnd=performance.now();
 C.assert(legal.some(m=>engine.AI.moveKey(m)===engine.AI.moveKey(result.move)),'ILLEGAL_SEARCH_MOVE');
 return{...result,remote,searchAllocationMs:2000,apiTimeoutMs:60000,recoveryDebitMs:0,
  apiWaitMs:remote.elapsedMs,preSearchMs:searchStart-begin,searchElapsedMs:searchEnd-searchStart,
  elapsedMs:performance.now()-begin,deadlineOverrunMs:Math.max(0,searchEnd-searchStart-2000)};
}
function validateDecision(engine,state,row,item,ledger,env,{repair=false}={}){
 const id=item.id+'-ply-'+row.ply,d=row.decision,legal=engine.E.moveVariantsForSearch(state),candidate=state.player===item.candidatePlayer;
 C.assert(row.stateHash===hash(state)&&row.competitor===(candidate?'jev':'baseline')&&state.winner===null,'MOVE_STATE_MISMATCH');
 C.assert(legal.some(m=>engine.AI.moveKey(m)===engine.AI.moveKey(d.move)),'ILLEGAL_MOVE');
 C.assert(d.searchAllocationMs===2000&&d.apiTimeoutMs===60000&&d.recoveryDebitMs===0
  &&Number.isFinite(d.searchElapsedMs)&&d.searchElapsedMs>=0&&Math.abs(d.deadlineOverrunMs-Math.max(0,d.searchElapsedMs-2000))<1e-6,'CLOCK_RECORD_ERROR');
 C.assert(d.stats?.evaluationCandidate==='PBAI-C015-v1'&&d.stats.evaluationFallback===false&&d.stats.completedDepth<=12,'EVALUATOR_MISMATCH');
 if(candidate&&legal.length>1){
  const packet=C.requestFor(engine,state),aid=d.remote.attemptId;
  C.assert(aid===id+'-attempt-1'||aid===id+'-attempt-2','ATTEMPT_ID_MISMATCH');
  const saved=R.verifySaved(ledger,env.root,aid,packet,{repair});
  C.assert(saved.status==='ok'&&saved.savedDigest===d.remote.savedDigest&&hash(saved.probabilities)===hash(d.remote.probabilities),'MOVE_ANSWER_MISMATCH');
  if(aid.endsWith('-2')){const first=R.verifySaved(ledger,env.root,id+'-attempt-1',packet,{repair});C.assert(first.status!=='ok'&&first.retryable,'FIRST_VALID_ANSWER_IGNORED');}
 }else C.assert(d.remote.status===(legal.length===1?'forced-move':'not-requested'),'UNEXPECTED_API');
 const file=decisionFile(env,id),event=ledger.moveEvents?.get(id);
 C.assert(fs.existsSync(file)&&hash(read(file))===hash(row)&&(!event||event.digest===hash(row)),'DECISION_INTEGRITY_ERROR');
 if(!event&&repair)ledger.append({type:'strength-move',id,digest:hash(row)});
 return Boolean(event||repair);
}
function validateGame(engine,game,item,env,ledger,{repair=false}={}){
 C.assert(game.specHash===env.spec.planHash&&game.id===item.id&&game.candidatePlayer===item.candidatePlayer&&game.openingId===item.openingId
  &&hash(game.initialState)===hash(item.initialState)&&hash(game.environment)===hash(stamp()),'GAME_BINDING_MISMATCH');
 let state=C.clone(item.initialState);C.assert(game.moves.length<=512,'PLY_LIMIT_ERROR');
 for(let ply=0;ply<game.moves.length;ply++){
  const row=game.moves[ply];C.assert(row.ply===ply,'PLY_SEQUENCE_ERROR');
  C.assert(validateDecision(engine,state,row,item,ledger,env,{repair}),'UNCOMMITTED_GAME_MOVE');
  state=C.clone(engine.E.applyMoveForSearch(state,row.decision.move).state);
 }
 C.assert(hash(state)===hash(game.state),'GAME_REPLAY_MISMATCH');
 C.assert(Boolean(game.clockDeviation)===game.moves.some(r=>r.decision.deadlineOverrunMs>50),'CLOCK_DEVIATION_MISMATCH');
 const end=finalStatus(game);if(['TERMINAL','UNRESOLVED','ENGINE-LIMIT'].includes(game.status))C.assert(game.status===end,'OUTCOME_MISMATCH');
 return state;
}
function audit(env,ledger,engine,{repair=false}={}){
 const known=new Set(S.allGames.map(g=>g.id)),games=[];
 const dir=path.join(env.root,'games');if(fs.existsSync(dir))for(const name of fs.readdirSync(dir)){
  if(name.endsWith('.json'))C.assert(known.has(name.slice(0,-5)),'UNPLANNED_GAME');
 }
 for(const item of S.allGames){const file=gameFile(env,item.id);if(!fs.existsSync(file))continue;
  const game=read(file);validateGame(engine,game,item,env,ledger,{repair});
  games.push({id:item.id,openingId:item.openingId,stage:item.stage,candidatePlayer:item.candidatePlayer,status:game.status,
   winner:game.state.winner,reason:game.state.reason,plies:game.moves.length,clockDeviation:Boolean(game.clockDeviation),pause:game.pause||null});
 }
 for(const[id,r]of ledger.records)if(id.startsWith('strength-v1-')){
  const a=S.parseAttempt(id),file=gameFile(env,a.game.id);C.assert(fs.existsSync(file),'REQUEST_WITHOUT_GAME');
  const g=read(file);C.assert(a.ply<=g.moves.length,'REQUEST_AHEAD_OF_GAME');
  let state=C.clone(a.game.initialState);for(let i=0;i<a.ply;i++)state=C.clone(engine.E.applyMoveForSearch(state,g.moves[i].decision.move).state);
  C.assert(state.winner===null&&state.player===a.game.candidatePlayer,'REQUEST_ON_WRONG_TURN');
  const packet=C.requestFor(engine,state);C.assert(r.requestHash===hash(packet.body),'REQUEST_REPLAY_MISMATCH');
  R.verifySaved(ledger,env.root,id,packet,{repair});
 }
 for(const[id,event]of ledger.moveEvents||[]){
  const a=S.parseAttempt(id+'-attempt-1'),file=gameFile(env,a.game.id);C.assert(fs.existsSync(file),'MOVE_WITHOUT_GAME');
  const g=read(file);C.assert(a.ply<=g.moves.length,'MOVE_AHEAD_OF_GAME');
  const row=read(decisionFile(env,id));C.assert(hash(row)===event.digest,'MOVE_DIGEST_MISMATCH');
  if(a.ply===g.moves.length)validateDecision(engine,g.state,row,a.game,ledger,env,{repair});
 }
 return games;
}
function report(env,ledger,engine,status,{repair=false}={}){
 const games=audit(env,ledger,engine,{repair});
 const result={id:P.id,spec:env.spec,createdAt:new Date().toISOString(),status,purpose:P.purpose,budget:ledger.summary(),
  pilot:T.summarize(games.filter(g=>g.stage==='pilot'),'pilot'),formal:T.summarize(games.filter(g=>g.stage==='formal'),'formal'),games};
 if(ledger.halted){result.pilot.decision='INCOMPLETE';result.formal.decision='INCOMPLETE';}
 C.atomicJSON(path.join(env.root,'summary.json'),result);return result;
}
async function run(env,ledger,client,stage,{shouldPause=()=>false,engineFactory=()=>C.makeEngine(env.repo,{hooked:true}),choose=decide,log=console.log}={}){
 const replay=engineFactory();const prior=report(env,ledger,replay,'VALIDATED',{repair:true});
 C.assert(!ledger.halted,'STUDY_HALTED');
 if(stage==='formal')C.assert(prior.pilot.decision==='PILOT-PASS','動作確認4局の技術合格が必要です。');
 for(const item of S.games(stage)){
  const file=gameFile(env,item.id);
  const game=fs.existsSync(file)?read(file):{...C.clone(item),specHash:env.spec.planHash,createdAt:new Date().toISOString(),environment:stamp(),
   state:C.clone(item.initialState),moves:[],status:'PAUSED',clockDeviation:false,pause:null};
  validateGame(replay,game,item,env,ledger,{repair:true});
  if(game.clockDeviation||['UNRESOLVED','ENGINE-LIMIT'].includes(game.status)||['ATTEMPTS-EXHAUSTED','INPUT-LIMIT','TECHNICAL-STOP','STUDY_HALTED'].includes(game.pause?.code))
   return report(env,ledger,replay,'TECHNICAL-STOP');
  if(game.status==='TERMINAL')continue;
  if(shouldPause())return report(env,ledger,replay,'PAUSED');
  C.atomicJSON(file,game);
  const baseline=engineFactory(),candidate=engineFactory();
  for(const e of[baseline,candidate])e.analyze(e.E.initialState(),{maxDepth:2,timeLimitMs:Infinity});
  try{
   while(game.state.winner===null&&game.moves.length<512&&!shouldPause()){
    const ply=game.moves.length,id=item.id+'-ply-'+ply,df=decisionFile(env,id);let row;
    if(fs.existsSync(df)){row=read(df);C.assert(row.ply===ply,'PENDING_PLY_MISMATCH');validateDecision(replay,game.state,row,item,ledger,env,{repair:true});}
    else{
     C.assert(!ledger.moveEvents?.has(id),'MISSING_DECISION');const isCandidate=game.state.player===item.candidatePlayer;
     const decision=await choose(isCandidate?candidate:baseline,game.state,{candidate:isCandidate,client,id,stage});
     row={ply,stateHash:hash(game.state),competitor:isCandidate?'jev':'baseline',decision};
     C.atomicJSON(df,row);validateDecision(replay,game.state,row,item,ledger,env,{repair:true});
    }
    game.state=C.clone(replay.E.applyMoveForSearch(game.state,row.decision.move).state);game.moves.push(row);game.pause=null;
    game.clockDeviation ||= row.decision.deadlineOverrunMs>50;game.status=finalStatus(game);C.atomicJSON(file,game);
    if(game.clockDeviation)return report(env,ledger,replay,'CLOCK-DEVIATION');
    if(game.moves.length%10===0)log(item.id+': '+game.moves.length+' 手、累計計上 $'+ledger.summary().estimatedAndReservedUSD);
   }
   game.status=finalStatus(game);C.atomicJSON(file,game);
   if(game.status!=='TERMINAL')return report(env,ledger,replay,game.status);
   log(item.id+': TERMINAL（'+game.moves.length+' 手）');
  }catch(e){
   game.pause={code:e.message,details:e.details||null,time:new Date().toISOString()};game.status='PAUSED';C.atomicJSON(file,game);
   const result=report(env,ledger,replay,e.message);log(JSON.stringify({status:e.message,details:e.details||null,budget:result.budget},null,2));return result;
  }
 }
 return report(env,ledger,replay,stage==='pilot'?'PILOT-COMPLETE':'FORMAL-COMPLETE');
}
function concise(r){return{status:r.status,pilot:r.pilot,formal:r.formal,budget:r.budget};}
async function main(){
 const args=process.argv.slice(2),command=args[0]||'help';
 if(command==='help'){console.log('無課金: preflight / status / export / unlock-stale\n動作確認: run pilot --live\n明示的再開: resume pilot --live\n本比較: run formal --live （動作確認合格後）');return;}
 C.assert((['preflight','status','export','unlock-stale'].includes(command)&&args.length===1)
  ||(['run','resume'].includes(command)&&['pilot','formal'].includes(args[1])&&args.length===3&&args[2]==='--live'),'コマンドを確認してください。');
 const env=inspect();
 if(command==='unlock-stale'){B.unlockStale(env.ledgerDir);console.log('終了済みプロセスのロックだけを確認・解除しました。');return;}
 const release=B.lock(env.ledgerDir);
 try{
  const ledger=new S.StrengthLedger(env.ledgerDir,L.binding());
  if(!ledger.strengthScope)S.historicalCheck(ledger);
  else C.assert(hash(ledger.strengthScope.spec)===hash(env.spec),'SCOPE_MISMATCH');
  saveFrozen(path.join(env.root,'plan.json'),env.spec);saveFrozen(path.join(env.root,'environment.json'),stamp());
  const engine=C.makeEngine(env.repo,{hooked:true});
  if(command==='preflight'){
   for(const opening of[...O.pilot,...O.formal]){let s=engine.E.initialState();for(const move of opening.generationMoves){
    C.assert(engine.E.moveVariantsForSearch(s).some(m=>engine.AI.moveKey(m)===engine.AI.moveKey(move)),'OPENING_ILLEGAL');s=C.clone(engine.E.applyMoveForSearch(s,move).state);}
    C.assert(hash(s)===opening.stateHash&&hash(s)===hash(opening.state),'OPENING_REPLAY_ERROR');C.requestFor(engine,s);
   }
   const rr=report(env,ledger,engine,'PREFLIGHT');
   const dry=await decide(engine,O.pilot[0].state);
   C.assert(dry.deadlineOverrunMs<=50,'PREFLIGHT_CLOCK_OVERRUN');
   const result={status:'PASS',spec:env.spec,realApiRequests:0,pilotGames:4,formalGames:64,timeLimitMs:2000,apiTimeoutMs:60000,
    drySearch:{elapsedMs:dry.searchElapsedMs,depth:dry.stats.completedDepth},budget:rr.budget,scopeRegistered:Boolean(ledger.strengthScope)};
   C.atomicJSON(path.join(env.root,'preflight.json'),result);console.log(JSON.stringify(result,null,2));return;
  }
  if(command==='status'||command==='export'){
   const r=report(env,ledger,engine,'STATUS');console.log(JSON.stringify(concise(r),null,2));
   if(command==='export'){
    const {spawnSync}=require('node:child_process');const dest=path.join(env.repo,'bao-jev-strength-v1-results.zip');
    // Only result JSON, this fixed add-on, and this ledger. Never include environment files or credentials.
    const script="import sys,zipfile,pathlib\nrepo,kit,ledger,dest=map(pathlib.Path,sys.argv[1:])\nwith zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED) as z:\n for f in sorted((kit/'results').rglob('*.json')): z.write(f,str(f.relative_to(kit)))\n z.write(ledger,'audit/budget.jsonl')\n z.write(kit/'strength-manifest.json','audit/strength-manifest.json')\n";
    const r=spawnSync('python3',['-c',script,env.repo,__dirname,ledger.file,dest],{stdio:'inherit'});C.assert(r.status===0,'EXPORT_FAILED');console.log(dest);
   }
   return;
  }
  const pf=read(path.join(env.root,'preflight.json'));C.assert(pf.status==='PASS'&&hash(pf.spec)===hash(env.spec),'この版でpreflightを実行してください。');
  C.assert(process.env.TYPESAFE_API_KEY,'TYPESAFE_API_KEYを設定してください。');C.assert(!ledger.halted,'STUDY_HALTED');
  // Official price checked at release; no uncharged model-list or SDK retry requests.
  ledger.register();let paused=false,interrupts=0;
  process.on('SIGINT',()=>{paused=true;if(++interrupts>1)process.exit(130);});process.on('SIGTERM',()=>{paused=true;});
  const client=R.createClient(ledger,env.root,process.env.TYPESAFE_API_KEY,{allowRetry:command==='resume'});
  const result=await run(env,ledger,client,args[1],{shouldPause:()=>paused});console.log(JSON.stringify(concise(result),null,2));
  if(!['PILOT-COMPLETE','FORMAL-COMPLETE'].includes(result.status))process.exitCode=2;
 }finally{release();}
}
module.exports={inspect,decide,validateDecision,validateGame,audit,report,run,finalStatus,stamp,gameFile,decisionFile};
if(require.main===module)main().catch(e=>{console.error(e.message?.startsWith('Command failed')?'Gitの状態確認に失敗しました。':e.message);process.exitCode=1;});
