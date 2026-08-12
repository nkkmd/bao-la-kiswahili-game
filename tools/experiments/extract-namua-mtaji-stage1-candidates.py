#!/usr/bin/env python3
"""Reproduce the inherited Category-A candidacy pipeline on Stage 1 pilot data.

This is exploratory design support for the independent Namua->Mtaji temporal
study. Historical signal, persistence, clustering, and forcing-ablation
functions are imported rather than reimplemented. No threshold tuning or
formal inference is performed.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
V2_PATH = ROOT / "tools/experiments/analyze-phase-transition-pilot.py"
ABLATION_PATH = ROOT / "tools/experiments/analyze-phase-transition-forcing-ablation.py"
DEFAULT_INPUT = ROOT / "artifacts/local/namua-mtaji-transition/stage1-pilot-v1"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


v2 = load_module("nmt_inherited_phase_transition_v2", V2_PATH)
ablation = load_module("nmt_inherited_forcing_ablation", ABLATION_PATH)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=None)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, start=1):
            if not line.strip():
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as exc:
                raise RuntimeError(f"Invalid JSONL line {line_number}: {exc}") from exc
    return rows


def validate_identity(manifest: dict, input_dir: Path):
    if manifest.get("formalExperiment") is not False:
        raise RuntimeError("Stage 1 formal boundary mismatch")
    if manifest.get("scientificInferenceAuthorized") is not False:
        raise RuntimeError("Stage 1 scientific-inference boundary mismatch")
    if manifest.get("exploratoryAnalysisAuthorized") is not True:
        raise RuntimeError("Stage 1 exploratory-analysis boundary mismatch")
    if manifest.get("confirmatoryReuseAllowed") is not False:
        raise RuntimeError("Stage 1 confirmatory-reuse boundary mismatch")
    config = manifest.get("config", {})
    if config.get("study") != "namua-mtaji-temporal-transition":
        raise RuntimeError("Unexpected study identity")
    if config.get("stage") != "stage1-exploratory-temporal-pilot":
        raise RuntimeError("Unexpected Stage 1 identity")

    inherited = config.get("inheritedDefinitions", {})
    if float(inherited.get("categoryASignalThreshold")) != float(ablation.PRIMARY_SIGNAL_THRESHOLD):
        raise RuntimeError("Inherited Category-A signal threshold mismatch")
    if float(inherited.get("categoryAPersistenceThreshold")) != float(ablation.PRIMARY_PERSISTENCE_THRESHOLD):
        raise RuntimeError("Inherited Category-A persistence threshold mismatch")
    if int(inherited.get("categoryAClusterMaxGap")) != int(v2.CLUSTER_MAX_GAP):
        raise RuntimeError("Inherited Category-A cluster-gap mismatch")
    if list(ablation.NON_FORCING_SIGNALS) != [
        "reserve_signal", "mobility_signal", "capture_signal", "front_signal"
    ]:
        raise RuntimeError("Inherited non-forcing signal groups changed")

    for name in ("games-summary.json", "legacy-observations.jsonl"):
        path = input_dir / name
        expected = manifest["aggregateFiles"][name]["sha256"]
        actual = sha256_file(path)
        if actual != expected:
            raise RuntimeError(f"Aggregate SHA-256 mismatch for {name}")


def load_stage1(input_dir: Path):
    manifest = json.loads((input_dir / "manifest.json").read_text(encoding="utf-8"))
    validate_identity(manifest, input_dir)
    games = pd.json_normalize(json.loads(
        (input_dir / "games-summary.json").read_text(encoding="utf-8")
    ))
    observations = pd.json_normalize(read_jsonl(input_dir / "legacy-observations.jsonl"))
    observations = observations.sort_values(["gameId", "ply"]).reset_index(drop=True)
    if observations.duplicated(["gameId", "ply"]).any():
        raise RuntimeError("Duplicate gameId + ply observations")
    if len(games) != int(manifest["completedGames"]):
        raise RuntimeError("Stage 1 game count mismatch")
    if len(observations) != int(manifest["summary"]["observations"]):
        raise RuntimeError("Stage 1 observation count mismatch")
    return observations, games, manifest


def prepare_stage1(observations: pd.DataFrame, games: pd.DataFrame) -> pd.DataFrame:
    frame = v2.prepare_features(observations)
    frame = v2.attach_game_boundaries(frame, games)
    frame = v2.add_formal_events(frame)
    frame = v2.add_candidate_scores(frame)
    frame = v2.add_persistence(frame)
    return frame


def counts_by(frame: pd.DataFrame, *columns: str) -> list[dict]:
    if frame.empty:
        return []
    grouped = frame.groupby(list(columns), dropna=False).size().reset_index(name="count")
    return grouped.to_dict(orient="records")


def main():
    args = parse_args()
    input_dir = args.input.resolve()
    output_dir = (args.output or args.input).resolve()
    observations, games, manifest = load_stage1(input_dir)
    frame = prepare_stage1(observations, games)

    clusters_by_mode = {}
    mode_rows = []
    for mode in ablation.MODES:
        metrics, points, clusters = ablation.mode_metrics(
            frame,
            "stage1_fresh_all",
            mode,
            ablation.PRIMARY_SIGNAL_THRESHOLD,
            ablation.PRIMARY_PERSISTENCE_THRESHOLD,
        )
        clusters_by_mode[mode] = clusters
        mode_rows.append(metrics)

    audit = ablation.classify_primary_clusters(frame, clusters_by_mode)
    condition_map = games.set_index("gameId")["conditionId"].to_dict()
    replicate_map = games.set_index("gameId")["replicateIndex"].to_dict()
    if not audit.empty:
        audit.insert(3, "conditionId", audit["gameId"].map(condition_map))
        audit.insert(4, "replicateIndex", audit["gameId"].map(replicate_map).astype(int))

    category_a = audit[audit["category"] == "A"].copy() if not audit.empty else audit.copy()
    output_dir.mkdir(parents=True, exist_ok=True)
    audit.to_csv(output_dir / "candidate-audit-table.csv", index=False)
    category_a.to_csv(output_dir / "category-a-candidates.csv", index=False)

    category_counts = audit["category"].value_counts().to_dict() if not audit.empty else {}
    report = {
        "schemaVersion": 1,
        "status": "stage1-inherited-category-a-pipeline-complete",
        "formalExperiment": False,
        "scientificInferenceAuthorized": False,
        "exploratoryAnalysisAuthorized": True,
        "confirmatoryReuseAllowed": False,
        "inputConfigHash": manifest["configHash"],
        "sourceCommit": manifest["provenance"]["sourceCommit"],
        "inheritedPipeline": {
            "phaseTransitionPilotSource": str(V2_PATH.relative_to(ROOT)),
            "forcingAblationSource": str(ABLATION_PATH.relative_to(ROOT)),
            "signalThreshold": ablation.PRIMARY_SIGNAL_THRESHOLD,
            "persistenceThreshold": ablation.PRIMARY_PERSISTENCE_THRESHOLD,
            "clusterMaxGap": v2.CLUSTER_MAX_GAP,
            "nonForcingSignals": list(ablation.NON_FORCING_SIGNALS),
            "historicalFunctionsReused": [
                "prepare_features",
                "attach_game_boundaries",
                "add_formal_events",
                "add_candidate_scores",
                "add_persistence",
                "mode_metrics",
                "classify_primary_clusters",
            ],
        },
        "population": {
            "games": int(len(games)),
            "observations": int(len(observations)),
            "analysisEligibleObservations": int(frame["analysis_eligible"].sum()),
        },
        "modeMetrics": mode_rows,
        "categoryCounts": {
            "A": int(category_counts.get("A", 0)),
            "B": int(category_counts.get("B", 0)),
            "C": int(category_counts.get("C", 0)),
        },
        "categoryA": {
            "count": int(len(category_a)),
            "byCondition": counts_by(category_a, "conditionId"),
            "byConditionAndPhase": counts_by(category_a, "conditionId", "phase"),
        },
        "outputs": {
            "candidateAuditTable": "candidate-audit-table.csv",
            "categoryACandidates": "category-a-candidates.csv",
        },
        "interpretationBoundary": {
            "candidateDefinitionModified": False,
            "thresholdOptimizationPerformed": False,
            "effectTestingPerformed": False,
            "formalClaimAuthorized": False,
        },
    }
    (output_dir / "candidate-pipeline-audit.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
