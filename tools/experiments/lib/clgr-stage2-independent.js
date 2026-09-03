"use strict";
const S1=require("./clgr-stage1-independent.js");
function assert(x,m){if(!x)throw new Error(m);}function unique(xs){return Array.from(new Set(xs)).sort();}
function combineFirewall(base,stage1){
  assert(base&&base.scientificOutcomeFieldsRetained===false&&base.g307ScientificOutcomeFieldsRetained===false,"base identity firewall invalid");
  assert(stage1&&stage1.scientificOutcomeFieldsRetained===false&&stage1.identityRowCount===48&&Array.isArray(stage1.identityRows)&&stage1.identityRows.length===48,"Stage1 identity exclusion invalid");
  const x=base.identitySets||{},rows=stage1.identityRows;
  return {
    scientificOutcomeFieldsRetained:false,
    g307ScientificOutcomeFieldsRetained:false,
    identitySets:{
      rootRawSha256:unique((x.rootRawSha256||[]).concat(rows.map(r=>r.rootRawSha256))),
      sourceTrajectorySha256:unique((x.sourceTrajectorySha256||[]).concat(rows.map(r=>r.sourceTrajectorySha256))),
      openingPrefixSha256:unique((x.openingPrefixSha256||[]).concat(rows.map(r=>r.openingPrefixSha256)))
    },
    stage1IdentityRowsAdded:48
  };
}
function selectRoots(E,S,base,stage1){return S1.selectRoots(E,S,combineFirewall(base,stage1));}
module.exports={combineFirewall,selectRoots,measureRoot:S1.measureRoot,distanceRows:S1.distanceRows,neighbors:S1.neighbors,canonical:S1.canonical,digest:S1.digest,AXES:S1.AXES,REPRESENTATION_ID:S1.REPRESENTATION_ID,sourceOnly:S1.sourceOnly};
