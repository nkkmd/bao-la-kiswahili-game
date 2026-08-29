# G2-06 第1研究概要 — 重要局面の豊かな構造表現

更新日: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study ID: `RCPR-STUDY1`  
状態: **Stage 1で終了 / `STAGE1-TECHNICAL-INVALID`**

正式英語名: **Rich Critical-Position Representation Study 1**

日本語題目:

> **Baoにおける重要局面の豊かな構造表現の構築と事前規定による検証 — root以前から利用可能な豊かな特徴表現によるdecision-critical structureの再現可能な識別**

## 1. 最終状態

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 consume-once seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1のproduction pipelineは、production実行に必要なすべての準備条件を満たしました。しかし、事前に必須と定めていた**独立実装による特徴表現の完全一致検証**で、600行中4行に不一致が発生しました。

技術的な事後調査では、この4件の不一致は`MOVE_SET_ENTROPY.indexEntropy`における浮動小数点加算順序の違いに局在しました。

事前固定したfail-closed contractでは完全一致を要求していたため、この結果を救済してStage 2へ進むことは認められません。

詳細:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

## 2. この研究は何を調べようとしたのか

本研究の中心的な問いは、**あるroot時点までに観測可能な情報だけから構成した、より豊かな局面表現によって、固定policyによる継続対局の分岐が大きいという既存のmachine-defined constructを、新しい独立集団でも再現可能に識別できるか**というものです。

ただし、Stage 1の必須技術検証を通過しなかったため、この問いをStage 2で肯定・否定する正式評価には進んでいません。

Stage 1のproduction-only model outputも、独立検証済みの科学結果としては採用していません。

また、本研究はResearch Generation 1で得られた139/600 high-divergence rootsや1,183件のfailed candidate auditsを再分類・救済することを目的としていません。

## 3. Stage構成

```text
RCPR-S0-TECHNICAL-2026-08-28-v1
  technical representation feasibility only
  FINAL: STAGE0-TECHNICAL-PASS

RCPR-S1-DEVELOPMENT-2026-08-28-v1
  fresh development population; representation construction/model selection only
  FINAL: STAGE1-TECHNICAL-INVALID

RCPR-S2-FORMAL-2026-08-28-v1
  fresh independent formal validation, conditional on prospective authorization
  FINAL: NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 0は特徴表現が技術的に構築可能かを確認する段階、Stage 1は新しいdevelopment populationでrepresentation constructionとmodel selectionを行う段階、Stage 2は独立したfresh populationで正式検証を行う段階として設計しました。

Stage 2はStage 1の条件付き承認を必要としていましたが、その条件は成立しませんでした。

## 4. authoritative scientific state identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
symmetry reduction = false
canonicalization = false
```

Historical occurrence provenanceはtemporal featureのために保持できますが、RAW state identityそのものを置き換えるものではありません。

## 5. 情報漏洩を防ぐための境界

```text
A PRE_ROOT_OBSERVABLE                       eligible
B ROOT_DERIVED_OUTCOME_INDEPENDENT          eligible
C SEARCH_DERIVED_OUTCOME_INDEPENDENT        eligible only under frozen search profile
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED    forbidden
```

Predictor representationには、`D_range`、継続対局のwins/losses、root後のrollout state、future winner、その他のoutcome-derived quantityを使用してはいけないと事前に固定しました。

つまり、「あとで起きた勝敗を知っていなければ作れない特徴」を説明変数へ混入させない設計です。

## 6. 事前に宣言したrepresentation family

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

終了したStage 1を救済するために、新しいfamilyを事後追加することは認められません。

## 7. Stage 1 production-only output

Provenanceとしてのみ、production側では次の値が出力されました。

```text
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
Namua AUROC = 0.7356189599631845
Mtaji AUROC = 0.6657646992502396
balanced accuracy = 0.6684641309581127
```

これらの値は、独立な特徴表現再計算が完全一致しなかったため、正式な科学結果へ昇格していません。

## 8. `STAGE1-TECHNICAL-INVALID`となった理由

独立検証では、corpus replay、root reselection、continuation remeasurement、`D_range`、high-divergence label、model development、readinessについては一致しました。

不一致は4件のexact feature-vector hashだけに発生しました。

原因は、production extractorとindependent extractorで`MOVE_SET_ENTROPY.indexEntropy`を加算するcategory順序が異なり、IEEE-754浮動小数点演算で約`2.22e-16`〜`4.44e-16`の差が生じたことでした。

しかし、凍結済みcontractはexact equalityを要求していました。そのため、原因が小さな数値差であっても最終判断は変更せず、Stage 1を`STAGE1-TECHNICAL-INVALID`としました。

## 9. upstream研究との境界

既存研究の固定済み状態は変更しません。

```text
G2-01 / PEOCR-STUDY1 = INCONCLUSIVE
G2-02 / SRDR-STUDY1 = INCONCLUSIVE
G2-03 / STSCV-STUDY1 = INCONCLUSIVE
validated transform set = []
canonicalization = not authorized
G2-04 / REEOE-STUDY1 = INCONCLUSIVE
REEOE Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

Research Generation 1のCritical Positions / Outcome Branching Study 1も、600 selected roots、139 high-divergence roots、1,183 candidate audits、promoted candidates 0、Stage 2未実施という既存状態を維持します。

## 10. 解釈上の境界と将来研究

`RCPR-STUDY1`が確立したのは、**このStudyで凍結したStage 1の完全一致独立検証contractが技術的に成立しなかった**という点です。

この結果から次を主張しません。

- game-theoretic turning point
- 人間が知覚するcriticality
- causality
- Bao全体に普遍的な局面taxonomy
- 公開AIの改善効果
- full-game solution

将来、deterministic entropy計算やnumeric hashingを強化したうえで同じ研究問いを再検証することは可能です。ただし、その場合は新しいStudy identity、新しいtechnical validation、新しいscientific seed block、新しい明示的authorizationを必要とします。

消費済みの`RCPR-STUDY1` seed blockを再実行して昇格させることは認められません。

## 11. 詳細・再現用文書

- `README.md` — 研究ディレクトリ案内とclosure概要
- `STUDY_1_FINAL_REPORT.md` — 科学的・技術的な最終統合
- `CURRENT_STATUS.md` — 最終運用状態
- `DECISION_REGISTER.md` — 固定済み判断とno-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — hash、run、artifact、provenance
