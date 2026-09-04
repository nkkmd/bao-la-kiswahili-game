#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_PROGRAM_PLAN_BLOB = "2bb90c11f1625f63f40a7eab8a3de7774505a1ac"
RESULT = ROOT / "doc/fresh-depth10-exact-geometry-holdout/results/stage-1/STAGE_1_FORMAL_RESULT.json"


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    (ROOT / path).write_text(text, encoding="utf-8")


def replace_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {n}")
    return text.replace(old, new, 1)


def assert_result():
    r = json.loads(RESULT.read_text(encoding="utf-8"))
    assert r["studyId"] == "FDEGHV-STUDY1"
    assert r["formalDecision"] == "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN"
    assert r["integrityPassed"] is True
    assert r["fullIndependentExactRecomputationPassed"] is True
    assert r["scientificResultCoreSha256"] == "5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9"
    assert all(r["targetDecisions"][k]["decision"] == "DEEPER-CONFIRMED" for k in ("H1", "H2", "H3", "H4"))
    assert r["scientificCore"]["targetDepth"] == 10
    assert r["scientificCore"]["targetComplete"] is True
    assert r["depth11Accessed"] is False
    assert r["g2_12EstimatorScientificInputUsed"] is False
    assert r["sameEvidenceRerunAuthorized"] is False


def sync_study_docs():
    readme = """# G3-11 / FDEGHV-STUDY1 — Fresh Depth-10 Exact Geometry Holdout Validation Study 1

更新日: 2026-09-04

## 状態

```text
Study ID = FDEGHV-STUDY1
Program position = Research Generation 3 / G3-11
Program authorization = G3-11-AUTHORIZED
Lifecycle = CLOSED / FORMAL-COMPLETE
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / STAGE0-PASS
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / FORMAL-COMPLETE / 1 authorized / 1 actual
formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1..H4 = DEEPER-CONFIRMED / DEEPER-CONFIRMED / DEEPER-CONFIRMED / DEEPER-CONFIRMED
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 正式研究題目

**Fresh Depth-10 Exact Geometry Holdout Validation Study 1 — Independent deeper exact validation of third-generation local game-tree geometry using the sealed standard-initial-RAW-root depth-10 domain in Bao**

日本語正式題目:

**Bao standard root depth 10のfresh RAW exact enumerationによる局所ゲーム木幾何holdout検証 — sealed deeper exact domainによる第三世代geometry primitiveと事前固定continuation targetの独立検証**

## 結論

standard initial RAW rootからdepth 10までをRAW-onlyで完全列挙し、production materializationとmaterially separate independent full re-enumerationがexactに一致した。frozen resource gatesもすべてPASSしたため、Study-level formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`である。

4つのprospectively frozen continuation targetはすべて`DEEPER-CONFIRMED`となった。

- H1: depth-10 new RAW states = unique RAW states = **348,270**
- H2: depth-10 tree-node occurrences **494,456** > unique RAW states **348,270**
- H3: cumulative tree/RAW inflation exact cross-product **64,913,155,557 > 61,644,248,915**
- H4: depth-10 duplicate arrivals **11,725**、multiple-predecessor states **10,383**

Cumulative through depth 10は**451,127 distinct RAW states / 466,768 depth-labelled legal edges / 631,101 tree-node occurrences**である。

## Interpretation boundary

本Studyはstandard initial RAW rootのcomplete exact depth-10 domainだけを対象とする。Bao全状態空間・全ゲーム木、depth 11以深、symmetry-reduced count、causal mechanism、human difficulty、game-theoretic valueを確立しない。またG3-04、G3-07、G3-10等の既存formal decisionを再判定しない。

protected depth-10 evidenceは1回のauthorized executionでconsume済みであり、same-Study rerun、cap increase、target change、subset/root rescue、symmetry/canonicalization rescue、G2-12 estimator導入、depth-11 extensionはいずれも認めない。

## 文書

- [Study protocol](STUDY_1_PROTOCOL.md)
- [Final report](STUDY_1_FINAL_REPORT.md)
- [Current status](CURRENT_STATUS.md)
- [Decision register](DECISION_REGISTER.md)
- [Reproducibility index](REPRODUCIBILITY_INDEX.md)
- [Authorization review](../research-program-decisions/2026-09-04-post-g3-10-g3-11-authorization-review.md)
- [Formal closure decision](../research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md)
- [Formal result](results/stage-1/STAGE_1_FORMAL_RESULT.json)
- [Artifact manifest](results/stage-1/ARTIFACT_MANIFEST.json)

Historical `doc/research-generation-3/PROGRAM_PLAN.md`は変更しない。科学的closureと`main` integrationは別gateであり、main統合は未承認・未実施である。
"""
    write("doc/fresh-depth10-exact-geometry-holdout/README.md", readme)

    status = """# FDEGHV-STUDY1 — CURRENT STATUS

更新日: 2026-09-04

## Current state

```text
Program = Research Generation 3 / G3-11
Study = FDEGHV-STUDY1
Program authorization = G3-11-AUTHORIZED
Lifecycle = CLOSED / FORMAL-COMPLETE
Reviewed main anchor = e537199a959c0808cbef6cf8aaeb1caab91e3702
Research branch = research/g3-11-fresh-depth10-exact-geometry-holdout
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / STAGE0-PASS / scientific access false
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / FORMAL-COMPLETE / 1 authorized / 1 actual
Formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
Protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
Same-evidence rerun = NOT AUTHORIZED
Depth-11 access = PROHIBITED / NOT ACCESSED
G2-12 estimator scientific input = PROHIBITED / NOT USED
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Formal result

```text
H1 = DEEPER-CONFIRMED / 348270 == 348270
H2 = DEEPER-CONFIRMED / 494456 > 348270
H3 = DEEPER-CONFIRMED / 64913155557 > 61644248915
H4 = DEEPER-CONFIRMED / duplicate arrivals 11725 / multi-predecessor states 10383
```

Exact cumulative domain through depth 10:

```text
distinct RAW states = 451127
depth-labelled legal edges = 466768
unique RAW graph edges = 466768
tree-node occurrences = 631101
tree-edge occurrences = 631100
cumulative RAW state-set SHA-256 = 7cff40d1c55876555bd3dc07cb0836bc209ed83554847ab297a51e3fb95748f7
canonical scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
```

Materialized verificationは11 reachable layers / 10 parent layersでPASSし、materially separate independent full exact depth-10 re-enumerationもPASSした。Production、independent、final artifact resource gatesはいずれもfrozen ceiling内でPASSした。

## No-rescue boundary

Protected evidence opening後のno-rescue boundaryはactiveである。same-Study rerun、resource ceiling increase、endpoint change、subset promotion、root replacement、symmetry/canonicalization rescue、G2-12 prediction use、depth-11 extensionを行わない。

G3-11はG3-04/G3-07/G3-10等の既存formal decisionを変更しない。Depth 11が必要なら別のfresh prospective Studyとして新しいauthorization reviewを要する。

## Repository state

Study-local final report、decision register、reproducibility index、program closure decision、RG3 closure checkpoint、およびcurrent-facing central documentationをresearch branch上で同期する。Historical `PROGRAM_PLAN.md`は変更しない。

`main` integrationは科学的closureとは別操作であり、明示的ユーザー指示があるまで`NOT AUTHORIZED / NOT PERFORMED`を維持する。
"""
    write("doc/fresh-depth10-exact-geometry-holdout/CURRENT_STATUS.md", status)


