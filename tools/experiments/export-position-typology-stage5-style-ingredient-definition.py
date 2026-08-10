#!/usr/bin/env python3
"""Freeze the exact state-level ingredients used by Stage 4 style descriptors.

The Stage 4 style-coordinate definition freezes the 10 game-level descriptor
scaler and PCA transform, but N-ACT/N-CON depend on a Stage 3 discovery-side
44D StandardScaler. This exporter records that exact scaler before any Stage 5
held-out corpus is generated or inspected.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

DEFAULT_FEATURE_DIR = (
    "artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1"
)
DEFAULT_NAMUA_AUDIT = (
    "artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json"
)
DEFAULT_STYLE_DEFINITION = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-coordinate-definition-v1/style-coordinate-definition.json"
)
DEFAULT_OUTPUT = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-ingredient-definition-v1"
)

EXPECTED_FEATURE_AUDIT_HASH = "3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129"
EXPECTED_NAMUA_AUDIT_HASH = "099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a"
EXPECTED_STYLE_DEFINITION_HASH = "568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc"
EXPECTED_MTAJI_DEFINITION_HASH = "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--features", default=DEFAULT_FEATURE_DIR)
    parser.add_argument("--namua-audit", default=DEFAULT_NAMUA_AUDIT)
    parser.add_argument("--style-definition", default=DEFAULT_STYLE_DEFINITION)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    return parser.parse_args()


def canonical_json_hash(value) -> str:
    encoded = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


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


def main():
    options = parse_args()
    feature_dir = Path(options.features).resolve()
    namua_path = Path(options.namua_audit).resolve()
    style_path = Path(options.style_definition).resolve()
    output_dir = Path(options.output).resolve()

    feature_audit = json.loads((feature_dir / "feature-audit.json").read_text(encoding="utf-8"))
    namua_audit = json.loads(namua_path.read_text(encoding="utf-8"))
    style_definition = json.loads(style_path.read_text(encoding="utf-8"))

    checks = {
        "featureAuditHash": feature_audit.get("auditHash") == EXPECTED_FEATURE_AUDIT_HASH,
        "featureExploratory": feature_audit.get("formalExperiment") is False and feature_audit.get("exploratory") is True,
        "namuaAuditHash": namua_audit.get("auditHash") == EXPECTED_NAMUA_AUDIT_HASH,
        "namuaFutureSeedsUntouched": namua_audit.get("design", {}).get("futureConfirmationCorpusTouched") is False,
        "styleDefinitionHash": style_definition.get("styleCoordinateDefinitionHash") == EXPECTED_STYLE_DEFINITION_HASH,
        "styleFutureSeedsUntouched": style_definition.get("futureStyleConfirmationSeedsTouched") is False,
        "mtajiDefinitionHash": style_definition.get("sourceMtajiCandidateDefinitionHash") == EXPECTED_MTAJI_DEFINITION_HASH,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        raise RuntimeError(f"ingredient freeze boundary mismatch: {failed}")

    frame = pd.read_csv(feature_dir / "eligible-primary-rule-state.csv")
    namua = frame[frame["phase"] == "namua"].copy()
    cap = int(namua_audit["design"]["capPerGamePhase"])
    capped = balanced_capped(namua, cap)

    rep = namua_audit["representation"]
    base_fields = list(rep["baseFields"])
    log_fields = set(rep["log1pBaseFields"])
    raw, field_order = raw_invariant(capped, base_fields, log_fields)
    if field_order != list(rep["fieldOrder"]):
        raise RuntimeError("Stage 3 field order mismatch")
    scaler = StandardScaler().fit(raw)

    report = {
        "schemaVersion": 1,
        "status": "stage5-style-ingredient-definition-exported",
        "formalExperiment": False,
        "exploratory": True,
        "confirmationPerformed": False,
        "futureStyleConfirmationSeedsTouched": False,
        "ingredientDefinitionFrozenForPreregistration": True,
        "sourceFeatureAuditHash": feature_audit["auditHash"],
        "sourceNamuaGradientAuditHash": namua_audit["auditHash"],
        "sourceStyleCoordinateDefinitionHash": style_definition["styleCoordinateDefinitionHash"],
        "sourceMtajiCandidateDefinitionHash": style_definition["sourceMtajiCandidateDefinitionHash"],
        "namuaStateCoordinates": {
            "representation": rep["name"],
            "baseFields": base_fields,
            "log1pBaseFields": list(rep["log1pBaseFields"]),
            "fieldOrder": field_order,
            "dimensions": len(field_order),
            "discoveryPopulation": {
                "phase": "namua",
                "primaryEligibleRows": int(len(namua)),
                "cappedRows": int(len(capped)),
                "capPerGamePhase": cap,
                "capSelectionOrder": "SHA-256(ruleStateKey) lexical order",
            },
            "scaler": {
                "mean": [float(value) for value in scaler.mean_],
                "scale": [float(value) for value in scaler.scale_],
                "var": [float(value) for value in scaler.var_],
            },
            "captureActivity": namua_audit["interpretableCoordinates"]["captureActivity"],
            "structuralContrast": namua_audit["interpretableCoordinates"]["structuralContrast"],
        },
        "mtajiStateCoordinates": {
            "classifierDefinitionHash": style_definition["sourceMtajiCandidateDefinitionHash"],
            "classifierRefitAllowed": False,
        },
        "interpretationBoundary": {
            "namuaScalerRefitOnHeldoutAllowed": False,
            "mtajiClassifierRefitOnHeldoutAllowed": False,
            "stateIngredientsAreInputsToFrozenGameLevelStyleDescriptors": True,
            "noNewStyleCoordinatesDefined": True,
        },
    }
    report["styleIngredientDefinitionHash"] = canonical_json_hash(report)
    output_path = output_dir / "style-ingredient-definition.json"
    atomic_json(output_path, report)
    print(json.dumps({
        "passed": True,
        "output": str(output_path),
        "styleIngredientDefinitionHash": report["styleIngredientDefinitionHash"],
        "namuaDimensions": len(field_order),
        "namuaCappedRows": len(capped),
        "futureStyleConfirmationSeedsTouched": False,
    }, indent=2))


if __name__ == "__main__":
    main()
