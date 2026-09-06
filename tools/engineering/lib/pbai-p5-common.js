"use strict";
const C=require("./pbai-p4-common.js"),path=require("node:path"),fs=require("node:fs");
const DOC=path.join(C.ROOT,"doc/ai-engineering/public-ai-improvement-program-5");
const OUT=path.join(C.ROOT,"artifacts/pbai-p5/run");
let serial=0;
function checkpoint(file){
 if(process.env.PBAI_P5_CHECKPOINTS!=="1")return;
 const name=path.basename(file),part=/^(speed|operation|pair)-(\d+)\.json$/.exec(name);
 if(!(part&&Number(part[2])%16===15)&&!name.endsWith("-source.json")&&name!=="correctness.json")return;
 const request=path.join(OUT,"CHECKPOINT_REQUEST.json"),ack=path.join(OUT,"CHECKPOINT_ACK.json");
 const id=`${process.pid}-${serial++}`;
 C.write(request,{id,file:path.relative(OUT,file)});
 const wait=new Int32Array(new SharedArrayBuffer(4));
 // No timed search is active here. The independent supervisor retains the deadline.
 while(!fs.existsSync(ack))Atomics.wait(wait,0,0,100);
 if(JSON.parse(fs.readFileSync(ack,"utf8")).id!==id)throw Error("Checkpoint acknowledgement mismatch");
 fs.unlinkSync(ack);fs.unlinkSync(request);
}
function write(file,value){C.write(file,value);checkpoint(file);}
module.exports={...C,DOC,OUT,write};
