# Search Reliability / Decision Robustness Study 1 — Overview

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
D2_Q1 vs D3_Q1 canonical-best agreement = 0.734856
D2_Q2 vs D2_Q1 canonical-best agreement = 0.748759
B1024 vs D3 canonical-best agreement = 0.941410
```

NamuaではMtajiより低いagreementが多く観測されたが、formal gate failure後のsecondary resultであり、human difficultyやtrue move qualityのclaimには使用しない。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`results/STAGE_2_VERIFICATION.json`](results/STAGE_2_VERIFICATION.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
