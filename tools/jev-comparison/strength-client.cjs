'use strict';
const fs=require('node:fs'),path=require('node:path');
const {performance}=require('node:perf_hooks');
const C=require('./core.cjs'),B=require('./budget.cjs');
const {hash,read,parseAttempt}=require('./strength-ledger.cjs');
const retryable=s=>['timeout','network-error','invalid-response','invalid-json','interrupted-request','http-429'].includes(s)||/^http-5\d\d$/.test(s);
function stop(code,details={}){const e=new Error(code);e.details=details;return e;}
function files(root,id){const stem=C.sha256(id)+'.json';return{request:path.join(root,'requests',stem),answer:path.join(root,'responses',stem)};}
function verifySaved(ledger,root,id,packet,{repair=false}={}){
 const f=files(root,id),r=ledger.records.get(id);C.assert(r,'MISSING_RESERVATION');
 C.assert(fs.existsSync(f.request),'MISSING_REQUEST');const q=read(f.request);
 C.assert(q.id===id && q.requestHash===r.requestHash && hash(q.body)===r.requestHash && (!packet||hash(packet)===hash(q.packet)), 'REQUEST_INTEGRITY_ERROR');
 C.assert(hash(q.packet.body)===r.requestHash && hash(q.packet.keyById)===hash(q.keyById),'PACKET_INTEGRITY_ERROR');
 if(!fs.existsSync(f.answer)){
  C.assert(!r.settled&&!ledger.answerEvents?.has(id),'MISSING_ANSWER');
  return{status:'interrupted-request',retryable:true,elapsedMs:60000,recovered:true,
   retryNotBefore:Date.parse(r.time)+120000,attemptId:id};
 }
 const saved=read(f.answer),event=ledger.answerEvents?.get(id);
 C.assert(saved.id===id&&saved.requestHash===r.requestHash&&(!event||event.digest===hash(saved)),'ANSWER_INTEGRITY_ERROR');
 const result=saved.result,t=result.usage?.input_tokens,valid=Number.isSafeInteger(t)&&t>=0;
 C.assert(result.retryable===retryable(result.status),'RETRY_CLASSIFICATION_ERROR');
 if(result.status==='ok'){
  const checked=C.validateResponse(result.response,q.packet);
  C.assert(hash(checked.probabilities)===hash(result.probabilities)&&checked.choice===result.choice&&checked.confidence===result.confidence,'RESPONSE_VALIDATION_ERROR');
 }
 if(!r.settled&&repair)ledger.settle(id,valid?t:null,result.status);
 if(r.settled)C.assert(r.inputTokens===(valid?t:null)&&r.chargedNano===(valid?t*B.RATE_NANO:B.RESERVE_NANO)&&r.status===result.status,'SETTLEMENT_MISMATCH');
 if(!event&&repair&&!ledger.halted)ledger.append({type:'strength-answer',id,digest:hash(saved)});
 if(repair && (!result.retryable&&result.status!=='ok'))ledger.halt(result.status);
 return{...result,attemptId:id,recovered:true,savedDigest:hash(saved)};
}
function createClient(ledger,root,apiKey,{transport=globalThis.fetch,now=Date.now,allowRetry=false}={}){
 C.assert(typeof apiKey==='string'&&apiKey.length&&!/[\r\n]/.test(apiKey),'TYPESAFE_API_KEYを設定してください。');
 async function attempt(packet,id,stage){
  C.assert(!ledger.halted,'STUDY_HALTED');
  if(ledger.records.has(id))return verifySaved(ledger,root,id,packet,{repair:true});
  const f=files(root,id),requestHash=hash(packet.body);
  C.assert(!fs.existsSync(f.answer),'ORPHAN_ANSWER');
  if(fs.existsSync(f.request))C.assert(hash(read(f.request).packet)===hash(packet),'ORPHAN_REQUEST_MISMATCH');
  C.atomicJSON(f.request,{id,requestHash,body:packet.body,keyById:packet.keyById,packet});
  ledger.reserve(id,stage,requestHash,60000);
  const started=performance.now();let data=null,result,statusCode=null,retryAfterMs=0;
  try{
   const response=await transport('https://api.typesafe.ai/v1/systemone',{method:'POST',redirect:'error',
    headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify(packet.body),signal:AbortSignal.timeout(60000)});
   statusCode=response.status;
   const h=response.headers?.get('retry-after');
   if(h){const n=Number(h);retryAfterMs=Number.isFinite(n)&&n>=0?n*1000:Math.max(0,Date.parse(h)-now())||0;}
   if(!response.ok){if(response.body)try{await response.body.cancel();}catch{}result={status:'http-'+statusCode};}
   else{
    try{data=await response.json();}catch(e){if(e.name==='SyntaxError')result={status:'invalid-json'};else throw e;}
    if(!result)try{result={status:'ok',...C.validateResponse(data,packet)};}
    catch(e){result={status:e.message==='MODEL_MISMATCH'?'model-mismatch':'invalid-response'};}
   }
  }catch(e){result={status:['AbortError','TimeoutError'].includes(e.name)?'timeout':'network-error'};}
  result.elapsedMs=performance.now()-started;result.retryable=retryable(result.status);
  result.usage={input_tokens:Number.isSafeInteger(data?.usage?.input_tokens)&&data.usage.input_tokens>=0?data.usage.input_tokens:null,
   output_tokens:Number.isSafeInteger(data?.usage?.output_tokens)&&data.usage.output_tokens>=0?data.usage.output_tokens:null};
  if(result.response)result.response.usage=result.usage;
  result.retryNotBefore=now()+Math.max(60000,retryAfterMs);
  // Persist the first answer before settlement. A crash here recovers the same answer, never sends it again.
  C.atomicJSON(f.answer,{id,requestHash,statusCode,savedAt:new Date(now()).toISOString(),result});
  return{...verifySaved(ledger,root,id,packet,{repair:true}),recovered:false};
 }
 return{async evaluate(packet,{id,stage}){
  parseAttempt(id+'-attempt-1');
  const firstId=id+'-attempt-1',hadFirst=ledger.records.has(firstId);
  let result=await attempt(packet,firstId,stage);
  if(ledger.halted)throw stop('STUDY_HALTED',{apiStatus:result.status});
  if(result.status==='ok')return result;
  if(!result.retryable)throw stop('TECHNICAL-STOP',{apiStatus:result.status});
  const secondId=id+'-attempt-2';
  // An existing second attempt is recovery, not a new paid retry. Reuse its first valid answer.
  if(ledger.records.has(secondId)){
   result=await attempt(packet,secondId,stage);
   if(ledger.halted)throw stop('STUDY_HALTED',{apiStatus:result.status});
   if(result.status==='ok')return result;
   throw stop('ATTEMPTS-EXHAUSTED',{apiStatus:result.status});
  }
  // A newly failed attempt always returns control to the user; no automatic retry.
  if(!hadFirst||!allowRetry)throw stop('API-PAUSED',{apiStatus:result.status,retryNotBefore:result.retryNotBefore});
  if(!ledger.records.has(secondId) && now()<result.retryNotBefore)throw stop('RETRY-WAIT',{retryNotBefore:result.retryNotBefore});
  result=await attempt(packet,secondId,stage);
  if(ledger.halted)throw stop('STUDY_HALTED',{apiStatus:result.status});
  if(result.status==='ok')return result;
  throw stop('ATTEMPTS-EXHAUSTED',{apiStatus:result.status});
 }};
}
module.exports={createClient,verifySaved,files,retryable,stop};
