#!/usr/bin/env python3
"""Stage 4 exploratory playing-style trajectory geometry.

One game is one trajectory-level observation. The analysis derives style
descriptors from confirmed mtaji morphology dynamics and Stage 3 namua
continuous coordinates. AI condition IDs are metadata only and are never
treated as playing-style labels.

This script is exploratory. It does not preregister or confirm playing styles.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import gaussian_kde, spearmanr
from scipy.signal import find_peaks
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, silhouette_score
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

DEFAULT_FEATURES = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_CANDIDATE = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
)
DEFAULT_CONFIRMATION = (
    "artifacts/local/position-typology/stage2-mtaji-confirmation-v1/"
    "confirmation-result.json"
)
DEFAULT_NAMUA = (
    "artifacts/local/position-typology/stage3-namua-gradient-v1/"
    "namua-gradient-audit.json"
)
DEFAULT_OUTPUT = "artifacts/local/position-typology/stage4-playing-style-exploratory-v1"

EXPECTED_FEATURE_AUDIT_HASH = "3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129"
EXPECTED_CANDIDATE_HASH = "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d"
EXPECTED_STAGE2_RESULT_HASH = "26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347"
EXPECTED_NAMUA_AUDIT_HASH = "099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a"
RANDOM_STATE = 20260810

STYLE_FIELDS = [
    "namuaCaptureActivityMean",
    "namuaCaptureActivityStd",
    "namuaCaptureActivityTrendRho",
    "namuaStructuralContrastMean",
    "namuaStructuralContrastStd",
    "namuaStructuralContrastTrendRho",
    "mtajiM1Fraction",
    "mtajiTypeSwitchRate",
    "mtajiM1MeanDwell",
    "mtajiM2MeanDwell",
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--features", default=DEFAULT_FEATURES)
    parser.add_argument("--candidate", default=DEFAULT_CANDIDATE)
    parser.add_argument("--confirmation", default=DEFAULT_CONFIRMATION)
    parser.add_argument("--namua", default=DEFAULT_NAMUA)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--resample-repetitions", type=int, default=100)
    parser.add_argument("--resample-game-fraction", type=float, default=0.8)
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
            ranked = group.assign(
                _rank_key=group["ruleStateKey"].astype(str).map(sha_order)
            ).sort_values("_rank_key")
            pieces.append(ranked.head(cap).drop(columns=["_rank_key"]))
    return pd.concat(pieces, axis=0).sort_index()


def transformed_side(frame: pd.DataFrame, side: str, field: str, log_fields: set[str]):
    values = frame[f"{side}.{field}"].astype(float).to_numpy()
    if field in log_fields:
        if np.any(values < 0):
            raise RuntimeError(f"negative value in log field: {side}.{field}")
        values = np.log1p(values)
    return values


def raw_invariant(frame: pd.DataFrame, base_fields: list[str], log_fields: set[str]):
    names = []
    arrays = []
    for field in base_fields:
        actor = transformed_side(frame, "actor", field, log_fields)
        opponent = transformed_side(frame, "opponent", field, log_fields)
        names.extend([f"total.{field}", f"absDifference.{field}"])
        arrays.extend([actor + opponent, np.abs(actor - opponent)])
    return np.column_stack(arrays), names


def namua_coordinate_setup(frame: pd.DataFrame, audit: dict):
    rep = audit["representation"]
    base_fields = list(rep["baseFields"])
    log_fields = set(rep["log1pBaseFields"])
    cap = int(audit["design"]["capPerGamePhase"])
    namua = frame[frame["phase"] == "namua"].copy()
    capped = balanced_capped(namua, cap)
    raw_capped, names = raw_invariant(capped, base_fields, log_fields)
    scaler = StandardScaler().fit(raw_capped)
    return namua, names, scaler, base_fields, log_fields


def coordinate_values(
    frame: pd.DataFrame,
    names: list[str],
    scaler: StandardScaler,
    base_fields: list[str],
    log_fields: set[str],
    audit: dict,
):
    raw, names_check = raw_invariant(frame, base_fields, log_fields)
    if names_check != names:
        raise RuntimeError("namua representation field order mismatch")
    matrix = scaler.transform(raw)
    index = {name: i for i, name in enumerate(names)}

    act_fields = audit["interpretableCoordinates"]["captureActivity"]["componentFields"]
    contrast_fields = audit["interpretableCoordinates"]["structuralContrast"]["componentFields"]

    act = np.mean(
        np.column_stack([matrix[:, index[f"total.{field}"]] for field in act_fields]),
        axis=1,
    )
    contrast = np.mean(
        np.column_stack([matrix[:, index[f"absDifference.{field}"]] for field in contrast_fields]),
        axis=1,
    )
    return act, contrast


def classify_mtaji(frame: pd.DataFrame, candidate: dict):
    rep = candidate["representation"]
    base_fields = list(rep["baseFields"])
    if "total.forcedCapture" in rep["fieldOrder"] and "forcedCapture" not in base_fields:
        base_fields.append("forcedCapture")
    raw, names = raw_invariant(
        frame,
        base_fields,
        set(rep["log1pBaseFields"]),
    )
    if names != list(rep["fieldOrder"]):
        raise RuntimeError("candidate representation order mismatch")
    mean = np.asarray(candidate["scaler"]["mean"], dtype=float)
    scale = np.asarray(candidate["scaler"]["scale"], dtype=float)
    centers = np.asarray(candidate["clustering"]["centersStandardized"], dtype=float)
    matrix = (raw - mean) / scale
    distances = np.linalg.norm(matrix[:, None, :] - centers[None, :, :], axis=2)
    raw_labels = np.argmin(distances, axis=1)
    mapping = candidate["clustering"]["rawLabelToCanonical"]
    labels = np.array([mapping[str(int(label))] for label in raw_labels], dtype=object)
    margins = np.sort(distances, axis=1)[:, 1] - np.sort(distances, axis=1)[:, 0]
    return labels, margins


def safe_std(values):
    x = np.asarray(values, dtype=float)
    return float(np.std(x)) if len(x) else 0.0


def safe_rho(x, y):
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    if len(x) < 3 or len(np.unique(x)) < 2 or len(np.unique(y)) < 2:
        return 0.0
    value = spearmanr(x, y).statistic
    return float(value) if np.isfinite(value) else 0.0


def run_lengths(labels):
    labels = list(labels)
    if not labels:
        return []
    output = []
    current = labels[0]
    length = 1
    for label in labels[1:]:
        if label == current:
            length += 1
        else:
            output.append((current, length))
            current = label
            length = 1
    output.append((current, length))
    return output


def game_descriptors(frame: pd.DataFrame, candidate: dict, namua_audit: dict):
    namua_all, names, namua_scaler, namua_base, namua_logs = namua_coordinate_setup(frame, namua_audit)
    act_all, contrast_all = coordinate_values(
        namua_all, names, namua_scaler, namua_base, namua_logs, namua_audit
    )
    namua_all = namua_all.copy()
    namua_all["_N_ACT"] = act_all
    namua_all["_N_CON"] = contrast_all

    mtaji_all = frame[frame["phase"] == "mtaji"].copy()
    mtaji_labels, mtaji_margins = classify_mtaji(mtaji_all, candidate)
    mtaji_all["_type"] = mtaji_labels
    mtaji_all["_margin"] = mtaji_margins

    rows = []
    all_games = sorted(set(frame["gameId"].astype(str)))
    for game_id in all_games:
        n = namua_all[namua_all["gameId"].astype(str) == game_id].sort_values("ply")
        m = mtaji_all[mtaji_all["gameId"].astype(str) == game_id].sort_values("ply")
        if len(n) == 0 or len(m) == 0:
            continue

        conditions = set(n["conditionId"].astype(str)) | set(m["conditionId"].astype(str))
        if len(conditions) != 1:
            raise RuntimeError(f"{game_id}: condition mismatch")
        condition = next(iter(conditions))

        m_labels = m["_type"].astype(str).tolist()
        runs = run_lengths(m_labels)
        consecutive_pairs = [
            (m_labels[i], m_labels[i + 1])
            for i in range(len(m_labels) - 1)
            if int(m.iloc[i + 1]["ply"]) - int(m.iloc[i]["ply"]) == 1
        ]
        switches = sum(left != right for left, right in consecutive_pairs)
        switch_rate = switches / len(consecutive_pairs) if consecutive_pairs else 0.0

        m1_runs = [length for label, length in runs if label == "MTAJI-M1"]
        m2_runs = [length for label, length in runs if label == "MTAJI-M2"]

        rows.append({
            "gameId": game_id,
            "conditionId": condition,
            "namuaRows": int(len(n)),
            "mtajiRows": int(len(m)),
            "mtajiEntryPly": int(m["ply"].min()),
            "lastEligiblePly": int(max(n["ply"].max(), m["ply"].max())),
            "namuaCaptureActivityMean": float(n["_N_ACT"].mean()),
            "namuaCaptureActivityStd": safe_std(n["_N_ACT"]),
            "namuaCaptureActivityTrendRho": safe_rho(n["ply"], n["_N_ACT"]),
            "namuaStructuralContrastMean": float(n["_N_CON"].mean()),
            "namuaStructuralContrastStd": safe_std(n["_N_CON"]),
            "namuaStructuralContrastTrendRho": safe_rho(n["ply"], n["_N_CON"]),
            "mtajiM1Fraction": float(np.mean(np.asarray(m_labels) == "MTAJI-M1")),
            "mtajiTypeSwitchRate": float(switch_rate),
            "mtajiM1MeanDwell": float(np.mean(m1_runs)) if m1_runs else 0.0,
            "mtajiM2MeanDwell": float(np.mean(m2_runs)) if m2_runs else 0.0,
            "mtajiMeanClassifierMargin": float(m["_margin"].mean()),
        })
    return pd.DataFrame(rows)


def fit_models(matrix, k):
    models = {}
    labels = {}
    models["kmeans"] = KMeans(n_clusters=k, n_init=50, random_state=RANDOM_STATE).fit(matrix)
    labels["kmeans"] = models["kmeans"].labels_
    models["gmm-diag"] = GaussianMixture(
        n_components=k,
        covariance_type="diag",
        n_init=20,
        reg_covar=1e-6,
        random_state=RANDOM_STATE,
    ).fit(matrix)
    labels["gmm-diag"] = models["gmm-diag"].predict(matrix)
    models["ward"] = AgglomerativeClustering(n_clusters=k, linkage="ward").fit(matrix)
    labels["ward"] = models["ward"].labels_
    return models, labels


def cluster_diagnostic(matrix, conditions):
    output = {}
    for k in range(2, 7):
        models, labels = fit_models(matrix, k)
        methods = ["kmeans", "gmm-diag", "ward"]
        pairs = {}
        for i, left in enumerate(methods):
            for right in methods[i + 1:]:
                pairs[f"{left}|{right}"] = float(adjusted_rand_score(labels[left], labels[right]))
        method_metrics = {}
        for method in methods:
            unique, counts = np.unique(labels[method], return_counts=True)
            method_metrics[method] = {
                "silhouette": float(silhouette_score(matrix, labels[method])),
                "clusterFractions": {
                    str(int(label)): float(count / len(matrix))
                    for label, count in zip(unique, counts)
                },
                "conditionNMI": float(normalized_mutual_info_score(conditions, labels[method])),
            }
        output[str(k)] = {
            "methods": method_metrics,
            "methodAgreementARI": pairs,
            "gmmBIC": float(models["gmm-diag"].bic(matrix)),
            "gmmAIC": float(models["gmm-diag"].aic(matrix)),
        }
    return output


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


def resample_stability(style_frame, reference_labels, method, k, repetitions, game_fraction):
    games = np.asarray(style_frame["gameId"].astype(str).tolist())
    values = style_frame[STYLE_FIELDS].astype(float).to_numpy()
    take = max(2, int(math.ceil(len(games) * game_fraction)))
    rng = np.random.default_rng(RANDOM_STATE + (0 if method == "kmeans" else 1000))
    scores = []
    for repeat in range(repetitions):
        idx = np.sort(rng.choice(len(games), size=take, replace=False))
        scaler = StandardScaler().fit(values[idx])
        train = scaler.transform(values[idx])
        full = scaler.transform(values)
        if method == "kmeans":
            model = KMeans(n_clusters=k, n_init=50, random_state=RANDOM_STATE + repeat + 1).fit(train)
            predicted = model.predict(full)
        elif method == "gmm-diag":
            model = GaussianMixture(
                n_components=k,
                covariance_type="diag",
                n_init=20,
                reg_covar=1e-6,
                random_state=RANDOM_STATE + repeat + 1,
            ).fit(train)
            predicted = model.predict(full)
        else:
            raise ValueError(method)
        scores.append(float(adjusted_rand_score(reference_labels, predicted)))
    return quantiles(scores)


def pca_summary(matrix, field_names):
    pca = PCA().fit(matrix)
    loading = []
    for pc in range(min(5, pca.components_.shape[0])):
        vector = pca.components_[pc]
        order = np.argsort(-np.abs(vector))[:8]
        loading.append({
            "pc": pc + 1,
            "explainedVarianceRatio": float(pca.explained_variance_ratio_[pc]),
            "topLoadings": [
                {"feature": field_names[int(j)], "loading": float(vector[int(j)])}
                for j in order
            ],
        })
    return pca, {
        "explainedVarianceRatio": [float(x) for x in pca.explained_variance_ratio_],
        "cumulativeExplainedVariance": [float(x) for x in np.cumsum(pca.explained_variance_ratio_)],
        "loadings": loading,
    }


def density(values):
    values = np.asarray(values, dtype=float)
    lo, hi = np.quantile(values, [0.005, 0.995])
    grid = np.linspace(lo, hi, 512)
    dens = gaussian_kde(values)(grid)
    peaks, _ = find_peaks(dens)
    ranked = sorted(peaks, key=lambda i: dens[i], reverse=True)
    result = {
        "quantiles": quantiles(values),
        "kde": {
            "peakCount": int(len(peaks)),
            "topPeaks": [
                {"x": float(grid[i]), "density": float(dens[i])}
                for i in ranked[:5]
            ],
            "majorTwoPeakValley": None,
        },
        "gmm1d": {},
    }
    if len(ranked) >= 2:
        left, right = sorted(ranked[:2])
        valley = left + int(np.argmin(dens[left:right + 1]))
        denom = min(dens[left], dens[right])
        result["kde"]["majorTwoPeakValley"] = {
            "leftPeakX": float(grid[left]),
            "rightPeakX": float(grid[right]),
            "valleyX": float(grid[valley]),
            "valleyToLowerPeakDensityRatio": float(dens[valley] / denom) if denom > 0 else None,
        }
    x = values.reshape(-1, 1)
    for components in [1, 2, 3, 4]:
        model = GaussianMixture(
            n_components=components,
            covariance_type="full",
            n_init=20,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        ).fit(x)
        result["gmm1d"][str(components)] = {
            "aic": float(model.aic(x)),
            "bic": float(model.bic(x)),
            "weights": [float(v) for v in model.weights_],
            "means": [float(v) for v in model.means_.ravel()],
        }
    return result


def cluster_profiles(style_frame, standardized, labels, k):
    overall = standardized.mean(axis=0)
    sd = standardized.std(axis=0)
    sd[sd == 0] = 1.0
    output = {}
    for cluster in range(k):
        idx = np.where(labels == cluster)[0]
        effect = (standardized[idx].mean(axis=0) - overall) / sd
        order = np.argsort(-np.abs(effect))
        conditions = style_frame.iloc[idx]["conditionId"].value_counts().sort_index().to_dict()
        output[str(cluster)] = {
            "count": int(len(idx)),
            "fraction": float(len(idx) / len(style_frame)),
            "conditionCounts": {str(key): int(value) for key, value in conditions.items()},
            "topDescriptorEffects": [
                {"feature": STYLE_FIELDS[int(j)], "standardizedMeanEffect": float(effect[int(j)])}
                for j in order[:10]
            ],
            "exampleGames": [
                str(style_frame.iloc[int(j)]["gameId"])
                for j in idx[: min(5, len(idx))]
            ],
        }
    return output


def main():
    options = parse_args()
    features_dir = Path(options.features).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads((features_dir / "feature-audit.json").read_text(encoding="utf-8"))
    candidate = json.loads(Path(options.candidate).resolve().read_text(encoding="utf-8"))
    confirmation = json.loads(Path(options.confirmation).resolve().read_text(encoding="utf-8"))
    namua_audit = json.loads(Path(options.namua).resolve().read_text(encoding="utf-8"))

    if feature_audit.get("auditHash") != EXPECTED_FEATURE_AUDIT_HASH:
        raise RuntimeError("unexpected Stage 1 feature-audit hash")
    if candidate.get("candidateDefinitionHash") != EXPECTED_CANDIDATE_HASH:
        raise RuntimeError("unexpected mtaji candidate-definition hash")
    if confirmation.get("resultHash") != EXPECTED_STAGE2_RESULT_HASH or confirmation.get("formalDecision") != "confirmed":
        raise RuntimeError("Stage 2 mtaji formal confirmation mismatch")
    if namua_audit.get("auditHash") != EXPECTED_NAMUA_AUDIT_HASH:
        raise RuntimeError("unexpected Stage 3 namua audit hash")
    if namua_audit.get("discreteTypeSearchAuthorized") is not False:
        raise RuntimeError("namua boundary mismatch")

    frame = pd.read_csv(features_dir / "eligible-primary-rule-state.csv")
    style = game_descriptors(frame, candidate, namua_audit)
    if len(style) < 60:
        raise RuntimeError(f"too few full-phase games for style discovery: {len(style)}")

    values = style[STYLE_FIELDS].astype(float).to_numpy()
    scaler = StandardScaler().fit(values)
    matrix = scaler.transform(values)
    pca, pca_report = pca_summary(matrix, STYLE_FIELDS)
    pc_scores = pca.transform(matrix)

    clustering = cluster_diagnostic(matrix, style["conditionId"].astype(str).to_numpy())

    candidate_ks = [2, 3, 4, 5, 6]
    stability = {}
    profiles = {}
    for k in candidate_ks:
        _, labels = fit_models(matrix, k)
        stability[str(k)] = {
            "kmeans": resample_stability(
                style, labels["kmeans"], "kmeans", k,
                options.resample_repetitions, options.resample_game_fraction,
            ),
            "gmm-diag": resample_stability(
                style, labels["gmm-diag"], "gmm-diag", k,
                options.resample_repetitions, options.resample_game_fraction,
            ),
        }
        profiles[str(k)] = {
            "kmeans": cluster_profiles(style, matrix, labels["kmeans"], k),
            "gmm-diag": cluster_profiles(style, matrix, labels["gmm-diag"], k),
        }

    style_table = []
    for _, row in style.iterrows():
        item = {key: row[key] for key in ["gameId", "conditionId", "namuaRows", "mtajiRows", "mtajiEntryPly", "lastEligiblePly"]}
        for field in STYLE_FIELDS:
            item[field] = float(row[field])
        style_table.append(item)

    report = {
        "schemaVersion": 1,
        "status": "stage4-playing-style-trajectory-audit-complete",
        "formalExperiment": False,
        "exploratory": True,
        "playingStylesNamed": False,
        "finalStyleCountSelected": False,
        "futureStyleConfirmationSeedsTouched": False,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourceMtajiCandidateDefinitionHash": candidate["candidateDefinitionHash"],
        "sourceStage2FormalResultHash": confirmation["resultHash"],
        "sourceNamuaGradientAuditHash": namua_audit["auditHash"],
        "design": {
            "unit": "one full-phase game trajectory",
            "fullPhaseRequired": True,
            "aiConditionLabelsUsedAsFeatures": False,
            "aiConditionLabelsAreMetadataOnly": True,
            "styleDescriptorFields": STYLE_FIELDS,
            "mtajiClassifierRefit": False,
            "namuaCoordinateScaler": "refit on Stage 1 capped namua rows to reproduce Stage 3 exploratory coordinates",
            "kDiagnosticRange": [2, 3, 4, 5, 6],
            "resampleRepetitions": int(options.resample_repetitions),
            "resampleGameFraction": float(options.resample_game_fraction),
        },
        "population": {
            "gamesTotalStage1": int(frame["gameId"].nunique()),
            "fullPhaseGames": int(len(style)),
            "conditionCounts": {
                str(k): int(v)
                for k, v in style["conditionId"].value_counts().sort_index().items()
            },
        },
        "styleDescriptorTable": style_table,
        "pca": pca_report,
        "densityDiagnostics": {
            "PC1": density(pc_scores[:, 0]),
            "PC2": density(pc_scores[:, 1]),
            "PC3": density(pc_scores[:, 2]),
        },
        "clusteringDiagnostics": clustering,
        "trajectoryResamplingStability": stability,
        "clusterProfiles": profiles,
        "interpretationBoundary": {
            "positionTypeAndPlayingStyleSeparated": True,
            "mtajiOntologyUnchanged": True,
            "namuaCoordinatesRemainContinuous": True,
            "conditionLabelsMayNotBeNamedAsStyles": True,
            "samePilotDiscoveryIsNotConfirmation": True,
            "noPostHocKSelectionForConfirmation": True,
        },
    }
    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    report["auditHash"] = hashlib.sha256(encoded).hexdigest()

    output_path = output_dir / "playing-style-trajectory-audit.json"
    atomic_json(output_path, report)
    print(json.dumps({
        "passed": True,
        "output": str(output_path),
        "auditHash": report["auditHash"],
        "fullPhaseGames": len(style),
        "formalExperiment": False,
        "exploratory": True,
    }, indent=2))


if __name__ == "__main__":
    main()
