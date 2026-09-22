'use strict';
function choose(n,k){if(k<0||k>n)return 0;k=Math.min(k,n-k);let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r;}
function exactTwoSided(k,n){if(n===0)return 1;const m=Math.min(k,n-k);let tail=0;for(let i=0;i<=m;i++)tail+=choose(n,i)/2**n;return Math.min(1,2*tail);}
function summarize(games,stage){
 const rows=games.filter(g=>g.stage===stage),terminal=rows.filter(g=>g.status==='TERMINAL'),jevWins=terminal.filter(g=>g.winner===g.jevPlayer).length;
 const aiWins=terminal.filter(g=>g.winner!==null&&g.winner!==g.jevPlayer).length,pairs=new Map();
 for(const g ofterminal){if(!pairs.has(g.openingId))pairs.set(g.openingId,[]);pairs.get(g.openingId).push(g);}
 let jev20=0,ai20=0,split=0,incomplete=0;
 const openingIds=new Set(rows.map(g=>g.openingId));
 for(const id of openingIds){const pair=pairs.get(id)||[];if(pair.length!==2){incomplete++;continue;}const wins=pair.filter(g=>g.winner===g.jevPlayer).length;if(wins===2)jev20++;else if(wins===0)ai20++;else split++;}
 const directional=jev20+ai20,p=exactTwoSided(jev20,directional);
 return{stage,plannedGames:rows.length,terminalGames:terminal.length,jevWins,aiGen4Wins:aiWins,jev2_0Pairs:jev20,aiGen4_2_0Pairs:ai20,split1_1Pairs:split,incompletePairs:incomplete,directionalPairs:directional,pValueTwoSided:p};
}
module.exports={summarize,exactTwoSided};
