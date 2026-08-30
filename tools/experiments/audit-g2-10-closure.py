#!/usr/bin/env python3
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / "doc/unified-multiaxial-strategic-state-representation"
EXPECTED_BASELINE = "495c9a993278ffab03a6d2cfe2c9a7093c559fd5"
EXPECTED_STAGE1_FILE_SHA256 = "21fb4cd60dbaa6761b177ad54cda5dd33c942ba3994a953ce5486917f0e440fd"
EXPECTED_CONSUMPTION_SHA256 = "c6f95fd2bab4c21fd4b99ee6a69590861a907a001e87e0d63e3af72a7661f522"
EXPECTED_EXACT_SHA256 = "6746eb5d5213d278a7991b6613a0ebf95ed621cc1759d1128f164337583785fb"
EXPECTED_MANIFEST_SHA256 = "9010f53c676b5e588e8e4553acd6ec680bd6ca366f31a68a6f53dbe8de90c823"
EXPECTED_RUNNER_RESULT_SHA256 = "985235180827db9d314b610baeb37cd2aec9427633ac518c270c938230060b9a"
STAGE1_TOKEN = "STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION"
STUDY_TOKEN = "NOT-AUTHORIZED-NOT-EXECUTED"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(rel: str):
    return json.loads((STUDY / rel).read_text(encoding="utf-8"))


def require(condition, message):
    if not condition:
        raise SystemExit(message)


# Repository / whitespace boundary.
subprocess.run(["git", "diff", "--check", "origin/main...HEAD"], cwd=ROOT, check=True)
main_sha = subprocess.check_output(["git", "rev-parse", "origin/main"], cwd=ROOT, text=True).strip()
require(main_sha == EXPECTED_BASELINE, f"origin/main moved: {main_sha}")

protocol = (STUDY / "STUDY_1_PROTOCOL.md").read_text(encoding="utf-8")
require("### Stage 2 / Study" in protocol and STUDY_TOKEN in protocol and STAGE1_TOKEN in protocol, "frozen protocol taxonomy mismatch")

# Every machine-readable JSON in the Study directory must parse.
for path in STUDY.rglob("*.json"):
    json.loads(path.read_text(encoding="utf-8"))

stage1 = load_json("results/STAGE_1_DEVELOPMENT_RESULT.json")
consumption = load_json("results/STAGE_1_CONSUMPTION_RECORD.json")
exact = load_json("results/STAGE_1_FINAL_EXACT_COMPARISON.json")
final = load_json("results/STUDY_1_FINAL_RESULT.json")

require(stage1["disposition"] == STAGE1_TOKEN, "Stage 1 disposition mismatch")
require(stage1["seedBlock"]["status"] == "CONSUMED", "Stage 1 seed not consumed")
require(stage1["seedBlock"]["start"] == 29310001 and stage1["seedBlock"]["end"] == 29314096, "Stage 1 seed range mismatch")
require(stage1["scientificReadiness"]["passed"] is True, "scientific readiness not PASS")
require(stage1["resource"]["passed"] is True, "resource gate not PASS")
require(stage1["technicalVerification"]["fullExact"] is True, "Stage 1 exact verification not PASS")
require(stage1["selectedRepresentation"] is None, "unexpected selected representation")
require(all(c["eligible"] is False for c in stage1["candidateK"]), "eligible K unexpectedly present")
require(stage1["resultSha256"] == EXPECTED_RUNNER_RESULT_SHA256, "runner internal result SHA mismatch")

require(consumption["status"] == "CONSUMED", "consumption record status mismatch")
require(consumption["sameBlockRerunAuthorized"] is False, "same-block rerun unexpectedly authorized")
require(exact["fullExact"] is True and all(v is True for v in exact.values()), "exact comparison mismatch")

