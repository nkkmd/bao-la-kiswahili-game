#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {performance}=require('node:perf_hooks');
const C=require('./core.cjs'),B=require('./budget.cjs'),V=require('./pilot-v3.cjs');
const ID='offline-replay-v1',BASE_MS=2000,DEPTH=12;
const V3_HASH='9fd3abb0ef3f057e56c705b79cb742373ca81afa1e70ded6f4d261586e9cdf51';
const GAME_HASHES={"pilot-v3-pair-0-game-0.json":"9b1c90131520491882a8469803a94f60f5c7dfa9ecfb62c686aab47c700cb5ad","pilot-v3-pair-0-game-1.json":"7216d06da05dd8f0b7ce810e9e5b40f5377aaa0aa2e448a7832c33a97823e220","pilot-v3-pair-1-game-0.json":"90ebc12610065f3bd49e771692e20ac46a77d7ab1d9287d3dc9b211d9da2b838","pilot-v3-pair-1-game-1.json":"e390c78abf701b30a4c9e7518ed4397e1dcc06f1fd13139f34b34df98bcbd69c","pilot-v3-pair-2-game-0.json":"0013b25bdf87bde040efb929d463786408cd2e43b978f77a8932c2c52b395304"};
const SUMMARY_HASH='177dc63144b476ccef10c1aeae7f95dfa39d220c62b0177cc971c876a23671c5';
const hash=v=>C.sha256(JSON.stringify(v)),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));

