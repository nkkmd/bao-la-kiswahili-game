"use strict";
const C=require("./lib/pbai-p4-common.js");
const fs=require("node:fs"),assert=require("node:assert/strict"),cp=require("node:child_process");
const {performance}=require("node:perf_hooks");
const flag="pbaiC011LightweightTransitions";
const configs={development:{rootBase:812000001,roots:16,gameBase:816000001,pairs:4},validation:{rootBase:813000001,roots:16,gameBase:817000001,pairs:8},holdout:{rootBase:814000001,roots:32,gameBase:818000001,pairs:128}};
const order=Object.keys(configs);
const quantile=(a,p)=>[...a].sort((x,y)=>x-y)[Math.max(0,Math.ceil(a.length*p)-1)];
const median=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[n>>1]:(s[n/2-1]+s[n/2])/2;};
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
function fixed(a){const {elapsedMs,...s}=a.stats;return {move:a.move,stats:s};}
function mem(){const m=process.memoryUsage();return {heapUsed:m.heapUsed,rss:m.rss};}
function allSelections(){return fs.readdirSync(C.OUT,{recursive:true}).filter(p=>String(p).endsWith("-source.json")).flatMap(p=>read(C.OUT+"/"+p).rows);}
function select(B,dir,kind,base,n){
 const file=dir+"/"+kind+"-source.json";
 if(fs.existsSync(file))return read(file).rows;
 const lock=file+".started";C.write(lock,{base,n,started:new Date().toISOString()});
 const previous=allSelections();const seenRaw=new Set(previous.map(r=>r.raw)),seenPrefix=new Set(previous.map(r=>r.prefix)),seenTrajectory=new Set(previous.map(r=>r.trajectory));
 const rows=[],audit=[];const count={namua:0,mtaji:0};
 const limit=kind==="games"&&n===128?8192:4096;
 for(let seed=base;seed<base+limit&&(count.namua<n||count.mtaji<n);seed++){
  const phase=(seed-base)%2===0?"namua":"mtaji";
  if(count[phase]===n)continue;
  let s=B.E.initialState(),random=C.rng(seed),selected=null;const keys=[];
  C.write(dir+`/${kind}-seed-active.json`,{seed});
  for(let ply=0;ply<96&&s.winner===null;ply++){
   const v=B.E.moveVariants(s);if(!v.length)throw Error("No legal source move");
   const move=v[Math.floor(random()*v.length)];keys.push(B.A.moveKey(move));s=B.E.applyMove(s,move).state;
   const min=phase==="namua"?12:44,max=phase==="namua"?40:88;
   if(!selected&&ply+1>=min&&ply+1<=max&&s.phase===phase&&s.winner===null&&B.E.moveVariants(s).length>=2)selected={state:s,ply:ply+1};
  }
  const prefix=C.sha(keys.slice(0,12)),trajectory=C.sha(keys);
  let reason="NO-ROOT";
  if(selected){const raw=C.raw(selected.state);reason=seenRaw.has(raw)?"DUPLICATE-RAW":seenPrefix.has(prefix)?"DUPLICATE-PREFIX":seenTrajectory.has(trajectory)?"DUPLICATE-TRAJECTORY":null;
   if(!reason){const row={seed,phase,raw,prefix,trajectory,...selected};rows.push(row);seenRaw.add(raw);seenPrefix.add(prefix);seenTrajectory.add(trajectory);count[phase]++;}}
  audit.push({seed,phase,reason,prefix,trajectory});
  fs.appendFileSync(dir+"/"+kind+"-seeds.jsonl",JSON.stringify(audit.at(-1))+"\n");
  fs.unlinkSync(dir+`/${kind}-seed-active.json`);
 }
 C.write(file,{base,n,rows,audit,count,complete:count.namua===n&&count.mtaji===n});
 assert.equal(rows.length,n*2,"source support insufficient");return rows;
}
function single(B,N,row,mode,options){
 const A=mode==="baseline"?B.A:N.A;
 const before=mem(),start=performance.now();
 const a=A.analyzeMove(row.state,options.level||"hard",C.rng(row.seed),{...options,[flag]:mode==="candidate"});
 const elapsed=performance.now()-start,after=mem();
 if(elapsed>60000)throw Error("Search resource cap exceeded");
 return {analysis:a,elapsed,before,after};
}
function performanceRoot(B,N,row,index){
 const equality=[];
 for(const level of ["hard","expert"])for(const maxDepth of [2,3]){
  const o={level,maxDepth,timeLimitMs:Infinity};const b=single(B,N,row,"baseline",o),off=single(B,N,row,"off",o),on=single(B,N,row,"candidate",o);
  assert.deepEqual(fixed(off.analysis),fixed(b.analysis));assert.deepEqual(fixed(on.analysis),fixed(b.analysis));
  equality.push({level,maxDepth,baseline:fixed(b.analysis),off:fixed(off.analysis),candidate:fixed(on.analysis)});
 }
 const times={baseline:[],candidate:[]};
 for(let repeat=-2;repeat<6;repeat++){
  const modes=(index+repeat)%2===0?["baseline","candidate"]:["candidate","baseline"];
  for(const mode of modes){const result=single(B,N,row,mode,{maxDepth:3,timeLimitMs:Infinity});
   assert(!result.analysis.stats.timedOut);if(repeat>=0)times[mode].push({repeat,order:modes.indexOf(mode),...result});}
 }
 return {seed:row.seed,phase:row.phase,raw:row.raw,equality,times,medianRatio:median(times.candidate.map(x=>x.elapsed))/median(times.baseline.map(x=>x.elapsed)),p95Ratio:quantile(times.candidate.map(x=>x.elapsed),.95)/quantile(times.baseline.map(x=>x.elapsed),.95)};
}
function speedGate(rows){
 const phases={};for(const p of ["namua","mtaji"])phases[p]=median(rows.filter(r=>r.phase===p).map(r=>r.medianRatio));
 const p95Ratio=quantile(rows.map(r=>r.p95Ratio),.95);
 const maxRss={};for(const mode of ["baseline","candidate"])maxRss[mode]=Math.max(...rows.flatMap(r=>r.times[mode].flatMap(t=>[t.before.rss,t.after.rss])));
 const rssRatio=maxRss.candidate/maxRss.baseline;
 return {passed:Object.values(phases).every(v=>v<=.9)&&p95Ratio<=1.1&&rssRatio<=1.25,phases,p95Ratio,rssRatio,maxRss,medianRatio:median(rows.map(r=>r.medianRatio)),maxRSS:process.resourceUsage().maxRSS};
}
function operationRoot(B,N,row,index){
 const rows=[];for(const [level,timeLimitMs,maxDepth] of [["hard",500,8],["expert",2000,12]]){
  const modes=index%2?["candidate","baseline"]:["baseline","candidate"];
  const results={};for(const mode of modes)results[mode]=single(B,N,row,mode,{level,timeLimitMs,maxDepth});
  rows.push({seed:row.seed,phase:row.phase,level,timeLimitMs,...results});
 }return rows;
}
function operationGate(rows){
 const levels={};for(const level of ["hard","expert"]){const rs=rows.filter(r=>r.level===level),metrics={};
  for(const mode of ["baseline","candidate"]){metrics[mode]={meanDepth:mean(rs.map(r=>r[mode].analysis.stats.completedDepth)),meanNodes:mean(rs.map(r=>r[mode].analysis.stats.nodes)),p95Ms:quantile(rs.map(r=>r[mode].elapsed),.95),timeoutRate:mean(rs.map(r=>Number(r[mode].analysis.stats.timedOut))),overrunRate:mean(rs.map(r=>Number(r[mode].elapsed>r.timeLimitMs+Math.max(50,r.timeLimitMs*.1))))};}
  const b=metrics.baseline,c=metrics.candidate;levels[level]={...metrics,passed:c.meanDepth>=b.meanDepth&&c.p95Ms<=b.p95Ms*1.1+25&&c.overrunRate<=b.overrunRate+.05};
 }return {passed:Object.values(levels).every(x=>x.passed),levels};
}
function tactical(B,N){const {tacticalCases}=require("../../test/tactical.test.js");const rows=[];for(const t of tacticalCases){
 for(const mode of ["baseline","off","candidate"]){const a=single(B,N,{state:t.position,seed:0},mode,{maxDepth:t.depth,timeLimitMs:Infinity}).analysis;t.assert(a,t.position);rows.push({category:t.category,mode,move:a.move,stats:a.stats});}}
 return {passed:true,rows};}
