"""Independent summaries from recorded observations; never runs a timed search."""
import json,math,statistics,random,sys,pathlib,hashlib
root=pathlib.Path(__file__).resolve().parents[2]
stage=sys.argv[1]; d=root/'artifacts/pbai-p4'/stage
read=lambda p:json.loads(p.read_text())
def q(xs,p):
 s=sorted(xs);return s[max(0,math.ceil(len(s)*p)-1)]
def near(a,b):
 assert math.isclose(a,b,rel_tol=1e-12,abs_tol=1e-12),(a,b)
speed=[read(p) for p in d.glob('speed-*.json') if p.name!='speed-summary.json']
ratios=[];tails=[];byphase={'namua':[],'mtaji':[]};rss={'baseline':[],'candidate':[]}
for row in speed:
 for eq in row['equality']:
  assert eq['baseline']==eq['off']==eq['candidate']
  assert not eq['baseline']['stats']['timedOut']
 reference=next(e['baseline'] for e in row['equality'] if e['level']=='hard' and e['maxDepth']==3)
 for mode in ['baseline','candidate']:
  for measurement in row['times'][mode]:
   a=measurement['analysis']; cleaned={'move':a['move'],'stats':{k:v for k,v in a['stats'].items() if k!='elapsedMs'}}
   assert cleaned==reference, 'Timed sample changed deterministic work'
 ts={m:[x['elapsed'] for x in row['times'][m]] for m in rss}
 for m in rss:
  assert len(ts[m])==6
  for x in row['times'][m]:
   assert not x['analysis']['stats']['timedOut']
   rss[m].extend([x['before']['rss'],x['after']['rss']])
 ratio=statistics.median(ts['candidate'])/statistics.median(ts['baseline'])
 tail=q(ts['candidate'],.95)/q(ts['baseline'],.95)
 near(ratio,row['medianRatio']);near(tail,row['p95Ratio'])
 ratios.append(ratio);tails.append(tail);byphase[row['phase']].append(ratio)
phase={p:statistics.median(v) for p,v in byphase.items()};tail=q(tails,.95);rr=max(rss['candidate'])/max(rss['baseline'])
passed=all(v<=.90 for v in phase.values()) and tail<=1.10 and rr<=1.25
obs=read(d/'speed-summary.json');assert obs['passed']==passed
for p in phase:near(obs['phases'][p],phase[p])
near(obs['p95Ratio'],tail);near(obs['rssRatio'],rr)
out={'stage':stage,'verified':True,'speed':{'passed':passed,'phases':phase,'medianRatio':statistics.median(ratios),'p95Ratio':tail,'rssRatio':rr},'productionRunnerImported':False}
if (d/'operation-summary.json').exists():
 rows=[r for p in d.glob('operation-*.json') if p.name!='operation-summary.json' for r in read(p)]
 levels={}
 for level in ['hard','expert']:
  rs=[r for r in rows if r['level']==level]; m={}
  for name in ['baseline','candidate']:
   m[name]={'meanDepth':statistics.mean(r[name]['analysis']['stats']['completedDepth'] for r in rs),'meanNodes':statistics.mean(r[name]['analysis']['stats']['nodes'] for r in rs),'p95Ms':q([r[name]['elapsed'] for r in rs],.95),'timeoutRate':statistics.mean(int(r[name]['analysis']['stats']['timedOut']) for r in rs),'overrunRate':statistics.mean(int(r[name]['elapsed']>r['timeLimitMs']+max(50,r['timeLimitMs']*.1)) for r in rs)}
  b,c=m['baseline'],m['candidate'];ok=c['meanDepth']>=b['meanDepth'] and c['p95Ms']<=b['p95Ms']*1.1+25 and c['overrunRate']<=b['overrunRate']+.05
  levels[level]={**m,'passed':ok}
 op=read(d/'operation-summary.json');assert op['passed']==all(x['passed'] for x in levels.values())
 for level in levels:
  for mode in ['baseline','candidate']:
   for k,v in levels[level][mode].items():near(v,op['levels'][level][mode][k])
 out['operational']={'passed':op['passed'],'levels':levels}
