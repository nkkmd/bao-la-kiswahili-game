"""保存証拠の改変拒否を確認する。"""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('capsule', Path(__file__).with_name('verify-capsule.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class Refusal(unittest.TestCase):
    def setUp(self):
        self.original = module.DOC
        self.temporary = tempfile.TemporaryDirectory()
        module.DOC = Path(self.temporary.name) / 'evidence'
        shutil.copytree(self.original, module.DOC)

    def tearDown(self):
        module.DOC = self.original
        self.temporary.cleanup()

    def rewrite(self, name, change):
        path = module.DOC / name
        data = json.loads(path.read_text())
        change(data)
        path.write_text(json.dumps(data))

    def test_changed_zip_is_refused(self):
        path = module.DOC / 'results/complete/CI_ARTIFACT.zip.part-000'
        data = bytearray(path.read_bytes())
        data[100] ^= 1
        path.write_bytes(data)
        with self.assertRaises(AssertionError):
            module.verify()

    def test_changed_remote_object_is_refused(self):
        self.rewrite('REMOTE_RESTORATION.json', lambda data: data['complete'].update(commitRawBase64='Y2hhbmdlZA=='))
        with self.assertRaises(AssertionError):
            module.verify()

    def test_ack_loss_cannot_be_promoted(self):
        self.rewrite('REMOTE_RESTORATION.json', lambda data: data['ack-loss'].update(runAcknowledged=True))
        with self.assertRaises(AssertionError):
            module.verify()


if __name__ == '__main__':
    unittest.main()
