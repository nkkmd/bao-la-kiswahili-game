# `PBAI-P3` — 現在の状態

更新日: 2026-09-05

Program: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

状態: **`CONTRACT-FROZEN / PRE-SUPPORT / KEEP-AI-GEN2`**

`PBAI-P3`はprospective contract凍結まで完了しています。Research Generation 3の証拠cutoff、`AI-GEN2` baseline、1件のinitial candidate inventory、fresh split、global gate、baseline-only support protocolを固定しました。support実行以降は未承認です。

## 現在の正式状態

```text
PBAI-P3-A = COMPLETE / EVIDENCE CUTOFF FROZEN
PBAI-P3-B = COMPLETE / BASELINE FROZEN
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-E = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-F = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-G = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-H = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-I = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 1 / PBAI-C010-v1
candidate implementations = 0
support executions = 0
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
initial authorization decision = AUTHORIZED-FOR-PROGRAM-INITIALIZATION-ONLY
latest completed stage = PBAI-P3-C / CONTRACT FROZEN
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baselineId = AI-GEN2-BASELINE-2026-09-05-v1
working branch = engineering/pbai-p3-c-contract-freeze
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

## 凍結済み契約

```text
candidate inventory = PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1
candidate = PBAI-C010-v1 only
support spec = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
global gate = PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1
```

## 次に許可できる最小工程

次の明示的認可がある場合に限り、`PBAI-P3-D`として凍結済み[`SUPPORT_REACHABILITY_PROTOCOL.md`](SUPPORT_REACHABILITY_PROTOCOL.md)に従うbaseline-only auditを実行できます。

その認可はcandidate実装、development benchmark、validation、release holdoutを含みません。Support PASS後も停止し、`PBAI-P3-E`のcandidate-specific contract freezeとdevelopment authorizationを別に判断します。
