#!/usr/bin/env python3
"""Compare forcing-signal roles in pilot-v2 transition detection.

This analysis imports the v2 feature preparation and boundary logic without
changing the archived v2 outputs. The three modes are:

- inclusive: forcing is one of the signal groups required for candidacy.
- excluded: forcing is omitted from candidacy and score.
- auxiliary: at least two non-forcing groups are required; forcing only adds
  to the reported score.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

import pandas as pd

SCRIPT = Path(__file__).with_name("analyze-phase-transition-pilot.py")
spec = importlib.util.spec_from_file_location("phase_transition_v2", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {SCRIPT}")
v2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v2)

ANALYSIS_VERSION = "3-forcing-ablation"
PRIMARY_SIGNAL_THRESHOLD = 2.0
PRIMARY_PERSISTENCE_THRESHOLD = 0.75
STRICT_SIGNAL_THRESHOLD = 2.5
STRICT_PERSISTENCE_THRESHOLD = 1.0
NON_FORCING_SIGNALS = [
    "reserve_signal",
    "mobility_signal",
    "capture_signal",
    "front_signal",
]
MODES = ("inclusive", "excluded", "auxiliary")


def mode_points(
    frame: pd.DataFrame,
    mode: str,
    signal_threshold: float,
    persistence_threshold: float,
) -> pd.DataFrame:
    if mode not in MODES:
        raise ValueError(f"Unknown forcing mode: {mode}")

    non_forcing_active = (
        frame[NON_FORCING_SIGNALS] >= signal_threshold
    ).sum(axis=1)
    forcing_active = frame["forcing_signal"] >= signal_threshold

    if mode == "inclusive":
        active_groups = non_forcing_active + forcing_active.astype(int)
        candidate = active_groups >= 2
        score_columns = [*NON_FORCING_SIGNALS, "forcing_signal"]
    elif mode == "excluded":
        active_groups = non_forcing_active
        candidate = active_groups >= 2
        score_columns = NON_FORCING_SIGNALS
    else:
        active_groups = non_forcing_active
        candidate = active_groups >= 2
        score_columns = [*NON_FORCING_SIGNALS, "forcing_signal"]

    mask = (
        frame["analysis_eligible"]
        & candidate
        & (frame["persistence_3"] >= persistence_threshold)
    )
    points = frame[mask].copy()
    points["forcingMode"] = mode
    points["activeNonForcingGroups"] = non_forcing_active.loc[points.index]
    points["forcingActive"] = forcing_active.loc[points.index]
    points["active_signal_groups"] = active_groups.loc[points.index]
    points["ablation_score"] = points[score_columns].clip(upper=5).sum(axis=1)
    points["transition_score"] = points["ablation_score"]
    points["signal_threshold"] = signal_threshold
    points["persistence_threshold"] = persistence_threshold
    return points


def mode_metrics(
    frame: pd.DataFrame,
    sample: str,
    mode: str,
    signal_threshold: float,
    persistence_threshold: float,
) -> tuple[dict, pd.DataFrame, pd.DataFrame]:
    points = mode_points(
        frame,
        mode,
        signal_threshold,
        persistence_threshold,
    )
    clusters = v2.cluster_candidates(points)
    if not clusters.empty:
        clusters.insert(1, "forcingMode", mode)
        clusters["signalThreshold"] = signal_threshold
        clusters["persistenceThreshold"] = persistence_threshold

    game_count = frame["gameId"].nunique()
    forcing_point_share = (
        float(points["forcingActive"].mean()) if not points.empty else None
    )
    forcing_cluster_share = None
    if not clusters.empty:
        forcing_cluster_share = float(
            (clusters["nearestForcingDistance"] == 0).mean()
        )

    result = {
        "sample": sample,
        "forcingMode": mode,
        "signalThreshold": signal_threshold,
        "persistenceThreshold": persistence_threshold,
        "games": int(game_count),
        "eligibleObservations": int(frame["analysis_eligible"].sum()),
        "candidatePointCount": int(len(points)),
        "candidateClusterCount": int(len(clusters)),
        "gamesWithCandidates": int(clusters["gameId"].nunique())
        if not clusters.empty else 0,
        "clustersPerGame": len(clusters) / max(game_count, 1),
        "forcingPointShare": forcing_point_share,
        "forcingClusterShare": forcing_cluster_share,
        "medianStructuralDistance": float(
            clusters["nearestStructuralDistance"].median()
        ) if (
            not clusters.empty
            and clusters["nearestStructuralDistance"].notna().any()
        ) else None,
        "medianForcingDistance": float(
            clusters["nearestForcingDistance"].median()
        ) if (
            not clusters.empty
            and clusters["nearestForcingDistance"].notna().any()
        ) else None,
    }
    return result, points, clusters


def overlap_summary(clusters_by_mode: dict[str, pd.DataFrame]) -> dict:
    identities = {
        mode: set(zip(clusters["gameId"], clusters["representativePly"]))
        if not clusters.empty else set()
        for mode, clusters in clusters_by_mode.items()
    }
    inclusive = identities["inclusive"]
    excluded = identities["excluded"]
    auxiliary = identities["auxiliary"]
    return {
        "inclusiveOnly": len(inclusive - auxiliary),
        "survivesWithoutForcing": len(inclusive & excluded),
        "inclusiveAndAuxiliary": len(inclusive & auxiliary),
        "allThree": len(inclusive & excluded & auxiliary),
        "excludedOnly": len(excluded - inclusive),
    }


def analyze(input_dir: Path, output_dir: Path) -> dict:
    frame, games, manifest = v2.load_artifacts(input_dir)
    frame = v2.prepare_features(frame)
    frame = v2.attach_game_boundaries(frame, games)
    frame = v2.add_formal_events(frame)
    frame = v2.add_candidate_scores(frame)
    frame = v2.add_persistence(frame)

    early_game_ids = set(
        games.loc[games["plies"] <= v2.EARLY_TERMINAL_MAX_PLY, "gameId"]
    )
    samples = {
        "all_100": frame,
        "exclude_early_terminal": frame[
            ~frame["gameId"].isin(early_game_ids)
        ],
    }
    settings = {
        "primary": (
            PRIMARY_SIGNAL_THRESHOLD,
            PRIMARY_PERSISTENCE_THRESHOLD,
        ),
        "strict": (
            STRICT_SIGNAL_THRESHOLD,
            STRICT_PERSISTENCE_THRESHOLD,
        ),
    }

    metric_rows: list[dict] = []
    primary_points: list[pd.DataFrame] = []
    primary_clusters: list[pd.DataFrame] = []
    primary_all_clusters: dict[str, pd.DataFrame] = {}

    for setting_name, thresholds in settings.items():
        signal_threshold, persistence_threshold = thresholds
        for sample_name, sample in samples.items():
            for mode in MODES:
                metrics, points, clusters = mode_metrics(
                    sample,
                    sample_name,
                    mode,
                    signal_threshold,
                    persistence_threshold,
                )
                metrics["setting"] = setting_name
                metric_rows.append(metrics)
                if setting_name == "primary" and sample_name == "all_100":
                    primary_points.append(points)
                    primary_clusters.append(clusters)
                    primary_all_clusters[mode] = clusters

    metrics_frame = pd.DataFrame(metric_rows)
    points_frame = pd.concat(primary_points, ignore_index=True)
    clusters_frame = pd.concat(primary_clusters, ignore_index=True)

    summary = {
        "studyVersion": v2.STUDY_VERSION,
        "analysisVersion": ANALYSIS_VERSION,
        "configHash": manifest["configHash"],
        "modes": {
            "inclusive": "forcing counts toward the two-group candidacy rule",
            "excluded": "forcing is omitted from candidacy and score",
            "auxiliary": "two non-forcing groups are required; forcing only adds score",
        },
        "settings": {
            name: {
                "signalThreshold": values[0],
                "persistenceThreshold": values[1],
            }
            for name, values in settings.items()
        },
        "overlapAtPrimaryAll100": overlap_summary(primary_all_clusters),
        "metrics": metric_rows,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    metrics_frame.to_csv(output_dir / "forcing-ablation-summary.csv", index=False)
    points_frame.to_csv(output_dir / "forcing-ablation-points.csv", index=False)
    clusters_frame.to_csv(output_dir / "forcing-ablation-clusters.csv", index=False)
    (output_dir / "forcing-ablation-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("artifacts/phase-transition/pilot-v2"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("artifacts/local/phase-transition-forcing-ablation"),
    )
    args = parser.parse_args()
    print(json.dumps(
        analyze(args.input, args.output),
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
