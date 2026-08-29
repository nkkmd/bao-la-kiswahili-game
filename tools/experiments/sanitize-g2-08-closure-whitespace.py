#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Fully generated study overview: normalize all line endings/trailing whitespace.
p = ROOT / "doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md"
lines = p.read_text(encoding="utf-8").splitlines()
p.write_text("\n".join(line.rstrip() for line in lines) + "\n", encoding="utf-8")

# Target only the generated status line in the pre-existing reproducibility index.
p = ROOT / "doc/machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md"
t = p.read_text(encoding="utf-8")
t = t.replace("更新日: 2026-08-30  \n状態: **STUDY CLOSED / NON-ESTIMABLE**", "更新日: 2026-08-30\n状態: **STUDY CLOSED / NON-ESTIMABLE**")
p.write_text(t, encoding="utf-8")

# Target only the two generated heading-metadata lines in RESEARCH_INDEX.
p = ROOT / "doc/RESEARCH_INDEX.md"
t = p.read_text(encoding="utf-8")
t = t.replace("のprospective分離・再現可能なtaxonomy構築  \n**Program:**", "のprospective分離・再現可能なtaxonomy構築\n**Program:**")
t = t.replace("**Research Generation 2**  \n**状態:**", "**Research Generation 2**\n**状態:**")
p.write_text(t, encoding="utf-8")

print("G2-08 generated closure whitespace sanitized")
