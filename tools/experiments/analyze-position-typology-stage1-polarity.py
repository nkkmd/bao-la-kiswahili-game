#!/usr/bin/env python3
"""Stage 1 exploratory polarity / discreteness audit for Bao position typology.

This audit asks whether the robust mtaji k=2 split is better interpreted as:
1) two discrete intrinsic board morphologies, or
2) the two orientations of one continuous actor/opponent structural-polarity axis.

Exploratory only. It does not name position types or select a final cluster count.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from scipy.stats import gaussian_kde, spearmanr
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, silhouette_score
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_STABILITY = "artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/candidate-stability.json"
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1"
RANDOM_STATE = 20260809

COMMON_FIELDS = [
    "nyumbaSeeds", "frontSeeds", "backSeeds", "frontOccupied", "backOccupied",
    "reusablePits", "frontConnections", "legalMoveCount", "captureMoveCount",
    "maxPitSeeds", "pitSeedVariance", "seedConcentration", "maxCapturableSeeds",
    "meanCapturableSeeds", "maxCaptureEvents", "meanCaptureEvents",
    "maxRelayEvents", "meanRelayEvents", "maxChainEvents",
]
LOG_FIELDS = {
    "nyumbaSeeds", "maxPitSeeds", "pitSeedVariance", "seedConcentration",
    "maxCapturableSeeds", "meanCapturableSeeds", "maxCaptureEvents",
    "meanCaptureEvents", "maxRelayEvents", "meanRelayEvents", "maxChainEvents",
}
BINARY_FIELDS = ["forcedCapture"]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--stability", default=DEFAULT_STABILITY)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--cap-per-game-phase", type=int, default=20)
    parser.add_argument("--invariant-k-min", type=int, default=2)
    parser.add_argument("--invariant-k-max", type=int, default=8)
    parser.add_argument("--kde-grid", type=int, default=512)
    return parser.parse_args()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with tmp.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    tmp.replace(path)


def sha_order(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def balanced_capped(frame: pd.DataFrame, cap: int) -> pd.DataFrame:
    pieces = []
    for _, group in frame.groupby("gameId", sort=True):
        if len(group) <= cap:
            pieces.append(group)
        else:
            ranked = group.assign(_rank_key=group["ruleStateKey"].map(sha_order)).sort_values("_rank_key")
            pieces.append(ranked.head(cap).drop(columns=["_rank_key"]))
    return pd.concat(pieces, axis=0).sort_index()


def transformed_side(frame: pd.DataFrame, side: str, field: str) -> np.ndarray:
    values = frame[f"{side}.{field}"].astype(float).to_numpy()
    if field in LOG_FIELDS:
        if np.any(values < 0):
            raise ValueError(f"negative value in log field: {side}.{field}")
        values = np.log1p(values)
    return values


def fit_s_pruned_mtaji(frame: pd.DataFrame):
    continuous_names = []
    continuous_arrays = []
    for side in ["actor", "opponent"]:
        for field in COMMON_FIELDS:
            continuous_names.append(f"{side}.{field}")
            continuous_arrays.append(transformed_side(frame, side, field))
    scaler = StandardScaler().fit(np.column_stack(continuous_arrays))
    continuous = scaler.transform(np.column_stack(continuous_arrays))
    binary_names = ["actor.forcedCapture", "opponent.forcedCapture"]
    binary = frame[binary_names].astype(float).to_numpy()
    matrix = np.column_stack([continuous, binary])
    return matrix, continuous_names + binary_names, {
        "continuousNames": continuous_names,
        "binaryNames": binary_names,
        "scaler": scaler,
    }


def apply_s_pruned_mtaji(frame: pd.DataFrame, transformer):
    arrays = []
    for column in transformer["continuousNames"]:
        side, field = column.split(".", 1)
        arrays.append(transformed_side(frame, side, field))
    continuous = transformer["scaler"].transform(np.column_stack(arrays))
    binary = frame[transformer["binaryNames"]].astype(float).to_numpy()
    return np.column_stack([continuous, binary])


def role_swapped_frame(frame: pd.DataFrame) -> pd.DataFrame:
    swapped = frame.copy()
    actor_columns = [column for column in frame.columns if column.startswith("actor.")]
    for actor_column in actor_columns:
        suffix = actor_column[len("actor."):]
        opponent_column = f"opponent.{suffix}"
        if opponent_column in frame.columns:
            swapped[actor_column] = frame[opponent_column].to_numpy()
            swapped[opponent_column] = frame[actor_column].to_numpy()
    return swapped


def axis_projection(matrix: np.ndarray, centers: np.ndarray):
    axis = centers[1] - centers[0]
    norm = np.linalg.norm(axis)
    if norm == 0:
        raise RuntimeError("k=2 centroid axis has zero norm")
    unit = axis / norm
    midpoint = (centers[0] + centers[1]) / 2
    return (matrix - midpoint) @ unit, unit, midpoint


def quantiles(values):
    arr = np.asarray(values, dtype=float)
    return {
        "count": int(len(arr)),
        "min": float(np.min(arr)),
        "p10": float(np.quantile(arr, 0.10)),
        "p25": float(np.quantile(arr, 0.25)),
        "median": float(np.median(arr)),
        "p75": float(np.quantile(arr, 0.75)),
        "p90": float(np.quantile(arr, 0.90)),
        "max": float(np.max(arr)),
    }


def gmm_axis_bic(values):
    x = np.asarray(values, dtype=float).reshape(-1, 1)
    out = {}
    for components in [1, 2, 3]:
        model = GaussianMixture(
            n_components=components,
            covariance_type="full",
            n_init=20,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        ).fit(x)
        out[str(components)] = {
            "aic": float(model.aic(x)),
            "bic": float(model.bic(x)),
            "weights": [float(v) for v in model.weights_],
            "means": [float(v) for v in model.means_.ravel()],
            "stddev": [float(np.sqrt(v)) for v in model.covariances_.reshape(-1)],
        }
    return out


def kde_shape(values, grid_points):
    values = np.asarray(values, dtype=float)
    lo, hi = np.quantile(values, [0.005, 0.995])
    grid = np.linspace(lo, hi, grid_points)
    density = gaussian_kde(values)(grid)
    peaks, _ = find_peaks(density)
    ranked = sorted(peaks, key=lambda i: density[i], reverse=True)
    top = ranked[:5]
    result = {
        "gridRange": [float(lo), float(hi)],
        "peakCount": int(len(peaks)),
        "topPeaks": [
            {"x": float(grid[i]), "density": float(density[i])}
            for i in top
        ],
    }
    if len(top) >= 2:
        i, j = sorted(top[:2])
        valley_index = i + int(np.argmin(density[i:j + 1]))
        denom = min(density[i], density[j])
        result["twoPeakValley"] = {
            "leftPeakX": float(grid[i]),
            "rightPeakX": float(grid[j]),
            "valleyX": float(grid[valley_index]),
            "valleyToLowerPeakDensityRatio": float(density[valley_index] / denom) if denom > 0 else None,
        }
    else:
        result["twoPeakValley"] = None
    return result


def invariant_representation(frame: pd.DataFrame):
    names = []
    arrays = []
    for field in COMMON_FIELDS:
        actor = transformed_side(frame, "actor", field)
        opponent = transformed_side(frame, "opponent", field)
        names += [f"total.{field}", f"absDifference.{field}"]
        arrays += [actor + opponent, np.abs(actor - opponent)]
    for field in BINARY_FIELDS:
        actor = frame[f"actor.{field}"].astype(float).to_numpy()
        opponent = frame[f"opponent.{field}"].astype(float).to_numpy()
        names += [f"total.{field}", f"absDifference.{field}"]
        arrays += [actor + opponent, np.abs(actor - opponent)]
    raw = np.column_stack(arrays)
    matrix = StandardScaler().fit_transform(raw)
    return matrix, names


def cluster_metrics(matrix, labels, conditions):
    counts = Counter(int(x) for x in labels)
    total = len(labels)
    return {
        "silhouette": float(
            silhouette_score(
                matrix,
                labels,
                sample_size=min(600, len(labels)),
                random_state=RANDOM_STATE,
            )
        ),
        "conditionNMI": float(normalized_mutual_info_score(conditions, labels)),
        "clusterFractions": {
            str(k): float(v / total) for k, v in sorted(counts.items())
        },
    }


def invariant_grid(frame: pd.DataFrame, k_min: int, k_max: int):
    matrix, columns = invariant_representation(frame)
    conditions = frame["conditionId"].astype(str).to_numpy()
    results = {
        "rows": int(len(frame)),
        "dimensions": int(matrix.shape[1]),
        "columns": columns,
        "solutions": [],
        "methodAgreementARI": [],
    }
    for k in range(k_min, k_max + 1):
        labels = {}
        km = KMeans(n_clusters=k, n_init=30, random_state=RANDOM_STATE)
        labels["kmeans"] = km.fit_predict(matrix)
        gm = GaussianMixture(
            n_components=k,
            covariance_type="diag",
            n_init=8,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        )
        labels["gmm-diag"] = gm.fit_predict(matrix)
        wa = AgglomerativeClustering(n_clusters=k, linkage="ward")
        labels["ward"] = wa.fit_predict(matrix)
        for method in ["kmeans", "gmm-diag", "ward"]:
            results["solutions"].append({
                "k": int(k),
                "method": method,
                **cluster_metrics(matrix, labels[method], conditions),
            })
        for left, right in [
            ("kmeans", "gmm-diag"),
            ("kmeans", "ward"),
            ("gmm-diag", "ward"),
        ]:
            results["methodAgreementARI"].append({
                "k": int(k),
                "left": left,
                "right": right,
                "adjustedRandIndex": float(adjusted_rand_score(labels[left], labels[right])),
            })
    return results


def consecutive_transition_audit(full_frame: pd.DataFrame, labels: np.ndarray):
    work = full_frame[["gameId", "ply", "player", "ruleStateKey"]].copy()
    work["cluster"] = labels
    pairs = []
    for _, group in work.sort_values(["gameId", "ply"]).groupby("gameId", sort=True):
        rows = group.to_dict("records")
        for left, right in zip(rows, rows[1:]):
            if int(right["ply"]) - int(left["ply"]) == 1:
                pairs.append((left, right))
    if not pairs:
        return {"pairCount": 0}
    flips = [int(a["cluster"] != b["cluster"]) for a, b in pairs]
    player_flips = [int(a["player"] != b["player"]) for a, b in pairs]
    return {
        "pairCount": int(len(pairs)),
        "clusterFlipRate": float(np.mean(flips)),
        "playerFlipRate": float(np.mean(player_flips)),
        "clusterFlipGivenPlayerFlipRate": float(
            np.mean([flip for flip, pf in zip(flips, player_flips) if pf])
        ) if any(player_flips) else None,
    }


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    stability_path = Path(options.stability).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads((input_dir / "feature-audit.json").read_text(encoding="utf-8"))
    stability = json.loads(stability_path.read_text(encoding="utf-8"))

    if feature_audit.get("formalExperiment") is not False or feature_audit.get("exploratory") is not True:
        raise RuntimeError("feature-audit boundary mismatch")
    if stability.get("formalExperiment") is not False or stability.get("finalClusterCountSelected") is not False:
        raise RuntimeError("stability boundary mismatch")
    if stability.get("sourceFeatureAuditHash") != feature_audit.get("auditHash"):
        raise RuntimeError("feature-audit hash mismatch")

    frame = pd.read_csv(input_dir / "eligible-primary-rule-state.csv")
    mtaji = frame[frame["phase"] == "mtaji"].copy()
    capped = balanced_capped(mtaji, options.cap_per_game_phase)

    capped_matrix, columns, transformer = fit_s_pruned_mtaji(capped)
    model = KMeans(n_clusters=2, n_init=50, random_state=RANDOM_STATE).fit(capped_matrix)
    capped_labels = model.labels_
    capped_projection, axis, midpoint = axis_projection(capped_matrix, model.cluster_centers_)

    swapped = role_swapped_frame(capped)
    swapped_matrix = apply_s_pruned_mtaji(swapped, transformer)
    swapped_labels = model.predict(swapped_matrix)
    swapped_projection = (swapped_matrix - midpoint) @ axis

    full_matrix = apply_s_pruned_mtaji(mtaji, transformer)
    full_labels = model.predict(full_matrix)

    distances = model.transform(capped_matrix)
    ordered = np.sort(distances, axis=1)
    margins = ordered[:, 1] - ordered[:, 0]

    projection_std = np.std(capped_projection)
    projection_mean = np.mean(capped_projection)
    projection_z = (
        (capped_projection - projection_mean) / projection_std
        if projection_std > 0 else capped_projection
    )
    swapped_z = (
        (swapped_projection - projection_mean) / projection_std
        if projection_std > 0 else swapped_projection
    )
    ply_corr = spearmanr(capped_projection, capped["ply"].astype(float).to_numpy())

    report = {
        "schemaVersion": 1,
        "status": "stage1-mtaji-polarity-discreteness-audit-complete",
        "formalExperiment": False,
        "exploratory": True,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourceCandidateStabilityHash": stability["auditHash"],
        "environment": {
            "python": sys.version.split()[0],
            "platform": platform.platform(),
        },
        "design": {
            "phase": "mtaji",
            "reference": "S-pruned | game-phase-capped | log1p-standard | K-means k=2",
            "questions": [
                "Does actor/opponent role swap reverse the k=2 assignment?",
                "Is the k=2 split a discrete bimodality or a continuous polarity axis?",
                "Does actor/opponent-invariant morphology retain separate cluster structure?",
            ],
            "capPerGamePhase": options.cap_per_game_phase,
            "invariantKRange": [options.invariant_k_min, options.invariant_k_max],
            "futureHeldOutSeedsTouched": False,
        },
        "referenceK2": {
            "rows": int(len(capped)),
            "dimensions": int(capped_matrix.shape[1]),
            "columns": columns,
            "clusterFractions": {
                str(k): float(v / len(capped_labels))
                for k, v in sorted(Counter(int(x) for x in capped_labels).items())
            },
            "silhouette": float(
                silhouette_score(
                    capped_matrix,
                    capped_labels,
                    sample_size=min(600, len(capped_labels)),
                    random_state=RANDOM_STATE,
                )
            ),
            "axisProjection": {
                "quantiles": quantiles(capped_projection),
                "standardizedQuantiles": quantiles(projection_z),
                "gmm1d": gmm_axis_bic(capped_projection),
                "kde": kde_shape(capped_projection, options.kde_grid),
                "centroidDistanceMargin": quantiles(margins),
                "spearmanWithPlyDescriptiveOnly": {
                    "rho": float(ply_corr.statistic),
                    "pvalue": float(ply_corr.pvalue),
                },
            },
            "roleSwap": {
                "clusterFlipRate": float(np.mean(swapped_labels != capped_labels)),
                "sameClusterRate": float(np.mean(swapped_labels == capped_labels)),
                "projectionCorrelationOriginalVsNegativeSwapped": float(
                    np.corrcoef(capped_projection, -swapped_projection)[0, 1]
                ),
                "standardizedProjectionSumAbs": quantiles(np.abs(projection_z + swapped_z)),
            },
            "consecutiveTrajectory": consecutive_transition_audit(mtaji, full_labels),
        },
        "actorOpponentInvariantMorphology": invariant_grid(
            capped,
            options.invariant_k_min,
            options.invariant_k_max,
        ),
    }

    encoded = json.dumps(
        report,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    report["auditHash"] = hashlib.sha256(encoded).hexdigest()
    atomic_json(output_dir / "mtaji-polarity-audit.json", report)

    print(json.dumps({
        "passed": True,
        "formalExperiment": False,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "output": str(output_dir / "mtaji-polarity-audit.json"),
        "auditHash": report["auditHash"],
    }, indent=2))


if __name__ == "__main__":
    main()
