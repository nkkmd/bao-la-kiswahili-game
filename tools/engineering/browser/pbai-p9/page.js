"use strict";
const runButton=document.querySelector('#run'),saveButton=document.querySelector('#save'),status=document.querySelector('#status'),result=document.querySelector('#result');let report=null;
runButton.onclick=async()=>{runButton.disabled=true;saveButton.disabled=true;status.textContent='検証中';try{
 const response=await fetch('fixtures.json');if(!response.ok)throw Error('局面の読込に失敗しました');
 report=await BaoP9Suite.run(await response.json(),n=>{status.textContent=`検証中 ${n}/78`;});status.textContent='合格 78/78';
}catch(error){report={passed:false,error:String(error)};status.textContent='不合格';}finally{result.textContent=JSON.stringify(report,null,2);saveButton.disabled=false;runButton.disabled=false;}};
saveButton.onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='pbai-p9-browser-result.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
