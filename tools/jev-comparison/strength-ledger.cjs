'use strict';
const fs=require('node:fs'),path=require('node:path');
const C=require('./core.cjs'),B=require('./budget.cjs'),R=require('./reviewed-client.cjs');
const hash=v=>C.sha256(JSON.stringify(v));
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const P=require('./strength-v1-design/protocol.json'),O=require('./strength-v1-design/openings.json');
const HISTORY=require('./strength-history-accounts.json');
function specification(){
 const manifest=read(path.join(__dirname,'strength-manifest.json'));
 const spec={id:P.id,protocolHash:hash(P),openingsHash:O.openingsHash,addonHash:hash(manifest)};
 return {...spec,planHash:hash(spec)};
}
function games(stage){
 const book=stage==='pilot'?O.pilot:O.formal,schedule=stage==='pilot'?O.pilotSchedule:O.schedule;
 return schedule.map(s=>({...s,id:'strength-v1-'+s.id,stage,initialState:C.clone(book.find(o=>o.id===s.openingId).state)}));
}
const allGames=[...games('pilot'),...games('formal')];
function parseAttempt(id){
 for(const g of allGames){const prefix=g.id+'-ply-';if(!id.startsWith(prefix))continue;
  const m=id.slice(prefix.length).match(/^(0|[1-9]\d*)-attempt-([12])$/);
  if(m && +m[1]<512)return{game:g,ply:+m[1],attempt:+m[2],logicalId:prefix+m[1]};
 }
 throw new Error('SCOPE_ERROR');
}
function historicalCheck(ledger){
 C.assert(!ledger.halted && ledger.resumeReview && ledger.records.size===106,'HISTORY_LEDGER_MISMATCH');
 const t=ledger.totals();C.assert(t.total===24455760 && t.uncertain===16515072 && t.settled===7940688
  && t.stages.pilot===24403050 && t.stages.smoke===52710 && t.stages.matches===0 && t.stages.positions===0,'HISTORY_BUDGET_MISMATCH');
 for(const h of HISTORY){const r=ledger.records.get(h.id);C.assert(r&&r.settled&&['requestHash','stage','inputTokens','chargedNano','status'].every(k=>r[k]===h[k]),'HISTORY_ACCOUNT_MISMATCH');}
}
class StrengthLedger extends R.ReviewedLedger{
 constructor(dir,binding){C.assert(fs.existsSync(path.join(dir,'budget.jsonl')),'既存台帳が必要です。初期化はしません。');super(dir,binding);}
 accept(row){
  if(row.type.startsWith('strength-')){
   const {hash:rh,...u}=row;C.assert(rh===hash(u)&&row.seq===this.sequence&&row.previous===this.previous,'LEDGER_CHAIN_ERROR');
   if(row.type==='strength-scope'){
    C.assert(!this.strengthScope && hash(row.spec)===hash(specification()),'SCOPE_MISMATCH');historicalCheck(this);
    this.strengthScope=row;this.answerEvents=new Map();this.moveEvents=new Map();
   }else{
    C.assert(this.strengthScope && !this.halted,'STUDY_HALTED');
    if(row.type==='strength-answer'){
     const r=this.records.get(row.id);parseAttempt(row.id);
     C.assert(r?.settled&&!this.answerEvents.has(row.id)&&/^[a-f0-9]{64}$/.test(row.digest),'ANSWER_EVENT_ERROR');
     this.answerEvents.set(row.id,row);
    }else if(row.type==='strength-move'){
     parseAttempt(row.id+'-attempt-1');
     C.assert(!this.moveEvents.has(row.id)&&/^[a-f0-9]{64}$/.test(row.digest),'MOVE_EVENT_ERROR');this.moveEvents.set(row.id,row);
    }else throw new Error('UNKNOWN_STUDY_EVENT');
   }
   this.sequence++;this.previous=rh;return;
  }
  if(this.strengthScope && row.type==='reserve'){
   C.assert(!this.halted,'STUDY_HALTED');const a=parseAttempt(row.id);
   C.assert(row.stage===(a.game.stage==='pilot'?'pilot':'matches')&&row.timeoutMs===60000,'SCOPE_ERROR');
   const t=this.totals();C.assert(t.total+B.RESERVE_NANO<=B.WORK_NANO && t.stages[row.stage]+B.RESERVE_NANO<=B.STAGES[row.stage],'BUDGET_STOP');
   C.assert(!this.moveEvents.has(a.logicalId),'MOVE_ALREADY_COMMITTED');
   if(a.attempt===2)C.assert(this.records.get(a.logicalId+'-attempt-1')?.requestHash===row.requestHash,'RETRY_INPUT_MISMATCH');
  }
  super.accept(row);
 }
 register(){if(this.strengthScope){C.assert(hash(this.strengthScope.spec)===hash(specification()),'SCOPE_MISMATCH');return;}
  historicalCheck(this);this.append({type:'strength-scope',spec:specification(),authorization:'user-cli-run-live',priorRequests:106});}
 reserve(id,stage,requestHash,timeoutMs){
  C.assert(this.strengthScope&&!this.halted,'STUDY_HALTED');const a=parseAttempt(id);
  C.assert(stage===(a.game.stage==='pilot'?'pilot':'matches')&&timeoutMs===60000&&!this.moveEvents.has(a.logicalId),'SCOPE_ERROR');
  if(a.attempt===2)C.assert(this.records.get(a.logicalId+'-attempt-1')?.requestHash===requestHash,'RETRY_INPUT_MISMATCH');
  return B.Ledger.prototype.reserve.call(this,id,stage,requestHash,timeoutMs);
 }
}
module.exports={StrengthLedger,historicalCheck,specification,games,allGames,parseAttempt,hash,read,P,O};
