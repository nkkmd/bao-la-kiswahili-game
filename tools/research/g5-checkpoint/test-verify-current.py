"""現在案内の更新許容と固定証拠の改変拒否を小さな実Git履歴で確認する。"""
from pathlib import Path
import hashlib
import importlib.util
import json
import subprocess
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("g5_current_checkpoint", Path(__file__).with_name("verify-current.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class BindingTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="g5-current-audit-test-")
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.git("init", "-q", "-b", "main")
        self.navigation = ["README.md", "doc/RESEARCH_INDEX.md", "doc/FUTURE_RESEARCH_AGENDA.md"]
        self.navigation += ["doc/research-generation-5/" + name + ".md" for name in
                            ["README", "CURRENT_STATUS", "RESUME_HERE", "PROGRAM_PLAN", "RESEARCH_LOG", "REPRODUCIBILITY_INDEX"]]
        self.evidence = audit.DOC + "/results/example.json"
        for name in self.navigation:
            self.write(name, "# 元の日本語案内\n".encode())
        self.write(self.evidence, b'{"unknown":null,"seedsRead":0}\n')
        self.write(audit.WORKFLOW, b"name: Frozen audit\n" + audit.OLD_STEP + b"\n" + audit.OLD_G5_TEST + b"\n")
        self.scope = audit.DOC + "/INTEGRATION_SCOPE.json"
        self.binding = audit.DOC + "/CHECKPOINT_BINDING.json"
        self.write(self.scope, json.dumps({"sourceHead": "fixed-source", "mutableNavigation": self.navigation}).encode())
        files = self.navigation + [self.evidence, audit.WORKFLOW, self.scope]
        hashes = {name: hashlib.sha256((self.repo / name).read_bytes()).hexdigest() for name in files}
        self.write(self.binding, json.dumps({"sourceHead": "fixed-source", "files": hashes}).encode())
        self.commit("fixed snapshot")
        self.snapshot = self.git("rev-parse", "HEAD").decode().strip()
        self.tree = self.git("rev-parse", "HEAD^{tree}").decode().strip()
        self.write("README.md", "# mainへ統合済みの現在案内\n".encode())
        self.write(audit.WORKFLOW, b"name: Frozen audit\n" + audit.CURRENT_STEP + b"\n" + audit.CURRENT_G5_TEST + b"\n")
        self.commit("current navigation")

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.repo), "-c", "user.name=Fixture",
                                        "-c", "user.email=fixture@example.invalid", *args], stderr=subprocess.DEVNULL)

    def write(self, name, data):
        path = self.repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    def commit(self, message):
        self.git("add", ".")
        self.git("commit", "-q", "-m", message)

    def verify(self, tree=None):
        return audit.verify_bindings(self.repo, self.snapshot, self.tree if tree is None else tree)

    def test_current_navigation_changes_preserve_original_binding(self):
        result = self.verify()
        self.assertTrue(result["originalBindingPreserved"])
        self.assertEqual(result["historicalBoundFiles"], 10)
        self.assertEqual(result["currentFrozenFiles"], 2)

    def test_evidence_change_or_loss_is_rejected(self):
        original = (self.repo / self.evidence).read_bytes()
        self.write(self.evidence, b'{"unknown":0,"seedsRead":0}\n')
        with self.assertRaises(AssertionError):
            self.verify()
        self.write(self.evidence, original)
        (self.repo / self.evidence).unlink()
        with self.assertRaises(FileNotFoundError):
            self.verify()

    def test_binding_replacement_is_rejected(self):
        data = json.loads((self.repo / self.binding).read_bytes())
        data["files"].pop(self.evidence)
        self.write(self.binding, json.dumps(data).encode())
        with self.assertRaises(AssertionError):
            self.verify()

    def test_mutable_scope_expansion_is_rejected(self):
        data = json.loads((self.repo / self.scope).read_bytes())
        data["mutableNavigation"].append(self.evidence)
        self.write(self.scope, json.dumps(data).encode())
        with self.assertRaises(AssertionError):
            self.verify()

    def test_historical_ci_checkout_change_is_rejected(self):
        current = (self.repo / audit.WORKFLOW).read_bytes()
        self.write(audit.WORKFLOW, current.replace(b"43e145da1eb66cab38b56e96b52c0f3a4282b302", b"0" * 40))
        with self.assertRaises(AssertionError):
            self.verify()

    def test_unrelated_workflow_change_is_rejected(self):
        with (self.repo / audit.WORKFLOW).open("ab") as stream:
            stream.write(b"permissions: write-all\n")
        with self.assertRaises(AssertionError):
            self.verify()

    def test_snapshot_tree_or_ancestry_mismatch_is_rejected(self):
        with self.assertRaises(AssertionError):
            self.verify("0" * 40)
        self.git("checkout", "--orphan", "unrelated")
        self.commit("unrelated history")
        with self.assertRaises(AssertionError):
            self.verify()


