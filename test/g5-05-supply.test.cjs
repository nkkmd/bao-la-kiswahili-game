"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const C=require("../tools/research/g5-05/core.cjs"),V=require("../tools/research/g5-05/independent-source.cjs"),R=require("../tools/research/g5-05/run.cjs"),L=require("../tools/research/g5-05/lease.cjs"),Storage=require("../tools/research/g5-05/storage.cjs");
const M=require("../tools/research/g5-01/measurement.cjs"),F=require("../tools/research/g5-01/transition/fixtures.cjs");
const selection={minWidth:2,maxWidth:4,maxReplyWidth:8,maxMicrostates:8192,maxPly:6};
function toy(fatal=false) {
 // 抽象遷移fixture。Baoの到達局面や科学seedを生成しない。
 const states={};function state(id,player,winner=null){const s=F.blank();s.pits[0][0][0]=id+1;s.player=player;s.winner=winner;return s;}
 for(let r=0;r<3;r++){states[`r${r}`]=state(r*3,0);states[`c${r}`]=state(r*3+1,1);states[`t${r}`]=state(r*3+2,1);}states.end=state(9,0,0);
 const name=s=>Object.keys(states).find(k=>M.rawKey(s)===M.rawKey(states[k]));
 const mv=(type,index)=>({type,phase:"mtaji",row:0,index,direction:"left"});
 const moves=s=>name(s).startsWith('r')?[mv("takata",0),mv("takata",1)]:name(s).startsWith('c')?[mv("capture",0)]:name(s).startsWith('t')?[mv("takata",0)]:[];
 const apply=(s,m)=>{const n=name(s),r=Number(n.slice(1));const to=n.startsWith('r')?`${m.index===0?'c':'t'}${r}`:r===2?'end':`r${r+1}`;return structuredClone(states[to]);};
 const apiI={moveVariants:moves,applyMove(s,m,options={}){if(fatal&&options.mode!=="runtime"&&name(s)==='r2')return{status:"ADMIN-CUTOFF",state:null,relays:1};return{status:"TERMINATED",state:apply(s,m),relays:0};}};
 const api={P:{initialState:()=>structuredClone(states.r0),moveVariantsForSearch:moves,applyMoveForSearch:(s,m)=>({state:apply(s,m)})},I:apiI};
 return{api,states,apiI};
}
test("既知40fixtureの条件通過rootで全手screenを独立照合する",()=>{
 let count=0;for(const f of F.corpus()){const width=require('../tools/research/g5-01/transition/runtime-engine.cjs').moveVariantsForSearch(f.state).length;if(C.preliminary(f.state,width,selection)){assert.deepEqual(C.screen(f.state,selection),V.independentScreen(f.state,selection));count++;}}assert.ok(count>0);
});
test("抽象軌跡は最初で止まらず最後の適格rootを固定する",()=>{
 const t=toy(),s=C.generateSource(1,selection,new Set(),()=>{}, {},t.api);
 assert.equal(s.stop,"NATURAL-TERMINAL");assert.equal(s.trace.length,6);assert.equal(s.candidate.ply,4);
 V.replay(s,selection,new Set(),t.apiI,t.states.r0);
 const bad=structuredClone(s);bad.candidate.ply=0;assert.throws(()=>V.replay(bad,selection,new Set(),t.apiI,t.states.r0));
});
test("最後のroot/子が既読なら前のrootへ戻らない",()=>{
 const t=toy(),excluded=new Set([M.rawKey(t.states.c2)]),s=C.generateSource(1,selection,excluded,()=>{}, {},t.api);
 assert.equal(s.candidate,null);assert.equal(s.selectionStatus,"LATEST-ROOT-OVERLAP-EXCLUDED");V.replay(s,selection,excluded,t.apiI,t.states.r0);
});
test("後続screenの手内部上限で古い代表も破棄する",()=>{
 const t=toy(true),s=C.generateSource(1,selection,new Set(),()=>{}, {},t.api);
 assert.equal(s.stop,"SCREEN-ADMIN-CUTOFF");assert.equal(s.candidate,null);V.replay(s,selection,new Set(),t.apiI,t.states.r0);
});
test("ply上限でのscreenも含めて最後の代表を独立確認する",()=>{
 const t=toy(),spec={...selection,maxPly:4},s=C.generateSource(1,spec,new Set(),()=>{}, {},t.api);
 assert.equal(s.stop,"PLY-LIMIT");assert.equal(s.candidate.ply,4);V.replay(s,spec,new Set(),t.apiI,t.states.r0);
});
test("draw改変・後続screen欠落を独立再生で拒否する",()=>{
 const t=toy(),s=C.generateSource(1,selection,new Set(),()=>{}, {},t.api);
 for(const mutate of [b=>b.trace[0].draws[0]++,b=>b.screens.pop()]){const b=structuredClone(s);mutate(b);assert.throws(()=>V.replay(b,selection,new Set(),t.apiI,t.states.r0));}
});
test("資源停止時も進行中sourceと観測状態を呼出元へ残す",()=>{
 const t=toy();let active=null,reads=0,checks=0;
 const s=C.generateSource(1,selection,new Set(),()=>{if(++checks===3)throw Error("GLOBAL-TIME-LIMIT");},{progress:v=>active=v,observe:()=>reads++},t.api);
 assert.equal(s.stop,"SOURCE-INTERRUPTED");assert.equal(s.candidate,null);assert.strictEqual(active,s);assert.ok(reads>0);assert.equal(s.trace.length,2);
});
test("旧4Studyの58532状態を遮断し、重複閉包に解を与えない",()=>{
 const old=C.priorFirewall();assert.equal(old.size,58532);const f=F.corpus().find(f=>f.id==='P9/forced-win').state;
 const d=C.buildClosure(f,{maxStates:5000,maxEdges:64000,maxDomainMs:10000,maxMicrostates:8192},()=>{},old);assert.equal(d.status,"PRIOR-READ-OVERLAP");assert.equal(d.solution,null);
});
test("既知完全fixtureの解・状態上限・共有成分を分離する",()=>{
 const f=F.corpus().find(f=>f.id==='P9/forced-win').state,spec={maxStates:5000,maxEdges:64000,maxDomainMs:10000,maxMicrostates:8192};
 assert.equal(C.buildClosure(f,spec).complete,true);const d=C.buildClosure(f,{...spec,maxStates:1});assert.equal(d.status,"STATE-LIMIT");assert.equal(d.solution,null);assert.ok(d.stopWitness.state);
 assert.deepEqual(C.domainGroups([{states:[{id:'x'}]},{states:[{id:'x'}]}]),[[0,1]]);
});
test("読取journalとcheckpointをfsync保存し、予約域到達でもcheckpointを保持する",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'g5-05-test-'));try{
 const f=F.corpus()[0].state,r=Storage.recorder(dir,[],{maxEvidenceBytes:100000,storageReserveBytes:99999});r.observe(f,'TECHNICAL');r.observe(f,'DUPLICATE');
 const e={sources:[],domains:[],scientificSeedsRead:0,activeSource:null,activeDomain:null};assert.throws(()=>r.snapshot(e,{}),/RESERVE/);r.close();assert.equal(fs.readFileSync(path.join(dir,'STATE_READS.jsonl'),'utf8').trim().split('\n').length,1);assert.ok(fs.existsSync(path.join(dir,'EVIDENCE.json.gz')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test("新契約とleaseは区画・run・attemptを固定し二度目を拒否する",()=>{
 const b=R.binding();assert.equal(b.spec.seedBlock.count,64);assert.equal(b.spec.closure.maxStates,5000);
 const env={GITHUB_ACTIONS:'true',GITHUB_REF_NAME:'research/g5-05-mixed-reply-supply',GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1',GITHUB_SHA:'technical-trigger'};
 const trigger={binding:b.digest,stageId:b.spec.stageId,frozenSourceCommit:'technical-freeze'},lease=L.leaseRecord(env,b,trigger);
 R.checkLease(lease,b,env);assert.throws(()=>L.leaseRecord({...env,GITHUB_RUN_ATTEMPT:'2'},b,trigger));assert.throws(()=>R.checkLease(lease,b,{...env,GITHUB_SHA:'changed'}));
});

test("source着手そのものの手内部上限を独立検算し候補を拒否する",()=>{const t=toy(true);for(const s of Object.values(t.states))s.phase="namua";const s=C.generateSource(1,selection,new Set(),()=>{}, {},t.api);assert.equal(s.stop,"ADMIN-CUTOFF");assert.equal(s.candidate,null);V.replay(s,selection,new Set(),t.apiI,t.states.r0);});
