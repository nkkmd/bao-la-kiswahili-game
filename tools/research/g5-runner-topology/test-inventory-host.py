"""不明な容量を完成値へ変換せず、特殊fileを実行・待受せず拒否する。"""
import hashlib
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('inventory', Path(__file__).with_name('inventory-host.py'))
inventory = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inventory)


class InventoryTest(unittest.TestCase):
    def test_link_hashes_target_without_executing_it(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'program'
            target.write_bytes(b'not executable\n')
            link = Path(directory) / 'link'
            link.symlink_to(target)
            result = inventory.fingerprint(link)
            self.assertEqual(result['sha256'], hashlib.sha256(target.read_bytes()).hexdigest())
            self.assertEqual(result['logicalBytes'], 15)
            self.assertEqual(result['resolvedPath'], str(target))

    def test_fifo_and_oversize_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            fifo = Path(directory) / 'fifo'
            os.mkfifo(fifo)
            with self.assertRaises(ValueError):
                inventory.fingerprint(fifo)
            target = Path(directory) / 'large'
            target.write_bytes(b'1234')
            with patch.object(inventory, 'MAX_FILE_BYTES', 3), self.assertRaises(ValueError):
                inventory.fingerprint(target)

    def test_missing_dependency_cannot_authorize_or_complete_budget(self):
        result = inventory.inspect(lambda role: None)
        self.assertEqual(result['logicalBytesSumByRole'], 0)
        self.assertTrue(all(r['status'] == 'NOT-FOUND' for r in result['files']))
        for key in ('sumIsCompleteBudget', 'dependenciesInspected', 'runnerInspected',
                    'wholeLifecycleOsProven', 'scientificExecutionAuthorized'):
            self.assertFalse(result[key])

    def test_observation_failure_is_unknown_not_zero_size(self):
        with patch.object(inventory, 'fingerprint', side_effect=ValueError('changed')):
            result = inventory.inspect(lambda role: '/selected')
        self.assertTrue(all(r['status'] == 'UNMEASURED' and 'logicalBytes' not in r
                            for r in result['files']))


if __name__ == '__main__':
    unittest.main()