def sync_root_readme():
    p = "README.md"
    t = read(p)
    marker = "<!-- GCLD-G3-10-ROOT-README -->"
    block = """<!-- FDEGHV-G3-11-ROOT-README -->
- [`doc/fresh-depth10-exact-geometry-holdout/README.md`](doc/fresh-depth10-exact-geometry-holdout/README.md): Research Generation 3 `G3-11` / `FDEGHV-STUDY1`。standard initial RAW rootをfresh complete exact depth 10までRAW-onlyで列挙し、materially separate independent full re-enumerationもPASS。formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`、H1–H4は全て`DEEPER-CONFIRMED`。depth 10は348,270 unique RAW states / 494,456 tree-node occurrences、累積は451,127 distinct RAW states / 631,101 tree-node occurrences。protected depth-10は1回のauthorized executionでconsume済みでrerun禁止。depth 11は未承認。main integrationは未承認・未実施
"""
    if "<!-- FDEGHV-G3-11-ROOT-README -->" not in t:
        t = replace_once(t, marker, block + marker, "root G3-11 insertion")
    t = t.replace("。causal dynamics / physical hysteresis / strategic regimeを主張せず、protected depth-10は未開封", "。causal dynamics / physical hysteresis / strategic regimeを主張しない。protected depth-10はG3-10 closure時点では未開封で、その後の独立G3-11でprospectively開封・検証済み", 1)
    old_prefix = "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。"
    lines = t.splitlines()
    replaced = 0
    for i, line in enumerate(lines):
        if line.startswith(old_prefix):
            lines[i] = old_prefix + "G3-11 / `FDEGHV-STUDY1`は`CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`。H1–H4はすべて`DEEPER-CONFIRMED`。protected depth-10は1回のauthorized executionでconsume済み、same-evidence rerunとdepth 11は未承認。G3-11のmain integrationは未承認・未実施。"
            replaced += 1
    if replaced != 1:
        raise SystemExit(f"root RG3 current-status bullet expected 1, found {replaced}")
    write(p, "\n".join(lines) + ("\n" if t.endswith("\n") else ""))