class AgentsPolicyTest(unittest.TestCase):
    def test_current_policy_matches_pinned_commit(self):
        audit.verify_agents(audit.BASE)

    def test_policy_modification_and_loss_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            (repo / "AGENTS.md").write_bytes(b"changed")
            from unittest.mock import patch
            with patch.object(audit.subprocess, "run") as run, patch.object(audit, "git") as git:
                run.return_value.returncode = 0
                git.return_value = (audit.BASE / "AGENTS.md").read_bytes()
                with self.assertRaises(AssertionError):
                    audit.verify_agents(repo)
                (repo / "AGENTS.md").unlink()
                with self.assertRaises(FileNotFoundError):
                    audit.verify_agents(repo)


class RulesUpdateTest(unittest.TestCase):
    def test_historical_ci_workflows_are_pinned(self):
        self.assertEqual(audit.verify_rules_update(audit.BASE,
            "a5014f79b300d3e5731aa272e4c6cb0d16baa350",
            audit.CI_ADAPTATION_BLOBS, audit.CI_ADAPTATION_COMMIT), 9)

    def test_directive_normalization_preserves_originals(self):
        self.assertEqual(audit.verify_rules_update(audit.BASE,
            "a5014f79b300d3e5731aa272e4c6cb0d16baa350",
            audit.DIRECTIVE_NORMALIZATION_BLOBS, audit.DIRECTIVE_NORMALIZATION_COMMIT), 19)

    def test_pinned_document_editorial_update(self):
        self.assertEqual(audit.verify_rules_update(audit.BASE,
            "a5014f79b300d3e5731aa272e4c6cb0d16baa350",
            audit.DOCUMENT_EDITORIAL_BLOBS, audit.DOCUMENT_EDITORIAL_COMMIT), 2)

    def test_real_approved_update(self):
        self.assertEqual(audit.verify_rules_update(audit.BASE,
            "a5014f79b300d3e5731aa272e4c6cb0d16baa350"), 15)

    def test_changes_loss_symlink_and_unapproved_history_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            def git(*args):
                return subprocess.check_output(["git", "-C", str(repo), "-c", "user.name=Fixture",
                    "-c", "user.email=fixture@example.invalid", *args], stderr=subprocess.DEVNULL)
            git("init", "-q", "-b", "main")
            p = repo / "rules.txt"
            p.write_bytes(b"old")
            git("add", "."); git("commit", "-qm", "old")
            old = git("rev-parse", "HEAD").decode().strip()
            before = git("rev-parse", "HEAD:rules.txt").decode().strip()
            p.write_bytes(b"approved")
            git("add", "."); git("commit", "-qm", "approved")
            approved = git("rev-parse", "HEAD").decode().strip()
            after = git("rev-parse", "HEAD:rules.txt").decode().strip()
            pins = {"rules.txt": (before, after)}
            def verify(mapping=pins, source=old):
                return audit.verify_rules_update(repo, source, mapping, approved)
            self.assertEqual(verify(), 1)
            p.chmod(0o755)
            with self.assertRaises(AssertionError): verify()
            p.chmod(0o644)
            p.write_bytes(b"later change")
            with self.assertRaises(AssertionError): verify()
            p.unlink()
            with self.assertRaises(AssertionError): verify()
            other = repo / "other"
            other.write_bytes(b"approved")
            p.symlink_to(other)
            with self.assertRaises(AssertionError): verify()
            p.unlink(); p.write_bytes(b"approved")
            with self.assertRaises(AssertionError): verify({})
            with self.assertRaises(AssertionError): verify({"rules.txt": (after, after)})
            with self.assertRaises(AssertionError): verify({"rules.txt": (before, before)})
            with self.assertRaises(AssertionError): verify(source=approved)
            git("checkout", "--orphan", "unrelated")
            git("add", "."); git("commit", "-qm", "unrelated")
            with self.assertRaises(AssertionError): verify()


if __name__ == "__main__":
    unittest.main()
