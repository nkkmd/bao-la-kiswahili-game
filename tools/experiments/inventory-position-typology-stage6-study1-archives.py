#!/usr/bin/env python3
"""Read-only archive inventory for the position-typology / Study 1 bridge.

This script does not extract archives, execute games, rerun formal analyses, or
inspect scientific result values. It verifies the fixed final archive SHA-256
values and inventories member paths needed for a later cross-study bridge.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import posixpath
import re
import tarfile
from pathlib import Path, PurePosixPath

EXPECTED = {
    "E-018": {
        "filename": "e018-final-formal-evaluation.tar.gz",
        "sha256": "bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5",
        "default": "/home/oruorane/bao-e018-exports/e018-final-formal-evaluation.tar.gz",
    },
    "E-019": {
        "filename": "e019-final-formal-evaluation.tar.gz",
        "sha256": "6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75",
        "default": "/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz",
    },
    "E-020": {
        "filename": "e020-final-formal-evaluation.tar.gz",
        "sha256": "37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2",
        "default": "/home/oruorane/bao-e020-exports/e020-final-formal-evaluation.tar.gz",
    },
}

DEFAULT_OUTPUT = (
    "artifacts/local/position-typology/stage6-cross-study-bridge-v1/"
    "study1-archive-inventory.json"
)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--e018", default=EXPECTED["E-018"]["default"])
    parser.add_argument("--e019", default=EXPECTED["E-019"]["default"])
    parser.add_argument("--e020", default=EXPECTED["E-020"]["default"])
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def unsafe_member(name: str) -> bool:
    pure = PurePosixPath(name)
    if pure.is_absolute():
        return True
    return any(part == ".." for part in pure.parts)


def classify_member(name: str) -> set[str]:
    lower = name.lower()
    base = posixpath.basename(lower)
    categories: set[str] = set()

    if re.search(r"/games/game-\d+\.json$", lower):
        categories.add("gameJson")
    if base == "candidate-control-metrics.csv":
        categories.add("candidateControlMetricsCsv")
    if "candidate" in base and base.endswith(".csv"):
        categories.add("candidateCsv")
    if "paired" in base and base.endswith(".json"):
        categories.add("pairedEndpointJson")
    if "integrity" in base and base.endswith(".json"):
        categories.add("integrityJson")
    if ("result" in base or "evaluation" in base) and base.endswith(".json"):
        categories.add("evaluationJson")
    if "trajectory" in base and base.endswith((".json", ".csv")):
        categories.add("trajectoryDiagnostic")
    if "structure" in base and base.endswith((".json", ".csv")):
        categories.add("structureDiagnostic")
    if base.endswith(".json") and "manifest" in base:
        categories.add("manifestJson")
    if lower.endswith("config/experiments/phase-transition-search-profile-dependence-v1.json"):
        categories.add("e018Config")
    if "search-profile-generalization" in lower and lower.endswith(".json"):
        categories.add("e019ConfigOrResult")
    if "d3-reversal" in lower and lower.endswith(".json"):
        categories.add("e020ConfigOrResult")
    return categories


def compact_members(values: list[str], limit: int = 30):
    values = sorted(values)
    return {
        "count": len(values),
        "examples": values[:limit],
        "truncated": len(values) > limit,
    }


def inventory_one(experiment: str, path: Path):
    expected = EXPECTED[experiment]
    if not path.is_file():
        raise FileNotFoundError(f"{experiment}: archive not found: {path}")

    actual_sha = file_sha256(path)
    if actual_sha != expected["sha256"]:
        raise RuntimeError(
            f"{experiment}: archive SHA-256 mismatch: {actual_sha} != {expected['sha256']}"
        )

    categories: dict[str, list[str]] = {}
    unsafe: list[str] = []
    member_count = 0
    regular_file_count = 0
    with tarfile.open(path, mode="r:gz") as archive:
        for member in archive:
            member_count += 1
            if unsafe_member(member.name):
                unsafe.append(member.name)
            if not member.isfile():
                continue
            regular_file_count += 1
            for category in classify_member(member.name):
                categories.setdefault(category, []).append(member.name)

    if unsafe:
        raise RuntimeError(f"{experiment}: unsafe archive members detected")

    return {
        "experiment": experiment,
        "archivePath": str(path),
        "archiveFilename": path.name,
        "expectedFilename": expected["filename"],
        "sha256": actual_sha,
        "sha256MatchesFixedIndex": True,
        "memberCount": member_count,
        "regularFileCount": regular_file_count,
        "unsafeMemberCount": 0,
        "categories": {
            key: compact_members(values)
            for key, values in sorted(categories.items())
        },
    }


def atomic_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
    temporary.replace(path)


def main():
    args = parse_args()
    paths = {
        "E-018": Path(args.e018).expanduser().resolve(),
        "E-019": Path(args.e019).expanduser().resolve(),
        "E-020": Path(args.e020).expanduser().resolve(),
    }

    report = {
        "schemaVersion": 1,
        "status": "stage6-study1-formal-archive-inventory-complete",
        "formalExperiment": False,
        "exploratory": False,
        "secondaryCrossStudyPreparation": True,
        "gamesExecuted": False,
        "formalAnalysisRerun": False,
        "archivesExtracted": False,
        "scientificResultValuesInspected": False,
        "study1FormalDecisionsModified": False,
        "stage5DecisionModified": False,
        "fixedArchiveSha256": {
            experiment: spec["sha256"] for experiment, spec in EXPECTED.items()
        },
        "archives": [inventory_one(experiment, paths[experiment]) for experiment in EXPECTED],
        "nextBoundary": (
            "Use only member-path/schema feasibility to define a separate cross-study bridge; "
            "do not modify or regenerate formal archives."
        ),
    }
    output = Path(args.output).expanduser().resolve()
    atomic_json(output, report)
    print(json.dumps({
        "passed": True,
        "output": str(output),
        "archives": {
            item["experiment"]: {
                "sha256": item["sha256"],
                "memberCount": item["memberCount"],
                "gameJson": item["categories"].get("gameJson", {}).get("count", 0),
                "candidateControlMetricsCsv": item["categories"].get(
                    "candidateControlMetricsCsv", {}
                ).get("count", 0),
            }
            for item in report["archives"]
        },
    }, indent=2))


if __name__ == "__main__":
    main()
