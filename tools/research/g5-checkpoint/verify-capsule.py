#!/usr/bin/env python3
"""保存済み技術証拠を通信・mountなしで再検算する。"""
import base64
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/befcs-capsule-20261016'
SOURCE = '484e3f659480a21fec2009fd4a355f9323191c17'
HEAD = '36327be0da5ed9fdb9d0cee813227530316d3665'
ARTIFACTS = {
    'complete': (12024674097, 12423332, 'b088df2df17cb424aa9e28b61d5e991c3c1813db962588547f78b4746ba17c32'),
    'ack-loss': (12024479786, 12430887, '08116466fbad31059053044e4302f72727c138e8f77c296888ee48f314813504'),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def obj(kind, data):
    return hashlib.sha1(kind.encode() + b' ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def command(args):
    r = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env={**os.environ, 'GIT_NO_LAZY_FETCH': '1'})
    assert r.returncode == 0, (args, r.stderr.decode(errors='replace'))
    return r.stdout


def verify():
    assert sys.flags.optimize == 0, '検証はassertを有効にして実行する'
    ci = read(DOC / 'CI_RECEIPT.json')
    restorations = read(DOC / 'REMOTE_RESTORATION.json')
    assert (ci['runId'], ci['runAttempt'], ci['event'], ci['headSha'], ci['conclusion']) == (38850453567, 1, 'push', HEAD, 'success')
    assert ci['scientificSeedsRead'] == 0 and ci['wholeLifecycleOsProven'] is False
    for path, digest in ci['inputs'].items():
        data = (ROOT / path).read_bytes()
        assert sha(data) == digest, path
        # 実行時コミットの原byteとの結合。既存履歴の読取だけでfetchしない。
        assert data == command(['git', '-C', str(ROOT), 'show', HEAD + ':' + path]), path
    manifest_bytes = (DOC / 'CODE_MANIFEST.json').read_bytes()
    manifest = json.loads(manifest_bytes)
    assert sha(manifest_bytes) == '307af38bfa25636e782032d2b8e1318c3381442fc6c1625e6007d8b8c07a9fbb'
    assert manifest['sourceCommit'] == SOURCE
    assert len(ci['artifacts']) == 2 and {a['mode'] for a in ci['artifacts']} == set(ARTIFACTS)
    output = {}
    for artifact in ci['artifacts']:
        mode = artifact['mode']
        assert (artifact['artifactId'], artifact['bytes'], artifact['sha256']) == ARTIFACTS[mode]
        folder = DOC / 'results' / mode
        parts = read(folder / 'ZIP_PARTS.json')
        chunks = []
        for i, part in enumerate(parts['parts']):
            assert part['name'] == f'CI_ARTIFACT.zip.part-{i:03d}'
            data = (folder / part['name']).read_bytes()
            assert 0 < len(data) <= 2 * 1024**2
            assert len(data) == part['bytes'] and sha(data) == part['sha256']
            chunks.append(data)
        raw = b''.join(chunks)
        assert len(raw) == parts['bytes'] == artifact['bytes']
        assert sha(raw) == parts['sha256'] == artifact['sha256']
        with zipfile.ZipFile(io.BytesIO(raw)) as z, tempfile.TemporaryDirectory() as temporary:
            tmp = Path(temporary)
            expected = {'ARCHIVE_MANIFEST.json', 'REMOTE_RECEIPT.json', 'EVIDENCE.img.gz', 'RESULT.json', 'TRANSPORT.jsonl', 'WORKSPACE.img'}
            assert set(z.namelist()) == expected and len(z.infolist()) == len(expected)
            assert sum(i.file_size for i in z.infolist()) <= 256 * 1024**2
            for item in z.infolist():
                assert not stat.S_ISLNK(item.external_attr >> 16)
            result = json.loads(z.read('RESULT.json'))
            assert result == read(folder / 'RESULT.json')
            meta = json.loads(z.read('ARCHIVE_MANIFEST.json'))
            assert meta == result['archiveMeta']
            assert meta['sourceCommit'] == SOURCE and meta['sourceManifestSha256'] == sha(manifest_bytes)
            assert meta['scientificSeedsRead'] == 0 and meta['finalScientificInputSet'] is False
            assert json.loads(z.read('REMOTE_RECEIPT.json')) == result['remote']
            archive = z.read('EVIDENCE.img.gz')
            assert len(archive) == meta['archiveBytes'] <= 16 * 1024**2
            assert sha(archive) == meta['archiveSha256']
            image = tmp / 'image'
            count = 0
            digest = hashlib.sha256()
            with gzip.GzipFile(fileobj=io.BytesIO(archive)) as source, image.open('wb') as target:
                while data := source.read(1024**2):
                    count += len(data)
                    assert count <= 192 * 1024**2
                    digest.update(data)
                    target.write(data)
            assert count == meta['rawBytes'] == 192 * 1024**2
            assert digest.hexdigest() == meta['imageSha256']
            original = hashlib.sha256()
            count = 0
            with z.open('WORKSPACE.img') as source:
                while data := source.read(1024**2):
                    count += len(data)
                    original.update(data)
            assert count == meta['rawBytes'] and original.hexdigest() == meta['imageSha256']
            command(['e2fsck', '-fn', str(image)])

            def inside(path):
                return command(['debugfs', '-R', 'cat /' + path, str(image)])

            assert inside('CODE_MANIFEST.json') == manifest_bytes
            assert json.loads(inside('MODULE_CHECK.json')) == result['moduleCheck']
            assert json.loads(inside('SOURCE_RECEIPT.json')) == result['source']
            fixture = json.loads(inside('FIXTURE_OUTPUT.json'))
            assert fixture == {'evidenceClass': 'TECHNICAL-RUNTIME-CAPSULE', 'work': 'MODULE-LOAD-AND-GATE-REFUSAL-ONLY', 'scientificSeedsRead': 0}
            prefix = json.loads(inside('SEALED_PREFIX.json'))
            assert prefix['bootstrapCommit'] == HEAD and prefix['source'] == result['source'] and prefix['moduleCheck'] == result['moduleCheck']
            assert prefix['scientificSeedsRead'] == 0 and prefix['finalScientificInputSet'] is False
            assert prefix['commands'] == result['commands'][:len(prefix['commands'])]
            for name in ['run.cjs', 'codec.cjs', 'transport.cjs']:
                assert inside('BOOTSTRAP/' + name) == (ROOT / 'tools/research/g5-befcs-capsule' / name).read_bytes()
            target = tmp / 'source'
            target.mkdir()
            command(['debugfs', '-R', f'rdump /capsule {target}', str(image)])
            total = 0
            seen = set()
            for item in manifest['files']:
                relative = Path(item['path'])
                assert not relative.is_absolute() and '..' not in relative.parts and str(relative) not in seen
                seen.add(str(relative))
                path = target / 'capsule' / relative
                assert path.is_file() and not path.is_symlink()
                data = path.read_bytes()
                total += len(data)
                assert len(data) == item['bytes'] and sha(data) == item['sha256'] and obj('blob', data) == item['gitBlob'], item['path']
                assert bool(path.stat().st_mode & 0o111) == (item['mode'] == '100755'), item['path']
            assert len(manifest['files']) == result['source']['files'] == 1266
            assert total == result['source']['bytes'] == 11746870 and result['source']['sourceCommit'] == SOURCE
            remote = result['remote']
            record = restorations[mode]
            commit = base64.b64decode(record['commitRawBase64'], validate=True)
            tree = base64.b64decode(record['treeRawBase64'], validate=True)
            assert obj('commit', commit) == remote['commit'] == record['head']
            assert commit.splitlines()[0] == b'tree ' + obj('tree', tree).encode()
            assert not any(line.startswith(b'parent ') for line in commit.split(b'\n\n', 1)[0].splitlines())
            entries = {}
            pos = 0
            while pos < len(tree):
                end = tree.index(b'\0', pos)
                entry = tree[pos:end].decode()
                assert entry not in entries and end + 21 <= len(tree)
                entries[entry] = tree[end+1:end+21].hex()
                pos = end + 21
            assert entries == {'100644 EVIDENCE.img.gz': remote['blob'], '100644 MANIFEST.json': remote['manifestBlob']}
            mb = base64.b64decode(record['manifestRawBase64'], validate=True)
            assert obj('blob', archive) == remote['blob'] == record['archiveBlob']
            assert obj('blob', mb) == remote['manifestBlob'] == record['manifestBlob'] and json.loads(mb) == meta
            assert record['ref'] == remote['ref'] == result['ref'] == f'refs/heads/research/g5-capsule-archive-38850453567-a1-{mode}'
            assert record['afterRunReadOnly'] is True
            assert record['archiveSha256'] == meta['archiveSha256'] and record['imageSha256'] == meta['imageSha256']
            assert record['filesRestored'] == 1266 and record['sourceBytes'] == total
            ack = mode == 'complete'
            assert remote['acknowledged'] is ack and record['runAcknowledged'] is ack
            calls = [('POST', '/git/blobs'), ('POST', '/git/blobs'), ('POST', '/git/trees'), ('POST', '/git/commits'), ('POST', '/git/refs')]
            if ack:
                calls += [('GET', '/git/ref/' + remote['ref'][5:]), ('GET', '/git/commits/' + remote['commit']), ('GET', '/git/blobs/' + remote['blob']), ('GET', '/git/blobs/' + remote['manifestBlob'])]
            assert [(c['method'], c['suffix']) for c in remote['calls']] == calls
            journal = [json.loads(line) for line in z.read('TRANSPORT.jsonl').splitlines()]
            assert len(journal) == len(calls) * 2
            for i, (method, suffix) in enumerate(calls):
                for j, event in enumerate(['BEFORE', 'RESPONSE']):
                    row = journal[i*2+j]
                    assert (row['event'], row['method'], row['suffix']) == (event, method, suffix)
            assert (result['finished'] is not None) == ack
            assert result['sealedImagePreservedRemotely'] is ack
            assert result['failure'] == (None if ack else 'PRESERVATION-NOT-ACKNOWLEDGED\n\nfalse !== true\n')
            for key in ['finalScientificInputSet', 'externalBootstrapCovered', 'postSealTransportJournalInsideImage', 'actionsArtifactUploadCovered', 'wholeLifecycleOsProven', 'scientificExecutionAuthorized']:
                assert result[key] is False, key
            assert result['scientificSeedsRead'] == 0
            assert result['moduleCheck'] == {'modulesLoaded': 4, 'scienceGateClosed': True, 'scientificSeedsRead': 0}
            assert result['memoryPeakBytes'] <= 1024**3 and result['chargedBytes'] <= 256 * 1024**2 and result['elapsedMs'] <= 1200000
            samples = result['records']['samples']
            assert samples and all(a['elapsedMs'] <= b['elapsedMs'] and a['memoryPeakBytes'] <= b['memoryPeakBytes'] and a['scopeId'] == b['scopeId'] for a, b in zip(samples, samples[1:]))
            assert all(s['memoryPeakBytes'] <= 1024**3 and s['chargedBytes'] <= 256*1024**2 for s in samples)
            output[mode] = {'filesVerified': 1266, 'sourceBytes': total, 'imageSha256': meta['imageSha256'], 'archiveSha256': meta['archiveSha256'], 'runAcknowledged': ack, 'afterRunRestored': True}
    return {'decision': 'TECHNICAL-CAPSULE-EVIDENCE-VERIFIED', 'cases': output, 'scientificSeedsRead': 0, 'wholeLifecycleOsProven': False, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(verify(), indent=2))
