#!/usr/bin/env python3
"""Audit the frozen confirmed Mtaji classifier before downstream reuse.

This script is Stage 0 technical QA only. It neither refits the classifier nor
inspects any held-out formal corpus. When Stage 0 smoke games are available, it
also applies the exact frozen transform to first eligible Mtaji observations to
prove end-to-end representation compatibility.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import Counter
from pathlib import Path

EXPECTED_HASH = "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d"
DEFAULT_CANDIDATE = Path(
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
)
DEFAULT_SMOKE = Path("artifacts/local/namua-mtaji-transition/stage0-smoke-v1")
DEFAULT_OUTPUT = DEFAULT_SMOKE / "mtaji-artifact-audit.json"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", default=str(DEFAULT_CANDIDATE))
    parser.add_argument("--smoke", default=str(DEFAULT_SMOKE))
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--no-smoke-classification", action="store_true")
    return parser.parse_args()


def canonical_hash_without(value: dict, field: str) -> str:
    clone = json.loads(json.dumps(value))
    clone.pop(field, None)
    raw = json.dumps(
        clone,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    tmp.replace(path)


def validate_candidate(candidate: dict):
    actual = candidate.get("candidateDefinitionHash")
    recomputed = canonical_hash_without(candidate, "candidateDefinitionHash")
    if actual != EXPECTED_HASH:
        raise RuntimeError(f"unexpected candidateDefinitionHash: {actual}")
    if recomputed != EXPECTED_HASH:
        raise RuntimeError(
            f"candidate canonical hash mismatch: {recomputed} != {EXPECTED_HASH}"
        )
    if candidate.get("representation", {}).get("dimensions") != 40:
        raise RuntimeError("frozen Mtaji representation is not 40-dimensional")
    field_order = candidate["representation"]["fieldOrder"]
    if len(field_order) != 40:
        raise RuntimeError("frozen Mtaji fieldOrder length is not 40")
    mean = candidate["scaler"]["mean"]
    scale = candidate["scaler"]["scale"]
    centers = candidate["clustering"]["centersStandardized"]
    if len(mean) != 40 or len(scale) != 40:
        raise RuntimeError("frozen scaler dimension mismatch")
    if len(centers) != 2 or any(len(row) != 40 for row in centers):
        raise RuntimeError("frozen centroid dimension mismatch")
    mapping = candidate["clustering"]["rawLabelToCanonical"]
    if set(mapping.values()) != {"MTAJI-M1", "MTAJI-M2"}:
        raise RuntimeError("frozen canonical label mapping mismatch")
    if candidate.get("formalExperiment") is not False:
        raise RuntimeError("discovery candidate formal boundary mismatch")
    return recomputed


def transformed(value: float, field: str, log_fields: set[str]) -> float:
    value = float(value)
    if field in log_fields:
        if value < 0:
            raise RuntimeError(f"negative value in log field {field}")
        return math.log1p(value)
    return value


def invariant_vector(observation: dict, candidate: dict) -> list[float]:
    actor = observation["features"]["actor"]
    opponent = observation["features"]["opponent"]
    base_fields = candidate["representation"]["baseFields"]
    log_fields = set(candidate["representation"]["log1pBaseFields"])
    values: list[float] = []
    names: list[str] = []
    for field in base_fields:
        a = transformed(actor[field], field, log_fields)
        b = transformed(opponent[field], field, log_fields)
        values.extend([a + b, abs(a - b)])
        names.extend([f"total.{field}", f"absDifference.{field}"])
    a_forced = float(bool(actor["forcedCapture"]))
    b_forced = float(bool(opponent["forcedCapture"]))
    values.extend([a_forced + b_forced, abs(a_forced - b_forced)])
    names.extend(["total.forcedCapture", "absDifference.forcedCapture"])
    if names != candidate["representation"]["fieldOrder"]:
        raise RuntimeError("reconstructed field order does not match frozen artifact")
    return values


def classify(observation: dict, candidate: dict) -> str:
    raw = invariant_vector(observation, candidate)
    mean = candidate["scaler"]["mean"]
    scale = candidate["scaler"]["scale"]
    standardized = [
        (raw[index] - float(mean[index])) / float(scale[index])
        if float(scale[index]) != 0
        else 0.0
        for index in range(40)
    ]
    centers = candidate["clustering"]["centersStandardized"]
    distances = [
        sum((standardized[index] - float(center[index])) ** 2 for index in range(40))
        for center in centers
    ]
    raw_label = str(min(range(len(distances)), key=lambda index: distances[index]))
    return candidate["clustering"]["rawLabelToCanonical"][raw_label]


def smoke_first_mtaji(smoke_root: Path):
    games_dir = smoke_root / "games"
    if not games_dir.exists():
        raise FileNotFoundError(f"missing Stage 0 smoke games directory: {games_dir}")
    rows = []
    for path in sorted(games_dir.glob("game-*.json")):
        game = json.loads(path.read_text(encoding="utf-8"))
        eligible = [
            row for row in game.get("observations", [])
            if row.get("phase") == "mtaji"
            and row.get("terminal") is False
            and int(row.get("ply", -1)) >= 8
        ]
        if eligible:
            rows.append((game["gameId"], eligible[0]))
    return rows


def main():
    args = parse_args()
    candidate_path = Path(args.candidate).resolve()
    if not candidate_path.exists():
        raise FileNotFoundError(
            "Frozen Mtaji candidate artifact not found. Supply --candidate pointing to "
            "the historical mtaji-candidate-definition.json; do not regenerate or refit it. "
            f"Expected default: {candidate_path}"
        )
    candidate = json.loads(candidate_path.read_text(encoding="utf-8"))
    recomputed_hash = validate_candidate(candidate)

    classifications = []
    smoke_classification_performed = not args.no_smoke_classification
    if smoke_classification_performed:
        for game_id, observation in smoke_first_mtaji(Path(args.smoke).resolve()):
            classifications.append({
                "gameId": game_id,
                "ply": int(observation["ply"]),
                "label": classify(observation, candidate),
                "ruleStateKey": observation["identity"]["ruleStateKey"],
            })

    counts = Counter(row["label"] for row in classifications)
    report = {
        "schemaVersion": 1,
        "status": "stage0-frozen-mtaji-artifact-audit-complete",
        "passed": True,
        "formalExperiment": False,
        "scientificInferenceAuthorized": False,
        "candidatePath": str(candidate_path),
        "expectedCandidateDefinitionHash": EXPECTED_HASH,
        "storedCandidateDefinitionHash": candidate["candidateDefinitionHash"],
        "recomputedCandidateDefinitionHash": recomputed_hash,
        "representationDimensions": candidate["representation"]["dimensions"],
        "classifierRefitPerformed": False,
        "restandardizationPerformed": False,
        "relabelingPerformed": False,
        "smokeClassificationPerformed": smoke_classification_performed,
        "eligibleFirstMtajiSmokeStates": len(classifications),
        "smokeLabelCounts": dict(sorted(counts.items())),
        "smokeClassifications": classifications,
    }
    output = Path(args.output).resolve()
    atomic_json(output, report)
    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
