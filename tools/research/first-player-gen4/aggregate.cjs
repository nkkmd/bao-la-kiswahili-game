'use strict';
const fs = require('node:fs');
const path = require('node:path');
const C = require('./common.cjs');
const {protocol: P, sha, canonical, assert, atomic, clone} = C;
const {replay, taskList} = require('./run.cjs');
function files(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(x => x.isDirectory() ? files(path.join(dir,x.name)) : [path.join(dir,x.name)]);
}
function quantile(a,p) { const n=(a.length-1)*p, i=Math.floor(n); return a[i]+(a[Math.min(i+1,a.length-1)]-a[i])*(n-i); }
function bootstrap(rows, alpha, samples=P.bootstrapSamples) {
  const map=new Map();
  for(const r of rows) {const v=map.get(r.cluster)||[];v.push(r);map.set(r.cluster,v);}
  const clusters=[...map.values()], random=C.rng(C.seedFor(P.bootstrapSeed, rows.length, alpha));
  if(!clusters.length)return {clusters:0, interval:null};
  const groups=clusters.map(g=>({n:g.length, low:g.reduce((s,r)=>s+r.low,0),high:g.reduce((s,r)=>s+r.high,0)}));
  const lows=[], highs=[];
  for(let b=0;b<samples;b++) {let n=0,lo=0,hi=0;
    for(let k=0;k<groups.length;k++) {const g=groups[Math.floor(random()*groups.length)];n+=g.n;lo+=g.low;hi+=g.high;}
    lows.push(lo/n);highs.push(hi/n);
  }
  lows.sort((a,b)=>a-b);highs.sort((a,b)=>a-b);
  return {clusters:clusters.length, interval:[quantile(lows,alpha/2),quantile(highs,1-alpha/2)]};
}
function summarize(records, alpha=.05, samples=P.bootstrapSamples) {
  const slots=new Map();
  for(const r of records) {const a=slots.get(r.slot)||[];a.push(r);slots.set(r.slot,a);}
  const rows=[];
  for(const [slot,pair] of slots) {
    assert(pair.length===2&&new Set(pair.map(r=>r.firstPlayer)).size===2,'INCOMPLETE_SEAT_PAIR');
    const scores=pair.map(r=>r.outcome.score);
    rows.push({slot, cluster:pair[0].openingHash,
      low:scores.reduce((s,x)=>s+(x??0),0)/2, high:scores.reduce((s,x)=>s+(x??1),0)/2});
  }
  const firstWins=records.filter(r=>r.outcome.score===1).length;
  const secondWins=records.filter(r=>r.outcome.score===0).length;
  const unknown=records.length-firstWins-secondWins, total=records.length;
  const reasons=Object.fromEntries([...new Set(records.map(r=>r.outcome.reason))].map(k=>[k,records.filter(r=>r.outcome.reason===k).length]));
  const perSeat=[0,1].map(seat=>{const q=records.filter(r=>r.firstPlayer===seat);return {firstSeat:seat,games:q.length,firstWins:q.filter(r=>r.outcome.score===1).length,secondWins:q.filter(r=>r.outcome.score===0).length,unresolved:q.filter(r=>r.outcome.score===null).length};});
  const uncertainty=bootstrap(rows,alpha,samples), interval=uncertainty.interval;
  let decision='INCONCLUSIVE';
  if(uncertainty.clusters<30)decision='NON-ESTIMABLE-LOW-DIVERSITY';
  else if(interval[0]>.5)decision='FIRST-ADVANTAGE-WITHIN-DOMAIN';
  else if(interval[1]<.5)decision='SECOND-ADVANTAGE-WITHIN-DOMAIN';
  else if(interval[0]>=.5-P.practicalMargin&&interval[1]<=.5+P.practicalMargin)decision='WITHIN-PRACTICAL-MARGIN';
  const turns=records.flatMap(r=>r.turns), timed=turns.filter(t=>!t.stats.forced);
  return {games:total,openingSlots:slots.size,uniqueOpeningStates:new Set(records.map(r=>r.openingStateHash)).size,
    openingClusters:uncertainty.clusters, uniqueTrajectories:new Set(records.map(r=>sha(r.openingMoves.concat(r.turns.map(t=>t.move))))).size,
    firstWins,secondWins,unresolved:unknown,firstWinRateDecisive:firstWins+secondWins?firstWins/(firstWins+secondWins):null,
    scoreIdentificationBounds:[firstWins/total,(firstWins+unknown)/total], confidenceLevel:1-alpha,
    conservativeClusterInterval:interval,decision,reasons,perSeat,
    meanTotalPlies:records.reduce((s,r)=>s+r.outcome.totalPlies,0)/total,
    meanSearchMs:timed.length?timed.reduce((s,t)=>s+t.stats.elapsedMs,0)/timed.length:0,
    meanCompletedDepth:timed.length?timed.reduce((s,t)=>s+t.stats.completedDepth,0)/timed.length:0,
    timeouts:timed.filter(t=>t.stats.timedOut).length,
    firstMoves:Object.fromEntries([...new Set(records.map(r=>canonical(r.openingMoves[0]||r.turns[0]?.move||null)))].map(k=>{const q=records.filter(r=>canonical(r.openingMoves[0]||r.turns[0]?.move||null)===k);return[k,{games:q.length,firstWins:q.filter(r=>r.outcome.score===1).length,unresolved:q.filter(r=>r.outcome.score===null).length}];}))};
}
function loadRecords(dir, manifestHash) {
  const map=new Map(), e=C.engine(), corpus=new Map();
  for(const file of files(dir).filter(f=>f.endsWith('.json')&&path.basename(path.dirname(f))==='games')) {
    const r=JSON.parse(fs.readFileSync(file));
    assert(r.study===P.id&&r.manifestHash===manifestHash,'RESULT_SOURCE');
    replay(e,r); assert(r.complete,'PARTIAL_RESULT');
    if(r.phase!=='diagnostic') {
      const key=[r.phase,r.policy,r.requestedOpeningPlies,r.slot].join('-');
      if(!corpus.has(key))corpus.set(key,C.opening(e,r.phase,r.policy,r.requestedOpeningPlies,r.slot));
      const o=corpus.get(key);
      assert(r.openingHash===o.hash&&r.openingStateHash===o.stateHash&&canonical(r.openingMoves)===canonical(o.moves),'CORPUS_REGENERATION');
      assert(canonical(r.startState)===canonical(r.firstPlayer?C.exchange(o.state):o.state),'START_STATE');
      assert(r.id===C.gameId(o,r.condition,r.firstPlayer),'GAME_ID');
    }
    if(map.has(r.id))assert(map.get(r.id).recordHash===r.recordHash,'DIVERGENT_DUPLICATE');
    else map.set(r.id,r);
  }
  return [...map.values()];
}
function aggregate(dir, phase) {
  const manifestHash=sha(C.checkFreeze()), records=loadRecords(dir,manifestHash).filter(r=>r.phase===phase);
  const expected=taskList(phase,0,'all');
  if(phase==='formal')for(let s=1;s<P.shards;s++)expected.push(...taskList(phase,s,'all'));
  const expectedIds=new Set(expected.map(t=>C.gameId({phase:t.phase,policy:t.policy,plies:t.plies,slot:t.slot},t.condition,t.seat)));
  assert(records.length===expectedIds.size&&records.every(r=>expectedIds.has(r.id)),`INCOMPLETE_DOMAIN: ${records.length}/${expectedIds.size}`);
  const groups={};
  for(const policy of P.policies)for(const plies of (phase==='sensitivity'?P.sensitivityOpeningPlies:[P.openingPlies]))for(const condition of P.conditions) {
    const q=records.filter(r=>r.policy===policy&&r.requestedOpeningPlies===plies&&r.condition===condition);
    if(!q.length)continue;
    const primary=phase==='formal'&&condition===P.primaryCondition;
    groups[`${policy}-${plies}-${condition}`]=summarize(q,primary?P.primaryFamilyAlpha/P.primaryDomains:.05);
  }
  const comparisons={};
  if(phase==='formal')for(const policy of P.policies)for(const target of ['G4D6','G4E2000','G3D4']) {
    const rows=[];
    for(let slot=0;slot<P.formalSlotsPerPolicy;slot++) {
      const a=records.filter(r=>r.policy===policy&&r.condition==='G4D4'&&r.slot===slot);
      const b=records.filter(r=>r.policy===policy&&r.condition===target&&r.slot===slot);
      const good=[...a,...b].every(r=>r.outcome.score!==null);
      if(good)rows.push({cluster:a[0].openingHash,low:(b[0].outcome.score+b[1].outcome.score-a[0].outcome.score-a[1].outcome.score)/2,high:(b[0].outcome.score+b[1].outcome.score-a[0].outcome.score-a[1].outcome.score)/2});
    }
    comparisons[`${policy}-G4D4-v-${target}`]={completePairs:rows.length,descriptiveOnly:true,
      difference:rows.length?rows.reduce((s,r)=>s+r.low,0)/rows.length:null,
      interval:bootstrap(rows,.05).interval};
  }
  const result={study:P.id,phase,manifestHash,status:'VERIFIED-COMPLETE-DOMAIN',games:records.length,
    inferenceScope:'CONDITIONAL-SELFPLAY-ONLY',groups,comparisons,
    unknownIsNotDraw:true,diagnosticIsNotIndependentSample:true,provenance:C.provenance()};
  atomic(path.join(dir,`${phase}-summary.json`),result);
  return result;
}
function report(dir) {
  const percent=v=>v===null?'未推定':(100*v).toFixed(2)+'%';
  const rows=['# AI-GEN4先攻・後攻差追加研究 — 自動集計','',
    'この集計は固定した序盤分布とAI条件に対する自己対局結果であり、Baoの理論的な必勝・均衡の証明ではありません。',
    '打切り、循環、連続種まき上限、固定深度未達は未決着です。区間には、未決着をすべて先攻負け・すべて先攻勝ちとした不確実性を含めます。',
    '座席交換対局は一組、重複開局は一クラスタとして扱います。主試験expertの2領域には97.5%区間、それ以外には探索的95%区間を示します。','',
    '|段階・条件|開局スロット|異なる開局局面|先攻勝|後攻勝|未決着|決着局先攻勝率|保守的区間|判断|',
    '|---|---:|---:|---:|---:|---:|---:|---|---|'];
  for(const phase of ['pilot','formal','sensitivity']) {
    const f=path.join(dir,`${phase}-summary.json`);if(!fs.existsSync(f))continue;
    const r=JSON.parse(fs.readFileSync(f));for(const [k,g]of Object.entries(r.groups))rows.push(`|${phase} / ${k}|${g.openingSlots}|${g.uniqueOpeningStates}|${g.firstWins}|${g.secondWins}|${g.unresolved}|${percent(g.firstWinRateDecisive)}|${g.conservativeClusterInterval.map(percent).join('〜')}|${g.decision}|`);
  }
  rows.push('','判断トークンは機械定義です。FIRST / SECONDは当該領域内の先攻 / 後攻方向、WITHIN-PRACTICAL-MARGINは±3ポイント内、INCONCLUSIVEは不確実、NON-ESTIMABLE-LOW-DIVERSITYは異なる開局系列が30未満で推定を確定しない状態です。',
    '予備試験の数値は正式な結論に使いません。条件差は完全な対応対局だけの探索的解析で、未決着除外の影響を受けます。');
  fs.writeFileSync(path.join(dir,'REPORT.md'),rows.join('\n')+'\n');
}
if(require.main===module){try{const [cmd,dir,phase]=process.argv.slice(2);if(cmd==='report')report(dir);else{const r=aggregate(dir,phase);console.log(JSON.stringify({phase:r.phase,games:r.games,status:r.status}));}}catch(e){console.error(e.stack);process.exitCode=1;}}
module.exports={files,bootstrap,summarize,loadRecords,aggregate,report};
