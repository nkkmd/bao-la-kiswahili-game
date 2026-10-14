"""固定された中間保存と更新可能な現在案内を読取り専用で監査する。"""
from pathlib import Path
import hashlib
import importlib.util
import json
import subprocess
import sys

BASE = Path(__file__).resolve().parents[3]
SNAPSHOT_COMMIT = "44d7dafefce100e636b86c66136a754e4fbef727"
SNAPSHOT_TREE = "076114f0386129bc4bee6a885765a5ad46d96235"
DOC = "doc/research-generation-5/checkpoint-20261014"
WORKFLOW = ".github/workflows/g5-checkpoint-audit.yml"
OLD_STEP = b"        run: python3 tools/research/g5-checkpoint/verify.py"
CURRENT_STEP = (b"        run: |\n"
                b"          python3 tools/research/g5-checkpoint/test-verify-current.py\n"
                b"          python3 tools/research/g5-checkpoint/verify-current.py")


def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args])


def sha(data):
    return hashlib.sha256(data).hexdigest()


def verify_bindings(repo, snapshot_commit, snapshot_tree):
    """旧bindingを保持し、現在案内以外の固定byteも現在checkoutで検査する。"""
    ancestor = subprocess.run(
        ["git", "-C", str(repo), "merge-base", "--is-ancestor", snapshot_commit, "HEAD"],
        capture_output=True,
    ).returncode
    assert ancestor == 0, "中間保存の統合コミットが現在HEADの祖先ではない"
    assert git(repo, "rev-parse", snapshot_commit + "^{tree}").decode().strip() == snapshot_tree

    binding_path = DOC + "/CHECKPOINT_BINDING.json"
    binding_bytes = (repo / binding_path).read_bytes()
    assert binding_bytes == git(repo, "show", snapshot_commit + ":" + binding_path), binding_path
    binding = json.loads(binding_bytes)
    scope_path = DOC + "/INTEGRATION_SCOPE.json"
    scope_bytes = (repo / scope_path).read_bytes()
    assert sha(scope_bytes) == binding["files"][scope_path], scope_path
    scope = json.loads(scope_bytes)
    assert binding["sourceHead"] == scope["sourceHead"]
    navigation = set(scope["mutableNavigation"])
    assert len(navigation) == 9 and navigation <= set(binding["files"])

    current_fixed = historical = 0
    for name, expected in binding["files"].items():
        if name in navigation or name == WORKFLOW:
            frozen = git(repo, "show", snapshot_commit + ":" + name)
            assert sha(frozen) == expected, name
            if name == WORKFLOW:
                assert frozen.count(OLD_STEP) == 1, name
                assert (repo / name).read_bytes() == frozen.replace(OLD_STEP, CURRENT_STEP), name
            else:
                assert (repo / name).is_file(), name
            historical += 1
        else:
            assert sha((repo / name).read_bytes()) == expected, name
            current_fixed += 1
    assert historical == 10
    return {"snapshotCommit": snapshot_commit, "snapshotTree": snapshot_tree,
            "historicalBoundFiles": historical, "currentFrozenFiles": current_fixed,
            "mutableNavigationFiles": len(navigation), "originalBindingPreserved": True}


def check():
    bindings = verify_bindings(BASE, SNAPSHOT_COMMIT, SNAPSHOT_TREE)
    spec = importlib.util.spec_from_file_location("g5_frozen_checkpoint", Path(__file__).with_name("verify.py"))
    frozen = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(frozen)
    result = {"binding": bindings, "preservation": frozen.preserved(),
              "history": frozen.history(), "evidence": frozen.archives("--hashes-only" in sys.argv),
              "documentation": frozen.language(), "befcsScientificSeedsRead": 0,
              "scientificSourceGenerationPerformed": False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    check()