function pair(B,N,row,index,dir){
 const file=dir+`/pair-${index}.json`;if(fs.existsSync(file))return read(file);
 C.write(file+".started",{seed:row.seed,started:new Date().toISOString()});
 const games=[];
 // Alternate which seat is played first, without transforming the board.
 for(const candidateSeat of (index%2?[1,0]:[0,1])){
  const start=performance.now();let state=structuredClone(row.state);const moves=[],stats=[],raws=[C.raw(state)];
  for(let ply=0;ply<160&&state.winner===null;ply++){
   const mode=state.player===candidateSeat?"candidate":"baseline";
   const turn=single(B,N,{state,seed:row.seed+ply},mode,{maxDepth:8,timeLimitMs:100});
   assert(turn.analysis.move);assert(B.E.moveVariants(state).some(m=>B.A.moveKey(m)===B.A.moveKey(turn.analysis.move)),"illegal move");
   moves.push(turn.analysis.move);stats.push({mode,elapsed:turn.elapsed,...turn.analysis.stats});
   state=B.E.applyMove(state,turn.analysis.move).state;raws.push(C.raw(state));
   if(performance.now()-start>300000)throw Error("Game resource cap exceeded");
  }
  const score=state.winner===null?.5:state.winner===candidateSeat?1:0;
  games.push({candidateSeat,score,winner:state.winner,reason:state.winner===null?"160-ply-cap":state.reason,plies:moves.length,moves,stats,final:state,raws,trajectory:C.sha(raws),elapsed:performance.now()-start});
 }
 const result={seed:row.seed,phase:row.phase,raw:row.raw,prefix:row.prefix,games,score:mean(games.map(g=>g.score))};C.write(file,result);console.log(`pair ${index+1}: completed`);return result;
}
function preliminaryGames(pairs){const phases={};for(const p of ["namua","mtaji"])phases[p]=mean(pairs.filter(x=>x.phase===p).map(x=>x.score));const score=mean(pairs.map(x=>x.score));return {score,phases,passed:score>=.45&&Object.values(phases).every(x=>x>=.35)};}
function checkpoint(file,run){if(fs.existsSync(file))return read(file);if(fs.existsSync(file+".started"))throw Error("Partial measurement: do not silently repeat "+file);C.write(file+".started",{started:new Date().toISOString()});const r=run();C.write(file,r);return r;}
async function main(){
 const stage=process.argv[2];assert(configs[stage],"Unknown stage");const conf=configs[stage],dir=C.OUT+"/"+stage;
 fs.mkdirSync(dir,{recursive:true});
 const correct=read(C.OUT+"/correctness.json");assert(correct.passed);
 for(const name of ["engine","ai"])assert.equal(C.sha(fs.readFileSync(C.ROOT+"/public/"+name+".js")),correct.sourceHashes[name]);
 if(stage!=="development") {
  const prior=C.OUT+"/"+order[order.indexOf(stage)-1];
  assert(read(prior+"/gate.json").passed,"Prior gate failed");
  assert(read(prior+"/independent-replay.json").passed,"Independent replay missing");
  assert(read(prior+"/independent-metrics.json").verified,"Independent metrics missing");
 }
 if(fs.existsSync(dir+"/gate.json")){console.log(JSON.stringify(read(dir+"/gate.json")));return;}
 if(!fs.existsSync(dir+"/manifest.json"))C.write(dir+"/manifest.json",{stage,commit:cp.execFileSync("git",["rev-parse","HEAD"],{cwd:C.ROOT,encoding:"utf8"}).trim(),protocolSha:C.sha(fs.readFileSync(C.DOC+"/PROTOCOL.md")),sourceHashes:correct.sourceHashes,node:process.version,started:new Date().toISOString(),argv:process.argv});
 const B=C.baseline(),N=C.candidate();
 const roots=select(B,dir,"roots",conf.rootBase,conf.roots),perf=[];
 for(let i=0;i<roots.length;i++)perf.push(checkpoint(dir+`/speed-${i}.json`,()=>performanceRoot(B,N,roots[i],i)));
 const speed=checkpoint(dir+"/speed-summary.json",()=>speedGate(perf));console.log("speed",JSON.stringify(speed));
 if(!speed.passed){C.write(dir+"/gate.json",{passed:false,stage,reason:"SPEED-GATE-FAIL",speed,later:"NOT-AUTHORIZED-NOT-EXECUTED"});return;}
 const tactics=checkpoint(dir+"/tactical.json",()=>tactical(B,N));const ops=[];
 for(let i=0;i<roots.length;i++)ops.push(...checkpoint(dir+`/operation-${i}.json`,()=>operationRoot(B,N,roots[i],i)));
 const operational=checkpoint(dir+"/operation-summary.json",()=>operationGate(ops));console.log("operation",JSON.stringify(operational));
 if(!operational.passed){C.write(dir+"/gate.json",{passed:false,stage,reason:"OPERATIONAL-HOLD",speed,operational,later:"NOT-AUTHORIZED-NOT-EXECUTED"});return;}
 const openings=select(B,dir,"games",conf.gameBase,conf.pairs),pairs=[];
 for(let i=0;i<openings.length;i++)pairs.push(pair(B,N,openings[i],i,dir));
 const games=preliminaryGames(pairs);
 // Final statistical decision is made by independent verifier, not this screening summary.
 C.write(dir+"/gate.json",{passed:stage==="holdout"?true:games.passed,stage,reason:stage==="holdout"?"AWAITING-INDEPENDENT-FINAL-DECISION":games.passed?"PASS":"STRENGTH-SCREEN-HOLD",speed,operational,games,tacticalPassed:tactics.passed});
 console.log("gate",JSON.stringify(read(dir+"/gate.json")));
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={speedGate,operationGate};
