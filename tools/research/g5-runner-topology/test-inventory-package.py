"""archiveを展開せず容量下限を計数し、保存値と判定の範囲を確認する。"""
import hashlib
import gzip
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('package', Path(__file__).with_name('inventory-package.py'))
package = importlib.util.module_from_spec(spec)
spec.loader.exec_module(package)
ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/runner-topology-20261017/capacity-20261020'


class PackageTest(unittest.TestCase):
    def make_archive(self, name='file'):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        p = Path(temp.name) / 'fixture.tar.gz'
        with tarfile.open(p, 'w:gz') as a:
            m = tarfile.TarInfo(name)
            m.size = 3
            a.addfile(m, io.BytesIO(b'abc'))
            m = tarfile.TarInfo('alias')
            m.type = tarfile.SYMTYPE
            m.linkname = name
            a.addfile(m)
        return p

    def inspect(self, p):
        return package.inventory(p, p.stat().st_size, hashlib.sha256(p.read_bytes()).hexdigest())

    def test_regular_bytes_and_alias_are_separate_without_extraction(self):
        p = self.make_archive()
        result = self.inspect(p)
        self.assertEqual(result['regularFileLogicalBytes'], 3)
        self.assertEqual(result['symlinks'], 1)
        self.assertEqual(len(list(p.parent.iterdir())), 1)
        self.assertFalse(result['archiveExtracted'])
        self.assertFalse(result['scientificExecutionAuthorized'])

    def test_wrong_size_hash_and_unsafe_path_are_rejected(self):
        p = self.make_archive()
        with self.assertRaisesRegex(ValueError, 'SIZE'):
            package.inventory(p)
        with self.assertRaisesRegex(ValueError, 'HASH'):
            package.inventory(p, p.stat().st_size, '0' * 64)
        with self.assertRaisesRegex(ValueError, 'UNSAFE'):
            self.inspect(self.make_archive('../escape'))

    def test_saved_capacity_claim_is_package_specific(self):
        wsl = json.loads((DOC / 'WSL_REPORTED.json').read_bytes())
        packed = (DOC / 'RUNNER_PACKAGE_INVENTORY.json.gz').read_bytes()
        summary = json.loads((DOC / 'RUNNER_PACKAGE_SUMMARY.json').read_bytes())
        self.assertEqual(hashlib.sha256(packed).hexdigest(), summary['inventoryGzipSha256'])
        self.assertEqual(len(packed), summary['inventoryGzipBytes'])
        report = json.loads(gzip.decompress(packed))
        self.assertEqual({k: v for k, v in summary.items() if not k.startswith('inventoryGzip')},
                         {k: v for k, v in report.items() if k != 'entries'})
        self.assertEqual(sum(f['logicalBytes'] for f in wsl['files']), 141417888)
        self.assertEqual(sum(f['allocatedBytes'] for f in wsl['files']), 141426688)
        self.assertEqual(sum(e['logicalBytes'] for e in report['entries'] if e['kind'] == 'file'), 679562451)
        self.assertEqual(report['regularFileLogicalBytes'], 679562451)
        metadata = json.loads((DOC / 'RUNNER_ASSET_METADATA.json').read_bytes())
        self.assertEqual(metadata['digest'], 'sha256:' + package.EXPECTED_SHA256)
        self.assertEqual(metadata['size'], package.EXPECTED_BYTES)
        self.assertEqual(metadata['id'], 530928164)
        self.assertEqual(report['archiveSha256'], package.EXPECTED_SHA256)
        self.assertEqual(report['archiveBytes'], package.EXPECTED_BYTES)
        self.assertEqual(sum(e['kind'] == 'file' for e in report['entries']), 9304)
        self.assertEqual(sum(e['kind'] == 'directory' for e in report['entries']), 2136)
        self.assertEqual(sum(e['kind'] == 'symlink' for e in report['entries']), 6)
        self.assertEqual(report['regularFiles'], 9304)
        self.assertEqual(report['directories'], 2136)
        self.assertEqual(report['symlinks'], 6)
        self.assertEqual(report['hardlinks'], 0)
        self.assertGreater(report['regularFileLogicalBytes'], 256 * 1024**2)
        self.assertFalse(report['hostArchitectureConfirmed'])
        self.assertFalse(report['wholeLifecycleOsProven'])
        self.assertFalse(report['scientificExecutionAuthorized'])


if __name__ == '__main__':
    unittest.main()
