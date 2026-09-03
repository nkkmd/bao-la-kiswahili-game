"use strict";
const S1=require("./clgr-stage1-production.js");
function need(x,m){if(!x)throw new Error(m);}function uniq(xs){return [...new Set(xs)].sort();}
function combineFirewall(base,stage1){
  need(base&&base.scientificOutcomeFieldsRetained===false&&base.g307ScientificOutcomeFieldsRetained===false,"base identity firewall invalid");
  need(stage1&&stage1.scientificOutcomeFieldsRetained===false&&stage1.identityRowCount===48&&Array.isArray(stage1.identityRows)&&stage1.identityRows.length===48,"Stage1 identity exclusion invalid");
  const b=base.identitySets||{},rows=stage1.identityRows;
  const identitySets={
    rootRawSha256:uniq([...(b.rootRawSha256||[]),...rows.map(x=>x.rootRawSha256)]),
    sourceTrajectorySha256:uniq([...(b.sourceTrajectorySha256||[]),...rows.map(x=>x.sourceTrajectorySha256)]),
    openingPrefixSha256:uniq([...(b.openingPrefixSha256||[]),...rows.map(x=>x.openingPrefixSha256)])
  };
  return {scientificOutcomeFieldsRetained:false,g307ScientificOutcomeFieldsRetained:false,identitySets,stage1IdentityRowsAdded:48};
}
function selectRoots(E,S,base,stage1){return S1.selectRoots(E,S,combineFirewall(base,stage1));}
module.exports={combineFirewall,selectRoots,measureRoot:S1.measureRoot,distanceRows:S1.distanceRows,neighbors:S1.neighbors,canonical:S1.canonical,digest:S1.digest,AXES:S1.AXES,REPRESENTATION_ID:S1.REPRESENTATION_ID,sourceOnly:S1.sourceOnly};
