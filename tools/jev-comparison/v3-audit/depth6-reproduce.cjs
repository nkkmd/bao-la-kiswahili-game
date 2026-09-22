'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const C=require('../core.cjs');
const input=JSON.parse(fs.readFileSync(path.join(__dirname,'cached-positions.json'))),hash=x=>C.sha256(JSON.stringify(x));
const output=path.resolve(__dirname,'../results/depth6-reproduction');
const settings={id:'pilot-v3-cached-depth6-v1',scope:'post-hoc exploratory mechanism comparison',sourcePlanHash:'da98ddc1290cbfc99b96fc6389ac7aa86b2a4abe3e82f8350e7c6fbcd7d0c5be',sourceSelection:'all 61 valid Jev responses from pilot-v3, including paused game; timeout and forced moves have no usable Jev response',inputHash:hash(input),positions:input.length,maxDepth:6,timeLimitMsPerSearch:10000,order:'baseline first on even index, candidate first on odd index',warmup:'initial state depth 2 once per engine',metric:'stats.nodes; quiescenceNodes separately; same-depth completed searches only',apiWaiting:'excluded; cached responses, no new API calls',formalStatus:'NOT-STARTED'};
assert.equal(input.length,61);C.atomicJSON(path.join(output,'plan.json'),{...settings,planHash:hash(settings)});
globalThis.fetch=async()=>{throw new Error('API_DISABLED');};
const base=C.makeEngine(path.resolve(__dirname,'../../..'),{hooked:true}),candidate=C.makeEngine(path.resolve(__dirname,'../../..'),{hooked:true});
for(const e of [base,candidate])e.analyze(e.E.initialState(),{maxDepth:2,timeLimitMs:10000});
const rows=[];
for(let i=0;i<input.length;i++){
 const p=input[i],r={id:p.id,stateHash:hash(p.state),phase:p.phase,legalCount:p.legalCount,order:i%2?'candidate-first':'baseline-first'};
 const analyze=(e,probabilities)=>e.analyze(p.state,{probabilities,maxDepth:settings.maxDepth,timeLimitMs:settings.timeLimitMsPerSearch});
 if(i%2){r.candidate=analyze(candidate,p.probabilities);r.baseline=analyze(base,null);}else{r.baseline=analyze(base,null);r.candidate=analyze(candidate,p.probabilities);}
 r.bothComplete=r.baseline.stats.completedDepth===settings.maxDepth && r.candidate.stats.completedDepth===settings.maxDepth && !r.baseline.stats.timedOut && !r.candidate.stats.timedOut;
 r.sameScore=r.baseline.stats.rootScore===r.candidate.stats.rootScore;r.sameMove=base.AI.moveKey(r.baseline.move)===base.AI.moveKey(r.candidate.move);
 rows.push(r);C.atomicJSON(path.join(output,'rows.json'),rows);
 if((i+1)%10===0)console.log('Cached positions '+(i+1)+'/'+input.length);
}
const paired=rows.filter(r=>r.bothComplete),sum=(rs,side,key)=>rs.reduce((s,r)=>s+r[side].stats[key],0),median=a=>{a=a.slice().sort((x,y)=>x-y);const m=(a.length-1)/2;return(a[Math.floor(m)]+a[Math.ceil(m)])/2;};
function comparison(rs){const bn=sum(rs,'baseline','nodes'),cn=sum(rs,'candidate','nodes');return{positions:rs.length,baselineNodes:bn,candidateNodes:cn,nodeChangePercent:(cn/bn-1)*100,medianNodeRatio:median(rs.map(r=>r.candidate.stats.nodes/r.baseline.stats.nodes)),fewerNodes:rs.filter(r=>r.candidate.stats.nodes<r.baseline.stats.nodes).length,equalNodes:rs.filter(r=>r.candidate.stats.nodes===r.baseline.stats.nodes).length,moreNodes:rs.filter(r=>r.candidate.stats.nodes>r.baseline.stats.nodes).length,baselineQuiescenceNodes:sum(rs,'baseline','quiescenceNodes'),candidateQuiescenceNodes:sum(rs,'candidate','quiescenceNodes'),sameScore:rs.filter(r=>r.sameScore).length,sameMove:rs.filter(r=>r.sameMove).length};}
const report={status:paired.length===rows.length?'COMPLETE':'PARTIAL-DEPTH',settings,planHash:hash(settings),executionEnvironment:{where:'offline reproduction in the executing environment',node:process.version,platform:process.platform,cpu:os.cpus()[0]?.model},realApiRequests:0,newApiCostUSD:0,primary:comparison(paired),byPhase:Object.fromEntries(['namua','mtaji'].map(ph=>[ph,comparison(paired.filter(r=>r.phase===ph))])),bySourcePair:Object.fromEntries([0,1,2].map(pair=>[pair,comparison(paired.filter(r=>r.id.startsWith('pilot-v3-pair-'+pair+'-')))])),incomplete:rows.filter(r=>!r.bothComplete).map(r=>r.id),limitations:['Post-hoc selected pilot trajectories; correlated positions, not independent samples','Cached valid responses only; response failures excluded from this mechanism calculation and reported separately','Fixed depth 6; does not measure real-time playing strength or API-inclusive user-PC latency','Changing a tied best move does not by itself indicate correctness failure'],rowsHash:hash(rows)};
C.atomicJSON(path.join(output,'report.json'),report);console.log(JSON.stringify(report,null,2));
