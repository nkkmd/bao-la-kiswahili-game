# PBAI-P5 — 公開配信検証

状態: `PASS / VERIFIED-PUBLIC-ACTIVE / PROMOTED-AS-AI-GEN3`。

## 確認対象

| 項目 | 値 |
| --- | --- |
| 確認日 | 2026年9月7日 |
| 公開URL | `https://bao-la-kiswahili.cultivationdata.net/` |
| 配信元main | `650b4312ed9cd318d9981523533dd692bdce6125` |
| 候補 | `PBAI-C011-v1` |
| 公開範囲 | hard / expertの既定`bao`・`phase2`探索 |
| 公開対象外 | easy、normal、明示的`legacy`・`mcts`・`bao-v2` |
| 確認時点の公開AI系統 | `AI-GEN2` |
| 後続の正式release | `AI-GEN3-RELEASE-001` |

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

公開asset一致と初回運用確認のgateはPASSしたため、確認時点の公開状態を`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`とした。この単一観測を新しい速度比較や棋力比較には使わず、P5の事前固定試験結果を置き換えない。スマートフォン実機、複数ブラウザー、端末横断のメモリと速度、標準500ms対局棋力は未確認である。

この配信確認の完了後、2026年9月7日の明示的指示に基づいて正式判断`ADOPT`、release ID `AI-GEN3-RELEASE-001`、公開AI系統`AI-GEN3`への昇格を記録した。これは確認時点の観測値やasset hashを変更しない後続判断である。詳細は[AI-GEN3正式昇格判断](PROMOTION_DECISION.md)を参照する。

## AI-GEN3表示追加配信の確認

正式昇格後、PR #111をmainへ統合し、main `e6a3936ee6285d606be83987b5ae3aa2ee61ec25`の`public/`を手動でCloudflareへ配信した。Cloudflareのprovider deployment IDは取得していないため記録しない。

cache-busting queryを付けた公開URLをクラウド上のChrome相当環境で新規に読み込み、画面上の「AI · AI-GEN3」とtitle属性`AI-GEN3-RELEASE-001`を確認した。次の8 assetは公開byteのSHA-256が[release manifest](releases/AI-GEN3-RELEASE-001.json)と完全一致した。

| asset | 公開SHA-256 | 判定 |
| --- | --- | --- |
| `public/engine.js` | `2c5d245d731bbfd682eec7a0bbd8324c680ad6fbabd567286752d61b985d1bd3` | PASS |
| `public/ai.js` | `aa894e0f34f5545488073a0706743b6ba373a1349152da8f8fc6c18ea74d1498` | PASS |
| `public/ai-weights.js` | `7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8` | PASS |
| `public/ai-config.js` | `ddeed4493a07bbdad8cfbfba048e44a86fed62958bbb83afe494372e534671bc` | PASS |
| `public/ai-worker.js` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` | PASS |
| `public/main.js` | `81651055bef7c1f9037d3c8fa83216976139fb25c4054433cde2529ec8d0484f` | PASS |
| `public/style.css` | `9e769acb665fa6163a1f08507c7cef83325e7123a37649637c40f224b7ee0ce7` | PASS |
| `public/service-worker.js` | `7484699249e58022a009b49b85d7efbe02f0682192abdab6c3e17228d014c087` | PASS |

`public/index.html`はブラウザーのraw source取得制約により、この確認経路ではbyte hashを再計算していない。ただし、公開DOMで新規要素`ai-generation-badge`、表示文字列「AI · AI-GEN3」、title属性`AI-GEN3-RELEASE-001`を確認し、同じ表示を制御する`public/main.js`と`public/style.css`は上表のとおり完全一致した。この区別を保ち、9 assetすべてをbyte一致したとは記録しない。

「むずかしい」、人間を後手のNORTHとして対局を開始し、SOUTHのAI初手と播種アニメーションが完了して、状態表示が「NORTH（あなた）の手番。選べる穴を選んでください」へ遷移した。

| 観測項目 | 値 |
| --- | --- |
| 探索深度 | 7 |
| 経過時間 | 505.6ms |
| 探索ノード | 9,675 |
| timeout表示 | true |
| サイト由来console error | 0 |

ブラウザー拡張由来のerrorはサイト由来errorへ数えていない。2人対戦への切り替え操作はブラウザー接続のtimeoutにより直接確認を完了できなかった。一方、公開`public/main.js`のbyte一致とPR #111の`diagnostics-ui.test.js`成功により、コンピュータ対戦だけで世代表示を出す実装の同一性は確認している。この未完了操作をスマートフォン実機や複数ブラウザーでの確認済みへ読み替えない。

以上から、AI-GEN3の公開表示、release ID、PWA cache v26、採用済みAIの通常ブラウザー経路は公開環境で確認できた。昇格表示の配信状態を`VERIFIED-PUBLIC-ACTIVE`とする。この確認は新しい速度比較・棋力比較ではなく、P5の既存結果や適用範囲を変更しない。

問題が確認された場合は、hard/expertのfeature flagをfalseへ戻し、service workerのcache名をv25より先へ更新したmainの`public/`を再配信する。科学的結果とP4のHOLDはrollbackの有無で変更しない。
