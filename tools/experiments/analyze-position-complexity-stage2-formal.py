#!/usr/bin/env python3
"""Formal Stage 2 analysis for Position Complexity / Difficulty Study 1.

Implements only the preregistered PCX-H1 primary logistic likelihood-ratio test
and gate-kept PCX-H2 secondary likelihood-ratio test.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy.optimize import minimize
from scipy.stats import chi2

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "artifacts/local/position-complexity/stage2-formal-v1"
SPEC_PATH = ROOT / "doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json"


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


def depth_result(trace: dict[str, Any], depth: int) -> dict[str, Any]:
    for item in trace["results"]:
        if item["depth"] == depth:
            return item
    raise RuntimeError(f"Missing depth result {depth}")


def transition(trace: dict[str, Any], from_depth: int, to_depth: int) -> dict[str, Any]:
    for item in trace["transitions"]:
        if item["fromDepth"] == from_depth and item["toDepth"] == to_depth:
            return item
    raise RuntimeError(f"Missing transition {from_depth}->{to_depth}")


def ordinary_margin(d2: dict[str, Any]) -> bool:
    candidates = d2.get("candidates", [])
    if d2.get("bestSecondGap") is None or len(candidates) < 2:
        return False
    return (
        d2.get("bestScoreClass") == "ordinary-evaluation-domain"
        and candidates[1].get("scoreClass") == "ordinary-evaluation-domain"
    )


def row_from_measurement(measurement: dict[str, Any]) -> dict[str, Any]:
    trace = measurement["exactTrace"]
    d2 = depth_result(trace, 2)
    t23 = transition(trace, 2, 3)
    legal = int(measurement["structural"]["legalMoveCount"])
    if legal < 2:
        raise RuntimeError("Formal selected state violates legalMoveCount >= 2")
    return {
        "ruleStateKey": measurement["ruleStateKey"],
        "historicalTrajectoryHash": measurement["historicalTrajectoryHash"],
        "phase": measurement["assignedPhase"],
        "phaseMtajiIndicator": 1.0 if measurement["assignedPhase"] == "mtaji" else 0.0,
        "legalMoveCount": legal,
        "log1pLegalMoveCount": math.log1p(legal),
        "D23Instability": 1 if bool(t23["topSetDisjoint"]) else 0,
        "D2OrdinaryMargin": ordinary_margin(d2),
        "D2BestSecondGap": d2.get("bestSecondGap"),
        "log1pD2BestSecondGap": math.log1p(float(d2["bestSecondGap"])) if ordinary_margin(d2) else None,
    }


def sigmoid(values: np.ndarray) -> np.ndarray:
    out = np.empty_like(values, dtype=float)
    positive = values >= 0
    out[positive] = 1.0 / (1.0 + np.exp(-values[positive]))
    exp_values = np.exp(values[~positive])
    out[~positive] = exp_values / (1.0 + exp_values)
    return out


def fit_logistic(y: np.ndarray, x: np.ndarray, labels: list[str]) -> dict[str, Any]:
    y = np.asarray(y, dtype=float)
    x = np.asarray(x, dtype=float)
    if x.ndim != 2 or y.ndim != 1 or x.shape[0] != y.shape[0]:
        raise ValueError("Invalid logistic design dimensions")
    if x.shape[1] != len(labels):
        raise ValueError("Logistic label/design mismatch")

    def nll(beta: np.ndarray) -> float:
        eta = x @ beta
        return float(np.sum(np.logaddexp(0.0, eta) - y * eta))

    def grad(beta: np.ndarray) -> np.ndarray:
        eta = x @ beta
        return x.T @ (sigmoid(eta) - y)

    result = minimize(
        nll,
        np.zeros(x.shape[1], dtype=float),
        jac=grad,
        method="BFGS",
        options={"gtol": 1e-8, "maxiter": 5000},
    )
    beta = np.asarray(result.x, dtype=float)
    eta = x @ beta
    probabilities = sigmoid(eta)
    weights = probabilities * (1.0 - probabilities)
    hessian = x.T @ (weights[:, None] * x)
    rank = int(np.linalg.matrix_rank(x))
    try:
        eigenvalues = np.linalg.eigvalsh(hessian)
        min_eigenvalue = float(np.min(eigenvalues))
        max_eigenvalue = float(np.max(eigenvalues))
        condition_number = float(max_eigenvalue / min_eigenvalue) if min_eigenvalue > 0 else math.inf
    except np.linalg.LinAlgError:
        min_eigenvalue = float("nan")
        condition_number = float("inf")

    finite = bool(np.all(np.isfinite(beta)) and math.isfinite(nll(beta)))
    converged = bool(
        result.success
        and finite
        and rank == x.shape[1]
        and math.isfinite(min_eigenvalue)
        and min_eigenvalue > 1e-10
        and math.isfinite(condition_number)
        and condition_number < 1e12
    )
    return {
        "n": int(y.size),
        "events": int(np.sum(y)),
        "stable": int(y.size - np.sum(y)),
        "labels": labels,
        "coefficients": {label: float(value) for label, value in zip(labels, beta)},
        "logLikelihood": float(-nll(beta)),
        "optimizerSuccess": bool(result.success),
        "optimizerStatus": int(result.status),
        "optimizerMessage": str(result.message),
        "iterations": int(getattr(result, "nit", 0)),
        "designRank": rank,
        "designColumns": int(x.shape[1]),
        "hessianMinEigenvalue": min_eigenvalue,
        "hessianConditionNumber": condition_number,
        "finite": finite,
        "converged": converged,
    }


def likelihood_ratio(reduced: dict[str, Any], full: dict[str, Any]) -> dict[str, Any]:
    lr = max(0.0, 2.0 * (full["logLikelihood"] - reduced["logLikelihood"]))
    return {
        "statistic": lr,
        "df": 1,
        "pValue": float(chi2.sf(lr, 1)),
    }


def build_design(rows: list[dict[str, Any]], fields: list[str]) -> tuple[np.ndarray, np.ndarray, list[str]]:
    y = np.asarray([row["D23Instability"] for row in rows], dtype=float)
    columns = [np.ones(len(rows), dtype=float)]
    labels = ["intercept"]
    for field in fields:
        columns.append(np.asarray([float(row[field]) for row in rows], dtype=float))
        labels.append(field)
    return y, np.column_stack(columns), labels


def analyze_rows(rows: list[dict[str, Any]], spec: dict[str, Any]) -> dict[str, Any]:
    phase_counts = {
        "namua": sum(row["phase"] == "namua" for row in rows),
        "mtaji": sum(row["phase"] == "mtaji" for row in rows),
    }
    events = sum(row["D23Instability"] for row in rows)
    stable = len(rows) - events
    gates = spec["formalEstimabilityGates"]

    primary_pre_gates = {
        "minimumSelectedUniqueRuleStates": len(rows) >= gates["minimumSelectedUniqueRuleStates"],
        "minimumNamuaSelectedStates": phase_counts["namua"] >= gates["minimumNamuaSelectedStates"],
        "minimumMtajiSelectedStates": phase_counts["mtaji"] >= gates["minimumMtajiSelectedStates"],
        "minimumD23InstabilityEvents": events >= gates["minimumD23InstabilityEvents"],
        "minimumD23StableEvents": stable >= gates["minimumD23StableEvents"],
    }

    primary_reduced = primary_full = primary_lrt = None
    if all(primary_pre_gates.values()):
        y, xr, labels_r = build_design(rows, ["phaseMtajiIndicator"])
        _, xf, labels_f = build_design(rows, ["phaseMtajiIndicator", "log1pLegalMoveCount"])
        primary_reduced = fit_logistic(y, xr, labels_r)
        primary_full = fit_logistic(y, xf, labels_f)
        primary_lrt = likelihood_ratio(primary_reduced, primary_full)

    primary_model_gate = bool(
        primary_reduced
        and primary_full
        and primary_reduced["converged"]
        and primary_full["converged"]
    )
    primary_gates = {**primary_pre_gates, "finiteConvergedPrimaryModels": primary_model_gate}
    primary_pass = all(primary_gates.values())
    alpha = float(spec["primaryHypothesis"]["test"]["alpha"])
    if not primary_pass:
        h1_decision = "inconclusive"
    elif primary_lrt["pValue"] < alpha:
        h1_decision = "confirmed"
    else:
        h1_decision = "not-confirmed"

    h1_beta = None
    h1_or = None
    if primary_full:
        h1_beta = primary_full["coefficients"].get("log1pLegalMoveCount")
        if h1_beta is not None:
            h1_or = float(math.exp(h1_beta))

    h2_rows = [row for row in rows if row["D2OrdinaryMargin"] and row["log1pD2BestSecondGap"] is not None]
    h2_events = sum(row["D23Instability"] for row in h2_rows)
    h2_stable = len(h2_rows) - h2_events
    h2_pre_gates = {
        "minimumOrdinaryDomainD2MarginsForH2": len(h2_rows) >= gates["minimumOrdinaryDomainD2MarginsForH2"],
        "minimumH2SubsetInstabilityEvents": h2_events >= gates["minimumH2SubsetInstabilityEvents"],
        "minimumH2SubsetStableEvents": h2_stable >= gates["minimumH2SubsetStableEvents"],
    }
    secondary_reduced = secondary_full = secondary_lrt = None
    if all(h2_pre_gates.values()):
        y2, x2r, labels2r = build_design(h2_rows, ["phaseMtajiIndicator", "log1pLegalMoveCount"])
        _, x2f, labels2f = build_design(
            h2_rows,
            ["phaseMtajiIndicator", "log1pLegalMoveCount", "log1pD2BestSecondGap"],
        )
        secondary_reduced = fit_logistic(y2, x2r, labels2r)
        secondary_full = fit_logistic(y2, x2f, labels2f)
        secondary_lrt = likelihood_ratio(secondary_reduced, secondary_full)
    secondary_model_gate = bool(
        secondary_reduced
        and secondary_full
        and secondary_reduced["converged"]
        and secondary_full["converged"]
    )
    secondary_gates = {**h2_pre_gates, "finiteConvergedSecondaryModels": secondary_model_gate}
    secondary_pass = all(secondary_gates.values())

    h2_alpha = float(spec["keySecondaryHypothesis"]["test"]["alpha"])
    if h1_decision != "confirmed":
        h2_decision = "not-confirmatorily-evaluated"
    elif not secondary_pass:
        h2_decision = "inconclusive"
    elif secondary_lrt["pValue"] < h2_alpha:
        h2_decision = "secondary-confirmed"
    else:
        h2_decision = "secondary-not-confirmed"

    h2_beta = None
    h2_or = None
    if secondary_full:
        h2_beta = secondary_full["coefficients"].get("log1pD2BestSecondGap")
        if h2_beta is not None:
            h2_or = float(math.exp(h2_beta))

    return {
        "population": {
            "selectedUniqueRuleStates": len(rows),
            "selectedPhaseCounts": phase_counts,
            "D23InstabilityEvents": events,
            "D23StableEvents": stable,
            "ordinaryDomainD2Margins": len(h2_rows),
            "H2SubsetInstabilityEvents": h2_events,
            "H2SubsetStableEvents": h2_stable,
        },
        "PCX_H1": {
            "decision": h1_decision,
            "gates": primary_gates,
            "reducedModel": primary_reduced,
            "fullModel": primary_full,
            "likelihoodRatioTest": primary_lrt,
            "beta_log1pLegalMoveCount": h1_beta,
            "oddsRatioPerUnitLog1pLegalMoveCount": h1_or,
        },
        "PCX_H2": {
            "decision": h2_decision,
            "confirmatoryGateH1Decision": h1_decision,
            "gates": secondary_gates,
            "reducedModel": secondary_reduced,
            "fullModel": secondary_full,
            "likelihoodRatioTest": secondary_lrt,
            "beta_log1pD2BestSecondGap": h2_beta,
            "oddsRatioPerUnitLog1pD2BestSecondGap": h2_or,
        },
    }


def self_test() -> None:
    rng = np.random.default_rng(20260813)
    n = 800
    phase = rng.binomial(1, 0.5, size=n).astype(float)
    legal = rng.integers(2, 12, size=n).astype(float)
    log_legal = np.log1p(legal)
    gap = rng.gamma(shape=2.0, scale=60.0, size=n)
    log_gap = np.log1p(gap)
    eta = -1.5 + 0.15 * phase + 0.9 * log_legal - 0.35 * log_gap
    y = rng.binomial(1, sigmoid(eta)).astype(int)
    rows = []
    for i in range(n):
        rows.append({
            "phase": "mtaji" if phase[i] else "namua",
            "phaseMtajiIndicator": phase[i],
            "legalMoveCount": int(legal[i]),
            "log1pLegalMoveCount": float(log_legal[i]),
            "D23Instability": int(y[i]),
            "D2OrdinaryMargin": True,
            "D2BestSecondGap": float(gap[i]),
            "log1pD2BestSecondGap": float(log_gap[i]),
        })
    spec = {
        "formalEstimabilityGates": {
            "minimumSelectedUniqueRuleStates": 500,
            "minimumNamuaSelectedStates": 180,
            "minimumMtajiSelectedStates": 180,
            "minimumD23InstabilityEvents": 80,
            "minimumD23StableEvents": 80,
            "minimumOrdinaryDomainD2MarginsForH2": 350,
            "minimumH2SubsetInstabilityEvents": 50,
            "minimumH2SubsetStableEvents": 50,
        },
        "primaryHypothesis": {"test": {"alpha": 0.05}},
        "keySecondaryHypothesis": {"test": {"alpha": 0.05}},
    }
    result = analyze_rows(rows, spec)
    if not result["PCX_H1"]["fullModel"]["converged"]:
        raise RuntimeError("Formal analyzer self-test H1 convergence failed")
    if not result["PCX_H2"]["fullModel"]["converged"]:
        raise RuntimeError("Formal analyzer self-test H2 convergence failed")
    if result["PCX_H1"]["likelihoodRatioTest"] is None or result["PCX_H2"]["likelihoodRatioTest"] is None:
        raise RuntimeError("Formal analyzer self-test LRT missing")
    print(json.dumps({"selfTestPassed": True, "H1": result["PCX_H1"]["decision"], "H2": result["PCX_H2"]["decision"]}, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return

    root = args.input.resolve()
    spec_text = SPEC_PATH.read_text(encoding="utf-8")
    spec = json.loads(spec_text)
    spec_sha = sha256_text(spec_text)

    verification = load_json(root / "verification.json")
    selection = load_json(root / "selection-audit.json")
    manifest = load_json(root / "measurement-manifest.json")

    if verification.get("passed") is not True or verification.get("fullSearchRecomputation") is not True:
        raise RuntimeError("Formal full verification PASS is required before analysis")
    if verification.get("stageId") != spec["stageId"] or verification.get("specSha256") != spec_sha:
        raise RuntimeError("Formal verification/spec mismatch")
    if selection.get("stageId") != spec["stageId"] or selection.get("specSha256") != spec_sha:
        raise RuntimeError("Formal selection/spec mismatch")
    if manifest.get("stageId") != spec["stageId"] or manifest.get("specSha256") != spec_sha:
        raise RuntimeError("Formal measurement/spec mismatch")
    if manifest.get("selectionHash") != selection.get("selectionHash"):
        raise RuntimeError("Formal selection/measurement hash mismatch")
    if manifest.get("completedMeasurements") != selection.get("selectedUniqueRuleStates"):
        raise RuntimeError("Formal measurement count incomplete")

    measurements = []
    for index in range(int(manifest["completedMeasurements"])):
        path = root / "measurements" / f"selected-{index:04d}.json"
        if not path.exists():
            raise RuntimeError(f"Missing formal measurement {index}")
        measurement = load_json(path)
        if measurement.get("stageId") != spec["stageId"] or measurement.get("specSha256") != spec_sha:
            raise RuntimeError(f"Formal measurement identity mismatch at {index}")
        if measurement.get("selectionHash") != selection.get("selectionHash"):
            raise RuntimeError(f"Formal measurement selection mismatch at {index}")
        measurements.append(measurement)

    recomputed_measurement_hash = hash_value([
        {
            "ruleStateKey": m["ruleStateKey"],
            "exactTrace": m["exactTrace"],
            "engineWorkload": [
                {key: value for key, value in workload.items() if key != "elapsedMs"}
                for workload in m["engineWorkload"]
            ],
        }
        for m in measurements
    ])
    if recomputed_measurement_hash != manifest.get("measurementHash"):
        raise RuntimeError("Formal measurementHash mismatch")

    rows = [row_from_measurement(measurement) for measurement in measurements]
    if len({row["ruleStateKey"] for row in rows}) != len(rows):
        raise RuntimeError("Duplicate formal ruleStateKey after frozen collapse")
    if len({row["historicalTrajectoryHash"] for row in rows}) != len(rows):
        raise RuntimeError("Duplicate formal historical trajectory after frozen selection")

    analysis = analyze_rows(rows, spec)
    result = {
        "schemaVersion": 1,
        "stageId": spec["stageId"],
        "specSha256": spec_sha,
        "formalExperiment": True,
        "scientificInferenceAuthorized": True,
        "source": {
            "verificationIdentityHash": verification.get("verifiedIdentityHash"),
            "selectionHash": selection.get("selectionHash"),
            "measurementHash": manifest.get("measurementHash"),
        },
        **analysis,
    }
    result["formalDecision"] = result["PCX_H1"]["decision"]
    result["resultHash"] = hash_value(result)
    atomic_json(root / "stage2-formal-result.json", result)
    print(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
