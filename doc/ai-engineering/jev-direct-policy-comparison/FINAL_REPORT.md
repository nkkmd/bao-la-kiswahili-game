# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 最終報告

- 記録日: 2026年9月22日
- 費用管理ID: `JEV-BAO-DIRECT-20260922`
- 実施状態: **`COMPLETED / CLOSED`**
- 技術監査: **`AUDIT-PASS`**
- 正式判定: **`AI-GEN4-SUPERIOR`**

## 1. 結論

Jev Direct Policyと現行AI-GEN4 expert standardを、事前固定した32 fresh openings × side swap = 64 gamesで比較した。

formal 64局はすべてengine terminalまで完走し、Jev Direct Policy 7勝、AI-GEN4 57勝だった。pair単位では、Jevの2勝0敗が0 pair、AI-GEN4の2勝0敗が25 pair、1勝1敗が7 pairだった。

事前固定したprimary statisticであるtwo-sided exact binomial sign testでは、directional pair 25件がすべてAI-GEN4側となり、p値は `5.960464477539063e-8` だった。有意水準0.05を下回るため、本Studyの固定条件における正式判定を **`AI-GEN4-SUPERIOR`** とする。

この結論は「今回のJev Direct Policy設計に対して、AI-GEN4 expert standardの対局成績が有意に良かった」という意味である。Jev一般の能力、別model version、別prompt、別candidate表現、探索との別統合方式には一般化しない。

## 2. 比較対象

### AI-GEN4

- release: `AI-GEN4-RELEASE-001`
- expert standard tier
- evaluator: `PBAI-C015-v1`
- max depth: 12
- time limit: 2,000 ms / move

### Jev Direct Policy

- model: `jev-1.13.0`
- Bao engineがrules / legal variants / capture / sowing / relay / nyumba / phase / exact after-state / terminal判定を権威的に処理
- Jevには合法候補とexact after-state等を提示
- Jevが合法候補から最終着手を直接1つ選択
- Jev選択後のAI-GEN4 search overrideなし
- forced single legal moveはAPI bypass
- Jevには棋力上の2秒制限を設けず、API応答完了まで待つ
- 5分watchdogは通信異常検出用で、棋力上の持ち時間ではない

したがって本Studyはcompute-equal comparisonではない。

## 3. 固定したformal設計

- 32 fresh openings
- side swapにより64 games
- Namua 16 openings / Mtaji 16 openings
- first-game Jev player: player0 16 / player1 16
- opening replacementなし
- sample extensionなし
- adaptive extensionなし
- early stopping / optional stoppingなし
- technical failureを敗北に変換しない
- pilot 4局はprimary inferenceへ含めない
- 全64局がterminalで完了した場合だけformal判定を確定

Primary analysisは、各openingの2局を1 pairとし、2-0 pairだけを方向付き観測として扱うtwo-sided exact binomial sign test、alpha 0.05とした。

## 4. Formal結果

| 項目 | 結果 |
| --- | ---: |
| planned games | 64 |
| terminal games | 64 |
| Jev Direct Policy wins | 7 |
| AI-GEN4 wins | 57 |
| Jev 2-0 pairs | 0 |
| AI-GEN4 2-0 pairs | 25 |
| split 1-1 pairs | 7 |
| incomplete pairs | 0 |
| directional pairs | 25 |
| two-sided exact p-value | `5.960464477539063e-8` |
| formal plies | 1,029 |

25 directional pairsすべてがAI-GEN4方向だった。exact sign testの値は `2 × (1/2)^25 = 5.960464477539063e-8` と一致する。

raw game win rateはAI-GEN4 57/64、Jev Direct Policy 7/64である。ただし正式判定は事前指定どおりpair-based statisticを主とする。

## 5. Pilot

pilotはfresh 2 openings × side swap = 4 gamesで実施した。

- Jev Direct Policy: 0勝
- AI-GEN4: 4勝
- AI-GEN4 2-0 pairs: 2
- p-value: 0.5
- pilot plies: 74

pilotはtechnical validation用であり、formal primary inferenceには合算していない。

## 6. Technical pauses / retry

formal中に3回のretryable technical pauseが発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

