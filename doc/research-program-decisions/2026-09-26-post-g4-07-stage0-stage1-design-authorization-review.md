# 2026-09-26 — post-G4-07 Stage 0 / pre-Stage 1 設計認可レビュー

Review ID: `MLGMR-STUDY1-STAGE1-DESIGN-AUTH-2026-09-26-V1`  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Stage 0: **`COMPLETE / STAGE0-PASS`**  
判定: **`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

## 1. 審査対象

G4-07 Stage 0で、frozen continuous representation、lagged sign persistence、phase-crossing censor、bounded reversal/return semantics、trajectory-level aggregation、production / independent exact agreement、identity firewall、resource feasibilityをtechnical fixture上で再現できることを確認した。

本レビューでは、fresh Stage 1 developmentについて、**fresh scientific seedを読む前にsource population、selection rule、checkpoint、lag family、primary support family、descriptive return module、identity firewall、resource ceiling、no-rescue boundaryを固定できるか**を審査する。

本レビューはStage 1 scientific executionをまだ認可しない。implementationとworkflowを完成させ、source blob SHA・branch・trigger・attemptを固定した別のone-shot authorizationを必須とする。

## 2. Stage 0 prerequisite

Canonical Stage 0:

```text
run = 36238840292 / attempt 1 / success
head = 0c7cdb2b2fa83c4d97ec0d2ad27c6a5c9c22b2b5
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V3
artifact ID = 10905163005
artifact ZIP SHA-256 = cf5b96e4fb63786e085bf9719beed6ff125f588d623657ed7450031b1a20614f
result.json SHA-256 = d6854bd00454288e76de2274990571f6c5d0249b7b8ee8f632c53e8a4fe6e0a5
mandatory gates = 18 / 18 PASS
production / independent exact agreement = true
fresh scientific seed reads = 0
Stage 1 seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

Run 1とRun 2はscientific access前にfail-closedしており、Run 3だけをcanonical Stage 0 PASSとする。

したがってStage 1 design/source freezeへ進むtechnical prerequisiteは満たされた。

## 3. Scientific design freeze

