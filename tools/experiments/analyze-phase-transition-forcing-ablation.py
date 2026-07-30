#!/usr/bin/env python3
"""Compare forcing-signal roles and classify pilot-v2 transition candidates.

The analysis preserves the v2 feature and boundary logic and compares:

- inclusive: forcing counts toward the two-group candidacy rule.
- excluded: forcing is omitted from candidacy and score.
- auxiliary: two non-forcing groups are required; forcing only adds score.

Primary candidates are classified as:

- A: survives without forcing and is not coincident with a forcing event.
- B: survives without forcing and is coincident with a forcing event.
- C: appears only when forcing counts toward candidacy.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

import numpy as np
import pandas as pd

SCRIPT = Path(__file__).with_name("analyze-phase-transition-pilot.py")
spec = importlib.util.spec_from_file_location("phase_transition_v2", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {SCRIPT}")
v2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v2)

ANALYSIS_VERSION = "3.1-forcing-classification"
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
AUDIT_FEATURES = [
    "reserve_total",
    "reserve_diff",
    "legalMoveCount",
    "captureMoveCount",
    "nonCaptureMoveCount",
    "capture_ratio",
    "front_total",
    "front_diff",
    "front_rate",
    "front_seeds",
]


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


def intervals_overlap(left: pd.Series, right: pd.Series) -> bool:
    return (
        left["gameId"] == right["gameId"]
        and int(left["startPly"]) <= int(right["endPly"])
        and int(right["startPly"]) <= int(left["endPly"])
    )


def overlapping_indices(
    source: pd.DataFrame,
    target: pd.DataFrame,
) -> dict[int, list[int]]:
    matches: dict[int, list[int]] = {}
    if source.empty or target.empty:
        return matches
    target_by_game = {
        game_id: game
        for game_id, game in target.groupby("gameId")
    }
    for source_index, source_row in source.iterrows():
        candidates = target_by_game.get(source_row["gameId"])
        if candidates is None:
            continue
        matched = [
            int(target_index)
            for target_index, target_row in candidates.iterrows()
            if intervals_overlap(source_row, target_row)
        ]
        if matched:
            matches[int(source_index)] = matched
    return matches


def overlap_summary(clusters_by_mode: dict[str, pd.DataFrame]) -> dict:
    inclusive = clusters_by_mode["inclusive"].reset_index(drop=True)
    excluded = clusters_by_mode["excluded"].reset_index(drop=True)
    auxiliary = clusters_by_mode["auxiliary"].reset_index(drop=True)

    inclusive_excluded = overlapping_indices(inclusive, excluded)
    inclusive_auxiliary = overlapping_indices(inclusive, auxiliary)
    excluded_inclusive = overlapping_indices(excluded, inclusive)
    excluded_auxiliary = overlapping_indices(excluded, auxiliary)

    inclusive_survivors = set(inclusive_excluded)
    inclusive_aux = set(inclusive_auxiliary)
    excluded_survivors = set(excluded_inclusive)
    excluded_aux = set(excluded_auxiliary)

    return {
        "matchingRule": "same gameId and overlapping [startPly, endPly]",
        "inclusiveOnly": int(len(inclusive) - len(inclusive_survivors)),
        "survivesWithoutForcing": int(len(inclusive_survivors)),
        "inclusiveAndAuxiliary": int(len(inclusive_aux)),
        "allThreeInclusiveClusters": int(
            len(inclusive_survivors & inclusive_aux)
        ),
        "excludedOnly": int(len(excluded) - len(excluded_survivors)),
        "excludedAndAuxiliary": int(len(excluded_survivors & excluded_aux)),
    }


def active_signal_names(row: pd.Series, threshold: float) -> str:
    return "|".join(
        name.removesuffix("_signal")
        for name in NON_FORCING_SIGNALS
        if float(row[name]) >= threshold
    )


def representative_row(
    frame: pd.DataFrame,
    cluster: pd.Series,
) -> pd.Series:
    rows = frame[
        (frame["gameId"] == cluster["gameId"])
        & (frame["ply"] == int(cluster["representativePly"]))
    ]
    if len(rows) != 1:
        raise ValueError(
            "Expected one representative observation for "
            f"{cluster['gameId']} ply {cluster['representativePly']}"
        )
    return rows.iloc[0]


def audit_record(
    frame: pd.DataFrame,
    cluster: pd.Series,
    category: str,
    rationale: str,
) -> dict:
    observation = representative_row(frame, cluster)
    record = {
        "category": category,
        "categoryRationale": rationale,
        "gameId": cluster["gameId"],
        "clusterId": cluster["clusterId"],
        "startPly": int(cluster["startPly"]),
        "endPly": int(cluster["endPly"]),
        "representativePly": int(cluster["representativePly"]),
        "normalizedPly": float(cluster["normalizedPly"]),
        "phase": cluster["phase"],
        "peakScore": float(cluster["peakScore"]),
        "activeNonForcingGroups": int(
            sum(
                float(observation[name]) >= PRIMARY_SIGNAL_THRESHOLD
                for name in NON_FORCING_SIGNALS
            )
        ),
        "activeNonForcingSignals": active_signal_names(
            observation,
            PRIMARY_SIGNAL_THRESHOLD,
        ),
        "forcingActive": bool(
            observation["forcing_signal"] >= PRIMARY_SIGNAL_THRESHOLD
        ),
        "persistence3": float(observation["persistence_3"]),
        "persistence5": float(observation["persistence_5"]),
        "nearestStructuralDistance": (
            float(cluster["nearestStructuralDistance"])
            if pd.notna(cluster["nearestStructuralDistance"])
            else np.nan
        ),
        "nearestForcingDistance": (
            float(cluster["nearestForcingDistance"])
            if pd.notna(cluster["nearestForcingDistance"])
            else np.nan
        ),
    }
    for signal in [*NON_FORCING_SIGNALS, "forcing_signal"]:
        record[signal] = float(observation[signal])
    for feature in AUDIT_FEATURES:
        record[f"{feature}Delta"] = float(observation[f"{feature}_delta"])
    return record


def classify_primary_clusters(
    frame: pd.DataFrame,
    clusters_by_mode: dict[str, pd.DataFrame],
) -> pd.DataFrame:
    inclusive = clusters_by_mode["inclusive"].reset_index(drop=True)
    excluded = clusters_by_mode["excluded"].reset_index(drop=True)
    inclusive_to_excluded = overlapping_indices(inclusive, excluded)

    records: list[dict] = []

    for _, cluster in excluded.iterrows():
        forcing_distance = cluster["nearestForcingDistance"]
        if pd.isna(forcing_distance) or float(forcing_distance) > 0:
            category = "A"
            rationale = "survives_without_forcing_and_not_forcing_coincident"
        else:
            category = "B"
            rationale = "survives_without_forcing_but_forcing_coincident"
        records.append(audit_record(frame, cluster, category, rationale))

    for inclusive_index, cluster in inclusive.iterrows():
        if int(inclusive_index) in inclusive_to_excluded:
            continue
        records.append(audit_record(
            frame,
            cluster,
            "C",
            "requires_forcing_to_satisfy_candidate_rule",
        ))

    audit = pd.DataFrame(records)
    if not audit.empty:
        audit = audit.sort_values(
            ["category", "peakScore", "gameId", "representativePly"],
            ascending=[True, False, True, True],
        ).reset_index(drop=True)
    return audit


def classification_summary(audit: pd.DataFrame) -> dict:
    counts = audit["category"].value_counts().to_dict() if not audit.empty else {}
    return {
        "A_forcingIndependent": int(counts.get("A", 0)),
        "B_forcingCoincidentNonForcingSupported": int(counts.get("B", 0)),
        "C_forcingDependent": int(counts.get("C", 0)),
        "totalClassified": int(len(audit)),
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
    audit = classify_primary_clusters(frame, primary_all_clusters)

    summary = {
        "studyVersion": v2.STUDY_VERSION,
        "analysisVersion": ANALYSIS_VERSION,
        "configHash": manifest["configHash"],
        "modes": {
            "inclusive": "forcing counts toward the two-group candidacy rule",
            "excluded": "forcing is omitted from candidacy and score",
            "auxiliary": "two non-forcing groups are required; forcing only adds score",
        },
        "categories": {
            "A": "survives without forcing and is not forcing-coincident",
            "B": "survives without forcing and is forcing-coincident",
            "C": "requires forcing to satisfy the candidacy rule",
        },
        "settings": {
            name: {
                "signalThreshold": values[0],
                "persistenceThreshold": values[1],
            }
            for name, values in settings.items()
        },
        "overlapAtPrimaryAll100": overlap_summary(primary_all_clusters),
        "classificationAtPrimaryAll100": classification_summary(audit),
        "metrics": metric_rows,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    metrics_frame.to_csv(
        output_dir / "forcing-ablation-summary.csv",
        index=False,
    )
    points_frame.to_csv(
        output_dir / "forcing-ablation-points.csv",
        index=False,
    )
    clusters_frame.to_csv(
        output_dir / "forcing-ablation-clusters.csv",
        index=False,
    )
    audit.to_csv(
        output_dir / "candidate-audit-table.csv",
        index=False,
    )
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
