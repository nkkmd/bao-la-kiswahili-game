'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const C=require('./core.cjs');
const RATE_NANO=C.protocol.budget.currentRateNanoUSDPerInputToken;
const MAX_INPUT_TOKENS=65536;
const RESERVE_NANO=RATE_NANO*MAX_INPUT_TOKENS;
const OVERALL_NANO=Math.round(C.protocol.budget.overallLimitUSD*1e9);
const STAGE_NANO={pilot:Math.round(C.protocol.budget.pilotLimitUSD*1e9),formal:Math.round(C.protocol.budget.formalLimitUSD*1e9)};
const dollars=n=>Number((n/1e9).toFixed(9));
function readLines(file){
 if(!fs.existsSync(file))return[];
 const raw=fs.readFileSync(file,'utf8');
 C.assert(!raw.length||raw.endsWith('\n'),'LEDGER_TRUNCATED');
 return raw.trimEnd()?raw.trimEnd().split('\n').map(line=>JSON.parse(line)):[];
}
class Ledger{
 constructor(dir,specHash){
  this.dir=dir;this.specHash=specHash;this.file=path.join(dir,'budget.jsonl');this.sequence=0;this.previous='';this.records=new Map();this.halted=false;
  fs.mkdirSync(dir,{recursive:true,mode:0o700});
  const rows=readLines(this.file);
  if(!rows.length)this.append({type:'init',studyId:C.protocol.id,costManagementId:C.protocol.budget.costManagementId,specHash,
   rateNano:RATE_NANO,maxInputTokens:MAX_INPUT_TOKENS,reserveNano:RESERVE_NANO,overallNano:OVERALL_NANO,stageNano:STAGE_NANO});
  else for(const row of rows)this.accept(row);
 }
 accept(row){
  const {hash,...unsigned}=row;
  C.assert(hash===C.sha256(unsigned)&&row.seq===this.sequence&&row.previous===this.previous,'LEDGER_CHAIN_ERROR');
  if(row.type==='init'){
   C.assert(this.sequence===0&&row.studyId===C.protocol.id&&row.costManagementId===C.protocol.budget.costManagementId&&row.specHash===this.specHash,'LEDGER_SCOPE_MISMATCH');
   C.assert(row.rateNano===RATE_NANO&&row.maxInputTokens===MAX_INPUT_TOKENS&&row.reserveNano===RESERVE_NANO&&row.overallNano===OVERALL_NANO,'LEDGER_RATE_MISMATCH');
   C.assert(JSON.stringify(row.stageNano)===JSON.stringify(STAGE_NANO),'LEDGER_STAGE_LIMIT_MISMATCH');
  }else if(row.type==='reserve'){
   C.assert(!this.records.has(row.id)&&Object.hasOwn(STAGE_NANO,row.stage)&&row.reserveNano===RESERVE_NANO,'LEDGER_RESERVE_ERROR');
   this.records.set(row.id,{...row,chargedNano:row.reserveNano,settled:false});
  }else if(row.type==='settle'){
   const r=this.records.get(row.id);C.assert(r&&!r.settled,'LEDGER_SETTLE_ERROR');
   C.assert((row.inputTokens===null||Number.isSafeInteger(row.inputTokens)&&row.inputTokens>=0)&&Number.isSafeInteger(row.chargedNano)&&row.chargedNano>=0,'LEDGER_SETTLE_VALUE_ERROR');
   Object.assign(r,{settled:true,inputTokens:row.inputTokens,chargedNano:row.chargedNano,status:row.status});
  }else if(row.type==='halt')this.halted=true;
  else throw new Error('LEDGER_EVENT_UNKNOWN');
  this.sequence++;this.previous=hash;
 }
 append(event){
  const unsigned={seq:this.sequence,previous:this.previous,time:new Date().toISOString(),...event};
  const row={...unsigned,hash:C.sha256(unsigned)};
  const fd=fs.openSync(this.file,'a',0o600);
  try{fs.writeFileSync(fd,JSON.stringify(row)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  this.accept(row);return row;
 }
 totals(){
  const stages={pilot:0,formal:0};let total=0,settled=0,uncertain=0;
  for(const r of this.records.values()){
   total+=r.chargedNano;stages[r.stage]+=r.chargedNano;
   if(r.settled&&r.inputTokens!==null)settled+=r.chargedNano;else uncertain+=r.chargedNano;
  }
  return{total,stages,settled,uncertain};
 }
 summary(){const t=this.totals();return{requests:this.records.size,estimatedAndReservedUSD:dollars(t.total),reportedUsageUSD:dollars(t.settled),
  uncertainReservedUSD:dollars(t.uncertain),overallLimitUSD:C.protocol.budget.overallLimitUSD,stageUSD:Object.fromEntries(Object.entries(t.stages).map(([k,v])=>[k,dollars(v)])),halted:this.halted};}
 reserve(id,stage,requestHash,watchdogMs){
  C.assert(!this.halted,'LEDGER_HALTED');C.assert(Object.hasOwn(STAGE_NANO,stage),'LEDGER_STAGE_UNKNOWN');
  const existing=this.records.get(id);if(existing){C.assert(existing.stage===stage&&existing.requestHash===requestHash&&existing.watchdogMs===watchdogMs,'LEDGER_EXISTING_REQUEST_MISMATCH');return existing;}
  const t=this.totals();C.assert(t.total+RESERVE_NANO<=OVERALL_NANO,'BUDGET_STOP_OVERALL');C.assert(t.stages[stage]+RESERVE_NANO<=STAGE_NANO[stage],'BUDGET_STOP_STAGE');
  this.append({type:'reserve',id,stage,requestHash,watchdogMs,reserveNano:RESERVE_NANO});return null;
 }
 settle(id,inputTokens,status){
  const valid=Number.isSafeInteger(inputTokens)&&inputTokens>=0;
  const chargedNano=valid?inputTokens*RATE_NANO:RESERVE_NANO;
  C.assert(Number.isSafeInteger(chargedNano)&&chargedNano>=0,'LEDGER_CHARGE_ERROR');
  this.append({type:'settle',id,inputTokens:valid?inputTokens:null,chargedNano,status});
  if(valid&&inputTokens>MAX_INPUT_TOKENS)this.halt('USAGE_EXCEEDED_RESERVATION');
 }
 halt(reason){if(!this.halted)this.append({type:'halt',reason});}
}
function lock(dir){
 fs.mkdirSync(dir,{recursive:true,mode:0o700});const file=path.join(dir,'run.lock');let fd;
 try{fd=fs.openSync(file,'wx',0o600);}catch{throw new Error('RUN_LOCK_EXISTS');}
 fs.writeFileSync(fd,JSON.stringify({pid:process.pid,host:os.hostname(),started:new Date().toISOString()}));fs.fsyncSync(fd);fs.closeSync(fd);
 return()=>{if(fs.existsSync(file))fs.unlinkSync(file);};
}
function unlockStale(dir){
 const file=path.join(dir,'run.lock');if(!fs.existsSync(file))return false;const v=JSON.parse(fs.readFileSync(file,'utf8'));
 C.assert(v.host===os.hostname()&&Number.isSafeInteger(v.pid)&&v.pid>0,'LOCK_ENVIRONMENT_MISMATCH');let alive=true;
 try{process.kill(v.pid,0);}catch(e){if(e.code==='ESRCH')alive=false;else throw e;}C.assert(!alive,'LOCK_PROCESS_ALIVE');fs.unlinkSync(file);return true;
}
module.exports={Ledger,lock,unlockStale,RATE_NANO,MAX_INPUT_TOKENS,RESERVE_NANO,OVERALL_NANO,STAGE_NANO};
