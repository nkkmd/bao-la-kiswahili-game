# `PBAI-P12` — 判断記録

更新日: 2026-09-17

## D-001 — 開始認可

判断: **`AUTHORIZED-FOR-BASELINE-MEASUREMENT`**

現行`AI-GEN4`に残るPVS再探索費用をdevelopment-onlyデータで測定し、support gateを通過した場合だけcandidate mechanismを固定することを認可した。

## D-002 — baseline support判定

判断: **`SUPPORT-PASS`**

固定depth 4で37局面（Namua 24 / Mtaji 13）を計測した。診断ON/OFFの探索結果は完全一致し、PVS scout 3,144回、full-window再探索260回、root再探索26/37局面を観測した。事前固定gateをすべて満たした。

## D-003 — candidate mechanismの事前固定

判断: **`PBAI-C016-v1 / FROZEN-BEFORE-CANDIDATE-DEVELOPMENT`**

rootの非principal candidateだけを対象に、1点幅PVS scoutを固定margin幅probeへ置き換える方式を固定した。margin候補は`16 / 32 / 64`、戦術安全条件、TTの`approx`扱い、development gate、margin選択規則をcandidate結果を見る前に固定した。

## D-004 — 固定深度development

判断: **`DEVELOPMENT-GATE-FAIL`**

| Margin | eligible node比 | 全体node比 | 再探索省略 | root move一致率 | Gate |
| ---: | ---: | ---: | ---: | ---: | --- |
| 16 | 1.01665 | 1.00635 | 3 | 98.80% | FAIL |
| 32 | 1.02148 | 1.00819 | 7 | 97.59% | FAIL |
| 64 | 1.03805 | 1.01450 | 8 | 97.59% | FAIL |

全marginでfeature flag OFF時はbaselineと一致し、全局面でdepth 4を完了した。一方、事前に要求したeligible node比`<= 0.97`を一つも満たさなかった。`Δ=64`は再探索省略8回の条件を満たしたが、probe費用によりeligible局面のnode数は約3.8%増えた。

## D-005 — Program最終判断

判断: **`COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`**

`PBAI-C016-v1`を不採用として閉じる。independent validation、release holdout、実機試験、公開Worker組込み、candidateの`public/`への統合、公開配信、release発行、AI世代昇格へは進まない。

今回否定されたのは、prospectiveに固定した`PBAI-C016-v1`の具体的なroot margin probe方式である。「十分良い手を基準にした選択探索」という上位概念全体を一般的に否定する結果とはしない。ただし、同じcandidateをthreshold変更や追加margin探索で救済しない。

## D-006 — 閉鎖記録のmain保存

判断: **`ARCHIVAL-MAIN-INTEGRATION / PR-147 / NO-PUBLIC-AI-CHANGE`**

2026年9月17日、ユーザーの明示指示に基づき、P12の閉鎖記録、再現用engineering tools/workflows、保存済み計測成果物をPR #147で`main`へ統合した。merge commitは`4e8af7dcf8a0cb995a6c231fd397e5c06b7af3c6`である。

この統合はProgramの履歴・再現性を保存するためのものであり、`PBAI-C016-v1`の採用判断を変更しない。`public/`のAIコード、公開release、AI世代、配信状態は変更しない。
