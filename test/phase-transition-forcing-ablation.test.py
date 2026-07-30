#!/usr/bin/env python3
"""Regression tests for forcing ablation and candidate classification."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools/experiments/analyze-phase-transition-forcing-ablation.py"
spec = importlib.util.spec_from_file_location("forcing_ablation", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

frame = pd.DataFrame([
    {
        "analysis_eligible": True,
        "persistence_3": 1.0,
        "reserve_signal": 0.5,
        "mobility_signal": 2.2,
        "capture_signal": 0.4,
        "front_signal": 0.3,
        "forcing_signal": 3.0,
    },
    {
        "analysis_eligible": True,
        "persistence_3": 1.0,
        "reserve_signal": 2.1,
        "mobility_signal": 2.2,
        "capture_signal": 0.4,
        "front_signal": 0.3,
        "forcing_signal": 0.0,
    },
])

inclusive = module.mode_points(frame, "inclusive", 2.0, 0.75)
excluded = module.mode_points(frame, "excluded", 2.0, 0.75)
auxiliary = module.mode_points(frame, "auxiliary", 2.0, 0.75)

assert list(inclusive.index) == [0, 1]
assert list(excluded.index) == [1]
assert list(auxiliary.index) == [1]
assert bool(inclusive.loc[0, "forcingActive"]) is True
assert inclusive.loc[0, "activeNonForcingGroups"] == 1
assert excluded.loc[1, "activeNonForcingGroups"] == 2
assert auxiliary.loc[1, "ablation_score"] == inclusive.loc[1, "ablation_score"]

left = pd.Series({"gameId": "g1", "startPly": 10, "endPly": 12})
overlap = pd.Series({"gameId": "g1", "startPly": 12, "endPly": 14})
disjoint = pd.Series({"gameId": "g1", "startPly": 13, "endPly": 14})
other_game = pd.Series({"gameId": "g2", "startPly": 10, "endPly": 12})
assert module.intervals_overlap(left, overlap)
assert not module.intervals_overlap(left, disjoint)
assert not module.intervals_overlap(left, other_game)

clusters = {
    "inclusive": pd.DataFrame([
        {"gameId": "g1", "startPly": 10, "endPly": 12},
        {"gameId": "g1", "startPly": 20, "endPly": 20},
    ]),
    "excluded": pd.DataFrame([
        {"gameId": "g1", "startPly": 11, "endPly": 11},
    ]),
    "auxiliary": pd.DataFrame([
        {"gameId": "g1", "startPly": 11, "endPly": 11},
    ]),
}
overlap_result = module.overlap_summary(clusters)
assert overlap_result["inclusiveOnly"] == 1
assert overlap_result["survivesWithoutForcing"] == 1
assert overlap_result["excludedOnly"] == 0
assert overlap_result["allThreeInclusiveClusters"] == 1

try:
    module.mode_points(frame, "invalid", 2.0, 0.75)
except ValueError:
    pass
else:
    raise AssertionError("invalid forcing mode should fail")

print("phase-transition forcing classification regression passed")
