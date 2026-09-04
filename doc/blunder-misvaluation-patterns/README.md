# 悪手・誤評価パターンの機械検証 — `BMP-STUDY1`

## 研究題目

**Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 状態

**STUDY 1 CLOSED — STAGE 1 EXPLORATORY COMPLETE / STAGE 2 FORMAL COMPLETE / 0 CONFIRMED / 4 NOT-CONFIRMED**

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 branch = research/blunder-misvaluation-patterns-stage2-formal
Stage 1 promoted exploratory candidates = 4
Stage 2 stageId = BMP-S2-FORMAL-2026-08-22-v1
Stage 2 formal candidates = 4 estimable
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

## 最初に読む

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1 final scientific synthesis
- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — Study architecture and result summary
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — final scientific state
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json) — compact canonical formal result
- [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md) — frozen Stage 2 protocol
- [`STAGE_2_DECISION_REGISTER.md`](STAGE_2_DECISION_REGISTER.md) — Stage 2-specific prospective decisions
- [`STAGE_1_EXPLORATORY_REPORT.md`](STAGE_1_EXPLORATORY_REPORT.md) — completed Stage 1 exploratory report
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — reproducibility chain
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — Study-level decisions
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — stage index

## 研究の構成

```text
Stage 0 — technical / construct audit                 COMPLETE
Stage 1 — fresh exploratory discovery                COMPLETE
Stage 2 — fresh prospective formal confirmation      COMPLETE
Study 1                                                CLOSED
```

## Stage 1の結果

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
measured exact legal moves = 5295
matcherCount = 16421
detailedCandidateCount = 123624
promotion passing after support-equivalence = 11
final promoted candidates = 4
manual override = false
```

exploratory Stageからpromotionしたcandidate:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

## Stage 2で固定した識別情報

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
```

fresh Stage 2 population:

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
full replay/search verification = PASS
```

Stage 1 identity firewallによる最終overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

formal supportとmeasurement:

```text
G01 Namua = 1868
G02 Mtaji = 810
total formal measurements = 2678
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
independent verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

## 正式判断の構造

candidateごとに2つのco-primary endpointを事前登録しました。

```text
failure-signature recurrence — exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3-inferior recurrence       — exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

予定した8検定にはHolm-Bonferroni FWER 0.05を適用しました。`CONFIRMED`には、さらに次の条件も要求しました。

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

確認candidateが0件となる場合も、事前に有効な結果として規定していました。

## 最終的な正式結果

| Candidate | Failure recurrence | D3-inferior recurrence | Formal decision |
| --- | ---: | ---: | --- |
| `BMP-S2-C01` | 0.923983 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C02` | 0.797645 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C03` | 0.794968 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C04` | 0.627160 | 0.507407 | **NOT-CONFIRMED** |

C01〜C03は固定済みのstructural failure signatureを強く再現しましたが、D3-inferior statusは事前登録した率で再現しませんでした。C04はabsolute failure-signature floorにも到達しませんでした。

4候補はすべてestimableでしたが、`CONFIRMED`となった候補はありません。

## 正式記録の識別情報

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw formal-result SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

## 解釈上の境界

`NOT-CONFIRMED`が適用されるのは、固定済みmachine-operational confirmation definitionだけです。game-theoretic soundnessの証明ではなく、人間の誤解が存在しないこと、expert / traditionalな評価、教育上の重要性がないこと、因果mechanism、external validityのいずれも確立しません。

D3は固定済みのmachine referenceであり、ground truthではありません。

## 成果物の扱い

大規模なscientific dataはlocalに保持します。

```text
artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/
```

小規模なmachine-readable recordとprovenanceはcommitしていますが、大規模なcorpus・measurement・formal payloadはcommitしていません。
