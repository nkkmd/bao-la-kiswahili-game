# G4-01 — Stage 0後のStage 1 authorization review

日付: 2026-09-17  
対象Study: `LGTTCI-STUDY1`  
対象Stage: `LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`

## 判断

**`LGTTCI-STAGE1-AUTHORIZED`**

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`の正式判定`STAGE0-PASS`、保護証拠の未アクセス状態、source identity、fresh compatibility populationの事前固定可能性を再確認した結果、G4-01 Stage 1の`FRESH-COMPATIBILITY`実行を承認する。

この承認はcompatibility evidence生成だけを対象とし、formal scientific effect、p-value、generalization/counterexample decision、G4-02以降の実行を承認しない。

## review時点の固定状態

```text
baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
research branch = research/g4-01-transfer-compatibility-instrument
Stage 0 = STAGE0-PASS
Stage 0 deterministic core SHA256 = 3579d3bc7f4c15495b5ba75b6c69edeba9caf84f24b7d541fa4b6fe14ca207e0
engine blob = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
AI technical reference blob = ac2b4fd66a2555c50a362c39a828515323bba18a
Stage 1 compatibility spec blob = d680c45943ceb81729e91ed230689b27b0752d17
fresh compatibility seed access before authorization = 0
formal effect generation before authorization = 0
```

`main`はG4-01開始時に固定したbaselineから変化しておらず、research branch上の`public/engine.js`と`public/ai.js`もStudy contractに固定したblob SHAと一致している。

## Stage 0 gateの確認

Stage 0では全必須checkがPASSした。特にG3-12でStage 1を停止させたroot legal width 1のcompatibility gapについて、reachable singleton rootをtechnical fixtureから得て、compatibility wrapperがhelper呼出し前に`ROOT-LEGAL-WIDTH-LT2`として遮断することを確認した。

同じsingleton rootを既存helperへ直接渡すnegative controlでは、production側`complete root ranking required`、independent側`ranking requires >=2 moves`が再現された。したがって、G3-12 failure modeを隠すのではなく、そのpreconditionをfresh populationへ進む前に明示的に分類できる状態になっている。

Stage 0のresource使用量も固定ceiling内だった。

## fresh evidence境界

Stage 1が使用できるseedは、Study開始時から予約されていた次のblockだけである。

```text
SFCDF = 40111001..40111384 / 384
SILGM = 40112001..40112768 / 768
GCLD = 40113001..40113384 / 384
maximum total reads = 1536
```

G3-12のStage 1 consumed seed、Stage 2 unread seed、selected root、partial measurementをStage 1へ流用しない。G3-11 depth 10を再実行せず、G4-10 depth 11へアクセスしない。

## Stage 1 execution contractの固定

fresh seed access前に[`STAGE_1_COMPATIBILITY_SPEC.json`](../local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1_COMPATIBILITY_SPEC.json)を固定した。

このspecは少なくとも次を結果を見る前に固定している。

- seedからsource policyへの割当
- SILGMのroot family・phase割当
- SFCDF / SILGM / GCLDのeligibility条件
- minimum support
- selection order
- selected measurement count
- production / independent exact一致要件
- active depth-5 preflight ceiling
- Stage 1全体のresource ceiling
- local reproducible execution route
- study-level decision mapping
- no-rescue rule

この固定によって、fresh evidence確認後に都合のよいroot、cell、seed、support thresholdを選ぶ余地を残さない。

## 実行経路

Stage 1のscientific executionは再現可能なlocal runとして行う。GitHub ActionsはStage 1のfresh scientific executionには使用しない。

理由は、第四世代共通contractがheavy generationをGitHub Actionsへ依存させないことを要求しており、Stage 1は最大1536 seedを読み、複数のdepth-5 measurementを行うためである。

## Stage 1で許可される出力

許可するのはcompatibilityに必要な次の情報だけである。

- source / root availabilityとrejection reason
- policy / family / phase / width-class support
- bounded preflight status
- production / independent exact agreement
- helper estimability / singleton classification
- resource telemetry
- familyごとの`COMPATIBLE`または`NON-ESTIMABLE`
- Study全体の`COMPATIBILITY-ELIGIBLE-ALL`、`COMPATIBILITY-ELIGIBLE-PARTIAL`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`

## 引き続き禁止すること

- effect directionまたはeffect magnitudeの計算
- p-value生成
- generalization / counterexample decision
- upstream G3 claimの確認・否定
- seed extensionまたはreplacement
- root replacement
- source policy / root family replacement
- support threshold relaxation
- helper precondition relaxation
- favorable subgroup rescue
- resource ceilingの結果確認後引上げ
- G3-12 evidence reuse
- G3-11 depth 10 rerun
- G4-10 depth 11 access
- public AI変更
- G4-02以降の自動開始

## 結論

Stage 0でtechnical readinessとG3-12 failure guardが成立し、Stage 1のfresh compatibility population・selection・resource contractをscientific access前に完全固定できた。したがって、`LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`を**exactly one fresh compatibility execution**として承認する。
