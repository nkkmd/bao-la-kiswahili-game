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


# PR #235の公開ルール案内更新。旧証拠を新しいbyteへ置き換えず、両時点を固定する。
RULES_UPDATE_COMMIT = "1205afe0a2c79c957f5d21bee6b7de47a6665ae4"
RULES_UPDATE_BLOBS = {
    '.github/workflows/illustrated-rules.yml': (
        '1bfea1b110f282e16bfb6103032338fc985cc101', 'c5a3d5530ea247f7d52c82c9062d8f3f16056015'),
    'public/rules.css': (
        'c550264c11165e3f042cd6fe16f346a2dbf17fd6', 'ad20f425bc2849479822e6f8daee8465618acc49'),
    'public/rules.html': (
        '48c7d6f31ef012fb209543eb27b478910fe6f23e', '6f72d513476e10d7014c488986f5ea5c989b7054'),
    'public/rules.js': (
        '921e5a805727d4a3ae9eee9c5d2d649a7667456d', 'f35fd76457abc1bf5aff77b15d7cca2b6e79708d'),
    'public/service-worker.js': (
        '17a4cb04ddff4d25bf7c50aebe46e1d89882361b', 'c52754ad25a899a6ad5f232408071c5e69ab2276'),
    'public/sitemap.xml': (
        '5bb8fca7a1e3c59b7684e1e1aee3890fc84b5317', '36007fb07a26874b108e1d4e0a290a388bec7a38'),
    'test/ai-generation-release.test.js': (
        '4ea01ee8e252802509b1f5ba156b3076fcf492f7', '2fc0e67cabf8a73237abaec7278e8b1127dedcf6'),
    'test/game-record-ui.test.js': (
        '108b0cbc0d6ef8c76cef7ce3566bc84952815fbf', 'b4e714211ca61ff663b0e37bf0c38b6da3643823'),
    'test/locale.test.js': (
        '6cfd0def799be063e7c8623ba20d8c853e0c8b6d', '25678b2b448d4ace9b23528f5cdb12714bb5cdc4'),
    'test/takasia-ci-boundary.test.cjs': (
        '60627f8951bb37d3bac57806a1bd8b9ce2277f42', '9511f8b2570088a421b8b8db3848945ba04f21a0'),
    'test/takasia-ui.test.cjs': (
        'db579cfd569d22cc2ec0200ae68ca4da8dcb7c74', '0e6bbee4ad16256506f9ba52e01a435aa3078936'),
    'tools/engineering/test-pbai-c015-expert-production-browser.cjs': (
        'a150c30606a2cf874fac2f96d7c3ab0468f12070', 'e6b50cca9b0ef933fd9166a09dcc49d639982442'),
    'tools/takasia/check-current-assets.cjs': (
        '7ef0933478117fb09c71f5116be996b046edbc6a', '26d4cc79916afc2392a17db9d4d74c2e07d48a7a'),
    'tools/takasia/test-ui-browser.cjs': (
        '6e3ba7c9f369efc0164a25b30ed626a9944d9da8', '823c8f1b4409941aa197d6b3fe9730a3d00f631e'),
    'tools/test-rules-browser.cjs': (
        '970231915ed8b4f47b0eb2699c0710c0e3b2a683', '1fa6861ee508233340a637a42f42bd65d3514b07'),
}


def verify_rules_update(repo, source_head, pins=None, approval=None):
    """固定更新の対象だけを履歴・現在byte・modeで限定照合する。"""
    pins = RULES_UPDATE_BLOBS if pins is None else pins
    approval = RULES_UPDATE_COMMIT if approval is None else approval
    assert subprocess.run(["git", "-C", str(repo), "merge-base", "--is-ancestor",
                           approval, "HEAD"], capture_output=True).returncode == 0
    changed = set(git(repo, "diff", "--name-only", "--diff-filter=M",
                      approval + "^1", approval).decode().splitlines())
    assert changed == set(pins), "承認済み更新の対象集合が一致しない"
    for name, (before, after) in pins.items():
        for ref, expected in [(source_head, before), (approval + "^1", before), (approval, after)]:
            entry = git(repo, "ls-tree", ref, "--", name).decode().strip().split()
            assert entry[:3] == ["100644", "blob", expected], name
        path = repo / name
        assert not path.is_symlink() and path.is_file(), name
        assert path.stat().st_mode & 0o111 == 0, name
        data = path.read_bytes()
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        assert actual == after, name
    return len(pins)


# 認可・結果を変えない文書表現の2件を、元sourceと固定更新commitで限定照合する。
DOCUMENT_EDITORIAL_COMMIT = '78a3101e3308941dbd58baca53b0e1868b6c17ec'
DOCUMENT_EDITORIAL_BLOBS = {'doc/ai-engineering/pbai-c015-adoption-review/ADOPTION.md': ('f477e2962dc69c8ddb7c29b9660d7765ea6e1ba5', 'd61f2762d709f6134f70e7fcdf48594042349d0e'), 'doc/first-player-gen4/MAIN_INTEGRATION.md': ('d4cca0dc59b6488bd39e341be1d27e971d885990', '8495b9602a984ff732632bc128bdd90e479d73ba')}


def preserved_current(frozen):
    scope = frozen.read("INTEGRATION_SCOPE.json")
    old = frozen.tree(scope["sourceHead"])
    allowed = set(scope["mutableNavigation"]) | set(scope["historicalWorkflows"])
    snapshots = json.loads(gzip.decompress((frozen.DOC / "HISTORICAL_NAVIGATION.json.gz").read_bytes()))
    assert set(snapshots) == allowed
    for name, text in snapshots.items():
        assert text.encode() == frozen.git("show", scope["sourceHead"] + ":" + name), name
    updated = verify_rules_update(BASE, scope["sourceHead"])
    editorial = verify_rules_update(BASE, scope["sourceHead"],
                                    DOCUMENT_EDITORIAL_BLOBS, DOCUMENT_EDITORIAL_COMMIT)
    count = 0
    for name, (mode, expected) in old.items():
        if name in allowed:
            continue
        if name in RULES_UPDATE_BLOBS:
            assert (mode, expected) == ("100644", RULES_UPDATE_BLOBS[name][0]), name
            count += 1
            continue
        if name in DOCUMENT_EDITORIAL_BLOBS:
            assert (mode, expected) == ("100644", DOCUMENT_EDITORIAL_BLOBS[name][0]), name
            count += 1
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
    return {"agentsPolicyCommit": AGENTS_POLICY_COMMIT,
            "approvedRulesUpdateCommit": RULES_UPDATE_COMMIT, "approvedRulesUpdateFiles": updated,
            "documentEditorialCommit": DOCUMENT_EDITORIAL_COMMIT, "documentEditorialFiles": editorial,
            "preservedSourceFiles": count, "historicalSnapshots": len(snapshots),
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
