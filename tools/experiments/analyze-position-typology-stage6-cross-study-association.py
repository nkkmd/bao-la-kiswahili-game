#!/usr/bin/env python3
"""Stage 6 secondary cross-study association analysis.

This analysis is descriptive / hypothesis-generation only. It applies only the
frozen Stage 6 bridge protocol to replay-verified Study 1 candidate positions.
No classifier/scaler refit, confirmatory p-value, cluster search, or decision
rescue is permitted.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_REPLAY = (
    "artifacts/local/position-typology/stage6-cross-study-bridge-v1/"
    "replay/replayed-candidate-states.json"
)
DEFAULT_AUDIT = (
    "artifacts/local/position-typology/stage6-cross-study-bridge-v1/"
    "replay/replay-audit.json"
)
DEFAULT_SPEC = "doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json"
DEFAULT_INGREDIENT = (
    "artifacts/local/position-typology/stage4-playing-style-exploratory-v1/"
    "style-ingredient-definition-v1/style-ingredient-definition.json"
)
DEFAULT_CANDIDATE = (
    "artifacts/local/position-typology/stage1-pilot-v1/"
    "mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
)
DEFAULT_OUTPUT = (
    "artifacts/local/position-typology/stage6-cross-study-bridge-v1/"
    "association/cross-study-association-result.json"
)


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--replay", default=DEFAULT_REPLAY)
    p.add_argument("--replay-audit", default=DEFAULT_AUDIT)
    p.add_argument("--spec", default=DEFAULT_SPEC)
    p.add_argument("--ingredient-definition", default=DEFAULT_INGREDIENT)
    p.add_argument("--candidate-definition", default=DEFAULT_CANDIDATE)
    p.add_argument("--output", default=DEFAULT_OUTPUT)
    return p.parse_args()


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def canonical_hash(value):
    payload = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def verify_embedded_hash(value, field):
    expected = value.get(field)
    copy = dict(value)
    copy.pop(field, None)
    actual = canonical_hash(copy)
    if expected != actual:
        raise RuntimeError(f"{field} mismatch: {actual} != {expected}")
    return actual


def transformed_value(observation, side, field, log_fields):
    x = float(observation["features"][side][field])
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


def namua_coordinates(observation, ingredient):
    state = ingredient["namuaStateCoordinates"]
    base_fields = list(state["baseFields"])
    log_fields = set(state["log1pBaseFields"])
    row = invariant_row(observation, base_fields, log_fields)
    if row.shape[0] != int(state["dimensions"]):
        raise RuntimeError("namua state dimension mismatch")
    if len(state["fieldOrder"]) != row.shape[0]:
        raise RuntimeError("namua field-order length mismatch")
    mean = np.asarray(state["scaler"]["mean"], dtype=float)
    scale = np.asarray(state["scaler"]["scale"], dtype=float)
    if np.any(scale <= 0):
        raise RuntimeError("non-positive frozen namua scale")
    z = (row - mean) / scale
    index = {name: i for i, name in enumerate(state["fieldOrder"])}
    act_fields = state["captureActivity"]["componentFields"]
    con_fields = state["structuralContrast"]["componentFields"]
    act = float(np.mean([z[index[f"total.{field}"]] for field in act_fields]))
    con = float(np.mean([z[index[f"absDifference.{field}"]] for field in con_fields]))
    return act, con


def classify_mtaji(observation, candidate):
    rep = candidate["representation"]
    base_fields = list(rep["baseFields"])
    if "total.forcedCapture" in rep["fieldOrder"] and "forcedCapture" not in base_fields:
        base_fields.append("forcedCapture")
    log_fields = set(rep["log1pBaseFields"])
    row = invariant_row(observation, base_fields, log_fields)
    if row.shape[0] != len(rep["fieldOrder"]):
        raise RuntimeError("mtaji representation dimension mismatch")
    mean = np.asarray(candidate["scaler"]["mean"], dtype=float)
    scale = np.asarray(candidate["scaler"]["scale"], dtype=float)
    if np.any(scale <= 0):
        raise RuntimeError("non-positive frozen mtaji scale")
    centers = np.asarray(candidate["clustering"]["centersStandardized"], dtype=float)
    z = (row - mean) / scale
    distances = np.linalg.norm(centers - z[None, :], axis=1)
    raw = int(np.argmin(distances))
    return candidate["clustering"]["rawLabelToCanonical"][str(raw)]


def distribution(values):
    x = np.asarray(values, dtype=float)
    if len(x) == 0:
        return {
            "count": 0,
            "min": None,
            "p10": None,
            "p25": None,
            "median": None,
            "p75": None,
            "p90": None,
            "max": None,
            "mean": None,
            "stdPopulation": None,
        }
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


def cliffs_delta(expansion, comparator):
    x = np.asarray(expansion, dtype=float)
    y = np.sort(np.asarray(comparator, dtype=float))
    if len(x) == 0 or len(y) == 0:
        return None
    greater = 0
    less = 0
    for value in x:
        greater += int(np.searchsorted(y, value, side="left"))
        less += int(len(y) - np.searchsorted(y, value, side="right"))
    return float((greater - less) / (len(x) * len(y)))


def finite_distance(value):
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return None
    return parsed if np.isfinite(parsed) else None


def deduplicate(records, spec):
    pop = spec["candidatePopulation"]
    positive = pop["positivePhenotype"]
    comparators = set(pop["nonPrecursorComparator"])
    precursors = set(pop["precursorExclusionsFromComparator"])
    allowed = {positive, *comparators, *precursors}
    minimum = float(pop["minimumPliesRemaining"])

    eligible_raw = []
    for row in records:
        if row.get("category") != pop["category"]:
            continue
        distance = finite_distance(row.get("distanceToTerminal"))
        if distance is None:
            raise RuntimeError("candidate distanceToTerminal is non-finite")
        if distance < minimum:
            continue
        classification = row.get("classification")
        if classification not in allowed:
            raise RuntimeError(f"unknown candidate classification: {classification}")
        if row.get("phaseAtCandidate") not in {"namua", "mtaji"}:
            raise RuntimeError("invalid candidate phase")
        if row.get("position", {}).get("phase") != row.get("phaseAtCandidate"):
            raise RuntimeError("replayed position phase mismatch")
        eligible_raw.append(row)

    unique = {}
    duplicate_rows = 0
    for row in eligible_raw:
        key = (
            row["experiment"],
            row["condition"],
            row["trajectoryHash"],
            int(row["candidatePly"]),
        )
        if key not in unique:
            unique[key] = row
            continue
        previous = unique[key]
        protected = [
            "classification",
            "phaseAtCandidate",
            "category",
            "archivedStateHash",
            "distanceToTerminal",
        ]
        for field in protected:
            if str(previous.get(field)) != str(row.get(field)):
                raise RuntimeError(f"duplicate conflict for {key}: {field}")
        prev_rule = previous["position"]["identity"]["ruleStateKey"]
        curr_rule = row["position"]["identity"]["ruleStateKey"]
        if prev_rule != curr_rule:
            raise RuntimeError(f"duplicate conflict for {key}: ruleStateKey")
        duplicate_rows += 1

    return eligible_raw, list(unique.values()), duplicate_rows


def scope_map(spec):
    result = {}
    for item in spec["scope"]:
        for condition in item["conditions"]:
            result[(item["experiment"], condition)] = {
                "depth": int(item["depth"]),
                "searchProfile": "phase2" if condition.endswith("P2") else "legacy",
            }
    return result


def classification_phase_counts(rows, classes):
    out = {phase: {name: 0 for name in classes} for phase in ("namua", "mtaji")}
    for row in rows:
        out[row["phaseAtCandidate"]][row["classification"]] += 1
    return out


def mtaji_summary(rows, candidate, positive, comparators):
    expansions = []
    controls = []
    for row in rows:
        if row["phaseAtCandidate"] != "mtaji":
            continue
        if row["classification"] == positive:
            expansions.append(classify_mtaji(row["position"], candidate))
        elif row["classification"] in comparators:
            controls.append(classify_mtaji(row["position"], candidate))

    def counts(labels):
        m1 = sum(label == "MTAJI-M1" for label in labels)
        m2 = sum(label == "MTAJI-M2" for label in labels)
        total = len(labels)
        return {
            "count": total,
            "MTAJI-M1": m1,
            "MTAJI-M2": m2,
            "MTAJI-M1Fraction": (float(m1 / total) if total else None),
        }

    e = counts(expansions)
    c = counts(controls)
    difference = (
        float(e["MTAJI-M1Fraction"] - c["MTAJI-M1Fraction"])
        if e["MTAJI-M1Fraction"] is not None and c["MTAJI-M1Fraction"] is not None
        else None
    )
    return {
        "expansion": e,
        "nonPrecursorComparator": c,
        "MTAJI-M1FractionDifferenceExpansionMinusComparator": difference,
    }


def namua_summary(rows, ingredient, positive, comparators):
    expansion_act = []
    expansion_con = []
    comparator_act = []
    comparator_con = []
    for row in rows:
        if row["phaseAtCandidate"] != "namua":
            continue
        if row["classification"] not in {positive, *comparators}:
            continue
        act, con = namua_coordinates(row["position"], ingredient)
        if row["classification"] == positive:
            expansion_act.append(act)
            expansion_con.append(con)
        else:
            comparator_act.append(act)
            comparator_con.append(con)

    def coordinate(name, expansion, comparator):
        e = distribution(expansion)
        c = distribution(comparator)
        median_difference = (
            float(e["median"] - c["median"])
            if e["median"] is not None and c["median"] is not None
            else None
        )
        return {
            "coordinate": name,
            "expansion": e,
            "nonPrecursorComparator": c,
            "medianDifferenceExpansionMinusComparator": median_difference,
            "cliffsDeltaExpansionVersusComparator": cliffs_delta(expansion, comparator),
        }

    return {
        "N-ACT": coordinate("N-ACT", expansion_act, comparator_act),
        "N-CON": coordinate("N-CON", expansion_con, comparator_con),
    }


def main():
    args = parse_args()
    replay_path = Path(args.replay).resolve()
    audit_path = Path(args.replay_audit).resolve()
    spec_path = (ROOT / args.spec).resolve() if not Path(args.spec).is_absolute() else Path(args.spec)
    ingredient_path = Path(args.ingredient_definition).resolve()
    candidate_path = Path(args.candidate_definition).resolve()
    output_path = Path(args.output).resolve()

    replay = read_json(replay_path)
    audit = read_json(audit_path)
    spec = read_json(spec_path)
    ingredient = read_json(ingredient_path)
    candidate = read_json(candidate_path)

    protocol_hash = verify_embedded_hash(spec, "protocolHash")
    if spec.get("formalExperiment") is not False or spec.get("hypothesisGenerationOnly") is not True:
        raise RuntimeError("Stage 6 protocol boundary mismatch")
    if spec.get("status") != "frozen-secondary-protocol-before-association-analysis":
        raise RuntimeError("Stage 6 protocol is not frozen")

    audit_hash = verify_embedded_hash(audit, "auditHash")
    if audit.get("allReplayChecksPassed") is not True:
        raise RuntimeError("candidate replay verification did not pass")
    if audit.get("associationAnalysisPerformed") is not False:
        raise RuntimeError("replay audit indicates prior association analysis")
    if audit.get("scientificAssociationValuesComputed") is not False:
        raise RuntimeError("replay audit boundary mismatch")
    if audit.get("protocolHash") != protocol_hash:
        raise RuntimeError("replay audit protocol hash mismatch")

    replay_hash = verify_embedded_hash(replay, "datasetHash")
    if replay_hash != audit.get("replayedCandidateStateDatasetHash"):
        raise RuntimeError("replayed dataset hash mismatch")
    if replay.get("protocolHash") != protocol_hash:
        raise RuntimeError("replayed dataset protocol hash mismatch")
    if replay.get("associationAnalysisPerformed") is not False:
        raise RuntimeError("replayed dataset boundary mismatch")

    ingredient_hash = verify_embedded_hash(ingredient, "styleIngredientDefinitionHash")
    candidate_hash = verify_embedded_hash(candidate, "candidateDefinitionHash")
    sources = spec["sourceArtifacts"]
    if ingredient_hash != sources["styleIngredientDefinitionHash"]:
        raise RuntimeError("style ingredient hash mismatch")
    if candidate_hash != sources["mtajiCandidateDefinitionHash"]:
        raise RuntimeError("mtaji candidate definition hash mismatch")
    if ingredient["mtajiStateCoordinates"]["classifierDefinitionHash"] != candidate_hash:
        raise RuntimeError("ingredient -> mtaji classifier provenance mismatch")

    expected_scope = scope_map(spec)
    audit_scope = {(row["experiment"], row["condition"]) for row in audit["conditions"]}
    if audit_scope != set(expected_scope):
        raise RuntimeError("replay audit condition scope mismatch")
    if not all(row.get("replayPassed") is True for row in audit["conditions"]):
        raise RuntimeError("one or more replay conditions failed")

    raw_rows, unique_rows, duplicate_rows = deduplicate(replay["records"], spec)
    if {(row["experiment"], row["condition"]) for row in unique_rows} != set(expected_scope):
        raise RuntimeError("replayed candidate dataset scope mismatch")

    pop = spec["candidatePopulation"]
    positive = pop["positivePhenotype"]
    comparators = set(pop["nonPrecursorComparator"])
    precursors = set(pop["precursorExclusionsFromComparator"])
    classes = [positive, *pop["nonPrecursorComparator"], *pop["precursorExclusionsFromComparator"]]

    condition_results = []
    for experiment, condition in sorted(expected_scope):
        rows = [
            row for row in unique_rows
            if row["experiment"] == experiment and row["condition"] == condition
        ]
        raw_count = sum(
            row["experiment"] == experiment and row["condition"] == condition
            for row in raw_rows
        )
        class_counts = {name: sum(row["classification"] == name for row in rows) for name in classes}
        phase_counts = {phase: sum(row["phaseAtCandidate"] == phase for row in rows) for phase in ("namua", "mtaji")}
        positive_phase = {
            phase: sum(
                row["phaseAtCandidate"] == phase and row["classification"] == positive
                for row in rows
            )
            for phase in ("namua", "mtaji")
        }
        comparator_phase = {
            phase: sum(
                row["phaseAtCandidate"] == phase and row["classification"] in comparators
                for row in rows
            )
            for phase in ("namua", "mtaji")
        }
        precursor_phase = {
            phase: sum(
                row["phaseAtCandidate"] == phase and row["classification"] in precursors
                for row in rows
            )
            for phase in ("namua", "mtaji")
        }
        meta = expected_scope[(experiment, condition)]
        condition_results.append({
            "experiment": experiment,
            "condition": condition,
            "depth": meta["depth"],
            "searchProfileMetadataOnly": meta["searchProfile"],
            "rawEligibleCandidateRows": raw_count,
            "uniqueTrajectoryPlyUnits": len(rows),
            "classificationCounts": class_counts,
            "phaseOverlap": {
                "allEligibleByPhase": phase_counts,
                "expansionByPhase": positive_phase,
                "nonPrecursorComparatorByPhase": comparator_phase,
                "precursorExcludedFromComparatorByPhase": precursor_phase,
                "classificationByPhase": classification_phase_counts(rows, classes),
            },
            "mtaji": mtaji_summary(rows, candidate, positive, comparators),
            "namua": namua_summary(rows, ingredient, positive, comparators),
        })

    result = {
        "schemaVersion": 1,
        "status": "stage6-cross-study-association-analysis-complete",
        "formalExperiment": False,
        "secondaryCrossStudyAnalysis": True,
        "hypothesisGenerationOnly": True,
        "protocolHash": protocol_hash,
        "sourceHashes": {
            "replayAuditHash": audit_hash,
            "replayedCandidateStateDatasetHash": replay_hash,
            "mtajiCandidateDefinitionHash": candidate_hash,
            "styleIngredientDefinitionHash": ingredient_hash,
            "mtajiStage2FormalResultHash": sources["mtajiStage2FormalResultHash"],
            "stage5FormalResultHash": sources["stage5FormalResultHash"],
        },
        "integrity": {
            "allReplayChecksPassed": True,
            "rawEligibleCandidateRows": len(raw_rows),
            "uniqueTrajectoryPlyUnits": len(unique_rows),
            "duplicateRowsCollapsed": duplicate_rows,
            "conditionCount": len(condition_results),
        },
        "analysisBoundaries": {
            "confirmatoryPValuesComputed": False,
            "classifierRefitPerformed": False,
            "namuaScalerRefitPerformed": False,
            "newClusterSearchPerformed": False,
            "styleCoordinatesUsed": False,
            "gamesExecuted": False,
            "formalAnalysisRerun": False,
            "archivesModified": False,
            "study1FormalDecisionsModified": False,
            "stage5DecisionModified": False,
            "pooledCrossCorpusPrimaryInference": False,
            "causalMediationClaim": False,
        },
        "conditionResults": condition_results,
        "interpretationBoundary": spec["reporting"]["allowedClaim"],
    }
    result["resultHash"] = canonical_hash(result)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "status": result["status"],
        "protocolHash": protocol_hash,
        "replayAuditHash": audit_hash,
        "resultHash": result["resultHash"],
        "uniqueTrajectoryPlyUnits": len(unique_rows),
        "output": str(output_path),
    }, indent=2))


if __name__ == "__main__":
    main()
