#!/usr/bin/env python3
"""Deduplicate and summarize forcing-ablation transition candidates."""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

import pandas as pd

SCRIPT = Path(__file__).with_name("analyze-phase-transition-forcing-ablation.py")
spec = importlib.util.spec_from_file_location("forcing_ablation", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {SCRIPT}")
ablation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ablation)
v2 = ablation.v2

ANALYSIS_VERSION = "4-candidate-archetypes"
SIGNATURE_FEATURES = ablation.AUDIT_FEATURES


def phase_band(value: float) -> str:
    if value < 0.33:
        return "opening"
    if value < 0.67:
        return "middle"
    if value <= 0.90:
        return "late"
    return "terminal_near"


def rounded_signature(row: pd.Series) -> str:
    values = [round(float(row[f"{feature}_delta"]), 3) for feature in SIGNATURE_FEATURES]
    payload = {
        "phase": row["phase"],
        "band": phase_band(float(row["normalized_ply"])),
        "active": ablation.active_signal_names(row, ablation.PRIMARY_SIGNAL_THRESHOLD),
        "deltas": values,
    }
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


def signature_id(signature: str) -> str:
    return hashlib.sha256(signature.encode("utf-8")).hexdigest()[:12]


def calculate_plies_remaining(max_ply: int | float, representative_ply: int | float) -> int:
    """Return remaining plies after a representative observation."""
    return int(max_ply) - int(representative_ply)


def build_frame(input_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame, dict]:
    frame, games, manifest = v2.load_artifacts(input_dir)
    frame = v2.prepare_features(frame)
    frame = v2.attach_game_boundaries(frame, games)
    frame = v2.add_formal_events(frame)
    frame = v2.add_candidate_scores(frame)
    frame = v2.add_persistence(frame)
    return frame, games, manifest


def classify_four_way(frame: pd.DataFrame) -> pd.DataFrame:
    clusters = {}
    for mode in ("inclusive", "excluded"):
        _, _, clusters[mode] = ablation.mode_metrics(
            frame,
            "all_100",
            mode,
            ablation.PRIMARY_SIGNAL_THRESHOLD,
            ablation.PRIMARY_PERSISTENCE_THRESHOLD,
        )
        clusters[mode] = clusters[mode].reset_index(drop=True)

    inclusive = clusters["inclusive"]
    excluded = clusters["excluded"]
    inc_to_exc = ablation.overlapping_indices(inclusive, excluded)
    exc_to_inc = ablation.overlapping_indices(excluded, inclusive)
    records = []

    for index, cluster in excluded.iterrows():
        if index not in exc_to_inc:
            category = "X"
            rationale = "excluded_cluster_without_overlapping_inclusive_cluster"
        elif pd.isna(cluster["nearestForcingDistance"]) or float(cluster["nearestForcingDistance"]) > 0:
            category = "A"
            rationale = "survives_without_forcing_and_not_forcing_coincident"
        else:
            category = "B"
            rationale = "survives_without_forcing_but_forcing_coincident"
        records.append(ablation.audit_record(frame, cluster, category, rationale))

    for index, cluster in inclusive.iterrows():
        if index not in inc_to_exc:
            records.append(ablation.audit_record(
                frame,
                cluster,
                "C",
                "requires_forcing_to_satisfy_candidate_rule",
            ))

    audit = pd.DataFrame(records)
    if audit.empty:
        return audit

    representatives = frame.set_index(["gameId", "ply"])
    state_hashes = []
    plies_remaining = []
    signatures = []
    for _, row in audit.iterrows():
        representative_ply = int(row["representativePly"])
        observation = representatives.loc[(row["gameId"], representative_ply)]
        state_hashes.append(str(observation.get("stateHash", "")))
        plies_remaining.append(calculate_plies_remaining(
            observation["max_ply"],
            representative_ply,
        ))
        signatures.append(rounded_signature(observation))

    audit["stateHash"] = state_hashes
    audit["pliesRemaining"] = plies_remaining
    audit["phaseBand"] = audit["normalizedPly"].map(phase_band)
    audit["changeSignature"] = signatures
    audit["archetypeId"] = audit["changeSignature"].map(signature_id)
    return audit.sort_values(["category", "archetypeId", "peakScore"], ascending=[True, True, False])


def archetype_table(audit: pd.DataFrame) -> pd.DataFrame:
    if audit.empty:
        return pd.DataFrame()
    rows = []
    for (category, archetype_id), members in audit.groupby(["category", "archetypeId"]):
        representative = members.sort_values(
            ["peakScore", "persistence3", "gameId"], ascending=[False, False, True]
        ).iloc[0]
        rows.append({
            "category": category,
            "archetypeId": archetype_id,
            "memberCount": int(len(members)),
            "uniqueStateCount": int(members["stateHash"].nunique()),
            "gameCount": int(members["gameId"].nunique()),
            "phaseBand": representative["phaseBand"],
            "phase": representative["phase"],
            "activeNonForcingSignals": representative["activeNonForcingSignals"],
            "representativeGameId": representative["gameId"],
            "representativePly": int(representative["representativePly"]),
            "peakScore": float(representative["peakScore"]),
            "persistence3": float(representative["persistence3"]),
            "persistence5": float(representative["persistence5"]),
            "pliesRemaining": int(representative["pliesRemaining"]),
            "nearestStructuralDistance": representative["nearestStructuralDistance"],
            "nearestForcingDistance": representative["nearestForcingDistance"],
            "changeSignature": representative["changeSignature"],
        })
    return pd.DataFrame(rows).sort_values(
        ["category", "memberCount", "peakScore"], ascending=[True, False, False]
    ).reset_index(drop=True)


def analyze(input_dir: Path, output_dir: Path) -> dict:
    frame, _, manifest = build_frame(input_dir)
    audit = classify_four_way(frame)
    archetypes = archetype_table(audit)
    category_counts = audit["category"].value_counts().to_dict() if not audit.empty else {}
    archetype_counts = archetypes["category"].value_counts().to_dict() if not archetypes.empty else {}
    summary = {
        "studyVersion": v2.STUDY_VERSION,
        "analysisVersion": ANALYSIS_VERSION,
        "configHash": manifest["configHash"],
        "candidateCounts": {key: int(category_counts.get(key, 0)) for key in "ABCX"},
        "archetypeCounts": {key: int(archetype_counts.get(key, 0)) for key in "ABCX"},
        "uniqueStateCounts": {
            key: int(audit.loc[audit["category"] == key, "stateHash"].nunique()) for key in "ABCX"
        },
        "phaseBandsA": (
            audit.loc[audit["category"] == "A", "phaseBand"].value_counts().sort_index().astype(int).to_dict()
        ),
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    audit.to_csv(output_dir / "archetype-members.csv", index=False)
    archetypes.to_csv(output_dir / "candidate-archetypes.csv", index=False)
    (output_dir / "archetype-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("artifacts/phase-transition/pilot-v2"))
    parser.add_argument("--output", type=Path, default=Path("artifacts/local/phase-transition-archetypes"))
    args = parser.parse_args()
    print(json.dumps(analyze(args.input, args.output), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
