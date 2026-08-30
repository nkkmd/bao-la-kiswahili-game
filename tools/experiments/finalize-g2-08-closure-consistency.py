#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def update_once_or_already(path, old, new, label):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    if new in text:
        return
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one old anchor or existing new text, found {count}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


update_once_or_already(
    "doc/RESEARCH_INDEX.md",
    "**Boundary:** G2-07のStage 1 blockは消費済みで、artifact-transfer failureを理由としたsame-block rerunや、development-core一致のみを根拠とするpost-hoc verification条件緩和は行わない。Stage 2は未承認のまま閉鎖し、次のindependent agenda itemはG2-08として新規prospective contractで扱う。",
    "**Boundary:** G2-07のStage 1 blockは消費済みで、artifact-transfer failureを理由としたsame-block rerunや、development-core一致のみを根拠とするpost-hoc verification条件緩和は行わない。Stage 2は未承認のまま閉鎖する。G2-08も独立prospective studyとして完了済みであり、次の未着手機械研究はG2-09である。",
    "RESEARCH_INDEX G2-07 next-study boundary",
)

update_once_or_already(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "P1: G2-07 (completed), G2-08, G2-09, G2-10",
    "P1: G2-07 (completed), G2-08 (completed), G2-09, G2-10",
    "FUTURE_RESEARCH_AGENDA priority summary",
)

update_once_or_already(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "更新日: 2026-08-29",
    "更新日: 2026-08-30",
    "FUTURE_RESEARCH_AGENDA update date",
)

print("G2-08 closure consistency finalized")
