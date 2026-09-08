"use strict";
const P6=require('./pbai-p6-common.js'),fs=require('node:fs'),path=require('node:path');
const {ROOT,read,sha,raw,write,append,load,rng}=P6;
const DOC=path.join(ROOT,'doc/ai-engineering/public-ai-improvement-program-8');
const OUT=path.join(ROOT,'artifacts/pbai-p8/run');
const SPEC=read(path.join(DOC,'SPEC.json'));
function model(){const bytes=fs.readFileSync(path.join(DOC,'MODEL.json'));if(sha(bytes)!==SPEC.modelSha256)throw Error('Frozen model mismatch');return JSON.parse(bytes);}
function requireSupervision(){if(process.env.PBAI_P8_SUPERVISED!=='1')throw Error('Use PBAI-P8 supervisor');}
let knownCache;
function knownIdentities(){if(!knownCache)knownCache=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync(path.join(DOC,'KNOWN_IDENTITIES.json.gz')))).rows;return knownCache;}
function priorIdentities() {
  const rows=knownIdentities().slice();
  for(const file of fs.readdirSync(OUT))if(file.endsWith('-source.json')) { const v=read(path.join(OUT,file)); rows.push(...v.rows,...v.audit); }
  return rows;
}
function select(name,config) {
  const B=load(), prior=priorIdentities(), seen={};
  for(const key of ['raw','prefix','trajectory'])seen[key]=new Set(prior.map(r=>r[key]).filter(Boolean));
  const perPhase=config.rootsPerPhase??config.pairsPerPhase;
  const counts={namua:0,mtaji:0}, rows=[], audit=[];
  for(let seed=config.seedBase;seed<config.seedBase+SPEC.population.blockSize&&(counts.namua<perPhase||counts.mtaji<perPhase);seed++) {
    const phase=(seed-config.seedBase)%2===0?'namua':'mtaji'; if(counts[phase]===perPhase)continue;
    append(path.join(OUT,'seed-access.jsonl'),{name,seed});
    let s=B.E.initialState(), chosen=null; const random=rng(seed), moves=[], keys=[];
    for(let ply=1;ply<=96&&s.winner===null;ply++) {
      const choices=B.E.moveVariants(s); if(!choices.length)throw Error('No legal source move');
      const m=choices[Math.floor(random()*choices.length)]; moves.push(m); keys.push(B.A.moveKey(m)); s=B.E.applyMove(s,m).state;
      const [min,max]=SPEC.population[phase+'Range'];
      if(!chosen&&s.winner===null&&s.phase===phase&&ply>=min&&ply<=max&&B.E.moveVariants(s).length>=2)chosen={state:s,ply};
    }
    const row={seed,phase,prefix:sha(keys.slice(0,12)),trajectory:sha(keys),raw:chosen?raw(chosen.state):null};
    const reason=!chosen?'no-root':['raw','prefix','trajectory'].find(k=>seen[k].has(row[k]));
    audit.push({...row,accepted:!reason,reason:reason||null});
    if(!reason) { rows.push({...row,...chosen,moves}); counts[phase]++; }
    for(const key of ['raw','prefix','trajectory'])if(row[key])seen[key].add(row[key]);
    append(path.join(OUT,`${name}-progress.jsonl`),{audit:audit.at(-1),row:reason?null:rows.at(-1)});
    if(rows.length&&rows.length%32===0&&!reason)console.log(JSON.stringify({stage:name,roots:rows.length}));
  }
  if(counts.namua!==perPhase||counts.mtaji!==perPhase)throw Error('Insufficient source block');
  const output={name,config,counts,rows,audit};write(path.join(OUT,name+'-source.json'),output);return rows;
}

module.exports={...P6,DOC,OUT,SPEC,model,select,requireSupervision,knownIdentities};
