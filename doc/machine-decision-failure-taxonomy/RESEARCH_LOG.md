# MDFT-STUDY1 — Research Log

## 2026-08-29 — Study initiation

1. remote `main`を再取得した。
2. user-provided prior G2-07 integration HEAD `24a0968e68c9eb0ed7462093d953f52b339a9d04`ではなく、current remote `main`は`cb660e166460e0f19d4ba16d5283fa880d55757f`であることを確認した。
3. current HEADは`24a0968...`を祖先に持ち、その後の日本語文書統合mergeを含むことを確認した。
4. `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`、`doc/RULES_BASELINE.md`を確認した。
5. G2-07のOverview / Final Report / CURRENT_STATUS / DECISION_REGISTER / REPRODUCIBILITY_INDEX / main-integration checkpointを確認した。
6. BMP / SRDR / RCPR / PCRPR / Tactical Motifs / Position Complexityのclosure boundaryを確認した。
7. G2-03 validated transform setが引き続き`[]`であり、G2-08をRAW-only identityで開始する必要があることを確認した。
8. open PRが存在せず、既存G2-08 branchが存在しないことを確認した。
9. `research/g2-08-machine-decision-failure-taxonomy` branchをcurrent remote mainから作成した。
10. Study IDを`MDFT-STUDY1`として固定した。
11. Stage 0/1/2 identity、multi-label candidate search space、fresh seed reservation、no-rescue、independent verification、artifact-preservation designをscientific outcome前に記録した。
12. Stage 1/2 scientific seedはまだ消費していない。

## 2026-08-29 — Stage 0 core technical validation

1. G2-08専用production search wrapperと、production/SRDR helperをimportしないindependent alpha-beta/quiescence/budget implementationを作成した。
2. authoritative RAW identityに`pending`を含め、`turn/reason`を除外するserializer/reconstructionを実装した。
3. exact move identity、canonical ordering、positive/negative comparer、determinism、leakage sentinel、JSON roundtrip、artifact sharding controlsを実装した。
4. GitHub Actions run `33256737040`がsuccessした。
5. 4 technical fixtures（Namua 2 / Mtaji 2）でproduction/independent exact equalityを確認した。
6. B1024は4/4 fixturesでcomplete depth 3に到達した。
7. canonical core SHA-256 `f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1`を固定した。
8. run `33256767045`で同じcore SHA-256を再現し、determinismを確認した。
9. Stage 1/2 scientific seedは使用していない。

## 2026-08-29 — F09 static historical-classifier audit

1. closed Position Typology studyのfrozen Mtaji classifierが、repository外local artifact `mtaji-candidate-definition.json`のscaler/centroid等を必要とすることを確認した。
2. current repositoryにexact candidate artifact、authoritative scaler/centroid copy、hash-bound replacement sourceが存在しないことを確認した。
3. prospectively frozen no-refit ruleに従い、`MDFT-F09 = TECHNICALLY-INELIGIBLE`とした。
4. historical MTAJI-M1/MTAJI-M2 formal resultは変更していない。

## 2026-08-29 — F10 bounded-continuation preflight

1. scientific evidenceを見る前に、6-ply continuation、minimum 3 fixtures、Namua/Mtaji coverage、120 s、512 MB、gzip 5 MB ceilingをStage 0 specへ固定した。
2. GitHub Actions run `33256932295`がsuccessした。
3. 4 fixtures / 8 tracesでproduction/independent exact continuation traceを確認した。
4. observed wall clock 25279.321986 ms、max RSS 97296 KB、gzip 2570 bytesで全predeclared gateをPASSした。
5. `MDFT-F10 = TECHNICALLY-ELIGIBLE`とした。

## 2026-08-29 — Stage 0 closure

1. `results/STAGE_0_TECHNICAL_RESULT.json`を作成した。
2. `checkpoints/2026-08-29-stage0-technical-pass.md`を作成した。
3. canonical dispositionを`STAGE0-TECHNICAL-PASS`として固定した。
4. Stage 1 technical-eligible leafを`F01,F02,F03,F04,F05,F06,F07,F08,F10`に固定した。
5. F09をStage 1 evidence inspection前に除外し、replacement/refitを禁止した。
6. Stage 1 seeds `28910001..28914096`は引き続き`RESERVED / UNCONSUMED`である。
7. Stage 2 seeds `29010001..29018192`も`RESERVED / UNCONSUMED`である。

## Next

Stage 1 exact machine-readable spec、production/independent implementation、technical-only scientific-scale resource/artifact preflight、source freeze、explicit Stage 1 authorizationをこの順で行う。authorization recordより前にStage 1 scientific blockを消費してはならない。
