# 公開Bao AI改善Program 1（`PBAI-P1`）

正式題目: `Generation-1 Evidence-Informed Public Bao AI Improvement Program 1`
実施日: 2026-08-26
研究証拠anchor: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`
状態: **PROGRAM COMPLETE / KEEP-AI-GEN2**

`PBAI-P1`は、完了済みResearch Generation 1をengineering inputとして、公開Bao AIの改善候補を設計・評価したProgramです。5 candidateを事前に固定したgateで順に評価しましたが、公開採用まで到達した候補はありませんでした。このため、公開系統`AI-GEN2`を維持して完了しています。

## 最初に読む

1. [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md) — Program全体の判断理由
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態
3. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md) — candidate台帳
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 判断とno-rescueの記録
5. [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md) — 公開・release状態

## Programの結論

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
public AI code changed by PBAI-P1 = false
```

`KEEP-AI-GEN2`は未決定状態ではありません。candidateが公開採用に必要なevidence sequenceとrelease sequenceを満たさなかった場合に、事前に認められていた正式なengineering resultです。

## 固定した比較基準

```text
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
next adopted public lineage reserved = AI-GEN3
```

PBAI-AでResearch Generation 1のevidenceと禁止解釈を監査し、PBAI-Bで公開`AI-GEN2`をexact baselineとして固定し、PBAI-Cでcandidate outcomeを見る前にquality・safety・cost・release gateを固定しました。

Research Generation 2の結果は、このProgramへ途中から追加していません。

## Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C001-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | search workは減りましたが、3つのdecision-quality benefit gateを満たしませんでした。PR #61はmergeせずcloseしました。 |
| `PBAI-C002-v1` | `NON-ESTIMABLE / HOLD` | eligible target 5件でminimum 48件に届きませんでした。PR #55はmergeせずcloseしました。 |
| `PBAI-C003-v1` | `NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD` | RAW identity bindingがreachability測定前に失敗しました。PR #63はmergeせずcloseしました。 |
| `PBAI-C004-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | median node-ratioのintended-benefit gateを満たしませんでした。PR #58はmergeせずcloseしました。 |
| `PBAI-C005` | `NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD` | 現行公開面に修正すべきscore→probability表示を確認できず、実装せずcloseしました。 |

### `PBAI-C001-v1` — 判断

```text
TopSet delta = +0.015625 < +0.05 => FAIL
rank-loss delta = -0.01171875 > -0.02 => FAIL
severe-loss excess = +0.015625 > 0 => FAIL
catastrophic new losses = 0 => PASS
median search-work ratio = 0.2772631455 => PASS
```

計算量の改善だけでquality gateのfailureを救済していません。

### `PBAI-C002-v1` — 判断

```text
eligible targets = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
```

`TM-S2-C03 = CONFIRMED`という研究上の判断は変更していません。

### `PBAI-C003-v1` — 判断

```text
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
known affected rows = 3
identity difference = pending
reachability measurement executed = false
hit count = unmeasured / null
zero-hit conclusion = NOT AUTHORIZED
```

practical reachabilityは測定していないため、「hitが0件だった」とは結論できません。`REWR-STUDY1`と`ORISC-STUDY1`の研究判断も変更していません。

### `PBAI-C004-v1` — 判断

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
result = FAIL
```

Position Complexity / Difficulty Study 1の`INCONCLUSIVE`は不変です。

### `PBAI-C005` — 判断

現行UI・code・diagnostic surfaceをread-onlyで監査しました。engine evaluationをvalidated win probability、win rate、winning chance、confidence probabilityとして表示する箇所は確認されませんでした。

```text
actionable current production semantics defect = false
implementation = NOT CREATED
engine score -> validated Bao win probability = NOT AUTHORIZED
```

詳細は[`C005_PRODUCTION_SURFACE_AUDIT.md`](C005_PRODUCTION_SURFACE_AUDIT.md)を参照してください。

## 最終的なauthorization境界

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false / HOLD
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
public deployments caused by PBAI-P1 = 0
original candidate inventory remaining = 0
```

validationとrelease holdoutは、効果がなかったのではなく、実行条件が成立せず未承認・未実行です。

## 研究との境界

- engineering resultによって既存Studyのformal decision、threshold、endpoint、populationを変更しません。
- machine search complexityをhuman difficultyへ読み替えません。
- machine reply pressureをhuman error inducementへ読み替えません。
- unvalidated symmetry / canonicalizationをexact identityへ使いません。
- Research Generation 1のauthoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`です。
- current `AI.stateKey`は研究上のauthoritative RAW identityと同一ではありません。

## 正本と再現資料

- [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md) — 使用した研究証拠と禁止解釈
- [`BASELINE_SPEC.md`](BASELINE_SPEC.md) — `AI-GEN2` baseline
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md) — 評価手順
- [`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json) — 固定済みgate
- [`RESUME_HERE.md`](RESUME_HERE.md) — closure後の引き継ぎ

将来のAI改善はPBAI-P1 candidateを暗黙に再開せず、新しいProgram ID、evidence cutoff、fresh split、candidate inventory、acceptance gateを事前に固定して開始します。
