"use strict";
// 通信不明後は、旧hostの終了回復経路でも追加書込を許可しない。
const assert=require('node:assert/strict');
function guard(registry,{check=()=>{},mode,denied=null,release=()=>{}}={}){
 let locked=false,reason=null,consumes=0,mirrors=0;
 function stop(message){if(!locked)reason=message;locked=true;}
 function fail(error){stop(error.message);throw error;}
 function mutation(phase,fn){assert.equal(locked,false,'REMOTE-WRITES-LOCKED-NO-RETRY');try{check(phase);return fn();}catch(error){return fail(error);}}
 const transport={...registry,
  read(){try{return registry.read();}catch(error){return fail(error);}},
  acquire(request){return mutation('ordinary',()=>registry.acquire(request));},
  consume(stage,run,index,callback,binding){return mutation('ordinary',()=>registry.consume(stage,run,index,(id,sha)=>{check('ordinary');if(mode==='lost-response'&&index===0)throw Error('INJECTED-POST-COMMIT-RESPONSE-LOSS');const result=callback(id,sha);consumes++;return result;},binding));},
  mirror(stage,run,sequence,files,...extra){const final=files['PHASE.json']&&JSON.parse(files['PHASE.json']).final===true;return mutation(final?'final':'ordinary',()=>{if(final)release();if(final&&mode==='proxy-final-mirror'){assert.ok(denied);return denied.mirror(stage,run,sequence,files,...extra);}const r=registry.mirror(stage,run,sequence,files,...extra);mirrors++;return r;});}
 };
 return {transport,stop,get locked(){return locked;},get reason(){return reason;},get consumesAcknowledged(){return consumes;},get mirrorsSucceeded(){return mirrors;}};
}
function bindStop(protocol,g){
 const stop=protocol.stop;
 protocol.stop=function(){g.stop('HOST-SESSION-STOPPED-NO-RETRY');return stop();};
 return protocol;
}
function requireCompletedFinal(phase,worker){
 if(phase==='final')assert.equal(worker?.workerComplete,true,'FINAL-WORKER-INCOMPLETE-NO-RECOVERY-MIRROR');
}
module.exports={guard,bindStop,requireCompletedFinal};
