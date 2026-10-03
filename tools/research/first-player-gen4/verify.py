"""別言語で保存棋譜から勝敗・手数・領域件数を再集計する。"""
import json
import pathlib
import sys

def verify(directory, phase):
    root = pathlib.Path(directory)
    summary = json.loads((root / f"{phase}-summary.json").read_text())
    unique = {}
    for file in root.rglob("games/*.json"):
        record = json.loads(file.read_text())
        if record["phase"] != phase:
            continue
        if record["id"] in unique:
            assert unique[record["id"]] == record, "duplicate disagreement"
        unique[record["id"]] = record
    assert len(unique) == summary["games"]
    groups = {}
    for r in unique.values():
        assert r["complete"] and r["manifestHash"] == summary["manifestHash"]
        state, outcome = r["state"], r["outcome"]
        known = state["winner"] is not None and state["reason"] in {"front-empty", "no-move"}
        score = int(state["winner"] == r["firstPlayer"]) if known else None
        assert score == outcome["score"]
        assert outcome["totalPlies"] == len(r["openingMoves"]) + len(r["turns"])
        key = f'{r["policy"]}-{r["requestedOpeningPlies"]}-{r["condition"]}'
        groups.setdefault(key, []).append(r)
    assert set(groups) == set(summary["groups"])
    for key, records in groups.items():
        g = summary["groups"][key]
        first = sum(r["outcome"]["score"] == 1 for r in records)
        second = sum(r["outcome"]["score"] == 0 for r in records)
        unknown = sum(r["outcome"]["score"] is None for r in records)
        assert (first, second, unknown, len(records)) == (g["firstWins"], g["secondWins"], g["unresolved"], g["games"])
        assert len(set(r["slot"] for r in records)) == g["openingSlots"]
        assert len(set(r["openingStateHash"] for r in records)) == g["uniqueOpeningStates"]
        bounds = [first / len(records), (first + unknown) / len(records)]
        assert bounds == g["scoreIdentificationBounds"]
        assert abs(sum(r["outcome"]["totalPlies"] for r in records) / len(records) - g["meanTotalPlies"]) < 1e-10
    output = {"phase": phase, "games": len(unique), "groups": len(groups),
              "status": "INDEPENDENT-RECOUNT-PASS", "rulesIndependent": False,
              "uncertaintyIndependent": False}
    (root / f"{phase}-independent-verification.json").write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps(output))

if __name__ == "__main__":
    verify(sys.argv[1], sys.argv[2])