いずれもHTTP 200応答だったがstrict validatorを満たさず `invalid-response / retryable: true` と判定された。

各pauseでは、API keyを外した状態で保存attempt-1、request hash、usage、ledger bindingを監査し、`run.cjs verify = VERIFIED` とminimum retry wait経過を確認した後だけ、同一logical moveのattempt-2を1回認可した。3件ともattempt-2で回復し、attempt-3は行っていない。

この処理に伴うopening replacementや追加sampleはない。

## 7. 最終技術監査

formal完走後、API keyを外した状態で最終 `run.cjs verify` を実行し、`VERIFIED` を確認した。

- verify timestamp: `2026-09-22T14:51:53.367Z`
- pilot + formal: 68 games
- total plies: 1,103
- formal: 64 / 64 terminal
- pilot: 4 / 4 terminal
- ledger halted: false
- uncertain reserved: USD `0`

保存gameをopeningから再生し、Jev着手のrequest / saved response / response digest / candidate ID / candidate-set hash / selected move / exact after-state、および費用台帳chain・runtime manifest・protocol/openings/spec bindingを再照合し、不整合は検出されなかった。

技術監査判定は **`AUDIT-PASS`** とする。

詳細は `FORMAL_TECHNICAL_AUDIT.md` に記録する。

## 8. 費用

| 項目 | USD |
| --- | ---: |
| 累積reported usage | `0.036509592` |
| pilot stage | `0.002129904` |
| formal stage | `0.034379688` |
| uncertain reserved | `0` |
| overall hard limit | `1.00` |
| formal hard limit | `0.75` |

累積paid requestsは413、pilotは23、formalは390だった。費用gate違反はない。

API reported usageは提供元の最終請求額確定を意味しない。

## 9. 前回Jev比較との区別

完了済み`JEV-BAO-STRENGTH-20260921-v1`では、Jevをroot move orderingにだけ用い、最終着手はAI-GEN4探索が決定した。そのStudyのformal 64局は32勝32敗、全32 pairが1-1で、正式判定は`INCONCLUSIVE`だった。

今回のStudyではJevに最終合法手の決定を直接委ね、AI-GEN4によるdownstream overrideを禁止した。その条件ではAI-GEN4が25 directional pairsすべてを2-0で制した。

ただし両Studyはfresh opening集合やJevの役割が異なるため、Study間の差をそのまま単一要因の因果効果量として扱わない。今回確認できるのは、固定したDirect Policy方式が現行AI-GEN4より弱かったという点である。

## 10. 解釈の範囲

本結果から支持されるのは以下である。

- Baoエンジンが合法候補とexact after-stateを保証し、`jev-1.13.0`が提示候補から最終手を直接選ぶ今回のDirect Policy方式は、固定formal条件でAI-GEN4 expert standardより低い対局成績だった。
- pair-based primary testでも差は有意だった。
- Jevへ最終判断を広く委譲すること自体が、少なくとも今回の入力形式・prompt・model versionではAI-GEN4の探索を置き換える改善にならなかった。

一方、以下は本Studyからは結論しない。

- Jev一般がBaoに利用価値を持たないこと
- Jevの別model versionや別promptでも同じ結果になること
- Jevを探索評価・枝刈り・局面要約・戦略補助へ使う方式の性能
- AI-GEN4とJevの計算資源が同等であること
- 57対7のraw scoreを他opening分布へそのまま一般化できること

## 11. 非採用判断

事前固定した **`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`** を適用する。

このStudyは比較・記録のみであり、結果から次へ進まない。

- Jevの公開AIへの採用
- AI-GEN4の置換
- AI世代変更
- `public/`へのJev API組込み
- 本番配信

また、今回の結果はJev Direct Policy採用を支持する結果でもない。将来別方式を検証する場合は、別Studyとして新たなprotocol・予算・認可を必要とする。

## 12. 仕様識別

```json
{
  "studyId": "JEV-BAO-DIRECT-POLICY-20260922-v1",
  "baselineCommit": "4d072cb862864f25d6ae74363040c8f4a772d8ee",
  "protocolHash": "90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81",
  "openingsHash": "65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882",
  "runtimeManifestHash": "e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154",
  "specHash": "8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85"
}
```
