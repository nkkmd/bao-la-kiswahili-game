#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
p = ROOT / "doc/RESEARCH_INDEX.md"
t = p.read_text(encoding="utf-8")

replacements = [
    (
        "G2-08 / G2-09までclosure済みである。次のdownstream machine-only agenda itemはG2-10であり、詳細は`FUTURE_RESEARCH_AGENDA.md`を正本とする。",
        "G2-08〜G2-10までclosure済みである。G2-10は`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`で閉じ、G2-11へ渡せるvalidated / frozen representationを生成していない。次のdownstream transition研究にはnew prospective representation protocolが必要であり、詳細は`FUTURE_RESEARCH_AGENDA.md`を正本とする。",
    ),
    (
        "G2-08 / G2-09はいずれも独立prospective studyとして完了済みであり、次のdownstream machine-only agenda itemはG2-10である。",
        "G2-08〜G2-10はいずれも独立prospective Studyとして完了済みである。G2-10はeligible representation 0で閉じたため、G2-11へ本Study群のunvalidated representationを事後昇格させない。",
    ),
]

for old, new in replacements:
    if new in t:
        continue
    hits = t.count(old)
    if hits != 1:
        raise SystemExit(f"RESEARCH_INDEX cleanup anchor mismatch: expected 1, found {hits}: {old}")
    t = t.replace(old, new, 1)

p.write_text(t, encoding="utf-8")
