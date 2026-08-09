#!/usr/bin/env python3
"""Stage 1 exploratory stability / representation / interpretability audit.

This script does not select a final cluster count or name position types.
It probes only the candidates defined after the first clustering diagnostic.
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
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, silhouette_score
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_DIAGNOSTIC = "artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1/clustering-diagnostic.json"
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1"
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
PIT_COLUMNS = [
    f"pit.{side}.{row}.{index}"
    for side in ["actor", "opponent"]
    for row in ["front", "back"]
    for index in range(8)
]
CANDIDATES = {
    "mtaji": [2, 6],
    "namua": [2, 4],
}
METHODS = ["kmeans", "gmm-diag", "ward"]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--diagnostic", default=DEFAULT_DIAGNOSTIC)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--cap-per-game-phase", type=int, default=20)
    parser.add_argument("--resample-repetitions", type=int, default=40)
    parser.add_argument("--resample-game-fraction", type=float, default=0.8)
    parser.add_argument("--representatives", type=int, default=5)
    parser.add_argument("--boundary", type=int, default=10)
    return parser.parse_args()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with tmp.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    tmp.replace(path)


def atomic_csv(path: Path, frame: pd.DataFrame):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    frame.to_csv(tmp, index=False)
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


def side_log_values(frame: pd.DataFrame, column: str, preprocessing: str) -> np.ndarray:
    values = frame[column].astype(float).to_numpy()
    field = column.split(".", 1)[-1]
    if preprocessing == "log1p-standard" and field in LOG_FIELDS:
        if np.any(values < 0):
            raise ValueError(f"negative value in log field: {column}")
        values = np.log1p(values)
    return values


def fit_transform_s(frame: pd.DataFrame, phase: str, preprocessing: str, include_mtaji_house: bool = False):
    continuous_names = []
    continuous_arrays = []
    binary_names = ["actor.forcedCapture", "opponent.forcedCapture"]

    for side in ["actor", "opponent"]:
        for field in COMMON_FIELDS:
            column = f"{side}.{field}"
            continuous_names.append(column)
            continuous_arrays.append(side_log_values(frame, column, preprocessing))

    if phase == "namua":
        continuous_names += ["reserveTotal", "reserveDifference"]
        continuous_arrays += [
            (frame["actor.reserve"] + frame["opponent.reserve"]).astype(float).to_numpy(),
            (frame["actor.reserve"] - frame["opponent.reserve"]).astype(float).to_numpy(),
        ]
        binary_names += ["actor.houseOwned", "opponent.houseOwned"]
    elif include_mtaji_house:
        binary_names += ["actor.houseOwned", "opponent.houseOwned"]

    continuous_raw = np.column_stack(continuous_arrays)
    scaler = StandardScaler().fit(continuous_raw)
    continuous_scaled = scaler.transform(continuous_raw)
    binary = frame[binary_names].astype(float).to_numpy()
    matrix = np.column_stack([continuous_scaled, binary])
    return matrix, continuous_names + binary_names, {
        "kind": "S-house" if include_mtaji_house else "S-pruned",
        "phase": phase,
        "preprocessing": preprocessing,
        "continuousNames": continuous_names,
        "binaryNames": binary_names,
        "scaler": scaler,
    }


def apply_s(frame: pd.DataFrame, transformer):
    phase = transformer["phase"]
    preprocessing = transformer["preprocessing"]
    arrays = []
    for column in transformer["continuousNames"]:
        if column == "reserveTotal":
            arrays.append((frame["actor.reserve"] + frame["opponent.reserve"]).astype(float).to_numpy())
        elif column == "reserveDifference":
            arrays.append((frame["actor.reserve"] - frame["opponent.reserve"]).astype(float).to_numpy())
        else:
            arrays.append(side_log_values(frame, column, preprocessing))
    continuous = transformer["scaler"].transform(np.column_stack(arrays))
    binary = frame[transformer["binaryNames"]].astype(float).to_numpy()
    return np.column_stack([continuous, binary])


def fit_transform_c(frame: pd.DataFrame, phase: str, preprocessing: str):
    names = []
    arrays = []
    for field in COMMON_FIELDS:
        actor = side_log_values(frame, f"actor.{field}", preprocessing)
        opponent = side_log_values(frame, f"opponent.{field}", preprocessing)
        names += [f"total.{field}", f"difference.{field}"]
        arrays += [actor + opponent, actor - opponent]

    for field in ["forcedCapture"]:
        actor = frame[f"actor.{field}"].astype(float).to_numpy()
        opponent = frame[f"opponent.{field}"].astype(float).to_numpy()
        names += [f"total.{field}", f"difference.{field}"]
        arrays += [actor + opponent, actor - opponent]

    if phase == "namua":
        actor = frame["actor.reserve"].astype(float).to_numpy()
        opponent = frame["opponent.reserve"].astype(float).to_numpy()
        names += ["total.reserve", "difference.reserve"]
        arrays += [actor + opponent, actor - opponent]
        actor = frame["actor.houseOwned"].astype(float).to_numpy()
        opponent = frame["opponent.houseOwned"].astype(float).to_numpy()
        names += ["total.houseOwned", "difference.houseOwned"]
        arrays += [actor + opponent, actor - opponent]

    raw = np.column_stack(arrays)
    scaler = StandardScaler().fit(raw)
    return scaler.transform(raw), names, {
        "kind": "C-level-contrast", "phase": phase, "preprocessing": preprocessing,
        "names": names, "scaler": scaler,
    }


def apply_c(frame: pd.DataFrame, transformer):
    arrays = []
    phase = transformer["phase"]
    preprocessing = transformer["preprocessing"]
    for field in COMMON_FIELDS:
        actor = side_log_values(frame, f"actor.{field}", preprocessing)
        opponent = side_log_values(frame, f"opponent.{field}", preprocessing)
        arrays += [actor + opponent, actor - opponent]
    actor = frame["actor.forcedCapture"].astype(float).to_numpy()
    opponent = frame["opponent.forcedCapture"].astype(float).to_numpy()
    arrays += [actor + opponent, actor - opponent]
    if phase == "namua":
        actor = frame["actor.reserve"].astype(float).to_numpy(); opponent = frame["opponent.reserve"].astype(float).to_numpy()
        arrays += [actor + opponent, actor - opponent]
        actor = frame["actor.houseOwned"].astype(float).to_numpy(); opponent = frame["opponent.houseOwned"].astype(float).to_numpy()
        arrays += [actor + opponent, actor - opponent]
    return transformer["scaler"].transform(np.column_stack(arrays))


def fit_transform_p(frame: pd.DataFrame, phase: str, preprocessing: str):
    base, base_names, base_transformer = fit_transform_s(frame, phase, preprocessing)
    pits = frame[PIT_COLUMNS].astype(float).to_numpy()
    if preprocessing == "log1p-standard":
        pits = np.log1p(pits)
    pit_scaler = StandardScaler().fit(pits)
    pit_scaled = pit_scaler.transform(pits)
    return np.column_stack([base, pit_scaled]), base_names + PIT_COLUMNS, {
        "kind": "P-raw-pits", "phase": phase, "preprocessing": preprocessing,
        "baseTransformer": base_transformer, "pitScaler": pit_scaler,
    }


def apply_p(frame: pd.DataFrame, transformer):
    base = apply_s(frame, transformer["baseTransformer"])
    pits = frame[PIT_COLUMNS].astype(float).to_numpy()
    if transformer["preprocessing"] == "log1p-standard":
        pits = np.log1p(pits)
    return np.column_stack([base, transformer["pitScaler"].transform(pits)])


def representation_fit(frame, phase, kind, preprocessing, include_mtaji_house=False):
    if kind == "S-pruned":
        return fit_transform_s(frame, phase, preprocessing, include_mtaji_house)
    if kind == "C-level-contrast":
        return fit_transform_c(frame, phase, preprocessing)
    if kind == "P-raw-pits":
        return fit_transform_p(frame, phase, preprocessing)
    raise ValueError(kind)


def representation_apply(frame, transformer):
    if transformer["kind"] in ["S-pruned", "S-house"]:
        return apply_s(frame, transformer)
    if transformer["kind"] == "C-level-contrast":
        return apply_c(frame, transformer)
    if transformer["kind"] == "P-raw-pits":
        return apply_p(frame, transformer)
    raise ValueError(transformer["kind"])


def fit_model(method, matrix, k, random_state=RANDOM_STATE):
    if method == "kmeans":
        model = KMeans(n_clusters=k, n_init=30, random_state=random_state)
        labels = model.fit_predict(matrix)
    elif method == "gmm-diag":
        model = GaussianMixture(
            n_components=k, covariance_type="diag", n_init=8,
            reg_covar=1e-6, random_state=random_state,
        )
        labels = model.fit_predict(matrix)
    elif method == "ward":
        model = AgglomerativeClustering(n_clusters=k, linkage="ward")
        labels = model.fit_predict(matrix)
    else:
        raise ValueError(method)
    return model, labels


def model_predict(method, model, matrix):
    if method in ["kmeans", "gmm-diag"]:
        return model.predict(matrix)
    raise ValueError("Ward has no out-of-sample predict")


def solution_summary(matrix, labels, conditions):
    counts = Counter(int(x) for x in labels)
    return {
        "silhouette": float(silhouette_score(matrix, labels, sample_size=min(600, len(labels)), random_state=RANDOM_STATE)),
        "conditionNMI": float(normalized_mutual_info_score(conditions, labels)),
        "clusterCounts": {str(k): int(v) for k, v in sorted(counts.items())},
        "clusterFractions": {str(k): float(v / len(labels)) for k, v in sorted(counts.items())},
    }


def method_agreement(labels_by_method):
    out = []
    for left, right in [("kmeans", "gmm-diag"), ("kmeans", "ward"), ("gmm-diag", "ward")]:
        out.append({"left": left, "right": right,
                    "adjustedRandIndex": float(adjusted_rand_score(labels_by_method[left], labels_by_method[right]))})
    return out


def quantiles(values):
    arr = np.asarray(values, dtype=float)
    return {
        "count": int(len(arr)), "min": float(np.min(arr)), "p10": float(np.quantile(arr, 0.10)),
        "median": float(np.median(arr)), "p90": float(np.quantile(arr, 0.90)), "max": float(np.max(arr)),
    }


def trajectory_resampling(frame, phase, k, method, repetitions, game_fraction):
    matrix, _, transformer = representation_fit(frame, phase, "S-pruned", "log1p-standard")
    reference_model, reference_labels = fit_model(method, matrix, k, RANDOM_STATE)
    games = np.array(sorted(frame["gameId"].unique()))
    take = max(2, int(math.ceil(len(games) * game_fraction)))
    rng = np.random.default_rng(RANDOM_STATE + k + (0 if phase == "namua" else 1000) + (0 if method == "kmeans" else 100))
    scores = []
    for repeat in range(repetitions):
        selected = set(rng.choice(games, size=take, replace=False).tolist())
        train = frame[frame["gameId"].isin(selected)]
        train_matrix, _, train_transformer = representation_fit(train, phase, "S-pruned", "log1p-standard")
        model, _ = fit_model(method, train_matrix, k, RANDOM_STATE + repeat + 1)
        all_matrix = representation_apply(frame, train_transformer)
        predicted = model_predict(method, model, all_matrix)
        scores.append(float(adjusted_rand_score(reference_labels, predicted)))
    return quantiles(scores)


def row_snapshot(row):
    pits = {
        "actor": {
            "front": [int(row[f"pit.actor.front.{i}"]) for i in range(8)],
            "back": [int(row[f"pit.actor.back.{i}"]) for i in range(8)],
        },
        "opponent": {
            "front": [int(row[f"pit.opponent.front.{i}"]) for i in range(8)],
            "back": [int(row[f"pit.opponent.back.{i}"]) for i in range(8)],
        },
    }
    return {
        "ruleStateKey": str(row["ruleStateKey"]), "gameId": str(row["gameId"]),
        "conditionId": str(row["conditionId"]), "ply": int(row["ply"]), "turn": int(row["turn"]),
        "player": int(row["player"]), "pits": pits,
    }


def kmeans_interpretability(frame, phase, k, representatives, boundary):
    matrix, columns, _ = representation_fit(frame, phase, "S-pruned", "log1p-standard")
    model, labels = fit_model("kmeans", matrix, k)
    overall_mean = matrix.mean(axis=0)
    overall_std = matrix.std(axis=0)
    overall_std[overall_std == 0] = 1
    distances = model.transform(matrix)
    result = {"clusters": {}, "boundaryPositions": []}
    for cluster in range(k):
        idx = np.where(labels == cluster)[0]
        cluster_mean = matrix[idx].mean(axis=0)
        effect = (cluster_mean - overall_mean) / overall_std
        order = np.argsort(-np.abs(effect))[:12]
        nearest = idx[np.argsort(distances[idx, cluster])[:representatives]]
        cluster_frame = frame.iloc[idx]
        result["clusters"][str(cluster)] = {
            "count": int(len(idx)),
            "fraction": float(len(idx) / len(frame)),
            "medianPlyDescriptiveOnly": float(cluster_frame["ply"].median()),
            "conditionCounts": {str(key): int(value) for key, value in cluster_frame["conditionId"].value_counts().sort_index().items()},
            "topProfileEffects": [
                {"feature": columns[int(j)], "standardizedMeanEffect": float(effect[int(j)])}
                for j in order
            ],
            "representatives": [row_snapshot(frame.iloc[int(j)]) for j in nearest],
        }
    ordered = np.sort(distances, axis=1)
    margin = ordered[:, 1] - ordered[:, 0]
    for j in np.argsort(margin)[:boundary]:
        item = row_snapshot(frame.iloc[int(j)])
        item.update({"assignedCluster": int(labels[int(j)]), "centroidDistanceMargin": float(margin[int(j)])})
        result["boundaryPositions"].append(item)
    return result


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    diagnostic_path = Path(options.diagnostic).resolve()
    output_dir = Path(options.output).resolve()
    feature_audit = json.loads((input_dir / "feature-audit.json").read_text(encoding="utf-8"))
    diagnostic = json.loads(diagnostic_path.read_text(encoding="utf-8"))
    if feature_audit.get("formalExperiment") is not False or feature_audit.get("exploratory") is not True:
        raise RuntimeError("feature audit exploratory boundary mismatch")
    if diagnostic.get("formalExperiment") is not False or diagnostic.get("finalClusterCountSelected") is not False:
        raise RuntimeError("diagnostic boundary mismatch")
    if diagnostic.get("sourceFeatureAuditHash") != feature_audit.get("auditHash"):
        raise RuntimeError("feature-audit hash mismatch")

    frame = pd.read_csv(input_dir / "eligible-primary-rule-state.csv")
    expected = feature_audit["population"]["primaryRuleStateUnique"]
    if len(frame) != expected or frame["ruleStateKey"].nunique() != expected:
        raise RuntimeError("primary table integrity mismatch")

    report = {
        "schemaVersion": 1,
        "status": "stage1-candidate-stability-audit-complete",
        "formalExperiment": False,
        "exploratory": True,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourceClusteringDiagnosticHash": diagnostic["diagnosticHash"],
        "environment": {"python": sys.version.split()[0], "platform": platform.platform()},
        "design": {
            "candidateKs": CANDIDATES,
            "candidateMeaning": {
                "mtaji": {"2": "coarse candidate", "6": "fine-structure probe representing k=5-6 family"},
                "namua": {"2": "compactness probe only", "4": "method-agreement probe only"},
            },
            "representations": ["S-pruned", "C-level-contrast", "P-raw-pits"],
            "representationSensitivityPreprocessing": "log1p-standard",
            "populationViews": ["full-unweighted", "game-phase-capped"],
            "capPerGamePhase": options.cap_per_game_phase,
            "methods": METHODS,
            "trajectoryResampling": {
                "methods": ["kmeans", "gmm-diag"], "repetitions": options.resample_repetitions,
                "gameFraction": options.resample_game_fraction, "unit": "game/trajectory",
                "view": "game-phase-capped", "representation": "S-pruned", "preprocessing": "log1p-standard",
            },
            "mtajiRareHouseSensitivity": True,
        },
        "phases": {},
    }

    assignment_rows = []

    for phase in ["namua", "mtaji"]:
        full = frame[frame["phase"] == phase].copy()
        capped = balanced_capped(full, options.cap_per_game_phase)
        phase_report = {
            "fullRows": int(len(full)), "cappedRows": int(len(capped)),
            "candidateKs": CANDIDATES[phase], "candidates": {},
        }

        for k in CANDIDATES[phase]:
            candidate = {
                "sameRepresentation": {},
                "crossViewARI": {},
                "crossPreprocessingARI": {},
                "crossRepresentationARI": {},
                "trajectoryResampling": {},
            }

            # Same-representation solutions for S-pruned across views/preprocessing.
            cache = {}
            for view_name, view_frame in [("full-unweighted", full), ("game-phase-capped", capped)]:
                for prep in ["standard", "log1p-standard"]:
                    matrix, columns, transformer = representation_fit(view_frame, phase, "S-pruned", prep)
                    labels_by_method = {}
                    summaries = {}
                    for method in METHODS:
                        model, labels = fit_model(method, matrix, k)
                        labels_by_method[method] = labels
                        summaries[method] = solution_summary(matrix, labels, view_frame["conditionId"].astype(str).to_numpy())
                        for row_index, label in zip(view_frame.index, labels):
                            assignment_rows.append({
                                "phase": phase, "k": k, "representation": "S-pruned", "view": view_name,
                                "preprocessing": prep, "method": method,
                                "ruleStateKey": str(view_frame.loc[row_index, "ruleStateKey"]), "cluster": int(label),
                            })
                    cache[(view_name, prep)] = (view_frame, matrix, labels_by_method)
                    candidate["sameRepresentation"][f"{view_name}|{prep}"] = {
                        "rows": int(len(view_frame)), "dimensions": int(matrix.shape[1]),
                        "methods": summaries, "methodAgreementARI": method_agreement(labels_by_method),
                    }

            # Cross-view agreement on the capped rows (full labels restricted to capped indices).
            for prep in ["standard", "log1p-standard"]:
                full_frame, _, full_labels = cache[("full-unweighted", prep)]
                capped_frame, _, capped_labels = cache[("game-phase-capped", prep)]
                position = {index: pos for pos, index in enumerate(full_frame.index)}
                restricted = np.array([full_labels[method][position[index]] for index in capped_frame.index] for method in [])
                candidate["crossViewARI"][prep] = {}
                for method in METHODS:
                    full_on_capped = np.array([full_labels[method][position[index]] for index in capped_frame.index])
                    candidate["crossViewARI"][prep][method] = float(adjusted_rand_score(full_on_capped, capped_labels[method]))

            # Cross-preprocessing agreement within each population view.
            for view_name in ["full-unweighted", "game-phase-capped"]:
                candidate["crossPreprocessingARI"][view_name] = {}
                std_labels = cache[(view_name, "standard")][2]
                log_labels = cache[(view_name, "log1p-standard")][2]
                for method in METHODS:
                    candidate["crossPreprocessingARI"][view_name][method] = float(adjusted_rand_score(std_labels[method], log_labels[method]))

            # Representation sensitivity on capped + log1p-standard.
            representation_labels = {}
            for kind in ["S-pruned", "C-level-contrast", "P-raw-pits"]:
                matrix, _, _ = representation_fit(capped, phase, kind, "log1p-standard")
                representation_labels[kind] = {}
                for method in METHODS:
                    _, labels = fit_model(method, matrix, k)
                    representation_labels[kind][method] = labels
            for left, right in [("S-pruned", "C-level-contrast"), ("S-pruned", "P-raw-pits"), ("C-level-contrast", "P-raw-pits")]:
                key = f"{left}|{right}"
                candidate["crossRepresentationARI"][key] = {
                    method: float(adjusted_rand_score(representation_labels[left][method], representation_labels[right][method]))
                    for method in METHODS
                }

            # Mtaji rare house sensitivity on capped + log1p S representation.
            if phase == "mtaji":
                base_matrix, _, _ = representation_fit(capped, phase, "S-pruned", "log1p-standard")
                house_matrix, _, _ = representation_fit(capped, phase, "S-pruned", "log1p-standard", include_mtaji_house=True)
                candidate["rareHouseSensitivityARI"] = {}
                for method in METHODS:
                    _, base_labels = fit_model(method, base_matrix, k)
                    _, house_labels = fit_model(method, house_matrix, k)
                    candidate["rareHouseSensitivityARI"][method] = float(adjusted_rand_score(base_labels, house_labels))

            # Trajectory-level resampling on capped S/log1p for predictive methods.
            for method in ["kmeans", "gmm-diag"]:
                candidate["trajectoryResampling"][method] = trajectory_resampling(
                    capped, phase, k, method, options.resample_repetitions, options.resample_game_fraction,
                )

            # K-means interpretability / representatives on capped S/log1p.
            candidate["interpretability"] = kmeans_interpretability(
                capped, phase, k, options.representatives, options.boundary,
            )
            phase_report["candidates"][str(k)] = candidate

        report["phases"][phase] = phase_report

    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    report["auditHash"] = hashlib.sha256(encoded).hexdigest()
    atomic_json(output_dir / "candidate-stability.json", report)
    atomic_csv(output_dir / "candidate-assignments.csv", pd.DataFrame(assignment_rows))
    print(json.dumps({
        "passed": True,
        "formalExperiment": False,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "output": str(output_dir / "candidate-stability.json"),
        "auditHash": report["auditHash"],
    }, indent=2))


if __name__ == "__main__":
    main()
