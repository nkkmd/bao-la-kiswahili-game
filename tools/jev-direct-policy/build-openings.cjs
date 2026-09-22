#!/usr/bin/env node
'use strict';
// Design-time only: no network client and no paid API calls.
const fs=require('node:fs');
const path=require('node:path');
const C=require('./core.cjs');
const repo=path.resolve(__dirname,'../..'),engine=C.makeEngine(repo);
const outDir=path.join(__dirname,'design'),outFile=path.join(outDir,'openings.json');
C.assert(!fs.existsSync(outFile),'OPENINGS_ALREADY_FROZEN');
function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function canonical(state){return C.sha256(Object.fromEntries(['pits','reserve','houseOwned','player','phase','winner','pending'].map(k=>[k,state[k]])));}
const prior=JSON.parse(fs.readFileSync(path.join(repo,'tools/jev-comparison/strength-v1-design/openings.json'),'utf8'));
const excluded=new Set([...prior.pilot,...prior.formal].map(o=>o.canonicalHash||canonical(o.state)));
const used=new Set(excluded);
function captureCount(result){return result.events.filter(e=>e.kind==='capture').reduce((n,e)=>n+(Number(e.count)||0),0);}
function generate(stage,index,phase){
 const seed=(stage==='pilot'?2026092203:2026092206)+index*1009,random=rng(seed);
 for(let attempt=0;attempt<12000;attempt++){
  const policy=random()<0.5?'uniform':'capture',target=phase==='namua'?6+Math.floor(random()*28):44+Math.floor(random()*52);
  let state=engine.E.initialState();const generationMoves=[];
  for(let ply=0;ply<target&&state.winner===null;ply++){
   const legal=engine.E.moveVariantsForSearch(state);if(!legal.length)break;let move;
   if(policy==='capture'){
    const ranked=legal.map(m=>({m,c:captureCount(engine.E.applyMoveForSearch(state,m))})),best=Math.max(...ranked.map(r=>r.c)),pool=ranked.filter(r=>r.c===best);
    move=pool[Math.floor(random()*pool.length)].m;
   }else move=legal[Math.floor(random()*legal.length)];
   generationMoves.push(C.clone(move));state=C.clone(engine.E.applyMoveForSearch(state,move).state);
  }
  if(state.winner!==null||state.phase!==phase)continue;
  const ch=canonical(state);if(used.has(ch))continue;
  const legal=engine.E.moveVariantsForSearch(state);if(legal.length<2||legal.length>255)continue;
  if(legal.some(m=>{const n=engine.E.applyMoveForSearch(state,m).state;return n.winner===state.player&&n.reason!=='relay-limit';}))continue;
  try{C.requestFor(engine,state);}catch{continue;}
  used.add(ch);
  return{id:stage+'-opening-'+String(index).padStart(2,'0'),phase,seed,sourceAttempt:attempt,policy,targetPlies:target,
   generationMoves,state:C.clone(state),stateHash:C.sha256(state),canonicalHash:ch,legalMoves:legal.length};
 }
 throw new Error('OPENING_GENERATION_EXHAUSTED_'+stage+'_'+index);
}
const phaseRandom=rng(2026092204),orderRandom=rng(2026092205);
const formalPhases=[...Array(16).fill('namua'),...Array(16).fill('mtaji')];
for(let i=formalPhases.length-1;i>0;i--){const j=Math.floor(phaseRandom()*(i+1));[formalPhases[i],formalPhases[j]]=[formalPhases[j],formalPhases[i]];}
const pilot=['namua','mtaji'].map((p,i)=>generate('pilot',i,p));
const formal=formalPhases.map((p,i)=>generate('formal',i,p));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(orderRandom()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const order=shuffle(Array.from({length:32},(_,i)=>i)),firstPlayers=shuffle(Array.from({length:32},(_,i)=>i%2));
const pilotSchedule=pilot.flatMap((o,i)=>[0,1].map(seat=>({id:'pilot-pair-'+i+'-game-'+seat,openingId:o.id,seat,jevPlayer:(i+seat)%2})));
const formalSchedule=order.flatMap((openingIndex,executionPair)=>[0,1].map(seat=>({id:'formal-pair-'+String(openingIndex).padStart(2,'0')+'-game-'+seat,
 executionPair,openingId:formal[openingIndex].id,seat,jevPlayer:seat?1-firstPlayers[executionPair]:firstPlayers[executionPair]})));
const payload={schema:'bao-jev-direct-policy-openings-v1',studyId:C.protocol.id,baselineCommit:C.protocol.baselineCommit,
 seeds:{phase:2026092204,order:2026092205,pilotBase:2026092203,formalBase:2026092206,step:1009},
 previousJevStudyOpeningsExcluded:excluded.size,previousJevStudyOpeningsHash:prior.openingsHash||null,
 canonicalStateFields:['pits','reserve','houseOwned','player','phase','winner','pending'],pilot,formal,pilotSchedule,formalSchedule};
for(const row of[...pilot,...formal]){
 let state=engine.E.initialState();for(const move of row.generationMoves)state=C.clone(engine.E.applyMoveForSearch(state,move).state);
 C.assert(C.sha256(state)===row.stateHash&&canonical(state)===row.canonicalHash,'OPENING_REPLAY_FAILED');
 C.assert(!excluded.has(row.canonicalHash),'PRIOR_OPENING_REUSED');
}
C.assert(new Set([...pilot,...formal].map(o=>o.canonicalHash)).size===34,'NEW_OPENING_DUPLICATE');
for(const o of formal){const games=formalSchedule.filter(g=>g.openingId===o.id);C.assert(games.length===2&&games[0].jevPlayer+games[1].jevPlayer===1,'PAIR_SWAP_FAILED');}
const openingsHash=C.sha256(payload),output={...payload,openingsHash};
fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(outFile,JSON.stringify(output,null,2)+'\n');
const report={status:'PASS',paidApiRequests:0,networkRequests:0,pilotPairs:2,formalPairs:32,formalGames:64,
 phaseCounts:{namua:formal.filter(o=>o.phase==='namua').length,mtaji:formal.filter(o=>o.phase==='mtaji').length},
 excludedPreviousStudyOpenings:excluded.size,newOpenings:34,firstGameJevPlayers:{player0:firstPlayers.filter(x=>x===0).length,player1:firstPlayers.filter(x=>x===1).length},openingsHash};
fs.writeFileSync(path.join(outDir,'opening-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
