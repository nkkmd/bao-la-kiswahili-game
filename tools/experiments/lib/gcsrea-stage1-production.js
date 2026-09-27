"use strict";

const crypto = require("node:crypto");
const P1 = "LGTTCI-P1-UNIFORM-LEGAL", P2 = "LGTTCI-P2-MIN-IMMEDIATE-CAPTURE";
const RF1 = "LGTTCI-RF1-MID-ANCHOR", RF2 = "LGTTCI-RF2-OFFSET-ANCHOR";
const ASSIGN = "GCSREA-S1-ASSIGN-2026-09-27-v1";
const SELECT = "GCSREA-S1-SELECT-2026-09-27-v1";
function need(x,m){if(!x)throw new Error(m);}
function stable(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(stable).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;}
function sha(s){return crypto.createHash("sha256").update(String(s),"utf8").digest("hex");}
function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;}
function q(n,d){n=BigInt(n);d=BigInt(d);need(d!==0n,"zero denominator");if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function cmp(a,b){need(a?.defined&&b?.defined,"defined rationals required");const x=BigInt(a.numerator)*BigInt(b.denominator),y=BigInt(b.numerator)*BigInt(a.denominator);return x<y?-1:x>y?1:0;}
function midpoint(values){need(values.length>0,"values required");const a=values.slice().sort(cmp),n=a.length;if(n%2)return a[(n-1)/2];const x=a[n/2-1],y=a[n/2];return q(BigInt(x.numerator)*BigInt(y.denominator)+BigInt(y.numerator)*BigInt(x.denominator),2n*BigInt(x.denominator)*BigInt(y.denominator));}
function assign(seed){const h=sha(`${ASSIGN}|${seed}`);return{policyId:parseInt(h.slice(0,2),16)%2?P2:P1,rootFamilyId:parseInt(h.slice(2,4),16)%2?RF2:RF1,phase:parseInt(h.slice(4,6),16)%2?"mtaji":"namua"};}
function selectionRank(row){return sha([SELECT,row.policyId,row.rootFamilyId,row.phase,row.sourceSeed,row.fullTrajectorySha256,row.rootRawSha256].join("|"));}
function profile(rows, metricIds){const out={};for(const id of metricIds){out[id]={};for(const phase of["namua","mtaji"]){const vals=rows.filter(r=>r.phase===phase&&r.geometry[id]?.defined).map(r=>r.geometry[id]);const unique=[];for(const v of vals)if(!unique.some(x=>cmp(x,v)===0))unique.push(v);const threshold=vals.length?midpoint(vals):null;let high=0,low=0,equal=0;if(threshold)for(const v of vals){const c=cmp(v,threshold);if(c>0)high++;else if(c<0)low++;else equal++;}out[id][phase]={definedCount:vals.length,distinctCount:unique.length,threshold,high,low,equal,variation:unique.length>=2};}}return out;}
function supportSlots({geometryProfile,searchDefinedness,metricIds,contrastIds,selectedRootCount,allEightCellsRepresented,productionIndependentExact}){const slots=[];for(const metricId of metricIds)for(const contrastId of contrastIds){const g=geometryProfile[metricId],searchN=searchDefinedness[contrastId]||0;const geometryDefined=(g.namua.definedCount+g.mtaji.definedCount);const high=(g.namua.high+g.mtaji.high),low=(g.namua.low+g.mtaji.low);const pass=allEightCellsRepresented&&productionIndependentExact&&selectedRootCount>=120&&geometryDefined>=120&&searchN>=120&&g.namua.variation&&g.mtaji.variation&&high>=20&&low>=20;slots.push({slotId:`${metricId}/${contrastId}`,metricId,contrastId,geometryDefined,searchDefined:searchN,namuaVariation:g.namua.variation,mtajiVariation:g.mtaji.variation,highCount:high,lowCount:low,decision:pass?"SUPPORTED-FOR-FORMAL-HOLDOUT":"NOT-SUPPORTED-FOR-FORMAL-HOLDOUT"});}return slots;}
module.exports={P1,P2,RF1,RF2,stable,sha,q,cmp,midpoint,assign,selectionRank,profile,supportSlots};
