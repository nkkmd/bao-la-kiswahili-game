"""保存済みの測定行から、JavaScript集計とは別に判定を検算する。"""
import json, pathlib, math, statistics, hashlib
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'artifacts/pbai-p8/run'
SPEC=json.loads((ROOT/'doc/ai-engineering/public-ai-improvement-program-8/SPEC.json').read_text())

def load(p): return json.loads(p.read_text())
def close(a,b): assert math.isclose(a,b,rel_tol=1e-10,abs_tol=1e-12),(a,b)
def quantile(xs,p): return sorted(xs)[max(0,math.ceil(len(xs)*p)-1)]

def run():
    checks=[]
    for split in ('development','validation'):
        p=OUT/f'{split}-evaluation.json'
        if not p.exists(): continue
        report=load(p); rows=report['rows']; summaries={}
        for kind in ('baseline','previous','logic'):
            errors=[(max(-1,min(1,r['scores'][kind]/1024))-r['target'])**2 for r in rows]
            mse=statistics.mean(errors); close(mse,report['summary'][kind]['mse'])
            ratios=[statistics.median(r['timings'][kind])/statistics.median(r['timings']['baseline']) for r in rows]
            phases={phase:statistics.median([v for r,v in zip(rows,ratios) if r['phase']==phase]) for phase in ('namua','mtaji')}
            for phase,value in phases.items(): close(value,report['summary'][kind]['phaseMedianRatio'][phase])
            p95=quantile(ratios,.95);close(p95,report['summary'][kind]['p95Ratio'])
            failures=sum(c['failure'] is not None for c in report['tactical'][kind]['cases'])
            assert failures==report['summary'][kind]['tacticalFailures']
            assert len(report['tactical'][kind]['cases'])==8
            summaries[kind]=(mse,phases,p95,failures)
            assert report['modelSha256']==SPEC['modelSha256']
        logic=summaries['logic']; baseline=summaries['baseline']
        gates={'mse':logic[0]<=baseline[0]*1.10,'phaseSpeed':all(v<=.90 for v in logic[1].values()),'p95Speed':logic[2]<=1.10,'tactical':logic[3]==0,'baselineTactical':baseline[3]==0,'equivalence':load(OUT/f'{split}-equivalence.json')['passed'],'previousSpeed':all(statistics.median([statistics.median(r['timings']['logic'])/statistics.median(r['timings']['previous']) for r in rows if r['phase']==p])<=.90 for p in ('namua','mtaji')) and quantile([statistics.median(r['timings']['logic'])/statistics.median(r['timings']['previous']) for r in rows],.95)<=1.10}
        assert gates==report['gates'];assert all(gates.values())==report['passed'];checks.append(split+'-evaluation')
    final=None
    for split in ('development','validation','holdout'):
        pairs=[load(p) for p in sorted(OUT.glob(f'{split}-pair-*.json'))]
        if not pairs: continue
        report=load(OUT/f'{split}-matches.json')
        assert len(pairs)==SPEC['matches'][split]['pairsPerPhase']*2
        for pair in pairs:
            assert [g['side'] for g in pair['games']]==[0,1]
            close(statistics.mean(g['score'] for g in pair['games']),pair['points'])
        points=statistics.mean(p['points'] for p in pairs);close(points,report['points'])
        phases={phase:statistics.mean(p['points'] for p in pairs if p['phase']==phase) for phase in ('namua','mtaji')}
        for phase,value in phases.items():close(value,report['phasePoints'][phase])
        rates={}
        for kind in ('logic','baseline'):
            times=[m['elapsedMs'] for p in pairs for g in p['games'] for m in g['plies'] if m['actor']==kind]
            rates[kind]=statistics.mean(t>150 for t in times);close(rates[kind],report['overrun'][kind])
        gates={'points':points>=.45,'phasePoints':all(p>=.35 for p in phases.values()),'operation':rates['logic']<=rates['baseline']+.05}
        assert gates==report['gates'];assert all(gates.values())==report['passed'];checks.append(split+'-matches')
        if split=='holdout':
            parent=list(range(len(pairs)))
            def find(i):
                while parent[i]!=i: i=parent[i]
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
            random=np.random.default_rng(SPEC['bootstrapSeed']); draws=[]
            for _ in range(10000):
                means=[]
                for phase in ('namua','mtaji'):
                    groups=[[p['points'] for p in group] for group in clusters.values() if group[0]['phase']==phase]
                    chosen=random.integers(len(groups),size=len(groups)); vals=[x for i in chosen for x in groups[i]];means.append(statistics.mean(vals))
                draws.append(statistics.mean(means))
            interval=[quantile(draws,.025),quantile(draws,.975)]
            passed=len(clusters)>=200 and points>=.53 and interval[0]>.50 and all(v>=.45 for v in phases.values()) and gates['operation']
            final={'points':points,'phasePoints':phases,'clusters':len(clusters),'interval95':interval,'passed':passed,'decision':'STRENGTH-IMPROVED-IN-FROZEN-DOMAIN' if passed else 'STRENGTH-IMPROVEMENT-UNCONFIRMED / HOLD'}
    assert load(OUT/'replay-verification.json')['passed']
    with (OUT/'independent-audit.json').open('x') as f:json.dump({'passed':True,'checks':checks,'final':final},f,indent=2);f.write('\n')
if __name__=='__main__':run()
