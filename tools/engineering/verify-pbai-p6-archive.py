"""Read-only audit of the closed PBAI-P6 archive. No source generation or training."""
import hashlib, json, pathlib, tarfile
root=pathlib.Path(__file__).resolve().parents[2]
out=root/'artifacts/pbai-p6'
index=json.loads((out/'final-evidence-index.json').read_text())
archive=out/'final-evidence.tar.gz'
assert hashlib.sha256(archive.read_bytes()).hexdigest()==index['archiveSha256']
with tarfile.open(archive) as tar:
    contents={m.name.removeprefix('run/'):tar.extractfile(m).read() for m in tar.getmembers() if m.isfile()}
assert set(contents)=={r['path'] for r in index['files']}
for row in index['files']:
    data=contents[row['path']]
    assert len(data)==row['bytes']
    assert hashlib.sha256(data).hexdigest()==row['sha256']
for raw,saved in [('FINAL_RESULT.json','final-result.json'),('training.json','training.json'),('export-verification.json','export-verification.json'),('replay-verification.json','replay-verification.json'),('independent-audit.json','independent-audit.json')]:
    assert contents[raw]==(out/saved).read_bytes()
assert contents['RUN_STARTED.json']==(out/'run/RUN_STARTED.json').read_bytes()
summary=json.loads((out/'development-summary.json').read_text())
full=json.loads(contents['development-evaluation.json'])
assert summary=={k:full[k] for k in summary}
assert json.loads(contents['FINAL_RESULT.json'])['decision']=='DEVELOPMENT-GATE-FAIL / HOLD'
assert json.loads(contents['independent-audit.json'])['passed']
assert not any(name.startswith(('validation-','holdout-')) for name in contents)
print(json.dumps({'passed':True,'files':len(contents),'archiveSha256':index['archiveSha256'],'newMeasurements':0}))
