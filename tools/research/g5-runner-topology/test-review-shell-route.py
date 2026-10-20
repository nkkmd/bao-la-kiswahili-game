"""原資料の改変と、job一度限りから通信一度限りへの昇格を拒否する。"""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('review', Path(__file__).with_name('review-shell-route.py'))
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)


class ShellReviewTest(unittest.TestCase):
    def test_retry_paths_do_not_claim_observed_retry_or_execution_permission(self):
        result = review.verify()
        self.assertEqual(result, json.loads((review.DOC / 'shell-route-20261020/REVIEW.json').read_bytes()))
        self.assertTrue(result['normalAndBrokerListenersHaveRetryPaths'])
        for key in ('runOnceProvesCommunicationRetryDisabled', 'skipSessionRecoverProvesAllRetriesDisabled',
                    'retryObservedInExistingJobClaimed', 'shellOnlyRouteCertified',
                    'wholeLifecycleOsProven', 'scientificExecutionAuthorized'):
            self.assertFalse(result[key])

    def test_source_manifest_and_existing_action_source_changes_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            shutil.copytree(review.DOC / 'shell-route-20261020', target / 'shell-route-20261020')
            action = 'upstream/src/Runner.Worker/ActionManager.cs'
            (target / action).parent.mkdir(parents=True)
            shutil.copyfile(review.DOC / action, target / action)
            for name in ('shell-route-20261020/SOURCE_ORIGIN.json',
                         'shell-route-20261020/upstream/src/Runner.Listener/BrokerMessageListener.cs', action):
                path = target / name
                original = path.read_bytes()
                path.write_bytes(original + b'changed')
                with self.assertRaises(ValueError):
                    review.verify(target)
                path.write_bytes(original)


if __name__ == '__main__':
    unittest.main()
