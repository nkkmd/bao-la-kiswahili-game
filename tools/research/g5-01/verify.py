"""人工グラフと測定意味をPythonで再計算する。Bao全遷移の独立検算ではない。"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

def stable(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def digest(value):
    return hashlib.sha256(stable(value).encode()).hexdigest()

def classify(graph):
    """勝者の不動点を求め、解決済み部分で距離を別に計算する。"""
    by_id = {n["id"]: n for n in graph}
    assert len(by_id) == len(graph)
    winners = {n["id"]: n["winner"] for n in graph if n["winner"] is not None}
    for n in graph:
        assert all(m["to"] in by_id for m in n["moves"])
    while True:
        previous = len(winners)
        for n in graph:
            if n["id"] in winners:
                continue
            child = [winners.get(m["to"]) for m in n["moves"]]
            if n["player"] in child:
                winners[n["id"]] = n["player"]
            elif child and all(w == 1 - n["player"] for w in child):
                winners[n["id"]] = 1 - n["player"]
        if previous == len(winners):
            break
    distances = {n["id"]: 0 for n in graph if n["winner"] is not None}
    def distance(identity):
        if identity not in distances:
            n = by_id[identity]
            child = [distance(m["to"]) for m in n["moves"]
                     if winners.get(m["to"]) == winners[identity]]
            distances[identity] = 1 + (min(child) if winners[identity] == n["player"] else max(child))
        return distances[identity]
    for identity in winners:
        distance(identity)
    return by_id, winners, distances

def ranking(scores, node):
    rows = sorted([dict(moveKey=m["key"], score=s) for m, s in zip(node["moves"], scores)], key=lambda r: r["moveKey"])
    top = max(r["score"] for r in rows)
    top_set = [r["moveKey"] for r in rows if r["score"] == top]
    return dict(rows=rows, selected=top_set[0], topSet=top_set)

def losses(node, rank, winners, distances):
    if any(m["to"] not in winners for m in node["moves"]):
        return dict(status="NON-ESTIMABLE", reason="UNRESOLVED-CHILD", valueLoss=None,
                    exactOptimalSet=None, selectedValue=None, dtfRegret=None)
    values = {m["key"]: (1 if winners[m["to"]] == node["player"] else -1, distances[m["to"]] + 1)
              for m in node["moves"]}
    best = max(v[0] for v in values.values())
    optimal = sorted(k for k, v in values.items() if v[0] == best)
    picked_value, picked_dtf = values[rank["selected"]]
    best_dtf = (min if best == 1 else max)(values[k][1] for k in optimal)
    return dict(status="ESTIMABLE", valueLoss=best - picked_value, selectedValue=picked_value,
                exactOptimalSet=optimal, outsideOptimalSet=picked_value != best,
                selectedDTF=picked_dtf, dtfRegret=None if picked_value != best
                else picked_dtf - best_dtf if best == 1 else best_dtf - picked_dtf)

def verify(filename):
    result = json.loads(Path(filename).read_text())
    assert result["decision"] == "STAGE0-TECHNICAL-PASS"
    core = result["core"]
    assert digest(core) == result["coreSha256"]
    docs = ROOT / "doc/research-generation-5/g5-01"
    spec = json.loads((docs / "STAGE_0_SPEC.json").read_text())
    auth = json.loads((docs / "STAGE_0_AUTHORIZATION.json").read_text())
    manifest = json.loads((docs / "SOURCE_MANIFEST.json").read_text())
    assert core["binding"] == digest(dict(spec=spec, auth=auth, manifest=manifest))
    for name, expected in manifest["files"].items():
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected, name
    assert core["scientificInference"] is False and core["freshScientificSeedReads"] == 0
    assert core["publicAiChanged"] is False
    assert len(core["rows"]) == 10
    transitions = core["rows"][0]
    assert transitions["id"] == "KNOWN-TAKASIA-TRANSITIONS"
    assert transitions["result"]["status"] == "PASS" and transitions["result"]["failed"] == 0
    searches = [r for r in core["rows"] if r["kind"] == "SEARCH"]
    assert len(searches) == 8
    assert {(r["fixture"], r["depth"]) for r in searches} == {
        (fixture, depth) for fixture in spec["fixtures"] for depth in spec["depths"]}
    for row in searches:
        identity = {k: row["state"][k] for k in spec["rawFields"] if k != "takasia"}
        identity.update(takasia=row["state"].get("takasia"), ruleRevision=spec["ruleRevision"])
        assert identity == row["rawIdentity"] and digest(identity) == row["rawSha256"]
        assert 0 < row["productionNodes"] <= spec["maxNodesPerSearch"]
        assert 0 < row["independentNodes"] <= spec["maxNodesPerSearch"]
        rank = row["ranking"]
        keys = [r["moveKey"] for r in rank["rows"]]
        assert keys == sorted(set(keys))
        maximum = max(r["score"] for r in rank["rows"])
        top = sorted(r["moveKey"] for r in rank["rows"] if r["score"] == maximum)
        assert rank["topSet"] == top and rank["selected"] == top[0]
    assert len(core["searchContrasts"]) == len(spec["fixtures"])
    for observed, fixture_id in zip(core["searchContrasts"], spec["fixtures"]):
        a, b = [next(r["ranking"] for r in searches if r["fixture"] == fixture_id and r["depth"] == depth)
                for depth in spec["depths"]]
        sa, sb = [dict((r["moveKey"], r["score"]) for r in rank["rows"]) for rank in (a, b)]
        assert set(sa) == set(sb)
        sign = lambda n: (n > 0) - (n < 0)
        changed = any(sign(sa[x] - sa[y]) != sign(sb[x] - sb[y]) for x in sa for y in sa)
        assert observed == dict(fixture=fixture_id, exactValueLoss=None,
                                comparison=dict(rankingChanged=changed, selectedChanged=a["selected"] != b["selected"],
                                                topSetChanged=a["topSet"] != b["topSet"]))
    fixture = json.loads((ROOT / "tools/research/g5-01/fixtures.json").read_text())
    synthetic = core["rows"][-1]
    assert synthetic["graph"] == fixture["graph"]
    graph, winners, distances = classify(fixture["graph"])
    for identity, solution in synthetic["solution"]["results"].items():
        assert solution["absoluteWinner"] == winners.get(identity)
        assert solution["dtf"] == distances.get(identity)
        expected = "TERMINAL" if graph[identity]["winner"] is not None else "RECURRENT" if identity not in winners \
            else "WIN" if winners[identity] == graph[identity]["player"] else "LOSS"
        assert solution["status"] == expected
    assert len(synthetic["rows"]) == len(fixture["semanticCases"])
    for observed, case in zip(synthetic["rows"], fixture["semanticCases"]):
        assert observed["id"] == case["id"]
        a, b = [ranking(case[key], graph[case["root"]]) for key in ("a", "b")]
        assert observed["rankings"] == [a, b]
        sa, sb = [dict((r["moveKey"], r["score"]) for r in rank["rows"]) for rank in (a, b)]
        sign = lambda n: (n > 0) - (n < 0)
        changed = any(sign(sa[x] - sa[y]) != sign(sb[x] - sb[y]) for x in sa for y in sa)
        comparison = dict(rankingChanged=changed, selectedChanged=a["selected"] != b["selected"],
                          topSetChanged=a["topSet"] != b["topSet"])
        assert observed["comparison"] == comparison
        assert observed["losses"] == [losses(graph[case["root"]], r, winners, distances) for r in (a, b)]
    assert result["execution"]["elapsedMs"] <= spec["maxElapsedMs"]
    assert result["execution"]["peakRssBytes"] <= spec["maxRssBytes"]
    assert Path(filename).stat().st_size <= spec["maxResultBytes"]
    return dict(decision="INDEPENDENT-TECHNICAL-PASS", coreSha256=result["coreSha256"],
                searchRows=8, semanticCases=len(synthetic["rows"]),
                baoTransitionIndependence=False, scientificInference=False)

if __name__ == "__main__":
    receipt = verify(sys.argv[1])
    if len(sys.argv) > 2:
        Path(sys.argv[2]).write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps(receipt))
