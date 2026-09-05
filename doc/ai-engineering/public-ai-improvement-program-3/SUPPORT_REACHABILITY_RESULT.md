# `PBAI-C010-v1` — 実装前support / reachability監査結果

判定日: 2026-09-05

状態: **`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`**

Program Stage: `PBAI-P3-D`

実行元commit: `3015ca39346901de8172677383331e4965871b68`

## 1. 結論

凍結済みの`PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1`を1回だけ実行し、別実装で独立再構成しました。trigger、negative control、public budget reachability、技術完全性は必要数を満たしましたが、固定node reserve内で上位3手をすべて追加検証できたtrigger rootは23件にとどまりました。

```text
required probe-complete trigger roots = >= 96 total and >= 32 per phase
observed = 23 total / Namua 6 / Mtaji 17
decision = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
```

support gateはconjunctiveなので、他の条件を満たしていてもPASSにはなりません。seed追加、reserve拡張、threshold緩和、phase統合、候補改名による救済は行いません。`PBAI-C010-v1`は実装せず閉じます。

## 2. 主要件数

| 項目 | 凍結条件 | 観測値 | 判定 |
| --- | ---: | ---: | --- |
| unique trajectories | `>= 2048` | 3223 | PASS |
| selected roots / Namua | `>= 768` | 1808 | PASS |
| selected roots / Mtaji | `>= 768` | 1415 | PASS |
| D2/D3 complete / Namua | `>= 640` | 1808 | PASS |
| D2/D3 complete / Mtaji | `>= 640` | 1415 | PASS |
| eligible triggers / total | `>= 128` | 1164 | PASS |
| eligible triggers / Namua | `>= 48` | 731 | PASS |
| eligible triggers / Mtaji | `>= 48` | 433 | PASS |
| probe complete / total | `>= 96` | 23 | **FAIL** |
| probe complete / Namua | `>= 32` | 6 | **FAIL** |
| probe complete / Mtaji | `>= 32` | 17 | **FAIL** |
| high-width / no-churn control | `>= 64` | 336 | PASS |
| low-or-equal-width / churn control | `>= 64` | 660 | PASS |
| low-or-equal-width / no-churn control | `>= 64` | 1063 | PASS |
| public hard reachable / total | `>= 64` | 88 / 96 attempted | PASS |
| public hard reachable / Namua・Mtaji | each `>= 24` | 40・48 | PASS |
| public expert reachable / total | `>= 64` | 96 / 96 attempted | PASS |
| public expert reachable / Namua・Mtaji | each `>= 24` | 48・48 | PASS |
| technical failures | `= 0` | 0 | PASS |
| instrumentation semantic mismatches | `= 0` | 0 | PASS |
| independent row-classification mismatches | `= 0` | 0 | PASS |

1164 trigger rootsのうち1141件は固定reserveを使い切って未完了となり、23件だけが完了しました。これは候補の品質失敗を示すものではなく、凍結した介入形を評価可能なsupportが不足したという工学上の判定です。

## 3. 独立再構成

独立verifierはproduction runnerのtrigger、top-3、probe、gate集計実装をimportせず、phase割当、trajectory、RAW identity、score-free tie groupからのpreorder change、top-3、probeを再構成しました。

```text
source identity mismatches = 0
row classification mismatches = 0
probe mismatches = 0
aggregate matches production = true
verification passed = true
numeric root scores read by verifier = false
candidate benefit metrics read = false
```

production resultは独立検証前の状態を意図的に保持し、最終dispositionは`independent-verification.json`と本書で確定します。

`compact result`の`compact`は、numeric root score、tie groupの内部表現、全state payloadを保存対象から外したscore-redacted schemaを意味します。ファイルのbyte sizeが小さいことを保証する名称ではありません。凍結済みの`result.json`とartifact hashは変更していません。

## 4. 情報遮断

```text
candidate code used = false
candidate move selection performed = false
candidate benefit metrics observed = false
game outcome metric observed = false
development seeds accessed = false
validation seeds accessed = false
release holdout seeds accessed = false
D5 reference accessed = false
Research Generation 4 scientific evidence accessed = false
numeric root scores persisted = false
```

この結果はResearch Generation 3のformal conclusionを変更しません。ranking churnを誤手、人間の難しさ、勝率として解釈せず、higher-resource searchもground truthとして扱っていません。

## 5. 成果物identity

| 成果物 | SHA-256 |
| --- | --- |
| `environment.json` | `417eb8080583d31a7503dd2867163346d6f2bb0c78090f27e86edac7e22638da` |
| `full-trace.jsonl` | `39e5d1649808eb8aae631e2839b6d5706e8cfc6c0187debe8a73842e6942f373` |
| `result.json` | `582a7e23ccda6b195c73e48a4ee3360605a5ca035fd14d5b9f4cb69b77e138df` |
| `independent-verification.json` | `8a9aeee3165e4884b282416a41f07136aadcf02ad2f995980fdf879e139df4c7` |
| deterministic core | `3cfcdf6247958671306bdeac942233cbca92a87f73cb56b5a0a45587bd1a4952` |

成果物directory: [`../../../artifacts/pbai-p3/c010/predevelopment-support/`](../../../artifacts/pbai-p3/c010/predevelopment-support/)

## 6. 状態遷移

`PBAI-C010-v1`は`CLOSED-WITHOUT-IMPLEMENTATION`です。初期inventoryはこの1件だけで、outcome確認後の追加を禁止しているため、`PBAI-P3-E`以降へ進む候補はありません。Program outcomeは凍結済みmappingに従い`KEEP-AI-GEN2`です。

公開用source、公開default、deployment、`main`は変更していません。`AI-GEN3`は`RESERVED / NOT-PROMOTED`のままです。
