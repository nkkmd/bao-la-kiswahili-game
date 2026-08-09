#!/usr/bin/env python3
"""Stage 1 position-typology feature-table + redundancy audit.

Exploratory only: this script never clusters, labels, or confirms position types.
"""
from __future__ import annotations

import argparse, csv, hashlib, importlib.metadata, json, math, os, platform, statistics, sys
from collections import Counter, defaultdict
from pathlib import Path

DEFAULT_INPUT = "artifacts/local/position-typology/stage1-pilot-v1"
DEFAULT_OUTPUT = f"{DEFAULT_INPUT}/python-feature-audit-v1"
SIDE_FIELDS = [
    "reserve", "houseOwned", "nyumbaSeeds", "frontSeeds", "backSeeds",
    "frontOccupied", "backOccupied", "reusablePits", "frontConnections",
    "legalMoveCount", "captureMoveCount", "forcedCapture", "maxPitSeeds",
    "pitSeedVariance", "seedConcentration", "maxCapturableSeeds", "meanCapturableSeeds",
    "maxCaptureEvents", "meanCaptureEvents", "maxRelayEvents", "meanRelayEvents", "maxChainEvents",
]
AUDIT_EXTRA = ["boardSeeds", "occupiedPits", "meanChainEvents"]
DIFF_FIELDS = [
    "reserve", "nyumbaSeeds", "boardSeeds", "frontSeeds", "backSeeds", "occupiedPits",
    "frontOccupied", "backOccupied", "reusablePits", "frontConnections", "legalMoveCount",
    "captureMoveCount", "maxCapturableSeeds", "meanCapturableSeeds", "maxCaptureEvents",
    "meanCaptureEvents", "maxRelayEvents", "meanRelayEvents", "maxChainEvents", "meanChainEvents",
    "maxPitSeeds", "pitSeedVariance", "seedConcentration",
]


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--input", default=DEFAULT_INPUT)
    p.add_argument("--output", default=DEFAULT_OUTPUT)
    p.add_argument("--high-correlation", type=float, default=0.98)
    return p.parse_args()


def read(path):
    with open(path, encoding="utf-8") as f: return json.load(f)


def atomic_json(path, value):
    path = Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(value, f, indent=2, ensure_ascii=False, sort_keys=True); f.write("\n")
    tmp.replace(path)


def atomic_csv(path, rows, fields):
    path = Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.tmp-{os.getpid()}")
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
    tmp.replace(path)


