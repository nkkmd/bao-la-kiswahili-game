#!/usr/bin/env python3
"""Locked Stage 2 Namua->Mtaji matched analysis.

`--phase match` constructs R3-M sets without loading or reading M1/M2 labels.
`--phase evaluate` reconstructs the same assignment, verifies its hash, validates
the frozen Mtaji classifier, then performs the single preregistered exact test.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import importlib.util
import json
import math
from collections import Counter, defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "artifacts/local/namua-mtaji-transition/stage2-formal-v1"
DEFAULT_EVENTS = DEFAULT_INPUT / "stage2-event-table.csv"
DEFAULT_SPEC = ROOT / "doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json"
DEFAULT_CANDIDATE = ROOT / "artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json"
MTAJI_AUDIT = ROOT / "tools/experiments/audit-namua-mtaji-mtaji-artifact.py"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", required=True, choices=["match", "evaluate"])
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--events", type=Path, default=DEFAULT_EVENTS)
    parser.add_argument("--spec", type=Path, default=DEFAULT_SPEC)
    parser.add_argument("--candidate", type=Path, default=DEFAULT_CANDIDATE)
    return parser.parse_args()


def canonical_bytes(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def canonical_hash(value) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def sha_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def sha_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(path)


def write_csv(path: Path, rows: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("\n", encoding="utf-8")
        return
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_games(input_dir: Path) -> list[dict]:
    files = sorted((input_dir / "games").glob("game-*.json"))
    return [json.loads(path.read_text(encoding="utf-8")) for path in files]


def validate_formal_inputs(input_dir: Path, events_path: Path, spec_path: Path):
    manifest = json.loads((input_dir / "manifest.json").read_text(encoding="utf-8"))
    verification = json.loads((input_dir / "verification.json").read_text(encoding="utf-8"))
    clock = json.loads((input_dir / "clock-audit.json").read_text(encoding="utf-8"))
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    if manifest.get("formalExperiment") is not True or manifest.get("config", {}).get("stage") != "stage2-formal-confirmation":
        raise RuntimeError("Formal manifest identity mismatch")
    if verification.get("passed") is not True or verification.get("configHash") != manifest.get("configHash"):
        raise RuntimeError("Formal verification gate not passed")
    if clock.get("passed") is not True or clock.get("inputConfigHash") != manifest.get("configHash"):
        raise RuntimeError("Formal deterministic-clock gate not passed")
    if spec.get("formalExperiment") is not True or spec.get("stage") != "stage2-formal-confirmation":
        raise RuntimeError("Formal spec identity mismatch")
    if spec["corpus"]["games"] != manifest["config"]["games"]:
        raise RuntimeError("Formal corpus size differs from frozen spec")
    if spec["corpus"]["baseOpeningSeed"] != manifest["config"]["baseOpeningSeed"]:
        raise RuntimeError("Formal seed block differs from frozen spec")
    if not events_path.exists():
        raise FileNotFoundError(f"Missing formal event table: {events_path}")
    return manifest, verification, clock, spec


def canonical_trajectories(games: list[dict]) -> dict[str, dict]:
    grouped = defaultdict(list)
    for game in games:
        grouped[game["historicalTrajectoryHash"]].append(game)
    return {
        trajectory: sorted(group, key=lambda game: game["gameId"])[0]
        for trajectory, group in grouped.items()
    }


def observation_at(game: dict, ply: int):
    for row in game["observations"]:
        if int(row["ply"]) == int(ply):
            return row
    return None


def total_reserve(observation: dict) -> int:
    return int(sum(int(value) for value in observation["state"]["reserve"]))


def bool_value(value) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"true", "1", "yes"}


def build_matching(input_dir: Path, events_path: Path, spec: dict):
    games = load_games(input_dir)
    canonical = canonical_trajectories(games)
    events = pd.read_csv(events_path)
    if len(games) != int(spec["corpus"]["games"]):
        raise RuntimeError("Formal game count mismatch in matching phase")

    category_a_index = {
        (str(row.historicalTrajectoryHash), int(row.candidatePly))
        for row in events.itertuples(index=False)
    }
    cbe_rows = events[
        (events["candidatePhase"] == "namua")
        & (events["classification"] == "capture-branch-expansion")
        & (events["ascertainmentComplete"].map(bool_value))
    ].copy()
    cbe_trajectories = set(cbe_rows["historicalTrajectoryHash"].astype(str))

    earliest = {}
    for row in cbe_rows.itertuples(index=False):
        trajectory = str(row.historicalTrajectoryHash)
        ply = int(row.candidatePly)
        prior = earliest.get(trajectory)
        if prior is None or ply < prior["candidatePly"]:
            earliest[trajectory] = {
                "historicalTrajectoryHash": trajectory,
                "candidatePly": ply,
                "forcedCaptureAtCandidate": bool_value(row.forcedCaptureAtCandidate),
            }

    exposures_all = []
    for trajectory, exposure in earliest.items():
        game = canonical.get(trajectory)
        if game is None:
            raise RuntimeError(f"Missing canonical game for exposure {trajectory}")
        item = dict(exposure)
        item.update({
            "exposureKey": f"{trajectory}:{exposure['candidatePly']}",
            "canonicalGameId": game["gameId"],
            "firstMtajiMorphologyEligible": bool(game["temporalOutcome"]["firstMtajiMorphologyEligible"]),
            "reachedMtaji": bool(game["temporalOutcome"]["reachedMtaji"]),
            "terminalBeforeMtaji": bool(game["temporalOutcome"]["terminalBeforeMtaji"]),
            "administrativeTruncation": bool(game["temporalOutcome"]["administrativeTruncation"]),
        })
        exposures_all.append(item)

    exposure_salt = spec["comparator"]["exposureOrderSalt"]
    control_salt = spec["comparator"]["controlRankSalt"]
    exposures_all.sort(key=lambda row: sha_text(f"{exposure_salt}|{row['exposureKey']}"))
    exposures_primary = [row for row in exposures_all if row["firstMtajiMorphologyEligible"]]

    controls_per_exposure = int(spec["comparator"]["controlsPerExposure"])
    used_controls = set()
    assignments = []
    support = []
    progression_violations = []

    for exposure_index, exposure in enumerate(exposures_primary):
        t = int(exposure["candidatePly"])
        landmark_ply = t + int(spec["comparator"]["landmarkOffset"])
        candidates = []
        for trajectory, game in canonical.items():
            if trajectory in cbe_trajectories or trajectory in used_controls:
                continue
            if trajectory == exposure["historicalTrajectoryHash"]:
                continue
            if not bool(game["temporalOutcome"]["firstMtajiMorphologyEligible"]):
                continue
            target = observation_at(game, t)
            landmark = observation_at(game, landmark_ply)
            if target is None or landmark is None:
                continue
            if target.get("phase") != "namua" or target.get("terminal") is True:
                continue
            if (trajectory, t) in category_a_index:
                continue
            forced = bool(target["features"]["actor"]["forcedCapture"])
            if forced != bool(exposure["forcedCaptureAtCandidate"]):
                continue
            expected_candidate = 44 - t
            expected_landmark = 44 - landmark_ply
            if total_reserve(target) != expected_candidate or total_reserve(landmark) != expected_landmark:
                progression_violations.append({
                    "exposureKey": exposure["exposureKey"],
                    "controlHistoricalTrajectoryHash": trajectory,
                    "candidatePly": t,
                    "candidateReserve": total_reserve(target),
                    "expectedCandidateReserve": expected_candidate,
                    "landmarkReserve": total_reserve(landmark),
                    "expectedLandmarkReserve": expected_landmark,
                })
                continue
            rank = sha_text(f"{control_salt}|{exposure['exposureKey']}|{trajectory}")
            candidates.append((rank, trajectory, game))

        candidates.sort(key=lambda item: item[0])
        selected = candidates[:controls_per_exposure]
        support.append({
            "exposureKey": exposure["exposureKey"],
            "candidatePly": t,
            "eligibleUnusedR3MControlsBeforeSelection": len(candidates),
            "selectedControls": len(selected),
        })
        set_id = f"S{exposure_index + 1:04d}"
        assignments.append({
            "setId": set_id,
            "role": "exposed",
            "historicalTrajectoryHash": exposure["historicalTrajectoryHash"],
            "canonicalGameId": exposure["canonicalGameId"],
            "candidatePly": t,
            "exposureKey": exposure["exposureKey"],
        })
        for _, trajectory, game in selected:
            used_controls.add(trajectory)
            assignments.append({
                "setId": set_id,
                "role": "control",
                "historicalTrajectoryHash": trajectory,
                "canonicalGameId": game["gameId"],
                "candidatePly": t,
                "exposureKey": exposure["exposureKey"],
            })

    g1_min = int(spec["estimabilityGates"]["minimumMorphologyEligibleUniqueExposedTrajectories"])
    g2_required = int(spec["estimabilityGates"]["requiredControlsPerExposedTrajectory"])
    g1 = len(exposures_primary) >= g1_min
    g2 = bool(exposures_primary) and all(row["selectedControls"] == g2_required for row in support)
    if progression_violations:
        raise RuntimeError(f"Deterministic progression violations in formal matching: {len(progression_violations)}")

    matching_payload = {
        "exposureOrder": [row["exposureKey"] for row in exposures_primary],
        "assignments": assignments,
    }
    audit = {
        "schemaVersion": 1,
        "status": "stage2-formal-preoutcome-matching-complete",
        "formalExperiment": True,
        "morphologyLabelsRead": False,
        "rawGames": len(games),
        "uniqueHistoricalTrajectories": len(canonical),
        "rawFullyAscertainedNamuaCbeRows": int(len(cbe_rows)),
        "uniqueEarliestCbeTrajectories": len(exposures_all),
        "morphologyEligibleUniqueExposedTrajectories": len(exposures_primary),
        "terminalBeforeMtajiEarliestCbeTrajectories": sum(row["terminalBeforeMtaji"] for row in exposures_all),
        "administrativeTruncationEarliestCbeTrajectories": sum(row["administrativeTruncation"] for row in exposures_all),
        "candidatePlyCounts": dict(sorted(Counter(row["candidatePly"] for row in exposures_primary).items())),
        "support": support,
        "usedUniqueControlTrajectories": len(used_controls),
        "progressionViolations": [],
        "estimabilityGates": {
            "G1_minimumMorphologyEligibleUniqueExposures": {"passed": g1, "observed": len(exposures_primary), "required": g1_min},
            "G2_twentyUniqueR3MControlsPerExposure": {"passed": g2, "required": g2_required},
        },
        "matchingAssignmentHash": canonical_hash(matching_payload),
        "interpretationBoundary": {
            "morphologyLabelsRead": False,
            "controlSelectionUsedM1M2": False,
            "effectTestingPerformed": False,
            "rescueSamplingAuthorized": False,
        },
    }
    return games, canonical, exposures_all, exposures_primary, assignments, audit


def first_mtaji_observation(game: dict):
    rows = [
        row for row in game["observations"]
        if row.get("phase") == "mtaji" and row.get("terminal") is False and int(row.get("ply", -1)) >= 8
    ]
    if not rows:
        return None
    row = min(rows, key=lambda item: int(item["ply"]))
    expected = game["temporalOutcome"].get("firstMtajiPly")
    if expected is None or int(row["ply"]) != int(expected):
        raise RuntimeError(f"first Mtaji observation mismatch for {game['gameId']}")
    if int(row["ply"]) != 44:
        raise RuntimeError(f"deterministic first Mtaji ply mismatch for {game['gameId']}: {row['ply']}")
    return row


def poisson_binomial_pmf(probabilities: list[float]) -> list[float]:
    pmf = [1.0]
    for probability in probabilities:
        updated = [0.0] * (len(pmf) + 1)
        for total, mass in enumerate(pmf):
            updated[total] += mass * (1.0 - probability)
            updated[total + 1] += mass * probability
        pmf = updated
    return pmf


def evaluate(input_dir: Path, candidate_path: Path, spec: dict, canonical: dict, assignments: list[dict], matching_audit: dict):
    mtaji = load_module("nmt_stage2_mtaji_audit", MTAJI_AUDIT)
    candidate = json.loads(candidate_path.read_text(encoding="utf-8"))
    recomputed_hash = mtaji.validate_candidate(candidate)
    expected_hash = spec["inheritedDefinitions"]["mtajiCandidateDefinitionHash"]
    if recomputed_hash != expected_hash:
        raise RuntimeError("Frozen Mtaji candidate hash mismatch")

    labeled = []
    for row in assignments:
        game = canonical[row["historicalTrajectoryHash"]]
        observation = first_mtaji_observation(game)
        if observation is None:
            raise RuntimeError(f"Matched morphology-eligible trajectory lacks first Mtaji: {game['gameId']}")
        label = mtaji.classify(observation, candidate)
        if label not in {"MTAJI-M1", "MTAJI-M2"}:
            raise RuntimeError(f"Unexpected frozen morphology label: {label}")
        labeled.append({**row, "firstMtajiPly": int(observation["ply"]), "morphology": label, "Y": 1 if label == "MTAJI-M1" else 0})

    by_set = defaultdict(list)
    for row in labeled:
        by_set[row["setId"]].append(row)
    probabilities = []
    exposed_y = []
    risk_differences = []
    mh_num = 0.0
    mh_den = 0.0
    stratum_summaries = []
    for set_id in sorted(by_set):
        group = by_set[set_id]
        exposed = [row for row in group if row["role"] == "exposed"]
        controls = [row for row in group if row["role"] == "control"]
        if len(exposed) != 1 or len(controls) != int(spec["comparator"]["controlsPerExposure"]):
            raise RuntimeError(f"Malformed matched set {set_id}")
        y_e = int(exposed[0]["Y"])
        c_m1 = sum(int(row["Y"]) for row in controls)
        c_m2 = len(controls) - c_m1
        n = 1 + len(controls)
        m = y_e + c_m1
        probabilities.append(m / n)
        exposed_y.append(y_e)
        risk_differences.append(y_e - c_m1 / len(controls))
        a = y_e
        b = 1 - y_e
        c = c_m1
        d = c_m2
        mh_num += a * d / n
        mh_den += b * c / n
        stratum_summaries.append({
            "setId": set_id,
            "candidatePly": int(exposed[0]["candidatePly"]),
            "exposedMorphology": exposed[0]["morphology"],
            "controlM1": c_m1,
            "controlM2": c_m2,
            "nullExposedM1Probability": m / n,
        })

    observed_t = sum(exposed_y)
    pmf = poisson_binomial_pmf(probabilities)
    p_lower = sum(pmf[: observed_t + 1])
    p_upper = sum(pmf[observed_t:])
    p_two = min(1.0, 2.0 * min(p_lower, p_upper))
    alpha = float(spec["primaryTest"]["alpha"])
    matched_rd = sum(risk_differences) / len(risk_differences)
    control_rows = [row for row in labeled if row["role"] == "control"]
    exposure_rows = [row for row in labeled if row["role"] == "exposed"]
    exposed_rate = sum(row["Y"] for row in exposure_rows) / len(exposure_rows)
    control_rate = sum(row["Y"] for row in control_rows) / len(control_rows)
    if mh_den == 0:
        mh_or = math.inf if mh_num > 0 else None
    else:
        mh_or = mh_num / mh_den

    if p_two < alpha:
        decision = "confirmed-association"
        if matched_rd > 0:
            direction = "CBE-associated-with-MTAJI-M1"
        elif matched_rd < 0:
            direction = "CBE-associated-with-MTAJI-M2"
        else:
            direction = "none"
    else:
        decision = "not-confirmed"
        direction = None

    return labeled, {
        "schemaVersion": 1,
        "status": "stage2-formal-evaluation-complete",
        "formalExperiment": True,
        "scientificInferenceAuthorized": True,
        "candidateDefinition": {
            "expectedHash": expected_hash,
            "storedHash": candidate.get("candidateDefinitionHash"),
            "recomputedHash": recomputed_hash,
            "classifierRefitPerformed": False,
            "restandardizationPerformed": False,
            "relabelingPerformed": False,
        },
        "matchingAssignmentHash": matching_audit["matchingAssignmentHash"],
        "matchedSets": len(by_set),
        "controlsPerSet": int(spec["comparator"]["controlsPerExposure"]),
        "primaryOutcome": {
            "exposedM1": int(sum(row["Y"] for row in exposure_rows)),
            "exposedM2": int(len(exposure_rows) - sum(row["Y"] for row in exposure_rows)),
            "controlM1": int(sum(row["Y"] for row in control_rows)),
            "controlM2": int(len(control_rows) - sum(row["Y"] for row in control_rows)),
            "exposedM1Proportion": exposed_rate,
            "pooledMatchedControlM1Proportion": control_rate,
            "meanWithinStratumMatchedRiskDifference": matched_rd,
            "mantelHaenszelCommonOddsRatio": mh_or,
        },
        "primaryTest": {
            "name": spec["primaryTest"]["name"],
            "observedT": int(observed_t),
            "nullPmf": pmf,
            "pLower": p_lower,
            "pUpper": p_upper,
            "pTwoSided": p_two,
            "alpha": alpha,
            "alternative": "two-sided",
        },
        "formalDecision": decision,
        "direction": direction,
        "strata": stratum_summaries,
        "interpretationBoundary": {
            "conditionalOnMtajiReach": True,
            "causalInterpretationAuthorized": False,
            "MtajiTimingInterpretationAuthorized": False,
            "generalizationBeyondP2D2Authorized": False,
            "additionalPrimaryTestsPerformed": False,
        },
    }


def main():
    args = parse_args()
    input_dir = args.input.resolve()
    events_path = args.events.resolve()
    spec_path = args.spec.resolve()
    candidate_path = args.candidate.resolve()
    manifest, _, _, spec = validate_formal_inputs(input_dir, events_path, spec_path)
    games, canonical, _, _, assignments, matching_audit = build_matching(input_dir, events_path, spec)
    matching_audit.update({
        "inputConfigHash": manifest["configHash"],
        "formalSpecSha256": sha_file(spec_path),
        "eventTableSha256": sha_file(events_path),
    })
    matching_path = input_dir / "stage2-matching-audit.json"
    preoutcome_path = input_dir / "stage2-matched-sets-preoutcome.csv"

    if args.phase == "match":
        write_csv(preoutcome_path, assignments)
        matching_audit["preoutcomeAssignmentCsvSha256"] = sha_file(preoutcome_path)
        atomic_json(matching_path, matching_audit)
        print(json.dumps(matching_audit, ensure_ascii=False, indent=2, sort_keys=True))
        return

    if not matching_path.exists() or not preoutcome_path.exists():
        raise RuntimeError("Run --phase match and freeze the preoutcome assignment before --phase evaluate")
    stored_matching = json.loads(matching_path.read_text(encoding="utf-8"))
    if stored_matching.get("matchingAssignmentHash") != matching_audit["matchingAssignmentHash"]:
        raise RuntimeError("Recomputed matching assignment differs from frozen preoutcome assignment")
    if stored_matching.get("preoutcomeAssignmentCsvSha256") != sha_file(preoutcome_path):
        raise RuntimeError("Frozen preoutcome matched-set CSV hash mismatch")
    if not stored_matching["estimabilityGates"]["G1_minimumMorphologyEligibleUniqueExposures"]["passed"]:
        result = {
            "schemaVersion": 1,
            "status": "stage2-formal-evaluation-not-estimable",
            "formalDecision": spec["estimabilityGates"]["ifExposureGateFails"],
            "matchingAssignmentHash": stored_matching["matchingAssignmentHash"],
            "morphologyLabelsRead": False,
        }
        atomic_json(input_dir / "stage2-formal-result.json", result)
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
        return
    if not stored_matching["estimabilityGates"]["G2_twentyUniqueR3MControlsPerExposure"]["passed"]:
        result = {
            "schemaVersion": 1,
            "status": "stage2-formal-evaluation-not-estimable",
            "formalDecision": spec["estimabilityGates"]["ifComparatorGateFails"],
            "matchingAssignmentHash": stored_matching["matchingAssignmentHash"],
            "morphologyLabelsRead": False,
        }
        atomic_json(input_dir / "stage2-formal-result.json", result)
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
        return

    if not candidate_path.exists():
        raise FileNotFoundError(
            "Frozen Mtaji candidate artifact not found; provide --candidate pointing to the historical artifact. Do not refit it."
        )
    labeled, result = evaluate(input_dir, candidate_path, spec, canonical, assignments, stored_matching)
    write_csv(input_dir / "stage2-matched-sets-with-morphology.csv", labeled)
    result.update({
        "inputConfigHash": manifest["configHash"],
        "formalSpecSha256": sha_file(spec_path),
        "eventTableSha256": sha_file(events_path),
        "preoutcomeAssignmentCsvSha256": sha_file(preoutcome_path),
        "morphologyAssignmentCsvSha256": sha_file(input_dir / "stage2-matched-sets-with-morphology.csv"),
    })
    atomic_json(input_dir / "stage2-formal-result.json", result)
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
