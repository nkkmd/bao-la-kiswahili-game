#!/usr/bin/env python3
"""Stage 1 exploratory audit for position-complexity Study 1.

Descriptive/design-development only. Produces no confirmatory p-values.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import statistics
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "artifacts/local/position-complexity/stage1-exploratory-v1"
SPEC_PATH = ROOT / "doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def stable_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def hash_value(value: Any) -> str:
    return sha256_text(stable_json(value))


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def atomic_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2, ensure_ascii=False, sort_keys=True)
        handle.write("\n")
    temporary.replace(path)


def quantile(values: list[float], probability: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    index = (len(ordered) - 1) * probability
    lower = math.floor(index)
    upper = math.ceil(index)
    if lower == upper:
        return ordered[lower]
    weight = index - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def describe(values: list[float]) -> dict[str, Any]:
    finite = [float(value) for value in values if value is not None and math.isfinite(float(value))]
    if not finite:
        return {"n": 0, "min": None, "p10": None, "median": None, "mean": None, "p90": None, "max": None}
    return {
        "n": len(finite),
        "min": min(finite),
        "p10": quantile(finite, 0.10),
        "median": statistics.median(finite),
        "mean": statistics.fmean(finite),
        "p90": quantile(finite, 0.90),
        "max": max(finite),
    }


def pearson(xs: list[float], ys: list[float]) -> float | None:
    pairs = [(float(x), float(y)) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 3:
        return None
    x_values = [x for x, _ in pairs]
    y_values = [y for _, y in pairs]
    x_mean = statistics.fmean(x_values)
    y_mean = statistics.fmean(y_values)
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in pairs)
    x_ss = sum((x - x_mean) ** 2 for x in x_values)
    y_ss = sum((y - y_mean) ** 2 for y in y_values)
    if x_ss == 0 or y_ss == 0:
        return None
    return numerator / math.sqrt(x_ss * y_ss)


def rank(values: list[float]) -> list[float]:
    indexed = sorted(enumerate(values), key=lambda pair: pair[1])
    result = [0.0] * len(values)
    cursor = 0
    while cursor < len(indexed):
        end = cursor + 1
        while end < len(indexed) and indexed[end][1] == indexed[cursor][1]:
            end += 1
        average_rank = (cursor + 1 + end) / 2
        for index in range(cursor, end):
            result[indexed[index][0]] = average_rank
        cursor = end
    return result


def spearman(xs: list[float], ys: list[float]) -> float | None:
    pairs = [(float(x), float(y)) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 3:
        return None
    return pearson(rank([x for x, _ in pairs]), rank([y for _, y in pairs]))


def transition(trace: dict[str, Any], from_depth: int, to_depth: int) -> dict[str, Any]:
    for item in trace["transitions"]:
        if item["fromDepth"] == from_depth and item["toDepth"] == to_depth:
            return item
    raise ValueError(f"Missing transition {from_depth}->{to_depth}")


def depth_result(trace: dict[str, Any], depth: int) -> dict[str, Any]:
    for item in trace["results"]:
        if item["depth"] == depth:
            return item
    raise ValueError(f"Missing depth result {depth}")


def workload(measurement: dict[str, Any], depth: int) -> dict[str, Any]:
    for item in measurement["engineWorkload"]:
        if item["depth"] == depth:
            return item
    raise ValueError(f"Missing workload depth {depth}")


def ordinary_margin(result: dict[str, Any]) -> bool:
    if result.get("bestSecondGap") is None or len(result.get("candidates", [])) < 2:
        return False
    return result.get("bestScoreClass") == "ordinary-evaluation-domain" and result["candidates"][1].get("scoreClass") == "ordinary-evaluation-domain"


def row_from_measurement(measurement: dict[str, Any]) -> dict[str, Any]:
    trace = measurement["exactTrace"]
    d1 = depth_result(trace, 1)
    d2 = depth_result(trace, 2)
    d3 = depth_result(trace, 3)
    d4 = depth_result(trace, 4)
    t12 = transition(trace, 1, 2)
    t23 = transition(trace, 2, 3)
    t34 = transition(trace, 3, 4)
    w1 = workload(measurement, 1)
    w2 = workload(measurement, 2)
    w3 = workload(measurement, 3)
    w4 = workload(measurement, 4)
    structural = measurement["structural"]
    return {
        "historicalTrajectoryHash": measurement["historicalTrajectoryHash"],
        "ruleStateKey": measurement["ruleStateKey"],
        "seed": measurement["seed"],
        "gameId": measurement["gameId"],
        "phase": measurement["assignedPhase"],
        "ply": measurement["ply"],
        "legalMoveCount": structural["legalMoveCount"],
        "captureMoveCount": structural["captureMoveCount"],
        "forcedCapture": bool(structural["forcedCapture"]),
        "maxCapturableSeeds": structural["maxCapturableSeeds"],
        "meanCapturableSeeds": structural["meanCapturableSeeds"],
        "maxRelayEvents": structural["maxRelayEvents"],
        "meanRelayEvents": structural["meanRelayEvents"],
        "maxChainEvents": structural["maxChainEvents"],
        "meanChainEvents": structural["meanChainEvents"],
        "frontOccupied": structural["frontOccupied"],
        "frontConnections": structural["frontConnections"],
        "reusablePits": structural["reusablePits"],
        "reserve": structural["reserve"],
        "houseOwned": bool(structural["houseOwned"]),
        "nyumbaSeeds": structural["nyumbaSeeds"],
        "pitSeedVariance": structural["pitSeedVariance"],
        "seedConcentration": structural["seedConcentration"],
        "D12Instability": bool(t12["topSetDisjoint"]),
        "D23Instability": bool(t23["topSetDisjoint"]),
        "D34Instability": bool(t34["topSetDisjoint"]),
        "D12CanonicalBestChanged": bool(t12["canonicalBestChanged"]),
        "D23CanonicalBestChanged": bool(t23["canonicalBestChanged"]),
        "D34CanonicalBestChanged": bool(t34["canonicalBestChanged"]),
        "D2BestScore": d2["bestScore"],
        "D2BestScoreClass": d2["bestScoreClass"],
        "D2TopSetSize": d2["topSetSize"],
        "D2ExactTie": d2["topSetSize"] > 1,
        "D2BestSecondGap": d2["bestSecondGap"],
        "D2OrdinaryMargin": ordinary_margin(d2),
        "D1ScoreClass": d1["bestScoreClass"],
        "D3ScoreClass": d3["bestScoreClass"],
        "D4ScoreClass": d4["bestScoreClass"],
        "D1Nodes": w1["nodes"],
        "D2Nodes": w2["nodes"],
        "D3Nodes": w3["nodes"],
        "D4Nodes": w4["nodes"],
        "D1QuiescenceNodes": w1["quiescenceNodes"],
        "D2QuiescenceNodes": w2["quiescenceNodes"],
        "D3QuiescenceNodes": w3["quiescenceNodes"],
        "D4QuiescenceNodes": w4["quiescenceNodes"],
        "D1Cutoffs": w1["cutoffs"],
        "D2Cutoffs": w2["cutoffs"],
        "D3Cutoffs": w3["cutoffs"],
        "D4Cutoffs": w4["cutoffs"],
        "D1Evaluations": w1["evaluations"],
        "D2Evaluations": w2["evaluations"],
        "D3Evaluations": w3["evaluations"],
        "D4Evaluations": w4["evaluations"],
        "D2ScoreRange": max(candidate["score"] for candidate in d2["candidates"]) - min(candidate["score"] for candidate in d2["candidates"]),
    }


def count_by(rows: list[dict[str, Any]], field: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for row in rows:
        key = str(row[field])
        counts[key] = counts.get(key, 0) + 1
    return counts


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    args = parser.parse_args()
    root = args.input.resolve()

    spec_text = SPEC_PATH.read_text(encoding="utf-8")
    spec = json.loads(spec_text)
    spec_sha = sha256_text(spec_text)
    manifest = load_json(root / "manifest.json")
    verification = load_json(root / "verification.json")
    selection = load_json(root / "selection-audit.json")
    measurement_manifest = load_json(root / "measurement-manifest.json")

    for label, artifact in [
        ("manifest", manifest),
        ("verification", verification),
        ("selection", selection),
        ("measurement_manifest", measurement_manifest),
    ]:
        if artifact.get("stageId") != spec["stageId"] or artifact.get("specSha256") != spec_sha:
            raise ValueError(f"{label} identity mismatch")
    if not verification.get("passed") or not verification.get("fullSearchRecomputation"):
        raise ValueError("Stage 1 verification must pass with full search recomputation")
    if measurement_manifest.get("selectionHash") != selection.get("selectionHash"):
        raise ValueError("Selection/measurement hash mismatch")

    measurement_files = sorted((root / "measurements").glob("selected-*.json"))
    if len(measurement_files) != measurement_manifest["completedMeasurements"]:
        raise ValueError("Measurement file count mismatch")
    measurements = [load_json(path) for path in measurement_files]
    rows = [row_from_measurement(measurement) for measurement in measurements]
    if len({row["ruleStateKey"] for row in rows}) != len(rows):
        raise ValueError("Duplicate ruleStateKey remains in measured rows")
    if any(row["legalMoveCount"] < 2 for row in rows):
        raise ValueError("Single-choice root entered selected measurement population")

    d23_events = sum(row["D23Instability"] for row in rows)
    d23_stable = len(rows) - d23_events
    ordinary_margins = [row for row in rows if row["D2OrdinaryMargin"]]
    phase_counts = count_by(rows, "phase")
    gates = {
        "minimumSelectedUniqueRuleStates": len(rows) >= spec["readinessGates"]["minimumSelectedUniqueRuleStates"],
        "minimumNamuaSelectedStates": phase_counts.get("namua", 0) >= spec["readinessGates"]["minimumNamuaSelectedStates"],
        "minimumMtajiSelectedStates": phase_counts.get("mtaji", 0) >= spec["readinessGates"]["minimumMtajiSelectedStates"],
        "minimumD23InstabilityEvents": d23_events >= spec["readinessGates"]["minimumD23InstabilityEvents"],
        "minimumD23StableEvents": d23_stable >= spec["readinessGates"]["minimumD23StableEvents"],
        "minimumOrdinaryDomainD2Margins": len(ordinary_margins) >= spec["readinessGates"]["minimumOrdinaryDomainD2Margins"],
    }

    legal = [row["legalMoveCount"] for row in rows]
    d23 = [1.0 if row["D23Instability"] else 0.0 for row in rows]
    log_nodes_d3 = [math.log1p(row["D3Nodes"]) for row in rows]
    margin_rows = [row for row in rows if row["D2OrdinaryMargin"]]
    margins = [row["D2BestSecondGap"] for row in margin_rows]
    margin_instability = [1.0 if row["D23Instability"] else 0.0 for row in margin_rows]

    score_domain_by_depth = {
        f"D{depth}": count_by(rows, f"D{depth}ScoreClass")
        for depth in (1, 3, 4)
    }
    score_domain_by_depth["D2"] = count_by(rows, "D2BestScoreClass")

    result = {
        "schemaVersion": 1,
        "stageId": spec["stageId"],
        "status": "exploratory-design-audit-complete",
        "scientificInferenceAuthorized": False,
        "confirmatoryReuseAllowed": False,
        "specSha256": spec_sha,
        "source": {
            "manifestSummaryHash": manifest.get("summaryHash"),
            "verificationIdentityHash": verification.get("verifiedIdentityHash"),
            "selectionHash": selection.get("selectionHash"),
            "measurementHash": measurement_manifest.get("measurementHash"),
        },
        "population": {
            "generatedGames": manifest["summary"]["games"],
            "uniqueHistoricalTrajectories": verification["uniqueHistoricalTrajectories"],
            "selectedUniqueRuleStates": len(rows),
            "selectedPhaseCounts": phase_counts,
            "unavailableAssignedPhase": selection["unavailableAssignedPhase"],
            "duplicateSelectedRuleStatesCollapsed": selection["duplicateSelectedRuleStatesCollapsed"],
        },
        "readiness": {
            "gates": gates,
            "passed": all(gates.values()),
            "D23InstabilityEvents": d23_events,
            "D23StableEvents": d23_stable,
            "ordinaryDomainD2Margins": len(ordinary_margins),
        },
        "instabilityPrevalence": {
            "D1_D2": {"events": sum(row["D12Instability"] for row in rows), "n": len(rows)},
            "D2_D3": {"events": d23_events, "n": len(rows)},
            "D3_D4": {"events": sum(row["D34Instability"] for row in rows), "n": len(rows)},
        },
        "tiePrevalence": {
            "D2ExactTies": sum(row["D2ExactTie"] for row in rows),
            "n": len(rows),
            "D2TopSetSize": describe([row["D2TopSetSize"] for row in rows]),
        },
        "scoreDomains": score_domain_by_depth,
        "distributions": {
            "legalMoveCount": describe(legal),
            "captureMoveCount": describe([row["captureMoveCount"] for row in rows]),
            "D2OrdinaryBestSecondGap": describe(margins),
            "D2ScoreRange": describe([row["D2ScoreRange"] for row in rows]),
            "D2Nodes": describe([row["D2Nodes"] for row in rows]),
            "D3Nodes": describe([row["D3Nodes"] for row in rows]),
            "D4Nodes": describe([row["D4Nodes"] for row in rows]),
        },
        "descriptiveCorrelationsNoPValues": {
            "legalMoveCount_vs_D23Instability": {
                "pearson": pearson(legal, d23),
                "spearman": spearman(legal, d23),
                "n": len(rows),
            },
            "legalMoveCount_vs_log1pD3Nodes": {
                "pearson": pearson(legal, log_nodes_d3),
                "spearman": spearman(legal, log_nodes_d3),
                "n": len(rows),
            },
            "D2OrdinaryGap_vs_D23Instability": {
                "pearson": pearson(margins, margin_instability),
                "spearman": spearman(margins, margin_instability),
                "n": len(margin_rows),
            },
        },
        "formalDecision": None,
        "stage2Authorized": False,
    }
    result["resultHash"] = hash_value(result)

    atomic_json(root / "stage1-exploratory-audit.json", result)
    write_csv(root / "stage1-selected-measurements.csv", rows)
    print(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
