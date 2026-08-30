#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BRANCH_INDEX = ROOT / "doc/RESEARCH_INDEX.md"

old_1 = "G2-07は別prospective contractとして完了し、次の未着手機械研究はG2-08である。"
new_1 = "G2-07以降も独立prospective contractとして進み、G2-08 / G2-09までclosure済みである。次のdownstream machine-only agenda itemはG2-10であり、詳細は`FUTURE_RESEARCH_AGENDA.md`を正本とする。"
old_2 = "G2-08も独立prospective studyとして完了済みであり、次の未着手機械研究はG2-09である。"
new_2 = "G2-08 / G2-09はいずれも独立prospective studyとして完了済みであり、次のdownstream machine-only agenda itemはG2-10である。"

text = BRANCH_INDEX.read_text(encoding="utf-8")
for old, new, label in [(old_1, new_1, "G2-06 boundary"), (old_2, new_2, "G2-07 boundary")]:
    if old in text:
        if text.count(old) != 1:
            raise SystemExit(f"{label}: expected one stale phrase, found {text.count(old)}")
        text = text.replace(old, new, 1)
    elif new not in text:
        raise SystemExit(f"{label}: neither stale nor corrected phrase found")
BRANCH_INDEX.write_text(text, encoding="utf-8")


def require(path, needle, label):
    body = (ROOT / path).read_text(encoding="utf-8")
    if needle not in body:
        raise SystemExit(f"{label}: required text missing: {needle}")
    return body

root_readme = require("README.md", "doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md", "root README G2-09 link")
for needle in ["`G2-09` / `TMGC-STUDY1`", "Studyは`TECHNICAL-INVALID`でclosed", "Stage 1/2 scientific seedsは未消費"]:
    if needle not in root_readme:
        raise SystemExit(f"root README consistency: missing {needle}")

index = BRANCH_INDEX.read_text(encoding="utf-8")
checks = [
    "### 25. Tactical Motif Generalization / Counterexample — Study 1",
    "formal decision `TECHNICAL-INVALID`",
    "Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`",
    "次のdownstream machine-only agenda itemはG2-10",
]
for needle in checks:
    if needle not in index:
        raise SystemExit(f"RESEARCH_INDEX consistency: missing {needle}")
for stale in [old_1, old_2, "次の未着手機械研究はG2-08", "次の未着手機械研究はG2-09"]:
    if stale in index:
        raise SystemExit(f"RESEARCH_INDEX consistency: stale phrase remains: {stale}")

agenda = require("doc/FUTURE_RESEARCH_AGENDA.md", "#### G2-09 — Tactical Motif Generalization / Counterexample Study 1", "agenda G2-09 section")
for needle in [
    "`TMGC-STUDY1 = TECHNICAL-INVALID`",
    "G2-01..G2-09はclosure済みである。",
    "`G2-10 — Unified Multiaxial Strategic State Representation Study 1`",
]:
    if needle not in agenda:
        raise SystemExit(f"FUTURE_RESEARCH_AGENDA consistency: missing {needle}")

closure = require("doc/research-program-decisions/2026-08-30-g2-09-tactical-motif-generalization-counterexample-closure.md", "Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID", "program decision Stage 1")
for needle in ["Stage 0 = STAGE0-TECHNICAL-PASS", "Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED", "Study = TECHNICAL-INVALID", "29110001..29114096", "29210001..29218192"]:
    if needle not in closure:
        raise SystemExit(f"program decision consistency: missing {needle}")

status = require("doc/tactical-motif-generalization-counterexample/CURRENT_STATUS.md", "Study = TECHNICAL-INVALID", "study current status")
for needle in ["Stage 0 = STAGE0-TECHNICAL-PASS", "Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID", "Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED", "RESERVED / UNCONSUMED"]:
    if needle not in status:
        raise SystemExit(f"CURRENT_STATUS consistency: missing {needle}")

print("G2-09 central documentation consistency: PASS")
