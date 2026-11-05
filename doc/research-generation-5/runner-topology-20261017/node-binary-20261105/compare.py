"""固定archiveのNode実体を読取照合する。取得・展開・実行は行わない。"""
import hashlib
import json
from pathlib import Path
import re
import sys
import tarfile

RUNNER_SHA = '70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613'
CHECKSUM_SHA = 'c6f74825d6ddf350ef06600c67fec6ea2f7996cf438a78c3cb2a89b29d4320ed'
NODE_SHA = '19e56f0825510207dd904f087fe52faa0a4eb6b2aab5f0ea7a33830d04888b8b'

def archive_identity(path, expected, maximum, exact=None):
    size = path.stat().st_size
    if size > maximum or (exact is not None and size != exact):
        raise ValueError('ARCHIVE-SIZE-MISMATCH')
    with path.open('rb') as stream:
        digest = hashlib.file_digest(stream, 'sha256').hexdigest()
    if digest != expected:
        raise ValueError('ARCHIVE-HASH-MISMATCH')
    return {'bytes': size, 'sha256': digest}

def member_identity(path, name):
    found = None
    with tarfile.open(path, 'r|gz') as archive:
        for entry in archive:
            if entry.name != name:
                continue
            if found is not None or not entry.isfile() or entry.issparse():
                raise ValueError('DUPLICATE-OR-NONREGULAR-MEMBER')
            if entry.size > 134217728:
                raise ValueError('MEMBER-SIZE-LIMIT')
            digest, size, header = hashlib.sha256(), 0, b''
            with archive.extractfile(entry) as stream:
                while chunk := stream.read(1048576):
                    if not header:
                        header = chunk[:20]
                    size += len(chunk)
                    if size > entry.size:
                        raise ValueError('MEMBER-SIZE-MISMATCH')
                    digest.update(chunk)
            if size != entry.size or len(header) < 20:
                raise ValueError('TRUNCATED-MEMBER')
            if header[:6] != b'\x7fELF\x02\x01' or int.from_bytes(header[18:20], 'little') != 62:
                raise ValueError('NOT-ELF64-LITTLE-ENDIAN-X86-64')
            found = {'path': name, 'bytes': size, 'sha256': digest.hexdigest(),
                     'format': 'ELF64-LITTLE-ENDIAN-X86-64'}
    if found is None:
        raise ValueError('MEMBER-MISSING')
    return found

def compare(runner, node, checksums):
    raw = checksums.read_bytes()
    if len(raw) > 1048576 or hashlib.sha256(raw).hexdigest() != CHECKSUM_SHA:
        raise ValueError('CHECKSUM-LIST-MISMATCH')
    matches = re.findall(rb'^([0-9a-f]{64})  node-v20\.20\.2-linux-x64\.tar\.gz$', raw, re.M)
    if matches != [NODE_SHA.encode()]:
        raise ValueError('CHECKSUM-ENTRY-MISMATCH')
    runner_archive = archive_identity(runner, RUNNER_SHA, 226430031, 226430031)
    node_archive = archive_identity(node, NODE_SHA, 67108864)
    left = member_identity(runner, './externals/node20/bin/node')
    right = member_identity(node, 'node-v20.20.2-linux-x64/bin/node')
    if (left['bytes'], left['sha256']) != (right['bytes'], right['sha256']):
        raise ValueError('NODE-BINARY-MISMATCH')
    return {'evidenceClass': 'STATIC-RELEASE-MEMBER-BYTE-IDENTITY',
            'runnerArchive': runner_archive, 'nodeArchive': node_archive,
            'checksumList': {'bytes': len(raw), 'sha256': CHECKSUM_SHA},
            'runnerNode': left, 'officialNode': right, 'nodeRelease': 'v20.20.2',
            'distributedNodeBinaryIdentified': True, 'releaseSignatureVerified': False,
            'archiveExtracted': False, 'binaryExecuted': False,
            'node20WorkCompatibilityProven': False, 'wholeLifecycleOsProven': False,
            'scientificSeedsRead': 0, 'scientificExecutionAuthorized': False}

if __name__ == '__main__':
    if len(sys.argv) != 4:
        raise SystemExit('usage: compare.py RUNNER_TAR_GZ NODE_TAR_GZ SHASUMS256_TXT')
    print(json.dumps(compare(*(Path(s) for s in sys.argv[1:])), indent=2))
