# G2-12 / SSGTGE-STUDY1 — 最終報告

更新日: 2026-08-31  
正式判断: **`TECHNICAL-INVALID`**

## 1. 研究

**Study ID:** `SSGTGE-STUDY1`  
**研究世代:** Research Generation 2 `G2-12`
**正式英語題目:** State-Space / Game-Tree Growth Estimation Study 1

日本語研究題目:

> **Baoにおける状態空間・ゲーム木成長の推定 — bounded exact enumerationからのprospective growth estimator構築とfresh deeper exact holdoutによる検証**

本研究は、G2-05 `DRSSE-STUDY1`がexactに確立した標準初期局面からのdepth 0..9のRAW-state / game-tree成長をdevelopment evidenceとして用い、有限のestimator候補をprospectively比較し、その後にfresh exact depth 10で検証することを目的とした独立研究である。

## 2. 結論

Study 1の正式判断は:

```text
TECHNICAL-INVALID
```

である。

Stage 0では、初版v1がsource-binding defectにより`STAGE0-TECHNICAL-INVALID`となった。これは科学的output生成前の失敗であったため、既存のResearch Generation 2運用に従い、科学contractを変更しないcorrective technical-entry v2を新しいversionとしてprospectively freezeした。

v2はproduction / independent technical validationを完遂し:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v2 = STAGE0-TECHNICAL-PASS
```

となった。

その後Stage 1を、G2-05の既存depth 0..9だけを使うdevelopment-only blockとして別freeze・別authorizationで一度だけ実行した。production pathは完了したが、必須independent verifierが凍結済みcross-implementation toleranceを超えるprediction mismatchを検出して停止した。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 authorizationは`sameStage1EvidenceRerunAuthorized=false`を固定していたため、mismatch確認後にtolerance、solver、verifier、selection outputを変更して同じdevelopment evidenceを再実行しない。

したがって本Studyではcanonical estimatorをfreezeしていない。

```text
selectedEstimator = null
fresh depth 10 generated/read = false
fresh depth 11 generated/read = false
```

## 3. 変更しないG2-05境界

直接のupstreamはG2-05 `DRSSE-STUDY1`である。

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
complete exact layers = 0..9
cumulative RAW states through depth 9 = 102857
validated transform set = []
```

G2-12はこのformal exact domainを変更しない。Stage 1で読んだのはimmutableなdepth 0..9 summaryだけであり、fresh layerをG2-05へ追加していない。

authoritative identityも次のRAW-only contractを維持した。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はidentityに含めず、canonicalization / symmetry reduction / seat swap / reflection reductionは使用していない。

## 4. prospective estimator contract （固定した条件）

Study開始時、fresh depth 10/11を生成する前にcandidate familyを次の3つに固定した。

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

primary modeled seriesは:

```text
newRawStateCount
treeNodeOccurrences
```

である。

rolling-origin backtestは両系列について:

```text
5 -> 6
6 -> 7
7 -> 8
8 -> 9
```

とし、candidate eligibilityを:

```text
finite positive prediction
nondecreasing versus immediately prior observed layer
maximum absolute natural-log error <= 0.15
```

に固定した。

winner ruleはworst-cell error、mean error、固定candidate orderの順で決めることとした。uncertainty ruleも`q`, `R1=max(0.15,2q)`, `R2=2R1`としてoutcome前に固定した。

## 5. Stage 0 v1 （Stageの記録）

Stage 0 v1はtechnical-onlyで、fresh holdoutや実development competitionを消費しない設計だった。

```text
run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
```

production processはauthorization/source-binding gateで:

```text
SOURCE-HASH-BINDING-MISMATCH
```

によりexit 1となった。またworkflowが`tee` pipelineへ`pipefail`を設定していなかったため、Actions metadata上はfailureがmaskされた。

v1は:

```text
STAGE0-TECHNICAL-INVALID
```

として永久保存し、同versionをrepair/rerunしていない。

## 6. Stage 0 v2 （Stageの記録）

v1がscientific output生成前に停止したことから、source-bindingとshell orchestrationだけを変更したv2を別versionとして事前freezeした。

```text
implementation/source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
```

v2ではGit blob identityによるsource bindingと`set -euo pipefail`を用いた。

production / independent双方がexit 0となり、標準初期rootのdepth-2 technical fixtureについて:

```text
cumulative RAW states = 19
depth-labelled legal edges = 18
cumulative tree node occurrences = 19
RAW state set SHA256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
```

を一致して再現した。synthetic E1/E2/E3 fixtureとnegative controlsも通過した。

そのためv2は:

```text
STAGE0-TECHNICAL-PASS
```

として受理した。

## 7. Stage 1 prospective freeze （固定した条件）

Stage 0 PASS後、Stage 1を別commitでsource freezeした。

```text
source freeze = 3d93b6cb228bc314819495e89c1521859bf258b6
authorization = bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
```