def sync_research_index():
    p = "doc/RESEARCH_INDEX.md"
    t = read(p)
    marker = "<!-- GCLD-G3-10-RESEARCH-INDEX -->"
    block = """<!-- FDEGHV-G3-11-RESEARCH-INDEX -->
### Research Generation 3 current highlight — G3-11 / FDEGHV-STUDY1

**状態:** `CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` — H1–H4すべて`DEEPER-CONFIRMED`

G3-11は、Research Generation 3開始時から保護してきたstandard initial RAW rootのcomplete exact depth-10 holdoutを、outcome-blind authorization、RAW-only representation、事前固定resource ceiling、exactly-one protected execution、mandatory independent full re-enumerationの下で初めて開いた。depth 10は348,270 unique RAW states / 494,456 tree-node occurrences、累積depth 0..10は451,127 distinct RAW states / 631,101 tree-node occurrences。H1 exact-depth novelty、H2 layer tree/RAW divergence、H3 cumulative tree/RAW inflation、H4 transposition persistenceはいずれも`DEEPER-CONFIRMED`。Bao全状態空間・全ゲーム木、depth 11、causal/game-theoretic claimや既存G3 decisionの再判定には拡張しない。protected evidenceは1回でconsume済み、same-evidence rerun禁止。G3-11 main integrationは未承認・未実施。

**最初に読む:**

- [`fresh-depth10-exact-geometry-holdout/README.md`](fresh-depth10-exact-geometry-holdout/README.md)
- [`fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md`](fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md)

**再現性・formal record:**

- [`fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md`](fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md)
- [`fresh-depth10-exact-geometry-holdout/DECISION_REGISTER.md`](fresh-depth10-exact-geometry-holdout/DECISION_REGISTER.md)
- [`fresh-depth10-exact-geometry-holdout/results/stage-1/STAGE_1_FORMAL_RESULT.json`](fresh-depth10-exact-geometry-holdout/results/stage-1/STAGE_1_FORMAL_RESULT.json)
- [`research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md`](research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md)

"""
    if "<!-- FDEGHV-G3-11-RESEARCH-INDEX -->" not in t:
        t = replace_once(t, marker, block + marker, "research index G3-11 insertion")
    t = t.replace("protected standard-root complete exact depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。", "protected standard-root complete exact depth-10 holdoutはG3-10 closure時点では`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`であり、後続の独立G3-11でprospectively開封・formal検証された。", 1)
    write(p, t)


def sync_future_agenda():
    p = "doc/FUTURE_RESEARCH_AGENDA.md"
    t = read(p)
    old = "Research Generation 3: **Active / G3-10 `GCLD-STUDY1` CLOSED `FORMAL-COMPLETE` / main integration COMPLETE FAST-FORWARD / post-G3-10 review = `G3-11-AUTHORIZED` / G3-11 `FDEGHV-STUDY1` PRE-HOLDOUT-FREEZE / Stage 0 `STAGE0-PASS` / protected depth-10 SEALED (2026-09-04)**"
    new = "Research Generation 3: **Active / G3-11 `FDEGHV-STUDY1` CLOSED `FORMAL-COMPLETE` / `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` / H1–H4 all `DEEPER-CONFIRMED` / protected depth-10 CONSUMED EXACTLY ONCE / G3-11 main integration NOT AUTHORIZED-NOT PERFORMED (2026-09-04)**"
    t = replace_once(t, old, new, "future header")
    start = "<!-- GCLD-G3-10-CLOSURE:FUTURE -->"
    end = "### 2026-09-03 Research Generation 3 current update"
    s = t.find(start)
    e = t.find(end)
    if s < 0 or e < 0 or e <= s:
        raise SystemExit("future current-update boundaries not found")
    current = """<!-- FDEGHV-G3-11-CLOSURE:FUTURE -->
G3-11 `FDEGHV-STUDY1`は`CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`。standard initial RAW rootをdepth 10までcomplete exact RAW enumerationし、materialized verificationとmaterially separate independent full re-enumerationはいずれもPASSした。depth 10は348,270 unique RAW states / 494,456 tree-node occurrences / 11,725 duplicate arrivals / 10,383 multiple-predecessor states、累積depth 0..10は451,127 distinct RAW states / 631,101 tree-node occurrences。prospectively frozen H1–H4はすべて`DEEPER-CONFIRMED`。protected depth-10は1回のauthorized executionでconsume済みで、same-evidence rerun、resource cap変更、target変更、subset/root rescue、symmetry/canonicalization rescue、G2-12 estimator入力、depth-11 extensionは禁止。G3-11は既存G3 formal decisionを再判定せず、Bao全状態空間・全ゲーム木・causal/game-theoretic claimへ拡張しない。G3-11のmain integrationは`NOT AUTHORIZED / NOT PERFORMED`。historical `PROGRAM_PLAN.md`は変更しない。

<!-- GCLD-G3-10-CLOSURE:FUTURE -->
G3-10 `GCLD-STUDY1`は`CLOSED / FORMAL-COMPLETE`でmain integrationも`COMPLETE / FAST-FORWARD / force=false`。C1/C2/C3/C5は`CONFIRMED`、C4は`NOT-CONFIRMED`。G3-10 closure時点でprotected depth-10は未開封だったが、その後separate post-G3-10 reviewでG3-11がauthorizeされ、独立Studyとして開封・完了した。G3-10のformal decisionやinterpretation boundaryはG3-11によって変更されない。

"""
    t = t[:s] + current + t[e:]
    write(p, t)


