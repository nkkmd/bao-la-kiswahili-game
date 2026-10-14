"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),assert=require("node:assert/strict"),M=require("../g5-01/measurement.cjs"),C=require("../g5-method/independent-raw-codec.cjs");
const hash=b=>crypto.createHash("sha256").update(b).digest("hex");
function writer(path){const fd=fs.openSync(path,"wx");let seq=0,previous="0".repeat(64),closed=false;
 return {emit(record){assert.equal(closed,false);const row={seq:seq++,previous,record};row.hash=hash(JSON.stringify(row));fs.writeSync(fd,JSON.stringify(row)+"\n");fs.fsyncSync(fd);previous=row.hash;},close(){if(!closed){fs.closeSync(fd);closed=true;}}};
}
function snapshot(path,bytes){const temporary=path+".tmp",fd=fs.openSync(temporary,"wx");try{fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(temporary,path);const directory=fs.openSync(require("node:path").dirname(path),"r");try{fs.fsyncSync(directory);}finally{fs.closeSync(directory);}}
function replay(bytes,requireFinish=true){
 const lines=bytes.toString().split("\n");assert.equal(lines.pop(),"");const ids=[],metadata=[],legal=[],expanded=[],keys=[],edges=[],states=[];let previous="0".repeat(64),finish=null;
 for(let seq=0;seq<lines.length;seq++){
  const row=JSON.parse(lines[seq]),{hash:digest,...body}=row;assert.equal(row.seq,seq);assert.equal(row.previous,previous);assert.equal(hash(JSON.stringify(body)),digest);previous=digest;assert.equal(finish,null,"Record after finish");const r=row.record;
  if(r.kind==="node"){assert.ok(!ids.includes(r.id));const raw=C.decodeRaw(Buffer.from(r.payload,"base64"));assert.equal(M.rawKey(raw),r.id);ids.push(r.id);metadata.push(r.metadata);states.push({id:r.id,state:{...raw,...r.metadata}});legal.push(null);expanded.push(false);}
  else if(r.kind==="legal"){const i=ids.indexOf(r.id);assert.ok(i>=0);assert.equal(legal[i],null);legal[i]=r.keys;}
  else if(r.kind==="edge"){for(const k of ["from","move","to"])assert.equal(Object.hasOwn(r.record,k),false);const from=ids.indexOf(r.from),to=r.to===null?null:ids.indexOf(r.to);assert.ok(from>=0&&(to===null||to>=0));assert.ok(legal[from].includes(r.key));if(!keys.includes(r.key))keys.push(r.key);edges.push({from,move:keys.indexOf(r.key),to,...r.record});}
  else if(r.kind==="expanded"){const i=ids.indexOf(r.id);assert.ok(i>=0);assert.equal(expanded[i],false);expanded[i]=true;}
  else if(r.kind==="finish")finish=r.domain;
  else throw Error("Unknown journal record");
 }
 if(requireFinish)assert.ok(finish,"Incomplete journal");
 return finish?{...finish,ids,metadata,legal,expanded,keys,edges,states}:{complete:false,status:"INTERRUPTED-JOURNAL",ids,metadata,legal,expanded,keys,edges,states,solution:null};
}
module.exports={writer,snapshot,replay,hash};
