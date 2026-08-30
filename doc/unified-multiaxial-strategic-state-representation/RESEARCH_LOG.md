# UMSSR-STUDY1 — 研究ログ

## 2026-08-30 — Study開始

remote `main` HEADが`495c9a993278ffab03a6d2cfe2c9a7093c559fd5`であることを確認し、G2-01〜G2-09と中央文書を監査した。

正式identity:

```text
Study = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

RAW identity、upstream eligibility vocabulary、scientific firewall、seed block、no-rescue ruleをscientific evidence生成前に固定した。

## 2026-08-30 — initial prospective freeze

```text
initial freeze commit = d5e5237a6678442cb5f0e72b3430b93e4526c1d4
pre-scientific tightening commit = 54cc0661d283f3740b9fd8f665730ed84eb01bcb
initial consistency audit commit = e3ff29277460d4d7e8529cef565448a6dfa3378d
```

## 2026-08-30 — Stage 0

Stage 0 source/specを`78de03fde8e286f65d1544ad585e9337dad240a0`でfreezeした。

accepted technical run:

```text
run = 33295423785
job = 99214144073
artifact id = 9727254008
result = STAGE0-TECHNICAL-PASS
mandatory gates = 14 / 14 PASS
scientific seed use = 0
```

Stage 0後もStage 1 / 2は自動authorizeしなかった。

## 2026-08-30 — Stage 1 pre-scientific freeze

Stage 1 population、40-feature dictionary、scaling、deterministic K-means、`K=2..6`、promotion criteria、Stage 2 validation contractをscientific outcome前に固定した。

```text
pre-scientific freeze commit = fbfa65e774fa6bd6a509fb0b3ee903a463a86f17
Stage 1 seeds = 29310001..29314096 / RESERVED-UNCONSUMED
Stage 2 seeds = 29410001..29418192 / RESERVED-UNCONSUMED
```

promotion criteria:

```text
minimum cluster support fraction >= 0.10
minimum mean silhouette >= 0.05
minimum five-fold assignment stability >= 0.80
```

## 2026-08-30 — Stage 1 tooling smoke

初回tooling smoke `33296234733`はproduction `graph()`の`const` counter incrementというimplementation defectで失敗した。scientific seedは未使用で、scientific contractを変更せず実装だけを修正した。

```text
repair commit = 622dfc79aee5915f520c75a23e4123caa74ea865
accepted smoke run = 33296341604
result = STAGE1-TOOLING-SMOKE-PASS
artifact id = 9727521248
artifact ZIP SHA-256 = 39120244bb238aee19e5181104c33d7551c5b4b6eb0b11156011efe6085febef
```

## 2026-08-30 — scientific runner / packaging preflight

consume-once runnerとartifact contractをsource-freezeした後、technical-only packaging preflightを実行した。

最初のsource-freezeは`b6550f9e79cb6f321500a432defd5c87f08867e8`だった。

Stage 1 authorization後の最初のscientific workflow `33296879050`は`toolingSmokeResultSha256` binding mismatchでconsume gate前に停止した。次のworkflow `33296962144`はrunnerの`bindings`未定義参照でconsume gate前に停止した。

```text
scientific seeds consumed in rejected attempts = false
scientific data generated in rejected attempts = false
```

runnerのpre-consumption記録参照だけを`bindings:binds`へ修正し、scientific contract、feature、K、threshold、populationを変更しなかった。

```text
repaired source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
repaired-source packaging preflight run = 33297055834
job = 99218441038
result = STAGE1-PACKAGING-PREFLIGHT-PASS
artifact id = 9727743959
artifact ZIP SHA-256 = cf9591b02dee0d1cb1ce2e6aeb674522259be7d6266d1ee30dd586b23febb3ed
```

## 2026-08-30 — Stage 1 final authorization

repaired sourceのpreflight PASS後、source-freezeの直接の子commitとしてfinal authorizationを固定した。

```text
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
Stage 1 seed before execution = RESERVED_UNCONSUMED
consume-once = true
same-block rerun = false
Stage 2 authorized = false
```

## 2026-08-30 — accepted Stage 1 scientific execution

```text
workflow run = 33297178656
job = 99218754656
conclusion = success
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
```

Stage 1 seed blockはaccepted runのconsume gateで`CONSUMED`となった。

population:

```text
generated games = 4096
unique trajectories = 4068
distinct opening prefixes = 3711
selected roots = 512
selected distinct opening prefixes = 504
active features = 40 / 40
```

scientific readinessとresource gateは全項目PASSした。production / independent verificationも`fullExact = true`だった。

## 2026-08-30 — representation decision

候補結果:

```text
K=2 support=0.142578125 silhouette=0.17337024701327378 stability=0.740234375 eligible=false
K=3 support=0.009765625 silhouette=0.18121647379388248 stability=0.744140625 eligible=false
K=4 support=0.0078125 silhouette=0.20576375120521176 stability=0.916015625 eligible=false
K=5 support=0.0078125 silhouette=0.18309611515099047 stability=0.822265625 eligible=false
K=6 support=0.001953125 silhouette=0.184310677873519 stability=0.69921875 eligible=false
```

eligible candidateは0だったため、事前固定したdecision mappingに従い:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
```

とした。

K=4はstabilityとsilhouetteを満たしたがminimum supportが0.10に達しなかった。結果後にsupport thresholdを緩和して採用しない。

## 2026-08-30 — Study closure

Stage 1でfrozen representationを得られなかったためStage 2 prerequisiteを満たさず、Stage 2をauthorize / executeしない。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
G2-11 candidate input from UMSSR-STUDY1 = NOT AUTHORIZED
```

同じStudy内でthreshold relaxation、K range変更、axis / feature replacement、Stage 1 rerun / extension、favorable subgroup、Stage 2 post-hoc authorizationによる救済を行わない。


## 2026-08-30 — final documentation taxonomy normalization

最終関連文書監査で、Stage 1 dispositionとStudy-level terminal tokenの表記混同を検出した。凍結protocol §13に従い、科学結果を変更せず次のように分離した。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NOT-AUTHORIZED-NOT-EXECUTED
```

accepted Stage 1 artifact、preregistration、seed、threshold、K結果は変更していない。
