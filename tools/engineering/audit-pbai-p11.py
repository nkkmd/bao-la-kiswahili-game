"""保存棋譜の集計と層別クラスタ・ブートストラップを独立検算する。"""
import json,pathlib,math,statistics
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'artifacts/pbai-p11/run'
SPEC=json.loads((ROOT/'doc/ai-engineering/public-ai-improvement-program-11/SPEC.json').read_text())
def load(p):return json.loads(p.read_text())
def close(a,b):assert math.isfinite(a) and math.isfinite(b) and math.isclose(a,b,rel_tol=1e-10,abs_tol=1e-12),(a,b)
def quantile(xs,p):return sorted(xs)[max(0,math.ceil(len(xs)*p)-1)]
def run():
 summaries={};final=None; finals={}
 for split in ('pilot','low','standard','high'):
  paths=sorted(OUT.glob(f'{split}-pair-*.json'))
  if not paths:continue
  pairs=[load(p) for p in paths];report=load(OUT/f'{split}-matches.json');config=SPEC['matches'][split]
  assert len(pairs)==config['pairsPerPhase']*2==report['pairs'];assert report['games']==len(pairs)*2
  assert [p['index'] for p in pairs]==list(range(len(pairs)))
  for p in pairs:
   assert [g['side'] for g in p['games']]==[0,1]
   close(statistics.mean(g['score'] for g in p['games']),p['points'])
  points=statistics.mean(p['points'] for p in pairs);close(points,report['points'])
  phases={phase:statistics.mean(p['points'] for p in pairs if p['phase']==phase) for phase in ('namua','mtaji')}
  for phase,value in phases.items():
   assert sum(p['phase']==phase for p in pairs)==config['pairsPerPhase'];close(value,report['phasePoints'][phase])
  rates={};latency={}
  for actor in ('logic','baseline'):
   times=[m['elapsedMs'] for p in pairs for g in p['games'] for m in g['plies'] if m['actor']==actor]
   assert all(math.isfinite(t) and t>=0 for t in times)
   rates[actor]=statistics.mean(t>config['timeLimitMs']+SPEC['search']['wallTimeOverrunAllowanceMs'] for t in times);close(rates[actor],report['overrun'][actor])
   latency[actor]={'requests':len(times),'medianMs':statistics.median(times),'p95Ms':quantile(times,.95),'maxMs':max(times)}
   for k,v in latency[actor].items():close(v,report['latency'][actor][k])
  operation=rates['logic']<=rates['baseline']+SPEC['gates']['overrunRateIncreaseMax'] and rates['logic']<=SPEC['gates']['overrunRateAbsoluteMax'];assert operation==report['operation']
  scores=[g['score'] for p in pairs for g in p['games']]
  summaries[split]={'games':len(scores),'wins':scores.count(1),'losses':scores.count(0),'draws':scores.count(.5),'points':points,'phasePoints':phases,'operation':operation,'latency':latency}
  if split!='pilot':
   parent=list(range(len(pairs)))
   def find(i):
    while parent[i]!=i:i=parent[i]
    return i
   trajectories={}
   for i,p in enumerate(pairs):
    for g in p['games']:
     key=g['trajectory']
     if key in trajectories:parent[find(i)]=find(trajectories[key])
     trajectories[key]=i
   clusters={}
   for i,p in enumerate(pairs):clusters.setdefault(find(i),[]).append(p)
   assert all(len({p['phase'] for p in group})==1 for group in clusters.values())
   random=np.random.default_rng(SPEC['bootstrapSeed']+list(SPEC['matches']).index(split));draws=[]
   for _ in range(SPEC['gates']['bootstrapReplicates']):
    means=[]
    for phase in ('namua','mtaji'):
     groups=[[p['points'] for p in group] for group in clusters.values() if group[0]['phase']==phase]
     chosen=random.integers(len(groups),size=len(groups));means.append(statistics.mean(x for i in chosen for x in groups[i]))
    draws.append(statistics.mean(means))
   interval=[quantile(draws,.025),quantile(draws,.975)];g=SPEC['gates']
   passed=len(clusters)>=g['holdoutClustersMin'] and points>=g['holdoutPointsMin'] and interval[0]>g['holdoutLower95StrictMin'] and all(v>=g['holdoutPhasePointsMin'] for v in phases.values()) and operation
   finals[split]={**summaries[split],'clusters':len(clusters),'interval95':interval,'passed':passed,'decision':'STRENGTH-IMPROVED-IN-COLD-WORKER-DOMAIN' if passed else 'STRENGTH-IMPROVEMENT-UNCONFIRMED / HOLD'}
 assert load(OUT/'replay-verification.json')['passed']
 final={'passed':len(finals)==3 and all(v['passed'] for v in finals.values()),'tiers':finals}
 final['decision']='EXPERT-STRENGTH-PASS / ADOPTION-PENDING' if final['passed'] else 'EXPERT-STRENGTH-UNCONFIRMED / HOLD'
 with (OUT/'independent-audit.json').open('x') as f:json.dump({'passed':True,'summaries':summaries,'final':final,'physicalDeviceVerified':False},f,indent=2,allow_nan=False);f.write('\n')
if __name__=='__main__':run()
