"use strict";
(function(root){
 const assert=(v,m)=>{if(!v)throw Error(m);};
 const stable=a=>{const {elapsedMs,...stats}=a.stats;return JSON.stringify({move:a.move,stats});};
 function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
 const tiers={low:{hardwareConcurrency:2,deviceMemory:2},standard:{hardwareConcurrency:4,deviceMemory:4},high:{hardwareConcurrency:8,deviceMemory:4}};
 function workerSearch(actor,fixture,options){return new Promise((resolve,reject)=>{
  const start=performance.now(),worker=new Worker(actor+'-worker.js');let done=false;
  const finish=(error,data)=>{if(done)return;done=true;clearTimeout(timer);worker.terminate();if(error)reject(error);else resolve({...data,wallTimeMs:performance.now()-start});};
  const timer=setTimeout(()=>finish(Error('Worker応答が10秒以内に届きません')),10000);
  worker.onerror=e=>finish(Error(e.message));worker.onmessage=e=>finish(e.data.type==='error'?Error(e.data.message):null,e.data);
  worker.postMessage({type:'search',id:fixture.seed,seed:fixture.seed,state:fixture.state,level:'hard',options});
 });}
 async function run(fixtures,progress=()=>{}){
  const rows=[];const check=(r,f,actor,fixed)=>{
   assert(r.type==='result'&&r.id===f.seed,'応答形式');assert(r.positionKey===root.BaoAI.stateKey(f.state),'局面識別子');
   assert(root.BaoEngine.moveVariants(f.state).some(m=>root.BaoAI.moveKey(m)===root.BaoAI.moveKey(r.move)),'合法手');
   assert(Number.isFinite(r.stats.rootScore)&&Number.isFinite(r.stats.elapsedMs),'有限数');
   if(fixed)assert(stable(r)===JSON.stringify(f.expected[actor]),'固定深さの参照結果と不一致');
  };
  for(const [tier,caps] of Object.entries(tiers))for(const actor of ['baseline','logic']){
   for(const f of fixtures.rows){
    const options={...root.BaoAIConfig.searchOptions('hard',caps),maxDepth:2,timeLimitMs:Infinity};
    const r=await workerSearch(actor,f,options);check(r,f,actor,true);
    rows.push({mode:'worker-fixed',tier,actor,fixture:f.name,...r});progress(rows.length);
   }
   const f=fixtures.rows[0],options=root.BaoAIConfig.searchOptions('hard',caps),r=await workerSearch(actor,f,options);check(r,f,actor,false);
   assert(r.stats.completedDepth<=options.maxDepth,'探索深さ');
   rows.push({mode:'worker-configured',tier,actor,fixture:f.name,options,...r});progress(rows.length);
  }
  for(const actor of ['baseline','logic'])for(const f of fixtures.rows){
   const options={...root.BaoAIConfig.searchOptions('hard',tiers.standard),maxDepth:2,timeLimitMs:Infinity,pbaiC015LogicGate:actor==='logic'};
   const a=root.BaoAI.analyzeMove(f.state,'hard',rng(f.seed),options);
   assert(stable(a)===JSON.stringify(f.expected[actor]),'直接実行の参照結果と不一致');
   rows.push({mode:'fallback-fixed',actor,fixture:f.name,...a});progress(rows.length);
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  assert(rows.length===78,'検証件数');
  return{passed:true,knownFixturesOnly:true,physicalDeviceVerified:false,workerRequests:60,fallbackRequests:18,modelSha256:root.BaoLogicGate.modelSha256,userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,deviceMemory:navigator.deviceMemory??null,rows};
 }
 root.BaoP9Suite={run};
})(window);
