'use strict';
const {P}=require('./strength-ledger.cjs');
function cdf(k,n,p){if(k<0)return 0;if(k>=n)return 1;if(p===0)return 1;if(p===1)return 0;
 let term=(1-p)**n,sum=term;for(let i=1;i<=k;i++){term*=((n-i+1)/i)*(p/(1-p));sum+=term;}return Math.min(1,sum);}
function inverseCDF(k,n,target){let lo=0,hi=1;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(cdf(k,n,mid)>target)lo=mid;else hi=mid;}return(lo+hi)/2;}
function exact(A,B){const n=A+B;return{pValue:n?Math.min(1,2*cdf(Math.min(A,B),n,.5)):1,
 q:n?A/n:null,q95:n?[A===0?0:inverseCDF(A-1,n,.975),A===n?1:inverseCDF(A,n,.025)]:null};}
function summarize(games,stage,{integrityOK=true}={}){
 const expected=stage==='pilot'?4:64,valid=games.filter(g=>g.status==='TERMINAL'&&[0,1].includes(g.winner)),W=valid.filter(g=>g.winner===g.candidatePlayer).length;
 const deviations=games.filter(g=>g.clockDeviation).length;
 const complete=games.length===expected&&valid.length===expected&&integrityOK&&!deviations;
 const result={stage,plannedGames:expected,recordedGames:games.length,terminalGames:valid.length,
  jevWins:W,baselineWins:valid.length-W,missingGames:expected-valid.length,clockDeviationGames:deviations,
  decision:complete?(stage==='pilot'?'PILOT-PASS':'INCONCLUSIVE'):'INCOMPLETE',
  possibleScoreBounds:[W/expected,(W+expected-valid.length)/expected]};
 if(stage==='formal'&&complete){let A=0,B=0,C=0;const groups=new Map();
  for(const g of games){if(!groups.has(g.openingId))groups.set(g.openingId,[]);groups.get(g.openingId).push(g);}
  if(groups.size!==32||[...groups.values()].some(p=>p.length!==2||p[0].candidatePlayer+p[1].candidatePlayer!==1))throw new Error('PAIR_MISMATCH');
  for(const p of groups.values()){const w=p.filter(g=>g.winner===g.candidatePlayer).length;if(w===2)A++;else if(w===0)B++;else C++;}
  Object.assign(result,{pairs:{jev2to0:A,baseline2to0:B,tied1to1:C},gameWinRate:W/64,...exact(A,B),alpha:P.statistics.alpha});
  if(result.pValue<=.05)result.decision=A>B?'JEV-SUPERIOR':'BASELINE-SUPERIOR';
 }
 return result;
}
module.exports={cdf,exact,summarize};