Stage 1は既存preregistration `prereg/STUDY_1_SPEC.json` に固定済みの次のscientific designを変更しない。

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = canonical CRCLGR A1..A6
source policies = LGTTCI-P1-UNIFORM-LEGAL / LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
checkpoint plies = 16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
lag checkpoint intervals = 1,2,4,8
lag ply-equivalent = 4,8,16,32
primary unit = source trajectory
primary family = 24 axis×lag slots
secondary return module = descriptive-only
phase crossing = primary censored / descriptively counted
```

Stage 1結果を見た後のaxis、lag、checkpoint、policy、endpoint追加・削除は禁止する。

## 4. Fresh Stage 1 seed block

Stage 1 reserved namespaceを次で固定する。

```text
stageId = MLGMR-S1-DEVELOPMENT-2026-09-26-v1
seedStart = 40713001
seedEnd = 40713512
seedSlots = 512
slotsPerPolicy = 256
candidateTargetPerPolicy = 16
minimumFullyEligiblePerPolicy = 12
measuredPerPolicy = 8
```

このreview時点でStage 1 seed readは0である。

seed extension、別seed blockへのreplacement、不足時のpost-hoc追加scanは禁止する。minimum eligibilityを満たさなければStage 1はfail-closedする。

## 5. Policy assignment and selection freeze

policy assignmentは`FIXED-SEED-SLOT-PARITY-OUTCOME-BLIND`を維持する。

selectionは次の条件だけを使用する。

- deterministic source trajectory identity
- nonterminal through checkpoint 72
- all 15 checkpoint roots available
- all required depth-5 preflight checks within frozen resource ceilings
- upstream identity firewallを通過
- policy-specific fixed slot/order rule

次をselection inputへ使用しない。

- G3-10 / G4-04 endpoint values
- G3-10 / G4-04 effect direction
- prior p-values
- game outcome
- G4-07 persistence/reversal balance
- favorable phase subgroup
- favorable rule event subgroup

## 6. Stage 1 identity firewall

Stage 1 fresh source selection前に、identity-only exclusion manifestをmaterializeする。

最低限、次を除外する。

- G3-10 Stage 1/2 scientific seed namespaces
- G3-10 auditable full trajectory / opening prefix / checkpoint root identities
- G3-08 Stage 1 seed namespace `31810001..31810256`
- G3-08 protected Stage 2 seed namespace `31820001..31820384`
- G3-08 auditable generated trajectory/root identities
- G4-01 GCLD interrupted scientific/reserve namespaces
- G4-04 Stage 1 seeds `40413001..40413512`
- G4-04 Stage 2 seeds `40423001..40424024`
- G4-04 full trajectory / opening prefix / checkpoint root identities

identity firewallはprior endpointやeffect directionを読み込まない。

Stage 2では、将来別認可の下でStage 1の全scientific identityも追加除外する。

## 7. Stage 1 output boundary

Stage 1は**development / support-only**であり、formal scientific decisionを生成しない。

各measured trajectoryについてfrozen 24 axis×lag slotの次を出力する。

```text
sameCount
oppositeCount
zeroExcludedCount
phaseCrossingCensoredCount
windowCensoredCount
comparableNonzero
balance = sameCount - oppositeCount
balanceSign
```

さらにbounded return moduleをdescriptive-onlyで出力してよい。

Stage 1では次を禁止する。

- formal p-valueによるconfirmation label
- Stage 2 directionのoutcome-driven変更
- primary familyの削減
- favorable axis/lagだけの選択
- `half-life`を物理的decay lawとして解釈すること

## 8. Stage 1 support gate

Stage 2候補slotのpromotionはeffect directionではなく、**support / definedness / exactness**だけで決める。

frozen support rule:

```text
complete measured trajectories required = 16
measured per policy = 8
per-policy support trajectories required = 6
combined support trajectories required = 12
minimum comparable-nonzero per supporting trajectory = 3
production/independent exact agreement required = true
effect direction used for promotion = false
```

slotはこのsupport条件だけで`SUPPORTED-FOR-FORMAL-HOLDOUT`または`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`へ分類する。

Stage 1 balance signの正負、majority direction、descriptive return patternをpromotion条件に使わない。

## 9. Production / independent implementation requirement

Stage 1 implementationはproductionとindependentを分離する。

- productionはproduction upstream representation pathを使用する
- independentはindependent upstream representation pathを使用する
- source trajectory generator / state key / move key / representation measurementを相互importしない
- canonical identity/outputだけを比較する
- mismatch時は`TECHNICAL-INVALID`としてfail-closedする

Stage 0で一致したことを理由にStage 1のdual implementationを省略しない。

## 10. Resource ceiling

既存preregistrationのresource ceilingを変更しない。

主要上限:

```text
per checkpoint / implementation unique RAW states = 100000
unique transitions = 750000
parent expansions = 100000
legal move evaluations = 750000
summed tree node occurrences = 1000000000
per checkpoint elapsed = 180000 ms
combined production+independent per checkpoint elapsed = 360000 ms
Stage 1 total elapsed = 10800000 ms
Stage peak RSS = 4294967296 bytes
Stage 1 result artifact = 268435456 bytes
```

ceiling超過時はfail-closedする。fresh access後のresource ceiling relaxationは禁止する。

## 11. No-rescue boundary

no-rescue boundaryは、**最初のStage 1 fresh seed generation/readのうち早い方**とする。

それ以降、同Study/version内で次を変更しない。

- source policy
- checkpoint grid
- lag family
- axis family
- primary endpoint
- support gate
- seed block
- selection rule
- formal test/multiplicity plan
- resource ceiling
- favorable subgroup rescue

same-evidence repair rerun、seed extension、replacement populationを認めない。

technical failureがscientific seed read前に起きた場合のみ、原因を記録し、科学設計を変えないtechnical remediationを別bindingとして審査できる。

## 12. Execution integrity

Stage 1は長時間処理となる可能性があるため、GitHub Actionsを第一候補とする。

implementation完成後、fresh execution前に最低限次をfreezeする。

```text
source commit SHA
all scientific runner/helper Git blob SHA
workflow Git blob SHA
identity firewall manifest SHA/digest
Stage 1 authorization JSON
single trigger path
branch
run attempt = 1 only
concurrency guard
artifact name/path
```

canonical runから次を保存する。

```text
workflow run ID / attempt
head SHA
artifact ID
artifact ZIP SHA-256
result.json SHA-256
fresh seed read count
selected/measured trajectory identities
G4-10 depth-11 access count
```

## 13. Interpretation boundary

Stage 1 development resultから次を主張しない。

- persistence/reversalのformal confirmation
- whole-Bao universal memory law
- 32 ply超のmemory length
- physical exponential half-life
- game-theoretic value / best-move correctness
- AI strength / win rate
- human difficulty
- rule mechanism causality
- public AI採用

## 14. 認可される次工程

本レビューで認可するのは次だけ。

- Stage 1 development spec / source manifestの最終freeze
- identity-only firewall manifest作成
- Stage 1 production implementation
- Stage 1 independent implementation
- Stage 1 workflow作成
- source separation / syntax / static guard検査
- source Git blob SHA取得
- final one-shot execution authorization文書 / JSONの作成準備

以下は**まだ認可しない**。

- Stage 1 seed `40713001..40713512` のgeneration/read
- Stage 1 candidate scan
- Stage 1 scientific trajectory measurement
- support classification生成
- Stage 2 seed access
- G4-10 depth-11 access
- public AI変更
- main統合

## 15. 判定

**`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

Stage 0 prerequisiteは満たされ、Stage 1のscientific designもfresh access前に十分固定されている。

次はStage 1 implementation、identity firewall manifest、workflowを作成し、すべてのsource blob SHAを固定した**final one-shot Stage 1 execution authorization review**を行う。