if list(d.glob('pair-*.json')):
 pairs=[read(p) for p in sorted(d.glob('pair-*.json'))]
 score=statistics.mean(p['score'] for p in pairs);phases={s:statistics.mean(p['score'] for p in pairs if p['phase']==s) for s in ['namua','mtaji']}
 # Connected components unite pairs sharing a complete RAW trajectory.
 parent=list(range(len(pairs)))
 def find(i):
  while parent[i]!=i:i=parent[i]
  return i
 seen={};duplicates=0
 for i,p in enumerate(pairs):
  for g in p['games']:
   key=g['trajectory']
   if key in seen and seen[key]!=i:
    parent[find(i)]=find(seen[key]);duplicates+=1
   seen[key]=i
 groups={}
 for i,p in enumerate(pairs):groups.setdefault(find(i),[]).append(p)
 clusters=list(groups.values());strata={s:[g for g in clusters if g[0]['phase']==s] for s in phases}
 assert all(len({p['phase'] for p in g})==1 for g in clusters)
 r=random.Random(819000001);samples=[]
 for _ in range(10000):
  means=[]
  for s,gs in strata.items():
   draw=[p['score'] for _ in gs for p in r.choice(gs)]
   means.append(statistics.mean(draw))
  samples.append(statistics.mean(means))
 ci=[q(samples,.025),q(samples,.975)]
 games=[g for p in pairs for g in p['games']];wins=sum(g['score']==1 for g in games);losses=sum(g['score']==0 for g in games);draws=len(games)-wins-losses
 n=wins+losses
 if n:
  z=1.959963984540054;v=wins/n;den=1+z*z/n;mid=(v+z*z/(2*n))/den;half=z*math.sqrt(v*(1-v)/n+z*z/(4*n*n))/den;wilson=[mid-half,mid+half]
 else:wilson=None
 g={'pairs':len(pairs),'games':len(games),'score':score,'phases':phases,'clusters':len(clusters),'duplicateAcrossPairTrajectories':duplicates,'clusterBootstrap95':ci,'wins':wins,'losses':losses,'draws':draws,'decisiveGamesWilson95':wilson}
 if stage=='holdout':
  readiness=len(games)==512 and len(clusters)>=200 and all(len({p['prefix'] for p in pairs if p['phase']==s})==128 for s in phases)
  strength=readiness and score>=.53 and ci[0]>.5 and all(v>=.45 for v in phases.values())
  g.update(readiness=readiness,strengthPassed=strength)
  if not readiness:decision='STRENGTH-NON-ESTIMABLE / HOLD'
  elif ci[1]<.5 or any(v<.40 for v in phases.values()):decision='STRENGTH-REGRESSION / REJECT'
  elif strength:decision='STRENGTH-IMPROVED-IN-FROZEN-DOMAIN'
  else:decision='SPEED-ONLY-IMPROVEMENT'
  out['decision']=decision
 else:g['passed']=score>=.45 and all(v>=.35 for v in phases.values())
 out['games']=g
if stage=='holdout' and (d.parent/'RESOURCE_STOP.json').exists():
 stop=read(d.parent/'RESOURCE_STOP.json')
 assert stop['processStopped'] and not stop['retryAuthorized']
 assert stop['completedPairs']==len(pairs) and stop['completedGames']==len(games)
 from datetime import datetime,timedelta
 assert datetime.fromisoformat(stop['stoppedAt'])>datetime.fromisoformat(stop['latestPossibleMeasurementStart'])+timedelta(hours=4)
 out['decision']='STRENGTH-NON-ESTIMABLE / HOLD'
 out['games']['strengthPassed']=False
 out['resourceHold']=True
 out['finalEvidenceEligible']=False
 out['replay']=read(d/'independent-replay.json')
else:out['replay']=read(d/'independent-replay.json')
if '--check' in sys.argv:
 assert read(d/'independent-metrics.json')==out
else:
 with (d/'independent-metrics.json').open('x') as f:json.dump(out,f,indent=2,ensure_ascii=False);f.write('\n')
print(json.dumps(out,ensure_ascii=False))
