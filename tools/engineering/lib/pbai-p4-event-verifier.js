"use strict";
// Independent accounting: no candidate engine or runner import.
const assert = require("node:assert/strict");
function verifyEvents(source, result) {
  const pits=structuredClone(source.pits), reserve=[...source.reserve];
  let held=0, captures=0, relays=0;
  for(const event of result.events){
    const p=event.position;
    switch(event.kind){
      case "reserve": reserve[source.player]--; pits[p.player][p.row][p.index]++; break;
      case "lift": case "relay":
        assert.equal(held,0); pits[p.player][p.row][p.index]-=event.count; held=event.count;
        if(event.kind==="relay")relays++; break;
      case "capture":
        assert.equal(held,0);assert.equal(pits[event.player][0][event.index],event.count);
        pits[event.player][0][event.index]=0;held=event.count;captures+=event.count;break;
      case "sow": assert(held>0);held--;pits[p.player][p.row][p.index]++;break;
      case "phase": assert.deepEqual(reserve,[0,0]);break;
      case "win": case "turn": case "limit": break;
      default: throw Error("Unknown event kind");
    }
    assert.deepEqual(pits,event.state.pits,"independent pit replay");
    assert.deepEqual(reserve,event.state.reserve,"independent reserve replay");
  }
  assert.deepEqual(pits,result.state.pits);assert.deepEqual(reserve,result.state.reserve);
  const pendingAdded=result.state.pending.reduce((a,b)=>a+b,0)-source.pending.reduce((a,b)=>a+b,0);
  assert.equal(held,pendingAdded,"unsown captures must be pending at termination");
  return {captures,relays,eventCount:result.events.length};
}
module.exports={verifyEvents};
