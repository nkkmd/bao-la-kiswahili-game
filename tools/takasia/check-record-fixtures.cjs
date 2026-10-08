const fs = require('node:fs');
const crypto = require('node:crypto');
const base = require('node:path').resolve(__dirname, '../..') + '/';
const E = require(base + 'public/engine.js');
const L = require(base + 'public/engine-r002.js');
const G = require(base + 'public/game-record.js');
function rng(seed) { let x=seed; return () => { x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; }
function generate(engine,version,seed) {
  const random=rng(seed); let state=engine.initialState(); let activated=0,stopped=0;
  const record=G.createRecord(state,{mode:'computer',humanSide:'south',ai:{difficulty:'normal',generation:'AI-GEN4',releaseId:'AI-GEN4-RELEASE-001',...(version===2 ? {ruleRevision:'BAO-RULES-V0.2.0-TAKASIA-001',aiRevision:'AI-GEN4-TAKASIA-001'} : {})}},version);
  while(state.winner===null && record.moves.length<384) {
    const moves=engine.moveVariants(state);let move=moves[Math.floor(random()*moves.length)];
    if(state.takasia) move=moves.find(m=>engine.applyMove(state,m).events.some(e=>e.kind==='takasia' && e.action==='stop')) || move;
    G.appendMove(record,state,move); const applied=engine.applyMove(state,move);
    if(applied.state.takasia) activated++;
    if(applied.events.some(e=>e.kind==='takasia' && e.action==='stop'))stopped++;
    state=applied.state;
  }
  if(state.winner===null)return null;
  G.finalize(record,state);return {seed,activated,stopped,record};
}
let current,legacy;
for(let seed=1;seed<=1000;seed++) { const x=generate(E,2,seed); if(x&&x.activated>0&&x.stopped>0){current=x;break;} }
for(let seed=1;seed<=1000;seed++) { const x=generate(L,1,seed); if(!x)continue; let state=E.initialState(),different=false;
  try {for(const entry of x.record.moves)state=E.applyMove(state,entry.move).state;delete state.takasia; different=JSON.stringify(state)!==JSON.stringify(x.record.finalPosition);}catch{different=true;}
  if(different){legacy=x;break;}
}
if(!current||!legacy)throw Error('No bounded fixtures found');
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(base+path)).digest('hex');
const artifact={scope:'deterministically generated standard-initial games; regression evidence, not playing-strength evidence',generator:'LCG 1664525/1013904223; random canonical moves; prefer takasia-stop when active; first qualifying seed in 1..1000',sources:{legacyCommit:'8c87ed44c9b08f75456766f0a9bd9f76d06209d4',legacyEngineBlob:'1527bb3665228b7a5bd9f03153567aedbaaa22d7',engineSha256:hash('public/engine.js'),legacyWrapperSha256:hash('public/engine-r002.js')},current,legacy};
if (process.argv[2] !== '--check') throw Error('Use --check to verify the saved regression fixtures');
if (JSON.stringify(JSON.parse(fs.readFileSync(base+'tools/takasia/record-fixtures.json','utf8'))) !== JSON.stringify(artifact)) throw Error('Record fixtures differ from deterministic generation');
console.log(JSON.stringify({current:{seed:current.seed,plies:current.record.moves.length,activated:current.activated,stopped:current.stopped},legacy:{seed:legacy.seed,plies:legacy.record.moves.length}}));
