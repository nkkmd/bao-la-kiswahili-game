# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 最終報告

- 記録日: 2026年9月22日
- 費用管理ID: `JEV-BAO-DIRECT-20260922`
- 実施状態: **`COMPLETED / CLOSED / AUDIT-PASS`**
- 正式判定: **`AI-GEN4-SUPERIOR`**

## 1. 結論

Jev Direct Policyと現行AI-GEN4 expert standardを、事前固定した32 fresh openings × side swap = 64 gamesで比較した。

formal 64局はすべてengine terminalまで完走し、Jev Direct Policy 7勝、AI-GEN4 57勝だった。pair単位ではJev 2勝0敗が0、AI-GEN4 2勝0敗が25、1勝1敗が7だった。

事前固定したprimary statisticであるtwo-sided exact binomial sign testでは、25 directional pairsすべてがAI-GEN4方向で、p値は `5.960464477539063e-8`。有意水準0.05を下回るため、本Studyの固定条件における正式判定を **`AI-GEN4-SUPERIOR`** とする。

この結論は今回のJev Direct Policy設計に限定する。Jev一般、別model version、別prompt、別candidate表現、別の探索統合方式には一般化しない。

## 2. 比較条件

AI-GEN4:

- `AI-GEN4-RELEASE-001`
- expert standard tier
- `PBAI-C015-v1`
- max depth 12
- 2,000 ms / move

Jev Direct Policy:

- model `jev-1.13.0`
- Bao engineがrules / legal variants / exact after-state / terminal等を権威的に処理
- Jevが合法候補から最終着手を直接1つ選択
- downstream AI-GEN4 search overrideなし
- forced single legal moveはAPI bypass
- Jevには棋力上の2秒制限を設けずAPI応答完了まで待つ
- 5分watchdogは通信異常検出用

したがって本Studyはcompute-equal comparisonではない。

## 3. Formal設計

- fresh 32 openings / 64 games
- Namua 16 / Mtaji 16
- 全openingでside swap
- first-game Jev player: player0 16 / player1 16
- opening replacementなし
- sample extensionなし
- adaptive extensionなし
- early stopping / optional stoppingなし
- technical failureを敗北へ変換しない
- pilot 4局はformal primary inferenceへ含めない
- 全64局terminal完了時だけformal判定を確定

Primary analysisは2-0対0-2のopening-pair方向に対するtwo-sided exact binomial sign test、alpha 0.05とした。

## 4. Formal確定結果

| 項目 | 結果 |
| --- | ---: |
| terminal games | 64 / 64 |
| Jev Direct Policy wins | 7 |
| AI-GEN4 wins | 57 |
| Jev 2-0 pairs | 0 |
| AI-GEN4 2-0 pairs | 25 |
| split 1-1 pairs | 7 |
| incomplete pairs | 0 |
| directional pairs | 25 |
| formal plies | 1,029 |
| two-sided exact p-value | `5.960464477539063e-8` |

25 directional pairsすべてがAI-GEN4方向であり、`2 × (1/2)^25 = 5.960464477539063e-8` と一致する。

raw game scoreは57対7だが、正式判定は事前指定どおりpair-based statisticを主とする。

## 5. Pilot

pilotは2 fresh openings × side swap = 4 games。

- Jev Direct Policy 0勝
- AI-GEN4 4勝
- AI-GEN4 2-0 pairs 2
- p-value 0.5
- pilot plies 74

pilotはtechnical validation用でformal primary inferenceへ合算していない。

## 6. Technical pauses

formal中に3回のretryable `invalid-response` が発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

各attempt-1をAPI keyなしで監査し、`run.cjs verify = VERIFIED`、request / response / usage / ledger binding、minimum retry waitを確認した後だけ、同一logical moveのattempt-2を1回認可した。3件ともattempt-2で回復し、attempt-3はない。

opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

## 7. 最終技術監査

formal完走後に `run.cjs verify` を実行して正式結果を確定し、さらに実使用opening定義をbranchへ固定した後にもAPI keyを外した状態で再verifyした。

最終closure verify:

- status: `VERIFIED`
- timestamp: `2026-09-22T15:01:20.844Z`
- total games: 68
- total plies: 1,103
- formal: 64 / 64 terminal
- pilot: 4 / 4 terminal
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

保存game、request / response、response digest、candidate ID / candidate-set hash、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。

technical auditは **`AUDIT-PASS`**。詳細は `FORMAL_TECHNICAL_AUDIT.md` と `CLOSURE_AUDIT.md` に記録する。

## 8. 費用

| 項目 | USD |
| --- | ---: |
| cumulative reported usage | `0.036509592` |
| pilot stage | `0.002129904` |
| formal stage | `0.034379688` |
| uncertain reserved | `0` |
| overall hard limit | `1.00` |
| formal hard limit | `0.75` |

累積paid requestsは413、pilot 23、formal 390。費用gate違反はない。

## 9. 前回Jev比較との区別

`JEV-BAO-STRENGTH-20260921-v1`ではJevをroot move orderingにだけ使用し、formal 64局は32勝32敗、全32 pairが1-1で`INCONCLUSIVE`だった。

今回のStudyではJevが最終合法手を直接決定し、AI-GEN4によるdownstream overrideを禁止した。その条件ではAI-GEN4が25 directional pairsすべてを2-0で制した。

ただし両Studyはfresh opening集合とJevの役割が異なるため、Study間差を単一要因の因果効果量として扱わない。

## 10. 解釈の範囲

本Studyから支持されるのは、今回固定した `jev-1.13.0` Direct Policy方式がAI-GEN4 expert standardより低い対局成績だったこと、pair-based primary testでも差が有意だったことである。

以下は結論しない。

- Jev一般がBaoに利用価値を持たないこと
- 別model versionや別promptでも同じ結果になること
- 探索評価・枝刈り・局面要約・戦略補助としてのJevの性能
- AI-GEN4とJevの計算資源が同等であること
- 57対7を他のopening分布へそのまま一般化できること

## 11. Opening archive / closure

closure前監査で、実試験に使用した生成opening定義がローカルのみに存在することを検出した。次の2ファイルを内容変更せずcommit `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`で専用branchへ固定した。

- `tools/jev-direct-policy/design/openings.json`
- `tools/jev-direct-policy/design/opening-verification.json`

`opening-verification.json`はNamua 16 / Mtaji 16、formal 32 pairs / 64 games、first-game Jev player 16 / 16、前Study opening 34件除外、固定openings hash一致を記録する。

固定後の再verifyも`VERIFIED`で、`openingsHash`と`specHash`は不変だった。`CLOSURE_AUDIT.md`は `PASS / COMPLETED / CLOSED`。これによりarchive closureは完了した。

## 12. 非採用判断

事前固定した **`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`** を適用する。

本StudyからJevの公開AI採用、AI-GEN4置換、AI世代変更、`public/`へのJev API組込み、本番配信へ直接進まない。

将来別方式を検証する場合は、別Studyとして新しいprotocol・予算・認可を必要とする。

## 13. 仕様識別

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
