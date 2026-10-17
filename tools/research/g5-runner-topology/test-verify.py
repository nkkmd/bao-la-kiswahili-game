"""実証拠の改変と、hookより前の取得順序の誤読を拒否する。"""
import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('topology', Path(__file__).with_name('verify.py'))
topology = importlib.util.module_from_spec(spec)
spec.loader.exec_module(topology)


class Evidence(unittest.TestCase):
    def test_preserved_source_and_job_agree_without_full_scope_claim(self):
        result = topology.verify()
        self.assertFalse(result['jobHookCoversInitialActionDownloads'])
        self.assertFalse(result['runnerBinaryIdentityProvenByVersionString'])
        self.assertFalse(result['wholeLifecycleOsProven'])
        self.assertFalse(result['scientificExecutionAuthorized'])

    def test_source_and_manifest_tampering_are_rejected(self):
        for name in ('upstream/src/Runner.Worker/JobExtension.cs', 'INPUT_MANIFEST.json',
                     'evidence/CHECKPOINT_JOB.log'):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                target = Path(directory) / 'evidence'
                shutil.copytree(topology.DOC, target)
                file = target / name
                file.write_bytes(file.read_bytes() + b'changed')
                with self.assertRaisesRegex(ValueError, 'HASH-MISMATCH'):
                    topology.verify(target)

    def test_observed_order_and_version_cannot_be_reinterpreted(self):
        log = (topology.DOC / 'evidence/CHECKPOINT_JOB.log').read_text(encoding='utf-8-sig')
        lines = log.splitlines()
        line = next(i for i, s in enumerate(lines) if '##[group]Run actions/checkout@v4' in s)
        first = lines.pop(line)
        lines.insert(0, first)
        with self.assertRaisesRegex(ValueError, 'ORDER-MISMATCH'):
            topology.observed_order('\n'.join(lines))
        with self.assertRaisesRegex(ValueError, 'SOURCE-ANCHOR'):
            topology.observed_order(log.replace("Current runner version: '2.337.0'", "Current runner version: 'unknown'"))


if __name__ == '__main__':
    unittest.main()
