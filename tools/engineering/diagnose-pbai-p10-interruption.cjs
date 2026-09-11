'use strict';
// 凍結検算器を変更せず読み込み、出力だけを診断専用の場所へ分離する。
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const C=require('./lib/pbai-p10-common');
const out=path.join(C.ROOT,'artifacts/pbai-p10/incident');
const original=path.join(__dirname,'verify-pbai-p10.js'),originalRequire=createRequire(original);
const diagnosticC={...C,write:(p,v)=>{assert.equal(path.basename(p),'replay-verification.json');C.write(path.join(out,'completed-pair-replay.json'),{...v,diagnosticOnly:true,formalInferenceAuthorized:false});}};
const wrapped=vm.runInThisContext('(function(require,__dirname){'+fs.readFileSync(original,'utf8')+'\n})',{filename:original});
wrapped(n=>n==='./lib/pbai-p10-common.js'?diagnosticC:originalRequire(n),path.dirname(original));
const rows=fs.readFileSync(path.join(C.OUT,'ply-access.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const access=fs.readFileSync(path.join(C.OUT,'match-access.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const sources=Object.fromEntries(Object.keys(C.SPEC.matches).flatMap(n=>{const p=path.join(C.OUT,n+'-matches-source.json');return fs.existsSync(p)?[[n,C.read(p).rows]]:[]}));
const {E,A}=C.load();let checked=0,completeLoggedGames=0;const partial=[];
for(const entry of access){const root=sources[entry.name][entry.index];assert.equal(root.seed,entry.seed);let s=root.state;const plies=rows.filter(p=>p.name===entry.name&&p.index===entry.index&&p.side===entry.side);const cfg=C.SPEC.matches[entry.name];
 for(const [n,p] of plies.entries()){
  assert.equal(p.ply,n);assert.equal(p.actor,s.player===entry.side?'logic':'baseline');assert.equal(p.seed,(880000001+Object.keys(C.SPEC.matches).indexOf(entry.name)*10000000+entry.index*1000+entry.side*200+n)>>>0);
  assert.ok(s.winner===null);assert.ok(E.moveVariants(s).some(m=>A.moveKey(m)===A.moveKey(p.move)));assert.equal(p.stats.allocatedTimeMs,cfg.timeLimitMs);assert.ok(p.stats.completedDepth<=cfg.maxDepth);
  for(const x of [p.stats.rootScore,p.stats.elapsedMs,p.elapsedMs])assert.ok(Number.isFinite(x));
  if(p.actor==='logic'){assert.equal(p.stats.evaluationCandidate,'PBAI-C015-v1');assert.equal(p.stats.evaluationFallback,false);}
  s=E.applyMove(s,p.move).state;checked++;
 }
 if(s.winner!==null||plies.length===C.SPEC.search.maxMatchPlies)completeLoggedGames++;else partial.push({...entry,recordedPlies:plies.length,terminal:false});
}
assert.equal(checked,rows.length);
const consumed=fs.readFileSync(path.join(C.OUT,'seed-access.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
C.write(path.join(out,'log-replay.json'),{passed:true,diagnosticOnly:true,formalInferenceAuthorized:false,loggedMovesChecked:checked,startedGames:access.length,completeLoggedGames,partial,consumedSourceSeeds:consumed,timedMatchesRerun:false});
console.log(JSON.stringify({diagnosticPassed:true,loggedMovesChecked:checked,completeLoggedGames,partialGames:partial.length}));
