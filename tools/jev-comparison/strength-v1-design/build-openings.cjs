'use strict';
// Design-time generation only. No API client, paid requests, or match search.
const fs=require('node:fs'),path=require('node:path');
const experimentDir=path.resolve(__dirname,'..'),repo=path.resolve(__dirname,'../../..');
const C=require(path.join(experimentDir,'core.cjs')),engine=C.makeEngine(repo);
const hash=v=>C.sha256(JSON.stringify(v));
const sourceManifest=JSON.parse(fs.readFileSync(path.join(__dirname,'source-history-manifest.json'))),data={};
for(const [relative,expected]of Object.entries(sourceManifest)){
 C.assert(relative.startsWith('results/')&&!relative.split('/').includes('..'),'Invalid historical path');
 const value=JSON.parse(fs.readFileSync(path.join(experimentDir,relative)));
 C.assert(hash(value)===expected,'Historical result changed: '+relative);data[relative]=value;
}
const key=s=>hash(Object.fromEntries(['pits','reserve','houseOwned','player','phase','winner','pending'].map(k=>[k,s[k]])));
const historical=new Set();
function scan(v){if(!v||typeof v!=='object')return;if(v.pits&&v.reserve&&v.houseOwned&&v.pending&&Object.hasOwn(v,'winner'))historical.add(key(v));for(const x of Object.values(v))scan(x);}
scan(data);
for(const[p,g]of Object.entries(data))if(p.includes('/games/')&&g.initialState&&Array.isArray(g.moves)){
 let s=C.clone(g.initialState);historical.add(key(s));for(const row of g.moves){s=C.clone(engine.E.applyMoveForSearch(s,row.decision.move).state);historical.add(key(s));}
}
const historicalKeys=[...historical].sort(),used=new Set(historicalKeys),phaseRng=C.random(2026092104),orderRng=C.random(2026092105);
const phases=Array.from({length:32},()=>phaseRng()<.5?'namua':'mtaji');
function opening(stage,index,phase){
 const seed=stage==='pilot'?2026092103+index*1009:2026092106+index*1009,rng=C.random(seed);
 for(let attempt=0;attempt<10000;attempt++){
  const policy=rng()<.5?'uniform':'capture',target=phase==='namua'?4+Math.floor(rng()*28):44+Math.floor(rng()*48),moves=[];let state=engine.E.initialState();
  for(let ply=0;ply<target&&state.winner===null;ply++){
   const choices=engine.E.moveVariantsForSearch(state);if(!choices.length)break;let move;
   if(policy==='capture'){
    const ranked=choices.map(move=>({move,captures:engine.E.applyMoveForSearch(state,move).events.filter(e=>e.kind==='capture').reduce((s,e)=>s+e.count,0)}));
    const best=Math.max(...ranked.map(x=>x.captures)),pool=ranked.filter(x=>x.captures===best);move=pool[Math.floor(rng()*pool.length)].move;
   }else move=choices[Math.floor(rng()*choices.length)];
   moves.push(C.clone(move));state=C.clone(engine.E.applyMoveForSearch(state,move).state);
  }
  if(state.winner!==null||state.phase!==phase||used.has(key(state)))continue;
  const legal=engine.E.moveVariantsForSearch(state),count=legal.length;if(count<2||count>255)continue;
  if(legal.some(move=>{const next=engine.E.applyMoveForSearch(state,move).state;return next.winner===state.player&&next.reason!=='relay-limit';}))continue;
  try{C.requestFor(engine,state);}catch{continue;}
  used.add(key(state));
  return{id:stage+'-opening-'+String(index).padStart(2,'0'),phase,seed,sourceAttempt:attempt,policy,targetPlies:target,
   generationMoves:moves,state,stateHash:hash(state),canonicalHash:key(state),legalMoves:count};
 }
 throw new Error('Opening generation exhausted; do not change seed without versioning protocol.');
}
const pilot=['namua','mtaji'].map((phase,i)=>opening('pilot',i,phase));
const formal=phases.map((phase,i)=>opening('formal',i,phase));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(orderRng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const order=shuffle(Array.from({length:32},(_,i)=>i)),firstPlayers=shuffle(Array.from({length:32},(_,i)=>i%2));
const schedule=order.flatMap((openingIndex,executionPair)=>[0,1].map(seat=>({id:'formal-pair-'+String(openingIndex).padStart(2,'0')+'-game-'+seat,
 executionPair,openingId:formal[openingIndex].id,seat,candidatePlayer:seat?1-firstPlayers[executionPair]:firstPlayers[executionPair]})));
const pilotSchedule=pilot.flatMap((o,i)=>[0,1].map(seat=>({id:'pilot-pair-'+i+'-game-'+seat,openingId:o.id,seat,candidatePlayer:(i+seat)%2})));
const payload={schema:'bao-jev-strength-openings-v1',id:'JEV-BAO-STRENGTH-20260921-v1',baselineCommit:C.config.baselineCommit,
 phaseSeed:2026092104,orderSeed:2026092105,pilotSeedBase:2026092103,formalTrajectorySeedBase:2026092106,perOpeningSeedStep:1009,
 historicalCanonicalStates:historical.size,historicalExclusionHash:hash(historicalKeys),canonicalStateFields:['pits','reserve','houseOwned','player','phase','winner','pending'],pilot,formal,pilotSchedule,schedule};
for(const row of [...pilot,...formal]){
 let state=engine.E.initialState();for(const move of row.generationMoves)state=C.clone(engine.E.applyMoveForSearch(state,move).state);
 C.assert(hash(state)===row.stateHash&&!historical.has(row.canonicalHash),'Opening verification failed');
}
C.assert(new Set([...pilot,...formal].map(o=>o.canonicalHash)).size===34,'Duplicate new opening');
for(const o of formal){const s=schedule.filter(x=>x.openingId===o.id);C.assert(s.length===2&&s[0].candidatePlayer+s[1].candidatePlayer===1,'Pair assignment failed');}
fs.writeFileSync(path.join(__dirname,'openings.json'),JSON.stringify({...payload,openingsHash:hash(payload)},null,2)+'\n');
const report={status:'PASS',paidApiRequests:0,matchGamesPlayed:0,priorStatesExcluded:historical.size,pilotPairs:2,formalPairs:32,
 formalPhaseCounts:Object.fromEntries(['namua','mtaji'].map(p=>[p,formal.filter(x=>x.phase===p).length])),newOpeningsReplayed:34,firstGameCandidatePlayers:{player0:firstPlayers.filter(p=>p===0).length,player1:firstPlayers.filter(p=>p===1).length},openingsHash:hash(payload)};
fs.writeFileSync(path.join(__dirname,'opening-verification.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'historical-exclusion-hashes.json'),JSON.stringify(historicalKeys,null,2)+'\n');console.log(JSON.stringify(report,null,2));
