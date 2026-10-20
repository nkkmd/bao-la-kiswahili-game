"""保存済み配布一覧と固定ソースだけで、軽量経路の限定判断を再計算する。"""
import gzip
import hashlib
import json
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/runner-topology-20261017'
ORIGIN_SHA = '49991a5cde832654d92e54088bfba9ad1d7c31cde54fe8f902b19027585a5b02'
LIST_SHA = 'd15aa6e65c370186676f529740c4ee61ec9d7a65b672401c47ea691cc544b8c1'


def verify(doc=DOC):
    review = doc / 'lightweight-20261020'
    raw = (review / 'SOURCE_ORIGIN.json').read_bytes()
    if hashlib.sha256(raw).hexdigest() != ORIGIN_SHA:
        raise ValueError('ORIGIN-HASH')
    origin = json.loads(raw)
    for entry in origin['files']:
        data = (review / 'upstream' / entry['path']).read_bytes()
        blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256'] or blob != entry['gitBlob']:
            raise ValueError('SOURCE-HASH')
    license = (review / 'upstream/LICENSE').read_bytes()
    if hashlib.sha256(license).hexdigest() != origin['license']['sha256']:
        raise ValueError('LICENSE-HASH')
    packed = (doc / 'capacity-20261020/RUNNER_PACKAGE_INVENTORY.json.gz').read_bytes()
    if hashlib.sha256(packed).hexdigest() != LIST_SHA:
        raise ValueError('PACKAGE-LIST-HASH')
    listing = json.loads(gzip.decompress(packed))
    files = {str(PurePosixPath(e['name'])): e['logicalBytes']
             for e in listing['entries'] if e['kind'] == 'file'}
    bin_bytes = sum(size for path, size in files.items() if path.startswith('bin/'))
    node20 = files['externals/node20/bin/node']
    node24 = files['externals/node24/bin/node']
    dual = bin_bytes + node20 + node24
    # 単一runtime仮定の部品和であり、全入力やpeakの推定値ではない。
    partial = bin_bytes + node24 + 11746870 + 8020928 + 4066232 + 16777216
    return {'decision': 'NO-LIGHTWEIGHT-ROUTE-CERTIFIED',
            'binLogicalBytes': bin_bytes, 'node20ExecutableBytes': node20,
            'node24ExecutableBytes': node24, 'binAndTwoNodeExecutablesBytes': dual,
            'dualRuntimeSubsetExceeds256MiB': dual > 256 * 1024**2,
            'singleRuntimeIllustrativeComponentBytes': partial,
            'singleRuntimeArithmeticRemainderBytes': 256 * 1024**2 - partial,
            'remainderIsAvailableBudget': False,
            'shellOnlyActionsJob': 'PRIORITY-FOR-STATIC-ROUTE-AUDIT-NOT-IMPLEMENTED',
            'standaloneExecutor': 'JOB-ATTEMPT-PROVENANCE-CONTRACT-REVIEW-REQUIRED',
            'runnerSubsetProvenExecutable': False, 'retryFreeTransportProven': False,
            'hostArchitectureConfirmed': False, 'wholeLifecycleOsProven': False,
            'scientificSeedsRead': 0, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
