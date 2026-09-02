# G3-02 / EBRWS-STUDY1 — 成果概要

## 結論

**Formal decision: `TECHNICAL-INVALID`**

Research Generation 3のG3-02として、Baoのbounded RAW局所ゲーム木におけるmulti-ply branching / reply-width profileが再現可能な局面特性となるかをprospectively検証した。

Stage 0 technical validationはPASSした。Stage 1の**authorized one-shot run**ではfresh 24 rootsに対するproduction / independent exact agreementとglobal gate PASSがrunner-localで得られたが、計算後に生成したcanonical Stage 1 result filesをGitHub repositoryへ保存するpushが競合で失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかった。

さらに最終Actions履歴監査で、workflow armingにより同じStage 1 scientific computationが意図せず2回目も実行されていたことが判明した。prospective authorizationはexactly one executionであったため、この2回目は`UNAUTHORIZED-DUPLICATE-INVALID` / `INVALID-DO-NOT-USE`である。

canonical artifact materialization failureとexecution-count contract違反の双方をtechnical-integrity failureとしてfail-closedに適用し、Studyを`CLOSED / TECHNICAL-INVALID`として閉じた。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

## 何を測ろうとしたか

LGTGMIVでformal eligibilityを得たRAW-only / relative depth 5のmeasurement familiesだけを用い、次の2つをprimary constructとして固定した。

- `TREE-WIDTH-SHAPE`
- `REPLY-WIDTH-SHAPE`

候補判定はphaseごとに同一classが少なくとも2/3を占めることを要求し、floating pointではなくexact integer gate `3 * classCount >= 2 * eligibleRootCount`を用いた。

## Stage 1で観測されたがformal claimにしないもの

Authorized run `33569323221`のGitHub Actions logには、次のdiagnostic candidate summaryが残っている。

- Namua: `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT` = 12/12
- Mtaji: `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT` = 9/12

production / independent stage scientific coreもexact一致した。

ただし、これらは**formal promoted candidatesではない**。canonical Stage 1 artifactをrepositoryへimmutable materializeできなかったため、positive scientific conclusionへ昇格させない。

Unauthorized duplicate run `33569382663`もrunner-localでは同じscientific core / candidate-set / scientific-result file hashを生成したが、これはformal replication・confirmation・repair・rescueに利用しない。

## なぜformalな再実行・救済を行わないか

Stage 1はfresh seed `31210001..31210192`に対するexactly one scientific executionだけをprospectively authorizationしていた。最初のfresh evidence生成時点でno-rescue boundaryが成立している。

失われたcanonical filesを作り直す目的で、結果を知った後に同じseedを**authorized repair rerun**することは認められない。そのような結果依存の再実行は行っていない。

一方、最終監査で判明した2回目の実行は、最初のoutcomeが判明する前にworkflow arming commitによってqueueされたものの、実計算はno-rescue boundary成立後に開始されており、exactly-one-execution contractに違反する。したがってこのrunは`INVALID-DO-NOT-USE`であり、欠損artifactの修復やscientific replicationとして扱わない。

## 何が不変か

- G3-01は`CLOSED / TECHNICAL-INVALID`、eligible families `[]`のまま。
- LGTGMIVは`CLOSED / FORMAL-ELIGIBLE-ALL`のまま。
- RAW state identityがauthoritative。
- validated transform setは`[]`。
- Stage 2 seed `31220001..31220288`は未消費。
- G3-11用standard initial RAW-root depth-10 exact holdoutは`SEALED / NOT GENERATED / NOT READ`。
- G3-02を同一Study / same evidenceでrepair・reclassifyしない。

## 解釈上の注意

本Studyは、reply widthが狭いことを「強制手」「最善手が明確」「探索が簡単」「人間にとって簡単」と解釈しない。

また、runner-localの12/12・9/12やunauthorized duplicate runでの一致をBao一般の構造則として扱わない。将来このscientific questionを再検証する場合は、`EBRWS-STUDY1`を救済せず、新しいprospective Study / versionとfresh evidenceを必要とする。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`](results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json)
- [`checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md`](checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md)

## 最終Actions履歴監査

最終監査で、Stage 1 scientific executionはauthorized 1回に対してactual 2回だったことを確認した。

```text
authorized Stage 1 scientific executions = 1
actual Stage 1 scientific executions = 2
run 33569323221 = authorized / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

この追加事実はformal decisionを変更しない。`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`のtechnical-invalid根拠を追加するものである。
