#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIXES = {
    "doc/tactical-motif-generalization-counterexample/DECISION_REGISTER.md": {
        "## TMGC-D012 — Stage 0 core verification": "## TMGC-D012 — Stage 0 core検証",
        "## TMGC-D018 — Stage 1 tooling smoke contract": "## TMGC-D018 — Stage 1 tooling smokeのcontract",
        "## TMGC-D021 — Study closure": "## TMGC-D021 — Studyのclosure",
    },
    "doc/tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md": {
        "### Stage 0 closure commit": "### Stage 0 closureのcommit",
    },
    "doc/tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md": {
        "## 6. Stage 1 tooling smoke": "## 6. Stage 1 tooling smokeの検証",
    },
    "doc/tactical-motif-generalization-counterexample/checkpoints/2026-08-30-stage0-core-tooling-materialized.md": {
        "- D1/D2/D3 exact-search reconstruction": "- D1/D2/D3 exact-searchのreconstruction",
    },
    "doc/tactical-motif-generalization-counterexample/checkpoints/2026-08-30-stage0-technical-closure.md": {
        "# 2026-08-30 — Stage 0 technical closure": "# 2026-08-30 — Stage 0 technical closureの記録",
    },
}

for rel, replacements in FIXES.items():
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    seen = set()
    out = []
    for line in lines:
        nl = "\n" if line.endswith("\n") else ""
        core = line[:-1] if nl else line
        if core in replacements:
            core = replacements[core]
            seen.add(line[:-1] if nl else line)
        out.append(core + nl)
    missing = set(replacements) - seen
    if missing:
        raise SystemExit(f"expected localization line missing in {rel}: {sorted(missing)}")
    path.write_text("".join(out), encoding="utf-8")

print("localized 7 final audited lines")
