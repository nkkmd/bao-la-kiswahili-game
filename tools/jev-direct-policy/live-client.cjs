'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {performance}=require('node:perf_hooks');
const C=require('./core.cjs');
function stop(code,details={}){const e=new Error(code);e.details=details;return e;}
function retryable(status){return['timeout','network-error','http-429','invalid-json','invalid-response','interrupted-request'].includes(status)||/^http-5\d\d$/.test(status);}
function files(root,id){const stem=C.sha256(id)+'.json';return{request:path.join(root,'requests',stem),response:path.join(root,'responses',stem)};}
function read(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function parseRetryAfter(value,now){
 if(!value)return 0;const seconds=Number(value);
 if(Number.isFinite(seconds)&&seconds>=0)return seconds*1000;
 const date=Date.parse(value);return Number.isFinite(date)?Math.max(0,date-now):0;
}
function assertNoDuplicateKeys(text){
 let i=0;const n=text.length;
 const ws=()=>{while(i<n&&/\s/.test(text[i]))i++;};
 function stringToken(){
  C.assert(text[i]==='"','RAW_JSON_SCAN_ERROR');const start=i++;
  while(i<n){const ch=text[i++];if(ch==='\\'){C.assert(i<n,'RAW_JSON_SCAN_ERROR');i++;continue;}if(ch==='"')return text.slice(start,i);}
  throw new Error('RAW_JSON_SCAN_ERROR');
 }
 function value(){
  ws();const ch=text[i];
  if(ch==='{'){object();return;}if(ch==='['){array();return;}if(ch==='"'){stringToken();return;}
  const start=i;while(i<n&&!/[\s,\]}]/.test(text[i]))i++;C.assert(i>start,'RAW_JSON_SCAN_ERROR');
 }
 function object(){
  C.assert(text[i++]==='{','RAW_JSON_SCAN_ERROR');ws();const seen=new Set();if(text[i]==='}'){i++;return;}
  while(true){
   ws();const token=stringToken(),key=JSON.parse(token);C.assert(!seen.has(key),'DUPLICATE_JSON_KEY');seen.add(key);ws();C.assert(text[i++]===':','RAW_JSON_SCAN_ERROR');value();ws();
   if(text[i]===','){i++;continue;}C.assert(text[i]==='}','RAW_JSON_SCAN_ERROR');i++;return;
  }
 }
 function array(){
  C.assert(text[i++]==='[','RAW_JSON_SCAN_ERROR');ws();if(text[i]===']'){i++;return;}
  while(true){value();ws();if(text[i]===','){i++;continue;}C.assert(text[i]===']','RAW_JSON_SCAN_ERROR');i++;return;}
 }
 value();ws();C.assert(i===n,'RAW_JSON_SCAN_ERROR');return true;
}
function strictParseResponse(text){
 let data;try{data=JSON.parse(text);}catch{const e=new Error('INVALID_JSON');throw e;}
 assertNoDuplicateKeys(text);return data;
}
function verifySaved(ledger,root,id,packet,{repair=true}={}){
 const f=files(root,id),record=ledger.records.get(id),bodyText=JSON.stringify(packet.body),requestHash=C.sha256(bodyText);
 C.assert(record&&record.requestHash===requestHash,'SAVED_RESERVATION_MISMATCH');
 C.assert(fs.existsSync(f.request),'SAVED_REQUEST_MISSING');const q=read(f.request);
 C.assert(q.id===id&&q.requestHash===requestHash&&q.bodyTextHash===C.sha256(q.bodyText)&&q.bodyText===bodyText,'SAVED_REQUEST_INTEGRITY_ERROR');
 C.assert(q.packetHash===C.sha256({body:packet.body,moveById:packet.moveById,candidateIds:packet.candidateIds,stateHash:packet.stateHash,candidateSetHash:packet.candidateSetHash}),'SAVED_PACKET_MISMATCH');
 if(!fs.existsSync(f.response))return{status:'interrupted-request',retryable:true,recovered:true,elapsedMs:record.watchdogMs,
  retryNotBefore:Date.parse(record.time)+Math.max(60000,C.protocol.responses.minimumRetryWaitSeconds*1000),attemptId:id};
 const saved=read(f.response);C.assert(saved.id===id&&saved.requestHash===requestHash,'SAVED_RESPONSE_INTEGRITY_ERROR');
 const result=saved.result;C.assert(result.retryable===retryable(result.status),'SAVED_RETRY_CLASSIFICATION_ERROR');
 if(result.status==='ok'){
  const checked=C.validateResponse(result.response,packet);
  C.assert(checked.candidateId===result.candidateId&&checked.moveKey===result.moveKey&&C.sha256(checked.move)===C.sha256(result.move),'SAVED_RESPONSE_VALIDATION_ERROR');
 }
 if(!record.settled&&repair)ledger.settle(id,result.usage?.input_tokens??null,result.status);
 if(record.settled){
  const expectedTokens=Number.isSafeInteger(result.usage?.input_tokens)&&result.usage.input_tokens>=0?result.usage.input_tokens:null;
  C.assert(record.inputTokens===expectedTokens&&record.status===result.status,'SAVED_SETTLEMENT_MISMATCH');
 }
 return{...result,recovered:true,attemptId:id,responseDigest:C.sha256(saved)};
}
function createClient(ledger,root,apiKey,{transport=globalThis.fetch,now=Date.now}={}){
 C.assert(typeof apiKey==='string'&&apiKey.length>0&&!/[\r\n]/.test(apiKey),'TYPESAFE_API_KEY_REQUIRED');
 async function attempt(packet,id,stage){
  C.assert(!ledger.halted,'LEDGER_HALTED');const f=files(root,id),bodyText=JSON.stringify(packet.body),requestHash=C.sha256(bodyText);
  if(ledger.records.has(id))return verifySaved(ledger,root,id,packet,{repair:true});
  C.assert(!fs.existsSync(f.response),'ORPHAN_RESPONSE');
  const packetBinding={body:packet.body,moveById:packet.moveById,candidateIds:packet.candidateIds,stateHash:packet.stateHash,candidateSetHash:packet.candidateSetHash};
  if(fs.existsSync(f.request)){
   const old=read(f.request);C.assert(old.requestHash===requestHash&&old.bodyText===bodyText&&old.packetHash===C.sha256(packetBinding),'ORPHAN_REQUEST_MISMATCH');
  }else C.atomicJSON(f.request,{id,requestHash,bodyTextHash:C.sha256(bodyText),bodyText,packetHash:C.sha256(packetBinding),candidateSetHash:packet.candidateSetHash,stateHash:packet.stateHash});
  ledger.reserve(id,stage,requestHash,C.protocol.jev.communicationWatchdogMs);
  const started=performance.now();let data=null,statusCode=null,result,retryAfterMs=0;
  try{
   const response=await transport(C.protocol.jev.apiEndpoint,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
    body:bodyText,signal:AbortSignal.timeout(C.protocol.jev.communicationWatchdogMs)});
   statusCode=response.status;retryAfterMs=parseRetryAfter(response.headers?.get?.('retry-after'),now());
   if(!response.ok){if(response.body)try{await response.body.cancel();}catch{}result={status:'http-'+statusCode};}
   else{
    let raw='';try{raw=await response.text();data=strictParseResponse(raw);}catch(e){result={status:e?.message==='DUPLICATE_JSON_KEY'||e?.message==='RAW_JSON_SCAN_ERROR'?'invalid-response':'invalid-json'};}
    if(!result){
     try{const checked=C.validateResponse(data,packet);result={status:'ok',candidateId:checked.candidateId,move:checked.move,moveKey:checked.moveKey,confidence:checked.confidence,response:checked.response};}
     catch(e){result={status:e.message==='MODEL_MISMATCH'?'model-mismatch':'invalid-response'};}
    }
   }
  }catch(e){result={status:['AbortError','TimeoutError'].includes(e?.name)?'timeout':'network-error'};}
  result.elapsedMs=performance.now()-started;result.retryable=retryable(result.status);
  result.retryNotBefore=now()+Math.max(C.protocol.responses.minimumRetryWaitSeconds*1000,retryAfterMs);
  result.usage={input_tokens:Number.isSafeInteger(data?.usage?.input_tokens)&&data.usage.input_tokens>=0?data.usage.input_tokens:null,
   output_tokens:Number.isSafeInteger(data?.usage?.output_tokens)&&data.usage.output_tokens>=0?data.usage.output_tokens:null};
  if(result.response)result.response.usage=result.usage;
  C.atomicJSON(f.response,{id,requestHash,statusCode,savedAt:new Date(now()).toISOString(),result});
  const settled=verifySaved(ledger,root,id,packet,{repair:true});
  if(!settled.retryable&&settled.status!=='ok')ledger.halt(settled.status);
  return{...settled,recovered:false};
 }
 return{async evaluate(packet,{logicalId,stage,allowRetry=false}){
  const firstId=logicalId+'-attempt-1';let first=await attempt(packet,firstId,stage);
  if(first.status==='ok')return first;
  if(ledger.halted)throw stop('TECHNICAL-STOP',{apiStatus:first.status});
  if(!first.retryable)throw stop('TECHNICAL-STOP',{apiStatus:first.status});
  const secondId=logicalId+'-attempt-2';
  if(ledger.records.has(secondId)){
   const second=await attempt(packet,secondId,stage);if(second.status==='ok')return second;
   throw stop('ATTEMPTS-EXHAUSTED',{apiStatus:second.status});
  }
  if(!allowRetry)throw stop('API-PAUSED',{apiStatus:first.status,retryNotBefore:first.retryNotBefore});
  if(now()<first.retryNotBefore)throw stop('RETRY-WAIT',{retryNotBefore:first.retryNotBefore});
  const second=await attempt(packet,secondId,stage);if(second.status==='ok')return second;
  throw stop('ATTEMPTS-EXHAUSTED',{apiStatus:second.status});
 }};
}
module.exports={createClient,verifySaved,files,retryable,stop,assertNoDuplicateKeys,strictParseResponse};
