"""人工標本による勾配・ridge・整数変換の技術試験。新規Bao局面は生成しない。"""
import importlib.util,pathlib,numpy as np
p=pathlib.Path(__file__).with_name('train-pbai-p6.py');spec=importlib.util.spec_from_file_location('train',p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
r=np.random.default_rng(17);x=r.integers(2,size=(5,399)).astype(float)
layers=[]
for i in range(2):layers.append((r.integers(399+(4 if i else 0),size=4),r.integers(399+(4 if i else 0),size=4),r.normal(size=(4,16))))
layers[1]=(np.array([399,400,401,402]),np.array([400,401,402,399]),layers[1][2])
h,c=m.gate_forward(x,layers);dh=r.normal(size=h.shape);grads=m.gate_backward(dh,layers,c)
for layer,index in [(0,(1,7)),(1,(2,3))]:
 a=layers[layer][2];old=a[index];eps=1e-5;a[index]=old+eps;plus=(m.gate_forward(x,layers)[0]*dh).sum();a[index]=old-eps;minus=(m.gate_forward(x,layers)[0]*dh).sum();a[index]=old
 assert np.isclose((plus-minus)/(2*eps),grads[layer][index],rtol=1e-5,atol=1e-7)
xx=np.array([[0.],[1.],[2.],[3.]]);w,b=m.ridge(xx,2*xx[:,0]+1,lam=1e-10);assert np.allclose(w,[2]) and np.isclose(b,1)
print('PBAI-P6 gradient and ridge tests passed')
