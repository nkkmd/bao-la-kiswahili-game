"use strict";

const P0 = require("./pcrpr-stage0-production.js");
const Core = require("./pcrpr-stage1-production.js");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function cmp(a,b){return a<b?-1:a>b?1:0;}
function sum(values){let out=0;for(const v of values){ensure(Number.isFinite(v),"non-finite sum");out+=v;}return out;}
function mean(values){return values.length?sum(values)/values.length:0;}
function sd(values){if(!values.length)return 0;const m=mean(values);return Math.sqrt(sum(values.map((x)=>(x-m)**2))/values.length);}
function rmse(actual,pred){ensure(actual.length===pred.length&&actual.length>0,"invalid RMSE vectors");return Math.sqrt(sum(actual.map((y,i)=>(pred[i]-y)**2))/actual.length);}

function averageRanks(values, identities){
  ensure(values.length===identities.length,"rank length mismatch");
  const indexed=values.map((value,i)=>({value,id:identities[i],i})).sort((a,b)=>a.value-b.value||cmp(a.id,b.id));
  const ranks=new Array(values.length);
  let start=0;
  while(start<indexed.length){let end=start+1;while(end<indexed.length&&indexed[end].value===indexed[start].value)end++;const avgRank=((start+1)+end)/2;for(let j=start;j<end;j++)ranks[indexed[j].i]=avgRank;start=end;}
  return ranks;
}
function pearson(a,b){ensure(a.length===b.length&&a.length>0,"invalid correlation vectors");const ma=mean(a),mb=mean(b);let num=0,da=0,db=0;for(let i=0;i<a.length;i++){const xa=a[i]-ma,xb=b[i]-mb;num+=xa*xb;da+=xa*xa;db+=xb*xb;}if(da===0||db===0)return 0;return num/Math.sqrt(da*db);}
function spearman(rows,predictions){const ids=rows.map((r)=>r.rowIdentity),target=rows.map((r)=>r.primaryLift);return pearson(averageRanks(target,ids),averageRanks(predictions,ids));}

function featureMap(row){const out=new Map();for(const cell of row.representation.vector.rows)out.set(`${cell.family}.${cell.name}`,cell.value);return out;}
function activeFeatureNames(row,families){const allowed=new Set(families);return row.representation.vector.rows.filter((cell)=>allowed.has(cell.family)).map((cell)=>`${cell.family}.${cell.name`);}
