"""保存索引の再検算と、構文探索を全通信保証へ昇格しない境界を検査する。"""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('inventory', Path(__file__).with_name('inventory-clients.py'))
inventory = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inventory)


class InventoryTest(unittest.TestCase):
    def test_saved_index_is_partial_and_can_be_recomputed(self):
        result = inventory.verify_saved()
        self.assertEqual(result['matchedSourceFilesVerified'], 32)
        self.assertEqual(result['literalMatchesVerified'], 72)
        self.assertFalse(result['fullSourceRescanPerformed'])
        self.assertFalse(result['scientificExecutionAuthorized'])

    def test_source_bundle_mutation_and_scope_promotion_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'saved'
            shutil.copytree(inventory.DOC, target)
            p = target / 'MATCHED_SOURCES.json.gz'
            original = p.read_bytes()
            p.write_bytes(original + b'changed')
            with self.assertRaises(ValueError):
                inventory.verify_saved(target)
            p.write_bytes(original)
            p = target / 'REVIEW.json'
            data = json.loads(p.read_bytes())
            data['allClientsEnumerated'] = True
            p.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, 'UNPROVEN-CLAIM'):
                inventory.verify_saved(target)

    def test_literal_search_includes_comments_and_misses_reflection(self):
        self.assertTrue(inventory.matches('a.cs', 'VssConnection c = new(uri);'))
        self.assertTrue(inventory.matches('a.cs', '// new HttpClient()'))
        self.assertFalse(inventory.matches('a.cs', 'Activator.CreateInstance(type);'))


if __name__ == '__main__':
    unittest.main()
