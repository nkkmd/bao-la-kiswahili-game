"use strict";
const C=require("./lib/pbai-p4-common.js");
const fs=require("node:fs"),os=require("node:os"),cp=require("node:child_process");
const target=C.OUT+"/baseline-diagnostic.json";
if(fs.existsSync(target))throw Error("Diagnostic already consumed");
const {E,A}=C.baseline(),rows=[];let transitions=0,events=0,snapshots=0;
const start=performance.now();
for(let seed=811000001;seed<=811000008;seed++){
 let s=E.initialState(),r=C.rng(seed);
 for(let ply=0;ply<80&&s.winner===null;ply++){
  if([12,52].includes(ply)){const a=A.analyzeMove(s,"hard",C.rng(seed),{maxDepth:2,timeLimitMs:Infinity});rows.push({seed,ply,phase:s.phase,stats:a.stats});}
  const moves=E.moveVariants(s),result=E.applyMove(s,moves[Math.floor(r()*moves.length)]);
  transitions++;events+=result.events.length;snapshots+=result.events.filter(e=>e.state).length;s=result.state;
 }
}
C.write(target,{baseline:C.BASE,node:process.version,cpu:os.cpus()[0].model,platform:process.platform,arch:process.arch,cpus:os.availableParallelism(),totalMemory:os.totalmem(),transitions,events,snapshots,elapsedMs:performance.now()-start,rows});
const sources={};for(const name of ["engine.js","ai.js","ai-weights.js","ai-config.js","ai-worker.js","main.js","index.html","service-worker.js"]){const p="public/"+name;sources[p]=C.sha(fs.readFileSync(C.ROOT+"/"+p));}
C.write(C.DOC+"/BASELINE.json",{id:"AI-GEN2-BASELINE-2026-09-06-v1",commit:C.BASE,sources,node:process.version,cpu:os.cpus()[0].model,platform:process.platform,arch:process.arch,release:os.release(),diagnosticSha256:C.sha(fs.readFileSync(target)),liveDeploymentVerified:false});
console.log(JSON.stringify({transitions,events,snapshots,rows,elapsedMs:performance.now()-start}));
