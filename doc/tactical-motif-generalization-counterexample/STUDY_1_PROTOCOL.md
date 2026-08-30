# Study 1 — 研究protocol

## 1. 識別情報

- Research Generation: `G2-09`
- Study ID: `TMGC-STUDY1`
- baseline SHA: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- research branch: `research/g2-09-tactical-motif-generalization-counterexample`

Stage IDs:

- `TMGC-S0-TECHNICAL-2026-08-30-v1`
- `TMGC-S1-DEVELOPMENT-2026-08-30-v1`
- `TMGC-S2-FORMAL-2026-08-30-v1`

## 2. prospective firewallの規則

Stage 0はtechnical-onlyでありscientific resultを生成しない。Stage 1とStage 2はfresh evidenceを用い、Stage 1 root、RAW-state identity、trajectory identity、opening-prefix identityをStage 2 formal evidenceへ再利用しない。

Stage 2 seed blockはStage 1 outcomeを見る前に予約する。Stage 2はStage 1のpreregistered readiness gateを満たした場合のみauthorizedとなる。

## 3. 予約済み科学用seed block

以下をG2-09専用として事前予約し、現時点では`UNCONSUMED`とする。

- Stage 1: `29110001..29114096`（4096 seeds）
- Stage 2: `29210001..29218192`（8192 seeds）

G2-08で未使用だったStage 2 seed blockを再利用しない。

## 4. 変更しないupstream境界

Research Generation 1の`TM-S2-C03` formal definition、formal threshold、formal population、Stage 2 seed、paired definition、search/evaluator semantics、formal decision rule、formal decisionを変更しない。

C01/C02/C04をG2-09で救済しない。G2-09 counterexampleが得られても`TM-S2-C03 = CONFIRMED`を取消さない。

Human / expert validation axisの`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`をmachine evidenceで補完しない。

## 5. Exact constructとtransport construct

`C03-EXACT`は元C03の凍結定義を変更せず再構築したものとする。元定義がMtaji固有であるため、Namua等へのphase跨ぎを`C03-EXACT`と呼ばない。

phase transportを行う場合は、Stage 0で以下を満たした場合にのみ、別ID・別定義のG2-09 constructとしてStage 1前に固定する。

1. move identityとprerequisiteを一意に写像できる
2. consequence semanticsをphase固有要素の恣意的変更なしに定義できる
3. comparatorを一意に構築できる、または「comparator unavailable」をprospectively扱える
4. productionとindependent implementationが同じclassification helperを共有せずに一致検証できる
5. outcomeを見ずにeligibilityを決定できる

満たさない場合は`TECHNICALLY-INELIGIBLE`として閉じる。

## 6. Stage 0 — 技術的実行可能性とsemanticsの検証

Stage 0では次を確認する。

- C03 exact definitionのrepository正本からの完全再構築
- RAW-state identityとmove identity
- legal move enumerationとsuccessor binding
- structural consequenceの独立再計算
- upstream D3 evaluator、score quantization、top-set semanticsの再構築
- comparator / paired construction semanticsの再構築
- phase-transportの意味論的適格性
- prospective structural stratifierのprovenanceとoutcome independence
- fresh source generatorの実装可能性
- trajectory / opening-prefix identityの実装可能性
- source-policy balanceとpopulation diversity floorをStage 1前に測定可能なこと
- runtime、memory、artifact size、shard、upload / transfer、workflow timeoutのresource条件
- runner-local final exact comparisonとmandatory artifact completeness

Stage 0ではG2-09の科学的seedを消費しない。

## 7. Stage 1 — fresh developmentによるboundary構築

Stage 1開始前に、source generation、root selection、正式axis、grouping rule、search instrument、counterexample classification、minimum support、diversity floor、source-policy balance floor、uncertainty rule、Stage 2 authorization gateをmachine-readable specとして凍結する。

selectionにwinner、final outcome、future motif occurrence、future tactical success、favorable search resultを使用しない。

Stage 1はboundary construction専用であり、そのevidenceをStage 2のformal validationへ再利用しない。Stage 1 outcomeを見た後のthreshold relaxation、favorable subgroup selection、seed extension、replacement population、source-policy reweighting、comparator substitution、motif definition変更、search condition差し替え、morphology grouping変更を禁止する。

## 8. Stage 2 — fresh held-out evidenceによるformal validation

Stage 2は、Stage 1で凍結したboundaryとdecision ruleをfresh held-out populationで検証する。Stage 1のroot、trajectory、opening-prefix、RAW stateをformal evidenceへ再利用しない。

formal decision inputsはproduction pathとindependent verification pathの双方で再構築する。

## 9. primary endpoint familyの候補

Stage 1 specでexact computationを固定するが、conceptual familyは以下とする。

1. structural replication / structural counterexampleの判定
2. reference-search tactical-value support / tactical counterexampleの判定
3. comparator / paired consistency
4. boundary groupごとのsupport率とcounterexample率
5. source policy / phase / state familyをまたぐ一貫性
6. uncertainty and non-estimability

単純prevalenceだけでgeneralizationを主張しない。

## 10. independent verificationの方法

少なくとも次をproduction implementationから独立に再構築またはequivalent verificationする。

- source identity
- selected root identity
- exact legal moves
- motif classification
- comparator construction
- outcome/reference quantities
- boundary/group assignment
- primary statistics
- final decision inputs

RAW identity、move keys、legal-move sets、classification labels、group assignments、quantized score/top-set等の離散量はexact equalityを要求する。浮動小数のpre-quantized値を比較する場合のtoleranceはStage 0で検証し、Stage 1開始前に固定する。

## 11. 正式判断語彙

結果を見る前に次のterminal vocabularyを固定する。

### Stage 0の語彙

- `STAGE0-TECHNICAL-PASS`
- `STAGE0-TECHNICAL-INVALID`
- `STAGE0-RESOURCE-CENSORED`

### Stage 1の語彙

- `STAGE1-DEVELOPMENT-PASS-BOUNDARY-FROZEN`
- `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`
- `STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`
- `STAGE1-RESOURCE-CENSORED`

### Stage 2 / Studyのscientific terminal候補

- `VALIDATED-WITHIN-FROZEN-GENERALIZATION-DOMAIN`
- `COUNTEREXAMPLE-BOUNDARY-VALIDATED`
- `MIXED-BOUNDARY-VALIDATED`
- `NOT-GENERALIZED`
- `NON-ESTIMABLE`
- `TECHNICAL-INVALID`
- `RESOURCE-CENSORED`
- `NOT-AUTHORIZED-NOT-EXECUTED`

Stage 1 gate failure時はStudyを`NON-ESTIMABLE`等のpreregistered dispositionで閉じ、Stage 2を`NOT-AUTHORIZED-NOT-EXECUTED`とする。結果を見た後に新しい救済labelを追加しない。

## 12. 技術的failureの対応規則

artifact upload failure、workflow timeout、resource cutoff、mandatory artifact欠損、runner-local exact comparison不能をscientific negativeへ読み替えない。technical failure、resource-censored、scientific non-estimabilityを分離する。

## 13. 解釈上の境界

G2-09はgame-theoretic truth、human recognition、expert terminology、human difficulty、human error probabilityを推定しない。higher-resource searchを真値として扱わない。counterexampleはResearch Generation 1のC03 confirmationを取消さない。
