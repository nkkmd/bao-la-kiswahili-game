"use strict";
const C=require('./lib/pbai-p11-common'),{search}=require('./lib/pbai-p11-search');
const path=require('node:path'),assert=require('node:assert/strict');C.requireSupervision();
const file=n=>path.join(C.OUT,n),batchIndex=Number(process.argv[2]),batch=C.SPEC.batches[batchIndex],name=batch?.name;
async function run(){
 const config=C.SPEC.matches[name];if(!config)throw Error('Unknown stage');
 const source=file(name+'-matches-source.json');if(batch.start>0&&!require('node:fs').existsSync(source))throw Error('Missing previously consumed source');const rows=require('node:fs').existsSync(source)?C.read(source).rows:C.select(name+'-matches',config),B=C.load();
 for(let index=batch.start;index<batch.end;index++){const r=rows[index];assert.ok(!require('node:fs').existsSync(file(`${name}-pair-${String(index).padStart(3,'0')}.json`)),'Pair already consumed');
  const games=[];
  for(const side of (index%2?[1,0]:[0,1])){
   C.append(file('match-access.jsonl'),{name,index,side,seed:r.seed});
   let s=r.state;const plies=[],before=JSON.stringify(s);
   for(let n=0;n<C.SPEC.search.maxMatchPlies&&s.winner===null;n++){
    const actor=s.player===side?'logic':'baseline',seed=(960000001+Object.keys(C.SPEC.matches).indexOf(name)*10000000+index*1000+side*200+n)>>>0,options=C.options(config.maxDepth,config.timeLimitMs);
    const a=await search(actor,s,seed,options,C.SPEC.resources.requestDeadlineMs);
    assert.equal(a.type,'result');if(actor==='logic'){assert.equal(a.stats.evaluationCandidate,'PBAI-C015-v1');assert.equal(a.stats.evaluationFallback,false);}assert.equal(a.id,seed);assert.equal(a.positionKey,B.A.stateKey(s));
    assert.ok(B.E.moveVariants(s).some(m=>B.A.moveKey(m)===B.A.moveKey(a.move)),'Illegal match move');
    assert.ok(Number.isFinite(a.stats.rootScore)&&Number.isFinite(a.stats.elapsedMs)&&Number.isFinite(a.wallTimeMs));
    assert.equal(a.stats.allocatedTimeMs,config.timeLimitMs);assert.ok(a.stats.completedDepth<=config.maxDepth);
    const p={actor,seed,move:a.move,stats:a.stats,elapsedMs:a.wallTimeMs,workerMemory:a.workerMemory};plies.push(p);
    C.append(file('ply-access.jsonl'),{name,index,side,ply:n,...p});s=B.E.applyMove(s,a.move).state;
   }
   assert.equal(JSON.stringify(r.state),before);
   games.push({side,score:s.winner===null?.5:Number(s.winner===side),plies,finalState:s,trajectory:C.sha([r.raw,plies.map(p=>B.A.moveKey(p.move))])});
  }
  games.sort((a,b)=>a.side-b.side);
  const pair={name,index,seed:r.seed,phase:r.phase,root:r.state,raw:r.raw,games,points:C.mean(games.map(g=>g.score))};
  C.write(file(`${name}-pair-${String(index).padStart(3,'0')}.json`),pair);
  console.log(JSON.stringify({stage:name+'-matches',pairs:index+1,total:rows.length}));
 }
 if(batch.end!==rows.length)return;
 const output=rows.map((r,index)=>C.read(file(`${name}-pair-${String(index).padStart(3,'0')}.json`)));
 const points=C.mean(output.map(p=>p.points)),phasePoints=Object.fromEntries(['namua','mtaji'].map(p=>[p,C.mean(output.filter(r=>r.phase===p).map(r=>r.points))]));
 const overrun={},latency={};for(const actor of ['logic','baseline']){
  const times=output.flatMap(p=>p.games.flatMap(g=>g.plies.filter(t=>t.actor===actor))).map(p=>p.elapsedMs);
  overrun[actor]=C.mean(times.map(t=>Number(t>config.timeLimitMs+C.SPEC.search.wallTimeOverrunAllowanceMs)));
  latency[actor]={requests:times.length,medianMs:C.median(times),p95Ms:C.quantile(times,.95),maxMs:Math.max(...times)};
 }
 const operation=overrun.logic<=overrun.baseline+C.SPEC.gates.overrunRateIncreaseMax && overrun.logic<=C.SPEC.gates.overrunRateAbsoluteMax;
 C.write(file(name+'-matches.json'),{name,pairs:output.length,games:output.length*2,points,phasePoints,overrun,latency,operation});
 console.log(JSON.stringify({stage:name+'-complete',points,phasePoints,operation}));
}
run().catch(e=>{console.error(e);process.exitCode=1;});
