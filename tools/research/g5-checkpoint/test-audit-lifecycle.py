"""部分証拠の昇格とACK読替えを監査器が拒否することを検査する。"""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('audit', Path(__file__).with_name('audit-lifecycle.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class Boundaries(unittest.TestCase):
    def setUp(self):
        self.result = json.loads((audit.DOC / 'results/ack-loss/RESULT.json').read_bytes())

    def test_partial_measurements_remain_unknown_for_whole_lifecycle(self):
        row = audit.coverage(self.result)
        self.assertIsNone(row['wholeLifecycleElapsedMs'])
        self.assertIsNone(row['wholeLifecycleMemoryPeakBytes'])
        self.assertIsNone(row['wholeLifecycleStoragePeakBytes'])
        self.assertTrue(row['postSealJournalInMeasuredService'])
        self.assertFalse(row['postSealJournalInSealedImage'])

    def test_unreviewed_promotion_and_missing_fields_are_rejected(self):
        for key in ('externalBootstrapCovered', 'actionsArtifactUploadCovered',
                    'wholeLifecycleOsProven', 'scientificExecutionAuthorized'):
            for value in (True, None, 0):
                row = copy.deepcopy(self.result)
                row[key] = value
                with self.assertRaises(ValueError):
                    audit.coverage(row)
            row = copy.deepcopy(self.result)
            del row[key]
            with self.assertRaises(ValueError):
                audit.coverage(row)

    def test_restoration_cannot_supply_missing_in_run_ack(self):
        row = copy.deepcopy(self.result)
        row['remote']['acknowledged'] = True
        with self.assertRaisesRegex(ValueError, 'ACK-BOUNDARY'):
            audit.coverage(row)
        row = copy.deepcopy(self.result)
        row['finished'] = {'afterRunRestored': True}
        with self.assertRaisesRegex(ValueError, 'FINISH-BOUNDARY'):
            audit.coverage(row)


if __name__ == '__main__':
    unittest.main()