def package_versions():
    out = {}
    for name in ["numpy", "pandas", "scipy", "scikit-learn", "matplotlib"]:
        try: out[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError: out[name] = None
    return out


def game_files(root): return sorted((root / "games").glob("game-*.json"))


def eligible(games, min_ply):
    return [(g, o) for g in games for o in g["observations"] if not o["terminal"] and o["ply"] >= min_ply]


def occurrence_index(items):
    x = {}
    for g, o in items:
        key = o["identity"]["ruleStateKey"]
        e = x.setdefault(key, {"n": 0, "games": set(), "conditions": set(), "first": o["ply"], "last": o["ply"]})
        e["n"] += 1; e["games"].add(g["gameId"]); e["conditions"].add(g["conditionId"])
        e["first"] = min(e["first"], o["ply"]); e["last"] = max(e["last"], o["ply"])
    return {k: {"rawOccurrenceCount": v["n"], "trajectoryCount": len(v["games"]),
                "conditionCount": len(v["conditions"]), "firstObservedPly": v["first"],
                "lastObservedPly": v["last"]} for k, v in x.items()}


def actor_pits(o):
    p, pits, out = o["player"], o["state"]["pits"], {}
    for side, seat in [("actor", p), ("opponent", 1-p)]:
        for row, ri in [("front", 0), ("back", 1)]:
            for i, value in enumerate(pits[seat][ri]): out[f"pit.{side}.{row}.{i}"] = value
    return out


def flatten(g, o, occ, gp_count):
    row = {
        "gameId": g["gameId"], "conditionId": g["conditionId"], "seed": g["seed"], "ply": o["ply"],
        "turn": o["turn"], "player": o["player"], "phase": o["phase"],
        "ruleStateKey": o["identity"]["ruleStateKey"], "seatCanonicalKey": o["identity"]["seatCanonicalKey"],
        "seatCanonicalTransform": o["identity"]["seatCanonicalTransform"], **occ,
        "gamePhasePositionCount": gp_count, "gamePhaseWeight": 1/gp_count,
    }
    f = o["features"]
    for side in ["actor", "opponent"]:
        for name in SIDE_FIELDS + AUDIT_EXTRA:
            value = f[side][name]; row[f"{side}.{name}"] = int(value) if isinstance(value, bool) else value
    for name in DIFF_FIELDS: row[f"difference.{name}"] = f["difference"][name]
    row["global.boardSeedCount"] = f["global"]["boardSeedCount"]
    row["global.nonEmptyPitCount"] = f["global"]["nonEmptyPitCount"]
    row.update(actor_pits(o)); return row


def dedup(rows, key):
    seen, out = set(), []
    for r in rows:
        if r[key] not in seen: seen.add(r[key]); out.append(r)
    return out


def vals(rows, col): return [float(r[col]) for r in rows]
def std(v):
    if not v: return 0.0
    m = statistics.fmean(v); return math.sqrt(statistics.fmean((x-m)**2 for x in v))
def skew(v):
    s = std(v)
    if not v or s == 0: return 0.0
    m = statistics.fmean(v); return statistics.fmean(((x-m)/s)**3 for x in v)
def quantile(v, q):
    s = sorted(v)
    if not s: return None
    pos = (len(s)-1)*q; lo, hi = math.floor(pos), math.ceil(pos)
    return s[lo] if lo == hi else s[lo]*(hi-pos)+s[hi]*(pos-lo)
def pearson(a, b):
    ma, mb = statistics.fmean(a), statistics.fmean(b)
    da, db = [x-ma for x in a], [x-mb for x in b]
    aa, bb = sum(x*x for x in da), sum(x*x for x in db)
    return None if aa == 0 or bb == 0 else sum(x*y for x,y in zip(da,db))/math.sqrt(aa*bb)


def duplicate_groups(rows, cols):
    groups = defaultdict(list)
    for c in cols: groups[tuple(r[c] for r in rows)].append(c)
    return [g for g in groups.values() if len(g) > 1]


def correlations(rows, cols, threshold):
    cache = {c: vals(rows,c) for c in cols}; out = []
    for i,a in enumerate(cols):
        for b in cols[i+1:]:
            r = pearson(cache[a], cache[b])
            if r is not None and abs(r) >= threshold: out.append({"left":a,"right":b,"pearson":r})
    return sorted(out, key=lambda x: -abs(x["pearson"]))


def relation(rows, left, terms):
    err = max((abs(float(r[left])-sum(k*float(r[c]) for k,c in terms)) for r in rows), default=0.0)
    return {"left": left, "terms": [{"coefficient":k,"column":c} for k,c in terms], "maxAbsResidual":err}


def deterministic(rows):
    out = []
    for side in ["actor", "opponent"]:
        out += [
            relation(rows, f"{side}.boardSeeds", [(1,f"{side}.frontSeeds"),(1,f"{side}.backSeeds")]),
            relation(rows, f"{side}.occupiedPits", [(1,f"{side}.frontOccupied"),(1,f"{side}.backOccupied")]),
            relation(rows, f"{side}.meanChainEvents", [(1,f"{side}.meanCaptureEvents"),(1,f"{side}.meanRelayEvents")]),
        ]
    out += [
        relation(rows,"global.boardSeedCount",[(1,"actor.boardSeeds"),(1,"opponent.boardSeeds")]),
        relation(rows,"global.nonEmptyPitCount",[(1,"actor.occupiedPits"),(1,"opponent.occupiedPits")]),
    ]
    out += [relation(rows,f"difference.{n}",[(1,f"actor.{n}"),(-1,f"opponent.{n}")]) for n in DIFF_FIELDS]
    return out


def stats(rows, cols):
    out = {}
    for c in cols:
        v = vals(rows,c); out[c] = {"min":min(v),"p50":quantile(v,.5),"p95":quantile(v,.95),"max":max(v),
                                    "mean":statistics.fmean(v),"std":std(v),"skewness":skew(v),
                                    "zeroFraction":sum(x==0 for x in v)/len(v),"uniqueValues":len(set(v))}
    return out


def phase_audit(rows, phase, threshold):
    sub = [r for r in rows if r["phase"] == phase]
    s_cols = [f"{side}.{name}" for side in ["actor","opponent"] for name in SIDE_FIELDS]
    audit_cols = [f"{side}.{name}" for side in ["actor","opponent"] for name in SIDE_FIELDS+AUDIT_EXTRA]
    audit_cols += [f"difference.{n}" for n in DIFF_FIELDS] + ["global.boardSeedCount","global.nonEmptyPitCount"]
    return {
        "rows":len(sub), "games":len({r["gameId"] for r in sub}),
        "conditionCounts":dict(sorted(Counter(r["conditionId"] for r in sub).items())),
        "constantColumns":[c for c in audit_cols if len(set(r[c] for r in sub)) <= 1],
        "exactDuplicateColumnGroups":duplicate_groups(sub,audit_cols),
        "highCorrelationThreshold":threshold, "highCorrelationPairs":correlations(sub,s_cols,threshold),
        "deterministicRelations":deterministic(sub), "matrixSStats":stats(sub,s_cols),
    }


def main():
    a = args(); root, outdir = Path(a.input).resolve(), Path(a.output).resolve()
    manifest, verify, pilot = read(root/"manifest.json"), read(root/"verification.json"), read(root/"pilot-audit.json")
    if not (manifest.get("exploratory") is True and manifest.get("formalExperiment") is False and manifest.get("confirmatoryUseAllowed") is False):
        raise RuntimeError("Pilot exploratory boundary mismatch")
    if not (verify.get("passed") is True and pilot.get("passed") is True): raise RuntimeError("Pilot QA must pass first")
    if len({manifest["configHash"],verify["configHash"],pilot["configHash"]}) != 1: raise RuntimeError("Config hash mismatch")
    files = game_files(root); games = [read(p) for p in files]
    if len(games) != manifest["completedGames"]: raise RuntimeError("Game-file count mismatch")
    min_ply = manifest["config"]["populationPolicy"]["primaryDiscoveryMinimumPly"]
    items, occ = eligible(games,min_ply), None; occ = occurrence_index(items)
    gp = Counter((g["gameId"],o["phase"]) for g,o in items)
    rows = [flatten(g,o,occ[o["identity"]["ruleStateKey"]],gp[(g["gameId"],o["phase"])]) for g,o in items]
    primary, canonical = dedup(rows,"ruleStateKey"), dedup(rows,"seatCanonicalKey")
    expected = pilot["eligiblePopulation"]
    if (len(rows),len(primary),len(canonical)) != (expected["rawPositions"],expected["uniqueRuleState"],expected["uniqueSeatCanonical"]):
        raise RuntimeError("Eligible population count mismatch")
    metadata = ["gameId","conditionId","seed","ply","turn","player","phase","ruleStateKey","seatCanonicalKey",
                "seatCanonicalTransform","rawOccurrenceCount","trajectoryCount","conditionCount","firstObservedPly",
                "lastObservedPly","gamePhasePositionCount","gamePhaseWeight"]
    summaries = [f"{s}.{n}" for s in ["actor","opponent"] for n in SIDE_FIELDS+AUDIT_EXTRA]
    summaries += [f"difference.{n}" for n in DIFF_FIELDS]+["global.boardSeedCount","global.nonEmptyPitCount"]
    pits = [f"pit.{s}.{row}.{i}" for s in ["actor","opponent"] for row in ["front","back"] for i in range(8)]
    fields = metadata+summaries+pits
    atomic_csv(outdir/"eligible-primary-rule-state.csv",primary,fields)
    atomic_csv(outdir/"eligible-seat-canonical-sensitivity.csv",canonical,fields)
    matrix_s = [f"{s}.{n}" for s in ["actor","opponent"] for n in SIDE_FIELDS]
    report = {
        "schemaVersion":1,"status":"stage1-python-feature-audit-complete","formalExperiment":False,"exploratory":True,
        "clusteringPerformed":False,"input":str(root),"output":str(outdir),"sourceConfigHash":manifest["configHash"],
        "environment":{"python":sys.version.split()[0],"implementation":platform.python_implementation(),
                       "platform":platform.platform(),"packages":package_versions()},
        "population":{"minimumPly":min_ply,"terminalExcluded":True,"eligibleRaw":len(rows),
                      "primaryRuleStateUnique":len(primary),"seatCanonicalUnique":len(canonical),
                      "seatCanonicalCollapse":len(primary)-len(canonical),
                      "phaseCounts":dict(sorted(Counter(r["phase"] for r in primary).items())),
                      "conditionCounts":dict(sorted(Counter(r["conditionId"] for r in primary).items()))},
        "representations":{"matrixS":{"columns":matrix_s},"matrixC":{"differenceColumns":[f"difference.{n}" for n in DIFF_FIELDS]},
                           "matrixP":{"base":"matrixS","pitColumns":pits}},
        "trajectoryBalance":{"weightColumn":"gamePhaseWeight","definition":"1 / eligible positions within game x phase"},
        "phaseAudit":{phase:phase_audit(primary,phase,a.high_correlation) for phase in ["namua","mtaji"]},
        "outputs":{"primaryTable":"eligible-primary-rule-state.csv","seatCanonicalSensitivityTable":"eligible-seat-canonical-sensitivity.csv"},
    }
    report["auditHash"] = hashlib.sha256(json.dumps(report,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
    atomic_json(outdir/"feature-audit.json",report)
    print(json.dumps({"passed":True,"rows":len(primary),"phaseCounts":report["population"]["phaseCounts"],
                      "seatCanonicalCollapse":report["population"]["seatCanonicalCollapse"],"output":str(outdir),
                      "auditHash":report["auditHash"]},indent=2))

if __name__ == "__main__": main()
