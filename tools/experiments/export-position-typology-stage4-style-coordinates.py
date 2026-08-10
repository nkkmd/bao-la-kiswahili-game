#!/usr/bin/env python3
"""Export the exact Stage 4 discovery continuous playing-style coordinates.

This freezes the discovery-side 10-descriptor StandardScaler plus canonicalized
PC1-PC4 PCA transform. It does not touch future style-confirmation seeds and it
does not perform confirmation.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "playing-style-trajectory-audit.json"
)
DEFAULT_OUTPUT = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-coordinate-definition-v1"
)
EXPECTED_AUDIT_HASH = "bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c"
EXPECTED_MTAJI_HASH = "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d"
EXPECTED_NAMUA_HASH = "099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a"
EXPECTED_STAGE2_HASH = "26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347"

FEATURE_ORDER = [
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

AXES = [
    {
        "id": "STYLE-C1",
        "alias": "Engagement-Persistence",
        "anchor": "mtajiM1Fraction",
    },
    {
        "id": "STYLE-C2",
        "alias": "Structural-Contrast Intensity",
        "anchor": "namuaStructuralContrastMean",
    },
    {
        "id": "STYLE-C3",
        "alias": "Activity-Escalation Dynamics",
        "anchor": "namuaCaptureActivityTrendRho",
    },
    {
        "id": "STYLE-C4",
        "alias": "Morphology-Switching Tempo",
        "anchor": "mtajiTypeSwitchRate",
    },
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    return parser.parse_args()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    temporary.replace(path)


def canonical_json_hash(value) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def string_set_hash(values) -> str:
    encoded = "\n".join(sorted(str(value) for value in values)).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def main():
    options = parse_args()
    input_path = Path(options.input).resolve()
    output_dir = Path(options.output).resolve()
    audit = json.loads(input_path.read_text(encoding="utf-8"))

    checks = {
        "auditHash": audit.get("auditHash") == EXPECTED_AUDIT_HASH,
        "formalExperiment": audit.get("formalExperiment") is False,
        "exploratory": audit.get("exploratory") is True,
        "futureSeedsUntouched": audit.get("futureStyleConfirmationSeedsTouched") is False,
        "finalStyleCountUnselected": audit.get("finalStyleCountSelected") is False,
        "playingStylesUnnamed": audit.get("playingStylesNamed") is False,
        "mtajiHash": audit.get("sourceMtajiCandidateDefinitionHash") == EXPECTED_MTAJI_HASH,
        "namuaHash": audit.get("sourceNamuaGradientAuditHash") == EXPECTED_NAMUA_HASH,
        "stage2Hash": audit.get("sourceStage2FormalResultHash") == EXPECTED_STAGE2_HASH,
        "featureOrder": audit.get("design", {}).get("styleDescriptorFields") == FEATURE_ORDER,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        raise RuntimeError(f"Stage 4 audit boundary mismatch: {failed}")

    frame = pd.DataFrame(audit["styleDescriptorTable"])
    if len(frame) != int(audit["population"]["fullPhaseGames"]):
        raise RuntimeError("style descriptor row count mismatch")
    if frame["gameId"].nunique() != len(frame):
        raise RuntimeError("duplicate game IDs in style descriptor table")
    if frame[FEATURE_ORDER].isna().any().any():
        raise RuntimeError("missing style descriptor values")

    raw = frame[FEATURE_ORDER].astype(float).to_numpy()
    scaler = StandardScaler().fit(raw)
    standardized = scaler.transform(raw)
    pca = PCA().fit(standardized)

    expected_evr = np.asarray(audit["pca"]["explainedVarianceRatio"], dtype=float)
    if not np.allclose(pca.explained_variance_ratio_, expected_evr, rtol=0, atol=1e-12):
        raise RuntimeError("PCA explained variance does not reproduce Stage 4 audit")

    components = pca.components_.copy()
    scores = standardized @ components.T
    axis_reports = []
    for index, axis in enumerate(AXES):
        anchor_index = FEATURE_ORDER.index(axis["anchor"])
        sign_flipped = False
        if components[index, anchor_index] < 0:
            components[index] *= -1.0
            scores[:, index] *= -1.0
            sign_flipped = True
        anchor_loading = float(components[index, anchor_index])
        if anchor_loading <= 0:
            raise RuntimeError(f"failed to orient {axis['id']}")
        axis_reports.append({
            **axis,
            "componentIndexZeroBased": index,
            "explainedVarianceRatio": float(pca.explained_variance_ratio_[index]),
            "anchorLoadingCanonical": anchor_loading,
            "signFlippedFromSklearnFit": sign_flipped,
            "discoveryScoreMean": float(np.mean(scores[:, index])),
            "discoveryScoreStdPopulation": float(np.std(scores[:, index], ddof=0)),
        })

    report = {
        "schemaVersion": 1,
        "status": "stage4-playing-style-coordinate-definition-exported",
        "formalExperiment": False,
        "exploratory": True,
        "confirmationPerformed": False,
        "futureStyleConfirmationSeedsTouched": False,
        "coordinateDefinitionFrozenForPreregistration": True,
        "sourceStage4AuditHash": audit["auditHash"],
        "sourceMtajiCandidateDefinitionHash": audit["sourceMtajiCandidateDefinitionHash"],
        "sourceNamuaGradientAuditHash": audit["sourceNamuaGradientAuditHash"],
        "sourceStage2FormalResultHash": audit["sourceStage2FormalResultHash"],
        "discoveryPopulation": {
            "unit": "one full-phase game trajectory",
            "games": int(len(frame)),
            "gameIdSetHash": string_set_hash(frame["gameId"].astype(str)),
            "conditionCounts": audit["population"]["conditionCounts"],
        },
        "representation": {
            "name": "playing-style-trajectory-descriptor-v1",
            "featureOrder": FEATURE_ORDER,
            "dimensions": len(FEATURE_ORDER),
            "standardization": "StandardScaler fit on Stage 4 discovery game trajectories only",
        },
        "scaler": {
            "mean": [float(value) for value in scaler.mean_],
            "scale": [float(value) for value in scaler.scale_],
            "var": [float(value) for value in scaler.var_],
        },
        "pca": {
            "algorithm": "sklearn.decomposition.PCA full fit",
            "allExplainedVarianceRatio": [float(value) for value in pca.explained_variance_ratio_],
            "allCumulativeExplainedVariance": [
                float(value) for value in np.cumsum(pca.explained_variance_ratio_)
            ],
            "frozenCoordinateCount": 4,
            "componentsCanonical": [
                [float(value) for value in components[index]]
                for index in range(4)
            ],
            "axes": axis_reports,
            "canonicalOrientationRule": "for each frozen PC, multiply by -1 if needed so its declared behavioral anchor loading is positive",
        },
        "discoveryDecision": {
            "geometry": "continuous-multi-axis",
            "discreteStyleSetPromoted": False,
            "postHocClusterRescueAllowed": False,
        },
        "interpretationBoundary": {
            "coordinatesAreTrajectoryLevelPlayingStyleDescriptors": True,
            "notPositionTypes": True,
            "notAIImplementationLabels": True,
            "notOutcomeClasses": True,
            "aliasesAreBehavioralDescriptions": True,
            "requiresIndependentFutureConfirmation": True,
        },
    }

    report["styleCoordinateDefinitionHash"] = canonical_json_hash(report)
    output_path = output_dir / "style-coordinate-definition.json"
    atomic_json(output_path, report)
    print(json.dumps({
        "passed": True,
        "output": str(output_path),
        "styleCoordinateDefinitionHash": report["styleCoordinateDefinitionHash"],
        "games": len(frame),
        "frozenCoordinateCount": 4,
        "futureStyleConfirmationSeedsTouched": False,
    }, indent=2))


if __name__ == "__main__":
    main()
