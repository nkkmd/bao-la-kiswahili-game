# Jev Direct Policy × AI-GEN4 比較試験

- Study ID: **`JEV-BAO-DIRECT-POLICY-20260922-v1`**
- 状態: **`COMPLETED / CLOSED / AUDIT-PASS`**
- 正式判定: **`AI-GEN4-SUPERIOR`**
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- 実施branch: `experiment/jev-direct-policy-20260922`
- 比較対象: `AI-GEN4-RELEASE-001` expert standard / `PBAI-C015-v1`

## 目的

完了済み`JEV-BAO-STRENGTH-20260921-v1`とは独立したStudyとして、Jevを探索順序付けではなく最終着手の直接選択主体として用いた場合の対局成績を確認した。

今回のJev側は、Baoエンジンが合法手とexact after-stateを確定し、その合法集合からJevが最終着手を1つ選ぶ`Jev Direct Policy`である。Jev選択後にAI-GEN4探索が判断を上書きしない。

## 最終結果

formalはfresh 32 openings × side swap = 64 gamesを事前固定し、全64局をengine terminalまで完走した。

- Jev Direct Policy: 7勝
- AI-GEN4: 57勝
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 25
- split 1-1 pairs: 7
- incomplete pairs: 0
- directional pairs: 25
- two-sided exact paired sign-test p-value: `5.960464477539063e-8`
- alpha: 0.05

25 directional pairsすべてがAI-GEN4方向だったため、固定protocolにおける正式判定は **`AI-GEN4-SUPERIOR`**。

formal完走後とopening定義固定後に `run.cjs verify` を実行し、最終status `VERIFIED` を確認した。technical auditとclosure auditはいずれも`PASS`。

## 解釈の限定

この結論は今回固定した `jev-1.13.0`、prompt、candidate表現、exact after-state入力、Direct Policy方式に限定する。

Jev一般の能力、別model version、別prompt、別の探索統合方式へ一般化しない。またAI-GEN4は1手2,000ms、JevはAPI応答完了まで待つ設計であり、compute-equal comparisonではない。

## 比較条件

AI-GEN4:

- max depth: 12
- time limit: 2,000 ms / move
- evaluator: `PBAI-C015-v1`
- release: `AI-GEN4-RELEASE-001`

Jev Direct Policy:

- model: `jev-1.13.0`
- Bao engineが合法variantとexact after-stateを完全に管理
- Jevが合法候補から最終着手を直接選択
- downstream AI-GEN4 search overrideなし
- forced single legal moveはAPI bypass
- communication watchdog 5分

## Formal設計

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

Primary analysisはopening pair単位の2-0対0-2に対するtwo-sided exact binomial sign testとした。1-1 pairは記述的に残すが方向情報を与えない。

## Technical pauses

formal中に3件のretryable `invalid-response` が発生した。各件で保存attempt-1をオフライン監査し、minimum retry wait経過後に同一logical moveのattempt-2を1回だけ明示認可した。3件ともattempt-2で回復し、attempt-3は行っていない。

## 費用

- cumulative paid requests: 413
- cumulative reported usage: USD `0.036509592`
- pilot: USD `0.002129904`
- formal: USD `0.034379688`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`

費用gate違反はなかった。

## Opening archive / closure

実対局で使用した生成opening定義はcommit `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`で専用branchへ固定済み。

- `tools/jev-direct-policy/design/openings.json`
- `tools/jev-direct-policy/design/opening-verification.json`

固定後に再度 `run.cjs verify` を実行し、`openingsHash = 65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882` とspec bindingが不変であることを確認した。`CLOSURE_AUDIT.md`も`PASS / COMPLETED / CLOSED`。

## 前回Studyとの分離

`JEV-BAO-STRENGTH-20260921-v1`ではJevをroot move orderingにのみ利用し、formal 64局は32勝32敗、全32 pairが1-1で`INCONCLUSIVE`だった。

今回のDirect Policy Studyはfresh opening集合と異なるJev役割を用いており、前回Studyの生データ・台帳・formal結果は変更・合算していない。


## 事後的な追加局面解析（2026年9月23日）

保存棋譜の追加解析では、1勝1敗だった7つの開幕すべてについて開始局面の強制勝敗を証明した。また、AI-GEN4が敗れた7局の全41判断局面で、着手前から相手の強制勝ちが成立していた。直後の負けを許す手を静的評価が高く採点する局面もあったが、保存棋譜の該当59局面ではAI-GEN4は危険な手を選ばなかった。方法、手数上限、訂正点および一般化できない範囲は[`POSTHOC_POSITION_ANALYSIS_20260923.md`](POSTHOC_POSITION_ANALYSIS_20260923.md)に記録する。

この事後解析はformalの主要評価や正式判定を変更しない。公開AIへの採用も行わない。

同じ開幕05のside swap対局では、AI-GEN4が5手以内の強制勝ちとなる初手で5手勝ち、Jevは別の初手から24手で敗れた。Jevの選んだ初手の後の強制勝敗は未確定である。formal全体では、相手の次手での敗北を避ける合法手があるのにJevがその敗北を許す手を選んだ局面が97件中31件あり、AI-GEN4は同種の59件中0件だった。局面群が異なるため同条件の棋力差や勝てた対局数には換算しない。

## 最終文書

- [`FINAL_REPORT.md`](FINAL_REPORT.md) — formal結論と解釈範囲
- [`POSTHOC_POSITION_ANALYSIS_20260923.md`](POSTHOC_POSITION_ANALYSIS_20260923.md) — 完了後の局面解析と限界
- [`FORMAL_RESULT.md`](FORMAL_RESULT.md) — audited formal結果
- [`FORMAL_TECHNICAL_AUDIT.md`](FORMAL_TECHNICAL_AUDIT.md) — 最終技術監査
- [`CLOSURE_AUDIT.md`](CLOSURE_AUDIT.md) — opening archiveを含むclosure監査
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在状態
- authorization / pause / resume記録 — 実行gateとtechnical retry履歴
- pilot result / audit — pilot記録

## 非採用方針

**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`**

本Studyは比較・記録のみを目的とし、結果からJevの公開AI採用、AI-GEN4置換、AI世代変更、`public/`組込み、本番配信へ直接進まない。

将来別方式を検証する場合は、新しい独立Studyとして扱う。
