#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASELINE = "87d9ccf9825b9b9160dcab23202a17d66ef0d541"
AGENDA = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
INDEX = ROOT / "doc/RESEARCH_INDEX.md"
PROGRAM = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
SELECTION = ROOT / "doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md"
G2_10 = ROOT / "doc/unified-multiaxial-strategic-state-representation"


def require(condition, message):
    if not condition:
        raise SystemExit(message)


subprocess.run(["git", "diff", "--check", f"{BASELINE}...HEAD"], cwd=ROOT, check=True)

# Preparation must not modify any G2-10 Study-local scientific/history file.
unchanged = subprocess.run(
    ["git", "diff", "--quiet", BASELINE, "HEAD", "--", str(G2_10.relative_to(ROOT))],
    cwd=ROOT,
).returncode == 0
require(unchanged, "G2-10 Study-local files changed during prerequisite preparation")

changed = subprocess.check_output(
    ["git", "diff", "--name-only", f"{BASELINE}...HEAD"], cwd=ROOT, text=True
).splitlines()
for path in changed:
    require("/prereg/" not in path, f"unexpected prereg change: {path}")
    require("/results/" not in path, f"unexpected result change: {path}")
    require("/authorizations/" not in path, f"unexpected authorization change: {path}")

selection = SELECTION.read_text(encoding="utf-8")
for token in [
    "SELECTED NEXT RESEARCH DIRECTION / NOT YET PREREGISTERED",
    "formal Study ID fixed = false",
    "formal Stage IDs fixed = false",
    "scientific population fixed = false",
    "scientific seeds authorized = false",
    "outcome generation authorized = false",
    "G2-11 authorized = false",
    "not a new `G2-xx` agenda sequence label",
]:
    require(token in selection, f"selection state token missing: {token}")

agenda = AGENDA.read_text(encoding="utf-8")
require("#### Pre-G2-11 prerequisite — new prospective strategic representation Study" in agenda, "Agenda prerequisite section missing")
require("formal Study ID・最終題目・Stage IDは未固定" in agenda, "Agenda prospective-ID boundary missing")
require("scientific outcome generation未承認" in agenda, "Agenda scientific authorization boundary missing")
require("#### G2-11 — Long-Horizon Strategic Transition Structure Study 1" in agenda, "G2-11 section missing")
require("G2-11を直接開始するのではなく" in agenda, "G2-11 dependency boundary missing")
require("G2-10 (completed) (completed)" not in agenda, "duplicate G2-10 completion marker remains")

index = INDEX.read_text(encoding="utf-8")
require("**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite" in index, "RESEARCH_INDEX next direction missing")
require("正式Study ID・最終題目・Stage構成は研究開始時" in index, "RESEARCH_INDEX prospective boundary missing")

program = PROGRAM.read_text(encoding="utf-8")
for heading in [
    "### G2-07 — Practical Comeback / Reply-Pressure Representation Study 1",
    "### G2-08 — Machine Decision-Failure Taxonomy Study 1",
    "### G2-09 — Tactical Motif Generalization / Counterexample Study 1",
    "### G2-10 — Unified Multiaxial Strategic State Representation Study 1",
    "## 2026-08-30 — Pre-G2-11 strategic representation prerequisite selection",
]:
    require(heading in program, f"program-progress heading missing: {heading}")
require("This section is a documentation synchronization backfill only" in program, "program backfill non-scientific boundary missing")
require("このprerequisite Studyは新しい`G2-xx` sequence labelを追加しない" in program, "fixed G2 label boundary missing")

# G2-10 canonical final result remains the already-merged closure.
final = json.loads((G2_10 / "results/STUDY_1_FINAL_RESULT.json").read_text(encoding="utf-8"))
require(final["stages"]["stage1"]["disposition"] == "STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION", "G2-10 Stage 1 decision changed")
require(final["formalStudyDecision"] == "NOT-AUTHORIZED-NOT-EXECUTED", "G2-10 Study decision changed")
require(final["stages"]["stage2"]["disposition"] == "NOT-AUTHORIZED-NOT-EXECUTED", "G2-10 Stage 2 decision changed")
require(final["g2_11CandidateInputAuthorized"] is False, "G2-10 G2-11 input authorization changed")

print(json.dumps({
    "baselineMain": BASELINE,
    "preG2_11DirectionSelected": True,
    "formalStudyIdFixed": False,
    "scientificSeedsAuthorized": False,
    "outcomeGenerationAuthorized": False,
    "g2_11Authorized": False,
    "g2_10StudyLocalChanged": False,
    "programProgressBackfilledThrough": "G2-10",
    "audit": "PASS",
}, ensure_ascii=False, indent=2))
