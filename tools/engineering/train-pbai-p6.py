"""PBAI-P6: fixed CPU training, no validation data access."""
import os
for name in ('OPENBLAS_NUM_THREADS', 'OMP_NUM_THREADS', 'MKL_NUM_THREADS'):
    os.environ[name] = '1'
import json
import pathlib
import time
import numpy as np
ROOT = pathlib.Path(__file__).resolve().parents[2]
DOC = ROOT / 'doc/ai-engineering/public-ai-improvement-program-6'
OUT = ROOT / 'artifacts/pbai-p6/run'
SPEC = json.loads((DOC / 'SPEC.json').read_text())

def encode(s, p):
    x = []
    def bits(n, width):
        if not isinstance(n, int) or n < 0 or n >= 2**width:
            raise ValueError('Encoding range')
        x.extend((n >> j) & 1 for j in range(width))
    for side in (p, 1-p):
        for row in s['pits'][side]:
            for n in row:
                bits(n, 7)
                x.extend(int(n >= t) for t in (1,2,4))
    for side in (p,1-p): bits(s['reserve'][side],5)
    for side in (p,1-p): bits(s['pending'][side],32)
    x.extend(int(s['houseOwned'][side]) for side in (p,1-p))
    x.extend((int(s['player']==p),p,int(s['phase']=='mtaji')))
    assert len(x)==399
    return x

def save(name, value):
    with (OUT/name).open('x') as f:
        json.dump(value,f,separators=(',',':'),allow_nan=False)
        f.write('\n')

def ridge(x,y,lam=.01):
    xm=x.mean(0); ym=y.mean(); z=x-xm
    w=np.linalg.solve(z.T@z + len(x)*lam*np.eye(x.shape[1]), z.T@(y-ym))
    return w, float(ym-xm@w)

def softmax(x):
    p=np.exp(x-x.max(1,keepdims=True)); return p/p.sum(1,keepdims=True)

TABLE=np.array([[(g>>i)&1 for i in range(4)] for g in range(16)],dtype=float)

def gate_forward(x,layers):
    h=np.empty((len(x),0)); cache=[]
    for a,b,logits in layers:
        pool=np.concatenate((x,h),axis=1); u=pool[:,a]; v=pool[:,b]
        probs=softmax(logits); c=probs@TABLE
        h=(1-u)*((1-v)*c[:,0]+v*c[:,1])+u*((1-v)*c[:,2]+v*c[:,3])
        cache.append((pool,u,v,probs,c))
    return h, cache

def gate_backward(dh,layers,cache):
    grads=[]
    for (a,b,logits),(pool,u,v,p,c) in zip(layers[::-1],cache[::-1]):
        dc=np.stack(((dh*(1-u)*(1-v)).sum(0),(dh*(1-u)*v).sum(0),(dh*u*(1-v)).sum(0),(dh*u*v).sum(0)),axis=1)
        dp=dc@TABLE.T
        grads.append(p*(dp-(dp*p).sum(1,keepdims=True)))
        du=dh*((1-v)*(c[:,2]-c[:,0])+v*(c[:,3]-c[:,1]))
        dv=dh*((1-u)*(c[:,1]-c[:,0])+u*(c[:,3]-c[:,2]))
        dpool=np.zeros_like(pool)
        np.add.at(dpool,(np.arange(len(pool))[:,None],a[None,:]),du)
        np.add.at(dpool,(np.arange(len(pool))[:,None],b[None,:]),dv)
        dh=dpool[:,399:]
    return grads[::-1]

class Adam:
    def __init__(self,params,lr):
        self.params=params; self.lr=lr; self.m=[np.zeros_like(p) for p in params]; self.v=[np.zeros_like(p) for p in params]; self.t=0
    def step(self,grads):
        self.t+=1
        for p,g,m,v in zip(self.params,grads,self.m,self.v):
            if not np.isfinite(g).all(): raise ValueError('Nonfinite gradient')
            m[:]=.9*m+.1*g; v[:]=.999*v+.001*g*g
            p-=self.lr*(m/(1-.9**self.t))/(np.sqrt(v/(1-.999**self.t))+1e-8)

def hard_features(x,layers):
    h=np.empty((len(x),0),dtype=int)
    for layer in layers:
        pool=np.concatenate((x,h),axis=1).astype(int)
        h=(np.array(layer['gates'])[None,:] >> (2*pool[:,layer['a']]+pool[:,layer['b']]))&1
    return h

