#!/usr/bin/env python3
"""Regression test for pandas.json_normalize array handling."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools/experiments/analyze-phase-transition-pilot.py"
spec = importlib.util.spec_from_file_location("phase_transition_analysis", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

records = [
    {
        "gameId": "test-game",
        "ply": 0,
        "phase": "namua",
        "reserve": [22, 22],
        "houseOwned": [True, True],
        "legalMoveCount": 4,
        "captureMoveCount": 1,
        "nonCaptureMoveCount": 3,
        "forcedCapture": False,
        "frontRow": {
            "occupiedPits": [8, 8],
            "occupancyRate": [1.0, 1.0],
            "seedCount": [16, 16],
        },
    },
    {
        "gameId": "test-game",
        "ply": 1,
        "phase": "namua",
        "reserve": [21, 22],
        "houseOwned": [True, True],
        "legalMoveCount": 3,
        "captureMoveCount": 1,
        "nonCaptureMoveCount": 2,
        "forcedCapture": False,
        "frontRow": {
            "occupiedPits": [8, 7],
            "occupancyRate": [1.0, 0.875],
            "seedCount": [17, 15],
        },
    },
]

frame = pd.json_normalize(records)
prepared = module.prepare_features(frame)

assert prepared.loc[0, "reserve_0"] == 22
assert prepared.loc[1, "reserve_1"] == 22
assert bool(prepared.loc[0, "house_0"]) is True
assert prepared.loc[1, "front_occupied_1"] == 7
assert prepared.loc[1, "front_rate_1"] == 0.875
assert prepared.loc[1, "front_seeds_0"] == 17
assert prepared.loc[1, "reserve_total_delta"] == -1
print("phase-transition analysis array-column regression passed")
