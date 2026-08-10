#!/usr/bin/env python3
"""Stage 3 exploratory continuous-gradient audit for Bao namua position geometry.

This script does not rescue the rejected namua k=2/k=4 cluster probes, does not
select a discrete type count, and does not perform formal confirmation. It asks
whether a role-invariant continuous coordinate system better describes namua.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.linalg import subspace_angles
from scipy.signal import find_peaks
from scipy.stats import gaussian_kde, spearmanr
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage3-namua-gradient-v1"
EXPECTED_FEATURE_AUDIT_HASH = "3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129"
RANDOM_STATE = 20260810
CAP_PER_GAME_PHASE = 20
RESAMPLE_REPETITIONS = 40
RESAMPLE_GAME_FRACTION = 0.8

BASE_FIELDS = [
    "reserve", "houseOwned", "nyumbaSeeds", "frontSeeds", "backSeeds",
    "frontOccupied", "backOccupied", "reusablePits", "frontConnections",
    "legalMoveCount", "captureMoveCount", "maxPitSeeds", "pitSeedVariance",
    "seedConcentration", "maxCapturableSeeds", "meanCapturableSeeds",
    "maxCaptureEvents", "meanCaptureEvents", "maxRelayEvents",
    "meanRelayEvents", "maxChainEvents", "forcedCapture",
]
LOG_FIELDS = {
    "nyumbaSeeds", "maxPitSeeds", "pitSeedVariance", "seedConcentration",
    "maxCapturableSeeds", "meanCapturableSeeds", "maxCaptureEvents",
    "meanCaptureEvents", "maxRelayEvents", "meanRelayEvents", "maxChainEvents",
}
CAPTURE_TOTAL_FIELDS = [
    "captureMoveCount", "maxCapturableSeeds", "meanCapturableSeeds",
    "maxCaptureEvents", "meanCaptureEvents", "forcedCapture",
]
CONTRAST_FIELDS = [
    "frontSeeds", "backSeeds", "frontOccupied", "backOccupied", "reusablePits",
    "frontConnections", "legalMoveCount", "captureMoveCount", "maxCapturableSeeds",
    "meanCapturableSeeds", "maxCaptureEvents", "meanCaptureEvents",
    "maxRelayEvents", "meanRelayEvents", "maxChainEvents",
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--cap-per-game-phase", type=int, default=CAP_PER_GAME_PHASE)
    parser.add_argument("--resample-repetitions", type=int, default=RESAMPLE_REPETITIONS)
    parser.add_argument("--resample-game-fraction", type=float, default=RESAMPLE_GAME_FRACTION)
    parser.add_argument("--kde-grid", type=int, default=512)
    return parser.parse_args()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    temporary.replace(path)


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
    names, arrays = [], []
    for field in BASE_FIELDS:
        actor = transformed_side(frame, "actor", field)
        opponent = transformed_side(frame, "opponent", field)
        names.extend([f"total.{field}", f"absDifference.{field}"])
        arrays.extend([actor + opponent, np.abs(actor - opponent)])
    return np.column_stack(arrays), names


def fit_geometry(frame: pd.DataFrame):
    raw, names = raw_invariant(frame)
    scaler = StandardScaler().fit(raw)
    matrix = scaler.transform(raw)
    pca = PCA().fit(matrix)
    scores = pca.transform(matrix)
    return raw, names, scaler, pca, scores


def zscore(values):
    values = np.asarray(values, dtype=float)
    sd = float(np.std(values))
    return np.zeros_like(values) if sd == 0 else (values - np.mean(values)) / sd


def scalar_coordinates(raw: np.ndarray, names: list[str]):
    by_name = {name: raw[:, index] for index, name in enumerate(names)}
    reserve_total = by_name["total.reserve"]
    reserve_depletion = -zscore(reserve_total)

    activity_parts = [zscore(by_name[f"total.{field}"]) for field in CAPTURE_TOTAL_FIELDS]
    capture_activity = np.mean(np.column_stack(activity_parts), axis=1)

    contrast_parts = [zscore(by_name[f"absDifference.{field}"]) for field in CONTRAST_FIELDS]
    structural_contrast = np.mean(np.column_stack(contrast_parts), axis=1)

    return {
        "reserveDepletion": reserve_depletion,
        "captureActivity": capture_activity,
        "structuralContrast": structural_contrast,
    }


def quantiles(values):
    x = np.asarray(values, dtype=float)
    return {
        "count": int(len(x)),
        "min": float(np.min(x)),
        "p10": float(np.quantile(x, 0.10)),
        "p25": float(np.quantile(x, 0.25)),
        "median": float(np.median(x)),
        "p75": float(np.quantile(x, 0.75)),
        "p90": float(np.quantile(x, 0.90)),
        "max": float(np.max(x)),
    }


def safe_spearman(left, right):
    result = spearmanr(np.asarray(left, dtype=float), np.asarray(right, dtype=float))
    return {"rho": float(result.statistic), "pvalue": float(result.pvalue)}


def gmm_bic(values):
    x = np.asarray(values, dtype=float).reshape(-1, 1)
    output = {}
    for components in [1, 2, 3, 4]:
        model = GaussianMixture(
            n_components=components,
            covariance_type="full",
            n_init=20,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        ).fit(x)
        output[str(components)] = {
            "aic": float(model.aic(x)),
            "bic": float(model.bic(x)),
            "weights": [float(value) for value in model.weights_],
            "means": [float(value) for value in model.means_.ravel()],
            "stddev": [float(np.sqrt(value)) for value in model.covariances_.reshape(-1)],
        }
    return output


def kde_shape(values, grid_points):
    values = np.asarray(values, dtype=float)
    lo, hi = np.quantile(values, [0.005, 0.995])
    grid = np.linspace(lo, hi, grid_points)
    density = gaussian_kde(values)(grid)
    peaks, _ = find_peaks(density)
    ranked = sorted(peaks, key=lambda index: density[index], reverse=True)
    top = ranked[:5]
    result = {
        "gridRange": [float(lo), float(hi)],
        "peakCount": int(len(peaks)),
        "topPeaks": [{"x": float(grid[i]), "density": float(density[i])} for i in top],
        "majorTwoPeakValley": None,
    }
    if len(top) >= 2:
        left, right = sorted(top[:2])
        valley = left + int(np.argmin(density[left:right + 1]))
        denominator = min(density[left], density[right])
        result["majorTwoPeakValley"] = {
            "leftPeakX": float(grid[left]),
            "rightPeakX": float(grid[right]),
            "valleyX": float(grid[valley]),
            "valleyToLowerPeakDensityRatio": float(density[valley] / denominator) if denominator > 0 else None,
        }
    return result


def loading_summary(pca: PCA, names: list[str], components: int = 5, top: int = 12):
    output = []
    for index in range(min(components, pca.components_.shape[0])):
        vector = pca.components_[index]
        order = np.argsort(-np.abs(vector))[:top]
        output.append({
            "pc": index + 1,
            "explainedVarianceRatio": float(pca.explained_variance_ratio_[index]),
            "topLoadings": [
                {"feature": names[int(j)], "loading": float(vector[int(j)])}
                for j in order
            ],
        })
    return output


def condition_variance_fraction(values, conditions):
    values = np.asarray(values, dtype=float)
    conditions = np.asarray(conditions)
    total = float(np.sum((values - np.mean(values)) ** 2))
    if total == 0:
        return 0.0
    between = 0.0
    for condition in sorted(set(conditions.tolist())):
        group = values[conditions == condition]
        between += len(group) * float((np.mean(group) - np.mean(values)) ** 2)
    return float(between / total)


def trajectory_monotonicity(frame: pd.DataFrame, coordinates: dict[str, np.ndarray]):
    work = frame[["gameId", "ply"]].copy()
    for name, values in coordinates.items():
        work[name] = values
    result = {}
    for name in coordinates:
        per_game_rho = []
        deltas = []
        for _, group in work.sort_values(["gameId", "ply"]).groupby("gameId", sort=True):
            if len(group) >= 3 and group[name].nunique() > 1:
                rho = spearmanr(group["ply"].astype(float), group[name].astype(float)).statistic
                if np.isfinite(rho):
                    per_game_rho.append(float(rho))
            rows = group.to_dict("records")
            for left, right in zip(rows, rows[1:]):
                if int(right["ply"]) - int(left["ply"]) == 1:
                    deltas.append(float(right[name] - left[name]))
        delta_array = np.asarray(deltas, dtype=float)
        result[name] = {
            "gamesWithRho": int(len(per_game_rho)),
            "perGameSpearmanRho": quantiles(per_game_rho) if per_game_rho else None,
            "consecutiveDelta": {
                **quantiles(delta_array) if len(delta_array) else {},
                "positiveFraction": float(np.mean(delta_array > 0)) if len(delta_array) else None,
                "negativeFraction": float(np.mean(delta_array < 0)) if len(delta_array) else None,
                "zeroFraction": float(np.mean(delta_array == 0)) if len(delta_array) else None,
            },
        }
    return result


def subspace_comparison(full_pca: PCA, capped_pca: PCA):
    output = {}
    for dimensions in [1, 2, 3, 5, 10]:
        left = full_pca.components_[:dimensions].T
        right = capped_pca.components_[:dimensions].T
        angles = np.degrees(subspace_angles(left, right))
        output[str(dimensions)] = {
            "anglesDegrees": [float(value) for value in angles],
            "maxAngleDegrees": float(np.max(angles)),
            "meanAngleDegrees": float(np.mean(angles)),
        }
    return output


def resampling_subspace(frame: pd.DataFrame, reference_pca: PCA, repetitions: int, game_fraction: float):
    games = np.array(sorted(frame["gameId"].unique()))
    take = max(2, int(math.ceil(len(games) * game_fraction)))
    rng = np.random.default_rng(RANDOM_STATE)
    scores = {2: [], 3: [], 5: []}
    for _ in range(repetitions):
        selected = set(rng.choice(games, size=take, replace=False).tolist())
        sample = frame[frame["gameId"].isin(selected)]
        raw, _ = raw_invariant(sample)
        matrix = StandardScaler().fit_transform(raw)
        pca = PCA().fit(matrix)
        for dimensions in scores:
            angles = np.degrees(subspace_angles(
                reference_pca.components_[:dimensions].T,
                pca.components_[:dimensions].T,
            ))
            scores[dimensions].append(float(np.max(angles)))
    return {
        str(dimensions): {
            "metric": "maximum principal angle in degrees",
            **quantiles(values),
        }
        for dimensions, values in scores.items()
    }


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads((input_dir / "feature-audit.json").read_text(encoding="utf-8"))
    if feature_audit.get("formalExperiment") is not False or feature_audit.get("exploratory") is not True:
        raise RuntimeError("Stage 1 feature audit boundary mismatch")
    if feature_audit.get("auditHash") != EXPECTED_FEATURE_AUDIT_HASH:
        raise RuntimeError("unexpected Stage 1 feature-audit hash")

    frame = pd.read_csv(input_dir / "eligible-primary-rule-state.csv")
    namua = frame[frame["phase"] == "namua"].copy()
    capped = balanced_capped(namua, options.cap_per_game_phase)

    raw_full, names_full, _, pca_full, scores_full = fit_geometry(namua)
    raw, names, _, pca, scores = fit_geometry(capped)
    if names != names_full:
        raise RuntimeError("feature-order mismatch between full and capped views")

    scalars = scalar_coordinates(raw, names)
    coordinates = {
        **scalars,
        "PC1": scores[:, 0],
        "PC2": scores[:, 1],
        "PC3": scores[:, 2],
    }

    correlations = {}
    for pc_index in range(5):
        pc_name = f"PC{pc_index + 1}"
        correlations[pc_name] = {
            name: safe_spearman(scores[:, pc_index], values)
            for name, values in {
                **scalars,
                "plyDescriptiveOnly": capped["ply"].astype(float).to_numpy(),
            }.items()
        }

    densities = {}
    for name in ["reserveDepletion", "captureActivity", "structuralContrast", "PC1", "PC2", "PC3"]:
        values = coordinates[name]
        densities[name] = {
            "quantiles": quantiles(values),
            "gmm1d": gmm_bic(values),
            "kde": kde_shape(values, options.kde_grid),
        }

    conditions = capped["conditionId"].astype(str).to_numpy()
    condition_dependence = {
        name: condition_variance_fraction(values, conditions)
        for name, values in coordinates.items()
    }

    report = {
        "schemaVersion": 1,
        "status": "stage3-namua-continuous-gradient-audit-complete",
        "formalExperiment": False,
        "exploratory": True,
        "discreteTypeSearchAuthorized": False,
        "positionTypesNamed": False,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "design": {
            "phase": "namua",
            "population": "Stage 1 exploratory eligible primary rule states only",
            "terminalExcluded": True,
            "minimumPlyInclusive": 8,
            "primaryView": "game-phase-capped",
            "capPerGamePhase": int(options.cap_per_game_phase),
            "capSelectionOrder": "SHA-256(ruleStateKey) lexical order",
            "roleInvariant": True,
            "rawPlyUsedAsFeature": False,
            "previousK2K4RescueAllowed": False,
            "futureConfirmationCorpusTouched": False,
        },
        "population": {
            "fullRows": int(len(namua)),
            "cappedRows": int(len(capped)),
            "games": int(capped["gameId"].nunique()),
            "conditionCounts": {
                str(key): int(value)
                for key, value in capped["conditionId"].value_counts().sort_index().items()
            },
        },
        "representation": {
            "name": "namua-role-invariant-continuous-geometry-v1",
            "dimensions": int(raw.shape[1]),
            "fieldOrder": names,
            "baseFields": BASE_FIELDS,
            "log1pBaseFields": sorted(LOG_FIELDS),
            "construction": "for each base field: total(actor, opponent), absDifference(actor, opponent); then StandardScaler",
        },
        "pca": {
            "explainedVarianceRatio": [float(value) for value in pca.explained_variance_ratio_[:10]],
            "cumulativeExplainedVariance": [float(value) for value in np.cumsum(pca.explained_variance_ratio_)[:10]],
            "loadings": loading_summary(pca, names),
            "fullVsCappedSubspace": subspace_comparison(pca_full, pca),
            "gameResamplingSubspace": resampling_subspace(
                capped,
                pca,
                int(options.resample_repetitions),
                float(options.resample_game_fraction),
            ),
        },
        "interpretableCoordinates": {
            "reserveDepletion": {
                "definition": "negative z-score of total actor+opponent reserve; higher means less reserve remains",
            },
            "captureActivity": {
                "definition": "mean z-score of role-invariant total captureMoveCount, capturable-seed, capture-event and forcedCapture measures",
                "componentFields": CAPTURE_TOTAL_FIELDS,
            },
            "structuralContrast": {
                "definition": "mean z-score of selected role-invariant actor/opponent absolute-difference measures",
                "componentFields": CONTRAST_FIELDS,
            },
        },
        "pcCorrelations": correlations,
        "densityDiagnostics": densities,
        "conditionVarianceFraction": condition_dependence,
        "trajectoryMonotonicity": trajectory_monotonicity(capped, coordinates),
        "interpretationBoundary": {
            "continuousCoordinatesAreDescriptiveNotFormalTypes": True,
            "noClusterCountMayBePromotedFromThisAudit": True,
            "rawPlyIsDescriptiveOnly": True,
            "conditionLabelsAreMetadataOnly": True,
            "study1FormalDecisionsUnchanged": True,
        },
        "environment": {
            "python": platform.python_version(),
            "platform": platform.platform(),
        },
    }

    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    report["auditHash"] = hashlib.sha256(encoded).hexdigest()
    output_path = output_dir / "namua-gradient-audit.json"
    atomic_json(output_path, report)
    print(json.dumps({
        "passed": True,
        "formalExperiment": False,
        "output": str(output_path),
        "auditHash": report["auditHash"],
        "fullRows": int(len(namua)),
        "cappedRows": int(len(capped)),
    }, indent=2))


if __name__ == "__main__":
    main()