Stage 1 authorizationは:

```text
realDevelopmentCandidateEvaluationAuthorized = true
maximumDepthRead = 9
freshDepth10Or11GenerationAuthorized = false
freshDepth10ReadAuthorized = false
freshDepth11ReadAuthorized = false
sameStage1EvidenceRerunAuthorized = false
stage2ExecutionAuthorized = false
```

を固定した。

## 8. Stage 1 production-only diagnostic （Stageの記録）

Stage 1のworkflow:

```text
run = 33324107667
job = 99291109199
artifact = 9735723141
artifact ZIP SHA256 = 7b415b0fad9cadf92568d0b1103b44d9325d8b4c2a729edb40cb1f673e3af09f
```

production processはexit 0となり、production-only計算では次のsummaryを出力した。

| candidate | 最大absolute log error | 平均absolute log error | production実装での適格性 |
|---|---:|---:|---|
| `E1-TRAILING-LOG-LINEAR-W5` | 0.2813333110915206 | 0.21758046269506714 | false |
| `E2-LOG-QUADRATIC-D2PLUS` | 0.07917793679237395 | 0.027282797524651126 | true |
| `E3-LOCAL-LOG-INCREMENT-TREND-W4` | 0.1129709359542721 | 0.036062220843277815 | true |

production ruleだけを適用するとE2がwinnerとなった。

```text
production proposed selected estimator = E2-LOG-QUADRATIC-D2PLUS
productionCoreSha256 = 0dde91343fd7ff1c7736eda2629d4c0f1c04c32b7aad0afee5613e6432cba194
```

production-only proposed calibrationは:

```text
q = 0.07917793679237395
R1 = 0.1583558735847479
R2 = 0.3167117471694958
```

だった。

production-only proposed depth-10 pointsは:

```text
newRawStateCount = 344863.9269322148
treeNodeOccurrences = 514303.0122194221
```

であった。

ただし、これらは必須independent verificationを通過していないため**canonical estimator / formal predictionとして採用しない**。将来のStage 2 inputとして使用することも認めない。

## 9. independent verification failure （独立検証）

independent verifierはproductionのcandidate outputsを再計算し、凍結済みrelative tolerance `1e-12`で比較した。

最初に検出したfailureは:

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
```

である。

production predictionは:

```text
4729.18318822039
```

だった。post-failure diagnostic reconstructionではindependent path相当値は約:

```text
4729.1831882325705
```

で、相対差は約:

```text
2.57568e-12
```

となった。数値的には小差だが、prospectively fixed tolerance `1e-12`を超える。

このpost-failure reconstructionはfailure原因理解のdiagnosticであり、scientific acceptance evidenceではない。

## 10. no-rescue規則

このfailure後に行わないことを明示する。

- independent solverをproduction solverと同一化する
- toleranceを`1e-12`より緩める
- E2だけをspecial-caseする
- failed cellを除外する
- production selectionをindependent PASSとみなす
- same Stage 1 evidenceを修正版verifierで再実行する
- production-only depth-10 predictionをStage 2へ持ち込む

Stage 1 authorizationが`sameStage1EvidenceRerunAuthorized=false`を固定しており、real development outcomeは既にproduction pathで生成されたためである。

したがってStage 1は:

```text
STAGE1-TECHNICAL-INVALID
```

で閉じる。

## 11. Stage 2 （Stageの記録）

Stage 1でmandatory independent gateを満たしたcanonical estimatorが存在しないため、Stage 2をauthorizeしない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10 = NOT GENERATED / NOT READ
fresh depth 11 = NOT GENERATED / NOT READ
```

したがってformal holdout validationは一切実施していない。

本Studyから「E2がdepth 10を予測できる」「E2がvalidationされた」「Bao全体のstate-spaceはこの規模である」と主張しない。

## 12. G2-11境界

G2-10およびPSRRE-STUDY1はG2-11へ渡せるeligible frozen strategic representationを生成していない。

```text
G2-11 = NOT-AUTHORIZED
```

は本Study後も不変である。state-space / game-tree growth evidenceをstrategic regime evidenceへ読み替えない。

## 13. 将来の研究

今回のnumerical cross-implementation issueを解消した再検証は技術的には可能である。しかしそれは`SSGTGE-STUDY1`の結果を救済する形では行わない。

必要であれば、新しいprospective Studyまたは明示的なnew versionとして:

- 数値計算のimplementation contract
- 実装間のequivalence criterion
- sourceの識別情報
- development evidenceの扱い
- candidate set
- holdoutの予約状態
- no-rescue rule

をoutcome生成前に新たにfreezeして開始する。

本Studyで得られたproduction-only E2 proposalはhypothesis-generation / resource-planning informationにはなり得るが、新Studyのformal confirmation evidenceとして無条件に再利用しない。
