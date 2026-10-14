"""中間保存のbyte・原ZIP・独立検算・案内品質を読取り専用で監査する。"""
from pathlib import Path, PurePosixPath
import json, hashlib, gzip, zipfile, io, subprocess, tempfile, re, sys, os

BASE = Path(__file__).resolve().parents[3]
DOC = BASE / "doc/research-generation-5/checkpoint-20261014"

def read(name):
    return json.loads((DOC / name).read_text())

def sha(data):
    return hashlib.sha256(data).hexdigest()

def git(*args):
    return subprocess.check_output(["git", "-C", str(BASE), *args])

def tree(ref):
    rows = {}
    for entry in git("ls-tree", "-r", "-z", ref).split(b"\0"):
        if entry:
            meta, name = entry.split(b"\t", 1)
            mode, kind, blob = meta.decode().split()
            rows[name.decode()] = (mode, blob)
    return rows

def preserved():
    scope = read("INTEGRATION_SCOPE.json")
    old = tree(scope["sourceHead"])
    allowed = set(scope["mutableNavigation"]) | set(scope["historicalWorkflows"])
    snapshots = json.loads(gzip.decompress((DOC / "HISTORICAL_NAVIGATION.json.gz").read_bytes()))
    assert set(snapshots) == allowed
    for name, text in snapshots.items():
        assert text.encode() == git("show", scope["sourceHead"] + ":" + name), name
    count = 0
    for name, (mode, expected) in old.items():
        if name in allowed:
            continue
        p = BASE / name
        data = os.readlink(p).encode() if mode == "120000" else p.read_bytes()
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        assert actual == expected, name
        count += 1
    public = [n for n in tree(scope["baseMain"]) if n.startswith(("public/", "cloudflare/"))]
    original_main = tree(scope["baseMain"])
    assert all(old[n] == original_main[n] for n in public)
    for name, pin in scope["historicalWorkflows"].items():
        text = (BASE / name).read_text()
        assert "ref: " + pin["historicalInputCommit"] in text, name
        assert pin["historicalInputCommit"] in git("rev-list", scope["sourceHead"]).decode().split()
    assert scope["befcsScientificSeedsRead"] == 0
    for k in ["befcsScientificLeaseCreated", "befcsStudyRegistered", "formalRelationRegistered", "scientificExecutionPerformed"]:
        assert scope[k] is False
    return {"preservedSourceFiles": count, "historicalSnapshots": len(snapshots),
            "publicAndWorkerFiles": len(public), "historicalWorkflows": len(scope["historicalWorkflows"])}

def history():
    record = read("PR_HISTORY_RECONCILIATION.json")
    assert record["sourceHead"] == read("INTEGRATION_SCOPE.json")["sourceHead"]
    assert record["decision"] == "SUPERSEDED-VARIANT-HISTORY-PRESERVED-NOT-CURRENT-TREE"
    assert [r["number"] for r in record["pullRequests"]] == list(range(181, 205))
    for row in record["pullRequests"]:
        included = subprocess.run(["git", "-C", str(BASE), "merge-base", "--is-ancestor",
                                   row["headSha"], record["sourceHead"]], capture_output=True).returncode
        assert included in (0, 1)
        assert (included == 0) == row["includedInSourceHistory"]
        assert subprocess.run(["git", "-C", str(BASE), "merge-base", "--is-ancestor",
                               row["headSha"], "HEAD"], capture_output=True).returncode == 0
    assert [r["number"] for r in record["pullRequests"] if not r["includedInSourceHistory"]] == [202]
    variant = tree(record["supersededHead"])
    source = tree(record["sourceHead"])
    assert len(record["supersededVariantFiles"]) == 28
    for name, row in record["supersededVariantFiles"].items():
        assert variant[name][1] == row["variantBlob"]
        assert source.get(name, (None, None))[1] == row["currentBlob"]
        if row["currentBlob"] is None:
            assert not (BASE / name).exists(), name
    return {"pullRequestHeadsPreserved": 24, "supersededVariantFiles": 28}

