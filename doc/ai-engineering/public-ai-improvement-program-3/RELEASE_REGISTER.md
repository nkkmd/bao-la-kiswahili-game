# `PBAI-P3` — 公開判断・リリース台帳

Program: `PBAI-P3`

状態: **`COMPLETE / NO RELEASE / KEEP-AI-GEN2`**

この台帳は、supportに関する工学判断とは別に、公開製品・系統・配備の判断を記録します。candidateのsupport結果は[`DECISION_REGISTER.md`](DECISION_REGISTER.md)と[`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)を参照してください。

## 1. 公開系統の最終状態

```text
public lineage before PBAI-P3 = AI-GEN2
public lineage after PBAI-P3 = AI-GEN2
baseline = AI-GEN2-BASELINE-2026-09-05-v1
formal ADOPT decisions = 0
AI-GEN3 = RESERVED / NOT-PROMOTED
```

`AI-GEN3`は、formal `ADOPT`に加えて公開defaultへの実配備が完了した場合だけ付与される予約名です。`PBAI-P3`ではcandidateを実装しておらず、この条件を満たしていません。

## 2. リポジトリ上の公開source identity

開始時に固定した8件の公開用sourceは、すべてPBAI-P2 baselineとbyte-identicalでした。正確なGit blobとSHA-256は[`BASELINE_SPEC.md`](BASELINE_SPEC.md)および[`baselines/AI-GEN2-BASELINE-2026-09-05-v1.json`](baselines/AI-GEN2-BASELINE-2026-09-05-v1.json)を正本とします。

| 公開surface | SHA-256 |
| --- | --- |
| `public/engine.js` | `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` |
| `public/ai.js` | `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` |
| `public/ai-weights.js` | `7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8` |
| `public/ai-config.js` | `10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75` |
| `public/ai-worker.js` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` |
| `public/main.js` | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` |
| `public/index.html` | `e96eb85b535886290eedff869d775fb06d2a71ab263a0badf100a3a5595afd32` |
| `public/service-worker.js` | `6049176f0137d07a199023751e176bcdfc323be9a75da664290b728066171f83` |

## 3. Candidateと公開変更の状態

```text
PBAI-C010-v1 = CLOSED-WITHOUT-IMPLEMENTATION
candidate source created = false
public AI source changed by PBAI-P3 = false
public default changed by PBAI-P3 = false
PWA cache migration required by PBAI-P3 = false
rollback execution required by PBAI-P3 = false
```

candidate実装が存在しないため、feature-on版、release candidate、保存データmigration、candidate用rollback targetは作成していません。未実行をnegative benchmark resultとして解釈しません。

## 4. Validation、holdout、配備

```text
development benchmark executions = 0
validation executions = 0
release holdout executions = 0
release candidates = 0
public deployments caused by PBAI-P3 = 0
main integrations caused by PBAI-P3 = 0
generation promotion = NONE
```

development、validation、release holdoutのseedは未アクセスです。公開変更、deployment、`main`統合は実行していません。

## 5. 公開配備identityの観測限界

公開先はCloudflare Pages、文書上のsource targetは`main/public/`です。一方、provider deployment IDと配信中assetのbyte identityはrepositoryまたは利用可能なGitHub metadataから独立確認できませんでした。

```text
provider deployment ID = UNAVAILABLE / NOT INVENTED
repository public source identity = VERIFIED
live deployment byte identity = NOT INDEPENDENTLY VERIFIED
PBAI-P3 candidate deployment occurred = false
```

この空白は不一致の確認を意味しません。また、`PBAI-P3`由来のcandidate配備が行われた可能性を示すものでもありません。将来の正式な公開変更では、live identityを独立確認するか、未解決ならfail-closedとします。

## 6. 最終公開判断

```text
PBAI-P3 public release = NONE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

これはpublic-product decisionです。Research Generation 3のformal conclusionや、未実行のscientific benchmarkを代替する判断ではありません。