def sync_rg3_readme():
    p = "doc/research-generation-3/README.md"
    t = read(p)
    old_status = "Status = ACTIVE / G3-10 GCLD-STUDY1 CLOSED FORMAL-COMPLETE / 4 CONFIRMED + 1 NOT-CONFIRMED / CRCLGR FORMAL-ELIGIBLE / MAIN INTEGRATION COMPLETE / FAST-FORWARD"
    new_status = "Status = ACTIVE / G3-11 FDEGHV-STUDY1 CLOSED FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN / H1..H4 DEEPER-CONFIRMED / G3-11 MAIN INTEGRATION NOT AUTHORIZED-NOT PERFORMED"
    t = replace_once(t, old_status, new_status, "RG3 README status")
    old_depth = "Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED"
    new_depth = "G3-11 program review = G3-11-AUTHORIZED\nG3-11 = FDEGHV-STUDY1 / CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN\nG3-11 Stage 0 = STAGE0-PASS\nG3-11 Stage 1 = FORMAL-COMPLETE / 1 authorized / 1 actual / full independent exact re-enumeration PASS\nG3-11 formal targets = H1 DEEPER-CONFIRMED / H2 DEEPER-CONFIRMED / H3 DEEPER-CONFIRMED / H4 DEEPER-CONFIRMED\nProtected depth-10 exact holdout = OPENED / CONSUMED EXACTLY ONCE BY G3-11 / SAME-EVIDENCE RERUN NOT AUTHORIZED\nDepth-11 access = NOT AUTHORIZED / NOT ACCESSED\nG3-11 main integration = NOT AUTHORIZED / NOT PERFORMED"
    t = replace_once(t, old_depth, new_depth, "RG3 README depth status")
    anchor = "- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state\n"
    links = """- [`../fresh-depth10-exact-geometry-holdout/README.md`](../fresh-depth10-exact-geometry-holdout/README.md) — G3-11 formal-complete Study入口
- [`../fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md`](../fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md) — G3-11 exact depth-10 result / interpretation boundary正本
- [`../fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md`](../fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md) — G3-11 source binding / Actions / exact artifact provenance
- [`../research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md`](../research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md) — G3-11 formal closure decision
- [`checkpoints/2026-09-04-g3-11-formal-complete-closure.md`](checkpoints/2026-09-04-g3-11-formal-complete-closure.md) — G3-11 RG3 closure checkpoint
"""
    if "../fresh-depth10-exact-geometry-holdout/README.md" not in t:
        t = replace_once(t, anchor, anchor + links, "RG3 README read-first")
    write(p, t)


