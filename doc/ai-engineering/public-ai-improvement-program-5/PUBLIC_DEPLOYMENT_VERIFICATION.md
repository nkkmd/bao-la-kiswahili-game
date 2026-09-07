# PBAI-P5 — 公開配信検証

状態: `PASS / STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`。

## 確認対象

| 項目 | 値 |
| --- | --- |
| 確認日 | 2026年9月7日 |
| 公開URL | `https://bao-la-kiswahili.cultivationdata.net/` |
| 配信元main | `650b4312ed9cd318d9981523533dd692bdce6125` |
| 候補 | `PBAI-C011-v1` |
| 公開範囲 | hard / expertの既定`bao`・`phase2`探索 |
| 公開対象外 | easy、normal、明示的`legacy`・`mcts`・`bao-v2` |
| 公開AI系統 | `AI-GEN2` |

PR #107で候補実装、PR #108で独立再検証と追加監査、PR #109でhard/expertの段階的有効化とPWA cache v25をmainへ統合した。PR #109の`PBAI-C011 staged release verification`と`PBAI-P5 completed evidence verification`は成功した。Cloudflareの配信操作は手動で行われた。provider deployment IDは取得していないため発明しない。

## 公開assetの一致

cache-busting queryを付けて公開URLから取得した6 assetをSHA-256で照合した。全件が[公開リリース計画](PUBLIC_RELEASE_PLAN.md)で固定した配信予定byteと一致した。

| asset | 公開SHA-256 | 判定 |
| --- | --- | --- |
| `public/engine.js` | `2c5d245d731bbfd682eec7a0bbd8324c680ad6fbabd567286752d61b985d1bd3` | PASS |
| `public/ai.js` | `aa894e0f34f5545488073a0706743b6ba373a1349152da8f8fc6c18ea74d1498` | PASS |
| `public/ai-config.js` | `2c5122317a857aa6548d52803f25d20063fa5e80a41b50b8444458ba5861673b` | PASS |
| `public/service-worker.js` | `346a1b1451558518dc1162dce2e3582cafc56ac02d579a48c40cddd658f13f8f` | PASS |
| `public/ai-worker.js` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` | PASS |
| `public/main.js` | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` | PASS |

公開`ai-config.js`ではhardとexpertだけが`pbaiC011LightweightTransitions: true`を受け取り、`service-worker.js`は`bao-la-kiswahili-v25`を使用していた。公開sourceの同一性とCloudflareのprovider内部状態は別事項として扱う。

## ブラウザー相当経路

公開URLをクラウド上のChrome相当環境で新規に読み込み、設定画面が正常に表示されることを確認した。難易度を「むずかしい」、人間を後手のNORTHに設定して開始し、SOUTHのAI初手が完了した。

| 観測項目 | 値 |
| --- | --- |
| 探索深度 | 7 |
| 経過時間 | 503.3ms |
| 探索ノード | 9,155 |
| timeout表示 | true |
| サイト由来console error | 0 |

`timeout: true`は500ms級の内部期限で探索を終了した診断であり、着手失敗やページ停止ではない。公開`ai-worker.js`のbyte一致、通常のブラウザー利用経路での着手完了、公開前CIにおける実`worker_threads`とVM/global scriptの回帰PASSを合わせて確認した。ただし、ブラウザー内部でWorkerが選択されたことを個別計測する新しいinstrumentationは追加していない。

## 判断と限界

公開asset一致と初回運用確認のgateはPASSしたため、公開状態を`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`とする。この単一観測を新しい速度比較や棋力比較には使わず、P5の事前固定試験結果を置き換えない。スマートフォン実機、複数ブラウザー、端末横断のメモリと速度、標準500ms対局棋力は未確認である。

正式な`ADOPT`、release ID発行、`AI-GEN3`昇格は行っていない。公開AI系統は`AI-GEN2`のままである。問題が確認された場合は、hard/expertのfeature flagをfalseへ戻し、service workerのcache名をv25より先へ更新したmainの`public/`を再配信する。科学的結果とP4のHOLDはrollbackの有無で変更しない。
