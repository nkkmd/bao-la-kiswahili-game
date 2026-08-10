#!/usr/bin/env python3
"""Formal Stage 2 held-out confirmation of the frozen mtaji candidate.

The discovery classifier is never refit. The script also performs the separately
preregistered de-novo k=2 replication checks and applies the preregistered
decision rule without alternative-k/feature/preprocessing rescue.
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
from scipy.signal import find_peaks
from scipy.stats import gaussian_kde
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, silhouette_score
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = "artifacts/local/position-typology/stage2-mtaji-confirmation-v1"
DEFAULT_CANDIDATE = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
)
DEFAULT_SPEC = "doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json"
DEFAULT_OUTPUT = f"{DEFAULT_INPUT}/confirmation-result.json"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--candidate", default=DEFAULT_CANDIDATE)
    parser.add_argument("--spec", default=DEFAULT_SPEC)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    return parser.parse_args()


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def canonical_hash(value, omitted_key=None):
    clone = json.loads(json.dumps(value))
    if omitted_key is not None:
        clone.pop(omitted_key, None)
    encoded = json.dumps(
        clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    temporary.replace(path)


def game_files(root):
    return sorted((Path(root) / "games").glob("game-*.json"))


def transformed_side(observation, side, field, log_fields):
    value = float(observation["features"][side][field])
    if field in log_fields:
        if value < 0:
            raise RuntimeError(f"negative value in log field {side}.{field}")
        value = math.log1p(value)
    return value


def invariant_vector(observation, candidate):
    base_fields = candidate["representation"]["baseFields"]
    log_fields = set(candidate["representation"]["log1pBaseFields"])
    names = []
    values = []
    for field in base_fields:
        actor = transformed_side(observation, "actor", field, log_fields)
        opponent = transformed_side(observation, "opponent", field, log_fields)
        names.extend([f"total.{field}", f"absDifference.{field}"])
        values.extend([actor + opponent, abs(actor - opponent)])
    actor_forced = float(observation["features"]["actor"]["forcedCapture"])
    opponent_forced = float(observation["features"]["opponent"]["forcedCapture"])
    names.extend(["total.forcedCapture", "absDifference.forcedCapture"])
    values.extend([
        actor_forced + opponent_forced,
        abs(actor_forced - opponent_forced),
    ])
    return names, np.asarray(values, dtype=float)


def collect_rows(games, candidate, spec):
    minimum_ply = int(spec["population"]["minimumPlyInclusive"])
    phase = spec["population"]["phase"]
    rows = []
    for game in games:
        for observation in game["observations"]:
            if observation["terminal"]:
                continue
            if int(observation["ply"]) < minimum_ply:
                continue
            if observation["phase"] != phase:
                continue
            names, vector = invariant_vector(observation, candidate)
            rows.append({
                "gameId": game["gameId"],
                "conditionId": game["conditionId"],
                "seed": int(game["seed"]),
                "ply": int(observation["ply"]),
                "ruleStateKey": observation["identity"]["ruleStateKey"],
                "features": vector,
                "featureNames": names,
            })
    return rows


def dedup_rule_state(rows):
    seen = set()
    output = []
    for row in rows:
        key = row["ruleStateKey"]
        if key not in seen:
            seen.add(key)
            output.append(row)
    return output


def sha_order(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def cap_by_game(rows, cap):
    groups = {}
    for row in rows:
        groups.setdefault(row["gameId"], []).append(row)
    output = []
    for game_id in sorted(groups):
        group = groups[game_id]
        ranked = sorted(group, key=lambda row: sha_order(row["ruleStateKey"]))
        output.extend(ranked[:cap])
    return output


def matrix(rows):
    if not rows:
        return np.empty((0, 0))
    return np.vstack([row["features"] for row in rows])


def frozen_transform(raw, candidate):
    mean = np.asarray(candidate["scaler"]["mean"], dtype=float)
    scale = np.asarray(candidate["scaler"]["scale"], dtype=float)
    if raw.shape[1] != len(mean) or len(mean) != len(scale):
        raise RuntimeError("candidate scaler dimension mismatch")
    if np.any(scale <= 0):
        raise RuntimeError("candidate scaler has nonpositive scale")
    return (raw - mean) / scale


def frozen_assign(standardized, candidate):
    centers = np.asarray(candidate["clustering"]["centersStandardized"], dtype=float)
    distances = np.linalg.norm(
        standardized[:, None, :] - centers[None, :, :],
        axis=2,
    )
    raw_labels = np.argmin(distances, axis=1)
    mapping = candidate["clustering"]["rawLabelToCanonical"]
    canonical = np.asarray([mapping[str(int(label))] for label in raw_labels], dtype=object)
    return raw_labels, canonical, distances


def axis_projection(standardized, centers):
    centers = np.asarray(centers, dtype=float)
    axis = centers[1] - centers[0]
    norm = np.linalg.norm(axis)
    if norm == 0:
        raise RuntimeError("frozen centroid axis has zero norm")
    unit = axis / norm
    midpoint = (centers[0] + centers[1]) / 2
    return (standardized - midpoint) @ unit


def gmm_axis(values, settings):
    x = np.asarray(values, dtype=float).reshape(-1, 1)
    output = {}
    for components in settings["components"]:
        model = GaussianMixture(
            n_components=int(components),
            covariance_type=settings["covarianceType"],
            n_init=int(settings["nInit"]),
            reg_covar=float(settings["regCovar"]),
            random_state=int(settings["randomState"]),
        ).fit(x)
        output[str(components)] = {
            "aic": float(model.aic(x)),
            "bic": float(model.bic(x)),
            "weights": [float(v) for v in model.weights_],
            "means": [float(v) for v in model.means_.ravel()],
            "stddev": [float(np.sqrt(v)) for v in model.covariances_.reshape(-1)],
        }
    return output


def kde_shape(values, grid_points=512):
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
        "twoPeakValley": None,
    }
    if len(top) >= 2:
        left, right = sorted(top[:2])
        valley = left + int(np.argmin(density[left:right + 1]))
        denominator = min(density[left], density[right])
        result["twoPeakValley"] = {
            "leftPeakX": float(grid[left]),
            "rightPeakX": float(grid[right]),
            "valleyX": float(grid[valley]),
            "valleyToLowerPeakDensityRatio": (
                float(density[valley] / denominator) if denominator > 0 else None
            ),
        }
    return result


def fit_de_novo(raw, settings):
    scaler = StandardScaler().fit(raw)
    x = scaler.transform(raw)
    km_settings = settings["kmeans"]
    gm_settings = settings["gmm"]
    ward_settings = settings["ward"]
    kmeans = KMeans(
        n_clusters=int(km_settings["nClusters"]),
        n_init=int(km_settings["nInit"]),
        random_state=int(km_settings["randomState"]),
    ).fit(x)
    gmm = GaussianMixture(
        n_components=int(gm_settings["nComponents"]),
        covariance_type=gm_settings["covarianceType"],
        n_init=int(gm_settings["nInit"]),
        reg_covar=float(gm_settings["regCovar"]),
        random_state=int(gm_settings["randomState"]),
    ).fit(x)
    ward = AgglomerativeClustering(
        n_clusters=int(ward_settings["nClusters"]),
        linkage=ward_settings["linkage"],
    ).fit(x)
    return x, {
        "kmeans": kmeans.labels_,
        "gmm-diag": gmm.predict(x),
        "ward": ward.labels_,
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


def trajectory_subsampling(rows, frozen_labels, spec):
    gate = spec["primaryConfirmationGates"]["G5_trajectory_subsample_robustness"]
    settings = spec["analysisSettings"]["kmeans"]
    games = np.array(sorted({row["gameId"] for row in rows}))
    take = max(2, int(math.ceil(len(games) * float(gate["gameFraction"]))))
    rng = np.random.default_rng(int(gate["randomState"]))
    scores = []
    rows_by_game = {}
    labels_by_game = {}
    for row, label in zip(rows, frozen_labels):
        rows_by_game.setdefault(row["gameId"], []).append(row)
        labels_by_game.setdefault(row["gameId"], []).append(label)

    for repeat in range(int(gate["repetitions"])):
        selected = set(rng.choice(games, size=take, replace=False).tolist())
        selected_rows = []
        selected_labels = []
        for game_id in sorted(selected):
            selected_rows.extend(rows_by_game[game_id])
            selected_labels.extend(labels_by_game[game_id])
        raw = matrix(selected_rows)
        x = StandardScaler().fit_transform(raw)
        model = KMeans(
            n_clusters=2,
            n_init=int(settings["nInit"]),
            random_state=int(gate["randomState"]) + repeat + 1,
        ).fit(x)
        scores.append(float(adjusted_rand_score(selected_labels, model.labels_)))
    return quantiles(scores)


def consecutive_persistence(rows, labels):
    groups = {}
    for row, label in zip(rows, labels):
        item = dict(row)
        item["cluster"] = str(label)
        groups.setdefault(row["gameId"], []).append(item)
    transitions = Counter()
    pair_count = same = flips = 0
    runs = []
    for game_id in sorted(groups):
        group = sorted(groups[game_id], key=lambda row: row["ply"])
        current = None
        length = 0
        previous = None
        for row in group:
            consecutive = previous is not None and row["ply"] - previous["ply"] == 1
            if consecutive:
                pair_count += 1
                transitions[(previous["cluster"], row["cluster"])] += 1
                if previous["cluster"] == row["cluster"]:
                    same += 1
                else:
                    flips += 1
            if current is None:
                current = row["cluster"]
                length = 1
            elif consecutive and row["cluster"] == current:
                length += 1
            else:
                if length:
                    runs.append(length)
                current = row["cluster"]
                length = 1
            previous = row
        if length:
            runs.append(length)
    return {
        "pairCount": int(pair_count),
        "sameTypeRate": float(same / pair_count) if pair_count else None,
        "flipRate": float(flips / pair_count) if pair_count else None,
        "transitionCounts": {
            f"{left}->{right}": int(count)
            for (left, right), count in sorted(transitions.items())
        },
        "runLength": quantiles(runs) if runs else None,
    }


def feature_means(rows, labels, names):
    raw = matrix(rows)
    result = {}
    for label in sorted(set(labels)):
        mask = np.asarray(labels) == label
        means = raw[mask].mean(axis=0)
        result[str(label)] = {
            name: float(means[index]) for index, name in enumerate(names)
        }
    return result


def evaluate_gates(spec, technical, fractions, silhouette, axis_gmm, de_novo_ari, subsample):
    gates = {}
    g1 = spec["primaryConfirmationGates"]["G1_type_noncollapse"]
    gates["G1_type_noncollapse"] = {
        "passed": min(fractions.values()) >= float(g1["threshold"]),
        "observed": float(min(fractions.values())),
        "threshold": float(g1["threshold"]),
    }

    g2 = spec["primaryConfirmationGates"]["G2_frozen_separation"]
    gates["G2_frozen_separation"] = {
        "passed": silhouette >= float(g2["threshold"]),
        "observed": float(silhouette),
        "threshold": float(g2["threshold"]),
    }

    b1 = axis_gmm["1"]["bic"]
    b2 = axis_gmm["2"]["bic"]
    b3 = axis_gmm["3"]["bic"]
    gates["G3_axis_discreteness"] = {
        "passed": (b2 <= b1 - 10.0) and (b2 < b3),
        "bic1": float(b1),
        "bic2": float(b2),
        "bic3": float(b3),
        "deltaBic1Minus2": float(b1 - b2),
        "deltaBic3Minus2": float(b3 - b2),
    }

    values = sorted(float(v) for v in de_novo_ari.values())
    passing = sum(v >= 0.70 for v in values)
    median = float(np.median(values))
    gates["G4_de_novo_agreement"] = {
        "passed": passing >= 2 and median >= 0.70,
        "ari": {key: float(value) for key, value in de_novo_ari.items()},
        "countAtLeast070": int(passing),
        "median": median,
    }

    g5 = spec["primaryConfirmationGates"]["G5_trajectory_subsample_robustness"]
    gates["G5_trajectory_subsample_robustness"] = {
        "passed": subsample["p10"] >= float(g5["threshold"]),
        "observedP10": float(subsample["p10"]),
        "threshold": float(g5["threshold"]),
        "distribution": subsample,
    }

    technical_pass = all(item["passed"] for item in technical.values())
    primary_pass = all(item["passed"] for item in gates.values())
    if not technical_pass:
        decision = "inconclusive"
    elif primary_pass:
        decision = "confirmed"
    else:
        decision = "not-confirmed"
    return gates, decision


def main():
    args = parse_args()
    input_dir = Path(args.input).resolve()
    candidate_path = Path(args.candidate).resolve()
    spec_path = Path(args.spec).resolve()

    manifest = read_json(input_dir / "manifest.json")
    verification = read_json(input_dir / "verification.json")
    candidate = read_json(candidate_path)
    spec = read_json(spec_path)

    spec_file_sha256 = hashlib.sha256(spec_path.read_bytes()).hexdigest()
    if spec.get("preregistrationId") != "PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1":
        raise RuntimeError("preregistration id mismatch")
    if canonical_hash(candidate, "candidateDefinitionHash") != candidate["candidateDefinitionHash"]:
        raise RuntimeError("candidate definition hash mismatch")
    if candidate["candidateDefinitionHash"] != spec["candidateDefinition"]["requiredHash"]:
        raise RuntimeError("wrong frozen candidate definition")
    if manifest.get("formalExperiment") is not True or manifest.get("exploratory") is not False:
        raise RuntimeError("manifest formal boundary mismatch")
    if verification.get("passed") is not True:
        raise RuntimeError("full replay verification must pass before confirmation analysis")
    if manifest["preregistrationId"] != spec["preregistrationId"]:
        raise RuntimeError("manifest/spec id mismatch")
    if manifest["preregistrationSpecFileSha256"] != spec_file_sha256:
        raise RuntimeError("manifest/spec file hash mismatch")
    if manifest["candidateDefinitionHash"] != candidate["candidateDefinitionHash"]:
        raise RuntimeError("manifest/candidate hash mismatch")
    if verification["preregistrationId"] != spec["preregistrationId"]:
        raise RuntimeError("verification/spec id mismatch")
    if verification["preregistrationSpecFileSha256"] != spec_file_sha256:
        raise RuntimeError("verification/spec file hash mismatch")

    files = game_files(input_dir)
    games = [read_json(path) for path in files]
    if len(games) != int(spec["corpus"]["games"]):
        raise RuntimeError("formal game count mismatch")

    raw_rows = collect_rows(games, candidate, spec)
    deduped = dedup_rule_state(raw_rows)
    capped = cap_by_game(deduped, int(spec["population"]["capPerGamePhase"]))
    if not capped:
        raise RuntimeError("no held-out mtaji rows")

    expected_names = candidate["representation"]["fieldOrder"]
    actual_names = capped[0]["featureNames"]
    if actual_names != expected_names:
        raise RuntimeError("candidate feature order mismatch")
    if any(row["featureNames"] != expected_names for row in capped):
        raise RuntimeError("held-out feature order inconsistent")

    raw = matrix(capped)
    frozen_x = frozen_transform(raw, candidate)
    raw_frozen_labels, frozen_labels, distances = frozen_assign(frozen_x, candidate)
    label_counts = Counter(str(label) for label in frozen_labels)
    label_fractions = {
        label: float(label_counts.get(label, 0) / len(capped))
        for label in candidate["provisionalLabels"]
    }
    if len(set(frozen_labels)) >= 2:
        frozen_silhouette = float(silhouette_score(frozen_x, frozen_labels))
    else:
        frozen_silhouette = -1.0

    projection = axis_projection(
        frozen_x,
        candidate["clustering"]["centersStandardized"],
    )
    axis_gmm = gmm_axis(projection, spec["analysisSettings"]["axisGmm"])
    kde = kde_shape(projection)

    heldout_x, de_novo_labels = fit_de_novo(raw, spec["analysisSettings"])
    de_novo_ari = {
        method: float(adjusted_rand_score(frozen_labels, labels))
        for method, labels in de_novo_labels.items()
    }
    pairwise_de_novo_ari = {}
    methods = ["kmeans", "gmm-diag", "ward"]
    for i, left in enumerate(methods):
        for right in methods[i + 1:]:
            pairwise_de_novo_ari[f"{left}|{right}"] = float(
                adjusted_rand_score(de_novo_labels[left], de_novo_labels[right])
            )

    conditions = np.asarray([row["conditionId"] for row in capped], dtype=object)
    condition_nmi = float(normalized_mutual_info_score(conditions, frozen_labels))
    per_condition = {}
    for condition in spec["corpus"]["conditions"]:
        cid = condition["id"]
        mask = conditions == cid
        denominator = int(np.sum(mask))
        counts = Counter(str(label) for label in frozen_labels[mask])
        per_condition[cid] = {
            "rows": denominator,
            "fractions": {
                label: float(counts.get(label, 0) / denominator) if denominator else None
                for label in candidate["provisionalLabels"]
            },
        }

    subsample = trajectory_subsampling(capped, frozen_labels, spec)
    _, deduped_labels, _ = frozen_assign(
        frozen_transform(matrix(deduped), candidate),
        candidate,
    )
    persistence = consecutive_persistence(deduped, deduped_labels)
    profile_means = feature_means(capped, frozen_labels, expected_names)

    contributing_games = len({row["gameId"] for row in capped})
    technical = {
        "T1_fullReplayVerification": {
            "passed": verification.get("passed") is True,
            "observed": bool(verification.get("passed")),
        },
        "T2_contributingGames": {
            "passed": contributing_games >= int(spec["population"]["technicalMinimumContributingGames"]),
            "observed": int(contributing_games),
            "threshold": int(spec["population"]["technicalMinimumContributingGames"]),
        },
        "T3_cappedRows": {
            "passed": len(capped) >= int(spec["population"]["technicalMinimumCappedRows"]),
            "observed": int(len(capped)),
            "threshold": int(spec["population"]["technicalMinimumCappedRows"]),
        },
    }

    gates, decision = evaluate_gates(
        spec,
        technical,
        label_fractions,
        frozen_silhouette,
        axis_gmm,
        de_novo_ari,
        subsample,
    )

    sorted_distances = np.sort(distances, axis=1)
    report = {
        "schemaVersion": 1,
        "status": "stage2-mtaji-independent-confirmation-complete",
        "formalExperiment": True,
        "exploratory": False,
        "candidateDefinitionHash": candidate["candidateDefinitionHash"],
        "preregistrationId": spec["preregistrationId"],
        "preregistrationSpecFileSha256": spec_file_sha256,
        "sourceManifestConfigHash": manifest["configHash"],
        "sourceVerificationSummaryHash": verification["summaryHash"],
        "environment": {
            "python": sys.version.split()[0],
            "platform": platform.platform(),
        },
        "population": {
            "games": len(games),
            "rawEligibleMtajiRows": len(raw_rows),
            "ruleStateDedupRows": len(deduped),
            "cappedRows": len(capped),
            "contributingGames": contributing_games,
            "conditionRows": {
                key: int(value)
                for key, value in sorted(Counter(row["conditionId"] for row in capped).items())
            },
        },
        "frozenClassifier": {
            "refitPerformed": False,
            "restandardizedOnHeldout": False,
            "canonicalCounts": dict(sorted(label_counts.items())),
            "canonicalFractions": label_fractions,
            "silhouette": frozen_silhouette,
            "axisProjectionGmm": axis_gmm,
            "axisProjectionKde": kde,
            "conditionNMI": condition_nmi,
            "perCondition": per_condition,
            "meanCentroidDistanceMargin": float(np.mean(sorted_distances[:, 1] - sorted_distances[:, 0])),
        },
        "deNovoReplication": {
            "heldoutStandardScalerFit": True,
            "kSearchPerformed": False,
            "ariWithFrozen": de_novo_ari,
            "pairwiseMethodARI": pairwise_de_novo_ari,
        },
        "trajectorySubsampling": subsample,
        "trajectoryPersistence": persistence,
        "heldoutFeatureMeansByFrozenType": profile_means,
        "technicalGates": technical,
        "primaryConfirmationGates": gates,
        "formalDecision": decision,
        "decisionRule": spec["decisionRule"],
        "noPostHocRescue": True,
    }
    encoded = json.dumps(
        report, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    report["resultHash"] = hashlib.sha256(encoded).hexdigest()
    atomic_json(args.output, report)
    print(json.dumps({
        "passed": True,
        "formalDecision": decision,
        "candidateDefinitionHash": report["candidateDefinitionHash"],
        "preregistrationId": report["preregistrationId"],
        "preregistrationSpecFileSha256": report["preregistrationSpecFileSha256"],
        "resultHash": report["resultHash"],
        "output": str(Path(args.output).resolve()),
    }, indent=2))


if __name__ == "__main__":
    main()