require(final["formalStudyDecision"] == STUDY_TOKEN, "final Study decision mismatch")
require(final["validatedStrategicRepresentation"] is False, "validated representation unexpectedly true")
require(final["frozenRepresentationArtifactExists"] is False, "frozen representation flag mismatch")
require(final["g2_11CandidateInputAuthorized"] is False, "G2-11 input unexpectedly authorized")
require(final["stages"]["stage2"]["disposition"] == STUDY_TOKEN, "Stage 2 disposition mismatch")
require(final["stages"]["stage2"]["seedBlock"]["status"] == "RESERVED_UNCONSUMED", "Stage 2 seed status mismatch")
require(final["stages"]["stage2"]["seedBlock"]["start"] == 29410001 and final["stages"]["stage2"]["seedBlock"]["end"] == 29418192, "Stage 2 seed range mismatch")

require(not (STUDY / "results/FROZEN_REPRESENTATION.json").exists(), "FROZEN_REPRESENTATION.json must not exist")

hashes = {
    "results/STAGE_1_DEVELOPMENT_RESULT.json": EXPECTED_STAGE1_FILE_SHA256,
    "results/STAGE_1_CONSUMPTION_RECORD.json": EXPECTED_CONSUMPTION_SHA256,
    "results/STAGE_1_FINAL_EXACT_COMPARISON.json": EXPECTED_EXACT_SHA256,
    "results/STAGE_1_HASH_MANIFEST.json": EXPECTED_MANIFEST_SHA256,
}
for rel, expected in hashes.items():
    actual = sha256(STUDY / rel)
    require(actual == expected, f"SHA-256 mismatch {rel}: {actual}")

# Human-facing Study entry points must expose final decision, non-meaning, and Stage 2 consequence.
for rel in [
    "README.md",
    "STUDY_1_OVERVIEW.md",
    "STUDY_1_FINAL_REPORT.md",
    "CURRENT_STATUS.md",
    "DECISION_REGISTER.md",
    "REPRODUCIBILITY_INDEX.md",
    "RESUME_HERE.md",
]:
    text = (STUDY / rel).read_text(encoding="utf-8")
    require(STAGE1_TOKEN in text, f"Stage 1 token missing from {rel}")
    require(STUDY_TOKEN in text, f"Study/Stage 2 token missing from {rel}")
    require(any("\u3040" <= ch <= "\u30ff" or "\u4e00" <= ch <= "\u9fff" for ch in text), f"Japanese prose missing from {rel}")

# Central entry points must agree with Study closure.
root_readme = (ROOT / "README.md").read_text(encoding="utf-8")
index = (ROOT / "doc/RESEARCH_INDEX.md").read_text(encoding="utf-8")
agenda = (ROOT / "doc/FUTURE_RESEARCH_AGENDA.md").read_text(encoding="utf-8")
for name, text in [("README.md", root_readme), ("RESEARCH_INDEX.md", index), ("FUTURE_RESEARCH_AGENDA.md", agenda)]:
    require("UMSSR-STUDY1" in text, f"UMSSR-STUDY1 missing from {name}")
    require(STAGE1_TOKEN in text, f"Stage 1 token missing from {name}")
    require(STUDY_TOKEN in text, f"Study token missing from {name}")

require("次のdownstream machine-only agenda itemはG2-10" not in index, "stale G2-10 next-study reference remains")
require("G2-11へ渡せるvalidated / frozen representationはない" in index, "G2-11 boundary missing from index")
require("NO ELIGIBLE FROZEN REPRESENTATION" in agenda, "G2-11 dependency barrier missing from agenda")
require("G2-11開始前にnew prospective representation Studyまたはexplicit versioned protocolを必要とする" in agenda, "new prospective G2-11 representation prerequisite missing")

print(json.dumps({
    "studyId": "UMSSR-STUDY1",
    "formalDecision": STUDY_TOKEN,
    "stage1Disposition": STAGE1_TOKEN,
    "stage2": STUDY_TOKEN,
    "stage1Seeds": "CONSUMED",
    "stage2Seeds": "RESERVED_UNCONSUMED",
    "validatedRepresentation": False,
    "g2_11CandidateInputAuthorized": False,
    "audit": "PASS",
}, ensure_ascii=False, indent=2))
