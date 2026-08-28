#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / "doc/search-reliability-decision-robustness"
RESULTS = STUDY / "results"

ARTIFACT_ZIP_SHA256 = "c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a"
RUN_ID = 33124538584
ARTIFACT_ID = 9672561139
SOURCE_FREEZE_COMMIT = "e176cafc15d2dde7b8767de6961959bb7ee9bb7b"
AUTHORIZATION_COMMIT = "bec87d54540c96c24353f2eeadc25338c53e54eb"

EXPECTED = {
    "stage2-generation-manifest.json": "64ee67538d1a07a77553c1cd83319a23bc07574a2cff6ad70a02afd8cb67f209",
    "stage2-selected-states.json": "1c30b384c4afc38d6505f7065b1faba94111731a844565f55dd5b10d6996f263",
    "stage2-measurements.json": "d58e14880853b8d0bf0929dfa8f8e6216e9f8aac33622b87c2dda0e1907ded34",
    "stage2-verification.json": "aafefdd033da71104662202360c77579649ec62c4820b07d37461678fdca1a13",
    "stage2-formal-result.json": "c7f71a4422d6f11fdf7dc14a76796b21c6e9670b503f930f6e1cea0b899b5553",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def append_once(path: Path, marker: str, addition: str) -> None:
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        write(path, text.rstrip() + "\n\n" + addition.strip())


def materialize(artifact: Path) -> tuple[dict, dict, dict]:
    for name, expected in EXPECTED.items():
        data = (artifact / name).read_bytes()
        got = sha256(data)
        if got != expected:
            raise RuntimeError(f"{name} SHA mismatch: {got} != {expected}")

    manifest = json.loads((artifact / "stage2-generation-manifest.json").read_text(encoding="utf-8"))
    verification = json.loads((artifact / "stage2-verification.json").read_text(encoding="utf-8"))
    formal = json.loads((artifact / "stage2-formal-result.json").read_text(encoding="utf-8"))

    assert manifest["games"] == 1536
    assert manifest["seedStart"] == 25021001 and manifest["seedEnd"] == 25022536
    assert verification["passed"] is True
    assert verification["gamesVerified"] == 1536
    assert verification["gameReplayMismatches"] == 0
    assert verification["selectedStateMismatches"] == 0
    assert verification["measurementMismatches"] == 0
    assert verification["selectionHashMatches"] is True
    assert verification["measurementHashMatches"] is True
    assert verification["postFirewallOverlapCounts"] == {
        "historicalTrajectory": 0,
        "openingPrefix": 0,
        "selectedRawState": 0,
    }

    assert formal["formalDecision"] == "INCONCLUSIVE"
    assert formal["gates"]["passed"] is False
    assert formal["primaryFormalCriterion"] is None
    failed = [k for k, v in formal["gates"]["checks"].items() if not v["passed"]]
    assert failed == ["uniqueHistoricalTrajectoriesAfterStage1Firewall"]
    assert formal["populationSummary"] == {
        "generatedGames": 1536,
        "trajectoriesAfterStage1TrajectoryOpeningFirewall": 1132,
        "uniqueHistoricalTrajectoriesAfterStage1Firewall": 1040,
        "selectedUniqueRawStates": 1007,
        "phaseCounts": {"namua": 518, "mtaji": 489},
        "postFirewallOverlapCounts": {
            "historicalTrajectory": 0,
            "openingPrefix": 0,
            "selectedRawState": 0,
        },
    }
    assert formal["canonicalResultHash"] == "7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36"

    RESULTS.mkdir(parents=True, exist_ok=True)
    (RESULTS / "STAGE_2_GENERATION_MANIFEST.json").write_bytes((artifact / "stage2-generation-manifest.json").read_bytes())
    (RESULTS / "STAGE_2_VERIFICATION.json").write_bytes((artifact / "stage2-verification.json").read_bytes())
    (RESULTS / "STAGE_2_FORMAL_RESULT.json").write_bytes((artifact / "stage2-formal-result.json").read_bytes())

    summary = {
        "schemaVersion": 1,
        "programLabel": "G2-02",
        "studyId": "SRDR-STUDY1",
        "stageId": "SRDR-S2-FORMAL-2026-08-27-v1",
        "generatedGames": 1536,
        "seedStart": 25021001,
        "seedEnd": 25022536,
        "selectionAudit": {
            "trajectoriesAfterStage1TrajectoryOpeningFirewall": 1132,
            "uniqueHistoricalTrajectoriesAfterStage1Firewall": 1040,
            "selectedUniqueRawStates": 1007,
            "phaseCounts": {"namua": 518, "mtaji": 489},
            "postFirewallOverlapCounts": {
                "historicalTrajectory": 0,
                "openingPrefix": 0,
                "selectedRawState": 0,
            },
        },
        "independentVerification": {
            "passed": True,
            "gamesVerified": 1536,
            "gameReplayMismatches": 0,
            "selectedStateMismatches": 0,
            "measurementMismatches": 0,
            "selectionHashMatches": True,
            "measurementHashMatches": True,
        },
        "hashes": formal["hashes"],
        "artifact": {
            "workflowRun": RUN_ID,
            "artifactId": ARTIFACT_ID,
            "artifactZipSha256": ARTIFACT_ZIP_SHA256,
        },
        "formalDecision": "INCONCLUSIVE",
        "failedGate": {
            "id": "uniqueHistoricalTrajectoriesAfterStage1Firewall",
            "observed": 1040,
            "threshold": 1050,
            "deficit": 10,
        },
        "primaryFormalCriterionEvaluated": False,
        "canonicalResultHash": formal["canonicalResultHash"],
    }
    write(RESULTS / "STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json", json.dumps(summary, indent=2, ensure_ascii=False))
    return manifest, verification, formal


def write_study_docs(formal: dict) -> None:
    pooled = formal["secondaryProfile"]["pooled"]
    overview = f"""# Search Reliability / Decision Robustness Study 1 — Overview

Program label: `G2-02`  
Study ID: `SRDR-STUDY1`  
Research Generation: **Research Generation 2**  
Status: **COMPLETE / formal decision `INCONCLUSIVE`**

## 何を調べたか

同一のauthoritative RAW stateに対し、探索depth、node budget、quiescenceをprospectively frozenに変化させたとき、best move、TopSet、ranking、evaluation sign、principal variationがどの程度安定するかを検証した。

本Studyのprimary constructは**machine search reliability / decision robustness**であり、人間の難しさ、局面複雑度、game-theoretic value、engine correctness、public AI strengthとは別物である。D3などの高resource条件もtruthではなくfrozen search referenceとしてのみ扱った。

## 設計

```text
Stage 0 = technical validation / PASS
Stage 1 = 1,280 fresh development games / PROFILE-FROZEN-DEVELOPMENT
Stage 2 = 1,536 fresh held-out formal games
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
Stage 1 -> Stage 2 firewall = trajectory + opening prefix + RAW state
search grid = D1_Q1, D2_Q1, D3_Q1, D2_Q0, D2_Q2, B64, B256, B1024
move ordering = frozen
node-budget partial iteration = discarded
```

Stage 1は1,018 selected unique RAW states（Namua 527 / Mtaji 491）で全readiness gateをPASSし、development profileをfreezeした。

## Stage 2

Stage 2は1,536/1,536 gamesを生成し、独立verifierが全game replay、selection、1,007 selected statesのmeasurementを再構築した。

```text
games verified = 1536 / 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash match = true
measurement hash match = true
Stage 1 overlap = trajectory 0 / opening prefix 0 / RAW state 0
```

しかし、事前固定したestimability gateのうち1項目が未達だった。

| Gate | observed | required | result |
| --- | ---: | ---: | --- |
| unique historical trajectories after Stage 1 firewall | **1,040** | **>= 1,050** | **FAIL** |
| selected unique RAW states | 1,007 | >= 1,000 | PASS |
| Namua selected states | 518 | >= 450 | PASS |
| Mtaji selected states | 489 | >= 450 | PASS |
| distinct opening prefixes after firewall | 1,040 | >= 900 | PASS |

10 trajectory不足でも、追加seed、replacement、threshold relaxation、near-miss exceptionはno-rescue ruleに反するため実施していない。

## Formal decision

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

Gateが全PASSしなかったため、pre-registered primary 3 criteriaはformal decision-bearing evaluationへ入っていない。したがって`CONFIRMED`または`NOT-CONFIRMED`へ読み替えない。

## 記述的secondary profile

Gate failure後も、事前指定されたsecondary profileはdescriptive evidenceとして保存する。

```text
D2_Q1 vs D3_Q1 canonical-best agreement = {pooled['D2_Q1_vs_D3_Q1']['canonicalBestAgreement']:.6f}
D2_Q2 vs D2_Q1 canonical-best agreement = {pooled['D2_Q2_vs_D2_Q1']['canonicalBestAgreement']:.6f}
B1024 vs D3 canonical-best agreement = {pooled['B1024_Q1_MAXD3_vs_D3_Q1']['canonicalBestAgreement']:.6f}
```

NamuaではMtajiより低いagreementが多く観測されたが、formal gate failure後のsecondary resultであり、human difficultyやtrue move qualityのclaimには使用しない。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`results/STAGE_2_VERIFICATION.json`](results/STAGE_2_VERIFICATION.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
"""

    report = f"""# Search Reliability / Decision Robustness Study 1 — Final Report

## 1. Study identity

```text
Agenda label = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Formal decision = INCONCLUSIVE
```

Japanese working title:

**Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証**

## 2. Scientific question and boundary

同一RAW stateに対するsearch-derived decisionが、depth / node budget / quiescenceのprospectively frozen perturbationに対してどの程度stableかを、fresh historically reachable statesで定量化することを目的とした。

本StudyはPosition Complexity / Difficulty Study 1のhuman difficulty constructを救済しない。engine evaluation correctness、game-theoretic true best move、empirical win probability、人間の知覚、public AI strengthもendpointではない。higher-resource searchはtruthではなくfrozen referenceに限定した。

## 3. Authoritative identity and search contract

Formal RAW identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`、reflection、seat swap、symmetry canonicalizationはidentityに使用していない。

Frozen scientific grid:

```text
D1_Q1
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B64_Q1_MAXD3
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

Node-budget conditionsはiterative deepeningで**全root candidatesを完了した最後のdepthだけ**を採用し、partial root iterationを破棄した。PVは`canonical-exact-nominal-pv/quiescence-score-only/v1`としてdeterministic postprocessingした。

## 4. Stage 0 technical validation

Stage 0 `SRDR-S0-TECHNICAL-2026-08-27-v1`はtechnical PASS。既存Position Complexity exact diagnosticとのroot-score / TopSet agreement、node-budget semantics、quiescence、move-ordering control、RAW identity、PV reconstruction、independent verificationを通過した。

Technical-only resource auditではD3 cumulative node cost distributionを測定し、Stage 1 gridをoutcome前に有限freezeした。technical fixturesはscientific evidenceから永久除外した。

## 5. Stage 1 development

Stage 1 `SRDR-S1-DEVELOPMENT-2026-08-27-v1`は1,280 fresh games、seeds `25011001..25012280`。

```text
games generated / verified = 1280 / 1280
unique historical trajectories = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
```

Initial verificationでは全1018 scientific rowsが一致した一方、production in-memory hashがJSON persistenceで脱落する`undefined` keysを含んだためaggregate measurement hashだけが不一致となった。scientific rowsを変更せず、original failed verificationを保持したrepresentation-only correctionを別workflowで実行し、canonical JSON artifact hashとlegacy production hashを双方再現した。

Stage 1 readinessは全PASSし、decisionは:

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

このdevelopment result自体はformal confirmation claimをauthorizedしない。

## 6. Stage 2 prospective freeze

Stage 1 profileを消費後、Stage 2 formal ruleをoutcome前にfreezeした。

```text
games = 1536
seeds = 25021001..25022536
firewall = Stage 1 trajectory + opening-prefix + selected RAW state
search grid = unchanged from Stage 1
source-freeze commit = {SOURCE_FREEZE_COMMIT}
authorization commit = {AUTHORIZATION_COMMIT}
```

Formal primary criterionは、全estimability / identity / reproducibility gatesがPASSした場合にのみ3条件を評価するconjunctionとして固定した。gate failure時はprimaryを評価せず`INCONCLUSIVE`とするruleを事前固定した。

## 7. Stage 2 execution and independent verification

Formal workflow run `{RUN_ID}`はSUCCESS。

```text
generated games = 1536
Stage 1 trajectory/opening firewall後 trajectories = 1132
unique historical trajectories after firewall = 1040
selected unique RAW states = 1007
Namua = 518
Mtaji = 489
post-firewall overlap = trajectory 0 / opening prefix 0 / RAW state 0
```

Independent verifierはproduction Stage 1 common/search moduleおよびStage 2 runnerをimportせず、1536 gamesと1007 selected-state measurementsを再構築した。

```text
games verified = 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash = a929e00fcedfcd9e6f89780d5ca02f9a5f126250e569bd3840d4d79cfa2d6f46
measurement hash = 13ca8825c250f038c510a2a7e7c0e8d1567f0d5027bd32ecb4dee0e34f64e2bd
selection hash match = true
measurement hash match = true
```

## 8. Formal gate result

唯一のfailed preregistered gate:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

他のpopulation、phase、opening-prefix、identity-overlap、measurement completion、node-budget estimability、independent verification、hash-match gatesはPASSした。

10 trajectories不足はnear missだが、prospective contractに例外はない。追加seed、追加game、replacement、threshold 1050→1040変更、favorable subgroup、post-outcome population reconstructionは実施していない。

## 9. Formal decision

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

これは3 primary criteriaが`NOT-CONFIRMED`だったことを意味しない。formal gate conjunctionが成立しなかったためprimary branchへ入っていない。

## 10. Descriptive secondary profile

Formal decisionに使用しないpre-specified secondary profileでは、pooled canonical-best agreementは次だった。

```text
D1_Q1 vs D2_Q1 = {pooled['D1_Q1_vs_D2_Q1']['canonicalBestAgreement']:.6f}
D2_Q1 vs D3_Q1 = {pooled['D2_Q1_vs_D3_Q1']['canonicalBestAgreement']:.6f}
D2_Q0 vs D2_Q1 = {pooled['D2_Q0_vs_D2_Q1']['canonicalBestAgreement']:.6f}
D2_Q2 vs D2_Q1 = {pooled['D2_Q2_vs_D2_Q1']['canonicalBestAgreement']:.6f}
B64 vs D3 = {pooled['B64_Q1_MAXD3_vs_D3_Q1']['canonicalBestAgreement']:.6f}
B256 vs D3 = {pooled['B256_Q1_MAXD3_vs_D3_Q1']['canonicalBestAgreement']:.6f}
B1024 vs D3 = {pooled['B1024_Q1_MAXD3_vs_D3_Q1']['canonicalBestAgreement']:.6f}
```

Namua B1024→D3 agreementは0.889961、Mtajiは0.995910だった。これらはbounded machine-search descriptorsであり、true optimality、human difficulty、engine correctnessへ昇格させない。

## 11. Provenance

```text
Stage 2 artifact ID = {ARTIFACT_ID}
Stage 2 artifact ZIP SHA-256 = {ARTIFACT_ZIP_SHA256}
formal result file SHA-256 = {EXPECTED['stage2-formal-result.json']}
verification file SHA-256 = {EXPECTED['stage2-verification.json']}
generation manifest SHA-256 = {EXPECTED['stage2-generation-manifest.json']}
selected states artifact SHA-256 = {EXPECTED['stage2-selected-states.json']}
measurements artifact SHA-256 = {EXPECTED['stage2-measurements.json']}
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

Large per-game / selected-state / measurement artifacts remain in the immutable GitHub Actions artifact. Repository-facing canonical small artifacts preserve the formal result, verification, generation manifest and compact selection/measurement summary.

## 12. Immutable closure boundary

- 同じStage 2 populationへseed extensionを行わない。
- 1050 trajectory gateを結果後に緩和しない。
- Stage 2 rowsをreplacement / favorable subgroupで差し替えない。
- null primary criterionをsecondary profileで救済しない。
- `D3`や`B1024`をgame-theoretic truthとして扱わない。
- public AI engineering outcomeで本decisionを変更しない。

再検証する場合はnew Study IDまたは明示的versioned prospective protocol、fresh evidence、outcome前のnew estimability designが必要である。
"""

    status = f"""# SRDR-STUDY1 — Current Status

更新日: 2026-08-28

## Status

**STUDY COMPLETE / STAGE 0 PASS / STAGE 1 PROFILE-FROZEN-DEVELOPMENT / STAGE 2 COMPLETE / FORMAL DECISION `INCONCLUSIVE` / REPOSITORY CLOSURE READY**

## Identity

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Research branch = research/g2-02-search-reliability-decision-robustness
PR = #68
```

## Stage decisions

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1 = PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1 = PROFILE-FROZEN-DEVELOPMENT
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1 = COMPLETE / INCONCLUSIVE
Study formal decision = INCONCLUSIVE
```

## Stage 2 reason

Independent verification passed with zero replay / selection / measurement mismatches and exact selection/measurement hash equality. The sole failed preregistered gate was:

```text
unique historical trajectories after Stage 1 firewall = 1040
required = 1050
shortfall = 10
```

Therefore `primaryFormalCriterion = null`. No seed extension, replacement or threshold relaxation is authorized.

## Canonical provenance

```text
workflow run = {RUN_ID}
artifact ID = {ARTIFACT_ID}
artifact ZIP SHA-256 = {ARTIFACT_ZIP_SHA256}
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

## Immutable boundaries

`PEOCR-STUDY1 = INCONCLUSIVE` and Position Complexity / Difficulty Study 1 remain unchanged. G2-02 does not establish game-theoretic best moves, human difficulty, engine correctness or public-AI strength. Higher-resource search remains a frozen reference only.

## Next

No further G2-02 scientific generation is authorized. Any re-test of formal search-reliability confirmation requires a new prospective Study/version and fresh evidence. Repository closure may now be integrated to `main` after final documentation/consistency checks.
"""

    repro = f"""# SRDR-STUDY1 — Reproducibility Index

更新日: 2026-08-28

## Study anchor

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Branch = research/g2-02-search-reliability-decision-robustness
Formal decision = INCONCLUSIVE
```

## Stage identities

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

## Canonical repository results

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_2_GENERATION_MANIFEST.json`
- `results/STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json`
- `results/STAGE_2_VERIFICATION.json`
- `results/STAGE_2_FORMAL_RESULT.json`

## Stage 1 provenance

```text
original workflow run = 33067208005
corrected verification workflow run = 33123555267
canonical artifact ID = 9667419537
canonical artifact ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Stage 1 verification correction changed no scientific row; it corrected representation-only hash semantics after all 1018 row comparisons matched.

## Stage 2 source / authorization

```text
source-freeze commit = {SOURCE_FREEZE_COMMIT}
authorization commit = {AUTHORIZATION_COMMIT}
formal spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
Node = 22.23.2
```

## Stage 2 execution

```text
workflow run = {RUN_ID}
artifact ID = {ARTIFACT_ID}
artifact ZIP SHA-256 = {ARTIFACT_ZIP_SHA256}
games = 1536
seeds = 25021001..25022536
selected unique RAW states = 1007
Namua / Mtaji = 518 / 489
```

## Stage 2 file hashes

```text
generation manifest = {EXPECTED['stage2-generation-manifest.json']}
selected states = {EXPECTED['stage2-selected-states.json']}
measurements = {EXPECTED['stage2-measurements.json']}
verification = {EXPECTED['stage2-verification.json']}
formal result file = {EXPECTED['stage2-formal-result.json']}
selection hash = a929e00fcedfcd9e6f89780d5ca02f9a5f126250e569bd3840d4d79cfa2d6f46
measurement hash = 13ca8825c250f038c510a2a7e7c0e8d1567f0d5027bd32ecb4dee0e34f64e2bd
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

## Independent verification

```text
passed = true
games verified = 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash matches = true
measurement hash matches = true
Stage 1 overlap = 0 / 0 / 0
```

## Formal result

Only one preregistered gate failed:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

Therefore:

```text
formalDecision = INCONCLUSIVE
primaryFormalCriterion = null
```

No post-outcome rescue is authorized.
"""

    readme = """# Search Reliability / Decision Robustness Study 1

`G2-02` / `SRDR-STUDY1` is a completed Research Generation 2 prospective independent Study.

Formal decision:

```text
INCONCLUSIVE
```

The Stage 2 search measurements and independent verification succeeded, but one preregistered estimability gate failed by 10 unique trajectories (`1040 < 1050`). The primary formal criterion was therefore not evaluated (`null`) and the result is not `NOT-CONFIRMED`.

## Reading order

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
6. [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## Boundary

Higher-resource search is a frozen comparison reference, not game-theoretic truth. This Study does not validate human difficulty, engine correctness, optimal play, empirical win probability or public AI strength. The `INCONCLUSIVE` result cannot be rescued by extending the same Stage 2 seed block or relaxing the failed gate.
"""

    write(STUDY / "README.md", readme)
    write(STUDY / "STUDY_1_OVERVIEW.md", overview)
    write(STUDY / "STUDY_1_FINAL_REPORT.md", report)
    write(STUDY / "CURRENT_STATUS.md", status)
    write(STUDY / "REPRODUCIBILITY_INDEX.md", repro)


def update_registers() -> None:
    append_once(STUDY / "DECISION_REGISTER.md", "## D-016 — Stage 1 development closure", """
## D-016 — Stage 1 development closure

Stage 1 completed with `PROFILE-FROZEN-DEVELOPMENT`. The representation-only verification hash correction changed no scientific measurement row and did not authorize formal inference from Stage 1.

## D-017 — Stage 2 formal rule and authorization

Stage 2 was prospectively frozen at 1,536 games / seeds `25021001..25022536`, with Stage 1 trajectory + opening-prefix + RAW-state firewall, unchanged search grid, fixed formal gates and a three-criterion primary conjunction evaluated only after all gates pass. Source-freeze commit: `e176cafc15d2dde7b8767de6961959bb7ee9bb7b`; authorization commit: `bec87d54540c96c24353f2eeadc25338c53e54eb`.

## D-018 — Formal Stage 2 decision

The independent verifier passed with zero game/selection/measurement mismatches and exact hash matches. One preregistered estimability gate failed: `1040 < 1050` unique historical trajectories after the Stage 1 firewall. Under the frozen taxonomy:

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

The 10-trajectory shortfall receives no near-miss exception.

## D-019 — No-rescue closure

No Stage 2 seed extension, replacement, threshold relaxation, alternate primary, favorable subgroup, or reinterpretation of secondary metrics is authorized. Any future formal re-test requires a new prospective Study/version and fresh evidence. Public AI engineering cannot modify this decision.
""")

    append_once(STUDY / "RESEARCH_LOG.md", "## 2026-08-28 — Stage 2 formal closure", f"""
## 2026-08-28 — Stage 1 verification correction

- Recovered the original Stage 1 artifact without consuming new scientific seeds.
- Confirmed 1280/1280 replay, 1018/1018 selected-state measurements and zero row mismatches.
- Isolated the aggregate hash discrepancy to pre-serialization `undefined` keys omitted by JSON persistence.
- Ran representation-only correction; no scientific row, grid, seed or criterion changed.
- Stage 1 decision fixed as `PROFILE-FROZEN-DEVELOPMENT`.

## 2026-08-28 — Stage 2 formal closure

- Source-freeze commit: `{SOURCE_FREEZE_COMMIT}`.
- Explicit authorization commit: `{AUTHORIZATION_COMMIT}`.
- Formal workflow run `{RUN_ID}` completed successfully.
- 1536/1536 games generated and independently replayed.
- 1007 selected RAW states independently remeasured; selection/measurement mismatches 0; hashes exact-match.
- Stage 1 cross-stage overlap: trajectory/opening-prefix/RAW state = `0 / 0 / 0`.
- One frozen estimability gate failed: `1040 < 1050` unique historical trajectories after firewall.
- Formal decision fixed as `INCONCLUSIVE`; `primaryFormalCriterion = null`.
- No rescue, extension, replacement or threshold relaxation performed.
""")

    decision = ROOT / "doc/research-program-decisions/2026-08-27-g2-02-study-start.md"
    if decision.exists():
        append_once(decision, "## Closure — 2026-08-28", f"""
## Closure — 2026-08-28

`G2-02` was instantiated as `SRDR-STUDY1` and completed under its prospective three-stage contract. Stage 2 run `{RUN_ID}` passed independent replay / measurement verification, but the preregistered unique-trajectory estimability gate observed `1040 < 1050`. The Study-level formal decision is therefore `INCONCLUSIVE`; the primary formal criterion was not evaluated. No post-outcome rescue is authorized.
""")


def update_root_docs() -> None:
    root_readme = ROOT / "README.md"
    text = root_readme.read_text(encoding="utf-8")
    bullet = "- [`doc/search-reliability-decision-robustness/STUDY_1_OVERVIEW.md`](doc/search-reliability-decision-robustness/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-02` / `SRDR-STUDY1`。Stage 2は1536/1536 gamesと独立verificationを完了したが、unique trajectories after firewallが`1040 < 1050`でpreregistered estimability gateを1件未達とし、formal decisionは`INCONCLUSIVE`。primary formal criterionは未評価 (`null`)"
    if "search-reliability-decision-robustness/STUDY_1_OVERVIEW.md" not in text:
        anchor = "- [`doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`](doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-01` / `PEOCR-STUDY1`。8,192-game held-out replicationは独立verificationを完了したが、strict firewall後の3 estimability gate未達によりformal decision `INCONCLUSIVE`"
        if anchor not in text:
            raise RuntimeError("README G2-01 anchor not found")
        text = text.replace(anchor, anchor + "\n" + bullet, 1)
    write(root_readme, text)

    index = ROOT / "doc/RESEARCH_INDEX.md"
    text = index.read_text(encoding="utf-8")
    if "### 18. Search Reliability / Decision Robustness — Study 1" not in text:
        section = """
### 18. Search Reliability / Decision Robustness — Study 1

**研究題目:** Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証  
**Program:** `G2-02` / **Study ID:** `SRDR-STUDY1` / **Research Generation 2**  
**状態:** **Study complete / formal decision `INCONCLUSIVE`**

同一RAW stateに対するmachine search decisionの安定性を、depth / node budget / quiescenceのprospectively frozen gridで検証した。Stage 1は1,280 fresh gamesから1,018 statesを測定して`PROFILE-FROZEN-DEVELOPMENT`となった。Stage 2は1,536 fresh held-out games、1,007 selected statesを用い、独立verifierが全game replay・selection・measurementをzero mismatchで再構築した。

しかし、strict Stage 1 firewall後のunique historical trajectoriesが`1040 < 1050`となり、唯一のpreregistered estimability gate failureとなった。このためprimary formal criterionは評価されず`null`、formal decisionは`INCONCLUSIVE`である。10 trajectory不足への追加seed・replacement・gate relaxationは行っていない。

Descriptive secondary profileではD2→D3 canonical-best agreement `0.734856`、Q2→Q1 `0.748759`、B1024→D3 `0.941410`が観測されたが、higher-resource searchはtruthではなく、これらをformal confirmation、human difficulty、engine correctnessへ昇格させない。

**最初に読む:**

- [`search-reliability-decision-robustness/STUDY_1_OVERVIEW.md`](search-reliability-decision-robustness/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`search-reliability-decision-robustness/STUDY_1_FINAL_REPORT.md`](search-reliability-decision-robustness/STUDY_1_FINAL_REPORT.md)
- [`search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json`](search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json)
- [`search-reliability-decision-robustness/results/STAGE_2_VERIFICATION.json`](search-reliability-decision-robustness/results/STAGE_2_VERIFICATION.json)
- [`search-reliability-decision-robustness/REPRODUCIBILITY_INDEX.md`](search-reliability-decision-robustness/REPRODUCIBILITY_INDEX.md)
- [`search-reliability-decision-robustness/CURRENT_STATUS.md`](search-reliability-decision-robustness/CURRENT_STATUS.md)
- [`search-reliability-decision-robustness/DECISION_REGISTER.md`](search-reliability-decision-robustness/DECISION_REGISTER.md)

**Boundary:** 同じStage 2 evidenceを追加seed、threshold relaxation、alternate primary、favorable subgroupで救済しない。`D3`/`B1024`をgame-theoretic truthとみなさない。formal再検証はnew prospective Study/versionとfresh evidenceを必要とする。

---

"""
        marker = "\n## 将来研究\n"
        if marker not in text:
            raise RuntimeError("RESEARCH_INDEX future marker not found")
        text = text.replace(marker, "\n" + section + "## 将来研究\n", 1)
    write(index, text)

    agenda = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
    text = agenda.read_text(encoding="utf-8")
    text = re.sub(r"更新日: 2026-08-27", "更新日: 2026-08-28", text, count=1)
    new_g202 = """#### G2-02 — Search Reliability / Decision Robustness Study 1

**状態:** **完了 / `SRDR-STUDY1` / formal decision `INCONCLUSIVE`**

中心課題:

> 同一raw stateに対するbest move、TopSet、move ranking、score gap、principal variationは、depth、node budget、quiescence等のprospectively frozen探索条件を変えたときどの程度安定するか。

Stage 0 technical validationを経て、Stage 1は1,280 fresh games / 1,018 selected RAW statesで全readiness gateをPASSし、`PROFILE-FROZEN-DEVELOPMENT`を固定した。Stage 2は1,536 fresh held-out games / seeds `25021001..25022536`、Stage 1 trajectory + opening-prefix + RAW-state firewall、同一8-condition search gridで実行した。

```text
Stage 2 games = 1536 / 1536
independent game replay mismatches = 0
selected RAW states = 1007
Namua / Mtaji = 518 / 489
selection mismatches = 0
measurement mismatches = 0
selection / measurement hashes = exact match
Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0
unique trajectories after firewall = 1040 < 1050
formal decision = INCONCLUSIVE
primary formal criterion = null
```

唯一のfailed gateはunique trajectoriesのpreregistered minimumだった。10 trajectory不足でもseed extension、replacement、gate relaxation、near-miss exceptionを行わない。D3/B1024等のhigher-resource conditionはtruthではなくfrozen search referenceである。

Descriptive secondary profileは今後のnew hypothesis / resource planning inputには利用できるが、G2-02のformal confirmationやhuman difficulty、engine correctness、public AI strengthへ読み替えない。

**Priority:** P0 / completed

"""
    pattern = r"#### G2-02 — Search Reliability / Decision Robustness Study 1\n.*?(?=\n#### G2-03 —)"
    text2, n = re.subn(pattern, new_g202.rstrip(), text, flags=re.S)
    if n != 1:
        raise RuntimeError(f"FUTURE_RESEARCH_AGENDA G2-02 section replacement count={n}")
    text = text2
    old = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`としてprospective stop ruleに従い完了した。次の未着手P0候補としては`G2-02` Search Reliability / Decision Robustnessを優先できるが、正式Study IDやprotocolは研究開始時にoutcome前freezeする。"
    new = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop ruleに従い完了した。G2-02はformal search measurementsとindependent verification自体は完了したが、1040/1050 unique-trajectory estimability gateによりprimary formal criterionを評価していない。次の未着手P0候補はdependencyを確認したうえで`G2-03` State Transformation Semantics / Canonicalization Validation、`G2-04`、`G2-05`、`G2-06`から選択する。"
    if old in text:
        text = text.replace(old, new, 1)
    elif new not in text:
        raise RuntimeError("FUTURE_RESEARCH_AGENDA dependency status anchor not found")
    write(agenda, text)


def validate_repo() -> None:
    formal = json.loads((RESULTS / "STAGE_2_FORMAL_RESULT.json").read_text(encoding="utf-8"))
    verification = json.loads((RESULTS / "STAGE_2_VERIFICATION.json").read_text(encoding="utf-8"))
    assert formal["formalDecision"] == "INCONCLUSIVE"
    assert formal["primaryFormalCriterion"] is None
    assert verification["passed"] is True

    required = {
        ROOT / "README.md": ["G2-02", "SRDR-STUDY1", "1040 < 1050", "INCONCLUSIVE"],
        ROOT / "doc/RESEARCH_INDEX.md": ["### 18. Search Reliability / Decision Robustness — Study 1", "formal decision `INCONCLUSIVE`", "1040 < 1050"],
        ROOT / "doc/FUTURE_RESEARCH_AGENDA.md": ["G2-02 — Search Reliability / Decision Robustness Study 1", "`SRDR-STUDY1`", "formal decision `INCONCLUSIVE`", "primary formal criterion = null"],
        STUDY / "STUDY_1_OVERVIEW.md": ["INCONCLUSIVE", "primaryFormalCriterion = null"],
        STUDY / "STUDY_1_FINAL_REPORT.md": ["1040 < 1050", "No-rescue", "INCONCLUSIVE"],
        STUDY / "CURRENT_STATUS.md": ["STUDY COMPLETE", "INCONCLUSIVE"],
        STUDY / "REPRODUCIBILITY_INDEX.md": [str(RUN_ID), ARTIFACT_ZIP_SHA256],
    }
    for path, tokens in required.items():
        text = path.read_text(encoding="utf-8")
        for token in tokens:
            if token not in text:
                raise RuntimeError(f"{path}: missing required token {token!r}")

    agenda = (ROOT / "doc/FUTURE_RESEARCH_AGENDA.md").read_text(encoding="utf-8")
    g2 = re.search(r"#### G2-02 — Search Reliability / Decision Robustness Study 1\n.*?(?=\n#### G2-03 —)", agenda, re.S)
    assert g2
    assert "planned / new construct" not in g2.group(0)
    assert "完了" in g2.group(0)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--artifact", required=True, type=Path)
    args = p.parse_args()
    _, _, formal = materialize(args.artifact)
    write_study_docs(formal)
    update_registers()
    update_root_docs()
    validate_repo()
    print(json.dumps({
        "passed": True,
        "studyId": "SRDR-STUDY1",
        "formalDecision": "INCONCLUSIVE",
        "primaryFormalCriterion": None,
        "failedGate": "uniqueHistoricalTrajectoriesAfterStage1Firewall",
        "observed": 1040,
        "threshold": 1050,
        "workflowRun": RUN_ID,
        "artifactId": ARTIFACT_ID,
        "artifactZipSha256": ARTIFACT_ZIP_SHA256,
        "canonicalResultHash": formal["canonicalResultHash"],
    }, indent=2))


if __name__ == "__main__":
    main()
