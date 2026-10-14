"""原ZIPと保存objectの取得後検算。実Git通信やsource生成は行わない。"""
from pathlib import Path,PurePosixPath
import json,hashlib,gzip,zipfile,io,tempfile,subprocess,sys
BASE=Path(__file__).resolve().parents[3]
DOC=BASE/'doc/research-generation-5/befcs-remote-review-20261014'
OLD=BASE/'doc/research-generation-5/befcs-remote-joined-20261014'
def digest(b):return hashlib.sha256(b).hexdigest()
def check(write=False,hashes=False):
    if not write:
        for name,h in json.loads((DOC/'BINDINGS.json').read_text())['files'].items():assert digest((BASE/name).read_bytes())==h,name
    rows=[];members=0;total=0
    for version,run in [(1,38473413073),(2,38474301794)]:
        meta=json.loads((DOC/f'CI_{run}.json').read_text())
        jobs={j['name']:j for j in meta['jobs']['jobs']}
        for a in meta['artifacts']['artifacts']:
            mode=a['name'].removeprefix('befcs-remote-joined-').rsplit('-',2)[0];d=OLD/f'results-v{version}'/mode
            if (d/'ZIP_PARTS.json').exists():
                parts=json.loads((d/'ZIP_PARTS.json').read_text());chunks=[]
                for p in parts['parts']:
                    b=(d/p['path']).read_bytes();assert len(b)==p['bytes'];assert digest(b)==p['sha256'];chunks.append(b)
                raw=b''.join(chunks);assert digest(raw)==parts['sha256'];assert len(raw)==parts['bytes']
            else:raw=(d/'CI_ARTIFACT.zip').read_bytes()
            assert len(raw)==a['size_in_bytes'];assert digest(raw)==a['digest'].split(':')[1]
            with zipfile.ZipFile(io.BytesIO(raw)) as z:
                assert len(z.namelist())==len(set(z.namelist()));assert sum(p.file_size for p in z.infolist())<=268435456
                for p in z.infolist():
                    assert not PurePosixPath(p.filename).is_absolute() and '..' not in PurePosixPath(p.filename).parts
                    assert (p.external_attr>>16)&0o170000!=0o120000
                inventory={p.filename:{'bytes':p.file_size,'sha256':digest(z.read(p))} for p in z.infolist() if not p.is_dir()}
                saved=json.loads(gzip.decompress((d/'FILE_HASHES.json.gz').read_bytes()))
                if isinstance(saved,list):saved={p.get('path',p.get('name')):{k:p[k] for k in ['bytes','sha256']} for p in saved}
                assert inventory==saved,(version,mode)
                if not hashes:
                    with tempfile.TemporaryDirectory(prefix='remote-archive-read-') as tmp:
                        z.extractall(tmp)
                        r=json.loads(subprocess.check_output(['node','--max-old-space-size=384',str(BASE/'tools/research/g5-befcs-remote-review/verify.cjs'),tmp],text=True))
                    assert r['fixturePassed']==(jobs[f'remote-joined ({mode})']['conclusion']=='success')
                    r={'version':version,**r}
                    if write:(DOC/f'V{version}_{mode}.json').write_text(json.dumps(r,indent=2)+'\n')
                    else:assert r==json.loads((DOC/f'V{version}_{mode}.json').read_text()),(version,mode)
                    rows.append(r)
            members+=len(inventory);total+=len(raw)
            print(version,mode,'一致',len(inventory),flush=True)
    if write:(DOC/'SUMMARY.json').write_text(json.dumps(rows,indent=2)+'\n')
    print(json.dumps({'archives':10,'members':members,'bytes':total,'scientificSeedsRead':0,'sourceGenerationPerformed':False}))
if __name__=='__main__':check('--write' in sys.argv,'--hashes-only' in sys.argv)
