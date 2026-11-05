"""人工入力で読取範囲・失敗保持を確認し、host観察は実行しない。"""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('parent_observer', Path(__file__).with_name('observe-parent-host.py'))
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)


class ObserverTests(unittest.TestCase):
    def setUp(self):
        fake = patch.object(M.os, 'uname', return_value=SimpleNamespace(machine='fixture', release='fixture'))
        fake.start()
        self.addCleanup(fake.stop)

    def test_only_selected_read_commands_and_no_readiness_promotion(self):
        commands, snapshots = [], []
        def run(args):
            commands.append(args)
            value = 'systemd 255\nfeatures' if '--version' in args else 'running'
            if 'show' in args:
                value = 'ControlGroup=/user.slice/user-1000.slice/user@1000.service\nActiveState=active\nDelegate=yes'
            return {'status': 'OBSERVED', 'exitCode': 0, 'stdout': value}
        def snapshot(path):
            snapshots.append(str(path))
            return {'fixture': True}
        result = M.observe(run=run, snapshot=snapshot, uid=1000)
        self.assertEqual(commands, [
            ['systemctl', '--version'],
            ['systemctl', '--system', '--no-pager', 'is-system-running'],
            ['systemctl', '--system', '--no-pager', 'show', 'user@1000.service',
             '--property=ControlGroup', '--property=ActiveState', '--property=Delegate']])
        self.assertEqual(len(snapshots), 2)
        self.assertFalse(result['wholeLifecycleOsProven'])
        self.assertFalse(result['privilegedOperationsTested'])
        self.assertFalse(result['scientificExecutionAuthorized'])
        self.assertEqual(result['scientificSeedsRead'], 0)
        self.assertEqual(result['systemdVersion']['stdout'], 'systemd 255')

    def test_invalid_paths_and_duplicates_refused(self):
        for path in ('/', '../x', '/a/../b', '/a//b', '/a/./b'):
            with self.assertRaises(ValueError):
                M.selected_group(Path('/sys/fs/cgroup'), path)
        def duplicate(_):
            return {'status': 'OBSERVED', 'exitCode': 0,
                    'stdout': 'ControlGroup=/a\nControlGroup=/b'}
        with self.assertRaisesRegex(ValueError, 'DUPLICATE'):
            M.observe(run=duplicate, snapshot=lambda _: {}, uid=1000)

    def test_command_failure_is_not_filled_with_previous_observation(self):
        result = M.observe(run=lambda _: {'status': 'UNOBSERVED', 'reason': 'fixture'},
                           snapshot=lambda _: {}, uid=1000)
        self.assertEqual(result['selectedUserCgroup'], {'status': 'UNOBSERVED'})

    def test_small_reader_refuses_symlink_and_oversize(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            p = root / 'value'; p.write_text('max\n')
            self.assertEqual(M.read_small(p), 'max')
            link = root / 'link'; link.symlink_to(p)
            with self.assertRaises(OSError):
                M.read_small(link)
            p.write_bytes(b'x' * (M.LIMIT + 1))
            with self.assertRaisesRegex(ValueError, 'TOO-LARGE'):
                M.read_small(p)

    def test_kill_file_is_never_passed_to_reader(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'cgroup.kill').write_text('fixture')
            read = []
            result = M.group_snapshot(root, reader=lambda p: read.append(p.name) or 'fixture')
            self.assertNotIn('cgroup.kill', read)
            self.assertEqual(len(read), 6)
            self.assertEqual(result['killFile']['status'], 'METADATA-ONLY')


if __name__ == '__main__':
    unittest.main()
