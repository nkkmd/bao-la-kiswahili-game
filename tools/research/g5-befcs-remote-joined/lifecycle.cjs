"use strict";
// 完了判定の失敗でも、work停止とwatch終了を期限待ちにしない。
async function settleService(task,hooks){
 let value,error;const cleanupErrors=[];
 try{value=await task();}catch(e){error=e;}
 for(const name of ['stopWork','clearTimer']){
  try{hooks[name]();}catch(e){cleanupErrors.push(e);}
 }
 if(error)try{hooks.saveFailure(error);}catch(e){cleanupErrors.push(e);}
 try{await hooks.finishWatch();}catch(e){cleanupErrors.push(e);}
 if(error){if(cleanupErrors.length)error.cleanupErrors=cleanupErrors.map(e=>e.message);throw error;}
 if(cleanupErrors.length)throw new AggregateError(cleanupErrors,'SERVICE-CLEANUP-FAILED');
 return value;
}
async function finishOwnedWatch(exit,{done,kill,timeoutMs=2000}){
 let timer;
 try{
  done();
  return await Promise.race([exit,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('OWNED-WATCH-EXIT-TIMEOUT')),timeoutMs);})]);
 }catch(error){kill();throw error;}
 finally{clearTimeout(timer);}
}
module.exports={settleService,finishOwnedWatch};
