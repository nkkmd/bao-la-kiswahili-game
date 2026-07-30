#!/usr/bin/env python3
"""Regression tests for phase-transition pilot analysis."""

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


def observation(ply: int) -> dict:
    return {
        "gameId": "test-game",
        "ply": ply,
        "phase": "namua" if ply < 7 else "mtaji",
        "reserve": [22 - min(ply, 22), 22],
        "houseOwned": [True, True],
        "legalMoveCount": 4 + (ply % 3),
        "captureMoveCount": 1 + (ply % 2),
        "nonCaptureMoveCount": 3,
        "forcedCapture": bool(ply % 2),
        "frontRow": {
            "occupiedPits": [8, max(1, 8 - ply // 3)],
            "occupancyRate": [1.0, max(0.125, 1.0 - ply / 24)],
            "seedCount": [16 + ply, max(1, 16 - ply)],
        },
    }


frame = pd.json_normalize([observation(ply) for ply in range(11)])
prepared = module.prepare_features(frame)

assert prepared.loc[0, "reserve_0"] == 22
assert prepared.loc[1, "reserve_1"] == 22
assert bool(prepared.loc[0, "house_0"]) is True
assert prepared.loc[3, "front_occupied_1"] == 7
assert prepared.loc[1, "reserve_total_delta"] == -1

metadata = pd.DataFrame([{
    "gameId": "test-game",
    "plies": 10,
    "openingPliesApplied": 6,
    "baseline": False,
}])
bounded = module.attach_game_boundaries(prepared, metadata)

assert bounded.loc[0:6, "in_random_opening"].all()
assert not bounded.loc[7, "in_random_opening"]
assert bounded.loc[10, "in_terminal_guard"]
assert bounded.loc[7:9, "analysis_eligible"].all()

cluster_input = pd.DataFrame([
    {
        "gameId": "test-game",
        "ply": ply,
        "normalized_ply": ply / 10,
        "phase": "mtaji",
        "transition_score": score,
        "active_signal_groups": 3,
        "persistence_3": 0.8,
        "persistence_5": 0.9,
        "nearest_structural_distance": float(abs(8 - ply)),
        "nearest_forcing_distance": 0.0,
    }
    for ply, score in [(7, 8.0), (8, 10.0), (10, 9.0)]
])
clusters = module.cluster_candidates(cluster_input)

assert len(clusters) == 2
assert clusters.loc[0, "startPly"] == 7
assert clusters.loc[0, "endPly"] == 8
assert clusters.loc[0, "representativePly"] == 8
assert clusters.loc[1, "startPly"] == 10

print("phase-transition analysis regression tests passed")