def model_predict(model,x):
    if model['kind']=='logic': return (hard_features(x,model['layers'])@np.array(model['weights'])+model['bias'])/4096
    if model['kind']=='linear': return (x@np.array(model['weights'])+model['bias'])/4096
    return np.tanh(x@np.array(model['w1'])+model['b1'])@np.array(model['w2'])+model['b2']

def run():
    if os.environ.get('PBAI_P6_SUPERVISED')!='1': raise RuntimeError('Use supervisor')
    data=json.loads((OUT/'train-dataset.json').read_text())
    xs=[]; ys=[]
    for row in data['rows']:
        for p in (0,1):
            xs.append(encode(row['state'],p)); ys.append(row['target']*(1 if p==row['state']['player'] else -1))
    x=np.array(xs,dtype=float); y=np.array(ys,dtype=float)
    reports={}; models={}; cfg=SPEC['training']
    start=time.monotonic(); w,b=ridge(x,y)
    models['linear']={'kind':'linear','inputSize':399,'weights':np.rint(w*4096).astype(int).tolist(),'bias':int(np.rint(b*4096))}
    reports['linear']={'seconds':time.monotonic()-start}
    for kind in ('mlp','logic'):
        random=np.random.default_rng(SPEC['initializationSeeds'][kind]); start=time.monotonic()
        if kind=='mlp':
            w1=random.normal(0,1/np.sqrt(399),(399,32)); b1=np.zeros(32); w2=random.normal(0,.05,32); b2=np.zeros(1)
            opt=Adam([w1,b1,w2,b2],cfg['mlpLearningRate'])
        else:
            layers=[]
            for i in range(3):
                n=399+(512 if i else 0); a=random.integers(n,size=512); b=random.integers(n,size=512)
                logits=random.normal(0,.01,(512,16)); logits[np.arange(512),random.integers(16,size=512)]+=2
                layers.append((a,b,logits))
            w2=random.normal(0,.05,512); b2=np.zeros(1); opt=Adam([l[2] for l in layers]+[w2,b2],.01)
        losses=[]
        for epoch in range(cfg['epochs']):
            order=random.permutation(len(x))
            for first in range(0,len(x),cfg['batchSize']):
                idx=order[first:first+cfg['batchSize']]; xb=x[idx]; yb=y[idx]
                if kind=='mlp': h=np.tanh(xb@w1+b1)
                else: h,cache=gate_forward(xb,layers)
                pred=h@w2+b2[0]; delta=2*(pred-yb)/len(xb)
                dw2=h.T@delta; db2=np.array([delta.sum()]); dh=delta[:,None]*w2
                if kind=='mlp':
                    dz=dh*(1-h*h); grads=[xb.T@dz,dz.sum(0),dw2,db2]
                else: grads=gate_backward(dh,layers,cache)+[dw2,db2]
                opt.step(grads)
            if (epoch+1)%25==0:
                if kind=='mlp': h=np.tanh(x@w1+b1)
                else: h,_=gate_forward(x,layers)
                loss=float(np.mean((h@w2+b2[0]-y)**2)); losses.append({'epoch':epoch+1,'trainMse':loss}); print(json.dumps({'stage':'train','model':kind,**losses[-1]}),flush=True)
        if kind=='mlp': models[kind]={'kind':kind,'inputSize':399,'w1':w1.tolist(),'b1':b1.tolist(),'w2':w2.tolist(),'b2':float(b2[0])}
        else:
            hard=[{'a':a.tolist(),'b':b.tolist(),'gates':logits.argmax(1).tolist()} for a,b,logits in layers]
            w,b=ridge(hard_features(x,hard),y)
            models[kind]={'kind':kind,'inputSize':399,'layers':hard,'weights':np.rint(w*4096).astype(int).tolist(),'bias':int(np.rint(b*4096))}
        reports[kind]={'seconds':time.monotonic()-start,'losses':losses}
    expected={}
    for kind,model in models.items():
        pred=np.clip(model_predict(model,x),-1,1)
        values=np.trunc(1024*(pred[::2]-pred[1::2])/2).astype(int)
        reports[kind]['exportedTrainMse']=float(np.mean((values/1024-y[::2])**2))
        save(kind+'-model.json',model); expected[kind]=values.tolist()
    save('training.json',{'numpy':np.__version__,'rows':len(x),'reports':reports,'inputSha256':__import__('hashlib').sha256((OUT/'train-dataset.json').read_bytes()).hexdigest()})
    save('python-expected.json',{'encoding':xs,'evaluationsPerspective0':expected})

if __name__=='__main__': run()
