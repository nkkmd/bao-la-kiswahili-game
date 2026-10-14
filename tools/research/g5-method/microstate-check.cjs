"use strict";
const assert=require("node:assert/strict");
function check(record) {
 assert.ok(["TERMINATED","MOVE-RECURRENT","ADMIN-CUTOFF"].includes(record.status));
 if(record.status==="TERMINATED") {assert.ok(record.state);assert.notEqual(record.state.reason,"relay-limit");assert.equal(record.cycle,null);return true;}
 assert.equal(record.state,null);
 if(record.status==="ADMIN-CUTOFF") {assert.equal(record.cycle,null);return true;}
 const c=record.cycle;assert.ok(c&&Number.isInteger(c.first)&&Number.isInteger(c.repeatedAt));
 assert.ok(c.first>=0&&c.repeatedAt>c.first&&c.repeatedAt===record.microstates.length-1);
 assert.equal(c.period,c.repeatedAt-c.first);assert.deepEqual(record.microstates[c.first],record.microstates[c.repeatedAt]);
 const unique=record.microstates.slice(0,c.repeatedAt).map(x=>JSON.stringify(x));assert.equal(new Set(unique).size,unique.length);
 return true;
}
function abstractMachine(initial,next,maxMicrostates) {
 const seen=new Map(),microstates=[];let current=structuredClone(initial),steps=0;
 while(current.end!==true) {
  const key=JSON.stringify(current);microstates.push(structuredClone(current));
  if(seen.has(key))return {status:"MOVE-RECURRENT",state:null,relays:steps,microstates,cycle:{first:seen.get(key),repeatedAt:microstates.length-1,period:microstates.length-1-seen.get(key)}};
  if(seen.size>=maxMicrostates)return {status:"ADMIN-CUTOFF",state:null,relays:steps,microstates,cycle:null};
  seen.set(key,microstates.length-1);steps++;current=next(current);
 }
 return {status:"TERMINATED",state:current,relays:steps,microstates,cycle:null};
}
module.exports={check,abstractMachine};