function inspect(){
 const env=V.inspect();C.assert(env.addonHash===V3_HASH,'確認済みのv3コードと一致しません。');
 const manifest=read(path.join(__dirname,'offline-replay-manifest.json'));
 C.assert(manifest.id===ID,'追加版の識別子が一致しません。');
 for(const name of ['offline-replay.cjs','OFFLINE_REPLAY.md','AUDIT_V3.md'])C.assert(typeof manifest.files[name]==='string','追加ファイルが不足しています。');
 for(const[name,expected]of Object.entries(manifest.files))C.assert(path.basename(name)===name&&C.sha256(fs.readFileSync(path.join(__dirname,name)))===expected,'追加ファイルのハッシュが一致しません。');
 const summary=read(path.join(env.output,'pilot-v3/summary.json'));C.assert(hash(summary)===SUMMARY_HASH,'確認済みのv3停止結果と一致しません。');
 return{...env,addonHash:hash(manifest),root:path.join(env.output,ID),v3Summary:summary};
}
function inputs(env,engine){
 const plan=V.planFor(engine,V3_HASH);C.assert(hash(read(path.join(env.output,'pilot-v3/plan.json')))===hash(plan),'元の対局条件が一致しません。');
 const cases=[];
 for(const item of plan.games){
  const file=path.join(env.output,'pilot-v3/games',item.id+'.json');if(!fs.existsSync(file))continue;
  const game=read(file);C.assert(hash(game)===GAME_HASHES[path.basename(file)],'確認済みのv3棋譜と一致しません。');V.validateGame(engine,game,item,plan);let state=C.clone(item.initialState);
  for(const row of game.moves){
   const decision=row.decision,remote=decision.remote;
   if(row.competitor==='jev' && ['ok','timeout'].includes(remote.status)){
    const id=item.id+'-ply-'+row.ply,request=read(path.join(env.output,'requests',C.sha256(id)+'.json')),response=read(path.join(env.output,'responses',C.sha256(id)+'.json')),packet=C.requestFor(engine,state);
    C.assert(request.id===id && request.requestHash===hash(packet.body) && hash(request.body)===hash(packet.body) && hash(request.keyById)===hash(packet.keyById),'保存要求と局面が一致しません。');
    C.assert(response.id===id && response.requestHash===request.requestHash && hash(response.result)===hash(remote) && !remote.recovered && !remote.fatal,'保存応答が一致しません。');
    let probabilities=null;
    if(remote.status==='ok'){probabilities=C.validateResponse(remote.response,packet).probabilities;C.assert(hash(probabilities)===hash(remote.probabilities),'保存確率が一致しません。');}
    const allocation=decision.stats.allocatedTimeMs;
    C.assert(Number.isFinite(allocation)&&allocation>0&&allocation<=BASE_MS && decision.stats.baseTimeLimitMs===allocation,'記録された探索時間枠が不正です。');
    cases.push({id,state:C.clone(state),stateHash:hash(state),phase:state.phase,remoteStatus:remote.status,
      probabilities,baselineAllocationMs:BASE_MS,candidateAllocationMs:allocation,recordedPreSearchMs:BASE_MS-allocation,
      recordedApiMs:remote.elapsedMs,originalMove:decision.move});
   }
   state=C.clone(engine.E.applyMoveForSearch(state,decision.move).state);
  }
 }
 C.assert(cases.length===64&&cases.filter(x=>x.remoteStatus==='ok').length===61&&cases.filter(x=>x.remoteStatus==='timeout').length===3,'確認済みの64局面が揃っていません。');
 return cases;
}
function planFor(env,cases){
 const plan={id:ID,schema:'bao-jev-offline-replay-plan',addonHash:env.addonHash,sourceSummaryHash:SUMMARY_HASH,
  sourcePlanHash:env.v3Summary.planHash,inputHash:hash(cases),cases:cases.length,maxDepth:DEPTH,baselineMs:BASE_MS,
  candidateMs:'recorded allocatedTimeMs; no API or waiting',order:'baseline first at even index, candidate first at odd index',
  purpose:'comparison-only-no-adoption',formalStatus:'NOT-STARTED',kind:'retrospective paired search-budget replay',
  interpretation:'実測の探索前消費時間を固定して探索時間枠を再現する比較。実通信・実対局・独立標本の正式比較ではありません。'};
 return{...plan,planHash:hash(plan)};
}
function freeze(env,plan,cases){
 for(const[name,value]of [['plan.json',plan],['inputs.json',cases]]){
  const file=path.join(env.root,name);if(fs.existsSync(file))C.assert(hash(read(file))===hash(value),'保存済みの再生条件が一致しません。');else C.atomicJSON(file,value);
 }
}
function search(engine,state,probabilities,allocationMs){
 const started=performance.now(),result=engine.analyze(state,{probabilities,maxDepth:DEPTH,timeLimitMs:allocationMs,deadline:started+allocationMs});
 const elapsedMs=performance.now()-started;
 return{...result,allocationMs,measuredSearchMs:elapsedMs,overrunMs:Math.max(0,elapsedMs-allocationMs)};
}
function validateRow(engine,row,item,index,plan){
 C.assert(row.planHash===plan.planHash && row.id===item.id && row.caseHash===hash(item) && row.index===index,'保存済み比較の入力が一致しません。');
 C.assert(row.remoteStatus===item.remoteStatus&&row.phase===item.phase&&row.recordedPreSearchMs===item.recordedPreSearchMs&&row.recordedApiMs===item.recordedApiMs,'保存済みの観測条件が一致しません。');
 C.assert(row.sameMove===(engine.AI.moveKey(row.baseline.move)===engine.AI.moveKey(row.candidate.move)),'保存済みの着手比較が一致しません。');
 C.assert(row.order===(index%2?'candidate-first':'baseline-first'),'保存済み比較の実行順が一致しません。');
 for(const side of ['baseline','candidate']){
  const r=row[side],expected=side==='baseline'?item.baselineAllocationMs:item.candidateAllocationMs;
  C.assert(r.allocationMs===expected&&Number.isFinite(r.measuredSearchMs)&&r.measuredSearchMs>=0,'保存済みの時間枠が一致しません。');
  C.assert(r.stats.evaluationCandidate==='PBAI-C015-v1'&&r.stats.evaluationFallback===false,'保存済み評価器が一致しません。');
  C.assert(engine.E.moveVariantsForSearch(item.state).some(m=>engine.AI.moveKey(m)===engine.AI.moveKey(r.move)),'保存済みの着手が不正です。');
 }
}
function aggregate(rows){
 const groups={all:rows,ok:rows.filter(r=>r.remoteStatus==='ok'),timeout:rows.filter(r=>r.remoteStatus==='timeout')};
 return Object.fromEntries(Object.entries(groups).map(([name,rs])=>[name,{positions:rs.length,
  candidateDeeper:rs.filter(r=>r.candidate.stats.completedDepth>r.baseline.stats.completedDepth).length,
  equalDepth:rs.filter(r=>r.candidate.stats.completedDepth===r.baseline.stats.completedDepth).length,
  candidateShallower:rs.filter(r=>r.candidate.stats.completedDepth<r.baseline.stats.completedDepth).length,
  sameMove:rs.filter(r=>r.sameMove).length,
  meanBaselineDepth:rs.length?rs.reduce((s,r)=>s+r.baseline.stats.completedDepth,0)/rs.length:null,
  meanCandidateDepth:rs.length?rs.reduce((s,r)=>s+r.candidate.stats.completedDepth,0)/rs.length:null}]));
}
async function runComparison(env,plan,cases,{engineFactory=()=>C.makeEngine(env.repo,{hooked:true}),choose=search,shouldPause=()=>false,log=console.log}={}){
 const baseline=engineFactory(),candidate=engineFactory();for(const e of [baseline,candidate])e.analyze(e.E.initialState(),{maxDepth:2,timeLimitMs:1000});
 const rows=[];
 for(let i=0;i<cases.length;i++){
  const item=cases[i],file=path.join(env.root,'positions',C.sha256(item.id)+'.json');
  if(fs.existsSync(file)){const row=read(file);validateRow(baseline,row,item,i,plan);rows.push(row);continue;}
  if(shouldPause())break;
  const row={id:item.id,index:i,planHash:plan.planHash,caseHash:hash(item),phase:item.phase,remoteStatus:item.remoteStatus,
    recordedApiMs:item.recordedApiMs,recordedPreSearchMs:item.recordedPreSearchMs,order:i%2?'candidate-first':'baseline-first'};
  if(i%2){row.candidate=await choose(candidate,item.state,item.probabilities,item.candidateAllocationMs);row.baseline=await choose(baseline,item.state,null,item.baselineAllocationMs);}
  else{row.baseline=await choose(baseline,item.state,null,item.baselineAllocationMs);row.candidate=await choose(candidate,item.state,item.probabilities,item.candidateAllocationMs);}
  row.sameMove=baseline.AI.moveKey(row.baseline.move)===baseline.AI.moveKey(row.candidate.move);
  row.environment={node:process.version,platform:process.platform,cpu:os.cpus()[0]?.model};row.savedAt=new Date().toISOString();
  validateRow(baseline,row,item,i,plan);C.atomicJSON(file,row);rows.push(row);
  if(rows.length%8===0)log('無課金の局面比較: '+rows.length+'/'+cases.length);
 }
 const report={id:ID,status:rows.length===cases.length?'OFFLINE-REPLAY-COMPLETE':'OFFLINE-REPLAY-PAUSED',planHash:plan.planHash,createdAt:new Date().toISOString(),
  purpose:plan.purpose,formalStatus:'NOT-STARTED',realApiRequests:0,newApiCostUSD:0,completed:rows.length,planned:cases.length,
  v3RecordedBudget:env.v3Summary.budget,aggregate:aggregate(rows),interpretation:plan.interpretation,
  limitations:['同じ対局から採った相関のある局面です。','時間枠は過去の観測値で固定し、通信の再発・回復を検証しません。','探索深度や着手一致は棋力の優劣や正解率ではありません。','両側で同じ局面の探索を計測し、勝敗は生成しません。']};
 C.atomicJSON(path.join(env.root,'summary.json'),report);log(JSON.stringify(report,null,2));return report;
}
async function main(){
 const args=process.argv.slice(2),command=args[0];C.assert(args.length===1&&['preflight','run'].includes(command),'preflightまたはrunを指定してください。--liveは使いません。');
 globalThis.fetch=async()=>{throw new Error('この比較ではAPI呼び出しを禁止しています。');};
 const env=inspect(),release=B.lock(env.ledgerDir);
 try{
  const engine=C.makeEngine(env.repo,{hooked:true}),cases=inputs(env,engine),plan=planFor(env,cases);freeze(env,plan,cases);
  if(command==='preflight'){
   const report={status:'PASS',planHash:plan.planHash,cases:cases.length,ok:61,timeouts:3,maxDepth:DEPTH,baselineAllocationMs:BASE_MS,
    candidateAllocationMsRange:[Math.min(...cases.map(x=>x.candidateAllocationMs)),Math.max(...cases.map(x=>x.candidateAllocationMs))],realApiRequests:0,newApiCostUSD:0};
   C.atomicJSON(path.join(env.root,'preflight.json'),report);console.log(JSON.stringify(report,null,2));return;
  }
  const p=read(path.join(env.root,'preflight.json'));C.assert(p.status==='PASS'&&p.planHash===plan.planHash,'先にこの条件でpreflightを通過してください。');
  let paused=false,interrupts=0;process.on('SIGINT',()=>{paused=true;if(++interrupts>1)process.exit(130);});process.on('SIGTERM',()=>{paused=true;});
  await runComparison(env,plan,cases,{shouldPause:()=>paused});
 }finally{release();}
}
module.exports={inspect,inputs,planFor,freeze,search,validateRow,aggregate,runComparison};
if(require.main===module)main().catch(e=>{console.error(e.message?.startsWith('Command failed')?'Gitの状態確認に失敗しました。':e.message);process.exitCode=1;});
