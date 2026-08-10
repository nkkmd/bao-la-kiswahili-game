#!/usr/bin/env python3
"""Export the exact Stage 1 exploratory mtaji two-type candidate definition.

This is a discovery-corpus freeze artifact for later preregistration. It does
not touch held-out seeds, perform confirmation, or make the candidate formal.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
DEFAULT_INVARIANT_AUDIT = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json"
)
DEFAULT_OUTPUT = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1"
)
RANDOM_STATE = 20260809
CAP_PER_GAME_PHASE = 20

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


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--invariant-audit", default=DEFAULT_INVARIANT_AUDIT)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
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
            continue
        ranked = group.assign(
            _rank_key=group["ruleStateKey"].map(sha_order)
        ).sort_values("_rank_key")
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

    actor_forced = frame["actor.forcedCapture"].astype(float).to_numpy()
    opponent_forced = frame["opponent.forcedCapture"].astype(float).to_numpy()
    names += ["total.forcedCapture", "absDifference.forcedCapture"]
    arrays += [
        actor_forced + opponent_forced,
        np.abs(actor_forced - opponent_forced),
    ]
    return np.column_stack(arrays), names


def row_key_hash(frame: pd.DataFrame) -> str:
    encoded = "\n".join(sorted(frame["ruleStateKey"].astype(str))).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def cluster_feature_means(raw: np.ndarray, names, labels):
    output = {}
    for cluster in sorted(set(int(value) for value in labels)):
        mask = labels == cluster
        values = raw[mask].mean(axis=0)
        output[str(cluster)] = {
            name: float(values[index]) for index, name in enumerate(names)
        }
    return output


def canonical_label_mapping(raw: np.ndarray, names, labels):
    # Canonical orientation is intentionally independent of arbitrary K-means
    # label numbering. The more capture-engaged cluster is the one with the
    # larger transformed total.meanCapturableSeeds.
    target_index = names.index("total.meanCapturableSeeds")
    clusters = sorted(set(int(value) for value in labels))
    if len(clusters) != 2:
        raise RuntimeError("expected exactly two K-means clusters")

    means = {
        cluster: float(raw[labels == cluster, target_index].mean())
        for cluster in clusters
    }
    engaged = max(clusters, key=lambda cluster: means[cluster])
    sparse = min(clusters, key=lambda cluster: means[cluster])
    if means[engaged] == means[sparse]:
        raise RuntimeError("canonical label feature is tied")

    return {
        str(engaged): "MTAJI-M1",
        str(sparse): "MTAJI-M2",
    }, means


def main():
    options = parse_args()
    input_dir = Path(options.input).resolve()
    invariant_path = Path(options.invariant_audit).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads(
        (input_dir / "feature-audit.json").read_text(encoding="utf-8")
    )
    invariant_audit = json.loads(invariant_path.read_text(encoding="utf-8"))

    if feature_audit.get("formalExperiment") is not False:
        raise RuntimeError("feature audit formal boundary mismatch")
    if feature_audit.get("exploratory") is not True:
        raise RuntimeError("feature audit exploratory boundary mismatch")
    if invariant_audit.get("formalExperiment") is not False:
        raise RuntimeError("invariant audit formal boundary mismatch")
    if invariant_audit.get("exploratory") is not True:
        raise RuntimeError("invariant audit exploratory boundary mismatch")
    if invariant_audit.get("finalClusterCountSelected") is not False:
        raise RuntimeError("invariant audit unexpectedly selected final k")
    if invariant_audit.get("sourceFeatureAuditHash") != feature_audit.get("auditHash"):
        raise RuntimeError("feature audit hash mismatch")

    frame = pd.read_csv(input_dir / "eligible-primary-rule-state.csv")
    mtaji = frame[frame["phase"] == "mtaji"].copy()
    capped = balanced_capped(mtaji, CAP_PER_GAME_PHASE)

    expected_full = int(invariant_audit["population"]["fullRows"])
    expected_capped = int(invariant_audit["population"]["cappedRows"])
    expected_games = int(invariant_audit["population"]["games"])
    if len(mtaji) != expected_full:
        raise RuntimeError(f"mtaji row mismatch: {len(mtaji)} != {expected_full}")
    if len(capped) != expected_capped:
        raise RuntimeError(f"capped row mismatch: {len(capped)} != {expected_capped}")
    if capped["gameId"].nunique() != expected_games:
        raise RuntimeError("capped game count mismatch")

    raw, names = raw_invariant(capped)
    scaler = StandardScaler().fit(raw)
    matrix = scaler.transform(raw)
    model = KMeans(
        n_clusters=2,
        n_init=50,
        random_state=RANDOM_STATE,
    ).fit(matrix)
    labels = model.labels_

    mapping, canonical_feature_means = canonical_label_mapping(raw, names, labels)
    cluster_means = cluster_feature_means(raw, names, labels)
    counts = {
        str(cluster): int(np.sum(labels == cluster))
        for cluster in sorted(set(int(value) for value in labels))
    }

    canonical_counts = {
        mapping[raw_label]: counts[raw_label]
        for raw_label in sorted(mapping)
    }
    canonical_fractions = {
        label: float(count / len(capped))
        for label, count in canonical_counts.items()
    }

    report = {
        "schemaVersion": 1,
        "status": "stage1-mtaji-candidate-definition-exported",
        "formalExperiment": False,
        "exploratory": True,
        "confirmationPerformed": False,
        "futureHeldOutSeedsTouched": False,
        "candidateDefinitionFrozenForPreregistration": True,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourceInvariantMorphologyAuditHash": invariant_audit["auditHash"],
        "discoveryPopulation": {
            "phase": "mtaji",
            "terminalExcluded": True,
            "minimumPlyInclusive": 8,
            "populationView": "game-phase-capped",
            "capPerGamePhase": CAP_PER_GAME_PHASE,
            "selectionOrder": "SHA-256(ruleStateKey) lexical order",
            "fullRows": int(len(mtaji)),
            "trainingRows": int(len(capped)),
            "games": int(capped["gameId"].nunique()),
            "trainingRuleStateKeyHash": row_key_hash(capped),
        },
        "representation": {
            "name": "actor-opponent-invariant-morphology-v1",
            "fieldOrder": names,
            "baseFields": COMMON_FIELDS,
            "log1pBaseFields": sorted(LOG_FIELDS),
            "construction": "for each base field: total(actor, opponent), absDifference(actor, opponent); forcedCapture treated analogously without log1p",
            "standardization": "StandardScaler fitted on discovery training rows only",
            "dimensions": int(matrix.shape[1]),
        },
        "scaler": {
            "mean": [float(value) for value in scaler.mean_],
            "scale": [float(value) for value in scaler.scale_],
            "var": [float(value) for value in scaler.var_],
        },
        "clustering": {
            "algorithm": "KMeans",
            "nClusters": 2,
            "nInit": 50,
            "randomState": RANDOM_STATE,
            "centersStandardized": [
                [float(value) for value in row]
                for row in model.cluster_centers_
            ],
            "rawLabelToCanonical": mapping,
            "canonicalizationFeature": "total.meanCapturableSeeds",
            "canonicalizationRule": "cluster with larger transformed discovery mean is MTAJI-M1; the other is MTAJI-M2",
            "canonicalizationFeatureMeansByRawLabel": {
                str(key): float(value)
                for key, value in sorted(canonical_feature_means.items())
            },
        },
        "provisionalLabels": {
            "MTAJI-M1": {
                "alias": "capture-engaged / relatively balanced morphology",
                "status": "provisional descriptive alias",
            },
            "MTAJI-M2": {
                "alias": "capture-sparse / relatively asymmetric morphology",
                "status": "provisional descriptive alias",
            },
        },
        "discoveryDiagnostics": {
            "canonicalCounts": canonical_counts,
            "canonicalFractions": canonical_fractions,
            "rawClusterFeatureMeansTransformed": cluster_means,
            "referenceSilhouette": float(invariant_audit["referenceK2"]["silhouette"]),
            "referenceMethodAgreementARI": invariant_audit["referenceK2"]["methodAgreementARI"],
            "referenceAxisProjection": invariant_audit["referenceK2"]["axisProjection"],
            "relationToRelationalPolarity": invariant_audit["referenceK2"]["relationToReferenceRelationalPolarity"],
        },
        "interpretationBoundary": {
            "discoveryOnly": True,
            "notUniversalBaoOntology": True,
            "notPlayingStyle": True,
            "notOutcomeClass": True,
            "notAIImplementationLabel": True,
            "requiresIndependentConfirmation": True,
        },
    }

    encoded = json.dumps(
        report,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    report["candidateDefinitionHash"] = hashlib.sha256(encoded).hexdigest()

    output_path = output_dir / "mtaji-candidate-definition.json"
    atomic_json(output_path, report)
    print(json.dumps({
        "passed": True,
        "formalExperiment": False,
        "confirmationPerformed": False,
        "futureHeldOutSeedsTouched": False,
        "output": str(output_path),
        "candidateDefinitionHash": report["candidateDefinitionHash"],
        "canonicalCounts": canonical_counts,
    }, indent=2))


if __name__ == "__main__":
    main()
