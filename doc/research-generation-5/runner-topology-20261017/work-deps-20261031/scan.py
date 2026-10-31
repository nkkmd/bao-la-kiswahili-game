import re,json,subprocess,hashlib,posixpath
from pathlib import Path
ref='e8da76a89e42c534960ba060df154e9538b32bc3'
entries=['tools/research/g5-befcs-workload/scientific-source.cjs','tools/research/g5-befcs-workload/independent-scientific-source.cjs','tools/research/g5-befcs-workload/scientific-closure.cjs','tools/research/g5-befcs-host/host.cjs']
tracked=set(subprocess.check_output(['git','ls-tree','-r','--name-only',ref],text=True).splitlines())
pattern=re.compile(r'\brequire\s*\(\s*([\"\'])([^\"\']+)\1\s*\)')
pending=entries[:];seen={};edges=[];unresolved=[];builtins=set();external=set();dynamic=[]
while pending:
 p=pending.pop()
 if p in seen:continue
 raw=subprocess.check_output(['git','show',ref+':'+p]);s=raw.decode();seen[p]={'path':p,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'gitBlob':hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()}
 matches=list(pattern.finditer(s));starts={m.start() for m in matches}
 for m in re.finditer(r'\brequire\s*\(',s):
  if m.start() not in starts:dynamic.append({'path':p,'line':s.count('\n',0,m.start())+1})
 for m in matches:
  name=m.group(2);line=s.count('\n',0,m.start())+1
  if name.startswith('node:'):builtins.add(name);continue
  if not name.startswith('.'):external.add(name);continue
  path=posixpath.normpath(posixpath.join(posixpath.dirname(p),name));candidates=[path,path+'.cjs',path+'.js',path+'.json',path+'/index.js']
  target=next((v for v in candidates if v in tracked),None)
  if target is None:unresolved.append({'path':p,'line':line,'specifier':name});continue
  edges.append({'from':p,'line':line,'specifier':name,'to':target});pending.append(target)
result={'evidenceClass':'TEXTUAL-LITERAL-REQUIRE-OVERAPPROXIMATION-NOT-CALL-GRAPH','sourceCommit':ref,'entries':entries,'files':[seen[k] for k in sorted(seen)],'edges':sorted(edges,key=lambda e:(e['from'],e['line'],e['to'])),'builtins':sorted(builtins),'externalSpecifiers':sorted(external),'unresolved':unresolved,'computedRequireSites':dynamic,'runtimeExecuted':False,'node20CompatibilityProven':False,'wholeLifecycleOsProven':False,'scientificSeedsRead':0,'scientificExecutionAuthorized':False}
print(json.dumps(result,indent=2))
