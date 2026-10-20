"""固定された中間保存と更新可能な現在案内を読取り専用で監査する。"""
from pathlib import Path
import hashlib
import gzip
import os
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


AGENTS_POLICY_COMMIT = "d01685a0156e1b56238d24d680d089248720d74b"
AGENTS_POLICY_BLOB = "05b34d723d2448ac4e4a7510b39f3bf821ec5b4a"


def verify_agents(repo):
    """PR #211の正当な方針更新だけを固定コミット・blobで照合する。"""
    assert subprocess.run(["git", "-C", str(repo), "merge-base", "--is-ancestor",
                           AGENTS_POLICY_COMMIT, "HEAD"], capture_output=True).returncode == 0
    historical = git(repo, "show", AGENTS_POLICY_COMMIT + ":AGENTS.md")
    assert hashlib.sha1(b"blob " + str(len(historical)).encode() + b"\0" + historical).hexdigest() == AGENTS_POLICY_BLOB
    assert (repo / "AGENTS.md").read_bytes() == historical, "AGENTS.md"


def preserved_current(frozen):
    scope = frozen.read("INTEGRATION_SCOPE.json")
    old = frozen.tree(scope["sourceHead"])
    allowed = set(scope["mutableNavigation"]) | set(scope["historicalWorkflows"])
    snapshots = json.loads(gzip.decompress((frozen.DOC / "HISTORICAL_NAVIGATION.json.gz").read_bytes()))
    assert set(snapshots) == allowed
    for name, text in snapshots.items():
        assert text.encode() == frozen.git("show", scope["sourceHead"] + ":" + name), name
    count = 0
    for name, (mode, expected) in old.items():
        if name in allowed:
            continue
        p = BASE / name
        data = os.readlink(p).encode() if mode == "120000" else p.read_bytes()
        if name == "AGENTS.md":
            verify_agents(BASE)
            count += 1
            continue
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        assert actual == expected, name
        count += 1
    public = [n for n in frozen.tree(scope["baseMain"]) if n.startswith(("public/", "cloudflare/"))]
    original_main = frozen.tree(scope["baseMain"])
    assert all(old[n] == original_main[n] for n in public)
    for name, pin in scope["historicalWorkflows"].items():
        text = (BASE / name).read_text()
        assert "ref: " + pin["historicalInputCommit"] in text, name
        assert pin["historicalInputCommit"] in frozen.git("rev-list", scope["sourceHead"]).decode().split()
    assert scope["befcsScientificSeedsRead"] == 0
    for k in ["befcsScientificLeaseCreated", "befcsStudyRegistered", "formalRelationRegistered", "scientificExecutionPerformed"]:
        assert scope[k] is False
    return {"agentsPolicyCommit": AGENTS_POLICY_COMMIT, "preservedSourceFiles": count, "historicalSnapshots": len(snapshots),
            "publicAndWorkerFiles": len(public), "historicalWorkflows": len(scope["historicalWorkflows"])}


def check():
    bindings = verify_bindings(BASE, SNAPSHOT_COMMIT, SNAPSHOT_TREE)
    spec = importlib.util.spec_from_file_location("g5_frozen_checkpoint", Path(__file__).with_name("verify.py"))
    frozen = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(frozen)
    result = {"binding": bindings, "preservation": preserved_current(frozen),
              "history": frozen.history(), "evidence": frozen.archives("--hashes-only" in sys.argv),
              "documentation": frozen.language(), "befcsScientificSeedsRead": 0,
              "scientificSourceGenerationPerformed": False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    check()
