#!/usr/bin/env python3
"""Regression tests for forcing ablation candidate rules."""

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

try:
    module.mode_points(frame, "invalid", 2.0, 0.75)
except ValueError:
    pass
else:
    raise AssertionError("invalid forcing mode should fail")

print("phase-transition forcing ablation regression passed")
