"""原資料の改変拒否と、仮の残額を実行認可へ昇格しないことを検査する。"""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('review', Path(__file__).with_name('review-lightweight.py'))
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)


class ReviewTest(unittest.TestCase):
    def test_saved_decision_matches_and_remains_unproven(self):
        result = review.verify()
        saved = json.loads((review.DOC / 'lightweight-20261020/REVIEW.json').read_bytes())
        self.assertEqual(result, saved)
        self.assertTrue(result['dualRuntimeSubsetExceeds256MiB'])
        self.assertGreater(result['singleRuntimeArithmeticRemainderBytes'], 0)
        for key in ('remainderIsAvailableBudget', 'runnerSubsetProvenExecutable',
                    'retryFreeTransportProven', 'wholeLifecycleOsProven', 'scientificExecutionAuthorized'):
            self.assertFalse(result[key])

    def test_source_origin_and_package_list_changes_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            for name in ('lightweight-20261020', 'capacity-20261020'):
                shutil.copytree(review.DOC / name, target / name)
            for name in ('lightweight-20261020/SOURCE_ORIGIN.json',
                         'lightweight-20261020/upstream/src/Runner.Common/Util/NodeUtil.cs',
                         'capacity-20261020/RUNNER_PACKAGE_INVENTORY.json.gz'):
                path = target / name
                original = path.read_bytes()
                path.write_bytes(original + b'changed')
                with self.assertRaises(ValueError):
                    review.verify(target)
                path.write_bytes(original)


if __name__ == '__main__':
    unittest.main()
