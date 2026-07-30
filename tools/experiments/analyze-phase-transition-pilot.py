#!/usr/bin/env python3
"""Explore phase-transition candidates in pilot-v2 artifacts.

Thresholds are exploratory pilot settings, not final recognition criteria.
The JSONL observations remain the primary source.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import pandas as pd

STUDY_VERSION = "0.4.1"
SIGNAL_THRESHOLD = 1.5
PERSISTENCE_THRESHOLD = 0.5
EARLY_TERMINAL_MAX_PLY = 7
TERMINAL_GUARD_PLIES = 1
CLUSTER_MAX_GAP = 1
SIGNAL_THRESHOLDS = (1.5, 2.0, 2.5)
PERSISTENCE_THRESHOLDS = (0.5, 0.75, 1.0)

SIGNALS = [
    "reserve_signal",
    "mobility_signal",
    "capture_signal",
    "front_signal",
    "forcing_signal",
]
STRUCTURAL_EVENTS = ["phase_event", "reserve_event", "house_event"]
FORMAL_EVENTS = [*STRUCTURAL_EVENTS, "forcing_event"]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_jsonl(path: Path) -> list[dict]:
    records: list[dict] = []
    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, start=1):
            if not line.strip():
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as exc:
                raise ValueError(
                    f"Invalid JSON at line {line_number}: {exc}"
                ) from exc
    return records


def load_artifacts(input_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame, dict]:
    observations_path = input_dir / "observations.jsonl"
    games_path = input_dir / "games.json"
    manifest_path = input_dir / "manifest.json"
    for path in (observations_path, games_path, manifest_path):
        if not path.exists():
            raise FileNotFoundError(path)

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    games = json.loads(games_path.read_text(encoding="utf-8"))
    observations = read_jsonl(observations_path)
    identity = (
        manifest.get("study"),
        manifest.get("studyVersion"),
        manifest.get("profile"),
    )
    if identity != ("phase-transition", STUDY_VERSION, "pilot-v2"):
        raise ValueError(f"Unexpected artifact identity: {identity}")
    if manifest["completedGames"] != len(games):
        raise ValueError("Game count does not match manifest")
    if manifest["observationCount"] != len(observations):
        raise ValueError("Observation count does not match manifest")

    for name, path in {
        "observations.jsonl": observations_path,
        "games.json": games_path,
    }.items():
        expected = manifest["files"][name]["sha256"]
        actual = sha256_file(path)
        if actual != expected:
            raise ValueError(
                f"SHA-256 mismatch for {name}: {actual} != {expected}"
            )

    frame = pd.json_normalize(observations).sort_values(["gameId", "ply"])
    frame = frame.reset_index(drop=True)
    if frame.duplicated(["gameId", "ply"]).any():
        raise ValueError("Duplicate gameId + ply observations")
    return frame, pd.json_normalize(games), manifest


def expand_pair_column(
    frame: pd.DataFrame,
    source: str,
    target_0: str,
    target_1: str,
) -> None:
    """Expand a two-element JSON array retained by pandas.json_normalize."""
    if target_0 in frame.columns and target_1 in frame.columns:
        return
    if source not in frame.columns:
        return
    valid = frame[source].map(
        lambda value: isinstance(value, (list, tuple)) and len(value) == 2
    )
    if not valid.all():
        bad_rows = frame.index[~valid].tolist()[:5]
        raise ValueError(f"Invalid pair column {source} at rows {bad_rows}")
    frame[target_0] = frame[source].str[0]
    frame[target_1] = frame[source].str[1]


def prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.rename(columns={
        "reserve.0": "reserve_0",
        "reserve.1": "reserve_1",
        "houseOwned.0": "house_0",
        "houseOwned.1": "house_1",
        "frontRow.occupiedPits.0": "front_occupied_0",
        "frontRow.occupiedPits.1": "front_occupied_1",
        "frontRow.occupancyRate.0": "front_rate_0",
        "frontRow.occupancyRate.1": "front_rate_1",
        "frontRow.seedCount.0": "front_seeds_0",
        "frontRow.seedCount.1": "front_seeds_1",
    }).copy()

    expand_pair_column(frame, "reserve", "reserve_0", "reserve_1")
    expand_pair_column(frame, "houseOwned", "house_0", "house_1")
    expand_pair_column(
        frame,
        "frontRow.occupiedPits",
        "front_occupied_0",
        "front_occupied_1",
    )
    expand_pair_column(
        frame,
        "frontRow.occupancyRate",
        "front_rate_0",
        "front_rate_1",
    )
    expand_pair_column(
        frame,
        "frontRow.seedCount",
        "front_seeds_0",
        "front_seeds_1",
    )

    required = {
        "gameId",
        "ply",
        "phase",
        "reserve_0",
        "reserve_1",
        "house_0",
        "house_1",
        "front_occupied_0",
        "front_occupied_1",
        "front_rate_0",
        "front_rate_1",
        "front_seeds_0",
        "front_seeds_1",
        "legalMoveCount",
        "captureMoveCount",
        "nonCaptureMoveCount",
        "forcedCapture",
    }
    missing = sorted(required - set(frame.columns))
    if missing:
        raise ValueError(f"Missing analysis columns: {missing}")

    frame["reserve_total"] = frame["reserve_0"] + frame["reserve_1"]
    frame["reserve_diff"] = frame["reserve_0"] - frame["reserve_1"]
    frame["front_total"] = (
        frame["front_occupied_0"] + frame["front_occupied_1"]
    )
    frame["front_diff"] = (
        frame["front_occupied_0"] - frame["front_occupied_1"]
    )
    frame["front_rate"] = (
        frame["front_rate_0"] + frame["front_rate_1"]
    ) / 2
    frame["front_seeds"] = (
        frame["front_seeds_0"] + frame["front_seeds_1"]
    )
    frame["capture_ratio"] = np.where(
        frame["legalMoveCount"] > 0,
        frame["captureMoveCount"] / frame["legalMoveCount"],
        0.0,
    )
    frame["max_ply"] = frame.groupby("gameId")["ply"].transform("max")
    frame["normalized_ply"] = (
        frame["ply"] / frame["max_ply"].clip(lower=1).astype(float)
    )

    features = [
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
    for feature in features:
        grouped = frame.groupby("gameId")[feature]
        frame[f"{feature}_delta"] = grouped.diff().fillna(0)
        frame[f"{feature}_ma3"] = grouped.transform(
            lambda values: values.rolling(3, min_periods=1).mean()
        )
        frame[f"{feature}_ma5"] = grouped.transform(
            lambda values: values.rolling(5, min_periods=1).mean()
        )
    return frame


def attach_game_boundaries(
    frame: pd.DataFrame,
    games: pd.DataFrame,
) -> pd.DataFrame:
    required = {"gameId", "plies", "openingPliesApplied", "baseline"}
    missing = sorted(required - set(games.columns))
    if missing:
        raise ValueError(f"Missing game metadata columns: {missing}")

    metadata = games[
        ["gameId", "plies", "openingPliesApplied", "baseline"]
    ].copy()
    metadata = metadata.rename(columns={"plies": "game_plies"})
    merged = frame.merge(
        metadata,
        on="gameId",
        how="left",
        validate="many_to_one",
    )
    if merged["game_plies"].isna().any():
        missing_ids = merged.loc[
            merged["game_plies"].isna(), "gameId"
        ].drop_duplicates().tolist()[:5]
        raise ValueError(f"Missing game metadata for {missing_ids}")

    merged["in_random_opening"] = (
        ~merged["baseline"].astype(bool)
        & (merged["ply"] <= merged["openingPliesApplied"])
    )
    merged["in_terminal_guard"] = (
        merged["ply"] > (merged["game_plies"] - TERMINAL_GUARD_PLIES)
    )
    merged["analysis_eligible"] = (
        ~merged["in_random_opening"]
        & ~merged["in_terminal_guard"]
    )
    return merged


def changed_after_first(values: pd.Series) -> pd.Series:
    previous = values.shift()
    return previous.notna() & values.ne(previous)


def add_formal_events(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    grouped = frame.groupby("gameId", group_keys=False)
    frame["phase_event"] = grouped["phase"].transform(
        lambda values: values.eq("mtaji") & values.shift().eq("namua")
    )
    frame["reserve_event"] = grouped["reserve_total"].transform(
        lambda values: values.eq(0) & values.shift().gt(0)
    )
    frame["house_event"] = (
        grouped["house_0"].transform(changed_after_first)
        | grouped["house_1"].transform(changed_after_first)
    )
    frame["forcing_event"] = grouped["forcedCapture"].transform(
        changed_after_first
    )
    return frame


def robust_abs_z(values: pd.Series) -> pd.Series:
    numeric = values.astype(float)
    median = numeric.median()
    mad = (numeric - median).abs().median()
    scale = 1.4826 * mad if mad else numeric.std(ddof=0)
    if not scale or np.isnan(scale):
        return pd.Series(0.0, index=values.index)
    return (numeric - median).abs() / scale


def add_candidate_scores(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    groups = {
        "reserve_signal": ["reserve_total_delta", "reserve_diff_delta"],
        "mobility_signal": [
            "legalMoveCount_delta",
            "nonCaptureMoveCount_delta",
        ],
        "capture_signal": [
            "captureMoveCount_delta",
            "capture_ratio_delta",
        ],
        "front_signal": [
            "front_total_delta",
            "front_rate_delta",
            "front_seeds_delta",
        ],
    }
    for name, columns in groups.items():
        standardized = [
            frame.groupby("gameId")[column].transform(robust_abs_z)
            for column in columns
        ]
        frame[name] = pd.concat(standardized, axis=1).mean(axis=1)
    frame["forcing_signal"] = frame["forcing_event"].astype(float) * 3.0
    frame["transition_score"] = frame[SIGNALS].clip(upper=5).sum(axis=1)
    return frame


def persistence_distance(game: pd.DataFrame, index: int, window: int) -> float:
    position = game.index.get_loc(index)
    before = game.iloc[max(0, position - window):position]
    after = game.iloc[
        position + 1:min(len(game), position + window + 1)
    ]
    if before.empty or after.empty:
        return 0.0
    distances: list[float] = []
    for feature in [
        "legalMoveCount",
        "capture_ratio",
        "reserve_total",
        "front_rate",
        "front_seeds",
    ]:
        scale = game[feature].std(ddof=0)
        if scale and not np.isnan(scale):
            distances.append(
                abs(after[feature].mean() - before[feature].mean()) / scale
            )
    return float(np.mean(distances)) if distances else 0.0


def add_persistence(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    frame["persistence_3"] = 0.0
    frame["persistence_5"] = 0.0
    for _, game in frame.groupby("gameId"):
        for index in game.index[game["analysis_eligible"]]:
            frame.loc[index, "persistence_3"] = persistence_distance(
                game,
                index,
                3,
            )
            frame.loc[index, "persistence_5"] = persistence_distance(
                game,
                index,
                5,
            )

    structural_plies = {
        game_id: game.loc[
            game[STRUCTURAL_EVENTS].any(axis=1), "ply"
        ].to_numpy()
        for game_id, game in frame.groupby("gameId")
    }
    forcing_plies = {
        game_id: game.loc[game["forcing_event"], "ply"].to_numpy()
        for game_id, game in frame.groupby("gameId")
    }

    def nearest(row: pd.Series, mapping: dict[str, np.ndarray]) -> float:
        values = mapping[row["gameId"]]
        if not len(values):
            return np.nan
        return float(np.min(np.abs(values - row["ply"])))

    frame["nearest_structural_distance"] = frame.apply(
        lambda row: nearest(row, structural_plies),
        axis=1,
    )
    frame["nearest_forcing_distance"] = frame.apply(
        lambda row: nearest(row, forcing_plies),
        axis=1,
    )
    return frame


def candidate_mask(
    frame: pd.DataFrame,
    signal_threshold: float,
    persistence_threshold: float,
) -> pd.Series:
    active_groups = (frame[SIGNALS] >= signal_threshold).sum(axis=1)
    return (
        frame["analysis_eligible"]
        & (active_groups >= 2)
        & (frame["persistence_3"] >= persistence_threshold)
    )


def candidate_points(
    frame: pd.DataFrame,
    signal_threshold: float,
    persistence_threshold: float,
) -> pd.DataFrame:
    points = frame[candidate_mask(
        frame,
        signal_threshold,
        persistence_threshold,
    )].copy()
    points["active_signal_groups"] = (
        points[SIGNALS] >= signal_threshold
    ).sum(axis=1)
    points["signal_threshold"] = signal_threshold
    points["persistence_threshold"] = persistence_threshold
    return points


def cluster_candidates(
    points: pd.DataFrame,
    max_gap: int = CLUSTER_MAX_GAP,
) -> pd.DataFrame:
    columns = [
        "gameId",
        "clusterId",
        "startPly",
        "endPly",
        "spanPlies",
        "pointCount",
        "representativePly",
        "normalizedPly",
        "phase",
        "peakScore",
        "maxActiveSignalGroups",
        "maxPersistence3",
        "maxPersistence5",
        "nearestStructuralDistance",
        "nearestForcingDistance",
    ]
    if points.empty:
        return pd.DataFrame(columns=columns)

    rows: list[dict] = []
    for game_id, game in points.sort_values(
        ["gameId", "ply"]
    ).groupby("gameId"):
        cluster_number = 0
        cluster_indices: list[int] = []
        previous_ply: int | None = None

        def emit(indices: list[int], number: int) -> None:
            cluster = game.loc[indices]
            representative_index = cluster["transition_score"].idxmax()
            representative = cluster.loc[representative_index]
            rows.append({
                "gameId": game_id,
                "clusterId": f"{game_id}-c{number:03d}",
                "startPly": int(cluster["ply"].min()),
                "endPly": int(cluster["ply"].max()),
                "spanPlies": int(
                    cluster["ply"].max() - cluster["ply"].min() + 1
                ),
                "pointCount": int(len(cluster)),
                "representativePly": int(representative["ply"]),
                "normalizedPly": float(representative["normalized_ply"]),
                "phase": representative["phase"],
                "peakScore": float(cluster["transition_score"].max()),
                "maxActiveSignalGroups": int(
                    cluster["active_signal_groups"].max()
                ),
                "maxPersistence3": float(
                    cluster["persistence_3"].max()
                ),
                "maxPersistence5": float(
                    cluster["persistence_5"].max()
                ),
                "nearestStructuralDistance": float(
                    cluster["nearest_structural_distance"].min()
                ) if cluster["nearest_structural_distance"].notna().any()
                else np.nan,
                "nearestForcingDistance": float(
                    cluster["nearest_forcing_distance"].min()
                ) if cluster["nearest_forcing_distance"].notna().any()
                else np.nan,
            })

        for index, row in game.iterrows():
            ply = int(row["ply"])
            if previous_ply is None or ply - previous_ply <= max_gap:
                cluster_indices.append(index)
            else:
                cluster_number += 1
                emit(cluster_indices, cluster_number)
                cluster_indices = [index]
            previous_ply = ply
        if cluster_indices:
            cluster_number += 1
            emit(cluster_indices, cluster_number)

    return pd.DataFrame(rows, columns=columns)


def metrics(
    frame: pd.DataFrame,
    label: str,
    signal_threshold: float,
    persistence_threshold: float,
) -> dict:
    points = candidate_points(
        frame,
        signal_threshold,
        persistence_threshold,
    )
    clusters = cluster_candidates(points)
    game_count = frame["gameId"].nunique()
    return {
        "sample": label,
        "games": int(game_count),
        "observations": int(len(frame)),
        "eligibleObservations": int(frame["analysis_eligible"].sum()),
        "candidatePointCount": int(len(points)),
        "candidateClusterCount": int(len(clusters)),
        "gamesWithCandidates": int(clusters["gameId"].nunique())
        if not clusters.empty else 0,
        "clustersPerGame": len(clusters) / max(game_count, 1),
        "medianPeakScore": float(clusters["peakScore"].median())
        if not clusters.empty else None,
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


def sensitivity_table(
    frame: pd.DataFrame,
    early_game_ids: set[str],
) -> list[dict]:
    rows: list[dict] = []
    samples = [
        ("all_100", frame),
        (
            "exclude_early_terminal",
            frame[~frame["gameId"].isin(early_game_ids)],
        ),
    ]
    for sample_name, sample in samples:
        for signal_threshold in SIGNAL_THRESHOLDS:
            for persistence_threshold in PERSISTENCE_THRESHOLDS:
                result = metrics(
                    sample,
                    sample_name,
                    signal_threshold,
                    persistence_threshold,
                )
                result["signalThreshold"] = signal_threshold
                result["persistenceThreshold"] = persistence_threshold
                rows.append(result)
    return rows


def analyze(input_dir: Path, output_dir: Path) -> dict:
    frame, games, manifest = load_artifacts(input_dir)
    frame = prepare_features(frame)
    frame = attach_game_boundaries(frame, games)
    frame = add_formal_events(frame)
    frame = add_candidate_scores(frame)
    frame = add_persistence(frame)

    early_game_ids = set(
        games.loc[
            games["plies"] <= EARLY_TERMINAL_MAX_PLY,
            "gameId",
        ]
    )
    expected_early = manifest["openingQuality"][
        "acceptedEarlyTerminalCount"
    ]
    if len(early_game_ids) != expected_early:
        raise ValueError(
            f"Early-terminal count mismatch: {len(early_game_ids)} "
            f"!= {expected_early}"
        )

    points = candidate_points(
        frame,
        SIGNAL_THRESHOLD,
        PERSISTENCE_THRESHOLD,
    )
    clusters = cluster_candidates(points)
    sensitivity = sensitivity_table(frame, early_game_ids)

    summary = {
        "studyVersion": STUDY_VERSION,
        "analysisVersion": "2",
        "configHash": manifest["configHash"],
        "thresholds": {
            "signal": SIGNAL_THRESHOLD,
            "persistence": PERSISTENCE_THRESHOLD,
            "earlyTerminalMaxPly": EARLY_TERMINAL_MAX_PLY,
            "terminalGuardPlies": TERMINAL_GUARD_PLIES,
            "clusterMaxGap": CLUSTER_MAX_GAP,
        },
        "exclusions": {
            "randomOpeningObservations": int(
                frame["in_random_opening"].sum()
            ),
            "terminalGuardObservations": int(
                frame["in_terminal_guard"].sum()
            ),
        },
        "formalEventCounts": {
            column: int(frame[column].sum())
            for column in FORMAL_EVENTS
        },
        "earlyTerminalGameIds": sorted(early_game_ids),
        "samples": [
            metrics(
                frame,
                "all_100",
                SIGNAL_THRESHOLD,
                PERSISTENCE_THRESHOLD,
            ),
            metrics(
                frame[~frame["gameId"].isin(early_game_ids)],
                "exclude_early_terminal",
                SIGNAL_THRESHOLD,
                PERSISTENCE_THRESHOLD,
            ),
        ],
        "sensitivity": sensitivity,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    point_columns = [
        "gameId",
        "ply",
        "normalized_ply",
        "phase",
        "transition_score",
        "active_signal_groups",
        "persistence_3",
        "persistence_5",
        "nearest_structural_distance",
        "nearest_forcing_distance",
        "in_random_opening",
        "in_terminal_guard",
        *SIGNALS,
    ]
    points[point_columns].to_csv(
        output_dir / "transition-candidate-points.csv",
        index=False,
    )
    clusters.to_csv(
        output_dir / "transition-candidate-clusters.csv",
        index=False,
    )
    pd.DataFrame(sensitivity).to_csv(
        output_dir / "threshold-sensitivity.csv",
        index=False,
    )
    (output_dir / "analysis-summary.json").write_text(
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
        default=Path("artifacts/local/phase-transition-analysis"),
    )
    args = parser.parse_args()
    print(json.dumps(
        analyze(args.input, args.output),
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
