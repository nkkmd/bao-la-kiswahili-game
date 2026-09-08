"use strict";
// Exact Boolean rewrites; no corpus-dependent constants or weight changes.
function makeGraph(model) {
  if(model.kind!=='logic'||model.inputSize!==399||model.layers.length!==3||model.weights.length!==512)throw Error('Model shape');
  const inputs=Array.from({length:399},(_,i)=>`i${i}`), nodes=[], intern=new Map(), neg=new Map();
  const add=(key,node)=>{if(intern.has(key))return intern.get(key);const id=`g${nodes.length}`;nodes.push({id,...node});intern.set(key,id);return id;};
  function invert(a) { if(a==='#0')return '#1';if(a==='#1')return '#0';if(neg.has(a))return neg.get(a);const id=add('not|'+a,{kind:'not',a});neg.set(a,id);neg.set(id,a);return id; }
  function unary(a,zero,one) { return zero===one?'#'+zero:zero?invert(a):a; }
  function gate(g,a,b) {
    if(g===0)return '#0';if(g===15)return '#1';
    if(a===b)return unary(a,g&1,(g>>>3)&1);
    if(a[0]==='#')return unary(b,(g>>>(2*Number(a[1])))&1,(g>>>(2*Number(a[1])+1))&1);
    if(b[0]==='#')return unary(a,(g>>>Number(b[1]))&1,(g>>>(2+Number(b[1])))&1);
    if(g===3)return invert(a);if(g===5)return invert(b);if(g===10)return b;if(g===12)return a;
    if(a>b){[a,b]=[b,a];g=(g&9)|((g&2)<<1)|((g&4)>>>1);}
    return add(`${g}|${a}|${b}`,{kind:'binary',g,a,b});
  }
  let previous=[];const trace=[];
  model.layers.forEach((layer,l)=>{
    const pool=inputs.concat(previous);
    if(![layer.a,layer.b,layer.gates].every(x=>Array.isArray(x)&&x.length===512))throw Error('Layer shape');
    previous=layer.gates.map((g,i)=>{
      const ai=layer.a[i],bi=layer.b[i];
      if(![g,ai,bi].every(Number.isInteger)||g<0||g>15||ai<0||bi<0||ai>=pool.length||bi>=pool.length)throw Error('Gate index');
      const a=pool[ai],b=pool[bi],out=gate(g,a,b);trace.push({layer:l,index:i,g,a,b,out});return out;
    });
  });
  if(![...model.weights,model.bias].every(Number.isSafeInteger))throw Error('Readout integer');
  const outputs=new Map();let bias=model.bias;
  model.weights.forEach((w,i)=>{const id=previous[i];if(id==='#1')bias+=w;else if(id!=='#0')outputs.set(id,(outputs.get(id)||0)+w);});
  for(const [id,w] of outputs)if(w===0)outputs.delete(id);
  if(!Number.isSafeInteger(Math.abs(bias)+[...outputs.values()].reduce((s,w)=>s+Math.abs(w),0)))throw Error('Readout overflow');
  const live=new Set(),byId=new Map(nodes.map(n=>[n.id,n]));
  function visit(id){if(live.has(id)||id[0]==='#')return;live.add(id);const n=byId.get(id);if(n){visit(n.a);if(n.b)visit(n.b);}}
  for(const id of outputs.keys())visit(id);
  return {nodes:nodes.filter(n=>live.has(n.id)),inputs:inputs.filter(id=>live.has(id)),outputs:[...outputs],bias,trace,allNodes:nodes};
}
function expression(g,a,b) {
  const table=['0',`1^(${a}|${b})`,`(1^${a})&${b}`,`1^${a}`,`${a}&(1^${b})`,`1^${b}`,`${a}^${b}`,`1^(${a}&${b})`,`${a}&${b}`,`1^(${a}^${b})`,b,`(1^${a})|${b}`,a,`${a}|(1^${b})`,`${a}|${b}`,'1'];
  return table[g];
}
function emitBody(graph) {
  let code='';
  for(const n of graph.nodes)code+=`const ${n.id}=(${n.kind==='not'?'1^'+n.a:expression(n.g,n.a,n.b)});\n`;
  code+=`return (${graph.bias}${graph.outputs.map(([id,w])=>`+(${w})*${id}`).join('')})/4096;`;
  return code;
}
function validate(s,p) {
  if(p!==0&&p!==1)throw Error('Perspective');
  if(!['namua','mtaji'].includes(s.phase)||![0,1].includes(s.player))throw Error('State flags');
  const integer=(n,max)=>{if(!Number.isSafeInteger(n)||n<0||n>=max)throw Error('Encoding range');};
  if(!Array.isArray(s.pits)||s.pits.length!==2)throw Error('Board shape');
  for(let side=0;side<2;side++) {
    if(s.pits[side].length!==2)throw Error('Rows');
    for(const row of s.pits[side]) {if(row.length!==8)throw Error('Pits');for(const n of row)integer(n,128);}
    integer(s.reserve[side],32);integer(s.pending[side],4294967296);
    if(typeof s.houseOwned[side]!=='boolean')throw Error('House');
  }
}
function compile(model) {
  const graph=makeGraph(model),body=emitBody(graph);
  const fields=new Map();
  const field=expression=>{if(!fields.has(expression))fields.set(expression,'v'+fields.size);return fields.get(expression);};
  function input(index) {
    if(index<320) {
      const pit=Math.floor(index/10), part=index%10,side=pit<16?'p':'o';
      const v=field(`s.pits[${side}][${Math.floor((pit%16)/8)}][${pit%8}]`);
      return part<7?`(${v}>>>${part})&1`:`+(${v}>=${[1,2,4][part-7]})`;
    }
    if(index<330){const k=index-320,v=field(`s.reserve[${k<5?'p':'o'}]`);return `(${v}>>>${k%5})&1`;}
    if(index<394){const k=index-330,v=field(`s.pending[${k<32?'p':'o'}]`);return `(${v}>>>${k%32})&1`;}
    if(index<396)return `+s.houseOwned[${index===394?'p':'o'}]`;
    return ['+(s.player===p)','p','+(s.phase==="mtaji")'][index-396];
  }
  const declarations=graph.inputs.map(id=>`const ${id}=(${input(Number(id.slice(1)))});`).join('\n');
  const code='"use strict";const o=1-p;\n'+[...fields].map(([expr,id])=>`const ${id}=${expr};`).join('\n')+'\n'+declarations+'\n'+body;
  const raw=new Function('s','p',code);
  const bitsCode=graph.inputs.map(id=>`const ${id}=x[${Number(id.slice(1))}];`).join('\n')+'\n'+body;
  const rawBits=new Function('x','"use strict";'+bitsCode);
  const clip=v=>Math.max(-1,Math.min(1,v));
  function evaluate(s,p) {
    if(s.winner!==null)return s.winner===p?1000000:-1000000;
    validate(s,p);
    return Math.trunc(1024*(clip(raw(s,p))-clip(raw(s,1-p)))/2);
  }
  return {evaluate,raw,rawBits,graph,stats:{originalGates:1536,constructedNodes:graph.allNodes.length,liveNodes:graph.nodes.length,usedInputs:graph.inputs.length,readoutTerms:graph.outputs.length,codeBytes:Buffer.byteLength(code)},code};
}
module.exports={makeGraph,expression,validate,compile};
