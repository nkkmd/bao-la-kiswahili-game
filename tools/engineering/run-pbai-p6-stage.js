"use strict";
const C=require('./lib/pbai-p6-common.js');
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const {performance}=require('node:perf_hooks');
C.requireSupervision();
const file=n=>path.join(C.OUT,n);
const [command,name]=process.argv.slice(2);
const models=()=>Object.fromEntries(['logic','linear','mlp'].map(k=>[k,C.compile(C.read(file(k+'-model.json')))]));
function dataset(name) {
  const rows=C.select(name,C.SPEC.splits[name]), B=C.load();
  for(const [i,row] of rows.entries()) {
    const teacher=B.A.analyzeMove(row.state,'hard',C.rng(row.seed),C.options(3,Infinity));
    if(teacher.stats.completedDepth!==3||teacher.stats.timedOut||!Number.isFinite(teacher.stats.rootScore))throw Error('Teacher incomplete');
    row.teacher=teacher;row.target=C.clip(teacher.stats.rootScore/1024);
    row.staticScore=B.fast.evaluate(row.state,row.state.player);
    C.append(file(name+'-labels.jsonl'),{seed:row.seed,teacher,target:row.target,staticScore:row.staticScore});
    if((i+1)%64===0)console.log(JSON.stringify({stage:'teacher-'+name,rows:i+1}));
  }
  C.write(file(name+'-dataset.json'),{name,rows});
}
function verifyExport() {
  const rows=C.read(file('train-dataset.json')).rows, expected=C.read(file('python-expected.json')), M=models();
  const maxError={logic:0,linear:0,mlp:0};
  for(const [i,r] of rows.entries()) {
    for(const p of [0,1])assert.deepEqual(C.encode(r.state,p),expected.encoding[2*i+p]);
    for(const [k,m] of Object.entries(M)) {
      const before=JSON.stringify(r.state), a=m.evaluate(r.state,0), b=m.evaluate(r.state,1);
      assert.equal(a,-b);assert.equal(JSON.stringify(r.state),before);assert.ok(Number.isFinite(a));
      maxError[k]=Math.max(maxError[k],Math.abs(a-expected.evaluationsPerspective0[k][i]));
      if(k==='logic')for(const p of [0,1])assert.equal(m.raw(C.encode(r.state,p)),C.referenceLogic(C.read(file('logic-model.json')),C.encode(r.state,p)));
    }
  }
  assert.equal(maxError.logic,0);assert.equal(maxError.linear,0);assert.ok(maxError.mlp<=1);
  C.write(file('export-verification.json'),{passed:true,roots:rows.length,perspectives:rows.length*2,maxError});
}
function profile(rows) {
  const B=C.load(), diagnostics=[];
  for(const phase of ['namua','mtaji'])for(const r of rows.filter(r=>r.phase===phase).slice(0,16)) {
    const calls={legalMoves:0,applyMove:0}, milliseconds={legalMoves:0,applyMove:0};
    const E={...B.E,moveVariants:B.E.moveVariantsForSearch};
    for(const [k,fn] of [['legalMoves',B.E.legalMoves],['applyMove',B.E.applyMoveForSearch]])E[k]=(...args)=>{const t=performance.now();const result=fn(...args);calls[k]++;milliseconds[k]+=performance.now()-t;return result;};
    const A=B.create(E,true), t=performance.now(), score=A.evaluate(r.state,r.state.player), totalMs=performance.now()-t;
    assert.equal(score,B.fast.evaluate(r.state,r.state.player));
    diagnostics.push({seed:r.seed,phase,score,totalMs,calls,milliseconds});
  }
  C.write(file('baseline-profile.json'),{instrumented:true,notSpeedComparison:true,rows:diagnostics});
}
function evaluate(name) {
  const rows=C.read(file(name+'-dataset.json')).rows, B=C.load(true), M=models();
  if(name==='development')profile(rows);
  const evaluators={baseline:(s,p)=>B.fast.evaluate(s,p),...Object.fromEntries(Object.entries(M).map(([k,m])=>[k,m.evaluate]))};
  const kinds=Object.keys(evaluators), results=[];let checksum=0;
  for(const [i,r] of rows.entries()) {
    const scores=Object.fromEntries(kinds.map(k=>[k,evaluators[k](r.state,r.state.player)]));
    const timings=Object.fromEntries(kinds.map(k=>[k,[]]));
    for(const k of kinds)for(let w=0;w<2;w++)checksum+=evaluators[k](r.state,r.state.player);
    for(let rep=0;rep<6;rep++)for(let j=0;j<4;j++) {
      const k=kinds[(i+rep+j)%4],t=performance.now();
      for(let n=0;n<20;n++)checksum+=evaluators[k](r.state,r.state.player);
      timings[k].push((performance.now()-t)/20);
    }
    const result={seed:r.seed,phase:r.phase,target:r.target,scores,timings};results.push(result);C.append(file(name+'-timing.jsonl'),result);
  }
  const tacticalCases=require('../../test/tactical.test.js').tacticalCases,tactical={};
  for(const k of kinds) {
    const cases=[];
    for(const test of tacticalCases) {
      const t=performance.now();const analysis=B.A.analyzeMove(test.position,'hard',()=>0,C.options(test.depth,Infinity,k==='baseline'?null:evaluators[k]));
      let failure=null;try{test.assert(analysis,test.position);}catch(e){failure=e.message;}
      if(analysis.stats.completedDepth!==test.depth)throw Error('Tactical incomplete');
      cases.push({category:test.category,move:analysis.move,stats:analysis.stats,elapsedMs:performance.now()-t,failure});
    }
    tactical[k]={total:cases.length,failures:cases.filter(c=>c.failure).length,cases};
  }
  const summary={};
  for(const k of kinds)summary[k]={mse:C.mean(results.map(r=>(C.clip(r.scores[k]/1024)-r.target)**2)),phaseMse:Object.fromEntries(['namua','mtaji'].map(p=>[p,C.mean(results.filter(r=>r.phase===p).map(r=>(C.clip(r.scores[k]/1024)-r.target)**2))])),timingMedianMs:C.median(results.map(r=>C.median(r.timings[k]))),phaseMedianRatio:Object.fromEntries(['namua','mtaji'].map(p=>[p,C.median(results.filter(r=>r.phase===p).map(r=>C.median(r.timings[k])/C.median(r.timings.baseline)))])),p95Ratio:C.quantile(results.map(r=>C.median(r.timings[k])/C.median(r.timings.baseline)),.95),tacticalFailures:tactical[k].failures};
  const gates={mse:summary.logic.mse<=summary.baseline.mse*1.10,phaseSpeed:Object.values(summary.logic.phaseMedianRatio).every(x=>x<=.9),p95Speed:summary.logic.p95Ratio<=1.10,tactical:tactical.logic.failures===0,baselineTactical:tactical.baseline.failures===0,export:C.read(file('export-verification.json')).passed};
  C.write(file(name+'-evaluation.json'),{name,summary,gates,passed:Object.values(gates).every(Boolean),tactical,rows:results,checksum,modelHashes:Object.fromEntries(['logic','linear','mlp'].map(k=>[k,C.sha(fs.readFileSync(file(k+'-model.json')))]))});
  console.log(JSON.stringify({stage:name+'-evaluation',summary,gates}));
}
function matches(name) {
  const rows=C.select(name+'-matches',C.SPEC.matches[name]),B=C.load(true),evaluator=C.compile(C.read(file('logic-model.json'))).evaluate;
  const output=[];
  for(const [index,r] of rows.entries()) {
    const games=[];
    for(const side of [0,1]) {
      C.append(file('match-access.jsonl'),{name,index,side,seed:r.seed});
      let s=r.state;const plies=[];const before=JSON.stringify(s);
      for(let n=0;n<C.SPEC.search.maxMatchPlies&&s.winner===null;n++) {
        const actor=s.player===side?'logic':'baseline',start=performance.now();
        const analysis=B.A.analyzeMove(s,'hard',C.rng(r.seed+n),C.options(8,100,actor==='logic'?evaluator:null));
        const elapsedMs=performance.now()-start;
        assert.ok(B.E.moveVariants(s).some(m=>B.A.moveKey(m)===B.A.moveKey(analysis.move)),'Illegal match move');
        plies.push({actor,move:analysis.move,stats:analysis.stats,elapsedMs});
        s=B.E.applyMove(s,analysis.move).state;
      }
      assert.equal(JSON.stringify(r.state),before);
      const score=s.winner===null?.5:Number(s.winner===side);
      games.push({side,score,plies,finalState:s,trajectory:C.sha([r.raw,plies.map(p=>B.A.moveKey(p.move))])});
    }
    const pair={name,index,seed:r.seed,phase:r.phase,root:r.state,raw:r.raw,games,points:C.mean(games.map(g=>g.score))};
    C.write(file(`${name}-pair-${String(index).padStart(3,'0')}.json`),pair);output.push(pair);
    if((index+1)%8===0)console.log(JSON.stringify({stage:name+'-matches',pairs:index+1}));
  }
  const points=C.mean(output.map(p=>p.points)),phasePoints=Object.fromEntries(['namua','mtaji'].map(p=>[p,C.mean(output.filter(r=>r.phase===p).map(r=>r.points))]));
  const overrun={};for(const k of ['logic','baseline']) { const t=output.flatMap(p=>p.games.flatMap(g=>g.plies.filter(t=>t.actor===k)));overrun[k]=C.mean(t.map(x=>Number(x.elapsedMs>150))); }
  const gates={points:points>=.45,phasePoints:Object.values(phasePoints).every(x=>x>=.35),operation:overrun.logic<=overrun.baseline+.05};
  C.write(file(name+'-matches.json'),{name,pairs:output.length,games:output.length*2,points,phasePoints,overrun,gates,passed:Object.values(gates).every(Boolean)});
  console.log(JSON.stringify({stage:name+'-matches',points,phasePoints,gates}));
}
if(command==='generate')dataset(name);
else if(command==='export')verifyExport();
else if(command==='evaluate')evaluate(name);
else if(command==='matches')matches(name);
else throw Error('Unknown stage');
