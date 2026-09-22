# JEV-BAO-DIRECT-POLICY-20260922-v1 — Pilot Result

更新日: 2026年9月22日

## 状態

`PILOT-COMPLETE / TECHNICAL-AUDIT-PASS / FORMAL-NOT-AUTHORIZED`

この文書は、前回Jev比較と同じローカルPCで実行された有料pilot 4局のrunner出力と、その後のローカル再生監査結果を記録する。raw request / response / game / ledgerはGit管理外のローカル結果領域に保持されている。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## 実行結果

runner最終status:

```text
PILOT-COMPLETE
```

4局すべてengine terminalまで完走し、technical pauseは0件だった。

| Game | Opening | Jev player | Winner | Plies |
|---|---|---:|---:|---:|
| `direct-v1-pilot-pair-0-game-0` | `pilot-opening-00` | 0 | 1 | 20 |
| `direct-v1-pilot-pair-0-game-1` | `pilot-opening-00` | 1 | 0 | 27 |
| `direct-v1-pilot-pair-1-game-0` | `pilot-opening-01` | 1 | 0 | 5 |
| `direct-v1-pilot-pair-1-game-1` | `pilot-opening-01` | 0 | 1 | 22 |

集計:

- terminal games: 4 / 4
- Jev Direct Policy wins: 0
- AI-GEN4 wins: 4
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 2
- split 1-1 pairs: 0
- directional pairs: 2
- two-sided exact sign-test p-value: 0.5

この4局pilotはtechnical validation用であり、formal 64局のprimary inferenceには含めない。4-0というpilot結果のみから棋力差を正式判定しない。

## 費用

- paid requests: 23
- pilot reported usage: USD `0.002129904`
- estimated and reserved: USD `0.002129904`
- uncertain reserved: USD `0`
- pilot ceiling: USD `0.10`
- overall ceiling: USD `1.00`
- ledger halted: false

pilot使用額はpilot上限の約2.13%であり、費用gate違反はない。

## 再生監査

pilot完走後、同じローカルPCで次を実行した。

```bash
node tools/jev-direct-policy/run.cjs verify
```

verify最終status:

```text
VERIFIED
```

保存済み全gameをopeningから再生し、各Jev着手のrequest / saved response / response digest / candidate ID / candidate-set hash / selected move / after-state、および費用台帳chain・runtime manifest・protocol/openings/spec bindingを再照合した。保存済みpilot結果との不整合は検出されなかった。

詳細監査記録:

```text
doc/ai-engineering/jev-direct-policy-comparison/PILOT_TECHNICAL_AUDIT.md
```

## 次gate

pilot技術監査はPASSしたため、formal 32 openings / 64 gamesを実行するための技術条件は満たした。

ただしformal 64局は自動認可しない。ユーザーからformal開始の明示指示を受けた場合にのみ、直前のTypeSafe公式仕様再確認、freeze整合性確認、formal専用ローカルauthorizationへの切替を行う。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。pilot・formalの結果にかかわらず、このStudyだけを根拠に公開AI採用、AI-GEN4置換、AI世代変更、本番配信を行わない。
