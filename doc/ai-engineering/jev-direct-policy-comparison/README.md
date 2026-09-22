# Jev Direct Policy × AI-GEN4 比較試験

- Study ID: **`JEV-BAO-DIRECT-POLICY-20260922-v1`**
- 状態: **AUTHORIZED FOR ISOLATED IMPLEMENTATION / LIVE NOT AUTHORIZED**
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- 実施branch: `experiment/jev-direct-policy-20260922`
- 比較対象: `AI-GEN4-RELEASE-001` expert standard / `PBAI-C015-v1`

## 目的

完了済み`JEV-BAO-STRENGTH-20260921-v1`とは独立したStudyとして、Jevを探索順序付けではなく最終着手の直接選択主体として用いた場合の対局成績を確認する。

今回のJev側は、Baoエンジンが合法手とexact after-stateを確定し、その合法集合からJevが最終着手を1つ選ぶ`Jev Direct Policy`である。Jev選択後にAI-GEN4探索が判断を上書きしない。

## 事前固定した非採用方針

本Studyは比較・記録のみを目的とする。結果にかかわらず、本Studyだけを根拠として次を行わない。

- Jevの公開AIへの正式採用
- AI-GEN4の置換
- AI世代の昇格・変更
- `public/`へのJev API組込み
- 本番配信

この境界は結果を見る前に固定する。将来の採用検討には別の独立した運用・費用・可用性・セキュリティ評価と新しい明示指示を必要とする。

## AI-GEN4条件

現行expertは端末tierにより探索条件が異なる。本Studyでは前回比較との連続性がある現行standard tierを固定する。

- max depth: 12
- time limit: 2,000 ms / move
- evaluator: `PBAI-C015-v1`
- release: `AI-GEN4-RELEASE-001`

これは同一計算資源比較ではない。Jevには棋力評価上の2秒制限を設けず、通常応答完了まで待つ。通信watchdogはサービス異常検出だけを目的とし、Jevの持ち時間として扱わない。

## 対局計画

第一候補を正式計画とする。

- pilot: fresh 2 openings × side swap = 4 games
- formal: fresh 32 openings × side swap = 64 games
- formal phase balance: namua 16 / mtaji 16
- side swap必須
- 結果を見たopening差替え禁止
- 標本追加・早期終了禁止
- 技術異常を勝敗へ変換しない

primary analysisはopening pairを単位とする2-0対0-2の両側exact sign testとする。1-1 pairは成績には残すが方向情報を与えない。

## 前回Studyとの分離

`JEV-BAO-STRENGTH-20260921-v1`は`COMPLETED / CLOSED`のarchiveである。前回のコード・記録・生データ・費用台帳・正式64局を変更または合算しない。

今回のfresh opening生成時も、少なくとも前回Studyで固定した34 openingを除外する。

## 実行環境

有料試験は前回と同じユーザーのローカル環境でだけ実行する。前回正式記録は次のとおり。

- Node.js `v24.6.0`
- Linux / WSL2 kernel `6.18.33.2-microsoft-standard-WSL2`
- Intel Core i5-8250U
- 8 logical CPUs
- 実施者記録: Ubuntu 24.04.1 LTS、約4GB RAM

paid pilot前のlocal preflightで再採取し、Node・platform・CPU・logical CPU等の意味ある差があれば停止して影響を評価する。

## API・費用

2026年9月22日に公式文書で`jev-1.13.0`、入力$0.042/M tokens、64k request、Choice最大255を確認した。ただしpaid pilot直前に必ず再確認し、versioned modelをpinする。

初期予算上限は$1.00とし、pilot $0.10、formal $0.75、残り$0.15をcontingencyとする。新Study専用のappend-only費用台帳を用い、前回台帳を変更しない。

## 現在のgate

現在認可されるのは専用branch上の実装、fresh opening生成、mock QA、local preflightまでである。有料Jev API呼出しはまだ認可しない。
