#!/usr/bin/env python3
"""Formal Stage 5 independent confirmation of frozen continuous playing-style coordinates."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from scipy.linalg import subspace_angles
from scipy.signal import find_peaks
from scipy.stats import gaussian_kde, spearmanr
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = "artifacts/local/position-typology/stage5-playing-style-confirmation-v1"
DEFAULT_COORDINATE = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-coordinate-definition-v1/style-coordinate-definition.json"
)
DEFAULT_INGREDIENT = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-ingredient-definition-v1/style-ingredient-definition.json"
)
DEFAULT_CANDIDATE = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
)
DEFAULT_SPEC = "doc/position-typology/preregistration/STAGE_5_PLAYING_STYLE_CONFIRMATION_SPEC.json"

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
RANDOM_STATE = 20359999


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--input", default=DEFAULT_INPUT)
    p.add_argument("--coordinate-definition", default=DEFAULT_COORDINATE)
    p.add_argument("--ingredient-definition", default=DEFAULT_INGREDIENT)
    p.add_argument("--candidate-definition", default=DEFAULT_CANDIDATE)
    p.add_argument("--spec", default=DEFAULT_SPEC)
    p.add_argument("--output", default=None)
    return p.parse_args()


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def canonical_hash(value):
    data = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def verify_embedded_hash(value, field):
    expected = value.get(field)
    copy = dict(value)
    copy.pop(field, None)
    actual = canonical_hash(copy)
    if expected != actual:
        raise RuntimeError(f"{field} mismatch: {actual} != {expected}")
    return actual


def file_sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def transformed_value(observation, side, field, log_fields):
    value = observation["features"][side][field]
    x = float(value)
    if field in log_fields:
        if x < 0:
            raise RuntimeError(f"negative log1p field: {field}")
        x = math.log1p(x)
    return x


def invariant_row(observation, base_fields, log_fields):
    row = []
    for field in base_fields:
        actor = transformed_value(observation, "actor", field, log_fields)
        opponent = transformed_value(observation, "opponent", field, log_fields)
        row.extend([actor + opponent, abs(actor - opponent)])
    return np.asarray(row, dtype=float)


def safe_rho(x, y):
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    if len(x) < 3 or len(np.unique(x)) < 2 or len(np.unique(y)) < 2:
        return 0.0
    value = spearmanr(x, y).statistic
    return float(value) if np.isfinite(value) else 0.0


def run_lengths(labels):
    if not labels:
        return []
    out = []
    current = labels[0]
    length = 1
    for label in labels[1:]:
        if label == current:
            length += 1
        else:
            out.append((current, length))
            current, length = label, 1
    out.append((current, length))
    return out


def namua_coordinates(observations, ingredient):
    state = ingredient["namuaStateCoordinates"]
    base_fields = list(state["baseFields"])
    log_fields = set(state["log1pBaseFields"])
    rows = np.vstack([
        invariant_row(obs, base_fields, log_fields) for obs in observations
    ])
    if rows.shape[1] != int(state["dimensions"]):
        raise RuntimeError("namua state dimension mismatch")
    if len(state["fieldOrder"]) != rows.shape[1]:
        raise RuntimeError("namua field order length mismatch")
    mean = np.asarray(state["scaler"]["mean"], dtype=float)
    scale = np.asarray(state["scaler"]["scale"], dtype=float)
    if np.any(scale <= 0):
        raise RuntimeError("non-positive frozen namua scale")
    z = (rows - mean) / scale
    index = {name: i for i, name in enumerate(state["fieldOrder"])}
    act_fields = state["captureActivity"]["componentFields"]
    con_fields = state["structuralContrast"]["componentFields"]
    act = np.mean(
        np.column_stack([z[:, index[f"total.{f}"]] for f in act_fields]), axis=1
    )
    con = np.mean(
        np.column_stack([z[:, index[f"absDifference.{f}"]] for f in con_fields]), axis=1
    )
    return act, con


def classify_mtaji(observations, candidate):
    rep = candidate["representation"]
    base_fields = list(rep["baseFields"])
    if "total.forcedCapture" in rep["fieldOrder"] and "forcedCapture" not in base_fields:
        base_fields.append("forcedCapture")
    log_fields = set(rep["log1pBaseFields"])
    rows = np.vstack([
        invariant_row(obs, base_fields, log_fields) for obs in observations
    ])
    if rows.shape[1] != len(rep["fieldOrder"]):
        raise RuntimeError("mtaji representation dimension mismatch")
    mean = np.asarray(candidate["scaler"]["mean"], dtype=float)
    scale = np.asarray(candidate["scaler"]["scale"], dtype=float)
    centers = np.asarray(candidate["clustering"]["centersStandardized"], dtype=float)
    z = (rows - mean) / scale
    distances = np.linalg.norm(z[:, None, :] - centers[None, :, :], axis=2)
    raw = np.argmin(distances, axis=1)
    mapping = candidate["clustering"]["rawLabelToCanonical"]
    return [mapping[str(int(label))] for label in raw]


def game_descriptor(game, ingredient, candidate, min_ply):
    eligible = [
        obs for obs in game["observations"]
        if int(obs["ply"]) >= min_ply and not bool(obs["terminal"])
    ]
    namua = sorted([obs for obs in eligible if obs["phase"] == "namua"], key=lambda x: x["ply"])
    mtaji = sorted([obs for obs in eligible if obs["phase"] == "mtaji"], key=lambda x: x["ply"])
    if not namua or not mtaji:
        return None

    act, con = namua_coordinates(namua, ingredient)
    n_ply = np.asarray([obs["ply"] for obs in namua], dtype=float)
    labels = classify_mtaji(mtaji, candidate)
    m_ply = [int(obs["ply"]) for obs in mtaji]
    pairs = [
        (labels[i], labels[i + 1])
        for i in range(len(labels) - 1)
        if m_ply[i + 1] - m_ply[i] == 1
    ]
    switch_rate = (
        sum(left != right for left, right in pairs) / len(pairs) if pairs else 0.0
    )
    runs = run_lengths(labels)
    m1_runs = [length for label, length in runs if label == "MTAJI-M1"]
    m2_runs = [length for label, length in runs if label == "MTAJI-M2"]

    return {
        "gameId": game["gameId"],
        "conditionId": game["conditionId"],
        "winner": game.get("winner"),
        "namuaRows": len(namua),
        "mtajiRows": len(mtaji),
        "namuaCaptureActivityMean": float(np.mean(act)),
        "namuaCaptureActivityStd": float(np.std(act, ddof=0)),
        "namuaCaptureActivityTrendRho": safe_rho(n_ply, act),
        "namuaStructuralContrastMean": float(np.mean(con)),
        "namuaStructuralContrastStd": float(np.std(con, ddof=0)),
        "namuaStructuralContrastTrendRho": safe_rho(n_ply, con),
        "mtajiM1Fraction": float(np.mean(np.asarray(labels) == "MTAJI-M1")),
        "mtajiTypeSwitchRate": float(switch_rate),
        "mtajiM1MeanDwell": float(np.mean(m1_runs)) if m1_runs else 0.0,
        "mtajiM2MeanDwell": float(np.mean(m2_runs)) if m2_runs else 0.0,
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
        "mean": float(np.mean(x)),
        "stdPopulation": float(np.std(x, ddof=0)),
    }


def condition_variance_fraction(values, conditions):
    x = np.asarray(values, dtype=float)
    conditions = np.asarray(conditions)
    mean = np.mean(x)
    total = float(np.sum((x - mean) ** 2))
    if total == 0:
        return 0.0
    between = 0.0
    for condition in sorted(set(conditions.tolist())):
        group = x[conditions == condition]
        between += len(group) * float((np.mean(group) - mean) ** 2)
    return float(between / total)


def density_diagnostic(values):
    x = np.asarray(values, dtype=float).reshape(-1, 1)
    gmm = {}
    for k in (1, 2, 3):
        model = GaussianMixture(
            n_components=k,
            covariance_type="full",
            n_init=20,
            reg_covar=1e-6,
            random_state=RANDOM_STATE,
        ).fit(x)
        gmm[str(k)] = {
            "bic": float(model.bic(x)),
            "aic": float(model.aic(x)),
            "weights": [float(v) for v in model.weights_],
            "means": [float(v) for v in model.means_.ravel()],
        }
    kde_report = {"peakCount": None, "topPeaks": []}
    if len(np.unique(x.ravel())) >= 2:
        grid = np.linspace(float(np.min(x)), float(np.max(x)), 512)
        density = gaussian_kde(x.ravel())(grid)
        peaks, _ = find_peaks(density)
        ordered = sorted(peaks, key=lambda i: density[i], reverse=True)
        kde_report = {
            "peakCount": int(len(peaks)),
            "topPeaks": [
                {"x": float(grid[i]), "density": float(density[i])}
                for i in ordered[:4]
            ],
        }
    return {"gmm1d": gmm, "kde": kde_report, "quantiles": quantiles(x.ravel())}


def main():
    args = parse_args()
    input_dir = Path(args.input).resolve()
    output = Path(args.output).resolve() if args.output else input_dir / "confirmation-result.json"
    spec_path = (ROOT / args.spec).resolve() if not Path(args.spec).is_absolute() else Path(args.spec)
    coordinate_path = Path(args.coordinate_definition).resolve()
    ingredient_path = Path(args.ingredient_definition).resolve()
    candidate_path = Path(args.candidate_definition).resolve()

    spec = read_json(spec_path)
    coordinate = read_json(coordinate_path)
    ingredient = read_json(ingredient_path)
    candidate = read_json(candidate_path)
    manifest = read_json(input_dir / "manifest.json")
    verification = read_json(input_dir / "verification.json")

    if spec["formalExperiment"] is not True or spec["exploratory"] is not False:
        raise RuntimeError("formal Stage 5 spec boundary mismatch")
    if spec["status"] != "preregistered-before-heldout-generation":
        raise RuntimeError("Stage 5 spec is not preregistered")
    if spec["executionBoundary"].get("formalRunAuthorized") is not True:
        raise RuntimeError("formal run not authorized by preregistration")

    coordinate_hash = verify_embedded_hash(coordinate, "styleCoordinateDefinitionHash")
    ingredient_hash = verify_embedded_hash(ingredient, "styleIngredientDefinitionHash")
    candidate_hash = verify_embedded_hash(candidate, "candidateDefinitionHash")
    if coordinate_hash != spec["coordinateDefinition"]["requiredHash"]:
        raise RuntimeError("style coordinate definition hash mismatch")
    if ingredient_hash != spec["coordinateIngredients"]["requiredHash"]:
        raise RuntimeError("style ingredient definition hash mismatch")
    if candidate_hash != spec["coordinateIngredients"]["mtajiClassifierDefinitionHash"]:
        raise RuntimeError("mtaji classifier hash mismatch")
    if ingredient["sourceStyleCoordinateDefinitionHash"] != coordinate_hash:
        raise RuntimeError("ingredient -> coordinate provenance mismatch")
    if ingredient["mtajiStateCoordinates"]["classifierDefinitionHash"] != candidate_hash:
        raise RuntimeError("ingredient -> mtaji classifier provenance mismatch")

    spec_sha = file_sha256(spec_path)
    if manifest.get("preregistrationId") != spec["preregistrationId"]:
        raise RuntimeError("manifest preregistration id mismatch")
    if manifest.get("coordinateDefinitionHash") != coordinate_hash:
        raise RuntimeError("manifest coordinate hash mismatch")
    if manifest.get("preregistrationSpecFileSha256") != spec_sha:
        raise RuntimeError("manifest preregistration spec SHA mismatch")
    if verification.get("passed") is not True:
        raise RuntimeError("full replay verification did not pass")
    if verification.get("preregistrationId") != spec["preregistrationId"]:
        raise RuntimeError("verification preregistration id mismatch")
    if verification.get("preregistrationSpecFileSha256") != spec_sha:
        raise RuntimeError("verification preregistration spec SHA mismatch")

    game_files = sorted((input_dir / "games").glob("game-*.json"))
    if len(game_files) != int(spec["corpus"]["games"]):
        raise RuntimeError("formal game file count mismatch")
    games = [read_json(path) for path in game_files]
    descriptors = []
    for game in games:
        row = game_descriptor(
            game, ingredient, candidate,
            int(spec["population"]["eligibleStateMinimumPlyInclusive"])
        )
        if row is not None:
            descriptors.append(row)

    conditions = [row["conditionId"] for row in descriptors]
    condition_counts = {
        condition: conditions.count(condition)
        for condition in [item["id"] for item in spec["corpus"]["conditions"]]
    }
    technical = {
        "T1_fullReplayVerification": bool(verification.get("passed")),
        "T2_fullPhaseGames": len(descriptors) >= int(spec["population"]["minimumFullPhaseGames"]),
        "T3_minimumPerCondition": min(condition_counts.values()) >= int(
            spec["population"]["minimumFullPhaseGamesPerCondition"]
        ),
    }
    technical_pass = all(technical.values())

    raw = np.asarray(
        [[float(row[field]) for field in STYLE_FIELDS] for row in descriptors],
        dtype=float,
    )
    if raw.shape[1] != int(coordinate["representation"]["dimensions"]):
        raise RuntimeError("style descriptor dimension mismatch")
    if coordinate["representation"]["featureOrder"] != STYLE_FIELDS:
        raise RuntimeError("frozen style feature order mismatch")
    style_mean = np.asarray(coordinate["scaler"]["mean"], dtype=float)
    style_scale = np.asarray(coordinate["scaler"]["scale"], dtype=float)
    components = np.asarray(coordinate["pca"]["componentsCanonical"], dtype=float)
    z = (raw - style_mean) / style_scale
    scores = z @ components.T

    total_variance = float(np.sum(np.var(z, axis=0, ddof=0)))
    frozen_variance = float(np.sum(np.var(scores, axis=0, ddof=0)))
    g1_value = frozen_variance / total_variance if total_variance > 0 else 0.0
    g1_pass = g1_value >= float(spec["primaryConfirmationGates"]["G1_frozen_subspace_variance"]["threshold"])

    pca = PCA(n_components=4).fit(z)
    angles = np.degrees(subspace_angles(components.T, pca.components_.T))
    max_angle = float(np.max(angles))
    mean_angle = float(np.mean(angles))
    g2_pass = max_angle <= 25.0 and mean_angle <= 15.0

    field_index = {field: i for i, field in enumerate(STYLE_FIELDS)}
    axis_ids = [axis["id"] for axis in coordinate["pca"]["axes"]]
    anchors = {axis["id"]: axis["anchor"] for axis in coordinate["pca"]["axes"]}
    correlations = {}
    for j, axis_id in enumerate(axis_ids):
        correlations[axis_id] = {}
        for field in STYLE_FIELDS:
            rho = spearmanr(scores[:, j], raw[:, field_index[field]]).statistic
            correlations[axis_id][field] = float(rho) if np.isfinite(rho) else 0.0

    anchor_thresholds = {
        "STYLE-C1": 0.35, "STYLE-C2": 0.35, "STYLE-C3": 0.35, "STYLE-C4": 0.35
    }
    g3_items = {
        axis: {
            "descriptor": anchors[axis],
            "rho": correlations[axis][anchors[axis]],
            "threshold": anchor_thresholds[axis],
            "pass": correlations[axis][anchors[axis]] >= anchor_thresholds[axis],
        }
        for axis in axis_ids
    }
    g3_pass = all(item["pass"] for item in g3_items.values())

    g4_items = []
    qualifying_by_axis = {axis: 0 for axis in axis_ids}
    for item in spec["primaryConfirmationGates"]["G4_non_anchor_behavioral_signature"]["associations"]:
        rho = correlations[item["coordinate"]][item["descriptor"]]
        sign_ok = rho > 0 if item["expectedSign"] == "positive" else rho < 0
        qualifies = bool(sign_ok and abs(rho) >= 0.20)
        if qualifies:
            qualifying_by_axis[item["coordinate"]] += 1
        g4_items.append({**item, "rho": float(rho), "qualifies": qualifies})
    qualifying_count = sum(item["qualifies"] for item in g4_items)
    g4_pass = qualifying_count >= 6 and all(v >= 1 for v in qualifying_by_axis.values())

    rng = np.random.default_rng(int(spec["analysisSettings"]["randomState"]))
    n = len(descriptors)
    take = max(4, int(math.ceil(n * float(spec["analysisSettings"]["subsample"]["gameFraction"]))))
    max_angles = []
    for _ in range(int(spec["analysisSettings"]["subsample"]["repetitions"])):
        idx = np.sort(rng.choice(n, size=take, replace=False))
        subset_pca = PCA(n_components=4).fit(z[idx])
        subset_angles = np.degrees(subspace_angles(components.T, subset_pca.components_.T))
        max_angles.append(float(np.max(subset_angles)))
    g5_p90 = float(np.quantile(max_angles, 0.90))
    g5_pass = g5_p90 <= float(
        spec["primaryConfirmationGates"]["G5_trajectory_subsample_subspace_robustness"]["thresholdDegrees"]
    )

    gates = {
        "G1_frozen_subspace_variance": {"value": g1_value, "threshold": 0.60, "pass": g1_pass},
        "G2_de_novo_subspace_alignment": {
            "anglesDegrees": [float(v) for v in angles],
            "maximumDegrees": max_angle,
            "meanDegrees": mean_angle,
            "pass": g2_pass,
        },
        "G3_behavioral_anchor_reproduction": {"items": g3_items, "pass": g3_pass},
        "G4_non_anchor_behavioral_signature": {
            "items": g4_items,
            "qualifyingCount": int(qualifying_count),
            "qualifyingByCoordinate": qualifying_by_axis,
            "pass": g4_pass,
        },
        "G5_trajectory_subsample_subspace_robustness": {
            "maximumAngleDegrees": quantiles(max_angles),
            "p90ThresholdDegrees": 30.0,
            "pass": g5_pass,
        },
    }

    if not technical_pass:
        decision = "inconclusive"
    elif all(gate["pass"] for gate in gates.values()):
        decision = "confirmed"
    else:
        decision = "not-confirmed"

    moments = {axis_ids[j]: quantiles(scores[:, j]) for j in range(4)}
    density = {axis_ids[j]: density_diagnostic(scores[:, j]) for j in range(4)}
    condition_assoc = {
        axis_ids[j]: condition_variance_fraction(scores[:, j], conditions) for j in range(4)
    }

    result = {
        "schemaVersion": 1,
        "status": "stage5-playing-style-continuous-independent-confirmation-complete",
        "formalExperiment": True,
        "exploratory": False,
        "preregistrationId": spec["preregistrationId"],
        "styleCoordinateDefinitionHash": coordinate_hash,
        "styleIngredientDefinitionHash": ingredient_hash,
        "mtajiCandidateDefinitionHash": candidate_hash,
        "preregistrationSpecFileSha256": spec_sha,
        "sourceManifestConfigHash": manifest.get("configHash"),
        "sourceVerificationSummaryHash": verification.get("summaryHash"),
        "population": {
            "gamesGenerated": len(games),
            "fullPhaseGames": len(descriptors),
            "conditionCounts": condition_counts,
        },
        "technicalGates": {**technical, "allPass": technical_pass},
        "primaryGates": gates,
        "formalDecision": decision,
        "frozenTransfer": {
            "namuaScalerRefitPerformed": False,
            "mtajiClassifierRefitPerformed": False,
            "styleScalerRefitPerformed": False,
            "stylePcaRefitForFrozenProjectionPerformed": False,
            "deNovoPcaUsedOnlyForSubspaceComparison": True,
            "clusterSearchPerformed": False,
            "postHocRescuePerformed": False,
        },
        "secondaryDiagnostics": {
            "coordinateMoments": moments,
            "coordinateDensity": density,
            "coordinateDescriptorSpearman": correlations,
            "conditionVarianceFraction": condition_assoc,
        },
        "decisionBoundary": {
            "discreteStyleSetPromoted": False,
            "coordinatesRemainTrajectoryLevel": True,
            "positionTypeAndPlayingStyleSeparated": True,
            "aiConditionLabelsAreMetadataOnly": True,
            "noPostHocRescue": True,
        },
    }
    result["resultHash"] = canonical_hash(result)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "passed": True,
        "formalDecision": decision,
        "output": str(output),
        "resultHash": result["resultHash"],
        "fullPhaseGames": len(descriptors),
    }, indent=2))


if __name__ == "__main__":
    main()
