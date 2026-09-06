# PBAI-P5 — 公開リリース計画

状態: `FROZEN-BEFORE-STAGED-ACTIVATION`。この計画はP5の科学的結果を確認した後の公開作業を対象とし、測定条件や判定基準を変更しません。

## 現在の公開baseline

2026年9月6日に`https://bao-la-kiswahili.cultivationdata.net/`を実ブラウザーで読み込み、配信中の4 assetを取得しました。配信中の`engine.js`、`ai.js`、`ai-config.js`、`service-worker.js`は開始時main `548ccead3965fa98602d99c8b3e2a49fbeeed093`のbyteと一致しました。provider deployment IDは取得できないため発明しません。

| asset | 公開baseline SHA-256 |
| --- | --- |
| `public/engine.js` | `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` |
| `public/ai.js` | `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` |
| `public/ai-config.js` | `10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75` |
| `public/service-worker.js` | `6049176f0137d07a199023751e176bcdfc323be9a75da664290b728066171f83` |

公開sourceの同一性とCloudflare Pagesのprovider deployment IDは別事項として扱います。

## 配信予定asset

| asset | release candidate SHA-256 |
| --- | --- |
| `public/engine.js` | `2c5d245d731bbfd682eec7a0bbd8324c680ad6fbabd567286752d61b985d1bd3` |
| `public/ai.js` | `aa894e0f34f5545488073a0706743b6ba373a1349152da8f8fc6c18ea74d1498` |
| `public/ai-config.js` | `2c5122317a857aa6548d52803f25d20063fa5e80a41b50b8444458ba5861673b` |
| `public/service-worker.js` | `346a1b1451558518dc1162dce2e3582cafc56ac02d579a48c40cddd658f13f8f` |
| `public/ai-worker.js` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` |
| `public/main.js` | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` |

この表は公開前に固定する配信予定byteである。公開後は実際の配信byteを同じ方式で取得し、別に照合する。

## 変更順序

1. P4候補実装PR #107をmainへ統合する。
2. P5独立再検証・追加監査PR #108をmainへ統合する。
3. hard/expertの既定configとPWA cache更新を独立PRで統合する。
4. main HEADとGitHub Actionsを確認する。
5. 公開assetがmainのbyteへ切り替わるまで監視し、実ブラウザーで読み込みとWorker経路を確認する。
6. 配信が一致しない、または回帰がある場合は、flagを無効化してcacheを再更新するrollback PRを優先する。

## 停止条件

PR競合、必須Actions失敗、configがeasy/normalへ波及、詳細eventの変化、固定深度不一致、Worker回帰、配信asset不一致、ページの新規console errorのいずれかで公開作業を止める。時間測定や消費済みseedの再実行で問題を救済しない。

## 公開後に残す記録

main merge SHA、公開asset SHA-256、確認時刻、実ブラウザー種別、Worker対応、未確認端末、rollback targetを台帳へ追記する。スマートフォン実機の速度や標準500ms対局棋力は、今回確認できない限り未確認と明記する。
