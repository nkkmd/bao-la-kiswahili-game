#!/usr/bin/env python3
"""Explore phase-transition candidates in pilot-v2 artifacts.

The thresholds in this module are exploratory pilot settings, not final
recognition criteria. The JSONL observations remain the primary source.
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
SIGNAL_COLUMNS = [
    "reserve_signal",
    "mobility_signal",
    "capture_signal",
    "front_signal",
    "forcing_signal",
]
FORMAL_COLUMNS = [
    "phase_event",
    "reserve_event",
    "house_event",
    "forcing_event",
]


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
                raise ValueError(f"Invalid JSON at line {line_number}: {exc}") from exc
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

    expected_identity = ("phase-transition", STUDY_VERSION, "pilot-v2")
    actual_identity = (
        manifest.get("study"),
        manifest.get("studyVersion"),
        manifest.get("profile"),
    )
    if actual_identity != expected_identity:
        raise ValueError(f"Unexpected artifact identity: {actual_identity}")
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
            raise ValueError(f"SHA-256 mismatch for {name}: {actual} != {expected}")

    frame = pd.json_normalize(observations).sort_values(["gameId", "ply"])
    frame = frame.reset_index(drop=True)
    games_frame = pd.json_normalize(games)
    if frame.duplicated(["gameId", "ply"]).any():
        raise ValueError("Duplicate gameId + ply observations")
    return frame, games_frame, manifest


def prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.rename(
        columns={
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
        }
    ).copy()
    required = {
        "gameId", "ply", "phase", "reserve_0", "reserve_1", "house_0",
        "house_1", "front_occupied_0", "front_occupied_1",
        "front_rate_0", "front_rate_1", "front_seeds_0", "front_seeds_1",
        "legalMoveCount", "captureMoveCount", "nonCaptureMoveCount",
        "forcedCapture",
    }
    missing = sorted(required - set(frame.columns))
    if missing:
        raise ValueError(f"Missing analysis columns: {missing}")

    frame["reserve_total"] = frame["reserve_0"] + frame["reserve_1"]
    frame["reserve_diff"] = frame["reserve_0"] - frame["reserve_1"]
    frame["front_total"] = frame["front_occupied_0"] + frame["front_occupied_1"]
    frame["front_diff"] = frame["front_occupied_0"] - frame["front_occupied_1"]
    frame["front_rate"] = (frame["front_rate_0"] + frame["front_rate_1"]) / 2
    frame["front_seeds"] = frame["front_seeds_0"] + frame["front_seeds_1"]
    frame["capture_ratio"] = np.where(
        frame["legalMoveCount"] > 0,
        frame["captureMoveCount"] / frame["legalMoveCount"],
        0.0,
    )
    frame["normalized_ply"] = frame.groupby("gameId")["ply"].transform(
        lambda values: values / max(float(values.max()), 1.0)
    )

    features = [
        "reserve_total", "reserve_diff", "legalMoveCount",
        "captureMoveCount", "nonCaptureMoveCount", "capture_ratio",
        "front_total", "front_diff", "front_rate", "front_seeds",
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


def add_formal_events(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    grouped = frame.groupby("gameId", group_keys=False)
    frame["phase_event"] = grouped["phase"].transform(
        lambda values: values.eq("mtaji") & values.shift().eq("namua")
    )
    frame["reserve_event"] = grouped["reserve_total"].transform(
        lambda values: values.eq(0) & values.shift().gt(0)
    )
    changed = lambda values: values.ne(values.shift()).fillna(False)
    frame["house_event"] = (
        grouped["house_0"].transform(changed)
        | grouped["house_1"].transform(changed)
    )
    frame["forcing_event"] = grouped["forcedCapture"].transform(changed)
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
        "mobility_signal": ["legalMoveCount_delta", "nonCaptureMoveCount_delta"],
        "capture_signal": ["captureMoveCount_delta", "capture_ratio_delta"],
        "front_signal": ["front_total_delta", "front_rate_delta", "front_seeds_delta"],
    }
    for name, columns in groups.items():
        standardized = [
            frame.groupby("gameId")[column].transform(robust_abs_z)
            for column in columns
        ]
        frame[name] = pd.concat(standardized, axis=1).mean(axis=1)
    frame["forcing_signal"] = frame["forcing_event"].astype(float) * 3.0
    frame["active_signal_groups"] = (
        frame[SIGNAL_COLUMNS] >= SIGNAL_THRESHOLD
    ).sum(axis=1)
    frame["transition_score"] = frame[SIGNAL_COLUMNS].clip(upper=5).sum(axis=1)
    frame["candidate_raw"] = frame["active_signal_groups"] >= 2
    return frame


def persistence_distance(game: pd.DataFrame, index: int, window: int) -> float:
    position = game.index.get_loc(index)
    before = game.iloc[max(0, position - window):position]
    after = game.iloc[position:min(len(game), position + window)]
    if before.empty or after.empty:
        return 0.0
    distances: list[float] = []
    for feature in [
        "legalMoveCount", "capture_ratio", "reserve_total",
        "front_rate", "front_seeds",
    ]:
        scale = game[feature].std(ddof=0)
        if scale and not np.isnan(scale):
            distances.append(abs(after[feature].mean() - before[feature].mean()) / scale)
    return float(np.mean(distances)) if distances else 0.0


def add_persistence(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    frame["persistence_3"] = 0.0
    frame["persistence_5"] = 0.0
    for _, game in frame.groupby("gameId"):
        for index in game.index[game["candidate_raw"]]:
            frame.loc[index, "persistence_3"] = persistence_distance(game, index, 3)
            frame.loc[index, "persistence_5"] = persistence_distance(game, index, 5)
    frame["candidate_persistent"] = (
        frame["candidate_raw"] & (frame["persistence_3"] >= PERSISTENCE_THRESHOLD)
    )

    formal_plies = {
        game_id: game.loc[game[FORMAL_COLUMNS].any(axis=1), "ply"].to_numpy()
        for game_id, game in frame.groupby("gameId")
    }
    frame["nearest_formal_distance"] = frame.apply(
        lambda row: float(np.min(np.abs(formal_plies[row["gameId"]] - row["ply"])))
        if len(formal_plies[row["gameId"]]) else np.nan,
        axis=1,
    )
    return frame


def metrics(frame: pd.DataFrame, label: str) -> dict:
    candidates = frame[frame["candidate_persistent"]]
    game_count = frame["gameId"].nunique()
    return {
        "sample": label,
        "games": game_count,
        "observations": len(frame),
        "candidateCount": len(candidates),
        "gamesWithCandidates": candidates["gameId"].nunique(),
        "candidatesPerGame": len(candidates) / max(game_count, 1),
        "medianScore": candidates["transition_score"].median(),
        "medianFormalDistance": candidates["nearest_formal_distance"].median(),
    }


def analyze(input_dir: Path, output_dir: Path) -> dict:
    frame, games, manifest = load_artifacts(input_dir)
    frame = add_persistence(add_candidate_scores(add_formal_events(prepare_features(frame))))
    candidates = frame[frame["candidate_persistent"]].copy()

    early_game_ids = set(
        games.loc[games["plies"] <= EARLY_TERMINAL_MAX_PLY, "gameId"]
    )
    expected_early = manifest["openingQuality"]["acceptedEarlyTerminalCount"]
    if len(early_game_ids) != expected_early:
        raise ValueError(
            f"Early-terminal count mismatch: {len(early_game_ids)} != {expected_early}"
        )

    summary = {
        "studyVersion": STUDY_VERSION,
        "configHash": manifest["configHash"],
        "thresholds": {
            "signal": SIGNAL_THRESHOLD,
            "persistence": PERSISTENCE_THRESHOLD,
            "earlyTerminalMaxPly": EARLY_TERMINAL_MAX_PLY,
        },
        "formalEventCounts": {
            column: int(frame[column].sum()) for column in FORMAL_COLUMNS
        },
        "earlyTerminalGameIds": sorted(early_game_ids),
        "samples": [
            metrics(frame, "all_100"),
            metrics(frame[~frame["gameId"].isin(early_game_ids)], "exclude_early_terminal"),
        ],
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    candidate_columns = [
        "gameId", "ply", "normalized_ply", "phase", "transition_score",
        "active_signal_groups", "persistence_3", "persistence_5",
        "nearest_formal_distance", *SIGNAL_COLUMNS,
    ]
    candidates[candidate_columns].to_csv(
        output_dir / "transition-candidates.csv", index=False
    )
    (output_dir / "analysis-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input", type=Path,
        default=Path("artifacts/phase-transition/pilot-v2"),
    )
    parser.add_argument(
        "--output", type=Path,
        default=Path("artifacts/local/phase-transition-analysis"),
    )
    args = parser.parse_args()
    summary = analyze(args.input, args.output)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
