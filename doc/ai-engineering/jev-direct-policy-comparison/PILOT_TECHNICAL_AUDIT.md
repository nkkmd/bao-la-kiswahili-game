# JEV-BAO-DIRECT-POLICY-20260922-v1 — Pilot Technical Audit

更新日: 2026年9月22日

## 判定

`PASS`

有料pilot 4局の完走後、同一ローカルPC・同一runtimeで `node tools/jev-direct-policy/run.cjs verify` を実行し、runnerが保存済み結果を再検証した。

verify最終status:

```text
VERIFIED
```

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## 再検証結果

- paid requests: 23
- reported usage: USD `0.002129904`
- uncertain reserved: USD `0`
- ledger halted: false
- pilot terminal games: 4 / 4
- technical pause: 0
- Jev Direct Policy wins: 0
- AI-GEN4 wins: 4
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 2
- split 1-1 pairs: 0
- directional pairs: 2
- exact two-sided sign-test p-value: `0.5`

runner verifyは保存済みgameをopeningから再生し、Jev着手についてrequest、saved response、response digest、candidate ID、candidate-set hash、selected move、after-stateを再照合する。また、append-only費用台帳chain、runtime manifest、protocol/openings/spec bindingも再検証する。

今回のverifyは`VERIFIED`で正常終了し、保存済みpilot結果との不整合は検出されなかった。

## Pilotの意味

この4局はtechnical validation用pilotであり、formal 64局のprimary statistical inferenceへ含めない。

AI-GEN4が4-0で完勝したことは観測事実として記録するが、pilot単独でJev Direct PolicyとAI-GEN4の棋力差を正式判定しない。

## Formal gate

pilot技術監査はPASSしたため、事前固定済みformal 32 openings / 64 gamesを実行するための技術条件は満たした。

ただしformal実行は自動認可しない。ユーザーによるformal開始の明示指示、直前のTypeSafe公式仕様再確認、formal専用ローカルauthorizationへの切替を別gateとして必要とする。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。pilot・formalの結果にかかわらず、このStudyだけを根拠に公開AI採用、AI-GEN4置換、AI世代変更、本番配信を行わない。