def archives(hashes_only=False):
    jobs = {j["name"]: j for j in read("CI_JOBS.json")["jobs"]}
    meta = {a["id"]: a for a in read("CI_ARTIFACTS.json")["artifacts"]}
    members = total = 0
    rows = []
    for a in read("ARCHIVES.json"):
        d = DOC / "results" / a["mode"]
        if (d / "ZIP_PARTS.json").exists():
            split = json.loads((d / "ZIP_PARTS.json").read_text())
            chunks = []
            for i, part in enumerate(split["parts"]):
                assert part["name"] == f"CI_ARTIFACT.zip.part-{i:03d}"
                chunk = (d / part["name"]).read_bytes()
                assert len(chunk) == part["bytes"] and sha(chunk) == part["sha256"]
                chunks.append(chunk)
            raw = b"".join(chunks)
            assert len(raw) == split["bytes"] and sha(raw) == split["sha256"]
        else:
            raw = (d / "CI_ARTIFACT.zip").read_bytes()
        assert sha(raw) == a["sha256"] == meta[a["artifactId"]]["digest"].split(":")[1]
        assert len(raw) == a["bytes"] == meta[a["artifactId"]]["size_in_bytes"]
        saved = json.loads(gzip.decompress((d / "FILE_HASHES.json.gz").read_bytes()))
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            assert len(z.namelist()) == len(set(z.namelist()))
            assert sum(x.file_size for x in z.infolist()) <= 268435456
            for x in z.infolist():
                p = PurePosixPath(x.filename)
                assert not p.is_absolute() and ".." not in p.parts
                assert (x.external_attr >> 16) & 0o170000 != 0o120000
            inventory = {x.filename: {"bytes": x.file_size, "sha256": sha(z.read(x))}
                         for x in z.infolist() if not x.is_dir()}
            assert inventory == saved and len(saved) == a["members"]
            assert json.loads(z.read("RESULT.json"))["sourceManifestSha256"] == sha(
                (BASE / "doc/research-generation-5/befcs-remote-stop-v3-20261014/SOURCE_MANIFEST.json").read_bytes())
            if not hashes_only:
                with tempfile.TemporaryDirectory(prefix="bao-checkpoint-read-") as tmp:
                    z.extractall(tmp)
                    for kind, script in [("RAW", "g5-checkpoint/verify-v3-raw.cjs"),
                                         ("V3", "g5-befcs-remote-stop-v3/verify-acquired.cjs")]:
                        result = json.loads(subprocess.check_output(
                            ["node", "--max-old-space-size=384",
                             str(BASE / "tools/research" / script), tmp], text=True))
                        assert result == json.loads((d / (kind + "_VERIFICATION.json")).read_text())
        raw_proof = json.loads((d / "RAW_VERIFICATION.json").read_text())
        v3 = json.loads((d / "V3_VERIFICATION.json").read_text())
        assert raw_proof["fixturePassed"] and raw_proof["sourceGenerationPerformed"] is False
        assert jobs["remote-joined (" + a["mode"] + ")"]["conclusion"] == "success"
        assert v3["scientificSeedsRead"] == 0
        if a["mode"] == "deadline":
            assert not raw_proof["completedRecordPresent"] and v3["forensicPreservationAfterDeadline"]
            assert not v3["technicalComplete"]
        if a["mode"] == "proxy-final-mirror":
            assert raw_proof["remoteProof"]["fullSources"] == 126
            assert raw_proof["localProof"]["fullSources"] == 128 and not v3["finalMirrorSaved"]
        if a["mode"] == "lost-response":
            assert raw_proof["unacknowledgedMarkers"] == 1 and v3["ackCount"] == 0
        rows.append({"mode": a["mode"], "verified": True})
        total += len(raw)
        members += len(saved)
        print(a["mode"], "保存証拠一致", len(saved), flush=True)
    assert len(rows) == 5 and members == 3361 and total == 43364710
    head_runs = read("CI_HEAD_RUNS.json")["workflow_runs"]
    assert len(head_runs) == 13 and all(r["conclusion"] == "success" for r in head_runs)
    assert all(r["head_sha"] == read("INTEGRATION_SCOPE.json")["sourceHead"] for r in head_runs)
    for j in read("CI_JOBS.json")["jobs"]:
        assert j["conclusion"] == "success"
        assert gzip.decompress((DOC / "logs" / ("JOB-" + str(j["id"]) + ".txt.gz")).read_bytes())
    return {"archives": len(rows), "members": members, "archiveBytes": total, "originalWorkflows": len(head_runs)}

def language():
    paths = git("diff", "--name-only", read("INTEGRATION_SCOPE.json")["baseMain"],
                read("INTEGRATION_SCOPE.json")["sourceHead"]).decode().splitlines()
    paths += [str(p.relative_to(BASE)) for p in DOC.rglob("*.md")]
    paths += ["tools/research/g5-checkpoint/README.md"]
    paths = sorted(set(p for p in paths if p.endswith(".md") and (BASE / p).exists()))
    missing = []
    english_headings = []
    english_lines = []
    links = 0
    for name in paths:
        p = BASE / name
        fenced = False
        for line in p.read_text().splitlines():
            if line.strip().startswith(("```", "~~~")):
                fenced = not fenced
                continue
            if fenced:
                continue
            canonical_heading = re.fullmatch(r"#{1,6} (Bao la Kiswahili|G[1-5]-\d{2})", line)
            if re.match(r"^#{1,6} ", line) and not re.search(r"[ぁ-んァ-ヶ一-龯]", line) and not canonical_heading:
                english_headings.append((name, line))
            if re.match(r"^[A-Z][a-z]+\s", line) and line.endswith(".") and not re.search(r"[ぁ-んァ-ヶ一-龯]", line):
                english_lines.append((name, line))
            for target in re.findall(r"(?<!!)\[[^\]]*\]\(([^)]+)\)", line):
                target = target.split("#")[0]
                if not target or re.match(r"^[a-zA-Z]+:", target) or target.startswith("/"):
                    continue
                from urllib.parse import unquote
                links += 1
                if not (p.parent / unquote(target)).exists():
                    missing.append((name, target))
    assert not missing, missing
    assert not english_headings, english_headings
    assert not english_lines, english_lines
    return {"markdownFiles": len(paths), "relativeLinks": links, "brokenLinks": 0,
            "englishOnlyHeadings": 0, "englishOnlyNormalSentences": 0}

def check():
    result = {"preservation": preserved(), "history": history(), "evidence": archives("--hashes-only" in sys.argv),
              "documentation": language(), "befcsScientificSeedsRead": 0,
              "scientificSourceGenerationPerformed": False}
    for name, expected in read("CHECKPOINT_BINDING.json")["files"].items():
        assert sha((BASE / name).read_bytes()) == expected, name
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result

if __name__ == "__main__":
    check()
