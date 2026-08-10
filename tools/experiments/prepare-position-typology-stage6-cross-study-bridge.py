#!/usr/bin/env python3
"""Prepare Stage 6 Study 1 cross-study bridge replay inputs from fixed formal archives.

This is a read-only extraction/integrity preparation step. It does not compute any
position-type or coordinate association.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import tarfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUTPUT = Path("artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay-input")
DEFAULT_SPEC = Path("doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json")

ARCHIVES = {
    "E-018": {
        "default": Path("/home/oruorane/bao-e018-exports/e018-final-formal-evaluation.tar.gz"),
        "sha256": "bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5",
        "conditions": {
            "D2-LG": {
                "candidate": "artifacts/local/phase-transition-search-profile-dependence-v1/LG/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/search-profile-dependence-v1/LG/games",
            },
            "D2-P2": {
                "candidate": "artifacts/local/phase-transition-search-profile-dependence-v1/P2/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/search-profile-dependence-v1/P2/games",
            },
        },
    },
    "E-019": {
        "default": Path("/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz"),
        "sha256": "6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75",
        "conditions": {
            "D3-LG": {
                "candidate": "artifacts/local/phase-transition-search-profile-generalization-v2/D3-LG/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/search-profile-generalization-v2/D3-LG/games",
            },
            "D3-P2": {
                "candidate": "artifacts/local/phase-transition-search-profile-generalization-v2/D3-P2/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/search-profile-generalization-v2/D3-P2/games",
            },
        },
    },
    "E-020": {
        "default": Path("/home/oruorane/bao-e020-exports/e020-final-formal-evaluation.tar.gz"),
        "sha256": "37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2",
        "conditions": {
            "D3-LG": {
                "candidate": "e020-analysis-final/LG/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/d3-reversal-replication-v1/LG/games",
            },
            "D3-P2": {
                "candidate": "e020-analysis-final/P2/controls/candidate-control-metrics.csv",
                "gamesPrefix": "artifacts/phase-transition/d3-reversal-replication-v1/P2/games",
            },
        },
    },
}

KNOWN_CLASSIFICATIONS = {
    "capture-branch-expansion",
    "temporary-spike",
    "capture-branch-convergence",
    "namua-to-mtaji-precursor",
    "forcing-release-precursor",
}


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--e018", default=str(ARCHIVES["E-018"]["default"]))
    p.add_argument("--e019", default=str(ARCHIVES["E-019"]["default"]))
    p.add_argument("--e020", default=str(ARCHIVES["E-020"]["default"]))
    p.add_argument("--spec", default=str(DEFAULT_SPEC))
    p.add_argument("--output", default=str(DEFAULT_OUTPUT))
    return p.parse_args()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def canonical_hash_without(value: dict, field: str) -> str:
    clone = json.loads(json.dumps(value))
    clone.pop(field, None)
    raw = json.dumps(clone, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def safe_member(name: str) -> bool:
    p = Path(name)
    return not p.is_absolute() and ".." not in p.parts


def read_member_bytes(tf: tarfile.TarFile, name: str) -> bytes:
    try:
        member = tf.getmember(name)
    except KeyError as exc:
        raise RuntimeError(f"missing archive member: {name}") from exc
    if not member.isfile() or not safe_member(member.name):
        raise RuntimeError(f"unsafe or non-file archive member: {name}")
    stream = tf.extractfile(member)
    if stream is None:
        raise RuntimeError(f"unable to read archive member: {name}")
    return stream.read()


def candidate_rows(tf: tarfile.TarFile, member: str, minimum_remaining: int):
    text = read_member_bytes(tf, member).decode("utf-8-sig")
    rows = []
    for index, row in enumerate(csv.DictReader(io.StringIO(text)), start=2):
        if row.get("category") != "A":
            continue
        try:
            remaining = float(row["distanceToTerminal"])
            ply = int(float(row["candidatePly"]))
        except Exception as exc:
            raise RuntimeError(f"{member}:{index}: invalid primary population fields") from exc
        if remaining < minimum_remaining:
            continue
        classification = row.get("classification", "")
        if classification not in KNOWN_CLASSIFICATIONS:
            raise RuntimeError(f"{member}:{index}: unknown classification {classification!r}")
        phase = row.get("phaseAtCandidate")
        if phase not in {"namua", "mtaji"}:
            raise RuntimeError(f"{member}:{index}: invalid phaseAtCandidate {phase!r}")
        game_id = row.get("gameId")
        if not game_id:
            raise RuntimeError(f"{member}:{index}: missing gameId")
        rows.append({
            "sourceRow": index,
            "gameId": game_id,
            "candidatePly": ply,
            "phaseAtCandidate": phase,
            "classification": classification,
            "category": "A",
            "distanceToTerminal": remaining,
            "regimeId": row.get("regimeId"),
            "regimeStartPly": row.get("regimeStartPly"),
            "regimeEndPly": row.get("regimeEndPly"),
            "regimeLength": row.get("regimeLength"),
            "normalizedPositionInRegime": row.get("normalizedPositionInRegime"),
        })
    return rows


def game_index_from_id(game_id: str) -> int:
    match = re.search(r"(\d+)$", game_id)
    if not match:
        raise RuntimeError(f"cannot resolve game index from gameId: {game_id}")
    return int(match.group(1))


def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    tmp.replace(path)


def main():
    args = parse_args()
    spec_path = Path(args.spec).resolve()
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    if spec.get("protocolHash") != "4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc":
        raise RuntimeError("wrong Stage 6 protocol hash")
    if canonical_hash_without(spec, "protocolHash") != spec["protocolHash"]:
        raise RuntimeError("Stage 6 protocol canonical hash mismatch")
    minimum_remaining = int(spec["candidatePopulation"]["minimumPliesRemaining"])

    archive_paths = {
        "E-018": Path(args.e018).resolve(),
        "E-019": Path(args.e019).resolve(),
        "E-020": Path(args.e020).resolve(),
    }
    out = Path(args.output).resolve()
    out.mkdir(parents=True, exist_ok=True)

    manifest = {
        "schemaVersion": 1,
        "status": "stage6-cross-study-replay-input-prepared",
        "protocolHash": spec["protocolHash"],
        "formalExperiment": False,
        "associationAnalysisPerformed": False,
        "gamesExecuted": False,
        "formalAnalysisRerun": False,
        "archivesModified": False,
        "conditions": [],
    }

    for experiment, definition in ARCHIVES.items():
        archive = archive_paths[experiment]
        actual_sha = sha256_file(archive)
        if actual_sha != definition["sha256"]:
            raise RuntimeError(f"{experiment}: archive SHA-256 mismatch")
        with tarfile.open(archive, "r:gz") as tf:
            unsafe = [m.name for m in tf.getmembers() if not safe_member(m.name)]
            if unsafe:
                raise RuntimeError(f"{experiment}: unsafe archive member detected")
            for condition, paths in definition["conditions"].items():
                rows = candidate_rows(tf, paths["candidate"], minimum_remaining)
                by_game = defaultdict(list)
                for row in rows:
                    by_game[row["gameId"]].append(row)

                condition_dir = out / experiment / condition
                games_dir = condition_dir / "games"
                games_dir.mkdir(parents=True, exist_ok=True)

                game_entries = []
                for game_id in sorted(by_game):
                    game_index = game_index_from_id(game_id)
                    member = f"{paths['gamesPrefix']}/game-{game_index:04d}.json"
                    raw = read_member_bytes(tf, member)
                    game = json.loads(raw.decode("utf-8"))
                    if game.get("gameId") != game_id:
                        raise RuntimeError(
                            f"{experiment}/{condition}: gameId mismatch for {member}: "
                            f"{game.get('gameId')} != {game_id}"
                        )
                    game_path = games_dir / f"game-{game_index:04d}.json"
                    game_path.write_bytes(raw)
                    game_entries.append({
                        "gameId": game_id,
                        "gameIndex": game_index,
                        "file": str(game_path.relative_to(out)),
                        "trajectoryHash": game.get("trajectoryHash"),
                        "targets": sorted(by_game[game_id], key=lambda r: (r["candidatePly"], r["sourceRow"])),
                    })

                entry = {
                    "experiment": experiment,
                    "condition": condition,
                    "archiveSha256": actual_sha,
                    "candidateMetricsMember": paths["candidate"],
                    "candidateRowsEligible": len(rows),
                    "candidateBearingGames": len(game_entries),
                    "games": game_entries,
                }
                manifest["conditions"].append(entry)

    manifest_path = out / "replay-input-manifest.json"
    write_json(manifest_path, manifest)
    print(json.dumps({
        "status": manifest["status"],
        "protocolHash": manifest["protocolHash"],
        "conditions": [
            {
                "experiment": c["experiment"],
                "condition": c["condition"],
                "candidateRowsEligible": c["candidateRowsEligible"],
                "candidateBearingGames": c["candidateBearingGames"],
            }
            for c in manifest["conditions"]
        ],
        "output": str(manifest_path),
    }, indent=2))


if __name__ == "__main__":
    main()
