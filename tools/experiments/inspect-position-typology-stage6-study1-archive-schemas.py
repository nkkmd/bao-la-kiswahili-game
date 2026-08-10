#!/usr/bin/env python3
"""Stage 6 read-only schema audit for archived Study 1 formal corpora.

This tool verifies the fixed archive hashes and reports only member paths,
CSV headers, and JSON key/type structure needed to design the cross-study
bridge. It does not rerun games, recompute Study 1 formal analysis, or report
scientific result values.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import tarfile
from pathlib import Path

ARCHIVES = {
    "E-018": {
        "path": Path("/home/oruorane/bao-e018-exports/e018-final-formal-evaluation.tar.gz"),
        "sha256": "bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5",
        "conditions": {
            "D2-P2": {
                "candidate": "artifacts/local/phase-transition-search-profile-dependence-v1/P2/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/search-profile-dependence-v1/P2/games/game-",
            },
            "D2-LG": {
                "candidate": "artifacts/local/phase-transition-search-profile-dependence-v1/LG/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/search-profile-dependence-v1/LG/games/game-",
            },
        },
    },
    "E-019": {
        "path": Path("/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz"),
        "sha256": "6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75",
        "conditions": {
            "D3-P2": {
                "candidate": "artifacts/local/phase-transition-search-profile-generalization-v2/D3-P2/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/search-profile-generalization-v2/D3-P2/games/game-",
            },
            "D3-LG": {
                "candidate": "artifacts/local/phase-transition-search-profile-generalization-v2/D3-LG/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/search-profile-generalization-v2/D3-LG/games/game-",
            },
        },
    },
    "E-020": {
        "path": Path("/home/oruorane/bao-e020-exports/e020-final-formal-evaluation.tar.gz"),
        "sha256": "37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2",
        "conditions": {
            "D3-P2": {
                "candidate": "e020-analysis-final/P2/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/d3-reversal-replication-v1/P2/games/game-",
            },
            "D3-LG": {
                "candidate": "e020-analysis-final/LG/controls/candidate-control-metrics.csv",
                "game_prefix": "artifacts/phase-transition/d3-reversal-replication-v1/LG/games/game-",
            },
        },
    },
}

DEFAULT_OUTPUT = Path(
    "artifacts/local/position-typology/stage6-cross-study-bridge-v1/"
    "study1-archive-schema-audit.json"
)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def type_shape(value, depth=0):
    if depth >= 3:
        return type(value).__name__
    if isinstance(value, dict):
        return {
            "type": "object",
            "keys": sorted(value.keys()),
            "children": {
                key: type_shape(value[key], depth + 1)
                for key in sorted(value.keys())
                if key in {"observations", "moves", "move", "search", "condition", "execution", "experiment"}
            },
        }
    if isinstance(value, list):
        return {
            "type": "array",
            "lengthReported": False,
            "item": type_shape(value[0], depth + 1) if value else "empty",
        }
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, int):
        return "integer"
    if isinstance(value, float):
        return "number"
    if isinstance(value, str):
        return "string"
    return type(value).__name__


def first_member_with_prefix(tar: tarfile.TarFile, prefix: str) -> str:
    matches = sorted(
        member.name for member in tar.getmembers()
        if member.isfile() and member.name.startswith(prefix) and member.name.endswith(".json")
    )
    if not matches:
        raise RuntimeError(f"No game JSON found for prefix: {prefix}")
    return matches[0]


def read_csv_header(tar: tarfile.TarFile, member_name: str):
    member = tar.getmember(member_name)
    stream = tar.extractfile(member)
    if stream is None:
        raise RuntimeError(f"Cannot read: {member_name}")
    text = io.TextIOWrapper(stream, encoding="utf-8", newline="")
    reader = csv.reader(text)
    return next(reader)


def read_json_shape(tar: tarfile.TarFile, member_name: str):
    member = tar.getmember(member_name)
    stream = tar.extractfile(member)
    if stream is None:
        raise RuntimeError(f"Cannot read: {member_name}")
    value = json.load(io.TextIOWrapper(stream, encoding="utf-8"))
    return type_shape(value)


def candidate_feasibility(header):
    fields = set(header)
    candidate_ply_options = [name for name in ["candidatePly", "eventPly", "ply"] if name in fields]
    return {
        "hasGameId": "gameId" in fields,
        "candidatePlyFields": candidate_ply_options,
        "hasClassification": "classification" in fields,
        "hasPhaseAtCandidate": "phaseAtCandidate" in fields,
        "hasDistanceToTerminal": "distanceToTerminal" in fields,
        "hasTrajectoryHash": "trajectoryHash" in fields,
        "hasRegimeFields": any(name in fields for name in ["regimeId", "regimeLength", "normalizedPositionInRegime"]),
    }


def game_feasibility(shape):
    keys = set(shape.get("keys", [])) if isinstance(shape, dict) else set()
    children = shape.get("children", {}) if isinstance(shape, dict) else {}
    move_item = children.get("moves", {}).get("item", {}) if isinstance(children.get("moves"), dict) else {}
    move_keys = set(move_item.get("keys", [])) if isinstance(move_item, dict) else set()
    observation_item = children.get("observations", {}).get("item", {}) if isinstance(children.get("observations"), dict) else {}
    observation_keys = set(observation_item.get("keys", [])) if isinstance(observation_item, dict) else set()
    return {
        "hasMoves": "moves" in keys,
        "hasObservations": "observations" in keys,
        "moveHasPly": "ply" in move_keys,
        "moveHasMoveObject": "move" in move_keys,
        "observationHasPly": "ply" in observation_keys,
        "observationHasStateHash": "stateHash" in observation_keys,
        "observationHasPhase": "phase" in observation_keys,
        "deterministicReplayFeasibleFromArchivedMoves": (
            "moves" in keys and "observations" in keys and "ply" in move_keys
            and "move" in move_keys and "stateHash" in observation_keys
        ),
    }


def main():
    args = parse_args()
    output = {
        "schemaVersion": 1,
        "status": "stage6-study1-formal-archive-schema-audit-complete",
        "formalExperiment": False,
        "secondaryCrossStudyPreparation": True,
        "scientificResultValuesReported": False,
        "associationAnalysisPerformed": False,
        "gamesExecuted": False,
        "formalAnalysisRerun": False,
        "archivesExtracted": False,
        "study1FormalDecisionsModified": False,
        "stage5DecisionModified": False,
        "scope": ["E-018:D2", "E-019:D3", "E-020:D3"],
        "archives": {},
        "nextBoundary": (
            "Use only the audited schema feasibility to freeze the cross-study bridge protocol "
            "before any position-type/coordinate association values are calculated."
        ),
    }

    for experiment, config in ARCHIVES.items():
        archive_path = config["path"]
        observed_sha = sha256_file(archive_path)
        if observed_sha != config["sha256"]:
            raise RuntimeError(f"{experiment}: archive SHA-256 mismatch")
        archive_result = {
            "archivePath": str(archive_path),
            "sha256": observed_sha,
            "sha256MatchesFixedIndex": True,
            "conditions": {},
        }
        with tarfile.open(archive_path, "r:gz") as tar:
            for condition_id, condition in config["conditions"].items():
                header = read_csv_header(tar, condition["candidate"])
                game_member = first_member_with_prefix(tar, condition["game_prefix"])
                game_shape = read_json_shape(tar, game_member)
                archive_result["conditions"][condition_id] = {
                    "candidateMetricsMember": condition["candidate"],
                    "candidateMetricsHeader": header,
                    "candidateMetricsFeasibility": candidate_feasibility(header),
                    "sampleGameMemberUsedForSchemaOnly": game_member,
                    "sampleGameShape": game_shape,
                    "gameReplayFeasibility": game_feasibility(game_shape),
                    "scientificValuesEmitted": False,
                }
        output["archives"][experiment] = archive_result

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(output, indent=2, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
