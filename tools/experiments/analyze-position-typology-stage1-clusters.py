#!/usr/bin/env python3
"""Stage 1 exploratory clustering diagnostics for Bao position typology.

Exploratory only. This script does not select a final cluster count, name
position types, or perform confirmatory analysis.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import json
import os
import platform
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import (
    adjusted_rand_score,
    calinski_harabasz_score,
    davies_bouldin_score,
    normalized_mutual_info_score,
    silhouette_score,
)
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_ROOT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1"
RANDOM_STATE = 20260809

COMMON_FIELDS = [
    "nyumbaSeeds",
    "frontSeeds",
    "backSeeds",
    "frontOccupied",
    "backOccupied",
    "reusablePits",
    "frontConnections",
    "legalMoveCount",
    "captureMoveCount",
    "maxPitSeeds",
    "pitSeedVariance",
    "seedConcentration",
    "maxCapturableSeeds",
    "meanCapturableSeeds",
    "maxCaptureEvents",
    "meanCaptureEvents",
    "maxRelayEvents",
    "meanRelayEvents",
    "maxChainEvents",
]
LOG_FIELDS = {
    "nyumbaSeeds",
    "maxPitSeeds",
    "pitSeedVariance",
    "seedConcentration",
    "maxCapturableSeeds",
    "meanCapturableSeeds",
    "maxCaptureEvents",
    "meanCaptureEvents",
    "maxRelayEvents",
    "meanRelayEvents",
    "maxChainEvents",
}
BINARY_COMMON = ["actor.forcedCapture", "opponent.forcedCapture"]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_ROOT)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--k-min", type=int, default=2)
    parser.add_argument("--k-max", type=int, default=10)
    parser.add_argument("--cap-per-game-phase", type=int, default=20)
    parser.add_argument("--silhouette-sample", type=int, default=600)
    return parser.parse_args()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    temporary.replace(path)


def package_versions():
    output = {}
    for name in ["numpy", "pandas", "scikit-learn", "scipy"]:
        try:
            output[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:
            output[name] = None
    return output


def sha_order(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def balanced_capped(frame: pd.DataFrame, cap: int) -> pd.DataFrame:
    pieces = []
    for _, group in frame.groupby("gameId", sort=True):
        if len(group) <= cap:
            pieces.append(group)
            continue
        ranked = group.assign(_rank_key=group["ruleStateKey"].map(sha_order)).sort_values("_rank_key")
        pieces.append(ranked.head(cap).drop(columns=["_rank_key"]))
    return pd.concat(pieces, axis=0).sort_index()


def representation(frame: pd.DataFrame, phase: str):
    continuous = []
    binary = list(BINARY_COMMON)
    work = frame.copy()

    for side in ["actor", "opponent"]:
        continuous.extend([f"{side}.{field}" for field in COMMON_FIELDS])

    if phase == "namua":
        work["reserveTotal"] = work["actor.reserve"] + work["opponent.reserve"]
        work["reserveDifference"] = work["actor.reserve"] - work["opponent.reserve"]
        continuous += ["reserveTotal", "reserveDifference"]
        binary += ["actor.houseOwned", "opponent.houseOwned"]

    return work, continuous, binary


def transform(frame: pd.DataFrame, continuous, binary, preprocessing: str):
    continuous_frame = frame[continuous].astype(float).copy()
    if preprocessing == "log1p-standard":
        for column in continuous:
            base = column.split(".", 1)[-1]
            if base in LOG_FIELDS:
                if (continuous_frame[column] < 0).any():
                    raise ValueError(f"log1p column contains negative values: {column}")
                continuous_frame[column] = np.log1p(continuous_frame[column].to_numpy())
    elif preprocessing != "standard":
        raise ValueError(preprocessing)

    scaler = StandardScaler()
    continuous_scaled = scaler.fit_transform(continuous_frame)
    binary_values = frame[binary].astype(float).to_numpy()
    matrix = np.column_stack([continuous_scaled, binary_values])
    columns = list(continuous) + list(binary)
    return matrix, columns


def cluster_counts(labels):
    counts = Counter(int(value) for value in labels)
    total = len(labels)
    return {
        "counts": {str(key): value for key, value in sorted(counts.items())},
        "fractions": {str(key): value / total for key, value in sorted(counts.items())},
        "minimumFraction": min(counts.values()) / total,
        "maximumFraction": max(counts.values()) / total,
    }


def condition_composition(labels, conditions):
    output = {}
    for cluster in sorted(set(int(value) for value in labels)):
        counts = Counter(
            str(condition)
            for label, condition in zip(labels, conditions)
            if int(label) == cluster
        )
        output[str(cluster)] = dict(sorted(counts.items()))
    return output


def metrics_for(matrix, labels, conditions, silhouette_sample):
    unique = len(set(int(value) for value in labels))
    if unique < 2 or unique >= len(labels):
        raise ValueError("Invalid cluster solution")
    return {
        "silhouette": float(
            silhouette_score(
                matrix,
                labels,
                sample_size=min(silhouette_sample, len(labels)),
                random_state=RANDOM_STATE,
            )
        ),
        "calinskiHarabasz": float(calinski_harabasz_score(matrix, labels)),
        "daviesBouldin": float(davies_bouldin_score(matrix, labels)),
        "clusterSize": cluster_counts(labels),
        "conditionNMI": float(normalized_mutual_info_score(conditions, labels)),
        "conditionComposition": condition_composition(labels, conditions),
    }


def fit_solution(method, matrix, k):
    if method == "kmeans":
        model = KMeans(n_clusters=k, n_init=20, random_state=RANDOM_STATE)
        labels = model.fit_predict(matrix)
        extra = {"inertia": float(model.inertia_)}
    elif method == "gmm-diag":
        model = GaussianMixture(
            n_components=k,
            covariance_type="diag",
            n_init=5,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        )
        labels = model.fit_predict(matrix)
        extra = {"aic": float(model.aic(matrix)), "bic": float(model.bic(matrix))}
    elif method == "ward":
        model = AgglomerativeClustering(n_clusters=k, linkage="ward")
        labels = model.fit_predict(matrix)
        extra = {}
    else:
        raise ValueError(method)
    return labels, extra


def pca_summary(matrix):
    count = min(10, matrix.shape[1], matrix.shape[0])
    pca = PCA(n_components=count, random_state=RANDOM_STATE)
    pca.fit(matrix)
    ratios = [float(value) for value in pca.explained_variance_ratio_]
    return {
        "components": count,
        "explainedVarianceRatio": ratios,
        "cumulativeExplainedVariance": [float(value) for value in np.cumsum(ratios)],
    }


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    output_dir = Path(options.output).resolve()
    audit_path = input_dir / "feature-audit.json"
    table_path = input_dir / "eligible-primary-rule-state.csv"

    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    if audit.get("formalExperiment") is not False or audit.get("exploratory") is not True:
        raise RuntimeError("Feature audit exploratory boundary mismatch")
    if audit.get("clusteringPerformed") is not False:
        raise RuntimeError("Feature audit must precede clustering")

    frame = pd.read_csv(table_path)
    expected = audit["population"]["primaryRuleStateUnique"]
    if len(frame) != expected:
        raise RuntimeError(f"Primary table row mismatch: {len(frame)} != {expected}")
    if frame["ruleStateKey"].nunique() != expected:
        raise RuntimeError("Primary ruleStateKey is not unique")

    report = {
        "schemaVersion": 1,
        "status": "stage1-first-clustering-diagnostic-complete",
        "formalExperiment": False,
        "exploratory": True,
        "finalClusterCountSelected": False,
        "positionTypesNamed": False,
        "sourceFeatureAuditHash": audit["auditHash"],
        "input": str(input_dir),
        "output": str(output_dir),
        "environment": {
            "python": sys.version.split()[0],
            "implementation": platform.python_implementation(),
            "platform": platform.platform(),
            "packages": package_versions(),
        },
        "design": {
            "representation": "S-pruned",
            "phases": ["namua", "mtaji"],
            "preprocessing": ["standard", "log1p-standard"],
            "populationViews": ["full-unweighted", "game-phase-capped"],
            "capPerGamePhase": options.cap_per_game_phase,
            "methods": ["kmeans", "gmm-diag", "ward"],
            "kRange": [options.k_min, options.k_max],
            "silhouetteSample": options.silhouette_sample,
            "randomState": RANDOM_STATE,
            "matrixCIncluded": False,
            "matrixPIncluded": False,
            "seatCanonicalSensitivityRepeated": False,
            "reasonSeatCanonicalNotRepeated": "pilot eligible rule-state and seat-canonical populations are identical",
        },
        "phases": {},
    }

    for phase in ["namua", "mtaji"]:
        phase_frame = frame[frame["phase"] == phase].copy()
        work, continuous, binary = representation(phase_frame, phase)
        phase_report = {
            "fullRows": len(work),
            "games": int(work["gameId"].nunique()),
            "continuousColumns": continuous,
            "binaryColumns": binary,
            "rareHouseSensitivityDeferred": phase == "mtaji",
            "populationViews": {},
        }

        views = {
            "full-unweighted": work,
            "game-phase-capped": balanced_capped(work, options.cap_per_game_phase),
        }

        for view_name, view_frame in views.items():
            view_report = {
                "rows": len(view_frame),
                "games": int(view_frame["gameId"].nunique()),
                "conditionCounts": {
                    str(key): int(value)
                    for key, value in view_frame["conditionId"].value_counts().sort_index().items()
                },
                "preprocessing": {},
            }
            for preprocessing in ["standard", "log1p-standard"]:
                matrix, columns = transform(view_frame, continuous, binary, preprocessing)
                preprocessing_report = {
                    "rows": int(matrix.shape[0]),
                    "columns": columns,
                    "dimensions": int(matrix.shape[1]),
                    "pca": pca_summary(matrix),
                    "solutions": [],
                    "methodAgreementARI": [],
                }
                labels_by_k_method = {}
                conditions = view_frame["conditionId"].astype(str).to_numpy()

                for k in range(options.k_min, options.k_max + 1):
                    labels_by_k_method[k] = {}
                    for method in ["kmeans", "gmm-diag", "ward"]:
                        labels, extra = fit_solution(method, matrix, k)
                        labels_by_k_method[k][method] = labels
                        solution = {
                            "k": k,
                            "method": method,
                            **metrics_for(matrix, labels, conditions, options.silhouette_sample),
                            **extra,
                        }
                        preprocessing_report["solutions"].append(solution)

                    for left, right in [
                        ("kmeans", "gmm-diag"),
                        ("kmeans", "ward"),
                        ("gmm-diag", "ward"),
                    ]:
                        preprocessing_report["methodAgreementARI"].append(
                            {
                                "k": k,
                                "left": left,
                                "right": right,
                                "adjustedRandIndex": float(
                                    adjusted_rand_score(
                                        labels_by_k_method[k][left],
                                        labels_by_k_method[k][right],
                                    )
                                ),
                            }
                        )

                view_report["preprocessing"][preprocessing] = preprocessing_report
            phase_report["populationViews"][view_name] = view_report
        report["phases"][phase] = phase_report

    encoded = json.dumps(
        report,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    report["diagnosticHash"] = hashlib.sha256(encoded).hexdigest()
    atomic_json(output_dir / "clustering-diagnostic.json", report)
    print(
        json.dumps(
            {
                "passed": True,
                "formalExperiment": False,
                "finalClusterCountSelected": False,
                "output": str(output_dir / "clustering-diagnostic.json"),
                "diagnosticHash": report["diagnosticHash"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
