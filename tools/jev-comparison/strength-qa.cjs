'use strict';
// Network-free regression tests. Every ledger write is in an isolated temporary copy.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),A=require('node:assert/strict');
const C=require('./core.cjs'),B=require('./budget.cjs'),H=require('./strength-v1-design/source-history-manifest.json');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'bao-strength-qa-'));let cases=0;const passed=[];
globalThis.fetch=async()=>{throw new Error('REAL_API_FORBIDDEN');};
const hash=v=>C.sha256(JSON.stringify(v)),read=f=>JSON.parse(fs.readFileSync(f));
function manifests(kit){
 for(const[name,names]of[['pilot-v3-manifest.json',['pilot-v3.cjs','reviewed-client.cjs','PILOT_V3.md']],['strength-manifest.json',Object.keys(read(path.join(kit,'strength-manifest.json')).files)]]){
  const m=read(path.join(kit,name));m.files=Object.fromEntries(names.map(n=>[n,C.sha256(fs.readFileSync(path.join(kit,n)))]));fs.writeFileSync(path.join(kit,name),JSON.stringify(m,null,2)+'\n');
 }
}
function make(){
 const repo=path.join(temp,'case-'+cases++),kit=path.join(repo,'tools/jev-comparison');fs.mkdirSync(kit,{recursive:true});
 for(const n of fs.readdirSync(__dirname)){if(n==='results')continue;const p=path.join(__dirname,n);if(fs.statSync(p).isFile()||n==='strength-v1-design')fs.cpSync(p,path.join(kit,n),{recursive:true});}
 fs.cpSync(path.resolve(__dirname,'../../public'),path.join(repo,'public'),{recursive:true});
 const data={};for(const n of Object.keys(H)){data[n]=read(path.join(__dirname,n));const dest=path.join(kit,n);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(__dirname,n),dest);}
 const L=require(path.join(kit,'latency-diagnostic.cjs')),ledgerDir=path.join(repo,'.git/jev-comparison',C.config.experimentId);
 const old=new B.Ledger(ledgerDir,L.binding()),accounts=read(path.join(kit,'strength-history-accounts.json'));
 for(const h of accounts.filter(h=>h.id!=='response-diagnostic-v1'&&!h.id.startsWith('pilot-v3-'))){old.reserve(h.id,h.stage,h.requestHash,1500);old.settle(h.id,h.inputTokens,h.status);}
 old.halt('invalid-response');const halt=old.previous;
 const h=accounts.find(h=>h.id==='response-diagnostic-v1');old.append({type:'reserve',id:h.id,stage:h.stage,requestHash:h.requestHash,timeoutMs:5000,reserveNano:B.RESERVE_NANO});old.settle(h.id,h.inputTokens,h.status);
 const reviewed=path.join(kit,'reviewed-client.cjs');fs.writeFileSync(reviewed,fs.readFileSync(reviewed,'utf8').replace('7b23e4799d3df097795b8c6430ccf719b82d9361ca81008219234d05fb2ffead',halt));
 manifests(kit);
 const R=require(reviewed),v3=new R.ReviewedLedger(ledgerDir,L.binding());v3.resumeReviewed('1'.repeat(64),'2'.repeat(64),true);
 for(const h of accounts.filter(h=>h.id.startsWith('pilot-v3-'))){v3.reserve(h.id,h.stage,h.requestHash,1500);v3.settle(h.id,h.inputTokens,h.status);}
 const S=require(path.join(kit,'strength-ledger.cjs')),D=require(path.join(kit,'strength-v1.cjs')),N=require(path.join(kit,'strength-client.cjs')),T=require(path.join(kit,'strength-stats.cjs'));
 const ledger=new S.StrengthLedger(ledgerDir,L.binding()),before=fs.readFileSync(ledger.file,'utf8');S.historicalCheck(ledger);
 const env={repo,kit,output:path.join(kit,'results'),root:path.join(kit,'results/strength-v1'),ledgerDir,spec:S.specification(),head:C.config.baselineCommit};
 const e=C.makeEngine(repo,{hooked:true});return{repo,kit,data,L,S,D,N,T,ledger,before,env,e};
}
function register(x){x.ledger.register();A(fs.readFileSync(x.ledger.file,'utf8').startsWith(x.before));}
function fake(x,modes=['ok']){
 let calls=0,clock=Date.now();const transport=async(url,o)=>{
  A.equal(url,'https://api.typesafe.ai/v1/systemone');A.equal(o.redirect,'error');A(o.signal);const mode=modes[Math.min(calls++,modes.length-1)];
  if(mode==='timeout'||mode==='network'){const e=new Error('SECRET_FAKE_KEY');e.name=mode==='timeout'?'TimeoutError':'TypeError';throw e;}
  if(mode.startsWith('http-'))return{ok:false,status:+mode.slice(5),headers:{get:()=>mode==='http-429'?'120':null},body:{cancel:async()=>{}}};
  if(mode==='json')return{ok:true,status:200,json:async()=>{throw new SyntaxError('SECRET_FAKE_KEY');}};
  const p=JSON.parse(o.body),ids=Object.keys(p.questions.priority.criteria),data={model:mode==='model'?'wrong':C.config.model,
   answers:{priority:{type:'choice',choice:ids[0],confidence:1,probabilities:Object.fromEntries(ids.map((id,i)=>[id,i===0?(mode==='invalid'?.99:1):0]))}},usage:{input_tokens:mode==='excess'?65537:100,output_tokens:1}};
  if(mode==='missing')delete data.usage;return{ok:true,status:200,json:async()=>data};
 };
 return{calls:()=>calls,advance:n=>clock+=n,client:retry=>x.N.createClient(x.ledger,x.env.root,'SECRET_FAKE_KEY',{transport,now:()=>clock,allowRetry:retry})};
}
function factory(x){return()=>{const e=C.makeEngine(x.repo,{hooked:true});return{...e,analyze:(s,o)=>e.analyze(s,{...o,maxDepth:1})};};}
function saveGame(x,item=x.S.games('pilot')[0]){const g={...C.clone(item),specHash:x.env.spec.planHash,environment:x.D.stamp(),state:C.clone(item.initialState),moves:[],status:'PAUSED',clockDeviation:false,pause:null};C.atomicJSON(x.D.gameFile(x.env,item.id),g);return g;}
const silent={log:()=>{}};
async function test(name,fn){await fn();passed.push(name);console.log('PASS '+name);}
(async()=>{try{
 await test('history totals preserved; scoped IDs, stages and max attempts enforced',async()=>{
  const x=make();register(x);A.equal(x.ledger.summary().requests,106);A.equal(x.ledger.totals().total,24455760);A.equal(x.ledger.totals().uncertain,16515072);
  const id=x.S.games('pilot')[0].id+'-ply-0-attempt-1';A.throws(()=>x.ledger.reserve(id,'matches','a',60000));A.throws(()=>x.ledger.reserve(id,'pilot','a',1500));A.throws(()=>x.ledger.reserve(id.replace('-1','-3'),'pilot','a',60000));
  A.throws(()=>x.ledger.reserve('pilot-v3-pair-0-game-0-ply-9','pilot','a',1500));
  const reloaded=new x.S.StrengthLedger(x.env.ledgerDir,x.L.binding());A.equal(reloaded.records.size,106);A.deepEqual(reloaded.strengthScope.spec,x.env.spec);
 });
 await test('full 2000 ms remains after slow or recovered API; no error fallback; forced move skips API',async()=>{
  const x=make(),state=x.S.games('pilot')[0].initialState,bounded=factory(x)();let opts,calls=0;
  const e={...bounded,analyze:(s,o)=>{opts=o;return bounded.analyze(s,o);}};
  const packet=C.requestFor(x.e,state),data={model:C.config.model,answers:{priority:{type:'choice',choice:Object.keys(packet.keyById)[0],confidence:1,probabilities:Object.fromEntries(Object.keys(packet.keyById).map((id,i)=>[id,i?0:1]))}}};
  const client={evaluate:async()=>{calls++;await new Promise(r=>setTimeout(r,90));return{status:'ok',...C.validateResponse(data,packet),elapsedMs:50000,recovered:true};}};
  const d=await x.D.decide(e,state,{candidate:true,client});A.equal(opts.timeLimitMs,2000);A.equal(opts.maxDepth,12);A.equal(d.recoveryDebitMs,0);A(d.preSearchMs>=85);A(d.searchElapsedMs<2000);A.equal(calls,1);
  let searched=false;await A.rejects(x.D.decide({...e,analyze:()=>{searched=true;}},state,{candidate:true,client:{evaluate:async()=>{throw new Error('API-PAUSED');}}}),/API-PAUSED/);A.equal(searched,false);
  const old=x.data['results/games/pilot-pair-0-game-0.json'];const forced=C.clone(x.e.E.applyMoveForSearch(old.initialState,old.moves[0].decision.move).state);
  A.equal((await x.D.decide(bounded,forced,{candidate:true,client:{evaluate:async()=>{throw new Error('must not call');}}})).remote.status,'forced-move');
 });
 await test('one explicit retry, minimum wait, same payload, no third attempt',async()=>{
  const x=make();register(x);const f=fake(x,['timeout','invalid']),g=saveGame(x),id=g.id+'-ply-0',packet=C.requestFor(x.e,g.state);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/API-PAUSED/);A.equal(f.calls(),1);
  await A.rejects(f.client(false).evaluate(packet,{id,stage:'pilot'}),/API-PAUSED/);A.equal(f.calls(),1);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/RETRY-WAIT/);f.advance(61000);
  const wrong=C.clone(packet);wrong.body.state.rootPlayer=1-wrong.body.state.rootPlayer;
  await A.rejects(f.client(true).evaluate(wrong,{id,stage:'pilot'}),/INTEGRITY/);A.equal(f.calls(),1);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/ATTEMPTS-EXHAUSTED/);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/ATTEMPTS-EXHAUSTED/);A.equal(f.calls(),2);
  A.equal(x.ledger.records.size,108);A.equal(x.ledger.totals().uncertain,16515072+B.RESERVE_NANO);
 });
 await test('Retry-After 120 seconds and valid second answer retained across restart',async()=>{
  const x=make();register(x);const f=fake(x,['http-429','ok']),g=saveGame(x),id=g.id+'-ply-0',packet=C.requestFor(x.e,g.state);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/API-PAUSED/);f.advance(61000);
  await A.rejects(f.client(true).evaluate(packet,{id,stage:'pilot'}),/RETRY-WAIT/);f.advance(60000);
  const good=await f.client(true).evaluate(packet,{id,stage:'pilot'});A.equal(good.status,'ok');A.equal(f.calls(),2);
  A.equal((await f.client(false).evaluate(packet,{id,stage:'pilot'})).status,'ok');A.equal(f.calls(),2);
 });
 await test('invalid JSON/network/5xx retry; model/4xx/excess usage stop; missing usage retains reserve',async()=>{
  for(const mode of['json','network','http-503','model','http-401','http-400','excess','missing']){
   const x=make();register(x);const f=fake(x,[mode]),g=saveGame(x),packet=C.requestFor(x.e,g.state),id=g.id+'-ply-0';
   if(mode==='missing'){const rr=await f.client(false).evaluate(packet,{id,stage:'pilot'});A.equal(rr.status,'ok');A.equal(x.ledger.totals().uncertain,16515072+B.RESERVE_NANO);}
   else{await A.rejects(f.client(false).evaluate(packet,{id,stage:'pilot'}));A.equal(x.ledger.halted,['model','http-401','http-400','excess'].includes(mode));}
   A.equal(f.calls(),1);const text=fs.readdirSync(path.join(x.env.root,'responses')).map(n=>fs.readFileSync(path.join(x.env.root,'responses',n),'utf8')).join('');A(!text.includes('SECRET_FAKE_KEY'));
  }
 });
 await test('crash after reservation never resends same attempt; durable answer before settlement is recovered',async()=>{
  const x=make();register(x);const g=saveGame(x),packet=C.requestFor(x.e,g.state),id=g.id+'-ply-0',f=fake(x),aid=id+'-attempt-1',files=x.N.files(x.env.root,aid);
  C.atomicJSON(files.request,{id:aid,requestHash:hash(packet.body),body:packet.body,keyById:packet.keyById,packet});x.ledger.reserve(aid,'pilot',hash(packet.body),60000);
  await A.rejects(f.client(false).evaluate(packet,{id,stage:'pilot'}),/API-PAUSED/);A.equal(f.calls(),0);
  f.advance(121000);A.equal((await f.client(true).evaluate(packet,{id,stage:'pilot'})).status,'ok');A.equal(f.calls(),1);A.equal(x.ledger.totals().uncertain,16515072+B.RESERVE_NANO);
  const y=make();register(y);const gy=saveGame(y),fy=fake(y),py=C.requestFor(y.e,gy.state),iy=gy.id+'-ply-0';
  const settle=y.ledger.settle.bind(y.ledger);y.ledger.settle=()=>{throw new Error('CRASH_BEFORE_SETTLE');};
  await A.rejects(fy.client(false).evaluate(py,{id:iy,stage:'pilot'}),/CRASH/);A.equal(fy.calls(),1);
  y.ledger.settle=settle;A.equal((await fy.client(false).evaluate(py,{id:iy,stage:'pilot'})).status,'ok');A.equal(fy.calls(),1);
  A(y.ledger.records.get(iy+'-attempt-1').settled);
 });
 await test('saved answer tampering or deletion blocks resending',async()=>{
  const x=make();register(x);const f=fake(x),g=saveGame(x),id=g.id+'-ply-0',p=C.requestFor(x.e,g.state);await f.client(false).evaluate(p,{id,stage:'pilot'});
  const file=x.N.files(x.env.root,id+'-attempt-1').answer,old=fs.readFileSync(file);const bad=read(file);bad.result.confidence=.7;C.atomicJSON(file,bad);
  await A.rejects(f.client(true).evaluate(p,{id,stage:'pilot'}),/INTEGRITY/);fs.writeFileSync(file,old);fs.unlinkSync(file);
  await A.rejects(f.client(true).evaluate(p,{id,stage:'pilot'}),/MISSING_ANSWER/);A.equal(f.calls(),1);
 });
 await test('budget stop before send; prior unconfirmed reservations remain',async()=>{
  const x=make();register(x);const g=saveGame(x),f=fake(x),orig=x.ledger.totals.bind(x.ledger);
  x.ledger.totals=()=>({...orig(),total:B.WORK_NANO-B.RESERVE_NANO+1});
  await A.rejects(f.client(false).evaluate(C.requestFor(x.e,g.state),{id:g.id+'-ply-0',stage:'pilot'}),/BUDGET_STOP/);A.equal(f.calls(),0);
  x.ledger.totals=()=>({...orig(),stages:{...orig().stages,pilot:B.STAGES.pilot-B.RESERVE_NANO+1}});
  await A.rejects(f.client(false).evaluate(C.requestFor(x.e,g.state),{id:g.id+'-ply-0',stage:'pilot'}),/BUDGET_STOP/);A.equal(f.calls(),0);
 });
 await test('game runner checkpoints moves and resumes; API failure makes no fallback move; formal gate blocks',async()=>{
  const x=make();register(x);const f=fake(x);let count=0;
  const result=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x),choose:async(e,s,o)=>{const d=await x.D.decide(e,s,o);count++;return d;},shouldPause:()=>count>=3});
  A.equal(result.games[0].plies,3);const first=read(x.D.gameFile(x.env,x.S.games('pilot')[0].id)).moves;
  let more=0;await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x),choose:async(e,s,o)=>{const d=await x.D.decide(e,s,o);more++;return d;},shouldPause:()=>more>=2});
  A.deepEqual(read(x.D.gameFile(x.env,x.S.games('pilot')[0].id)).moves.slice(0,3),first);
  await A.rejects(x.D.run(x.env,x.ledger,f.client(false),'formal',{...silent,engineFactory:factory(x)}),/4局/);
  const y=make();register(y);const fy=fake(y,['timeout']);const r=await y.D.run(y.env,y.ledger,fy.client(false),'pilot',{...silent,engineFactory:factory(y)});
  A.equal(r.status,'API-PAUSED');A.equal(r.games[0].plies,0);A.equal(fy.calls(),1);
 });
 await test('four complete synthetic pilot games pass gate; completed run makes no extra requests',async()=>{
  const x=make();register(x);const f=fake(x);
  const result=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x)});
  A.equal(result.status,'PILOT-COMPLETE');A.equal(result.pilot.decision,'PILOT-PASS');A.equal(result.games.length,4);
  const calls=f.calls();const again=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x)});
  A.equal(again.pilot.decision,'PILOT-PASS');A.equal(f.calls(),calls);
  for(const[n,v]of Object.entries(x.data))A.deepEqual(read(path.join(x.kit,n)),v);
 });
 await test('decision checkpoint after crash is reused without a second search or API call',async()=>{
  const x=make();register(x);const f=fake(x),item=x.S.games('pilot')[0];const g=saveGame(x,item);
  const d=await x.D.decide(factory(x)(),g.state,{candidate:true,client:f.client(false),id:item.id+'-ply-0',stage:'pilot'});
  const row={ply:0,stateHash:hash(g.state),competitor:'jev',decision:d};C.atomicJSON(x.D.decisionFile(x.env,item.id+'-ply-0'),row);
  x.D.validateDecision(x.e,g.state,row,item,x.ledger,x.env,{repair:true});let checks=0;
  const result=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x),
   choose:()=>{throw new Error('must reuse saved move');},shouldPause:()=>++checks>=3});
  A.equal(result.games[0].plies,1);A.equal(f.calls(),1);A.deepEqual(read(x.D.gameFile(x.env,item.id)).moves[0],row);
 });
 await test('clock overrun preserved as a move and blocks continuation and conclusions',async()=>{
  const x=make();register(x);const f=fake(x);const r=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x),choose:async(e,s,o)=>{
   const d=await x.D.decide(e,s,o);return{...d,searchElapsedMs:2051,deadlineOverrunMs:51};}});
  A.equal(r.status,'CLOCK-DEVIATION');A.equal(r.games[0].plies,1);A.equal(r.pilot.decision,'INCOMPLETE');const before=f.calls();
  const second=await x.D.run(x.env,x.ledger,f.client(false),'pilot',{...silent,engineFactory:factory(x)});A.equal(second.status,'TECHNICAL-STOP');A.equal(f.calls(),before);
 });
 await test('statistics match frozen examples, incomplete data has no p-value, rule caps are not draws',async()=>{
  const x=make(),examples=read(path.join(x.kit,'strength-v1-design/statistical-examples.json'));
  // Independent exact polynomial reference for every n <= 32.
  for(let n=1;n<=32;n++)for(let a=0;a<=n;a++){let sum=0,comb=1;for(let k=0;k<=Math.min(a,n-a);k++){if(k)comb*=((n-k+1)/k);sum+=comb/2**n;}A(Math.abs(x.T.exact(a,n-a).pValue-Math.min(1,2*sum))<1e-12);}
  A(Math.abs(x.T.exact(10,2).pValue-.03857421875)<1e-12);A(Math.abs(x.T.exact(9,3).pValue-.14599609375)<1e-12);A.equal(x.T.exact(0,0).q95,null);
  const gs=x.S.games('formal').map((g,i)=>({...g,status:'TERMINAL',winner:i<20?g.candidatePlayer:i<24?1-g.candidatePlayer:g.seat===0?g.candidatePlayer:1-g.candidatePlayer}));
  A.equal(x.T.summarize(gs,'formal').decision,'JEV-SUPERIOR');A.equal(x.T.summarize(gs.slice(0,63),'formal').decision,'INCOMPLETE');A(!('pValue'in x.T.summarize(gs.slice(0,63),'formal')));
  A.equal(x.D.finalStatus({state:{reason:'relay-limit',winner:0},moves:[]}), 'ENGINE-LIMIT');A.equal(x.D.finalStatus({state:{reason:'',winner:null},moves:Array(512)}),'UNRESOLVED');
 });
 await test('CLI preflight has zero network and no ledger writes; missing ledger and main branch rejected',async()=>{
  const x=make(),guard=path.join(temp,'guard.cjs');
  fs.writeFileSync(guard,`globalThis.fetch=async()=>{throw new Error('REAL_API_FORBIDDEN')};require('node:child_process').execFileSync=(cmd,args)=>{if(cmd!=='git')throw new Error('unexpected');if(args.includes('--show-current'))return process.env.QA_BAD_BRANCH?'main':'${C.config.branch}';if(args.includes('--git-common-dir'))return '.git';if(args.includes('merge-base'))return '';if(args.includes('HEAD'))return '${C.config.baselineCommit}';throw new Error('unexpected git');};`);
  const env={...process.env};delete env.TYPESAFE_API_KEY;
  const cli=(args,extra={})=>cp.spawnSync(process.execPath,['--require',guard,path.join(x.kit,'strength-v1.cjs'),...args],{env:{...env,...extra},encoding:'utf8'});
  const p=cli(['preflight']);A.equal(p.status,0,p.stderr);A.equal(JSON.parse(p.stdout).realApiRequests,0);A.equal(fs.readFileSync(x.ledger.file,'utf8'),x.before);
  A.equal(cli(['preflight'],{QA_BAD_BRANCH:'1'}).status,1);A.equal(cli(['run','pilot']).status,1);A.equal(cli(['run','pilot','--live']).status,1);
  for(const[n,v]of Object.entries(x.data))A.deepEqual(read(path.join(x.kit,n)),v);
  fs.renameSync(x.ledger.file,x.ledger.file+'.kept');A.equal(cli(['preflight']).status,1);A(!fs.existsSync(x.ledger.file));
 });
 const report={status:'PASS',tests:passed,checks:passed.length,realApiRequests:0,syntheticLedgersOnly:true,syntheticLedgerNote:'Only isolated test copies substitute the old halt hash; shipped code and user data are unchanged.',createdAt:new Date().toISOString()};
 console.log(JSON.stringify(report,null,2));if(process.env.STRENGTH_QA_REPORT)C.atomicJSON(process.env.STRENGTH_QA_REPORT,report);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
