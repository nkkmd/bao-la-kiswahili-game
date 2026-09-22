# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Pause 001

更新日: 2026年9月22日

## 状態

**FORMAL-PAUSED / RETRYABLE-INVALID-RESPONSE / RESUME-NOT-YET-AUTHORIZED**

formal 32 fresh openings / 64 gamesの実行中、`direct-v1-formal-pair-11-game-0` のply 2でJev API応答がstrict validatorを満たさず、runnerは`API-PAUSED`で安全停止した。

この停止は技術停止であり、敗北として扱わない。opening replacement、sample extension、formal結果の早期確定は行わない。

## 停止時点

- formal terminal games: 36
- paused game: `direct-v1-formal-pair-11-game-0`
- paused ply: 2
- pause code: `API-PAUSED`
- API status: `invalid-response`
- retryNotBefore: `1790086596778`
- formal planned/created game records at stop: 37
- formal Jev wins among completed games: 5
- formal AI-GEN4 wins among completed games: 31
- completed paired openings: 18
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 13
- split pairs: 5
- incomplete pairs: 1

停止時点のtwo-sided exact sign-test値 `0.000244140625` は中間値であり、事前固定したno optional stopping / no early conclusion方針により正式推論には使用しない。formal primary inferenceは64局すべてが有効terminalで完了した場合のみ確定する。

## 費用

停止時累積:

- paid requests: 237
- cumulative reported usage: USD `0.020806002`
- formal stage usage: USD `0.018676098`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## Retry境界

固定runnerでは`invalid-response`をretryable technical statusとして扱う。同一logical moveについてautomatic retryは行わず、attempt 2は明示的な`resume formal --live`だけで許可される。最大2 paid attemptsの制約は維持する。

resume前に、API keyを外した状態でローカル`run.cjs verify`を実行し、既存36 terminal games、paused gameのcommitted moves、費用台帳chain、runtime/opening/spec bindingを再検証する。

retry wait経過とオフライン監査PASSを確認するまでresumeしない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。
