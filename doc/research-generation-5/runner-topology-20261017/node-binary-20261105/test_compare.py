"""人工tarだけで重複・link・hash不一致の拒否を確認する。"""
import importlib.util
import io
import hashlib
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('node_binary_compare', Path(__file__).with_name('compare.py'))
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)

class ReadOnlyArchiveTests(unittest.TestCase):
    def make(self, directory, entries):
        path = Path(directory) / 'input.tar.gz'
        with tarfile.open(path, 'w:gz') as archive:
            for name, kind, payload in entries:
                info = tarfile.TarInfo(name)
                info.type = kind
                info.size = len(payload) if kind == tarfile.REGTYPE else 0
                if kind == tarfile.SYMTYPE:
                    info.linkname = '/etc/passwd'
                archive.addfile(info, io.BytesIO(payload) if kind == tarfile.REGTYPE else None)
        return path

    def test_regular_member_read_without_materializing_it(self):
        with tempfile.TemporaryDirectory() as directory:
            header = b'\x7fELF\x02\x01' + b'\0' * 12 + b'\x3e\0'
            path = self.make(directory, [('node', tarfile.REGTYPE, header + b'fixture')])
            actual = M.member_identity(path, 'node')
            self.assertEqual(actual['bytes'], len(header) + 7)
            self.assertEqual(list(Path(directory).iterdir()), [path])

    def test_link_member_rejected_without_following_it(self):
        with tempfile.TemporaryDirectory() as directory:
            path = self.make(directory, [('node', tarfile.SYMTYPE, b'')])
            with self.assertRaisesRegex(ValueError, 'NONREGULAR'):
                M.member_identity(path, 'node')
            self.assertEqual(list(Path(directory).iterdir()), [path])

    def test_duplicate_member_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            header = b'\x7fELF\x02\x01' + b'\0' * 12 + b'\x3e\0'
            path = self.make(directory, [('node', tarfile.REGTYPE, header)] * 2)
            with self.assertRaisesRegex(ValueError, 'DUPLICATE'):
                M.member_identity(path, 'node')

    def test_wrong_hash_size_and_missing_member_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = self.make(directory, [])
            with self.assertRaisesRegex(ValueError, 'HASH-MISMATCH'):
                M.archive_identity(path, '0' * 64, 1048576)
            with self.assertRaisesRegex(ValueError, 'SIZE-MISMATCH'):
                M.archive_identity(path, '0' * 64, 0)
            with self.assertRaisesRegex(ValueError, 'MISSING'):
                M.member_identity(path, 'node')

class SavedRecordTests(unittest.TestCase):
    def test_preserved_identity_and_unproven_boundaries(self):
        root = Path(__file__).parent
        result = json.loads((root / 'RESULT.json').read_text())
        receipt = json.loads((root / 'ACQUISITION.json').read_text())
        self.assertEqual(hashlib.sha256((root / 'ACQUISITION_PLAN.md').read_bytes()).hexdigest(),
                         receipt['acquisitionPlanSha256'])
        self.assertEqual(hashlib.sha256((root / 'SHASUMS256.txt').read_bytes()).hexdigest(),
                         M.CHECKSUM_SHA)
        for key, expected in [('runnerArchive', M.RUNNER_SHA), ('nodeArchive', M.NODE_SHA),
                              ('checksumList', M.CHECKSUM_SHA)]:
            self.assertEqual(result[key]['sha256'], expected)
        self.assertEqual(result['runnerNode']['sha256'], result['officialNode']['sha256'])
        self.assertEqual(result['runnerNode']['bytes'], 98932688)
        for key in ['binaryExecuted', 'archiveExtracted', 'releaseSignatureVerified',
                    'node20WorkCompatibilityProven', 'wholeLifecycleOsProven',
                    'scientificExecutionAuthorized']:
            self.assertIs(result[key], False)
        self.assertEqual(result['scientificSeedsRead'], 0)
        self.assertTrue(all(r['invocations'] == 1 and r['curlExitCode'] == 0
                            for r in receipt['requests']))

if __name__ == '__main__':
    unittest.main()
