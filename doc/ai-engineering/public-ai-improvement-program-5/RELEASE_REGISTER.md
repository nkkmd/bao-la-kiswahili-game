# PBAI-P5 — 公開リリース台帳

状態: `ADOPTED / PROMOTED / AI-GEN3-RELEASE-001 / UI-DISCLOSURE-DEPLOYMENT-PENDING`。

## リリース対象

| 項目 | 値 |
| --- | --- |
| Program | `PBAI-P5` |
| Candidate | `PBAI-C011-v1` |
| 科学的判断 | `STRENGTH-IMPROVED-IN-FROZEN-DOMAIN` |
| 計算上の判断 | `EQUIVALENT-COMPUTATION-SPEEDUP` |
| 公開対象 | hard / expertの既定`bao`・`phase2`探索 |
| 公開対象外 | easy、normal、明示的`legacy`・`mcts`・`bao-v2` |
| ルール・評価・探索方式 | 変更なし |
| 正式判断 | `ADOPT` |
| Release ID | `AI-GEN3-RELEASE-001` |
| AI世代 | `AI-GEN2`から`AI-GEN3`へ昇格 |
| 公開source | main `650b4312ed9cd318d9981523533dd692bdce6125` |
| 公開URL | `https://bao-la-kiswahili.cultivationdata.net/` |

`public/ai-config.js`はhardとexpertの既定optionsへ`pbaiC011LightweightTransitions: true`を追加する。`public/ai.js`側の既存gateにより、既定のBao評価・phase2探索以外では軽量経路を使わない。`public/service-worker.js`はcacheを`bao-la-kiswahili-v25`へ更新し、旧assetの混在を避ける。

## 公開前と公開後のgate

公開前に、全Node test、候補の正確性・固定深度・VM/global script・実`worker_threads`回帰、hard/expertだけのconfig有効化、通常の詳細event維持を確認する。実サイト反映後に、配信assetのhash、ページ読み込み、Worker対応、console error、難易度optionsを実ブラウザーで確認する。

公開用PRでは専用の`PBAI-C011 staged release verification`を必須gateとして実行し、現行回帰、完了済みP5証拠の実行HEAD照合、配信予定asset hashをまとめて確認する。

完了済みの研究testには、当時の公開source hashとの一致自体を確認するものがあるため、現在sourceへ変更が入れば意図どおり停止する。これらを現行公開回帰として再実行せず、固定commit上の履歴証拠として扱う。公開前gateは上記の現行engine・AI・config・Worker・候補境界testを対象とする。P5の証拠監査も、測定時sourceは実行HEADから復元して照合し、公開configだけを測定時と同じに戻さない。

P5準備workflowは科学run開始前の専用branchだけで動くよう制限する。完了後の公開config変更やmanual dispatchで、使用済みseed向けpreflightを再実行しない。保存済み証拠の検算はP5完了証拠workflowを使う。

この段階的反映は正式な`ADOPT`または`AI-GEN3`昇格を先取りしない。配信確認に失敗した場合は、feature flagをfalseへ戻し、PWA cacheを再更新する。科学的結果はrollbackの成否によって変更しない。

## 公開結果

PR #107、#108、#109を依存順にmainへ統合した。PR #109のmain SHAは`650b4312ed9cd318d9981523533dd692bdce6125`で、専用の段階的公開検証とP5完了証拠検証は成功した。2026年9月7日、手動Cloudflare配信後に6 assetのSHA-256が公開予定byteと全件一致することを確認した。Chrome相当環境では設定画面、hardのAI先手着手、診断表示、サイト由来console errorなしを確認した。

この確認は公開sourceの一致と単一の運用経路の健全性を示す。スマートフォン実機、端末横断の速度、標準500ms対局棋力を追加で証明するものではない。Cloudflareのprovider deployment IDは取得していないため記録しない。詳細は[公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md)を参照する。

## 状態更新規則

main統合前は`NOT-YET-DEPLOYED`、main統合後で配信確認前は`DEPLOYMENT-PENDING`、配信assetとブラウザーgate通過後は`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`と記録する。正式な`ADOPT`、release ID発行、`AI-GEN3`昇格には別の明示的判断を必要とする。

## 正式release

2026年9月7日の明示的判断により、`PBAI-C011-v1`を`ADOPT`し、`AI-GEN3-RELEASE-001`を発行し、公開AI系統を`AI-GEN3`へ昇格した。機械可読の正本は[release manifest](releases/AI-GEN3-RELEASE-001.json)、判断根拠は[AI-GEN3正式昇格判断](PROMOTION_DECISION.md)とする。

正式判断時点で候補の公開default配備と実サイト確認は完了している。ゲーム画面の「AI · AI-GEN3」表示とPWA cache v26は、昇格を利用者へ明示する追加配信であり、AI本体の計算内容を変更しない。この追加配信が確認されるまでは`UI-DISCLOSURE-DEPLOYMENT-PENDING`とする。