def sync_rg3_status():
    p = "doc/research-generation-3/CURRENT_STATUS.md"
    t = read(p)
    old_program = "Program status = ACTIVE / G3-10 GCLD-STUDY1 CLOSED FORMAL-COMPLETE / C1+C2+C3+C5 CONFIRMED / C4 NOT-CONFIRMED / MAIN INTEGRATION COMPLETE / FAST-FORWARD"
    new_program = "Program status = ACTIVE / G3-11 FDEGHV-STUDY1 CLOSED FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN / H1..H4 DEEPER-CONFIRMED / G3-11 MAIN INTEGRATION NOT AUTHORIZED-NOT PERFORMED"
    t = replace_once(t, old_program, new_program, "RG3 current program line")
    old_depth = "Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED"
    new_depth = "G3-11 program review = G3-11-AUTHORIZED\nG3-11 = FDEGHV-STUDY1 / CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN\nG3-11 Stage 0 = STAGE0-PASS\nG3-11 Stage 1 = FORMAL-COMPLETE / 1 authorized / 1 actual / full independent exact re-enumeration PASS\nG3-11 depth-10 exact = 348270 unique RAW / 494456 tree occurrences / 11725 duplicate arrivals / 10383 multi-predecessor states\nG3-11 cumulative through depth 10 = 451127 distinct RAW / 466768 depth-labelled legal edges / 631101 tree occurrences\nG3-11 scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9\nProtected depth-10 exact holdout = OPENED / CONSUMED EXACTLY ONCE BY G3-11 / SAME-EVIDENCE RERUN NOT AUTHORIZED\nDepth-11 access = NOT AUTHORIZED / NOT ACCESSED\nG3-11 main integration = NOT AUTHORIZED / NOT PERFORMED"
    t = replace_once(t, old_depth, new_depth, "RG3 current depth status")
    old_next = "Next scientific action = none within GCLD-STUDY1; do not rerun consumed Stage 1/2 evidence; post-G3-10 next-study review is separate and not auto-authorized"
    new_next = "Next scientific action = none within FDEGHV-STUDY1; do not rerun consumed depth-10 evidence; any depth-11 work requires a separate prospective Study and authorization review"
    t = replace_once(t, old_next, new_next, "RG3 current next action")
    section_anchor = "## Immutable upstream boundaries"
    section = """## G3-11 formal closure

G3-11 `FDEGHV-STUDY1`はstandard initial RAW rootのpreviously sealed exact depth-10 holdoutをprospectively開封し、complete enumerationとfull independent re-enumerationを完了した。

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1 = DEEPER-CONFIRMED
H2 = DEEPER-CONFIRMED
H3 = DEEPER-CONFIRMED
H4 = DEEPER-CONFIRMED
Stage 1 Actions run = 33837413663 / success / run number 1
verified artifact ID = 9923817605
canonical scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

G3-11はsingle standard-root depth-10 exact domainに限定され、upstream G3 decisions、whole-Bao state-space/game-tree size、causal/game-theoretic interpretationを変更しない。

"""
    if "## G3-11 formal closure" not in t:
        t = replace_once(t, section_anchor, section + section_anchor, "RG3 current G3-11 section")
    write(p, t)


def audit():
    paths = [
        "README.md",
        "doc/RESEARCH_INDEX.md",
        "doc/FUTURE_RESEARCH_AGENDA.md",
        "doc/research-generation-3/README.md",
        "doc/research-generation-3/CURRENT_STATUS.md",
        "doc/fresh-depth10-exact-geometry-holdout/README.md",
        "doc/fresh-depth10-exact-geometry-holdout/CURRENT_STATUS.md",
        "doc/fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md",
        "doc/fresh-depth10-exact-geometry-holdout/DECISION_REGISTER.md",
        "doc/fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md",
        "doc/research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md",
        "doc/research-generation-3/checkpoints/2026-09-04-g3-11-formal-complete-closure.md",
    ]
    for p in paths:
        if not (ROOT / p).is_file():
            raise SystemExit(f"missing current/final doc: {p}")
    joined = "\n".join(read(p) for p in paths)
    for token in [
        "FDEGHV-STUDY1",
        "EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN",
        "DEEPER-CONFIRMED",
        "5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9",
        "main integration = NOT AUTHORIZED / NOT PERFORMED",
    ]:
        if token not in joined:
            raise SystemExit(f"required token absent: {token}")
    for p in [
        "doc/fresh-depth10-exact-geometry-holdout/README.md",
        "doc/fresh-depth10-exact-geometry-holdout/CURRENT_STATUS.md",
    ]:
        txt = read(p)
        for stale in ["PRE-HOLDOUT-FREEZE", "NOT YET EXECUTED", "Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED"]:
            if stale in txt:
                raise SystemExit(f"stale current-state token in {p}: {stale}")
    if read("doc/research-generation-3/PROGRAM_PLAN.md").splitlines()[0] != "# Research Generation 3 — Program Plan":
        raise SystemExit("historical PROGRAM_PLAN unexpectedly altered")
    print("FDEGHV_FINAL_DOC_AUDIT=PASS")


def main():
    assert_result()
    sync_study_docs()
    sync_root_readme()
    sync_research_index()
    sync_future_agenda()
    sync_rg3_readme()
    sync_rg3_status()
    audit()


if __name__ == "__main__":
    main()
