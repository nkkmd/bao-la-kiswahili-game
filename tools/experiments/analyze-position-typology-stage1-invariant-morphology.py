#!/usr/bin/env python3
"""Stage 1 exploratory audit of the mtaji actor/opponent-invariant morphology k=2 candidate.

This audit does not select a final position-type count or name types.
It tests whether the swap-invariant k=2 structure is stable, persistent,
interpretable, and more than a trivial scalar magnitude split.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from scipy.stats import gaussian_kde
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, silhouette_score
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_POLARITY = "artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json"
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1"
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
ACTIVITY_FIELDS = {
    "captureMoveCount", "maxCapturableSeeds", "meanCapturableSeeds",
    "maxCaptureEvents", "meanCaptureEvents", "maxRelayEvents",
    "meanRelayEvents", "maxChainEvents",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--polarity", default=DEFAULT_POLARITY)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--cap-per-game-phase", type=int, default=20)
    parser.add_argument("--resample-repetitions", type=int, default=40)
    parser.add_argument("--resample-game-fraction", type=float, default=0.8)
    parser.add_argument("--representatives", type=int, default=5)
    parser.add_argument("--boundary", type=int, default=10)
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


def raw_invariant(frame: pd.DataFrame):
    names = []
    arrays = []
    for field in COMMON_FIELDS:
        actor = transformed_side(frame, "actor", field)
        opponent = transformed_side(frame, "opponent", field)
        names += [f"total.{field}", f"absDifference.{field}"]
        arrays += [actor + opponent, np.abs(actor - opponent)]
    actor = frame["actor.forcedCapture"].astype(float).to_numpy()
    opponent = frame["opponent.forcedCapture"].astype(float).to_numpy()
    names += ["total.forcedCapture", "absDifference.forcedCapture"]
    arrays += [actor + opponent, np.abs(actor - opponent)]
    return np.column_stack(arrays), names


def fit_invariant(frame: pd.DataFrame):
    raw, names = raw_invariant(frame)
    scaler = StandardScaler().fit(raw)
    return scaler.transform(raw), names, scaler


def apply_invariant(frame: pd.DataFrame, scaler: StandardScaler):
    raw, _ = raw_invariant(frame)
    return scaler.transform(raw)


def fit_model(method: str, matrix: np.ndarray, k: int, random_state: int = RANDOM_STATE):
    if method == "kmeans":
        model = KMeans(n_clusters=k, n_init=50, random_state=random_state)
        labels = model.fit_predict(matrix)
    elif method == "gmm-diag":
        model = GaussianMixture(
            n_components=k,
            covariance_type="diag",
            n_init=10,
            reg_covar=1e-6,
            random_state=random_state,
        )
        labels = model.fit_predict(matrix)
    elif method == "ward":
        model = AgglomerativeClustering(n_clusters=k, linkage="ward")
        labels = model.fit_predict(matrix)
    else:
        raise ValueError(method)
    return model, labels


def predict_model(method: str, model, matrix: np.ndarray):
    if method in {"kmeans", "gmm-diag"}:
        return model.predict(matrix)
    raise ValueError(f"{method} has no out-of-sample predict")


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


def axis_projection(matrix: np.ndarray, centers: np.ndarray):
    axis = centers[1] - centers[0]
    norm = np.linalg.norm(axis)
    if norm == 0:
        raise RuntimeError("zero centroid-axis norm")
    unit = axis / norm
    midpoint = (centers[0] + centers[1]) / 2
    return (matrix - midpoint) @ unit


def gmm_axis(values):
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
        "topPeaks": [{"x": float(grid[i]), "density": float(density[i])} for i in top],
        "twoPeakValley": None,
    }
    if len(top) >= 2:
        left, right = sorted(top[:2])
        valley = left + int(np.argmin(density[left:right + 1]))
        denom = min(density[left], density[right])
        result["twoPeakValley"] = {
            "leftPeakX": float(grid[left]),
            "rightPeakX": float(grid[right]),
            "valleyX": float(grid[valley]),
            "valleyToLowerPeakDensityRatio": float(density[valley] / denom) if denom > 0 else None,
        }
    return result


def row_snapshot(row):
    return {
        "ruleStateKey": str(row["ruleStateKey"]),
        "gameId": str(row["gameId"]),
        "conditionId": str(row["conditionId"]),
        "ply": int(row["ply"]),
        "turn": int(row["turn"]),
        "player": int(row["player"]),
        "pits": {
            "actor": {
                "front": [int(row[f"pit.actor.front.{i}"]) for i in range(8)],
                "back": [int(row[f"pit.actor.back.{i}"]) for i in range(8)],
            },
            "opponent": {
                "front": [int(row[f"pit.opponent.front.{i}"]) for i in range(8)],
                "back": [int(row[f"pit.opponent.back.{i}"]) for i in range(8)],
            },
        },
    }


def cluster_interpretability(frame, matrix, names, model, labels, representatives, boundary):
    overall = matrix.mean(axis=0)
    sd = matrix.std(axis=0)
    sd[sd == 0] = 1.0
    distances = model.transform(matrix)
    result = {"clusters": {}, "boundaryPositions": []}
    for cluster in sorted(set(int(x) for x in labels)):
        idx = np.where(labels == cluster)[0]
        effect = (matrix[idx].mean(axis=0) - overall) / sd
        order = np.argsort(-np.abs(effect))[:14]
        nearest = idx[np.argsort(distances[idx, cluster])[:representatives]]
        sub = frame.iloc[idx]
        result["clusters"][str(cluster)] = {
            "count": int(len(idx)),
            "fraction": float(len(idx) / len(frame)),
            "ply": quantiles(sub["ply"].astype(float).to_numpy()),
            "conditionCounts": {
                str(k): int(v) for k, v in sub["conditionId"].value_counts().sort_index().items()
            },
            "topProfileEffects": [
                {"feature": names[int(j)], "standardizedMeanEffect": float(effect[int(j)])}
                for j in order
            ],
            "representatives": [row_snapshot(frame.iloc[int(j)]) for j in nearest],
        }
    sorted_dist = np.sort(distances, axis=1)
    margin = sorted_dist[:, 1] - sorted_dist[:, 0]
    for j in np.argsort(margin)[:boundary]:
        item = row_snapshot(frame.iloc[int(j)])
        item["assignedCluster"] = int(labels[int(j)])
        item["centroidDistanceMargin"] = float(margin[int(j)])
        result["boundaryPositions"].append(item)
    return result


def cross_view(full: pd.DataFrame, capped: pd.DataFrame):
    output = {}
    cache = {}
    for view, frame in [("full", full), ("capped", capped)]:
        matrix, names, scaler = fit_invariant(frame)
        labels = {}
        models = {}
        for method in ["kmeans", "gmm-diag", "ward"]:
            models[method], labels[method] = fit_model(method, matrix, 2)
        cache[view] = (frame, matrix, names, scaler, models, labels)
    full_frame, _, _, _, _, full_labels = cache["full"]
    capped_frame, _, _, _, _, capped_labels = cache["capped"]
    pos = {index: i for i, index in enumerate(full_frame.index)}
    for method in ["kmeans", "gmm-diag", "ward"]:
        full_on_capped = np.array([full_labels[method][pos[index]] for index in capped_frame.index])
        output[method] = float(adjusted_rand_score(full_on_capped, capped_labels[method]))
    return output, cache


def trajectory_resampling(frame, repetitions, game_fraction, method):
    reference_matrix, _, _ = fit_invariant(frame)
    _, reference_labels = fit_model(method, reference_matrix, 2)
    games = np.array(sorted(frame["gameId"].unique()))
    take = max(2, int(math.ceil(len(games) * game_fraction)))
    rng = np.random.default_rng(RANDOM_STATE + (0 if method == "kmeans" else 100))
    scores = []
    for repeat in range(repetitions):
        selected = set(rng.choice(games, size=take, replace=False).tolist())
        train = frame[frame["gameId"].isin(selected)]
        train_matrix, _, scaler = fit_invariant(train)
        model, _ = fit_model(method, train_matrix, 2, RANDOM_STATE + repeat + 1)
        predicted = predict_model(method, model, apply_invariant(frame, scaler))
        scores.append(float(adjusted_rand_score(reference_labels, predicted)))
    return quantiles(scores)


def consecutive_audit(full: pd.DataFrame, labels: np.ndarray):
    work = full[["gameId", "ply", "player", "ruleStateKey"]].copy()
    work["cluster"] = labels
    pair_count = 0
    same = 0
    flips = 0
    transition = Counter()
    runs = []
    for _, group in work.sort_values(["gameId", "ply"]).groupby("gameId", sort=True):
        rows = group.to_dict("records")
        current_cluster = None
        current_length = 0
        prev = None
        for row in rows:
            consecutive = prev is not None and int(row["ply"]) - int(prev["ply"]) == 1
            if consecutive:
                pair_count += 1
                a, b = int(prev["cluster"]), int(row["cluster"])
                transition[(a, b)] += 1
                if a == b:
                    same += 1
                else:
                    flips += 1
            else:
                if current_length:
                    runs.append(current_length)
                current_cluster = None
                current_length = 0
            cluster = int(row["cluster"])
            if current_cluster is None:
                current_cluster = cluster
                current_length = 1
            elif cluster == current_cluster and consecutive:
                current_length += 1
            else:
                if current_length:
                    runs.append(current_length)
                current_cluster = cluster
                current_length = 1
            prev = row
        if current_length:
            runs.append(current_length)
    return {
        "pairCount": int(pair_count),
        "sameClusterRate": float(same / pair_count) if pair_count else None,
        "clusterFlipRate": float(flips / pair_count) if pair_count else None,
        "transitionCounts": {f"{a}->{b}": int(v) for (a, b), v in sorted(transition.items())},
        "runLengthObservations": quantiles(runs) if runs else None,
    }


def scalar_explanation(matrix, names, labels):
    abs_idx = [i for i, name in enumerate(names) if name.startswith("absDifference.")]
    activity_idx = [
        i for i, name in enumerate(names)
        if name.startswith("total.") and name.split(".", 1)[1] in ACTIVITY_FIELDS
    ]
    imbalance = np.sqrt(np.mean(np.square(matrix[:, abs_idx]), axis=1))
    activity = np.sqrt(np.mean(np.square(matrix[:, activity_idx]), axis=1))
    output = {}
    for name, values in [("imbalanceMagnitude", imbalance), ("activityMagnitude", activity)]:
        one_d = values.reshape(-1, 1)
        scalar_labels = KMeans(n_clusters=2, n_init=50, random_state=RANDOM_STATE).fit_predict(one_d)
        output[name] = {
            "quantiles": quantiles(values),
            "ariWithInvariantK2": float(adjusted_rand_score(labels, scalar_labels)),
            "clusterQuantiles": {
                str(cluster): quantiles(values[labels == cluster])
                for cluster in sorted(set(int(x) for x in labels))
            },
        }
    return output


def s_pruned_reference(frame: pd.DataFrame):
    arrays = []
    for side in ["actor", "opponent"]:
        for field in COMMON_FIELDS:
            arrays.append(transformed_side(frame, side, field))
    raw = np.column_stack(arrays)
    scaler = StandardScaler().fit(raw)
    cont = scaler.transform(raw)
    binary = frame[["actor.forcedCapture", "opponent.forcedCapture"]].astype(float).to_numpy()
    matrix = np.column_stack([cont, binary])
    labels = KMeans(n_clusters=2, n_init=50, random_state=RANDOM_STATE).fit_predict(matrix)
    return labels


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    polarity_path = Path(options.polarity).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads((input_dir / "feature-audit.json").read_text(encoding="utf-8"))
    polarity = json.loads(polarity_path.read_text(encoding="utf-8"))
    if feature_audit.get("formalExperiment") is not False or feature_audit.get("exploratory") is not True:
        raise RuntimeError("feature-audit boundary mismatch")
    if polarity.get("formalExperiment") is not False or polarity.get("finalClusterCountSelected") is not False:
        raise RuntimeError("polarity-audit boundary mismatch")
    if polarity.get("sourceFeatureAuditHash") != feature_audit.get("auditHash"):
        raise RuntimeError("feature-audit hash mismatch")

    frame = pd.read_csv(input_dir / "eligible-primary-rule-state.csv")
    mtaji = frame[frame["phase"] == "mtaji"].copy()
    capped = balanced_capped(mtaji, options.cap_per_game_phase)

    cross_view_ari, cache = cross_view(mtaji, capped)
    capped_frame, capped_matrix, names, scaler, capped_models, capped_labels = cache["capped"]
    km_model = capped_models["kmeans"]
    km_labels = capped_labels["kmeans"]

    method_agreement = []
    for left, right in [("kmeans", "gmm-diag"), ("kmeans", "ward"), ("gmm-diag", "ward")]:
        method_agreement.append({
            "left": left,
            "right": right,
            "adjustedRandIndex": float(adjusted_rand_score(capped_labels[left], capped_labels[right])),
        })

    swapped = capped.copy()
    for field in COMMON_FIELDS + ["forcedCapture"]:
        a = f"actor.{field}"
        o = f"opponent.{field}"
        swapped[a] = capped[o].to_numpy()
        swapped[o] = capped[a].to_numpy()
    swapped_matrix = apply_invariant(swapped, scaler)
    role_swap_max_abs = float(np.max(np.abs(capped_matrix - swapped_matrix)))

    full_matrix = apply_invariant(mtaji, scaler)
    full_labels = km_model.predict(full_matrix)

    projection = axis_projection(capped_matrix, km_model.cluster_centers_)
    projection_std = float(np.std(projection))
    projection_z = (projection - float(np.mean(projection))) / projection_std if projection_std > 0 else projection

    reference_labels = s_pruned_reference(capped)
    relation_to_polarity = {
        "ariWithReferenceRelationalPolarityK2": float(adjusted_rand_score(reference_labels, km_labels)),
        "nmiWithReferenceRelationalPolarityK2": float(normalized_mutual_info_score(reference_labels, km_labels)),
    }

    report = {
        "schemaVersion": 1,
        "status": "stage1-mtaji-invariant-morphology-audit-complete",
        "formalExperiment": False,
        "exploratory": True,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourcePolarityAuditHash": polarity["auditHash"],
        "environment": {
            "python": sys.version.split()[0],
            "platform": platform.platform(),
        },
        "design": {
            "phase": "mtaji",
            "reference": "actor/opponent-invariant morphology | game-phase-capped | log1p-derived primitives | standardized | K-means k=2",
            "capPerGamePhase": options.cap_per_game_phase,
            "resampleRepetitions": options.resample_repetitions,
            "resampleGameFraction": options.resample_game_fraction,
            "futureHeldOutSeedsTouched": False,
        },
        "population": {
            "fullRows": int(len(mtaji)),
            "cappedRows": int(len(capped)),
            "games": int(mtaji["gameId"].nunique()),
        },
        "referenceK2": {
            "clusterFractions": {
                str(k): float(v / len(km_labels))
                for k, v in sorted(Counter(int(x) for x in km_labels).items())
            },
            "silhouette": float(silhouette_score(
                capped_matrix, km_labels, sample_size=min(600, len(km_labels)), random_state=RANDOM_STATE
            )),
            "conditionNMI": float(normalized_mutual_info_score(capped["conditionId"].astype(str), km_labels)),
            "methodAgreementARI": method_agreement,
            "crossViewARI": cross_view_ari,
            "trajectoryResampling": {
                method: trajectory_resampling(
                    capped, options.resample_repetitions, options.resample_game_fraction, method
                )
                for method in ["kmeans", "gmm-diag"]
            },
            "roleSwapInvariantMaxAbsMatrixDifference": role_swap_max_abs,
            "relationToReferenceRelationalPolarity": relation_to_polarity,
            "consecutiveTrajectory": consecutive_audit(mtaji, full_labels),
            "scalarExplanation": scalar_explanation(capped_matrix, names, km_labels),
            "axisProjection": {
                "quantiles": quantiles(projection),
                "standardizedQuantiles": quantiles(projection_z),
                "gmm1d": gmm_axis(projection),
                "kde": kde_shape(projection, options.kde_grid),
            },
            "interpretability": cluster_interpretability(
                capped, capped_matrix, names, km_model, km_labels,
                options.representatives, options.boundary
            ),
        },
    }

    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    report["auditHash"] = hashlib.sha256(encoded).hexdigest()
    atomic_json(output_dir / "mtaji-invariant-morphology-audit.json", report)
    print(json.dumps({
        "passed": True,
        "formalExperiment": False,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "output": str(output_dir / "mtaji-invariant-morphology-audit.json"),
        "auditHash": report["auditHash"],
    }, indent=2))


if __name__ == "__main__":
    main()
