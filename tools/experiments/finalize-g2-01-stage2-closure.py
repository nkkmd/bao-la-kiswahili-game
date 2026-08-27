#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / "doc/position-evaluation-empirical-outcome-calibration-replication"
RESULTS = STUDY / "results"

EXPECTED = {
    "generation-manifest.json": "1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411",
    "stage2-selection-measurement-summary.json": "3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45",
    "verification.json": "48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da",
    "stage2-formal-result.json": "42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c",
}
CANONICAL = {
    "generation-manifest.json": "STAGE_2_GENERATION_MANIFEST.json",
    "stage2-selection-measurement-summary.json": "STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json",
    "verification.json": "STAGE_2_VERIFICATION.json",
    "stage2-formal-result.json": "STAGE_2_FORMAL_RESULT.json",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def append_once(path: Path, marker: str, addition: str) -> None:
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        path.write_text(text.rstrip() + "\n\n" + addition.strip() + "\n", encoding="utf-8")


def materialize(artifact: Path) -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    for source_name, digest in EXPECTED.items():
        data = (artifact / source_name).read_bytes()
        got = sha256(data)
        if got != digest:
            raise RuntimeError(f"{source_name} SHA mismatch: {got} != {digest}")
        (RESULTS / CANONICAL[source_name]).write_bytes(data)

    manifest = json.loads((artifact / "generation-manifest.json").read_text())
    summary = json.loads((artifact / "stage2-selection-measurement-summary.json").read_text())
    verification = json.loads((artifact / "verification.json").read_text())
    formal = json.loads((artifact / "stage2-formal-result.json").read_text())

    assert manifest["games"] == 8192
    assert manifest["seedStart"] == 24020001 and manifest["seedEnd"] == 24028192
    assert summary["generatedGames"] == 8192
    assert summary["uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall"] == 3898
    assert summary["selectedUniqueRawStates"] == 3570
    assert summary["phaseCounts"] == {"namua": 1823, "mtaji": 1747}
    assert summary["crossStageOverlap"] == {
        "historicalTrajectoryHash": 0,
        "openingPrefixHash": 0,
        "rawStateKey": 0,
    }
    assert verification["passed"] is True
    assert verification["measurementMismatches"] == 0
    assert verification["measurementHashMatches"] is True
    assert verification["selectionHashMatches"] is True
    assert formal["formalDecision"] == "INCONCLUSIVE"
    assert formal["primary"] is None
    assert formal["estimabilityAndIdentityGates"]["passed"] is False
    checks = formal["estimabilityAndIdentityGates"]["checks"]
    failed = [key for key, value in checks.items() if not value["passed"]]
    assert failed == [
        "uniqueHistoricalTrajectoriesAfterStage1Firewall",
        "selectedUniqueRawStates",
        "mtajiSelectedStates",
    ]


def write_study_docs() -> None:
    overview = """# Position Evaluation / Empirical Outcome Calibration Replication Study 1 — Overview

Program label: `G2-01`  
Study ID: `PEOCR-STUDY1`  
Research Generation: **Research Generation 2**  
Status: **COMPLETE / formal decision `INCONCLUSIVE`**

## 何を調べたか

Research Generation 1のPosition Evaluation / Win-Rate Calibration Study 1 (`PEC-STUDY1`) は、strict identity firewall後のformal populationが事前estimability gateへ届かず`INCONCLUSIVE`で閉じた。本Studyはそのdecisionを変更・救済せず、新しいfresh populationとStudy IDを用いて、actor-relative static Bao evaluationとempirical continuation outcomeのheld-out calibrationを再検証した。

研究とAI engineeringは分離し、public Bao AIの棋力、deployment、AI generation promotionはscientific endpointにしていない。

## 設計

```text
Stage 0 = technical validation
Stage 1 = 2,048 fresh development games
Stage 2 = 8,192 fresh held-out formal games
state identity = RAW pits,reserve,houseOwned,player,phase,winner,pending
Stage 1 -> Stage 2 firewall = trajectory + opening prefix + RAW state
mapping = phase-stratified isotonic PAVA
formal clipping = [0.01, 0.99]
Stage 2 refit = forbidden
```

Stage 1は全readiness gateを通過し、`MODEL-FROZEN-DEVELOPMENT`としてPAVA mappingをfreezeした。

## Stage 2の結果

8,192/8,192局を固定8 shardで生成し、全shardを独立replayした。統合後のselection/measurementも独立verificationをPASSし、Stage 1とのcross-stage overlapはtrajectory / opening-prefix / RAW-stateすべて0だった。

しかし、事前固定したestimability gateのうち3項目が未達だった。

| Gate | observed | required | result |
| --- | ---: | ---: | --- |
| unique historical trajectories after Stage 1 firewall | 3,898 | >= 4,500 | FAIL |
| selected unique RAW states | 3,570 | >= 4,000 | FAIL |
| Namua selected states | 1,823 | >= 1,750 | PASS |
| Mtaji selected states | 1,747 | >= 1,750 | FAIL |

Mtajiは3 state不足だったが、追加seed、replacement、gate relaxationは事前に禁止されているため実施していない。

## Formal decision

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

これはcalibration modelが`NOT-CONFIRMED`だったことを意味しない。estimability gateが全PASSしなかったため、co-primary Brier skill / log-loss skillとBrier maximaによるformal success criteriaには入っておらず、canonical resultでは`primary = null`である。

## 解釈境界

本結果からgame-theoretic winning probability、人間の形勢認知、因果効果、public AI品質、別population/search policyへの一般化は主張しない。

同じStage 2 dataへの追加game、seed extension、identity-overlap replacement、gate relaxation、mapping refit、favorable subgroupによるformal救済は行わない。再検証する場合は新しいprospective Study / versioned protocolとfresh evidenceを必要とする。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
"""

    report = """# Position Evaluation / Empirical Outcome Calibration Replication Study 1 — Final Report

## 1. Study identity

```text
Agenda label = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Formal title = Position Evaluation / Empirical Outcome Calibration Replication Study 1
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Formal decision = INCONCLUSIVE
```

## 2. Scientific question

actor-relative static Bao evaluationと、固定continuation policyの下で得られるfresh empirical continuation outcomeとの対応を、Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更せず、strict identity firewallを持つ新しいheld-out replicationとしてformalに評価できるかを検証した。

engine evaluation、empirical continuation outcome、game-theoretic value、search reliability、human perception、public AI qualityは別constructとして保持した。

## 3. Prospective contract

Authoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`。`turn/reason`、symmetry、reflection、seat swap、canonicalizationはformal deduplicationに使用していない。

Frozen continuation/evaluationはhard / bao / phase2 / D2 / Infinity、quiescence depth 1、`orderQuiescenceCaptures=false`、`adaptive=false`、`stableBestDepths=0`、`aspirationWindow=0`、`maxPly=160`、primary score=`AI.evaluate(state,state.player)`。

Stage 1 development familyはoutcome前に`phase-stratified-isotonic-PAVA`へ固定し、candidate-family selectionを行わなかった。Stage 2 prediction clipping `[0.01,0.99]`も事前固定し、Stage 2 refitは禁止した。

## 4. Stage 0

Stage 0 technical validationは`STAGE0-TECHNICAL-PASS`。scientific inference / confirmatory reuseはauthorizedされなかった。

## 5. Stage 1 development and model freeze

Stage 1は2,048 fresh games、seeds `24011001..24013048`。最初のauthorized executionはActions 120-minute ceilingで1536/2048にadministratively停止したが、partial artifactはscientific resultへ使用しなかった。scientific source hashesを変えずexecution ceilingだけを拡張し、同一populationを最初から再実行したrun `33017663172`が成功した。

```text
games = 2048
unique historical trajectories = 1602
selected unique RAW states = 1547
Namua = 806
Mtaji = 741
administrative truncation rate = 0
independent replay mismatches = 0
measurement mismatches = 0
```

全readiness gateがPASSし、Stage 1 decisionは`MODEL-FROZEN-DEVELOPMENT`。

```text
frozen mapping SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
reference universe SHA-256 = 5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063
```

Reference universeは1602 unique trajectories、1604 opening prefixes、76010 RAW states、113642 observations。

## 6. Stage 2 technical gate and authorization

Technical smoke run `33037897038`はproduction / independent verificationともPASSし、Stage 2 scientific seedを使用しなかった。

Source-bound formal authorization commit:

```text
5d1b4a40ef95ac639787aa0abf040a455c3c2995
```

Formal populationは8192 games、seeds `24020001..24028192`。executionだけを8 contiguous shards ×1024へ固定し、seed extension / replacement / outcome-dependent extension / Stage 2 refitは禁止した。

## 7. Stage 2 execution and verification

Formal workflow run `33038132423`はSUCCESS。全8 shardがsource audit、1024-game generation、全件independent replay、artifact uploadをPASSした。全shardが揃った後にだけexact 8192-game populationを統合し、outcome-blind firewall / selection / measurementを実行した。

```text
generated games = 8192
unique trajectories before Stage 1 firewall = 4714
Stage 1 trajectory overlap excluded = 816
Stage 1 opening-prefix overlap excluded = 0
unique trajectories after trajectory/opening firewall = 3898
Stage 1 RAW observations excluded = 4765
unavailable assigned phase = 318
provisional selected states = 3580
duplicate selected RAW states collapsed = 10
selected unique RAW states = 3570
Namua = 1823
Mtaji = 1747
distinct opening prefixes = 3570
administrative truncation rate = 0
```

Outcomes: Namua wins/losses 903/920、Mtaji 938/809。

Independent integrated verification:

```text
passed = true
measurement mismatches = 0
selection hash match = true
measurement hash match = true
Stage 1 trajectory overlap = 0
Stage 1 opening-prefix overlap = 0
Stage 1 RAW-state overlap = 0
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

## 8. Estimability result

Three prospectively frozen gates failed:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 3898 < 4500
selectedUniqueRawStates = 3570 < 4000
mtajiSelectedStates = 1747 < 1750
```

All identity-overlap, independent-verification, outcome-count, distinct-evaluation, opening-prefix, Namua state-count, and administrative-truncation gates passed。

Mtajiはthresholdまで3 stateだったが、pre-specified ruleにnear-miss exceptionはない。追加seed、replacement、threshold change、favorable subgroup rescueは実施していない。

## 9. Formal decision

Frozen rule:

```text
all estimability/identity gates PASS + all primary criteria PASS -> CONFIRMED
all estimability/identity gates PASS + criterion failure -> NOT-CONFIRMED
any estimability/identity gate failure -> INCONCLUSIVE
```

Therefore:

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

Estimability conjunctionがFAILしたためco-primary Brier-skill / log-loss-skill formal branchとBrier maxima criteriaには入らず、canonical resultは`"primary": null`を保持する。したがって本Studyを`NOT-CONFIRMED`と報告してはならず、frozen PAVAをformally validated Bao win probabilityとも報告しない。

## 10. Required diagnostics

Diagnosticsはrequired secondary diagnosticsとして計算したがformal decisionをoverrideしない。

```text
Namua: n=1823, bias=-0.0106267429, ECE=0.0376802844,
       calibration slope=0.8232591596,
       slope bootstrap95=[0.6533723064,0.9948506094],
       raw-score AUC=0.6711703741

Mtaji: n=1747, bias=-0.0052727836, ECE=0.0274862636,
       calibration slope=1.0895006226,
       slope bootstrap95=[0.9940119515,1.2040293401],
       raw-score AUC=0.9722287380
```

## 11. Canonical evidence

```text
workflow run = 33038132423
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
STAGE_2_GENERATION_MANIFEST.json = 1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411
STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json = 3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45
STAGE_2_VERIFICATION.json = 48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da
STAGE_2_FORMAL_RESULT.json = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
```

## 12. Interpretation and no-rescue boundary

Formal claim scopeはfrozen evaluator / population / continuation policy / state-selection rule / Stage 1 mapping下のheld-out empirical continuation-outcome calibrationのみ。

Game-theoretic value、人間の認知、causal claim、frozen population/policy外へのgeneralization、Research Generation 1 decision revision、public AI quality / AI-generation promotionはauthorizeしない。

`PEOCR-STUDY1`内ではadditional Stage 2 games、seed extension、overlap/missing-phase/duplicate-state replacement、4500/4000/1750 gate lowering、Mtaji 1747/1750のnear-miss pass扱い、Stage 1 mapping refit/replacement、favorable subgroup、alternate primary relabelingを行わない。

## 13. Final conclusion

`G2-01 / PEOCR-STUDY1`はscientifically complete。technically cleanなcomplete generationとindependent identity verificationを達成したが、strict post-firewall estimabilityが3つのpre-specified gatesで不足した。正しいformal conclusionは`INCONCLUSIVE`である。

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`は不変で、engineering outcomeもこのscientific decisionの外部に留まる。
"""

    readme = """# Position Evaluation / Empirical Outcome Calibration Replication Study 1

Program label: `G2-01`  
Study ID: `PEOCR-STUDY1`  
Status: **COMPLETE / formal decision `INCONCLUSIVE`**  
Research generation: **Research Generation 2**

## Result

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更・救済せず、新しいfresh populationでactor-relative static Bao evaluationとempirical continuation outcomeのheld-out calibration replicationを実施した。

Stage 1は2,048 fresh gamesで全readiness gateをPASSし、phase-stratified isotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定した。Stage 2は8,192/8,192 fresh gamesを生成し、全8 shardの独立replay、統合selection/measurementの独立verification、Stage 1 cross-stage overlap 0/0/0を達成した。

しかしstrict firewall後に3つのestimability gateが未達となった。

```text
unique trajectories after firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

Formal decision: `PEOCR-STUDY1 = INCONCLUSIVE`。Primary Brier/log-loss formal branchには入っておらず、`NOT-CONFIRMED`ではない。

## Start here

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
6. [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
7. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)

## Immutable boundaries

- Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable.
- RAW identity remains `pits,reserve,houseOwned,player,phase,winner,pending`.
- No symmetry/canonicalization was used for formal deduplication.
- No Stage 2 seed extension, replacement, gate relaxation, mapping refit, or subgroup rescue is authorized.
- Game-theoretic, human-perception, causal, public-AI-quality, and AI-generation claims are outside this Study.
"""

    status = """# PEOCR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY COMPLETE / FORMAL DECISION `INCONCLUSIVE` / SCIENTIFIC CLOSURE COMPLETE ON RESEARCH BRANCH**

## Identity

```text
Program = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Research branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
Formal source commit = 5d1b4a40ef95ac639787aa0abf040a455c3c2995
Formal workflow run = 33038132423
```

## Stage closure

```text
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = COMPLETE / MODEL-FROZEN-DEVELOPMENT
Stage 2 technical smoke = COMPLETE / PASS
Stage 2 formal generation = COMPLETE / 8192 games
Stage 2 independent verification = PASS
Stage 2 formal decision = INCONCLUSIVE
```

Failed prospectively frozen estimability gates:

```text
unique historical trajectories after Stage 1 firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

All 8 shard independent replays、integrated selection/measurement verification、Stage 1 overlap trajectory/opening/RAW = 0/0/0、outcome-count gates、administrative truncation 0、source/hash bindingはPASSした。

Because estimability gates did not all pass, the co-primary Brier/log-loss formal branch was not entered and canonical `primary` is `null`. `NOT-CONFIRMED` is not an authorized label.

## Canonical evidence

```text
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
formal result SHA-256 = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

## No-rescue boundary

No additional Stage 2 game, seed extension, overlap replacement, gate relaxation, mapping refit, near-miss exception, favorable subgroup, or alternate-primary relabeling is authorized within `PEOCR-STUDY1`.

Scientific closure is complete on the research branch. PR #67 remains the integration vehicle; merging to `main` is a repository integration step and does not alter the scientific decision.
"""

    checkpoint = """# G2-01 Stage 2 formal `INCONCLUSIVE` closure checkpoint

Date: 2026-08-27  
Study: `PEOCR-STUDY1`  
Stage: `PEOCR-S2-FORMAL-2026-08-26-v1`

```text
workflow run = 33038132423
source authorization commit = 5d1b4a40ef95ac639787aa0abf040a455c3c2995
games = 8192 / 8192
seeds = 24020001..24028192
execution = 8 fixed contiguous shards x 1024
all shard independent replay = PASS
merge/select/measure independent verification = PASS
Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

Failed exactly three frozen gates:

```text
3898 < 4500 unique historical trajectories after Stage 1 firewall
3570 < 4000 selected unique RAW states
1747 < 1750 Mtaji selected states
```

No near-miss exception exists. No extension, replacement, threshold relaxation, refit, subgroup rescue, or alternate primary was used.

```text
formalDecision = INCONCLUSIVE
primary = null
```

Artifact identity:

```text
formal artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
generation manifest SHA-256 = 1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411
selection/measurement summary SHA-256 = 3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45
verification SHA-256 = 48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da
formal result SHA-256 = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
```

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable. Public-AI engineering is outside the scientific decision.
"""

    (STUDY / "STUDY_1_OVERVIEW.md").write_text(overview, encoding="utf-8")
    (STUDY / "STUDY_1_FINAL_REPORT.md").write_text(report, encoding="utf-8")
    (STUDY / "README.md").write_text(readme, encoding="utf-8")
    (STUDY / "CURRENT_STATUS.md").write_text(status, encoding="utf-8")
    (STUDY / "checkpoints/2026-08-27-stage2-formal-inconclusive-closure.md").write_text(checkpoint, encoding="utf-8")

    append_once(STUDY / "DECISION_REGISTER.md", "## D-012 — Stage 2 formal authorization", """
## D-012 — Stage 2 formal authorization

Date: 2026-08-27

After production + independent technical smoke PASS, exact source/model/reference hashes were frozen and Stage 2 formal generation was explicitly authorized at commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`.

The authorized population was exactly 8,192 games, seeds `24020001..24028192`, partitioned for execution only into 8 contiguous 1,024-game shards. Seed extension, replacement, outcome-dependent extension, and Stage 2 refit remained forbidden.

## D-013 — Stage 2 formal decision and Study closure

Date: 2026-08-27

All 8,192 games and all shard-level independent replays completed. Integrated selection/measurement independent verification passed with zero Stage 1 overlap on historical trajectory, opening prefix, and RAW state identity.

Three frozen estimability gates failed: `3898 < 4500` trajectories after firewall, `3570 < 4000` selected RAW states, and `1747 < 1750` Mtaji selected states.

Therefore `PEOCR-STUDY1 = INCONCLUSIVE`. The co-primary Brier/log-loss formal branch was not entered (`primary = null`). No near-miss exception, extra seed, replacement, gate relaxation, refit, subgroup rescue, or alternate-primary relabeling is authorized. This closes `PEOCR-STUDY1` scientifically.
""")

    append_once(STUDY / "RESEARCH_LOG.md", "## 2026-08-27 — Stage 2 formal replication and closure", """
## 2026-08-27 — Stage 2 formal replication and closure

- source-bound formal authorization commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`
- formal workflow run `33038132423` completed successfully
- 8 fixed shards × 1024 = 8192/8192 scientific games generated
- all 8 shard independent replay verifications passed
- merged fixed population audit passed
- trajectories before firewall = 4714; Stage 1 trajectory overlap excluded = 816; opening overlap excluded = 0
- trajectories after trajectory/opening firewall = 3898
- Stage 1 RAW-state observations excluded = 4765
- selected unique RAW states = 3570 (Namua 1823; Mtaji 1747)
- independent selection/measurement verification passed; measurement mismatches = 0; final overlap = `0 / 0 / 0`
- failed estimability gates = trajectories 3898<4500; RAW states 3570<4000; Mtaji 1747<1750
- formal decision = `INCONCLUSIVE`; primary formal branch not entered; canonical `primary = null`
- no rescue/extension/replacement/refit/threshold relaxation performed
- Study scientific closure complete
""")

    append_once(STUDY / "REPRODUCIBILITY_INDEX.md", "## Stage 2 formal evidence and closure", """
## Stage 2 formal evidence and closure

- formal authorization commit: `5d1b4a40ef95ac639787aa0abf040a455c3c2995`
- formal workflow run: `33038132423`
- final formal artifact ID: `9636207301`
- final artifact ZIP SHA-256: `056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0`
- `results/STAGE_2_GENERATION_MANIFEST.json`: `1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411`
- `results/STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json`: `3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45`
- `results/STAGE_2_VERIFICATION.json`: `48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da`
- `results/STAGE_2_FORMAL_RESULT.json`: `42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c`
- selection hash: `eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea`
- measurement hash: `e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294`
- formal decision: `INCONCLUSIVE`

Fixed shard artifacts:

```text
shard 0: ID 9636140572 / ebcfdea36bfe44b170b4fe6c46854738fc18208c686a06fd31de950826a7d49c
shard 1: ID 9636038055 / cdcf43299defed7043396608d49ba59455c6aa5bc3f8dfcb0f26f06e13a07792
shard 2: ID 9635952267 / 1bc3a847017c3107a6a4d0be385ad79fc2e69e86902f54b307ae4db6a8c97737
shard 3: ID 9636024667 / 9a525b98de3a7c151d7bbc5e59732d84d74c7141b43096c7d070936651e2d5b4
shard 4: ID 9636070999 / 727b499b15867d544c1377a9edfa92316b7b35686fee4117ab8424ec16e78118
shard 5: ID 9636162351 / a8452c5c0c363e957cda949b2357c54d45fe607f9915f5c1edbdec167269085a
shard 6: ID 9636005623 / 4612ac3ab7b3ae5e157f7c46c0e1c9b573f62efcc33ca297ccf3e9a8b53241d3
shard 7: ID 9635949547 / 139219e0d8b483b0f68bc9ca169d07ed17719e21e4e5699e336e39d808a71d6b
```
""")


def update_central_docs() -> None:
    index_path = ROOT / "doc/RESEARCH_INDEX.md"
    index = index_path.read_text(encoding="utf-8")
    if "### 17. Position Evaluation / Empirical Outcome Calibration Replication — Study 1" not in index:
        section = """
### 17. Position Evaluation / Empirical Outcome Calibration Replication — Study 1

**研究題目:** Baoにおける形勢評価値と経験的継続結果の校正再検証 — strict identity firewall下でのfresh held-out replication  
**Program:** `G2-01` / **Study ID:** `PEOCR-STUDY1` / **Research Generation 2**  
**状態:** **Study complete / formal decision `INCONCLUSIVE`**  
**作業branch:** `research/g2-01-position-evaluation-empirical-outcome-calibration-replication`

第二世代最初のprospective independent studyとして、Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更・救済せず、fresh development + held-out formal populationでstatic Bao evaluationとempirical continuation outcomeのcalibration replicationを実施した。

Stage 1は2,048 fresh gamesで全readiness gateをPASSし、phase-stratified isotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定した。Stage 2は8,192/8,192 gamesと全8 shard independent replay、統合selection/measurement independent verification、Stage 1 overlap `0 / 0 / 0`を達成した。

一方strict firewall後のformal populationは、`3898 < 4500` unique trajectories、`3570 < 4000` selected unique RAW states、Mtaji `1747 < 1750`となり、3つのpreregistered estimability gateが未達だった。このためformal decisionは**`INCONCLUSIVE`**。co-primary Brier/log-loss formal branchは未実行で`primary = null`であり、`NOT-CONFIRMED`やvalidated Bao win probabilityとは解釈しない。

**最初に読む:**

- [`position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`](position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`position-evaluation-empirical-outcome-calibration-replication/STUDY_1_FINAL_REPORT.md`](position-evaluation-empirical-outcome-calibration-replication/STUDY_1_FINAL_REPORT.md)
- [`position-evaluation-empirical-outcome-calibration-replication/results/STAGE_2_FORMAL_RESULT.json`](position-evaluation-empirical-outcome-calibration-replication/results/STAGE_2_FORMAL_RESULT.json)
- [`position-evaluation-empirical-outcome-calibration-replication/REPRODUCIBILITY_INDEX.md`](position-evaluation-empirical-outcome-calibration-replication/REPRODUCIBILITY_INDEX.md)
- [`position-evaluation-empirical-outcome-calibration-replication/CURRENT_STATUS.md`](position-evaluation-empirical-outcome-calibration-replication/CURRENT_STATUS.md)

**Boundary:** 同じStage 2 dataに追加game、seed extension、replacement、gate relaxation、mapping refit、near-miss exception、favorable subgroupを適用してformal decisionを救済しない。game-theoretic / human / causal / public-AI-quality claimは本Study外。

---

"""
        marker = "\n## 将来研究\n"
        if marker not in index:
            raise RuntimeError("RESEARCH_INDEX insertion marker missing")
        index = index.replace(marker, "\n" + section + "## 将来研究\n", 1)
        index_path.write_text(index, encoding="utf-8")

    agenda_path = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
    agenda = agenda_path.read_text(encoding="utf-8")
    agenda = agenda.replace("更新日: 2026-08-26", "更新日: 2026-08-27", 1)
    start = agenda.index("#### G2-01 — Position Evaluation / Empirical Outcome Calibration Replication Study 1")
    end = agenda.index("#### G2-02 — Search Reliability / Decision Robustness Study 1", start)
    g2 = agenda[start:end]
    g2 = g2.replace(
        "**状態:** planned / new prospective independent study",
        "**状態:** **完了 / `PEOCR-STUDY1` / formal decision `INCONCLUSIVE`**",
        1,
    )
    if "Stage 2 formal replication result:" not in g2:
        g2 = g2.replace(
            "**Priority:** P0",
            """Stage 2 formal replication result:\n\n```text\ngames = 8192 / 8192\nall 8 shard independent replay = PASS\nfinal Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0\nunique trajectories after firewall = 3898 < 4500\nselected unique RAW states = 3570 < 4000\nMtaji selected states = 1747 < 1750\nformal decision = INCONCLUSIVE\nprimary formal branch = not entered (`primary = null`)\n```\n\nこの`INCONCLUSIVE`は第一世代resultの救済でもmodel failureの`NOT-CONFIRMED`でもない。strict identity firewall後のformal populationが3つのprospective estimability gateへ届かなかったためである。同じdataへの追加seed、replacement、gate relaxation、mapping refit、near-miss exceptionによる救済を行わない。\n\n**Priority:** P0""",
            1,
        )
    agenda = agenda[:start] + g2 + agenda[end:]
    agenda = agenda.replace(
        "第二世代最初の独立研究候補としては`G2-01`を推奨する。ただしこれはAgenda上の優先順位であり、正式Study IDやprotocolをここでfreezeするものではない。",
        "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`としてprospective stop ruleに従い完了した。次の未着手P0候補としては`G2-02` Search Reliability / Decision Robustnessを優先できるが、正式Study IDやprotocolは研究開始時にoutcome前freezeする。",
        1,
    )
    agenda_path.write_text(agenda, encoding="utf-8")

    decision = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
    append_once(decision, "## Program progress — G2-01 closure", """
## Program progress — G2-01 closure

Date: 2026-08-27

Agenda label `G2-01` was instantiated as `PEOCR-STUDY1` and completed under a new prospective Research Generation 2 contract.

```text
Stage 1 = MODEL-FROZEN-DEVELOPMENT
Stage 2 = INCONCLUSIVE
```

The Stage 2 conclusion follows exactly from preregistered estimability failure after strict Stage 1 identity firewall. No Generation 1 decision was changed, no AI-engineering outcome was used as scientific evidence, and no post-outcome rescue was performed. `G2-01` therefore counts as a valid program closure outcome under the program rule that negative/inconclusive/non-estimable results are normal scientific closures.
""")

    root_readme = ROOT / "README.md"
    readme = root_readme.read_text(encoding="utf-8")
    anchor = "- [`doc/RESEARCH_INDEX.md`](doc/RESEARCH_INDEX.md): 研究成果の中央索引。初見向け概要、科学的正本、研究運用文書への入口\n"
    bullet = "- [`doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`](doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-01` / `PEOCR-STUDY1`。8,192-game held-out replicationは独立verificationを完了したが、strict firewall後の3 estimability gate未達によりformal decision `INCONCLUSIVE`\n"
    if bullet not in readme:
        if anchor not in readme:
            raise RuntimeError("root README anchor missing")
        readme = readme.replace(anchor, anchor + bullet, 1)
        root_readme.write_text(readme, encoding="utf-8")


def audit() -> None:
    for source_name, digest in EXPECTED.items():
        canonical = RESULTS / CANONICAL[source_name]
        got = sha256(canonical.read_bytes())
        if got != digest:
            raise RuntimeError(f"canonical SHA mismatch: {canonical}: {got}")
    formal = json.loads((RESULTS / "STAGE_2_FORMAL_RESULT.json").read_text())
    assert formal["formalDecision"] == "INCONCLUSIVE"
    assert formal["primary"] is None
    overview = (STUDY / "STUDY_1_OVERVIEW.md").read_text()
    report = (STUDY / "STUDY_1_FINAL_REPORT.md").read_text()
    agenda = (ROOT / "doc/FUTURE_RESEARCH_AGENDA.md").read_text()
    index = (ROOT / "doc/RESEARCH_INDEX.md").read_text()
    assert "PEOCR-STUDY1 = INCONCLUSIVE" in overview
    assert "PEOCR-STUDY1 = INCONCLUSIVE" in report
    assert "Version: 2.0.0" in agenda
    assert "完了 / `PEOCR-STUDY1` / formal decision `INCONCLUSIVE`" in agenda
    assert "### 17. Position Evaluation / Empirical Outcome Calibration Replication — Study 1" in index


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifact", required=True, type=Path)
    args = parser.parse_args()
    materialize(args.artifact)
    write_study_docs()
    update_central_docs()
    audit()
    print(json.dumps({"passed": True, "studyId": "PEOCR-STUDY1", "formalDecision": "INCONCLUSIVE"}, indent=2))


if __name__ == "__main__":
    main()
