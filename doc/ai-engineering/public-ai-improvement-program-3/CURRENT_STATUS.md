# `PBAI-P3` — 現在の状態

更新日: 2026-09-05

Program: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

状態: **`INITIALIZED / PRE-CANDIDATE / KEEP-AI-GEN2`**

`PBAI-P3`はProgram初期化まで完了しています。Research Generation 3の証拠cutoffと`AI-GEN2` baselineを固定しましたが、candidate inventory以降は未承認です。

## 現在の正式状態

```text
PBAI-P3-A = COMPLETE / EVIDENCE CUTOFF FROZEN
PBAI-P3-B = COMPLETE / BASELINE FROZEN
PBAI-P3-C = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-D = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-E = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-F = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-G = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-H = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-I = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 0
candidate implementations = 0
benchmark executions = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

`KEEP-AI-GEN2`は現時点の公開状態を表し、PBAI-P3の最終判断ではありません。Program final outcome、`ADOPT`、`HOLD`、`REJECT`はまだ存在しません。

## 固定済みidentity

```text
Program ID = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
authorization decision = AUTHORIZED-FOR-PROGRAM-INITIALIZATION-ONLY
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baselineId = AI-GEN2-BASELINE-2026-09-05-v1
working branch = engineering/pbai-p3-program-initialization
```

`initialization main`と`scientific evidence cutoff`は異なる役割を持ちます。前者は開始時点の運用・source状態、後者はcandidate設計へ利用できる科学証拠の上限です。

## 公開AIの状態

`main/public/`の8 bound filesはPBAI-P2 baselineとbyte-identicalであり、repository上の公開用sourceは`AI-GEN2`です。candidate sourceは存在せず、公開defaultも変更していません。

公開endpointはCloudflare Pagesとして文書化されていますが、provider deployment IDと配信中assetのbyte identityをrepositoryまたはGitHub metadataだけから独立確認できませんでした。この観測上の空白は[`BASELINE_SPEC.md`](BASELINE_SPEC.md)へ記録し、公開判断前のfail-closed条件とします。

## 科学上の境界

- Research Generation 3のformal conclusionは不変です。
- PBAI-P3のengineering resultで過去Studyを再判定しません。
- higher-resource searchをground truth、engine scoreを勝率とみなしません。
- root widthやranking churnを人間の難しさと同一視しません。
- validated transform setは`[]`であり、未検証のsymmetry / canonicalizationを使用しません。
- `G3-12`からformal generalizationまたはcounterexample decisionを導きません。

## 次に許可できる最小工程

次の明示的認可がある場合に限り、`PBAI-P3-C`を開始できます。許可範囲は、結果を見ない状態での次の固定です。

1. initial candidate inventoryとcandidate ID
2. candidateごとのmechanism、trigger、介入、期待される因果経路
3. development、validation、protected release holdoutのfresh split
4. quality、safety、cost、compatibilityのglobal gate
5. negative control、独立再構成、rollback、feature-off equivalenceの要件
6. baseline-only support / reachability audit protocol

`PBAI-P3-C`の認可だけでは、support測定、candidate実装、benchmark実行を認可しません。固定後に停止し、`PBAI-P3-D`の実行認可を別に判断します。
