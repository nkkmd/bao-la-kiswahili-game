# G3-02 / EBRWS-STUDY1 — 成果概要

## 結論

**Formal decision: `TECHNICAL-INVALID`**

Research Generation 3のG3-02として、Baoのbounded RAW局所ゲーム木におけるmulti-ply branching / reply-width profileが再現可能な局面特性となるかをprospectively検証した。

Stage 0 technical validationはPASSし、Stage 1もfresh 24 rootsを使ったone-shot計算そのものではproduction / independent exact agreementとglobal gate PASSが得られた。しかし、計算後に生成したcanonical Stage 1 result filesをGitHub repositoryへ保存するpushが競合で失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかった。

fresh evidence生成後のsame-evidence rerunはno-rescue ruleに反するため行わず、fail-closedでStudyを`TECHNICAL-INVALID`として閉じた。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

## 何を測ろうとしたか

LGTGMIVでformal eligibilityを得たRAW-only / relative depth 5のmeasurement familiesだけを用い、次の2つをprimary constructとして固定した。

- `TREE-WIDTH-SHAPE`
- `REPLY-WIDTH-SHAPE`

候補判定はphaseごとに同一classが少なくとも2/3を占めることを要求し、floating pointではなくexact integer gate `3 * classCount >= 2 * eligibleRootCount`を用いた。

## Stage 1で観測されたがformal claimにしないもの

one-shot runnerのimmutable GitHub Actions logには、次のdiagnostic candidate summaryが残っている。

- Namua: `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT` = 12/12
- Mtaji: `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT` = 9/12

production / independent stage scientific coreもexact一致した。

ただし、これらは**formal promoted candidatesではない**。canonical Stage 1 artifactのrepository materializationに失敗したため、positive scientific conclusionへ昇格させない。

## なぜ再実行しなかったか

Stage 1はfresh seed `31210001..31210192`を一度だけ実行するprospective authorizationだった。fresh evidence生成時点でno-rescue boundaryが成立している。

その後に同じseedを再実行して失われたファイルを作り直すと、positive outcomeを見た後のsame-evidence repairになる。このStudyではそれを許可していないため、再実行せずtechnical-invalidとして閉じた。

## 何が不変か

- G3-01は`CLOSED / TECHNICAL-INVALID`、eligible families `[]`のまま。
- LGTGMIVは`CLOSED / FORMAL-ELIGIBLE-ALL`のまま。
- RAW state identityがauthoritative。
- validated transform setは`[]`。
- Stage 2 seed `31220001..31220288`は未消費。
- G3-11用standard initial RAW-root depth-10 exact holdoutは`SEALED / NOT GENERATED / NOT READ`。

## 解釈上の注意

本Studyは、reply widthが狭いことを「強制手」「最善手が明確」「探索が簡単」「人間にとって簡単」と解釈しない。

また、runner-localの12/12・9/12をBao一般の構造則として扱わない。将来このscientific questionを再検証する場合は、`EBRWS-STUDY1`を救済せず、新しいprospective Study / versionとfresh evidenceを必要とする。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`](results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json)
