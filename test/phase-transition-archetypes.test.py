#!/usr/bin/env python3
from __future__ import annotations
import importlib.util
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools/experiments/analyze-phase-transition-archetypes.py"
spec = importlib.util.spec_from_file_location("archetypes", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

assert module.phase_band(0.1) == "opening"
assert module.phase_band(0.5) == "middle"
assert module.phase_band(0.8) == "late"
assert module.phase_band(0.95) == "terminal_near"
assert module.calculate_plies_remaining(71, 70) == 1
assert module.calculate_plies_remaining(48.0, 46) == 2

row = pd.Series({
    "phase": "namua", "normalized_ply": 0.5,
    "reserve_signal": 2.1, "mobility_signal": 0.0,
    "capture_signal": 2.2, "front_signal": 0.0,
    **{f"{feature}_delta": 1.23456 for feature in module.SIGNATURE_FEATURES},
})
signature = module.rounded_signature(row)
assert '"band":"middle"' in signature
assert '"active":"reserve|capture"' in signature
assert len(module.signature_id(signature)) == 12
print("phase-transition archetype regression passed")
