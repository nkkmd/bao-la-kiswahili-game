"use strict";
function union(domains){const parents=domains.map((_,i)=>i),owners=new Map();const find=i=>parents[i]===i?i:(parents[i]=find(parents[i]));
 domains.forEach((d,i)=>d.boundaryIdentities.forEach(id=>{if(owners.has(id))parents[find(i)]=find(owners.get(id));else owners.set(id,i);}));const groups=new Map();domains.forEach((_,i)=>{const p=find(i);if(!groups.has(p))groups.set(p,[]);groups.get(p).push(i);});return [...groups.values()].sort((a,b)=>a[0]-b[0]);}
function independent(domains){const remaining=new Set(domains.map((_,i)=>i)),groups=[];while(remaining.size){const group=[Math.min(...remaining)];remaining.delete(group[0]);for(let n=0;n<group.length;n++){const seen=new Set(domains[group[n]].boundaryIdentities);for(const i of [...remaining])if(domains[i].boundaryIdentities.some(id=>seen.has(id))){remaining.delete(i);group.push(i);}}groups.push(group.sort((a,b)=>a-b));}return groups;}
module.exports={union,independent};
